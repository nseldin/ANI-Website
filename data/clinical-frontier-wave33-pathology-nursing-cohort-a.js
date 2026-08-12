(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  function activePathologyEntries() {
    return typeof pathologyDiseases !== "undefined" && Array.isArray(pathologyDiseases)
      ? pathologyDiseases
      : database.diseases;
  }

  const VERSION = "2026-08-12-wave33-pathology-nursing-a-2";
  const sources = [
    { id: "w33a-ards-ats", label: "ATS/ESICM/SCCM, Mechanical Ventilation in Adult ARDS", url: "https://www.thoracic.org/statements/resources/cc/ards-guidelines.pdf", note: "Supports adult ARDS lung-protective ventilation, pressure limitation, prolonged prone positioning, and monitoring for ventilator-induced lung injury; it does not prescribe one setting for every patient." },
    { id: "w33a-ards-global", label: "ATS Workshop, New Global Definition of ARDS", url: "https://www.atsjournals.org/doi/full/10.1164/rccm.202303-0558WS", note: "Supports the current conceptual model of permeability injury, edema, atelectasis, shunt, dead space, reduced compliance, and severity classification; bedside diagnosis still requires the complete clinical context." },
    { id: "w33a-ards-gas", label: "ATS, Gas Exchange in Acute Respiratory Distress Syndrome", url: "https://www.atsjournals.org/doi/full/10.1164/rccm.201610-2156SO", note: "Supports physiologic distinctions among shunt, low ventilation-perfusion matching, alveolar dead space, oxygenation response, and ventilatory consequences in ARDS." },
    { id: "w33a-ards-esicm-2023", label: "ESICM, ARDS Definition and Respiratory Support Guidelines (2023)", url: "https://link.springer.com/article/10.1007/s00134-023-07050-7", note: "Supports the adult ARDS prone-positioning treatment context of PaO2/FiO2 below 150 mm Hg with PEEP at or above 5 cm H2O despite optimized ventilation; this treatment threshold is not a universal definition of refractory hypoxemia." },
    { id: "w33a-refractory-hypoxemia-annalsats", label: "AnnalsATS, Refractory Hypoxemia and ARDS Adjunctive Therapies", url: "https://academic.oup.com/annalsats/article/14/12/1768/8453655", note: "Documents that refractory hypoxemia has no uniformly accepted numeric definition and that published thresholds vary with oxygen, PEEP, duration, recruitment, and ARDS context." },
    { id: "w33a-cap-idsa", label: "ATS/IDSA, Adult Community-Acquired Pneumonia Guideline", url: "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults", note: "Supports severity assessment, diagnostic testing, empiric treatment, and reassessment in adult community-acquired pneumonia; pediatric, immunocompromised, and hospital-acquired pneumonia require different guidance." },
    { id: "w33a-sepsis-sccm-2026", label: "SCCM/ESICM, Surviving Sepsis Campaign Adult Guidelines 2026", url: "https://www.sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines", note: "Supports contextual lactate interpretation, capillary-refill assessment, dynamic fluid-responsiveness measures, perfusion targets, vasopressors, and urgent sepsis care; isolated values do not define adequate circulation." },
    { id: "w33a-fluid-ncbi", label: "NCBI Bookshelf, Physiology of Colloid Osmotic Pressure", url: "https://www.ncbi.nlm.nih.gov/books/NBK541067/", note: "Supports hydrostatic, oncotic, permeability, and lymphatic determinants of transcapillary fluid movement; simplified Starling concepts must be applied with the patient's organ function and cause of edema." },
    { id: "w33a-renal-phys-ncbi", label: "NCBI Bookshelf, Renal Physiology", url: "https://www.ncbi.nlm.nih.gov/books/NBK538339/", note: "Supports integrated renal filtration, electrolyte, osmolality, acid-base, renin, erythropoietin, and vitamin-D physiology; it is an educational physiology source rather than a treatment guideline." },
    { id: "w33a-renal-flow-ncbi", label: "NCBI Bookshelf, Renal Blood Flow and Filtration", url: "https://www.ncbi.nlm.nih.gov/books/NBK482248/", note: "Supports glomerular filtration-barrier function, autoregulation, afferent tone, macula-densa signaling, and tubuloglomerular feedback; clinical AKI management requires cause-specific assessment." },
    { id: "w33a-ckd-kdigo-2024", label: "KDIGO, 2024 CKD Evaluation and Management Guideline", url: "https://kdigo.org/guidelines/ckd-evaluation-and-management/", note: "Supports CKD definition, cause-GFR-albuminuria classification, risk assessment, complication surveillance, medication stewardship, referral, and kidney-failure planning." },
    { id: "w33a-ckd-mbd-kdigo", label: "KDIGO, CKD-Mineral and Bone Disorder Guideline", url: "https://kdigo.org/guidelines/ckd-mbd/", note: "Supports serial calcium, phosphate, parathyroid-hormone, vitamin-D, bone, and vascular assessment in CKD-MBD; treatment should follow trends and CKD stage rather than one isolated result." },
    { id: "w33a-diabetes-ckd-kdigo", label: "KDIGO, Diabetes Management in CKD", url: "https://kdigo.org/guidelines/diabetes-ckd/", note: "Supports the final KDIGO diabetes-in-CKD framework for glycemic monitoring, kidney-protective therapy, albuminuria, cardiovascular risk, and multidisciplinary care; public-review drafts are not treated as final guidance." },
    { id: "w33a-diabetic-kidney-niddk", label: "NIDDK, Diabetic Kidney Disease", url: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/diabetic-kidney-disease", note: "Supports urine albumin and eGFR screening, blood-pressure and glucose management, medication safety, and patient education for diabetic kidney disease." },
    { id: "w33a-aki-kdigo", label: "KDIGO, Acute Kidney Injury Guideline Suite", url: "https://kdigo.org/guidelines/acute-kidney-injury/", note: "Supports established AKI staging, cause evaluation, supportive care, and kidney-replacement principles; the 2012 guideline remains final while the 2026 AKI/AKD update is under public review." },
    { id: "w33a-hemodialysis-niddk", label: "NIDDK, Hemodialysis", url: "https://www.niddk.nih.gov/health-information/kidney-disease/kidney-failure/hemodialysis", note: "Supports hemodialysis purpose, fistula, graft, and catheter distinctions, access care, treatment adherence, fluid removal, and patient-facing safety education." },
    { id: "w33a-access-kdoqi", label: "National Kidney Foundation KDOQI, 2019 Vascular Access Guideline", url: "https://www.kidney.org/professionals/kdoqi/guidelines-and-commentaries/vascular-access", note: "Supports individualized ESKD life-plan decisions, access selection, examination, cannulation, dysfunction recognition, and intervention rather than a fistula-first rule for every patient." },
    { id: "w33a-dialysis-cdc", label: "CDC, Infections and Patients on Dialysis", url: "https://www.cdc.gov/dialysis-safety/about/index.html", note: "Supports dialysis-access infection risk, daily access checks, catheter precautions, hand hygiene, and urgent recognition of bloodstream infection; it does not replace facility protocols." },
    { id: "w33a-pd-ispd", label: "ISPD, Peritoneal Dialysis Guidelines", url: "https://ispd.org/guidelines/", note: "Supports current peritoneal-dialysis infection prevention, effluent evaluation, treatment principles, catheter-related care, training, and technique survival; antimicrobial selection remains protocol and culture specific." },
    { id: "w33a-hemodialysis-ncbi", label: "NCBI Bookshelf, Hemodialysis", url: "https://www.ncbi.nlm.nih.gov/books/NBK563296/", note: "Supports diffusion, convection, ultrafiltration, intermittent and continuous modalities, prescription concepts, anticoagulation, and treatment complications; exact prescriptions require nephrology oversight." },
    { id: "w33a-dds-ncbi", label: "NCBI Bookshelf, Dialysis Disequilibrium Syndrome", url: "https://www.ncbi.nlm.nih.gov/books/NBK559018/", note: "Supports recognition of neurologic deterioration caused by rapid osmotic change during initial or aggressive dialysis and the need for slower, individualized solute removal." },
    { id: "w33a-acidbase-ncbi", label: "NCBI Bookshelf, Physiology of Acid-Base Balance", url: "https://www.ncbi.nlm.nih.gov/books/NBK507807/", note: "Supports respiratory and renal acid-base regulation, compensation, and mixed-disorder recognition; formulas estimate expected response but never prove a single diagnosis." },
    { id: "w33a-abg-ncbi", label: "NCBI Bookshelf, Arterial Blood Gas", url: "https://www.ncbi.nlm.nih.gov/books/NBK536919/", note: "Supports systematic sampling, pH, PaCO2, bicarbonate, oxygenation, compensation, and anion-gap interpretation while emphasizing laboratory and clinical context." },
    { id: "w33a-metabolic-alkalosis-ncbi", label: "NCBI Bookshelf, Physiology of Metabolic Alkalosis", url: "https://www.ncbi.nlm.nih.gov/books/NBK482291/", note: "Supports generation and maintenance of metabolic alkalosis through chloride loss, volume contraction, potassium depletion, reduced GFR, and mineralocorticoid effects; treatment depends on cause and volume status." },
    { id: "w33a-rta-review", label: "PMC, 2026 Approach to Renal Tubular Acidosis", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13035296/", note: "Supports differentiation of distal, proximal, and type 4 RTA using potassium, urine pH, ammonium surrogates, and clinical context; it is a review, so definitive testing and treatment remain individualized." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const cards = [
    card("Alveolar-capillary membrane", ["w33a-ards-global", "w33a-ards-gas"], [
      "Assess oxygen saturation, respiratory effort, auscultation, imaging, hemoglobin, and the suspected membrane insult because edema, inflammation, hemorrhage, or fibrosis increases diffusion distance and impairs oxygen transfer.",
      "Trend oxygen requirement, PaO2, PaO2/FiO2 ratio, respiratory rate, mental status, and work of breathing because worsening membrane injury can progress from compensated hypoxemia to respiratory failure.",
      "Position upright when appropriate, provide prescribed oxygen, and coordinate lung-protective support because improving alveolar recruitment helps expose perfused capillaries without correcting the underlying barrier injury alone.",
      "Manage fluid balance and the precipitating infection, aspiration, shock, or inflammatory process with the team because excess hydrostatic fluid and permeability edema can compound alveolar flooding.",
      "Escalate immediately for SpO2 below the ordered target despite increasing oxygen, new cyanosis, exhaustion, confusion, or hemodynamic instability because refractory gas-transfer failure may require advanced respiratory support."
    ], [
      "Rapidly increasing oxygen requirement or falling PaO2/FiO2 ratio",
      "Cyanosis, confusion, agitation, or decreasing level of consciousness",
      "Severe accessory-muscle use, silent chest, or respiratory exhaustion",
      "Pink frothy secretions, diffuse crackles, or new bilateral opacities"
    ], [
      "Explain that oxygen must cross both an air-filled alveolus and a very thin membrane, so fluid or inflammation can lower blood oxygen even when air still enters.",
      "Teach patients to seek urgent help for blue lips, new confusion, severe breathlessness, or rapidly rising oxygen needs because these findings suggest failing gas exchange."
    ]),
    card("Atypical pneumonia", ["w33a-cap-idsa"], [
      "Assess symptom duration, exposures, travel, medications, comorbidity, oxygenation, mental status, hydration, and extrapulmonary findings because Mycoplasma, Chlamydia pneumoniae, and Legionella can present differently yet still cause severe pneumonia.",
      "Trend temperature, respiratory rate, SpO2, work of breathing, blood pressure, sodium, renal function, and treatment response because deterioration, Legionella-associated abnormalities, or sepsis may appear despite an initially mild presentation.",
      "Obtain ordered respiratory specimens and cultures before antibiotics when this does not delay urgent therapy because identifying an organism can narrow treatment and reveal outbreaks or resistant alternative diagnoses.",
      "Administer guideline- and protocol-based antibiotics on schedule while checking QT risk, interactions, renal function, and allergies because atypical organisms lack usual beta-lactam targets or require intracellularly active therapy.",
      "Escalate immediately for SpO2 below target, respiratory rate above thirty, hypotension, new confusion, oliguria, or rapidly spreading infiltrates because severe community-acquired pneumonia requires higher-level support and sepsis evaluation."
    ], [
      "SpO2 below target or rapidly increasing supplemental-oxygen requirement",
      "Respiratory rate above thirty with fatigue or accessory-muscle use",
      "Hypotension, rising lactate, oliguria, or new altered mental status",
      "Hyponatremia with diarrhea, confusion, or severe systemic illness"
    ], [
      "Explain that walking pneumonia can still become serious, so activity tolerance and oxygenation matter more than whether symptoms began gradually.",
      "Teach patients to finish the prescribed regimen and report palpitations, fainting, severe diarrhea, worsening breathlessness, or confusion because both disease and treatment can cause urgent complications."
    ]),
    card("Barotrauma", ["w33a-ards-ats", "w33a-ards-global"], [
      "Assess ventilator pressures, tidal volume by predicted body weight, breath sounds, chest movement, oxygenation, and synchrony because excessive regional pressure can rupture vulnerable alveoli and leak air.",
      "Trend plateau pressure, driving pressure, peak-pressure changes, subcutaneous crepitus, SpO2, blood pressure, and ventilator alarms because pneumothorax or air trapping can evolve abruptly during positive-pressure ventilation.",
      "Maintain prescribed lung-protective settings and promptly correct biting, coughing, dyssynchrony, tubing obstruction, or secretion burden because preventable pressure spikes increase ventilator-induced lung injury.",
      "Prepare for immediate imaging and pleural decompression per protocol when unilateral findings emerge because a tension pneumothorax can obstruct venous return and cause cardiovascular collapse.",
      "Activate the emergency response for sudden hypoxemia, hypotension, unilateral absent breath sounds, tracheal deviation, or rapidly rising pressures because these findings suggest life-threatening tension physiology."
    ], [
      "Sudden unilateral absent breath sounds with acute oxygen desaturation",
      "Hypotension, jugular venous distention, or pulseless electrical activity",
      "Rapidly rising airway pressures with new subcutaneous crepitus",
      "Tracheal deviation, asymmetric chest rise, or severe ventilator dyssynchrony"
    ], [
      "Explain to families that pressure supports breathing but can injure fragile lung regions, so clinicians continually balance oxygenation against the lowest effective stress.",
      "Teach spontaneously breathing patients to report sudden one-sided chest pain or abrupt breathlessness because pneumothorax requires immediate assessment."
    ]),
    card("Capillary permeability", ["w33a-fluid-ncbi", "w33a-ards-global"], [
      "Assess edema distribution, lung sounds, oxygenation, skin, urine output, albumin, inflammatory triggers, and recent fluids because a leaky endothelial barrier moves protein and water into tissues despite uncertain total-body volume.",
      "Trend weight, intake and output, perfusion, lactate, creatinine, oxygen needs, and compartment-specific swelling because intravascular depletion can coexist with pulmonary or peripheral edema.",
      "Use ordered fluids, vasopressors, diuretics, and albumin only within the cause-specific plan because permeability edema does not respond safely to a single universal volume strategy.",
      "Protect edematous skin, elevate limbs when appropriate, reposition frequently, and assess pressure points because protein-rich interstitial fluid impairs tissue oxygenation and increases breakdown risk.",
      "Escalate immediately for rapidly increasing oxygen need, stridor, hypotension, oliguria, tense swelling, or severe abdominal pressure because lung, airway, or compartment edema can become life-threatening."
    ], [
      "Rapid oxygen deterioration with diffuse crackles or bilateral opacities",
      "Stridor, facial swelling, tongue swelling, or difficulty handling secretions",
      "Hypotension with cool extremities, oliguria, or rising lactate",
      "Tense limb or abdominal swelling with severe pain or organ dysfunction"
    ], [
      "Explain that swelling does not always mean blood vessels contain too much fluid because inflammation can move fluid from circulation into tissues.",
      "Teach patients not to change fluid or diuretic doses independently because treating visible edema without checking perfusion can worsen kidney and organ blood flow."
    ]),
    card("Capillary refill", ["w33a-sepsis-sccm-2026"], [
      "Measure refill at a standardized warm site with consistent pressure and duration because cold temperature, lighting, skin characteristics, and technique can distort this bedside perfusion sign.",
      "Trend refill with mental status, skin temperature, pulse quality, urine output, blood pressure, lactate, and oxygenation because no single peripheral sign establishes adequate organ perfusion.",
      "Reassess capillary refill after fluids, vasopressors, warming, pain control, or position changes because a directional response helps evaluate whether tissue perfusion is improving.",
      "Compare central and peripheral findings and document site, time, and conditions because reproducible trends are more clinically useful than an unlabeled normal or delayed entry.",
      "Escalate immediately for persistently delayed refill with hypotension, mottling, confusion, oliguria, weak pulses, or rising lactate because this cluster suggests shock and threatened organ perfusion."
    ], [
      "Delayed refill with hypotension or a narrowing pulse pressure",
      "Mottled cool skin extending centrally despite active resuscitation",
      "New confusion, oliguria, weak pulses, or rapidly rising lactate",
      "Unequal limb refill with pallor, pain, paresthesia, or absent pulse"
    ], [
      "Explain that capillary refill is one quick clue about peripheral blood flow, but clinicians combine it with urine, mentation, pulses, and laboratory trends.",
      "Teach patients to report a suddenly cold, pale, painful, or numb limb because one-sided perfusion loss may indicate acute arterial obstruction."
    ]),
    card("Cardiac output", ["w33a-sepsis-sccm-2026"], [
      "Assess heart rate, rhythm, blood pressure, pulse pressure, mental status, skin temperature, urine output, and oxygen delivery because cardiac output equals heart rate multiplied by stroke volume but adequacy depends on tissue demand.",
      "Trend dynamic fluid responsiveness, lactate context, venous oxygen data when ordered, perfusion, and congestion because low output and maldistributed flow can coexist with a seemingly acceptable blood pressure.",
      "Review preload, contractility, afterload, rhythm, ventilation pressures, and medication effects before intervention because correcting the wrong determinant can worsen pulmonary edema or tissue hypoperfusion.",
      "Administer prescribed fluids, vasoactive agents, diuretics, oxygen, or mechanical support with frequent reassessment because output-directed therapy must balance forward flow against congestion and ischemia.",
      "Activate urgent evaluation for hypotension with altered mentation, chest pain, cool mottled skin, oliguria, rising lactate, or pulmonary edema because cardiogenic or mixed shock requires immediate targeted support."
    ], [
      "Mean arterial pressure below target with new organ dysfunction",
      "Cool mottled extremities, weak pulses, confusion, or falling urine output",
      "Chest pain, malignant dysrhythmia, or new ischemic electrocardiogram change",
      "Pulmonary edema with hypotension or rapidly worsening oxygenation"
    ], [
      "Explain that cardiac output describes blood pumped each minute, while blood pressure alone cannot show whether enough oxygen reaches every organ.",
      "Teach patients to report fainting, new chest pressure, severe breathlessness, palpitations, or rapidly reduced urine because these can signal inadequate forward flow."
    ]),
    card("Chronic kidney disease-mineral and bone disorder", ["w33a-ckd-mbd-kdigo", "w33a-ckd-kdigo-2024"], [
      "Assess CKD stage, fracture history, bone pain, weakness, pruritus, diet, medications, dialysis adherence, and vascular disease because phosphate retention and altered vitamin D, calcium, and PTH affect bone and vessels together.",
      "Trend calcium, phosphate, PTH, alkaline phosphatase, vitamin D, bicarbonate, and imaging when ordered because serial direction across related markers is safer than treating one isolated number.",
      "Administer phosphate binders with the prescribed meals and vitamin-D, calcimimetic, or other therapy exactly as ordered because timing and CKD stage determine benefit and risks such as hypo- or hypercalcemia.",
      "Coordinate renal nutrition and fall prevention while preserving safe weight-bearing activity because phosphate control, adequate nutrition, muscle strength, and fracture prevention require a balanced plan.",
      "Escalate urgently for symptomatic severe calcium abnormality, pathologic fracture, calciphylaxis-like painful skin lesions, seizure, or malignant dysrhythmia because CKD-MBD complications can threaten life and tissue viability."
    ], [
      "Painful violaceous skin lesion, necrosis, or suspected calciphylaxis",
      "Seizure, tetany, laryngospasm, or prolonged-QT dysrhythmia",
      "Confusion, vomiting, severe weakness, or shortened-QT dysrhythmia",
      "Sudden focal bone pain, deformity, or inability to bear weight"
    ], [
      "Explain that phosphate, calcium, vitamin D, and parathyroid hormone interact, so taking extra calcium or vitamin D without review can be harmful.",
      "Teach patients to take binders with the instructed meals and bring medication and diet lists because missed timing leaves dietary phosphate available for absorption."
    ]),
    card("CKD GFR and albuminuria risk classification", ["w33a-ckd-kdigo-2024"], [
      "Verify chronicity, cause, eGFR category, urine albumin-creatinine category, blood pressure, diabetes status, and prior trends because CKD risk classification combines cause, G stage, and A stage rather than creatinine alone.",
      "Trend eGFR and albuminuria at a frequency matched to risk while checking potassium, bicarbonate, hemoglobin, and medication tolerance because faster change or higher albuminuria predicts complications and kidney failure.",
      "Use properly collected urine albumin-creatinine measurements and repeat unexpected abnormalities because exercise, fever, menstruation, infection, and acute illness can cause transient albuminuria.",
      "Coordinate kidney-protective blood-pressure, diabetes, cardiovascular, and medication plans because albuminuria signals glomerular injury and systemic vascular risk even when eGFR remains preserved.",
      "Escalate nephrology evaluation for abrupt eGFR decline, rapidly rising albuminuria, refractory hypertension, persistent potassium disturbance, or uremic symptoms because these findings exceed routine stable-CKD monitoring."
    ], [
      "Abrupt eGFR decline or creatinine rise inconsistent with prior trajectory",
      "Rapidly increasing albuminuria, nephrotic-range protein loss, or active sediment",
      "Refractory hypertension with headache, neurologic change, or pulmonary edema",
      "Persistent hyperkalemia, severe acidosis, pericarditic pain, or uremic confusion"
    ], [
      "Explain that GFR estimates filtration while albuminuria measures kidney-barrier injury, so two people with the same eGFR may have different risk.",
      "Teach patients to keep scheduled blood and urine testing because CKD often progresses silently before swelling, nausea, itching, or fatigue becomes obvious."
    ]),
    card("Continuous kidney replacement therapy", ["w33a-aki-kdigo", "w33a-hemodialysis-ncbi"], [
      "Verify modality, prescribed dose, blood and replacement-fluid rates, net fluid goal, access, anticoagulation, and solution composition because small setup errors accumulate continuously across many hours.",
      "Trend hourly fluid balance, circuit pressures, filter life, temperature, hemodynamics, electrolytes, glucose, phosphate, magnesium, ionized calcium, and acid-base status because CKRT can quietly remove heat, solute, nutrients, and medications.",
      "Use strict aseptic access care and trace every line from patient to machine before connection or repositioning because catheter infection, disconnection, air entry, or blood loss can be catastrophic.",
      "Coordinate antimicrobial, anticonvulsant, nutrition, and other dose adjustments with pharmacy and nephrology because continuous clearance and interruptions change drug exposure unpredictably.",
      "Stop or escalate per protocol for air detection, major blood leak, access disconnection, refractory hypotension, severe citrate-related calcium disturbance, or uncontrolled electrolyte change because continued therapy may worsen immediate instability."
    ], [
      "Air alarm, visible circuit air, line disconnection, or major blood leak",
      "Refractory hypotension or escalating vasopressor requirement during therapy",
      "Falling ionized calcium with rising total-to-ionized calcium relationship",
      "Dangerous potassium, phosphate, glucose, temperature, or acid-base shift"
    ], [
      "Explain that continuous therapy removes fluid and wastes slowly for unstable patients, but it still requires uninterrupted monitoring and may pause for alarms or procedures.",
      "Teach families not to touch access or machine lines because a loosened continuous blood circuit can cause infection, air entry, or rapid blood loss."
    ]),
    card("Countercurrent multiplication and urine concentration", ["w33a-renal-phys-ncbi"], [
      "Assess volume status, thirst, urine volume, urine osmolality, serum sodium, kidney function, and relevant medications because concentrating urine requires an intact medullary gradient, tubular flow, and ADH response.",
      "Trend paired serum and urine osmolality, sodium, intake, output, weight, and neurologic status because water-balance disorders become dangerous through changing plasma tonicity rather than urine concentration alone.",
      "Preserve accurately timed urine specimens and document fluids, diuretics, and desmopressin because these exposures alter the countercurrent system and determine whether results are interpretable.",
      "Implement prescribed free-water, saline, or fluid-restriction plans with frequent sodium reassessment because correcting water imbalance too rapidly can cause cerebral edema or osmotic demyelination.",
      "Escalate immediately for seizure, severe confusion, rapidly changing sodium, profound polyuria with hypotension, or oliguria with overload because failed concentration or dilution can become a neurologic emergency."
    ], [
      "Seizure, coma, severe confusion, or rapidly changing serum sodium",
      "Profound polyuria with hypotension, tachycardia, or acute weight loss",
      "Oliguria with pulmonary edema, hypertension, or worsening kidney function",
      "Sodium correction proceeding faster than the prescribed safety limit"
    ], [
      "Explain that the loop of Henle builds a salty medullary gradient and ADH opens collecting-duct water pathways, allowing urine concentration when water must be conserved.",
      "Teach patients to follow the exact fluid plan rather than forcing water because both excess and deficiency can dangerously change sodium concentration."
    ]),
    card("Dead space ventilation", ["w33a-ards-gas", "w33a-ards-global"], [
      "Assess respiratory rate, tidal volume, minute ventilation, PaCO2, end-tidal CO2, perfusion, and thromboembolic risk because dead space rises when ventilated alveoli receive too little effective blood flow.",
      "Trend the PaCO2-to-end-tidal-CO2 gap, ventilatory ratio when used, hemodynamics, and equipment function because worsening wasted ventilation may reflect pulmonary vascular obstruction, shock, overdistention, or circuit failure.",
      "Check airway connections, sampling lines, secretions, tube position, and ventilator waveforms before attributing a change to physiology because leaks and measurement artifacts can mimic abnormal dead-space trends.",
      "Support prescribed lung-protective ventilation and treat shock, pulmonary embolism, or excessive alveolar pressure with the team because increasing minute ventilation alone may intensify lung injury without restoring perfusion.",
      "Escalate immediately for a sudden end-tidal CO2 fall with hypotension, new hypoxemia, chest pain, syncope, or rapidly rising PaCO2 because massive embolism or circulatory collapse may be occurring."
    ], [
      "Sudden end-tidal CO2 decrease with hypotension or loss of pulse",
      "Abrupt hypoxemia, pleuritic chest pain, syncope, or unilateral leg swelling",
      "Rapidly rising PaCO2 despite increasing effective minute ventilation",
      "Severe ventilator dyssynchrony, high pressures, or new circuit disconnection"
    ], [
      "Explain that dead space means some breaths reach air sacs without enough blood flow, so ventilation can look adequate while carbon dioxide removal remains inefficient.",
      "Teach patients to report sudden chest pain, fainting, severe breathlessness, or coughing blood because pulmonary embolism can sharply increase dead-space ventilation."
    ]),
    card("Diabetic nephropathy", ["w33a-diabetes-ckd-kdigo", "w33a-diabetic-kidney-niddk", "w33a-ckd-kdigo-2024"], [
      "Assess diabetes duration, glycemic pattern, blood pressure, cardiovascular risk, medication use, eGFR, urine albumin-creatinine ratio, and foot or eye disease because diabetic kidney injury often accompanies systemic microvascular and cardiovascular damage.",
      "Trend eGFR, albuminuria, potassium, blood pressure, glucose metrics, volume status, and medication tolerance because falling filtration and rising albumin loss alter drug safety and predict kidney and cardiovascular events.",
      "Administer kidney-protective and glucose-lowering therapy as prescribed while following sick-day and hold instructions because benefits depend on continued safe use without dehydration, ketoacidosis, hyperkalemia, or acute kidney injury.",
      "Coordinate nutrition, smoking cessation, foot care, retinal care, and cardiovascular prevention because slowing nephropathy requires integrated risk reduction rather than glucose control alone.",
      "Escalate urgently for abrupt creatinine rise, persistent severe hyperkalemia, nephrotic edema, hypertensive emergency, oliguria, or uremic symptoms because these findings suggest acute complication or advanced kidney failure."
    ], [
      "Abrupt eGFR decline, oliguria, or rapidly increasing creatinine",
      "Severe hyperkalemia with weakness, conduction change, or dysrhythmia",
      "Pulmonary edema, hypertensive emergency, or rapidly worsening anasarca",
      "Nausea, pericarditic pain, confusion, bleeding, or other uremic findings"
    ], [
      "Explain that urine albumin may reveal glomerular injury before filtration falls, so both urine and blood tests are needed even when the patient feels well.",
      "Teach patients to review over-the-counter pain medicines and sick-day medication plans because dehydration and nephrotoxins can accelerate otherwise preventable kidney injury."
    ]),
    card("Driving pressure", ["w33a-ards-ats"], [
      "Verify an accurate plateau pressure during passive conditions and subtract total PEEP because driving pressure estimates the pressure applied to the respiratory system for each delivered tidal volume.",
      "Trend plateau pressure, PEEP, tidal volume by predicted body weight, compliance, blood pressure, and synchrony because a rising driving pressure can signal less aerated lung or harmful ventilatory stress.",
      "Correct coughing, breath stacking, secretions, tubing problems, and measurement timing before acting on the value because spontaneous effort and artifacts make plateau-derived calculations unreliable.",
      "Collaborate on lung-protective tidal volume, PEEP, proning, and sedation strategies rather than chasing one universal number because outcome evidence supports limiting global stress within the complete clinical picture.",
      "Escalate promptly for rising driving pressure with refractory hypoxemia, plateau pressure above the ordered limit, hypotension, unilateral breath-sound loss, or new crepitus because overdistention or pneumothorax may be developing."
    ], [
      "Plateau pressure above the prescribed limit despite corrective measures",
      "Rising driving pressure with worsening oxygenation or declining compliance",
      "Sudden hypotension, unilateral absent breath sounds, or subcutaneous crepitus",
      "Breath stacking or severe dyssynchrony causing repeated excessive tidal volumes"
    ], [
      "Explain that driving pressure reflects how much pressure is needed to deliver a breath above PEEP, helping clinicians recognize increasing lung stiffness and stress.",
      "Teach families that clinicians adjust several ventilator variables together because lowering one displayed pressure without preserving ventilation and recruitment may not improve safety."
    ]),
    card("Effective circulating volume", ["w33a-sepsis-sccm-2026", "w33a-fluid-ncbi"], [
      "Assess blood pressure, orthostasis, jugular veins, edema, lung sounds, skin perfusion, mentation, urine output, and recent losses because effective arterial filling can be low despite normal or increased total-body fluid.",
      "Trend weight, intake and output, creatinine, sodium, lactate context, capillary refill, and dynamic fluid responsiveness because static examination or one laboratory value cannot define usable circulating volume.",
      "Distinguish hemorrhage, vasodilation, heart failure, cirrhosis, nephrotic loss, and third spacing with the team because each mechanism requires a different balance of fluids, vasoactive therapy, diuresis, or source control.",
      "Give ordered volume or fluid removal in measured steps with immediate perfusion and congestion reassessment because both underfilling and overfilling can worsen kidney, lung, and cardiac function.",
      "Escalate immediately for hypotension with confusion, oliguria, cool mottling, rising lactate, active bleeding, or pulmonary edema because effective-volume failure may represent shock even when edema is visible."
    ], [
      "Hypotension with altered mentation, cool mottling, or falling urine output",
      "Active hemorrhage, rapidly falling hemoglobin, or expanding abdominal distention",
      "Pulmonary edema with severe hypoxemia during attempted volume replacement",
      "Rising lactate or worsening kidney injury despite initial resuscitation"
    ], [
      "Explain that fluid can accumulate in legs or the abdomen while too little remains in the arterial circulation to perfuse organs effectively.",
      "Teach patients not to self-adjust diuretics, salt, or fluid targets because the correct plan depends on both congestion and organ perfusion."
    ]),
    card("Expected acid-base compensation", ["w33a-acidbase-ncbi", "w33a-abg-ncbi"], [
      "Assess pH direction, anion gap context, the primary PaCO2 or bicarbonate disturbance, and the disorder-specific expected response because compensation follows predictable ranges but does not restore every value to normal.",
      "Trend blood gases, electrolytes, anion gap, albumin, ventilation, renal function, and clinical status because a value outside the expected range suggests a second acid-base process or changing physiology.",
      "Verify specimen type, timing, oxygen and ventilation settings, and possible air or delay error because preanalytic problems can create false discrepancies that resemble mixed disorders.",
      "Coordinate treatment of the underlying ventilatory, metabolic, renal, toxicologic, or gastrointestinal cause rather than normalizing numbers alone because compensation is an adaptive response, not the disease itself.",
      "Escalate immediately for pH below 7.20 or above 7.60, worsening hypercapnia with somnolence, severe potassium abnormality, shock, or seizure because extreme acidemia or alkalemia destabilizes cardiac and neurologic function."
    ], [
      "pH below 7.20 or above 7.60 with clinical deterioration",
      "Rising PaCO2 with somnolence, weak respirations, or impending exhaustion",
      "Severe potassium abnormality with electrocardiogram change or dysrhythmia",
      "Compensation outside the expected range with shock, toxin exposure, or sepsis"
    ], [
      "Explain that lungs and kidneys partially compensate for each other, but compensation never proves the cause and should not be mistaken for recovery.",
      "Teach patients with chronic ventilatory or kidney disease to seek help for new confusion, profound weakness, vomiting, or breathing change because a second disorder can overwhelm compensation."
    ]),
    card("Glomerular filtration barrier and proteinuria", ["w33a-renal-flow-ncbi", "w33a-ckd-kdigo-2024"], [
      "Assess edema, blood pressure, urine appearance, diabetes, autoimmune symptoms, infection, medications, and family history because endothelial, basement-membrane, or podocyte injury permits proteins to cross the glomerular barrier.",
      "Trend urine albumin or protein quantification, eGFR, creatinine, serum albumin, lipids, weight, and urine sediment because protein leakage can progress while filtration initially appears preserved.",
      "Obtain a clean urine specimen and repeat unexpected proteinuria outside fever, heavy exercise, infection, or menstruation because transient protein loss should not be mislabeled as chronic glomerular disease.",
      "Administer prescribed blood-pressure and kidney-protective therapy while monitoring potassium and kidney function because lowering intraglomerular stress can reduce albumin leakage but may change creatinine initially.",
      "Escalate nephrology evaluation for rapidly rising proteinuria, nephrotic edema, active sediment, abrupt eGFR loss, pulmonary edema, or suspected rapidly progressive glomerulonephritis because irreversible filtration loss can advance quickly."
    ], [
      "Rapidly rising proteinuria with hematuria or red-cell casts",
      "Anasarca, pulmonary edema, or severe hypoalbuminemia with thrombosis symptoms",
      "Abrupt eGFR decline, oliguria, or rapidly increasing creatinine",
      "Severe hypertension with headache, visual change, seizure, or encephalopathy"
    ], [
      "Explain that the glomerular barrier normally retains albumin by size and charge, so persistent urine protein is a marker of barrier injury rather than merely concentrated urine.",
      "Teach patients to complete repeat urine testing and report foamy urine, swelling, reduced urine, or clot symptoms because severity cannot be judged by appearance alone."
    ]),
    card("Hemodialysis disequilibrium syndrome", ["w33a-dds-ncbi", "w33a-hemodialysis-ncbi"], [
      "Identify first-dialysis status, severe azotemia, extremes of age, hyperosmolality, neurologic disease, and aggressive clearance plans because rapid plasma urea reduction can create cerebral osmotic swelling.",
      "Perform baseline and frequent neurologic checks while trending headache, nausea, restlessness, blood pressure, sodium, glucose, urea reduction, and seizure activity because early symptoms may precede cerebral edema.",
      "Use the prescribed low-efficiency initial treatment and avoid unapproved flow or duration changes because slower solute removal allows brain and plasma osmolality to equilibrate more safely.",
      "Stop dialysis and notify nephrology immediately for progressive neurologic findings while protecting airway and seizure safety because continued rapid clearance can intensify intracranial pressure.",
      "Activate emergency evaluation for seizure, rapidly declining consciousness, focal deficit, severe agitation, or signs of herniation because dialysis disequilibrium is a diagnosis of exclusion with life-threatening mimics."
    ], [
      "New seizure during or shortly after initial hemodialysis",
      "Rapidly declining consciousness, severe agitation, or repeated vomiting",
      "Focal neurologic deficit, unequal pupils, or abnormal posturing",
      "Severe headache with hypertension, bradycardia, or respiratory irregularity"
    ], [
      "Explain that early dialysis may intentionally remove wastes more slowly because rapid urea change can draw water into brain cells.",
      "Teach patients and families to report headache, nausea, confusion, twitching, or unusual restlessness immediately during or after dialysis rather than waiting for symptoms to pass."
    ]),
    card("Hemodialysis vascular access: fistula, graft, and catheter", ["w33a-access-kdoqi", "w33a-hemodialysis-niddk", "w33a-dialysis-cdc"], [
      "Identify the access type, ESKD life plan, maturity, prior interventions, baseline thrill and bruit, and limb circulation because fistulas, grafts, and catheters have different readiness, infection, and thrombosis risks.",
      "Inspect and palpate the access before every use for thrill, bruit, redness, drainage, swelling, bleeding, aneurysmal change, distal warmth, sensation, and pulse because early dysfunction threatens dialysis adequacy and limb safety.",
      "Use strict hand hygiene, skin antisepsis, catheter-hub technique, and facility cannulation protocols because repeated bloodstream access creates a direct pathway for serious infection.",
      "Avoid blood pressure cuffs, venipuncture, constrictive clothing, and unapproved compression on the access limb because trauma or prolonged pressure can reduce flow and precipitate thrombosis.",
      "Escalate immediately for absent thrill, uncontrolled bleeding, fever with access findings, hand ischemia, rapidly expanding swelling, or catheter air exposure because access loss, sepsis, hemorrhage, or embolism may result."
    ], [
      "Absent or markedly changed thrill or bruit before dialysis",
      "Fever, rigors, purulent drainage, or spreading access-site erythema",
      "Uncontrolled post-dialysis bleeding or rapidly expanding hematoma",
      "Cold painful hand, numbness, weakness, pallor, or reduced distal pulse"
    ], [
      "Teach patients to check their thrill every day and contact the dialysis team immediately if it disappears or changes substantially.",
      "Explain that catheters carry the highest bloodstream-infection risk, so dressings must stay clean and dry and hubs should only be handled using trained aseptic technique."
    ]),
    card("Hemodialysis: diffusion, convection, ultrafiltration, and prescription", ["w33a-hemodialysis-ncbi", "w33a-hemodialysis-niddk"], [
      "Verify dialyzer, bath composition, blood and dialysate flows, treatment time, ultrafiltration goal, anticoagulation, and ordered weight because each prescription element changes solute or fluid removal.",
      "Trend pre-, intra-, and post-treatment blood pressure, weight, symptoms, access pressures, circuit status, potassium, bicarbonate, urea metrics, and volume findings because adequate clearance can coexist with unsafe fluid removal.",
      "Distinguish diffusion of small solutes, convection with solvent drag, and pressure-driven ultrafiltration because troubleshooting depends on whether the problem is concentration, membrane flow, or water removal.",
      "Administer medications and meals at dialysis-appropriate times while checking dialyzability because the circuit can remove therapeutic drugs and intradialytic intake can worsen hypotension or treatment tolerance.",
      "Stop or escalate per protocol for chest pain, severe hypotension, air or blood-leak alarm, hemolysis signs, seizure, or access hemorrhage because dialysis complications can progress within minutes."
    ], [
      "Air detector or blood-leak alarm with suspected patient exposure",
      "Chest pain, malignant dysrhythmia, severe hypotension, or loss of consciousness",
      "Sudden back pain, dyspnea, dark blood, hyperkalemia, or suspected hemolysis",
      "Access disconnection, uncontrolled bleeding, or rapidly expanding hematoma"
    ], [
      "Explain that dialysis removes small wastes mainly by diffusion and excess water by ultrafiltration, while convection carries solutes with moving water.",
      "Teach patients to complete the prescribed treatment time because shortening sessions reduces clearance and often forces faster, less tolerable fluid removal later."
    ]),
    card("Hydrostatic pressure", ["w33a-fluid-ncbi"], [
      "Assess blood pressure, venous congestion, edema distribution, lung sounds, ascites, limb symmetry, albumin, and cardiac or renal disease because increased capillary hydrostatic pressure pushes fluid into interstitial spaces.",
      "Trend weight, intake and output, jugular venous findings, oxygen need, renal function, and response to position or diuresis because pressure-driven edema changes with congestion and effective perfusion.",
      "Differentiate elevated venous pressure from low oncotic pressure, permeability injury, lymphatic obstruction, or thrombosis because visually similar swelling requires different treatment.",
      "Provide prescribed sodium and fluid management, diuresis, elevation, compression when appropriate, and mobility because lowering venous pressure can improve edema without ignoring the underlying organ disorder.",
      "Escalate immediately for acute pulmonary edema, unilateral painful swelling with embolic symptoms, tense compartment findings, or hypotension during fluid removal because hydrostatic complications can impair gas exchange, perfusion, or limb viability."
    ], [
      "Pink frothy sputum, diffuse crackles, or rapidly worsening hypoxemia",
      "Unilateral painful swelling with chest pain, tachycardia, or sudden dyspnea",
      "Tense painful limb with paresthesia, weakness, or reduced pulse",
      "Hypotension, oliguria, or confusion during aggressive fluid removal"
    ], [
      "Explain that hydrostatic pressure is the outward push of fluid, so heart or venous congestion can cause edema even when blood protein is normal.",
      "Teach patients to track daily weight and report rapid gain, new orthopnea, one-sided swelling, or reduced urine because these changes can precede severe congestion."
    ]),
    card("Hypoxia", ["w33a-ards-gas", "w33a-sepsis-sccm-2026"], [
      "Assess airway, breathing, circulation, SpO2 waveform, respiratory effort, mental status, skin, perfusion, hemoglobin, and exposure history because tissue hypoxia can result from hypoxemia, anemia, low flow, dyshemoglobinemia, or impaired cellular use.",
      "Trend oxygenation, blood gases when indicated, lactate context, hemoglobin, cardiac rhythm, blood pressure, urine output, and neurologic status because organ injury depends on duration, severity, and oxygen delivery rather than saturation alone.",
      "Verify probe position and perfusion and obtain co-oximetry when carbon monoxide or methemoglobinemia is possible because standard pulse oximetry can look reassuring while effective oxygen carriage is dangerously impaired.",
      "Provide prescribed oxygen and simultaneously correct ventilation, perfusion, hemoglobin, toxin, or airway causes because raising inspired oxygen cannot reverse every mechanism of tissue oxygen failure.",
      "Activate emergency support for severe breathlessness, cyanosis, new confusion, seizure, chest ischemia, shock, or SpO2 below target despite escalating oxygen because sustained hypoxia rapidly injures brain and heart."
    ], [
      "SpO2 below target despite escalating supplemental oxygen",
      "New confusion, seizure, coma, or focal neurologic deterioration",
      "Chest pain, ischemic electrocardiogram change, or malignant dysrhythmia",
      "Cyanosis, severe respiratory exhaustion, hypotension, or rising lactate"
    ], [
      "Explain that hypoxemia means low oxygen in arterial blood, while hypoxia means tissues receive or use too little oxygen and may occur for several reasons.",
      "Teach patients to seek emergency care for blue lips, severe breathlessness, fainting, chest pain, or new confusion rather than relying only on a home oximeter."
    ]),
    card("Intrinsic AKI", ["w33a-aki-kdigo", "w33a-renal-flow-ncbi"], [
      "Assess nephrotoxins, ischemia, sepsis, rash, infection, autoimmune symptoms, hemolysis, muscle injury, urine findings, and recent procedures because intrinsic AKI may arise from tubular, glomerular, interstitial, or vascular injury.",
      "Trend creatinine, urine output, potassium, bicarbonate, phosphate, fluid balance, urine sediment, blood pressure, and medication exposure because complications can evolve before creatinine reaches its peak.",
      "Stop or avoid nephrotoxins as ordered and adjust renally cleared medications with pharmacy because injured nephrons cannot eliminate drugs normally and additional exposure can prolong damage.",
      "Obtain cause-directed blood, urine, imaging, and biopsy preparation when ordered because granular casts, protein and blood, eosinophilic features, or vascular clues lead to different time-sensitive treatments.",
      "Escalate urgently for refractory hyperkalemia, severe acidosis, pulmonary edema, anuria, uremic encephalopathy, pericarditic pain, or active glomerular sediment because kidney replacement or immunologic treatment may be immediately necessary."
    ], [
      "Hyperkalemia with electrocardiogram change, weakness, or dysrhythmia",
      "Pulmonary edema with rising oxygen requirement or respiratory distress",
      "Anuria, rapidly rising creatinine, or severe persistent metabolic acidosis",
      "Confusion, seizure, pericarditic pain, bleeding, or active nephritic sediment"
    ], [
      "Explain that intrinsic AKI means injury within kidney tissue, so treatment depends on whether tubules, glomeruli, interstitium, or vessels are affected.",
      "Teach patients to avoid unreviewed NSAIDs and supplements and to report reduced urine, swelling, rash, dark urine, or severe weakness promptly."
    ]),
    card("Kidney functions and integrated renal physiology", ["w33a-renal-phys-ncbi", "w33a-ckd-kdigo-2024"], [
      "Assess filtration, urine volume, fluid status, electrolytes, acid-base balance, blood pressure, hemoglobin, and bone-mineral markers because kidneys coordinate excretion, homeostasis, and endocrine signaling rather than merely producing urine.",
      "Trend creatinine and eGFR with potassium, bicarbonate, sodium, phosphate, calcium, hemoglobin, weight, blood pressure, and symptoms because one filtration marker cannot reveal every lost renal function.",
      "Review medication clearance, nephrotoxins, contrast exposure, and over-the-counter products at every transition because reduced filtration and tubular secretion can turn ordinary doses into toxic exposures.",
      "Coordinate individualized nutrition, fluid, blood-pressure, anemia, acid-base, and bone-mineral plans because correcting one renal consequence without considering the others can create competing harm.",
      "Escalate urgently for hyperkalemic conduction change, severe acidosis, pulmonary edema, uremic confusion, pericarditic pain, anuria, or hypertensive emergency because these indicate failed homeostasis requiring immediate treatment."
    ], [
      "Hyperkalemia with electrocardiogram change or malignant dysrhythmia",
      "Pulmonary edema, anuria, or severe uncontrolled hypertension",
      "Severe acidosis with shock, respiratory fatigue, or declining consciousness",
      "Uremic encephalopathy, pericarditis, uncontrolled bleeding, or intractable symptoms"
    ], [
      "Explain that kidneys regulate water, electrolytes, acid, blood pressure, red-cell signaling, and vitamin-D activation in addition to removing wastes.",
      "Teach patients to carry an updated medication list and kidney-function trend because dosing and safety can change before urine volume changes noticeably."
    ]),
    card("Lactate clearance", ["w33a-sepsis-sccm-2026"], [
      "Measure lactate using consistent timing and specimen handling while assessing perfusion, infection, seizures, liver function, medications, and adrenergic stress because elevated lactate has multiple production and clearance mechanisms.",
      "Trend lactate direction with capillary refill, mentation, urine output, blood pressure, skin temperature, and source control because a falling number alone does not prove restored organ perfusion.",
      "Document fluids, vasoactive drugs, oxygen delivery, seizures, beta-agonists, and sampling conditions between values because interventions and nonhypoxic production determine whether apparent clearance is meaningful.",
      "Use serial lactate as one resuscitation adjunct without giving unbounded fluid solely to normalize it because persistent elevation may reflect impaired hepatic clearance or stress metabolism rather than fluid responsiveness.",
      "Escalate immediately for rising lactate with hypotension, mottling, oliguria, confusion, worsening acidosis, or infection signs because this pattern suggests unresolved shock, tissue ischemia, or inadequate source control."
    ], [
      "Rising lactate with hypotension, cool mottling, or delayed capillary refill",
      "Worsening metabolic acidosis, oliguria, or altered mental status",
      "Severe abdominal or limb pain suggesting regional tissue ischemia",
      "Persistent elevation despite treatment with uncontrolled infection or liver failure"
    ], [
      "Explain that lactate trends can help assess illness severity, but exercise, seizures, medicines, liver dysfunction, and stress can also change the value.",
      "Teach families that clinicians treat the cause and overall perfusion rather than giving unlimited fluid until one laboratory number becomes normal."
    ]),
    card("PaO2/FiO2 ratio", ["w33a-ards-global", "w33a-ards-ats"], [
      "Record PaO2 from a valid arterial sample with the exact FiO2, oxygen device, PEEP or CPAP, position, and sampling time because the ratio is uninterpretable without concurrent support conditions.",
      "Trend the ratio with SpO2, work of breathing, imaging, compliance, hemodynamics, and oxygen trajectory because severity classification is only one part of acute hypoxemic respiratory assessment.",
      "Verify FiO2 estimates on low-flow devices and repeat unexpectedly discordant results because variable inspiratory flow, leaks, and sampling error can falsely change the calculated ratio.",
      "Use the ratio to communicate oxygenation severity and trigger protocol-based evaluation, not as a stand-alone command to intubate because trajectory, effort, mentation, and ventilatory failure determine support needs.",
      "Escalate immediately for a rapidly falling ratio, severe work of breathing, altered consciousness, hemodynamic instability, or hypoxemia despite optimized support because refractory respiratory failure may require proning or advanced rescue."
    ], [
      "Rapidly falling PaO2/FiO2 ratio on unchanged or increasing support",
      "Persistent severe hypoxemia despite optimized oxygen and prescribed PEEP",
      "Respiratory exhaustion, altered consciousness, or inability to protect the airway",
      "Hypotension, unilateral breath-sound loss, or sudden ventilator-pressure change"
    ], [
      "Explain that the P/F ratio compares arterial oxygen with the oxygen concentration delivered, helping distinguish adequate numbers achieved only through high support.",
      "Teach families that body position, PEEP, device fit, and timing can change the ratio, so clinicians interpret trends under documented conditions."
    ]),
    card("Peritoneal dialysis peritonitis", ["w33a-pd-ispd"], [
      "Assess abdominal pain, cloudy effluent, fever, nausea, bowel symptoms, catheter exit site, recent contamination, procedures, and exchange technique because peritonitis may threaten the peritoneal membrane even before systemic signs appear.",
      "Send properly collected effluent for cell count, differential, Gram stain, and culture before antibiotics when feasible because organism identification guides therapy, while cloudy effluent should be treated as presumed peritonitis until excluded.",
      "Trend effluent clarity and leukocytes, pain, temperature, hemodynamics, intake, output, ultrafiltration, potassium, and glucose because treatment failure can cause sepsis, catheter loss, and inadequate dialysis.",
      "Administer protocol-based intraperitoneal or systemic antimicrobials on schedule using meticulous aseptic exchanges because early adequate exposure treats infection while preventing additional touch contamination.",
      "Escalate immediately for hypotension, rigid abdomen, severe worsening pain, altered consciousness, persistent cloudy effluent, or poor response within the protocol interval because sepsis, surgical abdomen, resistant infection, or catheter removal may require urgent action."
    ], [
      "Cloudy effluent with abdominal pain, fever, or positive culture",
      "Hypotension, rising lactate, confusion, or other septic-shock findings",
      "Rigid abdomen, rebound tenderness, or severe focal abdominal pain",
      "Persistent effluent leukocytosis or clinical worsening despite appropriate therapy"
    ], [
      "Teach patients to save cloudy effluent and contact the dialysis team immediately because treatment should begin promptly after correct specimen collection.",
      "Explain hand hygiene, mask use, connection technique, and contamination reporting because hiding a touch break delays preventive treatment and increases peritonitis risk."
    ]),
    card("Postrenal AKI", ["w33a-aki-kdigo", "w33a-hemodialysis-niddk"], [
      "Assess bladder fullness, voiding symptoms, catheter patency, prostate or pelvic history, stones, malignancy, medications, and flank pain because obstruction may occur at the bladder outlet, ureters, or collecting system.",
      "Trend urine output, bladder scan, creatinine, potassium, bicarbonate, pain, hematuria, and imaging because partial or bilateral obstruction can cause severe kidney injury despite intermittent urine passage.",
      "Relieve lower-tract obstruction with ordered catheterization using aseptic technique and verify free drainage because a kinked, blocked, or misplaced catheter can perpetuate pressure and infection.",
      "After decompression, monitor hourly urine, blood pressure, weight, sodium, potassium, magnesium, and volume status because postobstructive diuresis can cause rapid hypovolemia and electrolyte loss.",
      "Escalate urgently for infected obstruction, anuria with severe hyperkalemia, uncontrolled pain, solitary-kidney obstruction, falling pressure after decompression, or persistent blockage because drainage and specialist intervention are time critical."
    ], [
      "Fever or sepsis with hydronephrosis, stone, or obstructed infected urine",
      "Anuria with hyperkalemia, severe acidosis, or rapidly rising creatinine",
      "Solitary-kidney or bilateral obstruction with worsening renal function",
      "Massive postobstructive urine output with hypotension or electrolyte loss"
    ], [
      "Explain that obstruction raises pressure behind the blockage and can reduce filtration even when the kidney tissue was initially healthy.",
      "Teach patients to seek urgent care for inability to urinate, fever with flank pain, reduced urine, or severe suprapubic pressure because delayed drainage can cause sepsis and permanent injury."
    ]),
    card("Preload", ["w33a-sepsis-sccm-2026", "w33a-fluid-ncbi"], [
      "Assess venous return, jugular veins, lung sounds, edema, blood pressure, rhythm, ventricular function, and recent fluid losses because preload reflects end-diastolic filling but differs between ventricles and disease states.",
      "Trend dynamic response to passive leg raise or a measured fluid challenge with stroke volume, pulse pressure, or echocardiography when available because static pressure alone poorly predicts fluid responsiveness.",
      "Review ventilation pressure, right-heart strain, tamponade, rhythm, venous tone, and abdominal pressure because these factors alter filling and can make central venous pressure misleading.",
      "Give or remove fluid only within a prescribed reassessment plan because increasing preload may improve output in a responsive patient but worsen pulmonary edema or right-ventricular failure in another.",
      "Escalate immediately for shock with absent fluid responsiveness, new pulmonary edema, tamponade signs, severe right-heart strain, or rapidly worsening hypoxemia because further empiric fluid may cause harm."
    ], [
      "Hypotension with cool mottling, confusion, oliguria, or rising lactate",
      "New crackles, frothy sputum, or worsening oxygenation after fluid administration",
      "Jugular venous distention with hypotension, muffled heart sounds, or pulsus findings",
      "Right-heart strain with syncope, chest pain, severe hypoxemia, or shock"
    ], [
      "Explain that preload is ventricular filling before contraction, but more filling improves output only while the heart remains fluid responsive.",
      "Teach patients with heart or kidney disease to follow individualized fluid and weight plans because both dehydration and congestion can reduce effective circulation."
    ]),
    card("Proteinuria", ["w33a-ckd-kdigo-2024", "w33a-renal-flow-ncbi"], [
      "Assess urine appearance, edema, blood pressure, diabetes, pregnancy, infection, exercise, fever, medications, and systemic symptoms because proteinuria may be transient, glomerular, tubular, overflow-related, or pregnancy-associated.",
      "Quantify albumin or total protein with the ordered ratio and trend eGFR, creatinine, albumin, lipids, weight, and sediment because dipstick intensity cannot define chronic kidney risk or protein type.",
      "Repeat an unexpected result using a properly collected specimen after transient triggers resolve because persistent protein loss, not one contaminated sample, establishes a chronic evaluation pathway.",
      "Administer prescribed kidney-protective and blood-pressure therapy while monitoring potassium, creatinine, and pregnancy status because reducing intraglomerular pressure can lower albuminuria but requires safe patient selection.",
      "Escalate urgently for proteinuria with severe hypertension, pregnancy danger signs, rapidly falling eGFR, active sediment, thrombosis symptoms, or pulmonary edema because these patterns suggest high-risk glomerular or systemic disease."
    ], [
      "Proteinuria with severe hypertension, headache, vision change, or pregnancy",
      "Hematuria, red-cell casts, rapidly rising creatinine, or oliguria",
      "Nephrotic edema with chest pain, unilateral swelling, or sudden dyspnea",
      "Pulmonary edema, severe hypoalbuminemia, or rapidly increasing protein loss"
    ], [
      "Explain that proteinuria is a marker rather than one diagnosis, so repeat quantification and kidney function reveal whether the leak is persistent and high risk.",
      "Teach patients to report swelling, foamy urine, blood in urine, reduced output, or clot symptoms and to avoid unreviewed nephrotoxic medicines."
    ]),
    card("Refractory hypoxemia", ["w33a-ards-ats", "w33a-ards-global", "w33a-ards-gas", "w33a-ards-esicm-2023", "w33a-refractory-hypoxemia-annalsats"], [
      "Confirm airway position, oxygen source, circuit integrity, FiO2, PEEP, breath sounds, blood gas, and hemodynamics because equipment failure, pneumothorax, mucus plugging, or shock may mimic refractory lung disease.",
      "Trend SpO2, PaO2/FiO2 ratio, plateau and driving pressures, compliance, synchrony, cardiac output, and lactate context because rescue oxygenation can fail if ventilation or perfusion worsens.",
      "Maintain protocol-based lung-protective ventilation and coordinate prolonged prone positioning for appropriate moderate-to-severe ARDS because recruitment and more uniform ventilation can reduce shunt without excessive tidal stress.",
      "Prepare prescribed neuromuscular blockade, inhaled pulmonary vasodilator trial, or extracorporeal consultation as bridge strategies because temporary oxygenation improvement does not replace treatment of the underlying cause.",
      "Activate the critical-care rescue pathway for persistent severe hypoxemia, cyanosis, bradycardia, altered consciousness, or hemodynamic collapse despite optimized conventional support because irreversible organ injury can occur rapidly."
    ], [
      "Persistent severe hypoxemia despite verified high-level oxygen and optimized PEEP",
      "Cyanosis, bradycardia, malignant dysrhythmia, or declining consciousness",
      "Sudden unilateral absent breath sounds or rapidly rising airway pressure",
      "Severe right-heart strain, hypotension, or escalating vasopressor requirement"
    ], [
      "Explain that refractory hypoxemia means oxygen remains dangerously low despite substantial support, often because blood continues crossing poorly aerated lung regions.",
      "Teach families that proning and other rescue therapies require coordinated teams because protecting tubes, eyes, skin, nerves, and circulation is part of improving oxygenation safely."
    ]),
    card("Respiratory acidosis", ["w33a-acidbase-ncbi", "w33a-abg-ncbi"], [
      "Assess respiratory rate and depth, airway patency, breath sounds, sedation, neuromuscular strength, chest mechanics, and mental status because alveolar hypoventilation retains carbon dioxide and lowers pH.",
      "Trend pH, PaCO2, bicarbonate, oxygenation, potassium, end-tidal CO2 when reliable, and neurologic status because acute hypercapnia causes greater acidemia than chronic renal compensation at the same PaCO2.",
      "Verify blood-gas timing and compare with prior baseline before labeling compensation because chronic lung or neuromuscular disease may normally carry elevated bicarbonate while a new rise signals decompensation.",
      "Reverse prescribed sedative causes, clear secretions, position, and support ventilation while titrating oxygen to the ordered target because oxygen treats hypoxemia but does not correct inadequate carbon-dioxide elimination.",
      "Escalate immediately for falling pH, rising PaCO2 with somnolence, shallow respirations, inability to protect the airway, severe hypoxemia, or respiratory exhaustion because ventilatory failure may require noninvasive or invasive support."
    ], [
      "Rising PaCO2 with somnolence, confusion, or inability to protect the airway",
      "pH below 7.20 or rapidly worsening acidemia",
      "Bradypnea, apnea, weak cough, or severe respiratory-muscle fatigue",
      "Hypoxemia below target despite oxygen or signs of impending arrest"
    ], [
      "Explain that respiratory acidosis results from inadequate ventilation rather than simply low oxygen, so effective breathing support must remove retained carbon dioxide.",
      "Teach patients using opioids, sedatives, or home ventilation to seek urgent help for unusual sleepiness, slowed breathing, morning headaches, or new confusion."
    ]),
    card("Stroke volume", ["w33a-sepsis-sccm-2026"], [
      "Assess heart rate and rhythm, blood pressure, pulse contour, filling, congestion, contractility, perfusion, and lactate context because stroke volume depends on preload, afterload, and myocardial function.",
      "Trend dynamic stroke-volume and lactate response to passive leg raise or a measured fluid challenge when appropriate because change predicts fluid responsiveness better than a single static filling pressure.",
      "Monitor stroke volume with cardiac output, oxygen delivery, urine output, mentation, lactate context, and echocardiography because a numerically adequate value may still be insufficient for metabolic demand.",
      "Assess rhythm, ischemia, valvular disease, right-heart strain, ventilation pressure, and vasoactive medications before intervention because multiple determinants can lower ejection despite adequate circulating volume.",
      "Escalate immediately for falling stroke volume with hypotension, chest pain, pulmonary edema, cool mottling, oliguria, rising lactate, or altered mentation because acute pump failure or obstructive shock threatens organ perfusion."
    ], [
      "Falling stroke volume with hypotension or escalating vasopressor need",
      "Chest pain, ischemic change, or new malignant dysrhythmia",
      "Pulmonary edema, severe hypoxemia, or new ventricular failure",
      "Cool mottling, oliguria, confusion, or rising lactate despite treatment"
    ], [
      "Explain that stroke volume is blood pumped with each heartbeat, whereas cardiac output also includes how many times the heart beats each minute.",
      "Teach patients to report fainting, chest pressure, rapid palpitations, worsening breathlessness, or reduced urine because these may reflect inadequate forward blood flow."
    ]),
    card("Systematic blood gas interpretation", ["w33a-abg-ncbi", "w33a-acidbase-ncbi"], [
      "Verify patient identity, arterial or venous source, oxygen device, FiO2, ventilator settings, collection time, and specimen quality because interpretation begins with knowing what was sampled under which conditions.",
      "Assess pH first, identify the ventilatory PaCO2 and bicarbonate process moving pH, then test expected compensation because this sequence prevents a near-normal pH from hiding a mixed disorder.",
      "Assess PaO2 and saturation separately from acid-base status and calculate the anion gap with albumin context when indicated because oxygenation and unmeasured acids answer different clinical questions.",
      "Review electrolytes, lactate, ketones, renal function, respiratory examination, medications, and prior gases because blood-gas numbers describe physiology but do not identify the cause by themselves.",
      "Escalate immediately for critical pH, severe hypoxemia, rapidly rising PaCO2, dangerous potassium change, or a result inconsistent with the patient's condition because urgent treatment or immediate repeat sampling may be required."
    ], [
      "pH below 7.20 or above 7.60 with clinical deterioration",
      "PaO2 or saturation critically below the ordered target",
      "Rapid PaCO2 rise with somnolence, fatigue, or weak respirations",
      "Unexpected result suggesting sampling error while the patient is unstable"
    ], [
      "Explain that a blood gas answers oxygenation, ventilation, and acid-base questions separately, so one normal component does not make the entire result normal.",
      "Teach patients that repeated gases may be needed after oxygen or ventilator changes because the sample reflects one moment under specific support settings."
    ]),
    card("Third spacing", ["w33a-fluid-ncbi", "w33a-sepsis-sccm-2026"], [
      "Assess edema, ascites, abdominal girth, lung sounds, skin, weight, blood pressure, perfusion, albumin, and inflammatory illness because third-spaced fluid is outside the effective vascular compartment and may coexist with underfilling.",
      "Trend intake and output, urine, creatinine, sodium, oxygen need, daily weight, capillary refill, and hemodynamics because visible swelling cannot show whether additional intravascular fluid will help or harm.",
      "Identify permeability injury, low oncotic pressure, venous hydrostatic pressure, lymphatic failure, or internal fluid sequestration because the mechanism determines whether source control, diuresis, drainage, nutrition, or resuscitation is appropriate.",
      "Protect skin, reposition, elevate when safe, measure abdominal pressure when ordered, and provide respiratory support because tissue edema impairs oxygen diffusion, wound healing, mobility, and organ function.",
      "Escalate immediately for hypoxemia, hypotension, oliguria, tense abdomen, compartment pain, or rapid weight and girth increase because third spacing can progress to pulmonary edema, shock, or compartment syndrome."
    ], [
      "Rapidly worsening hypoxemia with pulmonary crackles or pleural fluid",
      "Hypotension, cool mottling, oliguria, or rising lactate despite edema",
      "Tense distended abdomen with falling urine output or ventilation difficulty",
      "Severe limb pain, paresthesia, weakness, or tense compartment swelling"
    ], [
      "Explain that third spacing means fluid has moved into tissues or body cavities where it causes swelling but does not effectively perfuse organs.",
      "Teach patients to report rapid weight gain, increasing abdominal size, breathlessness, reduced urine, or painful tight swelling because these changes require reassessment."
    ]),
    card("Transpulmonary pressure", ["w33a-ards-ats", "w33a-ards-global"], [
      "Understand transpulmonary pressure as airway or alveolar pressure minus pleural pressure because the lung-distending force can differ from the airway pressure displayed when chest-wall mechanics are abnormal.",
      "Trend airway pressures, plateau pressure, PEEP, tidal volume, compliance, hemodynamics, and esophageal-pressure data when ordered because interpretation depends on passive conditions and a valid pleural-pressure surrogate.",
      "Check esophageal-balloon position, calibration, artifacts, patient effort, and body position before using measurements because technical error can lead to unsafe PEEP or pressure decisions.",
      "Collaborate with respiratory therapy and critical care on individualized recruitment and stress limitation because transpulmonary pressure may inform difficult cases but does not replace proven lung-protective ventilation.",
      "Escalate promptly for worsening hypoxemia, hypotension after PEEP change, rising plateau pressure, unilateral breath-sound loss, or new crepitus because overdistention, impaired venous return, or pneumothorax may be occurring."
    ], [
      "Hypotension or falling cardiac output after a PEEP increase",
      "Rising plateau pressure or declining compliance despite stable tidal volume",
      "Sudden unilateral absent breath sounds with oxygen deterioration",
      "New subcutaneous crepitus, pneumothorax, or severe ventilator dyssynchrony"
    ], [
      "Explain that transpulmonary pressure estimates the pressure actually stretching the lung after accounting for pressure needed to move the chest wall.",
      "Teach families that specialized measurements guide selected difficult ventilator decisions but do not provide a single safe target for every patient."
    ]),
    card("Tubuloglomerular feedback", ["w33a-renal-flow-ncbi"], [
      "Assess blood pressure, volume status, sodium delivery, glucose, kidney function, and medications affecting afferent tone or tubular transport because macula-densa signaling adjusts filtration in response to distal sodium chloride.",
      "Trend creatinine, eGFR, potassium, blood pressure, urine output, and volume after starting or changing RAAS blockers, diuretics, NSAIDs, or SGLT2 inhibitors because predictable hemodynamic shifts can become harmful during acute illness.",
      "Distinguish a small expected filtration change from progressive AKI using timing, magnitude, symptoms, and volume assessment because autoregulatory physiology should stabilize rather than continue deteriorating.",
      "Review concurrent dehydration, sepsis, heart failure, renal-artery disease, and nephrotoxin combinations because autoregulation fails when perfusion leaves its effective range or both arteriolar controls are disrupted.",
      "Escalate urgently for rapid creatinine rise, oliguria, severe hyperkalemia, hypotension, or pulmonary edema because failed autoregulation and true kidney injury require immediate medication and perfusion reassessment."
    ], [
      "Rapid progressive creatinine rise rather than an early stable change",
      "Oliguria with hypotension, sepsis, or significant volume loss",
      "Severe hyperkalemia with conduction change or muscle weakness",
      "Pulmonary edema or uncontrolled hypertension with worsening renal function"
    ], [
      "Explain that the macula densa senses downstream salt and signals the incoming arteriole and renin system to keep filtration relatively stable.",
      "Teach patients to follow sick-day instructions and avoid unreviewed NSAIDs because dehydration plus interacting medicines can overwhelm kidney autoregulation."
    ]),
    card("Acute tubular necrosis", ["w33a-aki-kdigo", "w33a-renal-flow-ncbi"], [
      "Assess duration of hypotension, sepsis, surgery, pigment injury, contrast and toxin exposure, medications, and baseline kidney function because ischemic and nephrotoxic tubular injury often follows a recognizable insult.",
      "Trend urine output, creatinine, potassium, bicarbonate, phosphate, magnesium, fluid balance, weight, and granular casts because electrolyte and volume complications change across oliguric and recovery phases.",
      "Maintain cause-directed perfusion and infection treatment while avoiding further nephrotoxins and adjusting medication doses because supportive care prevents additional tubular injury while epithelium recovers.",
      "During diuretic recovery, replace fluid and electrolytes only to prescribed targets with frequent reassessment because rising urine output can cause hypovolemia, hypokalemia, and delayed renal recovery.",
      "Escalate urgently for refractory hyperkalemia, severe acidosis, pulmonary edema, anuria, uremic encephalopathy, or pericarditic pain because these are indications for immediate nephrology and possible kidney replacement."
    ], [
      "Hyperkalemia with electrocardiogram change or malignant dysrhythmia",
      "Pulmonary edema with severe hypoxemia or respiratory distress",
      "Anuria, severe persistent acidosis, or rapidly worsening azotemia",
      "Recovery-phase polyuria with hypotension or major electrolyte depletion"
    ], [
      "Explain that damaged tubules may need time to repair even after blood pressure or infection improves, so creatinine can worsen before recovery begins.",
      "Teach patients to report reduced urine, swelling, breathlessness, severe weakness, or later excessive urine because both oliguric and recovery phases require monitoring."
    ]),
    card("ADH, osmolality, and free-water clearance", ["w33a-renal-phys-ncbi"], [
      "Assess thirst, intake, urine volume, serum sodium, serum and urine osmolality, volume status, pain, nausea, medications, and neurologic disease because ADH release reflects tonicity plus nonosmotic stress signals.",
      "Trend paired serum and urine data, weight, output, glucose, kidney function, and neurologic status because free-water retention or loss changes sodium and brain-cell volume over time.",
      "Verify timing around fluids, diuretics, desmopressin, and water restriction because treatment can rapidly change urine osmolality and make an isolated value misleading.",
      "Carry out prescribed fluid, saline, or desmopressin plans with explicit sodium-correction limits because overcorrection of chronic dysnatremia can cause osmotic demyelination or cerebral edema.",
      "Escalate immediately for seizure, coma, rapidly changing sodium, profound polyuria with shock, or water intoxication symptoms because severe free-water imbalance is a neurologic emergency."
    ], [
      "Seizure, coma, severe confusion, or new focal neurologic finding",
      "Serum sodium changing faster than the prescribed correction limit",
      "Profound polyuria with hypotension, tachycardia, or acute weight loss",
      "Worsening headache, vomiting, agitation, or declining consciousness during correction"
    ], [
      "Explain that ADH tells collecting ducts to retain water, so urine concentration reflects both hormone signaling and the kidney's ability to respond.",
      "Teach patients to follow the exact fluid and desmopressin plan because extra water or extra doses can rapidly produce dangerous hyponatremia."
    ]),
    card("AKI urine sediment, FeNa, FeUrea, and limitations", ["w33a-aki-kdigo", "w33a-renal-flow-ncbi"], [
      "Obtain a fresh clean urine specimen and review cells, casts, crystals, protein, and blood because sediment may reveal tubular, glomerular, interstitial, obstructive, or pigment-related injury.",
      "Interpret FeNa and FeUrea with urine output, timing, CKD, sepsis, contrast, obstruction, diuretics, and fluid therapy because threshold shortcuts are neither perfectly sensitive nor specific for prerenal physiology.",
      "Trend creatinine, urine output, electrolytes, sediment evolution, hemodynamics, and response to cause-directed treatment because AKI phenotype can change and one index cannot replace the clinical course.",
      "Escalate nephrology review for dysmorphic red cells, red-cell casts, heavy proteinuria, unusual crystals, or unexplained persistent AKI because biopsy, serology, antidote, or urgent disease-specific therapy may be needed.",
      "Activate urgent treatment for hyperkalemia, severe acidosis, pulmonary edema, anuria, or uremic complications regardless of FeNa or FeUrea because complication severity determines immediate safety actions."
    ], [
      "Red-cell casts, dysmorphic hematuria, or rapidly increasing proteinuria",
      "Crystals with toxin exposure, severe flank pain, or abrupt oliguria",
      "Hyperkalemia, severe acidosis, pulmonary edema, or anuria",
      "Persistent worsening AKI despite correction of apparent perfusion causes"
    ], [
      "Explain that urine microscopy can show what part of the nephron is injured, while FeNa and FeUrea are context-dependent clues rather than definitive diagnoses.",
      "Teach patients that diuretics, chronic kidney disease, sepsis, and recent fluids can alter urine indices, so treatment should not follow one percentage alone."
    ]),
    card("AV fistula thrombosis", ["w33a-access-kdoqi", "w33a-dialysis-cdc"], [
      "Assess the entire fistula for thrill, bruit, pulse, aneurysmal change, cannulation difficulty, prolonged bleeding, arm swelling, and distal circulation because stenosis often precedes complete thrombosis.",
      "Compare findings with the documented baseline before every dialysis session and trend access pressures and delivered clearance because declining flow may be detectable before the thrill disappears.",
      "Stop cannulation and notify the dialysis and access team immediately when thrill or bruit is absent because rapid thrombectomy or revision offers the best chance to preserve the access.",
      "Protect the access arm from blood pressure cuffs, venipuncture, constriction, dehydration, and prolonged direct compression because reduced inflow or outflow encourages clot formation.",
      "Activate emergency evaluation for a cold painful hand, motor or sensory loss, rapidly expanding swelling, severe bleeding, chest symptoms, or sepsis because limb ischemia, hemorrhage, central obstruction, or infection may coexist."
    ], [
      "Absent thrill or bruit in a previously functioning fistula",
      "Cold painful hand with pallor, numbness, weakness, or reduced pulse",
      "Rapidly expanding arm swelling, hematoma, or uncontrolled bleeding",
      "Fever, rigors, drainage, or spreading erythema near the access"
    ], [
      "Teach patients to feel for the fistula thrill every day and call the access team immediately if it disappears rather than waiting for dialysis.",
      "Explain that blood pressure cuffs, blood draws, tight clothing, and sleeping directly on the access can reduce flow and threaten the fistula."
    ]),
    card("Intrapulmonary shunt", ["w33a-ards-gas", "w33a-ards-global"], [
      "Assess oxygenation, breath sounds, imaging, position, secretions, atelectasis, edema, consolidation, and cardiac mixing risk because shunt occurs when blood reaches arterial circulation without contacting ventilated alveoli.",
      "Trend SpO2, arterial oxygen, PaO2/FiO2 ratio, response to oxygen and PEEP, compliance, and hemodynamics because severe shunt improves incompletely with oxygen alone and may require recruitment.",
      "Verify airway patency, tube position, suction need, and unilateral lung findings before escalating support because mucus plugging, mainstem intubation, or pneumothorax can abruptly create regional nonventilation.",
      "Implement prescribed PEEP, lung-protective ventilation, positioning, and prone therapy while treating pneumonia, edema, or collapse because reopening recruitable alveoli reconnects ventilation with perfusion.",
      "Escalate immediately for refractory hypoxemia, cyanosis, altered consciousness, sudden unilateral breath-sound loss, or hemodynamic collapse because severe shunt or an acute mechanical complication threatens oxygen delivery."
    ], [
      "Persistent severe hypoxemia with limited response to high inspired oxygen",
      "Sudden unilateral absent breath sounds or acute tube-position change",
      "Cyanosis, bradycardia, confusion, seizure, or declining consciousness",
      "Worsening right-heart strain, hypotension, or escalating vasopressor requirement"
    ], [
      "Explain that a shunt sends blood past alveoli that are not receiving air, so adding oxygen may help less than reopening those lung regions.",
      "Teach families that PEEP and prone positioning aim to recruit alveoli, while antibiotics, diuresis, or other therapy treats the cause of collapse or flooding."
    ]),
    card("Kidney replacement therapy: indications and modality choice", ["w33a-aki-kdigo", "w33a-hemodialysis-ncbi", "w33a-pd-ispd"], [
      "Assess potassium, acid-base status, volume and oxygenation, uremic complications, toxin exposure, urine output, hemodynamics, bleeding risk, and goals because kidney replacement begins for dangerous physiology rather than one creatinine or BUN threshold.",
      "Trend refractory abnormalities and response to medical treatment while preparing access, consent, laboratory studies, and equipment because delay becomes unsafe when hyperkalemia, acidosis, overload, or uremia cannot be controlled.",
      "Match intermittent hemodialysis, continuous therapy, prolonged intermittent therapy, or peritoneal dialysis to urgency, hemodynamic stability, brain risk, access, resources, and patient priorities because modalities differ in speed and tolerance.",
      "Coordinate medication dosing, nutrition, anticoagulation, fluid goals, and specimen timing with the selected modality because clearance and treatment interruptions change drug and electrolyte management.",
      "Activate immediate nephrology and critical-care response for refractory hyperkalemia, severe acidosis, pulmonary edema, uremic encephalopathy or pericarditis, or dialyzable poisoning because these indications can deteriorate before routine scheduling."
    ], [
      "Refractory hyperkalemia with electrocardiogram change or dysrhythmia",
      "Severe persistent acidosis with shock or respiratory exhaustion",
      "Pulmonary edema or oxygen failure despite medical fluid management",
      "Uremic encephalopathy, pericarditis, uncontrolled bleeding, or dialyzable toxin"
    ], [
      "Explain that dialysis is started for complications the kidneys can no longer control, not automatically at one creatinine, eGFR, or BUN value.",
      "Teach patients that modality choice balances speed, blood pressure tolerance, access, lifestyle, and goals, so the safest option can change during acute illness."
    ]),
    card("Metabolic alkalosis", ["w33a-metabolic-alkalosis-ncbi", "w33a-acidbase-ncbi"], [
      "Assess vomiting, suction, diuretics, alkali intake, blood pressure, volume, potassium, magnesium, kidney function, and mineralocorticoid clues because alkalosis persists when bicarbonate excretion is limited by chloride, potassium, perfusion, or hormonal effects.",
      "Trend pH, bicarbonate, PaCO2, chloride, potassium, magnesium, creatinine, urine chloride when ordered, rhythm, and neurologic status because severe alkalemia increases dysrhythmia, weakness, seizure, and hypoventilation risk.",
      "Verify ongoing gastric losses, diuretic timing, saline exposure, and urine-chloride context because chloride-responsive and chloride-resistant patterns require different treatment and urine results are medication sensitive.",
      "Administer prescribed chloride, potassium, magnesium, volume, diuretic adjustment, acetazolamide, or cause-specific therapy with frequent reassessment because correcting maintenance factors permits renal bicarbonate excretion.",
      "Escalate immediately for pH above 7.60, ventricular dysrhythmia, seizure, severe weakness, tetany, or hypoventilation with hypoxemia because extreme alkalemia impairs cardiac, neurologic, and respiratory function."
    ], [
      "pH above 7.60 or rapidly worsening alkalemia",
      "Ventricular dysrhythmia or severe potassium or magnesium depletion",
      "Seizure, delirium, tetany, or declining level of consciousness",
      "Hypoventilation with rising PaCO2, hypoxemia, or respiratory fatigue"
    ], [
      "Explain that vomiting or diuretics can generate alkalosis, but chloride depletion, low potassium, reduced filtration, or hormones often keep it from resolving.",
      "Teach patients not to overuse bicarbonate, antacids, or diuretics and to report persistent vomiting, palpitations, cramps, confusion, or severe weakness."
    ]),
    card("Normal-anion-gap metabolic acidosis", ["w33a-acidbase-ncbi", "w33a-rta-review"], [
      "Assess diarrhea, fistula or drain losses, saline exposure, kidney function, medications, potassium, and urinary symptoms because bicarbonate loss or impaired renal acid excretion is commonly replaced by chloride, preserving the anion gap.",
      "Trend pH, bicarbonate, chloride, potassium, creatinine, albumin-adjusted anion gap, urine pH, and ammonium surrogate when ordered because mixed high-gap acidosis may be hidden by hypoalbuminemia.",
      "Review fluid composition and calculate changes over time rather than labeling every hyperchloremic result as RTA because gastrointestinal loss, CKD, recovery from ketoacidosis, and chloride-rich resuscitation are common alternatives.",
      "Replace fluid, bicarbonate, potassium, or treat aldosterone and tubular causes only as prescribed because potassium direction and volume status differ substantially among etiologies.",
      "Escalate immediately for pH below 7.20, severe hyperkalemia or hypokalemia, shock, progressive kidney failure, arrhythmia, or respiratory fatigue because the compensatory ventilatory demand can become unsustainable."
    ], [
      "pH below 7.20 with worsening hemodynamics or mental status",
      "Hyperkalemia or hypokalemia with electrocardiogram change or weakness",
      "Rapid bicarbonate fall with shock, profuse diarrhea, or high-output drainage",
      "Progressive kidney failure, oliguria, or respiratory compensation fatigue"
    ], [
      "Explain that a normal anion gap does not mean normal acid-base status; chloride often rises as bicarbonate falls, keeping the calculated gap near normal.",
      "Teach patients to report prolonged diarrhea, reduced urine, severe weakness, palpitations, or rapid breathing because fluid, potassium, and acid losses can become dangerous together."
    ]),
    card("Oncotic pressure", ["w33a-fluid-ncbi"], [
      "Assess serum albumin context, edema, ascites, nutrition, liver function, urine protein, inflammation, capillary leak, and lymphatic function because plasma proteins help retain water but do not solely determine fluid distribution.",
      "Trend weight, edema, intake and output, perfusion, renal function, oxygen need, albumin, and protein losses because low oncotic pressure can coexist with intravascular depletion or total-body fluid excess.",
      "Identify nephrotic, hepatic, malnutrition, enteric-loss, and inflammatory mechanisms before treatment because albumin concentration may reflect dilution or redistribution rather than a simple replacement deficit.",
      "Administer albumin, diuretics, nutrition, or cause-specific therapy only within the prescribed plan and reassess lungs and pressure because infused protein can expand intravascular volume and precipitate pulmonary edema.",
      "Escalate immediately for respiratory deterioration during albumin infusion, hypotension with anasarca, nephrotic thrombosis symptoms, tense ascites, or severe skin breakdown because oncotic failure can produce life-threatening secondary complications."
    ], [
      "Acute hypoxemia or pulmonary edema during intravascular volume expansion",
      "Hypotension, oliguria, or cool mottling despite marked peripheral edema",
      "Sudden dyspnea, chest pain, or unilateral swelling with nephrotic syndrome",
      "Tense ascites with respiratory compromise or worsening kidney function"
    ], [
      "Explain that albumin contributes to the inward pull retaining vascular water, but blood pressure, permeability, and lymphatic drainage also determine edema.",
      "Teach patients not to assume a low albumin always requires an infusion because treatment must address the cause and the risk of fluid overload."
    ]),
    card("Prone positioning", ["w33a-ards-ats"], [
      "Confirm the indication, team roles, airway security, hemodynamic readiness, contraindications, and emergency plan before turning because prolonged proning benefits selected severe ARDS patients but creates predictable procedural hazards.",
      "Secure the endotracheal tube, vascular lines, drains, feeding tubes, and circuit slack using a standardized checklist because accidental dislodgement during the turn can immediately threaten ventilation or treatment.",
      "Trend oxygenation, airway pressures, blood pressure, rhythm, facial and airway edema, abdominal pressure, and tube position after each turn because physiologic benefit must be balanced against obstruction and instability.",
      "Reposition the head and arms on schedule and protect eyes, face, breasts, genitalia, knees, nerves, and pressure points because prolonged prone loading can cause corneal injury, pressure necrosis, and neuropathy.",
      "Activate the emergency supination or rescue protocol for airway loss, cardiac arrest, refractory hypotension, uncontrolled bleeding, or rapidly worsening oxygenation because immediate access and stabilization may outweigh continued proning."
    ], [
      "Endotracheal tube displacement, obstruction, or circuit disconnection",
      "Cardiac arrest, refractory hypotension, or malignant dysrhythmia",
      "New corneal injury, facial ischemia, pressure necrosis, or limb neuropathy",
      "Uncontrolled bleeding, line removal, or rapidly worsening oxygenation"
    ], [
      "Explain that prone positioning redistributes ventilation and can reduce lung stress when maintained for prolonged sessions in appropriate moderate-to-severe ARDS.",
      "Teach families that turning requires a coordinated checklist because airway, lines, eyes, skin, nerves, and circulation must all remain protected."
    ]),
    card("Pulmonary compliance", ["w33a-ards-ats", "w33a-ards-global"], [
      "Assess tidal volume, plateau pressure, PEEP, peak pressure, chest-wall condition, abdominal pressure, position, and patient effort because compliance is volume change per pressure change and includes lung plus chest-wall mechanics.",
      "Trend static compliance under passive no-flow conditions and dynamic compliance with airway resistance context because falling dynamic compliance alone may reflect bronchospasm, secretions, or tube obstruction rather than stiffer alveoli.",
      "Check for pneumothorax, edema, atelectasis, consolidation, mucus plugging, mainstem intubation, and abdominal distention when compliance falls because abrupt mechanical changes require cause-specific correction.",
      "Maintain prescribed lung-protective tidal volumes and pressure limits while addressing recruitment and synchrony because forcing the same volume into a smaller functional lung increases driving pressure and injury.",
      "Escalate immediately for a sudden compliance drop with hypoxemia, unilateral breath-sound loss, hypotension, rapidly rising pressures, or severe dyssynchrony because pneumothorax or airway obstruction may be present."
    ], [
      "Sudden compliance decrease with unilateral absent breath sounds",
      "Rapid peak and plateau pressure rise with worsening hypoxemia",
      "Hypotension, subcutaneous crepitus, or suspected tension pneumothorax",
      "Severe breath stacking, tube obstruction, or inability to deliver ventilation"
    ], [
      "Explain that low compliance means more pressure is needed to deliver the same volume because the lung, chest wall, or both have become harder to expand.",
      "Teach families that clinicians compare peak and plateau pressures to separate airway resistance from true respiratory-system stiffness before changing treatment."
    ]),
    card("Renal acid excretion and bicarbonate regeneration", ["w33a-acidbase-ncbi", "w33a-renal-phys-ncbi"], [
      "Assess kidney function, ventilation, diet, diarrhea, medications, potassium, and chronic acid load because kidneys reclaim filtered bicarbonate and excrete daily nonvolatile acid as ammonium and titratable acid.",
      "Trend pH, bicarbonate, PaCO2, potassium, chloride, anion gap, creatinine, and urine acidification studies when ordered because impaired filtration or tubular transport changes both acid removal and compensation.",
      "Distinguish bicarbonate reclamation from new bicarbonate generation because secreted hydrogen tied to urinary ammonium or buffers replaces bicarbonate consumed by metabolism.",
      "Administer prescribed alkali and potassium therapy with repeated volume and laboratory checks because sodium load, overcorrection, and potassium shifts can worsen hypertension, edema, or dysrhythmia.",
      "Escalate urgently for severe acidemia, hyperkalemic conduction change, respiratory compensation fatigue, oliguria, or progressive kidney failure because renal acid handling may no longer meet metabolic demand."
    ], [
      "pH below 7.20 with shock, confusion, or worsening organ function",
      "Hyperkalemia with weakness, conduction change, or malignant dysrhythmia",
      "Deep rapid breathing followed by fatigue or rising PaCO2",
      "Oliguria or progressive kidney failure with falling bicarbonate"
    ], [
      "Explain that kidneys do more than save filtered bicarbonate; they generate replacement bicarbonate when urine carries acid out as ammonium and buffered hydrogen.",
      "Teach patients to take prescribed alkali exactly and attend laboratory checks because too little leaves chronic acid injury while too much can cause sodium and volume problems."
    ]),
    card("Renal endocrine functions: renin, erythropoietin, and vitamin D", ["w33a-renal-phys-ncbi", "w33a-ckd-mbd-kdigo", "w33a-ckd-kdigo-2024"], [
      "Assess blood pressure and volume, hemoglobin symptoms, iron status, calcium-phosphate balance, bone pain, and CKD stage because renal endocrine failure affects circulation, red-cell production, and mineral metabolism simultaneously.",
      "Trend blood pressure, potassium, hemoglobin, iron indices, calcium, phosphate, PTH, alkaline phosphatase, and vitamin-D measures when ordered because each hormonal axis requires related safety markers rather than one isolated value.",
      "Administer RAAS-modifying, erythropoiesis-stimulating, iron, vitamin-D, phosphate, or calcimimetic therapy as prescribed because benefits depend on cause, CKD stage, adequate substrates, and avoidance of hypertension or thrombosis.",
      "Coordinate kidney, cardiovascular, anemia, nutrition, and bone care because treating erythropoietin deficiency without iron or mineral abnormalities without serial trends produces incomplete or unsafe control.",
      "Escalate urgently for hypertensive emergency, severe hyperkalemia, symptomatic anemia, thrombosis symptoms, tetany, seizure, malignant dysrhythmia, or suspected calciphylaxis because endocrine complications can become immediately life-threatening."
    ], [
      "Hypertensive emergency or severe hyperkalemia with electrocardiogram change",
      "Chest pain, syncope, heart-failure findings, or profound symptomatic anemia",
      "New thrombosis symptoms during erythropoiesis-stimulating therapy",
      "Tetany, seizure, malignant dysrhythmia, or painful necrotic skin lesion"
    ], [
      "Explain that kidneys release renin, signal red-cell production through erythropoietin, and activate vitamin D, so kidney disease affects much more than waste removal.",
      "Teach patients not to self-start iron, calcium, or vitamin D because laboratory patterns and CKD stage determine which replacement is useful and safe."
    ]),
    card("Renal tubular acidosis types 1, 2, and 4", ["w33a-rta-review", "w33a-acidbase-ncbi"], [
      "Assess potassium, bicarbonate, chloride, kidney function, urine pH, stone history, autoimmune disease, diabetes, medications, and proximal tubular losses because distal, proximal, and type 4 RTA have different mechanisms and risks.",
      "Trend blood gas, anion gap with albumin context, potassium, urine pH, urine ammonium surrogate, glucose, phosphate, and urinalysis because classification requires persistent normal-gap acidosis plus compatible renal findings.",
      "Recognize distal RTA with impaired urine acidification and stone risk, proximal RTA with bicarbonate wasting and possible Fanconi features, and type 4 RTA with hypoaldosterone physiology and hyperkalemia because treatment priorities differ.",
      "Administer prescribed alkali, potassium, diuretic, mineralocorticoid, or cause-directed therapy with close laboratory and volume monitoring because replacement needs and potassium effects can move in opposite directions among types.",
      "Escalate immediately for severe hyperkalemia or hypokalemia, electrocardiogram change, pH below 7.20, paralysis, arrhythmia, progressive kidney failure, or obstructing stones because electrolyte and acid complications can be fatal."
    ], [
      "Hyperkalemia with peaked T waves, conduction delay, weakness, or dysrhythmia",
      "Severe hypokalemia with paralysis, ileus, rhabdomyolysis, or dysrhythmia",
      "pH below 7.20 with shock, confusion, or respiratory fatigue",
      "Obstructing stone, recurrent pyelonephritis, or progressive kidney failure"
    ], [
      "Explain that all three disorders cause renal normal-gap acidosis, but distal acid secretion, proximal bicarbonate recovery, or aldosterone-related potassium handling is affected differently.",
      "Teach patients to follow potassium-specific instructions and laboratory monitoring because type 1 or 2 often lowers potassium while type 4 usually raises it."
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

  const refractoryHypoxemiaSourceIds = new Set(
    cards.find((entry) => entry.name === "Refractory hypoxemia")?.sourceIds || []
  );
  const referenceMap = new Map((Array.isArray(database.sourceReferences) ? database.sourceReferences : [])
    .map((reference) => [String(reference && (reference.key || reference.id) || "").trim(), reference])
    .filter(([key]) => key));
  sources.filter((source) => refractoryHypoxemiaSourceIds.has(source.id)).forEach((source) => {
    referenceMap.set(source.id, {
      key: source.id,
      label: source.label,
      url: source.url,
      note: source.note
    });
  });
  database.sourceReferences = Array.from(referenceMap.values());

  const names = cards.map((entry) => entry.name);
  window.ANI_PATHOLOGY_NURSING_WAVE33_A = {
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
