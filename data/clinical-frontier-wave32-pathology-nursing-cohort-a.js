(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  function activePathologyEntries() {
    return typeof pathologyDiseases !== "undefined" && Array.isArray(pathologyDiseases)
      ? pathologyDiseases
      : database.diseases;
  }

  const VERSION = "2026-07-18-wave32-pathology-nursing-a-1";
  const sources = [
    { id: "w32a-apoptosis-ncbi", label: "NCBI Bookshelf, Apoptosis", url: "https://www.ncbi.nlm.nih.gov/books/NBK499821/", note: "Supports controlled-cell-death mechanisms, clinical consequences of excessive or insufficient apoptosis, and interpretation of treatment-related tissue injury." },
    { id: "w32a-clinpharm-fda", label: "FDA, Clinical Pharmacology Information in Prescription Drug Labeling", url: "https://www.fda.gov/files/drugs/published/The-Ins-and-Outs-of-Presenting-Clinical-Pharmacology-Information-in-Prescription-Drug-Labeling.pdf", note: "Supports clinically applied interpretation of half-life, distribution, pharmacodynamics, bioavailability, exposure, clearance, steady state, and dose-related toxicity." },
    { id: "w32a-diagnostic-accuracy-ncbi", label: "NCBI Bookshelf, Diagnostic Test Accuracy", url: "https://www.ncbi.nlm.nih.gov/books/NBK557491/", note: "Supports sensitivity, specificity, predictive values, likelihood ratios, pretest probability, post-test probability, and safe contextual interpretation of test results." },
    { id: "w32a-masld-niddk", label: "NIDDK, Metabolic Dysfunction-Associated Steatotic Liver Disease", url: "https://www.niddk.nih.gov/health-information/liver-disease/nafld-nash/definition-facts", note: "Supports distinctions among hepatic steatosis, steatohepatitis, fibrosis, and cirrhosis plus metabolic-risk assessment and longitudinal liver monitoring." },
    { id: "w32a-vascular-cognition-aha-2026", label: "AHA, 2026 Vascular Contributions to Cognitive Impairment and Brain Health", url: "https://professional.heart.org/en/science-news/vascular-contributions-to-cognitive-impairment-and-brain-health", note: "Supports vascular cognitive impairment assessment, prevention through vascular-risk control, functional safety, caregiver partnership, and recognition of superimposed stroke." },
    { id: "w32a-vitamin-b12-ods", label: "NIH Office of Dietary Supplements, Vitamin B12 Fact Sheet", url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/", note: "Supports neurologic and hematologic manifestations, risk factors, diagnostic interpretation, replacement considerations, and monitoring of vitamin B12 deficiency." },
    { id: "w32a-antisocial-nice", label: "NICE CG77, Antisocial Personality Disorder", url: "https://www.nice.org.uk/guidance/CG77", note: "Supports structured risk assessment, consistent therapeutic boundaries, treatment of comorbidity, crisis response, and coordinated management of antisocial personality disorder." },
    { id: "w32a-personality-medline", label: "MedlinePlus, Personality Disorders", url: "https://medlineplus.gov/personalitydisorders.html", note: "Supports assessment and psychotherapy-centered care for personality disorders, functional consequences, comorbidity, relationship difficulties, and individualized safety planning." },
    { id: "w32a-npd-ncbi", label: "NCBI Bookshelf, Narcissistic Personality Disorder", url: "https://www.ncbi.nlm.nih.gov/books/NBK556001/", note: "Supports disorder-specific evaluation, psychotherapy-centered management, differential diagnosis, comorbidity assessment, suicide-risk assessment, and coordinated team boundaries for narcissistic personality disorder." },
    { id: "w32a-avpd-ncbi", label: "NCBI Bookshelf, Avoidant Personality Disorder", url: "https://www.ncbi.nlm.nih.gov/books/NBK559325/", note: "Supports disorder-specific assessment of rejection sensitivity and functional avoidance, cognitive-behavioral and exposure-based psychotherapy, comorbidity care, and interprofessional follow-up." },
    { id: "w32a-bell-aao", label: "AAO-HNS, Bell's Palsy Clinical Practice Guideline", url: "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/bells-palsy/", note: "Supports prompt facial-weakness assessment, eye protection, time-sensitive therapy, follow-up, and immediate evaluation when findings suggest stroke or another diagnosis." },
    { id: "w32a-bone-tumors-nci", label: "NCI, Primary Bone Cancer Fact Sheet", url: "https://www.cancer.gov/types/bone/bone-fact-sheet", note: "Supports diagnostic evaluation and subtype-specific treatment of malignant bone tumors while preserving the distinction between benign, primary malignant, and metastatic lesions." },
    { id: "w32a-clubfoot-aaos", label: "AAOS OrthoInfo, Clubfoot", url: "https://orthoinfo.aaos.org/en/diseases--conditions/clubfoot/", note: "Supports early Ponseti casting, brace adherence, neurovascular and skin monitoring, recurrence recognition, and family teaching for congenital clubfoot." },
    { id: "w32a-cjd-cdc-2026", label: "CDC, 2026 Clinical Overview of Creutzfeldt-Jakob Disease", url: "https://www.cdc.gov/creutzfeldt-jakob/hcp/clinical-overview/index.html", note: "Supports recognition of rapidly progressive dementia and neurologic decline, diagnostic referral, supportive care, and prion-specific infection-control consultation." },
    { id: "w32a-cjd-infection-cdc-2026", label: "CDC, 2026 Infection Control for Creutzfeldt-Jakob Disease", url: "https://www.cdc.gov/creutzfeldt-jakob/hcp/infection-control/index.html", note: "Supports prion-specific handling, reprocessing, or disposal of instruments and materials exposed to high-risk tissue while routine bedside care continues with standard precautions." },
    { id: "w32a-herpes-cdc", label: "CDC, Genital Herpes STI Treatment Guideline", url: "https://www.cdc.gov/std/treatment-guidelines/herpes.htm", note: "Supports diagnosis, antiviral treatment, pregnancy considerations, transmission counseling, partner communication, and escalation for neurologic or disseminated herpes complications." },
    { id: "w32a-gonorrhea-cdc", label: "CDC, Gonococcal Infections Among Adolescents and Adults", url: "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", note: "Supports site-specific testing, recommended treatment, chlamydia coverage when indicated, partner care, retesting, and management of disseminated gonococcal infection." },
    { id: "w32a-pinworm-cdc", label: "CDC, Pinworm Infection", url: "https://www.cdc.gov/pinworm/about/index.html", note: "Supports tape-test diagnosis, two-dose treatment, simultaneous household management, hygiene measures, reinfection prevention, and recognition of secondary skin infection." },
    { id: "w32a-somatic-medline", label: "MedlinePlus, Somatic Symptom Disorder", url: "https://medlineplus.gov/ency/article/000955.htm", note: "Supports respectful symptom assessment, scheduled coordinated care, avoidance of unnecessary repeated testing, psychotherapy referral, and evaluation of new objective danger signs." },
    { id: "w32a-ards-ats-2024", label: "American Thoracic Society, 2024 ARDS Ventilation Guideline Update", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10870893/", note: "Supports lung-protective ventilation, appropriate PEEP, avoidance of prolonged recruitment maneuvers, and monitoring for ventilator-induced lung injury and hemodynamic compromise." },
    { id: "w32a-vq-ncbi", label: "NCBI Bookshelf, Pulmonary Ventilation and Perfusion", url: "https://www.ncbi.nlm.nih.gov/sites/books/NBK539907/", note: "Supports interpretation of low and high ventilation-perfusion states, hypoxemia mechanisms, clinical reassessment, and differentiation from shunt or hypoventilation." },
    { id: "w32a-glycogen-ncbi", label: "NCBI Bookshelf, Glycogenolysis", url: "https://www.ncbi.nlm.nih.gov/books/NBK549820/", note: "Supports hepatic and muscular glycogen breakdown, hormonal regulation, fasting and exercise physiology, and clinical consequences of impaired glucose mobilization." },
    { id: "w32a-antibiotic-pkpd-idsa", label: "IDSA, Outpatient Parenteral Antimicrobial Therapy Handbook", url: "https://www.idsociety.org/globalassets/idsa/clinical-affairs/opat_epub_finalv3.pdf", note: "Supports minimum inhibitory concentration, concentration- and time-dependent killing, post-antibiotic effect, antimicrobial exposure targets, toxicity monitoring, and stewardship." },
    { id: "w32a-pd-ispd", label: "International Society for Peritoneal Dialysis, Guideline Hub", url: "https://ispd.org/guidelines/", note: "Supports goal-directed peritoneal dialysis prescribing, exchange and dwell technique, transport and adequacy assessment, volume management, and peritonitis prevention." },
    { id: "w32a-conjunctivitis-nei", label: "National Eye Institute, Pink Eye", url: "https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/pink-eye", note: "Supports cause-specific conjunctivitis assessment, symptom care, hygiene, contact-lens precautions, and recognition of pain or visual findings requiring urgent eye evaluation." },
    { id: "w32a-conjunctivitis-cdc", label: "CDC, Clinical Overview of Conjunctivitis", url: "https://www.cdc.gov/conjunctivitis/hcp/clinical-overview/index.html", note: "Supports infectious and noninfectious differentiation, transmission prevention, treatment considerations, and referral for severe ocular symptoms or high-risk patients." },
    { id: "w32a-chemical-eye-aao", label: "American Academy of Ophthalmology EyeWiki, Chemical Injury of the Conjunctiva and Cornea", url: "https://eyewiki.aao.org/Chemical_%28alkali_and_acid%29_injury_of_the_conjunctiva_and_cornea", note: "Supports immediate copious irrigation beginning before a full examination because limiting chemical contact time is the most important early determinant of ocular injury." },
    { id: "w32a-endometrial-nci", label: "NCI, Endometrial Cancer Treatment PDQ", url: "https://www.cancer.gov/types/uterine/hp/endometrial-treatment-pdq", note: "Supports postmenopausal-bleeding evaluation, stage-directed surgery and adjuvant therapy, surveillance, and management of hemorrhagic, thrombotic, infectious, and treatment complications." },
    { id: "w32a-heart-failure-aha", label: "AHA/ACC/HFSA, 2022 Heart Failure Guideline", url: "https://newsroom.heart.org/news/acc-aha-hfsa-issue-heart-failure-guideline", note: "Supports phenotype-directed therapy, congestion and perfusion assessment, medication safety, self-management, and urgent response to acute decompensation or cardiogenic shock." },
    { id: "w32a-stones-niddk", label: "NIDDK, Treatment for Kidney Stones", url: "https://www.niddk.nih.gov/health-information/urologic-diseases/kidney-stones/treatment", note: "Supports analgesia, hydration and urine-straining instructions, stone-directed procedures, recurrence prevention, and urgent drainage when infection accompanies obstruction." },
    { id: "w32a-lice-cdc", label: "CDC, Head Lice", url: "https://www.cdc.gov/lice/about/head-lice.html", note: "Supports accurate live-louse diagnosis, appropriate pediculicide use, retreatment timing, contact management, limited environmental cleaning, and prevention of toxic overtreatment." },
    { id: "w32a-sepsis-sccm", label: "SCCM, Surviving Sepsis Campaign 2021", url: "https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-guidelines-2021", note: "Supports rapid recognition and treatment of suspected sepsis while clarifying that inflammatory vital-sign abnormalities are nonspecific and require clinical context." },
    { id: "w32a-renal-flow-ncbi", label: "NCBI Bookshelf, Renal Blood Flow and Filtration", url: "https://www.ncbi.nlm.nih.gov/books/NBK482248/", note: "Supports relationships among renal blood flow, GFR, filtration fraction, autoregulation, arteriolar tone, perfusion pressure, and medication-related kidney injury." },
    { id: "w32a-brain-tumor-nci", label: "NCI, Adult Central Nervous System Tumors Treatment PDQ", url: "https://www.cancer.gov/types/brain/hp/adult-brain-treatment-pdq", note: "Supports diagnosis and tumor-specific treatment while distinguishing primary, metastatic, benign, and malignant brain lesions and monitoring neurologic emergencies." },
    { id: "w32a-ddh-aaos", label: "AAOS OrthoInfo, Developmental Dysplasia of the Hip", url: "https://orthoinfo.aaos.org/en/diseases--conditions/developmental-dislocation-dysplasia-of-the-hip-ddh/", note: "Supports age-specific screening, Pavlik harness and surgical care, skin and neurovascular monitoring, and follow-up for recurrent dysplasia or avascular necrosis." },
    { id: "w32a-dmd-medline", label: "MedlinePlus Genetics, Duchenne and Becker Muscular Dystrophy", url: "https://medlineplus.gov/genetics/condition/duchenne-and-becker-muscular-dystrophy/", note: "Supports progressive motor, respiratory, cardiac, orthopedic, developmental, and genetic aspects of Duchenne muscular dystrophy and coordinated complication surveillance." },
    { id: "w32a-eds-medline", label: "MedlinePlus Genetics, Ehlers-Danlos Syndrome", url: "https://medlineplus.gov/genetics/condition/ehlers-danlos-syndrome/", note: "Supports subtype-aware assessment of joint, skin, vascular, gastrointestinal, and pregnancy risks without generalizing vascular-rupture risk to every EDS subtype." },
    { id: "w32a-eds-periop-pmc", label: "Orphanet Journal of Rare Diseases, Perioperative Management in Ehlers-Danlos Syndromes", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4223622/", note: "Supports subtype- and history-specific airway, cervical-instability, positioning, bleeding, skin, wound, vascular, and local-anesthetic planning while acknowledging limited heterogeneous evidence." },
    { id: "w32a-hypercalcemia-endocrine", label: "Endocrine Society, Hypercalcemia of Malignancy Guideline Resources", url: "https://www.endocrine.org/clinical-practice-guidelines/hypercalcemia", note: "Scope: supports antiresorptive, calcitonin, and cause-specific treatment of hypercalcemia of malignancy; it does not by itself cover every nonmalignant cause of hypercalcemia." },
    { id: "w32a-hypercalcemia-endotext", label: "Endotext, Approach to Hypercalcemia", url: "https://www.ncbi.nlm.nih.gov/books/NBK279129/", note: "Supports general adult cause assessment, corrected or ionized calcium interpretation, acute-treatment thresholds, hydration, cause-directed therapy, and neurologic, cardiac, gastrointestinal, and renal complication monitoring." },
    { id: "w32a-meniere-nidcd", label: "NIDCD, Meniere's Disease", url: "https://www.nidcd.nih.gov/health/menieres-disease", note: "Supports episodic vertigo, fluctuating hearing loss, tinnitus and pressure assessment, fall prevention, symptom treatment, and exclusion of neurologic emergencies." },
    { id: "w32a-osteoporosis-niams", label: "NIAMS, Osteoporosis Diagnosis and Treatment", url: "https://www.niams.nih.gov/health-topics/osteoporosis/diagnosis-treatment-and-steps-to-take", note: "Supports fracture-risk assessment, DXA testing, nutrition, exercise, fall prevention, medication adherence, and urgent recognition of hip or vertebral fracture." },
    { id: "w32a-polio-cdc", label: "CDC, Clinical Overview of Poliomyelitis", url: "https://www.cdc.gov/polio/hcp/clinical-overview/index.html", note: "Supports recognition and reporting of acute flaccid paralysis, respiratory and bulbar monitoring, infection precautions, vaccination review, and public-health coordination." },
    { id: "w32a-ra-niams", label: "NIAMS, Rheumatoid Arthritis Diagnosis and Treatment", url: "https://www.niams.nih.gov/health-topics/rheumatoid-arthritis/diagnosis-treatment-and-steps-to-take", note: "Supports early inflammatory-arthritis care, disease-modifying therapy, functional protection, infection and medication monitoring, and recognition of systemic complications." },
    { id: "w32a-retention-niddk", label: "NIDDK, Urinary Retention Diagnosis", url: "https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-retention/diagnosis", note: "Supports symptom, cause, medication, neurologic, kidney-function, urine, imaging, and postvoid-residual evaluation of acute and chronic urinary retention." },
    { id: "w32a-retention-treatment-niddk", label: "NIDDK, Treatment of Urinary Retention", url: "https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-retention/treatment", note: "Supports immediate catheter drainage for acute retention, continued catheter care when needed, cause-directed treatment, and prevention of bladder or kidney injury." },
    { id: "w32a-pod-ncbi", label: "NCBI Bookshelf, Postobstructive Diuresis", url: "https://www.ncbi.nlm.nih.gov/sites/books/NBK459387/", note: "Supports urine-output, vital-sign, weight, kidney-function, and electrolyte surveillance after major decompression because pathologic salt and water loss can cause volume collapse." },
    { id: "w32a-asd-vadod", label: "VA/DoD, 2023 Acute Stress Disorder and PTSD Guideline", url: "https://healthquality.va.gov/HEALTHQUALITY/guidelines/MH/ptsd/", note: "Supports trauma-informed assessment, psychological first aid, evidence-based psychotherapy, sleep and substance-use assessment, and immediate response to suicide or violence risk." },
    { id: "w32a-fragilex-medline", label: "MedlinePlus Genetics, Fragile X Syndrome", url: "https://medlineplus.gov/genetics/condition/fragile-x-syndrome/", note: "Supports developmental, behavioral, neurologic, connective-tissue, cardiac, reproductive, genetic-counseling, and family-centered aspects of Fragile X syndrome." },
    { id: "w32a-otitis-externa-aao", label: "AAO-HNS, Acute Otitis Externa Clinical Practice Guideline", url: "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/aoe/", note: "Supports topical therapy, pain control, ear-canal delivery, prevention counseling, and urgent evaluation for invasive infection or cranial-nerve involvement." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const cards = [
    card("Apoptosis", ["w32a-apoptosis-ncbi"], [
      "Assess the patient's diagnosis, current cytotoxic or radiation treatment, marrow reserve, mucosal condition, fertility concerns, and organ function because therapies that trigger apoptosis can injure rapidly renewing normal tissues as well as target cells.",
      "Monitor blood counts, oral and gastrointestinal mucosa, skin, infection signs, bleeding, hydration, and organ-specific function because excessive treatment-induced cell loss can cause marrow suppression, mucositis, tissue breakdown, and delayed recovery.",
      "Correlate new symptoms with treatment timing, laboratory trends, and the affected tissue rather than labeling apoptosis itself as a diagnosis because clinical decisions depend on the cause and consequence of altered cell death.",
      "Provide prescribed antiemetics, atraumatic oral care, nutrition support, infection precautions, and fertility referral because protecting normal tissue allows potentially beneficial cancer therapy to continue more safely.",
      "Escalate immediately for fever with neutropenia, uncontrolled bleeding, severe mucositis preventing intake, rapidly worsening organ dysfunction, or tumor-lysis findings because treatment-related cell death can produce life-threatening infection, hemorrhage, dehydration, or metabolic injury."
    ], [
      "Fever with severe neutropenia or rapidly progressive infection findings",
      "Uncontrolled bleeding with thrombocytopenia or hemodynamic instability",
      "Mucositis causing airway concern, dehydration, or inability to swallow",
      "Hyperkalemia, hypocalcemia, oliguria, or dysrhythmia after tumor treatment"
    ], [
      "Explain that cancer treatment aims to activate controlled death in abnormal cells, but some normal fast-growing cells are affected for the same biological reason.",
      "Teach the patient to report fever, bleeding, mouth injury, reduced urine, or severe weakness early because supportive treatment can prevent a temporary effect from becoming dangerous."
    ]),
    card("Elimination half-life", ["w32a-clinpharm-fda"], [
      "Verify the exact drug, formulation, last dose, dosing interval, treatment duration, kidney and liver function, and interacting medicines because elimination half-life is drug- and patient-specific rather than a universal fixed clock.",
      "Monitor timed drug concentrations when ordered, renal and hepatic trends, sedation, bleeding, rhythm, glucose, or other drug-specific toxicity because impaired clearance can lengthen half-life and cause accumulation across repeated doses.",
      "Administer doses at the prescribed times and document interruptions accurately because changing an interval alters peak, trough, steady-state exposure, and the clinician's ability to interpret a measured level.",
      "Coordinate pharmacist and prescriber review after acute kidney injury, liver failure, dialysis, major fluid change, or a new interaction because the previous dose may become unsafe before a routine level is due.",
      "Escalate immediately for respiratory depression, major bleeding, severe dysrhythmia, profound hypoglycemia, rapidly worsening confusion, or a critically toxic concentration because waiting one estimated half-life may permit preventable organ injury."
    ], [
      "Respiratory depression or inability to awaken after repeated medication doses",
      "Major bleeding, severe hypoglycemia, or unstable cardiac dysrhythmia",
      "Critical drug concentration with new kidney or liver dysfunction",
      "Acute confusion, seizure, hypotension, or rapidly progressive medication toxicity"
    ], [
      "Teach that stopping a long-half-life medicine does not remove its effects immediately because substantial drug may remain in the body for several days.",
      "Tell patients never to double a missed dose unless specifically instructed because accumulated doses can raise exposure long after the extra tablet is taken."
    ]),
    card("Likelihood ratio", ["w32a-diagnostic-accuracy-ncbi"], [
      "Identify the patient's pretest probability, clinical setting, exact test, and decision threshold before applying a likelihood ratio to a troponin, culture, imaging study, or other result because the same test result changes probability differently in low- and high-risk patients.",
      "Verify whether the reported value is a positive, negative, or interval likelihood ratio and confirm the assay cutoff because reversing the ratio or threshold can move the post-test estimate in the wrong direction.",
      "Translate the likelihood ratio into an estimated post-test probability and compare that probability with action thresholds because a mathematically meaningful change may still be insufficient to confirm or exclude disease.",
      "Monitor vital signs, airway, oxygenation, perfusion, neurologic status, pain, and syndrome-specific evidence such as ECG changes, lactate, troponin, cultures, or imaging while testing continues because calculating a likelihood ratio must never delay stabilization of an evolving emergency.",
      "Escalate immediately when clinical instability, a high-risk presentation, or discordant serial findings persist despite a reassuring test because no likelihood ratio can safely override a deteriorating patient's bedside evidence."
    ], [
      "Clinical deterioration despite a negative or weakly reassuring test result",
      "High pretest probability with a result below the exclusion threshold",
      "Positive result implying an immediately dangerous or reportable condition",
      "Conflicting test interpretation that would trigger harmful or irreversible treatment"
    ], [
      "Explain that a test result changes the chance of disease rather than proving certainty, so symptoms and examination findings still influence the next step.",
      "Encourage patients to ask what a positive or negative result changes because the usefulness of testing depends on the decision it is intended to support."
    ]),
    card("Specificity", ["w32a-diagnostic-accuracy-ncbi"], [
      "Confirm the test definition, positivity threshold, reference standard, and population before quoting specificity because performance measured in one setting may not transfer unchanged to another patient group.",
      "Interpret a positive result alongside pretest probability and cross-reacting conditions because even a highly specific test can produce misleading positives when the disease is very uncommon.",
      "Seek the recommended confirmatory test before initiating toxic, stigmatizing, invasive, or irreversible treatment because specificity alone does not establish that this individual patient truly has the condition.",
      "Monitor vital signs, oxygenation, pain, fever, the patient's actual syndrome, pending cultures or imaging, and adverse effects of empiric therapy because attention to a specific test label can otherwise obscure a worsening alternative diagnosis.",
      "Escalate immediately for clinical instability, a critical positive result, or a dangerous competing diagnosis despite an apparently specific finding because urgent patient risk takes priority over statistical classification."
    ], [
      "Unstable vital signs while confirmatory testing remains incomplete",
      "Critical positive result for a time-sensitive or reportable disease",
      "Strong alternative diagnosis with rapidly worsening objective findings",
      "Proposed irreversible treatment based on one discordant screening result"
    ], [
      "Teach that high specificity means relatively few false positives among people without disease, but it does not make every positive result automatically correct.",
      "Explain why confirmatory testing may still be necessary before major treatment because personal risk and disease prevalence affect what the result means."
    ]),
    card("Steatosis", ["w32a-masld-niddk"], [
      "Assess weight trajectory, waist circumference and central adiposity, diabetes, lipids, blood pressure, alcohol pattern, nutrition, pregnancy, and steatogenic medicines because hepatic fat has metabolic, alcohol-related, medication-related, and secondary causes requiring different management.",
      "Monitor aminotransferases, bilirubin, albumin, platelet count, glucose, lipids, fibrosis estimates, and ordered imaging because normal enzymes do not exclude progressive fibrosis and falling platelets may signal portal hypertension.",
      "Coordinate a sustainable nutrition and activity plan with gradual weight change when appropriate because rapid or extreme dieting can worsen malnutrition while modest sustained loss can reduce metabolic liver injury.",
      "Administer and reinforce prescribed treatment for diabetes, dyslipidemia, hypertension, or another identified cause because cardiovascular risk commonly exceeds liver risk and drives long-term morbidity in uncomplicated steatosis.",
      "Escalate urgently for jaundice, confusion, hematemesis, melena, rapidly increasing abdominal girth, severe right-upper-quadrant pain, or acute liver-test deterioration because these findings suggest decompensation or another acute hepatobiliary disorder."
    ], [
      "Jaundice with confusion, bleeding, or rapidly worsening liver tests",
      "Hematemesis, melena, hypotension, or other portal-bleeding findings",
      "Rapid abdominal distention with dyspnea, fever, or severe tenderness",
      "Severe right-upper-quadrant pain with vomiting or systemic toxicity"
    ], [
      "Explain that simple fat accumulation and inflammatory steatohepatitis are not interchangeable, so fibrosis assessment matters even when discomfort is absent.",
      "Teach patients to avoid unreviewed supplements and disclose alcohol honestly because both can add liver injury while obscuring the true cause of abnormal tests."
    ]),
    card("Vascular dementia", ["w32a-vascular-cognition-aha-2026"], [
      "Establish cognitive, gait, mood, continence, medication, and daily-function baselines with patient and caregiver input because vascular cognitive impairment may progress stepwise and can coexist with Alzheimer pathology or depression.",
      "Monitor for abrupt focal weakness, speech or vision change, acute confusion, falls, swallowing difficulty, blood-pressure extremes, and delirium triggers because new vascular events and reversible illness can rapidly worsen function.",
      "Use orientation cues, consistent routines, supervised mobility, swallowing precautions, and medication simplification because executive dysfunction and slowed processing increase injury, aspiration, and adherence risks before memory loss appears severe.",
      "Coordinate individualized control of hypertension, diabetes, lipids, smoking, atrial fibrillation, sleep apnea, and physical inactivity because preventing additional vascular injury preserves remaining cognition and reduces recurrent stroke risk.",
      "Activate emergency stroke evaluation for sudden facial droop, unilateral weakness, speech loss, visual deficit, severe imbalance, or an abrupt major cognitive change because established dementia does not explain a new focal neurologic deficit."
    ], [
      "Sudden facial droop, unilateral weakness, aphasia, or visual loss",
      "Abrupt severe imbalance, new dysphagia, or reduced consciousness",
      "Acute confusion with fever, hypoxia, hypoglycemia, or medication toxicity",
      "Repeated falls, unsafe wandering, aspiration, or caregiver inability to maintain safety"
    ], [
      "Explain that vascular dementia reflects accumulated brain-vessel injury, so controlling blood pressure and other vascular risks can still protect remaining function.",
      "Create a written plan for medicines, driving, finances, wandering, swallowing, and emergency stroke symptoms while the patient can participate meaningfully in decisions."
    ]),
    card("Vitamin B12 deficiency", ["w32a-vitamin-b12-ods"], [
      "Assess diet, bariatric or bowel surgery, autoimmune disease, metformin or acid-suppressor use, alcohol intake, glossitis, paresthesia, gait, cognition, and mood because deficiency may arise from low intake or impaired absorption and can injure nerves before anemia appears.",
      "Monitor blood count, mean corpuscular volume, reticulocyte response, vitamin B12, methylmalonic acid when ordered, potassium, gait, sensation, and cognition because hematologic recovery can precede slower or incomplete neurologic improvement.",
      "Administer oral or parenteral replacement by the prescribed cause-based regimen and verify follow-up dosing because irreversible malabsorption requires continuing therapy even after the blood count normalizes.",
      "Institute fall precautions and coordinate nutrition, gastroenterology, or hematology evaluation when indicated because sensory loss, weakness, pernicious anemia, and gastrointestinal disease require care beyond simply taking a vitamin.",
      "Escalate urgently for rapidly progressive weakness, inability to walk, severe confusion, syncope, chest pain, heart-failure findings, or profound symptomatic anemia because oxygen-delivery failure and advanced neurologic injury require prompt treatment."
    ], [
      "Rapidly progressive weakness, ataxia, or inability to walk safely",
      "Severe confusion, new psychosis, syncope, or reduced consciousness",
      "Chest pain, dyspnea at rest, tachycardia, or heart-failure findings",
      "Profound anemia with hypotension or evidence of active blood loss"
    ], [
      "Teach that folic acid can improve anemia while allowing B12-related nerve injury to progress, so patients should not self-treat an unexplained macrocytosis.",
      "Explain whether replacement is temporary or lifelong because dietary deficiency, medication exposure, pernicious anemia, and bowel surgery have different recurrence risks."
    ]),
    card("Volume of distribution", ["w32a-clinpharm-fda"], [
      "Record actual and dosing weight, edema, ascites, burns, pregnancy, albumin, age, and body composition before interpreting distribution because these factors change the apparent space available to water- and lipid-soluble drugs.",
      "Monitor correctly timed concentrations, clinical response, renal and hepatic function, fluid balance, albumin, and drug-specific toxicity because a changed volume of distribution can alter initial concentrations without changing elimination equally.",
      "Administer protocol-based loading doses using the specified weight and target concentration because loading dose depends strongly on distribution and should not be improvised from maintenance dosing.",
      "Reassess dosing with pharmacy after major resuscitation, diuresis, dialysis, extracorporeal support, amputation, or critical weight change because the patient's distribution state can shift substantially during one admission.",
      "Escalate immediately for respiratory depression, unstable rhythm, seizure, severe hypotension, uncontrolled infection despite therapy, or a critical drug level because either toxic overexposure or inadequate early exposure can be life-threatening."
    ], [
      "Critical serum concentration with neurologic, respiratory, or cardiac toxicity",
      "Septic deterioration despite apparently adequate antimicrobial dosing",
      "Large fluid shift with unexpected loss of medication effect",
      "Seizure, severe hypotension, dysrhythmia, or respiratory depression after loading"
    ], [
      "Explain that body weight alone does not show where a medicine distributes because edema, body fat, pregnancy, and protein levels affect different drugs differently.",
      "Teach patients not to repeat a loading dose after vomiting or uncertainty without instructions because an additional full dose may create dangerous exposure."
    ]),
    card("Antisocial personality disorder", ["w32a-antisocial-nice", "w32a-personality-medline"], [
      "Assess mental status, intoxication or withdrawal, impulsivity, access to weapons, recent violence, self-harm, exploitation, legal stress, housing, and coexisting illness because immediate risk often reflects a dynamic crisis rather than the personality diagnosis alone.",
      "Set concise behavioral expectations, choices, and consequences consistently across staff because predictable nonpunitive boundaries reduce splitting, escalation, and inadvertent reinforcement while preserving the patient's dignity.",
      "Monitor threats, agitation, substance effects, adherence, sleep, and changes in stated intent using objective language because behavior trends and concrete acts predict safety more reliably than labels such as manipulative.",
      "Coordinate evidence-based treatment for substance use, depression, anxiety, anger, or offending behavior and address practical needs because comorbid conditions and unstable circumstances often provide the most actionable treatment targets.",
      "Activate the safety response for a credible threat with intent and means, escalating violence, severe intoxication, suicidal plan, weapon possession, or inability to maintain unit safety because imminent harm requires immediate structured intervention."
    ], [
      "Credible violent threat with identified target, intent, means, or weapon",
      "Escalating aggression, severe intoxication, or dangerous withdrawal findings",
      "Suicidal plan, preparatory behavior, or access to lethal means",
      "Fire-setting, predatory behavior, or inability to follow essential safety limits"
    ], [
      "Explain rules, available choices, and consequences in plain language because transparent boundaries support autonomy better than bargaining or surprise restrictions.",
      "Encourage treatment for substance use, mood symptoms, and anger triggers because improving these problems can reduce crises even when personality patterns change slowly."
    ]),
    card("Bell palsy", ["w32a-bell-aao"], [
      "Determine exact onset and assess forehead movement, eye closure, smile, limb strength, speech, sensation, coordination, ear lesions, and headache because isolated peripheral facial weakness must be distinguished rapidly from stroke and other secondary causes.",
      "Monitor corneal redness, pain, dryness, visual change, eyelid closure, tearing, and facial recovery because incomplete blinking exposes the cornea and persistent or progressive weakness may indicate an alternative diagnosis.",
      "Administer prescribed corticosteroid promptly and antiviral therapy when specifically indicated while monitoring glucose, mood, infection, and medication tolerance because time-sensitive anti-inflammatory treatment improves recovery but has predictable adverse effects.",
      "Provide preservative-free lubrication, nighttime ointment, protective taping or moisture chamber, and ophthalmology coordination when closure is incomplete because maintaining a moist covered cornea prevents abrasion, ulceration, and vision loss.",
      "Activate emergency stroke evaluation for facial weakness with limb deficit, aphasia, gaze change, severe imbalance, sudden severe headache, or altered consciousness because these findings are not safely explained by Bell palsy."
    ], [
      "Facial weakness with arm weakness, aphasia, gaze deviation, or neglect",
      "Sudden severe headache, marked ataxia, diplopia, or altered consciousness",
      "Corneal pain, marked redness, photophobia, discharge, or declining vision",
      "Progressive, recurrent, bilateral, or nonresolving facial weakness with other neurologic findings"
    ], [
      "Teach eye lubrication and safe nighttime lid closure before discharge because corneal injury can occur while facial movement is still recovering.",
      "Explain that new limb weakness, speech difficulty, severe imbalance, or sudden headache requires emergency care rather than waiting for a routine facial-palsy follow-up."
    ]),
    card("Bone tumors", ["w32a-bone-tumors-nci"], [
      "Assess pain pattern, night pain, swelling, palpable mass, function, recent minor-trauma fracture, cancer history, weight loss, and neurologic symptoms because benign lesions, primary bone cancers, and skeletal metastases have different risks and treatment pathways.",
      "Monitor limb alignment, distal pulses, color, temperature, sensation, movement, pain escalation, blood counts, calcium, and ordered imaging because tumor growth or treatment can cause pathologic fracture, neurovascular compromise, marrow suppression, or hypercalcemia.",
      "Protect the affected bone from unplanned weight bearing or forceful manipulation and follow biopsy-team instructions because weakened cortex may fracture and poorly planned biopsy placement can compromise later limb-sparing surgery.",
      "Coordinate subtype- and stage-specific orthopedic oncology, medical oncology, radiation, rehabilitation, pain, and fertility care because osteosarcoma, Ewing sarcoma, chondrosarcoma, benign tumors, and metastases cannot share one generic treatment plan.",
      "Escalate immediately for sudden severe bone pain or deformity, loss of distal pulse or sensation, new spinal weakness or bladder dysfunction, fever with neutropenia, or symptomatic hypercalcemia because fracture, cord compression, infection, or metabolic crisis is time-critical."
    ], [
      "Sudden severe pain, deformity, or inability to bear weight",
      "Cool pulseless limb, new numbness, weakness, or escalating compartment pain",
      "New back pain with leg weakness, saddle anesthesia, or bladder dysfunction",
      "Neutropenic fever, acute confusion, severe dehydration, or cardiac dysrhythmia"
    ], [
      "Explain that 'bone tumor' does not automatically mean cancer because imaging and properly planned biopsy are needed to identify the exact lesion.",
      "Teach patients to avoid high-impact activity and report sudden pain immediately because tumor-weakened bone can fracture during otherwise minor movement."
    ]),
    card("Clubfoot", ["w32a-clubfoot-aaos"], [
      "Assess foot position, skin integrity, spontaneous movement, temperature, capillary refill, pulses when palpable, and toe color before and after each cast because correction must preserve perfusion, nerve function, and skin health.",
      "Monitor cast edges, swelling, odor, drainage, slipping, toe warmth and movement, infant consolability, feeding, and sleep because a tight, wet, or displaced cast can cause pressure injury or neurovascular compromise.",
      "Support scheduled Ponseti manipulation and serial casting while keeping the cast clean and dry because gradual correction of cavus, adductus, varus, and equinus reduces the need for extensive surgery.",
      "Fit and reinforce the prescribed foot-abduction brace schedule after correction and inspect skin at every removal because consistent bracing maintains alignment while poor fit can injure skin or promote relapse.",
      "Escalate immediately for blue or pale toes, coldness, absent movement, marked swelling, uncontrolled crying, foul drainage, fever, or a slipped or cracked cast because impaired circulation, nerve compression, infection, or lost correction requires urgent review."
    ], [
      "Blue, pale, cold, markedly swollen, or immobile toes",
      "Persistent inconsolable crying or pain unrelieved by comfort measures",
      "Foul odor, drainage, fever, or visible skin breakdown near cast edges",
      "Wet, cracked, loose, or slipped cast no longer holding correction"
    ], [
      "Teach caregivers to check toe color, warmth, movement, swelling, and cast position several times daily because infants cannot describe pressure or numbness.",
      "Explain that brace adherence after successful casting prevents recurrence, and missed wear should be discussed early rather than hidden from the orthopedic team."
    ]),
    card("Creutzfeldt-Jakob disease", ["w32a-cjd-cdc-2026", "w32a-cjd-infection-cdc-2026"], [
      "Assess the tempo of cognitive decline, gait, vision, coordination, myoclonus, behavior, sleep, swallowing, continence, and caregiver observations because CJD typically progresses much faster than common dementias and requires specialized diagnostic evaluation.",
      "Monitor swallowing safety, respiratory effort, aspiration signs, seizures or myoclonus, falls, hydration, nutrition, skin, pain, agitation, and autonomic changes because rapid neurologic loss creates preventable supportive-care complications even without curative therapy.",
      "Provide calm routines, assisted mobility, seizure precautions, texture-modified nutrition when ordered, skin protection, and comfort-focused symptom treatment because preserving dignity and preventing aspiration or injury remain central as function declines.",
      "Use standard precautions for routine care and consult infection prevention before neurosurgical, ophthalmic, or tissue-handling procedures because prions require instrument and tissue protocols beyond ordinary disinfection while casual contact does not spread CJD.",
      "Escalate immediately for choking with hypoxemia, repeated aspiration, status epilepticus, severe uncontrolled agitation, acute injury, dehydration with hypotension, or caregiver inability to provide safe care because these complications require urgent stabilization and support."
    ], [
      "Choking, aspiration, cyanosis, or rapidly increasing oxygen requirement",
      "Prolonged seizure, repeated myoclonus with injury, or reduced consciousness",
      "Severe dehydration, hypotension, pressure injury, or inability to take nutrition",
      "Unsafe agitation, repeated falls, acute trauma, or exhausted unsupported caregivers"
    ], [
      "Explain that ordinary touching, feeding, and living together do not spread classic CJD, so families can provide compassionate contact without isolation fear.",
      "Discuss goals, feeding choices, mobility support, and hospice early because the disease usually progresses rapidly and future communication capacity may be lost."
    ]),
    card("Genital herpes", ["w32a-herpes-cdc"], [
      "Assess lesion onset, pain, urinary difficulty, fever, neurologic symptoms, pregnancy or labor status, immune suppression, prior episodes, medications, and sexual exposure because primary, recurrent, disseminated, and pregnancy-associated herpes carry different risks.",
      "Collect lesion nucleic-acid testing and type-specific tests as ordered while documenting lesion stage and site because clinical appearance alone can be misleading and viral type informs recurrence and counseling.",
      "Administer prescribed antiviral therapy, analgesia, hydration, and gentle perineal care while monitoring renal function when relevant because early treatment shortens illness and prevents dehydration without eradicating latent infection.",
      "Monitor urine output, oral intake, headache, neck stiffness, mental status, lesion spread, fetal or labor status, and secondary infection because urinary retention, meningitis, dissemination, and neonatal exposure require prompt recognition.",
      "Escalate immediately for inability to void, severe headache with meningismus, confusion, diffuse vesicles with systemic illness, eye pain, pregnancy in labor with active lesions, or neonatal exposure because neurologic, disseminated, ocular, or newborn disease can be life-threatening."
    ], [
      "Urinary retention, severe dehydration, or pain preventing oral intake",
      "Severe headache, photophobia, neck stiffness, confusion, or seizure",
      "Diffuse vesicular eruption with fever, hepatitis findings, or immunosuppression",
      "Active genital lesions during labor or vesicular illness in a newborn"
    ], [
      "Teach that antivirals reduce symptoms and transmission risk but do not remove latent virus, so spread can occur even without visible lesions.",
      "Discuss condoms, avoiding sexual contact during prodrome or lesions, partner disclosure, and pregnancy planning because combined precautions reduce but do not eliminate transmission."
    ]),
    card("Gonorrhea", ["w32a-gonorrhea-cdc"], [
      "Obtain a nonjudgmental sexual history covering anatomic exposure sites, symptoms, pregnancy possibility, allergies, prior antibiotics, partner treatment, and assault concerns because throat, rectal, cervical, urethral, and disseminated infection require different sampling and support.",
      "Collect site-appropriate nucleic-acid tests and culture with susceptibility testing when treatment failure is suspected because resistance cannot be evaluated from a nucleic-acid result alone.",
      "Administer the current weight-appropriate recommended regimen and add chlamydia treatment when infection has not been excluded because correct initial therapy limits complications, transmission, and selection of resistance.",
      "Monitor fever, pelvic or testicular pain, joint swelling, rash, eye symptoms, pregnancy complications, and symptom resolution because ascending or disseminated gonococcal infection may damage reproductive organs, joints, or vision.",
      "Escalate immediately for severe pelvic pain with fever or peritoneal signs, acute scrotal pain, purulent eye infection, septic arthritis, hypotension, or pregnancy with systemic illness because torsion, pelvic inflammatory disease, ocular emergency, or dissemination requires urgent care."
    ], [
      "Severe pelvic pain, fever, guarding, vomiting, or pregnancy concern",
      "Sudden severe unilateral scrotal pain or high-riding testis",
      "Purulent eye discharge with pain, photophobia, or reduced vision",
      "Hot swollen joint, pustular rash, hypotension, or systemic toxicity"
    ], [
      "Teach abstinence for the recommended period after treatment and until partners are treated because symptom improvement alone does not prevent immediate reinfection.",
      "Explain the need for partner services, testing for other sexually transmitted infections, and scheduled retesting because repeat infection is common and often silent."
    ]),
    card("Pinworm infection", ["w32a-pinworm-cdc"], [
      "Assess nocturnal perianal itching, sleep disruption, scratching, vulvar irritation, household or institutional cases, previous treatment, and medication contraindications because pinworm spreads readily and recurrent symptoms often reflect reinfection.",
      "Guide collection of a morning perianal tape test before bathing, toileting, or dressing when confirmation is needed because eggs are deposited overnight and routine stool testing often misses them.",
      "Administer the prescribed first dose and ensure the scheduled second dose plus simultaneous household or caregiver treatment when advised because available medicines kill worms more reliably than eggs.",
      "Monitor perianal skin, sleep, adherence, recurrent itching, and bacterial infection signs because persistent scratching can damage skin while continued symptoms may indicate missed contacts or incorrect timing.",
      "Escalate for spreading redness, purulent drainage, fever, severe abdominal pain, persistent vulvovaginal symptoms, or repeated treatment failure because secondary infection or an alternative diagnosis needs clinical evaluation."
    ], [
      "Spreading perianal redness, swelling, purulent drainage, or fever",
      "Severe or localized abdominal pain with vomiting or guarding",
      "Persistent vulvar pain, discharge, urinary symptoms, or bleeding",
      "Recurrent infestation despite correctly timed household treatment and hygiene"
    ], [
      "Teach morning bathing, short clean nails, handwashing, and hot laundering without shaking bedding because these measures remove eggs before they return to the mouth.",
      "Explain why the second dose and simultaneous household treatment matter because untreated eggs and close contacts commonly restart the infection cycle."
    ]),
    card("Somatic symptom disorder", ["w32a-somatic-medline"], [
      "Listen respectfully and assess each presentation for new objective findings, medication effects, trauma, depression, anxiety, substance use, and self-harm because the diagnosis does not protect a patient from developing genuine acute disease.",
      "Establish regular planned visits with one coordinating clinician and agree on functional goals because predictable follow-up validates distress while reducing fragmented testing, conflicting explanations, and crisis-driven utilization.",
      "Monitor function, sleep, activity, mood, medication exposure, test results, emergency visits, and evolving red flags because improvement is better measured by daily capability and safety than by demanding complete symptom disappearance.",
      "Coordinate cognitive behavioral therapy or other indicated psychotherapy and treat defined psychiatric comorbidity because changing interpretations and coping patterns can reduce impairment without implying that symptoms are imaginary.",
      "Escalate immediately for unstable vital signs, focal neurologic deficit, gastrointestinal bleeding, acute abdomen, suicidal intent, psychosis, or a clearly new progressive objective abnormality because dangerous illness and psychiatric crisis require prompt independent evaluation."
    ], [
      "Unstable vital signs, syncope, severe hypoxia, or reduced consciousness",
      "New focal neurologic deficit, seizure, or rapidly progressive weakness",
      "Gastrointestinal bleeding, rigid abdomen, or persistent severe vomiting",
      "Suicidal intent, psychosis, severe self-neglect, or dangerous substance use"
    ], [
      "Explain that symptoms are real and deserve care, while repeated low-value tests can cause harm and may distract from treatments that improve daily function.",
      "Encourage keeping one symptom and function diary for scheduled visits because consistent information helps the team recognize both patterns and genuinely new changes."
    ]),
    card("Alveolar recruitment", ["w32a-ards-ats-2024"], [
      "Confirm the ventilated patient's diagnosis, oxygenation problem, recruitability assessment, current tidal volume, plateau pressure, PEEP, and hemodynamic reserve because recruitment maneuvers are not routine treatment for every cause of hypoxemia.",
      "Monitor oxygen saturation, arterial gases, driving and plateau pressures, compliance, blood pressure, heart rate, end-tidal carbon dioxide, and bilateral breath sounds because recruitment pressure can cause hypotension, overdistention, or pneumothorax.",
      "Perform only the brief protocol specifically ordered by the critical-care team and coordinate sedation or ventilator synchrony because uncontrolled coughing or spontaneous effort makes delivered pressure unpredictable and potentially injurious.",
      "Maintain lung-protective tidal volume, individualized PEEP, prone positioning when indicated, and treatment of the underlying cause because sustained protection and regional ventilation usually matter more than transient oxygen improvement.",
      "Stop the maneuver and escalate immediately for hypotension, new desaturation, bradycardia, rapidly rising airway pressure, unilateral absent breath sounds, or subcutaneous emphysema because prolonged recruitment is discouraged and these findings suggest hemodynamic collapse or barotrauma."
    ], [
      "Hypotension, bradycardia, or rapidly worsening perfusion during pressure increase",
      "New desaturation with unilateral absent breath sounds or tracheal shift",
      "Rapidly rising plateau pressure, severe ventilator dyssynchrony, or subcutaneous emphysema",
      "Cardiac arrest, refractory hypoxemia, or suspected tension pneumothorax"
    ], [
      "Explain to families that a recruitment maneuver briefly changes airway pressure to reopen selected lung units, but it is not a cure for the underlying injury.",
      "Clarify that modern ARDS care avoids prolonged recruitment maneuvers because excessive pressure can injure already open lung and reduce blood return to the heart."
    ]),
    card("Glycogenolysis", ["w32a-glycogen-ncbi"], [
      "Assess fasting duration, nutrition, exertion, diabetes treatment, alcohol use, liver disease, endocrine stress, and possible glycogen-storage disease because hepatic and muscular glycogen breakdown serve different glucose and energy needs.",
      "Monitor bedside glucose, neurologic status, adrenergic symptoms, ketones, lactate, electrolytes, liver findings, and response to carbohydrate because impaired glucose mobilization or excessive counterregulation can produce acute metabolic complications.",
      "Treat confirmed hypoglycemia with the protocol-appropriate oral or intravenous glucose and recheck at the specified interval because restoring consciousness does not prove that depleted glycogen or ongoing medication effect has resolved.",
      "Coordinate endocrinology, metabolic genetics, nutrition, and exercise planning for recurrent fasting intolerance or suspected storage disease because prevention depends on the specific enzyme, tissue, and trigger involved.",
      "Escalate immediately for seizure, reduced consciousness, persistent hypoglycemia after treatment, severe lactic acidosis, rhabdomyolysis, or hepatic failure findings because brain energy failure and systemic metabolic decompensation can progress rapidly."
    ], [
      "Seizure, coma, or focal neurologic change with low glucose",
      "Persistent or recurrent hypoglycemia despite protocol-based carbohydrate treatment",
      "Severe lactic acidosis, respiratory distress, or hemodynamic instability",
      "Dark urine, severe muscle pain, jaundice, bleeding, or acute liver failure findings"
    ], [
      "Explain that liver glycogen helps maintain blood glucose between meals, while muscle glycogen mainly fuels that muscle and cannot directly correct systemic hypoglycemia.",
      "Teach patients with recurrent hypoglycemia to follow their individualized meal, exercise, and emergency glucose plan because fasting tolerance varies by cause and treatment."
    ]),
    card("Minimum inhibitory concentration", ["w32a-antibiotic-pkpd-idsa"], [
      "Verify the organism, specimen source, collection timing, identification method, MIC units, and laboratory breakpoint system because an MIC has meaning only for a defined drug-organism-method combination.",
      "Interpret the MIC with infection site, achievable drug exposure, renal and hepatic function, protein binding, source control, and susceptibility category because the lowest number is not automatically the best clinical antibiotic.",
      "Collect indicated cultures before the first dose when this will not delay emergency therapy and administer antibiotics on schedule because reliable microbiology and exposure are both necessary to judge treatment response.",
      "Monitor temperature, hemodynamics, organ function, inflammatory trends, culture clearance, site-specific findings, and drug toxicity because an apparently susceptible isolate can still fail when exposure or source control is inadequate.",
      "Escalate immediately for septic shock, worsening organ dysfunction, persistent bacteremia, expanding infection, or clinical failure despite reported susceptibility because resistance, an undrained focus, or inadequate exposure may require urgent change."
    ], [
      "Hypotension, rising lactate, altered consciousness, or other septic-shock findings",
      "Persistent positive blood cultures or worsening organ dysfunction despite therapy",
      "Expanding cellulitis, necrosis, abscess, or uncontrolled infected device",
      "Critical antimicrobial toxicity or new resistant susceptibility result"
    ], [
      "Explain that MIC is a laboratory concentration, not the dose a patient should receive, because dosing must account for the infection site and individual drug handling.",
      "Teach patients to take antimicrobial doses at the prescribed intervals and report toxicity because exposure patterns influence success even when the organism tests susceptible."
    ]),
    card("Peritoneal dialysis: exchanges, dwell, transport, and adequacy", ["w32a-pd-ispd"], [
      "Verify the prescribed solution, fill volume, dwell time, number of exchanges, additives, last treatment, residual kidney function, and catheter history because clearance and ultrafiltration depend on the complete individualized prescription.",
      "Monitor daily weight, blood pressure, edema, breath sounds, intake and output, drain volume, effluent clarity, glucose, electrolytes, uremic symptoms, exit site, and ordered adequacy measures because underdialysis, fluid overload, infection, and metabolic effects may develop gradually.",
      "Perform each connection with meticulous hand hygiene, mask use, aseptic technique, correct warming, complete drainage, and accurate timing because touch contamination, shortened dwell, or flow obstruction reduces effectiveness and increases peritonitis risk.",
      "Coordinate transport testing and prescription adjustment when ultrafiltration, residual function, body size, nutrition, or clinical goals change because membrane transport characteristics determine which dwell lengths and solutions achieve useful clearance.",
      "Escalate immediately for cloudy effluent, abdominal pain, fever, hypotension, inability to drain, new bloody effluent, severe dyspnea, or rapidly increasing weight because peritonitis, catheter obstruction, bleeding, or dangerous volume overload requires urgent treatment."
    ], [
      "Cloudy effluent with abdominal pain, fever, or systemic illness",
      "Absent or sharply reduced drainage with pain or progressive distention",
      "New persistent bloody effluent, hypotension, or falling hemoglobin",
      "Severe dyspnea, hypoxemia, pulmonary crackles, or rapid weight gain"
    ], [
      "Teach patients to inspect every drained bag against good light because cloudy effluent may be the earliest visible sign of peritonitis.",
      "Explain that dwell timing and prescribed volumes should not be shortened for convenience because transport and total clearance depend on completing the full regimen."
    ]),
    card("Positive end-expiratory pressure", ["w32a-ards-ats-2024"], [
      "Confirm the cause of hypoxemia, current mode, predicted-body-weight tidal volume, plateau and driving pressures, recruitability, and hemodynamic status because PEEP can recruit unstable alveoli or overdistend already open lung.",
      "Monitor oxygenation, arterial gases, compliance, plateau pressure, driving pressure, blood pressure, heart rate, urine output, mental status, and bilateral breath sounds because excessive PEEP can reduce venous return and cause barotrauma.",
      "Titrate PEEP only through the ordered protocol while reassessing oxygen delivery and perfusion after every change because a higher saturation is not beneficial if cardiac output and tissue perfusion fall.",
      "Maintain lung-protective ventilation, head elevation, oral care, secretion management, prone positioning when indicated, and sedation reassessment because PEEP works within a broader strategy that limits ventilator injury and complications.",
      "Escalate immediately for sudden hypotension, new unilateral absent breath sounds, rapidly rising airway pressure, subcutaneous emphysema, refractory hypoxemia, or falling urine output because tension pneumothorax or hemodynamic compromise may follow pressure escalation."
    ], [
      "Sudden hypotension or bradycardia after a PEEP increase",
      "Unilateral absent breath sounds, tracheal shift, or subcutaneous emphysema",
      "Rapidly rising plateau pressure with worsening oxygenation or compliance",
      "Oliguria, cool mottled skin, altered consciousness, or rising or persistent lactate"
    ], [
      "Explain that PEEP holds alveoli open between breaths to improve gas exchange, but excessive pressure can compress vessels and injure lung tissue.",
      "Tell families that clinicians balance oxygenation with blood pressure and lung pressures because the highest PEEP setting is not automatically the safest one."
    ]),
    card("Steatohepatitis", ["w32a-masld-niddk"], [
      "Assess obesity and weight change, diabetes, lipids, blood pressure, alcohol, sleep apnea, diet, activity, medications, and alternative liver risks because steatohepatitis requires inflammatory injury rather than fat alone and may have overlapping causes.",
      "Monitor aminotransferases, bilirubin, albumin, INR, platelets, glucose, lipids, fibrosis estimates, imaging, weight, and decompensation findings because fibrosis can progress despite fluctuating enzymes and determines long-term liver risk.",
      "Coordinate gradual evidence-based weight management, nutrition, activity, diabetes care, and indicated specialist therapy because reducing metabolic stress can improve inflammation while extreme diets may worsen muscle loss or adherence.",
      "Review alcohol, supplements, and potentially hepatotoxic medicines and reinforce vaccinations and cardiovascular-risk treatment because additional liver injury and vascular disease can outweigh symptoms from steatohepatitis itself.",
      "Escalate immediately for jaundice with confusion, hematemesis or melena, tense ascites with fever, severe hypoglycemia, rapidly rising INR, or acute kidney injury because hepatic decompensation, bleeding, infection, or hepatorenal dysfunction is life-threatening."
    ], [
      "Confusion, asterixis, severe somnolence, or new behavioral change",
      "Hematemesis, melena, hypotension, or rapidly falling hemoglobin",
      "Tense ascites with fever, tenderness, dyspnea, or reduced urine output",
      "Rapidly rising bilirubin or INR with hypoglycemia or kidney injury"
    ], [
      "Explain that steatohepatitis includes cell injury and inflammation, so it carries more fibrosis risk than uncomplicated steatosis even when both feel painless.",
      "Teach patients to pursue gradual sustainable change and keep fibrosis follow-up because rapid weight cycling and symptom-based monitoring do not reliably protect the liver."
    ]),
    card("Volutrauma", ["w32a-ards-ats-2024"], [
      "Verify predicted body weight, delivered tidal volume, spontaneous breath size, plateau and driving pressures, respiratory rate, and lung heterogeneity because excessive regional stretch can occur even when the displayed set volume seems acceptable.",
      "Monitor compliance, pressure-volume trends, arterial gases, oxygenation, ventilator waveforms, breath sounds, chest imaging, and hemodynamics because worsening stiffness, air leak, or pneumothorax may indicate ventilator-induced lung injury.",
      "Maintain ordered low-tidal-volume ventilation and document total delivered volumes including patient-triggered breaths because preventing overdistention depends on actual lung exposure rather than the control-panel setting alone.",
      "Treat pain, fever, acidosis, secretions, and dyssynchrony with the critical-care plan and use prone positioning when indicated because strong respiratory drive can generate injurious transpulmonary pressure despite protective machine settings.",
      "Escalate immediately for sudden desaturation, unilateral absent breath sounds, rapidly rising plateau pressure, subcutaneous emphysema, severe dyssynchrony, or hypotension because pneumothorax, overdistention, or patient self-inflicted lung injury requires urgent correction."
    ], [
      "Sudden desaturation with unilateral absent breath sounds or tracheal deviation",
      "New subcutaneous emphysema, pneumomediastinum, or rapidly rising airway pressure",
      "Plateau pressure above the ordered safety limit with falling compliance",
      "Severe dyssynchrony, large spontaneous tidal volumes, or hemodynamic collapse"
    ], [
      "Explain that smaller ventilator breaths protect vulnerable lungs because normal-sized breaths for a healthy lung may overexpand the limited lung still open in ARDS.",
      "Clarify that sedation or prone positioning may reduce harmful breathing forces and is reassessed frequently rather than used simply to keep a patient still."
    ]),
    card("Conjunctivitis", ["w32a-conjunctivitis-nei", "w32a-conjunctivitis-cdc", "w32a-chemical-eye-aao"], [
      "Assess unilateral or bilateral redness, discharge type, itching, pain, photophobia, visual change, contact-lens use, chemical exposure, trauma, newborn age, and systemic illness because benign conjunctivitis can resemble corneal infection, uveitis, glaucoma, or chemical injury.",
      "Monitor visual acuity, pupils, corneal clarity, pain, eyelid swelling, fever, and treatment response, and escalate reduced vision, severe pain, marked photophobia, corneal opacity, copious purulence, proptosis, painful eye movement, or neonatal disease because these findings suggest a sight-threatening process beyond uncomplicated conjunctivitis.",
      "Administer cause-directed drops or ointment as prescribed and perform hand hygiene before and after eye care because antibiotics do not treat viral or allergic disease and contaminated hands spread infectious conjunctivitis.",
      "Remove contact lenses, discard contaminated cases or cosmetics, use separate clean compresses, and avoid sharing towels because lenses can worsen keratitis and secretions readily transmit viral or bacterial infection.",
      "After scene safety, immediately irrigate a chemical eye exposure with copious water or isotonic fluid while activating emergency ophthalmic care because delaying irrigation for a complete examination prolongs tissue contact and worsens visual injury."
    ], [
      "Reduced visual acuity, severe ocular pain, or marked photophobia",
      "Corneal opacity, contact-lens-associated pain, or foreign-body sensation",
      "Copious purulent discharge, rapidly progressive swelling, or neonatal redness",
      "Chemical exposure, proptosis, painful eye movement, fever, or restricted gaze"
    ], [
      "Teach patients not to share towels, cosmetics, drops, or pillowcases because infectious conjunctivitis spreads through contaminated hands and objects.",
      "Tell contact-lens users to stop wearing lenses until cleared and replace contaminated supplies because continuing lens use can turn surface inflammation into corneal infection."
    ]),
    card("Endometrial cancer", ["w32a-endometrial-nci"], [
      "Assess postmenopausal or abnormal bleeding, pelvic pressure, pain, anemia symptoms, obesity, diabetes, estrogen exposure, fertility goals, and family cancer history because early bleeding commonly permits diagnosis while hereditary risk changes counseling.",
      "Monitor bleeding amount, vital signs, hemoglobin, pelvic and urinary symptoms, nutrition, treatment counts, renal function, incision or vaginal cuff, and thromboembolism findings because cancer and treatment can cause hemorrhage, infection, obstruction, and clotting.",
      "Provide perioperative care, pain control, early mobilization, pulmonary hygiene, and prescribed thromboprophylaxis while monitoring wound and urinary function because hysterectomy-based treatment introduces surgical, respiratory, urinary, and venous-thrombotic risks.",
      "Coordinate stage- and histology-specific gynecologic oncology, radiation, systemic therapy, genetic evaluation, fertility support, and lymphedema care because endometrial cancers differ in recurrence risk and cannot share one adjuvant plan.",
      "Escalate immediately for saturating bleeding with dizziness, hypotension, fever with pelvic pain, sudden dyspnea or chest pain, unilateral leg swelling, anuria, or severe abdominal distention because hemorrhage, infection, embolism, or obstruction requires urgent treatment."
    ], [
      "Heavy vaginal bleeding with syncope, hypotension, or falling hemoglobin",
      "Fever with worsening pelvic pain, foul drainage, or wound separation",
      "Sudden dyspnea, pleuritic chest pain, hemoptysis, or unilateral leg swelling",
      "Anuria, severe flank pain, persistent vomiting, or progressive abdominal distention"
    ], [
      "Teach that any postmenopausal bleeding needs evaluation even when it occurs once because early endometrial cancer often causes little pain.",
      "Explain the individualized surveillance and symptom plan because stage, histology, molecular features, and treatment determine recurrence risk and follow-up needs."
    ]),
    card("Heart failure", ["w32a-heart-failure-aha"], [
      "Assess dyspnea, orthopnea, nocturnal symptoms, edema, fatigue, chest pain, palpitations, medication adherence, diet, infection, blood pressure, perfusion, and recent weight because congestion and low output can coexist and have multiple triggers.",
      "Monitor daily weight, intake and output, oxygenation, lung sounds, edema, jugular venous pressure, rhythm, blood pressure, mental status, creatinine, potassium, and sodium because therapy must relieve congestion without causing kidney injury, electrolyte disturbance, or shock.",
      "Administer prescribed diuretics and guideline-directed therapies while checking pressure, pulse, renal function, potassium, symptoms, and contraindications because complementary drug classes improve outcomes but can cause hypotension, bradycardia, or metabolic toxicity.",
      "Promote sodium and fluid guidance, mobility, vaccination, medication reconciliation, and a written weight and symptom action plan because early recognition of congestion and consistent therapy reduce preventable decompensation and readmission.",
      "Escalate immediately for severe dyspnea at rest, pink frothy sputum, new hypoxemia, chest pressure, syncope, confusion, cool mottled skin, oliguria, or hypotension because pulmonary edema, ischemia, dysrhythmia, or cardiogenic shock is time-critical."
    ], [
      "Severe resting dyspnea, pink frothy sputum, or rapidly falling oxygen saturation",
      "Chest pressure, syncope, sustained dysrhythmia, or new ischemic changes",
      "Hypotension, cool mottled skin, confusion, or sharply reduced urine output",
      "Rapid weight gain with worsening edema, orthopnea, or abdominal distention"
    ], [
      "Teach daily weights on the same scale and the clinician's exact call threshold because fluid can accumulate before swelling or breathlessness becomes obvious.",
      "Explain each heart-failure medicine by purpose and danger signs because feeling better does not mean disease-modifying treatment should be stopped."
    ]),
    card("Kidney stones", ["w32a-stones-niddk"], [
      "Assess pain onset and location, fever, chills, vomiting, urine output, hematuria, dysuria, pregnancy, solitary kidney, transplant, immune suppression, and prior stones because infection or threatened kidney function changes uncomplicated colic into an emergency.",
      "Monitor temperature, blood pressure, pain, hydration, intake and output, creatinine, electrolytes, urinalysis, culture, and imaging findings because obstruction can impair filtration and infected urine may progress rapidly to sepsis.",
      "Administer prescribed analgesia, antiemetic, fluids based on hydration status, and expulsive therapy when indicated while straining urine because symptom control and stone capture aid recovery without forcing harmful excess fluid.",
      "Coordinate timely imaging and urology follow-up for stone size, location, persistent obstruction, recurrent disease, and stone analysis because passage likelihood and preventive evaluation depend on objective stone characteristics.",
      "Escalate immediately for fever or rigors with obstruction, hypotension, confusion, anuria, solitary-kidney pain, rising creatinine, uncontrolled pain, or persistent vomiting because infected obstruction, acute kidney injury, and dehydration require urgent drainage or admission."
    ], [
      "Fever, rigors, hypotension, or confusion with flank pain",
      "Anuria, solitary-kidney obstruction, or rapidly rising creatinine",
      "Uncontrolled pain or vomiting despite prescribed emergency treatment",
      "Pregnancy with severe pain, bleeding, fever, or reduced urine output"
    ], [
      "Teach patients to seek emergency care for fever with stone symptoms because antibiotics alone may fail when infected urine is trapped behind an obstruction.",
      "Explain that recurrence prevention should follow stone analysis and metabolic evaluation because generic advice may miss the patient's specific urinary risk."
    ]),
    card("Narcissistic personality disorder", ["w32a-personality-medline", "w32a-npd-ncbi"], [
      "Assess mood, shame, anger, interpersonal conflict, substance use, impulsivity, self-harm, violence risk, occupational loss, and response to recent criticism because crises often follow threats to self-esteem rather than stable grandiosity alone.",
      "Use respectful neutral language, validate emotion without endorsing distortion, and maintain consistent limits because humiliation and power struggles can intensify rage, withdrawal, treatment dropout, or retaliatory behavior.",
      "Monitor mental status, function, treatment attendance, escalating entitlement conflicts, depression, sleep, substance use, and stated safety intent because longitudinal change can reveal a developing mood, intoxication, self-harm, or violence crisis more reliably than debating the patient's self-description.",
      "Coordinate psychotherapy and treatment of defined depression, anxiety, or substance-use disorders while aligning staff responses because personality traits improve gradually and inconsistent exceptions undermine the therapeutic frame.",
      "Escalate immediately for suicidal intent after humiliation or loss, a credible violent threat, weapon access, severe intoxication, psychosis, or inability to maintain safety because acute risk requires intervention independent of the personality formulation."
    ], [
      "Suicidal intent, preparatory behavior, or lethal-means access after major loss",
      "Credible violent threat with target, plan, means, or escalating aggression",
      "Severe intoxication, dangerous withdrawal, psychosis, or profound agitation",
      "Abrupt functional collapse, self-neglect, or inability to participate in safety planning"
    ], [
      "Explain that therapy focuses on relationships, emotional regulation, and functioning rather than forcing agreement about a stigmatizing personality label.",
      "Encourage the patient to identify criticism and shame triggers before conflict escalates because earlier recognition creates more choices than reacting during intense anger."
    ]),
    card("Pediculosis", ["w32a-lice-cdc"], [
      "Confirm active head-lice infestation by finding a live louse or viable-appearing nits near the scalp and assess prior products because dandruff and old empty nits are commonly misdiagnosed and overtreated.",
      "Monitor scalp excoriation, bacterial infection, sleep disruption, treatment adherence, live lice after the expected interval, and neurologic or respiratory toxicity because scratching and misuse of insecticides cause more harm than lice themselves.",
      "Apply the age-appropriate approved pediculicide exactly as directed and repeat only at the product-specific interval because dose, exposure time, retreatment timing, and resistance differ among treatments.",
      "Check close household contacts, avoid sharing hair items, launder recently used fabrics, soak combs, and avoid fumigant sprays because direct hair contact drives spread while excessive environmental pesticide use is unnecessary and toxic.",
      "Escalate for fever with spreading scalp redness, purulent sores, eye or eyelash involvement, breathing difficulty, seizure, severe vomiting, or repeated live lice after correct therapy because infection, toxic exposure, or resistant infestation needs professional care."
    ], [
      "Spreading scalp redness, purulent drainage, fever, or tender swelling",
      "Breathing difficulty, seizure, severe vomiting, or confusion after treatment",
      "Eye pain, eyelash infestation, chemical exposure, or visual change",
      "Persistent live lice after correctly performed and appropriately repeated therapy"
    ], [
      "Teach that head lice crawl and are unrelated to personal cleanliness, so children should not be shamed or exposed to dangerous home pesticides.",
      "Explain that students generally need not leave school early once lice are discovered and may return after appropriate treatment begins."
    ]),
    card("Systemic inflammatory response syndrome", ["w32a-sepsis-sccm"], [
      "Identify temperature, heart rate, respiratory rate, white-cell abnormalities, suspected trigger, baseline physiology, medicines, pregnancy, trauma, surgery, pancreatitis, and infection risk because SIRS is a nonspecific inflammatory pattern rather than a diagnosis or synonym for sepsis.",
      "Monitor mental status, blood pressure, perfusion, urine output, oxygenation, lactate when ordered, kidney and liver function, platelets, glucose, and trend direction because new organ dysfunction distinguishes dangerous progression better than counting isolated SIRS criteria.",
      "Obtain indicated cultures and diagnostic samples promptly and begin the ordered sepsis pathway when infection with organ dysfunction is suspected because treatment delay matters even when a patient does not meet every historical SIRS threshold.",
      "Treat the identified cause while supporting oxygenation, circulation, temperature, glucose, pain, and fluid balance because infection, pancreatitis, burns, trauma, and medication reactions require different source-directed interventions.",
      "Escalate immediately for hypotension, rising lactate, altered consciousness, mottling, oliguria, rapidly increasing oxygen need, or suspected infection with new organ dysfunction because these findings suggest sepsis, shock, or another critical inflammatory emergency."
    ], [
      "Hypotension, mottled skin, delayed capillary refill, or rising lactate",
      "New confusion, reduced consciousness, oliguria, or rapidly rising creatinine",
      "Increasing oxygen requirement, respiratory fatigue, or severe hypoxemia",
      "Suspected infection with thrombocytopenia, coagulopathy, or other organ dysfunction"
    ], [
      "Explain that SIRS describes a body-wide response that can occur with infection or sterile injury, so clinicians must still identify the actual cause.",
      "Teach that absence of classic fever or several SIRS criteria does not safely exclude sepsis when confusion, low pressure, or breathing difficulty develops."
    ]),
    card("Pharmacodynamics", ["w32a-clinpharm-fda"], [
      "Clarify the prescribed drug's target, intended clinical effect, expected onset, dose-response relationship, and relevant patient factors because pharmacodynamics describes what exposure does to this patient rather than how the body clears it.",
      "Monitor a defined benefit measure and drug-specific harm measure at appropriate intervals, such as pain with sedation or pressure with dizziness, because therapeutic response and toxicity may increase along the same dose-response curve.",
      "Administer the prescribed dose and document effect timing, partial response, tolerance, and adverse findings because a concentration or dose has limited meaning without the clinical response it produces.",
      "Coordinate reassessment for receptor tolerance, disease progression, age, genetics, electrolyte change, or interacting drugs when response shifts because pharmacodynamic sensitivity can change even when measured pharmacokinetics remain stable.",
      "Escalate immediately for anaphylaxis, respiratory depression, severe hypotension, dangerous dysrhythmia, major bleeding, profound hypoglycemia, or failure of a rescue medicine during deterioration because the observed effect requires urgent action regardless of expected dosing."
    ], [
      "Anaphylaxis with airway swelling, wheeze, hypotension, or widespread hives",
      "Respiratory depression, unresponsiveness, or rapidly worsening sedation",
      "Severe hypotension, dysrhythmia, major bleeding, or profound hypoglycemia",
      "Failure of a time-critical rescue medication during continued clinical decline"
    ], [
      "Explain that two patients can receive the same dose yet experience different effects because receptor sensitivity, illness, and interacting medicines differ.",
      "Teach patients to track the intended benefit and specific adverse effects because dosing decisions should reflect response rather than symptoms being discussed only as 'strong' or 'weak.'"
    ]),
    card("Renal blood flow, GFR, filtration fraction, and autoregulation", ["w32a-renal-flow-ncbi"], [
      "Assess blood pressure trend, volume status, cardiac output, sepsis, bleeding, obstruction, kidney history, and exposure to NSAIDs, ACE inhibitors, ARBs, contrast, or diuretics because perfusion pressure and arteriolar tone jointly determine filtration.",
      "Monitor urine output, creatinine trend, electrolytes, acid-base status, weight, edema, orthostasis, perfusion, and medication timing because falling renal blood flow can precede creatinine rise and progress to hyperkalemia or volume overload.",
      "Interpret estimated GFR and filtration fraction within the patient's hemodynamic and medication context because stable creatinine can lag acute injury and arteriolar changes can alter filtration differently from total renal plasma flow.",
      "Maintain ordered perfusion and fluid goals, avoid unreviewed nephrotoxins, adjust renally cleared medicines, and correct obstruction or shock promptly because autoregulation has limits and cannot preserve GFR during severe pressure or flow loss.",
      "Escalate immediately for persistent oliguria or anuria, severe hypotension, rapidly rising creatinine, refractory hyperkalemia, pulmonary edema, uremic neurologic change, or painful obstruction because acute kidney injury and its complications require urgent cause-directed treatment."
    ], [
      "Persistent oliguria, anuria, or rapidly increasing serum creatinine",
      "Severe hypotension, active hemorrhage, shock, or markedly impaired perfusion",
      "Refractory hyperkalemia, severe acidosis, or uremic neurologic change",
      "Pulmonary edema, severe hypertension, or obstructed solitary kidney"
    ], [
      "Explain that kidneys can stabilize filtration only within a limited pressure range, so prolonged dehydration, shock, or obstruction can overcome autoregulation.",
      "Teach patients to review NSAIDs and sick-day medication instructions with their clinician because combinations of low volume and altered arteriolar tone can sharply reduce filtration."
    ]),
    card("Ventilation-perfusion mismatch", ["w32a-vq-ncbi"], [
      "Assess onset of dyspnea, chest pain, cough, fever, wheeze, sputum, immobility, aspiration, edema, lung history, and asymmetric findings because low-V/Q and high-V/Q states arise from different airway, alveolar, and vascular problems.",
      "Monitor respiratory rate and effort, oxygen saturation, arterial gases when ordered, mental status, breath sounds, hemodynamics, response to oxygen, and end-tidal carbon dioxide because worsening mismatch can progress to tissue hypoxia or respiratory failure.",
      "Position the patient, provide prescribed oxygen, support secretion clearance, and use lung expansion or prone strategies when indicated because redistributing ventilation and perfusion can improve gas exchange while cause-specific treatment takes effect.",
      "Administer ordered bronchodilator, antimicrobial, diuretic, anticoagulant, or other cause-directed therapy while monitoring its complications because pneumonia, edema, bronchospasm, and pulmonary embolism cannot be treated as one generic mismatch.",
      "Escalate immediately for rapidly increasing oxygen need, severe work of breathing, cyanosis, hypotension, syncope, unilateral absent breath sounds, or sudden pleuritic pain with shock because respiratory failure, pneumothorax, or massive pulmonary embolism may be present."
    ], [
      "Rapidly rising oxygen requirement or severe respiratory muscle fatigue",
      "Cyanosis, confusion, reduced consciousness, or severe arterial hypoxemia",
      "Sudden pleuritic chest pain with syncope, hypotension, or tachycardia",
      "Unilateral absent breath sounds, tracheal deviation, or acute hemodynamic collapse"
    ], [
      "Explain that oxygen can support low blood oxygen while clinicians correct the underlying airflow, alveolar, or blood-flow problem causing the mismatch.",
      "Teach patients to seek emergency care for sudden breathlessness, fainting, blue color, or pleuritic chest pain because these patterns can signal pulmonary embolism or pneumothorax."
    ]),
    card("Brain tumor", ["w32a-brain-tumor-nci"], [
      "Establish neurologic baseline including consciousness, pupils, strength, speech, vision, gait, cognition, seizure history, headache pattern, vomiting, endocrine symptoms, and cancer history because location and pressure effects often matter more immediately than benign or malignant histology.",
      "Monitor neurologic checks, seizure activity, headache, vomiting, sodium, fluid balance, steroid glucose, swallowing, mobility, and postoperative wound or drainage because edema, hydrocephalus, endocrine disturbance, aspiration, and hemorrhage can evolve rapidly.",
      "Administer prescribed corticosteroid, antiseizure therapy, analgesia, and antiemetic while monitoring infection, glucose, mood, sedation, and drug levels when indicated because symptom control protects function but does not identify or cure the tumor subtype.",
      "Coordinate neurosurgery, neuro-oncology, radiation, pathology, rehabilitation, endocrine, palliative, and psychosocial care after tissue and staging evaluation because primary, metastatic, benign, and malignant brain tumors require distinct treatment goals.",
      "Escalate immediately for a first or prolonged seizure, declining consciousness, unequal pupils, new focal deficit, repeated projectile vomiting, sudden severe headache, bradycardia with hypertension, or clear postoperative drainage because hemorrhage, herniation, hydrocephalus, or cerebrospinal-fluid leak is time-critical."
    ], [
      "First seizure, status epilepticus, or repeated seizures without recovery",
      "Declining consciousness, unequal pupils, new weakness, or aphasia",
      "Sudden severe headache with repeated vomiting or rapidly worsening confusion",
      "Bradycardia with hypertension, irregular respirations, or clear wound drainage"
    ], [
      "Explain that the word brain tumor includes many distinct diseases, and behavior depends on location, growth rate, pathology, and whether disease began elsewhere.",
      "Provide a written seizure and steroid plan because missed doses or abrupt steroid withdrawal can cause preventable neurologic or adrenal emergencies."
    ]),
    card("Developmental dysplasia of the hip", ["w32a-ddh-aaos"], [
      "Review breech position, family history, swaddling, examination and imaging results, leg-length difference, limited abduction, and gait because instability ranges from subtle acetabular dysplasia to fixed dislocation and changes with age.",
      "Monitor skin, femoral pulses, toe color and movement, swelling, harness or cast fit, pain, and prescribed imaging because correction devices can cause pressure injury, nerve compromise, redislocation, or avascular necrosis.",
      "Maintain the Pavlik harness at the orthopedic team's settings and avoid unapproved strap adjustment or forced hip positioning because excessive flexion or abduction can injure nerves or femoral-head blood supply.",
      "Provide spica-cast hygiene, positioning, diaper protection, safe transport, and postoperative neurovascular checks when surgery is required because moisture, pressure, swelling, and cast damage can cause preventable complications.",
      "Escalate immediately for pale or cold toes, absent movement, marked swelling, uncontrolled pain, foul drainage, fever, pressure injury, or a damaged or slipping device because neurovascular compromise, infection, or lost reduction needs urgent review."
    ], [
      "Pale, blue, cold, markedly swollen, or immobile toes",
      "Persistent severe pain or inconsolability despite comfort measures",
      "Fever, foul odor, drainage, or skin breakdown beneath the device",
      "Broken, wet, slipping, or visibly displaced harness or cast"
    ], [
      "Teach hip-healthy swaddling with room for the knees to bend and hips to move because tightly straightened legs can worsen instability.",
      "Explain that normal appearance after treatment does not replace follow-up imaging because residual shallow acetabular development may be painless during infancy."
    ]),
    card("Duchenne muscular dystrophy", ["w32a-dmd-medline"], [
      "Assess motor milestones, falls, Gowers sign, contractures, pain, swallowing, cough strength, sleep breathing, learning, mood, family history, and corticosteroid use because Duchenne disease progressively affects skeletal, respiratory, cardiac, and cognitive function.",
      "Monitor mobility and upper-limb function, weight, bone health, pulmonary function, cough effectiveness, nocturnal symptoms, oxygen and carbon dioxide when indicated, electrocardiography, and echocardiography because respiratory and cardiomyopathic decline may remain clinically silent.",
      "Administer prescribed disease-modifying, corticosteroid, cardiac, respiratory, and bone-protective therapy while monitoring glucose, pressure, growth, infection, fracture, and behavior because treatment preserves function but introduces important long-term risks.",
      "Coordinate gentle submaximal activity, stretching, contracture prevention, mobility aids, assisted cough, vaccination, nutrition, school support, genetics, and transition planning because overexertion injures muscle while inactivity accelerates loss of function.",
      "Escalate immediately for weak cough with respiratory distress, morning headache with somnolence, chest pain, syncope, palpitations, choking, suspected fracture, or acute functional loss because ventilatory failure, cardiomyopathy, aspiration, and fragile-bone injury require urgent care."
    ], [
      "Weak cough, respiratory distress, rising carbon dioxide, or reduced consciousness",
      "Chest pain, syncope, sustained palpitations, or new heart-failure findings",
      "Choking, wet voice, recurrent aspiration, or inability to manage secretions",
      "Sudden pain or functional loss suggesting vertebral or long-bone fracture"
    ], [
      "Teach families that oxygen alone may hide hypoventilation, so sleepiness, morning headaches, and weak cough require respiratory assessment rather than unmonitored oxygen.",
      "Explain that regular gentle activity and stretching protect function, while exhaustive eccentric exercise can damage already vulnerable muscle fibers."
    ]),
    card("Ehlers-Danlos syndrome", ["w32a-eds-medline", "w32a-eds-periop-pmc"], [
      "Confirm the diagnosed or suspected subtype and assess joint instability, pain, skin fragility, bruising, wounds, orthostatic symptoms, bowel or bladder issues, family rupture history, and pregnancy because complications differ substantially across EDS types.",
      "Monitor neurovascular status after injury, wound healing, bleeding, hydration, orthostatic vitals, gastrointestinal symptoms, and new focal pain because dislocation, tissue injury, dysautonomia, or subtype-specific vascular events can be overlooked.",
      "Use joint-protective positioning, low-impact strengthening, appropriate braces, gentle skin care, and careful adhesive removal because excessive stretching and routine handling can provoke instability, bruising, or skin tears.",
      "Alert procedural, anesthesia, dental, obstetric, and surgical teams to the exact subtype, documented cervical or vascular complications, prior local-anesthetic effectiveness, and prior wound problems because patient-specific history should guide airway, positioning, analgesia, bleeding, and closure precautions.",
      "Escalate immediately for sudden severe chest, abdominal, flank, head, or neck pain, new neurologic deficit, limb ischemia, uncontrolled bleeding, or pregnancy collapse because arterial or organ rupture is especially time-critical in vascular EDS."
    ], [
      "Sudden severe chest, abdominal, flank, head, or neck pain",
      "New focal neurologic deficit, unequal pulses, or cold painful limb",
      "Uncontrolled bleeding, rapidly expanding hematoma, or hemodynamic instability",
      "Pregnancy or postpartum collapse with severe pain or heavy bleeding"
    ], [
      "Explain that vascular rupture risk is concentrated in specific subtypes, so patients should know and communicate their exact diagnosis rather than assume every EDS type behaves identically.",
      "Teach joint protection and controlled strengthening instead of extreme stretching because greater flexibility can increase instability rather than improve function."
    ]),
    card("Hypercalcemia", ["w32a-hypercalcemia-endocrine", "w32a-hypercalcemia-endotext"], [
      "Assess confusion, weakness, constipation, vomiting, thirst, polyuria, dehydration, bone pain, kidney stones, cancer, endocrine disease, immobilization, and calcium or vitamin supplements because severity and underlying mechanism determine urgency and treatment.",
      "Monitor corrected total serum calcium and, when indicated, ionized calcium, creatinine, phosphate, magnesium, potassium, fluid balance, urine output, mental status, and electrocardiogram because hypercalcemia can cause kidney injury, volume depletion, shortened QT, and dysrhythmia.",
      "Administer prescribed isotonic fluid, calcitonin, bisphosphonate, denosumab, glucocorticoid, or cause-specific therapy while monitoring overload and renal function because treatments differ in onset, duration, and suitability for the underlying cause.",
      "Institute fall precautions, mobilize safely when appropriate, manage constipation, and stop unreviewed calcium or vitamin D products after clinician review because weakness, confusion, immobilization, and continued intake can worsen complications.",
      "Escalate immediately for corrected total serum calcium above 12 mg/dL with acute symptoms, any confirmed corrected total serum calcium above 14 mg/dL, confusion, seizure, severe dehydration, oliguria, syncope, or dysrhythmia because urgent measures are generally required at these levels or with organ dysfunction."
    ], [
      "Confirmed corrected total serum calcium above 14 mg/dL, especially with confusion or weakness",
      "Syncope, chest pain, shortened QT, or significant cardiac dysrhythmia",
      "Profound dehydration, hypotension, oliguria, or rapidly rising creatinine",
      "Persistent vomiting, severe weakness, fall, or inability to maintain oral intake"
    ], [
      "Teach patients not to add calcium, vitamin D, antacids, or herbal products without review because seemingly routine supplements can worsen selected causes of hypercalcemia.",
      "Explain that hydration treats a dangerous consequence but not always the cause, so cancer, parathyroid, medication, and vitamin-related evaluations must be completed."
    ]),
    card("Meniere disease", ["w32a-meniere-nidcd"], [
      "Characterize vertigo duration, fluctuating hearing, tinnitus, ear pressure, triggers, falls, vomiting, headache, focal neurologic symptoms, medications, and prior episodes because Meniere attacks must be distinguished from stroke, migraine, BPPV, and sudden hearing loss.",
      "Monitor gait, fall risk, hydration, emesis, hearing trend, tinnitus burden, medication effects, and attack frequency because repeated vertigo causes injury and progressive auditory loss may occur between episodes.",
      "Provide a low-stimulation safe environment, assist mobility, administer prescribed vestibular suppressant or antiemetic during severe attacks, and monitor sedation because symptom treatment reduces vomiting and falls but may impair balance further.",
      "Reinforce the individualized sodium, caffeine, alcohol, tobacco, diuretic, vestibular rehabilitation, and hearing-support plan because long-term control targets attack frequency and function rather than curing one universal mechanism.",
      "Activate emergency neurologic evaluation for continuous new vertigo with inability to walk, facial or limb weakness, diplopia, dysarthria, severe headache, or reduced consciousness because posterior circulation stroke can mimic an inner-ear attack."
    ], [
      "New continuous vertigo with inability to stand or walk unaided",
      "Facial weakness, limb weakness, diplopia, dysarthria, or severe ataxia",
      "Sudden severe headache, reduced consciousness, or repeated uncontrolled vomiting",
      "Sudden major hearing loss, severe dehydration, or traumatic fall during an attack"
    ], [
      "Teach patients to sit or lie down at the first warning and avoid driving during attacks because sudden vertigo can cause serious injury.",
      "Explain that sudden neurologic symptoms or a new abrupt hearing loss need urgent assessment rather than being assumed to be another familiar Meniere episode."
    ]),
    card("Osteoporosis", ["w32a-osteoporosis-niams"], [
      "Assess prior fragility fractures, height loss, back pain, falls, gait, vision, nutrition, menopause or hypogonadism, glucocorticoids, alcohol, smoking, and secondary causes because fracture risk reflects bone strength plus fall exposure.",
      "Monitor height, posture, new focal pain, mobility, falls, DXA when scheduled, calcium and vitamin D status, renal function, medication adherence, and dental concerns because silent vertebral fracture and treatment complications can otherwise be missed.",
      "Administer prescribed antiresorptive or anabolic therapy using its exact route and timing precautions while monitoring renal, calcium, gastrointestinal, jaw, and thigh symptoms because each drug class has distinct benefits and rare serious harms.",
      "Coordinate weight-bearing and resistance exercise, balance training, adequate protein and minerals, home fall reduction, vision review, and safe movement instruction because preventing falls is as important as increasing bone density.",
      "Escalate immediately for hip or groin pain after a fall, sudden severe back pain, new weakness or bladder dysfunction, inability to bear weight, or persistent thigh pain because hip, vertebral, or atypical femoral fracture needs urgent evaluation."
    ], [
      "Hip or groin pain with inability to stand after a fall",
      "Sudden severe back pain with new weakness or bladder dysfunction",
      "Persistent focal thigh or groin pain before an obvious fracture",
      "Jaw pain with exposed bone, fever, drainage, or poor wound healing"
    ], [
      "Teach safe lifting, balance exercise, and home fall prevention because most osteoporotic fractures occur when fragile bone is combined with a fall.",
      "Explain the exact dosing and dental plan for the prescribed medicine because missed precautions can reduce absorption or increase avoidable adverse effects."
    ]),
    card("Poliomyelitis", ["w32a-polio-cdc"], [
      "Assess vaccination history, recent travel or exposure, fever or gastrointestinal prodrome, onset and pattern of weakness, sensation, reflexes, pain, swallowing, voice, and breathing because poliomyelitis classically causes acute asymmetric flaccid weakness without sensory loss.",
      "Monitor serial limb strength and reflexes, bulbar function, cough, secretion clearance, respiratory rate, vital capacity when ordered, oxygenation, carbon dioxide, autonomic stability, and urine retention because paralysis can ascend or involve respiratory muscles rapidly.",
      "Initiate facility infection-prevention precautions and preserve recommended stool and respiratory specimens with public-health guidance because rapid investigation is essential to identify transmission and routine cerebrospinal-fluid testing cannot exclude polio.",
      "Support airway clearance, ventilation when needed, pain relief, safe positioning, nutrition, skin protection, range of motion, and rehabilitation because supportive care prevents secondary respiratory, contracture, pressure, and thrombotic complications.",
      "Notify infection prevention and public health immediately and escalate acute care for unexplained flaccid weakness, bulbar dysfunction, weak cough, rising carbon dioxide, dysrhythmia, or reduced consciousness because suspected polio is reportable and respiratory failure can be abrupt."
    ], [
      "Acute asymmetric flaccid weakness with decreased or absent reflexes",
      "Weak cough, dysphagia, nasal voice, pooling secretions, or aspiration",
      "Declining vital capacity, rising carbon dioxide, or respiratory fatigue",
      "Autonomic instability, dysrhythmia, urinary retention, or reduced consciousness"
    ], [
      "Teach that suspected polio requires urgent public-health testing even in countries without endemic wild virus because imported or vaccine-derived transmission can occur.",
      "Explain that vaccination is the primary protection and that recovery care emphasizes breathing, mobility, and prevention of contractures rather than an antiviral cure."
    ]),
    card("Rheumatoid arthritis", ["w32a-ra-niams"], [
      "Assess joint pain, swelling, warmth, morning stiffness, function, fatigue, nodules, eye or lung symptoms, cardiovascular risk, infection exposure, pregnancy plans, and current immunosuppression because RA is systemic inflammatory disease rather than wear-and-tear arthritis.",
      "Monitor tender and swollen joints, function, blood counts, liver and kidney tests, inflammatory activity, infection, medication toxicity, and extra-articular symptoms because disease control and treatment safety require objective longitudinal assessment.",
      "Administer prescribed disease-modifying therapy and symptom treatment while verifying vaccination, tuberculosis or hepatitis screening, pregnancy safety, and laboratory schedule because early sustained suppression prevents irreversible joint damage but immunotherapy carries predictable risks.",
      "Coordinate occupational and physical therapy, joint protection, energy conservation, smoking cessation, exercise, bone health, and cardiovascular prevention because maintaining strength and reducing systemic risk improve outcomes beyond pain relief.",
      "Escalate immediately for a single hot joint with fever, severe infection during immunosuppression, acute dyspnea or chest pain, painful red eye with vision change, or neck pain with new weakness because septic arthritis and systemic complications require urgent care."
    ], [
      "Single acutely hot swollen joint with fever or systemic illness",
      "Fever, hypotension, respiratory symptoms, or rapidly spreading infection during immunosuppression",
      "Painful red eye with photophobia or declining vision",
      "Severe neck pain with weakness, numbness, gait change, or bladder dysfunction"
    ], [
      "Explain that disease-modifying medicines prevent structural damage even when pain is manageable, so they should not be stopped without the rheumatology plan.",
      "Teach patients on immunosuppression to report fever promptly and review vaccines before treatment because infection risk changes while live-vaccine safety may differ."
    ]),
    card("Urinary retention", ["w32a-retention-niddk", "w32a-retention-treatment-niddk", "w32a-pod-ncbi"], [
      "Assess last void, suprapubic pain, stream, hesitancy, dribbling, constipation, medications, anesthesia, prostate or pelvic disease, infection symptoms, and new neurologic deficits because mechanical, medication, postoperative, and neurogenic retention require different treatment.",
      "Measure bladder volume and postvoid residual as ordered and monitor urine output, creatinine, electrolytes, abdominal findings, overflow leakage, and infection because prolonged overdistention can injure bladder muscle and obstructive pressure can damage kidneys.",
      "Perform prompt catheter drainage using sterile technique when ordered and document initial volume, urine characteristics, pain response, and catheter patency because decompression relieves pressure while large retained volumes predict post-obstructive diuresis and recurrence.",
      "Monitor hourly output, pressure, hydration, sodium, potassium, and renal function after major decompression and address constipation or offending medicines with the team because excessive diuresis can cause dangerous volume and electrolyte loss.",
      "Escalate immediately for inability to void with severe pain, fever or hypotension, anuria, rapidly rising creatinine, gross hematuria with clots, or saddle anesthesia with leg weakness because infected obstruction, kidney injury, bleeding, or cauda equina syndrome is time-critical."
    ], [
      "Painful inability to void with a markedly distended bladder",
      "Fever, rigors, hypotension, or confusion with urinary obstruction",
      "Anuria, rapidly rising creatinine, or severe electrolyte abnormality",
      "Saddle anesthesia, leg weakness, bowel dysfunction, or acute severe back pain"
    ], [
      "Teach catheter securement, bag positioning, hygiene, and the blocked-catheter call plan because traction or backflow can cause injury and infection.",
      "Explain that painless overflow dribbling can still mean significant retention, so small frequent voids do not prove the bladder is emptying."
    ]),
    card("Acute stress disorder", ["w32a-asd-vadod"], [
      "Assess trauma timing, intrusive memories, avoidance, dissociation, mood, arousal, sleep, pain, injury, housing, support, substance use, suicidal thoughts, and ongoing danger because symptoms occur within the first month and immediate safety needs may dominate care.",
      "Provide calm trauma-informed contact, offer choices, explain procedures, support sleep and basic needs, and avoid forcing detailed recounting because predictability and control reduce further distress while compulsory debriefing may be unhelpful.",
      "Monitor function, dissociation, panic, nightmares, substance use, medication effects, self-care, safety intent, and symptom duration because worsening impairment or persistence beyond one month may require reassessment for PTSD or another condition.",
      "Coordinate evidence-based trauma-focused psychotherapy, social support, primary care, injury treatment, and targeted treatment of comorbidity because early structured care addresses both the traumatic response and practical barriers to recovery.",
      "Escalate immediately for suicidal intent, homicidal intent, psychosis, severe dissociation with unsafe wandering, inability to care for basic needs, dangerous intoxication or withdrawal, or continuing abuse because immediate protection takes priority over diagnostic timing."
    ], [
      "Suicidal or homicidal intent, plan, preparatory behavior, or weapon access",
      "Psychosis, severe dissociation, unsafe wandering, or reduced reality testing",
      "Dangerous intoxication, severe withdrawal, or escalating impulsive behavior",
      "Ongoing interpersonal danger or inability to maintain food, shelter, and basic safety"
    ], [
      "Explain that intense reactions during the first weeks after trauma are understandable and treatable, but worsening safety or function deserves prompt professional help.",
      "Create a written plan for sleep, grounding, trusted contacts, crisis services, and ongoing danger because memory and decision-making can narrow during severe arousal."
    ]),
    card("Avoidant personality disorder", ["w32a-personality-medline", "w32a-avpd-ncbi"], [
      "Assess social inhibition, rejection sensitivity, loneliness, work and relationship function, bullying or trauma, depression, anxiety, substance use, self-neglect, and self-harm because severe avoidance can conceal major impairment and comorbidity.",
      "Build a predictable nonshaming relationship and collaboratively choose small graded social or functional goals because abrupt confrontation or forced exposure can reinforce expectations of humiliation and treatment withdrawal.",
      "Monitor mental status, attendance, completed goals, anxiety before and after exposures, daily function, isolation, sleep, substance use, and safety thoughts because worsening depression, self-neglect, or suicidality may remain hidden when avoidance keeps the patient away from care.",
      "Coordinate psychotherapy and treatment of defined social anxiety, depression, or substance-use illness while supporting vocational and relationship skills because medication may help comorbidity but does not directly replace personality-focused therapy.",
      "Escalate immediately for suicidal intent, severe self-neglect, inability to leave an unsafe environment, psychosis, dangerous substance use, or abrupt isolation after major rejection because acute risk must be addressed before gradual exposure work."
    ], [
      "Suicidal intent, preparatory behavior, or access to lethal means",
      "Severe self-neglect with dehydration, malnutrition, or unsafe living conditions",
      "Psychosis, dangerous intoxication, withdrawal, or inability to reality-test",
      "Abrupt total isolation after rejection, bereavement, job loss, or humiliation"
    ], [
      "Explain that treatment uses manageable repeated steps rather than forced social performance because confidence grows through tolerable experiences that disconfirm expected rejection.",
      "Encourage tracking what was attempted and learned, not only anxiety intensity, because meaningful progress can occur while discomfort is still present."
    ]),
    card("Bioavailability", ["w32a-clinpharm-fda"], [
      "Verify drug formulation, route, dose, food timing, crushing or tube administration, vomiting, bowel disease or surgery, and interacting products because the fraction reaching systemic circulation depends on absorption and first-pass loss.",
      "Monitor defined clinical response, drug-specific toxicity, correctly timed levels when ordered, nutrition, gastrointestinal function, and liver status because altered bioavailability can cause treatment failure or toxicity without a change in prescribed dose.",
      "Administer the exact formulation under labeled food and timing conditions and confirm whether tablets may be split or crushed because extended-release, enteric-coated, sublingual, and transdermal products are not interchangeable.",
      "Coordinate pharmacy review before switching brand, formulation, route, feeding-tube method, or oral-to-intravenous dosing because equal milligram amounts may produce very different systemic exposure.",
      "Escalate immediately for rejection, seizure, unstable dysrhythmia, severe infection, major bleeding, respiratory depression, or a critical concentration after an administration change because altered exposure to a high-risk drug can become life-threatening."
    ], [
      "Breakthrough seizure, transplant rejection findings, or unstable cardiac rhythm",
      "Septic deterioration or treatment failure after an administration-route change",
      "Major bleeding, respiratory depression, or severe drug-specific toxicity",
      "Critical concentration after crushing, tube delivery, or formulation substitution"
    ], [
      "Teach patients to ask before crushing or substituting a medicine because formulation design can determine how much active drug reaches the bloodstream.",
      "Explain food instructions precisely because some meals increase absorption while others reduce it, and consistency may matter more than taking every drug fasting."
    ]),
    card("Fragile X syndrome", ["w32a-fragilex-medline"], [
      "Assess developmental, language, learning, sensory, attention, anxiety, autism-related, sleep, seizure, feeding, mobility, hearing, vision, and family concerns because Fragile X expression varies widely and changes across the lifespan.",
      "Monitor growth, nutrition, development, school function, behavior triggers, sleep, seizures, medication effects, hearing, vision, joint laxity, and cardiac findings when indicated because treatable complications can magnify communication and functional difficulties.",
      "Use predictable routines, visual supports, sensory accommodations, simple concrete language, extra processing time, and positive behavior support because reducing overload improves participation more effectively than interpreting distress as deliberate noncompliance.",
      "Coordinate developmental pediatrics, neurology, therapy, education, behavioral health, genetics, reproductive counseling, and transition services because the child and family need integrated support rather than one symptom-centered treatment.",
      "Escalate immediately for a prolonged seizure, choking or aspiration, sudden developmental or functional regression, severe self-injury, dangerous aggression, or caregiver inability to maintain safety because acute neurologic or environmental risk requires prompt evaluation."
    ], [
      "Seizure lasting five minutes or repeated seizures without recovery",
      "Choking, aspiration, cyanosis, or inability to manage secretions",
      "Sudden developmental regression, new weakness, or major loss of function",
      "Severe self-injury, dangerous aggression, elopement, or unsafe caregiver exhaustion"
    ], [
      "Explain that Fragile X affects individuals differently, so supports should follow the person's strengths, communication, sensory needs, and daily function rather than a fixed stereotype.",
      "Offer genetic counseling to the wider family because an FMR1 expansion can affect reproductive decisions and may cause different health conditions in relatives."
    ]),
    card("Post-antibiotic effect", ["w32a-antibiotic-pkpd-idsa"], [
      "Verify the antimicrobial, organism, infection site, susceptibility, renal and hepatic function, dose timing, and treatment goal because the post-antibiotic effect varies by drug-pathogen pair and cannot justify arbitrary interval extension.",
      "Administer doses on the ordered pharmacokinetic and pharmacodynamic schedule and document exact start and stop times because treatment success depends on the designed exposure pattern, not whether symptoms temporarily remain quiet between doses.",
      "Monitor temperature, hemodynamics, organ function, culture clearance, site-specific response, serum levels when ordered, hearing, balance, renal function, glucose, tendons, or other drug toxicity because prolonged bacterial suppression can coexist with accumulating patient harm.",
      "Coordinate antimicrobial-stewardship review for culture results, source control, dose optimization, route change, and de-escalation because post-antibiotic effect is one component of therapy and does not replace susceptibility or clinical response.",
      "Escalate immediately for septic shock, persistent bacteremia, expanding infection, new organ dysfunction, severe kidney injury, ototoxic symptoms, or another serious antimicrobial reaction because clinical failure or toxicity requires urgent reassessment regardless of expected suppression."
    ], [
      "Hypotension, rising lactate, altered consciousness, or other septic-shock findings",
      "Persistent bacteremia, expanding infection, or worsening organ dysfunction",
      "Rapid creatinine rise, oliguria, tinnitus, vertigo, or new hearing loss",
      "Anaphylaxis, severe skin reaction, dysrhythmia, or profound glucose disturbance"
    ], [
      "Explain that post-antibiotic effect is continued bacterial suppression after concentrations fall, but it does not mean doses may be skipped or stopped early.",
      "Teach patients to report hearing change, reduced urine, severe rash, tendon pain, or recurrent fever because toxicity and treatment failure require prompt review."
    ]),
    card("Otitis externa", ["w32a-otitis-externa-aao"], [
      "Assess tragal or pinna tenderness, canal swelling and discharge, pain severity, hearing change, water or device exposure, trauma, diabetes, immune suppression, fever, and cranial-nerve symptoms because invasive disease can begin like uncomplicated swimmer's ear.",
      "Monitor pain trajectory, temperature, canal edema, drainage, surrounding erythema, medication delivery, hearing, glucose when relevant, and facial movement because nonresponse or extension may indicate obstruction, resistant infection, or malignant external otitis.",
      "Administer prescribed topical drops with correct positioning and wick support when ordered while checking tympanic-membrane status and allergy because effective local delivery treats most uncomplicated disease and avoids unnecessary systemic antibiotics.",
      "Keep the ear dry, avoid cotton swabs and scratching, protect hearing devices as directed, and provide adequate analgesia because moisture and repeated canal trauma disrupt the skin barrier and prolong inflammation.",
      "Escalate immediately for severe pain out of proportion, granulation tissue, fever, spreading facial redness, cranial-nerve weakness, vertigo, systemic illness, or failure to improve within the expected interval because invasive skull-base infection or another diagnosis requires urgent specialist care."
    ], [
      "Severe deep pain out of proportion, especially with diabetes or immunosuppression",
      "Facial weakness, dysphagia, hoarseness, vertigo, or other cranial-nerve findings",
      "Fever, spreading cellulitis, systemic toxicity, or granulation tissue",
      "Worsening symptoms or blocked medication delivery despite appropriate topical therapy"
    ], [
      "Teach drop administration by warming the bottle in the hand, positioning the affected ear upward, and remaining still long enough for canal penetration.",
      "Explain that cotton swabs remove protective wax and injure canal skin, so drying and prevention should avoid inserting objects into the ear."
    ])
  ];

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function primaryCanonicalTitle(entry) {
    return String((entry && (entry.name || entry.title || entry.displayName)) || "").trim();
  }

  const appliedNames = [];
  const unresolved = [];
  const targetEntries = activePathologyEntries();
  cards.forEach((patch) => {
    const target = normalize(patch.name);
    const matches = targetEntries.filter((entry) => normalize(primaryCanonicalTitle(entry)) === target);
    if (matches.length !== 1) {
      unresolved.push({ name: patch.name, matchCount: matches.length });
      return;
    }
    Object.assign(matches[0], {
      nursingPriorities: patch.nursingPriorities.slice(),
      redFlags: patch.redFlags.slice(),
      patientEducation: patch.patientEducation.slice()
    });
    appliedNames.push(patch.name);
  });

  const names = cards.map((entry) => entry.name);
  window.ANI_PATHOLOGY_NURSING_WAVE32_A = {
    schemaVersion: 1,
    version: VERSION,
    cohort: "A",
    names: names.slice(),
    highRiskNames: names.slice(),
    cards: cards.map((entry) => ({ name: entry.name, sourceIds: entry.sourceIds.slice() })),
    sources: sources.map((source) => ({ ...source })),
    application: {
      attempted: names.length,
      appliedNames: appliedNames.slice(),
      unresolved: unresolved.map((entry) => ({ ...entry }))
    }
  };
})();
