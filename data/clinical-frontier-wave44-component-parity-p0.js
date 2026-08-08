/* eslint-disable */
/*
 * ANI Clinical Frontier Wave 44 - P0 standalone component parity.
 *
 * These cards deliberately separate independently searchable diseases,
 * tests, devices, procedures, and clinical concepts from their useful
 * comparison/combination cards. Medication lists are explicit-only so a
 * generic template cannot infer an unsafe treatment from another topic.
 */
(function () {
  "use strict";

  const VERSION = "2026-07-22-wave44-component-parity-p0-1";
  const GENERATED_AT = "2026-07-22";
  const GLOBAL_NAME = "ANI_CLINICAL_FRONTIER_WAVE44_COMPONENT_PARITY_P0";
  if (window[GLOBAL_NAME] && window[GLOBAL_NAME].version === VERSION) return;

  const pathologyDatabase = window.ANI_PATHOLOGY_DATABASE = window.ANI_PATHOLOGY_DATABASE || { diseases: [], sourceReferences: [] };
  const diagnosticDatabase = window.ANI_DIAGNOSTIC_DATABASE = window.ANI_DIAGNOSTIC_DATABASE || { entries: [], sourceReferences: [] };
  const foundationDatabase = window.ANI_FOUNDATIONS_DATABASE = window.ANI_FOUNDATIONS_DATABASE || { entries: [], sourceReferences: [] };
  pathologyDatabase.diseases = Array.isArray(pathologyDatabase.diseases) ? pathologyDatabase.diseases : [];
  diagnosticDatabase.entries = Array.isArray(diagnosticDatabase.entries) ? diagnosticDatabase.entries : [];
  foundationDatabase.entries = Array.isArray(foundationDatabase.entries) ? foundationDatabase.entries : [];

  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const unique = (values) => Array.from(new Map((values || []).filter(Boolean).map((value) => [normalize(value), value])).values());

  /*
   * Wave 44 reuses evidence anchors that were originally declared by several
   * earlier cohorts. Those declarations were not consistently copied into
   * each collection's sourceReferences array, so a diagnostic or foundation
   * card could cite a real source key that only the pathology database owned.
   * Keep one authoritative catalog here, copy an already-registered record
   * when possible, and use the catalog only when an older cohort never
   * registered its declaration centrally.
   */
  const wave44SourceCatalog = Object.freeze({
    "abg-vbg-systematic-review-2024": {
      key: "abg-vbg-systematic-review-2024",
      label: "Arterial versus venous blood gas agreement systematic review (2024)",
      url: "https://pubmed.ncbi.nlm.nih.gov/38856155/"
    },
    "aha-asa-ais-2026": {
      key: "aha-asa-ais-2026",
      label: "2026 AHA/ASA Guideline for Early Management of Acute Ischemic Stroke",
      url: "https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke/top-things-to-know"
    },
    "ajkd-mixed-acid-base-2025": {
      key: "ajkd-mixed-acid-base-2025",
      label: "Mixed Acid-Base Disorders: Core Curriculum 2025",
      url: "https://pubmed.ncbi.nlm.nih.gov/40728495/"
    },
    "fena-meta-analysis": {
      key: "fena-meta-analysis",
      label: "Diagnostic Performance of Fractional Excretion of Sodium for AKI Differentiation: Systematic Review and Meta-analysis",
      url: "https://pubmed.ncbi.nlm.nih.gov/35545442/"
    },
    "kdigo-aki-2012": {
      key: "kdigo-aki-2012",
      label: "KDIGO 2012 Clinical Practice Guideline for Acute Kidney Injury (final guideline)",
      url: "https://kdigo.org/guidelines/acute-kidney-injury/kdigo-2012-aki-guideline-english/"
    },
    medlineplus: {
      key: "medlineplus",
      label: "MedlinePlus Medical Encyclopedia",
      url: "https://medlineplus.gov/encyclopedia.html"
    },
    "ninds-nihss": {
      key: "ninds-nihss",
      label: "NINDS Official NIH Stroke Scale",
      url: "https://www.ninds.nih.gov/sites/default/files/migrate-documents/nih_stroke_scale_booklet_508c.pdf"
    },
    "ninds-stroke-assess": {
      key: "ninds-stroke-assess",
      label: "NINDS Stroke Assessment and Treatment",
      url: "https://www.ninds.nih.gov/health-information/stroke/assess-and-treat"
    },
    "w37-ada-diabetes-2026": {
      key: "w37-ada-diabetes-2026",
      label: "American Diabetes Association: Standards of Care in Diabetes - 2026, Diagnosis and Classification",
      url: "https://diabetesjournals.org/care/article/49/Supplement_1/S27/163926/2-Diagnosis-and-Classification-of-Diabetes",
      note: "Supports current diabetes classification, diagnostic criteria, confirmation rules, specimen requirements, and important limits of glucose, A1C, and oral-glucose-tolerance testing."
    },
    "w37-aha-hf-2022": {
      key: "w37-aha-hf-2022",
      label: "AHA/ACC/HFSA: 2022 Guideline for the Management of Heart Failure",
      url: "https://professional.heart.org/-/media/832EA0F4E73948848612F228F7FA2D35.pdf",
      note: "Supports use and limitations of BNP and NT-proBNP in heart-failure diagnosis, exclusion, risk stratification, and prognosis."
    },
    "w37-fda-entresto-2024": {
      key: "w37-fda-entresto-2024",
      label: "US Food and Drug Administration: Entresto prescribing information",
      url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/207620s025%2C218591s000lbl.pdf",
      note: "Supports the neprilysin-inhibitor context and the distinction between BNP and NT-proBNP trends during sacubitril/valsartan treatment."
    },
    "w37-ncbi-natriuretic-peptides": {
      key: "w37-ncbi-natriuretic-peptides",
      label: "NCBI Bookshelf: Chronic Heart Failure in Adults - Diagnosing heart failure",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK536086/",
      note: "Supports clinical-context interpretation of natriuretic peptides and important cardiac and noncardiac causes of altered concentrations."
    },
    "w37-niddk-diabetes-testing": {
      key: "w37-niddk-diabetes-testing",
      label: "National Institute of Diabetes and Digestive and Kidney Diseases: Diabetes and Prediabetes Tests",
      url: "https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/diabetes/diabetes-prediabetes",
      note: "Supports laboratory testing, diagnostic ranges, confirmation, specimen requirements, and why home-meter results are not diagnostic laboratory results."
    },
    "cdc-cauti-recommendations": {
      key: "cdc-cauti-recommendations",
      label: "CDC: Guideline for Prevention of Catheter-Associated Urinary Tract Infections - Summary of Recommendations",
      url: "https://www.cdc.gov/infection-control/hcp/cauti/summary-of-recommendations.html",
      note: "Supports appropriate catheter indications, aseptic insertion, closed unobstructed drainage, daily necessity review, prompt removal, and avoidance of routine antimicrobial prophylaxis or fixed-interval changes."
    },
    "fda-supplements": {
      key: "fda-supplements",
      label: "FDA: Dietary Supplements",
      url: "https://www.fda.gov/food/dietary-supplements"
    },
    "medlineplus-herbals": {
      key: "medlineplus-herbals",
      label: "NIH MedlinePlus: Herbs and Supplements",
      url: "https://medlineplus.gov/druginfo/herb_All.html"
    },
    "w34-cdc-hai": {
      key: "w34-cdc-hai",
      label: "CDC: Healthcare-Associated Infections",
      url: "https://www.cdc.gov/healthcare-associated-infections/about/index.html",
      note: "Supports prevention and recognition of central-line, ventilator, postoperative, and other healthcare-associated infections."
    },
    "w34-nhlbi-lung": {
      key: "w34-nhlbi-lung",
      label: "NHLBI: Lung Diseases",
      url: "https://www.nhlbi.nih.gov/health/lung-diseases",
      note: "Supports official respiratory-failure, hypoxemia, occupational-lung, pulmonary-vascular, and airway education."
    },
    "aap-child-abuse": {
      key: "aap-child-abuse",
      label: "American Academy of Pediatrics: Evaluation of Suspected Child Physical Abuse",
      url: "https://publications.aap.org/pediatrics/article/135/5/e1337/33747/The-Evaluation-of-Suspected-Child-Physical-Abuse",
      note: "Supports developmentally informed histories, complete examination and objective documentation, occult-injury assessment, mandated reporting, and child-abuse specialist coordination."
    },
    "aap-sexual-abuse": {
      key: "aap-sexual-abuse",
      label: "American Academy of Pediatrics: Evaluation When Child Sexual Abuse Is Suspected",
      url: "https://publications.aap.org/pediatrics/article/132/2/e558/31459/The-Evaluation-of-Children-in-the-Primary-Care",
      note: "Supports immediate safety triage, limited nonleading medical history, injury assessment, mandated reporting, specialist referral, and supportive caregiver education."
    },
    "aap-trafficking": {
      key: "aap-trafficking",
      label: "American Academy of Pediatrics: Exploitation, Labor and Sex Trafficking of Children and Adolescents",
      url: "https://publications.aap.org/pediatrics/article/151/1/e2022060416/190310/Exploitation-Labor-and-Sex-Trafficking-of-Children",
      note: "Supports trauma-informed recognition, confidential assessment, immediate safety planning, multidisciplinary referral, and careful response to suspected exploitation."
    },
    "aha-stroke-2026": {
      key: "aha-stroke-2026",
      label: "American Heart Association: 2026 Guideline for Early Management of Acute Ischemic Stroke",
      url: "https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke",
      note: "Supports rapid recognition, last-known-well documentation, imaging and reperfusion evaluation, localization, stroke-unit monitoring, swallowing safety, and secondary prevention."
    },
    "cdc-cleft": {
      key: "cdc-cleft",
      label: "Centers for Disease Control and Prevention: Cleft Lip and Cleft Palate",
      url: "https://www.cdc.gov/birth-defects/about/cleft-lip-cleft-palate.html",
      note: "Supports feeding, hearing, speech, dental, surgical, and multidisciplinary care for infants and children with cleft lip or palate."
    },
    "cdc-overdose": {
      key: "cdc-overdose",
      label: "Centers for Disease Control and Prevention: Overdose Prevention",
      url: "https://www.cdc.gov/overdose-prevention/prevention/index.html",
      note: "Supports overdose recognition, risk reduction, emergency response, polysubstance danger, treatment connection, and prevention after a nonfatal overdose."
    },
    "cdc-opioid-guideline-2022": {
      key: "cdc-opioid-guideline-2022",
      label: "CDC Clinical Practice Guideline for Prescribing Opioids for Pain (2022)",
      url: "https://www.cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm"
    },
    "dailymed-depakote": {
      key: "dailymed-depakote",
      label: "DailyMed: Depakote (divalproex sodium) prescribing information",
      url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ded64147-7a43-4055-accc-2c011828079d"
    },
    "dailymed-dilantin": {
      key: "dailymed-dilantin",
      label: "DailyMed: Dilantin (phenytoin sodium) prescribing information",
      url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=db8c69b0-4697-433e-98c7-b0b2d2c52a83"
    },
    "fda-opioid-labeling-2023": {
      key: "fda-opioid-labeling-2023",
      label: "FDA opioid pain medicine labeling update (2023)",
      url: "https://www.fda.gov/drugs/drug-safety-communications/fda-updates-prescribing-information-all-opioid-pain-medicines-provide-additional-guidance-safe-use"
    },
    "nih-hiv": {
      key: "nih-hiv",
      label: "U.S. Department of Health and Human Services: HIV Clinical Guidelines",
      url: "https://clinicalinfo.hiv.gov/en/guidelines",
      note: "Supports antiretroviral therapy, viral-load and CD4 monitoring, opportunistic-infection prevention, interaction review, adherence support, and transmission counseling."
    },
    "samhsa-tip63": {
      key: "samhsa-tip63",
      label: "SAMHSA TIP 63: Medications for Opioid Use Disorder",
      url: "https://www.samhsa.gov/resource/recovery/medications-opioid-use-disorder"
    }
  });
  window.ANI_WAVE44_AUTHORITATIVE_SOURCE_CATALOG = wave44SourceCatalog;

  const sourceKeyOf = (source) => String(source && (source.key || source.id) || "").trim();
  const sourceStores = () => [
    pathologyDatabase,
    diagnosticDatabase,
    foundationDatabase,
    window.ANI_PHARM_DATABASE,
    window.ANI_HOLISTIC_DATABASE
  ].filter((database) => database && Array.isArray(database.sourceReferences));

  function registeredSourceFor(key, targetDatabase) {
    for (const database of sourceStores()) {
      if (database === targetDatabase) continue;
      const source = database.sourceReferences.find((entry) => sourceKeyOf(entry) === key);
      if (source) return source;
    }
    return null;
  }

  function registerSourceKeys(targetDatabase, keys) {
    targetDatabase.sourceReferences = Array.isArray(targetDatabase.sourceReferences)
      ? targetDatabase.sourceReferences
      : [];
    const registered = [];
    const unresolved = [];
    unique(keys).forEach((key) => {
      const existing = targetDatabase.sourceReferences.find((entry) => sourceKeyOf(entry) === key);
      const elsewhere = registeredSourceFor(key, targetDatabase);
      const catalog = wave44SourceCatalog[key];
      const resolved = { ...(catalog || {}), ...(elsewhere || {}), ...(existing || {}), key, id: key };
      if (!resolved.label || !resolved.url) {
        unresolved.push(key);
        return;
      }
      if (existing) Object.assign(existing, resolved);
      else targetDatabase.sourceReferences.push(resolved);
      registered.push(key);
    });
    return Object.freeze({
      registered: Object.freeze(registered.slice()),
      unresolved: Object.freeze(unresolved.slice())
    });
  }

  function diagnosticCard(spec) {
    return {
      name: spec.name,
      displayName: spec.name,
      fullForm: spec.fullForm || spec.name,
      type: spec.type || "diagnostic-test",
      diagnosticKind: spec.diagnosticKind || "clinical",
      icon: spec.icon || "Clinical",
      category: spec.category,
      summary: spec.definition,
      quickAnswer: spec.quickAnswer || spec.definition,
      resultMeanings: spec.resultMeanings || [],
      sections: [
        { label: "What it is and why it matters", text: spec.definition },
        { label: "How it is obtained or performed", text: spec.method },
        { label: "What the result means", text: spec.interpretation },
        { label: "Limitations and false reassurance", text: spec.limitations },
        { label: "Safety and contraindications", text: spec.safety },
        { label: "Nursing assessment, preparation, and documentation", text: spec.nursing },
        { label: "Urgent escalation", text: spec.urgent },
        { label: "Connected topics", text: (spec.relatedTopics || []).join("; ") }
      ],
      aliases: unique(spec.aliases || []),
      abbreviations: unique(spec.abbreviations || []),
      commonMisspellings: unique(spec.commonMisspellings || []),
      relatedTopics: unique(spec.relatedTopics || []),
      tags: unique(["wave44", "standalone component", "diagnostics", ...(spec.tags || [])]),
      sourceKeys: unique(spec.sourceKeys || []),
      sourceNote: spec.sourceNote || "Educational synthesis from the source set already registered on the related ANI comparison card. Interpret results with the patient, specimen, timing, assay, and current local protocol.",
      evidenceLastReviewed: GENERATED_AT,
      educationalArticle: true,
      nclexEssential: true,
      hidden: false,
      studentFacing: true,
      componentParityWave44: true
    };
  }

  function clinicalCard(spec) {
    return {
      name: spec.name,
      displayName: spec.name,
      category: spec.category,
      sourceCategory: spec.sourceCategory || spec.category,
      definition: spec.definition,
      pathology: spec.pathology,
      pathophysiology: spec.pathophysiology || spec.pathology,
      classification: spec.classification || [],
      etiology: spec.etiology,
      riskFactors: spec.riskFactors || [],
      signsSymptoms: spec.signsSymptoms || [],
      diagnostics: spec.diagnostics || [],
      labs: spec.labs || [],
      differentialDiagnoses: spec.differentialDiagnoses || [],
      treatments: spec.treatments || [],
      complications: spec.complications || [],
      contraindications: spec.contraindications || [],
      nursingPriorities: spec.nursingPriorities || [],
      redFlags: spec.redFlags || [],
      patientEducation: spec.patientEducation || [],
      nclexTraps: spec.nclexTraps || [],
      aliases: unique(spec.aliases || []),
      abbreviations: unique(spec.abbreviations || []),
      commonMisspellings: unique(spec.commonMisspellings || []),
      relatedTopics: unique(spec.relatedTopics || []),
      tags: unique(["wave44", "standalone component", ...(spec.tags || [])]),
      sourceKeys: unique(spec.sourceKeys || []),
      sourceNote: spec.sourceNote || "Educational synthesis from the source set already registered on the related ANI comparison card. Patient-specific diagnosis and treatment require current clinical guidance.",
      directTreatmentMedications: unique(spec.directTreatmentMedications || []),
      medicationsCommonlyUsed: unique(spec.directTreatmentMedications || []),
      medicationInferenceMode: "explicit-only",
      medicationTreatmentSafetyPolicy: "curated-explicit-v2",
      medicationTreatmentReviewDisposition: unique(spec.directTreatmentMedications || []).length
        ? "reviewed-direct-list"
        : "reviewed-no-direct-medication",
      medicationTreatmentNote: spec.medicationTreatmentNote || "No medication should be inferred from the topic name. Treatment is cause-, severity-, and patient-specific.",
      evidenceLastReviewed: GENERATED_AT,
      entryType: spec.entryType || "clinical-concept",
      confidenceTier: "Curated full study card",
      nclexEssential: true,
      hidden: false,
      studentFacing: true,
      componentParityWave44: true
    };
  }

  function foundationCard(spec) {
    return {
      name: spec.name,
      displayName: spec.name,
      type: spec.type || "clinical-reference",
      category: spec.category,
      icon: spec.icon || "Clinical",
      summary: spec.definition,
      quickAnswer: spec.definition,
      sections: [
        { label: "Definition and purpose", text: spec.definition },
        { label: "How it works", text: spec.mechanism },
        { label: "Assessment and safe use", text: spec.assessment },
        { label: "Complications and limitations", text: spec.complications },
        { label: "Nursing priorities and documentation", text: spec.nursing },
        { label: "Urgent escalation", text: spec.urgent },
        { label: "Patient and family teaching", text: spec.teaching },
        { label: "Connected topics", text: (spec.relatedTopics || []).join("; ") }
      ],
      aliases: unique(spec.aliases || []),
      abbreviations: unique(spec.abbreviations || []),
      commonMisspellings: unique(spec.commonMisspellings || []),
      relatedTopics: unique(spec.relatedTopics || []),
      tags: unique(["wave44", "standalone component", "clinical reference", ...(spec.tags || [])]),
      sourceKeys: unique(spec.sourceKeys || []),
      sourceNote: spec.sourceNote || "Educational synthesis from the source set already registered on the related ANI card. Follow current facility policy and device-specific instructions.",
      evidenceLastReviewed: GENERATED_AT,
      educationalArticle: true,
      nclexEssential: true,
      hidden: false,
      studentFacing: true,
      componentParityWave44: true
    };
  }

  const diagnosticCards = [
    diagnosticCard({
      name: "Serum total carbon dioxide",
      fullForm: "Serum total carbon dioxide (chemistry total CO2)",
      diagnosticKind: "lab",
      category: "Diagnostics and Tests / Acid-Base Laboratory Tests",
      aliases: ["total CO2", "chemistry CO2", "serum CO2", "plasma total carbon dioxide", "metabolic panel carbon dioxide"],
      abbreviations: ["TCO2", "CO2"],
      commonMisspellings: ["serum total c02", "total carbon dioxde"],
      definition: "Serum total carbon dioxide is the carbon-dioxide content measured on a chemistry specimen. Most of that content is bicarbonate, with smaller amounts of dissolved carbon dioxide and carbonic species. It is therefore a practical estimate of the metabolic bicarbonate pool, but it is not analytically identical to the bicarbonate calculated from pH and PCO2 on a blood gas.",
      method: "A venous serum or plasma sample is analyzed on the chemistry platform, commonly as part of a basic or comprehensive metabolic panel. No arterial puncture is required. Collection time, tube handling, exposure to air, and delay before analysis matter because carbon dioxide can escape from the specimen.",
      interpretation: "A low result can reflect metabolic acidosis, renal bicarbonate loss, gastrointestinal bicarbonate loss, ketoacidosis, lactic acidosis, toxin-related acid accumulation, or renal failure; respiratory alkalosis can also lower bicarbonate through compensation. A high result can reflect metabolic alkalosis or compensation for chronic respiratory acidosis. Interpret it with sodium, chloride, albumin, anion gap, potassium, kidney function, pH, PCO2, losses, medications, and the clinical timeline.",
      limitations: "The number does not identify the cause of an acid-base disorder and cannot distinguish a primary metabolic process from renal compensation without pH and respiratory context. Chemistry total CO2 and blood-gas calculated HCO3 may differ because they use different specimens, methods, timing, and assumptions. A discordant or implausible result should be checked rather than averaged mentally.",
      safety: "Venipuncture has ordinary bleeding, bruising, and infection risks. There is no universal critical cutoff independent of pH, potassium, symptoms, and local laboratory policy. Do not give bicarbonate solely because total CO2 is low; cause-directed therapy is required and unnecessary alkali can worsen sodium load, volume status, potassium shift, or alkalemia.",
      nursing: "Record the specimen time relative to vomiting, diarrhea, ventilation change, IV fluids, insulin, dialysis, bicarbonate, diuretics, or resuscitation. Trend the entire electrolyte and blood-gas pattern, assess respiratory effort and mental status, and promptly repeat a result that conflicts with the patient or appears affected by collection error.",
      urgent: "Escalate severe respiratory distress, fatigue, altered consciousness, shock, dysrhythmia, dangerous potassium change, suspected poisoning, progressive kidney failure, or a rapidly changing CO2/pH pattern. Stabilize airway, breathing, and circulation while the mechanism is being defined.",
      resultMeanings: [["Low", "Usually signals reduced bicarbonate from metabolic acidosis or compensation for respiratory alkalosis."], ["High", "Usually signals increased bicarbonate from metabolic alkalosis or compensation for chronic respiratory acidosis."], ["Discordant with blood gas", "Compare times, specimens, treatment, and handling; neither value should be substituted blindly for the other."]],
      relatedTopics: ["ABG", "VBG", "Bicarbonate", "Anion gap physiology and interpretation", "Metabolic acidosis", "Metabolic alkalosis"],
      sourceKeys: ["abg-vbg-systematic-review-2024", "ajkd-mixed-acid-base-2025"]
    }),
    diagnosticCard({
      name: "Noncontrast head CT",
      fullForm: "Noncontrast computed tomography of the head",
      diagnosticKind: "imaging",
      category: "Diagnostics and Tests / Neuroimaging / Emergency Stroke Imaging",
      aliases: ["noncontrast CT head", "unenhanced head CT", "plain head CT", "stroke CT", "NCCT brain"],
      abbreviations: ["NCCT", "NCHCT"],
      definition: "Noncontrast head CT is a rapid x-ray-based scan performed without intravenous contrast. In acute neurologic emergencies its first job is usually to identify intracranial hemorrhage, a large established infarct, mass effect, hydrocephalus, or another structural emergency; a normal early scan does not exclude acute ischemic stroke.",
      method: "The patient lies on the CT table while thin axial images are acquired within seconds. Metal and motion can degrade the study. Stroke teams obtain the scan urgently because treatment decisions depend on excluding blood and estimating the amount of already injured tissue, not because CT must show every early ischemic lesion.",
      interpretation: "Acute blood is usually hyperdense. Early ischemic clues include loss of gray-white differentiation, sulcal effacement, insular ribbon loss, and a hyperdense artery, but these may be subtle or absent. The scan must be integrated with examination, last-known-well time, glucose, and vascular imaging when a large-vessel occlusion is possible.",
      limitations: "Sensitivity for small, very early, brainstem, or posterior-fossa ischemia is limited. A negative scan is not a 'no stroke' result. Beam-hardening, motion, old infarct, tumor, infection, or calcification can complicate interpretation. CT shows anatomy; it does not directly measure arterial lumen or tissue perfusion.",
      safety: "CT uses ionizing radiation. Pregnancy status should be considered without delaying life-saving brain imaging; shielding and protocol decisions are site-specific. Sedation or restraint may be hazardous in an unstable patient and requires monitoring. Because this study is noncontrast, iodinated-contrast allergy and kidney risk do not apply unless another contrast study is added.",
      nursing: "Document neurologic baseline, glucose, anticoagulants, onset and last-known-well times, pregnancy possibility, ability to lie flat, oxygen and airway needs, and changes during transport. Keep emergency monitoring and stroke communication active; do not let transport interrupt time-critical assessment or blood-pressure and airway goals.",
      urgent: "Immediately escalate new hemorrhage, mass effect, herniation signs, rapidly declining consciousness, seizure, unequal pupils, worsening deficit, or imaging delay in a potentially treatable stroke. Treatment eligibility remains a stroke-team decision based on the entire patient.",
      resultMeanings: [["No acute hemorrhage", "Removes one major contraindication to selected reperfusion pathways but does not prove that no ischemic stroke exists."], ["Acute hemorrhage", "Activates hemorrhage, blood-pressure, reversal, and neurosurgical pathways."], ["Large established infarct or mass effect", "Signals greater edema and hemorrhagic-transformation risk and changes reperfusion and critical-care decisions."]],
      relatedTopics: ["CT angiography", "CT perfusion", "Diffusion-weighted imaging", "Acute ischemic stroke", "Intracerebral hemorrhage"],
      sourceKeys: ["aha-asa-ais-2026", "ninds-stroke-assess"]
    }),
    diagnosticCard({
      name: "CT angiography",
      fullForm: "Computed tomography angiography",
      diagnosticKind: "imaging",
      category: "Diagnostics and Tests / Vascular Imaging",
      aliases: ["CTA", "CT angiogram", "head and neck CTA", "stroke vessel imaging", "computed tomographic angiography"],
      abbreviations: ["CTA"],
      definition: "CT angiography is contrast-enhanced CT timed to display the arterial lumen. In acute stroke it can identify a large-vessel occlusion, severe stenosis, dissection, aneurysm, or other vascular lesion and show the arterial route that may be relevant to thrombectomy.",
      method: "Iodinated contrast is injected rapidly through a suitable IV while images are acquired at the arterial phase. Head and neck coverage is common in stroke pathways. Accurate bolus timing, adequate IV flow, still positioning, and appropriate reconstruction are necessary for a diagnostic study.",
      interpretation: "A missing or abruptly cut-off arterial column suggests occlusion; narrowed, irregular, dissected, or aneurysmal vessels require context and specialist interpretation. Collateral filling can influence tissue survival but does not replace perfusion or clinical assessment. CTA answers where blood can flow, not how much tissue is already irreversibly injured.",
      limitations: "Poor bolus timing, motion, low cardiac output, venous contamination, heavy calcification, and very distal lesions can mislead. A normal CTA does not exclude small-vessel stroke. Apparent stenosis may be artifact, and an anatomic lesion is not automatically the cause of the current symptoms.",
      safety: "Assess prior severe iodinated-contrast reaction, kidney context, pregnancy, IV adequacy, and metformin or other policy-specific considerations without creating avoidable treatment delay. Contrast extravasation and hypersensitivity can occur. Modern emergency decisions balance these risks against the harm of missing a treatable vascular occlusion.",
      nursing: "Verify IV patency and contrast history, document neurologic and renal context, monitor the injection site and patient during and after contrast, and report hives, wheeze, hypotension, swelling, or pain. Keep stroke-team communication active while images are reconstructed and interpreted.",
      urgent: "Escalate large-vessel occlusion, dissection, ruptured or symptomatic aneurysm, contrast reaction, extravasation threatening tissue, or clinical deterioration. CTA findings should route immediately to the appropriate stroke, vascular, neurosurgical, or emergency team.",
      resultMeanings: [["Large-vessel occlusion", "May identify a thrombectomy target when clinical, time, and imaging criteria align."], ["Stenosis or dissection", "May explain ischemia and changes antithrombotic or procedural planning."], ["No proximal occlusion", "Does not exclude small-vessel, distal, transient, or already reperfused ischemia."]],
      relatedTopics: ["Noncontrast head CT", "CT perfusion", "Large-vessel occlusion stroke", "Aortic dissection", "Intracranial aneurysm"],
      sourceKeys: ["aha-asa-ais-2026", "ninds-stroke-assess"]
    }),
    diagnosticCard({
      name: "CT perfusion",
      fullForm: "Computed tomography perfusion imaging",
      diagnosticKind: "imaging",
      category: "Diagnostics and Tests / Neuroimaging / Perfusion Imaging",
      aliases: ["CTP", "brain perfusion CT", "stroke perfusion CT", "perfusion map CT"],
      abbreviations: ["CTP"],
      definition: "CT perfusion repeatedly images the passage of iodinated contrast through brain tissue to estimate blood flow, blood volume, and contrast-arrival timing. Software uses these measurements to estimate severely injured core and hypoperfused tissue that may still be salvageable; the maps are probabilistic models, not photographs of dead and living brain.",
      method: "A rapid contrast bolus is followed by serial CT acquisitions over a selected brain volume. Motion correction, arterial and venous input selection, acquisition duration, and vendor-specific processing generate maps such as cerebral blood flow, cerebral blood volume, mean transit time, and Tmax.",
      interpretation: "A region with critically reduced flow may be labeled core, while a larger delayed-perfusion region may represent tissue at risk. The difference is called mismatch. Decisions use validated thresholds and the clinical syndrome, noncontrast CT, CTA, time, and local protocol rather than visual color alone.",
      limitations: "Motion, poor cardiac output, delayed bolus, carotid disease, chronic infarct, seizure, migraine, small lesions, posterior-fossa coverage, and software thresholds can over- or underestimate core. Very early severe hypoperfusion can look irreversible even when tissue later recovers, and late spontaneous reperfusion can obscure the original deficit.",
      safety: "CTP adds ionizing radiation and iodinated contrast. Apply the same contrast-reaction, kidney, pregnancy, IV, and extravasation precautions used for CTA. Do not delay immediate standard treatment merely to obtain perfusion imaging when the current guideline and local pathway do not require it.",
      nursing: "Confirm IV flow capacity, document onset and last-known-well, maintain immobility and monitoring, and communicate motion or injection problems because they can invalidate the maps. Record contrast exposure when multiple CT studies are performed.",
      urgent: "Escalate a favorable mismatch in a potentially eligible patient, extensive estimated core, worsening examination, contrast reaction, or a map that conflicts with the vascular lesion and symptoms. Expert image review is required before high-stakes treatment decisions.",
      resultMeanings: [["Core estimate", "Tissue with severe modeled flow reduction and a higher likelihood of irreversible injury."], ["Hypoperfused region", "Tissue receiving delayed or reduced blood flow; not all of it will infarct."], ["Mismatch", "The modeled difference between hypoperfused tissue and core, used in selected late- or unknown-window pathways."]],
      relatedTopics: ["Ischemic core", "Ischemic penumbra", "CT angiography", "Wake-up stroke", "Mechanical thrombectomy"],
      sourceKeys: ["aha-asa-ais-2026", "ninds-stroke-assess"]
    }),
    diagnosticCard({
      name: "Diffusion-weighted imaging",
      fullForm: "Diffusion-weighted magnetic resonance imaging",
      diagnosticKind: "imaging",
      category: "Diagnostics and Tests / Neuroimaging / MRI Sequences",
      aliases: ["DWI MRI", "diffusion MRI", "MRI diffusion", "stroke DWI"],
      abbreviations: ["DWI"],
      definition: "Diffusion-weighted imaging is an MRI sequence sensitive to the microscopic movement of water. Acute cellular energy failure causes cytotoxic edema and restricts water motion, often making an ischemic lesion bright on DWI within minutes; true restriction is confirmed by a low apparent diffusion coefficient.",
      method: "MRI gradients encode water motion in several directions and produce diffusion-weighted images with corresponding ADC maps. The patient must pass MRI safety screening and remain sufficiently still. Acquisition is fast, but total MRI access and setup may be slower than CT in an emergency.",
      interpretation: "DWI brightness with low ADC supports acute restricted diffusion, commonly acute infarction. Distribution helps identify vascular territory, embolic pattern, small lacunar lesions, or another process. DWI-FLAIR mismatch may support selected unknown-onset treatment pathways under protocol.",
      limitations: "Early small posterior-circulation, brainstem, or transient lesions can be DWI-negative. Seizure, abscess, hypoglycemia, encephalitis, highly cellular tumor, and other disorders can restrict diffusion. T2 shine-through can look bright on DWI without low ADC, so DWI must be read with ADC and other sequences.",
      safety: "MRI has no ionizing radiation but the magnetic field, radiofrequency heating, acoustic noise, implants, foreign bodies, monitoring limitations, claustrophobia, and sedation create hazards. Verify every device and implant rather than assuming 'MRI-safe.' Gadolinium is not required for routine DWI itself.",
      nursing: "Complete formal MRI screening, remove prohibited objects, document devices and pregnancy context, maintain compatible monitoring and airway access, and report sudden symptoms. Do not allow MRI logistics to delay a faster life-saving pathway when CT-based evaluation is appropriate.",
      urgent: "Escalate acute restricted diffusion matching a disabling deficit, posterior-circulation findings, seizure or deterioration in the scanner, or any MRI safety event. A negative DWI must not overrule a convincing evolving stroke syndrome.",
      resultMeanings: [["Bright DWI plus low ADC", "Supports true restricted diffusion, often acute infarction in the correct pattern."], ["Bright DWI without low ADC", "May represent T2 shine-through rather than true restriction."], ["Negative DWI", "Reduces but does not eliminate the possibility of acute ischemic stroke, especially early or in small posterior lesions."]],
      relatedTopics: ["Apparent diffusion coefficient map", "MRI", "Acute ischemic stroke", "Wake-up stroke", "Posterior circulation stroke"],
      sourceKeys: ["aha-asa-ais-2026", "ninds-stroke-assess"]
    }),
    diagnosticCard({
      name: "Apparent diffusion coefficient map",
      fullForm: "Apparent diffusion coefficient map",
      diagnosticKind: "imaging",
      category: "Diagnostics and Tests / Neuroimaging / MRI Quantitative Maps",
      aliases: ["ADC map", "apparent diffusion coefficient", "MRI ADC", "diffusion coefficient map"],
      abbreviations: ["ADC"],
      definition: "An apparent diffusion coefficient map is the quantitative companion to diffusion-weighted MRI. It estimates the magnitude of water diffusion in each voxel; truly restricted diffusion usually appears dark because the ADC is reduced, helping separate acute cytotoxic edema from simple DWI brightness caused by T2 shine-through.",
      method: "Software calculates ADC from images acquired with different diffusion weightings. The map is generated automatically with DWI and must be reviewed in anatomic alignment with DWI, FLAIR, other MRI sequences, and the clinical syndrome.",
      interpretation: "Low ADC within a DWI-bright vascular lesion supports acute restricted diffusion. ADC changes over time and may pseudonormalize in the subacute phase before becoming elevated with chronic tissue loss. Values vary by scanner, sequence, region, and pathology, so there is no universal single-number stroke cutoff for bedside use.",
      limitations: "Noise, susceptibility, motion, partial volume, hemorrhage, calcification, and misregistration can distort the map. Abscess, seizure-related change, hypoglycemia, and selected tumors can also lower ADC. A normal ADC does not exclude a very early, tiny, or technically missed infarct.",
      safety: "The map adds no separate radiation or contrast beyond the MRI examination, but all MRI screening and monitoring requirements still apply. Never interpret ADC without DWI and anatomic images.",
      nursing: "Document MRI safety screening and examination timing, and communicate motion, incomplete sequences, or abrupt clinical change. In handoff, say 'DWI bright with low ADC' or describe the radiology impression rather than calling any dark area a stroke.",
      urgent: "Escalate a new restricted-diffusion pattern that matches an acute deficit, discordant imaging with worsening symptoms, or a scanner safety event. Reperfusion decisions remain time-, patient-, and protocol-specific.",
      resultMeanings: [["Low ADC", "Supports restricted diffusion in the correct DWI and clinical pattern."], ["Normal or high ADC with DWI brightness", "Raises T2 shine-through or nonacute tissue change."], ["Pseudonormal ADC", "Can occur subacutely, so timing and other sequences are essential."]],
      relatedTopics: ["Diffusion-weighted imaging", "MRI", "Ischemic core", "Acute ischemic stroke"],
      sourceKeys: ["aha-asa-ais-2026", "ninds-stroke-assess"]
    }),
    diagnosticCard({
      name: "Urine sediment examination",
      fullForm: "Microscopic urine sediment examination",
      diagnosticKind: "lab",
      category: "Diagnostics and Tests / Renal Laboratory Tests / Urine Microscopy",
      aliases: ["urine microscopy", "urinary sediment", "urine sediment analysis", "microscopic urinalysis"],
      abbreviations: ["urine micro"],
      definition: "Urine sediment examination is microscopic evaluation of cells, casts, crystals, organisms, and debris after urine is concentrated. The pattern can localize kidney injury: casts form within renal tubules, so cellular or granular casts provide information that a dipstick alone cannot.",
      method: "A fresh, properly collected urine specimen is centrifuged or analyzed by a validated automated/manual method, and the concentrated sediment is examined. Timing and collection quality matter because cells and casts deteriorate, crystals can form after cooling, and contamination can add epithelial cells or organisms.",
      interpretation: "Muddy brown granular casts and tubular epithelial cells support acute tubular injury; red-cell casts or dysmorphic red cells suggest glomerular bleeding; white-cell casts can occur with interstitial inflammation or pyelonephritis; hyaline casts may be nonspecific. Crystals require urine pH, medication, diet, kidney function, and clinical context.",
      limitations: "Absence of a classic cast does not exclude kidney disease, and observer skill affects sensitivity. Menstrual, skin, catheter, and collection contamination can mimic disease. Automated systems may miss or misclassify important elements, and delayed analysis changes morphology.",
      safety: "Collection is usually low risk. Use clean-catch or catheter-specimen technique only when indicated; never insert a catheter solely for convenience when a safer sample is possible. Handle urine as potentially infectious material.",
      nursing: "Document collection method, timing, urine appearance, menstruation or catheter context, antibiotics and nephrotoxins, and whether the sample reached the lab promptly. Correlate microscopy with creatinine trend, urine output, dipstick, protein, culture, electrolytes, and hemodynamics.",
      urgent: "Escalate red-cell casts with rapidly rising creatinine, oliguria, pulmonary hemorrhage, severe hypertension, pregnancy danger signs, suspected pyelonephritis with sepsis, or muddy casts with worsening AKI and electrolyte instability.",
      resultMeanings: [["Muddy brown granular casts", "Support acute tubular injury in the correct setting."], ["Red-cell casts", "Strongly suggest glomerular bleeding and require prompt renal evaluation."], ["White-cell casts", "Suggest inflammation within the kidney rather than uncomplicated lower urinary contamination."], ["Hyaline casts", "Can occur with concentrated urine, exercise, fever, or low-flow states and are not diagnostic alone."]],
      relatedTopics: ["Acute kidney injury", "Acute tubular necrosis", "Glomerulonephritis", "Urinalysis", "Urine culture"],
      sourceKeys: ["fena-meta-analysis", "kdigo-aki-2012"]
    }),
    diagnosticCard({
      name: "Fractional excretion of sodium",
      fullForm: "Fractional excretion of sodium",
      diagnosticKind: "calculation",
      category: "Diagnostics and Tests / Renal Calculations / Acute Kidney Injury",
      aliases: ["FeNa", "fractional sodium excretion", "urine sodium fraction"],
      abbreviations: ["FeNa", "FENa"],
      definition: "Fractional excretion of sodium estimates the percentage of filtered sodium that appears in urine. It is calculated from paired urine and plasma sodium and creatinine values. A low result suggests avid tubular sodium retention, but FeNa is a physiologic clue rather than a binary test for 'prerenal' versus 'intrinsic' AKI.",
      method: "Use samples obtained close together and calculate (urine sodium x plasma creatinine) / (plasma sodium x urine creatinine) x 100. Interpret the timing relative to fluids, diuretics, vasopressors, contrast, obstruction relief, and changing kidney function.",
      interpretation: "A FeNa below about 1% often accompanies sodium-avid states such as reduced effective arterial volume. Higher values can accompany tubular injury. Important exceptions include early glomerulonephritis, pigment injury, contrast-associated injury, sepsis, CKD, and obstruction; values change along a continuum rather than at a biologic wall.",
      limitations: "Loop and thiazide diuretics raise urine sodium and can make FeNa falsely high. CKD changes baseline sodium handling. Nonsteady creatinine, recent fluids, osmotic diuresis, and mixed AKI weaken the calculation. Meta-analytic performance is best in selected oliguric patients without CKD or diuretics, not every hospitalized patient.",
      safety: "The calculation itself is harmless, but acting on it alone can be dangerous. Do not give a fluid bolus solely because FeNa is low or withhold needed evaluation because it is high; assess lungs, perfusion, congestion, bleeding, sepsis, obstruction, and cardiac function.",
      nursing: "Coordinate paired specimens, record diuretic and fluid timing, verify units, and trend urine output, weight, edema, blood pressure, creatinine, potassium, acid-base status, and sediment. Report a result together with the clinical volume and medication context.",
      urgent: "Escalate oliguria/anuria, rapidly rising creatinine, hyperkalemia, severe acidosis, pulmonary edema, shock, or suspected obstruction regardless of FeNa. These findings can require urgent resuscitation, imaging, nephrology, or kidney replacement therapy.",
      resultMeanings: [["Low FeNa", "Suggests sodium avidity; commonly reduced effective arterial volume but not proof of simple dehydration."], ["Higher FeNa", "Can support impaired tubular reabsorption but is not specific for acute tubular necrosis."], ["Discordant result", "Review diuretics, CKD, timing, mixed physiology, sediment, and hemodynamics."]],
      relatedTopics: ["Fractional excretion of urea", "Acute kidney injury", "Prerenal AKI", "Acute tubular necrosis", "Urine sediment examination"],
      sourceKeys: ["fena-meta-analysis", "kdigo-aki-2012"]
    }),
    diagnosticCard({
      name: "Fractional excretion of urea",
      fullForm: "Fractional excretion of urea",
      diagnosticKind: "calculation",
      category: "Diagnostics and Tests / Renal Calculations / Acute Kidney Injury",
      aliases: ["FeUrea", "fractional urea excretion", "fractional excretion of urea nitrogen"],
      abbreviations: ["FeUrea", "FEUrea"],
      definition: "Fractional excretion of urea estimates the percentage of filtered urea excreted in urine. It is sometimes used when diuretics make urine sodium and FeNa harder to interpret, but urea handling is also affected by hormones, catabolism, sepsis, nutrition, and kidney disease, so FeUrea is not a definitive volume-status test.",
      method: "Use paired urine and plasma urea plus creatinine: (urine urea x plasma creatinine) / (plasma urea x urine creatinine) x 100. The laboratory may report urea nitrogen rather than urea; numerator and denominator must use matching forms and units.",
      interpretation: "A value below roughly 35% is often taught as supporting sodium- and urea-avid reduced-perfusion physiology, while a higher value can occur with tubular injury. These anchors are aids, not diagnostic criteria, and performance varies across patient groups.",
      limitations: "Sepsis, catabolic state, high protein intake, corticosteroids, cirrhosis, heart failure, CKD, osmotic diuresis, changing renal function, and mixed injury alter urea production or handling. Diuretics may affect FeUrea less than FeNa but do not make it infallible.",
      safety: "Do not expose a congested or cardiogenic patient to unnecessary fluid solely because FeUrea is low. Conversely, a higher result cannot rule out reversible low perfusion. Bedside perfusion, congestion, losses, medications, ultrasound/imaging, and urine sediment remain essential.",
      nursing: "Obtain paired specimens close in time, verify whether the lab reports urea or BUN, document diuretics, fluids, nutrition, steroids, sepsis, liver disease, and urine output, and communicate the limitations with the result.",
      urgent: "Escalate severe AKI complications, shock, respiratory distress, obstruction, or rapidly changing output regardless of FeUrea. Treat the unstable physiology rather than waiting for a calculated fraction.",
      resultMeanings: [["Low FeUrea", "Can support reduced-perfusion physiology, including in selected diuretic-exposed patients, but is not proof."], ["Higher FeUrea", "Can occur with tubular injury but has multiple confounders."], ["Uncertain", "Mixed disease, CKD, sepsis, catabolism, and nonsteady sampling may make the value nonactionable."]],
      relatedTopics: ["Fractional excretion of sodium", "Acute kidney injury", "Heart failure", "Cirrhosis", "Urine sediment examination"],
      sourceKeys: ["fena-meta-analysis", "kdigo-aki-2012"]
    }),
    diagnosticCard({
      name: "BE-FAST stroke screen",
      fullForm: "Balance, Eyes, Face, Arm, Speech, Time stroke recognition screen",
      diagnosticKind: "bedside-assessment",
      category: "Clinical Assessment / Neurology / Stroke Recognition",
      aliases: ["BE FAST", "BEFAST", "FAST stroke screen", "stroke warning signs", "balance eyes face arm speech time"],
      abbreviations: ["BE-FAST", "FAST"],
      definition: "BE-FAST is a rapid stroke-recognition screen: sudden Balance difficulty, Eye or vision change, Face droop, Arm weakness, or Speech change means Time to activate emergency stroke care. It broadens FAST toward posterior-circulation clues but remains a screen, not a neurologic examination or a rule-out test.",
      method: "Ask about sudden onset, assess gait or balance only when safe, check for new visual loss or diplopia, compare facial movement and arm drift, listen for aphasia or dysarthria, and record the exact time the patient was last known at baseline. Activate the local stroke pathway for any compatible sudden deficit.",
      interpretation: "One positive item can be enough to suspect stroke. The pattern helps recognition but does not distinguish ischemic from hemorrhagic stroke or from a mimic. Negative BE-FAST cannot exclude isolated numbness, leg weakness, severe headache, neglect, confusion, subtle aphasia, or other atypical presentations.",
      limitations: "Posterior stroke can present with vertigo, ataxia, vomiting, diplopia, dysphagia, or altered consciousness and may still be missed. Baseline disability, intoxication, language, sedation, vision loss, and poor cooperation affect the screen. Do not ask an unstable or unsafe patient to walk.",
      safety: "Protect from falls, maintain airway and aspiration precautions, check bedside glucose, and do not give food, drink, or oral medication until swallowing safety is addressed. Do not lower blood pressure reflexively or administer antithrombotic therapy before the stroke type and pathway are established.",
      nursing: "Document each finding, side, severity, onset, last-known-well, anticoagulants, glucose, vital signs, baseline function, and who supplied the history. Continue a formal neurologic assessment because a mnemonic cannot show deterioration or treatment eligibility.",
      urgent: "Any sudden focal deficit, severe unexplained imbalance or visual change, decreasing consciousness, seizure, severe headache, or rapidly changing examination requires immediate emergency stroke activation.",
      resultMeanings: [["Positive item", "Treat as possible stroke and activate emergency evaluation."], ["Negative screen", "Does not exclude stroke; use the entire neurologic presentation."], ["Unsafe balance test", "Skip walking, protect the patient, and use history and supported examination."]],
      relatedTopics: ["Last-known-well time", "Wake-up stroke", "Stroke mimics", "NIH Stroke Scale", "Bedside capillary glucose testing"],
      sourceKeys: ["aha-asa-ais-2026", "ninds-stroke-assess", "ninds-nihss"]
    }),
    diagnosticCard({
      name: "Bedside capillary glucose testing",
      fullForm: "Point-of-care capillary blood glucose testing",
      diagnosticKind: "point-of-care-test",
      category: "Diagnostics and Tests / Point-of-Care Testing / Glucose",
      aliases: ["finger-stick glucose", "fingerstick blood sugar", "bedside glucose", "capillary glucose", "POC glucose", "glucometer test"],
      abbreviations: ["POC glucose", "CBG", "FSBG", "BG"],
      definition: "Bedside capillary glucose testing uses a portable meter and a small capillary blood sample to obtain a rapid glucose estimate. It is essential for immediate detection and treatment of hypo- or hyperglycemia, including reversible neurologic deficits, but it is not interchangeable with a laboratory venous-plasma result for formal diabetes diagnosis.",
      method: "Identify the patient, verify meter quality control and unexpired compatible strips, clean and dry the site, obtain an adequate lateral fingertip sample without excessive squeezing, apply it as the device requires, and document the value, units, time, symptoms, food, insulin, and treatment.",
      interpretation: "Treat low or critically high values according to the patient's symptoms and protocol. In suspected stroke, a low glucose can mimic focal deficit and must be corrected, but normalization does not automatically end the stroke evaluation if deficits persist. Trends and treatment timing are often more useful than one isolated value.",
      limitations: "Poor peripheral perfusion, shock, edema, hypothermia, contamination with glucose-containing fluid or food, hematocrit extremes, altitude, oxygen conditions, drugs, strip storage, and device range can distort results. An unexpected, extreme, or clinically discordant value needs prompt repeat and laboratory confirmation when feasible, without delaying emergency treatment.",
      safety: "Use standard precautions and a single-use lancet; never share lancet devices. Do not sample from a finger contaminated by sugar or from a limb/site prohibited by policy. Meter cleaning and quality control prevent patient-to-patient transmission and systematic error.",
      nursing: "Assess mental status, autonomic symptoms, intake, insulin and glucose-lowering drugs, steroids, nutrition interruption, kidney/liver function, and recent treatment. Recheck after intervention at the protocol-defined interval and document response. Report both the number and the patient's condition.",
      urgent: "Treat symptomatic hypoglycemia, inability to swallow, seizure, coma, suspected DKA/HHS, shock, or an out-of-range meter result immediately. Use IV or glucagon rescue when oral treatment is unsafe and activate emergency support as indicated.",
      resultMeanings: [["Low", "May cause confusion, seizure, coma, or a stroke-like deficit and requires immediate treatment."], ["High", "Requires context; severe symptoms, ketones, acidosis, or hyperosmolality suggest emergency physiology."], ["Unexpected or out of range", "Repeat promptly and obtain laboratory confirmation while treating a dangerous presentation."]],
      relatedTopics: ["Hypoglycemia", "Dysglycemia", "Diabetic ketoacidosis", "Hyperosmolar hyperglycemic state", "Stroke mimics"],
      sourceKeys: ["w37-ada-diabetes-2026", "w37-niddk-diabetes-testing"]
    }),
    diagnosticCard({
      name: "BNP",
      fullForm: "B-type natriuretic peptide",
      diagnosticKind: "lab",
      category: "Diagnostics and Tests / Cardiovascular Biomarkers / Natriuretic Peptides",
      aliases: ["B-type natriuretic peptide", "brain natriuretic peptide", "BNP blood test", "BNP level", "B natriuretic peptide"],
      abbreviations: ["BNP"],
      commonMisspellings: ["BPN", "brain naturetic peptide", "b type natruiretic peptide"],
      definition: "BNP is the biologically active natriuretic peptide released after cardiac muscle increases production and cleavage of proBNP, commonly in response to ventricular wall stress from pressure or volume load. It promotes natriuresis and vasodilation, so an elevated BNP is a compensatory distress signal rather than the cause of congestion. The test helps estimate whether cardiac stress contributes to dyspnea and helps describe risk, but it cannot diagnose heart failure or measure ejection fraction by itself.",
      method: "Measure BNP in the specimen and assay specified by the local laboratory, then document the analyte, units, collection time, clinical setting, kidney function, rhythm, body size, and treatment. Compare serial values only when the assay and clinical context are sufficiently similar. BNP is a separate analyte from NT-proBNP; their numerical values and decision limits are not interchangeable.",
      interpretation: "A low BNP in a validated acute-dyspnea pathway can make heart failure less likely. A high or rising value supports greater myocardial wall stress but can reflect left- or right-sided heart failure, atrial fibrillation, kidney dysfunction, acute coronary or valve disease, pulmonary hypertension or embolism, myocarditis, sepsis, or other critical illness. Use the current assay-specific pathway rather than one memorized universal cutoff.",
      limitations: "Older age, kidney disease, atrial fibrillation, and right-heart strain can raise BNP without proving left-sided congestion. Obesity, very early presentation, and effective treatment can suppress the result. Sacubitril inhibits neprilysin, which participates in BNP degradation, so BNP may rise or become harder to trend after sacubitril/valsartan begins even while wall stress improves. Assay interference and cross-platform differences can also create discordant results.",
      safety: "Do not administer or withhold a diuretic, fluid, vasodilator, or heart-failure medicine because BNP crossed a number. Treat respiratory distress, shock, ischemia, dangerous rhythm, and the demonstrated cause. A reassuring BNP does not overrule pulmonary edema, hypoxemia, elevated venous pressure, or a strongly abnormal echocardiogram.",
      nursing: "Record symptoms, oxygenation, work of breathing, blood pressure, rhythm, weight, edema, lung findings, perfusion, urine output, renal function, comparison value, and sacubitril exposure. Report the exact analyte, value, units, trend, and clinical state rather than saying only that the BNP is high.",
      urgent: "Escalate acute dyspnea, new hypoxemia, pulmonary edema, chest pain, syncope, hypotension, altered perfusion, or a dangerous dysrhythmia immediately without waiting for BNP.",
      resultMeanings: [["Low in an appropriate rule-out pathway", "Heart failure is less likely, but obesity, early sampling, treatment, and high-risk clinical findings can make the value falsely reassuring."], ["High or rising", "Cardiac wall stress is more likely, but the result does not identify its cause or prove congestion."], ["Discordant", "Verify assay, units, kidney function, rhythm, body size, timing, and sacubitril exposure; pursue imaging or repeat testing when clinically indicated."]],
      relatedTopics: ["NT-proBNP", "BNP/NT-proBNP", "Heart failure", "Echocardiogram", "Pulmonary edema", "Sacubitril/valsartan"],
      sourceKeys: ["w37-aha-hf-2022", "w37-fda-entresto-2024", "w37-ncbi-natriuretic-peptides"]
    }),
    diagnosticCard({
      name: "NT-proBNP",
      fullForm: "N-terminal pro-B-type natriuretic peptide",
      diagnosticKind: "lab",
      category: "Diagnostics and Tests / Cardiovascular Biomarkers / Natriuretic Peptides",
      aliases: ["N-terminal pro-B-type natriuretic peptide", "N-terminal prohormone BNP", "NT pro BNP", "proBNP test", "NT-proBNP level"],
      abbreviations: ["NT-proBNP", "NT proBNP"],
      commonMisspellings: ["ntprobnp", "nt pro bnp", "pro bnp", "NT-proBPN"],
      definition: "NT-proBNP is the inactive N-terminal fragment released when cardiomyocytes cleave proBNP into NT-proBNP and active BNP. Increased production commonly reflects myocardial wall stress. Because NT-proBNP has different clearance and kinetics from BNP, it is a distinct laboratory test with its own validated thresholds; it supports heart-failure probability and risk assessment but does not prove congestion or identify the cause of cardiac stress.",
      method: "Use the local NT-proBNP assay, units, age- and setting-appropriate pathway, and specimen instructions. Record timing, symptoms, renal function, rhythm, treatment, and prior values. Trend NT-proBNP against NT-proBNP rather than comparing it numerically with BNP.",
      interpretation: "A sufficiently low NT-proBNP in a validated acute evaluation can reduce the likelihood of heart failure. Higher values support increased cardiac wall stress and often greater risk, but acute versus ambulatory pathways use different decision limits and acute rule-in strategies may be age stratified. Integrate examination, ECG, chest imaging, echocardiography, renal function, rhythm, and alternative pulmonary or systemic causes.",
      limitations: "Kidney dysfunction and older age often raise NT-proBNP because production, comorbidity, and renal clearance change. Atrial fibrillation, pulmonary vascular stress, sepsis, ischemia, valve disease, and myocarditis also elevate it. Obesity and early or treated disease can lower it relative to the severity of heart failure. Small serial changes can reflect biological or analytical variation.",
      safety: "NT-proBNP is not a treatment target in isolation. Do not give or withhold diuresis solely from the result, and do not infer ejection fraction from it. Unlike BNP, NT-proBNP is not a neprilysin substrate, so it is often the clearer peptide to trend after sacubitril/valsartan starts, but the patient still matters more than the biomarker trajectory.",
      nursing: "Document the full test name, value, units, collection time, kidney function, rhythm, weight, congestion and perfusion findings, oxygenation, treatment changes, and comparison value. Clarify whether a reported 'proBNP' actually means NT-proBNP before interpreting it.",
      urgent: "Escalate respiratory failure, pulmonary edema, chest pain, syncope, shock, dangerous rhythm, or rapidly worsening perfusion immediately; do not wait for peptide confirmation.",
      resultMeanings: [["Low in a validated acute pathway", "Heart failure becomes less likely but is not erased when high-risk physiology is present."], ["High or rising", "Wall stress and risk are greater; renal, rhythm, pulmonary, ischemic, valvular, and critical-illness causes remain possible."], ["Gray zone or discordant", "Use imaging and the whole clinical context rather than forcing a binary answer."]],
      relatedTopics: ["BNP", "BNP/NT-proBNP", "Heart failure", "Chronic kidney disease", "Atrial fibrillation", "Sacubitril/valsartan"],
      sourceKeys: ["w37-aha-hf-2022", "w37-fda-entresto-2024", "w37-ncbi-natriuretic-peptides"]
    }),
    diagnosticCard({
      name: "H. pylori urea breath test",
      fullForm: "Helicobacter pylori urea breath test",
      diagnosticKind: "lab",
      category: "Diagnostics and Tests / Gastroenterology / Helicobacter pylori",
      aliases: ["urea breath test", "H pylori breath test", "Helicobacter pylori breath test", "breath test for stomach ulcer bacteria", "13C urea breath test", "14C urea breath test"],
      abbreviations: ["UBT", "13C-UBT"],
      commonMisspellings: ["h pilori breath test", "h pylorie breath test", "urea breathe test"],
      definition: "The H. pylori urea breath test detects active gastric Helicobacter pylori infection by giving labeled urea and measuring labeled carbon dioxide in exhaled breath. H. pylori urease splits urea into ammonia and carbon dioxide; the labeled carbon reaches the lungs only when sufficient active urease-producing organisms are present. This mechanism makes the test useful for initial diagnosis and confirmation of eradication.",
      method: "Follow the laboratory's fasting and collection instructions, obtain the baseline breath sample when required, administer the labeled urea preparation, and collect the timed post-dose sample without substituting another protocol. Review proton-pump inhibitors, PCABs, bismuth, antibiotics, and recent treatment before testing; do not stop prescribed medicine independently, but clarify the ordered hold plan.",
      interpretation: "A positive result supports active H. pylori infection. A negative result is most reliable when preparation, medication holds, timing, and sample collection were correct. For test of cure, testing is generally performed at least four weeks after eradication therapy; common guidance also withholds PPIs or PCABs for about two weeks and bismuth or antibiotics for about four weeks under the treating plan.",
      limitations: "Acid suppression, bismuth, antibiotics, recent upper-GI bleeding, partial treatment, low organism burden, or incorrect collection can suppress urease activity and cause a false negative. The test does not show ulcer depth, bleeding, cancer, or antibiotic susceptibility. Carbon-13 testing is nonradioactive; carbon-14 uses a small radioactive label and requires population- and facility-specific precautions.",
      safety: "Do not delay urgent endoscopy or emergency assessment for hematemesis, melena with instability, perforation signs, progressive dysphagia, severe anemia, or shock. Verify pregnancy and pediatric protocol when a carbon-14 product is considered, and use the ordered product rather than assuming all breath tests are identical.",
      nursing: "Verify the exact product and fasting instructions, document medication names and last doses, collect and label timed samples accurately, and arrange test-of-cure follow-up. Explain that symptom improvement does not prove eradication and that a negative test obtained during suppressive therapy may need repetition.",
      urgent: "Escalate GI bleeding, syncope, hypotension, rigid abdomen, persistent vomiting, severe dehydration, or other alarm features independently of the breath-test result.",
      resultMeanings: [["Positive", "Active H. pylori urease activity is detected and cause-directed eradication planning is needed."], ["Negative with correct preparation", "Active infection is less likely."], ["Negative with suppressive medicines or poor timing", "False reassurance is possible; clarify repeat testing."]],
      relatedTopics: ["H. pylori stool antigen test", "H. pylori breath/stool tests", "H. pylori infection", "Peptic ulcer disease", "Gastritis"],
      sourceKeys: ["acg-h-pylori-2024"]
    }),
    diagnosticCard({
      name: "H. pylori stool antigen test",
      fullForm: "Helicobacter pylori stool antigen test",
      diagnosticKind: "lab",
      category: "Diagnostics and Tests / Gastroenterology / Helicobacter pylori",
      aliases: ["H pylori stool test", "Helicobacter pylori stool antigen", "stool antigen for H. pylori", "H pylori fecal antigen test", "stomach bacteria stool test"],
      abbreviations: ["HpSA", "H. pylori SAT"],
      commonMisspellings: ["h pilori stool test", "h pylorie antigen", "h pylori stoole test"],
      definition: "The H. pylori stool antigen test detects H. pylori antigens shed into feces, so it evaluates active infection rather than remote antibody exposure. A validated monoclonal assay can be used for initial diagnosis and for test of cure when collected at the correct interval and after the prescribed medication holds.",
      method: "Collect stool in the approved clean container without urine, toilet water, or cleaning-agent contamination; label and refrigerate or transport exactly as the laboratory requires. Review PPIs, PCABs, bismuth, antibiotics, recent treatment, and GI bleeding. Do not stop therapy on your own; obtain the prescriber's testing plan.",
      interpretation: "A positive result supports active H. pylori infection. A negative result is meaningful only if organism-suppressing medicines and recent therapy have not reduced antigen below detection. For eradication confirmation, common guidance waits at least four weeks after treatment and uses planned holds of about two weeks for PPIs/PCABs and four weeks for bismuth/antibiotics.",
      limitations: "Suppressive medicine, recent antibiotics or treatment, watery or contaminated specimens, collection or transport errors, and some episodes of GI bleeding can reduce sensitivity. Assays differ, and serology is not an interchangeable substitute because antibodies can persist after infection clears. The result does not evaluate ulcer complications or antibiotic resistance.",
      safety: "Do not let a negative stool result delay urgent evaluation of bleeding, perforation, obstruction, progressive dysphagia, weight loss, severe anemia, or hemodynamic instability. Use infection-control handling and avoid contamination of the specimen or environment.",
      nursing: "Teach clean collection, storage, transport, and medication timing without shaming the patient. Record last doses and recent eradication therapy, verify follow-up of positive results, and ensure a planned test of cure occurs even when symptoms resolve.",
      urgent: "Escalate hematemesis, melena with symptoms or instability, severe abdominal pain with guarding, syncope, persistent vomiting, or shock regardless of antigen result.",
      resultMeanings: [["Positive", "H. pylori antigen supports active infection."], ["Negative with correct timing and collection", "Active infection is less likely."], ["Negative during suppressive therapy", "A false negative is possible and repeat testing may be required."]],
      relatedTopics: ["H. pylori urea breath test", "H. pylori breath/stool tests", "H. pylori infection", "Peptic ulcer disease", "Upper gastrointestinal bleeding"],
      sourceKeys: ["acg-h-pylori-2024"]
    }),
    diagnosticCard({
      name: "Insulin level",
      fullForm: "Serum or plasma insulin concentration",
      diagnosticKind: "lab",
      category: "Diagnostics and Tests / Endocrinology / Insulin Secretion",
      aliases: ["serum insulin", "plasma insulin", "fasting insulin", "insulin blood test", "insulin concentration", "immunoreactive insulin"],
      abbreviations: ["IRI"],
      commonMisspellings: ["insuline level", "inslin blood test", "fastin insulin"],
      definition: "An insulin level measures insulin detected by a specific blood immunoassay. It is most clinically useful when interpreted with a simultaneously low or high glucose and with C-peptide, proinsulin, beta-hydroxybutyrate, medications, and timing. Insulin suppresses hepatic glucose output, lipolysis, and ketone production; therefore an insulin value that is not appropriately suppressed during true hypoglycemia can reveal insulin-mediated physiology.",
      method: "Collect the ordered fasting, random, post-stimulation, or critical hypoglycemia sample at the specified time and pair it with laboratory glucose. Document exogenous insulin type and time, sulfonylureas or meglitinides, food, dextrose, glucagon, kidney and liver function, and whether treatment occurred before collection. Assays differ in their detection of insulin analogs.",
      interpretation: "During documented hypoglycemia, insulin should normally be very low. Inappropriately detectable or high insulin with suppressed beta-hydroxybutyrate suggests insulin effect; high C-peptide supports endogenous secretion, whereas low C-peptide suggests exogenous insulin, subject to assay limitations. Outside a structured evaluation, a high fasting insulin may accompany insulin resistance but does not by itself diagnose it or define diabetes type.",
      limitations: "Reference intervals depend on fasting status, glucose, assay, units, body physiology, and recent treatment. Some immunoassays under-detect or over-detect insulin analogs. Hemolysis and anti-insulin antibodies can interfere, while reduced renal or hepatic clearance changes concentrations. A normal insulin sampled after glucose treatment cannot reconstruct the untreated event.",
      safety: "Treat symptomatic or severe hypoglycemia immediately; do not delay glucose or glucagon merely to obtain a perfect sample. When feasible, draw the critical specimen at the moment of low laboratory glucose before treatment. Do not use a consumer fasting-insulin value alone to prescribe therapy or label insulin resistance.",
      nursing: "During a supervised fast or hypoglycemia evaluation, follow the protocol exactly, monitor symptoms and glucose, record all intake and medicines, obtain time-linked specimens, and keep rescue treatment immediately available. Escalate recurrent unexplained episodes or concern for medication error, surreptitious exposure, adrenal disease, liver failure, sepsis, or insulinoma.",
      urgent: "Seizure, coma, inability to swallow, recurrent neuroglycopenia, or persistent low glucose requires immediate treatment and emergency evaluation regardless of the insulin result.",
      resultMeanings: [["Not suppressed during true hypoglycemia", "Supports insulin-mediated hypoglycemia and requires paired C-peptide, ketones, drug screen, and clinical context."], ["High with high glucose", "Can reflect insulin resistance, recent food, therapy, or other physiology; it is not a stand-alone diagnosis."], ["Low", "May be appropriate during fasting or may reflect beta-cell failure depending on simultaneous glucose and stimulation context."]],
      relatedTopics: ["C-peptide test", "Insulin/C-peptide levels", "Hypoglycemia", "Insulinoma", "Exogenous insulin", "Insulin resistance"],
      sourceKeys: ["w37-ada-diabetes-2026", "w37-niddk-diabetes-testing"]
    }),
    diagnosticCard({
      name: "C-peptide test",
      fullForm: "Connecting-peptide blood or urine test",
      diagnosticKind: "lab",
      category: "Diagnostics and Tests / Endocrinology / Endogenous Insulin Secretion",
      aliases: ["C-peptide level", "C peptide blood test", "connecting peptide", "fasting C-peptide", "stimulated C-peptide", "endogenous insulin production test"],
      abbreviations: ["C-peptide", "CPR"],
      commonMisspellings: ["c peptid", "see peptide", "c-peptied"],
      definition: "C-peptide is released in roughly equimolar amounts when pancreatic beta cells split proinsulin into endogenous insulin and connecting peptide. Injected insulin contains no C-peptide, so a blood or urine C-peptide result helps estimate the body's own insulin secretion. It must be interpreted with the simultaneous glucose, kidney function, timing, and whether the sample was fasting or stimulated.",
      method: "Collect the ordered fasting, random, meal-stimulated, glucagon-stimulated, or timed urine specimen according to protocol. Pair blood C-peptide with glucose and document insulin, sulfonylurea or meglitinide use, food, treatment, kidney function, and timing. Use the laboratory's units and reference interval because methods differ.",
      interpretation: "A preserved or high C-peptide during hyperglycemia shows ongoing endogenous insulin secretion, often with insulin resistance. A low value during meaningful hyperglycemia supports severe beta-cell failure. During true hypoglycemia, high insulin plus high C-peptide suggests endogenous insulin secretion or an insulin secretagogue; high insulin plus suppressed C-peptide supports exogenous insulin exposure, although insulin-assay detection and timing must be checked.",
      limitations: "Kidneys clear C-peptide, so kidney dysfunction can raise blood concentrations and complicate thresholds. A low glucose suppresses normal secretion; therefore a low C-peptide without adequate glucose stimulation does not prove beta-cell failure. Exogenous insulin, recent treatment, secretagogues, assay variation, and evolving diabetes all change interpretation. C-peptide does not identify a MODY gene or autoimmune antibody by itself.",
      safety: "Do not withhold emergency hypoglycemia treatment to collect C-peptide. Draw a critical sample before treatment only when this can be done immediately and safely. Do not stop insulin because C-peptide is detectable, and do not classify diabetes from one isolated result without the clinical course, antibodies, glucose pattern, and specialist interpretation.",
      nursing: "Verify whether the goal is diabetes classification, residual beta-cell function, or hypoglycemia investigation because preparation differs. Record glucose and exact collection time, medicines and last doses, food or stimulation, kidney function, symptoms, and any rescue treatment. Teach that the test measures the body's insulin production, not how much injected insulin remains active.",
      urgent: "Treat severe hypoglycemia, ketosis, DKA, or HHS immediately. Escalate recurrent unexplained hypoglycemia, rapid insulin dependence, or discordant insulin/C-peptide patterns for specialist evaluation.",
      resultMeanings: [["Low with significant hyperglycemia", "Supports limited endogenous beta-cell reserve."], ["Preserved or high with hyperglycemia", "Shows endogenous insulin secretion and may accompany insulin resistance."], ["High during hypoglycemia", "Interpret with insulin, secretagogue screen, ketones, and kidney function to evaluate endogenous hyperinsulinism."]],
      relatedTopics: ["Insulin level", "Insulin/C-peptide levels", "Type 1 diabetes mellitus", "Type 2 diabetes mellitus", "LADA", "MODY", "Hypoglycemia"],
      sourceKeys: ["w37-ada-diabetes-2026", "w37-niddk-diabetes-testing"]
    }),
    diagnosticCard({
      name: "Troponin I",
      fullForm: "Cardiac troponin I",
      diagnosticKind: "lab",
      category: "Diagnostics and Tests / Cardiovascular Biomarkers / Myocardial Injury",
      aliases: ["cardiac troponin I", "cTnI", "high-sensitivity troponin I", "hs-cTnI", "troponin I blood test"],
      abbreviations: ["cTnI", "hs-cTnI"],
      definition: "Troponin I is a cardiac contractile-regulatory protein released into blood when cardiomyocytes are injured. A value above the assay's 99th-percentile upper reference limit establishes myocardial injury, not its cause. Acute myocardial infarction requires an appropriate rise or fall plus clinical evidence of ischemia such as symptoms, ECG change, imaging, or coronary findings.",
      method: "Use the laboratory's specific contemporary or high-sensitivity cardiac troponin I assay and timed serial pathway. Record symptom onset, collection times, units, sex-specific limits when the assay uses them, kidney function, ECG findings, and interventions. Never transfer a cutoff from troponin T or another manufacturer's assay.",
      interpretation: "A rising or falling pattern suggests acute injury; a stable elevation more often reflects chronic injury. Ischemic plaque rupture is one cause, but demand ischemia, heart failure, tachyarrhythmia, myocarditis, pulmonary embolism, sepsis, renal disease, trauma, and procedures can elevate troponin I. The mechanism and patient determine treatment.",
      limitations: "A single early normal result may precede detectable release, while chronic elevation reduces specificity. Assay interference, skeletal-muscle cross-reactivity in selected platforms, hemolysis, and cross-laboratory differences require laboratory review when the result is implausible.",
      safety: "Do not rule out acute coronary syndrome from one early result and do not label every elevation a type 1 myocardial infarction. Conversely, do not wait for troponin before treating shock, malignant rhythm, STEMI-pattern ischemia, or another immediate emergency.",
      nursing: "Obtain serial samples at ordered times, document symptoms and ECG timing, avoid draws from contaminated lines, trend renal function and hemodynamics, and report the delta with the patient's condition rather than an isolated word such as positive.",
      urgent: "Escalate ongoing chest pressure, dynamic ECG change, syncope, pulmonary edema, malignant rhythm, hypotension, or poor perfusion immediately.",
      resultMeanings: [["Below assay limit at the correct serial time", "Acute injury is less likely within that validated pathway."], ["Rise or fall above the 99th percentile", "Acute myocardial injury is present; determine whether ischemia or another cause explains it."], ["Stable elevation", "Consider chronic myocardial injury and compare with baseline and clinical change."]],
      relatedTopics: ["Troponin T", "Troponin I/T", "Acute coronary syndrome", "Myocardial infarction", "Myocarditis", "Chronic kidney disease"],
      sourceKeys: ["medlineplus"]
    }),
    diagnosticCard({
      name: "Troponin T",
      fullForm: "Cardiac troponin T",
      diagnosticKind: "lab",
      category: "Diagnostics and Tests / Cardiovascular Biomarkers / Myocardial Injury",
      aliases: ["cardiac troponin T", "cTnT", "high-sensitivity troponin T", "hs-cTnT", "troponin T blood test"],
      abbreviations: ["cTnT", "hs-cTnT"],
      definition: "Troponin T is a cardiac regulatory protein measured as a biomarker of cardiomyocyte injury. An assay result above its 99th-percentile limit means myocardial injury; it does not automatically mean coronary thrombosis. Acute infarction requires a dynamic pattern and evidence that ischemia caused the injury.",
      method: "Follow the laboratory's troponin T assay and serial timing pathway, documenting symptom onset, ECG timing, units, assay limit, kidney function, and prior baseline. Troponin T and troponin I have different assays and numerical ranges and must not be trended as though they are the same analyte.",
      interpretation: "A meaningful rise or fall supports acute injury. Causes include acute coronary ischemia, supply-demand mismatch, heart failure, myocarditis, pulmonary embolism, sepsis, tachyarrhythmia, cardiac procedures, and other myocardial stress. Persistent elevation is common in advanced kidney disease and structural heart disease but still carries prognostic meaning.",
      limitations: "Early sampling can be falsely reassuring. Chronic kidney disease, chronic structural injury, and some skeletal-muscle disorders complicate specificity. Platform interference or a result that conflicts sharply with the patient should prompt laboratory consultation rather than a forced diagnosis.",
      safety: "Do not use a single troponin T value to choose anticoagulation, antiplatelet treatment, or catheterization without the clinical pathway; several nonthrombotic causes could be harmed by automatic ACS treatment. Treat unstable ischemia and shock urgently while serial testing continues.",
      nursing: "Coordinate timed serial collection and ECGs, record pain and physiologic change, report the assay-specific delta and units, and monitor rhythm, oxygenation, perfusion, kidney function, and response to interventions.",
      urgent: "Escalate ischemic symptoms, dynamic ECG change, ventricular dysrhythmia, syncope, shock, acute heart failure, or rapidly worsening clinical status without waiting for a later sample.",
      resultMeanings: [["Low in a completed validated pathway", "Acute myocardial injury is less likely."], ["Dynamic elevation", "Acute myocardial injury is present; classify the mechanism with ischemic evidence and the differential."], ["Chronic stable elevation", "Consider chronic myocardial injury, especially with kidney or structural heart disease."]],
      relatedTopics: ["Troponin I", "Troponin I/T", "Acute coronary syndrome", "Type 2 myocardial infarction", "Chronic kidney disease"],
      sourceKeys: ["medlineplus"]
    }),
    diagnosticCard({
      name: "Gentamicin peak level",
      fullForm: "Gentamicin peak serum concentration",
      diagnosticKind: "therapeutic-drug-monitoring",
      category: "Diagnostics and Tests / Therapeutic Drug Monitoring / Aminoglycosides",
      aliases: ["gentamicin peak", "peak gentamicin concentration", "aminoglycoside peak level"],
      definition: "A gentamicin peak level estimates the highest serum concentration after a dose. For conventional multiple-daily dosing it helps show whether exposure is high enough for concentration-dependent bacterial killing; the desired target depends on infection, dose strategy, specimen timing, organism, and local protocol.",
      method: "Record the exact dose, route, infusion start and stop, and draw time. Conventional peak samples are obtained at a protocol-defined time after distribution begins; extended-interval dosing often uses a different single-level nomogram rather than a traditional peak. A mistimed sample cannot be repaired by applying the usual target.",
      interpretation: "A low apparent peak may reflect underdosing, expanded volume of distribution, rapid clearance, or an early/late timing error. A high peak may be intentional for selected infections or may reflect overdosing or incorrect timing. Interpret with organism susceptibility, clinical response, kidney function, and trough or AUC strategy.",
      limitations: "Targets vary by infection and dosing method. Dialysis, pregnancy, burns, cystic fibrosis, obesity, edema, critical illness, and changing kidney function alter distribution and clearance. Do not compare extended-interval, synergy, and conventional targets as if they were one regimen.",
      safety: "Do not change a dose from an undocumented or mistimed peak. Verify timing first and evaluate renal function, urine output, hearing, balance, neuromuscular weakness, and other nephrotoxic or ototoxic drugs.",
      nursing: "Document times precisely, coordinate the laboratory draw with pharmacy, avoid sampling from the infusion line, and report timing errors. Monitor infection response, creatinine trend, urine output, tinnitus, hearing change, vertigo, and weakness.",
      urgent: "Escalate rapidly worsening kidney function, oliguria, severe vestibular or hearing symptoms, neuromuscular blockade, or a dangerously high confirmed exposure.",
      resultMeanings: [["Below target", "May indicate inadequate exposure or wrong timing."], ["Within regimen target", "Supports the prescribed exposure goal when timing is valid."], ["Above target", "Recheck timing and assess dose, distribution, kidney clearance, and toxicity risk."]],
      relatedTopics: ["Gentamicin trough level", "Gentamicin peak/trough", "Gentamicin", "Therapeutic drug monitoring", "Acute kidney injury"],
      sourceKeys: ["medlineplus"]
    }),
    diagnosticCard({
      name: "Gentamicin trough level",
      fullForm: "Gentamicin trough serum concentration",
      diagnosticKind: "therapeutic-drug-monitoring",
      category: "Diagnostics and Tests / Therapeutic Drug Monitoring / Aminoglycosides",
      aliases: ["gentamicin trough", "pre-dose gentamicin level", "aminoglycoside trough level"],
      definition: "A gentamicin trough level measures residual drug near the end of a dosing interval. Excess residual exposure signals incomplete clearance and raises nephrotoxicity and ototoxicity concern. The safe target depends on conventional, synergy, extended-interval, dialysis, and institution-specific dosing strategies.",
      method: "Draw immediately before the next scheduled dose at the protocol-defined steady-state or reassessment point, and record the exact prior dose and collection times. A sample drawn hours early can look falsely high for a trough; a sample after the next dose is not a trough.",
      interpretation: "A low trough usually shows adequate clearance before redosing; a high confirmed trough suggests accumulation from reduced or changing renal clearance, an overly short interval, excessive dosing, or special-population kinetics. The response may be to hold, extend the interval, recalculate, or use model-based dosing under the treating team.",
      limitations: "Kidney function can change faster than serum creatinine, especially in critical illness. Dialysis timing, fluid shifts, age, obesity, burns, pregnancy, and interacting nephrotoxins change kinetics. Extended-interval regimens may not use a conventional trough target.",
      safety: "Do not administer the next dose blindly when a required trough is dangerously high or kidney function has acutely worsened; follow the medication and pharmacy protocol. Do not call a mistimed value therapeutic or toxic without reconstructing the timeline.",
      nursing: "Coordinate pre-dose collection, hold only under protocol or order, document every time, trend creatinine and urine output, and assess tinnitus, hearing loss, vertigo, and weakness. Communicate concurrent vancomycin, contrast, diuretics, or other nephrotoxic/ototoxic exposure.",
      urgent: "Escalate oliguria, rapid creatinine rise, severe vestibular symptoms, new hearing loss, neuromuscular weakness, or a confirmed markedly elevated trough before redosing.",
      resultMeanings: [["Low/appropriately cleared", "Residual exposure is limited for that regimen."], ["High", "Accumulation and toxicity risk are increased; verify timing and reassess dosing and renal function."], ["Mistimed", "Do not apply a trough target; recalculate or repeat under protocol."]],
      relatedTopics: ["Gentamicin peak level", "Gentamicin peak/trough", "Gentamicin", "Nephrotoxicity", "Ototoxicity"],
      sourceKeys: ["medlineplus"]
    }),
    diagnosticCard({
      name: "Central venous oxygen saturation",
      fullForm: "Central venous oxygen saturation (ScvO2)",
      diagnosticKind: "hemodynamic-monitoring",
      category: "Diagnostics and Tests / Perfusion and Oxygen Delivery",
      aliases: ["ScvO2", "central venous O2 saturation", "superior vena cava oxygen saturation", "central line venous saturation"],
      abbreviations: ["ScvO2"],
      definition: "Central venous oxygen saturation is the hemoglobin oxygen saturation measured from blood in the superior vena cava or right atrial region through an appropriately positioned central line. It reflects the balance among oxygen delivery, tissue extraction, and metabolic demand in the upper body; it is a trend, not a direct cardiac-output measurement.",
      method: "Confirm line identity and position, discard or clear dead-space blood according to policy, avoid contamination by infused fluid, and analyze the sample promptly or use a calibrated continuous sensor. Record oxygen therapy, hemoglobin, arterial saturation, temperature, sedation, vasoactive support, and collection site.",
      interpretation: "Low ScvO2 can result from low cardiac output, anemia, hypoxemia, or increased demand such as fever, shivering, pain, or seizures. A normal or high value does not prove adequate perfusion; sepsis-related extraction failure, shunting, sedation, hypothermia, or very low demand can elevate it despite serious illness.",
      limitations: "ScvO2 is not numerically interchangeable with mixed venous SvO2 because it omits much lower-body and coronary venous blood. Site, sampling error, central-line infusion, rapidly changing physiology, and device calibration affect the result.",
      safety: "Do not give fluid, transfusion, inotrope, or oxygen solely to normalize ScvO2. Integrate mental status, capillary refill, blood pressure, urine output, lactate, hemoglobin, arterial oxygenation, cardiac findings, and the cause of shock.",
      nursing: "Use sterile line technique, pause incompatible infusions per protocol, label source and time, trend the result with interventions, and assess the central line for infection or malfunction.",
      urgent: "Escalate a falling value with hypotension, altered mental status, oliguria, rising lactate, hypoxemia, bleeding, or other shock signs; treat the unstable patient rather than waiting for repeat sampling.",
      resultMeanings: [["Low", "Oxygen delivery may be inadequate or demand high."], ["Normal-range", "Balance may be acceptable, but regional or global hypoperfusion can still exist."], ["High", "May reflect adequate delivery, low demand, impaired extraction, or shunting; context determines meaning."]],
      relatedTopics: ["Mixed venous oxygen saturation", "ScvO2 / SvO2", "Cardiac output", "Oxygen delivery", "Shock", "Serum lactate"],
      sourceKeys: ["medlineplus"]
    }),
    diagnosticCard({
      name: "Mixed venous oxygen saturation",
      fullForm: "Mixed venous oxygen saturation (SvO2)",
      diagnosticKind: "hemodynamic-monitoring",
      category: "Diagnostics and Tests / Perfusion and Oxygen Delivery",
      aliases: ["SvO2", "mixed venous O2 saturation", "pulmonary artery oxygen saturation", "true mixed venous saturation"],
      abbreviations: ["SvO2"],
      definition: "Mixed venous oxygen saturation is measured from blood in the pulmonary artery after venous return from the superior vena cava, inferior vena cava, and coronary sinus has mixed. It reflects the whole-body relationship among cardiac output, arterial oxygen content, hemoglobin, oxygen consumption, and tissue extraction.",
      method: "Obtain from a correctly positioned pulmonary artery catheter distal lumen or a validated continuous oximetry system. Confirm waveform/position, avoid wedged sampling or infusate contamination, record ventilatory and hemodynamic conditions, and analyze promptly.",
      interpretation: "Low SvO2 suggests oxygen delivery is inadequate relative to demand because of low cardiac output, hypoxemia, anemia, or increased metabolic use. High SvO2 can occur with high delivery or reduced extraction from sepsis, shunting, sedation, hypothermia, or mitochondrial dysfunction. Direction and response to treatment are often more useful than one value.",
      limitations: "Pulmonary artery catheters carry procedural risk and are not justified merely to obtain SvO2. The value is global and can miss regional ischemia. Catheter position, calibration, timing, and changing oxygen consumption affect interpretation; ScvO2 is related but not interchangeable.",
      safety: "Do not chase SvO2 with indiscriminate fluid, transfusion, or inotrope. Identify whether cardiac output, hemoglobin, saturation, or demand is abnormal and balance treatment harms. Watch for catheter dysrhythmia, infection, thrombosis, rupture, knotting, or accidental wedging.",
      nursing: "Verify distal-lumen use and waveform, maintain sterile catheter care, trend hemodynamics and perfusion, document interventions and sample conditions, and promptly report abrupt changes or catheter complications.",
      urgent: "Escalate low or falling SvO2 with shock, active bleeding, severe hypoxemia, ischemia, rising lactate, oliguria, or altered consciousness and any pulmonary artery catheter complication.",
      resultMeanings: [["Low", "Delivery is inadequate relative to whole-body oxygen consumption."], ["Normal-range", "Global supply-demand balance may be adequate but does not exclude regional ischemia."], ["High", "Consider high delivery, low demand, impaired extraction, or shunting."]],
      relatedTopics: ["Central venous oxygen saturation", "ScvO2 / SvO2", "Pulmonary artery catheter", "Cardiac output", "Oxygen extraction ratio", "Shock"],
      sourceKeys: ["medlineplus"]
    })
  ];

  const foundationCards = [
    foundationCard({
      name: "Last-known-well time",
      type: "emergency-clinical-concept",
      category: "Emergency Medicine / Stroke Timeline",
      aliases: ["last known well", "last known normal", "time last seen normal", "stroke onset time", "LKW time"],
      abbreviations: ["LKW", "LKN"],
      definition: "Last-known-well time is the latest time at which a patient was known to be at their usual neurologic baseline. It is not necessarily the time symptoms were discovered, the time emergency services were called, or the time the patient arrived. The distinction matters because reperfusion eligibility and hemorrhage risk depend partly on how long tissue may have been ischemic.",
      mechanism: "When onset is witnessed, last-known-well and symptom onset may match. When a patient awakens abnormal or is found alone, the last normal conversation, observation, electronic activity, or caregiver contact may be hours earlier. Advanced imaging can refine selected unknown-onset decisions, but it does not make the history optional.",
      assessment: "Ask the patient, family, witnesses, facility staff, EMS, and available records separately. Establish baseline deficits, the first abnormal observation, and the last definite normal observation. Use exact date and clock time with time zone when relevant; avoid vague words such as 'this morning.'",
      complications: "Using discovery time as onset can make a patient appear eligible when they are not, while assuming an unknown onset means no treatment can deny imaging-selected therapy. Sedation, dementia, sleep, intoxication, unwitnessed falls, and conflicting witnesses require transparent documentation rather than a guessed time.",
      nursing: "Document who supplied each time, the exact words, baseline function, first abnormal time, last-known-well, anticoagulants, glucose, and any discrepancy. Relay the time immediately to the stroke team and update it if better evidence emerges.",
      urgent: "Do not delay stroke activation while reconstructing every detail. A new focal deficit with uncertain onset remains an emergency and may qualify for specialized imaging and treatment pathways.",
      teaching: "Teach families to note the clock time when stroke symptoms begin and call emergency services immediately. Do not drive the patient or wait for symptoms to improve.",
      relatedTopics: ["BE-FAST stroke screen", "Wake-up stroke", "Acute stroke imaging: noncontrast CT, CTA, CTP, DWI, and ADC"],
      sourceKeys: ["aha-asa-ais-2026", "ninds-stroke-assess"]
    }),
    foundationCard({
      name: "Urinary catheter",
      fullForm: "Indwelling urinary catheter",
      type: "medical-device",
      category: "Medical Devices / Urinary Drainage",
      aliases: ["Foley catheter", "indwelling catheter", "bladder catheter", "urethral catheter", "urinary drainage catheter"],
      abbreviations: ["IUC", "Foley"],
      definition: "A urinary catheter is a flexible tube placed through the urethra into the bladder to drain urine. An indwelling catheter has a retention balloon and closed drainage system. It is useful for specific indications, but every catheter day bypasses urethral defenses and creates a surface on which organisms can ascend and form biofilm.",
      mechanism: "Urine flows by gravity through a closed system into a collection bag. Kinks, dependent loops, obstruction, a bag above bladder level, or disconnection can impair drainage or allow reflux. Biofilm makes bacteriuria increasingly likely over time, which is why avoiding insertion and removing the catheter promptly prevent more infection than routine antibiotic use.",
      assessment: "Confirm a valid indication and the smallest appropriate catheter, perform aseptic insertion with sterile equipment, secure the tube, keep the bag below bladder level and off the floor, maintain unobstructed flow, and sample urine from the disinfected sampling port rather than the bag.",
      complications: "Catheter-associated UTI, asymptomatic bacteriuria, urethral trauma, false passage, hematuria, bladder spasm, obstruction, leakage, pressure injury, and reduced mobility can occur. Cloudy or odorous urine alone does not prove symptomatic infection.",
      nursing: "Review necessity every shift/day, document indication, insertion date, urine output and character, site and securement, drainage-system integrity, care, specimen method, and removal plan. Never irrigate, disconnect, or replace on a routine schedule unless ordered or policy indicates a clinical reason.",
      urgent: "Escalate no drainage with bladder distention, severe pain, gross hematuria or clots, traumatic removal, sepsis findings, new obstruction after urologic surgery, or suspected urethral injury. Do not force insertion against resistance.",
      teaching: "Keep the tubing unkinked and the bag below the bladder, wash hands before and after handling, avoid pulling, and report fever, suprapubic/flank pain, obstruction, blood, or accidental removal.",
      relatedTopics: ["Catheter-associated UTI", "Urinary retention", "Urinalysis", "Urine culture"],
      sourceKeys: ["cdc-cauti-recommendations"]
    }),
    foundationCard({
      name: "Central venous catheter",
      type: "medical-device",
      category: "Medical Devices / Vascular Access",
      aliases: ["central line", "central venous line", "CVC", "PICC", "tunneled central line", "implanted port"],
      abbreviations: ["CVC", "CVAD", "PICC"],
      definition: "A central venous catheter is a vascular-access device whose tip terminates in a large central vein. It supports vasoactive infusions, irritant or hyperosmolar therapy, reliable long-term access, hemodynamic measurement, and selected dialysis or nutrition needs, but it also creates direct access to the bloodstream and can cause infection, thrombosis, bleeding, or mechanical injury.",
      mechanism: "The catheter provides high-flow dilution near the superior or inferior vena cava. Nontunneled lines, PICCs, tunneled catheters, implanted ports, and dialysis catheters have different insertion sites, lumens, indications, flow, maintenance, and infection risks; one label should not erase those differences.",
      assessment: "Confirm line type, tip verification and permission to use, lumen purpose, dressing and connector integrity, insertion-site condition, external length, blood return and flush behavior according to policy, and daily necessity. Use hand hygiene, aseptic access, and required connector-disinfection contact time every time.",
      complications: "CLABSI, local or tunnel infection, catheter thrombosis, upper-extremity or central DVT, occlusion, breakage, air embolism, malposition, extravasation, and insertion-related pneumothorax or arterial injury can occur. A normal site does not exclude intraluminal bloodstream infection.",
      nursing: "Maintain the correct sterile dressing, closed system, clamp/positive-pressure sequence, flush and lock solution, and medication compatibility. Label lumens, minimize entries, document site and device measurements, and remove the line promptly when no longer needed.",
      urgent: "Stop the infusion and escalate fever/rigors during use, hypotension, purulent drainage, new swelling or arm/neck pain, resistance with possible occlusion, sudden dyspnea, chest pain, line fracture, suspected air entry, or a change in external length. Clamp a damaged external catheter when safe and follow emergency policy.",
      teaching: "Keep the dressing clean, dry, intact, and visible; do not submerge the line or manipulate hubs; report fever, chills, redness, drainage, swelling, pain, breathing trouble, leakage, or a pulled line immediately.",
      relatedTopics: ["Central line-associated bloodstream infection", "Bloodstream infection", "Deep vein thrombosis", "Parenteral nutrition"],
      sourceKeys: ["w34-cdc-hai"]
    }),
    foundationCard({
      name: "Mechanical ventilation",
      type: "critical-care-procedure",
      category: "Critical Care / Respiratory Support",
      aliases: ["invasive mechanical ventilation", "ventilator support", "positive-pressure ventilation", "being on a ventilator"],
      abbreviations: ["MV", "IMV"],
      definition: "Mechanical ventilation uses a machine to move gas into and out of the lungs when a patient cannot maintain safe oxygenation, ventilation, airway protection, or work of breathing. It supports physiology while the cause is treated; it does not cure pneumonia, ARDS, shock, neuromuscular failure, or another underlying disorder.",
      mechanism: "Positive pressure raises airway and alveolar pressure to deliver a set or supported breath. Tidal volume, respiratory rate, inspiratory pressure or flow, PEEP, FiO2, trigger, and mode interact. PEEP can recruit alveoli and improve oxygenation but also raises intrathoracic pressure, which can reduce venous return and overdistend vulnerable lung units.",
      assessment: "Assess the patient before the machine: airway security, chest rise, breath sounds, respiratory effort, synchrony, oxygen saturation, mental status, perfusion, and secretions. Then check tube depth, circuit, alarms, mode, set and measured volumes/pressures, rate, PEEP, FiO2, and recent blood gas or end-tidal CO2.",
      complications: "Ventilator-induced lung injury, barotrauma, volutrauma, atelectrauma, oxygen toxicity, hypotension, auto-PEEP, ventilator-associated pneumonia, airway trauma, delirium, weakness, pressure injury, immobility, and sedation complications can occur. Alarms signal a patient or system problem and must never be silenced without assessment.",
      nursing: "Use lung-protective settings as prescribed, maintain head elevation when appropriate, provide oral care and secretion management, prevent unplanned extubation, minimize unnecessary sedation, assess pain and delirium, support mobility, and review daily readiness for spontaneous awakening and breathing trials.",
      urgent: "Disconnect from the ventilator and manually ventilate with oxygen while calling for help if the patient is rapidly deteriorating and equipment failure or obstruction is suspected. Escalate sudden high pressure, absent volumes, severe desaturation, unilateral breath sounds, hypotension, new subcutaneous air, tube displacement, or inability to pass suction catheter.",
      teaching: "Explain that the tube prevents normal speech and eating, alarms are safety signals, communication aids are available, and sedation can be adjusted. Families should not manipulate the tube or circuit.",
      relatedTopics: ["Ventilator-associated pneumonia", "Acute respiratory distress syndrome", "PEEP", "Tidal volume", "Endotracheal intubation", "Weaning from mechanical ventilation"],
      sourceKeys: ["w34-cdc-hai", "w34-nhlbi-lung"]
    }),
    foundationCard({
      name: "Capnography",
      type: "physiologic-monitoring-method",
      category: "Respiratory Monitoring / Ventilation and Perfusion",
      aliases: ["waveform capnography", "continuous capnography", "capnogram", "capnometry waveform", "exhaled carbon dioxide waveform"],
      abbreviations: ["CO2 waveform"],
      definition: "Capnography is continuous graphical display of carbon dioxide concentration or partial pressure throughout the respiratory cycle. The waveform confirms that exhaled gas is reaching the sensor and reveals ventilation, airway mechanics, equipment continuity, and changes in pulmonary blood flow. End-tidal carbon dioxide is one number taken from the end of that waveform; it is not the whole method.",
      mechanism: "Carbon dioxide must move from cellular metabolism through venous blood, the right heart, pulmonary circulation, alveoli, airway, and sampling device. The capnogram therefore changes with metabolism, circulation, ventilation, airway obstruction, rebreathing, leak, disconnection, or sensor failure. A repeating inspiratory baseline, expiratory upstroke, alveolar plateau, and inspiratory downstroke create the usual contour.",
      assessment: "Look at the patient first, then waveform presence, shape, trend, respiratory rate, end-tidal value, airway and circuit, oxygenation, ventilation, perfusion, and recent interventions. A sudden absent waveform after intubation is an airway/circuit emergency until proven otherwise. A sloping expiratory plateau can suggest obstructed exhalation but is not diagnostic by itself.",
      complications: "False or distorted waveforms arise from leaks, small tidal volumes, mouth breathing with nasal sampling, secretions, water, kinked tubing, supplemental-oxygen dilution, calibration error, or low pulmonary flow. Capnography does not measure oxygenation and cannot replace a blood gas when arterial pH or PaCO2 is required.",
      nursing: "Document monitoring method, airway type, oxygen/ventilator support, waveform quality, respiratory rate, ETCO2, alarm limits, sedation, perfusion, intervention, and response. During transfers and turns, secure the airway and sampling line and immediately recheck the waveform.",
      urgent: "Act for apnea, loss of consciousness, sudden waveform disappearance, inability to ventilate, rapidly falling waveform with shock, rising CO2 with decreasing responsiveness, or a severe obstructive pattern with exhaustion. Assess and support airway/breathing while tracing the circuit from patient to sensor.",
      teaching: "Capnography monitors exhaled carbon dioxide and can reveal breathing failure before oxygen saturation falls, especially when supplemental oxygen is being given. It does not replace pulse oximetry because the two monitors answer different questions.",
      relatedTopics: ["End-tidal carbon dioxide monitoring", "Capnography and end-tidal carbon dioxide monitoring", "Arterial blood gas", "Procedural sedation", "Mechanical ventilation", "Cardiac arrest"],
      sourceKeys: ["w42-aarc-capnography-2011", "w42-aha-adult-als-2025"]
    }),
    foundationCard({
      name: "End-tidal carbon dioxide monitoring",
      type: "physiologic-measurement",
      category: "Respiratory Monitoring / Ventilation and Perfusion",
      aliases: ["end-tidal CO2", "end tidal carbon dioxide", "ETCO2 monitoring", "EtCO2", "PETCO2", "expired CO2 measurement"],
      abbreviations: ["ETCO2", "EtCO2", "PETCO2"],
      definition: "End-tidal carbon dioxide is the carbon dioxide measured near the end of exhalation, usually reported with capnography. It reflects the gas that reached the sensor after CO2 production, circulation to the lungs, alveolar exchange, and exhalation. It helps monitor ventilation and perfusion trends but is not identical to arterial PaCO2.",
      mechanism: "With stable metabolism and pulmonary blood flow, less effective alveolar ventilation tends to raise ETCO2 and more ventilation tends to lower it. Low cardiac output, pulmonary vascular obstruction, or increased dead space can lower ETCO2 because less CO2 reaches ventilated alveoli even when arterial CO2 is not low. This is why one low value can mean either increased ventilation or failing perfusion.",
      assessment: "Interpret the value with the waveform, respiratory rate and depth, airway pressure, oxygenation, blood pressure, pulse, temperature, activity, sedation, and clinical setting. Compare with PaCO2 only when sampling is timely and recognize that the gradient widens with dead space, shock, embolic disease, emphysema, and uneven ventilation-perfusion matching.",
      complications: "A normal-looking value can hide an abnormal waveform or widening PaCO2-ETCO2 gradient. Nasal sampling, leaks, very small breaths, rapid breathing, secretions, oxygen flow near the cannula, and device delay can distort the number. ETCO2 alone does not prove adequate ventilation, oxygenation, or tissue perfusion.",
      nursing: "Trend direction rather than charting only a spot value. Correlate changes with airway position, ventilation settings, circulation, sedation, CPR quality, bronchodilator or suction response, and obtain blood gas confirmation when the clinical question requires it.",
      urgent: "Escalate an abrupt fall or disappearance with airway loss, hypotension, weak pulses, suspected pulmonary embolism, or arrest; a progressive rise with somnolence or apnea; and any value that conflicts with a deteriorating patient. A sudden sustained rise during CPR may signal return of spontaneous circulation and should prompt rhythm/pulse assessment without unnecessary interruption.",
      teaching: "ETCO2 is an exhaled-gas measurement. It can change because of breathing or blood flow, so clinicians interpret the trend with the waveform and the patient rather than treating one number.",
      relatedTopics: ["Capnography", "Capnography and end-tidal carbon dioxide monitoring", "PaCO2", "Physiologic dead space", "Pulmonary embolism", "Shock"],
      sourceKeys: ["w42-aarc-capnography-2011", "w42-aha-adult-als-2025"]
    }),
    foundationCard({
      name: "Cannabis products",
      type: "substance-and-product-category",
      category: "Toxicology and Complementary Health / Cannabinoid Products",
      aliases: ["cannabis", "marijuana products", "THC products", "medical marijuana", "cannabis edibles", "inhaled cannabis", "hemp-derived cannabinoid products"],
      abbreviations: ["THC"],
      definition: "Cannabis products are plant-derived or manufactured cannabinoid preparations whose THC, cannabidiol, route, concentration, contaminants, and legal or regulatory status can differ substantially. THC is intoxicating and can impair attention, coordination, judgment, and driving; cannabidiol is not the same molecule and has its own adverse effects and drug interactions. A product label or the word natural does not establish purity, dose, or safety.",
      mechanism: "THC acts mainly through cannabinoid CB1 signaling in the central nervous system, altering perception, memory, motor control, appetite, autonomic tone, and anxiety. Cannabidiol has different and incompletely defined targets and can affect hepatic drug metabolism. Inhalation produces faster effects; oral products have delayed, variable absorption and can cause prolonged or unexpectedly intense intoxication when users redose too early.",
      assessment: "Ask nonjudgmentally about product name, THC/CBD content, route, amount, timing, source, co-ingestants, prescribed medicines, pregnancy, mental-health history, driving, and child access. Assess mental status, anxiety or psychosis, coordination, vital signs, vomiting, chest pain, trauma, sedation, and possible synthetic-cannabinoid or contaminant exposure.",
      complications: "Acute panic, paranoia, psychosis, impaired driving, falls, tachycardia, orthostasis, vomiting, accidental pediatric ingestion, and sedative stacking can occur. Heavy long-term use can produce cannabis use disorder and cannabinoid hyperemesis. Pregnancy and breastfeeding exposure, adolescent neurodevelopment, unstable psychosis or mania, and cardiovascular disease require particular caution.",
      nursing: "Use supportive care and a calm low-stimulation setting while assessing for another ingestion or emergency. Protect airway and falls, monitor hydration and electrolytes with severe vomiting, review interactions with warfarin, antiseizure drugs and sedatives, and follow local poison-center or emergency guidance.",
      urgent: "Seek emergency care for severe confusion, psychosis, suicidal or violent behavior, seizure, chest pain, syncope, major trauma, persistent vomiting/dehydration, respiratory depression, or any symptomatic child ingestion. Do not assume a severe presentation is ordinary cannabis when synthetic products or co-ingestants are possible.",
      teaching: "Do not drive or operate machinery while impaired, avoid combining with alcohol, opioids, benzodiazepines, or other sedatives, disclose use before surgery and when medicines change, and store all products locked away from children and pets. Delayed edible effects make early redosing dangerous.",
      relatedTopics: ["Cannabidiol", "CBD and cannabis products", "Cannabis intoxication", "Cannabis use disorder", "Cannabinoid hyperemesis syndrome", "Poisoning"],
      sourceKeys: ["fda-supplements", "medlineplus-herbals"]
    })
  ];

  const pathologyCards = [
    clinicalCard({
      name: "Wake-up stroke",
      category: "Neurology / Acute Stroke / Unknown-Onset Stroke",
      aliases: ["wake up stroke", "stroke on awakening", "unknown-onset ischemic stroke", "morning stroke"],
      definition: "A wake-up stroke is a stroke first recognized when a patient awakens with a new neurologic deficit after having gone to sleep or otherwise been unobserved at baseline. The exact onset is unknown; the last-known-well time is usually before sleep. It remains an emergency because selected patients may qualify for reperfusion using clinical and advanced-imaging criteria.",
      pathology: "An artery may occlude at any point during the unobserved interval. Time alone therefore overestimates or underestimates how long the tissue has been critically hypoperfused. Noncontrast CT excludes hemorrhage, CTA looks for an occluded artery, and selected DWI-FLAIR or perfusion mismatch estimates whether tissue may still be salvageable.",
      etiology: "The causes are the same as other ischemic strokes, including embolism from atrial fibrillation or the heart, large-artery atherosclerosis, small-vessel disease, dissection, hypercoagulability, and less common vascular disorders. Awakening with a deficit does not identify the mechanism.",
      riskFactors: ["Atrial fibrillation, vascular disease, hypertension, diabetes, smoking, sleep apnea, prior TIA or stroke", "Anticoagulant interruption or other thromboembolic risk", "Unwitnessed sleep or living alone, which makes timing uncertain"],
      signsSymptoms: ["New face, arm, or leg weakness or numbness", "Aphasia, dysarthria, confusion, neglect, or visual-field loss", "Severe imbalance, diplopia, dysphagia, vertigo with focal findings, or reduced consciousness"],
      diagnostics: ["Activate emergency stroke assessment and obtain bedside glucose immediately.", "Establish last-known-well and first-discovered-abnormal times separately.", "Use urgent noncontrast CT and vascular imaging; obtain MRI or perfusion imaging when the treatment pathway requires it."],
      labs: ["Glucose, CBC/platelets, coagulation testing when relevant, electrolytes, kidney function, and cause-directed studies support treatment safety but should not create avoidable imaging delay."],
      differentialDiagnoses: ["Hypoglycemia", "Postictal deficit", "Migraine aura", "Bell palsy", "Functional neurologic disorder", "Toxic-metabolic encephalopathy"],
      treatments: ["Provide airway, oxygenation, perfusion, temperature, and glucose support while avoiding unnecessary delay.", "Use thrombolysis or thrombectomy only when the stroke team confirms current clinical, imaging, timing, bleeding-risk, and protocol criteria.", "Begin cause workup, swallowing safety, rehabilitation, and secondary prevention after stabilization."],
      complications: ["Permanent infarction and disability", "Hemorrhagic transformation", "Cerebral edema", "Aspiration", "Recurrent stroke"],
      contraindications: ["Do not equate time of awakening with onset.", "Do not assume unknown onset automatically excludes every reperfusion option.", "Do not give food, drink, aspirin, or anticoagulation before swallowing and hemorrhage/treatment pathways are established."],
      nursingPriorities: ["Record last-known-well, discovery time, baseline, anticoagulants, glucose, neurologic findings, and transport/imaging milestones.", "Maintain NPO status until a validated swallow screen is passed.", "Trend deficits and escalate any decline immediately."],
      redFlags: ["Declining consciousness", "New severe headache or vomiting", "Seizure", "Unequal pupils", "Rapidly worsening focal deficit", "Airway compromise"],
      patientEducation: ["Call emergency services for any stroke sign on awakening; never wait to see whether it improves.", "Bring medication and anticoagulant information when possible."],
      nclexTraps: ["Wake-up stroke means onset unknown, not onset at awakening.", "A normal early noncontrast CT does not exclude ischemic stroke."],
      relatedTopics: ["Last-known-well time", "BE-FAST stroke screen", "CT perfusion", "Diffusion-weighted imaging", "Acute ischemic stroke"],
      sourceKeys: ["aha-asa-ais-2026", "ninds-stroke-assess", "fda-tnkase-2025"]
    }),
    clinicalCard({
      name: "Bloodstream infection",
      category: "Infectious Disease / Invasive Infection",
      aliases: ["blood stream infection", "bacteremia", "fungemia", "positive blood culture infection", "BSI"],
      abbreviations: ["BSI"],
      definition: "A bloodstream infection is clinically significant invasion of blood by bacteria, fungi, or another pathogen. It can arise from a vascular catheter, urinary tract, lung, abdomen, skin, heart valve, or another source and can progress quickly to sepsis because circulating organisms and host inflammation impair perfusion and organ function.",
      pathology: "Organisms enter blood directly or escape from an infected site. Repeated or sustained bacteremia is more concerning for an intravascular focus, endocarditis, infected device, deep abscess, or inadequate source control. The immune response can produce vasodilation, capillary leak, microvascular dysfunction, and organ injury even after antibiotics begin.",
      etiology: "Common causes include central or peripheral vascular devices, urinary infection, pneumonia, abdominal or biliary infection, skin/soft-tissue infection, endocarditis, immunosuppression, injection exposure, surgery, and contaminated infusate. A single common skin organism in one bottle may be contamination, but contamination must be judged by organism, number and timing of cultures, symptoms, devices, and host risk.",
      riskFactors: ["Central venous catheter or implanted device", "Neutropenia, transplantation, chemotherapy, advanced HIV, or severe chronic illness", "Recent surgery, dialysis, urinary catheter, wounds, or injection drug use", "Known local infection or endocarditis risk"],
      signsSymptoms: ["Fever or hypothermia, rigors, tachycardia, hypotension, confusion, weakness", "Rigors during line infusion or local source findings", "Oliguria, rising lactate, mottling, dyspnea, thrombocytopenia, or organ dysfunction in sepsis"],
      diagnostics: ["Obtain appropriately filled blood-culture sets from separate sites before antibiotics when this does not delay unstable care.", "Use paired line and peripheral cultures when catheter infection is suspected and follow time-to-positivity and organism guidance.", "Evaluate the source with examination, urine, imaging, echocardiography, device assessment, or drainage cultures as indicated."],
      labs: ["Blood cultures and susceptibility", "CBC, lactate, kidney/liver tests, coagulation and blood gas as severity requires", "Repeat cultures for selected organisms, persistent fever, endovascular infection, or lack of improvement"],
      differentialDiagnoses: ["Contaminated culture", "Viral illness", "Infusion or transfusion reaction", "Noninfectious systemic inflammation", "Localized infection without bloodstream invasion"],
      treatments: ["Begin prompt empiric antimicrobials matched to likely source, host, local resistance, and severity after cultures when feasible.", "Provide sepsis resuscitation and organ support when unstable.", "Remove infected devices, drain abscesses, relieve obstruction, or control another source because antibiotics penetrate poorly into biofilm, pus, and devitalized tissue.", "Narrow therapy and define duration from the organism, source, complications, culture clearance, and response."],
      complications: ["Sepsis and septic shock", "Endocarditis", "Septic thrombosis or emboli", "Metastatic abscess, osteomyelitis, or organ failure", "Recurrent bacteremia"],
      contraindications: ["Do not dismiss a positive culture as contamination without clinical and microbiologic review.", "Do not delay antibiotics in shock for difficult cultures.", "Do not treat every isolated culture result indefinitely without identifying source and significance."],
      nursingPriorities: ["Use meticulous aseptic technique for cultures and line access.", "Trend temperature, pressure, mental status, urine output, lactate, oxygenation, cultures, and source findings.", "Administer antimicrobials on time and monitor allergies, kidney/liver function, levels, and response.", "Coordinate device removal or source-control preparation promptly."],
      redFlags: ["Hypotension", "New confusion", "Rising lactate", "Oliguria", "Respiratory distress", "Persistent positive cultures", "Focal neurologic or back pain suggesting metastatic infection"],
      patientEducation: ["Report fever, shaking chills, confusion, breathing trouble, or new device-site drainage immediately.", "Complete the prescribed course and attend repeat-culture or source-control follow-up."],
      nclexTraps: ["Bacteremia can be transient, contaminant, or dangerous; context determines significance.", "Antibiotics without source control may fail."],
      relatedTopics: ["Central line-associated bloodstream infection", "Sepsis", "Endocarditis", "Central venous catheter"],
      sourceKeys: ["w34-cdc-hai"]
    }),
    clinicalCard({
      name: "Child abuse",
      category: "Pediatrics / Safeguarding / Maltreatment",
      aliases: ["child maltreatment", "physical child abuse", "sexual abuse of a child", "emotional abuse", "nonaccidental trauma"],
      abbreviations: ["NAT"],
      definition: "Child abuse is an act or pattern by a caregiver or other person that causes, threatens, or permits serious physical, sexual, or emotional harm or exploitation. It is different from child neglect, which centers on failure to meet essential needs, although both can coexist. The clinician's role is to protect the child, treat injury, document objectively, and follow mandatory reporting law and facility policy—not to prove a criminal case at the bedside.",
      pathology: "Injury may result from direct force, shaking, burning, poisoning, sexual contact, coercion, or chronic terror and humiliation. Repeated trauma affects brain development, stress regulation, attachment, mental health, growth, learning, and future cardiovascular and substance-use risk. Young age and dependence make children unable to escape or accurately describe danger.",
      etiology: "Abuse has no single cause. Risk can rise with caregiver violence, untreated mental illness or substance use, social isolation, unrealistic expectations, prior trauma, or household stress, but these factors never excuse harm and must not be used to stereotype a family. Abuse occurs in every demographic group.",
      riskFactors: ["Age under 4 years or inability to communicate", "Disability or high care needs", "Prior injury or child-protection involvement", "Domestic violence, coercive control, caregiver substance use, or unsafe access to weapons", "Child or history inconsistent with injury mechanism"],
      signsSymptoms: ["Bruises in protected areas, patterned marks, burns, bites, fractures of different ages, or injury inconsistent with development", "Delay in seeking care or changing explanations", "Fearful behavior, sexualized behavior, regression, sleep or school change, depression, self-harm", "Abdominal, head, genital, or oral injury without adequate explanation"],
      diagnostics: ["Stabilize life-threatening injury first and obtain a complete head-to-toe examination.", "Use age- and injury-specific imaging, laboratories, ophthalmology, forensic examination, STI testing, pregnancy testing, and toxicology under a child-protection protocol.", "Interview the child with open, nonleading prompts only within the clinician's role; avoid repeated questioning that can traumatize or contaminate evidence."],
      labs: ["CBC/coagulation can evaluate bleeding mimics; liver/pancreatic tests or urinalysis may reveal occult abdominal injury; other tests are injury- and protocol-specific."],
      differentialDiagnoses: ["Accidental injury consistent with development", "Bleeding disorder", "Osteogenesis imperfecta or metabolic bone disease", "Cultural practices causing skin marks", "Dermatologic disease"],
      treatments: ["Treat acute injury, pain, infection, pregnancy risk, or psychological crisis.", "Activate the multidisciplinary child-protection pathway and make the legally required report on reasonable suspicion.", "Create a safe disposition; do not discharge a child back into immediate danger while the concern is unresolved."],
      complications: ["Death or permanent disability", "Recurrent injury", "Post-traumatic stress, depression, anxiety, self-harm", "Developmental, educational, relationship, and long-term health effects"],
      contraindications: ["Do not confront the suspected perpetrator in a way that increases danger.", "Do not promise secrecy to the child.", "Do not delay reporting while waiting for certainty or conduct an unauthorized forensic interview."],
      nursingPriorities: ["Ensure immediate safety and privacy, separate histories when policy allows, and use trauma-informed language.", "Document exact statements in quotation marks, objective measurements, body diagrams/photos under policy, demeanor, and chain of custody.", "Notify the designated safeguarding team and mandated-reporting authority promptly."],
      redFlags: ["Altered consciousness", "Apnea or seizure", "Abdominal tenderness or shock", "Strangulation signs", "Sexual assault", "Threat of immediate return to danger", "Suicidal or homicidal risk"],
      patientEducation: ["Tell the child in developmentally appropriate language that the harm is not their fault and that adults will work to keep them safe."],
      nclexTraps: ["Suspicion triggers reporting; the nurse does not need proof.", "Objective documentation is stronger than labels such as 'abusive parent.'"],
      relatedTopics: ["Child neglect", "Abusive head trauma", "Intimate partner violence", "Trauma-informed care"],
      sourceKeys: ["aap-child-abuse", "aap-sexual-abuse", "aap-trafficking"]
    }),
    clinicalCard({
      name: "Child neglect",
      category: "Pediatrics / Safeguarding / Maltreatment",
      aliases: ["pediatric neglect", "medical neglect", "supervisory neglect", "failure to provide care"],
      definition: "Child neglect is a caregiver's failure to provide developmentally necessary food, shelter, supervision, health care, education, protection, or emotional support, resulting in harm or substantial risk of harm. Neglect is distinct from an act of abuse, although they often overlap. Poverty alone is not neglect; clinicians must identify unmet needs and danger while connecting families with resources and following reporting law.",
      pathology: "Persistent inadequate nutrition, hygiene, supervision, medical care, stimulation, or safety exposes the child to injury, infection, toxic stress, developmental delay, poor attachment, school failure, and worsening chronic disease. Medical neglect becomes dangerous when needed evaluation or treatment is repeatedly withheld and the child faces meaningful harm.",
      etiology: "Neglect may occur amid caregiver impairment, substance use, domestic violence, isolation, misinformation, coercive control, or deliberate refusal. Structural barriers such as food insecurity, lack of transportation, unstable housing, insurance problems, disability access, and unavailable childcare can produce unmet needs without caregiver indifference and require supportive intervention as well as safety assessment.",
      riskFactors: ["Very young age or disability", "Complex chronic illness requiring frequent care", "Unsafe housing, food insecurity, or inadequate supervision", "Caregiver impairment, violence, or substance use", "Repeated missed care with worsening disease or unexplained failure to thrive"],
      signsSymptoms: ["Poor growth, hunger, untreated dental or medical disease, recurrent preventable injury", "Inappropriate clothing or hygiene, unsafe sleeping or home environment", "Frequent school absence, developmental delay, fatigue, or being left alone beyond developmental ability", "Medication nonaccess or repeated missed essential treatment"],
      diagnostics: ["Assess growth trajectory, nutrition, development, complete physical findings, chronic-disease control, medication access, home and supervision history, and immediate safety.", "Use social work, child-protection, nutrition, developmental, and condition-specific evaluation.", "Clarify access barriers before attributing intent, while acting immediately when harm or danger is present."],
      labs: ["CBC, iron, electrolytes, nutrition markers, lead, infection or disease-specific tests may identify consequences but no laboratory test diagnoses neglect."],
      differentialDiagnoses: ["Poverty or resource deprivation without caregiver failure", "Malabsorption, endocrine or genetic disease", "Feeding disorder", "Developmental disability", "Care fragmentation or health-literacy barrier"],
      treatments: ["Treat malnutrition, injury, infection, missed chronic disease, and developmental needs.", "Provide concrete support such as food, transport, home nursing, medication access, housing, and caregiver education when these address the barrier.", "Report and create a protective plan when reasonable suspicion or immediate risk meets legal and policy criteria."],
      complications: ["Failure to thrive and developmental delay", "Preventable injury or death", "Poor chronic-disease control", "Mental-health and educational consequences", "Recurrent maltreatment"],
      contraindications: ["Do not equate poverty with neglect or punish a family for inaccessible care.", "Do not minimize immediate danger because a barrier is structural.", "Do not promise confidentiality that conflicts with mandatory reporting."],
      nursingPriorities: ["Assess immediate food, shelter, supervision, medication, and safety needs.", "Document objective findings, missed-care timeline, caregiver explanations, resources offered, and the child's statements.", "Coordinate social work and safeguarding while avoiding accusatory language that closes communication."],
      redFlags: ["Child left in immediate danger", "Severe malnutrition or dehydration", "Untreated life-threatening disease", "Unsafe caregiver intoxication", "Repeated serious injury", "Abandonment"],
      patientEducation: ["Explain the child's medical needs in plain language, confirm teach-back, and connect the family with concrete resources and follow-up."],
      nclexTraps: ["Neglect is failure to meet needs; abuse is an act of harm, but both can coexist.", "Resource barriers must be assessed without allowing an unsafe discharge."],
      relatedTopics: ["Child abuse", "Failure to thrive", "Food insecurity", "Medical neglect"],
      sourceKeys: ["aap-child-abuse"]
    }),
    clinicalCard({
      name: "Cleft lip",
      category: "Pediatrics / Congenital Craniofacial Disorders",
      aliases: ["harelip", "orofacial cleft lip", "unilateral cleft lip", "bilateral cleft lip"],
      definition: "Cleft lip is a congenital opening or separation of the upper lip caused by incomplete fusion of facial processes early in embryonic development. It may be unilateral or bilateral and may involve the alveolus and nose. It can occur alone or with cleft palate, but an intact palate must be assessed rather than assumed.",
      pathology: "Failure of the maxillary prominence to fuse fully with the medial nasal prominence leaves a gap in lip muscle, skin, and sometimes alveolar bone. Disrupted orbicularis oris continuity and nasal attachment affect lip seal, feeding, facial growth, dentition, and nasal symmetry.",
      etiology: "Most cleft lip is multifactorial, reflecting genetic susceptibility plus environmental exposures. Some cases occur in chromosomal or single-gene syndromes. Maternal smoking, diabetes, selected antiseizure medicines, folate-related factors, and other exposures can alter risk, but individual families should not be blamed for a multifactorial defect.",
      riskFactors: ["Family history of orofacial cleft", "Syndromic or chromosomal condition", "Maternal smoking or pregestational diabetes", "Selected teratogenic medication exposure"],
      signsSymptoms: ["Visible notch or complete separation of upper lip", "Nasal asymmetry and alveolar involvement", "Difficulty forming a seal around breast or bottle when the cleft is wide", "Associated palate, ear, dental, hearing, or syndromic findings"],
      diagnostics: ["Prenatal ultrasound may identify some cleft lips.", "After birth inspect and palpate the entire palate, assess feeding and airway, hearing and ears, growth, and associated anomalies.", "Genetic evaluation is indicated when other anomalies or family pattern suggests a syndrome."],
      labs: ["No laboratory test diagnoses isolated cleft lip; testing is syndrome- and preoperative-specific."],
      differentialDiagnoses: ["Cleft palate without lip involvement", "Facial cleft", "Traumatic lip defect", "Syndromic craniofacial anomaly"],
      treatments: ["Use feeding support that achieves an adequate seal and safe intake; many infants with isolated cleft lip can breastfeed with positioning support.", "Coordinate multidisciplinary cleft-team care for lip repair, nasal/alveolar management, dental care, speech, hearing, and psychosocial support.", "Timing and technique of surgery are individualized; preoperative orthopedics may be offered in selected centers."],
      complications: ["Feeding difficulty and poor growth", "Dental and alveolar problems", "Nasal asymmetry", "Speech or hearing issues when palate is also involved", "Psychosocial stress"],
      contraindications: ["Do not assume a cleft lip means a cleft palate or that the palate is normal without examination.", "Do not enlarge a nipple opening in an uncontrolled way because flow can become unsafe."],
      nursingPriorities: ["Assess airway, palate, feeding endurance, intake, weight, hydration, and caregiver coping.", "Teach individualized feeding and postoperative wound/arm-restraint policy without impeding breathing or comfort.", "After repair protect the incision, control pain, and monitor airway, bleeding, hydration, and infection."],
      redFlags: ["Cyanosis or airway obstruction", "Inability to maintain hydration", "Aspiration signs", "Postoperative bleeding or wound separation"],
      patientEducation: ["The condition results from early development and is not the parent's fault.", "Keep cleft-team, hearing, dental, and surgical follow-up even after the lip looks repaired."],
      nclexTraps: ["Inspect the palate in every infant with cleft lip.", "Feeding ability depends on palate involvement, seal, flow, and endurance—not appearance alone."],
      relatedTopics: ["Cleft palate", "Feeding an infant with an orofacial cleft", "Congenital disorders"],
      sourceKeys: ["cdc-cleft"]
    }),
    clinicalCard({
      name: "Cleft palate",
      category: "Pediatrics / Congenital Craniofacial Disorders",
      aliases: ["palatal cleft", "orofacial cleft palate", "submucous cleft palate"],
      definition: "Cleft palate is a congenital opening or muscle defect of the hard palate, soft palate, or both caused by incomplete palatal fusion. It may occur with or without cleft lip. Because the infant cannot fully separate the mouth from the nose or generate normal suction, feeding, middle-ear ventilation, speech, and airway care require focused support.",
      pathology: "Palatal shelves fail to fuse completely or palatal muscles fail to unite normally. Milk and air can pass between oral and nasal cavities, the eustachian tubes ventilate poorly, and the repaired soft palate may still need therapy to achieve velopharyngeal closure for speech.",
      etiology: "Most cases are multifactorial; others occur with Pierre Robin sequence, 22q11.2 deletion, Stickler syndrome, or another genetic condition. Maternal smoking, diabetes, selected teratogenic medicines, and genetic susceptibility affect risk.",
      riskFactors: ["Family history", "Associated micrognathia or syndromic features", "Maternal smoking or pregestational diabetes", "Selected teratogenic medication exposure"],
      signsSymptoms: ["Visible palatal opening or bifid uvula/submucous findings", "Nasal milk regurgitation, prolonged feeds, coughing, fatigue, poor weight gain", "Recurrent otitis media or hearing loss", "Hypernasal speech or articulation problems later"],
      diagnostics: ["Inspect and palpate the palate after birth because a posterior or submucous cleft can be missed visually.", "Assess airway, especially with micrognathia; observe an entire feed and track growth.", "Arrange audiology, ear, speech, dental, surgical, and genetic evaluation through a cleft team."],
      labs: ["No laboratory test diagnoses cleft palate; testing is guided by associated anomalies and operative planning."],
      differentialDiagnoses: ["Isolated cleft lip", "High-arched palate", "Submucous cleft", "Neuromuscular swallowing dysfunction", "Pierre Robin sequence"],
      treatments: ["Use upright positioning, pacing, frequent burping, and a specialty feeder that allows milk delivery without strong suction.", "Repair the palate at the individualized age recommended by the cleft team to support feeding, growth, and speech development.", "Treat middle-ear disease and hearing loss and provide long-term speech-language and dental/orthodontic care."],
      complications: ["Poor growth or dehydration", "Aspiration or airway difficulty in associated sequences", "Otitis media and conductive hearing loss", "Velopharyngeal insufficiency, speech disorder, dental problems"],
      contraindications: ["Do not feed supine or squeeze a specialty bottle faster than the infant can coordinate swallowing and breathing.", "Do not place hard objects, straws, utensils, or suction devices against a fresh palatal repair unless the surgical plan allows it."],
      nursingPriorities: ["Assess airway, respiratory coordination, feeding duration, intake, nasal regurgitation, weight, hydration, and caregiver technique.", "After repair maintain airway positioning, pain control, hydration, and incision protection while following the surgeon's feeding and oral-care protocol."],
      redFlags: ["Airway obstruction", "Apnea or cyanosis", "Recurrent aspiration", "Dehydration", "Postoperative hemorrhage or wound dehiscence"],
      patientEducation: ["Specialty bottles compensate for weak suction; they do not mean the infant is failing.", "Hearing and speech follow-up remains necessary after surgical closure."],
      nclexTraps: ["Cleft palate creates greater suction and middle-ear problems than isolated cleft lip.", "A normal-looking lip does not exclude a posterior palate defect."],
      relatedTopics: ["Cleft lip", "Dysphagia", "Otitis media", "Speech development"],
      sourceKeys: ["cdc-cleft"]
    }),
    clinicalCard({
      name: "Dysglycemia",
      category: "Endocrinology / Glucose Regulation",
      aliases: ["abnormal blood glucose", "glucose dysregulation", "glycemic dysregulation", "unstable blood sugar"],
      definition: "Dysglycemia is an umbrella term for abnormal glucose regulation, including hyperglycemia, hypoglycemia, excessive glucose variability, or combinations of these patterns. It describes a finding or state, not a final diagnosis. The next question is why regulation failed—diabetes, medication, critical illness, endocrine disease, nutrition change, organ failure, or another cause.",
      pathology: "Blood glucose reflects the balance among intestinal absorption, hepatic production, insulin secretion, insulin action, counterregulatory hormones, tissue use, and kidney clearance. Failure at any point can push glucose too high, too low, or through dangerous swings. Both extremes injure through different mechanisms: low glucose deprives the brain of fuel, while sustained severe hyperglycemia causes osmotic diuresis, dehydration, electrolyte loss, and cellular stress.",
      etiology: "Causes include diabetes mellitus, insulin or sulfonylurea exposure, glucocorticoids, antipsychotics, immune checkpoint inhibitors, enteral/parenteral nutrition, sepsis, pregnancy, pancreatic or endocrine disease, liver or kidney failure, alcohol, fasting, and post-bariatric or reactive hypoglycemia.",
      riskFactors: ["Known diabetes or prediabetes", "Insulin or glucose-lowering medication", "Critical illness or infection", "Steroid, antipsychotic, transplant, or cancer therapy", "Kidney, liver, pancreatic, endocrine, pregnancy, or nutrition change"],
      signsSymptoms: ["Hyperglycemia: thirst, polyuria, dehydration, blurred vision, fatigue, weight loss", "Hypoglycemia: sweating, tremor, hunger, palpitations, confusion, behavior change, seizure or coma", "Glucose variability may cause alternating symptoms and complicate safe treatment"],
      diagnostics: ["Confirm the pattern with appropriately timed point-of-care and laboratory glucose values.", "Use A1C, fasting glucose, oral glucose testing, ketones, C-peptide, medication review, nutrition timeline, organ tests, or endocrine testing according to the question.", "Classify the cause instead of labeling every hyperglycemic patient type 2 diabetes."],
      labs: ["Glucose trend", "A1C when reliable", "Beta-hydroxybutyrate, anion gap, bicarbonate, osmolality, potassium and kidney function for severe hyperglycemia", "Insulin, C-peptide and drug testing for selected unexplained hypoglycemia"],
      differentialDiagnoses: ["Diabetes mellitus", "Stress hyperglycemia", "Medication-induced dysglycemia", "Endocrine hormone excess or deficiency", "Laboratory or meter error"],
      treatments: ["Treat symptomatic hypoglycemia immediately with oral glucose when safe or IV/glucagon rescue when not.", "Treat DKA/HHS and severe hyperglycemia with protocolized fluids, electrolytes, insulin, and trigger management.", "For nonemergency dysglycemia, correct the cause and individualize nutrition, monitoring, and medication."],
      complications: ["Seizure, coma, injury, or death from hypoglycemia", "DKA or HHS", "Dehydration and electrolyte disturbance", "Long-term microvascular and cardiovascular injury when diabetes is sustained"],
      contraindications: ["Do not use the term dysglycemia as a substitute for determining the cause.", "Do not diagnose diabetes from an inaccurate bedside meter or one stress value without applying criteria.", "Do not give insulin without considering potassium, nutrition, kidney function, and hypoglycemia risk."],
      nursingPriorities: ["Trend glucose with symptoms, meals/nutrition, medication timing, steroids, dialysis, and activity.", "Use hypoglycemia precautions and recheck after treatment.", "Escalate ketones, acidosis, hyperosmolality, mental-status change, or recurrent unexplained lows."],
      redFlags: ["Seizure or coma", "Inability to swallow", "Kussmaul breathing", "Severe dehydration", "Hypotension", "Ketosis/acidosis", "Focal deficit that persists after glucose correction"],
      patientEducation: ["Know personal glucose targets and the signs and treatment of low and high glucose.", "Do not stop essential HIV, cancer, transplant, psychiatric, or steroid therapy without the treating team; glucose treatment can be adjusted safely."],
      nclexTraps: ["Dysglycemia is a descriptor, not a diabetes subtype.", "A normal A1C can miss recent or episodic dysglycemia."],
      relatedTopics: ["Hypoglycemia", "Hyperglycemia", "Diabetes mellitus classification", "Bedside capillary glucose testing"],
      sourceKeys: ["w41-ada-classification-2026", "w37-ada-diabetes-2026"]
    }),
    clinicalCard({
      name: "AIDS",
      category: "Infectious Disease / HIV / Advanced HIV Disease",
      aliases: ["acquired immunodeficiency syndrome", "advanced HIV", "stage 3 HIV", "late-stage HIV"],
      abbreviations: ["AIDS"],
      definition: "AIDS is the advanced stage of HIV infection, defined by severe immune damage—classically a CD4 count below 200 cells/mm3 or the presence of an AIDS-defining opportunistic infection or cancer, regardless of CD4 count. AIDS is not a different virus. Effective antiretroviral therapy can suppress HIV, allow immune recovery, prevent many opportunistic diseases, and greatly improve survival.",
      pathology: "Untreated or inadequately controlled HIV replicates in and depletes CD4 T lymphocytes, disrupts lymphoid tissue, and weakens cell-mediated immunity. As CD4 reserve falls, organisms and cancers normally controlled by T cells can cause invasive disease. Viral suppression stops ongoing replication, but immune recovery takes time and established organ injury may persist.",
      etiology: "AIDS develops from HIV infection that is untreated, diagnosed late, resistant, intermittently suppressed, or complicated by barriers to sustained effective therapy. It is not caused by casual contact, and an AIDS diagnosis cannot be made from appearance or one symptom.",
      riskFactors: ["Untreated or late-diagnosed HIV", "Interrupted or ineffective ART", "Drug resistance or major absorption/interaction problem", "Severe social or access barriers", "Advanced immunosuppression at diagnosis"],
      signsSymptoms: ["Persistent fever, night sweats, weight loss, diarrhea, fatigue, lymphadenopathy", "Oral/esophageal candidiasis, pneumocystis pneumonia, tuberculosis, cryptococcosis, toxoplasmosis, CMV disease", "Kaposi sarcoma, selected lymphomas, invasive cervical cancer, neurologic or wasting syndromes"],
      diagnostics: ["Confirm HIV with the recommended laboratory testing algorithm and measure viral load and CD4 count.", "Evaluate symptoms urgently for opportunistic infection or malignancy with site-specific microbiology, imaging, pathology, and specialist assessment.", "Review resistance, ART history, hepatitis/TB/STI status, kidney/liver function, pregnancy, vaccines, interactions, and adherence barriers."],
      labs: ["HIV viral load", "CD4 count and percentage", "Resistance testing when indicated", "CBC and organ tests", "Pathogen- and malignancy-specific studies"],
      differentialDiagnoses: ["Primary immunodeficiency", "Medication or chemotherapy immunosuppression", "Hematologic malignancy", "Severe malnutrition", "Other causes of CD4 lymphopenia"],
      treatments: ["Start or optimize combination antiretroviral therapy with HIV expertise; timing may be coordinated with treatment of selected opportunistic infections to reduce interaction or immune-reconstitution risk.", "Treat the specific opportunistic infection or cancer and provide CD4- and exposure-based prophylaxis when indicated.", "Address adherence, interactions, access, nutrition, mental health, prevention, vaccination, and partner testing."],
      complications: ["Life-threatening opportunistic infection", "Malignancy", "Neurologic, renal, cardiovascular, hepatic, or wasting disease", "Immune reconstitution inflammatory syndrome after ART initiation"],
      contraindications: ["Do not delay urgent opportunistic-infection treatment while waiting for every staging test.", "Do not stop ART abruptly or combine interacting drugs without HIV/pharmacy review.", "Do not use AIDS as a stigmatizing synonym for every person with HIV."],
      nursingPriorities: ["Assess oxygenation, neurologic status, fever, hydration, weight, oral intake, skin/mucosa, adherence, interactions, and exposure precautions appropriate to the actual pathogen.", "Administer ART and anti-infectives precisely and monitor organ toxicity and immune-reconstitution symptoms.", "Protect confidentiality and use stigma-free language."],
      redFlags: ["Dyspnea or hypoxemia", "Severe headache, meningismus, focal deficit or seizure", "Vision change", "Shock", "Severe diarrhea/dehydration", "New focal pain or rapidly progressive lesion"],
      patientEducation: ["AIDS is treatable advanced HIV disease; taking ART every day can suppress the virus and permit immune recovery.", "Sustained undetectable viral load prevents sexual transmission of HIV, but follow-up and other infection prevention remain important."],
      nclexTraps: ["AIDS is defined by CD4 threshold or an AIDS-defining condition, not viral load alone.", "Standard precautions apply unless a specific opportunistic infection requires additional precautions."],
      relatedTopics: ["HIV infection", "Antiretroviral therapy", "Pneumocystis jirovecii pneumonia", "Cryptococcal meningitis", "CD4 count"],
      sourceKeys: ["nih-hiv"]
    }),
    clinicalCard({
      name: "Lipodystrophy",
      category: "Endocrinology / Adipose-Tissue Disorders",
      aliases: ["lipodystrophy syndrome", "lipoatrophy", "generalized lipodystrophy", "partial lipodystrophy", "abnormal fat distribution disorder"],
      abbreviations: ["CGL", "FPLD", "AGL", "APL"],
      definition: "Lipodystrophy is a group of congenital or acquired disorders with generalized or regional loss of functional adipose tissue, sometimes alongside abnormal fat accumulation elsewhere. It is not merely cosmetic. Without safe adipose storage, triglycerides spill into liver and muscle, leptin may fall, appetite and hepatic glucose output rise, and severe insulin resistance, diabetes, hypertriglyceridemia, fatty liver, and pancreatitis can develop.",
      pathology: "Healthy adipocytes buffer energy after meals and release adipokines such as leptin. When adipose tissue is absent or dysfunctional, ectopic lipid causes lipotoxic insulin resistance and organ injury. The metabolic severity depends more on functional fat loss and leptin deficiency than on body mass index.",
      classification: ["Congenital generalized lipodystrophy", "Familial partial lipodystrophy", "Acquired generalized lipodystrophy", "Acquired partial lipodystrophy", "Localized lipodystrophy, including injection-site change, which usually lacks systemic metabolic disease"],
      etiology: "Inherited forms involve genes controlling adipocyte development, lipid droplets, nuclear-envelope function, or triglyceride storage. Acquired forms can follow autoimmune disease, panniculitis, infection, or treatment. Older antiretroviral exposures can produce lipoatrophy, while localized insulin-injection changes are different from systemic syndromes.",
      riskFactors: ["Characteristic childhood or pubertal fat-loss pattern", "Family history of severe insulin resistance or unusual body habitus", "Autoimmune panniculitis or acquired fat loss", "HIV treatment history", "Repeated injections into the same site"],
      signsSymptoms: ["Generalized muscular appearance or regional limb/buttock fat loss with relative face/neck/abdominal fat", "Acanthosis nigricans, severe hypertriglyceridemia, diabetes, fatty liver or hepatomegaly", "Early cardiomyopathy, kidney disease, reproductive dysfunction, or pancreatitis in selected syndromes"],
      diagnostics: ["Map fat distribution over time using history, examination, photos or body-composition imaging when useful.", "Assess fasting glucose/A1C, lipids, liver, kidney, blood pressure, reproductive/endocrine status, and pancreatitis or cardiac risk.", "Use genetic testing for suspected inherited disease and immune/complement evaluation for selected acquired partial forms."],
      labs: ["Glucose/A1C and C-peptide", "Triglycerides and full lipids", "Liver tests and imaging", "Kidney tests and urine protein", "Leptin can support treatment selection but a low value alone does not diagnose the syndrome"],
      differentialDiagnoses: ["Ordinary obesity or lean diabetes", "Cushing syndrome", "Severe malnutrition", "Cachexia", "Bodybuilding", "Localized injection-site lipoatrophy/lipohypertrophy"],
      treatments: ["Use nutrition and activity plans that reduce ectopic lipid while preventing malnutrition.", "Treat diabetes, triglycerides, fatty liver, blood pressure, and organ complications aggressively and specifically.", "Metreleptin can improve metabolic disease in selected generalized lipodystrophy and selected partial cases under specialist and regulatory criteria; it is not a cosmetic fat-restoration drug.", "Rotate injection sites and change offending treatment when localized or medication-associated disease is present."],
      complications: ["Severe insulin-resistant diabetes", "Acute pancreatitis", "Steatohepatitis/cirrhosis", "Cardiomyopathy", "Kidney disease", "Reproductive dysfunction"],
      contraindications: ["Do not diagnose systemic lipodystrophy from one injection-site dent.", "Do not assume a lean appearance means insulin sensitivity.", "Do not use metreleptin without specialist eligibility, antibody/lymphoma risk, and product-specific monitoring."],
      nursingPriorities: ["Document distribution of fat loss, injection sites, glucose, triglycerides, liver size/function, blood pressure, reproductive symptoms, and pancreatitis signs.", "Teach site rotation and concentrated-insulin safety when required.", "Escalate abdominal pain, extreme triglycerides, DKA/HHS, liver decompensation, or cardiac symptoms."],
      redFlags: ["Severe abdominal pain/vomiting", "Ketosis or hyperosmolar symptoms", "Jaundice/ascites", "Syncope or heart failure", "Rapid metabolic deterioration in a child"],
      patientEducation: ["The disease is loss of healthy fat function, not a failure of willpower.", "Keep lifelong metabolic, liver, heart, kidney, and reproductive follow-up."],
      nclexTraps: ["Lipodystrophy can cause profound insulin resistance in a person who is not obese.", "Localized injection lipohypertrophy changes insulin absorption but is not the same as generalized lipodystrophy."],
      relatedTopics: ["Lipodystrophy-associated diabetes mellitus", "Severe insulin resistance", "Hypertriglyceridemia", "Fatty liver disease"],
      directTreatmentMedications: ["Metreleptin"],
      medicationTreatmentNote: "Metreleptin is a specialist therapy for selected generalized and selected partial lipodystrophy; other medicines treat the specific metabolic complication.",
      sourceKeys: ["w41-lipodystrophy-guideline", "w41-ada-classification-2026"]
    }),
    clinicalCard({
      name: "Poisoning",
      category: "Toxicology / Harmful Exposures",
      aliases: ["toxic exposure", "intoxication", "poison exposure", "toxin exposure"],
      definition: "Poisoning is illness or injury caused by exposure to a substance in a harmful amount or route. The exposure may be swallowed, inhaled, injected, absorbed through skin or eye, or produced by a bite, sting, plant, gas, household product, medication, or industrial chemical. Poisoning is broader than overdose: a normal-sized exposure by the wrong route can poison, while overdose specifically means too much of a dose.",
      pathology: "Toxins disrupt receptors, enzymes, ion channels, oxygen use, cellular respiration, acid-base balance, or organ membranes. The immediate threat often comes from airway compromise, hypoventilation, dysrhythmia, seizure, shock, temperature change, or metabolic collapse before the exact substance is known.",
      etiology: "Poisoning can be accidental, occupational, environmental, medication-related, recreational, malicious, or self-inflicted. Children explore; older adults and patients with low vision or cognitive impairment may confuse products; intentional exposure requires mental-health and safety evaluation.",
      riskFactors: ["Unsecured medicines or chemicals", "Polypharmacy or cognitive impairment", "Occupational/industrial exposure", "Substance use", "Self-harm risk", "Fire/smoke or carbon-monoxide exposure"],
      signsSymptoms: ["Altered consciousness, abnormal pupils, secretions, sweating or dryness", "Slow or rapid breathing, hypoxemia, cyanosis", "Bradycardia, tachycardia, hypotension, dysrhythmia", "Vomiting, abdominal pain, seizure, weakness, burns, unusual odor or temperature"],
      diagnostics: ["Stabilize first, then identify substance, dose/concentration, route, time, coexposures, container, and symptoms.", "Use ECG, glucose, electrolytes, blood gas, anion/osmolal gap, acetaminophen/salicylate levels, pregnancy test, organ tests, imaging, or specific assays according to the exposure.", "Contact the regional poison center or toxicologist early."],
      labs: ["No universal toxicology screen detects every poison.", "Serial levels matter for selected substances; a negative routine screen can miss fentanyl, many synthetics, toxic alcohols, or timing-dependent exposure."],
      differentialDiagnoses: ["Sepsis", "Stroke", "Hypoglycemia", "Seizure/postictal state", "Endocrine or metabolic emergency", "Trauma"],
      treatments: ["Support airway, ventilation, oxygenation, circulation, temperature, glucose, and seizures.", "Remove contaminated clothing and irrigate skin/eyes when indicated while protecting staff.", "Use activated charcoal, whole-bowel irrigation, antidote, enhanced elimination, or dialysis only for the specific agent, timing, airway, and contraindications."],
      complications: ["Respiratory arrest", "Dysrhythmia", "Seizure", "Aspiration", "Liver/kidney failure", "Delayed organ injury", "Self-harm recurrence"],
      contraindications: ["Do not induce vomiting.", "Do not neutralize acids with bases or vice versa.", "Do not give activated charcoal to an unprotected airway or for a substance it will not bind.", "Do not delay resuscitation for a toxicology screen."],
      nursingPriorities: ["Use appropriate decontamination PPE and prevent secondary exposure.", "Bring containers/photos without contaminating the care area.", "Trend airway, rhythm, temperature, glucose, mental status, urine output, labs, and delayed-toxicity windows.", "Maintain suicide precautions when intentional exposure is possible."],
      redFlags: ["Hypoventilation", "Seizure", "Wide QRS or prolonged QT", "Shock", "Severe acidosis", "Caustic airway symptoms", "Carbon-monoxide exposure", "Intentional self-harm"],
      patientEducation: ["Call poison control/emergency services rather than trying a home remedy.", "Store products in original locked containers and never mix cleaning chemicals."],
      nclexTraps: ["Poisoning is not synonymous with overdose.", "A normal routine drug screen does not rule out dangerous poisoning."],
      relatedTopics: ["Overdose", "Toxidromes", "Activated charcoal", "Antidotes and toxicologic rescue therapies"],
      sourceKeys: ["medlineplus", "cdc-overdose"]
    }),
    clinicalCard({
      name: "Overdose",
      category: "Toxicology / Excess Dose",
      aliases: ["drug overdose", "medication overdose", "taking too much medicine", "OD"],
      abbreviations: ["OD"],
      definition: "Overdose is exposure to more of a drug or substance than the body can safely tolerate. It may be intentional or unintentional and may involve one medicine, several substances, a concentrated formulation, a dosing error, or accumulation from kidney/liver failure. An overdose can cause poisoning, but the terms are not identical.",
      pathology: "Toxicity reflects the drug's mechanism at excessive exposure: opioids suppress brainstem ventilation, acetaminophen exhausts safe metabolism and forms a hepatotoxic metabolite, sedatives depress consciousness, stimulants raise sympathetic demand, and cardiotoxic drugs disrupt conduction or contractility. Extended-release products and long half-lives can produce delayed or recurrent deterioration.",
      etiology: "Causes include dosing mistakes, duplicate combination products, pediatric ingestion, medication accumulation, counterfeit pills, substance use, and self-harm. Intent cannot be inferred from dose alone.",
      riskFactors: ["Opioid or sedative use", "Polypharmacy and duplicate ingredients", "Kidney/liver impairment", "Cognitive or vision impairment", "Substance-use disorder", "Depression or suicidal intent", "Unsecured medications"],
      signsSymptoms: ["Altered consciousness or behavior", "Slow, shallow, irregular or absent breathing", "Vomiting, seizure, agitation, hyperthermia", "Bradycardia, tachycardia, hypotension or dysrhythmia", "Specific toxidrome findings"],
      diagnostics: ["Assess ABCs, bedside glucose, ECG, temperature, pupils, skin/secretions, and neurologic status immediately.", "Identify exact product, strength, amount, time, formulation, coingestants, and prescriptions.", "Use targeted serial levels and labs; obtain acetaminophen level in many intentional or uncertain ingestions because it may initially be silent."],
      labs: ["Glucose, electrolytes, kidney/liver tests, blood gas, lactate, pregnancy test and targeted concentrations", "Routine toxicology screens have important false negatives and false positives"],
      differentialDiagnoses: ["Stroke", "Sepsis", "Hypoglycemia", "Postictal state", "Head injury", "Metabolic encephalopathy"],
      treatments: ["Support ventilation and circulation first.", "Give naloxone for suspected opioid-induced respiratory depression while providing rescue breathing.", "Use substance-specific antidotes, decontamination, observation, enhanced elimination, or dialysis with poison-center/toxicology guidance.", "Complete suicide-risk evaluation and safe disposition after medical stabilization when intentional exposure is possible."],
      complications: ["Hypoxic brain injury", "Aspiration pneumonia", "Rhabdomyolysis", "Liver/kidney failure", "Dysrhythmia", "Recurrent toxicity", "Death"],
      contraindications: ["Do not wait for pinpoint pupils before treating suspected opioid apnea.", "Do not induce vomiting.", "Do not discharge solely because a patient briefly awakens after naloxone; recurrence depends on the opioid and formulation.", "Do not assume an overdose was accidental without a private safety assessment."],
      nursingPriorities: ["Maintain airway and continuous cardiorespiratory monitoring appropriate to the agent.", "Inventory all products and duplicate ingredients, secure belongings under policy, and preserve evidence when needed.", "Trend level, ECG, mental status, breathing, temperature, urine output, and antidote response through the expected toxicity window."],
      redFlags: ["Respiratory depression", "Seizure", "Shock", "Wide QRS", "Severe agitation/hyperthermia", "Rising acetaminophen level or liver injury", "Intentional exposure"],
      patientEducation: ["Use one medication list, avoid duplicate acetaminophen or sedative products, secure naloxone when opioid risk exists, and store medicines locked away.", "After intentional overdose, crisis and mental-health follow-up are part of life-saving treatment."],
      nclexTraps: ["Overdose is dose-related; poisoning can occur without an overdose.", "Improvement after an antidote does not always end the monitoring period."],
      relatedTopics: ["Poisoning", "Opioid overdose", "Naloxone", "Acetaminophen toxicity"],
      sourceKeys: ["cdc-overdose", "medlineplus"]
    }),
    clinicalCard({
      name: "Distal renal tubular acidosis",
      category: "Nephrology / Acid-Base Disorders / Renal Tubular Acidosis",
      aliases: ["type 1 RTA", "distal RTA", "classic distal renal tubular acidosis"],
      abbreviations: ["dRTA", "RTA type 1"],
      definition: "Distal renal tubular acidosis is a normal-anion-gap metabolic acidosis caused by inadequate hydrogen-ion secretion in the distal nephron. The kidney cannot acidify urine appropriately, so systemic acid accumulates while urine remains inappropriately alkaline; chronic alkaline urine, hypocitraturia, and calcium release from bone promote stones and nephrocalcinosis.",
      pathology: "Alpha-intercalated cells normally secrete hydrogen and regenerate bicarbonate. Failure of proton pumps, basolateral transport, or the distal gradient lowers net acid excretion. Potassium is commonly lost, and chronic buffering of acid by bone contributes to osteomalacia or rickets.",
      etiology: "Causes include autoimmune disease such as Sjogren syndrome, hereditary transporter defects, obstructive or interstitial kidney disease, selected medicines such as amphotericin B, and toxins. Incomplete distal RTA can present with stones despite less obvious serum acidosis.",
      riskFactors: ["Sjögren syndrome or systemic autoimmune disease", "Recurrent calcium-phosphate stones or nephrocalcinosis", "Amphotericin or tubulointerstitial disease", "Family history or childhood growth failure"],
      signsSymptoms: ["Weakness or cramps from hypokalemia", "Recurrent kidney stones or flank pain", "Polyuria", "Bone pain, fractures, rickets/poor growth", "Symptoms of underlying autoimmune disease"],
      diagnostics: ["Confirm persistent hyperchloremic normal-gap metabolic acidosis and exclude diarrhea.", "Assess urine pH during systemic acidosis; persistently above about 5.5 supports impaired distal acidification but UTI, diet, and timing can confound it.", "Use urine anion/osmolal gap, potassium, imaging, autoimmune and genetic evaluation as indicated."],
      labs: ["Low serum bicarbonate", "Often low potassium", "Normal anion gap with high chloride", "Inappropriately high urine pH", "Hypocitraturia; urine calcium may be high"],
      differentialDiagnoses: ["Diarrheal bicarbonate loss", "Proximal RTA", "Type 4 RTA", "Urea-splitting UTI", "Chronic kidney disease acidosis"],
      treatments: ["Replace alkali with potassium citrate or bicarbonate-based therapy to correct acidosis and reduce stone/bone injury.", "Correct potassium safely and treat the autoimmune, obstructive, medication, or hereditary cause.", "Monitor urine citrate, stone burden, growth, and bone health."],
      complications: ["Hypokalemic dysrhythmia or weakness", "Nephrolithiasis/nephrocalcinosis", "CKD", "Osteomalacia/rickets", "Growth failure"],
      contraindications: ["Do not diagnose distal RTA from urine pH alone.", "Do not give sodium-heavy alkali without considering heart failure, blood pressure, edema, and sodium load.", "Correct severe hypokalemia before or with alkali because bicarbonate can drive potassium lower."],
      nursingPriorities: ["Trend bicarbonate, potassium, chloride, kidney function, urine pH/citrate, ECG when severe, stone symptoms, growth and bone pain.", "Assess GI losses and medication causes before labeling RTA.", "Teach adherence because symptoms can improve before stone and bone risk is corrected."],
      redFlags: ["Severe weakness", "Dysrhythmia", "Very low potassium", "Obstructed infected stone", "Severe childhood acidosis/dehydration"],
      patientEducation: ["Alkali replaces what the kidney cannot regenerate and protects bone and kidney, not just the bicarbonate number.", "Maintain prescribed hydration and stone-prevention follow-up."],
      nclexTraps: ["Type 1 distal RTA usually has hypokalemia and stone risk.", "Urine pH must be interpreted during systemic acidosis and without a urea-splitting infection."],
      relatedTopics: ["Proximal renal tubular acidosis", "Type 4 renal tubular acidosis", "Normal-anion-gap metabolic acidosis", "Nephrolithiasis"],
      directTreatmentMedications: ["Sodium bicarbonate"],
      medicationTreatmentNote: "Alkali type and dose are individualized to potassium, volume status, kidney function, stone chemistry, and the cause.",
      sourceKeys: ["kidney-acid-control-2022", "ajkd-mixed-acid-base-2025"]
    }),
    clinicalCard({
      name: "Proximal renal tubular acidosis",
      category: "Nephrology / Acid-Base Disorders / Renal Tubular Acidosis",
      aliases: ["type 2 RTA", "proximal RTA", "bicarbonate wasting RTA"],
      abbreviations: ["pRTA", "RTA type 2"],
      definition: "Proximal renal tubular acidosis is a normal-anion-gap metabolic acidosis caused by impaired bicarbonate reabsorption in the proximal tubule. Filtered bicarbonate spills into urine until the blood bicarbonate falls to a new lower threshold; after that, intact distal nephrons can acidify urine, so urine pH is variable rather than persistently high.",
      pathology: "The proximal tubule normally reclaims most filtered bicarbonate. Transport failure produces bicarbonaturia, sodium and water loss, secondary aldosterone activation, and potassium wasting. When generalized proximal transport is impaired, Fanconi syndrome adds glucosuria without marked hyperglycemia, phosphate and uric-acid wasting, aminoaciduria, and bone disease.",
      etiology: "Causes include Fanconi syndromes, monoclonal light-chain disease, carbonic-anhydrase inhibitors such as acetazolamide or topiramate, ifosfamide, tenofovir, outdated tetracycline exposure, heavy metals, and hereditary disorders. Isolated proximal RTA is less common than generalized proximal dysfunction.",
      riskFactors: ["Fanconi syndrome", "Multiple myeloma or monoclonal gammopathy", "Acetazolamide, topiramate, ifosfamide, or tenofovir exposure", "Hereditary metabolic disease", "Heavy-metal exposure"],
      signsSymptoms: ["Weakness or cramps from hypokalemia", "Polyuria and volume depletion", "Bone pain, fractures, rickets or poor growth from phosphate loss when Fanconi syndrome is present", "Underlying drug or systemic-disease findings"],
      diagnostics: ["Confirm hyperchloremic normal-gap metabolic acidosis and evaluate urine pH in relation to serum bicarbonate.", "Look for glucosuria with normal serum glucose, phosphaturia, hypophosphatemia, uricosuria, aminoaciduria and low-molecular-weight proteinuria when Fanconi syndrome is suspected.", "Review medications, monoclonal proteins, toxins and inherited disease."],
      labs: ["Low bicarbonate", "Often low potassium", "Urine pH high while bicarbonate is being wasted but often below 5.5 after serum bicarbonate falls", "Possible hypophosphatemia, glucosuria and other Fanconi losses"],
      differentialDiagnoses: ["Distal RTA", "Diarrhea", "Type 4 RTA", "DKA with resolving gap", "Other Fanconi syndromes"],
      treatments: ["Stop or treat the cause when possible.", "Replace larger amounts of bicarbonate or citrate because much of the administered alkali may also be lost in urine.", "Replace potassium and phosphate when deficient; selected patients use a thiazide to create mild volume contraction and improve proximal bicarbonate reclamation under specialist monitoring."],
      complications: ["Hypokalemia", "Volume depletion", "Osteomalacia/rickets", "Growth failure", "CKD from the underlying disorder"],
      contraindications: ["Do not assume alkaline urine is required after serum bicarbonate has fallen.", "Do not use thiazide without monitoring volume, sodium and potassium.", "Do not treat bicarbonate alone while missing a toxic medication, myeloma or Fanconi syndrome."],
      nursingPriorities: ["Trend bicarbonate, potassium, phosphate, kidney function, urine losses, weight, blood pressure, growth and bone symptoms.", "Review every medication and exposure.", "Separate glucose-related glucosuria from proximal tubular glucosuria."],
      redFlags: ["Severe hypokalemia", "Symptomatic dehydration", "Fracture or severe phosphate depletion", "Rapid kidney decline", "Possible myeloma"],
      patientEducation: ["Larger alkali doses may be needed because the proximal tubule loses bicarbonate.", "Report weakness, palpitations, bone pain or inability to maintain intake."],
      nclexTraps: ["Type 2 proximal RTA can acidify urine after plasma bicarbonate reaches its lower steady state.", "Think Fanconi when multiple proximal solutes are lost."],
      relatedTopics: ["Distal renal tubular acidosis", "Type 4 renal tubular acidosis", "Fanconi syndrome", "Hypophosphatemia"],
      directTreatmentMedications: ["Sodium bicarbonate", "Hydrochlorothiazide"],
      medicationTreatmentNote: "Alkali, potassium/phosphate replacement, and selected thiazide therapy require specialist dosing and close electrolyte/volume monitoring.",
      sourceKeys: ["kidney-acid-control-2022", "ajkd-mixed-acid-base-2025"]
    }),
    clinicalCard({
      name: "Type 4 renal tubular acidosis",
      category: "Nephrology / Acid-Base Disorders / Renal Tubular Acidosis",
      aliases: ["type 4 RTA", "hyperkalemic RTA", "hypoaldosterone RTA", "hyporeninemic hypoaldosteronism"],
      abbreviations: ["RTA type 4"],
      definition: "Type 4 renal tubular acidosis is a hyperkalemic normal-anion-gap metabolic acidosis caused by deficient aldosterone action or resistance to it, often with reduced distal sodium delivery. Hyperkalemia suppresses renal ammonium production, so the kidney excretes less acid even though urine pH may be below 5.5.",
      pathology: "Aldosterone normally promotes distal sodium reabsorption while supporting potassium and hydrogen secretion. Low renin/aldosterone, receptor resistance, collecting-duct dysfunction, or reduced distal flow raises potassium. High potassium directly reduces proximal ammoniagenesis; less urinary ammonium means less net acid excretion and falling bicarbonate.",
      etiology: "Common causes include diabetic kidney disease with hyporeninemic hypoaldosteronism, adrenal insufficiency, CKD/interstitial disease, ACE inhibitors, ARBs, renin inhibitors, MR antagonists, ENaC blockers, trimethoprim, heparin, calcineurin inhibitors, NSAIDs, and urinary obstruction.",
      riskFactors: ["Diabetes with CKD", "Adrenal insufficiency", "Older age or interstitial kidney disease", "RAAS blockers, potassium-sparing diuretics, trimethoprim or NSAIDs", "High-potassium intake or supplements in impaired excretion"],
      signsSymptoms: ["Often asymptomatic mild acidosis", "Weakness, paresthesias or paralysis from hyperkalemia", "Palpitations, bradycardia or dysrhythmia", "Findings of adrenal insufficiency, CKD or the causative medicine"],
      diagnostics: ["Confirm hyperkalemia plus persistent hyperchloremic normal-gap metabolic acidosis and exclude pseudohyperkalemia and advanced kidney-failure acidosis.", "Review medications, glucose, kidney function, volume and obstruction.", "Measure renin, aldosterone and cortisol only when the clinical question requires it; no single urine index proves type 4 RTA."],
      labs: ["High potassium", "Mild to moderate low bicarbonate", "Normal anion gap with high chloride", "Urine pH may be below 5.5 because the main defect is low ammonium rather than inability to lower urine pH"],
      differentialDiagnoses: ["Pseudohyperkalemia", "Advanced CKD", "Adrenal crisis", "Medication-related hyperkalemia without persistent acidosis", "Cell lysis or insulin deficiency"],
      treatments: ["Stop or adjust causative potassium-raising drugs when clinically safe; never stop essential RAAS therapy without prescriber review.", "Treat dangerous hyperkalemia immediately using ECG-guided emergency therapy.", "Use dietary potassium review, diuretics, bicarbonate, potassium binders, or selected fludrocortisone according to volume, pressure, kidney, and adrenal physiology.", "Treat adrenal insufficiency or obstruction when present."],
      complications: ["Fatal dysrhythmia", "Muscle paralysis", "Progressive acidosis", "Loss of kidney-protective therapy if medications are stopped without a balanced plan"],
      contraindications: ["Do not assume every hyperkalemia is type 4 RTA.", "Do not give fludrocortisone casually in heart failure, edema or uncontrolled hypertension.", "Do not delay emergency calcium and potassium shifting/removal when ECG toxicity is present."],
      nursingPriorities: ["Verify a nonhemolyzed potassium, obtain ECG when indicated, trend bicarbonate and kidney function, and review every medicine and supplement.", "Monitor pressure, edema, urine output, glucose and response to potassium-lowering therapy.", "Teach sick-day and medication plans through the prescribing team."],
      redFlags: ["ECG change", "Rapidly rising potassium", "Weakness/paralysis", "Syncope", "Adrenal crisis", "Oliguria or pulmonary edema"],
      patientEducation: ["Avoid unreviewed potassium supplements and salt substitutes.", "Seek urgent care for severe weakness, palpitations or fainting."],
      nclexTraps: ["Type 4 RTA is the hyperkalemic RTA.", "Urine can still be acidic; reduced ammonium excretion drives the acidosis."],
      relatedTopics: ["Hyperkalemia", "Adrenal insufficiency", "Diabetic kidney disease", "RAAS blockade"],
      directTreatmentMedications: ["Sodium bicarbonate", "Fludrocortisone", "Furosemide", "Patiromer"],
      medicationTreatmentNote: "Treatment is individualized; emergency hyperkalemia therapy, chronic potassium management, and mineralocorticoid use are not interchangeable.",
      sourceKeys: ["kidney-acid-control-2022", "ajkd-mixed-acid-base-2025"]
    }),
    clinicalCard({
      name: "Postherpetic neuralgia",
      category: "Neurology / Neuropathic Pain / Varicella-Zoster Complications",
      aliases: ["post-herpetic neuralgia", "pain after shingles", "persistent shingles pain", "PHN"],
      abbreviations: ["PHN"],
      definition: "Postherpetic neuralgia is persistent neuropathic pain in the same dermatome after herpes-zoster rash has healed. Definitions use different time thresholds, commonly pain lasting at least 90 days from rash onset. Varicella-zoster inflammation injures sensory ganglia and peripheral/central pain pathways, producing spontaneous burning or electric pain and pain from normally harmless touch.",
      pathology: "Viral reactivation causes neuritis and axonal injury. Damaged afferents fire abnormally, inhibitory control is lost, and central neurons become sensitized. This explains allodynia, hyperalgesia, numbness beside pain, and why a healed skin surface does not mean the nerve has recovered.",
      etiology: "PHN follows shingles. Risk rises with older age, severe acute pain, extensive rash, ophthalmic involvement, immunocompromise, and delayed antiviral treatment, although prompt antiviral therapy does not prevent every case.",
      riskFactors: ["Older age", "Severe prodromal or acute zoster pain", "Severe or ophthalmic rash", "Immunocompromise", "Diabetes or frailty"],
      signsSymptoms: ["Burning, stabbing, electric or deep aching pain in a healed dermatome", "Allodynia from clothing or light touch", "Hyperalgesia, itching, numbness or altered temperature sensation", "Sleep, mood, mobility and appetite impairment"],
      diagnostics: ["Diagnosis is clinical from the prior dermatomal zoster history and persistent localized neuropathic pain.", "Examine skin, sensation, strength and function; evaluate new rash, weakness, eye/ear symptoms, or atypical distribution for recurrent/complicated zoster or another diagnosis."],
      labs: ["No routine laboratory test confirms PHN. PCR is for uncertain active zoster lesions, not healed neuralgia."],
      differentialDiagnoses: ["Radiculopathy", "Peripheral neuropathy", "Complex regional pain syndrome", "Recurrent zoster", "Entrapment neuropathy", "Cardiac or visceral pain depending on location"],
      treatments: ["Use individualized neuropathic-pain therapy such as gabapentin or pregabalin, selected antidepressants, topical lidocaine, or high-concentration capsaicin under appropriate supervision.", "Combine medication with sleep, mood, fall-risk and functional support; minimize sedative burden.", "Prevent shingles and reduce PHN risk with recommended zoster vaccination before disease occurs."],
      complications: ["Chronic pain and disability", "Insomnia, depression and social isolation", "Falls or medication toxicity", "Reduced nutrition and self-care"],
      contraindications: ["Do not prescribe an antiviral as the sole treatment for established PHN after active viral replication has ended.", "Do not apply topical agents to open lesions or use sedating combinations without fall, respiratory and kidney review.", "Do not interpret PHN pain itself as contagious; active uncovered zoster lesions create transmission risk."],
      nursingPriorities: ["Assess pain quality, dermatome, allodynia, skin integrity, sleep, mood, function, kidney function, falls and medication sedation.", "Protect painful skin from friction and use gentle clothing/linens.", "Escalate ophthalmic, otic, motor, disseminated or central nervous system findings rather than labeling them routine PHN."],
      redFlags: ["New eye pain or vision change", "Facial weakness or hearing symptoms", "New motor weakness", "Disseminated vesicles", "Severe depression or suicidal thinking", "Respiratory depression from treatment"],
      patientEducation: ["The rash can heal while injured nerves continue sending pain signals; the pain is real and often needs gradual multimodal treatment.", "Vaccination prevents future zoster better than pain medicine repairs established nerve injury."],
      nclexTraps: ["PHN is a complication after shingles, not a combined name for the acute rash.", "Allodynia means pain from a normally nonpainful stimulus."],
      relatedTopics: ["Shingles", "Allodynia", "Neuropathic pain", "Zoster vaccination"],
      directTreatmentMedications: ["Gabapentin", "Pregabalin", "Capsaicin"],
      medicationTreatmentNote: "Therapy is individualized for kidney function, age, falls, interactions, pain distribution, and local/product precautions.",
      sourceKeys: ["w34-cdc-shingles", "w34-ninds-neuro"]
    }),
    clinicalCard({
      name: "Stroke mimics",
      category: "Neurology / Emergency Stroke Differential",
      aliases: ["stroke mimic", "stroke look-alike", "conditions that mimic stroke", "pseudo-stroke presentation"],
      definition: "Stroke mimics are nonstroke disorders that produce sudden focal neurologic or stroke-like symptoms. Common examples include hypoglycemia, seizure with postictal weakness, migraine aura, functional neurologic disorder, intoxication, infection, metabolic disturbance, tumor, and peripheral facial palsy. The category exists to improve parallel evaluation—not to justify delaying a stroke pathway.",
      pathology: "Different mechanisms can transiently disrupt cortical function, perfusion, electrical activity, metabolism, or voluntary motor control and imitate vascular injury. Conversely, true stroke can cause seizure, headache, confusion, or normal early imaging, so one 'mimic feature' cannot safely rule it out.",
      etiology: "The differential depends on age, time course, positive versus negative symptoms, glucose, seizure history, headache evolution, medications, infection, trauma, and examination localization. Some patients have both a mimic and a stroke risk or stroke itself.",
      riskFactors: ["Diabetes treated with glucose-lowering drugs", "Epilepsy", "Migraine with aura", "Toxic/metabolic illness", "Functional neurologic disorder", "Brain tumor or infection"],
      signsSymptoms: ["Focal weakness, numbness, speech or visual change", "Postictal confusion or witnessed seizure", "Gradually spreading positive visual/sensory aura", "Inconsistent examination or symptoms incongruent with neuroanatomy", "Global metabolic or toxic findings"],
      diagnostics: ["Activate stroke evaluation and check bedside glucose immediately.", "Establish onset/last-known-well, baseline, medications, seizure and migraine history, and a focused neurologic examination.", "Use noncontrast CT, CTA, MRI, EEG, labs, toxicology, infection testing, or other studies according to the competing diagnoses without assuming early normal imaging excludes stroke."],
      labs: ["Glucose is the immediate reversible check; electrolytes, CBC, kidney/liver tests, blood gas, toxicology and infection tests are selected by presentation."],
      differentialDiagnoses: ["Acute ischemic stroke", "Intracerebral hemorrhage", "Hypoglycemia", "Todd paralysis", "Migraine aura", "Bell palsy", "Functional neurologic disorder"],
      treatments: ["Treat the reversible mimic immediately while continuing stroke assessment when doubt remains.", "Correct hypoglycemia, control seizure, treat infection/metabolic disturbance, or provide migraine/functional-neurologic care according to diagnosis.", "Use reperfusion therapy only through the current stroke protocol after risk-benefit evaluation; diagnostic uncertainty is handled by the stroke team, not by dismissing symptoms."],
      complications: ["Missed stroke and lost reperfusion opportunity", "Unnecessary treatment exposure", "Recurrent seizure or hypoglycemia", "Delayed diagnosis of infection, tumor or toxic disorder"],
      contraindications: ["Do not label a patient a mimic because they are young, have psychiatric history, or have a normal early CT.", "Do not stop evaluation simply because glucose was abnormal if deficits persist after correction.", "Do not force a functional diagnosis without positive examination evidence and appropriate exclusion of emergency disease."],
      nursingPriorities: ["Record last-known-well, glucose before/after treatment, neurologic changes, seizure details, headache evolution, medications and collateral history.", "Maintain airway, aspiration, seizure and fall precautions.", "Escalate persistent or worsening deficit despite correction of a suspected mimic."],
      redFlags: ["Persistent focal deficit", "Large-vessel syndrome", "Declining consciousness", "Seizure without recovery", "Meningismus/fever", "Severe sudden headache", "Hypoglycemia not responding"],
      patientEducation: ["A mimic diagnosis does not mean symptoms were imagined; it means another mechanism produced a stroke-like emergency.", "Future sudden focal deficits still require emergency evaluation."],
      nclexTraps: ["Check glucose, but do not let one abnormal number erase a possible stroke.", "Todd paralysis can follow seizure and resolve, but first seizure or persistent deficit still needs imaging and cause evaluation."],
      relatedTopics: ["Bedside capillary glucose testing", "BE-FAST stroke screen", "Acute ischemic stroke", "Todd paralysis", "Migraine aura"],
      sourceKeys: ["aha-asa-ais-2026", "ninds-stroke-assess"]
    })
  ];

  function upsert(collection, card) {
    const key = normalize(card.name);
    const prior = collection.filter((entry) => normalize(entry && (entry.name || entry.title || entry.generic || entry.displayName)) === key);
    const next = collection.filter((entry) => normalize(entry && (entry.name || entry.title || entry.generic || entry.displayName)) !== key);
    next.push({ ...card });
    return { next, priorMatchCount: prior.length };
  }

  const sourceRegistration = Object.freeze({
    diagnostic: registerSourceKeys(diagnosticDatabase, diagnosticCards.flatMap((card) => card.sourceKeys || [])),
    foundation: registerSourceKeys(foundationDatabase, foundationCards.flatMap((card) => card.sourceKeys || [])),
    pathology: registerSourceKeys(pathologyDatabase, pathologyCards.flatMap((card) => card.sourceKeys || []))
  });

  const application = [];
  diagnosticCards.forEach((card) => {
    const result = upsert(diagnosticDatabase.entries, card);
    diagnosticDatabase.entries = result.next;
    application.push({ name: card.name, collection: "diagnostic", priorMatchCount: result.priorMatchCount });
  });
  foundationCards.forEach((card) => {
    const result = upsert(foundationDatabase.entries, card);
    foundationDatabase.entries = result.next;
    application.push({ name: card.name, collection: "foundation", priorMatchCount: result.priorMatchCount });
  });
  pathologyCards.forEach((card) => {
    const result = upsert(pathologyDatabase.diseases, card);
    pathologyDatabase.diseases = result.next;
    application.push({ name: card.name, collection: "pathology", priorMatchCount: result.priorMatchCount });
  });

  diagnosticDatabase.entries.sort((a, b) => String(a && (a.name || a.title) || "").localeCompare(String(b && (b.name || b.title) || "")));
  foundationDatabase.entries.sort((a, b) => String(a && (a.name || a.title) || "").localeCompare(String(b && (b.name || b.title) || "")));
  pathologyDatabase.diseases.sort((a, b) => String(a && (a.name || a.title) || "").localeCompare(String(b && (b.name || b.title) || "")));
  pathologyDatabase.diseaseCount = pathologyDatabase.diseases.length;

  window[GLOBAL_NAME] = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    generatedAt: GENERATED_AT,
    applied: true,
    cardCount: diagnosticCards.length + foundationCards.length + pathologyCards.length,
    diagnosticCardNames: Object.freeze(diagnosticCards.map((card) => card.name)),
    foundationCardNames: Object.freeze(foundationCards.map((card) => card.name)),
    pathologyCardNames: Object.freeze(pathologyCards.map((card) => card.name)),
    application: Object.freeze(application.map((item) => Object.freeze({ ...item }))),
    sourceRegistration,
    medicationSafetyPolicy: "explicit-only; no inferred treatment medications",
    componentParityParents: Object.freeze([
      "ABG versus VBG and serum total carbon dioxide",
      "Acute stroke imaging: noncontrast CT, CTA, CTP, DWI, and ADC",
      "AKI urine sediment, FeNa, FeUrea, and limitations",
      "BE-FAST, last-known-well, and wake-up stroke",
      "Catheter-associated UTI",
      "Central line-associated bloodstream infection",
      "Child abuse and neglect",
      "Cleft lip and cleft palate",
      "HIV-associated dysglycemia",
      "HIV/AIDS",
      "Lipodystrophy-associated diabetes mellitus",
      "Poisoning and overdose",
      "Renal tubular acidosis types 1, 2, and 4",
      "Shingles/postherpetic neuralgia",
      "Stroke mimics and bedside glucose",
      "Ventilator-associated pneumonia",
      "BNP/NT-proBNP",
      "H. pylori breath/stool tests",
      "Insulin/C-peptide levels",
      "Troponin I/T",
      "Capnography and end-tidal carbon dioxide monitoring",
      "Gentamicin peak/trough",
      "ScvO2 / SvO2",
      "CBD and cannabis products"
    ])
  });
}());
