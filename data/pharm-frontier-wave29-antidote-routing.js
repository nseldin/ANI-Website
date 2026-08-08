/* eslint-disable */
/* Wave 29: intelligent routing for antidote, reversal, and extracorporeal toxicology rescue. */
(function () {
  "use strict";

  const VERSION = "2026-07-18-antidote-routing-v1";
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function" ? makeModelEnhancedResponse : null;
  const baseHighYieldDrugClueMatch = typeof highYieldDrugClueMatch === "function" ? highYieldDrugClueMatch : null;
  const priorRouting = window.ANI_ANTIDOTE_WAVE28_ROUTING || window.ANI_ANTIDOTE_WAVE26_ROUTING || null;
  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const TARGETS = Object.freeze({
    crotalidaeFab: "Crotalidae immune Fab",
    protamine: "Protamine sulfate",
    octreotide: "Octreotide",
    levocarnitine: "Levocarnitine",
    atropine: "Atropine",
    pralidoxime: "Pralidoxime",
    activatedCharcoal: "Activated charcoal",
    calciumChloride: "Calcium chloride",
    calciumGluconate: "Calcium gluconate",
    hyaluronidase: "Hyaluronidase",
    cholinergicRescue: "Organophosphate and carbamate cholinergic-crisis rescue",
    vaEcmo: "VA-ECMO for refractory cardiotoxic poisoning",
    acetaminophenEctr: "Extracorporeal treatment for massive acetaminophen poisoning",
    carbamazepineEctr: "Extracorporeal treatment for carbamazepine poisoning",
    theophyllineEctr: "Extracorporeal treatment for theophylline poisoning",
    barbiturateEctr: "Extracorporeal treatment for long-acting barbiturate poisoning",
    baclofenEctr: "Extracorporeal treatment for baclofen toxicity",
    ascorbicMethemoglobin: "Ascorbic acid for methemoglobinemia"
  });

  const RELATED_TOPICS = Object.freeze({
    [TARGETS.crotalidaeFab]: ["ANAVIP", "North American Coral Snake Antivenin", "Antivenom hypersensitivity"],
    [TARGETS.protamine]: ["Unfractionated heparin", "Enoxaparin", "Andexanet alfa"],
    [TARGETS.octreotide]: ["Sulfonylurea poisoning", "Dextrose 50%"],
    [TARGETS.levocarnitine]: ["Extracorporeal treatment for valproate poisoning", "Hyperammonemia"],
    [TARGETS.atropine]: [TARGETS.pralidoxime, TARGETS.cholinergicRescue],
    [TARGETS.pralidoxime]: [TARGETS.atropine, TARGETS.cholinergicRescue],
    [TARGETS.activatedCharcoal]: ["Whole bowel irrigation with polyethylene glycol-electrolyte solution", TARGETS.carbamazepineEctr, TARGETS.theophyllineEctr],
    [TARGETS.calciumChloride]: [TARGETS.calciumGluconate, TARGETS.vaEcmo, "High-dose insulin euglycemia therapy"],
    [TARGETS.calciumGluconate]: [TARGETS.calciumChloride, "Calcium treatment for hydrofluoric acid exposure", "Magnesium toxicity"],
    [TARGETS.hyaluronidase]: ["Phentolamine for norepinephrine extravasation", "Dexrazoxane", "Extravasation injury"],
    [TARGETS.cholinergicRescue]: [TARGETS.atropine, TARGETS.pralidoxime, "Benzodiazepines"],
    [TARGETS.vaEcmo]: ["High-dose insulin euglycemia therapy", TARGETS.calciumChloride, "Intravenous lipid emulsion"],
    [TARGETS.acetaminophenEctr]: ["Acetylcysteine", "Acute liver failure", "Extracorporeal treatment for poisoning"],
    [TARGETS.carbamazepineEctr]: [TARGETS.activatedCharcoal, "Carbamazepine", "Extracorporeal treatment for poisoning"],
    [TARGETS.theophyllineEctr]: [TARGETS.activatedCharcoal, "Theophylline", "Extracorporeal treatment for poisoning"],
    [TARGETS.barbiturateEctr]: [TARGETS.activatedCharcoal, "Phenobarbital", "Extracorporeal treatment for poisoning"],
    [TARGETS.baclofenEctr]: ["Baclofen", "Kidney failure", "Extracorporeal treatment for poisoning"],
    [TARGETS.ascorbicMethemoglobin]: ["Methylene blue", "Methemoglobinemia", "Hyperbaric oxygen"]
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
    const educational = /\b(study|studying|learn|learning|exam|quiz|nclex|homework|case study|simulation|practice question|review article|guideline|protocol development|formulary|inventory|history of|past episode|previous episode|years? ago|months? ago|weeks? ago|long ago)\b/i.test(text);
    const anticoagulantChoiceCount = (text.match(/\b(heparin|enoxaparin|warfarin|dabigatran|apixaban|rivaroxaban|edoxaban)\b/gi) || []).length;
    const structuredMatchQuestion = anticoagulantChoiceCount >= 2
      && /\b(?:which|what) antidote (?:matches|goes with)|\bmatch (?:the )?(?:antidotes?|reversal agents?)\b/i.test(text);
    const unmistakablyCurrent = /\b(right now|currently|just now|just happened|just swallowed|just took|minutes? ago|hours? ago|need help now|what do (?:i|we) do now|call 911)\b/i.test(text);
    return (educational || structuredMatchQuestion) && !unmistakablyCurrent;
  };

  const isNewActiveEmergency = (input = "") => {
    const text = normalize(input);
    if (!text) return false;

    const urgentTime = /\b(now|right now|currently|just now|just happened|just swallowed|just took|minutes? ago|hours? ago|need help now|what do (?:i|we) do now|call 911)\b/i.test(text);
    if (isClearlyEducational(input)) return false;

    const hazard = /\b(rattlesnake|copperhead|cottonmouth|pit viper|snake bite|heparin|enoxaparin|lovenox|glipizide|glyburide|glimepiride|sulfonylurea|organophosphate|carbamate|nerve agent|pesticide|cholinesterase inhibitor|verapamil|diltiazem|amlodipine|calcium channel blocker|beta blocker|theophylline|aminophylline|vincristine|vinblastine|vinorelbine|paclitaxel|docetaxel|extravasation|acetaminophen|paracetamol|tylenol|carbamazepine|tegretol|phenobarbital|barbiturate|baclofen|dapsone|benzocaine|methemoglobinemia|methemoglobinaemia)\b/i.test(text);
    const personal = /\b(i|me|my|we|our|my child|my baby|my patient|our patient|patient here|someone here|farm worker|coworker|friend)\b/i.test(text);
    const exposureAction = /\b(bit|bite|bitten|swallowed|took|drank|ingested|overdosed|got too much|drenched|sprayed|splashed|spilled|inhaled|exposed|infusing|infiltrated|extravasated|extravasating)\b/i.test(text);
    const severe = /\b(bleeding|foaming|drooling|bronchorrhea|wet lungs|weak|weakness|paralyzed|sleepy|hard to wake|confused|unresponsive|not breathing|trouble breathing|cyanotic|blue lips|seizing|seizure|collapsed|collapsing|crashing|shock|refractory shock|bp is low|blood pressure is low|swelling is spreading|rapidly spreading|ventricular arrhythmia|cardiac arrest)\b/i.test(text);
    const activeGrammar = /\b(is|are|am) (bleeding|foaming|drooling|seizing|crashing|collapsing|extravasating|spreading|turning blue|not breathing)\b/i.test(text);
    const directHelp = /\b(help|what should (?:i|we) do|need an antidote|need ecmo|need dialysis|emergency|call poison control|call poison help)\b/i.test(text);

    const namedAcutePatterns = [
      /\b(?:bitten|bite|bit)\b.{0,80}\b(?:rattlesnake|copperhead|cottonmouth|pit viper)\b|\b(?:rattlesnake|copperhead|cottonmouth|pit viper)\b.{0,80}\b(?:bitten|bite|swelling is spreading|rapidly spreading)\b/i,
      /\b(?:heparin|enoxaparin|lovenox)\b.{0,80}\b(?:bleeding|got too much|overdose)\b/i,
      /\b(?:glipizide|glyburide|glimepiride|sulfonylurea)\b.{0,80}\b(?:swallowed|sleepy|hard to wake|hypoglyc|seiz)\b/i,
      /\b(?:organophosphate|carbamate|nerve agent|pesticide)\b.{0,100}\b(?:drenched|foaming|drooling|wet lungs|weak|paralyzed|seiz|not breathing)\b/i,
      /\b(?:verapamil|diltiazem|amlodipine|calcium channel blocker|beta blocker)\b.{0,100}\b(?:crashing|refractory shock|cardiac arrest|need ecmo)\b/i,
      /\b(?:theophylline|aminophylline)\b.{0,80}\b(?:seizing|seizure|shock|arrhythmia)\b/i,
      /\b(?:vincristine|vinblastine|vinorelbine|paclitaxel|docetaxel)\b.{0,80}\b(?:extravasating|extravasated|infiltrated)\b/i,
      /\b(?:acetaminophen|paracetamol|tylenol)\b.{0,100}\b(?:took|swallowed|bottle|confused|unresponsive|shock)\b/i,
      /\b(?:dapsone|benzocaine|methemoglobinemia|methemoglobinaemia)\b.{0,80}\b(?:cyanotic|turning blue|blue lips|confused|chest pain|seiz)\b/i
    ];
    const namedAcute = namedAcutePatterns.some((pattern) => pattern.test(text));
    return hazard && (
      activeGrammar
      || (namedAcute && (personal || urgentTime || activeGrammar || directHelp))
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

  const emergencyResponse = () => "**This may be an active poisoning, envenomation, or medication emergency. Call 911 now** for bleeding, seizure, breathing trouble, collapse, severe weakness, spreading swelling, shock, or rapidly worsening symptoms. Call **U.S. Poison Help at 1-800-222-1222 now** for case-specific instructions; clinicians should activate the local poison center and emergency/critical-care pathway. Move away from ongoing exposure only if safe, do not induce vomiting or give a home antidote, protect rescuers from contaminated clothing or secretions, and bring the container, medication list, or exposure details. Airway, breathing, circulation, decontamination, glucose, ECG, and toxin-specific treatment must begin without waiting for ANI educational content.";

  const educationalTarget = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (!text || isNewActiveEmergency(raw)) return "";
    const has = (pattern) => pattern.test(text);

    const snakeCollision = has(/\b(anavip|crotalidae immune f ab 2|f ab 2 antivenom|coral snake|scorpion|anasorp)\b/i);
    if (!snakeCollision && (
      has(/\b(crofab|crotalidae immune fab|crotalidae imune fab|crotalidae polyvalent immune fab|crotaline fab|snakebite fab)\b/i)
      || (has(/\b(copperhead|cottonmouth|rattlesnake|pit viper)\b/i) && has(/\b(antivenom|antivenin|recurrent bleeding|recurrent coagulopathy|fab fragments)\b/i))
    )) return TARGETS.crotalidaeFab;

    const insulinProtamineCollision = has(/\b(nph|neutral protamine hagedorn|insulin lispro protamine|protamine zinc insulin|insulin suspension)\b/i)
      && !has(/\b(heparin|enoxaparin|lovenox|anticoag|bleeding|reversal|reverse)\b/i);
    const broadHemostasisComparison = has(/\b(compare|comparison|versus|vs|difference)\b/i)
      && has(/\bprotamine\b/i)
      && has(/\b(factor replacement|factor viii|factor ix|antifibrinolytic|tranexamic|aminocaproic|vitamin k|phytonadione|prothrombin complex|pcc|idarucizumab|andexanet)\b/i);
    if (!insulinProtamineCollision && !broadHemostasisComparison && (
      has(/\b(protamine sulfate|heparin antidote|heparin reversal|ufh reversal|lovenox partial reversal|enoxaparin reversal|protamin sulfate)\b/i)
      || (has(/\bprotamine\b/i) && has(/\b(heparin|enoxaparin|lovenox|anti xa|anticoag|bleeding|reverse|reversal)\b/i))
    )) return TARGETS.protamine;

    if (has(/\b(glipizide|glyburide|glimepiride|sulfonylurea)\b/i)
      && has(/\b(octreotide|sandostatin|overdose|poison|rebound|hypoglyc|dextrose|insulin secretion|antidote|treatment)\b/i)) return TARGETS.octreotide;

    const valproateContext = has(/\b(valproate|valproic acid|divalproex|depakote)\b/i);
    const carnitineDirect = has(/\b(levocarnitine|l carnitine|carnitor|metabolic adjunct)\b/i);
    const valproateRescueIntent = has(/\b(overdose|poison(?:ing)?|toxicity|antidote|treatment|treat|management|rescue|what to give)\b/i)
      && has(/\b(hyperammon|ammonia|hepatotoxic|liver injury|coma|encephalopathy)\b/i);
    if (valproateContext && (carnitineDirect || valproateRescueIntent)) return TARGETS.levocarnitine;

    const cholinergicContext = has(/\b(organophosphate|organophospate|carbamate|nerve agent|cholinergic crisis|cholinesterase inhibitor|pesticide poisoning|sludge|dumbels|wet patient)\b/i);
    const atropineMention = has(/\b(atropine|atropen|muscarinic antidote)\b/i);
    const oximeMention = has(/\b(pralidoxime|pralidoxim|2 pam|protopam|oxime)\b/i);
    if (has(/^\s*(pralidoxime|pralidoxim|2 pam|protopam)\s*$/i)) return TARGETS.pralidoxime;
    if (cholinergicContext && (
      (atropineMention && oximeMention)
      || (!atropineMention && !oximeMention && has(/\b(rescue|treatment|treat|antidotes?|management|what to give|airway|decontamination)\b/i))
      || (has(/\b(sludge|dumbels|wet patient)\b/i) && has(/\b(pesticide|organophosphate|carbamate|rescue|treatment)\b/i))
    )) return TARGETS.cholinergicRescue;
    if (cholinergicContext && atropineMention) return TARGETS.atropine;
    if (cholinergicContext && oximeMention) return TARGETS.pralidoxime;

    const charcoalCollision = has(/\b(teeth whitening|tooth whitening|face mask|skin care|skincare|cosmetic|barbecue|bbq|grill|fuel|charcoal drawing|art charcoal)\b/i);
    if (!charcoalCollision && (
      has(/\b(single dose activated charcoal|multiple dose activated charcoal|multiple dose charcoal|multi dose charcoal|sdac|mdac|medical charcoal|activated charcoal for overdose|activated carbon for poisoning|charcol overdose treatment)\b/i)
      || (has(/\bactivated charcoal\b/i) && has(/\b(overdose|poison|ingestion|adsorb|decontamination|multiple dose|airway|aspiration|iron|lithium|alcohol|caustic|carbamazepine|theophylline)\b/i))
    )) return TARGETS.activatedCharcoal;

    const hfContext = has(/\b(hydrofluoric acid|hydrogen fluoride|hf burn|fluoride burn)\b/i);
    if (!hfContext && has(/\b(calcium chloride|cacl2|calcium cloride)\b/i)
      && has(/\b(verapamil|diltiazem|amlodipine|calcium channel blocker|ccb|beta blocker|overdose|poison|magnesium toxicity|hyperkalemia|membrane stabil|elemental calcium|extravasation|tissue necrosis)\b/i)) return TARGETS.calciumChloride;
    if (!hfContext && has(/\b(calcium gluconate|calcium gluconat|magnesium sulfate antidote|magnesium toxicity calcium)\b/i)
      && has(/\b(magnesium|verapamil|diltiazem|amlodipine|calcium channel blocker|ccb|overdose|poison|hyperkalemia|membrane stabil|elemental calcium|extravasation|tissue necrosis|antidote)\b/i)) return TARGETS.calciumGluconate;

    const wrongHyaluronidaseContext = has(/\b(dermal filler|hyaluronic acid filler|ophthalmic|retrobulbar|subcutaneous fluids?|hypodermoclysis|norepinephrine|noradrenaline|vasopressor|anthracycline|doxorubicin)\b/i);
    if (!wrongHyaluronidaseContext && (
      has(/\b(hyaluronidase|hylenex|amphadase|vitrase|hyaluronadase)\b/i)
      && has(/\b(extravasation|infiltration|vincristine|vinblastine|vinorelbine|vinca|paclitaxel|docetaxel|taxane|chemotherapy)\b/i)
    )) return TARGETS.hyaluronidase;
    if (!wrongHyaluronidaseContext && has(/\b(vincristine|vinblastine|vinorelbine|vinca|vinca alkaloid|paclitaxel|docetaxel|taxane)\b/i)
      && has(/\b(extravasat(?:ed|ing|ion)|infiltrat(?:ed|ing|ion))\b/i)) return TARGETS.hyaluronidase;

    const poisoningContext = has(/\b(overdose|poison|toxicity|toxic|ingestion|cardiotoxic)\b/i);
    if (has(/\b(va ecmo|venoarterial ecmo|ecls|extracorporeal life support|ecmo)\b/i)
      && poisoningContext
      && has(/\b(refractory|cardiogenic|shock|cardiac arrest|arrhythmia|amlodipine|verapamil|diltiazem|calcium channel blocker|beta blocker|sodium channel)\b/i)) return TARGETS.vaEcmo;

    const ectrMention = has(/\b(dialysis|hemodialysis|haemodialysis|extracorporeal|ectr|extrip|hemoperfusion)\b/i);
    if (ectrMention && has(/\b(acetaminophen|paracetamol|tylenol|apap)\b/i)
      && has(/\b(overdose|poison|massive|lactic|acidosis|mitochondrial|coma|shock|nac|acetylcysteine|dialysis)\b/i)) return TARGETS.acetaminophenEctr;
    if (ectrMention && has(/\b(carbamazepine|tegretol|carbamazapine)\b/i)
      && has(/\b(overdose|poison|toxicity|coma|seizure|arrhythmia|rising level|mdac|multiple dose charcoal|dialysis)\b/i)) return TARGETS.carbamazepineEctr;
    if ((ectrMention || (isClearlyEducational(raw) && has(/\b(seizure|seizing|arrhythmia|shock)\b/i)))
      && has(/\b(theophylline|aminophylline|theophyline)\b/i)
      && has(/\b(overdose|poison|toxicity|seizure|seizing|arrhythmia|shock|rising level|mdac|multiple dose charcoal|dialysis)\b/i)) return TARGETS.theophyllineEctr;
    if (ectrMention && has(/\b(phenobarbital|phenobarbitone|phenobarbitol|long acting barbiturate|barbiturate poisoning)\b/i)
      && has(/\b(overdose|poison|toxicity|coma|shock|persistent|ventilat|mdac|multiple dose charcoal|dialysis)\b/i)) return TARGETS.barbiturateEctr;
    if (ectrMention && has(/\b(baclofen|lioresal|baclofin)\b/i)
      && has(/\b(overdose|poison|toxicity|kidney|renal|coma|ventilat|acute|therapeutic|normal kidneys|dialysis)\b/i)) return TARGETS.baclofenEctr;

    const vitaminCollision = has(/\b(scurvy|dietary supplement|nutrition|common cold|skin care|collagen|iron absorption|daily vitamin)\b/i);
    if (!vitaminCollision && (
      (has(/\b(ascorbic acid|ascorbate|vitamin c)\b/i) && has(/\b(methemoglobin|methemoglobinemia|methemoglobinaemia|methylene blue alternative|ferric hemoglobin)\b/i))
      || (has(/\bmethemoglobinemia|methemoglobinaemia\b/i) && has(/\b(methylene blue contraindicated|methylene blue unavailable|g6pd alternative)\b/i))
    )) return TARGETS.ascorbicMethemoglobin;

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
      if (isNewActiveEmergency(input)) return emergencyResponse();
      const target = canonicalTarget(input);
      if (isPriorActiveEmergency(input) && !isClearlyEducational(input) && !target) return baseMakeModelEnhancedResponse(input, ...args);
      if (!target) return baseMakeModelEnhancedResponse(input, ...args);
      const related = RELATED_TOPICS[target] || [];
      const relatedText = related.length ? " Related topics: **" + related.join("**, **") + "**." : "";
      const safetyText = target === TARGETS.baclofenEctr
        ? " This card preserves the key distinction between kidney-impaired therapeutic accumulation and acute overdose with normal kidneys."
        : target === TARGETS.acetaminophenEctr
          ? " This is a rare massive-poisoning pathway; NAC remains the standard antidote and continues during ECTR."
          : "";
      return {
        type: "pharm-database",
        query: target,
        detailType: "drug",
        openDetail: true,
        highlightQuery: String(input || ""),
        preface: "Opening **" + target + "** in the toxicology reference." + safetyText + relatedText,
        originalQuery: String(input || "")
      };
    };
    window.makeModelEnhancedResponse = makeModelEnhancedResponse;
  }

  const routingTargets = Array.from(new Set(Object.values(TARGETS)));
  if (window.ANI_ANTIDOTE_WAVE29) {
    window.ANI_ANTIDOTE_WAVE29.routingVersion = VERSION;
    window.ANI_ANTIDOTE_WAVE29.routingTargets = routingTargets.slice();
  }
  window.ANI_ANTIDOTE_WAVE29_ROUTING = {
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
