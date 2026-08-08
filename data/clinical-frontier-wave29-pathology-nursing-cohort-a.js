(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  const VERSION = "2026-07-18-wave29-pathology-nursing-a-1";
  const sources = [
    { id: "acc-ccd-2023", label: "ACC/AHA, 2023 Chronic Coronary Disease Guideline", url: "https://www.acc.org/Guidelines/Guidelines/2023/07/20/12/34/Chronic-Coronary-Disease", note: "Supports recognition and treatment of vasospastic angina, symptom-pattern assessment, antianginal therapy, risk-factor care, and urgent evaluation when ischemic symptoms become unstable." },
    { id: "aha-hbp-2025", label: "AHA/ACC, 2025 High Blood Pressure Guideline", url: "https://professional.heart.org/en/science-news/2025-high-blood-pressure-guideline/top-things-to-know", note: "Supports repeat accurate blood-pressure measurement, assessment for acute target-organ injury, avoidance of aggressive short-term lowering when injury is absent, and reliable outpatient follow-up." },
    { id: "acc-valve-2020", label: "ACC/AHA, 2020 Valvular Heart Disease Guideline", url: "https://www.acc.org/Guidelines/Guidelines/2020/12/17/14/24/Valvular-Heart-Disease", note: "Supports echocardiographic surveillance, symptom and ventricular-function assessment, anticoagulation safety for prosthetic valves, and timely valve-team referral for severe regurgitation or prosthetic complications." },
    { id: "aha-oh-2024", label: "American Heart Association, Orthostatic Hypotension in Adults With Hypertension", url: "https://professional.heart.org/en/science-news/orthostatic-hypotension-in-adults-with-hypertension", note: "Supports standardized supine-to-standing assessment, identification of medications and autonomic or volume contributors, individualized blood-pressure care, fall prevention, and symptom-guided escalation." },
    { id: "acc-pad-2024", label: "ACC/AHA Multisociety, 2024 Lower-Extremity Peripheral Artery Disease Guideline", url: "https://www.acc.org/Guidelines/Hubs/Lower-Extremity-Peripheral-Artery-Disease", note: "Supports pulse and limb assessment, foot care, exercise and risk-factor therapy, antithrombotic safety, and urgent recognition of acute or chronic limb-threatening ischemia." },
    { id: "aha-endocarditis", label: "American Heart Association, Infective Endocarditis in Adults Scientific Statement", url: "https://professional.heart.org/en/science-news/infective-endocarditis-in-adults-diagnosis-antimicrobial-therapy-and-management-of-complications", note: "Supports blood cultures, echocardiography, antimicrobial care, embolic and valve-complication surveillance, and multidisciplinary management of prosthetic-valve infection." },
    { id: "esc-cardiomyopathy-2023", label: "European Society of Cardiology, 2023 Cardiomyopathy Guideline", url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/cardiomyopathy/", note: "Supports phenotype-based restrictive-cardiomyopathy evaluation, congestion and rhythm surveillance, genetic and family assessment, and specialist management of progressive heart failure." },
    { id: "aha-rhf-2018", label: "American Heart Association, Evaluation and Management of Right-Sided Heart Failure", url: "https://professional.heart.org/en/science-news/evaluation-and-management-of-right-sided-heart-failure/top-things-to-know", note: "Supports careful volume management, right-ventricular and end-organ assessment, treatment of the underlying cause, and early advanced support before multiorgan dysfunction develops." },
    { id: "acc-bradycardia-2018", label: "ACC/AHA/HRS, 2018 Bradycardia and Conduction Delay Guideline", url: "https://professional.heart.org/en/science-news/2018-guideline-for-the-evaluation-and-management-of-bradycardia-and-cardiac-conduction-delay/top-things-to-know", note: "Supports symptom-rhythm correlation, reversible-cause assessment, telemetry and pacing decisions for sinus bradycardia and atrioventricular block." },
    { id: "esc-takotsubo-2018", label: "ESC, International Expert Consensus on Takotsubo Syndrome", url: "https://esc365.escardio.org/journal/7395", note: "Supports acute coronary-syndrome exclusion, imaging-based diagnosis, rhythm and heart-failure monitoring, recognition of outflow obstruction and thrombus, and follow-up for ventricular recovery." },
    { id: "svs-venous-ulcer", label: "Society for Vascular Surgery, Venous Leg Ulcer Clinical Practice Guideline", url: "https://vascular.org/research-quality/guidelines-and-reporting-standards/clinical-practice-guidelines", note: "Supports arterial assessment before compression, venous duplex evaluation, compression and wound care, infection and perfusion surveillance, and prevention of ulcer recurrence." },
    { id: "aarc-airway-clearance", label: "AARC, Nonpharmacologic Airway Clearance Guideline", url: "https://journals.sagepub.com/doi/10.4187/respcare.02925", note: "Supports individualized airway-clearance assessment, effective cough instruction, early mobility, and avoidance of indiscriminate routine therapies in uncomplicated postoperative atelectasis." },
    { id: "aha-drowning-2025", label: "AHA, 2025 Special Circumstances of Resuscitation", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation", note: "Supports rapid reversal of drowning-related hypoxemia, ventilation-inclusive resuscitation, temperature and trauma assessment, and continued observation for respiratory or neurologic deterioration." },
    { id: "aba-inhalation", label: "American Burn Association, Burn Patient Referral Guidelines", url: "https://ameriburn.org/wp-content/uploads/2024/01/one-page-guidelines-for-burn-patient-referral.pdf", note: "Supports early airway assessment, oxygen and burn-center consultation for suspected smoke inhalation, including facial burns, enclosed-space exposure, voice change, soot, or respiratory compromise." },
    { id: "ats-ards", label: "ATS/ESICM/SCCM, Mechanical Ventilation in Adult ARDS Guideline", url: "https://www.thoracic.org/statements/guideline-implementation-tools/mechanical-ventilation-in-adults-with-ards.php", note: "Supports lung-protective ventilation, prone positioning in appropriate severe disease, monitoring for ventilator injury, and coordinated critical-care management of refractory hypoxemia." },
    { id: "wses-thoracic-2025", label: "WSES-AAST, 2025 Thoracic Trauma Guideline", url: "https://link.springer.com/article/10.1186/s13017-025-00651-1", note: "Supports trauma resuscitation, pleural decompression and drainage, chest-tube surveillance, hemorrhage assessment, and prevention of retained hemothorax and empyema." },
    { id: "cdc-tb-2025", label: "CDC, Tuberculosis Clinical Guidance and Treatment", url: "https://www.cdc.gov/tb/hcp/clinical-guidance/index.html", note: "Supports airborne precautions, diagnostic specimen collection, public-health coordination, directly observed therapy, toxicity monitoring, and drug-susceptibility-guided tuberculosis care." },
    { id: "wms-heat-2024", label: "Wilderness Medical Society, 2024 Heat Illness Guideline", url: "https://journals.sagepub.com/doi/full/10.1177/10806032241227924", note: "Supports immediate active cooling for heat stroke, airway and circulation support, core-temperature and organ surveillance, and prevention counseling for exertional and environmental heat illness." },
    { id: "wms-hypothermia-2019", label: "Wilderness Medical Society, Accidental Hypothermia Guideline", url: "https://journals.sagepub.com/doi/10.1016/j.wem.2019.10.002", note: "Supports gentle handling, core-temperature and rhythm assessment, staged rewarming, hypoglycemia and trauma evaluation, and transport for advanced rewarming when circulation is unstable." },
    { id: "aast-rhabdo", label: "AAST, Rhabdomyolysis Clinical Consensus", url: "https://tsaco.bmj.com/content/7/1/e000836", note: "Supports early recognition after crush injury, serial creatine kinase and electrolyte assessment, goal-directed fluid therapy, urine-output monitoring, and surveillance for kidney, rhythm, and compartment complications." },
    { id: "wms-frostbite-2019", label: "Wilderness Medical Society, Frostbite Guideline", url: "https://journals.sagepub.com/doi/full/10.1016/j.wem.2019.05.002", note: "Supports protection from refreezing and trauma, controlled rapid rewarming when safe, analgesia and wound care, thrombolysis evaluation in severe injury, and delayed tissue-demarcation decisions." },
    { id: "ada-standards-2026", label: "American Diabetes Association, Standards of Care in Diabetes - 2026", url: "https://diabetes.org/newsroom/press-releases/american-diabetes-association-releases-standards-care-diabetes-2026", note: "Supports individualized glucose monitoring, insulin and medication safety, hypoglycemia prevention, cardiovascular and kidney risk reduction, complication screening, education, and technology use in type 1 and type 2 diabetes." },
    { id: "ada-crises-2024", label: "ADA/EASD/JBDS/AACE/DTS, 2024 Hyperglycemic Crises Consensus", url: "https://diabetesjournals.org/care/article/47/8/1257/156808/Hyperglycemic-Crises-in-Adults-With-Diabetes-A", note: "Supports fluid-first treatment, serial glucose, osmolality, electrolyte and neurologic monitoring, careful insulin and potassium use, precipitant treatment, and resolution criteria for HHS and mixed crises." },
    { id: "nhs-hypernatremia-2026", label: "NHS Ayrshire & Arran, 2026 Adult Hypernatraemia Guidance", url: "https://aaamedicines.org.uk/guidelines/electrolyte-disturbances/management-of-hypernatraemia/", note: "Supports volume and cause assessment, paired serum and urine studies, individualized free-water replacement, repeated sodium and neurologic checks, and prevention of overly rapid correction." },
    { id: "sfe-hypocalcemia", label: "Society for Endocrinology, Acute Hypocalcaemia Emergency Guidance", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5314808/", note: "Supports symptom and electrocardiographic assessment, calcium, magnesium, phosphate, vitamin D and parathyroid testing, monitored calcium replacement, and urgent treatment of tetany, seizure, laryngospasm, or arrhythmia." },
    { id: "rcpa-hypomagnesemia", label: "Royal College of Pathologists of Australasia, Hypomagnesaemia", url: "https://www.rcpa.edu.au/Manuals/RCPA-Manual/Clinical-Presentations-and-Diagnoses/H/Hypomagnesaemia", note: "Supports recognizing refractory hypokalemia or hypocalcemia as a clue, investigating gastrointestinal, renal and medication causes, and monitoring magnesium-related neuromuscular and cardiac complications." },
    { id: "sfe-adrenal", label: "Society for Endocrinology, Adrenal Crisis Guidance", url: "https://www.endocrinology.org/clinical-practice/clinical-guidance/adrenal-crisis/", note: "Supports immediate stress-dose glucocorticoid and isotonic-fluid treatment without waiting for confirmation, glucose and electrolyte monitoring, and sick-day and emergency-injection education." },
    { id: "sfe-di", label: "Society for Endocrinology, Inpatient Arginine Vasopressin Deficiency Guidance", url: "https://www.endocrinology.org/clinical-practice/clinical-guidance/arginine-vasopressin-deficiency-diabetes-insipidus/diabetes-insipidus-arginine-vasopressin-deficiency-information/", note: "Supports assured access to water and desmopressin, fluid-first treatment of decompensation, serial sodium, urine output and osmolality monitoring, and specialist management to prevent dehydration or water intoxication." },
    { id: "acg-achalasia", label: "American College of Gastroenterology, Achalasia Clinical Guideline", url: "https://pubmed.ncbi.nlm.nih.gov/32773454/", note: "Supports manometry-based diagnosis, aspiration and nutrition assessment, definitive sphincter-directed therapy, and post-treatment surveillance for reflux, recurrent dysphagia, or perforation." },
    { id: "sages-stones", label: "SAGES, Management of Choledocholithiasis", url: "https://www.sages.org/publications/guidelines/clinical-spotlight-review-management-of-choledocholithiasis/", note: "Supports evaluation of biliary obstruction, cholangitis and pancreatitis, liver-test and imaging assessment, and timely endoscopic or surgical source control for complicated gallstone disease." },
    { id: "cdc-hepa", label: "CDC, 2025 Clinical Care of Hepatitis A", url: "https://www.cdc.gov/hepatitis-a/hcp/clinical-care/index.html", note: "Supports hydration and symptom care, monitoring for severe acute hepatitis, fecal-oral transmission prevention, vaccination, public-health coordination, and timely postexposure prophylaxis." },
    { id: "acg-crohn-2025", label: "American College of Gastroenterology, 2025 Crohn Disease Guideline", url: "https://gi.org/journals-publications/ebgi/zhai_dalal_sep2025/", note: "Supports objective disease-activity assessment, infection exclusion, nutrition and medication monitoring, effective induction and maintenance therapy, and urgent evaluation of obstruction, abscess, fistula, bleeding, or toxic illness." },
    { id: "acg-uc-2025", label: "American College of Gastroenterology, 2025 Ulcerative Colitis Guideline", url: "https://gi.org/journals-publications/ebgi/alkazzi_aug2025/", note: "Supports stool infection testing, clinical and biomarker severity assessment, remission-targeted therapy, medication safety, and urgent management of acute severe colitis and toxic megacolon." },
    { id: "cdc-hepc", label: "CDC, 2025 Clinical Care of Hepatitis C", url: "https://www.cdc.gov/hepatitis-c/hcp/clinical-care/index.html", note: "Supports confirmatory RNA testing, direct-acting antiviral treatment, interaction and adherence review, hepatitis B reactivation assessment, liver staging, prevention, and post-treatment cure testing." },
    { id: "aasld-cirrhosis", label: "AASLD, Cirrhosis Practice Guidelines and Guidance", url: "https://www.aasld.org/practice-guidelines", note: "Supports surveillance and management of ascites, spontaneous bacterial peritonitis, hepatorenal syndrome, portal-hypertensive bleeding, malnutrition, encephalopathy, and transplant referral in cirrhosis." },
    { id: "aasld-he", label: "AASLD/EASL, Hepatic Encephalopathy Guideline", url: "https://www.aasld.org/sites/default/files/2022-07/Hepatic%20Encephalopathy%20in%20Chronic%20Liver%20Disease%202014.pdf", note: "Supports graded neurologic assessment, identification and treatment of precipitants, airway protection, lactulose and rifaximin use, recurrence prevention, and caregiver education." },
    { id: "acg-pancreatitis-2024", label: "American College of Gastroenterology, 2024 Acute Pancreatitis Guideline", url: "https://webfiles.gi.org/links/journals/AJG-Clinical-Guidelines-Highlights-Acute-Pancreatitis-2024-FINAL.pdf", note: "Supports early severity and volume assessment, goal-directed crystalloid, analgesia, early enteral nutrition, biliary evaluation, and escalation for organ failure, cholangitis, necrosis, or infection." },
    { id: "idsa-intraabdominal-2024", label: "IDSA, 2024 Complicated Intra-abdominal Infection Guideline", url: "https://www.idsociety.org/practice-guideline/intra-abdominal-infections/", note: "Supports risk assessment, imaging and microbiologic evaluation, prompt antimicrobial therapy, source control, and surveillance for peritonitis, abscess, sepsis, and organ dysfunction." },
    { id: "nci-ovarian", label: "NCI, Ovarian Epithelial Cancer Treatment PDQ", url: "https://www.cancer.gov/types/ovarian/hp/ovarian-epithelial-treatment-pdq", note: "Supports stage- and biomarker-directed ovarian-cancer treatment, cytoreductive-surgery and systemic-therapy care, symptom surveillance, genetic evaluation, and management of bowel, fluid, thrombotic, and treatment complications." },
    { id: "nci-gastric", label: "NCI, Gastric Cancer Treatment PDQ", url: "https://www.cancer.gov/types/stomach/hp/stomach-treatment-pdq", note: "Supports staging, gastrectomy and systemic-treatment pathways, biomarker assessment, nutrition support, and surveillance for obstruction, bleeding, dumping, deficiency, infection, and recurrence." },
    { id: "nci-testicular", label: "NCI, Testicular Cancer Treatment PDQ", url: "https://www.cancer.gov/types/testicular/hp/testicular-treatment-pdq", note: "Supports tumor-marker and stage-based care, orchiectomy and systemic-treatment pathways, fertility discussion, toxicity monitoring, and urgent recognition of treatment or metastatic complications." },
    { id: "nci-cervical", label: "NCI, Cervical Cancer Treatment PDQ", url: "https://www.cancer.gov/types/cervical/hp/cervical-treatment-pdq", note: "Supports stage-directed surgery, chemoradiation, brachytherapy and systemic treatment, with monitoring for bleeding, obstruction, infection, urinary or bowel injury, and survivorship concerns." },
    { id: "nci-colon", label: "NCI, Colon Cancer Treatment PDQ", url: "https://www.cancer.gov/types/colorectal/hp/colon-treatment-pdq", note: "Supports stage- and biomarker-directed surgery and systemic treatment, ostomy and bowel-function care, and surveillance for obstruction, perforation, bleeding, infection, treatment toxicity, and recurrence." },
    { id: "wfh-hemophilia", label: "World Federation of Hemophilia, Hemophilia Management Guideline", url: "https://wfh.org/treatment-and-care/", note: "Supports immediate factor replacement for suspected serious bleeding, inhibitor and musculoskeletal assessment, safe procedure planning, bleed prevention, and individualized home-treatment education." },
    { id: "ash-sickle-pain", label: "American Society of Hematology, Sickle Cell Pain Guideline", url: "https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/sickle-cell-disease-guidelines/scd-guidelines-management-of-acute-and-chronic-pain", note: "Supports rapid individualized analgesia, frequent reassessment, multimodal care, avoidance of stigmatizing delays, and recognition of acute chest syndrome, stroke, infection, sequestration, and organ complications." },
    { id: "nci-hodgkin", label: "NCI, Adult Hodgkin Lymphoma Treatment PDQ", url: "https://www.cancer.gov/types/lymphoma/hp/adult-hodgkin-treatment-pdq", note: "Supports subtype and stage-based lymphoma treatment, response assessment, and monitoring for marrow suppression, infection, tumor lysis, cardiopulmonary toxicity, neuropathy, fertility effects, and late complications." },
    { id: "nci-nhl", label: "NCI, Adult Non-Hodgkin Lymphoma Treatment PDQ", url: "https://www.cancer.gov/types/lymphoma/hp/adult-nhl-treatment-pdq", note: "Supports histology, biomarker and stage-directed lymphoma care, response monitoring, and urgent recognition of tumor lysis, infection, cytopenias, compression syndromes, and treatment toxicity." },
    { id: "nccn-infections-2024", label: "NCCN, 2024 Prevention and Treatment of Cancer-Related Infections", url: "https://jnccn.org/view/journals/jnccn/22/9/article-p617.xml", note: "Supports immediate risk-stratified evaluation and broad empiric treatment of febrile neutropenia, cultures and source assessment, antimicrobial stewardship, and surveillance for sepsis and opportunistic infection." },
    { id: "ash-vwd", label: "ASH/ISTH/NHF/WFH, 2021 von Willebrand Disease Guidelines", url: "https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/von-willebrand-disease-guidelines", note: "Supports individualized desmopressin, factor and antifibrinolytic use, laboratory and response assessment, and procedure, menstrual, pregnancy, postpartum, and major-bleeding planning." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const cards = [
    card("Coronary vasospasm", ["acc-ccd-2023"], [
      "Assess rest pain timing, transient triggers, stimulant or tobacco exposure, migraine medicines, and response to prescribed nitrate because episodic coronary constriction can cause ischemia even without fixed obstruction.",
      "Obtain a 12-lead electrocardiogram during symptoms when possible and trend rhythm, ST segments, pain, blood pressure, and troponin because prolonged spasm can produce infarction or malignant ventricular arrhythmia.",
      "Administer prescribed nitrates and calcium-channel blockers while reassessing pain, pressure, dizziness, and heart rate because relaxing coronary smooth muscle can stop spasm but may also cause hypotension.",
      "Review cocaine, amphetamine, nicotine, decongestant, triptan, and medication exposure with the clinical team because vasoconstrictive triggers can defeat preventive therapy and make recurrence more dangerous.",
      "Escalate immediately for pain that persists after the prescribed nitrate plan, syncope, hypotension, sustained ST change, rising troponin, ventricular tachycardia, or pulmonary edema because ongoing ischemia must be treated as an acute coronary syndrome."
    ], [
      "Persistent rest pain with sustained ST-segment change",
      "Syncope, hypotension, diaphoresis, or altered consciousness",
      "Ventricular tachycardia, ventricular fibrillation, or marked bradyarrhythmia",
      "Rising troponin, new pulmonary edema, or recurrent pain despite prescribed nitrate"
    ], [
      "Teach the patient to stop activity, use nitrate exactly as prescribed, and call emergency services when pain does not resolve rather than taking repeated unplanned doses.",
      "Explain that tobacco and stimulant drugs can directly tighten coronary arteries, so avoiding them is part of preventing ischemia rather than a general lifestyle add-on."
    ]),
    card("Hypertensive urgency", ["aha-hbp-2025"], [
      "Recheck blood pressure with the correct cuff after quiet rest and compare both arms when appropriate because pain, anxiety, movement, and poor technique can create a transient severe reading; current guidance calls persistent severe pressure without acute target-organ injury severe hypertension rather than a hypertensive emergency.",
      "Assess neurologic status, vision, chest or back pain, dyspnea, heart-failure findings, pulses, pregnancy status, creatinine, and urine output because acute target-organ injury changes this from severe asymptomatic hypertension to an emergency.",
      "Review missed doses, recent medication changes, nonprescription decongestants, stimulants, withdrawal, pain, and access barriers because correcting the cause is safer than reflexively lowering pressure with an unplanned rapid treatment.",
      "Administer the prescribed oral regimen and trend pressure, pulse, orthostatic symptoms, kidney function, and electrolytes because gradual control limits hypoperfusion while revealing medication intolerance.",
      "Escalate immediately for a new focal deficit, confusion, seizure, vision loss, chest or tearing back pain, pulmonary edema, oliguria, pregnancy-related severe symptoms, or a worsening examination because these findings indicate target-organ injury regardless of the number alone."
    ], [
      "New focal neurologic deficit, seizure, confusion, or vision loss",
      "Chest pressure, tearing back pain, syncope, or unequal pulses",
      "Acute dyspnea, crackles, falling oxygen saturation, or frothy sputum",
      "Oliguria, rapidly worsening kidney function, or severe symptoms during pregnancy"
    ], [
      "Explain that a very high reading without organ injury still needs prompt follow-up and reliable treatment, but abrupt unsupervised lowering can reduce brain, heart, or kidney perfusion.",
      "Teach accurate home measurement, a written medication plan, and the exact symptoms that mean calling emergency services instead of waiting for the next clinic visit."
    ]),
    card("Mitral regurgitation", ["acc-valve-2020"], [
      "Assess exertional dyspnea, orthopnea, fatigue, palpitations, edema, murmur change, and activity tolerance because increasing regurgitant volume raises left-atrial pressure and can progress before resting symptoms seem dramatic.",
      "Trend heart rate, rhythm, blood pressure, oxygenation, lung sounds, daily weight, edema, and urine output because atrial fibrillation, pulmonary congestion, and falling forward output are common routes to decompensation.",
      "Administer prescribed diuretics and afterload or rhythm therapy while monitoring renal function, potassium, pressure, and symptoms because relieving congestion helps breathing but excessive volume removal can reduce perfusion.",
      "Coordinate scheduled echocardiography and valve-team follow-up because ventricular size and function, pulmonary pressure, and valve anatomy determine when repair is safer than waiting for irreversible dysfunction.",
      "Escalate immediately for acute severe dyspnea, new pulmonary edema, hypotension, syncope, rapid atrial fibrillation, new chest pain, or abrupt murmur change after infarction or infection because acute severe regurgitation may require urgent intervention."
    ], [
      "Sudden pulmonary edema or rapidly increasing oxygen need",
      "Hypotension, cool skin, confusion, or falling urine output",
      "New rapid atrial fibrillation, syncope, or sustained ventricular rhythm",
      "Abrupt murmur or hemodynamic change after infarction, trauma, or infection"
    ], [
      "Teach daily weight and symptom tracking because a rising weight, new orthopnea, or declining walking tolerance may reveal congestion before severe distress develops.",
      "Explain why scheduled echocardiograms matter even when symptoms are mild: the ventricle can compensate for leakage until structural damage is harder to reverse."
    ]),
    card("Orthostatic hypotension", ["aha-oh-2024"], [
      "Measure blood pressure and pulse after supine rest and again during supported standing while recording symptoms because the timing and heart-rate response help separate volume loss, medication effect, and autonomic failure.",
      "Assess recent fluid loss, bleeding, infection, prolonged bed rest, neuropathy, parkinsonism, adrenal symptoms, and medication timing because treating the driver prevents recurrent cerebral hypoperfusion more effectively than treating one reading.",
      "Institute assisted position changes, nonslip footwear, a clear call-before-standing plan, and supervised toileting because most immediate harm comes from syncope and falls during transfers.",
      "Administer prescribed fluids or cause-directed therapy and trend intake, output, weight, supine pressure, standing symptoms, electrolytes, and heart rate because both undertreatment and excessive volume or vasopressor therapy can cause harm.",
      "Escalate immediately for syncope with injury, persistent hypotension, chest pain, dyspnea, new focal deficit, gastrointestinal bleeding, fever with shock signs, or failure to recover when supine because these findings suggest a dangerous cause beyond uncomplicated orthostasis."
    ], [
      "Syncope with head injury, persistent confusion, or focal neurologic deficit",
      "Chest pain, new arrhythmia, dyspnea, or falling oxygen saturation",
      "Melena, hematemesis, heavy bleeding, or rapidly falling hemoglobin",
      "Persistent hypotension, fever, cool skin, or failure to improve when supine"
    ], [
      "Teach the patient to sit at the bedside, move the ankles, stand with support, and pause before walking so venous return can adjust before balance is challenged.",
      "Review hydration and medication timing with the care team rather than stopping medicines independently, because the safest plan must balance standing symptoms against supine hypertension or heart disease."
    ]),
    card("Peripheral vascular disease", ["acc-pad-2024"], [
      "Clarify whether findings are arterial, venous, or mixed by assessing pulses, temperature, color, capillary refill, edema, skin change, wound location, and pain pattern because compression and positioning that help venous disease can harm severe arterial ischemia.",
      "Inspect both feet and between the toes each shift, document wound dimensions and drainage, and protect heels because sensory loss and low perfusion allow small injuries to become infected or necrotic without intense pain.",
      "Administer prescribed antiplatelet, lipid, blood-pressure, diabetes, and pain therapy while monitoring bleeding, renal function, and walking tolerance because systemic atherosclerotic risk and limb symptoms must be treated together.",
      "For stable arterial peripheral vascular disease, encourage the prescribed structured walking and foot-care plan only after acute ischemia is excluded because repeated safe exercise promotes collateral function, whereas a threatened limb needs revascularization rather than exercise.",
      "Escalate immediately for sudden pain, pallor, pulselessness, paresthesia, paralysis, a cold limb, rest pain with tissue loss, spreading infection, or a rapidly darkening wound because acute or chronic limb-threatening ischemia risks amputation and sepsis."
    ], [
      "Sudden cold, pale, painful, pulseless, weak, or numb limb",
      "New motor weakness or loss of sensation distal to the affected artery",
      "Rest pain with ulcer, gangrene, or rapidly darkening tissue",
      "Spreading erythema, purulent drainage, fever, crepitus, or systemic toxicity"
    ], [
      "Teach daily foot inspection, protective well-fitting shoes, skin moisturization away from toe webs, and prompt reporting of any blister or color change because healing is limited by poor perfusion.",
      "Explain that tobacco cessation, lipid and glucose control, and walking therapy protect the heart and brain as well as the leg because peripheral disease signals systemic atherosclerosis."
    ]),
    card("Prosthetic valve infection", ["aha-endocarditis", "acc-valve-2020"], [
      "Obtain ordered blood-culture sets from separate sites before antimicrobials when the patient is stable enough because organism identification is crucial and prior antibiotics can sterilize cultures without curing prosthetic infection.",
      "Assess fever, rigors, new murmur, heart-failure findings, prosthetic click change, embolic skin findings, neurologic status, abdominal pain, limb perfusion, and recent dental, device, or bloodstream exposure because prosthetic infection can destroy tissue and embolize widely.",
      "Administer organism-directed intravenous therapy exactly on schedule and monitor cultures, blood counts, kidney and liver function, drug levels when ordered, and vascular-access sites because prolonged combination therapy can be toxic while missed exposure permits persistent biofilm infection.",
      "Maintain rhythm monitoring and coordinate transthoracic, transesophageal, and adjunct imaging because new conduction delay, paravalvular leak, abscess, dehiscence, or obstruction often requires surgery rather than antibiotics alone.",
      "Escalate immediately for pulmonary edema, shock, new heart block, persistent bacteremia, prosthetic dehiscence, focal neurologic deficit, acute limb ischemia, severe abdominal pain, or recurrent emboli because invasive infection can cause catastrophic valve failure or abscess."
    ], [
      "Acute pulmonary edema, hypotension, or rapidly worsening valve dysfunction",
      "New PR prolongation, atrioventricular block, or unstable rhythm",
      "Persistent positive cultures or fever despite appropriate therapy",
      "Focal neurologic deficit, acute limb ischemia, or severe splenic-type pain"
    ], [
      "Teach completion of the entire antimicrobial course and meticulous line care because symptoms may improve before prosthetic biofilm infection is eradicated.",
      "Explain oral hygiene, follow-up cultures and imaging, and the clinician-directed dental prophylaxis plan; prophylactic antibiotics are reserved for specific procedures and risks rather than taken casually."
    ]),
    card("Restrictive cardiomyopathy", ["esc-cardiomyopathy-2023"], [
      "Assess exertional dyspnea, orthopnea, abdominal fullness, edema, syncope, jugular venous pressure, family history, systemic disease, and treatment exposure because stiff ventricles create congestion with limited ability to increase filling or stroke volume.",
      "Trend rhythm, blood pressure, oxygenation, daily weight, intake and output, edema, abdominal girth, renal function, liver tests, and natriuretic markers when ordered because congestion, atrial arrhythmia, and end-organ dysfunction can progress despite preserved ejection fraction.",
      "Administer carefully titrated diuretic and disease-specific therapy while reassessing perfusion and kidney function because reducing venous pressure relieves symptoms but excessive preload reduction can sharply lower cardiac output.",
      "Coordinate echocardiography, advanced imaging, rhythm surveillance, genetic or systemic-cause evaluation, and specialist follow-up because amyloid, iron, inflammatory, genetic, and endomyocardial causes require different treatment and family counseling.",
      "Escalate immediately for syncope, hypotension, new rapid atrial arrhythmia, pulmonary edema, chest pain, rapidly worsening ascites or edema, oliguria, or confusion because restrictive physiology can decompensate quickly when filling time or preload changes."
    ], [
      "Syncope, hypotension, cool skin, or declining urine output",
      "New rapid atrial fibrillation or sustained ventricular arrhythmia",
      "Acute pulmonary edema or sharply increasing oxygen requirement",
      "Rapidly progressive edema, ascites, renal dysfunction, or hepatic congestion"
    ], [
      "Teach daily weight, pulse, swelling, breathing, and activity tracking because small fluid or rhythm changes can produce large symptom changes in a stiff ventricle.",
      "Explain that the label describes a filling pattern, not one cause, so completing amyloid, iron, inflammatory, and family evaluation can change treatment and relatives' screening."
    ]),
    card("Right-sided heart failure", ["aha-rhf-2018"], [
      "Assess jugular venous pressure, edema, ascites, hepatomegaly, weight, dyspnea, chest pain, perfusion, and the likely pulmonary, left-heart, infarct, valve, or congenital cause because right-ventricular treatment depends on afterload and loading conditions.",
      "Trend blood pressure, rhythm, oxygenation, daily weight, strict intake and output, urine output, creatinine, sodium, potassium, liver tests, and mental status because venous congestion impairs kidneys and liver while low forward flow threatens perfusion.",
      "Administer prescribed diuretics and cause-directed therapy with frequent volume reassessment because relieving congestion improves organ function but abrupt or excessive preload loss can collapse right-ventricular output.",
      "Avoid unplanned fluid boluses and review ventilator pressure or pulmonary vasodilator changes with the team because excess volume and increased pulmonary vascular resistance can both worsen ventricular dilation and septal interaction.",
      "Escalate immediately for hypotension, syncope, chest pain, rising oxygen need, new tachyarrhythmia, cool extremities, oliguria, rising lactate, or rapidly worsening edema and abdominal pain because acute right-ventricular failure can progress to multiorgan shock."
    ], [
      "Hypotension, syncope, cool extremities, or altered consciousness",
      "New chest pain, severe hypoxemia, or rapid atrial arrhythmia",
      "Oliguria, rising lactate, or rapidly worsening kidney or liver function",
      "Abruptly increasing jugular venous pressure, edema, ascites, or abdominal pain"
    ], [
      "Teach daily weight, edema, abdominal swelling, breathing, and medication tracking because systemic congestion may worsen before lung crackles appear.",
      "Explain why salt, fluid, diuretic, oxygen, and activity plans are individualized: both too much volume and too little filling can impair a vulnerable right ventricle."
    ]),
    card("Sinus bradycardia", ["acc-bradycardia-2018"], [
      "Confirm a sinus rhythm and correlate the rate with blood pressure, pulse, consciousness, chest pain, dyspnea, activity, sleep, and symptoms because treatment is driven by hypoperfusion and cause rather than a rate alone.",
      "Review nodal-blocking medicines, recent dose changes, ischemia, hypoxia, temperature, thyroid status, potassium, magnesium, sleep apnea, and athletic baseline because reversible or physiologic bradycardia should not be confused with progressive node disease.",
      "Maintain telemetry for symptomatic or new bradycardia and trend pauses, conduction intervals, perfusion, urine output, and response to activity because intermittent sinus-node dysfunction may be missed by one electrocardiogram.",
      "Hold and clarify contributing medication when clinically indicated, establish intravenous access, and prepare prescribed atropine or pacing support because unstable bradycardia can deteriorate before the cause is corrected.",
      "Escalate immediately for hypotension, syncope, altered consciousness, ischemic chest discomfort, acute heart failure, shock, long symptomatic pauses, or loss of pulse because these findings require the unstable-bradycardia pathway and pacing readiness."
    ], [
      "Syncope, hypotension, confusion, or signs of shock",
      "Ischemic chest discomfort or acute pulmonary edema",
      "Long symptomatic pauses or progression to high-grade block",
      "Failure to respond to initial support or loss of a palpable pulse"
    ], [
      "Teach the patient to record fainting, near-fainting, exercise intolerance, pulse changes, and medication timing because symptom-rhythm correlation guides pacemaker decisions.",
      "Explain that a slow pulse during sleep or athletic conditioning may be normal, but new dizziness, chest pain, breathlessness, or collapse needs urgent assessment."
    ]),
    card("Takotsubo cardiomyopathy", ["esc-takotsubo-2018"], [
      "Treat the initial presentation as a possible acute coronary syndrome by obtaining electrocardiograms, serial troponin, hemodynamic assessment, and urgent cardiac evaluation because takotsubo cannot be safely distinguished from infarction by stress history alone.",
      "Assess recent emotional or physical stress, neurologic illness, catecholamine exposure, chest pain, dyspnea, syncope, and heart-failure findings because triggers provide context but do not predict complication severity.",
      "Maintain continuous rhythm and ST monitoring and trend blood pressure, oxygenation, lung sounds, urine output, electrolytes, QT interval, and ventricular function because arrhythmia, shock, pulmonary edema, and dynamic outflow obstruction can occur during a reversible syndrome.",
      "Administer prescribed heart-failure or anticoagulant therapy only after imaging and hemodynamic review because treatment differs when outflow obstruction, apical thrombus, or severe right-ventricular involvement is present.",
      "Escalate immediately for hypotension, syncope, ventricular arrhythmia, marked QT prolongation, pulmonary edema, new murmur, embolic deficit, or falling output because shock, rupture, outflow obstruction, or ventricular thrombus requires urgent specialist management."
    ], [
      "Hypotension, shock, syncope, or rapidly falling urine output",
      "Ventricular tachycardia, ventricular fibrillation, or marked QT prolongation",
      "Acute pulmonary edema or a new dynamic systolic murmur",
      "New focal neurologic deficit or other evidence of systemic embolism"
    ], [
      "Explain that stress may trigger the syndrome but the symptoms are real cardiac ischemia-like symptoms and must never be self-diagnosed at home as anxiety.",
      "Teach medication adherence and follow-up imaging because documented recovery of ventricular function and screening for persistent symptoms are part of completing care."
    ]),
    card("Venous stasis ulcer", ["svs-venous-ulcer"], [
      "Assess pulses, capillary refill, skin temperature, edema, varicosities, neuropathy, ulcer location, size, depth, drainage, odor, surrounding skin, and pain because arterial or mixed disease changes whether compression is safe.",
      "Obtain or verify ordered arterial and venous evaluation before initiating strong compression because external pressure can improve venous return yet worsen tissue ischemia when inflow is severely impaired.",
      "Cleanse and dress the ulcer with an individualized moisture balance, protect periwound skin, elevate when appropriate, and reposition pressure points because maceration, edema, and repeated trauma delay granulation.",
      "Apply prescribed compression correctly and reassess distal color, warmth, sensation, pain, swelling, and device slippage because effective gradient pressure reduces venous hypertension while poor fit can cause focal injury.",
      "Escalate immediately for new rest pain, pallor, coolness, absent pulse, spreading erythema, fever, purulence, crepitus, rapidly increasing wound size, exposed deep structure, or systemic illness because ischemia or invasive infection threatens limb and life."
    ], [
      "New cold pale foot, absent pulse, rest pain, or sensory loss",
      "Spreading erythema, fever, purulent drainage, crepitus, or systemic toxicity",
      "Rapid tissue darkening, wound expansion, or exposed tendon or bone",
      "Sudden unilateral swelling or dyspnea suggesting venous thrombosis or embolism"
    ], [
      "Teach compression application, daily skin and foot inspection, leg elevation, calf movement, and walking as prescribed because calf-muscle pumping and external support lower venous pressure.",
      "Explain that the wound can close while venous hypertension remains, so continued prevention and vascular follow-up reduce recurrence."
    ]),
    card("Second-degree AV block Type I", ["acc-bradycardia-2018"], [
      "Confirm progressive PR prolongation followed by a dropped QRS and compare the monitor rhythm with a 12-lead electrocardiogram and palpable pulse because artifact or blocked atrial ectopy can imitate Mobitz I.",
      "Assess dizziness, syncope, chest pain, dyspnea, blood pressure, perfusion, and activity relation because nodal Wenckebach is often tolerated but becomes clinically important when it reduces cardiac output.",
      "Review nodal-blocking medicines, inferior ischemia, sleep apnea, vagal triggers, potassium, magnesium, thyroid status, and recent procedures because many causes are reversible and pacing is not automatic for an asymptomatic nodal block.",
      "Maintain telemetry when the block is new or symptomatic and trend dropped-beat frequency, QRS width, ventricular rate, pauses, and progression because infranodal features or worsening conduction carry greater risk.",
      "Escalate immediately for hypotension, syncope, altered consciousness, ischemic pain, acute heart failure, repeated nonconducted beats, a widening escape rhythm, or progression to high-grade block because unstable conduction requires pacing support."
    ], [
      "Syncope, hypotension, confusion, or signs of poor perfusion",
      "Ischemic chest pain or acute pulmonary edema",
      "Increasing consecutive dropped beats or prolonged symptomatic pauses",
      "Wide-QRS escape, progression to high-grade block, or loss of pulse"
    ], [
      "Teach the patient to report fainting, near-fainting, new breathlessness, chest pain, or declining exercise tolerance because symptoms determine urgency more than the rhythm label alone.",
      "Explain that Mobitz I is not the same as Mobitz II: observation may be appropriate when stable, but new symptoms or progression still require prompt reassessment."
    ]),
    card("Atelectasis", ["aarc-airway-clearance"], [
      "Assess respiratory rate and effort, oxygen saturation, breath sounds, pain, cough strength, secretion burden, mobility, sedation, and recent surgery because alveoli collapse when ventilation is shallow or an airway is obstructed.",
      "Position upright, turn regularly, mobilize early when safe, and coach supported deep breathing and effective coughing because changing lung volume and clearing obstruction can reopen dependent alveoli.",
      "Treat pain and excessive sedation with the team while protecting ventilation because splinting suppresses inspiration, whereas oversedation weakens cough and promotes secretion retention.",
      "Trend oxygen need, work of breathing, breath sounds, temperature, sputum, and ordered imaging and blood gases because persistent collapse can impair gas exchange or conceal mucus plugging, pneumonia, effusion, or pneumothorax.",
      "Escalate immediately for rapidly increasing oxygen need, severe distress, absent unilateral breath sounds, inability to clear an obstructing plug, fever with sepsis signs, or deterioration despite repositioning because bronchoscopy or ventilatory support may be required."
    ], [
      "Rapidly rising oxygen requirement or severe work of breathing",
      "Sudden absent unilateral breath sounds or tracheal deviation",
      "Ineffective cough with suspected mucus plugging or lobar collapse",
      "Fever, purulent sputum, hypotension, or worsening confusion"
    ], [
      "Teach splinted coughing, prescribed breathing exercises, position changes, and walking because frequent full breaths are more useful than occasional hurried device use.",
      "Explain that new fever, breathlessness, chest pain, or inability to cough up secretions needs reassessment because collapse can progress or reflect another lung problem."
    ]),
    card("Near drowning", ["aha-drowning-2025"], [
      "Use the modern concept of nonfatal drowning and assess airway, breathing, pulse, oxygenation, consciousness, temperature, trauma, and submersion history because the primary injury is respiratory impairment and hypoxemia.",
      "Provide immediate oxygen and ventilation support, begin resuscitation that includes rescue breaths when indicated, and prepare advanced airway support because reversing hypoxemia is the central time-critical intervention.",
      "Remove wet clothing, dry and rewarm appropriately, maintain spinal precautions only when mechanism or findings support trauma, and check glucose because hypothermia, injury, and metabolic causes can alter consciousness.",
      "Trend respiratory effort, oxygen requirement, lung sounds, mental status, temperature, rhythm, urine output, and ordered blood gases and imaging because pulmonary edema, aspiration-related injury, arrhythmia, and neurologic deterioration may evolve after rescue.",
      "Escalate immediately for apnea, persistent hypoxemia, increasing work of breathing, frothy sputum, hypotension, recurrent confusion, seizure, arrhythmia, or falling temperature because delayed respiratory failure or hypoxic brain injury requires critical care."
    ], [
      "Apnea, ineffective ventilation, or loss of pulse",
      "Persistent hypoxemia, frothy sputum, or rapidly increasing respiratory effort",
      "Seizure, worsening confusion, unequal pupils, or failure to awaken",
      "Hypotension, unstable arrhythmia, or progressive hypothermia"
    ], [
      "Explain that normal appearance immediately after rescue does not permit unsupervised dismissal when respiratory symptoms or impaired consciousness occurred; observation follows the clinical assessment.",
      "Teach water barriers, close active supervision, life jackets, swimming skills, and avoiding alcohol around water because prevention must address the circumstances that allowed submersion."
    ]),
    card("Smoke inhalation injury", ["aba-inhalation"], [
      "Assess enclosed-space exposure, facial or neck burns, soot, carbonaceous sputum, hoarseness, stridor, cough, wheeze, mental status, and burn extent because airway edema and toxic-gas injury can worsen after the initial examination.",
      "Give high-concentration oxygen as prescribed and obtain co-oximetry, blood gas, lactate, and electrocardiographic evaluation because pulse oximetry can look reassuring in carbon monoxide poisoning and cellular hypoxia may persist.",
      "Prepare for early expert airway control when voice change, swelling, stridor, deep facial burns, or declining consciousness appears because delayed intubation becomes difficult once upper-airway edema progresses.",
      "Monitor airway sounds, respiratory effort, oxygen and ventilator needs, secretions, bronchoscopic findings when ordered, rhythm, neurologic status, urine output, and acid-base trend because bronchial sloughing, ARDS, toxic exposure, and shock may evolve over hours.",
      "Escalate immediately for stridor, rapidly increasing hoarseness or swelling, confusion, seizure, severe acidosis, hypotension, chest ischemia, copious casts, or rising ventilatory pressure because airway obstruction or systemic toxic injury is time critical."
    ], [
      "Stridor, rapidly progressive hoarseness, facial swelling, or inability to handle secretions",
      "Confusion, syncope, seizure, severe headache, or cardiac ischemia after smoke exposure",
      "Worsening acidosis, hypotension, or cardiovascular collapse",
      "Copious soot or casts, rising ventilatory pressures, or refractory hypoxemia"
    ], [
      "Explain that a normal fingertip oxygen reading cannot exclude carbon monoxide exposure, so symptoms and specialized blood testing guide safe disposition.",
      "Teach survivors to seek urgent care for delayed hoarseness, breathlessness, confusion, chest pain, or worsening cough and to review home smoke alarms and fire-escape planning."
    ]),
    card("ARDS", ["ats-ards"], [
      "Assess the precipitating sepsis, pneumonia, aspiration, trauma, transfusion, or pancreatitis while trending oxygenation, work of breathing, chest findings, and hemodynamics because ARDS is diffuse permeability injury that requires treatment of both lung failure and its cause.",
      "Verify predicted-body-weight-based lung-protective ventilation and trend tidal volume, plateau and driving pressures, compliance, blood gases, and patient-ventilator synchrony because excessive stretch and pressure can amplify alveolar injury.",
      "Coordinate prone positioning and neuromuscular or rescue strategies when prescribed, protecting tubes, eyes, pressure points, and nerves because redistributing ventilation can improve oxygenation but introduces device and skin risks.",
      "Balance fluids and vasoactive therapy with strict intake and output, daily weight, perfusion, lactate, kidney function, and lung findings because excess hydrostatic pressure worsens edema while inadequate circulation worsens organ injury.",
      "Escalate immediately for refractory hypoxemia, sudden pressure rise, new unilateral absent breath sounds, severe ventilator dyssynchrony, hypotension, falling urine output, or new arrhythmia because pneumothorax, tube obstruction, shock, or escalating lung failure requires immediate response."
    ], [
      "Refractory hypoxemia or rapidly rising oxygen and ventilator requirement",
      "Sudden high airway pressure with unilateral absent breath sounds",
      "Severe dyssynchrony, tube displacement, or inability to ventilate",
      "Hypotension, rising lactate, oliguria, or new multiorgan dysfunction"
    ], [
      "Explain to families that ARDS is leakage and inflammation across both lungs rather than simple fluid overload, which is why ventilation and treatment of the trigger occur together.",
      "Prepare patients and families for weakness, cognitive symptoms, breathlessness, and rehabilitation needs after critical illness because recovery often continues well beyond extubation."
    ]),
    card("Hemothorax", ["wses-thoracic-2025"], [
      "Assess mechanism, chest pain, respiratory effort, symmetry, breath sounds, percussion, tracheal position, pulse, pressure, skin perfusion, and associated injuries because pleural blood can compress the lung while ongoing hemorrhage causes shock.",
      "Provide oxygen, establish large-bore access, obtain ordered imaging and blood studies, and prepare blood products and pleural drainage because simultaneous respiratory compromise and blood loss require parallel treatment.",
      "After chest-tube placement, keep the system below the chest, secure connections, assess tidaling and patency, and measure drainage by time because sudden cessation may mean clot obstruction while brisk output may signal ongoing vascular bleeding.",
      "Trend respiratory status, oxygen need, tube-site findings, drainage amount and character, hemoglobin, coagulation, temperature, and repeat imaging because retained clot, rebleeding, empyema, and persistent lung collapse require early detection.",
      "Escalate immediately for hypotension, rapidly increasing bloody drainage, new respiratory distress, absent drainage with clinical deterioration, tube dislodgement, tension physiology, or falling hemoglobin because operative control or urgent tube correction may be needed."
    ], [
      "Hypotension, tachycardia, cool skin, or rapidly falling hemoglobin",
      "Brisk or accelerating bloody chest-tube output",
      "Sudden respiratory deterioration with absent or abruptly stopped drainage",
      "Tube dislodgement, new tension signs, fever, or purulent drainage"
    ], [
      "Teach the patient to avoid pulling or lying on the tubing and to report sudden breathlessness, chest pressure, warmth, or wetness at the site immediately.",
      "Explain coughing, supported deep breathing, pain control, and mobility because re-expanding the lung and clearing secretions help prevent retained collapse and pneumonia."
    ]),
    card("Tuberculosis", ["cdc-tb-2025"], [
      "Place suspected contagious pulmonary or laryngeal disease in airborne infection isolation and use fit-tested respiratory protection because tuberculosis spreads through suspended infectious particles before confirmation is complete.",
      "Collect ordered sputum for smear, nucleic-acid testing, culture, and susceptibility in an appropriate ventilated setting because organism confirmation and resistance results determine the effective regimen.",
      "Administer the complete multidrug regimen through the coordinated public-health plan and verify doses, interactions, weight, kidney and liver function, vision symptoms, neuropathy, and blood counts because adherence prevents relapse and resistance while toxicities can become serious.",
      "Trend cough, fever, night sweats, weight, oxygenation, sputum results, medication tolerance, and clinical response because persistent infectiousness or nonresponse may reflect resistance, malabsorption, an alternate diagnosis, or missed doses.",
      "Escalate immediately for hemoptysis with instability, severe dyspnea, hypoxemia, confusion, meningismus, focal deficit, jaundice, major vision change, or rapidly worsening liver tests because respiratory failure, disseminated disease, or treatment toxicity needs urgent care."
    ], [
      "Large hemoptysis, hypotension, or airway compromise",
      "Severe dyspnea, hypoxemia, or rapidly progressive pulmonary findings",
      "Meningismus, confusion, focal neurologic deficit, or seizure",
      "Jaundice, severe abdominal symptoms, or new vision loss during therapy"
    ], [
      "Teach that feeling better does not mean the bacteria are eradicated; every coordinated dose and follow-up specimen helps prevent relapse, resistance, and transmission.",
      "Explain the local public-health plan for isolation, masks, ventilation, contact evaluation, and return to work or school rather than using a self-selected calendar."
    ]),
    card("Heat stroke", ["wms-heat-2024"], [
      "Recognize altered consciousness with dangerous heat exposure or exertion, remove excess clothing, obtain a reliable core temperature, and activate emergency cooling because central nervous system dysfunction distinguishes heat stroke from milder heat illness.",
      "Begin the fastest feasible whole-body active cooling while supporting airway, breathing, and circulation because organ injury tracks the duration of extreme hyperthermia and transport must not postpone effective cooling.",
      "Establish intravenous access and monitor rhythm, glucose, urine output, electrolytes, kidney and liver tests, creatine kinase, coagulation, lactate, and acid-base status because rhabdomyolysis, dysrhythmia, renal failure, hepatic injury, and coagulopathy can emerge after temperature improves.",
      "Use fluids and vasoactive support according to perfusion and laboratory reassessment rather than assuming every patient needs unlimited volume because distributive shock and dehydration may coexist with pulmonary or renal complications.",
      "Escalate immediately for seizure, coma, refractory hypotension, arrhythmia, anuria, rapidly rising creatine kinase or potassium, bleeding, hypoglycemia, or worsening liver function because heat stroke can progress to multiorgan failure despite initial cooling."
    ], [
      "Seizure, coma, severe agitation, or declining consciousness",
      "Refractory hypotension, unstable rhythm, or worsening acidosis",
      "Anuria, dark urine, rising potassium, or severe muscle breakdown",
      "Bleeding, falling platelets, hypoglycemia, or rapidly worsening liver injury"
    ], [
      "Teach acclimatization, scheduled cooling and hydration, work-rest planning, weather awareness, and avoiding solo exertion because thirst and willpower do not reliably prevent heat accumulation.",
      "Explain that confusion, collapse, unusual behavior, or loss of coordination in the heat is an emergency that requires immediate cooling and emergency services, not observation in a parked vehicle."
    ]),
    card("Hypothermia", ["wms-hypothermia-2019"], [
      "Measure core temperature with an appropriate device and assess consciousness, shivering, breathing, pulse, glucose, trauma, exposure, infection, endocrine disease, and intoxicants because severity and a secondary cause may be missed by cool skin alone.",
      "Handle gently, keep the patient horizontal when feasible, remove wet clothing, insulate from the ground and wind, and apply staged rewarming because a cold myocardium is irritable and rough movement or further heat loss can worsen instability.",
      "Provide warmed oxygen, warmed fluids, and active external or internal rewarming as ordered while protecting numb skin from burns because impaired sensation and circulation make direct high heat dangerous.",
      "Monitor rhythm continuously and trend core temperature, glucose, pressure, oxygenation, electrolytes, acid-base status, urine output, and neurologic response because arrhythmia, hypoglycemia, shock, and afterdrop can occur during rescue and rewarming.",
      "Escalate immediately for absent or uncertain pulse, ventricular arrhythmia, persistent hypotension, declining consciousness, failure to rewarm, severe trauma, or recurrent cooling because prolonged resuscitation and extracorporeal rewarming may be appropriate in selected patients."
    ], [
      "Absent or uncertain pulse, apnea, or ventricular fibrillation",
      "Persistent hypotension, severe bradyarrhythmia, or recurrent collapse",
      "Declining consciousness, seizure, or severe hypoglycemia",
      "Failure to rewarm, major trauma, or continued environmental exposure"
    ], [
      "Teach layered dry clothing, wind and moisture protection, food and hydration, a buddy system, and early response to clumsiness or confusion because judgment deteriorates as cooling advances.",
      "Explain that rubbing cold limbs, walking an unstable patient, or applying intense direct heat can injure tissue or stress the heart; controlled rewarming is safer."
    ]),
    card("Crush syndrome", ["aast-rhabdo"], [
      "Assess compression duration, muscle mass involved, trauma, swelling, distal neurovascular status, urine color and output, pressure, and rhythm because necrotic muscle releases potassium and myoglobin while sequestering circulating volume.",
      "Establish monitoring and vascular access and begin prescribed isotonic fluid resuscitation as early as safely possible because supporting renal perfusion before and after release reduces pigment-associated kidney injury.",
      "Trend electrocardiogram, potassium, calcium, phosphate, creatinine, creatine kinase, acid-base status, coagulation, urine output, and fluid balance because lethal dysrhythmia, kidney failure, and coagulopathy can evolve rapidly after reperfusion.",
      "Perform frequent limb pain, tension, color, pulse, sensation, and motor checks without relying on pulse loss as an early sign because compartment syndrome can destroy nerve and muscle while arterial pulses remain present.",
      "Escalate immediately for electrocardiographic change, rising potassium, arrhythmia, anuria, refractory shock, escalating pain with tense swelling, new weakness or numbness, or bleeding because urgent electrolyte treatment, dialysis, fasciotomy, or hemorrhage control may be required."
    ], [
      "Electrocardiographic change, rapidly rising potassium, or unstable arrhythmia",
      "Anuria, worsening acidosis, or rapidly rising creatinine",
      "Pain out of proportion, tense swelling, new paresthesia, or motor weakness",
      "Refractory hypotension, active bleeding, or progressive coagulopathy"
    ], [
      "Explain that severe complications may appear when pressure is released because damaged muscle contents then enter the circulation, so monitoring must continue after rescue.",
      "Teach survivors to report reduced urine, dark urine, increasing swelling, weakness, numbness, palpitations, or breathlessness immediately during recovery."
    ]),
    card("Frostbite", ["wms-frostbite-2019"], [
      "For suspected frostbite, assess exposure duration, refreezing risk, hypothermia, hydration, sensation, color, capillary refill, blisters, tissue firmness, and associated trauma because systemic cold threats come before definitive limb treatment.",
      "Protect the frozen part from pressure and rubbing, remove constricting items, pad and elevate it, and do not thaw when refreezing remains likely because repeated freeze-thaw cycles deepen microvascular injury.",
      "When refreezing is no longer possible, begin prescribed frostbite rewarming rapidly in a controlled circulating water bath, provide strong analgesia, and monitor temperature and tissue response because thawing is painful and uncontrolled heat can burn insensate skin.",
      "Document serial photographs or wound findings, distal perfusion, sensation, edema, blister character, infection signs, and ordered imaging because tissue demarcation evolves and early appearance does not reliably define final viability.",
      "Escalate immediately for concurrent hypothermic instability, compartment signs, absent perfusion after thaw, rapidly spreading infection, sepsis, hemorrhagic blistering with deep injury, or a severe recent freeze because specialty thrombolysis or surgical evaluation may be time sensitive."
    ], [
      "Hypothermic shock, unstable rhythm, or declining consciousness",
      "Absent perfusion after thaw or rapidly worsening cyanosis",
      "Tense swelling, pain out of proportion, weakness, or sensory loss",
      "Spreading erythema, purulence, crepitus, fever, or systemic toxicity"
    ], [
      "Teach prevention with dry loose layers, mittens, foot and buddy checks, food and hydration, and immediate shelter for numb or pale skin because early cold injury may be painless.",
      "Explain why the care team may delay amputation decisions: viable and nonviable tissue often separates over time unless infection or compartment pressure demands earlier surgery."
    ]),
    card("Type 1 diabetes", ["ada-standards-2026"], [
      "Assess the patient's usual basal, mealtime, correction, pump, continuous-monitor, carbohydrate, exercise, and hypoglycemia plan because type 1 diabetes requires continuous insulin replacement even when food intake or care setting changes.",
      "Check glucose with the ordered method and assess ketones during illness, persistent hyperglycemia, nausea, vomiting, or abdominal pain because absolute insulin deficiency can produce ketoacidosis before severe dehydration is obvious.",
      "Coordinate insulin timing with actual carbohydrate delivery and verify pump or sensor function, infusion sites, backup insulin, and independent self-management ability because a missed basal dose or interrupted infusion can cause rapid metabolic deterioration.",
      "Monitor for hypoglycemia around meals, exercise, sleep, renal change, and dose transitions and keep protocol-directed fast carbohydrate or rescue therapy available because insulin cannot be safely omitted but its effect can outlast available glucose.",
      "Escalate immediately for altered consciousness, seizure, severe hypoglycemia, persistent vomiting, ketones with acidosis symptoms, rapid breathing, dehydration, pump failure without backup insulin, or inability to retain fluids because urgent DKA or hypoglycemia treatment is required."
    ], [
      "Severe hypoglycemia, seizure, unconsciousness, or inability to swallow",
      "Vomiting, abdominal pain, rapid deep breathing, ketones, or dehydration",
      "Pump interruption or missed basal insulin without a safe replacement plan",
      "Confusion, hypotension, marked weakness, or inability to retain fluids"
    ], [
      "Teach never to stop basal insulin on a sick day without a clinician-directed replacement plan; instead check glucose and ketones, hydrate, and use the written correction and emergency plan.",
      "Review glucagon, fast-carbohydrate treatment, medical identification, supply backup, driving and exercise safety, and how family members should respond when the patient cannot self-treat."
    ]),
    card("Type 2 diabetes", ["ada-standards-2026"], [
      "Assess glucose pattern, nutrition, activity, medication access and use, kidney and liver function, cardiovascular disease, heart failure, neuropathy, vision, and foot status because treatment should address both glycemia and the organ risks that drive long-term harm.",
      "Administer prescribed glucose-lowering therapy with meal and illness coordination and monitor for drug-specific hypoglycemia, dehydration, gastrointestinal effects, infection, and renal limitations because each medication class has a different safety profile.",
      "Inspect feet and footwear, test protective sensation as ordered, and document wounds, pulses, temperature, and infection findings because neuropathy and vascular disease can allow painless injury to progress to ulcer or osteomyelitis.",
      "Trend glucose and individualized long-term markers along with blood pressure, lipids, kidney albumin and filtration testing, weight, and treatment tolerance because vascular and renal protection may improve even when glucose change is modest.",
      "Escalate immediately for altered consciousness, severe hypoglycemia, marked dehydration, persistent vomiting, rapid breathing or ketones, a hot swollen foot, spreading wound infection, chest pain, focal deficit, or sudden vision loss because metabolic and vascular complications are time critical."
    ], [
      "Severe hypoglycemia, confusion, seizure, or inability to self-treat",
      "Marked dehydration, persistent vomiting, ketones, or altered consciousness",
      "Hot swollen foot, spreading ulcer infection, tissue darkening, or systemic toxicity",
      "Chest pain, focal neurologic deficit, or sudden loss of vision"
    ], [
      "Teach how food, activity, sleep, stress, and each medicine affect glucose so the patient can interpret patterns rather than judge one isolated reading.",
      "Explain daily foot checks, preventive eye and kidney care, and cardiovascular-risk treatment because avoiding complications is broader than lowering glucose alone."
    ]),
    card("Hypernatremia", ["nhs-hypernatremia-2026"], [
      "Assess thirst and water access, mental status, volume signs, weight change, intake and losses, fever, diarrhea, polyuria, tube feeds, and sodium-containing therapy because hypernatremia usually reflects water deficit or impaired access rather than excess dietary salt.",
      "Obtain and trend serum sodium, glucose, creatinine, osmolality, urine volume, urine osmolality, and urine electrolytes as ordered because distinguishing renal water loss from poor intake or extrarenal loss determines replacement and cause treatment.",
      "Restore circulation first when shock is present, then give the prescribed free-water strategy and account for ongoing losses because brain adaptation makes both untreated hypertonicity and overly rapid correction dangerous.",
      "Perform frequent neurologic checks and monitor fluid balance, lung sounds, edema, urine output, and serial sodium response because seizures or cerebral swelling can signal severe disease or an unsafe treatment trajectory.",
      "Escalate immediately for seizure, rapidly declining consciousness, focal deficit, severe hypotension, anuria, rapidly changing sodium, new pulmonary edema, or inability to obtain ordered monitoring because correction requires urgent individualized supervision."
    ], [
      "Seizure, coma, rapidly worsening confusion, or focal neurologic change",
      "Shock, severe dehydration, or anuria",
      "Sodium changing faster than the prescribed plan or neurologic decline during correction",
      "New pulmonary edema, escalating oxygen need, or severe fluid overload"
    ], [
      "Explain that hypernatremia usually means too little body water relative to sodium, so treatment replaces the right fluid at a controlled pace rather than simply avoiding table salt.",
      "Teach caregivers to track drinking ability, urine volume, diarrhea, fever, and cognition in people who cannot independently obtain water because loss of access is a preventable trigger."
    ]),
    card("Hypocalcemia", ["sfe-hypocalcemia"], [
      "Assess perioral or finger tingling, cramps, tetany, voice or airway change, seizure, recent neck surgery, kidney disease, pancreatitis, transfusion, and medication exposure because the speed and cause of calcium decline shape its clinical danger.",
      "Obtain and interpret ionized or albumin-adjusted calcium with magnesium, phosphate, kidney function, vitamin D, parathyroid hormone, and electrocardiogram as ordered because low magnesium or altered protein binding can change both diagnosis and response.",
      "Administer prescribed oral or intravenous calcium with pump, line, and site verification and continuous rhythm monitoring for urgent replacement because rapid calcium shifts and extravasation can cause arrhythmia or tissue injury.",
      "Correct contributing magnesium deficiency and monitor calcium trend, QT interval, neuromuscular symptoms, airway, and treatment response because calcium may remain refractory until magnesium-dependent parathyroid signaling recovers.",
      "Escalate immediately for laryngospasm, stridor, seizure, sustained tetany, hypotension, prolonged-QT arrhythmia, or worsening symptoms during replacement because symptomatic hypocalcemia is an endocrine emergency."
    ], [
      "Stridor, laryngospasm, voice change, or inability to handle secretions",
      "Seizure, severe tetany, or progressive altered consciousness",
      "Prolonged-QT ventricular arrhythmia, syncope, or hypotension",
      "Worsening symptoms or painful intravenous-site swelling during calcium infusion"
    ], [
      "Teach the patient to report tingling, cramps, hand or facial spasm, voice change, or palpitations early because symptoms can precede severe neuromuscular or rhythm complications.",
      "Explain the prescribed calcium and vitamin D plan and follow-up testing because replacement without correcting magnesium, parathyroid, kidney, or absorption problems may not last."
    ]),
    card("Hypomagnesemia", ["rcpa-hypomagnesemia", "sfe-hypocalcemia"], [
      "Assess tremor, weakness, cramps, tetany, confusion, seizure, palpitations, diarrhea, alcohol use, poor intake, renal loss, and proton-pump, diuretic, or nephrotoxic drug exposure because magnesium depletion affects both nerve excitability and cardiac repolarization.",
      "Trend magnesium with potassium, calcium, kidney function, electrocardiogram, and ongoing gastrointestinal or urinary loss because refractory hypokalemia or hypocalcemia may not correct until magnesium is restored.",
      "Administer prescribed oral or intravenous magnesium at the ordered rate and reassess reflexes, breathing, pressure, rhythm, and infusion site because renal impairment or rapid replacement can reverse deficiency into magnesium toxicity.",
      "Maintain seizure and fall precautions when symptomatic and monitor QT interval and ventricular ectopy because magnesium deficiency increases neuromuscular irritability and risk for polymorphic ventricular arrhythmia.",
      "Escalate immediately for seizure, syncope, sustained ventricular arrhythmia, marked QT prolongation, severe tetany, respiratory depression during replacement, or rapidly worsening kidney function because monitored urgent correction or treatment of toxicity is required."
    ], [
      "Torsades-type or other sustained ventricular arrhythmia",
      "Seizure, severe tetany, syncope, or worsening confusion",
      "Respiratory depression, hypotension, or loss of reflexes during replacement",
      "Refractory low potassium or calcium with clinical deterioration"
    ], [
      "Teach the purpose and expected gastrointestinal effects of oral magnesium and ask the care team before changing the dose because diarrhea can worsen the very deficit being treated.",
      "Review alcohol, nutrition, diarrhea, and medication contributors with the patient because preventing recurrent loss is more durable than repeated replacement alone."
    ]),
    card("Addison disease", ["sfe-adrenal"], [
      "Assess fatigue, weight loss, nausea, abdominal pain, postural symptoms, skin change, salt craving, infection, vomiting, trauma, pregnancy, and steroid access because chronic adrenal insufficiency can decompensate when cortisol demand rises.",
      "Administer glucocorticoid and mineralocorticoid replacement exactly as prescribed and trend pressure, orthostasis, weight, sodium, potassium, glucose, and symptoms because inadequate replacement causes volume and metabolic instability while excess causes treatment harm.",
      "During illness or procedures, verify the written stress-dose plan, ability to retain oral medicine, emergency injection supply, and medical identification because vomiting or delayed dose escalation is a common pathway to adrenal crisis.",
      "If crisis is suspected, obtain ordered samples without delaying immediate hydrocortisone and isotonic fluid and monitor glucose, electrolytes, rhythm, urine output, and perfusion because untreated cortisol deficiency can produce refractory shock and hypoglycemia.",
      "Escalate immediately for persistent vomiting or diarrhea, hypotension, collapse, confusion, severe weakness, abdominal pain with shock, hypoglycemia, fever, or inability to take steroids because adrenal crisis treatment must begin before confirmatory results."
    ], [
      "Hypotension, collapse, confusion, or signs of shock",
      "Persistent vomiting or diarrhea preventing steroid absorption",
      "Severe hypoglycemia, weakness, or seizure",
      "Fever, major injury, labor, or procedure without an effective stress-dose plan"
    ], [
      "Teach sick-day dosing, when and how to use emergency injectable hydrocortisone, and when to call emergency services because oral medication may fail during vomiting or severe illness.",
      "Reinforce carrying steroid emergency identification and spare medication and never stopping long-term steroid replacement abruptly because the body cannot rapidly replace missing cortisol."
    ]),
    card("Hyperosmolar hyperglycemic state", ["ada-crises-2024"], [
      "Assess consciousness, airway protection, dehydration, pressure, temperature, infection, medication access, stroke or infarction symptoms, and fluid losses because HHS combines profound hypertonicity with a precipitating illness that may be clinically subtle.",
      "Begin prescribed isotonic fluid resuscitation and reassess pressure, perfusion, lung sounds, urine output, sodium, glucose, and calculated osmolality because restoring circulation is the first priority but heart or kidney disease limits fluid tolerance.",
      "Trend potassium, magnesium, phosphate, kidney function, glucose, osmolality, acid-base status, and rhythm before and during insulin therapy because insulin and rehydration shift electrolytes and can expose dangerous potassium depletion.",
      "Perform frequent neurologic checks and implement aspiration, fall, skin, and thrombosis precautions as indicated because hyperosmolality impairs consciousness, immobility causes injury, and gradual correction protects the brain.",
      "Escalate immediately for seizure, focal deficit, worsening consciousness, refractory hypotension, anuria, arrhythmia, rapidly changing osmolality or sodium, pulmonary edema, or severe potassium abnormality because cerebral, cardiac, renal, or treatment complications need urgent adjustment."
    ], [
      "Seizure, focal neurologic deficit, or worsening consciousness",
      "Shock, anuria, rising lactate, or rapidly worsening kidney function",
      "Serious potassium-related rhythm change or muscle weakness",
      "New pulmonary edema or unsafe sodium or osmolality trajectory during treatment"
    ], [
      "Explain that HHS often develops over days as high glucose pulls water into the urine, so rising thirst, urination, weakness, and confusion during illness need early glucose and hydration review.",
      "Before discharge, build a practical sick-day, medication, hydration, glucose, supply, and follow-up plan around the actual precipitant so recurrence prevention is more than a generic handout."
    ]),
    card("Diabetes insipidus", ["sfe-di", "nhs-hypernatremia-2026"], [
      "Measure urine volume, thirst, water access, weight, mental status, volume signs, serum sodium and osmolality, and urine concentration because excessive dilute urine can rapidly create hypernatremic dehydration when drinking is impaired.",
      "Verify the diagnosis, usual desmopressin formulation and schedule, recent doses, pituitary or kidney history, medications, and ability to self-administer because omitted or duplicated desmopressin can cause opposite life-threatening water disorders.",
      "Ensure continuous access to water when safe and replace intravascular volume before carefully correcting free-water deficit in decompensation because circulation takes priority while rapid sodium change can injure the brain.",
      "After prescribed desmopressin, trend urine output and concentration, fluid intake, sodium, weight, edema, headache, and cognition because the antidiuretic response can abruptly retain water and cause hyponatremia if intake or dosing is excessive.",
      "Escalate immediately for shock, inability to drink, rapidly rising sodium, extreme polyuria, oliguria after dosing with falling sodium, seizure, severe headache, vomiting, or declining consciousness because fluid and desmopressin require urgent coordinated adjustment."
    ], [
      "Shock, severe dehydration, or inability to access or swallow water",
      "Rapidly rising sodium with extreme dilute urine output",
      "Seizure, severe headache, vomiting, or declining consciousness",
      "Abrupt oliguria, weight gain, edema, or falling sodium after desmopressin"
    ], [
      "Teach exact desmopressin product, route, timing, storage, missed-dose instructions, and emergency backup because formulations are not casually interchangeable and omission can become dangerous quickly.",
      "Explain that central diabetes insipidus is now often called arginine-vasopressin deficiency and nephrogenic disease arginine-vasopressin resistance to distinguish both from diabetes mellitus; intense thirst with large dilute urine suggests under-replacement, while headache, nausea, weight gain, and low urine output can signal water retention."
    ]),
    card("Achalasia", ["acg-achalasia"], [
      "Assess progressive dysphagia to solids and liquids, regurgitation, nocturnal cough, aspiration, chest pain, weight loss, hydration, and meal strategies because failed lower-esophageal relaxation retains food and can compromise nutrition and lungs.",
      "Keep the patient upright for intake, use the prescribed texture and small-meal plan, and coordinate swallowing and nutrition assessment because gravity and individualized consistency reduce stasis while definitive therapy is arranged.",
      "Verify endoscopy, timed contrast study, and manometry plans and screen for rapid weight loss or late-onset symptoms because pseudoachalasia from obstruction or cancer must not be mistaken for primary motility disease.",
      "After dilation, myotomy, injection, or endoscopic myotomy, monitor chest and abdominal pain, fever, pulse, pressure, breathing, swallowing, subcutaneous air, and bleeding because perforation, mediastinal leak, aspiration, and reflux require early recognition.",
      "Escalate immediately for inability to handle secretions, choking with hypoxemia, severe new chest pain, crepitus, fever, tachycardia, hematemesis, rigid abdomen, or shock because obstruction, aspiration, perforation, or bleeding is time critical."
    ], [
      "Inability to swallow saliva or acute food impaction",
      "Choking, hypoxemia, fever, or respiratory distress suggesting aspiration",
      "Severe new chest pain, crepitus, fever, or tachycardia after a procedure",
      "Hematemesis, rigid abdomen, hypotension, or shock"
    ], [
      "Teach slow small meals, thorough chewing, upright eating, and remaining upright after meals because food depends more on gravity when esophageal propulsion and sphincter relaxation fail.",
      "Explain that treatment opens the sphincter but does not restore normal nerves, so recurrent dysphagia, regurgitation, weight loss, or new reflux still needs follow-up."
    ]),
    card("Cholelithiasis", ["sages-stones"], [
      "Assess right-upper-quadrant or epigastric pain timing, radiation, duration, fever, jaundice, vomiting, stool and urine color, pregnancy, and prior episodes because uncomplicated biliary colic must be separated from cholecystitis, duct obstruction, cholangitis, and pancreatitis.",
      "Trend temperature, pain, abdominal findings, hydration, bilirubin, liver enzymes, blood counts, and pancreatic enzymes with ordered ultrasound or duct imaging because migration or persistent obstruction changes urgency and treatment.",
      "Keep intake and analgesia aligned with the diagnostic and procedural plan, administer prescribed fluids and antiemetics, and reassess response because uncontrolled vomiting and inflammation can cause dehydration while procedures may require fasting.",
      "Prepare for endoscopic duct clearance or cholecystectomy when ordered and monitor afterward for bleeding, infection, bile leak, breathing difficulty, and return of bowel function because source removal prevents recurrent obstruction but introduces postoperative risks.",
      "Escalate immediately for fever with jaundice, hypotension, confusion, persistent severe pain, guarding, repeated vomiting, rising bilirubin, pancreatitis signs, or sepsis because cholangitis or another complicated obstruction needs urgent drainage and treatment."
    ], [
      "Fever, jaundice, right-upper-quadrant pain, hypotension, or confusion",
      "Persistent severe pain with guarding, rigidity, or peritoneal signs",
      "Repeated vomiting, dehydration, or pain radiating to the back with pancreatitis concern",
      "Worsening jaundice, dark urine, pale stool, or evidence of bile-duct obstruction"
    ], [
      "Teach that a stone may cause no symptoms until it blocks a duct; persistent pain, fever, jaundice, or repeated vomiting is not ordinary indigestion and needs urgent assessment.",
      "Review the individualized post-procedure diet, wound care, activity, and follow-up plan rather than promising that avoiding one food will prevent all future biliary events."
    ]),
    card("Hepatitis A", ["cdc-hepa"], [
      "Assess exposure timing, travel or outbreak link, food and water risk, close contacts, nausea, hydration, jaundice, pruritus, abdominal pain, bleeding, medication use, pregnancy, and chronic liver disease because severity and postexposure decisions depend on host and exposure factors.",
      "Trend mental status, intake, vomiting, glucose, bilirubin, aminotransferases, coagulation, and hydration because most infections resolve with supportive care but acute liver failure can begin with hypoglycemia, coagulopathy, or encephalopathy.",
      "Provide fluids, nutrition, antiemetic and skin care as prescribed and review all medicines, alcohol, and supplements for liver risk because the inflamed liver has less reserve for additional injury.",
      "Use meticulous hand hygiene and safe handling of stool, food, and shared bathroom surfaces and coordinate public-health reporting and contact evaluation because fecal-oral shedding can spread infection before jaundice appears.",
      "Escalate immediately for confusion, unusual sleepiness, bleeding, persistent hypoglycemia, severe dehydration, intractable vomiting, rapidly worsening coagulation, or shock because fulminant hepatitis or volume failure requires hospital-level care."
    ], [
      "Confusion, marked drowsiness, asterixis, or other encephalopathy",
      "Spontaneous bleeding, rapidly worsening coagulation, or severe bruising",
      "Persistent hypoglycemia, intractable vomiting, or severe dehydration",
      "Hypotension, oliguria, or rapidly worsening jaundice with systemic illness"
    ], [
      "Teach handwashing after toileting and before food preparation and avoiding food service for the period directed by public health because hepatitis A spreads through microscopic fecal contamination.",
      "Explain that hepatitis A does not become chronic, but contacts may need prompt vaccine or immune globulin, so reporting the exposure early protects others."
    ]),
    card("Crohn disease", ["acg-crohn-2025"], [
      "Assess stool frequency and blood, abdominal pain and distention, fever, weight, oral ulcers, perianal drainage, fistula signs, hydration, nutrition, and extraintestinal symptoms because Crohn inflammation can be patchy, transmural, and complicated by abscess or obstruction.",
      "Trend intake and output, weight, blood counts, inflammatory markers, electrolytes, albumin, iron and vitamin status, stool infection testing, and ordered imaging because symptoms alone do not distinguish active inflammation from infection, stricture, or malabsorption.",
      "Administer prescribed corticosteroid, immune, biologic, nutrition, and symptom therapy after infection screening and monitor fever, blood counts, liver tests, skin, and infusion reactions because controlling inflammation prevents damage while immunosuppression changes infection risk.",
      "Protect perianal skin, measure fistula or ostomy output, support pain control and nutrition, and coordinate surgery or wound specialists because drainage and high output cause skin injury, dehydration, and recurrent infection.",
      "Escalate immediately for severe distention, persistent vomiting, absent stool or gas, guarding, high fever, hypotension, rapidly increasing bloody stool, painful fluctuant perianal swelling, or sepsis because obstruction, perforation, abscess, or major hemorrhage needs urgent intervention."
    ], [
      "Severe distention, persistent vomiting, or inability to pass stool or gas",
      "Guarding, rebound pain, rigid abdomen, or free-air concern",
      "High fever, hypotension, painful perianal swelling, or sepsis",
      "Rapidly increasing bloody stool, syncope, or falling hemoglobin"
    ], [
      "Teach medication purpose, infection precautions, and the monitoring plan because stopping maintenance therapy when symptoms improve can permit silent inflammation and structural damage.",
      "Use an individualized nutrition and hydration plan instead of a universal Crohn diet, and track foods only when they consistently affect symptoms or obstruction risk."
    ]),
    card("Ulcerative colitis", ["acg-uc-2025"], [
      "Measure stool frequency, visible blood, urgency, nocturnal stool, pain, distention, temperature, pulse, hydration, and weight because these bedside changes help identify acute severe colitis and response to treatment.",
      "Obtain ordered stool infection testing and trend blood counts, electrolytes, albumin, inflammatory markers, abdominal findings, and imaging because infection can mimic a flare and severe inflammation can cause anemia, toxic dilation, and perforation.",
      "Administer prescribed anti-inflammatory, corticosteroid, immune, or biologic therapy with infection and toxicity monitoring because mucosal healing lowers relapse and cancer risk while treatment can suppress host defenses.",
      "Maintain fluid, electrolyte, nutrition, skin, and venous-thrombosis prevention plans and clarify antimotility medicines during severe disease because frequent bloody diarrhea depletes volume and immobility and inflammation increase clot risk.",
      "Escalate immediately for increasing distention, severe tenderness, fever, tachycardia, hypotension, reduced bowel sounds, abrupt decrease in stool with worsening illness, heavy bleeding, or confusion because toxic megacolon, perforation, or hemorrhage may require rescue therapy or colectomy."
    ], [
      "Increasing abdominal distention with fever, tachycardia, or reduced bowel sounds",
      "Guarding, rebound tenderness, rigid abdomen, or sudden severe pain",
      "Heavy rectal bleeding, syncope, hypotension, or falling hemoglobin",
      "Worsening systemic illness despite prescribed acute-colitis therapy"
    ], [
      "Teach the patient to track stool number, blood, nighttime symptoms, fever, and medication use because a trend communicates severity better than saying the flare feels worse.",
      "Explain the need for maintenance treatment and scheduled colon surveillance because symptoms may settle before microscopic inflammation and long-term cancer risk are controlled."
    ]),
    card("Hepatitis C", ["cdc-hepc"], [
      "Confirm active infection with hepatitis C RNA and assess prior treatment, fibrosis or cirrhosis, pregnancy, kidney function, hepatitis B and HIV status, alcohol, medicines, and supplements because antibody alone does not prove current infection and comorbidity changes the plan.",
      "Administer the prescribed direct-acting antiviral regimen exactly and perform a full interaction and adherence review because short oral therapy can cure infection but missed doses or interacting drugs can reduce exposure or cause toxicity.",
      "Trend treatment tolerance and ordered liver, kidney, viral, and hepatitis B markers because reactivation, decompensation, or drug toxicity requires action even when hepatitis C symptoms are absent.",
      "Assess ascites, edema, bleeding, cognition, nutrition, and portal-hypertension or liver-cancer surveillance needs when advanced fibrosis is present because viral cure does not erase established cirrhosis or its complications.",
      "Escalate immediately for confusion, hematemesis or melena, rapidly increasing ascites, jaundice with systemic decline, severe drug reaction, oliguria, or hepatitis B reactivation findings because liver decompensation or treatment complications need urgent review."
    ], [
      "Confusion, asterixis, or declining consciousness",
      "Hematemesis, melena, syncope, or rapidly falling hemoglobin",
      "Rapidly worsening jaundice, ascites, edema, or kidney function",
      "Severe rash, facial swelling, breathing difficulty, or suspected hepatitis B reactivation"
    ], [
      "Explain that modern oral treatment cures most hepatitis C, but the cure must be confirmed with follow-up RNA testing and reinfection remains possible after a new exposure.",
      "Teach not to share injection or snorting equipment, razors, or toothbrushes and to review alcohol and all medicines with the liver team because prevention and liver protection continue during and after treatment."
    ]),
    card("Cirrhosis", ["aasld-cirrhosis"], [
      "Assess cognition, bleeding, jaundice, ascites, edema, respiratory effort, infection symptoms, nutrition, muscle loss, stool pattern, urine output, alcohol or drug exposure, and medication adherence because decompensation often involves several linked organ problems.",
      "Trend daily weight, abdominal girth, strict intake and output, pressure, blood counts, sodium, potassium, creatinine, bilirubin, albumin, and coagulation as ordered because ascites therapy can improve congestion while precipitating electrolyte or kidney injury.",
      "Administer prescribed diuretics, bowel therapy, portal-pressure therapy, antimicrobials, vitamins, and nutrition with hold parameters and response checks because medicines target different complications and can worsen hypotension, renal function, or cognition if not individualized.",
      "Screen every admission or deterioration for infection and prepare prompt diagnostic paracentesis on a nonelective admission with cirrhosis and ascites, with new or worsening ascites, or when infection or kidney injury is suspected because spontaneous bacterial peritonitis may present with subtle pain, kidney decline, or encephalopathy.",
      "Escalate immediately for hematemesis or melena, confusion, fever with ascites, hypotension, rapidly worsening jaundice, oliguria, severe dyspnea, or tense painful abdomen because variceal bleeding, encephalopathy, infection, hepatorenal syndrome, or respiratory compromise is life threatening."
    ], [
      "Hematemesis, melena, syncope, or hemodynamic instability",
      "New confusion, marked drowsiness, asterixis, or inability to protect the airway",
      "Fever, abdominal pain, hypotension, or kidney decline with ascites",
      "Oliguria, rapidly worsening jaundice, tense ascites, or respiratory compromise"
    ], [
      "Teach daily weight and swelling, stool and cognition changes, bleeding and infection signs, and the exact medicine plan because early decompensation can be subtle and medicines are not interchangeable.",
      "Explain complete alcohol avoidance, nutrition and sodium guidance, vaccination, cancer surveillance, and transplant evaluation when appropriate because cirrhosis care combines cause treatment with complication prevention."
    ]),
    card("Hepatic encephalopathy", ["aasld-he", "aasld-cirrhosis"], [
      "Establish the patient's cognitive baseline and assess attention, orientation, sleep pattern, speech, asterixis, gait, consciousness, and airway protection because encephalopathy ranges from subtle executive change to coma.",
      "Search promptly for gastrointestinal bleeding, infection, constipation, dehydration, kidney injury, electrolyte disturbance, sedatives, missed therapy, and portosystemic shunt issues because correcting the precipitant is as important as lowering intestinal toxin production.",
      "Administer prescribed lactulose and record mental status and actual stool response rather than relying on ammonia alone because therapy is titrated to clinical recovery and excessive diarrhea can worsen dehydration and electrolytes.",
      "Give prescribed rifaximin or other adjunct therapy and monitor swallowing, aspiration risk, skin, fluid balance, sodium, potassium, glucose, and kidney function because recurrent encephalopathy and its treatment create safety and metabolic complications.",
      "Escalate immediately for inability to protect the airway, rapid decline in consciousness, seizure, focal deficit, fever, hypotension, active gastrointestinal bleeding, severe agitation, or no response to initial therapy because another neurologic emergency or severe precipitant may be present."
    ], [
      "Inability to protect the airway or rapidly declining consciousness",
      "Seizure, focal neurologic deficit, unequal pupils, or severe new headache",
      "Fever, hypotension, hypoglycemia, or suspected sepsis",
      "Active gastrointestinal bleeding or failure to improve with precipitant treatment"
    ], [
      "Teach family members to notice reversed sleep, slowed thinking, handwriting or personality change, missed bowel movements, and medication changes because they may recognize recurrence before the patient does.",
      "Explain that ammonia contributes to the syndrome but a single blood value does not replace the neurologic examination or the search for bleeding, infection, constipation, dehydration, and medicine effects."
    ]),
    card("Pancreatitis", ["acg-pancreatitis-2024"], [
      "Assess epigastric pain and radiation, vomiting, abdominal findings, alcohol and gallstone history, recent procedures, medicines, triglyceride risk, and hemodynamics because cause and early organ dysfunction guide urgent treatment.",
      "Trend pressure, pulse, oxygenation, strict intake and output, urine output, blood counts, electrolytes, kidney function, glucose, liver tests, and respiratory findings because third spacing and systemic inflammation can cause renal, pulmonary, and circulatory failure.",
      "Administer goal-directed crystalloid, analgesia, antiemetics, and early enteral nutrition as prescribed with repeated volume and tolerance assessment because both untreated hypovolemia and indiscriminate fluid excess worsen outcomes.",
      "Monitor for fever, increasing pain, jaundice, ileus, hypoxemia, falling hemoglobin, persistent organ dysfunction, and ordered imaging findings because cholangitis, necrosis, infection, bleeding, pseudocyst, or abdominal pressure may change management.",
      "Escalate immediately for shock, increasing oxygen need, oliguria, confusion, rigid abdomen, gastrointestinal bleeding, fever with jaundice, or persistent organ failure because critical care, urgent biliary drainage, or procedural source management may be required."
    ], [
      "Hypotension, rising lactate, oliguria, or rapidly worsening kidney function",
      "Increasing oxygen requirement, respiratory distress, or pulmonary edema",
      "Fever with jaundice, confusion, or biliary obstruction",
      "Rigid abdomen, falling hemoglobin, gastrointestinal bleeding, or persistent organ failure"
    ], [
      "Teach the cause-specific prevention plan, such as gallstone treatment, alcohol abstinence, triglyceride care, or medication review, because recurrence prevention depends on why the pancreas became inflamed.",
      "Explain that early feeding is often beneficial when tolerated; prolonged fasting is not automatically required and nutrition decisions follow disease severity and gut function."
    ]),
    card("Peritonitis", ["idsa-intraabdominal-2024", "aasld-cirrhosis"], [
      "Assess pain onset and location, guarding, rebound, distention, bowel sounds, fever, vomiting, surgical or dialysis history, ascites, wounds, drains, and hemodynamics because perforation, postoperative leak, dialysis infection, and spontaneous bacterial peritonitis require different source control.",
      "Keep the patient fasting when urgent procedures are possible, establish access, obtain ordered blood and fluid cultures and imaging without delaying unstable care, and begin prescribed fluids and antimicrobials because early treatment limits sepsis while samples guide narrowing.",
      "Trend pain and abdominal findings, temperature, pressure, lactate, urine output, blood counts, kidney and liver function, glucose, drain or dialysis effluent, and mental status because worsening peritoneal inflammation can progress quickly to shock and organ failure.",
      "Prepare for surgical, interventional, hepatology, or dialysis-team source management because antibiotics cannot reliably cure an uncontrolled perforation, abscess, infected device, or ongoing leak.",
      "Escalate immediately for rigid abdomen, rapidly increasing pain or distention, hypotension, confusion, oliguria, rising lactate, free-air concern, feculent drainage, or worsening sepsis because urgent source control and critical-care support may be needed."
    ], [
      "Rigid abdomen, rebound tenderness, or rapidly escalating pain",
      "Hypotension, confusion, oliguria, or rising lactate",
      "Free air, feculent drainage, wound dehiscence, or suspected anastomotic leak",
      "Cloudy dialysis effluent or fever and abdominal pain in a patient with ascites"
    ], [
      "Teach patients with ascites or peritoneal dialysis to report new pain, fever, confusion, cloudy effluent, or reduced output immediately because peritoneal infection may begin subtly.",
      "Explain that completing antibiotics matters, but follow-up must also confirm that the leak, abscess, infected catheter, or other source has been controlled."
    ]),
    card("Ovarian cancer", ["nci-ovarian"], [
      "Assess abdominal or pelvic pain, bloating, early satiety, bowel and bladder change, vaginal bleeding, weight change, functional status, and family cancer history because an enlarging pelvic mass and peritoneal spread often cause pressure and fluid symptoms before a discrete emergency occurs.",
      "After cytoreductive surgery, trend vital signs, pain, abdominal findings, urine output, bowel recovery, wound and drain output, blood counts, and mobility because hemorrhage, ileus, urinary or bowel injury, infection, and venous thromboembolism can interrupt recovery.",
      "During systemic treatment, verify the regimen and access device and monitor blood counts, renal and liver function, neuropathy, nausea, hydration, infection, and hypersensitivity because marrow suppression, organ toxicity, and infusion reactions require treatment-specific action.",
      "Measure weight, abdominal girth, respiratory effort, intake, and output when ascites or pleural fluid is present and coordinate prescribed drainage and symptom support because fluid accumulation can impair eating, mobility, and ventilation even without rapid tumor growth.",
      "Escalate immediately for a rigid or rapidly distending abdomen, persistent vomiting with absent stool or flatus, acute dyspnea or hypoxemia, heavy bleeding, fever with systemic illness, unilateral leg swelling, or sudden chest pain because obstruction, perforation, infection, hemorrhage, or thromboembolism needs urgent evaluation."
    ], [
      "Rigid abdomen, rapidly increasing distention, or persistent vomiting with obstipation",
      "Sudden dyspnea, hypoxemia, chest pain, or unilateral leg swelling",
      "Heavy vaginal or gastrointestinal bleeding, syncope, or hemodynamic decline",
      "Fever with systemic illness during treatment or a painful erythematous access device"
    ], [
      "Teach the patient to report a persistent pattern of bloating, early satiety, pelvic pressure, urinary change, or increasing abdominal size because trends are more informative than any single nonspecific symptom.",
      "Explain why tumor and inherited-risk testing may be offered: results can guide targeted treatment and may identify relatives who would benefit from genetic counseling."
    ]),
    card("Stomach cancer", ["nci-gastric"], [
      "Assess early satiety, epigastric pain, dysphagia, vomiting, hematemesis or melena, fatigue, weight loss, hydration, and nutrition because tumor location can produce occult bleeding, outlet obstruction, and progressive malnutrition.",
      "Before and after gastrectomy, trend hemodynamics, abdominal findings, urine output, wound and drain output, bowel recovery, respiratory status, and pain because hemorrhage, anastomotic leak, infection, ileus, and pulmonary complications require early recognition.",
      "Record meal tolerance, weight, stool pattern, glucose-related symptoms, and ordered iron, vitamin B12, folate, calcium, and vitamin D markers because reduced stomach capacity and altered digestion can cause dumping, anemia, bone risk, and long-term micronutrient deficiency.",
      "During systemic or radiation treatment, verify the regimen and monitor blood counts, renal and liver function, hydration, mucositis, neuropathy, nausea, diarrhea, infection, and access-device findings because toxicity can rapidly worsen nutritional and functional reserve.",
      "Escalate immediately for hematemesis or melena with weakness, persistent vomiting or inability to swallow, a rigid abdomen, fever with worsening postoperative pain, feculent or bilious drainage, dyspnea, or shock because bleeding, obstruction, perforation, or anastomotic leak needs urgent source management."
    ], [
      "Hematemesis, melena, syncope, or hemodynamic instability",
      "Persistent vomiting, inability to swallow, or signs of gastric outlet obstruction",
      "Rigid abdomen, escalating postoperative pain, fever, or abnormal drain contents",
      "New dyspnea, hypoxemia, confusion, oliguria, or other organ dysfunction"
    ], [
      "Teach smaller, slower meals and the individualized plan for fluids and concentrated sugars after surgery because altered gastric emptying can trigger cramping, diarrhea, dizziness, and late glucose symptoms.",
      "Explain that lifelong nutrition follow-up may be needed after gastrectomy because eating more food alone cannot correct every iron, vitamin B12, calcium, or vitamin D deficiency."
    ]),
    card("Testicular cancer", ["nci-testicular"], [
      "Assess a painless testicular mass, heaviness, swelling, pain, contralateral findings, gynecomastia, abdominal or back symptoms, respiratory symptoms, and baseline fertility goals because local findings, metastatic symptoms, and life plans all influence urgent staging and treatment preparation.",
      "Protect the diagnostic pathway by preparing for scrotal ultrasound, serum AFP, beta-hCG, and LDH testing and inguinal orchiectomy rather than transscrotal biopsy because disrupting scrotal lymphatic planes can complicate staging and local control.",
      "After orchiectomy, monitor pain, wound and scrotal swelling, bleeding, infection, mobility, body-image concerns, pathology follow-up, and marker trends because recovery and subsequent surveillance depend on both healing and the tumor's exact histology and stage.",
      "During systemic treatment, monitor blood counts, renal function, electrolytes, hearing, neuropathy, respiratory symptoms, thromboembolism, nausea, hydration, and infection because cisplatin-based therapy and agents such as bleomycin have distinctive renal, auditory, neurologic, pulmonary, and marrow toxicities.",
      "Escalate immediately for sudden severe scrotal pain, acute dyspnea or new cough during treatment, fever with systemic illness, chest pain, unilateral leg swelling, uncontrolled vomiting, oliguria, or rapidly worsening neurologic symptoms because torsion, pulmonary toxicity, infection, thromboembolism, dehydration, or treatment toxicity needs urgent evaluation."
    ], [
      "Sudden severe scrotal pain, a high-riding testis, or acute nausea with scrotal symptoms",
      "New cough, dyspnea, hypoxemia, or chest pain during systemic treatment",
      "Fever with systemic illness or rapidly worsening infection symptoms during treatment",
      "Unilateral leg swelling, oliguria, severe vomiting, or new major neurologic change"
    ], [
      "Explain sperm banking and fertility counseling before treatment when feasible because orchiectomy, chemotherapy, radiation, and the cancer itself can affect future fertility.",
      "Teach the exact tumor-marker and imaging surveillance schedule because a patient may feel well while a marker trend or scan identifies recurrence early."
    ]),
    card("Cervical cancer", ["nci-cervical"], [
      "Assess vaginal bleeding and discharge, pelvic or back pain, urinary and bowel change, leg swelling, weight loss, pregnancy possibility, sexual health, and screening history because local invasion can affect the bladder, ureters, bowel, nerves, and pelvic vessels.",
      "Quantify bleeding, trend hemodynamics and blood counts, and monitor urine output and renal function because friable tumor can hemorrhage and ureteral obstruction may silently reduce kidney function before pain becomes prominent.",
      "During surgery, chemoradiation, or brachytherapy, verify the treatment plan and monitor skin and mucosa, blood counts, renal function, hydration, nausea, diarrhea, urinary symptoms, infection, pain, and device precautions because combined pelvic treatment can injure marrow, bowel, bladder, and surrounding tissue.",
      "Assess for fistula symptoms, hydronephrosis, lymphedema, neuropathy, sexual dysfunction, fertility concerns, and psychosocial distress across follow-up because delayed pelvic effects and recurrence can impair function long after acute therapy ends.",
      "Escalate immediately for uncontrolled vaginal bleeding, syncope, oliguria with flank or pelvic pain, fecal or urinary leakage through the vagina, fever with pelvic pain, rigid abdomen, sudden dyspnea, or unilateral leg swelling because hemorrhage, obstruction, fistula, infection, perforation, or thromboembolism needs urgent care."
    ], [
      "Heavy vaginal bleeding, large clots, syncope, or hemodynamic decline",
      "Oliguria, anuria, rising renal markers, or flank pain suggesting urinary obstruction",
      "Fever with pelvic pain, foul discharge, rigid abdomen, or suspected fistula",
      "Sudden dyspnea, chest pain, hypoxemia, or unilateral leg swelling"
    ], [
      "Teach the patient to report new bleeding, urinary or bowel leakage, leg swelling, pelvic pain, or treatment-site changes rather than waiting for the next visit because obstruction, infection, and fistula can progress between appointments.",
      "Explain fertility, menopause, vaginal health, and sexual-function options before treatment when possible because early planning preserves choices and makes later rehabilitation more effective."
    ]),
    card("Colorectal cancer", ["nci-colon"], [
      "Assess stool caliber and frequency, visible or occult bleeding, abdominal pain and distention, vomiting, fatigue, weight loss, nutrition, family history, and functional status because tumor location determines whether anemia, altered bowel function, or obstruction dominates the presentation.",
      "Before and after resection, trend hemodynamics, pain, abdominal findings, urine output, bowel recovery, wound and drain output, respiratory status, and mobility because hemorrhage, ileus, anastomotic leak, infection, and venous thromboembolism require prompt action.",
      "When an ostomy is created, assess color, perfusion, edema, output, peristomal skin, hydration, and the patient's ability to manage the appliance because ischemia, retraction, obstruction, high output, and skin injury can undermine recovery.",
      "During systemic treatment, verify the regimen and monitor blood counts, renal and liver function, hydration, diarrhea, mucositis, neuropathy, hand-foot or skin effects, infection, and access-device findings because toxicity patterns differ and can require treatment adjustment.",
      "Escalate immediately for persistent vomiting with absent stool or flatus, a rigid abdomen, severe increasing postoperative pain, fever, feculent drain output, heavy rectal bleeding, dusky or black stoma, shock, sudden dyspnea, or unilateral leg swelling because obstruction, perforation, leak, hemorrhage, ischemia, sepsis, or thromboembolism needs urgent evaluation."
    ], [
      "Persistent vomiting, obstipation, rapidly increasing distention, or a rigid abdomen",
      "Fever, escalating postoperative pain, feculent drainage, or hemodynamic decline",
      "Heavy rectal or ostomy bleeding, syncope, or a dusky or black stoma",
      "Sudden dyspnea, chest pain, hypoxemia, or unilateral leg swelling"
    ], [
      "Teach bowel and ostomy output patterns, hydration, skin care, and the exact symptoms that require a same-day call because a trend away from the new baseline often identifies obstruction or dehydration early.",
      "Explain that surveillance may include visits, carcinoembryonic antigen testing, imaging, and colonoscopy because each method detects a different pattern of recurrence or a new bowel lesion."
    ]),
    card("Hemophilia", ["wfh-hemophilia"], [
      "Identify hemophilia type and severity, usual factor product, inhibitor history, prophylaxis schedule, venous access, home-treatment plan, and the time, mechanism, and location of bleeding because treatment choice and dose depend on the missing factor and prior response.",
      "For suspected head, neck, chest, abdominal, gastrointestinal, major muscle, or other serious bleeding, activate the hemophilia plan and administer prescribed factor replacement without waiting for imaging because bleeding can expand and cause irreversible compression before tests are completed.",
      "Perform focused neurologic, airway, abdominal, joint, limb-perfusion, pain, swelling, range-of-motion, skin, urine, and stool assessments and trend blood counts and factor response as ordered because occult bleeding, compartment pressure, and inadequate hemostasis may first appear as a changing examination.",
      "Coordinate factor coverage before invasive procedures and avoid intramuscular injections, unnecessary arterial puncture, rectal instrumentation, aspirin, and nonsteroidal anti-inflammatory drugs unless the specialist explicitly directs otherwise because tissue trauma and platelet inhibition add avoidable bleeding risk.",
      "Escalate immediately for any head injury, severe headache, vomiting, altered consciousness, neck or tongue swelling, dyspnea, chest or abdominal pain, hematemesis, melena, hematuria, rapidly expanding muscle swelling, neurovascular change, or bleeding that continues after factor because intracranial, airway, visceral, compartment, or inhibitor-related bleeding is an emergency."
    ], [
      "Any head injury, severe headache, vomiting, confusion, seizure, or focal neurologic change",
      "Neck or tongue swelling, voice change, dysphagia, dyspnea, or chest symptoms",
      "Severe abdominal or back pain, hematemesis, melena, hematuria, or hemodynamic decline",
      "Rapidly expanding muscle or joint swelling, neurovascular compromise, or bleeding despite factor"
    ], [
      "Teach the patient to carry the exact diagnosis, inhibitor status, factor product, dose plan, and treatment-center contact because emergency clinicians must replace the correct factor without delay.",
      "Explain that early home treatment and safe activity protect joints, while regular specialist review checks prophylaxis, inhibitors, dental and procedure planning, and long-term musculoskeletal health."
    ]),
    card("Sickle cell crisis", ["ash-sickle-pain"], [
      "Assess pain onset, location, prior effective regimen, temperature, oxygenation, respiratory and neurologic findings, hydration, urine output, pregnancy status, and possible triggers without stigmatizing assumptions because vaso-occlusive pain can coexist with infection, acute chest syndrome, stroke, sequestration, or organ ischemia.",
      "For vaso-occlusive pain, start the individualized analgesic plan promptly, reassess pain, sedation, respiratory status, nausea, pruritus, and function frequently, and add prescribed nonopioid and supportive measures because rapid multimodal treatment relieves suffering while surveillance limits medication harm.",
      "Provide oral or intravenous fluid only to correct deficit and maintain euvolemia, and give oxygen for documented hypoxemia rather than routinely because dehydration promotes sickling but excessive fluid can worsen pulmonary edema and acute chest syndrome.",
      "Encourage prescribed incentive spirometry and mobility when safe, and trend temperature, lung findings, oxygenation, blood counts, reticulocytes, bilirubin, renal function, and cultures or imaging when indicated because atelectasis, infection, hemolysis, and evolving acute chest syndrome may emerge after pain begins.",
      "Escalate immediately for new chest pain, cough, fever, hypoxemia, increasing oxygen need, focal neurologic change, seizure, priapism, rapidly enlarging spleen with weakness, severe anemia, oliguria, or uncontrolled pain with physiologic decline because acute chest syndrome, stroke, sequestration, prolonged ischemia, kidney injury, or another emergency needs urgent disease-specific treatment."
    ], [
      "New chest pain, cough, fever, hypoxemia, or increasing oxygen requirement",
      "Focal weakness, speech or vision change, seizure, severe headache, or altered consciousness",
      "Priapism, rapidly enlarging spleen with weakness, or a sudden major hemoglobin decline",
      "Oliguria, shock, severe abdominal pain, or uncontrolled pain with systemic deterioration"
    ], [
      "Teach hydration during heat, illness, exercise, and travel, routine vaccinations and preventive care, and the personal fever plan because infection and physiologic stress can trigger life-threatening complications.",
      "Explain that new chest, neurologic, abdominal, or genital symptoms are not simply more pain; they can identify organ emergencies that require immediate assessment."
    ]),
    card("Lymphoma", ["nci-hodgkin", "nci-nhl"], [
      "Assess node location and growth, fever, drenching night sweats, weight loss, pruritus, fatigue, pain, abdominal fullness, respiratory or neurologic symptoms, infection exposure, and functional status because histologic subtype and the distribution of disease determine both urgency and treatment.",
      "Protect the diagnostic pathway by coordinating an adequate tissue biopsy, pathology, immunophenotyping, staging studies, and baseline organ testing because lymphoma cannot be treated safely from node size or imaging appearance alone.",
      "Before and during treatment, trend blood counts, renal and liver function, electrolytes, uric acid, hydration, urine output, weight, cardiac and pulmonary findings, neuropathy, fertility concerns, and access-device status because marrow suppression, tumor lysis, organ toxicity, and infection can develop quickly.",
      "Assess for facial or neck swelling, distended chest veins, stridor, dyspnea, new back pain, weakness, sensory change, bladder or bowel dysfunction, and rapidly increasing abdominal distention because bulky lymphoma can compress the airway, great veins, spinal cord, ureters, or bowel.",
      "Escalate immediately for airway symptoms, superior vena cava findings, focal neurologic deficit or sphincter change, fever with systemic illness during treatment, oliguria with arrhythmia or electrolyte change, severe bleeding, or shock because compression, neutropenic sepsis, tumor lysis, cytopenia, or organ failure requires urgent intervention."
    ], [
      "Stridor, acute dyspnea, facial or neck swelling, or distended chest veins",
      "New back pain with weakness, numbness, gait change, or bladder or bowel dysfunction",
      "Fever with systemic illness, hypotension, confusion, or rapidly progressive infection during treatment",
      "Oliguria, arrhythmia, seizure, severe electrolyte change, bleeding, or shock"
    ], [
      "Teach the patient to record fever, drenching sweats, weight change, node growth, infection symptoms, and new pressure symptoms because trends help separate treatment effects, infection, and possible progression.",
      "Explain why the exact biopsy subtype matters: Hodgkin and the many non-Hodgkin lymphomas can look similar to a patient but have different biology, treatments, and surveillance plans."
    ]),
    card("Febrile neutropenia", ["nccn-infections-2024"], [
      "Treat any fever that meets the patient's oncology emergency plan as time-sensitive: assess airway, breathing, circulation, mental status, perfusion, recent treatment, prophylaxis, allergies, access devices, and prior resistant organisms because neutropenia can blunt local signs while bloodstream infection advances rapidly.",
      "Obtain ordered blood cultures from peripheral and appropriate catheter sites plus focused specimens and imaging without delaying prescribed broad empiric antimicrobials because early treatment is lifesaving and microbiology later permits safer narrowing.",
      "Inspect the mouth, skin folds, perineum, lungs, abdomen, wounds, and every catheter site gently; avoid rectal temperatures, suppositories, enemas, and unnecessary invasive procedures because mucosal injury can introduce organisms and an obvious source may be absent.",
      "Trend temperature, pressure, pulse, oxygenation, mental status, urine output, lactate when ordered, blood counts, renal and liver function, electrolytes, cultures, and antimicrobial response because sepsis, organ dysfunction, and drug toxicity can evolve even after therapy starts.",
      "Escalate immediately for hypotension, confusion, rigors, respiratory distress, hypoxemia, oliguria, rising lactate, severe abdominal pain, rapidly spreading skin change, catheter-site inflammation with systemic illness, or clinical worsening after antimicrobials because septic shock, neutropenic enterocolitis, invasive infection, or an uncontrolled source needs critical-care and specialist action."
    ], [
      "Hypotension, confusion, mottling, rigors, oliguria, or rising lactate",
      "Respiratory distress, hypoxemia, pleuritic pain, or rapidly worsening lung findings",
      "Severe abdominal pain, distention, diarrhea, guarding, or gastrointestinal bleeding",
      "Rapidly spreading skin change, painful catheter findings, or deterioration after antimicrobials"
    ], [
      "Teach the patient to use the oncology team's thermometer and fever instructions and to call before taking a fever-reducing medicine because masking fever can delay the emergency assessment.",
      "Explain that clean hands, oral and catheter care, food-safety guidance, and exposure precautions reduce risk, but they do not replace urgent evaluation when fever or systemic illness appears."
    ]),
    card("Von Willebrand disease", ["ash-vwd"], [
      "Confirm the von Willebrand disease subtype, baseline and recent bleeding pattern, prior desmopressin or concentrate response, menstrual and obstetric history, current medicines, and the planned procedure because treatment differs by subtype, bleeding site, and documented response.",
      "Quantify mucosal, menstrual, gastrointestinal, postpartum, wound, or procedure-related bleeding and trend hemodynamics, blood counts, iron status, and ordered von Willebrand factor and factor VIII measures because visible blood alone can underestimate cumulative loss and hemostatic response.",
      "Administer prescribed desmopressin, von Willebrand factor concentrate, or antifibrinolytic therapy and document timing and response because each treatment addresses a different mechanism and not every subtype responds safely to desmopressin.",
      "When desmopressin is used, follow the prescribed fluid plan and monitor sodium, headache, nausea, confusion, and seizure risk; avoid aspirin and nonsteroidal anti-inflammatory drugs unless specifically directed because water retention and platelet inhibition create preventable complications.",
      "Escalate immediately for head injury or neurologic change, airway or neck bleeding, hematemesis or melena, hemodynamic decline, uncontrolled procedural or postpartum hemorrhage, rapidly expanding swelling, or confusion or seizure after desmopressin because intracranial, airway, major internal bleeding, or acute hyponatremia is an emergency."
    ], [
      "Head injury, severe headache, vomiting, confusion, seizure, or focal neurologic change",
      "Tongue or neck swelling, voice change, dysphagia, dyspnea, or airway bleeding",
      "Hematemesis, melena, syncope, rapidly falling hemoglobin, or hemodynamic instability",
      "Uncontrolled surgical or postpartum bleeding, expanding hematoma, or symptoms after desmopressin"
    ], [
      "Teach the patient to carry the subtype, effective prior treatments, desmopressin-response status, and hematology contact because emergency and procedure teams need more detail than the diagnosis name alone.",
      "Explain that heavy menstrual bleeding, pregnancy, delivery, dental work, and surgery each need advance planning because the safest hemostatic strategy changes with the site and duration of bleeding risk."
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
  cards.forEach((patch) => {
    const target = normalize(patch.name);
    const matches = database.diseases.filter((entry) => normalize(primaryCanonicalTitle(entry)) === target);
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
  window.ANI_PATHOLOGY_NURSING_WAVE29_A = {
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
