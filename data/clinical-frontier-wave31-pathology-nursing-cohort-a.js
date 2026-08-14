(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  const VERSION = "2026-07-18-wave31-pathology-nursing-a-1";
  const sources = [
    { id: "medline-dpd", label: "MedlinePlus, Dependent Personality Disorder", url: "https://medlineplus.gov/ency/article/000941.htm", note: "Supports psychological evaluation, psychotherapy that develops independent decision-making, assessment of depression, anxiety, substance use, abuse vulnerability, and urgent response to suicidal thoughts." },
    { id: "samhsa-safe-t-2024", label: "SAMHSA, 2024 SAFE-T Suicide Assessment and Triage", url: "https://library.samhsa.gov/product/safe-t-suicide-assessment-five-step-evaluation-and-triage/pep24-01-036", note: "Supports direct suicide inquiry, risk and protective-factor assessment, safety planning, lethal-means counseling, documented triage, and immediate crisis intervention for imminent danger." },
    { id: "aha-pericarditis-2026", label: "American Heart Association, Treatment of Pericarditis", url: "https://www.heart.org/en/health-topics/pericarditis/treatment-of-pericarditis", note: "Supports anti-inflammatory treatment, activity restriction, recurrence surveillance, and urgent drainage when pericardial effusion causes cardiac tamponade." },
    { id: "acc-inoca-2020", label: "ACC/EAPCI, Ischemia With Nonobstructive Coronary Arteries Consensus", url: "https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2020/07/15/14/49/an-eapci-expert-consensus-document-on-ischemia", note: "Supports recognition and testing of vasospastic angina, calcium-channel blocker and nitrate therapy, trigger reduction, and differentiation from obstructive acute coronary syndromes." },
    { id: "acc-pulmonary-stenosis-2023", label: "ACC, Pulmonary Stenosis Follow-up Algorithm", url: "https://www.acc.org/latest-in-cardiology/articles/2023/05/16/10/31/clinical-practice-algorithm-for-the-follow-up-of-pulmonary-stenosis-pre-and-post-intervention", note: "Supports severity-based echocardiographic surveillance, symptom assessment, catheter or surgical referral, and follow-up for right-ventricular dysfunction after pulmonary stenosis intervention." },
    { id: "niams-raynaud", label: "NIAMS, Raynaud's Phenomenon", url: "https://www.niams.nih.gov/health-topics/raynauds-phenomenon", note: "Supports attack and tissue-perfusion assessment, warming and trigger avoidance, evaluation for secondary autoimmune disease, and urgent care for ischemic ulcers or gangrene." },
    { id: "nih-ods-folate", label: "NIH Office of Dietary Supplements, Folate Fact Sheet for Health Professionals", url: "https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/", note: "Supports folate's role in DNA synthesis, recognition of megaloblastic anemia, evaluation of dietary, alcohol and malabsorptive causes, pregnancy needs, and safe supplementation." },
    { id: "cdc-niosh-heat", label: "CDC/NIOSH, Heat-related Illnesses", url: "https://www.cdc.gov/niosh/heat-stress/about/illnesses.html", note: "Supports rapid removal from heat, active cooling, hydration and medical evaluation for heat exhaustion, and immediate emergency response when altered mental status suggests heat stroke." },
    { id: "nci-oral-mucositis", label: "NCI, Oral Complications of Cancer Therapies PDQ", url: "https://www.cancer.gov/about-cancer/treatment/side-effects/mouth-throat/oral-complications-hp-pdq", note: "Supports standardized mucositis grading, atraumatic oral hygiene, pain and nutrition care, infection surveillance, and escalation for inability to eat, bleeding, or airway compromise." },
    { id: "cdc-spider", label: "CDC/NIOSH, Venomous Spiders", url: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-spiders.html", note: "Supports safe identification, cleansing, cold application and elevation after a bite, avoidance of venom extraction, tetanus review, and prompt professional assessment for systemic or necrotic illness." },
    { id: "cdc-hfmd", label: "CDC, Hand, Foot, and Mouth Disease Symptoms and Complications", url: "https://www.cdc.gov/hand-foot-mouth/signs-symptoms/index.html", note: "Supports hydration and oral-pain assessment, transmission prevention, and escalation for dehydration, prolonged fever, severe illness, meningitis, encephalitis, or weakness." },
    { id: "medline-klinefelter", label: "MedlinePlus Genetics, Klinefelter Syndrome", url: "https://medlineplus.gov/genetics/condition/klinefelter-syndrome/", note: "Supports assessment of testosterone deficiency, puberty, fertility, language and learning needs, bone and metabolic health, and coordinated lifelong developmental and endocrine care." },
    { id: "aha-stroke-2021", label: "AHA/ASA, 2021 Secondary Stroke Prevention Guideline", url: "https://professional.heart.org/en/science-news/2021-guideline-for-the-prevention-of-stroke-in-patients-with-stroke-and-tia", note: "Supports complete cryptogenic-stroke evaluation, individualized antithrombotic care, and shared evaluation of patent-foramen-ovale closure in selected patients after nonlacunar stroke." },
    { id: "medline-roseola", label: "MedlinePlus, Roseola", url: "https://medlineplus.gov/ency/article/000968.htm", note: "Supports recognition of the high-fever then rash pattern, supportive hydration and fever care, seizure precautions, and emergency response for convulsions or serious neurologic illness." },
    { id: "nci-cutaneous-scc", label: "NCI, Skin Cancer Treatment PDQ (cutaneous cSCC scope)", url: "https://www.cancer.gov/types/skin/hp/skin-treatment-pdq", note: "Scope: supports biopsy, risk assessment, treatment, and recurrence or nodal surveillance for cutaneous squamous cell carcinoma only; a squamous carcinoma arising at another anatomic site requires its site-specific pathway." },
    { id: "nci-scc-definition", label: "NCI Dictionary of Cancer Terms, Squamous Cell Carcinoma", url: "https://www.cancer.gov/publications/dictionaries/cancer-terms/def/squamous-cell-carcinoma", note: "Clarifies that squamous cell carcinoma can arise in skin or in squamous-lined hollow organs and respiratory or digestive tracts, so the anatomic primary site must be confirmed before applying a site-specific care pathway." },
    { id: "nidcd-balance", label: "NIDCD, Balance Disorders", url: "https://www.nidcd.nih.gov/health/balance-disorders", note: "Supports recognition of labyrinthitis as vertigo with imbalance and possible auditory involvement, diagnostic evaluation, fall prevention, vestibular rehabilitation, and exclusion of neurologic emergencies." },
    { id: "idsa-rhinosinusitis", label: "IDSA, Acute Bacterial Rhinosinusitis Guideline", url: "https://www.idsociety.org/practice-guideline/rhinosinusitis/", note: "Supports clinical differentiation of likely bacterial from viral sinusitis, selective antimicrobial treatment, symptom care, reassessment of nonresponse, and recognition of orbital or intracranial complications." },
    { id: "nidcd-tinnitus", label: "NIDCD, Tinnitus", url: "https://www.nidcd.nih.gov/health/tinnitus", note: "Supports hearing and exposure assessment, medication review, audiologic and otolaryngologic evaluation, coping therapies, and urgent investigation of sudden, unilateral, pulsatile, or neurologically associated tinnitus." },
    { id: "cdc-strep-throat-2025", label: "CDC, 2025 Group A Streptococcal Pharyngitis Guidance", url: "https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/strep-throat.html", note: "Supports airway and throat assessment, appropriate rapid testing and culture, confirmed-infection antibiotics, transmission precautions, and recognition of peritonsillar, retropharyngeal, rheumatic, or renal complications." },
    { id: "cdc-epididymitis", label: "CDC, Epididymitis STI Treatment Guideline", url: "https://www.cdc.gov/std/treatment-guidelines/epididymitis.htm", note: "Supports immediate exclusion of torsion, sexually transmitted and enteric organism testing, empiric therapy, scrotal support, partner care, and reassessment when symptoms fail to improve within 72 hours." },
    { id: "nice-iv-fluids", label: "NICE, Intravenous Fluid Therapy in Adults", url: "https://www.nice.org.uk/guidance/cg174/chapter/recommendations", note: "Supports history, examination, fluid-balance, weight, kidney and electrolyte assessment, controlled crystalloid resuscitation, repeated response checks, and prevention of fluid overload or electrolyte injury." },
    { id: "ascrs-hemorrhoids-2024", label: "ASCRS, 2024 Hemorrhoids Clinical Practice Guideline", url: "https://fascrs.org/ascrs/media/files/2024-Hemorrhoids-CPG.pdf", note: "Supports evaluation of rectal bleeding, bowel-habit and fiber treatment, office and surgical options, and recognition of thrombosis, significant hemorrhage, urinary retention, or postoperative sepsis." },
    { id: "niddk-gerd", label: "NIDDK, Gastroesophageal Reflux Disease", url: "https://www.niddk.nih.gov/health-information/digestive-diseases/acid-reflux-ger-gerd-adults/treatment", note: "Supports meal, positioning, weight and tobacco measures, acid-suppression therapy, and evaluation of dysphagia, bleeding, refractory symptoms, aspiration, and hiatal-hernia-associated reflux." },
    { id: "acg-gerd-2022", label: "American College of Gastroenterology, 2022 GERD Clinical Guideline", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8754510/", note: "Supports alarm-feature endoscopy, evidence-directed reflux testing, proton-pump inhibitor use before meals, individualized lifestyle measures, and risk-based rather than indiscriminate monitoring during long-term acid suppression." },
    { id: "sages-hiatal-2024", label: "SAGES, 2024 Guidelines for the Surgical Treatment of Hiatal Hernias", url: "https://www.sages.org/publications/guidelines/guidelines-for-the-surgical-treatment-of-hiatal-hernias/", note: "Supports distinguishing sliding from type II-IV paraesophageal hernias, assessing reflux, microaspiration, anemia and non-gastrointestinal symptoms, shared surgical decisions, and explicit counseling about acute gastric-volvulus risk." },
    { id: "aats-diaphragmatic-hernias", label: "American Association for Thoracic Surgery, Diaphragmatic Hernias", url: "https://www.aats.org/tsra-primer-diaphragmatic-hernias", note: "Supports paraesophageal-hernia anatomy and recognition that incarceration or complete gastric volvulus can produce closed-loop obstruction, strangulation, ischemia, bleeding, necrosis, and perforation requiring urgent surgical evaluation." },
    { id: "acg-ibs", label: "American College of Gastroenterology, Irritable Bowel Syndrome", url: "https://gi.org/topics/irritable-bowel-syndrome/", note: "Supports positive symptom-based assessment, limited alarm-directed testing, subtype-specific treatment, dietitian-guided dietary trials, gut-brain education, and escalation for bleeding, anemia, weight loss, fever, or late-onset symptoms." },
    { id: "nci-mesothelioma", label: "NCI, Malignant Mesothelioma Treatment PDQ", url: "https://www.cancer.gov/types/mesothelioma/hp/mesothelioma-treatment-pdq", note: "Supports stage and performance assessment, multimodality and systemic treatment, management of pleural effusion and pain, and surveillance for respiratory, thrombotic, infectious, and treatment complications." },
    { id: "niddk-retention", label: "NIDDK, Urinary Retention", url: "https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-retention/diagnosis", note: "Supports postvoid-residual measurement, cause and medication assessment, prompt bladder drainage, catheter education, and prevention of infection, bladder overdistention, overflow leakage, and kidney damage." },
    { id: "cdc-pneumoconiosis", label: "CDC/NIOSH, Pneumoconioses", url: "https://www.cdc.gov/niosh/pneumoconioses/about/index.html", note: "Supports detailed occupational exposure history, imaging and pulmonary-function surveillance, dust-control referral, and recognition of progressive respiratory disability from mineral-dust lung disease." },
    { id: "niddk-prostatitis", label: "NIDDK, Prostatitis", url: "https://www.niddk.nih.gov/health-information/urologic-diseases/prostate-problems/prostatitis-inflammation-prostate", note: "Supports differentiation of acute bacterial and chronic syndromes, culture-directed treatment, pain and urinary assessment, and immediate care for sepsis, hematuria, severe pain, urinary retention, or prostatic abscess." },
    { id: "cdc-silica", label: "CDC/NIOSH, Silica Symptoms and Medical Monitoring", url: "https://www.cdc.gov/niosh/silica/symptoms/index.html", note: "Supports exposure cessation, imaging and pulmonary-function monitoring, tuberculosis surveillance, public-health reporting, and recognition of progressive fibrosis, lung cancer, kidney disease, and respiratory failure." },
    { id: "niddk-incontinence", label: "NIDDK, Treatments for Urinary Incontinence", url: "https://www.niddk.nih.gov/health-information/urologic-diseases/bladder-control-problems/treatment", note: "Supports bladder diaries, pelvic-floor and bladder training, fluid and constipation care, subtype-specific devices and medicines, catheter care for overflow, skin protection, and escalation for retention or infection." },
    { id: "ats-vcd", label: "American Thoracic Society, Vocal Cord Dysfunction", url: "https://www.thoracic.org/patients/patient-resources/resources/vocal-cord-dysfunction.pdf", note: "Supports differentiating inducible laryngeal obstruction from asthma, laryngoscopy during symptoms, speech-therapy breathing techniques, trigger care, and urgent exclusion of true hypoxemic or anaphylactic airway emergencies." },
    { id: "endocrine-acromegaly", label: "Endocrine Society, Acromegaly Clinical Practice Guideline", url: "https://www.endocrine.org/clinical-practice-guidelines/acromegaly", note: "Supports GH and IGF-1 assessment, pituitary imaging and treatment, multisystem comorbidity screening, biochemical follow-up, and multidisciplinary surgical, medical, visual, metabolic, cardiac, and sleep care." },
    { id: "ash-amyloidosis-2026", label: "ASH, 2026 Light Chain Amyloidosis Diagnostic Guideline", url: "https://pubmed.ncbi.nlm.nih.gov/41592868/", note: "Supports timely AL-specific assessment with serum and urine immunofixation and serum free-light-chain testing, tissue confirmation and typing, and coordinated evaluation of cardiac, kidney, neurologic, hepatic, and bleeding manifestations." },
    { id: "acc-cardiac-amyloidosis-2023", label: "ACC, 2023 Expert Consensus Decision Pathway on Cardiac Amyloidosis", url: "https://www.acc.org/guidelines/guidelines/2023/01/23/14/11/cardiac-amyloidosis-ecdp", note: "Supports early separation of AL from ATTR, monoclonal-protein screening with serum free light chains plus serum and urine immunofixation, ATTR scintigraphy and genetic testing after AL exclusion, amyloid-specific heart-failure precautions, and transthyretin stabilizer therapy." },
    { id: "ash-al-management-2020", label: "American Society of Hematology, Management of AL Amyloidosis in 2020", url: "https://ashpublications.org/hematology/article/2020/1/363/474364/Management-of-AL-amyloidosis-in-2020", note: "Supports AL-specific interpretation of free-light-chain and organ responses and risk-adapted treatment directed at the plasma-cell or other B-cell clone producing the toxic immunoglobulin light chain." },
    { id: "aa-amyloidosis-2024", label: "Current Rheumatology Reports, 2024 AA Amyloidosis: A Contemporary View", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11219434/", note: "Supports identifying serum amyloid A as the AA precursor, promptly controlling the chronic inflammatory or infectious source to suppress precursor production, and monitoring renal and other organ involvement." },
    { id: "acr-axspa-2026", label: "American College of Rheumatology, 2026 Axial Spondyloarthritis Guideline", url: "https://rheumatology.org/axial-spondyloarthritis-guideline", note: "Supports disease-activity and function assessment, regular exercise and physical therapy, medication and infection safety, and surveillance for uveitis, spinal fracture, neurologic compromise, and extra-articular disease." },
    { id: "nci-bladder", label: "NCI, Bladder Cancer Treatment PDQ", url: "https://www.cancer.gov/types/bladder/hp/bladder-treatment-pdq", note: "Supports hematuria and obstruction assessment, transurethral and intravesical treatment, cystectomy and diversion care, stage-directed systemic therapy, recurrence surveillance, and treatment-complication monitoring." },
    { id: "aaos-carpal-tunnel-2024", label: "AAOS, 2024 Carpal Tunnel Syndrome Guideline", url: "https://new.aaos.org/quality/quality-programs/carpal-tunnel-syndrome/", note: "Supports symptom and motor assessment, evidence-based nonsurgical and surgical treatment, functional follow-up, and prompt referral for progressive weakness, thenar wasting, or postoperative neurovascular or infectious complications." },
    { id: "acg-celiac", label: "American College of Gastroenterology, Celiac Disease", url: "https://gi.org/topics/celiac-non-celiac-gluten-sensitivity-gluten-free-diets/", note: "Supports diagnostic testing before dietary exclusion, lifelong strict gluten avoidance, dietitian care, correction of nutritional deficits, serologic and clinical response monitoring, and evaluation of persistent or alarm symptoms." },
    { id: "nci-esophageal", label: "NCI, Esophageal Cancer Treatment PDQ", url: "https://www.cancer.gov/types/esophageal/hp/esophageal-treatment-pdq", note: "Supports dysphagia and nutrition assessment, multimodality treatment, aspiration precautions, stent or feeding support, and recognition of obstruction, hemorrhage, perforation, anastomotic leak, infection, and treatment toxicity." },
    { id: "acc-bradycardia-2018", label: "ACC/AHA/HRS, Bradycardia and Conduction Delay Guideline", url: "https://www.acc.org/guidelines/guidelines/2018/11/05/06/18/bradycardia-and-cardiac-conduction-delay", note: "Supports electrocardiographic classification, symptom-rhythm correlation, reversible-cause and medication assessment, telemetry, and urgent pacing evaluation for acquired Mobitz II, high-grade, or complete atrioventricular block not caused by a reversible condition." },
    { id: "aha-bradycardia-2025", label: "American Heart Association, 2025 Adult Bradycardia With a Pulse Algorithm", url: "https://www.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf", note: "Supports emergency bradycardia treatment when hypotension, acute mental-status change, shock, ischemic chest discomfort, or acute heart failure indicates cardiopulmonary compromise, with pacing and expert consultation when initial therapy fails." },
    { id: "medline-galactosemia", label: "MedlinePlus Genetics, Galactosemia", url: "https://medlineplus.gov/genetics/condition/galactosemia/", note: "Supports immediate dietary galactose restriction after suspected classic disease, newborn and genetic confirmation, and surveillance for hepatic injury, bleeding, E. coli sepsis, cataract, developmental, speech, bone, and reproductive complications." },
    { id: "niddk-gastritis", label: "NIDDK, Gastritis and Gastropathy", url: "https://www.niddk.nih.gov/health-information/digestive-diseases/gastritis-gastropathy/symptoms-causes", note: "Supports cause and medication assessment, H. pylori and acid-directed treatment, and urgent evaluation of hematemesis, coffee-ground emesis, melena, anemia, hemodynamic compromise, or perforation." },
    { id: "endocrine-xlag-2024", label: "Endocrine Reviews, The Genetic Pathophysiology and Clinical Management of the TADopathy, X-Linked Acrogigantism", url: "https://www.endocrine.org/journals/endocrine-reviews/tadopathy-x-linked-acrogigantism", note: "Scope: supports the very-early-onset X-linked acrogigantism subtype, including GPR101-region duplication, mixed GH and prolactin excess, pituitary adenoma or hyperplasia, genetic evaluation, and subtype-specific treatment challenges." },
    { id: "endotext-pituitary-gigantism", label: "Endotext, Pituitary Gigantism", url: "https://www.ncbi.nlm.nih.gov/books/NBK279155/", note: "Provides general pediatric coverage of GH excess before epiphyseal closure, rapid-growth recognition, pituitary and syndromic causes, GH and IGF-1 evaluation, imaging and genetic assessment, and surgical, medical, radiation, developmental, and comorbidity care." },
    { id: "kdigo-glomerular-2021", label: "KDIGO, 2021 Glomerular Diseases Guideline", url: "https://kdigo.org/guidelines/gd/", note: "Supports immediate treatment of suspected anti-GBM disease, plasma exchange, glucocorticoid and cyclophosphamide care, antibody and kidney monitoring, and urgent management of pulmonary hemorrhage or rapidly progressive kidney failure." },
    { id: "acr-vf-aav-2021", label: "ACR/Vasculitis Foundation, ANCA-associated Vasculitis Guideline", url: "https://vasculitisfoundation.org/treatments-research/treatments/acr-treatment-guidelines/", note: "Supports organ-threat assessment, remission induction and maintenance for granulomatosis with polyangiitis, immunosuppression safety, and surveillance for pulmonary, renal, airway, eye, neurologic, infectious, and thrombotic complications." },
    { id: "niddk-hydronephrosis-newborns", label: "NIDDK, Hydronephrosis in Newborns", url: "https://www.niddk.nih.gov/health-information/urologic-diseases/hydronephrosis-newborns", note: "Scope: supports prenatal and newborn hydronephrosis, transient dilation, congenital obstruction or reflux, urinary-infection recognition, serial imaging, and pediatric drainage or surgery when kidney injury is threatened." },
    { id: "cirse-nephrostomy-stent", label: "CIRSE, Standards of Practice on Nephrostomy and Ureteric Stent Placement and Exchange", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12963180/", note: "Supports adult obstructive-uropathy decompression, urgent drainage of infected obstruction, nephrostomy and ureteric-stent management, planned exchanges, and prompt review for fever, flank pain, leakage, dislodgment, blocked drainage, recurrent acute kidney injury, or pyonephrosis." },
    { id: "obstructive-uropathy-2023", label: "World Journal of Nephrology, Obstructive Uropathy—Acute and Chronic Medical Management", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9846865/", note: "Supports adult obstruction assessment and decompression plus post-obstructive-diuresis surveillance with vital signs, accurate fluid balance, hourly urine output, daily weight, electrolytes, hemodynamic assessment, and individualized fluid replacement." },
    { id: "kdigo-ckd-mbd", label: "KDIGO, CKD-Mineral and Bone Disorder Guideline", url: "https://kdigo.org/guidelines/ckd-mbd/", note: "Supports serial phosphate, calcium and parathyroid-hormone assessment, treatment of persistent hyperphosphatemia with diet, binders and dialysis optimization, and prevention of bone and vascular calcification complications." },
    { id: "waht-hypophosphataemia-2026", label: "Worcestershire Acute Hospitals NHS Trust, Guidelines for the Treatment of Hypophosphataemia in Adults, Version 6", url: "https://apps.worcsacute.nhs.uk/KeyDocumentPortal/Home/DownloadFile/1560", note: "Local Trust protocol—not national NHS guidance—approved 12-13 January 2026 and current through 13 January 2029; supports cause and severity assessment, enteral or monitored intravenous phosphate replacement, renal-impairment precautions, and serial electrolyte, renal, cardiac, respiratory, and refeeding surveillance." },
    { id: "acg-uc-2025", label: "American College of Gastroenterology, 2025 Ulcerative Colitis Guideline", url: "https://gi.org/journals-publications/ebgi/alkazzi_aug2025/", note: "Supports objective inflammatory and infection assessment, remission-targeted therapy, steroid-sparing maintenance, preventive care, and urgent management of acute severe colitis, toxic megacolon, hemorrhage, perforation, or sepsis." },
    { id: "acg-crohn-2025", label: "American College of Gastroenterology, 2025 Crohn Disease Guideline", url: "https://gi.org/journals-publications/ebgi/zhai_dalal_sep2025/", note: "Supports objective disease and nutrition assessment, infection exclusion, induction and maintenance therapy, medication safety, and urgent evaluation of obstruction, abscess, fistula, bleeding, perforation, or severe systemic illness." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const cards = [
    card("Dependent personality disorder", ["medline-dpd", "samhsa-safe-t-2024"], [
      "Assess mental status, decision-making patterns, fear of separation, passivity, relationship safety, depression, anxiety, substance use, and self-harm thoughts because dependence may hide coercion, abuse, or a crisis after threatened loss.",
      "Maintain warm, predictable boundaries and offer two realistic choices instead of making every decision for the patient because repeated supported choices build autonomy without turning the therapeutic relationship into another dependency.",
      "Set small independence goals and record what the patient decided, attempted, and learned because tracking function over time detects progress, avoidance, escalating helplessness, and treatment-interfering reliance more accurately than reassurance alone.",
      "Coordinate consistent psychotherapy, social support, and treatment of coexisting depression or anxiety because talk therapy addresses the dependent pattern while medication should target a defined comorbidity rather than personality traits themselves.",
      "Escalate immediately for suicidal intent or plan, inability to maintain basic safety, escalating substance intoxication, credible abuse danger, or a relationship rupture followed by severe hopelessness because these findings can precede self-harm or exploitation."
    ], [
      "Suicidal intent, plan, preparatory behavior, or access to lethal means",
      "Credible physical, sexual, financial, or emotional abuse with immediate danger",
      "Severe hopelessness or self-neglect after separation, rejection, or bereavement",
      "Intoxication, withdrawal, psychosis, or inability to participate in a safety plan"
    ], [
      "Explain that asking for support is healthy, while practicing one personally chosen decision each day gradually strengthens confidence and reduces helplessness.",
      "Create a written crisis and relationship-safety plan that lists warning signs, trusted contacts, 988, emergency services, and a safe place to go."
    ]),
    card("Dressler syndrome", ["aha-pericarditis-2026"], [
      "Ask about recent myocardial infarction, cardiac surgery, or chest injury and characterize fever and sharp pain that worsens with inspiration or lying flat because delayed immune-mediated pericardial inflammation can resemble recurrent ischemia or pulmonary embolism.",
      "Trend temperature, pain position, heart rate, blood pressure, oxygen saturation, electrocardiogram, inflammatory markers, troponin, and echocardiographic effusion because recurrent inflammation may progress to a hemodynamically important pericardial collection.",
      "Administer prescribed aspirin or other anti-inflammatory therapy and colchicine while monitoring gastrointestinal bleeding, kidney function, and symptom response because controlling inflammation relieves pain and reduces recurrence but treatment can cause toxicity.",
      "Promote rest and hold strenuous activity until symptoms and inflammatory findings resolve as directed because exertion can aggravate active pericardial inflammation and obscure recognition of clinical deterioration.",
      "Escalate immediately for hypotension, jugular venous distention, muffled heart sounds, pulsus paradoxus, syncope, worsening dyspnea, persistent ischemic-type pressure, or an enlarging effusion because tamponade or a new acute coronary syndrome requires urgent intervention."
    ], [
      "Hypotension, narrow pulse pressure, syncope, or rapidly worsening tachycardia",
      "Jugular venous distention, muffled heart sounds, or marked pulsus paradoxus",
      "Increasing dyspnea, hypoxemia, or a rapidly enlarging pericardial effusion",
      "Persistent crushing pressure, dynamic ST change, or rising cardiac biomarkers"
    ], [
      "Teach the patient to distinguish the established positional pleuritic pattern from persistent pressure and to seek emergency care rather than assuming every recurrence is harmless.",
      "Explain why the full anti-inflammatory plan and temporary activity restriction matter, since stopping when pain first improves increases the chance of recurrent inflammation."
    ]),
    card("Prinzmetal/variant angina", ["acc-inoca-2020"], [
      "Characterize rest-pain timing, early-morning clustering, transient episodes, tobacco or stimulant exposure, migraine medicines, and nitrate response because episodic coronary smooth-muscle spasm often occurs without the exertional pattern of fixed obstruction.",
      "Obtain a 12-lead electrocardiogram during pain when possible and trend ST segments, rhythm, blood pressure, oxygenation, pain duration, and troponin because prolonged spasm can cause infarction, bradyarrhythmia, or ventricular tachycardia.",
      "Administer prescribed sublingual nitrate during an episode and scheduled calcium-channel blocker therapy while checking pressure, pulse, dizziness, and relief because vasodilation treats the mechanism but can produce symptomatic hypotension.",
      "Review nicotine, cocaine, amphetamines, decongestants, triptans, cold exposure, and medication adherence with the clinical team because removing vasoconstrictive triggers and missed doses reduces preventable recurrence.",
      "Escalate immediately for pain persisting after the prescribed nitrate plan, syncope, hypotension, sustained ST elevation, rising troponin, ventricular dysrhythmia, or pulmonary edema because ongoing spasm and plaque-mediated acute coronary syndrome cannot be safely distinguished at home."
    ], [
      "Persistent rest pain with sustained ST-segment elevation or depression",
      "Syncope, hypotension, diaphoresis, or altered level of consciousness",
      "Ventricular tachycardia, ventricular fibrillation, or severe bradyarrhythmia",
      "Rising troponin, acute pulmonary edema, or pain unrelieved by prescribed nitrate"
    ], [
      "Teach the exact nitrate emergency plan and tell the patient to sit before dosing because vasodilation may cause fainting even while it relieves coronary spasm.",
      "Explain that tobacco and stimulant avoidance directly prevents vessel constriction, and prescribed preventive medicine should not be stopped merely because episodes are intermittent."
    ]),
    card("Pulmonic stenosis", ["acc-pulmonary-stenosis-2023"], [
      "Assess infant feeding, sweating, growth and cyanosis or older-patient exertional dyspnea, fatigue, chest discomfort, palpitations, and syncope because a narrowed pulmonary valve increases right-ventricular work and severe obstruction limits forward pulmonary flow.",
      "Trend heart rate, rhythm, blood pressure, oxygen saturation, perfusion, jugular venous pressure, edema, liver size, activity tolerance, and ordered echocardiographic gradient because progressive right-ventricular hypertrophy or dysfunction may emerge before resting symptoms.",
      "Cluster care, pace feeding or activity, and follow individualized exertion guidance because reducing avoidable oxygen demand preserves limited right-heart reserve without unnecessarily restricting patients with mild disease.",
      "Prepare for balloon valvuloplasty or surgery when ordered and perform post-catheter distal pulse, color, temperature, bleeding, rhythm, and access-site checks because intervention relieves obstruction but introduces vascular and dysrhythmia risks.",
      "Escalate immediately for new cyanosis, exertional syncope, hypotension, cool poor perfusion, severe dyspnea, sustained dysrhythmia, rapidly increasing edema, or reduced urine output because critical obstruction or right-heart failure can abruptly reduce cardiac output."
    ], [
      "New central cyanosis or oxygen saturation substantially below the established baseline",
      "Exertional syncope, hypotension, cool extremities, or delayed capillary refill",
      "Sustained tachyarrhythmia, severe bradycardia, or new chest pain",
      "Rapidly worsening dyspnea, hepatomegaly, edema, oliguria, or feeding intolerance"
    ], [
      "Explain that follow-up frequency depends on valve gradient, symptoms, and right-ventricular response, so feeling well does not replace scheduled echocardiography.",
      "Teach families to report declining feeding, growth, exercise tolerance, fainting, blue color, swelling, or palpitations before the next routine congenital-heart visit."
    ]),
    card("Raynaud phenomenon", ["niams-raynaud"], [
      "Document cold- or stress-triggered color sequence, symmetry, duration, pain, numbness, medicines, occupational vibration, and autoimmune symptoms because asymmetric, prolonged, painful attacks with tissue injury suggest secondary rather than uncomplicated primary Raynaud phenomenon.",
      "Inspect fingers and toes for temperature, capillary refill, pulses, sensation, ulcers, fissures, infection, and necrosis because repeated vasospasm can progress from reversible ischemia to permanent tissue loss in severe secondary disease.",
      "Move the patient to warmth, remove wet or constrictive items, and warm the affected digits gradually without direct high heat because gentle rewarming restores flow while numb skin is vulnerable to thermal injury.",
      "Administer prescribed vasodilator therapy and monitor blood pressure, dizziness, edema, headache, attack frequency, and wound healing because calcium-channel blockers or other agents may reduce spasm but can cause hypotension.",
      "Escalate urgently for an attack that does not resolve with warming, severe rest pain, a new ulcer, black tissue, absent pulse, spreading erythema, purulent drainage, or fever because critical ischemia or infection threatens the digit."
    ], [
      "Persistent white or blue digit with severe pain despite gradual warming",
      "New ulcer, black tissue, blistering, or rapidly spreading discoloration",
      "Absent pulse, cool insensate digit, or sudden loss of movement",
      "Spreading erythema, purulent drainage, fever, chills, or systemic illness"
    ], [
      "Teach layered warmth for the whole body, gloves before cold exposure, stress-management strategies, and avoidance of nicotine because each reduces reflex peripheral vasoconstriction.",
      "Tell the patient to photograph prolonged attacks and report new sores or asymmetric symptoms because those changes can reveal secondary autoimmune or vascular disease early."
    ]),
    card("Folate deficiency anemia", ["nih-ods-folate"], [
      "Assess fatigue, dyspnea, palpitations, pallor, glossitis, diet, alcohol use, pregnancy, gastrointestinal disease, surgery, and folate-antagonist medicines because inadequate intake, increased demand, malabsorption, and medication effects require different correction plans.",
      "Trend complete blood count, mean corpuscular volume, reticulocytes, folate, vitamin B12, iron studies, and neurologic findings because folate and B12 deficiencies both cause megaloblastosis but folate alone can mask anemia while B12-related nerve injury progresses.",
      "Administer prescribed folic acid and treat the identified dietary, alcohol, medication, or malabsorptive cause while monitoring reticulocyte and hemoglobin response because replacement will fail or relapse if the driver remains active.",
      "Coordinate pregnancy-specific supplementation and nutrition counseling with foods rich in natural folate and fortified folic acid because adequate maternal folate supports rapid cell division and reduces fetal neural-tube-defect risk.",
      "Escalate immediately for chest pain, syncope, severe dyspnea, resting tachycardia with hypotension, acute confusion, active bleeding, or rapidly falling hemoglobin because severe anemia may no longer deliver enough oxygen to vital organs."
    ], [
      "Chest pain, syncope, severe dyspnea, or hemodynamic instability",
      "Rapid hemoglobin decline, active bleeding, or evidence of hemolysis",
      "New paresthesia, gait change, cognitive change, or other possible B12 neurologic deficit",
      "Pregnancy with severe anemia, poor intake, or inability to tolerate supplementation"
    ], [
      "Explain why vitamin B12 must be evaluated before treating presumed folate deficiency, since normalizing the blood count alone does not protect nerves from untreated B12 deficiency.",
      "Teach the prescribed dose and food plan without encouraging megadoses because high supplemental folic acid can obscure another deficiency and interact with some medicines."
    ]),
    card("Heat exhaustion", ["cdc-niosh-heat"], [
      "Move the patient out of heat, remove excess clothing and equipment, begin cool wet cloths, fans, or cold packs, and stop exertion because continued heat production can convert heat exhaustion into life-threatening heat stroke.",
      "Assess airway, breathing, circulation, rectal core temperature when indicated, mental status, blood pressure, pulse, respirations, oxygen saturation, skin, and glucose because confusion or major central nervous system change indicates heat stroke rather than simple exhaustion.",
      "Give cool oral water or electrolyte solution in small repeated amounts only when the patient is alert and not vomiting, or provide prescribed intravenous fluid because safe rehydration restores circulating volume without aspiration.",
      "Trend temperature, orthostasis, urine output and color, sodium, potassium, creatinine, creatine kinase, and symptoms during cooling because hyponatremia, acute kidney injury, and exertional rhabdomyolysis may accompany or mimic heat illness.",
      "Activate emergency response for altered behavior, seizure, collapse, core temperature near or above 40 degrees Celsius, persistent hypotension, chest pain, dyspnea, repeated vomiting, worsening symptoms, or failure to improve within one hour because heat stroke and organ injury require immediate advanced care."
    ], [
      "Confusion, ataxia, seizure, collapse, or loss of consciousness",
      "Core temperature near or above 40 degrees Celsius with systemic illness",
      "Persistent hypotension, chest pain, severe dyspnea, or shock findings",
      "Repeated vomiting, dark urine, oliguria, severe muscle pain, or worsening after cooling"
    ], [
      "Teach gradual heat acclimatization, scheduled water and rest breaks, breathable clothing, and a buddy system because thirst and self-awareness often lag behind physiologic heat strain.",
      "Explain that returning to strenuous work or exercise the same day can trigger recurrence, so activity should resume only after recovery and clinical guidance."
    ]),
    card("Mucositis", ["nci-oral-mucositis"], [
      "Inspect lips, tongue, gums, palate, buccal mucosa, swallowing, saliva, pain, ulcer number, bleeding, dentures, and oral intake with a consistent grade because serial findings guide analgesia, nutrition support, infection evaluation, and cancer-treatment decisions.",
      "Provide gentle oral care with a soft brush and frequent bland saline or bicarbonate rinses, keep lips moist, and avoid alcohol mouthwash because atraumatic cleansing reduces microbial burden without further injuring exposed mucosa.",
      "Administer prescribed topical or systemic analgesia before meals and oral care and reassess pain, sedation, and swallowing because effective timed relief enables hydration and nutrition while preventing opioid-related respiratory harm.",
      "Trend weight, intake, urine output, blood count and neutrophils, temperature, oral plaques or vesicles, and bleeding because ulcerated mucosa can cause dehydration, malnutrition, candidiasis, viral infection, bacteremia, and hemorrhage.",
      "Escalate immediately for stridor or dyspnea, inability to swallow liquids or secretions, neutropenic fever, uncontrolled oral bleeding, hypotension, confusion, rapidly spreading swelling, or severe pain unrelieved by treatment because airway compromise, sepsis, hemorrhage, or profound dehydration may be developing."
    ], [
      "Stridor, voice change, drooling, dyspnea, or inability to manage secretions",
      "Fever or rigors during neutropenia or rapidly progressive oral infection",
      "Uncontrolled bleeding, petechiae with thrombocytopenia, or hemodynamic decline",
      "Inability to drink, oliguria, rapid weight loss, or severe refractory pain"
    ], [
      "Teach gentle brushing and bland rinsing on a regular schedule and explain that consistent care prevents crusting and infection even when eating is painful.",
      "Recommend soft moist foods and cool fluids while avoiding tobacco, alcohol, spicy, acidic, rough, or very hot items because these directly irritate damaged mucosa."
    ]),
    card("Spider bite", ["cdc-spider"], [
      "Record bite time and setting, safely obtained spider photograph, local pain and skin change, allergies, medicines, tetanus status, and competing diagnoses because many presumed spider bites are bacterial infections or other lesions rather than confirmed envenomation.",
      "Wash with soap and water, apply wrapped cool packs intermittently, elevate the limb, remove constrictive jewelry, and mark erythema borders because simple wound care limits swelling and makes progression measurable without damaging tissue.",
      "Trend vital signs, pain spread, muscle cramping, diaphoresis, abdominal rigidity, wound color, blistering, urine color, hemoglobin, and kidney function as indicated because widow neurotoxicity and recluse-associated necrosis or hemolysis follow different time courses.",
      "Contact poison control or a toxicology service for systemic symptoms and provide prescribed analgesia, tetanus prophylaxis, wound care, or antivenom while monitoring reactions because expert species- and severity-based management prevents unnecessary cutting, suction, antibiotics, or surgery.",
      "Escalate immediately for dyspnea, facial or tongue swelling, severe generalized cramps, chest pain, shock, rapidly expanding necrosis, fever, jaundice, dark urine, falling hemoglobin, or oliguria because anaphylaxis, severe envenomation, sepsis, hemolysis, or kidney injury may be present."
    ], [
      "Dyspnea, wheeze, facial swelling, hypotension, or other anaphylaxis findings",
      "Severe generalized muscle cramping, abdominal rigidity, chest pain, or autonomic instability",
      "Rapidly expanding blister, dusky skin, necrosis, spreading erythema, or fever",
      "Jaundice, dark urine, falling hemoglobin, reduced urine output, or acute kidney injury"
    ], [
      "Tell the patient not to cut, squeeze, suction, burn, or apply an unwrapped ice pack because those measures add tissue injury without reliably removing venom.",
      "Teach daily wound photographs and prompt reassessment for expanding pain, discoloration, fever, jaundice, or dark urine because serious effects can appear after the initial bite."
    ]),
    card("Hand foot and mouth disease", ["cdc-hfmd"], [
      "Assess fever duration, mouth ulcers, drooling, palm and sole rash, activity, weight, oral intake, tears, mucous membranes, capillary refill, and urine output because painful swallowing makes dehydration the most common important complication.",
      "Offer frequent cool liquids, oral rehydration solution, ice pops, and soft foods and provide weight-appropriate prescribed analgesic or antipyretic because pain control improves drinking while aspirin is unsafe for children with viral illness.",
      "Use meticulous hand hygiene after diapering and toileting, clean shared surfaces and toys, avoid touching blisters, and follow setting-specific exclusion guidance because enteroviruses spread through respiratory secretions, blister fluid, and stool.",
      "Trend hydration, fever, headache, neck stiffness, behavior, gait, strength, and breathing because rare enteroviral meningitis, encephalitis, paralysis, or cardiopulmonary complications require recognition beyond the expected seven-to-ten-day illness.",
      "Escalate urgently for inability to drink, markedly reduced urine, fever lasting more than three days, severe headache or stiff neck, confusion, seizure, new weakness, dyspnea, or severe illness in an infant younger than six months because dehydration or invasive neurologic disease may be developing."
    ], [
      "No urine for an age-inappropriate interval, absent tears, lethargy, or poor perfusion",
      "Severe headache, stiff neck, photophobia, confusion, or seizure",
      "New limb weakness, difficulty walking, dyspnea, cyanosis, or chest pain",
      "Fever beyond three days, symptoms beyond ten days, or severe illness in a young infant"
    ], [
      "Teach caregivers to prioritize fluids over solid food and to track urine output because a child can become dehydrated quickly when mouth pain limits swallowing.",
      "Explain that handwashing remains important after the rash resolves because virus can continue to pass in stool for weeks after visible recovery."
    ]),
    card("Klinefelter syndrome", ["medline-klinefelter"], [
      "Assess growth, pubertal progression, testicular size, gynecomastia, energy, muscle strength, language, learning, mood, social function, and fertility concerns because the 47,XXY pattern can affect endocrine, developmental, reproductive, and psychosocial health differently across the lifespan.",
      "Trend testosterone and gonadotropins as ordered, blood pressure, weight, glucose, lipids, bone density, and fracture risk because hypogonadism increases metabolic and skeletal complications even when outward pubertal differences are subtle.",
      "Administer prescribed testosterone and monitor growth, mood, acne, hematocrit, sleep symptoms, and treatment goals because replacement supports secondary sex characteristics, bone, and muscle but requires individualized safety follow-up.",
      "Coordinate speech-language, educational, behavioral, endocrine, fertility, and genetic services early because targeted support can improve communication, school function, self-advocacy, family understanding, and future reproductive planning.",
      "Escalate for severe depression or suicidal thinking, acute unilateral leg swelling or dyspnea, a new breast or testicular mass, pathologic fracture, or marked hyperglycemia symptoms because mental-health, thrombotic, malignant, skeletal, and metabolic complications need prompt evaluation."
    ], [
      "Suicidal thoughts, severe depression, bullying-related crisis, or abrupt functional decline",
      "Acute unilateral leg swelling, pleuritic chest pain, dyspnea, or hypoxemia",
      "New breast lump, nipple change, testicular mass, or unexplained lymphadenopathy",
      "Low-trauma fracture, severe hyperglycemia symptoms, or rapidly worsening sleep apnea"
    ], [
      "Explain that Klinefelter syndrome is a common chromosome variation rather than anyone's fault, and that strengths and support needs differ widely between individuals.",
      "Discuss fertility preservation and reproductive options before decisions become urgent because sperm retrieval or assisted reproduction may be possible for some patients."
    ]),
    card("Patent foramen ovale", ["aha-stroke-2021"], [
      "Clarify whether the PFO was incidental or found during evaluation of stroke, transient neurologic symptoms, systemic embolism, decompression illness, or unexplained hypoxemia because most PFOs need no treatment unless the clinical context suggests pathologic shunting.",
      "After a suspected embolic event, perform serial neurologic checks and trend rhythm, oxygenation, limb findings, brain and vascular studies, and venous-thrombosis evaluation because atrial fibrillation, arterial disease, and deep-vein thrombosis must be sought before attributing causality to the PFO.",
      "Administer prescribed antiplatelet or anticoagulant therapy and monitor bleeding, blood counts, kidney function, interactions, and adherence because preventing recurrent embolism must be balanced against treatment-related hemorrhage.",
      "For catheter closure, verify informed preparation and perform postprocedure access-site, distal-perfusion, rhythm, chest-symptom, neurologic, and echocardiographic checks because closure can cause bleeding, device complications, or new atrial fibrillation.",
      "Activate stroke or emergency response for sudden facial droop, unilateral weakness, speech or vision change, syncope, acute hypoxemia, chest pain, severe dyspnea, uncontrolled access bleeding, or a cold painful limb because recurrent embolism or a procedural complication is time-critical."
    ], [
      "Sudden facial droop, unilateral weakness, speech change, or vision loss",
      "Acute hypoxemia, cyanosis, syncope, severe dyspnea, or chest pain",
      "Uncontrolled access-site bleeding, expanding hematoma, or falling blood pressure",
      "New cold painful limb, absent pulse, or confirmed deep-vein thrombosis symptoms"
    ], [
      "Explain that a PFO is common and often incidental, so closure decisions require a complete search for other stroke causes rather than assuming the opening is responsible.",
      "Teach stroke warning signs and the need to call emergency services immediately because rapid treatment matters even when prior symptoms resolved on their own."
    ]),
    card("Roseola", ["medline-roseola"], [
      "Assess age, abrupt fever height and duration, irritability, respiratory or gastrointestinal symptoms, exposure, and the timing of a blanching trunk-first rash after fever falls because that sequence supports roseola while persistent toxicity suggests another infection.",
      "Trend temperature, heart rate, breathing, activity, mental status, oral intake, tears, mucous membranes, capillary refill, and urine output because young children can develop dehydration or a febrile seizure during the high-fever phase.",
      "Provide frequent fluids, light clothing, comfort measures, and weight-appropriate prescribed antipyretic while avoiding aspirin because supportive care improves intake and comfort but aspirin can cause serious harm during viral illness.",
      "Use seizure precautions during high fever and, if a seizure occurs, protect the airway, place the child on the side, time the event, and avoid putting anything in the mouth because safe observation prevents injury and guides emergency triage.",
      "Activate emergency care for a seizure lasting five minutes or recurring, breathing difficulty, stiff neck, nonblanching rash, persistent altered responsiveness, poor perfusion, markedly reduced urine, or a child who remains very ill after fever falls because status epilepticus, meningitis, sepsis, or dehydration may be present."
    ], [
      "Seizure lasting five minutes, repeated seizure, cyanosis, or failure to recover",
      "Stiff neck, persistent confusion, bulging fontanelle, or severe lethargy",
      "Nonblanching petechiae, poor perfusion, hypotension, or rapidly progressive illness",
      "Inability to drink, absent tears, dry mouth, or markedly reduced urine output"
    ], [
      "Teach caregivers that the rash often appears as the fever resolves and usually does not mean the child suddenly worsened, provided behavior and hydration improve.",
      "Show caregivers how to time a seizure and call emergency services, because holding the child down or placing objects in the mouth can cause injury."
    ]),
    card("Squamous cell carcinoma", ["nci-cutaneous-scc", "nci-scc-definition"], [
      "Assess and confirm the anatomic primary site because the generic term squamous cell carcinoma can describe skin, mucosal, pulmonary, cervical, anal, and other cancers; this bundle addresses cutaneous cSCC, for which lesion size, depth, border, ulceration, bleeding, pain, growth rate, immune status, and regional nodes determine recurrence and metastatic risk.",
      "Prepare for biopsy or excision and document specimen site, orientation, wound status, margins, and pathology follow-up because definitive histology and margin assessment determine whether local treatment is adequate.",
      "Provide procedure-specific wound care and trend pain, erythema, drainage, bleeding, tissue viability, sensory change, and function because infection, dehiscence, nerve injury, and poor healing can delay further cancer care.",
      "During radiation or systemic immunotherapy, monitor skin reaction, fatigue, diarrhea, cough, dyspnea, endocrine symptoms, liver tests, and other ordered studies because advanced-disease treatment can trigger inflammatory toxicities in otherwise healthy organs.",
      "Escalate for uncontrolled wound bleeding, rapidly spreading infection, new facial weakness or severe neuropathic pain, airway-adjacent swelling, rapidly enlarging nodes, or immune-therapy dyspnea or severe diarrhea because hemorrhage, perineural invasion, metastasis, or organ inflammation needs urgent action."
    ], [
      "Uncontrolled lesion or postoperative bleeding with dizziness or hemodynamic change",
      "Spreading erythema, purulent drainage, fever, wound separation, or tissue necrosis",
      "New facial weakness, numbness, severe electric pain, or rapidly enlarging regional node",
      "New dyspnea, hypoxemia, severe diarrhea, jaundice, or confusion during immunotherapy"
    ], [
      "Teach monthly skin and lymph-node checks and prompt reporting of a nonhealing, scaly, crusted, painful, or bleeding lesion because early recurrence is easier to treat.",
      "Explain that this bundle is for cutaneous cSCC and verify the pathology report's anatomic primary site because mucosal or internal-organ SCC follows different staging and treatment; for skin cSCC, broad-spectrum sun protection, protective clothing, and avoiding tanning devices reduce additional ultraviolet injury."
    ]),
    card("Labyrinthitis", ["nidcd-balance"], [
      "Characterize acute continuous vertigo, nausea, imbalance, hearing loss, tinnitus, ear or viral symptoms, headache, neurologic deficits, and medication exposure because labyrinthitis affects vestibular and auditory function while stroke and ototoxicity require different treatment.",
      "For suspected labyrinthitis, perform serial neurologic, eye-movement, hearing, gait, orthostatic, hydration, and fall-risk assessments because new focal findings or inability to stand can signal central disease rather than an uncomplicated inner-ear process.",
      "Reduce environmental motion during acute labyrinthitis, assist all transfers, keep emesis and call equipment available, and use aspiration precautions because sudden vertigo and vomiting create immediate fall and airway risks.",
      "Administer prescribed antiemetic or short-course vestibular suppressant for labyrinthitis and begin vestibular rehabilitation as acute symptoms settle because prolonged suppressants can delay central compensation while graded movement promotes recovery.",
      "Escalate immediately for facial droop, limb weakness, dysarthria, severe new headache, inability to walk, sudden or rapidly worsening hearing loss, persistent vomiting with oliguria, fever with stiff neck, or altered consciousness because stroke, urgent auditory injury, dehydration, or meningitis may be present."
    ], [
      "Focal weakness, facial droop, dysarthria, diplopia, or new severe headache",
      "Inability to stand or walk, direction-changing nystagmus, or declining consciousness",
      "Sudden hearing loss, severe unilateral ear symptoms, or rapidly worsening tinnitus",
      "Persistent vomiting, oliguria, fever, stiff neck, or other meningitis findings"
    ], [
      "Teach the patient to rise slowly, use support, avoid driving and heights during active vertigo, and return to movement gradually because total inactivity delays compensation.",
      "Explain that new hearing loss or neurologic symptoms are not routine dizziness and require same-day or emergency evaluation rather than waiting for vertigo to pass."
    ]),
    card("Sinusitis", ["idsa-rhinosinusitis"], [
      "Document symptom duration, severe fever with purulent discharge, double worsening after initial improvement, unilateral dental or facial pain, allergy, immune status, and prior antibiotics because these patterns distinguish likely bacterial disease from a self-limited viral infection.",
      "Assess temperature, hydration, facial swelling, sinus tenderness, vision, eye movement, mental status, headache severity, and neck findings because orbital cellulitis, cavernous sinus involvement, and intracranial infection can begin with worsening sinonasal symptoms.",
      "Support saline irrigation with sterile, distilled, or previously boiled water, prescribed intranasal therapy, fluids, humidification, and analgesia because secretion clearance and inflammation control relieve obstruction without unnecessary antibiotic exposure.",
      "Administer antibiotics only when prescribed and reassess fever, pain, drainage, allergy, diarrhea, and response within the expected interval because nonresponse after several days may indicate resistance, another diagnosis, or a complication.",
      "Escalate immediately for painful or restricted eye movement, proptosis, reduced vision, severe frontal headache, stiff neck, focal deficit, confusion, forehead swelling, or systemic toxicity because orbital or intracranial spread requires urgent imaging and intravenous treatment."
    ], [
      "Painful eye movement, proptosis, double vision, or reduced visual acuity",
      "Severe frontal headache, stiff neck, focal deficit, seizure, or confusion",
      "Forehead or periorbital swelling with fever and rapidly worsening pain",
      "Hypotension, persistent high fever, immune compromise, or clinical deterioration on therapy"
    ], [
      "Teach that colored mucus alone does not prove bacterial infection and that antibiotics help only selected patterns, while unnecessary use causes adverse effects and resistance.",
      "Demonstrate safe saline-rinse water preparation because tap-water organisms can cause rare but severe infection when introduced directly into the sinuses."
    ]),
    card("Tinnitus", ["nidcd-tinnitus"], [
      "Characterize unilateral or bilateral location, pulsatile or constant quality, sudden onset, hearing change, vertigo, neurologic symptoms, noise exposure, jaw symptoms, sleep, distress, and medication use because the pattern identifies reversible causes and urgent vascular or auditory disease.",
      "Inspect the ear and trend hearing, blood pressure, pulse synchronization, cranial nerves, balance, and functional impact because cerumen, infection, hypertension, asymmetric hearing loss, and neurologic findings change the evaluation pathway.",
      "Review salicylates, aminoglycosides, loop diuretics, chemotherapy, stimulants, and recent dose changes with the prescriber because medication-associated tinnitus may improve after a safe supervised adjustment rather than abrupt self-discontinuation.",
      "Coordinate audiology and otolaryngology care and offer hearing support, sound enrichment, sleep strategies, and cognitive behavioral approaches because reducing auditory contrast and distress improves function even when the sound cannot be eliminated.",
      "Escalate urgently for sudden hearing loss, new unilateral pulsatile tinnitus, focal neurologic deficit, severe vertigo, head trauma, suicidal thoughts, or inability to sleep or function because time-sensitive hearing treatment, vascular investigation, stroke evaluation, or crisis care may be needed."
    ], [
      "Sudden unilateral hearing loss with new tinnitus or ear fullness",
      "Pulse-synchronous tinnitus with neurologic symptoms, severe headache, or vision change",
      "Facial weakness, dysarthria, limb deficit, severe vertigo, or acute ataxia",
      "Suicidal thinking, severe despair, or inability to sleep and maintain basic function"
    ], [
      "Teach hearing protection for hazardous noise while avoiding constant overprotection in ordinary environments because excessive silence can make tinnitus more noticeable.",
      "Explain that no supplement reliably cures tinnitus and that medication changes should be clinician-guided because some products interact with treatment or delay evaluation of a serious cause."
    ]),
    card("Tonsillitis", ["cdc-strep-throat-2025"], [
      "Assess airway, voice, drooling, swallowing, hydration, fever, tonsil size and symmetry, exudate, cervical nodes, rash, cough, viral features, and age because airway obstruction, abscess, mononucleosis, viral illness, and group A streptococcal infection require different care.",
      "Obtain rapid antigen testing and backup throat culture for eligible symptomatic children as ordered before antibiotics because examination alone cannot reliably distinguish group A strep when clear viral features are absent.",
      "Provide fluids, soft foods, salt-water gargles when age-appropriate, and prescribed analgesic or antipyretic because reducing throat pain supports hydration and prevents avoidable emergency visits for poor intake.",
      "Administer the full prescribed antibiotic for confirmed bacterial infection and monitor allergy, gastrointestinal effects, fever, urine change, joint symptoms, and adherence because eradication limits transmission and reduces suppurative and rheumatic complications.",
      "Escalate immediately for stridor, tripod positioning, inability to handle secretions, muffled voice with unilateral swelling or uvular deviation, neck stiffness or swelling, severe dehydration, hypotension, or toxic appearance because airway obstruction, peritonsillar or retropharyngeal abscess, or sepsis may be present."
    ], [
      "Stridor, drooling, tripod position, cyanosis, or inability to swallow secretions",
      "Muffled voice, trismus, unilateral bulge, uvular deviation, or severe one-sided pain",
      "Neck swelling or stiffness, limited extension, respiratory distress, or chest pain",
      "Markedly reduced urine, poor perfusion, hypotension, persistent fever, or toxic appearance"
    ], [
      "Teach hand hygiene and that confirmed strep patients should remain home until afebrile and at least twelve to twenty-four hours after appropriate antibiotics begin.",
      "Explain why leftover antibiotics should not be used for a future sore throat because most episodes are viral and incomplete or mismatched treatment can cause harm."
    ]),
    card("Epididymitis", ["cdc-epididymitis"], [
      "Determine whether pain began suddenly, examine testicular lie, swelling, tenderness, cremasteric response as appropriate, urinary symptoms, fever, sexual exposure, and recent instrumentation because testicular torsion is a surgical emergency that must be excluded before assuming epididymitis.",
      "For suspected epididymitis, collect first-void nucleic-acid testing for gonorrhea and chlamydia, urinalysis, and bacterial culture as ordered before antibiotics when feasible because organism and exposure pattern determine therapy and partner management.",
      "Administer the prescribed empiric antimicrobial regimen for epididymitis promptly and monitor allergy, gastrointestinal effects, tendon or neurologic symptoms when relevant, fever, pain, and swelling because early effective treatment limits abscess, chronic pain, infertility, and transmission.",
      "Support bed rest during severe epididymitis pain, scrotal elevation, wrapped cold packs, and prescribed anti-inflammatory analgesia and teach abstinence until the patient and partners are treated and symptoms resolve because these measures reduce inflammation and reinfection.",
      "Escalate immediately for sudden severe unilateral pain, high-riding testis, absent perfusion, fever with hemodynamic instability, crepitus or perineal skin change, abscess concern, or no improvement within seventy-two hours because torsion, infarction, Fournier gangrene, or incorrect therapy may be present."
    ], [
      "Sudden severe unilateral pain, high-riding testis, nausea, or absent testicular blood flow",
      "Fever, hypotension, confusion, or rapidly worsening systemic illness",
      "Perineal crepitus, dusky skin, bullae, severe pain, or foul drainage",
      "Persistent swelling or tenderness after treatment or no improvement within seventy-two hours"
    ], [
      "Teach completion of treatment, temporary abstinence, and partner evaluation for the prior sixty days because untreated partners can transmit infection back even when symptoms are absent.",
      "Explain that residual discomfort may improve slowly, but failure to improve within three days needs reassessment rather than simply extending leftover antibiotics."
    ]),
    card("Fluid volume deficit", ["nice-iv-fluids"], [
      "Quantify oral intake, vomiting, diarrhea, fever, bleeding, drains, diuretics, thirst, weight change, comorbid heart or kidney disease, and baseline function because the source and duration of loss determine both replacement composition and safety.",
      "Trend orthostatic and resting blood pressure, pulse, respirations, mental status, mucous membranes, capillary refill, jugular venous pressure, daily weight, intake and output, urine concentration, creatinine, urea, sodium, and lactate because hypoperfusion and electrolyte injury can progress before obvious shock.",
      "Give prescribed oral rehydration when safe or controlled isotonic crystalloid boluses for resuscitation and reassess pressure, pulse, perfusion, lungs, oxygenation, and urine output after each intervention because response confirms benefit and detects fluid overload early.",
      "Use fall precautions, assist position changes, protect skin and kidneys, and replace ongoing measured losses according to the plan because orthostasis, concentrated urine, and poor tissue perfusion cause preventable injury while the underlying loss continues.",
      "Activate urgent response for hypotension, confusion, cool mottled skin, weak rapid pulse, oliguria, rising lactate, active hemorrhage, severe sodium abnormality, or new crackles and hypoxemia during replacement because shock or unsafe overcorrection requires immediate adjustment."
    ], [
      "Hypotension, narrow pulse pressure, cool mottled skin, or altered mental status",
      "Oliguria, rapidly rising creatinine, severe thirst with neurologic change, or rising lactate",
      "Active gastrointestinal, obstetric, traumatic, or other uncontrolled hemorrhage",
      "New crackles, hypoxemia, jugular venous distention, or dyspnea during fluid replacement"
    ], [
      "Teach a written oral-rehydration and loss-replacement plan rather than relying on plain water alone because vomiting or diarrhea also removes sodium and other electrolytes.",
      "Explain which urine, dizziness, weight, intake, or ongoing-loss changes require same-day contact because early replacement is safer than waiting for collapse."
    ]),
    card("Hemorrhoids", ["ascrs-hemorrhoids-2024"], [
      "Characterize bright-red bleeding amount, pain, prolapse, itching, bowel habits, straining, anticoagulants, anemia symptoms, weight loss, and family history because rectal bleeding must not be automatically attributed to hemorrhoids when cancer or inflammatory disease is possible.",
      "Inspect the perianal area and document prolapse, thrombosis, skin breakdown, drainage, vital signs, and ordered hemoglobin because a painful blue external lesion, significant blood loss, or infection changes the urgency and treatment approach.",
      "Promote gradual fiber increase, adequate individualized fluid, physical activity, prompt unhurried defecation, and avoidance of prolonged toilet sitting because softer stool and less straining reduce venous engorgement and recurrence.",
      "Provide prescribed topical or oral analgesia, warm sitz baths, and procedure-specific wound care and monitor after banding or surgery for bleeding, urinary retention, fever, and escalating pain because rare pelvic sepsis or hemorrhage can initially seem like expected discomfort.",
      "Escalate immediately for large or persistent bleeding, syncope, hypotension, severe unremitting pain, fever with urinary retention, spreading perineal redness, purulent drainage, black stool, or unexplained anemia because major hemorrhage, thrombosis, sepsis, or another gastrointestinal source may be present."
    ], [
      "Large-volume or persistent rectal bleeding with dizziness, tachycardia, or hypotension",
      "Severe constant anal pain with a tense thrombosed lesion or tissue necrosis",
      "Fever, urinary retention, worsening pelvic pain, or systemic illness after a procedure",
      "Melena, weight loss, iron-deficiency anemia, altered bowel pattern, or abdominal mass"
    ], [
      "Teach that fiber should increase gradually with appropriate fluid because a sudden large increase can worsen bloating and constipation rather than easing stool passage.",
      "Explain that recurrent or substantial bleeding still needs evaluation even with known hemorrhoids because more proximal disease can bleed at the same time."
    ]),
    card("Hiatal hernia", ["niddk-gerd", "acg-gerd-2022", "sages-hiatal-2024", "aats-diaphragmatic-hernias"], [
      "Assess heartburn, regurgitation, dysphagia, early satiety, postmeal chest or epigastric pain, cough, nocturnal choking, anemia symptoms, vomiting, and cardiac risk because sliding hernias often cause reflux while paraesophageal hernias can obstruct or strangulate.",
      "Trend meal tolerance, weight, hydration, respiratory symptoms, stool and emesis color, hemoglobin, and response to reflux therapy because chronic mucosal injury may cause aspiration, esophagitis, ulceration, and occult blood loss.",
      "Offer smaller meals, keep the patient upright after eating, elevate the head of bed for nocturnal symptoms, and avoid tight abdominal pressure because reducing gastric distention and gravity-dependent reflux limits esophageal exposure.",
      "Administer prescribed proton-pump inhibitor or other therapy at the correct meal-related time and review adherence, ongoing indication, interactions, and patient-specific magnesium, kidney, bone, or infection concerns because correct timing improves acid control while guideline-directed long-term surveillance is individualized rather than automatic for every patient.",
      "Escalate immediately for severe persistent chest or epigastric pain, repeated retching with inability to vomit, acute dysphagia, hematemesis, melena, syncope, respiratory distress, or rigid abdomen because myocardial ischemia, gastric volvulus, strangulation, hemorrhage, or perforation may be present."
    ], [
      "Severe chest pain with diaphoresis, dyspnea, syncope, or ischemic electrocardiographic change",
      "Abrupt epigastric pain, repeated unproductive retching, or acute inability to swallow",
      "Hematemesis, coffee-ground emesis, melena, rapidly falling hemoglobin, or hypotension",
      "Respiratory distress, aspiration, rigid abdomen, fever, or peritoneal findings"
    ], [
      "Teach smaller earlier meals and remaining upright afterward because the hernia weakens the normal pressure barrier and lying down makes reflux easier.",
      "Explain that progressive food sticking, bleeding, unexplained weight loss, or persistent chest pain are alarm findings rather than routine heartburn and need prompt assessment."
    ]),
    card("Irritable bowel syndrome", ["acg-ibs"], [
      "Document abdominal pain relation to defecation, stool frequency and form, constipation or diarrhea predominance, bloating, onset, medicines, infection, diet, stress, and family history because a positive pattern directs subtype-specific care without implying symptoms are imagined.",
      "Screen for rectal bleeding, nocturnal symptoms, fever, anemia, weight loss, late onset, family cancer or inflammatory bowel disease, and abnormal examination because these alarm features require testing beyond a routine IBS pathway.",
      "Use a time-limited food and symptom diary and coordinate soluble fiber or dietitian-guided low-FODMAP trial with structured reintroduction because identifying individual triggers helps while indefinite broad restriction can cause malnutrition and food anxiety.",
      "Administer prescribed constipation-, diarrhea-, pain-, or gut-brain-directed therapy and track stool form, pain days, function, adverse effects, mood, and treatment goals because improvement is multidimensional and each subtype medication has different safety limits.",
      "Escalate for significant bleeding, persistent vomiting, severe focal or distending pain, fever, dehydration, absent stool or flatus, progressive weight loss, or new anemia because obstruction, infection, ischemia, inflammatory disease, or cancer is not explained by IBS."
    ], [
      "Rectal bleeding, melena, iron-deficiency anemia, or unexplained weight loss",
      "Persistent vomiting, abdominal distention, absent stool or flatus, or severe focal pain",
      "Fever, nocturnal diarrhea, dehydration, or rapidly worsening systemic illness",
      "New symptoms later in life or strong family history of colorectal cancer or IBD"
    ], [
      "Explain that IBS reflects altered gut movement, sensitivity, and brain-gut signaling rather than visible tissue damage, so normal tests do not mean the symptoms are unreal.",
      "Teach one change at a time with a planned review date because simultaneous permanent restrictions make triggers impossible to identify and can reduce dietary quality."
    ]),
    card("Mesothelioma", ["nci-mesothelioma"], [
      "Assess dyspnea, pleuritic or chest-wall pain, cough, fatigue, weight loss, performance status, occupational asbestos exposure, abdominal symptoms, and goals because pleural and peritoneal disease create different respiratory, nutrition, and symptom burdens.",
      "Trend oxygen saturation, respiratory rate, breath sounds, chest expansion, pain, weight, edema, abdominal girth, blood counts, kidney and liver function, and imaging response because effusion, trapped lung, progression, and treatment toxicity can change quickly.",
      "Position for ventilation, provide prescribed oxygen and multimodal analgesia, pace activity, and coordinate pulmonary rehabilitation or nutrition support because breathlessness and invasive chest-wall pain otherwise accelerate deconditioning and poor intake.",
      "Manage pleural drain or postoperative site with sterile technique and measure output, air leak, respiratory response, fever, and subcutaneous emphysema because drainage may relieve dyspnea but can cause infection, obstruction, bleeding, or pneumothorax.",
      "Escalate immediately for acute respiratory distress, rapidly increasing oxygen need, unilateral absent breath sounds, hypotension, hemoptysis, fever with drain-site infection, unilateral leg swelling, or immune-therapy organ symptoms because tension physiology, sepsis, pulmonary embolism, or treatment toxicity may be present."
    ], [
      "Acute respiratory distress, rapidly rising oxygen need, or unilateral absent breath sounds",
      "Hypotension, syncope, massive hemoptysis, or rapidly increasing bloody drain output",
      "Fever, purulent drain output, spreading chest-wall erythema, or sepsis findings",
      "Unilateral leg swelling, pleuritic pain, sudden dyspnea, or new immunotherapy toxicity"
    ], [
      "Teach the patient to report a meaningful change in breathlessness, drain output, pain, fever, or leg swelling early because complications can progress before the next oncology visit.",
      "Explain that palliative symptom care can be provided alongside cancer-directed treatment because controlling pain, breathlessness, sleep, and nutrition supports function throughout therapy."
    ]),
    card("Overflow incontinence", ["niddk-retention", "niddk-incontinence"], [
      "Assess weak stream, hesitancy, straining, incomplete emptying, frequent small voids, dribbling, suprapubic fullness, constipation, neurologic symptoms, pelvic surgery, prostate disease, and medicines because overflow results from obstruction or weak detrusor emptying rather than an overactive bladder.",
      "Measure bladder volume and postvoid residual, track intake, voided amounts, leakage, urine characteristics, creatinine, and infection findings because chronic painless retention can damage bladder muscle and kidneys before the patient feels severe discomfort.",
      "Perform prescribed intermittent or indwelling catheterization with aseptic technique and verify drainage, comfort, and patency because controlled emptying relieves pressure while poor technique introduces infection or urethral trauma.",
      "After relieving major retention, trend hourly urine output, blood pressure, weight, sodium, potassium, magnesium, and hydration because post-obstructive diuresis can cause rapid volume and electrolyte depletion.",
      "Escalate immediately for inability to urinate with severe suprapubic pain, fever with flank pain or hypotension, gross hematuria with clots, rising creatinine or anuria, saddle anesthesia, or new leg weakness because acute retention, urosepsis, obstruction, or cauda equina syndrome threatens organ function."
    ], [
      "Painful inability to urinate with a distended tender lower abdomen",
      "Fever, rigors, flank pain, hypotension, confusion, or other urosepsis findings",
      "Anuria, rapidly rising creatinine, gross hematuria with clots, or hydronephrosis",
      "Saddle anesthesia, new bilateral leg weakness, or loss of bowel control"
    ], [
      "Teach the exact clean intermittent catheter schedule and hand technique because waiting for discomfort allows silent overdistention and increases urinary infection risk.",
      "Ask the patient to review every prescription and over-the-counter product before changing it because antihistamines, decongestants, anticholinergics, and opioids can worsen retention."
    ]),
    card("Pneumoconiosis", ["cdc-pneumoconiosis"], [
      "Obtain a lifetime job and hobby history with dust type, intensity, duration, protective controls, coworkers, smoking, and symptom timeline because mineral-dust disease may appear years after exposure and the specific dust changes associated risks.",
      "Trend cough, sputum, dyspnea, resting and exertional oxygen saturation, breath sounds, pulmonary function, imaging, weight, exercise tolerance, and right-heart findings because progressive fibrosis reduces gas exchange and may cause pulmonary hypertension.",
      "Coordinate occupational-medicine referral, exposure elimination, workplace reporting or surveillance, and correctly fitted respiratory protection because treatment cannot remove established scar but stopping inhalation can limit further injury and protect coworkers.",
      "Support vaccination, smoking cessation, pulmonary rehabilitation, prescribed oxygen, airway-clearance care when secretions are present, and nutrition because preventing infection and deconditioning preserves limited respiratory reserve.",
      "Escalate immediately for severe or rapidly worsening dyspnea, new hypoxemia, hemoptysis, fever with respiratory decline, chest pain or syncope, tuberculosis symptoms, or rapidly increasing edema because acute infection, malignancy, embolism, or right-heart failure may be superimposed."
    ], [
      "Severe dyspnea, new resting hypoxemia, cyanosis, or respiratory fatigue",
      "Hemoptysis, new focal chest pain, unexplained weight loss, or suspicious imaging change",
      "Fever, night sweats, productive cough, or known tuberculosis exposure",
      "Syncope, jugular venous distention, rapidly increasing edema, or oliguria"
    ], [
      "Teach that symptoms can progress after exposure ends because retained dust continues to drive inflammation, so scheduled lung and occupational follow-up remains important.",
      "Explain that respirators supplement engineering dust controls rather than replace them, and a workplace evaluation may prevent the same irreversible disease in others."
    ]),
    card("Prostatitis", ["niddk-prostatitis"], [
      "Differentiate abrupt fever, chills, dysuria and pelvic pain from recurrent infection or chronic pelvic pain, and assess stream, retention, sexual symptoms, instrumentation, and immune status because bacterial, chronic bacterial, and nonbacterial syndromes need different treatment.",
      "Obtain urinalysis, urine culture, blood cultures when systemically ill, blood count, creatinine, and bladder scan as ordered before antibiotics when feasible because organism, sepsis, and obstruction data guide safe therapy; avoid vigorous prostate massage in acute infection.",
      "Administer prescribed antimicrobials, analgesia, antipyretic, alpha blocker, or intravenous fluid and trend fever, pressure, pain, urine output, adverse effects, and culture response because acute bacterial disease can seed the bloodstream or form an abscess.",
      "Encourage individualized fluid intake, regular bladder emptying, warmth, bowel regularity, and reduction of personally aggravating alcohol, caffeine, or spicy foods because bladder irritation and pelvic-floor tension can amplify pain and urinary symptoms.",
      "Escalate immediately for complete urinary retention, hypotension, confusion, rigors, persistent high fever, severe escalating perineal pain, fluctuance, gross hematuria, oliguria, or failure to improve because urosepsis, obstruction, prostatic abscess, or another diagnosis may be present."
    ], [
      "Complete inability to urinate with painful suprapubic distention",
      "Hypotension, confusion, rigors, oliguria, or rapidly worsening sepsis findings",
      "Persistent high fever or severe focal perineal pain despite appropriate antibiotics",
      "Gross hematuria, acute kidney injury, or suspected prostatic abscess"
    ], [
      "Teach the patient to complete the full culture-guided antibiotic course because prostate penetration and relapse risk make early discontinuation especially likely to fail.",
      "Explain that chronic pelvic pain is real but may not be bacterial, so repeated unsupervised antibiotics can cause harm while pelvic-floor and multimodal care may help."
    ]),
    card("Silicosis", ["cdc-silica"], [
      "Obtain detailed exposure to engineered stone, mining, sandblasting, construction, foundry, or abrasive dust, including intensity, controls, respirator fit, and latency because high-dose exposure can cause rapidly progressive disease in young workers.",
      "Trend cough, dyspnea, chest pain, fatigue, oxygen saturation at rest and exertion, pulmonary function, chest imaging, weight, renal findings, and autoimmune symptoms because silica exposure can injure lung, kidney, and immune systems.",
      "Arrange immediate removal from further respirable silica exposure, occupational-medicine care, public-health reporting where required, and workplace control review because silicosis is irreversible but entirely preventable and continued exposure accelerates fibrosis.",
      "Screen for tuberculosis according to risk and follow symptoms, testing, and treatment carefully because silicosis markedly increases susceptibility to active tuberculosis and other mycobacterial or fungal infection.",
      "Escalate immediately for rapidly worsening dyspnea, new hypoxemia, hemoptysis, fever or night sweats, acute weight loss, chest pain, syncope, or right-heart congestion because acute silicosis, infection, malignancy, embolism, or pulmonary hypertension may be present."
    ], [
      "Rapidly progressive dyspnea, new resting hypoxemia, or respiratory fatigue",
      "Hemoptysis, fever, night sweats, weight loss, or known tuberculosis exposure",
      "New chest pain, suspicious imaging mass, or unexplained systemic decline",
      "Syncope, jugular venous distention, edema, cyanosis, or reduced urine output"
    ], [
      "Explain that no medicine removes silica scar, making complete exposure cessation and engineering controls the most important steps for preserving remaining lung function.",
      "Teach the patient to share the exact job and material history with every clinician because silicosis and tuberculosis may otherwise be mistaken for more common lung disease."
    ]),
    card("Stress incontinence", ["niddk-incontinence"], [
      "Use a bladder diary to link leakage with cough, laugh, lift, exercise, volume, urgency, childbirth, pelvic surgery, constipation, and medicines because pressure-triggered leakage must be distinguished from urgency, retention, fistula, and functional causes.",
      "Assess skin, pelvic-floor contraction, cough, mobility, urinalysis, and postvoid residual when indicated because infection, pelvic support loss, incomplete emptying, and incorrect muscle recruitment can undermine treatment.",
      "Teach correctly isolated pelvic-floor contractions with full relaxation and refer for pelvic-floor physical therapy or biofeedback because supervised technique strengthens urethral support while straining the abdomen can worsen leakage.",
      "Address chronic cough, smoking, constipation, weight, lifting technique, and timed access to a toilet and monitor pessary or device fit and vaginal tissue because reducing repeated abdominal pressure and friction prevents leaks and skin injury.",
      "Escalate for gross hematuria, painful inability to void, fever with urinary symptoms, a new pelvic mass or prolapse with obstruction, continuous leakage after surgery, or new saddle anesthesia because cancer, retention, infection, fistula, or neurologic disease may be present."
    ], [
      "Gross hematuria, clots, unexplained pelvic pain, or a new pelvic mass",
      "Painful inability to urinate, severe distention, or rapidly rising postvoid residual",
      "Fever, flank pain, hypotension, or recurrent complicated urinary infection",
      "Continuous leakage after pelvic surgery, saddle anesthesia, or new leg weakness"
    ], [
      "Teach that pelvic-floor exercises are practiced with an empty bladder rather than by repeatedly stopping urine flow because interrupted voiding can promote incomplete emptying.",
      "Explain that pads protect clothing but do not treat weakened support, so skin care should accompany a structured pelvic-floor and contributing-factor plan."
    ]),
    card("Urge incontinence", ["niddk-incontinence"], [
      "Record urgency, frequency, nocturia, leakage volume, fluid timing, caffeine or alcohol, constipation, medicines, dysuria, neurologic symptoms, and mobility because overactive bladder is diagnosed only after infection, retention, metabolic, and functional causes are considered.",
      "Trend bladder diary, urinalysis, glucose, skin condition, falls, sleep, and postvoid residual when risk factors or treatment warrant because urgency can coexist with infection or incomplete emptying and night rushing increases injury.",
      "Implement scheduled voiding with gradual interval extension, urge suppression using stillness, slow breathing and quick pelvic-floor contractions, and accessible toileting because retraining interrupts premature detrusor signaling without dehydration.",
      "Administer prescribed antimuscarinic or beta-3 agonist therapy and monitor constipation, dry mouth, cognition, blood pressure, pulse, and retention because relaxing bladder activity can create important systemic or emptying adverse effects.",
      "Escalate for fever with flank pain, gross hematuria, painful inability to void, rapidly increasing residual, new focal neurologic deficit, severe hypertension on therapy, or falls with injury because infection, obstruction, neurologic disease, or medication toxicity may be present."
    ], [
      "Fever, rigors, flank pain, hypotension, or other upper urinary infection findings",
      "Gross hematuria, clots, unexplained pelvic pain, or significant weight loss",
      "Painful urinary retention, distended bladder, or rapidly increasing postvoid residual",
      "New weakness, saddle anesthesia, acute confusion, severe hypertension, or injurious fall"
    ], [
      "Teach that severe fluid restriction concentrates urine and can worsen irritation, constipation, and dehydration, so timing and bladder irritants matter more than simply drinking less.",
      "Use a written bladder diary to show change over weeks because gradual improvement is easier to recognize than relying on memory of isolated accidents."
    ]),
    card("Vocal cord dysfunction", ["ats-vcd"], [
      "Assess and characterize sudden inspiratory difficulty, throat tightness, voice change, stridor location, exercise or irritant trigger, oxygen saturation, asthma history, and bronchodilator response because inducible laryngeal obstruction mimics asthma but closes at the vocal cords during inspiration.",
      "During a vocal cord dysfunction episode, remain calm, sit the patient upright, coach relaxed diaphragmatic breathing with quick nasal inhalation and prolonged pursed-lip exhalation, and reduce triggers because panic and forceful gasping tighten the larynx further.",
      "Trend respiratory rate, work, voice, stridor, lung sounds, peak flow when appropriate, oxygen saturation, and response to breathing techniques because normal oxygenation with upper-airway noise supports VCD while lower-airway obstruction or hypoxemia needs other treatment.",
      "Coordinate laryngoscopy during vocal cord dysfunction symptoms, speech-language breathing retraining, and management of reflux, postnasal drainage, irritants, exercise, or stress because treating triggers and practicing rescue skills prevents recurrent emergency presentations.",
      "Activate emergency airway evaluation for falling oxygen saturation, cyanosis, silent or severely diminished breath sounds, facial swelling, hives, hypotension, choking history, inability to speak, or failure to improve with the established plan because asthma, anaphylaxis, foreign body, or fixed obstruction may be present."
    ], [
      "Falling oxygen saturation, cyanosis, exhaustion, or inability to speak",
      "Silent chest, severe expiratory wheeze, or poor airflow despite prescribed asthma rescue",
      "Facial or tongue swelling, hives, hypotension, or rapidly progressive anaphylaxis",
      "Choking event, drooling, unilateral breath sounds, or failure of usual VCD techniques"
    ], [
      "Practice the speech therapist's rescue breathing when well because a rehearsed motor pattern is easier to use before fear and laryngeal tightening peak.",
      "Explain that VCD is a real airway-control disorder, but asthma medicines should continue only as prescribed because both conditions can occur in the same person."
    ]),
    card("Acromegaly", ["endocrine-acromegaly"], [
      "Assess progressive hand, foot, jaw or facial change, headache, visual field loss, joint pain, sweating, weakness, sleep apnea, menstrual or sexual change, and medication history because chronic GH and IGF-1 excess affects pituitary, metabolic, respiratory, cardiac, and skeletal systems.",
      "Trend IGF-1 and GH testing as ordered, blood pressure, glucose, cardiac symptoms, sleep quality, visual fields, colon screening, thyroid findings, and pituitary imaging because biochemical control and comorbidity surveillance both determine long-term morbidity.",
      "After transsphenoidal surgery, perform neurologic and visual checks and monitor urine output, thirst, sodium, cortisol-related hypotension, nasal drainage, and fever because diabetes insipidus, adrenal insufficiency, cerebrospinal-fluid leak, bleeding, and infection can occur early.",
      "Administer prescribed somatostatin analogue, GH-receptor antagonist, or dopamine agonist and monitor glucose, gallbladder, liver, gastrointestinal, cardiac, and injection-site effects because each therapy suppresses a different part of the GH pathway and has distinct toxicity.",
      "Escalate immediately for sudden severe headache, acute visual loss, ophthalmoplegia, altered consciousness, clear nasal drainage, polyuria with rising sodium, severe hypotension, chest pain, or respiratory compromise because pituitary apoplexy or postoperative endocrine and neurologic emergencies may be present."
    ], [
      "Sudden severe headache, visual loss, ophthalmoplegia, or declining consciousness",
      "Clear unilateral nasal drainage, meningismus, fever, or postoperative neurologic change",
      "Marked polyuria and thirst with rising sodium or severe hyponatremic confusion",
      "Severe hypotension, chest pain, dysrhythmia, or worsening sleep-related respiratory failure"
    ], [
      "Explain that facial or hand changes improve slowly even after GH control, so scheduled IGF-1 testing is a better early measure than appearance alone.",
      "Teach ongoing blood pressure, glucose, sleep, heart, thyroid, vision, and colon follow-up because successful pituitary treatment does not instantly erase established comorbidity risk."
    ]),
    card("Amyloidosis", ["ash-amyloidosis-2026", "acc-cardiac-amyloidosis-2023", "ash-al-management-2020", "aa-amyloidosis-2024"], [
      "Confirm amyloid protein typing and record whether the process is AL from a clonal immunoglobulin light chain, ATTR from variant or wild-type transthyretin, AA from persistent serum amyloid A during inflammation, or another subtype while assessing multisystem involvement because similar heart, kidney, nerve, liver, gastrointestinal, and soft-tissue findings do not make treatments interchangeable.",
      "Trend supine and standing blood pressure, heart rate and rhythm, daily weight, edema, oxygenation, urine protein and output, creatinine, liver tests, and cardiac biomarkers; for AL evaluation specifically, interpret serum free light chains with serum and urine immunofixation and follow hematologic response as ordered because free-light-chain response measures the plasma-cell light-chain process and is not an ATTR or AA activity marker.",
      "Use cautious individualized fluid, diuretic, fall, skin, and compression measures and reassess perfusion after changes because restrictive cardiac filling and autonomic neuropathy make patients sensitive to both congestion and volume depletion.",
      "Administer subtype-directed therapy that reduces production or stabilizes the amyloid-forming precursor or controls its source—plasma-cell or other B-cell clone treatment for AL, transthyretin stabilizing or silencing therapy for ATTR, and aggressive control of the inflammatory driver for AA—and monitor treatment-specific blood, infection, neurologic, thrombotic, metabolic, renal, hepatic, infusion, and cardiac effects because lowering new precursor supply slows further deposition but can stress fragile organs.",
      "Escalate immediately for syncope, sustained dysrhythmia, chest pain, rapidly worsening dyspnea or edema, severe orthostatic hypotension, oliguria, major bleeding, acute focal deficit, or unilateral swelling because sudden cardiac death, organ failure, hemorrhage, stroke, or thrombosis can occur."
    ], [
      "Syncope, sustained dysrhythmia, chest pain, or rapidly worsening heart failure",
      "Severe orthostatic hypotension with falls, confusion, cool skin, or oliguria",
      "Major bleeding, rapidly expanding bruising, hematemesis, melena, or neurologic deficit",
      "Nephrotic edema with unilateral leg swelling, acute dyspnea, or rapidly declining kidney function"
    ], [
      "Teach the patient to carry the exact amyloid subtype because AL, ATTR, AA, and other forms require different disease-directed treatments.",
      "Explain daily weight, blood pressure, swelling, urine, rhythm, and neuropathy tracking because small changes can reveal organ deterioration before a routine visit."
    ]),
    card("Ankylosing spondylitis", ["acr-axspa-2026"], [
      "Assess inflammatory back pain, morning stiffness, night waking, spinal and chest expansion, posture, hip function, fatigue, work limits, eye symptoms, bowel symptoms, and psoriasis because axial inflammation often has important extra-articular manifestations.",
      "Measure pain, disease activity, mobility, posture, breathing expansion, neurologic function, and treatment response with consistent tools because progressive stiffness and functional loss may continue even when a single pain score improves.",
      "Coordinate daily posture, spinal-mobility, chest-expansion, strengthening, and safe aerobic exercise with physical therapy because movement preserves extension and ventilation while prolonged rest reinforces flexion and stiffness.",
      "Administer prescribed anti-inflammatory or biologic therapy and monitor gastrointestinal or renal effects, blood counts, liver tests, tuberculosis and hepatitis screening, infection, and vaccination status because immune control improves function but can cause serious toxicity or infection.",
      "Escalate immediately for a painful red photophobic eye, new weakness or numbness after even minor trauma, bowel or bladder loss, saddle anesthesia, fever on immunosuppression, or severe chest pain and dyspnea because uveitis, unstable spinal fracture, cauda equina syndrome, infection, or cardiopulmonary disease may be present."
    ], [
      "Painful red eye with photophobia, blurred vision, or sudden visual change",
      "New neck or back pain after minor trauma with weakness, numbness, or deformity",
      "Saddle anesthesia, urinary retention, incontinence, or progressive leg weakness",
      "High fever on biologic therapy, severe chest pain, syncope, or acute dyspnea"
    ], [
      "Teach daily extension and breathing exercises with individualized technique because consistent movement protects posture and chest expansion more effectively than occasional intense exercise.",
      "Explain that a fused osteoporotic spine can fracture after seemingly minor trauma, so new focal spinal pain needs urgent assessment and forceful manipulation should be avoided."
    ]),
    card("Bladder cancer", ["nci-bladder"], [
      "Quantify visible or microscopic hematuria, clots, dysuria, frequency, flank or pelvic pain, retention, weight loss, smoking, occupational exposures, and anticoagulants because painless bleeding is common but obstruction and invasive symptoms change urgency.",
      "Trend vital signs, urine color and output, clots, bladder scan, pain, hemoglobin, creatinine, infection studies, and pathology or imaging follow-up because bleeding, retention, hydronephrosis, and kidney injury can develop during diagnosis or treatment.",
      "After transurethral resection or intravesical therapy, maintain prescribed catheter and irrigation patency, use exposure precautions, and monitor fever, bleeding, spasms, and urinary flow because clots, perforation, infection, and systemic treatment reactions require rapid recognition.",
      "After cystectomy, assess stoma color, edema, output, peristomal skin, drains, bowel function, hydration, electrolytes, and diversion teaching because ischemia, leak, obstruction, infection, and metabolic changes can threaten a new urinary diversion.",
      "Escalate immediately for inability to void, obstructed irrigation with painful distention, large clots or heavy bleeding, falling pressure, anuria, flank pain with fever, dusky stoma, peritoneal signs, or systemic illness after BCG because hemorrhage, obstruction, sepsis, leak, or disseminated infection may be present."
    ], [
      "Heavy hematuria, large clots, syncope, tachycardia, or falling blood pressure",
      "Painful distended bladder with absent drainage or obstructed continuous irrigation",
      "Fever, rigors, hypotension, flank pain, or systemic illness after intravesical BCG",
      "Dusky or black stoma, anuria, peritoneal pain, urinary leak, or rapidly rising creatinine"
    ], [
      "Teach that any recurrent visible blood, even without pain, needs prompt evaluation because bladder tumors often recur and early disease may be otherwise silent.",
      "For a urinary diversion, use return demonstration of pouch emptying, skin care, hydration, and obstruction signs because reliable daily technique prevents leakage and kidney complications."
    ]),
    card("Carpal tunnel syndrome", ["aaos-carpal-tunnel-2024"], [
      "Assess nocturnal numbness or tingling in the thumb, index, middle and radial ring finger, dropping objects, grip weakness, thenar bulk, neck symptoms, diabetes, pregnancy, and repetitive loading because median-nerve compression must be distinguished from cervical or generalized neuropathy.",
      "Trend sensation, two-point discrimination when used, thumb opposition, grip and pinch function, pain, sleep disruption, work tasks, and response to splinting because progressive motor loss indicates more advanced nerve injury than intermittent paresthesia.",
      "Fit and teach a neutral-position night wrist splint and modify sustained flexion, extension, vibration, and forceful grip because reducing tunnel pressure during sleep and work can relieve reversible compression.",
      "Prepare for prescribed injection or decompression and monitor afterward for wound infection, bleeding, pain, perfusion, sensation, motor function, and safe activity because treatment can injure nerve or vessel even while relieving pressure.",
      "Escalate for rapidly progressive weakness, new thenar wasting, constant sensory loss, severe pain after injury, cool pale hand, expanding postoperative swelling, fever, purulent drainage, or sudden loss of thumb function because advanced compression, vascular injury, hematoma, or infection needs prompt specialist review."
    ], [
      "Rapidly progressive thumb weakness, thenar wasting, or constant dense numbness",
      "Cool pale hand, absent pulse, delayed capillary refill, or severe swelling",
      "Expanding postoperative hematoma with worsening pain or neurologic loss",
      "Fever, spreading erythema, purulent drainage, or wound separation after release"
    ], [
      "Teach neutral rather than tightly flexed wrist positioning and check splint fit because excessive pressure can create skin or nerve injury while trying to relieve symptoms.",
      "Explain that persistent weakness or muscle wasting needs timely reassessment because prolonged median-nerve compression may become less reversible even if pain is tolerable."
    ]),
    card("Celiac disease", ["acg-celiac"], [
      "Assess diarrhea or constipation, bloating, weight and growth, fatigue, rash, mouth ulcers, fertility or neurologic symptoms, family history, autoimmune disease, and current gluten intake because celiac disease can present outside the intestine and testing becomes less reliable after gluten withdrawal.",
      "Obtain ordered serology and coordinate endoscopic confirmation while the patient is still consuming gluten unless a specialist directs otherwise because premature dietary restriction can normalize antibodies and mucosa before diagnosis is established.",
      "Refer to a celiac-experienced dietitian and review wheat, barley, rye, oats labeling, medicines, supplements, shared cookware, and cross-contact because tiny repeated exposures can sustain immune injury even without immediate symptoms.",
      "Trend symptoms, weight or growth, celiac serology, complete blood count, iron, folate, B12, vitamin D, calcium, liver tests, and bone health because mucosal healing and correction of malabsorption require objective follow-up.",
      "Escalate for severe dehydration, gastrointestinal bleeding, persistent vomiting, marked distention with absent stool, progressive weight loss despite adherence, severe anemia, or fever with focal pain because crisis, obstruction, ulceration, infection, refractory disease, or malignancy may be present."
    ], [
      "Severe dehydration, syncope, oliguria, or major electrolyte abnormality",
      "Hematemesis, melena, significant rectal bleeding, or rapidly falling hemoglobin",
      "Persistent vomiting, marked distention, absent stool or flatus, or severe focal pain",
      "Progressive weight loss, severe anemia, fever, or persistent symptoms despite verified adherence"
    ], [
      "Explain that a strict gluten-free diet treats an autoimmune reaction rather than a simple intolerance, so an exposure can injure intestine even without obvious symptoms.",
      "Teach label reading and cross-contact prevention with a dietitian because replacing gluten safely also requires adequate fiber, iron, folate, calcium, and vitamin D."
    ]),
    card("Esophageal cancer", ["nci-esophageal"], [
      "Assess progressive solid then liquid dysphagia, odynophagia, regurgitation, aspiration, cough, voice change, bleeding, pain, weight loss, hydration, performance status, tobacco, alcohol, and reflux history because obstruction and malnutrition commonly advance before diagnosis.",
      "Screen swallowing safety and trend intake, weight, muscle loss, hydration, lung sounds, oxygenation, hemoglobin, electrolytes, and treatment response because aspiration, bleeding, and nutritional decline directly affect treatment tolerance.",
      "Position upright for intake, use the prescribed texture and small bites, provide meticulous oral care, and coordinate dietitian, speech-language, enteral access, or stent care because a safe nutrition route prevents aspiration and severe catabolism.",
      "During chemoradiation or surgery, monitor blood counts, infection, mucositis, nausea, kidney function, respiratory status, drains, wound, and pain because multimodality therapy can cause marrow suppression, dehydration, pneumonia, and tissue injury.",
      "Escalate immediately for inability to swallow secretions, acute food obstruction, respiratory distress, hematemesis or melena, severe chest pain, fever, tachycardia, subcutaneous air, or new drain fluid after surgery because airway compromise, hemorrhage, perforation, or anastomotic leak may be present."
    ], [
      "Inability to swallow saliva, drooling, acute food impaction, or airway distress",
      "Hematemesis, melena, syncope, rapidly falling hemoglobin, or hypotension",
      "Severe chest pain, crepitus, fever, tachycardia, or rigid upper abdomen",
      "New turbid or enteric drain output, worsening hypoxemia, or postoperative sepsis"
    ], [
      "Teach the exact safe texture, bite size, upright time, and tube or stent plan because forcing food through narrowing increases aspiration and impaction risk.",
      "Explain that nutrition support is part of cancer treatment rather than a sign of failure because preserving weight and muscle improves strength for therapy and recovery."
    ]),
    card("First-degree AV block", ["acc-bradycardia-2018"], [
      "Confirm a prolonged PR interval with every P wave conducted and assess dizziness, fatigue, exertional intolerance, syncope, chest pain, sleep apnea, infection, ischemia, and prior tracing because most first-degree block is benign but marked or new delay may reflect disease.",
      "Trend heart rate, rhythm, PR interval, blood pressure, perfusion, symptoms, electrolytes, thyroid studies, and medication timing because progression or a reversible metabolic or drug cause may be detected before hemodynamic compromise.",
      "Review beta blockers, nondihydropyridine calcium-channel blockers, digoxin, antiarrhythmics, and other conduction-slowing agents with the prescriber because additive AV-nodal suppression can worsen delay, especially with kidney dysfunction or toxicity.",
      "Correlate symptoms with telemetry or ambulatory monitoring and prepare for echocardiographic or specialist evaluation when ordered because symptoms alone do not prove the conduction delay is causal and structural disease changes risk.",
      "Escalate for syncope, hypotension, ischemic chest pain, acute heart failure, new dropped QRS complexes, Mobitz II pattern, complete dissociation, severe bradycardia, or declining mental status because progression to unstable high-grade block requires urgent pacing-capable care."
    ], [
      "Syncope, hypotension, confusion, cool skin, or other low-output findings",
      "New dropped beats, Mobitz II pattern, complete heart block, or wide-complex escape rhythm",
      "Ischemic chest pain, dynamic electrocardiographic change, or acute pulmonary edema",
      "Severe bradycardia with weakness, dyspnea, oliguria, or rapidly worsening symptoms"
    ], [
      "Explain that first-degree block means delayed rather than missing conduction, but new fainting or exercise intolerance still requires rhythm reassessment.",
      "Teach the patient not to stop a heart medicine independently and to bring an accurate medication list because safe dose adjustment depends on the rhythm and indication."
    ]),
    card("Galactosemia", ["medline-galactosemia"], [
      "Treat a positive newborn screen with poor feeding, vomiting, jaundice, lethargy, bleeding, or failure to thrive as urgent and verify confirmatory enzyme or genetic testing because classic GALT deficiency can cause liver failure and E. coli sepsis within days.",
      "Stop breast milk and standard lactose-containing formula and begin the specialist-approved galactose-restricted formula immediately when classic disease is suspected because continued galactose exposure generates toxic metabolites before confirmation returns.",
      "Trend glucose, bilirubin, liver enzymes, coagulation, electrolytes, urine output, weight, feeding tolerance, blood cultures, and infection signs because hypoglycemia, hepatic failure, bleeding, kidney injury, and sepsis can evolve rapidly.",
      "Coordinate metabolic dietitian and genetic care and monitor growth, speech, learning, motor function, cataracts, bone health, and ovarian function because dietary treatment prevents neonatal catastrophe but does not eliminate every long-term complication.",
      "Activate emergency response for fever or hypothermia, poor perfusion, lethargy, seizure, hypoglycemia, worsening jaundice, active bleeding, persistent vomiting, anuria, or respiratory distress because sepsis, shock, liver failure, or metabolic decompensation is life-threatening."
    ], [
      "Fever or hypothermia with lethargy, poor perfusion, hypotension, or respiratory distress",
      "Hypoglycemia, seizure, persistent vomiting, or inability to maintain feeding",
      "Rapidly worsening jaundice, hepatomegaly, prolonged coagulation, or active bleeding",
      "Anuria, acute kidney injury, severe electrolyte abnormality, or progressive shock"
    ], [
      "Teach that lactose and galactose sources include medicines and processed ingredients, so every formula, food, supplement, and drug should be checked with the metabolic team.",
      "Explain autosomal-recessive inheritance and offer genetic counseling because future pregnancy testing and sibling evaluation depend on the family's exact enzyme or gene result."
    ]),
    card("Gastritis", ["niddk-gastritis"], [
      "Assess epigastric pain, early satiety, nausea, vomiting, appetite, alcohol, NSAIDs, steroids, anticoagulants, critical illness, prior H. pylori treatment, stool color, and anemia symptoms because inflammation, reactive injury, infection, and stress-related erosions require different treatment.",
      "Trend vital signs, orthostasis, abdominal findings, emesis and stool appearance, hemoglobin, urea, creatinine, iron status, and H. pylori test plan because occult or overt upper gastrointestinal bleeding may be the first serious complication.",
      "Administer prescribed acid suppression, mucosal protection, or H. pylori eradication and monitor allergy, diarrhea, interactions, adherence, and test-of-cure timing because symptom relief alone does not confirm bacterial eradication or mucosal healing.",
      "Review nonsteroidal anti-inflammatory drugs, aspirin, alcohol, tobacco, and other irritants with the prescriber and provide tolerable nutrition and hydration because removing the cause prevents recurrent injury more effectively than indefinite symptom masking.",
      "Escalate immediately for hematemesis, coffee-ground emesis, melena, syncope, hypotension, rapidly falling hemoglobin, rigid abdomen, severe sudden pain, persistent vomiting, or fever with toxicity because major hemorrhage, perforation, obstruction, or severe infection may be present."
    ], [
      "Hematemesis, coffee-ground emesis, melena, or maroon stool",
      "Syncope, orthostatic collapse, tachycardia, hypotension, or rapidly falling hemoglobin",
      "Sudden severe abdominal pain, guarding, rigidity, fever, or free-air concern",
      "Persistent vomiting, inability to hydrate, progressive weight loss, or severe anemia"
    ], [
      "Teach the full H. pylori regimen and the scheduled test of cure because pain improvement can occur even when bacteria remain and continue injuring the stomach.",
      "Explain that over-the-counter NSAIDs and aspirin can still cause bleeding, so safer pain options should be discussed rather than adding acid medicine independently."
    ]),
    card("GERD", ["niddk-gerd", "acg-gerd-2022"], [
      "Characterize heartburn, regurgitation, relation to meals and position, nocturnal cough, hoarseness, asthma symptoms, chest pain, dysphagia, odynophagia, bleeding, and weight change because alarm or extraesophageal features require more than routine empiric treatment.",
      "First evaluate new or concerning chest pain for cardiac features and trend swallowing, weight, blood counts, respiratory symptoms, dental erosion, and response because myocardial ischemia, aspiration, stricture, Barrett change, and cancer can mimic or complicate reflux.",
      "Support weight management when relevant, smaller meals, avoiding food near bedtime, tobacco cessation, and head-of-bed elevation for nocturnal symptoms because reducing abdominal pressure and recumbent exposure decreases reflux events.",
      "Administer prescribed proton-pump inhibitor thirty to sixty minutes before the indicated meal and review adherence, ongoing indication, interactions, and patient-specific risk factors rather than assuming every long-term user needs routine magnesium, creatinine, vitamin B12, or bone testing because timing maximizes acid control and guideline-directed surveillance is individualized.",
      "Escalate immediately for persistent pressure with diaphoresis or dyspnea, food impaction, inability to swallow secretions, hematemesis or melena, progressive dysphagia, severe anemia, recurrent aspiration, or unexplained weight loss because acute coronary syndrome, obstruction, hemorrhage, or malignancy may be present."
    ], [
      "Persistent chest pressure with diaphoresis, dyspnea, syncope, or ischemic changes",
      "Food impaction, drooling, inability to swallow secretions, or acute respiratory distress",
      "Hematemesis, melena, rapidly falling hemoglobin, hypotension, or severe anemia",
      "Progressive dysphagia, odynophagia, recurrent aspiration, or unexplained weight loss"
    ], [
      "Teach that head elevation uses a wedge or bed risers rather than extra pillows alone because bending at the waist can increase abdominal pressure and reflux.",
      "Explain that the best trigger plan is individualized from a symptom diary because universally banning many foods can reduce nutrition without improving reflux."
    ]),
    card("Gigantism", ["endocrine-xlag-2024", "endotext-pituitary-gigantism", "endocrine-acromegaly"], [
      "Plot serial height and growth velocity and assess pubertal stage, shoe or ring change, facial features, headache, vision, sweating, joint pain, sleep, school, and family growth pattern because excessive GH before growth-plate closure causes abnormal linear growth with multisystem effects.",
      "Trend IGF-1 and GH studies as ordered, visual fields, pituitary imaging, blood pressure, glucose, cardiac status, sleep-disordered breathing, thyroid and pubertal hormones because tumor burden, hormone excess, and comorbidities all require independent monitoring.",
      "After pituitary surgery, monitor neurologic and visual status, urine output, thirst, sodium, cortisol-related pressure and glucose, nasal drainage, and fever because diabetes insipidus, adrenal insufficiency, cerebrospinal-fluid leak, and infection can develop quickly.",
      "Administer prescribed hormone-directed therapy and coordinate pediatric endocrine, neurosurgical, genetic, orthopedic, sleep, cardiac, educational, and psychosocial care because treatment must control growth while protecting development and identity.",
      "Escalate immediately for sudden severe headache, acute visual loss, ophthalmoplegia, altered consciousness, clear nasal drainage, marked polyuria with rising sodium, severe hypotension, chest pain, or respiratory compromise because pituitary apoplexy and postoperative endocrine emergencies are time-critical."
    ], [
      "Sudden severe headache, visual loss, ophthalmoplegia, or declining consciousness",
      "Clear nasal drainage, fever, meningismus, or postoperative neurologic change",
      "Marked polyuria and thirst with rising sodium or severe hyponatremic symptoms",
      "Severe hypotension, dysrhythmia, chest pain, or worsening sleep-related respiratory failure"
    ], [
      "Explain that extraordinary height is a medical effect of hormone excess rather than the child's fault, and include the child directly in age-appropriate decisions.",
      "Teach families to track growth, headaches, vision, thirst, urine, sleep, and school function because these changes can reveal recurrence or treatment complications early."
    ]),
    card("Goodpasture syndrome", ["kdigo-glomerular-2021"], [
      "Assess hemoptysis amount, cough, dyspnea, oxygenation, fatigue, pallor, edema, blood pressure, urine color and output, recent respiratory exposure, and offending drugs because anti-GBM disease can destroy alveolar and glomerular capillaries simultaneously.",
      "Trend respiratory rate, oxygen saturation, lung sounds, chest imaging, hemoglobin, creatinine, potassium, acid-base status, urinalysis, urine output, weight, and anti-GBM titers because pulmonary hemorrhage and rapidly progressive kidney failure can evolve over hours.",
      "Prepare for immediate plasma exchange and administer prescribed glucocorticoid and cyclophosphamide without avoidable delay while monitoring access, blood counts, infection, glucose, bleeding, and fertility concerns because removing antibodies and stopping production preserves remaining lung and kidney tissue.",
      "Provide oxygen and airway support, measure hemoptysis, maintain careful fluid balance, avoid nephrotoxins, and prepare for dialysis when indicated because anemia, hyperkalemia, acidosis, and volume overload can compound respiratory failure.",
      "Activate critical care for increasing hemoptysis, rapidly rising oxygen need, respiratory fatigue, severe hyperkalemia or electrocardiographic change, anuria, pulmonary edema, severe hypertension, hypotension, or altered consciousness because diffuse alveolar hemorrhage and kidney failure are immediately life-threatening."
    ], [
      "Increasing hemoptysis, falling hemoglobin, or rapidly rising oxygen requirement",
      "Respiratory fatigue, severe hypoxemia, diffuse infiltrates, or airway compromise",
      "Anuria, severe hyperkalemia, metabolic acidosis, or rapidly rising creatinine",
      "Pulmonary edema, severe hypertension, hypotension, seizure, or altered consciousness"
    ], [
      "Explain that treatment often begins before every result returns because each delay allows antibodies to destroy additional filtering and gas-exchange membrane.",
      "Teach infection precautions and the exact fever-call plan during immunosuppression because treatment suppresses the immune cells needed to control serious infection."
    ]),
    card("Granulomatosis with polyangiitis", ["acr-vf-aav-2021"], [
      "Assess chronic sinus or ear symptoms, epistaxis, oral ulcers, hoarseness, cough, hemoptysis, dyspnea, eye pain, rash, neuropathy, edema, blood pressure, urine change, and constitutional symptoms because GPA can inflame vessels across airway, lung, kidney, eye, skin, and nerves.",
      "Trend oxygenation, airway sounds, hearing and vision, neurologic findings, urinalysis, urine output, creatinine, blood count, inflammatory markers, liver tests, and imaging because pulmonary hemorrhage and glomerulonephritis may progress with little early pain.",
      "Administer prescribed rituximab, cyclophosphamide, glucocorticoid, or maintenance therapy and monitor infusion reaction, cytopenia, infection, hepatitis or tuberculosis risk, glucose, bone, bladder, and reproductive toxicity because remission requires potent but hazardous immunosuppression.",
      "Provide gentle nasal saline and oral care, protect insensate limbs and skin, support pulmonary and renal function, and coordinate vaccination and infection prophylaxis because damaged mucosa and suppressed immunity increase bleeding, wound, and opportunistic infection risks.",
      "Escalate immediately for hemoptysis with falling oxygen or hemoglobin, rapidly rising creatinine or oliguria, stridor, acute visual change, mononeuritis with new weakness, severe abdominal pain, or fever with hypotension because alveolar hemorrhage, renal crisis, airway stenosis, organ ischemia, or sepsis may be present."
    ], [
      "Hemoptysis, falling hemoglobin, diffuse infiltrates, or rapidly worsening hypoxemia",
      "Rapid creatinine rise, active urine sediment, oliguria, edema, or severe hypertension",
      "Stridor, progressive hoarseness, acute eye pain, proptosis, or visual loss",
      "New focal weakness, severe abdominal pain, fever, hypotension, or sepsis findings"
    ], [
      "Teach the patient to report changes across nose, ears, eyes, lungs, urine, skin, and nerves because a relapse may begin in a different organ than the original illness.",
      "Explain that fever during immunosuppression may be infection rather than vasculitis, so the clinical team should evaluate it before the patient changes steroid dosing."
    ]),
    card("Heart blocks", ["acc-bradycardia-2018", "aha-bradycardia-2025"], [
      "Identify first-degree, Mobitz I, Mobitz II, high-grade, or third-degree (complete) AV block on electrocardiography and assess syncope, chest pain, dyspnea, weakness, perfusion, ischemia, infection, and baseline conduction because block level and symptoms determine instability and pacing need.",
      "Place symptomatic or high-risk patients on continuous telemetry, obtain vital signs and twelve-lead tracing, establish intravenous access, apply pacing pads, and trend mental status, urine output, electrolytes, and troponin because deterioration can be abrupt and escape rhythms unreliable.",
      "Review beta blockers, calcium-channel blockers, digoxin, antiarrhythmics, ischemia, thyroid disease, potassium, Lyme exposure, and recent cardiac procedures with the team because correcting a reversible cause may restore conduction and prevents repeated block.",
      "Obtain urgent pacing-capable cardiology evaluation for new acquired Mobitz II, high-grade, or third-degree (complete) atrioventricular block even when currently stable, and prepare prescribed transcutaneous or transvenous pacing while monitoring capture, perfusion, pain, sedation, and skin because these blocks can deteriorate and electrical rate is useful only when each paced beat circulates blood.",
      "Activate emergency response for hypotension, acutely altered consciousness, shock, ischemic chest pain, acute pulmonary edema, recurrent syncope, severe bradycardia with poor perfusion, impending arrest, or loss of pacemaker capture because instability or ineffective pacing—not a stable block label alone—requires immediate resuscitation."
    ], [
      "Mobitz II, high-grade, or third-degree (complete) AV block with a slow escape rhythm",
      "Hypotension, altered consciousness, cool mottled skin, or rapidly falling urine output",
      "Ischemic chest pain, dynamic ST change, ventricular dysrhythmia, or pulmonary edema",
      "Recurrent syncope, asystolic pause, loss of pacing capture, or impending cardiac arrest"
    ], [
      "Teach patients with a pacemaker how to check the incision and pulse, carry device identification, and report fainting or persistent hiccups because these can signal infection or malfunction.",
      "Explain that some blocks are medication- or illness-related while others reflect conduction-system damage, so follow-up depends on the exact electrocardiographic type rather than pulse alone."
    ]),
    card("Hydronephrosis", ["niddk-hydronephrosis-newborns", "niddk-retention", "cirse-nephrostomy-stent", "obstructive-uropathy-2023"], [
      "Assess flank or abdominal pain, fever, nausea, urine amount and stream, hematuria, stones, pregnancy, pelvic or prostate disease, catheter history, and prior imaging because hydronephrosis is a sign of impaired drainage whose cause determines urgency.",
      "Trend temperature, blood pressure, pain, intake and output, bladder volume, creatinine, electrolytes, urinalysis, culture, and serial ultrasound or other imaging because prolonged pressure and infection can destroy kidney function even when symptoms are mild.",
      "Maintain prescribed catheter, ureteral stent, or nephrostomy patency and document urine amount, color, leakage, site condition, securement, and pain because kinking, dislodgment, or blockage rapidly recreates pressure and infection risk.",
      "After decompression, monitor hourly urine output, weight, pressure, sodium, potassium, magnesium, and hydration and replace losses as ordered because post-obstructive diuresis can cause severe volume and electrolyte depletion.",
      "Escalate immediately for fever with obstructed drainage, hypotension, confusion, anuria, bilateral obstruction, solitary-kidney pain, rapidly rising creatinine, severe uncontrolled flank pain, dislodged nephrostomy, or falling output because infected obstruction and acute kidney injury require urgent source control."
    ], [
      "Fever, rigors, hypotension, or confusion with flank pain or obstructed urine flow",
      "Anuria, bilateral hydronephrosis, solitary-kidney obstruction, or rapidly rising creatinine",
      "Severe uncontrolled colicky pain, persistent vomiting, or gross hematuria with clots",
      "Dislodged nephrostomy or stent with leakage, falling output, swelling, or acute pain"
    ], [
      "Teach drain and catheter securement, never to flush unless specifically instructed, and to compare daily output because an apparently small kink can reobstruct the kidney.",
      "Explain that pain relief does not always prove drainage is restored, so ordered imaging and kidney tests must be completed even after symptoms improve."
    ]),
    card("Hyperphosphatemia", ["kdigo-ckd-mbd"], [
      "Assess kidney function, dialysis adherence, phosphate-containing medicines or bowel preparations, diet and additives, tumor lysis or tissue breakdown, pruritus, bone pain, and neuromuscular symptoms because retained or released phosphate has different causes and often lowers calcium.",
      "Trend serial phosphate with corrected or ionized calcium, parathyroid hormone, magnesium, potassium, creatinine, bicarbonate, electrocardiogram when symptomatic, and dialysis adequacy because treatment decisions require the mineral pattern rather than one isolated value.",
      "Administer the prescribed phosphate binder with meals and snacks and monitor constipation, gastrointestinal effects, calcium load, iron interactions, and adherence because binders work only when present in the gut with dietary phosphate.",
      "Coordinate renal-dietitian teaching that prioritizes highly absorbable phosphate additives while preserving adequate protein and optimize dialysis as ordered because indiscriminate food restriction can cause malnutrition without controlling the main phosphate sources.",
      "Escalate immediately for tetany, laryngospasm, seizure, prolonged QT or dysrhythmia, severe weakness, symptomatic hypocalcemia, rapidly rising phosphate during tumor lysis, or missed dialysis with pulmonary edema because acute mineral and kidney complications can be fatal."
    ], [
      "Tetany, carpopedal spasm, laryngospasm, seizure, or acute confusion",
      "Prolonged QT, ventricular dysrhythmia, hypotension, or symptomatic hypocalcemia",
      "Rapid phosphate and potassium rise with tumor lysis, oliguria, or acute kidney injury",
      "Missed dialysis with severe dyspnea, pulmonary edema, chest pain, or uremic decline"
    ], [
      "Teach the patient to take each binder with the food it is meant to bind because a dose taken hours later cannot remove phosphate already absorbed.",
      "Show how ingredient words containing 'phos' identify highly absorbable additives because avoiding those sources may lower phosphate without unnecessarily restricting nutritious whole foods."
    ]),
    card("Hypophosphatemia", ["waht-hypophosphataemia-2026"], [
      "Assess malnutrition and refeeding, alcohol use, diarrhea, antacid or binder use, respiratory alkalosis, insulin treatment of ketoacidosis, burns, diuretics, and renal losses because identifying redistribution, low intake, or wasting prevents recurrent depletion.",
      "Trend phosphate, calcium, magnesium, potassium, sodium, creatinine, glucose, respiratory strength, oxygenation, mental status, muscle pain, creatine kinase, blood count, and electrocardiogram when severe because low ATP can cause respiratory failure, rhabdomyolysis, hemolysis, seizures, and dysrhythmia.",
      "Give prescribed oral phosphate when feasible or pump-controlled intravenous phosphate for severe or symptomatic deficiency and recheck laboratories at the protocol interval because rapid replacement can cause hypocalcemia, hypotension, kidney injury, and metastatic calcification.",
      "During nutrition reintroduction, advance calories and provide thiamine and electrolyte replacement as ordered while monitoring fluid balance and daily weight because insulin-driven intracellular shifts can precipitate refeeding syndrome across phosphate, potassium, and magnesium.",
      "Escalate immediately for severe weakness, respiratory distress, inability to wean ventilation, seizure, confusion, chest pain, dysrhythmia, dark urine, hemolysis, or a critically low phosphate with symptoms because profound cellular energy failure requires monitored urgent correction."
    ], [
      "Respiratory muscle weakness, rising carbon dioxide, hypoxemia, or ventilatory failure",
      "Seizure, severe confusion, coma, chest pain, or ventricular dysrhythmia",
      "Rhabdomyolysis with severe muscle pain, dark urine, or rapidly rising creatine kinase",
      "Hemolysis, profound weakness, refeeding edema, or critically low symptomatic phosphate"
    ], [
      "Teach that phosphate supplements are not interchangeable and should not be self-dosed because products contain different sodium or potassium loads and excessive replacement is dangerous.",
      "Explain gradual nutrition after prolonged starvation because feeding too quickly can shift phosphate into cells and weaken the heart, brain, and breathing muscles."
    ]),
    card("Inflammatory bowel disease", ["acg-uc-2025", "acg-crohn-2025"], [
      "Quantify stool frequency, nocturnal stools, blood, urgency, abdominal pain, distention, vomiting, weight, intake, fever, perianal drainage, extraintestinal symptoms, and recent antibiotics or travel because flare, infection, obstruction, abscess, and medication toxicity overlap.",
      "Trend vital signs, abdominal examination and girth, intake and output, daily weight, blood count, electrolytes, creatinine, albumin, inflammatory markers, stool infection testing, and fecal biomarkers as ordered because objective severity guides treatment and detects hemorrhage, dehydration, and toxic colitis.",
      "Administer prescribed induction or maintenance therapy and monitor blood counts, liver and kidney function, infection, thrombosis, steroid glucose and bone effects, and biologic screening because controlling mucosal inflammation prevents damage while immune therapy creates predictable safety risks.",
      "Support individualized nutrition, skin and perianal care, pain management that avoids unsafe antidiarrheals during severe colitis, mobility and thrombosis prophylaxis, vaccination, and ostomy teaching because inflammation and hospitalization increase malnutrition, skin injury, clot, and infection risk.",
      "Escalate immediately for severe distention with fever or tachycardia, guarding or rebound, absent bowel sounds, persistent vomiting, major bleeding, hypotension, rapidly falling hemoglobin, perianal sepsis, acute dyspnea or unilateral swelling because toxic megacolon, perforation, obstruction, abscess, hemorrhage, sepsis, or venous thrombosis may be present."
    ], [
      "Severe abdominal distention with fever, tachycardia, tenderness, or systemic toxicity",
      "Guarding, rebound, rigid abdomen, absent bowel sounds, persistent vomiting, or obstruction",
      "Major rectal bleeding, syncope, hypotension, or rapidly falling hemoglobin",
      "Fluctuant perianal pain, sepsis, unilateral leg swelling, pleuritic pain, or acute dyspnea"
    ], [
      "Teach the difference between symptom relief and mucosal disease control because feeling better does not always mean inflammation is healed or maintenance therapy can stop.",
      "Provide a written flare plan covering stool change, fever, bleeding, pain, hydration, infection exposure, and whom to call because early treatment can prevent hospitalization and surgery."
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
  window.ANI_PATHOLOGY_NURSING_WAVE31_A = {
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
