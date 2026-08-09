/* eslint-disable */
/* Wave 35: bounded, typed intent routing for common shorthand and high-value symptom descriptions. */
(function () {
  "use strict";

  const VERSION = "2026-07-29-wave35-intelligent-search-routing-24";
  if (window.ANI_WAVE35_INTELLIGENT_SEARCH_ROUTING
    && window.ANI_WAVE35_INTELLIGENT_SEARCH_ROUTING.version === VERSION) return;

  const baseOfflineLookupSuggestions = typeof offlineLookupSuggestions === "function"
    ? offlineLookupSuggestions : null;
  const baseHandleOfflineLookupFlow = typeof handleOfflineLookupFlow === "function"
    ? handleOfflineLookupFlow : null;
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function"
    ? makeModelEnhancedResponse : null;
  const baseExactPharmDetailCandidate = typeof exactPharmDetailCandidate === "function"
    ? exactPharmDetailCandidate : null;
  const baseHighYieldDrugClueMatch = typeof highYieldDrugClueMatch === "function"
    ? highYieldDrugClueMatch : null;
  const baseWantsOfflineSmartDatabaseAnswer = typeof wantsOfflineSmartDatabaseAnswer === "function"
    ? wantsOfflineSmartDatabaseAnswer : null;
  const baseSearchPathologyEntries = typeof searchPathologyEntries === "function"
    ? searchPathologyEntries : null;

  const priorRoutingObjects = Object.keys(window)
    .filter((key) => /ROUTING/i.test(key) && window[key] && typeof window[key] === "object")
    .map((key) => window[key]);

  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const compactLookupFrame = (value) => normalize(value)
    .replace(/^(?:please\s+)?(?:what is|whats|tell me about|open|show|find|search(?: for)?|look up|lookup)\s+/, "")
    .replace(/\s+(?:entry|page|topic)$/, "")
    .trim();

  const safeArray = (value) => Array.isArray(value) ? value : [];
  const pathologyCollection = () => typeof pathologyDiseases !== "undefined" && Array.isArray(pathologyDiseases)
    ? pathologyDiseases : [];
  const drugCollection = () => typeof pharmDrugs !== "undefined" && Array.isArray(pharmDrugs)
    ? pharmDrugs : [];
  const labCollection = () => typeof pharmSearchableLabRanges !== "undefined" && Array.isArray(pharmSearchableLabRanges)
    ? pharmSearchableLabRanges : [];
  const referenceCollection = () => typeof clinicalReferenceEntries !== "undefined" && Array.isArray(clinicalReferenceEntries)
    ? clinicalReferenceEntries : [];

  const candidateLabel = (candidate) => {
    if (!candidate || !candidate.item) return "";
    if (candidate.type === "drug" && typeof pharmDrugDisplayName === "function") {
      return String(pharmDrugDisplayName(candidate.item, "") || "").trim();
    }
    if (candidate.type === "reference" && typeof clinicalReferenceDisplayName === "function") {
      return String(clinicalReferenceDisplayName(candidate.item) || "").trim();
    }
    return String(candidate.item.displayName || candidate.item.name || candidate.item.generic || "").trim();
  };

  const exactIdentityTerms = (type, item) => {
    if (!item) return [];
    if (type === "drug") {
      return [
        item.name,
        item.generic,
        item.displayName,
        typeof pharmDrugDisplayName === "function" ? pharmDrugDisplayName(item, "") : ""
      ];
    }
    if (type === "reference") {
      return [
        item.name,
        item.displayName,
        item.fullForm,
        typeof clinicalReferenceDisplayName === "function" ? clinicalReferenceDisplayName(item) : ""
      ];
    }
    return [item.name, item.displayName];
  };

  const collectionForType = (type) => {
    if (type === "drug") return drugCollection();
    if (type === "pathology") return pathologyCollection();
    if (type === "lab") return labCollection();
    if (type === "reference") return referenceCollection();
    return [];
  };

  const targetCache = new Map();
  const exactCandidateForTarget = (target) => {
    if (!target || !target.type || !safeArray(target.names).length) return null;
    const cacheKey = `${target.type}:${target.names.map(normalize).join("|")}`;
    if (targetCache.has(cacheKey)) return targetCache.get(cacheKey);
    const wanted = new Set(target.names.map(normalize).filter(Boolean));
    let matches = collectionForType(target.type).filter((item) => exactIdentityTerms(target.type, item)
      .map(normalize).some((term) => wanted.has(term)));
    if (target.type === "drug" && typeof isVisibleMedicationEntry === "function") {
      matches = matches.filter((item) => isVisibleMedicationEntry(item));
    }
    if (target.type === "drug" && typeof pharmIdentityPreferenceScore === "function") {
      matches.sort((left, right) => pharmIdentityPreferenceScore(right) - pharmIdentityPreferenceScore(left));
    }
    if (!matches.length) return null;
    const candidate = { type: target.type, item: matches[0] };
    targetCache.set(cacheKey, candidate);
    return candidate;
  };

  const TARGETS = Object.freeze({
    ibuprofen: Object.freeze({ type: "drug", names: ["Ibuprofen"] }),
    diphenhydramine: Object.freeze({ type: "drug", names: ["Diphenhydramine"] }),
    ibs: Object.freeze({ type: "pathology", names: ["Irritable bowel syndrome"] }),
    pneumonia: Object.freeze({ type: "pathology", names: ["Pneumonia"] }),
    sle: Object.freeze({ type: "pathology", names: ["Systemic lupus erythematosus"] }),
    type2Diabetes: Object.freeze({ type: "pathology", names: ["Type 2 diabetes mellitus", "Type 2 diabetes"] }),
    dyslipidemia: Object.freeze({ type: "pathology", names: ["Dyslipidemia", "Hyperlipidemia", "Lipid disorder", "Lipid disorders"] }),
    groupBStrep: Object.freeze({ type: "pathology", names: ["Group B streptococcal infection", "Group B Streptococcus infection"] }),
    guillainBarre: Object.freeze({ type: "pathology", names: ["Guillain-Barre syndrome", "Guillain-Barré syndrome"] }),
    pneumocystis: Object.freeze({ type: "pathology", names: ["Pneumocystis pneumonia", "Pneumocystis jirovecii pneumonia"] }),
    prothrombinTime: Object.freeze({ type: "lab", names: ["PT", "PT/INR", "Prothrombin time"] }),
    multipleSclerosis: Object.freeze({ type: "pathology", names: ["Multiple sclerosis"] }),
    uti: Object.freeze({ type: "pathology", names: ["UTI", "Urinary tract infection"] }),
    myocardialInfarction: Object.freeze({ type: "pathology", names: ["Myocardial infarction"] }),
    stroke: Object.freeze({ type: "pathology", names: ["Stroke"] }),
    pulmonaryEmbolism: Object.freeze({ type: "pathology", names: ["Pulmonary embolism"] }),
    deepVeinThrombosis: Object.freeze({ type: "pathology", names: ["Deep vein thrombosis"] }),
    appendicitis: Object.freeze({ type: "pathology", names: ["Appendicitis"] }),
    cholecystitis: Object.freeze({ type: "pathology", names: ["Cholecystitis"] }),
    heartFailure: Object.freeze({ type: "pathology", names: ["Heart failure"] }),
    meningitis: Object.freeze({ type: "pathology", names: ["Meningitis"] }),
    dka: Object.freeze({ type: "pathology", names: ["DKA", "Diabetic ketoacidosis"] }),
    hypoglycemia: Object.freeze({ type: "pathology", names: ["Hypoglycemia"] }),
    giBleeding: Object.freeze({ type: "pathology", names: ["GI bleeding", "Gastrointestinal bleeding"] }),
    aorticDissection: Object.freeze({ type: "pathology", names: ["Aortic dissection"] }),
    shingles: Object.freeze({ type: "pathology", names: ["Shingles", "Shingles/postherpetic neuralgia"] }),
    acutePancreatitis: Object.freeze({ type: "pathology", names: ["Acute pancreatitis"] }),
    preeclampsia: Object.freeze({ type: "pathology", names: ["Preeclampsia"] }),
    testicularTorsion: Object.freeze({ type: "pathology", names: ["Testicular torsion"] }),
    angleClosureGlaucoma: Object.freeze({ type: "pathology", names: ["Angle-closure glaucoma", "Acute angle-closure glaucoma"] }),
    retinalDetachment: Object.freeze({ type: "pathology", names: ["Retinal detachment"] }),
    ten: Object.freeze({ type: "pathology", names: ["Toxic epidermal necrolysis"] })
  });

  const EXACT_ROUTES = Object.freeze([
    Object.freeze({ id: "ibuprofen-brand", target: "ibuprofen", aliases: ["advil", "motrin"] }),
    Object.freeze({ id: "diphenhydramine-brand", target: "diphenhydramine", aliases: ["benadryl"] }),
    Object.freeze({ id: "ibs-abbreviation", target: "ibs", aliases: ["ibs"] }),
    Object.freeze({ id: "pna-abbreviation", target: "pneumonia", aliases: ["pna"] }),
    Object.freeze({ id: "sle-abbreviation", target: "sle", aliases: ["sle"] }),
    Object.freeze({ id: "type2-diabetes-abbreviation", target: "type2Diabetes", aliases: ["dm2", "t2d", "t2 dm"] }),
    Object.freeze({ id: "hld-abbreviation", target: "dyslipidemia", aliases: ["hld"], optional: true }),
    Object.freeze({
      id: "ten-identity",
      target: "ten",
      aliases: ["ten", "t e n", "lyell syndrome", "lyells syndrome", "toxic epidermal necrosis"]
    })
  ]);

  const exactRouteIndex = new Map();
  EXACT_ROUTES.forEach((route) => route.aliases.forEach((alias) => exactRouteIndex.set(normalize(alias), route)));

  const toxicityContext = (text) => /\b(overdose|overdosed|toxicity|toxic|poison(?:ed|ing)?|too much|ingest(?:ed|ion)?|swallow(?:ed)?|anticholinergic delirium|physostigmine)\b/i.test(text);
  const explicitDomainIntent = (text) => {
    const clean = normalize(text);
    const drug = /\b(dose|dosing|mechanism|side effect|adverse effect|contraindication|interaction|drug class|medication class|which drug|what drug|which medicine|what medicine|pharmacology)\b/i.test(clean);
    const lab = /\b(lab(?:oratory)?|normal range|reference range|blood test|serum level|urine test|specimen|panel|positive result|negative result|monitor warfarin|monitor heparin)\b/i.test(clean);
    const procedure = /\b(which test|what test|diagnostic test|scan|imaging|ultrasound|ct scan|mri|procedure|how is .* performed|preparation for)\b/i.test(clean);
    return drug || lab || procedure;
  };

  const priorSpecificMedicationClueCache = new Map();
  const priorSpecificMedicationClue = (input) => {
    const text = normalize(input);
    if (!baseHighYieldDrugClueMatch
      || !/\b(which|what|name|identify)\b/i.test(text)
      || /\b(condition|diagnosis|differential|disease)\b/i.test(text)) return null;
    if (priorSpecificMedicationClueCache.has(text)) return priorSpecificMedicationClueCache.get(text);
    let match = null;
    try {
      match = baseHighYieldDrugClueMatch(input);
    } catch (_error) {
      priorSpecificMedicationClueCache.set(text, null);
      return null;
    }
    if (!match) {
      priorSpecificMedicationClueCache.set(text, null);
      return null;
    }
    const directlyNamed = [
      match.name,
      match.generic,
      match.displayName,
      ...(match.brandExamples || []),
      ...(match.aliases || [])
    ].map(normalize).filter((term) => term.length >= 4)
      .some((term) => text.includes(term));
    const genericClassWords = new Set([
      "medication", "medications", "medicine", "drug", "drugs", "agent", "agents",
      "therapy", "treatment", "endocrine", "diabetes", "longer", "shorter", "acting",
      "second", "generation", "channel", "blocker", "pharmacology"
    ]);
    const classNamed = [match.class, match.templateKey, ...(match.classPathway || [])]
      .map(normalize)
      .flatMap((term) => term.split(" "))
      .filter((token) => token.length >= 5 && !genericClassWords.has(token))
      .some((token) => new RegExp(`\\b${token}\\b`, "i").test(text));
    const resolved = directlyNamed || classNamed ? match : null;
    priorSpecificMedicationClueCache.set(text, resolved);
    return resolved;
  };

  const priorActiveEmergency = (input) => priorRoutingObjects.some((routing) => Object.keys(routing)
    .filter((name) => /^isActive/i.test(name) && typeof routing[name] === "function")
    .some((name) => {
      try {
        return Boolean(routing[name].call(routing, input));
      } catch (_error) {
        return false;
      }
    }));

  const priorCanonicalTargetCache = new Map();
  const priorCanonicalTargetIsSupported = (input, target) => {
    const targetText = normalize(target);
    const requiresExposureContext = /\b(?:overdose|toxicity|poisoning|poisoned|ingestion|antidote|rescue pathway)\b/i.test(targetText);
    return !requiresExposureContext || toxicityContext(input);
  };
  const priorCanonicalTarget = (input) => {
    const key = normalize(input);
    if (!key) return "";
    if (priorCanonicalTargetCache.has(key)) return priorCanonicalTargetCache.get(key);
    let target = "";
    for (const routing of priorRoutingObjects) {
      if (typeof routing.canonicalTarget !== "function") continue;
      try {
        const candidate = routing.canonicalTarget.call(routing, input);
        if (typeof candidate === "string" && candidate.trim()
          && priorCanonicalTargetIsSupported(input, candidate)) {
          target = candidate.trim();
          break;
        }
      } catch (_error) {
        // A prior optional router must not break the unified search surface.
      }
    }
    priorCanonicalTargetCache.set(key, target);
    return target;
  };

  const clearlyEducational = (input) => {
    const text = normalize(input);
    const education = /\b(study|studying|nclex|exam|quiz|lecture|class|course|case study|hypothetical|simulation|scenario|teaching|review|practice question|what condition|which condition|what diagnosis|differential)\b/i.test(text);
    const personalCurrent = /\b(i|im|i am|my|me|we|our|friend|mother|mom|father|dad|child|baby|patient|someone)\b/i.test(text)
      && /\b(now|right now|currently|just|sudden|suddenly|new onset|started|today|having|experiencing|cannot|cant)\b/i.test(text);
    return education && !personalCurrent;
  };

  const currentPersonalSymptoms = (input) => {
    if (clearlyEducational(input)) return false;
    const text = normalize(input);
    /*
     * This helper runs only after a multi-cue symptom signature has matched.
     * At that point, an unambiguously personal subject is enough to treat the
     * wording as a current-care concern unless the user explicitly framed it
     * as study material above. Requiring "now" or "I have" misses natural
     * descriptions such as "burning when I pee" and "my chest pressure...".
     */
    return /\b(i|im|i am|ive|i have|my|me|we|our|friend|mother|mom|father|dad|child|baby|toddler|patient|someone|he|she)\b/i.test(text);
  };

  const directExplanationIntent = (input) => {
    const text = normalize(input);
    return /^\s*what (?:is|are)\b/i.test(text)
      || /\bwhat does\b.+\bmean(?:s|ing)?\b/i.test(text)
      || /\bwhat (?:is|are) the meaning of\b/i.test(text)
      || /\bmeaning of\b/i.test(text)
      || /\b(?:explain|why does|why do|how does|how do)\b/i.test(text);
  };

  const priorDirectEducationalOwner = (input) => {
    if (!baseWantsOfflineSmartDatabaseAnswer
      || !directExplanationIntent(input)
      || currentPersonalSymptoms(input)) return false;
    try {
      return Boolean(baseWantsOfflineSmartDatabaseAnswer(input));
    } catch (_error) {
      return false;
    }
  };

  const signature = (id, target, cueGroups, positiveCases, priority, options) => Object.freeze({
    id,
    target,
    cueGroups: cueGroups.map((group) => Object.freeze(group.slice())),
    minGroups: options && options.minGroups ? options.minGroups : 2,
    requiredGroups: Object.freeze((options && options.requiredGroups ? options.requiredGroups : []).slice()),
    exclude: Object.freeze((options && options.exclude ? options.exclude : []).slice()),
    positiveCases: Object.freeze(positiveCases.slice()),
    priority: Number(priority || 0)
  });

  const SIGNATURES = Object.freeze([
    signature("uti-symptoms", "uti", [
      [/\b(dysuria|burn(?:ing|in)?(?: sensation)?(?: when| while)? (?:i |you |they )?(?:pee|urinate)|painful urination|burnin urinat)\b/i],
      [/\b(frequency|frequent urination|frequencey|urinat(?:e|ing) (?:often|frequently)|pee(?:ing)? (?:often|frequently)|urgency|urgent need|suprapubic|small amounts?)\b/i]
    ], ["dysuria with urinary frequency", "painful urination plus urgency and suprapubic discomfort"], 45),
    signature("myocardial-infarction-symptoms", "myocardialInfarction", [
      [/\b(chest (?:pressure|pain|tightness|heaviness)|crush(?:ing|in) chest|squeezing chest|chest presure)\b/i],
      [/\b(left arm|either arm|jaw|neck|shoulder)\b.*\b(pain|ache|radiat|spread)|\b(radiat|spread).*\b(left arm|either arm|jaw|neck|shoulder)\b/i],
      [/\b(sweat(?:ing|y)|sweting|diaphoretic|nausea|shortness of breath|breathless)\b/i]
    ], ["crushing chest pressure spreading to the left arm with sweating", "squeezing chest pain with jaw discomfort and nausea"], 85),
    signature("stroke-symptoms", "stroke", [
      [/\b(face droop|facial droop|one sided (?:weakness|numbness)|unilateral (?:weakness|numbness)|arm weakness|leg weakness)\b/i],
      [/\b(slur(?:red)? spee?ch|slured speach|speech trouble|trouble speaking|cant speak|cannot speak|word finding|aphasia)\b/i],
      [/\b(sudden|vision loss|double vision|severe imbalance|ataxia)\b/i]
    ], ["one sided face droop with slurred speech", "sudden arm weakness plus trouble speaking and vision change"], 90),
    signature("pulmonary-embolism-symptoms", "pulmonaryEmbolism", [
      [/\b(shortness? of breath|shortnes of breath|dyspnea|breathless|cant breathe|cannot breathe|unexplained hypoxemia)\b/i],
      [/\b(pleuritic|sharp (?:chest )?pain|pain (?:with|during|when) breathing|coughing blood|hemoptysis)\b/i],
      [/\b(long flight|flite|air travel|recent travel|immobile|immobility|immobili[sz](?:e|ed|ation)|bedrest|recent surgery|postpartum|active cancer|known dvt)\b/i]
    ], ["shortness of breath with pleuritic chest pain after a long flight", "breathlessness with sharp pain during breathing after prolonged immobilization"], 80),
    signature("deep-vein-thrombosis-symptoms", "deepVeinThrombosis", [
      [/\b(one|single|left|right|unilateral|unilaterl)\b.{0,20}\b(calf|leg)\b|\b(one calf|one leg)\b/i],
      [/\b(?:(?:calf|leg) (?:is )?(?:swoll(?:en|ing)|sweling|pain(?:ful)?|tender|warm|red)|(?:swoll(?:en|ing)|sweling|pain(?:ful)?|tender|warm|red) (?:calf|leg)|pitting edema (?:of|in) (?:one|the) (?:calf|leg))\b/i],
      [/\b(surgery|surgury|immobile|immobility|immobili[sz](?:e|ed|ation)|bedrest|cast|long flight|travel|cancer|pregnan|postpartum)\b/i]
    ], ["one swollen painful calf after surgery", "unilateral warm leg swelling after prolonged travel"], 65),
    signature("appendicitis-symptoms", "appendicitis", [
      [/\b(right lower (?:belly|abdomen|abdominal)|right lower quadrant|rlq|lower right abdominal|right lower qudrant)\b/i],
      [/\b(nausea|nausia|vomit|fever|loss of appetite|anorexia)\b/i],
      [/\b(migrat|moved|moves)\b.{0,30}\b(belly button|umbilic|right lower|rlq)\b/i]
    ], ["right lower belly pain with nausea and loss of appetite", "pain moving from the belly button to the right lower quadrant with fever"], 55),
    signature("cholecystitis-symptoms", "cholecystitis", [
      [/\b(right upper (?:belly|abdomen|abdominal)|right upper quadrant|ruq)\b/i],
      [/\b(fatty (?:food|meal)|after (?:eating|a meal)|postprandial)\b/i],
      [/\b(nausea|vomit|fever|murphy|right shoulder)\b/i]
    ], ["right upper belly pain and nausea after a fatty meal", "RUQ pain after eating with fever and right shoulder discomfort"], 50),
    signature("heart-failure-symptoms", "heartFailure", [
      [/\b(cant lie flat|cannot lie flat|orthopn(?:ea|eic)|wakes? (?:up )?gasping|paroxysmal nocturnal dyspnea|pnd)\b/i],
      [/\b(swoll(?:en|ing) (?:legs|ankles|feet)|leg edema|ankle edema|edma|rapid weight gain)\b/i],
      [/\b(shortness? of breath|dyspnea|breathless|fatigue)\b/i]
    ], ["cannot lie flat with swollen legs and waking up gasping", "orthopnea plus ankle edema and shortness of breath"], 60),
    signature("pneumonia-symptoms", "pneumonia", [
      [/\b(fever|feaver|chills)\b/i],
      [/\b(cough|coughing)\b/i],
      [/\b(rust colored sputum|sputum|phlegm|pleuritic|hypoxemia|low oxygen)\b/i]
    ], ["fever and cough with rust colored sputum", "chills cough and pleuritic pain with low oxygen"], 52, { minGroups: 3 }),
    signature("meningitis-symptoms", "meningitis", [
      [/\b(fever|feaver)\b/i],
      [/\b(stiff neck|stif neck|nuchal rigidity)\b/i],
      [/\b(photophobia|photofobia|light hurts|confusion|petechial rash|severe headache)\b/i]
    ], ["fever with a stiff neck and photophobia", "fever stiff neck confusion and a petechial rash"], 86),
    signature("dka-symptoms", "dka", [
      [/\b(fruity breath|fruty breath|acetone breath)\b/i],
      [/\b(kussmaul|deep fast breathing|deep rapid breathing|deep labored breathing|deep fast brething)\b/i],
      [/\b(high (?:glucose|sugar)|hyperglycemia|high glocose|ketones?|polyuria|polydipsia|peeing a lot|very thirsty)\b/i],
      [/\b(abdominal pain|vomit|dehydrat|weight loss)\b/i]
    ], ["fruity breath and deep fast breathing with high glucose", "Kussmaul breathing with ketones thirst and frequent urination"], 75),
    signature("hypoglycemia-symptoms", "hypoglycemia", [
      [/\b(low (?:glucose|blood sugar|sugar)|hypoglyc)\b/i],
      [/\b(shak(?:y|ing)|sweat(?:ing|y)|confus(?:ed|ion)|weak|hungry|seizure|neuroglycopen)\b/i],
      [/\b(insulin|diabetes|glucose medicine|sulfonylurea)\b/i]
    ], ["low blood sugar with shaking sweating and confusion", "insulin user is weak and sweaty with low glucose"], 74),
    signature("gi-bleeding-symptoms", "giBleeding", [
      [/\b(melena|black tarry|coffee ground|hematemesis|vomit(?:ing)? blood|bright red blood in stool|maroon stool)\b/i],
      [/\b(stool|bowel movement|vomit|emesis|rectal|from the mouth)\b/i],
      [/\b(dizzy|syncope|faint|weak|pale|hypotens|rapid pulse)\b/i]
    ], ["black tarry stool with dizziness and weakness", "coffee ground vomit with pallor and a rapid pulse"], 78, { exclude: [/\b(iron supplement|bismuth|pepto bismol)\b/i] }),
    signature("aortic-dissection-symptoms", "aorticDissection", [
      [/\b(sudden tearing|sudden ripping|tearing pain|ripping pain)\b/i],
      [/\b(chest|back|between (?:the )?shoulder blades)\b/i],
      [/\b(pulse difference|unequal pulses|blood pressure difference|neurologic deficit|syncope|faint)\b/i]
    ], ["sudden tearing chest pain going through to the back", "ripping pain between the shoulder blades with unequal pulses"], 96),
    signature("shingles-symptoms", "shingles", [
      [/\b(painful|burning|tingling|allodynia)\b/i],
      [/\b(rash|blister|vesicle)\b/i],
      [/\b(stripe|band|one side|unilateral|dermatom|does not cross|stops at the midline)\b/i]
    ], ["painful blistering rash in a stripe on one side", "burning unilateral dermatomal rash that stops at the midline"], 58, { minGroups: 3 }),
    signature("acute-pancreatitis-symptoms", "acutePancreatitis", [
      [/\b(epigastric|upper abdominal|upper belly)\b.*\b(pain|tender)|\b(pain|tender).*\b(epigastric|upper abdominal|upper belly)\b/i],
      [/\b(radiat|goes|spread)\b.{0,25}\b(back)\b|\bto the back\b/i],
      [/\b(lean(?:ing)? forward|better leaning|sitting forward)\b/i],
      [/\b(nausea|vomit|alcohol|gallstone)\b/i]
    ], ["epigastric pain radiating to the back and better leaning forward", "upper abdominal pain to the back with vomiting after heavy alcohol use"], 63),
    signature("preeclampsia-symptoms", "preeclampsia", [
      [/\b(pregnan(?:t|cy)|postpartum|after delivery|after giving birth)\b/i],
      [/\b(headache|vision change|blurred vision|spots|scotoma)\b/i],
      [/\b(right upper quadrant|ruq|epigastric pain)\b/i],
      [/\b(high blood pressure|hypertension|swollen hands|swollen face|proteinuria|protein in urine)\b/i]
    ], ["pregnant with headache vision changes and swollen hands", "postpartum headache high blood pressure and right upper quadrant pain"], 94, { minGroups: 3 }),
    signature("testicular-torsion-symptoms", "testicularTorsion", [
      [/\b(sudden|abrupt|severe)\b/i],
      [/\b(one|left|right|unilateral)\b.{0,20}\b(testicle|testicular|scrotal|scrotum)\b|\btesticle pain\b/i],
      [/\b(nausea|vomit|high riding|horizontal lie|absent cremaster)\b/i]
    ], ["sudden one sided testicle pain with nausea", "abrupt severe scrotal pain with a high riding testis"], 97),
    signature("angle-closure-glaucoma-symptoms", "angleClosureGlaucoma", [
      [/\b(eye pain|painful red eye|red painful eye)\b/i],
      [/\b(halos?|blurred vision|hazy vision)\b/i],
      [/\b(nausea|vomit|headache|fixed pupil|mid dilated pupil)\b/i]
    ], ["eye pain with halos around lights and nausea", "painful red eye with blurred vision headache and vomiting"], 89),
    signature("retinal-detachment-symptoms", "retinalDetachment", [
      [/\b(flashes?|photopsia)\b/i],
      [/\b(floaters?|floters)\b/i],
      [/\b(curtain|curtin|shadow|visual field loss|field of vision)\b/i],
      [/\b(painless sudden vision loss|painless vision change)\b/i]
    ], ["flashes and floaters followed by a curtain over vision", "painless sudden visual shadow with new flashes and floaters"], 88),
    signature("ten-symptoms", "ten", [
      [/\b(new|recent(?:ly)?|started|restarted|after|taking|began)\b.{0,40}\b(medicine|medication|drug|antibiotic|sulfonamide|trimethoprim|sulfamethoxazole|bactrim|allopurinol|lamotrig(?:ine|ene)|lamictal|carbamazepine|tegretol|phenytoin|dilantin|phenobarbital|nevirapine)\b|\b(medicine|medication|drug|antibiotic|sulfonamide|trimethoprim|sulfamethoxazole|bactrim|allopurinol|lamotrig(?:ine|ene)|lamictal|carbamazepine|tegretol|phenytoin|dilantin|phenobarbital|nevirapine)\b.{0,40}\b(new|recent(?:ly)?|started|restarted|after|taking|began)\b/i],
      [/\b(painful|tender|dusky|purpuric)\b.{0,25}\b(rash|skin|blister|blisters)|\b(skin|epidermis)\b.{0,20}\b(peel(?:ing|s)?|peal(?:ing|s)?|slough(?:ing|s)?|detach(?:ed|ing|ment)?|detatch(?:ed|ing|ment)?|falling off)|\b(sheet like|flaccid bullae|epidermal detachment)\b/i],
      [/\b(mouth|oral|lip|eye|ocular|conjunctiv|genital|vaginal|penile|urethral|mucosal?)\b.{0,25}\b(sore|sores|sors?|pain|burning|erosion|erosions|ulcer|ulcers|blister|blisters|crust|crusting)|\b(photophobia|painful swallowing|hemorrhagic lips)\b/i],
      [/\b(over|greater than|more than|above|>)\s*(?:30|thirty)\s*(?:%|percent)\b|\b(widespread|extensive|sheet like|large sheets|most of (?:the )?body|body surface area|bsa)\b/i]
    ], [
      "new lamotrigine followed by painful peeling skin, mouth sores, and widespread blisters",
      "over 30 percent skin detachment with eye pain after recently started allopurinol"
    ], 99, { minGroups: 3, requiredGroups: [1] })
  ]);

  const POSITIVE_CASES = Object.freeze(SIGNATURES.flatMap((entry) => entry.positiveCases
    .map((query) => Object.freeze({ query, signature: entry.id, target: entry.target }))));

  const EXACT_CASES = Object.freeze([
    Object.freeze({ query: "Advil", target: "ibuprofen" }),
    Object.freeze({ query: "Motrin", target: "ibuprofen" }),
    Object.freeze({ query: "Benadryl", target: "diphenhydramine" }),
    Object.freeze({ query: "IBS", target: "ibs" }),
    Object.freeze({ query: "PNA", target: "pneumonia" }),
    Object.freeze({ query: "SLE", target: "sle" }),
    Object.freeze({ query: "DM2", target: "type2Diabetes" }),
    Object.freeze({ query: "T2D", target: "type2Diabetes" }),
    Object.freeze({ query: "HLD", target: "dyslipidemia", optional: true }),
    Object.freeze({ query: "TEN", target: "ten" }),
    Object.freeze({ query: "Lyell syndrome", target: "ten" })
  ]);

  const TYPO_CASES = Object.freeze([
    Object.freeze({ query: "burnin when urinate with frequencey", target: "uti", signature: "uti-symptoms" }),
    Object.freeze({ query: "crushin chest presure to the left arm with sweting", target: "myocardialInfarction", signature: "myocardial-infarction-symptoms" }),
    Object.freeze({ query: "one sided face droop and slured speach", target: "stroke", signature: "stroke-symptoms" }),
    Object.freeze({ query: "shortnes of breath with pleuritic pain after a long flite", target: "pulmonaryEmbolism", signature: "pulmonary-embolism-symptoms" }),
    Object.freeze({ query: "unilaterl calf sweling after surgury", target: "deepVeinThrombosis", signature: "deep-vein-thrombosis-symptoms" }),
    Object.freeze({ query: "right lower qudrant pain with nausia", target: "appendicitis", signature: "appendicitis-symptoms" }),
    Object.freeze({ query: "orthopea with leg edma and shortness of breath", target: "heartFailure", signature: "heart-failure-symptoms" }),
    Object.freeze({ query: "feaver stif neck and photofobia", target: "meningitis", signature: "meningitis-symptoms" }),
    Object.freeze({ query: "fruty breath with deep fast brething and high glocose", target: "dka", signature: "dka-symptoms" }),
    Object.freeze({ query: "flashes floters and a curtin over vision", target: "retinalDetachment", signature: "retinal-detachment-symptoms" }),
    Object.freeze({ query: "painful skin pealing and mouth sors after new lamotrigene with over 30 percent detatchment", target: "ten", signature: "ten-symptoms" })
  ]);

  const COLLISION_CASES = Object.freeze([
    "Benadryl overdose and anticholinergic toxicity",
    "Motrin overdose treatment",
    "IBS medication examples",
    "PNA antibiotic dosing",
    "SLE medication class",
    "DM2 medication mechanism",
    "chest pain",
    "shortness of breath",
    "leg swelling",
    "headache",
    "abdominal pain",
    "rash",
    "dizziness",
    "fever and cough after influenza vaccine",
    "black stool after iron supplements",
    "red eye",
    "flashes in a camera",
    "pregnancy headache",
    "what test confirms pulmonary embolism",
    "what lab is elevated in myocardial infarction",
    "which medicine treats shingles",
    "physical therapy after surgery",
    "morphine sulfate dose",
    "primary care provider appointment",
    "burning when I pee",
    "which longer sulfonylurea has active metabolites and recurrent low sugar in older adults",
    "abruptly stopped levodopa now high fever rigidity confusion and high CK",
    "what does coffee ground emesis mean",
    "TENS unit for chronic back pain",
    "transcutaneous electrical nerve stimulation settings",
    "ten",
    "what is ten",
    "top ten medications to study",
    "top TEN medications to study",
    "ten patients were discharged",
    "ten out of ten pain score",
    "pain is ten out of ten",
    "ten milligrams by mouth",
    "ten days after surgery",
    "chapter ten",
    "tenecteplase dose for ischemic stroke",
    "TNKase stroke protocol",
    "Stevens-Johnson syndrome",
    "widespread mouth sores after a new antibiotic"
  ]);

  const AMBIGUITY_CASES = Object.freeze([
    Object.freeze({ query: "GBS screening in pregnancy before delivery", target: "groupBStrep", guard: "gbs-obstetric" }),
    Object.freeze({ query: "GBS after diarrhea with ascending weakness and absent reflexes", target: "guillainBarre", guard: "gbs-neurologic" }),
    Object.freeze({ query: "PCP pneumonia in HIV with hypoxemia", target: "pneumocystis", optional: true, guard: "pcp-pneumocystis" }),
    Object.freeze({ query: "PCP appointment with my family doctor", target: "", guard: "pcp-primary-care" }),
    Object.freeze({ query: "PT INR while taking warfarin", target: "prothrombinTime", guard: "pt-coagulation" }),
    Object.freeze({ query: "PT exercises after knee replacement", target: "", guard: "pt-physical-therapy" }),
    Object.freeze({ query: "MS relapse with optic neuritis and demyelinating lesions", target: "multipleSclerosis", guard: "ms-neurologic" }),
    Object.freeze({ query: "MS Contin morphine dose", target: "", guard: "ms-morphine" })
  ]);

  const EMERGENCY_CASES = Object.freeze([
    "I am having crushing chest pressure to my left arm with sweating right now",
    "My face suddenly drooped and I cannot speak clearly now",
    "I have sudden shortness of breath and sharp chest pain after a long flight",
    "I am vomiting blood and feel faint right now",
    "I have sudden tearing chest pain into my back now",
    "I am pregnant with a severe headache vision changes and swollen hands now",
    "My son has sudden severe one sided testicle pain with vomiting",
    "I have eye pain halos and nausea with sudden blurred vision",
    "My skin is painfully peeling with mouth sores after a new medicine"
  ]);

  const PERSONAL_SYMPTOM_CASES = Object.freeze([
    Object.freeze({ query: "burning when I pee with urinary frequency", target: "uti" }),
    Object.freeze({ query: "my chest pressure spreads to my jaw and I am sweating", target: "myocardialInfarction" }),
    Object.freeze({ query: "my mother has a fever, a stiff neck, and confusion", target: "meningitis" }),
    Object.freeze({ query: "my skin is painfully peeling with mouth sores after new lamotrigine and it is widespread", target: "ten" })
  ]);

  const EDUCATIONAL_CASES = Object.freeze(SIGNATURES.map((entry) => Object.freeze({
    query: `NCLEX study case: ${entry.positiveCases[0]}`,
    signature: entry.id,
    target: entry.target
  })));

  const uppercaseTenIdentity = (input) => {
    const frame = compactLookupFrame(input);
    if (frame !== "ten" && frame !== "t e n") return false;
    return /\bTEN\b/.test(String(input || ""))
      || /(?:^|\s)T\s*[.\-]?\s*E\s*[.\-]?\s*N(?:\s|[?.!]|$)/.test(String(input || ""));
  };

  const tenCollisionGuard = (input) => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (!text) return false;
    if (/\b(tens|transcutaneous electrical nerve stimulation|tenecteplase|tnkase|tnk)\b/i.test(text)) return true;
    const explicitLongTenName = /\b(toxic epidermal necrolysis|toxic epidermal necrosis|lyell|scorten|sjs ten overlap|sjs ten spectrum)\b/i.test(text);
    const uppercaseTen = /\bTEN\b/.test(raw);
    const obviousNumericUse = /\btop\s+ten\b|\bten\s+out\s+of\s+ten\b|\bten\b.{0,20}\b(patient|patients|people|milligram|milligrams|mg|day|days|week|weeks|year|years|chapter|chapters|items?|things?)\b|\b(number|chapter)\s+ten\b/i.test(text);
    if (!explicitLongTenName && obviousNumericUse) return true;
    const uppercaseTenMedicalContext = uppercaseTen && (/\b(complication|complications|symptom|symptoms|sign|signs|manifestation|manifestations|red flags?|cause|causes|etiology|risk factors?|lab|labs|laboratory|findings|pathophysiology|mechanism|diagnosis|diagnostic|management|treatment|treatments|nursing|scorten|mucosal|epidermal|skin|ocular|eye|prognosis|mortality|prevention|medication|medications|medicine|medicines|drug|drugs|culprit|granulysin|keratinocyte|body surface|bsa)\b/i.test(text)
      || /\b(?:what|which)\s+(?:drug|drugs|medicine|medicines|medication|medications)\b.{0,35}\b(?:cause|causes|trigger|triggers)\b/i.test(text)
      || compactLookupFrame(raw) === "ten");
    const protectedTenIdentity = explicitLongTenName || uppercaseTenMedicalContext;
    if (!protectedTenIdentity && (/\b(top|list|give|show|chapter|number|rated?|score|pain|dose|take|administer|prescribe)\b.{0,35}\bten\b/i.test(text)
      || /\bten\b.{0,35}\b(patient|patients|people|medication|medications|medicine|medicines|drug|drugs|milligram|milligrams|mg|day|days|week|weeks|year|years|item|items|thing|things|chapter|chapters|out of ten|intervention|interventions|disease|diseases|lab|labs)\b/i.test(text))) return true;
    const explicitTenSpectrum = explicitLongTenName || uppercaseTen;
    if (!explicitTenSpectrum && /\b(staphylococcal scalded skin syndrome|sssss?|thermal burn|dress|drug reaction with eosinophilia|erythema multiforme|agep|acute generalized exanthematous pustulosis|tenosynovitis|tendon injury)\b/i.test(text)) return true;
    if (!explicitTenSpectrum
      && /\b(lamotrigine|allopurinol|carbamazepine|phenytoin|antibiotic|sulfonamide)\b/i.test(text)
      && /\b(dose|dosing|titration|mechanism|pharmacology|indication|interaction)\b/i.test(text)
      && !/\b(painful|tender|dusky|blister|peel|slough|detach|mucosal|mouth sores?|eye pain|widespread)\b/i.test(text)) return true;
    if (!explicitTenSpectrum
      && /\b(new|recent(?:ly)?|started|restarted|after)\b.{0,45}\b(medicine|medication|drug|antibiotic)\b/i.test(text)
      && /\b(mouth|oral|eye|ocular|genital|mucosal?)\b.{0,25}\b(sore|sores|pain|erosion|erosions|ulcer|ulcers)\b/i.test(text)
      && !/\b(painful|tender|dusky|purpuric)\b.{0,25}\b(rash|skin|blister)|\b(skin|epidermis)\b.{0,20}\b(peel|peal|slough|detach|detatch|falling off)|\b(sheet like|flaccid bullae|epidermal detachment)\b/i.test(text)) return true;
    const explicitSjs = /\b(sjs|stevens johnson syndrome|stevens johnson disease)\b/i.test(text);
    if (explicitSjs && !explicitTenSpectrum) return true;
    if (/\bten\b/i.test(text) && !/\bTEN\b/.test(raw)) {
      const convincingMedicalContext = /\b(epidermal|necrolysis|lyell|scorten|skin (?:peel|slough|detach)|mucosal|mouth sores?|ocular erosions?|sheet like detachment|greater than 30|more than 30|over 30)\b/i.test(text);
      if (!convincingMedicalContext) return true;
    }
    return false;
  };

  const tenCollisionResponse = (input) => {
    const raw = String(input || "");
    const text = normalize(input);
    if (!text) return "";
    const explicitlyNamesTenCondition = /\b(toxic epidermal necrolysis|toxic epidermal necrosis|lyell|scorten|sjs ten overlap|sjs ten spectrum)\b/i.test(text);
    const explicitlyNamesTensDevice = /\btranscutaneous electrical nerve stimulation\b/i.test(text)
      || /\btens\s+(?:unit|machine|device|therapy|electrodes?|settings|stimulation)\b/i.test(text)
      || (/\bTENS\b/.test(raw) && compactLookupFrame(raw) === "tens");
    if (!explicitlyNamesTenCondition
      && explicitlyNamesTensDevice) {
      return [
        "**TENS means transcutaneous electrical nerve stimulation, not toxic epidermal necrolysis.**",
        "A TENS unit sends a weak electrical current through skin electrodes and may provide temporary pain relief by changing pain signaling; it does not work for everyone and does not treat the cause of pain.",
        "Follow the device instructions and clinician guidance. Do not place pads on irritated, broken, infected, or numb skin; on the neck, mouth, or eyes; or across the chest and back simultaneously. Do not use TENS if you have a pacemaker or a diagnosed seizure disorder, or during pregnancy, unless the clinician responsible for your care says it is appropriate.",
        "New, severe, unexplained, or worsening pain still needs assessment, especially with trauma, fever, weakness, numbness, or bowel or bladder changes."
      ].join(" ");
    }
    if (!explicitlyNamesTenCondition && /\btens of\b/i.test(text)) {
      return "**\u201cTens of\u201d describes an approximate quantity, usually several dozen.** I read **ten** here as a number word, not as a medical abbreviation. Your message does not ask a clinical question, so tell me what you want to understand rather than being sent to an unrelated encyclopedia entry.";
    }
    if (/^(?:please\s+)?(?:count(?:ing)?(?:\s+from)?\s+one\s+(?:to|through)\s+ten|count(?:ing)?\s+to\s+ten|(?:list|say)\s+(?:the\s+)?numbers?\s+one\s+(?:to|through)\s+ten)[?.!]*$/i.test(text)) {
      return "**Counting from one to ten:** one (1), two (2), three (3), four (4), five (5), six (6), seven (7), eight (8), nine (9), ten (10). I treated **ten** as the number 10, not the medical abbreviation **TEN**. If you meant toxic epidermal necrolysis, use the full name or uppercase TEN with medical context.";
    }
    return "";
  };

  const ambiguityResolution = (input) => {
    const text = normalize(input);
    if (tenCollisionGuard(input)) {
      return {
        guard: "ten-noncondition",
        target: "",
        blockedLabels: ["Toxic epidermal necrolysis", "Toxic epidermal necrolysis (TEN)"]
      };
    }
    if (/\bgbs\b/i.test(text)) {
      if (/\b(pregnan|prenatal|antenatal|labor|delivery|newborn|neonat|vaginal rectal|culture|screen|colonization)\b/i.test(text)) {
        return { guard: "gbs-obstetric", target: "groupBStrep" };
      }
      if (/\b(ascending weakness|areflex|absent reflex|neuropathy|paralysis|post infectious|after diarrhea|after gastroenteritis|ventilatory weakness|csf protein)\b/i.test(text)) {
        return { guard: "gbs-neurologic", target: "guillainBarre" };
      }
    }
    if (/\bpcp\b/i.test(text)) {
      if (/\b(primary care|family doctor|family medicine|general practitioner|appointment|provider|checkup)\b/i.test(text)) {
        return { guard: "pcp-primary-care", target: "", blockedLabels: ["Dapsone", "Pneumocystis pneumonia", "Pneumocystis jirovecii pneumonia"] };
      }
      if (/\b(hiv|aids|cd4|pneumonia|hypoxemia|dry cough|opportunistic|pneumocystis)\b/i.test(text)) {
        return { guard: "pcp-pneumocystis", target: "pneumocystis", blockedLabels: ["Dapsone"] };
      }
      return { guard: "pcp-ambiguous", target: "", blockedLabels: ["Dapsone"] };
    }
    if (/\bpt\b/i.test(text)) {
      if (/\b(inr|warfarin|coumadin|coagulation|clotting|prothrombin|bleeding|vitamin k)\b/i.test(text)) {
        return { guard: "pt-coagulation", target: "prothrombinTime" };
      }
      if (/\b(physical therapy|physio|rehab|exercise|gait|walker|range of motion|knee replacement|hip replacement)\b/i.test(text)) {
        return { guard: "pt-physical-therapy", target: "", blockedLabels: ["PT", "PT/INR", "Prothrombin time"] };
      }
    }
    if (/\bms\b/i.test(text)) {
      if (/\b(ms contin|morphine|opioid|analges|dose|dosing|extended release)\b/i.test(text)) {
        return { guard: "ms-morphine", target: "", blockedLabels: ["Multiple sclerosis"] };
      }
      if (/\b(demyelin|optic neuritis|relapse|neurolog|oligoclonal|white matter|spasticity|multiple sclerosis)\b/i.test(text)) {
        return { guard: "ms-neurologic", target: "multipleSclerosis" };
      }
      if (/\b(mitral stenosis|murmur|valve|rheumatic)\b/i.test(text)) {
        return { guard: "ms-mitral-stenosis", target: "", blockedLabels: ["Multiple sclerosis"] };
      }
    }
    return null;
  };

  const exactResolution = (input) => {
    const key = compactLookupFrame(input);
    const route = exactRouteIndex.get(key);
    if (!route) return null;
    if (route.target === "ten" && (key === "ten" || key === "t e n") && !uppercaseTenIdentity(input)) return null;
    if ((route.target === "diphenhydramine" || route.target === "ibuprofen") && toxicityContext(input)) return null;
    const candidate = exactCandidateForTarget(TARGETS[route.target]);
    if (!candidate) return null;
    return {
      kind: "exact",
      routeId: route.id,
      target: route.target,
      candidate,
      cueHits: [],
      score: 9000,
      activeCurrent: false,
      educational: clearlyEducational(input)
    };
  };

  const namedTenResolution = (input) => {
    if (tenCollisionGuard(input)) return null;
    const raw = String(input || "");
    const text = normalize(raw);
    const directlyNamesTen = /\b(toxic epidermal necrolysis|toxic epidermal necrosis|lyell(?:s)? syndrome|scorten|sjs ten overlap|sjs ten spectrum)\b/i.test(text)
      || /\bTEN\b/.test(raw);
    if (!directlyNamesTen) return null;
    const candidate = exactCandidateForTarget(TARGETS.ten);
    if (!candidate) return null;
    return {
      kind: "named",
      routeId: "ten-named-concept",
      target: "ten",
      candidate,
      cueHits: [],
      score: 8800,
      activeCurrent: currentPersonalSymptoms(input),
      educational: clearlyEducational(input)
    };
  };

  const signatureMatches = (entry, text) => {
    if (entry.exclude.some((pattern) => pattern.test(text))) return null;
    const cueHits = entry.cueGroups.map((group, index) => group.some((pattern) => pattern.test(text)) ? index : -1)
      .filter((index) => index >= 0);
    if (cueHits.length < entry.minGroups) return null;
    if (entry.requiredGroups.some((index) => !cueHits.includes(index))) return null;
    const candidate = exactCandidateForTarget(TARGETS[entry.target]);
    if (!candidate) return null;
    return {
      kind: "signature",
      routeId: entry.id,
      target: entry.target,
      candidate,
      cueHits,
      score: cueHits.length * 100 + entry.priority
    };
  };

  const symptomResolution = (input) => {
    if (explicitDomainIntent(input)) return null;
    const text = normalize(input);
    const matches = SIGNATURES.map((entry) => signatureMatches(entry, text)).filter(Boolean)
      .sort((left, right) => right.score - left.score || left.routeId.localeCompare(right.routeId));
    if (!matches.length) return null;
    if (priorSpecificMedicationClue(input)) return null;
    if (matches[1] && matches[0].target !== matches[1].target && matches[0].score - matches[1].score < 15) return null;
    return {
      ...matches[0],
      activeCurrent: currentPersonalSymptoms(input),
      educational: clearlyEducational(input)
    };
  };

  const tenSymptomResolution = (input) => {
    if (explicitDomainIntent(input)) return null;
    const entry = SIGNATURES.find((candidate) => candidate.id === "ten-symptoms");
    const matched = entry ? signatureMatches(entry, normalize(input)) : null;
    if (!matched) return null;
    return {
      ...matched,
      activeCurrent: currentPersonalSymptoms(input),
      educational: clearlyEducational(input)
    };
  };

  const resolveUncached = (input) => {
    if (!normalize(input) || priorActiveEmergency(input)) return null;
    const exact = exactResolution(input);
    if (exact) return exact;
    const namedTen = namedTenResolution(input);
    if (namedTen) return namedTen;
    const ambiguity = ambiguityResolution(input);
    if (ambiguity && ambiguity.target) {
      const candidate = exactCandidateForTarget(TARGETS[ambiguity.target]);
      if (candidate) {
        return {
          kind: "ambiguity",
          routeId: ambiguity.guard,
          target: ambiguity.target,
          candidate,
          cueHits: [],
          score: 8500,
          activeCurrent: false,
          educational: clearlyEducational(input)
        };
      }
    }
    const tenSymptoms = tenSymptomResolution(input);
    if (tenSymptoms) return tenSymptoms;
    if (priorDirectEducationalOwner(input) || priorCanonicalTarget(input)) return null;
    return symptomResolution(input);
  };

  /*
   * A single user request can pass through suggestions, detail selection, and
   * response generation. Keep those stages from recomputing the same routing
   * decision while ensuring no caller can mutate the cached result. TEN is
   * intentionally case-sensitive, so its uppercase identity is part of the
   * otherwise-normalized key.
   */
  const RESOLUTION_CACHE_LIMIT = 96;
  const NO_RESOLUTION = Symbol("wave35-no-resolution");
  const resolutionCache = new Map();
  const resolutionCacheKey = (input) => {
    const raw = String(input || "");
    return `${normalize(raw)}\u0000${uppercaseTenIdentity(raw) ? "TEN" : "ten"}\u0000${/\bTENS\b/.test(raw) ? "TENS" : "tens"}`;
  };
  const cloneResolution = (resolved) => resolved ? {
    ...resolved,
    candidate: resolved.candidate ? { ...resolved.candidate } : resolved.candidate,
    cueHits: safeArray(resolved.cueHits).slice()
  } : null;
  const cacheResolution = (key, resolved) => {
    const snapshot = resolved ? Object.freeze({
      ...resolved,
      candidate: resolved.candidate ? Object.freeze({ ...resolved.candidate }) : resolved.candidate,
      cueHits: Object.freeze(safeArray(resolved.cueHits).slice())
    }) : NO_RESOLUTION;
    resolutionCache.set(key, snapshot);
    while (resolutionCache.size > RESOLUTION_CACHE_LIMIT) {
      resolutionCache.delete(resolutionCache.keys().next().value);
    }
    return cloneResolution(resolved);
  };
  const resolve = (input) => {
    const key = resolutionCacheKey(input);
    if (resolutionCache.has(key)) {
      const cached = resolutionCache.get(key);
      // Refresh insertion order so the bounded map behaves as an LRU cache.
      resolutionCache.delete(key);
      resolutionCache.set(key, cached);
      return cached === NO_RESOLUTION ? null : cloneResolution(cached);
    }
    return cacheResolution(key, resolveUncached(input));
  };

  const routeQuery = (input) => {
    const resolved = resolve(input);
    return resolved ? candidateLabel(resolved.candidate) : "";
  };

  const guardedLabel = (value, guard) => {
    if (!guard || !safeArray(guard.blockedLabels).length) return false;
    const key = normalize(value);
    return guard.blockedLabels.some((label) => normalize(label) === key);
  };

  const filteredBaseSuggestions = (input, suggestions) => {
    const guard = ambiguityResolution(input);
    if (!guard || !safeArray(guard.blockedLabels).length) return safeArray(suggestions);
    return safeArray(suggestions).filter((candidate) => !guardedLabel(candidateLabel(candidate), guard));
  };

  const fastCanonicalDiabetesOwner = (input) => {
    if (typeof wave41DiabetesPathologyIntentSuggestion !== "function") return null;
    const candidate = wave41DiabetesPathologyIntentSuggestion(input);
    return candidate && candidate.type === "pathology" ? candidate : null;
  };

  const fastCanonicalBaseOwner = (input) => {
    if (typeof fastCanonicalEncyclopediaCandidate !== "function") return null;
    // Wave35 owns its configured exact aliases and safety-sensitive named
    // routes (for example TEN/Lyell syndrome and DM2/T2D). Resolve that small
    // table first; the bounded LRU makes the subsequent wrapper check free.
    // The general fast identity layer remains the path for all other cards.
    if (resolve(input)) return null;
    return fastCanonicalEncyclopediaCandidate(input);
  };

  const safetyResponse = (resolved) => {
    const label = candidateLabel(resolved && resolved.candidate) || "this symptom pattern";
    if (resolved && resolved.target === "ten") {
      return `**Your wording may describe a life-threatening skin and mucosal emergency. This is not a diagnosis, and ANI must not auto-open an article in place of care.** The pattern overlaps with **${label}** and needs immediate emergency evaluation now. Call 911 or your local emergency number for trouble breathing, voice change, collapse, confusion, severe weakness, rapid progression, or eye involvement; otherwise go to an emergency department immediately. Do not take another dose of a suspected newly started medicine unless the emergency team specifically directs it. Bring every medication package or a complete medication list, including start dates, because rapid culprit withdrawal and specialist skin, eye, airway, fluid, and infection care can be time critical.`;
    }
    return `**Your wording may describe an active medical problem. Do not rely on an encyclopedia search to diagnose it.** The pattern overlaps with **${label}**, but other causes can look similar. Call 911 or your local emergency number now for chest pressure, breathing difficulty, stroke signs, severe bleeding, collapse, sudden vision loss, sudden severe testicular pain, pregnancy or postpartum warning signs, or rapid deterioration. Otherwise contact a clinician promptly for individualized assessment.`;
  };

  const redirectFor = (resolved, input) => {
    const label = candidateLabel(resolved.candidate);
    const normalizedInput = normalize(input);
    let preface = `Opening the intended encyclopedia entry **${label}**.`;
    if (resolved.kind === "signature") {
      preface = `Opening **${label}**, the closest installed encyclopedia entry for the cue pattern you described. This is educational routing, not a diagnosis.`;
    } else if (resolved.target === "ten" && resolved.kind === "named" && /\bscorten\b/i.test(normalizedInput)) {
      preface = `Opening **${label}** because this entry explains SCORTEN. SCORTEN is a prognostic mortality-risk score used in SJS/TEN; it is not another name for TEN and does not diagnose it.`;
    } else if (resolved.target === "ten" && resolved.kind === "named" && /\bsjs ten overlap\b/i.test(normalizedInput)) {
      preface = `Opening **${label}** because this entry explains the connected SJS/TEN spectrum. SJS/TEN overlap means 10% to 30% detached or detachable body surface area, whereas TEN means more than 30%.`;
    }
    return {
      type: "pharm-database",
      query: label,
      detailType: resolved.candidate.type,
      openDetail: true,
      highlightQuery: String(input || ""),
      preface,
      originalQuery: String(input || ""),
      wave35IntentRoute: true,
      wave35RouteId: resolved.routeId
    };
  };

  const reviewedSearchResolutionFor = (input) => {
    if (typeof fastReviewedSearchResolution === "function") {
      return fastReviewedSearchResolution(input);
    }
    return typeof fastReviewedSearchSafetySuggestion === "function"
      ? fastReviewedSearchSafetySuggestion(input)
      : null;
  };

  const reviewedAmbiguityPrompt = (resolution) => {
    const candidates = safeArray(resolution && resolution.ambiguityCandidates);
    return typeof makeOfflineAmbiguityPrompt === "function"
      ? makeOfflineAmbiguityPrompt(candidates)
      : "I found more than one encyclopedia meaning for that wording. Add one specific context word so I do not open the wrong card.";
  };

  if (baseSearchPathologyEntries) {
    searchPathologyEntries = function (query, letter) {
      const resolved = exactResolution(query);
      if (resolved && resolved.target === "ten" && resolved.candidate.type === "pathology") {
        const candidateName = candidateLabel(resolved.candidate);
        if (!letter || letter === "All" || candidateName.toUpperCase().startsWith(String(letter).toUpperCase())) {
          return [resolved.candidate.item];
        }
      }
      const results = safeArray(baseSearchPathologyEntries(query, letter));
      if (!tenCollisionGuard(query)) return results;
      return results.filter((entry) => normalize(entry && (entry.name || entry.displayName)) !== "toxic epidermal necrolysis"
        && normalize(entry && (entry.name || entry.displayName)) !== "toxic epidermal necrolysis ten");
    };
    window.searchPathologyEntries = searchPathologyEntries;
  }

  if (baseOfflineLookupSuggestions) {
    offlineLookupSuggestions = function (input) {
      if (priorActiveEmergency(input)) return baseOfflineLookupSuggestions(input);
      if (tenCollisionResponse(input)) return [];
      if (typeof isDegenerateOfflineLookupInput === "function"
        && isDegenerateOfflineLookupInput(input)) return [];
      const reviewedSearchSafetyOwner = reviewedSearchResolutionFor(input);
      if (reviewedSearchSafetyOwner?.ambiguousIdentity === true) {
        return safeArray(reviewedSearchSafetyOwner.ambiguityCandidates)
          .map((candidate) => ({ ...candidate, ambiguousIdentity: true }));
      }
      const strictCanonicalOwner = typeof strictCanonicalEncyclopediaCandidate === "function"
        ? strictCanonicalEncyclopediaCandidate(input)
        : null;
      if (strictCanonicalOwner) return [{ ...strictCanonicalOwner }];
      if (reviewedSearchSafetyOwner) return [{ ...reviewedSearchSafetyOwner }];
      const componentOwner = typeof fastStandaloneComponentCandidate === "function"
        ? fastStandaloneComponentCandidate(input)
        : null;
      if (componentOwner) return [{ ...componentOwner }];
      const diabetesOwner = fastCanonicalDiabetesOwner(input);
      if (diabetesOwner) return [{ ...diabetesOwner }];
      const canonicalOwner = fastCanonicalBaseOwner(input);
      if (canonicalOwner) return [{ ...canonicalOwner }];
      const resolved = resolve(input);
      if (resolved && resolved.activeCurrent) return [];
      const preservedMedication = resolved ? null : priorSpecificMedicationClue(input);
      if (preservedMedication) {
        const preserved = {
          type: "drug",
          item: preservedMedication,
          score: 8950,
          exactIdentity: false,
          nearIdentity: false,
          preservedSpecificMedicationClue: true
        };
        const base = filteredBaseSuggestions(input, baseOfflineLookupSuggestions(input));
        const preservedKey = `drug:${normalize(candidateLabel(preserved))}`;
        return [preserved, ...base.filter((candidate) => `${candidate.type}:${normalize(candidateLabel(candidate))}` !== preservedKey)].slice(0, 4);
      }
      const base = resolved ? [] : filteredBaseSuggestions(input, baseOfflineLookupSuggestions(input));
      if (!resolved) return base;
      const routed = {
        type: resolved.candidate.type,
        item: resolved.candidate.item,
        score: 9000 + resolved.score,
        exactIdentity: resolved.kind === "exact",
        nearIdentity: false,
        wave35IntentRoute: true,
        wave35RouteId: resolved.routeId,
        wave35MatchKind: resolved.kind,
        wave35CueHits: resolved.cueHits.slice()
      };
      const seen = new Set([`${routed.type}:${normalize(candidateLabel(routed))}`]);
      return [routed, ...base.filter((candidate) => {
        const key = `${candidate.type}:${normalize(candidateLabel(candidate))}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })].slice(0, 4);
    };
    window.offlineLookupSuggestions = offlineLookupSuggestions;
  }

  if (baseHandleOfflineLookupFlow) {
    handleOfflineLookupFlow = function (input, options) {
      const directCollisionResponse = tenCollisionResponse(input);
      if (directCollisionResponse) return directCollisionResponse;
      if (typeof isDegenerateOfflineLookupInput === "function"
        && isDegenerateOfflineLookupInput(input)) return "";
      const reviewedSearchSafetyOwner = reviewedSearchResolutionFor(input);
      if (reviewedSearchSafetyOwner?.ambiguousIdentity === true) {
        pendingOfflineLookupSuggestions = [];
        return reviewedAmbiguityPrompt(reviewedSearchSafetyOwner);
      }
      const strictCanonicalOwner = typeof strictCanonicalEncyclopediaCandidate === "function"
        ? strictCanonicalEncyclopediaCandidate(input)
        : null;
      if (strictCanonicalOwner) {
        pendingOfflineLookupSuggestions = [];
        if (options && options.preferDatabaseRedirect && typeof offlineLookupDatabaseRedirect === "function") {
          return offlineLookupDatabaseRedirect(strictCanonicalOwner, input);
        }
        if (typeof offlineLookupDirectResponse === "function") {
          return offlineLookupDirectResponse(strictCanonicalOwner, input);
        }
      }
      if (reviewedSearchSafetyOwner) {
        pendingOfflineLookupSuggestions = [];
        if (options && options.preferDatabaseRedirect && typeof offlineLookupDatabaseRedirect === "function") {
          return offlineLookupDatabaseRedirect(reviewedSearchSafetyOwner, input);
        }
        if (typeof offlineLookupDirectResponse === "function") {
          return offlineLookupDirectResponse(reviewedSearchSafetyOwner, input);
        }
      }
      if (priorActiveEmergency(input)) return baseHandleOfflineLookupFlow(input, options);
      const componentOwner = typeof fastStandaloneComponentCandidate === "function"
        ? fastStandaloneComponentCandidate(input)
        : null;
      if (componentOwner) {
        if (options && options.preferDatabaseRedirect && typeof offlineLookupDatabaseRedirect === "function") {
          return offlineLookupDatabaseRedirect(componentOwner, input);
        }
        if (typeof offlineLookupDirectResponse === "function") {
          return offlineLookupDirectResponse(componentOwner, input);
        }
      }
      if (fastCanonicalDiabetesOwner(input)) return baseHandleOfflineLookupFlow(input, options);
      const canonicalOwner = fastCanonicalBaseOwner(input);
      if (canonicalOwner) {
        if (options && options.preferDatabaseRedirect && typeof offlineLookupDatabaseRedirect === "function") {
          return offlineLookupDatabaseRedirect(canonicalOwner, input);
        }
        if (typeof offlineLookupDirectResponse === "function") {
          return offlineLookupDirectResponse(canonicalOwner, input);
        }
      }
      const resolved = resolve(input);
      if (resolved && resolved.activeCurrent) return safetyResponse(resolved);
      if (resolved) return redirectFor(resolved, input);
      const base = baseHandleOfflineLookupFlow(input, options);
      const guard = ambiguityResolution(input);
      if (base && typeof base === "object" && guardedLabel(base.query, guard)) return "";
      return base;
    };
    window.handleOfflineLookupFlow = handleOfflineLookupFlow;
  }

  if (baseMakeModelEnhancedResponse) {
    makeModelEnhancedResponse = function (input) {
      const args = Array.prototype.slice.call(arguments, 1);
      if (priorActiveEmergency(input)) return baseMakeModelEnhancedResponse.apply(this, [input, ...args]);
      const directCollisionResponse = tenCollisionResponse(input);
      if (directCollisionResponse) return directCollisionResponse;
      const reviewedSearchSafetyOwner = reviewedSearchResolutionFor(input);
      if (reviewedSearchSafetyOwner?.ambiguousIdentity === true) {
        return reviewedAmbiguityPrompt(reviewedSearchSafetyOwner);
      }
      // Preserve a reviewed focused explanation when the user asks what a
      // value or finding means. Exact-card ownership is correct for bare
      // identity searches (for example, "D-dimer"), but it must not replace
      // the more useful bedside interpretation for "What does a positive
      // D-dimer mean?". Ambiguous identities still fail closed above.
      if (directExplanationIntent(input) && !currentPersonalSymptoms(input)) {
        if (priorDirectEducationalOwner(input)
          && typeof makeOfflineSmartDatabaseAnswer === "function") {
          const reviewedDirectAnswer = makeOfflineSmartDatabaseAnswer(input);
          if (typeof reviewedDirectAnswer === "string" && reviewedDirectAnswer.trim()) {
            return reviewedDirectAnswer;
          }
        }
        if (typeof makeOfflineClinicalReferenceResponse === "function") {
          const reviewedReferenceAnswer = makeOfflineClinicalReferenceResponse(input);
          if (typeof reviewedReferenceAnswer === "string" && reviewedReferenceAnswer.trim()) {
            return reviewedReferenceAnswer;
          }
        }
      }
      const strictCanonicalOwner = typeof strictCanonicalEncyclopediaCandidate === "function"
        ? strictCanonicalEncyclopediaCandidate(input)
        : null;
      if (strictCanonicalOwner && typeof offlineLookupDatabaseRedirect === "function") {
        return offlineLookupDatabaseRedirect(strictCanonicalOwner, input);
      }
      if (reviewedSearchSafetyOwner && typeof offlineLookupDatabaseRedirect === "function") {
        return offlineLookupDatabaseRedirect(reviewedSearchSafetyOwner, input);
      }
      const componentOwner = typeof fastStandaloneComponentCandidate === "function"
        ? fastStandaloneComponentCandidate(input)
        : null;
      if (componentOwner && typeof offlineLookupDatabaseRedirect === "function") {
        return offlineLookupDatabaseRedirect(componentOwner, input);
      }
      const diabetesOwner = fastCanonicalDiabetesOwner(input);
      if (diabetesOwner && typeof offlineLookupDatabaseRedirect === "function") {
        return offlineLookupDatabaseRedirect(diabetesOwner, input);
      }
      const canonicalOwner = fastCanonicalBaseOwner(input);
      if (canonicalOwner && typeof offlineLookupDatabaseRedirect === "function") {
        return offlineLookupDatabaseRedirect(canonicalOwner, input);
      }
      const resolved = resolve(input);
      if (resolved && resolved.activeCurrent) return safetyResponse(resolved);
      if (resolved) return redirectFor(resolved, input);
      const base = baseMakeModelEnhancedResponse.apply(this, [input, ...args]);
      if (base && typeof base.then === "function") {
        return base.then((resolvedBase) => {
          const guard = ambiguityResolution(input);
          if (resolvedBase && typeof resolvedBase === "object" && guardedLabel(resolvedBase.query, guard)) return "";
          return resolvedBase;
        });
      }
      const guard = ambiguityResolution(input);
      if (base && typeof base === "object" && guardedLabel(base.query, guard)) return "";
      return base;
    };
    window.makeModelEnhancedResponse = makeModelEnhancedResponse;
  }

  if (baseExactPharmDetailCandidate) {
    exactPharmDetailCandidate = function (input, preferredType) {
      const args = Array.prototype.slice.call(arguments, 2);
      if (tenCollisionResponse(input)) return null;
      if (typeof isDegenerateOfflineLookupInput === "function"
        && isDegenerateOfflineLookupInput(input)) return null;
      if (preferredType === "procedures") {
        const procedureOwner = baseExactPharmDetailCandidate.apply(this, [input, preferredType, ...args]);
        if (procedureOwner?.type === "reference"
          && typeof isSurgeryProcedureReferenceEntry === "function"
          && isSurgeryProcedureReferenceEntry(procedureOwner.item)) {
          return procedureOwner;
        }
      }
      const reviewedSearchSafetyOwner = reviewedSearchResolutionFor(input);
      const reviewedPreferredType = preferredType === "procedures" ? "reference" : String(preferredType || "");
      if (reviewedSearchSafetyOwner?.ambiguousIdentity === true) {
        const matching = safeArray(reviewedSearchSafetyOwner.ambiguityCandidates)
          .filter((candidate) => reviewedPreferredType && candidate.type === reviewedPreferredType);
        return matching.length === 1
          ? { type: matching[0].type, item: matching[0].item }
          : null;
      }
      // Preserve exact installed-card ownership before nonambiguous alias and
      // intent overlays. Reviewed cross-domain ambiguity remains fail-closed.
      const strictCanonicalOwner = typeof strictCanonicalEncyclopediaCandidate === "function"
        ? strictCanonicalEncyclopediaCandidate(input, preferredType)
        : null;
      if (strictCanonicalOwner) return { type: strictCanonicalOwner.type, item: strictCanonicalOwner.item };
      if (reviewedSearchSafetyOwner
        && (!reviewedPreferredType || reviewedPreferredType === reviewedSearchSafetyOwner.type)) {
        return { type: reviewedSearchSafetyOwner.type, item: reviewedSearchSafetyOwner.item };
      }
      if (priorActiveEmergency(input)) return baseExactPharmDetailCandidate.apply(this, [input, preferredType, ...args]);
      const componentOwner = typeof fastStandaloneComponentCandidate === "function"
        ? fastStandaloneComponentCandidate(input)
        : null;
      const componentPreferredType = preferredType === "procedures" ? "reference" : String(preferredType || "");
      if (componentOwner && (!componentPreferredType || componentPreferredType === componentOwner.type)) {
        return { type: componentOwner.type, item: componentOwner.item };
      }
      const diabetesOwner = fastCanonicalDiabetesOwner(input);
      const diabetesPreferredType = preferredType === "procedures" ? "reference" : String(preferredType || "");
      if (diabetesOwner && (!diabetesPreferredType || diabetesPreferredType === diabetesOwner.type)) {
        return { type: diabetesOwner.type, item: diabetesOwner.item };
      }
      const canonicalOwner = fastCanonicalBaseOwner(input);
      if (canonicalOwner && (!diabetesPreferredType || diabetesPreferredType === canonicalOwner.type)) {
        return { type: canonicalOwner.type, item: canonicalOwner.item };
      }
      const resolved = resolve(input);
      const normalizedPreferred = preferredType === "procedures" ? "reference" : String(preferredType || "");
      if (resolved && !resolved.activeCurrent && (!normalizedPreferred || normalizedPreferred === resolved.candidate.type)) {
        return { type: resolved.candidate.type, item: resolved.candidate.item };
      }
      const base = baseExactPharmDetailCandidate.apply(this, [input, preferredType, ...args]);
      const guard = ambiguityResolution(input);
      if (base && guardedLabel(candidateLabel(base), guard)) return null;
      return base;
    };
    window.exactPharmDetailCandidate = exactPharmDetailCandidate;
  }

  if (baseHighYieldDrugClueMatch) {
    highYieldDrugClueMatch = function (input) {
      if (priorActiveEmergency(input)) return baseHighYieldDrugClueMatch(input);
      const resolved = exactResolution(input);
      if (resolved && resolved.candidate.type === "drug") return resolved.candidate.item;
      const base = baseHighYieldDrugClueMatch(input);
      const guard = ambiguityResolution(input);
      if (base && guardedLabel(candidateLabel({ type: "drug", item: base }), guard)) return null;
      return base;
    };
    window.highYieldDrugClueMatch = highYieldDrugClueMatch;
  }

  const allConfiguredTargetKeys = Array.from(new Set([
    ...EXACT_ROUTES.map((route) => route.target),
    ...SIGNATURES.map((entry) => entry.target),
    ...AMBIGUITY_CASES.map((entry) => entry.target).filter(Boolean)
  ]));
  const targetAvailability = allConfiguredTargetKeys.map((key) => Object.freeze({
    key,
    type: TARGETS[key] && TARGETS[key].type || "",
    configuredNames: TARGETS[key] ? TARGETS[key].names.slice() : [],
    available: Boolean(TARGETS[key] && exactCandidateForTarget(TARGETS[key])),
    resolvedLabel: TARGETS[key] && exactCandidateForTarget(TARGETS[key])
      ? candidateLabel(exactCandidateForTarget(TARGETS[key])) : ""
  }));
  const availableTargetKeys = new Set(targetAvailability.filter((entry) => entry.available).map((entry) => entry.key));
  const routingTargets = Array.from(new Set(targetAvailability.filter((entry) => entry.available)
    .map((entry) => entry.resolvedLabel)));
  const COUNTS = Object.freeze({
    configuredExactRouteCount: EXACT_ROUTES.length,
    configuredExactAliasCount: EXACT_ROUTES.reduce((sum, route) => sum + route.aliases.length, 0),
    availableExactRouteCount: EXACT_ROUTES.filter((route) => availableTargetKeys.has(route.target)).length,
    signatureCount: SIGNATURES.length,
    availableSignatureCount: SIGNATURES.filter((entry) => availableTargetKeys.has(entry.target)).length,
    exactCaseCount: EXACT_CASES.length,
    positiveCaseCount: POSITIVE_CASES.length,
    typoCaseCount: TYPO_CASES.length,
    collisionCaseCount: COLLISION_CASES.length,
    ambiguityCaseCount: AMBIGUITY_CASES.length,
    emergencyCaseCount: EMERGENCY_CASES.length,
    personalSymptomCaseCount: PERSONAL_SYMPTOM_CASES.length,
    educationalCaseCount: EDUCATIONAL_CASES.length,
    configuredTargetCount: allConfiguredTargetKeys.length,
    availableTargetCount: targetAvailability.filter((entry) => entry.available).length
  });

  window.ANI_WAVE35_INTELLIGENT_SEARCH_ROUTING = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    TARGETS,
    EXACT_ROUTES,
    SIGNATURES,
    EXACT_CASES,
    POSITIVE_CASES,
    TYPO_CASES,
    COLLISION_CASES,
    AMBIGUITY_CASES,
    EMERGENCY_CASES,
    PERSONAL_SYMPTOM_CASES,
    EDUCATIONAL_CASES,
    counts: COUNTS,
    routingContract: COUNTS,
    targetAvailability: Object.freeze(targetAvailability),
    routingTargets: Object.freeze(routingTargets),
    normalize,
    compactLookupFrame,
    candidateLabel,
    exactCandidateForTarget,
    exactResolution,
    namedTenResolution,
    tenCollisionGuard,
    tenCollisionResponse,
    uppercaseTenIdentity,
    ambiguityResolution,
    symptomResolution,
    tenSymptomResolution,
    resolve,
    match: resolve,
    routeQuery,
    priorActiveEmergency,
    priorCanonicalTarget,
    priorCanonicalTargetIsSupported,
    priorSpecificMedicationClue,
    directExplanationIntent,
    priorDirectEducationalOwner,
    clearlyEducational,
    currentPersonalSymptoms,
    safetyResponse
  });
}());
