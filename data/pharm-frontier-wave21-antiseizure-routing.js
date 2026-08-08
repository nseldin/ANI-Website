/* eslint-disable */
/* High-priority offline intent routing for the antiseizure causal study wave. */
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

  const wave21Match = (input = "") => {
    const text = String(input || "");
    const has = (pattern) => pattern.test(text);
    const drugSignals = countSignals(text, [
      /\b(valproate|divalproex|depakote)\b/i,
      /\b(phenytoin|dilantin)\b/i,
      /\b(fosphenytoin|cerebyx)\b/i,
      /\b(levetiracetam|keppra)\b/i,
      /\b(carbamazepine|tegretol)\b/i,
      /\b(topiramate|topamax)\b/i,
      /\b(ethosuximide|zarontin)\b/i,
      /\b(lacosamide|vimpat)\b/i,
      /\b(perampanel|fycompa)\b/i,
      /\b(lamotrigine|lamictal)\b/i
    ]);

    if ((has(/\b(status epilepticus|seiz(?:ure|ing).*(?:five|5) minutes|continuous seizure|benzodiazepine[- ]refractory)\b/i)
      && has(/\b(sequence|algorithm|pathway|first|second|next|benzodiazepine|fosphenytoin|levetiracetam|valproate|esett|treatment)\b/i))
      || has(/\besett\b/i)) {
      return card("Status epilepticus medication sequence and why timing matters");
    }
    if (has(/\b(free|unbound|protein bound|protein binding|albumin|uremi\w*)\b/i)
      && has(/\b(phenytoin|valproate|antiseizure|antiepileptic|drug level|total level)\b/i)) {
      return card("Antiseizure therapeutic drug monitoring and free-level logic");
    }
    if (has(/\b(therapeutic drug monitoring|total (?:versus|vs) free|antiseizure levels?|antiepileptic levels?)\b/i)) {
      return card("Antiseizure therapeutic drug monitoring and free-level logic");
    }
    if (drugSignals >= 2
      && has(/\b(bipolar|mania|manic|mood stabiliz\w*)\b/i)
      && has(/\b(compare|comparison|versus|vs|difference|which|mechanism)\b/i)) {
      return null;
    }
    if ((drugSignals >= 2 && has(/\b(compare|comparison|versus|vs|difference|which|mechanism)\b/i))
      || (has(/\bsodium channel\b/i) && has(/\b(fast|slow|use[- ]dependent|which|compare|worsen absence)\b/i) && has(/\b(seizure|antiepileptic|antiseizure|drugs?)\b/i))) {
      return card("Sodium-channel antiseizure medication comparison");
    }
    if (has(/\b(antiseizure|anti-seizure|antiepileptic|anti-epileptic|anticonvulsant|seizure (?:medications?|medicines?|drugs?)|aed|asm)\b/i)
      && has(/\b(classes|class map|mechanism map|mechanisms? target|which seizure types?|class fits|focal.*absence|absence.*focal|broad spectrum|narrow spectrum|compare)\b/i)) {
      return card("Antiseizure medication mechanism and seizure-type map");
    }

    if (has(/\b(qsymia|phentermine.*topiramate|topiramate.*phentermine|phentarmine\s+topirimate)\b/i)
      && has(/\b(contrave|naltrexone.*bupropion|bupropion.*naltrexone|wegovy|saxenda|orlistat|xenical|alli|zepbound|liraglutide|semaglutide|tirzepatide)\b/i)
      && has(/\b(compare|comparison|versus|vs|difference|checkpoint|stopping rule|ineffective therapy)\b/i)) return null;
    if (has(/\b(phentermine.*topiramate|topiramate.*phentermine|phentarmine\s+topirimate|qsymia)\b/i)) return card("Phentermine/topiramate");
    if (has(/\b(fosphenytoin|cerebyx|fosphenytoine|phenytoin equivalents?|mg ?pe)\b/i)) return card("Fosphenytoin");
    if (has(/\b(phenytoin|dilantin|phenytek|phenytoen|phenetoin|diphenylhydantoin)\b/i)) return card("Phenytoin");
    if (has(/\b(levetiracetam|keppra|spritam|elepsia|levetiracitam|levitiracetam|levetiracetan)\b/i)
      || (has(/\bsv2a|synaptic vesicle protein\b/i) && has(/\b(seizure|irritability|aggression|renal)\b/i))) return card("Levetiracetam");
    if (has(/\b(carbamazepine|tegretol|carbatrol|equetro|epitol|carbemazepine|carbamezapine)\b/i)) return card("Carbamazepine");
    if (!has(/\b(phentermine|qsymia|weight loss|weight management|obesity)\b/i)
      && has(/\b(topiramate|topamax|trokendi|qudexy|eprontia|topirimate|topiramite)\b/i)) return card("Topiramate");
    if (has(/\b(ethosuximide|zarontin|ethosuxamide|succinimide)\b/i)
      || (has(/\b(3 ?hz|t-type calcium|thalamocortical)\b/i) && has(/\b(absence|petit mal|staring)\b/i))) return card("Ethosuximide");
    if (has(/\b(lacosamide|vimpat|motpoly|lacosimide|lacosomide)\b/i)
      || (has(/\bslow (?:sodium|inactivation)|pr interval\b/i) && has(/\b(seizure|av block|bradycardia)\b/i))) return card("Lacosamide");
    if (has(/\b(perampanel|fycompa|perampinal)\b/i)
      || (has(/\b(noncompetitive ampa|ampa antagonist)\b/i) && has(/\b(seizure|aggression|homicidal|glutamate)\b/i))) return card("Perampanel");
    if (has(/\b(meropenem|imipenem|ertapenem|doripenem)\b/i)
      && has(/\b(valproate|valproic acid|divalproex|depakote|depakene)\b/i)
      && has(/\b(seizure|neurotoxicity|neurotoxic|renal accumulation|low(?:er|ers|ered|ering)? (?:the )?(?:valproate|depakote) level)\b/i)) return null;
    if (has(/\b(lamotrigine|lamictal|lamotrigene|lamotragine)\b/i)) return card("Lamotrigine");
    if (has(/\b(valproic acid|valproate|divalproex|depakote|depakene|valporic|sodium valproate)\b/i)) return card("Valproic acid");
    return null;
  };

  const conceptTarget = (input = "") => {
    const text = String(input || "");
    const has = (pattern) => pattern.test(text);
    if (has(/\bhepatic encephalopathy\b/i)
      && has(/\b(gut|lactulose|rifaximin|drugs?|medications?|treat|treatment|reduce ammonia)\b/i)) return "";
    if (!has(/\b(valproate|valproic|divalproex|depakote|depakene)\b/i)
      && ((has(/\b(ammonia|hyperammonemia)\b/i) && has(/\b(confusion|encephalopathy|astrocyte|glutamine|brain|normal liver)\b/i))
        || has(/\bhyperammonemic encephalopathy\b/i))) return "Hyperammonemic encephalopathy";
    if ((has(/\b(free drug|unbound|protein binding)\b/i) && has(/\b(albumin|uremi\w*|total|concentration|level)\b/i))
      || (has(/\buremi\w*\b/i) && has(/\b(displace|albumin|protein bound)\b/i))) return "Free drug concentration and protein binding";
    if (has(/\b(capacity[- ]limited|saturable metabolism|michaelis[- ]menten|zero[- ]order phenytoin)\b/i)
      || (has(/\bphenytoin\b/i) && has(/\b(not proportional|nonlinear|small dose.*(?:huge|large)|huge level|saturat)\b/i))) return "Capacity-limited elimination";
    if (has(/\b(autoinduction|auto-induction|induces? (?:its|their) own metabolism)\b/i)
      || (has(/\bcarbamazepine\b/i) && has(/\b(level falls?|lower level|three to five weeks|3 to 5 weeks)\b/i))) return "Autoinduction";
    if (has(/\b(sv2a|synaptic vesicle protein 2a)\b/i)
      && has(/\b(what|target|protein|vesicle|do|mechanism)\b/i)
      && !has(/\b(aggression|irritability|renal|dialysis|dose|dosing)\b/i)) return "SV2A synaptic vesicle protein";
    if (has(/\b(ampa receptor|ampa glutamate receptor|fast glutamate receptor)\b/i)
      && !has(/\b(perampanel|fycompa|drug|medicine)\b/i)) return "AMPA receptor";
    if (has(/\b(thalamocortical oscillation|t[- ]?type calcium|3 ?hz spike[- ]wave|rebound burst)\b/i)
      && has(/\b(absence|oscillation|spike|burst|mechanism|calcium)\b/i)
      && !has(/\b(ethosuximide|zarontin|drug|medicine)\b/i)) return "T-type calcium channel and thalamocortical oscillation";
    return "";
  };

  const canonicalTarget = (input = "") => {
    const routedDrug = wave21Match(input);
    if (routedDrug && routedDrug.classCard) return routedDrug.displayName || routedDrug.name || routedDrug.generic || "";
    const concept = conceptTarget(input);
    if (concept) return concept;
    return routedDrug ? (routedDrug.displayName || routedDrug.name || routedDrug.generic || "") : "";
  };

  highYieldDrugClueMatch = function (input = "") {
    return wave21Match(input) || baseHighYieldDrugClueMatch(input);
  };
  window.highYieldDrugClueMatch = highYieldDrugClueMatch;

  if (baseMakeModelEnhancedResponse) {
    makeModelEnhancedResponse = function (input = "", ...args) {
      const target = canonicalTarget(input);
      if (!target) return baseMakeModelEnhancedResponse(input, ...args);
      const pathologyTargets = new Set([
        "Hyperammonemic encephalopathy",
        "Free drug concentration and protein binding",
        "Capacity-limited elimination",
        "Autoinduction",
        "SV2A synaptic vesicle protein",
        "AMPA receptor",
        "T-type calcium channel and thalamocortical oscillation"
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
  window.ANI_ANTISEIZURE_WAVE21_ROUTING = {
    version: "2026-07-17-antiseizure-causal",
    match: wave21Match,
    canonicalTarget
  };
}());
