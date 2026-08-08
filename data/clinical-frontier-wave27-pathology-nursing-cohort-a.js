(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  const VERSION = "2026-07-17-wave27-pathology-nursing-a-1";
  const sources = [
    {
      id: "aha-als-2025",
      label: "American Heart Association, 2025 Adult Advanced Life Support",
      url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support",
      note: "Supports recognition and resuscitation of respiratory arrest, shock, and life-threatening ventricular rhythms."
    },
    {
      id: "aha-special-2025",
      label: "American Heart Association, 2025 Adult and Pediatric Special Circumstances of Resuscitation",
      url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation",
      note: "Supports drowning, pulmonary embolism, sympathomimetic, organophosphate, and other toxin-specific emergencies."
    },
    {
      id: "sccm-sepsis-2026",
      label: "Society of Critical Care Medicine, Surviving Sepsis Campaign Adult Guidelines 2026",
      url: "https://sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines",
      note: "Supports immediate sepsis recognition, cultures, antimicrobials, lactate and perfusion reassessment, fluids, vasopressors, and source control."
    },
    {
      id: "acc-cardiogenic-shock-2025",
      label: "American College of Cardiology, 2025 Cardiogenic Shock Concise Clinical Guidance",
      url: "https://www.acc.org/guidelines/guidelines/2025/03/17/19/42/cardiogenic-shock-concise-clinical-guidance",
      note: "Supports staged recognition, hemodynamic assessment, shock-team escalation, and advanced circulatory support decisions."
    },
    {
      id: "ncs-guidelines",
      label: "Neurocritical Care Society, Neurocritical Care Guidelines",
      url: "https://www.neurocriticalcare.org/Resources-Publications/Neurocritical-Care-Guidelines",
      note: "Provides professional guidance for cerebral edema and status epilepticus management."
    },
    {
      id: "btf-severe-tbi",
      label: "Brain Trauma Foundation, Guidelines for the Management of Severe Traumatic Brain Injury",
      url: "https://braintrauma.org/coma/guidelines/severe-tbi",
      note: "Supports neurologic, intracranial-pressure, oxygenation, blood-pressure, and cerebral-perfusion priorities after severe brain injury."
    },
    {
      id: "btf-surgical-tbi",
      label: "Brain Trauma Foundation, Guidelines for the Surgical Management of Traumatic Brain Injury",
      url: "https://braintrauma.org/coma/guidelines/surgical",
      note: "Supports urgent neurosurgical evaluation for epidural hematoma and traumatic parenchymal lesions with deterioration or mass effect."
    },
    {
      id: "mgfa-emergency",
      label: "Myasthenia Gravis Foundation of America, Emergency Management for First Responders",
      url: "https://myasthenia.org/understanding-mg/learn-more-about-mg-treatments/mg-brochures/emergency-management-for-first-responders/",
      note: "Supports serial respiratory-strength assessment, secretion management, medication review, ventilation, and neurology escalation in myasthenic crisis."
    },
    {
      id: "mhaus-crisis",
      label: "Malignant Hyperthermia Association of the United States, Managing an MH Crisis",
      url: "https://www.mhaus.org/healthcare-professionals/managing-a-crisis/",
      note: "Supports immediate trigger discontinuation, dantrolene, active cooling, metabolic monitoring, and recurrence surveillance."
    },
    {
      id: "acmt-nac-2026",
      label: "American College of Medical Toxicology, Intravenous Acetylcysteine Therapy 2026 Update",
      url: "https://www.acmt.net/news/acmt-practice-statement-duration-of-intravenous-acetylcysteine-therapy-following-acetaminophen-overdose-2026-update/",
      note: "Supports acetylcysteine use and laboratory criteria for continuing or stopping therapy after acetaminophen poisoning."
    },
    {
      id: "hhs-chemm-nerve-agent",
      label: "United States HHS CHEMM, Nerve Agent Emergency Hospital Management",
      url: "https://chemm.hhs.gov/na_hospital_mmg.htm",
      note: "Supports responder protection, decontamination, airway management, atropine, oxime therapy, and seizure treatment for severe cholinergic poisoning."
    },
    {
      id: "acc-heparin",
      label: "American College of Cardiology, Heparin Considerations for Use",
      url: "https://www.acc.org/~/media/Files/Migration%20Content/Quality%20and%20Clinical%20Trials/AFib%20Toolkit/Drugs/Drugs%202/Heparin.pdf",
      note: "Supports heparin interruption, coagulation monitoring, protamine reversal, and bleeding education."
    },
    {
      id: "acc-pe-2026",
      label: "American College of Cardiology and American Heart Association, 2026 Acute Pulmonary Embolism Guideline Summary",
      url: "https://www.acc.org/latest-in-cardiology/journal-scans/2026/02/17/14/32/acc-aha-release-first-ever-guideline-for-treatment-and-management-of-acute-pe",
      note: "Supports severity assessment, anticoagulation, pulmonary embolism response teams, and advanced therapy for unstable acute pulmonary embolism."
    },
    {
      id: "acs-trauma-best-practices",
      label: "American College of Surgeons, Trauma Quality Programs Best Practices Guidelines",
      url: "https://www.facs.org/quality-programs/trauma/quality/best-practices-guidelines/",
      note: "Supports structured trauma assessment, hemorrhage response, chest injury, traumatic brain injury, massive transfusion, and orthopedic trauma care."
    },
    {
      id: "acs-chest-wall-2025",
      label: "American College of Surgeons, 2025 Chest Wall Injury Best Practices",
      url: "https://www.facs.org/media/qdgliayt/2025_tr_bestpracticesguidelines_chest-wall.pdf",
      note: "Supports respiratory surveillance, multimodal analgesia, pulmonary hygiene, mobility, and escalation after serious chest wall injury."
    },
    {
      id: "east-open-fracture",
      label: "Eastern Association for the Surgery of Trauma, Open Fracture Antibiotic Guideline",
      url: "https://www.east.org/education-resources/practice-management-guidelines/details/open-fractures-prophylactic-antibiotic-use-in-update",
      note: "Supports early antimicrobial prophylaxis and infection prevention in open fractures."
    },
    {
      id: "aba-burn-referral",
      label: "American Burn Association, Burn Patient Referral Guidelines",
      url: "https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral",
      note: "Supports burn-depth and surface-area assessment, inhalation-injury recognition, and burn-center consultation."
    },
    {
      id: "acog-hypertension",
      label: "American College of Obstetricians and Gynecologists, Gestational Hypertension and Preeclampsia",
      url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2020/06/gestational-hypertension-and-preeclampsia",
      note: "Supports severe-hypertension surveillance, magnesium safety, fetal assessment, and urgent delivery planning."
    },
    {
      id: "acog-pph",
      label: "American College of Obstetricians and Gynecologists, Postpartum Hemorrhage",
      url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2017/10/postpartum-hemorrhage",
      note: "Supports quantified blood loss, hemorrhage bundles, blood products, retained-placenta response, and obstetric coagulopathy management."
    },
    {
      id: "cdc-gbs-2025",
      label: "Centers for Disease Control and Prevention, Clinical Guidance for Group B Streptococcal Disease",
      url: "https://www.cdc.gov/group-b-strep/hcp/clinical-guidance/index.html",
      note: "Supports prevention, recognition, evaluation, and treatment pathways for neonatal group B streptococcal disease."
    },
    {
      id: "aap-bilirubin-2022",
      label: "American Academy of Pediatrics, Hyperbilirubinemia Clinical Practice Guideline",
      url: "https://publications.aap.org/pediatrics/article/150/3/e2022058859/188726/Clinical-Practice-Guideline-Revision-Management-of",
      note: "Supports bilirubin measurement, intensive phototherapy, escalation thresholds, exchange transfusion, follow-up, and caregiver education."
    },
    {
      id: "aha-neonatal-2025",
      label: "American Heart Association and American Academy of Pediatrics, 2025 Neonatal Resuscitation",
      url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation",
      note: "Supports neonatal airway, ventilation, oxygenation, temperature, glucose, and circulatory stabilization."
    },
    {
      id: "esc-pericardial-2025",
      label: "European Society of Cardiology, 2025 Myocarditis and Pericarditis Guidelines",
      url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/myocarditis-and-pericarditis/",
      note: "Supports assessment and escalation of pericardial effusion and cardiac tamponade."
    },
    {
      id: "acc-acs-2025",
      label: "American College of Cardiology and American Heart Association, 2025 Acute Coronary Syndromes Guideline",
      url: "https://www.acc.org/Guidelines/Guidelines/2025/02/27/17/21/Acute-Coronary-Syndromes-2025",
      note: "Supports immediate ischemia assessment, reperfusion, antithrombotic care, and complication monitoring after myocardial infarction."
    },
    {
      id: "acc-hf-2022",
      label: "American College of Cardiology, 2022 AHA ACC HFSA Heart Failure Guideline",
      url: "https://www.acc.org/Guidelines/Guidelines/2022/03/30/16/38/2022-Heart-Failure",
      note: "Supports congestion assessment, guideline-directed therapy, self-monitoring, and advanced heart-failure escalation."
    },
    {
      id: "acc-valve-2020",
      label: "American College of Cardiology, 2020 AHA ACC Valvular Heart Disease Guideline",
      url: "https://www.acc.org/guidelines/hubs/valvular-heart-disease",
      note: "Supports serial imaging, symptom surveillance, and intervention referral for aortic regurgitation."
    },
    {
      id: "acc-pad-2024",
      label: "American College of Cardiology, 2024 Lower Extremity Peripheral Artery Disease Guideline",
      url: "https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2024/05/09/15/00/2024-guideline-for-lower-extremity-pad",
      note: "Supports vascular risk reduction, foot surveillance, structured exercise, and urgent recognition of limb-threatening ischemia."
    },
    {
      id: "ats-oxygen",
      label: "American Thoracic Society, Home Oxygen Therapy for Adults With Chronic Lung Disease",
      url: "https://www.thoracic.org/statements/guideline-implementation-tools/home-oxygen-therapy-for-adults.php",
      note: "Supports oxygen assessment, equipment safety, adherence, and follow-up in chronic hypoxemia."
    },
    {
      id: "ers-ats-niv",
      label: "European Respiratory Society and American Thoracic Society, Noninvasive Ventilation for Acute Respiratory Failure",
      url: "https://www.thoracic.org/statements/resources/cc/niv-guidelines.pdf",
      note: "Supports carefully selected noninvasive ventilation and timely escalation when ventilation fails."
    },
    {
      id: "endocrine-hypercalcemia",
      label: "Endocrine Society, Treatment of Hypercalcemia of Malignancy Guideline",
      url: "https://www.endocrine.org/clinical-practice-guidelines/hypercalcemia",
      note: "Supports hydration, antiresorptive therapy, calcitonin for severe disease, recurrence prevention, and renal monitoring."
    },
    {
      id: "wfh-hemophilia",
      label: "World Federation of Hemophilia, Guidelines for the Management of Hemophilia",
      url: "https://www1.wfh.org/publications/files/pdf-1863.pdf",
      note: "Supports prompt factor replacement, inhibitor assessment, bleeding precautions, and joint protection in hemophilia."
    },
    {
      id: "aspen-refeeding",
      label: "American Society for Parenteral and Enteral Nutrition, Refeeding Syndrome Consensus Recommendations",
      url: "https://nutritioncare.org/Clinical_Practice_Library/",
      note: "Supports risk assessment, thiamine, cautious calorie advancement, electrolyte surveillance, and response to refeeding abnormalities."
    },
    {
      id: "ada-children-2026",
      label: "American Diabetes Association, Children and Adolescents Standards of Care 2026",
      url: "https://diabetesjournals.org/care/article/49/Supplement_1/S297/163923/14-Children-and-Adolescents-Standards-of-Care-in",
      note: "Supports continuous glucose monitoring, insulin safety, developmentally appropriate education, complication screening, and school planning."
    },
    {
      id: "ada-foot-2026",
      label: "American Diabetes Association, Retinopathy Neuropathy and Foot Care Standards 2026",
      url: "https://diabetesjournals.org/care/article/49/Supplement_1/S261/163919/12-Retinopathy-Neuropathy-and-Foot-Care-Standards",
      note: "Supports neuropathy and vascular assessment, pressure off-loading, ulcer care, infection recognition, and limb preservation."
    },
    {
      id: "ada-general-2026",
      label: "American Diabetes Association, Standards of Care in Diabetes 2026",
      url: "https://diabetesjournals.org/care/issue/49/Supplement_1",
      note: "Supports individualized glucose management, cardiovascular and kidney risk reduction, complication screening, and self-management education."
    },
    {
      id: "ascrs-volvulus-2021",
      label: "American Society of Colon and Rectal Surgeons, Colonic Volvulus Clinical Practice Guideline",
      url: "https://fascrs.org/getattachment/Healthcare-Providers/Education/Clinical-Practice-Guidelines/2021-Colonic-Volvulus-CPG.pdf?lang=en-US",
      note: "Supports urgent assessment of bowel viability, endoscopic decompression when appropriate, surgery, and recurrence prevention."
    },
    {
      id: "asge-dysphagia",
      label: "American Society for Gastrointestinal Endoscopy, Food Impaction and Dysphagia Guidance",
      url: "https://www.asge.org/home/resources/publications/guidelines/management-of-ingested-foreign-bodies-and-food-impactions",
      note: "Supports airway protection, nothing-by-mouth status, timely endoscopy, and evaluation of underlying esophageal disease."
    },
    {
      id: "idsa-gas-2025",
      label: "Infectious Diseases Society of America, Group A Streptococcal Pharyngitis Guideline 2025",
      url: "https://www.idsociety.org/practice-guideline/streptococcal-pharyngitis2/",
      note: "Identifies peritonsillar abscess as a complicated infection requiring urgent evaluation rather than routine pharyngitis care."
    },
    {
      id: "apa-schizophrenia",
      label: "American Psychiatric Association, Practice Guideline for the Treatment of Patients With Schizophrenia",
      url: "https://psychiatryonline.org/doi/book/10.1176/appi.books.9780890424841",
      note: "Supports systematic assessment and treatment of antipsychotic movement adverse effects."
    },
    {
      id: "nih-hiv-2026",
      label: "United States DHHS, HIV AIDS Treatment Guidelines 2026",
      url: "https://clinicalinfo.hiv.gov/en/guidelines",
      note: "Supports antiretroviral therapy, viral-load and CD4 monitoring, opportunistic-infection prevention, adherence, and interaction review."
    },
    {
      id: "endocrine-pheo",
      label: "Endocrine Society, Pheochromocytoma and Paraganglioma Clinical Practice Guidance",
      url: "https://support.endocrine.org/news-and-advocacy/news-room/2014/experts-recommend-blood-urine-testing-to-diagnose-rare-adrenal-tumors",
      note: "Supports biochemical confirmation, specialist management, alpha blockade before beta blockade, and perioperative planning."
    },
    {
      id: "who-safe-surgery",
      label: "World Health Organization, Safe Surgery",
      url: "https://www.who.int/teams/integrated-health-services/patient-safety/research/safe-surgery",
      note: "Supports structured perioperative communication, surveillance, and rapid response to surgical complications."
    }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const cards = [
    card("Respiratory failure", ["aha-als-2025", "ers-ats-niv"], [
      "Assess respiratory rate, work of breathing, chest movement, breath sounds, oxygen saturation, mental status, and ability to speak because exhaustion and rising carbon dioxide can precede respiratory arrest even before saturation collapses.",
      "Position the airway, apply prescribed oxygen, and prepare bag-mask, noninvasive, or invasive ventilation because respiratory failure means oxygenation or carbon dioxide clearance is no longer meeting tissue needs.",
      "Obtain and trend blood gases, carbon dioxide, pH, oxygenation, and response after each support change because a worsening pH or rising carbon dioxide shows inadequate ventilation rather than simple anxiety.",
      "Identify and treat reversible drivers such as opioid effect, bronchospasm, mucus plugging, pneumothorax, pulmonary edema, infection, or neuromuscular weakness because ventilatory support alone does not remove the cause.",
      "Escalate immediately for apnea, a silent chest, inability to protect the airway, refractory hypoxemia, rising carbon dioxide with somnolence, or rapidly decreasing effort because these findings indicate impending ventilatory collapse."
    ], [
      "Apnea, agonal breathing, or inability to protect the airway",
      "Refractory hypoxemia despite increasing support",
      "Rising carbon dioxide with acidosis, confusion, or somnolence",
      "Exhaustion, paradoxical breathing, or a rapidly falling respiratory rate"
    ], [
      "Explain that oxygen can improve a low saturation but cannot replace ventilation when carbon dioxide is accumulating, so repeat assessment remains essential.",
      "Teach the patient and family to seek emergency help for blue lips, new confusion, inability to speak normally, severe breathlessness, or failure of the prescribed rescue plan."
    ]),
    card("Shock", ["aha-als-2025", "sccm-sepsis-2026"], [
      "Assess blood pressure and mean arterial pressure with mental status, skin temperature, capillary refill, pulses, urine output, and lactate because shock is inadequate tissue perfusion and can exist before profound hypotension appears.",
      "Establish large-bore vascular access, obtain ordered blood and cultures, and prepare fluids, blood products, or vasoactive therapy because restoring circulating volume and perfusion is time critical while the cause is identified.",
      "Differentiate distributive, hypovolemic, cardiogenic, and obstructive clues at the bedside because indiscriminate fluid can worsen pulmonary edema or right-heart obstruction while delayed volume can worsen hemorrhagic shock.",
      "Trend rhythm, oxygen need, lung sounds, lactate, urine output, creatinine, acid-base status, and response after every intervention because resuscitation must improve organ perfusion without causing overload or arrhythmia.",
      "Escalate immediately for worsening hypotension, mottling, anuria, rising lactate, new confusion, chest pain, severe dyspnea, or an unstable rhythm because these findings signal progressive organ failure requiring a shock team or critical care response."
    ], [
      "Hypotension with altered mental status or weak pulses",
      "Rising lactate, worsening mottling, or prolonged capillary refill",
      "Anuria or rapidly declining urine output",
      "Pulmonary edema, ischemic chest pain, or unstable dysrhythmia during resuscitation"
    ], [
      "Explain that shock means organs are not receiving effective blood flow, so frequent checks and rapid treatment changes are needed even when the patient is awake.",
      "After recovery, review the specific cause, medication plan, hydration or bleeding precautions, and the symptoms that should trigger urgent reassessment."
    ]),
    card("Cardiogenic shock after MI", ["acc-cardiogenic-shock-2025", "acc-acs-2025"], [
      "Activate the acute coronary and cardiogenic-shock pathway while obtaining a 12-lead electrocardiogram because urgent revascularization and shock-team decisions can restore myocardium before pump failure becomes irreversible.",
      "Assess blood pressure, mentation, cool clammy skin, pulses, jugular venous pressure, lung sounds, chest pain, urine output, and lactate because these findings reveal low cardiac output and whether left- or right-sided congestion is dominant.",
      "Maintain continuous rhythm and ST-segment monitoring and prepare defibrillation or pacing because ischemic myocardium can deteriorate abruptly into ventricular arrhythmia or conduction block.",
      "Administer ordered antithrombotic, vasoactive, and reperfusion therapy while reassessing perfusion and lungs after each change because raising pressure without improving forward flow can increase myocardial oxygen demand.",
      "Escalate immediately for refractory hypotension, worsening pulmonary edema, recurrent ischemia, rising lactate, oliguria, mechanical-complication murmurs, or malignant ventricular rhythm because invasive hemodynamics or mechanical circulatory support may be required."
    ], [
      "Refractory hypotension with cool skin, confusion, or oliguria",
      "Rapidly worsening pulmonary edema or oxygen requirement",
      "New harsh murmur, recurrent chest pain, or sudden hemodynamic collapse",
      "Sustained ventricular tachycardia, ventricular fibrillation, or advanced heart block"
    ], [
      "Tell the family that cardiogenic shock is pump failure caused by major heart injury and that rapid catheterization and support decisions are aimed at restoring blood flow and protecting organs.",
      "After stabilization, reinforce cardiac rehabilitation, medication adherence, daily symptom monitoring, and emergency evaluation for recurrent chest pressure, fainting, or severe breathlessness."
    ]),
    card("Severe sepsis", ["sccm-sepsis-2026"], [
      "Activate the sepsis pathway and obtain ordered blood cultures and lactate promptly because infection-associated organ dysfunction can worsen quickly and cultures help narrow treatment later.",
      "Administer prescribed broad antimicrobial therapy without avoidable delay because early effective treatment reduces ongoing pathogen-driven inflammation and organ injury.",
      "Give ordered crystalloid in measured steps with repeated lung, capillary-refill, blood-pressure, and perfusion reassessment because both under-resuscitation and fluid overload can worsen outcome.",
      "Measure urine output and trend mental status, oxygen need, lactate, creatinine, bilirubin, platelets, glucose, and acid-base status because sepsis injury may first appear as subtle kidney, brain, lung, liver, or coagulation change.",
      "Escalate immediately for hypotension after fluids, rising lactate, anuria, increasing oxygen need, new confusion, mottling, or rapidly worsening organ tests because vasopressors, source control, and critical care support may be required."
    ], [
      "Persistent hypotension or worsening capillary refill after initial fluid",
      "Rising lactate, mottling, or falling urine output",
      "New confusion, increasing oxygen need, or respiratory fatigue",
      "Evidence of an undrained source, necrotizing infection, or rapidly worsening organ dysfunction"
    ], [
      "Explain that sepsis is the body's dangerous organ-injuring response to infection, which is why cultures, antibiotics, fluids, and repeated reassessment happen together.",
      "Teach survivors to complete the treatment plan and seek prompt care for recurrent fever, confusion, breathlessness, reduced urine, severe weakness, or a worsening wound."
    ]),
    card("Cerebral edema", ["ncs-guidelines", "btf-severe-tbi"], [
      "Perform frequent standardized neurologic checks of consciousness, pupils, motor response, speech, and new headache or vomiting because small changes can be the first sign of rising intracranial pressure and impending herniation.",
      "Elevate the head of bed about 30 degrees and keep the head and neck midline when not contraindicated because venous obstruction can increase intracranial blood volume and pressure.",
      "Maintain oxygenation, ventilation, temperature, glucose, sodium, and ordered blood-pressure goals because hypoxia, hypotension, fever, and metabolic disturbance intensify secondary brain injury.",
      "Administer prescribed hyperosmolar therapy and trend sodium, osmolality, kidney function, fluid balance, and neurologic response because osmotic treatment can reduce brain water while causing electrolyte or circulatory complications.",
      "Escalate immediately for a falling Glasgow Coma Scale, new anisocoria, extensor posturing, seizure, bradycardia with widening pulse pressure, irregular respirations, or sudden vomiting because these findings may signal herniation requiring emergent neurocritical intervention."
    ], [
      "Falling consciousness or a new focal neurologic deficit",
      "New unequal or nonreactive pupils",
      "Extensor posturing, recurrent seizure, or abrupt projectile vomiting",
      "Bradycardia, widening pulse pressure, and irregular breathing"
    ], [
      "Explain that cerebral edema is swelling inside a rigid skull, so positioning, oxygen, blood pressure, temperature, and repeated neurologic checks all protect brain perfusion.",
      "Tell caregivers to report any new sleepiness, confusion, weakness, pupil difference, severe headache, repeated vomiting, or seizure immediately."
    ]),
    card("Epidural hematoma", ["btf-surgical-tbi", "acs-trauma-best-practices"], [
      "Activate trauma and neurosurgical evaluation immediately while documenting the injury time, loss of consciousness, lucid interval, anticoagulant use, and neurologic trend because arterial bleeding can expand rapidly after an apparently normal interval.",
      "Perform frequent Glasgow Coma Scale, pupil, speech, motor, and vital-sign checks because a new pupil asymmetry or falling consciousness can mark temporal-lobe herniation.",
      "Maintain cervical-spine precautions, oxygenation, ventilation, and ordered blood-pressure targets because hypoxia or hypotension adds preventable secondary brain injury.",
      "Keep the patient nothing by mouth, establish reliable vascular access, and prepare repeat computed tomography and emergency craniotomy because definitive evacuation may become time critical.",
      "Escalate immediately for decreasing Glasgow Coma Scale, ipsilateral fixed dilated pupil, contralateral weakness, repeated vomiting, seizure, or Cushing-pattern vital signs because these findings indicate enlarging mass effect and possible herniation."
    ], [
      "A lucid interval followed by increasing drowsiness",
      "New fixed or unequal pupil with opposite-side weakness",
      "Rapid Glasgow Coma Scale decline, seizure, or repeated vomiting",
      "Bradycardia with widening pulse pressure or irregular respirations"
    ], [
      "Explain that a person can briefly seem well while bleeding continues between the skull and dura, so observation and repeat imaging cannot be skipped.",
      "After discharge, seek emergency care for worsening headache, repeated vomiting, confusion, weakness, seizure, unusual sleepiness, or a new pupil difference."
    ]),
    card("Generalized tonic-clonic seizure", ["ncs-guidelines"], [
      "Protect the patient from injury, lower them safely, clear nearby hazards, and cushion the head without restraining limbs because forceful restraint can cause musculoskeletal injury without stopping the seizure.",
      "Turn the patient laterally when feasible, loosen restrictive clothing, provide suction and oxygen, and do not place anything in the mouth because secretions and loss of airway tone create aspiration and hypoxemia risk.",
      "Time the seizure and observe onset, symmetry, eye or head deviation, color, continence, and recovery because duration and focal features determine emergency treatment and diagnostic urgency.",
      "Check bedside glucose and obtain ordered electrolytes, medication levels, pregnancy testing, toxicology, or imaging because hypoglycemia, sodium disturbance, missed therapy, poisoning, and acute brain lesions require cause-specific treatment.",
      "Escalate immediately for seizure lasting five minutes, repeated seizures without recovery, pregnancy, trauma, persistent hypoxemia, focal deficit, or failure to regain consciousness because status epilepticus and secondary injury require rapid medication and airway support."
    ], [
      "Convulsion lasting five minutes or longer",
      "Repeated seizures without return to baseline",
      "Persistent hypoxemia, apnea, or aspiration",
      "New focal deficit, pregnancy, major trauma, or prolonged unresponsiveness"
    ], [
      "Teach witnesses to time the event, protect the head, turn the person on the side, avoid restraint or objects in the mouth, and call emergency services for prolonged or repeated seizures.",
      "Review medication adherence, sleep, alcohol or substance triggers, bathing and driving safety, and when a rescue medicine should be used if one is prescribed."
    ]),
    card("Myasthenic crisis", ["mgfa-emergency", "ers-ats-niv"], [
      "Assess speech length, cough strength, secretion handling, neck flexion, respiratory pattern, forced vital capacity, and negative inspiratory force serially because oxygen saturation may remain normal until neuromuscular ventilation is critically weak.",
      "Elevate the head, keep suction and bag-mask support ready, and minimize exhausting activity because bulbar weakness and fatigue increase aspiration and respiratory-arrest risk.",
      "Prepare noninvasive support only for a cooperative patient who can protect the airway and prepare early intubation for worsening bulbar or respiratory weakness because delayed airway control can turn a controlled procedure into an arrest.",
      "Review infection, surgery, missed therapy, magnesium, sedatives, neuromuscular blockers, and other exacerbating medicines because removing the trigger is essential to recovery.",
      "Escalate immediately for inability to count or speak, weak cough, pooling secretions, paradoxical breathing, declining respiratory measurements, hypercapnia, or altered consciousness because urgent intensive care, ventilation, intravenous immunoglobulin, or plasma exchange may be needed."
    ], [
      "Inability to handle secretions or protect the airway",
      "Paradoxical breathing, orthopnea, or rapidly shallow respirations",
      "Serial decline in forced vital capacity or inspiratory force",
      "Rising carbon dioxide, fatigue, or altered consciousness"
    ], [
      "Explain that myasthenic crisis is breathing-muscle weakness, so a normal early oxygen reading does not rule out danger and worsening speech or cough needs urgent care.",
      "Keep an updated medication and caution list, wear medical identification, and seek emergency help for new breathlessness, weak cough, choking, or rapidly worsening swallowing."
    ]),
    card("Drowning", ["aha-special-2025"], [
      "Ensure rescuer safety, remove the person from the water, and begin rescue breathing and cardiopulmonary resuscitation according to training because drowning arrest begins with hypoxia and ventilation is central to resuscitation.",
      "Provide high-concentration oxygen and assess airway, respiratory effort, breath sounds, saturation, temperature, circulation, and neurologic status because aspiration and lung injury can worsen after initial rescue.",
      "Remove wet clothing, prevent further heat loss, and rewarm in a controlled manner because hypothermia worsens coagulopathy and complicates rhythm and neurologic assessment.",
      "Maintain cervical-spine precautions only when trauma is suspected and avoid routine abdominal thrusts because unnecessary maneuvers delay ventilation and can provoke vomiting and aspiration.",
      "Escalate immediately for apnea, persistent hypoxemia, frothy sputum, increasing work of breathing, hypotension, arrhythmia, seizure, or decreasing consciousness because pulmonary edema, aspiration injury, and hypoxic brain injury can progress rapidly."
    ], [
      "Apnea, cardiac arrest, or persistent cyanosis",
      "Increasing oxygen need, crackles, or pink frothy sputum",
      "Hypotension, unstable rhythm, or severe hypothermia",
      "Seizure, confusion, or declining consciousness after rescue"
    ], [
      "Explain that a person who seems better can still develop breathing problems after aspiration, so emergency evaluation and observation are important after significant symptoms.",
      "Teach water barriers, close active supervision, life-jacket use, swimming skills, and cardiopulmonary-resuscitation training because prevention and early ventilation save lives."
    ]),
    card("Malignant hyperthermia", ["mhaus-crisis"], [
      "Stop volatile anesthetics and succinylcholine, call for the malignant-hyperthermia cart and expert help, and hyperventilate with high-flow oxygen because continued trigger exposure accelerates the hypermetabolic crisis.",
      "Administer and repeat dantrolene according to the crisis protocol while documenting response because dantrolene reduces uncontrolled skeletal-muscle calcium release, rigidity, heat production, and acidosis.",
      "Begin active cooling for marked hyperthermia and stop cooling as the target is reached because uncontrolled heat injures the brain and organs while overcooling can cause hypothermia.",
      "Monitor core temperature, end-tidal carbon dioxide, rhythm, blood gases, potassium, creatine kinase, glucose, coagulation, urine output, and urine color because hyperkalemia, rhabdomyolysis, acidosis, and disseminated coagulation can be lethal.",
      "Escalate immediately for rapidly rising carbon dioxide, masseter or generalized rigidity, ventricular arrhythmia, hyperkalemia, dark urine, severe acidosis, or recurrent fever because aggressive resuscitation and prolonged critical-care surveillance are required."
    ], [
      "Unexpected rapid rise in end-tidal carbon dioxide despite ventilation",
      "Generalized or masseter rigidity with tachycardia",
      "Rapid core-temperature rise, hyperkalemia, or severe acidosis",
      "Ventricular arrhythmia, dark urine, or recurrent crisis after initial control"
    ], [
      "Explain that malignant hyperthermia is an inherited anesthetic reaction rather than an ordinary fever, and affected relatives may also need evaluation.",
      "Teach the patient to wear medical identification, tell every anesthesia team before a procedure, and keep the MHAUS emergency information available."
    ]),
    card("Acetaminophen toxicity", ["acmt-nac-2026"], [
      "Determine the product, formulation, amount, time, repeated-use pattern, co-ingestants, weight, and self-harm intent because a single timed ingestion and staggered supratherapeutic exposure require different risk interpretation.",
      "Obtain the correctly timed acetaminophen concentration and trend aminotransferases, international normalized ratio, bilirubin, creatinine, glucose, lactate, and acid-base status because early symptoms may be mild while hepatic injury is evolving.",
      "Start prescribed acetylcysteine promptly when indicated and do not delay for a concentration when presentation is late or high risk because benefit is greatest early but continues after liver injury begins.",
      "Monitor for infusion reaction, vomiting, hypoglycemia, encephalopathy, bleeding, oliguria, and worsening acidosis because fulminant liver failure can impair glucose control, coagulation, brain function, and kidneys.",
      "Escalate immediately for rising international normalized ratio, worsening aminotransferases after therapy, hypoglycemia, confusion, acidosis, renal failure, shock, or detectable acetaminophen near planned completion because toxicology and transplant-center guidance may require extended treatment."
    ], [
      "Altered mental status, hypoglycemia, or signs of hepatic encephalopathy",
      "Rising international normalized ratio, lactate, or acidosis",
      "Oliguria or rapidly worsening creatinine",
      "Detectable acetaminophen or worsening liver tests near the end of acetylcysteine therapy"
    ], [
      "Teach patients to total acetaminophen from every prescription and over-the-counter product because combination cold and pain medicines can unintentionally duplicate the dose.",
      "Explain that feeling well early does not exclude liver injury, and any intentional ingestion or possible overdose needs immediate poison-center and emergency evaluation."
    ]),
    card("Cholinergic toxicity", ["aha-special-2025", "hhs-chemm-nerve-agent"], [
      "Protect staff with appropriate personal protective equipment and remove contaminated clothing with protocol-directed decontamination because secondary exposure can poison rescuers and spread the agent.",
      "Assess airway secretions, wheeze, respiratory effort, oxygenation, heart rate, pupils, mental status, fasciculations, and weakness because bronchorrhea, bronchospasm, and neuromuscular failure are the immediate lethal mechanisms.",
      "Suction aggressively, provide oxygen and assisted ventilation, and administer atropine as ordered until pulmonary secretions and ventilation improve because atropine reverses muscarinic airway and cardiovascular effects rather than simply normalizing pupil size.",
      "Administer prescribed pralidoxime early for significant organophosphate poisoning and benzodiazepine therapy for seizures because oxime reactivation becomes less effective after enzyme aging and seizures add brain injury.",
      "Escalate immediately for copious secretions, hypoxemia, bradycardia, seizures, progressive weakness, apnea, or recurrent symptoms after initial response because repeated antidote dosing and prolonged ventilatory support may be required."
    ], [
      "Copious bronchial secretions, wheeze, or rapidly falling oxygen saturation",
      "Bradycardia, hypotension, or unstable rhythm",
      "Seizure, coma, fasciculations, or progressive muscle weakness",
      "Apnea or recurrent cholinergic findings after apparent improvement"
    ], [
      "Explain that contaminated clothing and skin can keep exposing the patient and others, so follow responder instructions and do not carry contaminated belongings into a clean area.",
      "After recovery, review occupational or household pesticide safety and seek urgent care for recurrent sweating, diarrhea, secretions, weakness, breathing difficulty, or confusion."
    ]),
    card("Heparin bleeding", ["acc-heparin"], [
      "Stop the heparin infusion and all heparin-containing flushes when clinically directed, verify the last dose and route, and inspect every potential bleeding site because ongoing exposure can rapidly enlarge occult hemorrhage.",
      "Assess blood pressure, pulse, mentation, skin, urine, stool, emesis, wounds, drains, back or abdominal pain, and new headache because internal bleeding may appear first as shock, neurologic change, or unexplained pain.",
      "Obtain and trend hemoglobin, platelet count, activated partial thromboplastin time or anti-factor Xa level, fibrinogen, creatinine, and type and screen because severity, clearance, and concurrent thrombocytopenia guide reversal and transfusion.",
      "Administer prescribed protamine slowly with resuscitation equipment available and reassess coagulation and bleeding because protamine neutralizes unfractionated heparin but can cause hypotension, bradycardia, or anaphylactoid reactions.",
      "Escalate immediately for hemodynamic instability, severe headache or focal deficit, retroperitoneal pain, expanding hematoma, airway bleeding, rapidly falling hemoglobin, or persistent anticoagulant effect because urgent imaging, source control, and blood support may be lifesaving."
    ], [
      "Hypotension, syncope, tachycardia, or rapidly falling hemoglobin",
      "Severe headache, focal deficit, or decreasing consciousness",
      "Back, flank, abdominal, or groin pain suggesting concealed hemorrhage",
      "Airway bleeding, expanding hematoma, or continued bleeding after reversal"
    ], [
      "Teach the patient to report black stool, red urine, vomiting blood, prolonged bleeding, unusual bruising, severe headache, dizziness, or new weakness immediately.",
      "Explain that heparin may be restarted only after the team balances bleeding control against the reason anticoagulation was needed."
    ]),
    card("Pulmonary embolism after surgery", ["acc-pe-2026", "aha-special-2025"], [
      "Treat sudden dyspnea, pleuritic pain, tachycardia, syncope, hypoxemia, or unexplained postoperative hypotension as possible pulmonary embolism because surgery and immobility create a high-risk venous-thromboembolism setting.",
      "Apply oxygen, elevate the head, establish vascular access, obtain a 12-lead electrocardiogram, and prepare definitive imaging without unnecessary ambulation because exertion can worsen oxygen demand and unstable right-heart strain.",
      "Assess blood pressure, mental status, jugular venous pressure, chest pain, oxygen need, urine output, lactate, and signs of deep-vein thrombosis because shock and right-ventricular failure determine the urgency of advanced therapy.",
      "Administer prescribed anticoagulation after bleeding-risk review and monitor wounds, drains, hemoglobin, platelets, and anticoagulant effect because treatment prevents clot propagation but can worsen recent surgical bleeding.",
      "Escalate immediately for syncope, refractory hypoxemia, hypotension, rising lactate, chest pain with shock, or cardiac arrest because pulmonary embolism response-team evaluation for thrombolysis, thrombectomy, surgery, or circulatory support is time critical."
    ], [
      "Syncope, hypotension, or signs of obstructive shock",
      "Rapidly increasing oxygen requirement or severe respiratory distress",
      "New right-heart strain with rising lactate or oliguria",
      "Cardiac arrest or recurrent collapse after recent surgery"
    ], [
      "Explain that walking and prescribed compression or anticoagulant prevention lower clot risk, but new breathlessness, chest pain, coughing blood, or fainting requires emergency help.",
      "Review anticoagulant timing, bleeding precautions, incision observation, and the need to avoid stopping therapy without the treating team."
    ]),
    card("Postoperative hemorrhage", ["who-safe-surgery", "acs-trauma-best-practices"], [
      "Assess the incision, dressings, drains, body cavities, abdomen, pain, swelling, skin, pulse, blood pressure, mentation, and urine output because concealed postoperative bleeding may produce shock before blood is visible.",
      "Mark visible drainage, measure rather than estimate output, quantify cumulative loss, and compare the trend with operative expectations because a rising rate is more informative than a single soaked dressing.",
      "Notify the surgical team promptly, establish large-bore access, obtain complete blood count, coagulation studies, fibrinogen, metabolic panel, lactate, and type and crossmatch because reoperation or transfusion may be needed without delay.",
      "Hold anticoagulant or antiplatelet therapy only under urgent clinical direction and prepare ordered blood products or reversal because indiscriminate interruption can cause thrombosis while continued effect can sustain hemorrhage.",
      "Escalate immediately for rapidly expanding swelling, bright-red high-volume drain output, hypotension, tachycardia, oliguria, rigid abdomen, airway compression, or falling hemoglobin because active surgical bleeding requires emergency source control."
    ], [
      "Rapidly increasing bright-red drainage or expanding wound swelling",
      "Hypotension, tachycardia, cool skin, confusion, or oliguria",
      "Rigid or distended abdomen with increasing pain",
      "Neck swelling, stridor, or airway compromise after neck surgery"
    ], [
      "Teach the patient not to dismiss increasing drainage, swelling, dizziness, faintness, severe pain, black stool, or shortness of breath after surgery.",
      "Explain how to support the incision, follow activity restrictions, and contact the surgical team immediately rather than removing a saturated dressing repeatedly at home."
    ]),
    card("Chest trauma", ["acs-chest-wall-2025", "acs-trauma-best-practices"], [
      "Perform a trauma primary survey with cervical protection and inspect chest symmetry, wounds, paradoxical movement, tracheal position, breath sounds, oxygenation, and perfusion because tension pneumothorax and massive hemothorax can kill before imaging.",
      "Apply oxygen and prepare immediate decompression or chest-tube support when ordered because trapped air or blood can collapse a lung and obstruct venous return.",
      "Provide multimodal analgesia and reassess sedation, respiratory rate, cough, and inspiratory capacity because untreated rib pain causes splinting while excessive opioids worsen ventilation.",
      "Encourage ordered pulmonary hygiene, supported coughing, incentive spirometry, turning, and early mobility because atelectasis and retained secretions can progress to pneumonia and respiratory failure.",
      "Escalate immediately for absent unilateral breath sounds, worsening hypoxemia, hypotension, distended neck veins, tracheal deviation, increasing subcutaneous air, large bloody output, or respiratory fatigue because emergent thoracic intervention may be required."
    ], [
      "Absent unilateral breath sounds with hypotension or severe distress",
      "Rapidly increasing oxygen need, respiratory fatigue, or cyanosis",
      "Large or suddenly increased bloody chest-tube output",
      "New tracheal deviation, distended neck veins, or expanding subcutaneous emphysema"
    ], [
      "Explain that effective pain control and deep breathing protect the lungs; shallow breathing from pain can cause pneumonia even when the fractures themselves are stable.",
      "Seek urgent care after discharge for worsening breathlessness, fever, coughing blood, fainting, increasing chest pain, or new crackling swelling under the skin."
    ]),
    card("Crush injury", ["acs-trauma-best-practices", "aha-special-2025"], [
      "Activate trauma response and coordinate release of prolonged compression with resuscitation readiness because reperfusion can abruptly deliver potassium, acid, and myoglobin into the circulation.",
      "Establish vascular access and begin prescribed isotonic fluid before or during extrication when feasible because early renal perfusion helps limit pigment-related acute kidney injury.",
      "Place the patient on continuous cardiac monitoring and obtain serial potassium, calcium, bicarbonate, creatine kinase, creatinine, blood gases, and urine studies because hyperkalemia and rhabdomyolysis can evolve rapidly.",
      "Assess limb pain, swelling, firmness, pulses, capillary refill, sensation, and motor function repeatedly because compartment syndrome can threaten muscle and nerve even when a pulse remains present.",
      "Escalate immediately for peaked T waves, widening QRS, arrhythmia, rapidly rising potassium, dark scant urine, severe pain with passive stretch, tense compartments, shock, or acidosis because calcium, potassium-shifting therapy, fasciotomy, or dialysis may be urgently required."
    ], [
      "Peaked T waves, widening QRS, or unstable arrhythmia",
      "Dark urine, oliguria, or rapidly rising creatinine and creatine kinase",
      "Pain out of proportion, pain with passive stretch, or tense swelling",
      "Hypotension, severe acidosis, or sudden deterioration after release"
    ], [
      "Explain that dangerous electrolyte and kidney problems can appear when pressure is released, so monitoring must continue even if the limb initially looks intact.",
      "After discharge, report increasing swelling, weakness, numbness, dark urine, reduced urine, palpitations, or worsening pain immediately."
    ]),
    card("Inhalation burn injury", ["aba-burn-referral", "aha-special-2025"], [
      "Administer high-concentration oxygen and assess the fire setting, enclosed-space exposure, facial burns, soot, voice change, stridor, cough, and mental status because carbon monoxide, cyanide, and delayed airway edema may coexist.",
      "Prepare early expert airway control for progressive hoarseness, oral edema, stridor, or respiratory fatigue because swelling can make later intubation difficult or impossible.",
      "Obtain co-oximetry, blood gas, lactate, acid-base status, chest imaging, and serial respiratory assessment because standard pulse oximetry can appear reassuring in carbon monoxide poisoning.",
      "Provide humidified oxygen, pulmonary hygiene, suction, bronchodilator therapy, and ventilation as ordered because soot and chemical injury cause bronchospasm, mucosal sloughing, and airway obstruction.",
      "Escalate immediately for worsening voice, drooling, stridor, carbonaceous sputum, severe acidosis, confusion, refractory hypoxemia, or rising airway pressures because airway obstruction, toxic exposure, or acute lung injury is progressing."
    ], [
      "Progressive hoarseness, stridor, drooling, or facial and oral edema",
      "Confusion, syncope, severe acidosis, or high carbon monoxide exposure concern",
      "Carbonaceous sputum, wheeze, or rapidly increasing secretions",
      "Refractory hypoxemia or rising ventilator pressures"
    ], [
      "Explain that smoke can injure the airway and poison oxygen use even when skin burns look small or a pulse oximeter looks normal.",
      "After discharge, avoid smoke exposure and seek urgent care for worsening cough, hoarseness, breathlessness, confusion, chest pain, or dark sputum."
    ]),
    card("Full-thickness burn", ["aba-burn-referral"], [
      "Stop the burning process, remove nonadherent clothing and jewelry, and cover the wound with a clean dry material because retained heat and constricting items worsen tissue injury as edema develops.",
      "Estimate burn depth and total body surface area with an age-appropriate method and identify face, hands, feet, genital, perineal, joint, circumferential, electrical, chemical, or inhalation involvement because these features determine resuscitation and burn-center urgency.",
      "Establish vascular access through unburned skin when possible, begin ordered fluid resuscitation for major burns, and trend urine output and perfusion because capillary leak causes intravascular depletion despite visible edema.",
      "Assess distal pulses, capillary refill, sensation, movement, chest expansion, and compartment pressure cues in circumferential burns because inelastic eschar can impair limb perfusion or ventilation.",
      "Escalate immediately for airway findings, weak or absent distal signals, increasing limb pain or numbness, restricted chest movement, oliguria, shock, hypothermia, or electrical injury because escharotomy, advanced resuscitation, or burn-center transfer may be required."
    ], [
      "Face or neck burn with hoarseness, soot, stridor, or oral edema",
      "Circumferential burn with declining pulse, sensation, movement, or chest expansion",
      "Oliguria, hypotension, hypothermia, or worsening perfusion",
      "Full-thickness injury of hands, feet, face, genitalia, perineum, or a major joint"
    ], [
      "Explain that a deep burn can be painless because nerves are destroyed, so lack of pain does not mean the injury is minor.",
      "Review graft and dressing care, nutrition, range-of-motion therapy, scar protection, infection warning signs, and the need for burn-center follow-up."
    ]),
    card("Open fracture", ["east-open-fracture", "acs-trauma-best-practices"], [
      "Control life-threatening bleeding, cover the wound with a sterile saline-moistened dressing, and avoid probing or pushing exposed bone back because additional contamination and tissue injury increase infection risk.",
      "Immobilize the limb in the position found and assess pulses, capillary refill, color, temperature, sensation, and movement before and after splinting because vascular or nerve compromise can worsen with displacement.",
      "Administer prescribed intravenous antibiotics promptly and verify tetanus protection because bacterial inoculation occurs at injury and early prophylaxis reduces deep infection.",
      "Keep the patient nothing by mouth, establish access, manage pain, and prepare operative irrigation, debridement, and fixation because definitive wound and bone care is surgical.",
      "Escalate immediately for uncontrolled bleeding, absent pulse, increasing pain with passive stretch, tense swelling, new numbness or weakness, fever, foul drainage, or shock because vascular injury, compartment syndrome, or infection threatens limb and life."
    ], [
      "Uncontrolled hemorrhage or absent distal pulse",
      "Pain out of proportion, tense swelling, or pain with passive stretch",
      "New numbness, weakness, pallor, or coolness after splinting",
      "Fever, spreading redness, foul drainage, or systemic instability"
    ], [
      "Teach the patient not to touch, rinse deeply, or push exposed tissue back into the wound and to keep the dressing and splint undisturbed until evaluated.",
      "After repair, review antibiotic completion, pin or wound care, weight-bearing limits, neurovascular warning signs, and urgent reporting of fever or worsening drainage."
    ]),
    card("Severe preeclampsia", ["acog-hypertension"], [
      "Measure blood pressure with correct cuff and technique and assess severe headache, visual change, right-upper-quadrant pain, dyspnea, reflexes, clonus, mental status, and edema because severe endothelial injury can involve brain, liver, lungs, kidneys, and placenta.",
      "Place the patient in a low-stimulation environment with seizure precautions and administer prescribed magnesium sulfate because preventing eclampsia protects both maternal brain and fetal oxygenation.",
      "Monitor respirations, oxygen saturation, patellar reflexes, consciousness, urine output, magnesium level when ordered, and keep calcium rescue available because magnesium toxicity is more likely when kidney clearance falls.",
      "Administer prescribed urgent antihypertensive therapy and reassess blood pressure at protocol intervals because sustained severe pressure increases stroke, placental abruption, and cardiac failure risk.",
      "Escalate immediately for seizure, persistent severe blood pressure, new neurologic symptoms, pulmonary edema, oliguria, falling platelets, rising liver enzymes, fetal deterioration, or bleeding because maternal stabilization and expedited delivery may be required."
    ], [
      "Seizure, severe persistent headache, visual loss, or focal deficit",
      "Severe-range blood pressure that persists after treatment",
      "Dyspnea, crackles, low oxygen saturation, or pulmonary edema",
      "Oliguria, right-upper-quadrant pain, falling platelets, bleeding, or nonreassuring fetal status"
    ], [
      "Teach that severe headache, vision changes, upper abdominal pain, breathlessness, sudden swelling, bleeding, or reduced fetal movement require immediate evaluation during pregnancy and after birth.",
      "Explain that delivery treats the placental driver, but blood pressure and seizure risk can remain or first appear postpartum, so follow-up and medication adherence are essential."
    ]),
    card("Disseminated intravascular coagulation in obstetrics", ["acog-pph"], [
      "Activate the obstetric hemorrhage and massive-transfusion pathway while treating the trigger such as abruption, amniotic fluid embolism, sepsis, fetal demise, or severe preeclampsia because coagulation will not stabilize until the cause is controlled.",
      "Quantify blood loss and inspect intravenous sites, gums, urine, lochia, wounds, and skin while assessing uterine tone because diffuse oozing may be the earliest visible sign of consumed platelets and clotting factors.",
      "Monitor rapid serial complete blood count, fibrinogen, prothrombin time, activated partial thromboplastin time, metabolic panel, lactate, and blood gas while maintaining a current type and crossmatch because trends guide balanced component replacement rather than isolated red-cell transfusion.",
      "Administer warmed blood components and other prescribed hemostatic therapy while preventing hypothermia and monitoring calcium because dilution, cold, acidosis, and hypocalcemia worsen coagulopathy and cardiac instability.",
      "Escalate immediately for uncontrolled vaginal or surgical bleeding, rapidly falling fibrinogen or platelets, hypotension, oliguria, altered consciousness, respiratory distress, or fetal compromise because emergency delivery, surgery, and critical care may be lifesaving."
    ], [
      "Diffuse oozing from puncture sites with heavy obstetric bleeding",
      "Rapidly falling fibrinogen or platelets with prolonged coagulation tests",
      "Hypotension, rising lactate, oliguria, or altered mental status",
      "Pulmonary edema, severe hypoxemia, or nonreassuring fetal status"
    ], [
      "Explain to the family that obstetric DIC causes simultaneous abnormal clotting and bleeding because the body's clotting supplies are being consumed.",
      "After recovery, review the precipitating pregnancy complication, anemia follow-up, emotional support, and the need for early specialist planning in a future pregnancy."
    ]),
    card("Retained placenta", ["acog-pph"], [
      "Recognize failure of placental delivery or an incomplete placenta and quantify ongoing blood loss because retained tissue prevents firm uterine contraction and can cause rapid postpartum hemorrhage.",
      "Assess fundal tone, uterine position, lochia, blood pressure, pulse, pain, bladder distention, and shock index trends because visible blood may underestimate concealed or cumulative loss.",
      "Activate the postpartum-hemorrhage protocol, establish large-bore access, obtain blood studies and type and crossmatch, and administer ordered uterotonics when appropriate because resuscitation must proceed while removal is arranged.",
      "Keep the patient nothing by mouth, provide analgesia and emotional support, and prepare manual removal or operative management because definitive treatment requires complete placental removal and possible control of abnormal adherence.",
      "Escalate immediately for heavy bleeding, uterine inversion, hypotension, tachycardia, altered consciousness, inability to separate the placenta, or coagulopathy because placenta accreta spectrum, uterine injury, or massive hemorrhage may require surgery."
    ], [
      "Heavy ongoing bleeding with a placenta that has not delivered",
      "Hypotension, tachycardia, faintness, or altered consciousness",
      "Signs of uterine inversion or severe pelvic pain",
      "Failure of manual separation or concern for placenta accreta spectrum"
    ], [
      "Explain that retained placental tissue keeps the uterus from contracting effectively, so urgent removal prevents severe bleeding and later infection.",
      "After discharge, report fever, foul-smelling lochia, increasing pelvic pain, heavy bleeding, large clots, dizziness, or fainting immediately."
    ]),
    card("Group B strep sepsis", ["cdc-gbs-2025", "aha-neonatal-2025"], [
      "Assess the newborn for temperature instability, poor feeding, lethargy, irritability, apnea, grunting, tachypnea, color change, abnormal tone, and perfusion because early group B streptococcal sepsis may present subtly before rapid collapse.",
      "Obtain ordered blood culture and additional sepsis specimens without delaying prescribed empiric antibiotics because early effective therapy is critical and cultures allow later narrowing.",
      "Support airway, breathing, circulation, temperature, and glucose while establishing neonatal vascular access because sepsis increases oxygen and glucose demand while impairing perfusion.",
      "Monitor heart rate, respirations, oxygen saturation, blood pressure, capillary refill, urine output, lactate, glucose, blood counts, and culture response because shock, meningitis, and respiratory failure can evolve quickly.",
      "Escalate immediately for apnea, cyanosis, seizure, bulging fontanelle, persistent hypoglycemia, hypotension, poor perfusion, or decreasing responsiveness because intensive ventilation, vasoactive support, and meningitis evaluation may be required."
    ], [
      "Apnea, cyanosis, grunting, or increasing respiratory distress",
      "Hypotension, prolonged capillary refill, or reduced urine output",
      "Seizure, bulging fontanelle, or decreasing responsiveness",
      "Persistent hypoglycemia or temperature instability with poor feeding"
    ], [
      "Teach caregivers that newborn sepsis may look like poor feeding, unusual sleepiness, temperature change, fast breathing, color change, or pauses in breathing rather than a high fever.",
      "Explain the purpose of maternal screening and intrapartum antibiotics while emphasizing that any ill-appearing newborn still needs immediate evaluation."
    ]),
    card("Kernicterus", ["aap-bilirubin-2022"], [
      "Measure and plot total serum bilirubin by age in hours, gestational age, and neurotoxicity risk factors rather than relying on visual jaundice because skin color cannot determine a safe treatment threshold.",
      "Assess feeding, weight loss, hydration, urine and stool output, tone, cry, alertness, arching, gaze, and seizure activity because acute bilirubin encephalopathy progresses from subtle lethargy to irreversible neurologic injury.",
      "Begin prescribed intensive phototherapy promptly, maximize skin exposure safely, protect the eyes, and monitor temperature and hydration because effective light converts bilirubin into forms the infant can eliminate.",
      "Prepare escalation-level hydration, repeated bilirubin measurement, blood typing and hemolysis evaluation, and exchange transfusion when thresholds are approached because bilirubin can cross into the brain faster than routine follow-up allows.",
      "Escalate immediately for bilirubin at the escalation threshold, rapid rise despite phototherapy, poor suck, high-pitched cry, hypotonia or hypertonia, retrocollis, opisthotonos, fever, or seizure because emergency neonatal treatment is required to prevent permanent injury."
    ], [
      "Rapid bilirubin rise or level near the exchange-transfusion threshold",
      "Poor suck, lethargy, or high-pitched cry",
      "Abnormal tone, neck or back arching, or abnormal upward gaze",
      "Apnea, fever, seizure, or decreasing responsiveness"
    ], [
      "Explain that jaundice should be measured, not judged by appearance alone, and keep the exact bilirubin follow-up appointment after discharge.",
      "Teach caregivers to seek same-day care for worsening yellow color, poor feeding, fewer wet diapers, unusual sleepiness, a shrill cry, stiffness, limpness, arching, or fever."
    ]),
    card("Tracheoesophageal fistula", ["aha-neonatal-2025"], [
      "Stop oral feeding and place the newborn upright with the head elevated because swallowed milk and pooled secretions can pass into the airway and cause aspiration.",
      "Maintain continuous low-pressure suction of the upper esophageal pouch when ordered and clear oral secretions gently because reducing pooled fluid lowers aspiration and lung-injury risk.",
      "Assess coughing, choking, cyanosis, drooling, abdominal distention, respiratory effort, oxygen saturation, and breath sounds because fistula airflow can distend the stomach while secretions contaminate the lungs.",
      "Provide oxygen and ventilation with neonatal and surgical guidance while avoiding excessive bag-mask pressure when possible because positive pressure can drive gas through a distal fistula into the stomach and impair ventilation.",
      "Escalate immediately for recurrent cyanosis, apnea, increasing oxygen need, severe abdominal distention, aspiration signs, or inability to manage secretions because urgent airway stabilization and surgical repair planning are required."
    ], [
      "Coughing, choking, or cyanosis with attempted feeding",
      "Apnea or rapidly increasing oxygen requirement",
      "Severe abdominal distention that impairs breathing",
      "Copious secretions or suspected aspiration pneumonia"
    ], [
      "Explain that feeding is withheld to protect the lungs until the abnormal airway-esophagus connection is repaired, while nutrition and hydration are provided another way.",
      "After repair, teach the family to report choking, recurrent cough, breathing difficulty, poor weight gain, food sticking, or repeated chest infections because stricture, reflux, and airway problems can persist."
    ]),
    card("Pericardial effusion", ["esc-pericardial-2025"], [
      "Assess chest discomfort, dyspnea, orthopnea, heart sounds, jugular venous pressure, blood pressure, pulse pressure, pulsus paradoxus, perfusion, and urine output because rapid fluid accumulation can compress the heart before the effusion appears very large.",
      "Maintain continuous rhythm and hemodynamic monitoring and trend echocardiographic findings because increasing right-sided chamber collapse and respiratory variation can signal evolving tamponade.",
      "Position for comfort, provide oxygen, establish vascular access, and avoid unnecessary preload reduction when tamponade is suspected because aggressive diuresis or vasodilation can worsen obstructed cardiac filling.",
      "Prepare sterile equipment, laboratory specimens, and post-procedure monitoring for pericardiocentesis or surgical drainage because removing pressurized fluid restores ventricular filling and cardiac output.",
      "Escalate immediately for hypotension, narrowing pulse pressure, rising jugular venous pressure, tachycardia, muffled heart sounds, syncope, oliguria, or worsening dyspnea because cardiac tamponade requires urgent drainage."
    ], [
      "Hypotension with narrowing pulse pressure and tachycardia",
      "Rising jugular venous pressure with worsening dyspnea",
      "Syncope, altered mental status, cool skin, or oliguria",
      "Echocardiographic chamber collapse or rapidly enlarging effusion"
    ], [
      "Explain that the danger depends on how quickly fluid collects around the heart, not only the measured size, so symptom changes need prompt reassessment.",
      "Report fainting, increasing breathlessness, chest pressure, rapid heartbeat, or new swelling urgently and keep planned echocardiography and cause-specific follow-up."
    ]),
    card("Right ventricular infarction", ["acc-acs-2025", "acc-cardiogenic-shock-2025"], [
      "Obtain right-sided electrocardiogram leads and assess inferior-infarction findings because right-ventricular involvement changes preload, medication, and shock management.",
      "Assess jugular venous pressure, clear or wet lung sounds, blood pressure, mentation, skin, urine output, and peripheral perfusion because right-ventricular failure can cause severe low output with relatively clear lungs.",
      "Maintain continuous rhythm monitoring and prepare pacing or resuscitation because right-coronary ischemia can produce bradycardia, atrioventricular block, and sudden hemodynamic collapse.",
      "Administer ordered reperfusion and carefully titrated fluid or vasoactive support with repeated lung and perfusion checks because the injured right ventricle may be preload dependent yet can still become overloaded.",
      "Escalate immediately for hypotension, syncope, rising jugular venous pressure, new crackles during fluid, advanced heart block, recurrent ischemic pain, or oliguria because urgent reperfusion and shock support are required."
    ], [
      "Hypotension with elevated neck veins and relatively clear lungs",
      "New bradycardia or advanced atrioventricular block",
      "Recurrent chest pain, ST-segment change, or ventricular arrhythmia",
      "New pulmonary crackles or worsening hypoxemia during preload support"
    ], [
      "Explain that a right-sided heart attack impairs blood delivery to the left heart, so fluids and blood-pressure medicines must be adjusted carefully rather than used automatically.",
      "After stabilization, reinforce cardiac rehabilitation, medication adherence, and emergency evaluation for recurrent chest discomfort, fainting, severe weakness, or breathlessness."
    ]),
    card("R-on-T phenomenon", ["aha-als-2025"], [
      "Recognize a premature ventricular complex falling on the preceding T wave and assess the patient immediately because stimulation during vulnerable repolarization can trigger polymorphic ventricular tachycardia or ventricular fibrillation.",
      "Place defibrillation pads, verify vascular access, and keep resuscitation equipment ready because deterioration from a warning beat to a pulseless rhythm may be abrupt.",
      "Review the electrocardiogram for QT prolongation, ischemia, bradycardia, pacing spikes, and frequent ectopy because identifying the substrate guides prevention of recurrent malignant rhythm.",
      "Check potassium, magnesium, calcium, oxygenation, acid-base status, and QT-prolonging medicines and correct ordered abnormalities because electrolyte and repolarization disturbances increase ventricular vulnerability.",
      "Escalate immediately for syncope, chest pain, hypotension, increasing R-on-T ectopy, runs of polymorphic ventricular tachycardia, loss of pulse, or ventricular fibrillation because immediate defibrillation and cause correction are time critical."
    ], [
      "Syncope or hypotension with ventricular ectopy",
      "Increasing premature beats landing on the T wave",
      "Polymorphic ventricular tachycardia or rapidly changing wide-complex rhythm",
      "Loss of pulse or ventricular fibrillation"
    ], [
      "Explain that this is an electrical timing warning rather than a symptom the patient can reliably feel, which is why continuous monitoring and electrolyte correction matter.",
      "Review prescribed rhythm medicines, electrolyte follow-up, and urgent reporting of fainting, sustained palpitations, chest pain, or near-syncope."
    ]),
    card("Systolic heart failure", ["acc-hf-2022"], [
      "Assess dyspnea, orthopnea, lung sounds, jugular venous pressure, edema, weight, blood pressure, rhythm, perfusion, and functional change because reduced ejection and congestion affect both lungs and organ blood flow.",
      "Measure daily weight on the same scale and track intake, output, urine response, and edema because weight trend detects retained fluid earlier and more reliably than appearance alone.",
      "Administer prescribed diuretic and guideline-directed heart-failure medicines while monitoring blood pressure, potassium, magnesium, and kidney function because therapies improve congestion and remodeling but can cause hypotension or electrolyte injury.",
      "Reconcile sodium, fluid, nonsteroidal anti-inflammatory drug, and adherence risks and coordinate pharmacy and heart-failure follow-up because common self-management barriers precipitate preventable decompensation.",
      "Escalate immediately for pink frothy sputum, rapidly rising oxygen need, hypotension with cool skin, new confusion, oliguria, syncope, chest pain, or sustained arrhythmia because pulmonary edema or cardiogenic shock may be developing."
    ], [
      "Pink frothy sputum or rapidly worsening pulmonary edema",
      "Hypotension with cool skin, confusion, or oliguria",
      "New chest pain, syncope, or sustained arrhythmia",
      "Rapid weight gain with severe orthopnea despite prescribed diuretic"
    ], [
      "Teach daily weight, symptom and swelling checks, the individualized sodium and fluid plan, and the exact weight or breathing change that should trigger a call.",
      "Explain that feeling better does not mean heart-failure medicines should be stopped; many protect the heart over time even when they do not produce an immediate sensation."
    ]),
    card("Aortic regurgitation", ["acc-valve-2020"], [
      "Assess exertional dyspnea, orthopnea, chest discomfort, palpitations, fatigue, pulse quality, pulse pressure, murmur, lung sounds, and edema because chronic volume overload can remain compensated until left-ventricular dilation and failure develop.",
      "Trend blood pressure, rhythm, oxygenation, functional tolerance, and echocardiographic ventricular size and ejection fraction because symptom and remodeling progression determine intervention timing.",
      "Administer prescribed afterload-reducing and heart-failure therapy while monitoring pressure and kidney function because lowering excessive resistance can improve forward flow but hypotension reduces coronary and organ perfusion.",
      "Recognize acute severe regurgitation after infection, dissection, trauma, or valve complication as an emergency because the nondilated ventricle cannot accommodate sudden backflow and pulmonary edema can develop rapidly.",
      "Escalate immediately for new pulmonary edema, hypotension, severe chest or back pain, fever with embolic signs, syncope, rapidly worsening dyspnea, or declining ejection fraction because urgent valve and aortic evaluation may be required."
    ], [
      "Acute severe dyspnea, pulmonary edema, or hypotension",
      "Sudden chest or back pain suggesting aortic dissection",
      "Fever, new murmur change, or embolic findings suggesting endocarditis",
      "Syncope or rapidly declining exercise tolerance and ventricular function"
    ], [
      "Teach the patient to track exercise tolerance, breathlessness, swelling, and palpitations because symptom change may show the ventricle is no longer compensating.",
      "Keep echocardiography and cardiology follow-up even when symptoms are mild, and seek emergency care for sudden severe breathlessness, fainting, or chest and back pain."
    ]),
    card("Peripheral artery disease", ["acc-pad-2024"], [
      "Assess exertional leg symptoms, rest pain, skin color and temperature, capillary refill, pulses, wounds, sensation, and motor function because progressive ischemia may become limb threatening before tissue loss is extensive.",
      "Inspect both feet and between toes at every high-risk encounter and protect pressure points because neuropathy and low blood flow can hide small injuries until infection or necrosis develops.",
      "Administer prescribed antiplatelet, lipid-lowering, blood-pressure, and diabetes therapy and reinforce tobacco cessation because PAD signals systemic atherosclerosis and high myocardial infarction and stroke risk.",
      "Support structured walking exercise when the limb is stable and follow wound off-loading and vascular plans because repeated supervised activity improves collateral function while pressure on an ulcer prevents healing.",
      "Escalate immediately for sudden pain, pallor, pulselessness, coolness, paresthesia, paralysis, new rest pain, gangrene, or infected ischemic ulcer because acute limb ischemia and chronic limb-threatening ischemia require urgent revascularization assessment."
    ], [
      "Sudden painful, pale, cool, pulseless limb",
      "New numbness, weakness, or paralysis",
      "Rest pain, gangrene, or a nonhealing ischemic wound",
      "Spreading foot infection, fever, or systemic instability"
    ], [
      "Teach daily foot inspection, well-fitting footwear, safe nail and skin care, smoking cessation, and avoidance of heating pads because reduced sensation and flow make burns and wounds harder to heal.",
      "Explain that walking pain is a circulation warning and that sudden limb change, rest pain, black tissue, or an infected wound needs urgent care."
    ]),
    card("Hypoxemia", ["aha-als-2025", "ats-oxygen"], [
      "Verify the saturation waveform and probe placement while assessing respiratory effort, breath sounds, circulation, color, and mental status because artifact or poor perfusion can mislead and the patient matters more than one number.",
      "Position the airway and administer oxygen to the prescribed target while preparing ventilation support because hypoxemia reduces oxygen available for the brain, heart, and other organs.",
      "Identify the mechanism through airway examination, chest findings, blood gas, imaging, hemoglobin, and response to oxygen because hypoventilation, ventilation-perfusion mismatch, shunt, diffusion failure, and low inspired oxygen require different treatment.",
      "Trend saturation, blood gas when indicated, carbon dioxide, work of breathing, heart rhythm, and consciousness after each intervention because a better saturation can coexist with worsening carbon dioxide retention or fatigue.",
      "Escalate immediately for refractory low saturation, cyanosis, confusion, chest pain, hypotension, silent chest, severe fatigue, or apnea because advanced airway, ventilatory, or cause-specific rescue is required."
    ], [
      "Refractory low oxygen despite increasing support",
      "Cyanosis, confusion, seizure, or decreasing consciousness",
      "Silent chest, severe fatigue, or apnea",
      "Chest pain, hypotension, or unstable rhythm with low oxygen"
    ], [
      "Explain that hypoxemia means low oxygen in arterial blood, while a normal pulse-oximeter reading can still be misleading in poor perfusion or carbon monoxide exposure.",
      "Use oxygen exactly as prescribed, keep equipment away from flames and smoking, and seek urgent care for severe breathlessness, blue lips, confusion, fainting, or failure of the rescue plan."
    ]),
    card("Chronic respiratory failure", ["ats-oxygen", "ers-ats-niv"], [
      "Establish the patient's baseline oxygen, carbon dioxide, mental status, breathing pattern, activity tolerance, and home support because chronic compensation makes trend away from baseline more useful than a single abnormal value.",
      "Titrate oxygen to the individualized target and verify delivery equipment because both untreated hypoxemia and excessive unmonitored oxygen in susceptible carbon-dioxide retainers can cause harm.",
      "Assess for infection, bronchospasm, heart failure, sedatives, mucus retention, aspiration, or equipment failure because a reversible trigger often explains acute-on-chronic deterioration.",
      "Trend blood gases when indicated, bicarbonate, respiratory rate, work of breathing, sleepiness, cough strength, nutrition, and response to noninvasive ventilation because rising carbon dioxide and fatigue may precede arrest.",
      "Escalate immediately for new confusion, inability to stay awake, rapidly increasing oxygen need, worsening acidosis, ineffective cough, severe breathlessness, cyanosis, or failure of home noninvasive support because acute ventilation or airway management may be required."
    ], [
      "New somnolence, confusion, or headache with rising carbon dioxide",
      "Rapid increase above baseline oxygen requirement",
      "Worsening acidosis, respiratory fatigue, or ineffective cough",
      "Cyanosis, apnea, or inability to tolerate prescribed ventilatory support"
    ], [
      "Teach the patient and family the personal baseline, oxygen target, equipment checks, airway-clearance plan, and exact signs of acute-on-chronic failure.",
      "Never change oxygen or sedating medicines without guidance, avoid smoking around oxygen, and seek emergency care for unusual sleepiness, blue color, or rapidly worsening breathing."
    ]),
    card("Cancer-related hypercalcemia", ["endocrine-hypercalcemia"], [
      "Assess confusion, lethargy, weakness, constipation, nausea, thirst, polyuria, dehydration, bone pain, and rhythm change because severe calcium elevation affects brain, gut, kidneys, muscle, and cardiac conduction.",
      "Begin prescribed isotonic hydration with repeated lung, edema, blood-pressure, and urine-output assessment because volume depletion reduces renal calcium clearance while excessive fluid can worsen heart or kidney failure.",
      "Administer ordered calcitonin for rapid temporary effect and antiresorptive therapy for sustained control because calcitonin works quickly but loses effectiveness while bisphosphonate or denosumab onset is slower.",
      "Trend corrected or ionized calcium, creatinine, magnesium, phosphate, potassium, electrocardiogram, fluid balance, and mental status because treatment can expose electrolyte shifts and kidney injury.",
      "Escalate immediately for severe confusion, seizure, coma, dysrhythmia, calcium above the severe threshold, oliguria, refractory vomiting, or worsening despite therapy because intensive treatment, dialysis, and urgent oncology-endocrine coordination may be required."
    ], [
      "Severe confusion, seizure, stupor, or coma",
      "Shortened QT with dysrhythmia or hemodynamic instability",
      "Oliguria, acute kidney injury, or inability to tolerate hydration",
      "Persistent severe calcium elevation despite initial therapy"
    ], [
      "Explain that cancer can release calcium from bone or alter calcium signals, causing dehydration and confusion that require treatment rather than being assumed to be cancer fatigue.",
      "Maintain the prescribed hydration plan and report increasing sleepiness, constipation, vomiting, weakness, reduced urine, palpitations, or confusion promptly."
    ]),
    card("Hemophilia A", ["wfh-hemophilia"], [
      "Treat suspected serious bleeding promptly with the prescribed factor VIII or bypassing plan and notify the hemophilia team because delay allows blood to expand into joints, muscle, brain, airway, or abdomen.",
      "Assess pain, swelling, warmth, range of motion, neurovascular status, headache, neurologic change, abdominal or back pain, urine, stool, and oral bleeding because internal hemorrhage may be hidden.",
      "Avoid intramuscular injections, rectal procedures, aspirin, and nonsteroidal anti-inflammatory drugs unless specifically directed because tissue trauma and platelet inhibition increase bleeding.",
      "Apply prolonged gentle pressure after venipuncture, use the smallest suitable needle, and protect an affected joint with ordered rest and rehabilitation because local care limits rebleeding without causing stiffness.",
      "Escalate immediately for any head, neck, throat, chest, abdominal, gastrointestinal, iliopsoas, or uncontrolled bleeding; neurologic change; airway symptoms; or failure to respond to usual factor because urgent imaging and inhibitor-directed therapy may be required."
    ], [
      "Any head injury, severe headache, vomiting, or neurologic change",
      "Neck or throat swelling, voice change, or breathing difficulty",
      "Abdominal, back, hip, or groin pain suggesting deep bleeding",
      "Bleeding that continues despite the usual factor plan"
    ], [
      "Teach the patient to carry factor and an emergency treatment plan, wear medical identification, and treat serious suspected bleeding before waiting for visible bruising.",
      "Use protective activity planning and approved pain medicines, maintain dental care, and contact the hemophilia center before procedures or when usual factor stops working."
    ]),
    card("Refeeding syndrome", ["aspen-refeeding"], [
      "Screen for prolonged low intake, major weight loss, low body mass, alcohol use, cancer, malabsorption, or baseline electrolyte depletion before nutrition begins because insulin-driven shifts can rapidly lower phosphate, potassium, and magnesium.",
      "Obtain baseline phosphate, potassium, magnesium, glucose, renal function, fluid status, and electrocardiogram when risk is high because hidden depletion may become dangerous after carbohydrate delivery starts.",
      "Administer prescribed thiamine before and during early feeding and advance calories cautiously according to the nutrition plan because thiamine demand and insulin rise abruptly during renewed carbohydrate metabolism.",
      "Monitor electrolytes at the ordered high-risk interval, daily weight, intake and output, edema, respiratory strength, heart rate, rhythm, neurologic status, and glucose because fluid retention and electrolyte collapse can cause heart failure, paralysis, seizure, or arrhythmia.",
      "Escalate immediately for rapidly falling phosphate, potassium, or magnesium; edema with dyspnea; weakness; delirium; seizure; or dysrhythmia because feeding may need to pause or slow while electrolytes and organ support are corrected."
    ], [
      "Rapid phosphate, potassium, or magnesium decline after feeding starts",
      "New edema, crackles, tachycardia, or heart failure",
      "Respiratory weakness, paresthesia, delirium, or seizure",
      "QT change or any new dysrhythmia"
    ], [
      "Explain that nutrition is essential but must restart gradually after starvation because the body's electrolytes and vitamins need time to adapt safely.",
      "Report swelling, shortness of breath, severe weakness, confusion, tremor, palpitations, or reduced urine during the first days of refeeding."
    ]),
    card("Type 1 diabetes in children", ["ada-children-2026"], [
      "Match insulin to the child's prescribed carbohydrate, correction, activity, and illness plan and independently verify doses when required because children have small dose margins and need insulin continuously to prevent ketosis.",
      "Monitor glucose with continuous glucose monitoring when available and confirm unexpected readings by finger-stick because compression, lag, or device failure can produce a value that does not fit the child.",
      "Assess ketones during illness, vomiting, persistent hyperglycemia, or pump interruption because absent insulin can progress to diabetic ketoacidosis even when little food is eaten.",
      "Keep rapid carbohydrate, glucagon, and an age-appropriate hypoglycemia plan available at home, school, sports, and sleep because young children may not recognize or communicate falling glucose.",
      "Escalate immediately for severe hypoglycemia, seizure, inability to swallow, repeated vomiting, moderate or large ketones, deep breathing, abdominal pain, dehydration, or altered consciousness because emergency glucose or diabetic-ketoacidosis treatment may be required."
    ], [
      "Seizure, unconsciousness, or inability to take oral carbohydrate",
      "Repeated vomiting with ketones or inability to keep fluids down",
      "Deep rapid breathing, abdominal pain, dehydration, or fruity breath",
      "Persistent extreme glucose after correction or suspected pump failure"
    ], [
      "Teach every caregiver how to give insulin, check glucose and ketones, treat low glucose, use glucagon, and follow the child's written sick-day and school plan.",
      "Explain that basal insulin is generally still needed during illness even when appetite is poor; contact the diabetes team rather than omitting it."
    ]),
    card("Diabetic foot ulcer", ["ada-foot-2026", "acc-pad-2024"], [
      "Inspect and measure the ulcer, drainage, odor, surrounding skin, callus, depth, temperature, and exposed tissue at each assessment because change in size or depth reveals healing failure and infection progression.",
      "Assess pulses, capillary refill, skin temperature, sensation, deformity, and vascular studies when ordered because neuropathy hides trauma while ischemia prevents antibiotics and tissue repair from reaching the wound effectively.",
      "Implement prescribed off-loading and verify that footwear or devices are actually used because repeated pressure and shear reopen tissue with every step.",
      "Perform ordered cleansing and dressings with infection precautions and monitor glucose, nutrition, renal function, cultures, and antimicrobial response because hyperglycemia and systemic illness impair immune and wound healing.",
      "Escalate immediately for spreading redness, crepitus, foul drainage, fever, systemic instability, black tissue, new rest pain, exposed bone, or rapidly increasing depth because deep infection, osteomyelitis, necrosis, or limb-threatening ischemia may require urgent surgery."
    ], [
      "Spreading erythema, crepitus, foul drainage, fever, or sepsis",
      "Black tissue, cool foot, new rest pain, or absent pulses",
      "Exposed or probe-to-bone finding suggesting osteomyelitis",
      "Rapid ulcer expansion or failure to improve with pressure relief"
    ], [
      "Teach daily foot and shoe inspection with a mirror, no barefoot walking, safe nail and skin care, glucose management, and immediate reporting of any blister or skin break.",
      "Explain that lack of pain can mean nerve damage rather than healing, so off-loading and scheduled wound and vascular follow-up remain essential."
    ]),
    card("Volvulus", ["ascrs-volvulus-2021"], [
      "Assess sudden distention, pain pattern, vomiting, obstipation, bowel sounds, tenderness, peritoneal signs, vital signs, and prior episodes because twisted bowel can progress from obstruction to ischemia and perforation.",
      "Keep the patient nothing by mouth, establish vascular access, administer ordered fluids and electrolyte correction, and place decompression as directed because obstruction causes vomiting, third spacing, and aspiration risk.",
      "Obtain ordered abdominal imaging and trend white blood cell count, lactate, acid-base status, renal function, and pain because rising lactate or free air suggests compromised bowel rather than uncomplicated obstruction.",
      "Prepare urgent endoscopic detorsion for stable sigmoid volvulus or surgery for cecal volvulus, ischemia, perforation, peritonitis, or failed decompression because restoring patency without addressing nonviable bowel is unsafe.",
      "Escalate immediately for continuous severe pain, guarding, rebound, fever, shock, rising lactate, bloody stool, free air, or sudden pain relief with deterioration because necrosis or perforation requires emergency operation."
    ], [
      "Peritoneal rigidity, rebound, or continuous severe pain",
      "Hypotension, fever, rising lactate, or metabolic acidosis",
      "Bloody stool or imaging evidence of ischemia or free air",
      "Failed decompression or recurrent obstruction with worsening distention"
    ], [
      "Explain that untwisting relieves the immediate blockage but recurrence is common, so definitive surgical follow-up may still be recommended.",
      "Seek emergency care for recurrent severe distention, inability to pass stool or gas, persistent vomiting, bloody stool, fever, or worsening abdominal pain."
    ]),
    card("Dysphagia", ["asge-dysphagia"], [
      "Screen swallowing before oral food, fluid, or medication when neurologic or structural dysphagia is suspected because an unrecognized unsafe swallow can send material into the airway.",
      "Keep the patient nothing by mouth and provide oral care until the ordered swallowing evaluation defines a safe plan because saliva and bacterial burden also contribute to aspiration pneumonia.",
      "Position fully upright, use the prescribed texture, pacing, bite and sip size, and supervision, and keep upright after meals because individualized mechanics reduce residue and aspiration.",
      "Monitor voice quality, cough, oxygen saturation, respiratory rate, lung sounds, temperature, hydration, weight, and meal completion because silent aspiration, dehydration, and malnutrition may occur without dramatic choking.",
      "Escalate immediately for inability to handle secretions, stridor, cyanosis, acute food impaction, recurrent coughing with desaturation, fever with new lung findings, or rapidly progressive swallowing difficulty because airway obstruction, aspiration, or malignancy may require urgent intervention."
    ], [
      "Stridor, cyanosis, or inability to handle secretions",
      "Complete food impaction or inability to swallow liquids",
      "Coughing with desaturation or new wet voice after swallowing",
      "Fever, hypoxemia, or focal lung findings suggesting aspiration pneumonia"
    ], [
      "Teach the exact recommended texture, posture, pacing, and medication method rather than using a generic thickened diet without reassessment.",
      "Report food sticking, weight loss, painful swallowing, recurrent chest infection, coughing during meals, or rapidly worsening swallowing promptly."
    ]),
    card("Evisceration", ["who-safe-surgery"], [
      "Call the surgical team and emergency response immediately for evisceration, keep the patient in bed with knees slightly flexed, maintain nothing-by-mouth status, and prepare blood products because exposed abdominal contents and hemorrhage require urgent operative repair.",
      "Cover eviscerated organs with sterile gauze moistened with warm isotonic saline, administer prescribed antibiotic prophylaxis, and never push tissue back because dryness, contamination, and manipulation can cause ischemia and infection.",
      "Reduce coughing, straining, and abdominal pressure while providing prescribed analgesia and antiemetic therapy because further pressure can enlarge the eviscerated fascial separation and injure bowel.",
      "Monitor blood pressure, pulse, oxygenation, pain, eviscerated tissue color, drainage, temperature, mental status, urine output, hemoglobin, and lactate because fluid loss, ischemia, infection, and shock can develop.",
      "Escalate immediately for dusky or dry eviscerated bowel, uncontrolled bleeding, severe pain, hypotension, fever, altered consciousness, or expanding dehiscence and prepare transfusion support because strangulation, necrosis, sepsis, or hemorrhage demands immediate surgery."
    ], [
      "Visible abdominal organs through a surgical incision",
      "Dusky, dry, bleeding, or increasingly swollen exposed tissue",
      "Hypotension, tachycardia, fever, or altered consciousness",
      "Sudden wound opening after a pop with increased drainage"
    ], [
      "Teach the patient to support the incision during coughing, follow lifting limits, and report a sudden pop, new bulge, or pink drainage rather than trying to inspect or replace tissue.",
      "Explain that moist sterile coverage protects the organs temporarily, but definitive treatment is emergency surgical repair."
    ]),
    card("Peritonsillar abscess", ["idsa-gas-2025"], [
      "Assess airway patency, drooling, muffled voice, trismus, unilateral swelling, uvular deviation, neck movement, hydration, and respiratory effort because deep swelling can obstruct the airway or spread into neck spaces.",
      "Keep the patient upright and nothing by mouth while maintaining suction and difficult-airway equipment nearby because secretions and procedural drainage can compromise an already narrowed airway.",
      "Establish vascular access and administer prescribed antibiotics, fluids, analgesia, and corticosteroid when indicated because infection, poor intake, and edema reinforce one another.",
      "Prepare otolaryngology drainage and obtain cultures when directed because a mature pus collection usually requires source control rather than antibiotics alone.",
      "Escalate immediately for stridor, inability to handle secretions, rapidly increasing neck swelling, toxic appearance, chest pain, crepitus, hypotension, or worsening trismus because airway obstruction, deep-neck spread, or mediastinitis may be developing."
    ], [
      "Stridor, drooling, or inability to handle secretions",
      "Rapidly increasing neck swelling or respiratory distress",
      "Toxic appearance, hypotension, or altered mental status",
      "Chest pain, crepitus, or severe neck stiffness suggesting deep spread"
    ], [
      "Teach the patient to complete antibiotics, hydrate as tolerated after clearance, and return immediately for breathing difficulty, drooling, increasing swelling, or inability to drink.",
      "Explain that drainage removes trapped infection and that recurrent abscess or repeated tonsillitis may require specialist follow-up."
    ]),
    card("Stimulant intoxication", ["aha-special-2025"], [
      "Use a calm low-stimulation setting while assessing airway, breathing, circulation, temperature, agitation, chest pain, neurologic status, and trauma because sympathomimetic excess can cause hyperthermia, ischemia, seizure, and excited delirium.",
      "Place the patient on continuous rhythm, blood-pressure, oxygen, and temperature monitoring and obtain a 12-lead electrocardiogram because cocaine, amphetamines, and related agents can trigger coronary vasospasm and malignant arrhythmia.",
      "Administer prescribed benzodiazepine therapy and active cooling while correcting glucose and electrolytes because reducing central adrenergic drive treats agitation, hypertension, seizure, and heat production together.",
      "Trend creatine kinase, potassium, creatinine, acid-base status, troponin, urine output, and urine color because prolonged agitation and hyperthermia can cause rhabdomyolysis, kidney injury, and myocardial damage.",
      "Escalate immediately for severe hyperthermia, seizure, chest pain with ischemic change, aortic-type pain, focal deficit, refractory hypertension, wide-complex rhythm, shock, or coma because critical toxicology and cardiovascular rescue are required."
    ], [
      "Severe hyperthermia, rigidity, or rapidly worsening agitation",
      "Seizure, focal deficit, severe headache, or coma",
      "Chest pain, ischemic electrocardiogram change, or severe tearing pain",
      "Wide-complex rhythm, refractory hypertension, hypotension, or shock"
    ], [
      "Explain that stimulant toxicity can injure the heart, brain, muscles, and kidneys even after agitation improves, so observation and laboratory follow-up may be needed.",
      "Use nonjudgmental harm-reduction counseling, avoid mixing stimulants with other substances, and seek emergency help for chest pain, overheating, seizure, severe headache, or confusion."
    ]),
    card("Extrapyramidal symptoms", ["apa-schizophrenia"], [
      "Identify the movement pattern and timing after medication exposure because acute dystonia, akathisia, drug-induced parkinsonism, and tardive dyskinesia require different responses.",
      "Assess airway, voice, swallowing, neck and jaw spasm, eye deviation, rigidity, restlessness, tremor, gait, and vital signs because laryngeal dystonia can obstruct breathing and severe rigidity may indicate a broader emergency.",
      "Hold or clarify the suspected medicine according to urgent orders and administer the prescribed syndrome-specific treatment because anticholinergic rescue helps acute dystonia or parkinsonism but may not treat akathisia or tardive dyskinesia.",
      "Use a standardized movement scale and document baseline, distribution, functional impact, and response because subtle chronic abnormal movements are otherwise missed until they become persistent.",
      "Escalate immediately for stridor, tongue or neck spasm with airway difficulty, fever with severe generalized rigidity, autonomic instability, altered consciousness, inability to remain safe, or new severe dysphagia because laryngeal dystonia or neuroleptic malignant syndrome may be present."
    ], [
      "Stridor or tongue, jaw, or neck spasm impairing airway",
      "Fever, severe rigidity, autonomic instability, or confusion",
      "New severe dysphagia or aspiration",
      "Extreme akathisia with suicidality or inability to remain safe"
    ], [
      "Teach patients to report restlessness, stiffness, tremor, jaw or tongue movement, swallowing trouble, or eye and neck spasm early rather than stopping medication abruptly alone.",
      "Explain that regular movement screening helps distinguish treatable adverse effects from psychiatric symptoms and guides safer medication adjustment."
    ]),
    card("HIV infection", ["nih-hiv-2026"], [
      "Confirm the HIV antiretroviral regimen, last doses, adherence barriers, resistance history, allergies, pregnancy potential, and all medicines or supplements, including calcium or magnesium products, because interruptions and chelation or other interactions can cause virologic failure or toxicity.",
      "Trend HIV viral load, CD4 count when indicated, complete blood count, kidney and liver function, glucose, and regimen-specific tests because viral suppression and antiretroviral safety require objective follow-up.",
      "Screen HIV-related symptoms and obtain ordered cultures for opportunistic infection, tuberculosis, hepatitis, sexually transmitted infection, malignancy, and immune-reconstitution inflammation because declining immunity and treatment recovery can produce distinct urgent syndromes.",
      "Verify whether CD4-based opportunistic-infection antibiotic prophylaxis is prescribed and give it on schedule; use standard precautions, protect confidentiality, and avoid stigmatizing language because missed prophylaxis increases preventable infection risk while routine contact does not transmit HIV.",
      "Administer prescribed pathogen-directed antibiotic, antifungal, or antiviral therapy promptly for a suspected or confirmed opportunistic infection, then reassess oxygenation, neurologic status, cultures, and kidney and liver function because treatment delay and interactions with antiretroviral therapy can worsen organ injury or toxicity.",
      "Escalate immediately for severe dyspnea, hypoxemia, new focal neurologic deficit, meningismus, persistent fever with instability, profound dehydration, severe rash or mucosal injury, or rapidly declining consciousness; obtain indicated cultures before antibiotics when doing so will not delay treatment because an HIV-related opportunistic infection or antiretroviral toxicity may be life threatening."
    ], [
      "Severe dyspnea or hypoxemia suggesting opportunistic pneumonia",
      "New focal deficit, meningismus, seizure, or altered consciousness",
      "Persistent fever with hypotension or rapidly worsening illness",
      "Severe rash, mucosal injury, jaundice, or other major drug toxicity"
    ], [
      "Explain that daily antiretroviral therapy can produce a durable undetectable viral load and that undetectable equals untransmittable through sex when suppression is confirmed and maintained.",
      "Review adherence supports, interaction checks, vaccines, sexual health, follow-up testing, and a direct contact plan before any treatment interruption."
    ]),
    card("Cerebral contusion", ["btf-severe-tbi", "btf-surgical-tbi"], [
      "Perform frequent Glasgow Coma Scale, pupil, motor, speech, and behavior checks because bruised brain tissue can swell or bleed further during the hours after injury.",
      "Maintain cervical protection, oxygenation, ventilation, and ordered blood-pressure and cerebral-perfusion goals because hypoxia and hypotension amplify secondary neuronal injury.",
      "Keep the head elevated and midline when permitted and avoid fever, severe glucose disturbance, agitation, and unnecessary suctioning because each can increase intracranial demand or pressure.",
      "Prepare serial computed tomography and trend sodium, coagulation, hemoglobin, and neurologic response because contusions may blossom and become a surgically significant mass lesion.",
      "Escalate immediately for falling consciousness, new anisocoria, focal weakness, repeated vomiting, seizure, severe worsening headache, or Cushing-pattern vital signs because expanding hemorrhage or herniation requires urgent neurosurgical action."
    ], [
      "Falling Glasgow Coma Scale or increasing confusion",
      "New unequal pupil or focal motor deficit",
      "Repeated vomiting, seizure, or rapidly worsening headache",
      "Bradycardia with widening pulse pressure and irregular breathing"
    ], [
      "Explain that a brain bruise can enlarge after the initial scan, so observation and repeat neurologic checks remain important even if the person first seems stable.",
      "After discharge, avoid alcohol and unapproved sedatives and seek emergency care for increasing sleepiness, vomiting, weakness, seizure, or severe worsening headache."
    ]),
    card("Cushing triad", ["btf-severe-tbi", "ncs-guidelines"], [
      "Recognize hypertension with widening pulse pressure, bradycardia, and irregular respirations as a late intracranial-pressure pattern because brainstem compression is threatening ventilation and cerebral perfusion.",
      "Activate emergency neurocritical and airway support immediately rather than waiting for all three signs because the complete triad can precede herniation and arrest.",
      "Monitor pupils, consciousness, motor response, posturing, and seizure activity rapidly while maintaining oxygenation and ventilation because associated anisocoria or extensor response helps localize worsening compression.",
      "Elevate and align the head when safe, stop avoidable stimulation, and administer prescribed hyperosmolar rescue while monitoring sodium, osmolality, pressure, and kidney function because temporary pressure reduction can preserve time for definitive treatment.",
      "Escalate to immediate imaging and neurosurgical intervention for any triad component with neurologic decline, fixed pupil, posturing, apnea, or seizure because decompression or lesion evacuation may be lifesaving."
    ], [
      "Widening pulse pressure with bradycardia",
      "Irregular, slowing, or apneic breathing",
      "Fixed or unequal pupils with declining consciousness",
      "Extensor posturing, seizure, or sudden loss of airway reflexes"
    ], [
      "Explain to families that this vital-sign pattern is a late warning of dangerous pressure on the brainstem, not ordinary high blood pressure.",
      "Report any abrupt change in breathing, pulse, alertness, pupils, movement, or seizure activity immediately."
    ]),
    card("Pheochromocytoma", ["endocrine-pheo"], [
      "Measure blood pressure and pulse in a calm setting, assess episodic headache, sweating, palpitations, chest or abdominal pain, tremor, and pallor, and obtain an ECG and troponin during chest pain or crisis because catecholamine surges can injure heart, brain, and vessels.",
      "Avoid unapproved abdominal palpation; review anesthesia, procedures, decongestants, stimulants, dopamine-blocking drugs, glucocorticoids, and other triggers; and trend prescribed metanephrines, glucose, and potassium because tumor manipulation and certain medicines can provoke crisis and metabolic shifts.",
      "Administer prescribed alpha blockade before beta blockade and before planned adrenalectomy, then monitor orthostatic pressure, hydration, sodium intake, and falls and prepare protocol-directed IV fluid or vasopressor support because reversing chronic catecholamine vasoconstriction can cause marked hypotension.",
      "Do not give isolated beta blockade before adequate alpha control and clarify the sequence because unopposed alpha vasoconstriction can worsen hypertensive crisis.",
      "Escalate immediately for severe labile hypertension, chest pain, pulmonary edema, focal deficit, seizure, hyperthermia, arrhythmia, rising lactate, or shock and institute seizure precautions when indicated because catecholamine crisis requires expert intravenous control and critical care."
    ], [
      "Severe or rapidly fluctuating hypertension with headache and diaphoresis",
      "Chest pain, pulmonary edema, or unstable arrhythmia",
      "Focal neurologic deficit, seizure, or altered consciousness",
      "Hypotension or shock after a hypertensive surge or medication change"
    ], [
      "Teach the patient to keep a complete medicine list and tell every procedural and anesthesia team about the tumor because common drugs or manipulation can trigger a crisis.",
      "Explain why alpha medicine comes before beta medicine, rise slowly during preparation, and seek emergency care for severe headache, chest pain, weakness, or breathlessness."
    ]),
    card("Type 2 diabetes mellitus", ["ada-general-2026", "ada-foot-2026"], [
      "Assess type 2 diabetes glucose patterns, hyperglycemia symptoms, nutrition, activity, insulin and other medicines, access barriers, and hypoglycemia risk rather than reacting to one reading because treatment must fit the person's physiology and daily life.",
      "Monitor hemoglobin A1c, blood pressure, lipids, kidney function and urine albumin, feet, eyes, neuropathy, sodium, and potassium on schedule because diabetic vascular and microvascular injury can progress silently.",
      "Administer and teach prescribed insulin and other glucose-lowering therapy while reviewing kidney function, illness, fasting, and procedure instructions because diabetes medication safety changes with dehydration, reduced intake, and organ function.",
      "Treat type 2 diabetes cardiovascular, kidney, weight, tobacco, sleep, vaccination, and dental risks alongside glucose and albuminuria because diabetes outcomes depend on more than the glucose number alone.",
      "Escalate immediately for severe hypoglycemia, hyperosmolar hyperglycemic dehydration, ketones or acidosis, chest pain, stroke signs, infected foot wound, or rapidly declining kidney function because acute diabetic metabolic and vascular complications are time critical."
    ], [
      "Severe hypoglycemia, seizure, or altered consciousness",
      "Extreme hyperglycemia with dehydration, vomiting, ketones, or confusion",
      "Chest pain, focal neurologic deficit, or acute limb ischemia",
      "Spreading foot infection, black tissue, or rapidly worsening kidney function"
    ], [
      "Teach the patient how each medicine works, when to check glucose, how to treat a low, and what to do during illness rather than using shame or labeling a reading as failure.",
      "Review daily foot inspection, eye and kidney follow-up, an achievable food and activity plan, and urgent signs such as confusion, vomiting, chest pain, weakness, or an infected wound."
    ]),
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
  window.ANI_PATHOLOGY_NURSING_WAVE27_A = {
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
