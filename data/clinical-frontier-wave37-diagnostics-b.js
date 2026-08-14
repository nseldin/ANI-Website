/* eslint-disable */
/* Wave 37 diagnostics cohort B: mechanism-first laboratory, imaging, and deterioration-recognition references. */
(function () {
  "use strict";

  const VERSION = "2026-08-13-wave37-diagnostics-b-6";
  const GLOBAL_NAME = "ANI_FOUNDATIONS_WAVE37_DIAGNOSTICS_B";
  if (window[GLOBAL_NAME] && window[GLOBAL_NAME].version === VERSION) return;
  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const unique = (values) => Array.from(new Set((values || []).filter(Boolean)));

  const localSourceReferences = Object.freeze([
    {
      key: "w37-aha-hf-2022",
      label: "AHA/ACC/HFSA: 2022 Guideline for the Management of Heart Failure",
      url: "https://professional.heart.org/-/media/832EA0F4E73948848612F228F7FA2D35.pdf",
      note: "Supports using BNP or NT-proBNP to support diagnosis or exclusion of heart failure in dyspnea, risk stratification and prognosis, and the broad cardiac and noncardiac differential for an elevated result."
    },
    {
      key: "w37-fda-entresto-2024",
      label: "US Food and Drug Administration: Entresto prescribing information",
      url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/207620s025%2C218591s000lbl.pdf",
      note: "Supports the neprilysin-inhibitor context and the distinction between BNP biology and NT-proBNP response during sacubitril/valsartan treatment."
    },
    {
      key: "w37-ncbi-natriuretic-peptides",
      label: "NCBI Bookshelf: Chronic Heart Failure in Adults - Diagnosing heart failure",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK536086/",
      note: "Supports clinical-context interpretation, the absence of a single diagnostic test for heart failure, lower peptide concentrations with obesity or treatment, and higher concentrations from renal, pulmonary, rhythm, ischemic, and critical-illness causes."
    },
    {
      key: "w37-ada-diabetes-2026",
      label: "American Diabetes Association: Standards of Care in Diabetes - 2026, Diagnosis and Classification",
      url: "https://diabetesjournals.org/care/article/49/Supplement_1/S27/163926/2-Diagnosis-and-Classification-of-Diabetes",
      note: "Supports current nonpregnant FPG criteria, confirmation rules, fasting definition, biological and preanalytic variability, prompt specimen processing, and limits of glucose, A1C, and OGTT concordance."
    },
    {
      key: "w37-niddk-diabetes-testing",
      label: "National Institute of Diabetes and Digestive and Kidney Diseases: Diabetes and Prediabetes Tests",
      url: "https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/diabetes/diabetes-prediabetes",
      note: "Supports laboratory venous-plasma testing after an 8-hour fast, diagnostic ranges, confirmation, specimen-processing needs, and why home-meter results are not diagnostic laboratory results."
    },
    {
      key: "w37-cdc-diabetes-testing",
      label: "Centers for Disease Control and Prevention: Diabetes Testing",
      url: "https://www.cdc.gov/diabetes/diabetes-testing/index.html",
      note: "Supports plain-language fasting glucose interpretation and the distinction among normal, prediabetes, and diabetes ranges."
    },
    {
      key: "w37-scmr-protocols-2020",
      label: "Society for Cardiovascular Magnetic Resonance: Standardized CMR Protocols, 2020 Update",
      url: "https://jcmr-online.biomedcentral.com/articles/10.1186/s12968-020-00607-1",
      note: "Supports cine imaging, ventricular assessment, perfusion, flow imaging, late gadolinium enhancement, mapping, disease-specific protocol selection, and device-aware imaging."
    },
    {
      key: "w37-scmr-indications-2020",
      label: "Society for Cardiovascular Magnetic Resonance: 2020 Position Paper on Clinical Indications for CMR",
      url: "https://events.scmr.org/wp-content/uploads/2024/08/Indications.pdf",
      note: "Supports established clinical uses of CMR across ischemic disease, cardiomyopathy, myocarditis, congenital and vascular disease, masses, valves, pericardium, and tissue characterization."
    },
    {
      key: "w37-acr-mr-safety-2024",
      label: "American College of Radiology: Manual on MR Safety 2024",
      url: "https://www.acr.org/-/media/ACR/Files/Radiology-Safety/MR-Safety/Manual-on-MR-Safety.pdf",
      note: "Supports formal screening, final safety checks, implant and device verification, projectile and heating prevention, monitoring, and special-population precautions in the MR environment."
    },
    {
      key: "w37-acr-contrast-2025",
      label: "American College of Radiology: Manual on Contrast Media",
      url: "https://cs.acr.org/-/media/ACR/Files/Clinical-Resources/Contrast_Media.pdf",
      note: "Supports agent- and kidney-risk-based gadolinium decisions, nephrogenic systemic fibrosis precautions, reaction management, pregnancy and breastfeeding considerations, and use of current local policy."
    },
    {
      key: "w37-fda-gadolinium",
      label: "US Food and Drug Administration: Gadolinium retention safety communication",
      url: "https://www.fda.gov/media/109825/download",
      note: "Supports disclosure that gadolinium can remain in the body, greater retention with linear than macrocyclic agents, individualized minimization of unnecessary repeat doses, and not deferring a necessary enhanced study solely because retention can occur."
    },
    {
      key: "w37-nhlbi-heart-tests",
      label: "National Heart, Lung, and Blood Institute: Heart Tests",
      url: "https://www.nhlbi.nih.gov/health/heart-tests",
      note: "Supports patient-facing CMR preparation, the absence of ionizing radiation, and rest or stress cardiac MRI use."
    },
    {
      key: "w37-nhs-england-pews",
      label: "NHS England: National Paediatric Early Warning System",
      url: "https://www.england.nhs.uk/get-involved/cyp/pews/",
      note: "Supports PEWS as a standardized recognition-and-response system for hospitalized children rather than merely a number."
    },
    {
      key: "w37-rcpch-pews",
      label: "Royal College of Paediatrics and Child Health: UK Paediatric Early Warning Systems",
      url: "https://www.rcpch.ac.uk/resources/UK-paediatric-early-warning-systems",
      note: "Supports the track-and-trigger model, age-aware observations, escalation response, clinical-intuition and parent/carer concern triggers, scope limits, and the principle that a low numerical score cannot veto concern."
    },
    {
      key: "w37-pews-systematic-review",
      label: "BMJ Open: Validity and effectiveness of paediatric early warning systems and track-and-trigger tools",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6502038/",
      note: "Supports the heterogeneity of PEWS tools, variable validation, low positive predictive value and alarm-fatigue risk, and the limited generalizability of a score outside the setting in which it was tested."
    },
    {
      key: "w37-pews-epoch",
      label: "JAMA: EPOCH Cluster Randomized Trial of BedsidePEWS",
      url: "https://jamanetwork.com/journals/jama/fullarticle/2673504",
      note: "Supports a balanced evidence interpretation: implementing one BedsidePEWS program across 21 hospitals did not reduce all-cause hospital mortality, so a score must be embedded in reliable assessment and response rather than treated as a proven stand-alone rescue intervention."
    }
  ]);

  const foundationDatabase = window.ANI_FOUNDATIONS_DATABASE && typeof window.ANI_FOUNDATIONS_DATABASE === "object"
    ? window.ANI_FOUNDATIONS_DATABASE
    : { entries: [], sourceReferences: [] };
  if (!Array.isArray(foundationDatabase.entries)) foundationDatabase.entries = [];
  if (!Array.isArray(foundationDatabase.sourceReferences)) foundationDatabase.sourceReferences = [];

  const sourceIndex = new Map(foundationDatabase.sourceReferences
    .filter((reference) => reference && reference.key)
    .map((reference, index) => [String(reference.key), index]));
  localSourceReferences.forEach((reference) => {
    const existingIndex = sourceIndex.get(reference.key);
    if (Number.isInteger(existingIndex)) foundationDatabase.sourceReferences[existingIndex] = { ...reference };
    else {
      sourceIndex.set(reference.key, foundationDatabase.sourceReferences.length);
      foundationDatabase.sourceReferences.push({ ...reference });
    }
  });
  const sourceByKey = new Map(foundationDatabase.sourceReferences.map((reference) => [String(reference.key), reference]));
  const sourceNoteFor = (keys) => unique(keys).map((key) => {
    const source = sourceByKey.get(key);
    if (!source) throw new Error("Unknown Wave37 diagnostics source key: " + key);
    return source.label + " (" + source.url + ")";
  }).join("; ");

  const article = (spec) => {
    const sourceKeys = unique(spec.sourceKeys || []);
    return {
      icon: spec.icon || "Clinical",
      nclexEssential: true,
      educationalArticle: true,
      ...spec,
      aliases: unique(spec.aliases || []),
      abbreviations: unique(spec.abbreviations || []),
      commonMisspellings: unique(spec.commonMisspellings || []),
      relatedTopics: unique(spec.relatedTopics || []),
      tags: unique(["wave37", "offline clinical reference", "clinical reasoning", ...(spec.tags || [])]),
      sourceKeys,
      sourceNote: sourceNoteFor(sourceKeys),
      evidenceNote: "Evidence anchors: " + sourceNoteFor(sourceKeys),
      wave37DiagnosticsCohort: "B",
      wave37DiagnosticsRevision: VERSION
    };
  };

  const entries = [
    article({
      name: "BNP/NT-proBNP",
      fullForm: "B-type natriuretic peptide and N-terminal pro-B-type natriuretic peptide",
      displayName: "BNP/NT-proBNP",
      type: "laboratory-test",
      diagnosticKind: "lab",
      icon: "BNP",
      category: "Diagnostics and Tests / Cardiovascular Biomarkers / Natriuretic Peptides",
      aliases: [
        "BNP test", "NT-proBNP test", "natriuretic peptide test", "B-type natriuretic peptide", "brain natriuretic peptide", "N-terminal pro-B-type natriuretic peptide", "N-terminal prohormone BNP", "proBNP", "heart failure blood test", "blood test for heart failure", "lab for shortness of breath and heart failure", "which BNP rules out heart failure", "why BNP is high", "why is BNP high", "BNP high", "high BNP", "elevated BNP interpretation", "why NT-proBNP is high", "NT-proBNP high", "high NT-proBNP", "BNP versus NT-proBNP", "BNP and kidney disease", "BNP in obesity", "BNP after Entresto", "NT-proBNP after sacubitril valsartan", "ventricular stretch biomarker", "natriuretic peptide level"
      ],
      abbreviations: ["BNP", "NT-proBNP", "NT proBNP", "NT-pro-BNP", "NP", "proBNP", "HF biomarker", "ARNI"],
      commonMisspellings: ["bnp pro bnp", "ntprobnp", "nt pro bnp", "nt-pro bnp", "pro bnp", "natruiretic peptide", "natriurectic peptide", "natruretic peptide", "brain naturietic peptide", "b type natriurectic peptide"],
      summary: "BNP and NT-proBNP are related but different blood biomarkers produced when cardiac muscle increases synthesis of the prohormone proBNP, commonly in response to ventricular wall stretch (myocardial wall stress) from pressure or volume load. Cleavage yields biologically active BNP and the inactive N-terminal fragment NT-proBNP. BNP participates in a compensatory system that favors natriuresis, vasodilation, and opposition to renin-angiotensin-aldosterone and sympathetic signaling; the laboratory value is therefore a distress signal and counter-regulatory response, not the substance that causes congestion. In a patient with dyspnea, either marker can make heart failure more or less likely and can provide prognostic information, but neither diagnoses heart failure by itself. Age, kidney function, rhythm, body size, right-heart stress, valve disease, sepsis, treatment, assay, timing, and the rest of the clinical picture can move the result. The safe interpretation connects the exact assay and trend to symptoms, examination, ECG, imaging, renal function, medications, and competing diagnoses.",
      quickAnswer: "BNP/NT-proBNP answers, 'Is cardiac wall stress contributing to this presentation, and how much risk might that stress signal?' A low result obtained with an appropriate acute-dyspnea pathway can argue against heart failure, whereas a high result supports cardiac stress but does not identify its cause or prove that congestion is present. Heart failure, atrial fibrillation, kidney dysfunction, older age, pulmonary hypertension or embolism, acute coronary disease, valve disease, myocarditis, and critical illness can raise concentrations. Obesity can suppress them, so a reassuring-looking value does not overrule convincing heart-failure physiology. BNP and NT-proBNP have different assays and clearance behavior and their numbers are not interchangeable. Sacubitril inhibits neprilysin, which participates in BNP degradation; BNP may therefore be harder to trend soon after an ARNI is started, while NT-proBNP is not a neprilysin substrate and more directly reflects changing wall stress. Treat respiratory distress and poor perfusion, not an isolated peptide number.",
      resultMeanings: [
        ["Low in an acute-dyspnea pathway", "Heart failure becomes less likely when the correct assay-specific rule-out threshold, timing, and population are used, but obesity, very early presentation, treated disease, and unusual physiology can produce a falsely reassuring result."],
        ["Intermediate or gray-zone result", "The biomarker has not resolved the question. Integrate volume assessment, ECG, chest imaging, echocardiography, kidney function, rhythm, hemoglobin, infection and pulmonary causes rather than forcing a binary diagnosis."],
        ["High or rising", "Myocardial wall stress and adverse-risk probability are greater, but the cause may be left- or right-sided heart failure, renal dysfunction, atrial fibrillation, acute coronary disease, valve or myocardial disease, pulmonary vascular stress, sepsis, or another critical illness."],
        ["Falling during treatment", "A decline often accompanies less wall stress and improving prognosis, but it does not prove euvolemia or justify stopping assessment. Symptoms, perfusion, weight, urine output, renal function, electrolytes, imaging, and medication effects still determine care."],
        ["Discordant with the patient", "Verify the exact marker, units, assay, sample, timing, prior baseline, kidney function, body size, rhythm, and ARNI exposure. Repeat or pursue imaging when the result does not fit rather than treating the laboratory value as infallible."]
      ],
      sections: [
        { label: "What the laboratory measures", text: "Cardiomyocytes synthesize pre-proBNP and then proBNP when gene expression increases. ProBNP is cleaved into BNP, an active peptide, and NT-proBNP, an inactive fragment released into the circulation. Commercial BNP and NT-proBNP immunoassays recognize different molecular targets, may cross-react with precursor or modified forms to different degrees, and have different calibration and reference limits. A result labeled BNP cannot be numerically compared with a result labeled NT-proBNP as though they were the same test. Even when both are reported in pg/mL, the values occupy different numerical ranges because their clearance and persistence differ. Document the full analyte name, units, laboratory, and collection time before calling a change real." },
        { label: "Why wall stress raises the peptides", text: "Increased end-diastolic volume or pressure stretches myocardial fibers and activates proBNP synthesis. Ischemia, inflammation, neurohormonal signaling, hypertrophy, and right- or left-sided pressure load can add to that signal. Active BNP binds natriuretic-peptide receptors linked to cyclic GMP. The resulting physiology favors sodium excretion, diuresis, vasodilation, lower sympathetic tone, and less renin-angiotensin-aldosterone activity. These effects try to reduce preload, afterload, and remodeling, although the endogenous response is often insufficient in established heart failure. This explains the apparent paradox: a high BNP accompanies worse disease even though BNP itself is compensatory. The number reflects the heart's response to stress, not a toxin that should be removed." },
        { label: "Clinical uses and the question the test can answer", text: "AHA/ACC/HFSA guidance supports measuring BNP or NT-proBNP in patients presenting with dyspnea to help support or exclude heart failure. The marker is most useful when history and examination leave genuine uncertainty because a low result can redirect attention toward pulmonary, infectious, hematologic, metabolic, or other causes. In established chronic heart failure, concentrations provide risk and prognostic information; admission and selected predischarge values can help describe trajectory. They are also used in selected screening or surveillance pathways. None of these uses makes the peptide a stand-alone measure of ejection fraction, filling pressure, total body fluid, or treatment success. Echocardiography and cause-directed assessment answer structural and hemodynamic questions the peptide cannot." },
        { label: "Thresholds: why one memorized cutoff is unsafe", text: "Decision limits depend on whether the setting is acute or nonacute, which marker and assay is used, patient age, renal function, and the specific guideline or laboratory pathway. Common acute-care algorithms use a low rule-out threshold and a separate, often age-stratified rule-in region for NT-proBNP; outpatient referral pathways use different limits. Values between those regions form a gray zone rather than a hidden diagnosis. Because predictive value also depends on how likely heart failure was before testing, the same concentration means something different in an older patient with orthopnea and edema than in a young patient with isolated wheeze. Use the current local assay-specific pathway; do not transfer a BNP cutoff to NT-proBNP, an adult threshold to a child, or an acute threshold to a stable clinic visit." },
        { label: "Why high does not automatically mean left-sided heart failure", text: "The AHA/ACC/HFSA differential includes left- and right-sided heart failure, acute coronary syndromes, ventricular hypertrophy and other muscle disease, valve and pericardial disease, atrial fibrillation, myocarditis, cardiac surgery or cardioversion, and toxic-metabolic myocardial injury. Noncardiac associations include advancing age, anemia, renal failure, obstructive sleep apnea, severe pneumonia, pulmonary embolism, pulmonary arterial hypertension, critical illness, sepsis, and severe burns. Several mechanisms converge: impaired clearance, tachycardia and atrial stretch, hypoxemia, inflammatory myocardial stress, or right-ventricular pressure load. The result says that cardiac stress signaling is present; it does not localize the chamber, reveal the trigger, or prove that loop diuresis is the correct next action." },
        { label: "Why low can be falsely reassuring", text: "Obesity is associated with lower BNP and NT-proBNP concentrations for a given degree of heart failure, through mechanisms that may include altered peptide processing, clearance, secretion, and the hemodynamic phenotype of obesity. Effective diuresis and other heart-failure treatment may lower the marker before all clinical risk resolves. A very early sample may precede a full biomarker response, and some presentations with preserved ejection fraction or abrupt pressure change can produce less elevation than expected. A low value should therefore reduce probability, not erase high-risk findings such as pulmonary edema, hypoxemia, elevated jugular venous pressure, a new S3, shock, or a strongly abnormal echocardiogram. When the number and physiology disagree, reassess the patient and the test context." },
        { label: "Kidney function, age, rhythm, and serial trends", text: "NT-proBNP depends substantially on renal clearance, and both markers rise more often with reduced kidney function and advancing age. Atrial fibrillation adds atrial and ventricular stress and can increase concentrations independent of overt volume overload. These factors reduce specificity but do not make the result meaningless: a very high or rising value can still identify risk, and an individual baseline plus clinical trajectory may be more useful than a population cutoff. Compare like with like - same marker and preferably the same assay - and ask whether kidney function, rhythm, blood pressure, treatment, or acute illness changed between samples. Biological and analytical variation means a small isolated change may not represent a meaningful physiologic turn." },
        { label: "Sacubitril/valsartan and neprilysin", text: "Sacubitril's active metabolite inhibits neprilysin, an enzyme that degrades several vasoactive peptides including BNP. BNP can therefore rise or behave unpredictably after an angiotensin-receptor neprilysin inhibitor is started even while wall stress and outcomes improve. NT-proBNP is released from the same precursor but is not biologically active and is not a neprilysin substrate; a fall in NT-proBNP more directly reflects reduced production as wall stress improves. This does not mean every BNP on therapy is uninterpretable or that NT-proBNP is a treatment target by itself. Record the start and titration dates, use the same marker when trending when possible, and interpret symptoms, pressure, renal function, potassium, weight, perfusion, and imaging alongside it." },
        { label: "Specimen, assay, and interference checks", text: "Follow the collecting laboratory's serum or plasma tube, handling, and stability instructions because assays are platform specific. Check whether results from another hospital were produced by the same method before declaring a trend. Very high-dose biotin and heterophile or anti-reagent antibodies can interfere with some immunoassays; the direction and susceptibility depend on the platform, so contact the laboratory when the result is implausible. Units matter: pg/mL and ng/L are numerically equivalent, but pmol/L is not. A sample error cannot be fixed by clinical storytelling. Conversely, a technically valid measurement may still be nonspecific because a precise assay can accurately measure peptide elevation caused by something other than heart failure." },
        { label: "Nursing assessment and action", text: "At collection, record the symptom context, oxygen and respiratory status, blood pressure, heart rate and rhythm, weight, edema, jugular venous pressure when assessed, lung findings, urine output, kidney function, and relevant therapy. Escalate acute dyspnea, new hypoxemia, pulmonary edema, chest pain, syncope, hypotension, cool or altered perfusion, or a dangerous dysrhythmia without waiting for BNP. When the result returns, reconcile it with the patient rather than reporting only 'high.' A useful handoff states which marker was measured, the value and units, comparison value, renal and rhythm context, ARNI exposure, clinical congestion or alternative cause, interventions, and response. Do not administer or withhold diuretic solely because the peptide crossed a threshold." },
        { label: "Clinical traps and connected topics", text: "BNP does not equal blood volume, and a high value does not distinguish heart failure with reduced from preserved ejection fraction. NT-proBNP is not simply a 'more accurate BNP'; it is a different fragment with different kinetics and validated pathways. Normal ejection fraction does not exclude heart failure, and a high peptide does not prove low ejection fraction. Connect this card to acute and chronic heart failure, echocardiography, pulmonary edema, atrial fibrillation, chronic kidney disease, pulmonary embolism, pulmonary hypertension, sepsis, acute coronary syndrome, myocarditis, valve disease, sacubitril/valsartan, daily weights, cardiorenal syndrome, and hemodynamic assessment." }
      ],
      relatedTopics: ["Heart failure", "Acute decompensated heart failure", "Echocardiogram", "Pulmonary edema", "Atrial fibrillation", "Chronic kidney disease", "Pulmonary embolism", "Pulmonary hypertension", "Sepsis", "Myocarditis", "Sacubitril/valsartan", "Cardiorenal syndrome"],
      tags: ["BNP", "NT-proBNP", "natriuretic peptide", "laboratory test", "cardiac biomarker", "wall stress", "heart failure", "dyspnea", "renal function", "obesity", "atrial fibrillation", "neprilysin", "Entresto", "clinical interpretation"],
      sourceKeys: ["w37-aha-hf-2022", "w37-fda-entresto-2024", "w37-ncbi-natriuretic-peptides"]
    }),

    article({
      name: "Fasting glucose",
      fullForm: "Fasting plasma glucose",
      displayName: "Fasting glucose",
      type: "laboratory-test",
      diagnosticKind: "lab",
      icon: "FPG",
      category: "Diagnostics and Tests / Endocrine Laboratory Tests / Glucose",
      fastingGlucoseClinicalSignificanceRevision: "2026-08-13-fasting-glucose-clinical-significance-1",
      aliases: [
        "fasting plasma glucose", "fasting blood glucose", "fasting blood sugar", "fasting sugar", "morning fasting glucose", "eight hour fasting glucose", "8 hour fasting glucose", "blood sugar after not eating", "diabetes fasting blood test", "prediabetes fasting test", "what does fasting glucose mean", "how long to fast for glucose test", "normal fasting glucose", "high fasting glucose", "low fasting glucose", "fasting glucose 126", "fasting glucose 100 to 125", "venous plasma glucose", "diabetes screening glucose"
      ],
      abbreviations: ["FPG", "FBG", "FBS", "fasting BG", "fasting PG", "IFG"],
      commonMisspellings: ["fasting glucsoe", "fasting glocose", "fasting gulcose", "fastin glucose", "fasting blood suger", "fasting plasma glocose", "fast glucose test", "fasted glucose"],
      summary: "Fasting plasma glucose is a laboratory measurement of venous plasma glucose after at least 8 hours without caloric intake. It captures one moment in glucose regulation, especially the balance between overnight hepatic glucose output and the ability of basal insulin to restrain that output and move glucose into tissues. In nonpregnant people, current ADA criteria classify an FPG of 99 mg/dL or lower as below the impaired-fasting range, 100-125 mg/dL as impaired fasting glucose or prediabetes, and 126 mg/dL or higher as meeting a diabetes threshold. Unless hyperglycemia is unequivocal, diagnosis requires confirmation with a second abnormal result. The test is simple and inexpensive but biologically variable and preanalytically fragile: recent illness, stress, activity, medicines, an inaccurate fast, and continued glycolysis in an unseparated tube can change the result. A venous laboratory FPG is not interchangeable with a home meter, continuous glucose monitor, random glucose, A1C, or oral glucose-tolerance result.",
      quickAnswer: "Fasting plasma glucose shows how well glucose is regulated after an overnight fast. A high result suggests impaired fasting regulation and can support prediabetes or diabetes classification at the applicable threshold; a low result raises concern for hypoglycemia in the right symptom, medication, and specimen context. For a diagnostic FPG, the person has no caloric intake for at least 8 hours; plain water is generally allowed unless other ordered tests require different preparation. In a nonpregnant person, <=99 mg/dL is below the prediabetes range, 100-125 mg/dL is impaired fasting glucose, and >=126 mg/dL meets a diabetes threshold. A threshold result in an asymptomatic person is not normally a one-draw label: repeat FPG or another accepted diagnostic test should confirm it promptly. Pregnancy uses different testing pathways and cutoffs. A finger-stick meter is excellent for immediate care but is not the laboratory method used to establish the diagnosis. Do not delay treatment of symptomatic hypoglycemia, diabetic ketoacidosis, hyperosmolar crisis, or severe symptomatic hyperglycemia to obtain a 'proper fasting' sample.",
      resultMeanings: [
        ["<=99 mg/dL (<=5.5 mmol/L), nonpregnant", "Below the ADA impaired-fasting-glucose range at that draw. It does not guarantee normal post-meal glucose or eliminate future diabetes risk."],
        ["100-125 mg/dL (5.6-6.9 mmol/L), nonpregnant", "Impaired fasting glucose, one definition of prediabetes. Risk is continuous; assess cardiometabolic risk and confirm or follow according to the clinical plan."],
        [">=126 mg/dL (>=7.0 mmol/L), nonpregnant", "Meets a laboratory threshold for diabetes. In the absence of unequivocal hyperglycemia or crisis, obtain a second abnormal accepted test to confirm diagnosis."],
        ["Low fasting glucose", "Interpret against symptoms, diabetes medicines, fasting duration, alcohol, nutrition, liver and kidney function, endocrine disease, and specimen handling. Symptomatic or severe hypoglycemia requires immediate treatment."],
        ["Discordant FPG and A1C or OGTT", "The tests measure different time windows and physiology, and each has specific interferences. Repeat the abnormal test or use a complementary accepted test rather than averaging incompatible results."]
      ],
      sections: [
        { label: "Definition and correct fasting condition", text: "Fasting means no caloric intake for at least 8 hours. Water generally does not break the fast, but coffee, sweetened or caloric drinks, gum or candy containing calories, food, and overnight tube feeding do. The ordered laboratory may have additional requirements because a lipid panel, procedure, or medication plan may be paired with the glucose test. A morning sample reduces practical variability and matches common validation conditions. Do not tell a patient to stop prescribed medicines, particularly insulin or a sulfonylurea, unless the ordering clinician has provided a safe plan. Document the last caloric intake, time of collection, acute illness, and relevant medicines when interpretation depends on a true fast." },
        { label: "Physiology: what fasting glucose tests", text: "During an overnight fast, falling nutrient absorption lowers insulin secretion while glucagon and other counter-regulatory signals permit hepatic glycogen breakdown and gluconeogenesis. Basal insulin still restrains liver output and supports peripheral glucose uptake. A high FPG therefore often reflects hepatic insulin resistance, inadequate insulin secretion, or both. In early type 2 diabetes, the liver may continue releasing glucose even though the circulation already contains enough. In type 1 diabetes or advanced beta-cell failure, absolute or marked relative insulin deficiency adds unchecked lipolysis and ketogenesis risk. The number is a snapshot of this balance; it does not directly measure insulin level, beta-cell reserve, or diabetes type." },
        { label: "Current nonpregnant diagnostic interpretation", text: "The ADA 2026 criteria use FPG >=126 mg/dL (>=7.0 mmol/L) as one way to diagnose diabetes and define fasting as no calories for at least 8 hours. FPG 100-125 mg/dL (5.6-6.9 mmol/L) is impaired fasting glucose, within the prediabetes range. Values 99 mg/dL or below are below that range. These are diagnostic categories, not sharp biological walls: long-term metabolic risk increases continuously across and below them. A person at 124 and a person at 126 do not suddenly have wholly different physiology, which is one reason confirmation, repeat measurement, and the total risk picture matter." },
        { label: "Why confirmation is required", text: "Day-to-day glucose varies with sleep, stress hormones, activity, illness, timing, and laboratory factors. In an asymptomatic person without unequivocal hyperglycemia, the ADA requires two abnormal accepted test results. They may be two measurements of the same test on different samples or two different tests collected together or at separate times. If two different tests disagree, repeat the test above its diagnostic threshold and investigate reasons for discordance. Confirmation protects against labeling a lifelong disease from analytical or biological noise. It should be timely, but emergency physiology is different: classic hyperglycemic symptoms with a qualifying random plasma glucose or a hyperglycemic crisis can establish the diagnosis without waiting for a second fasting morning." },
        { label: "FPG versus A1C, OGTT, random glucose, meter, and CGM", text: "FPG measures glucose at one fasting moment. A1C reflects a weighted average of glycemic exposure over roughly the previous 2-3 months and is affected by red-cell lifespan and hemoglobin conditions. A 2-hour oral glucose tolerance test challenges the system and can reveal impaired post-load handling missed by FPG. Random plasma glucose is interpreted diagnostically with classic symptoms or crisis. A home capillary meter and continuous glucose monitor are designed for management and rapid decisions; current diagnostic criteria require appropriately performed laboratory testing. Because the tests sample different physiology, normal FPG does not rule out postprandial dysglycemia, and an abnormal FPG should not be 'corrected' by averaging it with a normal A1C." },
        { label: "Preanalytic error: why glucose may fall in the tube", text: "Blood cells remain metabolically active after collection and continue consuming glucose through glycolysis. If plasma is not separated from cells promptly or the specimen is not stabilized according to laboratory protocol, the measured glucose can become falsely low. This is especially important near a diagnostic threshold. Tube choice alone may not stop early glycolysis immediately, so the laboratory's collection, transport, processing-time, and temperature instructions matter. Delayed transport, an unrecorded processing problem, or collection from a line containing dextrose can produce opposite misleading patterns. When a result is implausible, ask how and where the sample was obtained rather than assuming the patient's physiology changed." },
        { label: "Biological confounders and medication effects", text: "Acute infection, surgery, trauma, pain, sleep loss, myocardial infarction, glucocorticoids, catecholamines, and other stressors can raise glucose by increasing counter-regulatory hormones and insulin resistance. Glucocorticoids may cause a larger postprandial rise than fasting rise, so a normal FPG can miss their effect. Thiazides, some antipsychotics, selected HIV medicines, calcineurin inhibitors, and other drugs can worsen glycemia over time. Conversely, insulin, sulfonylureas, meglitinides, poor intake, prolonged fasting, alcohol, reduced kidney clearance of medication, liver failure, adrenal insufficiency, or severe illness can lower glucose. Interpretation asks whether the test reflects stable outpatient physiology or a temporary context." },
        { label: "Low fasting glucose and immediate safety", text: "A low value is not part of diabetes screening alone; it can represent medication-associated hypoglycemia, inadequate intake, alcohol-related inhibition of gluconeogenesis, organ failure, endocrine deficiency, sepsis, or rare endogenous hyperinsulinism. Symptoms such as sweating, tremor, palpitations, hunger, confusion, behavior change, seizure, or reduced consciousness determine urgency. Confirm with a rapid clinical measurement when feasible, but treat clinically significant hypoglycemia according to protocol rather than waiting for a central laboratory result. Recheck after treatment because initial carbohydrate may wear off while a long-acting drug persists. Document symptoms, medication timing, intake, treatment, repeat value, and the plan to prevent recurrence." },
        { label: "Pregnancy, children, and population context", text: "The nonpregnant FPG categories on this card should not be substituted for gestational-diabetes screening or treatment targets. Pregnancy changes glucose physiology, and one-step and two-step gestational testing pathways use timed glucose loads and pregnancy-specific thresholds. Children and adolescents use the same general laboratory diagnostic thresholds for diabetes, but the differential includes type 1 diabetes and rapid ketosis risk; symptoms, weight loss, ketones, acid-base status, autoantibodies, and specialist evaluation may be urgent. Newborn glucose assessment is a separate transitional physiology and protocol. In every population, the diagnostic glucose level identifies hyperglycemia, not its etiologic type." },
        { label: "Nursing preparation, collection, and follow-up", text: "Verify the order and purpose: screening, diagnosis, medication monitoring, pregnancy pathway, or acute evaluation. Confirm fasting duration without blaming the patient, identify diabetes therapy and a safe morning medication plan, and ask about recent illness, steroids, nutrition support, alcohol, and symptoms. Use the correct tube and collection site, avoid dextrose-contaminated lines, label time and fasting status, and send or process promptly. Report critical results according to policy and assess the patient rather than phoning a number in isolation. For a new abnormal screening result, explain that confirmation and classification come next; prediabetes is a risk state where weight, activity, nutrition, sleep, blood pressure, lipids, smoking, and cardiovascular risk deserve attention." },
        { label: "Emergency and clinical traps", text: "Do not ask a symptomatic patient with polyuria, polydipsia, vomiting, abdominal pain, deep breathing, dehydration, confusion, or suspected DKA or HHS to return fasting before evaluating them. Do not use a normal fasting value to rule out glucose excursions after meals, steroid hyperglycemia, or evolving diabetes. Do not diagnose from a consumer meter alone, and do not call a delayed, glycolyzed specimen reassuring. Do not apply nonpregnant cutoffs to pregnancy or treatment targets to diagnosis. Connect FPG to A1C, OGTT, random plasma glucose, ketones and beta-hydroxybutyrate, DKA, HHS, hypoglycemia, insulin resistance, type 1 and type 2 diabetes, gestational diabetes, metabolic syndrome, and glucose-lowering medicines." }
      ],
      relatedTopics: ["Diabetes mellitus", "Prediabetes", "Hemoglobin A1C", "Oral glucose tolerance test", "Random plasma glucose", "Hypoglycemia", "Diabetic ketoacidosis", "Hyperosmolar hyperglycemic state", "Gestational diabetes", "Insulin resistance", "Metabolic syndrome", "Glucose monitoring"],
      tags: ["fasting glucose", "fasting plasma glucose", "laboratory test", "FPG", "FBS", "diabetes diagnosis", "prediabetes", "impaired fasting glucose", "8 hour fast", "glycolysis", "specimen handling", "confirmatory testing", "hypoglycemia"],
      sourceKeys: ["w37-ada-diabetes-2026", "w37-niddk-diabetes-testing", "w37-cdc-diabetes-testing"]
    }),

    article({
      name: "Cardiac MRI",
      fullForm: "Cardiac magnetic resonance imaging",
      displayName: "Cardiac MRI",
      type: "diagnostic-imaging-procedure",
      diagnosticKind: "imaging",
      cardiacMriClinicalSignificanceRevision: "2026-08-13-cardiac-mri-clinical-significance-1",
      icon: "CMR",
      category: "Diagnostics and Tests / Cardiovascular Imaging / Magnetic Resonance",
      aliases: [
        "cardiac magnetic resonance", "cardiovascular magnetic resonance", "heart MRI", "MRI of the heart", "cardiac MR", "CMR scan", "cardiac MRI with contrast", "cardiac MRI without contrast", "heart MRI with gadolinium", "cardiac MRI for myocarditis", "cardiac MRI for cardiomyopathy", "cardiac MRI for scar", "cardiac MRI viability", "stress cardiac MRI", "cardiac perfusion MRI", "late gadolinium enhancement", "heart tissue characterization", "MRI ejection fraction", "can I have cardiac MRI with a pacemaker", "why gadolinium is used in heart MRI", "what does cardiac MRI show"
      ],
      abbreviations: ["CMR", "cMRI", "MRI", "LGE", "GBCA", "T1", "T2", "T2*", "ECV", "bSSFP", "MRA"],
      commonMisspellings: ["cardaic MRI", "cardic MRI", "cardial MRI", "cardivascular magnetic resonance", "cardiac magnetic resonence", "heart mri scan", "late gadalonium enhancement", "cardiac mri gadolinium"],
      summary: "Cardiac MRI, also called cardiovascular magnetic resonance or CMR, is a diagnostic imaging procedure that uses a strong magnetic field, radiofrequency pulses, ECG or pulse synchronization, and specialized sequences to characterize cardiac anatomy, motion, blood flow, perfusion, and tissue. It uses no ionizing radiation. Cine imaging can quantify ventricular volumes, ejection fraction, mass, and wall motion; phase-contrast techniques quantify flow; stress perfusion evaluates inducible ischemia; and T1, T2, T2*, extracellular-volume, and late-gadolinium-enhancement methods can identify patterns of edema, fibrosis, infarction, infiltration, or iron. Not every study uses gadolinium or stress medication, and the protocol must be designed around a specific question. CMR is powerful but not self-interpreting: rhythm, motion, breath-holding, devices, contrast choice, local mapping reference ranges, disease timing, and reader expertise affect the result. Rigorous MR screening is essential because the magnetic field is always present and can turn unsafe metal or equipment into a projectile or alter implanted devices.",
      quickAnswer: "Cardiac MRI helps identify structural, functional, flow, perfusion, and tissue patterns that guide diagnosis, risk assessment, or management. A CMR pattern can narrow the differential, but it does not diagnose a cause by itself; interpret it with the question, timing, protocol, and other tests. CMR is a toolbox rather than one picture: cine images show chamber size and contraction; phase-contrast sequences measure flow; stress perfusion tests for inducible ischemia; T2-based imaging assesses water and edema; T1 and extracellular-volume methods assess interstitial change; T2* quantifies iron; and late gadolinium enhancement maps expanded extracellular space such as scar. Not every protocol uses gadolinium or stress medication. Before scanning, verify the exact implant or device, retained-metal risk, pregnancy, kidney function if contrast may be used, prior contrast reaction, ability to lie flat or follow breath-holds, and need for MR-safe monitoring or sedation. If shock, ongoing chest pain, or a dangerous arrhythmia makes the patient unstable, do not delay emergency stabilization or the appropriate time-critical pathway merely to obtain CMR; never bring ordinary oxygen cylinders, pumps, tools, or resuscitation equipment into the scanner room.",
      resultMeanings: [
        ["Normal or no target abnormality", "The protocol did not demonstrate the targeted structural, functional, perfusion, flow, or tissue abnormality at that time. It does not exclude disease outside the sequences, resolution, timing, or physiologic conditions studied."],
        ["Abnormal ventricular structure or function", "Chamber volume, mass, regional motion, or ejection fraction differs from reference expectations. Interpret with body size, rhythm, loading conditions, echo findings, and the suspected disease."],
        ["Late gadolinium enhancement present", "Contrast persists in expanded extracellular space. Ischemic and nonischemic distribution patterns can narrow the differential, but LGE can represent scar, necrosis, fibrosis, or other interstitial expansion rather than one universal diagnosis."],
        ["T1/T2/T2* or ECV abnormal", "A quantitative tissue signal differs from validated local references and may support edema, diffuse fibrosis or infiltration, fat, or iron depending on the sequence. Scanner, field strength, sequence, artifacts, and disease timing affect interpretation."],
        ["Limited or nondiagnostic", "Motion, arrhythmia, inability to breath-hold, device artifact, poor gating, body habitus, or an incomplete protocol prevented a reliable answer. A limited study is not a negative study; another sequence or modality may be needed."]
      ],
      sections: [
        { label: "How CMR creates information", text: "A strong static magnetic field aligns hydrogen nuclei. Radiofrequency pulses perturb that alignment, and receiver coils detect signals as nuclei relax. Magnetic gradients localize the signals into images. Different tissues and disease states alter T1 and T2 relaxation and proton environment, so changing the pulse sequence emphasizes different biology. Cardiac motion adds a challenge: ECG or pulse gating assigns data to phases of the cardiac cycle, while breath-holds or motion-correction methods reduce respiratory blur. The scanner therefore does not take one photograph. It repeatedly samples signals under controlled conditions and reconstructs anatomy, motion, flow, perfusion, and tissue contrast. There is no ionizing radiation, but nonionizing does not mean risk free because magnetic, gradient, radiofrequency, contrast, and sedation hazards remain." },
        { label: "Core sequences and what each answers", text: "Cine balanced steady-state free-precession imaging provides high contrast between blood and myocardium and is used to measure left- and right-ventricular volumes, mass, ejection fraction, and regional motion. Black-blood and angiographic sequences define anatomy and vessels. Phase-contrast velocity encoding quantifies flow, shunts, and regurgitant volume when the plane and velocity range are correct. Because moving blood accumulates a velocity-dependent phase shift across bipolar gradients, phase-contrast imaging can convert that shift into directional velocity and calculate flow over time; poor plane alignment or velocity settings therefore create predictable error. First-pass perfusion tracks contrast through myocardium at rest or during pharmacologic stress to identify relative hypoperfusion. T1 and T2 mapping quantify tissue behavior; T2-weighted or T2 mapping techniques support edema assessment, T2* is central to myocardial iron measurement, and extracellular-volume calculation combines pre- and postcontrast T1 with hematocrit. Each technique answers a different question and has its own artifacts." },
        { label: "Late gadolinium enhancement: mechanism and pattern", text: "Gadolinium-based contrast remains extracellular. In normal compact myocardium it washes out relatively quickly. Infarction, replacement fibrosis, necrosis, or expanded interstitial space increases the distribution volume or delays washout, so an inversion-recovery sequence acquired later can make affected tissue appear bright relative to nulled normal myocardium. Coronary ischemic injury usually begins subendocardially and may extend transmurally in a vascular territory. Mid-wall, subepicardial, patchy, or insertion-point patterns suggest different nonischemic processes. Pattern recognition changes probability; it is not histology. LGE is relatively insensitive to uniformly diffuse fibrosis because there may be no normal reference region, which is one reason mapping and extracellular volume can add information." },
        { label: "Myocarditis, edema, and disease timing", text: "In suspected myocarditis, SCMR protocols combine ventricular function with edema-sensitive T2 methods and T1-based evidence of interstitial expansion or injury, including mapping and LGE. Active inflammation may increase water content and both T1- and T2-related signals, while later residual LGE can represent scar after edema has resolved. A compatible CMR can strongly support myocarditis and identify risk-relevant scar, but the scan does not find a virus, exclude coronary disease by itself, or replace biopsy when a specific fulminant or treatable subtype requires tissue. Sensitivity changes with timing and focality. A normal scan obtained late, very early, or with limited sequences should not overrule shock, dangerous arrhythmia, heart block, rising troponin, or progressive ventricular dysfunction." },
        { label: "Major clinical indications", text: "CMR is used to characterize dilated, hypertrophic, arrhythmogenic, restrictive, infiltrative, inflammatory, iron-overload, toxic, and genetic cardiomyopathies; assess myocarditis and cardiac sarcoidosis; define infarct and viability; evaluate stress perfusion and selected coronary anomalies; quantify right- and left-ventricular function; assess congenital heart anatomy and shunts; characterize cardiac masses and thrombus; evaluate pericardial structure and ventricular interdependence; quantify selected valve lesions and great-vessel flow; and help plan or follow therapy. It is often complementary to echocardiography, CT, nuclear imaging, catheterization, and biopsy. The best modality depends on the question, urgency, local expertise, rhythm, kidney and device context, and whether anatomy, calcium, pressure, flow, or tissue is the missing information." },
        { label: "Gadolinium: benefit, retention, kidney risk, and reactions", text: "Gadolinium-based contrast improves perfusion, angiography, and LGE assessment, but many cine, flow, anatomy, T1, T2, and T2* questions can be answered without it. Most injected agent is eliminated through the kidneys, while trace gadolinium can remain in the body for months to years. FDA communication notes greater retention with linear than macrocyclic agents and no directly established harm from retention in people with normal kidney function, while emphasizing informed selection and avoiding unnecessary closely spaced repeat doses. Severe kidney dysfunction and acute kidney injury require agent- and indication-specific review because nephrogenic systemic fibrosis risk varies greatly by agent group. Prior reaction, pregnancy, repeated lifetime exposure, and alternatives matter. Necessary enhanced imaging should not be automatically withheld; use the lowest appropriate exposure under current radiology policy." },
        { label: "Implants and metal: MR conditional is a set of conditions", text: "A pacemaker, defibrillator, valve, stent, clip, neurostimulator, infusion pump, cochlear implant, vascular filter, retained fragment, or prior surgery is not answered safely by 'metal: yes or no.' Staff must identify the exact device, manufacturer and model, components and leads, implantation date, location, and the conditions under which it is labeled or institutionally managed. MR Conditional means safe only when specified field strength, scan region, radiofrequency exposure, device programming, monitoring, and other conditions are met. Some patients with nonconditional cardiac devices can be scanned in experienced programs using strict protocols; this is not permission for casual scanning. Unknown devices, abandoned or fractured leads, and orbital metal require expert resolution before entry." },
        { label: "Preparation and nursing safety before the scan", text: "Verify patient identity, indication, protocol, pregnancy possibility, kidney function if gadolinium is planned, contrast and medication reaction history, implants and operations, metal exposure, transdermal patches, tattoos or cosmetics with metallic components, hearing aids, medication pumps, glucose technology, piercings, and removable objects. Determine whether the patient can lie flat, fit safely, communicate, and perform repeated breath-holds. Explain noise, table motion, ECG leads, breath-hold coaching, IV access, contrast warmth, and the call device. Claustrophobia may be reduced by preparation or require an ordered anxiolytic or sedation plan. Sedation changes the procedure into monitored care with airway, fasting, escort, and recovery requirements. All equipment crossing the controlled boundary must be MR safe or MR conditional for the intended use." },
        { label: "During and after CMR", text: "Maintain visual and voice contact and use MR-compatible monitoring when indicated. Watch for anxiety, dyspnea while supine, pain, heating or burning, device symptoms, contrast reaction, and stress-agent effects. ECG traces inside MRI can be distorted, so assess the patient and corroborate concerning signals. If a medical emergency occurs in the magnet room, remove the patient to the designated safe resuscitation area before bringing conventional emergency equipment near the scanner. After uncomplicated noncontrast CMR, special recovery is usually unnecessary. After gadolinium or stress medication, follow local observation and reaction instructions; after sedation, monitor airway, breathing, circulation, consciousness, mobility, and discharge criteria. Document agent and dose, IV site, medicines, symptoms, monitoring, and response." },
        { label: "Limitations and false certainty", text: "Arrhythmia and poor ECG gating can corrupt cine, mapping, flow, and perfusion data. Inability to hold breath, respiratory distress, motion, or severe claustrophobia can limit completion. Cardiac devices may create artifacts even when scanning is safe. Mapping values are sequence-, scanner-, and field-strength-specific, so a cutoff from another center is not automatically valid. LGE can miss diffuse microscopic fibrosis and cannot by itself distinguish active from healed injury. CMR has less direct temporal access than bedside echo in an unstable patient and may be slower or less available. Coronary calcium and small-vessel lumen anatomy may be better answered by CT or catheter angiography. A technically beautiful scan still requires the right pretest question." },
        { label: "Clinical traps and related topics", text: "Do not call CMR an imaging finding; it is a diagnostic imaging procedure that generates multiple findings. Do not say MRI has 'no radiation' and conclude it has no hazards; the static field is continuously active. Do not assume every pacemaker is prohibited or every MR-conditional device is automatically safe. Do not equate gadolinium with iodine, or LGE with ongoing inflammation. Do not treat a normal ejection fraction as normal myocardium when mapping, perfusion, scar, valves, or right-heart findings are abnormal. Connect to echocardiography, cardiac CT, coronary angiography, myocarditis, myocardial infarction, cardiomyopathy, amyloidosis, sarcoidosis, hemochromatosis, congenital heart disease, valve disease, pericarditis, gadolinium, MRI safety, ejection fraction, and stress testing." }
      ],
      relatedTopics: ["Echocardiogram", "Cardiac CT", "Coronary angiography", "Myocarditis", "Myocardial infarction", "Cardiomyopathy", "Cardiac amyloidosis", "Cardiac sarcoidosis", "Hemochromatosis", "Congenital heart disease", "Valvular heart disease", "Pericarditis", "Gadolinium contrast", "MRI safety", "Ejection fraction", "Stress testing"],
      tags: ["cardiac MRI", "cardiovascular magnetic resonance", "diagnostic imaging procedure", "CMR", "cine imaging", "late gadolinium enhancement", "LGE", "T1 mapping", "T2 mapping", "T2 star", "perfusion", "flow", "myocarditis", "cardiomyopathy", "MRI safety", "gadolinium"],
      sourceKeys: ["w37-scmr-protocols-2020", "w37-scmr-indications-2020", "w37-acr-mr-safety-2024", "w37-acr-contrast-2025", "w37-fda-gadolinium", "w37-nhlbi-heart-tests"]
    }),

    article({
      name: "Pediatric Early Warning Score",
      fullForm: "Pediatric Early Warning System",
      displayName: "Pediatric Early Warning Score (PEWS)",
      type: "clinical-assessment-system",
      diagnosticKind: "assessment",
      icon: "PEWS",
      category: "Diagnostics and Tests / Pediatric Assessment / Deterioration Recognition",
      aliases: [
        "Pediatric Early Warning System", "Paediatric Early Warning Score", "Paediatric Early Warning System", "pediatric early warning tool", "pediatric track and trigger tool", "child deterioration score", "pediatric deterioration chart", "PEWS chart", "PEWS score", "PEW score", "BedsidePEWS", "Brighton PEWS", "National PEWS England", "child vital sign warning score", "how to calculate PEWS", "what PEWS score is dangerous", "when to escalate PEWS", "high PEWS", "low PEWS but child looks sick", "parent concern PEWS", "pediatric rapid response trigger", "early warning signs in a hospitalized child"
      ],
      abbreviations: ["PEWS", "PEW score", "PEW system", "PTTT", "EWS", "RRT", "MET", "CRT", "PICU"],
      commonMisspellings: ["pediatric early waring score", "pediatric early warning scrore", "pediatic early warning score", "peadiatric early warning score", "paedatric warning score", "pews pediatric", "peds early warning score", "pediatric early worning system"],
      summary: "A Pediatric Early Warning Score is the numerical component of a Pediatric Early Warning System: a locally adopted track-and-trigger process that standardizes observation, recognizes worsening physiology or concern, and links a trigger to a defined response. PEWS is not one universal score. Hospitals and national programs use different age bands, variables, weights, thresholds, exemptions, and escalation teams, so a number from one tool cannot be imported into another. Common inputs include age-adjusted heart and respiratory rates, work of breathing, oxygen saturation and support, blood pressure, perfusion, behavior or consciousness, and staff or family concern. The score helps reveal trends and creates a shared language; it does not diagnose the cause, replace a pediatric assessment, or authorize waiting when a child looks critically ill. Airway compromise, apnea, severe work of breathing, cyanosis, shock, seizure, rapidly altered consciousness, or clinician or caregiver concern should activate the local emergency pathway regardless of the total.",
      quickAnswer: "PEWS signals a child's risk of clinical deterioration and organizes reassessment and escalation; it does not diagnose sepsis, respiratory failure, shock, or another cause. Use the exact PEWS chart and escalation policy approved for that child, age band, unit, and institution. Measure observations correctly, score every required domain, look for a rising trend and single-domain extremes, then act at the highest trigger level - which may come from the number, one dangerous observation, neurologic change, sepsis concern, clinician intuition, or parent/carer concern. When the score or bedside assessment raises concern, perform a focused pediatric ABC assessment, validate the measurements, and support clinician-selected cause-directed evaluation - for example glucose, sepsis, respiratory, fluid, or neurologic evaluation - as the presentation warrants. Reassessment after action is part of the system. Cutoffs are tool-specific, so transferring one threshold between systems can trigger the wrong response; similarly, altering points to make chronic abnormalities look normal hides risk. ABC danger takes priority over finishing the arithmetic. PEWS predicts risk imperfectly: fever, pain, crying, sleep, medications, chronic hypoxemia, technology dependence, and measurement error can change it, while early compensated shock or quiet respiratory fatigue can look deceptively modest. A low score means 'continue appropriate surveillance,' not 'the child is safe.'",
      resultMeanings: [
        ["Low or unchanged local score", "Continue the observation frequency and care plan required by the local system, but escalate independent concern, a dangerous single parameter, or a meaningful change from the child's baseline."],
        ["Rising trend", "Repeated deterioration across time can be more informative than one total. Validate measurements, reassess the child, identify the changing domain, increase surveillance, and trigger the local response."],
        ["High local score or trigger", "The child has crossed that system's escalation rule. Initiate the prescribed clinical review or rapid-response pathway while addressing airway, breathing, circulation, disability, and the likely cause."],
        ["Single extreme observation", "Many systems allow one severe domain or explicit emergency criterion to override a modest total. Treat the physiology and follow the highest applicable escalation level."],
        ["Clinical or caregiver concern despite a low score", "Concern is clinically meaningful data. Reassess and escalate through the local concern pathway; never use the numerical total to silence the child, family, or bedside clinician."]
      ],
      sections: [
        { label: "System versus score", text: "The score converts selected observations into points. The system includes much more: correct measurement, an age-specific chart, scheduled trending, recognition of change, clear communication, a graded response, staff capable of responding, documentation, reassessment, education, governance, and learning after events. RCPCH explicitly describes PEWS as a system containing a score plus standardized escalation and communication. This distinction explains why installing a calculator alone cannot reliably prevent deterioration. The value comes from shortening the path from subtle abnormality to shared awareness and effective action. If observations are inaccurate, escalation is ignored, or responders lack resources, a mathematically correct score can still fail the child." },
        { label: "There is no universal PEWS number", text: "PEWS refers to a family of tools, including Brighton, BedsidePEWS, Children's Hospital Early Warning Score, national or regional systems, and many local modifications. They do not necessarily use the same variables, age limits, weights, total range, or outcomes. A value of 4 in one system may trigger a different response from 4 in another. Thresholds validated on a general inpatient ward may not apply in an emergency department, oncology unit, cardiac ward, PICU, neonatal unit, or community setting. Use the current local chart and policy, confirm the correct age band, and name the tool version in documentation or handoff. ANI intentionally does not reproduce a scoring chart because using a detached or obsolete algorithm would be unsafe." },
        { label: "Why pediatric physiology requires age-aware interpretation", text: "Normal heart rate, respiratory rate, and blood pressure change markedly from infancy through adolescence. Children often increase heart rate and vascular tone to preserve blood pressure, so hypotension may appear late in shock. Respiratory disease can progress from tachypnea and retractions to fatigue, slower effort, poor air entry, altered consciousness, and apnea; a falling respiratory rate is not always improvement. Small circulating volume and high metabolic demand allow dehydration or sepsis to evolve quickly. An age-specific track-and-trigger tool makes these changes visible and consistent, but developmental behavior, sleep, crying, fever, pain, and baseline disease must still be interpreted by a clinician." },
        { label: "Common domains and what they mean", text: "Tools commonly examine respiratory rate and effort because worsening ventilation often precedes pediatric arrest; oxygen saturation and oxygen or ventilatory support reveal gas-exchange reserve; heart rate, blood pressure, capillary refill, pulses, skin, and urine output inform circulation; and behavior, interaction, AVPU or other consciousness measures reveal cerebral perfusion, hypoxemia, seizures, medication effect, or neurologic disease. The English National PEWS score includes heart rate, respiratory rate, respiratory distress, blood pressure, oxygen saturation, oxygen delivery, and capillary refill, while temperature, AVPU, and pain are recorded and separate concern triggers also operate. Other systems differ. The purpose is to organize physiology, not to claim every domain contributes equally in every disease." },
        { label: "Measurement quality before calculation", text: "Count respirations for long enough to see pattern and effort, ideally before disturbing a calm infant. Confirm pulse quality and whether monitor heart rate matches an auscultated or palpated rate when artifact is possible. Use the correct blood-pressure cuff width and position; a wrong cuff can create a false trigger or false reassurance. Check pulse-oximeter waveform, probe placement, perfusion, motion, skin temperature, and oxygen delivery device. Assess capillary refill in appropriate light and temperature and recognize its limitations. Record consciousness, behavior, pain, fever, medications, sleep or crying, and the child's usual baseline. Scoring a bad observation precisely does not make it accurate." },
        { label: "Track, trigger, respond, and reassess", text: "First obtain and validate the complete required observation set. Second, calculate using the correct local age band and identify both the total and the domain producing it. Third, compare with prior values because trend and rate of change matter. Fourth, activate the response specified for the highest applicable trigger; this may increase observation frequency, require bedside medical review, call a senior clinician or critical-care outreach team, or activate an emergency response. Use a structured handoff such as ISBAR and state the concern, trajectory, interventions, and response. Fifth, stabilize likely ABC problems and reassess at the required interval. A score that was documented but not closed by response and reevaluation is an unfinished safety process." },
        { label: "Override rules: concern outranks arithmetic", text: "Do not delay emergency action for apnea, severe or exhausting work of breathing, central cyanosis, rapidly escalating oxygen or ventilatory support, signs of shock, collapse, seizure, new unresponsiveness, threatened airway, or another life-threatening state while calculating a total. Many systems include explicit single-parameter, sepsis, neurologic, clinical-intuition, or caregiver-concern triggers. The English National PEWS allows clinician and parent/carer concern to escalate care irrespective of a low score. This design exists because experienced observers recognize pattern, behavior, trajectory, or 'not right' changes not fully captured by discrete vital-sign bins. A low score cannot veto concern; it should prompt a careful explanation of why the number and patient differ." },
        { label: "Confounders, baseline abnormalities, and special populations", text: "Fever, pain, anxiety, crying, recent exertion, bronchodilators, stimulants, sedatives, opioids, sleep, dehydration, and environmental temperature can alter observations. Congenital heart disease, chronic lung disease, neuromuscular weakness, home oxygen, tracheostomy, noninvasive ventilation, autonomic disorders, and baseline developmental or neurologic differences may keep one domain outside a typical range. A local individualized plan may describe expected baseline and specific escalation features, but staff should not silently erase points or invent new thresholds. Chronic abnormality can represent lower reserve rather than safety. Neonates, emergency triage, oncology, cardiac, and intensive-care populations may require different systems and disease-specific pathways." },
        { label: "What evidence supports - and does not prove", text: "Validation studies show that some PEWS tools discriminate children who later need critical-care review or transfer, often providing warning time. However, systematic reviews find many distinct tools, mostly retrospective or single-center validation, heterogeneous outcomes and cutoffs, and consistently low positive predictive value in some settings, which can create alarm fatigue. The 21-hospital EPOCH cluster randomized trial did not show lower all-cause hospital mortality after implementing BedsidePEWS compared with usual care. That result does not prove observation systems are useless; it shows that a score alone is not a guaranteed mortality intervention and that baseline care, implementation, response reliability, event rarity, and context matter. PEWS should strengthen situation awareness and communication while evidence and local performance are continually audited." },
        { label: "Nursing priorities and escalation handoff", text: "The bedside nurse often detects trajectory first. Describe the child before the score: appearance, interaction, airway sounds, work of breathing, oxygen and support, color and perfusion, pulses and capillary refill, mental status, pain, hydration and urine, and the caregiver's observation. Then state the exact PEWS tool, current value, prior values and times, the domain that changed, single-parameter triggers, actions already taken, and response. Stay with an unstable child, initiate local ABC measures within scope, summon the appropriate team, prepare emergency equipment, and anticipate glucose, sepsis, respiratory, fluid, or neurologic evaluation as the presentation warrants. Document who was notified, time, requested response, bedside review, plan, reassessment deadline, and what happened." },
        { label: "Patient and family partnership", text: "Parents and carers know the child's usual behavior, breathing, color, intake, and responsiveness and may detect deterioration before a threshold is crossed. Ask directly whether the child is better, the same, or worse and what specifically has changed. Treat concern as data rather than reassurance-seeking, language difficulty, or anxiety. Explain what observations are being followed, what changes should be reported immediately, and how to activate the organization's escalation pathway. Children and young people should also be heard in developmentally appropriate language. A well-designed system gives concern an independent route upward instead of requiring families to persuade one clinician that the number is wrong." },
        { label: "Clinical traps and related concepts", text: "PEWS does not diagnose sepsis, asthma severity, respiratory failure, dehydration, shock, or neurologic disease; it signals deterioration risk and organizes response. It is not a universal triage scale, a substitute for Pediatric Assessment Triangle or ABCDE assessment, or a reason to postpone a rapid-response call. A stable total can hide a dangerous single parameter, and a high total caused by fever and distress can still require clinical review even if critical illness is not ultimately present. Repeated scores are not useful without actions and reassessment. Connect to pediatric vital signs, Pediatric Assessment Triangle, ABCDE assessment, rapid response systems, sepsis screening, respiratory distress and failure, shock, capillary refill, AVPU and Glasgow Coma Scale, pulse oximetry, ISBAR communication, and family-activated escalation." }
      ],
      relatedTopics: ["Pediatric vital signs", "Pediatric Assessment Triangle", "ABCDE assessment", "Rapid response team", "Pediatric sepsis", "Respiratory distress", "Respiratory failure", "Pediatric shock", "Capillary refill", "AVPU", "Glasgow Coma Scale", "Pulse oximetry", "ISBAR communication", "Family-activated escalation"],
      tags: ["Pediatric Early Warning Score", "Pediatric Early Warning System", "Paediatric Early Warning System", "PEWS", "clinical assessment system", "track and trigger", "deteriorating child", "age specific vital signs", "rapid response", "parent concern", "clinical intuition", "nursing escalation", "patient safety"],
      sourceKeys: ["w37-nhs-england-pews", "w37-rcpch-pews", "w37-pews-systematic-review", "w37-pews-epoch"]
    })
  ];

  const expectedNames = [
    "BNP/NT-proBNP",
    "Fasting glucose",
    "Cardiac MRI",
    "Pediatric Early Warning Score"
  ];
  if (entries.length !== expectedNames.length
    || entries.some((entry, index) => entry.name !== expectedNames[index])) {
    throw new Error("Wave37 diagnostics cohort B must contain the four locked entries in order.");
  }

  const pharmDatabase = window.ANI_PHARM_DATABASE && typeof window.ANI_PHARM_DATABASE === "object"
    ? window.ANI_PHARM_DATABASE
    : { drugs: [], labRanges: [] };
  if (!Array.isArray(pharmDatabase.labRanges)) pharmDatabase.labRanges = [];
  const identityFields = ["id", "key", "slug", "entryId", "uuid"];
  const legacyLabFamilies = [
    { canonicalName: "BNP/NT-proBNP", names: ["BNP", "NT-proBNP"] },
    { canonicalName: "Fasting glucose", names: ["Fasting glucose"] }
  ];
  const legacyLabRetirement = {};
  legacyLabFamilies.forEach((family) => {
    const familyKeys = new Set(family.names.map(normalize));
    const matchingIndexes = pharmDatabase.labRanges
      .map((candidate, index) => familyKeys.has(normalize(candidate && candidate.name)) ? index : -1)
      .filter((index) => index >= 0);
    const legacyRecords = matchingIndexes.map((index) => pharmDatabase.labRanges[index]).filter(Boolean);
    const target = entries.find((entry) => normalize(entry.name) === normalize(family.canonicalName));
    if (!target) throw new Error("Missing Wave37 diagnostics migration target: " + family.canonicalName);
    const preservedIdentifiers = unique(legacyRecords.flatMap((record) => identityFields
      .filter((field) => record[field] !== undefined && record[field] !== null && String(record[field]).trim())
      .map((field) => field + ":" + String(record[field]))));
    target.aliases = unique([
      ...(target.aliases || []),
      ...legacyRecords.flatMap((record) => [record.name, ...(record.aliases || [])])
    ]);
    target.legacyIdentifiers = unique([...(target.legacyIdentifiers || []), ...preservedIdentifiers]);
    target.mergedLegacyLabRanges = legacyRecords.map((record) => ({
      name: record.name,
      category: record.category || "",
      range: record.range || "",
      why: record.why || ""
    }));
    for (let index = matchingIndexes.length - 1; index >= 0; index -= 1) {
      pharmDatabase.labRanges.splice(matchingIndexes[index], 1);
    }
    legacyLabRetirement[family.canonicalName] = Object.freeze({
      retiredNames: Object.freeze(legacyRecords.map((record) => record.name)),
      retiredCount: legacyRecords.length,
      preservedIdentifiers: Object.freeze(preservedIdentifiers.slice())
    });
  });

  const diagnosticDatabase = window.ANI_DIAGNOSTIC_DATABASE && typeof window.ANI_DIAGNOSTIC_DATABASE === "object"
    ? window.ANI_DIAGNOSTIC_DATABASE
    : { entries: [] };
  if (!Array.isArray(diagnosticDatabase.entries)) diagnosticDatabase.entries = [];

  const patchedNames = [];
  const addedNames = [];
  entries.forEach((entry) => {
    const key = normalize(entry.name);
    const matchingIndexes = diagnosticDatabase.entries
      .map((candidate, index) => normalize(candidate && candidate.name) === key ? index : -1)
      .filter((index) => index >= 0);
    if (matchingIndexes.length) {
      const canonicalIndex = matchingIndexes[0];
      const existing = diagnosticDatabase.entries[canonicalIndex] || {};
      const inheritedAliases = matchingIndexes.flatMap((index) => diagnosticDatabase.entries[index]?.aliases || []);
      const preservedIdentifiers = unique(matchingIndexes.flatMap((index) => {
        const candidate = diagnosticDatabase.entries[index] || {};
        return identityFields
          .filter((field) => candidate[field] !== undefined && candidate[field] !== null && String(candidate[field]).trim())
          .map((field) => field + ":" + String(candidate[field]));
      }));
      Object.assign(existing, entry, {
        aliases: unique([...inheritedAliases, ...(entry.aliases || [])]),
        legacyIdentifiers: unique([...(existing.legacyIdentifiers || []), ...preservedIdentifiers, ...(entry.legacyIdentifiers || [])])
      });
      diagnosticDatabase.entries[canonicalIndex] = existing;
      for (let i = matchingIndexes.length - 1; i >= 1; i -= 1) {
        diagnosticDatabase.entries.splice(matchingIndexes[i], 1);
      }
      patchedNames.push(entry.name);
    } else {
      diagnosticDatabase.entries.push(entry);
      addedNames.push(entry.name);
    }
  });

  diagnosticDatabase.cohorts = {
    ...(diagnosticDatabase.cohorts || {}),
    wave37DiagnosticsB: expectedNames.slice()
  };
  diagnosticDatabase.componentVersions = {
    ...(diagnosticDatabase.componentVersions || {}),
    wave37DiagnosticsB: VERSION
  };
  diagnosticDatabase.latestExtensionVersion = VERSION;
  foundationDatabase.componentVersions = {
    ...(foundationDatabase.componentVersions || {}),
    wave37DiagnosticsBSources: VERSION
  };

  window.ANI_DIAGNOSTIC_DATABASE = diagnosticDatabase;
  window.ANI_PHARM_DATABASE = pharmDatabase;
  window.ANI_FOUNDATIONS_DATABASE = foundationDatabase;
  window[GLOBAL_NAME] = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    entryNames: expectedNames.slice(),
    entryCount: entries.length,
    patchedNames: patchedNames.slice(),
    addedNames: addedNames.slice(),
    canonicalOwners: Object.freeze(Object.fromEntries(entries.map((entry) => [entry.name, "reference"]))),
    legacyLabRetirement: Object.freeze(legacyLabRetirement),
    canonicalTypes: Object.freeze(Object.fromEntries(entries.map((entry) => [entry.name, entry.type]))),
    sourceKeys: unique(entries.flatMap((entry) => entry.sourceKeys)),
    sourceCount: unique(entries.flatMap((entry) => entry.sourceKeys)).length
  });
}());
