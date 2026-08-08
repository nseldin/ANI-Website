(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  const VERSION = "2026-07-17-wave27-pathology-nursing-cohort-b-1";
  const COHORT = "B";

  const sources = [
    { id: "sccm-sepsis-2026", label: "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026", url: "https://www.sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines", note: "Supports organ-dysfunction recognition, antimicrobial timing, perfusion reassessment, vasoactive support, and source control." },
    { id: "cdc-clabsi-2025", label: "Centers for Disease Control and Prevention, Central Line-associated Bloodstream Infections", url: "https://www.cdc.gov/clabsi/index.html", note: "Supports line necessity review, aseptic access, dressing care, and rapid evaluation of suspected CLABSI." },
    { id: "aha-poisoning-2025", label: "American Heart Association, Adult and Pediatric Special Circumstances of Resuscitation: Poisoning", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation", note: "Supports toxin-specific stabilization, rhythm surveillance, antidotal treatment, and toxicology consultation." },
    { id: "hrsa-poison-help", label: "Health Resources and Services Administration, Poison Help", url: "https://poisonhelp.hrsa.gov/faq/calling-poison-help", note: "Supports immediate United States poison-center consultation for suspected poisoning and exposure-specific guidance." },
    { id: "who-snakebite", label: "World Health Organization, Snakebite Envenoming", url: "https://www.who.int/health-topics/snakebite", note: "Supports safe first aid, urgent antivenom-capable referral, and surveillance for systemic envenoming." },
    { id: "cdc-ssi", label: "Centers for Disease Control and Prevention, Surgical Site Infection", url: "https://www.cdc.gov/surgical-site-infections/about/index.html", note: "Supports prevention and recognition of superficial, deep, and organ-space surgical infection." },
    { id: "idsa-hap-vap", label: "ATS/IDSA Clinical Practice Guidelines for Hospital-acquired and Ventilator-associated Pneumonia", url: "https://www.idsociety.org/practice-guideline/hap_vap/", note: "Supports diagnostic sampling, severity assessment, local-antibiogram therapy, de-escalation, and response monitoring." },
    { id: "ash-vte-surgical", label: "American Society of Hematology, Prevention of VTE in Surgical Hospitalized Patients", url: "https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/vte-guidelines-prevention-in-surgical-hospitalized-patients", note: "Supports individualized mechanical and pharmacologic prophylaxis and prompt evaluation of suspected postoperative VTE." },
    { id: "ncs-enls-6", label: "Neurocritical Care Society, ENLS Version 6.0 Protocols", url: "https://www.neurocriticalcare.org/NCS-Learning-Center/ENLS/Protocols", note: "Supports first-hour assessment and escalation for coma, traumatic brain injury, seizures, and intracranial hypertension." },
    { id: "aha-pals-2025", label: "American Heart Association and American Academy of Pediatrics, Pediatric Advanced Life Support 2025", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support", note: "Supports pediatric seizure stabilization and age-appropriate respiratory and circulatory reassessment." },
    { id: "asam-alcohol-2020", label: "American Society of Addiction Medicine, Alcohol Withdrawal Management Guideline", url: "https://www.asam.org/quality-care/clinical-guidelines/alcohol-withdrawal-management-guideline", note: "Supports thiamine, withdrawal surveillance, seizure precautions, and escalation for complicated withdrawal." },
    { id: "acs-trauma", label: "American College of Surgeons, Trauma Quality Programs Best Practices", url: "https://www.facs.org/quality-programs/trauma/tqp/center-programs/tqp-best-practice/", note: "Supports structured trauma resuscitation, hemorrhage recognition, transfer, and complication prevention." },
    { id: "aba-burn-referral", label: "American Burn Association, Burn Patient Referral Guidelines", url: "https://ameriburn.org/resources/burnreferral/", note: "Supports immediate decontamination and burn-center consultation for chemical and high-risk burns." },
    { id: "aaos-hip-fracture", label: "American Academy of Orthopaedic Surgeons, Management of Hip Fractures in Older Adults", url: "https://www.aaos.org/quality/quality-programs/older-adult-fractures/management-of-hip-fractures-in-older-adults/", note: "Supports analgesia, delirium and pressure-injury prevention, timely surgery, and mobilization." },
    { id: "international-pressure-injury", label: "International Guideline for Prevention and Treatment of Pressure Ulcers/Injuries", url: "https://internationalguideline.com/", note: "Supports pressure redistribution, skin and perfusion assessment, nutrition, and escalation of deep tissue injury." },
    { id: "acog-antenatal-surveillance", label: "ACOG, Indications for Outpatient Antenatal Fetal Surveillance", url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2021/06/indications-for-outpatient-antenatal-fetal-surveillance", note: "Supports risk-based fetal surveillance for amniotic-fluid and growth abnormalities." },
    { id: "acog-fgr", label: "ACOG, Fetal Growth Restriction", url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2021/02/fetal-growth-restriction", note: "Supports serial growth and Doppler surveillance and escalation for placental insufficiency." },
    { id: "acog-macrosomia", label: "ACOG, Macrosomia", url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2020/01/macrosomia", note: "Supports risk assessment, glucose management, delivery planning, and neonatal surveillance." },
    { id: "acog-perinatal-mental-health", label: "ACOG, Screening and Diagnosis of Mental Health Conditions During Pregnancy and Postpartum", url: "https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2023/06/screening-and-diagnosis-of-mental-health-conditions-during-pregnancy-and-postpartum", note: "Supports depression screening, suicide and psychosis assessment, treatment linkage, and postpartum follow-up." },
    { id: "acc-heart-failure-2022", label: "AHA/ACC/HFSA Guideline for the Management of Heart Failure 2022", url: "https://www.acc.org/guidelines/guidelines/2022/03/30/16/38/2022-heart-failure", note: "Supports congestion, perfusion, renal and electrolyte monitoring and guideline-directed care." },
    { id: "acc-valve-2020", label: "ACC/AHA Guideline for the Management of Valvular Heart Disease 2020", url: "https://professional.heart.org/en/guidelines-statements/2020-accaha-guideline-for-the-management-of-patients-with-valvular-heartcir0000000000000923", note: "Supports valve-specific hemodynamic assessment, anticoagulation safety, imaging, and intervention escalation." },
    { id: "acc-acs-2025", label: "ACC/AHA Guideline for Acute Coronary Syndromes 2025", url: "https://www.acc.org/guidelines/guidelines/2025/02/27/17/21/acute-coronary-syndromes-2025", note: "Supports rapid ECG and biomarker pathways, ischemia surveillance, antithrombotic safety, and rehabilitation." },
    { id: "acc-bradycardia-2018", label: "ACC/AHA/HRS Guideline on Bradycardia and Cardiac Conduction Delay", url: "https://www.acc.org/guidelines/guidelines/2018/11/06/12/02/2018-guideline-on-the-evaluation-and-management-of-patients-with-bradycardia-and-cardiac-conduction-delay", note: "Supports symptom-rhythm correlation and escalation for unstable sinus-node dysfunction." },
    { id: "aha-als-2025", label: "American Heart Association, Adult Advanced Life Support 2025", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support", note: "Supports rhythm recognition and emergency response to unstable bradycardia and ventricular dysrhythmia." },
    { id: "acc-pad-2024", label: "ACC/AHA Lower Extremity Peripheral Artery Disease Guideline 2024", url: "https://professional.heart.org/en/guidelines-statements/2024-accahaaacvprapmaabcscaisvmsvnsvssirvess-guideline-for-the-management-ofcir0000000000001251", note: "Supports limb and wound assessment, vascular risk reduction, foot care, and urgent ischemia evaluation." },
    { id: "wfh-hemophilia", label: "World Federation of Hemophilia, Guidelines for the Management of Hemophilia", url: "https://www.wfh.org/what-we-do/resources/wfh-treatment-guidelines", note: "Supports prompt factor replacement, bleeding precautions, joint and intracranial bleed recognition, and inhibitor surveillance." },
    { id: "idsa-covid-2025", label: "Infectious Diseases Society of America, COVID-19 Treatment and Management Guideline", url: "https://www.idsociety.org/practice-guideline/covid-19-guideline-treatment-and-management/", note: "Supports severity-based treatment, oxygen and thrombosis surveillance, and avoidance of unsupported therapies." },
    { id: "nci-transplant", label: "National Cancer Institute, Stem Cell Transplants in Cancer Treatment", url: "https://www.cancer.gov/about-cancer/treatment/types/stem-cell-transplant", note: "Supports infection prevention and recognition of graft-versus-host and other transplant complications." },
    { id: "ese-hypoparathyroidism", label: "European Society of Endocrinology, Hypoparathyroidism Clinical Practice Guideline", url: "https://www.ese-hormones.org/publications/clinical-practice-guidelines/", note: "Supports calcium, phosphate, magnesium, renal, neurologic, and cardiac monitoring in hypoparathyroidism." },
    { id: "ada-hospital-2026", label: "American Diabetes Association, Diabetes Care in the Hospital 2026", url: "https://diabetesjournals.org/care/article/49/Supplement_1/S339/163925/16-Diabetes-Care-in-the-Hospital-Standards-of-Care", note: "Supports inpatient glucose surveillance, insulin safety, hypoglycemia prevention, and transition planning." },
    { id: "asge-choledocholithiasis", label: "American Society for Gastrointestinal Endoscopy, Choledocholithiasis Guideline", url: "https://www.asge.org/docs/default-source/guidelines/asge-guideline-on-the-role-of-endoscopy-in-the-evaluation-and-management-of-choledocholithiasis-2019.pdf", note: "Supports risk stratification, urgent biliary decompression for cholangitis, and post-procedure monitoring." },
    { id: "nice-perioperative-2020", label: "National Institute for Health and Care Excellence, Perioperative Care in Adults", url: "https://www.nice.org.uk/guidance/ng180", note: "Supports multimodal analgesia, early nutrition and mobilization, fluid reassessment, and postoperative recovery monitoring." },
    { id: "apa-schizophrenia-2020", label: "American Psychiatric Association, Treatment of Patients With Schizophrenia Guideline", url: "https://psychiatryonline.org/doi/abs/10.1176/appi.ajp.2020.177901", note: "Supports structured antipsychotic adverse-effect assessment including tardive dyskinesia." },
    { id: "sccm-padis-2025", label: "SCCM PADIS Guideline Focused Update 2025", url: "https://sccm.org/clinical-resources/guidelines/guidelines/focused-update-padis-guideline", note: "Supports validated delirium assessment, light sedation, mobilization, sleep protection, and family engagement." },
    { id: "aarc-guidelines", label: "American Association for Respiratory Care, Clinical Practice Guidelines", url: "https://www.aarc.org/resource/clinical-practice-guidelines/", note: "Supports oxygen, airway, suction, ventilator, and postoperative pulmonary-care practices." },
    { id: "aao-ocular-trauma", label: "American Academy of Ophthalmology EyeWiki, Ocular Trauma", url: "https://eyewiki.org/Ocular_Trauma", note: "Supports immediate eye protection, avoidance of pressure, visual assessment, and urgent ophthalmology referral." },
    { id: "aabb-circular", label: "AABB, Circular of Information for Human Blood and Blood Components", url: "https://www.aabb.org/news-resources/resources/circular-of-information", note: "Supports bleeding and transfusion-reaction precautions in cytopenic and anticoagulated patients." },
    { id: "asco-idsa-neutropenia", label: "ASCO/IDSA Guideline for Fever and Neutropenia in Adults Treated for Malignancy", url: "https://www.idsociety.org/practice-guideline/fever-and-neutropenia-in-adults-with-cancer/", note: "Supports immediate fever triage, antimicrobial treatment, and high-risk complication monitoring in neutropenia." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const patches = [
    card("Distributive shock", ["sccm-sepsis-2026"], [
      "Activate the shock response, apply continuous cardiac and oxygen monitoring, and obtain reliable vascular access because pathologic vasodilation can collapse organ perfusion even when the skin initially appears warm.",
      "Obtain ordered lactate, blood cultures, blood count, metabolic studies, and source-specific specimens without delaying time-critical treatment because the underlying trigger determines whether antimicrobials, epinephrine, or another targeted therapy is needed.",
      "Administer prescribed crystalloid in measured steps and reassess blood pressure, capillary refill, lung sounds, mentation, and urine output after each step because indiscriminate fluid can worsen pulmonary edema without correcting vasoplegia.",
      "Prepare and titrate ordered vasopressor therapy to the individualized perfusion target because persistent vasodilation after appropriate volume assessment requires vascular tone support.",
      "Trend lactate direction, extremity temperature, mottling, urine output, creatinine, oxygen need, and consciousness to detect evolving kidney, lung, and brain injury.",
      "Escalate immediately for refractory hypotension, rising lactate, new confusion, oliguria, increasing oxygen requirement, or mottled cool skin because these findings indicate worsening shock or mixed myocardial failure."
    ], [
      "Hypotension or poor perfusion persisting after initial protocol-directed resuscitation",
      "Rising lactate, worsening mottling, or delayed capillary refill",
      "New confusion, oliguria, or rapidly increasing oxygen need",
      "Recurrent instability or need for escalating vasopressor support"
    ], [
      "Explain that distributive shock is a circulation emergency in which blood vessels lose effective tone, so frequent reassessment is needed even after the blood pressure first improves.",
      "Teach the patient and family to report recurrent chills, breathing difficulty, chest discomfort, faintness, reduced urine, or new confusion immediately."
    ]),
    card("Central line-associated bloodstream infection", ["cdc-clabsi-2025", "sccm-sepsis-2026"], [
      "Assess the insertion site, dressing integrity, line necessity, and every lumen before access because breaks in the closed sterile system permit organisms to enter the bloodstream.",
      "Perform hand hygiene, disinfect the connector for the required contact time, and use aseptic technique for every entry because hub contamination is a preventable route to CLABSI.",
      "Obtain ordered peripheral and line blood cultures before antibiotics when this will not delay treatment because paired cultures help distinguish line infection from another source.",
      "Administer prescribed antimicrobials promptly and coordinate line removal or salvage decisions with the treating and vascular-access teams because antibiotics alone may not clear an infected device or biofilm.",
      "Trend temperature, rigors during infusion, blood pressure, lactate, mental status, urine output, culture clearance, and local erythema or drainage to detect sepsis and persistent bacteremia.",
      "Escalate immediately for hypotension, shaking rigors, new confusion, rising lactate, purulent drainage, tunnel tenderness, or persistent positive cultures because septic shock, endocarditis, or metastatic infection may be developing."
    ], [
      "Rigors or sudden instability during line infusion or flushing",
      "Hypotension, rising lactate, new confusion, or oliguria",
      "Purulence, spreading erythema, tunnel tenderness, or exposed catheter",
      "Persistent bacteremia or fever despite appropriate treatment"
    ], [
      "Explain that a central line provides direct bloodstream access, so clean hands and keeping the dressing dry and intact are essential rather than cosmetic steps.",
      "Teach the patient not to manipulate the hubs and to report fever, chills, drainage, pain, a loose dressing, or a change in catheter length promptly."
    ]),
    card("Anticholinergic toxicity", ["aha-poisoning-2025", "hrsa-poison-help"], [
      "Secure a low-stimulation environment, institute fall precautions, and monitor airway, breathing, temperature, rhythm, and consciousness because severe antimuscarinic delirium can progress to hyperthermia, seizure, or dysrhythmia.",
      "Remove excess clothing, begin external cooling as indicated, and avoid relying on antipyretics because the high temperature results from impaired sweating and agitation rather than a changed hypothalamic set point.",
      "Check bedside glucose and obtain ordered ECG, electrolytes, creatine kinase, renal studies, and toxicology evaluation because coingestants and prolonged agitation can cause conduction delay and rhabdomyolysis.",
      "Provide prescribed benzodiazepine treatment for dangerous agitation or seizure and prepare antidotal therapy only with poison-center or toxicology direction because physostigmine has important conduction and coingestion contraindications.",
      "Maintain strict intake and output and assess bladder distention and bowel activity because urinary retention and ileus can prolong distress and drug absorption.",
      "Escalate immediately for QRS widening, ventricular dysrhythmia, seizure, severe hyperthermia, coma, hypotension, or escalating restraint needs because advanced airway and toxin-specific resuscitation may be required."
    ], [
      "Severe hyperthermia, seizure, or decreasing consciousness",
      "QRS widening, ventricular dysrhythmia, or hypotension",
      "Marked urinary retention, ileus, or worsening abdominal distention",
      "Agitation that cannot be managed without unsafe force or deep sedation"
    ], [
      "Explain that common sleep, allergy, bladder, nausea, and psychiatric medicines can add anticholinergic effects, so a complete medication review matters.",
      "Tell patients and caregivers to contact Poison Help immediately after a suspected overdose and not to induce vomiting or try a home antidote."
    ]),
    card("Cholinergic crisis", ["aha-poisoning-2025", "hrsa-poison-help"], [
      "Protect staff with exposure-appropriate personal protective equipment and remove contaminated clothing before routine care because organophosphate or carbamate residue can poison rescuers and continue patient absorption.",
      "Prioritize suction, oxygenation, and assisted ventilation because copious secretions, bronchospasm, and respiratory-muscle weakness are the immediate causes of death.",
      "Place the patient on continuous rhythm and oxygen monitoring and assess pupils, secretions, fasciculations, strength, bowel activity, and consciousness because both muscarinic and nicotinic effects guide treatment response.",
      "Administer ordered atropine to drying of dangerous respiratory secretions and prescribed oxime therapy when indicated because heart rate alone does not show adequate reversal of airway toxicity.",
      "Trend blood gases, electrolytes, cholinesterase testing when ordered, temperature, urine output, and recurrent weakness to detect respiratory failure and intermediate syndrome.",
      "Escalate immediately for increasing secretions, hypoxemia, bradycardia with poor perfusion, generalized weakness, seizure, or recurrent symptoms after improvement because rapid intubation and repeated antidote may be needed."
    ], [
      "Copious secretions, severe bronchospasm, or falling oxygen saturation",
      "Generalized weakness, shallow breathing, or rising carbon dioxide",
      "Bradycardia with hypotension, seizure, or coma",
      "Recurrent cholinergic findings after apparent stabilization"
    ], [
      "Explain that contaminated clothing and skin can keep releasing pesticide, so decontamination protects both the patient and everyone nearby.",
      "Teach household members never to enter a contaminated area without trained help and to call emergency services and Poison Help after suspected exposure."
    ]),
    card("Iron poisoning", ["aha-poisoning-2025", "hrsa-poison-help"], [
      "Contact Poison Help or a medical toxicologist immediately and establish continuous hemodynamic monitoring because severe iron poisoning can progress from gastrointestinal injury to shock even after a deceptive symptom-free interval.",
      "Assess timing, formulation, possible amount, vomiting, abdominal pain, bleeding, mental status, and perfusion while preserving the container because exposure details determine testing and decontamination decisions.",
      "Obtain ordered serial iron concentrations at the correct post-ingestion time, blood gas, glucose, electrolytes, liver tests, coagulation studies, and abdominal imaging because one early value can miss ongoing absorption.",
      "Administer prescribed intravenous fluids and prepare deferoxamine under toxicology direction because chelation is indicated by systemic toxicity and kinetics rather than stool color alone.",
      "Trend anion-gap acidosis, lactate, blood pressure, urine output, hepatic function, bleeding, and consciousness to detect mitochondrial toxicity, coagulopathy, and liver failure.",
      "Escalate immediately for persistent vomiting or hematemesis, metabolic acidosis, lethargy, hypotension, rising liver tests, coagulopathy, or shock because critical care and transplant-capable consultation may be required."
    ], [
      "Metabolic acidosis, hypotension, or worsening perfusion",
      "Hematemesis, severe abdominal pain, or persistent vomiting",
      "Lethargy, seizure, or decreasing consciousness",
      "Rising aminotransferases, coagulopathy, hypoglycemia, or jaundice"
    ], [
      "Explain that a quiet period after vomiting does not prove recovery because serious cellular and liver toxicity can emerge later.",
      "Store prenatal vitamins and iron tablets locked away like prescription drugs, and call Poison Help rather than waiting for symptoms after an accidental ingestion."
    ]),
    card("Snake bite", ["who-snakebite", "hrsa-poison-help"], [
      "Move the patient away from the snake, keep the bitten limb still near heart level, remove rings and tight items, and mark swelling progression because muscle activity and constriction can worsen venom spread and ischemia.",
      "Do not cut, suck, ice, electrically shock, or apply an arterial tourniquet because these measures add tissue injury without removing clinically meaningful venom.",
      "Assess airway, breathing, neurologic strength, bleeding, pulses, pain, and serial limb circumference while obtaining ordered blood count, coagulation, fibrinogen, renal studies, and urinalysis because envenoming may be neurotoxic, coagulopathic, myotoxic, or nephrotoxic.",
      "Establish monitored intravenous access, provide prescribed analgesia, and prepare antivenom with resuscitation equipment available because antivenom can stop progression but can also cause acute hypersensitivity.",
      "Trend swelling across joints, systemic bleeding, ptosis, weakness, urine color and output, creatine kinase, and coagulation response to detect compartment, respiratory, renal, and hematologic complications.",
      "Escalate immediately for rapidly advancing swelling, systemic bleeding, hypotension, ptosis or weakness, breathing difficulty, dark urine, oliguria, or antivenom reaction because repeated antivenom and critical support may be required."
    ], [
      "Rapid swelling progression across a major joint or threatened perfusion",
      "Ptosis, bulbar weakness, shallow breathing, or falling oxygen saturation",
      "Systemic bleeding, incoagulable blood, hypotension, or syncope",
      "Dark urine, oliguria, severe muscle pain, or acute antivenom reaction"
    ], [
      "Teach the patient to photograph the snake only from a safe distance if possible; capturing or killing it risks another bite and should never delay transport.",
      "Explain that swelling and clotting problems can recur, so scheduled laboratory and wound follow-up remains important after antivenom and discharge."
    ]),
    card("Surgical site infection", ["cdc-ssi", "sccm-sepsis-2026"], [
      "Inspect the incision and surrounding tissue for separation, increasing pain, warmth, erythema, drainage, odor, fluctuance, or crepitus because deep or organ-space infection may be more serious than the visible skin change.",
      "Use hand hygiene and aseptic wound technique, obtain ordered cultures from appropriate deep material, and avoid routine surface swabbing because contamination can obscure the actual pathogen.",
      "Administer prescribed antimicrobials and coordinate timely opening, drainage, imaging, or operative source control because an abscess or infected prosthetic space cannot reliably be cured by antibiotics alone.",
      "Trend temperature, blood pressure, glucose, white count, lactate, wound dimensions, drainage, pain, and functional decline to detect sepsis and treatment failure.",
      "Support protein and calorie intake, glycemic management, mobility, and smoking cessation because oxygenation and substrate availability influence tissue healing and immune defense.",
      "Escalate immediately for hypotension, rapidly spreading erythema, pain out of proportion, crepitus, bullae, wound dehiscence with exposed tissue, purulent deep drainage, or new organ dysfunction because necrotizing or organ-space infection may require emergency surgery."
    ], [
      "Rapidly spreading erythema, crepitus, bullae, or pain out of proportion",
      "Wound dehiscence, exposed fascia, or sudden copious drainage",
      "Hypotension, rising lactate, new confusion, or oliguria",
      "Persistent fever or purulence despite appropriate therapy"
    ], [
      "Teach hand hygiene before wound care and show the patient how to observe the incision without probing or applying unapproved products.",
      "Tell the patient to report increasing pain, redness, drainage, fever, separation, or a new foul odor promptly rather than waiting for the routine postoperative visit."
    ]),
    card("Postoperative pneumonia", ["idsa-hap-vap", "nice-perioperative-2020"], [
      "Assess cough strength, breath sounds, work of breathing, oxygen requirement, temperature, swallowing safety, sedation, and mobility because atelectasis, aspiration, and infection often coexist after surgery.",
      "Position upright, mobilize as soon as safe, coach deep breathing and supported coughing, and provide oral care because lung expansion and reduced oropharyngeal burden lower secretion retention and aspiration risk.",
      "Obtain ordered respiratory and blood cultures before antibiotics when feasible without delaying therapy because microbiology allows narrowing and distinguishes resistant hospital pathogens.",
      "Administer prescribed antibiotics and analgesia while avoiding unnecessary oversedation because pain limits ventilation but excessive sedation suppresses cough and airway protection.",
      "Trend oxygen need, respiratory rate, secretions, temperature, white count, imaging, hemodynamics, and response at 48 to 72 hours to detect respiratory failure, abscess, or sepsis.",
      "Escalate immediately for rapidly increasing oxygen need, respiratory fatigue, hypotension, confusion, rising lactate, absent breath sounds, or failure to improve because empyema, obstruction, embolism, or resistant infection may be present."
    ], [
      "Rapidly increasing oxygen requirement or respiratory fatigue",
      "Hypotension, new confusion, rising lactate, or oliguria",
      "Sudden unilateral absent breath sounds or acute pleuritic deterioration",
      "Persistent fever and worsening infiltrates despite appropriate therapy"
    ], [
      "Explain that walking, upright meals, mouth care, and supported coughing help prevent secretions and food material from settling in the lungs.",
      "Teach the patient to splint the incision, use prescribed breathing equipment correctly, and report worsening breathlessness, fever, confusion, or bloody sputum."
    ]),
    card("Deep vein thrombosis after surgery", ["ash-vte-surgical"], [
      "Compare both legs for swelling, warmth, color, tenderness, and circumference and assess catheter and operative risk factors because postoperative venous stasis and endothelial injury can produce an initially subtle clot.",
      "Do not massage a suspected thrombosed limb and limit activity until the diagnostic and treatment plan is clarified because manipulation does not dissolve clot and may worsen pain or embolic risk.",
      "Apply ordered mechanical prophylaxis correctly and promote frequent ambulation and leg exercises when safe because intermittent compression and calf-muscle pumping reduce venous stasis.",
      "Administer prescribed anticoagulation after verifying bleeding risk, neuraxial-catheter timing, renal function, and recent surgery because thrombosis prevention must be balanced against operative-site or spinal bleeding.",
      "Monitor platelet count, hemoglobin, wound drainage, stool and urine blood, limb findings, chest symptoms, and oxygenation to detect bleeding, clot extension, or pulmonary embolism.",
      "Escalate immediately for sudden dyspnea, pleuritic chest pain, hemoptysis, syncope, tachycardia with hypoxemia, phlegmasia, or neurovascular compromise because pulmonary embolism or limb-threatening venous obstruction may be occurring."
    ], [
      "Sudden dyspnea, pleuritic chest pain, hemoptysis, syncope, or hypoxemia",
      "Rapidly increasing whole-limb swelling, cyanosis, or severe pain",
      "Falling hemoglobin, uncontrolled wound bleeding, or new neurologic deficit on anticoagulation",
      "Thrombocytopenia with new thrombosis after heparin exposure"
    ], [
      "Teach the reason for early walking, ankle pumps, compression devices, and prescribed anticoagulant doses even when the incision feels more urgent than clot prevention.",
      "Tell the patient to seek emergency help for sudden chest pain, breathlessness, fainting, or coughing blood and to report unilateral leg swelling promptly."
    ]),
    card("Diffuse axonal injury", ["ncs-enls-6", "acs-trauma"], [
      "Maintain cervical-spine protection while securing oxygenation and ventilation because hypoxemia and hypotension compound microscopic axonal injury even when initial imaging is unrevealing.",
      "Perform serial Glasgow Coma Scale, pupil, motor, brainstem-reflex, and posturing assessments using a consistent sedation-aware baseline because neurologic trend is more informative than one examination.",
      "Keep the head midline with ordered elevation, prevent fever, and avoid venous obstruction because impaired cerebral drainage can raise intracranial pressure around injured tissue.",
      "Monitor blood pressure, oxygenation, carbon dioxide, sodium, glucose, temperature, urine output, and intracranial pressure when present to prevent secondary brain injury.",
      "Use aspiration, seizure, pressure-injury, corneal, contracture, and venous-thromboembolism precautions because prolonged coma removes normal protective movement and reflexes.",
      "Escalate immediately for a falling motor score, new anisocoria, recurrent vomiting, seizure, bradycardia with hypertension, or unexplained hypoxemia or hypotension because expanding injury, herniation, or extracranial trauma must be excluded."
    ], [
      "Falling Glasgow Coma Scale or motor score not explained by sedation",
      "New unequal or nonreactive pupils, posturing, or Cushing physiology",
      "Seizure, repeated vomiting, or abrupt agitation",
      "Hypoxemia or hypotension that threatens cerebral perfusion"
    ], [
      "Explain that diffuse axonal injury disrupts communication across many microscopic nerve fibers, so severe impaired consciousness can occur without a large visible mass on the first scan.",
      "Prepare families for repeated examinations and staged prognosis because sedatives, swelling, seizures, and time all affect when neurologic function can be judged reliably."
    ]),
    card("Subdural hematoma", ["ncs-enls-6", "acs-trauma"], [
      "Protect the airway and cervical spine, prevent hypoxemia and hypotension, and establish a sedation-aware neurologic baseline because secondary insults can enlarge the functional brain injury around the hematoma.",
      "Trend Glasgow Coma Scale components, pupils, limb strength, speech, headache, vomiting, and behavior at the ordered frequency because venous bleeding may expand gradually before abrupt deterioration.",
      "Identify anticoagulants, antiplatelet drugs, liver disease, alcohol use, and the time of injury; obtain ordered coagulation studies and facilitate reversal because ongoing coagulopathy can accelerate expansion.",
      "Keep the head midline with ordered elevation, avoid tight neck devices, control fever, and minimize coughing or straining because impaired venous drainage can raise intracranial pressure.",
      "Maintain seizure, aspiration, fall, skin, and venous-thromboembolism precautions while coordinating repeat imaging and neurosurgical review.",
      "Escalate immediately for a two-point Glasgow Coma Scale decline, new anisocoria, new weakness, seizure, repeated vomiting, or bradycardia with hypertension because these may signal expansion or herniation."
    ], [
      "Declining consciousness, new confusion, or inability to awaken",
      "Unequal or nonreactive pupils, new weakness, or posturing",
      "Seizure, repeated vomiting, or rapidly worsening headache",
      "Bradycardia with hypertension, irregular breathing, or acute anticoagulant-associated bleeding"
    ], [
      "Explain that symptoms can worsen hours after a head injury because blood may collect slowly between the brain and its covering; new sleepiness is not something to simply sleep off.",
      "After discharge, have a responsible adult observe the patient and seek emergency care for worsening headache, vomiting, confusion, weakness, seizure, or difficulty waking."
    ]),
    card("Coma", ["ncs-enls-6"], [
      "Open and protect the airway with cervical-spine precautions when trauma is possible, assess breathing and circulation, and treat hypoxemia or hypotension because the unconscious patient cannot protect ventilation or cerebral perfusion.",
      "Check bedside glucose immediately and treat a dangerous result without waiting for other tests because hypoglycemia is rapidly reversible but can cause permanent injury if missed.",
      "Document Glasgow Coma Scale components, pupils, gaze, corneal and cough reflexes, motor symmetry, temperature, and medication or sedation timing because the pattern helps localize structural, metabolic, or toxic causes.",
      "Obtain collateral history for onset, trauma, seizure, toxins, medications, infection, and last-known-well time; facilitate ordered laboratory tests, toxicology evaluation, imaging, and electroencephalography.",
      "Use aspiration, eye, oral, pressure-injury, contracture, urinary, bowel, and venous-thromboembolism precautions because absent protective reflexes and movement create preventable secondary harm.",
      "Escalate immediately for hypoventilation, new focal asymmetry, nonreactive pupils, seizure, fever with meningismus, shock, or failure to improve after a reversible cause is treated."
    ], [
      "Apnea, ineffective breathing, absent gag, or falling oxygen saturation",
      "New unequal pupils, focal weakness, posturing, or abrupt Glasgow Coma Scale decline",
      "Ongoing seizure activity, unexplained fever with neck stiffness, or shock",
      "Persistent unresponsiveness after glucose, oxygenation, or medication effects are addressed"
    ], [
      "Tell families that coma is a state, not a single diagnosis; repeated examinations and tests are needed to identify whether the cause is structural, metabolic, infectious, toxic, or seizure-related.",
      "Encourage calm familiar speech and orientation while avoiding promises about recovery, because sedatives and reversible physiologic problems can temporarily obscure the neurologic examination."
    ]),
    card("Focal seizure", ["ncs-enls-6"], [
      "Time the event and describe onset, awareness, eye or head deviation, speech, automatisms, and which limb moves first because these lateralizing details help identify the seizure focus and distinguish mimics.",
      "Protect the head, clear hazards, loosen restrictive clothing, and position for drainage when feasible; do not restrain the patient or place anything in the mouth because restraint and oral objects cause injury without stopping the seizure.",
      "Assess airway, oxygenation, circulation, and bedside glucose, provide oxygen or suction as needed, and obtain vascular access because hypoxemia and hypoglycemia can prolong injury and are treatable.",
      "Administer ordered rescue antiseizure medication for a prolonged or repeating event and monitor respiratory rate, blood pressure, and sedation after each dose.",
      "After motor activity stops, repeat speech, pupil, strength, sensation, and awareness assessments because Todd paralysis may resolve, whereas persistent new deficits can represent stroke or another structural lesion.",
      "Activate emergency escalation for a seizure lasting five minutes, recurrent seizures without recovery, impaired ventilation, pregnancy, significant injury, or a new persistent focal deficit."
    ], [
      "Seizure lasting five minutes or recurrent seizures without return to baseline",
      "Cyanosis, apnea, aspiration, or persistent oxygen desaturation",
      "New weakness, aphasia, unequal pupils, or severe headache after the event",
      "First seizure with pregnancy, fever, poisoning, trauma, or significant injury"
    ], [
      "Teach witnesses to time the seizure, move hazards, cushion the head, turn the person on the side when safe, and never hold them down or put an object in the mouth.",
      "Explain that a focal seizure may begin with subtle staring, speech arrest, unusual sensations, or one-sided movement; recording those first features helps the clinician localize the cause."
    ]),
    card("Febrile seizure", ["aha-pals-2025"], [
      "Protect the child from injury, place them on the side when possible, time the seizure, and assess airway and breathing because prolonged convulsions can impair ventilation even though most febrile seizures stop spontaneously.",
      "Check temperature, age, immunization status, illness symptoms, hydration, and neurologic recovery; obtain glucose when clinically indicated because fever may coexist with hypoglycemia or a serious infection.",
      "Do not restrain the child, force objects or medicine into the mouth, or use ice or alcohol rubs because these measures cause harm and do not terminate the seizure.",
      "Administer ordered rescue medication when the seizure reaches the emergency threshold, then reassess respiratory effort, oxygenation, circulation, and sedation.",
      "Evaluate the fever source and watch for meningismus, petechiae, persistent lethargy, focal findings, or poor perfusion because the priority is identifying serious illness rather than treating the temperature number alone.",
      "Escalate for a seizure lasting five minutes, focal or repeated seizures, failure to return toward baseline, age outside the usual six-month to five-year range, or signs of meningitis or sepsis."
    ], [
      "Seizure lasting five minutes, focal activity, or recurrence within the same illness",
      "Neck stiffness, petechiae, toxic appearance, poor perfusion, or respiratory distress",
      "Persistent altered consciousness or new weakness after the seizure",
      "First event in an infant younger than six months or a child older than five years"
    ], [
      "Reassure caregivers that a brief simple febrile seizure is frightening but usually does not cause brain damage; lowering fever may improve comfort but does not reliably prevent another seizure.",
      "Teach caregivers to time any future event, protect the child on a safe surface, call emergency services at five minutes, and seek urgent care sooner for breathing difficulty, stiff neck, a purple rash, or poor recovery."
    ]),
    card("Postictal state", ["ncs-enls-6"], [
      "Position the patient laterally when safe, maintain airway patency, suction secretions, and reassess oxygenation because depressed reflexes after a seizure increase aspiration and hypoventilation risk.",
      "Check bedside glucose and obtain a focused neurologic examination including pupils, speech, strength, and sensation because persistent metabolic derangement or stroke can be mistaken for routine postictal sleepiness.",
      "Record the time the seizure stopped, rescue medications, baseline cognition, and the trajectory of recovery because a postictal state should gradually improve rather than remain static or worsen.",
      "Inspect for tongue injury, head trauma, shoulder dislocation, incontinence-related skin exposure, and rhabdomyolysis risk after prolonged convulsions.",
      "Reduce stimulation, reorient calmly, maintain fall precautions, and avoid oral intake until alertness and swallowing are safe because confusion and poor coordination commonly persist temporarily.",
      "Escalate for failure to improve, recurrent subtle or overt seizure, new persistent focal deficit, severe headache, fever, hypoxia, or worsening consciousness because nonconvulsive status or another acute brain process may be present."
    ], [
      "No progressive return toward baseline or worsening consciousness",
      "Recurrent twitching, eye deviation, unresponsiveness, or other possible nonconvulsive seizure signs",
      "Persistent new weakness, aphasia, unequal pupils, or severe headache",
      "Hypoxia, fever, significant trauma, or prolonged agitation that threatens safety"
    ], [
      "Explain that temporary sleepiness, headache, confusion, or muscle soreness can follow a seizure, but the person should steadily become more like their usual self.",
      "Tell caregivers to seek urgent help if another seizure starts, breathing is abnormal, a new one-sided deficit appears, or recovery stalls instead of progressing."
    ]),
    card("Wernicke encephalopathy", ["asam-alcohol-2020"], [
      "Administer prescribed parenteral thiamine promptly before or with carbohydrate when feasible because glucose metabolism can exhaust the remaining thiamine supply; never delay emergency treatment of documented hypoglycemia.",
      "Assess attention, memory, eye movements, nystagmus, gait, coordination, temperature, and consciousness because the classic triad is often incomplete and waiting for all features misses treatable disease.",
      "Monitor and replace ordered magnesium, potassium, phosphate, glucose, and fluid deficits because magnesium is needed for thiamine-dependent reactions and refeeding can shift electrolytes rapidly.",
      "Institute fall and aspiration precautions, assist mobility, and assess nutrition because ataxia, confusion, vomiting, and malnutrition create immediate injury risks.",
      "Screen for alcohol withdrawal, liver disease, infection, and other causes of delirium; use a validated withdrawal pathway without allowing sedatives to obscure worsening neurologic findings.",
      "Escalate for coma, seizure, hypothermia, hypotension, worsening ocular signs, respiratory compromise, or failure to improve after thiamine because another emergency diagnosis or advanced deficiency may coexist."
    ], [
      "Declining consciousness, seizure, hypothermia, or hemodynamic instability",
      "New ophthalmoplegia, rapidly worsening ataxia, or inability to protect the airway",
      "Severe hypoglycemia or refeeding-associated phosphate, potassium, or magnesium depletion",
      "Autonomic instability, hallucinations, or agitation suggesting complicated alcohol withdrawal"
    ], [
      "Explain that thiamine lets brain cells use energy normally; deficiency can injure memory and coordination even when a person does not show every textbook symptom.",
      "Encourage continued thiamine, nutrition, and alcohol-use treatment after the emergency because delayed or recurrent deficiency can leave permanent memory impairment."
    ]),
    card("Head trauma", ["acs-trauma", "ncs-enls-6"], [
      "Maintain cervical-spine protection while assessing airway, breathing, circulation, and major bleeding because a head injury may accompany an unstable spine or extracranial hemorrhage.",
      "Record the mechanism, loss of consciousness, amnesia, vomiting, seizure, anticoagulants, alcohol or drug exposure, and last-known-normal state because these factors change imaging and observation urgency.",
      "Trend Glasgow Coma Scale components, pupils, speech, limb strength, behavior, headache, and vomiting with consistent sedation documentation because deterioration may be the first sign of an expanding intracranial lesion.",
      "Prevent hypoxemia, hypotension, fever, and marked glucose derangement and keep the head midline when ordered because injured brain tissue is especially vulnerable to reduced oxygen delivery.",
      "Use seizure, aspiration, fall, and agitation precautions; provide ordered analgesia and antiemetics while avoiding unnecessary oversedation that masks the examination.",
      "Escalate immediately for a Glasgow Coma Scale decline, unequal pupils, new deficit, seizure, repeated vomiting, worsening headache, clear ear or nose drainage, or anticoagulant-associated symptoms."
    ], [
      "Declining alertness, inability to awaken, or new confusion",
      "Unequal pupils, new weakness, slurred speech, or seizure",
      "Repeated vomiting, worsening severe headache, or fluid or blood from the ear or nose",
      "Any deterioration in a patient taking an anticoagulant or antiplatelet drug"
    ], [
      "Explain that a normal early appearance does not exclude delayed bleeding; written observation instructions and a responsible adult are important after discharge.",
      "Seek emergency care for worsening headache, repeated vomiting, confusion, weakness, seizure, unusual behavior, or difficulty waking, and avoid driving, alcohol, and risky activity until cleared."
    ]),
    card("Chemical burn", ["aba-burn-referral", "hrsa-poison-help"], [
      "Protect staff with appropriate personal protective equipment, identify the chemical and exposure route, and contact poison control or hazardous-material experts because secondary contamination can injure rescuers and change decontamination steps.",
      "Remove contaminated clothing and jewelry; brush away dry powders before copious water irrigation unless agent-specific guidance says otherwise because trapped chemical continues tissue penetration.",
      "Do not attempt bedside acid-base neutralization or apply creams before decontamination because exothermic reactions and delayed dilution can deepen the burn.",
      "Assess airway, breathing, eyes, pain, skin color, capillary refill, depth, surface area, and distal neurovascular status; continue irrigation while monitoring temperature to prevent hypothermia.",
      "For eye exposure, begin immediate irrigation, remove contact lenses when easily possible, monitor ocular pH per protocol, and obtain urgent ophthalmology evaluation.",
      "Escalate to a burn center for high-risk chemical exposure and immediately for stridor, facial or airway exposure, shock, circumferential injury, vision change, worsening pain, or tissue necrosis."
    ], [
      "Stridor, hoarseness, facial swelling, soot, or breathing difficulty",
      "Eye pain, reduced vision, corneal clouding, or persistently abnormal ocular pH",
      "Shock, severe systemic symptoms, expanding necrosis, or a circumferential limb burn",
      "Unknown industrial agent, hydrofluoric acid exposure, or ongoing contamination"
    ], [
      "Teach the patient to remove contaminated items and irrigate promptly after future exposure, but to brush off dry powders first and follow product or poison-center instructions.",
      "Explain that chemical injury can continue after contact ends, so increasing pain, color change, numbness, breathing trouble, or vision change requires urgent reassessment."
    ]),
    card("Pelvic fracture", ["acs-trauma"], [
      "Activate trauma and hemorrhage pathways, secure large-bore access, and trend blood pressure, mental status, skin perfusion, lactate, hemoglobin, and urine output because the pelvis can conceal life-threatening blood loss.",
      "Apply an ordered pelvic binder centered over the greater trochanters and document time and skin checks because correct placement reduces pelvic volume while prolonged pressure can injure tissue.",
      "Avoid repeated pelvic compression or logrolling unless essential because disrupting early clot formation can worsen hemorrhage.",
      "Assess abdomen, perineum, urethral bleeding, urine, rectum or vagina when clinically directed, and distal pulses, movement, sensation, and limb length because genitourinary, bowel, nerve, and vascular injuries often coexist.",
      "Prepare for balanced blood-product resuscitation, tranexamic acid when ordered, interventional radiology, operative control, or transfer; prevent hypothermia and monitor calcium during massive transfusion.",
      "Escalate immediately for persistent hypotension, rising lactate, expanding pelvic or flank swelling, gross hematuria, absent distal pulse, new neurologic loss, or uncontrolled pain."
    ], [
      "Hypotension, narrowing pulse pressure, rising lactate, or declining mental status",
      "Gross hematuria, blood at the urethra, perineal bruising, or inability to void",
      "Absent or weakening distal pulse, cool limb, or new motor or sensory deficit",
      "Increasing abdominal distention, uncontrolled pain, or ongoing transfusion need"
    ], [
      "Explain that serious internal bleeding can occur without a large external wound, which is why repeated circulation checks and urgent imaging or procedures are needed.",
      "Ask the patient not to sit up, walk, or remove the binder until the trauma team clears movement; report increasing pelvic pressure, numbness, urinary difficulty, or breathlessness immediately."
    ]),
    card("Hip fracture", ["aaos-hip-fracture"], [
      "Assess pain, limb shortening or rotation, skin integrity, and distal pulses, warmth, movement, and sensation before and after positioning because fracture displacement or swelling can compromise nerves and vessels.",
      "Provide prescribed multimodal analgesia and support the limb during transfers because untreated pain drives delirium, immobility, and pulmonary complications.",
      "Keep the patient safely aligned, avoid unassisted weight bearing, and use pressure redistribution, heel offloading, hydration, bowel care, and venous-thromboembolism prophylaxis while awaiting surgery.",
      "Screen repeatedly for delirium using the patient's cognitive baseline and address glasses, hearing aids, sleep, urinary retention, infection, hypoxia, and medication triggers because delirium often signals a reversible complication.",
      "Complete ordered preoperative testing and medication reconciliation without unnecessary fasting delays; after surgery, coordinate early mobilization, nutrition, respiratory exercises, and wound surveillance.",
      "Escalate for a cool pulseless foot, new motor or sensory loss, uncontrolled bleeding, chest pain or dyspnea, acute delirium, fever, or rapidly worsening pain."
    ], [
      "Cool pale foot, absent pulse, new numbness, or inability to move toes",
      "Sudden dyspnea, chest pain, hypoxemia, or unilateral calf swelling",
      "Acute delirium, fever, hypotension, or increasing wound drainage",
      "Pain out of proportion or pain not controlled by the prescribed plan"
    ], [
      "Explain that pain control and early assisted movement protect the lungs, skin, muscles, and independence; the team will balance this with safe fracture alignment.",
      "After discharge, follow weight-bearing instructions, use the prescribed walking aid, remove trip hazards, and report wound drainage, fever, calf swelling, chest symptoms, or a new fall promptly."
    ]),
    card("Deep tissue pressure injury", ["international-pressure-injury"], [
      "Remove pressure from the area immediately with an individualized turning schedule, heel suspension, and an appropriate support surface because deeper muscle injury can progress even while the surface still looks intact.",
      "Document location, dimensions, color, temperature, firmness or bogginess, pain, drainage, and whether skin is intact; photograph per policy because trend reveals evolution toward recovery or necrosis.",
      "Do not massage the discoloration or place ring-shaped devices beneath it because friction, shear, and concentrated edge pressure further damage poorly perfused tissue.",
      "Assess perfusion, mobility, sensation, incontinence, moisture, nutrition, hydration, anemia, glucose control, and device pressure because healing depends on correcting the forces and physiologic deficits that caused the injury.",
      "Protect intact skin from urine, stool, adhesives, and friction, manage pain, and obtain wound-specialist and nutrition input before selecting dressings or debridement.",
      "Escalate for rapid darkening or expansion, blistering, drainage, fluctuance, crepitus, fever, malodor, surrounding erythema, or exposed deeper structures because infection or extensive tissue death may be emerging."
    ], [
      "Rapidly expanding purple or maroon discoloration, blistering, or skin separation",
      "Fever, crepitus, malodor, purulent drainage, or spreading erythema",
      "New fluctuance, severe pain, exposed fascia or bone, or systemic instability",
      "Loss of distal perfusion or injury beneath a device that cannot be safely relieved"
    ], [
      "Explain that damage may be deeper than it appears and can declare itself over several days, so complete pressure relief and daily observation matter even when the skin is closed.",
      "Teach caregivers to reposition as instructed, keep skin clean and dry, avoid rubbing dark areas, support protein and fluid intake when allowed, and report any blister, drainage, odor, fever, or spreading color."
    ]),
    card("Oligohydramnios", ["acog-antenatal-surveillance", "acog-fgr"], [
      "Confirm gestational age and the ordered ultrasound fluid assessment, then ask about vaginal fluid loss because membrane rupture changes infection risk, surveillance, and delivery planning.",
      "Assess fetal movement and perform prescribed nonstress testing, biophysical profiling, growth scans, and umbilical-artery Doppler because low fluid may reflect placental insufficiency and can accompany fetal growth restriction.",
      "Monitor maternal blood pressure, headache, visual symptoms, epigastric pain, hydration, medications, and renal or placental disease because the underlying maternal condition may require urgent treatment.",
      "Encourage oral hydration when appropriate and administer ordered fluids while avoiding reassurance that hydration alone corrects placental disease.",
      "During labor, continuously assess the fetal heart pattern as ordered, reposition for recurrent decelerations, and prepare for obstetric interventions because reduced fluid leaves less cushion around the umbilical cord.",
      "Escalate for decreased or absent fetal movement, rupture of membranes, fever, bleeding, regular contractions, severe hypertension symptoms, or a persistent nonreassuring fetal heart pattern."
    ], [
      "Markedly decreased or absent fetal movement",
      "Gush or continuous leaking of fluid, fever, uterine tenderness, or foul discharge",
      "Persistent variable or late decelerations, bradycardia, or reduced variability",
      "Severe headache, visual change, right-upper-quadrant pain, bleeding, or regular preterm contractions"
    ], [
      "Explain that amniotic fluid cushions the cord and reflects fetal urine and placental function, so low fluid prompts closer checks of growth, blood flow, and fetal well-being.",
      "Teach daily awareness of the baby's usual movement pattern and when to call immediately for reduced movement, leaking fluid, bleeding, fever, or contractions."
    ]),
    card("Polyhydramnios", ["acog-antenatal-surveillance", "acog-macrosomia"], [
      "Assess maternal breathing, abdominal discomfort, uterine size, edema, contractions, and functional tolerance because marked uterine distention can impair ventilation and trigger preterm labor.",
      "Facilitate ordered glucose testing, fetal anatomy and growth assessment, and infection or alloimmunization evaluation because diabetes, impaired fetal swallowing, and fetal anemia are important causes.",
      "Track fetal movement, presentation, nonstress testing, and biophysical profiles as prescribed because excess fluid increases unstable lie and cord complications without guaranteeing normal placental function.",
      "If membranes rupture, immediately assess fetal heart rate and check for visible or palpable cord per emergency protocol because a high presenting part allows cord prolapse.",
      "During labor and after birth, monitor for malpresentation, abnormal fetal tracing, placental abruption, uterine atony, and hemorrhage because an overdistended uterus may contract poorly.",
      "Escalate for acute dyspnea, painful distention, preterm contractions, rupture of membranes, vaginal bleeding, cord presentation, persistent fetal bradycardia, or heavy postpartum bleeding."
    ], [
      "Sudden breathlessness, severe abdominal pressure, or rapidly increasing uterine size",
      "Rupture of membranes with a high fetal station, visible cord, or fetal bradycardia",
      "Painful contractions, vaginal bleeding, or a nonreassuring fetal heart pattern",
      "Boggy uterus, heavy postpartum bleeding, dizziness, or hypotension"
    ], [
      "Explain that excess fluid often reflects an underlying maternal or fetal issue, so glucose testing and ultrasound evaluate the cause rather than simply measuring abdominal size.",
      "Call urgently for leaking fluid, bleeding, contractions, reduced fetal movement, sudden breathing difficulty, or anything felt or seen in the vagina after the water breaks."
    ]),
    card("Nuchal cord", ["acog-antenatal-surveillance"], [
      "Assess the fetal heart rate pattern and contraction relationship rather than treating an ultrasound finding alone because many nuchal cords do not impair fetal oxygenation.",
      "For recurrent variable decelerations, reposition the patient, reduce excessive uterine stimulation, give ordered fluids, and initiate the unit's intrauterine-resuscitation pathway because cord compression may transiently reduce fetal blood flow.",
      "Avoid unnecessary traction or attempts to manipulate a suspected cord before delivery; keep the obstetric clinician informed and prepare equipment for operative delivery if the tracing remains abnormal.",
      "During birth, support the clinician's controlled assessment and management of the cord while maintaining neonatal warming and resuscitation readiness.",
      "After delivery, assess tone, breathing, heart rate, color, cord condition, and signs of hypovolemia or anemia because a very tight cord can occasionally affect neonatal transition.",
      "Escalate immediately for persistent fetal bradycardia, recurrent decelerations with reduced variability, prolonged deceleration, or failure to recover after corrective measures."
    ], [
      "Persistent fetal bradycardia or a prolonged deceleration",
      "Recurrent deep variable decelerations with reduced or absent variability",
      "Failure of the fetal heart rate to recover after position and stimulation changes",
      "Poor neonatal tone, ineffective breathing, pallor, or persistent tachycardia after birth"
    ], [
      "Explain that a cord around the neck is common and usually causes no harm; the baby's heart-rate response, not the image alone, shows whether compression is important.",
      "During labor, report reduced fetal movement or sudden pressure after the water breaks and expect the team to change position or act quickly if the heart-rate pattern shows persistent stress."
    ]),
    card("Intrauterine growth restriction", ["acog-fgr", "acog-antenatal-surveillance"], [
      "Verify gestational dating and trend estimated fetal weight and abdominal circumference rather than relying on a single measurement because growth trajectory helps distinguish a constitutionally small fetus from placental insufficiency.",
      "Perform prescribed fetal-movement review, nonstress testing, biophysical profiles, and umbilical-artery Doppler because worsening placental resistance can precede hypoxemia and stillbirth.",
      "Monitor maternal blood pressure, urine protein and preeclampsia symptoms, nutrition, smoking or substance exposure, infection risk, and placental disease because treating maternal contributors can reduce additional harm.",
      "Coordinate corticosteroids, magnesium sulfate, transfer, or delivery preparation when ordered based on gestational age and surveillance because the safest timing balances prematurity against continued placental failure.",
      "During labor, maintain ordered fetal monitoring and prepare for intolerance of contractions; after birth, prioritize temperature, glucose, feeding, hematocrit, and respiratory observation.",
      "Escalate for absent or markedly reduced movement, abnormal Doppler flow, recurrent late decelerations, reduced variability, severe preeclampsia symptoms, bleeding, or preterm labor."
    ], [
      "Absent or markedly decreased fetal movement",
      "Absent or reversed end-diastolic Doppler flow or a nonreassuring fetal test",
      "Recurrent late decelerations, bradycardia, or reduced variability",
      "Severe hypertension symptoms, vaginal bleeding, or preterm contractions"
    ], [
      "Explain that growth restriction is more than being small: it can mean the placenta is not delivering enough oxygen and nutrients, which is why blood-flow and heart-rate tests accompany growth scans.",
      "Keep every surveillance appointment, avoid tobacco and nonprescribed substances, and call immediately for reduced movement, bleeding, leaking fluid, contractions, severe headache, or visual changes."
    ]),
    card("Macrosomia", ["acog-macrosomia"], [
      "Review gestational dating, serial growth estimates, prior birth history, maternal glucose, and weight trajectory because ultrasound weight is imprecise and delivery decisions require the whole risk picture.",
      "Support prescribed glucose monitoring, nutrition, and insulin timing because maternal hyperglycemia drives fetal insulin production and disproportionate shoulder and trunk growth.",
      "During labor, monitor fetal status and progress, document descent, and alert the obstetric team to arrest or a difficult operative vaginal birth because these increase shoulder-dystocia risk.",
      "Ensure the shoulder-dystocia response team and neonatal equipment are available; if dystocia occurs, record times and maneuvers and never apply fundal pressure because it can wedge the anterior shoulder more firmly.",
      "After birth, assess the newborn for breathing difficulty, asymmetric arm movement, clavicle injury, bruising, and hypoglycemia while monitoring the mother for lacerations and uterine-atony hemorrhage.",
      "Escalate for labor arrest, persistent nonreassuring fetal tracing, turtle sign or failed shoulder delivery, heavy maternal bleeding, neonatal weakness, or symptomatic low glucose."
    ], [
      "Arrest of descent, turtle sign, or failure of the shoulders to deliver",
      "Persistent fetal bradycardia or recurrent late decelerations",
      "Boggy uterus, heavy bleeding, expanding hematoma, dizziness, or hypotension",
      "Newborn respiratory distress, asymmetric arm movement, seizure, or symptomatic hypoglycemia"
    ], [
      "Explain that estimated weight has a margin of error; planning combines the estimate with diabetes status, prior births, pelvic and labor findings, and maternal preferences.",
      "Teach that controlling glucose lowers continued excess growth and newborn hypoglycemia risk, and explain why the delivery team may bring extra staff into the room before birth."
    ]),
    card("Postpartum depression", ["acog-perinatal-mental-health"], [
      "Use a validated perinatal depression screen and assess duration, function, sleep independent of infant care, appetite, guilt, anxiety, bonding, and available support because postpartum depression is more persistent and impairing than brief baby blues.",
      "Ask directly and privately about suicidal thoughts, intent, plan, access to lethal means, thoughts of harming the infant, hallucinations, paranoia, mania, and prior bipolar disorder because postpartum psychosis and mixed states are emergencies.",
      "Create a collaborative safety plan, involve a trusted support person with permission, and arrange timely psychotherapy and prescribing follow-up rather than handing the patient a referral without connection.",
      "Assess feeding goals, medication adherence and effects, pain, anemia, thyroid symptoms, substance use, and intimate-partner violence because medical and social conditions can worsen mood and affect treatment choice.",
      "Support protected sleep, practical infant-care help, nutrition, movement, and parent-infant connection while explaining that effective options can include cognitive behavioral or interpersonal therapy, antidepressant medication, and postpartum-specific pharmacotherapy evaluation.",
      "Escalate immediately to same-day emergency psychiatric evaluation and continuous safety observation for active suicidal or infant-harm intent, psychosis, mania, severe disorganization, or inability to provide basic care."
    ], [
      "Active suicidal intent, plan, preparatory behavior, or access to lethal means",
      "Thoughts or commands to harm the infant, hallucinations, paranoia, mania, or severe confusion",
      "Inability to eat, sleep, function, or provide basic infant care",
      "Escalating agitation, substance intoxication or withdrawal, or unsafe home violence"
    ], [
      "Explain that postpartum depression is a treatable health condition, not a failure of love or parenting, and symptoms can begin during pregnancy or anytime in the first postpartum year.",
      "Give the patient and support person a clear crisis plan: seek emergency help now for suicidal or infant-harm thoughts, hallucinations, extreme energy with little sleep, paranoia, or frightening confusion."
    ]),
    card("Left-sided heart failure", ["acc-heart-failure-2022"], [
      "Place the patient upright, assess work of breathing, lung sounds, oxygen saturation, perfusion, and mental status, and give oxygen for hypoxemia because elevated left-sided filling pressure can rapidly flood the alveoli.",
      "Trend weight, intake and output, edema, jugular venous pressure, orthopnea, blood pressure, heart rate, and urine output because congestion and forward perfusion must be judged together.",
      "Administer ordered diuretics and reassess urine response, dyspnea, weight, creatinine, potassium, magnesium, and blood pressure because decongestion can improve breathing while excessive loss causes renal injury or hypotension.",
      "Review adherence, sodium and fluid intake, ischemia, infection, arrhythmia, uncontrolled hypertension, and kidney function because identifying the precipitant prevents repeated decompensation.",
      "Give guideline-directed cardiac medicines with parameter checks, monitor for dizziness, bradycardia, hyperkalemia, and renal change, and avoid routine NSAIDs unless specifically directed.",
      "Escalate immediately for pink frothy sputum, rapidly rising oxygen need, exhaustion, chest pain, new arrhythmia, systolic hypotension with cool skin, confusion, or oliguria."
    ], [
      "Pink frothy sputum, severe orthopnea, rapidly increasing oxygen need, or respiratory fatigue",
      "Chest pain, new ischemic change, sustained arrhythmia, or syncope",
      "Cool clammy skin, confusion, hypotension, or falling urine output",
      "Rapid weight gain with worsening edema despite prescribed diuretic therapy"
    ], [
      "Teach daily morning weight on the same scale and a symptom plan for rapid gain, increasing breathlessness, swelling, cough, or needing more pillows, because these often precede a crisis.",
      "Review each medicine's purpose, sodium and fluid instructions, and why NSAIDs or missed diuretics can retain fluid; provide exact clinician-call and emergency thresholds."
    ]),
    card("Diastolic heart failure", ["acc-heart-failure-2022"], [
      "Assess congestion and perfusion with breath sounds, orthopnea, edema, jugular venous pressure, blood pressure, mentation, and urine output because a stiff ventricle can produce high filling pressure despite a preserved ejection fraction.",
      "Trend heart rate and rhythm continuously during decompensation because atrial fibrillation and tachycardia shorten filling time and can abruptly worsen pulmonary congestion.",
      "Administer prescribed diuretics in measured steps and reassess symptoms, weight, creatinine, sodium, potassium, and orthostasis because these patients may be congested yet sensitive to excessive preload reduction.",
      "Identify triggers such as hypertension, ischemia, infection, anemia, kidney dysfunction, medication changes, and dietary sodium because treating the trigger is central to restoring stable filling pressures.",
      "Support ordered blood-pressure control and comorbidity treatment, pace activity with rest, and avoid unreviewed fluid boluses because normal ejection fraction does not mean the ventricle accepts volume normally.",
      "Escalate for acute pulmonary edema, rapid atrial fibrillation with symptoms, chest pain, syncope, hypotension, confusion, or oliguria."
    ], [
      "Sudden severe dyspnea, diffuse crackles, frothy sputum, or escalating oxygen need",
      "Rapid or irregular rhythm with chest discomfort, hypotension, or altered mentation",
      "Syncope, cool extremities, falling urine output, or acute kidney-function decline",
      "Severe hypertension with neurologic symptoms or pulmonary edema"
    ], [
      "Explain that the pumping percentage may look normal while the heart muscle is too stiff to fill without high pressure; this is why congestion symptoms are real despite a preserved ejection fraction.",
      "Track weight, blood pressure, swelling, and breathing symptoms, take medicines consistently, and call early for rapid gain, increasing pillows, palpitations, dizziness, or reduced urine."
    ]),
    card("Hemophilia B", ["wfh-hemophilia"], [
      "For suspected significant bleeding, notify the hemophilia team and administer prescribed factor IX concentrate promptly without waiting for imaging because early replacement limits blood accumulation and tissue damage.",
      "Ask about the individualized treatment plan, factor product, inhibitor history, last dose, target joint, trauma, surgery, and medications because laboratory clotting times alone do not determine adequate treatment.",
      "Assess joints, muscles, abdomen, flank, mouth, urine, stool, skin, vital signs, and serial hemoglobin; perform frequent neurologic checks after any head impact because intracranial bleeding may initially be subtle.",
      "Avoid intramuscular injections, rectal procedures, aspirin, and nonprescribed NSAIDs; use prolonged direct pressure after venipuncture because minor tissue trauma can produce sustained bleeding.",
      "For a joint bleed, rest and protect the joint, use wrapped cold therapy and gentle positioning after factor is given, and involve the hemophilia team before aggressive range of motion.",
      "Escalate immediately for head, neck, throat, gastrointestinal, retroperitoneal, or iliopsoas bleeding; falling hemoglobin; shock; factor-reaction symptoms; or bleeding that continues despite treatment."
    ], [
      "Any head injury, severe headache, vomiting, confusion, weakness, or seizure",
      "Neck or throat swelling, voice change, stridor, or difficulty swallowing",
      "Abdominal, flank, groin, or back pain with pallor, tachycardia, or falling hemoglobin",
      "Persistent bleeding despite factor, or urticaria, wheeze, hypotension, or inhibitor concern after infusion"
    ], [
      "Teach the patient to treat significant bleeds according to the personal factor plan first and then seek evaluation; waiting for swelling or a scan allows more blood to collect.",
      "Wear medical identification, keep factor and the treatment plan accessible, avoid aspirin and unapproved NSAIDs, use protective equipment, and contact the hemophilia center before procedures or new medicines."
    ]),
    card("Mitral stenosis", ["acc-valve-2020"], [
      "Assess dyspnea, orthopnea, crackles, edema, oxygenation, blood pressure, and exercise tolerance because a narrowed mitral valve raises left-atrial and pulmonary pressure before forward output falls.",
      "Trend heart rate and rhythm and obtain an electrocardiogram for new palpitations because atrial fibrillation removes atrial filling support and fast rates shorten flow time across the stenotic valve.",
      "Administer prescribed rate-control, diuretic, and anticoagulant therapy with blood-pressure, renal, electrolyte, and bleeding checks; avoid unreviewed fluid loading because excess volume worsens pulmonary congestion.",
      "Assess for hemoptysis, infection, pregnancy, anemia, thyroid disease, and medication nonadherence because each can increase flow demand or precipitate decompensation.",
      "Perform focused stroke and peripheral-embolism assessments when symptoms change and coordinate echocardiography and valve-team evaluation for progressive limitation.",
      "Escalate immediately for acute pulmonary edema, rapid atrial fibrillation with instability, hemoptysis with respiratory distress, syncope, chest pain, or a new focal neurologic deficit."
    ], [
      "Severe dyspnea, frothy sputum, diffuse crackles, or rapidly rising oxygen need",
      "Rapid irregular rhythm with hypotension, chest pain, altered mentation, or syncope",
      "New unilateral weakness, aphasia, vision loss, or a cold painful limb",
      "Significant hemoptysis, fever with hemodynamic change, or pregnancy-related decompensation"
    ], [
      "Explain that the narrowed valve slows blood leaving the left atrium, so fast heart rates and excess fluid quickly raise pressure backward into the lungs.",
      "Teach pulse awareness, anticoagulant safety when prescribed, infection prevention, and early reporting of worsening breathlessness, palpitations, coughing blood, fainting, or stroke symptoms."
    ]),
    card("Silent MI", ["acc-acs-2025"], [
      "Treat unexplained dyspnea, nausea, sweating, weakness, syncope, confusion, or unusual fatigue as possible ischemia in older adults and people with diabetes because myocardial infarction may occur without classic chest pain.",
      "Obtain a 12-lead electrocardiogram promptly, repeat it when symptoms evolve, and facilitate serial cardiac troponin testing because one normal tracing or early biomarker does not exclude acute infarction.",
      "Apply continuous rhythm and oxygenation monitoring, assess perfusion and heart-failure signs, and establish vascular access because silent ischemia can first present through arrhythmia, pulmonary edema, or shock.",
      "Administer ordered acute-coronary therapy after checking allergies, blood pressure, bleeding history, anticoagulants, and contraindications; give oxygen only for hypoxemia or another indication.",
      "Track renal function, hemoglobin, glucose, recurrent symptoms, electrocardiographic change, and bleeding because antithrombotic treatment and diabetes complicate acute management.",
      "Escalate for dynamic ST-T change, rising troponin with instability, ventricular arrhythmia, acute heart failure, syncope, hypotension, or recurrent ischemic equivalents."
    ], [
      "New dynamic ST elevation or depression, recurrent ischemic symptoms, or rising troponin with instability",
      "Ventricular tachyarrhythmia, severe bradycardia, syncope, or cardiac arrest",
      "Acute pulmonary edema, new murmur, hypotension, cool skin, confusion, or oliguria",
      "Major bleeding or new neurologic deficit during antithrombotic therapy"
    ], [
      "Explain that a heart attack can feel like breathlessness, nausea, sweating, weakness, or unusual fatigue rather than pain, especially with diabetes or older age.",
      "Call emergency services for a new unexplained symptom pattern instead of driving or waiting it out; after discharge, follow cardiac rehabilitation, medicine, glucose, blood-pressure, and smoking-cessation plans."
    ]),
    card("Sick sinus syndrome", ["acc-bradycardia-2018", "aha-als-2025"], [
      "Correlate dizziness, fatigue, exercise intolerance, palpitations, falls, syncope, or confusion with telemetry and a documented pulse because treatment depends on proving that sinus-node dysfunction causes symptoms.",
      "Assess blood pressure, oxygenation, perfusion, orthostatic change, mental status, and heart-failure signs during bradycardia or pauses because the same rate can be tolerated by one patient and unstable in another.",
      "Review beta blockers, nondihydropyridine calcium-channel blockers, digoxin, antiarrhythmics, sedatives, thyroid status, electrolytes, ischemia, sleep apnea, and infection because reversible factors can suppress the sinus node.",
      "For symptomatic instability, activate the bradycardia pathway, obtain vascular access, place pacing pads, and prepare ordered atropine or transcutaneous pacing without delaying expert help.",
      "After tachycardia episodes, watch for long conversion pauses and anticoagulation indications because sick sinus syndrome may alternate between atrial tachyarrhythmia and profound bradycardia.",
      "Escalate immediately for syncope, hypotension, ischemic chest discomfort, acute heart failure, altered mentation, sustained very slow rate, or a prolonged pause with symptoms."
    ], [
      "Bradycardia or pause with hypotension, altered mentation, chest discomfort, or shock",
      "Syncope, recurrent unexplained falls, or seizure-like activity with a documented pause",
      "Acute pulmonary edema or severe exercise intolerance from low cardiac output",
      "Tachyarrhythmia followed by a prolonged symptomatic conversion pause"
    ], [
      "Teach the patient to record pulse and symptoms together because dizziness without a rhythm correlation may have another cause, while a documented symptomatic pause guides pacemaker decisions.",
      "Review medicine timing and pacemaker precautions if implanted, and seek emergency help for fainting, chest pain, severe breathlessness, or persistent confusion."
    ]),
    card("Premature ventricular contractions", ["aha-als-2025", "acc-acs-2025"], [
      "Document frequency, morphology, coupling pattern, runs, pulse deficit, and the patient's symptoms because isolated uniform beats differ in risk from frequent multifocal, repetitive, or ischemia-associated ectopy.",
      "Assess blood pressure, perfusion, chest symptoms, syncope, oxygenation, and heart-failure signs because ventricular ectopy becomes urgent when it accompanies instability or structural disease.",
      "Obtain a 12-lead electrocardiogram and check ordered potassium, magnesium, calcium, glucose, renal function, troponin, and drug levels because electrolyte loss, ischemia, stimulants, and medication toxicity are reversible triggers.",
      "Correct hypoxemia and ordered electrolyte deficits, review diuretics, digoxin, QT-active drugs, caffeine, nicotine, decongestants, and illicit stimulants, and avoid treating the monitor without the clinical context.",
      "Continue telemetry through trigger correction and reassess whether ectopy diminishes; prepare defibrillation capability when runs lengthen or the patient has significant structural heart disease.",
      "Escalate for sustained or polymorphic ventricular tachycardia, R-on-T ectopy with symptoms, syncope, chest pain, hypotension, acute heart failure, or a rapidly increasing PVC burden."
    ], [
      "Sustained, polymorphic, or rapidly recurring ventricular tachycardia",
      "Syncope, hypotension, chest pain, altered mentation, or acute heart failure",
      "R-on-T pattern, multifocal couplets or triplets, or increasing runs with prolonged QT",
      "PVCs with acute ischemic change, severe hypoxemia, or critical potassium or magnesium abnormality"
    ], [
      "Explain that an extra beat is often benign, but its pattern, symptoms, heart health, and triggers determine significance; a skipped-beat feeling does not show the cause by itself.",
      "Track symptoms and stimulant use, take medicines as directed, and seek urgent care for fainting, chest pain, severe breathlessness, or a sustained racing heartbeat."
    ]),
    card("Arterial ulcer", ["acc-pad-2024"], [
      "Assess ulcer location, depth, drainage, surrounding temperature and color, capillary refill, dependent rubor, pulses, Doppler signals, sensation, and rest pain because healing depends on arterial inflow rather than dressing choice alone.",
      "Obtain or facilitate ordered ankle-brachial index, toe pressure, or vascular imaging before applying compression because standard venous-ulcer compression can further reduce flow in significant arterial disease.",
      "Protect the wound with a nontraumatic dressing, keep heels and toes free from pressure, avoid adhesive injury and thermal devices, and do not debride stable dry ischemic tissue without a vascular plan.",
      "Use individualized positioning for comfort and perfusion, avoid prolonged leg elevation when it worsens ischemic pain, and provide prescribed analgesia because severe rest pain signals advanced flow limitation.",
      "Support smoking cessation, foot protection, glucose, lipid and blood-pressure management, antiplatelet and statin adherence, nutrition, and prompt vascular referral.",
      "Escalate immediately for the acute six Ps, rapidly spreading infection, wet gangrene, new tissue loss, uncontrolled rest pain, or a cold pulseless foot because limb viability may be threatened."
    ], [
      "Sudden pain, pallor, pulselessness, paresthesia, paralysis, or poikilothermia",
      "Wet gangrene, crepitus, purulence, spreading erythema, fever, or systemic instability",
      "Rapidly expanding necrosis, new toe discoloration, or loss of a prior Doppler signal",
      "Unrelenting rest pain, especially with a cold foot or new motor or sensory deficit"
    ], [
      "Explain that this wound is caused by too little blood reaching the tissue, so restoring circulation and protecting the foot are as important as covering the sore.",
      "Do not use compression socks, heating pads, corn removers, or home debridement unless the vascular team approves them; inspect both feet daily and report new color, temperature, pain, drainage, or odor promptly."
    ]),
    card("COVID-19 pneumonia", ["idsa-covid-2025", "aarc-guidelines"], [
      "Use current transmission-based precautions and assess symptom onset, risk factors, work of breathing, respiratory rate, oxygen saturation, mental status, and perfusion because deterioration may be faster than the patient's subjective breathlessness suggests.",
      "Titrate prescribed oxygen to the ordered target, verify probe accuracy, and trend oxygen need during rest, movement, and position changes because a rising requirement is a key marker of worsening gas exchange.",
      "Use upright, lateral, or awake-prone positioning when appropriate and tolerated, encourage measured mobility and airway clearance for retained secretions, and avoid exhausting a patient with high work of breathing.",
      "Administer antiviral, corticosteroid, immunomodulator, and thromboprophylaxis therapy only for the patient's severity and contraindications; monitor glucose, liver, renal, infection, and bleeding effects.",
      "Assess hydration, nutrition, venous-thromboembolism symptoms, secondary bacterial infection, delirium, and skin pressure from oxygen devices because both disease and prolonged isolation create complications.",
      "Escalate for rapidly rising oxygen need, respiratory fatigue, cyanosis, new confusion, hemodynamic instability, chest pain, unilateral swelling, hemoptysis, or suspected pneumothorax."
    ], [
      "Rapidly increasing oxygen requirement, severe work of breathing, exhaustion, or cyanosis",
      "New confusion, hypotension, cool skin, oliguria, or other organ dysfunction",
      "Sudden pleuritic chest pain, hemoptysis, unilateral leg swelling, or abrupt desaturation",
      "New focal chest findings, purulent sputum, recurrent fever, or suspected secondary infection"
    ], [
      "Teach correct use of the pulse oximeter and the clinician's personal thresholds, while explaining that breathing effort, confusion, chest pain, and trend matter more than one isolated number.",
      "Use prescribed medicines rather than leftover antibiotics or steroids, pace recovery gradually, and seek urgent help for worsening breathlessness, blue lips, confusion, fainting, chest pain, or low oxygen that does not recover."
    ]),
    card("Graft-versus-host disease", ["nci-transplant"], [
      "Ask transplant type and date, donor source, immunosuppressants, infection prophylaxis, and symptom onset; inspect skin, mouth, eyes, stool, abdomen, weight, and jaundice because graft-versus-host disease can involve several organs at once.",
      "Measure every stool and document volume, frequency, blood, cramping, nausea, and oral intake because gastrointestinal losses can rapidly cause dehydration, electrolyte depletion, malnutrition, and medication malabsorption.",
      "Trend bilirubin, liver enzymes, creatinine, electrolytes, albumin, complete blood count, glucose, weight, intake and output, and skin surface involvement as ordered because organ trajectory guides severity and treatment response.",
      "Administer immunosuppression exactly on schedule and monitor levels and adverse effects; use meticulous infection precautions because treatment suppresses the donor immune response while increasing infection risk.",
      "Provide gentle skin and oral care, eye lubrication as ordered, pain control, nutrition support, and early dietitian and transplant-team involvement without applying unapproved topical or herbal products.",
      "Escalate for profuse diarrhea, gastrointestinal bleeding, rapidly rising bilirubin, blistering or widespread skin loss, fever, hypotension, confusion, reduced urine, or inability to take immunosuppressants."
    ], [
      "High-volume or bloody diarrhea, severe abdominal pain, ileus, or inability to drink",
      "Rapidly spreading rash, blistering, skin sloughing, or severe mucosal involvement",
      "Increasing jaundice or bilirubin, confusion, coagulopathy, or dark urine",
      "Fever, hypotension, rigors, respiratory distress, or reduced urine while immunosuppressed"
    ], [
      "Explain that graft-versus-host disease occurs when donor immune cells attack the recipient's tissues; it is not organ rejection and treatment often requires more immune suppression.",
      "Contact the transplant team the same day for a new rash, diarrhea, abdominal pain, jaundice, dry painful eyes or mouth, fever, or missed immunosuppressant dose rather than self-treating."
    ]),
    card("Hypoparathyroidism", ["ese-hypoparathyroidism"], [
      "Assess perioral or fingertip tingling, cramps, carpopedal spasm, voice change, stridor, seizure, cognition, and recent neck surgery because falling ionized calcium increases neuromuscular excitability.",
      "Trend ionized or albumin-corrected calcium, phosphate, magnesium, creatinine, vitamin D, and urinary calcium as ordered because treatment must relieve symptoms without causing kidney stones or nephrocalcinosis.",
      "Obtain electrocardiographic monitoring for symptomatic or severe hypocalcemia because QT prolongation can progress to dangerous ventricular dysrhythmia.",
      "Administer prescribed calcium and active vitamin D, correct magnesium, and monitor the intravenous site closely when calcium is infused because extravasation damages tissue and rapid infusion can provoke arrhythmia.",
      "Review adherence, diet, vomiting or diarrhea, diuretics, acid-suppressing therapy, iron, thyroid replacement, and other interactions that alter calcium absorption or loss.",
      "Escalate immediately for laryngospasm, stridor, seizure, marked tetany, prolonged-QT arrhythmia, severe confusion, or rapidly falling calcium."
    ], [
      "Stridor, laryngospasm, difficulty swallowing, or respiratory distress",
      "Seizure, generalized tetany, severe confusion, or syncope",
      "Marked QT prolongation, ventricular dysrhythmia, or hemodynamic instability",
      "Rapid symptomatic calcium decline after neck surgery or inability to retain oral treatment"
    ], [
      "Teach the early warning pattern of tingling around the mouth, fingertip numbness, cramps, or twitching so treatment can be adjusted before airway or seizure symptoms develop.",
      "Take calcium and active vitamin D exactly as prescribed, keep laboratory and urine checks, and separate calcium from thyroid medicine, iron, or other interacting drugs according to the pharmacist's instructions."
    ]),
    card("Tetany", ["ese-hypoparathyroidism", "aha-als-2025"], [
      "Assess airway, voice, stridor, breathing, circulation, consciousness, and seizure activity first because laryngeal spasm and generalized muscle contraction can become immediately life-threatening.",
      "Obtain electrocardiographic monitoring and ordered ionized calcium, magnesium, phosphate, potassium, renal function, blood gas, and albumin because hypocalcemia, hypomagnesemia, and alkalosis require different corrections.",
      "Administer prescribed intravenous calcium for severe symptomatic hypocalcemia through a secure line, monitor rhythm and the site continuously, and recheck calcium because rapid delivery or extravasation can cause serious harm.",
      "Correct ordered magnesium and address vomiting, diarrhea, neck surgery, renal disease, medications, or hyperventilation because tetany is a sign of altered neuromuscular excitability rather than a diagnosis by itself.",
      "Reduce stimulation, protect from falls and seizure injury, keep suction and airway equipment available, and coach slower breathing only when anxiety-driven hyperventilation is confirmed.",
      "Escalate immediately for stridor, laryngospasm, seizure, prolonged-QT arrhythmia, syncope, hypotension, or persistent spasm despite initial treatment."
    ], [
      "Stridor, voice change, laryngospasm, cyanosis, or ineffective ventilation",
      "Generalized spasm, seizure, altered consciousness, or injury",
      "Prolonged QT with ventricular ectopy, syncope, or hemodynamic instability",
      "Persistent tetany despite calcium or evidence of severe magnesium depletion"
    ], [
      "Explain that tetany means nerves and muscles are firing too easily, often because the active calcium level is low or alkalosis changes how calcium binds in blood.",
      "Seek urgent help for throat tightness, breathing difficulty, a sustained hand or facial spasm, seizure, or fainting; do not change calcium or magnesium doses without laboratory-guided advice."
    ]),
    card("Type 1 diabetes mellitus", ["ada-hospital-2026"], [
      "Verify the patient's basal insulin, meal insulin, correction plan, pump or continuous-monitor settings, food intake, and usual hypoglycemia pattern because complete insulin deficiency requires continuous basal coverage even when the patient is not eating.",
      "Check glucose at the ordered frequency and coordinate rapid-acting insulin with actual carbohydrate delivery because delayed meals after dosing cause hypoglycemia while omitted coverage drives hyperglycemia and ketone formation.",
      "Assess ketones, hydration, nausea, vomiting, abdominal pain, breathing pattern, and mental status during illness or persistent hyperglycemia because diabetic ketoacidosis can develop quickly.",
      "Use the hospital's verified meter for treatment decisions when required, confirm unexpected continuous-monitor readings, inspect pump sites and tubing, and never remove a pump without an immediate alternative insulin plan.",
      "Treat hypoglycemia promptly according to consciousness and swallowing ability, recheck after treatment, and investigate the cause so the next insulin, meal, activity, or renal-function mismatch is prevented.",
      "Escalate for ketones with vomiting or acidosis signs, persistent severe hyperglycemia, recurrent or prolonged hypoglycemia, altered consciousness, pump failure without backup insulin, or potassium-related rhythm change."
    ], [
      "Vomiting, abdominal pain, deep rapid breathing, fruity breath, confusion, or positive ketones",
      "Severe or recurrent hypoglycemia, seizure, unconsciousness, or inability to swallow",
      "Pump interruption or unavailable basal insulin with rising glucose",
      "Dehydration, hypotension, potassium abnormality, or persistent hyperglycemia despite correction"
    ], [
      "Explain that basal insulin prevents ketone production and usually must continue during fasting or illness, although the dose may need clinician adjustment; stopping all insulin can trigger ketoacidosis.",
      "Use a written sick-day plan: check glucose and ketones more often, drink allowed fluids, continue insulin as directed, and seek help for vomiting, breathing change, confusion, persistent ketones, or glucose that will not respond."
    ]),
    card("Choledocholithiasis", ["asge-choledocholithiasis"], [
      "Assess right-upper-quadrant or epigastric pain, jaundice, dark urine, pale stool, fever, rigors, pruritus, blood pressure, and mental status because an obstructed common bile duct can progress from pain to ascending cholangitis and shock.",
      "Trend bilirubin, alkaline phosphatase, liver enzymes, complete blood count, lipase, renal function, lactate, and coagulation studies as ordered because obstruction, infection, pancreatitis, and liver dysfunction change procedural urgency.",
      "Keep the patient fasting when intervention is likely, provide prescribed fluids, analgesia, antiemetics, and antibiotics, and obtain cultures without delaying treatment in sepsis.",
      "Prepare for endoscopic retrograde cholangiopancreatography by verifying consent, anticoagulants, allergies, airway risk, pregnancy status, and transportation of imaging because endoscopic decompression may be definitive and time-sensitive.",
      "After intervention, monitor pain pattern, vital signs, abdominal findings, bleeding, vomiting, fever, and lipase when ordered because pancreatitis, perforation, hemorrhage, and recurrent obstruction are important complications.",
      "Escalate immediately for the combination of fever, jaundice, and pain; hypotension or confusion; peritoneal signs; gastrointestinal bleeding; or rapidly worsening organ function."
    ], [
      "Fever or rigors with jaundice and right-upper-quadrant pain",
      "Hypotension, confusion, rising lactate, oliguria, or other sepsis-associated organ dysfunction",
      "Severe persistent pain radiating to the back, repeated vomiting, or peritoneal rigidity",
      "Hematemesis, melena, falling hemoglobin, or acute deterioration after ERCP"
    ], [
      "Explain that a stone in the common bile duct can block both bile flow and bacterial drainage, which is why fever with jaundice and pain needs emergency treatment rather than routine gallbladder follow-up.",
      "After discharge, seek urgent care for fever, shaking chills, worsening pain, jaundice, black stool, vomiting blood, or inability to drink; attend the planned gallbladder and duct follow-up even if symptoms resolve."
    ]),
    card("Ileus", ["nice-perioperative-2020"], [
      "Assess distention, pain quality, nausea, vomiting, bowel sounds, flatus, stool, surgical history, medications, and last oral intake because absent propulsion can resemble a mechanical obstruction that needs different treatment.",
      "Keep the patient fasting as ordered, measure all intake and output, characterize emesis, and provide prescribed intravenous fluid and electrolyte replacement because vomiting and bowel sequestration cause dehydration and potassium loss.",
      "Insert and manage gastric decompression when ordered, verify tube placement and patency, and measure output because decompression relieves vomiting and aspiration risk but does not correct the underlying cause.",
      "Review opioids, anticholinergics, immobility, infection, metabolic abnormalities, and recent illness; support mobilization and opioid-sparing analgesia when safe because these factors suppress intestinal motility.",
      "Trend abdominal examination, girth when useful, renal function, potassium, magnesium, glucose, lactate, fever, and white count to detect recovery or evolution toward ischemia, perforation, or sepsis.",
      "Escalate for focal or worsening pain, guarding or rigidity, fever, hemodynamic instability, rising lactate, feculent vomiting, gastrointestinal bleeding, or failure to improve as expected."
    ], [
      "New focal severe pain, guarding, rebound, rigidity, or pain out of proportion",
      "Fever, tachycardia, hypotension, rising lactate, or declining urine output",
      "Feculent or bloody emesis, gastrointestinal bleeding, or rapidly increasing distention",
      "Persistent obstruction pattern or deterioration despite decompression and correction"
    ], [
      "Explain that an ileus is a temporary failure of the bowel's muscular movement, so rest, decompression, electrolyte correction, movement, and less opioid exposure may help it restart.",
      "Do not eat, drink, or use laxatives until the team confirms it is safe; report increasing localized pain, a harder abdomen, fever, blood, or worsening vomiting immediately."
    ]),
    card("Tardive dyskinesia", ["apa-schizophrenia-2020"], [
      "Observe face, tongue, jaw, trunk, hands, feet, gait, speech, chewing, and swallowing and document a structured Abnormal Involuntary Movement Scale baseline because subtle repetitive movements are easily missed or attributed to anxiety.",
      "Review all current and prior dopamine-receptor blocking drugs, dose changes, duration, anticholinergics, and functional impact because exposure history and movement pattern distinguish tardive dyskinesia from acute dystonia, akathisia, tremor, or stereotypy.",
      "Do not abruptly stop psychiatric medication without the prescriber because withdrawal can worsen movements and destabilize the underlying illness; coordinate dose, drug, or VMAT2-inhibitor decisions.",
      "Assess eating, weight, hydration, oral injury, dental care, speech, falls, social distress, and aspiration symptoms because orobuccolingual and truncal movements can impair basic function.",
      "Monitor ordered therapy for sedation, parkinsonism, depression, QT effects, and drug interactions and repeat the same structured movement scale to judge response.",
      "Escalate immediately for inability to swallow or protect the airway, rapidly progressive generalized movement, injury, or fever, severe rigidity, and altered consciousness suggesting neuroleptic malignant syndrome rather than tardive dyskinesia."
    ], [
      "Choking, aspiration, inability to swallow, or impaired airway protection",
      "Fever, severe rigidity, autonomic instability, or altered consciousness",
      "Rapidly worsening generalized movement causing falls, exhaustion, dehydration, or injury",
      "New suicidality, severe depression, or psychiatric destabilization during medication change"
    ], [
      "Explain that these movements can appear after months or years of dopamine-blocking medicine and are not deliberate; early reporting improves the chance of limiting functional harm.",
      "Do not stop an antipsychotic suddenly. Record when movements occur and how they affect eating, speaking, walking, or sleep, then review the pattern promptly with the prescriber."
    ]),
    card("Postoperative atelectasis", ["aarc-guidelines", "nice-perioperative-2020"], [
      "Assess respiratory rate, depth, effort, oxygen saturation, breath sounds, pain, sedation, cough strength, and mobility because shallow ventilation after anesthesia allows dependent alveoli to collapse.",
      "Provide effective multimodal analgesia, support the incision, and time upright positioning, deep breathing, coached coughing, and prescribed lung-expansion therapy after pain control because participation fails when every breath is guarded.",
      "Mobilize early and change position regularly, using lateral or upright positioning matched to tolerance because movement increases tidal volume and recruits dependent lung regions.",
      "Titrate ordered oxygen and assess for retained secretions; use suction or airway-clearance therapy when indicated rather than relying on incentive-spirometer numbers alone.",
      "Trend fever, sputum, focal crackles, oxygen need, heart rate, calf findings, and chest-pain pattern because pneumonia, aspiration, pulmonary embolism, pneumothorax, and fluid overload can mimic or complicate atelectasis.",
      "Escalate for rapidly rising oxygen need, respiratory fatigue, sudden pleuritic pain, hemoptysis, unilateral absent sounds, hemodynamic instability, or failure to improve with lung expansion and mobilization."
    ], [
      "Increasing oxygen requirement, severe work of breathing, exhaustion, or confusion",
      "Sudden pleuritic chest pain, hemoptysis, tachycardia, or unilateral leg swelling",
      "Unilateral absent breath sounds, hypotension, or suspected pneumothorax",
      "Persistent fever, purulent sputum, focal consolidation signs, or worsening despite therapy"
    ], [
      "Explain that anesthesia, pain, and bed rest make breaths smaller, allowing tiny air sacs to close; pain control and frequent upright deep breathing help reopen them.",
      "Use the prescribed breathing device with slow controlled breaths, cough with incision support, and walk with help at the scheduled intervals; report sudden chest pain or worsening breathlessness."
    ]),
    card("Postoperative ileus", ["nice-perioperative-2020"], [
      "Trend abdominal distention, nausea, vomiting, pain pattern, bowel sounds, flatus, stool, oral tolerance, and postoperative day because expected transient slowing must be distinguished from persistent ileus, obstruction, or anastomotic leak.",
      "Measure intake, urine, emesis, drain and gastric-tube output and monitor potassium, magnesium, renal function, and acid-base status because fluid sequestration and suction rapidly disturb volume and electrolytes.",
      "Maintain prescribed fasting or staged feeding and gastric decompression, verifying tube position and patency; do not advance diet solely because bowel sounds are present.",
      "Promote early assisted mobility, chewing gum when ordered, opioid-sparing analgesia, and removal of unnecessary tubes because immobility, opioids, and invasive devices delay gastrointestinal recovery.",
      "Review surgery type, opioid and anticholinergic exposure, fluid balance, infection, hematoma, and metabolic triggers while inspecting the incision and drains for evidence of a surgical complication.",
      "Escalate for peritoneal signs, focal escalating pain, fever, tachycardia or hypotension, rising lactate, feculent drainage or emesis, wound change, or failure of bowel function beyond the expected course."
    ], [
      "Guarding, rebound, rigidity, or new focal pain rather than diffuse discomfort",
      "Fever, persistent tachycardia, hypotension, rising lactate, or oliguria",
      "Feculent emesis or drain output, wound dehiscence, gastrointestinal bleeding, or rapidly increasing distention",
      "No expected recovery or worsening symptoms despite decompression and trigger correction"
    ], [
      "Explain that surgery, anesthesia, opioids, inflammation, and immobility can temporarily pause bowel movement; walking and the recovery plan help, but eating too early may worsen vomiting.",
      "Follow the ordered diet stages and movement plan, avoid unapproved laxatives, and report localized worsening pain, a rigid abdomen, fever, repeated vomiting, or wound drainage immediately."
    ]),
    card("ICU delirium", ["sccm-padis-2025"], [
      "Assess delirium with a validated ICU tool after checking arousal, and document baseline cognition and fluctuation because hypoactive delirium is common, dangerous, and easily mistaken for quiet cooperation.",
      "Search promptly for hypoxemia, hypercapnia, glucose abnormality, infection, shock, stroke, seizure, pain, urinary retention, constipation, medication toxicity, and alcohol or drug withdrawal because delirium is a sign of acute brain dysfunction.",
      "Monitor oxygen saturation, respiratory status, blood pressure, glucose, temperature, urine output, bowel function, pain, and sedation depth, plus the QT interval when QT-active medicines are used, because recurrent physiologic disturbance or treatment toxicity can prolong delirium.",
      "Reorient with clocks, daylight, family voice, glasses, hearing aids, consistent staff cues, and communication aids because restoring sensory and contextual input reduces misinterpretation.",
      "Protect nighttime sleep, mobilize early, treat pain, minimize deliriogenic drugs and deep sedation, and coordinate daily awakening and breathing plans when appropriate.",
      "Use close observation, line concealment, de-escalation, and the least restrictive safety approach; reserve medication for a defined indication and reassess effect because restraints and oversedation can intensify delirium.",
      "Escalate immediately for an abrupt focal deficit, seizure, severe hypoxemia, shock, dangerous agitation, suspected withdrawal, or reduced arousal that prevents airway protection."
    ], [
      "Abrupt focal neurologic deficit, unequal pupils, seizure, or sudden coma",
      "Severe hypoxemia, hypercapnia, hypoglycemia, shock, or sepsis-associated organ dysfunction",
      "Agitation that creates immediate danger despite de-escalation and cause correction",
      "Autonomic instability, hallucinations, or tremor suggesting complicated withdrawal"
    ], [
      "Explain that ICU delirium is a temporary disturbance of attention and thinking caused by illness, medicines, sleep disruption, and unfamiliar surroundings; it is not the same as permanent dementia.",
      "Invite family to provide calm orientation, familiar facts, glasses or hearing aids, and a normal day-night routine, while reporting any sudden change rather than arguing with frightening perceptions."
    ]),
    card("Hospital-acquired pneumonia", ["idsa-hap-vap", "aarc-guidelines"], [
      "Recognize a new or worsening infiltrate with fever, purulent secretions, leukocyte change, hypoxemia, or respiratory decline occurring after hospitalization and assess for aspiration, edema, atelectasis, and pulmonary embolism because these mimics require different treatment.",
      "Obtain ordered lower-respiratory and blood cultures before antibiotics when this does not delay unstable-patient treatment because microbiologic data permit narrowing broad empiric therapy.",
      "Administer prescribed antibiotics on time using local resistance guidance, verify allergies and renal dosing, and track culture results for prompt de-escalation because unnecessary broad exposure drives toxicity and resistance.",
      "Monitor respiratory rate, work, oxygen requirement, mental status, perfusion, temperature, sputum, renal function, lactate, and complete blood count to detect respiratory failure or sepsis.",
      "Keep the head elevated when appropriate, perform regular oral care, mobilize, manage secretions, and assess swallowing and feeding-tube aspiration risk because hospital exposures and impaired airway defenses permit lower-airway infection.",
      "Escalate for rapidly increasing oxygen or ventilatory need, exhaustion, hypotension, confusion, oliguria, rising lactate, hemoptysis, pleural complication, or no clinical improvement on expected therapy."
    ], [
      "Rapidly rising oxygen requirement, respiratory fatigue, cyanosis, or need for ventilatory support",
      "Hypotension, confusion, rising lactate, oliguria, or other sepsis-associated organ dysfunction",
      "Hemoptysis, pleuritic pain with effusion, suspected empyema, abscess, or pneumothorax",
      "Persistent or worsening fever and respiratory decline despite appropriately targeted antibiotics"
    ], [
      "Explain that this pneumonia develops after hospital exposure and weakened airway defenses, so cultures help identify the organism and shorten broad antibiotic treatment when possible.",
      "Use assisted mobility, upright meals, oral care, coughing and breathing exercises as directed, and report increasing breathlessness, confusion, chest pain, or bloody sputum immediately."
    ]),
    card("Eye trauma", ["aao-ocular-trauma"], [
      "Assess mechanism, chemical or high-velocity exposure, time, contact-lens use, visual acuity in each eye, pupils, eye movements, and visible injury without pressing on the globe because mechanism and vision loss determine urgency.",
      "For suspected open globe, place a rigid shield without a pressure patch, keep the patient fasting, prevent bending or straining, and give ordered analgesia and antiemetics because external pressure or vomiting can extrude ocular contents.",
      "Do not perform tonometry, manipulate protruding material, remove an embedded object, or instill unapproved drops when globe rupture is possible; obtain urgent ophthalmology and imaging support.",
      "For chemical exposure, begin immediate copious irrigation before completing the history, remove contact lenses when easily possible, and follow ocular pH because exposure time drives tissue injury.",
      "Assess tetanus status and monitor severe pain, headache, nausea, hyphema level, afferent pupillary defect, and declining vision because orbital compartment syndrome, retinal injury, and pressure elevation threaten sight.",
      "Escalate immediately for reduced vision, teardrop pupil, extrusion, 360-degree subconjunctival hemorrhage, proptosis with tight lids, afferent pupillary defect, hyphema, or ongoing chemical burn."
    ], [
      "Sudden or progressive vision loss, afferent pupillary defect, or severe eye pain",
      "Teardrop pupil, visible extrusion, embedded object, or suspected open globe",
      "Proptosis, tight orbit, restricted eye movement, nausea, or signs of orbital compartment syndrome",
      "Chemical exposure with persistent abnormal pH, corneal haze, or inability to irrigate"
    ], [
      "Tell the patient not to rub, press, patch tightly, remove an embedded object, eat, or drink while a globe injury is being evaluated; keep the rigid shield in place.",
      "For chemical splashes, start continuous clean-water irrigation immediately and call for help rather than searching for a neutralizer; every minute of contact can deepen injury."
    ]),
    card("Mechanical valve complications", ["acc-valve-2020", "aabb-circular"], [
      "Assess new dyspnea, orthopnea, chest pain, syncope, fever, embolic symptoms, bleeding, heart sounds, perfusion, and heart-failure signs because thrombosis, obstruction, regurgitation, infection, and anticoagulant bleeding can present abruptly.",
      "Verify valve type and position, anticoagulant, individualized INR goal, last dose, recent INR results, diet or medication changes, and missed therapy because mechanical valves require continuous risk-balanced anticoagulation.",
      "Obtain ordered electrocardiography, INR, complete blood count, hemolysis studies, cultures, and urgent echocardiography while maintaining rhythm and hemodynamic monitoring because altered gradients or leaflet motion may need emergency intervention.",
      "Do not independently hold, reverse, bridge, or restart anticoagulation; coordinate the valve, cardiology, surgical, and anticoagulation teams because both interruption and excessive anticoagulation can be catastrophic.",
      "Inspect urine, stool, skin, neurologic status, and procedural sites for bleeding and monitor for transfusion reaction when blood products are required.",
      "Escalate immediately for acute pulmonary edema, a changed or absent valve click, new murmur, shock, stroke or limb ischemia, major bleeding, severe anemia, or fever with valve dysfunction."
    ], [
      "Acute dyspnea, pulmonary edema, hypotension, syncope, or shock",
      "Changed or absent mechanical click, new murmur, or sudden rise in valve gradient",
      "New focal neurologic deficit, vision loss, severe abdominal pain, or a cold painful limb",
      "Intracranial, gastrointestinal, retroperitoneal, or uncontrolled bleeding, or fever with suspected endocarditis"
    ], [
      "Explain that the valve can form a dangerous clot if anticoagulation is interrupted, but excessive anticoagulation can cause major bleeding; dose changes must come from the managing team.",
      "Keep INR appointments, maintain a consistent vitamin K intake, check every new prescription or supplement for interactions, and seek emergency help for stroke symptoms, severe breathlessness, fainting, major bleeding, or a changed valve sound."
    ]),
    card("Pancytopenia", ["aabb-circular", "asco-idsa-neutropenia"], [
      "Trend the complete blood count with differential, reticulocyte count, smear findings, and prior baseline because simultaneous anemia, neutropenia, and thrombocytopenia may reflect marrow failure, destruction, sequestration, infection, or treatment toxicity.",
      "Assess fever, chills, mucosal lesions, line sites, cough, dysuria, abdominal or rectal symptoms, and hemodynamics because neutropenia can blunt pus and inflammation while infection progresses rapidly.",
      "Use meticulous hand and line hygiene, avoid sick contacts and unsafe food exposures per local policy, and obtain ordered cultures and antibiotics urgently for fever without waiting for the neutrophil count to recover.",
      "Assess petechiae, gums, urine, stool, menses, neurologic status, and procedural sites; avoid intramuscular injections, rectal procedures, aspirin, and unnecessary venipuncture because low platelets increase mucosal and intracranial bleeding risk.",
      "Evaluate fatigue, dyspnea, chest pain, tachycardia, dizziness, and perfusion and administer prescribed red-cell or platelet transfusion with identity, compatibility, and reaction monitoring.",
      "Escalate immediately for fever at the oncology team's threshold, sepsis signs, active major bleeding, severe headache or neurologic change, chest pain, hypoxemia, syncope, or a transfusion reaction."
    ], [
      "Fever at the prescribed neutropenia threshold, rigors, hypotension, confusion, or reduced urine",
      "Uncontrolled bleeding, melena, hematemesis, heavy vaginal bleeding, or rapidly spreading petechiae",
      "Severe headache, new focal deficit, vision change, seizure, or head injury with thrombocytopenia",
      "Chest pain, severe dyspnea, syncope, tissue hypoxia, or fever, wheeze, pain, or hypotension during transfusion"
    ], [
      "Explain that all three major blood-cell lines are low: infection may become severe with little redness, platelets affect bleeding, and red-cell loss causes fatigue and breathlessness.",
      "Use the team's exact fever threshold and call immediately rather than taking acetaminophen first; also report bleeding, black stool, severe headache, chest pain, fainting, or shortness of breath."
    ])
  ];

  function canonicalPrimary(entry) {
    return String((entry && (entry.name || entry.title || entry.displayName)) || "").trim();
  }

  function normalizePrimary(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  const attempted = patches.map((patch) => patch.name);
  const appliedNames = [];
  const unresolved = [];

  if (!database || !Array.isArray(database.diseases)) {
    unresolved.push({ name: "__database__", matchCount: 0, reason: "ANI_PATHOLOGY_DATABASE.diseases unavailable" });
  } else {
    patches.forEach((patch) => {
      const target = normalizePrimary(patch.name);
      const matches = database.diseases.filter((entry) => normalizePrimary(canonicalPrimary(entry)) === target);
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
  window.ANI_PATHOLOGY_NURSING_WAVE27_B = {
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
