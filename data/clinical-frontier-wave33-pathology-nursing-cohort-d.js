(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  function activePathologyEntries() {
    return typeof pathologyDiseases !== "undefined" && Array.isArray(pathologyDiseases)
      ? pathologyDiseases
      : database.diseases;
  }

  const VERSION = "2026-07-19-wave33-pathology-nursing-d-1";
  const sources = [
    { id: "w33d-trauma-blunt", label: "NCBI Bookshelf, Blunt Abdominal Trauma", url: "https://www.ncbi.nlm.nih.gov/books/NBK431087/", note: "Supports mechanism-based assessment, serial examination, hemodynamic stabilization, imaging according to stability, and recognition of hemorrhage or peritonitis in blunt abdominal trauma; penetrating mechanisms require additional trauma protocols." },
    { id: "w33d-trauma-penetrating", label: "NCBI Bookshelf, Penetrating Abdominal Trauma", url: "https://www.ncbi.nlm.nih.gov/books/NBK459123/", note: "Supports rapid trauma triage, hemorrhage and contamination control, transfusion, operative consultation, and selective observation in appropriately stable penetrating injuries; local trauma-center algorithms remain controlling." },
    { id: "w33d-aap-bilirubin", label: "American Academy of Pediatrics, 2022 Hyperbilirubinemia Guideline", url: "https://publications.aap.org/pediatrics/article/150/3/e2022058859/188726/Clinical-Practice-Guideline-Revision-Management-of", note: "Supports hour-specific bilirubin assessment, hemolysis and neurotoxicity risk evaluation, phototherapy, escalation-of-care, and exchange-transfusion thresholds for infants at least 35 weeks; more premature infants require separate protocols." },
    { id: "w33d-acidbase", label: "NCBI Bookshelf, Physiology of Acid-Base Balance", url: "https://www.ncbi.nlm.nih.gov/books/NBK507807/", note: "Supports bicarbonate buffering, respiratory and renal regulation, expected compensation, and interpretation of mixed acid-base disorders; formulas estimate physiology but do not replace clinical cause finding." },
    { id: "w33d-abg", label: "NCBI Bookshelf, Arterial Blood Gas", url: "https://www.ncbi.nlm.nih.gov/books/NBK536919/", note: "Supports systematic pH, PaCO2, bicarbonate, oxygenation, sampling, and compensation assessment while emphasizing that laboratory results require clinical correlation." },
    { id: "w33d-anion-gap", label: "NCBI Bookshelf, Anion Gap and Non-Anion Gap Metabolic Acidosis", url: "https://www.ncbi.nlm.nih.gov/books/NBK448090/", note: "Supports anion-gap calculation, albumin context, delta comparisons, and evaluation of high- and normal-gap acidosis; treatment must target the responsible disease or exposure." },
    { id: "w33d-all-child", label: "National Cancer Institute, Childhood Acute Lymphoblastic Leukemia Treatment PDQ", url: "https://www.cancer.gov/types/leukemia/hp/child-all-treatment-pdq", note: "Supports risk-adapted childhood ALL treatment phases, central-nervous-system therapy, myelosuppression, infection, bleeding, and tumor-lysis considerations; it is an evidence summary rather than a bedside protocol." },
    { id: "w33d-all-adult", label: "National Cancer Institute, Adult Acute Lymphoblastic Leukemia Treatment PDQ", url: "https://www.cancer.gov/types/leukemia/hp/adult-all-treatment-pdq", note: "Supports adult ALL diagnostic and treatment principles, remission induction, post-remission therapy, targeted options, and complication surveillance; regimen details belong to the treating oncology protocol." },
    { id: "w33d-adrenal-crisis", label: "Society for Endocrinology, Adrenal Crisis Clinical Guidance", url: "https://www.endocrinology.org/clinical-practice/clinical-guidance/adrenal-crisis/", note: "Supports immediate parenteral hydrocortisone, isotonic saline, glucose and electrolyte assessment, trigger treatment, and prevention education in suspected adrenal crisis; exact fluid and steroid dosing follows age and local emergency protocols." },
    { id: "w33d-afterload", label: "NCBI Bookshelf, Physiology of Afterload Reduction", url: "https://www.ncbi.nlm.nih.gov/books/NBK493174/", note: "Supports afterload as the force opposing ventricular ejection, its inverse relationship with systolic performance, and context-dependent effects of vascular resistance and vasodilators; arterial pressure alone is an imperfect surrogate." },
    { id: "w33d-albuminuria", label: "NIDDK, Albuminuria: Albumin in the Urine", url: "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd/tests-diagnosis/albuminuria-albumin-urine", note: "Supports UACR testing, confirmation and longitudinal monitoring of urine albumin, kidney-disease risk, and the meaning of persistent albuminuria; transient results still require clinical interpretation." },
    { id: "w33d-anal-fissure", label: "American Society of Colon and Rectal Surgeons, 2023 Anal Fissure Guideline", url: "https://fascrs.org/ascrs/media/files/Education/2023-Anal-Fissures-CPG.pdf", note: "Supports adult anal-fissure diagnosis, conservative bowel measures, topical therapy, botulinum toxin, and selected surgery; atypical, pediatric, inflammatory, infectious, and malignant causes need separate evaluation." },
    { id: "w33d-asbestosis", label: "ATSDR, Asbestos Toxicity Clinical Assessment", url: "https://archive.cdc.gov/www_atsdr_cdc_gov/csem/asbestos/clinical_assessment.html", note: "Supports detailed exposure and smoking history, latency, dyspnea, cough, crackles, clubbing, and evaluation for asbestos-associated lung and pleural disease; the archived module is educational rather than a current treatment guideline." },
    { id: "w33d-asbestosis-tests", label: "ATSDR, Asbestos Toxicity Clinical Assessment Tests", url: "https://archive.cdc.gov/www_atsdr_cdc_gov/csem/asbestos/clinical_assessment-tests.html", note: "Supports chest imaging, pulmonary-function assessment, and specialist evaluation when asbestos-related diagnosis, rapid decline, malignancy, or alternative disease remains uncertain." },
    { id: "w33d-ascites", label: "AASLD, Ascites, Spontaneous Bacterial Peritonitis, and Hepatorenal Syndrome Guidance", url: "https://www.aasld.org/practice-guidelines/diagnosis-evaluation-and-management-ascites-spontaneous-bacterial-peritonitis", note: "Supports evaluation and management of cirrhosis-related ascites, diagnostic paracentesis, spontaneous bacterial peritonitis, and hepatorenal dysfunction; cardiac, malignant, pancreatic, and other ascites require cause-specific guidance." },
    { id: "w33d-access", label: "National Kidney Foundation KDOQI, 2019 Vascular Access Guideline", url: "https://www.kidney.org/professionals/kdoqi/guidelines-and-commentaries/vascular-access", note: "Supports examination, cannulation, dysfunction recognition, and diagnosis and management of arteriovenous-access infection within an individualized ESKD life plan; facility infection and emergency-bleeding protocols still apply." },
    { id: "w33d-bph", label: "NIDDK, Enlarged Prostate (Benign Prostatic Hyperplasia)", url: "https://www.niddk.nih.gov/health-information/urologic-diseases/prostate-problems/enlarged-prostate-benign-prostatic-hyperplasia", note: "Supports BPH symptoms, evaluation, watchful waiting, medication and procedural options, and recognition of retention or infection; lower-urinary-tract symptoms can have non-prostatic causes." },
    { id: "w33d-cardiomyopathy", label: "European Society of Cardiology, 2023 Cardiomyopathy Guideline", url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/cardiomyopathy/", note: "Supports phenotype-based cardiomyopathy diagnosis, family assessment, risk stratification, and general management across ages; individual hypertrophic, dilated, restrictive, arrhythmogenic, and infiltrative phenotypes require tailored decisions." },
    { id: "w33d-cauti", label: "CDC, Catheter-Associated Urinary Tract Infection Guideline", url: "https://www.cdc.gov/infection-control/hcp/cauti/", note: "Supports appropriate catheter indications, aseptic insertion, closed drainage, unobstructed flow, maintenance, and prompt removal to prevent CAUTI; it does not select an individual patient's antimicrobial regimen." },
    { id: "w33d-cauti-stewardship", label: "CDC, Urine Culture Stewardship in Patients with Indwelling Urinary Catheters", url: "https://www.cdc.gov/uti/hcp/clinical-guidance/index.html", note: "Supports distinguishing symptomatic infection from catheter-associated asymptomatic bacteriuria and obtaining cultures only for appropriate indications using aseptic technique." },
    { id: "w33d-cryptorchidism", label: "NCBI Bookshelf, Cryptorchidism", url: "https://www.ncbi.nlm.nih.gov/books/NBK470270/", note: "Supports serial examination, differentiation from retractile testes, referral when descent has not occurred by six months, orchiopexy, and long-term fertility, torsion, hernia, and malignancy counseling." },
    { id: "w33d-dialysis-hypotension", label: "KDIGO, Blood Pressure and Volume Management in Dialysis Conference Report", url: "https://kdigo.org/wp-content/uploads/2017/05/KDIGO-BP-Volume-in-Dialysis-FINAL.pdf", note: "Supports individualized assessment of intradialytic hypotension, ultrafiltration, target weight, compensatory responses, symptoms, and repeated treatment review; no single blood-pressure or ultrafiltration threshold fits every patient." },
    { id: "w33d-fibroblast", label: "NCBI Bookshelf, Histology of the Fibroblast", url: "https://www.ncbi.nlm.nih.gov/books/NBK541065/", note: "Supports fibroblast activation, transforming growth factor signaling, extracellular-matrix deposition, wound repair, and pathologic fibrosis; organ-specific prognosis and antifibrotic treatment require dedicated guidance." },
    { id: "w33d-iga-vasculitis", label: "NIDDK, IgA Vasculitis", url: "https://www.niddk.nih.gov/health-information/kidney-disease/iga-vasculitis", note: "Supports purpura, gastrointestinal, joint, scrotal, and kidney manifestations, blood-pressure and urine follow-up, intussusception risk, and avoiding NSAIDs when kidney function is reduced." },
    { id: "w33d-hypermagnesemia", label: "NCBI Bookshelf, Hypermagnesemia", url: "https://www.ncbi.nlm.nih.gov/books/NBK549811/", note: "Supports exposure and renal-cause assessment, reflex, respiratory, cardiovascular, electrolyte, and ECG monitoring, stopping magnesium, calcium stabilization, diuresis, and dialysis in severe toxicity." },
    { id: "w33d-hyperthyroidism", label: "American Thyroid Association, Hyperthyroidism and Thyrotoxicosis Guidelines", url: "https://www.thyroid.org/guidelines-hyperthyroidism-thyrotoxicosis/", note: "Supports diagnosis and treatment across antithyroid drugs, radioiodine, surgery, pregnancy, ophthalmopathy, and thyroid storm; medication selection and definitive therapy require individualized endocrine decisions." },
    { id: "w33d-tma", label: "NCBI Bookshelf, Thrombotic Microangiopathy and the Kidney", url: "https://www.ncbi.nlm.nih.gov/books/NBK611985/", note: "Supports endothelial injury, platelet-rich microthrombi, schistocyte-forming hemolysis, thrombocytopenia, organ ischemia, and urgent syndrome-specific evaluation; TTP, HUS, complement-mediated TMA, DIC, and secondary causes are not interchangeable." },
    { id: "w33d-renal-physiology", label: "NCBI Bookshelf, Renal Physiology", url: "https://www.ncbi.nlm.nih.gov/books/NBK538339/", note: "Supports nephron filtration, segmental solute and water handling, electrolyte, osmolality, acid-base, endocrine, and homeostatic functions; it is an educational physiology source rather than a treatment protocol." },
    { id: "w33d-aki", label: "KDIGO, Acute Kidney Injury Guideline Suite", url: "https://kdigo.org/guidelines/acute-kidney-injury/", note: "Supports established AKI staging, cause evaluation, perfusion and supportive principles, complication monitoring, and kidney-replacement considerations; the 2012 guideline remains final while the 2026 update is in public review." },
    { id: "w33d-osmotic-diuresis", label: "NCBI Bookshelf, Mannitol", url: "https://www.ncbi.nlm.nih.gov/books/NBK470392/", note: "Supports the mechanism by which nonreabsorbed tubular solute retains water and produces osmotic diuresis, with volume, electrolyte, osmolality, kidney, and cardiopulmonary monitoring; other causes require cause-specific treatment." },
    { id: "w33d-samhsa", label: "SAMHSA TIP 63, Medications for Opioid Use Disorder", url: "https://library.samhsa.gov/sites/default/files/pep21-02-01-002.pdf", note: "Supports naloxone access, overdose prevention, methadone, buprenorphine, naltrexone, ongoing psychosocial care, and the risk of withdrawal-only approaches for opioid use disorder; other substances need their own withdrawal and treatment protocols." },
    { id: "w33d-starling", label: "NCBI Bookshelf, Physiology of Colloid Osmotic Pressure", url: "https://www.ncbi.nlm.nih.gov/books/NBK541067/", note: "Supports hydrostatic, oncotic, permeability, and lymphatic determinants of transcapillary fluid movement; simplified Starling models must be applied in the context of organ function and the cause of edema." },
    { id: "w33d-tripod", label: "NCBI Bookshelf, Tachypnea", url: "https://www.ncbi.nlm.nih.gov/books/NBK541062/", note: "Supports tripod positioning as a sign of increased work of breathing within respiratory-distress assessment; the posture does not identify the cause or exclude imminent fatigue." },
    { id: "w33d-uremia", label: "NCBI Bookshelf, Uremia", url: "https://www.ncbi.nlm.nih.gov/books/NBK441859/", note: "Supports multisystem manifestations of retained uremic toxins, neurologic, gastrointestinal, bleeding, pericardial, fluid, and electrolyte complications, and symptom-based kidney-replacement assessment." },
    { id: "w33d-wound", label: "NCBI Bookshelf, Wound Dehiscence", url: "https://www.ncbi.nlm.nih.gov/books/NBK551712/", note: "Supports recognition of superficial versus deep wound separation, infection and healing risks, tension reduction, and emergency management of fascial dehiscence or evisceration; closure decisions belong to the surgical team." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const cards = [
    card("Abdominal trauma", ["w33d-trauma-blunt", "w33d-trauma-penetrating"], [
      "Assess airway, breathing, circulation, injury mechanism, abdominal tenderness, distention, guarding, wounds, and seatbelt marks because abdominal trauma can conceal major hemorrhage or hollow-organ injury.",
      "Trend heart rate, blood pressure, mental status, skin perfusion, urine output, lactate, and hemoglobin because serial change may reveal bleeding before one examination or laboratory value does.",
      "Maintain nothing-by-mouth status, establish large-bore access, obtain type and crossmatch, and prepare warmed blood products because unstable abdominal trauma may require immediate transfusion or surgery.",
      "Reassess the abdomen, pain pattern, emesis, bowel sounds, and wound or drain output because delayed splenic bleeding, perforation, ischemia, or peritonitis can emerge during observation.",
      "Activate the trauma and surgical response for persistent hypotension, peritoneal rigidity, evisceration, uncontrolled external bleeding, or rapidly enlarging distention because these findings require time-critical hemorrhage control."
    ], [
      "Persistent hypotension, tachycardia, cool skin, or decreasing level of consciousness",
      "Rigid abdomen, rebound tenderness, involuntary guarding, or rapidly worsening pain",
      "Evisceration, penetrating wound with uncontrolled bleeding, or expanding abdominal distention",
      "Falling hemoglobin, rising lactate, oliguria, hematemesis, or bloody stool"
    ], [
      "Explain that internal bleeding or bowel injury may initially cause few symptoms, so repeated examinations and observation are important even after reassuring early findings.",
      "Teach patients discharged after minor trauma to seek emergency care for fainting, increasing pain, vomiting, abdominal swelling, shoulder pain, fever, or blood in stool or urine."
    ]),
    card("ABO incompatibility", ["w33d-aap-bilirubin"], [
      "Assess maternal and newborn blood groups, gestational age, direct antiglobulin result, bilirubin by hours of life, hemoglobin, feeding, and bruising because maternal IgG-mediated hemolysis accelerates bilirubin production.",
      "Trend bilirubin rate of rise, neurologic behavior, pallor, heart rate, intake, output, and weight because ongoing hemolysis can cause both acute bilirubin neurotoxicity and later anemia.",
      "Administer intensive phototherapy at the infant's age- and risk-specific threshold while maximizing exposed skin and eye protection because light converts unconjugated bilirubin into excretable products.",
      "Coordinate repeat bilirubin and hemoglobin testing, rebound surveillance, and compatible blood products because antibody-driven red-cell destruction can continue after bilirubin initially improves.",
      "Escalate immediately for bilirubin at the escalation-of-care threshold, a rapid unexplained rise, lethargy, poor suck, abnormal tone, arching, seizures, or cardiorespiratory instability because exchange transfusion may be required."
    ], [
      "Bilirubin reaching the age- and neurotoxicity-risk-specific escalation threshold",
      "Lethargy, poor feeding, high-pitched cry, abnormal tone, arching, or seizures",
      "Rapid bilirubin rise despite intensive phototherapy or evidence of continuing hemolysis",
      "Marked pallor, tachycardia, apnea, poor perfusion, or falling hemoglobin"
    ], [
      "Explain that ABO incompatibility destroys some newborn red cells, producing bilirubin faster than the immature liver can clear it; it is not caused by feeding choices.",
      "Teach caregivers to keep every bilirubin and anemia follow-up appointment and seek urgent care for worsening yellow color, poor feeding, unusual sleepiness, arching, breathing changes, or pallor."
    ]),
    card("Acid-base balance and the bicarbonate buffer", ["w33d-acidbase", "w33d-abg"], [
      "Assess pH, PaCO2, bicarbonate, sodium, chloride, albumin, lactate, ketones, renal function, and clinical context because bicarbonate buffering links respiratory carbon-dioxide removal with renal acid handling.",
      "Trend serial blood gases, electrolytes, anion gap, respiratory pattern, mental status, and hemodynamics because acid-base balance can change quickly while compensation or treatment is evolving.",
      "Verify specimen timing and quality, then compare measured compensation with the expected response because an unexpected PaCO2 or bicarbonate suggests a second acid-base process rather than failed arithmetic.",
      "Administer cause-directed fluids, insulin, dextrose, electrolytes, ventilation, or antidotal therapy as prescribed because correcting the generator of excess acid or base restores the bicarbonate buffer safely.",
      "Escalate for pH below 7.20 or above 7.60, worsening potassium-related ECG changes, shock, seizures, severe confusion, or respiratory exhaustion because extreme acidemia or alkalemia impairs cardiac and neurologic function."
    ], [
      "pH below 7.20 or above 7.60 with clinical deterioration",
      "New dysrhythmia or ECG change with severe potassium disturbance",
      "Progressive confusion, seizure, coma, or loss of protective reflexes",
      "Respiratory fatigue, falling ventilation, shock, or rapidly rising lactate"
    ], [
      "Explain that bicarbonate does not work alone: lungs regulate carbon dioxide within minutes, while kidneys replace bicarbonate and excrete acid over hours to days.",
      "Teach that an abnormal bicarbonate value does not automatically mean bicarbonate medicine is needed, because treatment depends on the primary disorder, compensation, volume status, and cause."
    ]),
    card("Acute lymphoblastic leukemia", ["w33d-all-child", "w33d-all-adult"], [
      "Assess fever, infection exposure, pallor, fatigue, bruising, bleeding, bone pain, lymph nodes, abdominal fullness, and neurologic symptoms because marrow replacement and extramedullary leukemia produce multisystem findings.",
      "Trend CBC with differential, absolute neutrophil count, platelets, hemoglobin, uric acid, potassium, phosphate, calcium, creatinine, and cultures because treatment can cause myelosuppression and tumor lysis.",
      "Implement neutropenic precautions, meticulous line care, oral care, and bleeding precautions when counts require them because infection and hemorrhage can become life-threatening before classic inflammation appears.",
      "Administer protocol chemotherapy, hydration, tumor-lysis prophylaxis, antimicrobials, and blood products on schedule because durable remission requires coordinated phase-specific therapy plus complication prevention.",
      "Escalate immediately for temperature at or above 38.0 degrees Celsius, uncontrolled bleeding, new neurologic deficit, dyspnea, oliguria, or potassium-related ECG changes because neutropenic sepsis, leukostasis, or tumor lysis demands urgent treatment."
    ], [
      "Temperature at or above 38.0 degrees Celsius during neutropenia",
      "New petechiae with mucosal bleeding, melena, severe headache, or uncontrolled hemorrhage",
      "Rising potassium or phosphate, falling calcium, oliguria, or cardiac rhythm change",
      "New weakness, seizure, severe headache, respiratory distress, or altered mental status"
    ], [
      "Explain that remission induction, consolidation, and maintenance serve different purposes, so feeling better does not mean later treatment phases or laboratory monitoring are optional.",
      "Teach patients and caregivers to report fever before taking fever-reducing medicine and to follow line-care, infection-exposure, bleeding, medication, and food-safety instructions from their oncology team."
    ]),
    card("Addisonian crisis", ["w33d-adrenal-crisis"], [
      "Assess blood pressure, volume loss, vomiting, abdominal pain, weakness, confusion, pigmentation, steroid use, missed doses, infection, surgery, and trauma because cortisol deficiency impairs vascular tone and stress adaptation.",
      "Trend blood pressure, heart rate, mental status, glucose, sodium, potassium, creatinine, urine output, and temperature because adrenal crisis can combine shock, hypoglycemia, hyponatremia, hyperkalemia, and a precipitating infection.",
      "Administer parenteral hydrocortisone and rapid isotonic saline per emergency protocol without awaiting confirmatory testing because delayed glucocorticoid replacement can allow refractory shock to progress.",
      "Check glucose promptly, give dextrose for hypoglycemia, obtain cultures when infection is suspected, and administer timely antimicrobials because metabolic rescue and treatment of the trigger must occur together.",
      "Activate the emergency response for persistent hypotension, glucose below the local rescue threshold, severe hyperkalemic ECG changes, seizure, worsening confusion, or unresponsiveness because intensive hemodynamic support may be necessary."
    ], [
      "Persistent hypotension or shock despite initial saline and hydrocortisone",
      "Hypoglycemia with confusion, seizure, diaphoresis, or inability to swallow",
      "Severe hyperkalemia with weakness, bradycardia, or ECG changes",
      "Repeated vomiting, fever, collapse, or rapidly decreasing level of consciousness"
    ], [
      "Teach that maintenance steroids replace a hormone the body cannot reliably produce, so doses must never be stopped abruptly and must increase during specified illness or surgery.",
      "Ensure the patient has written sick-day rules, injectable emergency hydrocortisone, medical identification, and instructions for immediate emergency care when vomiting prevents oral medication."
    ]),
    card("Afterload", ["w33d-afterload"], [
      "Assess blood pressure, mean arterial pressure, pulses, capillary refill, urine output, lung sounds, murmurs, ventricular function, and shock context because afterload reflects the total opposition to ventricular ejection.",
      "Trend heart rate, rhythm, blood pressure, mental status, urine output, lactate, and pulmonary congestion during afterload-altering therapy because excessive resistance lowers stroke volume while excessive reduction can impair perfusion.",
      "Verify arterial-line leveling and vasoactive infusion accuracy when used because a misleading pressure measurement can prompt unsafe afterload changes despite unchanged ventricular wall stress or vascular resistance.",
      "Administer prescribed vasodilator for pathologically high afterload or vasopressor for distributive vasodilation while reassessing perfusion because the safe direction of change depends on the underlying hemodynamic problem.",
      "Escalate for new hypotension, chest pain, pulmonary edema, falling urine output, rising lactate, syncope, or sustained dysrhythmia because afterload mismatch can rapidly reduce forward cardiac output."
    ], [
      "New hypotension with cool skin, confusion, oliguria, or rising lactate",
      "Acute pulmonary edema, severe dyspnea, or rapidly increasing oxygen requirement",
      "Chest pain, syncope, sustained ventricular dysrhythmia, or new ischemic ECG change",
      "Marked hypertension with neurologic symptoms, chest pain, or acute kidney injury"
    ], [
      "Explain that afterload is not simply blood pressure; it is the changing force a ventricle must overcome, influenced by vascular resistance, pressure, chamber geometry, and valve obstruction.",
      "Teach patients taking afterload-altering medicines to rise slowly, monitor blood pressure as directed, and report fainting, chest pain, worsening breathlessness, swelling, or sharply reduced urine."
    ]),
    card("Albuminuria", ["w33d-albuminuria"], [
      "Assess diabetes, hypertension, heart disease, pregnancy, fever, vigorous exercise, urinary infection, menstruation, and sample contamination because transient factors can raise urine albumin without establishing chronic kidney disease.",
      "Trend repeat urine albumin-to-creatinine ratio, estimated GFR, blood pressure, potassium, edema, and glycemic control because persistent albuminuria predicts kidney-function loss and cardiovascular risk across a continuum.",
      "Obtain a clean first-morning urine sample when practical and document collection conditions because UACR corrects for urine concentration but cannot correct for contamination or temporary physiologic stress.",
      "Review kidney-protective medication adherence, sodium intake, blood-pressure control, and nephrotoxic exposures with the team because lowering glomerular injury can reduce albumin leakage and slow progression.",
      "Escalate for rapidly rising creatinine, gross hematuria, severe hypertension, oliguria, generalized edema, dyspnea, or nephrotic-range protein loss because these findings suggest more urgent or advanced renal disease."
    ], [
      "Rapid increase in creatinine or abrupt fall in estimated GFR",
      "Gross hematuria, red-cell casts, severe flank pain, or systemic inflammatory findings",
      "Generalized edema, dyspnea, very low serum albumin, or suspected thrombosis",
      "Severe hypertension, oliguria, anuria, or rapidly increasing potassium"
    ], [
      "Explain that albumin normally stays in the bloodstream, so persistent urine albumin is an early signal of glomerular barrier injury even when creatinine remains normal.",
      "Teach patients to repeat testing under recommended conditions and control blood pressure, diabetes, smoking, and medication risks because one isolated dipstick cannot define progression or treatment response."
    ]),
    card("Anal fissure", ["w33d-anal-fissure"], [
      "Assess sharp defecation-related pain, bright-red bleeding, constipation, stool trauma, fissure location, duration, and inflammatory or infectious history because typical midline fissures differ from atypical secondary lesions.",
      "Monitor stool frequency and consistency, pain after bowel movements, bleeding amount, hydration, and healing appearance because repeated hard stool and internal-sphincter spasm perpetuate ischemia and re-tearing.",
      "Encourage adequate fiber, individualized fluid intake, prescribed stool softening, warm sitz baths, and gentle hygiene because soft stool and sphincter relaxation reduce mechanical trauma during healing.",
      "Administer prescribed topical anesthetic or sphincter-relaxing therapy and assess headache, dizziness, or skin irritation because pain relief and reduced resting pressure can interrupt the fissure-spasm cycle.",
      "Notify the colorectal team for lateral or multiple fissures, fever, purulent drainage, mass, severe bleeding, immunosuppression, or failure to heal because abscess, Crohn disease, infection, or malignancy may mimic a simple fissure."
    ], [
      "Fever, spreading redness, fluctuance, purulent drainage, or systemic illness",
      "Large-volume bleeding, dizziness, syncope, tachycardia, or falling hemoglobin",
      "Lateral, multiple, painless, irregular, indurated, or mass-associated fissure",
      "Severe unremitting pain, urinary retention, immunosuppression, or failed healing"
    ], [
      "Explain that pain triggers internal-sphincter spasm, which reduces local blood flow and delays healing; keeping stool soft breaks this cycle more effectively than avoiding bowel movements.",
      "Teach patients to seek reassessment for persistent bleeding, fever, drainage, a new lump, weight loss, or a fissure that does not improve with the prescribed plan."
    ]),
    card("Anion gap physiology and interpretation", ["w33d-anion-gap", "w33d-acidbase"], [
      "Assess sodium, chloride, bicarbonate, pH, PaCO2, albumin, lactate, ketones, renal function, glucose, and possible toxins because the anion gap estimates clinically important unmeasured anions.",
      "Calculate the albumin-adjusted anion gap and compare the gap change with the bicarbonate change because hypoalbuminemia can hide acidosis and discordant changes suggest a mixed disorder.",
      "Trend serial anion gap, lactate, ketones, chloride, bicarbonate, potassium, creatinine, mental status, and perfusion because closing or widening values reveal whether acid generation and clearance are improving.",
      "Administer cause-specific insulin, fluids, dextrose, antidote, electrolyte replacement, or dialysis as prescribed because anion-gap normalization depends on stopping acid production or removing retained anions.",
      "Escalate for rising anion gap with shock, pH below 7.20, potassium-related ECG changes, visual symptoms, seizure, or unexplained altered mental status because lactic, ketoacid, renal, or toxic acidosis may be immediately dangerous."
    ], [
      "Rising anion gap with hypotension, poor perfusion, or increasing lactate",
      "pH below 7.20, severe bicarbonate decline, or respiratory fatigue",
      "Hyperkalemia with ECG changes, ventricular dysrhythmia, or profound weakness",
      "Visual disturbance, seizure, coma, or suspected toxic alcohol or salicylate exposure"
    ], [
      "Explain that the anion gap is a calculated clue, not a diagnosis; it points toward unmeasured acids whose source must still be identified.",
      "Teach that albumin, chloride-rich fluids, vomiting, diarrhea, kidney function, medications, and toxins can change interpretation, so trends and the complete blood gas matter more than one number."
    ]),
    card("Asbestosis", ["w33d-asbestosis", "w33d-asbestosis-tests"], [
      "Assess lifetime occupational, military, construction, shipyard, demolition, and household exposure, latency, smoking, exertional dyspnea, dry cough, crackles, and clubbing because asbestosis often appears decades after inhalation.",
      "Trend resting and exertional oxygen saturation, respiratory rate, exercise tolerance, pulmonary-function results, and imaging changes because progressive interstitial fibrosis reduces diffusion and restrictive lung capacity.",
      "Provide prescribed oxygen, vaccination support, pulmonary rehabilitation, energy conservation, and infection prevention because these measures reduce physiologic stress even though they do not remove deposited asbestos fibers.",
      "Coordinate pulmonology and occupational-medicine review for diagnostic uncertainty, rapid functional decline, hemoptysis, focal imaging change, pleural effusion, or weight loss because lung cancer and mesothelioma require separate evaluation.",
      "Escalate immediately for acute hypoxemia, severe respiratory distress, cyanosis, confusion, chest pain, or large-volume hemoptysis because chronic asbestosis does not explain away a new cardiopulmonary emergency."
    ], [
      "Acute hypoxemia, cyanosis, confusion, or rapidly increasing oxygen requirement",
      "New hemoptysis, unexplained weight loss, focal chest pain, or enlarging pleural effusion",
      "Severe respiratory distress, exhaustion, silent breath sounds, or inability to speak",
      "Rapid pulmonary-function decline, new unilateral finding, or suspected infection"
    ], [
      "Explain that asbestosis is diffuse lung scarring from prior fiber exposure, while asbestos can also cause pleural disease, lung cancer, or mesothelioma after a long latency.",
      "Teach complete smoking cessation and avoidance of further dust exposure because tobacco greatly compounds lung-cancer risk and can worsen respiratory reserve in asbestos-exposed lungs."
    ]),
    card("Ascites", ["w33d-ascites"], [
      "Assess ascites onset, liver and cardiac history, abdominal girth, weight, edema, dyspnea, hernias, pain, fever, tenderness, bleeding, and confusion because the cause and complications determine urgency.",
      "Trend daily weight, abdominal girth, intake and output, sodium, potassium, creatinine, blood pressure, and mental status because excessive diuresis can reduce effective circulation while undertreatment worsens fluid burden.",
      "Administer prescribed diuretics, maintain the individualized sodium and fluid plan, and monitor orthostasis because cirrhotic sodium retention drives ascites but overly rapid volume loss can precipitate kidney injury.",
      "Prepare for diagnostic paracentesis with new, hospitalized, or clinically worsening cirrhotic ascites and monitor the puncture site and hemodynamics because spontaneous bacterial peritonitis may present subtly.",
      "Escalate for fever, abdominal tenderness, new confusion, gastrointestinal bleeding, hypotension, oliguria, rising creatinine, severe dyspnea, or a painful irreducible hernia because infection or organ decompensation may be present."
    ], [
      "Fever, abdominal tenderness, rebound, new confusion, or unexplained kidney injury",
      "Hematemesis, melena, hypotension, syncope, or rapidly falling hemoglobin",
      "Oliguria, rising creatinine, severe hyponatremia, or persistent hypotension",
      "Respiratory compromise, tense painful abdomen, or incarcerated umbilical hernia"
    ], [
      "Explain that cirrhotic ascites reflects portal pressure, vasodilation, and kidney sodium retention, so removing visible fluid alone does not correct the underlying circulatory problem.",
      "Teach daily weights, the prescribed sodium plan, medication adherence, and urgent reporting of fever, increasing pain, confusion, bleeding, reduced urine, or rapid weight gain."
    ]),
    card("AV fistula infection", ["w33d-access"], [
      "Inspect the AV fistula before every use for redness, warmth, swelling, tenderness, drainage, skin breakdown, aneurysmal change, and track marks because localized infection can seed the bloodstream.",
      "Palpate the thrill and auscultate the bruit while assessing hand perfusion, edema, fever, chills, and hemodynamics because infection, thrombosis, stenosis, steal, and pseudoaneurysm can coexist.",
      "Obtain ordered blood and drainage cultures before antibiotics when this does not delay sepsis treatment because microbiologic identification guides therapy and evaluation for metastatic infection.",
      "Administer prescribed antibiotics and coordinate nephrology, surgery, and an alternative dialysis-access plan before cannulating suspicious tissue because infected or structurally weak fistula segments may rupture or fail.",
      "Activate emergency care for sepsis, absent thrill, rapidly expanding swelling, brisk fistula bleeding, distal ischemia, or suspected endocarditis because access infection can threaten life, limb, and dialysis continuity."
    ], [
      "Fever or rigors with hypotension, confusion, tachycardia, or rising lactate",
      "Absent thrill or bruit, sudden access dysfunction, or acute arm swelling",
      "Brisk bleeding, expanding pseudoaneurysm, thinning shiny skin, or exposed graft material",
      "Cold painful hand, sensory loss, weakness, chest pain, or new cardiac murmur"
    ], [
      "Teach patients to wash the access arm, check the thrill and skin every day, and report warmth, drainage, swelling, fever, a weaker vibration, or prolonged bleeding immediately.",
      "Explain that blood pressure cuffs, venipuncture, tight clothing, scratching, and sleeping on the access arm can damage flow or skin defenses and increase complications."
    ]),
    card("Benign prostatic hyperplasia", ["w33d-bph"], [
      "Assess weak stream, hesitancy, intermittency, nocturia, urgency, incomplete emptying, retention, hematuria, fever, medications, constipation, and neurologic symptoms because lower-urinary-tract symptoms are not specific to BPH.",
      "Track voiding frequency, measured urine output, postvoid residual, suprapubic distention, urinalysis, and creatinine because progressive bladder outlet obstruction can cause infection, hydronephrosis, and kidney injury.",
      "Administer prescribed alpha blocker or five-alpha-reductase inhibitor and monitor orthostatic blood pressure, dizziness, and sexual effects because smooth-muscle relaxation acts quickly while prostate shrinkage takes months.",
      "Prepare catheter drainage for painful acute retention and trend subsequent urine output, blood pressure, sodium, and potassium because relief of longstanding obstruction can trigger clinically important postobstructive diuresis.",
      "Escalate for inability to void with suprapubic pain, fever with obstruction, gross hematuria and clots, new renal failure, saddle anesthesia, or leg weakness because urgent decompression or an alternative diagnosis is possible."
    ], [
      "Painful inability to void with a distended palpable bladder",
      "Fever, rigors, flank pain, hypotension, or confusion with urinary obstruction",
      "Gross hematuria with clots, falling hemoglobin, or catheter blockage",
      "Rising creatinine, hydronephrosis, saddle anesthesia, or new leg weakness"
    ], [
      "Explain that BPH is noncancerous growth around the urethra, but similar urinary symptoms can come from infection, medication effects, bladder dysfunction, stricture, or cancer.",
      "Teach timed voiding, avoiding constipation, moderating evening fluid, caffeine, and alcohol, and checking before using decongestants or antihistamines that can worsen retention."
    ]),
    card("Cardiomyopathy", ["w33d-cardiomyopathy"], [
      "Assess cardiomyopathy phenotype, family history, exertional dyspnea, chest pain, syncope, palpitations, edema, orthopnea, murmurs, and recent infection or toxin exposure because mechanisms and risks differ substantially.",
      "Trend telemetry, heart rate, blood pressure, oxygenation, daily weight, intake and output, electrolytes, renal function, congestion, and perfusion because cardiomyopathy can cause both heart failure and malignant arrhythmia.",
      "Administer phenotype-specific heart-failure, rhythm, anticoagulation, or diuretic therapy as prescribed while monitoring response because treatment that benefits one cardiomyopathy may worsen obstruction or hypotension in another.",
      "Maintain the individualized activity, fluid, sodium, pregnancy, and device plan because safe exertion and volume goals depend on ventricular function, outflow obstruction, arrhythmic risk, and symptoms.",
      "Activate emergency care for exertional syncope, sustained dysrhythmia, chest pain, acute pulmonary edema, new neurologic deficit, or shock because cardiomyopathy can deteriorate through sudden cardiac or embolic events."
    ], [
      "Exertional syncope, aborted cardiac arrest, or sustained ventricular dysrhythmia",
      "Acute pulmonary edema, severe dyspnea, hypoxemia, or pink frothy sputum",
      "Chest pain with ischemic ECG change, hypotension, or poor perfusion",
      "New focal neurologic deficit, rapid atrial fibrillation, or systemic embolic signs"
    ], [
      "Explain that cardiomyopathy describes abnormal heart muscle, but dilated, hypertrophic, restrictive, arrhythmogenic, and infiltrative forms behave differently and therefore need phenotype-specific advice.",
      "Teach daily symptom and weight monitoring, medication adherence, safe-activity limits, and family screening or genetic counseling when recommended because some cardiomyopathies are inherited before symptoms appear."
    ]),
    card("Catheter-associated UTI", ["w33d-cauti", "w33d-cauti-stewardship"], [
      "Assess ongoing catheter necessity, fever, suprapubic or flank pain, costovertebral tenderness, hemodynamics, obstruction, and alternative causes of delirium because bacteriuria alone does not establish symptomatic CAUTI.",
      "Maintain a closed drainage system, secure the catheter, keep tubing unobstructed and the bag below bladder level, and perform routine hygiene because breaks and urinary stasis promote ascending infection.",
      "Remove the catheter promptly or use an appropriate alternative when the indication ends because infection risk rises with every additional catheter day and antibiotics cannot eliminate biofilm reliably.",
      "Collect an indicated urine culture aseptically from the sampling port or newly replaced catheter, never the drainage bag, because contaminated specimens drive unnecessary or misdirected antibiotic treatment.",
      "Administer culture-directed antibiotics for symptomatic infection and escalate for hypotension, rising lactate, rigors, flank pain, obstruction, or anuria because CAUTI can progress to pyelonephritis, bacteremia, and sepsis."
    ], [
      "Hypotension, rising lactate, rigors, confusion, or other sepsis findings",
      "Flank pain, costovertebral tenderness, persistent fever, or vomiting",
      "Blocked catheter with suprapubic distention, leakage, oliguria, or anuria",
      "Gross hematuria, traumatic catheter displacement, or rapidly worsening kidney function"
    ], [
      "Explain that bacteria commonly colonize long-term catheters without causing infection, so urine odor or cloudiness alone usually should not trigger a culture or antibiotics.",
      "Teach patients to keep tubing unkinked and the bag below the bladder, avoid disconnecting the system, maintain hydration when allowed, and report fever, pain, or stopped flow."
    ]),
    card("Cryptorchidism", ["w33d-cryptorchidism"], [
      "Assess whether each testis is palpable, its scrotal or inguinal position, symmetry, hernia, hypospadias, gestational age, and prior documented descent because congenital, acquired, retractile, and absent testes differ.",
      "Document testicular position at routine examinations and monitor retractile testes for secondary ascent because a previously scrotal testis can later become persistently extrascrotal as the child grows.",
      "Coordinate pediatric surgical or urologic referral when a testis remains undescended at six months corrected age because later spontaneous descent is unlikely and prolonged heat exposure harms germ cells.",
      "Monitor postoperative pain, swelling, fever, wound drainage, scrotal position, color, and perfusion because orchiopexy can be complicated by infection, re-ascent, torsion, or testicular atrophy.",
      "Escalate immediately for bilateral nonpalpable testes in a newborn, ambiguous genital findings, acute groin or scrotal pain with vomiting, or a cold discolored postoperative testis because endocrine emergency or torsion is possible."
    ], [
      "Bilateral nonpalpable testes in a newborn, especially with atypical genital findings",
      "Sudden groin or scrotal pain, vomiting, high-riding testis, or marked swelling",
      "Cold, dusky, severely painful, or rapidly enlarging scrotum after orchiopexy",
      "Fever, purulent drainage, wound separation, or progressive postoperative redness"
    ], [
      "Explain that waiting beyond six months rarely produces spontaneous descent and may reduce future fertility potential, while timely orchiopexy also makes examination and surveillance easier.",
      "Teach families that surgery lowers but does not erase later malignancy risk, so recommended follow-up and age-appropriate testicular self-awareness after puberty remain important."
    ]),
    card("Dialysis hypotension", ["w33d-dialysis-hypotension"], [
      "Assess predialysis weight, blood pressure, target weight, recent intake, vomiting, diarrhea, fever, bleeding, cardiac function, medications, and prior episodes because dialysis hypotension has multiple interacting causes.",
      "Trend blood pressure, heart rate, rhythm, symptoms, mental status, ultrafiltration rate, and treatment progress because falling intravascular volume may exceed vascular and cardiac compensatory capacity.",
      "Position the patient supine with legs elevated when appropriate, reduce or stop ultrafiltration, and give protocol saline because restoring effective circulating volume usually reverses symptomatic intradialytic hypotension.",
      "Coordinate reassessment of target weight, interdialytic gain, treatment duration, dialysate settings, meal timing, and antihypertensive timing because recurrent episodes require prescription-level prevention rather than repeated rescue alone.",
      "Escalate for persistent systolic pressure below 90 mmHg with symptoms, chest pain, sustained dysrhythmia, syncope, focal neurologic change, or shock because myocardial or cerebral ischemia and occult sepsis or bleeding may be present."
    ], [
      "Persistent symptomatic systolic blood pressure below 90 mmHg despite initial measures",
      "Chest pain, ischemic ECG change, sustained dysrhythmia, or severe dyspnea",
      "Syncope, seizure, focal neurologic deficit, or prolonged altered mental status",
      "Fever, bleeding, refractory shock, or new severe abdominal or back pain"
    ], [
      "Explain that dialysis removes fluid from blood faster than tissue can sometimes refill it, especially with large gains, short treatments, illness, meals, or limited cardiac reserve.",
      "Teach patients to follow individualized sodium and fluid goals, report cramps or dizziness promptly, and confirm medication and meal timing with the dialysis team rather than changing them independently."
    ]),
    card("Fibrosis", ["w33d-fibroblast"], [
      "Assess which organ is fibrotic, the ongoing inflammatory, toxic, infectious, metabolic, autoimmune, or mechanical driver, and baseline function because fibrosis is a repair response rather than one uniform disease.",
      "Trend organ-specific function, symptoms, imaging, laboratory markers, oxygenation, exercise tolerance, and treatment toxicity because extracellular-matrix accumulation gradually reduces functional reserve before overt failure appears.",
      "Administer prescribed anti-inflammatory, antiviral, immunomodulatory, or organ-specific antifibrotic therapy and verify monitoring because reducing continued injury may slow fibrosis even when established scar cannot be fully reversed.",
      "Coordinate specialist evaluation when biopsy, elastography, pulmonary testing, echocardiography, or renal assessment is needed because fibrosis severity and activity cannot be inferred reliably from symptoms alone.",
      "Escalate for acute hypoxemia, jaundice with confusion, rapidly falling urine output, pulmonary edema, syncope, or severe portal-hypertension bleeding because limited fibrotic-organ reserve can decompensate abruptly."
    ], [
      "Acute hypoxemia, respiratory exhaustion, or rapidly increasing oxygen requirement",
      "Jaundice with confusion, hematemesis, melena, tense ascites, or shock",
      "Oliguria, severe electrolyte disturbance, uremic symptoms, or rapidly rising creatinine",
      "Pulmonary edema, syncope, sustained dysrhythmia, or worsening low-output signs"
    ], [
      "Explain that fibrosis occurs when repair signals keep fibroblasts producing extracellular matrix after injury should have resolved, replacing flexible working tissue with stiff scar.",
      "Teach that prognosis and treatment depend on the affected organ and active cause, so avoiding the injuring exposure and completing disease-specific monitoring matter more than the word fibrosis alone."
    ]),
    card("Henoch-Schonlein purpura", ["w33d-iga-vasculitis"], [
      "Assess palpable purpura, abdominal pain, joint swelling, scrotal pain, edema, stool or urine blood, recent infection, and blood pressure because IgA vasculitis affects small vessels across several organs.",
      "Trend urinalysis, urine protein, creatinine, estimated GFR, edema, and blood pressure for at least six months as directed because kidney involvement can appear after the rash and other symptoms resolve.",
      "Monitor colicky abdominal pain, vomiting, distention, bowel sounds, and bloody stool because intestinal edema and bleeding can progress to intussusception or ischemic compromise.",
      "Administer prescribed analgesia or corticosteroid therapy and avoid NSAIDs when kidney function or gastrointestinal bleeding is involved because common pain medicines can worsen renal perfusion or bleeding.",
      "Escalate for severe intermittent abdominal pain, currant-jelly stool, oliguria, marked hypertension, seizure, pulmonary symptoms, or acute scrotal pain because bowel, kidney, neurologic, lung, or testicular complications require urgent evaluation."
    ], [
      "Severe colicky abdominal pain, bilious vomiting, distention, or bloody stool",
      "Oliguria, gross hematuria, rapidly increasing proteinuria, edema, or hypertension",
      "Seizure, severe headache, focal neurologic change, or altered consciousness",
      "Hemoptysis, respiratory distress, or sudden scrotal pain and swelling"
    ], [
      "Explain that Henoch-Schonlein purpura is now called IgA vasculitis because IgA-driven small-vessel inflammation connects the rash with joint, bowel, and kidney findings.",
      "Teach families to attend urine and blood-pressure follow-up even after the rash disappears and to seek urgent care for severe abdominal pain, bloody stool, reduced urine, swelling, or headache."
    ]),
    card("Hypermagnesemia", ["w33d-hypermagnesemia"], [
      "Assess kidney function, magnesium infusions, laxatives, antacids, supplements, bowel disease, blood pressure, respiratory rate, strength, and deep-tendon reflexes because impaired excretion or excess exposure causes toxicity.",
      "Stop magnesium-containing products and verify all medication sources because continued administration can deepen neuromuscular blockade, vasodilation, hypotension, and cardiac conduction delay.",
      "Trend serum magnesium, calcium, potassium, creatinine, ECG intervals, blood pressure, respirations, mental status, and reflexes because clinical toxicity follows both concentration and the patient's renal reserve.",
      "Administer prescribed intravenous calcium for serious neuromuscular or cardiac effects and prepare diuresis or dialysis when indicated because calcium antagonizes membrane effects while renal removal lowers the magnesium burden.",
      "Activate emergency care for absent reflexes, respiratory depression, progressive hypotension, bradycardia, heart block, severe weakness, or unresponsiveness because advanced hypermagnesemia can cause paralysis and cardiac arrest."
    ], [
      "Absent deep-tendon reflexes with progressive weakness or somnolence",
      "Respiratory depression, apnea, hypoxemia, or inability to protect the airway",
      "Persistent hypotension, severe bradycardia, heart block, or widened QRS",
      "Oliguria or anuria with a rapidly rising magnesium concentration"
    ], [
      "Explain that healthy kidneys usually remove excess magnesium, so kidney failure turns seemingly routine laxatives, antacids, supplements, or infusions into potential sources of toxicity.",
      "Teach patients with kidney disease to check every over-the-counter product for magnesium and ask their renal team before using supplements, bowel preparations, antacids, or laxatives."
    ]),
    card("Hyperthyroidism", ["w33d-hyperthyroidism"], [
      "Assess weight loss, heat intolerance, tremor, goiter, eye findings, diarrhea, muscle weakness, pregnancy status, medication exposure, chest pain, palpitations, and heart failure because thyrotoxicosis accelerates multiple systems.",
      "Trend temperature, heart rate, rhythm, blood pressure, weight, mental status, thyroid tests, and prescribed blood-count or liver monitoring because disease severity and antithyroid toxicity may evolve independently.",
      "Administer prescribed antithyroid and beta-blocking therapy on schedule while checking contraindications because hormone-synthesis control acts gradually while adrenergic symptom control reduces immediate cardiac stress.",
      "Maintain a cool low-stimulation environment, hydration, nutrition, rest, and eye protection when needed because hypermetabolism increases heat, fluid, calorie, sleep, and corneal-exposure burdens.",
      "Activate emergency care for high fever, marked tachycardia or dysrhythmia, delirium, repeated vomiting, severe diarrhea, jaundice, or acute heart failure because thyroid storm carries rapid multisystem mortality."
    ], [
      "High fever with marked tachycardia, agitation, delirium, or coma",
      "Atrial fibrillation with instability, chest pain, pulmonary edema, or shock",
      "Sore throat or fever during antithyroid therapy with suspected agranulocytosis",
      "Jaundice, dark urine, severe abdominal pain, or suspected liver injury"
    ], [
      "Explain that hyperthyroidism means tissues are exposed to excessive thyroid-hormone action, so symptoms can persist while stored hormone clears even after new synthesis is blocked.",
      "Teach patients taking antithyroid medicine to seek same-day assessment for fever or sore throat and urgent evaluation for jaundice, dark urine, chest pain, fainting, or severe breathlessness."
    ]),
    card("Kussmaul respirations", ["w33d-acidbase", "w33d-anion-gap"], [
      "Assess the deep rapid Kussmaul pattern, airway patency, breath sounds, glucose, ketones, pH, bicarbonate, anion gap, lactate, renal function, and toxin risk because it signals compensatory ventilation for metabolic acidosis.",
      "Trend respiratory rate and depth, work of breathing, mental status, pH, PaCO2, bicarbonate, potassium, glucose, ketones, and perfusion because slowing may indicate recovery or dangerous respiratory fatigue.",
      "Maintain the patient's spontaneous Kussmaul ventilation, position for airway support, and provide oxygen when hypoxemic because suppressing compensatory carbon-dioxide removal can abruptly worsen acidemia.",
      "Administer protocol fluids, insulin, potassium management, antidote, antibiotics, or dialysis according to the identified cause because Kussmaul respirations are a physiologic response rather than the disease itself.",
      "Activate emergency care for decreasing respiratory effort with persistent acidemia, inability to protect the airway, hypoxemia, shock, seizure, or severe potassium-related ECG changes because compensation is failing."
    ], [
      "Slowing or irregular respirations while pH and bicarbonate remain severely low",
      "Exhaustion, inability to protect the airway, hypoxemia, or apnea",
      "Shock, rising lactate, severe dehydration, or rapidly decreasing consciousness",
      "Potassium-related ECG changes, seizure, or suspected toxic ingestion"
    ], [
      "Explain that Kussmaul breathing is the body's attempt to remove carbon dioxide and raise pH during severe metabolic acidosis; it is not simply anxiety or fast breathing.",
      "Teach people with diabetes to follow sick-day glucose and ketone instructions and seek urgent care for deep labored breathing, persistent vomiting, abdominal pain, confusion, or inability to drink."
    ]),
    card("Microthrombi", ["w33d-tma"], [
      "Assess new neurologic, renal, cardiac, abdominal, skin, pregnancy-related, infectious, medication, bleeding, and thrombotic findings because microthrombi can cause simultaneous small-vessel ischemia and platelet consumption.",
      "Trend platelet count, hemoglobin, smear schistocytes, LDH, haptoglobin, bilirubin, creatinine, urine output, troponin, coagulation studies, and mental status because patterns distinguish thrombotic microangiopathy from other consumptive syndromes.",
      "Implement bleeding precautions and clarify platelet transfusion with hematology unless hemorrhage is life-threatening because thrombocytopenia coexists with active microvascular thrombosis in several microthrombotic disorders.",
      "Prepare urgent plasma exchange and syndrome-specific therapy when TTP is suspected while confirmatory testing proceeds because treatment delay permits irreversible cerebral, cardiac, and renal ischemia.",
      "Escalate immediately for focal neurologic deficit, seizure, chest pain, severe hypertension, oliguria, rapidly falling platelets, or active bleeding because organ-threatening microthrombi require emergency specialist management."
    ], [
      "New focal deficit, seizure, severe confusion, coma, or sudden severe headache",
      "Chest pain, troponin rise, sustained dysrhythmia, syncope, or heart failure",
      "Oliguria, rapidly rising creatinine, severe hypertension, or gross hematuria",
      "Rapid platelet decline, schistocyte hemolysis, uncontrolled bleeding, or limb ischemia"
    ], [
      "Explain that microthrombi are tiny clots that obstruct small vessels, fragment passing red cells, consume platelets, and injure organs; the exact syndrome determines treatment.",
      "Teach patients with prior thrombotic microangiopathy to seek emergency care for new bruising, petechiae, fatigue, jaundice, confusion, headache, chest pain, or reduced urine because relapse can accelerate quickly."
    ]),
    card("Mixed acid-base disorders", ["w33d-acidbase", "w33d-abg", "w33d-anion-gap"], [
      "Assess pH, PaCO2, bicarbonate, sodium, chloride, albumin, anion gap, lactate, ketones, renal function, respiratory status, losses, and medications because opposing acid-base processes can produce a deceptively normal pH.",
      "Calculate expected respiratory or metabolic compensation and compare delta anion gap with delta bicarbonate because compensation outside the predicted range identifies an additional primary disturbance.",
      "Trend serial blood gases, electrolytes, anion gap, ventilation, hemodynamics, intake, output, and treatment timing because mixed acid-base components often improve at different rates.",
      "Administer cause-specific fluids, insulin, potassium, chloride, ventilation, diuresis, antidote, or dialysis as prescribed because treating one number without separating each process can worsen the other disturbance.",
      "Escalate for pH below 7.20 or above 7.60, respiratory exhaustion, shock, seizure, worsening mental status, or dysrhythmia because mixed acid-base disease can exhaust compensation despite a previously modest pH change."
    ], [
      "pH below 7.20 or above 7.60 with clinical deterioration",
      "Unexpected PaCO2 or bicarbonate indicating failed compensation or a new process",
      "Respiratory exhaustion, falling consciousness, inability to protect the airway, or hypoxemia",
      "Shock, rising lactate, seizure, severe electrolyte disturbance, or dysrhythmia"
    ], [
      "Explain that a normal pH can hide two dangerous problems pulling in opposite directions, such as vomiting-induced alkalosis occurring together with lactic or ketoacidosis.",
      "Teach that clinicians use compensation and delta comparisons to reveal hidden processes, but these calculations guide cause finding rather than replace examination, history, and repeated laboratory testing."
    ]),
    card("Nephron anatomy and segmental transport", ["w33d-renal-physiology"], [
      "Assess renal perfusion, urine volume and concentration, creatinine, edema, acid-base status, and medication exposures because nephron filtration and segmental transport work as an integrated sequence.",
      "Trend sodium, potassium, magnesium, bicarbonate, glucose, phosphate, osmolality, and urine findings because proximal, loop, distal, and collecting segments handle different solutes and water.",
      "Review where diuretics, sodium-glucose cotransporter inhibitors, acid-base drugs, and nephrotoxins act because segment-specific blockade predicts electrolyte loss, retention, or altered concentrating ability.",
      "Maintain individualized perfusion and hydration while avoiding unnecessary nephrotoxins because tubular transport requires oxygen and can fail when ischemia or toxic exposure injures nephron cells.",
      "Escalate for anuria, rapidly rising creatinine, severe potassium or sodium disturbance, pulmonary edema, profound acidosis, or uremic neurologic change because multiple nephron functions are failing."
    ], [
      "Anuria or rapidly falling urine output with rising creatinine",
      "Severe hyperkalemia or hypokalemia with weakness or ECG changes",
      "Symptomatic sodium disturbance, seizure, confusion, or rapid osmotic shift",
      "Pulmonary edema, refractory acidosis, pericarditic pain, or uremic encephalopathy"
    ], [
      "Explain that a nephron is a connected processing line: the glomerulus filters plasma, then successive tubular segments selectively reclaim or secrete water, electrolytes, nutrients, and acid.",
      "Teach that a normal-looking urine volume does not guarantee normal nephron function, because filtration, concentration, electrolyte control, and acid removal can fail in different combinations."
    ]),
    card("Osmotic diuresis", ["w33d-osmotic-diuresis", "w33d-renal-physiology"], [
      "Assess urine volume, thirst, orthostasis, weight change, glucose, ketones, mannitol or other osmotic agents, kidney function, and fluid access because nonreabsorbed tubular solute pulls water into urine.",
      "Trend hourly intake and output, weight, blood pressure, heart rate, sodium, potassium, magnesium, glucose, creatinine, and osmolality because osmotic diuresis can produce rapid volume and electrolyte shifts.",
      "Replace prescribed fluid and electrolytes in measured response to ongoing losses because fixed replacement can either leave worsening dehydration or cause overload as osmotic diuresis resolves.",
      "Administer insulin for hyperglycemic osmotic diuresis or adjust the responsible osmotic medication with the prescriber because lowering filtered solute addresses the mechanism rather than urine volume alone.",
      "Escalate for hypotension, severe tachycardia, confusion, oliguria after marked polyuria, pulmonary edema, severe sodium or potassium change, or widening anion gap because perfusion or osmolality is becoming unstable."
    ], [
      "Hypotension, syncope, severe tachycardia, cool skin, or rising lactate",
      "Confusion, seizure, extreme thirst, or rapidly changing serum sodium",
      "Oliguria after sustained polyuria, rising creatinine, or worsening kidney injury",
      "Pulmonary edema, hypoxemia, potassium-related ECG change, or widening anion gap"
    ], [
      "Explain that osmotic diuresis occurs when retained urine solute holds water inside the tubule, so the body loses water and electrolytes even while urinating frequently.",
      "Teach patients with diabetes to monitor glucose and ketones during illness and seek urgent care for persistent vomiting, deep breathing, confusion, severe weakness, or inability to replace fluids."
    ]),
    card("Prerenal AKI", ["w33d-aki"], [
      "Assess vomiting, diarrhea, poor intake, bleeding, fever, sepsis, burns, heart failure, cirrhosis, medications, blood pressure, perfusion, and volume findings because prerenal AKI begins with inadequate effective kidney blood flow.",
      "Trend urine output, creatinine, BUN, blood pressure, mean arterial pressure, weight, lactate, electrolytes, lung sounds, and edema because restoring perfusion must be balanced against congestion and evolving intrinsic injury.",
      "Administer prescribed balanced crystalloid, blood products, antibiotics, or vasopressor according to the cause because hemorrhage, fluid loss, distributive shock, and low cardiac output require different perfusion rescue.",
      "Review nephrotoxins and medicines that alter renal autoregulation with the treating team because prolonged hypoperfusion plus medication stress can convert reversible prerenal dysfunction into tubular injury.",
      "Escalate for refractory hypotension, anuria, pulmonary edema, severe hyperkalemia, worsening acidosis, pericarditic pain, or encephalopathy because urgent critical care or dialysis assessment may be required."
    ], [
      "Refractory hypotension, rising lactate, altered mental status, or shock",
      "Anuria or rapidly falling urine output despite perfusion correction",
      "Severe hyperkalemia with ECG changes or refractory metabolic acidosis",
      "Pulmonary edema, pericarditic pain, seizure, or uremic encephalopathy"
    ], [
      "Explain that prerenal AKI means the kidneys initially receive too little effective blood flow; correcting the cause early can restore filtration before structural tubular damage develops.",
      "Teach patients to seek advice during vomiting, diarrhea, fever, poor intake, or bleeding and not to stop or restart blood-pressure, diuretic, or kidney-risk medicines without an individualized plan."
    ]),
    card("Starling forces", ["w33d-starling"], [
      "Assess edema distribution, ascites, lung sounds, jugular venous pressure, blood pressure, albumin, renal, cardiac, liver, inflammatory, and lymphatic findings because Starling forces describe several distinct routes to tissue fluid accumulation.",
      "Trend weight, intake and output, oxygenation, lung sounds, edema, abdominal girth, blood pressure, renal function, and albumin because hydrostatic, oncotic, permeability, and lymphatic changes evolve with treatment.",
      "Elevate edematous limbs, protect fragile skin, and apply prescribed compression only after arterial and cardiac assessment because reducing dependent hydrostatic pressure helps some edema but can harm unsuitable patients.",
      "Administer cause-directed diuretic, albumin, antibiotic, or cardiac therapy as prescribed and reassess perfusion because the same visible swelling can reflect opposite intravascular-volume states.",
      "Escalate for acute pulmonary edema, hypoxemia, tense ascites with compromise, hypotension, oliguria, rapidly spreading inflammatory edema, or unilateral painful swelling because Starling imbalance may accompany organ failure, sepsis, or thrombosis."
    ], [
      "Acute pulmonary edema, pink frothy sputum, hypoxemia, or severe respiratory distress",
      "Hypotension, oliguria, confusion, cool skin, or other poor-perfusion findings",
      "Tense ascites with respiratory compromise, severe pain, fever, or an irreducible hernia",
      "Sudden unilateral painful swelling, rapidly spreading edema, or suspected compartment syndrome"
    ], [
      "Explain that fluid leaves capillaries when outward hydrostatic pressure and permeability overcome inward protein-related oncotic pressure and lymphatic return; edema does not always mean excess bloodstream volume.",
      "Teach patients to follow the cause-specific sodium, fluid, compression, skin, and medication plan because treating all swelling with extra diuretic can worsen low effective circulation."
    ]),
    card("Substance use disorders", ["w33d-samhsa"], [
      "Assess substance, dose, route, timing, tolerance, withdrawal history, overdose, prescribed drugs, pregnancy, infection risk, trauma, mental health, and suicide risk because intoxication and withdrawal syndromes overlap but require different treatment.",
      "Monitor respiratory rate, oxygenation, consciousness, pupils, temperature, blood pressure, glucose, ECG, hydration, and a substance-appropriate withdrawal scale because deterioration can involve airway, seizures, dysrhythmia, or delirium.",
      "Administer naloxone for suspected opioid respiratory depression and protocol medication for alcohol or sedative withdrawal because immediate antidote and seizure prevention take priority over diagnostic certainty.",
      "Initiate nonstigmatizing motivational care and coordinate medication treatment, harm reduction, infection screening, and longitudinal follow-up because withdrawal management alone leaves high relapse and overdose risk.",
      "Activate emergency care for apnea, severe respiratory depression, seizure, delirium, hyperthermia, chest pain, sustained dysrhythmia, violent agitation, or suicidal intent because these are life-threatening substance-related complications."
    ], [
      "Apnea, slow or irregular breathing, cyanosis, pinpoint pupils, or unresponsiveness",
      "Seizure, delirium, hallucinations, severe agitation, or rapidly worsening confusion",
      "Hyperthermia, chest pain, severe hypertension, or sustained dysrhythmia",
      "Suicidal intent, violent behavior, pregnancy with withdrawal, or suspected severe infection"
    ], [
      "Explain that substance use disorder is a treatable chronic condition involving altered reward, stress, and control systems; recurrence signals a need to adjust care, not moral failure.",
      "Teach opioid-overdose recognition, rescue breathing, naloxone use, emergency calling, and avoiding solitary use because potency and tolerance can change unpredictably after abstinence or treatment interruption."
    ]),
    card("Tripod position", ["w33d-tripod"], [
      "Assess why the patient assumes tripod position, including respiratory rate, accessory-muscle use, speech, stridor, wheeze, breath sounds, chest symmetry, oxygenation, and mental status because the posture signals substantial breathing effort.",
      "Maintain the self-selected upright tripod position and avoid forcing the patient flat because bracing the arms can recruit accessory muscles and improve mechanical advantage during respiratory distress.",
      "Trend oxygen saturation, respiratory rate and depth, ability to speak, air movement, heart rate, blood pressure, and fatigue because apparent quieting may represent improvement or impending ventilatory failure.",
      "Administer cause-directed bronchodilator, epinephrine, oxygen, antibiotic, diuretic, or ventilatory support as prescribed because tripod position identifies severity but not asthma, obstruction, infection, edema, or another cause.",
      "Activate emergency airway support for stridor, silent chest, cyanosis, confusion, inability to speak, decreasing respiratory effort, or exhaustion because tripod compensation can fail abruptly."
    ], [
      "Stridor, drooling, muffled voice, inability to swallow, or suspected upper-airway obstruction",
      "Silent chest, cyanosis, severe hypoxemia, or rapidly increasing oxygen requirement",
      "Inability to speak, decreasing respiratory effort, exhaustion, or altered consciousness",
      "Unilateral absent breath sounds, hypotension, chest pain, or tracheal deviation"
    ], [
      "Explain that tripod position is an instinctive way to brace the shoulder girdle and recruit accessory breathing muscles; it is a severity clue, not a diagnosis.",
      "Teach patients with chronic lung or heart disease to follow their action plan and seek emergency help when tripod posture accompanies blue color, confusion, inability to speak, or rescue-treatment failure."
    ]),
    card("Uremia", ["w33d-uremia"], [
      "Assess nausea, anorexia, vomiting, pruritus, fatigue, confusion, asterixis, neuropathy, bleeding, edema, dyspnea, chest pain, and pericardial rub because retained uremic toxins affect nearly every system.",
      "Trend mental status, weight, intake and output, blood pressure, ECG, BUN, creatinine, potassium, bicarbonate, calcium, phosphate, hemoglobin, and bleeding because uremia coexists with dangerous volume, electrolyte, acid-base, and platelet dysfunction.",
      "Maintain the prescribed renal diet, fluid plan, medication adjustments, skin care, oral care, and bleeding precautions because reduced clearance changes nutrition, comfort, drug exposure, and hemostasis.",
      "Prepare dialysis for refractory hyperkalemia, acidosis, fluid overload, pericarditis, encephalopathy, or severe symptomatic uremia because kidney-replacement decisions depend on complications rather than one BUN threshold.",
      "Escalate for seizure, rapidly worsening confusion, pericarditic chest pain or rub, potassium-related ECG changes, severe hypoxemia, uncontrolled bleeding, or anuria because these findings can require urgent dialysis and critical support."
    ], [
      "Seizure, marked asterixis, delirium, coma, or rapidly worsening mental status",
      "Pericarditic chest pain, friction rub, hypotension, or suspected tamponade",
      "Hyperkalemic ECG change, sustained dysrhythmia, severe weakness, or bradycardia",
      "Pulmonary edema, severe hypoxemia, uncontrolled bleeding, or anuria"
    ], [
      "Explain that uremia is a clinical syndrome from many retained toxins and kidney-failure complications, not simply a high urea number; symptoms and organ effects drive urgency.",
      "Teach patients to report confusion, chest pain, severe itching, vomiting, bleeding, breathlessness, rapidly increasing weight, or reduced urine and to attend every dialysis and laboratory appointment."
    ]),
    card("Wound dehiscence", ["w33d-wound"], [
      "Inspect wound-edge separation, drainage amount and color, bulging, visible fascia or organs, erythema, necrosis, pain, fever, glucose, nutrition, and healing risks because dehiscence ranges from superficial failure to surgical emergency.",
      "Position to reduce tension, support the incision during movement or coughing, maintain nothing-by-mouth status when deep failure is suspected, and notify surgery because strain can extend fascial separation.",
      "Cover eviscerated organs with sterile saline-moistened dressings, avoid replacing or probing them, and prepare emergency surgery because exposed viscera can dry, contaminate, strangulate, or perforate.",
      "Monitor vital signs, pain, wound drainage, abdominal distention, bowel function, glucose, hemoglobin, and infection markers because hemorrhage, ileus, abscess, sepsis, and worsening separation may accompany wound failure.",
      "Activate immediate surgical response for fascial separation, evisceration, sudden salmon-colored drainage, rapidly enlarging bulge, peritonitis, or hemodynamic instability because deep dehiscence requires urgent operative assessment."
    ], [
      "Visible fascia or bowel, evisceration, or sudden enlarging incisional bulge",
      "Sudden large-volume serosanguineous drainage or rapidly separating wound edges",
      "Fever, purulent drainage, spreading erythema, necrosis, crepitus, or sepsis",
      "Peritonitis, bowel obstruction, uncontrolled bleeding, hypotension, or syncope"
    ], [
      "Explain that skin separation may be managed differently from fascial separation; visible deep tissue, a new bulge, or sudden drainage requires immediate surgical assessment rather than home dressing changes.",
      "Teach incision support, prescribed activity limits, glucose and nutrition goals, smoking cessation, and urgent reporting of fever, drainage, edge separation, bulging, or increasing pain."
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
  window.ANI_PATHOLOGY_NURSING_WAVE33_D = {
    schemaVersion: 1,
    version: VERSION,
    cohort: "D",
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
