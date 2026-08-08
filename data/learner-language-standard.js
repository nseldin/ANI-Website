/* ANI learner-language standard: deterministic plain-language support for every encyclopedia card. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root && typeof root === "object") root.ANI_LEARNER_LANGUAGE_STANDARD = api;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : null), function () {
  "use strict";

  const VERSION = "2026-08-03.2";
  const SCHEMA_VERSION = 1;
  const PRESENTATION_STANDARD = Object.freeze({
    schemaVersion: "ani-card-presentation-v1",
    allowedVisualTypes: Object.freeze([
      "timeline",
      "responsive-table",
      "key-value-grid",
      "disclosure-list",
      "callout",
      "percentile-curves"
    ]),
    allowedMobileModes: Object.freeze(["stacked-cards"]),
    maximumInitiallyVisibleSections: 7,
    maximumInitiallyVisibleWords: 650,
    longBlockReviewWords: 180,
    compactSummaryMinimumWords: 5,
    compactSummaryMaximumWords: 40,
    minimumTouchTargetPixels: 44,
    principles: Object.freeze([
      "Lead with a direct answer and why the topic matters.",
      "Render only reviewed structured fields; never infer a clinical fact from prose to manufacture a visual.",
      "Keep urgent, emergency, boxed-warning, contraindication, and priority-action content visible.",
      "Use progressive disclosure for rationale, uncommon branches, and source detail without removing information.",
      "Use tables or timelines for categorical comparisons and chronology; use charts only for structured numeric data with units.",
      "Keep one readable narration path so a visual does not duplicate the same medical text when ANI reads aloud."
    ])
  });
  const GUIDANCE_SOURCES = Object.freeze([
    Object.freeze({
      key: "nih-plain-language",
      label: "NIH Plain Language: Getting Started or Brushing Up",
      url: "https://www.nih.gov/sites/default/files/2025-02/nih-plain-language-getting-started-brushing-up.pdf",
      role: "Put the main message first, prefer familiar words, and define necessary technical terms in context."
    }),
    Object.freeze({
      key: "cdc-simply-put",
      label: "CDC Simply Put: A guide for creating easy-to-understand materials",
      url: "https://www.cdc.gov/health-literacy/media/pdfs/Simply_Put.pdf",
      role: "Limit jargon, define necessary medical terms, and organize information around the reader's task."
    })
  ]);

  const rawGlossary = [
    ["acute", "starting suddenly or lasting a short time", "sudden or short-term", 1],
    ["chronic", "lasting a long time or repeatedly returning", "long-term", 1],
    ["adverse effect", "an unwanted or harmful effect of a treatment", "harmful treatment effect", 1],
    ["anemia", "too little hemoglobin or too few healthy red blood cells to carry oxygen normally", "reduced oxygen-carrying blood cells", 1],
    ["anuria", "little to no urine production", "almost no urine", 2],
    ["aphasia", "difficulty producing or understanding language because of brain dysfunction", "difficulty with language", 2],
    ["ascites", "abnormal fluid buildup inside the abdomen", "fluid buildup in the abdomen", 2],
    ["ataxia", "poor coordination or an unsteady movement pattern", "poor coordination", 2],
    ["auscultation", "listening to body sounds, usually with a stethoscope", "listening with a stethoscope", 2],
    ["basilar", "located at the base of a structure, such as the base of the skull", "at the base", 2],
    ["benign", "not cancerous and not invading nearby tissue", "not cancerous", 1],
    ["bradycardia", "a heart rate that is slower than expected for the clinical situation", "slow heart rate", 2],
    ["bradypnea", "breathing that is slower than expected", "slow breathing", 2],
    ["cerebrospinal fluid", "clear fluid that surrounds and cushions the brain and spinal cord", "fluid surrounding the brain and spinal cord", 2],
    ["contraindication", "a reason a treatment or procedure may be unsafe or should not be used", "reason not to use a treatment", 2],
    ["cyanosis", "blue or gray discoloration that can occur when tissues have inadequate oxygenated blood", "blue-gray color from inadequate oxygenated blood", 2],
    ["differential diagnosis", "the list of plausible conditions that could explain the findings", "other possible causes", 2],
    ["dysarthria", "unclear speech caused by impaired control of the speech muscles", "slurred or difficult speech", 2],
    ["dysphagia", "difficulty swallowing", "trouble swallowing", 2],
    ["dyspnea", "the feeling or observation of difficult or uncomfortable breathing", "shortness of breath", 2],
    ["dysuria", "pain or burning with urination", "painful urination", 2],
    ["ecchymosis", "a larger area of bleeding under the skin that appears as a bruise", "bruising", 2],
    ["edema", "swelling caused by fluid collecting in body tissues", "fluid-related swelling", 2],
    ["embolus", "material, often a blood clot, that travels through the bloodstream and blocks a vessel", "traveling material that blocks a blood vessel", 2],
    ["erythema", "redness of the skin caused by increased blood flow", "skin redness", 2],
    ["etiology", "the cause or origin of a disease or problem", "cause", 2],
    ["exacerbation", "a period when a disease or its symptoms become worse", "flare-up or worsening", 2],
    ["fascial plane", "a natural tissue layer along which blood, fluid, or infection can spread", "a tissue layer that can let fluid spread", 3],
    ["hematoma", "a localized collection of blood outside a blood vessel", "a pocket of collected blood", 2],
    ["hematuria", "blood in the urine", "blood in urine", 2],
    ["hemiparesis", "weakness affecting one side of the body", "one-sided weakness", 2],
    ["hemorrhage", "heavy or uncontrolled bleeding", "serious bleeding", 2],
    ["hepatomegaly", "an enlarged liver", "enlarged liver", 2],
    ["hepatotoxic", "capable of injuring the liver", "harmful to the liver", 2],
    ["hyperglycemia", "blood glucose that is higher than the safe or expected range", "high blood sugar", 2],
    ["hyperkalemia", "too much potassium in the blood", "high blood potassium", 2],
    ["hypernatremia", "too much sodium in the blood, usually reflecting too little water relative to sodium", "high blood sodium", 2],
    ["hypertension", "blood pressure that is persistently or dangerously high for the situation", "high blood pressure", 1],
    ["hypoglycemia", "blood glucose that is lower than the safe range", "low blood sugar", 2],
    ["hypokalemia", "too little potassium in the blood", "low blood potassium", 2],
    ["hyponatremia", "too little sodium in the blood, usually reflecting excess water relative to sodium", "low blood sodium", 2],
    ["hypotension", "blood pressure that is lower than needed to maintain adequate organ perfusion", "low blood pressure", 2],
    ["hypoxemia", "too little oxygen in arterial blood", "low oxygen in the blood", 2],
    ["hypoxia", "inadequate oxygen available to body tissues", "too little oxygen reaching tissues", 2],
    ["iatrogenic", "caused unintentionally by medical care or treatment", "caused by medical care", 3],
    ["idiopathic", "having no identified cause after appropriate evaluation", "cause is not known", 2],
    ["infarction", "tissue death caused by loss of blood supply", "tissue death from blocked blood flow", 2],
    ["ischemia", "inadequate blood flow and oxygen delivery to tissue", "too little blood flow to tissue", 2],
    ["jaundice", "yellow discoloration caused by bilirubin buildup", "yellowing from bilirubin buildup", 2],
    ["leukocytosis", "a white blood cell count above the expected range", "high white blood cell count", 2],
    ["leukopenia", "a white blood cell count below the expected range", "low white blood cell count", 2],
    ["lymphadenopathy", "enlarged or abnormal lymph nodes", "swollen or abnormal lymph nodes", 2],
    ["malignant", "cancerous, with the potential to invade or spread", "cancerous", 1],
    ["mastoid", "the bony area of the skull just behind the ear", "the bony area behind the ear", 2],
    ["miosis", "abnormally small or constricted pupils", "very small pupils", 2],
    ["mucosa", "the moist lining inside structures such as the mouth, nose, lungs, or intestines", "moist inner lining", 2],
    ["mydriasis", "abnormally enlarged or dilated pupils", "very large pupils", 2],
    ["nephrotoxic", "capable of injuring the kidneys", "harmful to the kidneys", 2],
    ["nosocomial", "acquired in a healthcare setting", "healthcare-associated", 3],
    ["nystagmus", "involuntary rhythmic eye movement", "repetitive uncontrolled eye movement", 2],
    ["occlusion", "a blockage that closes a vessel or passage", "blockage", 2],
    ["oliguria", "urine output that is lower than expected", "low urine output", 2],
    ["orthopnea", "shortness of breath when lying flat that improves when sitting or standing", "difficulty breathing while lying flat", 2],
    ["palpation", "examining the body by touch", "examining by touch", 2],
    ["pallor", "unusual paleness of the skin or mucous membranes", "unusual paleness", 2],
    ["paresis", "partial weakness or incomplete loss of movement", "partial weakness", 2],
    ["paresthesia", "an abnormal tingling, prickling, burning, or numb sensation", "tingling or numbness", 2],
    ["pathophysiology", "how a disease changes normal body function and produces its effects", "how the disease changes body function", 2],
    ["percussion", "tapping the body surface to assess the sound and underlying tissue", "examining by tapping", 2],
    ["periorbital", "around the eye socket", "around the eyes", 2],
    ["petechiae", "tiny pinpoint spots of bleeding under the skin", "tiny pinpoint bleeding spots", 2],
    ["pleural effusion", "abnormal fluid collecting between the lung and chest wall", "fluid around the lung", 2],
    ["polyuria", "urinating an unusually large volume", "excessive urine output", 2],
    ["postauricular", "located behind the ear", "behind the ear", 2],
    ["prognosis", "the expected course and likely outcome of a condition", "expected course and outcome", 2],
    ["prophylaxis", "treatment or action used to prevent a problem", "prevention", 2],
    ["proteinuria", "protein present in the urine above the expected amount", "excess protein in urine", 2],
    ["ptosis", "drooping of an eyelid or another body structure", "drooping", 2],
    ["purpura", "purple skin spots caused by bleeding under the skin", "purple bleeding spots", 2],
    ["pyuria", "white blood cells or pus in the urine", "white blood cells in urine", 2],
    ["refractory", "not responding adequately to usual treatment", "not responding to usual treatment", 2],
    ["remission", "a period when disease activity or symptoms are greatly reduced or absent", "period of reduced disease activity", 2],
    ["retroauricular", "located behind the ear", "behind the ear", 2],
    ["scleral icterus", "yellow discoloration of the whites of the eyes from bilirubin buildup", "yellowing of the whites of the eyes", 2],
    ["splenomegaly", "an enlarged spleen", "enlarged spleen", 2],
    ["stenosis", "abnormal narrowing of a vessel, valve, or passage", "abnormal narrowing", 2],
    ["subcutaneous", "located or given under the skin", "under the skin", 2],
    ["syncope", "a brief loss of consciousness caused by reduced blood flow to the brain", "fainting", 2],
    ["tachycardia", "a heart rate that is faster than expected for the clinical situation", "fast heart rate", 2],
    ["tachypnea", "breathing that is faster than expected", "fast breathing", 2],
    ["thrombocytopenia", "a platelet count below the expected range", "low platelet count", 2],
    ["thrombosis", "formation of a blood clot inside a blood vessel", "blood clot forming in a vessel", 2],
    ["virulence", "the ability of a microorganism to cause damage or disease", "ability to cause disease", 2]
  ];

  const glossary = Object.freeze(rawGlossary.map((row, index) => Object.freeze({
    id: `ani-learner-term-${String(index + 1).padStart(3, "0")}`,
    term: row[0],
    plainLanguage: row[1],
    inlineGloss: row[2],
    difficulty: row[3],
    guidanceKeys: Object.freeze(["nih-plain-language", "cdc-simply-put"])
  })).sort((left, right) => right.term.length - left.term.length));

  function cleanText(value) {
    return String(value == null ? "" : value).replace(/\s+/g, " ").trim();
  }

  function normalize(value) {
    return cleanText(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function termPattern(term) {
    return new RegExp(`\\b${escapeRegex(term).replace(/\\ /g, "\\s+")}\\b`, "i");
  }

  function termMatches(text) {
    const source = cleanText(text);
    if (!source) return [];
    const occupied = [];
    const matches = [];
    glossary.forEach((entry) => {
      const pattern = termPattern(entry.term);
      const match = pattern.exec(source);
      if (!match) return;
      const start = match.index;
      const end = start + match[0].length;
      if (occupied.some((range) => start < range.end && end > range.start)) return;
      occupied.push({ start, end });
      matches.push({ ...entry, matchedText: match[0], start, end });
    });
    return matches.sort((left, right) => left.start - right.start || right.term.length - left.term.length);
  }

  function hasNearbyExplanation(text, match, options) {
    const settings = options || {};
    const source = cleanText(text);
    if (!source || !match) return false;
    const before = source.slice(Math.max(0, match.start - 120), match.start);
    const after = source.slice(match.end, Math.min(source.length, match.end + 220));
    const local = normalize(`${before} ${after}`);
    const plain = normalize(match.plainLanguage);
    const inline = normalize(match.inlineGloss);
    if ((plain && local.includes(plain)) || (inline && local.includes(inline))) return true;
    if (!settings.strictExplanation && /^\s*(?:\(|[-,:])[^.!?]{2,120}(?:\)|[.!?]|$)/.test(after)) return true;
    if (/\b(?:means?|meaning|refers? to|also called|in everyday language|in plain language)\b/i.test(after.slice(0, 140))) return true;
    return false;
  }

  function sentenceMetrics(text) {
    const sentences = cleanText(text).split(/(?<=[.!?])\s+/).map(cleanText).filter(Boolean);
    const wordCounts = sentences.map((sentence) => normalize(sentence).split(" ").filter(Boolean).length);
    const average = wordCounts.length ? wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length : 0;
    return {
      sentenceCount: sentences.length,
      averageSentenceWords: Number(average.toFixed(1)),
      maximumSentenceWords: wordCounts.length ? Math.max(...wordCounts) : 0
    };
  }

  function analyzeText(text, options) {
    const settings = options || {};
    const source = cleanText(text).slice(0, Number(settings.maxCharacters) || 24000);
    const tokens = normalize(source).split(" ").filter(Boolean);
    const matches = termMatches(source);
    const unexplained = matches.filter((match) => !hasNearbyExplanation(source, match, settings));
    const difficult = unexplained.filter((match) => match.difficulty >= 2);
    const density = tokens.length ? Number((difficult.length / tokens.length * 100).toFixed(2)) : 0;
    const sentence = sentenceMetrics(source);
    const supportRecommended = difficult.length >= 3
      || (difficult.length >= 2 && density >= 0.75)
      || (difficult.length >= 2 && sentence.maximumSentenceWords >= 40);
    return {
      wordCount: tokens.length,
      matchedTerms: matches,
      unexplainedTerms: unexplained,
      difficultUnexplainedTerms: difficult,
      jargonDensityPer100Words: density,
      supportRecommended,
      difficultyBand: supportRecommended ? "most-learners-may-need-help" : (difficult.length ? "some-learners-may-need-help" : "accessible-or-explained"),
      ...sentence
    };
  }

  function scalarText(value, output, seen, depth) {
    if (value == null || depth > 6) return;
    if (typeof value === "string" || typeof value === "number") {
      const text = cleanText(value);
      if (text) output.push(text);
      return;
    }
    if (typeof value !== "object" || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) value.slice(0, 80).forEach((item) => scalarText(item, output, seen, depth + 1));
    else Object.entries(value).forEach(([key, item]) => {
      if (/^(?:aliases?|tags?|searchTerms|commonMisspellings|sourceKeys|sourceIds|sourceNote|url|image|icon)$/i.test(key)) return;
      scalarText(item, output, seen, depth + 1);
    });
  }

  function textForItem(item) {
    const output = [];
    scalarText(item, output, new Set(), 0);
    return output.join(" ").slice(0, 24000);
  }

  function explicitGlosses(item) {
    const raw = Array.isArray(item && item.plainLanguageGlosses)
      ? item.plainLanguageGlosses
      : (Array.isArray(item && item.learnerGlosses) ? item.learnerGlosses : []);
    return raw.map((entry) => ({
      term: cleanText(entry && (entry.term || entry.medicalTerm)),
      plainLanguage: cleanText(entry && (entry.plainLanguage || entry.meaning || entry.definition)),
      sourceKeys: Array.isArray(entry && entry.sourceKeys) ? entry.sourceKeys.map(cleanText).filter(Boolean) : []
    })).filter((entry) => entry.term && entry.plainLanguage);
  }

  function supportForItem(item, options) {
    const settings = options || {};
    const source = textForItem(item || {});
    const analysis = analyzeText(source, settings);
    const supplied = explicitGlosses(item || {});
    const suppliedTerms = new Set(supplied.map((entry) => normalize(entry.term)));
    const inferred = analysis.difficultUnexplainedTerms
      .filter((entry) => !suppliedTerms.has(normalize(entry.term)))
      .slice(0, Number(settings.maxGlosses) || 6)
      .map((entry) => ({
        term: entry.term,
        plainLanguage: entry.plainLanguage,
        guidanceKeys: entry.guidanceKeys,
        inferredFromReviewedGlossary: true
      }));
    const plainLanguage = cleanText(item && (item.plainLanguage || item.plainMeaning || item.termMeaning || item.literalMeaning));
    const whyItMatters = cleanText(item && (item.whyItMatters || item.clinicalSignificance || item.clinicalImportance));
    return {
      version: VERSION,
      plainLanguage,
      whyItMatters,
      glosses: [...supplied, ...inferred].slice(0, Number(settings.maxGlosses) || 6),
      analysis,
      shouldRender: Boolean(plainLanguage || whyItMatters || supplied.length || analysis.supportRecommended)
    };
  }

  function annotateFirstTerms(text, limit) {
    const source = cleanText(text);
    const maximum = Math.max(0, Number(limit) || 2);
    if (!source || !maximum) return source;
    const matches = termMatches(source).filter((match) => match.difficulty >= 2 && !hasNearbyExplanation(source, match)).slice(0, maximum);
    if (!matches.length) return source;
    let output = source;
    matches.slice().sort((left, right) => right.start - left.start).forEach((match) => {
      output = `${output.slice(0, match.end)} (${match.inlineGloss})${output.slice(match.end)}`;
    });
    return output;
  }

  return Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    version: VERSION,
    guidanceSources: GUIDANCE_SOURCES,
    presentationStandard: PRESENTATION_STANDARD,
    glossary,
    cleanText,
    normalize,
    termMatches,
    hasNearbyExplanation,
    analyzeText,
    textForItem,
    explicitGlosses,
    supportForItem,
    annotateFirstTerms
  });
});
