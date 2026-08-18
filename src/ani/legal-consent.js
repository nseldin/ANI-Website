(function initializeAniLegalConsent(root, factory) {
  "use strict";

  const api = factory(root || globalThis);
  if (root && typeof root === "object") root.ANILegalConsent = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis, function createAniLegalConsentModule(defaultHost) {
  "use strict";

  const STORAGE_KEY = "ani-legal-consent-v1";
  const SCHEMA_VERSION = 1;
  const TERMS_VERSION = "2026-08-18.1";
  const DATA_USE_VERSION = "2026-08-18.1";
  // Stable SHA-256 of the three reviewed, ordered legal-document text blocks.
  // Any wording change deliberately invalidates prior acceptance and requires re-consent.
  const DOCUMENT_SHA256 = "6f5f8076b5eb245ce39a126c55d8a3f68d2d0ab4187a217f19ec040f09b631f9";
  const CHANGE_EVENT = "ani-legal-consent-changed";
  const READY_EVENT = "ani-legal-consent-ready";
  const REVIEW_EVENT = "ani-legal-consent-review-requested";
  const NATIVE_FAILURE_EVENT = "ani-legal-consent-native-sync-failed";
  const INDEXED_DB_NAME = "ani-device-consent-v1";
  const INDEXED_DB_STORE = "legal-acceptance";
  const DURABLE_STORAGE_TIMEOUT_MS = 1500;
  const POLICY = Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    termsVersion: TERMS_VERSION,
    dataUseVersion: DATA_USE_VERSION,
    noticeVersion: DATA_USE_VERSION,
    documentSha256: DOCUMENT_SHA256
  });

  function cleanText(value, maximum = 100) {
    return String(value == null ? "" : value)
      .replace(/\u0000/g, "")
      .trim()
      .slice(0, maximum);
  }

  function validTimestamp(value) {
    const text = cleanText(value, 40);
    return text && Number.isFinite(Date.parse(text)) ? text : "";
  }

  function normalizeSurface(value) {
    const surface = cleanText(value, 32).toLowerCase();
    return new Set(["android", "android-app", "apk", "native", "capacitor"]).has(surface)
      ? "android"
      : "web";
  }

  function cloneRecord(record) {
    return record ? { ...record } : null;
  }

  function createIndexedDbStorage(host) {
    const indexedDb = host && host.indexedDB;
    if (!indexedDb || typeof indexedDb.open !== "function") return null;

    function openDatabase() {
      return new Promise((resolve, reject) => {
        let request;
        try {
          request = indexedDb.open(INDEXED_DB_NAME, 1);
        } catch (error) {
          reject(error);
          return;
        }
        request.onupgradeneeded = () => {
          const database = request.result;
          if (!database.objectStoreNames.contains(INDEXED_DB_STORE)) {
            database.createObjectStore(INDEXED_DB_STORE);
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("indexed-db-open-failed"));
        request.onblocked = () => reject(new Error("indexed-db-open-blocked"));
      });
    }

    async function transact(mode, operation) {
      const database = await openDatabase();
      try {
        return await new Promise((resolve, reject) => {
          let request;
          let settled = false;
          const transaction = database.transaction(INDEXED_DB_STORE, mode);
          transaction.onabort = () => {
            if (!settled) reject(transaction.error || new Error("indexed-db-transaction-aborted"));
          };
          transaction.onerror = () => {
            if (!settled) reject(transaction.error || new Error("indexed-db-transaction-failed"));
          };
          try {
            request = operation(transaction.objectStore(INDEXED_DB_STORE));
          } catch (error) {
            reject(error);
            return;
          }
          request.onsuccess = () => {
            settled = true;
            resolve(request.result);
          };
          request.onerror = () => {
            settled = true;
            reject(request.error || new Error("indexed-db-request-failed"));
          };
        });
      } finally {
        database.close();
      }
    }

    return Object.freeze({
      getItem: (key) => transact("readonly", (store) => store.get(key)),
      setItem: (key, value) => transact("readwrite", (store) => store.put(String(value), key)),
      removeItem: (key) => transact("readwrite", (store) => store.delete(key))
    });
  }

  function createRuntime(dependencies = {}) {
    const host = dependencies.host || defaultHost || globalThis;
    const now = typeof dependencies.now === "function" ? dependencies.now : () => Date.now();
    const listeners = new Set();
    let storageOverride = Object.prototype.hasOwnProperty.call(dependencies, "storage")
      ? dependencies.storage
      : undefined;
    let durableStorageOverride = Object.prototype.hasOwnProperty.call(dependencies, "durableStorage")
      ? dependencies.durableStorage
      : undefined;
    let indexedDbStorage;
    let initialized = false;
    let reviewHandler = null;
    let legalTargetLinksBound = false;
    let configuredSurface = "";
    let configuredAppVersion = "";
    let sessionRevoked = false;
    let hydratedRecord = null;
    let useHydratedFallback = false;
    let nativeSyncChain = Promise.resolve({ available: false });

    function storage() {
      if (storageOverride !== undefined) return storageOverride;
      try {
        return host && host.localStorage ? host.localStorage : null;
      } catch (_error) {
        return null;
      }
    }

    function durableStorage() {
      if (durableStorageOverride !== undefined) return durableStorageOverride;
      if (indexedDbStorage === undefined) indexedDbStorage = createIndexedDbStorage(host);
      return indexedDbStorage;
    }

    function bounded(operation) {
      const timeoutMs = Number.isFinite(dependencies.durableStorageTimeoutMs)
        ? Math.max(10, dependencies.durableStorageTimeoutMs)
        : DURABLE_STORAGE_TIMEOUT_MS;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("durable-storage-timeout")), timeoutMs);
        Promise.resolve(operation).then(
          (value) => {
            clearTimeout(timer);
            resolve(value);
          },
          (error) => {
            clearTimeout(timer);
            reject(error);
          }
        );
      });
    }

    function currentSurface() {
      if (configuredSurface) return configuredSurface;
      const capacitor = host && host.Capacitor;
      const plugin = capacitor && capacitor.Plugins && capacitor.Plugins.AniFeedbackQueue;
      return plugin ? "android" : "web";
    }

    function isCurrentRecord(value) {
      if (!value || typeof value !== "object" || Array.isArray(value)) return false;
      if (value.schemaVersion !== SCHEMA_VERSION
          || value.termsVersion !== TERMS_VERSION
          || value.dataUseVersion !== DATA_USE_VERSION
          || value.documentSha256 !== DOCUMENT_SHA256
          || value.termsAccepted !== true
          || typeof value.improvementDataOptIn !== "boolean") return false;
      if (!validTimestamp(value.acceptedAt) || !validTimestamp(value.improvementDataChoiceAt)) return false;
      if (normalizeSurface(value.surface) !== value.surface) return false;
      if (typeof value.appVersion !== "string" || value.appVersion.length > 40) return false;
      if (value.improvementDataOptIn === true) {
        if (!validTimestamp(value.improvementDataConsentAt)) return false;
      } else if (value.improvementDataConsentAt !== null) {
        return false;
      }
      return true;
    }

    function isCurrentRevocation(value) {
      return Boolean(value && typeof value === "object" && !Array.isArray(value)
        && value.schemaVersion === SCHEMA_VERSION
        && value.termsVersion === TERMS_VERSION
        && value.dataUseVersion === DATA_USE_VERSION
        && value.documentSha256 === DOCUMENT_SHA256
        && value.revoked === true
        && validTimestamp(value.revokedAt));
    }

    function revocationRecord(reason) {
      return {
        schemaVersion: SCHEMA_VERSION,
        termsVersion: TERMS_VERSION,
        dataUseVersion: DATA_USE_VERSION,
        documentSha256: DOCUMENT_SHA256,
        revoked: true,
        revokedAt: new Date(now()).toISOString(),
        reason: cleanText(reason, 60)
      };
    }

    function removeInvalidRecord(targetStorage) {
      try {
        targetStorage && targetStorage.removeItem(STORAGE_KEY);
      } catch (_error) {
        // Invalid or stale consent never unlocks ANI even when storage is unavailable.
      }
    }

    function readRecord() {
      if (sessionRevoked) return null;
      const targetStorage = storage();
      if (!targetStorage || typeof targetStorage.getItem !== "function") {
        return useHydratedFallback && isCurrentRecord(hydratedRecord) ? cloneRecord(hydratedRecord) : null;
      }
      let raw = null;
      try {
        raw = targetStorage.getItem(STORAGE_KEY);
      } catch (_error) {
        return useHydratedFallback && isCurrentRecord(hydratedRecord) ? cloneRecord(hydratedRecord) : null;
      }
      if (!raw) return useHydratedFallback && isCurrentRecord(hydratedRecord) ? cloneRecord(hydratedRecord) : null;
      try {
        const parsed = JSON.parse(raw);
        if (isCurrentRevocation(parsed)) {
          hydratedRecord = null;
          useHydratedFallback = false;
          sessionRevoked = true;
          return null;
        }
        if (isCurrentRecord(parsed)) {
          hydratedRecord = cloneRecord(parsed);
          useHydratedFallback = false;
          return cloneRecord(parsed);
        }
      } catch (_error) {
        // Fall through to fail-closed invalidation.
      }
      removeInvalidRecord(targetStorage);
      hydratedRecord = null;
      useHydratedFallback = false;
      return null;
    }

    function persistLocalRecord(record) {
      const targetStorage = storage();
      if (!targetStorage || typeof targetStorage.setItem !== "function" || typeof targetStorage.getItem !== "function") {
        return false;
      }
      try {
        targetStorage.setItem(STORAGE_KEY, JSON.stringify(record));
        const stored = JSON.parse(targetStorage.getItem(STORAGE_KEY) || "null");
        return isCurrentRecord(stored)
          && stored.acceptedAt === record.acceptedAt
          && stored.improvementDataOptIn === record.improvementDataOptIn
          && stored.improvementDataChoiceAt === record.improvementDataChoiceAt
          && stored.improvementDataConsentAt === record.improvementDataConsentAt;
      } catch (_error) {
        removeInvalidRecord(targetStorage);
        return false;
      }
    }

    function persistLocalRevocation(record) {
      const targetStorage = storage();
      if (!targetStorage || typeof targetStorage.setItem !== "function" || typeof targetStorage.getItem !== "function") {
        return false;
      }
      try {
        targetStorage.setItem(STORAGE_KEY, JSON.stringify(record));
        return isCurrentRevocation(JSON.parse(targetStorage.getItem(STORAGE_KEY) || "null"));
      } catch (_error) {
        return false;
      }
    }

    async function persistDurableRecord(record) {
      const target = durableStorage();
      if (!target || typeof target.setItem !== "function" || typeof target.getItem !== "function") return false;
      try {
        await bounded(target.setItem(STORAGE_KEY, JSON.stringify(record)));
        const raw = await bounded(target.getItem(STORAGE_KEY));
        const stored = JSON.parse(raw || "null");
        return isCurrentRecord(stored)
          && stored.acceptedAt === record.acceptedAt
          && stored.improvementDataOptIn === record.improvementDataOptIn
          && stored.improvementDataChoiceAt === record.improvementDataChoiceAt
          && stored.improvementDataConsentAt === record.improvementDataConsentAt;
      } catch (_error) {
        return false;
      }
    }

    async function persistDurableRevocation(record) {
      const target = durableStorage();
      if (!target || typeof target.setItem !== "function" || typeof target.getItem !== "function") return false;
      try {
        await bounded(target.setItem(STORAGE_KEY, JSON.stringify(record)));
        const raw = await bounded(target.getItem(STORAGE_KEY));
        return isCurrentRevocation(JSON.parse(raw || "null"));
      } catch (_error) {
        return false;
      }
    }

    async function removeDurableRecord() {
      const target = durableStorage();
      if (!target || typeof target.removeItem !== "function") return false;
      try {
        await bounded(target.removeItem(STORAGE_KEY));
        return true;
      } catch (_error) {
        return false;
      }
    }

    async function readDurableRecord() {
      const target = durableStorage();
      if (!target || typeof target.getItem !== "function") return null;
      let raw;
      try {
        raw = await bounded(target.getItem(STORAGE_KEY));
      } catch (_error) {
        return null;
      }
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        if (isCurrentRevocation(parsed)) {
          sessionRevoked = true;
          hydratedRecord = null;
          useHydratedFallback = false;
          return null;
        }
        if (isCurrentRecord(parsed)) return cloneRecord(parsed);
      } catch (_error) {
        // Stale or malformed durable consent must never unlock ANI.
      }
      await removeDurableRecord();
      return null;
    }

    async function persistRecord(record) {
      if (!isCurrentRecord(record)) throw new Error("ANI refused an invalid legal acceptance record.");
      const localStored = persistLocalRecord(record);
      const durableStored = await persistDurableRecord(record);
      if (!localStored && !durableStored) {
        throw new Error("ANI legal acceptance could not be stored on this device.");
      }
      hydratedRecord = cloneRecord(record);
      useHydratedFallback = !localStored && durableStored;
      sessionRevoked = false;
      return cloneRecord(record);
    }

    function improvementChoice(value) {
      if (value === true || value === "opt-in") return true;
      if (value === false || value === "opt-out") return false;
      throw new Error("Choose whether ANI may collect bounded no-match search improvement data.");
    }

    function eventDetail(reason, record = readRecord()) {
      return {
        reason: cleanText(reason, 60),
        accepted: Boolean(record),
        improvementDataOptIn: Boolean(record && record.improvementDataOptIn),
        termsVersion: TERMS_VERSION,
        dataUseVersion: DATA_USE_VERSION,
        documentSha256: DOCUMENT_SHA256,
        record: cloneRecord(record)
      };
    }

    function dispatch(type, detail) {
      if (!host || typeof host.dispatchEvent !== "function") return false;
      try {
        let event = null;
        if (typeof host.CustomEvent === "function") {
          event = new host.CustomEvent(type, { detail });
        } else if (host.document && typeof host.document.createEvent === "function") {
          event = host.document.createEvent("CustomEvent");
          event.initCustomEvent(type, false, false, detail);
        }
        if (!event) return false;
        host.dispatchEvent(event);
        return true;
      } catch (_error) {
        return false;
      }
    }

    function emitChange(reason, record) {
      const detail = eventDetail(reason, record);
      listeners.forEach((listener) => {
        try { listener(detail); } catch (_error) { /* Listener failures never alter consent. */ }
      });
      dispatch(CHANGE_EVENT, detail);
      return detail;
    }

    function consentProof(kind) {
      const record = readRecord();
      const searchMissAllowed = kind === "search_miss" && Boolean(record && record.improvementDataOptIn);
      return {
        terms_version: TERMS_VERSION,
        notice_version: DATA_USE_VERSION,
        document_sha256: DOCUMENT_SHA256,
        terms_accepted_at: record ? record.acceptedAt : null,
        data_use_version: DATA_USE_VERSION,
        data_collection_confirmed: searchMissAllowed,
        data_sharing_confirmed: searchMissAllowed,
        data_consent_at: searchMissAllowed ? record.improvementDataConsentAt : null
      };
    }

    function nativeQueuePlugin() {
      const capacitor = host && host.Capacitor;
      const plugin = capacitor && capacitor.Plugins && capacitor.Plugins.AniFeedbackQueue;
      return plugin && typeof plugin === "object" ? plugin : null;
    }

    function recordFromNativeSummary(summary) {
      if (!summary || typeof summary !== "object" || summary.terms_accepted !== true) return null;
      const collection = summary.data_collection_confirmed === true;
      const sharing = summary.data_sharing_confirmed === true;
      if (collection !== sharing
          || summary.terms_version !== TERMS_VERSION
          || summary.notice_version !== DATA_USE_VERSION
          || summary.data_use_version !== DATA_USE_VERSION
          || summary.document_sha256 !== DOCUMENT_SHA256) return null;
      const acceptedAt = validTimestamp(summary.terms_accepted_at);
      const consentAt = collection ? validTimestamp(summary.data_consent_at) : "";
      if (!acceptedAt || (collection && !consentAt)) return null;
      const record = {
        schemaVersion: SCHEMA_VERSION,
        termsVersion: TERMS_VERSION,
        dataUseVersion: DATA_USE_VERSION,
        documentSha256: DOCUMENT_SHA256,
        termsAccepted: true,
        acceptedAt,
        surface: "android",
        appVersion: cleanText(configuredAppVersion, 40),
        improvementDataOptIn: collection,
        improvementDataChoiceAt: consentAt || acceptedAt,
        improvementDataConsentAt: consentAt || null
      };
      return isCurrentRecord(record) ? record : null;
    }

    async function readNativeRecord(reason) {
      const plugin = nativeQueuePlugin();
      if (!plugin || typeof plugin.getLegalAcceptance !== "function") return null;
      try {
        const result = await plugin.getLegalAcceptance();
        return recordFromNativeSummary(result && result.legal_acceptance);
      } catch (error) {
        dispatch(NATIVE_FAILURE_EVENT, {
          reason: cleanText(reason, 60),
          message: cleanText(error && error.message, 200)
        });
        return null;
      }
    }

    async function restoreDurableAcceptance() {
      let record = await readDurableRecord();
      if (!record && !sessionRevoked && currentSurface() === "android") {
        record = await readNativeRecord("restore-on-initialization");
      }
      if (!record) return null;

      const localStored = persistLocalRecord(record);
      if (!localStored) {
        hydratedRecord = cloneRecord(record);
        useHydratedFallback = true;
      }
      await persistDurableRecord(record);
      sessionRevoked = false;
      return cloneRecord(record);
    }

    function nativeConsentPayload(record) {
      const proof = consentProof("search_miss");
      return {
        accepted: Boolean(record),
        improvement_data_opt_in: Boolean(record && record.improvementDataOptIn),
        ...proof
      };
    }

    function syncNative(record, reason) {
      const plugin = nativeQueuePlugin();
      if (!record && plugin && typeof plugin.clearLegalAcceptance === "function") {
        nativeSyncChain = nativeSyncChain
          .catch(() => ({ available: true, synchronized: false }))
          .then(async () => {
            try {
              const result = await plugin.clearLegalAcceptance();
              return { available: true, synchronized: true, result: result || null };
            } catch (error) {
              dispatch(NATIVE_FAILURE_EVENT, {
                reason: cleanText(reason, 60),
                message: cleanText(error && error.message, 200)
              });
              return { available: true, synchronized: false };
            }
          });
        return nativeSyncChain;
      }
      const setConsent = plugin && (typeof plugin.setLegalAcceptance === "function"
        ? plugin.setLegalAcceptance
        : (typeof plugin.setConsent === "function"
          ? plugin.setConsent
          : (typeof plugin.setLegalConsent === "function" ? plugin.setLegalConsent : null)));
      if (!setConsent) return Promise.resolve({ available: false });
      const payload = nativeConsentPayload(record);
      nativeSyncChain = nativeSyncChain
        .catch(() => ({ available: true, synchronized: false }))
        .then(async () => {
          try {
            const result = await setConsent.call(plugin, payload);
            return { available: true, synchronized: true, result: result || null };
          } catch (error) {
            dispatch(NATIVE_FAILURE_EVENT, {
              reason: cleanText(reason, 60),
              message: cleanText(error && error.message, 200)
            });
            return { available: true, synchronized: false };
          }
        });
      return nativeSyncChain;
    }

    async function accept(options = {}) {
      if (options.termsAccepted !== true) throw new Error("ANI Terms and Data Use must be accepted before use.");
      const optIn = improvementChoice(Object.prototype.hasOwnProperty.call(options, "improvementDataChoice")
        ? options.improvementDataChoice
        : options.improvementDataOptIn);
      const timestamp = new Date(now()).toISOString();
      const record = await persistRecord({
        schemaVersion: SCHEMA_VERSION,
        termsVersion: TERMS_VERSION,
        dataUseVersion: DATA_USE_VERSION,
        documentSha256: DOCUMENT_SHA256,
        termsAccepted: true,
        acceptedAt: timestamp,
        surface: normalizeSurface(options.surface || currentSurface()),
        appVersion: cleanText(options.appVersion || configuredAppVersion, 40),
        improvementDataOptIn: optIn,
        improvementDataChoiceAt: timestamp,
        improvementDataConsentAt: optIn ? timestamp : null
      });
      emitChange("accepted", record);
      await syncNative(record, "accepted");
      return cloneRecord(record);
    }

    async function setImprovementDataChoice(choice) {
      const current = readRecord();
      if (!current) throw new Error("ANI Terms and Data Use must be accepted first.");
      const optIn = improvementChoice(choice);
      if (current.improvementDataOptIn === optIn) {
        await syncNative(current, "improvement-data-unchanged");
        return cloneRecord(current);
      }
      const timestamp = new Date(now()).toISOString();
      const updated = await persistRecord({
        ...current,
        improvementDataOptIn: optIn,
        improvementDataChoiceAt: timestamp,
        improvementDataConsentAt: optIn ? timestamp : null
      });
      emitChange(optIn ? "improvement-data-opted-in" : "improvement-data-withdrawn", updated);
      await syncNative(updated, optIn ? "improvement-data-opted-in" : "improvement-data-withdrawn");
      return cloneRecord(updated);
    }

    async function clearAcceptance(reason = "declined") {
      const previous = readRecord();
      const revocation = revocationRecord(reason);
      sessionRevoked = true;
      const localRevoked = persistLocalRevocation(revocation);
      const durableRevoked = await persistDurableRevocation(revocation);
      hydratedRecord = null;
      useHydratedFallback = false;
      emitChange(reason, null);
      const nativeResult = await syncNative(null, reason);
      const durable = localRevoked || durableRevoked
        || Boolean(nativeResult && nativeResult.available && nativeResult.synchronized);
      if (!durable) throw new Error("ANI could not securely save withdrawal on this device.");
      return { cleared: true, durable: true, previouslyAccepted: Boolean(previous) };
    }

    async function init(options = {}) {
      if (typeof options.onOpenReview === "function") reviewHandler = options.onOpenReview;
      if (Object.prototype.hasOwnProperty.call(options, "surface")) configuredSurface = normalizeSurface(options.surface);
      if (Object.prototype.hasOwnProperty.call(options, "appVersion")) configuredAppVersion = cleanText(options.appVersion, 40);
      initialized = true;
      bindLegalTargetLinks();
      let record = readRecord();
      if (record) await persistDurableRecord(record);
      else if (!sessionRevoked) record = await restoreDurableAcceptance();
      // Absence of a WebView/local record is not a withdrawal instruction.
      // Only an explicit decline/clear may erase the encrypted Android latch.
      if (record) await syncNative(record, "initialized");
      const detail = eventDetail("initialized", record);
      dispatch(READY_EVENT, detail);
      return detail;
    }

    function openReview(options = {}) {
      const detail = {
        mode: options.mode === "mandatory" ? "mandatory" : "review",
        trigger: cleanText(options.trigger, 80),
        accepted: Boolean(readRecord()),
        policy: { ...POLICY }
      };
      if (typeof reviewHandler === "function") {
        try { reviewHandler(detail); } catch (_error) { /* The legal gate stays authoritative. */ }
      }
      dispatch(REVIEW_EVENT, detail);
      return detail;
    }

    function legalTargetId(value) {
      const id = cleanText(value, 128).replace(/^#/, "");
      return /^[A-Za-z][A-Za-z0-9_.:-]{0,127}$/.test(id) ? id : "";
    }

    function revealLegalTarget(value) {
      const document = host && host.document;
      const id = legalTargetId(value);
      if (!document || !id || typeof document.getElementById !== "function") return false;
      const target = document.getElementById(id);
      if (!target) return false;
      const containingDetails = typeof target.closest === "function" ? target.closest("details") : null;
      const fullDocuments = document.getElementById("aniLegalFullDocuments");
      if (containingDetails && "open" in containingDetails) containingDetails.open = true;
      if (fullDocuments && "open" in fullDocuments) fullDocuments.open = true;
      if (typeof target.hasAttribute === "function" && typeof target.setAttribute === "function"
          && !target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      const schedule = host && typeof host.setTimeout === "function" ? host.setTimeout.bind(host) : setTimeout;
      schedule(() => {
        try {
          if (typeof target.focus === "function") target.focus({ preventScroll: true });
          if (typeof target.scrollIntoView === "function") target.scrollIntoView({ block: "start" });
        } catch (_error) {
          // A missing focus/scroll API cannot prevent the legal review from opening.
        }
      }, 0);
      return true;
    }

    function openDocument(options = {}) {
      const target = legalTargetId(options.target || options.targetId);
      const detail = openReview({
        mode: readRecord() ? "review" : "mandatory",
        trigger: cleanText(options.trigger || "legal-document-link", 80)
      });
      return { ...detail, target, revealed: revealLegalTarget(target) };
    }

    function bindLegalTargetLinks() {
      const document = host && host.document;
      if (legalTargetLinksBound || !document || typeof document.addEventListener !== "function") return false;
      document.addEventListener("click", (event) => {
        const source = event && event.target;
        const control = source && typeof source.closest === "function"
          ? source.closest("[data-ani-legal-target]")
          : null;
        if (!control || typeof control.getAttribute !== "function") return;
        const target = legalTargetId(control.getAttribute("data-ani-legal-target"));
        if (!target) return;
        if (event && typeof event.preventDefault === "function") event.preventDefault();
        openDocument({ target, trigger: "legal-document-link" });
      });
      legalTargetLinksBound = true;
      return true;
    }

    function onChange(listener) {
      if (typeof listener !== "function") return () => {};
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    function setStorageForTesting(value) {
      storageOverride = value;
      sessionRevoked = false;
      hydratedRecord = null;
      useHydratedFallback = false;
    }

    return Object.freeze({
      init,
      hasAcceptedTerms: () => Boolean(readRecord()),
      allowsImprovementData: () => {
        const record = readRecord();
        return Boolean(record && record.improvementDataOptIn);
      },
      getRecord: () => cloneRecord(readRecord()),
      consentProof,
      openReview,
      openDocument,
      accept,
      setImprovementDataChoice,
      decline: () => clearAcceptance("declined"),
      clearAcceptance,
      onChange,
      currentPolicy: () => ({ ...POLICY }),
      __testing: Object.freeze({
        isCurrentRecord,
        isCurrentRevocation,
        recordFromNativeSummary,
        setStorageForTesting,
        storageKey: STORAGE_KEY,
        initialized: () => initialized,
        nativeSync: () => nativeSyncChain
      })
    });
  }

  const runtime = createRuntime();
  return Object.freeze({
    ...runtime,
    __testing: Object.freeze({
      ...runtime.__testing,
      createRuntime,
      POLICY,
      STORAGE_KEY,
      CHANGE_EVENT,
      READY_EVENT,
      REVIEW_EVENT,
      NATIVE_FAILURE_EVENT
    })
  });
}));
