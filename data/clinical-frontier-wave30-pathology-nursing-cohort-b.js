(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  const VERSION = "2026-07-18-wave30-pathology-nursing-b-1";
  const COHORT = "B";

  const sources = [
    { id: "aap-bronchiolitis", label: "American Academy of Pediatrics, Clinical Practice Guideline: Bronchiolitis", url: "https://publications.aap.org/pediatrics/article/134/5/e1474/75848/Clinical-Practice-Guideline-The-Diagnosis", note: "Supports severity assessment, oxygen and hydration decisions, avoidance of low-value routine therapies, and discharge safety for infant bronchiolitis." },
    { id: "ats-bpd", label: "American Thoracic Society, Outpatient Respiratory Management of Post-Prematurity Respiratory Disease", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8865713/", note: "Supports oxygen, feeding and aspiration assessment, respiratory therapy review, and longitudinal care after bronchopulmonary dysplasia." },
    { id: "pphn-guideline", label: "Evidence-Based Guideline for Stabilization and Management of Persistent Pulmonary Hypertension of the Newborn", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12131203/", note: "Supports preductal and postductal oxygen monitoring, minimal stimulation, hemodynamic assessment, pulmonary vasodilator care, and ECMO escalation in PPHN." },
    { id: "merck-ttn", label: "Merck Manual Professional Edition, Transient Tachypnea of the Newborn", url: "https://www.merckmanuals.com/professional/pediatrics/respiratory-problems-in-neonates/transient-tachypnea-of-the-newborn", note: "Supports recognition of delayed fetal-lung-fluid clearance, supportive respiratory care, feeding safety, differential diagnosis, and reassessment when tachypnea does not resolve." },
    { id: "aha-chd", label: "American Heart Association, Congenital Heart Defects", url: "https://www.heart.org/en/health-topics/congenital-heart-defects/about-congenital-heart-defects", note: "Supports lesion-specific circulation, cyanosis and heart-failure recognition, diagnostic follow-up, and treatment concepts for common and critical congenital heart defects." },
    { id: "cdc-down", label: "Centers for Disease Control and Prevention, Down Syndrome", url: "https://www.cdc.gov/birth-defects/about/down-syndrome.html", note: "Supports multisystem recognition, developmental services, associated heart and gastrointestinal defects, hearing and vision care, and family-centered follow-up for Down syndrome." },
    { id: "cdc-cleft", label: "Centers for Disease Control and Prevention, Cleft Lip and Cleft Palate", url: "https://www.cdc.gov/birth-defects/about/cleft-lip-cleft-palate.html", note: "Supports feeding, hearing, speech, dental, surgical, and multidisciplinary care for infants and children with cleft lip or palate." },
    { id: "cdc-gastroschisis", label: "Centers for Disease Control and Prevention, Gastroschisis", url: "https://www.cdc.gov/birth-defects/about/gastroschisis.html", note: "Supports recognition, immediate protection of exposed bowel, surgical management, nutrition, and associated neonatal monitoring for gastroschisis." },
    { id: "cdc-omphalocele", label: "Centers for Disease Control and Prevention, Omphalocele", url: "https://www.cdc.gov/birth-defects/about/omphalocele.html", note: "Supports sac-protected abdominal-organ recognition, evaluation for associated anomalies, staged or early repair, and family counseling for omphalocele." },
    { id: "cdc-spina", label: "Centers for Disease Control and Prevention, Spina Bifida", url: "https://www.cdc.gov/spina-bifida/about/index.html", note: "Supports neural-tube-defect care, lesion protection, hydrocephalus and neurologic surveillance, bladder and bowel management, mobility, and lifelong follow-up." },
    { id: "nice-faltering", label: "National Institute for Health and Care Excellence, Faltering Growth: Recognition and Management", url: "https://www.nice.org.uk/guidance/ng75/chapter/Recommendations", note: "Supports accurate growth plotting, feeding observation, targeted evaluation, nutritional intervention, safeguarding assessment, and referral for failure to thrive." },
    { id: "ispad-dka", label: "International Society for Pediatric and Adolescent Diabetes, Clinical Practice Consensus Guidelines 2022", url: "https://www.ispad.org/resources/ispad-clinical-practice-consensus-guidelines/2022-ispad-clinical-practice-consensus-guidelines.html", note: "Supports pediatric DKA fluid, insulin, glucose, electrolyte, neurologic, cerebral-injury, and transition monitoring principles." },
    { id: "cdc-fasd", label: "Centers for Disease Control and Prevention, Fetal Alcohol Spectrum Disorders", url: "https://www.cdc.gov/fasd/about/index.html", note: "Supports lifelong neurodevelopmental effects, early identification, coordinated treatment, environmental supports, and prevention counseling for fetal alcohol exposure." },
    { id: "aap-nows", label: "American Academy of Pediatrics, Neonatal Opioid Withdrawal Syndrome", url: "https://publications.aap.org/pediatrics/article/146/5/e2020029074/75310/Neonatal-Opioid-Withdrawal-Syndrome", note: "Supports standardized newborn withdrawal assessment, nonpharmacologic care, medication escalation, feeding and weight monitoring, discharge education, and follow-up." },
    { id: "nci-wilms", label: "National Cancer Institute, Wilms Tumor and Other Childhood Kidney Tumors Treatment", url: "https://www.cancer.gov/types/kidney/hp/wilms-treatment-pdq", note: "Supports diagnostic staging, avoidance of tumor disruption, nephrectomy and chemotherapy pathways, treatment toxicities, and multidisciplinary surveillance for Wilms tumor." },
    { id: "nice-psychosis", label: "National Institute for Health and Care Excellence, Psychosis and Schizophrenia in Adults", url: "https://www.nice.org.uk/guidance/cg178/chapter/recommendations", note: "Supports respectful psychosis assessment, immediate risk care, antipsychotic monitoring, psychological and family interventions, and recovery planning relevant to delusional disorder." },
    { id: "merck-endometritis", label: "Merck Manual Professional Edition, Postpartum Endometritis", url: "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis", note: "Supports postpartum fever and uterine assessment, broad-spectrum antibiotics, sepsis monitoring, and evaluation for abscess or septic pelvic thrombophlebitis when fever persists." },
    { id: "nice-anxiety", label: "National Institute for Health and Care Excellence, Generalised Anxiety Disorder and Panic Disorder", url: "https://www.nice.org.uk/guidance/cg113", note: "Supports stepped assessment, cognitive behavioral therapy, exposure-based care, medication safety, suicide screening, and relapse planning for anxiety, panic, and phobic disorders." },
    { id: "nice-ocd", label: "National Institute for Health and Care Excellence, Obsessive-Compulsive Disorder: Treatment", url: "https://www.nice.org.uk/guidance/cg31/chapter/Recommendations", note: "Supports sensitive assessment, cognitive behavioral therapy with exposure and response prevention, SSRI monitoring, family involvement, and intensive-care referral for severe OCD." },
    { id: "pmc-serotonin", label: "Management of Serotonin Syndrome (Toxicity), Clinical Toxicology Review", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11862804/", note: "Supports prompt serotonergic-drug cessation, benzodiazepine sedation, active cooling, cardiorespiratory support, and aggressive management of severe hyperthermia and rigidity." },
    { id: "asam-benzo", label: "American Society of Addiction Medicine, Joint Clinical Practice Guideline on Benzodiazepine Tapering", url: "https://www.asam.org/quality-care/clinical-guidelines/benzodiazepine-tapering", note: "Supports avoidance of abrupt discontinuation, individualized tapering, withdrawal and seizure risk assessment, higher-level care criteria, and shared safety planning." },
    { id: "nice-alcohol", label: "National Institute for Health and Care Excellence, Alcohol-Use Disorders: Physical Complications", url: "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations", note: "Supports acute intoxication observation, airway and metabolic assessment, thiamine, withdrawal risk recognition, Wernicke care, and linkage to continuing treatment." },
    { id: "nice-delirium", label: "National Institute for Health and Care Excellence, Delirium: Prevention, Diagnosis and Management", url: "https://www.nice.org.uk/guidance/cg103/chapter/Recommendations", note: "Supports postoperative delirium screening, reversible-cause evaluation, orientation and physiologic measures, medication caution, documentation, and follow-up." },
    { id: "nih-hiv", label: "U.S. Department of Health and Human Services, HIV Clinical Guidelines", url: "https://clinicalinfo.hiv.gov/en/guidelines", note: "Supports immediate and durable antiretroviral therapy, viral-load and CD4 monitoring, opportunistic-infection prevention, interaction review, adherence support, and transmission counseling." },
    { id: "idsa-ssti", label: "Infectious Diseases Society of America, Skin and Soft Tissue Infection Guideline", url: "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/", note: "Supports cellulitis assessment, antimicrobial selection, edema and portal-of-entry care, outpatient versus inpatient decisions, and necrotizing-infection escalation." },
    { id: "cdc-hfmd", label: "Centers for Disease Control and Prevention, Hand, Foot, and Mouth Disease", url: "https://www.cdc.gov/hand-foot-mouth/index.html", note: "Supports mouth and skin finding recognition, hydration and pain care, transmission reduction, return precautions, and uncommon neurologic complication awareness." },
    { id: "cdc-impetigo", label: "Centers for Disease Control and Prevention, Clinical Guidance for Impetigo", url: "https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/impetigo.html", note: "Supports lesion recognition, topical or systemic antibiotic care, hygiene and covering, transmission reduction, and post-streptococcal complication monitoring." },
    { id: "cdc-scabies", label: "Centers for Disease Control and Prevention, Clinical Care of Scabies", url: "https://www.cdc.gov/scabies/hcp/clinical-care/index.html", note: "Supports scabicide use, simultaneous contact treatment, environmental handling, persistent-itch counseling, and crusted-scabies infection control." },
    { id: "cdc-rubella", label: "Centers for Disease Control and Prevention, Clinical Overview of Rubella", url: "https://www.cdc.gov/rubella/hcp/clinical-overview/index.html", note: "Supports droplet isolation, public-health notification, pregnancy exposure management, diagnostic testing, and congenital rubella prevention." },
    { id: "cdc-mumps", label: "Centers for Disease Control and Prevention, Clinical Overview of Mumps", url: "https://www.cdc.gov/mumps/hcp/clinical-overview/index.html", note: "Supports droplet precautions, testing and reporting, hydration and pain care, and recognition of neurologic, gonadal, pancreatic, and hearing complications." },
    { id: "cdc-toxo", label: "Centers for Disease Control and Prevention, Clinical Care of Toxoplasmosis", url: "https://www.cdc.gov/toxoplasmosis/hcp/clinical-care/index.html", note: "Supports risk-specific antiparasitic therapy, folinic-acid protection, blood-count monitoring, pregnancy and congenital care, ocular evaluation, and AIDS relapse prevention." },
    { id: "cdc-zika", label: "Centers for Disease Control and Prevention, Treatment and Prevention of Zika Virus Disease", url: "https://www.cdc.gov/zika/hcp/clinical-care/index.html", note: "Supports supportive care, dengue exclusion before NSAIDs, pregnancy and fetal monitoring, infant evaluation, and mosquito and sexual transmission prevention." },
    { id: "aha-anaphylaxis", label: "American Heart Association and American Red Cross, First Aid for Anaphylaxis", url: "https://cpr.heart.org/en/resuscitation-science/2024-first-aid-guidelines", note: "Supports immediate airway and circulation recognition, intramuscular epinephrine for systemic allergic reactions, emergency activation, and repeat assessment relevant to angioedema." },
    { id: "nci-cll", label: "National Cancer Institute, Chronic Lymphocytic Leukemia Treatment", url: "https://www.cancer.gov/types/leukemia/hp/cll-treatment-pdq", note: "Supports observation versus treatment, infection and bleeding complications, tumor burden assessment, therapy selection, and response surveillance in CLL." },
    { id: "nci-cml", label: "National Cancer Institute, Chronic Myeloid Leukemia Treatment", url: "https://www.cancer.gov/types/leukemia/hp/cml-treatment-pdq", note: "Supports BCR::ABL1 confirmation, tyrosine-kinase inhibitor treatment, molecular response monitoring, blast-crisis recognition, and longitudinal CML care." },
    { id: "aga-iron", label: "American Gastroenterological Association, Management of Iron Deficiency Anemia", url: "https://gastro.org/clinical-guidance/management-of-iron-deficiency-anemia/", note: "Supports oral and intravenous iron selection, tolerance and response monitoring, malabsorption recognition, and investigation of ongoing blood loss in iron deficiency anemia." },
    { id: "cdc-scd", label: "Centers for Disease Control and Prevention, Sickle Cell Disease Complications", url: "https://www.cdc.gov/sickle-cell/about/index.html", note: "Supports vaso-occlusive pain care, fever and infection urgency, acute chest and stroke recognition, hydration, disease-modifying treatment, and preventive follow-up." },
    { id: "nci-pancreatic", label: "National Cancer Institute, Pancreatic Cancer Treatment", url: "https://www.cancer.gov/types/pancreatic/hp/pancreatic-treatment-pdq", note: "Supports staging and resectability, systemic and surgical treatment, jaundice and obstruction care, pain, exocrine insufficiency, nutrition, and palliative needs." },
    { id: "nci-melanoma", label: "National Cancer Institute, Melanoma Treatment", url: "https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq", note: "Supports lesion diagnosis and staging, excision and nodal management, immunotherapy and targeted therapy, toxicity surveillance, and recurrence monitoring." },
    { id: "aao-angle", label: "American Academy of Ophthalmology EyeWiki, Primary and Secondary Angle-Closure Glaucoma", url: "https://eyewiki.aao.org/Primary_vs._Secondary_Angle_Closure_Glaucoma", note: "Supports emergency symptom recognition, visual acuity and intraocular-pressure assessment, pressure-lowering treatment, laser iridotomy, and fellow-eye evaluation." },
    { id: "rch-eye", label: "Royal Children's Hospital Melbourne, Acute Eye Injury Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Acute_eye_injury/", note: "Supports vision-first examination, corneal injury care, avoidance of pressure with possible globe injury, analgesia, and urgent ophthalmology referral." },
    { id: "aao-epistaxis", label: "American Academy of Otolaryngology-Head and Neck Surgery, Nosebleed Guideline", url: "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/nosebleed-epistaxis/", note: "Supports firm nasal compression, risk-factor assessment, packing or cautery, anticoagulant-aware care, recurrent-bleeding evaluation, and patient instructions." },
    { id: "aap-otitis", label: "American Academy of Pediatrics, Diagnosis and Management of Acute Otitis Media", url: "https://publications.aap.org/pediatrics/article/131/3/e964/30912/The-Diagnosis-and-Management-of-Acute-Otitis-Media", note: "Supports tympanic-membrane diagnostic criteria, pain treatment, observation versus antibiotics, treatment-failure reassessment, prevention, and recurrence follow-up." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const patches = [
    card("Bronchiolitis", ["aap-bronchiolitis"], [
      "Assess respiratory rate, retractions, nasal flaring, grunting, breath sounds, apnea history, color, and oxygen saturation because small bronchiolar edema and mucus can rapidly increase an infant's work of breathing.",
      "Suction the nares gently before feeds and reassess breathing afterward because infants are preferential nasal breathers and clearing proximal secretions can improve feeding without traumatic deep suction.",
      "Monitor oral intake, wet diapers, weight, mucous membranes, and fatigue during feeding because tachypnea and congestion reduce intake and can produce dehydration before caregivers recognize it.",
      "Provide ordered oxygen and enteral or intravenous fluids while avoiding routine antibiotics, bronchodilators, corticosteroids, and chest physiotherapy unless another indication exists because typical viral bronchiolitis improves with targeted supportive care.",
      "Escalate for apnea, cyanosis, persistent hypoxemia, exhaustion, markedly reduced air movement, inability to hydrate, or altered responsiveness because these findings signal impending respiratory failure or severe dehydration."
    ], [
      "Apnea, cyanosis, persistent oxygen desaturation, or irregular shallow breathing",
      "Severe retractions, grunting, head bobbing, exhaustion, or markedly diminished breath sounds",
      "Inability to feed, fewer wet diapers, dry mucosa, or lethargy from dehydration",
      "New focal lung findings, toxic appearance, or fever in a young infant suggesting another diagnosis"
    ], [
      "Use saline and gentle nasal suction before sleep and feeds, offer smaller frequent feeds, and keep the home free of smoke and vaping aerosols because irritants and fatigue worsen breathing.",
      "Seek urgent care for pauses in breathing, blue color, ribs pulling deeply, poor arousal, or too little intake to maintain wet diapers; cough can linger after the dangerous breathing phase improves."
    ]),
    card("Bronchopulmonary dysplasia", ["ats-bpd"], [
      "Assess baseline oxygen requirement, respiratory effort, breath sounds, saturation during sleep and feeds, and changes from the infant's usual pattern because bronchopulmonary dysplasia leaves limited pulmonary reserve.",
      "Trend daily weight, length, head growth, intake, feeding duration, emesis, and calorie delivery because chronic work of breathing raises energy needs while fatigue and reflux can limit intake.",
      "Monitor cough, choking, wet voice, desaturation, or tachypnea with feeds and coordinate a swallow evaluation when indicated because aspiration can silently worsen lung inflammation and prevent oxygen weaning.",
      "Administer oxygen, inhaled medicines, diuretics, and fortified nutrition exactly as prescribed while checking electrolytes and hydration when diuretics are used because both undertreatment and fluid depletion can impair growth and cardiopulmonary stability.",
      "Escalate for rising oxygen need, recurrent desaturation, apnea, poor feeding with cyanosis, edema, hepatomegaly, or failure to gain weight because infection, pulmonary hypertension, aspiration, or right-heart strain may be developing."
    ], [
      "New or sustained increase in oxygen requirement, severe retractions, apnea, or cyanosis",
      "Coughing or choking with feeds, recurrent aspiration, or inability to complete feeds safely",
      "Edema, hepatomegaly, poor perfusion, or worsening pulmonary-hypertension findings",
      "Weight loss, dehydration, electrolyte abnormality, or failure to grow despite prescribed nutrition"
    ], [
      "Never change the oxygen flow or stop monitors without the specialty plan, keep oxygen away from flames and smoking, and verify that backup supplies travel with the child.",
      "Reduce respiratory infections with hand hygiene, immunizations and indicated seasonal prevention, and call early when breathing, feeding, color, or oxygen needs differ from the child's baseline."
    ]),
    card("Persistent pulmonary hypertension of the newborn", ["pphn-guideline"], [
      "Place simultaneous preductal saturation monitoring on the right hand and postductal monitoring on a foot, and trend the gradient because right-to-left ductal shunting can create differential cyanosis and minute-to-minute instability.",
      "Maintain a thermoneutral, quiet environment and cluster essential care with adequate analgesia because pain, cold, acidosis, and excessive stimulation raise pulmonary vascular resistance and can trigger a hypoxemic crisis.",
      "Monitor respiratory effort, blood gases, lactate, blood pressure, perfusion, urine output, glucose, and temperature because oxygenation alone does not show whether systemic organs are receiving adequate flow.",
      "Administer prescribed oxygen, ventilatory support, surfactant, inhaled nitric oxide, and vasoactive therapy while checking delivery systems and response because lung recruitment and selective pulmonary vasodilation reduce shunting without unnecessary oxygen toxicity.",
      "Escalate immediately for widening preductal-postductal saturation difference, refractory hypoxemia, hypotension, rising lactate, oliguria, ventricular dysfunction, or worsening oxygenation index because advanced ventilation or ECMO evaluation may be time-critical."
    ], [
      "Labile or refractory hypoxemia despite escalating respiratory support",
      "Widening preductal-postductal saturation gradient or sudden differential cyanosis",
      "Hypotension, rising lactate, poor pulses, oliguria, or worsening metabolic acidosis",
      "Right-ventricular failure, severe tricuspid regurgitation, or oxygenation failure approaching ECMO criteria"
    ], [
      "Explain that the infant's lung vessels have not relaxed normally after birth, so calm handling and carefully targeted oxygen are treatments rather than signs that the family should avoid touching the baby indefinitely.",
      "Keep cardiology, hearing, neurodevelopmental, and pulmonary follow-up after discharge because severe hypoxemia and its therapies can have effects that become apparent later."
    ]),
    card("Transient tachypnea of newborn", ["merck-ttn"], [
      "Assess respiratory rate, retractions, grunting, color, temperature, oxygen saturation, and maternal and delivery risk factors because delayed clearance of fetal lung fluid should cause early, usually self-limited respiratory distress.",
      "Monitor the trajectory of oxygen need and work of breathing and coordinate chest imaging, glucose, blood gas, or infection evaluation when ordered because pneumonia, sepsis, respiratory distress syndrome, pneumothorax, and heart disease can mimic TTN.",
      "Hold oral feeds when tachypnea or respiratory effort makes suck-swallow-breathe coordination unsafe and provide prescribed gavage or intravenous fluids because rapid breathing raises aspiration risk.",
      "Provide thermoregulation, minimal handling, and ordered oxygen or noninvasive support while reassessing frequently because supportive care allows lung fluid to clear without adding avoidable respiratory stress.",
      "Escalate for increasing oxygen requirement, apnea, persistent cyanosis, hypotension, temperature instability, poor perfusion, or failure to improve within the expected short course because the diagnosis or severity may be different from uncomplicated TTN."
    ], [
      "Rising oxygen or positive-pressure requirement rather than gradual improvement",
      "Apnea, cyanosis, severe retractions, grunting, or respiratory exhaustion",
      "Fever or hypothermia, poor perfusion, lethargy, or other neonatal sepsis findings",
      "Persistent tachypnea beyond the expected course, asymmetric breath sounds, or abnormal cardiac findings"
    ], [
      "Explain that retained fetal lung fluid usually clears over one to three days, but staff must first watch for infections and heart or lung disorders that can look similar.",
      "Do not pressure the baby to bottle-feed while breathing rapidly; temporary tube or intravenous support protects the airway and does not predict a lasting feeding problem."
    ]),
    card("Congenital heart defects", ["aha-chd"], [
      "Assess color, preductal and postductal saturation when indicated, pulses, four-extremity blood pressure, capillary refill, respiratory effort, murmur, liver size, feeding endurance, and growth because congenital lesions affect oxygen mixing, pulmonary flow, or systemic perfusion in different ways.",
      "Trend intake, daily weight, urine output, edema, tachypnea and sweating during feeds because infants often show heart failure as feeding fatigue and poor growth rather than reporting dyspnea.",
      "Verify each lesion's individualized oxygen-saturation goal and medication plan before changing oxygen or fluids because excessive pulmonary flow and duct-dependent circulation require different hemodynamic strategies.",
      "Coordinate echocardiography, electrocardiography, newborn critical-heart screening, genetics evaluation, and cardiology follow-up because anatomy and associated syndromes determine urgency and long-term surveillance.",
      "Escalate for sudden cyanosis, shock, weak or absent femoral pulses, severe feeding intolerance, oliguria, syncope, new dysrhythmia, or rapidly worsening respiratory distress because ductal closure or cardiac decompensation can become fatal quickly."
    ], [
      "Sudden or deepening cyanosis, severe desaturation, or an unresponsive hypoxemic spell",
      "Weak femoral pulses, cool mottled lower body, hypotension, oliguria, or metabolic acidosis",
      "Marked tachypnea, diaphoresis with feeds, hepatomegaly, edema, or rapid weight gain",
      "Syncope, chest pain, sustained dysrhythmia, or acute postoperative deterioration"
    ], [
      "Know the child's usual saturation, medicines, feeding plan, and specific emergency signs because a normal target for one heart defect may be unsafe or unrealistic for another.",
      "Keep lifelong congenital-cardiology follow-up even after repair, and ask before dental or surgical procedures about endocarditis prevention, anticoagulation, and activity guidance."
    ]),
    card("Atrial septal defect", ["aha-chd"], [
      "Assess respiratory rate, exercise or feeding tolerance, growth, murmur, fixed split second heart sound, rhythm, and signs of right-sided volume load because a significant left-to-right atrial shunt increases pulmonary flow over time.",
      "Trend heart rate and electrocardiographic rhythm, especially in older patients or after repair, because atrial dilation and surgical or device-related irritation can promote atrial dysrhythmias.",
      "Monitor oxygen saturation and investigate unexpected cyanosis rather than attributing it to an uncomplicated ASD because isolated left-to-right shunting should not cause marked resting cyanosis.",
      "Prepare the patient and family for echocardiography, transcatheter closure, or surgery as indicated and perform post-procedure neurovascular and access-site checks because closure choice depends on defect anatomy and device procedures carry bleeding or embolic risks.",
      "Escalate for new cyanosis, syncope, sustained palpitations, stroke-like deficit, chest pain, worsening dyspnea, or heart-failure signs because shunt reversal, paradoxical embolus, dysrhythmia, or decompensation needs urgent evaluation."
    ], [
      "New cyanosis or falling saturation in a patient previously considered acyanotic",
      "Sudden focal neurologic deficit, severe headache, or suspected paradoxical embolus",
      "Syncope, sustained rapid or irregular rhythm, chest pain, or hemodynamic instability",
      "Progressive dyspnea, edema, hepatomegaly, or poor growth from significant shunt burden"
    ], [
      "Many small ASDs close or remain asymptomatic, but keep echocardiographic follow-up because size, right-heart effects, and pulmonary pressure—not the loudness of a murmur—guide closure.",
      "After device closure, follow activity, antiplatelet, dental, and puncture-site instructions exactly and report fever, palpitations, neurologic symptoms, or bleeding promptly."
    ]),
    card("Coarctation of the aorta", ["aha-chd"], [
      "Compare right-arm and lower-extremity blood pressures, brachial and femoral pulse timing, temperature, color, capillary refill, and urine output because aortic narrowing reduces perfusion beyond the obstruction.",
      "In a newborn, monitor feeding, tachypnea, hepatomegaly, acidosis, glucose, lactate, and renal function as the ductus closes because a duct-dependent infant can deteriorate from apparently normal to shock within hours.",
      "Administer prescribed prostaglandin infusion through reliable access and watch for apnea, hypotension, and fever because reopening or maintaining ductal flow can restore systemic perfusion while definitive repair is arranged.",
      "After surgical or catheter repair, trend upper and lower blood pressures, distal pulses, access sites, abdominal pain, urine output, and neurologic status because recoarctation, hypertension, bleeding, aneurysm, or spinal ischemia require early detection.",
      "Escalate immediately for absent femoral pulses, cool mottled legs, oliguria, rising lactate, severe hypertension, acute abdominal or back pain, new weakness, or collapse because critical obstruction or repair complication threatens organs."
    ], [
      "Weak or absent femoral pulses with cool lower extremities and delayed capillary refill",
      "Neonatal shock, metabolic acidosis, oliguria, poor feeding, or sudden respiratory distress",
      "Severe upper-extremity hypertension, headache, chest or back pain, or neurologic deficit",
      "Post-repair loss of distal pulse, access-site bleeding, abdominal pain, or new leg weakness"
    ], [
      "Check blood pressure in the limb and on the schedule specified by cardiology because hypertension and renarrowing can recur even after a successful repair.",
      "Seek emergency care for fainting, severe headache, chest or back pain, cold weak legs, or reduced urine, and keep lifelong imaging and congenital-heart follow-up."
    ]),
    card("Patent ductus arteriosus", ["aha-chd"], [
      "Assess bounding pulses, pulse pressure, continuous murmur, respiratory effort, saturation, feeding endurance, liver size, urine output, and daily weight because a large left-to-right ductal shunt can overload the lungs and reduce systemic diastolic perfusion.",
      "Trend oxygen and ventilatory needs, apnea, lung sounds, abdominal perfusion, creatinine, and feeding tolerance in a preterm infant because PDA effects may appear as respiratory dependence, renal hypoperfusion, or intestinal vulnerability.",
      "Administer fluid, diuretic, and ductal-closure therapy exactly as prescribed while monitoring urine output, creatinine, platelets, and bleeding because medical closure agents and fluid restriction have important renal and hematologic consequences.",
      "Prepare for catheter or surgical closure and perform post-procedure pulse, perfusion, access-site, respiratory, and blood-pressure checks because device obstruction, bleeding, residual shunt, or recurrent laryngeal nerve injury can occur.",
      "Escalate for increasing respiratory support, pulmonary edema, feeding-associated diaphoresis, hypotension, oliguria, bloody stool, loss of distal pulse, or acute post-closure instability because systemic steal or procedural complications need rapid intervention."
    ], [
      "Rising oxygen or ventilatory support with pulmonary edema or recurrent apnea",
      "Hypotension, oliguria, rising creatinine, metabolic acidosis, or poor peripheral perfusion",
      "Abdominal distention, feeding intolerance, bloody stool, or concern for intestinal ischemia",
      "Post-closure loss of pulse, access-site bleeding, stridor, or sudden hemodynamic change"
    ], [
      "A PDA is a fetal vessel that stayed open; whether it needs closure depends on its effect on breathing, growth, heart size, and organ perfusion rather than its presence alone.",
      "Follow medication, feeding, activity, and incision or catheter-site instructions, and report breathing difficulty, poor feeding, fever, bleeding, or a cool pale limb promptly."
    ]),
    card("Ventricular septal defect", ["aha-chd"], [
      "Assess respiratory rate, feeding duration, diaphoresis, weight gain, murmur, liver size, lung sounds, pulses, and oxygen saturation because a large VSD increases pulmonary blood flow and left-heart workload as pulmonary resistance falls after birth.",
      "Track daily weight, intake, urine output, and calories and provide smaller energy-dense feeds with rest periods as prescribed because tachypnea and cardiac effort increase caloric demand while limiting feeding endurance.",
      "Administer diuretics and other heart-failure medicines on schedule while monitoring electrolytes, renal function, blood pressure, and hydration because symptom relief must not cause hypovolemia or electrolyte injury.",
      "Monitor for recurrent respiratory infection, worsening pulmonary pressure, growth failure, and new cyanosis and coordinate echocardiographic follow-up because prolonged high pulmonary flow can cause irreversible vascular disease and shunt reversal.",
      "Escalate for severe retractions, inability to feed, poor perfusion, oliguria, rapid weight gain, hepatomegaly, syncope, or new cyanosis because heart failure or pulmonary hypertensive crisis requires urgent care."
    ], [
      "Feeding exhaustion, diaphoresis, tachypnea, or inadequate weight gain despite nutritional support",
      "Pulmonary edema, severe retractions, persistent hypoxemia, or increasing respiratory support",
      "Poor perfusion, oliguria, hypotension, hepatomegaly, or rapid fluid-related weight gain",
      "New cyanosis, syncope, or evidence of rising pulmonary vascular resistance"
    ], [
      "Allow rest during feeds and use the prescribed calorie plan; forcing a tired infant to finish can increase oxygen demand and aspiration risk rather than improve growth.",
      "Keep cardiology and growth appointments even if the murmur sounds quieter because a softer murmur can reflect a smaller defect, but it can also occur when pressures equalize dangerously."
    ]),
    card("Truncus arteriosus", ["aha-chd"], [
      "Assess saturation, cyanosis, respiratory effort, pulses, blood pressure, liver size, perfusion, feeding tolerance, and weight because a single arterial trunk mixes blood while excessive pulmonary flow quickly produces heart failure.",
      "Trend oxygen delivery against the cardiology saturation goal and avoid reflexively chasing a normal saturation without reviewing hemodynamics because excessive oxygen can lower pulmonary resistance and worsen pulmonary overcirculation.",
      "Monitor intake, urine output, electrolytes, daily weight, edema, and response to diuretics and nutrition because fluid management and growth are essential bridges to early surgical repair.",
      "Prepare the infant and family for neonatal surgical repair and perform postoperative rhythm, chest-tube, perfusion, ventilation, and bleeding checks because conduit, valve, coronary, and pulmonary-artery complications can destabilize circulation.",
      "Escalate for worsening cyanosis, severe tachypnea, feeding collapse, hypotension, oliguria, dysrhythmia, chest-tube hemorrhage, or low cardiac output because mixed circulation has little reserve before or after repair."
    ], [
      "Rapidly increasing tachypnea, pulmonary edema, diaphoresis, or inability to feed",
      "Deepening cyanosis, severe desaturation, poor perfusion, or metabolic acidosis",
      "Hypotension, oliguria, hepatomegaly, or other low-cardiac-output findings",
      "Postoperative hemorrhage, sustained dysrhythmia, conduit obstruction, or sudden ventricular dysfunction"
    ], [
      "Explain that one large vessel carries blood to both lungs and body, so early repair separates the circulations; medicines and specialized feeding stabilize the baby but do not close the defect.",
      "Keep lifelong congenital-heart follow-up because the right-ventricle-to-pulmonary-artery conduit does not grow with the child and may need future procedures."
    ]),
    card("Down syndrome", ["cdc-down"], [
      "Assess airway tone, work of breathing, feeding coordination, temperature, heart sounds, pulses, abdomen, stool passage, and oxygen saturation because hypotonia and associated cardiac, airway, and gastrointestinal defects can make early illness subtle.",
      "Monitor weight, length, head growth, feeding duration, choking, constipation, and developmental progress because oral-motor difficulty, thyroid disease, celiac disease, and congenital anomalies can impair growth.",
      "Coordinate echocardiography, newborn hearing, vision, thyroid, blood-count, and other age-specific surveillance because treatable associated conditions may be present before symptoms are obvious.",
      "Use individualized communication, early-intervention therapies, safe positioning, and family-centered goals because supportive development and participation improve function without assuming a fixed ability level.",
      "Escalate for cyanosis, severe feeding difficulty, bilious vomiting, absent stool, marked lethargy, fever, bruising, new weakness, or loss of milestones because cardiac decompensation, obstruction, infection, hematologic disease, or cervical cord injury needs urgent evaluation."
    ], [
      "Cyanosis, severe retractions, apnea, poor perfusion, or feeding-associated collapse",
      "Bilious vomiting, distended abdomen, absent stool, or acute abdominal tenderness",
      "Fever with lethargy, unusual bruising, pallor, petechiae, or abnormal blood counts",
      "New neck pain, gait change, limb weakness, loss of bowel or bladder control, or skill regression"
    ], [
      "Use the child's strengths and developmental level rather than the diagnosis to set expectations, and keep early-intervention, school, hearing, vision, dental, cardiac, and thyroid follow-up.",
      "Tell every clinician about Down syndrome before anesthesia or contact sports evaluation, and seek prompt care for breathing trouble, bilious vomiting, unusual bruising, or new weakness."
    ]),
    card("Cleft lip and cleft palate", ["cdc-cleft"], [
      "Assess airway patency, palate anatomy, suck-swallow-breathe coordination, cough, color, feeding time, and oxygen saturation because an open palate prevents effective suction and increases nasal regurgitation and aspiration risk.",
      "Position the infant upright, use the prescribed specialty feeder, pace frequent burps, and limit exhausting feeds while recording intake because assisted flow and gravity improve milk transfer without overwhelming the airway.",
      "Trend daily weight, wet diapers, hydration, feeding duration, nasal regurgitation, and recurrent ear or respiratory symptoms because poor transfer and eustachian-tube dysfunction can impair growth and hearing.",
      "After repair, protect the incision with ordered positioning and arm restraints, provide pain control, and keep hard objects, straws, suction catheters, and utensils away from the operative site because trauma or crying can disrupt the repair.",
      "Escalate for cyanosis, choking that does not clear, inability to take adequate volume, dehydration, active incision bleeding, wound separation, fever, or breathing obstruction because airway compromise and repair failure require urgent care."
    ], [
      "Cyanosis, apnea, persistent choking, weak cough, or inability to protect the airway",
      "Feeds consistently exceeding the care-plan limit, weight loss, few wet diapers, or marked fatigue",
      "Postoperative bleeding, wound separation, rapidly increasing swelling, or airway obstruction",
      "Fever, purulent drainage, recurrent otitis, failed hearing screen, or speech regression"
    ], [
      "Hold the baby upright and let the specialty bottle deliver milk without squeezing faster than the baby can swallow; cleft palate is a pressure problem, not a lack of hunger or effort.",
      "Keep the cleft-team schedule for surgery, hearing, speech, dental, and feeding care, and follow postoperative rules about cups, utensils, pacifiers, and incision cleaning exactly."
    ]),
    card("Gastroschisis", ["cdc-gastroschisis"], [
      "Immediately place the exposed bowel in a sterile transparent bowel bag or cover it with warm sterile saline dressings and plastic according to neonatal protocol because evaporation, heat loss, contamination, and mechanical injury occur rapidly.",
      "Position the bowel without twisting or pressure, usually supporting it over the abdomen while placing the infant on the right side as directed, and assess color and perfusion because mesenteric kinking can cause ischemia.",
      "Insert prescribed orogastric decompression, keep the infant nil by mouth, and measure gastric output and abdominal distention because swallowed air and intestinal dysmotility increase bowel pressure and aspiration risk.",
      "Maintain thermoregulation and reliable intravenous access, replace fluid losses, and trend glucose, electrolytes, urine output, lactate, and weight because exposed bowel causes unusually high fluid and heat loss.",
      "Escalate for dusky or black bowel, sudden swelling, falling urine output, rising lactate, hypotension, respiratory compromise after reduction, fever, or wound drainage because ischemia, sepsis, or abdominal compartment physiology requires immediate surgical review."
    ], [
      "Dusky, pale, black, cold, or increasingly edematous bowel or loss of visible perfusion",
      "Hypotension, rising lactate, oliguria, hypothermia, or severe electrolyte disturbance",
      "Increasing airway pressure, tense abdomen, weak leg perfusion, or reduced urine after reduction",
      "Fever, erythema, purulent drainage, perforation, bilious output change, or sepsis"
    ], [
      "Explain that the bowel has no protective sac, so warmth, moisture, decompression, and avoiding twists are immediate treatments while surgery is arranged.",
      "Expect nutrition to advance slowly after closure because inflamed bowel may take time to move normally; report green vomiting, distention, fever, wound change, or fewer stools after discharge."
    ]),
    card("Omphalocele", ["cdc-omphalocele"], [
      "Cover the intact omphalocele sac with warm sterile saline dressings and an occlusive plastic layer while avoiding pressure because rupture exposes liver or bowel to fluid loss, infection, and trauma.",
      "Position and support the sac so it does not twist, pull, or compress its blood supply, and inspect color, temperature, tension, and integrity because vascular compromise may be visible before systemic deterioration.",
      "Maintain thermoregulation, gastric decompression, nil-by-mouth status, intravenous fluids, glucose checks, urine output, and electrolyte monitoring because exposed viscera and associated neonatal illness disrupt heat, fluid, and metabolic balance.",
      "Coordinate echocardiography, genetic evaluation, abdominal imaging, and screening for other anomalies while preparing for staged or primary closure because omphalocele commonly accompanies cardiac, chromosomal, and overgrowth conditions.",
      "Escalate for sac rupture, active bleeding, dark or cool organs, hypoglycemia, respiratory distress, hypotension, oliguria, or a tense abdomen after reduction because evisceration, associated disease, or compartment physiology can become life-threatening."
    ], [
      "Sac rupture, bleeding, contamination, or sudden leakage of abdominal contents",
      "Dark, cool, pale, twisted, or poorly perfused bowel or liver within the sac",
      "Persistent hypoglycemia, apnea, cyanosis, murmur with shock, or another major anomaly",
      "Post-reduction respiratory compromise, tense abdomen, oliguria, weak leg pulses, or rising lactate"
    ], [
      "Do not press on or attempt to replace the sac contents; protect the covering during handling and let the surgical team decide whether closure should be immediate or staged.",
      "Keep genetics, cardiac, growth, wound, feeding, and surgical follow-up because associated conditions and abdominal-wall function may need care long after closure."
    ]),
    card("Meningomyelocele", ["cdc-spina"], [
      "Position the newborn prone with hips neutral and cover the lesion using a sterile nonadherent saline-moistened dressing and occlusive barrier because pressure, drying, contamination, or rupture can injure exposed neural tissue.",
      "Use latex-safe supplies from the first encounter and document latex precautions because repeated early exposure in spina bifida greatly increases sensitization and potentially severe allergy.",
      "Perform serial leg movement, tone, sensation, anal tone, bladder distention, urine output, head circumference, fontanel, and level-of-consciousness checks because neurologic level, neurogenic bladder, and hydrocephalus shape urgent and lifelong care.",
      "Keep stool and urine away from the defect, provide meticulous skin care, maintain temperature, and administer prescribed antibiotics while preparing for closure because contamination can cause meningitis and wound infection.",
      "Escalate for cerebrospinal-fluid leakage, fever, purulent drainage, bulging fontanel, rapidly increasing head circumference, apnea, vomiting, seizures, falling urine output, or new weakness because infection, hydrocephalus, tethering, or renal obstruction needs urgent treatment."
    ], [
      "Ruptured or leaking lesion, purulent drainage, fever, nuchal change, or suspected meningitis",
      "Bulging fontanel, rapidly increasing head circumference, sunset eyes, vomiting, apnea, or seizure",
      "Bladder distention, oliguria, recurrent urinary infection, rising creatinine, or hydronephrosis",
      "New loss of strength or sensation, worsening gait, back pain, or bowel and bladder regression"
    ], [
      "Use latex-free gloves, balloons, catheters, and household products when advised, and tell every school and healthcare team about the latex risk.",
      "Keep neurosurgery, urology, orthopedics, skin, bowel, bladder, mobility, and developmental follow-up because closure protects the lesion but does not remove all neurologic effects."
    ]),
    card("Failure to thrive", ["nice-faltering"], [
      "Measure weight, recumbent length or height, head circumference when age-appropriate, and body mass index, and plot serial values on the correct growth chart because growth trajectory is more informative than a single percentile.",
      "Observe a complete feed or meal and document suck, swallow, breathing, positioning, caregiver cues, duration, texture, volume, emesis, stool, and distractions because direct observation often reveals a modifiable intake or interaction barrier.",
      "Calculate actual calorie and fluid intake and monitor wet diapers, stool, hydration, skin, oral health, development, and activity because inadequate intake, malabsorption, excessive losses, and high metabolic demand produce different patterns.",
      "Coordinate targeted testing and dietitian, feeding, developmental, social-work, and safeguarding assessment based on history and examination because indiscriminate tests miss environmental needs while excessive caloric increase can cause refeeding abnormalities in severe malnutrition.",
      "Escalate for rapid weight loss, severe wasting, dehydration, bradycardia, hypothermia, electrolyte disturbance, aspiration, developmental regression, or safety concerns because medical instability or neglect requires urgent multidisciplinary protection."
    ], [
      "Severe wasting, rapid weight loss, bradycardia, hypothermia, hypotension, or lethargy",
      "Dehydration, persistent vomiting or diarrhea, few wet diapers, or significant electrolyte abnormality",
      "Coughing, choking, cyanosis, recurrent pneumonia, or inability to feed safely",
      "Developmental regression, unexplained injury, unsafe food access, or other safeguarding concern"
    ], [
      "Record what the child actually eats for the agreed interval and follow the individualized calorie plan; frequent weighing outside the plan can add anxiety without showing true growth.",
      "Use calm scheduled meals without force or blame, and return promptly for vomiting, choking, fewer wet diapers, unusual sleepiness, or continued weight loss."
    ]),
    card("DKA in children", ["ispad-dka"], [
      "Obtain weight, neurologic baseline, vital signs, perfusion, hydration, glucose, blood ketones, venous pH, bicarbonate, sodium, potassium, urea, and creatinine because pediatric DKA severity and fluid calculations depend on both acidosis and circulatory status.",
      "Administer isotonic fluid and intravenous insulin through independently checked pumps according to the pediatric protocol, avoiding an insulin bolus, because controlled correction stops ketogenesis while reducing abrupt osmotic shifts.",
      "Check glucose at least hourly and trend electrolytes, venous pH, bicarbonate, ketones, corrected sodium, intake, urine output, and electrocardiographic rhythm at protocol intervals because insulin and rehydration rapidly move potassium and glucose between compartments.",
      "Add dextrose when glucose falls but continue insulin until ketones and acidosis resolve because a normal glucose does not mean ketoacid production has stopped.",
      "Escalate immediately for headache, irritability, slowing heart rate, rising blood pressure, vomiting, incontinence, reduced consciousness, cranial-nerve change, seizure, shock, or dysrhythmia because cerebral injury, hypokalemia, or circulatory failure can progress rapidly."
    ], [
      "New headache, irritability, confusion, vomiting, incontinence, unequal pupils, seizure, or reduced consciousness",
      "Bradycardia with rising blood pressure, abnormal respirations, or other cerebral-injury signs",
      "Severe hypokalemia or hyperkalemia, electrocardiographic change, weakness, or dysrhythmia",
      "Persistent shock, oliguria, rising lactate, worsening acidosis, or failure of ketones to clear"
    ], [
      "Never omit basal insulin because a child is not eating; follow the sick-day plan for glucose, blood ketones, fluids, correction insulin, pump-site changes, and when to call the diabetes team.",
      "After recovery, review the cause without blame—illness, missed insulin, pump failure, access barriers, or distress—because correcting that pathway prevents another DKA episode."
    ]),
    card("Fetal alcohol spectrum disorder", ["cdc-fasd"], [
      "Obtain prenatal exposure, growth, learning, attention, sleep, sensory, motor, language, adaptive-skill, and family history using nonjudgmental language because accurate diagnosis depends on the developmental pattern and reliable context rather than one facial feature.",
      "Screen hearing, vision, cardiac, neurologic, growth, mental-health, and school function and coordinate developmental testing because prenatal alcohol exposure can affect multiple systems and executive skills across the lifespan.",
      "Use short concrete directions, visual schedules, repetition, predictable routines, and one change at a time because impaired working memory and cause-and-effect learning make abstract or rapidly changing demands difficult.",
      "Monitor impulsivity, wandering, exploitation risk, substance use, self-harm, school failure, and caregiver stress while linking occupational, speech, behavioral, and social supports because secondary harms arise when environmental demands exceed neurodevelopmental capacity.",
      "Escalate for suicidal thinking, violent or unsafe behavior, sudden functional regression, suspected abuse, severe feeding failure, seizure, or caregiver inability to maintain safety because crisis stabilization and protection take priority over diagnostic completion."
    ], [
      "Suicidal thinking, self-harm, severe aggression, unsafe wandering, or exploitation",
      "Sudden loss of function, new seizure, focal deficit, or unexplained altered behavior",
      "Severe feeding difficulty, growth failure, dehydration, or aspiration symptoms",
      "Suspected abuse, unsafe placement, caregiver collapse, or inability to supervise safely"
    ], [
      "FASD reflects a brain-based disability, not deliberate defiance; consistent routines, concrete language, repetition, and external reminders often work better than escalating punishment.",
      "There is no known safe amount or safe time for alcohol in pregnancy, but disclosure should lead to support and early services rather than blame or loss of respectful care."
    ]),
    card("Neonatal abstinence syndrome", ["aap-nows"], [
      "Document maternal and prescribed substance exposure, last use, infant age, feeding, sleep, consolability, tone, tremor, stool, temperature, respiratory rate, and glucose because onset and severity vary by drug half-life and coexposures.",
      "Use the facility's standardized withdrawal tool consistently and reassess after interventions because trends in function are more reliable than isolated observations made by different caregivers.",
      "Provide rooming-in when safe, skin-to-skin contact, swaddling, dim light, low noise, clustered care, and caregiver consoling because reducing autonomic stimulation can improve eating and sleep and reduce medication need.",
      "Monitor weight, calorie intake, suck-swallow coordination, emesis, diarrhea, skin breakdown, hydration, and urine output and offer small frequent higher-calorie feeds when prescribed because withdrawal increases energy expenditure and fluid loss.",
      "Administer and wean prescribed medication with respiratory and sedation monitoring, and escalate for seizure, apnea, fever with sepsis signs, inability to eat, severe weight loss, dehydration, or inconsolability despite optimized care because another illness or severe withdrawal may require intensive treatment."
    ], [
      "Seizure, apnea, cyanosis, marked sedation, or inability to protect the airway",
      "Fever, lethargy, poor perfusion, hypoglycemia, or findings suggesting sepsis rather than withdrawal",
      "Inability to feed, repeated vomiting or diarrhea, excessive weight loss, or dehydration",
      "Persistent inability to eat, sleep, or be consoled despite optimized nonpharmacologic and prescribed therapy"
    ], [
      "Your calm voice, skin contact, swaddling, and rooming-in are treatments; ask staff to demonstrate the same soothing and safe-sleep routine you will use at home.",
      "Follow the written medication, feeding, safe-sleep, pediatric, and early-intervention plan and keep naloxone and overdose-prevention education in the household when adult opioid exposure risk exists."
    ]),
    card("Wilms tumor", ["nci-wilms"], [
      "Place a visible no-abdominal-palpation precaution and handle the abdomen gently because pressure can rupture a Wilms tumor, spill malignant cells, and alter staging and treatment.",
      "Assess abdominal size, pain, hematuria, blood pressure, edema, weight, urine output, and renal laboratory results because the renal mass can bleed, obstruct flow, or activate renin-mediated hypertension.",
      "Coordinate imaging, staging specimens, blood typing, and preoperative preparation while preserving the child's routine and using developmentally appropriate explanations because accurate staging guides nephrectomy, chemotherapy, and radiation intensity.",
      "After nephrectomy, monitor incision, bleeding, blood pressure, urine output, creatinine, fluid balance, bowel function, pain, and remaining-kidney protection because hemorrhage, ileus, and acute kidney injury are early hazards.",
      "Escalate for sudden abdominal pain or enlargement, hypotension, gross hematuria, falling hemoglobin, severe hypertension, anuria, fever with neutropenia, or respiratory symptoms because rupture, bleeding, renal failure, infection, or pulmonary spread needs urgent evaluation."
    ], [
      "Sudden abdominal pain or enlargement, hypotension, pallor, or falling hemoglobin suggesting rupture or bleeding",
      "Severe hypertension, headache, seizure, visual change, or altered mental status",
      "Anuria, sharply falling urine output, rising creatinine, or fluid overload after nephrectomy",
      "Fever during chemotherapy, respiratory distress, new cough, or other infection or metastatic concern"
    ], [
      "Do not press, massage, or repeatedly feel the abdominal mass, and tell every caregiver and clinician about the no-palpation precaution before surgery.",
      "Protect the remaining kidney with follow-up blood pressure, urine, and kidney-function checks, good hydration, and prompt review before medicines that may injure the kidneys."
    ]),
    card("Delusional disorder", ["nice-psychosis"], [
      "Assess the belief's content, conviction, duration, triggers, functional effect, hallucinations, mood, substance use, sleep, cognition, medical symptoms, and medication history because secondary causes and immediate risk must be separated from a persistent delusional disorder.",
      "Ask directly about suicide, self-harm, weapons, threats, stalking, food or medication refusal, command experiences, and intended actions because risk depends on what the person may do in response to the belief, not simply how unusual it sounds.",
      "Acknowledge the emotion without agreeing with or arguing about the delusion, and use brief reality-based statements because confrontation can damage trust while reinforcement can strengthen unsafe behavior.",
      "Monitor sleep, nutrition, hygiene, social function, medication adherence, movement symptoms, blood pressure, weight, glucose, and lipids during treatment because both illness-related self-neglect and antipsychotic adverse effects need active prevention.",
      "Escalate for a specific violent or suicidal plan, inability to meet basic needs, severe agitation, delirium, catatonia, sudden neurologic change, or rapidly changing psychosis because emergency safety and medical evaluation take priority over outpatient formulation."
    ], [
      "Specific suicide, homicide, stalking, retaliation, or weapon plan linked to the delusion",
      "Refusal of food, fluids, shelter, essential medicine, or other inability to meet basic needs",
      "Severe agitation, command hallucination, catatonia, or behavior that cannot be safely redirected",
      "Abrupt onset with fever, confusion, seizure, focal deficit, intoxication, or withdrawal findings"
    ], [
      "You can say, 'I understand this feels real and frightening; I do not share that interpretation, but I want to help you stay safe,' instead of debating details or pretending to agree.",
      "Keep follow-up and medication monitoring even when daily function improves, and contact the crisis team early if sleep, eating, fear, isolation, or thoughts of acting on the belief worsen."
    ]),
    card("Endometritis", ["merck-endometritis"], [
      "Assess postpartum day, delivery and cesarean history, rupture duration, fever, chills, uterine tenderness, fundal tone, lochia amount and odor, wound, breasts, urine, and leg symptoms because several postpartum infections and thrombotic disorders can present with fever.",
      "Trend temperature, heart rate, blood pressure, respiratory rate, mental status, urine output, pain, blood count, lactate, cultures, and organ function because uterine infection can progress to bacteremia, sepsis, and shock.",
      "Obtain ordered blood and urine cultures without delaying broad intravenous antibiotics, and verify allergy, renal dosing, and administration times because polymicrobial postpartum infection requires prompt sustained antimicrobial exposure.",
      "Monitor lochia and uterine tenderness, encourage hydration and mobility when stable, provide pain control, and support feeding or pumping choices because comfort and function aid recovery while antibiotics are selected for postpartum safety.",
      "Escalate for hypotension, rising lactate, oliguria, altered mental status, respiratory distress, heavy bleeding, increasing pelvic pain, or fever that fails to improve after 48 to 72 hours because shock, retained products, abscess, wound infection, or septic pelvic thrombophlebitis may require source control."
    ], [
      "Hypotension, tachycardia, rising lactate, confusion, oliguria, or poor perfusion",
      "Heavy vaginal bleeding, boggy uterus, falling hemoglobin, or retained-tissue concern",
      "Worsening pelvic or abdominal pain, guarding, mass, wound drainage, or peritoneal signs",
      "Persistent fever after 48 to 72 hours of adequate antibiotics or new respiratory symptoms"
    ], [
      "Call the obstetric team for fever, chills, worsening lower-abdominal tenderness, foul-smelling lochia, heavy bleeding, breathlessness, or feeling suddenly much sicker after birth.",
      "Complete the antibiotic plan and keep hydration and follow-up instructions; most prescribed regimens can be coordinated with breastfeeding, so ask before stopping milk expression or a medicine."
    ]),
    card("Phobias", ["nice-anxiety"], [
      "Assess the feared object or situation, panic symptoms, avoidance, functional loss, trauma history, substance use, depression, suicide risk, and medical mimics because treatment depends on a specific fear pattern rather than anxiety alone.",
      "Collaboratively build a graded exposure hierarchy from manageable to difficult steps and record distress before, during, and after practice because repeated safe exposure allows corrective learning and weakens avoidance reinforcement.",
      "Coach slow diaphragmatic breathing and present-focused grounding without promising that anxiety must disappear because tolerating the rise and natural fall of fear is more durable than escaping every symptom.",
      "During early or medically supervised exposure, monitor distress, respiratory rate, heart rate, dizziness, and presyncope as well as attendance, sleep, work or school participation, substance use, and prescribed medication effects because severe autonomic symptoms or worsening avoidance can reveal a medical mimic, unsafe hyperventilation, or declining function.",
      "Escalate for suicidal thinking, inability to eat or leave a safe location, dangerous escape behavior, syncope, chest pain with instability, psychosis, or severe substance withdrawal because acute safety or a medical condition supersedes exposure work."
    ], [
      "Suicidal thinking, self-harm, severe depression, or hopelessness related to functional restriction",
      "Dangerous fleeing, freezing in traffic or heights, aggression, or other unsafe escape behavior",
      "Inability to obtain food, healthcare, shelter, education, or employment because of avoidance",
      "Syncope, persistent chest pain, hypoxemia, focal deficit, psychosis, or withdrawal rather than a typical fear response"
    ], [
      "Exposure should be planned, repeated, and collaborative—not a surprise or forced confrontation—and progress means staying safely with fear long enough to learn that it can fall.",
      "Avoid using alcohol, sedatives, or constant reassurance to get through every exposure because they can prevent learning and create dependence; practice the agreed coping plan instead."
    ]),
    card("Generalized anxiety disorder", ["nice-anxiety"], [
      "Assess duration and control of worry, restlessness, tension, sleep, concentration, irritability, function, depression, suicide risk, substances, caffeine, thyroid or cardiac symptoms, and medicines because generalized anxiety is persistent and must be distinguished from medical or drug effects.",
      "Use a validated anxiety scale and track sleep, work or school function, avoidance, and physical symptoms over time because improvement is better measured by restored function than by one calm interview.",
      "Teach scheduled worry time, paced breathing, sleep routine, regular activity, and cognitive behavioral strategies while coordinating formal therapy because repeated skills change the worry-response cycle without implying symptoms are imaginary.",
      "Administer prescribed SSRI or SNRI therapy consistently and monitor early activation, agitation, blood pressure when relevant, adherence, sexual effects, and suicidal thinking because benefit develops gradually while adverse effects may appear earlier.",
      "Escalate for suicide plan, severe functional collapse, mania, psychosis, serotonin-toxicity signs, dangerous substance use, chest pain, syncope, or focal neurologic findings because these require urgent psychiatric or medical assessment."
    ], [
      "Suicidal plan, self-harm, severe hopelessness, or inability to perform basic self-care",
      "New mania, psychosis, extreme agitation, or markedly reduced need for sleep",
      "Fever, clonus, rigidity, hyperreflexia, or autonomic instability after serotonergic treatment",
      "Chest pain, syncope, sustained dysrhythmia, focal deficit, or severe withdrawal findings"
    ], [
      "Take maintenance medication every day rather than only during worry spikes, and do not stop it abruptly; symptom relief often builds over weeks as therapy restores normal routines.",
      "Limit excess caffeine and alcohol, keep a consistent sleep and activity schedule, and seek help early if worry begins preventing eating, work, school, healthcare, or safe sleep."
    ]),
    card("Panic disorder", ["nice-anxiety"], [
      "During an acute episode, assess airway, breathing, pulse, blood pressure, oxygen saturation, glucose, chest pain, syncope, pregnancy, substance exposure, and neurologic findings because arrhythmia, ischemia, pulmonary embolism, asthma, hypoglycemia, and intoxication can resemble panic.",
      "Remain with the patient, reduce stimulation, use short concrete statements, and coach slow exhalation without paper-bag rebreathing because calm respiratory pacing reduces hypocapnia while paper bags can worsen unrecognized hypoxemia.",
      "After immediate medical threats are excluded, document sudden symptom onset, peak, anticipatory anxiety, avoidance, and functional change because recurrent unexpected attacks plus fear-driven behavior distinguish panic disorder from an isolated attack.",
      "Coordinate cognitive behavioral therapy with interoceptive and situational exposure and monitor prescribed SSRI effects because learning that body sensations are tolerable breaks the cycle of catastrophic interpretation and avoidance.",
      "Escalate for persistent chest pain, hypoxemia, syncope, hypotension, focal deficit, pregnancy emergency, suicide risk, severe agitation, or symptoms unlike prior attacks because labeling a medical emergency as panic can cause preventable harm."
    ], [
      "Persistent chest pressure, hypoxemia, hypotension, dysrhythmia, or syncope",
      "Focal neurologic deficit, seizure, severe headache, or altered consciousness",
      "Suicidal thinking, self-harm, severe depression, or inability to leave home for essential care",
      "First or atypical episode during pregnancy, substance exposure, withdrawal, or serious medical illness"
    ], [
      "A panic attack is intensely physical but time-limited; slow the exhale, name the sensations, and stay in a safe place rather than breathing into a paper bag or repeatedly fleeing.",
      "Keep therapy appointments between attacks because gradual exposure and reinterpretation prevent the fear of another attack from shrinking daily life."
    ]),
    card("Obsessive-compulsive disorder", ["nice-ocd"], [
      "Ask sensitively about intrusive thoughts, images, urges, rituals, avoidance, reassurance seeking, time consumed, insight, skin damage, nutrition, function, depression, and suicide risk because shame often hides severe impairment and unwanted thoughts do not equal intent.",
      "Differentiate an ego-dystonic obsession from psychosis, genuine violent intent, autism-related routines, eating pathology, and substance effects because risk assessment and treatment differ despite superficially repetitive behavior.",
      "Support cognitive behavioral therapy with graded exposure and response prevention, recording triggers, distress, ritual delay, and recovery because facing the trigger without completing the compulsion teaches that anxiety can fall on its own.",
      "Coach family members to reduce ritual participation and repeated reassurance gradually and compassionately because accommodation provides short relief but strengthens the obsessive-compulsive cycle.",
      "Monitor adherence, activation, suicidal thinking, sleep, sexual effects, and serotonin-toxicity signs with prescribed SSRI therapy, and escalate for suicide plan, inability to eat or drink, severe self-injury, psychosis, or dangerous rituals because intensive treatment may be required."
    ], [
      "Suicidal plan, self-harm, severe depression, or intrusive content accompanied by intent and preparation",
      "Food or fluid refusal, severe weight loss, skin injury, infection, or exhaustion caused by rituals",
      "Dangerous checking, cleaning chemicals, fire, driving, aggression, or inability to complete essential care",
      "New psychosis, mania, severe medication activation, fever with clonus, or autonomic instability"
    ], [
      "Intrusive thoughts are involuntary and do not define character; describe them honestly to the clinician because secrecy delays effective exposure and response prevention.",
      "Family support means encouraging the treatment plan without becoming part of every ritual or reassurance loop; reduce accommodation in agreed steps rather than through sudden punishment."
    ]),
    card("Serotonin syndrome", ["pmc-serotonin"], [
      "Stop all serotonergic medicines and obtain a precise timeline of prescriptions, over-the-counter products, supplements, illicit drugs, recent dose changes, and interactions because toxicity often follows a combination or increase and can progress quickly.",
      "Assess temperature, agitation, diaphoresis, bowel sounds, pupils, tremor, inducible or spontaneous clonus, ocular clonus, hyperreflexia, and rigidity because neuromuscular excitation distinguishes serotonin toxicity from many other febrile syndromes.",
      "Provide continuous cardiac, blood-pressure, oxygen, temperature, mental-status, and urine-output monitoring and trend creatine kinase, potassium, creatinine, bicarbonate, and coagulation because hyperthermia and muscle activity can cause rhabdomyolysis, acidosis, renal failure, and disseminated coagulation.",
      "Administer prescribed benzodiazepines, intravenous fluids, oxygen, and active external cooling while minimizing physical restraint because reducing agitation and muscle contraction lowers heat production whereas antipyretics do not correct this mechanism.",
      "Escalate immediately for temperature near or above 41 C, severe rigidity, rapidly rising creatine kinase, seizure, ventricular dysrhythmia, shock, respiratory failure, or worsening acidosis because intubation, nondepolarizing paralysis, and intensive resuscitation may be lifesaving."
    ], [
      "Extreme hyperthermia, severe rigidity, rapidly rising creatine kinase, or dark urine",
      "Seizure, delirium, coma, severe agitation, or inability to protect the airway",
      "Hypotension, ventricular dysrhythmia, severe hypertension, or rapidly changing autonomic signs",
      "Hyperkalemia, metabolic acidosis, oliguria, coagulopathy, or respiratory failure"
    ], [
      "Do not restart any suspected prescription, cough medicine, migraine drug, supplement, or recreational substance until the full interaction list has been reviewed by the treating clinician.",
      "Seek emergency care for fever with agitation, shaking, diarrhea, muscle jerks, clonus, or rigidity after a serotonergic change; this is different from a routine medication side effect."
    ]),
    card("Benzodiazepine withdrawal", ["asam-benzo"], [
      "Document the exact benzodiazepine, dose, schedule, duration, last dose, taper attempts, alcohol or opioid use, seizure history, pregnancy, and comorbid illness because onset and severity depend on half-life, physiologic dependence, and combined withdrawal risks.",
      "Monitor blood pressure, pulse, temperature, respiratory status, tremor, sweating, nausea, perception, orientation, sleep, agitation, and standardized withdrawal scores because autonomic escalation and delirium may precede a seizure.",
      "Institute seizure and fall precautions and maintain a low-stimulation environment with ready emergency medication and airway equipment because abrupt withdrawal can produce generalized seizures and dangerous agitation.",
      "Administer the individualized supervised taper exactly as prescribed and monitor sedation, breathing, gait, and interaction with opioids or alcohol because replacing withdrawal safely must not create respiratory depression.",
      "Escalate for seizure, hallucinations, delirium, severe hypertension or tachycardia, hyperthermia, suicidal behavior, uncontrolled vomiting, or inability to complete an outpatient taper because medically managed inpatient withdrawal may be necessary."
    ], [
      "Generalized seizure, status epilepticus, severe tremor, or rapidly escalating autonomic instability",
      "Hallucinations, delirium, profound confusion, severe agitation, or psychosis",
      "Respiratory depression or oversedation after rescue treatment or combined opioid exposure",
      "Suicidal behavior, uncontrolled vomiting, dehydration, pregnancy complication, or unsafe outpatient setting"
    ], [
      "Do not abruptly stop a benzodiazepine taken regularly; dependence is a predictable body adaptation, and a clinician-guided taper can be slowed or paused when withdrawal becomes unsafe.",
      "Avoid alcohol, nonprescribed sedatives, and opioids during the taper because combining depressants raises overdose risk while alternating them can complicate withdrawal."
    ]),
    card("Alcohol intoxication", ["nice-alcohol"], [
      "Assess airway protection, breathing, oxygen saturation, circulation, glucose, temperature, consciousness, pupils, trauma, coingestants, pregnancy, and suicide intent because alcohol odor does not exclude hypoglycemia, head injury, opioid poisoning, or another emergency.",
      "Place the patient laterally when aspiration risk is present, maintain suction and cervical-spine precautions when trauma is possible, and monitor respiratory rate and carbon dioxide when available because vomiting and depressed reflexes can obstruct ventilation.",
      "Check glucose promptly and administer prescribed dextrose and parenteral thiamine when indicated while trending electrolytes, acid-base status, osmolality, and ketones because malnutrition and alcoholic ketoacidosis require more than waiting for sobriety.",
      "Perform serial neurologic examinations and document that mental status, gait, speech, vital signs, and injuries improve along an expected trajectory because deterioration or failure to clear suggests bleeding, infection, toxic alcohol, or another cause.",
      "Escalate for apnea, recurrent aspiration, hypoglycemia, hypothermia, seizure, focal deficit, severe acidosis, visual symptoms, hypotension, violent behavior, or suicidal intent because airway support, antidotal treatment, imaging, or protected care may be urgent."
    ], [
      "Apnea, slow or irregular breathing, recurrent aspiration, cyanosis, or inability to protect the airway",
      "Hypoglycemia, hypothermia, severe dehydration, acidosis, or visual symptoms suggesting toxic alcohol",
      "Head trauma, unequal pupils, focal deficit, seizure, or mental status that fails to improve",
      "Suicidal intent, violent behavior, pregnancy emergency, or unsafe discharge supervision"
    ], [
      "Never leave a deeply sleepy intoxicated person alone to 'sleep it off'; place them on their side, call emergency services for abnormal breathing or poor arousal, and do not induce vomiting.",
      "After acute recovery, discuss withdrawal risk before suddenly stopping heavy daily alcohol use and connect to treatment, nutrition, and safety support without shame."
    ]),
    card("Delirium after surgery", ["nice-delirium"], [
      "Compare current attention, arousal, thinking, and behavior with the preoperative baseline and screen using 4AT or CAM-ICU as appropriate because delirium fluctuates and hypoactive cases are easily mistaken for normal postoperative sleepiness.",
      "Check oxygenation, ventilation, glucose, temperature, pain, hydration, electrolytes, hemoglobin, urine retention, bowel function, infection signs, and new neurologic deficits because postoperative delirium is usually driven by one or more reversible physiologic insults.",
      "Review anesthetics, opioids, anticholinergics, sedatives, home-medicine interruption, and alcohol or benzodiazepine dependence with the team because medication effects and withdrawal are common treatable causes.",
      "Provide glasses and hearing aids, clocks, daylight, familiar voices, sleep protection, early mobility, hydration, and calm repeated orientation while avoiding unnecessary restraints and catheters because sensory deprivation, immobility, and sleep disruption perpetuate delirium.",
      "Escalate for new focal deficit, seizure, severe hypoxemia, hypotension, fever with sepsis, rigid hyperthermia, uncontrolled agitation threatening safety, or reduced consciousness because stroke, bleeding, infection, medication toxicity, or organ failure needs immediate treatment."
    ], [
      "New focal weakness, aphasia, unequal pupils, severe headache, or seizure",
      "Hypoxemia, hypercapnia, hypotension, chest pain, sustained dysrhythmia, or poor perfusion",
      "Fever with sepsis findings, rigid hyperthermia, wound deterioration, or meningismus",
      "Rapidly reduced consciousness, violent unsafe agitation, fall, line removal, or inability to maintain essential treatment"
    ], [
      "Delirium is an acute brain response to illness or surgery, not the same as dementia; familiar voices, glasses, hearing aids, daylight, sleep, movement, and treating the cause help recovery.",
      "Report any new inattention, reversed sleep pattern, hallucination, unusual quietness, or fluctuating confusion promptly because early hypoactive delirium can be easy to miss."
    ]),
    card("HIV/AIDS", ["nih-hiv"], [
      "Confirm preferred language, confidentiality needs, current antiretroviral regimen, adherence barriers, allergies, pregnancy potential, and complete medication and supplement list because respectful engagement and interaction review are prerequisites for durable viral suppression.",
      "Trend HIV viral load, CD4 count, blood count, renal and liver function, metabolic measures, weight, and treatment-specific labs because virologic response, immune recovery, toxicity, and prophylaxis needs change over time.",
      "Assess fever, cough, dyspnea, headache, neck stiffness, vision change, oral lesions, diarrhea, weight loss, skin findings, cognition, and focal deficits because advanced immune suppression can produce opportunistic infection with subtle early symptoms.",
      "Administer antiretroviral and opportunistic-infection medicines on schedule, verify food requirements and drug interactions, and coordinate refill continuity because missed or interacting doses permit viral replication and resistance.",
      "Escalate for hypoxemia, rapidly progressive dyspnea, severe headache with neurologic change, sepsis, acute vision loss, severe diarrhea with dehydration, or a major drug reaction because opportunistic disease and treatment toxicity can threaten life or irreversible function."
    ], [
      "Dyspnea, hypoxemia, chest pain, cyanosis, or rapidly worsening cough",
      "Severe headache, meningismus, seizure, confusion, focal deficit, or reduced consciousness",
      "Acute visual loss, eye pain, floaters, or retinal symptoms in an immunocompromised patient",
      "Hypotension, persistent fever, severe diarrhea, oliguria, jaundice, or blistering drug rash"
    ], [
      "Take ART every day and contact the clinic before a supply gap or starting any prescription, supplement, or antacid because interactions and missed doses can cause resistance even when you feel well.",
      "An undetectable viral load prevents sexual transmission when it is durably maintained; keep laboratory and prevention visits and use the agreed plan for pregnancy, vaccines, and exposure care."
    ]),
    card("Cellulitis", ["idsa-ssti"], [
      "Mark and date the erythema border and assess warmth, edema, tenderness, drainage, fluctuance, lymphangitis, pain severity, pulses, sensation, and joint movement because spread and a drainable abscess change management.",
      "Measure temperature, heart rate, blood pressure, mental status, glucose when relevant, blood count, renal function, and lactate when systemically ill because cellulitis can progress to bacteremia and sepsis, especially with diabetes or immune suppression.",
      "Administer prescribed antibiotics on time and reassess the border, pain, fever, and function after initiation because early inflammation may transiently persist but continued spread suggests wrong coverage, poor absorption, or hidden source.",
      "Elevate the affected limb and inspect toe webs, wounds, eczema, edema, venous disease, and devices because reducing edema and treating the portal of entry lowers tissue pressure and recurrence risk.",
      "Escalate for pain out of proportion, rapid spread, bullae, crepitus, skin anesthesia, hypotension, confusion, orbital symptoms, joint immobility, or failure to improve because necrotizing infection, deep abscess, septic arthritis, or severe sepsis requires urgent source control."
    ], [
      "Pain out of proportion, rapid progression, dusky skin, bullae, crepitus, or cutaneous anesthesia",
      "Hypotension, confusion, rising lactate, oliguria, or other sepsis findings",
      "Eye pain, proptosis, impaired eye movement, visual change, or facial cellulitis with neurologic signs",
      "Fluctuant abscess, infected prosthesis, immobile joint, persistent fever, or spread despite therapy"
    ], [
      "Draw around the redness only if instructed, elevate the area, take every antibiotic dose, and return if redness spreads beyond the mark after the expected early period or pain becomes disproportionate.",
      "Protect cracked skin, treat athlete's foot and chronic swelling, moisturize eczema, and avoid squeezing lesions because an untreated skin break often becomes the entry point for recurrence."
    ]),
    card("Hand-foot-mouth disease", ["cdc-hfmd"], [
      "Assess mouth ulcers, drooling, swallowing, hand and foot lesions, temperature, activity, urine output, and exposure history because painful oral lesions create the main immediate risk of dehydration.",
      "Offer cool frequent fluids and soft nonacidic foods and administer weight-appropriate analgesia as prescribed because pain control improves intake more effectively than forcing large volumes.",
      "Monitor mucous membranes, tears, capillary refill, weight, wet diapers, and ability to swallow because young children can become dehydrated quickly while still appearing intermittently playful.",
      "Use meticulous hand hygiene after diapers and secretions, clean shared surfaces and toys, and avoid sharing cups or utensils because enteroviruses spread through respiratory secretions, blister fluid, and stool.",
      "Escalate for inability to swallow, no urine, persistent lethargy, severe headache, neck stiffness, weakness, seizure, breathing difficulty, or a child younger than three months with fever because dehydration or rare neurologic and cardiopulmonary complications need urgent assessment."
    ], [
      "Inability to swallow fluids, absent tears, markedly reduced urine, or poor perfusion",
      "Severe headache, neck stiffness, repeated vomiting, seizure, weakness, or altered responsiveness",
      "Breathing difficulty, cyanosis, chest pain, sustained tachycardia, or shock",
      "Fever in a young infant, prolonged fever, toxic appearance, or rash inconsistent with typical disease"
    ], [
      "Cold fluids, ice pops, and soft foods are often easier than acidic juice; do not use aspirin in children, and ask before using numbing mouth products.",
      "Handwashing after toileting and diaper changes matters even after the rash improves because virus can remain in stool; follow local childcare return rules rather than waiting for every spot to disappear."
    ]),
    card("Impetigo", ["cdc-impetigo"], [
      "Inspect and map honey-crusted, bullous, or ulcerative lesions and assess pain, warmth, drainage, mucosal involvement, fever, and close-contact outbreaks because deeper infection, herpes, or toxin-mediated disease can resemble impetigo.",
      "Clean lesions gently with soap and water, soften crusts as directed, cover draining areas, and use gloves for wound care because reducing surface bacteria and contact limits autoinoculation and transmission.",
      "Administer prescribed topical or oral antibiotics for the full course and monitor local response because limited disease and numerous lesions require different routes while incomplete treatment promotes persistence.",
      "Obtain culture when disease is recurrent, widespread, outbreak-associated, or treatment fails and inspect for scabies, eczema, insect bites, or nasal colonization because an untreated skin disorder or resistant organism can drive recurrence.",
      "Escalate for rapid painful spread, bullae with skin peeling, fever and toxicity, facial or eye involvement, dark urine, edema, reduced urine, or no improvement because invasive infection, staphylococcal scalded skin, orbital extension, or post-streptococcal kidney injury may be present."
    ], [
      "Rapidly spreading pain, deep ulceration, bullae, skin peeling, fever, or toxic appearance",
      "Eye swelling, pain with eye movement, proptosis, vision change, or facial spread",
      "Dark urine, facial edema, hypertension, reduced urine, or severe headache after infection",
      "Persistent new lesions, outbreak spread, or failure to improve despite correctly used antibiotics"
    ], [
      "Do not pick crusts; wash hands, keep nails short, cover lesions, and avoid sharing towels, razors, bedding, sports gear, or cosmetics until the contagious period has passed.",
      "Use every antibiotic dose for the prescribed duration and seek care for fever, rapidly painful redness, eye swelling, dark urine, or swelling even if the original skin spots seem better."
    ]),
    card("Scabies", ["cdc-scabies"], [
      "Inspect finger webs, wrists, axillae, waist, genitals, breasts, buttocks, scalp in infants or older adults, burrows, nodules, excoriations, and household itching because distribution and contact clustering distinguish scabies from eczema or allergy.",
      "Assess for thick crusts, widespread scale, immune suppression, institutional exposure, fever, drainage, and cellulitis because crusted scabies carries a very high mite burden and secondary bacterial infection can become severe.",
      "Apply prescribed scabicide to every instructed skin surface for the full contact time and repeat on schedule because missed areas and eggs surviving initial therapy are common causes of apparent failure.",
      "Coordinate simultaneous treatment of household and close sexual contacts and launder hot or seal recently used clothing and bedding as directed because treating only the symptomatic person permits immediate reinfestation.",
      "Escalate for crusted scabies, rapidly spreading infection, fever, hypotension, severe drug reaction, eye or mucosal exposure to treatment, or persistent new burrows after correct retreatment because isolation, specialist therapy, or another diagnosis may be needed."
    ], [
      "Crusted hyperkeratotic plaques, widespread scale, institutional outbreak, or severe immune suppression",
      "Fever, rapidly spreading erythema, purulent drainage, severe pain, or sepsis findings",
      "Wheezing, facial swelling, blistering rash, eye exposure, or another serious treatment reaction",
      "New burrows or lesions continuing after correctly timed treatment of patient, contacts, and environment"
    ], [
      "Itching can last several weeks after successful treatment because the immune reaction fades slowly; new burrows or fresh lesions, not itch alone, suggest ongoing infestation.",
      "Treat every named close contact at the same time and follow product-specific instructions exactly; spraying the whole home or using livestock products is unsafe and unnecessary."
    ]),
    card("Rubella", ["cdc-rubella"], [
      "Initiate Droplet Precautions, obtain vaccination and pregnancy exposure history, restrict susceptible pregnant staff, and notify infection prevention and public health because mild rubella can cause devastating congenital infection.",
      "Assess fever, postauricular and suboccipital nodes, rash onset and spread, arthralgia, eye symptoms, bruising, bleeding, and neurologic status because the clinical rash is nonspecific and uncommon complications affect platelets or brain.",
      "Coordinate throat or nasopharyngeal and blood testing with public health and document exposure dates because laboratory confirmation and timing determine contact and pregnancy management.",
      "Provide fluids, rest, fever and joint-pain treatment while monitoring intake, urine output, platelet-related bleeding, and mental status because treatment is supportive but deterioration should not be attributed to a benign exanthem.",
      "Escalate for pregnancy exposure, bleeding, severe headache, seizure, confusion, reduced consciousness, dehydration, or respiratory distress because fetal risk, thrombocytopenia, or encephalitis needs urgent specialty care."
    ], [
      "Any suspected rubella exposure or illness during pregnancy",
      "Petechiae with mucosal bleeding, heavy bleeding, or severe thrombocytopenia",
      "Severe headache, seizure, confusion, focal deficit, or reduced consciousness",
      "Inability to drink, oliguria, poor perfusion, or respiratory distress"
    ], [
      "Call before entering a clinic if rubella is possible and avoid contact with pregnant people until public health gives clearance because a mild rash can still harm a fetus.",
      "MMR vaccine prevents rubella but is not given during pregnancy; susceptible patients should follow the clinician's timing plan after pregnancy and avoid becoming pregnant for the advised interval."
    ]),
    card("Mumps", ["cdc-mumps"], [
      "Initiate Droplet Precautions, document parotitis onset and vaccination and exposure history, collect specimens with public-health guidance, and report the suspected case because outbreak control depends on timing and confirmation.",
      "Assess parotid swelling and pain, oral intake, hydration, hearing, headache, neck stiffness, abdominal pain, vomiting, and testicular or pelvic pain because mumps can involve meninges, pancreas, ovaries, testes, and auditory nerves.",
      "Provide fluids, soft foods, oral care, prescribed analgesia, and warm or cool gland compresses because chewing and acidic foods stimulate painful salivary flow and reduce intake.",
      "Support an inflamed scrotum with elevation and cold packs as ordered and monitor pain, swelling, nausea, and perfusion because orchitis can be severe and torsion remains an urgent alternative diagnosis.",
      "Escalate for severe headache, neck stiffness, seizure, altered consciousness, sudden hearing loss, severe abdominal pain, persistent vomiting, hypotension, or abrupt unilateral testicular pain because meningitis, encephalitis, pancreatitis, dehydration, or torsion requires urgent care."
    ], [
      "Severe headache, meningismus, seizure, confusion, focal deficit, or reduced consciousness",
      "Sudden hearing loss, severe vertigo, or new persistent tinnitus",
      "Severe epigastric pain, repeated vomiting, dehydration, hypotension, or hyperglycemia",
      "Abrupt unilateral testicular pain, high-riding testis, severe swelling, or absent cremasteric response"
    ], [
      "Avoid sour foods and drinks that stimulate saliva, use soft foods and fluids, and follow isolation guidance for five days after parotid swelling begins unless public health directs otherwise.",
      "Vaccination lowers risk but does not rule out mumps during an outbreak; call ahead for severe headache, hearing change, abdominal pain, or testicular pain."
    ]),
    card("Toxoplasmosis", ["cdc-toxo"], [
      "Clarify pregnancy timing, fetal findings, newborn status, HIV and CD4 history, transplant or immune suppression, cat and food exposure, visual symptoms, headache, and focal deficits because treatment urgency differs sharply among immunocompetent, pregnant, congenital, ocular, and immunocompromised patients.",
      "Perform serial neurologic and visual assessment and coordinate brain imaging, ophthalmic examination, serology, PCR, and HIV evaluation as ordered because encephalitis and retinochoroiditis may threaten life or sight while routine lymph-node disease may be self-limited.",
      "Administer prescribed pyrimethamine-based therapy, sulfadiazine or alternative, and folinic acid exactly on schedule and verify that leucovorin is not omitted because folate antagonism can suppress bone marrow.",
      "Trend blood count, renal and liver function, rash, hydration, vision, and neurologic response because cytopenia, sulfonamide reactions, kidney injury, and relapse can complicate prolonged treatment.",
      "Escalate for seizure, confusion, focal weakness, severe headache, acute visual change, pregnancy with suspected recent infection, newborn jaundice or hydrocephalus, neutropenic fever, or blistering rash because CNS, ocular, congenital disease, or treatment toxicity needs urgent specialty care."
    ], [
      "Seizure, focal deficit, confusion, severe headache, or reduced consciousness",
      "Acute visual loss, floaters, eye pain, photophobia, or lesion near critical retinal structures",
      "Recent maternal infection, abnormal fetal imaging, or newborn hydrocephalus, jaundice, or chorioretinitis",
      "Neutropenic fever, pancytopenia, oliguria, severe sulfonamide rash, or mucosal blistering"
    ], [
      "During pregnancy, avoid undercooked meat and unwashed produce, wear gloves for soil, and have someone else clean litter daily when possible; cats do not need to be abandoned.",
      "Take leucovorin and every antiparasitic dose exactly as prescribed and keep blood-count, eye, HIV, pregnancy, or infant follow-up because treatment controls active organisms but may not remove tissue cysts."
    ]),
    card("Zika virus infection", ["cdc-zika"], [
      "Document travel, mosquito exposure, sexual exposure, pregnancy timing, fever, rash, conjunctivitis, joint pain, neurologic symptoms, and local dengue activity because testing and fetal risk depend on place, timing, and pregnancy status.",
      "Assess hydration, bleeding, abdominal pain, blood pressure, mental status, strength, reflexes, swallowing, and breathing because dengue and Guillain-Barre syndrome are important dangerous alternatives or complications.",
      "Provide rest, fluids, and acetaminophen as prescribed while avoiding aspirin and other NSAIDs until dengue is excluded because platelet dysfunction can worsen dengue hemorrhage.",
      "Coordinate public-health testing and serial obstetric ultrasound and fetal assessment for pregnancy exposure, and arrange newborn head, eye, hearing, feeding, and developmental evaluation when indicated because congenital effects may be detected before or after birth.",
      "Escalate for bleeding, shock, severe abdominal pain, rapidly progressive weakness, areflexia, facial or bulbar weakness, respiratory difficulty, or concerning fetal findings because dengue, neurologic paralysis, or congenital complications need urgent specialty management."
    ], [
      "Bleeding, severe abdominal pain, persistent vomiting, hypotension, or shock suggesting dengue",
      "Ascending weakness, absent reflexes, facial weakness, dysphagia, or shallow breathing",
      "Pregnancy with confirmed infection, abnormal fetal growth, microcephaly, or intracranial findings",
      "Newborn feeding failure, seizure, vision or hearing concern, contracture, or developmental abnormality"
    ], [
      "Prevent mosquito bites day and night and follow current condom or abstinence guidance after exposure because Zika can spread through both mosquitoes and sex.",
      "If pregnant or planning pregnancy, contact the prenatal team after possible exposure even without symptoms; do not use ibuprofen, naproxen, or aspirin for a Zika-like illness until dengue is ruled out."
    ]),
    card("Angioedema", ["aha-anaphylaxis"], [
      "Assess voice, tongue and floor-of-mouth swelling, drooling, stridor, wheeze, respiratory effort, oxygen saturation, blood pressure, skin findings, abdominal symptoms, exposure timing, and ACE-inhibitor use because airway progression and histamine versus bradykinin mechanism guide urgent care.",
      "Activate emergency airway support early for tongue, laryngeal, or rapidly progressive swelling and prepare suction, oxygen, difficult-airway equipment, and experienced intubation assistance because complete obstruction can make later airway access impossible.",
      "Administer intramuscular epinephrine promptly when angioedema is part of anaphylaxis and monitor continuous cardiac and hemodynamic response because epinephrine treats systemic mast-cell airway and circulatory collapse.",
      "Stop the suspected causative drug and administer mechanism-specific prescribed therapy while recognizing that antihistamines, corticosteroids, and epinephrine may not reverse isolated ACE-inhibitor or hereditary bradykinin angioedema because the mediator is different.",
      "Escalate for voice change, stridor, inability to swallow secretions, rapidly enlarging tongue, hypoxemia, hypotension, recurrent swelling after initial improvement, or severe abdominal pain because airway loss, biphasic anaphylaxis, or visceral edema may require intensive observation."
    ], [
      "Voice change, stridor, drooling, inability to swallow, or rapidly enlarging tongue or floor-of-mouth swelling",
      "Hypoxemia, severe wheeze, cyanosis, respiratory fatigue, or reduced consciousness",
      "Hypotension, syncope, widespread hives with gastrointestinal symptoms, or other anaphylaxis findings",
      "Recurrent swelling after improvement, severe abdominal pain, or known hereditary angioedema with progression"
    ], [
      "Use epinephrine and call emergency services immediately for swelling with breathing trouble, throat symptoms, faintness, or widespread allergic symptoms; antihistamines are not a substitute for epinephrine in anaphylaxis.",
      "Never restart an ACE inhibitor after ACE-inhibitor angioedema unless a specialist explicitly determines otherwise, and carry the written hereditary or allergic emergency plan and prescribed rescue treatment."
    ]),
    card("Chronic lymphocytic leukemia", ["nci-cll"], [
      "Trend the complete blood count with differential, hemoglobin, platelets, absolute neutrophil count, lymphocyte pattern, lymph-node size, spleen findings, weight, and night sweats because CLL can progress through marrow crowding, immune cytopenias, or increasing tumor burden even when the patient initially feels well.",
      "Check temperature and assess cough, dysuria, oral lesions, skin changes, and other infection symptoms at every contact, obtaining ordered cultures promptly because CLL produces poorly functioning B lymphocytes and its treatments can further weaken immune defenses.",
      "Assess bruising, petechiae, mucosal bleeding, fatigue, jaundice, dark urine, and shortness of breath and correlate them with platelet and hemolysis studies because thrombocytopenia and autoimmune destruction of blood cells can require urgent treatment.",
      "Administer prescribed targeted therapy, immunotherapy, or chemotherapy only after reviewing interactions and baseline renal, hepatic, and cardiac data, then monitor electrolytes, creatinine, uric acid, rhythm, blood pressure, bleeding, and infusion reactions because treatment can cause tumor lysis and drug-specific organ toxicity.",
      "Escalate immediately for fever with neutropenia, sepsis findings, uncontrolled bleeding, symptomatic rapid anemia, tumor-lysis abnormalities, threatened airway from bulky nodes, or sudden painful node enlargement with systemic decline because infection, hemorrhage, metabolic collapse, or transformation to aggressive lymphoma can become life-threatening."
    ], [
      "Fever of 38 C (100.4 F) or higher, shaking chills, hypotension, confusion, or another sign of serious infection",
      "Uncontrolled bleeding, widespread petechiae, black stool, severe headache, or a critically low platelet count",
      "Rapidly worsening pallor, dyspnea, chest pain, jaundice, dark urine, or laboratory evidence of acute hemolysis",
      "Rapidly enlarging or painful lymph nodes, drenching sweats, unexplained weight loss, airway symptoms, or abrupt functional decline"
    ], [
      "Observation without immediate treatment can be appropriate when CLL is stable; keep every blood-count and examination appointment because treatment is started for meaningful progression, not simply because leukemia cells are present.",
      "Report fever, infection symptoms, unusual bleeding, jaundice, rapidly growing nodes, or new shortness of breath the same day, and check with the oncology team before vaccines, supplements, or over-the-counter medicines."
    ]),
    card("Chronic myeloid leukemia", ["nci-cml"], [
      "Assess fatigue, fever, bleeding, bone pain, early satiety, abdominal fullness, spleen size, and the complete blood count with differential because rising myeloid cells, splenic enlargement, or new cytopenias can signal inadequate control or phase progression.",
      "Coordinate BCR::ABL1 molecular testing at the scheduled milestones and interpret each trend alongside blasts, platelet count, new anemia, and spleen findings because the speed and depth of molecular response reveal whether the tyrosine-kinase inhibitor is suppressing the leukemia or resistance and phase progression are emerging.",
      "Verify the exact tyrosine-kinase inhibitor, dose, food instructions, adherence, acid-suppressing medicines, anticoagulants, supplements, and other interacting drugs because inconsistent exposure or a pharmacologic interaction can imitate treatment resistance or amplify bleeding and organ toxicity.",
      "Monitor renal and hepatic function, electrolytes, weight and edema, blood pressure, respiratory symptoms, electrocardiogram or QT interval when indicated, and agent-specific vascular or pulmonary effects because different inhibitors have distinct serious toxicities.",
      "Escalate for new neurologic deficit, severe headache, dyspnea, hypoxemia, priapism, major bleeding, rapidly rising white count, blasts with fever or bone pain, or tumor-lysis findings because leukostasis or transformation to accelerated or blast phase requires urgent leukemia care."
    ], [
      "New confusion, focal weakness, vision change, severe headache, hypoxemia, chest pain, or priapism suggesting leukostasis",
      "Fever, rapidly increasing blasts, severe bone pain, enlarging spleen, or new anemia and thrombocytopenia suggesting phase progression",
      "Major bleeding, profound weakness, symptomatic anemia, or severe infection during a treatment-related cytopenia",
      "Palpitations, syncope, marked edema, sudden dyspnea, jaundice, or tumor-lysis electrolyte and kidney abnormalities"
    ], [
      "Take the tyrosine-kinase inhibitor exactly as its label directs and never stop it because you feel well; sustained drug exposure is what keeps BCR::ABL1-positive cells suppressed.",
      "Keep molecular blood-test appointments even when the routine blood count is normal, and contact the leukemia team before starting antacids, supplements, grapefruit products, or any new prescription."
    ]),
    card("Iron deficiency anemia", ["aga-iron"], [
      "Assess fatigue, exercise intolerance, dizziness, pica, pallor, heart rate, orthostatic symptoms, chest discomfort, and bleeding history, and trend the complete blood count, red-cell indices, ferritin, transferrin saturation, and reticulocyte response because severity and iron-store depletion determine urgency and provide a baseline for recovery.",
      "Investigate the reason for deficiency by documenting menstrual, gastrointestinal, urinary, dietary, pregnancy, donation, medication, and malabsorption history and by coordinating age-appropriate gastrointestinal or gynecologic evaluation because replacing iron without finding ongoing blood loss can delay diagnosis of a serious cause.",
      "Administer oral iron on the prescribed schedule, separate it from interfering antacids or minerals when directed, and address nausea or constipation with an alternative formulation or dosing plan because a tolerable regimen is more likely to restore iron stores than one the patient cannot continue.",
      "For intravenous iron, verify the calculated dose and intravenous access, obtain baseline vital signs, and observe during and after infusion for flushing, wheeze, hypotension, chest or back pain, and delayed reaction because parenteral replacement is effective when oral absorption fails but can rarely cause serious hypersensitivity.",
      "Recheck hemoglobin and iron stores at the planned interval and escalate for syncope, chest pain, resting dyspnea, hemodynamic instability, brisk bleeding, pregnancy with severe symptoms, absent hematologic response, or falling values despite therapy because profound anemia, continuing blood loss, malabsorption, or an alternate diagnosis may need urgent intervention."
    ], [
      "Syncope, chest pain, resting shortness of breath, marked tachycardia, hypotension, or altered mental status with severe anemia",
      "Vomiting blood, black tarry stool before iron is started, heavy uncontrolled vaginal bleeding, or another active source of blood loss",
      "Wheeze, facial swelling, hypotension, severe chest or back pain, or collapse during intravenous iron administration",
      "Hemoglobin that fails to rise, recurrent deficiency after replacement, progressive weight loss, dysphagia, or persistent gastrointestinal symptoms"
    ], [
      "Iron may darken stool and cause constipation or nausea, but tarry sticky stool with weakness or abdominal symptoms can represent bleeding; ask for a more tolerable regimen instead of silently stopping treatment.",
      "Keep iron out of children's reach because overdose is dangerous, take it only as directed, and complete follow-up testing so the team can confirm both hemoglobin recovery and replenishment of stored iron."
    ]),
    card("Sickle cell disease", ["cdc-scd"], [
      "Assess pain location, intensity, triggers, home treatment, hydration, function, neurologic status, and the patient's individualized baseline, then give prescribed multimodal analgesia promptly and reassess its effect and sedation because vaso-occlusive pain is time-sensitive and undertreatment increases physiologic stress.",
      "Monitor respiratory rate, effort, lung sounds, temperature, oxygen saturation, chest pain, and cough; provide oxygen for hypoxemia, balanced hydration when needed, and incentive spirometry during chest or back pain because atelectasis and sickling can evolve into acute chest syndrome while excessive fluid can worsen pulmonary status.",
      "Treat a temperature of 38.5 C (101.3 F) or higher, or the institution's lower sickle-cell threshold, as urgent by obtaining ordered cultures and giving empiric antibiotics without avoidable delay because functional asplenia permits encapsulated bacterial infection to become fulminant quickly.",
      "Screen repeatedly for weakness, speech or vision change, severe headache, increasing spleen size with pallor or tachycardia, and priapism duration because stroke, splenic sequestration, and ischemic penile injury require specific time-critical treatment rather than routine pain management.",
      "Verify hydroxyurea or other disease-modifying treatment, monitor the complete blood count and organ function required for that therapy, and escalate for acute chest findings, focal neurologic deficit, sepsis, shock, rapidly falling hemoglobin, or priapism lasting four hours because transfusion, exchange therapy, intensive support, or urgent specialty intervention may be needed."
    ], [
      "Fever at or above the patient's emergency threshold, shaking chills, hypotension, confusion, or toxic appearance",
      "Chest pain, cough, fever, new lung finding, falling oxygen saturation, or increasing work of breathing",
      "New weakness, facial droop, speech or vision change, seizure, severe headache, or altered consciousness",
      "Rapid spleen enlargement with pallor or shock, sudden severe anemia, or an erection lasting four hours or longer"
    ], [
      "Follow the written pain plan early, drink regularly without forcing excessive fluid, use incentive spirometry as taught during chest or back pain, and seek urgent care for fever, breathing symptoms, neurologic change, or priapism.",
      "Keep vaccines, preventive antibiotics when prescribed, hydroxyurea monitoring, eye and kidney screening, and stroke-surveillance appointments because preventing complications is as important as treating pain crises."
    ]),
    card("Pancreatic cancer", ["nci-pancreatic"], [
      "Assess pain pattern, jaundice, itching, dark urine, pale or greasy stool, nausea, vomiting, abdominal distention, weight trend, intake, performance status, and new glucose instability because tumor location can obstruct bile or pancreatic flow and impair digestion before other findings are obvious.",
      "Trend bilirubin, liver enzymes, coagulation results, temperature, and biliary-drain or stent output and patency because obstruction reduces vitamin K absorption and an infected blocked biliary system can progress rapidly to cholangitis and sepsis.",
      "Coordinate small energy-dense meals, antiemetics, dietitian review, glucose checks, and pancreatic enzyme replacement with meals and snacks when prescribed, then monitor stool quality and weight because exocrine insufficiency and treatment effects cause malabsorption rather than simple loss of appetite alone.",
      "After surgery or systemic treatment, monitor incision and drains, bowel function, glucose, hydration, blood counts, neuropathy, infection, delayed gastric emptying, and treatment-specific toxicities because pancreatic resection and chemotherapy affect several digestive and metabolic functions at once.",
      "Escalate for fever with jaundice, hypotension, uncontrolled pain, persistent vomiting or inability to pass stool or gas, gastrointestinal bleeding, sudden dyspnea or unilateral leg swelling, or postoperative drain and abdominal changes because cholangitis, obstruction, hemorrhage, venous thromboembolism, or an anastomotic complication may be developing."
    ], [
      "Fever, rigors, worsening jaundice, right-upper-abdominal pain, hypotension, or confusion suggesting cholangitis",
      "Persistent vomiting, increasing distention, inability to pass stool or gas, severe new pain, or gastrointestinal bleeding",
      "Sudden shortness of breath, pleuritic chest pain, hemoptysis, or unilateral leg swelling suggesting venous thromboembolism",
      "Postoperative tachycardia, fever, peritoneal findings, abrupt drain change, uncontrolled glucose, or rapidly worsening weakness"
    ], [
      "Take pancreatic enzymes with the first bites of every prescribed meal and snack rather than before or after the entire meal, and report persistent greasy stool or weight loss so the dose and nutrition plan can be adjusted.",
      "Call promptly for fever with jaundice, a change in biliary-drain output, repeated vomiting, black or bloody stool, new leg swelling, or sudden breathing trouble; these are not symptoms to wait for the next cancer visit."
    ]),
    card("Melanoma", ["nci-melanoma"], [
      "Perform and document a complete skin and lymph-node assessment, including lesion asymmetry, border, color, diameter, evolution, bleeding, and a measured or photographed baseline when permitted because change over time and regional spread guide diagnostic urgency.",
      "Protect and assess the biopsy or excision site for bleeding, dehiscence, infection, sensation, and drainage and verify pathology and margin follow-up because definitive depth, ulceration, and margins determine staging and the next treatment decision.",
      "Coordinate ordered imaging, sentinel-node procedures, surgery, systemic therapy, and surveillance while tracking new nodes, unexplained pain, weight loss, cough, headache, or neurologic symptoms because recurrence may appear in skin, nodes, or distant organs.",
      "During immune-checkpoint or targeted therapy, monitor stool frequency, respiratory symptoms, oxygen saturation, liver tests, glucose, thyroid and adrenal findings, rash, fever, and cardiac or neurologic symptoms because immune inflammation or targeted-drug toxicity can affect almost any organ and may initially seem unrelated to cancer treatment.",
      "Escalate for rapidly changing or bleeding lesions, wound infection or uncontrolled postoperative bleeding, severe diarrhea, jaundice, dyspnea, chest pain, profound weakness, severe headache, focal deficit, or high fever during therapy because progression and treatment toxicities need early specialist management."
    ], [
      "A rapidly enlarging, ulcerating, or bleeding lesion or a new hard regional lymph node",
      "Severe diarrhea, abdominal pain, blood in stool, jaundice, dark urine, or persistent vomiting during immunotherapy",
      "New cough, hypoxemia, chest pain, marked weakness, confusion, severe headache, seizure, or focal neurologic change",
      "High fever, extensive blistering rash, wound dehiscence, spreading redness, or uncontrolled postoperative bleeding"
    ], [
      "Examine the entire skin monthly, including scalp, soles, nails, and between toes, and photograph concerning spots with a size reference because the most useful warning is often a lesion that is changing or unlike the others.",
      "Use broad-spectrum sun protection and avoid tanning devices, but do not rely on prevention alone after melanoma; keep skin, lymph-node, and treatment-surveillance visits and report possible immune side effects early."
    ]),
    card("Angle-closure glaucoma", ["aao-angle"], [
      "Treat sudden eye pain, blurred vision or halos, headache, nausea, and vomiting as an ocular emergency and promptly document visual acuity in each eye, pupil response, corneal haze, redness, symptom onset, vital signs, and measured intraocular pressure when trained because sustained pressure can irreversibly injure the optic nerve within hours.",
      "Notify ophthalmology immediately, keep the patient fasting if a procedure is likely, protect the affected eye, and avoid pharmacologic dilation or anticholinergic and sympathomimetic medicines unless specifically approved because further pupillary block can worsen angle closure.",
      "Administer prescribed topical pressure-lowering agents and systemic acetazolamide or hyperosmotic therapy in the ordered sequence, then recheck pressure, pain, vision, electrolytes, renal status, blood pressure, and heart rate because rapid pressure reduction is needed but these medicines have important systemic contraindications and effects.",
      "Prepare the patient for laser peripheral iridotomy or another definitive procedure and confirm evaluation of the fellow eye because medication relieves the attack but does not remove the anatomic block, and the opposite eye often shares the same risk.",
      "Escalate without delay for worsening vision, a fixed mid-dilated pupil, persistent vomiting, rising pressure despite therapy, severe bradycardia or hypotension, breathing difficulty, or altered consciousness because uncontrolled glaucoma or treatment toxicity threatens vision and systemic stability."
    ], [
      "Sudden severe eye pain, red eye, blurred vision, halos, headache, nausea, or vomiting",
      "Rapidly falling visual acuity, corneal haze, a fixed mid-dilated pupil, or persistently high intraocular pressure",
      "Symptoms or pressure that worsen or fail to improve after initial pressure-lowering treatment",
      "Severe hypotension, bradycardia, wheeze, electrolyte disturbance, kidney decline, or altered consciousness during therapy"
    ], [
      "Sudden painful red eye with blurred vision, halos, headache, nausea, or vomiting requires emergency eye care; do not wait for a routine appointment or drive yourself when vision is impaired.",
      "Bring a complete medication list because some dilating, cold, bladder, and motion-sickness medicines can trigger closure in susceptible eyes, and keep definitive-procedure and fellow-eye follow-up even after pain resolves."
    ]),
    card("Corneal abrasion", ["rch-eye"], [
      "Measure visual acuity in both eyes before treatment when feasible and ask about contact lenses, chemicals, high-velocity particles, metal work, plants, fingernails, and prior eye surgery because the mechanism changes the risk of infection, retained foreign body, or penetrating globe injury.",
      "Inspect the pupils and anterior eye, evert the lids when safe, and assist with fluorescein examination, but avoid pressure, tonometry, or lid manipulation when an irregular pupil, extrusion, marked vision loss, or other open-globe finding is present because pressure can worsen ocular-content loss.",
      "Irrigate loose surface material and administer prescribed topical antibiotic, oral analgesia, cycloplegic, and tetanus care while documenting defect size and location because epithelial protection and pain control support healing and establish whether the abrasion is improving.",
      "Remove contact lenses and apply contact-lens-specific antimicrobial and ophthalmology plans when ordered, and never send topical anesthetic home for unsupervised use because Pseudomonas infection and anesthetic-related epithelial toxicity can rapidly threaten the cornea.",
      "Escalate for suspected penetrating or high-velocity injury, hyphema, major vision reduction, central or large defect, corneal infiltrate, purulent discharge, worsening pain, or failure to improve within 24 to 48 hours because a retained foreign body, ulcer, infection, or deeper injury may be present."
    ], [
      "Irregular pupil, visible globe defect, extrusion, hyphema, severe vision loss, or a high-velocity penetrating mechanism",
      "Corneal white spot or infiltrate, purulent discharge, increasing redness, fever, or rapidly worsening pain",
      "Contact-lens wearer with pain, photophobia, reduced vision, or a corneal defect suggesting microbial keratitis",
      "Large or central abrasion, retained foreign body, recurrent symptoms, or no clear improvement within 24 to 48 hours"
    ], [
      "Do not rub the eye, wear contact lenses, use leftover drops, or place numbing drops in the eye at home; use only the prescribed medicine and resume lenses only after healing and clinical clearance.",
      "Return urgently for worse pain, a white corneal spot, discharge, reduced vision, severe light sensitivity, or symptoms that are not clearly improving by the advised follow-up time."
    ]),
    card("Epistaxis", ["aao-epistaxis"], [
      "Sit the patient upright and leaning forward, have them spit out blood, and apply uninterrupted firm pressure to the soft lower nose for at least 10 to 15 minutes by the clock because this compresses the common anterior bleeding site while reducing aspiration and swallowed blood.",
      "Assess airway, breathing, blood pressure, pulse, mental status, blood loss, posterior pharyngeal flow, and response to compression, establishing suction and intravenous access when bleeding is heavy because posterior or high-volume hemorrhage can compromise ventilation and circulation.",
      "Review anticoagulants, antiplatelets, intranasal drugs, trauma, hypertension, liver disease, and bleeding history and obtain ordered complete blood count, coagulation studies, and type and screen for severe or recurrent bleeding because medication effects and systemic coagulopathy change treatment and recurrence risk.",
      "Administer prescribed topical vasoconstrictor and assist with directed cautery or packing after the bleeding site is identified, then monitor packing position, recurrent oral bleeding, oxygenation, pain, and infection because blind bilateral manipulation can injure tissue and posterior packing can obstruct the airway.",
      "Escalate for airway compromise, hemodynamic instability, persistent bleeding despite correctly timed compression and first-line treatment, suspected posterior source, major trauma, severe anemia, or recurrent unilateral bleeding with a mass because resuscitation, endoscopic control, embolization, or diagnostic evaluation may be required."
    ], [
      "Difficulty breathing, choking on blood, reduced consciousness, or inability to protect the airway",
      "Hypotension, tachycardia, pallor, syncope, chest pain, or ongoing high-volume blood loss",
      "Persistent posterior throat bleeding or hemorrhage that continues despite compression, vasoconstrictor, and appropriate packing",
      "Major facial trauma, severe anemia or coagulopathy, or recurrent one-sided bleeding with obstruction or a visible mass"
    ], [
      "For a new nosebleed, sit forward and pinch the soft part continuously for the full advised time without checking early; do not tilt the head back because swallowed blood can cause vomiting or aspiration.",
      "After bleeding stops, follow the plan for saline gel or humidification and avoid nose picking, forceful blowing, heavy straining, and hot showers for the advised period; seek care if bleeding restarts or packing shifts."
    ]),
    card("Otitis media", ["aap-otitis"], [
      "Assess ear pain, fever, sleep and feeding change, hearing behavior, duration, age, immunization status, prior infections, and toxic appearance, and document tympanic-membrane bulging, otorrhea, mobility, and middle-ear effusion because symptoms alone do not distinguish acute bacterial otitis media from viral illness or otitis media with effusion.",
      "Provide weight-based acetaminophen or ibuprofen when age and clinical status permit and reassess pain and intake because analgesia is necessary whether the child receives immediate antibiotics or observation.",
      "When antibiotics are prescribed, verify weight, allergy history, dose, interval, and recent antibiotic exposure and support completion; when observation is selected, confirm a reliable 48- to 72-hour reassessment pathway because age, severity, laterality, and follow-up reliability determine whether watchful waiting is safe.",
      "Reassess persistent symptoms after 48 to 72 hours and monitor recurrent episodes, middle-ear fluid, hearing, speech, balance, and school performance because treatment failure may need a different regimen and prolonged effusion can affect communication even without acute pain.",
      "Escalate for postauricular redness or swelling, protruding pinna, facial weakness, severe headache, neck stiffness, altered consciousness, infant fever with toxic appearance, dehydration, or worsening despite therapy because mastoiditis, facial-nerve involvement, meningitis, or systemic infection may be developing."
    ], [
      "Postauricular swelling or redness, protruding ear, severe mastoid tenderness, or toxic appearance",
      "Facial weakness, severe headache, neck stiffness, seizure, confusion, or reduced consciousness",
      "Young infant with fever, poor perfusion, persistent vomiting, inability to drink, or markedly fewer wet diapers",
      "Pain or fever worsening or not improving after 48 to 72 hours, new otorrhea, or progressive hearing and balance change"
    ], [
      "Treat pain on schedule as directed and complete antibiotics when prescribed; if observation was chosen, use the agreed follow-up route promptly when pain or fever persists or worsens over 48 to 72 hours.",
      "Do not put cotton swabs or unprescribed drops into the ear, and reduce recurrence risk with recommended vaccines, a smoke-free environment, and avoiding bottle propping while the child lies flat."
    ]),
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
  window.ANI_PATHOLOGY_NURSING_WAVE30_B = {
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
