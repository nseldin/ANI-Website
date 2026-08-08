(function initializeAniLane2Sync(global) {
  "use strict";

  const STORAGE_KEY = "ani-lane2-sync-state-v1";
  const MAX_QUEUE = 500;
  const ENTITY_TYPES = new Set(["bookmark", "favorite", "saved_question", "quiz_result", "study_progress", "weak_topic", "setting"]);

  function identifier() {
    if (global.crypto?.randomUUID) return global.crypto.randomUUID();
    return `ani-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  function emptyState() {
    return {
      schemaVersion: 1,
      deviceId: identifier(),
      cursor: "1970-01-01T00:00:00.000Z",
      queue: [],
      conflicts: [],
      versions: {},
      lastSyncAt: null
    };
  }

  function scopedStorageKey(accountId = "anonymous") {
    const scope = String(accountId || "anonymous").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 120) || "anonymous";
    return `${STORAGE_KEY}:${scope}`;
  }

  function readState(storageKey) {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(storageKey) || "null");
      if (parsed?.schemaVersion === 1 && parsed.deviceId && Array.isArray(parsed.queue) && Array.isArray(parsed.conflicts)) {
        parsed.versions = parsed.versions && typeof parsed.versions === "object" ? parsed.versions : {};
        parsed.lastSyncAt = parsed.lastSyncAt || null;
        return parsed;
      }
    } catch (_error) {
      // Corrupt optional sync state must not break ANI's offline experience.
    }
    return emptyState();
  }

  function writeState(storageKey, state) {
    global.localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function createAniLane2Sync({ transport, accountId = "anonymous" } = {}) {
    const send = transport || ((pathname, options) => global.fetch(pathname, { ...options, credentials: "include" }));
    let storageKey = scopedStorageKey(accountId);

    function bindAccount(nextAccountId = "anonymous") {
      storageKey = scopedStorageKey(nextAccountId);
      return snapshot();
    }

    function snapshot() {
      return JSON.parse(JSON.stringify(readState(storageKey)));
    }

    function queueChange(entityType, clientRecordId, payload, { expectedVersion, deleted = false, updatedAt } = {}) {
      if (!ENTITY_TYPES.has(entityType) || !String(clientRecordId || "").trim()) {
        throw new Error("Invalid ANI sync record identity.");
      }
      const state = readState(storageKey);
      const recordKey = `${entityType}:${String(clientRecordId).slice(0, 160)}`;
      const record = {
        entity_type: entityType,
        client_record_id: String(clientRecordId).slice(0, 160),
        payload: payload && typeof payload === "object" ? payload : {},
        expected_version: Math.max(0, Number(expectedVersion ?? state.versions[recordKey] ?? 0)),
        client_updated_at: updatedAt || new Date().toISOString(),
        deleted: Boolean(deleted)
      };
      const index = state.queue.findIndex((item) => item.entity_type === record.entity_type
        && item.client_record_id === record.client_record_id);
      if (index >= 0) state.queue[index] = record;
      else state.queue.push(record);
      if (state.queue.length > MAX_QUEUE) throw new Error("ANI's optional sync queue is full; local data remains unchanged.");
      writeState(storageKey, state);
      return record;
    }

    async function flush() {
      const state = readState(storageKey);
      if (!state.queue.length) return { applied: [], conflicts: state.conflicts, offline: !global.navigator.onLine };
      if (!global.navigator.onLine) return { applied: [], conflicts: state.conflicts, offline: true };
      const response = await send("/api/sync/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: state.deviceId, records: state.queue.slice(0, 100) })
      });
      const result = await response.json().catch(() => ({}));
      if (response.status !== 409 && !response.ok) throw new Error(result.error || "ANI sync push failed.");
      const appliedKeys = new Set((result.applied || []).map((item) => `${item.entity_type}:${item.client_record_id}`));
      (result.applied || []).forEach((item) => {
        state.versions[`${item.entity_type}:${item.client_record_id}`] = Math.max(0, Number(item.version || 0));
      });
      state.queue = state.queue.filter((item) => !appliedKeys.has(`${item.entity_type}:${item.client_record_id}`));
      const conflicts = new Map(state.conflicts.map((item) => [
        `${item.requested?.entity_type}:${item.requested?.client_record_id}`,
        item
      ]));
      (result.conflicts || []).forEach((item) => conflicts.set(
        `${item.requested?.entity_type}:${item.requested?.client_record_id}`,
        item
      ));
      state.conflicts = [...conflicts.values()].slice(-MAX_QUEUE);
      state.lastSyncAt = new Date().toISOString();
      writeState(storageKey, state);
      return { ...result, offline: false };
    }

    async function pull({ limit = 500 } = {}) {
      const state = readState(storageKey);
      if (!global.navigator.onLine) return { records: [], cursor: state.cursor, offline: true };
      const response = await send(`/api/sync/pull?since=${encodeURIComponent(state.cursor)}&limit=${Math.max(1, Math.min(1000, Number(limit || 500)))}`, {
        method: "GET"
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "ANI sync pull failed.");
      // Consumers must merge returned records explicitly. This module never overwrites newer local data.
      (result.records || []).forEach((item) => {
        state.versions[`${item.entity_type}:${item.client_record_id}`] = Math.max(0, Number(item.version || 0));
      });
      state.cursor = result.cursor || state.cursor;
      state.lastSyncAt = new Date().toISOString();
      writeState(storageKey, state);
      return { ...result, offline: false };
    }

    function resolveConflict(entityType, clientRecordId, resolution) {
      if (!new Set(["keep_local", "accept_server"]).has(resolution)) throw new Error("Invalid sync conflict resolution.");
      const state = readState(storageKey);
      const index = state.conflicts.findIndex((item) => item.requested?.entity_type === entityType
        && item.requested?.client_record_id === clientRecordId);
      if (index < 0) return null;
      const conflict = state.conflicts.splice(index, 1)[0];
      if (resolution === "keep_local") {
        const queued = state.queue.find((item) => item.entity_type === entityType && item.client_record_id === clientRecordId);
        if (queued) queued.expected_version = Number(conflict.current?.version || 0);
      } else {
        state.queue = state.queue.filter((item) => item.entity_type !== entityType || item.client_record_id !== clientRecordId);
        state.versions[`${entityType}:${clientRecordId}`] = Number(conflict.current?.version || 0);
      }
      writeState(storageKey, state);
      return { resolution, conflict };
    }

    return { bindAccount, flush, pull, queueChange, resolveConflict, snapshot };
  }

  global.AniLane2Sync = Object.freeze({ create: createAniLane2Sync, entityTypes: [...ENTITY_TYPES] });
})(window);
