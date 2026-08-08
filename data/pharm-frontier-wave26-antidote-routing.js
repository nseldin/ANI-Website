/* eslint-disable */
/* Wave 26: high-priority antidote intent, collision, and emergency routing. */
(function () {
  "use strict";

  const VERSION = "2026-07-17-antidote-routing-v1";
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function"
    ? makeModelEnhancedResponse
    : null;
  const baseHighYieldDrugClueMatch = typeof highYieldDrugClueMatch === "function"
    ? highYieldDrugClueMatch
    : null;

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const TARGETS = Object.freeze({
    overview: "Antidotes and toxicologic rescue therapies",
    acetylcysteine: "Acetylcysteine",
    flumazenil: "Flumazenil",
    fomepizole: "Fomepizole",
    digoxinFab: "Digoxin immune Fab",
    hydroxocobalamin: "Hydroxocobalamin",
    nitriteThiosulfate: "Sodium nitrite and sodium thiosulfate",
    highDoseInsulin: "High-dose insulin euglycemia therapy",
    glucagon: "Glucagon",
    sodiumBicarbonate: "Sodium bicarbonate",
    lipidEmulsion: "Intravenous lipid emulsion",
    methyleneBlue: "Methylene blue",
    pyridoxine: "Pyridoxine",
    pralidoxime: "Pralidoxime",
    physostigmine: "Physostigmine",
    deferoxamine: "Deferoxamine",
    calciumEdta: "Calcium disodium EDTA",
    succimer: "Succimer",
    dimercaprol: "Dimercaprol",
    prussianBlue: "Prussian blue",
    dtpa: "Calcium DTPA and zinc DTPA",
    phytonadione: "Phytonadione",
    fourFactorPcc: "Four factor prothrombin complex concentrate",
    idarucizumab: "Idarucizumab",
    andexanet: "Andexanet alfa",
    botulismAntitoxin: "Botulism antitoxin",
    babyBig: "Botulism immune globulin intravenous",
    anavip: "ANAVIP",
    anascorp: "Anascorp",
    leucovorin: "Leucovorin",
    glucarpidase: "Glucarpidase",
    uridineTriacetate: "Uridine triacetate",
    dexrazoxane: "Dexrazoxane",
    cyproheptadine: "Cyproheptadine",
    dextrose50: "Dextrose 50%",
    carbonMonoxideOxygen: "Oxygen and hyperbaric oxygen for carbon monoxide poisoning",
    diphtheriaAntitoxin: "Diphtheria antitoxin",
    activatedCharcoal: "Activated charcoal"
  });

  const card = (name) => {
    const key = normalize(name);
    const drugs = (window.ANI_PHARM_DATABASE && window.ANI_PHARM_DATABASE.drugs) || [];
    const matches = drugs.filter((drug) => [drug.displayName, drug.name, drug.generic]
      .some((value) => normalize(value) === key));
    return matches.find((drug) => !drug.hidden && drug.studentFacing !== false) || matches[0] || null;
  };

  const isExplicitlyEducational = (input = "") => {
    const text = normalize(input);
    return /\b(study|studying|review|reviewing|nclex|exam|test question|practice question|quiz|case study|case report|hypothetical|fictional|simulation|simulated|scenario|vignette|assignment|for school|research paper|in this question|in this case|in general|mechanism|pathophysiology|compare|comparison|define|definition|overview|history of|historical)\b/i.test(text)
      || /\b(what is|what are|why is|why does|how does|explain|teach me|tell me about|which antidote|antidote for|treatment of|management of)\b/i.test(text);
  };

  const hasCollision = (input = "") => {
    const text = normalize(input);
    if (!text) return false;

    if (/\bnac\b/i.test(text)
      && /\b(network access control|network admission control|network|cybersecurity|firewall|switch|router|802 1x)\b/i.test(text)
      && !/\b(acetaminophen|paracetamol|tylenol|overdose|poison|medicine|liver|acetylcysteine)\b/i.test(text)) return true;
    if (/\bbal\b/i.test(text)
      && /\b(blood alcohol level|blood alcohol concentration|bac|ethanol level|alcohol test)\b/i.test(text)
      && !/\b(dimercaprol|arsenic|mercury|lead|chelat|lewisite)\b/i.test(text)) return true;
    if (/\bpcc\b/i.test(text)
      && /\b(police and crime commissioner|portland community college|community college|cement|construction|church)\b/i.test(text)
      && !/\b(warfarin|coumadin|bleed|hemorrhage|anticoagul|coagulation|factor)\b/i.test(text)) return true;
    if (/\bedta\b/i.test(text)
      && /\b(lavender|purple top|blood tube|specimen tube|laboratory tube|chelates calcium in tube|cosmetic|shampoo)\b/i.test(text)
      && !/\b(lead poison|chelation|calcium disodium|edetate calcium)\b/i.test(text)) return true;
    if (/\bdtpa\b/i.test(text)
      && /\b(renal scan|nuclear medicine scan|mag3|technetium|gadolinium|mri contrast|imaging agent)\b/i.test(text)
      && !/\b(plutonium|americium|curium|radiation|radioactive|decorporation|pentetate)\b/i.test(text)) return true;
    if (/\bbat\b/i.test(text)
      && /\b(baseball|softball|cricket|animal|mammal|cave|wing|vampire|flying)\b/i.test(text)
      && !/\b(botulism|botulinum|antitoxin|paralysis|toxin)\b/i.test(text)) return true;
    if (/\blast\b/i.test(text)
      && /\b(last week|last year|last time|last one|last name|last longer|at last)\b/i.test(text)
      && !/\b(local anesthetic|bupivacaine|lidocaine|ropivacaine|lipid rescue|systemic toxicity)\b/i.test(text)) return true;
    if (/\bdat\b/i.test(text)
      && /\b(direct antiglobulin|coombs|hemolysis|blood bank|data|digital audio tape)\b/i.test(text)
      && !/\b(diphtheria|antitoxin|pseudomembrane)\b/i.test(text)) return true;
    if (/\bco\b/i.test(text)
      && /\b(company|county|colorado|commanding officer|corrections officer|cobalt)\b/i.test(text)
      && !/\b(carbon monoxide|carboxyhemoglobin|smoke inhalation|heater|generator|garage|exhaust)\b/i.test(text)) return true;
    if (/\b(activated charcoal|activated carbon|charcoal)\b/i.test(text)
      && /\b(toothpaste|teeth whitening|face mask|skin care|skincare|barbecue|bbq|grill|filter|aquarium|pencil|drawing|art|artist|sketch)\b/i.test(text)
      && !/\b(poison|overdose|ingestion|decontamination|toxicology)\b/i.test(text)) return true;
    if (/\b(glucagon|glucagen)\b/i.test(text)
      && /\b(stimulation test|growth hormone test|diagnostic test|pituitary test)\b/i.test(text)
      && !/\b(overdose|poison|toxicity|hypoglycemia|antidote)\b/i.test(text)) return true;
    if (/\b(sodium bicarbonate|bicarbonate|bicarb)\b/i.test(text)
      && /\b(ckd|chronic kidney disease|renal tubular acidosis|chronic metabolic acidosis|dialysis bath|baking|cooking)\b/i.test(text)
      && !/\b(overdose|poison|toxicity|tca|tricyclic|qrs|salicylate|sodium channel blocker)\b/i.test(text)) return true;
    if (/\b(methylene blue|methlene blue)\b/i.test(text)
      && /\b(dye|stain|staining|textile|aquarium|fish tank|photography|coloring)\b/i.test(text)
      && !/\b(methemoglobin|methemoglobinemia|poison|toxicity|antidote)\b/i.test(text)) return true;
    if (/\b(pyridoxine|pyridoxin|vitamin b6|b6)\b/i.test(text)
      && /\b(pregnancy|pregnant|prenatal|morning sickness|nausea in pregnancy|supplement|deficiency|nutrition)\b/i.test(text)
      && !/\b(isoniazid|inh|overdose|poison|toxicity|antidote|seizure)\b/i.test(text)) return true;
    if (/\b(cyproheptadine|periactin)\b/i.test(text)
      && /\b(appetite|weight gain|allergy|allergies|migraine|itching)\b/i.test(text)
      && !/\b(serotonin syndrome|overdose|poison|toxicity|antidote)\b/i.test(text)) return true;
    if (/\b(dexrazoxane|zinecard)\b/i.test(text)
      && /\b(cardioprotection|cardioprotective|cardiomyopathy prevention|prevent heart damage|cumulative doxorubicin)\b/i.test(text)
      && !/\b(extravasation|overdose|poison|toxicity|antidote|totect)\b/i.test(text)) return true;
    if (/\b(vitamin k|phytonadione|phytomenadione)\b/i.test(text)
      && /\b(newborn|neonate|baby shot|birth dose|prophylaxis|vitamin k deficiency bleeding prevention)\b/i.test(text)
      && !/\b(warfarin|coumadin|anticoagul|bleed|hemorrhage|reversal|overdose|poison)\b/i.test(text)) return true;
    if (/\b(prussian blue|radiogardase)\b/i.test(text)
      && /\b(paint|painting|pigment|color|colour|art|artist|photograph|photography)\b/i.test(text)
      && !/\b(thallium|cesium|radioactive|poison|toxicity|antidote)\b/i.test(text)) return true;
    if (/\b(d50|nikon d50)\b/i.test(text)
      && /\b(nikon|camera|dslr|lens|photography|photo)\b/i.test(text)
      && !/\b(dextrose|glucose|hypoglycemia|blood sugar)\b/i.test(text)) return true;
    if (/\b(antifreeze|coolant)\b/i.test(text)
      && /\b(car|automotive|radiator|engine|vehicle|replace|replacement|buy|top off|leak repair|flush)\b/i.test(text)
      && !/\b(swallowed|drank|ingested|exposed|poison|toxicity|overdose|antidote)\b/i.test(text)) return true;
    if (/\b(carbon monoxide|co)\b/i.test(text)
      && /\b(detector|alarm|battery|install|installation|test button|building code)\b/i.test(text)
      && !/\b(exposure|poison|symptom|headache|dizzy|smoke|inhaled|emergency)\b/i.test(text)) return true;
    if (/\bhbo\b/i.test(text)
      && /\b(hbo max|television|tv|streaming|series|movie|movies)\b/i.test(text)
      && !/\b(hyperbaric|oxygen|carbon monoxide|treatment)\b/i.test(text)) return true;
    return false;
  };

  const hasToxicologicContext = (input = "") => {
    const text = normalize(input);
    return /\b(poison|poisoning|toxic|toxicity|overdose|overdosed|antidote|antitoxin|reversal|ingested|swallowed|drank|inhaled|exposed|exposure|extravasation|snakebite|snake bite|rattlesnake|copperhead|cottonmouth|scorpion sting|pesticide|insecticide|iron tablets?|smoke inhalation|carbon monoxide|cyanide|antifreeze|ethylene glycol|methanol|isoniazid|acetaminophen|paracetamol|tylenol|digoxin|benzodiazepine|beta blocker|calcium channel blocker|tricyclic|tca|organophosphate|nerve agent|anticholinergic|botulism|diphtheria|lead|arsenic|mercury|thallium|cesium|plutonium|americium|curium|warfarin|dabigatran|apixaban|rivaroxaban|edoxaban|5 fu|fluorouracil|capecitabine|methotrexate|anthracycline|serotonin syndrome|methemoglobinemia|local anesthetic systemic toxicity)\b/i.test(text);
  };

  const currentFactorXaBleeding = (input = "") => {
    const text = normalize(input);
    const factorXa = /\b(apixaban|eliquis|rivaroxaban|xarelto|edoxaban|savaysa|factor xa inhibitor|factor 10a inhibitor|anti xa)\b/i.test(text);
    const bleeding = /\b(bleed|bleeding|hemorrhage|haemorrhage|intracranial|ich|gi bleed|gastrointestinal bleed|major bleed|life threatening bleed|reverse|reversal)\b/i.test(text);
    const current = /\b(now|right now|current|currently|today|active|acute|ongoing|emergency|urgent|what should|how do i|how to|current treatment|available)\b/i.test(text);
    return factorXa && bleeding && current;
  };

  const isCcbPhysiologyTeachingIntent = (input = "") => {
    const text = normalize(input);
    if (!/\b(calcium channel blockers?|ccb|ccbs|verapamil|diltiazem|amlodipine)\b/i.test(text)
      || !/\b(overdose|toxicity|poisoning)\b/i.test(text)
      || !/\b(why|works?|mechanism|physiology|compare|comparison|versus|vs)\b/i.test(text)) return false;
    const physiologySignals = [
      /\bhyperglyc\w*\b/i,
      /\bvasopleg\w*\b/i,
      /\bbradycard\w*\b/i,
      /\bshock\b/i,
      /\b(?:high dose )?insulin\b/i,
      /\bcardiac output\b/i,
      /\binotrop\w*\b/i
    ].filter((pattern) => pattern.test(text)).length;
    return physiologySignals >= 2;
  };

  const shouldDeferToPriorEducationalRoute = (input = "") => {
    const text = normalize(input);
    const hypoglycemiaRescues = [
      /\b(oral glucose|glucose gel|table sugar)\b/i,
      /\bglucagon\b/i,
      /\b(iv dextrose|dextrose 50|d50)\b/i
    ].filter((pattern) => pattern.test(text)).length;
    if (/\b(hypoglyc\w*|low blood sugar|low sugar)\b/i.test(text) && hypoglycemiaRescues >= 2) return true;

    const anticoagulantGroups = [
      /\b(heparin|protamine)\b/i,
      /\b(warfarin|coumadin|vitamin k|phytonadione)\b/i,
      /\b(dabigatran|pradaxa|idarucizumab|praxbind)\b/i,
      /\b(apixaban|eliquis|rivaroxaban|xarelto|edoxaban|factor xa)\b/i
    ].filter((pattern) => pattern.test(text)).length;
    if (anticoagulantGroups >= 3
      && /\b(compare|comparison|which|matches?|versus|vs|difference|map)\b/i.test(text)) return true;

    if (/\b(nac|acetylcysteine|acetyl cysteine|n acetylcysteine)\b/i.test(text)
      && /\b(mucus|mucin|secretions?|mucolytic|thin mucus|disulfide)\b/i.test(text)
      && /\b(acetaminophen|paracetamol|tylenol|napqi|glutathione|liver)\b/i.test(text)) return true;

    if ((/\b(pyrimethamine|daraprim)\b/i.test(text)
        || (/\b(toxoplasmosis|toxoplasma|toxo)\b/i.test(text) && /\b(dhfr|dihydrofolate reductase)\b/i.test(text)))
      && /\b(leucovorin|folinic acid|calcium folinate)\b/i.test(text)
      && !/\b(methotrexate|glucarpidase|voraxaze|5 fu|fluorouracil|capecitabine)\b/i.test(text)) return true;

    if (/\b(cyclopentolate|cycloplegic|cycloplegia|cycloplegic refraction)\b/i.test(text)
      && /\b(child|children|pediatric|refraction|eye drop|ophthalmic)\b/i.test(text)
      && /\b(anticholinergic|antimuscarinic|delirium|mydriasis)\b/i.test(text)) return true;

    if (/\b(carbon monoxide|co formation|forms? co)\b/i.test(text)
      && /\b(volatile anesthetic|isoflurane|desflurane|sevoflurane|dry co2 absorbent|carbon dioxide absorbent)\b/i.test(text)) return true;
    return false;
  };

  const isActiveToxicologicEmergency = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (!text || hasCollision(raw)) return false;

    /* Opioid emergencies remain with the mature Wave24 naloxone/ventilation route. */
    if (/\b(opioid|opiate|fentanyl|heroin|oxycodone|hydrocodone|morphine|narcan|naloxone)\b/i.test(text)
      && !/\b(acetaminophen|paracetamol|tylenol|combination product)\b/i.test(text)) return false;

    const activeSeizure = /\b(seizing|status epilepticus|having (?:a )?seizures?|seizures? (?:now|right now|currently|after (?:taking|swallowing|an overdose)))\b/i.test(text);
    const severe = activeSeizure || /\b(unresponsive|unconscious|wont wake|will not wake|cant wake|cannot wake|not breathing|stopped breathing|barely breathing|gasping|turning blue|blue lips|collapsed|collapse|cardiac arrest|no pulse|shock|severe chest pain|major bleeding|bleeding heavily|vomiting blood|black stool|severe confusion|paralyzed|weakness is spreading)\b/i.test(text);
    const firstPersonOrDependent = /\b(i|ive|i have|i took|i swallowed|i drank|i inhaled|me|my child|my baby|my infant|my son|my daughter|my friend|my partner|my patient|someone here|we)\b/i.test(text);
    const recent = /\b(now|right now|currently|just|just now|minutes? ago|hours? ago|today|tonight|this morning|this afternoon|this evening|recently|happening)\b/i.test(text);
    const exposureAction = /\b(took|taken|swallowed|swallowing|drank|drinking|ingested|inhaled|breathed|injected|used|gave|received|spilled|splashed|bit|bitten|stung|overdosed|double dosed|too much|too many|entire bottle|unknown amount)\b/i.test(text);
    const concreteExcessDose = /\b(overdose|overdosed|double dosed|extra dose|too much|too many|entire bottle|whole bottle|handful|unknown amount|dose error|dosing error)\b/i.test(text);
    const directHelp = /\b(help|what should i do|what do i do|what should we do|should i call 911|call poison control|call poison help)\b/i.test(text);
    const educationalStatusSequence = activeSeizure
      && /\b(?:five|5)\s*minutes?\b/i.test(text)
      && /\b(benzodiazepine|lorazepam|midazolam|diazepam|benzo)\b/i.test(text)
      && /\b(why|first|sequence|timing|initial)\b/i.test(text)
      && !exposureAction
      && !firstPersonOrDependent
      && !directHelp;
    if (educationalStatusSequence) return false;
    const educationalCcbPhysiology = isCcbPhysiologyTeachingIntent(raw)
      && !exposureAction
      && !firstPersonOrDependent
      && !directHelp;
    if (educationalCcbPhysiology) return false;
    const activeFactorXaBleed = currentFactorXaBleeding(raw) && (firstPersonOrDependent || directHelp || severe);
    const environmentalCOEmergency = /\b(carbon monoxide|co) alarm\b/i.test(text)
      && /\b(headache|confusion|confused|dizzy|dizziness|nausea|faint|unconscious|symptoms?)\b/i.test(text);
    const urgent = severe || directHelp || activeFactorXaBleed || environmentalCOEmergency;
    const educational = isExplicitlyEducational(raw);

    if (educational && !urgent
      && (!firstPersonOrDependent || (!recent && !concreteExcessDose))) return false;
    if (!hasToxicologicContext(raw) && !activeFactorXaBleed) return false;
    if (severe) return true;
    if (activeFactorXaBleed || environmentalCOEmergency) return true;
    return exposureAction && (recent || firstPersonOrDependent || directHelp);
  };

  const historicalAndexanetIntent = (input = "") => {
    const text = normalize(input);
    return /\b(andexanet|andexxa)\b/i.test(text)
      && /\b(history|historical|withdrawn|withdrawal|why withdrawn|fda communication|former|used to|mechanism|what was|approval|2025|availability status)\b/i.test(text);
  };

  const educationalTarget = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (!text || hasCollision(raw) || isActiveToxicologicEmergency(raw)) return "";
    const has = (pattern) => pattern.test(raw) || pattern.test(text);

    if (has(/\b(antidote overview|antidote list|antidote chart|overdose antidotes|poisoning antidotes|nclex antidotes|toxicology rescue therapies|reversal agents overview|antidotes and toxicologic rescue therapies|main antidotes and toxicologic rescue therapies|poisoning antidote and reversal agent overview)\b/i)) return TARGETS.overview;

    /* Defer high-information CCB mechanism/comparison questions to the richer Wave13 physiology pathway. */
    if (isCcbPhysiologyTeachingIntent(raw) || shouldDeferToPriorEducationalRoute(raw)) return "";

    /* Six formerly wrong natural-language routes are intentionally first-class. */
    if (has(/\b(5[ -]?(?:fu|fluorouracil)|fluorouracil|capecitabine)\b/i)
      && has(/\b(overdose|overexposure|toxicity|antidote|early severe toxicity)\b/i)) return TARGETS.uridineTriacetate;
    if (has(/\b(anticholinergic delirium|antimuscarinic delirium|central anticholinergic syndrome|atropine delirium)\b/i)
      && has(/\b(antidote|treat|treatment|reversal|physostigmine)?\b/i)) return TARGETS.physostigmine;
    if (has(/\b(infant|baby|newborn)\b/i)
      && !has(/\b(non infant|noninfant|adult)\b/i)
      && has(/\b(botulism|botulinum)\b/i)) return TARGETS.babyBig;
    if (has(/\b(isoniazid|inh)\b/i) && has(/\b(overdose|toxicity|poisoning|seizure|seizures|antidote)\b/i)) return TARGETS.pyridoxine;
    if (has(/\b(beta blocker|propranolol|metoprolol|atenolol|carvedilol|labetalol)\b/i)
      && has(/\b(overdose|toxicity|poisoning|shock|antidote|bradycardia)\b/i)
      && !has(/\b(glucagon|glucagen|gvoke|baqsimi)\b/i)) return TARGETS.highDoseInsulin;
    if (has(/\b(ethylene glycol|antifreeze|methanol|toxic alcohol|windshield washer fluid)\b/i)
      && has(/\b(poison|poisoning|overdose|toxicity|ingestion|antidote|treatment)?\b/i)) return TARGETS.fomepizole;

    if (has(/\b(n[ -]?acetylcysteine|acetylcysteine|acetylcystine|acetadote|cetylev|mucomyst)\b/i)
      || (has(/\bnac\b/i) && has(/\b(acetaminophen|paracetamol|tylenol|overdose|liver|antidote)\b/i))
      || (has(/\b(acetaminophen|paracetamol|tylenol)\b/i) && has(/\b(overdose|poisoning|toxicity|antidote)\b/i))) return TARGETS.acetylcysteine;
    if (has(/\b(flumazenil|flumazanil|romazicon|benzodiazepine reversal|benzo antidote)\b/i)) return TARGETS.flumazenil;
    if (has(/\b(fomepizole|fomepazole|antizol|alcohol dehydrogenase inhibitor)\b/i)) return TARGETS.fomepizole;
    if (has(/\b(digoxin immune fab|digifab|digibind|digitalis antidote|digoxin antidote|cardiac glycoside antidote|oleander poisoning antidote)\b/i)) return TARGETS.digoxinFab;
    if (has(/\b(sodium nitrite|sodium thiosulfate|nithiodote|nitrite (?:and )?thiosulfate|cyanide antidote kit)\b/i)) return TARGETS.nitriteThiosulfate;
    if (has(/\b(hydroxocobalamin|hydroxocobolamin|cyanokit|hydroxycobalamin)\b/i)
      || (has(/\b(cyanide|smoke inhalation)\b/i) && has(/\b(antidote|poison|treatment|fire)\b/i))) return TARGETS.hydroxocobalamin;
    if (has(/\b(high dose (?:insulin|inslin)|high[ -]?dose (?:insulin|inslin) euglycemia|hyperinsulinemia euglycemia|hiet|hie therapy|hdi therapy)\b/i)
      || (has(/\b(calcium channel blocker|ccb|verapamil|diltiazem|amlodipine)\b/i) && has(/\b(overdose|toxicity|shock|antidote)\b/i))) return TARGETS.highDoseInsulin;
    if (has(/\b(glucagon|glucagen|gvoke|baqsimi)\b/i)) return TARGETS.glucagon;
    if (has(/\b(sodium bicarbonate|bicarbonate antidote|bicarb for|bicarb rescue|qrs widening|sodium channel blocker toxicity|sodium channel blocker cardiotoxicity|tricyclic overdose|tca overdose|salicylate alkalinization)\b/i)) return TARGETS.sodiumBicarbonate;
    if (has(/\b(intravenous lipid emulsion|iv lipid emulsion|lipid emulsion therapy|lipid emulsion response|asra lipid emulsion|lipid rescue|intralipid|local anesthetic systemic toxicity|local anesthetic toxicity|bupivacaine toxicity|ropivacaine toxicity)\b/i)
      || (has(/\blast\b/i) && has(/\b(local anesthetic|bupivacaine|lidocaine|ropivacaine|lipid)\b/i))) return TARGETS.lipidEmulsion;
    if (has(/\b(methylene blue|methlene blue|provayblue|methemoglobinemia antidote|methemoglobin antidote)\b/i)) return TARGETS.methyleneBlue;
    if (has(/\b(pyridoxine|pyridoxin|vitamin b6 antidote|inh antidote)\b/i)) return TARGETS.pyridoxine;
    if (has(/\b(pralidoxime|2[ -]?pam|protopam|organophosphate antidote|nerve agent antidote|oxime reactivation)\b/i)) return TARGETS.pralidoxime;
    if (has(/\b(physostigmine|antilirium|anticholinergic antidote|antimuscarinic antidote)\b/i)) return TARGETS.physostigmine;
    if (has(/\b(deferoxamine|desferal|iron poisoning antidote|iron chelator overdose)\b/i)) return TARGETS.deferoxamine;
    if (has(/\b(calcium disodium edta|edetate calcium disodium|calcium disodium versenate|ca ?na2 ?edta)\b/i)) return TARGETS.calciumEdta;
    if (has(/\b(succimer|chemet|dmsa)\b/i)) return TARGETS.succimer;
    if (has(/\b(dimercaprol|british anti lewisite|arsenic antidote|mercury antidote)\b/i)
      || (has(/\bbal\b/i) && has(/\b(lead|arsenic|mercury|chelat|lewisite)\b/i))) return TARGETS.dimercaprol;
    if (has(/\b(prussian blue|radiogardase|thallium antidote|cesium antidote)\b/i)) return TARGETS.prussianBlue;
    if (has(/\b(calcium dtpa|zinc dtpa|ca dtpa|zn dtpa|pentetate calcium trisodium|pentetate zinc trisodium|radiation decorporation)\b/i)
      || (has(/\bdtpa\b/i) && has(/\b(plutonium|americium|curium|radiation|radioactive|decorporation)\b/i))) return TARGETS.dtpa;
    if (has(/\b(phytonadione|phytomenadione|vitamin k1|vitamin k antidote|mephyton|aqua ?mephyton)\b/i)
      || text === "vitamin k") return TARGETS.phytonadione;
    if (has(/\b(four factor prothrombin complex concentrate|4f pcc|4 factor pcc|kcentra|balfaxar)\b/i)
      || (has(/\bpcc\b/i) && has(/\b(warfarin|coumadin|bleed|hemorrhage|anticoagul|reversal|factor)\b/i))) return TARGETS.fourFactorPcc;
    if (has(/\b(idarucizumab|idarucizimab|praxbind|dabigatran antidote|pradaxa reversal)\b/i)) return TARGETS.idarucizumab;
    if (historicalAndexanetIntent(raw)) return TARGETS.andexanet;
    if (has(/\b(apixaban|eliquis|rivaroxaban|xarelto|edoxaban|savaysa|factor xa inhibitor)\b/i)
      && has(/\b(bleed|bleeding|hemorrhage|reversal|antidote|reverse)\b/i)) return TARGETS.fourFactorPcc;
    if (has(/\b(andexanet|andexxa)\b/i)) return TARGETS.andexanet;
    if (has(/\b(botulism immune globulin intravenous|babybig|baby big|big iv)\b/i)) return TARGETS.babyBig;
    if (has(/\b(botulism antitoxin|heptavalent botulism antitoxin|heptavalent bat|botulism antitoxin heptavalent)\b/i)
      || (has(/\bbat\b/i) && has(/\b(botulism|botulinum|paralysis|toxin)\b/i))) return TARGETS.botulismAntitoxin;
    if (has(/\b(non infant|noninfant|adult|foodborne|wound)\b/i) && has(/\b(botulism|botulinum)\b/i)) return TARGETS.botulismAntitoxin;
    if (has(/\b(infant|baby|newborn)\b/i) && has(/\b(botulism|botulinum)\b/i)) return TARGETS.babyBig;
    if (has(/\b(anavip|crotalidae immune fab 2|crotalid fab 2|equine crotalid antivenom|equine f ab 2 rattlesnake antivenom)\b/i)
      || (has(/\b(equine|f ab 2|fab 2)\b/i) && has(/\b(rattlesnake|crotalid|pit viper|copperhead|cottonmouth)\b/i))) return TARGETS.anavip;
    if (has(/\b(anascorp|centruroides immune fab 2|scorpion antivenom|bark scorpion antivenom)\b/i)) return TARGETS.anascorp;
    if (has(/\b(glucarpidase|voraxaze|carboxypeptidase g2|methotrexate toxicity antidote|delayed methotrexate clearance)\b/i)) return TARGETS.glucarpidase;
    if (has(/\b(leucovorin|folinic acid|calcium folinate|wellcovorin|levoleucovorin|fusilev|khapzory|methotrexate rescue)\b/i)) return TARGETS.leucovorin;
    if (has(/\b(uridine triacetate|vistogard|fluorouracil antidote|5 fu antidote|capecitabine antidote)\b/i)) return TARGETS.uridineTriacetate;
    if (has(/\b(dexrazoxane|totect|zinecard|anthracycline extravasation antidote|doxorubicin extravasation)\b/i)) return TARGETS.dexrazoxane;
    if (has(/\b(cyproheptadine|periactin|serotonin syndrome antidote|serotonin antagonist toxicity)\b/i)) return TARGETS.cyproheptadine;
    if (has(/\b(dextrose 50|dextrose fifty|d50w?|50 percent dextrose|iv glucose|severe hypoglycemia iv)\b/i)) return TARGETS.dextrose50;
    if (has(/\b(carbon monoxide|carboxyhemoglobin|co poisoning|co exposure|hyperbaric oxygen|hbot|hbo treatment criteria|co chamber treatment|100 percent oxygen for smoke)\b/i)) return TARGETS.carbonMonoxideOxygen;
    if (has(/\b(diphtheria antitoxin|diptheria antitoxin|diphtheria antiserum|equine diphtheria antitoxin)\b/i)
      || (has(/\bdat\b/i) && has(/\b(diphtheria|pseudomembrane|toxin)\b/i))) return TARGETS.diphtheriaAntitoxin;
    if (has(/\b(activated charcoal|activated carbon|single dose charcoal|multiple dose charcoal|charcoal for overdose|poison charcoal|actidose|insta char|liqui char)\b/i)) return TARGETS.activatedCharcoal;
    return "";
  };

  const canonicalTarget = (input = "") => educationalTarget(input);
  const match = (input = "") => {
    const target = canonicalTarget(input);
    return target ? card(target) : null;
  };

  const emergencyResponse = (input = "") => {
    const severe = /\b(unresponsive|unconscious|wont wake|will not wake|not breathing|stopped breathing|barely breathing|gasping|turning blue|blue lips|seizure|seizing|collapsed|cardiac arrest|no pulse|shock|major bleeding|bleeding heavily)\b/i.test(normalize(input));
    const factorXa = currentFactorXaBleeding(input);
    const lead = severe
      ? "**Emergency - possible life-threatening poisoning or medication reaction:** Call 911 now."
      : "**Possible active poisoning or medication emergency:** Call U.S. Poison Help now at **1-800-222-1222** for case-specific instructions. Call 911 immediately if severe symptoms develop.";
    const poisonLine = severe
      ? " Also call U.S. Poison Help at **1-800-222-1222** as soon as the emergency response is underway."
      : "";
    const support = " If the person is unresponsive or not breathing normally, start dispatcher-guided CPR/rescue breathing and use an AED if available and trained. Do not delay ventilation, CPR, transport, or a time-critical antidote while searching the encyclopedia. Do not induce vomiting or give food, drink, medication, or activated charcoal unless Poison Help or the treating team directs it. Bring the product container or medication list and report the substance, amount, time, symptoms, age, weight, and co-exposures.";
    const clinician = " Clinicians should activate the emergency/toxicology protocol and contact a medical toxicologist or poison center while resuscitation, monitoring, and toxin-specific treatment begin.";
    const andexxa = factorXa
      ? " **U.S. availability note:** Andexanet alfa (Andexxa) was withdrawn from the U.S. market in December 2025; do not delay the current institutional major-bleeding pathway while seeking it. Current specialist protocols may use four-factor PCC or activated PCC according to patient and institutional factors."
      : "";
    return lead + poisonLine + support + clinician + andexxa;
  };

  if (baseHighYieldDrugClueMatch) {
    highYieldDrugClueMatch = function (input = "") {
      if (isActiveToxicologicEmergency(input)) return null;
      return match(input) || baseHighYieldDrugClueMatch(input);
    };
    window.highYieldDrugClueMatch = highYieldDrugClueMatch;
  }

  if (baseMakeModelEnhancedResponse) {
    makeModelEnhancedResponse = function (input = "", ...args) {
      if (isActiveToxicologicEmergency(input)) return emergencyResponse(input);
      const target = canonicalTarget(input);
      if (!target) return baseMakeModelEnhancedResponse(input, ...args);
      return {
        type: "pharm-database",
        query: target,
        detailType: "drug",
        openDetail: true,
        highlightQuery: String(input || ""),
        preface: "Opening **" + target + "** in the toxicology reference.",
        originalQuery: String(input || "")
      };
    };
    window.makeModelEnhancedResponse = makeModelEnhancedResponse;
  }

  const routingTargets = Array.from(new Set(Object.values(TARGETS)));
  if (window.ANI_ANTIDOTE_WAVE26) {
    window.ANI_ANTIDOTE_WAVE26.routingVersion = VERSION;
    window.ANI_ANTIDOTE_WAVE26.routingTargets = routingTargets;
  }

  window.ANI_ANTIDOTE_WAVE26_ROUTING = {
    version: VERSION,
    targets: TARGETS,
    routingTargets,
    match,
    canonicalTarget,
    educationalTarget,
    hasCollision,
    isCcbPhysiologyTeachingIntent,
    shouldDeferToPriorEducationalRoute,
    isActiveToxicologicEmergency,
    currentFactorXaBleeding,
    emergencyResponse
  };
}());
