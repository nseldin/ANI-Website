(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  const VERSION = "2026-07-19-wave33-pathology-nursing-b-1";
  const COHORT = "B";

  function activePathologyEntries() {
    if (typeof pathologyDiseases !== "undefined" && Array.isArray(pathologyDiseases)) return pathologyDiseases;
    return database && Array.isArray(database.diseases) ? database.diseases : [];
  }

  const sources = [
    { id: "nci-aml", label: "National Cancer Institute, Acute Myeloid Leukemia Treatment PDQ", url: "https://www.cancer.gov/types/leukemia/hp/adult-aml-treatment-pdq", note: "Supports subtype-directed AML treatment, urgent recognition of acute promyelocytic leukemia, cytopenia care, tumor-lysis surveillance, infection response, and treatment-complication monitoring." },
    { id: "acg-pancreatitis", label: "American College of Gastroenterology, 2024 Acute Pancreatitis Guideline", url: "https://webfiles.gi.org/links/journals/AJG-Clinical-Guidelines-Highlights-Acute-Pancreatitis-2024-FINAL.pdf", note: "Supports severity assessment, goal-directed crystalloid, analgesia, early enteral nutrition, biliary evaluation, and escalation for organ failure, cholangitis, necrosis, or infection." },
    { id: "ncbi-seizure-mechanisms", label: "NCBI Bookshelf, Basic Mechanisms Underlying Seizures and Epilepsy", url: "https://www.ncbi.nlm.nih.gov/books/NBK2510/", note: "Supports AMPA-mediated excitation, thalamocortical oscillation, T-type calcium currents, seizure propagation, excitotoxicity, and mechanistic interpretation without treating a receptor concept as a bedside diagnosis." },
    { id: "aes-epilepsy", label: "American Epilepsy Society, Clinical Guidance", url: "https://www.aesnet.org/clinical-care/clinical-guidance", note: "Supports seizure first aid, antiseizure-treatment safety, rescue planning, status-epilepticus recognition, and practical counseling for absence and other seizure disorders." },
    { id: "isth-dic", label: "International Society on Thrombosis and Haemostasis, DIC Reference Tools", url: "https://www.isth.org/page/reference_tools/ISTH-SSC-reference-tools.htm", note: "Supports structured recognition of disseminated intravascular coagulation, serial platelet and coagulation interpretation, treatment of the driver, and simultaneous bleeding and thrombosis surveillance." },
    { id: "isth-ttp", label: "International Society on Thrombosis and Haemostasis, TTP Guidelines", url: "https://www.isth.org/page/TTPGuidelines", note: "Supports urgent recognition of microangiopathic hemolysis with schistocytes, thrombocytopenia, neurologic or renal injury, ADAMTS13 testing, and time-critical hematology treatment." },
    { id: "ncbi-fibrinolysis", label: "NCBI Bookshelf, Biochemistry, Fibrinolysis", url: "https://www.ncbi.nlm.nih.gov/books/NBK554518/", note: "Supports plasmin-mediated fibrin breakdown, regulation by activators and inhibitors, D-dimer interpretation, therapeutic fibrinolysis, and bleeding-risk surveillance." },
    { id: "nci-gastric", label: "National Cancer Institute, Gastric Cancer Treatment PDQ", url: "https://www.cancer.gov/types/stomach/hp/stomach-treatment-pdq", note: "Supports staging, biomarker-informed treatment, gastrectomy and systemic-therapy care, nutrition support, and surveillance for bleeding, obstruction, dumping, deficiency, toxicity, and recurrence." },
    { id: "ncbi-gluconeogenesis", label: "NCBI Bookshelf, Biochemistry, Gluconeogenesis", url: "https://www.ncbi.nlm.nih.gov/books/NBK541119/", note: "Supports hepatic and renal glucose production during fasting, major substrates and regulatory hormones, energy requirements, and clinical links to hypoglycemia, diabetes, alcohol, liver failure, and critical illness." },
    { id: "nhlbi-hemolysis", label: "National Heart, Lung, and Blood Institute, Hemolytic Anemia", url: "https://www.nhlbi.nih.gov/health/anemia/hemolytic-anemia", note: "Supports recognition of intravascular and extravascular red-cell destruction, anemia and jaundice assessment, cause-directed treatment, transfusion safety, and monitoring for kidney or circulatory complications." },
    { id: "nci-hodgkin", label: "National Cancer Institute, Adult Hodgkin Lymphoma Treatment PDQ", url: "https://www.cancer.gov/types/lymphoma/hp/adult-hodgkin-treatment-pdq", note: "Supports subtype and stage-based treatment, response assessment, and monitoring for cytopenias, infection, tumor lysis, cardiopulmonary toxicity, fertility effects, and late complications." },
    { id: "ncbi-croup", label: "NCBI Bookshelf, Croup", url: "https://www.ncbi.nlm.nih.gov/books/NBK431070/", note: "Supports severity assessment of viral laryngotracheobronchitis, dexamethasone and nebulized epinephrine use, observation after treatment, and differentiation from bacterial or obstructive upper-airway emergencies." },
    { id: "nci-liver", label: "National Cancer Institute, Adult Primary Liver Cancer Treatment PDQ", url: "https://www.cancer.gov/types/liver/hp/adult-liver-treatment-pdq", note: "Supports liver reserve and stage assessment, locoregional and systemic treatment, transplant or surgical evaluation, and surveillance for bleeding, decompensation, obstruction, toxicity, and progression." },
    { id: "ncbi-cell-injury", label: "NCBI Bookshelf, Cell Injury and Death", url: "https://www.ncbi.nlm.nih.gov/books/NBK557627/", note: "Supports irreversible cell injury, necrotic membrane disruption and inflammation, cause-directed assessment, and the distinction between a mechanism of tissue death and a stand-alone diagnosis." },
    { id: "nci-nhl", label: "National Cancer Institute, Adult Non-Hodgkin Lymphoma Treatment PDQ", url: "https://www.cancer.gov/types/lymphoma/hp/adult-nhl-treatment-pdq", note: "Supports histology, biomarker, and stage-directed care with surveillance for tumor lysis, infection, cytopenias, compression syndromes, treatment toxicity, and recurrence." },
    { id: "nci-nsclc", label: "National Cancer Institute, Non-Small Cell Lung Cancer Treatment PDQ", url: "https://www.cancer.gov/types/lung/hp/non-small-cell-lung-treatment-pdq", note: "Supports tissue diagnosis, staging, molecular and immune-marker testing, multimodal treatment, symptom control, and monitoring for respiratory, neurologic, thrombotic, and treatment complications." },
    { id: "nci-sclc", label: "National Cancer Institute, Small Cell Lung Cancer Treatment PDQ", url: "https://www.cancer.gov/types/lung/hp/small-cell-lung-treatment-pdq", note: "Supports limited- versus extensive-stage classification, chemotherapy and radiation pathways, paraneoplastic syndromes, rapid progression, and treatment-complication surveillance." },
    { id: "cdc-opioid", label: "Centers for Disease Control and Prevention, About Prescription Opioids", url: "https://www.cdc.gov/overdose-prevention/about/prescription-opioids.html", note: "Supports clear distinctions among tolerance, physical dependence, opioid use disorder, overdose risk, medication safety, naloxone readiness, and nonstigmatizing patient education." },
    { id: "samhsa-oud", label: "SAMHSA, TIP 63: Medications for Opioid Use Disorder", url: "https://store.samhsa.gov/product/tip-63-medications-opioid-use-disorder-full-document/pep21-02-01-002", note: "Supports diagnosis and treatment of opioid use disorder, methadone, buprenorphine and naltrexone care, withdrawal and overdose prevention, continuity, and recovery-oriented follow-up." },
    { id: "acog-oud", label: "American College of Obstetricians and Gynecologists, Opioid Use and Opioid Use Disorder in Pregnancy", url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/08/opioid-use-and-opioid-use-disorder-in-pregnancy", note: "Supports universal screening, medication treatment rather than abrupt withdrawal, coordinated prenatal and postpartum care, neonatal planning, breastfeeding review, and overdose prevention." },
    { id: "iasp-pain", label: "International Association for the Study of Pain, Pain Terminology", url: "https://www.iasp-pain.org/resources/terminology/", note: "Supports distinctions among nociception, pain, sensitization, hyperalgesia and allodynia, multidimensional assessment, and mechanism-informed rather than intensity-only care." },
    { id: "ncbi-oih", label: "NCBI Bookshelf, Opioid-Induced Hyperalgesia", url: "https://www.ncbi.nlm.nih.gov/books/NBK470415/", note: "Supports recognition of paradoxically increased pain during opioid exposure, differentiation from tolerance or disease progression, and specialist-guided opioid and multimodal management." },
    { id: "ismp-pca", label: "Institute for Safe Medication Practices, Patient-Controlled Analgesia Safety", url: "https://www.ismp.org/resources/safety-issues-pca-part-i-how-errors-occur", note: "Supports authorized-patient-only dosing, independent programming verification, sedation and ventilation monitoring, risk-factor assessment, and prevention of PCA-by-proxy and respiratory-depression events." },
    { id: "aha-stroke-2026", label: "American Heart Association, 2026 Acute Ischemic Stroke Guideline", url: "https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke", note: "Supports BE-FAST recognition, last-known-well documentation, emergency imaging and reperfusion evaluation, cortical localization, stroke-unit monitoring, swallow safety, and secondary prevention." },
    { id: "aha-flutter", label: "American Heart Association, Atrial Flutter", url: "https://www.heart.org/en/health-topics/atrial-fibrillation/what-is-atrial-fibrillation-afib-or-af/atrial-flutter", note: "Supports atrial-flutter symptom and rhythm assessment, rate or rhythm treatment, cardioversion and ablation concepts, thromboembolic prevention, and urgent response to instability." },
    { id: "niddk-hypothyroid", label: "NIDDK, Hypothyroidism", url: "https://www.niddk.nih.gov/health-information/endocrine-diseases/hypothyroidism", note: "Supports TSH and free-thyroxine interpretation, levothyroxine treatment, interaction and adherence review, pregnancy needs, and recognition of severe decompensation or overtreatment." },
    { id: "niddk-transplant", label: "NIDDK, Kidney Transplant", url: "https://www.niddk.nih.gov/health-information/kidney-disease/kidney-failure/treatment/kidney-transplant", note: "Supports immunosuppressant adherence, graft-function and infection surveillance, prompt evaluation of rejection, medication-toxicity monitoring, and long-term transplant self-care." },
    { id: "va-amputation", label: "VA/DoD, 2025 Rehabilitation of Lower Limb Amputation Guideline", url: "https://healthquality.va.gov/HEALTHQUALITY/guidelines/rehab/amp/index.asp", note: "Supports residual-limb and wound care, contracture and fall prevention, pain and mental-health assessment, prosthetic rehabilitation, vascular surveillance, and lifelong functional follow-up." },
    { id: "niddk-anemia-ckd", label: "NIDDK, Anemia in Chronic Kidney Disease", url: "https://www.niddk.nih.gov/health-information/kidney-disease/anemia", note: "Supports evaluation of iron and other causes, hemoglobin and symptom monitoring, erythropoiesis-stimulating treatment, transfusion considerations, and surveillance for cardiovascular or treatment complications." },
    { id: "fda-benzodiazepines", label: "FDA, Boxed Warning Update for Benzodiazepines", url: "https://www.fda.gov/drugs/drug-safety-and-availability/fda-requiring-boxed-warning-updated-improve-safe-use-benzodiazepine-drug-class", note: "Supports recognition of sedation, respiratory depression and overdose interactions, dependence and withdrawal risk, careful monitoring, and avoidance of unsafe abrupt discontinuation after dependence." },
    { id: "ncbi-brain-abscess", label: "NCBI Bookshelf, Brain Abscess", url: "https://www.ncbi.nlm.nih.gov/books/NBK441841/", note: "Supports neurologic and infection assessment, urgent imaging before unsafe lumbar puncture, antimicrobial and neurosurgical management, seizure care, and surveillance for mass effect, rupture, or sepsis." },
    { id: "ncbi-burn-resuscitation", label: "NCBI Bookshelf, Burn Fluid Resuscitation", url: "https://www.ncbi.nlm.nih.gov/books/NBK534227/", note: "Supports burn-size and inhalation assessment, balanced resuscitation guided by perfusion and urine output, temperature and compartment monitoring, and prevention of under- or over-resuscitation." },
    { id: "nei-cataracts", label: "National Eye Institute, Cataracts", url: "https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/cataracts", note: "Supports visual-function assessment, dilated examination, risk reduction, surgical decision-making, postoperative protection, and urgent recognition of retinal, pressure, or infection complications." },
    { id: "chop-epispadias", label: "Children's Hospital of Philadelphia, Epispadias", url: "https://www.chop.edu/conditions-diseases/epispadias", note: "Supports recognition of abnormal dorsal urethral opening, bladder-exstrophy association, continence and urinary assessment, reconstructive planning, and family-centered long-term urologic care." },
    { id: "cdc-hpv", label: "Centers for Disease Control and Prevention, Clinical Overview of HPV", url: "https://www.cdc.gov/hpv/hcp/clinical-overview/index.html", note: "Supports transmission and natural history, vaccination, screening and follow-up, wart management, cancer-risk counseling, pregnancy considerations, and prevention without stigma." },
    { id: "cdc-hypospadias", label: "Centers for Disease Control and Prevention, Hypospadias", url: "https://www.cdc.gov/birth-defects/about/hypospadias.html", note: "Supports newborn recognition, preservation of foreskin before repair, associated anomaly assessment, surgical referral, urinary-function care, and developmentally appropriate family education." },
    { id: "nci-laryngeal", label: "National Cancer Institute, Laryngeal Cancer Treatment PDQ", url: "https://www.cancer.gov/types/head-and-neck/hp/adult/laryngeal-treatment-pdq", note: "Supports airway and swallowing assessment, staging, organ-preserving or surgical treatment, tracheostomy and communication care, nutrition, toxicity monitoring, and recurrence surveillance." },
    { id: "ninds-reye", label: "National Institute of Neurological Disorders and Stroke, Reye Syndrome", url: "https://www.ninds.nih.gov/health-information/disorders/reyes-syndrome", note: "Supports rapid recognition of vomiting and encephalopathy after viral illness, aspirin avoidance in children, metabolic and intracranial monitoring, and urgent critical-care treatment." },
    { id: "ncbi-hemodynamics", label: "NCBI Bookshelf, Cardiovascular Physiology", url: "https://www.ncbi.nlm.nih.gov/books/NBK538308/", note: "Supports systemic vascular resistance as an afterload and perfusion relationship, hemodynamic interpretation, and cautious assessment of vasodilation, vasoconstriction, shock, and treatment response." },
    { id: "ncbi-antibiotic-pd", label: "NCBI Bookshelf, Pharmacokinetic and Pharmacodynamic Measures for Antibiotic Treatment", url: "https://www.ncbi.nlm.nih.gov/books/NBK266259/", note: "Supports time-dependent antimicrobial killing, time-above-MIC targets, dosing-interval and infusion principles, susceptibility interpretation, response monitoring, and toxicity-aware stewardship." },
    { id: "niddk-kidney-failure", label: "NIDDK, Kidney Failure", url: "https://www.niddk.nih.gov/health-information/kidney-disease/kidney-failure", note: "Supports kidney-replacement and conservative-care planning, volume, electrolyte and uremic monitoring, access safety, medication adjustment, nutrition, and emergency dialysis indications." },
    { id: "ncbi-ketogenesis", label: "NCBI Bookshelf, Biochemistry, Ketogenesis", url: "https://www.ncbi.nlm.nih.gov/books/NBK493179/", note: "Supports hepatic ketone production during low insulin and carbohydrate availability, use by extrahepatic tissues, and clinical distinctions among physiologic ketosis, starvation, alcohol-related illness, and ketoacidosis." },
    { id: "niddk-cirrhosis", label: "NIDDK, Cirrhosis", url: "https://www.niddk.nih.gov/health-information/liver-disease/cirrhosis", note: "Supports staged progression from chronic injury to fibrosis and decompensation, cause treatment, portal-hypertension and cancer surveillance, nutrition, and recognition of bleeding, ascites, infection, encephalopathy, or kidney injury." },
    { id: "nimh-ptsd", label: "National Institute of Mental Health, Post-Traumatic Stress Disorder", url: "https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd", note: "Supports trauma-informed assessment, symptom clusters and duration, suicide and substance-use screening, psychotherapy and medication care, function monitoring, and crisis response." },
    { id: "niaid-rhinitis", label: "National Institute of Allergy and Infectious Diseases, Allergic Rhinitis", url: "https://www.niaid.nih.gov/diseases-conditions/allergic-rhinitis", note: "Supports allergen-pattern assessment, avoidance, intranasal and antihistamine therapy, comorbid asthma evaluation, and urgent differentiation of anaphylaxis or severe airway disease." },
    { id: "fda-clinpharm", label: "FDA, Clinical Pharmacology Section of Prescription Drug Labeling", url: "https://www.fda.gov/media/74346/download?attachment=", note: "Supports label-based interpretation of clearance changes, enzyme induction, steady state, interactions, therapeutic concentrations, and the need for drug-specific rather than generic pharmacokinetic decisions." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const patches = [
    card("Acute myeloid leukemia", ["nci-aml", "isth-dic"], [
      "Assess fever, bleeding, bruising, fatigue, dyspnea, bone pain, neurologic change, and treatment phase because marrow replacement and chemotherapy can rapidly impair infection defense, hemostasis, and oxygen delivery.",
      "Trend complete blood count, differential, coagulation studies, fibrinogen, electrolytes, uric acid, creatinine, and liver tests because cytopenias, acute promyelocytic leukemia, tumor lysis, and organ toxicity require different immediate responses.",
      "Use neutropenic, bleeding, transfusion, and central-line precautions while giving prescribed antimicrobial, blood-product, differentiation, or antileukemic therapy because preventable infection or hemorrhage can become fatal before remission is achieved.",
      "Monitor intake, weight, mucosa, bowel function, skin, pain, nutrition, fertility concerns, and psychosocial distress because intensive treatment injures normal tissues and disrupts daily function as well as malignant cells.",
      "Escalate immediately for neutropenic fever, uncontrolled bleeding, new headache or deficit, dyspnea, hypotension, oliguria, dysrhythmia, or suspected DIC because sepsis, intracranial hemorrhage, leukostasis, tumor lysis, and APL coagulopathy are time-critical emergencies."
    ], [
      "Fever at or above the oncology emergency threshold during neutropenia",
      "Uncontrolled bleeding, rapidly spreading bruising, falling fibrinogen, or DIC findings",
      "New severe headache, confusion, focal deficit, hypoxemia, or respiratory distress",
      "Rising potassium or uric acid, oliguria, dysrhythmia, hypotension, or shock"
    ], [
      "Follow the oncology fever plan exactly and never mask a fever without calling because infection may progress quickly when neutrophils are profoundly low.",
      "Use a soft toothbrush, avoid unapproved medicines or rectal procedures, and report bleeding because thrombocytopenia can turn minor trauma into serious hemorrhage."
    ]),
    card("Acute pancreatitis", ["acg-pancreatitis"], [
      "Assess pain onset and radiation, vomiting, alcohol and medication exposure, gallstone history, vital signs, oxygenation, and abdominal findings because severity depends on systemic organ injury rather than lipase elevation alone.",
      "Trend fluid balance, urine output, hematocrit, blood urea nitrogen, creatinine, glucose, calcium, electrolytes, and respiratory status because capillary leak and inflammation can cause shock, kidney injury, metabolic disturbance, and ARDS.",
      "Give prescribed balanced crystalloid, analgesia, antiemetic therapy, and oxygen while reassessing perfusion and lungs because early support relieves suffering and restores circulation without allowing harmful fluid overload.",
      "Begin oral or enteral nutrition as tolerated and coordinate biliary, triglyceride, medication, or alcohol-cause treatment because feeding preserves gut function while removal of the trigger reduces recurrence.",
      "Escalate for hypotension, rising oxygen need, oliguria, confusion, fever with jaundice, rigid abdomen, gastrointestinal bleeding, or persistent organ failure because shock, cholangitis, necrosis, infection, or compartment complications need urgent intervention."
    ], [
      "Hypotension, rising lactate, oliguria, cool skin, or worsening mental status",
      "Increasing oxygen requirement, respiratory fatigue, crackles, or severe hypoxemia",
      "Fever with jaundice, biliary obstruction, or sepsis suggesting acute cholangitis",
      "Rigid abdomen, gastrointestinal bleeding, persistent vomiting, or worsening multiorgan failure"
    ], [
      "Avoid alcohol and review medicines, triglycerides, and gallstone plans because preventing the cause is more effective than repeatedly treating inflammatory attacks.",
      "Seek urgent care for worsening pain, fainting, breathing difficulty, fever with jaundice, or inability to hydrate because complications may develop after the initial diagnosis."
    ]),
    card("AMPA receptor", ["ncbi-seizure-mechanisms"], [
      "Connect AMPA receptors with rapid glutamate-mediated sodium influx and neuronal depolarization because this mechanism helps explain normal excitation, seizure spread, and excitotoxic injury without implying a separate disease.",
      "Assess the clinical context, including seizures, ischemia, trauma, cognition, medication exposure, and neurologic examination because a receptor concept becomes meaningful only when linked to the patient's actual syndrome.",
      "Monitor consciousness, pupils, motor response, seizure duration, oxygenation, glucose, temperature, and treatment effects because excessive excitation can coexist with hypoxia, metabolic triggers, and secondary neuronal injury.",
      "Maintain airway and seizure precautions and administer syndrome-specific rescue or antiseizure therapy as ordered because bedside stabilization treats the dangerous network event rather than attempting to measure AMPA activity directly.",
      "Escalate for a seizure lasting five minutes, repeated seizures without recovery, new focal deficit, declining consciousness, respiratory compromise, or suspected stroke because status epilepticus and acute brain injury require emergency treatment."
    ], [
      "Seizure lasting five minutes or recurrent seizures without neurologic recovery",
      "New unilateral weakness, aphasia, vision loss, or other acute focal deficit",
      "Falling consciousness, abnormal pupils, repeated vomiting, or posturing",
      "Apnea, cyanosis, aspiration, severe hypoxemia, or unstable vital signs"
    ], [
      "AMPA is a fast excitatory receptor, not a laboratory diagnosis, so treatment decisions must follow the clinical seizure, stroke, or injury syndrome.",
      "Time seizures and protect breathing without restraining movement or placing objects in the mouth because accurate timing and safe first aid guide emergency care."
    ]),
    card("Coagulopathy", ["isth-dic", "isth-ttp"], [
      "Assess active bleeding, bruising, line oozing, thrombosis, medication exposure, liver disease, sepsis, trauma, pregnancy, and transfusion history because coagulopathy describes impaired hemostasis from many different mechanisms.",
      "Trend platelets, hemoglobin, PT/INR, aPTT, fibrinogen, D-dimer, smear, liver and kidney tests, and ordered factor studies because patterns distinguish consumption, deficiency, anticoagulant effect, liver failure, and microangiopathy.",
      "Apply bleeding precautions, minimize unnecessary punctures, hold pressure after procedures, and verify blood products or reversal agents because fragile hemostasis makes small injuries and medication errors disproportionately dangerous.",
      "Monitor neurologic status, perfusion, urine, stool, emesis, skin, limbs, oxygenation, and transfusion response because bleeding and pathologic clotting can injure organs simultaneously.",
      "Escalate immediately for intracranial symptoms, airway bleeding, hemodynamic instability, rapidly falling hemoglobin or fibrinogen, ischemic limb signs, or DIC because definitive cause treatment and hemostatic support cannot wait."
    ], [
      "Severe headache, focal deficit, confusion, seizure, or reduced consciousness",
      "Airway bleeding, hemoptysis, massive gastrointestinal bleeding, or uncontrolled wound hemorrhage",
      "Hypotension, tachycardia, rising lactate, oliguria, or rapidly falling hemoglobin",
      "Cold painful limb, chest pain, dyspnea, skin necrosis, or laboratory evidence of DIC"
    ], [
      "Avoid aspirin, NSAIDs, alcohol excess, and unapproved supplements until reviewed because several common products worsen bleeding or interact with anticoagulants.",
      "Report black stool, red urine, prolonged bleeding, severe headache, chest pain, or a cold painful limb because coagulopathy can cause hemorrhage or thrombosis."
    ]),
    card("Fibrinolysis", ["ncbi-fibrinolysis", "isth-dic"], [
      "Explain that plasmin breaks cross-linked fibrin into soluble fragments because normal fibrinolysis limits clots after repair while excessive or suppressed activity causes bleeding or persistent thrombosis.",
      "Assess indication, symptom onset, recent surgery or trauma, bleeding history, blood pressure, anticoagulants, pregnancy, and prior intracranial disease because therapeutic clot lysis has narrow time and safety boundaries.",
      "Trend neurologic status, vital signs, puncture sites, hemoglobin, platelets, fibrinogen, coagulation tests, and visible or occult bleeding because systemic fibrinolysis may uncover life-threatening hemorrhage rapidly.",
      "Avoid unnecessary invasive procedures and follow protocol for thrombolytic administration, line handling, and reversal support because preventable tissue trauma creates bleeding sites while clot breakdown is accelerated.",
      "Stop treatment and escalate for severe headache, acute deficit, hypotension, airway or gastrointestinal bleeding, rapidly expanding hematoma, or suspected intracranial hemorrhage because emergency imaging and hemostatic management are time critical."
    ], [
      "Sudden severe headache, vomiting, focal deficit, seizure, or reduced consciousness",
      "Hemodynamic instability with visible bleeding or a rapidly falling hemoglobin",
      "Airway hemorrhage, massive hemoptysis, hematemesis, melena, or retroperitoneal pain",
      "Rapidly expanding puncture-site hematoma, compartment findings, or critical fibrinogen decline"
    ], [
      "Tell every clinician about recent clot-busting treatment before procedures because bleeding risk continues after the infusion has ended.",
      "Report new headache, weakness, speech change, blood in urine or stool, or persistent puncture-site bleeding immediately because these may signal major hemorrhage."
    ]),
    card("Gastric cancer", ["nci-gastric"], [
      "Assess early satiety, weight loss, persistent dyspepsia, vomiting, dysphagia, melena, anemia symptoms, nutrition, and family history because gastric malignancy may present subtly until obstruction or bleeding develops.",
      "Coordinate endoscopic biopsy, staging imaging, biomarker testing, blood count, iron studies, liver tests, and nutrition assessment because histology, extent, tumor biology, and physiologic reserve determine treatment.",
      "Provide prescribed perioperative or systemic therapy, symptom control, venous-thromboembolism prevention, and infection precautions because multimodal treatment can improve control but also causes marrow, gastrointestinal, and wound toxicity.",
      "Monitor intake, weight, hydration, dumping symptoms, glucose, vitamin B12, iron, calcium, bowel function, and treatment response because gastrectomy and cancer both alter digestion, absorption, and nutritional reserve.",
      "Escalate for hematemesis, melena with instability, persistent vomiting, rigid abdomen, fever, severe dehydration, chest pain, dyspnea, or neutropenic fever because bleeding, obstruction, perforation, thrombosis, and sepsis require urgent care."
    ], [
      "Hematemesis, black stool, syncope, hypotension, or rapidly falling hemoglobin",
      "Persistent vomiting, inability to swallow, severe distention, or dehydration",
      "Rigid abdomen, sudden severe pain, fever, or signs of perforation and sepsis",
      "New chest pain, dyspnea, unilateral swelling, or fever during neutropenia"
    ], [
      "Use the prescribed small-meal and supplement plan after gastric surgery because reduced reservoir size and altered emptying can cause dumping and deficiencies.",
      "Report bleeding, persistent vomiting, fever, worsening swallowing, or rapid weight loss because these symptoms may reflect obstruction, recurrence, or treatment complications."
    ]),
    card("Gluconeogenesis", ["ncbi-gluconeogenesis"], [
      "Teach how gluconeogenesis produces hepatic and renal glucose from lactate, glycerol, and glucogenic amino acids because fasting tissues still need fuel after glycogen stores decline.",
      "Assess nutrition, fasting duration, alcohol use, diabetes, liver and kidney function, infection, medicines, and pregnancy because each factor can impair or accelerate gluconeogenesis through substrate and hormone changes.",
      "Monitor glucose trend, ketones, lactate, bicarbonate, anion gap, electrolytes, mental status, and intake because inadequate or excessive gluconeogenesis may accompany hypoglycemia, ketoacidosis, and severe systemic illness.",
      "Administer prescribed nutrition, glucose, insulin, fluids, electrolytes, and diagnosis-directed therapy rather than attempting to manipulate gluconeogenesis alone because the hormonal or organ driver must also be corrected.",
      "Escalate when impaired gluconeogenesis is accompanied by severe hypoglycemia, seizure, coma, persistent high-anion-gap acidosis, shock, or acute liver failure because neurologic and circulatory injury can become irreversible."
    ], [
      "Glucose low enough to cause confusion, seizure, coma, or inability to swallow",
      "Persistent high anion gap, ketonemia, deep breathing, dehydration, or vomiting",
      "Hypotension, rising lactate, cool skin, oliguria, or worsening consciousness",
      "Jaundice, coagulopathy, hypoglycemia, confusion, or rapidly worsening liver failure"
    ], [
      "Do not skip diabetes medicines or meals without a personalized plan because fasting hormones can increase liver glucose output even when no carbohydrate is eaten.",
      "Alcohol can block safe glucose production during fasting, so eat reliably and seek help for confusion, sweating, or inability to keep food down."
    ]),
    card("Hemolysis", ["nhlbi-hemolysis", "isth-ttp"], [
      "Assess fatigue, pallor, jaundice, dark urine, pain, fever, transfusion or medication exposure, infection, prosthetic devices, and family history because red-cell destruction may be immune, mechanical, inherited, toxic, or infectious.",
      "Trend hemoglobin, reticulocytes, bilirubin, LDH, haptoglobin, smear, direct antiglobulin testing, creatinine, potassium, and urine because the pattern confirms destruction and reveals kidney or electrolyte complications.",
      "Stop a suspected incompatible transfusion, maintain intravenous access with normal saline, verify identification, and follow reaction protocol because continued antigen exposure can intensify intravascular hemolysis and shock.",
      "Monitor oxygenation, perfusion, urine output and color, pain, temperature, neurologic status, and treatment response because severe anemia, hemoglobinuria, thrombosis, and microangiopathy can injure multiple organs.",
      "Escalate for transfusion reaction, rapidly falling hemoglobin, chest or back pain, oliguria, hyperkalemic rhythm change, neurologic deficit, or schistocytes with thrombocytopenia because massive hemolysis or TTP requires immediate treatment."
    ], [
      "Fever, chills, flank or chest pain, hypotension, or dark urine during transfusion",
      "Rapid hemoglobin decline with dyspnea, syncope, ischemic pain, or hemodynamic instability",
      "Oliguria, rising creatinine, severe hyperkalemia, or electrocardiographic change",
      "Schistocytes with thrombocytopenia, confusion, seizure, fever, or kidney injury"
    ], [
      "Report dark urine, jaundice, unusual fatigue, fever, or new pain promptly because red-cell destruction can worsen before anemia is obvious.",
      "Carry the exact transfusion-reaction, antibody, enzyme-deficiency, or inherited diagnosis because future medicines and blood selection may depend on it."
    ]),
    card("Hodgkin lymphoma", ["nci-hodgkin"], [
      "Assess painless nodes, fever, drenching night sweats, weight loss, pruritus, fatigue, chest symptoms, infection risk, and fertility goals because symptoms, bulk, and baseline priorities shape staging and treatment planning.",
      "Coordinate excisional tissue diagnosis, PET or CT staging, blood count, metabolic panel, ESR, pregnancy testing, and cardiopulmonary baseline studies because accurate subtype, extent, and organ reserve prevent over- or undertreatment.",
      "Administer prescribed chemotherapy, radiation, growth support, antiemetics, and infection prophylaxis with independent verification because curative regimens require exact dosing while exposing marrow, heart, lungs, nerves, and gonads.",
      "Monitor fever, cytopenias, tumor lysis, neuropathy, cough, dyspnea, cardiac symptoms, thyroid function, fertility, and late second-cancer risk because treatment toxicity can emerge during therapy or years afterward.",
      "Escalate for neutropenic fever, stridor or superior vena cava symptoms, acute dyspnea, chest pain, neurologic deficit, severe tumor lysis, or sepsis because infection, compression, thrombosis, and organ toxicity are emergencies."
    ], [
      "Fever during neutropenia, rigors, hypotension, confusion, or suspected sepsis",
      "Stridor, facial swelling, venous distention, rapidly worsening dyspnea, or hypoxemia",
      "Chest pain, new dysrhythmia, syncope, severe cough, or treatment-related lung decline",
      "Rising potassium, phosphate or uric acid with oliguria, weakness, or rhythm change"
    ], [
      "Keep all laboratory and survivorship visits even after cure because heart, lung, thyroid, fertility, and second-cancer effects may appear years later.",
      "Call immediately for fever, breathing change, facial swelling, chest pain, or new neurologic symptoms because infection or a compression syndrome can progress rapidly."
    ]),
    card("Laryngotracheobronchitis", ["ncbi-croup"], [
      "Assess barky cough, stridor at rest, retractions, air entry, color, drooling, voice, fever, age, onset, and foreign-body risk because severity and dangerous alternative diagnoses determine airway urgency.",
      "Keep the child calm with a caregiver and minimize upsetting examinations because crying increases turbulent airflow and can markedly worsen dynamic upper-airway obstruction.",
      "Give prescribed dexamethasone and nebulized epinephrine for indicated severity while providing oxygen without forced separation because steroids reduce edema and epinephrine rapidly but temporarily narrows swollen mucosa.",
      "Monitor work of breathing, stridor, fatigue, oxygenation, hydration, response, and recurrence through the observation period because symptoms can rebound after epinephrine wears off.",
      "Escalate for cyanosis, exhaustion, reduced air entry, altered consciousness, drooling, tripod posture, toxic appearance, or poor response because respiratory failure, epiglottitis, bacterial tracheitis, or foreign body requires emergency airway care."
    ], [
      "Cyanosis, apnea, exhaustion, reduced consciousness, or markedly diminished air entry",
      "Stridor at rest with severe retractions or worsening despite nebulized epinephrine",
      "Drooling, tripod position, muffled voice, inability to swallow, or toxic appearance",
      "Sudden choking onset, asymmetric breath sounds, high fever, or suspected foreign body"
    ], [
      "Keep the child calm and seek emergency care for stridor at rest, blue color, drooling, or exhaustion because agitation can worsen obstruction.",
      "Do not use steam burns, sedating cough medicines, or forced throat inspection because these do not treat swelling and may delay safe airway care."
    ]),
    card("Liver cancer", ["nci-liver", "niddk-cirrhosis"], [
      "Assess right-upper-quadrant pain, weight loss, early satiety, jaundice, ascites, bleeding, cognition, performance status, and chronic liver disease because tumor burden and remaining liver reserve jointly determine risk and treatment tolerance.",
      "Trend blood count, bilirubin, albumin, INR, liver enzymes, creatinine, sodium, tumor markers, and ordered imaging because progression, portal hypertension, decompensation, and treatment toxicity may appear in different domains.",
      "Coordinate stage- and reserve-appropriate resection, transplant, ablation, embolization, radiation, or systemic therapy because liver-directed benefit depends on anatomy while excessive treatment can precipitate hepatic failure.",
      "Monitor pain, nutrition, glucose, fluid balance, encephalopathy, infection, bleeding, skin, access sites, and postprocedure syndrome because both malignancy and locoregional therapy can destabilize a fragile cirrhotic patient.",
      "Escalate for hematemesis, melena, hypotension, rapidly increasing ascites, fever with pain, severe confusion, oliguria, acute jaundice, or postprocedure instability because variceal bleeding, infection, rupture, and liver failure are emergencies."
    ], [
      "Hematemesis, melena, syncope, hypotension, or rapidly falling hemoglobin",
      "Fever, abdominal pain, guarding, worsening ascites, or suspected peritonitis",
      "New severe confusion, asterixis, inability to protect the airway, or seizure",
      "Rapid jaundice, oliguria, hypoglycemia, coagulopathy, or postprocedure shock"
    ], [
      "Avoid alcohol and unapproved herbs and bring every medicine to review because impaired liver function changes drug handling and bleeding risk.",
      "Seek urgent care for bleeding, fever with abdominal pain, severe confusion, rapidly increasing swelling, or reduced urine because decompensation can progress quickly."
    ]),
    card("Necrosis", ["ncbi-cell-injury"], [
      "Identify the injured organ, onset, ischemic, infectious, toxic, traumatic, pressure, or inflammatory driver because necrosis is irreversible cell death from a cause rather than a complete bedside diagnosis.",
      "Assess pain, color, temperature, swelling, odor, drainage, pulses, sensation, function, fever, and systemic stability because local tissue death can coexist with infection, vascular occlusion, compartment pressure, or organ failure.",
      "Trend perfusion, lactate, blood count, inflammatory markers, kidney and liver tests, electrolytes, imaging, and wound findings because expanding injury releases cellular contents and may impair distant organs.",
      "Protect viable tissue, relieve pressure, restore perfusion, treat infection or toxin, and coordinate debridement when ordered because dead tissue cannot recover and may perpetuate inflammation or microbial growth.",
      "Escalate for rapidly spreading discoloration, pain out of proportion, crepitus, absent pulses, shock, hyperkalemic rhythm change, or acute organ dysfunction because necrotizing infection, ischemia, and massive tissue breakdown are emergencies."
    ], [
      "Pain out of proportion, rapidly spreading skin change, bullae, crepitus, or toxic appearance",
      "Cold pulseless limb, new sensory or motor loss, or tense compartment findings",
      "Hypotension, confusion, rising lactate, oliguria, or rapidly worsening organ function",
      "Severe hyperkalemia, dysrhythmia, dark urine, or extensive muscle breakdown"
    ], [
      "Do not treat black, blistered, foul, or rapidly changing tissue at home because dead tissue may hide infection or loss of blood flow.",
      "Offload pressure and follow wound and circulation plans consistently because protecting viable surrounding tissue limits additional irreversible injury."
    ]),
    card("Non-Hodgkin lymphoma", ["nci-nhl"], [
      "Assess node growth, fever, night sweats, weight loss, fatigue, abdominal fullness, neurologic symptoms, infection risk, and performance status because diverse lymphoma subtypes behave from indolent to immediately aggressive.",
      "Coordinate adequate tissue biopsy, immunophenotyping, molecular studies, PET or CT staging, marrow assessment when indicated, and baseline organ testing because histology and biology determine treatment more than the word lymphoma alone.",
      "Administer prescribed immunochemotherapy, targeted therapy, cellular therapy, prophylaxis, and supportive products with independent verification because regimens carry subtype-specific infusion, infection, marrow, cytokine, neurologic, and tumor-lysis risks.",
      "Monitor blood counts, electrolytes, uric acid, kidney and liver function, fever, infusion reactions, cognition, oxygenation, pain, and response because toxicity and rapidly changing tumor burden may threaten several organs.",
      "Escalate for neutropenic fever, airway or vena-cava compression, spinal or bowel symptoms, severe tumor lysis, cytokine-release findings, neurologic decline, or shock because infection, compression, and treatment emergencies require immediate action."
    ], [
      "Fever during neutropenia, rigors, hypotension, confusion, or suspected sepsis",
      "Stridor, facial swelling, venous distention, bowel obstruction, or new cord-compression findings",
      "Rising potassium, phosphate or uric acid with oliguria, weakness, or dysrhythmia",
      "Fever with hypotension, hypoxemia, severe agitation, seizure, or acute neurologic decline after therapy"
    ], [
      "Know the exact lymphoma subtype and treatment because different diseases sharing this name can have very different urgency, medicines, and follow-up.",
      "Call immediately for fever, breathing difficulty, facial swelling, weakness, bowel obstruction symptoms, or confusion because infection or compression can progress rapidly."
    ]),
    card("Non-small cell lung cancer", ["nci-nsclc"], [
      "Assess cough, hemoptysis, dyspnea, chest or bone pain, weight loss, neurologic change, smoking and occupational exposure, and performance status because symptoms may reflect local tumor, metastasis, or another urgent cardiopulmonary disease.",
      "Coordinate tissue diagnosis, anatomic staging, brain imaging when indicated, and complete molecular and immune-marker testing because histology, stage, and actionable biology select surgery, radiation, targeted, immune, or cytotoxic therapy.",
      "Support smoking cessation, pulmonary hygiene, nutrition, pain control, thrombosis prevention, and prescribed multimodal treatment because preserving functional reserve improves treatment tolerance and symptom control.",
      "Monitor oxygenation, respiratory effort, hemoptysis, blood counts, liver and kidney tests, skin, bowel, endocrine, neurologic, and immune-related symptoms because cancer and therapy can injure lungs and distant organs.",
      "Escalate for massive hemoptysis, stridor, severe hypoxemia, facial swelling, new focal deficit, spinal symptoms, chest pain, fever during neutropenia, or suspected immune pneumonitis because airway, vascular, neurologic, infectious, and treatment emergencies are time critical."
    ], [
      "Massive hemoptysis, stridor, rapidly worsening hypoxemia, or respiratory fatigue",
      "Facial or neck swelling, venous distention, severe headache, or superior vena cava syndrome",
      "New focal deficit, seizure, severe headache, or back pain with weakness and sphincter change",
      "Fever during neutropenia or new cough and dyspnea during immunotherapy"
    ], [
      "Ask whether complete molecular and immune-marker results are available before treatment because these results can change the most effective first therapy.",
      "Report new breathing change, blood with coughing, facial swelling, weakness, severe diarrhea, or rash promptly because cancer and immune therapy can cause emergencies."
    ]),
    card("Opioid tolerance, physical dependence, and addiction distinctions", ["cdc-opioid", "samhsa-oud"], [
      "Use nonstigmatizing history to distinguish reduced drug effect, withdrawal after stopping, and compulsive harmful use because tolerance, physical dependence, and opioid use disorder are related but not interchangeable.",
      "Assess dose, duration, adherence, pain and function, cravings, loss of control, consequences, withdrawal, sedatives, alcohol, respiratory disease, pregnancy, and prior overdose because the pattern determines safety and treatment needs.",
      "Monitor sedation, respiratory rate, oxygenation, function, bowel status, falls, mood, adherence, and aberrant behaviors because toxicity, undertreated pain, and opioid use disorder can coexist.",
      "Avoid abrupt discontinuation in a physically dependent stable patient and coordinate individualized tapering or evidence-based OUD medication because sudden withdrawal can cause harm while punitive care drives disengagement.",
      "Escalate for unresponsiveness, slow or absent breathing, cyanosis, severe withdrawal with dehydration, suicidality, dangerous intoxication, or pregnancy instability because overdose and acute psychiatric or obstetric risks require emergency care."
    ], [
      "Unresponsiveness, slow or absent breathing, pinpoint pupils, cyanosis, or choking sounds",
      "Severe vomiting or diarrhea with dehydration, syncope, or dangerous electrolyte disturbance",
      "Suicidal intent, severe agitation, psychosis, or unsafe polysubstance intoxication",
      "Pregnancy with overdose, severe withdrawal, bleeding, contractions, or reduced fetal movement"
    ], [
      "Needing more medicine for the same effect or feeling withdrawal does not by itself prove addiction because diagnosis depends on compulsive harmful behavior and impaired control.",
      "Keep naloxone available and avoid mixing opioids with alcohol or sedatives because respiratory depression can occur even in someone with tolerance."
    ]),
    card("Opioid use disorder", ["samhsa-oud", "cdc-opioid"], [
      "Assess DSM-compatible loss of control, craving, hazardous use, consequences, tolerance context, withdrawal, route, last use, overdose history, infection, pain, mental health, housing, and treatment goals because OUD severity and immediate risks are multidimensional.",
      "Screen for respiratory depression, pregnancy, suicidality, sedative or alcohol exposure, HIV, hepatitis, endocarditis, and injection injury because lethal and treatable complications may be more urgent than withdrawal discomfort.",
      "Offer or continue buprenorphine, methadone, or naltrexone when clinically appropriate and coordinate behavioral and recovery supports because medication substantially reduces illicit use, overdose risk, and mortality.",
      "Monitor cravings, withdrawal, sedation, breathing, toxicology used therapeutically, adherence, interactions, infection, mood, function, and retention because dose adequacy and continuity matter more than moral judgment or a single test.",
      "Give naloxone and activate emergency care for suspected overdose, and escalate severe withdrawal, sepsis, chest pain, neurologic change, suicidality, or pregnancy concerns because stabilization must precede long-term treatment planning."
    ], [
      "Unresponsiveness, apnea or slow breathing, cyanosis, or failure to improve after naloxone",
      "Fever with murmur, severe back pain, spreading injection-site infection, or septic shock",
      "Chest pain, focal deficit, seizure, severe headache, or dangerous polysubstance intoxication",
      "Suicidal intent, psychosis, severe dehydration, or acute pregnancy warning signs"
    ], [
      "Medication treatment is evidence-based care, not replacing one addiction with another, because stable receptor treatment reduces overdose and supports recovery.",
      "Carry naloxone, avoid using alone, test potency when possible, and never combine opioids with alcohol or sedatives because contamination and respiratory depression are unpredictable."
    ]),
    card("Opioid use disorder in pregnancy and peripartum care", ["acog-oud", "samhsa-oud"], [
      "Use universal, private, nonpunitive screening for opioid use, treatment, last dose, withdrawal, overdose, infections, safety, and social needs because stigma and fear can hide risk and delay prenatal care.",
      "Continue or initiate coordinated methadone or buprenorphine treatment rather than abrupt withdrawal when appropriate because maternal instability and relapse expose both pregnant patient and fetus to greater danger.",
      "Coordinate obstetric, addiction, anesthesia, pediatric, lactation, social, and pain teams before delivery because baseline opioid tolerance, neonatal observation, analgesia, breastfeeding eligibility, and discharge continuity require one shared plan.",
      "Monitor maternal sedation, breathing, withdrawal, cravings, infections, fetal status, labor, postpartum pain, mood, and medication access because dose needs and overdose vulnerability change during pregnancy and especially after birth.",
      "Give naloxone for maternal overdose and escalate for respiratory depression, severe withdrawal, bleeding, contractions, reduced fetal movement, hypertensive symptoms, suicidality, or postpartum oversedation because maternal stabilization is the fastest route to fetal safety."
    ], [
      "Maternal unresponsiveness, slow breathing, cyanosis, or suspected opioid overdose",
      "Bleeding, fluid leakage, regular preterm contractions, or reduced fetal movement",
      "Severe withdrawal with dehydration, syncope, inability to retain medication, or relapse risk",
      "Postpartum oversedation, suicidality, psychosis, uncontrolled pain, or loss of treatment access"
    ], [
      "Do not stop methadone or buprenorphine suddenly when pregnancy is discovered because withdrawal and relapse can endanger both parent and fetus.",
      "Plan pain control, newborn observation, naloxone access, feeding, and medication appointments before discharge because the postpartum period carries high overdose and care-disruption risk."
    ]),
    card("Opioid-induced hyperalgesia", ["ncbi-oih", "iasp-pain"], [
      "Assess for opioid-induced hyperalgesia when pain becomes more diffuse, less anatomically consistent, or more touch-sensitive as opioid exposure rises because paradoxical pronociception can resemble tolerance or disease progression.",
      "Review the suspected opioid-induced hyperalgesia pattern against function, dose trajectory, interdose withdrawal, sedatives, mood, sleep, substance use, and new pathology because OIH cannot be concluded from dose alone.",
      "Monitor suspected opioid-induced hyperalgesia through pain distribution, allodynia, functional goals, sedation, breathing, bowel status, withdrawal, and response to supervised dose changes because the trajectory helps clarify mechanism safely.",
      "Coordinate specialist-guided opioid reduction or rotation plus nonopioid medicines, physical rehabilitation, and behavioral strategies for opioid-induced hyperalgesia because simply escalating the opioid may amplify sensitization and toxicity.",
      "Escalate for respiratory depression, overdose, acute focal or visceral pain, new neurologic deficit, fever, trauma, suicidality, or severe withdrawal before labeling worsening pain as opioid-induced hyperalgesia because dangerous disease and toxicity require exclusion."
    ], [
      "Unresponsiveness, slow breathing, cyanosis, severe sedation, or suspected overdose",
      "Sudden focal chest, abdominal, spinal, limb, or head pain with instability",
      "New weakness, saddle anesthesia, bowel or bladder loss, fever, or major trauma",
      "Suicidal intent, dangerous self-escalation, or severe withdrawal with dehydration"
    ], [
      "Do not raise opioid doses on your own when pain spreads or touch becomes painful because more exposure can sometimes increase nervous-system sensitivity.",
      "Keep a pain, dose, sleep, and function record because the pattern helps clinicians distinguish sensitization, tolerance, withdrawal, and disease progression."
    ]),
    card("Pain mechanisms, central sensitization, hyperalgesia, and allodynia", ["iasp-pain"], [
      "Assess pain mechanisms by mapping spontaneous pain, hyperalgesia, allodynia, sensory quality, triggers, sleep, mood, function, and prior injury because central sensitization cannot be understood from intensity alone.",
      "Perform focused neurologic, vascular, musculoskeletal, skin, and visceral assessment when central sensitization is suspected because hyperalgesia and allodynia can coexist with infection, ischemia, tissue injury, or cord compression.",
      "Monitor central-sensitization outcomes through sensory distribution, allodynia, movement tolerance, sleep, cognition, mood, medication effects, and functional goals because meaningful neural regulation may improve before pain reaches zero.",
      "Use mechanism-matched multimodal care for hyperalgesia and allodynia, including graded activity, sleep support, education, psychological strategies, and diagnosis-directed medicines because repeated threat and inactivity can reinforce sensitized networks.",
      "Escalate for sudden severe pain with instability, new focal deficit, bowel or bladder loss, fever, swollen ischemic limb, overdose signs, or suicidal crisis because these findings exceed a stable central-sensitization explanation."
    ], [
      "Sudden severe chest, abdominal, head, spinal, or limb pain with unstable vital signs",
      "New weakness, numbness, saddle anesthesia, bowel or bladder dysfunction, or gait loss",
      "Fever, hot swollen joint, spreading skin change, cold pulseless limb, or major trauma",
      "Respiratory depression, dangerous medication use, suicidal intent, or inability to function safely"
    ], [
      "Pain is real even when sensitized nerves amplify signals, and understanding the mechanism helps choose treatment without implying imagined symptoms.",
      "Increase activity gradually and track function, sleep, and recovery because repeated safe movement can retrain threat responses more reliably than boom-and-bust exertion."
    ]),
    card("Patient-controlled analgesia opioid safety", ["ismp-pca", "cdc-opioid"], [
      "Verify opioid, concentration, loading dose, demand dose, lockout, basal rate, limits, allergies, renal and hepatic function, and prior exposure because programming or patient-selection errors can deliver a rapidly dangerous dose.",
      "Assess sleep apnea, obesity, age, opioid naivety, lung disease, sedatives, neurologic status, and airway risk because respiratory depression often begins with increasing sedation before oxygen saturation falls.",
      "Teach that only the patient presses the button and secure the device and tubing because family- or staff-activated dosing bypasses the patient's natural protection of sleeping through excessive medication.",
      "Monitor sedation score, respiratory rate and quality, oxygenation or ventilation per risk, pain, function, blood pressure, nausea, pruritus, bowel and urinary status because analgesia must be balanced against evolving opioid toxicity.",
      "Stop opioid delivery, support the airway, give naloxone per protocol, and escalate for difficult arousal, slow breathing, apnea, cyanosis, severe hypotension, or pump discrepancy because delayed rescue can progress to arrest."
    ], [
      "Increasing sedation, difficult arousal, respiratory rate below protocol threshold, or apnea",
      "Cyanosis, rising carbon dioxide, severe hypoxemia, airway obstruction, or aspiration",
      "Severe hypotension, bradycardia, chest pain, syncope, or hemodynamic instability",
      "Wrong concentration, programming mismatch, empty or disconnected tubing, or suspected tampering"
    ], [
      "Only the patient should press the PCA button, even when sleeping or uncomfortable, because proxy dosing can cause fatal respiratory depression.",
      "Call the nurse for increasing sleepiness, slow breathing, poor relief, nausea, itching, or pump alarms because settings and side effects need clinical reassessment."
    ]),
    card("Small cell lung cancer", ["nci-sclc"], [
      "Assess cough, hemoptysis, dyspnea, weight loss, pain, neurologic change, smoking exposure, performance status, and rapid symptom tempo because small cell cancer often spreads early and behaves aggressively.",
      "Coordinate tissue confirmation, limited- versus extensive-stage imaging, brain assessment, blood count, chemistries, and paraneoplastic evaluation because stage and organ effects guide systemic therapy, radiation, and supportive care.",
      "Administer prescribed chemotherapy, immunotherapy, thoracic or brain radiation, antiemetics, and prophylaxis with verification because prompt systemic control matters while treatment can injure marrow, lung, brain, and endocrine organs.",
      "Monitor oxygenation, infection, cytopenias, sodium, neurologic status, tumor lysis, swallowing, nutrition, skin, bowel, and immune toxicity because rapid response and rapid complication can occur during the same treatment period.",
      "Escalate for massive hemoptysis, severe hypoxemia, facial swelling, seizure, focal deficit, profound hyponatremia, neutropenic fever, or suspected immune pneumonitis because airway, compression, neurologic, metabolic, infectious, and treatment emergencies require immediate care."
    ], [
      "Massive hemoptysis, stridor, severe hypoxemia, or rapidly increasing work of breathing",
      "Facial swelling, venous distention, severe headache, or superior vena cava syndrome",
      "Seizure, confusion, focal deficit, severe headache, or dangerously low sodium",
      "Fever during neutropenia or new cough and dyspnea during immune therapy"
    ], [
      "Keep urgent staging and treatment appointments because small cell lung cancer can grow and spread faster than many other lung-cancer types.",
      "Report confusion, weakness, seizure, breathing change, blood with coughing, facial swelling, or fever promptly because paraneoplastic and treatment emergencies are treatable when recognized early."
    ]),
    card("T-type calcium channel and thalamocortical oscillation", ["ncbi-seizure-mechanisms", "aes-epilepsy"], [
      "Connect low-threshold T-type calcium currents with rhythmic thalamocortical bursting because this circuit helps generate the generalized three-per-second spike-wave pattern of typical absence seizures.",
      "Assess staring onset, duration, responsiveness, automatisms, frequency, school or work impact, triggers, and postevent state because brief absence seizures differ clinically from focal impaired-awareness events and daydreaming.",
      "Trend seizure frequency, neurologic status, electroencephalographic response, antiseizure medicines, sleep, adherence, pregnancy potential, and adverse effects because mechanism-informed therapy still requires patient-specific safety monitoring.",
      "Protect the patient from falls, water, driving, and machinery risk and administer prescribed therapy because frequent brief lapses can cause cumulative learning and safety harm despite rapid recovery.",
      "Escalate for an event lasting five minutes, repeated seizures without baseline recovery, generalized convulsion, injury, respiratory compromise, or new focal deficit because this exceeds an uncomplicated thalamocortical absence pattern."
    ], [
      "Seizure lasting five minutes or repeated events without return to neurologic baseline",
      "Generalized convulsion, significant injury, aspiration, cyanosis, or breathing difficulty",
      "New focal weakness, prolonged confusion, severe headache, or unequal pupils",
      "Major medication rash, suicidality, severe lethargy, or dangerous blood-count abnormality"
    ], [
      "Record event timing and responsiveness rather than assuming inattention because brief absence seizures may happen many times daily without a dramatic convulsion.",
      "Take antiseizure medicine consistently and discuss pregnancy plans and new medicines because interactions and abrupt missed doses can change seizure control and safety."
    ]),
    card("Wernicke aphasia", ["aha-stroke-2026"], [
      "Assess fluent but nonsensical speech, comprehension, repetition, naming, reading, writing, vision, strength, sensation, and exact onset because receptive aphasia may signal an acute dominant temporal stroke despite normal speech melody.",
      "Activate the stroke pathway, document last-known-well, check glucose, and prepare emergency brain and vascular imaging because rapid reperfusion decisions depend on time and exclusion of hemorrhage or mimic.",
      "Use short statements, gestures, demonstration, pictures, yes-or-no verification, and a quiet environment because impaired language comprehension makes lengthy verbal instruction unsafe and frustrating.",
      "Monitor neurologic examination, blood pressure, rhythm, oxygenation, swallowing, aspiration, agitation, and treatment complications because language deficits may worsen with edema, hemorrhage, seizure, or recurrent ischemia.",
      "Escalate for new or worsening aphasia, reduced consciousness, severe headache, vomiting, seizure, airway compromise, or new weakness because hemorrhagic transformation, edema, and recurrent stroke are emergencies."
    ], [
      "Sudden fluent nonsensical speech or inability to understand spoken language",
      "Worsening aphasia, new weakness, visual loss, severe imbalance, or recurrent deficit",
      "Severe headache, vomiting, seizure, unequal pupils, or declining consciousness",
      "Coughing with swallowing, wet voice, hypoxemia, aspiration, or airway compromise"
    ], [
      "Call emergency services for sudden language change even when speech sounds fluent because meaningful comprehension can be lost during a time-sensitive stroke.",
      "Use one short idea, visual cues, and confirmation rather than pretending understanding because respectful supported communication reduces errors and distress."
    ]),
    card("Atrial flutter", ["aha-flutter"], [
      "Assess palpitations, pulse pattern, onset, chest pain, dyspnea, dizziness, syncope, heart failure, triggers, thyroid disease, alcohol, and medications because atrial flutter may be silent, stable, or immediately hemodynamically important.",
      "Obtain a 12-lead electrocardiogram and monitor ventricular rate, blood pressure, oxygenation, electrolytes, thyroid testing, and cardiac injury when indicated because atrial activity alone does not reveal perfusion impact or cause.",
      "Administer prescribed rate or rhythm therapy and verify anticoagulation, onset duration, and cardioversion plan because slowing conduction, restoring rhythm, and preventing embolic stroke are separate therapeutic goals.",
      "Monitor chest symptoms, perfusion, neurologic status, heart failure, bradycardia, QT effects, bleeding, and postconversion rhythm because both the arrhythmia and its treatment can destabilize circulation.",
      "Perform or prepare synchronized cardioversion and escalate for hypotension, ischemic chest pain, acute pulmonary edema, altered consciousness, syncope, or focal deficit because unstable flutter and embolic stroke require immediate intervention."
    ], [
      "Hypotension, altered consciousness, shock, syncope, or signs of poor perfusion",
      "Ischemic chest pain, dynamic electrocardiographic change, or acute pulmonary edema",
      "Sudden facial droop, weakness, speech change, vision loss, or severe imbalance",
      "Dangerous bradycardia, prolonged QT, ventricular dysrhythmia, or major anticoagulant bleeding"
    ], [
      "Check pulse and take rate-control and anticoagulant medicines exactly as prescribed because feeling normal does not remove stroke or recurrence risk.",
      "Call emergency services for chest pain, fainting, severe breathlessness, or stroke signs because atrial flutter can impair circulation or form emboli."
    ]),
    card("Hypothyroidism", ["niddk-hypothyroid"], [
      "Assess fatigue, cold intolerance, weight change, constipation, skin and hair, cognition, mood, menstrual or fertility changes, pulse, edema, medicines, and prior thyroid treatment because deficiency develops gradually and overlaps many conditions.",
      "Trend TSH and free thyroxine with pregnancy status, pituitary context, sodium, lipids, blood count, and symptoms because laboratory interpretation and replacement targets change with cause and physiologic state.",
      "Give levothyroxine consistently using the prescribed timing and separate interacting iron, calcium, food, or binding medicines because variable absorption creates avoidable under- or over-replacement.",
      "Monitor pulse, blood pressure, mental status, temperature, bowel function, edema, cardiac symptoms, and dose response because severe deficiency depresses organ function while excessive replacement provokes ischemia or dysrhythmia.",
      "Escalate for hypothermia, bradycardia, hypotension, hypoventilation, severe confusion, hyponatremia, chest pain, or dysrhythmia because myxedema coma and treatment-related cardiac stress are medical emergencies."
    ], [
      "Hypothermia, severe lethargy, confusion, seizure, or declining consciousness",
      "Bradycardia, hypotension, hypoventilation, hypoxemia, or shock",
      "Severe hyponatremia, hypoglycemia, ileus, or rapidly worsening edema",
      "Chest pain, new atrial arrhythmia, marked tremor, or severe palpitations after replacement"
    ], [
      "Take levothyroxine the same way each day and separate iron or calcium as instructed because absorption differences can change thyroid levels significantly.",
      "Seek urgent care for severe confusion, unusual coldness, slow breathing, fainting, or chest pain because severe deficiency or overtreatment can threaten circulation."
    ]),
    card("Absence seizure", ["aes-epilepsy", "ncbi-seizure-mechanisms"], [
      "Ask witnesses to describe abrupt staring, eyelid flutter, responsiveness, duration, frequency, triggers, and immediate recovery because typical absence seizures are brief generalized lapses without a prolonged postictal state.",
      "Coordinate electroencephalography and evaluate glucose, medicines, sleep, development, school performance, and possible focal features because daydreaming, syncope, focal seizures, and metabolic events require different care.",
      "Administer prescribed antiseizure therapy and review adherence, interactions, blood counts, liver effects, mood, and pregnancy considerations because effective suppression must be balanced against drug-specific toxicity.",
      "Monitor event frequency, injuries, learning, attention, driving or activity restrictions, and response to treatment because many subtle daily seizures can impair safety and education cumulatively.",
      "Escalate for a seizure lasting five minutes, repeated events without baseline recovery, generalized convulsion, injury, cyanosis, pregnancy seizure, or new focal deficit because this is not a routine brief absence event."
    ], [
      "Seizure lasting five minutes or recurrent seizures without return to baseline",
      "Generalized convulsion, serious fall, head injury, aspiration, or cyanosis",
      "New unilateral weakness, prolonged confusion, severe headache, or unequal pupils",
      "Pregnancy seizure or severe medication rash, suicidality, or organ toxicity"
    ], [
      "Record a video when safe and time the event because brief staring spells are easier to classify with an accurate witness description.",
      "Follow activity and driving guidance and take medicine consistently because even short lapses can cause injury or disrupt learning when frequent."
    ]),
    card("Acute rejection", ["niddk-transplant"], [
      "Determine transplanted organ, postoperative timing, immunosuppressant doses and levels, missed medicines, fever, pain, output, weight, blood pressure, and recent infection because rejection presentations and competing diagnoses vary by organ.",
      "Trend organ-specific function, complete blood count, electrolytes, drug levels, cultures, donor-specific testing, imaging, and biopsy results as ordered because rejection cannot be safely diagnosed from symptoms or one laboratory value alone.",
      "Administer immunosuppression at exact times and prepare prescribed intensified therapy with infection and glucose precautions because restoring immune control may preserve the graft while increasing toxicity and opportunistic risk.",
      "Monitor urine or organ output, perfusion, respiratory status, rhythm, wound, fever, glucose, kidney and liver function, and medication adverse effects because graft dysfunction and treatment complications can evolve together.",
      "Escalate for abrupt graft-function decline, anuria, severe dyspnea, chest pain, hemodynamic instability, high fever, confusion, or inability to retain immunosuppressants because rejection, vascular compromise, sepsis, and toxicity need urgent specialist treatment."
    ], [
      "Abrupt loss of graft function, anuria, severe pain, or rapidly worsening laboratory values",
      "High fever, rigors, hypotension, confusion, wound infection, or suspected sepsis",
      "Severe dyspnea, hypoxemia, chest pain, dysrhythmia, or hemodynamic instability",
      "Repeated vomiting, missed immunosuppressants, critically abnormal drug level, or severe toxicity"
    ], [
      "Never skip, double, or change transplant medicines without the transplant team because small exposure changes can cause rejection or dangerous toxicity.",
      "Call the transplant team promptly for fever, reduced organ output, new swelling, pain, breathing change, or vomiting that prevents medication because early treatment can preserve function."
    ]),
    card("Amputation complications", ["va-amputation", "iasp-pain"], [
      "Assess residual limb color, temperature, drainage, odor, swelling, skin, pulses, sensation, pain type, contracture, falls, mood, and prosthetic fit because vascular, wound, neuropathic, mechanical, and psychological complications often overlap.",
      "Inspect the entire limb and contralateral foot daily and trend wound dimensions, perfusion, glucose, infection, edema, and pressure points because sensory loss and prosthetic friction can hide progressive tissue injury.",
      "Position to prevent hip or knee contracture, support graded mobility and strengthening, and use prescribed compression and desensitization because preserved range, limb shaping, and safe loading improve later prosthetic function.",
      "Coordinate multimodal residual and phantom pain care, rehabilitation, prosthetics, vascular or diabetes management, nutrition, and mental-health support because limb loss affects neural processing, circulation, function, and identity.",
      "Escalate for cold pale limb, rapidly spreading redness, purulent drainage, fever, wound dehiscence, uncontrolled bleeding, new chest pain or dyspnea, or suicidal crisis because ischemia, infection, thrombosis, and acute distress threaten life or rehabilitation."
    ], [
      "Cold pale or cyanotic residual limb, absent pulse, severe new pain, or rapidly expanding swelling",
      "Fever, spreading redness, purulent drainage, foul odor, necrosis, or wound separation",
      "New chest pain, dyspnea, hypoxemia, unilateral swelling, or suspected embolism",
      "Uncontrolled bleeding, repeated falls, dangerous prosthetic injury, or suicidal intent"
    ], [
      "Inspect and wash the residual limb daily and stop wearing the prosthesis over broken skin because pressure injury can deepen quickly when sensation is altered.",
      "Follow positioning and exercise plans even when resting because prolonged hip or knee flexion can create contractures that limit prosthetic walking."
    ]),
    card("Anemia of chronic kidney disease", ["niddk-anemia-ckd"], [
      "Assess fatigue, dyspnea, chest symptoms, dizziness, bleeding, diet, dialysis losses, infection, and medication history because reduced erythropoietin commonly contributes but iron loss and other causes remain important.",
      "Trend hemoglobin, reticulocytes, ferritin, transferrin saturation, blood count indices, kidney function, inflammation, B12, folate, and occult blood when indicated because correctable deficiencies and bleeding alter treatment.",
      "Administer prescribed iron and erythropoiesis-stimulating therapy using dose, route, and blood-pressure safeguards because adequate substrate and stimulation improve red-cell production while excessive correction increases vascular risk.",
      "Monitor blood pressure, access patency, thrombosis, hemoglobin trajectory, iron response, dyspnea, chest pain, and treatment adverse effects because rapid rise or overshoot can harm cardiovascular and dialysis access safety.",
      "Escalate for ischemic chest pain, severe dyspnea, syncope, active bleeding, hypertensive crisis, acute neurologic deficit, or access thrombosis because profound anemia or treatment complications require urgent evaluation."
    ], [
      "Chest pain, resting dyspnea, syncope, hypoxemia, or signs of cardiac ischemia",
      "Active gastrointestinal or other bleeding with instability or rapid hemoglobin decline",
      "Severe hypertension, sudden neurologic deficit, seizure, or acute heart failure",
      "Painful absent access thrill, limb swelling, or suspected vascular thrombosis"
    ], [
      "Keep iron and anemia laboratory appointments because symptoms alone cannot show whether iron, erythropoietin treatment, bleeding evaluation, or another approach is needed.",
      "Report chest pain, fainting, worsening breathlessness, bleeding, severe headache, or loss of dialysis-access thrill because anemia and its treatment affect circulation."
    ]),
    card("Benzodiazepine intoxication", ["fda-benzodiazepines"], [
      "Assess airway, breathing, circulation, consciousness, pupils, glucose, temperature, trauma, dose, timing, formulation, and coingestants because isolated benzodiazepines often sedate while opioids, alcohol, or other depressants drive lethal respiratory failure.",
      "Support airway positioning, suction, oxygenation, ventilation, vascular access, and continuous observation because no laboratory level replaces repeated assessment of ventilation and protective reflexes.",
      "Monitor respiratory rate and quality, oxygenation, carbon dioxide when available, blood pressure, rhythm, temperature, aspiration, and neurologic trajectory because delayed absorption and coingestants can prolong or deepen toxicity.",
      "Use flumazenil only under toxicology-guided indications and seizure precautions because reversing chronic dependence or mixed proconvulsant overdose can precipitate refractory seizures or withdrawal.",
      "Escalate for apnea, rising carbon dioxide, hypoxemia, aspiration, hypotension, seizure, dangerous agitation, failure to awaken, or suspected opioid coexposure because advanced airway support, naloxone, and toxicology care may be required."
    ], [
      "Apnea, slow or shallow breathing, rising carbon dioxide, cyanosis, or severe hypoxemia",
      "Loss of airway reflexes, repeated vomiting, aspiration, or inability to protect the airway",
      "Hypotension, bradycardia, hypothermia, dysrhythmia, or circulatory shock",
      "Seizure, severe agitation, persistent coma, or suspected opioid or proconvulsant coingestion"
    ], [
      "Never combine benzodiazepines with opioids, alcohol, or unapproved sedatives because their breathing effects can add together unpredictably.",
      "Call emergency services for difficult arousal, slow breathing, blue color, or choking sounds and give naloxone when opioid exposure is possible."
    ]),
    card("Brain abscess", ["ncbi-brain-abscess"], [
      "Assess headache, fever, mental status, focal deficit, seizure, vomiting, ear, sinus or dental infection, endocarditis risk, trauma, surgery, and immune status because presentation is often incomplete and source clues guide treatment.",
      "Perform frequent neurologic and vital-sign checks and prepare contrast MRI or CT, blood cultures, and ordered source studies because lesion size, edema, mass effect, multiplicity, and organism risk determine urgency.",
      "Avoid lumbar puncture until the team excludes dangerous mass effect and administer prescribed antimicrobials, seizure therapy, and intracranial-pressure measures because pressure shifts can precipitate herniation while treatment delay permits extension.",
      "Monitor consciousness, pupils, strength, speech, seizures, temperature, sodium, medication toxicity, cultures, and serial imaging because abscess rupture, edema, ventriculitis, and treatment failure may develop despite initial improvement.",
      "Escalate for declining consciousness, unequal pupils, new deficit, repeated vomiting, seizure, bradycardia with hypertension, respiratory change, shock, or abrupt meningeal deterioration because herniation, rupture, status, and sepsis are emergencies."
    ], [
      "Declining consciousness, unequal pupils, posturing, or bradycardia with hypertension",
      "New focal weakness, aphasia, severe worsening headache, or repeated vomiting",
      "Seizure lasting five minutes or recurrent seizures without recovery",
      "Abrupt neck stiffness, high fever, hypotension, respiratory decline, or septic shock"
    ], [
      "Complete the entire antimicrobial course and keep imaging visits because symptoms can improve before the abscess and surrounding edema fully resolve.",
      "Seek emergency care for worsening headache, vomiting, weakness, speech change, seizure, or unusual sleepiness because pressure or rupture can progress quickly."
    ]),
    card("Burn shock", ["ncbi-burn-resuscitation"], [
      "Stop the burning process and assess airway, inhalation exposure, total-body-surface area, depth, associated trauma, age, weight, and comorbidity because burn size and airway injury determine resuscitation and transfer needs.",
      "Secure oxygenation, vascular access through unburned or burned tissue as needed, baseline laboratories, temperature protection, and burn-center consultation because edema, heat loss, carbon monoxide, and occult trauma worsen early shock.",
      "Give warmed balanced crystalloid using the ordered formula as a starting estimate and titrate to urine output and perfusion because calculated volume does not replace the patient's physiologic response.",
      "Monitor hourly urine, mental status, pulses, capillary refill, lactate, electrolytes, glucose, temperature, lung findings, edema, compartments, and abdominal pressure because both under-resuscitation and fluid creep cause organ injury.",
      "Escalate for airway swelling, worsening hypoxemia, falling urine output, refractory hypotension, absent limb pulses, tense compartments, rising airway pressures, or abdominal hypertension because inhalation injury, inadequate perfusion, and compartment syndromes require immediate intervention."
    ], [
      "Voice change, soot, facial burns, stridor, airway swelling, or rapidly worsening breathing",
      "Refractory hypotension, rising lactate, declining consciousness, or persistent oliguria",
      "Cold pulseless extremity, worsening pain, paresthesia, or tense circumferential burn",
      "Rising airway pressures, tense abdomen, reduced ventilation, or abdominal compartment findings"
    ], [
      "Do not apply ice, grease, or home remedies to a major burn because cold injury and contamination can deepen tissue damage and delay treatment.",
      "Keep the patient warm and seek emergency or burn-center care for large, deep, electrical, chemical, face, hand, genital, joint, or inhalation burns."
    ]),
    card("Cataracts", ["nei-cataracts"], [
      "Assess gradual blurred or dim vision, glare, halos, color change, night-driving difficulty, falls, unilateral symptoms, medicines, diabetes, trauma, and functional goals because cataract treatment is based on impairment and examination rather than lens opacity alone.",
      "Arrange visual acuity, refraction, slit-lamp and dilated retinal examination and review pressure or retinal disease because coexisting pathology may limit recovery or create a different urgent diagnosis.",
      "Support lighting, contrast, updated lenses, fall prevention, glucose control, smoking cessation, and surgical decision-making because modifiable hazards and function should be addressed while definitive lens replacement is planned.",
      "After surgery monitor pain, vision, redness, discharge, flashes, floaters, nausea, pressure symptoms, drop technique, and activity precautions because infection, pressure rise, retinal detachment, and wound complications threaten sight.",
      "Escalate immediately for sudden vision loss, severe eye pain, marked redness, purulent discharge, new curtain or flashes, severe headache, or vomiting because these findings are not expected uncomplicated cataract symptoms."
    ], [
      "Sudden vision loss, a dark curtain, new flashes, or a shower of floaters",
      "Severe eye pain, marked redness, photophobia, or purulent discharge after surgery",
      "Severe headache, nausea, vomiting, halos, or a hard painful eye",
      "Eye trauma, chemical exposure, rapidly worsening unilateral vision, or new neurologic deficit"
    ], [
      "Cataracts usually cause gradual painless clouding, so sudden pain or vision loss needs emergency evaluation for another eye disorder.",
      "Use postoperative drops and eye protection exactly as directed and avoid rubbing or straining because the incision needs time to seal safely."
    ]),
    card("Epispadias", ["chop-epispadias"], [
      "Inspect urethral opening, genital anatomy, bladder-exstrophy findings, urine stream, continence, skin, infection, and associated anomalies because epispadias ranges from isolated anatomy to a complex exstrophy-epispadias spectrum.",
      "Protect exposed mucosa with prescribed nonadherent moist care and avoid unnecessary instrumentation or circumcision decisions before urologic review because tissue preservation and atraumatic handling support reconstruction.",
      "Monitor urine output, stream, retention, leakage, skin breakdown, fever, pain, kidney and bladder imaging, and cultures when indicated because abnormal outlet and continence mechanisms increase urinary and skin complications.",
      "Coordinate pediatric urology, continence, renal, surgical, pain, developmental, and psychosocial care because reconstruction and bladder function often require staged long-term follow-up rather than one procedure.",
      "Escalate for inability to void, reduced urine, fever with flank pain, bleeding, dusky exposed tissue, wound separation, severe pain, or postoperative obstruction because urinary blockage, infection, ischemia, and repair complications need urgent treatment."
    ], [
      "Inability to void, markedly reduced urine output, bladder distention, or severe pain",
      "Fever, flank pain, vomiting, foul urine, lethargy, or suspected urinary sepsis",
      "Dusky exposed bladder or genital tissue, uncontrolled bleeding, or rapidly increasing swelling",
      "Postoperative wound separation, catheter blockage, urine leak, or loss of tissue perfusion"
    ], [
      "Use the specialist's skin, catheter, and moisture plan because exposed or reconstructed tissue is easily injured by friction, dryness, and infection.",
      "Keep long-term urology and continence visits even after repair because bladder control, urinary flow, kidney health, and psychosocial needs change with growth."
    ]),
    card("Human papillomavirus infection", ["cdc-hpv"], [
      "Assess lesion location, bleeding, pain, pregnancy, immune status, tobacco exposure, screening history, vaccination, partners, and patient concerns because HPV may cause transient infection, warts, precancer, or cancer depending on type and host factors.",
      "Use recommended cervical and site-specific screening, diagnostic follow-up, biopsy, and STI testing rather than visual assumption because oncogenic HPV changes are often silent and wart-causing types differ from cancer-associated types.",
      "Administer or refer for age-appropriate vaccination and prescribed lesion or dysplasia treatment because vaccination prevents new infections but does not remove existing HPV or replace abnormal-screen follow-up.",
      "Monitor healing, recurrence, screening results, immunosuppression, pregnancy-related lesion change, and emotional distress because lesions can recur and stigma may impair adherence more than physical symptoms.",
      "Escalate for heavy bleeding, obstructed urination or defecation, severe pain, rapidly enlarging or atypical lesion, pregnancy obstruction, or suspected invasive cancer because uncomplicated HPV infection should not cause organ compromise."
    ], [
      "Heavy unexplained genital, cervical, anal, or throat bleeding",
      "Urinary or bowel obstruction, severe pain, or rapidly enlarging destructive lesion",
      "Persistent hoarseness, dysphagia, neck mass, weight loss, or suspected head-and-neck cancer",
      "Pregnancy with obstructive lesions, significant bleeding, infection, or labor complication"
    ], [
      "HPV is common and may remain unnoticed for years, so a diagnosis does not prove recent exposure or infidelity.",
      "Complete vaccination and every recommended screening follow-up because vaccination prevents many new infections but cannot treat existing abnormal cells."
    ]),
    card("Hypospadias", ["cdc-hypospadias"], [
      "Inspect meatal location, chordee, foreskin, urine stream, testes, genital anatomy, and associated anomalies because severity and possible differences of sex development change evaluation and surgical planning.",
      "Do not circumcise before pediatric urology review and protect the area from trauma because foreskin may be needed for repair and premature tissue removal can limit options.",
      "Monitor urine output, stream direction, straining, retention, skin irritation, fever, pain, and postoperative catheter function because abnormal anatomy and repair can cause obstruction, fistula, infection, or wound problems.",
      "Coordinate timed surgical evaluation, pain control, catheter and dressing care, and developmentally appropriate family support because repair aims to improve urinary, sexual, and cosmetic function over long-term growth.",
      "Escalate for inability to void, severe swelling, dusky tissue, uncontrolled bleeding, fever, catheter blockage, wound separation, or urine leaking through a new opening because obstruction, ischemia, infection, and fistula need urgent review."
    ], [
      "Inability to urinate, bladder distention, markedly reduced output, or severe pain",
      "Dusky genital tissue, rapidly increasing swelling, or uncontrolled bleeding",
      "Fever, foul urine, vomiting, flank pain, or suspected urinary infection",
      "Postoperative catheter blockage, wound separation, or urine from a new fistula"
    ], [
      "Delay circumcision until pediatric urology evaluates the infant because foreskin tissue may be important for surgical reconstruction.",
      "Follow catheter, double-diaper, dressing, and activity instructions exactly because protecting the repair reduces infection, blockage, and fistula formation."
    ]),
    card("Laryngeal cancer", ["nci-laryngeal"], [
      "Assess persistent hoarseness, dysphagia, odynophagia, aspiration, stridor, cough, hemoptysis, neck mass, weight loss, tobacco and alcohol exposure, and communication needs because tumor location affects airway, voice, and swallowing early.",
      "Coordinate flexible examination, biopsy, neck and chest staging, nutrition, dental, speech-language, airway, and cardiopulmonary assessment because stage and functional reserve determine organ-preserving versus surgical treatment.",
      "Prepare prescribed radiation, systemic therapy, partial or total laryngectomy, tracheostomy, pain control, and enteral support because tumor control must be integrated with airway and nutrition preservation.",
      "Monitor airway patency, stoma, secretions, oxygenation, bleeding, swallowing, aspiration, weight, mucositis, skin, thyroid, communication, and treatment response because edema and therapy can compromise basic functions.",
      "Escalate for stridor, rapidly increasing work of breathing, stoma obstruction, major bleeding, neck swelling, aspiration with hypoxemia, fever during neutropenia, or wound breakdown because airway and postoperative complications are immediately dangerous."
    ], [
      "Stridor, severe retractions, rapidly worsening dyspnea, or inability to handle secretions",
      "Blocked or displaced laryngectomy tube, stoma obstruction, cyanosis, or respiratory arrest",
      "Major oral, airway, neck, or stoma bleeding with hemodynamic change",
      "Neck swelling, wound breakdown, salivary leak, aspiration, fever, or sepsis"
    ], [
      "After total laryngectomy, breathe only through the neck stoma and tell rescuers because oxygen at the nose alone cannot reach the lungs.",
      "Report worsening hoarseness, swallowing difficulty, neck mass, bleeding, or breathing noise promptly because recurrence or airway narrowing needs early assessment."
    ]),
    card("Reye syndrome", ["ninds-reye"], [
      "Ask about recent influenza or varicella, persistent vomiting, behavior change, sleepiness, seizure, and aspirin or salicylate exposure because Reye syndrome couples acute encephalopathy with hepatic mitochondrial dysfunction after viral illness.",
      "Perform frequent neurologic, airway, vital-sign, glucose, ammonia, liver, coagulation, electrolyte, and acid-base assessment because cerebral edema, hypoglycemia, hyperammonemia, and liver dysfunction may progress rapidly.",
      "Protect the airway, avoid hypotonic excess, treat glucose and intracranial-pressure problems as ordered, and minimize stimulation because secondary hypoxia and swelling worsen brain injury.",
      "Monitor pupils, consciousness, posturing, seizures, respiratory pattern, fluid balance, bleeding, temperature, and treatment response because neurologic deterioration can precede dramatic liver-test changes.",
      "Escalate for repeated vomiting with confusion, declining consciousness, unequal pupils, seizure, abnormal breathing, bradycardia with hypertension, bleeding, or hypoglycemia because cerebral edema and acute metabolic failure require intensive care."
    ], [
      "Persistent vomiting followed by confusion, unusual aggression, profound sleepiness, or coma",
      "Unequal pupils, posturing, seizure, bradycardia with hypertension, or abnormal breathing",
      "Severe hypoglycemia, hyperammonemia, coagulopathy, bleeding, or rapidly worsening liver tests",
      "Loss of airway reflexes, aspiration, hypoxemia, hypotension, or multiorgan instability"
    ], [
      "Never give aspirin or salicylate-containing products to a child with a viral illness unless a specialist specifically directs it.",
      "Seek emergency care for repeated vomiting with behavior change, unusual sleepiness, confusion, or seizure because early encephalopathy can worsen quickly."
    ]),
    card("Schistocytes", ["isth-ttp", "isth-dic"], [
      "Recognize fragmented red cells as evidence of mechanical microangiopathic injury because schistocytes are a morphology clue requiring context rather than a diagnosis by themselves.",
      "Assess bleeding, bruising, fever, neurologic symptoms, kidney injury, pregnancy, hypertension, infection, cancer, transplant, devices, and medicines because TTP, DIC, HELLP, mechanical valves, and other causes differ urgently.",
      "Trend smear review, platelet count, hemoglobin, reticulocytes, LDH, bilirubin, haptoglobin, creatinine, coagulation, fibrinogen, and ADAMTS13 testing when indicated because combined patterns separate microangiopathic syndromes.",
      "Monitor consciousness, strength, seizures, urine output, blood pressure, chest symptoms, perfusion, bleeding, and treatment response because small-vessel thrombosis and hemolysis can injure brain, heart, and kidneys rapidly.",
      "Escalate immediately for schistocytes with thrombocytopenia and neurologic or renal findings, severe hypertension, pregnancy organ injury, shock, or DIC because plasma-exchange or cause-specific emergency therapy must not await every result."
    ], [
      "Schistocytes with severe thrombocytopenia, confusion, seizure, weakness, or fever",
      "Oliguria, rapidly rising creatinine, severe hypertension, chest pain, or dyspnea",
      "Pregnancy or postpartum hemolysis with low platelets, liver injury, headache, or epigastric pain",
      "Active bleeding, prolonged coagulation, low fibrinogen, shock, or multiorgan dysfunction"
    ], [
      "A schistocyte result means red cells are being physically damaged, so urgent repeat blood and organ testing may be needed even without visible bleeding.",
      "Seek emergency care for confusion, weakness, severe headache, reduced urine, chest pain, or unusual bruising because microangiopathy can progress rapidly."
    ]),
    card("Systemic vascular resistance", ["ncbi-hemodynamics"], [
      "Relate systemic vascular resistance to the pressure gradient across systemic circulation divided by cardiac output because vascular tone affects afterload but cannot describe perfusion independently of flow.",
      "Assess blood pressure, mean arterial pressure, pulse pressure, heart rate, capillary refill, skin temperature, mental status, urine output, and lactate because the same pressure can occur with very different flow and resistance states.",
      "Review sepsis, hemorrhage, heart failure, spinal injury, endocrine crisis, temperature, ventilation, sedation, and vasoactive medicines because each changes vascular tone and cardiac output through different mechanisms.",
      "Monitor invasive or noninvasive hemodynamics, rhythm, extremity perfusion, urine, lactate, lung findings, and response during fluids or vasoactive titration because raising resistance can support pressure while worsening afterload and tissue flow.",
      "Escalate for refractory hypotension, rising lactate, oliguria, cold mottled skin, altered consciousness, ischemic chest pain, pulmonary edema, or dysrhythmia because persistent perfusion failure requires immediate cause-specific resuscitation."
    ], [
      "Refractory hypotension, rising lactate, oliguria, or worsening mental status",
      "Cold mottled extremities, delayed capillary refill, weak pulses, or limb ischemia",
      "Ischemic chest pain, dysrhythmia, acute pulmonary edema, or cardiogenic shock",
      "Severe hypertension with neurologic, cardiac, renal, or aortic injury findings"
    ], [
      "Blood pressure is not the same as blood flow, so clinicians also examine urine, mentation, skin, lactate, and heart function when judging perfusion.",
      "Never adjust vasoactive infusions independently because changing vascular resistance can improve pressure while increasing cardiac workload or reducing limb flow."
    ]),
    card("Time-dependent killing", ["ncbi-antibiotic-pd"], [
      "Verify organism, site, cultures, susceptibility, prescribed agent, dose, interval, infusion, renal and hepatic function, and allergies because efficacy depends on adequate active concentration above the MIC for enough time.",
      "Administer each dose and extended or continuous infusion at the exact scheduled time and document interruptions because delayed, compressed, or missed exposure reduces time above the susceptibility target.",
      "Obtain cultures and ordered concentrations at protocol-specific times and document sampling accurately because mistimed specimens can falsely suggest failure, resistance, or toxic accumulation.",
      "Monitor temperature, hemodynamics, oxygenation, source findings, cultures, blood count, kidney and liver function, rash, diarrhea, and neurologic toxicity because clinical response and agent-specific harm must be evaluated together.",
      "Escalate for shock, worsening organ dysfunction, persistent bacteremia, treatment-site progression, anaphylaxis, severe rash, encephalopathy, or uncontrolled diarrhea because source failure, resistance, allergy, and toxicity require urgent regimen reassessment."
    ], [
      "Persistent fever, hypotension, rising lactate, worsening cultures, or organ dysfunction",
      "Airway swelling, wheeze, hypotension, or rapidly spreading hypersensitivity reaction",
      "Severe blistering rash, mucosal injury, encephalopathy, seizure, or major cytopenia",
      "Profuse diarrhea with fever, abdominal distention, blood, dehydration, or ileus"
    ], [
      "Take doses at evenly prescribed times and complete the course unless the care team changes it because gaps reduce effective time above the bacterial target.",
      "Report allergy symptoms, severe diarrhea, confusion, reduced urine, or worsening infection because toxicity and treatment failure need prompt review rather than extra self-dosing."
    ]),
    card("End-stage renal disease", ["niddk-kidney-failure", "niddk-anemia-ckd"], [
      "Assess volume status, breathing, blood pressure, cognition, pruritus, nausea, nutrition, urine, access, medicines, dialysis adherence, goals, and transplant status because kidney failure affects every organ and treatment choices are individualized.",
      "Trend weight, intake and output, potassium, bicarbonate, sodium, calcium, phosphate, hemoglobin, urea, creatinine, nutrition markers, and adequacy measures because dangerous electrolyte, acid-base, volume, and hematologic changes may be clinically subtle.",
      "Protect dialysis access, adjust medicines for kidney failure, and provide prescribed dialysis, anemia, mineral-bone, blood-pressure, and nutrition therapies because replacement clears selected solutes but does not restore all endocrine and metabolic functions.",
      "Monitor lungs, rhythm, neurologic status, edema, skin, access thrill or bruit, infection, bleeding, falls, and treatment tolerance because pulmonary edema, dysrhythmia, uremia, access failure, and frailty require early recognition.",
      "Escalate for severe dyspnea, chest pain, hyperkalemic electrocardiographic change, pericardial symptoms, seizure, severe confusion, active bleeding, fever at access, or missed dialysis with decline because urgent kidney replacement or resuscitation may be needed."
    ], [
      "Severe dyspnea, pink frothy sputum, hypoxemia, or rapidly worsening pulmonary edema",
      "Severe hyperkalemia, electrocardiographic change, weakness, syncope, or dysrhythmia",
      "Chest pain with pericardial features, seizure, severe confusion, or uremic bleeding",
      "Absent access thrill, uncontrolled access bleeding, fever, pus, or rapidly spreading redness"
    ], [
      "Keep every dialysis session and call before missing one because potassium, acid, fluid, and uremic toxins can become dangerous before symptoms feel severe.",
      "Protect the access arm from blood pressures, venipuncture, tight clothing, and sleeping pressure because thrombosis or injury can eliminate the lifeline for dialysis."
    ]),
    card("Ketogenesis", ["ncbi-ketogenesis"], [
      "Connect low insulin and higher counterregulatory hormones with hepatic fatty-acid conversion into ketone bodies because fasting tissues gain fuel while excessive production can overwhelm buffering and cause acidosis.",
      "Assess diabetes, insulin access, fasting, vomiting, alcohol use, pregnancy, SGLT2 medicines, infection, nutrition, and symptoms because physiologic ketosis, starvation, alcoholic illness, and diabetic ketoacidosis require different treatment.",
      "Trend beta-hydroxybutyrate, glucose, pH, bicarbonate, anion gap, electrolytes, creatinine, osmolality, vital signs, intake, urine, and mental status because glucose alone can miss euglycemic ketoacidosis and potassium shifts.",
      "Give syndrome-specific fluids, insulin, dextrose, electrolytes, thiamine, nutrition, and precipitant treatment as ordered because stopping ketone production while preserving glucose and potassium safety requires coordinated therapy.",
      "Escalate for deep rapid breathing, severe dehydration, persistent vomiting, altered consciousness, shock, severe acidosis, or dysrhythmia because pathologic ketogenesis has progressed to a life-threatening metabolic emergency."
    ], [
      "Deep rapid breathing, severe dehydration, hypotension, or rising shock markers",
      "Persistent vomiting, severe abdominal pain, inability to hydrate, or falling consciousness",
      "Severe acidosis, rapidly changing potassium, electrocardiographic change, or dysrhythmia",
      "Positive ketones with illness during pregnancy, diabetes, or SGLT2-inhibitor use despite modest glucose"
    ], [
      "Ketones can appear during ordinary fasting, but vomiting, deep breathing, dehydration, confusion, or diabetes illness requires urgent testing for acidosis.",
      "Follow diabetes sick-day rules and never stop basal insulin without instructions because ketone production can accelerate even when little food is eaten."
    ]),
    card("Liver damage progression", ["niddk-cirrhosis", "nci-liver"], [
      "Identify alcohol, viral, metabolic, autoimmune, biliary, vascular, medication, and toxin drivers and assess fibrosis stage because stopping the cause can slow progression before decompensation becomes irreversible.",
      "Assess fatigue, nutrition, jaundice, pruritus, edema, ascites, bleeding, cognition, infection, medicines, and substance exposure because declining synthesis, detoxification, and portal flow produce linked multisystem effects.",
      "Trend bilirubin, albumin, INR, platelets, sodium, creatinine, liver enzymes, glucose, weight, imaging, elastography, and cancer surveillance because progression is measured by function and complications rather than transaminases alone.",
      "Provide cause-specific therapy, vaccination, nutrition, alcohol cessation, medication review, ascites and encephalopathy care, and transplant referral when indicated because complication control does not remove the underlying injury or limited reserve.",
      "Escalate for hematemesis, melena, fever with ascites, severe confusion, hypoglycemia, oliguria, rapidly increasing jaundice, dyspnea, or shock because variceal bleeding, peritonitis, encephalopathy, kidney injury, and acute-on-chronic failure are emergencies."
    ], [
      "Hematemesis, melena, syncope, hypotension, or rapidly falling hemoglobin",
      "Fever, abdominal pain, worsening ascites, tenderness, or suspected spontaneous bacterial peritonitis",
      "Severe confusion, inability to protect the airway, seizure, or profound hypoglycemia",
      "Oliguria, rapid jaundice, severe hyponatremia, respiratory decline, or shock"
    ], [
      "Normal or mildly elevated liver enzymes do not prove the liver is healthy because advanced scarring may leave fewer cells available to release enzymes.",
      "Avoid alcohol and unapproved herbs and keep cancer and variceal surveillance because treating the cause does not erase established cirrhosis risk."
    ]),
    card("PTSD", ["nimh-ptsd"], [
      "Assess trauma exposure only as needed, intrusive memories, avoidance, negative mood and beliefs, hyperarousal, sleep, duration, function, substances, pain, and supports because PTSD is a persistent trauma response affecting several symptom clusters.",
      "Screen directly for suicide, self-harm, violence, dissociation, psychosis, abuse, exploitation, housing danger, and firearm access because immediate safety can outweigh detailed diagnostic work.",
      "Use calm trauma-informed communication, choices, consent, predictable explanations, and grounding because restoring control reduces re-traumatization and helps the person remain engaged in care.",
      "Monitor nightmares, panic, dissociation, sleep, mood, substance use, function, medication effects, and psychotherapy response because recovery is longitudinal and comorbid depression or addiction may alter risk.",
      "Activate emergency mental-health and medical care for suicidal or homicidal intent, dangerous dissociation, psychosis, inability to care for basic needs, severe intoxication or withdrawal, or ongoing abuse because protection and stabilization come first."
    ], [
      "Suicidal or homicidal plan, dangerous command hallucinations, or weapon access",
      "Severe dissociation, unsafe wandering, psychosis, catatonia, or inability to provide self-care",
      "Dangerous intoxication or withdrawal, seizure, severe agitation, or medical instability",
      "Ongoing interpersonal violence, child or dependent danger, trafficking, or unsafe housing"
    ], [
      "You can decline unnecessary detail and ask for choices during care because trauma-informed treatment does not require forced retelling to prove symptoms.",
      "Use the written crisis and grounding plan and seek emergency help for suicidal thoughts or unsafe dissociation because acute risk deserves immediate support."
    ]),
    card("Allergic rhinitis", ["niaid-rhinitis"], [
      "Assess seasonal or perennial sneezing, itching, watery rhinorrhea, congestion, eye symptoms, triggers, sleep, asthma, sinus pain, medicines, pregnancy, and occupational exposure because pattern and comorbidity guide diagnosis and treatment.",
      "Inspect nasal and eye findings and distinguish infection, medication rebound, structural obstruction, foreign body, and nonallergic rhinitis because congestion alone does not establish an IgE-mediated cause.",
      "Teach allergen reduction, saline use, correct intranasal-spray direction, and prescribed steroid or antihistamine therapy because consistent local anti-inflammatory treatment works better than intermittent rescue for persistent symptoms.",
      "Monitor symptom control, sleep, school or work function, asthma, epistaxis, dryness, sedation, blood pressure, and decongestant use because undertreatment and medication adverse effects both impair safety.",
      "Escalate for airway swelling, wheeze, hypotension, severe asthma, unilateral bloody discharge, orbital swelling, high fever, or severe facial pain because anaphylaxis, airway disease, foreign body, or invasive infection exceeds uncomplicated rhinitis."
    ], [
      "Lip or tongue swelling, wheeze, stridor, hypotension, or rapidly progressive multisystem reaction",
      "Severe asthma symptoms, inability to speak normally, cyanosis, or poor bronchodilator response",
      "Unilateral foul or bloody discharge, suspected foreign body, or persistent obstruction",
      "Orbital swelling, vision change, high fever, severe headache, or intense facial pain"
    ], [
      "Aim nasal spray slightly outward away from the septum and use it consistently because correct technique improves coverage and reduces nosebleeds.",
      "Seek emergency help for throat swelling, wheeze, faintness, or rapidly spreading hives because those symptoms suggest anaphylaxis rather than isolated nasal allergy."
    ]),
    card("Anterior cerebral artery stroke", ["aha-stroke-2026"], [
      "Assess sudden contralateral leg-predominant weakness or sensory loss, abulia, behavior, speech, continence, gait, and exact onset because medial frontal and parietal ischemia creates a distinctive but variable pattern.",
      "Activate the stroke pathway, document last-known-well, check glucose, and prepare emergency brain and vascular imaging because reperfusion eligibility depends on time, tissue, vessel, and hemorrhage exclusion.",
      "Maintain airway, oxygenation, ordered blood-pressure targets, temperature, glucose, head position, and nothing-by-mouth status until swallowing is screened because secondary physiologic injury and aspiration worsen outcome.",
      "Monitor neurologic examination, leg strength, consciousness, behavior, rhythm, blood pressure, swallowing, bladder, mobility, and reperfusion complications because edema, hemorrhage, seizure, and immobility may alter the initial syndrome.",
      "Escalate for worsening deficit, declining consciousness, severe headache, vomiting, seizure, new hypoxemia, or reperfusion-related bleeding because recurrent occlusion, edema, and hemorrhagic transformation require immediate reassessment."
    ], [
      "Sudden leg-predominant weakness, new abulia, speech change, or loss of bladder control",
      "Worsening deficit, reduced consciousness, severe headache, vomiting, or unequal pupils",
      "Seizure lasting five minutes or recurrent seizures without neurologic recovery",
      "Hemodynamic instability, aspiration, severe hypoxemia, or bleeding after reperfusion treatment"
    ], [
      "Call emergency services for sudden leg weakness, speech change, severe imbalance, or unusual loss of initiative because ACA stroke still requires rapid reperfusion evaluation.",
      "Do not give food, drink, aspirin, or extra blood-pressure medicine before emergency assessment because swallowing, hemorrhage, and treatment eligibility must be checked first."
    ]),
    card("Autoinduction", ["fda-clinpharm"], [
      "Explain that a medicine can increase enzymes that accelerate its own metabolism because repeated exposure may lower concentrations over time even when the dose remains unchanged.",
      "Identify the exact inducing drug, start date, dose changes, adherence, formulation, symptoms, interacting medicines, smoking, pregnancy, and organ function because autoinduction magnitude and timing are drug-specific.",
      "Trend clinical response, toxicity, ordered concentrations, blood counts, liver tests, sodium, and interaction-sensitive therapies because early high exposure may later become subtherapeutic while induced clearance affects other drugs too.",
      "Keep administration and sampling times consistent and change doses only through the prescribing plan because unsupervised escalation during induction can become toxic if adherence or inhibition later changes.",
      "Escalate for breakthrough seizure, severe rash, fever, mucosal injury, jaundice, profound hyponatremia, cytopenia, suicidality, or dangerous loss of treatment effect because the pharmacokinetic change may coexist with serious drug toxicity."
    ], [
      "Breakthrough seizure, status epilepticus, acute mood destabilization, or dangerous treatment failure",
      "Blistering rash, mucosal sores, fever, facial swelling, or systemic hypersensitivity",
      "Jaundice, severe abdominal symptoms, marked liver-test rise, or major cytopenia",
      "Severe hyponatremia, confusion, seizure, syncope, or critical concentration mismatch"
    ], [
      "Take the medicine on schedule and keep concentration appointments because the body may clear some drugs faster after repeated exposure.",
      "Do not compensate for reduced effect with extra doses because induction, missed doses, and interactions must be separated before changing treatment."
    ]),
    card("BE-FAST, last-known-well, and wake-up stroke", ["aha-stroke-2026"], [
      "Use Balance, Eyes, Face, Arm, Speech, and Time to identify sudden focal neurologic change because posterior, visual, and coordination strokes may be missed by a face-arm-speech screen alone.",
      "Establish the exact last time the patient was known normal from the best witness, records, calls, or device data because discovery time is not onset time and treatment pathways depend on last-known-well.",
      "Activate emergency stroke transport, check glucose, keep the patient nothing by mouth, and bring medication and anticoagulant information because imaging and rapid contraindication review must occur without avoidable delay.",
      "Monitor airway, oxygenation, neurologic deficits, blood pressure, rhythm, glucose, swallowing, and time milestones because deterioration and missed handoffs can erase the benefit of a rapid first recognition.",
      "Escalate immediately for any sudden BE-FAST sign, even if it resolves or begins on waking, and for worsening consciousness, headache, vomiting, or seizure because TIA, wake-up stroke, hemorrhage, and large-vessel occlusion remain emergencies."
    ], [
      "Sudden balance loss, vision change, facial droop, arm weakness, or speech difficulty",
      "Unknown onset or awakening with a new focal neurologic deficit",
      "Worsening consciousness, severe headache, repeated vomiting, or unequal pupils",
      "Seizure, airway compromise, aspiration, severe hypoxemia, or hemodynamic instability"
    ], [
      "Call emergency services for any sudden BE-FAST sign even when it disappears because transient symptoms may precede a disabling stroke.",
      "Write down the last time the person was definitely normal, not merely when found ill, because this detail guides treatment eligibility."
    ]),
    card("Broca aphasia", ["aha-stroke-2026"], [
      "Assess nonfluent effortful speech, naming, repetition, comprehension, writing, frustration, right face and arm strength, and exact onset because dominant frontal language injury often preserves awareness while limiting expression.",
      "Activate the stroke pathway, document last-known-well, check glucose, and prepare emergency brain and vascular imaging because sudden expressive aphasia is a time-sensitive cortical deficit even without severe weakness.",
      "Use yes-or-no questions, communication boards, writing or gestures, sufficient response time, and one speaker because language output failure does not mean loss of intelligence or inability to understand.",
      "Monitor neurologic examination, blood pressure, rhythm, oxygenation, swallowing, aspiration, mood, frustration, and treatment complications because edema, hemorrhage, recurrent ischemia, and depression can worsen recovery.",
      "Escalate for new or worsening aphasia, weakness, reduced consciousness, severe headache, vomiting, seizure, or airway compromise because recurrent stroke, edema, and hemorrhagic transformation need immediate reassessment."
    ], [
      "Sudden inability to produce words, effortful speech, facial droop, or arm weakness",
      "Worsening language or motor deficit, reduced consciousness, or recurrent symptoms",
      "Severe headache, repeated vomiting, unequal pupils, or seizure",
      "Coughing with swallowing, wet voice, aspiration, hypoxemia, or airway compromise"
    ], [
      "Give extra response time and use writing, pictures, gestures, or yes-or-no choices because difficulty speaking does not equal lack of understanding.",
      "Call emergency services for sudden speech difficulty even if the person understands everything because expressive aphasia may be an acute stroke."
    ]),
    // WAVE33_COHORT_B_CARDS
  ];

  function canonicalPrimary(entry) {
    return String(entry && (entry.name || entry.title || entry.displayName) || "")
      .split(" / ")[0]
      .trim();
  }

  function normalizePrimary(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  const attempted = patches.map((patch) => patch.name);
  const appliedNames = [];
  const unresolved = [];
  const targetEntries = activePathologyEntries();

  if (!targetEntries.length) {
    unresolved.push({ name: "__database__", matchCount: 0, reason: "ANI_PATHOLOGY_DATABASE.diseases unavailable" });
  } else {
    patches.forEach((patch) => {
      const target = normalizePrimary(patch.name);
      const matches = targetEntries.filter((entry) => normalizePrimary(canonicalPrimary(entry)) === target);
      if (matches.length !== 1) {
        unresolved.push({ name: patch.name, matchCount: matches.length, reason: "normalized primary canonical title did not resolve exactly once" });
        return;
      }
      Object.assign(matches[0], {
        nursingPriorities: patch.nursingPriorities.slice(),
        redFlags: patch.redFlags.slice(),
        patientEducation: patch.patientEducation.slice()
      });
      appliedNames.push(patch.name);
    });
  }

  const names = patches.map((patch) => patch.name);
  window.ANI_PATHOLOGY_NURSING_WAVE33_B = {
    schemaVersion: 1,
    version: VERSION,
    cohort: COHORT,
    names: names.slice(),
    highRiskNames: names.slice(),
    cards: patches.map((patch) => ({ name: patch.name, sourceIds: patch.sourceIds.slice() })),
    sources: sources.map((source) => ({ ...source })),
    application: {
      attempted: attempted.slice(),
      appliedNames: appliedNames.slice(),
      unresolved: unresolved.map((item) => ({ ...item }))
    }
  };
})();
