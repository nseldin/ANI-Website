/* eslint-disable */
/* Wave 30: intelligent routing for rescue, countermeasure, and antidote-adjunct content. */
(function () {
  "use strict";

  const VERSION = "2026-07-18-antidote-routing-v1";
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function" ? makeModelEnhancedResponse : null;
  const baseHighYieldDrugClueMatch = typeof highYieldDrugClueMatch === "function" ? highYieldDrugClueMatch : null;
  const baseExactPharmDetailCandidate = typeof exactPharmDetailCandidate === "function" ? exactPharmDetailCandidate : null;
  const priorRouting = window.ANI_ANTIDOTE_WAVE29_ROUTING || window.ANI_ANTIDOTE_WAVE28_ROUTING || window.ANI_ANTIDOTE_WAVE26_ROUTING || null;
  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const TARGETS = Object.freeze({
    mesna: "Mesna",
    amifostine: "Amifostine",
    pedmark: "PEDMARK sodium thiosulfate otoprotection",
    thiosulfateExtravasation: "Sodium thiosulfate for antineoplastic extravasation",
    dmsoExtravasation: "Topical dimethyl sulfoxide for antineoplastic extravasation",
    amatoxinRescue: "Amatoxin mushroom-poisoning rescue",
    ivSilibinin: "Intravenous silibinin for amatoxin poisoning",
    ethyleneGlycolCofactors: "Adjunctive thiamine and pyridoxine for ethylene-glycol poisoning",
    thrombolyticHemorrhage: "Thrombolytic-associated major-hemorrhage rescue",
    cryoprecipitate: "Cryoprecipitated antihemophilic factor",
    vigiv: "Vaccinia immune globulin intravenous",
    rabiesPep: "Rabies postexposure prophylaxis with HRIG and vaccine",
    harsMap: "Hematopoietic acute radiation syndrome countermeasures",
    filgrastim: "Filgrastim",
    pegfilgrastim: "Pegfilgrastim",
    sargramostim: "Sargramostim",
    romiplostim: "Romiplostim",
    ammonul: "Sodium phenylacetate and sodium benzoate",
    carglumic: "Carglumic acid",
    benzodiazepineRescue: "Benzodiazepines for toxicologic seizures and severe agitation"
  });

  const RELATED_TOPICS = Object.freeze({
    [TARGETS.mesna]: ["Ifosfamide", "Hemorrhagic cystitis", TARGETS.amifostine],
    [TARGETS.amifostine]: ["Cisplatin", "Radiation-associated xerostomia", TARGETS.pedmark],
    [TARGETS.pedmark]: ["Cisplatin", "Audiometry", TARGETS.amifostine],
    [TARGETS.thiosulfateExtravasation]: [TARGETS.dmsoExtravasation, "Dexrazoxane", "Hyaluronidase"],
    [TARGETS.dmsoExtravasation]: [TARGETS.thiosulfateExtravasation, "Dexrazoxane", "Hyaluronidase"],
    [TARGETS.amatoxinRescue]: [TARGETS.ivSilibinin, "Acetylcysteine", "Acute liver failure"],
    [TARGETS.ivSilibinin]: [TARGETS.amatoxinRescue, "Acetylcysteine", "Liver transplantation"],
    [TARGETS.ethyleneGlycolCofactors]: ["Fomepizole", "Ethanol for toxic alcohol poisoning", "Hemodialysis for methanol and ethylene glycol poisoning"],
    [TARGETS.thrombolyticHemorrhage]: [TARGETS.cryoprecipitate, "Tranexamic Acid", "Aminocaproic acid"],
    [TARGETS.cryoprecipitate]: [TARGETS.thrombolyticHemorrhage, "Fibrinogen", "Massive transfusion"],
    [TARGETS.vigiv]: ["Smallpox vaccine complications", "Tecovirimat", "Infection-control precautions"],
    [TARGETS.rabiesPep]: ["Rabies vaccine", "Animal-bite wound care", "Tetanus immune globulin"],
    [TARGETS.harsMap]: [TARGETS.filgrastim, TARGETS.pegfilgrastim, TARGETS.sargramostim, TARGETS.romiplostim],
    [TARGETS.filgrastim]: [TARGETS.harsMap, TARGETS.pegfilgrastim, "Febrile neutropenia"],
    [TARGETS.pegfilgrastim]: [TARGETS.harsMap, TARGETS.filgrastim, "Febrile neutropenia"],
    [TARGETS.sargramostim]: [TARGETS.harsMap, TARGETS.filgrastim, "GM-CSF"],
    [TARGETS.romiplostim]: [TARGETS.harsMap, "Platelet transfusion", "Thrombopoietin receptor agonists"],
    [TARGETS.ammonul]: [TARGETS.carglumic, "Urea-cycle disorders", "Hemodialysis for hyperammonemia"],
    [TARGETS.carglumic]: [TARGETS.ammonul, "NAGS deficiency", "Propionic and methylmalonic acidemia"],
    [TARGETS.benzodiazepineRescue]: ["Atropine", "Pralidoxime", "Intravenous lipid emulsion"]
  });

  const card = (name) => {
    const key = normalize(name);
    const drugs = (window.ANI_PHARM_DATABASE && window.ANI_PHARM_DATABASE.drugs) || [];
    const matches = drugs.filter((drug) => [drug.displayName, drug.name, drug.generic]
      .some((value) => normalize(value) === key));
    return matches.find((drug) => !drug.hidden && drug.studentFacing !== false) || matches[0] || null;
  };

  const isPriorActiveEmergency = (input = "") => Boolean(priorRouting
    && typeof priorRouting.isActiveEmergency === "function"
    && priorRouting.isActiveEmergency(input));

  const isClearlyEducational = (input = "") => {
    const text = normalize(input);
    const educational = /\b(study|studying|learn|learning|exam|quiz|nclex|homework|case study|simulation|practice question|review article|guideline|protocol development|formulary|inventory|history of|historical|past episode|previous episode|previously|last year|last month|last week|years? ago|months? ago|weeks? ago|long ago)\b/i.test(text);
    const unmistakablyCurrent = /\b(right now|currently|just now|just happened|just swallowed|just drank|just took|minutes? ago|hours? ago|need help now|what do (?:i|we) do now|call 911)\b/i.test(text);
    return educational && !unmistakablyCurrent;
  };

  const isNewActiveEmergency = (input = "") => {
    const text = normalize(input);
    if (!text || isClearlyEducational(input)) return false;

    const urgentTime = /\b(now|right now|currently|just now|just happened|just swallowed|just drank|just took|minutes? ago|hours? ago|need help now|what do (?:i|we) do now|call 911)\b/i.test(text);
    const personal = /\b(i|me|my|we|our|my child|my baby|my patient|our patient|patient here|someone here|coworker|friend)\b/i.test(text);
    const hazard = /\b(ifosfamide|chemotherapy extravasation|chemo leak|cisplatin leak|bendamustine leak|mitomycin leak|mitoxantrone leak|death cap|destroying angel|amanita phalloides|amanita ocreata|amatoxin|wild mushroom|ethylene glycol|antifreeze|alteplase|tenecteplase|tpa|tnk|smallpox vaccine complication|eczema vaccinatum|progressive vaccinia|bat bite|rabies exposure|radiation exposure|nuclear accident|hyperammonemia|urea cycle crisis|organophosphate|carbamate|nerve agent|pesticide poisoning|local anesthetic toxicity|stimulant poisoning)\b/i.test(text);
    const exposureAction = /\b(swallowed|drank|ate|ingested|exposed|splashed|spilled|infiltrated|extravasated|extravasating|bit|bite|bitten|scratched|infusing|received|overdosed)\b/i.test(text);
    const severe = /\b(bleeding|gross hematuria|blood in urine|vomiting blood|brain bleed|severe headache|confused|encephalopathy|unresponsive|not breathing|trouble breathing|cyanotic|seizing|seizure|collapsed|crashing|shock|bp is low|blood pressure is low|blistering|rapidly spreading|ammonia is rising|neutropenic fever)\b/i.test(text);
    const activeGrammar = /\b(is|are|am) (bleeding|seizing|crashing|collapsing|extravasating|spreading|not breathing|becoming confused|vomiting)\b/i.test(text);
    const directHelp = /\b(help|what should (?:i|we) do|need an antidote|need treatment|emergency|call poison control|call poison help|call public health)\b/i.test(text);
    const namedAcutePatterns = [
      /\b(?:cisplatin|bendamustine|mitomycin|mitoxantrone|anthracycline)\b.{0,90}\b(?:extravasat\w*|infiltrat\w*|leak\w*|spilled)\b/i,
      /\b(?:death cap|destroying angel|amanita|wild mushroom|amatoxin)\b.{0,100}\b(?:ate|vomit|diarrhea|liver|jaundice|confused)\b/i,
      /\b(?:ethylene glycol|antifreeze)\b.{0,100}\b(?:drank|swallowed|acidosis|confused|kidney|coma)\b/i,
      /\b(?:alteplase|tenecteplase|tpa|tnk|clot buster)\b.{0,100}\b(?:bleed|headache|vomit|confused|weakness|unresponsive)\b/i,
      /\b(?:bat|dog|raccoon|skunk|fox)\b.{0,80}\b(?:bit|bite|bitten|scratch|saliva|rabies)\b/i,
      /\b(?:radiation|nuclear)\b.{0,100}\b(?:exposed|accident|blast|vomit|marrow|blood counts|neutropen|bleed)\b/i,
      /\b(?:ammonia|hyperammonemia|urea cycle)\b.{0,80}\b(?:rising|confused|seiz|coma|encephalopathy)\b/i,
      /\b(?:organophosphate|carbamate|nerve agent|pesticide|local anesthetic|cocaine|amphetamine)\b.{0,80}\b(?:seiz\w*|agitat\w*|hypertherm\w*|rigid\w*|not breathing)\b/i
    ];
    const namedAcute = namedAcutePatterns.some((pattern) => pattern.test(text));
    return (hazard || namedAcute) && (
      activeGrammar
      || (namedAcute && (personal || urgentTime || directHelp))
      || (severe && (personal || urgentTime))
      || (directHelp && (personal || exposureAction || urgentTime))
    );
  };

  const isActiveEmergency = (input = "") => {
    if (isClearlyEducational(input)) return false;
    if (isNewActiveEmergency(input)) return true;
    if (!isPriorActiveEmergency(input)) return false;
    return !educationalTarget(input);
  };

  const emergencyResponse = () => "**This may be an active poisoning, radiation, bleeding, metabolic, envenomation, or medication emergency. Call 911 now** for seizure, breathing trouble, collapse, severe bleeding, neurologic change, shock, rapidly spreading tissue injury, or worsening confusion. For a poisoning or chemical exposure, call **U.S. Poison Help at 1-800-222-1222 now**; clinicians should activate the local poison center and emergency pathway. For rabies or vaccinia concerns, contact emergency care and the applicable public-health authority now. For radiation events, follow emergency-management instructions and avoid spreading contamination. Do not induce vomiting, give a home antidote, use an unverified glucose meter with VIGIV, or delay airway, circulation, decontamination, imaging, glucose, ECG, laboratory, and toxin-specific care while reading ANI.";

  const educationalTarget = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (!text || isNewActiveEmergency(raw)) return "";
    const has = (pattern) => pattern.test(text);

    const exactTarget = Object.values(TARGETS).find((name) => normalize(name) === text);
    if (exactTarget) return exactTarget;

    const mensaCollision = has(/\b(mensa|high iq society)\b/i);
    if (!mensaCollision && (
      has(/\b(mesna|mesnex|mesena|mezna|2 mercaptoethanesulfonate)\b/i)
      || (has(/\bifosfamide\b/i) && has(/\b(bladder protect|uroprotect|hemorrhagic cystitis prevent|prevent blood in urine)\b/i))
    )) return TARGETS.mesna;

    if (has(/\b(amifostine|ethyol|wr 2721|amifostin|amifostene)\b/i)
      || (has(/\bcisplatin\b/i) && has(/\b(kidney|renal)\b/i) && has(/\b(protect|cytoprotect|prevent)\b/i))
      || (has(/\b(head and neck|radiation)\b/i) && has(/\b(xerostomia|dry mouth)\b/i) && has(/\b(protect|prevent|amifostine)\b/i))) return TARGETS.amifostine;

    const cyanideThiosulfate = has(/\b(cyanide|nitroprusside|hydroxocobalamin|sodium nitrite|cyanokit|smoke inhalation cyanide)\b/i);
    const calciphylaxisThiosulfate = has(/\b(calciphylaxis|calcium deposits?|dialysis skin lesions?)\b/i);
    if (has(/\b(pedmark|ped mark|pedmerk)\b/i)
      || (has(/\b(cisplatin|platinum chemotherapy)\b/i) && has(/\b(hearing|ototoxic|audiology|cochlea)\b/i) && has(/\b(prevent|protect(?:or|ion|ive)?|sodium thiosulfate|sts)\b/i))) return TARGETS.pedmark;

    if (!cyanideThiosulfate && !calciphylaxisThiosulfate && (
      (has(/\b(sodium thiosulfate|sodium thiosulphate|sts|thiosulfate|thiosulphate)\b/i) && has(/\b(extravasat\w*|infiltrat\w*|chemo leak|iv leak)\b/i))
      || (has(/\b(cisplatin|bendamustine)\b/i) && has(/\b(extravasat\w*|infiltrat\w*|leak\w*)\b/i))
    )) return TARGETS.thiosulfateExtravasation;

    const rimsoCollision = has(/\b(rimso|rimso 50|interstitial cystitis|bladder instillation|intravesical|industrial solvent|cryopreservation|freezing cells|veterinary|home topical)\b/i);
    if (!rimsoCollision && (
      (has(/\b(dmso|dimethyl sulfoxide|dimethyl sulphoxide)\b/i) && has(/\b(extravasat(?:e|ed|ing|ion)?|infiltrat(?:e|ed|ing|ion)?|chemo leak|vesicant)\b/i))
      || (has(/\b(mitomycin|mitoxantrone)\b/i) && has(/\b(extravasat(?:e|ed|ing|ion)?|infiltrat(?:e|ed|ing|ion)?|leak|antidote)\b/i))
      || (has(/\banthracycline\b/i) && has(/\b(?:extravasat\w*|infiltrat\w*|leak\w*)\b/i) && has(/\b(dexrazoxane unavailable|dexrazoxane contraindicated|dmso)\b/i))
    )) return TARGETS.dmsoExtravasation;

    const oralMilkThistleCollision = has(/\b(milk thistle|silymarin|liver detox|dietary supplement|herbal supplement|st marys thistle)\b/i)
      && !has(/\b(iv|intravenous|legalon sil|emergency ind|amatoxin|death cap|destroying angel)\b/i);
    if (!oralMilkThistleCollision && (
      has(/\b(iv silibinin|intravenous silibinin|legalon sil|silibinin dihemisuccinate|emergency ind mushroom|silybinin infusion)\b/i)
      || (has(/\b(silibinin|silybinin)\b/i) && has(/\b(amatoxin|death cap|destroying angel|amanita phalloides|mushroom poison)\b/i))
    )) return TARGETS.ivSilibinin;

    const mushroomCollision = has(/\b(amanita muscaria|muscimol|muscarine|muscarinic mushroom|gyromitra|false morel|psilocybin|magic mushroom)\b/i);
    if (!mushroomCollision && (
      has(/\b(amatoxin|amatoxen|alpha amanitin|death cap|destroying angel|amanita phalloides|amanita ocreata)\b/i)
      || (has(/\bwild mushroom\b/i) && has(/\b(delayed diarrhea|delayed vomiting|liver failure|jaundice|felt better|false recovery)\b/i))
    )) return TARGETS.amatoxinRescue;

    const methanolOrInhCollision = has(/\b(methanol|wood alcohol|isoniazid|inh overdose|wernicke|alcohol withdrawal)\b/i);
    if (!methanolOrInhCollision && has(/\b(ethylene glycol|antifreeze)\b/i)
      && has(/\b(thiamine|pyridoxine|vitamin b1|vitamin b6|b1 b6|cofactors?|glyoxylic|vitamins?)\b/i)) return TARGETS.ethyleneGlycolCofactors;

    const anticoagulantReversalCollision = has(/\b(heparin|warfarin|coumadin|dabigatran|pradaxa|apixaban|eliquis|rivaroxaban|xarelto|edoxaban|protamine|idarucizumab|andexanet)\b/i)
      && !has(/\b(alteplase|tenecteplase|tpa|tnk|thrombolytic|clot buster)\b/i);
    const preThrombolyticEligibility = has(/\b(alteplase|tenecteplase|tpa|tnk|thrombolytic|clot buster)\b/i)
      && has(/\b(stroke symptoms?|ischemic stroke|eligib\w*|ct|scan|last known well|time window|before giving|can we give|can we use|why can we not|why not give|contraindicat\w*|might be bleeding)\b/i)
      && !has(/\b(after|post thrombol|post lysis|received|was given|already gave|infusion completed|treated with)\b/i);
    const postReperfusionMonitoring = has(/\b(alteplase|tenecteplase|tpa|tnk|thrombolytic|clot buster)\b/i)
      && has(/\b(stroke|reperfusion)\b/i)
      && has(/\b(after|post|monitor\w*|neuro checks?|neurologic|blood pressure|bp|cause workup|secondary prevention)\b/i)
      && !has(/\b(major bleed|major hemorrhage|brain bleed|intracranial hemorrhage|ich|active bleeding|reversal|reverse|low fibrinogen)\b/i);
    const cryoDirect = has(/\b(cryoprecipitate|cryoprecipitated ahf|pooled cryo|fibrinogen rich blood product|cryoprecipatate)\b/i)
      || (has(/\bcryo\b/i) && has(/\b(blood|transfusion|fibrinogen|bleeding|hemorrhage)\b/i));
    if (cryoDirect) return TARGETS.cryoprecipitate;
    if (!anticoagulantReversalCollision && !preThrombolyticEligibility && !postReperfusionMonitoring && (
      (has(/\b(alteplase|tenecteplase|tpa|tnk|thrombolytic|clot buster)\b/i) && has(/\b(reversal|reverse|major bleed|hemorrhage|brain bleed|ich|low fibrinogen|bleeding)\b/i))
      || has(/\b(post thrombolysis ich|post lysis hemorrhage)\b/i)
    )) return TARGETS.thrombolyticHemorrhage;

    const vigivCollision = has(/\b(varizig|varicella zoster immune globulin|vz ig|routine ivig|intravenous immunoglobulin|postvaccinial encephalitis|isolated vaccinia keratitis)\b/i);
    if (!vigivCollision && (
      has(/\b(vigiv|vig iv|cnj 016|vaccinia immune globulin|human vaccinia immune globulin)\b/i)
      || has(/\b(eczema vaccinatum|progressive vaccinia|severe generalized vaccinia|smallpox vaccine complication antibody)\b/i)
    )) return TARGETS.vigiv;

    const nonRabiesBiteOnly = has(/\b(tetanus|antibiotic|cellulitis|dog bite infection|cat bite infection)\b/i)
      && !has(/\b(rabies|hrig|hyperrab|kedrab|rabavert|imovax|bat)\b/i);
    if (!nonRabiesBiteOnly && (
      has(/\b(hrig|human rabies immune globulin|hyperrab|kedrab|rabies pep|rabies post exposure|rabies postexposure)\b/i)
      || (has(/\b(rabies|bat bite|bat in bedroom|raccoon bite|skunk bite|fox bite)\b/i) && has(/\b(vaccine|shots?|immune globulin|prevention|exposure|what to do|previously vaccinated)\b/i))
    )) return TARGETS.rabiesPep;

    const radiationCollision = has(/\b(ards|acute respiratory distress|radioiodine|radioactive iodine|potassium iodide|ki tablet|cesium|caesium|thallium|plutonium|americium|curium|prussian blue|dtpa|calcium dtpa|zinc dtpa|internal contamination|radiation burn only)\b/i);
    const radiationContext = has(/\b(radiation|nuclear|radiological|myelosuppressive|marrow|hematopoietic|blood counts)\b/i);
    const myeloidGrowthFactorSignalCount = [
      /\b(filgrastim|neupogen|zarxio|daily (?:white cell|neutrophil) (?:shot|injection))\b/i,
      /\b(pegfilgrastim|neulasta|on.?body injector|once per cycle (?:shot|injection))\b/i,
      /\b(sargramostim|leukine|gm.?csf)\b/i
    ].filter((pattern) => has(pattern)).length;
    const myeloidGrowthFactorComparison = has(/\b(compare|comparison|versus|vs|difference|differentiate)\b/i)
      && myeloidGrowthFactorSignalCount >= 2;
    const thrombopoietinAgonistComparison = has(/\b(compare|comparison|versus|vs|difference|differentiate)\b/i)
      && has(/\bromiplostim\b/i)
      && has(/\b(eltrombopag|avatrombopag|lusutrombopag|tpo agonists?)\b/i);
    if (myeloidGrowthFactorComparison || thrombopoietinAgonistComparison) return "";

    if (has(/\b(filgrastim|neupogen|filgrastem)\b/i)
      && (!radiationCollision || !radiationContext || has(/\b(h ars|hars|radiation|nuclear)\b/i))) return TARGETS.filgrastim;
    if (has(/\b(pegfilgrastim|neulasta|pegfilgrastem)\b/i)
      && (!radiationCollision || !radiationContext || has(/\b(h ars|hars|radiation|nuclear)\b/i))) return TARGETS.pegfilgrastim;
    if (has(/\b(sargramostim|leukine|sargramostem|gm csf)\b/i)
      && (!radiationCollision || !radiationContext || has(/\b(h ars|hars|radiation|nuclear)\b/i))) return TARGETS.sargramostim;
    if (has(/\b(romiplostim|nplate|romiplastim)\b/i)
      && (!radiationCollision || !radiationContext || has(/\b(h ars|hars|radiation|nuclear)\b/i))) return TARGETS.romiplostim;

    if (!radiationCollision && (
      has(/\b(h ars|hars|hematopoietic acute radiation syndrome|hematopoietic ars)\b/i)
      || (radiationContext && has(/\b(marrow failure|neutropenia|thrombocytopenia|pancytopenia|growth factors?|countermeasures?|blood cell recovery|low blood counts)\b/i))
    )) return TARGETS.harsMap;

    const valproateOrLiverCollision = has(/\b(valproate|valproic acid|divalproex|depakote|cirrhosis|hepatic encephalopathy|lactulose|rifaximin)\b/i);
    if (!valproateOrLiverCollision && (
      has(/\b(ammonul|ammonol|sodium phenylacetate and sodium benzoate|benzoate phenylacetate|phenylacetate benzoate|nitrogen scavenger infusion)\b/i)
      || (has(/\b(urea cycle|ucd)\b/i) && has(/\b(acute hyperammon|ammonia crisis|nitrogen scaveng|iv treatment|encephalopathy)\b/i))
    )) return TARGETS.ammonul;

    if (!valproateOrLiverCollision && (
      has(/\b(carglumic acid|carbaglu|n carbamylglutamate|ncg|carglumate|carbagloo)\b/i)
      || has(/\b(nags deficiency|n acetylglutamate synthase deficiency|cps1 activator)\b/i)
      || (has(/\b(propionic acidemia|methylmalonic acidemia|mma crisis)\b/i) && has(/\b(hyperammon|ammonia|carglumic|carbaglu)\b/i))
    )) return TARGETS.carglumic;

    const benzodiazepineOverdoseCollision = has(/\b(benzodiazepine overdose|benzo overdose|valium overdose|diazepam overdose|lorazepam overdose|ativan overdose|midazolam overdose|xanax overdose|alprazolam overdose|sedative overdose|flumazenil|romazicon)\b/i);
    const toxicSeizureContext = has(/\b(organophosphate|carbamate|nerve agent|sarin|vx agent|pesticide|cholinesterase inhibitor|cocaine|amphetamine|methamphetamine|sympathomimetic|local anesthetic|bupivacaine|lidocaine toxicity|poison induced|toxicologic|overdose)\b/i);
    if (!benzodiazepineOverdoseCollision && (
      (has(/\b(benzodiazepine|benzodiazapine|diazepam|valium|midazolam|versed|lorazepam|ativan|benzos?)\b/i) && toxicSeizureContext && has(/\b(seizure|seizing|convulsion|agitation|agitated|hyperthermia|rescue|treatment)\b/i))
      || (toxicSeizureContext && has(/\b(toxicologic seizure|poison induced seizure|seizure rescue)\b/i))
      || (has(/\b(nerve agent|sarin|vx agent)\b/i) && has(/\b(seizure|convulsion|diazepam|midazolam)\b/i))
    )) return TARGETS.benzodiazepineRescue;

    return "";
  };

  const canonicalTarget = (input = "") => educationalTarget(input);
  const match = (input = "") => {
    const target = canonicalTarget(input);
    return target ? card(target) : null;
  };

  if (baseExactPharmDetailCandidate) {
    exactPharmDetailCandidate = function (input = "", preferredType = "", ...args) {
      const normalizedPreferredType = preferredType === "procedures" ? "reference" : preferredType;
      if (!normalizedPreferredType || normalizedPreferredType === "drug") {
        const target = canonicalTarget(input);
        const item = target ? card(target) : null;
        if (item) return { type: "drug", item };
      }
      return baseExactPharmDetailCandidate(input, preferredType, ...args);
    };
    window.exactPharmDetailCandidate = exactPharmDetailCandidate;
  }

  if (baseHighYieldDrugClueMatch) {
    highYieldDrugClueMatch = function (input = "") {
      if (isActiveEmergency(input)) return null;
      return match(input) || baseHighYieldDrugClueMatch(input);
    };
    window.highYieldDrugClueMatch = highYieldDrugClueMatch;
  }

  if (baseMakeModelEnhancedResponse) {
    makeModelEnhancedResponse = function (input = "", ...args) {
      if (isNewActiveEmergency(input)) return emergencyResponse();
      const target = canonicalTarget(input);
      if (isPriorActiveEmergency(input) && !isClearlyEducational(input) && !target) return baseMakeModelEnhancedResponse(input, ...args);
      if (!target) return baseMakeModelEnhancedResponse(input, ...args);
      const related = RELATED_TOPICS[target] || [];
      const relatedText = related.length ? " Related topics: **" + related.join("**, **") + "**." : "";
      const safetyText = target === TARGETS.ivSilibinin
        ? " This card explicitly identifies IV silibinin as investigational and not FDA approved in the United States."
        : target === TARGETS.ethyleneGlycolCofactors
          ? " These vitamins are unproven adjuncts; fomepizole or ethanol and indicated dialysis remain the priorities."
          : target === TARGETS.harsMap
            ? " This is marrow-directed H-ARS content, not ARDS, radioiodine blocking, or internal-contamination decorporation."
            : target === TARGETS.thrombolyticHemorrhage
              ? " This is a major-hemorrhage protocol map, not a single direct thrombolytic antidote."
              : "";
      return {
        type: "pharm-database",
        query: target,
        detailType: "drug",
        openDetail: true,
        highlightQuery: String(input || ""),
        preface: "Opening **" + target + "** in the rescue and countermeasure reference." + safetyText + relatedText,
        originalQuery: String(input || "")
      };
    };
    window.makeModelEnhancedResponse = makeModelEnhancedResponse;
  }

  const routingTargets = Array.from(new Set(Object.values(TARGETS)));
  if (window.ANI_ANTIDOTE_WAVE30) {
    window.ANI_ANTIDOTE_WAVE30.routingVersion = VERSION;
    window.ANI_ANTIDOTE_WAVE30.routingTargets = routingTargets.slice();
  }
  window.ANI_ANTIDOTE_WAVE30_ROUTING = {
    schemaVersion: 1,
    version: VERSION,
    priorRoutingVersion: priorRouting && priorRouting.version || "",
    targets: TARGETS,
    routingTargets,
    relatedTopics: RELATED_TOPICS,
    match,
    canonicalTarget,
    educationalTarget,
    isActiveEmergency,
    isNewActiveEmergency,
    emergencyResponse
  };
}());
