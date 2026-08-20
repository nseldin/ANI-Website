(function initializeAniGapDetector(root, factory) {
  "use strict";

  const api = factory();
  if (root && typeof root === "object") root.ANIGapDetector = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis, function createAniGapDetectorModule() {
  "use strict";

  const VERIFIER_VERSION = "ani-gap-detector-v1";
  const CLASSIFICATIONS = Object.freeze({
    EXISTING_DISCOVERY_FAILURE: "EXISTING_DISCOVERY_FAILURE",
    VERIFIED_MISSING: "VERIFIED_MISSING",
    AMBIGUOUS: "AMBIGUOUS"
  });
  const EVENT_FIELDS = Object.freeze([
    "concept",
    "normalizedConcept",
    "classification",
    "detectionOrigin",
    "reasonCode",
    "rejectionCount",
    "attemptCount",
    "verifierVersion",
    "indexComplete",
    "checkedLayers",
    "resultCounts",
    "matchStatus",
    "appliedVariants",
    "destinations",
    "categoryHint",
    "confidence"
  ]);
  const ALLOWED_CHECKED_LAYERS = new Set([
    "canonical-title",
    "aliases",
    "abbreviations",
    "spelling-variants",
    "near-identity",
    "phonetic-variants",
    "reviewed-routes",
    "whole-encyclopedia",
    "clinical-search"
  ]);
  const ALLOWED_COLLECTIONS = new Set(["drug", "lab", "pathology", "reference", "holistic"]);
  const ALLOWED_CATEGORY_HINTS = new Set([...ALLOWED_COLLECTIONS, "unknown"]);
  const ALLOWED_ORIGINS = new Set([
    "repeated_rejection",
    "explicit_search",
    "answer_abstained"
  ]);
  const ALLOWED_REASON_CODES = new Set([
    "zero_results",
    "no_confident_destination",
    "user_rejected_suggestions",
    "answer_abstained_missing_topic"
  ]);
  const ALLOWED_CONFIDENCE = new Set(["medium", "high"]);
  const OUT_OF_SCOPE_PATTERN = /\b(?:pizza|recipe|cooking|baking|weather|forecast|sports?\s+(?:score|result)|lottery|stock\s+(?:price|market|ticker)|cryptocurrency|bitcoin|movie|song|lyrics|celebrity|hotel|flight|travel\s+itinerary|shopping|coupon|video\s+game|javascript|python\s+code|computer\s+code|coding|heart\s+emoji|blood\s+moon|brain\s+teaser|drug\s+cartel|medical\s+billing|patient\s+schedul(?:e|es|ed|ing))\b/i;
  const CLINICAL_MORPHOLOGY_PATTERN = /\b[a-z][a-z0-9'-]{3,}(?:itis|osis|iasis|emia|aemia|oma|opathy|pathy|plegia|paresis|uria|penia|cytosis|ectomy|otomy|ostomy|plasty|scopy|graphy|gram|genic|cyte|blast|trophy|megaly|phagia|pnea|rrhea|algia|lepsy|mab|nib|vir|cillin|pril|sartan|olol|statin)\b/i;
  const CLINICAL_SIGNAL_TERMS = new Set([
    "acute", "chronic", "clinical", "diagnosis", "diagnostic", "disease", "syndrome", "disorder",
    "infection", "infectious", "cancer", "tumor", "tumour", "neoplasm", "injury", "fracture", "wound",
    "pain", "fever", "symptom", "sign", "drug", "medication", "medicine", "dose", "dosage", "pharmacology",
    "laboratory", "lab", "test", "assay", "procedure", "surgery", "therapy", "treatment", "nursing", "medical",
    "patient", "blood", "platelet", "cardiac", "heart", "failure", "pulmonary", "lung", "respiratory", "renal",
    "kidney", "hepatic", "liver", "neurologic", "brain", "nerve", "immune", "immunologic", "endocrine",
    "gastrointestinal", "sepsis", "shock", "pregnancy", "pediatric", "neonatal", "geriatric",
    "thrombocytopenia", "thrombocytopenic", "purpura", "metabolic"
  ]);
  const HIGH_SPECIFICITY_MEDICAL_PATTERN = /\b(?:diagnosis|diagnostic|disease|disorder|infection|infectious|cancer|tumou?r|neoplasm|fracture|wound|fever|symptom|medication|dosage|pharmacology|laboratory|assay|surgery|therapy|treatment|nursing|platelet|cardiac|pulmonary|respiratory|renal|hepatic|neurologic|immune|immunologic|endocrine|gastrointestinal|metabolic|sepsis|pregnancy|pediatric|neonatal|geriatric|stroke|asthma|diabetes|delirium|dementia|seizure|epilepsy|hypertension|hypotension|arrhythmia|anaphylaxis|thrombosis|embolism|infarction|h(?:a)?emorrhage|nociception)\b/i;
  const TOPIC_STOPWORDS = new Set(["a", "an", "and", "or", "of", "in", "on", "for", "to", "with", "without", "due", "by", "the", "versus", "vs"]);
  const TOPIC_CONNECTORS = new Set([
    "associated", "related", "induced", "mediated", "dependent", "resistant", "sensitive",
    "signaling", "signalling", "deficiency", "toxicity", "modulation", "regulation", "pathway", "pathways",
    "type", "stage", "grade", "adult", "childhood", "familial", "congenital", "acquired", "primary",
    "secondary", "idiopathic", "refractory", "recurrent", "localized", "localised", "systemic", "endogenous", "exogenous"
  ]);
  const PERSON_NAME_STOPWORDS = new Set([
    ...TOPIC_STOPWORDS, ...TOPIC_CONNECTORS,
    "has", "had", "is", "was", "reports", "reported", "developed", "started", "needs", "takes", "feels",
    "experiences", "experienced", "experiencing", "suffers", "suffered", "suffering", "presented", "presenting",
    "complains", "complained", "complaining", "diagnosed", "diagnosing", "from", "about", "regarding", "concerning",
    "i", "ii", "iii", "iv", "v", "vi", "rare"
  ]);

  function cleanText(value, maximum = 180) {
    return String(value == null ? "" : value)
      .replace(/\u0000/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maximum);
  }

  function normalizeConcept(value) {
    return cleanText(value, 180)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[^a-z0-9'+./ -]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180);
  }

  function normalizeGapToken(value) {
    return normalizeConcept(value).replace(/^[^a-z]+|[^a-z]+$/g, "");
  }

  function isGapClinicalToken(value) {
    const token = normalizeGapToken(value);
    const singular = token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token;
    return Boolean(token) && (CLINICAL_SIGNAL_TERMS.has(token) || CLINICAL_SIGNAL_TERMS.has(singular)
      || HIGH_SPECIFICITY_MEDICAL_PATTERN.test(token) || HIGH_SPECIFICITY_MEDICAL_PATTERN.test(singular)
      || CLINICAL_MORPHOLOGY_PATTERN.test(token) || CLINICAL_MORPHOLOGY_PATTERN.test(singular));
  }

  function isPlausiblePersonalNameToken(value) {
    const token = normalizeGapToken(value).replace(/['’]s$/i, "");
    return /^[a-z][a-z'-]{1,24}$/.test(token)
      && !PERSON_NAME_STOPWORDS.has(token)
      && !isGapClinicalToken(token);
  }

  function boundedInteger(value, maximum = 100000) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(maximum, Math.trunc(number)));
  }

  function uniqueBoundedStrings(values, maximumItems = 12, maximumLength = 80, allowed = null, identity = null) {
    const seen = new Set();
    const output = [];
    (Array.isArray(values) ? values : []).forEach((value) => {
      const text = cleanText(value, maximumLength);
      const key = text && typeof identity === "function" ? identity(text) : text;
      if (!text || !key || seen.has(key) || (allowed && !allowed.has(text))) return;
      seen.add(key);
      output.push(text);
    });
    return output.slice(0, maximumItems);
  }

  function sanitizeResultCounts(source = {}) {
    if (!source || typeof source !== "object" || Array.isArray(source)) return {};
    const output = {};
    Object.keys(source).sort().slice(0, 16).forEach((key) => {
      const safeKey = cleanText(key, 40);
      if (!/^[a-z][a-zA-Z0-9_-]{0,39}$/.test(safeKey)) return;
      output[safeKey] = boundedInteger(source[key]);
    });
    return output;
  }

  function sanitizeDestinations(values) {
    const seen = new Set();
    const output = [];
    (Array.isArray(values) ? values : []).forEach((value) => {
      const collection = cleanText(value?.collection, 24).toLowerCase();
      const canonicalTitle = cleanText(value?.canonicalTitle, 120);
      const populationKey = collection === "lab" ? cleanText(value?.populationKey, 60) : "";
      if (!ALLOWED_COLLECTIONS.has(collection)
        || !canonicalTitle
        || !looksPrivacySafeConcept(canonicalTitle, true)) return;
      const key = `${collection}|${canonicalTitle.toLowerCase()}|${populationKey.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      output.push({ collection, canonicalTitle, populationKey });
    });
    return output.slice(0, 5);
  }

  function looksPrivacySafeConcept(concept, explicitPrivacySafe) {
    if (explicitPrivacySafe !== true) return false;
    const text = cleanText(concept, 180);
    if (text.length < 3 || text.length > 180 || /[\r\n]/.test(String(concept || ""))) return false;
    if (/\b(?:mrn|medical record|account|email|phone|address|date of birth|dob)\b/i.test(text)) return false;
    if (/\b(?:my|our|this|the)\s+(?:patient|client|child|baby|toddler|mother|father|mom|dad)\b/i.test(text)) return false;
    if (/\b(?:patient|client|child|baby|toddler)\s+(?:named|has|have|is|are|was|were|reports?|developed?|started?)\b/i.test(text)) return false;
    if (isObviousPersonalGapNarrative(text)) return false;
    if (/(?:https?:\/\/|www\.|[\w.+-]+@[\w.-]+\.[a-z]{2,})/i.test(text)) return false;
    if (/\b\d{4,}\b/.test(text)) return false;
    return /[a-z]/i.test(text);
  }

  function isObviousPersonalGapNarrative(value) {
    const original = String(value || "").normalize("NFKC").trim();
    if (!original) return false;
    const capitalizedNameNarrative = /^\s*(?:(?:mr|mrs|ms|miss|dr)\.?\s+)?[A-Z][A-Za-z'’\-]{1,39}\s+[A-Z][A-Za-z'’\-]{1,39}\s+(?:has|had|is|was|reports?|developed?|started?|needs?|takes?|feels?|experienc(?:es|ed|ing)|with)\b/;
    const honorificNarrative = /^\s*(?:mr|mrs|ms|miss|dr)\.?\s+[A-Z][A-Za-z'’\-]{1,39}\s+(?:has|had|is|was|reports?|developed?|started?|needs?|takes?|feels?|experienc(?:es|ed|ing))\b/i;
    const explicitlyNamedPerson = /\b(?:patient|client|child|baby|toddler)\s+(?:named|called)\s+[A-Z][A-Za-z'’\-]{1,39}(?:\s+[A-Z][A-Za-z'’\-]{1,39})?\b/;
    const personRole = "(?:patient|client|person|man|woman|boy|girl|child|baby|toddler|mother|father|mom|dad|friend|neighbor|neighbour|relative|family\\s+member)";
    const relationshipNarrative = new RegExp(`\\b(?:my|our|his|her|their|this|the)\\s+${personRole}\\b`, "i");
    const leadingPersonRole = new RegExp(`^\\s*(?:(?:my|our|his|her|their|this|the|a|an)\\s+)?${personRole}(?:\\s+[a-z][a-z'’-]{1,39}){0,4}\\s+(?:has|had|is|was|reports?|developed?|started?|needs?|takes?|feels?|experienc(?:es|ed|ing)|with)\\b`, "i");
    const lowercaseNarrativeShape = /^(?:[a-z][a-z'-]{1,24}\s+){1,3}(?:has|had|reports?|developed?|started?|needs?|takes?|feels?|experienc(?:es|ed|ing)|suffers?|suffered|suffering|presented?|presenting|complains?|complained|complaining|diagnosed?|diagnosing|with)\b/i;
    const tokens = normalizeConcept(original).split(" ").map(normalizeGapToken).filter(Boolean);
    const hasClinicalTokenOutside = (leftIndex, rightIndex) => tokens.some((token, index) => (
      (index < leftIndex || index > rightIndex) && isGapClinicalToken(token)
    ));
    const containsNamePair = tokens.some((token, index) => index + 1 < tokens.length
      && isPlausiblePersonalNameToken(token)
      && isPlausiblePersonalNameToken(tokens[index + 1])
      && hasClinicalTokenOutside(index, index + 1));
    const containsNameWithMiddleInitial = tokens.some((token, index) => index + 2 < tokens.length
      && isPlausiblePersonalNameToken(token)
      && /^[a-z]$/.test(tokens[index + 1])
      && isPlausiblePersonalNameToken(tokens[index + 2])
      && hasClinicalTokenOutside(index, index + 2));
    const capitalizedNameAnywhere = Array.from(original.matchAll(/\b([A-Z][A-Za-z'’\-]{1,24})\s+(?:[A-Z]\.\s*)?([A-Z][A-Za-z'’\-]{1,24})\b/g))
      .some((match) => isPlausiblePersonalNameToken(match[1]) && isPlausiblePersonalNameToken(match[2]));
    const relationshipNameAnywhere = Array.from(original.matchAll(/\b(?:for|about|regarding|concerning)\s+(?:mr|mrs|ms|miss|dr)?\.?\s*([a-z][a-z'’\-]{1,24})\s+(?:[a-z]\.\s*)?([a-z][a-z'’\-]{1,24})\b/gi))
      .some((match) => isPlausiblePersonalNameToken(match[1]) && isPlausiblePersonalNameToken(match[2]));
    const relationshipSingleName = Array.from(original.matchAll(/\b(?:for|about|regarding|concerning)\s+(?:mr|mrs|ms|miss|dr)?\.?\s*([a-z][a-z'’\-]{1,24})\b/gi))
      .some((match) => isPlausiblePersonalNameToken(match[1]));
    const possessiveNameAnywhere = Array.from(original.matchAll(/\b([a-z][a-z'’\-]{1,24})\s+(?:[a-z]\.\s*)?([a-z][a-z'’\-]{1,24})['’]s\b/gi))
      .some((match) => isPlausiblePersonalNameToken(match[1]) && isPlausiblePersonalNameToken(match[2]));
    const possessiveSingleName = Array.from(original.matchAll(/\b([a-z][a-z'’\-]{1,24})['’]s\b/gi))
      .some((match) => isPlausiblePersonalNameToken(match[1]));
    return capitalizedNameNarrative.test(original)
      || honorificNarrative.test(original)
      || explicitlyNamedPerson.test(original)
      || relationshipNarrative.test(original)
      || leadingPersonRole.test(original)
      || lowercaseNarrativeShape.test(original)
      || containsNamePair
      || containsNameWithMiddleInitial
      || capitalizedNameAnywhere
      || relationshipNameAnywhere
      || relationshipSingleName
      || possessiveNameAnywhere
      || possessiveSingleName;
  }

  function medicalTopicShapeIsBounded(value) {
    const tokens = normalizeConcept(value).split(" ").map(normalizeGapToken).filter(Boolean);
    if (!tokens.length || !(HIGH_SPECIFICITY_MEDICAL_PATTERN.test(tokens[0])
      || CLINICAL_MORPHOLOGY_PATTERN.test(tokens[0]))) return false;
    return tokens.slice(1).every((token) => TOPIC_STOPWORDS.has(token)
      || TOPIC_CONNECTORS.has(token)
      || isGapClinicalToken(token));
  }

  function isPlausibleMissingMedicalConcept(concept, appliedVariants = []) {
    const original = String(concept || "").normalize("NFKC").trim();
    const variants = Array.isArray(appliedVariants) ? appliedVariants : [];
    const transmittedPhrases = [original, ...variants].map((value) => String(value || "").normalize("NFKC").trim());
    if (transmittedPhrases.some((value) => /\d/.test(value)
      || /\b(?:for|about|regarding|concerning)\b/i.test(value))) return false;
    const combined = [original, ...variants].join(" ");
    if (!/[A-Za-z]/.test(combined) || OUT_OF_SCOPE_PATTERN.test(combined)) return false;
    if (/(?:qwerty|asdfgh|zxcvb|hjkl|poiuy|lkjhg)|([a-z0-9])\1{4,}/i.test(combined)) return false;
    const tokens = normalizeConcept(original).split(" ").filter(Boolean);
    if (tokens.length === 1 && tokens[0].length >= 7 && !/[aeiouy]/.test(tokens[0])
      && !/^[A-Z][A-Z0-9+./-]{1,5}$/.test(original)) return false;
    return medicalTopicShapeIsBounded(original);
  }

  function totalResultCount(resultCounts = {}) {
    return Object.values(resultCounts).reduce((sum, value) => sum + boundedInteger(value), 0);
  }

  function proposalFor(classification, evidence, normalized) {
    if (classification === CLASSIFICATIONS.AMBIGUOUS) return null;
    const detectionOrigin = ALLOWED_ORIGINS.has(evidence.detectionOrigin)
      ? evidence.detectionOrigin
      : "answer_abstained";
    const reasonCode = ALLOWED_REASON_CODES.has(evidence.reasonCode)
      ? evidence.reasonCode
      : classification === CLASSIFICATIONS.EXISTING_DISCOVERY_FAILURE
        ? "no_confident_destination"
        : "answer_abstained_missing_topic";
    const confidence = ALLOWED_CONFIDENCE.has(evidence.confidence)
      ? evidence.confidence
      : classification === CLASSIFICATIONS.EXISTING_DISCOVERY_FAILURE
        ? "high"
        : boundedInteger(evidence.rejectionCount, 3) >= 2 ? "high" : "medium";
    const categoryHint = ALLOWED_CATEGORY_HINTS.has(evidence.categoryHint)
      ? evidence.categoryHint
      : "unknown";
    return {
      concept: normalized.concept,
      normalizedConcept: normalized.normalizedConcept,
      classification,
      detectionOrigin,
      reasonCode,
      rejectionCount: boundedInteger(evidence.rejectionCount, 3),
      attemptCount: Math.max(1, Math.min(4, boundedInteger(evidence.attemptCount, 4))),
      verifierVersion: VERIFIER_VERSION,
      indexComplete: evidence.indexComplete === true,
      checkedLayers: uniqueBoundedStrings(evidence.checkedLayers, 12, 48, ALLOWED_CHECKED_LAYERS),
      resultCounts: normalized.resultCounts,
      matchStatus: classification === CLASSIFICATIONS.EXISTING_DISCOVERY_FAILURE
        ? "existing-bound-destination"
        : "no-confident-match",
      appliedVariants: uniqueBoundedStrings(evidence.appliedVariants, 6, 120, null, normalizeConcept),
      destinations: classification === CLASSIFICATIONS.EXISTING_DISCOVERY_FAILURE
        ? normalized.destinations
        : [],
      categoryHint,
      confidence
    };
  }

  function classify(evidence = {}) {
    const concept = cleanText(evidence.concept, 180);
    const normalizedConcept = normalizeConcept(evidence.normalizedConcept || concept);
    const resultCounts = sanitizeResultCounts(evidence.resultCounts);
    const destinations = sanitizeDestinations(evidence.destinations);
    const normalized = { concept, normalizedConcept, resultCounts, destinations };
    const appliedVariants = uniqueBoundedStrings(evidence.appliedVariants, 6, 120, null, normalizeConcept);
    const safeAppliedVariants = appliedVariants.filter((value) => looksPrivacySafeConcept(value, true));
    const privacySafe = looksPrivacySafeConcept(concept, evidence.privacySafe)
      && safeAppliedVariants.length === appliedVariants.length;
    const ambiguous = evidence.ambiguous === true
      || evidence.identityAmbiguous === true
      || evidence.insufficientClues === true;
    const existingDestinationCount = boundedInteger(evidence.existingDestinationCount, 5);
    const verifiedExisting = evidence.existingMatchVerified === true
      && existingDestinationCount > 0
      && destinations.length > 0
      && destinations.length === existingDestinationCount;

    if (verifiedExisting && !ambiguous) {
      // A-class evidence describes ANI's failed route, not what the person
      // typed. Bind the proposal to exactly one verified public owner and
      // discard every request-derived phrase, even when it appeared harmless.
      // Downstream boundaries enforce this same canonical-only contract.
      const primaryDestination = destinations[0];
      const canonicalTitle = primaryDestination.canonicalTitle;
      const proposalNormalized = {
        concept: canonicalTitle,
        normalizedConcept: normalizeConcept(canonicalTitle),
        resultCounts,
        destinations: [primaryDestination]
      };
      const proposalEvidence = {
        ...evidence,
        appliedVariants: [],
        categoryHint: primaryDestination.collection
      };
      return {
        classification: CLASSIFICATIONS.EXISTING_DISCOVERY_FAILURE,
        proposal: proposalFor(CLASSIFICATIONS.EXISTING_DISCOVERY_FAILURE, proposalEvidence, proposalNormalized),
        reason: "bound-existing-primary-destination"
      };
    }

    if (!privacySafe || !normalizedConcept || ambiguous) {
      return {
        classification: CLASSIFICATIONS.AMBIGUOUS,
        proposal: null,
        reason: !privacySafe ? "privacy-or-scope" : "ambiguous-evidence"
      };
    }

    const noConfidentMatch = ["NO_CONFIDENT_MATCH", "NO_MATCH", "no-confident-match"].includes(cleanText(evidence.matchStatus, 80));
    const verifiedAbsent = evidence.indexComplete === true
      && evidence.identityMatchFound !== true
      && evidence.reviewedRouteFound !== true
      && existingDestinationCount === 0
      && destinations.length === 0
      && totalResultCount(resultCounts) === 0
      && noConfidentMatch;
    const plausibleMedicalScope = isPlausibleMissingMedicalConcept(concept, appliedVariants);
    if (verifiedAbsent && plausibleMedicalScope) {
      return {
        classification: CLASSIFICATIONS.VERIFIED_MISSING,
        proposal: proposalFor(CLASSIFICATIONS.VERIFIED_MISSING, evidence, normalized),
        reason: "complete-catalog-no-match"
      };
    }

    return {
      classification: CLASSIFICATIONS.AMBIGUOUS,
      proposal: null,
      reason: verifiedAbsent && !plausibleMedicalScope
        ? "medical-scope-unresolved"
        : evidence.indexComplete === true ? "unresolved-evidence" : "index-incomplete"
    };
  }

  function isClearRejection(value) {
    const reply = cleanText(value, 120)
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[^a-z0-9'\s-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return /^(?:no|nope|nah|wrong|not that|none|none of (?:these|those|them)|neither|neither one|neither of (?:these|those)|that'?s not it|thats not it|that is not it|not what i meant|that'?s not what i meant|thats not what i meant|that is not what i meant|not what i(?:'m| am) looking for|that'?s not what i(?:'m| am) looking for|thats not what i(?:'m| am) looking for|i(?:'m| am) looking for something else|i meant something else|try again|guess again|different one|something else)$/i.test(reply);
  }

  return Object.freeze({
    VERIFIER_VERSION,
    CLASSIFICATIONS,
    EVENT_FIELDS,
    normalizeConcept,
    isObviousPersonalGapNarrative,
    isPlausibleMissingMedicalConcept,
    isClearRejection,
    classify
  });
}));
