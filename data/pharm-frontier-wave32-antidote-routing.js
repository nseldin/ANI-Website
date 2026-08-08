/* eslint-disable */
/* Wave 32: intelligent routing for antidote agents and cause-specific rescue pathways. */
(function () {
  "use strict";

  const VERSION = "2026-07-18-antidote-routing-wave32-v1";
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function" ? makeModelEnhancedResponse : null;
  const baseHighYieldDrugClueMatch = typeof highYieldDrugClueMatch === "function" ? highYieldDrugClueMatch : null;
  const baseExactPharmDetailCandidate = typeof exactPharmDetailCandidate === "function" ? exactPharmDetailCandidate : null;
  const priorRouting = window.ANI_ANTIDOTE_WAVE31_ROUTING
    || window.ANI_ANTIDOTE_WAVE30_ROUTING
    || window.ANI_ANTIDOTE_WAVE29_ROUTING
    || window.ANI_ANTIDOTE_WAVE28_ROUTING
    || window.ANI_ANTIDOTE_WAVE26_ROUTING
    || null;

  const normalize = (value) => String(value || "")
    .toLowerCase().replace(/[\u2019']/g, "").replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");

  const TARGETS = Object.freeze({
    naloxone: "Naloxone",
    nalmefene: "Nalmefene",
    sugammadex: "Sugammadex",
    neostigmine: "Neostigmine",
    varizig: "VARIZIG (varicella-zoster immune globulin)",
    hbig: "Hepatitis B immune globulin (HBIG)",
    digifab: "Digoxin immune Fab",
    bicarbonate: "Sodium bicarbonate",
    lipid: "Intravenous lipid emulsion",
    methyleneBlue: "Methylene blue",
    anticoagMap: "Anticoagulant-associated life-threatening bleeding reversal decision map",
    lastPath: "Local anesthetic systemic toxicity rescue pathway",
    sodiumChannelPath: "Sodium-channel blocker poisoning rescue pathway",
    digoxinPath: "Digoxin and cardiac-glycoside toxicity rescue pathway",
    nmbMap: "Neuromuscular blockade reversal decision map",
    magnesiumPath: "Magnesium sulfate toxicity and hypermagnesemia rescue",
    hyperkalemiaPath: "Acute hyperkalemia stabilization and potassium-removal pathway",
    varicellaPep: "Varicella postexposure prophylaxis decision pathway",
    hbvPep: "Hepatitis B postexposure prophylaxis decision pathway",
    bbCcbPath: "Beta-blocker and calcium-channel-blocker poisoning rescue pathway"
  });

  const POSITIVE_EXAMPLES = Object.freeze({
    [TARGETS.naloxone]: ["Rezenopy 10 mg", "Zimhi injection", "Rextovy OTC", "Narkan nasal spray", "RiVive 3 mg naloxone"],
    [TARGETS.nalmefene]: ["Zurnai", "Zurnai auto injector", "Opvee", "nalmefene nasal spray", "long acting opioid antagonist nalmefene"],
    [TARGETS.sugammadex]: ["sugammadex", "Bridion", "Bridian reversal", "sugamadex rocuronium", "vecuronium antidote sugammadex"],
    [TARGETS.neostigmine]: ["neostigmine reversal", "Bloxiverz", "Prostigmin anesthesia reversal", "Prevduo", "neostigmin nondepolarizing block"],
    [TARGETS.varizig]: ["Varizig", "VariZIG product", "VZIG immune globulin", "chickenpox immune globulin product", "varicella zoster immune globulin dose"],
    [TARGETS.hbig]: ["hepatitis B immune globulin", "HBIG shot", "HepaGam B", "HyperHEP B", "HB1G product"],
    [TARGETS.digifab]: ["DigiFab", "Digibind", "digoxin specific Fab", "digitalis antibody fragment", "dig tox fab antidote"],
    [TARGETS.bicarbonate]: ["sodium bicarbonate antidote", "NaHCO3 toxicology", "bicarb for wide QRS", "TCA antidote bicarbonate", "sodium bicarb injection poisoning"],
    [TARGETS.lipid]: ["intravenous lipid emulsion", "Intralipid rescue drug", "20 percent lipid emulsion antidote", "lipid sink therapy", "fat emulsion antidote"],
    [TARGETS.methyleneBlue]: ["methylene blue", "ProvayBlue", "Provyblue", "methylthioninium chloride antidote", "blue antidote for methemoglobin"],
    [TARGETS.anticoagMap]: ["blood thinner reversal decision map", "what reverses Eliquis major bleeding", "warfarin dabigatran heparin life threatening bleed decision map", "anticoagulent life threatening bleed", "Xarelto Pradaxa Coumadin reversal guide"],
    [TARGETS.lastPath]: ["local anesthetic systemic toxicity rescue", "LAST syndrome after nerve block", "bupivacaine seizure lipid pathway", "ropivacaine cardiovascular collapse", "lipid rescue after nerve block"],
    [TARGETS.sodiumChannelPath]: ["sodium-channel poisoning", "TCA overdose wide QRS pathway", "flecainide toxicity rescue", "amitriptyline overdose QRS", "cocaine wide complex toxicology"],
    [TARGETS.digoxinPath]: ["digoxin toxicity rescue pathway", "foxglove poisoning treatment", "oleander cardiac glycoside antidote guide", "digoxin bradycardia hyperkalemia", "how many DigiFab vials"],
    [TARGETS.nmbMap]: ["neuromuscular blockade reversal decision map", "Bridion versus neostigmine", "rocuronium vecuronium reversal choice", "residual neuromuscular block TOF", "paralysis reversal after surgery comparison"],
    [TARGETS.magnesiumPath]: ["magnesium toxicity rescue", "MgSO4 overdose", "NCLEX review of absent reflexes on magnesium sulfate", "preeclampsia magnesium respiratory depression", "calcium for hypermagnesemia"],
    [TARGETS.hyperkalemiaPath]: ["acute hyperkalemia emergency pathway", "peaked T wave high potassium", "sine wave hyperkalemia rescue", "insulin dextrose for potassium", "missed dialysis high potassium emergency"],
    [TARGETS.varicellaPep]: ["chickenpox immune globulin after exposure", "pregnant exposed to chickenpox", "varicella post exposure prophylaxis", "immunocompromised shingles exposure no immunity", "newborn chickenpox exposure pathway"],
    [TARGETS.hbvPep]: ["HBIG after needle stick", "newborn hepatitis B positive mother", "hepatitis B blood splash PEP", "anti HBs below 10 exposure", "HBIG and vaccine after exposure"],
    [TARGETS.bbCcbPath]: ["beta blocker overdose rescue", "calcium channel blocker overdose pathway", "verapamil diltiazem shock antidote", "amlodipine overdose high dose insulin", "propranolol overdose glucagon insulin" ]
  });

  const COLLISION_EXAMPLES = Object.freeze([
    "Naloxegol for opioid constipation", "Movantik medication guide", "naltrexone Vivitrol alcohol use disorder",
    "buprenorphine naloxone maintenance", "Suboxone film dosing", "myasthenia gravis neostigmine treatment",
    "myasthenia cholinergic crisis", "postoperative nausea after anesthesia", "general anesthesia stages",
    "succinylcholine pharmacology", "cisatracurium infusion", "TPN lipid calories", "parenteral nutrition fat emulsion",
    "fasting lipid panel", "triglyceride lab interpretation", "baking soda for heartburn", "baking soda recipe",
    "metabolic acidosis differential", "renal tubular acidosis", "chronic hyperkalemia diet", "potassium binder maintenance",
    "pseudohyperkalemia laboratory artifact", "hepatitis B vaccine schedule", "varicella vaccine schedule",
    "shingles vaccine Shingrix", "Andexanet alfa historical status", "why Andexxa was withdrawn",
    "ischemic stroke thrombolysis", "stroke anatomy", "intracerebral hemorrhage diagnosis",
    "fentanyl overdose now", "opioid withdrawal treatment", "hemodialysis overview", "peritoneal dialysis education",
    "Naloxone versus naloxegol", "pralidoxime organophosphate antidote", "hydroxocobalamin cyanide antidote",
    "fomepizole toxic alcohol antidote", "flumazenil benzodiazepine reversal", "vitamin K deficiency",
    "protamine exact drug card", "idarucizumab Praxbind drug card", "Kcentra product information",
    "digoxin therapeutic monitoring", "methylene blue stain microscopy", "blue dye chemistry",
    "magnesium deficiency replacement", "hypomagnesemia treatment", "calcium gluconate drug card",
    "hepatitis A immune globulin", "IVIG indications", "core needle biopsy",
    "localized shingles antiviral treatment", "chickenpox active disease acyclovir", "LAST menstrual period date"
  ]);

  const EMERGENCY_EXAMPLES = Object.freeze([
    "My friend just took fentanyl and is not breathing now",
    "My patient received Zurnai and is still unresponsive now",
    "Patient got Bridion and now has severe bradycardia and is collapsing",
    "Patient after surgery cannot breathe after rocuronium now",
    "Pregnant patient was just exposed to chickenpox what do we do now",
    "Newborn of hepatitis B positive mother needs help now",
    "My patient on digoxin has severe hyperkalemia and is in shock now",
    "I swallowed foxglove and feel faint right now",
    "Amitriptyline overdose with wide QRS and seizure now",
    "Flecainide overdose patient is hypotensive now",
    "Patient seized after bupivacaine nerve block and is collapsing now",
    "Ropivacaine injection patient has ventricular arrhythmia now",
    "My patient has methemoglobinemia and cannot breathe now",
    "Patient on magnesium sulfate lost reflexes and is barely breathing now",
    "Missed dialysis patient has sine wave hyperkalemia now",
    "My potassium is 7 and I have chest weakness right now",
    "Patient on apixaban has a brain bleed and is becoming unresponsive now",
    "My patient on warfarin is vomiting blood and collapsing now",
    "Propranolol overdose with shock and seizure now",
    "Verapamil overdose patient is hypotensive and bradycardic now",
    "My child swallowed extended release diltiazem minutes ago",
    "HBIG exposure patient has throat swelling after injection now",
    "VARIZIG patient is having anaphylaxis right now",
    "Methylene blue patient now has clonus fever and confusion",
    "My patient took a tricyclic antidepressant and has a wide QRS with hypotension right now"
  ]);

  const BENIGN_EXAMPLES = Object.freeze([
    "studying naloxone products for an exam", "nalmefene versus naloxone journal club",
    "sugammadex postoperative anesthesia protocol review", "neostigmine reversal simulation",
    "VARIZIG formulary education", "HBIG occupational health tabletop exercise",
    "past TCA overdose case study", "LAST checklist training scenario",
    "hyperkalemia algorithm lecture", "magnesium toxicity NCLEX review",
    "anticoagulant reversal policy draft", "beta blocker overdose conference presentation"
  ]);

  const FOCUSED_CALCIUM_DEFER_EXAMPLES = Object.freeze([
    "Why is calcium given first for hyperkalemia with ECG changes?",
    "Does calcium gluconate lower potassium in severe hyperkalemia?",
    "How does calcium chloride protect the heart when potassium is high?"
  ]);

  const POSITIVE_CASES = Object.entries(POSITIVE_EXAMPLES)
    .flatMap(([target, queries]) => queries.map((query) => Object.freeze({ query, target })));
  const exactTargetMap = new Map();
  Object.values(TARGETS).forEach((target) => exactTargetMap.set(normalize(target), target));
  POSITIVE_CASES.forEach(({ query, target }) => exactTargetMap.set(normalize(query), target));

  const dbCards = window.ANI_PHARM_DATABASE && Array.isArray(window.ANI_PHARM_DATABASE.drugs)
    ? window.ANI_PHARM_DATABASE.drugs : [];
  const cardIndex = new Map();
  dbCards.forEach((item) => {
    const names = [item && item.displayName, item && item.name, item && item.generic].map(normalize).filter(Boolean);
    names.forEach((name) => { if (!cardIndex.has(name) || item.antidoteWave32Revision) cardIndex.set(name, item); });
  });
  const card = (target) => cardIndex.get(normalize(target)) || null;

  const isClearlyEducational = (input = "") => {
    const text = normalize(input);
    const educational = /\b(study|studying|exam|nclex|quiz|lecture|class|course|journal club|case study|historical|history|review|simulation|scenario|tabletop|protocol draft|policy draft|formulary|conference|presentation|compare|comparison|mechanism|pharmacology|educational|training|pathway|decision map|guide|antidote)\b/i.test(text);
    const current = /\b(right now|currently|just now|just happened|just swallowed|just injected|just received|minutes? ago|hours? ago|need help now|what do (?:i|we) do now|call 911)\b/i.test(text);
    return educational && !current;
  };

  const isPriorActiveEmergency = (input = "") => {
    if (isClearlyEducational(input)) return false;
    return Boolean(priorRouting && typeof priorRouting.isActiveEmergency === "function" && priorRouting.isActiveEmergency(input));
  };

  const isEstablishedOpioidEmergency = (input = "") => {
    const opioidRouting = window.ANI_OPIOID_WAVE24_ROUTING;
    if (!opioidRouting || typeof opioidRouting.isActiveOpioidEmergency !== "function") return false;
    try {
      return Boolean(opioidRouting.isActiveOpioidEmergency(input));
    } catch (_error) {
      return false;
    }
  };

  const isNewActiveEmergency = (input = "") => {
    const text = normalize(input);
    if (!text || isClearlyEducational(input)) return false;
    const urgent = /\b(now|right now|currently|just|minutes? ago|hours? ago|need help|what do (?:i|we) do|emergency|call 911)\b/i.test(text);
    const personal = /\b(i|me|my|we|our|my child|my baby|my friend|my patient|patient|someone)\b/i.test(text);
    const severe = /\b(not breathing|cannot breathe|cant breathe|unable to breathe|inability to breathe|barely breathing|respiratory failure|unresponsive|seiz|collapse|collapsing|shock|hypotensive|bradycardic|arrhythmia|wide qrs|sine wave|peaked t waves?|brain bleed|vomiting blood|severe bleeding|throat swelling|anaphylaxis|clonus|fever|absent reflexes?|lost reflexes?|severe hyperkalemia|(?:potassium|k) is [67-9])\b/i.test(text);
    const acuteAction = /\b(overdose|overdosed|swallowed|took|injected|received|exposed|bleed|poison)\b/i.test(text);
    const hazard = /\b(naloxone|rezenopy|rextovy|zimhi|nalmefene|zurnai|opvee|fentanyl|heroin|opioid|sugammadex|bridion|neostigmine|prevduo|rocuronium|vecuronium|succinylcholine|cisatracurium|paralytic|varizig|varicella|chickenpox|hbig|hepagam b|hyperhep b|hepatitis b|hbv|digoxin|digifab|foxglove|oleander|methylene blue|provayblue|provyblue|methemoglobin(?:emia)?|lidocaine|bupivacaine|ropivacaine|local anesthetic|sodium channel|amitriptyline|tricyclic(?: antidepressant)?|tca|flecainide|magnesium|hypermagnesemia|hyperkalemia|potassium|warfarin|coumadin|apixaban|eliquis|rivaroxaban|dabigatran|pradaxa|heparin|beta blocker|calcium channel blocker|propranolol|metoprolol|carvedilol|verapamil|diltiazem|amlodipine)\b/i.test(text);
    const urgentExposure = /\b(?:newborn|pregnant|immunocompromised)\b.{0,120}\b(?:exposed|exposure|positive mother|hbsag positive|chickenpox|varicella|hepatitis b)\b/i.test(text);
    const pairedCrisis = (
      /\b(rezenopy|rextovy|zimhi)\b/i.test(text) && /\b(respiratory failure|unresponsive|not breathing|cannot breathe|unable to breathe)\b/i.test(text)
      || /\b(coumadin|eliquis|pradaxa)\b/i.test(text) && /\bvomiting blood\b/i.test(text)
      || /\blidocaine(?: injection)?\b/i.test(text) && /\b(seiz|collapse|collapsing)\b/i.test(text)
      || /\b(succinylcholine|cisatracurium)\b/i.test(text) && /\b(cannot breathe|cant breathe|unable to breathe|inability to breathe|not breathing|respiratory failure)\b/i.test(text)
      || /\b(provayblue|provyblue)\b/i.test(text) && /\b(clonus|fever)\b/i.test(text)
      || /\bhepagam b\b/i.test(text) && /\bthroat swelling\b/i.test(text)
      || /\bmagnesium\b/i.test(text) && /\b(absent reflexes?|lost reflexes?)\b/i.test(text)
      || /\b(?:potassium|k) is [67-9]\b/i.test(text) && /\bpeaked t waves?\b/i.test(text)
      || /\bcarvedilol\b/i.test(text) && /\boverdose\b/i.test(text) && /\bhypotensive\b/i.test(text)
    );
    return pairedCrisis
      || hazard && severe && (urgent || personal)
      || hazard && urgent && personal && acuteAction
      || hazard && urgent && urgentExposure;
  };

  const protectedPriorOrCollision = (text) => {
    const naloxoneTeachingIdentity = /\b(naloxone|narcan)\b/i.test(text);
    const recurrentOpioidToxicityTeaching = naloxoneTeachingIdentity
      && /\b(wear(?:s|ing)? off|wore off|return(?:s|ed|ing)?|recur(?:s|red|rence|rent)?|renarcotization|come back|comes back|again)\b/i.test(text)
      && /\b(respiratory depression|breathing|sedation|opioid (?:effect|effects|toxicity)|overdose)\b/i.test(text);
    const repeatNaloxoneTeaching = naloxoneTeachingIdentity
      && /\b(how often|when|frequency|interval|repeat(?:ed|ing)?|redose|re-dose|next dose|another dose|multiple doses)\b/i.test(text)
      && /\b(after|overdose|opioid|respiratory depression|response)\b/i.test(text);
    if (recurrentOpioidToxicityTeaching || repeatNaloxoneTeaching) return true;
    if (/\b(naloxegol|movantik|naltrexone|vivitrol|suboxone|buprenorphine naloxone)\b/i.test(text)) return true;
    if (/\b(pegylated naloxone|peg modified naloxone|pamora)\b/i.test(text) && /\b(opioid constipation|constipation|naloxone)\b/i.test(text)) return true;
    if (/\b(antimuscarinic|glycopyrrolate|atropine)\b/i.test(text) && /\b(neostigmine|paralytic reversal)\b/i.test(text)) return true;
    if (/\b(myasthenia|cholinergic crisis|ileus|urinary retention)\b/i.test(text)) return true;
    if (/\b(tpn|parenteral nutrition|lipid panel|triglyceride lab|fat calories)\b/i.test(text)) return true;
    if (/\b(baking soda|heartburn|recipe|renal tubular acidosis|metabolic acidosis differential)\b/i.test(text)) return true;
    if (/\b(chronic hyperkalemia|potassium diet|pseudohyperkalemia|binder maintenance)\b/i.test(text)) return true;
    if (/\b(hepatitis b vaccine schedule|varicella vaccine schedule|shingrix|shingles vaccine)\b/i.test(text)) return true;
    if (/\b(andexanet|andexxa)\b/i.test(text)) return true;
    if (/\b(ischemic stroke|stroke anatomy|intracerebral hemorrhage diagnosis|thrombolysis)\b/i.test(text)) return true;
    if (/\b(hemodialysis overview|peritoneal dialysis|dialysis education)\b/i.test(text)) return true;
    if (/\b(pralidoxime|hydroxocobalamin|fomepizole|flumazenil|vitamin k deficiency|protamine|idarucizumab|idarucizimab|praxbind|kcentra|four factor prothrombin complex concentrate|4f pcc|phytonadione|vitamin k1|mephyton|high dose insulin|high-dose insulin|hiet|glucagon)\b/i.test(text)) return true;
    if (/\b(hepatitis a immune globulin|ivig|core needle biopsy|methylene blue stain|blue dye chemistry|magnesium deficiency|hypomagnesemia|low magnesium|potassium binder|patiromer|veltassa)\b/i.test(text)) return true;
    if (/\b(last menstrual period|localized shingles antiviral|active chickenpox|digoxin therapeutic monitoring)\b/i.test(text)) return true;
    return false;
  };

  const patternTarget = (text) => {
    const has = (pattern) => pattern.test(text);

    const nmbDecision = has(/\b(neuromuscular block|paralysis reversal|residual block|train of four|tof|rocuronium|vecuronium|bridion|sugammadex|neostigmine)\b/i)
      && (has(/\b(decision|map|compare|versus|vs|choice|which|after surgery|postop|residual)\b/i)
        || has(/\b(rocuronium|vecuronium|neuromuscular block)\b/i)
          && has(/\breversal\b/i)
          && !has(/\b(bridion|sugammadex|neostigmine|bloxiverz|prevduo)\b/i));
    if (nmbDecision) return TARGETS.nmbMap;

    if (has(/\b(rezenopy|rezenopi|zimhi|zimhee|rextovy|rextovi|narcan|narkan|kloxxado|kloxado|rivive|ri vive)\b/i)) return TARGETS.naloxone;
    if (has(/\b(naloxone)\b/i) && !has(/\b(naloxegol|naltrexone|buprenorphine)\b/i)) return TARGETS.naloxone;
    if (has(/\b(opvee|opve|zurnai|zurnay|zurni|nalmefene)\b/i)) return TARGETS.nalmefene;
    if (has(/\b(sugammadex|sugamadex|suggamadex|bridion|bridian)\b/i)) return TARGETS.sugammadex;
    if (has(/\b(neostigmine|neostigmin|bloxiverz|prostigmin|prevduo|prev duo)\b/i)) return TARGETS.neostigmine;

    const varicellaPepIntent = has(/\b(varicella|chickenpox|shingles|herpes zoster|vzv)\b/i)
      && has(/\b(exposure|exposed|post exposure|postexposure|pep|pregnant|immunocompromised|newborn|no immunity)\b/i);
    if (varicellaPepIntent) return TARGETS.varicellaPep;
    if (has(/\b(varizig|vari zig|vzig|varicella zoster immune globulin|chickenpox immune globulin)\b/i)) return TARGETS.varizig;

    const hbvPepIntent = has(/\b(hepatitis b|hep b|hbv|hbsag|anti hbs|hbig)\b/i)
      && has(/\b(needle stick|needlestick|blood splash|exposure|exposed|post exposure|postexposure|pep|newborn|positive mother|positive person|sex exposure|sexual exposure|unprotected sex|sex with|vaccine after)\b/i);
    if (hbvPepIntent) return TARGETS.hbvPep;
    if (has(/\b(hbig|hb1g|hepagam b|hyperhep b|hepatitis b immune globulin|hep b immunoglobulin)\b/i)) return TARGETS.hbig;

    const anticoagIntent = has(/\b(anticoagulant|blood thinner|warfarin|coumadin|dabigatran|pradaxa|apixaban|eliquis|rivaroxaban|xarelto|edoxaban|heparin|enoxaparin|lovenox)\b/i)
      && has(/\b(reversal|reverse|antidote|major bleed|life threatening bleed|hemorrhage|what reverses|decision map|compare)\b/i);
    if (anticoagIntent) return TARGETS.anticoagMap;

    if (has(/\b((?:intravenous|iv) lipid emulsion|lipid emulsion|intralipid|asra lipid|lipid sink|lipid shuttle|fat emulsion antidote|20 percent lipid)\b/i)
      || has(/\bile\b/i) && has(/\b(last|local anesthetic|bupivacaine|ropivacaine|lidocaine)\b/i)) return TARGETS.lipid;
    const lastIntent = has(/\b(local anesthetic|local anaesthetic|bupivacaine|ropivacaine|lidocaine injection|last syndrome)\b/i)
      && has(/\b(systemic toxicity|seizure|collapse|rescue|lipid|poison|dysrhythmia|arrhythmia)\b/i);
    if (lastIntent) return TARGETS.lastPath;

    if (has(/\b(sodium bicarbonate|sodium bicarb|nahco3|bicarb)\b/i) && has(/\b(antidote|toxicology|wide qrs|cardiotoxic|rescue|poison|overdose|injection)\b/i)) return TARGETS.bicarbonate;
    const sodiumIntent = has(/\b(sodium channel|tca|tricyclic|amitriptyline|flecainide|propafenone|cocaine)\b/i)
      && has(/\b(overdose|poison|toxicity|wide qrs|cardiotoxic|rescue|treatment|pathway)\b/i);
    if (sodiumIntent) return TARGETS.sodiumChannelPath;

    if (has(/\b(digifab|digibind|digoxin specific fab|digitalis antibody|dig tox fab)\b/i)) return TARGETS.digifab;
    const digoxinInformationIntent = has(/\bdigoxin\b/i)
      && has(/\btoxicity\b/i)
      && has(/\b(why|cause|mechanism|yellow vision|vision|visual|xanthopsia|ecg|electrocardiogram|signs?|symptoms?|findings?)\b/i)
      && !has(/\b(rescue|pathway|antidote|treat(?:ment)?|overdose|poison|hyperkalemia|bradycardia|shock|unstable|life threatening|how many|vials)\b/i);
    if (digoxinInformationIntent) return "Digoxin";
    const digoxinPathIntent = has(/\b(digoxin|digitalis|foxglove|oleander|cardiac glycoside)\b/i)
      && (has(/\b(poison|overdose|rescue|pathway|antidote|treat(?:ment)?|hyperkalemia|bradycardia|how many|vials)\b/i)
        || has(/\btoxicity\b/i) && has(/\b(severe|life threatening|unstable|shock|arrhythmia|dysrhythmia|symptomatic|acute|chronic|fab)\b/i));
    if (digoxinPathIntent) return TARGETS.digoxinPath;

    if (has(/\b(methylene blue|provayblue|provyblue|methylthioninium|blue antidote)\b/i)) return TARGETS.methyleneBlue;

    const magnesiumIntent = has(/\b(magnesium|mgso4|hypermagnesemia)\b/i)
      && has(/\b(toxicity|overdose|absent reflex|respiratory depression|rescue|calcium|preeclampsia)\b/i);
    if (magnesiumIntent) return TARGETS.magnesiumPath;

    const hyperKIntent = has(/\b(hyperkalemia|high potassium|potassium is|peaked t|sine wave)\b/i)
      && has(/\b(acute|emergency|rescue|stabilization|insulin|dextrose|calcium|removal|pathway|peaked|sine wave|missed dialysis)\b/i);
    if (hyperKIntent) return TARGETS.hyperkalemiaPath;

    const bbCcbIntent = has(/\b(beta blocker|calcium channel blocker|propranolol|metoprolol|atenolol|sotalol|verapamil|diltiazem|amlodipine)\b/i)
      && has(/\b(overdose|poison|toxicity|shock|antidote|high dose insulin|glucagon|rescue|pathway)\b/i);
    if (bbCcbIntent) return TARGETS.bbCcbPath;
    return "";
  };

  const educationalTarget = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (!text || isPriorActiveEmergency(raw) || isNewActiveEmergency(raw)) return "";
    const exact = exactTargetMap.get(text);
    if (exact) return exact;
    const naloxegolIntent = /\b(pegylated naloxone|peg modified naloxone|naloxone conjugate|pamora)\b/i.test(text)
      && /\b(opioid constipation|constipation|naloxone)\b/i.test(text);
    if (naloxegolIntent) return "Naloxegol";
    const pairedAntimuscarinicIntent = /\b(antimuscarinic|glycopyrrolate|atropine)\b/i.test(text)
      && /\b(neostigmine|paralytic reversal)\b/i.test(text);
    if (pairedAntimuscarinicIntent) return "Glycopyrrolate";
    const anticoagulantComparisonCount = [
      /\b(heparin|enoxaparin|lovenox)\b/i,
      /\b(warfarin|coumadin)\b/i,
      /\b(dabigatran|pradaxa)\b/i,
      /\b(apixaban|eliquis|rivaroxaban|xarelto|edoxaban|factor xa)\b/i
    ].filter((pattern) => pattern.test(text)).length;
    const anticoagulantComparisonIntent = anticoagulantComparisonCount >= 2
      && (/\b(compare|comparison|versus|vs|difference)\b/i.test(text)
        || /\bwhich\b.{0,80}\b(antidote|reversal|matches?|for)\b/i.test(text)
        || /\b(antidote|reversal)\b.{0,80}\b(matches?|which|or)\b/i.test(text))
      && /\b(reversal|antidote)\b/i.test(text);
    if (anticoagulantComparisonIntent) return "Anticoagulant reversal mechanism comparison";
    const protamineIntent = /\bheparin\b/i.test(text)
      && /\b(positive charge|pulmonary hypertension|pushed fast|rapid push|rapid infusion)\b/i.test(text);
    if (protamineIntent) return "Protamine sulfate";
    const phytonadioneIntent = /\b(warfarin|coumadin)\b/i.test(text)
      && /\b(reversal vitamin|gamma carboxyl|factors? 2 7 9 (?:and )?10)\b/i.test(text);
    if (phytonadioneIntent) return "Phytonadione";
    const eltrombopagIntent = /\b(platelet|thrombopoietin|tpo)\b/i.test(text)
      && /\b(dairy|calcium|iron|magnesium|polyvalent cation|separated|spacing)\b/i.test(text)
      && /\b(pill|drug|medication|eltrombopag|promacta)\b/i.test(text);
    if (eltrombopagIntent) return "Eltrombopag";
    const clevidipineIntent = (/\b(clevidipine|cleviprex)\b/i.test(text)
      || /\b(?:iv|intravenous) calcium (?:channel )?blocker\b/i.test(text))
      && /\b(lipid emulsion|esterases?|esterase cleared)\b/i.test(text);
    if (clevidipineIntent) return "Clevidipine";
    const ccbComparisonCount = [
      /\b(amlodipine|norvasc)\b/i,
      /\b(verapamil)\b/i,
      /\b(diltiazem)\b/i,
      /\b(nifedipine)\b/i
    ].filter((pattern) => pattern.test(text)).length;
    const ccbOverdoseComparisonIntent = ccbComparisonCount >= 2
      && /\b(compare|comparison|versus|vs|difference)\b/i.test(text)
      && /\b(overdose|poison|toxicity|vasoplegia|bradycardia|insulin|shock)\b/i.test(text);
    if (ccbOverdoseComparisonIntent) return "Calcium channel blocker overdose physiology and rescue pathway";
    const potassiumBinderComparisonIntent = /\b(compare|comparison|versus|vs)\b/i.test(text)
      && /\b(patiromer|veltassa)\b/i.test(text)
      && /\b(sodium zirconium|lokelma)\b/i.test(text);
    if (potassiumBinderComparisonIntent) return "Modern potassium binders for chronic hyperkalemia";
    const patiromerIntent = /\b(patiromer|veltassa|calcium exchange|three hour spacing)\b/i.test(text)
      && /\b(potassium binder|potassium|magnesium)\b/i.test(text)
      && !/\b(compare|comparison|versus|vs|sodium zirconium|lokelma)\b/i.test(text);
    if (patiromerIntent) return "Patiromer";
    if (protectedPriorOrCollision(text)) return "";
    return patternTarget(text);
  };
  const canonicalTarget = (input = "") => educationalTarget(input);
  const match = (input = "") => {
    const target = canonicalTarget(input);
    return target ? card(target) : null;
  };
  const isActiveEmergency = (input = "") => {
    if (isClearlyEducational(input)) return false;
    if (isPriorActiveEmergency(input)) return true;
    if (isEstablishedOpioidEmergency(input)) return true;
    return isNewActiveEmergency(input);
  };
  const emergencyResponse = () => "**This may be an active poisoning, overdose, major bleeding, severe electrolyte emergency, postexposure emergency, or failure to breathe after anesthesia. Call 911 now** for breathing difficulty, collapse, seizure, shock, severe bleeding, dangerous rhythm, or rapidly worsening symptoms. For poisoning, call **U.S. Poison Help at 1-800-222-1222 now**. Support airway, breathing, and circulation; do not induce vomiting, give a home antidote, or attempt IV dosing from ANI. Clinicians should activate the appropriate toxicology, hemorrhage, anesthesia, obstetric, dialysis, infection-control, or extracorporeal-support pathway without delaying source control and resuscitation.";

  const RELATED_TOPICS = Object.freeze({
    [TARGETS.naloxone]: [TARGETS.nalmefene, "Opioid overdose", "Rescue breathing"],
    [TARGETS.nalmefene]: [TARGETS.naloxone, "Opioid overdose", "Acute opioid withdrawal"],
    [TARGETS.sugammadex]: [TARGETS.neostigmine, TARGETS.nmbMap, "Rocuronium"],
    [TARGETS.neostigmine]: [TARGETS.sugammadex, TARGETS.nmbMap, "Glycopyrrolate"],
    [TARGETS.varizig]: [TARGETS.varicellaPep, "Varicella", "Varicella vaccine"],
    [TARGETS.hbig]: [TARGETS.hbvPep, "Hepatitis B vaccine", "Occupational exposure"],
    [TARGETS.digifab]: [TARGETS.digoxinPath, "Digoxin", "Hyperkalemia"],
    [TARGETS.bicarbonate]: [TARGETS.sodiumChannelPath, "Tricyclic antidepressant poisoning", "QRS widening"],
    [TARGETS.lipid]: [TARGETS.lastPath, "Bupivacaine", "VA-ECMO"],
    [TARGETS.methyleneBlue]: ["Methemoglobinemia", "G6PD deficiency", "Serotonin syndrome"],
    [TARGETS.anticoagMap]: ["Kcentra", "Idarucizumab", "Protamine"],
    [TARGETS.lastPath]: [TARGETS.lipid, "Local anesthetics", "VA-ECMO"],
    [TARGETS.sodiumChannelPath]: [TARGETS.bicarbonate, "Seizure", "Toxicologic shock"],
    [TARGETS.digoxinPath]: [TARGETS.digifab, "Digoxin", "Cardiac glycosides"],
    [TARGETS.nmbMap]: [TARGETS.sugammadex, TARGETS.neostigmine, "Quantitative train-of-four"],
    [TARGETS.magnesiumPath]: ["Magnesium sulfate", "Calcium gluconate", "Hemodialysis"],
    [TARGETS.hyperkalemiaPath]: ["Calcium gluconate", "Insulin and dextrose", "Hemodialysis"],
    [TARGETS.varicellaPep]: [TARGETS.varizig, "Varicella vaccine", "Varicella"],
    [TARGETS.hbvPep]: [TARGETS.hbig, "Hepatitis B vaccine", "Anti-HBs"],
    [TARGETS.bbCcbPath]: ["High-dose insulin", "Glucagon", "VA-ECMO"]
  });

  if (baseExactPharmDetailCandidate) {
    exactPharmDetailCandidate = function (input = "", preferredType = "", ...args) {
      if (isNewActiveEmergency(input)) return null;
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
      if (isPriorActiveEmergency(input)) return baseMakeModelEnhancedResponse(input, ...args);
      if (isEstablishedOpioidEmergency(input)) return baseMakeModelEnhancedResponse(input, ...args);
      if (isNewActiveEmergency(input)) return emergencyResponse();
      if (typeof makeOfflineCalciumHyperkalemiaAnswer === "function") {
        const focusedCalciumAnswer = makeOfflineCalciumHyperkalemiaAnswer(input);
        if (focusedCalciumAnswer) return focusedCalciumAnswer;
      }
      const target = canonicalTarget(input);
      if (!target) return baseMakeModelEnhancedResponse(input, ...args);
      const related = RELATED_TOPICS[target] || [];
      const safety = target === TARGETS.anticoagMap
        ? " Andexanet alfa is historical in current U.S. care: sales ended and FDA approval was withdrawn in December 2025."
        : target === TARGETS.lastPath || target === TARGETS.lipid
          ? " LAST rescue requires a clinician checklist, ventilation, and early extracorporeal escalation when refractory."
          : target === TARGETS.naloxone || target === TARGETS.nalmefene
            ? " An opioid antagonist never replaces 911 activation, rescue breathing, repeat assessment, or observation for recurrence."
            : target === TARGETS.hyperkalemiaPath
              ? " Calcium stabilizes the heart but does not remove potassium; shifting therapy needs a removal plan and repeat glucose and potassium."
              : "";
      return {
        type: "pharm-database",
        query: target,
        detailType: "drug",
        openDetail: true,
        highlightQuery: String(input || ""),
        preface: "Opening **" + target + "** in ANI's antidote and rescue reference." + safety
          + (related.length ? " Related topics: **" + related.join("**, **") + "**." : ""),
        originalQuery: String(input || "")
      };
    };
    window.makeModelEnhancedResponse = makeModelEnhancedResponse;
  }

  const routingTargets = Array.from(new Set(Object.values(TARGETS)));
  const routingContract = Object.freeze({
    positiveCases: POSITIVE_CASES,
    collisionCases: COLLISION_EXAMPLES,
    emergencyCases: EMERGENCY_EXAMPLES,
    benignCases: BENIGN_EXAMPLES,
    focusedCalciumDeferCases: FOCUSED_CALCIUM_DEFER_EXAMPLES,
    positiveCount: POSITIVE_CASES.length,
    collisionCount: COLLISION_EXAMPLES.length,
    emergencyCount: EMERGENCY_EXAMPLES.length,
    benignCount: BENIGN_EXAMPLES.length,
    focusedCalciumDeferCount: FOCUSED_CALCIUM_DEFER_EXAMPLES.length
  });
  if (window.ANI_ANTIDOTE_WAVE32) {
    window.ANI_ANTIDOTE_WAVE32.routingVersion = VERSION;
    window.ANI_ANTIDOTE_WAVE32.routingTargets = routingTargets.slice();
    window.ANI_ANTIDOTE_WAVE32.routingContract = {
      positiveCount: routingContract.positiveCount,
      collisionCount: routingContract.collisionCount,
      emergencyCount: routingContract.emergencyCount,
      benignCount: routingContract.benignCount,
      focusedCalciumDeferCount: routingContract.focusedCalciumDeferCount
    };
  }
  window.ANI_ANTIDOTE_WAVE32_ROUTING = {
    schemaVersion: 1,
    version: VERSION,
    priorRoutingVersion: priorRouting && priorRouting.version || "",
    delegatesToWave31First: Boolean(window.ANI_ANTIDOTE_WAVE31_ROUTING),
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
