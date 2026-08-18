(function initializeAniFeedbackRuntime(root, factory) {
  "use strict";

  const api = factory(root || globalThis);
  if (root && typeof root === "object") root.ANIFeedback = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis, function createAniFeedbackModule(defaultHost) {
  "use strict";

  const SCHEMA_VERSION = 1;
  const DATABASE_NAME = "ani-feedback-outbox-v1";
  const DATABASE_VERSION = 1;
  const OUTBOX_STORE = "outbox";
  const META_STORE = "meta";
  const SEARCH_DEDUPE_KEY = "search-dedupe-v1";
  const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
  const ITEM_TYPES = new Set(["manual_report", "search_miss_batch"]);
  const ITEM_STATUSES = new Set(["queued", "sending", "retry-wait", "needs-verification", "failed", "acknowledged-purge-pending"]);
  const LEGAL_TERMS_VERSION = "2026-08-17.1";
  const LEGAL_DATA_USE_VERSION = "2026-08-17.1";
  const LEGAL_DOCUMENT_SHA256 = "bb04d1f144713330cff2211e47b06c5147499fcd8bf2cb834a59cef580f9ceea";
  const DEFAULTS = Object.freeze({
    feedbackApiUrl: "",
    catalogFingerprint: "",
    appVersion: "",
    surface: "web",
    manualReportPath: "/v1/reports",
    searchMissPath: "/v1/search-misses/batch",
    maxItems: 100,
    maxOutboxBytes: 16 * 1024 * 1024,
    maxItemAgeMs: 30 * 24 * 60 * 60 * 1000,
    maxAttempts: 8,
    maxFlushItems: 10,
    baseRetryMs: 5 * 1000,
    maxRetryMs: 6 * 60 * 60 * 1000,
    retryJitterRatio: 0.2,
    requestTimeoutMs: 20 * 1000,
    searchDedupeWindowMs: 24 * 60 * 60 * 1000,
    maxSearchDedupeEntries: 500,
    maxSearchBatchSize: 10,
    minStableSearchMs: 1000,
    maxManualMessageChars: 4000,
    maxSearchQueryChars: 240,
    maxScreenshotSourceBytes: 12 * 1024 * 1024,
    maxScreenshotBytes: 768 * 1024,
    maxScreenshotDimension: 1600,
    maxScreenshotSourcePixels: 40 * 1000 * 1000,
    autoStart: false,
    legalConsentProvider: null,
    verificationTokenProvider: null,
    fetch: null
  });

  function cleanText(value, maximum = 4000) {
    return String(value == null ? "" : value)
      .replace(/\u0000/g, "")
      .trim()
      .slice(0, maximum);
  }

  function cleanToken(value, maximum = 80) {
    return cleanText(value, maximum)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, maximum);
  }

  function normalizedSurface(value) {
    const surface = cleanToken(value, 32);
    return new Set(["android", "android-app", "apk", "native", "capacitor"]).has(surface) ? "android" : "web";
  }

  function catalogFingerprint(value) {
    const fingerprint = cleanText(value, 65).toLowerCase();
    return /^[a-f0-9]{64}$/.test(fingerprint) ? fingerprint : "";
  }

  function validConsentTimestamp(value) {
    const text = cleanText(value, 40);
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(text)
      && Number.isFinite(Date.parse(text));
  }

  function normalizeConsentProof(value, { requireDataConsent = true } = {}) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Current ANI Terms and data-use consent are required before feedback can be collected.");
    }
    const exactKeys = [
      "terms_version", "notice_version", "document_sha256", "terms_accepted_at",
      "data_use_version", "data_collection_confirmed", "data_sharing_confirmed", "data_consent_at"
    ];
    const keys = Object.keys(value).sort();
    if (keys.length !== exactKeys.length || exactKeys.slice().sort().some((key, index) => keys[index] !== key)) {
      throw new Error("ANI refused an invalid consent proof.");
    }
    const proof = {
      terms_version: cleanText(value.terms_version, 40),
      notice_version: cleanText(value.notice_version, 40),
      document_sha256: cleanText(value.document_sha256, 64).toLowerCase(),
      terms_accepted_at: cleanText(value.terms_accepted_at, 40),
      data_use_version: cleanText(value.data_use_version, 40),
      data_collection_confirmed: value.data_collection_confirmed === true,
      data_sharing_confirmed: value.data_sharing_confirmed === true,
      data_consent_at: value.data_consent_at == null ? null : cleanText(value.data_consent_at, 40)
    };
    if (proof.terms_version !== LEGAL_TERMS_VERSION
        || proof.notice_version !== LEGAL_DATA_USE_VERSION
        || proof.data_use_version !== LEGAL_DATA_USE_VERSION
        || proof.document_sha256 !== LEGAL_DOCUMENT_SHA256
        || !validConsentTimestamp(proof.terms_accepted_at)) {
      throw new Error("Current ANI Terms and data-use consent are required before feedback can be collected.");
    }
    if (requireDataConsent && (!proof.data_collection_confirmed
        || !proof.data_sharing_confirmed
        || !validConsentTimestamp(proof.data_consent_at))) {
      throw new Error("Separate data-collection and restricted-sharing consent are required before feedback can be collected.");
    }
    if (!requireDataConsent) {
      proof.data_collection_confirmed = false;
      proof.data_sharing_confirmed = false;
      proof.data_consent_at = null;
    }
    return proof;
  }

  function clientEventIdentifier(value, prefix, createIdentifier) {
    const candidate = cleanText(value, 160);
    return /^[A-Za-z0-9][A-Za-z0-9_-]{15,159}$/.test(candidate)
      ? candidate
      : createIdentifier(prefix);
  }

  function privacySafeText(value, maximum) {
    if (personalLikeQuery(value)) return "";
    const redacted = redactSensitiveText(value, maximum);
    return personalLikeQuery(redacted.text) ? "" : redacted.text;
  }

  function cleanPath(value, maximum = 500) {
    const source = cleanText(value, maximum * 2);
    if (!source) return "";
    try {
      const parsed = new URL(source, "https://ani.local/");
      return cleanText(parsed.pathname.replace(/\/{2,}/g, "/"), maximum) || "/";
    } catch (_error) {
      return cleanText(source.split(/[?#]/, 1)[0].replace(/\/{2,}/g, "/"), maximum);
    }
  }

  function redactSensitiveText(value, maximum) {
    const boundedMaximum = Math.max(0, Number(maximum) || 0);
    const scanLimit = Math.max(boundedMaximum, Math.min(16384, boundedMaximum + 4096));
    let text = cleanText(value, scanLimit);
    let redactions = 0;
    const replace = (pattern, label) => {
      text = text.replace(pattern, () => {
        redactions += 1;
        return label;
      });
    };
    replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted-email]");
    replace(/\b(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/g, "[redacted-phone]");
    replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[redacted-identifier]");
    replace(/\b(?:mrn|medical\s+record(?:\s+number)?|patient\s+id)\s*[:#-]?\s*[a-z0-9-]{4,}\b/gi, "[redacted-medical-identifier]");
    replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[redacted-ip]");
    replace(/(?<![a-f0-9:])(?:(?:[a-f0-9]{1,4}:){7}[a-f0-9]{1,4}|(?:[a-f0-9]{1,4}:){1,7}:[a-f0-9:]*|::(?:[a-f0-9]{1,4}:){0,6}[a-f0-9]{1,4})(?![a-f0-9:])/gi, "[redacted-ip]");
    replace(/\b(?:(?:account|user|member|customer|profile)[ _-]?(?:id|identifier|number)|(?:user[ _-]?name|username|login))\s*[:#=/-]?\s*[a-z0-9][a-z0-9._-]{2,}\b/gi, "[redacted-account-identifier]");
    replace(/\b(?:\d[ -]?){12,18}\d\b/g, "[redacted-payment-card]");
    replace(/\b\d{1,6}\s+(?:[a-z0-9.'-]+\s+){0,5}(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|circle|cir|parkway|pkwy|highway|hwy|place|pl|terrace|ter|way)\b(?:[ ,]+(?:apt|apartment|unit|suite|#)\s*[a-z0-9-]+)?(?:,\s*(?:[a-z][a-z .'-]{1,40},\s*)?[a-z]{2}\s+\d{5}(?:-\d{4})?)?/gi, "[redacted-postal-address]");
    replace(/\bp\.?\s*o\.?\s+box\s+\d{1,10}\b/gi, "[redacted-postal-address]");
    replace(/^[ \t]*(?:>\s*)?(?:user|assistant|system|developer|bot|chatgpt|ani)[ \t]*:[^\r\n]*/gim, "[redacted-chat-history]");
    replace(/^[ \t]*(?:chat|conversation|message)[ _-]?(?:history|transcript)[ \t]*[:=-]?[^\r\n]*/gim, "[redacted-chat-history]");
    replace(/\bbearer\s+[a-z0-9._~+/-]{8,}={0,2}\b/gi, "[redacted-secret]");
    replace(/\b(?:api[ _-]?key|access[ _-]?token|refresh[ _-]?token|authorization|cookie|session[ _-]?id|password)\s*[:=]\s*[^\s,;]{4,}/gi, "[redacted-secret]");
    return { text: cleanText(text, boundedMaximum), redactions };
  }

  function normalizeSearchQuery(value, maximum = DEFAULTS.maxSearchQueryChars) {
    return cleanText(value, maximum)
      .normalize("NFKC")
      .replace(/\s+/g, " ");
  }

  function personalLikeQuery(value) {
    const text = normalizeSearchQuery(value);
    if (!text) return false;
    return /\b(?:my|mine|me|i\s+am|i'm|my\s+(?:mom|mother|dad|father|child|son|daughter|patient))\b/i.test(text)
      || /\b(?:mrn|medical\s+record|patient\s+id|ssn|social\s+security|date\s+of\s+birth|dob|home\s+address|phone\s+number|email\s+address)\b/i.test(text)
      || /\b\d{1,3}\s*(?:years?\s*old|y\/?o)\b/i.test(text)
      || /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
      || /(?:https?:\/\/|www\.)/i.test(text)
      || /(?:\D|^)\d(?:[\s().-]*\d){6,}(?:\D|$)/.test(text);
  }

  function searchMissDecision(input = {}, options = {}) {
    const maximumQueryChars = options.maxSearchQueryChars || DEFAULTS.maxSearchQueryChars;
    const rawQuery = cleanText(input.query, maximumQueryChars + 1);
    if (rawQuery.length > maximumQueryChars) return { accepted: false, reason: "query-too-long", query: rawQuery };
    const query = normalizeSearchQuery(rawQuery, maximumQueryChars);
    if (!query) return { accepted: false, reason: "empty-query", query };
    if (query.length <= 1 || input.tinyPhoneSearch === true) return { accepted: false, reason: "query-too-short", query };
    if (personalLikeQuery(query) || redactSensitiveText(query, maximumQueryChars).redactions > 0) {
      return { accepted: false, reason: "personal-like-query", query };
    }
    if (input.isSearchMode !== true) return { accepted: false, reason: "not-search-mode", query };
    if (input.renderComplete !== true) return { accepted: false, reason: "render-incomplete", query };
    if (input.requestGenerationMatches !== true || input.transient === true || input.isComposing === true) {
      return { accepted: false, reason: "transient-search", query };
    }
    if (input.favoritesOnly === true || input.categoryOnly === true || input.browseMode === true) {
      return { accepted: false, reason: "filtered-or-browse-state", query };
    }
    const trigger = cleanToken(input.trigger, 24);
    const entered = input.entered === true || trigger === "enter" || trigger === "entered";
    const stable = input.stable === true || trigger === "stable";
    if (!entered && !stable) return { accepted: false, reason: "not-explicit-or-stable", query };
    if (stable && Number(input.stableForMs || 0) < Number(options.minStableSearchMs || DEFAULTS.minStableSearchMs)) {
      return { accepted: false, reason: "not-stable-long-enough", query };
    }
    if (input.explicitZeroResults !== true) return { accepted: false, reason: "zero-result-not-explicit", query };
    const counts = input.resultCounts && typeof input.resultCounts === "object" ? input.resultCounts : {};
    const values = Object.values(counts).map((value) => Number(value));
    if (!values.length || values.some((value) => !Number.isFinite(value) || value !== 0)) {
      return { accepted: false, reason: "nonzero-result-count", query };
    }
    if (Number(input.totalResults) !== 0) return { accepted: false, reason: "nonzero-total", query };
    return { accepted: true, reason: "accepted", query, trigger: entered ? "entered" : "stable" };
  }

  function normalizeSearchMissObservation(input = {}, minimumStableMs = DEFAULTS.minStableSearchMs) {
    const source = input && typeof input === "object" ? input : {};
    const guards = source.guards && typeof source.guards === "object" ? source.guards : {};
    const counts = source.resultCounts && typeof source.resultCounts === "object"
      ? source.resultCounts
      : (source.result_counts && typeof source.result_counts === "object" ? source.result_counts : {});
    const totalResults = Object.values(counts).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
    const clinical = source.clinicalSearch && typeof source.clinicalSearch === "object"
      ? source.clinicalSearch
      : (source.clinical_search && typeof source.clinical_search === "object" ? source.clinical_search : {});
    const entered = source.entered === true || source.explicit_enter === true || ["enter", "entered"].includes(cleanToken(source.trigger, 24));
    const stable = source.stable === true || source.stable_zero_result === true || cleanToken(source.trigger, 24) === "stable";
    return {
      ...source,
      query: source.query,
      trigger: entered ? "entered" : (stable ? "stable" : source.trigger),
      entered,
      stable,
      stableForMs: Number(source.stableForMs || source.stable_for_ms || (source.stable_zero_result === true ? minimumStableMs : 0)),
      isSearchMode: source.isSearchMode === undefined ? Boolean(cleanText(source.query, 2)) : source.isSearchMode === true,
      renderComplete: source.renderComplete === undefined ? source.kind === "search_miss" : source.renderComplete === true,
      requestGenerationMatches: source.requestGenerationMatches === undefined
        ? guards.transient_generation !== true
        : source.requestGenerationMatches === true,
      transient: source.transient === true || guards.transient_generation === true,
      favoritesOnly: source.favoritesOnly === true || guards.favorites_only === true,
      tinyPhoneSearch: source.tinyPhoneSearch === true || guards.tiny_search === true,
      browseMode: source.browseMode === true || guards.microbiology_browse === true,
      categoryOnly: source.categoryOnly === true || guards.category_only === true,
      explicitZeroResults: source.explicitZeroResults === true
        || (source.kind === "search_miss" && totalResults === 0 && (entered || stable)),
      totalResults: source.totalResults === undefined ? totalResults : source.totalResults,
      resultCounts: counts,
      correctedQuery: source.correctedQuery || source.corrected_query,
      phoneticQuery: source.phoneticQuery || source.phonetic_query,
      unmatchedClues: source.unmatchedClues || source.unmatched_clues || clinical.unmatchedClues || clinical.unmatched_clues || []
    };
  }

  function shouldQueueSearchMiss(input = {}, options = {}) {
    return searchMissDecision(normalizeSearchMissObservation(input, options.minStableSearchMs), options).accepted;
  }

  function cloneValue(value) {
    if (typeof structuredClone === "function") {
      try { return structuredClone(value); } catch (_error) {}
    }
    if (Array.isArray(value)) return value.map(cloneValue);
    if (value && typeof value === "object") {
      if (typeof Blob !== "undefined" && value instanceof Blob) return value;
      const copy = {};
      Object.entries(value).forEach(([key, entry]) => { copy[key] = cloneValue(entry); });
      return copy;
    }
    return value;
  }

  function canonicalStableJson(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) {
      return `[${Array.from({ length: value.length }, (_, index) => value[index] === undefined ? "null" : canonicalStableJson(value[index])).join(",")}]`;
    }
    if (value && typeof value === "object") {
      const keys = Object.keys(value).filter((key) => value[key] !== undefined).sort();
      return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalStableJson(value[key])}`).join(",")}}`;
    }
    if (typeof value === "number" && !Number.isFinite(value)) return "null";
    const encoded = JSON.stringify(value);
    if (encoded === undefined) throw new TypeError("ANI feedback request contains an unsupported JSON value.");
    return encoded;
  }

  function requestHashObject(value, omitRootKeys = []) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new TypeError("ANI feedback request hashing requires an object.");
    }
    const omitted = new Set(omitRootKeys);
    return Object.fromEntries(Object.entries(value).filter(([key]) => !omitted.has(key)));
  }

  function memoryStore() {
    const items = new Map();
    const meta = new Map();
    return {
      async list() { return Array.from(items.values()).map(cloneValue); },
      async get(id) { return cloneValue(items.get(id) || null); },
      async put(item) { items.set(item.client_event_id, cloneValue(item)); return cloneValue(item); },
      async remove(id) { items.delete(id); },
      async getMeta(key) { return cloneValue(meta.get(key)); },
      async setMeta(key, value) { meta.set(key, cloneValue(value)); },
      async removeMeta(key) { meta.delete(key); },
      async putRaw(value) { items.set(value && value.client_event_id || `corrupt-${items.size}`, cloneValue(value)); },
      async clear() { items.clear(); meta.clear(); }
    };
  }

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB request failed."));
    });
  }

  function indexedDbStore(host) {
    const unavailable = !host || !host.indexedDB;
    let openPromise = null;

    function open() {
      if (unavailable) return Promise.reject(new Error("Durable IndexedDB feedback storage is unavailable."));
      if (openPromise) return openPromise;
      openPromise = new Promise((resolve, reject) => {
        const request = host.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        request.onupgradeneeded = () => {
          const database = request.result;
          if (!database.objectStoreNames.contains(OUTBOX_STORE)) {
            const store = database.createObjectStore(OUTBOX_STORE, { keyPath: "client_event_id" });
            store.createIndex("created_at", "created_at", { unique: false });
          }
          if (!database.objectStoreNames.contains(META_STORE)) database.createObjectStore(META_STORE, { keyPath: "key" });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("ANI feedback storage could not open."));
        request.onblocked = () => reject(new Error("ANI feedback storage upgrade is blocked."));
      }).catch((error) => { openPromise = null; throw error; });
      return openPromise;
    }

    async function transaction(storeName, mode, operation) {
      const database = await open();
      const transactionValue = database.transaction(storeName, mode);
      const store = transactionValue.objectStore(storeName);
      const result = await operation(store);
      await new Promise((resolve, reject) => {
        transactionValue.oncomplete = resolve;
        transactionValue.onerror = () => reject(transactionValue.error || new Error("IndexedDB transaction failed."));
        transactionValue.onabort = () => reject(transactionValue.error || new Error("IndexedDB transaction was aborted."));
      });
      return result;
    }

    return {
      async list() {
        const records = await transaction(OUTBOX_STORE, "readonly", (store) => requestResult(store.getAll()));
        return (records || []).map(cloneValue);
      },
      async get(id) {
        const value = await transaction(OUTBOX_STORE, "readonly", (store) => requestResult(store.get(id)));
        return cloneValue(value || null);
      },
      async put(item) {
        await transaction(OUTBOX_STORE, "readwrite", (store) => requestResult(store.put(item)));
        return cloneValue(item);
      },
      async remove(id) {
        await transaction(OUTBOX_STORE, "readwrite", (store) => requestResult(store.delete(id)));
        const remaining = await transaction(OUTBOX_STORE, "readonly", (store) => requestResult(store.get(id)));
        if (remaining !== undefined) throw new Error("ANI feedback storage did not confirm deletion.");
      },
      async getMeta(key) {
        const record = await transaction(META_STORE, "readonly", (store) => requestResult(store.get(key)));
        return cloneValue(record && record.value);
      },
      async setMeta(key, value) {
        await transaction(META_STORE, "readwrite", (store) => requestResult(store.put({ key, value })));
      },
      async removeMeta(key) {
        await transaction(META_STORE, "readwrite", (store) => requestResult(store.delete(key)));
      },
      async putRaw(value) {
        await transaction(OUTBOX_STORE, "readwrite", (store) => requestResult(store.put(value)));
      },
      clear: async () => {
        await transaction(OUTBOX_STORE, "readwrite", (store) => requestResult(store.clear()));
        await transaction(META_STORE, "readwrite", (store) => requestResult(store.clear()));
      }
    };
  }

  function createRuntime(dependencies = {}) {
    const host = dependencies.host || defaultHost || globalThis;
    const now = typeof dependencies.now === "function" ? dependencies.now : () => Date.now();
    const random = typeof dependencies.random === "function" ? dependencies.random : Math.random;
    const store = dependencies.store || indexedDbStore(host);
    const listeners = new Set();
    let currentConfig = { ...DEFAULTS };
    let flushPromise = null;
    let scheduledTimer = null;
    let destroyed = false;
    let nativeReadyPromise = Promise.resolve(null);
    let nativeMigrationPromise = Promise.resolve();

    function nativeQueuePlugin() {
      const capacitor = host && host.Capacitor;
      const plugin = capacitor && capacitor.Plugins && capacitor.Plugins.AniFeedbackQueue;
      return plugin && typeof plugin === "object" ? plugin : null;
    }

    function requiresNativeQueue() {
      return currentConfig.surface === "android";
    }

    async function requireNativeQueue() {
      if (!requiresNativeQueue()) return null;
      const plugin = await nativeReadyPromise;
      if (!plugin || typeof plugin.enqueue !== "function") {
        throw new Error("ANI's encrypted Android feedback queue is unavailable in this build.");
      }
      return plugin;
    }

    function base64Bytes(bytes) {
      const encode = host && host.btoa || (typeof btoa === "function" ? btoa : null);
      if (typeof encode !== "function") throw new Error("Android feedback attachment encoding is unavailable.");
      let output = "";
      const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
      for (let offset = 0; offset < view.length; offset += 0x8000) {
        output += String.fromCharCode(...view.subarray(offset, Math.min(view.length, offset + 0x8000)));
      }
      return encode(output);
    }

    async function nativeSerializableItem(item) {
      const attachment = item && item.attachment;
      const serializedAttachment = attachment ? {
        media_type: attachment.media_type,
        size_bytes: attachment.size_bytes,
        width: attachment.width,
        height: attachment.height,
        sha256: attachment.sha256,
        filename: attachment.filename,
        blob_base64: base64Bytes(await attachment.blob.arrayBuffer())
      } : null;
      return {
        schema_version: item.schema_version,
        client_event_id: item.client_event_id,
        type: item.type,
        status: "queued",
        created_at: item.created_at,
        updated_at: item.updated_at,
        attempts: Number(item.attempts || 0),
        last_error: "",
        payload: cloneValue(item.payload),
        attachment: serializedAttachment
      };
    }

    async function nativeEnqueue(item) {
      const plugin = await requireNativeQueue();
      const result = await plugin.enqueue({ item: await nativeSerializableItem(item) });
      if (!result || result.queued !== true || result.durable !== true
        || cleanText(result.client_event_id, 160) !== item.client_event_id) {
        throw new Error("ANI did not confirm durable Android feedback storage.");
      }
      emit(result.deduped ? "deduped" : "queued", item, { durable: true, native: true });
      return {
        queued: true,
        deduped: result.deduped === true,
        durable: true,
        client_event_id: item.client_event_id,
        item: cloneValue(result.item || {
          client_event_id: item.client_event_id,
          type: item.type,
          status: "queued",
          created_at: item.created_at,
          updated_at: item.updated_at
        })
      };
    }

    async function migrateLegacyNativeOutbox(plugin) {
      if (!plugin || typeof plugin.enqueue !== "function") return;
      let legacy;
      try { legacy = await store.list(); } catch (_error) { return; }
      for (const item of Array.isArray(legacy) ? legacy : []) {
        if (!validStoredItem(item)) {
          try { await store.remove(item && item.client_event_id || ""); } catch (_error) {}
          emit("corrupt-dropped", item || null, { reason: "stale-or-invalid-consent" });
          continue;
        }
        if (item.status === "acknowledged-purge-pending") {
          try { await store.remove(item.client_event_id); } catch (_error) {}
          continue;
        }
        try {
          const result = await plugin.enqueue({ item: await nativeSerializableItem(item) });
          if (result && result.queued === true && result.durable === true
            && cleanText(result.client_event_id, 160) === item.client_event_id) {
            await store.remove(item.client_event_id);
            emit("migrated-native", item, { durable: true });
          }
        } catch (_error) {
          // The original IndexedDB record remains authoritative until the native
          // plugin confirms its own durable atomic write.
        }
      }
    }

    function identifier(prefix = "ani-feedback") {
      const randomUuid = host && host.crypto && typeof host.crypto.randomUUID === "function"
        ? host.crypto.randomUUID()
        : (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "");
      return randomUuid || `${prefix}-${now().toString(36)}-${Math.floor(random() * 0x100000000).toString(36)}`;
    }

    function timestamp(milliseconds = now()) {
      return new Date(milliseconds).toISOString();
    }

    function emit(type, item, detail = {}) {
      const event = Object.freeze({
        type,
        clientEventId: cleanText(item && item.client_event_id || detail.clientEventId, 160),
        itemType: cleanText(item && item.type, 40),
        status: cleanText(item && item.status || detail.status, 40),
        at: timestamp(),
        detail: Object.freeze({ ...detail, clientEventId: undefined, status: undefined })
      });
      listeners.forEach((listener) => {
        try { listener(event); } catch (_error) {}
      });
      try {
        if (host && typeof host.dispatchEvent === "function" && typeof host.CustomEvent === "function") {
          host.dispatchEvent(new host.CustomEvent("ani-feedback-status", { detail: event }));
        }
      } catch (_error) {}
      return event;
    }

    function publicConfig() {
      return Object.freeze({
        feedbackApiUrl: currentConfig.feedbackApiUrl,
        catalogFingerprint: currentConfig.catalogFingerprint,
        appVersion: currentConfig.appVersion,
        surface: currentConfig.surface,
        enabled: Boolean(currentConfig.feedbackApiUrl),
        maxItems: currentConfig.maxItems,
        maxOutboxBytes: currentConfig.maxOutboxBytes,
        maxItemAgeMs: currentConfig.maxItemAgeMs,
        maxSearchBatchSize: currentConfig.maxSearchBatchSize,
        maxScreenshotBytes: currentConfig.maxScreenshotBytes,
        autoStart: currentConfig.autoStart
      });
    }

    function normalizeApiBase(value) {
      const text = cleanText(value, 1000).replace(/\/+$/, "");
      if (!text) return "";
      const parsed = new URL(text);
      const localHttp = parsed.protocol === "http:" && /^(?:localhost|127\.0\.0\.1|\[::1\])$/i.test(parsed.hostname);
      if (parsed.protocol !== "https:" && !localHttp) throw new Error("ANI feedback requires an HTTPS endpoint.");
      parsed.username = "";
      parsed.password = "";
      parsed.search = "";
      parsed.hash = "";
      return parsed.toString().replace(/\/+$/, "");
    }

    function positiveNumber(value, fallback, minimum, maximum) {
      const number = Number(value);
      if (!Number.isFinite(number)) return fallback;
      return Math.max(minimum, Math.min(maximum, Math.floor(number)));
    }

    function configure(options = {}) {
      const source = options && typeof options === "object" ? options : {};
      const nested = source.feedback && typeof source.feedback === "object" ? source.feedback : {};
      const merged = { ...nested, ...source };
      const catalog = merged.catalog && typeof merged.catalog === "object" ? merged.catalog : {};
      currentConfig = {
        ...currentConfig,
        feedbackApiUrl: Object.prototype.hasOwnProperty.call(merged, "feedbackApiUrl") || Object.prototype.hasOwnProperty.call(merged, "apiBaseUrl")
          ? normalizeApiBase(merged.feedbackApiUrl || merged.apiBaseUrl)
          : currentConfig.feedbackApiUrl,
        catalogFingerprint: catalogFingerprint(merged.catalogFingerprint ?? merged.contentVersion ?? catalog.content_sha256 ?? catalog.contentSha256 ?? currentConfig.catalogFingerprint),
        appVersion: cleanText(merged.appVersion ?? currentConfig.appVersion, 40),
        surface: normalizedSurface(merged.surface ?? merged.platform ?? currentConfig.surface),
        manualReportPath: cleanPath(merged.manualReportPath ?? currentConfig.manualReportPath, 160) || DEFAULTS.manualReportPath,
        searchMissPath: cleanPath(merged.searchMissPath ?? currentConfig.searchMissPath, 160) || DEFAULTS.searchMissPath,
        maxItems: positiveNumber(merged.maxItems, currentConfig.maxItems, 1, 1000),
        maxOutboxBytes: positiveNumber(merged.maxOutboxBytes, currentConfig.maxOutboxBytes, 64 * 1024, 64 * 1024 * 1024),
        maxItemAgeMs: positiveNumber(merged.maxItemAgeMs, currentConfig.maxItemAgeMs, 60 * 1000, 180 * 24 * 60 * 60 * 1000),
        maxAttempts: positiveNumber(merged.maxAttempts, currentConfig.maxAttempts, 1, 20),
        maxFlushItems: positiveNumber(merged.maxFlushItems, currentConfig.maxFlushItems, 1, 50),
        baseRetryMs: positiveNumber(merged.baseRetryMs, currentConfig.baseRetryMs, 50, 60 * 60 * 1000),
        maxRetryMs: positiveNumber(merged.maxRetryMs, currentConfig.maxRetryMs, 100, 24 * 60 * 60 * 1000),
        requestTimeoutMs: positiveNumber(merged.requestTimeoutMs, currentConfig.requestTimeoutMs, 500, 120 * 1000),
        searchDedupeWindowMs: positiveNumber(merged.searchDedupeWindowMs, currentConfig.searchDedupeWindowMs, 1000, 30 * 24 * 60 * 60 * 1000),
        maxSearchBatchSize: positiveNumber(merged.maxSearchBatchSize, currentConfig.maxSearchBatchSize, 1, DEFAULTS.maxSearchBatchSize),
        minStableSearchMs: positiveNumber(merged.minStableSearchMs, currentConfig.minStableSearchMs, 250, 10000),
        maxScreenshotBytes: positiveNumber(merged.maxScreenshotBytes, currentConfig.maxScreenshotBytes, 64 * 1024, Math.floor(1.5 * 1024 * 1024)),
        autoStart: merged.autoStart === undefined ? currentConfig.autoStart : merged.autoStart !== false,
        legalConsentProvider: typeof merged.legalConsentProvider === "function"
          ? merged.legalConsentProvider
          : (merged.legalConsentProvider === null ? null : currentConfig.legalConsentProvider),
        verificationTokenProvider: typeof merged.verificationTokenProvider === "function"
          ? merged.verificationTokenProvider
          : (merged.verificationTokenProvider === null ? null : currentConfig.verificationTokenProvider),
        fetch: typeof merged.fetch === "function" ? merged.fetch : currentConfig.fetch
      };
      emit("configured", null, { enabled: Boolean(currentConfig.feedbackApiUrl) });
      if (requiresNativeQueue()) {
        const plugin = nativeQueuePlugin();
        nativeReadyPromise = plugin && typeof plugin.configure === "function"
          ? Promise.resolve(plugin.configure({ feedbackApiUrl: currentConfig.feedbackApiUrl })).then((result) => {
            if (!result || result.available !== true || result.durable !== true) {
              throw new Error("ANI did not confirm the encrypted Android feedback queue.");
            }
            return plugin;
          })
          : Promise.reject(new Error("ANI's encrypted Android feedback queue is unavailable in this build."));
        nativeMigrationPromise = nativeReadyPromise.then((readyPlugin) => migrateLegacyNativeOutbox(readyPlugin));
        nativeReadyPromise.catch((error) => emit("native-unavailable", null, { error: errorMessage(error) }));
        nativeMigrationPromise.catch(() => {});
      }
      if (currentConfig.autoStart && currentConfig.feedbackApiUrl) scheduleFlush("configure", 0);
      return publicConfig();
    }

    function byteLength(value) {
      const text = JSON.stringify(value == null ? null : value);
      const Encoder = host && host.TextEncoder || (typeof TextEncoder !== "undefined" ? TextEncoder : null);
      return Encoder ? new Encoder().encode(text).byteLength : text.length * 2;
    }

    function itemSize(item) {
      if (item && item.status === "acknowledged-purge-pending") return byteLength(item);
      const attachmentBytes = Number(item && item.attachment && item.attachment.size_bytes || 0);
      const copy = { ...item, attachment: item && item.attachment ? { ...item.attachment, blob: undefined } : null };
      return byteLength(copy) + attachmentBytes;
    }

    function validStoredItem(item) {
      if (!item || typeof item !== "object") return false;
      if (item.schema_version !== SCHEMA_VERSION) return false;
      if (!ITEM_TYPES.has(item.type) || !ITEM_STATUSES.has(item.status)) return false;
      if (!cleanText(item.client_event_id, 160)) return false;
      if (!Number.isFinite(Date.parse(item.created_at)) || !Number.isFinite(Number(item.attempts))) return false;
      if (!Number.isFinite(Number(item.byte_size)) || Number(item.byte_size) < 0) return false;
      if (item.status === "acknowledged-purge-pending") {
        return !item.payload && !item.attachment;
      }
      if (!item.payload || typeof item.payload !== "object") return false;
      try {
        normalizeConsentProof(item.payload.consent, { requireDataConsent: true });
      } catch (_error) {
        return false;
      }
      if (item.attachment) {
        if (!ALLOWED_IMAGE_TYPES.has(item.attachment.media_type)) return false;
        if (!Number.isFinite(Number(item.attachment.size_bytes)) || Number(item.attachment.size_bytes) <= 0) return false;
        if (!item.attachment.blob || typeof item.attachment.blob.arrayBuffer !== "function") return false;
      }
      return true;
    }

    async function dropSearchDedupeForItem(item) {
      const fingerprints = (item && item.payload && Array.isArray(item.payload.events) ? item.payload.events : [])
        .map((event) => cleanText(event.dedupe_fingerprint, 160))
        .filter(Boolean);
      if (!fingerprints.length) return;
      const stored = await store.getMeta(SEARCH_DEDUPE_KEY);
      const entries = Array.isArray(stored) ? stored : [];
      const filtered = entries.filter((entry) => !fingerprints.includes(entry.fingerprint));
      await store.setMeta(SEARCH_DEDUPE_KEY, filtered);
    }

    async function pruneOutbox() {
      const records = await store.list();
      const retained = [];
      for (const record of records) {
        if (!validStoredItem(record)) {
          await store.remove(record && record.client_event_id || "");
          emit("corrupt-dropped", record || null);
          continue;
        }
        if (record.type === "search_miss_batch" && now() - Date.parse(record.created_at) > currentConfig.maxItemAgeMs) {
          await store.remove(record.client_event_id);
          await dropSearchDedupeForItem(record);
          emit("expired-dropped", record);
          continue;
        }
        retained.push(record);
      }
      return retained.sort((left, right) => Date.parse(left.created_at) - Date.parse(right.created_at));
    }

    async function enforceBounds(candidate) {
      let records = await pruneOutbox();
      const candidateBytes = itemSize(candidate);
      if (candidateBytes > currentConfig.maxOutboxBytes) {
        throw new Error("This feedback item is larger than ANI's offline outbox limit.");
      }
      const fits = () => records.length + 1 <= currentConfig.maxItems
        && records.reduce((sum, item) => sum + Number(item.byte_size || itemSize(item)), 0) + candidateBytes <= currentConfig.maxOutboxBytes;
      while (!fits()) {
        const evictIndex = records.findIndex((item) => item.type === "search_miss_batch");
        if (evictIndex < 0) break;
        const evicted = records.splice(evictIndex, 1)[0];
        await store.remove(evicted.client_event_id);
        await dropSearchDedupeForItem(evicted);
        emit("capacity-dropped", evicted);
      }
      if (!fits()) {
        if (candidate.type === "search_miss_batch") return false;
        throw new Error("ANI's offline feedback outbox is full. Retry or remove an older report first.");
      }
      candidate.byte_size = candidateBytes;
      return true;
    }

    function manualContext(input = {}) {
      const context = input.context && typeof input.context === "object" ? input.context : {};
      const topic = context.topic && typeof context.topic === "object" ? context.topic : {};
      return {
        route_path: cleanPath(input.route_path || context.route_path || "", 500),
        topic_id: privacySafeText(input.topic_id || context.topic_id || topic.stable_id, 160),
        topic_title: privacySafeText(input.topic_title || context.topic_title || topic.label, 200),
        topic_type: cleanToken(input.topic_type || context.topic_type || topic.type, 40),
        feature: cleanToken(input.feature || context.feature, 80),
        app_mode: cleanToken(input.app_mode || context.app_mode, 40),
        platform_context: cleanToken(context.platform, 40)
      };
    }

    function validatedAttachment(value) {
      if (!value) return null;
      const attachment = value.attachment || value;
      const blob = attachment.blob;
      const mediaType = cleanText(attachment.media_type || blob && blob.type, 80).toLowerCase();
      const size = Number(attachment.size_bytes || blob && blob.size || 0);
      if (!blob || typeof blob.arrayBuffer !== "function" || !ALLOWED_IMAGE_TYPES.has(mediaType)) {
        throw new Error("Use sanitizeScreenshot() before attaching a screenshot.");
      }
      if (cleanText(blob.type, 80).toLowerCase() !== mediaType || Number(blob.size) !== size
        || !/^[a-f0-9]{64}$/.test(cleanText(attachment.sha256, 64).toLowerCase())) {
        throw new Error("Use sanitizeScreenshot() before attaching a screenshot.");
      }
      if (size <= 0 || size > currentConfig.maxScreenshotBytes) {
        throw new Error(`The sanitized screenshot exceeds ANI's ${Math.round(currentConfig.maxScreenshotBytes / 1024)} KiB limit.`);
      }
      const width = Number(attachment.width || 0);
      const height = Number(attachment.height || 0);
      if (width <= 0 || height <= 0 || Math.max(width, height) > currentConfig.maxScreenshotDimension) {
        throw new Error("The sanitized screenshot dimensions are invalid.");
      }
      return {
        blob,
        media_type: mediaType,
        size_bytes: size,
        width,
        height,
        sha256: cleanText(attachment.sha256, 64).toLowerCase(),
        filename: mediaType === "image/webp" ? "ani-report-screenshot.webp" : "ani-report-screenshot.jpg"
      };
    }

    async function queueManualReport(input = {}) {
      const report = input.report && typeof input.report === "object" ? input.report : input;
      if (report.privacy_confirmed !== true) {
        throw new Error("Confirm that the report and screenshot contain no patient-identifying information before sending.");
      }
      const redacted = redactSensitiveText(report.message, currentConfig.maxManualMessageChars);
      const redactedSubject = redactSensitiveText(report.subject, 180);
      if (!redacted.text) throw new Error("Report text is required.");
      const consent = consentForQueue("manual_report", report.consent || input.consent);
      const attachment = validatedAttachment(input.screenshot || input.attachment || null);
      const clientEventId = clientEventIdentifier(report.client_event_id || input.client_event_id, "ani-feedback", identifier);
      if (!requiresNativeQueue()) {
        const existing = await store.get(clientEventId);
        if (existing) return { queued: true, deduped: true, client_event_id: clientEventId, item: cloneValue(existing) };
      }
      const payload = {
        schema_version: SCHEMA_VERSION,
        client_event_id: clientEventId,
        kind: cleanToken(report.kind || "user_report", 40) || "user_report",
        category: cleanToken(report.category || "other", 60) || "other",
        severity: cleanToken(report.severity || "normal", 24) || "normal",
        subject: redactedSubject.text,
        message: redacted.text,
        privacy_redactions: redacted.redactions + redactedSubject.redactions,
        privacy_confirmed: report.privacy_confirmed === true,
        consent,
        app: {
          surface: currentConfig.surface,
          version: currentConfig.appVersion,
          catalog_fingerprint: currentConfig.catalogFingerprint
        },
        context: manualContext(report),
        attachment: attachment ? {
          requested: true,
          media_type: attachment.media_type,
          size_bytes: attachment.size_bytes,
          width: attachment.width,
          height: attachment.height,
          sha256: attachment.sha256
        } : null,
        occurred_at: timestamp()
      };
      const item = {
        schema_version: SCHEMA_VERSION,
        client_event_id: clientEventId,
        type: "manual_report",
        status: "queued",
        created_at: timestamp(),
        updated_at: timestamp(),
        attempts: 0,
        next_attempt_at: now(),
        last_error: "",
        last_http_status: 0,
        payload,
        attachment
      };
      if (requiresNativeQueue()) return nativeEnqueue(item);
      if (!await enforceBounds(item)) return { queued: false, reason: "capacity" };
      await store.put(item);
      emit("queued", item, { hasAttachment: Boolean(attachment) });
      if (currentConfig.autoStart) scheduleFlush("manual-report", 0);
      return { queued: true, deduped: false, client_event_id: clientEventId, item: cloneValue(item) };
    }

    async function digestBytes(bytes, requireCryptographic = false) {
      const cryptoObject = host && host.crypto || (typeof crypto !== "undefined" ? crypto : null);
      if (cryptoObject && cryptoObject.subtle) {
        const digest = await cryptoObject.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
      }
      if (requireCryptographic) throw new Error("Secure screenshot hashing is unavailable on this device.");
      const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
      let first = 2166136261;
      let second = 2246822519;
      for (let index = 0; index < view.length; index += 1) {
        first = Math.imul(first ^ view[index], 16777619) >>> 0;
        second = Math.imul(second ^ view[index], 3266489917) >>> 0;
      }
      return `${first.toString(16).padStart(8, "0")}${second.toString(16).padStart(8, "0")}`;
    }

    async function digestHex(value) {
      const text = cleanText(value, 2000);
      const Encoder = host && host.TextEncoder || (typeof TextEncoder !== "undefined" ? TextEncoder : null);
      if (!Encoder) throw new Error("Text encoding is unavailable.");
      return digestBytes(new Encoder().encode(text), true);
    }

    async function requestSha256(value, omitRootKeys = []) {
      const Encoder = host && host.TextEncoder || (typeof TextEncoder !== "undefined" ? TextEncoder : null);
      if (!Encoder) throw new Error("Text encoding is unavailable.");
      const canonical = canonicalStableJson(requestHashObject(value, omitRootKeys));
      return digestBytes(new Encoder().encode(canonical), true);
    }

    async function searchDedupeEntries() {
      const cutoff = now() - currentConfig.searchDedupeWindowMs;
      const stored = await store.getMeta(SEARCH_DEDUPE_KEY);
      return (Array.isArray(stored) ? stored : [])
        .filter((entry) => entry && cleanText(entry.fingerprint, 160) && Number(entry.at) >= cutoff)
        .sort((left, right) => Number(right.at) - Number(left.at))
        .slice(0, currentConfig.maxSearchDedupeEntries);
    }

    async function queueSearchMiss(input = {}) {
      return queueSearchMissBatch([input]);
    }

    async function queueSearchMissBatch(inputs = []) {
      const rawInputs = Array.isArray(inputs) ? inputs.slice(0, currentConfig.maxSearchBatchSize) : [];
      const consent = consentForQueue("search_miss_batch", rawInputs[0] && rawInputs[0].consent);
      if (rawInputs.some((input) => canonicalStableJson(input && input.consent) !== canonicalStableJson(rawInputs[0] && rawInputs[0].consent))) {
        throw new Error("ANI refused a search batch with inconsistent consent proof.");
      }
      if (!currentConfig.catalogFingerprint) {
        emit("rejected", null, { reason: "catalog-fingerprint-unavailable", rejected: Array.isArray(inputs) ? inputs.length : 0 });
        return { queued: false, reason: "catalog-fingerprint-unavailable", accepted: 0, rejected: Array.isArray(inputs) ? inputs.length : 0 };
      }
      const candidates = rawInputs.map((input) => normalizeSearchMissObservation(input, currentConfig.minStableSearchMs));
      if (!candidates.length) return { queued: false, reason: "empty-batch", accepted: 0, rejected: 0 };
      // Android's encrypted no-backup store is the authoritative outbox. Its
      // availability must never depend on WebView IndexedDB; the latter is read
      // only by the best-effort legacy migration performed during configure.
      const dedupe = requiresNativeQueue() ? [] : await searchDedupeEntries();
      const fingerprints = new Set(dedupe.map((entry) => entry.fingerprint));
      const events = [];
      const rejections = [];
      for (const candidate of candidates) {
        const decision = searchMissDecision(candidate, currentConfig);
        if (!decision.accepted) {
          rejections.push({ reason: decision.reason });
          continue;
        }
        const fingerprint = await digestHex(`${decision.query.toLowerCase()}\n${currentConfig.catalogFingerprint}\nwhole-encyclopedia`);
        if (fingerprints.has(fingerprint)) {
          rejections.push({ reason: "deduped" });
          continue;
        }
        fingerprints.add(fingerprint);
        const counts = {};
        Object.entries(candidate.resultCounts || {}).slice(0, 12).forEach(([key, value]) => {
          const token = cleanToken(key, 40);
          if (token) counts[token] = Number(value) || 0;
        });
        events.push({
          schema_version: SCHEMA_VERSION,
          client_event_id: clientEventIdentifier(candidate.client_event_id, "ani-search-miss", identifier),
          query: decision.query,
          normalized_query: decision.query.toLowerCase(),
          dedupe_fingerprint: fingerprint,
          trigger: decision.trigger,
          explicit_zero_results: true,
          total_results: 0,
          result_counts: counts,
          corrected_query: privacySafeText(candidate.correctedQuery, currentConfig.maxSearchQueryChars),
          phonetic_query: privacySafeText(candidate.phoneticQuery, currentConfig.maxSearchQueryChars),
          unmatched_clues: Array.isArray(candidate.unmatchedClues)
            ? candidate.unmatchedClues.map((value) => privacySafeText(value, 80)).filter(Boolean).slice(0, 6)
            : [],
          occurred_at: timestamp()
        });
      }
      if (!events.length) {
        const reason = rejections.some((entry) => entry.reason === "deduped") ? "deduped" : rejections[0] && rejections[0].reason || "rejected";
        emit(reason === "deduped" ? "deduped" : "rejected", null, { reason, rejected: rejections.length });
        return { queued: false, reason, accepted: 0, rejected: rejections.length };
      }
      const batchId = identifier("ani-search-batch");
      const payload = {
        schema_version: SCHEMA_VERSION,
        batch_id: batchId,
        app: {
          surface: currentConfig.surface,
          version: currentConfig.appVersion,
          catalog_fingerprint: currentConfig.catalogFingerprint
        },
        consent,
        events
      };
      const item = {
        schema_version: SCHEMA_VERSION,
        client_event_id: batchId,
        type: "search_miss_batch",
        status: "queued",
        created_at: timestamp(),
        updated_at: timestamp(),
        attempts: 0,
        next_attempt_at: now(),
        last_error: "",
        last_http_status: 0,
        payload,
        attachment: null
      };
      if (requiresNativeQueue()) return nativeEnqueue(item);
      if (!await enforceBounds(item)) {
        emit("capacity-rejected", item);
        return { queued: false, reason: "capacity", accepted: 0, rejected: candidates.length };
      }
      await store.put(item);
      const additions = events.map((event) => ({ fingerprint: event.dedupe_fingerprint, at: now(), client_event_id: event.client_event_id }));
      await store.setMeta(SEARCH_DEDUPE_KEY, [...additions, ...dedupe].slice(0, currentConfig.maxSearchDedupeEntries));
      emit("queued", item, { accepted: events.length, rejected: rejections.length });
      if (currentConfig.autoStart) scheduleFlush("search-miss", 0);
      return { queued: true, client_event_id: batchId, accepted: events.length, rejected: rejections.length, item: cloneValue(item) };
    }

    function online() {
      return !(host && host.navigator && host.navigator.onLine === false);
    }

    function retryAfterMilliseconds(response) {
      const raw = response && response.headers && typeof response.headers.get === "function"
        ? cleanText(response.headers.get("Retry-After"), 100)
        : "";
      if (!raw) return 0;
      if (/^\d+(?:\.\d+)?$/.test(raw)) return Math.max(0, Math.ceil(Number(raw) * 1000));
      const date = Date.parse(raw);
      return Number.isFinite(date) ? Math.max(0, date - now()) : 0;
    }

    function retryDelay(attempt, retryAfterMs = 0) {
      const exponential = Math.min(currentConfig.maxRetryMs, currentConfig.baseRetryMs * (2 ** Math.max(0, attempt - 1)));
      const jitter = exponential * currentConfig.retryJitterRatio * ((random() * 2) - 1);
      return Math.max(retryAfterMs, Math.max(currentConfig.baseRetryMs, Math.round(exponential + jitter)));
    }

    function errorMessage(value) {
      return cleanText(value && value.message || value || "ANI feedback could not be sent.", 300);
    }

    async function fetchWithTimeout(url, options) {
      const fetchFunction = currentConfig.fetch || dependencies.fetch || host && host.fetch;
      if (typeof fetchFunction !== "function") throw new Error("Feedback transport is unavailable.");
      const Controller = host && host.AbortController || (typeof AbortController !== "undefined" ? AbortController : null);
      const controller = Controller ? new Controller() : null;
      let timeoutId = null;
      if (controller && currentConfig.requestTimeoutMs > 0) {
        timeoutId = (host && host.setTimeout || setTimeout)(() => controller.abort(), currentConfig.requestTimeoutMs);
      }
      try {
        return await fetchFunction(url, { ...options, signal: controller && controller.signal, credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer" });
      } finally {
        if (timeoutId !== null) (host && host.clearTimeout || clearTimeout)(timeoutId);
      }
    }

    function endpoint(pathname) {
      if (!currentConfig.feedbackApiUrl) throw new Error("ANI feedback is not configured.");
      return new URL(pathname, `${currentConfig.feedbackApiUrl}/`).toString();
    }

    async function responseData(response) {
      if (!response || typeof response.json !== "function") return {};
      try { return await response.json(); } catch (_error) { return {}; }
    }

    function validUuid(value) {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cleanText(value, 40));
    }

    function validSha256(value) {
      return /^[a-f0-9]{64}$/i.test(cleanText(value, 64));
    }

    function requireDurableReceipt(data) {
      const collectionState = cleanText(data && data.collection_state, 32);
      const isDurableState = collectionState === "regular"
        || (data && data.duplicate === true && ["trash", "trash_deleted"].includes(collectionState));
      if (!data || data.accepted !== true || data.durable !== true || !isDurableState) {
        const error = new Error("ANI did not return a proven durable collection receipt.");
        error.retryable = true;
        throw error;
      }
    }

    function validateManualReceipt(item, data, expectedRequestSha256) {
      requireDurableReceipt(data);
      if (cleanText(data.client_event_id, 160) !== item.client_event_id || !validUuid(data.report_id)
        || !validSha256(data.payload_sha256) || !validSha256(data.request_sha256)
        || cleanText(data.request_sha256, 64).toLowerCase() !== expectedRequestSha256) {
        const error = new Error("ANI returned a mismatched report receipt.");
        error.retryable = true;
        throw error;
      }
      return data;
    }

    function validateBatchReceipt(item, data, expectedRequestSha256) {
      requireDurableReceipt(data);
      const expected = Array.isArray(item.payload && item.payload.events) ? item.payload.events.length : 0;
      const reportIds = Array.isArray(data.report_ids) ? data.report_ids : [];
      if (cleanText(data.batch_id, 160) !== item.client_event_id || reportIds.length !== expected
        || reportIds.some((value) => !validUuid(value)) || new Set(reportIds.map((value) => value.toLowerCase())).size !== reportIds.length
        || !validSha256(data.payload_sha256) || !validSha256(data.request_sha256)
        || cleanText(data.request_sha256, 64).toLowerCase() !== expectedRequestSha256) {
        const error = new Error("ANI returned a mismatched search-batch receipt.");
        error.retryable = true;
        throw error;
      }
      return data;
    }

    function verificationFailure(error, response, data) {
      const text = `${errorMessage(error)} ${cleanText(data && (data.code || data.error), 300)}`;
      return /verification|turnstile|challenge|captcha/i.test(text)
        || Boolean(response && [401, 403, 422].includes(Number(response.status)) && data && data.verification_required === true);
    }

    async function verificationToken(item) {
      if (typeof currentConfig.verificationTokenProvider !== "function") {
        const error = new Error("Report verification is required before sending.");
        error.code = "verification_provider_unavailable";
        throw error;
      }
      const value = await currentConfig.verificationTokenProvider({ kind: "manual-report", clientEventId: item.client_event_id });
      const token = cleanText(value && typeof value === "object" ? value.token : value, 4096);
      const challengeNonce = cleanText(value && typeof value === "object" && (value.challengeNonce || value.challenge_nonce), 161);
      if (!token || !/^[A-Za-z0-9_-]{16,160}$/.test(challengeNonce)) {
        const error = new Error("Report verification was not completed.");
        error.code = "verification_token_missing";
        throw error;
      }
      return { token, challengeNonce };
    }

    async function uploadAttachment(item, receipt) {
      if (!item.attachment) return;
      const grant = receipt && receipt.attachment_upload;
      const uploadUrl = cleanText(grant && grant.url, 1500);
      const uploadToken = cleanText(grant && grant.grant, 4096);
      if (!uploadUrl || !uploadToken) throw new Error("The report was received, but no screenshot upload grant was returned.");
      const resolved = new URL(uploadUrl, `${currentConfig.feedbackApiUrl}/`);
      if (resolved.protocol !== "https:" && !(resolved.protocol === "http:" && /^(?:localhost|127\.0\.0\.1|\[::1\])$/i.test(resolved.hostname))) {
        throw new Error("The screenshot upload destination was rejected.");
      }
      const response = await fetchWithTimeout(resolved.toString(), {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${uploadToken}`,
          "Content-Type": item.attachment.media_type,
          "X-Content-SHA256": item.attachment.sha256
        },
        body: item.attachment.blob
      });
      if (!response.ok) {
        const data = await responseData(response);
        const error = new Error(cleanText(data.error, 300) || `Screenshot upload failed with HTTP ${response.status}.`);
        error.response = response;
        error.data = data;
        error.retryable = [401, 403, 408, 410, 425, 429].includes(Number(response.status)) || Number(response.status) >= 500;
        throw error;
      }
      const data = await responseData(response);
      if (data.accepted !== true || cleanText(data.report_id, 40) !== cleanText(receipt.report_id, 40)
        || data.attachment_state !== "ready" || data.storage_backend !== "r2") {
        const error = new Error("ANI did not return a durable attachment receipt.");
        error.response = response;
        error.data = data;
        error.retryable = true;
        throw error;
      }
      return data;
    }

    async function sendManualReport(item) {
      const verification = await verificationToken(item);
      const body = {
        ...item.payload,
        verification_token: verification.token,
        challenge_nonce: verification.challengeNonce
      };
      const expectedRequestSha256 = await requestSha256(body, ["verification_token", "challenge_nonce", "submission_permit"]);
      const response = await fetchWithTimeout(endpoint(currentConfig.manualReportPath), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": item.client_event_id },
        body: JSON.stringify(body)
      });
      const data = await responseData(response);
      if (!response.ok) {
        const error = new Error(cleanText(data.error, 300) || `Report submission failed with HTTP ${response.status}.`);
        error.response = response;
        error.data = data;
        throw error;
      }
      const receipt = validateManualReceipt(item, data, expectedRequestSha256);
      await uploadAttachment(item, receipt);
      return { response, data: receipt };
    }

    async function sendSearchMissBatch(item) {
      const expectedRequestSha256 = await requestSha256(item.payload);
      const response = await fetchWithTimeout(endpoint(currentConfig.searchMissPath), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": item.client_event_id },
        body: JSON.stringify(item.payload)
      });
      const data = await responseData(response);
      if (!response.ok) {
        const error = new Error(cleanText(data.error, 300) || `Search feedback failed with HTTP ${response.status}.`);
        error.response = response;
        error.data = data;
        throw error;
      }
      return { response, data: validateBatchReceipt(item, data, expectedRequestSha256) };
    }

    async function updateFailure(item, error) {
      const response = error && error.response;
      const data = error && error.data || {};
      if (item.type === "manual_report" && verificationFailure(error, response, data)) {
        item.status = "needs-verification";
        item.last_error = errorMessage(error);
        item.last_http_status = Number(response && response.status || 0);
        item.next_attempt_at = null;
        item.updated_at = timestamp();
        await store.put(item);
        emit("needs-verification", item, { error: item.last_error });
        return;
      }
      item.attempts = Number(item.attempts || 0) + 1;
      item.last_error = errorMessage(error);
      item.last_http_status = Number(response && response.status || 0);
      item.updated_at = timestamp();
      const permanentHttpFailure = !error.retryable && response && response.status >= 400 && response.status < 500
        && ![408, 409, 425, 429].includes(response.status);
      if (item.type !== "manual_report" && (permanentHttpFailure || item.attempts >= currentConfig.maxAttempts)) {
        item.status = "failed";
        item.next_attempt_at = null;
        await store.put(item);
        emit("failed", item, { error: item.last_error, httpStatus: item.last_http_status });
        return;
      }
      const delay = retryDelay(item.attempts, retryAfterMilliseconds(response));
      item.status = "retry-wait";
      item.next_attempt_at = now() + delay;
      await store.put(item);
      emit("retry-wait", item, { error: item.last_error, retryInMs: delay, httpStatus: item.last_http_status });
    }

    async function sendItem(item) {
      if (item.status === "acknowledged-purge-pending") {
        try {
          await store.remove(item.client_event_id);
          emit("purged", item);
          return { client_event_id: item.client_event_id, status: "purged" };
        } catch (error) {
          emit("purge-pending", item, { error: errorMessage(error) });
          return { client_event_id: item.client_event_id, status: "acknowledged-purge-pending", error: errorMessage(error) };
        }
      }
      item.status = "sending";
      item.updated_at = timestamp();
      await store.put(item);
      emit("sending", item);
      try {
        const result = item.type === "manual_report" ? await sendManualReport(item) : await sendSearchMissBatch(item);
        const receiptSha256 = await digestHex(JSON.stringify(result.data || {}));
        const tombstone = {
          schema_version: SCHEMA_VERSION,
          client_event_id: item.client_event_id,
          type: item.type,
          status: "acknowledged-purge-pending",
          created_at: item.created_at,
          updated_at: timestamp(),
          attempts: Number(item.attempts || 0),
          next_attempt_at: null,
          last_error: "",
          last_http_status: Number(result.response && result.response.status || 0),
          receipt_sha256: receiptSha256,
          payload: null,
          attachment: null,
          byte_size: 0
        };
        tombstone.byte_size = itemSize(tombstone);
        await store.put(tombstone);
        emit("acknowledged", tombstone, { reportId: cleanText(result.data && result.data.report_id, 160) });
        try {
          await store.remove(item.client_event_id);
          emit("sent", tombstone, { reportId: cleanText(result.data && result.data.report_id, 160) });
          return { client_event_id: item.client_event_id, status: "sent" };
        } catch (purgeError) {
          emit("purge-pending", tombstone, { error: errorMessage(purgeError) });
          return { client_event_id: item.client_event_id, status: "acknowledged-purge-pending", error: errorMessage(purgeError) };
        }
      } catch (error) {
        await updateFailure(item, error);
        return { client_event_id: item.client_event_id, status: item.status, error: errorMessage(error) };
      }
    }

    function scheduleFlush(trigger = "scheduled", delay = 0) {
      if (destroyed || !currentConfig.autoStart) return;
      if (scheduledTimer !== null) (host && host.clearTimeout || clearTimeout)(scheduledTimer);
      scheduledTimer = (host && host.setTimeout || setTimeout)(() => {
        scheduledTimer = null;
        flush({ trigger }).catch(() => {});
      }, Math.max(0, delay));
    }

    function currentLegalConsent(itemType) {
      if (typeof currentConfig.legalConsentProvider !== "function") {
        throw new Error("ANI feedback remains locked until the current Terms and data-use choice are available.");
      }
      const search = itemType === "search_miss_batch";
      return normalizeConsentProof(
        currentConfig.legalConsentProvider(search ? "search_miss" : "manual_report"),
        { requireDataConsent: search }
      );
    }

    function consentForQueue(itemType, suppliedValue) {
      const supplied = normalizeConsentProof(suppliedValue, { requireDataConsent: true });
      const current = currentLegalConsent(itemType);
      if (itemType === "search_miss_batch") {
        if (canonicalStableJson(supplied) !== canonicalStableJson(current)) {
          throw new Error("ANI refused a search report whose consent proof is not the current full consent choice.");
        }
        return current;
      }
      const termsBindingKeys = [
        "terms_version", "notice_version", "document_sha256", "terms_accepted_at", "data_use_version"
      ];
      if (termsBindingKeys.some((key) => supplied[key] !== current[key])) {
        throw new Error("ANI refused a manual report whose Terms acceptance is not current.");
      }
      // A manual report carries its own explicit collection/sharing choice. The
      // authoritative legal provider binds the Terms acceptance, but must not
      // overwrite that separate report-specific data-consent proof.
      return supplied;
    }

    function canDeliverItem(item) {
      // Content-free acknowledgement tombstones require only local deletion;
      // they contain no feedback to transmit and must remain purgeable.
      if (item && item.status === "acknowledged-purge-pending") return true;
      try {
        const queued = normalizeConsentProof(item && item.payload && item.payload.consent, { requireDataConsent: true });
        const current = currentLegalConsent(item && item.type);
        if (item && item.type === "search_miss_batch"
            && canonicalStableJson(queued) !== canonicalStableJson(current)) {
          return false;
        }
        return true;
      } catch (_error) {
        return false;
      }
    }

    async function scheduleNextDue(records) {
      if (!currentConfig.autoStart || destroyed) return;
      const dueTimes = records
        .filter((item) => item.status === "retry-wait" && Number.isFinite(Number(item.next_attempt_at)))
        .map((item) => Number(item.next_attempt_at));
      if (!dueTimes.length) return;
      const delay = Math.max(0, Math.min(...dueTimes) - now());
      scheduleFlush("retry-timer", Math.min(delay, 60 * 1000));
    }

    async function performFlush(options = {}) {
      if (!currentConfig.feedbackApiUrl) return { status: "disabled", sent: 0, pending: (await pruneOutbox()).length, results: [] };
      if (requiresNativeQueue()) {
        try {
          currentLegalConsent("manual_report");
        } catch (_error) {
          return { status: "legal-locked", sent: 0, pending: 0, results: [] };
        }
        await nativeMigrationPromise;
        const plugin = await requireNativeQueue();
        const result = await plugin.flush({ trigger: cleanText(options.trigger, 40) });
        if (!result || result.durable !== true || !["scheduled", "complete"].includes(result.status)) {
          throw new Error("ANI did not confirm durable Android feedback scheduling.");
        }
        emit("flush-complete", null, { trigger: cleanText(options.trigger, 40), pending: Number(result.pending || 0), native: true });
        return {
          status: result.status,
          sent: 0,
          pending: Number(result.pending || 0),
          results: []
        };
      }
      if (!online()) {
        const records = await pruneOutbox();
        emit("offline", null, { pending: records.length });
        return { status: "offline", sent: 0, pending: records.length, results: [] };
      }
      const allowedIds = Array.isArray(options.ids) ? new Set(options.ids.map(String)) : null;
      const force = options.force === true;
      const records = await pruneOutbox();
      const due = records.filter((item) => {
        if (!canDeliverItem(item)) return false;
        if (allowedIds && !allowedIds.has(item.client_event_id)) return false;
        if (item.status === "needs-verification" || item.status === "failed") return force;
        if (item.status === "sending") return true;
        return force || !Number.isFinite(Number(item.next_attempt_at)) || Number(item.next_attempt_at) <= now();
      }).slice(0, currentConfig.maxFlushItems);
      const results = [];
      for (const item of due) results.push(await sendItem(item));
      const remaining = await pruneOutbox();
      await scheduleNextDue(remaining);
      if (remaining.some((item) => item.status === "queued" || item.status === "sending"
        || (item.status === "retry-wait" && Number(item.next_attempt_at) <= now()))) {
        scheduleFlush("flush-backlog", 100);
      }
      emit("flush-complete", null, { trigger: cleanText(options.trigger, 40), attempted: results.length, pending: remaining.length });
      return { status: "complete", sent: results.filter((result) => result.status === "sent").length, pending: remaining.length, results };
    }

    async function flush(options = {}) {
      if (flushPromise) return flushPromise;
      flushPromise = performFlush(options).finally(() => { flushPromise = null; });
      return flushPromise;
    }

    async function listOutbox() {
      if (requiresNativeQueue()) {
        await nativeMigrationPromise;
        const plugin = await requireNativeQueue();
        const result = await plugin.list();
        if (!result || result.durable !== true || !Array.isArray(result.items)) {
          throw new Error("ANI could not verify the encrypted Android report queue.");
        }
        return result.items.map(cloneValue);
      }
      return (await pruneOutbox()).map(cloneValue);
    }

    async function retry(clientEventId, options = {}) {
      if (requiresNativeQueue()) {
        const plugin = await requireNativeQueue();
        const result = await plugin.retry({ clientEventId: cleanText(clientEventId, 160) });
        if (!result || result.durable !== true) throw new Error("ANI did not confirm the encrypted retry request.");
        return { found: result.found === true, client_event_id: cleanText(clientEventId, 160), flush: { status: "scheduled", sent: 0 } };
      }
      const item = await store.get(cleanText(clientEventId, 160));
      if (!validStoredItem(item)) return { found: false, client_event_id: cleanText(clientEventId, 160) };
      item.status = "queued";
      item.attempts = 0;
      item.next_attempt_at = now();
      item.last_error = "";
      item.last_http_status = 0;
      item.updated_at = timestamp();
      await store.put(item);
      emit("retry-requested", item);
      if (options.flush === false) return { found: true, item: cloneValue(item) };
      const result = await flush({ trigger: "manual-retry", force: true, ids: [item.client_event_id] });
      return { found: true, item: cloneValue(await store.get(item.client_event_id)), flush: result };
    }

    async function remove(clientEventId) {
      const id = cleanText(clientEventId, 160);
      if (requiresNativeQueue()) {
        const plugin = await requireNativeQueue();
        const result = await plugin.remove({ clientEventId: id });
        if (!result || result.durable !== true) throw new Error("ANI did not confirm secure Android report deletion.");
        emit("removed", { client_event_id: id, type: "", status: "removed" });
        return { removed: result.removed === true, client_event_id: id };
      }
      const item = await store.get(id);
      if (!item) return { removed: false, client_event_id: id };
      await store.remove(id);
      await dropSearchDedupeForItem(item);
      emit("removed", item);
      return { removed: true, client_event_id: id };
    }

    async function purgeUnsentSearchMisses() {
      if (requiresNativeQueue()) {
        // ANILegalConsent synchronizes the exact opt-out to the native plugin,
        // whose encrypted store performs the authoritative purge.
        return { removed: 0, native: true, delegated: true };
      }
      const records = await store.list();
      let removed = 0;
      for (const item of records) {
        if (item && item.type === "search_miss_batch" && item.status !== "acknowledged-purge-pending") {
          await store.remove(item.client_event_id);
          removed += 1;
          emit("removed", item, { reason: "improvement-data-withdrawn" });
        }
      }
      await store.setMeta(SEARCH_DEDUPE_KEY, []);
      return { removed, native: false };
    }

    async function canvasBlob(canvas, type, quality) {
      if (canvas && typeof canvas.convertToBlob === "function") return canvas.convertToBlob({ type, quality });
      if (canvas && typeof canvas.toBlob === "function") {
        return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Screenshot encoding failed.")), type, quality));
      }
      throw new Error("Screenshot canvas encoding is unavailable.");
    }

    function makeCanvas(width, height) {
      if (host && typeof host.OffscreenCanvas === "function") return new host.OffscreenCanvas(width, height);
      if (host && host.document && typeof host.document.createElement === "function") {
        const canvas = host.document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
      }
      throw new Error("Screenshot canvas processing is unavailable.");
    }

    async function sanitizeScreenshot(input) {
      const blob = input && input.blob || input;
      const type = cleanText(blob && blob.type, 80).toLowerCase();
      const size = Number(blob && blob.size || 0);
      if (!blob || typeof blob.arrayBuffer !== "function") throw new Error("Choose a PNG, JPEG, or WebP screenshot.");
      if (!ALLOWED_IMAGE_TYPES.has(type)) throw new Error("Only PNG, JPEG, and WebP screenshots are accepted; SVG and GIF are not allowed.");
      if (size <= 0 || size > currentConfig.maxScreenshotSourceBytes) throw new Error("The selected screenshot is empty or too large.");
      const decoder = dependencies.createImageBitmap || host && host.createImageBitmap;
      if (typeof decoder !== "function") throw new Error("Screenshot decoding is unavailable on this device.");
      const bitmap = await decoder.call(host, blob);
      try {
        const sourceWidth = Number(bitmap.width || 0);
        const sourceHeight = Number(bitmap.height || 0);
        if (sourceWidth <= 0 || sourceHeight <= 0) throw new Error("The selected screenshot has invalid dimensions.");
        if (sourceWidth * sourceHeight > currentConfig.maxScreenshotSourcePixels) {
          throw new Error("The selected screenshot has too many pixels to process safely.");
        }
        let scale = Math.min(1, currentConfig.maxScreenshotDimension / Math.max(sourceWidth, sourceHeight));
        let width = Math.max(1, Math.round(sourceWidth * scale));
        let height = Math.max(1, Math.round(sourceHeight * scale));
        let encoded = null;
        let encodedType = "image/webp";
        const qualitySteps = [0.88, 0.78, 0.68, 0.58, 0.48, 0.38];
        for (let dimensionPass = 0; dimensionPass < 4 && (!encoded || encoded.size > currentConfig.maxScreenshotBytes); dimensionPass += 1) {
          const canvas = makeCanvas(width, height);
          const context = canvas.getContext && canvas.getContext("2d", { alpha: false });
          if (!context || typeof context.drawImage !== "function") throw new Error("Screenshot canvas processing failed.");
          if (typeof context.fillRect === "function") {
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, width, height);
          }
          context.drawImage(bitmap, 0, 0, width, height);
          for (const quality of qualitySteps) {
            try {
              encoded = await canvasBlob(canvas, "image/webp", quality);
              encodedType = cleanText(encoded && encoded.type, 80).toLowerCase();
              if (encodedType !== "image/webp") {
                encoded = await canvasBlob(canvas, "image/jpeg", quality);
                encodedType = cleanText(encoded && encoded.type, 80).toLowerCase();
              }
            } catch (_error) {
              encoded = await canvasBlob(canvas, "image/jpeg", quality);
              encodedType = cleanText(encoded && encoded.type, 80).toLowerCase();
            }
            if (encoded && encoded.size <= currentConfig.maxScreenshotBytes) break;
          }
          if (!encoded || encoded.size > currentConfig.maxScreenshotBytes) {
            width = Math.max(1, Math.round(width * 0.78));
            height = Math.max(1, Math.round(height * 0.78));
          }
        }
        if (!encoded || encoded.size <= 0 || encoded.size > currentConfig.maxScreenshotBytes) {
          throw new Error(`ANI could not reduce this screenshot below ${Math.round(currentConfig.maxScreenshotBytes / 1024)} KiB. Crop it and try again.`);
        }
        if (!new Set(["image/webp", "image/jpeg"]).has(encodedType)) throw new Error("This device could not safely re-encode the screenshot.");
        const sha256 = await digestBytes(await encoded.arrayBuffer(), true);
        return Object.freeze({
          blob: encoded,
          media_type: encodedType,
          size_bytes: encoded.size,
          width,
          height,
          sha256,
          filename: encodedType === "image/webp" ? "ani-report-screenshot.webp" : "ani-report-screenshot.jpg"
        });
      } finally {
        try { if (bitmap && typeof bitmap.close === "function") bitmap.close(); } catch (_error) {}
      }
    }

    function createScreenshotPreview(screenshot) {
      const attachment = screenshot && (screenshot.attachment || screenshot);
      if (!attachment || !attachment.blob || !ALLOWED_IMAGE_TYPES.has(cleanText(attachment.media_type || attachment.blob.type, 80).toLowerCase())) {
        throw new Error("A sanitized screenshot is required for preview.");
      }
      const urlApi = host && host.URL || (typeof URL !== "undefined" ? URL : null);
      if (!urlApi || typeof urlApi.createObjectURL !== "function") throw new Error("Screenshot preview is unavailable.");
      return urlApi.createObjectURL(attachment.blob);
    }

    function revokeScreenshotPreview(previewUrl) {
      const urlApi = host && host.URL || (typeof URL !== "undefined" ? URL : null);
      if (urlApi && typeof urlApi.revokeObjectURL === "function" && previewUrl) urlApi.revokeObjectURL(previewUrl);
    }

    function onStatus(listener) {
      if (typeof listener !== "function") throw new TypeError("ANI feedback status listener must be a function.");
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    const handleOnline = () => scheduleFlush("online", 0);
    const handlePageShow = () => scheduleFlush("pageshow", 0);
    const handleVisibility = () => {
      if (!host.document || host.document.visibilityState === "visible") scheduleFlush("visible", 0);
    };
    if (host && typeof host.addEventListener === "function") {
      host.addEventListener("online", handleOnline);
      host.addEventListener("pageshow", handlePageShow);
    }
    if (host && host.document && typeof host.document.addEventListener === "function") {
      host.document.addEventListener("visibilitychange", handleVisibility);
    }

    const initial = host && host.ANI_CONFIG || {};
    try {
      configure({
        feedbackApiUrl: initial.feedbackApiUrl || initial.feedback && initial.feedback.apiUrl || "",
        catalogFingerprint: initial.catalogFingerprint || initial.feedback && initial.feedback.catalogFingerprint || "",
        appVersion: initial.appVersion || initial.feedback && initial.feedback.appVersion || "",
        surface: initial.feedback && initial.feedback.surface || (host && host.Capacitor && typeof host.Capacitor.isNativePlatform === "function" && host.Capacitor.isNativePlatform() ? "android" : "web"),
        autoStart: false,
        legalConsentProvider: (kind) => host && host.ANILegalConsent && typeof host.ANILegalConsent.consentProof === "function"
          ? host.ANILegalConsent.consentProof(kind)
          : null
      });
    } catch (_error) {}

    function destroy() {
      destroyed = true;
      if (scheduledTimer !== null) (host && host.clearTimeout || clearTimeout)(scheduledTimer);
      if (host && typeof host.removeEventListener === "function") {
        host.removeEventListener("online", handleOnline);
        host.removeEventListener("pageshow", handlePageShow);
      }
      if (host && host.document && typeof host.document.removeEventListener === "function") {
        host.document.removeEventListener("visibilitychange", handleVisibility);
      }
      listeners.clear();
    }

    return Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      configure,
      queueManualReport,
      queueSearchMiss,
      queueSearchMissBatch,
      purgeUnsentSearchMisses,
      flush,
      listOutbox,
      retry,
      remove,
      sanitizeScreenshot,
      createScreenshotPreview,
      revokeScreenshotPreview,
      shouldQueueSearchMiss,
      shouldCaptureSearchMiss: shouldQueueSearchMiss,
      searchMissDecision,
      onStatus,
      getConfig: publicConfig,
      start: () => flush({ trigger: "startup" }),
      destroy,
      __testing: Object.freeze({ store, pruneOutbox, digestHex, digestBytes, requestSha256, canonicalStableJson, redactSensitiveText, itemSize, createRuntime, memoryStore })
    });
  }

  return createRuntime({ host: defaultHost });
}));
