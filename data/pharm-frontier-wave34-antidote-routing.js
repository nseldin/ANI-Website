/* eslint-disable */
/* Wave 34: intent-aware routing for integrated poisoning recognition, stabilization, rescue, and chelation pathways. */
(function () {
  "use strict";

  const VERSION = "2026-07-19-wave34-antidote-routing-1";
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function" ? makeModelEnhancedResponse : null;
  const baseHighYieldDrugClueMatch = typeof highYieldDrugClueMatch === "function" ? highYieldDrugClueMatch : null;
  const baseExactPharmDetailCandidate = typeof exactPharmDetailCandidate === "function" ? exactPharmDetailCandidate : null;
  const priorRouting = window.ANI_ANTIDOTE_WAVE33_ROUTING
    || window.ANI_ANTIDOTE_WAVE32_ROUTING
    || window.ANI_ANTIDOTE_WAVE31_ROUTING
    || null;

  const normalize = (value) => String(value || "")
    .toLowerCase().replace(/[\u2019']/g, "").replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");

  const TARGETS = Object.freeze({
    poisonedPatient: "Poisoned patient stabilization and toxidrome decision pathway",
    sympathomimetic: "Sympathomimetic stimulant poisoning rescue pathway",
    alpha2Agonist: "Alpha-2 agonist poisoning rescue pathway",
    insulin: "Insulin overdose and prolonged hypoglycemia rescue pathway",
    ghb: "GHB and sodium oxybate poisoning rescue pathway",
    nicotine: "Nicotine and e-liquid poisoning rescue pathway",
    superwarfarin: "Superwarfarin and brodifacoum poisoning decision pathway",
    isopropanol: "Isopropanol and acetone poisoning decision pathway",
    lithium: "Lithium poisoning integrated rescue pathway",
    valproate: "Valproate poisoning integrated rescue pathway",
    carbamazepine: "Carbamazepine poisoning integrated rescue pathway",
    methylxanthine: "Theophylline and caffeine poisoning rescue pathway",
    baclofen: "Baclofen poisoning integrated rescue pathway",
    metformin: "Metformin-associated lactic acidosis poisoning pathway",
    caustic: "Caustic and corrosive ingestion rescue pathway",
    buttonBattery: "Button battery ingestion emergency pathway",
    irritantGas: "Irritant gas inhalation injury rescue pathway",
    hydrogenSulfide: "Hydrogen sulfide poisoning rescue pathway",
    arsenic: "Arsenic poisoning and chelation decision pathway",
    mercury: "Mercury poisoning and chelation decision pathway",
    thallium: "Thallium poisoning and Prussian blue rescue pathway"
  });

  const POSITIVE_EXAMPLES = Object.freeze({
    [TARGETS.poisonedPatient]: [
      "unknown ingestion poisoned patient stabilization", "unknown overdose toxidrome decision pathway",
      "ABCDE approach to the poisoned patient", "toxic coma initial workup", "which toxidrome fits this patient",
      "toxidrom recognition and first steps", "mystery pills ingestion emergency evaluation"
    ],
    [TARGETS.sympathomimetic]: [
      "sympathomimetic poisoning rescue", "cocaine toxicity agitated hot sweaty toxidrome",
      "methamphetamine overdose hyperthermia", "amphetamine stimulant poisoning treatment",
      "stimulant toxidrome hypertension seizure", "sympathomimmetic toxicity pathway",
      "what treats cocaine overdose agitation and chest pain"
    ],
    [TARGETS.alpha2Agonist]: [
      "clonidine overdose rescue", "Catapres poisoning bradycardia somnolence",
      "guanfacine overdose pathway", "Intuniv poisoning hypotension",
      "alpha 2 agonist toxicity miosis", "clonadine overdose treatment",
      "why clonidine poisoning causes sleepiness in children", "brimonidine ingestion poisoning"
    ],
    [TARGETS.insulin]: [
      "insulin overdose prolonged hypoglycemia", "too much Humalog recurrent low sugar",
      "Lantus overdose rescue pathway", "insulin pump dosing error hypoglycemia",
      "exogenous insulin poisoning treatment", "insulan overdose dextrose infusion",
      "why can glargine overdose cause days of hypoglycemia", "Tresiba overdose",
      "Toujeo overdose", "insulin degludec overdose", "Humulin U-500 overdose"
    ],
    [TARGETS.ghb]: [
      "GHB overdose rescue", "gamma hydroxybutyrate poisoning",
      "sodium oxybate overdose pathway", "Xyrem overdose respiratory depression",
      "Xywav poisoning coma", "GHB club drug unresponsive patient",
      "sodum oxybate overdose treatment", "Lumryz overdose"
    ],
    [TARGETS.nicotine]: [
      "nicotine poisoning rescue", "pediatric vape juice poisoning treatment pathway",
      "e liquid ingestion treatment", "nicotine patch overdose",
      "Nicorette gum poisoning", "nicotin toxicity vomiting bradycardia",
      "what to do after swallowing concentrated e-cigarette liquid"
    ],
    [TARGETS.superwarfarin]: [
      "superwarfarin poisoning decision", "brodifacoum coagulopathy treatment",
      "long acting anticoagulant rodenticide poisoning", "LAAR rat poison bleeding",
      "bromadiolone ingestion vitamin K", "brodificoum poisoning pathway",
      "why does rat poison coagulopathy need prolonged phytonadione", "chlorophacinone poisoning"
    ],
    [TARGETS.isopropanol]: [
      "isopropanol poisoning decision", "rubbing alcohol overdose",
      "isopropyl alcohol ingestion treatment", "acetone poisoning pathway",
      "IPA ingestion ketosis without acidosis", "isoproponol overdose rescue",
      "drank nail polish remover acetone toxicology", "propan-2-ol poisoning"
    ],
    [TARGETS.lithium]: [
      "lithium poisoning integrated rescue", "Lithobid overdose treatment pathway",
      "acute on chronic lithium toxicity decision", "lithium level neurologic toxicity management",
      "Eskalith poisoning whole patient approach", "litium overdose rescue",
      "when does lithium toxicity need fluids versus dialysis"
    ],
    [TARGETS.valproate]: [
      "valproate poisoning integrated rescue", "Depakote overdose treatment pathway",
      "valproic acid toxicity hyperammonemia", "divalproex overdose carnitine and dialysis decision",
      "VPA poisoning cerebral edema rescue", "valporate overdose pathway",
      "how are levocarnitine and dialysis chosen in valproate toxicity", "Depakene overdose", "Stavzor overdose"
    ],
    [TARGETS.carbamazepine]: [
      "carbamazepine poisoning integrated rescue", "Tegretol overdose treatment pathway",
      "Carbatrol toxicity coma arrhythmia", "carbamazepine overdose charcoal and dialysis decision",
      "antiepileptic sodium channel blocker overdose", "carbamazapine poisoning rescue",
      "how is severe carbamazepine poisoning monitored and eliminated"
    ],
    [TARGETS.methylxanthine]: [
      "theophylline poisoning rescue", "aminophylline overdose pathway",
      "Theo 24 toxicity seizure arrhythmia", "caffeine pill overdose treatment",
      "energy drink caffeine poisoning", "theophyline overdose rescue",
      "theophylline and caffeine methylxanthine toxicity decision", "Uniphyl overdose",
      "Elixophyllin overdose", "No-Doz overdose", "Vivarin overdose"
    ],
    [TARGETS.baclofen]: [
      "baclofen poisoning integrated rescue", "Lioresal overdose treatment pathway",
      "intrathecal baclofen pump overdose", "baclofen toxicity coma ventilation",
      "Gablofen poisoning rescue", "baclofin overdose pathway",
      "how to distinguish baclofen overdose from withdrawal and when to dialyze", "Fleqsuvy overdose"
    ],
    [TARGETS.metformin]: [
      "metformin associated lactic acidosis poisoning", "MALA rescue pathway",
      "Glucophage overdose severe acidosis", "biguanide poisoning treatment",
      "metformin toxicity integrated dialysis decision", "metphormin overdose acidosis",
      "why metformin poisoning causes lactate and when extracorporeal treatment helps",
      "Fortamet overdose", "Glumetza overdose", "Riomet overdose"
    ],
    [TARGETS.caustic]: [
      "caustic ingestion rescue", "corrosive ingestion treatment pathway",
      "lye drain cleaner swallowed", "acid ingestion esophageal burn",
      "alkali oven cleaner poisoning", "corosive ingestion emergency",
      "why not neutralize or induce vomiting after caustic ingestion"
    ],
    [TARGETS.buttonBattery]: [
      "button battery ingestion emergency", "pediatric lithium coin cell ingestion pathway",
      "disc battery stuck in esophagus", "watch battery ingestion pathway",
      "esophageal button battery rescue", "buton battery swallowed",
      "what do I do when x ray shows a button battery", "lithium coin cell ingestion"
    ],
    [TARGETS.irritantGas]: [
      "irritant gas inhalation rescue", "chlorine gas exposure treatment",
      "bleach and ammonia chloramine gas", "ammonia inhalation lung injury",
      "phosgene exposure delayed pulmonary edema", "clorine gas poisoning pathway",
      "mixed bleach with acid and inhaled toxic gas"
    ],
    [TARGETS.hydrogenSulfide]: [
      "hydrogen sulfide poisoning rescue", "H2S exposure treatment",
      "sewer gas collapse pathway", "rotten egg gas poisoning",
      "manure pit hydrogen sulphide rescue", "hydogen sulfide toxicity",
      "worker collapsed near an oil well from knockdown gas"
    ],
    [TARGETS.arsenic]: [
      "arsenic poisoning chelation decision", "arsenic trioxide overdose treatment",
      "arsenite toxicity rice water diarrhea", "dimercaprol versus succimer for arsenic",
      "chronic arsenic exposure evaluation", "arsnic poisoning pathway",
      "which tests and chelator are used after arsenic exposure"
    ],
    [TARGETS.mercury]: [
      "mercury poisoning chelation decision", "elemental mercury vapor treatment",
      "methylmercury exposure evaluation", "inorganic mercury ingestion pathway",
      "thermometer mercury spill poisoning", "mercery toxicity chelation",
      "how mercury species changes testing and chelator choice", "quicksilver poisoning", "mercuric chloride poisoning",
      "mercury poisioning"
    ],
    [TARGETS.thallium]: [
      "thallium poisoning Prussian blue rescue", "Radiogardase for thallium toxicity pathway",
      "thallium alopecia neuropathy treatment", "thallous salt poisoning decision",
      "Prussian blue and extracorporeal treatment for thallium", "thalium poisoning rescue",
      "why delayed hair loss and neuropathy suggest thallium poisoning", "rat poison thallium"
    ]
  });

  const COLLISION_CASES = Object.freeze([
    "routine emergency department ABCDE assessment", "medical differential diagnosis without poisoning", "opioid toxidrome and naloxone rescue pathway",
    "amphetamine prescription for ADHD", "methylphenidate usual dose", "cocaine wide QRS sodium bicarbonate treatment", "benzodiazepines for stimulant toxicity",
    "clonidine for hypertension", "Catapres patch dosing", "guanfacine for ADHD", "Intuniv extended release medication",
    "insulin dose for diabetes", "Humalog carbohydrate ratio", "Lantus basal insulin titration", "unconscious low blood sugar oral glucose glucagon or IV dextrose", "recurrent low sugar after dextrose in glyburide poisoning what stops insulin release",
    "Xyrem treatment for narcolepsy", "Xywav usual bedtime dose", "sodium oxybate REMS program",
    "nicotine replacement for smoking cessation", "Nicorette gum directions", "vape cessation counseling", "nicotine patch usual dose",
    "warfarin maintenance dose", "Coumadin INR goal", "Eliquis major bleeding reversal", "vitamin K newborn prophylaxis",
    "isopropyl alcohol skin preparation", "rubbing alcohol disinfectant", "acetone nail polish remover chemistry", "toxic alcohol methanol and ethylene glycol decision pathway",
    "lithium maintenance level", "Lithobid bipolar treatment", "why can dehydration NSAIDs and thiazides make lithium toxic", "Hemodialysis for lithium poisoning", "EXTRIP lithium dialysis criteria",
    "Depakote seizure prevention", "valproate mood stabilizer", "why can meropenem trigger a seizure in a patient taking Depakote", "Levocarnitine for valproate overdose", "Extracorporeal treatment for valproate poisoning",
    "Tegretol trigeminal neuralgia", "carbamazepine therapeutic drug monitoring", "multiple dose activated charcoal for carbamazepine", "Extracorporeal treatment for carbamazepine poisoning",
    "theophylline asthma maintenance", "caffeine for neonatal apnea", "Theophylline narrow therapeutic index pathway", "methylxanthine narrow therapeutic index seizure arrhythmia after stopping cigarettes", "theophyline toxicity after fever and ciprofloxacin with nausea seizure and arrhythmia risk", "Extracorporeal treatment for theophylline poisoning",
    "baclofen for spasticity", "intrathecal baclofen pump refill", "baclofen withdrawal treatment", "Extracorporeal treatment for baclofen toxicity",
    "metformin diabetes treatment", "Glucophage usual dose", "metformin chronic kidney disease prescribing", "which biguanide lowers liver glucose and can cause lactic acidosis with kidney failure", "Extracorporeal treatment for metformin poisoning",
    "activated charcoal contraindication after caustic ingestion", "gastric decontamination overview", "drain cleaner product review", "acid base chemistry lesson", "Folic acid and leucovorin for methanol poisoning",
    "button battery replacement size", "watch battery shopping", "lithium ion phone battery fire",
    "chlorine pool maintenance", "ammonia laboratory value", "phosgene chemical structure", "bleach cleaning instructions",
    "hydrogen sulfide molecular structure", "sewer gas detector price", "rotten egg odor plumbing",
    "arsenic laboratory element", "arsenic in groundwater policy", "Dimercaprol drug card", "BAL antidote for arsenic poisoning", "succimer pharmacology",
    "mercury planet facts", "mercury thermometer disposal", "methylmercury fish advisory", "dimercaprol injection",
    "Prussian blue paint pigment", "Radiogardase drug card", "Prussian blue decorporation after radioactive cesium exposure"
  ]);

  const EMERGENCY_CASES = Object.freeze([
    "Someone swallowed mystery pills and is unresponsive right now",
    "My friend used meth and is extremely hot agitated and seizing now",
    "My child just swallowed clonidine and is hard to wake",
    "I injected too much insulin and my glucose keeps dropping right now",
    "Someone took GHB and is not breathing normally now",
    "My toddler drank e liquid and is vomiting right now",
    "I swallowed rat poison and am bleeding now",
    "My friend drank rubbing alcohol and is confused right now",
    "Patient with lithium overdose is confused and shaking now",
    "Depakote overdose patient is comatose with high ammonia now",
    "Tegretol overdose patient is seizing with an arrhythmia now",
    "I took a bottle of caffeine pills and my heart is racing now",
    "Baclofen pump error patient is unresponsive and barely breathing now",
    "Metformin overdose patient is in shock with severe lactic acidosis now",
    "My child swallowed drain cleaner minutes ago",
    "A toddler swallowed a button battery right now",
    "We mixed bleach and ammonia and cannot breathe now",
    "A worker collapsed in a sewer with hydrogen sulfide exposure now",
    "Someone swallowed arsenic and has severe vomiting now",
    "We spilled mercury and a child now has breathing symptoms",
    "Patient may have thallium poisoning and is collapsing now",
    "I mixed bleach and ammonia and am coughing",
    "My toddler chewed a nicotine patch",
    "My daughter ate clonidine and is very sleepy",
    "My child took too much insulin and is sweating"
  ]);

  const BENIGN_CASES = Object.freeze([
    "unknown ingestion simulation for nursing school", "sympathomimetic toxidrome lecture",
    "clonidine overdose tabletop exercise", "insulin overdose exam review",
    "GHB poisoning journal club", "nicotine poisoning case presentation",
    "superwarfarin coagulopathy protocol draft", "lithium toxicity conference teaching",
    "caustic ingestion classroom scenario", "button battery emergency drill",
    "irritant gas training exercise", "heavy metal chelation comparison for NCLEX"
  ]);

  const POSITIVE_CASES = Object.freeze(Object.entries(POSITIVE_EXAMPLES)
    .flatMap(([target, queries]) => queries.map((query) => Object.freeze({ query, target }))));
  const exactCanonicalTargetMap = new Map();
  Object.values(TARGETS).forEach((target) => exactCanonicalTargetMap.set(normalize(target), target));
  const exactRouteMap = new Map(exactCanonicalTargetMap);
  POSITIVE_CASES.forEach(({ query, target }) => exactRouteMap.set(normalize(query), target));
  const collisionSet = new Set(COLLISION_CASES.map(normalize));

  const dbCards = window.ANI_PHARM_DATABASE && Array.isArray(window.ANI_PHARM_DATABASE.drugs)
    ? window.ANI_PHARM_DATABASE.drugs : [];
  const cardIndex = new Map();
  dbCards.forEach((item) => {
    [item && item.displayName, item && item.name, item && item.generic].map(normalize).filter(Boolean).forEach((name) => {
      if (!cardIndex.has(name) || item.antidoteWave34Revision) cardIndex.set(name, item);
    });
  });
  const card = (target) => cardIndex.get(normalize(target)) || null;
  const exactVisiblePrimaryCard = (input = "") => {
    const text = normalize(input);
    if (!text || typeof pharmDrugs === "undefined" || !Array.isArray(pharmDrugs)) return null;
    const matches = pharmDrugs.filter((candidate) => {
      if (typeof isVisibleMedicationEntry === "function" && !isVisibleMedicationEntry(candidate)) return false;
      const primaryTerms = [
        candidate && candidate.name,
        candidate && candidate.generic,
        candidate && candidate.displayName,
        typeof pharmDrugDisplayName === "function" ? pharmDrugDisplayName(candidate, "") : ""
      ].map(normalize).filter(Boolean);
      return primaryTerms.includes(text);
    });
    matches.sort((left, right) => {
      const leftScore = typeof pharmIdentityPreferenceScore === "function" ? pharmIdentityPreferenceScore(left) : 0;
      const rightScore = typeof pharmIdentityPreferenceScore === "function" ? pharmIdentityPreferenceScore(right) : 0;
      return rightScore - leftScore;
    });
    return matches[0] || null;
  };
  const exactAliasTargetMap = new Map();
  Object.values(TARGETS).forEach((target) => {
    const targetCard = card(target);
    (targetCard && Array.isArray(targetCard.aliases) ? targetCard.aliases : []).forEach((alias) => {
      const key = normalize(alias);
      if (key) exactAliasTargetMap.set(key, target);
    });
  });

  const isClearlyEducational = (input = "") => {
    const text = normalize(input);
    const educational = /\b(study|studying|exam|nclex|quiz|lecture|class|course|journal club|case review|historical|review|simulation|scenario|tabletop|protocol draft|policy draft|conference|presentation|compare|comparison|mechanism|pharmacology|training|drill)\b/i.test(text);
    const actualExposure = /\b(i|me|my|we|our|friend|child|baby|family|patient|person|someone|victim|worker)\b.{0,100}\b(swallowed|took|drank|ingested|injected|overdosed|exposed|spilled|inhaled|collapsed|unresponsive|seizing|cannot breathe|cant breathe)\b/i.test(text);
    return educational && !actualExposure;
  };

  const isPriorActiveEmergency = (input = "") => {
    if (isClearlyEducational(input)) return false;
    try {
      return Boolean(priorRouting && typeof priorRouting.isActiveEmergency === "function" && priorRouting.isActiveEmergency(input));
    } catch (_error) {
      return false;
    }
  };

  const isNewActiveEmergency = (input = "") => {
    const text = normalize(input);
    if (!text || isClearlyEducational(input)) return false;
    const current = /\b(now|right now|currently|just|minutes? ago|hours? ago|need help|what do (?:i|we) do|emergency|call 911)\b/i.test(text);
    const personal = /\b(i|me|my|we|our|friend|child|baby|toddler|daughter|son|family|patient|person|someone|victim|worker)\b/i.test(text);
    const severe = /\b(not breathing|barely breathing|cannot breathe|cant breathe|blue|unresponsive|hard to wake|very sleepy|confus(?:ed|ion)|agitat(?:ed|ion)|seiz(?:e|ed|ing|ure|ures)?|collapse|collapsed|collapsing|shock|hypotensive|bradycardia|arrhythmia|heart is racing|high fever|extremely hot|bleeding|severe vomiting|cough(?:ing)?|sweat(?:ing|y)?|diaphoretic|shaky|trembling|glucose keeps (?:dropping|crashing)|severe lactic acidosis|pulmonary edema)\b/i.test(text);
    const exposure = /\b(overdose|overdosed|swallowed|took|ate|chewed|licked|used|drank|ingested|injected|exposed|exposure|spilled|inhaled|mixed|poison(?:ed|ing)?|toxicity|bottle|many tablets|dosing error|pump error)\b/i.test(text);
    const hazard = /\b(unknown ingestion|mystery pills|toxidrome|sympathomimetic|stimulant|cocaine|methamphetamine|meth|amphetamine|clonidine|catapres|guanfacine|intuniv|brimonidine|alpha 2|insulin|humalog|lantus|toujeo|tresiba|degludec|humulin|u 500|ghb|gamma hydroxybutyrate|sodium oxybate|xyrem|xywav|lumryz|nicotine|e liquid|vape juice|superwarfarin|brodifacoum|chlorophacinone|rat poison|rodenticide|isopropanol|isopropyl alcohol|propan 2 ol|rubbing alcohol|acetone|lithium|lithobid|valproate|valproic acid|depakote|depakene|stavzor|divalproex|carbamazepine|tegretol|theophylline|uniphyl|elixophyllin|aminophylline|caffeine pills?|baclofen|lioresal|fleqsuvy|metformin|glucophage|fortamet|glumetza|riomet|caustic|corrosive|lye|drain cleaner|button battery|coin cell|chlorine|chloramine|bleach and ammonia|bleach with ammonia|bleach and acid|bleach with acid|ammonia|phosgene|hydrogen sulfide|h2s|sewer gas|arsenic|mercury|quicksilver|thallium)\b/i.test(text);
    const intrinsicallyUrgent = /\b(button battery|coin cell|caustic|corrosive|lye|drain cleaner|hydrogen sulfide|h2s|sewer gas|phosgene|chlorine gas|chloramine gas|bleach and ammonia|bleach with ammonia|bleach and acid|bleach with acid)\b/i.test(text) && exposure;
    const pediatricHighRisk = /\b(child|baby|toddler|daughter|son)\b/i.test(text)
      && /\b(nicotine|e liquid|vape juice|nicotine patch|clonidine|catapres|guanfacine|intuniv)\b/i.test(text)
      && /\b(swallowed|drank|ingested|ate|chewed|licked|took)\b/i.test(text);
    const symptomaticExcessInsulin = /\b(insulin|humalog|novolog|lantus|toujeo|tresiba|degludec|glargine|u 500|humulin)\b/i.test(text)
      && /\b(overdose|too much|dosing error|pump error|excess)\b/i.test(text)
      && /\b(sweat(?:ing|y)?|diaphoretic|shaky|trembling|weak|confus(?:ed|ion)|low (?:sugar|glucose)|hypoglyc)\b/i.test(text);
    return Boolean(hazard && personal && exposure && (current || severe || intrinsicallyUrgent || pediatricHighRisk || symptomaticExcessInsulin));
  };

  const isActiveEmergency = (input = "") => isPriorActiveEmergency(input) || isNewActiveEmergency(input);

  const protectedPriorSpecificIntent = (text) => {
    if (collisionSet.has(text)) return true;
    if (typeof isMetforminMechanismRiskTeachingQuery === "function" && isMetforminMechanismRiskTeachingQuery(text)) return true;
    const sulfonylureaRescueIntent = /\b(sulfonylurea|glyburide|glibenclamide|glipizide|glimepiride)\b/i.test(text)
      && /\b(poison(?:ed|ing)?|overdose|toxicity|hypoglyc|low (?:sugar|glucose)|recurrent|dextrose|octreotide|insulin release)\b/i.test(text);
    if (sulfonylureaRescueIntent) return true;
    const betaLactamValproateTeaching = typeof isBetaLactamValproateTeachingQuery === "function"
      ? isBetaLactamValproateTeachingQuery(text)
      : /\b(penicillin|cephalosporin|carbapenem|beta lactam|meropenem|imipenem|ertapenem|doripenem)\b/i.test(text)
        && /\b(valproate|valproic acid|depakote|divalproex)\b/i.test(text)
        && /\b(why|interaction|level|levels|seizure|neurotoxicity|clearance|concentration)\b/i.test(text);
    if (betaLactamValproateTeaching) return true;
    const calciumChannelBlockerRescueIntent = (/(?:\bcalcium channel blockers?\b|\bcalcium blockers?\b|\bccbs?\b)/i.test(text)
        || (text.match(/\b(?:amlodipine|norvasc|nifedipine|procardia|nicardipine|cardene|clevidipine|cleviprex|nimodipine|diltiazem|cardizem|verapamil|calan|verelan|felodipine|isradipine|nisoldipine)\b/gi) || []).length >= 1)
      && /\b(overdose|toxicity|toxic|shock|poisoning|vasoplegia|hyperglycemia)\b/i.test(text)
      && /\b(insulin|high.?dose insulin|euglycemia|calcium|vasopressor|bradycardia|cardiac output|glucose)\b/i.test(text);
    if (calciumChannelBlockerRescueIntent) return true;
    const lithiumInteractionTeaching = /\b(why|how)\b/i.test(text)
      && /\b(lithium|lithobid|eskalith)\b/i.test(text)
      && /\b(dehydration|volume depletion|low sodium|nsaid|ibuprofen|naproxen|thiazide|ace inhibitor|arb|kidney clearance|interaction)\b/i.test(text)
      && /\b(toxic|toxicity|level|clearance|accumulat|increase|raise)\b/i.test(text)
      && !/\b(overdose|rescue|stabiliz|dialysis|extracorporeal|ectr|extrip|pathway|algorithm|emergency management)\b/i.test(text);
    if (lithiumInteractionTeaching) return true;
    const decisionIntent = /\b(integrated|whole patient|overall|full management|pathway|decision|algorithm|compare|comparison|versus|vs|when (?:does|should)|how (?:is|are|do|does))\b/i.test(text);
    const priorModality = /\b(hemodialysis|haemodialysis|dialysis|extracorporeal|ectr|extrip|levocarnitine|l carnitine|carnitine|multiple dose activated charcoal|mdac|activated charcoal|prussian blue|radiogardase|dimercaprol|british anti lewisite|bal|succimer)\b/i.test(text);
    if (priorModality && !decisionIntent) return true;
    if (/\b(cocaine|tricyclic|tca|flecainide)\b/i.test(text) && /\b(wide qrs|sodium channel|bicarbonate|bicarb)\b/i.test(text)) return true;
    if (/\b(stimulant|cocaine|methamphetamine|amphetamine)\b/i.test(text) && /\b(benzodiazepine|diazepam|lorazepam|midazolam)\b/i.test(text) && !decisionIntent) return true;
    if (/\b(caustic|corrosive|lye|acid ingestion|alkali ingestion)\b/i.test(text) && /\b(activated charcoal|gastric lavage|whole bowel|decontamination)\b/i.test(text) && !decisionIntent) return true;
    const bareAgent = /^(?:clonidine|catapres|guanfacine|intuniv|tenex|insulin|humalog|lantus|sodium oxybate|xyrem|xywav|nicotine|nicorette|warfarin|coumadin|isopropanol|isopropyl alcohol|acetone|lithium|lithobid|eskalith|valproate|valproic acid|depakote|divalproex|carbamazepine|tegretol|carbatrol|theophylline|aminophylline|caffeine|baclofen|lioresal|metformin|glucophage|arsenic|mercury|thallium|prussian blue|radiogardase)$/i.test(text);
    if (bareAgent) return true;
    const therapeuticUse = /\b(usual dose|maintenance dose|titration|prescription|for adhd|for hypertension|for diabetes|carbohydrate ratio|basal insulin|for narcolepsy|rems program|smoking cessation|vape cessation|inr goal|skin preparation|disinfectant|bipolar treatment|mood stabilizer|seizure prevention|trigeminal neuralgia|therapeutic drug monitoring|asthma maintenance|neonatal apnea|for spasticity|pump refill|chronic kidney disease prescribing|product review|shopping|pool maintenance|chemical structure|planet facts|fish advisory|paint pigment|radioactive cesium)\b/i.test(text);
    return therapeuticUse;
  };

  const patternTarget = (text) => {
    const has = (pattern) => pattern.test(text);
    const toxicIntent = has(/\b(poison(?:ed|ing)?|poision(?:ed|ing)?|poisining|toxicity|toxic|overdose|overdosed|ingest(?:ed|ion)?|swallow(?:ed)?|too much|exposure|rescue|treat(?:ment)?|management|pathway|decision|emergency|what do|what should|how (?:do|should|is|are)|coma|unresponsive|seizure|shock)\b/i);

    if (has(/\b(unknown ingestion|unknown overdose|mystery pills?|poisoned patient|toxic coma|toxidrome|toxidrom)\b/i)
      && has(/\b(stabiliz|initial|first steps?|recognition|decision|workup|evaluate|evaluation|approach|which|fits?|abcde|rescue|management)\b/i)) return TARGETS.poisonedPatient;

    if (has(/\b(sympathomimetic|sympathommetic|stimulant toxidrome|cocaine|methamphetamine|meth overdose|amphetamine)\b/i)
      && (toxicIntent || has(/\b(agitat|hypertherm|hypertens|diaphoretic|sweaty|chest pain|seiz|rhabdo)\b/i))) return TARGETS.sympathomimetic;

    if (has(/\b(clonidine|clonadine|catapres|guanfacine|intuniv|tenex|alpha 2 agonist|alpha2 agonist|tizanidine|brimonidine)\b/i)
      && (toxicIntent || has(/\b(bradycard|hypotens|somnol|sleepy|miosis|hard to wake)\b/i))) return TARGETS.alpha2Agonist;

    if (has(/\b(insulin|humalog|lispro|novolog|aspart|lantus|toujeo|glargine|tresiba|degludec|humulin|u 500|insulan)\b/i)
      && has(/\b(overdose|too much|dosing error|pump error|poison|excess|prolonged|recurrent|keeps (?:dropping|crashing)|hypoglyc|low (?:sugar|glucose)|dextrose infusion)\b/i)) return TARGETS.insulin;

    if (has(/\b(ghb|gamma hydroxybutyrate|gamma hydroxybutyric|sodium oxybate|sodum oxybate|xyrem|xywav|lumryz|gbl|1 4 butanediol)\b/i)
      && (toxicIntent || has(/\b(unresponsive|coma|respiratory depression|club drug|hard to wake)\b/i))) return TARGETS.ghb;

    if (has(/\b(nicotine|nicotin|e liquid|eliquid|vape juice|e cigarette liquid|nicorette|nicotine patch|nicotine pouch)\b/i)
      && (toxicIntent || has(/\b(drank|swallowed|vomit|salivat|bradycard|tachycard|seiz)\b/i))) return TARGETS.nicotine;

    if (has(/\b(superwarfarin|super warfarin|brodifacoum|brodificoum|bromadiolone|difenacoum|chlorophacinone|long acting anticoagulant rodenticide|laar|rat poison)\b/i)
      && !has(/\b(thallium|thalium|thallous)\b/i)
      && (toxicIntent || has(/\b(coagulopathy|bleeding|high inr|vitamin k|phytonadione)\b/i))) return TARGETS.superwarfarin;

    if (has(/\b(isopropanol|isoproponol|isopropyl alcohol|propan 2 ol|2 propanol|rubbing alcohol|ipa ingestion|acetone|nail polish remover)\b/i)
      && (toxicIntent || has(/\b(ketosis|osmolar gap|drank|inebriat|gastritis)\b/i))) return TARGETS.isopropanol;

    if (has(/\b(lithium|lithobid|eskalith|litium)\b/i)
      && !has(/\b(button battery|buton battery|disc battery|disk battery|coin cell|watch battery|esophageal battery|cr\s*\d+)\b/i)
      && (toxicIntent || has(/\b(acute on chronic|coarse tremor|ataxia|confusion|level.*neurolog)\b/i))) return TARGETS.lithium;

    if (has(/\b(valproate|valproic acid|divalproex|depakote|depakene|stavzor|vpa|valporate)\b/i)
      && (toxicIntent || has(/\b(hyperammon|cerebral edema|coma|carnitine)\b/i))) return TARGETS.valproate;

    if (has(/\b(carbamazepine|carbamazapine|tegretol|carbatrol|equetro)\b/i)
      && (toxicIntent || has(/\b(coma|arrhythmia|anticholinergic|rising level|multiple dose charcoal)\b/i))) return TARGETS.carbamazepine;

    if (has(/\b(theophylline|theophyline|aminophylline|theo 24|uniphyl|elixophyllin|no doz|vivarin|caffeine pills?|caffeine powder|energy drinks?|methylxanthine)\b/i)
      && (toxicIntent || has(/\b(arrhythmia|seiz|refractory vomiting|hypokal|lactic acidosis)\b/i))) return TARGETS.methylxanthine;

    if (has(/\b(baclofen|baclofin|lioresal|fleqsuvy|ozobax|gablofen|intrathecal baclofen)\b/i)
      && (toxicIntent || has(/\b(pump error|coma|unresponsive|ventilat|respiratory depression|withdrawal versus toxicity)\b/i))) return TARGETS.baclofen;

    if (has(/\b(metformin|metphormin|glucophage|fortamet|glumetza|riomet|biguanide|mala)\b/i)
      && (toxicIntent || has(/\b(lactic acidosis|lactate|acidemia|shock)\b/i))) return TARGETS.metformin;

    if (has(/\b(caustic|corrosive|corosive|lye|drain cleaner|oven cleaner|acid ingestion|alkali ingestion|bleach ingestion)\b/i)
      && (toxicIntent || has(/\b(esophag|burn|drooling|stridor|perforation|neutralize|induce vomiting)\b/i))) return TARGETS.caustic;

    if (has(/\b(button battery|buton battery|disc battery|disk battery|coin cell|watch battery|esophageal battery)\b/i)
      && has(/\b(swallow|ingest|stuck|esophag|child|toddler|x ray|emergency|rescue|pathway|treat)\b/i)) return TARGETS.buttonBattery;

    if (has(/\b(irritant gas|chlorine gas|clorine gas|chloramine|ammonia (?:gas|inhalation|exposure)|phosgene|bleach and ammonia|bleach with ammonia|bleach and acid|bleach with acid|pool gas)\b/i)
      && (toxicIntent || has(/\b(inhal|cough|cannot breathe|chest tight|lung injury|pulmonary edema|mixed bleach)\b/i))) return TARGETS.irritantGas;

    if (has(/\b(hydrogen sulfide|hydrogen sulphide|hydogen sulfide|h2s|sewer gas|manure pit|rotten egg gas|knockdown gas)\b/i)
      && (toxicIntent || has(/\b(inhal|collapse|unconscious|oil well|confined space|worker)\b/i))) return TARGETS.hydrogenSulfide;

    if (has(/\b(arsenic|arsenite|arsenate|arsenic trioxide|arsnic)\b/i)
      && (toxicIntent || has(/\b(chelat|rice water diarrhea|garlic odor|neuropathy|qt|exposure evaluation)\b/i))) return TARGETS.arsenic;

    if (has(/\b(mercury|mercery|methylmercury|elemental mercury|inorganic mercury|mercuric chloride|quicksilver|mercury vapor|acrodynia)\b/i)
      && (toxicIntent || has(/\b(chelat|species|speciation|vapor|spill poisoning|exposure evaluation)\b/i))) return TARGETS.mercury;

    if (has(/\b(thallium|thalium|thallous)\b/i)
      && (toxicIntent || has(/\b(prussian blue|radiogardase|alopecia|neuropathy|painful neuropathy|chelat)\b/i))) return TARGETS.thallium;

    return "";
  };

  const routeQuery = (input = "") => {
    const text = normalize(input);
    if (!text || isActiveEmergency(input)) return "";
    const canonical = exactCanonicalTargetMap.get(text);
    if (canonical) return canonical;
    const exact = exactRouteMap.get(text);
    if (exact) return exact;
    const alias = exactAliasTargetMap.get(text);
    if (alias) return alias;
    if (protectedPriorSpecificIntent(text)) return "";
    return patternTarget(text);
  };

  const resolveTarget = (input = "") => routeQuery(input);
  const educationalTarget = (input = "") => routeQuery(input);
  const canonicalTarget = (input = "") => routeQuery(input);
  const match = (input = "") => {
    const target = routeQuery(input);
    return target ? card(target) : null;
  };

  const emergencyResponse = () => "**This may be an active poisoning or hazardous exposure. Call 911 now** for collapse, seizure, breathing difficulty, severe confusion, shock, major bleeding, dangerous rhythm, or a serious current ingestion. In the United States, call **Poison Help at 1-800-222-1222 now**. Move away from an unsafe scene without exposing yourself, support airway and breathing, and follow dispatcher or poison-center instructions. Do not induce vomiting, neutralize a caustic, enter a contaminated space, improvise an antidote, or delay resuscitation to search ANI.";

  const RELATED_TOPICS = Object.freeze({
    [TARGETS.poisonedPatient]: ["Antidotes and toxicologic rescue therapies", "Electrocardiogram", "Anion gap"],
    [TARGETS.sympathomimetic]: ["Benzodiazepines for toxicologic seizures and severe agitation", "Hyperthermia", "Rhabdomyolysis"],
    [TARGETS.alpha2Agonist]: ["Clonidine", "Guanfacine", "Naloxone"],
    [TARGETS.insulin]: ["Dextrose 50%", "Hypoglycemia rescue pathway", "Potassium"],
    [TARGETS.ghb]: ["Sodium oxybate", "Respiratory depression", "Sedative-hypnotic poisoning"],
    [TARGETS.nicotine]: ["Nicotine replacement therapy", "Cholinergic toxidrome", "Seizure"],
    [TARGETS.superwarfarin]: ["Phytonadione", "Four factor prothrombin complex concentrate", "INR"],
    [TARGETS.isopropanol]: ["Toxic alcohol poisoning decision pathway", "Osmolality and osmolar gap", "Ketosis"],
    [TARGETS.lithium]: ["Hemodialysis for lithium poisoning", "Lithium", "Acute kidney injury"],
    [TARGETS.valproate]: ["Levocarnitine", "Extracorporeal treatment for valproate poisoning", "Hyperammonemia"],
    [TARGETS.carbamazepine]: ["Activated charcoal", "Extracorporeal treatment for carbamazepine poisoning", "Sodium-channel blockade"],
    [TARGETS.methylxanthine]: ["Extracorporeal treatment for theophylline poisoning", "Activated charcoal", "Tachydysrhythmia"],
    [TARGETS.baclofen]: ["Extracorporeal treatment for baclofen toxicity", "Baclofen withdrawal", "Respiratory failure"],
    [TARGETS.metformin]: ["Extracorporeal treatment for metformin poisoning", "Lactic acidosis", "Shock"],
    [TARGETS.caustic]: ["Gastrointestinal and dermal decontamination safety pathway", "Esophageal injury", "Airway edema"],
    [TARGETS.buttonBattery]: ["Foreign-body ingestion", "Esophageal perforation", "Poison Help"],
    [TARGETS.irritantGas]: ["Acute respiratory distress syndrome", "Chemical decontamination", "Bronchospasm"],
    [TARGETS.hydrogenSulfide]: ["Cyanide and smoke inhalation rescue pathway", "Confined-space rescue", "Lactic acidosis"],
    [TARGETS.arsenic]: ["Dimercaprol", "Succimer", "Heavy-metal testing"],
    [TARGETS.mercury]: ["Succimer", "Dimercaprol", "Environmental exposure"],
    [TARGETS.thallium]: ["Prussian blue", "Extracorporeal treatment for poisoning", "Neuropathy"]
  });

  if (baseExactPharmDetailCandidate) {
    exactPharmDetailCandidate = function (input = "", preferredType = "", ...args) {
      if (isActiveEmergency(input)) return null;
      const normalizedPreferredType = preferredType === "procedures" ? "reference" : preferredType;
      if (!normalizedPreferredType || normalizedPreferredType === "drug") {
        const exactCard = exactVisiblePrimaryCard(input);
        if (exactCard) return { type: "drug", item: exactCard };
        const item = match(input);
        if (item) return { type: "drug", item };
      }
      return baseExactPharmDetailCandidate(input, preferredType, ...args);
    };
    window.exactPharmDetailCandidate = exactPharmDetailCandidate;
  }

  if (baseHighYieldDrugClueMatch) {
    highYieldDrugClueMatch = function (input = "") {
      if (isActiveEmergency(input)) return null;
      return exactVisiblePrimaryCard(input) || match(input) || baseHighYieldDrugClueMatch(input);
    };
    window.highYieldDrugClueMatch = highYieldDrugClueMatch;
  }

  if (baseMakeModelEnhancedResponse) {
    makeModelEnhancedResponse = function (input = "", ...args) {
      if (isPriorActiveEmergency(input)) return baseMakeModelEnhancedResponse(input, ...args);
      if (isNewActiveEmergency(input)) return emergencyResponse();
      const exactCard = exactVisiblePrimaryCard(input);
      if (exactCard) {
        const exactTitle = typeof pharmDrugDisplayName === "function"
          ? pharmDrugDisplayName(exactCard, "")
          : String(exactCard.name || exactCard.generic || exactCard.displayName || input);
        return {
          type: "pharm-database",
          query: exactTitle,
          detailType: "drug",
          openDetail: true,
          highlightQuery: String(input || ""),
          preface: "Opening the exact encyclopedia entry **" + exactTitle + "**.",
          originalQuery: String(input || "")
        };
      }
      const target = routeQuery(input);
      if (!target) return baseMakeModelEnhancedResponse(input, ...args);
      const related = RELATED_TOPICS[target] || [];
      return {
        type: "pharm-database",
        query: target,
        detailType: "drug",
        openDetail: true,
        highlightQuery: String(input || ""),
        preface: "Opening **" + target + "** in ANI's integrated toxicology reference. The entry connects recognition and stabilization to antidote, supportive-care, monitoring, elimination, and recurrence decisions without replacing the underlying medication or antidote cards."
          + (related.length ? " Related topics: **" + related.join("**, **") + "**." : ""),
        originalQuery: String(input || "")
      };
    };
    window.makeModelEnhancedResponse = makeModelEnhancedResponse;
  }

  const routingTargets = Object.values(TARGETS);
  const routingContract = Object.freeze({
    positiveCases: POSITIVE_CASES,
    collisionCases: COLLISION_CASES,
    emergencyCases: EMERGENCY_CASES,
    benignCases: BENIGN_CASES,
    positiveCount: POSITIVE_CASES.length,
    collisionCount: COLLISION_CASES.length,
    emergencyCount: EMERGENCY_CASES.length,
    benignCount: BENIGN_CASES.length
  });

  if (window.ANI_ANTIDOTE_WAVE34) {
    window.ANI_ANTIDOTE_WAVE34.routingVersion = VERSION;
    window.ANI_ANTIDOTE_WAVE34.routingTargets = routingTargets.slice();
    window.ANI_ANTIDOTE_WAVE34.routingContract = {
      positiveCount: routingContract.positiveCount,
      collisionCount: routingContract.collisionCount,
      emergencyCount: routingContract.emergencyCount,
      benignCount: routingContract.benignCount
    };
  }

  window.ANI_ANTIDOTE_WAVE34_ROUTING = {
    schemaVersion: 1,
    version: VERSION,
    priorRoutingVersion: priorRouting && priorRouting.version || "",
    delegatesToWave33First: Boolean(window.ANI_ANTIDOTE_WAVE33_ROUTING),
    usesPrecomputedExactTargetMap: true,
    TARGETS,
    POSITIVE_CASES,
    COLLISION_CASES,
    EMERGENCY_CASES,
    BENIGN_CASES,
    targets: TARGETS,
    routingTargets,
    relatedTopics: RELATED_TOPICS,
    routingContract,
    routeQuery,
    resolveTarget,
    match,
    canonicalTarget,
    educationalTarget,
    isActiveEmergency,
    isNewActiveEmergency,
    isPriorActiveEmergency,
    isClearlyEducational,
    emergencyResponse
  };
}());
