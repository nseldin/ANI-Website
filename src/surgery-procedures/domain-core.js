"use strict";

(function initAniSurgeryProceduresDomainCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root && typeof root === "object") root.AniSurgeryProceduresDomainCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function buildAniSurgeryProceduresDomainCore() {
  const crypto = typeof require === "function" ? require("node:crypto") : null;

  const SCHEMA_VERSION = "ani-surgery-procedures-catalog-v1";
  const APPROVAL_SCHEMA_VERSION = "ani-surgery-procedures-approval-v1";
  const ARCHITECTURE_VERSION = "ani-surgery-procedures-domain-v1";
  const GENERATOR_VERSION = "ani-surgery-procedures-generator-v1";
  const RUNTIME_SCHEMA_VERSION = "ani-surgery-procedures-runtime-v1";
  const DOMAIN_ID = "surgeries-procedures";
  const CANONICAL_OWNER = "Surgeries & Procedures";
  const RUNTIME_COLLECTION = "clinicalReferenceEntries";

  const BROWSE_BRANCHES = Object.freeze([
    { id: "cardiovascular-vascular", label: "Cardiovascular and Vascular Procedures", order: 1 },
    { id: "respiratory-thoracic", label: "Respiratory and Thoracic Procedures", order: 2 },
    { id: "gastrointestinal-general", label: "Gastrointestinal and General Surgery", order: 3 },
    { id: "neurologic-neurosurgery", label: "Neurologic and Neurosurgical Procedures", order: 4 },
    { id: "orthopedic-musculoskeletal", label: "Orthopedic and Musculoskeletal Procedures", order: 5 },
    { id: "renal-urologic", label: "Renal and Urologic Procedures", order: 6 },
    { id: "reproductive-gynecologic", label: "Reproductive and Gynecologic Procedures", order: 7 },
    { id: "male-reproductive", label: "Male Reproductive Procedures", order: 8 },
    { id: "endocrine", label: "Endocrine Procedures", order: 9 },
    { id: "ent-head-neck", label: "Ear, Nose, Throat, Head, and Neck Procedures", order: 10 },
    { id: "ophthalmic", label: "Ophthalmic Procedures", order: 11 },
    { id: "dermatologic-plastic-reconstructive", label: "Dermatologic, Plastic, and Reconstructive Procedures", order: 12 },
    { id: "trauma-emergency", label: "Trauma and Emergency Procedures", order: 13 },
    { id: "transplant", label: "Transplant Procedures", order: 14 },
    { id: "perioperative-care", label: "Perioperative Care", order: 15 }
  ]);

  const REQUIRED_CONTENT_GROUPS = Object.freeze([
    { id: "quick-definition", label: "Quick definition", presentation: "essential" },
    { id: "anatomy-involved", label: "Anatomy involved", presentation: "essential" },
    { id: "why-performed", label: "Why it is performed", presentation: "essential" },
    { id: "how-it-works", label: "How the procedure works", presentation: "essential" },
    { id: "preoperative-nursing-assessment", label: "Preoperative nursing assessment", presentation: "essential" },
    { id: "preoperative-patient-teaching", label: "Preoperative patient teaching", presentation: "essential" },
    { id: "consent-and-nursing-responsibility", label: "Informed consent and nursing responsibility", presentation: "disclosure" },
    { id: "immediate-postoperative-priorities", label: "Immediate postoperative priorities", presentation: "essential" },
    { id: "tubes-drains-devices", label: "Tubes, drains, devices, and equipment", presentation: "disclosure" },
    { id: "expected-findings", label: "Expected findings", presentation: "disclosure" },
    { id: "complications", label: "Early and later complications", presentation: "essential" },
    { id: "report-or-escalate-immediately", label: "Report or escalate immediately", presentation: "urgent" },
    { id: "positioning-and-activity", label: "Positioning and activity", presentation: "disclosure" },
    { id: "diet-and-elimination", label: "Diet and elimination", presentation: "disclosure" },
    { id: "pain-management", label: "Pain management", presentation: "disclosure" },
    { id: "discharge-teaching", label: "Discharge teaching", presentation: "essential" },
    { id: "nursing-memory-aids", label: "Nursing memory aids", presentation: "disclosure", allowsNotApplicable: true },
    { id: "why-it-matters", label: "Why it matters", presentation: "essential" },
    { id: "nclex-and-exam-focus", label: "NCLEX and nursing exam focus", presentation: "essential" }
  ]);
  const DISCLOSURE_CONTENT_GROUP_IDS = Object.freeze(REQUIRED_CONTENT_GROUPS
    .filter((definition) => definition.presentation === "disclosure")
    .map((definition) => definition.id));

  const APPROACH_TYPES = Object.freeze([
    "open", "laparoscopic", "robotic", "endoscopic", "percutaneous", "catheter-based",
    "minimally-invasive", "stereotactic", "transplant"
  ]);
  const PROCEDURE_INTENTS = Object.freeze(["diagnostic", "therapeutic"]);
  const URGENCY_TYPES = Object.freeze(["elective", "urgent", "emergent"]);
  const ALIAS_KINDS = Object.freeze(["abbreviation", "alternative-name", "common-language", "phonetic", "common-misspelling"]);
  const RELATIONSHIP_TYPES = Object.freeze([
    "treats-condition", "evaluates-condition", "associated-condition", "related-procedure", "monitored-by", "uses-device"
  ]);
  const TARGET_COLLECTIONS = Object.freeze([
    "pathologyDiseases", "clinicalReferenceEntries", "pharmDrugs", "pharmSearchableLabRanges"
  ]);
  const RELATIONSHIP_TARGET_COLLECTIONS = Object.freeze({
    "treats-condition": Object.freeze(["pathologyDiseases"]),
    "evaluates-condition": Object.freeze(["pathologyDiseases"]),
    "associated-condition": Object.freeze(["pathologyDiseases"]),
    "related-procedure": Object.freeze(["clinicalReferenceEntries"]),
    "monitored-by": Object.freeze(["clinicalReferenceEntries", "pharmSearchableLabRanges"]),
    "uses-device": Object.freeze(["clinicalReferenceEntries"])
  });
  const PILOT_IDS = Object.freeze([
    "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
    "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
    "surgery-procedure:gastrointestinal-general:cholecystectomy",
    "surgery-procedure:gastrointestinal-general:appendectomy",
    "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
    "surgery-procedure:endocrine:thyroidectomy",
    "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
    "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
    "surgery-procedure:neurologic-neurosurgery:craniotomy",
    "surgery-procedure:neurologic-neurosurgery:laminectomy",
    "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
    "surgery-procedure:reproductive-gynecologic:hysterectomy",
    "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
    "surgery-procedure:respiratory-thoracic:lobectomy",
    "surgery-procedure:transplant:kidney-transplantation"
  ]);
  const SEEG_ID = "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography";
  const SENGSTAKEN_BLAKEMORE_ID = "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube";
  const SUPPLEMENTAL_IDS = Object.freeze([SEEG_ID, SENGSTAKEN_BLAKEMORE_ID]);
  const ALLOWED_ENTRY_IDS = Object.freeze([...PILOT_IDS, ...SUPPLEMENTAL_IDS]);

  function normalizeWhitespace(value) {
    return String(value == null ? "" : value).replace(/\s+/g, " ").trim();
  }

  function normalizeIdentity(value) {
    return normalizeWhitespace(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function ordinalCompare(left, right) {
    return String(left).localeCompare(String(right), "en", { sensitivity: "variant", numeric: false });
  }

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function canonicalize(value) {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (!isPlainObject(value)) return value;
    return Object.fromEntries(Object.keys(value).sort(ordinalCompare).map((key) => [key, canonicalize(value[key])]));
  }

  function stableStringify(value) {
    return JSON.stringify(canonicalize(value));
  }

  function sha256(value) {
    if (!crypto) throw new Error("SHA-256 is available only in the local Node authoring environment.");
    return crypto.createHash("sha256").update(Buffer.isBuffer(value) ? value : String(value)).digest("hex");
  }

  function uniqueSorted(values, normalizer = normalizeIdentity) {
    const byKey = new Map();
    (Array.isArray(values) ? values : []).forEach((value) => {
      const clean = normalizeWhitespace(value);
      const key = normalizer(clean);
      if (clean && key && !byKey.has(key)) byKey.set(key, clean);
    });
    return Array.from(byKey.values()).sort(ordinalCompare);
  }

  function contentPresent(value) {
    if (typeof value === "string") return normalizeWhitespace(value).length >= 20;
    if (Array.isArray(value)) return value.length > 0 && value.every((item) => contentPresent(item) || (isPlainObject(item) && Object.values(item).some(contentPresent)));
    if (isPlainObject(value)) return Object.values(value).some(contentPresent);
    return false;
  }

  function contentText(value) {
    if (typeof value === "string") return normalizeWhitespace(value);
    if (Array.isArray(value)) return value.map(contentText).filter(Boolean).join(" ");
    if (isPlainObject(value)) return Object.values(value).map(contentText).filter(Boolean).join(" ");
    return "";
  }

  function architectureDefinition() {
    return {
      architectureVersion: ARCHITECTURE_VERSION,
      domainId: DOMAIN_ID,
      canonicalOwner: CANONICAL_OWNER,
      runtimeCollection: RUNTIME_COLLECTION,
      browseBranches: BROWSE_BRANCHES,
      requiredContentGroups: REQUIRED_CONTENT_GROUPS,
      approachTypes: APPROACH_TYPES,
      procedureIntents: PROCEDURE_INTENTS,
      urgencyTypes: URGENCY_TYPES,
      aliasKinds: ALIAS_KINDS,
      relationshipTypes: RELATIONSHIP_TYPES,
      targetCollections: TARGET_COLLECTIONS,
      relationshipTargetCollections: RELATIONSHIP_TARGET_COLLECTIONS,
      pilotIds: PILOT_IDS,
      supplementalRequestedIds: SUPPLEMENTAL_IDS,
      identityPolicy: "One canonical procedure card may belong to multiple browse branches; memberships never clone content.",
      safetyPolicy: "Nursing education only; no operative manual detail, universal medication changes, or universal NPO-after-midnight instruction.",
      safetyPresentationPolicy: "A reviewed card must list every normally collapsed section containing safety-critical guidance in safetyVisibleSectionIds so the generated runtime keeps that section initially visible."
    };
  }

  function architectureSha256() {
    return sha256(stableStringify(architectureDefinition()));
  }

  function issue(code, path, message, options = {}) {
    return {
      code,
      path,
      message,
      severity: options.severity || "error",
      blocking: options.blocking !== false,
      systemic: options.systemic === true,
      requiresMedicalReview: options.requiresMedicalReview === true,
      ...(options.value !== undefined ? { value: options.value } : {})
    };
  }

  function validateApproval(config, options = {}) {
    const issues = [];
    if (!isPlainObject(config)) return { valid: false, accepted: false, issues: [issue("surgery-approval-invalid", "approval", "Approval configuration must be an object.", { systemic: true })] };
    if (config.schemaVersion !== APPROVAL_SCHEMA_VERSION) issues.push(issue("surgery-approval-schema-version", "approval.schemaVersion", `Expected ${APPROVAL_SCHEMA_VERSION}.`, { value: config.schemaVersion, systemic: true }));
    if (config.architectureVersion !== ARCHITECTURE_VERSION) issues.push(issue("surgery-approval-architecture-version", "approval.architectureVersion", `Expected ${ARCHITECTURE_VERSION}.`, { value: config.architectureVersion, systemic: true }));
    if (config.architectureStatus !== "APPROVED") issues.push(issue("surgery-architecture-not-approved", "approval.architectureStatus", "The pilot architecture must be explicitly APPROVED.", { value: config.architectureStatus, systemic: true }));
    if (config.pilotPublicationEnabled !== true) issues.push(issue("surgery-pilot-publication-disabled", "approval.pilotPublicationEnabled", "The bounded pilot publication gate must be true.", { systemic: true }));
    if (config.massExpansionEnabled !== false) issues.push(issue("surgery-mass-expansion-must-remain-disabled", "approval.massExpansionEnabled", "Mass expansion must remain disabled until the 15-pilot framework is separately approved.", { systemic: true }));
    const expectedHash = architectureSha256();
    const actualHash = normalizeWhitespace(config.approvedArchitectureSha256).toLowerCase();
    if (actualHash !== expectedHash) issues.push(issue("surgery-architecture-approval-mismatch", "approval.approvedArchitectureSha256", "Approval hash does not match the canonical architecture.", { value: { expected: expectedHash, actual: actualHash }, systemic: true }));
    const allowed = uniqueSorted(config.allowedEntryIds || [], (value) => value);
    if (stableStringify(allowed) !== stableStringify(ALLOWED_ENTRY_IDS.slice().sort(ordinalCompare))) {
      issues.push(issue("surgery-approval-entry-scope", "approval.allowedEntryIds", "Approval must be limited to the exact 15 pilots plus SEEG.", { value: allowed, systemic: true }));
    }
    if (options.hasContent === false) issues.push(issue("surgery-approved-source-empty", "approval", "The approved bounded pilot source is empty.", { systemic: true }));
    return { valid: !issues.some((entry) => entry.blocking), accepted: !issues.some((entry) => entry.blocking), expectedArchitectureSha256: expectedHash, issues };
  }

  function normalizeAlias(alias) {
    if (typeof alias === "string") return { value: normalizeWhitespace(alias), kind: "alternative-name", identity: true };
    return { value: normalizeWhitespace(alias && alias.value), kind: normalizeWhitespace(alias && alias.kind), identity: alias && alias.identity !== false };
  }

  function validateSourceReference(reference, index) {
    const path = `sourceReferences[${index}]`;
    const issues = [];
    ["key", "title", "organization", "tier", "publicationOrRevisionDate", "url", "accessedAt", "evidenceRole"].forEach((field) => {
      if (!normalizeWhitespace(reference && reference[field])) issues.push(issue("surgery-source-metadata-missing", `${path}.${field}`, `Source reference requires ${field}.`, { requiresMedicalReview: true }));
    });
    if (reference && reference.url && !/^https:\/\//i.test(reference.url)) issues.push(issue("surgery-source-url-invalid", `${path}.url`, "Source URL must use HTTPS.", { value: reference.url }));
    if (reference && reference.tier && !["Tier 1", "Tier 2", "Tier 3"].includes(reference.tier)) issues.push(issue("surgery-source-tier-invalid", `${path}.tier`, "Source tier must be Tier 1, Tier 2, or Tier 3.", { value: reference.tier }));
    return issues;
  }

  function validateEntry(entry, index, sourceKeys) {
    const path = `entries[${index}]`;
    const issues = [];
    const branchIds = new Set(BROWSE_BRANCHES.map((branch) => branch.id));
    if (!ALLOWED_ENTRY_IDS.includes(normalizeWhitespace(entry && entry.id))) issues.push(issue("surgery-entry-outside-approved-scope", `${path}.id`, "Entry ID is outside the exact 15-pilot-plus-SEEG scope.", { value: entry && entry.id, systemic: true }));
    if (!normalizeWhitespace(entry && entry.name)) issues.push(issue("surgery-name-missing", `${path}.name`, "Canonical procedure name is required."));
    if (!branchIds.has(normalizeWhitespace(entry && entry.primaryBranchId))) issues.push(issue("surgery-primary-branch-invalid", `${path}.primaryBranchId`, "Primary browse branch is not registered.", { value: entry && entry.primaryBranchId }));
    const browseIds = Array.isArray(entry && entry.browseBranchIds) ? entry.browseBranchIds.map(normalizeWhitespace) : [];
    if (!browseIds.length || !browseIds.includes(normalizeWhitespace(entry && entry.primaryBranchId))) issues.push(issue("surgery-primary-membership-missing", `${path}.browseBranchIds`, "Browse memberships must include the primary branch."));
    browseIds.filter((id) => !branchIds.has(id)).forEach((id) => issues.push(issue("surgery-browse-branch-invalid", `${path}.browseBranchIds`, "Browse membership references an unknown branch.", { value: id })));
    if (new Set(browseIds).size !== browseIds.length) issues.push(issue("surgery-duplicate-branch-membership", `${path}.browseBranchIds`, "A canonical card cannot repeat a browse membership."));

    const classification = entry && entry.classification;
    if (!isPlainObject(classification)) issues.push(issue("surgery-classification-missing", `${path}.classification`, "Structured procedure classification is required."));
    else {
      const approaches = Array.isArray(classification.approaches) ? classification.approaches : [];
      const intents = Array.isArray(classification.intents) ? classification.intents : [];
      const urgency = Array.isArray(classification.urgency) ? classification.urgency : [];
      if (!approaches.length || approaches.some((value) => !APPROACH_TYPES.includes(value))) issues.push(issue("surgery-approach-invalid", `${path}.classification.approaches`, "At least one canonical approach type is required.", { value: approaches }));
      if (!intents.length || intents.some((value) => !PROCEDURE_INTENTS.includes(value))) issues.push(issue("surgery-intent-invalid", `${path}.classification.intents`, "Procedure intent must use diagnostic and/or therapeutic.", { value: intents }));
      if (!urgency.length || urgency.some((value) => !URGENCY_TYPES.includes(value))) issues.push(issue("surgery-urgency-invalid", `${path}.classification.urgency`, "At least one urgency classification is required.", { value: urgency }));
    }

    const aliases = Array.isArray(entry && entry.aliases) ? entry.aliases.map(normalizeAlias) : [];
    if (!aliases.length) issues.push(issue("surgery-aliases-missing", `${path}.aliases`, "Search aliases are required."));
    aliases.forEach((alias, aliasIndex) => {
      if (!alias.value || !ALIAS_KINDS.includes(alias.kind)) issues.push(issue("surgery-alias-invalid", `${path}.aliases[${aliasIndex}]`, "Each alias requires a value and registered alias kind.", { value: alias }));
    });
    if (new Set(aliases.map((alias) => normalizeIdentity(alias.value))).size !== aliases.length) issues.push(issue("surgery-duplicate-alias", `${path}.aliases`, "Aliases must be unique after normalization."));

    const groups = isPlainObject(entry && entry.contentGroups) ? entry.contentGroups : {};
    const safetyVisibleSectionIds = Array.isArray(entry && entry.safetyVisibleSectionIds)
      ? entry.safetyVisibleSectionIds.map(normalizeWhitespace)
      : [];
    if (new Set(safetyVisibleSectionIds).size !== safetyVisibleSectionIds.length) {
      issues.push(issue("surgery-safety-visible-section-duplicate", `${path}.safetyVisibleSectionIds`, "Safety-visible section IDs must be unique.", { value: safetyVisibleSectionIds }));
    }
    safetyVisibleSectionIds.filter((id) => !DISCLOSURE_CONTENT_GROUP_IDS.includes(id)).forEach((id) => {
      issues.push(issue("surgery-safety-visible-section-invalid", `${path}.safetyVisibleSectionIds`, "Safety-visible overrides may name only registered disclosure sections.", { value: id }));
    });
    REQUIRED_CONTENT_GROUPS.forEach((definition) => {
      const group = groups[definition.id];
      const hasNotApplicable = definition.allowsNotApplicable && isPlainObject(group) && normalizeWhitespace(group.notApplicableReason).length >= 20;
      if (!isPlainObject(group) || (!contentPresent(group.content) && !hasNotApplicable)) issues.push(issue("surgery-content-group-missing", `${path}.contentGroups.${definition.id}`, `${definition.label} requires substantive content or an allowed not-applicable rationale.`, { requiresMedicalReview: true }));
      const keys = Array.isArray(group && group.sourceKeys) && group.sourceKeys.length
        ? group.sourceKeys
        : (Array.isArray(entry && entry.sourceKeys) ? entry.sourceKeys : []);
      if (!keys.length || keys.some((key) => !sourceKeys.has(normalizeWhitespace(key)))) issues.push(issue("surgery-content-source-missing", `${path}.contentGroups.${definition.id}.sourceKeys`, `${definition.label} must bind to existing source keys.`, { value: keys, requiresMedicalReview: true }));
    });

    const allText = contentText(groups);
    if (/\bNPO\s+after\s+midnight\b/i.test(allText)) issues.push(issue("surgery-universal-npo-after-midnight", `${path}.contentGroups`, "Use the individualized ordered fasting plan; do not state universal NPO after midnight.", { requiresMedicalReview: true }));
    if (/\bfrequently tested on (?:the )?NCLEX\b/i.test(allText)) issues.push(issue("surgery-unsupported-nclex-frequency", `${path}.contentGroups.nclex-and-exam-focus`, "Use high-yield nursing examination concept without unsupported frequency claims."));
    const medicationDirectivePattern = /\b(?:stop|hold|discontinue)\b[^.]{0,100}\b(?:anticoagulant|antiplatelet|insulin|diabetes medication|prescribed medication)s?\b/ig;
    const unsafeMedicationDirective = Array.from(allText.matchAll(medicationDirectivePattern)).some((match) => {
      const prefix = allText.slice(Math.max(0, match.index - 18), match.index);
      return !/(?:never|do not|should not)\s*$/i.test(prefix);
    });
    if (unsafeMedicationDirective) {
      issues.push(issue("surgery-unsafe-medication-direction", `${path}.contentGroups`, "Medication-change language requires the exact reviewed prescriber-direction safeguard.", { requiresMedicalReview: true }));
    }
    if (/\b(?:todo|tbd|placeholder|lorem ipsum|fill this|coming soon)\b/i.test(allText)) issues.push(issue("surgery-placeholder-content", `${path}.contentGroups`, "Published pilot content cannot contain placeholders."));

    const sourceList = uniqueSorted(entry && entry.sourceKeys || [], (value) => value);
    if (sourceList.length < 2 || sourceList.some((key) => !sourceKeys.has(key))) issues.push(issue("surgery-entry-source-count", `${path}.sourceKeys`, "Each procedure requires at least two valid reputable sources.", { value: sourceList, requiresMedicalReview: true }));
    const relationships = Array.isArray(entry && entry.relationships) ? entry.relationships : [];
    relationships.forEach((relationship, relationshipIndex) => {
      const target = relationship && relationship.target;
      if (!RELATIONSHIP_TYPES.includes(relationship && relationship.type)) issues.push(issue("surgery-relationship-type-invalid", `${path}.relationships[${relationshipIndex}].type`, "Relationship type is not registered.", { value: relationship && relationship.type }));
      if (!isPlainObject(target) || !TARGET_COLLECTIONS.includes(target.targetCollection) || !normalizeWhitespace(target.canonicalTitle)) issues.push(issue("surgery-relationship-target-invalid", `${path}.relationships[${relationshipIndex}].target`, "Relationship targets require an exact registered collection and canonical title.", { value: target }));
      const allowedCollections = RELATIONSHIP_TARGET_COLLECTIONS[relationship && relationship.type] || [];
      if (isPlainObject(target) && allowedCollections.length && !allowedCollections.includes(target.targetCollection)) issues.push(issue("surgery-relationship-classification-invalid", `${path}.relationships[${relationshipIndex}].target.targetCollection`, "Relationship type cannot target the declared collection.", { value: { type: relationship && relationship.type, targetCollection: target.targetCollection, allowedCollections } }));
      const keys = Array.isArray(relationship && relationship.sourceKeys) ? relationship.sourceKeys : [];
      if (!keys.length || keys.some((key) => !sourceKeys.has(normalizeWhitespace(key)))) issues.push(issue("surgery-relationship-source-missing", `${path}.relationships[${relationshipIndex}].sourceKeys`, "Every relationship requires supporting source keys.", { requiresMedicalReview: true }));
    });
    const relationshipKeys = relationships.map((relationship) => `${relationship.type}|${relationship.target && relationship.target.targetCollection}|${normalizeIdentity(relationship.target && relationship.target.canonicalTitle)}`);
    if (new Set(relationshipKeys).size !== relationshipKeys.length) issues.push(issue("surgery-duplicate-relationship", `${path}.relationships`, "Duplicate procedure relationships are not allowed."));

    const expectedSequence = PILOT_IDS.indexOf(entry && entry.id) + 1;
    if (SUPPLEMENTAL_IDS.includes(entry && entry.id)) {
      if (entry.pilotSequence != null || entry.supplementalRequested !== true) issues.push(issue("surgery-supplemental-scope-invalid", path, "SEEG and the Sengstaken-Blakemore tube are separately requested supplements, not additional numbered pilots."));
    } else if (entry && entry.pilotSequence !== expectedSequence) {
      issues.push(issue("surgery-pilot-sequence-invalid", `${path}.pilotSequence`, "Pilot sequence must match the approved 1-15 order.", { value: entry && entry.pilotSequence }));
    }
    return issues;
  }

  function validateCatalog(catalog, approval) {
    const issues = [];
    if (!isPlainObject(catalog)) return { valid: false, issues: [issue("surgery-catalog-invalid", "catalog", "Catalog must be an object.", { systemic: true })] };
    if (catalog.schemaVersion !== SCHEMA_VERSION) issues.push(issue("surgery-catalog-schema-version", "schemaVersion", `Expected ${SCHEMA_VERSION}.`, { value: catalog.schemaVersion, systemic: true }));
    if (catalog.architectureVersion !== ARCHITECTURE_VERSION) issues.push(issue("surgery-catalog-architecture-version", "architectureVersion", `Expected ${ARCHITECTURE_VERSION}.`, { value: catalog.architectureVersion, systemic: true }));
    if (catalog.generatorVersion !== GENERATOR_VERSION) issues.push(issue("surgery-catalog-generator-version", "generatorVersion", `Expected ${GENERATOR_VERSION}.`, { value: catalog.generatorVersion, systemic: true }));
    const expectedHash = architectureSha256();
    if (normalizeWhitespace(catalog.architectureSha256).toLowerCase() !== expectedHash) issues.push(issue("surgery-source-architecture-fingerprint-drift", "architectureSha256", "Catalog hash does not match the canonical architecture.", { value: { expected: expectedHash, actual: catalog.architectureSha256 }, systemic: true }));

    const references = Array.isArray(catalog.sourceReferences) ? catalog.sourceReferences : [];
    const sourceKeys = new Set();
    references.forEach((reference, index) => {
      validateSourceReference(reference, index).forEach((entry) => issues.push(entry));
      const key = normalizeWhitespace(reference && reference.key);
      if (sourceKeys.has(key)) issues.push(issue("surgery-duplicate-source-key", `sourceReferences[${index}].key`, "Source keys must be unique.", { value: key }));
      if (key) sourceKeys.add(key);
    });

    const entries = Array.isArray(catalog.entries) ? catalog.entries : [];
    const entryIds = entries.map((entry) => normalizeWhitespace(entry && entry.id));
    if (entries.length !== ALLOWED_ENTRY_IDS.length) issues.push(issue("surgery-bounded-cardinality", "entries", "The bounded source must contain exactly 15 pilots plus SEEG and Sengstaken-Blakemore tube (17 cards).", { value: entries.length, systemic: true }));
    if (stableStringify(entryIds.slice().sort(ordinalCompare)) !== stableStringify(ALLOWED_ENTRY_IDS.slice().sort(ordinalCompare))) issues.push(issue("surgery-bounded-identity-set", "entries", "The entry set must exactly match the approved 15 pilots and two supplemental IDs.", { value: entryIds, systemic: true }));
    entries.forEach((entry, index) => validateEntry(entry, index, sourceKeys).forEach((entryIssue) => issues.push(entryIssue)));

    const identityOwners = new Map();
    entries.forEach((entry) => {
      [entry.name, entry.displayName, entry.abbreviation, ...(entry.aliases || []).map((alias) => normalizeAlias(alias).value)]
        .map(normalizeIdentity).filter(Boolean).forEach((identity) => {
          const owners = identityOwners.get(identity) || new Set();
          owners.add(entry.id);
          identityOwners.set(identity, owners);
        });
    });
    identityOwners.forEach((owners, identity) => {
      if (owners.size > 1) issues.push(issue("surgery-ambiguous-canonical-alias", "entries.aliases", "An identity alias is owned by multiple procedure cards.", { value: { identity, owners: Array.from(owners) }, systemic: true }));
    });

    const sourceByKey = new Map(references.map((reference) => [reference.key, reference]));
    entries.forEach((entry, index) => {
      const sources = (entry.sourceKeys || []).map((key) => sourceByKey.get(key)).filter(Boolean);
      if (!sources.some((source) => source.tier === "Tier 1")) issues.push(issue("surgery-tier-one-source-missing", `entries[${index}].sourceKeys`, "Each pilot needs at least one Tier 1 source when available.", { requiresMedicalReview: true }));
      if (!sources.some((source) => /specialty|procedure-specific/i.test(source.evidenceRole))) issues.push(issue("surgery-specialty-source-missing", `entries[${index}].sourceKeys`, "Each pilot needs a procedure-specific or specialty source.", { requiresMedicalReview: true }));
    });

    const approvalResult = validateApproval(approval, { hasContent: entries.length > 0 });
    approvalResult.issues.forEach((entry) => issues.push(entry));
    return {
      valid: !issues.some((entry) => entry.blocking),
      approvalAccepted: approvalResult.accepted,
      architectureSha256: expectedHash,
      entryCount: entries.length,
      pilotCount: entries.filter((entry) => Number.isInteger(entry.pilotSequence)).length,
      supplementalCount: entries.filter((entry) => entry.supplementalRequested === true).length,
      sourceCount: references.length,
      issues
    };
  }

  function assertValidCatalog(catalog, approval) {
    const result = validateCatalog(catalog, approval);
    if (!result.valid) {
      const error = new Error(`Surgeries & Procedures catalog has ${result.issues.filter((entry) => entry.blocking).length} blocking issue(s).`);
      error.code = "ani_surgery_procedures_catalog_invalid";
      error.issues = result.issues;
      throw error;
    }
    return result;
  }

  function flattenGroupForRuntime(group) {
    if (!isPlainObject(group)) return group;
    if (Object.prototype.hasOwnProperty.call(group, "content")) return cloneJson(group.content);
    return normalizeWhitespace(group.notApplicableReason);
  }

  function buildCrossLinkRecords(entry) {
    return (Array.isArray(entry.relationships) ? entry.relationships : []).map((relationship, index) => ({
      id: `${entry.id}:link:${index + 1}`,
      sourceId: entry.id,
      relationshipType: relationship.type,
      label: normalizeWhitespace(relationship.label || relationship.target.canonicalTitle),
      targetCollection: relationship.target.targetCollection,
      canonicalTitle: relationship.target.canonicalTitle,
      ...(relationship.target.targetId ? { targetId: relationship.target.targetId } : {}),
      sourceKeys: uniqueSorted(relationship.sourceKeys || [], (value) => value)
    }));
  }

  function buildEntry(entry) {
    const source = cloneJson(entry);
    const branch = BROWSE_BRANCHES.find((candidate) => candidate.id === source.primaryBranchId);
    const aliasRecords = (source.aliases || []).map(normalizeAlias);
    const abbreviations = aliasRecords.filter((alias) => alias.kind === "abbreviation").map((alias) => alias.value);
    const misspellings = aliasRecords.filter((alias) => alias.kind === "common-misspelling").map((alias) => alias.value);
    const quickAnswer = contentText(source.contentGroups["quick-definition"].content);
    const whyItMatters = contentText(source.contentGroups["why-it-matters"].content);
    const safetyVisibleSectionIds = new Set(source.safetyVisibleSectionIds || []);
    const sections = REQUIRED_CONTENT_GROUPS.slice(1).map((definition) => ({
      id: definition.id,
      label: definition.label,
      content: flattenGroupForRuntime(source.contentGroups[definition.id]),
      presentation: safetyVisibleSectionIds.has(definition.id) ? "essential" : definition.presentation,
      sourceKeys: uniqueSorted(
        Array.isArray(source.contentGroups[definition.id].sourceKeys) && source.contentGroups[definition.id].sourceKeys.length
          ? source.contentGroups[definition.id].sourceKeys
          : source.sourceKeys || [],
        (value) => value
      )
    }));
    const crossLinkRecords = buildCrossLinkRecords(source);
    return {
      id: source.id,
      directTargetId: source.id,
      name: source.name,
      ...(source.displayName ? { displayName: source.displayName } : {}),
      fullForm: source.name,
      type: "procedure",
      category: `${CANONICAL_OWNER} / ${branch.label}`,
      icon: "SU",
      nclexEssential: true,
      summary: quickAnswer,
      quickAnswer,
      whyItMatters,
      aliases: aliasRecords.map((alias) => alias.value),
      typedAliases: aliasRecords,
      abbreviations,
      commonMisspellings: misspellings,
      searchTerms: uniqueSorted([source.name, source.displayName, ...(source.searchTerms || []), ...aliasRecords.map((alias) => alias.value)]),
      sections,
      crossLinkRecords,
      relatedTopics: crossLinkRecords.map((record) => record.label),
      sourceKeys: uniqueSorted(source.sourceKeys || [], (value) => value),
      sourceNote: source.sourceNote,
      encyclopediaSection: DOMAIN_ID,
      encyclopediaDomains: [DOMAIN_ID],
      primaryDomain: CANONICAL_OWNER,
      browse: { branchId: source.primaryBranchId, branchIds: source.browseBranchIds.slice(), label: branch.label },
      procedure: {
        classification: cloneJson(source.classification),
        primaryBranchId: source.primaryBranchId,
        browseBranchIds: source.browseBranchIds.slice(),
        pilotSequence: source.pilotSequence == null ? null : source.pilotSequence,
        supplementalRequested: source.supplementalRequested === true,
        safetyVisibleSectionIds: Array.from(safetyVisibleSectionIds).sort(ordinalCompare)
      },
      surgeryProcedure: {
        schemaVersion: RUNTIME_SCHEMA_VERSION,
        architectureVersion: ARCHITECTURE_VERSION,
        generatorVersion: GENERATOR_VERSION,
        canonicalOwner: CANONICAL_OWNER,
        runtimeCollection: RUNTIME_COLLECTION,
        stableId: source.id,
        sourceEntrySha256: sha256(stableStringify(source)),
        reviewStatus: source.reviewStatus,
        reviewedAt: source.reviewedAt,
        reviewDueAt: source.reviewDueAt
      },
      studentFacing: true,
      hidden: false
    };
  }

  return Object.freeze({
    SCHEMA_VERSION,
    APPROVAL_SCHEMA_VERSION,
    ARCHITECTURE_VERSION,
    GENERATOR_VERSION,
    RUNTIME_SCHEMA_VERSION,
    DOMAIN_ID,
    CANONICAL_OWNER,
    RUNTIME_COLLECTION,
    BROWSE_BRANCHES,
    REQUIRED_CONTENT_GROUPS,
    DISCLOSURE_CONTENT_GROUP_IDS,
    APPROACH_TYPES,
    PROCEDURE_INTENTS,
    URGENCY_TYPES,
    ALIAS_KINDS,
    RELATIONSHIP_TYPES,
    TARGET_COLLECTIONS,
    RELATIONSHIP_TARGET_COLLECTIONS,
    PILOT_IDS,
    SEEG_ID,
    SENGSTAKEN_BLAKEMORE_ID,
    SUPPLEMENTAL_IDS,
    ALLOWED_ENTRY_IDS,
    normalizeWhitespace,
    normalizeIdentity,
    ordinalCompare,
    stableStringify,
    sha256,
    uniqueSorted,
    contentPresent,
    contentText,
    architectureDefinition,
    architectureSha256,
    validateApproval,
    validateCatalog,
    assertValidCatalog,
    buildCrossLinkRecords,
    buildEntry
  });
});
