(function installAniLane4Runtime(root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root && !root.AniLane4Runtime) root.AniLane4Runtime = api;
  if (root && root.window && !root.window.AniLane4Runtime) root.window.AniLane4Runtime = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createAniLane4RuntimeApi() {
  "use strict";

  const RUNTIME_VERSION = "2026-07-29.2";
  const SAFETY_RULES_VERSION = "ani-lane4-safety-1";
  const DEFAULT_LIMITS = Object.freeze({
    maxRetrieved: 12,
    maxSelected: 5,
    maxContextEntries: 4,
    maxContextChars: 6000,
    maxCacheEntries: 120,
    localCacheTtlMs: 7 * 24 * 60 * 60 * 1000,
    aiCacheTtlMs: 24 * 60 * 60 * 1000,
    minimumLocalConfidence: 0.72,
    minimumRetrievalScore: 34
  });

  const ABBREVIATIONS = Object.freeze({
    copd: "chronic obstructive pulmonary disease",
    chf: "heart failure",
    hf: "heart failure",
    htn: "hypertension",
    mi: "myocardial infarction",
    cva: "stroke",
    tia: "transient ischemic attack",
    uti: "urinary tract infection",
    dka: "diabetic ketoacidosis",
    hhs: "hyperosmolar hyperglycemic state",
    aki: "acute kidney injury",
    ckd: "chronic kidney disease",
    ards: "acute respiratory distress syndrome",
    pe: "pulmonary embolism",
    dvt: "deep vein thrombosis",
    afib: "atrial fibrillation",
    af: "atrial fibrillation",
    gerd: "gastroesophageal reflux disease",
    nsaid: "nonsteroidal anti inflammatory drug",
    nsaids: "nonsteroidal anti inflammatory drug",
    acei: "angiotensin converting enzyme inhibitor",
    ace: "angiotensin converting enzyme",
    arb: "angiotensin receptor blocker",
    ssri: "selective serotonin reuptake inhibitor",
    snri: "serotonin norepinephrine reuptake inhibitor",
    maoi: "monoamine oxidase inhibitor",
    tca: "tricyclic antidepressant",
    ppi: "proton pump inhibitor",
    doac: "direct oral anticoagulant",
    lmwh: "low molecular weight heparin",
    prn: "as needed",
    npo: "nothing by mouth",
    sob: "shortness of breath",
    bp: "blood pressure",
    hr: "heart rate",
    rr: "respiratory rate",
    spo2: "oxygen saturation",
    o2: "oxygen",
    ekg: "electrocardiogram",
    ecg: "electrocardiogram",
    abg: "arterial blood gas",
    cbc: "complete blood count",
    cmp: "comprehensive metabolic panel",
    bun: "blood urea nitrogen",
    gfr: "glomerular filtration rate",
    egfr: "estimated glomerular filtration rate",
    a1c: "hemoglobin a1c"
  });

  const MEDICATION_ALIASES = Object.freeze({
    tylenol: "acetaminophen",
    paracetamol: "acetaminophen",
    advil: "ibuprofen",
    motrin: "ibuprofen",
    aleve: "naproxen",
    aspirin: "acetylsalicylic acid",
    coumadin: "warfarin",
    eliquis: "apixaban",
    xarelto: "rivaroxaban",
    lovenox: "enoxaparin",
    heparin: "unfractionated heparin",
    lasix: "furosemide",
    glucophage: "metformin",
    lopressor: "metoprolol",
    toprol: "metoprolol",
    lisinopril: "lisinopril",
    lipitor: "atorvastatin",
    synthroid: "levothyroxine",
    protonix: "pantoprazole",
    prilosec: "omeprazole",
    pepcid: "famotidine",
    zofran: "ondansetron",
    xanax: "alprazolam",
    ativan: "lorazepam",
    valium: "diazepam",
    neurontin: "gabapentin",
    keppra: "levetiracetam",
    dilantin: "phenytoin",
    depakote: "valproic acid",
    bactrim: "trimethoprim sulfamethoxazole",
    augmentin: "amoxicillin clavulanate",
    amoxil: "amoxicillin",
    rocephin: "ceftriaxone",
    flagyl: "metronidazole",
    diflucan: "fluconazole",
    accutane: "isotretinoin"
  });

  const SPELLING_VARIANTS = Object.freeze({
    anaemia: "anemia",
    diarrhoea: "diarrhea",
    oedema: "edema",
    foetal: "fetal",
    paediatric: "pediatric",
    haemoglobin: "hemoglobin",
    hypertention: "hypertension",
    hypertenstion: "hypertension",
    pancreatitus: "pancreatitis",
    pnemonia: "pneumonia",
    amoxacillin: "amoxicillin",
    amoxicillan: "amoxicillin",
    metphormin: "metformin",
    metfornin: "metformin",
    furosemde: "furosemide",
    pregant: "pregnant",
    pregnent: "pregnant",
    preganant: "pregnant",
    medicatons: "medications",
    contraindiction: "contraindication",
    contraindicted: "contraindicated",
    pathophys: "pathophysiology"
  });

  const SINGULAR_VARIANTS = Object.freeze({
    diseases: "disease",
    conditions: "condition",
    blockers: "blocker",
    medications: "medication",
    medicines: "medicine",
    drugs: "drug",
    classes: "class",
    symptoms: "symptom",
    signs: "sign",
    effects: "effect",
    contraindications: "contraindication",
    interventions: "intervention",
    complications: "complication",
    causes: "cause",
    treatments: "treatment",
    diagnostics: "diagnostic",
    tests: "test",
    labs: "lab",
    warnings: "warning"
  });

  const INTENT_ORDER = Object.freeze([
    "emergency_red_flag", "calculation", "comparison", "pregnancy_safety", "contraindications",
    "adverse_effects", "nursing_interventions", "patient_education", "laboratory_interpretation",
    "diagnostics", "mechanism_pathophysiology", "symptoms", "medication_class",
    "medication_overview", "disease_overview", "encyclopedia_lookup", "definition", "conversational_ambiguous"
  ]);

  const INTENT_PATTERNS = Object.freeze({
    emergency_red_flag: /\b(emergency|urgent|red flag|call 911|rapid response|life threatening|unstable|immediately|right now|severe chest pain|cannot breathe|unresponsive|anaphylaxis|stroke signs?)\b/i,
    calculation: /\b(calculate|calculation|dose calculation|dosage calculation|drip rate|flow rate|gtt|min|mg\/kg|mcg\/kg|convert|conversion|how many ml)\b/i,
    comparison: /\b(compare|comparison|difference between|different from|versus|vs|distinguish|which is better)\b/i,
    pregnancy_safety: /\b(pregnan\w*|fetal|embryo fetal|teratogen\w*|birth defect|maternity|women|pregnant)\b[\s\S]{0,120}\b(safe|unsafe|avoid\w*|contraindicat\w*|forbidden|do not|not give|never (?:give|receive|use|take)|cannot give|should (?:not|never)|must not|risk|harm|used|use|can (?:not|never)|can't use|allowed|allow)\b|\b(safe|unsafe|avoid\w*|contraindicat\w*|forbidden|do not|not give|never (?:give|receive|use|take)|cannot give|should (?:not|never)|must not|risk|harm|used|use|can (?:not|never)|can't use|allowed|allow)\b[\s\S]{0,120}\b(pregnan\w*|fetal|embryo fetal|teratogen\w*|birth defect|maternity|women|pregnant)\b|\b(can\s+i\b[\s\S]{0,60}\b(?:take|use|receive|administer|give)\b[\s\S]{0,30}\b(pregnan\w*|fetal|embryo fetal|teratogen\w*|birth defect|maternity|women|pregnant)\b)/i,
    contraindications: /\b(contraindicat\w*|do not give|should not receive|must not use|avoid using|who cannot take|when not to use)\b/i,
    adverse_effects: /\b(adverse effect|side effect|undesired effect|toxicit\w*|complication of (?:taking|using)|what can .* cause)\b/i,
    nursing_interventions: /\b(nursing intervention|nursing care|nursing action|nurse do|priority action|care plan|monitoring parameter|what should the nurse)\b/i,
    patient_education: /\b(patient education|teach the patient|teaching point|discharge teaching|home instruction|what should .* know|educate)\b/i,
    laboratory_interpretation: /\b(lab|laboratory|level|range|value|result|high|low|elevated|decreased|interpret)\b[\s\S]{0,80}\b(sodium|potassium|calcium|magnesium|glucose|creatinine|bun|hemoglobin|hematocrit|platelet|white blood|inr|ptt|troponin|bnp|a1c|tsh|arterial blood gas|ph|paco2|hco3)\b|\bwhat does .* (?:level|result|value) mean\b/i,
    diagnostics: /\b(diagnos\w*|diagnostic test|workup|screening|how .* confirmed|how do you test|test for)\b/i,
    symptoms: /\b(symptom|sign|manifestation|clinical feature|present with|what does .* look like)\b/i,
    mechanism_pathophysiology: /\b(mechanism|mechanism of action|pathophysiology|how does .* work|why (?:does|do|can)|why .* can|what causes|how .* cause|how .* happens|underlying process|explain .* (?:mechanism|pathophysiology|cause|happen|how|work)|how .* (?:mechanism|pathophysiology))\b/i,
    medication_class: /\b(medication class|drug class|class of medication|what medication treat|which medication treat|medication used for|drug used for|classes? .* treat)\b/i,
    medication_overview: /\b(what is|tell me about|overview of|explain)\b[\s\S]{0,80}\b(medication|medicine|drug)\b|\b(acetaminophen|ibuprofen|warfarin|apixaban|rivaroxaban|enoxaparin|furosemide|metformin|metoprolol|lisinopril|atorvastatin|levothyroxine|pantoprazole|omeprazole|ondansetron|gabapentin|phenytoin|valproic acid|amoxicillin|ceftriaxone|isotretinoin)\b/i,
    disease_overview: /\b(overview of|tell me about|explain|what is)\b[\s\S]{0,100}\b(disease|condition|syndrome|infection|failure|injury|cancer|hypertension|diabetes|pancreatitis|pneumonia|asthma|chronic obstructive pulmonary disease)\b/i,
    encyclopedia_lookup: /\b(encyclopedia|database|reference|look up|lookup|open .* card|show .* entry)\b/i,
    definition: /\b(what is|what are|define|definition of|meaning of|tell me about|overview of|explain)\b/i,
    conversational_ambiguous: /.*/
  });

  const INTENT_REQUIRED_FIELDS = Object.freeze({
    definition: ["definition", "overview", "mechanism"],
    disease_overview: ["definition", "overview", "mechanism", "symptoms"],
    medication_overview: ["definition", "overview", "mechanism", "uses"],
    medication_class: ["medicationClasses", "treatments", "uses"],
    adverse_effects: ["adverseEffects", "safetyWarnings"],
    contraindications: ["contraindications", "safetyWarnings"],
    pregnancy_safety: ["pregnancy", "contraindications", "safetyWarnings", "reproductiveSafety", "medicationClasses", "populationRisks"],
    symptoms: ["symptoms"],
    diagnostics: ["diagnostics"],
    laboratory_interpretation: ["interpretation", "normalRange", "diagnostics"],
    nursing_interventions: ["nursingInterventions"],
    patient_education: ["patientEducation"],
    mechanism_pathophysiology: ["mechanism", "pathophysiology"],
    encyclopedia_lookup: ["definition", "overview", "mechanism"]
  });

  const QUERY_DROP_WORDS = new Set([
    "a", "an", "and", "are", "about", "can", "could", "do", "does", "for", "give", "is", "me", "of", "on", "please",
    "some", "tell", "the", "to", "use", "used", "we", "what", "when", "which", "who", "with", "would", "explain", "overview",
    "definition", "symptom", "sign", "diagnostic", "test", "nursing", "intervention", "patient", "education", "mechanism", "pathophysiology",
    "medication", "medicine", "drug", "class", "effect", "contraindication", "safe", "unsafe", "pregnant", "pregnancy", "woman", "women",
    "lecture", "mode", "clinical", "encyclopedia", "database", "reference"
  ]);

  function cleanString(value) {
    return String(value == null ? "" : value).replace(/\s+/g, " ").trim();
  }

  function escapePattern(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function replaceDictionary(text, dictionary) {
    let output = text;
    Object.entries(dictionary).sort((left, right) => right[0].length - left[0].length).forEach(([from, to]) => {
      output = output.replace(new RegExp(`\\b${escapePattern(from)}\\b`, "g"), to);
    });
    return output;
  }

  function normalizeQuestion(question, options = {}) {
    let value = cleanString(question)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’`]/g, "'")
      .replace(/\b(can\s*not|can't)\b/g, "cannot")
      .replace(/\b(should\s*not|shouldn't)\b/g, "should not")
      .replace(/\b(do\s*not|don't)\b/g, "do not")
      .replace(/\bcontra[-\s]?indicat/g, "contraindicat")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9+%./'-]+/g, " ")
      .replace(/(^|\s)[?.!,;:]+|[?.!,;:]+(?=\s|$)/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    value = replaceDictionary(value, SPELLING_VARIANTS);
    value = replaceDictionary(value, ABBREVIATIONS);
    value = replaceDictionary(value, MEDICATION_ALIASES);
    if (options.aliases && typeof options.aliases === "object") value = replaceDictionary(value, options.aliases);
    value = value.split(" ").map((token) => SINGULAR_VARIANTS[token] || token).join(" ");
    return value
      .replace(/\b(?:could you|can you|would you|please)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenList(value) {
    return normalizeQuestion(value).split(" ").filter((token) => token.length > 1);
  }

  function unique(items) {
    const seen = new Set();
    return items.filter((item) => {
      const key = normalizeQuestion(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function valueList(value, limit = 30) {
    const output = [];
    const visit = (item) => {
      if (output.length >= limit || item == null) return;
      if (Array.isArray(item)) return item.forEach(visit);
      if (typeof item === "object") {
        const preferred = item.text || item.note || item.description || item.meaning || item.label || item.name || item.value || item.result;
        if (preferred) visit(preferred);
        else Object.values(item).slice(0, 6).forEach(visit);
        return;
      }
      const text = cleanString(item);
      if (text) output.push(text);
    };
    visit(value);
    return unique(output).slice(0, limit);
  }

  function stableHash(value) {
    const text = typeof value === "string" ? value : JSON.stringify(value);
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  function classifyIntent(normalizedQuestion) {
    const normalized = normalizeQuestion(normalizedQuestion);
    const id = INTENT_ORDER.find((intent) => INTENT_PATTERNS[intent].test(normalized)) || "conversational_ambiguous";
    const confidenceByIntent = {
      emergency_red_flag: 0.94,
      calculation: 0.96,
      comparison: 0.92,
      pregnancy_safety: 0.97,
      contraindications: 0.95,
      adverse_effects: 0.94,
      nursing_interventions: 0.95,
      patient_education: 0.92,
      laboratory_interpretation: 0.91,
      diagnostics: 0.91,
      symptoms: 0.94,
      mechanism_pathophysiology: 0.94,
      medication_class: 0.91,
      medication_overview: 0.88,
      disease_overview: 0.88,
      encyclopedia_lookup: 0.93,
      definition: 0.82,
      conversational_ambiguous: 0.35
    };
    const safetyClassification = id === "emergency_red_flag" ? "urgent"
      : ["pregnancy_safety", "contraindications", "adverse_effects", "laboratory_interpretation", "calculation"].includes(id) ? "clinical-high"
        : ["nursing_interventions", "diagnostics", "medication_overview", "medication_class"].includes(id) ? "clinical"
          : "general";
    return {
      id,
      confidence: confidenceByIntent[id],
      safetyClassification,
      deterministic: true,
      reason: id === "conversational_ambiguous" ? "no-high-confidence-deterministic-intent" : `matched-${id}-rule`
    };
  }

  function candidateFieldMap(candidate) {
    const fields = candidate && candidate.fields && typeof candidate.fields === "object" ? candidate.fields : {};
    return {
      definition: valueList(fields.definition || fields.summary || candidate.definition),
      overview: valueList(fields.overview),
      causes: valueList(fields.causes),
      mechanism: valueList(fields.mechanism),
      pathophysiology: valueList(fields.pathophysiology),
      symptoms: valueList(fields.symptoms),
      diagnostics: valueList(fields.diagnostics),
      interpretation: valueList(fields.interpretation),
      normalRange: valueList(fields.normalRange),
      treatments: valueList(fields.treatments),
      medicationClasses: valueList(fields.medicationClasses),
      uses: valueList(fields.uses),
      adverseEffects: valueList(fields.adverseEffects),
      contraindications: valueList(fields.contraindications),
      pregnancy: valueList(fields.pregnancy),
      nursingInterventions: valueList(fields.nursingInterventions),
      complications: valueList(fields.complications),
      patientEducation: valueList(fields.patientEducation),
      safetyWarnings: valueList(fields.safetyWarnings),
      redFlags: valueList(fields.redFlags)
    };
  }

  function prepareCandidate(candidate, index) {
    if (candidate && candidate._lane4Prepared === true) return candidate;
    const title = cleanString(candidate && (candidate.title || candidate.name || candidate.generic)) || `Entry ${index + 1}`;
    const type = cleanString(candidate && candidate.type).toLowerCase() || "reference";
    const category = cleanString(candidate && candidate.category);
    const aliases = unique(valueList(candidate && candidate.aliases).concat(valueList(candidate && candidate.brandNames)));
    const fields = candidateFieldMap(candidate || {});
    const titleNorm = normalizeQuestion(title);
    const aliasNorms = aliases.map(normalizeQuestion).filter(Boolean);
    const fieldBlob = normalizeQuestion(Object.values(fields).flat().join(" "));
    return {
      id: cleanString(candidate && candidate.id) || `${type}:${titleNorm.replace(/\s+/g, "-")}`,
      title,
      type,
      category,
      aliases,
      fields,
      titleNorm,
      aliasNorms,
      fieldBlob,
      originalIndex: index,
      _lane4Prepared: true
    };
  }

  function prepareCandidates(candidates = []) {
    return candidates.map((candidate, index) => prepareCandidate(candidate, index));
  }

  function intentTypeBoost(intentId, type) {
    if (["medication_overview", "adverse_effects", "contraindications", "pregnancy_safety", "medication_class"].includes(intentId)) {
      return /drug|medication|pharm/.test(type) ? 28 : 0;
    }
    if (["disease_overview", "symptoms", "nursing_interventions", "mechanism_pathophysiology"].includes(intentId)) {
      return /disease|pathology|condition/.test(type) ? 24 : 0;
    }
    if (intentId === "laboratory_interpretation") return /lab/.test(type) ? 34 : 0;
    if (intentId === "diagnostics") return /diagnostic|reference|test|lab/.test(type) ? 28 : 0;
    return 0;
  }

  function requiredFieldAvailability(candidate, intentId) {
    return (INTENT_REQUIRED_FIELDS[intentId] || []).reduce((sum, field) => sum + (candidate.fields[field] && candidate.fields[field].length ? 1 : 0), 0);
  }

  function queryTarget(normalized, intentId) {
    const preserved = tokenList(normalized).filter((token) => !QUERY_DROP_WORDS.has(token));
    if (preserved.length) return preserved.join(" ");
    if (intentId === "pregnancy_safety") return "pregnancy";
    return normalized;
  }

  function scoreCandidate(candidate, normalized, intent, target, targetTokens) {
    let score = 0;
    let exact = false;
    if (candidate.titleNorm === target) { score += 150; exact = true; }
    else if (candidate.titleNorm.includes(target) || target.includes(candidate.titleNorm)) score += 68;
    if (candidate.aliasNorms.includes(target)) { score += 135; exact = true; }
    else if (candidate.aliasNorms.some((alias) => alias.includes(target) || target.includes(alias))) score += 58;

    const titleTokens = new Set(tokenList(`${candidate.titleNorm} ${candidate.aliasNorms.join(" ")}`));
    const overlap = targetTokens.filter((token) => titleTokens.has(token)).length;
    score += overlap * 24;
    const fieldTokens = targetTokens.filter((token) => candidate.fieldBlob.includes(token)).length;
    score += Math.min(fieldTokens * 6, 24);
    score += intentTypeBoost(intent.id, candidate.type);
    score += Math.min(requiredFieldAvailability(candidate, intent.id) * 10, 30);

    if (intent.id === "pregnancy_safety" && candidate.fields.pregnancy.length) score += 72;
    if (intent.id === "pregnancy_safety" && candidate.fields.contraindications.some((item) => /pregnan|fetal|embryo|teratogen/i.test(item))) score += 48;
    if (intent.id === "contraindications" && candidate.fields.contraindications.length) score += 55;
    if (intent.id === "adverse_effects" && candidate.fields.adverseEffects.length) score += 55;
    if (intent.id === "nursing_interventions" && candidate.fields.nursingInterventions.length) score += 50;
    if (intent.id === "patient_education" && candidate.fields.patientEducation.length) score += 50;
    if (intent.id === "symptoms" && candidate.fields.symptoms.length) score += 50;
    if (intent.id === "mechanism_pathophysiology" && (candidate.fields.mechanism.length || candidate.fields.pathophysiology.length)) score += 50;

    return { score, exact };
  }

  function boundedRetrieve(normalizedQuestion, intentInput, candidatesInput = [], options = {}) {
    const limits = { ...DEFAULT_LIMITS, ...options };
    const normalized = normalizeQuestion(normalizedQuestion);
    const intent = typeof intentInput === "string" ? classifyIntent(intentInput) : intentInput;
    const target = queryTarget(normalized, intent.id);
    const targetTokens = tokenList(target);
    const dedupe = new Map();

    candidatesInput.forEach((raw, index) => {
      const candidate = prepareCandidate(raw, index);
      const identity = normalizeQuestion(candidate.id || `${candidate.type}:${candidate.title}`);
      const scored = scoreCandidate(candidate, normalized, intent, target, targetTokens);
      if (scored.score < limits.minimumRetrievalScore) return;
      const existing = dedupe.get(identity) || dedupe.get(`${candidate.type}:${candidate.titleNorm}`);
      const result = { ...candidate, score: scored.score, exact: scored.exact };
      if (!existing || result.score > existing.score) dedupe.set(identity, result);
    });

    const ranked = Array.from(dedupe.values()).sort((left, right) =>
      right.score - left.score
      || Number(right.exact) - Number(left.exact)
      || left.title.localeCompare(right.title)
      || left.originalIndex - right.originalIndex);
    const retrieved = ranked.slice(0, limits.maxRetrieved);
    const selected = retrieved.slice(0, limits.maxSelected);
    const singularIntent = !["pregnancy_safety", "medication_class", "comparison"].includes(intent.id);
    const topFamilies = selected.slice(0, 2).map((entry) => /drug|medication|pharm/.test(entry.type) ? "drug"
      : /lab/.test(entry.type) ? "lab"
        : /disease|pathology|condition/.test(entry.type) ? "disease"
          : "reference");
    const sameTopTitle = selected.length > 1 && selected[0].titleNorm === selected[1].titleNorm;
    const incompatibleSameTitle = sameTopTitle
      && topFamilies[0] !== topFamilies[1]
      && !(["disease", "reference"].includes(topFamilies[0]) && ["disease", "reference"].includes(topFamilies[1]));
    const conflict = Boolean(singularIntent && selected.length > 1
      && selected[0].score >= 80
      && selected[1].score >= selected[0].score - 7
      && (!sameTopTitle || incompatibleSameTitle)
      && (selected[0].exact || selected[1].exact || selected[0].type !== selected[1].type));
    return {
      target,
      totalCandidateCount: candidatesInput.length,
      matchedCount: ranked.length,
      retrievedCount: retrieved.length,
      selectedCount: selected.length,
      retrieved,
      selected,
      conflict,
      threshold: limits.minimumRetrievalScore,
      limits: { maxRetrieved: limits.maxRetrieved, maxSelected: limits.maxSelected }
    };
  }

  function refineIntent(intent, retrieval) {
    if (!retrieval.selected.length || !["definition", "disease_overview", "medication_overview"].includes(intent.id)) return intent;
    const type = retrieval.selected[0].type;
    if (/drug|medication|pharm/.test(type)) return { ...intent, id: "medication_overview", reason: `${intent.reason}+top-medication-type` };
    if (/disease|pathology|condition/.test(type)) return { ...intent, id: "disease_overview", reason: `${intent.reason}+top-disease-type` };
    return intent;
  }

  function modeName(mode) {
    const normalized = cleanString(mode).toLowerCase();
    if (["clinical", "lecture", "encyclopedia", "general"].includes(normalized)) return normalized;
    return "general";
  }

  function clippedItems(items, mode, maximum) {
    const cap = maximum || (mode === "clinical" ? 4 : mode === "lecture" ? 6 : 7);
    return unique(valueList(items, cap * 2)).slice(0, cap);
  }

  function section(label, items, mode, maximum) {
    const selected = clippedItems(items, mode, maximum);
    if (!selected.length) return "";
    if (selected.length === 1) return `**${label}:** ${selected[0]}`;
    return `**${label}:**\n${selected.map((item) => `- ${item}`).join("\n")}`;
  }

  function primaryDefinition(candidate) {
    return candidate.fields.definition[0]
      || candidate.fields.overview[0]
      || candidate.fields.mechanism[0]
      || candidate.fields.pathophysiology[0]
      || "";
  }

  function focusedBuilder(intent, retrieval, mode) {
    const primary = retrieval.selected[0];
    if (!primary) return { answer: "", fieldsUsed: [] };
    const fieldsUsed = [];
    const parts = [];
    const add = (field, label, values, maximum) => {
      const rendered = section(label, values, mode, maximum);
      if (!rendered) return;
      fieldsUsed.push(field);
      parts.push(rendered);
    };
    const titlePrefix = mode === "clinical" ? `**Clinical priority — ${primary.title}**`
      : mode === "lecture" ? `**Lecture focus — ${primary.title}**`
        : mode === "encyclopedia" ? `**${primary.title} — structured reference**`
          : `**${primary.title}**`;
    parts.push(titlePrefix);

    if (intent.id === "pregnancy_safety") {
      parts.push("**Clinical interpretation:** Some medications are contraindicated or strong stop-and-clarify choices in pregnancy. Others are not universally forbidden and depend on trimester, dose, indication, exposure route, alternatives, and an individualized maternal-fetal risk-benefit analysis.");
      const rows = retrieval.selected.flatMap((candidate) => {
        const classes = candidate.fields.medicationClasses.length ? candidate.fields.medicationClasses : [candidate.title];
        const reason = candidate.fields.pregnancy[0] || candidate.fields.contraindications.find((item) => /pregnan|fetal|embryo|teratogen/i.test(item)) || candidate.fields.safetyWarnings[0];
        return reason ? classes.slice(0, 2).map((name) => `**${name}:** ${reason}`) : [];
      });
      add("pregnancy", "Pregnancy-specific stop-or-clarify examples", rows, mode === "clinical" ? 5 : 8);
      add("safetyWarnings", "Safety boundary", ["Verify pregnancy status and gestational timing, hold or question a potentially unsafe medication, and confirm the indication and plan with the prescriber or pharmacist. Do not stop a necessary prescribed medication or substitute a class-wide rule for patient-specific specialist review."], 1);
      return { answer: parts.join("\n\n"), fieldsUsed };
    }

    if (intent.id === "comparison") {
      const compared = retrieval.selected.slice(0, 2);
      if (compared.length < 2) return { answer: "", fieldsUsed };
      parts.length = 0;
      parts.push(`**${compared[0].title} vs ${compared[1].title}**`);
      compared.forEach((candidate) => {
        const details = [primaryDefinition(candidate), candidate.fields.mechanism[0], candidate.fields.uses[0], candidate.fields.symptoms[0]].filter(Boolean);
        if (details.length) parts.push(`**${candidate.title}:** ${details.slice(0, mode === "clinical" ? 2 : 4).join(" ")}`);
      });
      fieldsUsed.push("comparison");
      return { answer: parts.join("\n\n"), fieldsUsed };
    }

    if (["definition", "disease_overview", "medication_overview", "encyclopedia_lookup"].includes(intent.id)) {
      add("definition", "Overview", [primaryDefinition(primary)], 1);
      if (intent.id === "medication_overview") {
        add("medicationClasses", "Class", primary.fields.medicationClasses, 3);
        add("uses", "Uses", primary.fields.uses.length ? primary.fields.uses : primary.fields.treatments, 5);
        add("mechanism", "How it works", primary.fields.mechanism, 3);
        add("adverseEffects", "Important adverse effects", primary.fields.adverseEffects, 5);
        add("contraindications", "Contraindications / precautions", primary.fields.contraindications, 5);
      } else {
        add("mechanism", "Mechanism / pathophysiology", primary.fields.pathophysiology.length ? primary.fields.pathophysiology : primary.fields.mechanism, 3);
        add("symptoms", "Common findings", primary.fields.symptoms, 6);
        add("diagnostics", "Diagnostics", primary.fields.diagnostics, 5);
        add("treatments", "Treatment direction", primary.fields.treatments, 5);
      }
      if (mode !== "clinical") add("nursingInterventions", "Nursing priorities", primary.fields.nursingInterventions, 5);
      add("safetyWarnings", "Safety", primary.fields.safetyWarnings.concat(primary.fields.redFlags), mode === "clinical" ? 4 : 5);
    } else if (intent.id === "symptoms") {
      add("definition", "Context", [primaryDefinition(primary)], 1);
      add("symptoms", "Symptoms and assessment findings", primary.fields.symptoms, 8);
      add("redFlags", "Red flags", primary.fields.redFlags.concat(primary.fields.complications, primary.fields.safetyWarnings), 5);
    } else if (intent.id === "diagnostics") {
      add("definition", "Clinical target", [primaryDefinition(primary)], 1);
      add("diagnostics", "Diagnostic approach", primary.fields.diagnostics, 8);
      add("interpretation", "Interpretation", primary.fields.interpretation, 5);
    } else if (intent.id === "laboratory_interpretation") {
      add("normalRange", "Reference range", primary.fields.normalRange, 4);
      add("interpretation", "Interpretation", primary.fields.interpretation.length ? primary.fields.interpretation : primary.fields.diagnostics, 7);
      add("safetyWarnings", "Escalate", primary.fields.redFlags.concat(primary.fields.safetyWarnings), 4);
    } else if (intent.id === "nursing_interventions") {
      add("definition", "Clinical focus", [primaryDefinition(primary)], 1);
      add("nursingInterventions", "Priority nursing interventions", primary.fields.nursingInterventions, 8);
      add("complications", "Watch for", primary.fields.complications.concat(primary.fields.redFlags), 5);
      add("patientEducation", "Patient education", primary.fields.patientEducation, 4);
    } else if (intent.id === "patient_education") {
      add("patientEducation", "Patient education", primary.fields.patientEducation, 8);
      add("safetyWarnings", "When to seek help", primary.fields.redFlags.concat(primary.fields.safetyWarnings), 5);
    } else if (intent.id === "mechanism_pathophysiology") {
      add("definition", "Starting point", [primaryDefinition(primary)], 1);
      add("mechanism", "Mechanism / pathophysiology", primary.fields.pathophysiology.concat(primary.fields.mechanism), mode === "lecture" ? 8 : 5);
      if (mode === "lecture") add("symptoms", "How the mechanism produces findings", primary.fields.symptoms, 5);
    } else if (intent.id === "adverse_effects") {
      add("adverseEffects", "Adverse effects", primary.fields.adverseEffects, 8);
      add("safetyWarnings", "Serious warnings", primary.fields.safetyWarnings.concat(primary.fields.redFlags), 5);
      add("nursingInterventions", "Monitoring", primary.fields.nursingInterventions, 5);
    } else if (intent.id === "contraindications") {
      add("contraindications", "Contraindications / avoid", primary.fields.contraindications, 8);
      add("safetyWarnings", "Safety warnings", primary.fields.safetyWarnings, 5);
    } else if (intent.id === "medication_class") {
      add("medicationClasses", "Medication classes", primary.fields.medicationClasses, 8);
      add("treatments", "Treatment options in the installed reference", primary.fields.treatments.concat(primary.fields.uses), 8);
      add("safetyWarnings", "Safety", primary.fields.safetyWarnings, 4);
    } else if (intent.id === "emergency_red_flag") {
      add("redFlags", "Immediate red flags", primary.fields.redFlags.concat(primary.fields.safetyWarnings), 5);
      add("nursingInterventions", "Immediate priorities", primary.fields.nursingInterventions, 5);
    }

    if (mode === "lecture" && !fieldsUsed.includes("mechanism")) add("mechanism", "Why this happens", primary.fields.pathophysiology.concat(primary.fields.mechanism), 5);
    if (mode === "encyclopedia") {
      add("causes", "Causes / risk factors", primary.fields.causes, 5);
      add("complications", "Complications", primary.fields.complications, 5);
      add("patientEducation", "Patient education", primary.fields.patientEducation, 5);
    }
    return { answer: parts.join("\n\n"), fieldsUsed };
  }

  function evaluateQuality(answer, intent, retrieval, fieldsUsed, options = {}) {
    const text = cleanString(answer);
    const required = INTENT_REQUIRED_FIELDS[intent.id] || [];
    const requiredSatisfied = !required.length || required.some((field) => fieldsUsed.includes(field));
    const noCountOnlyAnswer = !/^found\s+\d+|found \*\*\d+\*\* installed entries/i.test(text);
    const safetySatisfied = intent.safetyClassification !== "urgent"
      || fieldsUsed.includes("redFlags")
      || fieldsUsed.includes("safetyWarnings")
      || fieldsUsed.includes("nursingInterventions");
    const retrievalConfidence = retrieval.selected.length ? Math.min(1, retrieval.selected[0].score / 150) : 0;
    const fieldConfidence = Math.min(1, fieldsUsed.length / (options.mode === "clinical" ? 2 : 3));
    const confidence = Number((intent.confidence * 0.32 + retrievalConfidence * 0.43 + fieldConfidence * 0.25 - (retrieval.conflict ? 0.35 : 0)).toFixed(3));
    const failures = [];
    if (text.length < 80) failures.push("answer-too-short");
    if (!requiredSatisfied) failures.push("required-structured-field-missing");
    if (!noCountOnlyAnswer) failures.push("count-only-answer");
    if (!safetySatisfied) failures.push("urgent-safety-direction-missing");
    if (retrieval.conflict) failures.push("retrieval-conflict");
    if (confidence < Number(options.minimumLocalConfidence || DEFAULT_LIMITS.minimumLocalConfidence)) failures.push("low-confidence");
    return { passed: failures.length === 0, confidence, failures, requiredSatisfied, safetySatisfied };
  }

  function containsIndividualizedDetails(question) {
    const normalized = normalizeQuestion(question);
    const firstPerson = /\b(i|i'm|im|my|me|mine)\b/i.test(normalized);
    const individualizedData = /\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|kg|lb|ml|mmhg|bpm|%|weeks?|years? old)|\bmy (?:dose|medication|symptom|lab|blood pressure|pregnancy|child|patient)\b/i.test(normalized);
    return firstPerson && individualizedData;
  }

  function isTimeSensitive(question) {
    return /\b(today|right now|current|currently|latest|newest|this week|this month|202[4-9]|recall|shortage|outbreak|guideline update|recent study)\b/i.test(normalizeQuestion(question));
  }

  function cacheEligible(question, intent, quality) {
    if (!quality || !quality.passed || quality.confidence < 0.78) return false;
    if (containsIndividualizedDetails(question) || isTimeSensitive(question)) return false;
    if (["emergency_red_flag", "calculation", "conversational_ambiguous"].includes(intent.id)) return false;
    return true;
  }

  function createMemoryStorage() {
    const values = new Map();
    return {
      getItem(key) { return values.has(key) ? values.get(key) : null; },
      setItem(key, value) { values.set(key, String(value)); },
      removeItem(key) { values.delete(key); }
    };
  }

  function safeStorage(storage) {
    if (!storage) return createMemoryStorage();
    try {
      const key = "__ani_lane4_storage_test__";
      storage.setItem(key, "1");
      storage.removeItem(key);
      return storage;
    } catch (_error) {
      return createMemoryStorage();
    }
  }

  function createAnswerCache(options = {}) {
    const storage = safeStorage(options.storage);
    const storageKey = options.storageKey || "ani-lane4-answer-cache-v1";
    const now = options.now || (() => Date.now());
    const maximum = Number(options.maxCacheEntries || DEFAULT_LIMITS.maxCacheEntries);
    const load = () => {
      try {
        const parsed = JSON.parse(storage.getItem(storageKey) || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch (_error) { return []; }
    };
    const save = (entries) => {
      try { storage.setItem(storageKey, JSON.stringify(entries.slice(0, maximum))); } catch (_error) { /* Cache failure is nonblocking. */ }
    };
    const keyFor = (request) => stableHash([
      request.normalizedQuestion,
      request.intent,
      request.mode,
      request.contentVersion,
      request.safetyVersion,
      (request.contextIds || []).slice().sort().join(",")
    ].join("|"));
    return {
      get(request) {
        const key = keyFor(request);
        const entries = load();
        const entry = entries.find((item) => item.key === key);
        if (!entry || entry.expiresAt <= now()
          || entry.contentVersion !== request.contentVersion
          || entry.safetyVersion !== request.safetyVersion
          || entry.mode !== request.mode) return null;
        entry.lastAccessedAt = now();
        save([entry, ...entries.filter((item) => item.key !== key)]);
        return entry;
      },
      set(request, value, ttlMs) {
        const key = keyFor(request);
        const entries = load().filter((item) => item.key !== key && item.expiresAt > now());
        const entry = {
          key,
          normalizedQuestion: request.normalizedQuestion,
          detectedIntent: request.intent,
          relevantEntryIds: request.contextIds || [],
          answerType: value.answerType,
          answer: value.answer,
          contentVersion: request.contentVersion,
          timestamp: now(),
          lastAccessedAt: now(),
          expiresAt: now() + ttlMs,
          confidence: value.confidence,
          mode: request.mode,
          safetyClassification: request.safetyClassification,
          safetyVersion: request.safetyVersion,
          source: value.source
        };
        save([entry, ...entries]);
        return entry;
      },
      clear() { try { storage.removeItem(storageKey); } catch (_error) { /* no-op */ } },
      size() { return load().filter((entry) => entry.expiresAt > now()).length; },
      keyFor
    };
  }

  function initialTelemetry() {
    return {
      totalQuestions: 0,
      locallyAnsweredQuestions: 0,
      cachedAnswers: 0,
      aiEscalatedQuestions: 0,
      failedAiCalls: 0,
      fallbackAnswers: 0,
      totalRetrievedEntries: 0,
      totalSelectedContextEntries: 0,
      estimatedTokensSent: 0,
      duplicateAiCallsAvoided: 0,
      aiEscalationReasons: {},
      latency: {
        local: { count: 0, totalMs: 0 },
        cache: { count: 0, totalMs: 0 },
        ai: { count: 0, totalMs: 0 },
        fallback: { count: 0, totalMs: 0 }
      }
    };
  }

  function safeMetricNumber(value) {
    const numeric = Number(value || 0);
    return Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
  }

  function metricRatio(numerator, denominator) {
    const safeDenominator = safeMetricNumber(denominator);
    return safeDenominator
      ? Number(Math.min(1, safeMetricNumber(numerator) / safeDenominator).toFixed(4))
      : 0;
  }

  function metricsDiagnosticsAllowed(locationLike = {}) {
    const hostname = cleanString(locationLike.hostname).toLowerCase();
    const search = cleanString(locationLike.search);
    const loopback = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
    return loopback && /(?:^\?|&)lane4Metrics=1(?:&|$)/.test(search);
  }

  function aggregateMetricsView(metrics = {}) {
    const totalQuestions = safeMetricNumber(metrics.totalQuestions);
    const aiEscalatedQuestions = safeMetricNumber(metrics.aiEscalatedQuestions);
    const failedAiCalls = safeMetricNumber(metrics.failedAiCalls);
    const latency = metrics.averageLatencyMs && typeof metrics.averageLatencyMs === "object"
      ? metrics.averageLatencyMs
      : {};
    return Object.freeze({
      totalQuestions,
      locallyAnsweredQuestions: safeMetricNumber(metrics.locallyAnsweredQuestions),
      cachedAnswers: safeMetricNumber(metrics.cachedAnswers),
      aiEscalatedQuestions,
      failedAiCalls,
      fallbackAnswers: safeMetricNumber(metrics.fallbackAnswers),
      localAnswerRate: safeMetricNumber(metrics.localAnswerRate),
      cacheHitRate: safeMetricNumber(metrics.cacheHitRate),
      aiEscalationRate: safeMetricNumber(metrics.aiEscalationRate || metricRatio(aiEscalatedQuestions, totalQuestions)),
      aiCallFailureRate: safeMetricNumber(metrics.aiCallFailureRate || metricRatio(failedAiCalls, aiEscalatedQuestions)),
      fallbackSuccessRate: safeMetricNumber(metrics.fallbackSuccessRate || metricRatio(metrics.fallbackAnswers, failedAiCalls)),
      averageRetrievedEntryCount: safeMetricNumber(metrics.averageRetrievedEntryCount),
      averageSelectedContextCount: safeMetricNumber(metrics.averageSelectedContextCount),
      estimatedTokensSent: safeMetricNumber(metrics.estimatedTokensSent),
      duplicateAiCallsAvoided: safeMetricNumber(metrics.duplicateAiCallsAvoided),
      averageLatencyMs: Object.freeze({
        local: safeMetricNumber(latency.local),
        cache: safeMetricNumber(latency.cache),
        ai: safeMetricNumber(latency.ai),
        fallback: safeMetricNumber(latency.fallback)
      })
    });
  }

  function createTelemetry(options = {}) {
    const storage = safeStorage(options.storage);
    const storageKey = options.storageKey || "ani-lane4-runtime-telemetry-v1";
    const load = () => {
      try { return { ...initialTelemetry(), ...JSON.parse(storage.getItem(storageKey) || "{}") }; }
      catch (_error) { return initialTelemetry(); }
    };
    const save = (metrics) => { try { storage.setItem(storageKey, JSON.stringify(metrics)); } catch (_error) { /* Metrics are nonblocking. */ } };
    const mutate = (callback) => { const metrics = load(); callback(metrics); save(metrics); return metrics; };
    const recordLatency = (metrics, path, latencyMs) => {
      if (!metrics.latency[path]) metrics.latency[path] = { count: 0, totalMs: 0 };
      metrics.latency[path].count += 1;
      metrics.latency[path].totalMs += Math.max(0, Number(latencyMs || 0));
    };
    return {
      question(retrieval) { mutate((m) => { m.totalQuestions += 1; m.totalRetrievedEntries += retrieval.retrievedCount; m.totalSelectedContextEntries += retrieval.selectedCount; }); },
      local(latencyMs) { mutate((m) => { m.locallyAnsweredQuestions += 1; recordLatency(m, "local", latencyMs); }); },
      cache(latencyMs) { mutate((m) => { m.cachedAnswers += 1; m.duplicateAiCallsAvoided += 1; recordLatency(m, "cache", latencyMs); }); },
      duplicate() { mutate((m) => { m.duplicateAiCallsAvoided += 1; }); },
      aiAttempt(estimatedTokens, latencyMs = 0, reason = "unspecified") { mutate((m) => {
        m.aiEscalatedQuestions += 1;
        m.estimatedTokensSent += Math.max(0, Number(estimatedTokens || 0));
        if (!m.aiEscalationReasons || typeof m.aiEscalationReasons !== "object") m.aiEscalationReasons = {};
        const reasonKey = cleanString(reason) || "unspecified";
        m.aiEscalationReasons[reasonKey] = Number(m.aiEscalationReasons[reasonKey] || 0) + 1;
        if (latencyMs) recordLatency(m, "ai", latencyMs);
      }); },
      aiResult(success, latencyMs) { mutate((m) => { if (!success) m.failedAiCalls += 1; recordLatency(m, "ai", latencyMs); }); },
      fallback(latencyMs) { mutate((m) => { m.fallbackAnswers += 1; recordLatency(m, "fallback", latencyMs); }); },
      snapshot() {
        const metrics = load();
        const average = (path) => metrics.latency[path] && metrics.latency[path].count
          ? Number((metrics.latency[path].totalMs / metrics.latency[path].count).toFixed(2)) : 0;
        return {
          ...metrics,
          averageRetrievedEntryCount: metrics.totalQuestions ? Number((metrics.totalRetrievedEntries / metrics.totalQuestions).toFixed(2)) : 0,
          averageSelectedContextCount: metrics.totalQuestions ? Number((metrics.totalSelectedContextEntries / metrics.totalQuestions).toFixed(2)) : 0,
          cacheHitRate: metrics.totalQuestions ? Number((metrics.cachedAnswers / metrics.totalQuestions).toFixed(4)) : 0,
          localAnswerRate: metrics.totalQuestions ? Number(((metrics.locallyAnsweredQuestions + metrics.cachedAnswers) / metrics.totalQuestions).toFixed(4)) : 0,
          aiEscalationRate: metricRatio(metrics.aiEscalatedQuestions, metrics.totalQuestions),
          aiCallFailureRate: metricRatio(metrics.failedAiCalls, metrics.aiEscalatedQuestions),
          fallbackSuccessRate: metricRatio(metrics.fallbackAnswers, metrics.failedAiCalls),
          averageLatencyMs: { local: average("local"), cache: average("cache"), ai: average("ai"), fallback: average("fallback") }
        };
      },
      reset() { try { storage.removeItem(storageKey); } catch (_error) { /* no-op */ } }
    };
  }

  function contentVersionForCandidates(candidates = [], safetyVersion = SAFETY_RULES_VERSION) {
    const compact = candidates.map((candidate, index) => {
      const prepared = prepareCandidate(candidate, index);
      return [prepared.id, prepared.titleNorm, prepared.type, prepared.category, prepared.aliasNorms, prepared.fields];
    });
    return `${RUNTIME_VERSION}:${safetyVersion}:${stableHash(compact)}`;
  }

  function smallestContextPacket(question, normalizedQuestion, intent, retrieval, mode, limits = {}) {
    const maximumEntries = Number(limits.maxContextEntries || DEFAULT_LIMITS.maxContextEntries);
    const maximumChars = Number(limits.maxContextChars || DEFAULT_LIMITS.maxContextChars);
    const entries = retrieval.selected.slice(0, maximumEntries).map((candidate) => ({
      id: candidate.id,
      title: candidate.title,
      type: candidate.type,
      category: candidate.category,
      fields: Object.fromEntries(Object.entries(candidate.fields).filter(([, values]) => values.length).map(([field, values]) => [field, values.slice(0, 5)]))
    }));
    let packet = { question: cleanString(question), normalizedQuestion, intent: intent.id, mode, entries };
    while (JSON.stringify(packet).length > maximumChars && packet.entries.length > 1) packet.entries.pop();
    if (JSON.stringify(packet).length > maximumChars) {
      packet = { ...packet, entries: packet.entries.map((entry) => ({ ...entry, fields: Object.fromEntries(Object.entries(entry.fields).slice(0, 4).map(([key, values]) => [key, values.slice(0, 2)])) })) };
    }
    const serialized = JSON.stringify(packet);
    if (serialized.length > maximumChars) packet = { ...packet, entries: [], localContextOmitted: "bounded-context-limit" };
    const contextCharacters = JSON.stringify(packet).length;
    return { ...packet, contextCharacters, estimatedTokens: Math.ceil(contextCharacters / 4) };
  }

  function escalationReason(intent, retrieval, quality, options = {}) {
    if (options.forceEscalationReason) return options.forceEscalationReason;
    if (intent.confidence < 0.6) return "deterministic-intent-confidence-low";
    if (retrieval.conflict) return "retrieval-results-conflict";
    if (!retrieval.selected.length) return "no-reliable-local-match";
    if (intent.id === "calculation") return "calculation-requires-contextual-validation";
    if (intent.id === "conversational_ambiguous") return "conversational-request-needs-context";
    if (!quality.passed) return `local-quality-check-failed:${quality.failures.join(",")}`;
    return "custom-or-multi-concept-synthesis-required";
  }

  function bestLocalFallback(intent, retrieval) {
    const primary = retrieval.selected[0];
    if (!primary) {
      return "I could not match that question to a reliable installed encyclopedia entry. Try the exact condition, medication, lab, or diagnostic name. If the AI connection is unavailable, ANI will not invent an answer.";
    }
    const definition = primaryDefinition(primary);
    const safety = primary.fields.safetyWarnings[0] || primary.fields.redFlags[0];
    return [
      `**Best installed match — ${primary.title}**`,
      definition || "ANI found a related installed entry, but its structured fields are not sufficient for a confident complete answer.",
      safety ? `**Safety:** ${safety}` : "For a clinical decision, verify the specific patient context with an appropriate clinician or pharmacist."
    ].join("\n\n");
  }

  function createRuntime(options = {}) {
    const limits = { ...DEFAULT_LIMITS, ...(options.limits || {}) };
    const storage = safeStorage(options.storage || (typeof globalThis !== "undefined" ? globalThis.localStorage : null));
    const now = options.now || (() => Date.now());
    const cache = createAnswerCache({ storage, now, maxCacheEntries: limits.maxCacheEntries, storageKey: options.cacheStorageKey });
    const telemetry = createTelemetry({ storage, storageKey: options.telemetryStorageKey });
    const safetyVersion = options.safetyVersion || SAFETY_RULES_VERSION;
    const inFlightAiCalls = new Map();
    const aiCoalesceTtlMs = Math.max(750, Number(limits.aiCoalesceTtlMs || 2500));

    function aiCoalesceKey(requestPayload) {
      const parts = [
        requestPayload.normalizedQuestion,
        requestPayload.intent?.id,
        requestPayload.mode,
        requestPayload.contentVersion,
        requestPayload.safetyVersion,
        requestPayload.contextIds?.join("|") || ""
      ];
      return `${parts.join("::")}`;
    }

    function readInFlightAiCall(entryKey) {
      const item = inFlightAiCalls.get(entryKey);
      if (!item) return null;
      if (item.expiresAt <= now()) {
        inFlightAiCalls.delete(entryKey);
        return null;
      }
      return item;
    }

    function rememberInFlightAiCall(entryKey, promise) {
      const expiresAt = now() + aiCoalesceTtlMs;
      const item = { promise, expiresAt };
      inFlightAiCalls.set(entryKey, item);
      promise.finally(() => {
        inFlightAiCalls.delete(entryKey);
      }).catch(() => {
        // no-op: failure path remains handled by caller; avoid unhandled rejection churn.
      });
      return item;
    }

    function answerLocal(request = {}) {
      const startedAt = now();
      const question = cleanString(request.question);
      const normalizedQuestion = normalizeQuestion(question, { aliases: request.normalizationAliases });
      let intent = classifyIntent(normalizedQuestion);
      let retrieval = boundedRetrieve(normalizedQuestion, intent, request.candidates || [], limits);
      const refined = refineIntent(intent, retrieval);
      if (refined.id !== intent.id) {
        intent = refined;
        retrieval = boundedRetrieve(normalizedQuestion, intent, request.candidates || [], limits);
      }
      const mode = modeName(request.mode);
      const contentVersion = request.contentVersion || contentVersionForCandidates(request.candidates || [], safetyVersion);
      const contextIds = retrieval.selected.map((entry) => entry.id);
      const cacheRequest = { normalizedQuestion, intent: intent.id, mode, contentVersion, safetyVersion, contextIds };
      telemetry.question(retrieval);

      const cacheAllowedByQuestion = !containsIndividualizedDetails(question) && !isTimeSensitive(question);
      if (cacheAllowedByQuestion && request.useCache !== false) {
        const cached = cache.get(cacheRequest);
        if (cached && cached.confidence >= limits.minimumLocalConfidence) {
          telemetry.cache(now() - startedAt);
          return {
            path: "cache",
            answer: cached.answer,
            answerType: cached.answerType,
            normalizedQuestion,
            intent,
            retrieval,
            quality: { passed: true, confidence: cached.confidence, failures: [] },
            cache: { hit: true, key: cached.key },
            contentVersion,
            safetyClassification: cached.safetyClassification,
            aiEscalation: null
          };
        }
      }

      const built = focusedBuilder(intent, retrieval, mode);
      const quality = evaluateQuality(built.answer, intent, retrieval, built.fieldsUsed, { ...limits, mode });
      const packet = smallestContextPacket(question, normalizedQuestion, intent, retrieval, mode, limits);
      if (quality.passed) {
        const eligible = cacheEligible(question, intent, quality) && request.useCache !== false;
        if (eligible) cache.set(cacheRequest, { answerType: "structured-local", answer: built.answer, confidence: quality.confidence, source: "local" }, limits.localCacheTtlMs);
        telemetry.local(now() - startedAt);
        return {
          path: "local",
          answer: built.answer,
          answerType: "structured-local",
          normalizedQuestion,
          intent,
          retrieval,
          quality,
          cache: { hit: false, stored: eligible },
          contentVersion,
          safetyClassification: intent.safetyClassification,
          aiEscalation: null
        };
      }
      return {
        path: "escalate",
        answer: "",
        fallbackAnswer: bestLocalFallback(intent, retrieval),
        answerType: "ai-escalation-plan",
        normalizedQuestion,
        intent,
        retrieval,
        quality,
        cache: { hit: false, stored: false, bypassed: !cacheAllowedByQuestion },
        contentVersion,
        safetyClassification: intent.safetyClassification,
        aiEscalation: {
          required: true,
          reason: escalationReason(intent, retrieval, quality, request),
          maxAttempts: 1,
          context: packet,
          estimatedTokens: packet.estimatedTokens
        },
        _cacheRequest: cacheRequest
      };
    }

    async function answer(request = {}) {
      const result = answerLocal(request);
      if (result.path !== "escalate") return result;
      const startedAt = now();
      if (typeof request.aiEscalate !== "function") {
        telemetry.fallback(now() - startedAt);
        return { ...result, path: "fallback", answer: result.fallbackAnswer, answerType: "local-fallback", ai: { attempted: false } };
      }
      const aiKey = aiCoalesceKey({
        normalizedQuestion: result.normalizedQuestion,
        intent: result.intent,
        mode: result.mode,
        contentVersion: result.contentVersion,
        safetyVersion,
        contextIds: result.retrieval.selected.map((entry) => entry.id)
      });
      const existing = readInFlightAiCall(aiKey);
      if (existing) {
        telemetry.duplicate();
        return existing.promise;
      }
      telemetry.aiAttempt(result.aiEscalation.estimatedTokens, 0, result.aiEscalation.reason);
      const perform = async () => {
        try {
          const response = await request.aiEscalate({
            question: request.question,
            normalizedQuestion: result.normalizedQuestion,
            intent: result.intent,
            reason: result.aiEscalation.reason,
            context: result.aiEscalation.context,
            maxAttempts: 1
          });
          const answerText = cleanString(response && response.text != null ? response.text : response);
          const success = answerText.length >= 40;
          telemetry.aiResult(success, now() - startedAt);
          if (!success) {
            telemetry.fallback(now() - startedAt);
            return {
              ...result,
              path: "fallback",
              answer: result.fallbackAnswer,
              answerType: "local-fallback",
              ai: { attempted: true, attempts: 1, reason: result.aiEscalation.reason, error: "AI response failed the minimum bounded quality check." }
            };
          }
          const canCacheAi = request.allowAiCache === true
            && !containsIndividualizedDetails(request.question)
            && !isTimeSensitive(request.question)
            && result.intent.safetyClassification !== "urgent";
          if (canCacheAi) cache.set(result._cacheRequest, { answerType: "ai-generated", answer: answerText, confidence: Math.max(result.quality.confidence, 0.75), source: "ai" }, limits.aiCacheTtlMs);
          return { ...result, path: "ai", answer: answerText, answerType: "ai-generated", ai: { attempted: true, attempts: 1, reason: result.aiEscalation.reason, cached: canCacheAi } };
        } catch (error) {
          telemetry.aiResult(false, now() - startedAt);
          telemetry.fallback(now() - startedAt);
          return {
            ...result,
            path: "fallback",
            answer: result.fallbackAnswer,
            answerType: "local-fallback",
            ai: { attempted: true, attempts: 1, reason: result.aiEscalation.reason, error: error && error.message || String(error) }
          };
        }
      };
      const promise = perform();
      rememberInFlightAiCall(aiKey, promise);
      return promise;
    }

    return {
      version: RUNTIME_VERSION,
      safetyVersion,
      limits: { ...limits },
      cache,
      telemetry,
      answerLocal,
      answer,
      recordExternalAiAttempt(details = {}) { telemetry.aiAttempt(details.estimatedTokens || 0, 0, details.reason || "existing-specialized-ai-route"); },
      recordExternalAiResult(success, latencyMs) { telemetry.aiResult(Boolean(success), latencyMs); },
      recordExternalFallback(latencyMs) { telemetry.fallback(latencyMs); },
      metrics() { return telemetry.snapshot(); }
    };
  }

  let defaultStorage = null;
  try { defaultStorage = typeof globalThis !== "undefined" ? globalThis.localStorage : null; } catch (_error) { defaultStorage = null; }
  const defaultRuntime = createRuntime({ storage: defaultStorage });

  return Object.freeze({
    RUNTIME_VERSION,
    SAFETY_RULES_VERSION,
    DEFAULT_LIMITS,
    ABBREVIATIONS,
    MEDICATION_ALIASES,
    SPELLING_VARIANTS,
    normalizeQuestion,
    classifyIntent,
    boundedRetrieve,
    evaluateQuality,
    contentVersionForCandidates,
    prepareCandidates,
    smallestContextPacket,
    containsIndividualizedDetails,
    isTimeSensitive,
    createMemoryStorage,
    createAnswerCache,
    createTelemetry,
    aggregateMetricsView,
    metricsDiagnosticsAllowed,
    createRuntime,
    defaultRuntime
  });
});

