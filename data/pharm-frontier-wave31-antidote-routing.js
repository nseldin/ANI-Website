/* eslint-disable */
/* Wave 31: intelligent routing for medical countermeasures, exposure rescue, and bleeding pathways. */
(function () {
  "use strict";

  const VERSION = "2026-07-22-antidote-routing-v2";
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function" ? makeModelEnhancedResponse : null;
  const baseHighYieldDrugClueMatch = typeof highYieldDrugClueMatch === "function" ? highYieldDrugClueMatch : null;
  const baseExactPharmDetailCandidate = typeof exactPharmDetailCandidate === "function" ? exactPharmDetailCandidate : null;
  const baseSearchPharmEntries = typeof searchPharmEntries === "function" ? searchPharmEntries : null;
  const priorRouting = window.ANI_ANTIDOTE_WAVE30_ROUTING
    || window.ANI_ANTIDOTE_WAVE29_ROUTING
    || window.ANI_ANTIDOTE_WAVE28_ROUTING
    || window.ANI_ANTIDOTE_WAVE26_ROUTING
    || null;

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const TARGETS = Object.freeze({
    ennumo: "Ennumo (pegfilgrastim-pccg)",
    filkri: "Filkri (filgrastim-laha)",
    harsMap: "Hematopoietic acute radiation syndrome countermeasures",
    epinephrine: "Epinephrine",
    rsdl: "Reactive Skin Decontamination Lotion (RSDL)",
    hydrocarbonRescue: "Volatile hydrocarbon exposure emergency care",
    tecovirimat: "Tecovirimat",
    brincidofovir: "Brincidofovir",
    smallpoxPep: "Smallpox postexposure prophylaxis and countermeasure pathway",
    jynneos: "Jynneos",
    inmazeb: "INMAZEB (atoltivimab, maftivimab, and odesivimab-ebgn)",
    ebanga: "EBANGA (ansuvimab-zykl)",
    ebolaSpeciesMap: "Ebola species and countermeasure decision map",
    anthraxPep: "Anthrax postexposure prophylaxis with antibiotics and vaccine",
    biothrax: "BioThrax",
    cyfendus: "CYFENDUS",
    pyridostigmine: "Pyridostigmine",
    nerveAgentAutoInjectors: "Nerve-agent antidote auto-injector system",
    antiplateletIch: "Antiplatelet-associated spontaneous intracerebral hemorrhage rescue",
    ticagrelorBleeding: "Ticagrelor-associated major-bleeding guide"
  });

  const RELATED_TOPICS = Object.freeze({
    [TARGETS.ennumo]: [TARGETS.harsMap, "Pegfilgrastim", "Acute radiation syndrome"],
    [TARGETS.filkri]: [TARGETS.harsMap, "Filgrastim", "Acute radiation syndrome"],
    [TARGETS.harsMap]: [TARGETS.ennumo, TARGETS.filkri, "Sargramostim", "Romiplostim"],
    [TARGETS.epinephrine]: ["Anaphylaxis", "Cardiac arrest", TARGETS.nerveAgentAutoInjectors],
    [TARGETS.rsdl]: [TARGETS.nerveAgentAutoInjectors, "Chemical decontamination", "Organophosphate poisoning"],
    [TARGETS.hydrocarbonRescue]: ["Aspiration pneumonitis", "Dysrhythmia", "Poison Help"],
    [TARGETS.tecovirimat]: [TARGETS.brincidofovir, TARGETS.smallpoxPep, TARGETS.jynneos],
    [TARGETS.brincidofovir]: [TARGETS.tecovirimat, TARGETS.smallpoxPep, TARGETS.jynneos],
    [TARGETS.smallpoxPep]: [TARGETS.jynneos, TARGETS.tecovirimat, "Vaccinia immune globulin intravenous"],
    [TARGETS.jynneos]: [TARGETS.smallpoxPep, TARGETS.tecovirimat, "Mpox"],
    [TARGETS.inmazeb]: [TARGETS.ebanga, TARGETS.ebolaSpeciesMap, "Ebola virus disease"],
    [TARGETS.ebanga]: [TARGETS.inmazeb, TARGETS.ebolaSpeciesMap, "Ebola virus disease"],
    [TARGETS.ebolaSpeciesMap]: [TARGETS.inmazeb, TARGETS.ebanga, "Ebola virus disease"],
    [TARGETS.anthraxPep]: [TARGETS.biothrax, TARGETS.cyfendus, "Raxibacumab"],
    [TARGETS.biothrax]: [TARGETS.anthraxPep, TARGETS.cyfendus, "Anthrax vaccine adsorbed"],
    [TARGETS.cyfendus]: [TARGETS.anthraxPep, TARGETS.biothrax, "Anthrax vaccine adsorbed, adjuvanted"],
    [TARGETS.pyridostigmine]: [TARGETS.nerveAgentAutoInjectors, "Atropine", "Pralidoxime"],
    [TARGETS.nerveAgentAutoInjectors]: [TARGETS.pyridostigmine, "Atropine", "Pralidoxime"],
    [TARGETS.antiplateletIch]: [TARGETS.ticagrelorBleeding, "Desmopressin", "Intracerebral hemorrhage"],
    [TARGETS.ticagrelorBleeding]: [TARGETS.antiplateletIch, "Ticagrelor", "Platelet transfusion"]
  });

  const POSITIVE_EXAMPLES = Object.freeze({
    [TARGETS.ennumo]: ["Ennumo", "pegfilgrastim-pccg", "pegfilgrastim pccg radiation injury", "Ennumo H-ARS injection", "Ennumo pegylated G-CSF"],
    [TARGETS.filkri]: ["Filkri", "filgrastim-laha", "filgrastim laha radiation injury", "Filkri H-ARS injection", "Filkri G-CSF"],
    [TARGETS.harsMap]: ["H-ARS countermeasure map", "hematopoietic acute radiation syndrome countermeasures", "which growth factors treat radiation marrow failure", "compare G-CSF GM-CSF and romiplostim after radiation", "radiation marrow countermeasure decision guide"],
    [TARGETS.epinephrine]: ["epinephrine", "adrenaline medication", "EpiPen drug card", "epinephrine for anaphylaxis", "epinephrine cardiac arrest dosing concepts"],
    [TARGETS.rsdl]: ["RSDL", "Reactive Skin Decontamination Lotion", "RSDL kit nerve agent decontamination", "skin decon lotion for chemical warfare agent", "reactive skin decon lotion"],
    [TARGETS.hydrocarbonRescue]: ["volatile hydrocarbon emergency care", "gasoline ingestion emergency management", "kerosene aspiration rescue", "lighter fluid poisoning treatment", "paint thinner inhalation dysrhythmia care"],
    [TARGETS.tecovirimat]: ["tecovirimat", "TPOXX", "ST-246", "tecovirimat smallpox treatment", "TPOXX mpox antiviral"],
    [TARGETS.brincidofovir]: ["brincidofovir", "Tembexa", "CMX001 smallpox antiviral", "brincidofovir smallpox treatment", "Tembexa oral suspension"],
    [TARGETS.smallpoxPep]: ["smallpox postexposure prophylaxis", "smallpox exposure vaccine and countermeasure pathway", "what to do after variola exposure", "smallpox contact PEP decision guide", "antibiotic no smallpox vaccine post exposure plan"],
    [TARGETS.jynneos]: ["Jynneos", "MVA-BN vaccine", "modified vaccinia Ankara Bavarian Nordic", "Jynneos smallpox vaccine", "Jynneos mpox vaccine"],
    [TARGETS.inmazeb]: ["INMAZEB", "atoltivimab maftivimab odesivimab-ebgn", "atoltivimab", "maftivimab", "odesivimab Ebola antibody"],
    [TARGETS.ebanga]: ["EBANGA", "ansuvimab-zykl", "ansuvimab", "mAb114 Ebola treatment", "Ebanga Zaire ebolavirus antibody"],
    [TARGETS.ebolaSpeciesMap]: ["Ebola species countermeasure decision map", "which Ebola species can Inmazeb treat", "Zaire versus Sudan Ebola monoclonal antibody guide", "compare Inmazeb and Ebanga by Ebola species", "Ebola species specific treatment decision"],
    [TARGETS.anthraxPep]: ["anthrax postexposure prophylaxis", "anthrax antibiotics plus vaccine after exposure", "ciprofloxacin and vaccine anthrax PEP", "doxycycline with anthrax vaccine post exposure", "anthrax aerosol exposure prevention pathway"],
    [TARGETS.biothrax]: ["BioThrax", "anthrax vaccine adsorbed", "AVA anthrax vaccine", "BioThrax preexposure series", "BioThrax postexposure vaccine"],
    [TARGETS.cyfendus]: ["CYFENDUS", "AV7909", "anthrax vaccine adsorbed adjuvanted", "Cyfendus postexposure vaccine", "Cyfendus CpG adjuvant"],
    [TARGETS.pyridostigmine]: ["pyridostigmine", "Mestinon", "Regonol", "pyridostigmine bromide", "pyridostigmine soman pretreatment"],
    [TARGETS.nerveAgentAutoInjectors]: ["DuoDote", "ATNAA", "Mark I nerve agent kit", "atropine pralidoxime auto injector system", "CANA diazepam nerve agent autoinjector"],
    [TARGETS.antiplateletIch]: ["antiplatelet associated spontaneous ICH rescue", "aspirin spontaneous intracerebral hemorrhage management", "clopidogrel brain bleed reversal pathway", "P2Y12 associated spontaneous ICH", "antiplatelet intracranial hemorrhage rescue guide"],
    [TARGETS.ticagrelorBleeding]: ["ticagrelor major bleeding guide", "Brilinta severe bleeding management", "ticagrelor reversal", "is there an antidote for ticagrelor", "bentracimab evidence for ticagrelor bleeding"]
  });

  const COLLISION_EXAMPLES = Object.freeze({
    [TARGETS.ennumo]: ["pegfilgrastim overview", "Neulasta on-body injector"],
    [TARGETS.filkri]: ["filgrastim overview", "Neupogen febrile neutropenia"],
    [TARGETS.harsMap]: ["ARDS ventilation strategy", "potassium iodide radioiodine blocking", "homonymous hemianopsia optic radiation versus occipital localization", "compare the daily white cell shot once per cycle shot and GM CSF"],
    [TARGETS.epinephrine]: ["plasma metanephrine laboratory test", "unstable slow heart rate atropine versus pacing and epinephrine"],
    [TARGETS.rsdl]: ["reflex sympathetic dystrophy", "eczema moisturizing lotion"],
    [TARGETS.hydrocarbonRescue]: ["polycyclic aromatic hydrocarbon chemistry", "petroleum engineering course"],
    [TARGETS.tecovirimat]: ["mpox vaccine schedule", "TPOXX stock price"],
    [TARGETS.brincidofovir]: ["cidofovir CMV retinitis", "Tembexa stock price"],
    [TARGETS.smallpoxPep]: ["smallpox history essay", "eczema vaccinatum immune globulin"],
    [TARGETS.jynneos]: ["ACAM2000 adverse effects", "mpox rash diagnosis"],
    [TARGETS.inmazeb]: ["maze puzzle game", "monoclonal antibody manufacturing"],
    [TARGETS.ebanga]: ["Ebola supportive care fluids", "banga music festival"],
    [TARGETS.ebolaSpeciesMap]: ["Ebola symptoms pathology", "Marburg vaccine research"],
    [TARGETS.anthraxPep]: ["cutaneous anthrax lesion treatment", "raxibacumab inhalational anthrax antitoxin"],
    [TARGETS.biothrax]: ["anthrax toxin pathophysiology", "biothreat risk assessment"],
    [TARGETS.cyfendus]: ["CYP enzyme inducer", "vaccine adjuvant chemistry"],
    [TARGETS.pyridostigmine]: ["pralidoxime organophosphate antidote", "neostigmine anesthesia reversal"],
    [TARGETS.nerveAgentAutoInjectors]: ["insulin auto injector diabetes", "naloxone nasal spray overdose"],
    [TARGETS.antiplateletIch]: ["warfarin intracranial hemorrhage reversal", "alteplase brain bleed reversal"],
    [TARGETS.ticagrelorBleeding]: ["ticagrelor ACS maintenance therapy", "clopidogrel minor nosebleed"]
  });

  const EMERGENCY_EXAMPLES = Object.freeze([
    "My patient just received Ennumo and is having trouble breathing now",
    "My patient just received Filkri and is collapsing now",
    "We were just exposed to radiation and my patient is vomiting and confused",
    "I accidentally injected epinephrine and now have severe chest pain",
    "RSDL is needed because my skin was just exposed to a nerve agent",
    "My child just swallowed lighter fluid and is coughing now",
    "My patient with smallpox on tecovirimat is seizing now",
    "My patient just took brincidofovir and now cannot breathe",
    "I was just exposed to smallpox what do I do now",
    "I just received Jynneos and now have trouble breathing",
    "Our patient with suspected Ebola needs Inmazeb and is in shock now",
    "Our patient receiving Ebanga is hypotensive and collapsing now",
    "I was exposed to Ebola and now have severe vomiting and confusion",
    "We just inhaled suspicious anthrax powder what should we do now",
    "I just received BioThrax and now cannot breathe",
    "I just received Cyfendus and now have throat swelling",
    "My patient overdosed on pyridostigmine and now has secretions and trouble breathing",
    "We were just exposed to sarin and need the DuoDote autoinjector now",
    "My patient on clopidogrel has a spontaneous brain bleed and is becoming unresponsive",
    "My patient on Brilinta is vomiting blood and collapsing now"
  ]);

  const POSITIVE_CASES = Object.freeze(Object.entries(POSITIVE_EXAMPLES)
    .flatMap(([target, queries]) => queries.map((query) => Object.freeze([query, target]))));
  const COLLISION_CASES = Object.freeze(Object.entries(COLLISION_EXAMPLES)
    .flatMap(([target, queries]) => queries.map((query) => Object.freeze([query, target]))));

  const card = (name) => {
    const key = normalize(name);
    const drugs = (window.ANI_PHARM_DATABASE && window.ANI_PHARM_DATABASE.drugs) || [];
    const matches = drugs.filter((drug) => [drug.displayName, drug.name, drug.generic]
      .some((value) => normalize(value) === key));
    return matches.find((drug) => !drug.hidden && drug.studentFacing !== false) || matches[0] || null;
  };

  const exactVisibleCanonicalDrug = (input = "") => {
    const query = normalize(input);
    if (!query) return null;
    const drugs = (window.ANI_PHARM_DATABASE && window.ANI_PHARM_DATABASE.drugs) || [];
    // This raw-database fallback exists only for genuine combination-product
    // cards that the normalized single-drug index intentionally omits. Never
    // let it promote a shallow legacy single-drug record over the curated
    // runtime card (the Milrinone hyperlink regression caught this case).
    const matches = drugs.filter((drug) => drug && drug.hidden !== true && drug.studentFacing !== false
      && (typeof isStudentFacingCombinationMedicationEntry === "function"
        ? isStudentFacingCombinationMedicationEntry(drug)
        : drug.combinationProduct === true)
      && [drug.name, drug.displayName].some((value) => normalize(value) === query));
    return matches.length === 1 ? matches[0] : null;
  };

  const isPriorActiveEmergency = (input = "") => Boolean(priorRouting
    && typeof priorRouting.isActiveEmergency === "function"
    && priorRouting.isActiveEmergency(input));

  const isClearlyEducational = (input = "") => {
    const text = normalize(input);
    const educational = /\b(study|studying|learn|learning|exam|quiz|nclex|homework|case study|simulation|practice question|review article|guideline|protocol development|formulary|inventory|history of|historical|past episode|previous episode|previously|last year|last month|last week|years? ago|months? ago|weeks? ago|long ago)\b/i.test(text);
    const unmistakablyCurrent = /\b(right now|currently|just now|just happened|just swallowed|just inhaled|just injected|just received|minutes? ago|hours? ago|need help now|what do (?:i|we) do now|call 911)\b/i.test(text);
    return educational && !unmistakablyCurrent;
  };

  const isNewActiveEmergency = (input = "") => {
    const text = normalize(input);
    if (!text || isClearlyEducational(input)) return false;

    const urgentTime = /\b(now|right now|currently|just|just now|just happened|just swallowed|just inhaled|just injected|just received|minutes? ago|hours? ago|need help now|what do (?:i|we) do now|call 911)\b/i.test(text);
    const personal = /\b(i|me|my|we|our|my child|my baby|my patient|our patient|patient here|someone here|coworker|friend)\b/i.test(text);
    const directHelp = /\b(help|what should (?:i|we) do|what do (?:i|we) do|need treatment|need an antidote|need the|emergency|call poison control|call poison help|call public health)\b/i.test(text);
    const exposureAction = /\b(swallowed|drank|inhaled|breathed|exposed|splashed|spilled|injected|received|overdosed|took|contacted)\b/i.test(text);
    const severe = /\b(trouble breathing|cannot breathe|cant breathe|not breathing|throat swelling|collapsed|collapsing|unresponsive|seizing|seizure|shock|hypotensive|severe chest pain|vomiting blood|brain bleed|confused|severe vomiting|coughing|choking|secretions|cyanotic|rapidly worsening)\b/i.test(text);
    const hazard = /\b(ennumo|pegfilgrastim pccg|filkri|filgrastim laha|h ars|hematopoietic acute radiation|radiation|epinephrine|adrenaline|epipen|rsdl|reactive skin decontamination|nerve agent|sarin|soman|vx|duodote|atnaa|mark i|cana|volatile hydrocarbon|gasoline|kerosene|lighter fluid|paint thinner|mineral spirits|tecovirimat|tpoxx|brincidofovir|tembexa|smallpox|variola|jynneos|inmazeb|atoltivimab|maftivimab|odesivimab|ebanga|ansuvimab|ebola|anthrax|biothrax|cyfendus|pyridostigmine|mestinon|antiplatelet|aspirin|clopidogrel|prasugrel|ticagrelor|brilinta)\b/i.test(text);
    const namedAcute = [
      /\b(?:gasoline|kerosene|lighter fluid|paint thinner|mineral spirits|naphtha)\b.{0,100}\b(?:swallowed|drank|inhaled|coughed|choked|vomited)\b/i,
      /\b(?:sarin|soman|vx|nerve agent)\b.{0,100}\b(?:exposed|secretions|seiz|weak|not breathing|need)\b/i,
      /\b(?:smallpox|variola|ebola|anthrax)\b.{0,100}\b(?:exposed|contact|fever|vomit|bleed|shock|confused|what do)\b/i,
      /\b(?:aspirin|clopidogrel|prasugrel|ticagrelor|brilinta|antiplatelet)\b.{0,100}\b(?:brain bleed|intracerebral|intracranial|vomiting blood|major bleed|unresponsive|collapsing)\b/i
    ].some((pattern) => pattern.test(text));
    return (hazard || namedAcute) && (
      namedAcute && (personal || urgentTime || directHelp)
      || urgentTime && (personal || directHelp || exposureAction || severe)
      || severe && (personal || directHelp)
      || directHelp && exposureAction
    );
  };

  const educationalTarget = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (!text || isNewActiveEmergency(raw)) return "";
    const has = (pattern) => pattern.test(text);

    const exactTarget = Object.values(TARGETS).find((name) => normalize(name) === text);
    if (exactTarget) return exactTarget;

    const financialOrNonmedical = has(/\b(stock|share price|investor|earnings|movie|music|festival|puzzle|game|chemistry|engineering course)\b/i);

    const neuroanatomicRadiationIntent = has(/\b(optic radiation|visual radiation|homonymous hemianopsia|homonymous hemianopia|occipital localization|visual field localization)\b/i);
    const harsComparison = !neuroanatomicRadiationIntent
      && has(/\b(h ars|hars|hematopoietic acute radiation|radiation|radiation marrow|radiation induced myelosuppression)\b/i)
      && (has(/\b(countermeasure map|decision guide|which|compare|comparison|versus|vs|growth factors?|g csf|gm csf|romiplostim|blood cell recovery)\b/i)
        || (has(/\b(ennumo|pegfilgrastim)\b/i) && has(/\b(filkri|filgrastim|sargramostim|romiplostim)\b/i)));
    if (harsComparison) return TARGETS.harsMap;

    if (has(/\b(ennumo|pegfilgrastim pccg|pegfilgrastim pccg injection|pegfilgrastem pccg)\b/i)) return TARGETS.ennumo;
    if (has(/\b(filkri|filgrastim laha|filgrastem laha)\b/i)) return TARGETS.filkri;
    if (has(/\b(h ars|hars|hematopoietic acute radiation syndrome|radiation marrow countermeasure|radiation marrow failure)\b/i)
      && has(/\b(countermeasure|treat|treatment|growth factor|marrow|neutropenia|thrombocytopenia|pancytopenia|blood counts?)\b/i)) return TARGETS.harsMap;

    if (has(/\b(rsdl|reactive skin decontamination lotion|reactive skin decon lotion|skin decon lotion)\b/i)) return TARGETS.rsdl;

    const smallpoxComplication = has(/\b(eczema vaccinatum|progressive vaccinia|vaccinia immune globulin|vigiv|vaccine complication|postvaccinial)\b/i);
    const smallpoxPepIntent = !smallpoxComplication
      && has(/\b(smallpox|variola)\b/i)
      && has(/\b(post ?exposure|pep|exposed|exposure|contact|prophylaxis|prevention|countermeasure pathway|what to do after)\b/i)
      && !has(/\b(active disease|confirmed disease|lesions?|rash|treatment of disease|antiviral treatment)\b/i);
    if (smallpoxPepIntent) return TARGETS.smallpoxPep;

    if (!financialOrNonmedical && has(/\b(tecovirimat|tpoxx|tpox|st 246)\b/i)) return TARGETS.tecovirimat;
    if (!financialOrNonmedical && has(/\b(brincidofovir|tembexa|cmx001|cmx 001)\b/i)) return TARGETS.brincidofovir;
    if (!financialOrNonmedical && has(/\b(jynneos|mva bn|modified vaccinia ankara bavarian nordic|imvamune|imvanex)\b/i)) return TARGETS.jynneos;
    if (has(/\b(smallpox|variola)\b/i) && has(/\b(post ?exposure|pep|countermeasure pathway|contact management)\b/i)) return TARGETS.smallpoxPep;

    const ebolaDecisionIntent = has(/\b(ebola|ebolavirus|zaire|sudan|bundibugyo|tai forest|reston)\b/i)
      && has(/\b(species|which antibody|which monoclonal|decision map|countermeasure map|compare|comparison|versus|vs|does .* treat)\b/i);
    if (ebolaDecisionIntent) return TARGETS.ebolaSpeciesMap;
    if (!financialOrNonmedical && has(/\b(inmazeb|regn eb3|regn eb 3|atoltivimab|maftivimab|odesivimab(?: ebgn)?)\b/i)) return TARGETS.inmazeb;
    if (!financialOrNonmedical && has(/\b(ebanga|ansuvimab(?: zykl)?|mab114|mab 114)\b/i)) return TARGETS.ebanga;
    if (has(/\b(ebola|ebolavirus)\b/i) && has(/\b(species|countermeasure|antibody choice|treatment decision)\b/i)) return TARGETS.ebolaSpeciesMap;

    const activeAnthraxTreatment = has(/\b(active|confirmed|symptomatic|inhalational|cutaneous|gastrointestinal|meningitis|antitoxin|raxibacumab|obiltoxaximab|anthrasil|aigiv)\b/i)
      && !has(/\b(post ?exposure|pep|prophylaxis|prevention|asymptomatic exposure)\b/i);
    const anthraxPepIntent = !activeAnthraxTreatment
      && has(/\banthrax\b/i)
      && has(/\b(post ?exposure|pep|prophylaxis|prevention|after exposure|aerosol exposure|antibiotics? plus vaccine|ciprofloxacin.*vaccine|doxycycline.*vaccine)\b/i);
    if (anthraxPepIntent) return TARGETS.anthraxPep;
    if (!financialOrNonmedical && has(/\b(cyfendus|av7909|av 7909|anthrax vaccine adsorbed adjuvanted)\b/i)) return TARGETS.cyfendus;
    if (!financialOrNonmedical && has(/\b(biothrax|anthrax vaccine adsorbed|ava anthrax vaccine)\b/i)) return TARGETS.biothrax;

    const nerveAutoInjectorIntent = has(/\b(duodote|atnaa|mark i|nerve agent (?:antidote )?(?:auto ?injector|kit)|atropine pralidoxime auto ?injector|cana diazepam|diazepam auto ?injector)\b/i)
      || (has(/\b(sarin|soman|vx|nerve agent)\b/i) && has(/\b(auto ?injector|duodote|atnaa|mark i|post ?exposure antidote system)\b/i));
    if (nerveAutoInjectorIntent) return TARGETS.nerveAgentAutoInjectors;
    if (has(/\b(pyridostigmine|mestinon|regonol|pyridostigmine bromide)\b/i)) return TARGETS.pyridostigmine;

    const anticoagulantOrThrombolytic = has(/\b(warfarin|coumadin|heparin|enoxaparin|dabigatran|apixaban|rivaroxaban|edoxaban|alteplase|tenecteplase|tpa|tnk|thrombolytic)\b/i)
      && !has(/\b(aspirin|clopidogrel|prasugrel|ticagrelor|brilinta|antiplatelet|p2y12)\b/i);
    const ticagrelorIntent = has(/\b(ticagrelor|brilinta)\b/i)
      && has(/\b(major bleed|major bleeding|severe bleed|severe bleeding|hemorrhage|reversal|reverse|antidote|bentracimab|platelet transfusion|bleeding guide|no approved antidote)\b/i);
    if (ticagrelorIntent) return TARGETS.ticagrelorBleeding;
    const antiplateletIchIntent = !anticoagulantOrThrombolytic
      && has(/\b(antiplatelet|aspirin|clopidogrel|prasugrel|p2y12)\b/i)
      && has(/\b(spontaneous|nontraumatic|intracerebral|intracranial|ich|brain bleed)\b/i)
      && has(/\b(associated|rescue|management|reverse|reversal|hemorrhage|bleed|desmopressin|platelet)\b/i);
    if (antiplateletIchIntent) return TARGETS.antiplateletIch;

    const hydrocarbonChemicalOnly = has(/\b(polycyclic aromatic|petroleum engineering|organic chemistry|hydrocarbon chemistry|fuel economy)\b/i);
    if (!hydrocarbonChemicalOnly && (
      has(/\b(volatile hydrocarbon (?:exposure )?emergency care|hydrocarbon poisoning|hydrocarbon ingestion|hydrocarbon inhalation)\b/i)
      || (has(/\b(gasoline|kerosene|lighter fluid|paint thinner|mineral spirits|naphtha|toluene|xylene)\b/i)
        && has(/\b(swallow|ingest|aspirat|inhale|exposure|poison|emergency|rescue|treatment|management|dysrhythmia|cough|pneumonitis)\b/i))
    )) return TARGETS.hydrocarbonRescue;

    const bradycardiaDecisionIntent = has(/\b(bradycardia|slow heart rate|heart rate.*low|unstable brady|high.?grade heart block|complete heart block)\b/i)
      && has(/\b(atropine|pace|pacing|dopamine|epinephrine|hypotension|shock|poor perfusion|altered|chest pain|heart failure|treat|versus|vs)\b/i);
    if (bradycardiaDecisionIntent) return "";

    const epinephrineCollision = has(/\b(metanephrine|catecholamine lab|synthesis pathway|movie|song|adrenaline rush ride)\b/i);
    if (!epinephrineCollision && has(/\b(epinephrine|epipen|adrenaclick|auvi q)\b/i)) return TARGETS.epinephrine;
    if (!epinephrineCollision && has(/\badrenaline\b/i)
      && has(/\b(medication|drug|anaphylaxis|cardiac arrest|autoinjector|auto injector|im injection|iv infusion|vasopressor)\b/i)) return TARGETS.epinephrine;

    return "";
  };

  const canonicalTarget = (input = "") => educationalTarget(input);
  const match = (input = "") => {
    const target = canonicalTarget(input);
    return target ? card(target) : null;
  };

  const isActiveEmergency = (input = "") => {
    if (isClearlyEducational(input)) return false;
    if (isNewActiveEmergency(input)) return true;
    if (!isPriorActiveEmergency(input)) return false;
    return !educationalTarget(input);
  };

  const emergencyResponse = () => "**This may be an active poisoning, chemical or biological exposure, severe medication reaction, or major bleeding emergency. Call 911 now** for breathing trouble, collapse, seizure, shock, neurologic change, severe bleeding, or rapidly worsening symptoms. For poisoning or chemical exposure, call **U.S. Poison Help at 1-800-222-1222 now**; clinicians should activate the poison center and emergency pathway. For suspected smallpox, Ebola, anthrax, radiation, or nerve-agent exposure, immediately activate local emergency, infection-control, public-health, and hazardous-material protocols. Move away from continuing exposure only if safe, do not induce vomiting or give a home antidote, and do not delay airway, breathing, circulation, decontamination, isolation, diagnostic, and cause-specific treatment while reading ANI.";

  if (baseExactPharmDetailCandidate) {
    exactPharmDetailCandidate = function (input = "", preferredType = "", ...args) {
      const normalizedPreferredType = preferredType === "procedures" ? "reference" : preferredType;
      if (!normalizedPreferredType || normalizedPreferredType === "drug") {
        const exactCanonical = exactVisibleCanonicalDrug(input);
        if (exactCanonical) return { type: "drug", item: exactCanonical };
        const target = canonicalTarget(input);
        const item = target ? card(target) : null;
        if (item) return { type: "drug", item };
      }
      return baseExactPharmDetailCandidate(input, preferredType, ...args);
    };
    window.exactPharmDetailCandidate = exactPharmDetailCandidate;
  }

  if (baseSearchPharmEntries) {
    searchPharmEntries = function (query = "", category = "All", ...args) {
      const results = baseSearchPharmEntries(query, category, ...args) || [];
      const categoryKey = normalize(category);
      if (categoryKey && categoryKey !== "all") return results;
      const exactCanonical = exactVisibleCanonicalDrug(query);
      if (!exactCanonical) return results;
      return [exactCanonical, ...results.filter((item) => item !== exactCanonical)];
    };
    window.searchPharmEntries = searchPharmEntries;
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
      const safetyText = target === TARGETS.ticagrelorBleeding
        ? " This guide does not imply that a specific ticagrelor antidote is currently approved; it separates established supportive care from emerging bentracimab evidence."
        : target === TARGETS.pyridostigmine
          ? " Pyridostigmine is pretreatment for a narrow soman-risk indication, not stand-alone treatment after nerve-agent exposure."
          : target === TARGETS.nerveAgentAutoInjectors
            ? " Product selection and repeat dosing belong to trained emergency protocols; airway support and decontamination remain essential."
            : target === TARGETS.hydrocarbonRescue
              ? " Hydrocarbon care emphasizes aspiration and dysrhythmia risk; inducing vomiting can worsen lung injury."
              : target === TARGETS.ebolaSpeciesMap
                ? " Antibody eligibility depends on the infecting ebolavirus species; supportive and isolation care cannot wait."
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
  const routingContract = Object.freeze({
    positiveCases: POSITIVE_CASES,
    collisionCases: COLLISION_CASES,
    emergencyCases: EMERGENCY_EXAMPLES,
    positiveCount: POSITIVE_CASES.length,
    collisionCount: COLLISION_CASES.length,
    emergencyCount: EMERGENCY_EXAMPLES.length
  });
  if (window.ANI_ANTIDOTE_WAVE31) {
    window.ANI_ANTIDOTE_WAVE31.routingVersion = VERSION;
    window.ANI_ANTIDOTE_WAVE31.routingTargets = routingTargets.slice();
    window.ANI_ANTIDOTE_WAVE31.routingContract = {
      positiveCount: routingContract.positiveCount,
      collisionCount: routingContract.collisionCount,
      emergencyCount: routingContract.emergencyCount
    };
  }
  window.ANI_ANTIDOTE_WAVE31_ROUTING = {
    schemaVersion: 1,
    version: VERSION,
    priorRoutingVersion: priorRouting && priorRouting.version || "",
    targets: TARGETS,
    routingTargets,
    relatedTopics: RELATED_TOPICS,
    routingContract,
    match,
    exactVisibleCanonicalDrug,
    canonicalTarget,
    educationalTarget,
    isActiveEmergency,
    isNewActiveEmergency,
    isClearlyEducational,
    emergencyResponse
  };
}());
