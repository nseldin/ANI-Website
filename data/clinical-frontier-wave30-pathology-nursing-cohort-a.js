(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  const VERSION = "2026-07-18-wave30-pathology-nursing-a-1";
  const sources = [
    { id: "acc-hbp-2025", label: "ACC/AHA, 2025 High Blood Pressure Guideline", url: "https://www.acc.org/Guidelines/Guidelines/2025/08/14/14/02/high-blood-pressure-in-adults", note: "Supports accurate blood-pressure assessment, cardiovascular-risk reduction, medication monitoring, recognition of secondary causes, and escalation for acute target-organ injury." },
    { id: "acc-ccd-2023", label: "ACC/AHA Multisociety, 2023 Chronic Coronary Disease Guideline", url: "https://www.acc.org/Guidelines/Guidelines/2023/07/20/12/34/Chronic-Coronary-Disease", note: "Supports ischemic-symptom assessment, antianginal safety, secondary prevention, exercise and tobacco counseling, and urgent evaluation of unstable symptoms." },
    { id: "acc-valve-2020", label: "ACC/AHA, 2020 Valvular Heart Disease Guideline", url: "https://www.acc.org/Guidelines/Guidelines/2020/12/17/14/24/Valvular-Heart-Disease", note: "Supports symptom and rhythm surveillance, echocardiographic follow-up, hemodynamic assessment, and timely valve-team referral for progressive valve disease." },
    { id: "cdc-rheumatic-fever", label: "CDC, Clinical Guidance for Acute Rheumatic Fever", url: "https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/acute-rheumatic-fever.html", note: "Supports streptococcal-eradication and secondary-prophylaxis care, carditis assessment, and prevention of recurrent injury that worsens rheumatic valve disease." },
    { id: "acc-svt-2015", label: "ACC/AHA/HRS, 2015 Supraventricular Tachycardia Guideline", url: "https://www.acc.org/Guidelines/Guidelines/2015/09/23/09/23/Supraventricular-Tachycardia", note: "Supports rhythm identification, reversible-cause assessment, hemodynamic surveillance, medication safety, and urgent synchronized cardioversion when tachycardia causes instability." },
    { id: "acc-pad-2024", label: "ACC/AHA Multisociety, 2024 Lower-Extremity Peripheral Artery Disease Guideline", url: "https://www.acc.org/Guidelines/Hubs/Lower-Extremity-Peripheral-Artery-Disease", note: "Supports limb-perfusion and wound assessment, structured exercise, antithrombotic and risk-factor care, and urgent recognition of acute or chronic limb-threatening ischemia." },
    { id: "svs-buerger", label: "Society for Vascular Surgery, Buerger Disease", url: "https://vascular.org/your-vascular-health/vascular-conditions/buergers-disease", note: "Supports tobacco-exposure elimination, distal perfusion and tissue-loss surveillance, wound protection, and vascular referral for thromboangiitis obliterans." },
    { id: "isl-lymphedema-2023", label: "International Society of Lymphology, 2023 Peripheral Lymphedema Consensus", url: "https://journals.librarypublishing.arizona.edu/lymph/article/id/6372/", note: "Supports limb-volume and skin assessment, compression and exercise care, infection prevention, and specialist evaluation of progressive peripheral lymphedema." },
    { id: "acc-hf-2022", label: "AHA/ACC/HFSA, 2022 Heart Failure Guideline", url: "https://www.acc.org/Guidelines/Hubs/Heart-Failure", note: "Supports congestion and perfusion surveillance, evidence-based medication care, self-monitoring education, and escalation for acute decompensated heart failure." },
    { id: "ash-vte", label: "American Society of Hematology, Venous Thromboembolism Guidelines", url: "https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines", note: "Supports diagnostic risk assessment, anticoagulant care and bleeding surveillance, mobility planning, and urgent evaluation for thrombus extension or pulmonary embolism." },
    { id: "esc-pulmonary-hypertension-2022", label: "ESC/ERS, 2022 Pulmonary Hypertension Guideline", url: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Pulmonary-Hypertension", note: "Supports right-heart, oxygenation, volume and functional assessment, treatment of underlying lung disease, and escalation for right-ventricular failure or syncope." },
    { id: "ats-ipf", label: "ATS, Idiopathic Pulmonary Fibrosis Guideline Resources", url: "https://www.thoracic.org/statements/guideline-implementation-tools/idiopathic-pulmonary-fibrosis.php", note: "Supports diagnosis, antifibrotic and supportive care, oxygen and rehabilitation assessment, exacerbation recognition, and transplant-oriented referral in idiopathic pulmonary fibrosis." },
    { id: "cdc-influenza-clinical", label: "CDC, Influenza Clinical Guidance", url: "https://www.cdc.gov/flu/hcp/clinical-guidance/index.html", note: "Supports risk-stratified antiviral treatment, respiratory and hydration assessment, transmission precautions, and recognition of severe or complicated influenza." },
    { id: "cdc-legionella", label: "CDC, Clinical Guidance for Legionnaires Disease", url: "https://www.cdc.gov/legionella/hcp/clinical-guidance/index.html", note: "Supports diagnostic testing, appropriate antimicrobial treatment, exposure and public-health assessment, and surveillance for severe pneumonia and systemic complications." },
    { id: "idsa-cap", label: "ATS/IDSA, Community-Acquired Pneumonia Guideline", url: "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults/", note: "Supports pneumonia severity assessment, microbiologic testing and antibiotic decisions, clinical-stability monitoring, and reassessment for abscess or other complications when response is poor." },
    { id: "aasm-osa", label: "American Academy of Sleep Medicine, Clinical Practice Guidelines", url: "https://aasm.org/clinical-resources/practice-standards/practice-guidelines/", note: "Supports objective sleep evaluation, positive-airway-pressure therapy and adherence, perioperative risk recognition, and follow-up of obstructive sleep apnea symptoms." },
    { id: "ers-bronchiectasis", label: "European Respiratory Society, Adult Bronchiectasis Guideline", url: "https://publications.ersnet.org/content/erj/50/3/1700629", note: "Supports airway-clearance care, sputum-directed antimicrobial decisions, exacerbation monitoring, and evaluation of hemoptysis and respiratory deterioration in bronchiectasis." },
    { id: "bts-aspiration", label: "British Thoracic Society, Aspiration Pneumonia Clinical Statement", url: "https://www.brit-thoracic.org.uk/quality-improvement/clinical-statements/aspiration-pneumonia/", note: "Supports swallowing and oral-health assessment, oxygenation and infection surveillance, antimicrobial decisions, nutrition planning, and prevention of recurrent aspiration." },
    { id: "aha-resuscitation-2025", label: "American Heart Association, 2025 Special Circumstances of Resuscitation", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation", note: "Supports immediate airway and toxicologic emergencies, poison-center consultation, antidote-informed resuscitation, and advanced support for life-threatening exposure or obstruction." },
    { id: "hrsa-poison-help", label: "HRSA Poison Help, Poison Emergency Guidance", url: "https://poisonhelp.hrsa.gov/", note: "Supports immediate poison-center consultation, avoidance of unadvised home remedies, exposure-specific triage, and emergency escalation after suspected poisoning or overdose." },
    { id: "copdf-a1at", label: "COPD Foundation, Alpha-1 Antitrypsin Deficiency Clinical Practice Guideline", url: "https://journal.copdfoundation.org/jcopdf/id/1115/The-Diagnosis-and-Management-of-Alpha-1-Antitrypsin-Deficiency-in-the-Adult", note: "Supports genotype and lung-function evaluation, exposure avoidance, disease-specific therapy assessment, family testing, and surveillance for lung and liver complications." },
    { id: "acg-chronic-pancreatitis", label: "American College of Gastroenterology, Chronic Pancreatitis Guideline", url: "https://pubmed.ncbi.nlm.nih.gov/32022720/", note: "Supports cause assessment, pain and nutrition care, pancreatic-enzyme treatment, diabetes and bone surveillance, and intervention for obstructive or malignant complications." },
    { id: "aga-constipation", label: "AGA/ACG, Pharmacologic Management of Chronic Idiopathic Constipation", url: "https://gastro.org/clinical-guidance/pharmacological-management-of-chronic-idiopathic-constipation/", note: "Supports structured bowel assessment, evidence-based laxative selection, response and adverse-effect monitoring, and evaluation for alarm findings or obstruction." },
    { id: "idsa-diarrhea", label: "IDSA, Infectious Diarrhea Guideline", url: "https://www.idsociety.org/practice-guideline/infectious-diarrhea/", note: "Supports dehydration and severity assessment, selective stool testing, transmission prevention, antimicrobial stewardship, and escalation for sepsis or invasive disease." },
    { id: "ascrs-constipation", label: "American Society of Colon and Rectal Surgeons, 2024 Constipation Guideline", url: "https://fascrs.org/ascrs/media/files/2024-Constipation-CPG.pdf", note: "Supports examination for impaction and outlet dysfunction, stepwise bowel treatment, avoidance of injury during disimpaction, and referral for obstruction or refractory disease." },
    { id: "acg-hpylori-2024", label: "American College of Gastroenterology, 2024 H. pylori Guideline", url: "https://gi.org/journals-publications/ebgi/schoenfeld_sep2024/", note: "Supports indicated testing, effective eradication regimens, interaction and adherence counseling, and universal post-treatment confirmation of Helicobacter pylori eradication." },
    { id: "aasld-practice-guidelines", label: "AASLD, Practice Guidelines and Guidances", url: "https://www.aasld.org/practice-guidelines", note: "Supports assessment and management of alcohol-associated liver disease, steatotic liver disease, portal-hypertensive complications, hepatopulmonary syndrome, and hepatorenal syndrome." },
    { id: "acg-upper-gi-bleeding", label: "American College of Gastroenterology, Upper Gastrointestinal and Ulcer Bleeding Guideline", url: "https://pubmed.ncbi.nlm.nih.gov/33929377/", note: "Supports hemodynamic assessment, transfusion and endoscopy timing, medication care, and escalation for ongoing or recurrent upper gastrointestinal hemorrhage." },
    { id: "acg-alcohol-liver-2024", label: "American College of Gastroenterology, 2024 Alcohol-Associated Liver Disease Guideline", url: "https://gi.org/journals-publications/ebgi/jophlin_mar2024/", note: "Supports severity and infection assessment, nutrition and alcohol-use treatment, selected corticosteroid care, and surveillance for multiorgan complications of alcohol-associated hepatitis." },
    { id: "kdigo-aki", label: "KDIGO, Acute Kidney Injury Guideline", url: "https://kdigo.org/guidelines/acute-kidney-injury/", note: "Supports creatinine and urine-output staging, cause and volume assessment, nephrotoxin avoidance, medication adjustment, electrolyte monitoring, and kidney-replacement referral in acute kidney injury." },
    { id: "kdigo-ckd-2024", label: "KDIGO, 2024 Chronic Kidney Disease Guideline", url: "https://kdigo.org/guidelines/ckd-evaluation-and-management/", note: "Supports filtration and albuminuria risk assessment, kidney-protective treatment, medication safety, complication surveillance, education, and preparation for kidney failure care." },
    { id: "nice-iv-fluids", label: "NICE, Intravenous Fluid Therapy in Adults in Hospital", url: "https://www.nice.org.uk/guidance/cg174", note: "Supports clinical and laboratory volume assessment, individualized fluid prescription, repeated response evaluation, and prevention of under-resuscitation, edema, electrolyte injury, and fluid overload." },
    { id: "kdigo-adpkd-2025", label: "KDIGO, 2025 ADPKD Guideline", url: "https://kdigo.org/guidelines/autosomal-dominant-polycystic-kidney-disease-adpkd/", note: "Supports kidney and blood-pressure monitoring, progression-risk and treatment assessment, family counseling, and urgent recognition of cyst infection, hemorrhage, stones, and aneurysmal symptoms." },
    { id: "aha-renovascular", label: "American Heart Association, Revascularization for Renovascular Disease", url: "https://www.ahajournals.org/doi/10.1161/HYP.0000000000000216", note: "Supports clinical recognition of renovascular disease, optimized medical therapy, kidney and blood-pressure surveillance, and selective referral for high-risk renal artery stenosis syndromes." },
    { id: "aspen-malnutrition", label: "ASPEN, Malnutrition Clinical Resources", url: "https://www.nutritioncare.org/clinical-resources/malnutrition/", note: "Supports validated nutrition assessment, safe individualized repletion, electrolyte and refeeding surveillance, interdisciplinary care, and outcome monitoring for malnourished patients." },
    { id: "nhlbi-metabolic-syndrome", label: "NHLBI, Metabolic Syndrome", url: "https://www.nhlbi.nih.gov/health/metabolic-syndrome", note: "Supports identification of clustered cardiometabolic risks, blood-pressure, glucose, lipid and waist assessment, behavior change, and prevention of diabetes and vascular disease." },
    { id: "international-pressure-injury", label: "NPIAP/EPUAP/PPPIA, International Pressure Injury Guideline", url: "https://internationalguideline.com/", note: "Supports pressure-injury staging, risk and skin assessment, repositioning and support surfaces, offloading, moisture and nutrition care, and complication surveillance." },
    { id: "npiap-stages", label: "National Pressure Injury Advisory Panel, Pressure Injury Stages", url: "https://npiap.com/page/PressureInjuryStages", note: "Supports stage-specific terminology and tissue-depth recognition, including nonblanchable erythema, partial- and full-thickness loss, exposed structures, and obscured wound depth." },
    { id: "aba-burn-referral", label: "American Burn Association, Burn Patient Referral Guidelines", url: "https://ameriburn.org/resources/burnreferral/", note: "Supports burn-depth and area assessment, airway and perfusion priorities, analgesia and wound protection, and burn-center consultation for high-risk injury patterns." },
    { id: "aaos-fracture", label: "American Academy of Orthopaedic Surgeons, Clinical Practice Guidelines", url: "https://www.aaos.org/quality/quality-programs/clinical-practice-guidelines/", note: "Supports fracture stabilization, neurovascular assessment, pain and thrombosis prevention, perioperative care, and urgent response to open fracture or compartment syndrome." },
    { id: "acr-lupus-2025", label: "American College of Rheumatology, Systemic Lupus Erythematosus Guideline", url: "https://rheumatology.org/systemic-lupus-erythematosus-guideline", note: "Supports organ-specific disease assessment, hydroxychloroquine and immunosuppressive safety, infection and cardiovascular prevention, and urgent management of severe lupus manifestations." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const cards = [
    card("Atherosclerosis", ["acc-ccd-2023", "acc-pad-2024"], [
      "Assess exertional chest discomfort, focal neurologic symptoms, claudication, rest pain, wounds, pulses, bruits, and vascular risk factors because plaque may remain silent until it limits flow or ruptures in a coronary, cerebral, or limb artery.",
      "Trend blood pressure, heart rate, lipid and glucose results, kidney function, activity tolerance, distal perfusion, and any change in ischemic symptoms because worsening end-organ flow or uncontrolled risk factors increase infarction, stroke, and limb-loss risk.",
      "Administer prescribed statin, antiplatelet, antihypertensive, and glucose-lowering therapy while checking adherence, bleeding, muscle symptoms, liver concerns, pressure, and renal limits because risk reduction works only when treatment is both sustained and safe.",
      "Protect feet, inspect skin and footwear, promote prescribed walking and tobacco cessation, and avoid compressing a poorly perfused limb because repetitive injury may become an ulcer when arterial delivery cannot meet tissue demand.",
      "Activate emergency evaluation for new chest pressure, unilateral weakness or speech change, syncope, a suddenly cold painful pulseless limb, or rest pain with tissue loss because acute plaque disruption or thrombosis can irreversibly injure heart, brain, or limb within hours."
    ], [
      "New chest pressure, diaphoresis, dyspnea, or ischemic electrocardiographic change",
      "Sudden facial droop, arm weakness, speech change, vision loss, or severe imbalance",
      "Abrupt limb pain, pallor, coolness, paresthesia, weakness, or absent pulse",
      "Rest pain, nonhealing ulcer, gangrene, or rapidly declining walking distance"
    ], [
      "Explain that atherosclerosis affects the whole arterial system, so controlling tobacco exposure, pressure, cholesterol, glucose, sleep, and activity protects several organs at once.",
      "Teach the patient to call emergency services for new chest, stroke, or acute-limb symptoms rather than waiting to see whether the symptoms resolve."
    ]),
    card("Primary hypertension", ["acc-hbp-2025"], [
      "Measure blood pressure after quiet rest with a validated device, correct cuff, supported arm, and repeated readings because a single poorly obtained value can misclassify chronic pressure and lead to unsafe treatment decisions.",
      "Assess medication use, sodium and alcohol intake, sleep apnea symptoms, pain, nonprescription stimulants, kidney status, vision, neurologic findings, and cardiovascular risk because primary hypertension is usually asymptomatic while cumulative vascular injury progresses.",
      "Trend home and clinical pressure patterns, orthostatic symptoms, creatinine, potassium, glucose, lipids, urine albumin, and treatment adverse effects because control must protect brain, heart, kidney, and retina without causing falls or hypoperfusion.",
      "Administer and reconcile prescribed therapy, identify cost or access barriers, and connect each lifestyle change to the patient's risk because missed doses and an impractical plan commonly sustain hypertension even when the regimen is pharmacologically sound.",
      "Escalate immediately for severe pressure accompanied by focal deficit, confusion, seizure, vision loss, chest or tearing back pain, pulmonary edema, oliguria, or pregnancy-related severe symptoms because acute target-organ injury defines a hypertensive emergency rather than the number alone."
    ], [
      "Severe blood pressure with new focal neurologic deficit, seizure, or confusion",
      "Chest pressure, tearing back pain, syncope, or unequal pulses",
      "Acute dyspnea, crackles, hypoxemia, or frothy sputum",
      "Rapidly falling urine output, acute kidney injury, or severe symptoms during pregnancy"
    ], [
      "Teach a consistent home-measurement method and written log, including when to repeat a surprising reading and when symptoms require emergency care.",
      "Explain that treatment prevents silent organ damage even when the patient feels well, so medication should not be stopped simply because readings improve."
    ]),
    card("Secondary hypertension", ["acc-hbp-2025", "aha-renovascular"], [
      "Confirm persistent hypertension with accurate repeated or ambulatory measurements and compare the pattern with prior control because an abrupt, resistant, episodic, or unusually early presentation raises concern for a reversible driver.",
      "Review kidney disease, renal bruits, potassium, sleep apnea, endocrine symptoms, pregnancy, pain, alcohol or drug withdrawal, and medicines such as stimulants, decongestants, contraceptives, glucocorticoids, and NSAIDs because identifying the cause changes treatment.",
      "Collect timed renin, aldosterone, metanephrine, cortisol, thyroid, urine, or imaging studies exactly as instructed and document posture, medicines, and collection conditions because preparation errors can create misleading endocrine or renovascular results.",
      "Trend pressure, pulse, orthostasis, electrolytes, creatinine, urine output, and symptoms during cause-directed and antihypertensive therapy because correcting hormone, airway, medication, or renal mechanisms can rapidly alter volume and drug requirements.",
      "Escalate for severe pressure with neurologic change, chest or back pain, pulmonary edema, oliguria, hypokalemic dysrhythmia, or episodic headache with diaphoresis and marked tachycardia because target-organ injury or catecholamine crisis requires urgent controlled treatment."
    ], [
      "Resistant or abrupt hypertension with rapidly worsening kidney function",
      "Severe episodic headache, diaphoresis, palpitations, and extreme pressure",
      "New focal deficit, seizure, vision loss, chest pain, or pulmonary edema",
      "Profound hypokalemia, weakness, electrocardiographic change, or dysrhythmia"
    ], [
      "Ask the patient to bring every prescription, supplement, stimulant, and nonprescription product because an exposure that seems unrelated may be the treatable cause.",
      "Explain that testing conditions and medication instructions matter; the patient should clarify rather than independently stopping a drug before endocrine or renal testing."
    ]),
    card("Stable angina", ["acc-ccd-2023"], [
      "Characterize the exact activity threshold, pressure quality, radiation, duration, associated dyspnea, and relief with rest or prescribed nitrate because a predictable oxygen-demand pattern distinguishes stable symptoms from a new unstable syndrome.",
      "Obtain baseline and symptom vital signs and electrocardiography as directed, and trend frequency, severity, exercise tolerance, and nitrate use because angina occurring sooner, longer, or at rest can signal plaque instability or worsening obstruction.",
      "Stop exertion, position for comfort, administer prescribed sublingual nitrate, and reassess pain and blood pressure at the specified interval because nitrate can relieve demand ischemia but may cause dangerous hypotension, especially with phosphodiesterase-5 inhibitors.",
      "Give prescribed antiplatelet, statin, beta-blocker, or other antianginal therapy while monitoring pulse, pressure, bleeding, and adherence because symptom control and plaque-risk reduction address different parts of coronary disease.",
      "Call emergency services for pain at rest, a changed pattern, persistent pain after the prescribed nitrate plan, syncope, hypotension, new ST change, or acute heart-failure findings because these are no longer reassuring features of stable angina."
    ], [
      "Chest pressure at rest or with less activity than the established baseline",
      "Pain persisting after rest and the prescribed nitrate emergency plan",
      "Syncope, hypotension, diaphoresis, new dysrhythmia, or altered consciousness",
      "New ST-segment change, rising troponin, pulmonary edema, or severe dyspnea"
    ], [
      "Teach the patient to carry nitrate correctly, sit before using it, and follow the exact emergency-call plan rather than driving to care during persistent chest pain.",
      "Explain that predictable pain still reflects myocardial oxygen shortage; exercise, medication adherence, tobacco avoidance, and risk-factor control reduce future infarction risk."
    ]),
    card("Mitral valve prolapse", ["acc-valve-2020"], [
      "Assess palpitations, atypical or exertional chest symptoms, dyspnea, presyncope, fatigue, murmur change, and family history of sudden death because most prolapse is benign but regurgitation or ventricular arrhythmia changes risk.",
      "Trend heart rate and rhythm, blood pressure, lung sounds, activity tolerance, edema, and echocardiographic follow-up because increasing mitral regurgitation can enlarge the atrium and ventricle before obvious congestion develops.",
      "Correlate palpitations or syncope with electrocardiography or ordered ambulatory monitoring and record symptom timing because subjective skipped beats alone cannot distinguish benign ectopy from sustained tachyarrhythmia.",
      "Administer prescribed rate, rhythm, or congestion therapy while checking pulse, pressure, dizziness, electrolytes, and response because therapy may reduce symptoms yet worsen bradycardia or hypotension if not individualized.",
      "Escalate for syncope during exertion, sustained rapid rhythm, new pulmonary edema, hypotension, acute severe dyspnea, or abrupt chest symptoms because malignant arrhythmia or acute severe regurgitation requires urgent evaluation."
    ], [
      "Exertional syncope or presyncope with palpitations",
      "Sustained ventricular or supraventricular tachyarrhythmia",
      "Acute dyspnea, crackles, hypoxemia, or frothy sputum",
      "New severe regurgitant murmur, hypotension, or rapidly falling exercise tolerance"
    ], [
      "Explain that routine dental hygiene is important but antibiotic prophylaxis is not automatically required for uncomplicated mitral valve prolapse; the valve team should determine indications.",
      "Teach the patient to record palpitations with activity and associated dizziness or fainting because symptom-rhythm correlation guides whether further monitoring is needed."
    ]),
    card("Rheumatic heart disease", ["acc-valve-2020", "cdc-rheumatic-fever"], [
      "Assess dyspnea, orthopnea, exercise tolerance, edema, palpitations, hemoptysis, fever, murmur history, prior rheumatic fever, and prophylaxis adherence because chronic scarring most often produces mitral stenosis or regurgitation with atrial and pulmonary consequences.",
      "Trend rhythm, pulse, pressure, oxygenation, lung sounds, daily weight, edema, and signs of embolic neurologic injury because atrial fibrillation, pulmonary hypertension, congestion, and atrial thrombus are major routes to deterioration.",
      "Administer prescribed diuretic, rate-control, anticoagulant, and streptococcal secondary-prophylaxis therapy while monitoring renal function, electrolytes, pulse, and bleeding because each treatment prevents a different valve-related complication.",
      "Coordinate echocardiography, pregnancy planning, dental care, and valve-team follow-up because lesion severity, ventricular response, pulmonary pressure, and physiologic stress determine the safest timing of intervention.",
      "Escalate for new focal deficit, rapid atrial fibrillation with instability, acute pulmonary edema, syncope, hemoptysis with hypoxemia, fever with embolic or heart-failure findings, or shock because embolism, decompensated valve disease, or endocarditis may be present."
    ], [
      "New unilateral weakness, speech change, vision loss, or acute confusion",
      "Rapid irregular rhythm with hypotension, ischemic pain, or pulmonary edema",
      "Fever with a new murmur, petechiae, embolic findings, or worsening heart failure",
      "Syncope, severe hemoptysis, hypoxemia, or progressive right-heart congestion"
    ], [
      "Teach why scheduled antibiotic prophylaxis after rheumatic fever prevents new streptococcal-triggered immune injury rather than treating the existing scar.",
      "Explain that increasing breathlessness, palpitations, swelling, pregnancy, or planned procedures should prompt early valve-team contact because hemodynamic demands can expose limited valve reserve."
    ]),
    card("Tricuspid regurgitation", ["acc-valve-2020", "acc-hf-2022"], [
      "Assess jugular venous distention, hepatic fullness, ascites, edema, fatigue, appetite, weight trend, murmur, rhythm, and prior device or valve infection because backward right-sided flow raises systemic venous pressure and may reflect pulmonary or left-heart disease.",
      "Trend daily weight, intake and output, abdominal girth, edema, skin integrity, liver and kidney function, pressure, and orthostasis because congestion can impair organs while overly aggressive diuresis can reduce right-ventricular preload and perfusion.",
      "Administer prescribed diuretics and underlying pulmonary, rhythm, or left-heart therapy while monitoring potassium, magnesium, creatinine, pressure, and symptom response because lowering venous volume helps congestion only when electrolyte and renal injury are avoided.",
      "Protect edematous skin, elevate limbs when tolerated, provide sodium and fluid guidance, and coordinate nutrition because tense edema and ascites increase wound risk, early satiety, and functional decline.",
      "Escalate for hypotension, cool extremities, confusion, oliguria, rapidly increasing ascites, severe dyspnea, syncope, sustained tachyarrhythmia, fever with an intracardiac device, or worsening liver injury because low output, arrhythmia, or endocarditis can rapidly destabilize right-heart failure."
    ], [
      "Hypotension, cool mottled skin, altered mentation, or rapidly falling urine output",
      "New syncope, sustained tachyarrhythmia, or severe worsening dyspnea",
      "Rapid abdominal distention, tense ascites, jaundice, or worsening liver tests",
      "Fever or chills with a pacemaker lead, central device, or prior valve infection"
    ], [
      "Teach daily weight and swelling checks, including the individualized threshold for contacting the heart team before congestion becomes severe.",
      "Explain that tricuspid leakage often reflects pressure elsewhere in the heart or lungs, so treating the underlying cause is as important as removing excess fluid."
    ]),
    card("Sinus tachycardia", ["acc-svt-2015"], [
      "Confirm a regular sinus rhythm with a P wave before each QRS and compare the rate with symptoms because sinus tachycardia is usually a physiologic signal, whereas another narrow-complex rhythm may require different treatment.",
      "Assess temperature, pain, anxiety, oxygenation, volume loss, bleeding, infection, anemia, pregnancy, thyroid symptoms, stimulant exposure, withdrawal, pulmonary embolism, and heart failure because treating the driver is safer than reflexively suppressing a compensatory rate.",
      "Trend rate, rhythm, blood pressure, mental status, capillary refill, urine output, oxygen saturation, temperature, and relevant hemoglobin, lactate, electrolyte, or thyroid results because persistent tachycardia may be the earliest sign of shock or systemic illness.",
      "Provide cause-directed fluids, oxygen for hypoxemia, analgesia, fever control, or prescribed therapy and reassess the rate with perfusion because improvement after correcting the stressor confirms the heart is responding rather than creating the problem.",
      "Activate urgent evaluation for tachycardia with hypotension, ischemic chest pain, acute pulmonary edema, altered consciousness, syncope, major bleeding, sepsis findings, or a rate and rhythm inconsistent with sinus activation because instability or a primary tachyarrhythmia needs immediate treatment."
    ], [
      "Tachycardia with hypotension, altered consciousness, cool skin, or oliguria",
      "New ischemic chest pain, ST-segment change, or acute pulmonary edema",
      "Syncope or a sudden fixed-onset rhythm without normal sinus P-wave pattern",
      "Major bleeding, high fever with sepsis signs, severe hypoxemia, or suspected pulmonary embolism"
    ], [
      "Explain that sinus tachycardia is often the body's alarm for fever, dehydration, blood loss, pain, or low oxygen, so the cause matters more than the pulse number alone.",
      "Teach the patient to seek care for a persistent fast pulse accompanied by fainting, chest pain, breathlessness, bleeding, or infection symptoms rather than self-treating with another person's rate-control medicine."
    ]),
    card("Lymphedema", ["isl-lymphedema-2023"], [
      "Measure and compare limb circumference or volume, pitting, tissue texture, heaviness, range of motion, skin folds, wounds, and onset pattern because a documented baseline distinguishes chronic lymph stasis from sudden venous thrombosis, infection, or recurrent obstruction.",
      "Inspect the entire limb and interdigital spaces for fissures, fungal disease, warmth, erythema, drainage, and lymph leakage because protein-rich stagnant fluid weakens local defense and allows cellulitis to spread quickly.",
      "Apply prescribed compression only after arterial status and contraindications are assessed, verify gradient and fit, and recheck distal color, warmth, sensation, pain, and swelling because effective compression moves fluid while excessive or unsafe pressure can cause ischemic injury.",
      "Coordinate skin care, exercise with compression, elevation, manual lymphatic therapy, weight and mobility support, and garment replacement because repeated muscle pumping and barrier protection are required to control a chronic transport failure.",
      "Escalate for sudden unilateral swelling or pain, new dyspnea or chest pain, rapidly spreading erythema with fever, severe distal pain or numbness after compression, or new hard nodal or limb change because thrombosis, embolism, infection, ischemia, or malignant obstruction requires urgent evaluation."
    ], [
      "Sudden unilateral swelling, calf pain, cyanosis, or a marked departure from baseline",
      "Acute dyspnea, pleuritic chest pain, hemoptysis, syncope, or hypoxemia",
      "Rapidly spreading erythema, warmth, fever, chills, or systemic illness",
      "Cool pale digits, severe pain, numbness, or weakness after compression"
    ], [
      "Teach daily cleansing and moisturizing, careful nail and foot care, prompt treatment of small breaks, and avoidance of constrictive bands because skin injury can seed cellulitis.",
      "Explain that compression and movement control swelling rather than cure damaged lymphatics, so consistent correctly fitted use is more effective than applying extra pressure during a flare."
    ]),
    card("Intermittent claudication", ["acc-pad-2024"], [
      "Determine the walking distance and muscle group that reproducibly develops cramping, the rest time to relief, pulse pattern, skin temperature, wounds, and neurologic symptoms because fixed exertional ischemia must be distinguished from joint, spinal, and venous pain.",
      "Trend ankle-brachial or toe-pressure results when ordered, walking tolerance, distal pulses, capillary refill, foot temperature, and wound healing because declining function or tissue perfusion can mark progression toward chronic limb-threatening ischemia.",
      "Administer prescribed antiplatelet, statin, blood-pressure, diabetes, and symptom therapy while monitoring bleeding, muscle symptoms, pressure, glucose, and kidney function because cardiovascular-event prevention is as important as improving leg distance.",
      "Support structured walking to moderate claudication followed by rest, inspect footwear and feet, and reinforce complete tobacco cessation because repeated safe ischemic exercise improves efficiency while tobacco accelerates arterial narrowing.",
      "Escalate for pain at rest, a nonhealing ulcer, gangrene, sudden cold pallid weakness, absent prior pulse, or rapidly shortened walking distance because acute or chronic limb-threatening ischemia requires prompt vascular assessment."
    ], [
      "New rest pain, especially forefoot pain relieved by dependency",
      "Nonhealing ulcer, gangrene, drainage, or spreading foot infection",
      "Sudden limb pain, pallor, coolness, paresthesia, weakness, or absent pulse",
      "Rapid loss of walking tolerance or progressive tissue discoloration"
    ], [
      "Teach a structured walk-rest-walk plan and explain that supervised repetition builds collateral and muscular efficiency even though temporary exertional discomfort occurs.",
      "Tell the patient never to use heating pads on an ischemic foot and to report any blister or skin break early because reduced perfusion also reduces healing reserve."
    ]),
    card("Buerger disease", ["svs-buerger", "acc-pad-2024"], [
      "Assess all tobacco and nicotine exposure, cannabis smoking, distal pain, cold sensitivity, color change, pulses, ulcers, and prior amputations because thromboangiitis obliterans progresses with continued exposure and often injures small distal vessels in more than one limb.",
      "Trend finger and toe color, temperature, capillary refill, sensation, pain at rest, wound dimensions, and signs of infection because distal ischemia can advance from episodic symptoms to necrosis even when proximal pulses remain detectable.",
      "Protect extremities from cold, friction, pressure, burns, and constrictive devices, and use prescribed wound and pain care because poorly perfused tissue cannot tolerate minor trauma or temperature injury.",
      "Coordinate complete cessation of cigarettes, vaping, smokeless tobacco, nicotine replacement, and relevant inhaled exposures with a clinician-directed plan because even small ongoing exposure can sustain vascular inflammation and defeat limb-preservation efforts.",
      "Escalate immediately for sudden severe distal pain, new pallor or cyanosis, absent prior pulse, spreading infection, wet gangrene, fever, or rapidly advancing tissue loss because acute ischemia or infected necrosis threatens the digit, limb, and systemic stability."
    ], [
      "Sudden severe hand or foot pain with pallor, cyanosis, coolness, or pulse change",
      "Rapidly enlarging ulcer, black tissue, wet gangrene, or foul drainage",
      "Spreading erythema, fever, chills, hypotension, or altered mentation",
      "New weakness, numbness, or loss of function in an ischemic digit or limb"
    ], [
      "Explain plainly that complete exposure cessation is the treatment most likely to stop progression; cutting down or switching nicotine products does not reliably protect the vessels.",
      "Teach daily hand and foot inspection, protective footwear and gloves, and prompt reporting of blisters or color change because early injury may be painless yet difficult to heal."
    ]),
    card("Poisoning and overdose", ["aha-resuscitation-2025", "hrsa-poison-help"], [
      "Identify the substance, formulation, possible dose, route, time, co-exposures, container, symptoms, and intent while using exposure-appropriate staff protection because toxic effects and decontamination hazards depend on what entered the body and when.",
      "Assess airway patency, respiratory rate and depth, oxygenation, circulation, temperature, pupils, skin, bowel sounds, mental status, bedside glucose, electrocardiogram, and trauma risk because toxidromes can reveal life-threatening respiratory, cardiac, metabolic, or neurologic failure before a drug level returns.",
      "Contact Poison Help or the medical toxicology service early, preserve packaging, obtain recommended studies, and avoid unadvised emesis or neutralization because exposure-specific guidance prevents ineffective or harmful generic decontamination.",
      "Administer indicated antidote and supportive therapy while trending ventilation, rhythm, QRS and QT intervals, pressure, glucose, electrolytes, acid-base status, temperature, urine output, and recurrent symptoms because an initial response may wear off before the toxin clears.",
      "Activate resuscitation for apnea, severe hypoventilation, shock, seizure, dangerous dysrhythmia, hyperthermia, rapidly declining consciousness, significant caustic or inhalational injury, or intentional overdose with immediate self-harm risk because definitive airway, antidotal, cardiovascular, and psychiatric safety measures cannot wait."
    ], [
      "Apnea, slow or shallow breathing, cyanosis, falling oxygenation, or rising carbon dioxide",
      "Wide QRS, markedly prolonged QT, ventricular dysrhythmia, severe bradycardia, or shock",
      "Seizure, severe agitation with hyperthermia, coma, or rapidly declining consciousness",
      "Caustic exposure with drooling or stridor, inhalational injury, or intentional self-poisoning with ongoing access"
    ], [
      "Teach families to call Poison Help at 1-800-222-1222 immediately and not induce vomiting or give a home remedy unless a poison specialist directs it.",
      "After stabilization, use nonjudgmental safety planning, locked storage, medication reconciliation, and mental-health follow-up because preventing another exposure is part of treatment."
    ]),
    card("Post-MI heart failure", ["acc-hf-2022", "acc-ccd-2023"], [
      "Assess infarct location and timing, dyspnea, orthopnea, chest pain, fatigue, cool skin, crackles, jugular venous pressure, edema, new murmur, and urine output because necrotic myocardium may fail as a pump or develop a mechanical complication after infarction.",
      "Trend rhythm, blood pressure, oxygenation, lung sounds, daily weight, intake and output, kidney function, potassium, magnesium, troponin trend, and echocardiographic function because recurrent ischemia, dysrhythmia, congestion, and low output can overlap.",
      "Administer prescribed diuretic, beta-blocker, renin-angiotensin system, mineralocorticoid, SGLT2, antiplatelet, and lipid therapy while monitoring pressure, pulse, renal function, electrolytes, volume, and bleeding because post-infarct remodeling prevention must not worsen shock or kidney injury.",
      "Coordinate gradual cardiac rehabilitation, energy conservation, nutrition, medication access, and daily symptom tracking because supervised recovery improves function while avoiding excessive demand during vulnerable remodeling.",
      "Escalate for recurrent ischemic pain, new ST change, acute pulmonary edema, hypotension, cool mottled skin, oliguria, sustained ventricular rhythm, syncope, or a new harsh murmur because reinfarction, cardiogenic shock, or papillary, septal, or free-wall rupture may be occurring."
    ], [
      "Recurrent chest pressure with new electrocardiographic change or rising biomarkers",
      "Acute crackles, severe dyspnea, hypoxemia, or pink frothy sputum",
      "Hypotension, cool mottled skin, confusion, narrow pulse pressure, or oliguria",
      "New murmur, abrupt pulmonary edema, syncope, tamponade signs, or sustained ventricular dysrhythmia"
    ], [
      "Teach daily weight, breathing and swelling checks with the exact call threshold because early congestion can be treated before it requires hospitalization.",
      "Explain that symptom improvement does not mean the injured ventricle has fully healed; cardiac rehabilitation and disease-modifying medicines reduce remodeling and another event."
    ]),
    card("Thrombophlebitis", ["ash-vte"], [
      "Assess the location and length of tenderness, erythema, warmth, palpable cord, edema, provoking factors, catheter or varicose vein, cancer, pregnancy, prior thrombosis, and cardiopulmonary symptoms because superficial inflammation can coexist with or extend into deep veins.",
      "Measure and compare limb circumference, pulses, color, temperature, pain, and swelling, and coordinate duplex ultrasonography when indicated because examination alone cannot reliably exclude deep-vein extension.",
      "Administer prescribed anticoagulant, anti-inflammatory, compression, and mobility care after arterial safety is considered while monitoring bleeding, platelet count when relevant, renal function, skin, and symptom spread because treatment intensity depends on thrombus location and extension risk.",
      "Avoid massaging the affected vein, unnecessary bed rest, and pressure from poorly fitted devices; protect any catheter site because mechanical disruption or stasis can worsen thrombosis and tissue injury.",
      "Escalate immediately for sudden dyspnea, pleuritic chest pain, hemoptysis, syncope, hypoxemia, rapidly increasing limb swelling, proximal extension, phlegmasia, or major anticoagulant bleeding because pulmonary embolism, limb-threatening venous obstruction, or hemorrhage requires urgent treatment."
    ], [
      "Sudden dyspnea, pleuritic pain, hemoptysis, syncope, tachycardia, or hypoxemia",
      "Rapid whole-limb swelling, cyanosis, severe pain, sensory change, or impaired perfusion",
      "Erythema or tenderness extending toward a proximal deep-vein junction",
      "Melena, hematemesis, severe headache, hypotension, or uncontrolled bleeding during anticoagulation"
    ], [
      "Teach the patient to stay mobile as directed, use compression correctly, and avoid rubbing the vein because movement supports flow but massage does not dissolve a clot.",
      "Explain anticoagulant timing, interactions, missed-dose instructions, and bleeding warning signs so prevention of extension does not create an unrecognized hemorrhage."
    ]),
    card("Cor pulmonale", ["esc-pulmonary-hypertension-2022"], [
      "Assess the underlying lung or hypoxic disorder, dyspnea, oxygen use, sleep symptoms, chest pain, syncope, jugular venous distention, edema, hepatomegaly, weight, and functional decline because chronic pulmonary pressure overload eventually weakens the right ventricle.",
      "Trend oxygen saturation at rest and activity, respiratory effort, rhythm, blood pressure, daily weight, edema, intake and output, renal and liver function, and ordered echocardiographic or pulmonary-pressure findings because hypoxemia, congestion, and falling output interact.",
      "Administer prescribed oxygen to the individualized target, diuretics, inhaled therapy, and treatment of sleep-disordered breathing or thromboembolic disease while monitoring carbon dioxide risk, pressure, electrolytes, and kidney function because both untreated hypoxia and excessive volume removal can worsen right-heart performance.",
      "Use paced activity, pulmonary rehabilitation, sodium and fluid guidance, skin protection, vaccination, and smoking cessation because reducing pulmonary stress and preventing respiratory infection preserves limited cardiopulmonary reserve.",
      "Escalate for new syncope, chest pain, severe hypoxemia, rapidly rising oxygen need, hypotension, cool extremities, confusion, oliguria, sustained rhythm change, or abrupt edema and abdominal distention because acute right-ventricular failure can progress to shock."
    ], [
      "Syncope or chest pain during minimal exertion",
      "Severe hypoxemia or a rapid increase above baseline oxygen requirement",
      "Hypotension, cool skin, confusion, oliguria, or narrow pulse pressure",
      "Rapidly worsening edema, ascites, jugular venous distention, or sustained dysrhythmia"
    ], [
      "Teach the patient not to change oxygen or diuretic doses independently and to report a rapid weight or oxygen-requirement increase before severe right-heart congestion develops.",
      "Explain that protecting the lungs with tobacco avoidance, vaccines, prescribed ventilation, and rehabilitation also protects the right side of the heart."
    ]),
    card("Idiopathic pulmonary fibrosis", ["ats-ipf"], [
      "Establish the patient's resting and exertional oxygen saturation, respiratory rate, dry cough, crackles, clubbing, activity tolerance, weight, fatigue, and home-oxygen baseline, and obtain respiratory cultures when a new productive cough suggests infection because fibrosis progressively limits diffusion and a small change may signal major loss of reserve.",
      "Trend oxygen need during sleep, walking, and recovery, pulmonary-function and six-minute-walk results, weight, nutrition, and symptoms of pulmonary hypertension, and use telemetry when syncope or rhythm symptoms occur because progression affects gas exchange, function, and right-heart load.",
      "Administer prescribed antifibrotic and oxygen therapy while monitoring gastrointestinal effects, liver tests, bleeding, anticoagulant or antiplatelet exposure, device safety, and adherence because treatment can slow decline but requires toxicity management and does not reverse scar.",
      "Coordinate pulmonary rehabilitation, energy conservation, vaccination, reflux and aspiration risk care, palliative symptom support, and early transplant evaluation when appropriate because multidisciplinary planning preserves function and options before reserve becomes critically low.",
      "Escalate immediately for acute worsening over days, new fever, chest pain, hemoptysis, unilateral leg swelling, severe breathlessness, confusion, or a marked oxygen increase, and prepare for intubation and lung-protective ventilation when gas exchange fails because exacerbation, infection, pneumothorax, embolism, or cardiac failure can mimic disease progression."
    ], [
      "Rapid new breathlessness with a marked increase in oxygen requirement",
      "Severe hypoxemia, cyanosis, confusion, or inability to speak in full phrases",
      "Sudden pleuritic chest pain, unilateral breath-sound change, or hemoptysis",
      "Fever, purulent sputum, unilateral leg swelling, syncope, or new right-heart failure findings"
    ], [
      "Explain that antifibrotic medicine aims to slow further scarring rather than restore normal lung tissue, making consistent monitoring worthwhile even if symptoms remain.",
      "Teach oxygen fire safety, pacing and recovery breathing, and the exact change in saturation or oxygen use that should trigger a same-day call."
    ]),
    card("Influenza pneumonia", ["cdc-influenza-clinical", "idsa-cap"], [
      "Assess symptom onset, influenza exposure, vaccination, pregnancy, age, immune status, cardiopulmonary disease, work of breathing, hydration, cognition, and bacterial-superinfection clues because high-risk patients benefit from early antiviral care and can deteriorate after initial improvement.",
      "Initiate indicated Droplet and Standard Precautions and collect testing without delaying treatment in severe or high-risk illness because influenza spreads readily and a negative early test does not always outweigh a compelling clinical syndrome.",
      "Trend respiratory rate and effort, oxygen saturation, lung sounds, temperature, mental status, intake and output, lactate and organ function when ill, and response to oxygen because viral pneumonitis, secondary bacterial pneumonia, and sepsis can evolve quickly.",
      "Administer prescribed antiviral, oxygen, fluids, antipyretic, and antimicrobial therapy when bacterial infection is suspected while monitoring renal dosing, nausea, volume tolerance, cultures, and clinical response because supportive and cause-directed treatments have different safety limits.",
      "Escalate for exhaustion, apnea, severe hypoxemia, hypotension, confusion, cyanosis, oliguria, chest pain, hemoptysis, or fever and productive cough returning after improvement because respiratory failure, myocarditis, sepsis, or bacterial superinfection needs urgent management."
    ], [
      "Increasing work of breathing, exhaustion, apnea, cyanosis, or severe hypoxemia",
      "Hypotension, confusion, mottling, high lactate, or rapidly falling urine output",
      "Chest pain, new dysrhythmia, syncope, or heart-failure findings",
      "Recurrent fever with purulent sputum or focal consolidation after initial improvement"
    ], [
      "Teach cough etiquette, hand hygiene, isolation instructions, vaccination, and avoidance of high-risk contacts while contagious because preventing spread protects people most likely to develop severe disease.",
      "Explain that antiviral treatment is most effective when started early but may still be indicated later in severe or high-risk illness, so the patient should seek care promptly."
    ]),
    card("Legionnaires disease", ["cdc-legionella", "idsa-cap"], [
      "Assess severe pneumonia symptoms, diarrhea, confusion, relative bradycardia, smoking or lung disease, immune suppression, recent travel, hospital stay, and exposure to building water or aerosol devices because Legionella often causes systemic findings and may signal a shared water-source exposure.",
      "Obtain lower-respiratory culture or molecular testing and urine antigen as ordered before antibiotics when feasible, while documenting exposure location and dates, because culture detects species and enables public-health comparison that urine antigen alone cannot provide.",
      "Trend oxygenation, respiratory effort, temperature, mental status, blood pressure, urine output, sodium, kidney and liver function, creatine kinase, and inflammatory response because severe infection can cause hyponatremia, rhabdomyolysis, organ injury, and shock.",
      "Administer prescribed Legionella-active antibiotic, oxygen, and individualized fluids while checking QT risk, interactions, renal and hepatic dosing, and clinical response because delayed effective therapy worsens outcomes but treatment toxicity can compound organ dysfunction.",
      "Escalate for severe hypoxemia, rising oxygen need, hypotension, confusion, seizure, oliguria, marked hyponatremic symptoms, rapidly rising creatine kinase, or treatment nonresponse because respiratory failure, sepsis, electrolyte injury, or rhabdomyolysis needs critical care."
    ], [
      "Severe hypoxemia, exhaustion, or rapidly increasing oxygen or ventilatory support",
      "Hypotension, confusion, mottling, elevated lactate, or oliguria",
      "Seizure or encephalopathy with marked hyponatremia",
      "Severe muscle pain, dark urine, rising creatine kinase, or worsening kidney function"
    ], [
      "Explain that Legionnaires disease usually comes from inhaling contaminated water aerosols rather than routine person-to-person contact, so an accurate exposure history matters.",
      "Teach the patient to complete antibiotics and report recurrent fever, worsening breathing, confusion, low urine output, or severe muscle symptoms promptly."
    ]),
    card("Lung abscess", ["idsa-cap", "bts-aspiration"], [
      "Assess fever, night sweats, weight loss, pleuritic pain, foul or copious sputum, hemoptysis, dentition, swallowing, seizure, sedation, alcohol use, obstruction risk, and immune status because aspiration and poor source control commonly create localized necrosis.",
      "Collect blood and high-quality respiratory specimens when ordered and coordinate imaging while using safe sputum handling because organism and cavity features help distinguish abscess from empyema, tuberculosis, malignancy, or fungal disease.",
      "Trend temperature, respiratory effort, oxygenation, sputum volume and odor, hemoptysis, white count, inflammatory markers, weight, nutrition, and serial imaging response because clinical improvement often precedes slow radiographic resolution.",
      "Administer prolonged prescribed antimicrobial therapy, oral care, hydration, nutrition, and airway-clearance positioning only when safe while monitoring diarrhea, renal and hepatic function, aspiration, and medication response because eradication requires sustained treatment and drainage through a patent airway.",
      "Escalate for massive or increasing hemoptysis, severe hypoxemia, hypotension, confusion, new pleural findings, persistent sepsis, enlarging cavity, or failure to improve because hemorrhage, empyema, bronchopleural fistula, obstruction, or resistant infection may require drainage or surgery."
    ], [
      "Large-volume or increasing hemoptysis with airway or hemodynamic threat",
      "Severe hypoxemia, respiratory exhaustion, hypotension, or altered consciousness",
      "New pleuritic deterioration, absent breath sounds, or imaging evidence of empyema",
      "Persistent fever or enlarging cavity despite appropriately directed therapy"
    ], [
      "Teach meticulous oral care, aspiration precautions, and completion of the full antibiotic course because symptoms may improve before the cavity is sterilized.",
      "Explain that follow-up imaging matters to confirm resolution and exclude an obstructing tumor or foreign body, especially when recovery is incomplete."
    ]),
    card("Obstructive sleep apnea", ["aasm-osa"], [
      "Assess loud snoring, witnessed pauses or gasping, morning headache, nocturia, daytime sleepiness, driving risk, neck and airway features, resistant hypertension, atrial rhythm, heart failure, and sedative or opioid exposure because recurrent upper-airway collapse causes both immediate safety and cumulative cardiovascular harm.",
      "Review polysomnography or home-test severity, oxygen desaturation burden, sleep position, positive-airway-pressure data, mask leak, residual events, and adherence because hours of effective airway splinting matter more than simply owning a device.",
      "Fit and apply prescribed positive-airway-pressure therapy, humidification, and interface care while checking skin pressure, dryness, aerophagia, anxiety, and response because correct comfort troubleshooting improves nightly use and prevents device-related injury.",
      "Flag OSA before surgery, procedural sedation, and opioid administration, use ordered postoperative monitoring, positioning, and PAP, and avoid unobserved respiratory depressant stacking because anesthesia and opioids amplify airway collapse and blunt arousal.",
      "Escalate for difficult arousal, repeated apnea with bradycardia, severe desaturation despite PAP, chest pain, new dysrhythmia, acute neurologic deficit, or a near-miss while driving because uncontrolled hypoxemia or sleepiness creates immediate cardiopulmonary and public-safety risk."
    ], [
      "Difficult arousal, cyanosis, repeated apnea, or severe desaturation despite prescribed PAP",
      "Postoperative respiratory depression after opioid, sedative, or anesthetic exposure",
      "Chest pain, sustained dysrhythmia, syncope, or acute focal neurologic deficit",
      "Falling asleep while driving, a crash or near-miss, or uncontrollable daytime sleep attacks"
    ], [
      "Teach nightly PAP use during all sleep, routine equipment cleaning, and early mask-fit troubleshooting because partial-night or intermittent use leaves untreated periods of hypoxemia.",
      "Tell the patient not to drive when sleepy and to discuss alcohol, sedatives, opioids, weight, and nasal obstruction with the sleep team because each can worsen airway collapse."
    ]),
    card("Bronchiectasis", ["ers-bronchiectasis"], [
      "Establish baseline sputum volume and color, cough effectiveness, breathlessness, oxygenation, crackles, wheeze, hemoptysis, weight, exacerbation history, and prior organisms because daily airway damage and episodic infection require comparison with the patient's usual state.",
      "Obtain sputum culture before antibiotics when feasible and trend temperature, respiratory effort, oxygen need, inflammatory response, and culture history because resistant bacteria and nontuberculous mycobacteria can change the safest treatment.",
      "Teach and supervise the individualized airway-clearance technique, hydration plan, mobility, and prescribed bronchodilator or saline sequence while assessing fatigue and bronchospasm because mobilized secretions must be cleared without exhausting or constricting the airway.",
      "Administer culture-directed antimicrobial or long-term preventive therapy while monitoring hearing, electrocardiographic QT interval, liver and kidney function, diarrhea, and resistance risk as applicable because recurrent treatment can create important cumulative toxicity.",
      "Escalate for large or increasing hemoptysis, severe dyspnea, rapid oxygen increase, exhaustion, hypotension, confusion, pleuritic pain, or failure to improve because major airway bleeding, respiratory failure, embolism, or resistant infection requires urgent specialist care."
    ], [
      "Large-volume, recurrent, or airway-threatening hemoptysis",
      "Severe dyspnea, exhaustion, cyanosis, or rapidly increasing oxygen requirement",
      "Hypotension, confusion, oliguria, or other sepsis findings",
      "Pleuritic chest pain, sudden deterioration, or persistent fever despite directed treatment"
    ], [
      "Teach daily airway clearance even between exacerbations and how to submit a clean sputum sample because mucus stasis permits another infection cycle.",
      "Explain the patient's written flare plan, including which change in sputum, breathing, bleeding, or oxygen use warrants same-day contact or emergency care."
    ]),
    card("Aspiration pneumonia", ["bts-aspiration", "idsa-cap"], [
      "Assess alertness, cough and gag effectiveness, voice after swallowing, drooling, dentition, oral hygiene, reflux, vomiting, tube feeding, neurologic disease, sedatives, and the witnessed event because aspiration risk persists unless the swallowing or consciousness problem is addressed.",
      "Keep oral intake on hold when swallowing is unsafe, position upright, provide suction and oral care, and obtain speech-language and nutrition assessment because another aspiration can occur while the first lung injury is being treated.",
      "Trend respiratory rate and effort, oxygen saturation, lung sounds, temperature, mental status, sputum, hydration, and sepsis markers because chemical pneumonitis may improve with support while bacterial pneumonia can evolve over subsequent hours.",
      "Administer prescribed oxygen, fluids, and antibiotics when bacterial infection is suspected while monitoring volume tolerance, cultures, renal dosing, diarrhea, and clinical response because not every witnessed aspiration benefits from antibiotics and unnecessary exposure causes harm.",
      "Escalate for stridor, inability to clear secretions, severe hypoxemia, exhaustion, hypotension, confusion, rising lactate, abscess or empyema findings, or recurrent aspiration despite precautions because airway failure, sepsis, or a source-control problem needs urgent intervention."
    ], [
      "Stridor, weak or absent cough, pooling secretions, or inability to protect the airway",
      "Severe hypoxemia, increasing work of breathing, exhaustion, or apnea",
      "Hypotension, confusion, elevated lactate, or rapidly falling urine output",
      "Persistent fever, foul sputum, pleural pain, or imaging evidence of abscess or empyema"
    ], [
      "Teach the prescribed food texture, liquid consistency, upright position, bite size, pace, and post-meal timing because safe-swallow details are specific to the identified impairment.",
      "Explain that regular oral and dental care lowers the bacterial burden that reaches the lungs if small aspiration events recur."
    ]),
    card("Upper airway obstruction", ["aha-resuscitation-2025"], [
      "Assess ability to speak, cough, swallow, and handle secretions; listen for stridor or silence; inspect for swelling, trauma, burns, or foreign body without agitating the patient because a partially open airway can close abruptly.",
      "Keep the patient upright when tolerated, summon airway expertise, provide high-concentration oxygen, attach continuous cardiorespiratory monitoring, and bring age- and cause-appropriate difficult-airway equipment because oxygenation may be lost during transfer or repeated attempts.",
      "Use cause-specific first aid: encourage effective cough for mild foreign-body obstruction, perform guideline-directed thrusts for severe choking, give intramuscular epinephrine for anaphylaxis, and avoid blind finger sweeps because the wrong maneuver can worsen impaction or delay definitive care.",
      "Prepare for controlled intubation or emergency front-of-neck access while minimizing sedation and repeated examination in a tenuous airway because loss of muscle tone or edema progression can convert partial obstruction into cannot-intubate, cannot-oxygenate failure.",
      "Activate resuscitation for inability to speak or cough, silent airflow, cyanosis, falling consciousness, severe stridor with fatigue, rapidly expanding neck or tongue swelling, or poor air movement after intervention because complete obstruction causes hypoxic arrest within minutes."
    ], [
      "Inability to speak, cough effectively, or move air",
      "Cyanosis, falling consciousness, bradycardia, or apnea",
      "Severe stridor with retractions, fatigue, drooling, or tripod positioning",
      "Rapidly expanding tongue, floor-of-mouth, facial, or neck swelling"
    ], [
      "Teach choking prevention that fits the cause, including food size, supervision, denture fit, and safe swallowing, because recurrent obstruction is often preventable.",
      "Patients with prior anaphylaxis should carry accessible epinephrine and use it promptly for airway symptoms while someone calls emergency services."
    ]),
    card("Alpha-1 antitrypsin deficiency", ["copdf-a1at"], [
      "Assess dyspnea, cough, wheeze, exacerbations, smoking and occupational exposure, oxygenation, exercise tolerance, jaundice, pruritus, abdominal swelling, family history, and age of lung or liver disease because one inherited deficiency can injure both alveoli and hepatocytes.",
      "Verify quantitative level and genotype or phenotype evaluation and coordinate pulmonary function, liver tests, imaging, and family counseling because a low level during illness or an unconfirmed label does not fully define hereditary risk or treatment eligibility.",
      "Trend respiratory symptoms, spirometry, oxygen need, exacerbations, weight, liver enzymes, bilirubin, INR, platelets, and signs of portal hypertension because lung decline and cirrhosis may progress independently.",
      "Administer prescribed inhaled, oxygen, vaccination, exacerbation, or augmentation therapy while monitoring infusion reaction and clinical eligibility because augmentation targets selected lung disease but does not treat established liver injury.",
      "Escalate for severe breathlessness, rapidly increasing oxygen need, confusion, cyanosis, hemoptysis, jaundice with bleeding or encephalopathy, tense ascites, or hematemesis because respiratory failure or decompensated cirrhosis requires urgent care."
    ], [
      "Severe dyspnea, exhaustion, cyanosis, or a rapid oxygen increase",
      "Hemoptysis, pleuritic chest pain, or unilateral breath-sound change",
      "New jaundice, confusion, easy bleeding, tense ascites, or rapidly increasing edema",
      "Hematemesis, melena, hypotension, or other portal-hypertensive bleeding findings"
    ], [
      "Explain that complete avoidance of tobacco smoke, vaping, dust, and fumes is unusually important because deficient antiprotease protection makes inhaled injury more destructive.",
      "Encourage genetic counseling and testing of appropriate relatives while protecting privacy because early identification permits exposure prevention before symptoms develop."
    ]),
    card("Chronic pancreatitis", ["acg-chronic-pancreatitis"], [
      "Assess chronic or postprandial epigastric pain, weight loss, greasy stool, nausea, alcohol and tobacco exposure, medication use, prior attacks, and glucose symptoms because fibrosis can cause pain, duct obstruction, exocrine failure, and pancreatogenic diabetes.",
      "Trend weight, intake, stool pattern, fat-soluble vitamins, albumin and micronutrients, glucose, A1c, bone health, pain function, and adherence because malabsorption and endocrine failure may progress even when acute pain is absent.",
      "Give pancreatic enzymes with the first bites of every meal and snack and use prescribed acid suppression when indicated because enzymes must mix with food in the duodenum to improve digestion and nutrition.",
      "Coordinate small nutrient-dense meals, alcohol and tobacco cessation, nonopioid-first pain planning, diabetes care, and endoscopic or surgical follow-up because ongoing toxic exposure and obstruction perpetuate pain and tissue loss.",
      "Escalate for sudden severe pain, persistent vomiting, fever, jaundice, gastrointestinal bleeding, rapidly enlarging abdominal mass, hypoglycemia, ketoacidosis symptoms, or unexplained accelerating weight loss because acute pancreatitis, obstruction, pseudocyst complication, infection, or cancer may be present."
    ], [
      "New severe abdominal pain with guarding, hypotension, or persistent vomiting",
      "Fever, jaundice, dark urine, pale stool, or cholangitis findings",
      "Hematemesis, melena, syncope, or rapidly falling hemoglobin",
      "New abdominal mass, early satiety, severe weight loss, hypoglycemia, or ketoacidosis symptoms"
    ], [
      "Teach enzyme timing with every source of fat and protein rather than before or long after eating because timing determines whether the medicine contacts the meal.",
      "Explain that stopping both alcohol and tobacco can reduce attacks and cancer risk; changing only one exposure leaves another driver active."
    ]),
    card("Constipation", ["aga-constipation", "ascrs-constipation"], [
      "Clarify usual frequency and form, straining, incomplete evacuation, pain, blood, weight change, intake, mobility, pregnancy, neurologic disease, surgery, and constipating medicines because slow transit, outlet dysfunction, secondary illness, and obstruction require different care.",
      "Assess abdominal distention and tenderness, bowel sounds, rectal symptoms, hydration, and stool burden, and perform rectal examination only when indicated and safe because fecal impaction or obstruction must be recognized before escalating oral laxatives.",
      "Implement individualized fluid, fiber, activity, toileting position, privacy, and scheduled gastrocolic timing while avoiding abrupt fiber loading during impaction or obstruction because bulk helps only when stool can move and water is available.",
      "Administer the prescribed stepwise osmotic, stimulant, secretagogue, suppository, or enema regimen and monitor stool response, cramping, diarrhea, electrolytes, and renal limits because repeated uncoordinated products can cause dehydration without correcting the mechanism.",
      "Escalate for severe or colicky pain, vomiting, fever, peritoneal signs, marked distention, absent flatus, gastrointestinal bleeding, unexplained anemia or weight loss, or new constipation with neurologic deficits because obstruction, perforation, malignancy, or cord compression needs urgent evaluation."
    ], [
      "Severe abdominal pain, guarding, rebound, fever, or rigid distention",
      "Persistent vomiting, absent stool and flatus, or high-pitched then absent bowel sounds",
      "Melena, significant rectal bleeding, unexplained anemia, or weight loss",
      "New urinary retention, saddle sensory change, leg weakness, or loss of bowel control"
    ], [
      "Teach a bowel diary that records stool form, straining, medicines, food, and response because frequency alone does not show whether evacuation is effective.",
      "Explain that the safest regimen depends on the cause; the patient should seek advice before repeatedly adding enemas or stimulant products when pain or vomiting occurs."
    ]),
    card("Diarrhea", ["idsa-diarrhea"], [
      "Quantify onset, frequency, volume, blood or mucus, pain, fever, vomiting, urine output, travel, food and water exposure, contacts, recent antibiotic use, hospitalization, immune status, and medicines, and obtain blood cultures when systemic infection is suspected because dehydration risk and the need for testing vary by syndrome.",
      "Assess orthostatic vital signs, mucosa, capillary refill, mental status, weight, abdominal findings, urine output, and relevant sodium, potassium, bicarbonate, creatinine, and glucose because fluid and electrolyte loss may become dangerous before stool count appears extreme.",
      "Initiate indicated contact precautions, meticulous soap-and-water hand hygiene for suspected spore-forming infection, obtain ordered stool cultures or molecular testing with safe specimen handling, and ensure environmental cleaning because diarrheal pathogens spread through hands, surfaces, food, and shared bathrooms.",
      "Replace fluid and electrolytes by the safest route, continue age-appropriate nutrition, and administer antibiotic or antimotility therapy only when specifically indicated because some invasive or toxin-mediated infections can worsen when motility is suppressed or antibiotics are unnecessary.",
      "Escalate for hypotension, confusion, oliguria, severe dehydration, bloody stool with fever, peritoneal signs, toxic megacolon features, severe electrolyte change, hemolysis with falling platelets, or persistent high-volume loss because shock, invasive infection, perforation, or hemolytic uremic syndrome needs urgent care."
    ], [
      "Hypotension, syncope, confusion, poor perfusion, or rapidly falling urine output",
      "Bloody stool with high fever, severe pain, or systemic toxicity",
      "Marked distention, guarding, rebound, absent bowel sounds, or suspected toxic megacolon",
      "Pallor, bruising, falling platelets, dark urine, kidney injury, or severe electrolyte abnormality"
    ], [
      "Teach oral rehydration in small frequent amounts and which fluids to avoid because very sugary drinks can increase osmotic stool loss and do not replace electrolytes correctly.",
      "Explain handwashing, food safety, bathroom cleaning, and the exact return precautions because symptoms can improve while dehydration or a postinfectious complication develops."
    ]),
    card("Fecal impaction", ["ascrs-constipation"], [
      "Assess last effective bowel movement, overflow liquid stool, rectal pressure, abdominal pain and distention, nausea, vomiting, appetite, urinary retention, delirium, mobility, neurologic disease, and opioid or anticholinergic use because impaction often presents as leakage or behavioral change rather than simple constipation.",
      "Perform focused abdominal and indicated digital rectal assessment with privacy, lubrication, and contraindication review because location and stool consistency determine whether distal disimpaction, enema, or proximal treatment is appropriate.",
      "Hold oral bulk agents and clarify the plan when obstruction, perforation, severe neutropenia, thrombocytopenia, recent rectal surgery, or unstable cardiac disease is possible because rectal manipulation or added volume can cause bleeding, vagal instability, or rupture.",
      "Administer prescribed softening, enema, or gentle manual removal in stages while monitoring pain, pulse, pressure, bleeding, stool output, hydration, electrolytes, and urinary function because rapid forceful disimpaction can injure mucosa or trigger bradycardia.",
      "Stop and escalate for severe pain, guarding, vomiting, fever, significant rectal bleeding, bradycardia, syncope, rigid distention, absent flatus, or failure to clear with worsening illness because perforation, complete obstruction, ischemia, or vagal compromise requires urgent evaluation."
    ], [
      "Rigid distention, guarding, rebound, fever, or sudden severe abdominal pain",
      "Persistent vomiting, absent flatus, or suspected complete bowel obstruction",
      "Significant rectal bleeding, hypotension, or rapidly falling hemoglobin",
      "Bradycardia, syncope, chest pain, or hemodynamic change during rectal manipulation"
    ], [
      "After clearance, teach a scheduled prevention plan addressing fluid, activity, toileting, fiber when safe, and constipating medicines because repeated rescue treatment does not correct the cause.",
      "Explain that watery leakage can flow around an impaction, so antidiarrheal self-treatment may worsen the blockage rather than solve it."
    ]),
    card("H. pylori infection", ["acg-hpylori-2024"], [
      "Assess dyspepsia, ulcer history, gastrointestinal bleeding, iron deficiency, prior gastric surgery, family gastric-cancer history, antibiotic and bismuth exposure, allergies, pregnancy, and prior eradication attempts because treatment choice and urgency depend on resistance and complication risk.",
      "Collect urea breath, stool antigen, biopsy, or other indicated testing under the required proton-pump inhibitor, antibiotic, and bismuth hold conditions because suppressive medicines can produce a false-negative result.",
      "Administer the complete prescribed multidrug regimen with a written schedule and monitor nausea, diarrhea, allergy, interactions, adherence, and dark stool or tongue from bismuth because regimen complexity is a major cause of eradication failure.",
      "Arrange a test of cure at the guideline-specified interval after treatment and medication holds because symptom relief does not prove eradication and persistent infection continues ulcer and gastric-cancer risk.",
      "Escalate for hematemesis, melena with weakness, syncope, hypotension, sudden severe abdominal pain, rigid abdomen, persistent vomiting, progressive dysphagia, anemia, or weight loss because hemorrhage, perforation, obstruction, or malignancy needs urgent evaluation."
    ], [
      "Hematemesis, coffee-ground emesis, melena, syncope, or hypotension",
      "Sudden severe abdominal pain with guarding, rebound, or rigid abdomen",
      "Persistent vomiting, early satiety, or inability to maintain hydration",
      "Progressive dysphagia, unexplained iron-deficiency anemia, or unintentional weight loss"
    ], [
      "Teach the exact dosing calendar and advise the patient to call about adverse effects rather than silently stopping one component because partial therapy promotes failure and resistance.",
      "Explain why a post-treatment breath or stool test is still needed when symptoms disappear: ulcer symptoms can settle while the organism remains."
    ]),
    card("Hepatopulmonary syndrome", ["aasld-practice-guidelines"], [
      "Assess chronic liver disease, dyspnea that worsens upright, relief when supine, cyanosis, clubbing, spider angiomas, baseline oxygen use, functional decline, and transplant status because intrapulmonary vascular dilation creates positional oxygenation failure.",
      "Measure oxygen saturation supine and upright and with activity, obtain arterial blood gas and contrast echocardiography as ordered, and document oxygen response because the positional gradient and gas-exchange defect establish severity and support transplant evaluation.",
      "Trend respiratory effort, oxygen requirement, cognition, exertional tolerance, hemoglobin, liver and kidney function, ascites, bleeding, and infection findings because hypoxemia coexists with other decompensated-cirrhosis risks.",
      "Administer prescribed supplemental oxygen, pace activity, prevent falls, and coordinate early liver-transplant assessment because oxygen relieves tissue hypoxia while transplantation is the intervention most likely to reverse the vascular mechanism.",
      "Escalate for severe or rapidly worsening hypoxemia, syncope, chest pain, confusion, gastrointestinal bleeding, fever with hypotension, oliguria, or tense ascites with respiratory compromise because cardiopulmonary failure or another cirrhosis complication may be superimposed."
    ], [
      "Severe oxygen desaturation upright or with minimal exertion",
      "Syncope, chest pain, cyanosis, confusion, or rapidly increasing oxygen requirement",
      "Hematemesis, melena, hypotension, or acute hemoglobin decline",
      "Fever with shock, oliguria, encephalopathy, or tense ascites impairing ventilation"
    ], [
      "Teach safe oxygen use, slow position changes, pacing, and fall prevention because standing can worsen oxygenation even when breathing seems comfortable while supine.",
      "Explain that this problem comes from abnormal lung blood vessels caused by liver disease, which is why transplant evaluation may be central rather than optional respiratory follow-up."
    ]),
    card("Mallory-Weiss tear", ["acg-upper-gi-bleeding"], [
      "Assess the amount and color of hematemesis, retching or coughing trigger, melena, dizziness, syncope, alcohol use, anticoagulants, liver disease, prior bleeding, and aspiration risk because mucosal tears range from self-limited bleeding to brisk upper gastrointestinal hemorrhage.",
      "Trend airway protection, respiratory status, orthostatic and continuous vital signs when unstable, mental status, skin perfusion, urine output, serial hemoglobin, platelets, INR, and type-and-screen status because early hemoglobin may underestimate acute blood loss.",
      "Keep the patient appropriately fasting, establish reliable intravenous access, provide suction and oxygen for clinical need, and administer prescribed fluid, blood, antiemetic, and acid suppression because preventing further retching and restoring perfusion support hemostasis and safe endoscopy.",
      "Reconcile anticoagulants, antiplatelets, NSAIDs, and alcohol exposure and coordinate timely endoscopy because medication reversal and endoscopic therapy depend on bleeding severity, thrombotic risk, and direct visualization.",
      "Activate emergency response for ongoing large hematemesis, inability to protect the airway, hypotension, tachycardia with poor perfusion, syncope, falling hemoglobin, severe chest pain after vomiting, or rigid abdomen because uncontrolled hemorrhage, aspiration, or esophageal perforation is life-threatening."
    ], [
      "Ongoing large-volume hematemesis or blood pooling in an unprotected airway",
      "Hypotension, syncope, confusion, cool mottled skin, or rapidly falling urine output",
      "Rapid hemoglobin decline, repeated transfusion need, or recurrent bleeding after initial control",
      "Severe chest or upper abdominal pain, subcutaneous emphysema, fever, or rigid abdomen after vomiting"
    ], [
      "Teach the patient to seek emergency care for recurrent red or coffee-ground emesis, black stool with weakness, or fainting rather than waiting for the next appointment.",
      "Explain that controlling recurrent vomiting and reducing alcohol or ulcerogenic medicine exposure helps prevent another tear while the mucosa heals."
    ]),
    card("Nonalcoholic fatty liver disease", ["aasld-practice-guidelines", "nhlbi-metabolic-syndrome"], [
      "Assess weight and waist trend, blood pressure, glucose, lipids, sleep apnea, cardiovascular disease, alcohol intake, medicines, family history, and signs of advanced liver disease because steatotic liver disease clusters with metabolic risk yet other causes must still be excluded.",
      "Trend liver enzymes without using them alone to judge severity, calculate or obtain ordered fibrosis risk, and review platelet count, imaging, elastography, glucose, lipids, and kidney function because fibrosis—not fat or aminotransferase level alone—best predicts liver outcomes.",
      "Use nonstigmatizing shared goals for nutrition, physical activity, weight change, sleep, and treatment of diabetes, lipids, hypertension, and obesity because cardiovascular disease is a leading threat and sustained metabolic improvement can reduce liver injury.",
      "Administer prescribed cardiometabolic and liver-directed therapy while monitoring interactions, glucose, weight, kidney function, and adverse effects because beneficial treatment should not be withheld solely due to mild stable liver-enzyme elevation.",
      "Escalate for jaundice, ascites, confusion, gastrointestinal bleeding, rapid edema, severe right-upper-quadrant pain with fever, or an enlarging liver mass because decompensated cirrhosis, biliary disease, infection, or hepatocellular carcinoma requires urgent evaluation."
    ], [
      "New jaundice, confusion, asterixis, or rapidly worsening synthetic liver function",
      "Hematemesis, melena, hypotension, or symptomatic anemia",
      "New ascites, rapidly increasing edema, fever, or abdominal tenderness",
      "Enlarging liver mass, unexplained weight loss, or severe persistent right-upper-quadrant pain"
    ], [
      "Explain that normal or mildly abnormal liver enzymes do not rule out fibrosis, so scheduled fibrosis assessment remains important even when the patient feels well.",
      "Frame food, activity, sleep, and weight treatment around liver and cardiovascular protection rather than blame because a sustainable plan is more effective than rapid unsupervised dieting."
    ]),
    card("Alcoholic hepatitis", ["acg-alcohol-liver-2024", "aasld-practice-guidelines"], [
      "Obtain a nonjudgmental alcohol timeline, last drink, withdrawal and seizure history, nutrition, medicines, infection exposure, bleeding, jaundice, abdominal swelling, cognition, and social supports because simultaneous liver failure, withdrawal, malnutrition, and infection alter immediate priorities.",
      "Trend mental status and asterixis, temperature, pressure, oxygenation, intake and output, weight, ascites, bilirubin, INR, creatinine, sodium, glucose, blood count, and cultures when indicated because severity and treatment response are driven by liver, kidney, infectious, and neurologic complications.",
      "Provide thiamine before or with carbohydrate when deficiency risk is high, individualized protein and calorie support, glucose and electrolyte replacement, skin and fall protection, and structured withdrawal care because malnutrition and withdrawal can become fatal independently of the hepatitis.",
      "Administer prescribed corticosteroid only after contraindications and infection or bleeding concerns are assessed, and document the specified response score because immunosuppression without likely benefit exposes a critically ill patient to infection.",
      "Escalate for worsening confusion, seizure, hematemesis or melena, fever with hypotension, hypoglycemia, oliguria, severe hyponatremia, respiratory distress, or rapidly rising bilirubin and INR because encephalopathy, hemorrhage, sepsis, kidney failure, or acute-on-chronic liver failure requires urgent care."
    ], [
      "Worsening confusion, asterixis, seizure, agitation, or inability to protect the airway",
      "Hematemesis, melena, hypotension, or rapidly falling hemoglobin",
      "Fever, shock, rising lactate, abdominal tenderness, or spontaneous bacterial peritonitis concern",
      "Oliguria, rapidly rising creatinine, severe hyponatremia, hypoglycemia, or respiratory compromise"
    ], [
      "Explain that complete alcohol abstinence is essential but withdrawal can be dangerous; a medically supervised plan is safer than abruptly detoxifying alone after heavy use.",
      "Connect the patient with addiction treatment, nutrition, hepatology, transplant evaluation when appropriate, and practical social support because sustained recovery requires more than discharge advice."
    ]),
    card("Hepatorenal syndrome", ["aasld-practice-guidelines"], [
      "Assess cirrhosis severity, ascites, recent infection or bleeding, diarrhea, vomiting, diuretic change, paracentesis, nephrotoxins, pressure, perfusion, weight, and urine output because hepatorenal physiology is diagnosed after reversible volume, septic, obstructive, and intrinsic kidney causes are addressed.",
      "Measure strict intake and output, daily weight, abdominal girth, mental status, pressure and oxygenation, and trend creatinine, sodium, potassium, bicarbonate, urine findings, liver tests, and cultures because kidney decline can accelerate while fluid remains sequestered outside the circulation.",
      "Hold or clarify nephrotoxins and contributing diuretics or vasodilators as directed, collect diagnostic studies, and treat infection or bleeding promptly because additional arterial underfilling worsens renal vasoconstriction.",
      "Administer prescribed albumin and vasoconstrictor therapy with continuous assessment for pulmonary edema, hypoxemia, ischemic pain, rhythm change, pressure response, and urine output because therapy expands effective volume and raises vascular tone but can injure heart, lung, or ischemic tissue.",
      "Escalate for rapidly falling urine output, refractory hyperkalemia or acidosis, severe hypoxemia, pulmonary edema, chest or limb ischemia, shock, gastrointestinal bleeding, or worsening encephalopathy because kidney replacement, respiratory support, hemorrhage control, and urgent transplant-level care may be required."
    ], [
      "Oliguria or anuria with rapidly rising creatinine",
      "Hyperkalemic electrocardiographic change, severe acidosis, or uremic complication",
      "New pulmonary edema, severe hypoxemia, chest pain, or limb ischemia during vasoconstrictor therapy",
      "Shock, gastrointestinal hemorrhage, severe infection, or worsening hepatic encephalopathy"
    ], [
      "Teach the patient to avoid NSAIDs and unreviewed herbal products and to report vomiting, diarrhea, fever, bleeding, or reduced urine early because a reversible stressor can trigger kidney failure.",
      "Explain that the kidneys may be structurally intact but receive an extreme vasoconstrictive signal from advanced liver disease, which is why liver-transplant assessment matters."
    ]),
    card("Acute kidney injury", ["kdigo-aki"], [
      "Compare current creatinine and urine output with baseline, review timing of hypotension, sepsis, surgery, contrast, obstruction, fluid loss, and every medicine, and assess bladder retention because AKI is a syndrome whose cause determines whether fluid, drainage, or restraint is safest.",
      "Measure strict intake and output, daily weight, pressure, perfusion, edema, lung sounds, mental status, and trend creatinine, urea, potassium, bicarbonate, sodium, phosphate, magnesium, urinalysis, and electrocardiography when indicated because life-threatening complications may develop before creatinine peaks.",
      "Optimize individualized perfusion and fluid status, obtain cultures or imaging, relieve obstruction, and treat sepsis promptly while reassessing after each intervention because both persistent underfilling and indiscriminate fluid loading can extend kidney injury.",
      "Stop or clarify nephrotoxins, adjust renally cleared medicines, verify contrast necessity, and avoid potassium or magnesium accumulation because reduced filtration changes drug exposure and electrolyte elimination immediately.",
      "Escalate for anuria, refractory hyperkalemia, severe acidosis, pulmonary edema, uremic pericarditis or encephalopathy, seizure, rapidly rising toxin level, or worsening shock because urgent nephrology and kidney-replacement therapy may be needed."
    ], [
      "Anuria or rapidly falling urine output despite correction of reversible causes",
      "Hyperkalemia with electrocardiographic change or refractory severe metabolic acidosis",
      "Pulmonary edema, severe hypoxemia, or fluid overload unresponsive to medical therapy",
      "Uremic pericarditis, encephalopathy, seizure, severe bleeding, or dialyzable toxin exposure"
    ], [
      "Teach the patient to avoid NSAIDs and to obtain a medication review after AKI because doses that were safe before injury may accumulate during recovery.",
      "Explain the need for follow-up creatinine, urine protein, pressure, and medication review even after discharge because AKI raises later chronic kidney disease risk."
    ]),
    card("Chronic kidney disease", ["kdigo-ckd-2024"], [
      "Verify estimated filtration and urine-albumin category, cause, rate of change, pressure, diabetes status, cardiovascular disease, medicines, diet, access barriers, and symptoms because CKD risk depends on both filtration loss and kidney damage rather than creatinine alone.",
      "Trend pressure, weight, edema, intake and output when unstable, creatinine, potassium, bicarbonate, calcium, phosphate, hemoglobin, iron, parathyroid hormone, urine albumin, nutrition, cognition, and pruritus because CKD affects volume, acid-base, bone, blood, nerve, and cardiovascular systems.",
      "Administer prescribed kidney-protective, pressure, glucose, anemia, acidosis, mineral-bone, and diuretic therapy while checking sick-day instructions, potassium, pressure, renal dosing, and adverse effects because benefits require surveillance for predictable hemodynamic and electrolyte changes.",
      "Preserve veins in patients likely to need hemodialysis, avoid blood pressure cuffs and venipuncture on a mature access, and coordinate education about dialysis, transplant, and conservative care early because rushed kidney-failure decisions reduce safe choices.",
      "Escalate for severe dyspnea or pulmonary edema, hyperkalemic rhythm change, pericardial chest pain, new confusion or seizure, uncontrolled hypertension, major bleeding, or rapidly worsening filtration because urgent dialysis or treatment of an acute superimposed process may be required."
    ], [
      "Pulmonary edema, severe hypoxemia, or rapidly increasing volume overload",
      "Hyperkalemia with weakness, bradycardia, wide QRS, or other electrocardiographic change",
      "Pericarditic chest pain, friction rub, encephalopathy, seizure, or severe uremic bleeding",
      "Abrupt creatinine rise, anuria, malignant hypertension, or signs of access infection or thrombosis"
    ], [
      "Teach the patient to ask before taking NSAIDs, contrast, supplements, salt substitutes, or over-the-counter medicines because kidney clearance and potassium content can change safety.",
      "Explain the personal eGFR and urine-albumin trend in plain language and provide a written sick-day plan so the patient knows which changes require early contact."
    ]),
    card("Dehydration", ["nice-iv-fluids"], [
      "Identify fluid losses, reduced intake, fever, diuretics, osmotic diuresis, bleeding, third spacing, age-related risk, weight change, orthostatic symptoms, thirst, mucosa, skin, cognition, and perfusion, and check glucose and ketones when diabetic osmotic loss is possible because dehydration ranges from free-water deficit to hemodynamic volume depletion.",
      "Trend heart rate, lying and standing pressure when safe, capillary refill, mental status, daily weight, intake and output, urine concentration, sodium, glucose, urea, creatinine, bicarbonate, and lactate when ill because the pattern determines fluid type, rate, and urgency.",
      "Replace fluid by the safest oral, enteral, or intravenous route in measured stages, use telemetry when severe electrolyte loss creates dysrhythmia risk, and reassess pulse, pressure, lungs, urine output, cognition, and electrolytes after each stage because rapid or excessive replacement can cause edema or dangerous sodium correction.",
      "Treat the loss source with antiemetic, diarrhea, fever, glucose, medication, swallowing, or access interventions, obtain cultures when infection is suspected, and document ongoing losses because replacement cannot catch up when the mechanism continues unmeasured.",
      "Escalate for hypotension, syncope, confusion, severe tachycardia, oliguria, shock, seizure, severe hypernatremia or hyponatremia, persistent vomiting, gastrointestinal bleeding, or failure to respond because organ hypoperfusion or a dangerous electrolyte disorder needs urgent monitored care."
    ], [
      "Hypotension, syncope, cool mottled skin, delayed capillary refill, or rising lactate",
      "Confusion, seizure, severe weakness, or marked sodium abnormality",
      "Oliguria or anuria with worsening creatinine",
      "Persistent vomiting, high-output diarrhea, hematemesis, melena, or ongoing major loss"
    ], [
      "Teach small frequent oral rehydration with an appropriate electrolyte solution and how to match ongoing losses because plain water or very sugary drinks may not safely replace what was lost.",
      "Provide an individualized early-call threshold for urine reduction, dizziness, weight loss, vomiting, diarrhea, or glucose elevation because timely treatment can prevent shock and kidney injury."
    ]),
    card("Overhydration", ["nice-iv-fluids", "acc-hf-2022", "kdigo-ckd-2024"], [
      "Assess the cause and tempo of weight gain, edema, dyspnea, orthopnea, jugular venous pressure, ascites, lung sounds, medicines, intravenous fluids, heart, kidney and liver disease, and sodium intake because excess total-body fluid may coexist with poor effective perfusion.",
      "Measure strict intake and output, daily weight on the same scale, respiratory rate, oxygenation, pressure, edema, abdominal girth, and trend sodium, potassium, magnesium, creatinine, and response to therapy because weight and breathing changes reveal fluid movement more reliably than edema alone.",
      "Stop or clarify unnecessary fluid and sodium sources, concentrate infusions when safe, and implement the prescribed restriction because hidden flushes, diluents, drinks, and supplements can defeat an otherwise appropriate plan.",
      "Administer prescribed diuretic or kidney-replacement therapy while monitoring urine output, pressure, orthostasis, electrolytes, kidney function, hearing risk with high-dose loop therapy, and intravascular depletion because removing fluid too quickly can worsen perfusion despite persistent edema.",
      "Activate urgent response for acute pulmonary edema, severe hypoxemia, pink frothy sputum, hypertensive crisis, chest pain, confusion, seizure from severe hyponatremia, anuria, or refractory overload because respiratory support and rapid controlled decongestion may be required."
    ], [
      "Acute severe dyspnea, crackles, hypoxemia, or pink frothy sputum",
      "Chest pain, severe hypertension, new dysrhythmia, or syncope",
      "Confusion, seizure, or rapidly falling sodium with neurologic symptoms",
      "Anuria or progressive overload despite prescribed diuretic therapy"
    ], [
      "Teach how to count all liquids and identify high-sodium foods, and provide the exact daily weight threshold for calling because visible swelling is a late and imprecise signal.",
      "Explain that edema does not always mean the bloodstream is well filled, so the patient should not independently double diuretics or severely restrict fluid without guidance."
    ]),
    card("Polycystic kidney disease", ["kdigo-adpkd-2025"], [
      "Assess family history, blood pressure, kidney function, flank or abdominal pain, hematuria, urinary infection, stones, abdominal fullness, pregnancy plans, cardiac history, and sudden neurologic symptoms because ADPKD affects kidneys and selected extrarenal tissues across generations.",
      "Trend pressure, weight, edema, urine albumin and blood, creatinine and filtration, potassium, pain pattern, infection signs, and ordered imaging or progression markers because hypertension and cyst growth drive kidney decline before late symptoms emerge.",
      "Administer prescribed pressure and disease-modifying therapy while monitoring volume, sodium, liver tests, urine output, pregnancy considerations, and interactions because treatment can slow progression but may cause aquaresis or other organ toxicity.",
      "Obtain urine and blood cultures before antibiotics when cyst infection is suspected, manage stones and pain without routine NSAID exposure, and coordinate nephrology and genetic counseling because infected cyst penetration and inherited risk require specialized decisions.",
      "Escalate for sudden worst headache, focal deficit, syncope, fever with persistent flank pain, gross hematuria with clots or retention, severe uncontrolled pressure, rapidly worsening kidney function, or peritoneal signs because aneurysmal bleeding, cyst infection or rupture, obstruction, or vascular emergency may be present."
    ], [
      "Sudden thunderclap headache, focal neurologic deficit, seizure, or syncope",
      "Fever with persistent focal flank or abdominal pain despite initial treatment",
      "Gross hematuria with clots, urinary retention, hypotension, or falling hemoglobin",
      "Severe uncontrolled hypertension, rapid kidney decline, or acute peritoneal findings"
    ], [
      "Teach home blood-pressure tracking, hydration and sodium guidance individualized to the treatment plan, and avoidance of routine NSAIDs because pressure and nephrotoxins accelerate loss of kidney reserve.",
      "Explain that genetic counseling can help adult relatives make informed testing, pregnancy, donor, and screening decisions without assuming every family member has the same course."
    ]),
    card("Renal artery stenosis", ["aha-renovascular", "acc-hbp-2025"], [
      "Assess abrupt or resistant hypertension, abdominal bruit, recurrent flash pulmonary edema, asymmetric kidney size, vascular disease, smoking, unexplained kidney decline, and creatinine change after renin-angiotensin blockade because high-risk renovascular syndromes are more informative than an incidental narrowing.",
      "Measure blood pressure accurately in both arms initially and trend pressure, orthostasis, weight, lung sounds, edema, urine output, creatinine, potassium, and albuminuria because both uncontrolled pressure and treatment-related perfusion loss can injure the kidneys.",
      "Administer prescribed antihypertensive, statin, antiplatelet, and vascular-risk therapy while checking creatinine and potassium after ACE inhibitor or ARB initiation or titration because efferent dilation can reveal bilateral or solitary-kidney flow dependence.",
      "Coordinate duplex, angiographic, or other imaging preparation and renal-protection measures and document contrast risk because anatomy must be linked to a clinically meaningful syndrome before invasive treatment is considered.",
      "Escalate for flash pulmonary edema, severe hypertension with target-organ injury, rapidly rising creatinine, oliguria after medication change, refractory heart failure, or acute flank pain with hematuria because destabilized cardiorenal perfusion may require urgent specialist intervention."
    ], [
      "Sudden pulmonary edema with severe dyspnea, crackles, and hypoxemia",
      "Severe pressure with neurologic deficit, chest pain, or acute kidney injury",
      "Rapid creatinine rise, hyperkalemia, or oliguria after ACE inhibitor or ARB initiation",
      "Acute flank pain, hematuria, hypotension, or suspected renal infarction"
    ], [
      "Teach consistent home pressure measurement and prompt reporting of sudden breathlessness or reduced urine because recurrent flash pulmonary edema can be the key renovascular clue.",
      "Explain that most narrowing is treated first with careful medical risk reduction; a procedure is considered when the clinical syndrome suggests meaningful threatened organ perfusion."
    ]),
    card("Malnutrition", ["aspen-malnutrition"], [
      "Screen recent intake, unintentional weight loss, swallowing, gastrointestinal loss, inflammation, food access, functional decline, substance use, and physical signs of muscle and fat loss because body mass index and serum albumin alone can miss clinically important malnutrition.",
      "Obtain a dietitian-led nutrition assessment and trend consistent weights, intake percentage, handgrip or function, wounds, edema, stool or emesis losses, glucose, electrolytes, blood count, and micronutrients when indicated because response must be measured across intake, body stores, and recovery.",
      "Choose the safest oral, enteral, or parenteral route with swallowing and aspiration precautions and verify tube or line care because nutrition only helps when delivery reaches the patient without causing aspiration, infection, or access injury.",
      "Start and advance repletion according to refeeding risk while checking phosphate, potassium, magnesium, glucose, fluid balance, rhythm, respiratory strength, and thiamine need because insulin-driven shifts can cause dysrhythmia, heart failure, seizure, and ventilatory weakness.",
      "Escalate for severe hypophosphatemia or other electrolyte change, new edema or heart failure, dysrhythmia, delirium, seizure, aspiration, inability to protect the airway, or hemodynamic instability because refeeding or the underlying disease can rapidly become life-threatening."
    ], [
      "Falling phosphate, potassium, or magnesium with weakness or electrocardiographic change",
      "New edema, crackles, hypoxemia, tachycardia, or heart-failure findings after feeding begins",
      "Delirium, ataxia, seizure, severe glucose instability, or suspected thiamine deficiency",
      "Choking, aspiration, recurrent vomiting, or inability to maintain a safe nutrition route"
    ], [
      "Explain that nutrition treatment may need to start slowly when intake has been very low because rapid feeding can shift electrolytes into cells faster than the body can adapt.",
      "Build the discharge plan around affordable preferred foods, symptoms, culture, chewing and swallowing ability, and practical support because a technically ideal plan is ineffective if it cannot be followed."
    ]),
    card("Metabolic syndrome", ["nhlbi-metabolic-syndrome", "acc-hbp-2025"], [
      "Measure waist circumference, blood pressure, fasting glucose or A1c, triglycerides, and HDL cholesterol and assess sleep apnea, fatty liver, smoking, medications, pregnancy history, and family cardiovascular risk because clustered insulin resistance amplifies risk beyond any single abnormal value.",
      "Trend weight and waist, pressure pattern, glucose, lipids, kidney function, urine albumin, liver risk, activity, sleep, and medication tolerance because progression toward diabetes, CKD, and atherosclerotic disease is often silent.",
      "Create specific achievable nutrition, aerobic and resistance activity, sleep, and weight goals using motivational interviewing and barrier assessment because sustained modest changes improve several metabolic pathways at once.",
      "Administer prescribed pressure, lipid, glucose, and obesity therapy while monitoring orthostasis, muscle symptoms, glucose extremes, renal or hepatic limits, and adherence because each component needs treatment without multiplying avoidable adverse effects.",
      "Escalate for chest pressure, acute focal neurologic deficit, severe hyperglycemia with dehydration or ketones, hypoglycemia with altered consciousness, severe hypertension with organ symptoms, or rapidly worsening liver or kidney function because metabolic syndrome raises the likelihood of time-critical vascular and metabolic events."
    ], [
      "Chest pressure, diaphoresis, dyspnea, syncope, or acute ischemic electrocardiographic change",
      "Sudden facial droop, unilateral weakness, speech change, or vision loss",
      "Severe hyperglycemia with vomiting, ketones, dehydration, or altered consciousness",
      "Severe pressure with neurologic, cardiac, retinal, or kidney injury findings"
    ], [
      "Explain that the syndrome is a connected risk pattern rather than a single disease, so improving sleep, activity, food quality, weight, pressure, glucose, or lipids can benefit the others.",
      "Help the patient choose one measurable next step and a follow-up date rather than offering a vague instruction to lose weight, because repeatable change supports long-term retention and control."
    ]),
    card("Pressure injury stage 1", ["international-pressure-injury", "npiap-stages"], [
      "Confirm intact skin with localized nonblanchable erythema or a meaningful color, temperature, firmness, or sensory change in darker skin and compare with adjacent tissue because stage 1 injury can be missed when redness is not visible.",
      "Remove pressure immediately, identify the device or position responsible, float heels correctly, and select a support surface and repositioning interval based on tolerance because continued loading converts reversible ischemic stress into deeper tissue death.",
      "Inspect the site and all pressure points at each scheduled assessment, document size, color, temperature, pain, moisture, and blanch response without massaging the area because friction and massage can further damage ischemic capillaries.",
      "Manage moisture, incontinence, nutrition, mobility, pain, perfusion, and device fit and use protective dressings only as part of an offloading plan because covering skin does not remove the mechanical cause.",
      "Escalate for rapid color spread, purple or maroon change, blistering, increasing pain, bogginess, coolness, tissue breakdown, fever, or signs of poor limb perfusion because deeper tissue injury, infection, or ischemia may already be developing."
    ], [
      "Rapid progression from nonblanchable color change to blister or open tissue",
      "Purple or maroon discoloration, blood-filled blister, bogginess, or severe pain",
      "Cool pale distal skin, absent pulse, delayed capillary refill, or new numbness",
      "Spreading warmth or erythema, purulent drainage, fever, or systemic illness"
    ], [
      "Teach the patient and caregiver to report color, warmth, firmness, or pain before skin opens because stage 1 injury is an early opportunity to prevent deeper loss.",
      "Explain and demonstrate the individualized repositioning and device-check plan rather than relying on a fixed schedule that may not fit activity, perfusion, or tolerance."
    ]),
    card("Pressure injury stage 2", ["international-pressure-injury", "npiap-stages"], [
      "Confirm partial-thickness skin loss with exposed viable dermis or an intact or ruptured serum-filled blister and exclude moisture-associated dermatitis, adhesive injury, skin tear, and burn because those wounds have different mechanisms and are not staged as pressure injury.",
      "Offload the site and correct shear from sliding, transfers, tubing, footwear, or a medical device because exposed dermis will deepen if the same mechanical force continues.",
      "Measure length, width, shallow depth, wound bed, edges, drainage, pain, surrounding skin, and device relationship and photograph per policy because consistent documentation detects extension before obvious necrosis appears.",
      "Cleanse gently, maintain an appropriately moist protected wound environment, manage incontinence and friction, and monitor dressing-related maceration or allergy because viable dermis heals best when protected from drying and repeated chemical injury.",
      "Escalate for rapidly increasing size or depth, dusky tissue, blister expansion, purulence, spreading erythema, fever, severe pain, or perfusion loss because deeper pressure injury, infection, or ischemia requires reassessment and a new treatment plan."
    ], [
      "Rapid wound enlargement, increasing depth, or new slough or eschar",
      "Purple or dusky tissue, blood-filled blister, bogginess, or pain out of proportion",
      "Purulent drainage, spreading erythema, warmth, fever, or systemic decline",
      "Cool pale distal tissue, delayed refill, absent pulse, or new sensory loss"
    ], [
      "Teach hands-on offloading and transfer techniques because a dressing cannot heal a wound that remains compressed or repeatedly sheared.",
      "Explain which moisture barrier and dressing to use and when to change it, since excessive cleansing or leaving saturated material in place damages fragile new epithelium."
    ]),
    card("Pressure injury stage 3", ["international-pressure-injury", "npiap-stages"], [
      "Confirm full-thickness skin loss with visible adipose or granulation and no exposed fascia, muscle, tendon, cartilage, or bone, and assess undermining and tunneling because exposed deeper structures would make the wound stage 4.",
      "Measure length, width, deepest visible depth, undermining and tunnels by clock position, tissue type, drainage, odor after cleansing, pain, and periwound condition because three-dimensional progression can be hidden beneath intact edges.",
      "Provide continuous offloading, pressure redistribution, repositioning, moisture control, and nutrition and perfusion support because a full-thickness defect cannot granulate while compression, shear, or systemic deficits persist.",
      "Cleanse and dress according to exudate and tissue goals and coordinate appropriate debridement after perfusion and goals are assessed because devitalized tissue and excess fluid impede healing while indiscriminate debridement can injure ischemic tissue.",
      "Escalate for crepitus, rapidly spreading erythema, fever, hypotension, increasing necrosis, exposed or palpable bone, new severe pain, foul drainage, or failure to progress because invasive infection, osteomyelitis, ischemia, or an inaccurately staged deeper wound may be present."
    ], [
      "Crepitus, rapidly spreading erythema, bullae, skin necrosis, or pain out of proportion",
      "Fever, hypotension, confusion, rising lactate, or other sepsis findings",
      "Exposed or palpable bone, new deep tunnel, or abrupt increase in wound depth",
      "Cool ischemic tissue, absent pulse, progressive blackening, or stalled healing despite offloading"
    ], [
      "Teach the patient and caregiver how to offload during sleep, sitting, transfers, and device use because pressure exposure occurs across the entire day.",
      "Explain that drainage, odor, and wound size should be recorded consistently and that fever, spreading redness, or new deep pain requires prompt contact."
    ]),
    card("Pressure injury stage 4", ["international-pressure-injury", "npiap-stages"], [
      "Confirm full-thickness skin and tissue loss with exposed or directly palpable fascia, muscle, tendon, cartilage, or bone and map undermining and tunnels because stage 4 depth creates high risks for osteomyelitis, abscess, and structural injury.",
      "Assess and document wound dimensions, exposed structures, tissue viability, drainage, odor after cleansing, pain, periwound skin, perfusion, neurologic function, continence, nutrition, and systemic status because local treatment fails when pressure or systemic barriers remain.",
      "Institute complete offloading and an individualized support-surface and repositioning plan while protecting exposed tendon, joint, and bone from drying and trauma because repeated load and desiccation destroy structures needed for function.",
      "Coordinate wound, surgical, infectious-disease, nutrition, rehabilitation, and pain care; collect deep specimens or imaging as ordered rather than relying on a superficial swab because definitive debridement, osteomyelitis treatment, and closure require multidisciplinary source assessment.",
      "Activate urgent evaluation for crepitus, rapidly advancing necrosis, sepsis, uncontrolled hemorrhage, exposed joint with new instability, severe pain out of proportion, or sudden neurologic or vascular loss because necrotizing infection, vessel erosion, septic joint, or limb-threatening compromise may be present."
    ], [
      "Crepitus, bullae, rapidly spreading necrosis, or severe pain out of proportion",
      "Fever, hypotension, confusion, rising lactate, or rapidly falling urine output",
      "Uncontrolled wound bleeding or suspected erosion into a major vessel",
      "New weakness, numbness, absent pulse, exposed joint instability, or acute loss of function"
    ], [
      "Teach the exact offloading, dressing, nutrition, and follow-up plan and ask for return demonstration because stage 4 wounds require coordinated daily care rather than occasional dressing changes.",
      "Explain that antibiotics alone cannot correct dead tissue, pressure, or an uncontained abscess, which is why surgical and wound-team assessments may be necessary."
    ]),
    card("Unstageable pressure injury", ["international-pressure-injury", "npiap-stages"], [
      "Confirm full-thickness skin and tissue loss whose depth is obscured by slough or eschar and do not assign stage 3 or 4 until enough material is removed to expose the base because visual depth cannot be guessed safely.",
      "Assess perfusion, location, stability of eschar, drainage, fluctuance, odor after cleansing, surrounding erythema, warmth, pain, undermining that is visible, systemic illness, and goals of care because debridement benefit and urgency depend on ischemia and infection.",
      "Offload the site completely, correct shear and device pressure, protect surrounding skin, and choose a support surface and repositioning plan because obscured depth does not reduce the need to stop ongoing mechanical injury.",
      "Keep stable, dry, adherent heel or ischemic-limb eschar intact unless the specialist plan indicates otherwise, while escalating drainage, lifting edges, bogginess, or erythema because the eschar may serve as a biologic cover when perfusion is inadequate for healing.",
      "Escalate for crepitus, fluctuance, purulence, rapidly spreading erythema, wet gangrene, fever, hypotension, severe pain, or perfusion loss because an abscess, necrotizing infection, sepsis, or limb ischemia requires urgent source control and vascular assessment."
    ], [
      "Crepitus, bullae, fluctuance, purulence, or rapidly spreading erythema",
      "Wet gangrene, lifting heel eschar with drainage, or rapidly advancing necrosis",
      "Fever, hypotension, confusion, elevated lactate, or oliguria",
      "Cool pale limb, absent pulse, severe rest pain, or new sensory or motor loss"
    ], [
      "Teach that unstageable means the true depth is hidden, not that the wound is minor, and explain why specialist-directed debridement or observation is chosen.",
      "Show caregivers how to float the heel or offload the affected site without placing a ring-shaped device that concentrates pressure at the wound edge."
    ]),
    card("Partial-thickness burn", ["aba-burn-referral"], [
      "Stop the burning process, remove hot or contaminated items and nonadherent jewelry, cool a recent thermal burn with cool running water when appropriate, and avoid ice because prolonged extreme cooling worsens tissue injury and systemic hypothermia.",
      "Assess airway and inhalation exposure, burn mechanism and time, depth, total body surface area, circumferential involvement, face, hands, feet, genitalia, joints, age, comorbidities, and nonaccidental injury concern because location and mechanism can be more dangerous than visible size.",
      "Trend pain, temperature, distal pulses, capillary refill, sensation, motor function, edema, urine output for larger burns, wound color, blistering, drainage, and signs of conversion because partial-thickness injury can deepen during the first days.",
      "Cleanse gently, cover with the prescribed nonadherent dressing and topical plan, elevate an affected limb, provide multimodal analgesia and tetanus review, and preserve intact blisters according to burn-team policy because moisture balance and trauma prevention protect viable dermis.",
      "Escalate for hoarseness, soot or stridor, respiratory distress, circumferential vascular compromise, electrical or chemical mechanism, uncontrolled pain, large or high-risk location, fever with spreading infection, or abuse concern because airway, limb, systemic, or safeguarding threats require specialist care."
    ], [
      "Hoarseness, stridor, soot, facial burn, hypoxemia, or increasing respiratory distress",
      "Cool pale distal limb, absent pulse, delayed refill, severe pain, numbness, or circumferential tightness",
      "Electrical or significant chemical exposure, large surface area, or burn involving face, hands, feet, genitalia, or major joints",
      "Rapidly spreading erythema, purulence, fever, confusion, or unexplained injury pattern"
    ], [
      "Teach gentle washing, prescribed dressing changes, pain control before care, range of motion, and sun protection because healing dermis is fragile and prone to stiffness and pigment change.",
      "Tell the patient not to apply ice, grease, toothpaste, or adhesive home remedies and to report increasing pain, odor, drainage, fever, or reduced limb movement."
    ]),
    card("Fracture", ["aaos-fracture"], [
      "Assess mechanism, deformity, open wound, bleeding, pain, swelling, limb length and rotation, and distal pulses, color, temperature, capillary refill, sensation, and movement before and after every intervention because displacement or swelling can compromise vessels and nerves.",
      "Immobilize the joint above and below the suspected fracture in found position, control external bleeding, cover an open wound with sterile material, and avoid pushing exposed bone back because motion and contamination increase hemorrhage, soft-tissue damage, and infection.",
      "Trend pain quality and analgesic response, compartment firmness, passive-stretch pain, neurovascular findings, skin under splints or casts, temperature, respiratory status, and mental status because compartment syndrome and fat embolism may emerge after initial stabilization.",
      "Administer prescribed analgesia, antibiotics and tetanus care for open injury, thrombosis prophylaxis, and perioperative treatment while monitoring sedation, bleeding, renal limits, mobility, and wound response because comfort, infection prevention, and safe movement support union.",
      "Escalate immediately for pain out of proportion, pain with passive stretch, tense swelling, new paresthesia or weakness, absent pulse, uncontrolled hemorrhage, fever or drainage from an open fracture, or new hypoxemia with confusion and petechiae because compartment syndrome, vascular injury, infection, or fat embolism is time-critical."
    ], [
      "Pain out of proportion, passive-stretch pain, tense compartment, paresthesia, or weakness",
      "Absent or diminishing pulse, cool pallid limb, uncontrolled bleeding, or expanding hematoma",
      "Open fracture with gross contamination, fever, purulence, or systemic infection",
      "New hypoxemia, respiratory distress, confusion, tachycardia, or petechial rash after long-bone injury"
    ], [
      "Teach cast or splint protection, elevation as directed, safe mobility, and immediate reporting of increasing pain, numbness, cool digits, odor, or drainage because swelling and skin injury can progress unseen.",
      "Explain nutrition, tobacco avoidance, weight-bearing limits, and rehabilitation because bone union depends on blood supply, stability, substrate, and gradual mechanical loading."
    ]),
    card("Systemic lupus erythematosus", ["acr-lupus-2025"], [
      "Assess flare pattern, fatigue, fever, rash, ulcers, joints, chest pain, dyspnea, edema, urine change, headache, cognition, seizure, pregnancy plans, infection exposure, and medication adherence because lupus can inflame skin, blood, kidney, lung, heart, brain, and placenta.",
      "Trend pressure, weight, edema, temperature, blood count, creatinine, urine protein and sediment, complement and disease markers as ordered, liver tests, and medication-specific surveillance because nephritis, cytopenias, infection, and toxicity may be clinically quiet at first.",
      "Administer prescribed hydroxychloroquine, glucocorticoid, immunosuppressive, biologic, antihypertensive, and thrombosis-prevention therapy while checking eye screening, glucose, bone, infection, blood count, kidney, liver, and reproductive safety because organ protection must be balanced against treatment harm.",
      "Use sun protection, paced activity, vaccination planning with immunosuppression review, infection prevention, cardiovascular-risk care, and coordinated contraception or high-risk pregnancy counseling because ultraviolet exposure, infection, vascular risk, and pregnancy physiology can trigger complications.",
      "Escalate for new neurologic deficit, seizure, psychosis, severe headache, chest pain, hemoptysis, severe dyspnea, fever with instability, rapidly rising pressure or creatinine, oliguria, major bleeding, or pregnancy-related pain or hypertension because neuropsychiatric lupus, myocarditis, pulmonary hemorrhage, sepsis, nephritis, thrombosis, or obstetric emergency may be present."
    ], [
      "Seizure, focal deficit, psychosis, severe headache, or rapidly changing cognition",
      "Hemoptysis, severe dyspnea, hypoxemia, chest pain, or new dysrhythmia",
      "Fever with hypotension, neutropenia, confusion, or rapidly progressive infection",
      "Rapid creatinine rise, heavy proteinuria, oliguria, severe hypertension, major bleeding, or pregnancy emergency findings"
    ], [
      "Teach the difference between a possible flare and infection and advise early contact for fever rather than automatically increasing immunosuppression, because the treatments move in opposite directions.",
      "Explain daily sun protection, medication adherence, eye and laboratory monitoring, and pregnancy planning as organ-protection measures rather than disconnected restrictions."
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
  window.ANI_PATHOLOGY_NURSING_WAVE30_A = {
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
