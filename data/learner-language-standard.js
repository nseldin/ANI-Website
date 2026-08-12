/* ANI learner-language standard: deterministic plain-language support for every encyclopedia card. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root && typeof root === "object") root.ANI_LEARNER_LANGUAGE_STANDARD = api;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : null), function () {
  "use strict";

  const VERSION = "2026-08-11.3";
  const SCHEMA_VERSION = 1;
  const CLINICAL_REFERENCE_OPENING_STANDARD = Object.freeze({
    schemaVersion: "ani-clinical-reference-opening-v1",
    quickAnswerFallbackField: "summary",
    whyItMattersField: "whyItMatters",
    exactDuplicateFirstSectionLabels: Object.freeze([
      "definition",
      "scope",
      "principle",
      "what it is and why it matters",
      "definition and composition",
      "definition and purpose"
    ]),
    equalityPolicy: "case-whitespace-terminal-sentence-punctuation-only",
    preservedClinicalOperators: Object.freeze(["+", "-", "−", "<", ">", "<=", ">=", "≤", "≥", "=", "%", "/"]),
    preserveLaterSections: true,
    preserveSafetySections: true
  });
  const CLINICAL_REFERENCE_STRUCTURED_SECTION_FIELD_ORDERS = Object.freeze({
    complications: Object.freeze(["early", "ostomySpecific", "later"]),
    "report-or-escalate-immediately": Object.freeze(["finding", "action", "why"]),
    "nclex-and-exam-focus": Object.freeze([
      "priorityAssessment",
      "mostImportantComplication",
      "positioningPrecaution",
      "patientTeaching",
      "immediateActionFinding",
      "commonMisconception"
    ])
  });
  const CLINICAL_REFERENCE_STRUCTURED_SECTION_FIELD_LABELS = Object.freeze({
    early: "Early complications",
    ostomySpecific: "Ostomy-specific complications",
    later: "Later complications",
    finding: "Finding",
    action: "Action",
    why: "Why it matters",
    priorityAssessment: "Priority assessment",
    mostImportantComplication: "Most important complication",
    positioningPrecaution: "Positioning precaution",
    patientTeaching: "Patient teaching",
    immediateActionFinding: "Immediate action finding",
    commonMisconception: "Common misconception"
  });
  const CLINICAL_REFERENCE_STRUCTURED_SECTION_STANDARD = Object.freeze({
    schemaVersion: "ani-clinical-reference-structured-section-v1",
    surgeryRuntimeCollection: "clinicalReferenceEntries",
    surgeryCanonicalOwner: "Surgeries & Procedures",
    surgeryStableIdPrefix: "surgery-procedure:",
    exactOwnedWhySectionId: "why-it-matters",
    exactOwnedWhySectionLabel: "Why it matters",
    urgentSectionId: "report-or-escalate-immediately",
    fieldOrders: CLINICAL_REFERENCE_STRUCTURED_SECTION_FIELD_ORDERS,
    fieldLabels: CLINICAL_REFERENCE_STRUCTURED_SECTION_FIELD_LABELS,
    preserveArrayOrder: true,
    preserveUnknownScalarLeaves: true,
    urgentFieldCardinality: "exactly-one-nonempty-scalar",
    unknownShapesBlockPublication: true
  });
  const VISIBLE_LEARNER_SUPPORT_STANDARD = Object.freeze({
    schemaVersion: "ani-visible-learner-support-v1",
    placement: "first-visible-term-occurrence",
    explicitGlossSourceKeysRequired: true,
    maximumInferredGlossesPerBlock: 3,
    maximumInferredGlossesPerCard: 3,
    preserveAuthoredText: true,
    preserveVisibleBlockOrder: true,
    duplicatePlacementAllowed: false,
    nearbyExplanationSuppressesSupport: true,
    routineNursingContextGate: true,
    longSentenceMinimumWords: 40,
    longSentenceMinimumDifficultTerms: 2
  });
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

  const ROUTINE_NURSING_TERMS = Object.freeze([
    "hypotension", "hypertension", "edema", "tachypnea", "tachycardia", "bradycardia",
    "fever", "nausea", "vomiting", "glucose", "airway", "dehydration"
  ]);
  const CONTEXTUAL_TERM_RULES = Object.freeze({
    bradycardia: Object.freeze({
      audienceTier: "routine-nursing",
      explainWhen: Object.freeze(["symptomatic bradycardia", "sinus bradycardia", "fetal bradycardia", "relative bradycardia"]),
      equivalentPhrases: Object.freeze(["slow heart rate", "heart rate is slow", "slower than expected heart rate"])
    }),
    edema: Object.freeze({
      audienceTier: "routine-nursing",
      explainWhen: Object.freeze(["cerebral edema", "pulmonary edema", "pitting edema", "non pitting edema", "nonpitting edema", "generalized edema"]),
      equivalentPhrases: Object.freeze(["fluid related swelling", "swelling caused by fluid", "excess fluid in the tissues", "fluid buildup in tissues"])
    }),
    hypertension: Object.freeze({
      audienceTier: "routine-nursing",
      explainWhen: Object.freeze(["portal hypertension", "pulmonary hypertension", "intracranial hypertension", "gestational hypertension", "resistant hypertension", "malignant hypertension"]),
      equivalentPhrases: Object.freeze(["high blood pressure", "blood pressure is high", "elevated blood pressure"])
    }),
    hypotension: Object.freeze({
      audienceTier: "routine-nursing",
      explainWhen: Object.freeze(["orthostatic hypotension", "permissive hypotension", "refractory hypotension", "profound hypotension", "relative hypotension"]),
      equivalentPhrases: Object.freeze(["low blood pressure", "blood pressure is low", "reduced blood pressure"])
    }),
    tachycardia: Object.freeze({
      audienceTier: "routine-nursing",
      explainWhen: Object.freeze(["supraventricular tachycardia", "ventricular tachycardia", "sinus tachycardia", "inappropriate tachycardia", "relative tachycardia"]),
      equivalentPhrases: Object.freeze(["fast heart rate", "heart rate is fast", "faster than expected heart rate"])
    }),
    tachypnea: Object.freeze({
      audienceTier: "routine-nursing",
      explainWhen: Object.freeze(["transient tachypnea", "persistent tachypnea"]),
      equivalentPhrases: Object.freeze(["fast breathing", "breathing is fast", "rapid breathing", "respiratory rate is high"])
    }),
    cyanosis: Object.freeze({
      equivalentPhrases: Object.freeze(["blue discoloration", "blue gray discoloration", "bluish discoloration", "blue or blue gray", "blue lips"])
    }),
    dysphagia: Object.freeze({
      equivalentPhrases: Object.freeze(["difficulty swallowing", "trouble swallowing", "impaired swallowing"])
    }),
    hyperkalemia: Object.freeze({
      equivalentPhrases: Object.freeze(["high blood potassium", "high serum potassium", "elevated potassium", "too much potassium"])
    }),
    hypokalemia: Object.freeze({
      equivalentPhrases: Object.freeze(["low blood potassium", "low serum potassium", "reduced potassium", "too little potassium"])
    })
  });

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

  const glossary = Object.freeze(rawGlossary.map((row, index) => {
    const contextualRule = CONTEXTUAL_TERM_RULES[row[0]] || {};
    return Object.freeze({
      id: `ani-learner-term-${String(index + 1).padStart(3, "0")}`,
      term: row[0],
      plainLanguage: row[1],
      inlineGloss: row[2],
      difficulty: row[3],
      audienceTier: contextualRule.audienceTier || (row[3] >= 3 ? "advanced-or-specialty" : "medical"),
      explainWhen: contextualRule.explainWhen || Object.freeze([]),
      equivalentPhrases: contextualRule.equivalentPhrases || Object.freeze([]),
      guidanceKeys: Object.freeze(["nih-plain-language", "cdc-simply-put"])
    });
  }).sort((left, right) => right.term.length - left.term.length));

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

  function clinicalReferenceSectionRecords(item) {
    return (Array.isArray(item && item.sections) ? item.sections : [])
      .map((section, index) => {
        if (Array.isArray(section)) {
          return {
            label: cleanText(section[0]),
            value: section[1],
            presentation: "",
            defaultOpen: false,
            sourceIndex: index,
            source: section
          };
        }
        return {
          ...(section && typeof section === "object" ? section : {}),
          label: cleanText(section && (section.label || section.heading || section.title)),
          value: section && (section.text || section.value || section.content || section.description || section.body),
          presentation: cleanText(section && section.presentation),
          defaultOpen: Boolean(section && section.defaultOpen === true),
          sourceIndex: index,
          source: section
        };
      })
      .filter((section) => section.label && section.value);
  }

  function clinicalReferenceResultMeaningText(item) {
    return (Array.isArray(item && item.resultMeanings) ? item.resultMeanings : [])
      .map((row) => {
        if (Array.isArray(row)) {
          return { label: cleanText(row[0]), meaning: cleanText(row[1]) };
        }
        return {
          label: cleanText(row && (row.label || row.result || row.name)),
          meaning: cleanText(row && (row.meaning || row.interpretation || row.description))
        };
      })
      .filter((row) => row.label && row.meaning)
      .map((row) => `${row.label}: ${row.meaning}`)
      .join(" ");
  }

  function isPlainObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function structuredSectionFieldLabel(key) {
    if (CLINICAL_REFERENCE_STRUCTURED_SECTION_FIELD_LABELS[key]) {
      return CLINICAL_REFERENCE_STRUCTURED_SECTION_FIELD_LABELS[key];
    }
    return cleanText(String(key || "")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[-_]+/g, " "))
      .replace(/^./, (character) => character.toUpperCase());
  }

  function orderedStructuredSectionKeys(value, sectionId) {
    const actual = Object.keys(isPlainObject(value) ? value : {});
    const preferred = CLINICAL_REFERENCE_STRUCTURED_SECTION_FIELD_ORDERS[sectionId] || [];
    return [
      ...preferred.filter((key) => actual.includes(key)),
      ...actual.filter((key) => !preferred.includes(key))
    ];
  }

  function clinicalReferenceStructuredScalarLeaves(value, path, output, seen) {
    const currentPath = Array.isArray(path) ? path : [];
    const leaves = Array.isArray(output) ? output : [];
    const visited = seen instanceof Set ? seen : new Set();
    if (value === undefined || value === null) return leaves;
    if (["string", "number", "boolean"].includes(typeof value)) {
      const text = cleanText(value);
      if (text) leaves.push(Object.freeze({ path: currentPath.join("."), text }));
      return leaves;
    }
    if (typeof value !== "object" || visited.has(value)) return leaves;
    visited.add(value);
    if (Array.isArray(value)) {
      value.forEach((item, index) => clinicalReferenceStructuredScalarLeaves(
        item,
        currentPath.concat(String(index)),
        leaves,
        visited
      ));
    } else {
      Object.entries(value).forEach(([key, item]) => clinicalReferenceStructuredScalarLeaves(
        item,
        currentPath.concat(key),
        leaves,
        visited
      ));
    }
    return leaves;
  }

  function structuredSectionItems(value, path) {
    return Object.freeze(clinicalReferenceStructuredScalarLeaves(value, path || [], [], new Set()));
  }

  function clinicalReferenceStructuredValueProjection(value, options) {
    const settings = options || {};
    const sectionId = cleanText(settings.sectionId);
    const sourceLeaves = structuredSectionItems(value, []);
    const unsupportedPaths = [];
    let kind = "text";
    let items = Object.freeze([]);
    let fields = Object.freeze([]);
    let records = Object.freeze([]);

    if (Array.isArray(value)) {
      const scalarOnly = value.every((item) => ["string", "number", "boolean"].includes(typeof item));
      const objectOnly = value.every((item) => isPlainObject(item));
      if (scalarOnly) {
        kind = "list";
        items = structuredSectionItems(value, []);
      } else if (objectOnly) {
        kind = "records";
        const required = sectionId === CLINICAL_REFERENCE_STRUCTURED_SECTION_STANDARD.urgentSectionId
          ? CLINICAL_REFERENCE_STRUCTURED_SECTION_FIELD_ORDERS[sectionId]
          : [];
        if (!required.length) unsupportedPaths.push("unsupported object-array section");
        records = Object.freeze(value.map((record, recordIndex) => {
          const keys = orderedStructuredSectionKeys(record, sectionId);
          required.filter((key) => !Object.prototype.hasOwnProperty.call(record, key))
            .forEach((key) => unsupportedPaths.push(`${recordIndex}.${key}:missing`));
          keys.filter((key) => required.length && !required.includes(key))
            .forEach((key) => unsupportedPaths.push(`${recordIndex}.${key}:unexpected`));
          return Object.freeze({
            index: recordIndex,
            fields: Object.freeze(keys.map((key) => {
              const fieldValue = record[key];
              const fieldItems = structuredSectionItems(fieldValue, [String(recordIndex), key]);
              if (required.includes(key)) {
                const scalar = ["string", "number", "boolean"].includes(typeof fieldValue);
                if (!scalar) unsupportedPaths.push(`${recordIndex}.${key}:non-scalar`);
                if (fieldItems.length !== 1) {
                  unsupportedPaths.push(`${recordIndex}.${key}:${fieldItems.length ? "multiple-leaves" : "empty"}`);
                }
              }
              return Object.freeze({
                key,
                label: structuredSectionFieldLabel(key),
                items: fieldItems
              });
            }))
          });
        }));
      } else {
        kind = "list";
        items = sourceLeaves;
        unsupportedPaths.push("mixed or nested array shape");
      }
    } else if (isPlainObject(value)) {
      kind = "fields";
      const required = sectionId === "complications"
        ? ["early", "later"]
        : (sectionId === "nclex-and-exam-focus"
          ? CLINICAL_REFERENCE_STRUCTURED_SECTION_FIELD_ORDERS[sectionId]
          : []);
      const allowed = CLINICAL_REFERENCE_STRUCTURED_SECTION_FIELD_ORDERS[sectionId] || [];
      if (!allowed.length) unsupportedPaths.push("unsupported object section");
      required.filter((key) => !Object.prototype.hasOwnProperty.call(value, key))
        .forEach((key) => unsupportedPaths.push(`${key}:missing`));
      const keys = orderedStructuredSectionKeys(value, sectionId);
      keys.filter((key) => allowed.length && !allowed.includes(key))
        .forEach((key) => unsupportedPaths.push(`${key}:unexpected`));
      fields = Object.freeze(keys.map((key) => Object.freeze({
        key,
        label: structuredSectionFieldLabel(key),
        items: structuredSectionItems(value[key], [key])
      })));
    } else {
      items = sourceLeaves;
    }

    const projectedLeaves = kind === "records"
      ? records.flatMap((record) => record.fields.flatMap((field) => field.items))
      : (kind === "fields" ? fields.flatMap((field) => field.items) : items);
    if (projectedLeaves.length !== sourceLeaves.length) {
      unsupportedPaths.push(`leaf-count:${sourceLeaves.length}->${projectedLeaves.length}`);
    }
    const coverageComplete = sourceLeaves.length > 0 && unsupportedPaths.length === 0;
    return Object.freeze({
      schemaVersion: CLINICAL_REFERENCE_STRUCTURED_SECTION_STANDARD.schemaVersion,
      sectionId,
      kind,
      items,
      fields,
      records,
      leaves: Object.freeze(projectedLeaves),
      text: projectedLeaves.map((leaf) => leaf.text).join(" "),
      sourceLeafCount: sourceLeaves.length,
      projectedLeafCount: projectedLeaves.length,
      coverageComplete,
      unsupportedPaths: Object.freeze(unsupportedPaths)
    });
  }

  function clinicalReferenceStructuredSectionProjection(section) {
    const source = section && typeof section === "object" ? section : {};
    const value = Object.prototype.hasOwnProperty.call(source, "value")
      ? source.value
      : (source.text || source.content || source.body || source.description);
    return clinicalReferenceStructuredValueProjection(value, {
      sectionId: cleanText(source.id || source.sectionId)
    });
  }

  function isSurgeryClinicalReference(item) {
    const source = item && typeof item === "object" ? item : {};
    const metadata = isPlainObject(source.surgeryProcedure) ? source.surgeryProcedure : {};
    const stableId = cleanText(source.directTargetId || source.id || metadata.stableId);
    return cleanText(metadata.canonicalOwner) === CLINICAL_REFERENCE_STRUCTURED_SECTION_STANDARD.surgeryCanonicalOwner
      && cleanText(metadata.runtimeCollection) === CLINICAL_REFERENCE_STRUCTURED_SECTION_STANDARD.surgeryRuntimeCollection
      && stableId.startsWith(CLINICAL_REFERENCE_STRUCTURED_SECTION_STANDARD.surgeryStableIdPrefix);
  }

  function isExactOwnedSurgeryWhySection(item, section, whyItMatters) {
    if (!isSurgeryClinicalReference(item) || !section || typeof section !== "object") return false;
    if (cleanText(section.id) !== CLINICAL_REFERENCE_STRUCTURED_SECTION_STANDARD.exactOwnedWhySectionId) return false;
    if (cleanText(section.label) !== CLINICAL_REFERENCE_STRUCTURED_SECTION_STANDARD.exactOwnedWhySectionLabel) return false;
    if (cleanText(section.presentation).toLowerCase() === "urgent" || !Array.isArray(section.value)) return false;
    const safetyVisible = new Set(
      Array.isArray(item && item.procedure && item.procedure.safetyVisibleSectionIds)
        ? item.procedure.safetyVisibleSectionIds.map(cleanText)
        : []
    );
    if (safetyVisible.has(cleanText(section.id))) return false;
    const projection = clinicalReferenceStructuredSectionProjection(section);
    return projection.kind === "list"
      && projection.coverageComplete
      && openingOwnershipComparable(projection.text) === openingOwnershipComparable(whyItMatters);
  }

  function openingOwnershipTokens(value) {
    const text = cleanText(value).normalize("NFC");
    const tokens = Array.from(text.matchAll(/\S+/gu)).map((match) => ({
      value: match[0],
      index: match.index,
      comparable: match[0].normalize("NFC").toLocaleLowerCase("en-US")
    }));
    if (tokens.length) {
      tokens[tokens.length - 1].comparable = tokens[tokens.length - 1].comparable.replace(/[.!?]+$/u, "");
    }
    return tokens.filter((token) => token.comparable);
  }

  function openingOwnershipComparable(value) {
    return openingOwnershipTokens(value).map((token) => token.comparable).join(" ");
  }

  function quickAnswerWithoutExactWhySuffix(quickAnswer, whyItMatters) {
    const quick = cleanText(quickAnswer);
    const why = cleanText(whyItMatters);
    const quickTokens = openingOwnershipTokens(quick);
    const whyTokens = openingOwnershipTokens(why);
    if (!whyTokens.length || whyTokens.length > quickTokens.length) {
      return { value: quick, split: false };
    }
    const suffixTokens = quickTokens.slice(-whyTokens.length);
    if (!suffixTokens.every((token, index) => token.comparable === whyTokens[index].comparable)) {
      return { value: quick, split: false };
    }
    const suffixStart = suffixTokens[0] && suffixTokens[0].index;
    if (!Number.isInteger(suffixStart)) return { value: quick, split: false };
    return {
      value: quick.slice(0, suffixStart).trim(),
      split: true
    };
  }

  function clinicalReferenceOpeningProjection(item, options) {
    const source = item && typeof item === "object" ? item : {};
    const settings = options || {};
    const hasQuickAnswerOverride = Object.prototype.hasOwnProperty.call(settings, "quickAnswerOverride");
    const authoredQuickAnswer = cleanText(source.quickAnswer);
    const whyItMatters = cleanText(source.whyItMatters);
    const openingSource = hasQuickAnswerOverride
      ? cleanText(settings.quickAnswerOverride)
      : (authoredQuickAnswer || cleanText(source.summary));
    const quickProjection = !hasQuickAnswerOverride && authoredQuickAnswer
      ? quickAnswerWithoutExactWhySuffix(openingSource, whyItMatters)
      : { value: openingSource, split: false };
    const sectionRecords = Array.isArray(settings.sectionRecords)
      ? settings.sectionRecords
      : clinicalReferenceSectionRecords(source);
    const displayedOpeningValues = new Set(
      [quickProjection.value, whyItMatters].map(openingOwnershipComparable).filter(Boolean)
    );
    const openingLabels = new Set(CLINICAL_REFERENCE_OPENING_STANDARD.exactDuplicateFirstSectionLabels);
    const suppressedSectionIndexes = [];
    const suppressedOwnedWhySectionIndexes = [];
    const visibleSectionRecords = sectionRecords.filter((section, index) => {
      const sourceIndex = Number.isInteger(section && section.sourceIndex) ? section.sourceIndex : index;
      if (isExactOwnedSurgeryWhySection(source, section, whyItMatters)) {
        suppressedSectionIndexes.push(sourceIndex);
        suppressedOwnedWhySectionIndexes.push(sourceIndex);
        return false;
      }
      if (index !== 0 || !openingLabels.has(normalize(section && section.label))) return true;
      const value = section && section.value;
      if (typeof value !== "string" && typeof value !== "number") return true;
      const duplicate = displayedOpeningValues.has(openingOwnershipComparable(value));
      if (duplicate) suppressedSectionIndexes.push(sourceIndex);
      return !duplicate;
    });

    return Object.freeze({
      schemaVersion: CLINICAL_REFERENCE_OPENING_STANDARD.schemaVersion,
      quickAnswer: quickProjection.value,
      whyItMatters,
      learnerSupportText: [quickProjection.value, whyItMatters].filter(Boolean).join(" "),
      sectionRecords: Object.freeze(visibleSectionRecords),
      whySuffixSplit: quickProjection.split,
      suppressedSectionIndexes: Object.freeze(suppressedSectionIndexes),
      suppressedOwnedWhySectionIndexes: Object.freeze(suppressedOwnedWhySectionIndexes)
    });
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
    if ((match.equivalentPhrases || []).some((phrase) => local.includes(normalize(phrase)))) return true;
    if (!settings.strictExplanation && /^\s*(?:\(|[-,:])[^.!?]{2,120}(?:\)|[.!?]|$)/.test(after)) return true;
    if (/\b(?:means?|meaning|refers? to|also called|in everyday language|in plain language)\b/i.test(after.slice(0, 140))) return true;
    return false;
  }

  function termNeedsExplanation(text, match, options) {
    const settings = options || {};
    if (!match || Number(match.difficulty) < 2) return false;
    if (match.audienceTier !== "routine-nursing" || settings.includeRoutineNursingTerms === true) return true;
    const source = normalize(text);
    return (match.explainWhen || []).some((phrase) => source.includes(normalize(phrase)));
  }

  function sentenceRecords(text) {
    const source = cleanText(text);
    const values = source.split(/(?<=[.!?])\s+/).map(cleanText).filter(Boolean);
    let cursor = 0;
    return values.map((value) => {
      const start = source.indexOf(value, cursor);
      const safeStart = start >= 0 ? start : cursor;
      const end = safeStart + value.length;
      cursor = end;
      return {
        text: value,
        start: safeStart,
        end,
        wordCount: normalize(value).split(" ").filter(Boolean).length
      };
    });
  }

  function sentenceMetrics(text) {
    const sentences = sentenceRecords(text);
    const wordCounts = sentences.map((sentence) => sentence.wordCount);
    const average = wordCounts.length ? wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length : 0;
    return {
      sentenceCount: sentences.length,
      averageSentenceWords: Number(average.toFixed(1)),
      maximumSentenceWords: wordCounts.length ? Math.max(...wordCounts) : 0
    };
  }

  function hasLongSentenceWithDifficultTerms(text, difficultTerms, options) {
    const settings = options || {};
    const minimumWords = Math.max(1, Number(settings.minimumWords)
      || VISIBLE_LEARNER_SUPPORT_STANDARD.longSentenceMinimumWords);
    const minimumTerms = Math.max(1, Number(settings.minimumTerms)
      || VISIBLE_LEARNER_SUPPORT_STANDARD.longSentenceMinimumDifficultTerms);
    const positioned = (Array.isArray(difficultTerms) ? difficultTerms : [])
      .filter((entry) => entry && Number.isInteger(entry.start) && Number.isInteger(entry.end));
    if (positioned.length < minimumTerms) return false;
    return sentenceRecords(text).some((sentence) => {
      if (sentence.wordCount < minimumWords) return false;
      const keys = new Set(positioned
        .filter((entry) => entry.start >= sentence.start && entry.end <= sentence.end)
        .map((entry) => normalize(entry.term))
        .filter(Boolean));
      return keys.size >= minimumTerms;
    });
  }

  function analyzeText(text, options) {
    const settings = options || {};
    const source = cleanText(text).slice(0, Number(settings.maxCharacters) || 24000);
    const tokens = normalize(source).split(" ").filter(Boolean);
    const matches = termMatches(source);
    const unexplained = matches.filter((match) => !hasNearbyExplanation(source, match, settings));
    const difficult = unexplained.filter((match) => termNeedsExplanation(source, match, settings));
    const density = tokens.length ? Number((difficult.length / tokens.length * 100).toFixed(2)) : 0;
    const sentence = sentenceMetrics(source);
    const supportRecommended = difficult.length >= 3
      || (difficult.length >= 2 && density >= 0.75)
      || hasLongSentenceWithDifficultTerms(source, difficult);
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
    const seen = new Set();
    return raw.map((entry) => ({
      term: cleanText(entry && (entry.term || entry.medicalTerm)),
      plainLanguage: cleanText(entry && (entry.plainLanguage || entry.meaning || entry.definition)),
      sourceKeys: Array.isArray(entry && entry.sourceKeys) ? entry.sourceKeys.map(cleanText).filter(Boolean) : []
    })).filter((entry) => {
      const key = normalize(entry.term);
      if (!key || !entry.plainLanguage || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function explicitGlossMatch(text, entry) {
    const source = cleanText(text);
    const term = cleanText(entry && entry.term);
    if (!source || !term) return null;
    const match = termPattern(term).exec(source);
    if (!match) return null;
    return {
      ...entry,
      matchedText: match[0],
      start: match.index,
      end: match.index + match[0].length
    };
  }

  function visibleLearnerSupportProjection(item, blocks, options) {
    const source = item && typeof item === "object" ? item : {};
    const settings = options || {};
    const maximumInferredPerBlock = Math.max(0, Number(settings.maximumInferredGlossesPerBlock)
      || VISIBLE_LEARNER_SUPPORT_STANDARD.maximumInferredGlossesPerBlock);
    const maximumInferredPerCard = Math.max(0, Number(settings.maximumInferredGlossesPerCard)
      || VISIBLE_LEARNER_SUPPORT_STANDARD.maximumInferredGlossesPerCard);
    const supplied = explicitGlosses(source);
    const validExplicit = supplied.filter((entry) => entry.sourceKeys.length > 0);
    const invalidExplicit = supplied.filter((entry) => entry.sourceKeys.length === 0);
    const explicitByKey = new Map(validExplicit.map((entry) => [normalize(entry.term), entry]));
    const invalidByKey = new Map(invalidExplicit.map((entry) => [normalize(entry.term), entry]));
    const seenTerms = new Set((Array.isArray(settings.seenTerms) ? settings.seenTerms : [])
      .map(normalize).filter(Boolean));
    const observedExplicitKeys = new Set();
    const placedTerms = new Set();
    const duplicatePlacements = [];
    const unresolvedEligibleTerms = [];

    const normalizedBlocks = (Array.isArray(blocks) ? blocks : []).map((block, index) => ({
      id: cleanText(block && (block.id || block.path)) || `visible-block-${index + 1}`,
      path: cleanText(block && block.path) || `visibleBlocks.${index}`,
      text: cleanText(block && (block.text || block.value || block.content)),
      safetyVisible: Boolean(block && block.safetyVisible),
      sourceIndex: Number.isInteger(block && block.sourceIndex) ? block.sourceIndex : index
    })).filter((block) => block.text);
    const blockCandidates = normalizedBlocks.map((block) => {
      const registryMatches = termMatches(block.text);
      const explicitMatches = supplied.map((entry) => explicitGlossMatch(block.text, entry)).filter(Boolean);
      const matchesByKey = new Map();
      [...registryMatches, ...explicitMatches]
        .sort((left, right) => left.start - right.start || right.term.length - left.term.length)
        .forEach((match) => {
          const key = normalize(match.term);
          if (!key || matchesByKey.has(key)) return;
          matchesByKey.set(key, match);
        });
      const explicitCandidates = [];
      const inferredCandidates = [];
      matchesByKey.forEach((match, key) => {
        if (explicitByKey.has(key) || invalidByKey.has(key)) observedExplicitKeys.add(key);
        if (seenTerms.has(key)) return;
        const invalid = invalidByKey.get(key);
        const explicit = explicitByKey.get(key);
        const candidate = explicit ? { ...match, ...explicit } : match;
        if (invalid) {
          seenTerms.add(key);
          return;
        }
        if (!explicit && !termNeedsExplanation(block.text, candidate, { strictExplanation: true })) {
          return;
        }
        seenTerms.add(key);
        if (hasNearbyExplanation(block.text, candidate, { strictExplanation: true })) return;
        const placement = {
          key,
          term: cleanText(candidate.term),
          plainLanguage: cleanText(candidate.plainLanguage),
          kind: explicit ? "authored-sourced-gloss" : "reviewed-registry-gloss",
          sourceKeys: explicit ? explicit.sourceKeys.slice() : [],
          guidanceKeys: !explicit && Array.isArray(candidate.guidanceKeys) ? candidate.guidanceKeys.slice() : [],
          matchedText: cleanText(candidate.matchedText),
          start: candidate.start,
          end: candidate.end,
          path: block.path,
          blockId: block.id
        };
        if (explicit) explicitCandidates.push(placement);
        else inferredCandidates.push(placement);
      });
      return { block, explicitCandidates, inferredCandidates };
    });

    const inferredCandidates = blockCandidates.flatMap((entry) => entry.inferredCandidates);
    const visibleText = normalizedBlocks.map((block) => block.text).join(" ");
    const visibleWordCount = normalize(visibleText).split(" ").filter(Boolean).length;
    const inferredDensity = visibleWordCount
      ? Number((inferredCandidates.length / visibleWordCount * 100).toFixed(2))
      : 0;
    const longSentenceWithMultipleDifficultTerms = blockCandidates.some((entry) =>
      hasLongSentenceWithDifficultTerms(entry.block.text, entry.inferredCandidates));
    const supportRecommended = inferredCandidates.length >= 3
      || (inferredCandidates.length >= 2 && inferredDensity >= 0.75)
      || longSentenceWithMultipleDifficultTerms;
    let inferredPlaced = 0;
    let explicitPlaced = 0;
    const projectedBlocks = blockCandidates.map(({ block, explicitCandidates, inferredCandidates: blockInferred }) => {
      const glosses = [];
      explicitCandidates.forEach((candidate) => {
        if (placedTerms.has(candidate.key)) {
          duplicatePlacements.push({ term: candidate.term, path: block.path });
          return;
        }
        placedTerms.add(candidate.key);
        explicitPlaced += 1;
        glosses.push(candidate);
      });
      if (supportRecommended) {
        blockInferred.forEach((candidate, index) => {
          const blockLimitReached = index >= maximumInferredPerBlock;
          const cardLimitReached = inferredPlaced >= maximumInferredPerCard;
          if (blockLimitReached || cardLimitReached) {
            unresolvedEligibleTerms.push({
              term: candidate.term,
              path: block.path,
              reason: blockLimitReached
                ? "maximum-inferred-glosses-per-block"
                : "maximum-inferred-glosses-per-card"
            });
            return;
          }
          if (placedTerms.has(candidate.key)) {
            duplicatePlacements.push({ term: candidate.term, path: block.path });
            return;
          }
          placedTerms.add(candidate.key);
          inferredPlaced += 1;
          glosses.push(candidate);
        });
      }
      const frozenGlosses = glosses.map((candidate) => Object.freeze({
        term: candidate.term,
        plainLanguage: candidate.plainLanguage,
        kind: candidate.kind,
        sourceKeys: Object.freeze(candidate.sourceKeys),
        guidanceKeys: Object.freeze(candidate.guidanceKeys),
        matchedText: candidate.matchedText
      }));
      return Object.freeze({
        ...block,
        hasValidExplicitGlosses: validExplicit.length > 0,
        glosses: Object.freeze(frozenGlosses),
        trigger: frozenGlosses.length ? "first-visible-unexplained-term" : ""
      });
    });

    const unplacedExplicitGlosses = supplied
      .filter((entry) => !observedExplicitKeys.has(normalize(entry.term)))
      .map((entry) => Object.freeze({
        term: entry.term,
        plainLanguage: entry.plainLanguage,
        sourceKeys: Object.freeze(entry.sourceKeys.slice())
      }));
    return Object.freeze({
      schemaVersion: VISIBLE_LEARNER_SUPPORT_STANDARD.schemaVersion,
      blocks: Object.freeze(projectedBlocks),
      unplacedExplicitGlosses: Object.freeze(unplacedExplicitGlosses),
      invalidExplicitGlosses: Object.freeze(invalidExplicit.map((entry) => Object.freeze({
        term: entry.term,
        plainLanguage: entry.plainLanguage,
        sourceKeys: Object.freeze([])
      }))),
      seenTerms: Object.freeze(Array.from(seenTerms)),
      duplicatePlacements: Object.freeze(duplicatePlacements),
      unresolvedEligibleTerms: Object.freeze(unresolvedEligibleTerms),
      analysis: Object.freeze({
        visibleWordCount,
        difficultUnexplainedTermCount: inferredCandidates.length,
        difficultUnexplainedTerms: Object.freeze(inferredCandidates.map((entry) => Object.freeze({
          term: entry.term,
          matchedText: entry.matchedText,
          path: entry.path,
          start: entry.start,
          end: entry.end
        }))),
        jargonDensityPer100Words: inferredDensity,
        longSentenceWithMultipleDifficultTerms,
        supportRecommended,
        maximumInferredGlossesPerBlock: maximumInferredPerBlock,
        maximumInferredGlossesPerCard: maximumInferredPerCard
      }),
      metrics: Object.freeze({
        visibleBlocksChecked: normalizedBlocks.length,
        explicitGlossTerms: supplied.length,
        validExplicitGlossTerms: validExplicit.length,
        explicitGlossTermsObserved: observedExplicitKeys.size,
        explicitGlossesPlaced: explicitPlaced,
        inferredGlossesPlaced: inferredPlaced,
        invalidExplicitGlossesSuppressed: invalidExplicit.length,
        unplacedExplicitGlosses: unplacedExplicitGlosses.length,
        duplicatePlacements: duplicatePlacements.length,
        unresolvedEligibleTerms: unresolvedEligibleTerms.length,
        supportRecommended
      })
    });
  }

  function supportForItem(item, options) {
    const settings = options || {};
    const hasVisibleText = Object.prototype.hasOwnProperty.call(settings, "visibleText");
    const source = hasVisibleText ? cleanText(settings.visibleText) : textForItem(item || {});
    const projection = visibleLearnerSupportProjection(item || {}, [{
      id: "visible-text",
      path: "visibleText",
      text: source
    }], {
      maximumInferredGlossesPerBlock: Number(settings.maxInferredGlosses) || 3,
      maximumInferredGlossesPerCard: Number(settings.maxInferredGlosses) || 3
    });
    const baseAnalysis = analyzeText(source, settings);
    const analysis = {
      ...baseAnalysis,
      difficultUnexplainedTerms: projection.analysis.difficultUnexplainedTerms,
      jargonDensityPer100Words: projection.analysis.jargonDensityPer100Words,
      supportRecommended: projection.analysis.supportRecommended,
      difficultyBand: projection.analysis.supportRecommended
        ? "most-learners-may-need-help"
        : (projection.analysis.difficultUnexplainedTermCount ? "some-learners-may-need-help" : "accessible-or-explained")
    };
    const plainLanguage = cleanText(item && (item.plainLanguage || item.plainMeaning || item.termMeaning || item.literalMeaning));
    const whyItMatters = cleanText(item && (item.whyItMatters || item.clinicalSignificance || item.clinicalImportance));
    const glosses = (projection.blocks[0]?.glosses || [])
      .slice(0, Number(settings.maxGlosses) || 6)
      .map((entry) => ({
        ...entry,
        inferredFromReviewedGlossary: entry.kind === "reviewed-registry-gloss"
      }));
    return {
      version: VERSION,
      plainLanguage,
      whyItMatters,
      glosses,
      analysis,
      shouldRender: Boolean(glosses.length)
    };
  }

  function annotateFirstTerms(text, limit) {
    const source = cleanText(text);
    const maximum = Math.max(0, Number(limit) || 2);
    if (!source || !maximum) return source;
    const matches = termMatches(source)
      .filter((match) => termNeedsExplanation(source, match) && !hasNearbyExplanation(source, match))
      .slice(0, maximum);
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
    clinicalReferenceOpeningStandard: CLINICAL_REFERENCE_OPENING_STANDARD,
    clinicalReferenceStructuredSectionStandard: CLINICAL_REFERENCE_STRUCTURED_SECTION_STANDARD,
    visibleLearnerSupportStandard: VISIBLE_LEARNER_SUPPORT_STANDARD,
    routineNursingTerms: ROUTINE_NURSING_TERMS,
    glossary,
    cleanText,
    normalize,
    termMatches,
    hasNearbyExplanation,
    termNeedsExplanation,
    analyzeText,
    textForItem,
    explicitGlosses,
    hasLongSentenceWithDifficultTerms,
    visibleLearnerSupportProjection,
    clinicalReferenceSectionRecords,
    clinicalReferenceResultMeaningText,
    clinicalReferenceStructuredScalarLeaves,
    clinicalReferenceStructuredValueProjection,
    clinicalReferenceStructuredSectionProjection,
    clinicalReferenceOpeningProjection,
    openingOwnershipComparable,
    supportForItem,
    annotateFirstTerms
  });
});
