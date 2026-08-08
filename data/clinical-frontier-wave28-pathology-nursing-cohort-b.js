(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  const VERSION = "2026-07-18-wave28-pathology-nursing-b-1";
  const COHORT = "B";

  const sources = [
    { id: "acog-hypertension", label: "American College of Obstetricians and Gynecologists, Gestational Hypertension and Preeclampsia", url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2020/06/gestational-hypertension-and-preeclampsia", note: "Supports maternal blood-pressure, symptom, laboratory, fetal-surveillance, magnesium, and escalation priorities." },
    { id: "acog-preterm", label: "American College of Obstetricians and Gynecologists, Preterm Labor and Birth", url: "https://www.acog.org/womens-health/faqs/preterm-labor-and-birth", note: "Supports contraction and membrane assessment, antenatal treatment, transfer preparation, and return precautions." },
    { id: "cdc-gbs", label: "Centers for Disease Control and Prevention, Preventing Group B Strep Disease in Newborns", url: "https://www.cdc.gov/group-b-strep/about/index.html", note: "Supports prenatal screening, intrapartum prophylaxis, neonatal observation, and infection-warning education." },
    { id: "acog-nausea", label: "American College of Obstetricians and Gynecologists, Morning Sickness: Nausea and Vomiting of Pregnancy", url: "https://www.acog.org/womens-health/faqs/morning-sickness-nausea-and-vomiting-of-pregnancy", note: "Supports dehydration and nutrition assessment, staged treatment, trigger reduction, and urgent warning signs." },
    { id: "acog-nvp-bulletin", label: "American College of Obstetricians and Gynecologists, Nausea and Vomiting of Pregnancy Practice Bulletin", url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/01/nausea-and-vomiting-of-pregnancy", note: "Supports hospital assessment of hyperemesis, thiamine before dextrose-containing fluid in prolonged vomiting, electrolyte correction, nutrition support, and treatment escalation." },
    { id: "ada-pregnancy", label: "American Diabetes Association, Management of Diabetes in Pregnancy", url: "https://diabetesjournals.org/care/article/49/Supplement_1/S306/163923/15-Management-of-Diabetes-in-Pregnancy-Standards", note: "Supports glucose targets, medication safety, fetal surveillance, delivery planning, and postpartum diabetes follow-up." },
    { id: "hrsa-newborn-screening", label: "Health Resources and Services Administration, Newborn Screening Information Center", url: "https://newbornscreening.hrsa.gov/", note: "Supports time-critical confirmatory testing and treatment after congenital hypothyroidism or PKU screening results." },
    { id: "aao-rop", label: "American Academy of Ophthalmology, Retinopathy of Prematurity", url: "https://www.aao.org/education/disease-review/retinopathy-of-prematurity", note: "Supports risk-based retinal examination timing, oxygen safety, treatment follow-up, and visual-development surveillance." },
    { id: "cdc-spina-bifida", label: "Centers for Disease Control and Prevention, Spina Bifida", url: "https://www.cdc.gov/spina-bifida/about/index.html", note: "Supports defect protection, latex precautions, bladder and bowel care, mobility, skin, and developmental follow-up." },
    { id: "sba-guidelines", label: "Spina Bifida Association, Guidelines for the Care of People With Spina Bifida", url: "https://www.spinabifidaassociation.org/guidelines/", note: "Supports newborn lesion protection, latex-safe care, neurogenic bladder and bowel management, shunt surveillance, skin protection, mobility, and lifespan follow-up." },
    { id: "aha-pals", label: "American Heart Association and American Academy of Pediatrics, Pediatric Advanced Life Support", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support", note: "Supports pediatric respiratory and circulatory assessment, oxygenation, escalation, and resuscitation readiness." },
    { id: "cps-croup", label: "Canadian Paediatric Society, Acute Management of Croup in the Emergency Department", url: "https://cps.ca/en/documents/position/acute-management-of-croup", note: "Supports minimizing agitation, dexamethasone, nebulized epinephrine for moderate or severe croup, response observation, discharge criteria, and airway escalation." },
    { id: "cdc-rsv", label: "Centers for Disease Control and Prevention, RSV in Infants and Young Children", url: "https://www.cdc.gov/rsv/infants-young-children/index.html", note: "Supports respiratory deterioration recognition, hydration assessment, prevention, and caregiver return precautions." },
    { id: "cdc-rsv-infection-control", label: "Centers for Disease Control and Prevention, Isolation Precautions for RSV", url: "https://www.cdc.gov/infection-control/media/pdfs/Guideline-Isolation-H.pdf", note: "Supports Standard plus Contact Precautions for RSV in infants and young children, careful management of respiratory secretions, hand hygiene, equipment cleaning, and policy-specific additional protection for spray or other exposure risk." },
    { id: "aha-kawasaki", label: "American Heart Association, Diagnosis, Treatment, and Long-Term Management of Kawasaki Disease", url: "https://professional.heart.org/en/science-news/diagnosis-treatment-and-long-term-management-of-kawasaki-disease", note: "Supports IVIG timing, aspirin safety, cardiac monitoring, echocardiography, and coronary complication surveillance." },
    { id: "apsa-pediatrics", label: "American Pediatric Surgical Association, Pediatric Surgery NaT", url: "https://www.pedsurglibrary.com/apsa/", note: "Supports urgent pediatric surgical assessment and perioperative care for intussusception and necrotizing enterocolitis." },
    { id: "aha-neonatal", label: "American Heart Association, Neonatal Resuscitation", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation", note: "Supports delivery-room airway, ventilation, oxygenation, thermoregulation, and post-resuscitation monitoring." },
    { id: "espr-rds-2025", label: "European Consensus Guidelines on Neonatal Respiratory Distress Syndrome, 2025", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13038240/", note: "Supports early noninvasive respiratory support, selective surfactant, oxygen targeting, lung-protective ventilation, thermal and fluid care, nutrition, monitoring, and escalation for neonatal respiratory distress syndrome; endorsed by ESPR and UENPS." },
    { id: "cns-hydrocephalus", label: "Congress of Neurological Surgeons, Pediatric Hydrocephalus Guidelines", url: "https://www.cns.org/guidelines/pediatric-hydrocephalus", note: "Supports intracranial-pressure assessment, shunt complication recognition, surgical follow-up, and family education." },
    { id: "aap-child-abuse", label: "American Academy of Pediatrics, Evaluation of Suspected Child Physical Abuse", url: "https://publications.aap.org/pediatrics/article/135/5/e1337/33747/The-Evaluation-of-Suspected-Child-Physical-Abuse", note: "Supports separate and developmentally informed histories, complete examination and objective documentation, occult-injury assessment, mandated reporting, hospitalization for protection, and child-abuse specialist coordination." },
    { id: "aap-sexual-abuse", label: "American Academy of Pediatrics, Evaluation When Child Sexual Abuse Is Suspected", url: "https://publications.aap.org/pediatrics/article/132/2/e558/31459/The-Evaluation-of-Children-in-the-Primary-Care", note: "Supports immediate safety triage, limited nonleading medical history, genital injury assessment, mandated reporting, specialist referral, and supportive caregiver education after suspected sexual abuse." },
    { id: "aap-trafficking", label: "American Academy of Pediatrics, Exploitation, Labor and Sex Trafficking of Children and Adolescents", url: "https://publications.aap.org/pediatrics/article/151/1/e2022060416/190310/Exploitation-Labor-and-Sex-Trafficking-of-Children", note: "Supports trauma-informed recognition, confidential assessment, immediate safety planning, multidisciplinary referral, and careful response when child trafficking or exploitation is suspected." },
    { id: "cff-guidelines", label: "Cystic Fibrosis Foundation, Clinical Care Guidelines", url: "https://www.cff.org/medical-professionals/clinical-care-guidelines", note: "Supports airway clearance, infection surveillance, pancreatic nutrition, glucose, and pulmonary-exacerbation care." },
    { id: "aan-ms-dmt", label: "American Academy of Neurology, Disease-Modifying Therapies for Adults With Multiple Sclerosis", url: "https://www.aan.com/Guidelines/home/GuidelineDetail/898", note: "Supports shared DMT selection, adherence and laboratory safety surveillance, pregnancy considerations, switching, and risks of unplanned treatment interruption." },
    { id: "aan-ms-vaccine", label: "American Academy of Neurology, Vaccine-Preventable Infections and Immunization in Multiple Sclerosis", url: "https://www.aan.com/guidelines/home/guidelinedetail/974", note: "Supports vaccination review, infection screening, treatment-specific vaccine timing, and avoidance of live vaccines during specified immunosuppressive or immunomodulating therapies." },
    { id: "va-ms-relapse", label: "U.S. Department of Veterans Affairs, Multiple Sclerosis Relapse Management", url: "https://www.va.gov/MS/LEARN_ABOUT_MULTIPLE_SCLEROSIS/Relapse_Management_for_Multiple_Sclerosis.asp", note: "Supports distinguishing relapse from infection-, stress-, or heat-related pseudo-relapse, corticosteroid benefits and adverse-effect monitoring, rehabilitation, and urgent escalation for disabling deficits." },
    { id: "ean-gbs", label: "European Academy of Neurology and Peripheral Nerve Society, Guillain-Barre Syndrome Guideline", url: "https://www.ean.org/research/resources/neurology-updates/detail/ean-pns-guideline-on-diagnosis-and-treatment-of-guillain-barre-syndrome", note: "Supports serial respiratory and autonomic assessment, immunotherapy, immobility prevention, and rehabilitation." },
    { id: "aha-stroke", label: "American Heart Association, Guidelines for Acute Ischemic Stroke and Intracerebral Hemorrhage", url: "https://professional.heart.org/en/guidelines-and-statements/stroke-guidelines", note: "Supports emergency neuroimaging, blood-pressure and neurologic surveillance, swallow safety, and stroke-unit care." },
    { id: "aha-tia", label: "American Heart Association, Diagnosis, Workup, Risk Reduction of Transient Ischemic Attack", url: "https://professional.heart.org/en/science-news/diagnosis-workup-risk-reduction-of-transient-ischemic-attack-in-the-emergency-department-setting", note: "Supports urgent brain and vascular evaluation and rapid prevention after transient focal neurologic symptoms." },
    { id: "aes-epilepsy", label: "American Epilepsy Society, Clinical Guidance", url: "https://www.aesnet.org/clinical-care/clinical-guidance", note: "Supports seizure first aid, antiseizure therapy, rescue planning, status recognition, and safety counseling." },
    { id: "idsa-encephalitis", label: "Infectious Diseases Society of America, Management of Encephalitis Guideline", url: "https://www.idsociety.org/practice-guideline/encephalitis/", note: "Supports rapid diagnostic sampling, empiric antiviral therapy, seizure monitoring, and intracranial complication assessment." },
    { id: "nice-dementia", label: "National Institute for Health and Care Excellence, Dementia: Assessment, Management and Support", url: "https://www.nice.org.uk/guidance/ng97", note: "Supports cognition and function assessment, person-centered communication, medication safety, and caregiver planning." },
    { id: "apa-bipolar", label: "National Institute for Health and Care Excellence, Bipolar Disorder: Assessment and Management", url: "https://www.nice.org.uk/guidance/cg185", note: "Supports mania and depression safety assessment, pharmacotherapy monitoring, sleep stabilization, and relapse planning." },
    { id: "apa-schizophrenia", label: "American Psychiatric Association, Treatment of Patients With Schizophrenia", url: "https://psychiatryonline.org/doi/book/10.1176/appi.books.9780890424841", note: "Supports psychosis safety, antipsychotic monitoring, engagement, adherence, and coordinated psychosocial care." },
    { id: "apa-depression", label: "National Institute for Health and Care Excellence, Depression in Adults: Treatment and Management", url: "https://www.nice.org.uk/guidance/ng222", note: "Supports suicide assessment, treatment monitoring, activation precautions, psychotherapy, and continuity planning." },
    { id: "va-dod-suicide", label: "VA/DoD Clinical Practice Guideline for Assessment and Management of Patients at Risk for Suicide", url: "https://www.healthquality.va.gov/guidelines/MH/srb/VADODCP_SuicideRisk_Full.pdf", note: "Supports assessment based on current risk and capacity, collaborative safety planning, lethal-means safety, matched observation, and avoidance of no-harm contracts as a reassurance or disposition tool." },
    { id: "dsm-schizoaffective", label: "DSM-5 Mood Disorders Work Group, Schizoaffective Disorder Diagnostic Framework", url: "https://pubmed.ncbi.nlm.nih.gov/23707642/", note: "Supports the longitudinal distinction requiring psychosis outside a major mood episode and major mood episodes during most of the illness, rather than labeling any mixture of mood and psychotic symptoms schizoaffective disorder." },
    { id: "asam-withdrawal", label: "American Society of Addiction Medicine, Alcohol Withdrawal Management Guideline", url: "https://www.asam.org/quality-care/clinical-guidelines/alcohol-withdrawal-management-guideline", note: "Supports structured withdrawal scoring, benzodiazepine treatment, thiamine, seizure precautions, and escalation." },
    { id: "samhsa-withdrawal", label: "Substance Abuse and Mental Health Services Administration, Medications for Opioid Use Disorder", url: "https://store.samhsa.gov/product/tip-63-medications-opioid-use-disorder-full-document/pep21-02-01-002", note: "Supports opioid withdrawal assessment, evidence-based medication linkage, overdose prevention, and continuity of care." },
    { id: "asam-benzodiazepine", label: "Joint Clinical Practice Guideline on Benzodiazepine Tapering", url: "https://www.asam.org/quality-care/clinical-guidelines/benzodiazepine-tapering", note: "Supports recognition of dangerous benzodiazepine withdrawal, avoidance of abrupt discontinuation in dependent patients, individualized supervised tapering, monitoring, and higher-level care for complicated withdrawal." },
    { id: "asam-stimulant", label: "ASAM/AAAP Clinical Practice Guideline on Stimulant Use Disorder", url: "https://www.asam.org/quality-care/clinical-guidelines/stimulant-use-disorders", note: "Supports assessment and management of stimulant intoxication and withdrawal, cardiovascular and psychiatric complications, suicidality monitoring, and linkage to ongoing evidence-based treatment." },
    { id: "sccm-delirium", label: "Society of Critical Care Medicine, PADIS Guidelines", url: "https://www.sccm.org/clinical-resources/guidelines/guidelines/padis-guidelines", note: "Supports validated delirium assessment, cause correction, mobility, sleep, sensory aids, and restraint minimization." },
    { id: "nice-delirium", label: "National Institute for Health and Care Excellence, Delirium: Prevention, Diagnosis and Management", url: "https://www.nice.org.uk/guidance/cg103/chapter/Recommendations", note: "Supports 4AT screening in hospital and long-term care, CAM-ICU or ICDSC in critical care, cause investigation, multicomponent prevention, communication, and reassessment." },
    { id: "apa-eating", label: "American Psychiatric Association, Practice Guideline for the Treatment of Patients With Eating Disorders", url: "https://psychiatryonline.org/doi/10.1176/appi.ajp.23180001", note: "Supports medical instability screening, electrolyte and cardiac monitoring, supervised nutrition, and psychotherapy referral." },
    { id: "wjes-abdomen", label: "World Society of Emergency Surgery, Clinical Practice Guidelines", url: "https://www.wses.org.uk/scientific-resources/guidelines", note: "Supports urgent imaging, antibiotics, decompression, and source-control pathways for acute abdominal disease." },
    { id: "aasld-portal", label: "American Association for the Study of Liver Diseases, Portal Hypertension and Varices Guidance", url: "https://www.aasld.org/practice-guidelines/portal-hypertension-bleeding-cirrhosis", note: "Supports variceal-bleeding stabilization, vasoactive therapy, antibiotics, endoscopy, and recurrence prevention." },
    { id: "acg-bleeding", label: "American College of Gastroenterology, Upper Gastrointestinal and Ulcer Bleeding Guideline", url: "https://gi.org/guideline/upper-gastrointestinal-and-ulcer-bleeding/", note: "Supports hemodynamic resuscitation, transfusion strategy, acid suppression, endoscopy, and rebleeding surveillance." },
    { id: "acg-lower-bleeding", label: "American College of Gastroenterology, Acute Lower Gastrointestinal Bleeding Guideline", url: "https://gi.org/guidelines/", note: "Supports resuscitation, CT angiography for ongoing hemodynamically significant hematochezia, bowel preparation and nonemergent colonoscopy planning, interventional radiology, and recurrence prevention for acute lower gastrointestinal bleeding." },
    { id: "acg-hpylori-2024", label: "American College of Gastroenterology, 2024 Helicobacter pylori Treatment Guideline", url: "https://webfiles.gi.org/links/journals/ACG-Hpylori-Guidelines-Highlights-2024-FINAL.pdf", note: "Supports indications for H. pylori testing, susceptibility-conscious eradication therapy, avoidance of empiric clarithromycin or levofloxacin when inappropriate, and universal post-treatment proof of eradication." },
    { id: "cdc-hepb", label: "Centers for Disease Control and Prevention, Clinical Care of Hepatitis B", url: "https://www.cdc.gov/hepatitis-b/hcp/clinical-care/index.html", note: "Supports serologic interpretation, liver monitoring, antiviral referral, transmission prevention, and contact vaccination." },
    { id: "idsa-uti", label: "Infectious Diseases Society of America, Urinary Tract Infection Guidelines", url: "https://www.idsociety.org/practice-guideline/practice-guideline-repository/urinary-tract-infection/", note: "Supports urine testing, antimicrobial selection, pyelonephritis severity assessment, and recurrence prevention." },
    { id: "endocrine-hyponatremia", label: "European Society of Endocrinology, Hyponatraemia Clinical Practice Guideline", url: "https://www.ese-hormones.org/publications/clinical-practice-guidelines/", note: "Supports SIADH diagnosis, fluid management, neurologic monitoring, and prevention of overly rapid sodium correction." },
    { id: "nhs-hypokalemia", label: "NHS Specialist Pharmacy Service, Treating Acute Hypokalaemia in Adults", url: "https://sps.nhs.uk/articles/hypokalaemia/", note: "Supports cause assessment, oral versus intravenous replacement, renal and magnesium review, infusion-pump and route safety, electrocardiographic monitoring, laboratory reassessment, and escalation for severe or symptomatic hypokalaemia." },
    { id: "nci-leukemia", label: "National Cancer Institute, Leukemia Treatment Information", url: "https://www.cancer.gov/types/leukemia", note: "Supports treatment-phase complication recognition, infection and bleeding protection, tumor lysis monitoring, and education." },
    { id: "ash-platelets", label: "American Society of Hematology, Immune Thrombocytopenia Guidelines", url: "https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/immune-thrombocytopenia", note: "Supports bleeding assessment, platelet-directed therapy, medication precautions, and urgent neurologic escalation." },
    { id: "ash-hit", label: "American Society of Hematology, Heparin-Induced Thrombocytopenia Guideline", url: "https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/heparin-induced-thrombocytopenia", note: "Supports pretest probability assessment, immediate management of suspected or confirmed HIT, non-heparin anticoagulation, thrombosis surveillance, and avoidance of routine platelet transfusion in average-risk HIT." },
    { id: "isth-ttp", label: "International Society on Thrombosis and Haemostasis, Thrombotic Thrombocytopenic Purpura Guidelines", url: "https://www.isth.org/page/TTPGuidelines", note: "Supports urgent recognition of thrombocytopenia with microangiopathic hemolysis and organ injury, ADAMTS13 testing, time-critical hematology treatment, and current TTP management." },
    { id: "aabb-platelets-2025", label: "AABB/ICTMG, 2025 Platelet Transfusion Guidelines", url: "https://www.aabb.org/news-resources/news/article/2025/05/29/aabb-develops-new-platelet-transfusion-guidelines", note: "Supports restrictive, context-specific platelet transfusion decisions that account for active bleeding, procedure risk, cause of thrombocytopenia, alternatives, and transfusion harms." },
    { id: "isth-dic", label: "International Society on Thrombosis and Haemostasis, DIC Reference Tools", url: "https://www.isth.org/page/reference_tools/ISTH-SSC-reference-tools.htm", note: "Supports structured recognition and scoring of disseminated intravascular coagulation when thrombocytopenia occurs with abnormal coagulation, bleeding, thrombosis, and organ dysfunction." },
    { id: "nccn-myeloma", label: "National Comprehensive Cancer Network, Multiple Myeloma Patient Guideline", url: "https://www.nccn.org/patients/guidelines/content/PDF/myeloma-patient.pdf", note: "Supports bone, renal, calcium, anemia, infection, thrombosis, and treatment-toxicity surveillance." },
    { id: "nccn-mpn", label: "National Comprehensive Cancer Network, Myeloproliferative Neoplasms", url: "https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1477", note: "Supports thrombosis and bleeding risk reduction, blood-count monitoring, cytoreduction, and symptom surveillance." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const patches = [
    card("Gestational hypertension", ["acog-hypertension"], [
      "Measure blood pressure with the correct cuff after the patient rests, repeat severe values promptly, and compare both arms when indicated because technique error can hide or falsely create a hypertensive emergency.",
      "Ask at every contact about persistent headache, visual change, right-upper-quadrant or epigastric pain, dyspnea, chest pain, nausea, and reduced fetal movement because gestational hypertension can progress to preeclampsia without warning.",
      "Obtain ordered urine protein assessment, complete blood count with platelets, creatinine, and liver enzymes and trend them against baseline because thrombocytopenia, kidney injury, or hepatic injury changes the diagnosis and delivery urgency.",
      "Coordinate fetal movement review, nonstress testing, fluid assessment, and growth surveillance because placental vascular dysfunction can reduce fetal oxygen and growth before maternal symptoms become dramatic.",
      "Administer prescribed antihypertensive therapy for sustained severe pressure and prepare magnesium sulfate when severe features warrant seizure prophylaxis, monitoring reflexes, respirations, urine output, and magnesium toxicity.",
      "Escalate immediately for persistent blood pressure at or above 160 systolic or 110 diastolic, neurologic symptoms, pulmonary edema, severe abdominal pain, abnormal fetal testing, falling platelets, rising creatinine, or rising liver enzymes because stroke, eclampsia, abruption, and fetal compromise are time-critical."
    ], [
      "Persistent blood pressure of 160/110 mm Hg or higher on prompt repeat measurement",
      "Severe headache, visual disturbance, seizure, confusion, or hyperreflexia with clonus",
      "Right-upper-quadrant pain, dyspnea, pulmonary edema, thrombocytopenia, or worsening kidney or liver tests",
      "Vaginal bleeding, painful rigid uterus, reduced fetal movement, or nonreassuring fetal testing"
    ], [
      "Teach home blood-pressure technique and the exact call parameters; a normal reading earlier in the day does not make severe headache, vision change, breathing difficulty, or upper-abdominal pain safe to watch at home.",
      "Explain that gestational hypertension may progress after delivery, so keep postpartum checks and seek urgent care for severe symptoms, heavy bleeding, chest pain, dyspnea, or blood pressure at the emergency threshold."
    ]),
    card("Preterm labor", ["acog-preterm"], [
      "Determine gestational age, time and pattern of contractions, pelvic pressure, backache, bleeding, fluid leakage, fetal movement, and prior preterm birth because treatment benefit and neonatal risk change rapidly with gestational age and membrane status.",
      "Place the patient on maternal vital-sign and fetal/contraction monitoring and quantify bleeding or fluid because infection, placental abruption, fetal compromise, and true cervical change can mimic or accompany preterm labor.",
      "Prepare for sterile speculum, cervical-length, and ordered fetal fibronectin assessment while avoiding an unnecessary digital examination when membranes are ruptured or placenta previa is possible because manipulation can increase infection or hemorrhage risk.",
      "Establish vascular access and obtain ordered urine, infection, blood, and membrane-rupture studies because urinary infection, chorioamnionitis, and dehydration can trigger contractions but may make tocolysis unsafe.",
      "Administer prescribed antenatal corticosteroid, magnesium for fetal neuroprotection, antibiotics, or short-term tocolytic therapy within the gestation-specific plan and monitor maternal and fetal adverse effects because each intervention has a different time-limited purpose.",
      "Escalate for cord prolapse, heavy bleeding, maternal fever, uterine tenderness, fetal bradycardia, advanced cervical change, or imminent birth and coordinate neonatal and higher-level transfer early because transport is safest before delivery."
    ], [
      "Visible or palpable cord, fetal bradycardia, or sudden deceleration after membrane rupture",
      "Heavy vaginal bleeding, severe constant abdominal pain, or a rigid tender uterus",
      "Maternal fever, foul fluid, fetal tachycardia, or uterine tenderness suggesting intra-amniotic infection",
      "Strong frequent contractions with rectal pressure, urge to push, or rapidly advancing cervical change"
    ], [
      "Teach the patient to call promptly for regular tightening, pelvic pressure, menstrual-like cramps, low backache, bleeding, fluid leakage, or reduced fetal movement rather than waiting for painful contractions.",
      "Explain the purpose of each medicine: corticosteroids mature fetal organs, magnesium may protect the very preterm brain, and a tocolytic may buy time but does not permanently stop the process."
    ]),
    card("Group B streptococcal infection", ["cdc-gbs"], [
      "Confirm this pregnancy's group B streptococcal culture result, prior infant with invasive GBS disease, GBS bacteriuria, gestational age, membrane-rupture time, and intrapartum temperature because these facts determine prophylaxis even when a screening result is unavailable.",
      "Clarify the exact penicillin-allergy reaction and review susceptibility results when indicated because anaphylaxis risk changes antibiotic selection and clindamycin should not be assumed active.",
      "Administer the prescribed intrapartum antibiotic on schedule and document drug, dose, and time because adequate exposure before birth lowers early-onset neonatal infection, although urgent delivery must never be delayed just to complete four hours.",
      "Monitor maternal temperature, pulse, uterine tenderness, fluid odor, contraction pattern, and fetal heart rate because fever or fetal tachycardia may signal intra-amniotic infection requiring treatment beyond routine prophylaxis.",
      "Communicate maternal GBS status, antibiotic timing, allergy, membrane duration, fever, and infant condition directly to the newborn team because neonatal observation and evaluation depend on the complete risk picture.",
      "Escalate for maternal fever, hypotension, foul fluid, uterine tenderness, fetal tachycardia, or a newborn with poor feeding, temperature instability, grunting, apnea, lethargy, or color change because invasive GBS disease can progress rapidly."
    ], [
      "Maternal fever with uterine tenderness, foul-smelling fluid, or fetal tachycardia",
      "Maternal hypotension, confusion, rising lactate, or other sepsis-associated organ dysfunction",
      "Newborn grunting, apnea, retractions, cyanosis, or increasing oxygen requirement",
      "Newborn temperature instability, poor feeding, lethargy, abnormal tone, or poor perfusion"
    ], [
      "Explain that GBS is commonly carried without symptoms and is not a sexually transmitted infection; intrapartum antibiotics reduce newborn exposure but do not eradicate lifelong carriage.",
      "Teach caregivers to seek urgent newborn evaluation for breathing difficulty, pauses in breathing, fever or low temperature, poor feeding, unusual sleepiness, irritability, or color change."
    ]),
    card("Hyperemesis gravidarum", ["acog-nausea", "acog-nvp-bulletin"], [
      "Quantify vomiting, oral intake, weight loss, orthostatic symptoms, urine output, ketones, and ability to keep medicines down because severity is defined by dehydration, starvation, and functional loss rather than nausea alone.",
      "Obtain ordered electrolytes, glucose, kidney and liver tests, urinalysis, thyroid studies when indicated, and fetal assessment appropriate to gestation because hypokalemia, kidney injury, hepatitis, infection, or another diagnosis can complicate persistent vomiting.",
      "Restore fluid and electrolytes in measured steps, give thiamine before dextrose-containing nutrition when prolonged poor intake is present, and monitor for refeeding shifts because glucose can precipitate Wernicke injury in a thiamine-depleted patient.",
      "Administer scheduled antiemetics by a route the patient can retain and reassess sedation, QT risk, bowel function, and response because repeated rescue-only dosing allows dehydration to recur and medicines have additive adverse effects.",
      "Track intake and output, daily weight, mucous membranes, orthostasis, potassium, magnesium, phosphate, and nutrition tolerance and coordinate dietitian or enteral support when oral strategies fail because ongoing catabolism threatens both patient and fetus.",
      "Escalate for confusion, ataxia, eye-movement abnormality, syncope, hematemesis, severe abdominal pain, oliguria, marked electrolyte disturbance, arrhythmia, or inability to tolerate any fluid because neurologic, cardiac, renal, or surgical complications may be developing."
    ], [
      "Confusion, ataxia, nystagmus, ophthalmoplegia, or profound weakness suggesting thiamine deficiency",
      "Syncope, severe orthostasis, oliguria, acute kidney injury, or inability to retain liquids",
      "Marked hypokalemia, hypomagnesemia, hypophosphatemia, prolonged QT, or dysrhythmia",
      "Hematemesis, severe focal abdominal pain, fever, jaundice, or another finding inconsistent with uncomplicated pregnancy vomiting"
    ], [
      "Use small frequent bland meals and fluids, separate solids from liquids if helpful, avoid personal odor or food triggers, and take prescribed medicines on schedule before vomiting becomes uncontrolled.",
      "Seek care for no urine or very dark urine, fainting, blood in vomit, confusion, trouble walking, severe pain, or inability to keep liquids down; weight loss and dehydration are medical problems, not a failure to cope."
    ]),
    card("Gestational diabetes", ["ada-pregnancy"], [
      "Review fasting and post-meal glucose logs, meal timing, activity, ketone instructions, and meter technique because treatment decisions depend on patterns rather than a single clinic value.",
      "Coordinate an individualized carbohydrate plan, safe activity, and weight-gain goals with nutrition services because predictable glucose exposure reduces fetal hyperinsulinemia while preserving adequate maternal and fetal nutrition.",
      "Teach insulin preparation, injection, storage, dose timing, and sick-day rules when medication is prescribed and verify that oral agents or supplements are pregnancy-team approved because requirements change as placental hormones rise.",
      "Assess for hypoglycemia and treat with measured rapid carbohydrate when the patient is awake, rechecking glucose and providing follow-up food as directed because overtreatment can cause rebound hyperglycemia and an unconscious patient cannot swallow safely.",
      "Coordinate fetal growth and antenatal surveillance, labor glucose checks, and newborn glucose and feeding plans because maternal hyperglycemia increases macrosomia, birth injury, stillbirth, and neonatal hypoglycemia risk.",
      "Escalate for persistent glucose above the prescribed range, moderate or large ketones, vomiting, dehydration, decreased fetal movement, severe hypertension symptoms, or recurrent hypoglycemia because ketoacidosis and placental compromise can occur at lower glucose levels in pregnancy."
    ], [
      "Moderate or large ketones, vomiting, abdominal pain, rapid breathing, or dehydration",
      "Recurrent severe hypoglycemia, seizure, unconsciousness, or inability to take oral carbohydrate",
      "Markedly reduced fetal movement, abnormal fetal testing, or concern for preterm labor",
      "Severe headache, visual change, upper-abdominal pain, dyspnea, or severe-range blood pressure"
    ], [
      "Explain that placental hormones create insulin resistance; needing insulin is not a personal failure, and glucose often improves after birth even though future type 2 diabetes risk remains higher.",
      "Keep postpartum glucose testing at the recommended interval and lifelong screening, continue healthy eating and activity, and tell the child's clinician about the pregnancy history."
    ]),

    card("Congenital hypothyroidism", ["hrsa-newborn-screening"], [
      "Verify the newborn screen collection time and arrange prompt confirmatory serum thyroid-stimulating hormone and free thyroxine testing because a screening result identifies risk but treatment delay can permanently impair brain development.",
      "Administer levothyroxine exactly as prescribed as soon as the diagnosis is confirmed or strongly suspected and document the full dose because early adequate hormone replacement is the central neurodevelopmental intervention.",
      "Teach caregivers to crush the tablet into a small measured amount of water or milk and give it directly rather than mixing it into a full bottle because an unfinished feed produces an unknown dose.",
      "Separate levothyroxine from iron, calcium, soy, and interfering medicines as directed and review every formula or supplement because binding and absorption changes can make an apparently correct dose ineffective.",
      "Track free thyroxine and thyroid-stimulating hormone on the prescribed schedule along with growth, feeding, stooling, tone, hearing, and developmental milestones because dose needs change rapidly during infancy.",
      "Escalate for prolonged jaundice, poor feeding, hypothermia, apnea, marked lethargy, weak cry, worsening constipation, or signs of overtreatment such as tachycardia and poor weight gain because severe deficiency or excessive replacement requires prompt reassessment."
    ], [
      "Apnea, hypothermia, poor perfusion, or profound lethargy",
      "Persistent poor feeding, prolonged jaundice, weak cry, macroglossia, or worsening hypotonia",
      "Tachycardia, sweating, irritability, diarrhea, or poor weight gain after treatment begins",
      "Missed doses or laboratory results outside the treatment team's target during early infancy"
    ], [
      "Explain that the baby may look well while thyroid hormone is still too low for brain development, so medicine and laboratory visits cannot wait for symptoms.",
      "Give the same prescribed product and technique each day, do not double a dose unless specifically instructed, and contact the endocrine team when vomiting, feeding changes, or supplements affect dosing."
    ]),
    card("Phenylketonuria", ["hrsa-newborn-screening"], [
      "Confirm that an abnormal newborn screen receives urgent quantitative phenylalanine testing and metabolic-team review because untreated phenylalanine accumulation injures the developing brain before obvious symptoms appear.",
      "Start and precisely prepare prescribed low-phenylalanine medical formula while preserving the measured natural-protein allowance because phenylalanine is essential in small amounts but neurotoxic when excessive.",
      "Collect phenylalanine levels at the scheduled frequency and document formula, food, illness, and growth around each result because intake needs change with age, catabolism, and treatment response.",
      "Monitor weight, length, head growth, skin, feeding, development, school performance, and micronutrient intake because overrestriction can cause malnutrition while underrestriction permits neurologic injury.",
      "Review all foods, medicines, supplements, and products containing aspartame with the metabolic dietitian because hidden phenylalanine can raise levels despite good adherence.",
      "Escalate for repeated vomiting, refusal of medical formula, rapid weight loss, developmental regression, seizure, severe illness, or persistently high phenylalanine because catabolism and interrupted therapy can raise brain exposure quickly."
    ], [
      "Seizure, developmental regression, new abnormal tone, or altered consciousness",
      "Persistent vomiting, dehydration, refusal of medical formula, or rapid weight loss",
      "Phenylalanine persistently above the metabolic team's target despite the prescribed plan",
      "Pregnancy or pregnancy planning without established metabolic control"
    ], [
      "Teach that PKU treatment is lifelong: use the prescribed medical formula, measured protein plan, and blood testing rather than simply avoiding all protein.",
      "Explain maternal PKU risk early in adolescence: high phenylalanine during pregnancy can injure a fetus even when the fetus does not have PKU, so control must begin before conception."
    ]),
    card("Retinopathy of prematurity", ["aao-rop"], [
      "Verify birth weight, gestational age, oxygen course, transfusions, and the exact retinal-screening appointment because the examination window is based on postmenstrual age and missing it can allow silent retinal detachment.",
      "Maintain the neonatal team's prescribed oxygen-saturation target and prevent avoidable hypoxemic and hyperoxemic swings because both unstable oxygen delivery and excessive oxygen exposure contribute to abnormal retinal vascular growth.",
      "Prepare the infant for indirect retinal examination with ordered dilation, comfort measures, cardiorespiratory monitoring, and feeding precautions because the examination can provoke apnea, bradycardia, and oxygen desaturation.",
      "Document zone, stage, plus disease, follow-up interval, and treatment plan exactly and confirm closed-loop scheduling because vague handoff language can cause a time-critical repeat examination to be missed.",
      "After laser or anti-VEGF treatment, monitor respiratory stability, eye redness or discharge, and the longer surveillance schedule because disease can recur later after anti-VEGF therapy.",
      "Escalate for a missed or uncertain appointment, new poor visual behavior, leukocoria, abnormal red reflex, eye swelling or discharge, or post-examination apnea and bradycardia because retinal progression and cardiorespiratory instability require prompt action."
    ], [
      "Any missed, delayed, or undocumented time-critical retinal examination",
      "New leukocoria, abnormal red reflex, absent visual tracking, or concern for retinal detachment",
      "Apnea, bradycardia, cyanosis, or prolonged desaturation during or after examination",
      "Increasing eye redness, swelling, purulent drainage, or fever after ocular treatment"
    ], [
      "Explain that ROP often has no visible early symptom; keeping every eye appointment is what allows treatment before vision is permanently lost.",
      "Use prescribed oxygen exactly as directed and never change the flow to chase a home monitor number without the neonatal team's plan; report repeated alarms or breathing changes."
    ]),
    card("Spina bifida", ["cdc-spina-bifida", "sba-guidelines"], [
      "For an open myelomeningocele, position the newborn prone, cover the sac with sterile saline-moistened nonadherent material, protect it from urine and stool, and avoid pressure because rupture introduces infection and injures exposed neural tissue.",
      "Use a latex-safe environment from the first encounter and label the risk prominently because repeated surgical and catheter exposure makes severe latex sensitization common.",
      "Assess leg movement and sensation, anal tone, bladder emptying, urine output, skin temperature, and distal perfusion against baseline because neurologic level determines mobility, bowel, bladder, and pressure-injury risks.",
      "Measure head circumference, inspect fontanel and sutures, and monitor vomiting, sunset eyes, irritability, and consciousness because hydrocephalus may accompany the defect or emerge after closure.",
      "Perform clean intermittent catheterization and bowel and skin programs exactly as prescribed, monitoring urine cultures only when clinically indicated because low-pressure emptying protects kidneys and continence goals.",
      "Escalate for sac leakage or discoloration, fever, neck stiffness, reduced leg function, urinary retention, oliguria, autonomic symptoms, or increased intracranial-pressure signs because infection, tethering, renal injury, or hydrocephalus can progress quickly."
    ], [
      "Cerebrospinal-fluid leakage, sac rupture, dusky tissue, purulent drainage, or fever",
      "Bulging fontanel, rapidly increasing head circumference, sunset eyes, vomiting, or reduced responsiveness",
      "New weakness, loss of function, severe back or leg pain, or change in bowel or bladder control",
      "Urinary retention, oliguria, fever with urinary symptoms, or signs of latex anaphylaxis"
    ], [
      "Teach lifelong latex avoidance and provide examples such as balloons and some rubber products; ask every clinic, dentist, and school to use latex-safe supplies.",
      "Show caregivers the exact catheter, bowel, skin-inspection, and positioning routine and when to call for fever, cloudy urine with illness, new weakness, sac or incision change, or shunt symptoms."
    ]),
    card("Croup", ["cps-croup", "aha-pals"], [
      "Keep the child upright with a caregiver and minimize crying, repeated examinations, and painful procedures because agitation increases turbulent airflow through the narrowed upper airway and can abruptly worsen obstruction.",
      "Assess stridor at rest, retractions, air entry, respiratory rate, color, drooling, voice, fatigue, and level of consciousness rather than relying on pulse oximetry alone because oxygen saturation can remain normal until obstruction is advanced.",
      "Administer prescribed dexamethasone for airway inflammation and nebulized epinephrine for moderate or severe stridor, monitoring heart rate and clinical response because epinephrine acts quickly but can wear off before steroid benefit begins.",
      "Provide oxygen by the least upsetting method and keep airway equipment and experienced help available because forcing a mask may worsen distress and a tiring child can deteriorate rapidly.",
      "Observe for the protocol-defined period after nebulized epinephrine and reassess stridor at rest, work of breathing, hydration, and caregiver reliability because recurrence may appear as vasoconstriction fades.",
      "Escalate immediately for silent or markedly diminished air entry, cyanosis, drooling with tripod posture, severe retractions, exhaustion, reduced consciousness, or poor response to epinephrine because bacterial airway disease or impending respiratory failure may be present."
    ], [
      "Cyanosis, apnea, silent air entry, exhaustion, or decreasing consciousness",
      "Stridor at rest with severe retractions or poor response to nebulized epinephrine",
      "Drooling, tripod positioning, toxic appearance, or inability to swallow",
      "Recurrent significant stridor during the observation period or inability to maintain hydration"
    ], [
      "Use calm comfort, fluids as tolerated, and the prescribed steroid; steam and cold air are not substitutes for assessment when stridor occurs at rest.",
      "Seek emergency help for blue color, pauses in breathing, severe pulling at the ribs, drooling, inability to speak or drink, unusual sleepiness, or a quieter child who is still struggling to breathe."
    ]),
    card("Respiratory syncytial virus", ["cdc-rsv", "cdc-rsv-infection-control", "aha-pals"], [
      "Count respirations for a full minute and assess retractions, nasal flaring, grunting, apnea, color, air entry, hydration, and feeding endurance because infants can progress from congestion to fatigue and respiratory failure quickly.",
      "Use gentle nasal saline and suction before feeds, sleep, and respiratory reassessment because clearing the nose can improve both ventilation and feeding in obligate nasal breathers.",
      "Provide oxygen or respiratory support to the prescribed target and reassess work of breathing rather than chasing a single saturation because bronchiolar obstruction and apnea risk determine support needs.",
      "Offer smaller frequent feeds only when breathing is safe and use ordered enteral or intravenous hydration when tachypnea impairs suck-swallow-breathe coordination because forced oral feeding increases aspiration and exhaustion.",
      "Use Standard plus Contact Precautions for RSV in infants and young children, add source-control or other transmission-based measures required by current facility policy and exposure risk, and clean hands and equipment carefully because direct contact with infected secretions is a major route of healthcare spread.",
      "Escalate for apnea, cyanosis, grunting, severe retractions, respiratory rate or effort that prevents feeding, fewer wet diapers, exhaustion, or reduced responsiveness because these findings indicate dehydration or impending respiratory failure."
    ], [
      "Apnea, cyanosis, grunting, marked retractions, or poor air entry",
      "Exhaustion, decreasing responsiveness, recurrent bradycardia, or rising carbon dioxide",
      "Inability to feed safely, repeated emesis, or substantially fewer wet diapers",
      "Rapidly increasing oxygen or noninvasive respiratory-support requirement"
    ], [
      "Teach caregivers to use saline and gentle suction before feeds, avoid smoke exposure, perform hand hygiene, and never give over-the-counter cough or cold medicine to an infant unless specifically directed.",
      "Seek urgent care for pauses in breathing, blue color, ribs pulling deeply, grunting, poor feeding, fewer wet diapers, or unusual sleepiness; fever in a young infant requires prompt clinical advice."
    ]),
    card("Kawasaki disease", ["aha-kawasaki"], [
      "Document fever day, conjunctival change, oral findings, rash, extremity changes, lymph nodes, irritability, and incomplete presentations because timely recognition before day ten reduces coronary-artery injury.",
      "Obtain ordered inflammatory markers, complete blood count, liver tests, urinalysis, electrocardiography, and echocardiography and trend them because coronary inflammation and myocarditis may be clinically silent.",
      "Administer intravenous immune globulin and prescribed aspirin on schedule and monitor for infusion reaction, bleeding, tinnitus, and response because persistent fever after treatment predicts higher coronary risk.",
      "Monitor heart rate, perfusion, blood pressure, intake and output, chest discomfort, gallop rhythm, and oxygen need because myocarditis, ventricular dysfunction, shock, or coronary ischemia can complicate the acute illness.",
      "Provide mouth and skin comfort, hydration, and quiet rest while avoiding live vaccines for the interval directed after IVIG because passive antibody can reduce vaccine effectiveness.",
      "Escalate for recurrent or persistent fever after IVIG, hypotension, chest pain, syncope, dysrhythmia, poor perfusion, respiratory distress, or new neurologic change because resistant inflammation or cardiac complications require urgent reassessment."
    ], [
      "Persistent or recurrent fever after completion of initial IVIG therapy",
      "Hypotension, delayed capillary refill, oliguria, or signs of Kawasaki shock",
      "Chest pain, syncope, dysrhythmia, new gallop, or acute respiratory distress",
      "Major bleeding, severe headache or neurologic change, or anaphylactic infusion reaction"
    ], [
      "Explain that the fever and inflammation can affect heart arteries even when the child looks better, so every cardiology and echocardiogram appointment remains essential.",
      "Give aspirin only in the prescribed dose, report influenza or varicella exposure promptly, avoid ibuprofen unless the team approves it, and confirm when live vaccines may resume after IVIG."
    ]),
    card("Intussusception", ["apsa-pediatrics"], [
      "Recognize intermittent severe colicky pain, drawing up of the legs, pallor, vomiting, lethargy, abdominal mass, and bloody mucus stool because lethargy or episodic pallor may precede the classic stool finding.",
      "Keep the child fasting, establish vascular access, correct dehydration, and obtain ordered glucose, blood count, electrolytes, type and screen, and ultrasound because bowel ischemia and emergency reduction may require rapid anesthesia or surgery.",
      "Perform serial abdominal, pain, perfusion, and stool assessments and mark changes because persistent pain between episodes, guarding, or shock suggests ischemia or perforation rather than uncomplicated telescoping bowel.",
      "Prepare for image-guided air or contrast enema when stable and ensure surgical backup because enema can diagnose and reduce the obstruction but may perforate compromised bowel.",
      "After reduction, monitor for recurrent episodic pain, vomiting, bloody stool, fever, and abdominal distention and resume intake only as directed because recurrence is most likely early but can occur later.",
      "Escalate for peritonitis, free air, persistent shock, bilious vomiting, rigid distention, continuous severe pain, or failed reduction because bowel necrosis or perforation requires urgent surgery."
    ], [
      "Rigid abdomen, rebound, guarding, free air, or sudden severe continuous pain",
      "Hypotension, tachycardia with poor perfusion, oliguria, or altered consciousness",
      "Bilious vomiting, rapidly increasing distention, or substantial rectal bleeding",
      "Recurrent colicky pain, pallor, vomiting, or lethargy after apparent reduction"
    ], [
      "Teach caregivers that repeated waves of pain, unusual sleepiness, vomiting, or bloody mucus stool need urgent evaluation; all classic signs do not have to occur together.",
      "After reduction, follow the feeding and observation plan and return immediately if episodic pain, leg drawing, pallor, vomiting, bloody stool, fever, or distention returns."
    ]),
    card("Necrotizing enterocolitis", ["apsa-pediatrics", "aha-neonatal"], [
      "Stop enteral feeds, place the prescribed gastric decompression tube, measure output, and avoid unnecessary abdominal pressure because bowel rest and decompression reduce distention while ischemic intestine is evaluated.",
      "Measure abdominal girth at a consistent landmark, inspect color and veins, auscultate cautiously, and document tenderness, stool blood, emesis, and feeding residual trends because subtle progression can precede perforation.",
      "Obtain ordered blood count, platelets, cultures, blood gas, lactate, electrolytes, and serial abdominal imaging and trend rather than isolate results because acidosis, thrombocytopenia, and portal venous gas indicate worsening injury.",
      "Administer prescribed broad-spectrum antibiotics and fluid, blood-product, respiratory, and perfusion support through carefully managed access because sepsis and capillary leak can cause shock while excessive fluid worsens edema.",
      "Maintain thermoregulation, strict intake and output, pain assessment, and parenteral nutrition and use clustered care because premature infants have limited physiologic reserve and prolonged bowel rest threatens growth.",
      "Escalate immediately for free intraperitoneal air, fixed dilated loop, abdominal wall erythema or discoloration, increasing lactate or acidosis, falling platelets, hypotension, oliguria, or apnea because perforation and necrosis require urgent surgical evaluation."
    ], [
      "Free intraperitoneal air, fixed bowel loop, or rapidly worsening pneumatosis on imaging",
      "Dusky, erythematous, shiny, markedly tender, or rapidly enlarging abdomen",
      "Worsening metabolic acidosis, rising lactate, falling platelets, or uncontrolled bleeding",
      "Apnea, temperature instability, hypotension, oliguria, or escalating ventilatory support"
    ], [
      "Explain that feeds are stopped to protect an inflamed or injured intestine and nutrition will be provided another way until bowel recovery is demonstrated.",
      "Prepare families for serial examinations and imaging; report new abdominal color change, swelling, bloody stool, vomiting, temperature change, or unusual sleepiness immediately after discharge."
    ]),
    card("Meconium aspiration syndrome", ["aha-neonatal"], [
      "At birth, follow neonatal-resuscitation ventilation priorities and avoid routine tracheal suction solely for meconium because ineffective breathing is corrected fastest by establishing ventilation, not delaying for automatic suction.",
      "Assess respiratory rate, grunting, retractions, air entry, oxygen saturation, preductal and postductal difference, and blood gases because airway obstruction, chemical pneumonitis, air leak, and persistent pulmonary hypertension can coexist.",
      "Titrate oxygen and ventilation to neonatal targets and monitor pressures closely because ball-valve obstruction can trap gas and aggressive ventilation increases pneumothorax risk.",
      "Maintain neutral temperature, check glucose, support perfusion, and cluster care because hypothermia, hypoglycemia, agitation, and acidosis raise pulmonary vascular resistance and worsen right-to-left shunting.",
      "Obtain cultures and administer antibiotics only within the clinical sepsis evaluation because meconium pneumonitis can resemble infection but unnecessary prolonged antibiotics have harms.",
      "Escalate for a rising preductal-postductal saturation difference, severe hypoxemia, hypotension, asymmetric breath sounds, sudden deterioration, or increasing ventilator pressure because persistent pulmonary hypertension or air leak may require advanced support."
    ], [
      "Severe or worsening hypoxemia despite escalating respiratory support",
      "Marked preductal-postductal saturation difference, hypotension, or signs of persistent pulmonary hypertension",
      "Sudden desaturation, bradycardia, asymmetric breath sounds, or transillumination concern for pneumothorax",
      "Progressive acidosis, poor perfusion, oliguria, seizure, or reduced responsiveness"
    ], [
      "Explain that meconium can block small airways and inflame the lungs; some newborns improve quickly while others need monitoring for air leak and high lung blood pressure.",
      "After discharge, keep follow-up for breathing, feeding, hearing, and development and seek urgent care for blue color, fast breathing, deep retractions, poor feeding, or unusual sleepiness."
    ]),
    card("Respiratory distress syndrome", ["espr-rds-2025", "aha-neonatal"], [
      "Assess grunting, retractions, respiratory rate, air entry, apnea, oxygen need, temperature, and blood gas trends because surfactant deficiency causes progressive alveolar collapse and fatigue in premature lungs.",
      "Apply prescribed continuous positive airway pressure early and verify interface fit, pressure delivery, skin integrity, gastric distention, and leak because distending pressure preserves functional residual capacity only when the system is effective.",
      "Prepare and administer surfactant by the ordered technique and monitor oxygen saturation, heart rate, tube position, and ventilator pressure because lung compliance can improve abruptly and make prior settings excessive.",
      "Titrate oxygen to the neonatal target and avoid large saturation swings because both hypoxemia and hyperoxia contribute to brain, lung, and retinal injury.",
      "Maintain thermoregulation, glucose, fluid balance, minimal handling, infection prevention, and safe nutrition because cold stress and excess fluid increase oxygen demand and pulmonary edema.",
      "Escalate for recurrent apnea, rising carbon dioxide, worsening acidosis, rapidly increasing oxygen or pressure, asymmetric breath sounds, hypotension, or reduced perfusion because exhaustion, patent ductus arteriosus, sepsis, or pneumothorax may be present."
    ], [
      "Recurrent apnea, bradycardia, exhaustion, or rising carbon dioxide with acidosis",
      "Rapidly increasing oxygen or ventilator-pressure requirement",
      "Sudden desaturation with asymmetric breath sounds or suspected pneumothorax",
      "Hypotension, poor perfusion, oliguria, temperature instability, or concern for sepsis"
    ], [
      "Explain that premature lungs may lack enough surfactant to stay open; CPAP and surfactant reduce collapse while the lungs mature.",
      "Teach families that monitor alarms, oxygen targets, hand hygiene, skin-to-skin timing, feeding, and follow-up are individualized; never change oxygen or equipment settings without the neonatal team."
    ]),
    card("Hydrocephalus", ["cns-hydrocephalus"], [
      "Measure infant head circumference with the same technique and trend fontanel tension, suture separation, scalp veins, eye position, vomiting, feeding, behavior, and development because increasing cerebrospinal-fluid pressure may appear as a growth trend before acute collapse.",
      "In older children, assess headache pattern, morning vomiting, vision, gait, school performance, continence, pupils, and consciousness because raised intracranial pressure presents differently after the skull sutures close.",
      "After shunt or endoscopic surgery, perform ordered neurologic checks, inspect the incision and tract, and monitor temperature, pain, abdominal symptoms, and cerebrospinal-fluid leakage because obstruction, infection, hemorrhage, and distal complications can occur.",
      "Position and mobilize according to the neurosurgical plan and avoid pumping or manipulating a shunt reservoir unless specifically ordered because unapproved pressure changes can overdrain or damage the system.",
      "Coordinate vision, hearing, therapy, school, bladder, and developmental follow-up because hydrocephalus and its cause can affect function even after pressure is controlled.",
      "Escalate immediately for repeated vomiting, bulging fontanel, rapidly enlarging head, sunset eyes, severe headache, bradycardia with hypertension, seizure, declining consciousness, fever, shunt redness, or fluid leakage because shunt failure or infection is a neurosurgical emergency."
    ], [
      "Declining consciousness, seizure, unequal pupils, or bradycardia with hypertension",
      "Bulging fontanel, rapidly increasing head circumference, sunset eyes, or repeated projectile vomiting",
      "Severe worsening headache, new gait or vision change, or abrupt loss of school or bladder function",
      "Fever, neck stiffness, shunt-tract redness or tenderness, wound drainage, or cerebrospinal-fluid leakage"
    ], [
      "Teach caregivers the child's own shunt-failure pattern and to treat repeated vomiting, unusual sleepiness, severe headache, behavior change, sunset eyes, or seizure as urgent rather than a routine stomach illness.",
      "Keep neurosurgery follow-up and carry the shunt type and revision history; do not press the reservoir or expose incisions to water until the surgical team says it is safe."
    ]),
    card("Child abuse and neglect", ["aap-child-abuse", "aap-sexual-abuse", "aap-trafficking"], [
      "Ensure immediate safety, treat urgent injuries, and separate the child from a suspected perpetrator for history when developmentally appropriate because medical stabilization and prevention of further harm come before investigative detail.",
      "Record spontaneous statements in quotation marks, obtain separate caregiver histories, and document who was present, timing, development, and changing explanations because objective contemporaneous detail is more useful than labels or conclusions.",
      "Perform a head-to-toe examination with consent and policy-guided photographs, body maps, growth, oral and genital findings, skin, neurologic status, and pain because occult injury may be distant from the presenting complaint.",
      "Use nonleading, open prompts and stop repeated questioning once essential medical information is obtained because suggestive interviewing can distress the child and compromise a forensic interview.",
      "Activate the mandated-reporting and child-protection process on reasonable suspicion without waiting for proof or confronting the suspected person because investigation belongs to protective and law-enforcement teams.",
      "Escalate for altered consciousness, vomiting, seizure, breathing difficulty, abdominal tenderness, genital bleeding, strangulation signs, unsafe discharge, or threats to the child or reporter because hidden head, abdominal, sexual, or airway injury can be fatal."
    ], [
      "Altered consciousness, seizure, repeated vomiting, unequal pupils, or concern for abusive head trauma",
      "Neck swelling, voice change, petechiae, breathing or swallowing difficulty, or reported strangulation",
      "Abdominal guarding, distention, shock, genital bleeding, severe pain, or difficulty walking",
      "Imminent unsafe discharge, perpetrator interference, threats, trafficking concern, or another child currently at risk"
    ], [
      "Tell the child in simple language that the harm was not their fault, they did the right thing by speaking, and the care team must involve people whose job is to keep children safe.",
      "Give the safe caregiver clear follow-up and emergency instructions without revealing protected location or investigative details to an unsafe person; use crisis and advocacy resources offered by the team."
    ]),
    card("Cystic fibrosis", ["cff-guidelines"], [
      "Assess cough, sputum, work of breathing, oxygen saturation, weight, stool pattern, appetite, hydration, and baseline lung function because a pulmonary exacerbation may first appear as reduced function or growth rather than fever.",
      "Coordinate bronchodilator when prescribed, airway-clearance therapy, inhaled mucolytic, and inhaled antibiotic in the ordered sequence because opening airways and mobilizing mucus improves delivery of later medicines.",
      "Use cystic-fibrosis infection-control precautions, obtain respiratory cultures by the center's method, and avoid close contact between patients with CF because resistant organisms can spread between people even when they look well.",
      "Give pancreatic enzymes with every fat- and protein-containing meal and snack, monitor stool quality and growth, and provide prescribed fat-soluble vitamins and calorie-dense nutrition because malabsorption worsens immunity and lung function.",
      "Monitor glucose, liver function, bone health, sodium and hydration during heat or exercise, and medication hearing and kidney risks because CF and repeated therapy affect multiple organs.",
      "Escalate for hemoptysis beyond streaking, pneumothorax symptoms, rapidly falling lung function, increasing oxygen need, severe dehydration or salt loss, distal intestinal obstruction symptoms, or poor response to the exacerbation plan because advanced complications require specialist treatment."
    ], [
      "Sudden chest pain, acute dyspnea, asymmetric breath sounds, or suspected pneumothorax",
      "More than minor blood-streaked sputum, recurrent hemoptysis, dizziness, or hemodynamic change",
      "Rapidly increasing work of breathing or oxygen need, falling lung function, or treatment failure",
      "Bilious vomiting, severe distention, absent stool, dehydration, confusion, or marked salt-loss symptoms"
    ], [
      "Perform airway clearance and inhaled medicines in the prescribed order even when feeling well, clean equipment exactly as taught, and call the CF center for increased cough, sputum, breathlessness, or reduced exercise tolerance.",
      "Take pancreatic enzymes with the first bites of every meal and snack, never crush enteric-coated beads, use the center's salt and hydration plan in heat, and track weight and stool changes."
    ]),
    card("Multiple sclerosis", ["aan-ms-dmt", "aan-ms-vaccine", "va-ms-relapse"], [
      "Establish the patient's neurologic baseline and map new vision, strength, sensation, balance, bladder, bowel, cognition, and fatigue changes with onset and duration because a true relapse requires new inflammatory dysfunction rather than a transient fluctuation.",
      "Check temperature, urine and respiratory symptoms, sleep, heat exposure, medication adherence, and metabolic triggers because infection or heat can temporarily worsen old deficits without representing a new demyelinating lesion.",
      "Administer prescribed relapse corticosteroid and monitor glucose, mood, sleep, blood pressure, and infection risk because steroids shorten relapse recovery but do not treat infection or provide long-term disease control.",
      "Review disease-modifying therapy timing, pregnancy plans, vaccines, blood counts, liver tests, and agent-specific infection screening because immune modification can cause serious toxicity and rebound may follow abrupt interruption.",
      "Use energy conservation, cooling, mobility aids, fall prevention, pressure protection, bladder scheduling, and therapy referral because fatigue, weakness, spasticity, and sensory loss compound injury risk.",
      "Escalate for rapidly progressive weakness, inability to walk, new severe visual loss, dysphagia, breathing difficulty, urinary retention with fever, acute confusion, or suicidal thinking because spinal, brainstem, infectious, or psychiatric complications require urgent evaluation."
    ], [
      "Rapidly progressive weakness, new inability to stand, or ascending functional loss",
      "New severe vision loss, painful eye movement with major deficit, dysphagia, or dysarthria",
      "Breathing difficulty, weak cough, aspiration, or reduced oxygen saturation",
      "Fever with urinary retention, acute confusion, severe medication reaction, or suicidal thinking"
    ], [
      "Teach the difference between a relapse and a pseudo-relapse: new symptoms lasting more than a day need contact, while fever or heat may briefly reactivate old symptoms and still needs trigger assessment.",
      "Use planned rest, cooling, safe exercise, bladder and bowel routines, and prescribed mobility aids; never stop a disease-modifying medicine suddenly without the neurology plan."
    ]),
    card("Guillain-Barre syndrome", ["ean-gbs", "aha-pals"], [
      "Measure forced vital capacity, inspiratory force, respiratory rate, oxygenation, cough strength, voice, secretion handling, and bulbar function serially because oxygen saturation may remain normal until neuromuscular ventilation fails.",
      "Perform frequent strength and cranial-nerve assessments and document the highest level of weakness because rapidly ascending paralysis and new facial or bulbar involvement determine intensive-care and airway needs.",
      "Place the patient on continuous cardiac and blood-pressure monitoring and change position slowly because autonomic neuropathy can cause abrupt bradycardia, dysrhythmia, hypertension, hypotension, urinary retention, and ileus.",
      "Administer prescribed IV immune globulin or plasma exchange and monitor thrombosis, renal function, hemolysis, line complications, and hemodynamic response because these treatments shorten disease progression but carry distinct hazards.",
      "Prevent immobility complications with venous-thromboembolism measures, pressure relief, passive range of motion, eye and mouth care, nutrition and swallow assessment, bladder and bowel management, and communication support.",
      "Escalate immediately for falling vital capacity, weak cough, inability to lift the head, pooling secretions, dysphagia, labile blood pressure, sustained dysrhythmia, or rapidly ascending weakness because planned intubation is safer than crash airway management."
    ], [
      "Falling forced vital capacity or inspiratory force, weak cough, or inability to count or speak normally",
      "Pooling secretions, dysphagia, aspiration, facial weakness, or inability to lift the head",
      "Severe blood-pressure lability, bradycardia, tachyarrhythmia, syncope, or chest pain",
      "Rapidly ascending weakness, new quadriparesis, urinary retention with autonomic instability, or ileus"
    ], [
      "Explain that sensation and thinking may remain intact while muscles weaken, so establish a reliable yes-no signal and communication method before speech or hand movement declines.",
      "Recovery often takes weeks to months; use therapy and fatigue pacing, protect numb skin, and seek urgent help for weaker breathing, swallowing, voice, cough, or rapidly spreading weakness."
    ]),
    card("Hemorrhagic stroke", ["aha-stroke"], [
      "Activate the stroke pathway, document last-known-well and anticoagulant or antiplatelet use, check bedside glucose, and obtain emergency noncontrast brain imaging because hemorrhage cannot be distinguished reliably from ischemia by symptoms alone.",
      "Perform frequent standardized neurologic checks including consciousness, pupils, language, gaze, motor function, headache, and vomiting because early expansion and rising intracranial pressure can cause rapid deterioration.",
      "Maintain airway and oxygenation, elevate the head when appropriate, keep the neck neutral, limit straining, treat fever, and manage glucose because hypoxemia, venous obstruction, hyperthermia, and extremes of glucose worsen secondary brain injury.",
      "Administer ordered anticoagulant reversal and blood-pressure therapy promptly while avoiding unprescribed rapid pressure reduction because ongoing bleeding must be limited without compromising cerebral perfusion.",
      "Keep the patient fasting until swallow screening, use aspiration precautions, and coordinate neurosurgery, repeat imaging, and venous-thromboembolism prevention because dysphagia, hydrocephalus, and immobility create additional hazards.",
      "Escalate immediately for decreasing consciousness, new anisocoria, repeated vomiting, seizure, worsening deficit, bradycardia with hypertension, acute hypoxemia, or sudden severe headache because expansion, herniation, hydrocephalus, or rebleeding may be occurring."
    ], [
      "Decreasing consciousness, new unequal or fixed pupils, or loss of brainstem reflexes",
      "Worsening focal deficit, repeated vomiting, seizure, or abrupt severe headache",
      "Bradycardia with hypertension, irregular respirations, or rapidly increasing oxygen requirement",
      "New bleeding, anticoagulant reversal delay, acute hydrocephalus, or sudden hemodynamic instability"
    ], [
      "Teach families that food, drink, and pills wait until swallowing is tested because a stroke can silently impair airway protection.",
      "Call emergency services for any sudden face droop, arm weakness, speech or vision change, severe new headache, imbalance, seizure, or reduced alertness; do not drive or wait for symptoms to improve."
    ]),
    card("TIA", ["aha-tia"], [
      "Treat transient face, arm, speech, vision, balance, or sensory loss as an active stroke emergency and document exact onset, duration, last-known-well, recurrence, and residual deficit because symptom resolution does not remove the early stroke risk.",
      "Check bedside glucose and complete standardized neurologic, cardiac rhythm, blood-pressure, and vascular assessment because hypoglycemia mimics TIA and atrial fibrillation or carotid disease may reveal the embolic source.",
      "Prepare for urgent brain and vascular imaging, electrocardiography, and ordered blood testing without delaying emergency evaluation because tissue injury and high-risk stenosis may be present despite a normal examination.",
      "Administer prescribed antiplatelet, anticoagulant, statin, or blood-pressure therapy only after hemorrhage and contraindications are addressed because prevention must match the mechanism rather than use interchangeable drugs.",
      "Reassess for recurrent deficits during the visit and ensure closed-loop rapid stroke-clinic or hospital follow-up because stroke risk is concentrated in the first hours and days.",
      "Escalate immediately for any recurrent or persistent focal deficit, severe headache, syncope, seizure, chest pain, dysrhythmia, or inability to complete urgent workup because the event may now be an evolving stroke or cardiac emergency."
    ], [
      "Any recurrent or persistent face, arm, speech, vision, balance, or sensory deficit",
      "New severe headache, vomiting, seizure, reduced consciousness, or syncope",
      "Atrial fibrillation with instability, chest pain, or other suspected cardioembolic emergency",
      "Critical vascular stenosis, acute infarction, or inability to secure rapid specialist evaluation"
    ], [
      "Explain that a TIA is a warning from temporary brain ischemia, not a harmless spell; call emergency services immediately even if symptoms disappear before help arrives.",
      "Use a medication list and follow the individualized antiplatelet or anticoagulant plan exactly, address tobacco and blood-pressure risks, and never combine blood thinners without clinician direction."
    ]),
    card("Epilepsy", ["aes-epilepsy"], [
      "Characterize each event's onset, awareness, eye and head position, motor pattern, duration, triggers, recovery, injury, and witness video when safe because accurate semiology distinguishes seizure type and guides therapy.",
      "During a seizure, protect the head, remove hazards, loosen restrictive clothing, position laterally when possible, time the event, and support oxygenation without restraining limbs or placing anything in the mouth because forced intervention causes injury and does not stop cortical activity.",
      "Give the prescribed rescue medicine at the individualized time threshold and activate emergency response for prolonged or recurrent seizures because treatment delay increases resistance, hypoxemia, acidosis, and neuronal injury.",
      "Check glucose and assess breathing, trauma, pregnancy, fever, missed medication, substance exposure, and neurologic recovery because reversible triggers and complications require treatment beyond seizure termination.",
      "Review antiseizure medication dose, adherence, interactions, levels when appropriate, mood, pregnancy plans, bone health, and organ-specific laboratory monitoring because toxicity and abrupt withdrawal can both provoke harm.",
      "Escalate for a seizure lasting five minutes, repeated seizures without recovery, new focal deficit, pregnancy, serious injury, persistent hypoxemia, fever with meningismus, or failure to return toward baseline because status epilepticus or another acute brain process may be present."
    ], [
      "Seizure lasting five minutes or the patient's earlier prescribed rescue threshold",
      "Repeated seizures without recovery, persistent hypoxemia, or impaired airway protection",
      "New focal deficit, severe headache, fever with neck stiffness, or prolonged postictal state",
      "Seizure during pregnancy, in water, after major trauma, or with serious injury"
    ], [
      "Teach witnesses to time the seizure, cushion the head, turn the person on the side, use rescue medicine as prescribed, and never restrain or put an object, food, drink, or pill in the mouth.",
      "Take antiseizure medicine consistently and do not stop abruptly; follow individualized guidance for driving, bathing, swimming, heights, sleep, alcohol, contraception, and pregnancy planning."
    ]),
    card("Encephalitis", ["idsa-encephalitis"], [
      "Recognize fever with altered behavior, memory, consciousness, focal deficit, or seizure and activate urgent neurologic and infectious evaluation because early encephalitis can resemble intoxication, psychosis, or a routine viral illness.",
      "Obtain blood cultures and prepare for brain imaging, lumbar puncture, cerebrospinal-fluid studies, and electroencephalography without delaying prescribed empiric acyclovir because herpes encephalitis causes preventable injury when treatment is late.",
      "Perform frequent neurologic checks of consciousness, pupils, language, motor function, behavior, and seizure activity because cerebral edema and nonconvulsive seizures may progress without dramatic convulsions.",
      "Maintain airway protection, aspiration precautions, temperature and glucose control, seizure precautions, and measured fluid and electrolyte management because hypoxemia, fever, hyponatremia, and hypotonic fluid worsen brain swelling.",
      "Monitor renal function, urine output, hydration, and IV access during acyclovir and review antimicrobial doses because crystalluria and kidney injury can interrupt time-critical therapy.",
      "Escalate for declining consciousness, recurrent seizure, new anisocoria, focal deterioration, bradycardia with hypertension, respiratory failure, shock, or rapidly falling sodium because status epilepticus, herniation, sepsis, or SIADH may be developing."
    ], [
      "Declining consciousness, new unequal pupils, posturing, or bradycardia with hypertension",
      "Seizure lasting five minutes, repeated seizures, or concern for nonconvulsive status",
      "New focal weakness, aphasia, rapidly worsening behavior, or loss of airway protection",
      "Shock, respiratory failure, oliguria during acyclovir, or rapidly worsening hyponatremia"
    ], [
      "Explain that encephalitis is inflammation of brain tissue and can affect memory, behavior, movement, and seizures; early antiviral treatment may begin before every test result returns.",
      "After recovery, keep neurology, therapy, school or work, mood, and seizure follow-up and seek urgent help for recurrent fever, confusion, seizure, weakness, severe headache, or unusual sleepiness."
    ]),
    card("Dementia", ["nice-dementia"], [
      "Establish baseline cognition, communication, function, behavior, sleep, sensory aids, medication management, and caregiver observations because a sudden change from baseline suggests delirium or illness rather than inevitable dementia progression.",
      "Screen acute worsening for pain, infection, hypoxemia, glucose abnormality, dehydration, constipation, urinary retention, medication toxicity, stroke, and environmental disruption because treating the cause can reverse superimposed delirium.",
      "Use the person's preferred name, one-step language, eye-level approach, adequate time, familiar routine, glasses, hearing aids, and calm validation because impaired processing makes rushed correction and confrontation increase distress.",
      "Assess swallowing, weight, oral health, hydration, gait, falls, skin, continence, driving, cooking, wandering, finances, and medication access because functional hazards often cause more immediate harm than the memory score.",
      "Review cognitive and psychotropic medicines for benefit, orthostasis, anticholinergic burden, QT effects, sedation, and falls and use non-drug behavior strategies first because medication adverse effects can worsen cognition and mortality risk.",
      "Escalate for abrupt focal deficit, sudden reduced consciousness, fever, new inability to walk or swallow, repeated falls, unsafe wandering, violence, caregiver collapse, or suspected abuse because acute illness or unsafe care requires immediate intervention."
    ], [
      "Abrupt focal neurologic deficit, sudden confusion, seizure, or reduced consciousness",
      "Fever, hypoxemia, dehydration, urinary retention, severe pain, or acute functional decline",
      "New choking, aspiration, repeated falls, wandering into danger, or medication mismanagement",
      "Suicidal behavior, violence, suspected abuse or neglect, or caregiver unable to maintain safety"
    ], [
      "Keep routines and surroundings predictable, use short choices and visual cues, check hearing and vision, and respond to the emotion behind a mistaken belief rather than repeatedly arguing about facts.",
      "Create early plans for medications, driving, finances, advance care, respite, identification, and emergency contacts while the person can participate; report any sudden change as a medical problem."
    ]),
    card("Mania", ["apa-bipolar"], [
      "Assess suicide, aggression, impulsivity, command hallucinations, sexual or financial risk, access to weapons, substance use, sleep loss, and ability to meet basic needs because euphoric mood does not exclude lethal risk or psychosis.",
      "Reduce stimulation, use a calm consistent approach, set brief neutral limits, offer simple choices, and avoid power struggles because distractibility and impaired judgment make lengthy confrontation escalate behavior.",
      "Provide portable high-calorie food, fluids, scheduled rest, hygiene prompts, and supervised activity and track intake, weight, sleep, and exhaustion because severe psychomotor activation can cause dehydration and physiologic collapse.",
      "Administer prescribed mood stabilizer or antipsychotic and monitor level, kidney, thyroid, liver, blood count, pregnancy, metabolic, QT, extrapyramidal, and sedation risks appropriate to the agent because toxicity can mimic or compound psychiatric deterioration.",
      "Protect boundaries and the rights of other patients, redirect intrusive or sexual behavior, and secure money, devices, driving access, and valuables with consent and policy because disinhibition can create lasting harm.",
      "Escalate for suicidal or homicidal intent, command hallucinations, escalating violence, delirious mania, refusal of all fluid, severe exhaustion, hyperthermia, rigidity, seizure, or medication toxicity because emergency containment and medical evaluation may be required."
    ], [
      "Suicidal or homicidal intent, weapon access, command hallucinations, or escalating violence",
      "No meaningful sleep with severe agitation, confusion, catatonia, or delirious mania",
      "Refusal of fluid, dehydration, hyperthermia, exhaustion, or cardiovascular instability",
      "Rigidity, fever, altered consciousness, seizure, severe rash, or suspected lithium or valproate toxicity"
    ], [
      "Teach the patient and support person that reduced need for sleep, faster speech, increased spending, irritability, grand plans, and missed medicine are early relapse signals that warrant prompt contact.",
      "Keep a regular sleep and medication schedule, avoid alcohol and stimulants, postpone major financial or legal decisions during activation, and use the written crisis plan before judgment worsens."
    ]),
    card("Schizophrenia", ["apa-schizophrenia"], [
      "Assess suicide, self-neglect, aggression, command hallucinations, persecutory fear, catatonia, substance use, and access to weapons with direct nonjudgmental questions because internal stimuli and hopelessness can create concealed risk.",
      "Acknowledge the emotion without validating the delusion, present reality briefly, reduce stimulation, and avoid whispering, arguing, or sudden touch because confrontation and ambiguous behavior can intensify fear.",
      "Administer prescribed antipsychotic and monitor orthostasis, QT risk, weight, waist, glucose, lipids, prolactin effects, constipation, extrapyramidal symptoms, tardive dyskinesia, and adherence because preventable adverse effects drive morbidity and discontinuation.",
      "Check temperature, rigidity, consciousness, autonomic signs, hydration, creatine kinase, and urgent medical status when neuroleptic malignant syndrome is possible because continued dopamine blockade can be fatal.",
      "Support sleep, nutrition, hygiene, oral care, smoking review, housing, benefits, family education, and coordinated psychosocial rehabilitation because negative and cognitive symptoms impair function even when hallucinations improve.",
      "Escalate for suicidal or homicidal intent, dangerous commands, severe agitation, inability to eat or drink, catatonia, acute confusion, fever with rigidity, or abrupt medication reaction because psychiatric and medical emergencies may coexist."
    ], [
      "Suicidal or homicidal intent, weapon access, or command hallucinations directing harm",
      "Severe agitation, escalating paranoia, inability to maintain safety, or violent behavior",
      "Fever, lead-pipe rigidity, altered consciousness, autonomic instability, or rapidly rising creatine kinase",
      "Catatonia, refusal of food or fluid, severe self-neglect, or acute confusion inconsistent with baseline"
    ], [
      "Explain that hearing or believing something does not require acting on it; use the crisis plan and tell a trusted person immediately when voices give commands or fear becomes hard to manage.",
      "Take medication consistently, report movement changes, severe constipation, fever or stiffness, and keep metabolic checks; ask about long-acting treatment if daily dosing is difficult rather than stopping abruptly."
    ]),
    card("Major depressive disorder", ["apa-depression", "va-dod-suicide"], [
      "Ask directly about thoughts of death, suicide plan, intent, means, rehearsal, prior attempts, substance use, protective factors, and reasons for living because vague reassurance does not reveal imminent risk.",
      "Match observation and environmental safety to the assessed risk, remove accessible hazards, communicate transitions and leave status, and create a collaborative safety plan because risk can increase when energy returns before hopelessness improves.",
      "Assess sleep, appetite, weight, hydration, pain, psychomotor change, cognition, pregnancy, bipolar history, psychosis, and medical or medication causes because treatment differs for bipolar depression, delirium, grief, endocrine disease, and substance effects.",
      "Administer prescribed antidepressant and monitor activation, agitation, akathisia, serotonin toxicity, bleeding, sodium, QT, sexual effects, and emerging mania as agent-appropriate because early adverse effects may precede mood benefit.",
      "Set small achievable goals for food, hygiene, daylight, movement, social contact, and therapy and document function rather than demanding cheerfulness because behavioral recovery often begins before subjective mood shifts.",
      "Escalate immediately for active suicide intent or preparation, command hallucinations, psychotic depression, catatonia, refusal of food or fluid, new mania, severe agitation, or serotonin syndrome because urgent psychiatric or medical treatment is needed."
    ], [
      "Active suicide intent, specific plan, available means, rehearsal, escalating inability to maintain immediate safety, or inability to participate in a collaborative safety plan",
      "Command hallucinations, psychotic guilt, catatonia, or severe self-neglect",
      "Refusal of food or fluid, profound dehydration, stupor, or rapid functional collapse",
      "New mania, severe activation or akathisia, fever with clonus, or other serious medication reaction"
    ], [
      "Teach that antidepressant benefit usually develops over weeks, but agitation, suicidal thinking, or unusually high energy can change earlier and should be reported immediately.",
      "Use the written safety plan: recognize warning signs, reduce access to lethal means, contact supports and crisis services, and call emergency services when intent or immediate danger is present."
    ]),
    card("Schizoaffective disorder", ["apa-schizophrenia", "apa-bipolar", "apa-depression", "dsm-schizoaffective"], [
      "Assess psychosis, depression, mania, suicide, aggression, commands, substance use, sleep, and function on a longitudinal timeline because schizoaffective disorder requires a period of psychosis without a major mood episode as well as major mood episodes during most of the illness; that timing distinguishes it from a mood disorder with psychotic features or schizophrenia and changes treatment and risk assessment.",
      "Use calm reality-based communication, acknowledge distress without endorsing delusions, and reduce stimulation during paranoia or activation because arguing increases mistrust while excessive stimulation worsens mania.",
      "Administer prescribed antipsychotic, mood stabilizer, or antidepressant and monitor metabolic, QT, movement, kidney, thyroid, liver, blood-count, sodium, and activation risks specific to the regimen because polypharmacy can create overlapping toxicity.",
      "Track sleep, intake, hygiene, spending, activity, withdrawal, speech, hallucinations, and adherence because movement between depressive and manic states may be visible in behavior before the patient identifies it.",
      "Coordinate family-supported relapse planning, psychotherapy, substance treatment, housing, benefits, and long-acting medication discussion because fragmented care increases relapse and hospitalization.",
      "Escalate for suicidal or homicidal intent, dangerous commands, severe agitation, mania without sleep, catatonia, refusal of food or fluid, fever with rigidity, or acute confusion because psychiatric destabilization and medication emergencies require rapid action."
    ], [
      "Suicidal or homicidal intent, weapon access, or command hallucinations directing harm",
      "Escalating mania, no sleep, severe impulsivity, psychosis, or inability to maintain safety",
      "Catatonia, refusal of food or fluid, severe self-neglect, or rapidly declining function",
      "Fever with rigidity, altered consciousness, severe rash, seizure, or suspected medication toxicity"
    ], [
      "Track both mood and psychosis warning signs: sleep loss, faster thoughts, spending, withdrawal, hopelessness, suspiciousness, or stronger voices should trigger early contact.",
      "Take medicines consistently, avoid abrupt stopping and intoxicants, keep laboratory and movement checks, and involve a trusted support person in the crisis and adherence plan."
    ]),
    card("Substance withdrawal syndromes", ["asam-withdrawal", "samhsa-withdrawal", "asam-benzodiazepine", "asam-stimulant"], [
      "Identify every substance, formulation, amount, route, last use, pattern, prior withdrawal, seizures, delirium, overdose, pregnancy, and coexisting illness because alcohol, benzodiazepine, opioid, stimulant, and sedative withdrawal have different timelines and lethality.",
      "Use the substance-appropriate validated scale only after a clinical assessment and monitor vital signs, consciousness, pupils, tremor, sweating, vomiting, pain, hallucinations, and suicidality because a score can be distorted by infection, trauma, psychosis, or mixed withdrawal.",
      "Place patients at seizure or delirium risk on appropriate observation and cardiac, oxygen, fall, and aspiration precautions because alcohol and sedative withdrawal can progress abruptly even after an initially mild presentation.",
      "Administer prescribed substance-specific treatment and reassess sedation, breathing, symptoms, blood pressure, and response because benzodiazepines treat alcohol withdrawal while opioid agonist strategies treat opioid withdrawal and are not interchangeable.",
      "Correct dehydration, glucose and electrolyte problems, give thiamine when alcohol malnutrition is possible, support sleep and nutrition, and avoid punitive care because physiologic stress amplifies symptoms and undermines engagement.",
      "Escalate for seizure, delirium, hallucinations with autonomic instability, severe vomiting or diarrhea, chest pain, pregnancy complication, respiratory depression after treatment, suicidal intent, or uncertain mixed ingestion because withdrawal, toxicity, and medical illness may coexist."
    ], [
      "Seizure, delirium, severe confusion, or hallucinations with autonomic instability",
      "Chest pain, dysrhythmia, severe hypertension, hypotension, hyperthermia, or rhabdomyolysis concern",
      "Uncontrolled vomiting or diarrhea, severe dehydration, electrolyte disturbance, or acute kidney injury",
      "Respiratory depression after medication, pregnancy complication, suicidal intent, or suspected mixed overdose"
    ], [
      "Explain that withdrawal risk depends on the substance and pattern; alcohol and benzodiazepine withdrawal can be fatal, while opioid withdrawal is intensely distressing and greatly raises relapse and overdose risk.",
      "Use supervised treatment rather than abruptly stopping alone, carry naloxone when opioid exposure is possible, and arrange direct ongoing addiction care because detoxification without treatment lowers tolerance but not relapse risk."
    ]),
    card("Alcohol withdrawal", ["asam-withdrawal"], [
      "Document last drink, usual amount, prior seizures or delirium tremens, other sedatives, pregnancy, liver disease, trauma, infection, and baseline cognition because previous complicated withdrawal strongly predicts recurrence and mimics are common.",
      "Use a validated withdrawal scale only when the patient can participate and trend pulse, blood pressure, temperature, tremor, sweating, orientation, hallucinations, agitation, and sleep because worsening autonomic and cognitive findings signal progression.",
      "Administer prescribed benzodiazepine or protocol alternative and reassess symptoms, arousal, respiratory rate, oxygenation, and cumulative dose because undertreatment permits seizures while oversedation can mask deterioration or suppress breathing.",
      "Give thiamine promptly, address glucose without delaying treatment, and replace magnesium, potassium, phosphate, fluid, and nutrition as indicated because malnutrition and electrolyte depletion contribute to encephalopathy and dysrhythmia.",
      "Use seizure, fall, aspiration, and elopement precautions in a quiet well-lit setting with frequent orientation because perceptual disturbance, ataxia, and fluctuating judgment create injury risk.",
      "Escalate for seizure, disorientation, severe agitation, hallucinations with instability, hyperthermia, refractory tachycardia or hypertension, chest pain, dysrhythmia, or increasing sedative requirement because delirium tremens and resistant withdrawal need higher-level care."
    ], [
      "Withdrawal seizure, repeated seizure, or failure to recover toward baseline",
      "Disorientation, severe agitation, hallucinations, fever, and marked autonomic instability",
      "Chest pain, dysrhythmia, severe hypertension, hypotension, or hyperthermia",
      "Escalating benzodiazepine requirement, oversedation, respiratory depression, or suspected mixed sedative use"
    ], [
      "Teach that withdrawal can begin or worsen while alcohol is still measurable and can continue to progress after the level reaches zero for several days; do not use a positive alcohol level as reassurance or leave a high-risk person alone to detox.",
      "After stabilization, connect directly to ongoing alcohol-use treatment and relapse prevention; reduced tolerance makes return to prior amounts especially dangerous."
    ]),
    card("Delirium", ["sccm-delirium", "nice-delirium"], [
      "Screen for acute onset, fluctuating attention, disorganized thinking, and altered arousal with CAM, CAM-ICU, or 4AT as appropriate and compare with baseline cognition because hypoactive delirium is easily mistaken for depression, fatigue, or dementia.",
      "Check oxygen saturation, ventilation, bedside glucose, infection signs, pain, hydration, bladder scan for urinary retention, bowel history for constipation, and withdrawal risk because delirium is acute brain dysfunction caused by a physiologic or drug trigger.",
      "Obtain ordered urinalysis or cultures only when symptoms support infection and trend blood count, electrolytes, kidney and liver function, lactate, and medication levels when indicated because indiscriminate testing or treating asymptomatic bacteriuria can add harm without correcting delirium.",
      "Repeat the same delirium and arousal tool through the day and trend attention, sleep-wake reversal, intake, urine output, mobility, and behavior because fluctuation is diagnostic and response to cause correction is more meaningful than one calm examination.",
      "Restore glasses, hearing aids, daylight, clocks, familiar voices, hydration, sleep protection, and early assisted mobility with fall prevention because sensory deprivation, immobilization, and sleep fragmentation perpetuate delirium.",
      "Review anticholinergics, opioids, sedatives, steroids, and recent medication changes; avoid routine benzodiazepines except for alcohol or sedative withdrawal and use restraints only for immediate safety because these interventions commonly intensify confusion and immobility.",
      "Escalate for abrupt focal deficit, seizure or need for seizure precautions, reduced arousal, loss of airway protection, severe hypoxemia, shock, dangerous agitation, suspected withdrawal, or fever with rigidity because stroke, status epilepticus, sepsis, or medication toxicity may be present."
    ], [
      "Abrupt focal deficit, unequal pupils, seizure, or sudden reduced consciousness",
      "Severe hypoxemia, hypercapnia, hypoglycemia, shock, or sepsis-associated organ dysfunction",
      "Dangerous agitation despite de-escalation or inability to protect the airway",
      "Autonomic instability with tremor or hallucinations, or fever with rigidity after dopamine blockade"
    ], [
      "Explain that delirium is a sudden, often reversible change caused by illness, medicine, withdrawal, or body chemistry and differs from the slower course of dementia.",
      "Families can help with calm orientation, familiar facts, glasses, hearing aids, and a normal day-night routine; report every abrupt change rather than arguing with misperceptions."
    ]),
    card("Bipolar disorder", ["apa-bipolar"], [
      "Assess current depression, mania, mixed symptoms, psychosis, suicide, aggression, impulsivity, sleep, substance use, pregnancy, and access to lethal means because mixed and depressive episodes carry high suicide risk even without classic sadness.",
      "Track sleep, speech, energy, spending, sexual risk, appetite, activity, hopelessness, and psychosis against the person's baseline because episode direction determines safety and medication needs.",
      "Administer prescribed mood-stabilizing therapy and monitor lithium level, hydration, sodium, kidney and thyroid function or valproate level, liver, platelets, pregnancy, and agent-specific metabolic effects because narrow therapeutic margins and fetal risks require active surveillance.",
      "Protect sleep and reduce stimulation during activation while using small structured activity and nutrition goals during depression because regular circadian input supports recovery in both poles.",
      "Engage a trusted support person in relapse signs, medication adherence, finances, driving, childcare, and crisis steps because insight often declines early in mania and isolation increases depressive risk.",
      "Escalate for active suicide intent, severe mixed agitation, dangerous impulsivity, no sleep with worsening mania, command hallucinations, catatonia, inability to eat or drink, or medication toxicity because emergency psychiatric and medical care may be needed."
    ], [
      "Active suicide intent, preparation, available means, or severe mixed-state agitation",
      "No sleep with escalating mania, psychosis, dangerous spending, driving, aggression, or sexual risk",
      "Command hallucinations, catatonia, refusal of food or fluid, or inability to maintain basic safety",
      "Coarse tremor, vomiting, ataxia, confusion, severe rash, fever with rigidity, or other medication toxicity"
    ], [
      "Keep a stable sleep and wake schedule and track early warning signs such as less need for sleep, faster speech, spending, irritability, withdrawal, or hopelessness; contact the team before the episode becomes severe.",
      "Do not stop lithium, valproate, or an antipsychotic abruptly; maintain hydration, review interactions and pregnancy plans, and use the crisis plan whenever safety or judgment changes."
    ]),
    card("Bulimia nervosa", ["apa-eating"], [
      "Ask privately and nonjudgmentally about binge frequency, vomiting, laxatives, diuretics, fasting, exercise, substances, menstrual history, chest pain, fainting, self-harm, and suicide because normal weight and shame can hide severe illness.",
      "Obtain orthostatic vital signs, electrocardiography, glucose, electrolytes, bicarbonate, magnesium, phosphate, kidney tests, blood count, and pregnancy testing as indicated because purging can cause lethal hypokalemia, alkalosis, dehydration, and dysrhythmia.",
      "Monitor meals and the post-meal period with respectful agreed structure, restrict unobserved bathroom or exercise access when medically necessary, and document behavior without accusation because opportunity reduction supports interruption of the binge-purge cycle.",
      "Replace fluid and electrolytes cautiously and monitor rhythm during significant abnormalities because rapid or incomplete potassium correction does not remove ongoing arrhythmia risk while purging continues.",
      "Provide oral assessment and rinse with water or prescribed bicarbonate solution after vomiting while delaying tooth brushing because acid-softened enamel is damaged by immediate brushing.",
      "Escalate for syncope, chest pain, hematemesis, severe abdominal pain, QT prolongation, dysrhythmia, marked electrolyte abnormality, seizure, active suicide intent, or inability to stop purging because cardiac, gastrointestinal, and psychiatric emergencies can coexist."
    ], [
      "Syncope, chest pain, palpitations, prolonged QT, bradycardia, or dysrhythmia",
      "Severe hypokalemia, hypomagnesemia, hypophosphatemia, dehydration, or acute kidney injury",
      "Hematemesis, severe chest or abdominal pain, rigid abdomen, or concern for esophageal or gastric rupture",
      "Active suicide intent, repeated uncontrolled purging, seizure, or rapidly declining medical stability"
    ], [
      "Explain that electrolyte and heart complications can be severe at any body size; honest reporting of vomiting, laxatives, supplements, and exercise helps the team protect the heart without punishment.",
      "Use the structured meal and therapy plan, avoid compensatory exercise or purging, rinse after vomiting without immediate brushing, and seek urgent help for fainting, chest pain, blood, severe pain, or suicidal thoughts."
    ]),
    card("Appendicitis", ["wjes-abdomen"], [
      "Assess pain onset and migration, right-lower-quadrant tenderness, guarding, rebound, fever, vomiting, bowel symptoms, pregnancy possibility, and last intake because perforation risk and gynecologic or urinary mimics change the urgent plan.",
      "Keep the patient fasting, establish vascular access, provide prescribed isotonic fluid, analgesia, and antiemetic, and document serial abdominal findings because dehydration and pain require treatment while surgery remains possible.",
      "Obtain ordered blood count, metabolic studies, urinalysis, pregnancy test, and ultrasound or computed tomography without repeatedly palpating a painful abdomen because imaging confirms uncertain disease while excessive manipulation adds distress.",
      "Administer prescribed preoperative antibiotics on time and verify allergy and weight-based dosing because early coverage reduces bacterial spread when the inflamed appendix is removed or has perforated.",
      "Avoid heating pads, laxatives, enemas, and unapproved oral intake because increased motility or masked progression can delay recognition of rupture and peritonitis.",
      "Escalate for sudden diffuse or temporarily relieved pain followed by worsening illness, rigid abdomen, fever, tachycardia, hypotension, rising lactate, oliguria, or confusion because perforation, abscess, and sepsis require urgent source control."
    ], [
      "Rigid abdomen, rebound, diffuse guarding, or sudden pain change suggesting perforation",
      "Hypotension, persistent tachycardia, rising lactate, oliguria, or altered consciousness",
      "High fever, worsening leukocytosis, palpable mass, or persistent symptoms suggesting abscess",
      "Increasing pain, vomiting, distention, or inability to tolerate recovery after appendectomy"
    ], [
      "Do not eat, drink, use laxatives or enemas, or apply heat while appendicitis is being evaluated; these can interfere with urgent treatment or worsen risk.",
      "After treatment, report fever, increasing abdominal pain or swelling, vomiting, wound redness or drainage, inability to pass stool or gas, or faintness promptly."
    ]),
    card("Bowel obstruction", ["wjes-abdomen"], [
      "Determine prior surgery, hernia, cancer, stool and flatus, vomiting character, pain pattern, distention, medicines, and onset because adhesions, strangulated hernia, tumor, ileus, and large-bowel obstruction require different urgency.",
      "Keep the patient fasting, establish vascular access, administer measured isotonic fluid and electrolyte replacement, and maintain strict intake and output because vomiting and third spacing cause hypovolemia, kidney injury, and hypochloremic alkalosis.",
      "Insert and manage prescribed nasogastric decompression, verify placement and patency, quantify output, and provide oral and nasal care because decompression reduces vomiting and aspiration but creates ongoing fluid loss.",
      "Perform serial abdominal, pain, bowel-sound, hernia, stool, vital-sign, perfusion, and urine assessments and trend lactate and blood count because continuous pain, fever, and acidosis suggest ischemia rather than simple blockage.",
      "Avoid laxatives, enemas, prokinetic agents, and oral medicines unless the surgical team directs them because stimulating a mechanically obstructed or ischemic bowel can cause perforation.",
      "Escalate immediately for continuous severe pain, guarding, rebound, fever, tachycardia, hypotension, rising lactate, bloody stool, closed-loop imaging, free air, or feculent emesis because strangulation and perforation require emergency surgery."
    ], [
      "Continuous pain, guarding, rebound, rigidity, or pain out of proportion",
      "Fever, persistent tachycardia, hypotension, rising lactate, acidosis, or oliguria",
      "Bloody stool, feculent emesis, free air, closed-loop obstruction, or rapidly enlarging abdomen",
      "Sudden respiratory distress or aspiration during recurrent vomiting or tube malfunction"
    ], [
      "Explain why food and drink are withheld and the stomach tube is used: they reduce upstream pressure and aspiration while the team determines whether the bowel can recover or needs surgery.",
      "After discharge, follow the diet and activity plan and seek urgent care for recurrent cramping, persistent vomiting, abdominal swelling, inability to pass gas or stool, fever, or constant severe pain."
    ]),
    card("Cholecystitis", ["wjes-abdomen"], [
      "Assess right-upper-quadrant or epigastric pain, radiation, Murphy sign, fever, jaundice, vomiting, meal relation, pregnancy, and prior stones because cholangitis, pancreatitis, hepatitis, and cardiac disease can resemble gallbladder inflammation.",
      "Keep the patient fasting during acute evaluation, establish vascular access, provide ordered fluid, analgesia, and antiemetic, and monitor intake and output because vomiting and inflammation cause dehydration while procedures may be needed.",
      "Obtain ordered blood count, bilirubin, alkaline phosphatase, transaminases, lipase, cultures when febrile, and ultrasound because duct obstruction, pancreatitis, and systemic infection change timing and intervention.",
      "Administer prescribed antibiotics for suspected infection and prepare for early laparoscopic surgery or drainage when indicated because an obstructed infected gallbladder can gangrene or perforate.",
      "Monitor pain, temperature, jaundice, mental status, blood pressure, urine output, drain color and amount, and respiratory status after surgery because bile leak, abscess, bleeding, and atelectasis may complicate recovery.",
      "Escalate for jaundice with fever and hypotension or confusion, rigid abdomen, rapidly worsening pain, rising lactate, oliguria, or bilious drainage because ascending cholangitis, perforation, sepsis, or bile leak is time-critical."
    ], [
      "Fever with jaundice plus hypotension or confusion suggesting severe cholangitis",
      "Rigid abdomen, rebound, sudden diffuse pain, or concern for perforation",
      "Rising lactate, oliguria, persistent tachycardia, or sepsis-associated organ dysfunction",
      "Increasing bilious drain or wound output, abdominal distention, or worsening pain after surgery"
    ], [
      "During recovery, use the prescribed lower-fat meal pattern and reintroduce foods gradually; dietary change reduces symptom triggers but does not dissolve an acutely obstructing stone.",
      "Seek urgent care for fever, jaundice, dark urine, pale stool, severe persistent upper-abdominal pain, repeated vomiting, confusion, or faintness."
    ]),
    card("Esophageal varices", ["aasld-portal", "acg-bleeding"], [
      "Treat hematemesis or melena in cirrhosis as a major hemorrhage, assess airway protection, mental status, perfusion, and aspiration risk, and activate the bleeding pathway because variceal blood loss can be massive before hypotension appears.",
      "Establish two large-bore vascular lines, obtain blood count, coagulation, metabolic and liver studies, fibrinogen, lactate, and type and crossmatch, and trend them because hemoglobin may initially underestimate acute loss.",
      "Administer prescribed vasoactive therapy and antibiotic prophylaxis promptly and prepare for urgent endoscopy because reducing portal inflow and preventing infection improve bleeding control and survival.",
      "Give blood products to the individualized target and reassess lungs, pressure, urine, mentation, and ongoing loss because overtransfusion can raise portal pressure while under-resuscitation worsens shock.",
      "Keep the patient fasting, use aspiration precautions, avoid blind nasogastric insertion unless directed, and prepare rescue balloon tamponade or transjugular shunt only with expert airway and critical-care support because these are bridges for uncontrolled bleeding.",
      "Escalate for active large-volume hematemesis, inability to protect the airway, hypotension, rising lactate, oliguria, worsening encephalopathy, recurrent bleeding, or transfusion reaction because airway control and definitive hemostasis cannot wait."
    ], [
      "Active large-volume hematemesis, aspiration, or inability to protect the airway",
      "Hypotension, rising lactate, oliguria, cool mottled skin, or altered consciousness",
      "Recurrent hematemesis or melena with falling hemoglobin after initial hemostasis",
      "Worsening hepatic encephalopathy, severe coagulopathy, or transfusion reaction"
    ], [
      "Teach patients with cirrhosis to seek emergency care for vomiting blood, black tarry stool, fainting, confusion, or rapid weakness and not to drive themselves.",
      "Take portal-pressure and liver medicines exactly as prescribed, avoid NSAIDs and alcohol, keep endoscopy follow-up, and ask before using supplements because rebleeding prevention is continuous."
    ]),
    card("GI bleeding", ["acg-bleeding", "acg-lower-bleeding"], [
      "Identify hematemesis, coffee-ground emesis, melena, maroon stool, bright-red bleeding, NSAID or anticoagulant use, liver disease, prior ulcers, syncope, and pain because source and medication exposure determine urgency and treatment.",
      "Assess airway, mental status, orthostatic and supine vital signs, skin perfusion, urine output, and ongoing visible loss and use continuous monitoring when unstable because compensated shock may precede a blood-pressure fall.",
      "Establish large-bore access and obtain serial blood count, platelets, coagulation, metabolic studies, lactate, and type and crossmatch because initial hemoglobin can look normal before equilibration.",
      "Administer prescribed fluid, blood products, acid suppression, vasoactive therapy, antibiotics, or anticoagulant reversal according to the suspected source and reassess after each intervention because therapies are not interchangeable across ulcer, variceal, and lower bleeding.",
      "Keep the patient fasting, protect against aspiration, prepare bowel preparation or urgent endoscopy as directed, and verify medication holds with the treating team because diagnostic timing and hemostasis depend on stability.",
      "Escalate for active large-volume bleeding, shock, chest pain, syncope, reduced consciousness, rising lactate, oliguria, recurrent bleeding, or transfusion reaction because hemorrhagic shock and demand ischemia can progress rapidly."
    ], [
      "Active hematemesis, large maroon stool, uncontrolled rectal bleeding, or aspiration",
      "Hypotension, syncope, chest pain, rising lactate, oliguria, or altered consciousness",
      "Falling hemoglobin with recurrent melena or hematemesis after treatment",
      "Fever, wheeze, flank pain, hypoxemia, or hypotension during transfusion"
    ], [
      "Seek emergency care for vomiting blood, black tarry stool, maroon bleeding, fainting, chest pain, confusion, or sudden severe weakness; a slow-looking bleed can still be dangerous.",
      "Avoid NSAIDs and unapproved alcohol or supplements, follow the acid-suppression or liver plan, and do not stop or restart anticoagulants without the clinician balancing bleeding and clot risk."
    ]),
    card("Hepatitis B", ["cdc-hepb"], [
      "Clarify acute versus chronic infection by reviewing hepatitis B surface antigen, surface antibody, core antibody type, e antigen, viral DNA, liver enzymes, bilirubin, and prior results because a single positive marker does not define infectivity or disease phase.",
      "Assess fatigue, nausea, jaundice, pruritus, abdominal swelling, bleeding, confusion, medication and supplement use, alcohol, pregnancy, and coinfection risk because liver failure and transmission decisions depend on the whole context.",
      "Trend liver tests, bilirubin, INR, albumin, blood count, viral DNA, kidney function, and fibrosis or ultrasound surveillance as ordered because normal symptoms do not exclude progressive fibrosis or hepatocellular carcinoma.",
      "Administer prescribed antiviral consistently and review renal dosing, interactions, pregnancy plan, and refill continuity because abrupt interruption can trigger a severe hepatitis flare.",
      "Use standard precautions and teach no sharing of needles, razors, toothbrushes, or glucose equipment, cover open wounds, use barrier protection until partners are immune, and arrange testing and vaccination of household and sexual contacts because blood and body-fluid exposure transmits HBV.",
      "Escalate for confusion, asterixis, rapidly deepening jaundice, bleeding, rising INR, hypoglycemia, severe abdominal distention, hematemesis, or abrupt enzyme flare after treatment interruption because acute liver failure or decompensation may be developing."
    ], [
      "Confusion, asterixis, reduced consciousness, or hypoglycemia",
      "Rapidly rising INR, spontaneous bleeding, deepening jaundice, or severe vomiting",
      "New ascites, dyspnea, fever with abdominal pain, hematemesis, or black stool",
      "Severe hepatitis flare during pregnancy, immunosuppression, chemotherapy, or after antiviral interruption"
    ], [
      "Explain that hepatitis B is not spread by hugging, coughing, food, or casual contact; prevent blood and sexual exposure and have close contacts tested and vaccinated.",
      "Keep antiviral refills and liver-cancer surveillance even when feeling well, avoid alcohol and unapproved herbs, and tell every clinician before chemotherapy, immune suppression, or pregnancy care."
    ]),
    card("Peptic ulcer disease", ["acg-bleeding", "acg-hpylori-2024"], [
      "Assess epigastric pain pattern, nocturnal symptoms, melena, hematemesis, anemia symptoms, NSAID and aspirin exposure, anticoagulants, tobacco, alcohol, prior Helicobacter pylori treatment, and alarm features because bleeding, perforation, malignancy, and medication injury change management.",
      "Obtain ordered blood count, iron studies, stool or breath H. pylori testing, and endoscopy and verify proton-pump-inhibitor, antibiotic, and bismuth timing because recent therapy can create false-negative infection tests.",
      "Administer the full prescribed acid-suppression and H. pylori eradication regimen, check allergies and interactions, and reinforce completion because partial antibiotic courses promote treatment failure and resistance.",
      "Review every prescription and over-the-counter NSAID, aspirin, steroid, anticoagulant, and supplement with the clinician because combined mucosal injury and impaired clotting greatly increase bleeding risk.",
      "Trend pain, stool color, emesis, orthostasis, hemoglobin, and intake and prepare urgent endoscopy when bleeding is suspected because visible bleeding may lag behind hemodynamic loss.",
      "Escalate for sudden severe generalized pain, rigid abdomen, hematemesis, melena with faintness, hypotension, rising lactate, persistent vomiting, progressive dysphagia, or unexplained weight loss because perforation, major bleeding, obstruction, or malignancy may be present."
    ], [
      "Sudden severe abdominal pain with rigidity, rebound, or free-air concern",
      "Hematemesis, black tarry stool, syncope, hypotension, rising lactate, or oliguria",
      "Persistent vomiting, early satiety with distention, or inability to tolerate intake",
      "Progressive dysphagia, unexplained weight loss, anemia, palpable mass, or recurrent ulcer despite treatment"
    ], [
      "Complete every H. pylori medicine and return for proof of cure at the correct interval; feeling better does not prove the infection is gone.",
      "Avoid NSAIDs unless the prescribing team approves protection, stop tobacco, limit personal food triggers, and seek emergency care for blood, black stool, fainting, or sudden rigid-abdomen pain."
    ]),
    card("UTI", ["idsa-uti"], [
      "Assess dysuria, frequency, urgency, suprapubic pain, hematuria, fever, flank pain, vaginal or urethral symptoms, pregnancy, catheter, retention, stones, and prior resistant organisms because cystitis, pyelonephritis, sexually transmitted infection, and vaginitis require different evaluation.",
      "Collect a clean-catch or freshly replaced-catheter urine specimen before antibiotics when feasible and avoid culturing from an old drainage bag because contamination and colonization can lead to unnecessary or misdirected treatment.",
      "Administer the prescribed antibiotic after verifying allergy, pregnancy, kidney function, culture history, and interactions and review culture results for narrowing because drug choice and duration depend on site and host risk.",
      "Monitor temperature, pain, oral intake, urine output, mental status in older adults, and clinical response within the expected interval because ascending infection and sepsis may present as functional decline rather than classic urinary pain.",
      "Remove an unnecessary catheter, maintain a closed unobstructed system below bladder level, assess postvoid residual when retention is suspected, and address constipation because urinary stasis and devices promote recurrence.",
      "Escalate for fever with flank pain, rigors, vomiting, pregnancy, hypotension, confusion, oliguria, obstruction, or failure to improve because pyelonephritis, infected obstruction, and urosepsis require urgent treatment."
    ], [
      "Fever, rigors, flank pain, persistent vomiting, or rapidly worsening illness",
      "Hypotension, confusion, tachypnea, rising lactate, or reduced urine output",
      "Pregnancy with urinary symptoms, fever, contractions, or reduced fetal movement",
      "Suspected retention or obstruction, known stone with infection, or no improvement on appropriate therapy"
    ], [
      "Take the antibiotic for the prescribed course, hydrate as individually appropriate, urinate regularly and after sex, and avoid using leftover antibiotics because the wrong drug can mask an ascending infection.",
      "Seek prompt care for fever, back or side pain, vomiting, pregnancy symptoms, confusion, faintness, or reduced urine; urinary odor or cloudiness alone does not prove infection."
    ]),
    card("Pyelonephritis", ["idsa-uti"], [
      "Assess fever, rigors, flank pain, costovertebral tenderness, vomiting, urinary symptoms, pregnancy, stones, instrumentation, immunosuppression, and prior resistant organisms because an infected obstructed kidney can deteriorate despite antibiotics.",
      "Obtain urine culture and ordered blood cultures, blood count, metabolic studies, lactate, pregnancy test, and imaging when obstruction or complication is suspected because microbiology and drainage need must be identified early.",
      "Administer prescribed antimicrobial promptly after cultures when this does not delay care, verify allergy and renal dosing, and review susceptibilities for narrowing because kidney parenchymal infection requires reliable tissue-active therapy.",
      "Give measured fluid and antiemetic support, track intake, urine output, creatinine, temperature, pain, pressure, and perfusion, and reassess frequently because vomiting, sepsis, and kidney injury alter resuscitation needs.",
      "Coordinate urgent urology or procedural drainage for infected obstruction, abscess, emphysematous infection, or failure to respond because antibiotics cannot sterilize a closed high-pressure infected system.",
      "Escalate immediately for hypotension, confusion, rising lactate, oliguria, severe uncontrolled pain, persistent vomiting, pregnancy with contractions, or imaging evidence of obstruction because septic shock, renal damage, and preterm labor are time-critical."
    ], [
      "Hypotension, confusion, tachypnea, rising lactate, mottling, or oliguria",
      "Stone or hydronephrosis with infection, anuria, solitary kidney, or rapidly rising creatinine",
      "Persistent fever or pain despite appropriate antibiotics, or suspected renal abscess",
      "Pregnancy with fever, contractions, fluid leakage, bleeding, or reduced fetal movement"
    ], [
      "Complete the prescribed antibiotic and attend culture follow-up even after fever improves; call if vomiting prevents doses or symptoms fail to improve within the expected time.",
      "Seek emergency care for faintness, confusion, reduced urine, severe flank pain, repeated vomiting, or worsening fever, and report any urinary infection during pregnancy promptly."
    ]),
    card("SIADH", ["endocrine-hyponatremia"], [
      "Confirm the pattern with serum sodium and osmolality, urine osmolality and sodium, glucose, kidney, thyroid, and adrenal assessment plus volume examination because SIADH is a diagnosis of hypotonic euvolemic hyponatremia after important mimics are excluded.",
      "Perform frequent neurologic checks for headache, nausea, confusion, gait change, seizure, and reduced consciousness because brain swelling depends on both sodium level and speed of decline.",
      "Implement the prescribed fluid restriction with exact intake accounting, oral-care strategies, daily weight, and strict output because unrecorded water from drinks, ice, flushes, and medications can defeat treatment.",
      "Trend serum sodium at the ordered frequency and document all saline, diuretic, urea, or vasopressin-antagonist therapy because overly rapid correction can cause osmotic demyelination even when the final sodium is normal.",
      "Review pain, nausea, pulmonary or brain disease, malignancy, and medicines such as SSRIs, anticonvulsants, and thiazides with the team because removing the trigger may be more durable than chronic fluid restriction.",
      "Escalate for seizure, vomiting with reduced consciousness, rapidly falling sodium, sodium below the emergency threshold, respiratory compromise, or correction faster than the prescribed limit because cerebral edema and osmotic demyelination are neurologic emergencies."
    ], [
      "Seizure, coma, severe confusion, repeated vomiting, or loss of airway protection",
      "Rapid sodium decline or severe symptomatic hyponatremia at the emergency threshold",
      "New respiratory compromise, bradycardia, hypertension, or other signs of cerebral edema",
      "Sodium correction exceeding the prescribed hourly or 24-hour limit, or new dysarthria, dysphagia, weakness, or altered behavior after correction"
    ], [
      "Teach the exact daily fluid allowance and what counts as fluid, including ice, gelatin, soup, and medication drinks; use measured containers and mouth care rather than guessing.",
      "Report headache, vomiting, confusion, unsteady walking, unusual sleepiness, seizure, or new weakness immediately and do not increase salt or stop a causative medicine without the treatment plan."
    ]),
    card("Hypokalemia", ["nhs-hypokalemia"], [
      "Assess weakness, cramps, constipation, ileus, palpitations, medication use, vomiting, diarrhea, nutrition, insulin or beta-agonist exposure, and cardiac disease because potassium loss and intracellular shift require different correction strategies.",
      "Obtain potassium, magnesium, bicarbonate, glucose, kidney function, and electrocardiography and place the patient on telemetry when severe or symptomatic because hypomagnesemia prevents correction and dysrhythmia risk rises with heart disease and digoxin.",
      "Administer oral replacement when safe and prescribed, dilute and infuse IV potassium only by pump within route and rate policy, and never give IV push because concentrated potassium can cause fatal arrhythmia and tissue injury.",
      "Verify urine output and kidney function before repeated replacement and recheck potassium after the appropriate distribution interval because impaired excretion can convert treatment into dangerous hyperkalemia.",
      "Correct magnesium and address diarrhea, vomiting, diuretic dose, laxative use, or poor intake while monitoring glucose and acid-base status because replacement without stopping the cause leads to recurrence.",
      "Escalate for ventricular dysrhythmia, syncope, chest pain, severe weakness, paralysis, respiratory difficulty, ileus, marked ECG change, or potassium at the critical threshold because cardiac arrest and respiratory failure may occur."
    ], [
      "Ventricular dysrhythmia, syncope, chest pain, or new significant ECG change",
      "Severe generalized weakness, paralysis, shallow breathing, or inability to clear secretions",
      "Ileus, marked abdominal distention, persistent vomiting, or absent bowel function",
      "Critical potassium level, ongoing rapid loss, digoxin use with symptoms, or inability to replace safely"
    ], [
      "Take potassium exactly as directed, dilute liquid forms, swallow extended-release tablets whole, and report burning, severe abdominal pain, weakness, or palpitations rather than taking extra doses.",
      "Review diuretics, laxatives, vomiting and diarrhea plans with the clinician and use potassium-rich foods only when appropriate for kidney function; food cannot replace urgent treatment of severe hypokalemia."
    ]),

    card("Leukemia", ["nci-leukemia"], [
      "Trend complete blood count with differential, platelets, smear, coagulation, temperature, symptoms, and treatment phase because marrow replacement and chemotherapy can simultaneously cause infection, bleeding, and tissue hypoxia.",
      "Treat fever at the oncology team's neutropenia threshold as an emergency, obtain ordered cultures promptly, and administer prescribed broad-spectrum antibiotic without waiting for the neutrophil count to recover because inflammation may be muted while sepsis progresses.",
      "Use meticulous hand, line, mouth, and skin care; avoid rectal temperatures and procedures, sick contacts, and unsafe food exposures according to policy because disrupted barriers and neutropenia permit invasive infection.",
      "Assess petechiae, gums, stool, urine, menses, neurologic status, and procedural sites and avoid intramuscular injections and unnecessary venipuncture because thrombocytopenia can cause mucosal or intracranial hemorrhage.",
      "Monitor potassium, phosphate, calcium, uric acid, creatinine, urine output, rhythm, weight, and fluid balance during high-burden treatment because tumor lysis can cause arrhythmia, seizure, and acute kidney injury.",
      "Escalate for fever, hypotension, confusion, active bleeding, severe headache, dyspnea, chest pain, oliguria, electrolyte change, leukostasis symptoms, or transfusion reaction because sepsis, hemorrhage, tumor lysis, and hyperleukocytosis are time-critical."
    ], [
      "Fever at the prescribed neutropenia threshold, rigors, hypotension, confusion, or oliguria",
      "Uncontrolled bleeding, melena, hematemesis, heavy menses, severe headache, or new neurologic deficit",
      "Dyspnea, hypoxemia, chest pain, vision change, confusion, or extreme leukocytosis suggesting leukostasis",
      "Rising potassium or phosphate, falling calcium, dysrhythmia, seizure, rising uric acid, or acute kidney injury"
    ], [
      "Use the oncology team's exact fever threshold and call before taking acetaminophen, because fever may be the only sign of a life-threatening infection during neutropenia.",
      "Avoid aspirin, NSAIDs, rectal products, and infection exposures unless approved; report bleeding, black stool, severe headache, reduced urine, breathlessness, or line redness immediately."
    ]),
    card("Thrombocytopenia", ["ash-platelets", "ash-hit", "isth-ttp", "aabb-platelets-2025", "isth-dic"], [
      "Trend platelet count, smear, hemoglobin, coagulation, liver and kidney results, medication exposure, infection, pregnancy, and prior baseline because decreased production, immune destruction, consumption, sequestration, and laboratory clumping require different responses.",
      "Assess petechiae, purpura, gums, nose, urine, stool, menses, neurologic status, abdominal or back pain, and procedural sites because occult gastrointestinal, intracranial, or retroperitoneal bleeding may precede shock.",
      "Use bleeding precautions: soft oral care, electric razor, fall prevention, prolonged pressure after venipuncture, and avoidance of intramuscular injection, rectal procedures, aspirin, and NSAIDs because small tissue injuries can bleed persistently.",
      "Administer prescribed immune therapy, steroids, platelet transfusion, or cause-specific treatment and monitor response and reaction because platelet transfusion is lifesaving for selected bleeding but may be ineffective or harmful in some consumptive disorders without specialist direction.",
      "When heparin-induced thrombocytopenia is suspected, stop all heparin exposure and notify the team for urgent alternative anticoagulation evaluation because HIT creates thrombosis risk despite the low platelet count.",
      "Escalate immediately for severe headache, focal deficit, head injury, hematemesis, melena, heavy uncontrolled bleeding, hypotension, chest pain, cold painful limb, or rapidly falling platelets because hemorrhage, HIT thrombosis, TTP, or DIC may be present."
    ], [
      "Severe headache, new neurologic deficit, seizure, altered consciousness, or any head injury",
      "Hematemesis, melena, gross hematuria, uncontrolled mucosal bleeding, or hemodynamic instability",
      "Chest pain, dyspnea, unilateral swelling, cold painful limb, or suspected HIT thrombosis",
      "Rapid platelet fall with fever, kidney injury, hemolysis, confusion, or abnormal coagulation"
    ], [
      "Use a soft toothbrush and electric razor, avoid contact injury and unapproved aspirin or NSAIDs, and ask before dental work, injections, or supplements that affect platelets.",
      "Seek emergency care for severe headache, head injury, black stool, vomiting blood, heavy bleeding, chest pain, breathlessness, or a swollen or painful limb."
    ]),
    card("Multiple myeloma", ["nccn-myeloma"], [
      "Assess new focal bone or back pain, weakness, sensory change, bowel or bladder dysfunction, falls, and fracture risk because lytic lesions can cause pathologic fracture and spinal-cord compression.",
      "Trend calcium, creatinine, urine output, blood count, total protein, hydration, and mental status because hypercalcemia, cast nephropathy, and anemia drive acute morbidity.",
      "Maintain individualized hydration, avoid unapproved NSAIDs and iodinated contrast, and review renally cleared medicines because dehydration and nephrotoxins accelerate irreversible kidney injury.",
      "Use safe handling, mobility aids, logrolling or spinal precautions when indicated, and prescribed bone-modifying therapy with dental assessment because fragile vertebrae and long bones can fracture during routine movement.",
      "Monitor fever, infection symptoms, neuropathy, orthostasis, thrombosis, bleeding, and treatment-specific blood counts because plasma-cell dysfunction and therapy suppress immunity and affect nerves and clot risk.",
      "Escalate for new leg weakness, saddle anesthesia, bowel or bladder change, sudden severe bone pain, confusion, arrhythmia, oliguria, fever, chest pain, or unilateral swelling because cord compression, hypercalcemic crisis, kidney failure, sepsis, or thrombosis is time-critical."
    ], [
      "New weakness, saddle anesthesia, urinary retention or incontinence, or severe spinal pain",
      "Confusion, severe dehydration, constipation with vomiting, dysrhythmia, or markedly elevated calcium",
      "Oliguria, rapidly rising creatinine, edema, or inability to maintain hydration",
      "Fever, rigors, chest pain, dyspnea, unilateral limb swelling, or suspected pathologic fracture"
    ], [
      "Protect bones by using prescribed aids and avoiding heavy lifting or chiropractic manipulation; report new focal back pain, weakness, numbness, or bladder change immediately.",
      "Follow the hydration and kidney-protection plan, avoid NSAIDs unless approved, maintain dental care before bone medicines, and call promptly for fever or infection symptoms."
    ]),
    card("Polycythemia vera", ["nccn-mpn"], [
      "Trend hematocrit, hemoglobin, platelets, leukocytes, symptoms, treatment, tobacco exposure, and oxygen history because thrombotic risk reflects blood-cell burden and vascular factors rather than redness alone.",
      "Assess headache, visual change, dizziness, erythromelalgia, aquagenic itching, chest pain, dyspnea, abdominal fullness, bleeding, and prior clot because microvascular symptoms may precede stroke, myocardial infarction, or venous thrombosis.",
      "Perform prescribed phlebotomy with identity checks, hydration assessment, vital signs, and post-procedure observation because reducing red-cell mass lowers viscosity but can cause syncope or iron deficiency.",
      "Administer prescribed low-dose aspirin or cytoreductive therapy and monitor bleeding, blood counts, skin, infection, and agent-specific toxicity because thrombosis prevention must be balanced against hemorrhage and marrow suppression.",
      "Encourage individualized hydration, movement during travel, tobacco cessation, and cardiovascular risk control while avoiding unnecessary iron supplements because dehydration raises viscosity and iron can counter the intended effect of phlebotomy.",
      "Escalate for sudden neurologic deficit, chest pain, dyspnea, unilateral swelling, severe abdominal pain, painful red digits with ischemic change, major bleeding, syncope, or rapidly enlarging spleen because arterial or venous thrombosis and hemorrhage are emergencies."
    ], [
      "Sudden face, arm, speech, vision, or balance deficit, severe headache, or confusion",
      "Chest pain, acute dyspnea, hemoptysis, or unilateral leg swelling",
      "Severe abdominal pain, splenic tenderness with hypotension, or signs of splanchnic thrombosis",
      "Major bleeding, syncope after phlebotomy, painful ischemic digit, or rapidly changing blood counts"
    ], [
      "Stay hydrated as directed, move during long travel, stop tobacco, and seek emergency care for stroke symptoms, chest pain, breathlessness, a swollen leg, or severe abdominal pain.",
      "Keep blood-count and phlebotomy appointments, take aspirin or cytoreduction exactly as prescribed, and do not start iron for fatigue unless the hematology team directs it."
    ]),
    // WAVE28_COHORT_B_CARDS
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
  window.ANI_PATHOLOGY_NURSING_WAVE28_B = {
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
