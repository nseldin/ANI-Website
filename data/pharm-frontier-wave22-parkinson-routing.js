/* eslint-disable */
/* High-priority offline intent routing for the Parkinson causal study wave. */
(function () {
  if (typeof highYieldDrugClueMatch !== "function") return;

  const baseHighYieldDrugClueMatch = highYieldDrugClueMatch;
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function" ? makeModelEnhancedResponse : null;
  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const card = (name) => {
    const target = normalize(name);
    const drugs = (window.ANI_PHARM_DATABASE && window.ANI_PHARM_DATABASE.drugs) || [];
    return drugs.find((drug) => normalize(drug.generic || drug.name || drug.displayName) === target)
      || drugs.find((drug) => normalize(drug.name || drug.displayName) === target)
      || null;
  };

  const countSignals = (input, patterns) => patterns.reduce((count, pattern) => count + (pattern.test(input) ? 1 : 0), 0);

  const wave22Match = (input = "") => {
    const text = String(input || "");
    const has = (pattern) => pattern.test(text);
    const agonistSignals = countSignals(text, [
      /\b(pramipexole|mirapex)\b/i,
      /\b(ropinirole|requip)\b/i,
      /\b(rotigotine|neupro)\b/i,
      /\b(apomorphine|apokyn|onapgo|kynmobi)\b/i
    ]);
    const adjunctSignals = countSignals(text, [
      /\b(mao[- ]?b|selegiline|rasagiline|safinamide)\b/i,
      /\b(comt|entacapone|opicapone|tolcapone)\b/i,
      /\b(amantadine|gocovri|osmolex)\b/i,
      /\b(a2a|adenosine|istradefylline|nourianz)\b/i
    ]);

    if ((has(/\b(parkinson(?:s| disease)?|parkinsonism)\b/i)
      && has(/\b(basal ganglia|direct pathway|indirect pathway|substantia nigra|striatum|dopamine circuit|movement circuit|why.*(?:slow|rigid|tremor)|bradykinesia.*(?:why|mechanism))\b/i))
      || (has(/\b(direct|indirect) pathway\b/i) && has(/\b(dopamine|d1|d2|movement)\b/i))
      || (has(/\bsubstantia nigra\b/i) && has(/\bdopamine\b/i) && has(/\b(bradykinesia|slow|rigid|movement)\b/i))) {
      return card("Parkinson basal-ganglia dopamine circuit and symptom map");
    }
    if (has(/\b(?:levodopa|parkinson) adjunct\b/i)
      && has(/\b(off time|wear(?:ing)?[- ]off|dyskinesia|which|choose|compare)\b/i)) {
      return card("Parkinson adjunct comparison: MAO-B, COMT, amantadine, and A2A");
    }
    if (has(/\b(?:transdermal|dopamine agonist)?\s*patch\b/i)
      && has(/\b(heat|external heat|sunlight|mri|cardioversion|aluminum|application site|continuous)\b/i)) return card("Rotigotine");
    if (has(/\b(?:sudden|acute|intermittent|unpredictable)?\s*off episodes?\b/i)
      && has(/\b(subcutaneous|rescue|ondansetron|5[- ]?ht3|injection|pump)\b/i)) return card("Apomorphine");
    if (has(/\bperipheral COMT\b/i)
      && has(/\b(each|every|levodopa dose|orange|brown|urine|diarrhea)\b/i)) return card("Entacapone");
    if (has(/\bCOMT\b/i) && has(/\b(boxed|fatal|liver failure|hepatotoxic|fulminant)\b/i)) return card("Tolcapone");
    if (has(/\bMAO[- ]?B\b/i) && has(/\b(amphetamine|methamphetamine|insomnia|Zelapar|Eldepryl)\b/i)) return card("Selegiline");
    if (has(/\b(carbidopa|levodopa|sinemet|rytary|duopa)\b/i)
      && has(/\b(absorb|absorption|protein|meal|amino acid|blood brain|wear(?:ing)? off|on off|dose failure|delayed on|dyskinesia|carbidopa.*why|why.*carbidopa|peripheral decarboxylase|timing)\b/i)) {
      return card("Carbidopa/levodopa absorption, wearing-off, on-off, and dyskinesia");
    }
    if ((agonistSignals >= 2 && has(/\b(compare|comparison|versus|vs|difference|which|route|onset)\b/i))
      || (has(/\bdopamine agonists?\b/i) && has(/\b(compare|route|patch|rescue|oral|sleep attacks?|gambl\w*|impulse|compulsive|hallucinations?|withdrawal|adverse)\b/i))) {
      return card("Dopamine agonist route, onset, and adverse-effect comparison");
    }
    if ((adjunctSignals >= 2 && has(/\b(compare|comparison|versus|vs|difference|which|adjunct|wear(?:ing)? off)\b/i))
      || (has(/\b(parkinson adjunct|levodopa adjunct)\b/i)
        && has(/\b(mao|comt|amantadine|a2a|adenosine|compare|choose)\b/i))) {
      return card("Parkinson adjunct comparison: MAO-B, COMT, amantadine, and A2A");
    }

    if (has(/\b(carbidopa[ /-]*levodopa|levodopa[ /-]*carbidopa|sinemet|rytary|duopa|dhivy|parcopa|carbadopa|carbidopa|levadopa|levadopa)\b/i)) return card("Carbidopa/levodopa");
    if (has(/\b(pramipexole|mirapex|pramipexol|pramiprexole|pramipexol)\b/i)) return card("Pramipexole");
    if (has(/\b(ropinirole|requip|ropinerole|ropinorole|ropinrole)\b/i)) return card("Ropinirole");
    if (has(/\b(rotigotine|neupro|rotigitine|rotigotine patch)\b/i)) return card("Rotigotine");
    if (has(/\b(apomorphine|apokyn|onapgo|kynmobi|apomorphone|apomorfin)\b/i)) return card("Apomorphine");
    if (has(/\b(selegiline|eldepryl|zelapar|emsam|selegeline|selegilin)\b/i)) return card("Selegiline");
    if (has(/\b(rasagiline|azilect|rasagaline|rasagilin)\b/i)) return card("Rasagiline");
    if (has(/\b(safinamide|xadago|safinimide|safinamid)\b/i)) return card("Safinamide");
    if (has(/\b(entacapone|comtan|entacapon|entacopone)\b/i)) return card("Entacapone");
    if (has(/\b(opicapone|ongentys|opicapon|ongentis)\b/i)) return card("Opicapone");
    if (has(/\b(tolcapone|tasmar|tolcapon|tolcopone)\b/i)) return card("Tolcapone");
    if (has(/\b(amantadine|symmetrel|gocovri|osmolex|amantidine|amantadin)\b/i)) return card("Amantadine");
    if (has(/\b(istradefylline|nourianz|istradefiline|istradefyllin)\b/i)) return card("Istradefylline");
    return null;
  };

  const conceptTarget = (input = "") => {
    const text = String(input || "");
    const has = (pattern) => pattern.test(text);
    if (has(/\bpharmacodynamics?\b/i)
      || has(/\bwhat (?:a|the) drug does to (?:a|the) body\b/i)
      || has(/\bdrug response (?:at|through) (?:a )?receptor\b/i)) {
      return "Pharmacodynamics";
    }
    if (has(/\bPD\b/)
      && has(/\b(tremor|bradykinesia|rigidity|stiff(?:ness)?|slow movement|shuffl\w*|freez\w*|substantia nigra|levodopa|sinemet|lewy bod)\b/i)) {
      return "Parkinson disease";
    }
    if (has(/\b(abrupt|sudden|stopp(?:ed|ing)|withdr(?:aw|ew|awn|awal)|missed)\b/i)
      && has(/\b(parkinson|levodopa|dopaminergic|amantadine)\b/i)
      && has(/\b(high fever|hyperpyrexia|rigidity|confusion|autonomic|nms|neuroleptic malignant)\b/i)) {
      return "Parkinsonism-hyperpyrexia syndrome";
    }
    if (((has(/\b(levodopa[- ]induced dyskinesia|peak[- ]dose(?:\s+\w+){0,2}\s+dyskinesia|diphasic dyskinesia|off dystonia)\b/i))
      || (has(/\b(levodopa|sinemet|rytary)\b/i)
        && has(/\b(writhing|involuntary movement|extra movements?|dyskinesia)\b/i)
        && has(/\b(why|cause|peak|after dose|mechanism)\b/i)))
      && !has(/\b(absorb|absorption|protein|meal|amino acid|wear(?:ing)?[- ]off|end[- ]of[- ]dose|on[- ]off|on and off|motor fluctuation)\b/i)) {
      return "Levodopa-induced dyskinesia";
    }
    if (has(/\b(wear(?:ing)?[- ]off|end[- ]of[- ]dose|on[- ]off|on and off|unpredictable off|delayed on|dose failure|motor fluctuation)\b/i)
      && has(/\b(parkinson|levodopa|sinemet|rytary|movement|dose|freez|stiff|slow)\b/i)
      && !has(/\b(absorb|absorption|protein|meal|amino acid|blood brain|decarboxylase|compare|comparison|versus|\bvs\b|difference|relationship|map)\b/i)) {
      return "Wearing-off and on-off motor fluctuations";
    }
    if (has(/\b(parkinson(?:['’]?s| disease)?|idiopathic parkinsonism)\b/i)
      && has(/\b(what is|what causes|cause|pathophysiology|alpha[- ]synuclein|lewy bod|substantia nigra|bradykinesia|rigidity|resting tremor|postural instability)\b/i)
      && !has(/\b(basal ganglia|direct pathway|indirect pathway|movement circuit|dopamine circuit|\bD1\b|\bD2\b)\b/i)
      && !has(/\b(drug|medication|medicine|treat|treatment|levodopa|agonist|inhibitor)\b/i)) {
      return "Parkinson disease";
    }
    return "";
  };

  const canonicalTarget = (input = "") => {
    const concept = conceptTarget(input);
    if (concept) return concept;
    const routedDrug = wave22Match(input);
    return routedDrug ? (routedDrug.displayName || routedDrug.name || routedDrug.generic || "") : "";
  };

  highYieldDrugClueMatch = function (input = "") {
    return wave22Match(input) || baseHighYieldDrugClueMatch(input);
  };
  window.highYieldDrugClueMatch = highYieldDrugClueMatch;

  if (baseMakeModelEnhancedResponse) {
    makeModelEnhancedResponse = function (input = "", ...args) {
      const target = canonicalTarget(input);
      if (!target) return baseMakeModelEnhancedResponse(input, ...args);
      const pathologyTargets = new Set([
        "Parkinson disease",
        "Wearing-off and on-off motor fluctuations",
        "Levodopa-induced dyskinesia",
        "Parkinsonism-hyperpyrexia syndrome",
        "Pharmacodynamics"
      ].map(normalize));
      return {
        type: "pharm-database",
        query: target,
        detailType: pathologyTargets.has(normalize(target)) ? "pathology" : "drug",
        openDetail: true,
        highlightQuery: String(input || ""),
        preface: "Opening **" + target + "** in the clinical reference.",
        originalQuery: String(input || "")
      };
    };
    window.makeModelEnhancedResponse = makeModelEnhancedResponse;
  }

  window.ANI_PARKINSON_WAVE22_ROUTING = {
    version: "2026-07-17-parkinson-causal",
    match: wave22Match,
    conceptTarget,
    canonicalTarget
  };
}());
