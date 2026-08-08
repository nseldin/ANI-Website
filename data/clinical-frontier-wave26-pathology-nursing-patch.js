(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  const VERSION = "2026-07-17-wave26-pathology-nursing-1";
  const sources = [
    {
      id: "aha-als-2025",
      label: "American Heart Association, 2025 Adult Advanced Life Support",
      url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support",
      note: "Supports rhythm recognition, defibrillation, cardioversion, reversible-cause assessment, and post-arrest priorities."
    },
    {
      id: "aha-special-2025",
      label: "American Heart Association, Adult and Pediatric Special Circumstances of Resuscitation",
      url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation",
      note: "Supports resuscitation priorities for poisoning, anaphylaxis, pulmonary embolism, electrolyte emergencies, and other special circumstances."
    },
    {
      id: "sccm-sepsis-2026",
      label: "Society of Critical Care Medicine, Surviving Sepsis Campaign Adult Guidelines",
      url: "https://sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines",
      note: "Supports prompt recognition, cultures and antimicrobials, lactate and perfusion reassessment, fluids, vasopressors, and source-control escalation."
    },
    {
      id: "ada-hospital-2026",
      label: "American Diabetes Association, Diabetes Care in the Hospital: Standards of Care in Diabetes 2026",
      url: "https://diabetesjournals.org/care/article/49/Supplement_1/S339/163925/16-Diabetes-Care-in-the-Hospital-Standards-of-Care",
      note: "Supports inpatient glucose surveillance and treatment principles for diabetic and hypoglycemic emergencies."
    },
    {
      id: "acog-pph",
      label: "American College of Obstetricians and Gynecologists, Postpartum Hemorrhage",
      url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2017/10/postpartum-hemorrhage",
      note: "Supports structured recognition and escalation for postpartum hemorrhage, uterine atony, blood loss, and maternal instability."
    },
    {
      id: "acog-hypertension",
      label: "American College of Obstetricians and Gynecologists, Gestational Hypertension and Preeclampsia",
      url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2020/06/gestational-hypertension-and-preeclampsia",
      note: "Supports surveillance and urgent response to severe hypertension, eclampsia, and HELLP warning findings."
    },
    {
      id: "acog-labor",
      label: "American College of Obstetricians and Gynecologists, First and Second Stage Labor Management",
      url: "https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2024/01/first-and-second-stage-labor-management",
      note: "Supports intrapartum maternal and fetal assessment; emergency maneuvers remain governed by local obstetric protocols."
    },
    {
      id: "cdc-meningococcal",
      label: "Centers for Disease Control and Prevention, Clinical Guidance for Meningococcal Disease",
      url: "https://www.cdc.gov/meningococcal/hcp/clinical-guidance/index.html",
      note: "Supports immediate antimicrobial treatment and infection-control priorities for suspected meningococcal disease."
    },
    {
      id: "aabb-circular-2024",
      label: "AABB, Circular of Information for the Use of Human Blood and Blood Components",
      url: "https://www.aabb.org/news-resources/resources/circular-of-information",
      note: "Supports recognition, immediate transfusion interruption, verification, and evaluation of suspected transfusion reactions."
    },
    {
      id: "ash-hit",
      label: "American Society of Hematology, Heparin-Induced Thrombocytopenia Guideline",
      url: "https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/heparin-induced-thrombocytopenia",
      note: "Supports pretest assessment, stopping heparin when HIT is sufficiently suspected, and use of a non-heparin anticoagulant under clinician direction."
    },
    {
      id: "ncs-guidelines",
      label: "Neurocritical Care Society, Neurocritical Care Guidelines",
      url: "https://www.neurocriticalcare.org/Resources-Publications/Neurocritical-Care-Guidelines",
      note: "Links the society guidelines for status epilepticus and acute cerebral edema management."
    },
    {
      id: "endocrine-adrenal",
      label: "Endocrine Society, Primary Adrenal Insufficiency Clinical Practice Guideline",
      url: "https://www.endocrine.org/clinical-practice-guidelines/primary-adrenal-insufficiency",
      note: "Supports urgent glucocorticoid treatment and fluid/electrolyte assessment in suspected adrenal crisis."
    },
    {
      id: "ata-thyroid",
      label: "American Thyroid Association, Professional Guidelines",
      url: "https://www.thyroid.org/professionals/ata-professional-guidelines/",
      note: "Provides the professional guideline hub for severe thyrotoxicosis and hypothyroid disease management."
    },
    {
      id: "acc-aortic-2022",
      label: "American College of Cardiology and American Heart Association, Aortic Disease Guideline",
      url: "https://www.acc.org/Guidelines/Guidelines/2022/11/02/13/50/2022-Guideline-for-the-Diagnosis-and-Management-of-Aortic-Disease",
      note: "Supports urgent recognition, hemodynamic control, imaging, and specialist escalation for acute aortic syndromes."
    },
    {
      id: "aha-toxicology-2023",
      label: "American Heart Association, Life-Threatening Toxicity Due to Poisoning Focused Update",
      url: "https://professional.heart.org/en/science-news/2023-american-heart-association-focused-update-on-the-management-of-patients-with-cardiac-arrest/top-things-to-know",
      note: "Supports poison-center or toxicologist consultation and toxin-specific resuscitation for life-threatening poisoning."
    },
    {
      id: "nci-oncology-emergencies",
      label: "National Cancer Institute, Cancer Treatment Side Effects and Related Conditions",
      url: "https://www.cancer.gov/about-cancer/treatment/side-effects",
      note: "Provides peer-reviewed patient and clinician resources for cancer-related emergencies; individual entries retain local oncology and emergency protocols as the action standard."
    },
    {
      id: "nci-cardiopulmonary-pdq",
      label: "National Cancer Institute, Cardiopulmonary Syndromes (PDQ), Health Professional Version",
      url: "https://www.cancer.gov/about-cancer/treatment/side-effects/cardiopulmonary-hp-pdq",
      note: "Supports recognition and cause-directed evaluation of superior vena cava syndrome and other malignant cardiopulmonary syndromes."
    },
    {
      id: "acc-heart-failure-2022",
      label: "American College of Cardiology, 2022 AHA/ACC/HFSA Heart Failure Guideline",
      url: "https://www.acc.org/Guidelines/Guidelines/2022/03/30/16/38/2022-Heart-Failure",
      note: "Supports assessment, cause-directed treatment, congestion monitoring, and escalation for acute or chronic heart failure and cardiomyopathy."
    },
    {
      id: "acc-pad-2024",
      label: "American College of Cardiology, 2024 Lower Extremity Peripheral Artery Disease Guideline",
      url: "https://www.acc.org/guidelines/guidelines/2024/05/14/11/09/2024-lower-extremity-peripheral-artery-disease",
      note: "Supports urgent recognition and specialist management of acute limb ischemia and longitudinal vascular risk reduction."
    },
    {
      id: "idsa-cdiff",
      label: "IDSA and SHEA, Clostridioides difficile Infection Guideline",
      url: "https://www.idsociety.org/practice-guideline/clostridium-difficile/",
      note: "Supports appropriate testing, contact precautions, treatment, and recognition of fulminant C. difficile infection."
    },
    {
      id: "idsa-cap",
      label: "IDSA, Adult Community-Acquired Pneumonia Clinical Pathway",
      url: "https://www.idsociety.org/globalassets/idsa/practice-guidelines/community-acquired-pneumonia-in-adults/cap-clinical-pathway-final-online.pdf",
      note: "Supports severity assessment, diagnostic testing, antimicrobial treatment, and daily response review for adult community-acquired pneumonia."
    },
    {
      id: "aasld-ascites-sbp",
      label: "AASLD, Ascites, Spontaneous Bacterial Peritonitis, and Hepatorenal Syndrome Guidance",
      url: "https://www.aasld.org/practice-guidelines/diagnosis-evaluation-and-management-ascites-spontaneous-bacterial-peritonitis",
      note: "Supports prompt diagnostic evaluation and treatment of decompensated cirrhosis, ascites, and spontaneous bacterial peritonitis."
    },
    {
      id: "kdigo-glomerular",
      label: "KDIGO, Glomerular Diseases Guideline Suite",
      url: "https://kdigo.org/guidelines/gd/",
      note: "Supports cause-specific assessment, kidney-function surveillance, and complication management for glomerular disease."
    },
    {
      id: "va-dod-suicide-2024",
      label: "VA/DoD, Assessment and Management of Patients at Risk for Suicide Clinical Practice Guideline",
      url: "https://www.healthquality.va.gov/guidelines/MH/srb/index.asp",
      note: "Supports direct risk assessment, acute-risk management, safety planning, and coordinated follow-up for suicidal behavior."
    },
    {
      id: "acog-perinatal-mental-health",
      label: "ACOG, Screening and Diagnosis of Mental Health Conditions During Pregnancy and Postpartum",
      url: "https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2023/06/screening-and-diagnosis-of-mental-health-conditions-during-pregnancy-and-postpartum",
      note: "Supports recognition of suicidality, bipolar illness, and acute postpartum psychosis with timely psychiatric escalation."
    },
    {
      id: "aha-pals-2025",
      label: "American Heart Association and American Academy of Pediatrics, 2025 Pediatric Advanced Life Support",
      url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support",
      note: "Supports pediatric recognition, airway and circulatory stabilization, congenital-heart considerations, and escalation before arrest."
    },
    {
      id: "aha-neonatal-2025",
      label: "American Heart Association and American Academy of Pediatrics, 2025 Neonatal Resuscitation",
      url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation",
      note: "Supports assessment and stabilization principles for newborn respiratory and circulatory transition."
    },
    {
      id: "ash-scd-guidelines",
      label: "American Society of Hematology, Clinical Practice Guidelines on Sickle Cell Disease",
      url: "https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/sickle-cell-disease-guidelines",
      note: "Supports acute pain, transfusion, cerebrovascular, and cardiopulmonary complication management in children and adults with sickle cell disease."
    },
    {
      id: "ons-asco-extravasation-2025",
      label: "Oncology Nursing Society and ASCO, Antineoplastic Extravasation Guideline",
      url: "https://www.ons.org/publications-research/cjon/29/5/onsasco-guideline-management-antineoplastic-extravasation",
      note: "Supports immediate infusion interruption, agent-specific measures, escalation, and follow-up for antineoplastic extravasation."
    }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const cards = [
    card("Anaphylactic shock", ["aha-special-2025"], [
      "Administer intramuscular epinephrine promptly and repeat it per the emergency protocol because delayed epinephrine allows airway edema and distributive shock to progress.",
      "Position the patient supine with legs elevated when tolerated and establish large-bore intravenous access because upright posture and inadequate preload can worsen anaphylactic hypotension.",
      "Monitor airway swelling, voice change, stridor, oxygen saturation, blood pressure, and cardiac rhythm continuously to detect recurrent bronchospasm or cardiovascular collapse.",
      "Escalate immediately for persistent hypotension, worsening stridor, cyanosis, or declining mental status because these findings signal refractory anaphylaxis requiring advanced airway and vasopressor support."
    ], [
      "Progressive stridor, hoarseness, tongue swelling, or inability to handle secretions",
      "Persistent hypotension or syncope after intramuscular epinephrine",
      "Cyanosis, silent chest, severe wheeze, or rapidly falling oxygen saturation",
      "Recurrent symptoms after initial improvement"
    ], [
      "Teach the patient to carry accessible epinephrine autoinjectors and use one at the first sign of a serious systemic reaction, then seek emergency care because symptoms can recur.",
      "Review the likely trigger, avoidance plan, device technique, expiration dates, and the value of allergy specialist follow-up."
    ]),
    card("Acute respiratory failure", ["aha-als-2025"], [
      "Assess work of breathing, respiratory rate, breath sounds, mental status, and oxygen saturation together because a normal saturation can coexist briefly with exhausting ventilation.",
      "Apply titrated oxygen and prepare noninvasive or invasive ventilatory support as ordered because hypoxemia and carbon dioxide retention can rapidly impair the brain and heart.",
      "Trend arterial or venous blood gases, carbon dioxide, oxygenation, and response to ventilation to detect worsening gas exchange before respiratory arrest occurs.",
      "Escalate immediately for apnea, a silent chest, rising carbon dioxide with somnolence, refractory hypoxemia, or inability to protect the airway because these are signs of impending ventilatory collapse."
    ], [
      "Apnea, agonal breathing, or inability to protect the airway",
      "Refractory hypoxemia despite increasing oxygen support",
      "Rising carbon dioxide with confusion, somnolence, or acidosis",
      "Exhaustion, paradoxical breathing, or a rapidly decreasing respiratory rate"
    ], [
      "Explain that improvement in breathlessness does not always mean gas exchange has normalized, so ordered oxygen, ventilation, and reassessment must continue.",
      "Teach the patient to seek urgent care for new confusion, blue lips, inability to speak normally, severe breathlessness, or failure of the prescribed rescue plan."
    ]),
    card("Status asthmaticus", ["aha-special-2025"], [
      "Administer repeated inhaled bronchodilator therapy and systemic corticosteroid treatment as ordered because persistent bronchospasm, mucus, and airway inflammation can cause fatal air trapping.",
      "Assess speech, accessory-muscle use, air movement, peak flow when feasible, and oxygen saturation frequently because diminishing wheeze may mean critically low airflow rather than improvement.",
      "Monitor respiratory rate, mental status, carbon dioxide, and response after each treatment to detect fatigue and failing ventilation before arrest.",
      "Escalate immediately for a silent chest, cyanosis, altered mental status, rising carbon dioxide, or exhaustion because these findings require expert airway and ventilatory support."
    ], [
      "Silent chest or markedly reduced air entry",
      "Increasing carbon dioxide, confusion, drowsiness, or exhaustion",
      "Cyanosis or oxygen saturation that remains low despite support",
      "Bradycardia, hypotension, or respiratory arrest"
    ], [
      "Teach that frequent rescue-inhaler use, nighttime symptoms, or activity limitation means control is inadequate and the asthma plan needs prompt review.",
      "Review inhaler and spacer technique, controller adherence, trigger reduction, and the written thresholds for urgent or emergency care."
    ]),
    card("Epiglottitis", ["cdc-meningococcal"], [
      "Keep the patient upright and minimize agitation because crying, forced positioning, or unnecessary throat manipulation can convert a narrowed airway into complete obstruction.",
      "Do not use a tongue blade, examine the throat routinely, or obtain a throat specimen until an airway expert is ready because direct manipulation can trigger laryngospasm and sudden obstruction.",
      "Monitor stridor, drooling, voice quality, retractions, oxygen saturation, and alertness continuously to detect narrowing before oxygenation collapses.",
      "Escalate immediately for increasing stridor, tripod positioning, cyanosis, fatigue, or decreasing consciousness because controlled airway management may be urgently required."
    ], [
      "Stridor at rest, drooling, muffled voice, or inability to swallow",
      "Tripod positioning with severe retractions",
      "Cyanosis, fatigue, or declining level of consciousness",
      "Abrupt reduction in air movement"
    ], [
      "Explain that the throat should not be examined at home and that drooling, stridor, or difficulty swallowing requires emergency evaluation.",
      "Reinforce completion of prescribed antibiotic therapy and review vaccination and close-contact guidance with the treating team."
    ]),
    card("Tension pneumothorax", ["aha-special-2025"], [
      "Give high-concentration oxygen and activate the emergency response because increasing pleural pressure can obstruct venous return and cause pulseless obstructive shock.",
      "Assess bilateral breath sounds, chest movement, blood pressure, neck veins, and tracheal position without delaying treatment because tension pneumothorax is a clinical emergency.",
      "Prepare immediate needle or finger decompression followed by chest-tube placement because pressure must be released before ventilation and perfusion can recover.",
      "Escalate immediately for unilateral absent breath sounds with hypotension, severe hypoxemia, rapidly rising airway pressure, or pulseless electrical activity because decompression cannot wait for imaging."
    ], [
      "Unilateral absent breath sounds with hypotension or severe distress",
      "Rapidly rising ventilator pressure with falling oxygen saturation",
      "Distended neck veins, cyanosis, or tracheal deviation",
      "Pulseless electrical activity after chest trauma or positive-pressure ventilation"
    ], [
      "Teach patients with a chest tube to report sudden dyspnea, new chest pain, disconnection, or rapid bubbling changes because these may signal recurrent air leakage.",
      "Explain that sudden one-sided chest pain with breathlessness after discharge requires emergency evaluation rather than watchful waiting."
    ]),
    card("Massive pulmonary embolism", ["aha-special-2025"], [
      "Apply oxygen, establish intravenous access, and activate the pulmonary embolism or resuscitation pathway because right-ventricular outflow obstruction can progress rapidly to shock and arrest.",
      "Monitor blood pressure, rhythm, oxygen saturation, mental status, urine output, and lactate to detect worsening right-heart failure and systemic hypoperfusion.",
      "Prepare anticoagulation and reperfusion therapy as directed while checking contraindications because clot reduction may restore perfusion but can also cause major bleeding.",
      "Escalate immediately for persistent hypotension, syncope, rising lactate, worsening hypoxemia, chest pain with shock, or pulseless electrical activity because these findings indicate hemodynamic collapse."
    ], [
      "Persistent hypotension, syncope, or rapidly rising lactate",
      "Severe hypoxemia or abrupt mental-status decline",
      "Signs of right-heart failure with shock",
      "Pulseless electrical activity or sudden cardiovascular collapse"
    ], [
      "Explain why anticoagulant doses must not be skipped and review bleeding precautions, medication interactions, and planned follow-up.",
      "Teach the patient to seek emergency care for recurrent sudden dyspnea, syncope, chest pain, coughing blood, or major bleeding."
    ]),
    card("Sepsis", ["sccm-sepsis-2026"], [
      "Obtain ordered blood cultures promptly and administer prescribed broad antimicrobial therapy without avoidable delay because uncontrolled infection can drive progressive organ dysfunction.",
      "Measure lactate and assess perfusion, mental status, capillary refill, blood pressure, and urine output because sepsis may impair tissue oxygen delivery before profound hypotension appears.",
      "Administer ordered crystalloid fluid with repeated lung and perfusion reassessment because restoring circulation before or alongside vasopressor therapy must be balanced against fluid overload.",
      "Escalate immediately for falling blood pressure, rising lactate, oliguria, new confusion, mottling, or increasing oxygen needs because these findings suggest evolving septic shock or another failing organ."
    ], [
      "New hypotension, mottling, or delayed capillary refill",
      "Rising lactate or decreasing urine output",
      "New confusion, reduced consciousness, or severe weakness",
      "Increasing oxygen requirement or signs of another acute organ failure"
    ], [
      "Teach patients and caregivers that infection accompanied by confusion, severe breathlessness, very low urine output, mottled skin, or rapid deterioration requires emergency care.",
      "Explain the infection source, antimicrobial plan, device or wound care, and follow-up needed to reduce recurrence."
    ]),
    card("Septic shock", ["sccm-sepsis-2026"], [
      "Administer prescribed antimicrobials and coordinate urgent source control because vasopressors cannot reverse shock while an uncontrolled infection continues to generate inflammation.",
      "Give ordered crystalloid in reassessed increments and evaluate lungs, capillary refill, blood pressure, and urine output because both inadequate preload and fluid overload can worsen organ function.",
      "Titrate the ordered vasopressor while monitoring mean arterial pressure, rhythm, extremity perfusion, lactate, and urine output to detect persistent or treatment-related hypoperfusion.",
      "Escalate immediately for refractory hypotension, rising lactate, anuria, worsening mottling, new arrhythmia, or declining consciousness because these findings signal shock that remains inadequately controlled."
    ], [
      "Refractory hypotension despite initial resuscitation",
      "Rising lactate, worsening mottling, or anuria",
      "New arrhythmia or ischemic extremity changes during vasopressor therapy",
      "Declining consciousness or rapidly increasing respiratory support"
    ], [
      "Explain that septic shock is organ-threatening even when the original infection seemed minor, which is why monitoring and treatment continue after blood pressure improves.",
      "Before discharge, review infection warning signs, medication completion, wound or line care, and when to return immediately."
    ]),
    card("Hypovolemic shock", ["aha-als-2025"], [
      "Identify and control visible blood or fluid loss while activating the appropriate hemorrhage and transfusion pathway because replacement alone cannot overcome ongoing volume loss.",
      "Establish rapid vascular access and administer ordered warmed fluids or blood products because restoring circulating volume is necessary to recover preload and tissue perfusion.",
      "Monitor mental status, pulse pressure, capillary refill, urine output, temperature, hemoglobin, and lactate to detect continuing loss and inadequate resuscitation.",
      "Prepare matched blood products and a rapid transfusion device when major hemorrhage is suspected because crystalloid alone cannot restore oxygen-carrying capacity or consumed components.",
      "Escalate immediately for persistent hypotension, worsening tachycardia, falling hemoglobin, oliguria, cool mottled skin, or rising lactate because these findings suggest uncontrolled loss or decompensated shock."
    ], [
      "Persistent hypotension or narrowing pulse pressure",
      "Falling hemoglobin with active or suspected bleeding",
      "Oliguria, confusion, or rising lactate",
      "Cool mottled skin, severe tachycardia, or cardiovascular collapse"
    ], [
      "Teach the patient to report recurrent bleeding, black stool, vomiting blood, fainting, severe thirst, or sharply reduced urine output immediately.",
      "Explain the identified source of volume loss and the hydration, medication, wound, or bleeding-prevention plan before discharge."
    ]),
    card("Cardiogenic shock", ["aha-als-2025"], [
      "Apply oxygen when hypoxemic, obtain a 12-lead electrocardiogram, and activate the cardiac shock pathway because rapid diagnosis and reperfusion can limit further pump failure.",
      "Assess lung sounds, jugular venous pressure, edema, skin perfusion, and work of breathing before and after ordered fluids because excess volume can worsen pulmonary edema.",
      "Monitor rhythm, mean arterial pressure, urine output, lactate, troponin, and mental status during vasopressor or inotrope therapy to detect persistent hypoperfusion and dysrhythmia.",
      "Prepare ordered vasopressor or inotrope infusions and the institution's invasive-hemodynamic or mechanical-circulatory-support equipment because persistently low cardiac output may require rapid escalation while reperfusion or cause-directed treatment proceeds.",
      "Escalate immediately for refractory hypotension, new ventricular arrhythmia, frothy pulmonary edema, chest pain, oliguria, or rising lactate because mechanical support or urgent coronary intervention may be required."
    ], [
      "Refractory hypotension with cool, poorly perfused extremities",
      "New ventricular arrhythmia or recurrent ischemic chest pain",
      "Rapidly worsening pulmonary edema or hypoxemia",
      "Oliguria, rising lactate, or declining mental status"
    ], [
      "Explain that increasing breathlessness, fainting, chest pressure, new swelling, or sudden weight gain can signal worsening pump failure and needs prompt assessment.",
      "Review medication adherence, daily weight technique, sodium and fluid guidance, and the specific thresholds for contacting the cardiac team."
    ]),
    card("Obstructive shock", ["aha-special-2025"], [
      "Assess for tension pneumothorax, cardiac tamponade, and massive pulmonary embolism because obstructive shock will not resolve until the mechanical barrier to circulation is relieved.",
      "Apply oxygen, establish vascular access, and obtain focused hemodynamic and bedside ultrasound data without delaying rescue because deterioration can be abrupt.",
      "Monitor blood pressure, rhythm, jugular venous pressure, breath sounds, oxygen saturation, lactate, and urine output to identify the obstruction pattern and response to treatment.",
      "Escalate immediately for pulseless electrical activity, unilateral absent breath sounds, severe jugular venous distention, refractory hypoxemia, or persistent hypotension because emergency decompression, drainage, or reperfusion may be lifesaving."
    ], [
      "Pulseless electrical activity with a plausible mechanical cause",
      "Unilateral absent breath sounds with hypotension",
      "Marked jugular venous distention with shock",
      "Refractory hypoxemia, syncope, or persistent hypotension"
    ], [
      "Explain that obstructive shock is caused by blocked circulation rather than simple dehydration, so definitive procedures may be needed urgently.",
      "After stabilization, teach the warning symptoms specific to the cause, including sudden dyspnea, syncope, chest pain, and recurrent swelling or bleeding."
    ]),
    card("Neurogenic shock", ["aha-als-2025"], [
      "Maintain spinal alignment and movement precautions while assessing motor and sensory function because unstable spinal injury can worsen neurologic damage.",
      "Support oxygenation and administer ordered fluid and vasopressor therapy because loss of sympathetic tone can produce hypotension that compromises spinal-cord perfusion.",
      "Monitor blood pressure, heart rate, temperature, urine output, skin warmth, and serial neurologic findings to distinguish neurogenic shock from hemorrhage and detect deterioration.",
      "Escalate immediately for persistent hypotension, severe bradycardia, new motor weakness, respiratory decline, or loss of sensation because these findings indicate inadequate perfusion or ascending cord dysfunction."
    ], [
      "Persistent hypotension with inappropriate bradycardia",
      "New or worsening motor weakness or sensory loss",
      "Respiratory decline after cervical spinal injury",
      "Poikilothermia, oliguria, or declining consciousness"
    ], [
      "Explain why spinal precautions and assisted repositioning remain necessary until instability is excluded.",
      "Teach the patient and caregiver to report new weakness, numbness, breathing difficulty, dizziness, or bowel and bladder changes immediately."
    ]),
    card("Inferior wall MI", ["aha-als-2025"], [
      "Obtain serial 12-lead electrocardiograms with right-sided leads when indicated because inferior infarction may involve the right ventricle and alter fluid and medication tolerance.",
      "Administer antiplatelet and reperfusion therapies as ordered while checking bleeding risks because rapid coronary reperfusion limits myocardium lost to ischemia.",
      "Monitor chest pain, blood pressure, heart rate, atrioventricular conduction, rhythm, and signs of right-sided failure to detect bradyarrhythmia or preload-sensitive shock.",
      "Escalate immediately for persistent ischemic pain, new heart block, severe bradycardia, hypotension, syncope, or ventricular arrhythmia because urgent pacing, reperfusion, or circulatory support may be required."
    ], [
      "Persistent chest pain or evolving electrocardiographic changes",
      "New high-grade atrioventricular block or severe bradycardia",
      "Hypotension, syncope, or signs of right-ventricular failure",
      "Ventricular tachycardia or ventricular fibrillation"
    ], [
      "Teach the patient to call emergency services for recurrent pressure, dyspnea, sweating, nausea, or faintness rather than driving to care.",
      "Explain the purpose of antiplatelet therapy, cardiac rehabilitation, risk-factor control, and adherence after reperfusion."
    ]),
    card("Hypertensive emergency", ["aha-als-2025"], [
      "Confirm severe blood pressure with correct cuff size and assess the brain, heart, kidneys, retina, and aorta because acute target-organ injury distinguishes emergency from an isolated high reading.",
      "Administer titratable intravenous antihypertensive therapy as ordered and avoid abrupt unplanned pressure drops because excessive reduction can impair cerebral, coronary, and renal perfusion.",
      "Monitor blood pressure frequently with neurologic findings, chest pain, rhythm, urine output, creatinine, and visual symptoms to detect ongoing injury or treatment-related hypoperfusion.",
      "Escalate immediately for new focal deficit, seizure, encephalopathy, tearing chest or back pain, pulmonary edema, oliguria, or worsening vision because each may indicate active organ damage."
    ], [
      "New focal neurologic deficit, seizure, or encephalopathy",
      "Tearing chest or back pain or unequal pulses",
      "Acute pulmonary edema or myocardial ischemia",
      "Oliguria, rising creatinine, or abrupt visual loss"
    ], [
      "Explain that the danger comes from organ injury, not the number alone, and that medications should not be doubled or stopped without direction.",
      "Review home blood-pressure technique, adherence barriers, interacting medicines, and the symptoms that require emergency evaluation."
    ]),
    card("Aortic dissection", ["acc-aortic-2022"], [
      "Activate the acute aortic syndrome pathway and maintain the patient at rest because shear stress can extend the dissection and rupture the aorta.",
      "Administer ordered anti-impulse therapy and analgesia while monitoring heart rate and blood pressure because reducing force and rate of ventricular ejection limits propagation.",
      "Assess pulses, limb perfusion, neurologic status, urine output, chest pain, and blood pressure in both arms to detect branch-vessel malperfusion.",
      "Escalate immediately for recurrent tearing pain, new pulse deficit, focal neurologic deficit, hypotension, syncope, tamponade signs, or oliguria because these findings may signal extension or rupture."
    ], [
      "Recurrent tearing chest, back, or abdominal pain",
      "New pulse deficit, limb ischemia, or unequal blood pressure",
      "Focal neurologic deficit, syncope, or altered consciousness",
      "Hypotension, tamponade findings, or abruptly decreasing urine output"
    ], [
      "Teach strict adherence to blood-pressure therapy and follow-up imaging because silent aortic enlargement or extension can occur.",
      "Tell the patient to seek emergency care for sudden tearing pain, fainting, new weakness, or a cold painful limb."
    ]),
    card("Ventricular tachycardia", ["aha-als-2025"], [
      "Check responsiveness, pulse, blood pressure, chest pain, heart failure signs, and mental status immediately because the same ventricular tachycardia rhythm requires different rescue when perfusion is unstable or absent.",
      "Prepare synchronized cardioversion for unstable ventricular tachycardia with a pulse because rapid rhythm termination is needed to restore effective output.",
      "Begin cardiopulmonary resuscitation and defibrillation for pulseless ventricular tachycardia because unsynchronized shock is time-critical in a shockable cardiac arrest.",
      "Escalate immediately for loss of pulse, hypotension, ischemic chest pain, acute heart failure, syncope, or worsening confusion while monitoring rhythm and perfusion because deterioration can occur without warning."
    ], [
      "Loss of pulse or unresponsiveness",
      "Hypotension, syncope, or worsening confusion",
      "Ischemic chest pain or acute heart failure",
      "Recurrent ventricular tachycardia after cardioversion"
    ], [
      "Teach patients with recurrent ventricular tachycardia to report palpitations with faintness, chest pain, or dyspnea immediately.",
      "Review medication adherence, implanted-device instructions, electrolyte follow-up, and when emergency services are needed."
    ]),
    card("Ventricular fibrillation", ["aha-als-2025"], [
      "Start high-quality cardiopulmonary resuscitation and attach a defibrillator immediately because ventricular fibrillation produces no effective cardiac output.",
      "Deliver defibrillation promptly and resume compressions without a prolonged pulse check because interruptions reduce coronary and cerebral perfusion.",
      "Administer epinephrine and the indicated antiarrhythmic medication per the cardiac-arrest algorithm because persistent ventricular fibrillation may reflect ischemia, hypoxia, toxins, or electrolyte disturbance.",
      "Reassess defibrillator pad contact, compression quality, and reversible causes after each cycle because ineffective energy delivery or untreated physiology can sustain ventricular fibrillation.",
      "Escalate for refractory ventricular fibrillation while monitoring rhythm, compression quality, airway, and end-tidal carbon dioxide because expert defibrillation strategy and advanced circulatory support may be required."
    ], [
      "Unresponsiveness with no normal breathing and no pulse",
      "Persistent ventricular fibrillation after repeated defibrillation",
      "Falling end-tidal carbon dioxide or poor compression quality",
      "Recurrent ventricular fibrillation after return of spontaneous circulation"
    ], [
      "After recovery, explain the evaluation for coronary disease, structural heart disease, medicines, electrolytes, and implanted-device needs because recurrence prevention depends on the cause.",
      "Teach family members the emergency plan, including calling emergency services, starting CPR, and using an available automated external defibrillator."
    ]),
    card("Asystole", ["aha-als-2025"], [
      "Confirm asystole in more than one lead and check cable connection and gain because fine ventricular fibrillation or equipment failure can mimic a flat rhythm.",
      "Begin high-quality cardiopulmonary resuscitation and give epinephrine per the cardiac-arrest algorithm because asystole is not a shockable rhythm.",
      "Monitor compression quality, end-tidal carbon dioxide, airway ventilation, and rhythm at scheduled checks to detect return of circulation or a change to a shockable rhythm.",
      "Escalate the search for hypoxia, hypovolemia, electrolyte disturbance, tamponade, tension pneumothorax, thrombosis, and toxins when asystole persists because correcting a reversible cause offers the path to recovery."
    ], [
      "Confirmed flat rhythm with absent pulse and unresponsiveness",
      "Persistently low end-tidal carbon dioxide despite optimized compressions",
      "Evidence of tension pneumothorax, tamponade, hemorrhage, or poisoning",
      "Rhythm conversion to ventricular fibrillation or pulseless ventricular tachycardia"
    ], [
      "When appropriate after resuscitation, explain that asystole is a cardiac-arrest rhythm and review the suspected underlying cause with the family in clear language.",
      "Offer family support and explain follow-up, neurologic assessment, or goals-of-care decisions according to the clinical outcome."
    ]),
    card("Pulseless electrical activity", ["aha-als-2025"], [
      "Confirm the absence of a pulse and begin high-quality cardiopulmonary resuscitation because organized electrical activity without mechanical output is cardiac arrest.",
      "Give epinephrine per the cardiac-arrest algorithm and avoid defibrillation unless the rhythm becomes shockable because pulseless electrical activity itself will not respond to a shock.",
      "Monitor end-tidal carbon dioxide, compression quality, airway ventilation, rhythm, and focused ultrasound findings to detect return of circulation and identify a reversible cause.",
      "Prepare pericardiocentesis or thoracostomy equipment when focused assessment supports tamponade or tension pneumothorax because mechanical obstruction must be relieved during resuscitation.",
      "Escalate immediately for suspected hemorrhage, tamponade, tension pneumothorax, pulmonary thrombosis, toxin exposure, or severe electrolyte disturbance because pericardiocentesis, thoracostomy, reperfusion, or another targeted correction may be essential for recovery."
    ], [
      "Organized electrical rhythm with no palpable pulse",
      "Evidence of hemorrhage, tamponade, or tension pneumothorax",
      "Sudden arrest with suspected pulmonary embolism or poisoning",
      "Persistently low end-tidal carbon dioxide despite effective compressions"
    ], [
      "After resuscitation, explain that electrical activity was present but the heart was not producing circulation, then review the identified or suspected cause.",
      "Provide the family with clear information about post-arrest monitoring, neurologic evaluation, and available support."
    ]),
    card("Increased ICP", ["ncs-guidelines"], [
      "Elevate the head of bed with the head and neck midline when not contraindicated because impaired venous drainage can further increase intracranial pressure.",
      "Perform frequent neurologic checks of consciousness, pupils, motor response, and new posturing because subtle change may precede herniation.",
      "Minimize fever, hypoxemia, hypotension, pain, agitation, and clustered stimulation because each can increase cerebral metabolic demand or reduce cerebral perfusion.",
      "Administer ordered hypertonic sodium or other hyperosmolar therapy while trending sodium and urine output because excessive or inadequate osmotic effect can harm cerebral perfusion and kidney function.",
      "Escalate immediately for a newly unequal pupil, rapidly decreasing consciousness, Cushing-pattern vital signs, seizure, or new posturing because urgent hyperosmolar therapy and intubation may be required."
    ], [
      "New unilateral fixed or dilated pupil",
      "Rapid decline in consciousness or new abnormal posturing",
      "Hypertension with bradycardia and irregular respirations",
      "New seizure, repeated vomiting, or abrupt focal deficit"
    ], [
      "Teach caregivers not to dismiss increasing sleepiness, repeated vomiting, severe headache, unequal pupils, or new weakness after a brain injury.",
      "Explain why calm surroundings, head positioning, fever control, and scheduled neurologic checks protect cerebral perfusion."
    ]),
    card("Status epilepticus", ["ncs-guidelines"], [
      "Time the seizure, protect the head, remove hazards, and avoid placing anything in the mouth because injury and delayed recognition of prolonged seizure activity worsen risk.",
      "Apply oxygen, suction as needed, establish intravenous access, and administer the ordered first-line antiseizure medication promptly because ongoing seizure activity can cause hypoxemia and neuronal injury.",
      "Monitor glucose, oxygen saturation, rhythm, blood pressure, temperature, and continuous electroencephalography when ordered to detect metabolic triggers and nonconvulsive persistence.",
      "Escalate immediately when seizure activity lasts five minutes, recurs without recovery, impairs ventilation, or continues after initial medication because refractory status requires advanced airway and second-line therapy."
    ], [
      "Seizure activity lasting five minutes or longer",
      "Repeated seizures without return to baseline",
      "Persistent altered consciousness with possible nonconvulsive seizure",
      "Hypoxemia, hypotension, hyperthermia, or airway compromise"
    ], [
      "Teach caregivers to time seizures, protect the person from injury, avoid restraint or objects in the mouth, and call emergency services for prolonged or repeated events.",
      "Review antiseizure medication adherence, sleep and trigger management, rescue-medication instructions, and safety around driving, water, and heights."
    ]),
    card("Meningitis", ["cdc-meningococcal"], [
      "Initiate indicated isolation precautions and obtain ordered blood cultures without delaying antibiotic therapy because bacterial meningitis can progress quickly and may expose close contacts.",
      "Administer prescribed antibiotics and adjunctive therapy on schedule because prompt effective treatment reduces ongoing meningeal inflammation and systemic spread.",
      "Monitor consciousness, pupils, focal deficits, seizure activity, temperature, blood pressure, sodium, and urine output to detect cerebral edema, shock, or inappropriate antidiuresis.",
      "Escalate immediately for purpura, hypotension, rapidly declining consciousness, new seizure, unequal pupils, or focal deficit because these findings may indicate meningococcemia, herniation, or stroke."
    ], [
      "Purpuric rash with fever or hypotension",
      "Rapid decline in consciousness or new focal deficit",
      "New seizure, unequal pupils, or abnormal posturing",
      "Shock, severe hyponatremia, or rapidly increasing respiratory support"
    ], [
      "Teach patients and families that fever with severe headache, neck stiffness, confusion, a purple rash, or difficult arousal requires emergency care.",
      "Explain isolation, vaccine review, and why identified close contacts may need prompt public-health-directed prophylaxis."
    ]),
    card("Brain herniation", ["ncs-guidelines"], [
      "Activate the neurocritical emergency response and prepare the airway because declining consciousness can rapidly eliminate protective reflexes and ventilation.",
      "Elevate the head, keep the neck midline, and avoid hypotension and hypoxemia because cerebral venous obstruction or low perfusion can accelerate herniation.",
      "Administer ordered hyperosmolar therapy and monitor sodium, osmolality, blood pressure, pupils, and urine output to detect response and treatment complications.",
      "Escalate immediately for a fixed dilated pupil, extensor posturing, Cushing-pattern vital signs, apnea, or abrupt loss of consciousness because emergent neurosurgical decompression may be required."
    ], [
      "Fixed dilated pupil or rapidly developing anisocoria",
      "Extensor posturing or abrupt loss of consciousness",
      "Hypertension with bradycardia and irregular or absent breathing",
      "Acute focal deficit followed by rapid neurologic decline"
    ], [
      "Explain to family that herniation is a time-critical pressure shift threatening the brainstem, which is why treatment proceeds while imaging and surgical decisions occur.",
      "After stabilization, review the underlying cause, expected monitoring, rehabilitation needs, and warning signs of recurrent pressure."
    ]),
    card("DKA", ["ada-hospital-2026"], [
      "Begin ordered isotonic fluid replacement and reassess blood pressure, lungs, perfusion, and urine output because osmotic diuresis causes major volume and electrolyte losses.",
      "Check potassium before and during insulin therapy and replace it as ordered because insulin and correction of acidosis shift potassium into cells and can provoke lethal hypokalemia.",
      "Administer intravenous insulin per protocol while trending glucose, anion gap, bicarbonate, pH, ketones, and mental status because ketoacidosis resolution cannot be judged by glucose alone.",
      "Escalate immediately for falling consciousness, severe hypokalemia, arrhythmia, persistent hypotension, worsening acidosis, or signs of cerebral edema because these complications can be fatal."
    ], [
      "Falling consciousness, severe headache, or signs of cerebral edema",
      "Severe hypokalemia or a new cardiac arrhythmia",
      "Persistent hypotension or rising lactate despite fluids",
      "Anion gap or acidosis that fails to improve"
    ], [
      "Teach sick-day glucose and ketone checks, hydration, when to continue basal insulin, and the thresholds for contacting the diabetes team.",
      "Explain that nausea, abdominal pain, deep breathing, confusion, or persistent high glucose with ketones requires urgent evaluation."
    ]),
    card("Hypoglycemia", ["ada-hospital-2026"], [
      "Check bedside glucose immediately when sweating, tremor, confusion, weakness, seizure, or behavior change appears because neuroglycopenia can progress quickly.",
      "Give fast-acting oral carbohydrate when swallowing is safe or administer ordered intravenous dextrose or glucagon when it is not because glucose must reach the brain promptly.",
      "Recheck glucose after treatment and continue monitoring for recurrence while identifying insulin, medication, food, alcohol, renal, or endocrine causes.",
      "Escalate immediately for persistent low glucose, seizure, unresponsiveness, inability to swallow, recurrent episodes, or failure to improve after dextrose because prolonged neuroglycopenia can injure the brain."
    ], [
      "Seizure, unresponsiveness, or inability to swallow safely",
      "Glucose that remains low after initial treatment",
      "Repeated hypoglycemia after a long-acting medication exposure",
      "Focal neurologic findings or failure to regain baseline mental status"
    ], [
      "Teach recognition of early symptoms, carrying rapid carbohydrate, checking glucose before driving or exercise, and wearing medical identification.",
      "Review glucagon use with family, meal and medication timing, alcohol risk, and why every severe or unexplained episode needs regimen review."
    ]),
    card("Hyperkalemia", ["aha-special-2025"], [
      "Place the patient on continuous cardiac monitoring and obtain a 12-lead electrocardiogram because potassium elevation can cause conduction block and sudden ventricular arrest.",
      "Administer ordered intravenous calcium for dangerous electrocardiographic changes because calcium stabilizes the myocardium while potassium-lowering measures take effect.",
      "Give ordered insulin with dextrose and other potassium-shifting or removal therapies while monitoring glucose and potassium to detect hypoglycemia and rebound elevation.",
      "Escalate immediately for widening QRS, severe bradycardia, ventricular arrhythmia, muscle paralysis, rising potassium despite therapy, or renal failure because urgent dialysis may be required."
    ], [
      "Widening QRS, sine-wave pattern, or ventricular arrhythmia",
      "Severe bradycardia, syncope, or cardiac arrest",
      "Progressive weakness or respiratory muscle paralysis",
      "Potassium that continues to rise with oliguria or renal failure"
    ], [
      "Teach the patient which medicines, supplements, salt substitutes, and high-potassium foods matter for the identified cause rather than applying a blanket restriction.",
      "Explain the need for follow-up potassium and kidney tests and emergency care for severe weakness, fainting, or sustained palpitations."
    ]),
    card("Hyponatremia", ["ncs-guidelines"], [
      "Assess onset, volume status, medication history, fluid intake, and neurologic symptoms because treatment depends on cause, chronicity, and symptom severity.",
      "Institute seizure precautions and administer prescribed hypertonic saline for severe neurologic symptoms because acute cerebral swelling can cause seizure or herniation.",
      "Trend sodium at protocol-defined intervals with urine output, mental status, and fluid balance because overly rapid correction can cause osmotic demyelination.",
      "Escalate immediately for seizure, decreasing consciousness, respiratory decline, severe headache, vomiting, or sodium rising faster than the treatment target because both the disorder and its correction can injure the brain."
    ], [
      "Seizure, coma, or rapidly declining consciousness",
      "Severe headache, repeated vomiting, or respiratory decline",
      "Sodium changing faster than the prescribed correction target",
      "New dysarthria, dysphagia, weakness, or altered behavior during correction"
    ], [
      "Explain the specific cause and individualized fluid or medication plan because not every low sodium level is treated with salt or restriction.",
      "Teach the patient to report worsening confusion, severe headache, vomiting, seizure, or new weakness immediately."
    ]),
    card("Adrenal crisis", ["endocrine-adrenal"], [
      "Administer prescribed parenteral glucocorticoid immediately when adrenal crisis is suspected because treatment should not wait for confirmatory testing in an unstable patient.",
      "Give ordered isotonic fluid and dextrose while assessing perfusion because cortisol and mineralocorticoid deficiency can cause volume depletion, hypoglycemia, and shock.",
      "Monitor blood pressure, glucose, sodium, potassium, temperature, mental status, and urine output to detect persistent shock and electrolyte complications.",
      "Escalate immediately for refractory hypotension, severe hypoglycemia, hyperkalemic arrhythmia, vomiting that prevents medication, or declining consciousness because additional critical-care support is required."
    ], [
      "Refractory hypotension or rapidly worsening shock",
      "Severe hypoglycemia or declining consciousness",
      "Hyperkalemia with electrocardiographic change",
      "Persistent vomiting that prevents oral steroid use"
    ], [
      "Teach stress-dose instructions, emergency injection technique, medical identification, and the rule never to stop chronic glucocorticoid therapy abruptly.",
      "Explain that vomiting, severe weakness, faintness, confusion, or inability to keep medication down requires immediate emergency treatment."
    ]),
    card("Thyroid storm", ["ata-thyroid"], [
      "Administer ordered beta blockade and antithyroid, iodine, and glucocorticoid therapies in the prescribed sequence because each targets a different driver of extreme thyroid hormone effect.",
      "Use cooling measures and prescribed acetaminophen while avoiding salicylates because fever increases metabolic demand and salicylates can increase free thyroid hormone.",
      "Monitor temperature, rhythm, blood pressure, heart failure signs, glucose, liver function, and mental status to detect arrhythmia and multiorgan decompensation.",
      "Escalate immediately for ventricular arrhythmia, severe heart failure, hypotension, hyperthermia, seizure, jaundice, or coma because thyroid storm can progress despite initial therapy."
    ], [
      "Ventricular arrhythmia or severe decompensated heart failure",
      "Hyperthermia with agitation, seizure, or coma",
      "Hypotension or signs of shock",
      "Jaundice, severe abdominal symptoms, or other organ failure"
    ], [
      "Teach uninterrupted antithyroid medication use and prompt follow-up because abrupt discontinuation, infection, or untreated hyperthyroidism can precipitate recurrence.",
      "Explain that high fever, severe palpitations, confusion, vomiting, or marked breathlessness requires emergency care."
    ]),
    card("Myxedema coma", ["ata-thyroid"], [
      "Support the airway and use cautious ventilation as needed because hypoventilation and carbon dioxide retention are common and sedatives can worsen them.",
      "Administer ordered thyroid hormone and glucocorticoid therapy because severe hormone deficiency and possible concurrent adrenal insufficiency threaten circulation and metabolism.",
      "Use passive rewarming and monitor temperature, rhythm, blood pressure, sodium, glucose, carbon dioxide, and mental status to detect treatment response without provoking vasodilation.",
      "Escalate immediately for worsening hypothermia, bradycardia, hypotension, hypoventilation, severe hyponatremia, hypoglycemia, or coma because intensive ventilatory and circulatory support may be needed."
    ], [
      "Hypoventilation, carbon dioxide retention, or inability to protect the airway",
      "Severe hypothermia, bradycardia, or hypotension",
      "Severe hyponatremia or hypoglycemia",
      "Progressive somnolence, stupor, or coma"
    ], [
      "Explain that thyroid replacement must be taken consistently and separated from interacting medicines or supplements as directed.",
      "Teach caregivers to seek urgent care for progressive drowsiness, cold intolerance with confusion, slow breathing, or medication interruption during illness."
    ]),
    card("Postpartum hemorrhage", ["acog-pph"], [
      "Quantify cumulative blood loss and perform frequent fundal and lochia assessment because visual estimation commonly underrecognizes rapid obstetric hemorrhage.",
      "Massage a boggy uterus and administer ordered oxytocin or other uterotonic therapy because uterine atony is common and prompt contraction can reduce bleeding.",
      "Activate the obstetric hemorrhage protocol, establish rapid access, and prepare warmed blood products because ongoing loss can cause coagulopathy, hypothermia, and shock.",
      "Escalate immediately for persistent heavy bleeding, a firm uterus with continued hemorrhage, falling blood pressure, rising pulse, confusion, or oliguria because retained tissue, trauma, inversion, or coagulopathy may require urgent procedure."
    ], [
      "Persistent heavy bleeding or rapidly increasing quantified blood loss",
      "Firm uterus with ongoing hemorrhage",
      "Hypotension, tachycardia, confusion, or oliguria",
      "Expanding hematoma, severe pelvic pain, or signs of coagulopathy"
    ], [
      "Teach that soaking pads rapidly, passing large clots, fainting, racing heart, breathlessness, or increasing weakness after birth requires emergency evaluation.",
      "Explain postpartum anemia follow-up, medication instructions, and emotional support after a hemorrhage because recovery includes both physical and psychological effects."
    ]),
    card("Ectopic pregnancy", ["acog-pph"], [
      "Assess pain, vaginal bleeding, pregnancy history, vital signs, and syncope because rupture can cause concealed intraperitoneal hemorrhage before external bleeding appears severe.",
      "Establish intravenous access, obtain ordered pregnancy testing, blood count, type and screen, and ultrasound because rapid diagnosis guides medication versus surgical management.",
      "Monitor abdominal tenderness, shoulder pain, blood pressure, pulse, hemoglobin, and mental status to detect rupture and worsening blood loss.",
      "Escalate immediately for sudden severe unilateral pain, shoulder-tip pain, syncope, peritoneal signs, hypotension, or tachycardia because ruptured ectopic pregnancy requires emergency surgical evaluation."
    ], [
      "Sudden severe unilateral abdominal or pelvic pain",
      "Shoulder-tip pain, syncope, or marked dizziness",
      "Peritoneal signs, hypotension, or tachycardia",
      "Falling hemoglobin or increasing free intraperitoneal fluid"
    ], [
      "Teach that worsening pain, faintness, shoulder pain, or heavy bleeding requires immediate emergency care even during planned laboratory follow-up.",
      "Explain the need for serial pregnancy hormone testing until resolution and discuss future pregnancy follow-up and emotional support."
    ]),
    card("Placental abruption", ["acog-pph"], [
      "Assess painful bleeding, uterine tone, tenderness, contractions, and trauma or hypertension history because much of an abruption hemorrhage may remain concealed.",
      "Initiate continuous fetal monitoring and frequent maternal vital signs because fetal hypoxia and maternal shock can deteriorate rapidly.",
      "Establish large-bore access and prepare blood products, coagulation studies, and urgent delivery resources because abruption can cause hemorrhage and disseminated intravascular coagulation.",
      "Escalate immediately for a rigid tender uterus, persistent fetal bradycardia, heavy or concealed bleeding, hypotension, or oozing from puncture sites because urgent delivery and massive-hemorrhage support may be required."
    ], [
      "Rigid tender uterus with painful frequent contractions",
      "Persistent fetal bradycardia or recurrent late decelerations",
      "Maternal hypotension despite limited visible bleeding",
      "Diffuse oozing, low fibrinogen, or other coagulopathy signs"
    ], [
      "Teach pregnant patients to seek emergency assessment for vaginal bleeding, persistent abdominal pain, reduced fetal movement, or contractions after trauma.",
      "Explain that the amount of visible blood does not reliably show the severity because bleeding can be concealed behind the placenta."
    ]),
    card("Placenta previa", ["acog-pph"], [
      "Assess painless vaginal bleeding and maternal hemodynamics while avoiding digital vaginal examination until placental location is known because examination can provoke catastrophic hemorrhage.",
      "Initiate fetal monitoring and quantify blood loss because recurrent bleeding can compromise both maternal circulation and fetal oxygenation.",
      "Establish intravenous access and prepare type and screen, blood products, and operative delivery resources as indicated because bleeding can become massive without warning.",
      "Escalate immediately for heavy recurrent bleeding, hypotension, tachycardia, persistent fetal bradycardia, contractions, or labor because emergency cesarean delivery may be necessary."
    ], [
      "Heavy painless vaginal bleeding",
      "Hypotension, tachycardia, syncope, or declining consciousness",
      "Persistent fetal bradycardia or recurrent late decelerations",
      "Bleeding accompanied by labor or ruptured membranes"
    ], [
      "Teach the patient to seek emergency care for any new bleeding, contractions, ruptured membranes, dizziness, or reduced fetal movement.",
      "Explain pelvic-rest and activity instructions individually and reinforce that no digital vaginal examination should occur outside a prepared obstetric setting."
    ]),
    card("Preeclampsia", ["acog-hypertension"], [
      "Measure blood pressure accurately and assess headache, vision, epigastric pain, breathing, reflexes, and edema because severe features reflect brain, liver, lung, kidney, or placental injury.",
      "Obtain ordered platelet, creatinine, liver, urine protein, and fetal assessments because disease severity cannot be judged by blood pressure alone.",
      "Administer prescribed antihypertensive and magnesium sulfate therapy when indicated while monitoring blood pressure, respirations, reflexes, urine output, and fetal status to detect toxicity and deterioration.",
      "Escalate immediately for persistent severe blood pressure, new neurologic symptoms, pulmonary edema, right-upper-quadrant pain, oliguria, low platelets, or nonreassuring fetal status because seizure, stroke, HELLP, or placental compromise may follow."
    ], [
      "Persistent severe-range blood pressure",
      "Severe headache, visual change, seizure, or focal deficit",
      "Pulmonary edema, hypoxemia, or right-upper-quadrant pain",
      "Oliguria, falling platelets, rising liver enzymes, or nonreassuring fetal status"
    ], [
      "Teach the patient to seek immediate care for severe headache, visual change, upper abdominal pain, breathlessness, bleeding, or reduced fetal movement.",
      "Explain that preeclampsia can first appear or worsen after birth, so blood-pressure follow-up and postpartum warning signs remain important."
    ]),
    card("Eclampsia", ["acog-hypertension"], [
      "Protect the patient from injury, position laterally, time the seizure, and maintain the airway without restraining because maternal hypoxemia and aspiration threaten both patient and fetus.",
      "Administer magnesium sulfate per the obstetric emergency protocol because it treats and helps prevent recurrent eclamptic seizures.",
      "Monitor respirations, oxygen saturation, reflexes, urine output, blood pressure, consciousness, and fetal status to detect magnesium toxicity, stroke, or placental compromise.",
      "Escalate immediately for recurrent seizure, absent reflexes, respiratory depression, oliguria, severe persistent hypertension, focal deficit, or fetal bradycardia because antidote, airway support, blood-pressure treatment, and urgent delivery planning may be required."
    ], [
      "Recurrent or prolonged seizure",
      "Absent reflexes, respiratory depression, or oliguria during magnesium therapy",
      "Persistent severe hypertension or new focal neurologic deficit",
      "Persistent fetal bradycardia after maternal stabilization"
    ], [
      "Explain to the family that the seizure results from severe hypertensive pregnancy disease and requires continued monitoring even after it stops.",
      "Teach the patient that severe headache, visual symptoms, upper abdominal pain, dyspnea, or another seizure after discharge requires emergency care."
    ]),
    card("HELLP syndrome", ["acog-hypertension"], [
      "Assess right-upper-quadrant or epigastric pain, nausea, headache, vision, bleeding, and blood pressure because HELLP may progress rapidly even when hypertension is not dramatic.",
      "Trend platelets, hemoglobin, blood smear, liver enzymes, bilirubin, creatinine, coagulation tests, and fetal status to detect hemolysis, hepatic injury, renal failure, and placental compromise.",
      "Administer prescribed magnesium sulfate and antihypertensive therapy when indicated while preparing blood products and delivery resources because definitive management often requires birth after maternal stabilization.",
      "Escalate immediately for worsening upper abdominal pain, severe hypertension, seizure, falling platelets, bleeding, jaundice, hypotension, or nonreassuring fetal status because hepatic rupture, disseminated intravascular coagulation, stroke, or abruption may occur."
    ], [
      "Worsening right-upper-quadrant or epigastric pain",
      "Rapidly falling platelets, hemolysis, or rising liver enzymes",
      "Seizure, severe hypertension, jaundice, or active bleeding",
      "Maternal hypotension or nonreassuring fetal status"
    ], [
      "Teach that severe upper abdominal pain, headache, visual change, nausea, bleeding, dyspnea, or reduced fetal movement requires immediate assessment.",
      "Explain that laboratory disease can worsen before symptoms feel severe and can continue postpartum, which is why repeat tests and follow-up matter."
    ]),
    card("Cord prolapse", ["acog-labor"], [
      "Call the obstetric emergency team and prepare immediate operative delivery because cord compression can abruptly interrupt fetal oxygen delivery.",
      "Use a gloved hand to elevate the presenting part off the cord and maintain that relief until delivery because removing pressure preserves umbilical blood flow.",
      "Position the patient knee-chest or steep head-down as directed and avoid handling an exposed cord because gravity may reduce compression while manipulation can cause vasospasm.",
      "Escalate immediately for persistent fetal bradycardia, recurrent prolonged decelerations, a palpable cord after membrane rupture, or loss of cord pulsation while monitoring fetal heart rate because definitive delivery cannot be delayed."
    ], [
      "Palpable or visible cord after rupture of membranes",
      "Persistent fetal bradycardia or prolonged deceleration",
      "Loss of cord pulsation",
      "Fetal heart-rate abnormality after sudden fluid release with a high presenting part"
    ], [
      "Explain during the emergency that the team is relieving pressure from the umbilical cord while preparing rapid delivery, which helps the patient understand the unusual position and continuous examination.",
      "After delivery, review what occurred, the newborn assessment, maternal recovery, and emotional support needs."
    ]),
    card("Shoulder dystocia", ["acog-labor"], [
      "Announce shoulder dystocia, call the obstetric and neonatal teams, and record the time because coordinated sequential maneuvers reduce delay and improve documentation.",
      "Assist with McRoberts positioning and suprapubic pressure as directed because changing pelvic geometry and shoulder orientation may release the impaction.",
      "Avoid fundal pressure and uncoordinated traction because they can worsen impaction and increase fetal or maternal injury.",
      "Escalate immediately when initial maneuvers fail or fetal condition worsens while monitoring elapsed time and maneuver sequence because advanced obstetric rescue and neonatal resuscitation may be required."
    ], [
      "Turtle sign or failure of the shoulders to deliver with usual traction",
      "Failure of initial McRoberts and suprapubic-pressure maneuvers",
      "Prolonged head-to-body delivery interval",
      "Neonatal depression, asymmetric arm movement, or maternal hemorrhage after birth"
    ], [
      "Explain after stabilization that a shoulder became lodged behind the pelvic bone and that the emergency positions and maneuvers were used to release it.",
      "Review maternal bleeding or laceration follow-up, newborn arm and breathing assessment, recurrence counseling, and emotional support."
    ]),
    card("Blood transfusion reaction", ["aabb-circular-2024"], [
      "Stop the transfusion immediately when a reaction is suspected and keep intravenous access with compatible saline tubing because continued exposure can intensify hemolysis, allergy, sepsis, or lung injury.",
      "Recheck patient and component identification at the bedside and notify the transfusion service and treating clinician because clerical mismatch must be recognized quickly.",
      "Monitor temperature, blood pressure, pulse, oxygen saturation, lung sounds, urine color, pain, and the timing of symptoms to distinguish reaction patterns and detect shock.",
      "Escalate immediately for dyspnea, hypotension, chest or back pain, fever with rigors, hemoglobinuria, wheeze, or rapidly falling oxygen saturation because severe hemolytic, septic, allergic, or pulmonary reactions require emergency treatment."
    ], [
      "Hypotension, chest or back pain, or hemoglobinuria",
      "Fever with rigors or rapidly worsening instability",
      "Wheeze, facial swelling, stridor, or anaphylaxis",
      "Acute dyspnea, pulmonary edema, or falling oxygen saturation"
    ], [
      "Teach the patient to report chills, itching, pain, breathlessness, nausea, or a sudden sense that something is wrong as soon as it begins during transfusion.",
      "Explain the documented reaction and future blood-bank precautions so the history is shared before later transfusions."
    ]),
    card("TRALI", ["aabb-circular-2024"], [
      "Stop the transfusion and notify the transfusion service immediately because transfusion-related acute lung injury can progress quickly after exposure to the implicated component.",
      "Apply oxygen and prepare ventilatory support as ordered because inflammatory pulmonary capillary leak causes severe hypoxemia without simple circulatory overload.",
      "Monitor oxygen saturation, respiratory effort, blood pressure, lung sounds, fluid balance, and chest imaging findings to distinguish TRALI from TACO and detect shock.",
      "Escalate immediately for rapidly increasing oxygen needs, bilateral pulmonary edema, hypotension, cyanosis, or respiratory fatigue within the reaction window because critical-care airway support may be required."
    ], [
      "Acute hypoxemia with bilateral pulmonary infiltrates during or soon after transfusion",
      "Rapidly increasing oxygen requirement or respiratory fatigue",
      "Hypotension, fever, or cyanosis",
      "Pulmonary edema without a clear circulatory-overload pattern"
    ], [
      "Explain that TRALI is an acute lung reaction rather than a simple allergy and that the transfusion service must document and investigate it.",
      "Teach the patient to report any recurrent breathing difficulty promptly and to share the reaction history before future transfusions."
    ]),
    card("TACO", ["aabb-circular-2024"], [
      "Stop or pause the transfusion and notify the treating clinician and transfusion service because additional volume can worsen transfusion-associated circulatory overload.",
      "Sit the patient upright, apply oxygen, and administer ordered diuretic therapy because reducing venous congestion can improve cardiogenic pulmonary edema.",
      "Monitor blood pressure, oxygen saturation, lung sounds, jugular venous pressure, urine output, fluid balance, and weight to detect worsening overload and response.",
      "Escalate immediately for severe hypertension or hypotension, frothy sputum, rapidly falling oxygen saturation, chest pain, or respiratory fatigue because noninvasive or invasive ventilatory support may be required."
    ], [
      "Acute dyspnea with hypertension and pulmonary edema during or after transfusion",
      "Frothy sputum, diffuse crackles, or rapidly falling oxygen saturation",
      "Marked jugular venous distention or positive fluid balance",
      "Chest pain, respiratory fatigue, or hemodynamic instability"
    ], [
      "Explain that TACO results from the circulation receiving volume faster than it can tolerate, which can guide slower rates or divided components later.",
      "Teach the patient to report breathlessness, chest pressure, swelling, or sudden cough immediately during future transfusions."
    ]),
    card("Disseminated intravascular coagulation", ["aabb-circular-2024", "sccm-sepsis-2026"], [
      "Treat and escalate the underlying trigger such as sepsis, trauma, abruption, or malignancy because disseminated coagulation will continue until its driver is controlled.",
      "Inspect skin, mucosa, lines, wounds, urine, stool, and mental status for bleeding or thrombosis because DIC can consume platelets and factors while also blocking organ microcirculation.",
      "Trend platelets, fibrinogen, prothrombin time, activated partial thromboplastin time, D-dimer, hemoglobin, creatinine, and urine output to detect progression and guide blood products.",
      "Escalate immediately for uncontrolled hemorrhage, new focal deficit, painful ischemic limb, oliguria, rapidly falling fibrinogen or platelets, or shock because organ-threatening bleeding and thrombosis can coexist."
    ], [
      "Uncontrolled bleeding from multiple sites",
      "Rapidly falling platelets or fibrinogen",
      "New focal neurologic deficit or ischemic limb findings",
      "Oliguria, shock, or rapidly worsening organ dysfunction"
    ], [
      "Explain that DIC is an abnormal whole-body clotting response that can cause both bleeding and small-vessel blockage, so repeated tests are necessary.",
      "Teach the patient to avoid unapproved medicines or procedures that increase bleeding and to report new bleeding, dark urine, severe headache, or limb pain immediately."
    ]),
    card("Heparin-induced thrombocytopenia", ["ash-hit"], [
      "Calculate and communicate the clinical pretest probability when platelets fall after heparin exposure because indiscriminate testing can mislabel patients while missed HIT changes urgent anticoagulant decisions.",
      "Stop all heparin sources, including flushes and coated devices, when HIT is sufficiently suspected because continued exposure drives platelet activation and new clot formation.",
      "Administer the selected non-heparin anticoagulant as ordered and monitor platelets, coagulation target, kidney and liver function, bleeding, and new thrombosis to balance efficacy and safety.",
      "Verify that heparin remains excluded from medication, flush, dialysis, and procedure orders because accidental re-exposure can reactivate thrombosis despite non-heparin anticoagulant therapy.",
      "Escalate immediately for a painful swollen limb, chest pain, sudden dyspnea, neurologic deficit, skin necrosis, rapidly falling platelets, or bleeding because HIT thrombosis can threaten life or limb."
    ], [
      "New venous or arterial thrombosis with a platelet fall",
      "Painful swollen limb, sudden dyspnea, or chest pain",
      "Focal neurologic deficit or acute limb ischemia",
      "Skin necrosis at injection sites or rapidly falling platelets"
    ], [
      "Teach the patient that HIT increases clot risk despite the low platelet count and that all future clinicians must know about the reaction.",
      "Review the non-heparin anticoagulant plan, bleeding precautions, medical-alert documentation, and symptoms of thrombosis requiring emergency care."
    ]),
    card("Tumor lysis syndrome", ["nci-oncology-emergencies"], [
      "Begin prescribed hydration and uric-acid-lowering therapy before or during high-risk cancer treatment because rapid cell breakdown can obstruct kidneys and destabilize electrolytes.",
      "Trend potassium, phosphate, calcium, uric acid, creatinine, urine output, and fluid balance at the ordered high-risk interval to detect tumor lysis before organ failure develops.",
      "Maintain continuous cardiac monitoring and assess for weakness, cramps, paresthesia, nausea, and seizure because potassium and calcium shifts can cause lethal arrhythmia or neurologic injury.",
      "Coordinate early nephrology review for worsening kidney injury or refractory electrolyte disturbance because dialysis may be needed before arrhythmia or fluid overload becomes unmanageable.",
      "Escalate immediately for rising potassium, oliguria, arrhythmia, seizure, symptomatic hypocalcemia, fluid overload, or worsening creatinine because urgent nephrology support or dialysis may be required."
    ], [
      "Rising potassium with electrocardiographic change",
      "Oliguria or rapidly worsening creatinine",
      "Seizure, tetany, or symptomatic hypocalcemia",
      "Fluid overload or laboratory abnormalities worsening despite prophylaxis"
    ], [
      "Explain that successful cancer treatment can release cell contents quickly, which is why hydration, medicines, urine measurement, and repeated blood tests are needed.",
      "Teach the patient to report reduced urine, palpitations, severe weakness, muscle cramps, tingling, confusion, or seizure immediately."
    ]),
    card("Spinal cord compression", ["nci-oncology-emergencies", "ncs-guidelines"], [
      "Treat new back pain with weakness, sensory change, or sphincter symptoms as an emergency because neurologic loss may become irreversible if compression persists.",
      "Maintain safe spinal alignment and assist all movement because an unstable vertebral lesion can worsen cord injury or pathologic fracture.",
      "Perform serial motor, sensory, reflex, gait, perineal sensation, and bladder assessments to localize progression and preserve a baseline before treatment.",
      "Prepare prescribed corticosteroid therapy and definitive radiation, surgery, or other decompression because reducing pressure before fixed paralysis develops can preserve neurologic function.",
      "Escalate immediately for new weakness, inability to walk, saddle anesthesia, urinary retention, incontinence, or rapidly increasing pain because urgent magnetic resonance imaging and specialist decompression planning are required."
    ], [
      "New or progressive limb weakness",
      "Inability to walk or rapidly changing gait",
      "Saddle anesthesia, urinary retention, or new incontinence",
      "Severe escalating back pain with a known malignancy or vertebral lesion"
    ], [
      "Teach patients with cancer or spinal disease to report new severe back pain, leg weakness, numbness, gait change, or bladder and bowel dysfunction the same day.",
      "Explain why assisted mobility and alignment precautions protect the cord until imaging confirms stability."
    ]),
    card("Superior vena cava syndrome", ["nci-cardiopulmonary-pdq"], [
      "Elevate the head of bed and assess airway, breathing, facial swelling, neck veins, and neurologic symptoms because upper-body venous obstruction can worsen laryngeal or cerebral edema.",
      "Avoid unnecessary upper-extremity intravenous lines and constrictive clothing when alternatives exist because impaired superior vena cava flow can increase swelling and poor access function.",
      "Monitor oxygen saturation, work of breathing, voice, swallowing, mental status, upper-extremity perfusion, and swelling to detect airway or cerebral compromise.",
      "Escalate immediately for stridor, rapidly increasing facial or tongue edema, syncope, confusion, severe headache, cyanosis, or hemodynamic instability because urgent airway and endovascular or cancer-directed treatment may be required."
    ], [
      "Stridor or rapidly increasing facial, tongue, or neck swelling",
      "Confusion, syncope, severe headache, or visual change",
      "Cyanosis or rapidly worsening respiratory distress",
      "Hemodynamic instability or loss of upper-extremity access function"
    ], [
      "Teach the patient to report increasing facial or arm swelling, breathlessness, hoarseness, trouble swallowing, severe headache, or fainting immediately.",
      "Explain that treatment targets the blockage and its cause, which may involve a clot, device, or mass and therefore requires imaging and specialist planning."
    ]),
    card("Cyanide poisoning", ["aha-toxicology-2023", "aha-special-2025"], [
      "Remove the patient from exposure using responder protection and decontaminate as appropriate because secondary exposure can injure rescuers and continued absorption worsens cellular hypoxia.",
      "Give high-concentration oxygen and administer ordered hydroxocobalamin without waiting for a confirmatory cyanide level when severe poisoning is suspected because cellular oxygen use is blocked despite a measurable saturation.",
      "Monitor mental status, blood pressure, rhythm, lactate, acid-base status, and response to antidote to detect persistent histotoxic hypoxia and cardiovascular collapse.",
      "Escalate immediately for smoke exposure with coma, severe lactic acidosis, hypotension, seizure, bradycardia, or cardiac arrest because toxicology consultation and full resuscitation are time-critical."
    ], [
      "Enclosed-space smoke exposure with altered consciousness",
      "Severe lactic acidosis, hypotension, or cardiovascular collapse",
      "Seizure, coma, bradycardia, or cardiac arrest",
      "Persistent instability after initial antidote therapy"
    ], [
      "Teach that suspected cyanide exposure requires emergency care and poison-center guidance even if the person initially feels better.",
      "Explain that hydroxocobalamin can discolor skin, urine, and some laboratory samples so later clinicians should be told it was given."
    ]),
    card("Digoxin toxicity", ["aha-toxicology-2023", "aha-special-2025"], [
      "Stop further digoxin and obtain the medication timing, kidney function, electrolytes, and interacting drugs because impaired clearance and potassium or magnesium abnormalities increase toxicity.",
      "Place the patient on continuous cardiac monitoring and obtain serial electrocardiograms because digoxin can produce bradyarrhythmias, conduction block, or ventricular dysrhythmias.",
      "Administer ordered digoxin-specific antibody fragments for life-threatening toxicity and monitor potassium and rhythm because reversal can rapidly shift potassium and change cardiac conduction.",
      "Escalate immediately for unstable bradycardia, ventricular arrhythmia, high-grade block, severe hyperkalemia, hypotension, syncope, or altered mental status because expert toxicology and critical-care support are required."
    ], [
      "Unstable bradycardia or high-grade atrioventricular block",
      "Ventricular arrhythmia, syncope, or hypotension",
      "Severe hyperkalemia in acute toxicity",
      "Altered mental status with significant cardiac findings"
    ], [
      "Teach the patient not to repeat a missed or vomited dose without instructions and to keep laboratory and kidney-function follow-up.",
      "Review early toxicity symptoms such as nausea, poor appetite, confusion, visual change, slow pulse, or palpitations and when to seek urgent care."
    ]),
    card("Iron overdose", ["aha-toxicology-2023"], [
      "Contact the poison center or medical toxicologist immediately and determine product, amount, formulation, and time because early symptoms may improve before shock and liver injury emerge.",
      "Establish intravenous access and administer ordered fluids and deferoxamine when indicated because severe iron toxicity causes corrosive gastrointestinal injury, metabolic acidosis, and circulatory collapse.",
      "Monitor blood pressure, mental status, glucose, acid-base status, serum iron timing, liver tests, coagulation, urine output, and gastrointestinal bleeding to detect evolving systemic toxicity.",
      "Escalate immediately for persistent vomiting, hematemesis, severe abdominal pain, metabolic acidosis, hypotension, lethargy, rising liver tests, or coagulopathy because critical care and prolonged toxicology management may be needed."
    ], [
      "Persistent vomiting, hematemesis, or severe abdominal pain",
      "Metabolic acidosis, hypotension, or lethargy",
      "Rising liver tests, hypoglycemia, or coagulopathy",
      "Apparent early improvement after a potentially large ingestion"
    ], [
      "Teach families to store iron and prenatal vitamins locked away because a small number of tablets can seriously poison a child.",
      "Explain that symptoms can briefly improve before organ injury appears, so observation and repeat tests must follow poison-center guidance."
    ]),
    card("Organophosphate poisoning", ["aha-toxicology-2023", "aha-special-2025"], [
      "Use appropriate personal protective equipment, remove contaminated clothing, and irrigate exposed skin because residue can continue absorption and secondarily poison staff.",
      "Suction secretions, support ventilation, and administer atropine as ordered until bronchial secretions and oxygenation improve because respiratory failure is driven by secretions, bronchospasm, and weakness.",
      "Administer ordered oxime therapy promptly when appropriate and monitor pupils, secretions, muscle strength, oxygen saturation, rhythm, and cholinergic recurrence to detect persistent acetylcholinesterase inhibition.",
      "Escalate immediately for copious secretions, severe bronchospasm, fasciculations with weakness, bradycardia, seizure, hypoxemia, or respiratory fatigue because repeated antidote and advanced airway support may be required."
    ], [
      "Copious bronchial secretions with hypoxemia",
      "Severe bronchospasm or respiratory muscle weakness",
      "Bradycardia, seizure, or rapidly declining consciousness",
      "Recurrent cholinergic findings after initial improvement"
    ], [
      "Teach that contaminated clothing should be handled cautiously and placed according to hazardous-material instructions because residue can expose other people.",
      "Explain that breathing weakness or recurrent secretions can occur after initial improvement, so the observation period should not be shortened without toxicology guidance."
    ]),
    card("Salicylate toxicity", ["aha-toxicology-2023", "aha-special-2025"], [
      "Contact the poison center or medical toxicologist and obtain serial salicylate levels with acid-base tests because a single early concentration may not show peak or tissue toxicity.",
      "Administer ordered intravenous sodium bicarbonate while monitoring serum potassium, blood glucose, urine pH, and blood pH because alkalinization limits salicylate entry into the brain and increases renal elimination.",
      "Assess respiratory rate, temperature, tinnitus, vomiting, mental status, pulmonary findings, glucose, and fluid balance to detect cerebral or pulmonary edema and metabolic exhaustion.",
      "Escalate immediately for confusion, seizure, pulmonary edema, severe acidemia, rising level despite therapy, renal failure, or inability to alkalinize because urgent hemodialysis may be required."
    ], [
      "Confusion, seizure, or declining consciousness",
      "Pulmonary edema or increasing oxygen requirement",
      "Severe acidemia or rising salicylate concentration despite therapy",
      "Renal failure or failure to achieve prescribed alkalinization"
    ], [
      "Teach patients to check all pain, cold, and combination products for salicylates because unintentional duplication can cause toxicity.",
      "Explain that rapid breathing, ringing in the ears, repeated vomiting, fever, or confusion after exposure requires poison-center or emergency guidance."
    ]),
    card("Tricyclic antidepressant overdose", ["aha-toxicology-2023", "aha-special-2025"], [
      "Secure the airway as needed and place the patient on continuous cardiac and seizure monitoring because sodium-channel blockade can cause abrupt ventricular dysrhythmia and coma.",
      "Obtain serial electrocardiograms and administer ordered intravenous sodium bicarbonate for QRS widening, ventricular arrhythmia, or hypotension because alkalinization reduces cardiotoxic sodium-channel blockade.",
      "Monitor QRS duration, rhythm, blood pressure, pH, sodium, potassium, temperature, consciousness, and seizure activity to detect recurrent toxicity and treatment complications.",
      "Escalate immediately for widening QRS, ventricular arrhythmia, refractory hypotension, seizure, severe agitation, coma, or cardiac arrest because toxicology-led resuscitation and advanced support are time-critical."
    ], [
      "Widening QRS or ventricular arrhythmia",
      "Refractory hypotension or cardiac arrest",
      "Seizure, coma, or rapidly declining consciousness",
      "Recurrent electrocardiographic abnormality after initial improvement"
    ], [
      "Teach families to treat any suspected tricyclic antidepressant ingestion as an emergency and contact poison services rather than waiting for symptoms.",
      "After recovery, arrange medication-safety and mental-health follow-up because overdose prevention requires attention to access and intent."
    ]),
    card("Warfarin toxicity", ["aha-special-2025"], [
      "Hold further warfarin and determine the indication, last dose, interacting medicines, diet change, illness, and bleeding history because reversal urgency depends on both hemorrhage and thrombosis risk.",
      "Obtain and trend the international normalized ratio, hemoglobin, platelets, renal and liver function, and sites of bleeding to measure severity and response.",
      "Administer ordered vitamin K and clotting-factor replacement for serious bleeding because replacement restores vitamin-K-dependent coagulation while the longer-acting reversal develops.",
      "Escalate immediately for severe headache, focal deficit, gastrointestinal bleeding, hypotension, expanding hematoma, hematuria with obstruction, or falling hemoglobin because internal hemorrhage can be life-threatening despite limited external blood."
    ], [
      "Severe headache, focal neurologic deficit, or altered consciousness",
      "Hematemesis, melena, or hemodynamic instability",
      "Expanding hematoma, compartment findings, or uncontrolled bleeding",
      "Rapidly falling hemoglobin or markedly abnormal coagulation with bleeding"
    ], [
      "Teach consistent warfarin dosing, scheduled international normalized ratio testing, medication and supplement interaction checks, and consistent rather than absent vitamin K intake.",
      "Explain that severe headache, head injury, vomiting blood, black stool, persistent bleeding, or new weakness requires immediate emergency evaluation."
    ]),
    card("Airway obstruction", ["aha-pals-2025", "aha-als-2025"], [
      "Assess whether cough and speech remain effective because complete airway obstruction requires immediate age-appropriate choking maneuvers while effective coughing should be encouraged.",
      "Call the emergency response and bring suction, oxygen, bag-mask ventilation, and advanced-airway equipment because partial obstruction can become complete without warning.",
      "Use age-appropriate back blows, chest thrusts, or abdominal thrusts as indicated and avoid blind finger sweeps because unseen material can be pushed deeper.",
      "Monitor air movement, voice, stridor, oxygen saturation, skin color, and consciousness continuously to detect worsening obstruction and hypoxemia.",
      "Escalate immediately for inability to speak or cough, silent respiratory effort, cyanosis, decreasing consciousness, or apnea because intubation or surgical airway rescue may be required."
    ], [
      "Inability to speak, cough, or move air",
      "Silent respiratory effort, cyanosis, or falling oxygen saturation",
      "Stridor with rapidly decreasing consciousness",
      "Apnea or persistent obstruction after initial maneuvers"
    ], [
      "Teach caregivers choking prevention, age-appropriate food preparation, and why a blind finger sweep can worsen obstruction.",
      "Explain that persistent cough, wheeze, voice change, or breathing difficulty after a choking episode requires medical evaluation for retained material or airway injury."
    ]),
    card("Pulmonary embolism", ["aha-special-2025"], [
      "Apply oxygen when hypoxemic and place the patient on cardiac and oxygen-saturation monitoring because pulmonary vascular obstruction can strain the right ventricle and impair gas exchange.",
      "Assess onset of dyspnea, pleuritic pain, syncope, hemoptysis, leg swelling, blood pressure, and mental status because these findings help identify pulmonary embolism severity.",
      "Administer ordered anticoagulant therapy after contraindication review because preventing clot extension reduces recurrent embolization while introducing bleeding risk.",
      "Trend oxygen need, heart rate, blood pressure, urine output, troponin, and right-heart findings to detect progression toward obstructive shock.",
      "Escalate immediately for hypotension, syncope, rising oxygen requirement, chest pain with shock, new arrhythmia, or bleeding during anticoagulation because reperfusion or hemorrhage management may be urgent."
    ], [
      "Hypotension, syncope, or signs of obstructive shock",
      "Rapidly rising oxygen requirement or severe respiratory distress",
      "New right-heart strain or ventricular arrhythmia",
      "Major bleeding during anticoagulant or reperfusion therapy"
    ], [
      "Teach anticoagulant adherence, bleeding precautions, interaction review, and the importance of planned follow-up.",
      "Tell the patient to seek emergency care for recurrent sudden dyspnea, syncope, chest pain, coughing blood, or uncontrolled bleeding."
    ]),
    card("Cardiac tamponade", ["aha-special-2025"], [
      "Apply oxygen, establish vascular access, and activate the emergency cardiac team because pericardial pressure can abruptly reduce ventricular filling and cardiac output.",
      "Assess blood pressure, pulse pressure, jugular venous distention, heart sounds, pulsus paradoxus, and mental status because tamponade physiology may progress before classic findings are complete.",
      "Monitor rhythm, oxygen saturation, urine output, lactate, extremity perfusion, and bedside echocardiographic findings to detect worsening obstructive shock.",
      "Prepare pericardiocentesis or surgical drainage equipment and specimens because definitive treatment requires removing the compressive pericardial fluid.",
      "Escalate immediately for refractory hypotension, pulseless electrical activity, rapidly rising venous pressure, oliguria, or declining consciousness because drainage and resuscitation cannot be delayed."
    ], [
      "Refractory hypotension with jugular venous distention",
      "Pulseless electrical activity or abrupt cardiovascular collapse",
      "Rapidly decreasing urine output or worsening lactate",
      "Declining consciousness with echocardiographic tamponade findings"
    ], [
      "Explain that tamponade is pressure around the heart that prevents normal filling, which is why drainage may be urgently necessary.",
      "After drainage, teach the patient to report recurrent dyspnea, chest pressure, fainting, fever, or rapidly increasing weakness."
    ]),
    card("Abdominal aortic aneurysm", ["acc-aortic-2022"], [
      "Avoid deep palpation of a suspected pulsatile abdominal mass because pressure adds no diagnostic value and may worsen pain or instability.",
      "Assess abrupt abdominal, flank, or back pain with blood pressure, pulses, skin perfusion, and mental status because rupture may cause concealed hemorrhagic shock.",
      "Establish large-bore access and prepare type and crossmatch, blood products, and urgent vascular repair because definitive hemorrhage control is procedural.",
      "Monitor blood pressure, heart rate, hemoglobin, lactate, urine output, distal pulses, and abdominal findings to detect continued bleeding or branch-vessel compromise.",
      "Escalate immediately for sudden severe pain, syncope, hypotension, expanding abdomen, falling hemoglobin, or loss of distal pulses because rupture or acute thrombosis is life-threatening."
    ], [
      "Sudden severe abdominal, flank, or back pain",
      "Syncope, hypotension, or rapidly falling hemoglobin",
      "Expanding tender abdomen or new pulsatile mass symptoms",
      "Loss of distal pulses, oliguria, or other branch-vessel ischemia"
    ], [
      "Teach adherence to surveillance imaging, blood-pressure treatment, and smoking cessation because aneurysm growth may be silent.",
      "Tell the patient to call emergency services for sudden severe abdominal or back pain, fainting, weakness, or a cold painful leg."
    ]),
    card("Autonomic dysreflexia", ["ncs-guidelines"], [
      "Sit the patient upright and loosen restrictive clothing immediately because lowering the legs and removing compression can reduce dangerously high blood pressure.",
      "Check bladder drainage first for a kinked catheter, obstruction, or distention because bladder irritation is the most common autonomic dysreflexia trigger.",
      "Assess bowel impaction, skin pressure, wounds, devices, and other noxious stimuli when the bladder is clear because the hypertensive reflex persists until its trigger is removed.",
      "Monitor blood pressure every few minutes with pulse, headache, sweating, flushing, and neurologic status to confirm resolution and detect stroke risk.",
      "Escalate immediately for persistent severe hypertension, chest pain, seizure, focal deficit, bradycardia, or failure to find the trigger because rapid-acting antihypertensive therapy and expert evaluation may be required."
    ], [
      "Persistent severe hypertension after bladder and clothing checks",
      "Severe headache, seizure, or focal neurologic deficit",
      "Chest pain, marked bradycardia, or arrhythmia",
      "Recurrent symptoms without an identifiable trigger"
    ], [
      "Teach patients with spinal injury to carry an autonomic dysreflexia action plan and identify their usual bladder, bowel, and skin triggers.",
      "Explain that pounding headache, sweating above the injury, flushing, goosebumps, or sudden hypertension requires immediate upright positioning and trigger assessment."
    ]),
    card("Cauda equina syndrome", ["ncs-guidelines"], [
      "Ask directly about urinary retention, loss of bladder sensation, saddle numbness, bowel accidents, sexual dysfunction, and bilateral leg symptoms because patients may not volunteer these decisive findings.",
      "Perform and document serial lower-extremity motor, sensory, reflex, perineal, rectal-tone, and bladder assessments because progression affects decompression urgency.",
      "Measure post-void residual and monitor urine output without allowing bladder testing to delay magnetic resonance imaging because retention may be the earliest sacral-root sign.",
      "Maintain safe mobility, intravenous access, and nothing-by-mouth status when surgery is likely because urgent decompression may be needed to preserve function.",
      "Escalate immediately for new urinary retention, saddle anesthesia, bilateral weakness, fecal incontinence, or rapidly worsening back pain because delayed decompression risks permanent paralysis and sphincter loss."
    ], [
      "New urinary retention or loss of bladder sensation",
      "Saddle anesthesia or reduced rectal tone",
      "Bilateral leg weakness or rapidly worsening neurologic deficit",
      "Fecal incontinence with severe back or radicular pain"
    ], [
      "Teach patients with back pain that new bladder difficulty, saddle numbness, bowel incontinence, or weakness in both legs requires emergency evaluation.",
      "Explain that cauda equina symptoms are different from routine sciatica because compressed sacral nerves can lose function permanently."
    ]),
    card("Uterine atony", ["acog-pph"], [
      "Massage a boggy fundus and assess bladder distention because uterine contraction compresses placental vessels while a full bladder can displace the uterus.",
      "Administer ordered oxytocin and other appropriate uterotonic therapy after contraindication review because sustained myometrial contraction reduces atony bleeding.",
      "Quantify cumulative blood loss and monitor fundal tone, lochia, blood pressure, pulse, mental status, and urine output to detect hemorrhagic shock early.",
      "Establish rapid vascular access and prepare warmed blood products and the obstetric hemorrhage cart because continued atony can cause coagulopathy and cardiovascular collapse.",
      "Escalate immediately when heavy bleeding continues despite a firming uterus, hypotension develops, or the fundus cannot be located because trauma, retained tissue, inversion, or procedural control must be addressed."
    ], [
      "Persistent heavy bleeding despite fundal massage and uterotonic therapy",
      "Hypotension, tachycardia, confusion, or oliguria",
      "Fundus that remains boggy or cannot be located",
      "Firm uterus with continued hemorrhage or expanding hematoma"
    ], [
      "Teach postpartum patients to report rapidly soaked pads, large clots, faintness, racing heart, breathlessness, or increasing weakness immediately.",
      "Explain that a soft uterus does not clamp placental blood vessels effectively, which is why massage, medicines, and repeated assessment are used."
    ]),
    card("Benzodiazepine overdose", ["aha-toxicology-2023", "aha-special-2025"], [
      "Position the airway, suction secretions, and support bag-mask ventilation as needed because respiratory depression and aspiration are the immediate lethal risks.",
      "Check glucose, oxygen saturation, ventilation, temperature, and coingestion history because isolated benzodiazepine sedation can resemble opioid, metabolic, or mixed overdose.",
      "Monitor consciousness, respiratory rate, end-tidal carbon dioxide, blood pressure, and airway reflexes until sedation resolves to detect delayed hypoventilation.",
      "Avoid reflexive flumazenil administration and clarify chronic benzodiazepine use, seizure disorder, and proconvulsant coingestions because reversal can precipitate seizure or withdrawal.",
      "Escalate immediately for apnea, rising carbon dioxide, recurrent aspiration, hypotension, seizure, or failure to awaken as expected because intubation and toxicology consultation may be required."
    ], [
      "Apnea, rising carbon dioxide, or inability to protect the airway",
      "Recurrent aspiration or rapidly falling oxygen saturation",
      "Seizure after mixed overdose or reversal exposure",
      "Persistent coma or hypotension inconsistent with isolated sedation"
    ], [
      "Teach patients never to combine benzodiazepines with alcohol, opioids, or other sedatives unless specifically directed because respiratory effects can add together.",
      "After intentional overdose, coordinate medication-access review, suicide-risk assessment, and mental-health follow-up before discharge."
    ]),
    card("Acute decompensated heart failure", ["acc-heart-failure-2022"], [
      "Position the patient upright and apply oxygen when hypoxemic because reducing venous return and correcting hypoxemia can ease pulmonary congestion.",
      "Assess lung sounds, jugular venous pressure, edema, weight change, perfusion, chest pain, and medication adherence because congestion and trigger identification guide treatment.",
      "Administer ordered intravenous diuretic therapy and measure urine response because inadequate decongestion prolongs pulmonary and systemic venous pressure.",
      "Monitor oxygen saturation, blood pressure, rhythm, potassium, magnesium, creatinine, intake, output, and daily weights to detect arrhythmia, kidney injury, and treatment response.",
      "Escalate immediately for pink frothy sputum, refractory hypoxemia, hypotension, new ischemic pain, arrhythmia, oliguria, or confusion because cardiogenic shock or ventilatory failure may be developing."
    ], [
      "Pink frothy sputum or rapidly worsening pulmonary edema",
      "Refractory hypoxemia or respiratory fatigue",
      "Hypotension, oliguria, or declining mental status",
      "New ischemic chest pain or ventricular arrhythmia"
    ], [
      "Teach daily weight, symptom tracking, medication adherence, and individualized sodium and fluid guidance because congestion often appears before severe breathlessness.",
      "Review the exact weight gain, swelling, orthopnea, or activity decline thresholds for contacting the heart-failure team."
    ]),
    card("Acute limb ischemia", ["acc-pad-2024"], [
      "Assess and document pain, pallor, pulses, paresthesia, paralysis, temperature, and capillary refill because neurologic loss indicates a limb that may soon be irreversible.",
      "Keep the affected limb neutral or dependent, protected, and free of compression because elevation, cold, heat, or massage can further reduce arterial flow or injure numb tissue.",
      "Administer ordered anticoagulant therapy and prepare vascular imaging because preventing thrombus propagation buys time for definitive revascularization.",
      "Perform frequent bilateral neurovascular checks and monitor rhythm and bleeding to detect embolic progression, reperfusion change, and anticoagulant complications.",
      "Escalate immediately for new paralysis, absent sensation, worsening rest pain, mottling, loss of Doppler signal, or compartment swelling because urgent thrombectomy or other revascularization is time-critical."
    ], [
      "New paralysis or profound sensory loss",
      "Absent Doppler signal or rapidly worsening mottling",
      "Severe rest pain with a cold pale limb",
      "Tense swelling or pain after reperfusion"
    ], [
      "Teach the patient to seek emergency care for sudden limb pain, coldness, color change, numbness, or weakness.",
      "Explain smoking cessation, antiplatelet or anticoagulant adherence, foot protection, and vascular follow-up after revascularization."
    ]),
    card("Aortic stenosis", ["acc-heart-failure-2022"], [
      "Ask specifically about exertional chest pain, syncope, and dyspnea because symptoms in severe aortic stenosis signal limited cardiac reserve and change intervention urgency.",
      "Maintain cautious preload and avoid abrupt unplanned vasodilation because a fixed valve obstruction limits the ability to increase cardiac output when pressure falls.",
      "Monitor blood pressure, rhythm, perfusion, lung sounds, activity tolerance, and signs of heart failure to detect decompensation.",
      "Coordinate echocardiography and valve-team evaluation because definitive treatment of symptomatic severe aortic stenosis is mechanical rather than purely medical.",
      "Escalate immediately for exertional syncope, ischemic chest pain, acute pulmonary edema, hypotension, or new arrhythmia because sudden hemodynamic collapse can occur."
    ], [
      "Exertional syncope or presyncope",
      "Ischemic chest pain or acute pulmonary edema",
      "Hypotension with poor peripheral perfusion",
      "New atrial or ventricular arrhythmia"
    ], [
      "Teach patients to report new exertional faintness, chest pressure, breathlessness, or declining activity tolerance rather than simply reducing activity.",
      "Explain the need for scheduled echocardiography and valve follow-up because severity can progress even when symptoms are gradual."
    ]),
    card("Dilated cardiomyopathy", ["acc-heart-failure-2022"], [
      "Assess dyspnea, orthopnea, edema, weight, perfusion, chest pain, alcohol or toxin exposure, infection history, and family history because dilated cardiomyopathy has multiple treatable causes.",
      "Administer ordered heart-failure therapy and diuretic treatment while checking blood pressure and kidney function because lowering congestion and remodeling stress can improve output.",
      "Monitor rhythm, oxygen saturation, potassium, magnesium, creatinine, urine output, and daily weight to detect ventricular arrhythmia and decompensation.",
      "Balance activity with rest during acute symptoms and advance rehabilitation as tolerated because excessive demand worsens low-output symptoms while prolonged immobility causes additional harm.",
      "Prepare prescribed inotrope, vasopressor, or mechanical circulatory support when perfusion remains poor because advanced dilated cardiomyopathy may not maintain organ blood flow with routine therapy.",
      "Escalate immediately for syncope, sustained palpitations, new chest pain, pulmonary edema, hypotension, oliguria, or rapidly increasing weight because malignant arrhythmia or cardiogenic shock may be developing."
    ], [
      "Syncope or sustained ventricular arrhythmia",
      "Rapidly worsening pulmonary edema",
      "Hypotension, oliguria, or cool mottled extremities",
      "New embolic neurologic deficit or acute limb symptoms"
    ], [
      "Teach daily weight and symptom monitoring, medication adherence, alcohol or toxin avoidance when relevant, and family screening when a genetic cause is possible.",
      "Review emergency symptoms including fainting, sustained palpitations, chest pain, severe dyspnea, and sudden neurologic change."
    ]),
    card("Hypertrophic cardiomyopathy", ["acc-heart-failure-2022"], [
      "Assess exertional syncope, chest pain, dyspnea, palpitations, hydration, and family history because dynamic outflow obstruction and ventricular arrhythmia can cause sudden collapse.",
      "Maintain hydration within the prescribed plan and review orders that sharply reduce preload or afterload because a smaller ventricular cavity can worsen obstruction.",
      "Administer ordered rate-controlling therapy while monitoring heart rate and blood pressure because slower filling may reduce symptoms but excessive bradycardia or hypotension is harmful.",
      "Monitor rhythm, perfusion, activity symptoms, and implanted-defibrillator events to detect atrial fibrillation or ventricular tachyarrhythmia.",
      "Escalate immediately for exertional syncope, sustained ventricular arrhythmia, ischemic pain, hypotension, acute heart failure, or a defibrillator shock because sudden-death risk requires expert evaluation."
    ], [
      "Exertional syncope or near-syncope",
      "Sustained ventricular arrhythmia or implanted-defibrillator shock",
      "Hypotension with worsening outflow-obstruction symptoms",
      "Acute pulmonary edema or ischemic chest pain"
    ], [
      "Teach individualized activity and hydration guidance and the importance of family screening because hypertrophic cardiomyopathy may be inherited.",
      "Tell the patient to seek urgent care for fainting, sustained palpitations, chest pain, severe dyspnea, or a device shock."
    ]),
    card("Long QT syndrome", ["aha-als-2025"], [
      "Place the patient on continuous cardiac monitoring and measure the corrected QT interval because prolonged repolarization can deteriorate into torsades de pointes.",
      "Review all prescription, over-the-counter, and interacting drugs and hold newly suspected QT-prolonging agents as directed because combined effects increase arrhythmia risk.",
      "Check and correct ordered potassium, magnesium, and calcium abnormalities because electrolyte depletion further delays ventricular repolarization.",
      "Maintain defibrillation readiness and administer ordered magnesium for torsades because polymorphic ventricular tachycardia can become pulseless rapidly.",
      "Escalate immediately for syncope, recurrent palpitations, runs of polymorphic ventricular tachycardia, seizure-like collapse, or family history of sudden death because urgent electrophysiology evaluation is required."
    ], [
      "Syncope or seizure-like collapse during exertion or startle",
      "Runs of polymorphic ventricular tachycardia",
      "Markedly prolonged corrected QT with ventricular ectopy",
      "Family history of unexplained sudden cardiac death"
    ], [
      "Teach the patient to check new medicines for QT risk and to follow individualized exercise, fever, electrolyte, and device guidance.",
      "Explain that fainting or seizure-like activity may be an arrhythmia and warrants urgent evaluation rather than assuming a neurologic cause."
    ]),
    card("Myocarditis", ["acc-heart-failure-2022"], [
      "Assess recent infection or immune exposure with chest pain, dyspnea, palpitations, syncope, and exercise intolerance because myocarditis can mimic infarction or progress to pump failure.",
      "Obtain and trend electrocardiograms, troponin, inflammatory markers, echocardiographic function, and perfusion findings because injury severity can change rapidly.",
      "Limit strenuous activity and administer ordered heart-failure or arrhythmia therapy because exertion during active myocardial inflammation may increase instability.",
      "Monitor rhythm, blood pressure, oxygen saturation, urine output, lactate, and pulmonary congestion to detect ventricular arrhythmia and cardiogenic shock.",
      "Escalate immediately for ventricular arrhythmia, high-grade block, syncope, rapidly worsening heart failure, hypotension, or rising lactate because mechanical circulatory support may be needed."
    ], [
      "Ventricular arrhythmia or high-grade conduction block",
      "Syncope or rapidly worsening exercise intolerance",
      "Acute pulmonary edema or severe ventricular dysfunction",
      "Hypotension, oliguria, or rising lactate"
    ], [
      "Teach avoidance of strenuous exercise until the cardiology team confirms recovery because symptoms may improve before inflammation resolves.",
      "Explain that recurrent chest pain, fainting, palpitations, breathlessness, or swelling requires prompt reassessment."
    ]),
    card("Torsades de pointes", ["aha-als-2025"], [
      "Check for a pulse and hemodynamic instability immediately because torsades de pointes may produce transient perfusion or deteriorate into cardiac arrest.",
      "Administer ordered intravenous magnesium and correct potassium, calcium, and magnesium abnormalities because delayed repolarization sustains the polymorphic ventricular rhythm.",
      "Stop suspected QT-prolonging medicines and review interactions because continued drug effect can cause recurrent torsades after conversion.",
      "Prepare synchronized or unsynchronized defibrillation according to pulse and stability because shock is time-critical when torsades causes severe compromise or arrest.",
      "Escalate immediately for syncope, hypotension, seizure-like activity, loss of pulse, recurrent runs, or severe bradycardia because pacing or expert electrophysiology support may be required."
    ], [
      "Loss of pulse or unresponsiveness",
      "Hypotension, syncope, or seizure-like collapse",
      "Recurrent polymorphic ventricular tachycardia",
      "Severe bradycardia with a markedly prolonged corrected QT"
    ], [
      "Teach patients to review all new medicines for QT risk and maintain prescribed potassium and magnesium follow-up.",
      "Explain that fainting or seizure-like collapse with long QT may be cardiac and requires emergency evaluation."
    ]),
    card("Wolff-Parkinson-White syndrome", ["aha-als-2025"], [
      "Obtain a 12-lead electrocardiogram during symptoms and monitor rhythm continuously because pre-excitation changes the safe treatment of rapid atrial rhythms.",
      "Assess blood pressure, consciousness, chest pain, heart failure, and pulse regularity because unstable pre-excited tachycardia requires immediate electrical treatment.",
      "Prepare synchronized cardioversion for hemodynamic instability because rapid accessory-pathway conduction can sharply reduce cardiac output.",
      "Clarify orders for atrioventricular-nodal blocking medication when an irregular wide-complex pre-excited rhythm is suspected because blocking the normal pathway can accelerate accessory conduction.",
      "Escalate immediately for syncope, hypotension, ischemic pain, pulmonary edema, or an irregular very rapid wide-complex rhythm because ventricular fibrillation may follow."
    ], [
      "Irregular very rapid wide-complex tachycardia",
      "Syncope, hypotension, or altered consciousness",
      "Ischemic chest pain or acute pulmonary edema",
      "Progression to ventricular tachycardia or fibrillation"
    ], [
      "Teach the patient to record palpitation timing and seek emergency care when tachycardia causes fainting, chest pain, or severe breathlessness.",
      "Explain the value of electrophysiology follow-up because catheter ablation may remove the accessory pathway rather than merely suppress symptoms."
    ]),
    card("Cholangitis", ["sccm-sepsis-2026"], [
      "Obtain ordered blood cultures and administer broad antibiotic therapy promptly because an obstructed infected biliary system can progress rapidly to sepsis.",
      "Assess fever, jaundice, right-upper-quadrant pain, hypotension, and mental status because shock or confusion signals severe ascending cholangitis.",
      "Monitor bilirubin, liver enzymes, white blood cell count, lactate, blood pressure, urine output, and pain to detect worsening obstruction and organ dysfunction.",
      "Maintain intravenous fluids and nothing-by-mouth status as ordered because urgent endoscopic or percutaneous biliary drainage may require sedation or intervention.",
      "Escalate immediately for hypotension, confusion, rising lactate, oliguria, persistent fever, or worsening jaundice because antibiotics alone may fail without emergency source control."
    ], [
      "Hypotension or altered mental status with jaundice and fever",
      "Rising lactate or decreasing urine output",
      "Persistent fever despite antibiotic therapy",
      "Worsening jaundice or severe right-upper-quadrant pain"
    ], [
      "Teach the patient that fever, jaundice, chills, confusion, or worsening upper abdominal pain with gallstone or stent disease requires emergency care.",
      "Explain that opening the blocked bile duct may be necessary because antibiotic therapy cannot reliably sterilize an obstructed system."
    ]),
    card("Liver failure", ["aasld-ascites-sbp"], [
      "Perform frequent neurologic checks and assess asterixis because rising ammonia and cerebral edema can progress from subtle confusion to coma.",
      "Monitor glucose, international normalized ratio, bilirubin, liver enzymes, lactate, creatinine, sodium, potassium, and urine output to detect metabolic and multiorgan failure.",
      "Use bleeding precautions and aspiration precautions, and avoid unnecessary invasive procedures, because impaired synthesis and encephalopathy increase hemorrhage and airway risk.",
      "Administer ordered dextrose for hypoglycemia, lactulose for hepatic encephalopathy, antimicrobials for suspected infection, and an etiology-specific antidote such as acetylcysteine when indicated because liver failure requires simultaneous correction of its cause and immediate complications.",
      "Escalate immediately for rapidly declining consciousness, severe hypoglycemia, active bleeding, rising lactate, oliguria, seizure, or worsening acidosis; activate rapid response, protect the airway, and prepare ordered blood products when major bleeding is present because liver failure can deteriorate into shock, cerebral edema, and multiorgan failure while intensive-care and transplant-center consultation may be urgent."
    ], [
      "Rapidly declining consciousness or new seizure",
      "Severe hypoglycemia or worsening metabolic acidosis",
      "Active bleeding with worsening coagulation findings",
      "Rising lactate, oliguria, or another failing organ"
    ], [
      "Teach patients to avoid unapproved medicines, supplements, alcohol, and acetaminophen-containing combinations because impaired liver clearance changes toxicity risk.",
      "Explain that confusion, unusual sleepiness, vomiting blood, black stool, jaundice, or decreasing urine requires urgent evaluation."
    ]),
    card("Portal hypertension", ["aasld-ascites-sbp"], [
      "Assess for hematemesis, melena, abdominal distention, edema, splenomegaly, and confusion because portal hypertension causes variceal bleeding, ascites, and encephalopathy.",
      "Monitor blood pressure, pulse, hemoglobin, platelets, international normalized ratio, sodium, creatinine, weight, abdominal girth, and mental status to detect decompensation.",
      "Administer ordered vasoactive, diuretic, lactulose, antibiotic, or beta-blocking therapy according to the complication because each treats a different consequence of portal pressure.",
      "Use bleeding precautions and prepare endoscopy and blood products for suspected variceal hemorrhage because rapid control is needed to prevent shock and aspiration.",
      "Escalate immediately for vomiting blood, black stool with hypotension, increasing confusion, fever with ascites, respiratory compromise, or oliguria because hemorrhage, spontaneous bacterial peritonitis, or hepatorenal syndrome may be developing."
    ], [
      "Hematemesis or melena with hypotension",
      "New confusion, asterixis, or decreasing consciousness",
      "Fever or abdominal tenderness with ascites",
      "Rapidly increasing ascites, dyspnea, or oliguria"
    ], [
      "Teach avoidance of alcohol and unapproved medicines, individualized sodium guidance, daily weight, and adherence to portal-hypertension therapy.",
      "Tell the patient to seek emergency care for vomiting blood, black stool, confusion, fever with abdominal swelling, or sharply reduced urine."
    ]),
    card("Small bowel obstruction", ["aasld-ascites-sbp"], [
      "Keep the patient nothing by mouth and establish intravenous access because vomiting and third spacing cause dehydration while oral intake increases distention.",
      "Insert and maintain ordered nasogastric decompression while measuring output because removing accumulated fluid and gas can reduce vomiting and aspiration risk.",
      "Assess pain pattern, distention, bowel sounds, vomiting, prior surgery, and hernia sites because strangulation may initially resemble uncomplicated obstruction.",
      "Monitor fluid balance, urine output, sodium, potassium, lactate, abdominal tenderness, and nasogastric output to detect ischemia and replacement needs.",
      "Escalate immediately for continuous severe pain, guarding, fever, tachycardia, rising lactate, bloody stool, or shock because strangulation or perforation requires urgent surgery."
    ], [
      "Continuous severe pain rather than intermittent cramping",
      "Guarding, rebound tenderness, or rigid abdomen",
      "Fever, tachycardia, rising lactate, or shock",
      "Bloody stool or abrupt clinical deterioration"
    ], [
      "Teach the patient not to take laxatives or eat through a suspected obstruction unless specifically directed because pressure and vomiting may worsen.",
      "Explain the role of bowel rest, decompression, fluid replacement, and the warning findings that make surgery urgent."
    ]),
    card("Large bowel obstruction", ["aasld-ascites-sbp"], [
      "Keep the patient nothing by mouth and establish intravenous access because progressive colonic distention can cause dehydration, ischemia, and perforation.",
      "Assess abdominal distention, pain, stool and flatus passage, vomiting, rectal bleeding, and cancer or volvulus history because the cause determines decompression or surgery.",
      "Avoid routine laxatives, enemas, or bowel preparation until obstruction and perforation are excluded because added volume or pressure can worsen dilation.",
      "Monitor abdominal girth, tenderness, bowel sounds, urine output, electrolytes, white blood cell count, lactate, and imaging progression to detect ischemia.",
      "Escalate immediately for peritoneal signs, fever, tachycardia, rapidly increasing distention, rising lactate, shock, or free air because perforation or strangulation requires emergency intervention."
    ], [
      "Peritoneal signs or free intraperitoneal air",
      "Rapidly increasing abdominal distention",
      "Fever, tachycardia, rising lactate, or shock",
      "Severe continuous pain or new rectal bleeding"
    ], [
      "Teach the patient to seek care for progressive distention, vomiting, severe pain, or inability to pass both stool and gas.",
      "Explain why laxatives or bowel preparations should not be self-started when a mechanical obstruction is possible."
    ]),
    card("Spontaneous bacterial peritonitis", ["aasld-ascites-sbp", "sccm-sepsis-2026"], [
      "Obtain ordered diagnostic ascitic fluid and blood cultures promptly without delaying antibiotic therapy in an unstable patient because spontaneous bacterial peritonitis may present subtly.",
      "Administer prescribed antibiotic and albumin therapy when indicated because infection and circulatory dysfunction can precipitate kidney failure and shock.",
      "Assess fever, abdominal pain, tenderness, confusion, blood pressure, and gastrointestinal bleeding because any decompensation in cirrhosis may signal peritoneal infection.",
      "Monitor neutrophil response in ascitic fluid when repeated, lactate, creatinine, sodium, urine output, mental status, and hemodynamics to detect treatment failure.",
      "Escalate immediately for hypotension, rising lactate, oliguria, worsening encephalopathy, persistent fever, or increasing abdominal pain because septic shock or secondary peritonitis must be considered."
    ], [
      "Hypotension, rising lactate, or decreasing urine output",
      "Worsening confusion or decreasing consciousness",
      "Persistent fever or abdominal tenderness despite antibiotics",
      "Findings suggesting perforation or secondary peritonitis"
    ], [
      "Teach patients with ascites to report fever, new abdominal pain, confusion, vomiting, black stool, or reduced urine immediately.",
      "Explain prescribed prophylactic antibiotics and follow-up after an episode because recurrence risk can remain high."
    ]),
    card("Toxic megacolon", ["idsa-cdiff"], [
      "Stop nonessential antimotility and bowel-slowing medicines as directed because suppressing motility can worsen colonic dilation and toxin retention.",
      "Keep the patient nothing by mouth, establish intravenous access, and begin ordered antibiotic and fluid therapy because fulminant colitis causes systemic toxicity and volume loss.",
      "Measure abdominal girth and assess distention, tenderness, bowel sounds, stool output, fever, and mental status frequently to detect progression toward perforation.",
      "Monitor white blood cell count, hemoglobin, electrolytes, lactate, creatinine, vital signs, and serial abdominal imaging because worsening dilation and organ dysfunction guide surgery timing.",
      "Escalate immediately for peritoneal signs, increasing dilation, shock, rising lactate, severe leukocytosis, or free air because urgent surgical colectomy evaluation may be lifesaving."
    ], [
      "Peritoneal signs or free intraperitoneal air",
      "Increasing colonic dilation or rapidly worsening distention",
      "Shock, rising lactate, or worsening organ dysfunction",
      "Severe leukocytosis with declining clinical status"
    ], [
      "Teach the patient not to self-treat severe infectious diarrhea with antimotility medicine without clinician advice.",
      "Explain that increasing distention, severe pain, fever, faintness, or decreasing stool during severe colitis can signal dangerous loss of bowel movement."
    ]),
    card("C. difficile infection", ["idsa-cdiff"], [
      "Initiate contact precautions and use soap-and-water hand hygiene after care because spores persist in the environment and resist routine alcohol hand rub.",
      "Administer the prescribed C. difficile antibiotic and avoid unnecessary systemic antibiotics and acid suppression because microbiome disruption promotes persistence and recurrence.",
      "Measure stool frequency and character and assess abdominal pain, distention, hydration, fever, and medication exposure because severity can change rapidly.",
      "Monitor white blood cell count, creatinine, electrolytes, urine output, lactate, and abdominal findings to detect dehydration, acute kidney injury, or fulminant colitis.",
      "Escalate immediately for hypotension, ileus, toxic megacolon, peritoneal signs, rising lactate, severe leukocytosis, or worsening kidney injury because surgical and critical-care evaluation may be needed."
    ], [
      "Hypotension, ileus, or toxic megacolon",
      "Peritoneal signs or rapidly increasing distention",
      "Rising lactate or severe leukocytosis",
      "Worsening kidney injury or markedly decreasing urine output"
    ], [
      "Teach soap-and-water handwashing, bathroom and high-touch surface cleaning, and completion of the prescribed antibiotic course.",
      "Explain that recurrent watery diarrhea, fever, severe pain, distention, or faintness after treatment requires prompt reassessment."
    ]),
    card("Opportunistic infection", ["sccm-sepsis-2026"], [
      "Identify the immune deficit, prophylactic medicines, recent exposures, transplant status, and current immunosuppression because likely pathogens and urgency differ from routine infection.",
      "Obtain ordered cultures and site-specific specimens promptly and administer prescribed broad or targeted antimicrobial therapy because fever and inflammation may be muted.",
      "Use the indicated protective and transmission precautions because an immunocompromised patient may both acquire and spread clinically important organisms.",
      "Monitor temperature trends, oxygen need, blood pressure, mental status, neutrophils, kidney and liver function, lactate, and infection-site findings to detect subtle sepsis.",
      "Escalate immediately for any fever with severe neutropenia, new hypoxemia, hypotension, confusion, focal neurologic change, or rapidly progressive rash because opportunistic infection can disseminate quickly."
    ], [
      "Fever with severe neutropenia or profound cellular immune deficiency",
      "New hypoxemia or rapidly progressive pulmonary infiltrates",
      "Hypotension, rising lactate, or altered mental status",
      "Focal neurologic deficit or rapidly progressive disseminated rash"
    ], [
      "Teach individualized food, exposure, mask, vaccine, and prophylactic-medication guidance from the transplant or immunology team.",
      "Explain that fever may be absent, so new cough, diarrhea, rash, confusion, pain, or unusual fatigue should be reported promptly."
    ]),
    card("Hyperacute rejection", ["sccm-sepsis-2026"], [
      "Notify the transplant team immediately when a new graft loses function within minutes to hours because antibody-mediated vascular injury can rapidly destroy the organ.",
      "Monitor graft-specific perfusion and output, including urine for a kidney graft or hemodynamics for a heart graft, to detect abrupt thrombosis and ischemia.",
      "Trend blood pressure, lactate, creatinine, liver tests, oxygenation, coagulation, and urine output according to the transplanted organ because systemic instability may accompany graft failure.",
      "Maintain vascular access and prepare imaging, biopsy, plasmapheresis, blood products, or urgent graft removal as directed because definitive rescue is transplant-team dependent.",
      "Escalate immediately for absent graft perfusion, anuria, severe acidosis, rising lactate, refractory hypotension, or new coagulopathy because hyperacute rejection can become a surgical emergency."
    ], [
      "Abrupt absence of graft perfusion or function",
      "Anuria or rapidly worsening organ-specific laboratory findings",
      "Severe acidosis, rising lactate, or refractory hypotension",
      "New thrombosis or disseminated coagulation findings"
    ], [
      "Explain that hyperacute rejection is an immediate immune attack on graft blood vessels and is not caused by something the patient did after surgery.",
      "Review the transplant team plan, possible procedures, and emotional support needs using clear, direct language."
    ]),
    card("Transplant rejection", ["sccm-sepsis-2026"], [
      "Assess medication adherence, recent dose changes, vomiting, interactions, infection, and graft-specific symptoms because low immunosuppressant exposure and immune activation can precipitate rejection.",
      "Obtain ordered drug levels, organ-function tests, imaging, and biopsy specimens because rejection cannot be reliably distinguished from infection or toxicity by symptoms alone.",
      "Administer prescribed immunosuppressive therapy on schedule while using infection precautions because missed doses worsen rejection and intensified therapy increases infection risk.",
      "Monitor temperature, blood pressure, graft function, fluid balance, glucose, blood counts, kidney and liver function, and treatment toxicity to detect response and complications.",
      "Escalate immediately for rapidly declining graft function, severe dyspnea, arrhythmia, oliguria, jaundice, fever with instability, or new neurologic change because urgent transplant-team treatment is required."
    ], [
      "Rapidly declining graft-specific function",
      "Severe dyspnea, arrhythmia, or hemodynamic instability",
      "Oliguria, jaundice, or rapidly worsening laboratory findings",
      "Fever with hypotension during intensified immunosuppression"
    ], [
      "Teach exact immunosuppressant timing, interaction checks, laboratory follow-up, and why doses should never be stopped or doubled without transplant-team direction.",
      "Review the graft-specific warning symptoms and the transplant contact pathway for same-day assessment."
    ]),
    card("Severe combined immunodeficiency", ["aha-pals-2025"], [
      "Use protective infection precautions and screen visitors for illness because severe combined immunodeficiency leaves the infant vulnerable to ordinary viral, fungal, and bacterial exposures.",
      "Avoid live vaccines and verify the immunology plan before blood products because vaccine organisms and transfusion lymphocytes can cause life-threatening disease.",
      "Administer prescribed antimicrobial prophylaxis and immunoglobulin on schedule because passive protection is needed while definitive immune restoration is planned.",
      "Monitor feeding, weight, stool, oral thrush, skin, temperature, oxygen saturation, respiratory effort, blood counts, and cultures to detect subtle infection and failure to thrive.",
      "Escalate immediately for fever, hypothermia, respiratory distress, persistent diarrhea, dehydration, spreading rash, or lethargy because infection can disseminate with little inflammatory response."
    ], [
      "Fever or hypothermia with lethargy",
      "Respiratory distress or falling oxygen saturation",
      "Persistent diarrhea with dehydration or weight loss",
      "Spreading rash, thrush, or another recurrent severe infection"
    ], [
      "Teach caregivers strict hand hygiene, illness-visitor avoidance, safe feeding, and the immunology team's vaccine and exposure plan.",
      "Explain that fever, poor feeding, breathing change, diarrhea, or unusual sleepiness requires immediate contact even when symptoms seem mild."
    ]),
    card("Community-acquired pneumonia", ["idsa-cap"], [
      "Assess respiratory rate, work of breathing, oxygen saturation, breath sounds, mental status, and hydration because pneumonia severity is not defined by cough alone.",
      "Obtain indicated cultures before antibiotic therapy when this does not delay treatment because severe disease and resistant-pathogen risk may require targeted adjustment.",
      "Administer prescribed antibiotic and oxygen therapy promptly and reassess response because untreated alveolar infection can progress to hypoxemia and sepsis.",
      "Encourage coughing, mobility, hydration, and pain control when safe because secretion clearance and adequate ventilation reduce atelectasis and deconditioning.",
      "Escalate immediately for rising oxygen need, exhaustion, hypotension, confusion, oliguria, or worsening lactate because respiratory failure or septic shock may be developing."
    ], [
      "Rapidly rising oxygen requirement or respiratory fatigue",
      "Hypotension, confusion, or decreasing urine output",
      "New multilobar progression or complicated pleural effusion",
      "Worsening lactate or other signs of sepsis"
    ], [
      "Teach completion of prescribed antibiotics, hydration, mobilization, smoking cessation, and vaccination follow-up.",
      "Tell the patient to seek urgent care for increasing breathlessness, blue lips, confusion, fainting, inability to drink, or sharply reduced urine."
    ]),
    card("Ventilator-associated pneumonia", ["idsa-cap"], [
      "Elevate the head of bed when not contraindicated and provide protocol-directed oral care because aspiration of colonized secretions contributes to ventilator-associated pneumonia.",
      "Use aseptic suction technique and drain condensate away from the patient because contaminated circuit fluid can be introduced into the airway.",
      "Obtain ordered respiratory and blood cultures before changing antibiotic therapy when feasible because microbiologic data help narrow treatment and reduce unnecessary exposure.",
      "Monitor temperature, secretions, oxygen need, ventilator pressure, chest findings, white blood cell count, lactate, and hemodynamics to detect progression and treatment response.",
      "Escalate immediately for rapidly worsening oxygenation, rising ventilator pressure, hypotension, new organ dysfunction, or persistent fever despite antibiotics because acute respiratory distress syndrome, obstruction, or septic shock may be developing."
    ], [
      "Rapidly worsening oxygenation or ventilator requirement",
      "Hypotension, rising lactate, or new organ dysfunction",
      "Persistent fever and purulent secretions despite antibiotics",
      "Abrupt pressure rise suggesting mucus plugging or pneumothorax"
    ], [
      "Explain to families that positioning, oral care, hand hygiene, and daily ventilator-readiness assessment reduce preventable complications.",
      "After recovery, review aspiration prevention, mobility, swallowing needs, and respiratory warning signs."
    ]),
    card("Empyema", ["idsa-cap"], [
      "Administer prescribed antibiotic therapy and obtain pleural fluid cultures when drained because infected pleural material requires both organism treatment and source control.",
      "Prepare for image-guided drainage or chest-tube placement because loculated pus often cannot be cleared by systemic antibiotics alone.",
      "Assess pleuritic pain, breath sounds, work of breathing, oxygen saturation, fever, and chest expansion because enlarging empyema restricts ventilation.",
      "Monitor chest-tube patency, output, air leak, insertion site, imaging, white blood cell count, lactate, and temperature to detect inadequate drainage or sepsis.",
      "Escalate immediately for increasing oxygen need, hypotension, persistent fever, rapidly falling drainage with ongoing collection, or new subcutaneous air because critical illness or tube obstruction requires urgent review."
    ], [
      "Increasing oxygen requirement or respiratory distress",
      "Hypotension, rising lactate, or other sepsis findings",
      "Persistent collection despite chest-tube drainage",
      "Abrupt tube-output change with worsening symptoms"
    ], [
      "Teach chest-tube safety, pulmonary hygiene, mobility, and completion of antibiotic therapy because drainage and lung re-expansion take time.",
      "Tell the patient to report recurrent fever, worsening breathlessness, chest pain, or drainage-site redness promptly."
    ]),
    card("Flail chest", ["aha-als-2025"], [
      "Assess respiratory effort, paradoxical chest motion, breath sounds, oxygen saturation, and pain because pulmonary contusion often drives hypoxemia more than the visible rib segment.",
      "Provide ordered multimodal analgesia while reassessing ventilation because uncontrolled pain prevents deep breathing but oversedation can worsen hypoventilation.",
      "Apply oxygen and support noninvasive or invasive ventilation as directed because fatigue and contusion can cause progressive respiratory failure.",
      "Encourage supported coughing, pulmonary hygiene, and repositioning when stable because secretion retention increases atelectasis and pneumonia risk.",
      "Escalate immediately for rapidly increasing oxygen need, absent unilateral breath sounds, hypotension, worsening carbon dioxide, or exhaustion because pneumothorax, hemorrhage, or ventilatory collapse may coexist."
    ], [
      "Rapidly increasing oxygen need or respiratory fatigue",
      "Absent unilateral breath sounds or sudden pressure rise",
      "Hypotension or signs of intrathoracic bleeding",
      "Rising carbon dioxide or decreasing consciousness"
    ], [
      "Teach splinted coughing, prescribed breathing exercises, safe analgesic use, and early mobility because shallow breathing raises pneumonia risk.",
      "Explain that worsening dyspnea, blue color, faintness, fever, or uncontrolled pain after chest trauma requires urgent reassessment."
    ]),
    card("Pulmonary hypertension", ["acc-heart-failure-2022"], [
      "Assess dyspnea, syncope, chest pain, edema, jugular venous pressure, and activity tolerance because worsening pulmonary vascular resistance strains the right ventricle.",
      "Administer prescribed pulmonary vasodilator and oxygen therapy without interruption because abrupt withdrawal or hypoxemia can trigger decompensation.",
      "Balance fluid and diuretic therapy while monitoring blood pressure and kidney function because both volume overload and excessive preload reduction can impair right-heart output.",
      "Monitor oxygen saturation, rhythm, weight, urine output, perfusion, electrolytes, and signs of right-sided failure to detect progression.",
      "Escalate immediately for syncope, hypotension, new arrhythmia, rapidly increasing edema, chest pain, severe hypoxemia, or oliguria because pulmonary hypertensive crisis or right-ventricular failure may be developing."
    ], [
      "Syncope, hypotension, or rapidly declining perfusion",
      "Severe hypoxemia or escalating respiratory support",
      "New arrhythmia or ischemic chest pain",
      "Rapidly worsening edema, ascites, or oliguria"
    ], [
      "Teach strict adherence to pulmonary hypertension medicines and specialist follow-up because sudden interruption can cause rapid deterioration.",
      "Review individualized oxygen, activity, pregnancy, altitude, and fluid guidance and the symptoms that require emergency care."
    ]),
    card("RSV bronchiolitis", ["aha-pals-2025"], [
      "Suction the nose gently before feeding and respiratory assessment because infants rely heavily on nasal airflow and obstruction increases work of breathing.",
      "Assess respiratory rate, retractions, nasal flaring, apnea, color, oxygen saturation, hydration, and feeding because fatigue may appear as a slowing respiratory rate.",
      "Provide oxygen and hydration support as ordered while using smaller or alternate feeds when unsafe because tachypnea increases aspiration and dehydration risk.",
      "Use contact precautions and avoid routine antibiotic therapy without bacterial evidence because RSV is viral and spreads readily through secretions.",
      "Prepare high-flow support, noninvasive ventilation, or intubation when exhaustion appears because infants can lose respiratory reserve rapidly after prolonged retractions.",
      "Escalate immediately for apnea, cyanosis, exhaustion, poor air movement, dehydration, or rapidly rising oxygen need because high-flow support or ventilation may be required."
    ], [
      "Apnea, cyanosis, or decreasing responsiveness",
      "Exhaustion or markedly reduced air movement",
      "Inability to feed with decreasing urine output",
      "Rapidly increasing oxygen or ventilatory requirement"
    ], [
      "Teach caregivers nasal suction technique, hand hygiene, smoke avoidance, hydration cues, and safe sleep positioning.",
      "Tell caregivers to seek urgent care for pauses in breathing, blue color, worsening retractions, poor feeding, or fewer wet diapers."
    ]),
    card("Esophageal atresia", ["aha-neonatal-2025"], [
      "Keep the newborn nothing by mouth because feeds cannot reach the stomach normally and may enter the airway through an associated fistula.",
      "Elevate the head and maintain continuous or frequent pouch suction as ordered because pooled secretions can overflow and cause aspiration.",
      "Assess drooling, coughing, choking, cyanosis, abdominal distention, oxygen saturation, and breath sounds because respiratory compromise may worsen with secretions or ventilation.",
      "Maintain intravenous fluids and prepare diagnostic and surgical care because nutrition and definitive repair cannot proceed orally before anatomy is defined.",
      "Escalate immediately for apnea, cyanosis, increasing secretions, severe abdominal distention, or respiratory distress because aspiration or fistula-related ventilation can become critical."
    ], [
      "Apnea, cyanosis, or rapidly worsening respiratory distress",
      "Copious secretions that cannot be cleared",
      "Severe abdominal distention during ventilation",
      "Recurrent choking or aspiration findings"
    ], [
      "Explain to caregivers why the baby cannot be fed by mouth and why suction protects the lungs until repair.",
      "After surgery, teach the individualized feeding plan and warning signs of stricture, leak, reflux, or recurrent respiratory symptoms."
    ]),
    card("Hypoplastic left heart syndrome", ["aha-pals-2025"], [
      "Administer prescribed prostaglandin infusion without interruption because systemic blood flow depends on keeping the ductus arteriosus open before staged palliation.",
      "Monitor oxygen saturation within the congenital-cardiac target rather than trying to normalize it because excessive pulmonary flow can steal output from systemic organs.",
      "Assess pulses, capillary refill, blood pressure, temperature, urine output, lactate, feeding tolerance, and mental status to detect low systemic perfusion.",
      "Prepare airway and ventilation support for apnea during prostaglandin therapy because respiratory depression can occur while ductal patency remains essential.",
      "Escalate immediately for rapidly falling perfusion, rising lactate, severe acidosis, apnea, weak pulses, or decreasing urine output because ductal restriction or imbalanced circulation can cause shock."
    ], [
      "Weak pulses, rising lactate, or severe metabolic acidosis",
      "Rapidly decreasing urine output or altered responsiveness",
      "Apnea during prostaglandin therapy",
      "Abrupt saturation or perfusion change suggesting ductal restriction"
    ], [
      "Explain that oxygen levels may have a special target because the single ventricle must balance blood flow to lungs and body.",
      "Teach caregivers the interstage monitoring plan for feeding, weight, color, breathing, saturation when prescribed, and immediate cardiac-team contact triggers."
    ]),
    card("Pediatric asthma", ["aha-pals-2025"], [
      "Assess speech or feeding, retractions, respiratory rate, air movement, oxygen saturation, and alertness because children may deteriorate before they can describe severe breathlessness.",
      "Administer repeated inhaled bronchodilator and prescribed systemic corticosteroid therapy because bronchospasm and airway inflammation must both be treated.",
      "Use a spacer or age-appropriate delivery device and reassess technique because poor delivery can look like medication failure.",
      "Monitor heart rate, air entry, work of breathing, oxygen need, peak flow when feasible, and response after each treatment to detect fatigue.",
      "Escalate immediately for a silent chest, cyanosis, inability to speak or feed, exhaustion, altered consciousness, or rising carbon dioxide because intubation support may be required."
    ], [
      "Silent chest or markedly decreasing air movement",
      "Cyanosis or rapidly increasing oxygen requirement",
      "Inability to speak, feed, or remain alert",
      "Exhaustion or rising carbon dioxide"
    ], [
      "Teach child and caregiver inhaler-spacer technique, controller adherence, trigger reduction, and the written asthma action plan.",
      "Explain that frequent rescue use, nighttime symptoms, or activity limitation means the controller plan needs prompt review."
    ]),
    card("RSV infection", ["aha-pals-2025"], [
      "Use contact precautions and meticulous hand hygiene because RSV spreads efficiently through respiratory secretions and contaminated surfaces.",
      "Assess age-specific respiratory rate, retractions, apnea, oxygen saturation, hydration, feeding, and urine output because young infants may present with apnea or poor feeding rather than fever.",
      "Suction nasal secretions before feeds and provide ordered oxygen and hydration support because airway obstruction and tachypnea impair intake.",
      "Monitor for secondary bacterial findings without giving routine antibiotic therapy because antibiotics do not treat uncomplicated RSV infection.",
      "Escalate immediately for apnea, cyanosis, exhaustion, dehydration, altered responsiveness, or rising oxygen need because respiratory support may need rapid escalation."
    ], [
      "Apnea, cyanosis, or altered responsiveness",
      "Severe retractions, exhaustion, or poor air movement",
      "Inability to feed with markedly fewer wet diapers",
      "Rapidly rising oxygen or ventilatory requirement"
    ], [
      "Teach hand hygiene, nasal suction, smoke avoidance, hydration monitoring, and how to limit exposure to vulnerable infants.",
      "Tell caregivers to seek immediate care for breathing pauses, blue color, severe retractions, poor feeding, or lethargy."
    ]),
    card("Sickle cell crisis in children", ["ash-scd-guidelines"], [
      "Assess pain promptly with age-appropriate tools and administer the individualized analgesic plan because delays intensify suffering and physiologic stress.",
      "Provide hydration that corrects deficit without causing overload because dehydration promotes sickling while excess fluid can worsen acute chest syndrome.",
      "Apply oxygen when hypoxemic and encourage incentive spirometry when appropriate because hypoxia and atelectasis promote further sickling in the lungs.",
      "Obtain cultures and administer prescribed antibiotic therapy promptly for fever because functional asplenia makes bacterial sepsis a medical emergency.",
      "Escalate immediately for chest pain, fever, falling oxygen saturation, new neurologic deficit, splenic enlargement with pallor, or severe anemia because acute chest syndrome, stroke, sequestration, or sepsis requires urgent transfusion-capable care."
    ], [
      "Chest pain, fever, or falling oxygen saturation",
      "New focal neurologic deficit or seizure",
      "Rapid splenic enlargement with pallor or shock",
      "Severe anemia, hypotension, or rapidly worsening pain"
    ], [
      "Teach hydration, warmth, medication adherence, vaccination and prophylaxis plans, and early reporting of fever or chest symptoms.",
      "Explain that severe pain is real tissue ischemia and should be treated according to the child's established crisis plan."
    ]),
    card("Transposition of the great arteries", ["aha-pals-2025"], [
      "Administer prescribed prostaglandin infusion continuously because ductal patency may improve mixing between otherwise parallel circulations.",
      "Assess cyanosis, respiratory effort, pulses, perfusion, blood pressure, oxygen saturation, lactate, glucose, and temperature because worsening mixing causes systemic hypoxia and acidosis.",
      "Prepare airway support for prostaglandin-related apnea because ventilation may be needed while circulation remains duct dependent.",
      "Coordinate urgent echocardiography and catheter or surgical intervention because oxygen alone cannot correct severely inadequate intracardiac mixing.",
      "Escalate immediately for profound cyanosis, apnea, rising lactate, severe acidosis, shock, or declining consciousness because emergency atrial septostomy or other cardiac rescue may be required."
    ], [
      "Profound cyanosis that does not improve with oxygen",
      "Rising lactate or severe metabolic acidosis",
      "Apnea during prostaglandin therapy",
      "Shock, weak pulses, or declining consciousness"
    ], [
      "Explain that the major arteries are connected to opposite ventricles, so survival depends on blood mixing until repair.",
      "Teach caregivers the cardiac team's feeding, medication, color, breathing, and follow-up plan after stabilization or surgery."
    ]),
    card("Postpartum psychosis", ["acog-perinatal-mental-health", "va-dod-suicide-2024"], [
      "Keep the postpartum patient and infant continuously supervised and separated when safety is uncertain because delusions, hallucinations, or disorganization can create sudden suicide or infant-harm risk.",
      "Ask directly about suicidal thoughts, thoughts of harming the infant, command hallucinations, paranoia, sleep loss, and access to weapons because indirect questioning misses imminent danger.",
      "Activate emergency psychiatric evaluation and arrange a protected level of care because postpartum psychosis usually requires hospitalization rather than routine outpatient follow-up.",
      "Assess orientation, mood, psychosis, agitation, substance exposure, blood pressure, infection, thyroid, and metabolic causes because delirium and medical illness can mimic or worsen psychiatric symptoms.",
      "Escalate immediately for command hallucinations, rapidly changing behavior, refusal of infant safety measures, suicidal or homicidal intent, severe agitation, or catatonia because emergency containment and treatment are required."
    ], [
      "Suicidal or infant-harm thoughts, intent, or plan",
      "Command hallucinations or dangerous delusions involving the infant",
      "Severe agitation, catatonia, or rapidly changing behavior",
      "Refusal of safety supervision or access to lethal means"
    ], [
      "Teach family that postpartum psychosis is a medical emergency, not a moral failure, and that the patient should never be left alone with the infant until cleared.",
      "Review relapse prevention, sleep protection, medication follow-up, and an emergency contact plan before reunification and discharge."
    ]),
    card("Neonatal hypoglycemia", ["aha-neonatal-2025"], [
      "Screen glucose according to symptoms and newborn risk factors because maternal diabetes, prematurity, growth restriction, and illness can exhaust limited glucose stores.",
      "Initiate skin-to-skin care and prompt feeding when safe because warmth and enteral substrate reduce glucose use and support stabilization.",
      "Administer ordered dextrose gel or intravenous dextrose according to severity and feeding ability because symptomatic or persistent hypoglycemia threatens the developing brain.",
      "Recheck glucose after intervention and monitor temperature, feeding, tone, jitteriness, apnea, cyanosis, and seizure to detect recurrence.",
      "Escalate immediately for seizure, apnea, lethargy, poor feeding, persistent low glucose, or inability to maintain temperature because continuous dextrose and neonatal evaluation may be required."
    ], [
      "Seizure, apnea, or cyanosis",
      "Lethargy, hypotonia, or inability to feed",
      "Persistent low glucose after initial treatment",
      "Hypothermia or recurrent jitteriness with low glucose"
    ], [
      "Explain why repeated heel checks and early feeds are needed even when the newborn looks well because glucose can fall without obvious symptoms.",
      "Teach feeding frequency, warmth, and the signs of low glucose that require immediate newborn-team review."
    ]),
    card("Respiratory distress syndrome of newborn", ["aha-neonatal-2025"], [
      "Maintain a neutral thermal environment because cold stress increases oxygen and glucose consumption in a premature newborn with limited respiratory reserve.",
      "Apply prescribed continuous positive airway pressure or ventilation because positive pressure helps keep surfactant-deficient alveoli open.",
      "Administer ordered surfactant and reassess oxygen and pressure needs because improving surface tension can rapidly change ventilator requirements.",
      "Monitor respiratory rate, grunting, retractions, apnea, oxygen saturation target, blood gases, temperature, glucose, and perfusion to detect fatigue and treatment complications.",
      "Escalate immediately for recurrent apnea, rising carbon dioxide, severe retractions, rapidly increasing oxygen need, hypotension, or air-leak signs because intubation or chest decompression may be required."
    ], [
      "Recurrent apnea or rapidly increasing oxygen need",
      "Rising carbon dioxide with respiratory fatigue",
      "Hypotension or worsening peripheral perfusion",
      "Sudden deterioration suggesting pneumothorax"
    ], [
      "Explain that immature lungs lack enough surfactant to stay open, which is why pressure support and replacement surfactant may be needed.",
      "Teach caregivers how temperature control, feeding support, infection prevention, and developmental care aid recovery."
    ]),
    card("Chemotherapy extravasation", ["ons-asco-extravasation-2025"], [
      "Stop the antineoplastic infusion immediately while leaving the vascular device in place because the catheter may be needed to aspirate residual vesicant.",
      "Disconnect the tubing and aspirate drug through the existing access as directed without flushing because flushing can spread the agent through more tissue.",
      "Identify the exact drug and apply the agent-specific antidote and warm or cold compress protocol because incompatible measures can worsen tissue injury.",
      "Mark and photograph the borders, assess pain, swelling, color, sensation, pulses, and device patency, and document estimated exposure to track progression.",
      "Escalate immediately for central-line extravasation, rapidly increasing pain or swelling, blistering, skin necrosis, neurovascular change, or compartment findings because surgical or specialty evaluation may be urgent."
    ], [
      "Rapidly increasing pain, swelling, or blistering",
      "Skin discoloration, ulceration, or necrosis",
      "Loss of pulse, sensation, movement, or capillary refill",
      "Suspected central venous device extravasation"
    ], [
      "Teach the patient to report burning, stinging, tightness, swelling, or wetness at the infusion site immediately rather than waiting for visible injury.",
      "Explain the home inspection and follow-up schedule because tissue damage can evolve after the infusion has stopped."
    ]),
    card("Hemolytic transfusion reaction", ["aabb-circular-2024"], [
      "Stop the transfusion immediately and keep intravenous access with compatible saline tubing because continued incompatible blood exposure can intensify intravascular hemolysis.",
      "Recheck patient and component identifiers and notify the transfusion service and treating clinician because clerical mismatch is a preventable cause requiring immediate investigation.",
      "Send the required blood and urine specimens and return the component and tubing according to policy because laboratory confirmation directs future transfusion safety.",
      "Monitor blood pressure, temperature, pain, urine color and output, potassium, hemoglobin, coagulation, creatinine, and lactate to detect shock, hyperkalemia, DIC, and kidney injury.",
      "Escalate immediately for hypotension, chest or back pain, hemoglobinuria, severe fever or rigors, oliguria, bleeding, or dyspnea because resuscitation and critical-care support may be required."
    ], [
      "Hypotension with chest, flank, or back pain",
      "Hemoglobinuria or rapidly decreasing urine output",
      "Severe fever, rigors, or cardiovascular collapse",
      "Hyperkalemia, bleeding, or disseminated coagulation findings"
    ], [
      "Teach patients to report pain, chills, heat, nausea, breathlessness, or a sudden sense of danger at once during transfusion.",
      "Explain that the reaction must be documented with the transfusion service so later components can be selected and monitored safely."
    ]),
    card("Neutropenia", ["sccm-sepsis-2026", "nci-oncology-emergencies"], [
      "Check temperature promptly and treat fever with severe neutropenia as an emergency because a limited inflammatory response can hide rapidly spreading infection.",
      "Obtain ordered blood cultures from peripheral and central sites and administer prescribed broad antibiotic therapy promptly because delay increases sepsis risk.",
      "Use meticulous hand hygiene, screen ill visitors, and avoid rectal temperatures, suppositories, and unnecessary invasive procedures because mucosal injury creates an infection portal.",
      "Monitor absolute neutrophil count, blood pressure, oxygen need, mental status, lactate, urine output, oral mucosa, skin, lungs, lines, and perineum to detect subtle infection.",
      "Escalate immediately for fever, hypothermia, hypotension, rigors, new cough, abdominal pain, confusion, or rapidly progressive skin change because neutropenic sepsis can deteriorate within hours."
    ], [
      "Fever or hypothermia with severe neutropenia",
      "Hypotension, rising lactate, or altered mental status",
      "New respiratory distress or focal pulmonary findings",
      "Rapidly progressive abdominal, perineal, line, or skin findings"
    ], [
      "Teach daily temperature awareness, hand and mouth care, food and exposure guidance, and the oncology team's exact fever threshold.",
      "Explain that infection may cause only fatigue, chills, cough, diarrhea, or confusion, so symptoms should be reported before taking fever-reducing medicine."
    ]),
    card("Thrombotic thrombocytopenic purpura", ["ash-hit"], [
      "Notify hematology and prepare urgent plasma exchange because untreated thrombotic thrombocytopenic purpura can cause rapid brain, heart, and kidney ischemia.",
      "Obtain blood smear, hemolysis studies, platelets, creatinine, troponin, coagulation tests, and ADAMTS13 specimens without delaying treatment because confirmation may return after deterioration.",
      "Perform frequent neurologic checks and monitor rhythm, blood pressure, urine output, fever, and abdominal or chest symptoms to detect microvascular organ injury.",
      "Clarify routine platelet transfusion and avoid it unless directed for life-threatening bleeding or a critical procedure because added platelets may feed microvascular thrombosis.",
      "Escalate immediately for new focal deficit, seizure, chest pain, arrhythmia, oliguria, severe abdominal pain, falling platelets, or worsening hemolysis because intensive plasma-exchange support is required."
    ], [
      "New focal neurologic deficit, confusion, or seizure",
      "Chest pain, troponin rise, or cardiac arrhythmia",
      "Oliguria or rapidly worsening kidney function",
      "Falling platelets with worsening microangiopathic hemolysis"
    ], [
      "Explain that the low platelet count results from abnormal tiny-vessel clots, which is why treatment removes the harmful plasma factor rather than simply replacing platelets.",
      "Teach the patient to seek immediate care for bruising with headache, confusion, weakness, chest pain, dark urine, or sharply reduced urine."
    ]),
    card("Immune thrombocytopenic purpura", ["ash-hit"], [
      "Assess skin, gums, nose, urine, stool, menstrual flow, headache, and neurologic status because platelet destruction ranges from minor mucosal bleeding to intracranial hemorrhage.",
      "Use bleeding precautions and avoid intramuscular injections, rectal procedures, aspirin, and nonsteroidal anti-inflammatory drugs unless specifically directed because platelet function is already limited.",
      "Administer prescribed corticosteroid, immune globulin, or other immune therapy and trend platelets because treatment urgency depends on bleeding rather than the count alone.",
      "Apply prolonged gentle pressure after necessary venipuncture and minimize trauma because stable clots form less reliably with severe thrombocytopenia.",
      "Escalate immediately for severe headache, vomiting, focal deficit, heavy gastrointestinal or uterine bleeding, hemodynamic instability, or rapidly expanding hematoma because critical bleeding may require emergency platelet and immune therapy."
    ], [
      "Severe headache, vomiting, or focal neurologic deficit",
      "Heavy gastrointestinal, urinary, or uterine bleeding",
      "Hemodynamic instability or rapidly falling hemoglobin",
      "Rapidly expanding hematoma or airway bleeding"
    ], [
      "Teach avoidance of contact injury and unapproved aspirin or anti-inflammatory medicines and the importance of platelet follow-up.",
      "Tell the patient to seek emergency care after head injury or for severe headache, vomiting blood, black stool, uncontrolled bleeding, or new weakness."
    ]),
    card("Fluid volume excess", ["acc-heart-failure-2022"], [
      "Measure daily weight on the same scale and track strict intake and output because weight change detects retained fluid more reliably than visible edema alone.",
      "Assess lung sounds, oxygen saturation, jugular venous pressure, edema, abdominal distention, blood pressure, and skin integrity because overload affects lungs and tissues.",
      "Administer ordered diuretic therapy and monitor urine response because ineffective diuresis may signal kidney failure or severe venous congestion.",
      "Trend sodium, potassium, magnesium, creatinine, and fluid balance while following individualized sodium and fluid limits to detect treatment complications.",
      "Escalate immediately for pink frothy sputum, rapidly rising oxygen need, severe hypertension, new arrhythmia, oliguria, or worsening confusion because pulmonary edema or urgent dialysis may be developing."
    ], [
      "Pink frothy sputum or acute pulmonary edema",
      "Rapidly increasing oxygen requirement",
      "Oliguria with worsening edema or potassium abnormality",
      "Severe hypertension, arrhythmia, or altered mental status"
    ], [
      "Teach daily weight, edema and breathing checks, prescribed fluid and sodium limits, and the exact change that should trigger a call.",
      "Explain that swelling is not the only sign; orthopnea, cough, abdominal fullness, and reduced urine may show fluid accumulation earlier."
    ]),
    card("Nephritic syndrome", ["kdigo-glomerular"], [
      "Measure blood pressure accurately and assess edema, lung sounds, urine color, and urine output because glomerular inflammation retains salt and water and can cause hypertensive pulmonary edema.",
      "Trend creatinine, potassium, sodium, urinalysis, urine protein, hemoglobin, complement, and daily weight to detect falling filtration and disease pattern.",
      "Follow prescribed sodium and fluid limits and administer ordered antihypertensive or diuretic therapy because controlling volume and pressure protects the injured glomeruli.",
      "Avoid nephrotoxic medicines and unnecessary contrast when alternatives exist because reduced filtration increases the risk of additional kidney injury.",
      "Escalate immediately for severe hypertension, breathlessness with crackles, seizure, rapidly falling urine output, hyperkalemia, or rising creatinine because encephalopathy, pulmonary edema, or dialysis need may follow."
    ], [
      "Severe hypertension with headache, vision change, or seizure",
      "Pulmonary edema or rapidly increasing oxygen need",
      "Oliguria or rapidly rising creatinine",
      "Hyperkalemia with electrocardiographic change"
    ], [
      "Teach daily weight, blood-pressure and urine observation, individualized salt and fluid guidance, and medication avoidance review.",
      "Tell the patient to report cola-colored urine, rapidly increasing swelling, severe headache, breathlessness, or markedly reduced urine promptly."
    ]),
    card("Post-streptococcal glomerulonephritis", ["kdigo-glomerular"], [
      "Ask about recent throat or skin infection and assess edema, cola-colored urine, blood pressure, and urine output because immune glomerular injury often appears after the infection improves.",
      "Obtain ordered urinalysis, creatinine, potassium, complement, streptococcal testing, and daily weight because severity reflects kidney effects rather than throat symptoms.",
      "Administer prescribed antibiotic therapy for remaining streptococcal infection while explaining that supportive kidney care treats the nephritis because antibiotics do not instantly remove deposited immune injury.",
      "Follow sodium and fluid limits and give ordered diuretic or antihypertensive therapy because volume retention can cause pulmonary edema and hypertensive encephalopathy.",
      "Escalate immediately for seizure, severe hypertension, pulmonary edema, hyperkalemia, oliguria, or rapidly rising creatinine because critical blood-pressure control or dialysis may be required."
    ], [
      "Seizure or severe hypertensive neurologic symptoms",
      "Pulmonary edema or worsening respiratory distress",
      "Oliguria or rapidly rising creatinine",
      "Hyperkalemia with rhythm change"
    ], [
      "Teach families that dark urine and swelling can begin after the original sore throat or skin infection seems resolved.",
      "Review medication completion, daily weight and blood-pressure follow-up, and urgent signs such as breathlessness, severe headache, seizure, or reduced urine."
    ]),
    card("Testicular torsion", ["aha-pals-2025"], [
      "Treat sudden unilateral testicular pain with nausea or a high-riding testis as a surgical emergency because prolonged twisting can permanently infarct the testis.",
      "Notify urology promptly and keep the patient nothing by mouth because operative detorsion and fixation should not be delayed by routine care.",
      "Assess pain onset, testicular position, swelling, abdominal symptoms, and prior intermittent episodes while preserving privacy because timing and presentation guide urgency.",
      "Provide ordered analgesia and maintain intravenous access without allowing symptom relief to postpone definitive evaluation because spontaneous detorsion can retwist.",
      "Escalate immediately for abrupt severe pain, absent cremasteric reflex, increasing swelling, vomiting, or pain after recent detorsion because ultrasound must not delay surgery when clinical suspicion is high."
    ], [
      "Abrupt severe unilateral testicular pain",
      "High-riding or horizontally positioned testis",
      "Absent cremasteric reflex with nausea or vomiting",
      "Recurrent pain after apparent spontaneous detorsion"
    ], [
      "Teach adolescents and caregivers that sudden testicular pain is time-sensitive and should never be hidden or watched overnight.",
      "After surgery, review wound care, activity limits, pain control, and the reason the opposite testis may also be fixed."
    ]),
    card("Urosepsis", ["sccm-sepsis-2026"], [
      "Obtain ordered urine and blood cultures and administer prescribed broad antibiotic therapy promptly because urinary infection can enter the bloodstream and cause rapid organ dysfunction.",
      "Assess flank or suprapubic pain, urinary symptoms, catheter status, fever, blood pressure, mental status, and obstruction risk because source control may require drainage rather than antibiotics alone.",
      "Administer ordered crystalloid with repeated lung and perfusion reassessment because sepsis volume loss must be corrected without causing overload.",
      "Monitor lactate, urine output, creatinine, blood pressure, temperature, oxygen need, mental status, and culture response to detect septic shock and kidney injury.",
      "Escalate immediately for hypotension, rising lactate, anuria, new confusion, severe flank pain with obstruction, or persistent fever because vasopressor therapy or urgent urinary decompression may be required."
    ], [
      "Hypotension, rising lactate, or worsening mottling",
      "Anuria or rapidly worsening kidney function",
      "New confusion or decreasing consciousness",
      "Severe flank pain with obstruction or persistent infection"
    ], [
      "Teach hydration, catheter care when applicable, medication completion, and prompt reporting of fever, flank pain, confusion, or reduced urine.",
      "Explain that an obstructed infected urinary tract may need urgent drainage because antibiotics cannot reliably clear a closed infected system."
    ]),
    card("Delirium tremens", ["va-dod-suicide-2024"], [
      "Administer symptom-triggered benzodiazepine therapy according to the withdrawal protocol because untreated autonomic hyperactivity can progress to seizure and cardiovascular collapse.",
      "Give prescribed thiamine before or with glucose-containing therapy when feasible because chronic alcohol use can leave the brain vulnerable to Wernicke encephalopathy.",
      "Use seizure and fall precautions with a calm, well-lit environment because hallucinations, tremor, and confusion create severe injury risk.",
      "Monitor withdrawal score, temperature, heart rate, blood pressure, rhythm, oxygen saturation, fluid balance, potassium, magnesium, glucose, and consciousness to detect treatment response and complications.",
      "Escalate immediately for seizure, hyperthermia, severe agitation, hallucinations with unsafe behavior, arrhythmia, refractory hypertension, or rising sedation needs because intensive airway and hemodynamic support may be required."
    ], [
      "Seizure or rapidly declining consciousness",
      "Hyperthermia, arrhythmia, or refractory hypertension",
      "Severe agitation or hallucinations with unsafe behavior",
      "Escalating sedative need with respiratory compromise"
    ], [
      "Explain that delirium tremens is a life-threatening withdrawal state requiring monitored treatment rather than abrupt detoxification alone at home.",
      "After stabilization, connect the patient with medication, counseling, nutrition, and relapse-prevention support using nonjudgmental language."
    ]),
    card("Self-harm", ["va-dod-suicide-2024"], [
      "Treat wounds, bleeding, poisoning, and altered consciousness first because self-harm may conceal time-critical medical injury even when the patient appears calm.",
      "Ask directly and privately about suicidal intent, method, timing, triggers, prior acts, and current wish to die because the behavior's function and lethality determine immediate risk.",
      "Remove accessible hazards and use the observation level required by current risk because opportunity can change faster than stated intent.",
      "Document wound pattern, toxic exposure, mental status, protective factors, supports, and reassessments without shaming language because accurate continuity is essential for safety planning.",
      "Escalate immediately for active suicidal intent, concealed high-lethality injury, inability to collaborate on safety, severe agitation, psychosis, intoxication, or access to lethal means because protected emergency evaluation is required."
    ], [
      "Active suicidal intent, plan, or recent high-lethality act",
      "Concealed bleeding, overdose, strangulation, or head injury",
      "Psychosis, intoxication, or severe agitation",
      "Inability to collaborate on safety with access to lethal means"
    ], [
      "Use direct, nonjudgmental language and explain that asking about suicide does not create the thought; it helps match support to danger.",
      "Before discharge, complete a collaborative safety plan, lethal-means reduction, crisis contacts, and a specific follow-up handoff rather than relying on a promise alone."
    ]),
    card("Suicidal ideation", ["va-dod-suicide-2024"], [
      "Ask directly about current thoughts, intent, plan, access to means, preparation, timing, prior attempts, and reasons for living because vague screening cannot define acute risk.",
      "Do not leave a patient with imminent intent alone and remove accessible lethal means because a short period of opportunity may be enough for an attempt.",
      "Assess intoxication, psychosis, agitation, hopelessness, recent loss, medical illness, supports, and ability to use a safety plan because risk changes with context.",
      "Coordinate a warm handoff to emergency psychiatric care or rapid follow-up and document reassessment because passive referral can fail during a high-risk transition.",
      "Escalate immediately for intent with plan and means, recent rehearsal or attempt, command hallucinations, inability to maintain safety, escalating agitation, or refusal of essential protection because emergency containment is indicated."
    ], [
      "Intent with a specific plan and accessible means",
      "Recent attempt, rehearsal, or preparatory behavior",
      "Command hallucinations or severe agitation",
      "Inability to maintain safety or accept essential protection"
    ], [
      "Explain that suicidal thoughts can be discussed directly and confidentially within safety limits, and that honest disclosure guides the least restrictive safe care.",
      "Create a written safety plan with warning signs, coping steps, supportive people, crisis resources, lethal-means reduction, and a confirmed follow-up appointment."
    ]),
    card("Violence risk", ["va-dod-suicide-2024"], [
      "Assess specific threats, target, intent, plan, access to weapons, past violence, intoxication, psychosis, and escalating behavior because concrete capability predicts urgency better than anger alone.",
      "Maintain safe distance, a clear exit, calm communication, and adequate trained staff because crowding or confrontation can accelerate aggression.",
      "Reduce noise and stimulation, offer choices, and address pain, hypoxia, hypoglycemia, withdrawal, or delirium because reversible distress may drive threatening behavior.",
      "Use the least restrictive effective intervention and monitor airway, circulation, position, and distress continuously during restraint or emergency medication because containment itself can cause injury.",
      "Check bedside glucose, oxygenation, temperature, and neurologic status when aggression begins abruptly because metabolic illness, hypoxia, infection, or head injury can mimic primary violence risk.",
      "Escalate immediately for weapon access, a specific imminent threat, stalking or hostage behavior, inability to redirect, severe psychosis, or assaultive movement because coordinated security and emergency clinical response are required."
    ], [
      "Specific imminent threat with target, plan, and means",
      "Weapon access or hostage behavior",
      "Severe psychosis, intoxication, or delirium with aggression",
      "Assaultive movement or failure of verbal de-escalation"
    ], [
      "Explain behavioral limits and available choices in simple, respectful language because predictability can reduce perceived threat.",
      "Before disposition, address weapon access, victim and staff safety duties, substance or medical drivers, and a documented follow-up plan according to law and policy."
    ]),
  ];

  function canonicalName(entry) {
    return String((entry && (entry.name || entry.title)) || "").trim();
  }

  cards.forEach((patch) => {
    const matches = database.diseases.filter((entry) => canonicalName(entry) === patch.name);
    if (matches.length !== 1) return;
    Object.assign(matches[0], {
      nursingPriorities: patch.nursingPriorities.slice(),
      redFlags: patch.redFlags.slice(),
      patientEducation: patch.patientEducation.slice()
    });
  });

  const names = cards.map((entry) => entry.name);
  window.ANI_PATHOLOGY_NURSING_WAVE26 = {
    version: VERSION,
    names: names.slice(),
    highRiskNames: names.slice(),
    sources: sources.map((source) => ({ ...source }))
  };
})();
