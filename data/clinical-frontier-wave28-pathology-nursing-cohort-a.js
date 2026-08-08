(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  const VERSION = "2026-07-18-wave28-pathology-nursing-a-1";
  const sources = [
    { id: "aha-hbp-2025", label: "AHA/ACC, 2025 High Blood Pressure Guideline", url: "https://professional.heart.org/en/science-news/2025-high-blood-pressure-guideline/top-things-to-know", note: "Supports accurate blood-pressure measurement, cardiovascular-risk reduction, treatment adherence, and evaluation of severe hypertension with target-organ injury." },
    { id: "esc-pericardial-2025", label: "European Society of Cardiology, 2025 Myocarditis and Pericarditis Guidelines", url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/myocarditis-and-pericarditis/", note: "Supports pericarditis assessment, anti-inflammatory care, activity restriction, recurrence surveillance, and recognition of tamponade." },
    { id: "acc-aortic-2022", label: "ACC/AHA, 2022 Aortic Disease Guideline", url: "https://www.acc.org/guidelines/guidelines/2022/11/01/12/50/2022-guideline-for-the-diagnosis-and-management-of-aortic-disease", note: "Supports aneurysm surveillance, blood-pressure control, acute aortic-syndrome recognition, and size- and growth-based specialist referral." },
    { id: "aha-af-2023", label: "ACC/AHA/ACCP/HRS, 2023 Atrial Fibrillation Guideline", url: "https://professional.heart.org/en/science-news/2023-acc-aha-accp-hrs-guideline-for-the-diagnosis-and-management-of-atrial-fibrillation", note: "Supports rhythm assessment, stroke-risk evaluation, anticoagulant safety, rate or rhythm control, and risk-factor management." },
    { id: "acc-acs-2025", label: "ACC/AHA, 2025 Acute Coronary Syndromes Guideline", url: "https://www.acc.org/guidelines/guidelines/2025/02/27/17/21/acute-coronary-syndromes-2025", note: "Supports rapid electrocardiography, serial biomarkers, reperfusion pathways, antithrombotic safety, complication surveillance, and rehabilitation after acute coronary syndromes." },
    { id: "acc-ccd-2023", label: "AHA/ACC, 2023 Chronic Coronary Disease Guideline", url: "https://www.acc.org/Guidelines/Guidelines/2023/07/20/12/34/Chronic-Coronary-Disease", note: "Supports chronic symptom assessment, antianginal and secondary-prevention therapy, lipid and risk-factor control, exercise, cardiac rehabilitation, and escalation when stable symptoms change." },
    { id: "ash-vte-2020", label: "American Society of Hematology, Venous Thromboembolism Treatment Guidelines", url: "https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines", note: "Supports anticoagulation, bleeding surveillance, recurrence prevention, and escalation for limb- or life-threatening venous thromboembolism." },
    { id: "aha-endocarditis", label: "American Heart Association, Infective Endocarditis in Adults Scientific Statement", url: "https://professional.heart.org/en/science-news/infective-endocarditis-in-adults-diagnosis-antimicrobial-therapy-and-management-of-complications", note: "Supports blood cultures, antimicrobial therapy, embolic and valve-complication surveillance, and multidisciplinary endocarditis management." },
    { id: "acc-bradycardia-2018", label: "ACC/AHA/HRS, 2018 Bradycardia and Cardiac Conduction Delay Guideline", url: "https://www.acc.org/guidelines/guidelines/2018/11/06/12/02/2018-guideline-on-the-evaluation-and-management-of-patients-with-bradycardia-and-cardiac-conduction-delay", note: "Supports symptom-rhythm correlation, reversible-cause assessment, pacing decisions, and emergency response to unstable high-grade atrioventricular block." },
    { id: "aha-als-2025", label: "American Heart Association, 2025 Adult Advanced Life Support", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support", note: "Supports unstable tachycardia and bradycardia recognition, synchronized cardioversion, pacing, and cardiac-arrest response." },
    { id: "bts-pleural-2023", label: "British Thoracic Society, Pleural Disease Guideline", url: "https://www.brit-thoracic.org.uk/quality-improvement/guidelines/pleural-disease/", note: "Supports pneumothorax and pleural-effusion assessment, drainage, chest-tube safety, imaging follow-up, and urgent escalation for tension physiology." },
    { id: "apa-schizophrenia-2020", label: "American Psychiatric Association, Schizophrenia Treatment Guideline", url: "https://psychiatryonline.org/doi/book/10.1176/appi.books.9780890424841", note: "Supports antipsychotic adverse-effect assessment, including immediate recognition of neuroleptic malignant syndrome and medication-related movement emergencies." },
    { id: "acs-trauma", label: "American College of Surgeons, Trauma Quality Programs Best Practices", url: "https://www.facs.org/quality-programs/trauma/tqp/center-programs/tqp-best-practice/", note: "Supports structured trauma resuscitation, amputation and electrical-injury care, hemorrhage control, neurovascular assessment, and transfer to definitive care." },
    { id: "ems-amputation", label: "National Highway Traffic Safety Administration, EMT Instructional Guidelines", url: "https://www.ems.gov/assets/EMT_Instructional_Guidelines.pdf", note: "Supports sterile saline-moistened wrapping, waterproof bagging, indirect cooling, and avoidance of freezing or soaking an amputated part during transport." },
    { id: "aad-sjs", label: "American Academy of Dermatology, Stevens-Johnson Syndrome and Toxic Epidermal Necrolysis", url: "https://www.aad.org/public/diseases/a-z/stevens-johnson-syndrome-overview", note: "Supports immediate drug review, skin and mucosal protection, fluid and temperature management, and urgent specialty care for severe epidermal injury." },
    { id: "international-pressure-injury", label: "International Guideline for Prevention and Treatment of Pressure Ulcers/Injuries", url: "https://internationalguideline.com/", note: "Supports risk assessment, pressure redistribution, skin and perfusion evaluation, nutrition, staging, and escalation of deep or infected pressure injury." },
    { id: "aba-burn-referral", label: "American Burn Association, Burn Patient Referral Guidelines", url: "https://ameriburn.org/resources/burnreferral/", note: "Supports burn-size and depth assessment, inhalation and electrical-injury recognition, fluid and temperature priorities, and burn-center consultation." },
    { id: "aast-rhabdo", label: "American Association for the Surgery of Trauma, Rhabdomyolysis Clinical Consensus", url: "https://www.aast.org/resources-detail/rhabdomyolysis", note: "Supports creatine-kinase and electrolyte surveillance, goal-directed fluid therapy, urine-output monitoring, and recognition of renal and cardiac complications." },
    { id: "gina-2025", label: "Global Initiative for Asthma, Global Strategy for Asthma Management and Prevention", url: "https://ginasthma.org/reports/", note: "Supports severity assessment, inhaled anti-inflammatory treatment, spacer technique, written action plans, and escalation of life-threatening asthma." },
    { id: "gold-2026", label: "Global Initiative for Chronic Obstructive Lung Disease, GOLD Report", url: "https://goldcopd.org/2026-gold-report-and-pocket-guide/", note: "Supports COPD assessment, inhaled therapy, oxygen targets, exacerbation treatment, pulmonary rehabilitation, and prevention." },
    { id: "idsa-cap", label: "IDSA, Adult Community-Acquired Pneumonia Clinical Pathway", url: "https://www.idsociety.org/globalassets/idsa/practice-guidelines/community-acquired-pneumonia-in-adults/cap-clinical-pathway-final-online.pdf", note: "Supports pneumonia severity assessment, diagnostic testing, antimicrobial therapy, response monitoring, and de-escalation." },
    { id: "nice-pneumonia-2025", label: "National Institute for Health and Care Excellence, Pneumonia: Diagnosis and Management", url: "https://www.nice.org.uk/guidance/NG250", note: "Supports assessment and treatment of community- and hospital-acquired pneumonia in babies over one month, children, young people, and adults, including severity, microbiology, respiratory support, reassessment, and follow-up." },
    { id: "sccm-sepsis-2026", label: "Society of Critical Care Medicine, Surviving Sepsis Campaign Adult Guidelines", url: "https://sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines", note: "Supports rapid organ-dysfunction recognition, cultures, antimicrobials, perfusion reassessment, vasoactive care, and source control in infection and multiple-organ dysfunction." },
    { id: "aha-hf-2022", label: "AHA/ACC/HFSA, 2022 Heart Failure Guideline", url: "https://professional.heart.org/en/science-news/2022-guideline-for-the-management-of-heart-failure", note: "Supports assessment and treatment of acute congestion and chronic heart failure, diuretic and laboratory monitoring, guideline-directed therapy, self-monitoring, rehabilitation, and referral for advanced disease." },
    { id: "cdc-shingles", label: "Centers for Disease Control and Prevention, Clinical Overview of Shingles", url: "https://www.cdc.gov/shingles/hcp/clinical-overview/index.html", note: "Supports antiviral treatment, lesion precautions, pain assessment, and airborne-contact isolation for disseminated herpes zoster." },
    { id: "cdc-influenza", label: "Centers for Disease Control and Prevention, Clinical Guidance for Influenza", url: "https://www.cdc.gov/flu/hcp/", note: "Supports testing and antiviral decisions, droplet precautions, complication recognition, vaccination, and high-risk influenza care." },
    { id: "cdc-malaria", label: "Centers for Disease Control and Prevention, Malaria Clinical Guidance", url: "https://www.cdc.gov/malaria/hcp/clinical-guidance/index.html", note: "Supports urgent parasite testing, species and severity assessment, antimalarial treatment, glucose and organ monitoring, and prevention counseling." },
    { id: "cdc-pertussis", label: "Centers for Disease Control and Prevention, Clinical Overview of Pertussis", url: "https://www.cdc.gov/pertussis/hcp/clinical-overview/index.html", note: "Supports droplet precautions, antimicrobial therapy, infant apnea surveillance, vaccination, postexposure prophylaxis, and public-health reporting." },
    { id: "cdc-rabies", label: "Centers for Disease Control and Prevention, Clinical Overview of Rabies", url: "https://www.cdc.gov/rabies/hcp/clinical-overview/index.html", note: "Supports wound cleansing, exposure risk assessment, immune globulin and vaccine delivery, public-health consultation, and symptom recognition." },
    { id: "cdc-hai", label: "Centers for Disease Control and Prevention, Healthcare-Associated Infection and Antimicrobial Resistance Guidance", url: "https://www.cdc.gov/healthcare-associated-infections/hcp/infection-control/index.html", note: "Supports contact precautions, environmental and device care, antimicrobial stewardship, and prevention of MRSA and vancomycin-resistant Enterococcus transmission." },
    { id: "cdc-vre", label: "Centers for Disease Control and Prevention, Vancomycin-resistant Enterococci", url: "https://www.cdc.gov/vre/about/index.html", note: "Supports recognition of VRE colonization versus infection, susceptibility-directed treatment, hand hygiene, contact control, and healthcare transmission prevention." },
    { id: "cdc-mrsa", label: "Centers for Disease Control and Prevention, Clinical Overview of MRSA in Healthcare Settings", url: "https://www.cdc.gov/mrsa/hcp/clinical-overview/index.html", note: "Supports culture-based diagnosis, drainage and susceptibility-guided therapy, severe-infection recognition, wound containment, and healthcare prevention." },
    { id: "idsa-cdiff", label: "IDSA/SHEA, Clostridioides difficile Infection Guideline", url: "https://www.idsociety.org/practice-guideline/clostridium-difficile/", note: "Supports stool-testing stewardship, contact precautions, setting-specific hand hygiene, treatment, recurrence assessment, and fulminant-infection escalation." },
    { id: "cdc-hand-hygiene", label: "Centers for Disease Control and Prevention, Clinical Safety: Hand Hygiene for Healthcare Workers", url: "https://www.cdc.gov/clean-hands/hcp/clinical-safety/index.html", note: "Supports alcohol-based hand rub for most routine clinical care, soap and water when visibly soiled, and additional soap-and-water handwashing during C. difficile outbreaks while preserving glove use and environmental controls." },
    { id: "idsa-covid", label: "Infectious Diseases Society of America, COVID-19 Treatment and Management Guideline", url: "https://www.idsociety.org/practice-guideline/covid-19-guideline-treatment-and-management/", note: "Supports severity-based antiviral and anti-inflammatory treatment, oxygen and thrombosis surveillance, and avoidance of unsupported therapies." },
    { id: "cdc-rmsf", label: "Centers for Disease Control and Prevention, Rocky Mountain Spotted Fever Clinical Care", url: "https://www.cdc.gov/rocky-mountain-spotted-fever/hcp/clinical-care/index.html", note: "Supports immediate doxycycline treatment without waiting for confirmatory testing and surveillance for neurologic, renal, pulmonary, and vascular complications." },
    { id: "cdc-tetanus", label: "Centers for Disease Control and Prevention, Tetanus Clinical Care", url: "https://www.cdc.gov/tetanus/hcp/clinical-care/index.html", note: "Supports immune globulin, wound care, antimicrobial therapy, spasm and autonomic monitoring, vaccination, and intensive supportive care." },
    { id: "cdc-measles", label: "Centers for Disease Control and Prevention, Measles Clinical Diagnosis and Management", url: "https://www.cdc.gov/measles/hcp/clinical-overview/index.html", note: "Supports airborne isolation, public-health notification, diagnostic sampling, vitamin A treatment in children, and complication surveillance." },
    { id: "cdc-stss", label: "Centers for Disease Control and Prevention, Streptococcal Toxic Shock Syndrome", url: "https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/streptococcal-toxic-shock-syndrome.html", note: "Supports early recognition of streptococcal toxin-mediated shock, urgent hospital treatment, source control, and surveillance for rapidly progressive organ failure." },
    { id: "fda-tampon-tss", label: "U.S. Food and Drug Administration, Tampon Safety and Toxic Shock Syndrome", url: "https://www.fda.gov/consumers/consumer-updates/facts-tampons-and-how-use-them-safely", note: "Supports recognition of menstrual tampon-associated toxic shock warning signs, immediate tampon removal, emergency evaluation, and safer tampon-use education." },
    { id: "idsa-osteomyelitis", label: "Infectious Diseases Society of America, Native Vertebral Osteomyelitis in Adults", url: "https://www.idsociety.org/practice-guideline/vertebral-osteomyelitis/", note: "Supports cultures and imaging, organism-directed therapy, neurologic surveillance, source control, and treatment-response monitoring for adult native vertebral osteomyelitis." },
    { id: "idsa-diabetic-foot", label: "IWGDF/IDSA, Diabetes-Related Foot Infection and Osteomyelitis Guideline", url: "https://www.idsociety.org/practice-guideline/diabetic-foot-infections/", note: "Supports deep or bone cultures, imaging, antimicrobial therapy, off-loading, vascular and surgical consultation, and follow-up for diabetes-related foot osteomyelitis." },
    { id: "pids-aho", label: "PIDS/IDSA, Acute Hematogenous Osteomyelitis in Pediatrics", url: "https://www.idsociety.org/practice-guideline/bone-and-joint-infections---osteomyelitis/", note: "Supports blood cultures, imaging, inflammatory-marker trends, antimicrobial therapy, debridement, and response monitoring for pediatric acute hematogenous osteomyelitis." },
    { id: "idsa-pji", label: "Infectious Diseases Society of America, Prosthetic Joint Infection Guideline", url: "https://www.idsociety.org/practice-guideline/prosthetic-joint-infection/", note: "Supports diagnostic sampling, multidisciplinary source control, organism-directed therapy, and monitoring when prosthetic material or hardware is infected." },
    { id: "acog-accreta", label: "ACOG/SMFM, Placenta Accreta Spectrum", url: "https://www.acog.org/clinical/clinical-guidance/obstetric-care-consensus/articles/2018/12/placenta-accreta-spectrum", note: "Supports antenatal risk recognition, delivery at an experienced center, hemorrhage preparation, avoidance of placental disruption, and multidisciplinary surgical care." },
    { id: "acog-labor", label: "American College of Obstetricians and Gynecologists, First and Second Stage Labor Management", url: "https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2024/01/first-and-second-stage-labor-management", note: "Supports structured labor progress and fetal surveillance, recognition of failed progress, and timely operative response to maternal or fetal deterioration." },
    { id: "acog-vbac", label: "American College of Obstetricians and Gynecologists, Vaginal Birth After Cesarean Delivery", url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2019/02/vaginal-birth-after-cesarean-delivery", note: "Supports uterine-scar rupture risk assessment, continuous surveillance during trial of labor after cesarean, immediate operative capability, counseling, and future-pregnancy planning after rupture risk." },
    { id: "smfm-vasa-previa", label: "Society for Maternal-Fetal Medicine, Diagnosis and Management of Vasa Previa", url: "https://publications.smfm.org/publications/215-society-for-maternal-fetal-medicine-smfm-consult-series-37/", note: "Supports prenatal diagnosis, corticosteroids and surveillance, planned cesarean birth, and emergency response to bleeding or membrane rupture." },
    { id: "acog-rh", label: "American College of Obstetricians and Gynecologists, Prevention of Rh D Alloimmunization", url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2017/08/prevention-of-rh-d-alloimmunization", note: "Supports antibody screening, Rh immune globulin timing, fetomaternal-hemorrhage assessment, and fetal surveillance when alloimmunization occurs." },
    { id: "cdc-congenital", label: "Centers for Disease Control and Prevention, Congenital Cytomegalovirus", url: "https://www.cdc.gov/cytomegalovirus/about/index.html", note: "Supports maternal exposure prevention, newborn evaluation for congenital cytomegalovirus, and hearing and developmental follow-up." },
    { id: "cdc-congenital-rubella", label: "Centers for Disease Control and Prevention, Congenital Rubella Syndrome", url: "https://www.cdc.gov/surv-manual/php/table-of-contents/chapter-15-congenital-rubella-syndrome.html", note: "Supports maternal timing and exposure history, organism-specific newborn testing, recognition of cardiac, ocular, hearing, growth, skin, and neurologic manifestations, public-health reporting, and long-term follow-up for congenital rubella." },
    { id: "cdc-toxoplasmosis", label: "Centers for Disease Control and Prevention, Clinical Care of Toxoplasmosis", url: "https://www.cdc.gov/toxoplasmosis/hcp/clinical-care/index.html", note: "Supports pregnancy- and fetal-status-specific toxoplasmosis therapy, toxicity monitoring, and recognition of congenital neurologic and ocular disease." },
    { id: "cdc-sti-2021", label: "Centers for Disease Control and Prevention, Sexually Transmitted Infections Treatment Guidelines", url: "https://www.cdc.gov/std/treatment-guidelines/default.htm", note: "Supports pelvic inflammatory disease and syphilis treatment, pregnancy-specific testing, partner management, prevention, and escalation of severe infection." },
    { id: "smfm-afe", label: "Society for Maternal-Fetal Medicine, Amniotic Fluid Embolism", url: "https://publications.smfm.org/publications/81-smfm-clinical-guidelines-9-amniotic-fluid-embolism-diagnosis/", note: "Supports clinical recognition, immediate cardiopulmonary resuscitation, hemorrhage and coagulopathy management, fetal planning, and multidisciplinary critical care." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const cards = [
    card("Hypertension", ["aha-hbp-2025"], [
      "Measure blood pressure with the correct cuff after seated rest and confirm unexpected readings because technique error can mimic poor control or hide severe hypertension.",
      "Assess headache, vision, neurologic status, chest pain, dyspnea, pulses, urine output, and pregnancy status because symptoms determine whether high pressure is causing acute target-organ injury.",
      "Administer prescribed antihypertensives and trend pressure, pulse, orthostasis, creatinine, potassium, and sodium because excessive lowering, bradycardia, kidney injury, and electrolyte change are treatment complications.",
      "Review adherence, nonprescription decongestants or stimulants, pain, sleep apnea, sodium intake, alcohol, tobacco, weight, and activity because reversible exposures and cardiometabolic risks sustain hypertension.",
      "Escalate immediately for pressure above 180/120 with new focal deficit, confusion, chest or tearing back pain, pulmonary edema, seizure, vision loss, or oliguria because this pattern suggests hypertensive emergency rather than an isolated number."
    ], [
      "Severe pressure with focal neurologic deficit, seizure, or confusion",
      "Chest pain, tearing back pain, pulse difference, or syncope",
      "Acute dyspnea, crackles, frothy sputum, or falling oxygen saturation",
      "Rapid vision loss, pregnancy-related severe headache, or sharply reduced urine output"
    ], [
      "Teach home blood-pressure technique, a written log, and medicine timing because trends are more useful than reacting to one reading.",
      "Explain that hypertension may be silent while damaging heart, brain, kidneys, and eyes, and review the exact emergency symptoms that require immediate care."
    ]),
    card("Pericarditis", ["esc-pericardial-2025"], [
      "Assess positional pleuritic chest pain, recent infection, fever, friction rub, dyspnea, and hemodynamic status because pericardial inflammation can resemble myocardial ischemia or progress to effusion.",
      "Obtain ordered electrocardiograms, troponin, inflammatory markers, and echocardiography because diffuse electrical change, myocardial involvement, and fluid accumulation alter risk and treatment.",
      "Administer prescribed anti-inflammatory therapy with gastric and kidney-safety monitoring because controlling inflammation relieves pain and reduces recurrence while treatment can cause bleeding or renal injury.",
      "Maintain activity restriction and monitor pulse, blood pressure, jugular venous pressure, heart sounds, oxygenation, and urine output because rising intrapericardial pressure impairs ventricular filling and cardiac output.",
      "Escalate immediately for hypotension, tachycardia, rising neck veins, muffled heart sounds, pulsus paradoxus, syncope, worsening dyspnea, or electrical alternans because tamponade requires urgent drainage."
    ], [
      "Hypotension with rising jugular venous pressure or muffled heart sounds",
      "Syncope, confusion, cool skin, or rapidly falling urine output",
      "Worsening dyspnea, tachycardia, or pulsus paradoxus",
      "New ventricular dysfunction, arrhythmia, or increasing troponin suggesting myopericarditis"
    ], [
      "Explain that sitting forward may reduce pain but does not prove the condition is benign; worsening breathlessness or fainting needs emergency evaluation.",
      "Teach medication adherence and prescribed exercise restriction because premature strenuous activity can worsen myocardial involvement and recurrence."
    ]),
    card("Aortic aneurysm", ["acc-aortic-2022"], [
      "Assess aneurysm location and size, prior imaging, family history, connective-tissue disease, blood pressure, pulses, abdominal or back pain, and neurologic findings because rupture and dissection risk depends on anatomy, growth, and inherited vulnerability.",
      "Maintain ordered blood-pressure and heart-rate goals and administer prescribed anti-impulse therapy because reducing aortic wall stress slows expansion and limits propagation of an acute tear.",
      "Compare bilateral arm pressures and peripheral pulses and monitor abdominal girth, perfusion, urine output, hemoglobin, and mental status because leakage or branch-vessel compromise may first appear as asymmetric or organ-specific ischemia.",
      "Coordinate surveillance imaging and vascular or cardiothoracic follow-up because rapid growth and threshold diameter can justify planned repair before rupture.",
      "Escalate immediately for sudden tearing chest, back, or abdominal pain, hypotension, syncope, new pulse deficit, focal neurologic deficit, painful ischemic limb, or rapidly falling hemoglobin because rupture or dissection is time critical."
    ], [
      "Sudden severe chest, back, flank, or abdominal pain",
      "Hypotension, syncope, pallor, or rapidly falling hemoglobin",
      "New unequal pressures, absent pulse, cold limb, or focal neurologic deficit",
      "New aortic-regurgitation murmur, pulmonary edema, or tamponade signs"
    ], [
      "Teach strict blood-pressure control, tobacco cessation, lifting limits, and scheduled imaging because an aneurysm can enlarge without symptoms.",
      "Tell the patient to call emergency services for sudden severe torso pain, fainting, weakness, or a cold painful limb rather than driving to clinic."
    ]),
    card("Atrial fibrillation", ["aha-af-2023", "aha-als-2025"], [
      "Assess pulse deficit, ventricular rate, blood pressure, oxygenation, chest pain, dyspnea, dizziness, onset time, and prior rhythm because stability and duration guide urgent cardioversion and anticoagulation decisions.",
      "Maintain continuous rhythm monitoring and obtain a 12-lead electrocardiogram, potassium, magnesium, thyroid studies, and ordered cardiac tests because reversible triggers and conduction patterns affect treatment safety.",
      "Administer prescribed rate- or rhythm-control therapy and reassess pressure, rate, QT interval, and symptoms because excessive nodal blockade can cause hypotension or bradycardia.",
      "Verify stroke-risk and bleeding-risk assessment and administer anticoagulation safely while monitoring hemoglobin, stool or urine blood, kidney function, and interactions because atrial stasis causes embolic stroke while treatment can cause hemorrhage.",
      "Escalate immediately for hypotension, ischemic chest pain, pulmonary edema, syncope, shock, a new focal deficit, or uncontrolled rapid ventricular response because unstable atrial fibrillation may require synchronized cardioversion or stroke activation."
    ], [
      "Hypotension, shock, syncope, or altered consciousness with rapid atrial fibrillation",
      "Ischemic chest pain or acute pulmonary edema",
      "New facial droop, weakness, speech change, or vision loss",
      "Major bleeding, black stool, severe headache, or falling hemoglobin on anticoagulation"
    ], [
      "Teach pulse and symptom monitoring, medication timing, interaction checks, and why anticoagulation prevents stroke even when palpitations stop.",
      "Explain emergency signs of stroke, major bleeding, fainting, chest pain, or severe breathlessness and reinforce risk-factor care for blood pressure, sleep apnea, alcohol, weight, and activity."
    ]),
    card("Coronary artery disease", ["acc-ccd-2023", "acc-acs-2025", "aha-hbp-2025"], [
      "Assess exertional chest pressure, dyspnea, fatigue, radiation, triggers, relief, diabetes-related atypical symptoms, and cardiovascular risks because myocardial ischemia may present without classic pain.",
      "Obtain an electrocardiogram and troponin promptly for new, rest, accelerating, or prolonged symptoms because stable plaque disease can become an acute thrombotic coronary syndrome.",
      "Administer prescribed antiplatelet, lipid-lowering, antianginal, and blood-pressure therapy while monitoring bleeding, liver or muscle symptoms, pulse, and pressure because secondary prevention reduces plaque events but requires safety surveillance.",
      "Balance activity with symptom-guided pacing and coordinate cardiac rehabilitation because graded exercise improves functional capacity while uncontrolled ischemia requires evaluation before exertion.",
      "Escalate immediately for chest pressure at rest, symptoms lasting despite rest or prescribed nitroglycerin, diaphoresis, syncope, new arrhythmia, heart-failure signs, or dynamic electrocardiographic change because acute coronary occlusion may be developing."
    ], [
      "New or accelerating chest pressure at rest",
      "Pain persisting after rest and the prescribed nitroglycerin plan",
      "Syncope, hypotension, diaphoresis, or unstable rhythm",
      "Acute dyspnea, crackles, or new ST-segment change"
    ], [
      "Teach the difference between a stable predictable symptom pattern and new rest or accelerating symptoms that require emergency services.",
      "Reinforce tobacco cessation, cardiac rehabilitation, medication adherence, blood-pressure and lipid control, and carrying an updated medication list."
    ]),
    card("Deep vein thrombosis", ["ash-vte-2020"], [
      "Assess unilateral swelling, warmth, tenderness, color, circumference, mobility, recent surgery, cancer, pregnancy, and prior thrombosis because venous obstruction and recurrence risk guide urgency and treatment duration.",
      "Avoid massaging the affected limb and obtain ordered compression ultrasound and laboratory testing because physical manipulation is unnecessary and objective confirmation prevents both missed thrombosis and unsafe anticoagulation.",
      "Administer prescribed anticoagulation after checking weight, kidney function, platelet count, hemoglobin, pregnancy status, and interactions because correct drug and dose prevent extension while limiting bleeding.",
      "Monitor limb findings, chest symptoms, oxygenation, hemoglobin, platelets, stool or urine blood, and anticoagulant-specific tests because pulmonary embolism, heparin-induced thrombocytopenia, and hemorrhage can complicate therapy.",
      "Escalate immediately for sudden dyspnea, pleuritic chest pain, hemoptysis, syncope, hypoxemia, hypotension, rapidly worsening limb swelling, phlegmasia, or major bleeding because embolism or limb-threatening obstruction requires urgent intervention."
    ], [
      "Sudden dyspnea, pleuritic chest pain, hemoptysis, or falling oxygen saturation",
      "Syncope, hypotension, tachycardia, or shock",
      "Rapid whole-limb swelling, cyanosis, severe pain, or threatened perfusion",
      "Severe headache, gastrointestinal bleeding, expanding hematoma, or falling hemoglobin"
    ], [
      "Teach exact anticoagulant dosing, missed-dose instructions, interaction and bleeding precautions, and why stopping early permits clot extension or recurrence.",
      "Encourage prescribed ambulation and compression, hydration during travel, and emergency care for chest pain, breathlessness, fainting, or major bleeding."
    ]),
    card("Endocarditis", ["aha-endocarditis"], [
      "Obtain the ordered sets of blood cultures from separate sites before antibiotics when this does not delay unstable care because identifying the organism guides prolonged curative therapy.",
      "Assess fever, murmur, heart-failure signs, skin and nail findings, neurologic status, abdominal or flank pain, limb perfusion, and injection or device history because infected vegetations can destroy valves and embolize to multiple organs.",
      "Administer organism-directed intravenous antibiotics exactly on schedule and monitor levels, kidney function, blood counts, line sites, and cultures because sustained bactericidal exposure is needed while toxicity and line infection remain risks.",
      "Trend temperature, inflammatory markers, rhythm, oxygenation, urine output, and new embolic findings and coordinate echocardiography because persistent bacteremia or valve dysfunction may require surgery rather than antibiotics alone.",
      "Escalate immediately for acute pulmonary edema, new conduction block, persistent bacteremia, severe valve regurgitation, focal neurologic deficit, painful cold limb, splenic-type pain, or shock because abscess, valve failure, or embolization is life threatening."
    ], [
      "New heart failure, pulmonary edema, or rapidly changing murmur",
      "New PR prolongation, heart block, or unstable rhythm",
      "Focal neurologic deficit, severe abdominal pain, or acute limb ischemia",
      "Persistent fever or positive cultures despite appropriate antibiotics"
    ], [
      "Teach completion of the full intravenous antibiotic course and line-care plan because partial treatment permits relapse and resistant infection.",
      "Explain oral hygiene, follow-up cultures and imaging, and which high-risk cardiac conditions require dental-procedure prophylaxis after clinician review."
    ]),
    card("Myocardial infarction", ["acc-acs-2025", "aha-als-2025"], [
      "Activate the acute coronary pathway, obtain a 12-lead electrocardiogram within minutes, and repeat it with serial troponin because evolving occlusion may not appear on the first tracing.",
      "Assess chest pressure, dyspnea, diaphoresis, nausea, atypical symptoms, blood pressure, perfusion, heart-failure signs, and onset time because infarct location and instability determine reperfusion urgency.",
      "Administer prescribed antiplatelet, anticoagulant, anti-ischemic, and reperfusion therapy while checking allergies, bleeding, pressure, kidney function, and contraindications because restoring coronary flow saves myocardium but can cause hemorrhage or hypotension.",
      "Maintain continuous ST-segment and rhythm monitoring and trend pain, lung sounds, urine output, electrolytes, and hemodynamics because reinfarction, ventricular arrhythmia, shock, and mechanical rupture can develop abruptly.",
      "Escalate immediately for recurrent or persistent ischemia, ventricular tachycardia or fibrillation, advanced heart block, pulmonary edema, new harsh murmur, hypotension, syncope, or rising lactate because urgent catheterization or mechanical support may be required."
    ], [
      "Persistent or recurrent chest pressure with dynamic ST change",
      "Ventricular tachycardia, ventricular fibrillation, or advanced heart block",
      "Hypotension, cool skin, oliguria, confusion, or rising lactate",
      "New murmur, pulmonary edema, or sudden hemodynamic collapse"
    ], [
      "Teach calling emergency services for recurrent pressure rather than driving, and explain that early reperfusion limits permanent heart damage.",
      "Reinforce cardiac rehabilitation, medication adherence, tobacco cessation, activity progression, and bleeding precautions before discharge."
    ]),
    card("Second-degree AV block Type II", ["acc-bradycardia-2018", "aha-als-2025"], [
      "Identify constant PR intervals with intermittently dropped QRS complexes and correlate the rhythm with pulse and symptoms because Mobitz II reflects unreliable His-Purkinje conduction and can progress suddenly to complete block.",
      "Assess blood pressure, consciousness, chest pain, dyspnea, perfusion, and heart-failure signs while maintaining continuous telemetry because ventricular pauses can abruptly reduce cardiac output.",
      "Apply pacing pads, establish intravenous access, and prepare transcutaneous followed by transvenous pacing because atropine may be ineffective when the block lies below the atrioventricular node.",
      "Review ischemia, potassium, magnesium, thyroid status, hypoxia, and nodal-blocking medicines and hold or clarify contributing therapy because reversible causes should be corrected without delaying pacing readiness.",
      "Escalate immediately for hypotension, syncope, ischemic chest pain, acute heart failure, confusion, ventricular escape slowing, consecutive dropped beats, or progression to complete block because unstable Mobitz II needs immediate pacing support."
    ], [
      "Syncope, hypotension, confusion, or shock",
      "Chest pain, acute pulmonary edema, or worsening heart failure",
      "Long pauses, consecutive nonconducted P waves, or slowing escape rhythm",
      "Progression to third-degree block or ventricular arrest"
    ], [
      "Explain that this block can worsen without warning even when the pulse feels acceptable, which is why pacing evaluation is urgent.",
      "Teach the patient to report fainting, near-fainting, new breathlessness, chest pain, or device-site problems after pacemaker placement."
    ]),
    card("Third-degree AV block", ["acc-bradycardia-2018", "aha-als-2025"], [
      "Confirm atrioventricular dissociation and identify the atrial and ventricular rates while checking a palpable pulse because complete block leaves cardiac output dependent on an unreliable escape rhythm.",
      "Assess consciousness, pressure, chest pain, dyspnea, perfusion, urine output, and heart-failure signs continuously because severe bradycardia can cause cerebral, coronary, and renal hypoperfusion.",
      "Apply pacing and defibrillation pads, establish intravenous access, provide ordered oxygen, and prepare immediate transcutaneous and transvenous pacing because medicines alone may not maintain a dependable ventricular rate.",
      "Obtain electrocardiography, troponin, potassium, magnesium, medication levels, and infection or ischemia evaluation because infarction, toxicity, electrolyte disturbance, and conduction disease can cause complete block.",
      "Escalate immediately for syncope, hypotension, altered consciousness, ischemic pain, pulmonary edema, ventricular escape below a safe rate, pauses, or pulselessness because complete block can deteriorate directly into cardiac arrest."
    ], [
      "Syncope, altered consciousness, hypotension, or shock",
      "Ischemic chest pain or acute pulmonary edema",
      "Very slow or widening ventricular escape rhythm with pauses",
      "Loss of pulse or failure to capture during pacing"
    ], [
      "Explain that atria and ventricles are no longer communicating electrically, so a pacemaker often becomes the reliable bridge for each heartbeat.",
      "After pacing, teach pulse checks, incision care, device follow-up, electromagnetic precautions, and urgent reporting of fainting or persistent hiccups."
    ]),
    card("Supraventricular tachycardia", ["aha-als-2025"], [
      "Assess rate, regularity, QRS width, onset, blood pressure, consciousness, chest pain, dyspnea, and perfusion because unstable tachycardia requires electricity rather than prolonged diagnostic delay.",
      "Obtain a 12-lead electrocardiogram and review prior episodes, stimulant exposure, thyroid status, pregnancy, potassium, and magnesium because rhythm mechanism and reversible triggers guide prevention.",
      "Coach an ordered modified Valsalva maneuver only in a stable regular narrow-complex rhythm because increased vagal tone can interrupt atrioventricular-node-dependent reentry without medication.",
      "Administer prescribed rapid intravenous adenosine with continuous rhythm recording and resuscitation readiness because transient atrioventricular block may terminate SVT while briefly causing asystole, flushing, or bronchospasm.",
      "Escalate immediately for hypotension, altered consciousness, ischemic chest pain, acute heart failure, shock, wide or irregular rhythm, or failure of stable measures because synchronized cardioversion or expert rhythm management is required."
    ], [
      "Hypotension, shock, syncope, or altered consciousness",
      "Ischemic chest pain or acute pulmonary edema",
      "Wide-complex or irregular tachycardia of uncertain mechanism",
      "Persistent rapid rate despite ordered vagal and medication therapy"
    ], [
      "Teach the prescribed vagal technique and episode log, but explain that carotid massage should not be self-performed.",
      "Review stimulant reduction and urgent care for fainting, chest pain, severe breathlessness, or an episode that does not stop according to the plan."
    ]),
    card("Unstable angina", ["acc-acs-2025"], [
      "Treat new, rest, accelerating, or prolonged ischemic discomfort as acute coronary syndrome and obtain an electrocardiogram promptly because unstable plaque can obstruct flow before troponin becomes elevated.",
      "Assess symptom onset and pattern, pressure, pulse, oxygenation, perfusion, heart-failure signs, bleeding risk, and prior coronary therapy because instability and contraindications determine antithrombotic and invasive care.",
      "Repeat electrocardiograms and ordered troponins and maintain continuous rhythm monitoring because transient ischemia and evolving infarction may be missed by one normal result.",
      "Administer prescribed antiplatelet, anticoagulant, nitrate, beta-blocking, and lipid-lowering therapy while monitoring pressure, pulse, headache, bleeding, and kidney function because therapy limits thrombosis and demand but can cause hypotension or hemorrhage.",
      "Escalate immediately for persistent or recurrent pain, dynamic ST change, ventricular arrhythmia, syncope, hypotension, pulmonary edema, or rising troponin because urgent angiography and revascularization may be needed."
    ], [
      "Persistent or recurrent rest pain despite initial therapy",
      "New ST depression, transient ST elevation, or rising troponin",
      "Ventricular dysrhythmia, syncope, hypotension, or shock",
      "Acute pulmonary edema or rapidly increasing oxygen need"
    ], [
      "Explain that unstable angina is an emergency even when pain resolves because the coronary plaque can re-occlude or progress to infarction.",
      "Teach emergency-services activation, prescribed nitroglycerin use, antiplatelet adherence, bleeding precautions, and cardiac rehabilitation planning."
    ]),
    card("Pneumothorax", ["bts-pleural-2023", "aha-als-2025"], [
      "Assess sudden pleuritic pain, dyspnea, respiratory effort, unilateral breath sounds, chest movement, oxygen saturation, pressure, and tracheal position because accumulating pleural air collapses the lung and may obstruct venous return.",
      "Apply prescribed oxygen, position for ventilation, establish monitoring and intravenous access, and keep emergency decompression equipment available because tension physiology can evolve before confirmatory imaging.",
      "Prepare ultrasound or chest imaging only when the patient is stable and do not delay decompression for severe hypoxemia, hypotension, or obstructive shock because tension pneumothorax is a clinical emergency.",
      "Maintain an inserted chest drain below the thorax, secure connections, inspect the site and water seal, and assess for expected tidaling, air leak, output, and subcutaneous emphysema because system failure can recreate pressure or admit air.",
      "Escalate immediately for rapidly worsening distress, absent unilateral sounds, tracheal deviation, hypotension, jugular venous distention, cyanosis, increasing subcutaneous air, or sudden drain failure because urgent decompression or tube correction is required."
    ], [
      "Rapid respiratory deterioration with absent unilateral breath sounds",
      "Hypotension, distended neck veins, tracheal shift, or cyanosis",
      "Sudden loss of chest-drain function with recurrent pain or dyspnea",
      "Expanding subcutaneous emphysema or persistent large air leak"
    ], [
      "Teach the patient not to clamp, lift, or disconnect the chest-drain tubing and to report bubbling changes, new pain, or breathlessness immediately.",
      "Review smoking cessation, follow-up imaging, activity and air-travel restrictions, and emergency evaluation for recurrent one-sided pain or dyspnea."
    ]),
    card("Neuroleptic malignant syndrome", ["apa-schizophrenia-2020", "sccm-sepsis-2026"], [
      "Stop and urgently clarify dopamine-blocking medicines and recent dose increases because continued receptor blockade drives rigidity, hyperthermia, autonomic instability, and progressive muscle injury.",
      "Assess temperature, consciousness, generalized rigidity, swallowing, respiratory effort, blood pressure, pulse, diaphoresis, and medication history because neuroleptic malignant syndrome can resemble sepsis, serotonin toxicity, or malignant catatonia.",
      "Initiate active cooling, intravenous fluids, airway support, and prescribed syndrome-specific therapy because hypermetabolism and rhabdomyolysis can cause shock, renal failure, and respiratory collapse.",
      "Monitor creatine kinase, potassium, calcium, phosphate, creatinine, urine color and output, rhythm, coagulation, and acid-base status because muscle breakdown produces arrhythmia, acute kidney injury, and disseminated coagulation.",
      "Escalate immediately for temperature rise, severe rigidity, dysphagia, hypoxemia, labile pressure, ventricular dysrhythmia, oliguria, rapidly rising creatine kinase, seizure, or declining consciousness because intensive care and organ support may be lifesaving."
    ], [
      "Hyperthermia with severe generalized rigidity",
      "Labile pressure, ventricular dysrhythmia, or shock",
      "Dark urine, oliguria, rising potassium, or rapidly rising creatine kinase",
      "Dysphagia, hypoxemia, seizure, or declining consciousness"
    ], [
      "Explain that this is a rare medication emergency rather than worsening psychosis and that the suspected drug must not be restarted without specialist review.",
      "Teach patients and families to seek emergency care for fever with stiffness, confusion, sweating, swallowing difficulty, or dark urine after antipsychotic changes."
    ]),
    card("Traumatic amputation", ["acs-trauma", "ems-amputation"], [
      "Control life-threatening hemorrhage with direct pressure, wound packing, and a documented tourniquet when required because rapid blood loss takes priority over limb preservation.",
      "Assess airway, breathing, perfusion, temperature, pain, other injuries, and serial proximal neurovascular findings because traumatic amputation commonly accompanies shock and occult multisystem trauma.",
      "Cover the stump with a sterile saline-moistened dressing, then wrap the amputated part separately in sterile saline-moistened gauze, seal it in a waterproof bag, and cool the bag over ice water without direct ice contact because desiccation, freezing, soaking, and contamination reduce replantation viability.",
      "Establish large-bore access, obtain blood tests and type and crossmatch, administer ordered blood, antibiotics, tetanus prophylaxis, and analgesia, and trend urine output because resuscitation, infection prevention, and renal perfusion determine survival.",
      "Escalate immediately for uncontrolled bleeding, hypotension, recurrent tourniquet hemorrhage, expanding hematoma, severe pain out of proportion, cold remaining limb, altered consciousness, or deteriorating perfusion because emergency surgery and massive transfusion may be required."
    ], [
      "Bleeding that continues through packing or after tourniquet application",
      "Hypotension, weak pulses, cool skin, confusion, or falling urine output",
      "Expanding hematoma or threatened perfusion of the remaining limb",
      "Severe escalating pain, fever, malodor, or rapidly spreading tissue change"
    ], [
      "Explain how the amputated part is protected and that replantation depends on injury pattern and ischemic time, not on promises at the bedside.",
      "Prepare the patient for phantom sensations, rehabilitation, wound and prosthetic care, trauma support, and urgent reporting of bleeding or infection."
    ]),
    card("Stevens-Johnson syndrome", ["aad-sjs"], [
      "Stop and urgently review all recently started medicines with the prescriber because early withdrawal of the causative drug limits ongoing immune-mediated epidermal injury.",
      "Assess detached body-surface area, targetoid lesions, oral, ocular and genital mucosa, pain, temperature, breathing, swallowing, and hemodynamics because mucosal loss can threaten the airway, vision, hydration, and infection defense.",
      "Use gentle skin handling, nonadherent dressings, warm environment, meticulous mouth and eye care, and early ophthalmology involvement because friction and delayed ocular treatment worsen tissue loss and scarring.",
      "Monitor fluid balance, weight, urine output, sodium, glucose, kidney function, cultures when indicated, and nutrition because epidermal loss causes burn-like dehydration, catabolism, and infection risk.",
      "Escalate immediately for stridor, voice change, hypoxemia, rapidly spreading detachment, hypotension, oliguria, corneal pain or vision change, sepsis signs, or extensive mucosal sloughing because burn-center and multidisciplinary critical care are required."
    ], [
      "Stridor, voice change, drooling, hypoxemia, or respiratory distress",
      "Rapidly increasing skin detachment or severe mucosal sloughing",
      "Hypotension, oliguria, fever with instability, or altered consciousness",
      "Eye pain, photophobia, corneal change, or new vision impairment"
    ], [
      "Give the patient the exact suspected drug name and related medicines to avoid and recommend a permanent allergy record because re-exposure may be more severe.",
      "Teach gentle wound and mouth care and urgent review for new rash, blisters, eye pain, swallowing difficulty, fever, or breathing change."
    ]),
    card("Pressure injuries", ["international-pressure-injury"], [
      "Perform a head-to-toe skin and device-pressure assessment and document stage, size, depth, undermining, drainage, odor, surrounding tissue, pain, and perfusion because accurate classification directs off-loading and reveals deterioration.",
      "Reposition on an individualized schedule, float heels, off-load the wound, use pressure-redistributing surfaces, and manage tubing and devices because sustained pressure and shear collapse local microcirculation.",
      "Control moisture from urine, stool, perspiration, or exudate and use lift equipment rather than dragging because maceration, friction, and shear enlarge tissue injury.",
      "Assess nutrition, hydration, anemia, glucose, mobility, sensation, vascular supply, and goals of care and coordinate protein-energy support because healing fails when perfusion and substrate needs are unmet.",
      "Escalate immediately for rapidly spreading erythema, crepitus, purulent drainage, fever with instability, exposed bone with infection concern, black tissue with ischemia, severe pain out of proportion, or sudden deep discoloration because sepsis, osteomyelitis, necrotizing infection, or deep-tissue injury may be present."
    ], [
      "Rapidly spreading redness, crepitus, malodor, or purulent drainage",
      "Fever, hypotension, confusion, or rising lactate",
      "Exposed bone, new tunneling, or concern for osteomyelitis",
      "Black ischemic tissue, sudden deep discoloration, or pain out of proportion"
    ], [
      "Teach the patient and caregivers pressure-relief timing, heel floating, skin inspection, moisture control, nutrition, and safe transfer technique.",
      "Explain that massage over reddened bony areas can worsen microvascular injury and that nonblanching redness or new purple tissue needs prompt evaluation."
    ]),
    card("Air embolism", ["acs-trauma", "aha-als-2025"], [
      "Clamp or stop the suspected open vascular or infusion source immediately because preventing further air entry is the first reversible step.",
      "Call emergency support, administer high-concentration oxygen, and assess airway, breathing, circulation, neurologic status, chest pain, and rhythm because intravascular gas can obstruct pulmonary or cerebral blood flow.",
      "Position according to the clinical source and local emergency protocol without delaying resuscitation and protect central-line hubs because patient movement cannot substitute for sealing the entry point and supporting perfusion.",
      "Maintain continuous oxygen, electrocardiographic, blood-pressure, and neurologic monitoring and prepare imaging and hyperbaric consultation because neurologic injury can evolve even after initial improvement.",
      "Escalate immediately for sudden dyspnea, mill-wheel murmur, hypoxemia, hypotension, chest pain, seizure, focal deficit, confusion, loss of consciousness, or cardiovascular collapse because large pulmonary or arterial gas embolism requires critical care and possible hyperbaric oxygen."
    ], [
      "Sudden respiratory distress, hypoxemia, or chest pain during line manipulation",
      "Hypotension, unstable rhythm, or cardiovascular collapse",
      "New focal neurologic deficit, seizure, confusion, or coma",
      "Persistent neurologic or cardiopulmonary symptoms despite high-concentration oxygen"
    ], [
      "Teach patients with central access to keep clamps and caps secure and to report a cracked hub, disconnection, sudden cough, chest pain, or dizziness immediately.",
      "Explain that symptoms can recur after the source is sealed, so continued neurologic and oxygen monitoring is necessary."
    ]),
    card("Burn injury", ["aba-burn-referral"], [
      "Stop the burning process, remove hot or contaminated items and constricting jewelry, and avoid ice because prolonged heat and swelling deepen injury while ice causes vasoconstriction and hypothermia.",
      "Assess airway exposure, soot, voice, facial burns, breathing, carbon-monoxide risk, circulation, burn depth and total body-surface area, and associated trauma because inhalation injury and shock can be more lethal than visible skin damage.",
      "Cover wounds with clean dry material, prevent hypothermia, provide prescribed analgesia, and use aseptic wound care because exposed dermis loses heat, fluid, and microbial protection.",
      "For major burns, establish access through unburned skin when possible, administer goal-directed fluid, and trend urine output, pressure, lactate, lung sounds, sodium, potassium, and hematocrit because capillary leak causes shock while over-resuscitation causes edema and compartment syndromes.",
      "Escalate immediately for airway change, increasing oxygen need, circumferential chest or limb compromise, absent distal pulse, oliguria, electrical or chemical mechanism, major body-surface involvement, or shock because early intubation, escharotomy, or burn-center transfer may be required."
    ], [
      "Hoarseness, stridor, soot, facial swelling, or increasing oxygen need",
      "Circumferential burn with impaired ventilation or distal perfusion",
      "Hypotension, rising lactate, oliguria, or altered consciousness",
      "Electrical, chemical, deep facial, hand, genital, joint, or major surface-area burn"
    ], [
      "Teach wound hygiene, prescribed dressing and pain plans, protein-rich nutrition, range-of-motion exercises, sun protection, and signs of infection.",
      "Explain why ice, butter, adhesive remedies, and breaking blisters can worsen tissue damage or infection."
    ]),
    card("Electrical injury", ["aba-burn-referral", "acs-trauma"], [
      "Ensure the power source is disconnected before touching the patient and begin trauma and resuscitation assessment because electrical contact can endanger rescuers and cause immediate arrest or falls.",
      "Identify voltage, current type, contact duration, wet exposure, entry and exit sites, loss of consciousness, pregnancy, and associated trauma because small skin wounds can conceal deep muscle, cardiac, and neurologic injury.",
      "Obtain an electrocardiogram and monitor rhythm when high voltage, transthoracic current, symptoms, abnormal tracing, or loss of consciousness is present because myocardial conduction injury may cause dysrhythmia.",
      "Trend muscle pain and swelling, pulses, urine color and output, creatine kinase, potassium, calcium, creatinine, and acid-base status because deep necrosis causes compartment syndrome, hyperkalemia, rhabdomyolysis, and kidney injury.",
      "Escalate immediately for cardiac arrest, unstable rhythm, chest pain, syncope, seizure, focal deficit, dark urine, rising potassium, severe swelling, pain with passive stretch, or loss of pulse because advanced resuscitation or emergency fasciotomy may be needed."
    ], [
      "Cardiac arrest, unstable dysrhythmia, chest pain, or syncope",
      "Seizure, confusion, focal deficit, or persistent weakness",
      "Dark urine, oliguria, hyperkalemia, or rising creatine kinase",
      "Tense swelling, pain with passive stretch, paresthesia, or lost pulse"
    ], [
      "Teach that a small entry mark does not show the depth of electrical injury and that delayed weakness, dark urine, chest symptoms, or swelling require urgent care.",
      "Review workplace or household electrical safety and arrange wound, neurologic, hearing, vision, and psychological follow-up as indicated."
    ]),
    card("Fat embolism syndrome", ["acs-trauma"], [
      "Recognize new hypoxemia, neurologic change, fever, tachycardia, anemia, thrombocytopenia, and a petechial rash after long-bone or pelvic injury because the syndrome often emerges after an initially stable interval.",
      "Maintain fracture immobilization, limit unnecessary manipulation, and coordinate early fixation because ongoing marrow disruption can release additional fat into the circulation.",
      "Provide prescribed oxygen and ventilatory support and assess work of breathing, lung sounds, blood gases, consciousness, pupils, and motor response because diffuse pulmonary and cerebral inflammation can progress rapidly.",
      "Trend hemoglobin, platelets, coagulation, chest imaging, urine output, kidney function, and hemodynamics because anemia, thrombocytopenia, acute respiratory distress, and shock accompany severe disease.",
      "Escalate immediately for rapidly increasing oxygen need, confusion, seizure, focal deficit, widespread petechiae, hypotension, oliguria, or respiratory fatigue; prepare for intubation and mechanical ventilation when oxygenation or respiratory effort continues to fail because intensive respiratory and circulatory support may be required."
    ], [
      "New hypoxemia or rapidly increasing ventilatory requirement after fracture",
      "Acute confusion, seizure, focal deficit, or declining consciousness",
      "Petechial rash with respiratory or neurologic deterioration",
      "Hypotension, oliguria, or progressive multiorgan dysfunction"
    ], [
      "Explain that breathing or neurologic changes after a major fracture can reflect a systemic inflammatory complication rather than pain medicine alone.",
      "Teach family members to report confusion, new rash, breathlessness, fever, or unusual sleepiness immediately during the high-risk period."
    ]),
    card("Rhabdomyolysis", ["aast-rhabdo"], [
      "Identify crush injury, prolonged immobilization, exertion, heat, seizure, drug or toxin exposure, infection, and muscle pain or weakness because removing the driver limits continued myocyte breakdown.",
      "Begin prescribed isotonic fluid and measure hourly urine output while reassessing lungs, edema, and pressure because renal perfusion helps clear pigment but excessive fluid can cause pulmonary edema.",
      "Trend creatine kinase, potassium, calcium, phosphate, bicarbonate, creatinine, urine color, and electrocardiogram because released intracellular contents cause lethal hyperkalemia, acid-base change, and acute kidney injury.",
      "Assess swollen muscle compartments, pain with passive stretch, sensation, motor function, and distal pulses because compartment pressure can cause irreversible ischemic injury even when a pulse remains.",
      "Escalate immediately for electrocardiographic change, rising potassium, oliguria or anuria, worsening acidosis, pulmonary edema, tense compartment, progressive weakness, or unstable rhythm because dialysis, fasciotomy, or advanced resuscitation may be required."
    ], [
      "Hyperkalemia with electrocardiographic change or unstable rhythm",
      "Oliguria, anuria, rapidly rising creatinine, or severe acidosis",
      "Tense swelling, pain with passive stretch, sensory loss, or weakness",
      "Pulmonary edema or hypoxemia during fluid resuscitation"
    ], [
      "Teach hydration and graded return after exertional illness and avoidance of the identified drug, heat, or overexertion trigger.",
      "Explain that cola-colored urine, worsening muscle swelling, weakness, reduced urine, palpitations, or breathlessness requires urgent evaluation."
    ]),
    card("Multiple organ dysfunction syndrome", ["sccm-sepsis-2026", "acs-trauma"], [
      "Trend respiratory, cardiovascular, renal, hepatic, neurologic, hematologic, and metabolic function together because deterioration across systems reflects a shared failure of perfusion, inflammation, and cellular regulation.",
      "Identify and treat the driver such as infection, hemorrhage, pancreatitis, trauma, ischemia, or toxin and coordinate source control because organ support cannot reverse an uncontrolled insult.",
      "Maintain ordered oxygenation, perfusion, glucose, temperature, nutrition, and fluid goals with repeated response checks because both inadequate support and treatment excess can amplify secondary injury.",
      "Use meticulous line, ventilator, skin, oral, mobility, thrombosis, and medication-safety bundles because prolonged invasive care creates preventable infection, delirium, bleeding, pressure injury, and weakness.",
      "Escalate immediately for rising vasopressor or oxygen need, anuria, worsening lactate or acidosis, coagulopathic bleeding, severe hypoglycemia, declining consciousness, or new liver failure because rapidly changing organ support and goals-of-care discussion are required."
    ], [
      "Increasing vasopressor requirement, mottling, or rising lactate",
      "Refractory hypoxemia or rapidly increasing ventilatory support",
      "Anuria, severe acidosis, hyperkalemia, or progressive fluid overload",
      "Coagulopathic bleeding, hypoglycemia, jaundice, or declining consciousness"
    ], [
      "Explain to families which organs are failing, what each support is doing, and which trends indicate recovery or further deterioration.",
      "Include the patient's values in daily multidisciplinary goals because burdens and likely benefit change as organ failure progresses."
    ]),
    card("Asthma", ["gina-2025", "aha-als-2025"], [
      "Assess ability to speak, respiratory rate, accessory use, wheeze or silent chest, oxygen saturation, peak flow when feasible, and prior intensive-care history because severe airflow obstruction can produce less wheeze as ventilation fails.",
      "Administer prescribed rapid inhaled bronchodilator with oxygen and systemic corticosteroid and reassess after each treatment because bronchodilation relieves smooth-muscle constriction while steroids reduce the inflammatory driver.",
      "Use a spacer or nebulizer correctly and monitor pulse, tremor, potassium, glucose, breath sounds, and work of breathing because repeated beta agonists can cause tachycardia and hypokalemia while persistent effort signals treatment failure.",
      "Review triggers, adherence, inhaler technique, reliever frequency, nighttime symptoms, tobacco or vaping, and an individualized controller plan because poor anti-inflammatory control predicts recurrent exacerbation.",
      "Escalate immediately for silent chest, exhaustion, confusion, cyanosis, inability to speak, falling saturation, worsening peak flow, rising carbon dioxide, bradycardia, or poor response to repeated bronchodilator because impending respiratory arrest requires advanced airway support."
    ], [
      "Silent chest, minimal air movement, or rapidly decreasing effort",
      "Confusion, drowsiness, cyanosis, or inability to speak",
      "Refractory hypoxemia or rising carbon dioxide",
      "Poor response to repeated bronchodilator or prior near-fatal pattern"
    ], [
      "Teach and demonstrate controller versus reliever use, spacer technique, trigger reduction, and a written action plan with peak-flow zones when appropriate.",
      "Explain that frequent reliever use or nighttime symptoms mean inflammation is not controlled and require prompt plan review rather than simply taking more rescue doses."
    ]),
    card("COPD", ["gold-2026"], [
      "Assess baseline and current dyspnea, sputum volume and color, cough, respiratory effort, oxygen saturation, mental status, smoking, inhaler use, and prior exacerbations because change from baseline identifies severity and likely trigger.",
      "Titrate prescribed oxygen to the individualized target and reassess blood gases when severe disease or somnolence is present because both untreated hypoxemia and worsening carbon-dioxide retention can injure organs.",
      "Administer prescribed short-acting bronchodilators, corticosteroids, and antibiotics when indicated and monitor pulse, tremor, glucose, potassium, sputum, and response because therapy targets airflow obstruction and selected infectious exacerbations while causing predictable adverse effects.",
      "Position upright, coach pursed-lip breathing, pace care, support airway clearance, hydration and nutrition, and prepare noninvasive ventilation when indicated because reducing dynamic hyperinflation and work of breathing can prevent fatigue.",
      "Escalate immediately for refractory hypoxemia, rising carbon dioxide with acidosis or somnolence, inability to clear secretions, silent breath sounds, exhaustion, hypotension, or failed noninvasive ventilation because invasive support may be required."
    ], [
      "Rising carbon dioxide with acidosis, confusion, or somnolence",
      "Refractory hypoxemia or rapidly increasing oxygen requirement",
      "Exhaustion, silent breath sounds, or inability to clear secretions",
      "Hypotension, unstable rhythm, or failure of noninvasive ventilation"
    ], [
      "Teach inhaler technique, smoking cessation, vaccination, pulmonary rehabilitation, pacing, nutrition, and the personalized oxygen prescription.",
      "Review an exacerbation plan and urgent signs: new confusion, blue lips, severe breathlessness, chest pain, fever, or inability to eat, sleep, or speak normally."
    ]),
    card("Pneumonia", ["nice-pneumonia-2025", "idsa-cap", "sccm-sepsis-2026"], [
      "Assess respiratory rate, effort, oxygenation, lung sounds, cough and sputum, temperature, pressure, mental status, swallowing risk, and comorbidities because pneumonia severity ranges from focal infection to respiratory failure and sepsis.",
      "Obtain indicated imaging, cultures, viral testing, and lactate without delaying antibiotics in unstable patients because microbiologic data guide de-escalation but organ support and effective therapy are time critical.",
      "Administer prescribed antimicrobials on schedule after allergy and kidney review and reassess fever, oxygen need, pressure, and symptoms because failure to improve may indicate resistance, abscess, empyema, or a noninfectious diagnosis.",
      "Position upright, support hydration, mobilization, oral care, cough and deep breathing, and aspiration precautions because secretion clearance and ventilation reduce atelectasis and secondary aspiration.",
      "Escalate immediately for rapidly increasing oxygen or ventilatory need, exhaustion, hypotension, confusion, oliguria, rising lactate, hemoptysis, pleuritic deterioration, or no expected response because respiratory failure, sepsis, or pleural complication may be developing."
    ], [
      "Rapidly increasing oxygen need, exhaustion, or ventilatory failure",
      "Hypotension, confusion, oliguria, or rising lactate",
      "Hemoptysis, severe pleuritic pain, or suspected empyema",
      "Persistent fever or clinical worsening despite appropriate therapy"
    ], [
      "Teach antibiotic completion when prescribed, hydration, mobilization, cough hygiene, smoking cessation, and recommended influenza and pneumococcal vaccination.",
      "Explain that worsening breathlessness, confusion, blue lips, fainting, reduced urine, or inability to maintain fluids requires urgent reassessment."
    ]),
    card("Pulmonary edema", ["aha-hf-2022", "acc-acs-2025", "aha-als-2025"], [
      "Sit the patient upright and assess respiratory effort, crackles, oxygen saturation, frothy sputum, pressure, rhythm, perfusion, chest pain, and jugular venous pressure because alveolar fluid impairs gas exchange and often reflects acute cardiac decompensation.",
      "Apply prescribed oxygen or positive-pressure support and reassess work of breathing and blood gases because airway pressure recruits flooded alveoli while worsening fatigue signals need for intubation.",
      "Administer ordered diuretic, vasodilator, anti-ischemic, or vasoactive therapy according to pressure and cause and monitor urine output, pressure, creatinine, sodium, potassium, and magnesium because decongestion and afterload reduction can also cause hypotension and electrolyte injury.",
      "Identify infarction, severe hypertension, arrhythmia, valve failure, renal failure, fluid excess, or medication nonadherence because rapid cause-directed treatment prevents recurrent flooding.",
      "Escalate immediately for refractory hypoxemia, pink frothy sputum, exhaustion, falling consciousness, hypotension, ischemic electrocardiographic change, unstable rhythm, anuria, or failed noninvasive ventilation because advanced airway or circulatory support is required."
    ], [
      "Refractory hypoxemia, pink frothy sputum, or severe respiratory fatigue",
      "Falling consciousness or inability to protect the airway",
      "Hypotension, shock, ischemic chest pain, or unstable rhythm",
      "Anuria or failure to improve with initial decongestive therapy"
    ], [
      "Teach daily weight, individualized sodium and fluid plan, medication adherence, and early contact for swelling, orthopnea, or rapid weight gain.",
      "Explain that sudden severe breathlessness, frothy sputum, fainting, or chest pain requires emergency services rather than an extra unplanned dose at home."
    ]),
    card("Pleural effusion", ["bts-pleural-2023"], [
      "Assess dyspnea, pleuritic pain, respiratory effort, oxygen saturation, asymmetric expansion, diminished breath sounds, fever, edema, cancer history, and recent infection because the cause may be heart failure, pneumonia, malignancy, bleeding, or another systemic disorder.",
      "Position for comfort and obtain ordered imaging and diagnostic thoracentesis because fluid size, complexity, and chemistry distinguish transudate from infection, blood, chyle, or malignancy.",
      "Before and during drainage, verify consent and coagulation risk, use asepsis, monitor pressure, pulse, oxygenation, cough, pain, and symptoms, and limit removal according to orders because bleeding, pneumothorax, and re-expansion edema can occur.",
      "After thoracentesis or drain placement, assess breath sounds, puncture site, drainage amount and character, air leak, subcutaneous emphysema, and respiratory response because new deterioration may signal procedure complication or tube failure.",
      "Escalate immediately for sudden dyspnea, hypoxemia, hypotension, chest pain, hemoptysis, fever with instability, rapidly accumulating bloody drainage, absent breath sounds, or increasing subcutaneous air because pneumothorax, hemorrhage, empyema, or re-expansion edema may be present."
    ], [
      "Sudden dyspnea, hypoxemia, or absent breath sounds after drainage",
      "Hypotension, hemoptysis, or rapidly increasing bloody output",
      "Fever with instability, purulent fluid, or loculated infected effusion",
      "Increasing subcutaneous emphysema or chest-drain malfunction"
    ], [
      "Teach the patient to remain still during thoracentesis, report sudden pain or breathlessness immediately, and protect the dressing afterward.",
      "Explain that draining fluid relieves compression but treating the heart, infection, cancer, or other cause prevents recurrence."
    ]),
    card("Shingles disseminated", ["cdc-shingles"], [
      "Place the patient in airborne and contact precautions with a negative-pressure room when available because disseminated varicella-zoster virus can spread through aerosols and direct lesion contact.",
      "Assess the entire skin surface, mucosa, eye and ear symptoms, pain, temperature, breathing, neurologic status, pregnancy exposure, and immune status because widespread infection can involve lung, brain, liver, or vision.",
      "Administer prescribed systemic antiviral therapy promptly and monitor kidney function, hydration, and neurologic response because severe or immunocompromised disease requires systemic control while antiviral accumulation can cause toxicity.",
      "Keep lesions clean, dry, and covered when feasible, provide nonadherent care and multimodal pain relief, and prevent scratching because damaged vesicles transmit virus and invite bacterial infection.",
      "Escalate immediately for eye pain or vision change, facial weakness, severe headache, confusion, weakness, dyspnea, hypoxemia, rapidly spreading lesions, hepatitis signs, or sepsis because ophthalmic, neurologic, pulmonary, or visceral dissemination threatens life or function."
    ], [
      "Eye pain, red eye, forehead or nasal lesions, or vision change",
      "Facial weakness, severe headache, confusion, focal deficit, or seizure",
      "Dyspnea, hypoxemia, cough, or rapidly increasing respiratory support",
      "Rapid lesion spread, jaundice, hypotension, or fever with instability"
    ], [
      "Teach strict hand hygiene, lesion coverage, and avoidance of susceptible pregnant, newborn, and immunocompromised contacts until every lesion has crusted.",
      "Explain antiviral timing, pain follow-up, and urgent reporting of eye, ear, breathing, or neurologic symptoms."
    ]),
    card("Influenza", ["cdc-influenza"], [
      "Initiate droplet precautions and assess abrupt fever, myalgias, symptom onset, respiratory effort, oxygenation, hydration, temperature, mental status, pregnancy, age, and chronic disease because transmission is efficient and high-risk patients deteriorate faster.",
      "Obtain indicated molecular testing without delaying prescribed antiviral therapy in severe, hospitalized, or high-risk illness because benefit is greatest early but remains important in progressive disease.",
      "Administer antiviral and supportive therapy and monitor kidney function, intake, output, glucose, fever, and medication adverse effects because dehydration and dose-related toxicity complicate systemic infection.",
      "Trend oxygen need, lung sounds, sputum, pressure, consciousness, and secondary improvement-then-relapse pattern because viral pneumonia, bacterial superinfection, myocarditis, and encephalopathy can emerge after initial symptoms.",
      "Escalate immediately for hypoxemia, severe work of breathing, cyanosis, chest pain, hypotension, confusion, seizure, dehydration with oliguria, or recurrent fever with clinical decline because respiratory failure, sepsis, or extrapulmonary complication may be developing."
    ], [
      "Severe dyspnea, cyanosis, hypoxemia, or increasing respiratory support",
      "Chest pain, unstable rhythm, hypotension, or syncope",
      "Confusion, seizure, inability to awaken, or marked weakness",
      "Dehydration, oliguria, or recurrent fever after initial improvement"
    ], [
      "Teach annual vaccination, cough etiquette, hand hygiene, staying home while acutely ill, and extra protection around high-risk people.",
      "Explain when antiviral treatment is most useful and which breathing, neurologic, hydration, or relapse signs require urgent care."
    ]),
    card("Malaria", ["cdc-malaria"], [
      "Treat fever after travel to a malaria area as urgent and obtain repeated rapid testing and thick and thin smears when indicated because parasitemia can fluctuate and falciparum disease can become fatal quickly.",
      "Assess travel geography and dates, prophylaxis, pregnancy, fever pattern, consciousness, breathing, jaundice, bleeding, urine output, and splenic pain because species, resistance, and organ involvement determine therapy.",
      "Administer the exact prescribed antimalarial regimen and verify oral tolerance, weight, interactions, glucose-6-phosphate dehydrogenase status when relevant, and pregnancy safety because treatment and relapse prevention are species specific.",
      "Monitor parasite density, glucose, hemoglobin, platelets, bilirubin, lactate, creatinine, urine output, rhythm, and neurologic status because hypoglycemia, hemolysis, acidosis, kidney failure, cerebral malaria, and arrhythmia mark severe disease.",
      "Escalate immediately for confusion, seizure, coma, respiratory distress, shock, severe anemia, hypoglycemia, acidosis, jaundice with organ failure, high parasitemia, bleeding, or oliguria because severe malaria requires intravenous therapy and critical care."
    ], [
      "Confusion, seizure, coma, or other cerebral-malaria finding",
      "Respiratory distress, shock, severe acidosis, or hypoglycemia",
      "Severe anemia, jaundice with organ failure, bleeding, or high parasitemia",
      "Oliguria, hemoglobinuria, or rapidly rising creatinine"
    ], [
      "Teach strict completion of treatment and follow-up smears because symptoms may improve before parasites are cleared or relapse risk is addressed.",
      "Review mosquito avoidance and destination-specific prophylaxis before future travel, and seek urgent testing for any post-travel fever."
    ]),
    card("Pertussis", ["cdc-pertussis"], [
      "Initiate droplet precautions and notify infection-control and public-health teams because pertussis spreads before the characteristic whoop and exposes vulnerable infants.",
      "Assess cough duration and paroxysms, apnea, cyanosis, vomiting, hydration, weight, oxygenation, household contacts, and vaccination because infants may present with apnea rather than cough and can decline abruptly.",
      "Administer prescribed macrolide therapy and monitor tolerance, interactions, rhythm risk, intake, and output because antibiotics reduce transmission even when toxin-mediated cough persists.",
      "Use gentle suction only when needed, small frequent feeds, aspiration precautions, and continuous cardiorespiratory monitoring for young infants because coughing triggers hypoxemia, bradycardia, aspiration, and exhaustion.",
      "Escalate immediately for apnea, cyanosis, bradycardia, seizure, pneumonia, dehydration, inability to feed, marked leukocytosis with cardiopulmonary compromise, or recurrent desaturation because intensive respiratory support may be needed."
    ], [
      "Apnea, cyanosis, bradycardia, or recurrent oxygen desaturation",
      "Seizure, altered responsiveness, or severe exhaustion",
      "Inability to feed, persistent vomiting, or dehydration",
      "Pneumonia, pulmonary hypertension, or rapidly worsening infant illness"
    ], [
      "Teach families that cough may last for weeks despite antibiotics, while treatment and prophylaxis mainly reduce transmission and protect contacts.",
      "Review vaccination, postexposure prophylaxis, respiratory hygiene, and emergency action for apnea, blue color, poor feeding, or unusual sleepiness."
    ]),
    card("Rabies", ["cdc-rabies"], [
      "Wash and irrigate every possible exposure wound immediately with soap and water and apply a virucidal agent when available because local cleansing reduces inoculated rabies virus before it enters nerves.",
      "Document the animal species, behavior, ownership, vaccination, exposure type, wound sites, geography, timing, and prior vaccine and contact public health because observation, testing, and prophylaxis decisions are exposure specific.",
      "Administer prescribed human rabies immune globulin into and around wounds and the vaccine series at separate sites for a previously unvaccinated person because passive antibody protects until active immunity develops.",
      "Track every vaccine date, wound status, immune status, and adverse reaction and arrange the modified regimen for prior vaccination or immunocompromise because missed or incorrectly delivered doses can undermine prevention.",
      "Escalate immediately for hydrophobia, aerophobia, dysphagia, agitation, hallucinations, autonomic instability, ascending weakness, respiratory failure, or any neurologic symptom after exposure because symptomatic rabies requires urgent public-health and intensive supportive care."
    ], [
      "Hydrophobia, aerophobia, dysphagia, or painful pharyngeal spasm",
      "Agitation, hallucinations, confusion, or autonomic instability",
      "Ascending weakness, paralysis, or respiratory compromise",
      "Any neurologic symptom after a credible rabies exposure"
    ], [
      "Teach that prophylaxis must begin before symptoms and that completing every scheduled dose is lifesaving even when the wound looks minor.",
      "Advise never to capture a suspect wild animal by hand and to contact animal control and public health immediately after a bite, scratch, or bat exposure."
    ]),
    card("Vancomycin-resistant Enterococcus", ["cdc-vre", "cdc-hai"], [
      "Use contact precautions and dedicated equipment and perform hand hygiene before and after care because vancomycin-resistant Enterococcus spreads on hands, surfaces, wounds, stool, and devices.",
      "Distinguish colonization from infection by assessing fever, pressure, urine and wound symptoms, line findings, cultures, and organ dysfunction because treating colonization adds toxicity and resistance without benefit.",
      "Obtain ordered cultures before antibiotics when stable and administer susceptibility-directed therapy with pharmacy review because resistance pattern, infection site, and kidney function determine an effective regimen.",
      "Monitor temperature, blood pressure, blood counts, kidney and liver function, cultures, line or wound status, urine output, and drug-specific toxicity because bloodstream infection can progress to sepsis while rescue antibiotics have important adverse effects.",
      "Escalate immediately for hypotension, confusion, oliguria, rising lactate, persistent bacteremia, new murmur, embolic findings, rapidly spreading wound infection, or treatment failure because sepsis, endocarditis, or an uncontrolled source may require urgent intervention."
    ], [
      "Hypotension, confusion, oliguria, or rising lactate",
      "Persistent positive blood cultures or fever despite active therapy",
      "New murmur, embolic deficit, or concern for endocarditis",
      "Rapidly spreading wound infection or infected device without source control"
    ], [
      "Explain that colonization does not always require antibiotics, but hand hygiene and contact measures prevent spread to vulnerable people.",
      "Teach completion of prescribed therapy, device and wound care, and urgent reporting of fever, weakness, confusion, or reduced urine."
    ]),
    card("C. difficile", ["idsa-cdiff", "cdc-hand-hygiene"], [
      "Initiate contact precautions and sporicidal environmental cleaning; use alcohol-based hand rub for routine healthcare hand hygiene unless hands are visibly soiled, and add soap-and-water washing after direct fecal contamination or during outbreak or hyperendemic transmission because friction and rinsing help remove spores that alcohol does not kill.",
      "Document stool frequency and character, abdominal pain and distention, temperature, pressure, intake, output, and recent antibiotics or acid suppression because severity ranges from diarrhea to toxic megacolon and shock.",
      "Send unformed stool only from a symptomatic patient according to the testing algorithm and avoid repeat cure testing because detecting colonization can lead to unnecessary treatment.",
      "Administer prescribed therapy, review unnecessary antibiotics and antimotility drugs, and monitor stool output, abdominal distention, hydration, creatinine, white count, potassium, and urine output because microbiome disruption, dehydration, ileus, kidney injury, and electrolyte loss mark worsening disease.",
      "Escalate immediately for ileus, severe distention, peritoneal signs, hypotension, rising lactate or creatinine, marked leukocytosis, toxic megacolon, shock, or clinical decline despite therapy because fulminant infection may require surgery and intensive care."
    ], [
      "Ileus, severe distention, guarding, rebound, or absent bowel sounds",
      "Hypotension, shock, rising lactate, or acute kidney injury",
      "Marked leukocytosis, toxic megacolon, or rapidly worsening pain",
      "Failure to improve or recurrent severe diarrhea after treatment"
    ], [
      "Teach soap-and-water handwashing, bathroom and surface cleaning with a sporicidal product, and avoiding antidiarrheals unless specifically approved.",
      "Explain recurrence risk and prompt evaluation for renewed watery diarrhea, fever, distention, reduced urine, dizziness, or severe abdominal pain."
    ]),
    card("COVID-19", ["idsa-covid"], [
      "Use current transmission-based precautions and assess symptom timing, vaccination, immune status, breathing, oxygenation with exertion, hydration, mental status, and thrombotic symptoms because treatment eligibility and deterioration risk depend on stage and host factors.",
      "Administer prescribed antiviral or anti-inflammatory therapy after checking kidney and liver function and major drug interactions because benefit and harm vary by disease phase and medication exposure.",
      "Titrate oxygen and support awake positioning and mobility as tolerated while reassessing work of breathing and blood gases because silent hypoxemia and increasing effort may precede respiratory failure.",
      "Monitor pressure, rhythm, intake and output, glucose, kidney and liver tests, coagulation risk, skin and mobility because infection and prolonged illness can cause thrombosis, organ injury, delirium, and pressure injury.",
      "Escalate immediately for increasing oxygen or ventilatory need, exhaustion, confusion, chest pain, hypotension, new focal deficit, painful swollen limb, oliguria, or cytokine-like deterioration because respiratory failure, embolism, myocarditis, stroke, or shock may be present."
    ], [
      "Rapidly increasing oxygen need, exhaustion, or ventilatory failure",
      "Chest pain, unstable rhythm, hypotension, or syncope",
      "New focal deficit or painful unilateral limb swelling",
      "Confusion, oliguria, or progressive multiorgan dysfunction"
    ], [
      "Teach current isolation guidance, vaccination, ventilation and masking strategies for high-risk settings, hydration, and gradual activity recovery.",
      "Explain urgent signs including blue lips, severe breathlessness, chest pain, confusion, fainting, weakness, or inability to maintain fluids."
    ]),
    card("MRSA", ["cdc-mrsa", "cdc-hai"], [
      "In acute-care settings, use Contact Precautions for patients colonized or infected with MRSA and keep lesions covered; follow an approved facility strategy only when local policy uses a risk-assessed alternative because MRSA can spread from colonization as well as draining infection through direct contact and contaminated equipment.",
      "Assess skin, wound, line, lung, bone, joint, and bloodstream symptoms and distinguish a small abscess from invasive disease because drainage alone may treat some lesions while bacteremia requires systemic therapy and source investigation.",
      "Obtain ordered cultures before antibiotics when stable and administer susceptibility-directed therapy with weight and kidney review because correct drug exposure is essential and nephrotoxicity or underdosing can cause failure.",
      "Monitor temperature, pressure, wound size and drainage, oxygenation, blood counts, kidney function, cultures, and device necessity because MRSA can seed endocardium, bone, lung, or implanted material.",
      "Escalate immediately for hypotension, confusion, rising lactate, necrotizing skin change, severe pain out of proportion, hemoptysis, persistent bacteremia, new murmur, or focal back pain with weakness because sepsis, necrotizing pneumonia, endocarditis, or epidural infection may be present."
    ], [
      "Hypotension, confusion, rising lactate, or other sepsis finding",
      "Rapidly spreading necrosis, crepitus, or pain out of proportion",
      "Hemoptysis, severe hypoxemia, or cavitating pneumonia pattern",
      "Persistent bacteremia, new murmur, or back pain with neurologic deficit"
    ], [
      "Teach hand hygiene, keeping wounds covered, not sharing towels or razors, and cleaning high-touch equipment and laundry appropriately.",
      "Explain that antibiotics must match the culture and be completed as prescribed, while recurrent boils, fever, spreading redness, or weakness need prompt review."
    ]),
    card("Osteomyelitis", ["idsa-osteomyelitis", "idsa-diabetic-foot", "pids-aho", "idsa-pji"], [
      "Assess focal bone pain, swelling, drainage, fever, wounds, ulcers, recent surgery, implants, bacteremia, diabetes, vascular status, and neurologic function because infection may arrive by blood, contiguous tissue, or hardware and can threaten limb or cord.",
      "Obtain ordered blood and deep tissue or bone cultures before antibiotics when stable and avoid relying on superficial swabs because organism-directed prolonged therapy requires representative microbiology.",
      "Administer prescribed antimicrobial therapy on schedule and monitor blood counts, kidney and liver function, levels when indicated, line care, and interactions because treatment is prolonged and toxicity or access infection can interrupt cure.",
      "Trend pain, wound dimensions and drainage, temperature, inflammatory markers, perfusion, mobility, and imaging plan and maintain off-loading or immobilization because response is clinical as well as laboratory and mechanical stress delays healing.",
      "Escalate immediately for sepsis, rapidly spreading soft-tissue change, new weakness or bowel-bladder dysfunction, unstable spine, ischemic foot, abscess, hardware failure, or persistent bacteremia because urgent drainage, debridement, or decompression may be required."
    ], [
      "Hypotension, confusion, or rapidly progressive systemic infection",
      "New weakness, sensory loss, or bowel-bladder dysfunction",
      "Ischemic foot, spreading necrosis, abscess, or exposed infected hardware",
      "Persistent bacteremia, worsening pain, or failure despite active therapy"
    ], [
      "Teach completion of the long antimicrobial course, line and wound care, off-loading, glucose and tobacco control, and scheduled laboratory monitoring.",
      "Explain urgent signs: fever with weakness, spreading redness, new drainage, severe back pain, neurologic change, or a cold discolored foot."
    ]),
    card("Rocky Mountain spotted fever", ["cdc-rmsf"], [
      "Recognize compatible fever, severe headache, myalgia, gastrointestinal symptoms, rash, tick exposure, hyponatremia, and thrombocytopenia because early disease is nonspecific and rash may be absent.",
      "Administer prescribed doxycycline immediately without waiting for serology or rash because treatment delay strongly increases severe vascular injury and death, including in children and pregnancy when RMSF is suspected.",
      "Assess mental status, perfusion, oxygenation, skin, edema, urine output, abdominal symptoms, and bleeding because endothelial infection can injure brain, lung, kidney, heart, and coagulation systems.",
      "Monitor sodium, platelets, liver tests, creatinine, glucose, fluid balance, and response while avoiding fluid overload because capillary leak can coexist with dehydration and pulmonary edema.",
      "Escalate immediately for confusion, seizure, focal deficit, hypoxemia, hypotension, oliguria, severe abdominal pain, necrotic digits, bleeding, or rapidly spreading petechiae because fulminant vasculitis requires intensive support."
    ], [
      "Confusion, seizure, focal deficit, or declining consciousness",
      "Hypoxemia, pulmonary edema, hypotension, or shock",
      "Oliguria, acute kidney injury, severe abdominal pain, or jaundice",
      "Rapid petechiae, bleeding, or ischemic and necrotic digits"
    ], [
      "Teach that a tick bite or rash may never be noticed and that prescribed doxycycline should not be delayed or stopped early because tests can be negative initially.",
      "Review tick checks, repellents, prompt removal, and urgent care for fever with severe headache or rash after outdoor exposure."
    ]),
    card("Tetanus", ["cdc-tetanus", "aha-als-2025"], [
      "Place the patient in a quiet low-stimulation environment and assess trismus, dysphagia, rigidity, spasms, breathing, wound, and vaccine history because sound, light, touch, and procedures can trigger dangerous generalized spasm.",
      "Prepare early airway and ventilatory support and continuous cardiac monitoring because laryngeal spasm, chest rigidity, aspiration, and autonomic storms can cause sudden arrest.",
      "Administer prescribed tetanus immune globulin, wound debridement, antimicrobial and spasm-control therapy because neutralizing unbound toxin and eliminating bacterial production limit further neurologic injury.",
      "Monitor temperature, pressure, pulse, rhythm, oxygenation, carbon dioxide, urine output, nutrition, skin, thrombosis, and medication sedation because prolonged paralysis and autonomic instability create multisystem complications.",
      "Escalate immediately for laryngospasm, apnea, recurrent generalized spasms, severe dysphagia, labile hypertension, profound hypotension, unstable rhythm, hyperthermia, or rhabdomyolysis because intensive airway and autonomic management are required."
    ], [
      "Laryngospasm, apnea, cyanosis, or inability to protect the airway",
      "Recurrent generalized spasms or severe truncal rigidity",
      "Extreme pressure swings, unstable rhythm, or hyperthermia",
      "Rhabdomyolysis, oliguria, aspiration, or progressive respiratory failure"
    ], [
      "Explain that illness does not create reliable immunity, so the vaccine series must still be completed after recovery.",
      "Teach routine booster timing and immediate wound cleaning and vaccine review after dirty, penetrating, crush, burn, or devitalized injuries."
    ]),
    card("Toxic shock syndrome", ["sccm-sepsis-2026", "cdc-stss", "fda-tampon-tss"], [
      "Recognize abrupt fever, diffuse rash, hypotension, severe myalgia, vomiting or diarrhea, mucosal redness, confusion, wound or device exposure, and multiorgan injury because toxin-mediated shock can progress before cultures identify a source.",
      "Activate sepsis and shock care, obtain ordered cultures, establish large-bore access, measure lactate, and begin prescribed fluids and vasopressors with repeated perfusion checks because capillary leak and vasodilation rapidly reduce organ blood flow.",
      "Remove or urgently coordinate removal and drainage of a tampon, packing, wound, abscess, or infected device because toxin production continues until the source is controlled.",
      "Administer prescribed broad then targeted antimicrobial therapy and monitor kidney and liver function, platelets, creatine kinase, coagulation, oxygenation, urine output, and extremity perfusion because shock, rhabdomyolysis, coagulopathy, and tissue necrosis can coexist.",
      "Escalate immediately for refractory hypotension, rising lactate, respiratory failure, altered consciousness, oliguria, coagulopathic bleeding, rapidly spreading wound pain or necrosis, or limb ischemia because intensive support and emergency surgery may be necessary."
    ], [
      "Persistent hypotension, mottling, rising lactate, or shock",
      "Respiratory failure, confusion, seizure, or declining consciousness",
      "Rapidly spreading wound pain, crepitus, necrosis, or compartment change",
      "Oliguria, coagulopathic bleeding, severe liver injury, or rhabdomyolysis"
    ], [
      "Teach safe tampon use and timely removal, wound and packing instructions, and never leaving intravaginal or surgical material longer than directed.",
      "Explain that recurrent sudden fever, rash, vomiting, dizziness, wound pain, or fainting requires emergency care and immediate removal of a removable suspected source."
    ]),
    card("Measles", ["cdc-measles"], [
      "Place the patient immediately in airborne isolation and use immune-status-appropriate respiratory protection because measles virus remains infectious in shared air and is exceptionally contagious.",
      "Notify infection control and public health and document rash onset, fever, cough, coryza, conjunctivitis, vaccination, travel, pregnancy, immune status, and contacts because rapid case confirmation and exposure management prevent outbreaks.",
      "Collect ordered respiratory and blood specimens safely and provide hydration, fever care, nutrition, and prescribed vitamin A for children because treatment is supportive while vitamin A reduces complications in deficient pediatric patients.",
      "Monitor breathing, oxygenation, hydration, urine output, ear pain, vision, mental status, and secondary fever because pneumonia, otitis, keratitis, dehydration, encephalitis, and bacterial superinfection cause most morbidity.",
      "Escalate immediately for hypoxemia, severe work of breathing, dehydration, corneal change, confusion, seizure, focal deficit, pregnancy complications, or immune-compromised deterioration because severe pulmonary or neurologic measles needs specialist care."
    ], [
      "Hypoxemia, severe respiratory distress, or suspected pneumonia",
      "Confusion, seizure, focal deficit, or declining consciousness",
      "Eye pain, corneal change, or new vision impairment",
      "Severe dehydration or rapid decline in pregnancy or immunocompromise"
    ], [
      "Teach that the patient must follow public-health isolation instructions and call ahead before entering any healthcare setting to protect others in waiting rooms.",
      "Explain that two-dose vaccination is the best prevention and review postexposure guidance promptly for susceptible contacts."
    ]),
    card("Placenta accreta spectrum", ["acog-accreta"], [
      "Identify placenta previa, prior cesarean or uterine surgery, ultrasound or magnetic-resonance findings, bleeding history, and delivery plan because antenatal recognition permits birth before uncontrolled placental separation occurs.",
      "Coordinate delivery at an experienced level III or IV maternal center with obstetric, anesthesia, blood-bank, surgical, neonatal, and intensive-care teams because planned multidisciplinary care reduces catastrophic hemorrhage.",
      "Maintain reliable vascular access, obtain current blood count, coagulation and type and crossmatch, verify massive-transfusion readiness, and quantify every blood loss because visible bleeding can underestimate rapid maternal volume loss.",
      "Do not apply traction to a placenta suspected to be invasive and prepare for cesarean hysterectomy with placenta left in situ when planned because forced separation opens large noncontractile placental vessels.",
      "Escalate immediately for vaginal bleeding, hypotension, tachycardia, pallor, confusion, abdominal pain, falling fibrinogen, oliguria, fetal bradycardia, or unplanned labor or membrane rupture because emergency delivery and hemorrhage control may be required."
    ], [
      "Any significant bleeding with hypotension, tachycardia, pallor, or confusion",
      "Fetal bradycardia or recurrent severe decelerations",
      "Falling fibrinogen, coagulopathic bleeding, or rapidly rising transfusion need",
      "Labor, membrane rupture, severe abdominal pain, or bleeding before planned delivery"
    ], [
      "Explain why delivery is planned at a specialized center and why hysterectomy or major transfusion may be necessary to control noncontractile placental-bed bleeding.",
      "Teach pelvic and activity instructions individualized by the obstetric team and immediate emergency evaluation for bleeding, contractions, fluid leakage, dizziness, or reduced fetal movement."
    ]),
    card("Uterine rupture", ["acog-vbac", "acog-labor"], [
      "Recognize prior uterine scar or surgery, induction or augmentation exposure, obstructed labor, trauma, abnormal fetal tracing, sudden pain, bleeding, loss of station, and maternal instability because rupture may first appear as fetal compromise rather than visible hemorrhage.",
      "Stop uterotonic infusion, call the obstetric emergency team, position for perfusion, administer oxygen when indicated, and establish large-bore access because continued stimulation and delayed operative delivery worsen fetal hypoxia and maternal bleeding.",
      "Maintain continuous fetal and maternal monitoring and prepare immediate laparotomy and cesarean birth because surgical control is the definitive treatment for a torn uterus.",
      "Activate the hemorrhage protocol, obtain blood and coagulation studies, quantify loss, warm fluids and blood, and trend urine output, lactate, fibrinogen, and platelets because concealed intraperitoneal bleeding can produce shock and coagulopathy.",
      "Escalate immediately for prolonged fetal bradycardia, sudden severe or persistent abdominal pain, cessation of contractions, palpable fetal parts, loss of presenting-part station, vaginal bleeding, hypotension, or shock because minutes determine fetal and maternal survival."
    ], [
      "Prolonged fetal bradycardia or recurrent severe decelerations",
      "Sudden persistent abdominal pain, loss of station, or palpable fetal parts",
      "Vaginal bleeding, hypotension, tachycardia, or maternal collapse",
      "Cessation of contractions with fetal or maternal deterioration"
    ], [
      "Explain after stabilization what rupture means for recovery and future pregnancy planning, including early specialist care and individualized delivery timing.",
      "Teach immediate evaluation in any future pregnancy for severe abdominal pain, bleeding, contractions, fluid leakage, fainting, or reduced fetal movement."
    ]),
    card("Vasa previa", ["smfm-vasa-previa"], [
      "Verify prenatal vessel mapping, placental and cord anatomy, cervical length, bleeding history, and planned cesarean timing because fetal vessels crossing the membranes can rupture without maternal hemodynamic warning.",
      "Maintain ready access to fetal monitoring, neonatal resuscitation, blood products, and an emergency operating room when hospitalized because membrane rupture can cause rapid fetal exsanguination.",
      "Avoid digital cervical examination or artificial membrane rupture unless the obstetric team has explicitly excluded exposed vessels because instrumentation can tear unprotected fetal vessels.",
      "Administer prescribed antenatal corticosteroids and monitor contractions, bleeding, membrane status, fetal movement, and heart tracing because planned preterm birth balances prematurity against catastrophic vessel rupture.",
      "Escalate immediately for vaginal bleeding, spontaneous or artificial membrane rupture, contractions, fetal bradycardia, sinusoidal tracing, recurrent decelerations, or reduced fetal movement because emergency cesarean birth and neonatal transfusion may be lifesaving."
    ], [
      "Bleeding at or after membrane rupture",
      "Fetal bradycardia, sinusoidal pattern, or recurrent severe decelerations",
      "Preterm labor, contractions, or unexpected cervical change",
      "Reduced fetal movement or any concern that membranes have ruptured"
    ], [
      "Explain that the bleeding can be fetal rather than maternal, which is why even a small amount after membrane rupture is an emergency.",
      "Teach the planned birth and surveillance schedule and immediate emergency response for bleeding, fluid leakage, contractions, or reduced fetal movement."
    ]),
    card("Rh incompatibility", ["acog-rh"], [
      "Verify maternal ABO and Rh type, antibody screen, prior pregnancies and transfusions, paternal or fetal typing when available, and every sensitizing event because prevention works only before maternal anti-D antibodies are established.",
      "Administer prescribed Rh immune globulin at routine gestational timing and after bleeding, trauma, procedures, pregnancy loss, delivery of an Rh-positive infant, or other fetomaternal hemorrhage because passive anti-D clears fetal cells before immune sensitization.",
      "Confirm the correct product, dose, route, timing, and need for fetomaternal-hemorrhage quantification because a large bleed may require more than the standard dose.",
      "For an already alloimmunized pregnancy, trend antibody titers and coordinate fetal middle-cerebral-artery Doppler, ultrasound, and newborn bilirubin and hemoglobin monitoring because maternal antibody can cause progressive fetal anemia and neonatal hemolysis.",
      "Escalate immediately for abnormal fetal Doppler, hydrops, reduced movement, nonreassuring fetal tracing, newborn pallor, jaundice in the first day, rapidly rising bilirubin, severe anemia, or neurologic change because transfusion or exchange-level treatment may be needed."
    ], [
      "Abnormal fetal anemia surveillance or hydrops",
      "Reduced fetal movement or nonreassuring fetal heart tracing",
      "Newborn pallor, respiratory distress, or severe anemia",
      "Jaundice in the first 24 hours, rapid bilirubin rise, lethargy, or poor feeding"
    ], [
      "Explain that Rh immune globulin prevents antibody formation; it does not treat antibodies that are already present, so screening and timing matter.",
      "Teach reporting of bleeding, trauma, pregnancy loss, or procedures promptly and keeping a record of blood type, antibody results, and Rh immune globulin doses."
    ]),
    card("Congenital TORCH infection", ["cdc-congenital", "cdc-congenital-rubella", "cdc-toxoplasmosis", "cdc-sti-2021"], [
      "Review maternal fever or rash, exposures, travel, sexual history, vaccination, prenatal testing, ultrasound findings, and timing because fetal effects differ by organism and gestational stage.",
      "Assess the newborn for growth restriction, petechiae or purpura, jaundice, hepatosplenomegaly, microcephaly or hydrocephalus, eye findings, murmur, seizures, feeding difficulty, and hearing response because congenital infection often affects several organs at once.",
      "Collect organism-specific maternal, placental, blood, urine, saliva, cerebrospinal-fluid, or lesion testing at the correct time and with contamination precautions because a generic TORCH panel can misclassify infection.",
      "Administer prescribed organism-specific antimicrobial or antiviral therapy and monitor blood counts, kidney and liver function, bilirubin, growth, hearing, vision, and development because both infection and treatment can cause delayed toxicity or impairment.",
      "Escalate immediately for seizure, apnea, severe jaundice, hypoglycemia, respiratory distress, shock, rapidly rising bilirubin, profound thrombocytopenia, or declining feeding and consciousness because neonatal intensive support is required."
    ], [
      "Seizure, apnea, abnormal tone, or declining consciousness",
      "Severe jaundice, rapidly rising bilirubin, or liver failure",
      "Respiratory distress, shock, hypoglycemia, or inability to feed",
      "Profound thrombocytopenia, bleeding, or rapidly spreading purpura"
    ], [
      "Explain that TORCH is a group of infections, not one diagnosis, so testing and treatment must identify the specific organism.",
      "Teach the need for long-term hearing, vision, growth, neurologic, and developmental follow-up because some effects appear months or years after birth."
    ]),
    card("Pelvic inflammatory disease", ["cdc-sti-2021"], [
      "Assess pelvic or lower abdominal pain, cervical motion or adnexal tenderness, fever, discharge, bleeding, pregnancy possibility, sexual exposure, and hemodynamic status because early PID can be subtle while ectopic pregnancy and surgical emergencies can mimic it.",
      "Obtain a pregnancy test and ordered gonorrhea, chlamydia, HIV, syphilis, urine, and imaging evaluation without delaying empiric treatment when clinical criteria are met because treatment delay increases infertility and ectopic-pregnancy risk.",
      "Administer the complete prescribed broad antimicrobial regimen and manage nausea, pain, hydration, and allergies because PID is often polymicrobial and partial coverage permits persistent upper-tract inflammation.",
      "Monitor temperature, pain, abdominal findings, oral tolerance, discharge, and improvement within 48 to 72 hours because failure suggests abscess, resistant infection, nonadherence, or another diagnosis.",
      "Escalate immediately for pregnancy, hypotension, peritoneal signs, severe pain, vomiting that prevents therapy, high fever, tubo-ovarian abscess, sepsis, or no improvement within 72 hours because hospitalization, drainage, or surgery may be required."
    ], [
      "Pregnancy with pelvic pain, bleeding, dizziness, or syncope",
      "Peritoneal signs, severe escalating pain, high fever, or sepsis",
      "Persistent vomiting or inability to take prescribed therapy",
      "Tubo-ovarian abscess or no improvement within 48 to 72 hours"
    ], [
      "Teach completion of every antibiotic dose, abstaining from sex until treatment is complete and partners are treated, and returning for recommended retesting.",
      "Explain that prompt treatment reduces but cannot reverse existing tubal scarring, so future pregnancy pain or bleeding requires urgent ectopic-pregnancy evaluation."
    ]),
    card("Syphilis", ["cdc-sti-2021"], [
      "Determine symptoms and stage, prior treatment, pregnancy, neurologic, ocular or auditory findings, HIV status, allergies, and quantitative nontreponemal titer because regimen, follow-up, and urgency depend on stage and organ involvement.",
      "Administer the exact prescribed penicillin preparation, dose, interval, and full series and verify no missed weekly dose because benzathine and aqueous formulations are not interchangeable and undertreatment permits progression or congenital infection.",
      "Monitor for a Jarisch-Herxheimer reaction after therapy and assess temperature, pressure, contractions, and fetal status in pregnancy because inflammatory response can cause acute systemic symptoms and fetal distress but is not penicillin allergy.",
      "Coordinate partner notification, confidential public-health reporting, HIV and other STI testing, and serial titers because reinfection and inadequate serologic response require detection.",
      "Escalate immediately for vision change, eye pain, hearing loss, cranial-nerve deficit, meningismus, stroke-like symptoms, altered consciousness, aortic symptoms, pregnancy contractions or reduced fetal movement, or anaphylaxis because neurosyphilis, ocular disease, cardiovascular disease, fetal compromise, or allergy requires urgent care."
    ], [
      "Vision change, eye pain, hearing loss, or cranial-nerve deficit",
      "Meningismus, focal deficit, seizure, or altered consciousness",
      "Chest or back pain with aortic-regurgitation or aneurysm concern",
      "Pregnancy contractions, reduced fetal movement, fetal distress, or anaphylaxis"
    ], [
      "Teach that symptoms can disappear while infection remains, so completing treatment and serial blood tests is essential.",
      "Explain partner treatment, barrier protection, avoidance of sex until advised, and why penicillin is required in pregnancy to prevent congenital syphilis."
    ]),
    card("Amniotic fluid embolism", ["smfm-afe", "aha-als-2025"], [
      "Recognize sudden hypoxemia, hypotension or arrest, altered consciousness, seizure, fetal distress, and rapidly developing disseminated coagulation during labor or soon after birth because amniotic fluid embolism is a clinical diagnosis requiring immediate simultaneous resuscitation.",
      "Activate maternal cardiac-arrest, obstetric hemorrhage, anesthesia, neonatal, blood-bank, and critical-care teams and begin high-quality resuscitation with left uterine displacement when appropriate because maternal oxygen delivery and relief of aortocaval compression determine both lives.",
      "Secure the airway, provide high-concentration oxygen and ventilatory support, establish large-bore access, and administer prescribed vasoactive and inotropic therapy because acute pulmonary vasoconstriction and right-heart failure can progress to left-heart failure and shock.",
      "Quantify bleeding and trend fibrinogen, platelets, coagulation, hemoglobin, lactate, blood gases, urine output, rhythm, and bedside cardiac findings while giving goal-directed blood components because severe consumptive coagulopathy often follows cardiopulmonary collapse.",
      "Escalate immediately for maternal arrest, refractory hypoxemia or hypotension, fetal bradycardia, uterine atony with uncontrolled bleeding, rapidly falling fibrinogen, ventricular failure, or multiorgan dysfunction because resuscitative delivery, massive transfusion, and advanced circulatory support may be required."
    ], [
      "Sudden maternal hypoxemia, hypotension, seizure, or cardiac arrest",
      "Fetal bradycardia or persistent severe fetal distress",
      "Uncontrolled uterine or operative bleeding with falling fibrinogen",
      "Refractory right- or left-heart failure, shock, or multiorgan dysfunction"
    ], [
      "Explain to survivors and families that amniotic fluid embolism is sudden and unpredictable and was not caused by an action during labor.",
      "Arrange cardiopulmonary, neurologic, hematologic, postpartum, lactation, and trauma-informed mental-health follow-up because recovery may involve multiple organs and significant psychological injury."
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
  window.ANI_PATHOLOGY_NURSING_WAVE28_A = {
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
