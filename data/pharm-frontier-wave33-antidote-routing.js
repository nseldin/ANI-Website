/* eslint-disable */
/* Wave 33: intent-aware routing for poisoning decisions, antidotes, supportive rescue, and decontamination safety. */
(function () {
  "use strict";

  const VERSION = "2026-07-19-wave33-antidote-routing-1";
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function" ? makeModelEnhancedResponse : null;
  const baseHighYieldDrugClueMatch = typeof highYieldDrugClueMatch === "function" ? highYieldDrugClueMatch : null;
  const baseExactPharmDetailCandidate = typeof exactPharmDetailCandidate === "function" ? exactPharmDetailCandidate : null;
  const baseOfflineLookupSuggestions = typeof offlineLookupSuggestions === "function" ? offlineLookupSuggestions : null;
  const priorRouting = window.ANI_ANTIDOTE_WAVE32_ROUTING
    || window.ANI_ANTIDOTE_WAVE31_ROUTING
    || window.ANI_ANTIDOTE_WAVE30_ROUTING
    || null;

  const normalize = (value) => String(value || "")
    .toLowerCase().replace(/[\u2019']/g, "").replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");

  const TARGETS = Object.freeze({
    acetaminophen: "Acetaminophen poisoning decision pathway",
    toxicAlcohol: "Toxic alcohol poisoning decision pathway",
    salicylate: "Salicylate poisoning rescue pathway",
    iron: "Iron overdose decision pathway",
    lead: "Lead poisoning chelation decision pathway",
    sulfonylurea: "Sulfonylurea recurrent hypoglycemia rescue pathway",
    benzodiazepine: "Benzodiazepine poisoning and flumazenil decision pathway",
    anticholinergic: "Anticholinergic delirium and physostigmine decision pathway",
    serotonin: "Serotonin syndrome rescue pathway",
    nms: "Neuroleptic malignant syndrome rescue pathway",
    malignantHyperthermia: "Malignant hyperthermia crisis pathway",
    isoniazid: "Isoniazid poisoning and pyridoxine rescue pathway",
    paraquat: "Paraquat and diquat poisoning response pathway",
    chloroquine: "Chloroquine and hydroxychloroquine poisoning rescue pathway",
    bupropion: "Bupropion poisoning rescue pathway",
    colchicine: "Colchicine poisoning response pathway",
    carbonMonoxide: "Carbon monoxide poisoning rescue pathway",
    cyanide: "Cyanide and smoke inhalation rescue pathway",
    methemoglobinemia: "Methemoglobinemia rescue pathway",
    decontamination: "Gastrointestinal and dermal decontamination safety pathway"
  });

  const POSITIVE_EXAMPLES = Object.freeze({
    [TARGETS.acetaminophen]: ["Tylenol overdose decision pathway", "APAP toxicity treatment decision", "acetaminophen NAC start decision pathway", "Rumack Matthew nomogram overdose", "acetominophen poisoning treatment"],
    [TARGETS.toxicAlcohol]: ["antifreeze poisoning fomepizole pathway", "methanol overdose and dialysis decision", "ethylene glycol toxic alcohol rescue", "osmolar gap toxic alcohol poisoning", "fomepizole versus dialysis toxic alcohol decision"],
    [TARGETS.salicylate]: ["aspirin overdose rescue pathway", "salicylate poisoning tinnitus tachypnea", "urine alkalinization for aspirin toxicity", "when to dialyze salicylate poisoning", "salicilate overdose treatment"],
    [TARGETS.iron]: ["iron pill overdose pathway", "deferoxamine selection decision after acute iron poisoning", "child swallowed prenatal vitamins iron", "radiopaque tablets and anion gap iron toxicity", "elemental iron overdose decision"],
    [TARGETS.lead]: ["lead poisoning chelation pathway", "succimer versus calcium EDTA lead", "lead encephalopathy emergency chelation", "high blood lead level treatment", "CaNa2EDTA versus edetate disodium safety decision"],
    [TARGETS.sulfonylurea]: ["glipizide recurrent hypoglycemia octreotide decision pathway", "sulfonylurea overdose rescue pathway", "glyburide low sugar keeps returning", "octreotide after dextrose sulfonylurea selection decision", "child swallowed diabetes pill hypoglycemia"],
    [TARGETS.benzodiazepine]: ["benzodiazepine overdose flumazenil decision", "flumazenil unsafe selection decision", "benzo poisoning reversal pathway", "chronic benzodiazepine user overdose antidote", "mixed TCA and benzodiazepine overdose flumazenil contraindication decision"],
    [TARGETS.anticholinergic]: ["anticholinergic delirium physostigmine pathway", "diphenhydramine delirium and wide QRS", "hot dry hallucinating toxidrome rescue", "physostigmine contraindication decision", "antimuscarinic poisoning treatment decision"],
    [TARGETS.serotonin]: ["serotonin syndrome rescue pathway", "clonus hyperreflexia after SSRI interaction", "serotonin toxicity cyproheptadine decision", "MAOI serotonergic crisis treatment", "seratonin syndrome fever rescue"],
    [TARGETS.nms]: ["neuroleptic malignant syndrome rescue", "lead pipe rigidity antipsychotic fever", "NMS bromocriptine versus dantrolene", "dopamine blocker malignant syndrome pathway", "neuroleptic maligant syndrome treatment"],
    [TARGETS.malignantHyperthermia]: ["malignant hyperthermia crisis dantrolene pathway", "anesthesia high CO2 rigidity rescue", "succinylcholine malignant hyperthermia pathway", "MHAUS dantrolene crisis decision", "malignant hypertherma after volatile anesthetic"],
    [TARGETS.isoniazid]: ["isoniazid overdose pyridoxine rescue pathway", "INH poisoning seizure antidote decision", "pyridoxine gram for gram isoniazid decision", "refractory seizures after tuberculosis medicine", "isoniazide toxicity treatment"],
    [TARGETS.paraquat]: ["paraquat poisoning response pathway", "diquat herbicide ingestion treatment", "paraquat oxygen can worsen lung injury", "bipyridyl herbicide decontamination", "paraquat has no proven antidote"],
    [TARGETS.chloroquine]: ["chloroquine overdose rescue pathway", "hydroxychloroquine poisoning hypotension QRS", "Plaquenil overdose treatment", "chloroquine toxicity epinephrine diazepam", "hydroxycloroquin poisoning rescue"],
    [TARGETS.bupropion]: ["bupropion overdose rescue pathway", "Wellbutrin XL overdose delayed seizure", "bupropion toxicity QRS shock case review", "buproprion poisoning treatment", "extended release antidepressant seizure rescue"],
    [TARGETS.colchicine]: ["colchicine overdose response pathway", "colchicine poisoning multiorgan failure", "gout medicine overdose treatment", "colchicine toxicity delayed marrow suppression", "colchicine has no routine antidote"],
    [TARGETS.carbonMonoxide]: ["carbon monoxide poisoning rescue", "CO exposure normal pulse oximeter", "hyperbaric oxygen decision for carbon monoxide", "carboxyhemoglobin poisoning treatment", "carbon monixide headache after heater"],
    [TARGETS.cyanide]: ["cyanide smoke inhalation rescue", "hydroxocobalamin selection decision for house fire cyanide", "cyanide poisoning lactate antidote", "nitrite versus hydroxocobalamin smoke victim", "cyanid poisoning treatment pathway"],
    [TARGETS.methemoglobinemia]: ["methemoglobinemia rescue pathway", "benzocaine blue patient saturation gap", "methylene blue G6PD decision", "methemoglobin poisoning chocolate blood", "methemoglobinaemia antidote treatment", "dapsone hydroxylamine poisoning saturation gap rescue"],
    [TARGETS.decontamination]: ["activated charcoal poisoning decision", "gastric lavage and whole bowel irrigation safety", "do not induce vomiting after poison", "skin chemical decontamination pathway", "charcoal contraindications hydrocarbon caustic ingestion"]
  });

  const COLLISION_EXAMPLES = Object.freeze([
    "acetaminophen usual adult dose", "Tylenol for fever", "acetylcysteine mucolytic nebulizer", "NAC supplement review",
    "alcohol withdrawal treatment", "ethanol use disorder", "osmolar gap differential without poisoning", "ethylene glycol chemistry",
    "aspirin cardiovascular prevention", "aspirin allergy", "salicylic acid acne product", "tinnitus differential diagnosis",
    "salicylate overdose tinnitus respiratory alkalosis and metabolic acidosis",
    "Aspirin antiplatelet analgesic and salicylate-toxicity pathway",
    "iron deficiency anemia", "oral iron replacement", "ferritin laboratory interpretation", "prenatal vitamin routine use",
    "lead placement on ECG", "leadless pacemaker", "pencil graphite exposure", "routine environmental lead screening",
    "glipizide diabetes dosing", "glyburide pregnancy medication", "octreotide acromegaly", "reactive hypoglycemia diet",
    "which longer sulfonylurea has active metabolites and recurrent low sugar in older adults",
    "recurrent low sugar after dextrose in glyburide poisoning what stops insulin release",
    "benzodiazepine withdrawal", "flumazenil pharmacology study", "chronic anxiety treatment", "sleep hygiene without overdose",
    "anticholinergic burden in dementia", "diphenhydramine usual allergy dose", "physostigmine history", "dry mouth treatment",
    "cycloplegic refraction drop in children that can cause anticholinergic delirium",
    "SSRI therapeutic switching", "serotonin physiology", "cyproheptadine appetite stimulation", "migraine triptan comparison",
    "selegeline meperidine serotonin syndrome interaction",
    "st johns wort serotonin",
    "antipsychotic medication class", "Parkinson rigidity", "catatonia overview", "routine CK laboratory value",
    "fever after vaccination", "anesthesia stages", "dantrolene for spasticity", "succinylcholine pharmacology",
    "isoniazid latent TB treatment", "pyridoxine nutritional deficiency", "tuberculosis screening", "peripheral neuropathy prevention",
    "paraquat pesticide regulation", "garden herbicide safety label", "oxygen therapy overview", "pulmonary fibrosis differential",
    "hydroxychloroquine lupus treatment", "chloroquine malaria prophylaxis", "Plaquenil eye screening", "QT interval medication review",
    "bupropion smoking cessation", "Wellbutrin therapeutic dose", "depression medication comparison", "seizure disorder overview",
    "colchicine gout flare dosing", "familial Mediterranean fever", "neutropenia differential", "gout education",
    "carbon dioxide retention", "pulse oximetry technique", "hyperbaric oxygen for wound care", "home furnace maintenance",
    "cyanocobalamin vitamin B12", "smoke inhalation airway injury", "house fire prevention", "lactate clearance physiology",
    "methylene blue stain microscopy", "blue dye chemistry", "G6PD deficiency overview", "pulse oximeter limitations",
    "saturation gap methemoglobinemia from hydroxylamine metabolite",
    "constipation activated charcoal supplement", "charcoal grill safety", "routine wound irrigation", "skin care after soap exposure"
  ]);

  const EMERGENCY_EXAMPLES = Object.freeze([
    "I took a bottle of Tylenol and feel sick right now",
    "My friend drank antifreeze and is confused now",
    "Patient swallowed aspirin and is breathing fast with ringing ears now",
    "My child just swallowed many iron tablets",
    "Child with very high lead level is seizing now",
    "My patient took glyburide and glucose keeps crashing right now",
    "Person overdosed on benzos and will not wake up now",
    "Diphenhydramine overdose patient is hallucinating with a wide QRS now",
    "Patient has clonus and high fever after serotonergic medicines now",
    "I took St John's wort with an SSRI and now have serotonin syndrome with clonus and high fever",
    "Antipsychotic patient has fever and lead pipe rigidity right now",
    "Patient under anesthesia has rising CO2 rigidity and fever now",
    "INH overdose patient is seizing continuously now",
    "Someone just drank paraquat herbicide",
    "Plaquenil overdose patient is hypotensive with a wide QRS now",
    "Wellbutrin XL overdose patient is seizing now",
    "Patient swallowed colchicine and is collapsing now",
    "Family has headache and confusion after heater exposure right now",
    "House fire victim has shock and severe lactic acidosis now",
    "After benzocaine the patient is blue and cannot breathe now",
    "Chemical powder spilled over my skin and eyes minutes ago"
  ]);

  const BENIGN_EXAMPLES = Object.freeze([
    "acetaminophen poisoning simulation for nursing school", "toxic alcohol pathway journal club",
    "salicylate rescue lecture", "iron overdose historical case review", "lead chelation exam study",
    "sulfonylurea poisoning tabletop exercise", "flumazenil decision policy draft", "physostigmine pharmacology quiz",
    "serotonin syndrome conference presentation", "malignant hyperthermia drill", "carbon monoxide protocol training",
    "decontamination checklist classroom review"
  ]);

  const POSITIVE_CASES = Object.entries(POSITIVE_EXAMPLES)
    .flatMap(([target, queries]) => queries.map((query) => Object.freeze({ query, target })));
  const exactTargetMap = new Map();
  Object.values(TARGETS).forEach((target) => exactTargetMap.set(normalize(target), target));
  const exactCanonicalTargetMap = new Map(exactTargetMap);
  POSITIVE_CASES.forEach(({ query, target }) => exactTargetMap.set(normalize(query), target));

  const dbCards = window.ANI_PHARM_DATABASE && Array.isArray(window.ANI_PHARM_DATABASE.drugs)
    ? window.ANI_PHARM_DATABASE.drugs : [];
  const cardIndex = new Map();
  dbCards.forEach((item) => {
    [item && item.displayName, item && item.name, item && item.generic].map(normalize).filter(Boolean).forEach((name) => {
      if (!cardIndex.has(name) || item.antidoteWave33Revision) cardIndex.set(name, item);
    });
  });
  const card = (target) => cardIndex.get(normalize(target)) || null;

  const isClearlyEducational = (input = "") => {
    const text = normalize(input);
    const educational = /\b(study|studying|exam|nclex|quiz|lecture|class|course|journal club|case review|historical|review|simulation|scenario|tabletop|protocol draft|policy draft|conference|presentation|compare|comparison|mechanism|pharmacology|training)\b/i.test(text);
    const current = /\b(right now|currently|just now|just happened|just swallowed|just drank|minutes? ago|hours? ago|need help now|call 911)\b/i.test(text);
    return educational && !current;
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
    const personal = /\b(i|me|my|we|our|friend|child|baby|family|patient|person|someone|victim)\b/i.test(text);
    const severe = /\b(not breathing|cannot breathe|cant breathe|blue|unresponsive|will not wake|wont wake|confus(?:ed|ion)|hallucinating|seiz(?:e|ed|ing|ure|ures)?|collapse|collapsing|shock|hypotensive|arrhythmia|wide qrs|high fever|rigidity|breathing fast|severe lactic acidosis|glucose keeps crashing|continuous vomiting)\b/i.test(text);
    const exposure = /\b(overdose|overdosed|swallowed|took|drank|ingested|exposed|exposure|spilled|inhaled|poison|toxicity|bottle|many tablets|house fire|heater|generator|furnace|exhaust)\b/i.test(text);
    const hazard = /\b(acetaminophen|tylenol|apap|antifreeze|methanol|ethylene glycol|aspirin|salicylate|iron tablets?|lead level|glipizide|glyburide|sulfonylurea|benzodiazepine|benzos?|diphenhydramine|anticholinergic|serotonin|serotonergic|antipsychotic|neuroleptic|malignant hyperthermia|anesthesia|isoniazid|inh|paraquat|diquat|chloroquine|hydroxychloroquine|plaquenil|bupropion|wellbutrin|colchicine|carbon monoxide|cyanide|smoke|house fire|heater|generator|furnace|exhaust|benzocaine|methemoglobin|chemical powder)\b/i.test(text);
    return hazard && ((current && personal && (exposure || severe)) || (personal && exposure && severe));
  };

  const protectedCollision = (text) => {
    if (text === "aspirin antiplatelet analgesic and salicylate toxicity pathway") return true;
    const therapeuticCycloplegic = /\b(cyclopentolate|cyclogyl|cycloplegic refraction|cycloplegia)\b/i.test(text)
      && !/\b(overdose|poison|toxicity|ingest|swallow|too much|physostigmine|wide qrs)\b/i.test(text);
    if (therapeuticCycloplegic) return true;
    const salicylateMechanismClue = /\b(salicylate|aspirin)\b/i.test(text)
      && /\btinnitus\b/i.test(text)
      && /\brespiratory alkalosis\b/i.test(text)
      && /\bmetabolic acidosis\b/i.test(text)
      && !/\b(rescue|treat(?:ment)?|therapy|management|manage|antidote|dialy\w*|alkalini\w*|bicarbonate|decision|pathway|what (?:do|should)|how should|emergency|right now|currently|just)\b/i.test(text);
    if (salicylateMechanismClue) return true;
    const legacySulfonylureaIdentification = /\b(sulfonylurea|glyburide|glyberide|glibenclamide)\b/i.test(text)
      && /\b(which|longer|active metabolites?|older adults?|renal|kidney|medication|drug)\b/i.test(text)
      && !/\b(overdose|poison|toxicity|swallow|ingest|octreotide|after dextrose|rescue|pathway|decision|emergency)\b/i.test(text);
    if (legacySulfonylureaIdentification) return true;
    const dapsoneIdentificationClue = /\b(hydroxylamine|n hydroxyl(?:ation)?|oxidant metabolite)\b/i.test(text)
      && /\b(methemoglobin|methemoglobinemia|saturation gap|cyanosis|g6pd|hemoly)\b/i.test(text)
      && !/\b(overdose|poison(?:ing)?|toxicity|ingest(?:ed|ion)?|swallow(?:ed)?|too much|pathway|decision|rescue|treat(?:ment)?|antidote|methylene blue|emergency|right now|currently|just)\b/i.test(text);
    if (dapsoneIdentificationClue) return true;
    const maoBInteractionIdentification = /\b(selegiline|selegeline|selegilin|eldepryl|emsam|zelapar|rasagiline|rasagaline|azilect|safinamide|safinimide|xadago)\b/i.test(text)
      && /\b(meperidine|pethidine|tramadol|methadone|dextromethorphan|serotonin syndrome|serotonergic)\b/i.test(text)
      && /\b(interactions?|contraindicat\w*|avoid\w*|do not combine|must not combine)\b/i.test(text)
      && !/\b(rescue|treat(?:ment)?|therapy|management|manage|antidote|cyproheptadine|pathway|decision|what (?:do|should)|how (?:do|should)|emergency|right now|currently|just)\b/i.test(text);
    if (maoBInteractionIdentification) return true;
    if (/\b(usual dose|therapeutic dose|for fever|mucolytic|supplement|withdrawal|use disorder|chemistry|cardiovascular prevention|allergy|acne|iron deficiency|oral iron|ferritin|routine prenatal|lead placement|pacemaker|graphite|screening|diabetes dosing|acromegaly|reactive hypoglycemia|chronic anxiety|sleep hygiene|anticholinergic burden|usual allergy dose|dry mouth|therapeutic switching|serotonin physiology|appetite stimulation|antipsychotic medication class|parkinson rigidity|catatonia overview|routine ck|fever after vaccination|anesthesia stages|spasticity|latent tb|nutritional deficiency|tuberculosis screening|neuropathy prevention|regulation|safety label|pulmonary fibrosis|lupus treatment|malaria prophylaxis|eye screening|smoking cessation|depression medication|gout flare|familial mediterranean fever|gout education|carbon dioxide|osmolar gap differential|wound care|furnace maintenance|cyanocobalamin|fire prevention|lactate clearance|stain microscopy|blue dye|g6pd deficiency overview|charcoal supplement|charcoal grill|routine wound irrigation|skin care)\b/i.test(text)) return true;
    return false;
  };

  const protectedPriorSpecificIntent = (text) => {
    const explicitPathwayIntent = /\b(pathway|decision|algorithm|decision map|selection decision|compare|comparison|versus|vs)\b/i.test(text);
    if (explicitPathwayIntent) return false;
    const namedAgentOrProduct = /\b(nac|acetylcyst(?:eine|ine)|fomepizol(?:e)?|desferal|deferoxamine|succimer|calcium disodium (?:edta|edetate)|cana2edta|versenate|octreotide|flumaz[ae]nil|romazicon|physostigmine|cyproheptadine|periactin|bromocriptine|dantrolene|pyridoxine|vitamin b6|hydroxocobalamin|cyanokit|methylene blue|methlene blue|methylne blue|nithiodote|sodium nitrite|sodium thiosulfate|activated charcoal)\b/i.test(text);
    if (namedAgentOrProduct) return true;
    const carbonMonoxideTreatment = /\b(carbon monoxide|carboxyhemoglobin|co poisoning)\b/i.test(text)
      && /\b(100 percent oxygen|hyperbaric oxygen|hyperbaric therapy|hbo)\b/i.test(text);
    if (carbonMonoxideTreatment) return true;
    const inferredSulfonylureaAntidote = /\b(sulfonylurea|glyburide|glyberide|glibenclamide|glipizide|glimepiride)\b/i.test(text)
      && /\b(after dextrose|dextrose (?:fails|failed)|what stops insulin release|which (?:drug|medicine|medication) stops insulin release)\b/i.test(text)
      && /\b(poison|overdose|recurrent|keeps returning|low sugar|hypoglyc)\b/i.test(text);
    if (inferredSulfonylureaAntidote) return true;
    const inferredNamedAntidote = /\bantidote\b/i.test(text) && (
      /\b(anticholinergic|antimuscarinic).{0,60}\bdelirium\b|\bdelirium\b.{0,60}\b(anticholinergic|antimuscarinic)\b/i.test(text)
      || /\b(ethylene glycol|methanol|antifreeze|toxic alcohol)\b/i.test(text)
      || /\b(isoniazid|inh)\b/i.test(text)
    );
    return inferredNamedAntidote;
  };

  const patternTarget = (text) => {
    const has = (pattern) => pattern.test(text);
    if (has(/\b(acetaminophen|tylenol|apap|paracetamol|acetominophen|acetaminaphen)\b/i) && has(/\b(overdose|poison|toxicity|too much|nomogram|rumack|nac|acetylcysteine|staggered ingestion|unknown time)\b/i)) return TARGETS.acetaminophen;
    if (has(/\b(toxic alcohol|antifreeze|methanol|ethylene glycol|isopropanol|osmolar gap|fomepizol|fomepizole)\b/i) && has(/\b(poison|overdose|ingest|rescue|treat|dialysis|antidote|pathway|gap)\b/i)) return TARGETS.toxicAlcohol;
    if (has(/\b(salicylate|salicilate|aspirin)\b/i) && has(/\b(overdose|poison|toxicity|tinnitus|tachypnea|alkalini|dialy|rescue)\b/i)) return TARGETS.salicylate;
    if (has(/\b(iron|prenatal vitamin|elemental iron|deferoxamine)\b/i) && has(/\b(overdose|poison|swallow|many tablets|radiopaque|anion gap|chelat|rescue)\b/i)) return TARGETS.iron;
    if (has(/\b(lead poison|blood lead|lead encephalopathy|succimer|calcium edta|ca na 2 edta|edetate)\b/i) && has(/\b(chelat|treat|pathway|high|emergency|encephalopathy|decision)\b/i)) return TARGETS.lead;
    if (has(/\b(sulfonylurea|glipizide|glyburide|glimepiride|octreotide|diabetes pill)\b/i) && has(/\b(overdose|poison|hypoglyc|low sugar|glucose|recur|swallow|rescue)\b/i)) return TARGETS.sulfonylurea;
    if (has(/\b(benzodiazepine|benzo|flumazenil)\b/i) && has(/\b(overdose|poison|reversal|unsafe|antidote|decision|mixed|unresponsive)\b/i)) return TARGETS.benzodiazepine;
    if (has(/\b(anticholinergic|antimuscarinic|physostigmine|diphenhydramine|hot dry|hallucinating)\b/i) && has(/\b(delirium|poison|overdose|toxidrome|rescue|contraindicat|wide qrs|treat)\b/i)) return TARGETS.anticholinergic;
    if (has(/\b(serotonin syndrome|serotonin toxicity|serotonergic crisis|seratonin syndrome|clonus hyperreflexia)\b/i)) return TARGETS.serotonin;
    if (has(/\bcyproheptadine\b/i) && has(/\b(serotonin|serotonergic|toxicity|syndrome|antidote|overdose|clonus|hyperreflexia|decision)\b/i)) return TARGETS.serotonin;
    if (has(/\b(neuroleptic malignant|nms|lead pipe rigidity|dopamine blocker malignant|neuroleptic maligant)\b/i)) return TARGETS.nms;
    if (has(/\b(malignant hyperthermia|malignant hypertherma|mhaus|anesthesia high co2|volatile anesthetic)\b/i) && has(/\b(crisis|dantrolene|rescue|treat|rigidity|fever|pathway)\b/i)) return TARGETS.malignantHyperthermia;
    if (has(/\b(isoniazid|inh poisoning|isoniazide)\b/i) && has(/\b(overdose|poison|seiz|pyridoxine|rescue|toxicity)\b/i)) return TARGETS.isoniazid;
    if (has(/\b(paraquat|diquat|bipyridyl herbicide)\b/i) && has(/\b(poison|ingest|drink|decontamin|oxygen|antidote|response|treat)\b/i)) return TARGETS.paraquat;
    if (has(/\b(chloroquine|hydroxychloroquine|plaquenil|hydroxycloroquin)\b/i) && has(/\b(overdose|poison|toxicity|rescue|hypotens|wide qrs|epinephrine|diazepam)\b/i)) return TARGETS.chloroquine;
    if (has(/\b(bupropion|wellbutrin|buproprion)\b/i) && has(/\b(overdose|poison|toxicity|seiz|shock|wide qrs|rescue)\b/i)) return TARGETS.bupropion;
    if (has(/\b(colchicine|gout medicine)\b/i) && has(/\b(overdose|poison|toxicity|multiorgan|marrow suppression|antidote|response)\b/i)) return TARGETS.colchicine;
    if (has(/\b(carbon monoxide|carboxyhemoglobin|carbon monixide|co exposure)\b/i) && has(/\b(poison|exposure|heater|rescue|hyperbaric|headache|pulse ox)\b/i)) return TARGETS.carbonMonoxide;
    if (has(/\b(cyanide|cyanid|house fire|smoke inhalation|hydroxocobalamin)\b/i) && has(/\b(poison|rescue|shock|lactate|antidote|nitrite|treat)\b/i)) return TARGETS.cyanide;
    if (has(/\b(methemoglobin|methemoglobinaemia|benzocaine|chocolate blood|saturation gap|methylene blue)\b/i) && has(/\b(poison|cyanosis|blue patient|patient is blue|rescue|antidote|g6pd|treat|toxicity|methemoglobin|saturation gap|chocolate blood|decision)\b/i)) return TARGETS.methemoglobinemia;
    if (has(/\b(activated charcoal|gastric lavage|whole bowel irrigation|induce vomiting|dermal decontamination|skin decontamination|chemical decontamination)\b/i) && has(/\b(poison|overdose|ingestion|contraindication|hydrocarbon|caustic|corrosive|safety|decision|spill)\b/i)) return TARGETS.decontamination;
    return "";
  };

  const educationalTarget = (input = "") => {
    const text = normalize(input);
    if (!text || isNewActiveEmergency(input) || isPriorActiveEmergency(input)) return "";
    const canonical = exactCanonicalTargetMap.get(text);
    if (canonical) return canonical;
    if (protectedPriorSpecificIntent(text)) return "";
    const exact = exactTargetMap.get(text);
    if (exact) return exact;
    if (protectedCollision(text)) return "";
    return patternTarget(text);
  };

  const canonicalTarget = (input = "") => educationalTarget(input);
  const match = (input = "") => {
    const target = canonicalTarget(input);
    return target ? card(target) : null;
  };
  const prefersStJohnsWortHolistic = (input = "") => {
    const text = normalize(input);
    const stJohnsIdentity = /\b(?:(?:st|saint)\s+(?:johns?|johs?|joh\s+s)\s+(?:wort|wart)|hypericum(?:\s+perforatum)?)\b/i.test(text);
    const explicitSyndrome = /\b(serotonin syndrome|serotonin toxicity|serotonergic crisis|seratonin syndrome|serotonine toxicity)\b/i.test(text);
    const rescueIntent = /\b(clonus|hyperreflexia|cyproheptadine|rescue|antidote|high fever|rigidity|seizure|collapse)\b/i.test(text)
      || (/\b(serotonin|serotonergic)\b/i.test(text)
        && /\b(treat\w*|therap\w*|manage\w*|decision|pathway|emergency|right now|currently|just)\b/i.test(text));
    return stJohnsIdentity && !explicitSyndrome && !rescueIntent && !isActiveEmergency(input);
  };
  const isActiveEmergency = (input = "") => isPriorActiveEmergency(input) || isNewActiveEmergency(input);
  const emergencyResponse = () => "**This may be an active poisoning or chemical exposure. Call 911 now** for collapse, seizure, breathing difficulty, severe confusion, shock, dangerous rhythm, rapidly rising temperature, or a serious current ingestion. In the United States, call **Poison Help at 1-800-222-1222 now**. Move away from an unsafe scene without exposing yourself, support airway and breathing, and follow dispatcher or poison-center instructions. Do not induce vomiting, improvise an antidote, enter a contaminated area, or delay resuscitation to search ANI.";

  const RELATED_TOPICS = Object.freeze({
    [TARGETS.acetaminophen]: ["Acetylcysteine", "Acute liver failure", "Rumack-Matthew nomogram"],
    [TARGETS.toxicAlcohol]: ["Fomepizole", "Anion gap", "Osmolality and osmolar gap"],
    [TARGETS.salicylate]: ["Sodium bicarbonate", "Respiratory alkalosis", "Hemodialysis"],
    [TARGETS.iron]: ["Deferoxamine", "Anion-gap metabolic acidosis", "Shock"],
    [TARGETS.lead]: ["Succimer", "Calcium disodium EDTA", "Environmental exposure"],
    [TARGETS.sulfonylurea]: ["Octreotide", "Hypoglycemia", "Dextrose"],
    [TARGETS.benzodiazepine]: ["Flumazenil", "Benzodiazepine intoxication", "Withdrawal seizures"],
    [TARGETS.anticholinergic]: ["Physostigmine", "Antimuscarinic toxidrome", "Sodium-channel blockade"],
    [TARGETS.serotonin]: ["Cyproheptadine", "Clonus", TARGETS.nms],
    [TARGETS.nms]: ["Rhabdomyolysis", "Malignant catatonia", TARGETS.serotonin],
    [TARGETS.malignantHyperthermia]: ["Dantrolene", "Anesthesia complications", "Hyperkalemia"],
    [TARGETS.isoniazid]: ["Pyridoxine", "Status epilepticus", "Lactic acidosis"],
    [TARGETS.paraquat]: [TARGETS.decontamination, "ARDS", "Occupational pesticide exposure"],
    [TARGETS.chloroquine]: ["Hydroxychloroquine", "Sodium-channel blockade", "Toxicologic shock"],
    [TARGETS.bupropion]: ["Bupropion", "Seizure", "VA-ECMO"],
    [TARGETS.colchicine]: ["Colchicine", "Bone-marrow failure", "Multiorgan failure"],
    [TARGETS.carbonMonoxide]: ["Carboxyhemoglobin", "Hyperbaric oxygen", "Delayed neurologic injury"],
    [TARGETS.cyanide]: ["Hydroxocobalamin", "Smoke inhalation", "Lactic acidosis"],
    [TARGETS.methemoglobinemia]: ["Methylene blue", "G6PD deficiency", "Saturation gap"],
    [TARGETS.decontamination]: ["Activated charcoal", "Whole-bowel irrigation", "Chemical exposure"]
  });

  if (baseExactPharmDetailCandidate) {
    exactPharmDetailCandidate = function (input = "", preferredType = "", ...args) {
      if (isActiveEmergency(input)) return null;
      const normalizedPreferredType = preferredType === "procedures" ? "reference" : preferredType;
      if (!normalizedPreferredType || normalizedPreferredType === "drug") {
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
      return match(input) || baseHighYieldDrugClueMatch(input);
    };
    window.highYieldDrugClueMatch = highYieldDrugClueMatch;
  }

  if (baseOfflineLookupSuggestions) {
    offlineLookupSuggestions = function (input = "", ...args) {
      const results = baseOfflineLookupSuggestions(input, ...args);
      if (!prefersStJohnsWortHolistic(input) || !Array.isArray(results)) return results;
      let preferred = results.find((candidate) => candidate && candidate.type === "holistic"
        && normalize(candidate.item && candidate.item.name) === "st johns wort");
      if (!preferred) {
        const fallback = baseOfflineLookupSuggestions("st johns wort", ...args);
        preferred = Array.isArray(fallback) ? fallback.find((candidate) => candidate && candidate.type === "holistic"
          && normalize(candidate.item && candidate.item.name) === "st johns wort") : null;
      }
      if (!preferred) return results;
      return [preferred, ...results.filter((candidate) => candidate !== preferred)];
    };
    window.offlineLookupSuggestions = offlineLookupSuggestions;
  }

  if (baseMakeModelEnhancedResponse) {
    makeModelEnhancedResponse = function (input = "", ...args) {
      if (isPriorActiveEmergency(input)) return baseMakeModelEnhancedResponse(input, ...args);
      if (isNewActiveEmergency(input)) return emergencyResponse();
      const target = canonicalTarget(input);
      if (!target) return baseMakeModelEnhancedResponse(input, ...args);
      const related = RELATED_TOPICS[target] || [];
      return {
        type: "pharm-database",
        query: target,
        detailType: "drug",
        openDetail: true,
        highlightQuery: String(input || ""),
        preface: "Opening **" + target + "** in ANI's toxicology decision reference. The entry separates specific antidotes from supportive, evidence-limited, or investigational rescue so the mechanism does not imply proof."
          + (related.length ? " Related topics: **" + related.join("**, **") + "**." : ""),
        originalQuery: String(input || "")
      };
    };
    window.makeModelEnhancedResponse = makeModelEnhancedResponse;
  }

  const routingTargets = Object.values(TARGETS);
  const routingContract = Object.freeze({
    positiveCases: POSITIVE_CASES,
    collisionCases: COLLISION_EXAMPLES,
    emergencyCases: EMERGENCY_EXAMPLES,
    benignCases: BENIGN_EXAMPLES,
    positiveCount: POSITIVE_CASES.length,
    collisionCount: COLLISION_EXAMPLES.length,
    emergencyCount: EMERGENCY_EXAMPLES.length,
    benignCount: BENIGN_EXAMPLES.length
  });

  if (window.ANI_ANTIDOTE_WAVE33) {
    window.ANI_ANTIDOTE_WAVE33.routingVersion = VERSION;
    window.ANI_ANTIDOTE_WAVE33.routingTargets = routingTargets.slice();
    window.ANI_ANTIDOTE_WAVE33.routingContract = {
      positiveCount: routingContract.positiveCount,
      collisionCount: routingContract.collisionCount,
      emergencyCount: routingContract.emergencyCount,
      benignCount: routingContract.benignCount
    };
  }

  window.ANI_ANTIDOTE_WAVE33_ROUTING = {
    schemaVersion: 1,
    version: VERSION,
    priorRoutingVersion: priorRouting && priorRouting.version || "",
    delegatesToWave32First: Boolean(window.ANI_ANTIDOTE_WAVE32_ROUTING),
    usesPrecomputedExactTargetMap: true,
    targets: TARGETS,
    routingTargets,
    relatedTopics: RELATED_TOPICS,
    routingContract,
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
