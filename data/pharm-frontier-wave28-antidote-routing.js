/* eslint-disable */
/* Wave 28: intelligent routing for newly expanded antidotes and extracorporeal toxicology rescue. */
(function () {
  "use strict";

  const VERSION = "2026-07-18-antidote-routing-v1";
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function" ? makeModelEnhancedResponse : null;
  const baseHighYieldDrugClueMatch = typeof highYieldDrugClueMatch === "function" ? highYieldDrugClueMatch : null;
  const priorRouting = window.ANI_ANTIDOTE_WAVE26_ROUTING || null;
  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const TARGETS = Object.freeze({
    dantrolene: "Dantrolene",
    potassiumIodide: "Potassium iodide for radioiodine thyroid blocking",
    wholeBowelIrrigation: "Whole bowel irrigation with polyethylene glycol-electrolyte solution",
    extracorporealOverview: "Extracorporeal treatment for poisoning",
    toxicAlcoholDialysis: "Hemodialysis for methanol and ethylene glycol poisoning",
    salicylateDialysis: "Hemodialysis for salicylate poisoning",
    lithiumDialysis: "Hemodialysis for lithium poisoning",
    metforminEctr: "Extracorporeal treatment for metformin poisoning",
    valproateEctr: "Extracorporeal treatment for valproate poisoning",
    methanolFolate: "Folic acid and leucovorin for methanol poisoning",
    hydrofluoricCalcium: "Calcium treatment for hydrofluoric acid exposure",
    tetanusImmuneGlobulin: "Tetanus immune globulin",
    phentolamine: "Phentolamine for norepinephrine extravasation",
    acceleratedElimination: "Cholestyramine and activated-charcoal accelerated elimination",
    raxibacumab: "Raxibacumab",
    obiltoxaximab: "Obiltoxaximab",
    anthraxImmuneGlobulin: "Anthrax immune globulin intravenous",
    blackWidowAntivenin: "Black widow spider antivenin",
    coralSnakeAntivenin: "North American Coral Snake Antivenin",
    ethanolAntidote: "Ethanol for toxic alcohol poisoning"
  });

  const RELATED_TOPICS = Object.freeze({
    [TARGETS.dantrolene]: ["Malignant hyperthermia", "Neuroleptic malignant syndrome"],
    [TARGETS.potassiumIodide]: ["Radiation emergency treatment", "Calcium DTPA and zinc DTPA"],
    [TARGETS.wholeBowelIrrigation]: ["Activated charcoal", "Extracorporeal treatment for poisoning"],
    [TARGETS.extracorporealOverview]: [TARGETS.toxicAlcoholDialysis, TARGETS.salicylateDialysis, TARGETS.lithiumDialysis],
    [TARGETS.toxicAlcoholDialysis]: ["Fomepizole", TARGETS.methanolFolate, TARGETS.ethanolAntidote],
    [TARGETS.salicylateDialysis]: ["Sodium bicarbonate", TARGETS.extracorporealOverview],
    [TARGETS.lithiumDialysis]: [TARGETS.extracorporealOverview, "Lithium toxicity"],
    [TARGETS.metforminEctr]: [TARGETS.extracorporealOverview, "Lactic acidosis"],
    [TARGETS.valproateEctr]: [TARGETS.extracorporealOverview, "Levocarnitine"],
    [TARGETS.methanolFolate]: ["Fomepizole", TARGETS.toxicAlcoholDialysis],
    [TARGETS.hydrofluoricCalcium]: ["Calcium gluconate", "Chemical burn"],
    [TARGETS.tetanusImmuneGlobulin]: ["Tetanus", "Tetanus vaccination"],
    [TARGETS.phentolamine]: ["Norepinephrine", "Extravasation injury"],
    [TARGETS.acceleratedElimination]: ["Leflunomide", "Teriflunomide"],
    [TARGETS.raxibacumab]: [TARGETS.obiltoxaximab, TARGETS.anthraxImmuneGlobulin],
    [TARGETS.obiltoxaximab]: [TARGETS.raxibacumab, TARGETS.anthraxImmuneGlobulin],
    [TARGETS.anthraxImmuneGlobulin]: [TARGETS.raxibacumab, TARGETS.obiltoxaximab],
    [TARGETS.blackWidowAntivenin]: ["Latrodectism", "Antivenom hypersensitivity"],
    [TARGETS.coralSnakeAntivenin]: ["Coral snake envenomation", "Respiratory failure"],
    [TARGETS.ethanolAntidote]: ["Fomepizole", TARGETS.toxicAlcoholDialysis]
  });

  const card = (name) => {
    const key = normalize(name);
    const drugs = (window.ANI_PHARM_DATABASE && window.ANI_PHARM_DATABASE.drugs) || [];
    const matches = drugs.filter((drug) => [drug.displayName, drug.name, drug.generic]
      .some((value) => normalize(value) === key));
    return matches.find((drug) => !drug.hidden && drug.studentFacing !== false) || matches[0] || null;
  };

  const isPriorActiveEmergency = (input = "") => Boolean(priorRouting
    && typeof priorRouting.isActiveToxicologicEmergency === "function"
    && priorRouting.isActiveToxicologicEmergency(input));

  const isNewActiveEmergency = (input = "") => {
    const text = normalize(input);
    const hazard = /\b(hydrofluoric acid|hydrogen fluoride|hf burn|coral snake|black widow|anthrax|methanol|ethylene glycol|antifreeze|toxic alcohol|radioactive iodine|radiation exposure|vasopressor extravasation|norepinephrine extravasation|malignant hyperthermia|dantrolene|neuroleptic malignant syndrome)\b/i.test(text);
    const crisisSyndrome = /\b(malignant hyperthermia|neuroleptic malignant syndrome)\b/i.test(text);
    const dantroleneMention = /\b(dantrolene|dantrium|revonto|ryanodex)\b/i.test(text);
    const severe = /\b(collapsed|collapsing|confused|unresponsive|weakness is spreading|trouble breathing|not breathing|seizing|seizure|shock|severe rigidity|very high temperature)\b/i.test(text);
    const recent = /\b(now|right now|currently|just|today|minutes? ago|hours? ago)\b/i.test(text);
    const exposureAction = /\b(spilled|splashed|drank|swallowed|inhaled|exposed|bitten|extravasated)\b/i.test(text);
    const personal = /\b(i|we|me|my|my patient|my child|my baby|my friend|our patient|someone here)\b/i.test(text);
    const directHelp = /\b(what should i do|what do we do|help|call 911|need dantrolene|need treatment)\b/i.test(text);
    const acuteCrisisLanguage = /\b(?:has|have|having|developed|developing|suspected|possible) (?:malignant hyperthermia|neuroleptic malignant syndrome)\b|\b(?:etco2|end tidal co2|hypercapnia|masseter spasm|generalized rigidity|anesthesia crisis|mh crisis|nms crisis)\b/i.test(text);
    const educationalChronicOrHistorical = /\b(study|studied|studying|learn|learned|learning|exam|quiz|homework|formulary|stocking|inventory|chronic|spasticity|prescribed|prescription|every day|daily|history of|previous|past episode|years? ago|months? ago|weeks? ago|long ago)\b/i.test(text);
    const unmistakablyCurrent = severe || exposureAction || acuteCrisisLanguage || /\b(right now|currently|just started|is developing|is happening)\b/i.test(text);
    const benignAcuteContext = educationalChronicOrHistorical && !unmistakablyCurrent;
    if (crisisSyndrome || dantroleneMention) {
      if (benignAcuteContext) return false;
      if (crisisSyndrome) return severe || directHelp || acuteCrisisLanguage || (recent && personal);
      return severe || acuteCrisisLanguage || directHelp;
    }
    return hazard && (severe || directHelp || (exposureAction && (personal || recent)));
  };

  const isActiveEmergency = (input = "") => isPriorActiveEmergency(input) || isNewActiveEmergency(input);

  const emergencyResponse = () => "**Possible active poisoning, chemical exposure, or envenomation:** Call 911 now for severe symptoms, breathing trouble, collapse, seizure, or rapidly worsening weakness. Call U.S. Poison Help at **1-800-222-1222** immediately for case-specific instructions. Move away from ongoing exposure only if it is safe, follow dispatcher decontamination instructions, do not induce vomiting or self-administer an antidote, and bring the product container or exposure details. Clinicians should activate emergency and toxicology protocols while airway, breathing, circulation, decontamination, monitoring, and toxin-specific treatment begin.";

  const educationalTarget = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (!text || isActiveEmergency(raw)) return "";
    const has = (pattern) => pattern.test(raw) || pattern.test(text);

    if (has(/\b(dantrolene|dantrium|revonto|ryanodex|dantroline|dantroline)\b/i)
      || (has(/\bmalignant hyperthermia\b/i) && has(/\b(antidote|drug|medication|treat|treatment|ryr1|calcium release)\b/i))) return TARGETS.dantrolene;

    if (has(/\bpotassium iodide\b/i)
      && has(/\b(dietary|supplement|hypothyroid|iodine deficiency|nutrition)\b/i)
      && !has(/\b(radiation|radioactive iodine|nuclear emergency|thyroid block)\b/i)) return "";
    if (has(/\b(potassium iodide|thyroshield|iosat|radioiodine thyroid block(?:ing)?|thyroid blocking iodine|stable iodine for radiation|ki radiation pill)\b/i)
      || (has(/\bki\b/i) && has(/\b(radiation|radioactive iodine|nuclear emergency|thyroid block)\b/i))) return TARGETS.potassiumIodide;

    if (has(/\b(whole bowel irrigation|whole bowel irigation|wbi for poisoning|polyethylene glycol electrolyte lavage for overdose|peg els for poisoning)\b/i)
      || (has(/\b(body packer|body stuffer|sustained release|extended release|enteric coated|iron|lithium|potassium)\b/i)
        && has(/\b(whole bowel|bowel irrigation|intestinal irrigation|peg electrolyte lavage)\b/i))) return TARGETS.wholeBowelIrrigation;

    if (has(/\b(methanol|ethylene glycol|antifreeze|toxic alcohol)\b/i) && has(/\b(dialysis|hemodialysis|haemodialysis|extracorporeal|ectr)\b/i)) return TARGETS.toxicAlcoholDialysis;
    if (has(/\b(salicylate|salicylates|aspirin)\b/i) && has(/\b(dialysis|hemodialysis|haemodialysis|extracorporeal|ectr)\b/i)) return TARGETS.salicylateDialysis;
    if (has(/\blithium\b/i)
      && has(/\b(dialysis|hemodialysis|haemodialysis|extracorporeal|ectr|rebound)\b/i)
      && (has(/\b(poison|toxicity|overdose|toxic|level|concentration|rebound)\b/i) || has(/\b(?:why|when|indication|criteria)\b/i))) return TARGETS.lithiumDialysis;
    if (has(/\b(metformin|biguanide)\b/i) && has(/\b(poison|toxicity|overdose|lactic acidosis|mala)\b/i) && has(/\b(dialysis|hemodialysis|extracorporeal|ectr|treatment)\b/i)) return TARGETS.metforminEctr;
    if (has(/\b(valproate|valproic acid|divalproex|depakote)\b/i) && has(/\b(poison|toxicity|overdose|hyperammonemia|cerebral edema)\b/i) && has(/\b(dialysis|hemodialysis|extracorporeal|ectr|treatment)\b/i)) return TARGETS.valproateEctr;
    if (has(/\b(extrip|extracorporeal treatment for poisoning|extracorporeal toxin removal|which poisons? (?:can be |are )?dialyz(?:ed|able)|dialyzable poisons|dialysis for poisoning overview)\b/i)) return TARGETS.extracorporealOverview;

    if (has(/\b(folic acid|folate|leucovorin|folinic acid|calcium folinate)\b/i)
      && has(/\b(methanol|formate|formic acid|wood alcohol)\b/i)) return TARGETS.methanolFolate;
    if (has(/\b(hydrofluoric acid|hydrogen fluoride|hydrofluoride|hf burn|fluoride burn)\b/i)
      && has(/\b(calcium|calcium gluconate|antidote|treatment|gel|infiltration|nebulized)\b/i)) return TARGETS.hydrofluoricCalcium;
    if (has(/\b(tetanus immune globulin|tetanus immunoglobulin|human tetanus immune globulin|hyper ?tet|tig for tetanus)\b/i)) return TARGETS.tetanusImmuneGlobulin;
    if (has(/\b(phentolamine|regitine|alpha blockade)\b/i)
      && has(/\b(norepinephrine|noradrenaline|vasopressor|extravasation|infiltration|ischemia)\b/i)) return TARGETS.phentolamine;
    if (has(/\b(leflunomide|teriflunomide|aubagio|arava)\b/i)
      && has(/\b(cholestyramine|activated charcoal|accelerated elimination|washout|drug elimination procedure|pregnancy elimination)\b/i)) return TARGETS.acceleratedElimination;

    if (has(/\b(raxibacumab|abthrax|raxibacimab)\b/i)) return TARGETS.raxibacumab;
    if (has(/\b(obiltoxaximab|anthim|obiltoxaximab)\b/i)) return TARGETS.obiltoxaximab;
    if (has(/\b(anthrax immune globulin intravenous|anthrax immune globulin|aigiv|anthrasil|anthrax ivig)\b/i)) return TARGETS.anthraxImmuneGlobulin;
    if (has(/\b(black widow (?:spider )?(?:antivenin|antivenom)|latrodectus antivenin|latrodectism antivenin|antivenin latrodectus mactans)\b/i)
      || (has(/\b(black widow|latrodectus|latrodectism)\b/i) && has(/\b(bites?|envenomation|treat|treated|treatment|management|antivenom)\b/i))) return TARGETS.blackWidowAntivenin;
    if (has(/\b(north american coral snake antivenin|coral snake antivenin|coral snake antivenom|micrurus fulvius antivenin|micrurus antivenin)\b/i)) return TARGETS.coralSnakeAntivenin;
    if (has(/\b(ethanol antidote|ethanol for toxic alcohol|ethanol infusion for methanol|ethanol infusion for ethylene glycol|alcohol dehydrogenase substrate therapy|ethanol as (?:an )?antidote)\b/i)
      || (has(/\bethanol\b/i) && has(/\b(methanol|ethylene glycol|toxic alcohol|antifreeze)\b/i) && has(/\b(antidote|fallback|fomepizole unavailable|adh)\b/i))) return TARGETS.ethanolAntidote;
    return "";
  };

  const canonicalTarget = (input = "") => educationalTarget(input);
  const match = (input = "") => {
    const target = canonicalTarget(input);
    return target ? card(target) : null;
  };

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
      if (isNewActiveEmergency(input)) return emergencyResponse();
      const target = canonicalTarget(input);
      if (!target) return baseMakeModelEnhancedResponse(input, ...args);
      const related = RELATED_TOPICS[target] || [];
      const relatedText = related.length ? " Related topics: **" + related.join("**, **") + "**." : "";
      return {
        type: "pharm-database",
        query: target,
        detailType: "drug",
        openDetail: true,
        highlightQuery: String(input || ""),
        preface: "Opening **" + target + "** in the toxicology reference." + relatedText,
        originalQuery: String(input || "")
      };
    };
    window.makeModelEnhancedResponse = makeModelEnhancedResponse;
  }

  const routingTargets = Array.from(new Set(Object.values(TARGETS)));
  if (window.ANI_ANTIDOTE_WAVE28) {
    window.ANI_ANTIDOTE_WAVE28.routingVersion = VERSION;
    window.ANI_ANTIDOTE_WAVE28.routingTargets = routingTargets.slice();
  }
  window.ANI_ANTIDOTE_WAVE28_ROUTING = {
    schemaVersion: 1,
    version: VERSION,
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
