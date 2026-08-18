(function initializeAniLegalConsent(root, factory) {
  "use strict";

  const api = factory(root || globalThis);
  if (root && typeof root === "object") root.ANILegalConsent = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis, function createAniLegalConsentModule(defaultHost) {
  "use strict";

  const STORAGE_KEY = "ani-legal-consent-v1";
  const SCHEMA_VERSION = 1;
  const TERMS_VERSION = "2026-08-17.1";
  const DATA_USE_VERSION = "2026-08-17.1";
  // Stable SHA-256 of the three reviewed, ordered legal-document text blocks.
  // Any wording change deliberately invalidates prior acceptance and requires re-consent.
  const DOCUMENT_SHA256 = "bb04d1f144713330cff2211e47b06c5147499fcd8bf2cb834a59cef580f9ceea";
  const CHANGE_EVENT = "ani-legal-consent-changed";
  const READY_EVENT = "ani-legal-consent-ready";
  const REVIEW_EVENT = "ani-legal-consent-review-requested";
  const NATIVE_FAILURE_EVENT = "ani-legal-consent-native-sync-failed";
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

  function createRuntime(dependencies = {}) {
    const host = dependencies.host || defaultHost || globalThis;
    const now = typeof dependencies.now === "function" ? dependencies.now : () => Date.now();
    const listeners = new Set();
    let storageOverride = Object.prototype.hasOwnProperty.call(dependencies, "storage")
      ? dependencies.storage
      : undefined;
    let initialized = false;
    let reviewHandler = null;
    let configuredSurface = "";
    let configuredAppVersion = "";
    let sessionRevoked = false;
    let nativeSyncChain = Promise.resolve({ available: false });

    function storage() {
      if (storageOverride !== undefined) return storageOverride;
      try {
        return host && host.localStorage ? host.localStorage : null;
      } catch (_error) {
        return null;
      }
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
      if (!targetStorage || typeof targetStorage.getItem !== "function") return null;
      let raw = null;
      try {
        raw = targetStorage.getItem(STORAGE_KEY);
      } catch (_error) {
        return null;
      }
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        if (isCurrentRecord(parsed)) return cloneRecord(parsed);
      } catch (_error) {
        // Fall through to fail-closed invalidation.
      }
      removeInvalidRecord(targetStorage);
      return null;
    }

    function persistRecord(record) {
      if (!isCurrentRecord(record)) throw new Error("ANI refused an invalid legal acceptance record.");
      const targetStorage = storage();
      if (!targetStorage || typeof targetStorage.setItem !== "function" || typeof targetStorage.getItem !== "function") {
        throw new Error("ANI legal acceptance could not be stored on this device.");
      }
      try {
        targetStorage.setItem(STORAGE_KEY, JSON.stringify(record));
        const stored = JSON.parse(targetStorage.getItem(STORAGE_KEY) || "null");
        if (!isCurrentRecord(stored)
            || stored.acceptedAt !== record.acceptedAt
            || stored.improvementDataOptIn !== record.improvementDataOptIn
            || stored.improvementDataChoiceAt !== record.improvementDataChoiceAt
            || stored.improvementDataConsentAt !== record.improvementDataConsentAt) {
          throw new Error("legal-acceptance-readback-failed");
        }
      } catch (_error) {
        removeInvalidRecord(targetStorage);
        throw new Error("ANI legal acceptance could not be stored on this device.");
      }
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
      const record = persistRecord({
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
      const updated = persistRecord({
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
      sessionRevoked = true;
      const targetStorage = storage();
      if (targetStorage && typeof targetStorage.removeItem === "function") {
        try { targetStorage.removeItem(STORAGE_KEY); } catch (_error) { /* Session remains locked. */ }
      }
      emitChange(reason, null);
      await syncNative(null, reason);
      return { cleared: true, previouslyAccepted: Boolean(previous) };
    }

    async function init(options = {}) {
      if (typeof options.onOpenReview === "function") reviewHandler = options.onOpenReview;
      if (Object.prototype.hasOwnProperty.call(options, "surface")) configuredSurface = normalizeSurface(options.surface);
      if (Object.prototype.hasOwnProperty.call(options, "appVersion")) configuredAppVersion = cleanText(options.appVersion, 40);
      initialized = true;
      const record = readRecord();
      await syncNative(record, "initialized");
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

    function onChange(listener) {
      if (typeof listener !== "function") return () => {};
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    function setStorageForTesting(value) {
      storageOverride = value;
      sessionRevoked = false;
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
      accept,
      setImprovementDataChoice,
      decline: () => clearAcceptance("declined"),
      clearAcceptance,
      onChange,
      currentPolicy: () => ({ ...POLICY }),
      __testing: Object.freeze({
        isCurrentRecord,
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
