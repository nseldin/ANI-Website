(function () {
  const SOURCE_NOTE = "Diagnostic study guidance is designed for NCLEX study and bedside nursing review. Verify facility policy, provider orders, pregnancy/contrast precautions, and current official references in real care.";
  const SOURCE_REFERENCES = [
    {
      key: "aasld-liver-enzymes-2025",
      label: "AASLD: How to approach elevated liver enzymes? (2025)",
      url: "https://www.aasld.org/liver-fellow-network/core-series/back-basics/how-approach-elevated-liver-enzymes"
    },
    {
      key: "acg-abnormal-liver-chemistries",
      label: "ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries",
      url: "https://acgcdn.gi.org/wp-content/uploads/2018/04/ACG-Abnormal-Liver-Chemistries-Guideline-Summary.pdf"
    },
    {
      key: "va-liver-synthetic-function",
      label: "U.S. Department of Veterans Affairs: Synthetic Liver Function Tests",
      url: "https://www.hepatitis.va.gov/HEPATITIS/course/index.asp?page=/provider/courses/livertests/livertests-11"
    },
    {
      key: "nih-livertox-rucam",
      label: "NIH LiverTox: RUCAM and biochemical injury-pattern assessment",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK548272/"
    },
    {
      key: "aasld-acute-liver-failure",
      label: "AASLD: Management of Acute Liver Failure",
      url: "https://www.aasld.org/practice-guidelines/management-acute-liver-failure"
    },
    {
      key: "acg-h-pylori-2024",
      label: "ACG 2024 H. pylori guideline highlights",
      url: "https://gi.org/wp-content/uploads/2025/01/ACG-Hpylori-Guidelines-Highlights-2024-FINAL.pdf.pdf"
    },
    {
      key: "acg-h-pylori-patient-2025",
      label: "American College of Gastroenterology: About Helicobacter pylori Infection",
      url: "https://webfiles.gi.org/links/patients/ACG_H_pylori_Patient_Infographic_FINAL_2025.pdf",
      note: "Supports active-infection testing, peptic-ulcer and stomach-cancer consequences, test-of-cure follow-up, and the listed upper-GI alarm symptoms."
    },
    {
      key: "acog-fhr-monitoring-2025",
      label: "ACOG Clinical Practice Guideline: Intrapartum Fetal Heart Rate Monitoring (2025)",
      url: "https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2025/10/intrapartum-fetal-heart-rate-monitoring-interpretation-and-management",
      note: "Supports current intrapartum fetal-heart-rate nomenclature, the three-tier category framework, maternal-fetal evaluation, intrauterine resuscitation, escalation, and context-dependent delivery decisions."
    },
    {
      key: "ahrq-nichd-fhr-definitions",
      label: "AHRQ Perinatal Safety: NICHD Electronic Fetal Monitoring Definitions",
      url: "https://www.ahrq.gov/patient-safety/settings/labor-delivery/perinatal-care/modules/strategies/safe-electronic-tool.html",
      note: "Supports the objective baseline, variability, acceleration, deceleration, recurrence, and contraction-frequency definitions used to describe fetal monitoring patterns."
    },
    {
      key: "nhlbi-asthma-action-plan",
      label: "NHLBI Asthma Action Plan",
      url: "https://www.nhlbi.nih.gov/sites/default/files/publications/07-5251.pdf",
      note: "Supports green, yellow, and red peak-flow zones of at least 80%, 50-79%, and below 50% of personal best, interpreted with symptoms and the person's written asthma action plan."
    },
    {
      key: "nhlbi-managing-asthma-schools",
      label: "NHLBI: Managing Asthma - A Guide for Schools",
      url: "https://www.nhlbi.nih.gov/files/docs/resources/lung/NACI_ManagingAsthma-508%20FINAL.pdf",
      note: "Supports the relationship between airway narrowing and falling peak flow, early worsening-asthma detection, effort-dependent technique, three attempts with the highest reading recorded, symptom assessment, and technique review."
    },
    {
      key: "nhlbi-asthma-epr3",
      label: "NHLBI Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma",
      url: "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf",
      note: "Supports using peak-flow meters for monitoring rather than as stand-alone diagnostic tools and interpreting effort- and technique-dependent readings within a comprehensive asthma assessment."
    },
    {
      key: "ani-gi-asge-acg-upper-endoscopy-quality-2025",
      label: "ASGE/ACG: Quality indicators for upper GI endoscopy (2025)",
      url: "https://doi.org/10.1016/j.gie.2024.08.023",
      note: "Supports appropriate upper-GI endoscopy indications, complete examination and documentation, management of important findings, and follow-up as elements of a high-quality EGD."
    },
    {
      key: "ani-gi-asge-egd-adverse-events-2022",
      label: "ASGE: Adverse events associated with EGD and EGD-related techniques (2022)",
      url: "https://www.asge.org/home/resources/publications/guidelines/adverse-events-associated-with-egd-and-egd-related-techniques",
      note: "Supports EGD-specific cardiopulmonary, aspiration, bleeding, perforation, and procedure-related safety surveillance, with risk interpreted in the patient's procedural context."
    },
    {
      key: "ani-gi-niddk-upper-endoscopy-2023",
      label: "NIDDK: Upper GI Endoscopy (reviewed 2023)",
      url: "https://www.niddk.nih.gov/health-information/diagnostic-tests/upper-gi-endoscopy",
      note: "Supports the learner-facing procedure explanation, medicine and transportation planning, biopsy follow-up, and urgent post-EGD warning symptoms."
    },
    {
      key: "ani-gi-asge-acg-colonoscopy-quality-2024",
      label: "ASGE/ACG: Quality indicators for colonoscopy (2024)",
      url: "https://doi.org/10.1016/j.gie.2024.04.2905",
      note: "Supports adequate preparation, complete examination, lesion detection and removal, accurate documentation, and follow-up as core colonoscopy quality elements."
    },
    {
      key: "ani-gi-usmstf-colonoscopy-preparation-2025",
      label: "U.S. Multi-Society Task Force: Optimizing bowel preparation quality for colonoscopy (2025)",
      url: "https://www.asge.org/home/resources/publications/guidelines/optimizing-bowel-preparation-quality-for-colonoscopy--consensus-recommendations-by-the-us-multi-society-task-force-on-colorectal-cancer",
      note: "Supports individualized bowel-preparation selection, written and verbal instructions, medication and comorbidity review, and the definition of preparation adequacy used for surveillance planning."
    },
    {
      key: "ani-gi-niddk-colonoscopy",
      label: "NIDDK: Colonoscopy",
      url: "https://www.niddk.nih.gov/health-information/diagnostic-tests/colonoscopy",
      note: "Supports the learner-facing procedure explanation, polyp and biopsy follow-up, delayed bleeding risk, perforation risk, sedation risk, and urgent post-colonoscopy warning symptoms."
    },
    {
      key: "ani-gi-asge-acg-ercp-quality-2026",
      label: "ASGE/ACG: Quality indicators for ERCP (2026)",
      url: "https://doi.org/10.1016/j.gie.2025.08.032",
      note: "Supports appropriate therapeutic ERCP selection, technical and clinical success, post-ERCP pancreatitis prevention, and tracking clinically meaningful adverse events and reintervention."
    },
    {
      key: "ani-gi-asge-ercp-pancreatitis-prevention-2023",
      label: "ASGE: Post-ERCP pancreatitis prevention strategies (2023)",
      url: "https://www.asge.org/home/resources/publications/guidelines/asge-guideline-on-post-ercp-pancreatitis-prevention-strategies-summary-and-recommendations",
      note: "Supports clinician-directed post-ERCP pancreatitis prevention with rectal NSAIDs such as indomethacin or diclofenac when appropriate, contraindication review, and procedure-specific prevention strategies."
    },
    {
      key: "ani-gi-niddk-ercp-2024",
      label: "NIDDK: Endoscopic Retrograde Cholangiopancreatography (reviewed 2024)",
      url: "https://www.niddk.nih.gov/health-information/diagnostic-tests/endoscopic-retrograde-cholangiopancreatography",
      note: "Supports ERCP's mainly therapeutic role, lower-risk diagnostic alternatives, preparation and pregnancy considerations, biopsy follow-up, and urgent adverse-event symptoms."
    },
    {
      key: "ani-pulmonary-bts-bronchoscopy-safety-2023",
      label: "British Thoracic Society: National safety standards for bronchoscopy and pleural procedures (2023)",
      url: "https://www.brit-thoracic.org.uk/clinical-resources/interventional-procedures/national-safety-standards-for-invasive-procedures-bronchoscopy-and-pleural-procedures/",
      note: "Supports bronchoscopy and EBUS safety checks, consent and procedure verification, physiologic monitoring, specimen handoff, documentation, recovery, and escalation planning."
    },
    {
      key: "ani-pulmonary-nlm-bronchoscopy-bal-2024",
      label: "NIH/NLM MedlinePlus: Bronchoscopy and Bronchoalveolar Lavage (updated 2024)",
      url: "https://medlineplus.gov/lab-tests/bronchoscopy-and-bronchoalveolar-lavage-bal/",
      note: "Supports the learner-facing bronchoscopy explanation, individualized medicine and fasting instructions, sedation and throat recovery, indications, sample follow-up, and bleeding, infection, and pneumothorax risks."
    },
    {
      key: "ani-pulmonary-nhlbi-lung-tests",
      label: "NHLBI: Tests for Lung Disease",
      url: "https://www.nhlbi.nih.gov/health/lung-tests",
      note: "Supports using bronchoscopy to view the airways, collect mucus or tissue, remove blockages, and perform selected treatments, with post-procedure bleeding and fever surveillance."
    },
    {
      key: "ani-pulmonary-chest-ebus-tbna-specimens-2025",
      label: "CHEST: Acquisition and Handling of EBUS-TBNA Samples (2025; online 2024)",
      url: "https://doi.org/10.1016/j.chest.2024.08.056",
      note: "Supports EBUS-TBNA specimen acquisition and processing, adequacy assessment, tissue preservation, and planning for cytology, histology, and ancillary testing."
    },
    {
      key: "ani-pulmonary-ers-esge-ests-endosonography-2026",
      label: "ERS/ESGE/ESTS: Endobronchial and esophageal endosonography for lung-cancer diagnosis and staging (2026)",
      url: "https://doi.org/10.1183/13993003.00097-2026",
      note: "Supports linear EBUS-TBNA for nodal tissue diagnosis and staging, systematic versus targeted assessment, and context-dependent follow-up when sampling is negative or nondiagnostic."
    },
    {
      key: "ani-pulmonary-chest-radial-ebus-lung-cancer-diagnosis-2013",
      label: "CHEST/ACCP: Establishing the Diagnosis of Lung Cancer (3rd ed., 2013)",
      url: "https://doi.org/10.1378/chest.12-2353",
      note: "Supports radial EBUS as an adjunct imaging modality that localizes peripheral lung nodules for bronchoscopic sampling, with the sampling instrument used after target localization."
    },
    {
      key: "ani-pleural-bts-pleural-procedures-2023",
      label: "British Thoracic Society Clinical Statement on Pleural Procedures (2023)",
      url: "https://thorax.bmj.com/content/78/Suppl_3/s43",
      note: "Supports adult thoracic-ultrasound use, slow manual or gravity pleural aspiration, symptom-based stopping, general drainage-volume guidance with expert exceptions, complication monitoring, and selective rather than routine postprocedure chest radiography."
    },
    {
      key: "ani-pleural-shm-thoracentesis-ultrasound-2018",
      label: "Society of Hospital Medicine: Ultrasound Guidance for Adult Thoracentesis (2018)",
      url: "https://doi.org/10.12788/jhm.2940",
      note: "Supports ultrasound assessment of thoracic anatomy and fluid, avoiding position change after site marking, postprocedure lung-sliding assessment, and omitting routine chest radiography after a successful ultrasound-guided procedure in an asymptomatic patient with normal lung sliding."
    },
    {
      key: "ani-pleural-bts-pleural-disease-2023",
      label: "British Thoracic Society Guideline for Pleural Disease (2023)",
      url: "https://thorax.bmj.com/content/78/Suppl_3/s1",
      note: "Supports Light's exudate-classification criteria, the adult suspected-parapneumonic-effusion pH and LDH pathway with correct sample handling, and further investigation when pleural-fluid cytology is negative but malignancy remains suspected."
    },
    {
      key: "ani-ascites-shm-paracentesis-ultrasound-2019",
      label: "Society of Hospital Medicine: Ultrasound Guidance for Adult Abdominal Paracentesis (2019)",
      url: "https://doi.org/10.12788/jhm.3095",
      note: "Supports ultrasound confirmation and site selection, multi-plane organ clearance, color-flow Doppler assessment for abdominal-wall vessels, stable positioning after marking, and real-time guidance for small or difficult fluid collections."
    },
    {
      key: "ani-ascites-aasld-guidance-2021",
      label: "AASLD: Diagnosis, Evaluation, and Management of Ascites, SBP, and HRS (2021)",
      url: "https://doi.org/10.1002/hep.31884",
      note: "Supports diagnostic paracentesis and ascitic-fluid testing in cirrhosis, serum-ascites albumin gradient interpretation, neutrophil and culture evaluation for spontaneous bacterial peritonitis, cirrhosis-specific coagulation nuance, and albumin replacement after large-volume paracentesis."
    }
  ];

  const KIND_META = {
    lab: {
      icon: "LAB",
      before: "Verify timing, specimen type, anticoagulant/medication effects, fasting status when relevant, and whether a trend is more important than one isolated value.",
      nursing: "Trend the result with symptoms, vital signs, assessment findings, medications, and baseline history. Escalate critical or rapidly changing values.",
      redFlags: "Critical values, sharp trend changes, results that do not fit the client's condition, specimen contamination, or a result that requires immediate treatment.",
      trap: "NCLEX rarely tests a number by itself. Connect the lab to the client, the trend, and the safest nursing action."
    },
    imaging: {
      icon: "IMG",
      before: "Screen for pregnancy when applicable, contrast allergy, kidney risk if contrast may be used, metal/implant restrictions for MRI, and ability to lie still.",
      nursing: "Explain the procedure, protect safety during transport, monitor after contrast or sedation if used, and act on urgent findings instead of waiting passively.",
      redFlags: "Airway symptoms after contrast, new neuro change, unstable vital signs, severe pain, bleeding, or imaging results that suggest hemorrhage, obstruction, embolus, or ischemia.",
      trap: "The test does not replace assessment. A stable-looking image order can still become urgent if the client deteriorates."
    },
    procedure: {
      icon: "PROC",
      before: "Verify consent when required, allergies, NPO/sedation needs, anticoagulant/bleeding risks, baseline vitals, and what monitoring is needed after the procedure.",
      nursing: "Prepare the client, maintain safety/sterility, monitor the correct body system afterward, and report complications early.",
      redFlags: "Bleeding, infection, severe pain, respiratory distress, neuro change, perforation signs, abnormal drainage, fever, or unstable vital signs.",
      trap: "NCLEX loves before-and-after nursing priorities: consent/prep before, then complication surveillance after."
    },
    culture: {
      icon: "ID",
      before: "Collect the correct specimen from the correct source, use sterile technique when required, label site/time, and obtain cultures before antimicrobials when it will not dangerously delay treatment.",
      nursing: "Prevent contamination, send the specimen promptly, and connect results to isolation, antibiotic stewardship, and clinical deterioration.",
      redFlags: "Positive blood or CSF culture, sepsis cues, worsening fever, hypotension, mental status change, or a contaminated specimen that could mislead therapy.",
      trap: "Do not delay life-saving antibiotics too long for a perfect specimen in an unstable client."
    },
    cardiac: {
      icon: "CV",
      before: "Assess chest pain, perfusion, rhythm, oxygenation, allergies, anticoagulant status, kidney function if contrast is possible, and baseline vital signs.",
      nursing: "Connect cardiac test results to perfusion, ischemia, dysrhythmia, heart failure, and immediate safety priorities.",
      redFlags: "Chest pain with ECG changes, rising cardiac biomarkers, unstable dysrhythmia, hypotension, syncope, pulmonary edema, or post-procedure bleeding.",
      trap: "Treat the client and the trend, not one pretty tracing or one isolated number."
    },
    pulmonary: {
      icon: "RESP",
      before: "Assess oxygenation, respiratory effort, bronchodilator/steroid use, anticoagulants if invasive, and whether the client can cooperate with the test.",
      nursing: "Monitor airway, breathing, oxygenation, cough, bleeding risk, and tolerance before and after respiratory testing.",
      redFlags: "Hypoxemia, respiratory distress, hemoptysis, absent breath sounds, pneumothorax signs, or severe bronchospasm.",
      trap: "Airway and oxygenation come before completing a diagnostic plan."
    },
    ob: {
      icon: "OB",
      before: "Confirm gestational age, fetal/maternal baseline status, Rh status when invasive testing is involved, and whether the client is having bleeding, contractions, or ruptured membranes.",
      nursing: "Monitor maternal vital signs, fetal status when indicated, uterine activity, bleeding, fluid leakage, infection cues, and decreased fetal movement.",
      redFlags: "Decreased fetal movement, nonreassuring fetal tracing, bleeding, leaking fluid, fever, severe abdominal pain, contractions after an invasive procedure, or hypertensive warning signs.",
      trap: "Gestational age changes what is expected and what is dangerous."
    },
    neuro: {
      icon: "NEURO",
      before: "Assess baseline neurologic status, seizure precautions when needed, bleeding/anticoagulant risk for invasive procedures, and MRI metal/implant restrictions.",
      nursing: "Trend neuro checks, level of consciousness, pupils, motor/sensory findings, headache, seizure activity, and procedure-site complications.",
      redFlags: "Acute neuro deficit, seizure, decreased level of consciousness, sudden severe headache, signs of increased ICP, or CSF leak/meningitis symptoms.",
      trap: "A small neurologic change can be the whole emergency."
    },
    endocrine: {
      icon: "ENDO",
      before: "Check timing, fasting status, current endocrine medications, steroid use, pregnancy status when relevant, and whether dynamic testing requires serial specimens.",
      nursing: "Connect the result to symptoms, glucose safety, thyroid/adrenal crisis risk, and medication teaching.",
      redFlags: "Severe hypoglycemia/hyperglycemia, thyroid storm/myxedema cues, adrenal crisis, altered mental status, dehydration, or unstable vital signs.",
      trap: "Endocrine tests often require correct timing. Wrong timing can make the result misleading."
    },
    screening: {
      icon: "SCRN",
      before: "Confirm the purpose of screening, age/risk eligibility, prep requirements, and whether abnormal results require diagnostic confirmation.",
      nursing: "Teach that screening estimates risk; it does not always diagnose. Promote follow-up and reduce fear with clear next steps.",
      redFlags: "Positive screening with symptoms, high-risk history, severe abnormality, or failure to follow up on a positive result.",
      trap: "Do not treat a screen as a final diagnosis unless the test is designed and interpreted that way."
    },
    eyeEar: {
      icon: "EYE",
      before: "Check baseline vision/hearing concerns, pain, drainage, injury, diabetes/hypertension history, and whether drops or equipment affect testing.",
      nursing: "Protect safety, explain simple cooperation steps, and connect abnormal findings to falls, infection, pressure, or neuro concerns.",
      redFlags: "Sudden vision/hearing loss, eye pain, trauma, very high intraocular pressure, neurologic deficits, or infection signs.",
      trap: "Eye and ear findings can be neurologic or safety problems, not just comfort issues."
    },
    nuclear: {
      icon: "NUC",
      before: "Screen pregnancy/breastfeeding status, allergies, kidney concerns if contrast is paired, and ability to remain still for scan timing.",
      nursing: "Teach that a small tracer may be used, encourage ordered hydration after some studies, and monitor for delayed or unexpected symptoms.",
      redFlags: "Unstable symptoms during testing, severe pain, allergic symptoms, or results suggesting embolus, obstruction, ischemia, or metastatic disease.",
      trap: "Nuclear studies often show function, not just anatomy. Match the test to the clinical question."
    }
  };

  const FULL_FORM_OVERRIDES = {
    "12-lead ECG": "12-lead electrocardiogram",
    ABG: "arterial blood gas",
    "ABG sampling": "arterial blood gas sampling",
    AFB: "acid-fast bacilli",
    "AFB smear": "acid-fast bacilli smear",
    ABI: "ankle-brachial index",
    ACTH: "adrenocorticotropic hormone",
    "ACTH stimulation": "adrenocorticotropic hormone stimulation test",
    AFP: "alpha-fetoprotein",
    ANA: "antinuclear antibody",
    ANCA: "antineutrophil cytoplasmic antibody",
    BPP: "biophysical profile",
    BAL: "bronchoalveolar lavage",
    BNP: "B-type natriuretic peptide",
    "BNP/NT-proBNP": "B-type natriuretic peptide / N-terminal pro-B-type natriuretic peptide",
    CABG: "coronary artery bypass grafting",
    "CA-125": "cancer antigen 125",
    "CA19-9": "cancer antigen 19-9",
    CCTA: "coronary computed tomography angiography",
    CBC: "complete blood count",
    CEA: "carcinoembryonic antigen",
    "CK-MB": "creatine kinase MB",
    CRP: "C-reactive protein",
    CSF: "cerebrospinal fluid",
    "CSF analysis": "cerebrospinal fluid analysis",
    CST: "contraction stress test",
    CT: "computed tomography",
    "CT head": "computed tomography head scan",
    "CT abdomen": "computed tomography abdomen scan",
    "CT pulmonary angiography": "computed tomography pulmonary angiography",
    CTA: "computed tomography angiography",
    CTPA: "computed tomography pulmonary angiography",
    CVS: "chorionic villus sampling",
    CXR: "chest x-ray",
    DEXA: "dual-energy x-ray absorptiometry",
    DLCO: "diffusing capacity of the lungs for carbon monoxide",
    ECG: "electrocardiogram",
    EBUS: "endobronchial ultrasound",
    EEG: "electroencephalogram",
    EGD: "esophagogastroduodenoscopy",
    EKG: "electrocardiogram",
    EMG: "electromyography",
    ENG: "electronystagmography",
    EP: "electrophysiology",
    ERCP: "endoscopic retrograde cholangiopancreatography",
    ESR: "erythrocyte sedimentation rate",
    EUS: "endoscopic ultrasound",
    FeNO: "fractional exhaled nitric oxide",
    FFR: "fractional flow reserve",
    FIT: "fecal immunochemical test",
    FOBT: "fecal occult blood test",
    GBS: "group B Streptococcus screening",
    HER2: "human epidermal growth factor receptor 2",
    HIDA: "hepatobiliary iminodiacetic acid scan",
    ICD: "implantable cardioverter-defibrillator",
    IGRA: "interferon-gamma release assay",
    ICP: "intracranial pressure",
    INR: "international normalized ratio",
    IVUS: "intravascular ultrasound",
    KUB: "kidney, ureter, and bladder abdominal x-ray",
    LFTs: "liver function tests",
    LP: "lumbar puncture",
    MRI: "magnetic resonance imaging",
    MRCP: "magnetic resonance cholangiopancreatography",
    MSI: "microsatellite instability",
    NAAT: "nucleic acid amplification test",
    NCS: "nerve conduction study",
    NGS: "next-generation sequencing",
    NST: "nonstress test",
    OCT: "optical coherence tomography",
    OGTT: "oral glucose tolerance test",
    "Ova & parasites": "ova and parasites",
    "Ova and parasites": "ova and parasites",
    PA: "pulmonary artery",
    PCR: "polymerase chain reaction",
    PCI: "percutaneous coronary intervention",
    "PD-L1": "programmed death-ligand 1",
    PET: "positron emission tomography",
    "PET/CT": "positron emission tomography / computed tomography",
    "PET/CT fusion imaging": "positron emission tomography / computed tomography fusion imaging",
    PFT: "pulmonary function test",
    PFTs: "pulmonary function tests",
    PKU: "phenylketonuria",
    PPD: "purified protein derivative tuberculin skin test",
    PSA: "prostate-specific antigen",
    PT: "prothrombin time",
    PVR: "postvoid residual",
    SPECT: "single-photon emission computed tomography",
    "SPECT/CT": "single-photon emission computed tomography / computed tomography",
    TBI: "toe-brachial index",
    TCD: "transcranial Doppler",
    TEE: "transesophageal echocardiogram",
    TSH: "thyroid-stimulating hormone",
    TTE: "transthoracic echocardiogram",
    UGI: "upper gastrointestinal series",
    VEP: "visual evoked potential",
    VFA: "vertebral fracture assessment",
    VNG: "videonystagmography",
    "V/Q scan": "ventilation/perfusion scan"
  };

  function fullFormForName(name = "") {
    const cleanName = normalizeName(name);
    if (!cleanName) return "";
    if (FULL_FORM_OVERRIDES[cleanName]) return FULL_FORM_OVERRIDES[cleanName];
    const parenMatch = cleanName.match(/\(([A-Za-z0-9/-]+)\)/);
    if (parenMatch && FULL_FORM_OVERRIDES[parenMatch[1]]) return FULL_FORM_OVERRIDES[parenMatch[1]];
    const firstToken = cleanName.split(/[\s/(]/)[0];
    return FULL_FORM_OVERRIDES[firstToken] || "";
  }

  function displayNameForEntry(name = "", fullForm = "") {
    const cleanName = normalizeName(name);
    const cleanFullForm = normalizeName(fullForm);
    if (!cleanName || !cleanFullForm) return cleanName;
    if (cleanName.toLowerCase().includes(cleanFullForm.toLowerCase())) return cleanName;
    return `${cleanName} (${cleanFullForm})`;
  }

  const TOOLS = [
    ["Toxicity and antidote reversal pairs", "procedure", "Toxicology", "High-yield NCLEX toxicity and overdose reference that matches common medication or poison exposures with reversal drugs and first-line safety actions.", ["antidotes", "antidote list", "reversal drugs", "overdose antidotes", "toxicity antidotes", "nclex antidotes", "poisoning antidotes", "magnesium antidote", "calcium gluconate antidote", "opioid antidote", "naloxone", "narcan", "benzodiazepine antidote", "flumazenil", "heparin antidote", "protamine sulfate", "warfarin antidote", "vitamin k", "digoxin antidote", "digoxin immune fab", "acetaminophen antidote", "n acetylcysteine", "nac", "iron antidote", "deferoxamine", "organophosphate antidote", "atropine pralidoxime", "methanol antidote", "ethylene glycol antidote", "fomepizole", "isoniazid antidote", "pyridoxine", "beta blocker antidote", "glucagon", "calcium channel blocker antidote", "tca antidote", "sodium bicarbonate"]],
    ["Troponin I/T", "cardiac", "Cardiovascular", "Detects myocardial injury; rising/falling pattern supports acute coronary syndrome when symptoms and ECG fit.", ["troponin", "troponin i", "troponin t", "cardiac troponin"]],
    ["CK-MB", "cardiac", "Cardiovascular", "Older cardiac enzyme sometimes used to evaluate reinfarction or myocardial injury trends.", ["creatine kinase mb", "ck mb"]],
    ["BNP/NT-proBNP", "lab", "Cardiovascular", "Supports heart-failure evaluation by reflecting ventricular stretch and volume/pressure overload.", ["BNP", "NT-proBNP", "b type natriuretic peptide", "brain natriuretic peptide"]],
    ["Myoglobin", "lab", "Cardiovascular", "Early but nonspecific muscle injury marker; not definitive for MI because skeletal muscle injury also raises it.", ["serum myoglobin"]],
    ["D-dimer", "lab", "Cardiovascular", "Helps rule out clotting disorders such as PE/DVT in low-risk clients; positive is nonspecific.", ["d dimer", "fibrin degradation product"]],
    ["Lipid panel", "lab", "Cardiovascular", "Evaluates ASCVD risk by measuring cholesterol fractions and triglycerides.", ["cholesterol panel", "LDL", "HDL", "triglycerides"]],
    ["Homocysteine", "lab", "Cardiovascular", "Selected vascular-risk marker influenced by folate/B12 metabolism; not a stand-alone diagnosis.", ["serum homocysteine"]],
    ["Chest X-ray", "imaging", "Cardiovascular", "Screens heart size, lung fluid, pneumonia, tubes/lines, and acute chest findings.", ["CXR", "chest radiograph"]],
    ["Echocardiogram (TTE)", "cardiac", "Cardiovascular", "Ultrasound of the heart that evaluates valves, ejection fraction, wall motion, and pericardial fluid.", ["TTE", "transthoracic echocardiogram", "echo"]],
    ["Transesophageal echocardiogram (TEE)", "procedure", "Cardiovascular", "Esophageal ultrasound view of the heart used for valves, thrombus, endocarditis, and detailed cardiac structures.", ["TEE", "transesophageal echo"]],
    ["Cardiac CT", "imaging", "Cardiovascular", "CT-based cardiac imaging used for anatomy, coronary calcification/CTA, or structural assessment.", ["coronary CT", "cardiac computed tomography"]],
    ["Cardiac MRI", "imaging", "Cardiovascular", "Detailed cardiac structure/function imaging, useful for myocarditis, cardiomyopathy, viability, and scar patterns.", ["heart MRI", "cardiac magnetic resonance"]],
    ["12-lead ECG", "cardiac", "Cardiovascular", "Records cardiac electrical activity from 12 views to identify ischemia, rhythm, conduction, chamber, and electrolyte clues.", ["ECG", "EKG", "electrocardiogram", "12 lead"]],
    ["Holter monitor", "cardiac", "Cardiovascular", "Continuous ambulatory ECG monitoring, usually 24-48 hours, for intermittent rhythm symptoms.", ["ambulatory ECG", "24 hour monitor"]],
    ["Ambulatory blood pressure monitoring", "cardiac", "Cardiovascular", "Portable out-of-office blood pressure monitoring over 12-24 hours to confirm hypertension patterns and detect white-coat, masked, or nocturnal hypertension.", ["ABPM", "24 hour blood pressure monitor", "ambulatory BP monitoring", "ambulatory blood pressure monitor"]],
    ["Event monitor", "cardiac", "Cardiovascular", "Longer ambulatory rhythm monitoring triggered by symptoms or automatic rhythm detection.", ["cardiac event recorder"]],
    ["Stress ECG", "cardiac", "Cardiovascular", "Assesses cardiac response to exercise or medication stress for ischemia or exertional symptoms.", ["stress test", "exercise stress test"]],
    ["Cardiac catheterization", "procedure", "Cardiovascular", "Invasive catheter procedure to evaluate coronary arteries, pressures, oxygenation, and interventions.", ["heart cath", "cardiac cath"]],
    ["Coronary angiography", "procedure", "Cardiovascular", "Contrast visualization of coronary arteries to identify stenosis, blockage, or anatomy.", ["coronary angiogram"]],
    ["PCI", "procedure", "Cardiovascular", "Percutaneous coronary intervention opens narrowed or blocked coronary arteries, commonly with balloon angioplasty and/or stent placement.", ["percutaneous coronary intervention", "angioplasty", "coronary angioplasty", "cardiac stent", "coronary stent"]],
    ["CABG", "procedure", "Cardiovascular", "Coronary artery bypass grafting is open-heart surgical revascularization that routes blood around blocked coronary arteries using graft vessels.", ["coronary artery bypass grafting", "coronary artery bypass surgery", "heart bypass surgery", "bypass surgery", "open heart bypass", "coronary bypass"]],
    ["Pacemaker insertion", "procedure", "Cardiovascular", "Implants a device that provides electrical pacing when the heart rate or conduction system cannot maintain adequate rhythm and perfusion.", ["pacemaker placement", "cardiac pacemaker", "permanent pacemaker", "temporary pacemaker"]],
    ["ICD insertion", "procedure", "Cardiovascular", "Implants a defibrillator device that detects and treats life-threatening ventricular dysrhythmias.", ["implantable cardioverter defibrillator", "implantable cardioverter-defibrillator", "ICD placement", "AICD"]],
    ["Cardioversion", "procedure", "Cardiovascular", "Delivers synchronized electrical energy to convert selected unstable or persistent tachydysrhythmias while timing the shock with the cardiac cycle.", ["synchronized cardioversion"]],
    ["Defibrillation", "procedure", "Cardiovascular", "Delivers unsynchronized electrical energy for pulseless ventricular tachycardia or ventricular fibrillation.", ["defib", "unsynchronized shock"]],
    ["Electrophysiology study", "procedure", "Cardiovascular", "Invasive rhythm mapping used to diagnose and treat dysrhythmia pathways.", ["EP study"]],
    ["Swan-Ganz catheter", "procedure", "Cardiovascular", "Pulmonary artery catheter used in selected critical-care clients to measure hemodynamics.", ["pulmonary artery catheter", "PA catheter"]],

    ["Chest CT", "imaging", "Respiratory", "Detailed chest imaging for masses, trauma, pneumonia complications, nodules, and pulmonary disease.", ["CT chest"]],
    ["CT pulmonary angiography", "imaging", "Respiratory", "Contrast CT study used to evaluate pulmonary embolism.", ["CTPA", "CTA chest", "PE protocol CT"]],
    ["MRI chest", "imaging", "Respiratory", "MRI chest imaging for selected soft-tissue, vascular, or tumor questions when MRI is appropriate.", ["chest MRI"]],
    ["V/Q scan", "nuclear", "Respiratory", "Ventilation/perfusion nuclear scan used to evaluate mismatch patterns such as pulmonary embolism.", ["ventilation perfusion scan", "VQ scan"]],
    ["Pulmonary Function Tests", "pulmonary", "Respiratory", "Measures airflow, lung volumes, and gas exchange patterns for obstructive/restrictive disease.", ["PFT", "PFTs", "spirometry"]],
    ["Peak Flow", "pulmonary", "Respiratory", "Quick asthma-control measurement compared with personal best.", ["peak expiratory flow", "peak flow meter"]],
    ["Bronchoscopy", "procedure", "Respiratory", "Endoscopic airway exam for visualization, biopsy, lavage, secretion removal, or foreign body evaluation.", ["bronch"]],
    ["Laryngoscopy", "procedure", "Respiratory", "Visualizes the larynx/vocal cords for airway, voice, trauma, tumor, or obstruction concerns.", ["laryngeal scope"]],
    ["Sleep study", "pulmonary", "Respiratory", "Monitors sleep, breathing, oxygenation, and movement to diagnose sleep apnea and sleep disorders.", ["polysomnography"]],
    ["ABG", "pulmonary", "Respiratory", "Arterial blood gas measures pH, PaCO2, PaO2, bicarbonate, and oxygenation/ventilation status.", ["arterial blood gas"]],
    ["Sputum culture", "culture", "Respiratory", "Identifies respiratory organisms and antibiotic susceptibility when lower respiratory infection is suspected.", ["respiratory culture"]],
    ["Gram stain", "culture", "Respiratory", "Rapid stain that gives preliminary organism type and specimen quality clues.", ["gram stain sputum"]],
    ["AFB smear", "culture", "Respiratory", "Acid-fast bacilli smear helps evaluate tuberculosis and other mycobacteria.", ["acid fast bacilli", "TB smear"]],
    ["PPD", "screening", "Respiratory", "Tuberculin skin test screen read by induration at 48-72 hours.", ["tuberculin skin test", "Mantoux"]],
    ["IGRA", "screening", "Respiratory", "Blood test screen for TB infection that measures immune response to TB antigens.", ["interferon gamma release assay", "QuantiFERON", "T spot"]],
    ["Thoracentesis", "procedure", "Respiratory", "Needle removal of pleural fluid or air for diagnosis or symptom relief.", ["pleural tap", "pleural fluid aspiration"]],

    ["FOBT", "screening", "GI", "Stool blood screen that can suggest GI bleeding and colorectal cancer risk.", ["fecal occult blood test", "occult blood test", "stool occult blood test", "stool blood test", "fecal blood test"]],
    ["FIT", "screening", "GI", "Immunochemical stool blood test used for colorectal cancer screening.", ["fecal immunochemical test", "stool immunochemical test"]],
    ["Stool culture", "culture", "GI", "Identifies bacterial causes of infectious diarrhea.", ["fecal culture"]],
    ["Ova & parasites", "culture", "GI", "Examines stool for parasites/ova when exposure, travel, or persistent diarrhea suggests parasitic infection.", ["O and P", "ova and parasites"]],
    ["Fecal leukocytes", "lab", "GI", "Stool inflammatory marker suggesting invasive/inflammatory diarrhea.", ["stool leukocytes"]],
    ["C. difficile toxin", "lab", "GI", "Tests stool for C. difficile toxin/organism when antibiotic-associated or healthcare-associated diarrhea is suspected.", ["c diff toxin test", "c difficile toxin assay", "clostridioides difficile toxin assay"]],
    ["Fecal fat", "lab", "GI", "Screens for fat malabsorption/steatorrhea.", ["stool fat"]],
    ["Stool elastase", "lab", "GI", "Evaluates pancreatic exocrine insufficiency.", ["fecal elastase"]],
    ["EGD", "procedure", "GI", "Upper endoscopy visualizes esophagus, stomach, and duodenum for bleeding, ulcers, varices, strictures, or biopsy.", ["upper endoscopy", "esophagogastroduodenoscopy"]],
    ["Colonoscopy", "procedure", "GI", "Endoscopic colon exam for screening, bleeding, inflammation, polyps, or biopsy.", ["colon scope"]],
    ["Sigmoidoscopy", "procedure", "GI", "Endoscopic exam of rectum/sigmoid colon for distal colon disease.", ["flex sig"]],
    ["Capsule endoscopy", "procedure", "GI", "Swallowed camera used to visualize small bowel bleeding or disease.", ["pill camera"]],
    ["Endoscopic ultrasound", "procedure", "GI", "Endoscopy with ultrasound for GI wall, pancreas, biliary, and lymph node evaluation.", ["EUS"]],
    ["Barium swallow", "imaging", "GI", "Contrast swallow study assessing esophagus and swallowing/stricture patterns.", ["esophagram"]],
    ["Upper GI series", "imaging", "GI", "Fluoroscopic contrast study of upper GI anatomy and function.", ["UGI"]],
    ["Barium enema", "imaging", "GI", "Contrast study of colon anatomy, now less common than colonoscopy/CT.", ["lower GI series"]],
    ["Abdominal X-ray", "imaging", "GI", "Plain film used for obstruction patterns, constipation burden, free air clues, or tube position.", ["KUB abdomen", "abd xray"]],
    ["Ultrasound", "imaging", "GI", "Sound-wave imaging often used for gallbladder, liver, ascites, pregnancy, kidney, and pelvic structures.", ["sonogram"]],
    ["CT abdomen", "imaging", "GI", "Detailed abdominal imaging for appendicitis, obstruction, bleeding, infection, trauma, or mass.", ["abdominal CT"]],
    ["MRI abdomen", "imaging", "GI", "Detailed soft-tissue abdominal imaging for liver, pancreas, biliary, pelvic, or tumor questions.", ["abdominal MRI"]],
    ["ERCP", "procedure", "GI", "Endoscopic retrograde cholangiopancreatography evaluates/treats biliary and pancreatic duct problems.", ["endoscopic retrograde cholangiopancreatography"]],
    ["MRCP", "imaging", "GI", "MRI-based cholangiopancreatography evaluates bile and pancreatic ducts noninvasively.", ["magnetic resonance cholangiopancreatography"]],
    ["Esophageal manometry", "procedure", "GI", "Measures esophageal motility and sphincter pressure.", ["manometry"]],
    ["Gastric emptying study", "nuclear", "GI", "Measures stomach emptying over time, often for gastroparesis.", ["gastric emptying scan"]],
    ["H. pylori breath/stool tests", "lab", "GI", "Detects active Helicobacter pylori infection linked to ulcers and gastritis.", ["h pylori testing", "urea breath test"]],
    ["LFTs", "lab", "GI", "Liver function/injury panel including AST, ALT, bilirubin, alkaline phosphatase, albumin, and coagulation context.", ["liver function tests", "AST", "ALT"]],
    ["Amylase", "lab", "GI", "Pancreatic/salivary enzyme; can rise in pancreatitis but is less specific than lipase.", ["serum amylase"]],
    ["Lipase", "lab", "GI", "Pancreatic enzyme often more specific for pancreatitis than amylase.", ["serum lipase"]],

    ["CT head", "neuro", "Neurology", "Rapid head imaging for bleed, stroke triage, trauma, mass effect, and acute neurologic change.", ["head CT", "brain CT"]],
    ["MRI brain", "neuro", "Neurology", "Detailed brain imaging for stroke, tumor, demyelination, infection, seizure focus, and soft-tissue detail.", ["brain MRI"]],
    ["Cerebral angiography", "procedure", "Neurology", "Contrast vessel imaging of cerebral circulation for aneurysm, stenosis, AVM, or intervention planning.", ["brain angiogram"]],
    ["EEG", "neuro", "Neurology", "Records brain electrical activity to evaluate seizures and selected altered mental status patterns.", ["electroencephalogram"]],
    ["EMG", "neuro", "Neurology", "Measures muscle electrical activity to evaluate neuromuscular disorders.", ["electromyography"]],
    ["Nerve conduction study", "neuro", "Neurology", "Measures peripheral nerve signal speed/strength for neuropathy or nerve injury.", ["NCS"]],
    ["Evoked potentials", "neuro", "Neurology", "Measures nervous-system electrical response to sensory stimulation.", ["evoked response"]],
    ["Cranial nerve assessment", "neuro", "Neurology", "Bedside neurologic assessment of cranial nerves I-XII to screen smell, vision, pupils, eye movement, facial sensation/movement, hearing, swallowing, voice, shoulder strength, and tongue movement.", ["cranial nerves", "cranial nerve exam", "cranial nerve test", "cranial nerve testing", "CN exam", "CN assessment", "CN I", "CN 1", "olfactory nerve", "CN II", "CN 2", "optic nerve", "CN III", "CN 3", "oculomotor nerve", "CN IV", "CN 4", "trochlear nerve", "CN V", "CN 5", "trigeminal nerve", "CN VI", "CN 6", "abducens nerve", "abducent nerve", "CN VII", "CN 7", "facial nerve", "CN VIII", "CN 8", "vestibulocochlear nerve", "acoustic nerve", "CN IX", "CN 9", "glossopharyngeal nerve", "CN X", "CN 10", "vagus nerve", "CN XI", "CN 11", "spinal accessory nerve", "accessory nerve", "CN XII", "CN 12", "hypoglossal nerve", "extraocular movements", "EOM", "gag reflex", "corneal reflex", "swallow assessment", "tongue deviation", "facial droop"]],
    ["Glasgow Coma Scale", "neuro", "Neurology", "Bedside neurologic scoring system that trends level of consciousness using eye opening, verbal response, and motor response.", ["GCS", "GCS score", "GCS scale", "Glasgow coma score", "coma scale", "neuro score", "neurologic score", "head injury score", "traumatic brain injury score", "EVM score", "eye verbal motor", "pediatric Glasgow coma scale", "modified Glasgow coma scale"]],
    ["Lumbar puncture", "procedure", "Neurology", "Samples CSF for infection, bleeding, inflammation, malignancy, or pressure evaluation.", ["LP", "spinal tap"]],
    ["ICP monitoring", "neuro", "Neurology", "Measures intracranial pressure in selected neurocritical clients.", ["intracranial pressure monitoring"]],

    ["HbA1c", "endocrine", "Endocrine", "Reflects approximate average blood glucose over about 2-3 months.", ["A1c", "hemoglobin A1c", "glycated hemoglobin"]],
    ["OGTT", "endocrine", "Endocrine", "Oral glucose tolerance test evaluates glucose handling, including gestational diabetes workup.", ["oral glucose tolerance test"]],
    ["Fasting glucose", "endocrine", "Endocrine", "Measures blood glucose after fasting to screen/diagnose diabetes patterns.", ["fasting blood sugar", "FBS"]],
    ["Random glucose", "endocrine", "Endocrine", "Measures glucose at any time, useful when symptoms suggest hyperglycemia or hypoglycemia.", ["random blood sugar", "RBS"]],
    ["TSH", "endocrine", "Endocrine", "Pituitary thyroid-stimulating hormone; primary screening anchor for thyroid function.", ["thyroid stimulating hormone"]],
    ["Free T4", "endocrine", "Endocrine", "Active thyroxine level used with TSH to evaluate thyroid function.", ["FT4", "free thyroxine"]],
    ["Free T3", "endocrine", "Endocrine", "Triiodothyronine level, often relevant in hyperthyroid evaluation.", ["FT3", "free triiodothyronine"]],
    ["Thyroid scan", "nuclear", "Endocrine", "Nuclear scan showing thyroid activity/nodules.", ["thyroid scintigraphy"]],
    ["Thyroid ultrasound", "imaging", "Endocrine", "Ultrasound to evaluate thyroid nodules, cysts, and gland structure.", ["thyroid sonogram"]],
    ["Radioactive iodine uptake", "nuclear", "Endocrine", "Measures iodine uptake to help distinguish causes of hyperthyroidism.", ["RAIU"]],
    ["ACTH stimulation", "endocrine", "Endocrine", "Dynamic test assessing adrenal cortisol response to ACTH.", ["cosyntropin stimulation test"]],
    ["Dexamethasone suppression", "endocrine", "Endocrine", "Dynamic cortisol suppression test used in Cushing syndrome evaluation.", ["dex suppression test"]],
    ["24-hour urine cortisol", "endocrine", "Endocrine", "Measures free cortisol excretion over 24 hours for Cushing syndrome evaluation.", ["urine free cortisol"]],

    ["Urinalysis", "lab", "Renal/Urologic", "Screens urine for infection, hydration, glucose/ketones, blood, protein, and renal clues.", ["UA"]],
    ["Urine culture", "culture", "Renal/Urologic", "Identifies urinary organisms and sensitivities when UTI is suspected.", ["urine C and S", "urine culture and sensitivity"]],
    ["Specific gravity", "lab", "Renal/Urologic", "Measures urine concentration and hydration/renal concentrating ability.", ["urine specific gravity", "USG"]],
    ["Creatinine clearance", "lab", "Renal/Urologic", "Estimates kidney filtration using timed urine and serum creatinine.", ["CrCl"]],
    ["24-hour urine", "lab", "Renal/Urologic", "Timed urine collection used for protein, creatinine clearance, hormones, electrolytes, or other quantified excretion.", ["24 hr urine"]],
    ["Microalbumin", "lab", "Renal/Urologic", "Detects early albuminuria, especially in diabetes or hypertension kidney risk.", ["urine albumin", "albumin creatinine ratio"]],
    ["Urine protein", "lab", "Renal/Urologic", "Detects proteinuria in kidney disease and pregnancy hypertensive disorders.", ["proteinuria"]],
    ["Renal ultrasound", "imaging", "Renal/Urologic", "Evaluates kidney size, obstruction, hydronephrosis, stones, masses, and bladder residual context.", ["kidney ultrasound"]],
    ["KUB", "imaging", "Renal/Urologic", "Abdominal x-ray of kidneys/ureters/bladder for stones, obstruction clues, or tube placement.", ["kidney ureter bladder xray"]],
    ["IV pyelogram", "imaging", "Renal/Urologic", "Contrast x-ray study of urinary tract; less common now but still a test concept.", ["IVP", "intravenous pyelogram"]],
    ["CT urogram", "imaging", "Renal/Urologic", "CT contrast evaluation of kidneys, ureters, and bladder.", ["urogram CT"]],
    ["Cystoscopy", "procedure", "Renal/Urologic", "Endoscopic bladder/urethra visualization for bleeding, tumors, stones, strictures, or biopsy.", ["bladder scope"]],
    ["Urodynamics", "procedure", "Renal/Urologic", "Tests bladder storage/emptying pressures and flow for incontinence or retention problems.", ["urodynamic testing"]],
    ["Bladder scan", "procedure", "Renal/Urologic", "Bedside ultrasound estimate of bladder volume and post-void residual.", ["post void residual", "PVR"]],

    ["CBC", "lab", "Hematology", "Complete blood count evaluates WBC, RBC, hemoglobin, hematocrit, platelets, and indices.", ["complete blood count"]],
    ["Peripheral smear", "lab", "Hematology", "Microscopic blood-cell review for morphology, hemolysis, blasts, parasites, and platelet clues.", ["blood smear"]],
    ["Reticulocyte count", "lab", "Hematology", "Measures immature RBC production response to anemia or marrow stress.", ["retic count"]],
    ["PT", "lab", "Hematology", "Coagulation test tied to extrinsic pathway and warfarin monitoring through INR context.", ["prothrombin time"]],
    ["INR", "lab", "Hematology", "Standardized warfarin anticoagulation measure and bleeding risk clue.", ["international normalized ratio"]],
    ["aPTT", "lab", "Hematology", "Coagulation test tied to intrinsic pathway and unfractionated heparin monitoring.", ["PTT", "activated partial thromboplastin time"]],
    ["Anti-Xa", "lab", "Hematology", "Assesses heparin/LMWH activity in selected clients.", ["anti factor xa"]],
    ["Bleeding time", "lab", "Hematology", "Older platelet function screen, largely replaced but still a concept for platelet plug formation.", ["bleeding time test"]],
    ["Platelet function", "lab", "Hematology", "Assesses platelet response/aggregation when platelet dysfunction is suspected.", ["platelet aggregation"]],
    ["Fibrinogen", "lab", "Hematology", "Clotting factor level important in DIC, bleeding, liver disease, and pregnancy contexts.", ["factor I"]],
    ["Bone marrow aspiration", "procedure", "Hematology", "Liquid marrow sample for leukemia, anemia, infection, or marrow failure evaluation.", ["marrow aspiration"]],
    ["Bone marrow biopsy", "procedure", "Hematology", "Core marrow sample for cellularity, malignancy, fibrosis, or marrow failure.", ["marrow biopsy"]],

    ["PET scan", "nuclear", "Oncology", "Functional imaging using tracer uptake to evaluate cancer activity, metastasis, and treatment response.", ["PET", "positron emission tomography"]],
    ["Tumor biopsy", "procedure", "Oncology", "Tissue sampling used to diagnose malignancy type, grade, and receptor/molecular features.", ["cancer biopsy"]],
    ["Sentinel lymph node biopsy", "procedure", "Oncology", "Samples first draining lymph node(s) to stage selected cancers.", ["sentinel node biopsy"]],
    ["Fine needle aspiration", "procedure", "Oncology", "Needle sampling of cells from a mass, thyroid, lymph node, or fluid collection.", ["FNA"]],
    ["Core needle biopsy", "procedure", "Oncology", "Needle obtains tissue core for histology.", ["core biopsy"]],
    ["Excisional biopsy", "procedure", "Oncology", "Surgical removal of the whole suspicious lesion or lymph node for diagnosis.", ["excision biopsy"]],
    ["Skin biopsy", "procedure", "Dermatology", "Removes a small skin sample so pathology or microbiology testing can diagnose rashes, inflammatory skin disease, infection, psoriasis or dermatitis patterns, and skin cancers.", ["skin lesion biopsy", "shave biopsy", "punch biopsy", "incisional biopsy", "skin cancer biopsy", "melanoma biopsy"]],
    ["Skin prick allergy test", "allergy", "Allergy/Immunology", "IgE-mediated allergy skin test using small allergen exposures on the skin to identify likely symptom triggers.", ["allergy skin testing", "skin prick test", "puncture allergy test", "IgE skin test"]],
    ["PSA", "screening", "Oncology", "Prostate-specific antigen used in prostate cancer screening/monitoring context.", ["prostate specific antigen"]],
    ["CEA", "screening", "Oncology", "Tumor marker often used to monitor colorectal and other cancers, not a stand-alone diagnosis.", ["carcinoembryonic antigen"]],
    ["AFP", "screening", "Oncology", "Alpha-fetoprotein marker that can rise with hepatocellular carcinoma and some germ-cell tumors and is also part of selected prenatal screening panels.", ["alpha fetoprotein"]],
    ["CA-125", "screening", "Oncology", "Tumor marker often used in ovarian cancer monitoring context, not a screening diagnosis alone.", ["cancer antigen 125"]],
    ["CA19-9", "screening", "Oncology", "Tumor marker used in pancreatic/biliary cancer monitoring context.", ["CA 19-9", "cancer antigen 19-9"]],
    ["hCG", "screening", "Oncology", "Human chorionic gonadotropin used for pregnancy and some germ-cell/trophoblastic tumor evaluation.", ["human chorionic gonadotropin"]],

    ["NST", "ob", "Obstetrics", "Nonstress fetal monitoring evaluates accelerations with movement as a fetal oxygenation clue.", ["nonstress test"]],
    ["CST", "ob", "Obstetrics", "Contraction stress test evaluates fetal heart response to contractions.", ["contraction stress test"]],
    ["BPP", "ob", "Obstetrics", "Biophysical profile combines fetal movement, tone, breathing, fluid, and often NST.", ["biophysical profile"]],
    ["Doppler ultrasound", "ob", "Obstetrics", "Assesses blood flow patterns such as umbilical artery or fetal/maternal circulation.", ["fetal doppler"]],
    ["GBS screen", "screening", "Obstetrics", "Group B strep screening near term guides intrapartum antibiotic prophylaxis.", ["group b strep screening", "group B streptococcus screening"]],
    ["Glucose challenge", "screening", "Obstetrics", "One-hour glucose screen for gestational diabetes risk.", ["1 hour glucose test", "GCT"]],
    ["Amniocentesis", "ob", "Obstetrics", "Amniotic fluid sampling for genetic, fetal lung, infection, or diagnostic indications.", ["amnio"]],
    ["CVS", "ob", "Obstetrics", "Chorionic villus sampling obtains placental tissue for genetic testing.", ["chorionic villus sampling"]],
    ["Nitrazine", "ob", "Obstetrics", "pH paper test supporting rupture of membranes when amniotic fluid alkalinity is present.", ["nitrazine paper"]],
    ["Fern test", "ob", "Obstetrics", "Microscopic ferning pattern supports rupture of membranes.", ["ferning test"]],
    ["Kleihauer-Betke", "ob", "Obstetrics", "Estimates fetal-maternal hemorrhage, often tied to Rh immune globulin dosing after trauma/bleeding.", ["KB test"]],

    ["Newborn heel stick", "screening", "Pediatrics", "Newborn blood spot screening collection for inherited/metabolic conditions.", ["newborn screen", "heel prick"]],
    ["Bilirubin", "lab", "Pediatrics", "Evaluates neonatal jaundice severity and risk for bilirubin neurotoxicity.", ["neonatal bilirubin", "transcutaneous bilirubin"]],
    ["Sweat chloride test", "lab", "Pediatrics", "Measures sweat chloride concentration to confirm or evaluate cystic fibrosis after symptoms, family history, prenatal results, or positive newborn screening.", ["sweat test", "sweat chloride", "chloride sweat test", "cystic fibrosis sweat test", "pilocarpine iontophoresis"]],
    ["Coombs", "lab", "Pediatrics", "Antiglobulin test used for hemolysis/immune incompatibility evaluation.", ["direct antiglobulin test", "DAT"]],
    ["APGAR scoring", "ob", "Pediatrics", "Rapid newborn transition score at 1 and 5 minutes using appearance, pulse, grimace, activity, and respirations to decide whether the newborn needs support.", ["Apgar", "Apgar score", "APGAR", "newborn Apgar", "Apgar test", "one minute Apgar", "five minute Apgar", "appearance pulse grimace activity respiration", "appearance pulse grimace activity respirations", "newborn transition score"]],
    ["PKU", "screening", "Pediatrics", "Newborn screen for phenylketonuria and other metabolic conditions by state panel.", ["phenylketonuria"]],
    ["Hearing screen", "screening", "Pediatrics", "Newborn hearing screen for early detection of hearing loss.", ["newborn hearing test"]],
    ["Pulse ox congenital heart screen", "screening", "Pediatrics", "Newborn pulse oximetry screen for critical congenital heart disease.", ["CCHD screen", "pulse oximetry screen"]],

    ["X-ray", "imaging", "Musculoskeletal", "Plain radiograph for fracture, dislocation, alignment, chest/abdomen, and tube/line checks.", ["radiograph"]],
    ["CT", "imaging", "Musculoskeletal", "Computed tomography gives cross-sectional detail for trauma, bone, bleeding, and organ injury.", ["computed tomography"]],
    ["MRI", "imaging", "Musculoskeletal", "Magnetic resonance imaging gives soft-tissue, neuro, joint, and tumor detail without ionizing radiation.", ["magnetic resonance imaging"]],
    ["Bone scan", "nuclear", "Musculoskeletal", "Nuclear scan for bone turnover, metastases, occult fracture, or infection patterns.", ["skeletal scintigraphy"]],
    ["DEXA", "imaging", "Musculoskeletal", "Bone-density scan used to evaluate osteopenia/osteoporosis and fracture risk.", ["bone density scan"]],
    ["Arthroscopy", "procedure", "Musculoskeletal", "Endoscopic joint procedure for diagnosis or treatment of joint problems.", ["joint scope"]],
    ["Arthrocentesis", "procedure", "Musculoskeletal", "Needle aspiration of joint fluid for infection, crystals, bleeding, or relief.", ["joint aspiration"]],

    ["Blood culture", "culture", "Infectious Disease", "Detects bloodstream infection and guides antimicrobial therapy.", ["blood cultures"]],
    ["Wound culture", "culture", "Infectious Disease", "Identifies organisms from wound drainage/tissue when infection is suspected.", ["wound swab"]],
    ["CSF culture", "culture", "Infectious Disease", "Cultures cerebrospinal fluid for meningitis/encephalitis organisms.", ["cerebrospinal fluid culture"]],
    ["PCR", "culture", "Infectious Disease", "Molecular test that detects organism genetic material rapidly.", ["polymerase chain reaction"]],
    ["Rapid antigen", "screening", "Infectious Disease", "Quick test for selected pathogens using antigen detection.", ["rapid antigen test"]],
    ["HIV testing", "screening", "Infectious Disease", "Screens/diagnoses HIV using antigen/antibody and confirmatory algorithms.", ["HIV screen", "HIV Ag Ab"]],
    ["Hepatitis panel", "screening", "Infectious Disease", "Serology panel distinguishing hepatitis exposure, immunity, acute/chronic infection patterns.", ["hep panel"]],
    ["Lyme titers", "screening", "Infectious Disease", "Serology used with exposure and symptoms to evaluate Lyme disease.", ["Lyme testing"]],

    ["Snellen", "eyeEar", "Eye & Ear", "Visual acuity screening using a letter chart.", ["snellen chart"]],
    ["Tonometry", "eyeEar", "Eye & Ear", "Measures intraocular pressure, important in glaucoma evaluation.", ["eye pressure test"]],
    ["Fluorescein stain", "eyeEar", "Eye & Ear", "Dye exam for corneal abrasion, ulcer, or foreign body patterns.", ["fluorescein eye stain"]],
    ["Fundoscopy", "eyeEar", "Eye & Ear", "Examines retina/optic disc for vascular, neuro, or diabetic/hypertensive changes.", ["ophthalmoscopy", "funduscopic exam"]],
    ["Visual fields", "eyeEar", "Eye & Ear", "Tests peripheral vision and field cuts.", ["perimetry"]],
    ["Weber", "eyeEar", "Eye & Ear", "Tuning-fork test comparing sound lateralization for hearing loss type.", ["Weber test"]],
    ["Rinne", "eyeEar", "Eye & Ear", "Tuning-fork test comparing air and bone conduction.", ["Rinne test"]],
    ["Audiometry", "eyeEar", "Eye & Ear", "Formal hearing threshold testing.", ["hearing test"]],
    ["Tympanometry", "eyeEar", "Eye & Ear", "Assesses eardrum mobility and middle-ear pressure.", ["middle ear pressure test"]],

    ["Mammogram", "screening", "Cancer Screening", "Breast imaging screen/diagnostic test for masses and calcifications.", ["mammography"]],
    ["Breast MRI", "imaging", "Cancer Screening", "Magnetic resonance breast imaging used for selected high-risk screening, problem solving after other imaging, implant evaluation, cancer extent, treatment response, or recurrence questions.", ["breast magnetic resonance imaging", "MRI breast", "breast MRI with contrast"]],
    ["Pap smear", "screening", "Cancer Screening", "Cervical cytology screen for precancer/cancer changes.", ["pap test"]],
    ["HPV test", "screening", "Cancer Screening", "Tests for high-risk human papillomavirus linked to cervical cancer.", ["human papillomavirus test"]],
    ["Low-dose CT lung screening", "screening", "Cancer Screening", "Annual low-dose CT screen for selected high-risk smokers/former smokers.", ["LDCT lung screening"]],

    ["HIDA", "nuclear", "Nuclear Medicine", "Hepatobiliary scan evaluates gallbladder function and bile flow.", ["hepatobiliary iminodiacetic acid scan"]],

    ["Paracentesis", "procedure", "High-Yield NCLEX Procedures", "Needle drainage of ascitic fluid for diagnosis or symptom relief.", ["abdominal tap", "ascites tap"]],
    ["Liver biopsy", "procedure", "High-Yield NCLEX Procedures", "Needle or surgical liver tissue sampling for diagnosis/staging.", ["hepatic biopsy"]],
    ["Kidney biopsy", "procedure", "High-Yield NCLEX Procedures", "Renal tissue sampling for glomerular, transplant, or unexplained kidney disease.", ["renal biopsy"]],
    ["ABG sampling", "procedure", "High-Yield NCLEX Procedures", "Arterial puncture for blood gas evaluation of oxygenation, ventilation, and acid-base status.", ["arterial puncture", "arterial blood gas sampling"]],
    ["ECG lead placement", "cardiac", "High-Yield Visual References", "Correct 12-lead ECG electrode placement creates reliable views of cardiac electrical activity; misplaced leads can mimic ischemia, axis change, or rhythm abnormalities.", ["EKG lead placement", "12 lead placement", "precordial lead placement", "chest lead placement", "V1 V2 V3 V4 V5 V6", "right arm left arm right leg left leg electrodes"]],
    ["Burn rule of nines", "procedure", "High-Yield Visual References", "Adult burn-size estimate that divides body regions into 9 percent or 18 percent blocks so total body surface area guides fluids, triage, and burn-center decisions.", ["rule of nines", "Wallace rule of nines", "burn TBSA", "total body surface area burn", "burn percentage", "burn size estimate", "burn chart", "Lund Browder"]],
    ["Dermatome map", "neuro", "High-Yield Visual References", "Map of sensory skin regions supplied by spinal nerve roots; used to localize radiculopathy, spinal cord injury level, and shingles distribution.", ["dermatomes", "dermatome chart", "sensory level", "spinal nerve root map", "radiculopathy map", "shingles dermatome"]],
    ["Blood tube order of draw", "lab", "High-Yield Visual References", "Phlebotomy sequence designed to reduce additive carryover and specimen contamination during blood collection.", ["order of draw", "tube colors", "blood tube colors", "phlebotomy order", "lab tube order", "blood draw order", "additive carryover"]],
    ["Fetal heart rate patterns", "ob", "High-Yield Visual References", "Fetal monitoring pattern reference that connects baseline, variability, accelerations, decelerations, and uterine activity with fetal oxygenation risk.", ["fetal tracing", "fetal heart tracing", "FHR patterns", "early decelerations", "late decelerations", "variable decelerations", "fetal monitoring strips", "category I II III tracing"]],
    ["Insulin action profile", "endocrine", "High-Yield Visual References", "Comparison of rapid-, short-, intermediate-, and long-acting insulin onset, peak, and duration to prevent timing errors and hypoglycemia.", ["insulin types", "insulin onset peak duration", "rapid acting insulin", "regular insulin", "NPH insulin", "long acting insulin", "basal bolus insulin", "insulin chart"]],
    ["Acid-base compensation chart", "lab", "High-Yield Visual References", "ABG interpretation aid that separates pH, PaCO2, HCO3, oxygenation, and expected compensation so mixed acid-base disorders are not missed.", ["acid base chart", "ABG compensation", "metabolic acidosis compensation", "respiratory acidosis compensation", "metabolic alkalosis compensation", "respiratory alkalosis compensation", "ABG interpretation chart"]]
  ];

  const RARE_SUPPLEMENT_TOOLS = [
    ["Ankle-Brachial Index (ABI)", "procedure", "Cardiovascular", "Compares ankle and brachial systolic pressures to screen for peripheral arterial disease and lower-extremity perfusion problems.", ["ABI", "ankle brachial index"]],
    ["Toe-Brachial Index (TBI)", "procedure", "Cardiovascular", "Compares toe and brachial pressures when ABI may be falsely elevated, especially with calcified vessels in diabetes or kidney disease.", ["TBI", "toe brachial index"]],
    ["Carotid duplex ultrasound", "imaging", "Cardiovascular", "Uses ultrasound and Doppler to evaluate carotid stenosis, plaque, and stroke/TIA risk.", ["carotid ultrasound", "carotid doppler"]],
    ["Transcranial Doppler ultrasound", "imaging", "Cardiovascular", "Assesses blood flow velocity in major intracranial vessels, including vasospasm or selected stroke/sickle-cell monitoring.", ["TCD", "transcranial doppler"]],
    ["Coronary CT angiography", "imaging", "Cardiovascular", "Contrast CT study that evaluates coronary artery anatomy, stenosis, plaque, and chest-pain risk stratification.", ["CCTA", "coronary CTA", "CT coronary angiography"]],
    ["Peripheral angiography", "procedure", "Cardiovascular", "X-ray contrast catheter study of arm or leg arteries used to evaluate narrowed, blocked, bleeding, inflamed, or injured peripheral vessels and sometimes treat clots or stenosis during the same procedure.", ["peripheral angiogram", "lower extremity angiogram", "extremity angiography", "arteriography of the extremity", "PAD angiography", "peripheral artery disease angiography"]],
    ["Fractional Flow Reserve (FFR)", "procedure", "Cardiovascular", "Invasive pressure-wire measurement during coronary angiography that estimates whether a coronary stenosis limits blood flow.", ["FFR", "fractional flow reserve"]],
    ["Intravascular Ultrasound (IVUS)", "procedure", "Cardiovascular", "Catheter-based ultrasound inside a blood vessel used to assess plaque, vessel size, stents, and coronary anatomy.", ["IVUS", "intravascular ultrasound"]],
    ["Optical coherence tomography (coronary)", "procedure", "Cardiovascular", "Catheter-based light imaging of coronary vessel/stent detail with very high resolution.", ["OCT coronary", "coronary OCT", "optical coherence tomography cardiac"]],
    ["Tilt-table test", "procedure", "Cardiovascular", "Provokes positional vital-sign changes to evaluate syncope, orthostatic intolerance, and autonomic dysfunction.", ["tilt table", "tilt test"]],

    ["Diffusion capacity (DLCO)", "pulmonary", "Respiratory", "Pulmonary function measure of gas transfer across the alveolar-capillary membrane, useful in interstitial lung disease, emphysema, and pulmonary vascular disease.", ["DLCO", "diffusing capacity"]],
    ["Bronchoalveolar lavage (BAL)", "procedure", "Respiratory", "Bronchoscopy-based saline wash sample from lower airways used to evaluate infection, bleeding, inflammation, or malignancy.", ["BAL", "bronchoalveolar lavage"]],
    ["Endobronchial ultrasound (EBUS)", "procedure", "Respiratory", "Bronchoscopy with ultrasound guidance to sample mediastinal/hilar lymph nodes or airway-adjacent lesions.", ["EBUS", "endobronchial ultrasound"]],
    ["Methacholine challenge test", "pulmonary", "Respiratory", "Bronchoprovocation test used when asthma is suspected but baseline spirometry is nondiagnostic.", ["methacholine challenge", "bronchoprovocation"]],
    ["Exercise oximetry", "pulmonary", "Respiratory", "Monitors oxygen saturation during activity to evaluate exertional desaturation and oxygen needs.", ["walking oximetry", "exertional oximetry"]],
    ["Six-minute walk test", "pulmonary", "Respiratory", "Measures distance, symptoms, oxygen saturation, and endurance over six minutes for cardiopulmonary functional status.", ["6 minute walk test", "6MWT"]],
    ["Fractional exhaled nitric oxide (FeNO)", "pulmonary", "Respiratory", "Measures exhaled nitric oxide as a marker of type 2/eosinophilic airway inflammation in asthma assessment.", ["FeNO", "exhaled nitric oxide"]],

    ["Defecography", "imaging", "GI", "Dynamic imaging of defecation mechanics used for pelvic floor dysfunction, rectocele, prolapse, and outlet obstruction.", ["defecogram"]],
    ["Anorectal manometry", "procedure", "GI", "Measures anal sphincter pressure, rectal sensation, and coordination for constipation or fecal incontinence workup.", ["rectal manometry"]],
    ["Esophageal pH monitoring", "procedure", "GI", "Measures acid exposure in the esophagus over time to evaluate GERD or reflux-related symptoms.", ["pH probe", "24 hour pH monitoring"]],
    ["Hydrogen breath test", "procedure", "GI", "Breath test used to evaluate lactose intolerance, small intestinal bacterial overgrowth, or carbohydrate malabsorption patterns.", ["H2 breath test", "SIBO breath test"]],
    ["Secretin stimulation test", "endocrine", "GI", "Dynamic test of pancreatic exocrine function or gastrinoma evaluation depending protocol.", ["secretin test"]],
    ["Small bowel follow-through", "imaging", "GI", "Contrast fluoroscopy series tracking small-intestine anatomy, transit, strictures, obstruction, or inflammation.", ["SBFT"]],
    ["CT enterography", "imaging", "GI", "Contrast CT optimized for small bowel inflammation, Crohn disease, bleeding, mass, or obstruction evaluation.", ["computed tomography enterography"]],
    ["MR enterography", "imaging", "GI", "MRI optimized for small bowel inflammation, Crohn disease, fistula, abscess, or stricture evaluation without ionizing radiation.", ["MRE", "magnetic resonance enterography"]],
    ["Anoscopy", "procedure", "GI", "Short scope exam of anal canal and distal rectum for hemorrhoids, fissures, lesions, or bleeding source.", ["anal scope"]],
    ["Proctoscopy", "procedure", "GI", "Scope exam of rectum/distal colon for rectal bleeding, inflammation, lesions, or follow-up evaluation.", ["rectoscopy"]],

    ["Video EEG monitoring", "neuro", "Neurology", "Continuous EEG paired with video to correlate events with brain electrical activity during seizure evaluation.", ["video electroencephalogram", "vEEG"]],
    ["Cerebral perfusion scan", "nuclear", "Neurology", "Functional brain perfusion imaging that evaluates regional cerebral blood flow for stroke patterns, seizure focus localization, dementia patterns, or brain-death evaluation when clinically appropriate.", ["brain perfusion scan"]],
    ["Myelography", "procedure", "Neurology", "Contrast study of the spinal canal/nerve roots used when MRI is not possible or more detail is needed.", ["myelogram"]],
    ["CT myelogram", "imaging", "Neurology", "CT imaging after intrathecal contrast to evaluate spinal canal, nerve roots, leaks, or compression.", ["computed tomography myelogram"]],
    ["Nerve biopsy", "procedure", "Neurology", "Surgical sampling of peripheral nerve for selected neuropathy, vasculitis, amyloid, or inflammatory evaluation.", ["sural nerve biopsy"]],
    ["Brain PET", "nuclear", "Neurology", "Functional brain metabolism imaging for selected seizure focus, dementia, tumor, or neurologic diagnostic questions.", ["brain positron emission tomography"]],
    ["Functional MRI (fMRI)", "imaging", "Neurology", "MRI technique that maps brain activity by blood-flow changes, often for pre-surgical planning or research-level functional mapping.", ["fMRI", "functional magnetic resonance imaging"]],
    ["Neuropsychological testing", "procedure", "Neurology", "Structured cognitive testing that evaluates memory, attention, language, executive function, mood, and functional brain patterns.", ["neuropsych testing"]],

    ["Thyroid fine-needle aspiration", "procedure", "Endocrine", "Needle sampling of thyroid nodule cells to evaluate malignancy risk.", ["thyroid FNA", "thyroid biopsy"]],
    ["Calcitonin level", "lab", "Endocrine", "Hormone marker used when medullary thyroid carcinoma or C-cell disease is suspected/monitored.", ["serum calcitonin"]],
    ["Plasma metanephrines", "endocrine", "Endocrine", "Blood test for catecholamine metabolites used to evaluate pheochromocytoma/paraganglioma.", ["free plasma metanephrines"]],
    ["24-hour urine metanephrines", "endocrine", "Endocrine", "Timed urine catecholamine metabolite test for pheochromocytoma/paraganglioma evaluation.", ["urine metanephrines"]],
    ["Water deprivation test", "endocrine", "Endocrine", "Dynamic test used to differentiate diabetes insipidus patterns and primary polydipsia under close monitoring.", ["DI water deprivation test"]],
    ["Insulin/C-peptide levels", "endocrine", "Endocrine", "Paired insulin and C-peptide testing helps evaluate endogenous insulin production, hypoglycemia causes, and diabetes classification.", ["C peptide", "insulin level", "c-peptide"]],

    ["Voiding cystourethrogram (VCUG)", "imaging", "Renal/Urologic", "Fluoroscopic bladder/urethra study during filling and voiding, often used for vesicoureteral reflux or pediatric urinary evaluation.", ["VCUG", "voiding cystourethrogram"]],
    ["Renal nuclear scan", "nuclear", "Renal/Urologic", "Nuclear medicine renal study evaluating kidney perfusion, function, drainage, or obstruction patterns.", ["renal scintigraphy"]],
    ["MAG3 renogram", "nuclear", "Renal/Urologic", "Nuclear renal scan using MAG3 tracer to assess renal perfusion, drainage, obstruction, and split renal function.", ["MAG3 renal scan", "mercaptoacetyltriglycine renogram"]],
    ["Uroflowmetry", "procedure", "Renal/Urologic", "Measures urine flow rate and voiding pattern for obstruction, retention, or lower urinary tract symptoms.", ["urine flow test"]],

    ["Indirect Coombs test", "lab", "Hematology/Immunology", "Detects circulating antibodies against RBCs, important in prenatal antibody screening and transfusion compatibility.", ["indirect antiglobulin test", "IAT", "antibody screen"]],
    ["Hemoglobin electrophoresis", "lab", "Hematology/Immunology", "Separates hemoglobin types to evaluate sickle cell disease, thalassemias, and hemoglobin variants.", ["Hgb electrophoresis"]],
    ["Flow cytometry", "lab", "Hematology/Immunology", "Analyzes cell surface markers to classify leukemia/lymphoma, immune disorders, or abnormal cell populations.", ["immunophenotyping"]],
    ["Serum protein electrophoresis", "lab", "Hematology/Immunology", "Separates serum proteins to evaluate monoclonal gammopathy, multiple myeloma, inflammation, or protein abnormalities.", ["SPEP"]],
    ["Bone density laboratory markers", "lab", "Hematology/Immunology", "Blood/urine markers such as calcium, vitamin D, PTH, alkaline phosphatase, or bone-turnover markers that support bone-health evaluation.", ["bone turnover markers"]],
    ["ANA", "lab", "Hematology/Immunology", "Antinuclear antibody screening test used in autoimmune disease evaluation, especially lupus patterns.", ["antinuclear antibody"]],
    ["ANCA", "lab", "Hematology/Immunology", "Antineutrophil cytoplasmic antibody testing used in selected vasculitis evaluations.", ["antineutrophil cytoplasmic antibody"]],
    ["Complement levels", "lab", "Hematology/Immunology", "C3/C4 and related complement testing used in autoimmune, immune-complex, infection, or hereditary complement disorders.", ["C3", "C4", "CH50"]],

    ["Fetal fibronectin", "ob", "Obstetrics/Gynecology", "Vaginal/cervical secretion test used in selected clients to help assess short-term preterm birth risk.", ["fFN"]],
    ["Amniotic fluid index", "ob", "Obstetrics/Gynecology", "Ultrasound estimate of amniotic fluid volume used to evaluate oligohydramnios or polyhydramnios.", ["AFI"]],
    ["Hysterosalpingography", "procedure", "Obstetrics/Gynecology", "Contrast imaging of uterus and fallopian tubes, often used in infertility or tubal patency evaluation.", ["HSG"]],
    ["Saline infusion sonohysterography", "procedure", "Obstetrics/Gynecology", "Transvaginal ultrasound with sterile saline infused into the uterine cavity to better show the endometrium, polyps, fibroids, adhesions, congenital uterine defects, and selected infertility or recurrent loss questions.", ["sonohysterography", "hysterosonography", "saline infusion sonography", "SIS", "saline sonogram", "uterine saline ultrasound"]],
    ["Colposcopy", "procedure", "Obstetrics/Gynecology", "Magnified cervical/vaginal exam after abnormal Pap/HPV results to identify lesions and guide biopsy.", ["cervical colposcopy"]],
    ["Endometrial biopsy", "procedure", "Obstetrics/Gynecology", "Sampling of uterine lining to evaluate abnormal uterine bleeding, hyperplasia, malignancy, or hormonal effects.", ["uterine biopsy"]],
    ["Hysteroscopy", "procedure", "Obstetrics/Gynecology", "Endoscopic visualization of the uterine cavity used to evaluate and sometimes treat abnormal uterine bleeding, polyps, fibroids, adhesions, septum, infertility/recurrent loss questions, retained tissue, or IUD localization.", ["uterine hysteroscopy", "diagnostic hysteroscopy", "operative hysteroscopy"]],

    ["Dual-energy CT", "imaging", "Musculoskeletal", "CT technique that differentiates materials such as urate crystals and can support gout or stone characterization.", ["DECT"]],
    ["Synovial fluid crystal analysis", "lab", "Musculoskeletal", "Microscopic joint-fluid exam for monosodium urate or calcium pyrophosphate crystals in gout/pseudogout workup.", ["joint fluid crystal analysis"]],
    ["Muscle biopsy", "procedure", "Musculoskeletal", "Tissue sampling of muscle for inflammatory myopathy, muscular dystrophy, metabolic disease, or infection evaluation.", ["skeletal muscle biopsy"]],
    ["Compartment pressure measurement", "procedure", "Musculoskeletal", "Direct pressure measurement in a muscle compartment when acute compartment syndrome is suspected.", ["compartment pressure test"]],

    ["Slit-lamp examination", "eyeEar", "Eyes/Ears", "Magnified eye exam of cornea, anterior chamber, lens, and other structures for injury, infection, inflammation, or foreign body.", ["slit lamp"]],
    ["Optical coherence tomography (retina)", "eyeEar", "Eyes/Ears", "Noninvasive retinal/optic nerve imaging used for macular degeneration, diabetic retinopathy, glaucoma, and retinal edema.", ["retinal OCT", "ocular OCT"]],
    ["Gonioscopy", "eyeEar", "Eyes/Ears", "Eye-angle exam used in glaucoma evaluation to inspect the anterior chamber angle.", ["angle exam"]],
    ["Visual evoked potentials", "neuro", "Eyes/Ears", "Measures brain electrical response to visual stimuli, useful in optic nerve or visual pathway evaluation.", ["VEP"]],
    ["Electronystagmography", "eyeEar", "Eyes/Ears", "Vestibular test recording eye movements to evaluate dizziness, vertigo, or balance disorders.", ["ENG"]],
    ["Videonystagmography", "eyeEar", "Eyes/Ears", "Infrared/video eye movement testing for vestibular and balance evaluation.", ["VNG"]],
    ["Nasal endoscopy", "procedure", "Ear/Nose/Throat", "Flexible or rigid endoscopic exam of the nasal passages, nasopharynx, and upper throat for obstruction, bleeding source, polyps, infection, lesions, cancer evaluation, voice/swallow/airway symptoms, or biopsy planning.", ["nasendoscopy", "nasoendoscopy", "nasopharyngoscopy", "flexible nasal endoscopy", "ENT endoscopy"]],

    ["Lumbar CSF PCR panels", "culture", "Infectious Disease", "Molecular CSF testing for meningitis/encephalitis pathogens after lumbar puncture.", ["CSF PCR panel", "meningitis encephalitis panel"]],
    ["Tuberculosis NAAT", "culture", "Infectious Disease", "Molecular test that detects Mycobacterium tuberculosis DNA and can identify some resistance markers faster than culture.", ["TB NAAT", "nucleic acid amplification test TB"]],
    ["Respiratory viral multiplex PCR", "culture", "Infectious Disease", "Molecular panel that detects multiple respiratory viruses and sometimes atypical bacteria from respiratory specimens.", ["respiratory PCR panel", "viral multiplex panel"]],
    ["Beta-D-glucan", "lab", "Infectious Disease", "Serum fungal cell-wall marker used as supportive evidence for invasive fungal infection in the right clinical context.", ["1,3 beta d glucan", "fungitell"]],
    ["Galactomannan assay", "lab", "Infectious Disease", "Aspergillus antigen assay used as supportive evidence for invasive aspergillosis in high-risk clients.", ["aspergillus galactomannan"]],

    ["Liquid biopsy", "lab", "Oncology", "Blood-based testing for circulating tumor DNA or tumor cells used for selected cancer profiling and monitoring.", ["ctDNA", "circulating tumor DNA"]],
    ["Molecular genetic profiling", "lab", "Oncology", "Tumor or germline molecular testing that identifies mutations, markers, or targets guiding therapy and prognosis.", ["next generation sequencing", "NGS tumor testing"]],
    ["HER2 testing", "lab", "Oncology", "Tumor marker testing for HER2 overexpression/amplification, important in breast and gastric cancer therapy selection.", ["human epidermal growth factor receptor 2"]],
    ["PD-L1 testing", "lab", "Oncology", "Tumor immune-marker testing that can guide checkpoint inhibitor therapy decisions.", ["programmed death ligand 1"]],
    ["BRCA genetic testing", "screening", "Oncology", "Germline genetic testing for BRCA1/BRCA2 variants associated with hereditary breast/ovarian and related cancer risk.", ["BRCA1", "BRCA2"]],
    ["Microsatellite instability testing", "lab", "Oncology", "Tumor testing for mismatch-repair deficiency/MSI status, relevant to Lynch syndrome and immunotherapy decisions.", ["MSI testing", "mismatch repair testing", "MMR testing"]],

    ["Whole-body MRI", "imaging", "General Imaging", "MRI survey of large body regions that can evaluate cancer burden, multifocal inflammatory disease, marrow or soft-tissue lesions, and selected whole-body screening indications.", ["whole body magnetic resonance imaging"]],
    ["SPECT scan", "nuclear", "General Imaging", "Single-photon nuclear imaging that shows functional tracer distribution for cardiac, bone, brain, or endocrine questions.", ["single photon emission computed tomography"]],
    ["SPECT/CT", "nuclear", "General Imaging", "Hybrid functional/anatomic imaging that combines SPECT tracer data with CT localization.", ["SPECT CT"]],
    ["PET/CT fusion imaging", "nuclear", "General Imaging", "Hybrid metabolic/anatomic imaging combining PET tracer uptake with CT localization, often used in oncology.", ["PET CT", "PET/CT"]]
  ];

  const ALIAS_ENRICHMENTS = {
    "Cardiac MRI": ["Cardiac MRI with contrast", "contrast cardiac MRI"],
    "HIDA": ["Hepatobiliary (HIDA) scan with ejection fraction", "HIDA scan with ejection fraction", "gallbladder ejection fraction"],
    "LFTs": [
      "LFT",
      "liver function test",
      "liver function tests",
      "hepatic function panel",
      "hepatic panel",
      "liver panel",
      "liver profile",
      "hepatic profile",
      "liver chemistry",
      "liver chemistries",
      "liver blood tests",
      "liver enzymes",
      "abnormal liver labs",
      "elevated LFTs",
      "transaminitis",
      "liver fuction test",
      "liver funtion test",
      "liver pannel",
      "hepatic panal"
    ],
    "H. pylori breath/stool tests": [
      "H. pylori breath test",
      "H pylori breath test",
      "Helicobacter pylori breath test",
      "urea breath test for H. pylori",
      "H. pylori stool test",
      "H pylori stool test",
      "H. pylori stool antigen test",
      "H pylori stool antigen test",
      "Helicobacter pylori stool antigen test"
    ],
    "ACTH stimulation": ["Cosyntropin test", "cosyntropin stimulation test"],
    "Coombs": ["Direct Coombs test", "direct antiglobulin test"],
    "Kidney biopsy": ["Kidney biopsy with ultrasound guidance", "ultrasound-guided kidney biopsy", "ultrasound guided renal biopsy"],
    "Bladder scan": ["Postvoid residual measurement", "post-void residual measurement", "PVR measurement"],
    "BPP": ["Biophysical profile with Doppler", "BPP with Doppler"],
    "IGRA": ["Quantiferon-TB Gold", "QuantiFERON-TB Gold"],
    "DEXA": ["DEXA vertebral fracture assessment", "vertebral fracture assessment", "VFA"]
  };

  const DETAIL_OVERRIDES = {
    "Toxicity and antidote reversal pairs": {
      // Individual antidotes are related members of this aggregate reference,
      // not alternate names for the aggregate itself. Keep the complete tuple
      // list in tags below, but reserve identity aliases for phrases that
      // genuinely name the table. This prevents a misspelled medication name
      // such as "Naloxxone" from being claimed by the broad reference card.
      identityAliases: [
        "antidotes",
        "antidote list",
        "reversal drugs",
        "overdose antidotes",
        "toxicity antidotes",
        "nclex antidotes",
        "poisoning antidotes",
        "magnesium antidote",
        "opioid antidote",
        "benzodiazepine antidote",
        "heparin antidote",
        "warfarin antidote",
        "digoxin antidote",
        "acetaminophen antidote",
        "iron antidote",
        "organophosphate antidote",
        "methanol antidote",
        "ethylene glycol antidote",
        "isoniazid antidote",
        "beta blocker antidote",
        "calcium channel blocker antidote",
        "tca antidote"
      ],
      summary: "High-yield NCLEX antidote reference for common medication toxicities, poisonings, and overdose reversal cues.",
      quickAnswer: "Memorize these core pairs first: magnesium toxicity -> calcium gluconate; opioids -> naloxone; benzodiazepines -> flumazenil; heparin -> protamine sulfate; warfarin -> vitamin K; digoxin -> digoxin immune Fab; acetaminophen -> N-acetylcysteine; iron -> deferoxamine; organophosphates -> atropine plus pralidoxime; methanol or ethylene glycol -> fomepizole; isoniazid -> pyridoxine; beta blockers -> glucagon; calcium channel blockers -> calcium; TCA overdose -> sodium bicarbonate.",
      sections: [
        ["NCLEX high-yield pairs to memorize", "Magnesium sulfate toxicity -> calcium gluconate. Opioid overdose -> naloxone. Benzodiazepine overdose -> flumazenil. Heparin overdose -> protamine sulfate. Warfarin reversal -> vitamin K. Digoxin toxicity -> digoxin immune Fab. Acetaminophen toxicity -> N-acetylcysteine. Iron poisoning -> deferoxamine. Organophosphate poisoning -> atropine plus pralidoxime. Methanol or ethylene glycol poisoning -> fomepizole. Isoniazid toxicity -> pyridoxine. Beta-blocker overdose -> glucagon. Calcium channel blocker overdose -> calcium. Tricyclic antidepressant overdose -> sodium bicarbonate."],
        ["Complete toxicity / overdose reversal table", "Magnesium sulfate: calcium gluconate. Calcium chloride may be used in critical settings per protocol. Opioids such as morphine, fentanyl, oxycodone, or heroin: naloxone (Narcan). Benzodiazepines such as lorazepam, diazepam, or midazolam: flumazenil. Heparin, especially unfractionated heparin: protamine sulfate. Warfarin: vitamin K (phytonadione). Severe bleeding may require 4-factor PCC and sometimes FFP per protocol. Dabigatran: idarucizumab. Apixaban or rivaroxaban: andexanet alfa, or PCC if andexanet is unavailable per protocol. Insulin overdose: dextrose such as D50 or D10. Glucagon may be used if IV access is unavailable. Sulfonylureas: octreotide plus dextrose. Digoxin: digoxin immune Fab (Digibind or DigiFab). Acetaminophen: N-acetylcysteine. Iron poisoning: deferoxamine. Lead poisoning: succimer for mild poisoning. EDTA plus or minus dimercaprol may be used for severe poisoning. Arsenic or mercury poisoning: dimercaprol or succimer depending on the agent and severity. Copper toxicity: penicillamine. Methotrexate toxicity: leucovorin (folinic acid). Methanol poisoning: fomepizole, or ethanol if fomepizole is unavailable and protocol-directed. Ethylene glycol poisoning: fomepizole, or ethanol if fomepizole is unavailable and protocol-directed. Isoniazid (INH): pyridoxine, vitamin B6. Cyanide poisoning: hydroxocobalamin is preferred in many emergency protocols. Organophosphate pesticides: atropine plus pralidoxime (2-PAM). Beta-blocker overdose: glucagon. Calcium channel blocker overdose: calcium chloride or calcium gluconate. High-dose insulin therapy may also be used. Tricyclic antidepressant overdose: sodium bicarbonate. Local anesthetic toxicity such as bupivacaine toxicity: intravenous lipid emulsion. Carbon monoxide poisoning: 100% oxygen. Hyperbaric oxygen may be indicated for severe cases."],
        ["Priority nursing actions", "Antidotes do not replace airway, breathing, circulation, and rapid escalation. Stop the exposure when safe, assess respiratory status and perfusion, place the client on appropriate monitoring, notify the provider or rapid response team, and follow poison control or facility protocol. Trend vitals, mental status, ECG changes, glucose, renal function, liver function, coagulation labs, and drug levels when relevant."],
        ["Common NCLEX traps", "Do not confuse treatment with monitoring. For example, naloxone reverses opioid respiratory depression, but the client still needs airway monitoring because naloxone can wear off before the opioid. Flumazenil can trigger seizures in benzodiazepine dependence or mixed overdose, so it is not a casual rescue medication. Vitamin K is warfarin reversal, while protamine sulfate is heparin reversal. Calcium gluconate is the classic antidote for magnesium toxicity, not for every electrolyte problem."],
        ["Magnesium toxicity focus", "For a client receiving magnesium sulfate, decreased or absent deep tendon reflexes, respiratory rate under 12/min, worsening somnolence, hypotension, bradycardia, or low urine output are toxicity cues. The nurse should stop or hold the infusion per protocol, support breathing, escalate care, and prepare calcium gluconate as ordered."]
      ],
      tags: ["toxicology", "antidote", "reversal", "overdose", "poisoning", "NCLEX antidotes", "magnesium toxicity", "calcium gluconate", "naloxone", "flumazenil", "protamine", "vitamin K", "digoxin immune Fab", "N-acetylcysteine", "fomepizole"]
    },
    "H. pylori breath/stool tests": {
      summary: "H. pylori urea breath testing and stool antigen testing are noninvasive tests for active Helicobacter pylori infection. A positive result supports active infection; a correctly timed test after treatment checks whether eradication was successful.",
      quickAnswer: "An H. pylori breath or stool antigen test indicates active Helicobacter pylori infection when positive, which can lead to peptic ulcers and stomach cancer. A negative result does not rule out infection when proton-pump inhibitors (PPIs), PCAB acid suppressants, bismuth, or antibiotics have recently suppressed the organism, so medication timing is part of interpretation.",
      whyItMatters: "These tests matter because identifying active infection changes treatment and confirming eradication after therapy prevents persistent infection from going unnoticed. The result does not show whether an ulcer or stomach cancer is present.",
      before: "Verify whether the order is for a urea breath test or stool antigen test and follow the laboratory's collection instructions. Review proton-pump inhibitors (PPIs), PCAB acid suppressants, bismuth, antibiotics, and recent H. pylori treatment because they can cause false-negative results. For a test of cure, the ACG guideline highlights recommend testing at least 4 weeks after therapy, with PPIs/PCABs held for 2 weeks and bismuth and antibiotics held for 4 weeks. Do not independently stop prescribed therapy; clarify the ordered hold plan and whether temporary H2-blocker or antacid bridging is appropriate. Follow fasting instructions for the breath test, collect stool without urine or toilet-water contamination when applicable, and document medicines and last doses.",
      after: "Label and transport the specimen according to laboratory instructions. Connect a positive result with the treatment plan and a negative result with medication timing, specimen quality, symptoms, and pretest probability. When eradication testing is ordered, verify that it occurs at least 4 weeks after therapy rather than immediately after treatment and that ordered acid-suppression, bismuth, and antibiotic holds were followed.",
      redFlags: "Promptly escalate suspected hemorrhage or major bleeding from the upper GI tract, including vomiting blood or coffee-ground material or passing black stools. Severe or frequent upper-abdominal pain, persistent vomiting, unexplained weight loss, or a family history of stomach cancer also requires cause-directed clinician evaluation rather than routine test follow-up alone.",
      trap: "A negative result after recent antibiotics, bismuth, or acid suppression may be falsely reassuring. Serology can remain positive after prior infection and does not prove active infection or eradication, so do not treat antibody testing as interchangeable with breath or stool antigen testing.",
      sections: [
        ["What it means clinically", "A positive urea breath or stool antigen result indicates active H. pylori infection and supports treatment according to the responsible clinician's plan. A negative result lowers support for active infection only when the specimen, timing, and ordered medication holds make the test reliable."],
        ["Before / preparation", "Verify whether the order is for a urea breath test or stool antigen test and follow that laboratory's collection instructions. Review PPIs, PCABs, bismuth, antibiotics, and recent H. pylori treatment. For a test of cure, ACG guidance uses at least 4 weeks after therapy, with PPIs/PCABs held for 2 weeks and bismuth and antibiotics held for 4 weeks. Do not independently stop prescribed therapy; clarify the ordered hold and any temporary H2-blocker or antacid bridge."],
        ["Nursing assessment and next steps", "Assess upper-abdominal pain or burning, vomiting, weight loss, stool appearance, and any evidence of GI bleeding. Verify medication and last-dose timing, collect and label the ordered specimen correctly, document preparation that could affect sensitivity, and connect the result with the clinician's treatment or follow-up plan."],
        ["Likely follow-up and evaluation", "After treatment, confirm that ordered proof-of-eradication testing occurs at least 4 weeks after therapy with the required medication holds. Persistent infection needs a clinician-directed treatment plan. Alarm symptoms such as bleeding, persistent vomiting, unexplained weight loss, or severe upper-abdominal pain require cause-directed evaluation; depending on the clinical question, this may include upper endoscopy rather than repeating a noninvasive test alone."],
        ["Red flags and escalation", "A positive test by itself is not an emergency. Promptly escalate suspected hemorrhage or major bleeding from the upper GI tract, including vomiting blood or coffee-ground material or passing black stools. Also report severe or frequent upper-abdominal pain, persistent vomiting, unexplained weight loss, or a family history of stomach cancer for timely clinician evaluation."],
        ["Limits: what the tests do not prove", "A positive breath or stool antigen test supports active H. pylori infection but does not prove that an ulcer or stomach cancer is present. A negative test does not rule out infection when collection, medication exposure, or post-treatment timing can suppress detection. Serology may remain positive after old infection and does not confirm active infection or eradication."]
      ],
      sourceKeys: ["acg-h-pylori-2024", "acg-h-pylori-patient-2025"],
      sourceNote: "Test-of-cure timing and medication holds follow the American College of Gastroenterology's 2024 guideline highlights. The ACG patient guidance supports active-infection testing, peptic-ulcer and stomach-cancer consequences, and the listed alarm symptoms. Apply the prescriber's instructions and local testing protocol rather than stopping treatment independently.",
      tags: ["H. pylori breath test", "H pylori stool test", "urea breath test", "stool antigen", "Helicobacter pylori", "false negative PPI", "bismuth", "antibiotics", "eradication testing"]
    },
    "Peak Flow": {
      summary: "Peak flow, or peak expiratory flow, is a quick effort-dependent measure of how fast a person can blow air out. In asthma, falling values can reflect narrowing airways and are compared with that person's established personal best and symptoms.",
      quickAnswer: "A falling peak-flow result compared with personal best suggests worsening airway narrowing in asthma and can signal an approaching asthma attack; it does not diagnose asthma or prove that breathing is safe by itself. Green is near personal best at 80% or more, yellow is reduced at 50-79%, and red is severely reduced below 50%. Symptoms and the individualized written asthma action plan still govern what to do.",
      whyItMatters: "Peak flow matters because a fall from personal best can reveal worsening airway obstruction early, prompt the person's written asthma action plan, and identify severe reduction that needs urgent assessment.",
      sections: [
        ["What it means clinically", "As airways narrow from inflammation or tightening muscle, peak-flow readings fall. A low or falling trend can reveal worsening asthma before symptoms become obvious and can help assess response during an asthma attack. Because the result depends on effort and technique, interpret it with symptoms and the written asthma action plan."],
        ["Objective traffic-light zones", "A common NHLBI written-action-plan framework defines green or near personal best as at least 80% of personal best, yellow or reduced as 50-79%, and red or severely reduced as below 50%. These percentages are individualized zones, not one universal liters-per-minute cutoff for every age, height, sex, meter, or patient."],
        ["Nursing assessment and next steps", "Assess cough, wheeze, chest tightness, speech, activity tolerance, work of breathing, oxygenation, rescue-medicine use, and response. Check technique, repeat the maneuver three times, record the highest acceptable reading and percent of personal best, and follow the person's written asthma action plan and prescribed rescue steps rather than improvising treatment from a color alone."],
        ["Trend and follow-up evaluation", "Trend peak flow against the person's own personal best, symptoms, rescue-medicine use, and response rather than comparing raw values between people. If symptoms or readings do not return toward the green zone after prescribed action-plan steps, seek clinician follow-up or formal evaluation and review meter technique; respiratory distress requires emergency care without waiting for another reading."],
        ["Urgent context", "Severe breathlessness, inability to speak or perform usual activity, cyanosis, exhaustion, altered consciousness, a silent chest, or poor response to prescribed rescue medicine requires urgent assessment even when technique or the displayed peak-flow value is uncertain."],
        ["Limits: what peak flow does not prove", "Peak flow does not diagnose asthma, grade every exacerbation reliably, or rule out severe respiratory compromise by itself. Effort, technique, meter differences, and the person's baseline affect the reading. A reassuring number does not override severe distress."]
      ],
      sourceKeys: ["nhlbi-asthma-action-plan", "nhlbi-managing-asthma-schools", "nhlbi-asthma-epr3"],
      sourceNote: "NHLBI's written asthma action plan supplies the common personal-best percentages and danger cues. NHLBI's technique guidance supports the airway-narrowing interpretation, early worsening-asthma signal, three attempts with the highest recorded value, and symptom-based assessment. The NHLBI expert-panel report supports using the meter for monitoring rather than as a stand-alone diagnostic tool. The patient's symptoms, meter, clinician-defined zones, and written plan determine real-world action.",
      tags: ["peak expiratory flow", "peak flow personal best", "green zone 80 100", "yellow zone 50 79", "red zone below 50", "asthma action plan"]
    },
    "LFTs": {
      summary: "Liver function tests (LFTs), also called a hepatic function panel or liver chemistries, are a group of blood tests used to separate liver-cell injury, impaired bile flow, bilirubin-processing problems, and reduced synthetic function. The name is imperfect because AST, ALT, alkaline phosphatase, and GGT mainly show injury or cholestasis; albumin and PT/INR more directly reflect the liver's protein-synthesis capacity.",
      quickAnswer: "An LFT result pattern can signal hepatocellular injury, cholestasis or biliary obstruction, bilirubin-processing problems, or impaired synthetic function, but it does not diagnose the cause or severity by itself. AST/ALT predominance suggests viral, medication or toxin, ischemic, autoimmune, metabolic, or alcohol-associated injury; alkaline phosphatase with GGT and direct bilirubin suggests impaired bile flow. Albumin and PT/INR add synthetic-function context, and symptoms, baseline, and trend determine urgency.",
      before: "Confirm which tests were actually ordered because a CMP, hepatic panel, and locally named LFT panel may contain different components. Use that laboratory's reference intervals and the client's baseline. Review alcohol, prescription and over-the-counter medicines, acetaminophen-containing products, herbals and supplements, recent medication changes, viral exposure risks, metabolic disease, pregnancy, hypotension or sepsis, muscle injury, and known liver disease.",
      after: "Record the exact values, local upper limits, collection time, baseline, and direction of change. Assess mental status, asterixis, jaundice, pruritus, dark urine, pale stool, right-upper-quadrant pain, fever, nausea or vomiting, bruising or bleeding, edema or ascites, vital signs, glucose when acute failure is possible, intake and output, and hemodynamic stability. Escalate the clinical pattern rather than reacting to one enzyme alone.",
      redFlags: "Urgently escalate suspected acetaminophen or other toxic ingestion; acute hepatitis with prolonged PT/INR; new confusion, somnolence, personality change, disorientation, or asterixis; rapidly worsening jaundice or INR; hypoglycemia; active bleeding; shock; or systemic deterioration. Acute liver injury or illness developing within 26 weeks, with INR at least 1.5 and new encephalopathy in a patient without preexisting chronic liver disease, fits the usual acute-liver-failure framework and needs emergency, transplant-capable evaluation.",
      trap: "Do not equate high AST or ALT with liver failure, and do not assume normal aminotransferases exclude cirrhosis or important chronic disease. ALP is not automatically hepatic, low albumin is not automatically liver disease, isolated GGT does not diagnose alcohol use, and INR in cirrhosis does not predict bleeding risk by itself. Falling enzymes are reassuring only when the client, bilirubin, INR, and other severity markers are also improving.",
      sections: [
        ["What LFTs actually measure", "Panel composition varies, but a hepatic function panel commonly includes AST, ALT, alkaline phosphatase, total and direct bilirubin, albumin, and total protein. GGT and PT/INR may be ordered separately. AST, ALT, ALP, and GGT are better described as liver-injury or cholestasis markers. Albumin and PT/INR assess synthesis more directly, while bilirubin reflects production, conjugation, and excretion. This is why a person can have very high enzymes without liver failure, or advanced chronic liver disease with only modest enzyme abnormalities."],
        ["Reference ranges and panel variation", "There is no single universal LFT range because an LFT panel contains several different measurements, and panel composition varies. Use the reporting laboratory's reference interval for every component. Age, sex, pregnancy, childhood growth, assay method, recent exercise or muscle injury, medicines, and the clinical setting can change interpretation. Compare the result with the client's own baseline and trend instead of copying one hard-coded range."],
        ["Before / preparation", "Confirm which tests were actually ordered because a CMP, hepatic panel, and locally named LFT panel may contain different components. Use that laboratory's reference intervals and the client's baseline. Review alcohol, prescription and over-the-counter medicines, acetaminophen-containing products, herbals and supplements, recent medication changes, viral exposure risks, metabolic disease, pregnancy, hypotension or sepsis, muscle injury, and known liver disease. Fasting is not universally required for every hepatic panel; follow the specific order and laboratory instructions."],
        ["Component map and the why behind each value", "ALT is concentrated in hepatocytes, so cell injury releases it and it is more liver-specific than AST. AST is also present in skeletal muscle, heart, brain, and other tissues, so muscle injury or hemolysis can confuse the source. Cholestasis stimulates ALP production near canalicular and bile-duct membranes, but bone, placenta, and childhood growth can also raise ALP; GGT or 5-prime nucleotidase can help confirm a hepatobiliary source. Total bilirubin combines conjugated and unconjugated fractions. Albumin changes slowly and is more useful for chronic synthetic context, while PT/INR can change sooner because several clotting factors have short half-lives."],
        ["Hepatocellular, cholestatic, and mixed patterns", "A hepatocellular pattern means AST and ALT rise disproportionately to ALP, pointing toward hepatocyte injury such as viral, medication or supplement, acetaminophen, ischemic, autoimmune, metabolic, or alcohol-associated causes. A cholestatic pattern means ALP rises disproportionately, often with direct bilirubin, because bile formation or flow is impaired; first confirm the source, then consider ultrasound and cause-directed biliary evaluation. A mixed pattern has substantial aminotransferase and ALP elevation without clear predominance. The pattern localizes the process; it does not identify the cause or severity by itself."],
        ["Synthetic function and severity", "Albumin is synthesized by hepatocytes but has a long half-life, so a low value usually reflects a longer process and may instead result from inflammation, malnutrition, kidney loss, protein-losing gastrointestinal disease, or dilution. PT/INR can reveal severe acute synthetic dysfunction sooner, but vitamin K deficiency, malabsorption, warfarin or another anticoagulant, disseminated intravascular coagulation, and inherited coagulation disorders can also prolong it. In cirrhosis, INR alone is not a reliable bleeding-risk measurement because procoagulant and anticoagulant factors are both altered."],
        ["Direct versus indirect bilirubin", "Unconjugated bilirubin comes largely from heme breakdown and travels to the liver bound to albumin. The liver conjugates it so it becomes water-soluble and can be excreted in bile. Predominantly indirect elevation suggests overproduction such as hemolysis, reduced uptake, or impaired conjugation such as Gilbert syndrome. Predominantly direct elevation suggests impaired excretion from hepatocellular disease or intrahepatic or extrahepatic cholestasis. Fractionation narrows the mechanism but does not name the diagnosis."],
        ["R ratio - a pattern tool, not a diagnosis", "The R ratio is (ALT divided by that laboratory's ALT upper limit) divided by (ALP divided by that laboratory's ALP upper limit). In the commonly used drug-induced-liver-injury convention, R at least 5 is hepatocellular, R no more than 2 is cholestatic, and values above 2 but below 5 are mixed. Use ALT and ALP from the same collection and the local upper limits. Bilirubin is not part of the equation. The ratio describes a biochemical pattern; it does not determine cause, severity, prognosis, or whether liver failure is present."],
        ["Step-by-step interpretation", "First check urgency instead of delaying care to repeat a dangerous result. Confirm the actual panel and local reference intervals, then compare with the client's baseline and trend. Separate hepatocyte injury (AST/ALT), cholestasis/source (ALP/GGT), bilirubin processing, and synthesis (albumin/PT-INR). Fractionate isolated bilirubin and clarify isolated ALP when needed. Reconcile all medications, OTC products, acetaminophen, alcohol, and supplements. Cause-directed evaluation may include CBC and platelets, hepatitis testing, iron studies, acetaminophen level, CK for muscle injury, hemolysis studies, autoimmune markers, ultrasound, MRCP/ERCP, elastography, or biopsy."],
        ["Priority nursing assessment and documentation", "Trend exact results with collection times and local ranges. Assess mental status and asterixis, jaundice, itching, urine and stool color, right-upper-quadrant pain, fever, vomiting, bruising or bleeding, edema and ascites, glucose, vital signs, intake and output, and perfusion. Document exposure and medication history precisely, including combination products and supplements. Do not tell a patient to stop a prescribed medicine from one isolated abnormal panel; rapidly escalate suspected drug injury and follow the prescriber, pharmacist, poison-control, and facility pathway."],
        ["Concerning results / reportable cues", "Urgently report suspected acetaminophen or other toxic ingestion; acute hepatitis with prolonged PT/INR; new confusion, somnolence, personality change, disorientation, or asterixis; rapidly worsening jaundice or INR; hypoglycemia; active bleeding; shock; or systemic deterioration. Acute liver injury or illness developing within 26 weeks, with INR at least 1.5 and new encephalopathy in a patient without preexisting chronic liver disease, fits the usual acute-liver-failure framework and requires emergency, transplant-capable evaluation."],
        ["Common misconceptions and pitfalls", "LFT does not mean every component directly measures function. Transaminitis describes aminotransferase elevation; it is not a disease and does not cover cholestasis or synthetic dysfunction. An AST-to-ALT ratio is a clue, not a diagnosis. GGT is useful for source clarification but is too nonspecific as an isolated screening test. A normal ALT does not rule out significant liver disease, and a low albumin does not prove liver failure. Interpret the whole pattern with the patient."],
        ["Common NCLEX trap / nuance", "Do not equate high AST or ALT with liver failure, and do not assume normal aminotransferases exclude cirrhosis or important chronic disease. ALP is not automatically hepatic, low albumin is not automatically liver disease, isolated GGT does not diagnose alcohol use, and INR in cirrhosis does not predict bleeding risk by itself. Falling enzymes are reassuring only when the client, bilirubin, INR, and other severity markers are also improving."],
        ["Urgent escalation", "Acute liver injury plus any new altered mental status, asterixis, or prolonged PT/INR is urgent. Suspected acetaminophen or toxic exposure, rapidly rising bilirubin or INR, hypoglycemia, hemodynamic instability, active bleeding, severe systemic illness, or new encephalopathy requires immediate provider or emergency-team notification. Acute liver injury or illness developing within 26 weeks, with INR at least 1.5 and new encephalopathy in a patient without preexisting chronic liver disease, should trigger acute-liver-failure and transplant-center thinking because deterioration can be rapid."]
      ],
      resultMeanings: [
        ["Hepatocellular pattern", "AST and ALT predominate because injured hepatocytes release intracellular aminotransferases. ALT is more liver-specific; AST may also come from muscle or other tissues. Pattern and trajectory guide the cause evaluation, while enzyme height alone does not measure remaining liver function."],
        ["Cholestatic pattern", "Alkaline phosphatase, often with GGT and direct bilirubin, predominates because bile formation or flow is impaired. Confirm the ALP source and use symptoms and imaging to distinguish intrahepatic cholestasis from extrahepatic obstruction."],
        ["Mixed pattern", "Aminotransferases and alkaline phosphatase are both substantially elevated without one clear predominance. Medication or supplement injury is important, but viral, alcohol-associated, metabolic, autoimmune, ischemic, septic, infiltrative, and biliary causes remain possible."],
        ["Synthetic dysfunction pattern", "Rising PT/INR and low albumin add severity and time-course information, but must be separated from anticoagulants, vitamin K deficiency, inflammation, malnutrition, kidney or gastrointestinal protein loss, dilution, and DIC. New INR elevation with encephalopathy is an emergency pattern."]
      ],
      sourceKeys: [
        "aasld-liver-enzymes-2025",
        "acg-abnormal-liver-chemistries",
        "va-liver-synthetic-function",
        "nih-livertox-rucam",
        "aasld-acute-liver-failure"
      ],
      sourceNote: "This entry distinguishes liver injury, cholestasis, bilirubin handling, and synthetic function using current AASLD, ACG, NIH LiverTox, and U.S. Department of Veterans Affairs educational guidance. Use the reporting laboratory's ranges and current local protocols for real care.",
      tags: ["hepatic function panel", "hepatic panel", "liver panel", "liver chemistries", "liver enzymes", "AST", "ALT", "SGOT", "SGPT", "alkaline phosphatase", "ALP", "alk phos", "GGT", "bilirubin", "albumin", "PT INR", "synthetic function", "hepatocellular pattern", "cholestatic pattern", "mixed liver injury", "R ratio", "transaminitis", "acute liver failure"]
    },
    "Cardiac catheterization": {
      after: "After the procedure, monitor puncture site, distal pulses, color, temperature, sensation, bleeding/hematoma, kidney function if contrast was used, chest pain, and vital signs.",
      trap: "Post-cath leg pain, bleeding, absent pulse, neurovascular change, chest pain, or hypotension is not routine."
    },
    "Coronary angiography": {
      after: "Monitor for contrast reaction, bleeding/hematoma, kidney injury risk, chest pain, and distal circulation after access-site procedures.",
      trap: "Contrast plus kidney risk matters. Hydration and ordered renal monitoring are not decorative."
    },
    "PCI": {
      before: "Assess chest pain, perfusion, allergies, kidney function/contrast risk, anticoagulant/antiplatelet status, baseline pulses, and whether consent and emergency readiness are complete.",
      after: "Monitor access site bleeding/hematoma, distal pulses, chest pain, rhythm, blood pressure, contrast reaction, kidney function, and prescribed antiplatelet therapy teaching.",
      redFlags: "New chest pain, ST changes, hypotension, access-site bleeding, expanding hematoma, absent distal pulse, stroke symptoms, acute dyspnea, or contrast reaction.",
      trap: "After stent placement, antiplatelet adherence is a safety issue. Stopping therapy early can cause stent thrombosis."
    },
    "CABG": {
      before: "Verify consent, NPO status, type/crossmatch, baseline vitals, rhythm, lung sounds, renal function, glucose, coagulation status, current anticoagulants/antiplatelets, and teaching about coughing, deep breathing, incentive spirometry, pain control, tubes/lines, and sternal precautions.",
      after: "Monitor airway/ventilation, hemodynamics, rhythm, chest-tube output, bleeding, tamponade cues, graft perfusion, urine output, electrolytes, glucose, pain, temperature, neuro status, lung expansion, sternal wound integrity, and progressive mobility.",
      redFlags: "Sudden high or stopped chest-tube output, hypotension, muffled heart sounds, jugular venous distention, new dysrhythmia, low urine output, chest pain, stroke symptoms, fever, sternal instability, wound drainage, or respiratory distress.",
      trap: "After CABG, the nurse thinks ABCs, bleeding/tamponade, dysrhythmias, perfusion, pain control, pulmonary hygiene, and sternal precautions. Do not treat new bleeding, hypotension, or rhythm change as routine recovery."
    },
    "Pacemaker insertion": {
      before: "Assess rhythm, symptoms, electrolytes, digoxin/beta-blocker/calcium-channel blocker exposure, consent, allergies, anticoagulants, and baseline neurovascular status of the affected side.",
      after: "Monitor rhythm capture, pacing spikes, heart rate, blood pressure, incision bleeding, infection, chest pain, hiccups/diaphragmatic pacing, pneumothorax symptoms, and arm restrictions per protocol.",
      redFlags: "Failure to capture, failure to sense, bradycardia with symptoms, syncope, chest pain, dyspnea, unilateral absent breath sounds, bleeding/hematoma, fever, or incision drainage.",
      trap: "Do not raise the affected arm above shoulder level early after insertion if restricted by protocol. Check rhythm and client perfusion, not just the pacemaker site."
    },
    "ICD insertion": {
      before: "Assess dysrhythmia history, electrolytes, kidney function, anticoagulants, consent, allergies, baseline rhythm, and teaching needs about shocks and device precautions.",
      after: "Monitor rhythm, incision, bleeding, infection, pain, pneumothorax symptoms, anxiety after shocks, and device teaching about reporting repeated shocks or syncope.",
      redFlags: "Multiple shocks, syncope, chest pain, dyspnea, fever, incision drainage, swelling/hematoma, or symptoms suggesting device malfunction.",
      trap: "An ICD treats dangerous ventricular rhythms; it does not prevent all dysrhythmias or remove the need to assess the client after a shock."
    },
    "Cardioversion": {
      before: "Assess rhythm, hemodynamic stability, anticoagulation status when atrial fibrillation/flutter timing matters, consent if elective, sedation readiness, oxygen, suction, IV access, and defibrillator synchronization.",
      after: "Monitor airway after sedation, rhythm, blood pressure, chest discomfort, skin burns, neuro status, recurrence of dysrhythmia, and anticoagulation plan when applicable.",
      redFlags: "Loss of pulse, hypotension, respiratory depression after sedation, stroke symptoms, recurrent unstable tachydysrhythmia, or worsening chest pain.",
      trap: "Cardioversion is synchronized. Defibrillation is unsynchronized. NCLEX loves that distinction."
    },
    "Defibrillation": {
      before: "For pulseless ventricular tachycardia or ventricular fibrillation, prioritize CPR, defibrillator readiness, pad placement, clear communication, and rapid shock per algorithm.",
      after: "Resume CPR immediately after shock per resuscitation algorithm, reassess rhythm/pulse at appropriate intervals, and continue airway, IV/IO, medication, and reversible-cause priorities.",
      redFlags: "Persistent pulseless rhythm, delayed CPR, unsafe contact during shock, failure to clear, or rhythm misidentification.",
      trap: "Defibrillation is unsynchronized for pulseless VT/VF. Do not delay shock for lengthy assessment when the rhythm and pulseless status are clear."
    },
    "TEE": {
      before: "Because TEE involves the esophagus and sedation, verify NPO status, consent, gag reflex/sedation recovery plan, and aspiration precautions.",
      after: "Keep NPO until gag reflex returns per policy and monitor airway, swallowing, bleeding, chest pain, and sedation recovery.",
      trap: "Do not give oral intake immediately after throat anesthesia/sedation."
    },
    "Bronchoscopy": {
      summary: "Bronchoscopy uses a thin camera tube called a bronchoscope to examine the trachea (windpipe) and bronchi (large airways), collect selected samples, remove an obstruction, control some bleeding, or perform another planned airway treatment.",
      quickAnswer: "Bronchoscopy directly shows the central airways and may collect a biopsy (small tissue sample), brushing, or wash for laboratory review. It can identify or treat visible bleeding, narrowing, a foreign body, mucus plugging, infection-related changes, or a mass. A normal-looking airway or a negative, inadequate, or pending sample does not rule out peripheral, microscopic, intermittent, or outside-the-airway disease.",
      whyItMatters: "Bronchoscopy matters because finding and treating an airway blockage or bleeding source can protect ventilation, while tissue or fluid results can change infection or cancer care. Before and after the procedure, assess airway, breathing, circulation, oxygenation, sedation recovery, and bleeding. Worsening shortness of breath, low oxygen, heavy or increasing coughing of blood, chest pain, unequal breath sounds, fever with deterioration, or unstable vital signs requires urgent evaluation for hypoxemia (low blood oxygen), bronchospasm (tight airways), bleeding, pneumothorax (a collapsed lung), infection, or a sedation-related heart or breathing problem.",
      before: "Confirm the exact indication and planned intervention, consent process, allergies, baseline respiratory and oxygenation findings, sedation and airway plan, bleeding risk, and the clinician-approved plan for antithrombotic medicines that reduce clotting. Follow the patient-specific fasting and medicine instructions; do not independently stop medicines or apply one universal fasting interval.",
      after: "Monitor airway, breathing, circulation, oxygenation, alertness, pain, fever, breath sounds, and the amount and trend of coughed blood according to the procedure and sedation plan. Resume oral intake only when local sedation-recovery, swallowing, and airway-protection criteria are satisfied.",
      trap: "A small blood streak may occur after a biopsy, but there is no universal safe amount. Increasing or persistent blood, clots or heavy bleeding, breathing difficulty, chest pain, low oxygen, or instability requires urgent assessment.",
      sections: [
        ["What it means clinically", "A bronchoscope is a thin flexible or rigid camera tube passed through the nose or mouth into the trachea and bronchi. It can inspect the airway, suction secretions, remove a foreign body or mucus plug, control selected bleeding, or collect a biopsy, brushing, or wash. The exact procedure and sample depend on the clinical question."],
        ["Before / individualized preparation", "Confirm the exact indication and planned intervention, consent process, allergies, baseline breathing and oxygenation, sedation and airway plan, transportation or supervision after sedation, and bleeding risk. Verify the clinician-approved plan for prescription medicines, antithrombotic medicines that reduce clotting, and diabetes treatment. Follow this patient's ordered fasting and medicine instructions rather than using one schedule for everyone or independently stopping a medicine."],
        ["Specimen and result ownership", "Document the exact airway site, visible finding, intervention, and specimen type. Label and route each biopsy, brushing, or wash to microbiology (testing for organisms), cytology (examining cells), or pathology (examining tissue) as ordered. Record who is responsible for tracking each delayed result, communicating it to the patient, and arranging the next evaluation."],
        ["After / priority nursing assessment", "Monitor airway, breathing, circulation, oxygenation, alertness, pain, temperature, breath sounds, cough, and the amount and trend of coughed blood according to the sedation and procedure plan. Resume oral intake only when local sedation-recovery, swallowing, and airway-protection criteria are satisfied; a gag-reflex check alone is not a universal clearance rule."],
        ["Urgent safety cues", "Escalate worsening shortness of breath, low oxygen, wheezing or tight breathing, heavy or increasing coughing of blood, clots, chest pain, unequal or newly decreased breath sounds, fever with clinical deterioration, low blood pressure, or other instability. These findings require assessment for hypoxemia, bronchospasm, bleeding, pneumothorax, infection, or a sedation-related complication rather than waiting for routine follow-up."],
        ["Limits and follow-up", "A visually normal central airway does not exclude a peripheral lung lesion, microscopic disease, intermittent bleeding, an outside-the-airway process, or another cause of symptoms. A negative or inadequate biopsy, brushing, or wash does not by itself rule out cancer or infection. Culture, cytology, or pathology may return later, and persistent concern may require repeat sampling, imaging, surgery, or another clinician-selected evaluation." ]
      ],
      resultMeanings: [
        ["Complete examination with no important visible abnormality", "The intended central airways were examined without a major visible lesion. This lowers concern for many central-airway problems but does not exclude peripheral, microscopic, intermittent, or outside-the-airway disease."],
        ["Visible lesion, obstruction, bleeding source, or foreign body", "The finding can guide removal, bleeding control, biopsy, imaging, surgery, or specialty follow-up. Appearance alone does not establish the exact tissue diagnosis."],
        ["Biopsy, brushing, or wash obtained", "The procedure supplied tissue, cells, or fluid for microbiology, cytology, or pathology. The immediate bronchoscopy report is not the final sample result, so responsible result tracking and communication are required."],
        ["Incomplete, negative, or nondiagnostic procedure or sample", "The target was not reached, the sample was inadequate, or no diagnosis was established. A negative or nondiagnostic result does not rule out the suspected condition; the responsible clinician uses pretest concern, imaging, sample quality, and symptoms to select follow-up."]
      ],
      sourceKeys: [
        "ani-pulmonary-bts-bronchoscopy-safety-2023",
        "ani-pulmonary-nlm-bronchoscopy-bal-2024",
        "ani-pulmonary-nhlbi-lung-tests"
      ],
      sourceNote: "BTS safety standards support procedure verification, monitoring, specimen handoff, documentation, recovery, and escalation; MedlinePlus supports the learner-facing procedure, preparation, recovery, sample follow-up, and major risks; NHLBI supports airway viewing, sampling, obstruction removal, and selected treatments. Apply the individual procedure, sedation, medicine, and follow-up plan.",
      tags: ["flexible bronchoscopy", "rigid bronchoscopy", "airway inspection", "bronchoscopic biopsy", "bronchial brushing", "airway obstruction", "foreign body removal", "hemoptysis", "pneumothorax", "specimen tracking"]
    },
    "Thoracentesis": {
      summary: "Thoracentesis, also called pleural aspiration, passes a needle or small catheter through the chest wall into the pleural space, the space between the lung and chest wall, to remove fluid for diagnostic testing or symptom relief.",
      quickAnswer: "Thoracentesis can relieve breathing difficulty from a pleural effusion and provide fluid for cell counts, chemistry, microbiology, or cytology. Use thoracic ultrasound to confirm a safe fluid pocket and procedure site. Drain slowly and stop for chest tightness, pain, persistent cough, worsening breathlessness, low oxygen, or instability. Pleural-fluid classification or a negative culture or cytology result does not identify or exclude the cause by itself.",
      whyItMatters: "Thoracentesis matters because pleural-fluid results can uncover infection, malignancy, or a systemic cause while therapeutic drainage can improve breathing. The same procedure can cause pneumothorax (air that collapses part of the lung), hemothorax (blood in the pleural space), organ or vessel injury, infection, or re-expansion pulmonary edema (lung swelling after rapid re-expansion). New breathing difficulty, low oxygen, chest pain, unequal breath sounds, coughing blood, expanding site swelling, hypotension, or rapid deterioration requires urgent assessment.",
      before: "Confirm the indication, side, consent process, ultrasound findings in the procedure position, baseline breathing and oxygenation, allergies, bleeding history, and the clinician-approved antithrombotic plan. Use the individual medication, laboratory, positioning, and specimen plan rather than inventing one universal coagulation cutoff.",
      after: "Monitor breathing, oxygenation, vital signs, breath sounds, pain, cough, and the puncture site. Postprocedure chest imaging is selective: symptoms, a complicated procedure, multiple attempts, suspected injury, or another specific clinical purpose can require it, while a straightforward asymptomatic ultrasound-guided procedure does not automatically require a chest x-ray.",
      trap: "The BTS adult statement advises, in general, no more than 1.5 L in one aspiration attempt, but symptoms require stopping sooner and expert-monitored exceptions exist. This is bounded adult guidance, not a universal volume promise or substitute for bedside monitoring.",
      sections: [
        ["What it means clinically", "Thoracentesis removes pleural fluid through a needle or small catheter. A diagnostic tap collects fluid to help classify an effusion and investigate infection, malignancy, inflammation, or a systemic cause. A therapeutic tap removes fluid to relieve pressure and breathlessness. Planned aspiration of pleural air may occur in selected settings, but emergency tension-pneumothorax decompression follows a separate emergency protocol."],
        ["Before / ultrasound and individualized preparation", "Confirm the indication, correct side, consent process, recent imaging, allergies, baseline respiratory findings and oxygenation, and the planned diagnostic or therapeutic goal. Thoracic ultrasound must identify a safe fluid pocket in the position used for the procedure; if a site is marked, avoid moving the patient before the tap. Review bleeding history, antithrombotic medicines, and the clinician-approved plan. Do not create one universal international normalized ratio (INR), platelet, medication-hold, or positioning rule."],
        ["During / drainage and stopping", "Use the ultrasound-selected path and trained local technique, enter above the rib to reduce neurovascular-bundle injury, and drain therapeutic fluid slowly by manual syringe or gravity rather than wall suction or a vacuum bottle. Stop for chest tightness, pain, persistent cough, worsening breathlessness, low oxygen, or hemodynamic instability. The BTS adult statement advises, in general, no more than 1.5 L in one attempt; symptoms stop the procedure sooner, and larger expert-monitored aspirations are context-dependent exceptions rather than a universal rule."],
        ["Specimen and result ownership", "Document the side, site, diagnostic or therapeutic purpose, fluid appearance and volume, and every ordered specimen. Use paired serum protein and lactate dehydrogenase (LDH) when applying Light's criteria. Route cell count and differential, chemistry, microbiology, and cytology according to the question. When pleural infection is suspected, collect pH promptly in the correct blood-gas syringe without local-anesthetic or residual-heparin contamination and avoid air or processing delay. Record who tracks delayed cultures or cytology, communicates results, and arranges the next test."],
        ["After / urgent safety and imaging", "Reassess airway and breathing, oxygenation, vital signs, bilateral breath sounds, pain, cough, and the puncture site. Escalate new or worsening shortness of breath, low oxygen, unilateral absent or reduced breath sounds, chest pain, coughing blood, expanding swelling or bruising, hypotension, fever with deterioration, or other instability for pneumothorax, bleeding or hemothorax, organ injury, infection, or re-expansion pulmonary edema. Consider chest radiography when symptoms do not promptly resolve, the procedure was complicated, multiple attempts occurred, or another specific clinical purpose exists. A routine chest x-ray is not required after a straightforward asymptomatic ultrasound-guided tap; postprocedure ultrasound and lung sliding may support assessment when locally available and interpreted by a trained clinician."],
        ["Limits and follow-up", "Light's criteria classify pleural fluid as exudative or transudative; they do not name the cause. Pleural-fluid pH thresholds guide a specific adult suspected-parapneumonic-effusion pathway and depend on correct collection. Negative culture does not exclude infection, and negative cytology does not exclude malignancy. Integrate symptoms, imaging, paired serum tests, sample quality, treatment before collection, and pretest concern; persistent concern may require repeat sampling, pleural biopsy, drainage, imaging, or specialty review."]
      ],
      resultMeanings: [
        ["Transudative classification by Light's criteria", "When none of Light's three criteria is met, the fluid is classified as transudative, which supports a systemic pressure or protein-balance mechanism. This is a classification, not a final cause, and it must be interpreted with the clinical picture and paired serum results."],
        ["Exudative classification by Light's criteria", "Pleural fluid is classified as exudative when any one criterion is met: pleural-fluid protein divided by serum protein is greater than 0.5; pleural-fluid LDH divided by serum LDH is greater than 0.6; or pleural-fluid LDH is greater than two-thirds of that laboratory's serum LDH upper limit. This bounded classification supports a local pleural process but does not distinguish infection, malignancy, inflammation, embolism, or another cause by itself."],
        ["Adult suspected parapneumonic effusion / pleural-infection pathway", "In the BTS adult pathway, frank pus establishes pleural infection. For nonpurulent fluid when parapneumonic infection is suspected, pH 7.2 or lower indicates high risk and supports drainage when ultrasound shows safely accessible fluid; pH above 7.2 but below 7.4 is intermediate risk, so LDH above 900 IU/L and other clinical or imaging features guide the decision. Local anesthetic or residual heparin can lower pH, while air or processing delay can raise it. These thresholds are disease- and sample-context specific, not universal pleural-fluid cutoffs."],
        ["Positive, negative, or nondiagnostic microbiology or cytology", "A positive culture or malignant cytology can establish a specific finding when the specimen and clinical context fit. A negative culture can follow prior treatment or limited organism recovery, and negative or inadequate cytology does not rule out malignancy. The responsible team uses sample quality, imaging, pretest concern, and the clinical course to choose follow-up."]
      ],
      sourceKeys: [
        "ani-pleural-bts-pleural-procedures-2023",
        "ani-pleural-shm-thoracentesis-ultrasound-2018",
        "ani-pleural-bts-pleural-disease-2023"
      ],
      sourceNote: "The BTS adult pleural-procedure statement supports ultrasound, controlled drainage, symptom-based stopping, bounded volume guidance, monitoring, and selective postprocedure imaging; the Society of Hospital Medicine statement supports ultrasound anatomy, site and lung-sliding assessment and avoiding routine radiography after a successful asymptomatic ultrasound-guided tap; the BTS pleural-disease guideline supports Light's classification, the adult suspected-infection pH pathway, sample handling, and negative-cytology follow-up. Apply the individual indication, procedural plan, laboratory method, and clinical context.",
      tags: ["safe-site thoracentesis", "pleural fluid specimen", "Light criteria", "pleural fluid pH", "pleural cytology", "post-thoracentesis pneumothorax", "hemothorax", "re-expansion pulmonary edema", "specimen tracking"]
    },
    "Paracentesis": {
      summary: "Paracentesis passes a needle or catheter through the abdominal wall into the peritoneal space, the space around the abdominal organs, to collect or therapeutically remove ascitic fluid.",
      quickAnswer: "Paracentesis can diagnose the cause of new ascites, evaluate spontaneous bacterial peritonitis (SBP), or relieve tense fluid that impairs comfort or breathing. Use ultrasound to confirm drainable fluid and a safe path, with color-flow Doppler when assessing abdominal-wall vessels. In cirrhosis, SBP and albumin guidance use specific thresholds, but those thresholds do not become universal rules for every patient or every paracentesis.",
      whyItMatters: "Paracentesis matters because SBP can be present without classic abdominal symptoms and can rapidly lead to sepsis, kidney injury, or death, while serum-ascites albumin gradient and targeted fluid tests can redirect the diagnostic plan. Therapeutic removal can improve pressure and breathing but can cause bleeding, organ injury, infection, persistent leakage, hypotension, kidney injury, or post-paracentesis circulatory dysfunction. New severe abdominal or back pain, expanding bruising, persistent bleeding, syncope, hypotension, a rigid abdomen, fever with deterioration, falling urine output, or other instability requires urgent assessment.",
      before: "Confirm the indication, consent process, ultrasound-selected site and fluid pocket, baseline hemodynamics and abdominal findings, renal function, allergies, bleeding history, bladder plan, and the clinician-approved antithrombotic, specimen, drainage, and albumin plans. Do not invent one universal INR, platelet, voiding, or fluid-volume rule.",
      after: "Monitor blood pressure, dizziness, pain, abdominal findings, breathing, puncture-site leakage or bleeding, urine output, and renal and electrolyte trends according to the indication and amount removed. Escalate severe or worsening symptoms, bleeding, peritoneal signs, infection cues, oliguria, or instability.",
      trap: "For cirrhotic large-volume paracentesis, more than 5 L identifies the AASLD albumin-replacement context; it is not a universal drainage maximum. The usual 6-8 g of albumin per liter removed is clinician-directed guidance for that bounded context, not an automatic order for every tap.",
      sections: [
        ["What it means clinically", "Paracentesis removes ascitic fluid from the peritoneal space. Diagnostic sampling helps evaluate portal hypertension, infection, malignancy, pancreatic disease, or another cause. Therapeutic drainage can relieve tense abdominal pressure, pain, early fullness, or breathing limitation. The indication determines how much is collected, which tests are ordered, and what monitoring or replacement plan is needed."],
        ["Before / ultrasound and individualized preparation", "Confirm the indication, consent process, allergies, baseline blood pressure and abdominal findings, renal function, bleeding history, antithrombotic medicines, bladder plan, and intended diagnostic or therapeutic volume. Use ultrasound to confirm sufficient free fluid and select a path based on fluid depth, abdominal-wall thickness, and nearby organs. Assess the path in multiple planes and use color-flow Doppler to identify abdominal-wall vessels; if the patient moves after marking, reassess the site. Real-time guidance may be needed for a small or difficult collection. Do not create one universal INR, platelet, voiding, medication-hold, or positioning rule."],
        ["Specimen and result ownership", "Document the site, purpose, volume and appearance, and every ordered container. For initial ascites evaluation, obtain paired serum and ascitic albumin for the serum-ascites albumin gradient (SAAG), plus ascitic cell count with differential and total protein. In hospitalized cirrhosis or suspected infection, inoculate ascitic fluid into aerobic and anaerobic blood-culture bottles at the bedside before antibiotics when feasible; do not delay life-saving antibiotics in an unstable patient. Order glucose, LDH, cytology, amylase, or other tests only when the clinical question supports them. Record who tracks cultures, cytology, and the next evaluation."],
        ["Cirrhosis-specific SBP and coagulation context", "Patients with cirrhosis and ascites who are admitted unexpectedly or who develop infection, encephalopathy, kidney injury, gastrointestinal bleeding, hypotension, or otherwise unexplained deterioration need prompt diagnostic paracentesis for SBP evaluation, even when abdominal pain or fever is absent. An ascitic polymorphonuclear neutrophil (PMN) count of at least 250 cells/mm³ is the cirrhosis-specific treatment threshold; collect cultures first when feasible, but culture negativity does not cancel the PMN finding. A focal intra-abdominal infection can also raise PMNs and requires a secondary-source evaluation. In cirrhosis, prolonged INR or thrombocytopenia alone is not an automatic contraindication or reason for prophylactic plasma or platelets; disseminated intravascular coagulation, uremic platelet dysfunction, active bleeding, prior bleeding, antithrombotics, and local policy require individual review."],
        ["Therapeutic drainage and albumin context", "Monitor pain, blood pressure, symptoms, drainage, and catheter function during therapeutic removal. Stop and reassess for new severe pain, dizziness or syncope, hypotension, bleeding, resistance suggesting unsafe position, or instability. In AASLD cirrhosis guidance, albumin is recommended when more than 5 L is removed, usually 6-8 g per liter of ascites removed, to reduce post-paracentesis circulatory dysfunction. The more-than-5-L point defines this albumin-replacement context; it is not a universal drainage ceiling. The exact product, dose, timing, and plan for lower-volume or other-cause ascites are clinician-directed."],
        ["After / urgent safety and diagnostic limits", "Reassess vital signs, dizziness, abdominal pain, tenderness or rigidity, breathing, the puncture site, leakage, bleeding, urine output, and renal and electrolyte trends. Urgently escalate syncope or hypotension, new severe abdominal or back pain, an expanding abdominal wall or flank bruise, persistent bleeding, a rigid abdomen, fever with deterioration, falling urine output, or other instability for hemorrhage, organ injury, infection, or circulatory or kidney complications. SAAG and PMN thresholds answer bounded questions; they do not identify every cause. Negative culture can occur in SBP, a lower early PMN count does not override worsening clinical concern, and negative cytology does not exclude malignancy. Reassessment or repeat sampling may be required." ]
      ],
      resultMeanings: [
        ["SAAG 1.1 g/dL or greater", "For paired serum and ascitic albumin obtained in the same evaluation, a serum-ascites albumin gradient of at least 1.1 g/dL strongly supports portal hypertension. It does not distinguish cirrhosis from cardiac, vascular, or another portal-hypertensive cause by itself."],
        ["SAAG below 1.1 g/dL", "A gradient below 1.1 g/dL argues against portal hypertension and directs evaluation toward peritoneal malignancy, tuberculosis, pancreatic disease, or another non-portal-hypertensive cause according to the patient's context. It is not a stand-alone diagnosis."],
        ["Cirrhosis-specific PMN threshold for SBP", "In a patient with cirrhosis and ascites, an ascitic-fluid PMN count of at least 250 cells/mm³ meets the guideline threshold for the SBP treatment pathway after cultures are collected when feasible. Culture may be negative. A focal abdominal source can also raise PMNs, so this count does not by itself prove that infection is spontaneous rather than secondary."],
        ["Lower PMN count, negative culture, or other targeted result", "A PMN count below the cirrhosis-specific threshold and a negative culture lower support for established SBP at that sampling time but do not override worsening symptoms, sepsis, prior antibiotics, or an early process. Total protein, cytology, amylase, glucose, or LDH answers only the clinical question for which it was ordered; a negative or nondiagnostic result does not exclude every infection or malignancy."]
      ],
      sourceKeys: [
        "ani-ascites-shm-paracentesis-ultrasound-2019",
        "ani-ascites-aasld-guidance-2021"
      ],
      sourceNote: "The Society of Hospital Medicine statement supports ultrasound confirmation, multi-plane site assessment, Doppler vessel avoidance, stable positioning after marking, and real-time guidance for difficult collections; the AASLD cirrhosis guidance supports diagnostic sampling, paired SAAG, PMN and culture interpretation, coagulation nuance, and bounded albumin replacement after large-volume paracentesis. Apply the individual indication, cause of ascites, procedural plan, and clinical condition.",
      tags: ["safe-site paracentesis", "color Doppler vessel assessment", "ascitic fluid specimen", "serum-ascites albumin gradient", "spontaneous bacterial peritonitis evaluation", "ascitic PMN count", "large-volume paracentesis", "albumin replacement", "post-paracentesis circulatory dysfunction", "specimen tracking"]
    },
    "Lumbar puncture": {
      after: "Monitor neuro status, puncture site, headache, fever, drainage, pain, and ordered positioning/activity instructions.",
      trap: "New neurologic change, fever, severe headache, or CSF leak is not routine discomfort."
    },
    "Cranial nerve assessment": {
      summary: "Cranial nerve assessment is a high-yield neurologic exam that checks nerves I-XII for sensory, motor, pupil, eye movement, face, hearing, swallow, shoulder, and tongue findings.",
      quickAnswer: "Cranial nerve assessment: Screen CN I-XII in a focused way. NCLEX cares most about acute pupil change, facial droop, dysphagia, weak cough, hoarse voice, tongue deviation, diplopia, vision loss, and airway/aspiration safety.",
      before: "Compare with baseline, ask about acute vision/hearing/speech/swallow changes, check level of consciousness first, and keep aspiration precautions in mind before giving anything by mouth.",
      after: "Document the specific abnormal nerve finding, repeat neuro checks as ordered, protect airway and swallowing safety, keep NPO if swallow is unsafe, escalate acute focal deficits, and prepare stroke/neuro evaluation when indicated.",
      redFlags: "New facial droop, unequal or nonreactive pupils, diplopia, vision loss, dysphagia, absent gag or weak cough, hoarse voice, tongue deviation, severe headache, decreased level of consciousness, or any new unilateral deficit.",
      trap: "Do not give food, fluids, or oral medications after CN IX/X swallow impairment until swallowing is cleared. Do not dismiss a new pupil or cranial nerve change as minor.",
      sections: [
        ["What this assessment tells you", "Cranial nerve assessment localizes neurologic problems and catches safety risks. CN II and III help with vision and pupil clues. CN III, IV, and VI move the eyes. CN V and VII split facial sensation and facial movement. CN VIII checks hearing and vestibular clues. CN IX and X are major swallow, voice, gag, and airway-protection nerves. CN XI checks shoulder/head strength. CN XII checks tongue movement and articulation."],
        ["CN I - Olfactory", "Function: smell. Bedside assessment: test one nostril at a time with a familiar nonirritating odor when clinically needed. Do not use irritating substances because they can stimulate trigeminal pain fibers instead of smell."],
        ["CN II - Optic", "Function: visual acuity, visual fields, and afferent limb of the pupillary light response. Bedside assessment: check visual acuity, confrontation visual fields, pupil response with CN III, and fundoscopic exam when appropriate."],
        ["CN III - Oculomotor", "Function: pupil constriction, eyelid elevation, and most extraocular movements. Bedside assessment: check pupils for equal/reactive response, ptosis, and eye movement through the six cardinal fields. A fixed dilated pupil with neuro decline is urgent."],
        ["CN IV - Trochlear", "Function: moves the eye down and inward through the superior oblique muscle. Bedside assessment: include in extraocular movement testing and ask about diplopia, especially when looking down."],
        ["CN V - Trigeminal", "Function: facial sensation, chewing/mastication, and afferent limb of the corneal reflex. Bedside assessment: light touch or sharp/dull sensation over forehead, cheek, and jaw; ask the client to clench the jaw; assess corneal reflex only when indicated."],
        ["CN VI - Abducens", "Function: moves the eye laterally. Bedside assessment: include lateral gaze in extraocular movement testing. Inability to abduct the eye or new diplopia can be a neurologic warning cue."],
        ["CN VII - Facial", "Function: facial expression, taste anterior two thirds of tongue, and efferent limb of the corneal reflex. Bedside assessment: ask the client to raise eyebrows, close eyes tightly, smile, puff cheeks, and show teeth. Look for facial droop or asymmetry."],
        ["CN VIII - Vestibulocochlear", "Function: hearing and balance. Bedside assessment: whisper or finger-rub hearing screen, Weber/Rinne tests when needed, and assess dizziness, vertigo, nystagmus, or balance changes."],
        ["CN IX - Glossopharyngeal", "Function: swallowing, taste posterior tongue, pharyngeal sensation, and afferent limb of gag. Bedside assessment: assess swallowing, voice quality, palate/gag response when indicated, and aspiration risk."],
        ["CN X - Vagus", "Function: voice, palate elevation, swallowing, cough, parasympathetic output, and efferent limb of gag. Bedside assessment: listen for hoarseness, ask the client to say ah, check symmetric palate rise/uvula position, assess cough and swallow safety."],
        ["CN XI - Spinal accessory", "Function: shoulder shrug and head turn through trapezius and sternocleidomastoid. Bedside assessment: ask the client to shrug shoulders and turn head against resistance."],
        ["CN XII - Hypoglossal", "Function: tongue movement and articulation. Bedside assessment: ask the client to stick out the tongue and move it side to side. Tongue deviation, dysarthria, or trouble managing secretions can signal neurologic impairment."],
        ["Priority nursing actions", "If swallowing, gag, cough, or voice is abnormal, protect airway first and hold oral intake until the swallow is cleared. If findings are acute or unilateral, escalate urgently and think stroke/neuro pathway. Trend pupils, speech, facial symmetry, limb strength, level of consciousness, oxygenation, and glucose with the cranial nerve findings."],
        ["NCLEX traps and pairings", "CN III, IV, and VI are the eye-movement set. CN IX and X are the swallow/voice/airway-protection set. CN V is facial sensation and chewing. CN VII is facial movement. Corneal reflex uses CN V as afferent and CN VII as efferent. Pupil light response uses CN II as afferent and CN III as efferent."]
      ],
      tags: ["neurologic assessment", "neuro assessment", "cranial nerves I-XII", "stroke assessment", "swallow safety", "aspiration risk", "pupil assessment", "facial droop"]
    },
    "Glasgow Coma Scale": {
      summary: "The Glasgow Coma Scale is a structured neurologic score that trends consciousness by separating eye opening, verbal response, and motor response instead of using vague words like sleepy or unresponsive.",
      quickAnswer: "Glasgow Coma Scale (GCS) = Eye 1-4 + Verbal 1-5 + Motor 1-6, total 3-15. Higher means better neurologic responsiveness. A falling score, unequal pupils, new confusion, vomiting, seizure, or GCS <=8 is a safety escalation cue because airway protection and intracranial injury risk may change quickly.",
      sections: [
        ["What it measures", "GCS measures observable arousal and response: eye opening shows arousal, verbal response shows orientation/language output, and motor response is the strongest bedside clue to purposeful cortical function. It is useful in trauma, stroke, intoxication, hypoxia, sepsis, and any client whose level of consciousness needs repeatable trending."],
        ["Score components", "Eye: 4 spontaneous, 3 to voice, 2 to pain, 1 none. Verbal: 5 oriented, 4 confused, 3 inappropriate words, 2 incomprehensible sounds, 1 none; use an intubated modifier such as V1T when verbal testing is blocked. Motor: 6 obeys commands, 5 localizes pain, 4 withdraws, 3 abnormal flexion, 2 extension, 1 none."],
        ["How to interpret quickly", "15 is fully alert by this scale. 13-15 is often grouped as mild impairment in trauma language, 9-12 as moderate impairment, and 3-8 as severe impairment/coma-range concern. Trend is often more important than a single number: a drop from 14 to 11 can matter more than an isolated low-ish score in a sedated baseline patient."],
        ["Priority nursing actions", "Protect airway, oxygenation, glucose, cervical spine precautions when trauma is possible, seizure safety, aspiration risk, pupil checks, limb strength, and repeat neuro checks. Escalate a falling score, new unilateral weakness, unequal pupils, Cushing-type vital signs, seizure, repeated vomiting, or inability to protect the airway."],
        ["Common NCLEX trap / teaching", "Do not chart only the total when the components explain the problem. GCS 10 from E4 V1T M5 is very different from E1 V4 M5. Sedation, paralytics, intoxication, intubation, language barrier, facial swelling, and baseline neuro deficits can distort the score."]
      ],
      resultMeanings: [
        ["13-15 / mild or near-normal response", "The client is awake or only mildly impaired by GCS, but the result is not automatically safe if the score is falling or focal deficits are present."],
        ["9-12 / moderate impairment", "Moderate reduction in consciousness; reassess frequently and connect the score to oxygenation, glucose, trauma, stroke, infection, medications, and imaging needs."],
        ["3-8 or rapid decline", "Severe impairment/coma-range concern. Airway protection, ventilation, intracranial pressure risk, and urgent provider/rapid response escalation become central."]
      ],
      tags: ["Glasgow Coma Scale", "GCS", "eye verbal motor", "coma score", "traumatic brain injury", "neuro checks", "level of consciousness", "airway protection"]
    },
    "APGAR scoring": {
      summary: "APGAR scoring is a rapid newborn transition assessment performed at 1 and 5 minutes after birth to decide whether the newborn needs breathing, circulation, tone, or stimulation support.",
      quickAnswer: "APGAR = Appearance, Pulse, Grimace, Activity, Respirations, each scored 0-2 for a total of 0-10. A 5-minute score of 7-10 is generally reassuring; below 7 means the newborn needs continued assessment/support and sometimes repeat scoring.",
      sections: [
        ["What it measures", "The score summarizes immediate adaptation to extrauterine life: color/perfusion appearance, heart rate, reflex irritability, muscle tone, and respiratory effort. It is a quick response-to-transition tool, not a full newborn diagnosis."],
        ["Scoring components", "Appearance: blue/pale 0, body pink with blue extremities 1, completely pink 2. Pulse: absent 0, under 100/min 1, at least 100/min 2. Grimace/reflex: no response 0, grimace 1, cough/sneeze/vigorous cry 2. Activity: limp 0, some flexion 1, active motion 2. Respirations: absent 0, slow/irregular 1, strong cry 2."],
        ["How to interpret quickly", "Score at 1 minute reflects tolerance of birth; 5-minute score reflects adaptation after initial support. A low 1-minute score can improve rapidly. Persistent low score at 5 minutes is more concerning and should drive continued resuscitation assessment and follow-up."],
        ["Priority nursing actions", "Warm, dry, stimulate, position airway, clear secretions only when indicated, assess breathing and heart rate, support ventilation/oxygenation per neonatal resuscitation protocol, and keep reassessing rather than staring at the number."],
        ["Common NCLEX trap / teaching", "APGAR does not replace immediate airway-breathing-circulation care. Do not delay resuscitation to finish a score. Also do not promise long-term neurologic outcome from APGAR alone."]
      ],
      resultMeanings: [
        ["7-10", "Generally reassuring newborn transition, especially at 5 minutes, while continuing routine thermoregulation, breathing, color, feeding readiness, and safety assessment."],
        ["4-6", "Moderate difficulty adapting; the newborn may need stimulation, airway positioning, oxygen/ventilation support, and close reassessment depending heart rate and respirations."],
        ["0-3", "Severe transition distress; prioritize neonatal resuscitation actions, heart rate/ventilation effectiveness, warmth, and rapid team escalation."]
      ],
      tags: ["Apgar", "APGAR", "newborn assessment", "one minute Apgar", "five minute Apgar", "neonatal resuscitation", "newborn transition"]
    },
    "ECG lead placement": {
      fullForm: "electrocardiographic lead placement",
      summary: "ECG lead placement is the exact electrode positioning that creates trustworthy 12-lead views of the heart; bad placement can create false ischemia, false axis changes, or missing anterior findings.",
      quickAnswer: "For chest leads: V1 4th intercostal space right sternal border, V2 4th left sternal border, V4 5th intercostal space midclavicular, V3 between V2 and V4, V5 anterior axillary same horizontal level as V4, V6 midaxillary same level as V4.",
      sections: [
        ["Why placement matters", "Each lead is a camera angle on depolarization. Limb-lead reversal can mimic axis or infarct patterns, and precordial misplacement can distort R-wave progression or ST/T interpretation."],
        ["Chest lead landmarks", "Find the sternal angle, count to the 4th intercostal space for V1 and V2, then place V4 at the 5th intercostal space midclavicular line. Place V3 between V2 and V4. Place V5 and V6 level with V4 at the anterior and midaxillary lines."],
        ["Limb leads", "Place limb electrodes with the local 12-lead protocol, and keep right/left and arm/leg positions consistent. RA and LA view the upper body; RL is usually ground; LL completes the frontal plane."],
        ["Priority nursing actions", "Expose enough chest to identify landmarks, dry skin, avoid placing electrodes over bone folds or heavy muscle when possible, document nonstandard placement, and repeat the ECG if the tracing does not fit the client."],
        ["Common NCLEX trap / teaching", "Do not call new ST changes real until the client is assessed and technical problems are considered, but do not dismiss chest pain because you suspect lead error. Recheck placement while treating symptoms seriously."]
      ],
      resultMeanings: [
        ["Correct placement", "The tracing is more reliable for rhythm, intervals, R-wave progression, axis, ischemia, and electrolyte clues."],
        ["Lead reversal / misplacement", "Unexpected axis shift, inverted complexes in unexpected leads, poor R-wave progression, or inconsistent old/new ECG patterns can be technical rather than pathologic."],
        ["Clinical significance", "A clean ECG matters most when chest pain, syncope, dysrhythmia, electrolyte abnormality, or medication toxicity is being evaluated."]
      ],
      tags: ["ECG lead placement", "EKG", "12 lead", "V1", "V2", "V3", "V4", "V5", "V6", "precordial leads"]
    },
    "Burn rule of nines": {
      summary: "The adult burn rule of nines estimates partial- and full-thickness burn total body surface area so fluids, transfer urgency, and burn-center consultation are not guessed.",
      quickAnswer: "Adult rule of nines: head/neck 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1%. Count partial- and full-thickness burns, not simple superficial redness.",
      sections: [
        ["What it estimates", "It estimates percent total body surface area (TBSA) burned. TBSA changes systemic risk because capillary leak, evaporative loss, shock, hypothermia, infection risk, and fluid needs rise as burn size rises."],
        ["Adult percentages", "Head/neck 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, and perineum 1%. Use the client's whole hand including fingers as about 1% TBSA for small scattered areas."],
        ["Children and special situations", "Children have proportionally larger heads and smaller legs, so the Lund-Browder chart is more accurate. Circumferential burns, inhalation injury, electrical burns, face/hands/feet/perineum, extremes of age, and comorbidities can make transfer urgent even when percent is smaller."],
        ["Priority nursing actions", "Stop burning process, ABCs, oxygen for inhalation concern, remove constricting items, cover with clean dry dressings, prevent hypothermia, assess pain/perfusion, estimate TBSA, start fluids when indicated by protocol, and consult/transfer early."],
        ["Common NCLEX trap / teaching", "Do not include first-degree erythema in TBSA for resuscitation. Do not apply ice. Large burns are shock and airway problems before they are dressing problems."]
      ],
      resultMeanings: [
        ["Small partial-thickness area", "Often wound care and follow-up may dominate, but location and depth still matter."],
        [">10% TBSA partial/full thickness", "Fluid resuscitation is commonly considered and nursing priorities shift toward perfusion, urine output, hypothermia prevention, and transfer planning."],
        ["High-risk location or patient", "Face, hands, feet, perineum, circumferential burns, inhalation injury, electrical/chemical burns, very young/older clients, or major comorbidity can justify burn-center discussion even with lower TBSA."]
      ],
      tags: ["burn rule of nines", "rule of nines", "TBSA", "burn percentage", "Parkland formula", "Lund Browder", "burn center", "fluid resuscitation"]
    },
    "Dermatome map": {
      summary: "A dermatome map links skin sensation to spinal nerve roots, helping localize radiculopathy, shingles, spinal cord injury level, and regional anesthesia patterns.",
      quickAnswer: "High-yield landmarks: C5 lateral upper arm, C6 thumb, C7 middle finger, C8 little finger, T4 nipple line, T10 umbilicus, L4 medial lower leg/ankle, L5 dorsum of foot/great toe, S1 lateral foot, S2-S4 saddle region.",
      sections: [
        ["What it tells you", "Dermatomes help distinguish nerve-root level problems from peripheral nerve or local skin problems. A strip-like pain/numbness pattern can point to a root; a glove-stocking pattern points more toward peripheral neuropathy."],
        ["Key landmarks", "C5 lateral upper arm, C6 thumb/radial forearm, C7 middle finger, C8 little finger/ulnar hand, T4 nipple line, T10 umbilicus, L1 groin, L4 medial lower leg/ankle, L5 top of foot/great toe, S1 lateral foot/sole, S2-S4 perineal saddle region."],
        ["Clinical uses", "Radiculopathy, spinal cord injury sensory level, cauda equina warning signs, shingles distribution, epidural/spinal anesthesia level, and neuro checks after trauma or surgery."],
        ["Priority nursing actions", "Compare both sides, map numbness/pain precisely, check motor/reflex/perfusion context, protect insensate skin, and escalate saddle anesthesia, new bowel/bladder dysfunction, rapidly ascending numbness, or weakness."],
        ["Common NCLEX trap / teaching", "A dermatome is sensory territory from a nerve root; it is not the same as a peripheral nerve distribution. Saddle anesthesia with bladder/bowel change is an emergency cue."]
      ],
      resultMeanings: [
        ["Localized dermatomal pain/numbness", "Suggests nerve-root irritation such as radiculopathy or shingles when the history fits."],
        ["Sensory level after trauma", "Can localize spinal cord injury and guide urgent neuro/spine precautions."],
        ["Saddle anesthesia", "High-risk cauda equina/conus cue, especially with urinary retention, bowel dysfunction, or leg weakness."]
      ],
      tags: ["dermatomes", "dermatome map", "radiculopathy", "spinal cord injury", "shingles", "saddle anesthesia", "nerve root"]
    },
    "Blood tube order of draw": {
      summary: "Blood tube order of draw is the phlebotomy sequence that reduces additive carryover, clotting errors, and contaminated specimens.",
      quickAnswer: "Common high-yield sequence: blood cultures first, light blue citrate, serum red/gold, green heparin, lavender/pink EDTA, then gray fluoride/oxalate. Follow the facility's tube system because colors can vary.",
      sections: [
        ["Why it matters", "Tube additives can contaminate later tubes. EDTA carryover can falsely raise potassium and lower calcium; poor fill of citrate tubes can distort coagulation testing."],
        ["Core order", "Draw sterile blood cultures before additive tubes. Then draw light blue citrate for coagulation, serum tubes such as red/gold, green heparin, lavender/pink EDTA, and gray glycolytic inhibitor tubes. Special tubes follow lab policy."],
        ["Specimen quality", "Use correct tube, fill to required volume, invert gently the correct number of times, avoid hemolysis, label at bedside, and send time-sensitive specimens promptly."],
        ["Priority nursing actions", "Verify identity, site, timing, fasting/medication context, line draw policy, anticoagulant contamination risk, and whether cultures should be drawn before antibiotics when safe."],
        ["Common NCLEX trap / teaching", "A lab result can be wrong because the specimen is wrong. Unexpected potassium, calcium, coagulation, glucose, or culture results should make the nurse consider collection quality and client assessment together."]
      ],
      resultMeanings: [
        ["Correct order/handling", "Results are more trustworthy and less likely to reflect additive carryover or clotting."],
        ["Wrong order or underfilled tube", "Can create false critical values, rejected specimens, or misleading coagulation/culture results."],
        ["Clinical significance", "Specimen quality can change treatment decisions, so questionable results should be clarified before unsafe action when the client is stable."]
      ],
      tags: ["order of draw", "blood tube colors", "phlebotomy", "citrate", "EDTA", "heparin", "blood cultures", "specimen collection"]
    },
    "Fetal heart rate patterns": {
      summary: "Fetal heart rate pattern interpretation connects baseline rate, variability, accelerations, decelerations, and contractions to fetal oxygenation reserve.",
      quickAnswer: "Fetal heart rate patterns are interpreted as a complete, changing tracing: baseline, variability, accelerations, decelerations, and uterine activity together show how well fetal oxygenation reserve is being maintained during labor. Baseline 110-160 beats/min is expected, and moderate variability means a 6-25 beats/min peak-to-trough amplitude. Early decelerations mirror contractions and are usually head compression; variable decelerations often reflect cord compression; late decelerations raise concern for impaired uteroplacental oxygen transfer. Classify and trend the tracing with contraction frequency, gestational age, maternal vital signs and symptoms, medications such as oxytocin, and the response to nursing interventions. One deceleration label does not diagnose one cause or determine delivery by itself. Persistent concerning patterns, absent variability with recurrent decelerations or bradycardia, prolonged deceleration, tachysystole with fetal changes, cord-prolapse concern, or maternal instability requires immediate maternal-fetal assessment, protocol-based intrauterine resuscitation, and escalation while the responsible clinician determines further evaluation and whether urgent birth is needed.",
      whyItMatters: "Fetal heart rate patterns matter because changes in baseline, variability, decelerations, and uterine activity can reveal threatened fetal oxygenation and determine when monitoring, intrauterine resuscitation, escalation, or urgent birth is needed.",
      sections: [
        ["What it tells you", "The tracing estimates fetal oxygenation and neurologic/autonomic responsiveness during uterine activity. It is interpreted with maternal vitals, gestational age, medications, labor stage, and contraction pattern."],
        ["Baseline and variability", "Determine baseline over a 10-minute window with at least 2 identifiable baseline minutes. A normal baseline is 110-160 beats/min; a baseline below 110 is bradycardia and above 160 is tachycardia when sustained for at least 10 minutes. Variability is absent when undetectable, minimal when detectable at 5 beats/min or less, moderate at 6-25 beats/min, and marked above 25 beats/min."],
        ["Accelerations and reassuring features", "At 32 weeks or later, an acceleration rises at least 15 beats/min for at least 15 seconds but under 2 minutes; before 32 weeks, use at least 10 beats/min for at least 10 seconds but under 2 minutes. Baseline 110-160 with moderate variability and no late or variable decelerations meets the core Category I features; accelerations and early decelerations may be present or absent."],
        ["Deceleration patterns", "A gradual deceleration takes at least 30 seconds from onset to nadir, while an abrupt deceleration reaches its nadir in under 30 seconds. Early decelerations are gradual and mirror contractions. Variable decelerations are abrupt drops of at least 15 beats/min lasting at least 15 seconds but under 2 minutes and often reflect cord compression. Late decelerations are gradual drops whose onset, nadir, and recovery occur after the contraction's beginning, peak, and end, suggesting uteroplacental insufficiency. A prolonged deceleration drops at least 15 beats/min for 2 minutes to under 10 minutes; 10 minutes establishes a new baseline."],
        ["Frequency and uterine activity", "Recurrent decelerations occur with at least 50% of contractions in a 20-minute segment; intermittent means below 50%. Normal uterine activity is 5 or fewer contractions in 10 minutes averaged over 30 minutes, while tachysystole is more than 5 contractions in 10 minutes averaged over 30 minutes and must be reported with whether fetal decelerations are present."],
        ["Priority nursing actions", "For nonreassuring patterns: reposition, stop oxytocin if running per protocol, IV fluid bolus if appropriate, correct hypotension, assess tachysystole, give oxygen only when clinically indicated by protocol, notify provider, and prepare for urgent birth if unresolved severe compromise."],
        ["Common NCLEX trap / teaching", "Link each deceleration pattern to the action. Late decels plus minimal/absent variability are a perfusion problem. Variable decels point to cord compression and position/amnioinfusion-style interventions depending orders."]
      ],
      resultMeanings: [
        ["Category I / reassuring", "Baseline 110-160 with moderate variability of 6-25 beats/min, no late or variable decelerations, and accelerations or early decelerations either present or absent supports continued monitoring in the clinical context."],
        ["Category II / indeterminate", "Requires evaluation, clinical correlation, and continued surveillance because it is not clearly normal or clearly abnormal; use corrective measures when the maternal-fetal findings indicate them."],
        ["Category III / abnormal", "Absent variability with recurrent late or variable decelerations or bradycardia, or a sinusoidal pattern, requires prompt intrauterine resuscitation and escalation; delivery timing and route depend on response and maternal-fetal status."]
      ],
      sourceKeys: ["acog-fhr-monitoring-2025", "ahrq-nichd-fhr-definitions"],
      sourceNote: "AHRQ's NICHD terminology provides the objective pattern definitions; ACOG's current intrapartum guideline supplies the three-tier interpretation and context-dependent management framework.",
      tags: ["fetal heart rate", "FHR", "late decelerations", "variable decelerations", "early decelerations", "moderate variability", "uteroplacental insufficiency", "cord compression"]
    },
    "Insulin action profile": {
      summary: "Insulin action profiles compare onset, peak, and duration so meals, correction doses, basal coverage, and hypoglycemia surveillance line up with the drug's pharmacology.",
      quickAnswer: "Rapid insulin starts fastest and peaks around meals; regular insulin starts slower and is the classic IV insulin type; NPH has a pronounced peak; long-acting basal insulin has little to no peak. Peak time is the hypoglycemia watch window.",
      sections: [
        ["Why it matters", "Insulin errors happen when onset/meal timing and peak/hypoglycemia timing are mismatched. The same glucose value means different risk depending on when the insulin will peak."],
        ["Typical action patterns", "Rapid-acting lispro/aspart/glulisine: onset about 10-30 minutes, peak about 1-3 hours, duration about 3-5 hours. Regular: onset about 30-60 minutes, peak about 2-4 hours, duration about 5-8 hours. NPH: onset about 1-2 hours, peak about 4-12 hours, duration about 12-18 hours. Long-acting glargine/detemir/degludec provide basal coverage with little or no pronounced peak; formulation-specific duration is roughly 24 hours or longer."],
        ["Priority nursing actions", "Check glucose, meal tray availability, NPO status, symptoms, potassium when IV insulin is used, renal function, steroid/tube-feed changes, and whether correction plus scheduled doses could stack."],
        ["Safety timing", "Rapid insulin without food can drop glucose quickly. NPH peak can cause midday or nocturnal hypoglycemia depending dose time. Basal insulin is not a meal bolus and is often still needed in type 1 diabetes even when NPO, with provider-specific adjustments."],
        ["Common NCLEX trap / teaching", "Do not give prandial insulin and then discover the client will not eat. Do not hold all insulin automatically when NPO, especially in type 1 diabetes. Peak equals danger window for hypoglycemia."]
      ],
      resultMeanings: [
        ["Rapid/prandial insulin", "Matches meals and correction needs; highest hypoglycemia risk occurs near its early peak."],
        ["NPH/intermediate insulin", "Has a pronounced peak, so scheduled snacks or monitoring may be important."],
        ["Long-acting basal insulin", "Maintains baseline insulin effect; not designed to correct a meal spike quickly."]
      ],
      tags: ["insulin action", "insulin onset peak duration", "rapid insulin", "regular insulin", "NPH", "glargine", "hypoglycemia", "basal bolus"]
    },
    "Acid-base compensation chart": {
      summary: "An acid-base compensation chart helps interpret ABGs by identifying pH direction, respiratory PaCO2 effect, metabolic HCO3 effect, oxygenation, and whether compensation is appropriate.",
      quickAnswer: "Start with pH: below 7.35 acidemia, above 7.45 alkalemia. PaCO2 is respiratory acid: high CO2 acidifies, low CO2 alkalinizes. HCO3 is metabolic base: low HCO3 acidifies, high HCO3 alkalinizes. Then ask if the opposite system is compensating appropriately.",
      sections: [
        ["Step-by-step interpretation", "1. Read pH for acidemia/alkalemia. 2. Match PaCO2 direction to respiratory cause or compensation. 3. Match HCO3 direction to metabolic cause or compensation. 4. Check PaO2/SpO2 for oxygenation. 5. Look for anion gap, lactate, ketones, renal failure, vomiting/diuretics, ventilation failure, or sepsis context."],
        ["Normal anchors", "pH 7.35-7.45, PaCO2 about 35-45 mm Hg, HCO3 about 22-26 mEq/L. Exact reference ranges can vary slightly by lab, altitude, and specimen context."],
        ["Compensation logic", "If the primary problem is metabolic, the lungs change PaCO2 within minutes by changing ventilation. If the primary problem is respiratory, kidneys change HCO3 over hours to days, so chronic respiratory disorders can show stronger metabolic compensation."],
        ["Mixed disorder clues", "A normal pH with very abnormal PaCO2/HCO3 can mean two processes are offsetting each other. In metabolic acidosis, expected PaCO2 is roughly 1.5 x HCO3 + 8 (+/-2); a PaCO2 outside that range suggests an additional respiratory disorder."],
        ["Common NCLEX trap / teaching", "Do not call compensation the primary disease. Kussmaul respirations in DKA are respiratory compensation for metabolic acidosis; they do not mean the primary problem is respiratory alkalosis."]
      ],
      resultMeanings: [
        ["Metabolic acidosis", "Low pH with low HCO3; think DKA, lactic acidosis/sepsis, renal failure, diarrhea, toxins, or high anion gap causes."],
        ["Respiratory acidosis", "Low pH with high PaCO2; think hypoventilation from COPD exacerbation, opioids/sedation, neuromuscular failure, airway obstruction, or severe fatigue."],
        ["Alkalosis or mixed pattern", "High pH can come from low PaCO2 or high HCO3; normal pH with abnormal CO2/HCO3 requires checking whether compensation is appropriate."]
      ],
      tags: ["acid base", "ABG", "compensation", "metabolic acidosis", "respiratory acidosis", "metabolic alkalosis", "respiratory alkalosis", "anion gap", "Winter formula"]
    },
    "Bone marrow biopsy": {
      after: "Apply pressure, monitor bleeding, pain, infection, and teach to report fever, uncontrolled bleeding, or increasing pain.",
      trap: "Thrombocytopenic clients need careful bleeding surveillance."
    },
    "Skin biopsy": {
      summary: "Skin biopsy is a dermatology tissue-sampling procedure used to diagnose suspicious lesions, rashes, inflammatory disease, infection, and skin cancers such as melanoma, basal cell carcinoma, and squamous cell carcinoma.",
      quickAnswer: "Skin biopsy removes a small skin sample for pathology or culture. Nursing focus: verify the exact site, bleeding risk, allergies, specimen labeling, wound care, bleeding/infection surveillance, and follow-up for pathology results.",
      sections: [
        ["What it tells you", "Skin biopsy allows microscopic examination or culture of a skin lesion or rash. It can identify dermatitis or psoriasis patterns, bacterial or fungal infection, melanoma, basal cell carcinoma, squamous cell carcinoma, autoimmune or inflammatory disease, and other skin pathology. Results usually return in several days to a week or more depending on pathology workflow and special testing."],
        ["Before / preparation", "Verify the order, exact anatomic site, consent per policy, allergies, pregnancy status when relevant, bleeding disorder history, and use of anticoagulants, antiplatelets, NSAIDs, or supplements that affect bleeding. Clarify whether a shave, punch, incisional, or excisional biopsy is planned and whether the specimen needs routine pathology, culture, or special testing. Prepare local anesthetic and sterile or clean field supplies per setting."],
        ["Procedure / specimen handling", "Local anesthetic numbs the site. Shave biopsy removes superficial layers. Punch biopsy removes a circular deeper sample and may require stitches. Excisional biopsy removes the entire lesion and may include deeper skin or fat; incisional biopsy removes part of a larger lesion. Label the specimen with the exact site and send to pathology and/or culture as ordered."],
        ["Priority nursing actions / safety", "Apply a dressing and pressure as needed, monitor for bleeding, and teach wound care. Keep the site clean and dry per instructions, avoid bumping or stretching it, and return for suture removal if placed. Assess for infection, delayed bleeding, severe pain, wound opening, allergic reaction to dressing or adhesive, and whether the client understands how pathology results will be communicated."],
        ["Concerning findings / reportable cues", "Report bleeding that does not stop with firm pressure as instructed, increasing redness, warmth, swelling, pain, pus, fever, wound opening, fainting, or allergic reaction. Suspicious cancer findings, positive margins, melanoma concern, or infection may require prompt follow-up, additional excision, culture-directed treatment, or specialty care."],
        ["Common NCLEX trap / teaching", "Do not reassure a client that a suspicious lesion is fine just because it was sampled; pathology and follow-up determine next steps. For suspected melanoma, follow the biopsy and referral plan carefully. The common post-procedure complications are bleeding and infection, while the systems-safety trap is wrong-site or poorly labeled specimens."]
      ],
      tags: ["skin", "biopsy", "dermatology", "melanoma", "skin cancer", "punch biopsy", "shave biopsy", "excisional biopsy", "infection", "bleeding", "pathology"]
    },
    "Bone marrow aspiration": {
      after: "Monitor for bleeding, infection, pain, and vasovagal symptoms; apply pressure dressing per policy.",
      trap: "Aspirate and biopsy are related but not identical: aspirate is liquid marrow; biopsy is a core sample."
    },
    "Colonoscopy": {
      summary: "Colonoscopy uses a flexible camera tube called a colonoscope to inspect the rectum and colon, remove polyps, take tissue samples, and investigate bleeding, inflammation, bowel changes, or cancer risk.",
      quickAnswer: "Colonoscopy can both find and remove precancerous polyps and can identify visible bleeding, ulcers, inflammation, masses, or other colon abnormalities. Its reliability depends on a complete examination with bowel preparation clean enough to see the lining. A poor preparation, incomplete examination, or visual finding may require pathology, repeat colonoscopy, or another evaluation plan rather than a yes-or-no conclusion.",
      whyItMatters: "Colonoscopy matters because finding and removing a polyp can prevent colorectal cancer, while missed follow-up after an inadequate examination or abnormal biopsy can delay diagnosis. After the procedure, assess sedation recovery, breathing and circulation, abdominal findings, and bleeding. Severe or worsening abdominal pain, a rigid or increasingly swollen abdomen, fever, persistent or heavy rectal bleeding, dizziness, weakness, breathing difficulty, or unstable vital signs can signal perforation (a hole in the colon), delayed bleeding, or a sedation complication and requires urgent evaluation.",
      sections: [
        ["What it means clinically", "A colonoscope is a flexible tube with a camera that shows the lining of the rectum and colon. The endoscopist can remove a polyp, meaning a growth from the colon lining, or take a biopsy, meaning a small tissue sample. Visible findings can explain bleeding, inflammation, bowel changes, or a mass, but tissue pathology and the quality and completeness of the examination determine many final decisions."],
        ["Before / individualized preparation", "Confirm the indication, consent process, prescribed bowel-preparation instructions, transportation plan after sedation, allergies, other health conditions, hydration tolerance, and the clinician-approved plan for prescription medicines, over-the-counter products, antithrombotic medicines that reduce clotting, and diabetes treatment. Do not independently stop medicines or substitute one universal diet, laxative, or fasting schedule. Report vomiting, inability to finish the preparation, dark or solid bowel output, dehydration symptoms, or another barrier to following the ordered plan."],
        ["Preparation and examination quality", "An adequate bowel preparation is clean enough for the endoscopist to assign an appropriate screening or surveillance interval from the examination. Document preparation quality, whether the intended extent of the colon was reached, lesions removed or sampled, and any immediate therapy. Inadequate preparation or an incomplete examination can hide lesions, so the responsible clinician determines whether and when repeat colonoscopy or another test is needed."],
        ["After / priority nursing assessment", "Monitor airway, breathing, circulation, level of alertness, pain, abdominal distention or rigidity, nausea or vomiting, and rectal bleeding according to the sedation and procedure plan. Mild gas or cramping and a small amount of bleeding after biopsy or polyp removal may occur, but reassess the trend rather than assuming every symptom is expected. Confirm discharge supervision, written instructions, and how endoscopy and pathology results will be communicated."],
        ["Urgent safety cues", "Seek urgent evaluation for severe or worsening abdominal pain, a rigid or increasingly distended abdomen, fever, persistent or heavy bleeding, bleeding that does not stop, dizziness, weakness, fainting, breathing difficulty, or unstable vital signs. Delayed bleeding can occur after the client has gone home and may appear for up to about two weeks, especially after a polyp is removed."],
        ["Limits and follow-up", "A visually normal, complete, well-prepared colonoscopy lowers concern for many structural colon problems but does not exclude every microscopic, intermittent, or non-colonic cause of symptoms. A poor-preparation or incomplete examination cannot reliably rule out missed lesions. A polyp, inflamed area, or mass seen through the scope does not establish its exact tissue diagnosis by itself; pathology and the clinician's follow-up plan are required."]
      ],
      resultMeanings: [
        ["Complete examination with adequate preparation", "The colon lining was seen well enough to support the endoscopist's findings and an appropriate screening or surveillance plan. A normal visual examination still does not explain every symptom or exclude microscopic disease."],
        ["Inadequate preparation or incomplete examination", "Stool, anatomy, discomfort, narrowing, or another limitation prevented a reliable complete view. Lesions may be missed, so the responsible clinician determines the timing and method of repeat or alternative evaluation."],
        ["Polyp, biopsy, inflammation, bleeding, or mass", "The visible finding can direct removal, hemostasis, treatment, or further testing. A biopsy or removed polyp requires pathology review before its exact tissue diagnosis and follow-up interval are known."],
        ["Post-procedure complication pattern", "Persistent or heavy bleeding, severe or worsening abdominal pain, rigidity or increasing distention, fever, weakness, dizziness, breathing difficulty, or instability requires urgent assessment for bleeding, perforation, infection, or a sedation-related event; one symptom alone does not identify the cause."]
      ],
      sourceKeys: [
        "ani-gi-asge-acg-colonoscopy-quality-2024",
        "ani-gi-usmstf-colonoscopy-preparation-2025",
        "ani-gi-niddk-colonoscopy"
      ],
      sourceNote: "ASGE/ACG quality indicators and the 2025 U.S. Multi-Society Task Force guidance support examination and bowel-preparation quality, while NIDDK supports the learner-facing procedure, pathology, delayed-bleeding, and urgent-warning guidance. Use the prescribed preparation, medication, sedation, and follow-up plan for the individual patient.",
      tags: ["colonoscope", "colorectal cancer prevention", "colon polyp removal", "bowel preparation quality", "inadequate bowel prep", "colonoscopy biopsy", "delayed post-polypectomy bleeding", "colon perforation"]
    },
    "EGD": {
      summary: "EGD, or upper gastrointestinal (GI) endoscopy, uses a flexible camera tube to inspect the esophagus, stomach, and duodenum, which is the first part of the small intestine, and can take tissue samples or provide treatment.",
      quickAnswer: "EGD (esophagogastroduodenoscopy), also called upper-GI endoscopy, can identify and sometimes treat visible bleeding, ulcers, narrowed areas, Barrett's esophagus, growths, or other abnormalities in the esophagus, stomach, and duodenum. Some findings are available immediately, but a biopsy is a tissue sample whose pathology result returns later. A normal visual examination does not rule out every microscopic or functional cause of symptoms.",
      whyItMatters: "EGD matters because it can locate and treat active upper-GI bleeding, open a narrowed passage, or obtain tissue that changes cancer, celiac-disease, Barrett's-esophagus, or other care. Before and after sedation, protect the airway and assess breathing, circulation, swallowing, pain, and bleeding. Worsening chest or abdominal pain, breathing or swallowing difficulty, bloody or coffee-ground vomit, black tarry stool, fever, or instability can signal aspiration (material entering the lungs), bleeding, a heart or breathing reaction, or perforation (a tear or hole) and requires urgent evaluation.",
      sections: [
        ["What it means clinically", "An endoscope is a flexible camera tube passed through the mouth to view the esophagus, stomach, and duodenum. EGD can show inflammation, an ulcer, a bleeding site, a narrowed area, Barrett's changes, a growth, or another visible lesion. It can also take a biopsy, meaning a small tissue sample, stop some bleeding, remove selected growths, or widen selected narrow areas."],
        ["Before / individualized preparation", "Confirm the indication, consent process, allergies, heart and breathing risk, aspiration risk, pregnancy status when relevant, transportation plan after sedation, and the clinician-approved plan for prescription medicines, over-the-counter products, antithrombotic medicines that reduce clotting, and diabetes treatment. Follow the ordered fasting and sedation instructions for this patient and setting; do not independently stop medicines or apply one fasting interval to every patient."],
        ["After / airway and swallowing safety", "Monitor airway, breathing, circulation, level of alertness, oxygenation and vital signs per the sedation plan, throat or swallowing symptoms, chest or abdominal pain, nausea or vomiting, and bleeding. Resume oral intake only when sedation recovery and swallowing and airway-protection criteria in the local procedure plan are satisfied. A gag-reflex check alone is not a universal clearance rule."],
        ["Results and evaluation path", "Record the visible findings, whether the examination was complete, any bleeding control or dilation, every biopsy site, and the follow-up plan. An unexpected lesion may lead to pathology, laboratory testing, imaging, repeat endoscopy, or specialty care according to the clinical question. Persistent symptoms after a normal EGD still need cause-directed evaluation rather than automatic reassurance."],
        ["Urgent safety cues", "Seek urgent evaluation for trouble breathing, worsening trouble swallowing or throat pain, bloody or coffee-ground vomit, black tarry stool, worsening chest or abdominal pain, fever, fainting, or unstable vital signs. These findings require assessment for sedation-related heart or breathing problems, aspiration, bleeding, infection, or perforation rather than waiting for routine follow-up."],
        ["Limits and follow-up", "A normal visual EGD does not exclude microscopic disease, intermittent bleeding, motility or functional disorders, or disease outside the examined upper-GI tract. A visual impression does not establish the exact tissue diagnosis of Barrett's changes, celiac disease, inflammation, or a mass by itself. Biopsy pathology and the responsible clinician's follow-up plan complete the interpretation when tissue was sampled."]
      ],
      resultMeanings: [
        ["Normal or no important visible abnormality", "No major structural lesion is seen in the examined esophagus, stomach, or duodenum. This lowers concern for many visible causes but does not exclude microscopic, intermittent, motility, or functional disease."],
        ["Visible lesion, bleeding source, or narrowing", "An ulcer, inflamed area, bleeding site, narrowed passage, Barrett's-appearing change, growth, or other lesion can direct immediate treatment, biopsy, imaging, or specialist follow-up. Appearance alone does not establish the exact tissue diagnosis."],
        ["Biopsy or fluid sample obtained", "The procedure supplies tissue, cells, or fluid for laboratory or pathology review. The immediate endoscopy report is not the final tissue diagnosis, so result tracking and communication are required."],
        ["Therapy performed", "Bleeding control, removal, or dilation may change immediate care, but the client still needs complication surveillance and a clear plan for pathology, symptom reassessment, and any repeat procedure."]
      ],
      sourceKeys: [
        "ani-gi-asge-acg-upper-endoscopy-quality-2025",
        "ani-gi-asge-egd-adverse-events-2022",
        "ani-gi-niddk-upper-endoscopy-2023"
      ],
      sourceNote: "The 2025 ASGE/ACG quality indicators support appropriate, complete, documented upper-GI endoscopy and follow-up; ASGE's 2022 adverse-event review supports procedure-specific safety surveillance; NIDDK supports the learner-facing procedure, biopsy, recovery, and urgent-warning guidance. Follow the individual sedation, fasting, medication, and oral-intake plan.",
      tags: ["upper GI endoscopy", "gastroscopy", "upper gastrointestinal endoscopy", "EGD biopsy", "upper GI bleeding", "Barrett esophagus", "sedation recovery", "aspiration risk", "EGD perforation"]
    },
    "ERCP": {
      summary: "ERCP combines upper-GI endoscopy and x-ray imaging to enter the bile and pancreatic ducts, which are tubes that drain bile and pancreatic fluid, and is used mainly when treatment is expected.",
      quickAnswer: "ERCP is mainly a therapeutic procedure for a blocked, narrowed, leaking, or infected bile or pancreatic duct; it can remove a stone, open a narrowed area, place or exchange a stent, or obtain a sample. For diagnosis alone, lower-risk tests such as magnetic resonance cholangiopancreatography (MRCP), ultrasound, or endoscopic ultrasound can often answer the question without entering the ducts. After ERCP, new severe upper-abdominal or chest pain, repeated vomiting, fever or chills, jaundice (yellow skin or eyes), bleeding, breathing difficulty, or instability requires urgent evaluation.",
      whyItMatters: "ERCP matters because restoring duct drainage can relieve obstruction and help control infection, but entering and treating the ducts creates distinctive risks: post-ERCP pancreatitis (inflammation of the pancreas), cholangitis (infection in the bile ducts), bleeding, perforation, and sedation-related heart or breathing problems. Confirm the exact indication and prevention plan, then assess pain, vomiting, temperature, jaundice, bleeding, breathing, blood pressure, and circulatory stability after the procedure. Symptoms and one laboratory value do not diagnose the complication by themselves; the responsible team selects pancreatic enzymes such as lipase, blood counts, liver tests, cultures, or imaging according to the pattern and urgency.",
      sections: [
        ["What it means clinically", "ERCP passes an endoscope through the mouth to the duodenum, the first part of the small intestine, then uses a small catheter, contrast dye, and x-ray imaging to enter the bile or pancreatic ducts. The endoscopist may remove a stone, cut or widen a duct opening, dilate a narrowing, place or exchange a stent, drain an obstruction, or collect tissue. Because ERCP carries more risk than noninvasive imaging, it is generally selected when treatment or duct sampling is expected."],
        ["Before / indication and individualized preparation", "Verify the exact therapeutic indication, planned intervention, consent process, allergies, prior reactions, heart, breathing, and sedation risk, pregnancy status and radiation-protection plan when relevant, and the clinician-approved plan for prescription medicines, antithrombotic medicines that reduce clotting, and diabetes treatment. Follow the ordered fasting and transportation instructions for this patient and setting. Do not independently stop medicines or assume every suspected duct problem requires ERCP rather than MRCP, ultrasound, or endoscopic ultrasound."],
        ["Post-ERCP pancreatitis prevention plan", "Confirm and document the endoscopist's ordered prevention plan. Current ASGE guidance supports rectal nonsteroidal anti-inflammatory drugs (NSAIDs) such as indomethacin or diclofenac for appropriate patients, but NSAID allergy, renal impairment, recent peptic-ulcer disease or bleeding, and other patient-specific risks must be reviewed. The exact drug, dose, timing, hydration plan, cannulation method, and any pancreatic stent are clinician-directed; the nurse does not turn one example into a universal order."],
        ["After / priority nursing assessment", "Monitor airway, breathing, circulation, level of alertness, oxygenation and vital signs per the sedation plan, upper-abdominal or chest pain, nausea or repeated vomiting, abdominal tenderness or guarding, fever or chills, jaundice, urine and stool changes, and evidence of bleeding. Confirm the oral-intake and discharge plan, the intervention performed, whether a stent or sample needs follow-up, and who will communicate delayed results."],
        ["Urgent safety cues and evaluation", "Escalate severe or worsening upper-abdominal or chest pain, repeated vomiting, fever or chills, new or worsening jaundice, black tarry stool, bloody or coffee-ground vomit, breathing or swallowing difficulty, peritoneal signs such as a rigid or guarded abdomen, low blood pressure, or other instability. These patterns may prompt clinician-selected lipase or other pancreatic enzymes, a complete blood count (CBC), liver chemistries, cultures, or imaging to distinguish pancreatitis, cholangitis, hemorrhage, perforation, persistent obstruction, or a sedation complication."],
        ["Limits and follow-up", "A technically completed ERCP does not prove that every obstruction, leak, infection, or tumor has resolved. A narrowed duct or tissue appearance does not establish benign or malignant disease by itself; cell testing (cytology), tissue pathology, and clinical follow-up may be needed. Pain, fever, jaundice, or an abnormal enzyme after ERCP is not diagnostic of one complication alone. Track stent removal or exchange, pathology, drainage success, symptoms, and planned reassessment."]
      ],
      resultMeanings: [
        ["Successful duct therapy or drainage", "The intended stone removal, dilation, stent placement or exchange, leak treatment, or drainage was completed and contrast or bile flow may improve. Clinical response, laboratory trends, and the follow-up plan still determine whether the problem is resolved."],
        ["Incomplete therapy or persistent obstruction", "A stone, narrowing, leak, anatomy, access problem, or other barrier prevented complete treatment or drainage. The responsible specialist determines repeat ERCP, another intervention, surgery, imaging, or close follow-up."],
        ["Stricture or tissue sample", "A narrowed area or sampled lesion can raise concern for inflammation, scarring, or malignancy, but appearance alone does not establish the cause. Cytology or pathology and follow-up are required."],
        ["Post-procedure complication pattern", "Severe or worsening pain, vomiting, fever or chills, jaundice, bleeding, breathing difficulty, peritoneal signs, or instability requires urgent evaluation for pancreatitis, cholangitis, hemorrhage, perforation, persistent obstruction, or a sedation-related event; one symptom or laboratory result does not diagnose the cause alone."]
      ],
      sourceKeys: [
        "ani-gi-asge-acg-ercp-quality-2026",
        "ani-gi-asge-ercp-pancreatitis-prevention-2023",
        "ani-gi-niddk-ercp-2024"
      ],
      sourceNote: "The 2026 ASGE/ACG quality indicators support appropriate therapeutic selection, prevention, success, and adverse-event follow-up; the 2023 ASGE guideline supports clinician-directed post-ERCP-pancreatitis prevention; NIDDK supports ERCP's therapeutic role, lower-risk diagnostic alternatives, preparation, biopsy, and urgent-warning guidance. Apply patient-specific contraindications and local procedural orders.",
      tags: ["bile duct endoscopy", "pancreatic duct procedure", "biliary obstruction treatment", "bile duct stone removal", "ERCP stent", "post ERCP pancreatitis", "cholangitis", "sphincterotomy", "MRCP alternative", "endoscopic ultrasound alternative"]
    },
    "Amniocentesis": {
      after: "Check fetal heart rate before/after per policy, monitor contractions, bleeding, leaking fluid, fever, pain, and Rh immune globulin need for Rh-negative clients.",
      trap: "Leaking fluid, fever, decreased fetal movement, or contractions after amnio needs follow-up."
    },
    "CVS": {
      after: "Monitor bleeding, cramping, infection cues, rupture of membranes, fetal concerns, and Rh immune globulin need for Rh-negative clients.",
      trap: "CVS is genetic tissue sampling; it is not the same as amniotic-fluid testing for all defects."
    },
    "NST": {
      trap: "A nonreactive NST means more evaluation, not automatic emergency delivery without context."
    },
    "BPP": {
      trap: "Amniotic fluid volume is a placental/oxygenation clue. Do not focus only on fetal movement."
    },
    "ABG": {
      after: "Hold pressure longer for anticoagulated clients, monitor bleeding/hematoma, distal perfusion, and severe pain/numbness.",
      trap: "PaCO2 reflects ventilation; PaO2 reflects oxygenation. Do not mix them up."
    },
    "ABG sampling": {
      after: "Apply firm pressure after arterial puncture, monitor bleeding/hematoma, distal perfusion, and label/send promptly.",
      trap: "Air bubbles and delayed processing can distort ABG results."
    },
    "CT pulmonary angiography": {
      before: "Assess iodine/contrast allergy history, renal risk, pregnancy status, IV access, and ability to lie flat.",
      trap: "A negative D-dimer can help in low-risk clients; high-risk PE often needs definitive imaging instead of reassurance."
    },
    "D-dimer": {
      trap: "Positive D-dimer is nonspecific. Infection, surgery, pregnancy, cancer, and inflammation can elevate it."
    },
    "Ankle-Brachial Index (ABI)": {
      trap: "Do not ignore a low ABI in a client with leg pain, coolness, weak pulses, or wounds. It is a perfusion clue, not just a vascular-office number."
    },
    "Toe-Brachial Index (TBI)": {
      trap: "TBI can be useful when ABI is falsely high from calcified vessels; diabetes and chronic kidney disease are classic contexts."
    },
    "Tilt-table test": {
      before: "Explain that symptoms may be intentionally reproduced while heart rate and blood pressure are monitored. Protect from falls and follow fasting/medication instructions.",
      trap: "Syncope workups are about rhythm, perfusion, volume status, medications, and neuro clues - not just one positional test.",
      resultMeanings: [
        ["Normal / no diagnostic response during the test", "The protocol does not reproduce the client's typical symptoms with a diagnostic heart-rate or blood-pressure pattern. This lowers support for the provoked mechanism but does not exclude intermittent arrhythmia, seizure, structural heart disease, medication effects, volume depletion, or another cause of syncope."],
        ["Positive - vasovagal / reflex syncope pattern", "Typical symptoms occur with a fall in blood pressure and sometimes heart rate because reflex vasodilation and increased vagal activity temporarily reduce cerebral perfusion."],
        ["Positive - orthostatic hypotension pattern", "Upright tilt produces a sustained blood-pressure fall with symptoms, supporting impaired compensation from volume depletion, autonomic dysfunction, medications, or another orthostatic cause in the right context."],
        ["Positive - postural tachycardia pattern", "Symptoms occur with an excessive heart-rate rise without the blood-pressure pattern of orthostatic hypotension. Protocol, age, duration, medications, hydration, and exclusion of other causes matter before diagnosing a postural tachycardia syndrome."]
      ]
    },
    "Methacholine challenge test": {
      before: "Follow instructions about holding bronchodilators or other respiratory medications. Baseline spirometry and rescue bronchodilator availability matter.",
      trap: "This test can provoke bronchospasm. Worsening wheeze or respiratory distress requires prompt response."
    },
    "Bronchoalveolar lavage (BAL)": {
      after: "Monitor oxygenation, fever, bleeding, cough, bronchospasm, and sedation recovery if performed with bronchoscopy.",
      trap: "BAL is a specimen technique through bronchoscopy; post-procedure airway monitoring still matters."
    },
    "Endobronchial ultrasound (EBUS)": {
      summary: "Endobronchial ultrasound (EBUS) adds an ultrasound probe to bronchoscopy so the clinician can locate lymph nodes or lesions beside the airway and, when planned, guide a tissue or cell sample.",
      quickAnswer: "EBUS is not one single sampling method. Linear or convex-probe EBUS can guide transbronchial needle aspiration (EBUS-TBNA) into mediastinal or hilar lymph nodes, meaning nodes in the central chest around the large airways. Radial EBUS helps locate a more peripheral lung lesion so separate instruments can sample it. Ultrasound appearance alone is not a tissue diagnosis, and a negative or nondiagnostic sample does not rule out cancer or infection.",
      whyItMatters: "EBUS matters because accurate tissue diagnosis and lymph-node staging can change whether a patient proceeds to surgery, radiation, systemic therapy, infection treatment, or another test. An inadequate, mistargeted, or false-negative sample can delay care. Confirm the exact modality, target, and specimen plan; then protect airway and oxygenation, track every sample, and urgently assess worsening breathing, low oxygen, heavy or increasing coughing of blood, chest pain, unequal breath sounds, fever with deterioration, or instability for bleeding, pneumothorax (a collapsed lung), infection, or a sedation-related complication.",
      before: "Confirm whether the plan is linear or convex-probe EBUS with needle aspiration or radial EBUS localization, the exact target and node station when applicable, the intended tests, consent process, baseline breathing and oxygenation, sedation and airway plan, allergies, and bleeding risk. Follow patient-specific fasting and medicine instructions and the clinician-approved antithrombotic plan; do not independently stop medicines or apply one universal schedule.",
      after: "Monitor airway, breathing, circulation, oxygenation, alertness, pain, breath sounds, fever, and the amount and trend of coughed blood according to the bronchoscopy, sampling, and sedation plan. Resume oral intake only when local sedation-recovery, swallowing, and airway-protection criteria are satisfied.",
      trap: "Do not equate an ultrasound image with histology, meaning the tissue diagnosis, or one sampled lymph node with complete staging. Negative and nondiagnostic samples require interpretation against target selection, sample adequacy, imaging, and pretest concern.",
      sections: [
        ["Modality distinction", "Linear or convex-probe EBUS provides real-time needle guidance for transbronchial needle aspiration, called EBUS-TBNA, from mediastinal or hilar lymph nodes and selected lesions beside the airway. Mediastinal and hilar describe the central chest around the large airways. Radial EBUS uses a small circular ultrasound probe to help localize a peripheral lung lesion; after localization, a separate biopsy tool is used. These modalities answer different targeting and sampling questions."],
        ["Before / individualized preparation", "Verify the exact modality, target or lymph-node station, sampling and ancillary-testing plan, consent process, allergies, baseline breathing and oxygenation, sedation and airway plan, transportation or supervision after sedation, and bleeding risk. Confirm the clinician-approved plan for antithrombotic medicines that reduce clotting and diabetes treatment. Follow this patient's ordered fasting and medicine instructions rather than independently stopping a medicine or applying one schedule to everyone."],
        ["Specimen and result ownership", "For every sample, document the exact target, lymph-node station or lesion site, specimen type, number or sequence according to the procedure record, and any adequacy assessment. Label and route material to cytology (examining cells), pathology (examining tissue), microbiology when ordered, and molecular or biomarker testing when planned. Record who will track adequacy and final results, communicate them, and coordinate staging or another evaluation."],
        ["After / priority nursing assessment", "Monitor airway, breathing, circulation, oxygenation, alertness, pain, breath sounds, fever, cough, and the amount and trend of coughed blood according to the bronchoscopy, needle-sampling, and sedation plan. Resume oral intake only when local sedation-recovery, swallowing, and airway-protection criteria are satisfied; a gag-reflex check alone is not a universal clearance rule."],
        ["Urgent safety cues", "Escalate worsening shortness of breath, low oxygen, heavy or increasing coughing of blood, clots, chest pain, unequal or newly decreased breath sounds, fever with clinical deterioration, low blood pressure, or other instability. These findings require assessment for airway compromise, bleeding, pneumothorax, infection, or a sedation-related heart or breathing problem rather than routine observation alone."],
        ["Limits and follow-up", "Ultrasound appearance does not establish benign, malignant, or infectious histology by itself. Sampling one lymph node does not automatically evaluate every node needed for staging. An adequate negative sample can lower concern at that target but does not rule out cancer or infection in every clinical context; an inadequate or nondiagnostic sample is even less reassuring. Imaging pattern, target selection, sample adequacy, pathology, microbiology, pretest probability, and multidisciplinary review determine whether surveillance, repeat EBUS, another biopsy route, or surgery is appropriate."]
      ],
      resultMeanings: [
        ["Diagnostic malignant or other specific tissue finding", "Cells, tissue, or microbiology identify a specific diagnosis at the sampled target. The result guides staging and treatment, but the complete plan still depends on all relevant imaging, node stations, biomarkers, and clinical findings."],
        ["Benign, reactive, inflammatory, or infectious finding", "The sample may support a nonmalignant or infectious explanation when the pathology, microbiology, imaging, and clinical picture agree. The label does not automatically explain every lesion or exclude a separate process."],
        ["Adequate negative staging sample", "No malignancy is identified in an adequately sampled target. This can lower concern at that site, but it does not by itself complete all staging or rule out disease elsewhere; pretest concern and the staging plan determine follow-up."],
        ["Inadequate or nondiagnostic sample", "The sample does not contain enough representative material or does not establish a diagnosis. This is not a negative diagnosis. The responsible team uses target accuracy, imaging, pretest probability, and needed ancillary tests to select repeat or alternative sampling."]
      ],
      sourceKeys: [
        "ani-pulmonary-bts-bronchoscopy-safety-2023",
        "ani-pulmonary-nlm-bronchoscopy-bal-2024",
        "ani-pulmonary-chest-ebus-tbna-specimens-2025",
        "ani-pulmonary-ers-esge-ests-endosonography-2026",
        "ani-pulmonary-chest-radial-ebus-lung-cancer-diagnosis-2013"
      ],
      sourceNote: "BTS and MedlinePlus support bronchoscopy safety, preparation, recovery, and complication surveillance; CHEST supports EBUS-TBNA sample acquisition, adequacy, handling, and ancillary testing; ERS/ESGE/ESTS supports linear EBUS-TBNA diagnosis and staging and context-dependent follow-up after negative or nondiagnostic sampling; the CHEST/ACCP lung-cancer diagnosis guideline directly supports radial EBUS localization of peripheral nodules for bronchoscopic sampling. Apply the individual modality, target, sedation, medicine, specimen, and staging plan.",
      tags: ["EBUS-TBNA", "linear EBUS", "convex-probe EBUS", "radial EBUS", "transbronchial needle aspiration", "mediastinal lymph node sampling", "hilar lymph node sampling", "peripheral lung lesion localization", "lung cancer staging", "specimen adequacy", "molecular testing"]
    },
    "Troponin I/T": {
      trap: "One normal early troponin does not always rule out ACS. Trend and timing matter."
    },
    "BNP/NT-proBNP": {
      trap: "BNP supports heart failure but kidney disease, age, and body habitus affect interpretation."
    },
    "Dexamethasone suppression": {
      trap: "This is not a treatment trial. It is a dynamic endocrine test tied to cortisol regulation."
    },
    "ACTH stimulation": {
      trap: "Used for adrenal insufficiency patterns; timing and steroid medication history matter."
    },
    "24-hour urine": {
      before: "Teach collection timing exactly: discard first void, collect all urine for 24 hours, keep as instructed, and include the final void.",
      trap: "Missing urine during a timed collection can invalidate the result."
    },
    "Water deprivation test": {
      before: "This is closely supervised because dehydration and sodium changes can become dangerous. Monitor weight, urine output/osmolality, serum sodium/osmolality, thirst, and mental status per protocol.",
      trap: "Do not casually fluid-restrict a suspected diabetes insipidus client without ordered monitoring."
    },
    "Fetal fibronectin": {
      before: "Avoid factors that can distort results per protocol, such as recent intercourse, cervical exam, bleeding, or ruptured membranes depending instructions.",
      trap: "A negative fetal fibronectin is most useful for low short-term preterm-birth risk; a positive result is less specific."
    },
    "Amniotic fluid index": {
      trap: "Low fluid can signal placental insufficiency, rupture of membranes, renal anomalies, or fetal compromise; high fluid can connect to diabetes, anomalies, or preterm labor risk."
    },
    "Breast MRI": {
      summary: "Breast MRI uses magnetic fields and radio waves to create detailed breast images. It is usually a supplemental tool, not a replacement for mammography or ultrasound.",
      quickAnswer: "Breast MRI is used for selected high-risk screening, cancer extent, treatment response, recurrence questions, difficult mammogram/ultrasound findings, and silicone implant rupture. Nursing focus: MRI metal/device screen, pregnancy and kidney/contrast review, anxiety/claustrophobia support, and explaining that cancer evaluation usually requires IV gadolinium contrast.",
      sections: [
        ["What it tells you", "Breast MRI can show breast tissue detail that may not be available from mammography or ultrasound. It can support high-risk screening, evaluate the extent of known cancer, look for additional disease in either breast, assess response to neoadjuvant chemotherapy, evaluate lumpectomy-site changes, and assess silicone implant rupture."],
        ["Before / preparation", "Screen for implanted devices, metal or shrapnel exposure, kidney disease, contrast allergy history, pregnancy possibility, breastfeeding questions per local protocol, claustrophobia, ability to lie prone, and whether the exam is for cancer evaluation or implant rupture. Continue regular medications unless the imaging center instructs otherwise."],
        ["Procedure", "The client usually lies face down with the breasts positioned in a dedicated coil. Imaging may last about 30 to 60 minutes, and total visit time can be longer. Most cancer-related breast MRI exams require IV gadolinium contrast; implant-rupture evaluation may be done without contrast depending on the order."],
        ["Priority nursing actions / safety", "Verify MRI safety screening and IV/contrast plan, protect privacy and comfort, reinforce staying still, and monitor for anxiety, contrast reaction, IV-site problems, or dizziness after the exam. Severe kidney disease may require renal function review before gadolinium."],
        ["Concerning findings / reportable cues", "Report acute allergic-type contrast symptoms, breathing difficulty, syncope, chest pain, severe anxiety/panic, new breast skin changes, nipple discharge, palpable mass, infection signs, or urgent abnormal imaging follow-up needs."],
        ["Common NCLEX trap / teaching", "Breast MRI is supplemental; it does not replace routine mammography for average-risk screening. Another trap is assuming noncontrast breast MRI can evaluate cancer well: contrast is usually needed for cancer detection/evaluation, while implant rupture is a special case."]
      ],
      tags: ["breast MRI", "breast magnetic resonance imaging", "gadolinium", "high-risk breast cancer screening", "mammography", "silicone implant rupture", "neoadjuvant chemotherapy", "MRI safety"]
    },
    "Fluorescein stain": {
      summary: "Fluorescein staining is a bedside eye exam that uses dye and blue light/cobalt illumination to highlight corneal epithelial defects such as abrasions, ulcers, or foreign-body tracks.",
      quickAnswer: "Fluorescein stain helps identify corneal abrasion, ulcer, foreign body patterns, and leakage after eye trauma. Nursing focus: eye-pain history, contact lens use, visual acuity first when possible, avoiding pressure on suspected globe injury, and urgent referral for vision loss, penetrating trauma, chemical injury, ulcer, or dendritic lesions.",
      sections: [
        ["What it tells you", "Fluorescein dye pools in areas where the corneal surface is disrupted. Linear uptake can suggest a foreign body under the eyelid, round/irregular uptake can fit abrasion or ulcer, dendritic branching can suggest herpetic keratitis, and streaming aqueous can suggest globe leakage after trauma."],
        ["Before / preparation", "Assess mechanism of injury, chemical exposure, contact lens use, severe pain, photophobia, vision change, immune risk, and whether visual acuity can be checked before drops or manipulation. Remove contact lenses when indicated and do not apply pressure if penetrating injury is possible."],
        ["Procedure", "A small amount of fluorescein is placed in the eye, often after topical anesthetic if ordered. The clinician examines the cornea with blue/cobalt light and may evert the lid if a foreign body track is suspected."],
        ["Priority nursing actions / safety", "Irrigate immediately for chemical exposure before lengthy exam steps. For suspected globe rupture, shield the eye, keep NPO if surgery is possible, avoid pressure or tonometry, and escalate urgently. Contact lens-related abrasions or ulcers need prompt provider-directed antimicrobial coverage and follow-up."],
        ["Concerning findings / reportable cues", "Report vision loss, severe photophobia, hyphema, irregular pupil, penetrating injury, positive leak sign, corneal ulcer/infiltrate, dendritic pattern, chemical burn, or contact lens-related pain/redness."],
        ["Common NCLEX trap / teaching", "Do not patch or delay care for chemical burns or suspected globe rupture. Do not send a contact lens wearer with a painful red eye home without evaluation for corneal ulcer risk."]
      ],
      tags: ["fluorescein stain", "fluorescein eye stain", "corneal abrasion", "corneal ulcer", "foreign body", "contact lens", "globe rupture", "chemical eye injury", "herpetic keratitis"]
    },
    "Skin prick allergy test": {
      summary: "Skin prick allergy testing places tiny amounts of selected allergens into the skin surface to look for an IgE-mediated wheal-and-flare response tied to a client's history.",
      quickAnswer: "Skin prick testing helps identify likely triggers for allergic rhinitis, asthma, eczema, stinging-insect reactions, and selected food or drug allergy questions. Nursing focus: medication holds such as antihistamines when ordered, asthma/anaphylaxis history, emergency readiness, and teaching that a positive test means sensitization, not always clinical allergy.",
      sections: [
        ["What it tells you", "A small wheal/flare at a tested allergen site suggests IgE sensitization to that allergen. Results are most useful when they match the client's symptoms and exposure history; broad screening without a history can create misleading restrictions."],
        ["Before / preparation", "Confirm the target symptoms, suspected allergens, asthma control, prior anaphylaxis, pregnancy status when relevant, beta-blocker or ACE inhibitor use, skin condition at test sites, and medication instructions. Antihistamines and some other medicines may need to be held before testing if the prescriber/allergist directs."],
        ["Procedure", "The allergist or trained clinician places allergen extracts plus positive and negative controls on the forearm or back and pricks the skin surface. Sites are read after a short interval, often around 15 to 20 minutes, for wheal and flare response."],
        ["Priority nursing actions / safety", "Have emergency supplies available per allergy testing protocol, monitor for systemic symptoms, and document exact allergens, controls, timing, and reactions. Clients with uncontrolled asthma or recent severe reaction may need stabilization or a different testing plan."],
        ["Concerning findings / reportable cues", "Report generalized hives, wheezing, throat tightness, lip/tongue swelling, vomiting, dizziness, hypotension, or any progression beyond local itching/swelling. Negative tests with a strong history or positive tests that do not match symptoms may need blood IgE testing, challenge testing, or specialist interpretation."],
        ["Common NCLEX trap / teaching", "A positive skin prick test is sensitization, not automatically a food ban or a diagnosis by itself. Do not rely on unvalidated home allergy tests or IgG food panels for allergy diagnosis; history plus supervised testing matters."]
      ],
      tags: ["skin prick allergy test", "allergy skin testing", "IgE", "wheal and flare", "anaphylaxis", "antihistamines", "food allergy", "allergic rhinitis", "asthma"]
    },
    "Ambulatory blood pressure monitoring": {
      summary: "Ambulatory blood pressure monitoring uses a portable cuff and recorder to measure blood pressure repeatedly during normal daytime activity and sleep.",
      quickAnswer: "ABPM helps confirm hypertension outside the clinic, identify white-coat hypertension, masked hypertension, nocturnal hypertension, and treatment response patterns. Nursing focus: correct cuff fit, keeping an activity/sleep/medication log, protecting the device, and explaining that repeated readings are expected.",
      sections: [
        ["What it tells you", "ABPM provides many blood pressure readings across 12 to 24 hours instead of one office reading. It helps confirm sustained hypertension and detect patterns that office checks can miss, including white-coat, masked, and nighttime hypertension."],
        ["Before / preparation", "Verify correct cuff size, skin integrity, arm restrictions such as fistula or lymphedema risk, current antihypertensives, work/sleep schedule, and whether the client can manage the device. Teach the client to keep the arm still during inflation and record sleep, activity, symptoms, and medication times."],
        ["Procedure", "The cuff inflates automatically at programmed intervals, often every 20 to 30 minutes during the day and less often during sleep depending protocol. The client wears the monitor during usual activity, then returns it for data download and interpretation."],
        ["Priority nursing actions / safety", "Check comfort and circulation under the cuff, reinforce not removing the device unless instructed or unsafe, and explain that sleep interruption, bruising, or skin irritation can occur. Results should be interpreted by the prescriber with office readings, home readings, symptoms, and cardiovascular risk."],
        ["Concerning findings / reportable cues", "Escalate chest pain, stroke symptoms, syncope, severe headache with neurologic symptoms, dyspnea, or extremely high readings with symptoms. Report skin breakdown, numbness, severe pain, or device malfunction."],
        ["Common NCLEX trap / teaching", "One clinic blood pressure does not always diagnose true hypertension. Out-of-office confirmation matters before starting long-term treatment when the client is stable, but hypertensive emergency symptoms still require immediate care."]
      ],
      tags: ["ambulatory blood pressure monitoring", "ABPM", "white coat hypertension", "masked hypertension", "nocturnal hypertension", "hypertension diagnosis", "home blood pressure"]
    },
    "Sweat chloride test": {
      summary: "The sweat chloride test measures chloride in sweat and is the standard confirmatory test for cystic fibrosis when screening, symptoms, or family history raises concern.",
      quickAnswer: "Sweat chloride testing uses pilocarpine and mild electrical stimulation to collect sweat, then measures chloride concentration. Nursing focus: accredited testing, no lotion/cream on the site before testing, enough sweat collection, and knowing that intermediate results need repeat or genetic follow-up.",
      sections: [
        ["What it tells you", "People with cystic fibrosis often have elevated sweat chloride because CFTR dysfunction alters salt handling in sweat ducts. Results help confirm or evaluate CF after positive newborn screening, prenatal genetic testing, symptoms, or family history."],
        ["Before / preparation", "No special diet is usually needed, but creams or lotions should be avoided on the test area before the visit. Verify age/weight readiness, hydration/feeding plan for infants, newborn screen or genetic results, respiratory/GI symptoms, and whether the test is being done at a qualified CF testing center."],
        ["Procedure", "Pilocarpine and mild electrical stimulation encourage sweating on a small arm or leg area. Sweat is collected on gauze/filter paper or in a coil, then the lab measures chloride concentration. The test is painless, has no needles, and often takes about an hour."],
        ["Priority nursing actions / safety", "Support parents because a positive newborn screen is stressful, explain that insufficient sweat may require repeat testing, and make sure borderline results receive specialist follow-up. Continue regular medications unless the CF team gives different instructions."],
        ["Concerning findings / reportable cues", "Sweat chloride >=60 mmol/L makes CF likely, 30-59 mmol/L is intermediate and needs additional testing, and <=29 mmol/L makes CF unlikely in most cases, though clinical/genetic context still matters. Escalate poor feeding, failure to thrive, recurrent respiratory infections, meconium ileus history, dehydration, or salty-skin concerns."],
        ["Common NCLEX trap / teaching", "A positive newborn screen is not the same as a final CF diagnosis. A borderline sweat result is not ignored; it is repeated or paired with CFTR genetic/specialist evaluation."]
      ],
      tags: ["sweat chloride test", "sweat test", "cystic fibrosis", "CFTR", "newborn screen", "pilocarpine", "chloride", "failure to thrive"]
    },
    "Colposcopy": {
      after: "Teach expected mild spotting/discharge if biopsy is done and report heavy bleeding, fever, foul drainage, or severe pelvic pain.",
      trap: "Colposcopy follows abnormal screening; it is not the same thing as a Pap smear."
    },
    "Endometrial biopsy": {
      after: "Monitor cramping, bleeding, dizziness, fever, foul drainage, or severe pain and teach expected mild cramping/spotting per protocol.",
      trap: "Postmenopausal bleeding is never brushed off as normal."
    },
    "Peripheral angiography": {
      summary: "Peripheral angiography, also called extremity angiography, uses x-ray imaging and contrast dye through an arterial catheter to visualize arteries in the arms, hands, legs, or feet.",
      quickAnswer: "Peripheral angiography evaluates narrowed, blocked, bleeding, inflamed, or injured arm/leg arteries and may allow treatment such as clot medication, balloon angioplasty, or stent placement. Nursing focus: NPO/consent, pregnancy and contrast/kidney/bleeding checks, medication and supplement review, post-catheter bleeding/perfusion checks, and urgent reporting of swelling, persistent bleeding, or severe limb pain.",
      sections: [
        ["What it tells you", "Peripheral angiography shows blood flow through extremity arteries using contrast dye and x-ray/fluoroscopy. It is used when peripheral artery disease, claudication, poor wound healing, internal bleeding, vasculitis, aneurysm, clot, or vessel injury needs direct vascular detail."],
        ["Before / preparation", "Verify consent, NPO instructions often 6 to 8 hours when ordered, allergies including prior contrast reaction, pregnancy status, kidney disease, diabetes/metformin plan per policy, anticoagulants/antiplatelets, herbs/supplements, bleeding history, baseline pulses, skin color, temperature, sensation, movement, pain, and labs such as creatinine or coagulation studies when ordered."],
        ["Procedure", "The client lies on an x-ray table. The access area, often the groin, is cleaned and numbed; a catheter is passed into an artery and guided to the study area while contrast dye flows through the catheter. Blood pressure, heart rate, and respirations are monitored. Depending on findings, the team may dissolve a clot, open a narrowed artery with a balloon, or place a stent."],
        ["Priority nursing actions / safety", "After catheter removal, pressure is held and the site is dressed. Monitor vital signs, access-site bleeding or hematoma, distal pulses, color, temperature, capillary refill, pain, sensation, movement, urine output, contrast reaction, and renal-risk cues. Keep the ordered limb straight and activity-limited per facility protocol, and reinforce avoiding strenuous activity for the instructed period."],
        ["Concerning findings / reportable cues", "Report swelling, bleeding that does not stop, expanding hematoma, severe arm or leg pain, numbness/weakness, cool or pale limb, loss of pulses, fever, chest pain, stroke symptoms, shortness of breath, severe allergic symptoms, or decreased urine output after contrast."],
        ["Common NCLEX trap / teaching", "The access site and the distal limb both matter: a dry dressing is not enough if perfusion below the catheter site is worsening. Do not stop prescribed blood thinners or aspirin unless the ordering clinician directs it. Contrast allergy, kidney risk, pregnancy, and herbs/supplements are part of the pre-procedure safety screen."]
      ],
      tags: ["peripheral angiography", "extremity angiography", "peripheral angiogram", "PAD", "arteriography", "contrast", "catheter", "bleeding", "distal pulses", "kidney risk", "stent", "angioplasty"]
    },
    "Saline infusion sonohysterography": {
      summary: "Saline infusion sonohysterography is a minimally invasive ultrasound exam that places sterile saline into the uterine cavity so the endometrium and intracavitary abnormalities are easier to see.",
      quickAnswer: "SIS/sonohysterography helps evaluate unexplained vaginal bleeding, infertility, recurrent miscarriage, polyps, submucosal fibroids, adhesions/scarring, congenital uterine defects, and selected masses. Nursing focus: pregnancy exclusion, timing shortly after menses when scheduled, pelvic infection screen, cramping/spotting teaching, and urgent follow-up for fever, heavy bleeding, foul discharge, or severe pain.",
      sections: [
        ["What it tells you", "Sterile saline gently expands the uterine cavity during transvaginal ultrasound, outlining the endometrium. This improves visualization of polyps, fibroids that project into the cavity, adhesions or scarring, congenital uterine defects, malignant or suspicious lesions, and some causes of infertility or repeated miscarriage."],
        ["Before / preparation", "Confirm pregnancy status because the procedure should not be done in pregnancy. Screen for active pelvic inflammatory disease or infection symptoms, severe pelvic pain, heavy bleeding, allergies or medication instructions, and whether pain medicine is recommended before the visit. Timing is often just after the period and within about 10 days of the first day of menses to reduce infection risk and avoid disrupting a very early pregnancy."],
        ["Procedure", "A baseline transvaginal ultrasound is usually performed first. A speculum is inserted, the cervix is cleaned, a thin catheter is placed into the uterine cavity, and sterile saline is infused while the transvaginal ultrasound probe obtains images. The exam is commonly brief, roughly around 30 minutes, and does not use ionizing radiation."],
        ["Priority nursing actions / safety", "Teach that cramping during saline infusion and light spotting for a few days can be expected. Monitor vasovagal symptoms, pain tolerance, bleeding, infection cues, and emotional comfort. Reinforce follow-up because abnormal findings may lead to hysteroscopy, biopsy, surgery, fertility evaluation, or other imaging."],
        ["Concerning findings / reportable cues", "Report fever, chills, worsening pelvic or abdominal pain, heavy vaginal bleeding, foul-smelling discharge, syncope, persistent vomiting, or suspected pregnancy. Sonohysterography is generally avoided with active pelvic inflammatory disease and may be technically limited by cervical stenosis, scarring, or fibroids that prevent good cavity expansion."],
        ["Common NCLEX trap / teaching", "SIS is not the same as hysterosalpingography: SIS focuses on uterine cavity/endometrial detail with saline and ultrasound, while HSG uses radiographic contrast and is often used for tubal patency. A negative or limited SIS does not end the workup when bleeding, infertility, or cancer-risk red flags persist."]
      ],
      tags: ["saline infusion sonohysterography", "sonohysterography", "hysterosonography", "saline infusion sonography", "SIS", "uterus", "endometrium", "polyps", "fibroids", "adhesions", "infertility", "recurrent miscarriage", "pregnancy screen", "pelvic infection"]
    },
    "Hysteroscopy": {
      summary: "Hysteroscopy is an endoscopic procedure that lets a clinician inspect the uterine cavity and, when operative, treat selected structural causes of abnormal uterine bleeding.",
      quickAnswer: "Hysteroscopy uses a thin lighted scope through the vagina and cervix to view the inside of the uterus. Nursing focus: pregnancy/infection screening, consent/anesthesia plan, bleeding and pain monitoring, fluid-media safety when used, and urgent follow-up for fever, heavy bleeding, or severe pain.",
      sections: [
        ["What it tells you", "Hysteroscopy uses a thin lighted hysteroscope through the vagina and cervix to inspect the inside of the uterus. It can diagnose structural causes of abnormal uterine bleeding and may treat polyps, fibroids, adhesions, septum, retained placental tissue, or help locate an IUD. It may also support infertility or recurrent pregnancy loss evaluation."],
        ["Before / preparation", "Verify pregnancy status, active pelvic infection symptoms, consent, allergies, anesthesia plan, bleeding risk, anticoagulant use, baseline pain/bleeding, and timing in the menstrual cycle when scheduled. Teach expected cramping/pressure and whether diagnostic or operative hysteroscopy is planned."],
        ["Procedure", "The hysteroscope is inserted through the vagina and cervix. Fluid or gas may distend the uterine cavity for visualization. Diagnostic hysteroscopy may be brief; operative hysteroscopy can pass instruments through the scope to remove lesions or sample tissue and can last longer."],
        ["Priority nursing actions / safety", "Afterward monitor vital signs, pain, cramping, vaginal bleeding, dizziness or vasovagal symptoms, anesthesia recovery, and signs of fluid overload when distention media were used. Provide pad counts/bleeding teaching and follow facility instructions for activity and pelvic rest."],
        ["Concerning findings / reportable cues", "Report fever, severe or worsening abdominal/pelvic pain, heavy vaginal bleeding, foul discharge, syncope, shoulder pain, persistent vomiting, signs of perforation, or symptoms of infection. Hysteroscopy is generally avoided during pregnancy or active pelvic infection unless a specialist directs otherwise."],
        ["Common NCLEX trap / teaching", "Postmenopausal bleeding is never normal and needs evaluation. Mild cramping and light bleeding can be expected, but heavy bleeding, fever, or severe abdominal pain after hysteroscopy is not routine. Do not confuse hysteroscopy with D&C: hysteroscopy visualizes the cavity; D&C samples or scrapes lining tissue."]
      ],
      tags: ["hysteroscopy", "uterus", "abnormal uterine bleeding", "polyps", "fibroids", "adhesions", "postmenopausal bleeding", "infertility", "pelvic infection", "pregnancy"]
    },
    "Nasal endoscopy": {
      summary: "Nasal endoscopy is an ENT scope exam that directly inspects the nasal passages, nasopharynx, and upper throat for obstruction, bleeding, lesions, polyps, infection, or cancer concerns.",
      quickAnswer: "Nasal endoscopy passes a thin flexible or rigid scope through the nostril. Nursing focus: allergy/bleeding history, airway comfort, biopsy plan, no food or fluids until throat sensation returns after anesthetic spray, and reporting persistent bleeding or breathing trouble.",
      sections: [
        ["What it tells you", "Nasal endoscopy lets an ENT clinician directly inspect the nasal passages, back of the nose, nasopharynx, and upper throat. It helps evaluate obstruction, recurrent epistaxis, sinus or nasal inflammation, polyps, masses or suspicious lesions, head and neck cancer concerns, voice/swallow symptoms, and whether biopsy or deeper endoscopic exam is needed."],
        ["Before / preparation", "Verify the reason for the exam, allergies to anesthetic/decongestant sprays, anticoagulant or bleeding history, baseline airway symptoms, ability to cooperate, and whether biopsy is planned. Explain that a thin flexible scope may pass through the nostril and can feel uncomfortable but is usually brief."],
        ["Procedure", "Topical anesthetic and/or decongestant may be sprayed in the nose or throat. The clinician gently advances a thin flexible nasendoscope through the nose to inspect the nose, back of nose, and upper throat. The exam often takes only a few minutes; biopsy or additional endoscopy may take longer or require different anesthesia."],
        ["Priority nursing actions / safety", "If throat anesthetic was used, keep the client NPO until sensation and protective swallowing return per instructions, commonly 1 to 2 hours. Monitor for epistaxis, vasovagal symptoms, airway discomfort, allergic reaction, and ability to swallow safely before oral intake."],
        ["Concerning findings / reportable cues", "Report persistent bleeding, breathing difficulty, stridor, severe pain, syncope, swelling, aspiration symptoms after oral intake, or abnormal findings that require biopsy or urgent imaging. Suspicious lesions or unclear visualization may require panendoscopy or biopsy."],
        ["Common NCLEX trap / teaching", "The trap is giving food or fluids too soon after numbing spray. Another trap is treating chronic hoarseness, unilateral obstruction, recurrent bleeding, neck mass, or suspicious lesion as routine sinus congestion without follow-up."]
      ],
      tags: ["nasal endoscopy", "nasendoscopy", "nasoendoscopy", "nasopharyngoscopy", "ENT", "epistaxis", "head and neck cancer", "biopsy", "NPO after anesthetic"]
    },
    "Compartment pressure measurement": {
      before: "Treat suspected acute compartment syndrome as urgent. Assess pain out of proportion, pain with passive stretch, paresthesia, pallor, paralysis, and pulses.",
      trap: "Do not wait for absent pulses. Pulses can remain present until late."
    },
    "Synovial fluid crystal analysis": {
      trap: "Gout crystals are not the same as pseudogout crystals. Infection must still be considered when a hot swollen joint is present."
    },
    "Tuberculosis NAAT": {
      trap: "NAAT can speed TB detection, but airborne precautions and public-health protocols are based on the full clinical picture."
    },
    "Beta-D-glucan": {
      trap: "A positive fungal marker supports suspicion but is not a stand-alone diagnosis; false positives and clinical context matter."
    },
    "Galactomannan assay": {
      trap: "Most useful in high-risk clients such as neutropenia/transplant contexts. Interpret with imaging, cultures, and symptoms."
    },
    "HER2 testing": {
      trap: "HER2 status guides targeted therapy; it does not by itself diagnose cancer."
    },
    "PD-L1 testing": {
      trap: "PD-L1 helps guide immunotherapy decisions but varies by tumor type, assay, and scoring method."
    },
    "BRCA genetic testing": {
      before: "Genetic counseling and informed consent are key because results affect family risk, screening, and prevention decisions.",
      trap: "A genetic test result can affect relatives, not only the individual client."
    },
    "SPECT/CT": {
      trap: "SPECT/CT combines functional tracer information with CT localization; do not treat it as a plain CT."
    },
    "Kleihauer-Betke": {
      trap: "This test helps estimate fetal blood in maternal circulation; it is not the same as routine blood typing."
    },
    "Nitrazine": {
      trap: "False positives can occur with blood, semen, infection, or alkaline contaminants."
    },
    "Fern test": {
      trap: "Ferning supports ROM, but the clinical picture and provider evaluation still matter."
    },
    "Pulse ox congenital heart screen": {
      trap: "A failed screen requires prompt evaluation, not routine discharge reassurance."
    },
    "Newborn heel stick": {
      before: "Warm the heel if policy supports it, use correct site, collect adequate blood spots, and avoid squeezing excessively.",
      trap: "Early discharge still requires completed newborn screening and follow-up timing."
    },
    "Tonometry": {
      trap: "Eye pain plus high pressure can be urgent glaucoma, not routine eye strain."
    },
    "Weber": {
      trap: "Weber lateralization plus Rinne helps separate conductive from sensorineural hearing loss."
    },
    "Rinne": {
      trap: "Normal is air conduction greater than bone conduction."
    }
  };

  const RESULT_MEANING_OVERRIDES = {
    "Troponin I/T": [
      ["Negative / not elevated", "No myocardial injury marker elevation is detected at that draw. Early acute coronary syndrome can still be negative, so repeat/serial troponins and ECG/symptoms matter."],
      ["Positive / elevated", "Troponin elevation means myocardial injury. A rise and/or fall with ischemic symptoms, ECG changes, or imaging evidence supports myocardial infarction; stable chronic elevation can occur with kidney disease, heart failure, myocarditis, sepsis, or other myocardial stress."],
      ["Clinical significance", "The nurse treats the client and trend: chest pain, dyspnea, diaphoresis, hypotension, dysrhythmia, ST changes, and rising values are higher priority than one isolated number."]
    ],
    "CK-MB": [
      ["Negative / not elevated", "No CK-MB rise is detected; this lowers support for recent myocardial injury but does not replace troponin-based evaluation."],
      ["Positive / elevated", "CK-MB elevation suggests cardiac muscle injury but is less specific than troponin and can be affected by skeletal muscle injury. A new rise after a prior fall can support reinfarction context."],
      ["Clinical significance", "Use CK-MB as a trend/context marker, especially when reinfarction timing is the question; do not use it alone to rule in or rule out acute coronary syndrome."]
    ],
    "BNP/NT-proBNP": [
      ["Low / not elevated", "Heart failure from ventricular stretch is less likely, especially if symptoms are mild and the pretest probability is low."],
      ["High / elevated", "Elevated BNP or NT-proBNP reflects ventricular wall stretch from pressure or volume overload; heart failure is common, but age, kidney disease, pulmonary hypertension, sepsis, and atrial fibrillation can also raise values."],
      ["Clinical significance", "Pair the result with dyspnea pattern, crackles, edema, weight gain, oxygenation, chest imaging, renal function, and response to diuretics."]
    ],
    "D-dimer": [
      ["Negative", "In a low or appropriate pretest-probability client, a negative D-dimer can help rule out venous thromboembolism."],
      ["Positive", "A positive D-dimer means fibrin formation/breakdown is increased, but it is nonspecific. Clot, surgery, pregnancy, infection, cancer, trauma, inflammation, liver disease, and age can raise it."],
      ["Clinical significance", "Do not diagnose PE or DVT from a positive D-dimer alone. If clinical suspicion is moderate/high or symptoms are dangerous, imaging and escalation matter more than waiting on this test."]
    ],
    "12-lead ECG": [
      ["Normal / no acute change", "No obvious rhythm, conduction, or ischemic pattern is captured during the tracing; intermittent ischemia or dysrhythmia can still be missed."],
      ["Abnormal / positive finding", "ST elevation/depression, T-wave changes, pathologic Q waves, dysrhythmias, blocks, QT prolongation, hypertrophy, or electrolyte patterns can redirect urgent care."],
      ["Clinical significance", "Interpret with symptoms and timing. Chest pain with dynamic ECG changes is high priority even before biomarkers return."]
    ],
    "Stress ECG": [
      ["Negative", "No ischemic ECG changes or concerning symptoms occurred at the achieved workload/target; this lowers suspicion but depends on test adequacy."],
      ["Positive", "Reproducible chest pain, ischemic ST changes, hypotension, serious dysrhythmia, or poor exercise tolerance suggests inducible ischemia or unsafe cardiac response."],
      ["Clinical significance", "A nondiagnostic or submaximal test is not the same as a normal test. Symptoms during or after testing need immediate assessment."]
    ],
    "CT pulmonary angiography": [
      ["Negative", "No pulmonary embolus is seen on the study, assuming image quality is adequate."],
      ["Positive", "A filling defect in pulmonary arteries supports pulmonary embolism and changes anticoagulation, thrombolysis, or intervention decisions based on severity."],
      ["Clinical significance", "Right-heart strain, hypoxemia, syncope, hypotension, high clot burden, or worsening dyspnea makes the result urgent."]
    ],
    "V/Q scan": [
      ["Low probability / normal", "Ventilation and perfusion patterns do not support PE strongly, especially with low clinical probability."],
      ["High probability / mismatch", "Perfusion defects with preserved ventilation suggest pulmonary embolism in the right clinical context."],
      ["Indeterminate", "Matched defects or limited images may require CTPA, ultrasound, repeat imaging, or clinical decision-making rather than a simple yes/no answer."]
    ],
    "ABG": [
      ["Oxygenation result", "PaO2 and oxygen saturation show arterial oxygen status. Low PaO2 means hypoxemia and must be paired with work of breathing, SpO2 trend, and oxygen delivery."],
      ["Ventilation result", "PaCO2 reflects ventilation. High PaCO2 suggests hypoventilation/ventilatory failure; low PaCO2 suggests hyperventilation or compensation."],
      ["Acid-base result", "pH and bicarbonate show acidemia/alkalemia and metabolic contribution. Interpretation starts with pH direction, PaCO2, HCO3, compensation, and clinical stability."]
    ],
    "Pulmonary Function Tests": [
      ["Obstructive pattern", "Reduced airflow, especially low FEV1/FVC, supports obstruction such as asthma or COPD; bronchodilator response helps assess reversibility."],
      ["Restrictive pattern", "Reduced lung volumes suggest restriction from interstitial, chest wall, neuromuscular, obesity, or pleural causes and often needs lung-volume/DLCO context."],
      ["Clinical significance", "PFTs classify physiology; they do not replace oxygenation assessment during acute respiratory distress."]
    ],
    "Peak Flow": [
      ["Green / near personal best (at least 80%)", "Airflow is near the client's usual controlled range; continue the individualized written asthma action plan while still checking symptoms."],
      ["Yellow / reduced (50-79%)", "Airflow is worsening; follow the written asthma action plan and assess symptoms and response to prescribed rescue medicine."],
      ["Red / severely reduced (below 50%)", "Severe obstruction risk. Follow the red-zone plan and seek urgent help as directed; respiratory distress, cyanosis, exhaustion, or poor rescue response is an emergency regardless of the number."]
    ],
    "Sputum culture": [
      ["No growth / normal flora", "No dominant bacterial pathogen is isolated, or the sample reflects expected airway flora."],
      ["Positive growth", "A respiratory organism is isolated and susceptibility results can guide antibiotics when the specimen quality and symptoms fit infection."],
      ["Poor-quality specimen", "Many epithelial cells or heavy oral contamination can make the result misleading and may require recollection."]
    ],
    "Gram stain": [
      ["No organisms seen", "No organisms are visible on the smear; infection is still possible if burden is low or sampling is poor."],
      ["Organisms seen", "Gram-positive/gram-negative shape and grouping give early organism clues before culture finalizes."],
      ["Specimen quality", "Many squamous epithelial cells suggest oral/skin contamination; many WBCs support inflammatory/infectious material."]
    ],
    "AFB smear": [
      ["Negative", "No acid-fast organisms are seen on smear. TB is not ruled out because smear sensitivity is limited."],
      ["Positive", "Acid-fast organisms are seen, raising concern for TB or nontuberculous mycobacteria; airborne precautions and confirmatory testing matter."],
      ["Clinical significance", "Culture or NAAT identifies the organism and drug resistance; do not discontinue TB precautions solely from one negative smear when suspicion remains."]
    ],
    "PPD": [
      ["Negative", "No significant induration at the risk-based cutoff. TB infection is less likely, but false negatives occur with recent exposure, young age, severe illness, or immunosuppression."],
      ["Positive", "Induration meeting the client's risk-based cutoff means TB infection is possible; it does not distinguish latent infection from active TB disease."],
      ["Clinical significance", "Positive testing or TB symptoms require further evaluation such as chest imaging and sputum testing; read the test at 48-72 hours and measure induration, not redness."]
    ],
    "IGRA": [
      ["Negative", "No TB immune response is detected. TB infection is less likely, but active TB can still require evaluation when symptoms, recent exposure, or immunosuppression are present."],
      ["Positive", "The immune system responded to TB antigens, meaning TB infection is likely. It does not prove active disease."],
      ["Indeterminate / borderline", "The result cannot be interpreted cleanly and may require repeat testing or another TB test depending risk and symptoms."]
    ],
    "FOBT": [
      ["Negative", "No occult blood is detected in that stool sample; intermittent bleeding and improper sampling can still miss disease."],
      ["Positive", "Occult blood is detected, raising concern for GI bleeding, polyps, colorectal cancer, inflammatory disease, hemorrhoids, or medication-related bleeding."],
      ["Clinical significance", "A positive screening stool blood test requires follow-up, often colon evaluation; it does not localize the bleeding source by itself."]
    ],
    "FIT": [
      ["Negative", "No human hemoglobin is detected above the assay cutoff in that stool sample."],
      ["Positive", "Human blood is detected in stool, requiring follow-up evaluation for colorectal cancer, polyps, or lower GI bleeding sources."],
      ["Clinical significance", "FIT is more specific to lower GI human blood than guaiac FOBT, but a positive result is not a cancer diagnosis."]
    ],
    "Stool culture": [
      ["Negative", "No targeted bacterial pathogen is isolated."],
      ["Positive", "A bacterial pathogen is identified and susceptibility/public-health implications may guide therapy or isolation."],
      ["Clinical significance", "Severe dehydration, bloody diarrhea, fever, immunosuppression, or outbreak concern makes results higher priority."]
    ],
    "Ova & parasites": [
      ["Negative", "No ova or parasites are seen in the submitted specimen; intermittent shedding can require repeat specimens."],
      ["Positive", "Parasite, ova, cysts, or trophozoites are identified and therapy depends on the organism."],
      ["Clinical significance", "Travel, exposure, eosinophilia, persistent diarrhea, weight loss, or immunosuppression changes urgency."]
    ],
    "C. difficile toxin": [
      ["Negative", "C. difficile toxin/organism is not detected by the ordered method, making active C. difficile less likely when sampling is appropriate."],
      ["Positive", "Toxigenic C. difficile is detected. With clinically significant diarrhea, this supports C. difficile infection."],
      ["Clinical significance", "Do not test formed stool in routine cases. Severe diarrhea, leukocytosis, kidney injury, ileus, or hypotension needs escalation."]
    ],
    "H. pylori breath/stool tests": [
      ["Negative", "No active H. pylori signal is detected, but recent antibiotics, bismuth, or proton-pump inhibitors can cause false negatives."],
      ["Positive", "Active H. pylori infection is detected and can explain peptic ulcer disease, gastritis, or dyspepsia patterns."],
      ["Clinical significance", "Confirm eradication when ordered and check medication holds before testing so the result is not falsely reassuring."]
    ],
    "LFTs": [
      ["Hepatocellular pattern", "AST/ALT prominence suggests hepatocyte injury from viral, ischemic, toxic, metabolic, autoimmune, or medication causes."],
      ["Cholestatic pattern", "Alkaline phosphatase/GGT and conjugated bilirubin prominence suggests impaired bile flow or biliary obstruction/injury."],
      ["Synthetic function pattern", "Albumin and INR/PT help show liver production capacity; worsening INR, low albumin, jaundice, or encephalopathy is more dangerous than mild transaminase elevation."]
    ],
    "Amylase": [
      ["Normal", "No amylase elevation is detected; pancreatitis can still be present if timing or assay sensitivity is unfavorable."],
      ["High", "Amylase can rise with pancreatitis but also salivary disease, bowel injury, kidney impairment, macroamylasemia, or other abdominal processes."],
      ["Clinical significance", "Lipase is generally more pancreas-specific. Interpret enzymes with pain pattern, imaging, triglycerides, alcohol/gallstone risk, and clinical stability."]
    ],
    "Lipase": [
      ["Normal", "Pancreatitis is less likely, especially if symptoms are not classic and timing is appropriate."],
      ["High", "Lipase elevation supports pancreatic inflammation/injury, especially with characteristic epigastric pain and imaging/clinical fit."],
      ["Clinical significance", "Severe pain, hypotension, hypoxia, fever, ileus, or organ dysfunction makes pancreatitis a priority beyond the number."]
    ],
    "CT head": [
      ["No acute finding", "No acute bleed, mass effect, large infarct, or fracture is seen on the scan; early ischemic stroke may still be invisible."],
      ["Positive / abnormal", "Hemorrhage, mass effect, fracture, hydrocephalus, edema, or evolving infarct changes the urgency and treatment pathway."],
      ["Clinical significance", "New neuro deficit is still treated as urgent even if early imaging is negative."]
    ],
    "EEG": [
      ["Normal", "No epileptiform or major abnormal electrical pattern is captured during the recording; intermittent seizures can still be missed."],
      ["Abnormal", "Epileptiform discharges, focal slowing, generalized slowing, or seizure activity supports seizure tendency, encephalopathy, or focal brain dysfunction depending pattern."],
      ["Clinical significance", "Video correlation, medication effects, metabolic problems, and clinical events determine meaning."]
    ],
    "Lumbar puncture": [
      ["Normal CSF", "Opening pressure, cells, glucose, protein, Gram stain/culture, and other ordered tests do not show the suspected abnormality."],
      ["Infectious pattern", "High WBC, low glucose, high protein, positive Gram stain/culture/PCR, or neutrophil/lymphocyte patterns can support meningitis or encephalitis workup."],
      ["Bleeding/inflammation pattern", "Xanthochromia, RBC pattern, oligoclonal bands, malignant cells, or high opening pressure changes the differential and urgency."]
    ],
    "HbA1c": [
      ["Lower / goal range", "Average glucose exposure over roughly 2-3 months is closer to target, but anemia, transfusion, hemoglobin variants, kidney disease, and pregnancy can affect interpretation."],
      ["High", "Higher A1c means higher average glycemia and diabetes complication risk; it supports diabetes diagnosis/monitoring when criteria and context fit."],
      ["Clinical significance", "A1c does not detect acute hypoglycemia or hyperglycemic crisis. Pair with symptoms and fingerstick/serum glucose when unstable."]
    ],
    "OGTT": [
      ["Normal glucose handling", "Glucose rises after the oral load and returns within expected limits."],
      ["Abnormal / elevated", "Glucose remains too high after the load, supporting impaired glucose tolerance, diabetes, or gestational diabetes depending protocol and pregnancy status."],
      ["Clinical significance", "Correct fasting, timing, and full sample sequence matter; vomiting or missed timing can invalidate the test."]
    ],
    "Fasting glucose": [
      ["Low", "Hypoglycemia may indicate medication effect, prolonged fasting, critical illness, endocrine disease, or nutrition problems and needs symptom assessment."],
      ["Normal", "Fasting glucose is within expected range at that draw."],
      ["High", "Elevated fasting glucose supports impaired fasting glucose or diabetes when diagnostic criteria are met and confirmed as required."]
    ],
    "Random glucose": [
      ["Low", "Hypoglycemia is immediately clinically important if symptomatic or severe."],
      ["Normal", "Random glucose is not elevated at the time checked."],
      ["High", "Marked random hyperglycemia with classic symptoms can support diabetes diagnosis and may signal DKA/HHS risk when very high or symptomatic."]
    ],
    "TSH": [
      ["High TSH", "Usually suggests primary hypothyroidism when free T4 is low or low-normal; pituitary response is trying to stimulate the thyroid."],
      ["Low TSH", "Usually suggests hyperthyroidism or excess thyroid hormone when free T4/T3 are high; can also reflect pituitary/hypothalamic disease or medication effects."],
      ["Clinical significance", "TSH is a screen anchor, but acute illness, pregnancy, pituitary disease, amiodarone, biotin, and timing of thyroid medication can affect interpretation."]
    ],
    "Free T4": [
      ["Low", "Low free T4 with high TSH supports primary hypothyroidism; low/normal TSH with low free T4 raises central hypothyroidism concern."],
      ["High", "High free T4 with low TSH supports thyrotoxicosis or excess thyroid hormone exposure."],
      ["Clinical significance", "Interpret free T4 with TSH, symptoms, pregnancy context, medications, and thyroid storm/myxedema cues."]
    ],
    "Free T3": [
      ["Normal", "T3 is not elevated at that draw; this does not replace TSH/free T4 in most screening."],
      ["High", "Elevated T3 can support hyperthyroidism, including T3 toxicosis when T4 is not high."],
      ["Clinical significance", "T3 is most helpful in selected hyperthyroid evaluation, not as the first general thyroid screen."]
    ],
    "Radioactive iodine uptake": [
      ["Low uptake", "Thyroid hormone is high but the gland is not actively trapping iodine, suggesting thyroiditis, exogenous hormone, or iodine load patterns."],
      ["High diffuse uptake", "The gland is actively making hormone, classically Graves disease when clinical features fit."],
      ["Focal uptake", "Hot or cold nodules require thyroid-specific interpretation; cold nodules may need ultrasound/FNA risk assessment."]
    ],
    "ACTH stimulation": [
      ["Adequate cortisol rise", "The adrenal glands respond to ACTH, making clinically significant primary adrenal insufficiency less likely."],
      ["Blunted cortisol rise", "Inadequate cortisol response supports adrenal insufficiency and requires urgent context if the client is hypotensive, hyperkalemic, hyponatremic, or acutely ill."],
      ["Clinical significance", "Timing and baseline steroid exposure matter. Do not delay emergency steroid treatment for adrenal crisis when unstable."]
    ],
    "Dexamethasone suppression": [
      ["Suppressed cortisol", "Cortisol falls appropriately after dexamethasone, making autonomous cortisol excess less likely in the tested protocol."],
      ["No suppression", "Cortisol remains inappropriately high, supporting Cushing syndrome evaluation when the protocol and clinical picture fit."],
      ["Clinical significance", "Stress, alcohol use, depression, obesity, estrogen therapy, antiseizure drugs, and incorrect timing can affect results."]
    ],
    "Urinalysis": [
      ["Infection pattern", "Leukocyte esterase, nitrites, WBCs, bacteria, and symptoms support UTI; culture clarifies organism and susceptibility when needed."],
      ["Kidney/glomerular pattern", "Protein, blood, RBC casts, or dysmorphic RBCs suggest kidney or glomerular disease rather than simple contamination."],
      ["Metabolic/hydration pattern", "Glucose, ketones, specific gravity, pH, and bilirubin/urobilinogen can point toward diabetes, dehydration, acid-base, liver, or medication contexts."]
    ],
    "Urine culture": [
      ["Negative / no significant growth", "No significant urinary pathogen is isolated, making bacterial UTI less likely when collection was adequate."],
      ["Positive growth", "A urinary organism grows in significant quantity and susceptibility data can guide antibiotics when symptoms support UTI."],
      ["Mixed flora / contaminated", "Multiple organisms or poor collection may reflect contamination and require repeat collection rather than treatment."]
    ],
    "Specific gravity": [
      ["Low", "Dilute urine suggests high fluid intake, impaired concentrating ability, diabetes insipidus, or renal tubular issues depending context."],
      ["High", "Concentrated urine suggests dehydration, volume depletion, glycosuria/proteinuria, SIADH context, or contrast/solute effect depending context."],
      ["Clinical significance", "Use with urine output, sodium/osmolality, glucose, kidney function, and hydration status."]
    ],
    "Microalbumin": [
      ["Normal / low", "No increased albumin leak is detected, lowering evidence of early diabetic or hypertensive kidney damage at that time."],
      ["Elevated", "Albuminuria suggests kidney endothelial/glomerular injury and raises cardiovascular and kidney progression risk."],
      ["Clinical significance", "Confirm persistent elevation and interpret with urine creatinine ratio, blood pressure, diabetes control, fever/exercise/UTI, and pregnancy context."]
    ],
    "Urine protein": [
      ["Negative / trace", "No meaningful proteinuria is detected, though concentrated urine and timing can affect dipstick readings."],
      ["Positive", "Proteinuria suggests kidney disease, preeclampsia, fever/exercise effect, infection, or orthostatic proteinuria depending context."],
      ["Clinical significance", "Quantify persistent protein with protein/creatinine ratio or timed urine as ordered and assess edema, BP, creatinine, and pregnancy status."]
    ],
    "CBC": [
      ["WBC result", "High WBC can suggest infection/inflammation/stress/steroids or malignancy; low WBC can signal marrow suppression, viral illness, sepsis, or medication toxicity."],
      ["Hemoglobin/hematocrit result", "Low values suggest anemia or blood loss; high values suggest hemoconcentration or polycythemia context."],
      ["Platelet result", "Low platelets raise bleeding risk and marrow/consumption concerns; high platelets may reflect inflammation, iron deficiency, or myeloproliferative disease."]
    ],
    "Peripheral smear": [
      ["Normal morphology", "No major abnormal cell-shape, blast, parasite, or platelet morphology is seen."],
      ["Abnormal morphology", "Schistocytes, blasts, sickled cells, spherocytes, target cells, parasites, or platelet clumping can redirect diagnosis urgently."],
      ["Clinical significance", "Smear findings can explain why automated CBC numbers look abnormal and may reveal hemolysis, leukemia, or malaria-type emergencies."]
    ],
    "Reticulocyte count": [
      ["Low reticulocytes", "The marrow is not responding adequately, suggesting underproduction from deficiency, marrow disease, kidney disease, inflammation, or medication effect."],
      ["High reticulocytes", "The marrow is responding to RBC loss/destruction, suggesting bleeding recovery or hemolysis when anemia is present."],
      ["Clinical significance", "Reticulocytes explain anemia mechanism: production problem versus loss/destruction response."]
    ],
    "PT": [
      ["Prolonged", "Extrinsic/common pathway clotting is delayed, seen with warfarin effect, vitamin K deficiency, liver dysfunction, DIC, or factor deficiency."],
      ["Normal", "PT pathway timing is not prolonged, but platelet problems, aPTT pathway issues, or anticoagulants can still matter."],
      ["Clinical significance", "Use PT with INR, bleeding signs, liver function, medication history, and procedure risk."]
    ],
    "INR": [
      ["Low/subtherapeutic", "Warfarin effect may be inadequate for the ordered goal, raising clot risk for clients who require anticoagulation."],
      ["Therapeutic", "Anticoagulation is within the ordered target range for that indication."],
      ["High/supratherapeutic", "Bleeding risk rises. Assess bleeding, falls, interacting drugs, diet changes, liver disease, and reversal plan if severe."]
    ],
    "aPTT": [
      ["Prolonged", "Intrinsic/common pathway clotting is delayed, commonly from unfractionated heparin effect, factor deficiency, lupus anticoagulant, DIC, or severe illness."],
      ["Short/normal", "Heparin effect may be absent/subtherapeutic if heparin is being monitored, but context and protocol determine meaning."],
      ["Clinical significance", "Use with bleeding/clotting signs, heparin protocol, platelet trend, and anti-Xa if ordered."]
    ],
    "Anti-Xa": [
      ["Low", "Heparin/LMWH activity may be subtherapeutic, raising clot risk when anticoagulation is needed."],
      ["Therapeutic", "Measured factor Xa inhibition matches the protocol target for the anticoagulant and indication."],
      ["High", "Anticoagulant effect is excessive and bleeding risk rises; assess renal function, timing of draw, dose, and bleeding."]
    ],
    "Fibrinogen": [
      ["Low", "Low fibrinogen impairs clot formation and can occur in DIC, massive bleeding, liver failure, or obstetric hemorrhage."],
      ["High", "High fibrinogen is an acute-phase response and can rise with inflammation, pregnancy, infection, or malignancy."],
      ["Clinical significance", "In bleeding/DIC/OB emergencies, falling fibrinogen can be a major danger signal."]
    ],
    "Coombs": [
      ["Negative", "No clumping/antiglobulin reaction is detected, so RBC-bound antibodies or complement are not found by this test. Immune hemolysis is less supported, but hemolysis from nonimmune causes can still occur."],
      ["Positive direct Coombs / DAT", "Antibodies and/or complement are attached to the patient's red blood cells. This supports immune-mediated hemolysis patterns such as autoimmune hemolytic anemia, hemolytic disease of the newborn, drug-induced hemolysis, or transfusion reaction."],
      ["Clinical significance", "Pair the result with hemoglobin/hematocrit, bilirubin, LDH, haptoglobin, reticulocytes, jaundice, newborn bilirubin trend, and transfusion history."]
    ],
    "Indirect Coombs test": [
      ["Negative", "No clinically significant circulating anti-RBC antibodies are detected in the tested sample at that time."],
      ["Positive indirect Coombs / antibody screen", "Circulating antibodies can react against foreign RBC antigens. In pregnancy this can signal alloimmunization risk; before transfusion it can signal incompatible blood risk."],
      ["Clinical significance", "A positive result needs antibody identification, compatible blood selection, and pregnancy/newborn monitoring when relevant."]
    ],
    "Hemoglobin electrophoresis": [
      ["Normal pattern", "Expected adult hemoglobin fractions are present without a major variant pattern."],
      ["Abnormal pattern", "Hemoglobin S, C, E, F elevation, or thalassemia-like fractions can support sickle cell disease/trait, thalassemia, or other hemoglobin variants."],
      ["Clinical significance", "Interpret with CBC indices, smear, iron studies, family history, newborn screen, and symptoms."]
    ],
    "Serum protein electrophoresis": [
      ["No monoclonal spike", "No clear monoclonal protein band is detected, lowering evidence for monoclonal gammopathy in that sample."],
      ["Monoclonal spike / abnormal band", "A narrow abnormal protein band suggests monoclonal gammopathy such as MGUS, myeloma, Waldenstrom macroglobulinemia, or related disorders."],
      ["Clinical significance", "Pair with immunofixation, free light chains, CBC, calcium, creatinine, bone pain/lesions, infection risk, and hematology follow-up."]
    ],
    "ANA": [
      ["Negative", "Systemic autoimmune disease such as lupus is less likely, though not impossible when clinical suspicion is strong."],
      ["Positive", "Antinuclear antibodies are present. This supports autoimmune evaluation but can occur in healthy people, infections, medications, or other autoimmune disease."],
      ["Clinical significance", "Titer, pattern, symptoms, urinalysis, complements, anti-dsDNA/ENA, CBC, and organ findings determine meaning."]
    ],
    "ANCA": [
      ["Negative", "ANCA-associated vasculitis is less supported, but disease is not fully excluded when symptoms and biopsy/imaging fit."],
      ["Positive", "PR3/c-ANCA or MPO/p-ANCA patterns support selected small-vessel vasculitis workup in the right clinical context."],
      ["Clinical significance", "Hematuria/proteinuria, pulmonary hemorrhage, sinus disease, neuropathy, skin purpura, kidney function, and biopsy context matter."]
    ],
    "Complement levels": [
      ["Low C3/C4/CH50", "Complement consumption or deficiency is suggested, seen in immune-complex disease, lupus activity, infection, hereditary deficiency, or liver/synthesis issues."],
      ["Normal", "Complement consumption is not evident at that draw, though autoimmune disease can still be active by other markers."],
      ["Clinical significance", "Pair with lupus symptoms, urinalysis/proteinuria, creatinine, anti-dsDNA, infection pattern, and hereditary infection history."]
    ],
    "Fetal fibronectin": [
      ["Negative", "Short-term preterm birth risk is low in the appropriate symptomatic client and gestational-age window."],
      ["Positive", "Fetal fibronectin is present and preterm birth risk is higher, but the result is not a diagnosis of imminent delivery."],
      ["Clinical significance", "Use with gestational age, cervical length, contractions, rupture of membranes, bleeding, infection, and provider plan."]
    ],
    "Kleihauer-Betke": [
      ["Negative / low fetal cells", "Little or no fetal blood is detected in maternal circulation."],
      ["Positive / elevated fetal cells", "Fetomaternal hemorrhage is detected/quantified and can guide Rh immune globulin dosing or fetal-maternal monitoring."],
      ["Clinical significance", "Use after trauma, bleeding, stillbirth evaluation, or Rh-negative pregnancy contexts; it is not routine blood typing."]
    ],
    "Nitrazine": [
      ["Negative", "Vaginal fluid is not alkaline by this screen, making rupture of membranes less supported."],
      ["Positive", "Alkaline fluid supports possible rupture of membranes, but blood, semen, infection, urine contamination, or antiseptics can cause false positives."],
      ["Clinical significance", "Interpret with pooling, ferning, ultrasound fluid, gestational age, contractions, fever, and fetal status."]
    ],
    "Fern test": [
      ["Negative", "No ferning pattern is seen; rupture of membranes is less supported but not fully excluded."],
      ["Positive", "A ferning/crystallization pattern supports amniotic fluid and rupture of membranes."],
      ["Clinical significance", "Use with pooling, nitrazine, speculum exam, gestational age, infection signs, and fetal/maternal status."]
    ],
    "Pulse ox congenital heart screen": [
      ["Pass", "Oxygen saturation pattern does not meet failed-screen criteria for critical congenital heart disease at that screen."],
      ["Fail / positive screen", "Low or discrepant preductal/postductal saturations suggest possible critical congenital heart disease and require prompt evaluation."],
      ["Clinical significance", "A failed screen is not routine discharge; assess color, feeding, respiratory effort, pulses, murmur, and provider/newborn cardiac evaluation."]
    ],
    "Sweat chloride test": [
      ["Low / unlikely", "Low sweat chloride makes cystic fibrosis unlikely in most contexts, though genetics and symptoms can still matter."],
      ["Intermediate", "Borderline/intermediate chloride requires repeat testing and/or CFTR genetic or specialist evaluation."],
      ["High / positive", "High sweat chloride supports cystic fibrosis when collected by an accredited method and interpreted with clinical/genetic context."]
    ],
    "HPV testing": [
      ["Negative", "High-risk HPV is not detected, lowering near-term cervical cancer risk when screening is adequate."],
      ["Positive", "High-risk HPV is detected and follow-up depends on genotype, cytology, age, pregnancy status, and screening history."],
      ["Clinical significance", "HPV positivity is not cancer; it identifies risk that needs guideline-based follow-up."]
    ],
    "Pap smear": [
      ["Normal / negative cytology", "No precancerous or malignant cervical cells are reported in the sample."],
      ["Abnormal cytology", "ASC-US, LSIL, HSIL, AGC, or malignant cells require risk-based follow-up such as HPV testing, repeat cytology, colposcopy, or biopsy."],
      ["Clinical significance", "Pap results screen cells; colposcopy/biopsy confirms tissue diagnosis when needed."]
    ],
    "Mammogram": [
      ["Negative / benign", "No suspicious breast imaging finding is reported, or the finding appears benign."],
      ["Abnormal / suspicious", "A mass, calcifications, asymmetry, or distortion may require diagnostic mammogram, ultrasound, MRI, or biopsy."],
      ["Clinical significance", "BI-RADS category drives follow-up; a palpable concerning mass still needs evaluation even after a negative screen."]
    ],
    "PSA": [
      ["Lower / stable", "PSA is not elevated or is stable for the client context; prostate cancer is less supported but not impossible."],
      ["High / rising", "Elevated or rapidly rising PSA can reflect prostate cancer, BPH, prostatitis, urinary retention, recent ejaculation/procedure, or instrumentation."],
      ["Clinical significance", "Interpret with age, prostate exam, symptoms, infection, medications, trend, and urology guidance."]
    ],
    "HER2 testing": [
      ["Negative", "HER2 overexpression/amplification is not demonstrated, so HER2-targeted therapy may not be indicated for that tumor context."],
      ["Positive", "HER2 overexpression or gene amplification is present and can guide HER2-targeted therapy choices."],
      ["Equivocal", "Borderline results need reflex or confirmatory testing according to tumor-specific protocols."]
    ],
    "PD-L1 testing": [
      ["Low / negative expression", "PD-L1 expression is low or absent by the assay, which may reduce likelihood of benefit from selected checkpoint inhibitor strategies depending tumor type."],
      ["Positive / high expression", "PD-L1 expression is present at or above a cutoff and may support immunotherapy eligibility depending tumor type, assay, and treatment line."],
      ["Clinical significance", "PD-L1 is predictive context, not a cancer diagnosis; scoring systems differ by tumor and assay."]
    ],
    "BRCA genetic testing": [
      ["Negative", "No tested pathogenic BRCA variant is found; hereditary risk may still exist from untested genes or family patterns."],
      ["Pathogenic variant", "A disease-associated BRCA1/BRCA2 variant is found, changing cancer-risk management and family counseling."],
      ["Variant of uncertain significance", "A DNA change is found but its meaning is unclear; it should not be treated like a pathogenic mutation."]
    ]
  };

  function normalizeName(value) {
    return String(value || "").trim();
  }

  function normalizeMeaningRows(rows = []) {
    return (Array.isArray(rows) ? rows : [])
      .map((row) => {
        if (Array.isArray(row)) {
          return { label: normalizeName(row[0]), meaning: normalizeName(row[1]) };
        }
        return {
          label: normalizeName(row?.label || row?.result || row?.name),
          meaning: normalizeName(row?.meaning || row?.interpretation || row?.description)
        };
      })
      .filter((row) => row.label && row.meaning);
  }

  function trimPeriod(value = "") {
    return normalizeName(value).replace(/[.]+$/g, "");
  }

  function defaultResultMeanings({ name = "", displayName = "", kind = "", domain = "", use = "" } = {}) {
    const label = displayName || name || "This test";
    const purpose = trimPeriod(use) || `evaluate ${domain || "the clinical question"}`;
    if (kind === "culture") {
      return [
        ["Negative / no growth", `${label} does not identify a target organism from the submitted specimen. Infection may still be possible if the specimen was collected late, after antibiotics, from the wrong site, or with low organism burden.`],
        ["Positive / organism detected", `${label} identifies an organism or organism clue related to ${purpose.toLowerCase()}. The result becomes more meaningful when the specimen source, symptoms, WBC/fever trend, and susceptibility results fit.`],
        ["Mixed / contaminated / inconclusive", `Mixed flora, poor specimen quality, or inadequate volume can make ${label} misleading and may require repeat collection before treatment decisions.`]
      ];
    }
    if (kind === "screening") {
      return [
        ["Negative / pass / low-risk screen", `${label} does not meet the screening threshold for the target problem. This lowers risk but does not eliminate disease when symptoms or high-risk history are present.`],
        ["Positive / failed screen / high-risk screen", `${label} meets a threshold that needs follow-up for ${purpose.toLowerCase()}. A positive screen usually points to confirmatory testing, not instant final diagnosis.`],
        ["Invalid / borderline / incomplete", `If ${label} is indeterminate, borderline, inadequate, or collected at the wrong time, repeat testing or a different diagnostic test may be needed.`]
      ];
    }
    if (kind === "imaging" || kind === "nuclear") {
      return [
        ["Normal / no acute finding", `${label} does not show the targeted abnormality for ${purpose.toLowerCase()} on the images obtained. Early disease, small lesions, motion, or the wrong modality can still miss pathology.`],
        ["Abnormal / positive finding", `${label} shows a structural or functional abnormality related to the clinical question. Location, size, severity, comparison with old imaging, and symptoms determine urgency.`],
        ["Indeterminate / limited study", `If ${label} is limited by motion, body habitus, artifact, contrast timing, or equivocal findings, the next step may be repeat imaging, another modality, lab correlation, or specialist review.`]
      ];
    }
    if (kind === "cardiac") {
      return [
        ["Reassuring / no acute finding", `${label} does not show an acute abnormality at the time tested, but intermittent dysrhythmia, evolving ischemia, or exertional symptoms can still require serial testing.`],
        ["Abnormal / positive finding", `${label} shows rhythm, perfusion, structure, pressure, or ischemia-related findings that must be tied to symptoms, vital signs, ECG/lab trends, and cardiac history.`],
        ["Dangerous result pattern", `Chest pain, syncope, hypotension, pulmonary edema, unstable rhythm, rising biomarkers, or new ischemic changes make ${label} clinically urgent.`]
      ];
    }
    if (kind === "pulmonary") {
      return [
        ["Reassuring / expected", `${label} does not show the targeted airway, ventilation, oxygenation, or lung-function abnormality in the tested condition.`],
        ["Abnormal / positive", `${label} suggests an airway, ventilation, oxygenation, infection, or gas-exchange problem related to ${purpose.toLowerCase()}.`],
        ["Clinical significance", `Respiratory distress, hypoxemia, cyanosis, fatigue, altered mental status, hemoptysis, or absent breath sounds outrank completing ${label}.`]
      ];
    }
    if (kind === "endocrine" || kind === "lab") {
      return [
        ["Within expected range / negative", `${label} does not show the measured abnormality for ${purpose.toLowerCase()} in this sample. Interpretation still depends on timing, reference range, medications, and symptoms.`],
        ["High / positive / detected", `${label} shows the measured marker is elevated, present, or abnormal in the direction the test detects. Connect it to ${purpose.toLowerCase()}, the trend, and confirmatory tests.`],
        ["Low / negative / not detected", `${label} may show the marker is low or absent; for some tests that is reassuring, while for hormones, proteins, blood counts, or timed tests it can be the abnormal result.`]
      ];
    }
    if (kind === "ob") {
      return [
        ["Reassuring / expected", `${label} does not show the targeted maternal, fetal, uterine, or pregnancy complication pattern at the time tested.`],
        ["Abnormal / positive", `${label} suggests a maternal-fetal issue related to ${purpose.toLowerCase()} and must be interpreted with gestational age.`],
        ["Clinical significance", `Bleeding, contractions, fever, severe abdominal pain, decreased fetal movement, nonreassuring fetal status, or hypertensive warning signs make ${label} urgent.`]
      ];
    }
    if (kind === "neuro") {
      return [
        ["Normal / no focal finding", `${label} does not show the targeted neurologic abnormality during the assessment or study, but intermittent or early neurologic disease can still be missed.`],
        ["Abnormal / positive", `${label} shows a neurologic pattern related to ${purpose.toLowerCase()}; timing, baseline, medications, glucose, oxygenation, and imaging/lab context determine meaning.`],
        ["Clinical significance", `New focal deficit, seizure, severe headache, reduced consciousness, unequal pupils, or airway/swallow risk makes ${label} high priority.`]
      ];
    }
    if (kind === "eyeEar") {
      return [
        ["Normal / expected", `${label} does not show the targeted eye, ear, balance, pressure, or sensory abnormality during the exam.`],
        ["Abnormal / positive", `${label} detects a vision, hearing, vestibular, pressure, inflammation, or structural finding that should be tied to symptoms and safety risk.`],
        ["Clinical significance", `Sudden vision/hearing loss, eye pain, trauma, very high pressure, neurologic deficit, or infection signs are urgent result contexts.`]
      ];
    }
    return [
      ["Normal / expected", `${label} does not show the targeted abnormality for ${purpose.toLowerCase()} in the available result.`],
      ["Abnormal / positive", `${label} shows a finding that supports, stages, localizes, or redirects evaluation for ${purpose.toLowerCase()}.`],
      ["Inconclusive / incomplete", `If ${label} is limited, borderline, inadequate, or discordant with the client picture, repeat testing, another modality, or specialist interpretation may be needed.`]
    ];
  }

  function uniqueTerms(terms) {
    const seen = new Set();
    return terms
      .flat()
      .map(normalizeName)
      .filter(Boolean)
      .filter((term) => {
        const key = term.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function makeEntry([name, kind, domain, use, aliases = []]) {
    const meta = KIND_META[kind] || KIND_META.procedure;
    const override = DETAIL_OVERRIDES[name] || {};
    const lowerDomain = domain ? `${domain} diagnostic tool` : "Diagnostic tool";
    const before = override.before || meta.before;
    const after = override.after || meta.nursing;
    const redFlags = override.redFlags || meta.redFlags;
    const trap = override.trap || meta.trap;
    const cleanName = normalizeName(name);
    const fullForm = normalizeName(override.fullForm || fullFormForName(cleanName));
    const displayName = displayNameForEntry(cleanName, fullForm);
    const cleanUse = normalizeName(use) || `Helps evaluate ${domain || "clinical"} concerns.`;
    const searchableAliases = uniqueTerms([
      Array.isArray(override.identityAliases) ? override.identityAliases : aliases,
      fullForm,
      displayName,
      cleanName.replace(/[()]/g, ""),
      cleanName.replace(/&/g, "and")
    ]);
    const resultMeanings = normalizeMeaningRows(
      override.resultMeanings
      || RESULT_MEANING_OVERRIDES[cleanName]
      || []
    );

    const defaultSections = [
      ["What it tells you", cleanUse],
      ["Before / preparation", before],
      ["Priority nursing actions", after],
      ["Concerning results / reportable cues", redFlags],
      ["Common NCLEX trap / nuance", trap]
    ];
    const customSections = Array.isArray(override.sections) ? override.sections : null;

    return {
      name: cleanName,
      fullForm,
      displayName,
      type: "procedure",
      category: lowerDomain,
      nclexEssential: true,
      icon: meta.icon,
      aliases: searchableAliases,
      summary: override.summary || `${displayName} is a high-yield ${domain || "clinical"} diagnostic reference. ${cleanUse}`,
      quickAnswer: override.quickAnswer || `${displayName}: ${cleanUse} Nursing focus: prepare correctly, protect safety, trend results with assessment, and escalate red-flag findings.`,
      whyItMatters: override.whyItMatters || "",
      resultMeanings,
      resultMeaningProvenance: resultMeanings.length ? "reviewed-canonical-profile" : "not-authored",
      sections: customSections || defaultSections,
      diagnosticKind: kind,
      tags: uniqueTerms([domain, kind, meta.icon, aliases, cleanName, override.tags || [], "result interpretation", "positive negative results", "diagnostic test", "NCLEX diagnostic tools"]),
      sourceKeys: Array.isArray(override.sourceKeys) ? override.sourceKeys.slice() : [],
      sourceNote: override.sourceNote || SOURCE_NOTE
    };
  }

  function applyAliasEnrichments(entries) {
    entries.forEach((entry) => {
      const extraAliases = ALIAS_ENRICHMENTS[entry.name];
      if (!extraAliases) return;
      entry.aliases = uniqueTerms([entry.aliases || [], extraAliases]);
      entry.tags = uniqueTerms([entry.tags || [], extraAliases]);
    });
    return entries;
  }

  const entries = applyAliasEnrichments([...TOOLS, ...RARE_SUPPLEMENT_TOOLS].map(makeEntry))
    .sort((a, b) => a.name.localeCompare(b.name));

  window.ANI_DIAGNOSTIC_DATABASE = {
    entries,
    sourceReferences: SOURCE_REFERENCES,
    sourceNote: SOURCE_NOTE
  };
})();
