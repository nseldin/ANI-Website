(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  const VERSION = "2026-07-18-wave32-pathology-nursing-b-1";
  const COHORT = "B";

  function activePathologyEntries() {
    if (typeof pathologyDiseases !== "undefined" && Array.isArray(pathologyDiseases)) return pathologyDiseases;
    return database && Array.isArray(database.diseases) ? database.diseases : [];
  }

  const sources = [
    { id: "nih-antibiotic-pd", label: "NCBI Bookshelf, Pharmacokinetic and Pharmacodynamic Measures for Antibiotic Treatment", url: "https://www.ncbi.nlm.nih.gov/books/NBK266259/", note: "Supports concentration-dependent antimicrobial killing, peak-to-MIC and exposure-to-MIC targets, extended-interval concepts, and toxicity-aware drug monitoring." },
    { id: "nih-first-pass", label: "NCBI Bookshelf, First-Pass Effect", url: "https://www.ncbi.nlm.nih.gov/books/NBK551679/", note: "Supports route-dependent presystemic metabolism, bioavailability differences, liver and gut contributions, and safe interpretation of formulation changes." },
    { id: "nih-pk", label: "NCBI Bookshelf, Pharmacokinetics", url: "https://www.ncbi.nlm.nih.gov/books/NBK557744/", note: "Supports absorption, distribution, metabolism, elimination, clearance, half-life, loading-dose, accumulation, and steady-state concepts." },
    { id: "nih-diagnostic", label: "NCBI Bookshelf, Appendix B: Measures of Diagnostic Performance: Sensitivity, Specificity, and Predictive Value", url: "https://www.ncbi.nlm.nih.gov/books/NBK605677/", note: "Supports sensitivity and predictive-value interpretation, dependence on pretest probability and prevalence, and the limits of negative screening results." },
    { id: "nih-diagnostic-accuracy", label: "NCBI Bookshelf, Diagnostic Testing Accuracy: Sensitivity, Specificity, Predictive Values and Likelihood Ratios", url: "https://www.ncbi.nlm.nih.gov/books/NBK557491/", note: "Supports integrated interpretation of diagnostic accuracy, pretest probability, predictive values, likelihood ratios, false results, and the clinical consequences of testing decisions." },
    { id: "nih-clinical-methods-diagnostic", label: "NCBI Bookshelf, Clinical Methods: Sensitivity, Specificity, and Predictive Value", url: "https://www.ncbi.nlm.nih.gov/books/NBK383/", note: "Supports sensitivity and specificity calculations, their relationship to diagnostic thresholds, and Bayesian interpretation of positive and negative predictive values." },
    { id: "fda-clinpharm", label: "FDA, Clinical Pharmacology Section of Prescription Drug Labeling", url: "https://www.fda.gov/media/74346/download?attachment=", note: "Supports label-based pharmacokinetic parameters, clinically meaningful exposure, steady state, accumulation, clearance, half-life, and dose-adjustment information." },
    { id: "nhlbi-vasculitis", label: "NHLBI, Vasculitis", url: "https://www.nhlbi.nih.gov/health/vasculitis", note: "Supports organ-pattern assessment, blood-vessel inflammation mechanisms, subtype evaluation, treatment monitoring, and recognition of ischemic or aneurysmal complications." },
    { id: "nih-vitd", label: "NIH Office of Dietary Supplements, Vitamin D Fact Sheet for Health Professionals", url: "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/", note: "Supports 25-hydroxyvitamin D interpretation, deficiency risks, calcium and bone physiology, replacement safety, and toxicity prevention." },
    { id: "nei-amd", label: "National Eye Institute, Age-Related Macular Degeneration", url: "https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/age-related-macular-degeneration", note: "Supports central-vision monitoring, dry-versus-wet distinctions, urgent recognition of new distortion, treatment, and vision rehabilitation." },
    { id: "cdc-autism", label: "CDC, Clinical Testing and Diagnosis for Autism Spectrum Disorder", url: "https://www.cdc.gov/autism/hcp/diagnosis/index.html", note: "Supports developmental surveillance, comprehensive diagnosis, assessment of co-occurring conditions, and connection to early supports without awaiting a final label." },
    { id: "nimh-eating", label: "NIMH, Eating Disorders: What You Need to Know", url: "https://www.nimh.nih.gov/health/publications/eating-disorders", note: "Supports binge-eating symptoms, medical and psychiatric consequences, coordinated psychotherapy, nutrition care, medication, and safety assessment." },
    { id: "cdc-vvc", label: "CDC, Vulvovaginal Candidiasis STI Treatment Guidelines", url: "https://www.cdc.gov/std/treatment-guidelines/candidiasis.htm", note: "Supports diagnostic confirmation, uncomplicated and complicated classification, antifungal treatment, pregnancy considerations, and evaluation of recurrent symptoms." },
    { id: "aad-contact", label: "American Academy of Dermatology, Contact Dermatitis Diagnosis and Treatment", url: "https://www.aad.org/public/diseases/eczema/types/contact-dermatitis/treatment", note: "Supports exposure history, allergen or irritant avoidance, patch testing, skin-directed therapy, and reassessment of persistent dermatitis." },
    { id: "niams-fibro", label: "NIAMS, Fibromyalgia Diagnosis and Treatment", url: "https://www.niams.nih.gov/health-topics/fibromyalgia/diagnosis-treatment-and-steps-to-take", note: "Supports symptom-based diagnosis, exclusion of mimics, graded movement, sleep and behavioral care, medication, and function-focused monitoring." },
    { id: "nei-glaucoma", label: "National Eye Institute, Glaucoma", url: "https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/glaucoma", note: "Supports silent open-angle disease, optic-nerve and visual-field surveillance, pressure-lowering treatment, and acute angle-closure emergency recognition." },
    { id: "nidcd-hearing", label: "NIDCD, Adult Hearing Health Care", url: "https://www.nidcd.nih.gov/health/adult-hearing-health-care", note: "Supports hearing evaluation, communication access, hearing devices, prevention of noise injury, and referral for clinically important hearing change." },
    { id: "nidcd-sudden-deafness", label: "NIDCD, Sudden Sensorineural Hearing Loss", url: "https://www.nidcd.nih.gov/health/sudden-deafness", note: "Supports treating sudden sensorineural hearing loss as a medical emergency because delayed diagnosis and treatment can reduce the chance of recovery." },
    { id: "cdc-zoster", label: "CDC, Clinical Overview of Shingles", url: "https://www.cdc.gov/shingles/hcp/clinical-overview/index.html", note: "Supports acute herpes-zoster recognition, antiviral timing, pain and skin care, transmission precautions, vaccination, and urgent ocular, otic, neurologic, or disseminated-disease evaluation." },
    { id: "cdc-trich", label: "CDC, Trichomoniasis STI Treatment Guidelines", url: "https://www.cdc.gov/std/treatment-guidelines/trichomoniasis.htm", note: "Supports sensitive testing, sex-specific treatment, partner management, abstinence through treatment, STI testing, and retesting to detect reinfection." },
    { id: "niehs-inflammation", label: "National Institute of Environmental Health Sciences, Inflammation", url: "https://www.niehs.nih.gov/health/topics/conditions/inflammation", note: "Supports inflammation as a protective injury response that becomes harmful when excessive, misdirected, or unresolved, with acute and chronic consequences." },
    { id: "nhlbi-ards", label: "NHLBI, Acute Respiratory Distress Syndrome", url: "https://www.nhlbi.nih.gov/health/ards", note: "Supports permeability-related noncardiogenic pulmonary edema, hypoxemia assessment, respiratory support, treatment of the precipitating cause, and multiorgan-complication surveillance." },
    { id: "ncbi-ncpe", label: "NCBI Bookshelf, Noncardiogenic Pulmonary Edema", url: "https://www.ncbi.nlm.nih.gov/books/NBK542230/", note: "Supports the broader noncardiogenic pulmonary-edema differential, including ARDS, TRALI, negative-pressure, neurogenic, high-altitude, re-expansion, reperfusion, toxin, and other cause-specific mechanisms and responses." },
    { id: "nih-alkalosis", label: "NCBI Bookshelf, Alkalosis", url: "https://www.ncbi.nlm.nih.gov/books/NBK545269/", note: "Supports respiratory alkalosis mechanisms, blood-gas interpretation, compensation, cause-directed evaluation, electrolyte effects, and urgent cardiopulmonary or toxicologic differentials." },
    { id: "nih-ammonia", label: "NCBI Bookshelf, Biochemistry, Ammonia", url: "https://www.ncbi.nlm.nih.gov/books/NBK541039/", note: "Supports urine ammonium physiology and the careful use of indirect urine measures when assessing renal response to metabolic acidosis." },
    { id: "nci-skin", label: "National Cancer Institute, Skin Cancer Treatment PDQ", url: "https://www.cancer.gov/types/skin/hp/skin-treatment-pdq", note: "Supports basal-cell carcinoma risk assessment, biopsy, local treatment selection, recurrence surveillance, and care of advanced or anatomically high-risk disease." },
    { id: "niddk-diverticular", label: "NIDDK, Diverticular Disease", url: "https://www.niddk.nih.gov/health-information/digestive-diseases/diverticulosis-diverticulitis", note: "Supports the distinction between incidental diverticulosis and diverticulitis, symptom assessment, bleeding and perforation recognition, treatment, and prevention." },
    { id: "niddk-glomerular", label: "NIDDK, Glomerular Disease", url: "https://www.niddk.nih.gov/health-information/kidney-disease/glomerular-disease", note: "Supports urine, kidney-function, edema, blood-pressure, and immune-cause assessment across glomerulonephritis and other glomerular syndromes." },
    { id: "aha-hypotension", label: "American Heart Association, Low Blood Pressure", url: "https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/low-blood-pressure-when-blood-pressure-is-too-low", note: "Supports symptom-based interpretation of low blood pressure, orthostatic assessment, cause review, and recognition of shock or organ hypoperfusion." },
    { id: "nci-lung", label: "National Cancer Institute, Non-Small Cell Lung Cancer Treatment PDQ", url: "https://www.cancer.gov/types/lung/hp/non-small-cell-lung-treatment-pdq", note: "Supports tissue diagnosis, staging, molecular and immune-marker testing, multimodal treatment, toxicity monitoring, and symptom-directed escalation." },
    { id: "nci-small-cell-lung", label: "National Cancer Institute, Small Cell Lung Cancer Treatment PDQ", url: "https://www.cancer.gov/types/lung/hp/small-cell-lung-treatment-pdq", note: "Supports small-cell histology confirmation, limited- versus extensive-stage classification, chemotherapy and radiation pathways, paraneoplastic syndromes, and the major management differences from non-small-cell lung cancer." },
    { id: "niddk-nephrotic", label: "NIDDK, Nephrotic Syndrome in Adults", url: "https://www.niddk.nih.gov/health-information/kidney-disease/nephrotic-syndrome-adults", note: "Supports heavy proteinuria, hypoalbuminemia, edema, lipid changes, cause-directed therapy, and infection, thrombosis, kidney, and volume complication surveillance." },
    { id: "nhlbi-sleep", label: "NHLBI, Sleep Apnea", url: "https://www.nhlbi.nih.gov/health/sleep-apnea", note: "Supports sleep-study diagnosis, obstructive and central distinctions, positive-airway-pressure treatment, symptom follow-up, and cardiovascular and safety consequences." },
    { id: "niddk-incontinence", label: "NIDDK, Urinary Incontinence Diagnosis and Treatment", url: "https://www.niddk.nih.gov/health-information/urologic-diseases/bladder-control-problems", note: "Supports bladder diaries, subtype and reversible-cause assessment, pelvic-floor and bladder training, medicines, devices, procedures, and skin protection." },
    { id: "nih-pulse", label: "NCBI Bookshelf, Physiology, Pulse Pressure", url: "https://www.ncbi.nlm.nih.gov/books/NBK482408/", note: "Supports PP = SBP - DBP in mm Hg, about 40 mm Hg in a resting young adult, less than 25% of SBP as a commonly cited narrow criterion, greater than 100 mm Hg as markedly widened, and context-dependent interpretation." },
    { id: "eapc-vascular-ageing", label: "European Association of Preventive Cardiology Consensus: Vascular Ageing", url: "https://academic.oup.com/eurjpc/article/30/11/1101/7026201", note: "Supports brachial pulse pressure of 60 mm Hg or greater as a marker of arterial stiffness and hypertension-mediated organ damage in older people, with age-dependent interpretation." },
    { id: "cdc-adhd", label: "CDC, Clinical Care of ADHD", url: "https://www.cdc.gov/adhd/hcp/treatment-recommendations/index.html", note: "Supports multi-setting diagnosis, evaluation of mimics and co-occurring conditions, age-specific behavioral and medication treatment, and outcome and adverse-effect monitoring." },
    { id: "svs-cvi", label: "Society for Vascular Surgery, Chronic Venous Insufficiency Patient Guide", url: "https://vascular.org/sites/default/files/2025-12/SVS_YVH_CVI.pdf", note: "Supports venous reflux and pooling mechanisms, edema and skin assessment, compression and movement, ulcer care, and evaluation for venous intervention." },
    { id: "niams-eczema", label: "NIAMS, Atopic Dermatitis Diagnosis and Treatment", url: "https://www.niams.nih.gov/health-topics/atopic-dermatitis/diagnosis-treatment-and-steps-to-take", note: "Supports barrier repair, trigger reduction, topical and systemic therapy, itch control, and bacterial, viral, and treatment-related complication recognition." },
    { id: "acr-gout", label: "American College of Rheumatology, Gout", url: "https://rheumatology.org/patients/gout", note: "Supports crystal confirmation when needed, acute anti-inflammatory treatment, urate-lowering therapy, serum-urate targets, and kidney and cardiovascular comorbidity review." },
    { id: "aaos-perthes", label: "American Academy of Orthopaedic Surgeons, Perthes Disease", url: "https://orthoinfo.aaos.org/diseases--conditions/perthes-disease", note: "Supports femoral-head osteonecrosis staging, containment and motion goals, activity modification, serial imaging, and orthopedic follow-up during childhood remodeling." },
    { id: "niams-oa", label: "NIAMS, Osteoarthritis Diagnosis and Treatment", url: "https://www.niams.nih.gov/health-topics/osteoarthritis/diagnosis-treatment-and-steps-to-take", note: "Supports clinical diagnosis, exercise and function-centered management, analgesic safety, assistive strategies, and surgical evaluation for advanced disability." },
    { id: "aha-pad", label: "2024 AHA/ACC Guideline for Lower Extremity Peripheral Artery Disease", url: "https://professional.heart.org/en/guidelines-statements/2024-accahaaacvprapmaabcscaisvmsvnsvssirvess-guideline-for-the-management-ofcir0000000000001251", note: "Supports vascular examination, ankle-brachial testing, cardiovascular risk reduction, structured exercise, foot care, revascularization, and acute limb-ischemia response." },
    { id: "nci-renal", label: "National Cancer Institute, Renal Cell Cancer Treatment PDQ", url: "https://www.cancer.gov/types/kidney/hp/kidney-treatment-pdq", note: "Supports renal-cell cancer staging, nephron-sparing or radical treatment, systemic therapy, renal monitoring, treatment toxicity, recurrence, and survivorship." },
    { id: "aaos-rotator", label: "American Academy of Orthopaedic Surgeons, Rotator Cuff Tears", url: "https://orthoinfo.aaos.org/diseases--conditions/rotator-cuff-tears-frequently-asked-questions", note: "Supports examination, activity modification, rehabilitation, nonsurgical treatment, surgical referral, and recognition of acute traumatic weakness." },
    { id: "niddk-wilson", label: "NIDDK, Wilson Disease Diagnosis and Treatment", url: "https://www.niddk.nih.gov/health-information/liver-disease/wilson-disease", note: "Supports copper-focused diagnosis, lifelong chelation or zinc, laboratory and neurologic monitoring, family testing, and urgent liver-failure recognition." },
    { id: "cdc-alpha", label: "CDC, Managing Alpha-gal Syndrome", url: "https://www.cdc.gov/alpha-gal-syndrome/managing/index.html", note: "Supports delayed mammalian-product reactions, individualized avoidance, ingredient and medication review, tick-bite prevention, epinephrine readiness, and emergency care." },
    { id: "aao-bppv", label: "AAO-HNS, Benign Paroxysmal Positional Vertigo Guideline", url: "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/bppv/", note: "Supports positional testing, canalith-repositioning maneuvers, fall assessment, restrained imaging and suppressants, reassessment, and evaluation of atypical findings." },
    { id: "nimh-psychosis", label: "NIMH, Understanding Psychosis", url: "https://www.nimh.nih.gov/health/publications/understanding-psychosis", note: "Supports early psychosis recognition, medical and substance differentials, safety assessment, respectful communication, coordinated treatment, and crisis response." },
    { id: "cdc-bv", label: "CDC, Bacterial Vaginosis STI Treatment Guidelines", url: "https://www.cdc.gov/std/treatment-guidelines/bv.htm", note: "Supports dysbiosis-based diagnosis, treatment of symptomatic disease, pregnancy considerations, STI testing, recurrence counseling, and limits of partner treatment." },
    { id: "niams-sjogren", label: "NIAMS, Sjogren's Disease Diagnosis and Treatment", url: "https://www.niams.nih.gov/health-topics/sjogrens-disease/diagnosis-treatment-and-steps-to-take", note: "Supports objective eye and salivary assessment, dryness care, dental prevention, systemic-organ surveillance, immunomodulatory treatment, and lymphoma warning signs." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const patches = [
    card("Concentration-dependent killing", ["nih-antibiotic-pd"], [
      "Verify the organism, susceptibility, prescribed agent, dose, weight, renal function, and exact administration time because peak exposure relative to susceptibility drives killing for concentration-dependent antimicrobials.",
      "Obtain ordered peak, random, or trough concentrations at protocol-specific times and document sampling accurately because a mistimed level can falsely suggest underexposure or toxic accumulation.",
      "Trend creatinine, urine output, hearing, balance, neuromuscular function, infusion reactions, and clinical response because aminoglycosides and other concentration-dependent agents need drug-specific monitoring for toxicity while infection remains uncontrolled.",
      "Preserve the ordered interval and infusion rate rather than dividing doses independently because a high effective peak and sufficiently low drug-free interval may optimize killing and limit toxicity.",
      "Escalate for oliguria, rising creatinine, new tinnitus or vertigo, weakness, respiratory decline, shock, or a critically high concentration because toxicity or treatment failure requires immediate dose and source-control reassessment."
    ], [
      "Rapidly rising creatinine, oliguria, or critically high antimicrobial concentration",
      "New tinnitus, hearing loss, vertigo, severe imbalance, or oscillating vision",
      "New weakness, hyporeflexia, swallowing difficulty, or respiratory muscle compromise",
      "Persistent fever, hypotension, worsening cultures, or organ dysfunction despite therapy"
    ], [
      "Take each dose at the scheduled interval and keep laboratory appointments because timing determines both bacterial killing and whether drug concentrations can be interpreted safely.",
      "Report reduced urine, ringing ears, hearing change, dizziness, or weakness promptly because these toxicities can progress before routine laboratory results become obvious."
    ]),
    card("First-pass metabolism", ["nih-first-pass", "nih-pk"], [
      "Reconcile the exact drug, formulation, route, dose, food instructions, and swallowing ability because oral exposure may fall when gut-wall or liver metabolism removes drug before systemic circulation.",
      "Review liver disease, portal-systemic shunting, bowel surgery, vomiting, tube location, and interacting medicines because each can change presystemic metabolism or absorption and make usual oral dosing unreliable.",
      "Monitor blood pressure, respiratory rate, mental status, pain or seizure control, and drug-specific toxicity after any oral, sublingual, transdermal, enteral, or intravenous route change because bypassing first-pass metabolism can sharply increase bioavailability and systemic exposure.",
      "Administer only the route-specific ordered dose and verify crush or tube compatibility because equal milligram doses across formulations may not produce equal systemic exposure or safe release.",
      "Escalate for oversedation, hypotension, respiratory depression, arrhythmia, unexpected treatment failure, or acute hepatic deterioration because altered first-pass handling can create toxic or ineffective concentrations."
    ], [
      "Respiratory depression, profound sedation, hypotension, or new dysrhythmia after a route change",
      "Acute jaundice, confusion, bleeding, ascites, or rapidly worsening liver tests",
      "Loss of seizure, pain, blood-pressure, or infection control after formulation conversion",
      "Medication administered through an incompatible tube site or after unsafe crushing"
    ], [
      "Never substitute an oral, under-the-tongue, patch, or injectable form milligram-for-milligram because each route can deliver a different amount to the bloodstream.",
      "Tell the care team about liver disease, bowel surgery, feeding tubes, supplements, and new medicines because these factors can change absorption and first-pass metabolism."
    ]),
    card("Predictive value", ["nih-diagnostic", "nih-diagnostic-accuracy"], [
      "Identify the tested population, indication, pretest probability, prevalence, specimen quality, and assay version before interpreting a positive culture, troponin assay, imaging study, or other result because predictive values change with clinical context rather than belonging permanently to a test.",
      "Explain a positive result as the probability of disease after that result, then check confirmatory requirements because low-prevalence screening produces more false positives even when specificity is high.",
      "Explain a negative result alongside sensitivity, timing, disease stage, and the limitations of the actual culture, troponin assay, imaging study, or other method because early testing, poor sampling, or a less sensitive assay can leave clinically important disease unresolved.",
      "Trend vital signs, oxygenation, pain, fever, mental status, exposure history, and objective evidence chosen for the suspected disorder, such as cultures, troponin, or imaging, alongside repeat or different-method confirmation because predictive value must guide care without replacing bedside evidence of deterioration.",
      "Escalate urgent symptoms, critical preliminary results, discordant repeat tests, or high-risk exposure despite a negative screen because immediate risk can outweigh an apparently reassuring predictive value."
    ], [
      "Severe symptoms or physiologic instability despite a negative screening result",
      "Critical positive result requiring isolation, treatment, or confirmatory action",
      "Strong exposure or examination findings discordant with the reported test",
      "Specimen collection, labeling, transport, timing, or assay-quality failure"
    ], [
      "A positive result is not automatically a diagnosis because its meaning changes with how likely the disease was before testing.",
      "A negative result cannot overrule serious symptoms, so seek reassessment when illness progresses or the sample was taken too early."
    ]),
    card("Steady state", ["nih-pk", "fda-clinpharm"], [
      "Record dose, interval, start time, missed doses, formulation, and sampling time because repeated dosing approaches steady state over multiple half-lives only when exposure is consistent.",
      "Review renal and hepatic function, age, fluid status, interactions, and recent dose changes because altered clearance changes both the eventual plateau concentration and time required to reach it.",
      "Schedule therapeutic concentrations at the drug-specific phase and true dose history because a pre-steady-state or mistimed sample can prompt an unsafe adjustment.",
      "Trend desired effect, adverse effects, concentration, creatinine, liver tests, ECG, or other drug-specific markers because accumulation can cause complications before a numerical plateau is documented.",
      "Escalate severe toxicity, a critical level, organ-function decline, arrhythmia, seizure, bleeding, or treatment failure because waiting for steady state is unsafe when harm or uncontrolled disease is already present."
    ], [
      "Critical drug concentration or rapidly worsening concentration trend",
      "New arrhythmia, seizure, major bleeding, respiratory depression, or severe confusion",
      "Acute kidney or liver dysfunction during an accumulating medicine regimen",
      "Clinical deterioration while treatment is being delayed for presumed steady state"
    ], [
      "Do not double missed doses unless the prescription specifically directs it because extra doses can accumulate for several half-lives.",
      "Bring exact dose times to laboratory visits because clinicians need the timing to decide whether a drug level reflects steady state."
    ]),
    card("Therapeutic index", ["nih-pk", "fda-clinpharm"], [
      "Identify medicines with a narrow therapeutic range and verify indication, dose, route, weight, allergies, interactions, and organ function because small exposure changes can separate benefit from serious toxicity.",
      "Use independent checks for high-alert administration and obtain drug-specific levels, ECGs, coagulation tests, glucose, or other markers because therapeutic-index risk must be monitored with the relevant clinical endpoint.",
      "Reconcile prescription, over-the-counter, herbal, dietary, and substance exposures at every transition because enzyme inhibition, induction, binding, or additive effects can abruptly narrow the safety margin.",
      "Trend effectiveness together with neurologic, cardiac, bleeding, renal, hepatic, and respiratory findings because a technically in-range concentration does not exclude patient-specific toxicity.",
      "Hold or escalate per protocol for a critical level, major bleeding, arrhythmia, seizure, severe hypoglycemia, respiratory depression, or organ failure because narrow-index toxicity can become irreversible quickly."
    ], [
      "Major bleeding, intracranial symptoms, severe hypoglycemia, or respiratory depression",
      "New seizure, dangerous arrhythmia, syncope, or profound mental-status change",
      "Critical drug level or rapid renal or hepatic function deterioration",
      "Loss of therapeutic control despite verified adherence and administration"
    ], [
      "Use one current medication list and ask before starting supplements or nonprescription drugs because interactions can shift a narrow-index medicine from effective to toxic.",
      "Keep every ordered blood test and report unusual bleeding, confusion, fainting, tremor, or breathing change because symptoms may require action before the next dose."
    ]),
    card("Vasculitis", ["nhlbi-vasculitis"], [
      "Map constitutional, skin, joint, nerve, airway, lung, kidney, gastrointestinal, ocular, and vascular symptoms because vasculitis is a disease family whose urgency and treatment depend on vessel size and threatened organ.",
      "Trend blood pressure, pulses, urine output and sediment, creatinine, blood count, inflammatory markers, oxygenation, and subtype-specific studies because ischemia, hemorrhage, or glomerular injury may progress silently.",
      "Administer glucocorticoid, immunosuppressive, antimicrobial, antithrombotic, or prophylactic therapy exactly for the confirmed subtype because treating infection-related and autoimmune vasculitis as interchangeable can worsen the cause.",
      "Monitor fever, blood counts, glucose, bone protection, vaccination status, and opportunistic-infection symptoms, and obtain cultures promptly when infection is suspected, because sustained immune suppression controls vessel injury while creating serious preventable infectious and metabolic complications.",
      "Escalate for vision change, hemoptysis, hypoxemia, new neurologic deficit, absent pulse, severe abdominal pain, oliguria, or shock because retinal, pulmonary, cerebral, limb, bowel, or renal ischemia is time-critical."
    ], [
      "Sudden visual loss, diplopia, severe new headache, or jaw claudication",
      "Hemoptysis, rapidly worsening dyspnea, hypoxemia, or diffuse pulmonary bleeding",
      "New focal neurologic deficit, absent pulse, cool limb, or severe asymmetric pain",
      "Oliguria, rapidly rising creatinine, severe abdominal pain, bleeding, or shock"
    ], [
      "Know the exact vasculitis subtype and involved organs because the word vasculitis alone does not define treatment, prognosis, or emergency risks.",
      "Report fever or infection exposure promptly while immunosuppressed and never stop corticosteroids suddenly because both infection and adrenal crisis can become dangerous."
    ]),
    card("Vitamin D deficiency", ["nih-vitd"], [
      "Assess diet, sunlight exposure, skin pigmentation, malabsorption, bariatric surgery, kidney and liver disease, medicines, falls, weakness, and bone pain because deficiency usually reflects reduced supply, absorption, activation, or increased breakdown.",
      "Interpret 25-hydroxyvitamin D with calcium, phosphate, alkaline phosphatase, parathyroid hormone, kidney function, symptoms, and assay context because an isolated value does not identify osteomalacia or its cause.",
      "Give the prescribed replacement and calcium plan while checking formulation and cumulative supplement dose because under-replacement delays mineralization whereas excessive vitamin D can cause hypercalcemia and kidney injury.",
      "Trend strength, gait, falls, pain, 25-hydroxyvitamin D, calcium, and renal function at the ordered interval because biochemical recovery and skeletal recovery occur at different rates.",
      "Escalate for confusion, persistent vomiting, dehydration, polyuria, kidney-stone pain, arrhythmia, pathologic fracture, or progressive proximal weakness because severe deficiency or replacement toxicity can cause acute complications."
    ], [
      "Fragility fracture, inability to bear weight, or severe focal bone pain",
      "Confusion, repeated vomiting, dehydration, polyuria, or suspected hypercalcemia",
      "Renal colic, hematuria, oliguria, or rapidly worsening kidney function",
      "Progressive proximal weakness, recurrent falls, or painful muscle spasms or tetany"
    ], [
      "Use the prescribed strength and include all multivitamins in the total because vitamin D products vary greatly and excessive dosing can raise calcium dangerously.",
      "Keep follow-up testing rather than treating fatigue alone because the laboratory trend, calcium balance, and underlying cause determine safe treatment duration."
    ]),
    card("Age-related macular degeneration", ["nei-amd"], [
      "Assess each eye separately for central blur, distortion, blank spots, color change, reading difficulty, falls, and functional loss because the better eye can mask progression in the affected eye.",
      "Verify AMD type and stage, dilated examination, optical-coherence findings, and planned monitoring because dry disease usually progresses slowly while neovascular disease can damage central vision rapidly.",
      "Support prescribed anti-VEGF injections, selected AREDS2 supplementation, smoking cessation, and vascular risk control because treatment and risk reduction preserve remaining macular function but do not restore all lost cells.",
      "Monitor injection dates, vision, Amsler-grid change, eye pain, redness, discharge, flashes, and floaters because recurrence, endophthalmitis, retinal tear, or pressure complications require prompt assessment.",
      "Escalate the same day for new wavy lines, central shadow, sudden vision loss, severe eye pain, marked redness, or photophobia because wet conversion or post-injection infection can cause irreversible loss."
    ], [
      "New central distortion, wavy straight lines, blank spot, or sudden visual decline",
      "Severe eye pain, redness, photophobia, discharge, or reduced vision after injection",
      "New flashes, shower of floaters, curtain-like field loss, or retinal symptoms",
      "Acute functional collapse, repeated falls, or inability to manage medicines safely"
    ], [
      "Check one eye at a time with the recommended grid and call for any new distortion because the unaffected eye can hide a meaningful change.",
      "Use only the supplement formula recommended for your AMD stage because ordinary multivitamins are not equivalent and some ingredients may be unsafe for smokers."
    ]),
    card("Autism spectrum disorder", ["cdc-autism"], [
      "Gather developmental, communication, social, sensory, play, behavior, sleep, feeding, school, and regression history across settings because autism is defined by persistent patterns and support needs rather than one isolated behavior.",
      "Use the person's preferred communication method, predictable sequencing, literal language, processing time, and sensory accommodations because reducing uncertainty improves assessment accuracy and prevents distress from being mislabeled as noncompliance.",
      "Monitor hearing, vision, language, cognition, motor function, seizures, gastrointestinal symptoms, sleep, anxiety, ADHD, self-injury, and caregiver strain because co-occurring conditions often drive immediate impairment more than core autistic traits.",
      "Connect developmental, speech-language, occupational, behavioral, educational, and family supports without waiting unnecessarily for every evaluation because skill-building and accommodations can begin while diagnostic clarification continues.",
      "Escalate for developmental regression, first seizure, severe dehydration or food restriction, wandering, severe or escalating self-injury, suicidality, or abrupt behavior change because neurologic, medical, environmental, or psychiatric emergencies can present behaviorally."
    ], [
      "Loss of previously acquired language, social, motor, or self-care skills",
      "First seizure, prolonged staring with unresponsiveness, or postictal change",
      "Severe food restriction, dehydration, weight loss, or swallowing danger",
      "Wandering, dangerous self-injury, aggression, abuse concern, or suicidal behavior"
    ], [
      "Autism reflects a neurodevelopmental pattern, not poor parenting, and useful care builds communication, autonomy, participation, and individualized supports rather than trying to erase identity.",
      "Bring familiar communication tools, sensory supports, routines, and a concise health profile to visits because these reduce distress and help clinicians understand baseline behavior."
    ]),
    card("Binge-eating disorder", ["nimh-eating"], [
      "Ask privately and without judgment about loss-of-control episodes, amount, speed, secrecy, distress, frequency, restriction, purging, substances, trauma, and weight stigma because shame commonly hides severity and compensatory behaviors change immediate risk.",
      "Monitor weight trajectory, blood pressure, sleep, glucose, lipids, liver risk, reflux, pain, menstrual health, and medication effects because recurrent binges can coexist with metabolic disease without defining a person's worth or diagnosis by body size.",
      "Screen depression, anxiety, ADHD, substance use, self-harm, suicidality, and social determinants because psychiatric comorbidity and food insecurity can perpetuate episodes and determine the safest treatment setting.",
      "Coordinate eating-disorder psychotherapy, regular adequate nutrition, medical follow-up, and prescribed medication while discouraging punitive dieting because restriction increases physiologic and emotional pressure for another binge.",
      "Escalate for suicidality, hematemesis, severe abdominal or chest pain, syncope, dehydration, uncontrolled diabetes, or suspected purging complications because an eating disorder can produce acute medical and psychiatric emergencies."
    ], [
      "Suicidal plan, self-harm, severe hopelessness, or inability to maintain safety",
      "Hematemesis, severe chest or abdominal pain, rigid abdomen, or repeated vomiting",
      "Syncope, severe dehydration, marked electrolyte abnormality, or cardiac symptoms",
      "Hyperglycemic crisis, rapidly worsening medical status, or inability to eat safely"
    ], [
      "Binge-eating disorder is a treatable illness involving loss of control and distress, not a failure of willpower or a body-size diagnosis.",
      "Regular nourishing meals and evidence-based therapy reduce binge pressure more reliably than fasting, shame, or repeated extreme diets that restart the cycle."
    ]),
    card("Candida vulvovaginitis", ["cdc-vvc"], [
      "Assess pruritus, soreness, dysuria, dyspareunia, discharge, odor, vaginal pH, pregnancy, diabetes, immune status, recent antibiotics, and self-treatment because symptoms alone cannot reliably distinguish Candida from bacterial vaginosis, trichomoniasis, dermatitis, or cervicitis.",
      "Collect wet preparation or culture as indicated before repeated empiric therapy because recurrent, severe, treatment-resistant, or non-albicans disease requires confirmation and sometimes susceptibility-guided management.",
      "Administer the prescribed topical or oral azole for the classified episode and review pregnancy and interaction risks because regimen length and route differ for uncomplicated, severe, recurrent, and pregnant patients.",
      "Trend symptom resolution, vulvar skin integrity, glucose control, recurrence timing, organism identification, and adverse effects because persistent inflammation can reflect resistance, reinfection assumptions, or a different diagnosis.",
      "Escalate for fever, pelvic or severe abdominal pain, pregnancy complications, spreading cellulitis, urinary retention, severe drug reaction, or symptoms persisting after appropriate therapy because uncomplicated vulvovaginal candidiasis should not cause systemic illness."
    ], [
      "Fever, pelvic pain, cervical-motion tenderness, or severe abdominal pain",
      "Pregnancy with bleeding, contractions, fluid leakage, fever, or reduced fetal movement",
      "Rapidly spreading vulvar redness, necrosis, urinary retention, or systemic toxicity",
      "Blistering drug rash, facial swelling, breathing difficulty, or treatment-resistant recurrence"
    ], [
      "Avoid repeated over-the-counter yeast treatment without reassessment because itching and discharge have several causes and unnecessary therapy can delay the correct diagnosis.",
      "Complete the prescribed regimen and report recurrence, pregnancy, diabetes, or immune suppression because these factors change testing, drug choice, and treatment duration."
    ]),
    card("Contact dermatitis", ["aad-contact"], [
      "Map rash distribution, onset, itch, pain, blisters, work, hobbies, gloves, adhesives, metals, plants, cosmetics, cleansers, medicines, and caregiver exposures because the contact pattern often identifies the irritant or delayed allergen.",
      "Remove the suspected exposure, gently decontaminate when appropriate, protect broken skin, and document photographs because ongoing contact sustains inflammation even when anti-inflammatory treatment is correct.",
      "Apply prescribed emollients, topical corticosteroid, calcineurin inhibitor, wet dressing, or systemic therapy with site-specific instructions because eyelids, folds, hands, and thick skin absorb medicines differently.",
      "Monitor spread, sleep, function, fissures, drainage, fever, medication effects, and response after avoidance because secondary infection, occupational disability, or an incorrect diagnosis can complicate persistent disease.",
      "Escalate for facial or airway swelling, extensive blistering, mucosal involvement, severe pain, fever with spreading erythema, or eye exposure because anaphylaxis, severe drug eruption, infection, or chemical injury needs urgent care."
    ], [
      "Tongue, throat, or facial swelling with wheeze, stridor, or hypotension",
      "Extensive blistering, skin pain, peeling, or oral or ocular mucosal lesions",
      "Fever, purulent drainage, rapidly spreading redness, or red streaking",
      "Chemical eye exposure, vision change, circumferential swelling, or neurovascular compromise"
    ], [
      "Bring product labels and a timeline to evaluation because an allergen can appear in work supplies, jewelry, cosmetics, medicines, or another person's products.",
      "Use the prescribed steroid only on the named body site and duration because thin skin absorbs more medicine and prolonged misuse can damage it."
    ]),
    card("Fibromyalgia", ["niams-fibro"], [
      "Assess widespread pain, fatigue, unrefreshing sleep, cognition, headaches, sensory symptoms, mood, function, activity pattern, and duration because fibromyalgia reflects altered pain processing and is diagnosed from a consistent clinical pattern.",
      "Screen for inflammatory arthritis, endocrine disease, anemia, medication effects, sleep apnea, neurologic deficits, trauma, and infection when findings suggest them because fibromyalgia can coexist with treatable conditions but does not explain every new symptom.",
      "Build a paced program of aerobic movement, strengthening, sleep regularity, cognitive-behavioral strategies, and meaningful functional goals because gradual repetition recalibrates activity tolerance more reliably than alternating overexertion with prolonged rest.",
      "Monitor pain interference, sleep, mood, falls, work, medication benefit, sedation, blood pressure, weight, and misuse risk because treatment success means safer function rather than complete elimination of every sensation.",
      "Escalate for focal neurologic loss, hot swollen joint, fever, unexplained weight loss, new chest pain, severe weakness, or suicidality because these findings require evaluation beyond a fibromyalgia flare."
    ], [
      "New focal weakness, sensory level, bowel or bladder dysfunction, or acute gait loss",
      "Hot swollen joint, objective synovitis, fever, rash, or systemic illness",
      "Unexplained weight loss, night sweats, progressive anemia, or persistent focal pain",
      "Suicidal thinking, medication overdose, severe sedation, or respiratory depression"
    ], [
      "Fibromyalgia amplifies pain signals without destroying muscles or joints, so symptoms are real while safe movement remains an important part of recovery.",
      "Increase activity in small planned steps on both good and difficult days because boom-and-bust cycles worsen fatigue, sleep, and pain sensitivity."
    ]),
    card("Glaucoma", ["nei-glaucoma"], [
      "Assess visual fields, acuity, eye pain, halos, redness, headache, nausea, medication adherence, and fall risk because chronic open-angle damage is often silent while angle closure presents abruptly.",
      "Verify the prescribed eye, drop, dose, sequence, and punctal-occlusion technique because consistent local pressure lowering protects the optic nerve and reduces systemic absorption.",
      "Trend intraocular pressure, optic-nerve imaging, visual fields, functional vision, pulse, breathing, and ocular-surface symptoms because progression can occur despite a single acceptable pressure measurement.",
      "Review corticosteroids, anticholinergics, allergies, asthma, bradycardia, and planned procedures because medicines can raise pressure, trigger angle closure, or make certain glaucoma drops unsafe.",
      "Escalate immediately for intense eye pain, red eye, sudden blur or halos, headache, vomiting, or rapid field loss because acute angle closure can permanently damage the optic nerve within hours."
    ], [
      "Intense eye pain with red eye, blurred vision, halos, headache, or vomiting",
      "Sudden visual-field loss, marked acuity decline, or new afferent pupillary change",
      "Severe bradycardia, wheeze, syncope, or hypotension after an ophthalmic medicine",
      "Postoperative severe pain, discharge, photophobia, or rapidly declining vision"
    ], [
      "Use glaucoma drops every day even when vision feels normal because optic-nerve damage usually advances without pain or early warning.",
      "Close the eye and press gently beside the nose after a drop because this keeps medicine in the eye and limits systemic absorption."
    ]),
    card("Hearing loss", ["nidcd-hearing", "nidcd-sudden-deafness"], [
      "Determine sudden versus gradual onset, one or both ears, tinnitus, vertigo, pain, drainage, noise, medicines, trauma, and communication effect because conductive, sensorineural, and central causes require different urgency and treatment.",
      "Inspect for cerumen or external disease and arrange age-appropriate audiometry, tympanometry, or specialist testing because bedside conversation cannot quantify frequency-specific loss or safely exclude middle-ear pathology.",
      "Provide quiet face-to-face communication, lighting, written confirmation, interpreter or caption access, and checked hearing devices because inaccessible communication increases medication errors, delirium, isolation, and consent failures.",
      "Monitor hearing trend, speech understanding, balance, falls, ototoxic exposure, device fit, skin, batteries, and functional goals because amplification helps only when the system is usable and the underlying loss is followed.",
      "Escalate same day for sudden sensorineural loss, new unilateral neurologic findings, severe vertigo, temporal trauma, mastoid swelling, or meningitis signs because treatment delays can reduce recovery or miss life-threatening disease."
    ], [
      "Sudden hearing loss developing over hours or within several days",
      "Unilateral hearing change with facial weakness, ataxia, severe headache, or other neurologic deficit",
      "Severe vertigo, inability to walk, new diplopia, dysarthria, or persistent vomiting",
      "Fever with mastoid swelling, neck stiffness, altered consciousness, trauma, or cerebrospinal-fluid drainage"
    ], [
      "Sudden hearing loss is an urgent medical problem, not ordinary ear blockage, because early assessment can preserve a treatment window.",
      "Wear correctly fitted hearing protection around dangerous noise but avoid overprotection in routine settings because communication and environmental awareness also protect safety."
    ]),
    card("Shingles", ["cdc-zoster"], [
      "Assess rash onset, dermatomal distribution, vesicles, pain, fever, immune status, pregnancy exposure, eye, ear, facial, motor, bladder, and diffuse symptoms because location and host defense determine acute complication risk.",
      "Begin prescribed antiviral therapy promptly and adjust for renal function while providing multimodal pain and skin care because earlier viral suppression reduces acute burden and may limit complications.",
      "Cover localized lesions, use hand hygiene, and apply setting-specific precautions until lesions crust because vesicle fluid can transmit varicella to susceptible people who then develop chickenpox.",
      "Monitor new lesions, temperature, hydration, pain, sleep, vision, hearing, facial movement, neurologic status, urine output, and secondary infection because ocular, otic, disseminated, and neurologic zoster require intensified treatment.",
      "Escalate immediately for eye or nasal-tip lesions, vision change, ear vesicles with facial weakness, widespread rash, confusion, weakness, urinary retention, or sepsis because permanent sensory or neurologic injury can develop rapidly."
    ], [
      "Eye pain, red eye, photophobia, vision change, or vesicles near the eye or nasal tip",
      "Ear vesicles, severe vertigo, hearing loss, facial weakness, or swallowing difficulty",
      "Disseminated lesions, pneumonia symptoms, hypotension, confusion, or immunocompromised host",
      "New limb weakness, meningismus, severe headache, urinary retention, or bowel dysfunction"
    ], [
      "Keep the rash covered and avoid susceptible pregnant, newborn, or immunocompromised people until lesions crust because direct fluid contact can spread varicella virus.",
      "Vaccination is still recommended for eligible adults after recovery because one shingles episode does not provide reliable protection against another."
    ]),
    card("Trichomoniasis", ["cdc-trich"], [
      "Ask about discharge, odor, irritation, dysuria, pelvic symptoms, pregnancy, HIV, exposures, partners, prior treatment, and allergies without assumptions because most infections are minimally symptomatic and reinfection is common.",
      "Use a sensitive nucleic-acid test when available and evaluate for bacterial vaginosis, candidiasis, gonorrhea, chlamydia, syphilis, and HIV because wet-mount microscopy misses infections and coinfection changes care.",
      "Give the recommended sex-specific oral nitroimidazole regimen and review interactions, tolerance, pregnancy, and adherence because topical metronidazole does not reach all infected genitourinary sites effectively.",
      "Monitor genital discharge, dysuria, pelvic or testicular pain, fever, and symptom resolution while coordinating partner treatment, abstinence through completed therapy, and retesting for eligible women because untreated partners are a major cause of recurrent infection.",
      "Escalate for fever, severe pelvic or testicular pain, pregnancy warning signs, anaphylaxis, neurologic toxicity, or persistent infection without re-exposure because complicated infection or resistance needs urgent specialist review."
    ], [
      "Fever, severe pelvic pain, cervical-motion tenderness, or toxic appearance",
      "Severe testicular pain, swelling, urinary retention, or rapidly worsening genital symptoms",
      "Pregnancy with contractions, bleeding, fluid leakage, fever, or reduced fetal movement",
      "Anaphylaxis, seizure, severe neuropathy, or persistent confirmed infection after adherence"
    ], [
      "Avoid sex until you and current partners finish treatment and symptoms resolve because feeling better before everyone is treated still allows reinfection.",
      "Return for recommended retesting even after symptoms disappear because repeat infection is common and often causes few noticeable symptoms."
    ]),
    card("Drug clearance", ["nih-pk", "fda-clinpharm"], [
      "Identify renal, hepatic, biliary, pulmonary, or extracorporeal elimination routes for the specific drug because total clearance describes removal from plasma and determines maintenance exposure.",
      "Trend creatinine, estimated kidney function, urine output, liver tests, perfusion, albumin, age, weight, and interacting medicines because physiologic change can reduce clearance before toxicity becomes clinically obvious.",
      "Record exact doses, intervals, infusion times, dialysis timing, and concentration sampling because dose rate must match current clearance and extracorporeal removal to avoid accumulation or underexposure.",
      "Monitor drug-specific effectiveness and complications alongside concentrations, ECG, neurologic status, bleeding, glucose, or respiratory rate because calculated clearance cannot replace the patient's observed response.",
      "Escalate for acute kidney or liver failure, anuria, critical concentration, arrhythmia, seizure, major bleeding, or respiratory depression because continued dosing during impaired clearance can compound toxicity."
    ], [
      "Anuria, rapidly rising creatinine, acute jaundice, or severe hepatic encephalopathy",
      "Critical drug concentration or unexpectedly prolonged drug effect",
      "New arrhythmia, seizure, major bleeding, severe hypoglycemia, or respiratory depression",
      "Loss of treatment effect after dialysis, interaction, or major physiologic change"
    ], [
      "Report dehydration, reduced urine, jaundice, new medicines, and dialysis schedule changes because each can change how quickly your body clears a drug.",
      "Never shorten or extend a dosing interval yourself because clearance changes require a medicine-specific adjustment based on effect, laboratories, and timing."
    ]),
    card("Inflammation", ["niehs-inflammation"], [
      "Define the location, trigger, duration, pain, heat, redness, swelling, function loss, fever, and systemic symptoms because inflammation is a response pattern rather than a diagnosis and may be infectious or sterile.",
      "Assess wounds, joints, lungs, abdomen, skin, immune disease, medicines, recent procedures, and exposures because tissue injury, infection, allergy, autoimmunity, crystals, and malignancy activate overlapping inflammatory pathways.",
      "Trend vital signs, examination, blood count, C-reactive protein or erythrocyte sedimentation rate when indicated, organ function, cultures, and imaging because marker changes are nonspecific and meaningful only beside the clinical course.",
      "Deliver cause-directed antimicrobials, anti-inflammatory therapy, source control, rest, movement, or wound care as prescribed because suppressing a protective response without treating its driver can permit hidden progression.",
      "Escalate for hypotension, hypoxemia, rapidly spreading swelling, compartment findings, hot joint with fever, airway symptoms, or organ dysfunction because sepsis, anaphylaxis, ischemia, or destructive inflammation can look initially nonspecific."
    ], [
      "Hypotension, confusion, oliguria, mottling, or rapidly worsening systemic illness",
      "Tongue or throat swelling, wheeze, stridor, hypoxemia, or multisystem allergic symptoms",
      "Rapidly spreading redness, severe pain out of proportion, crepitus, or tense compartment",
      "Hot swollen joint with fever, new neurologic deficit, or acute organ dysfunction"
    ], [
      "Inflammation helps contain injury and start repair, but persistent or misdirected inflammation can damage healthy tissue and needs a cause-specific plan.",
      "Do not assume every raised inflammatory marker means bacterial infection because trauma, autoimmune disease, cancer, and other conditions can raise the same tests."
    ]),
    card("Noncardiogenic pulmonary edema", ["nhlbi-ards", "ncbi-ncpe"], [
      "Assess onset, breathing, oxygenation, hemodynamics, recent transfusion, upper-airway obstruction, aspiration, infection, trauma, neurologic injury, altitude, lung re-expansion, inhalation exposure, and overdose because noncardiogenic edema is a syndrome with several mechanisms rather than another name for ARDS.",
      "Differentiate hydrostatic heart-failure edema from permeability, negative-pressure, neurogenic, high-altitude, transfusion-related, re-expansion, and toxin-associated edema using history, examination, imaging, cardiac assessment, and fluid context because treatment must address the actual pressure or barrier problem.",
      "Provide titrated oxygen and airway support while stopping a suspected transfusion, relieving upper-airway obstruction, initiating altitude descent, treating a neurologic or toxic trigger, or using lung-protective ventilation for ARDS as the cause-specific protocol directs because no single diuretic or ventilator plan treats every subtype.",
      "Trend gases, saturation, work of breathing, airway and ventilator pressures, hemodynamics, urine output, lactate, fluid balance, neurologic status, transfusion timing, and trigger response because recurrence, barotrauma, shock, kidney injury, and multiorgan failure can evolve despite initial oxygen improvement.",
      "Escalate for refractory hypoxemia, exhaustion, altered consciousness, hypotension, rising airway pressure, absent breath sounds, transfusion-associated deterioration, or falling urine output because intubation, pneumothorax, shock, a severe transfusion reaction, or organ failure needs immediate intervention."
    ], [
      "Rapidly worsening hypoxemia, cyanosis, severe work of breathing, or exhaustion",
      "Altered consciousness, inability to protect the airway, or recurrent apnea",
      "Sudden absent breath sounds, hypotension, tracheal shift, or rising ventilator pressure",
      "Acute hypoxemia or bilateral infiltrates developing during or soon after transfusion",
      "Shock, oliguria, rising lactate, arrhythmia, or progressive multiorgan dysfunction"
    ], [
      "Noncardiogenic means elevated left-heart pressure is not the primary explanation; permeability injury, negative pressure, transfusion, altitude, neurologic injury, toxins, or re-expansion can require different immediate treatment.",
      "After severe ARDS or another critical-illness course, report persistent breathlessness, weakness, anxiety, nightmares, or memory problems because rehabilitation may be needed for physical and cognitive recovery."
    ]),
    card("Pharmacokinetics", ["nih-pk", "fda-clinpharm"], [
      "Translate the ordered drug into its absorption, distribution, metabolism, and elimination pathway because formulation, protein binding, tissue volume, enzymes, and clearance determine exposure over time.",
      "Assess age, weight, pregnancy, edema, burns, albumin, gut function, liver and kidney function, perfusion, genetics when relevant, and interactions because patient physiology can alter every pharmacokinetic phase.",
      "Document exact administration, food, tube, infusion, sampling, dialysis, and missed-dose times because interpretable concentrations require a reliable timeline from dose entry to specimen collection.",
      "Trend therapeutic effect, toxicity, concentrations, organ function, fluid state, and disease trajectory because population parameters guide dosing while bedside response shows whether this patient fits them.",
      "Escalate for a critical level, unexpected accumulation, organ failure, severe infusion reaction, respiratory depression, arrhythmia, seizure, or treatment failure because pharmacokinetic change can rapidly make a usual regimen unsafe."
    ], [
      "Critical concentration, unexpected accumulation, or markedly prolonged clinical effect",
      "New acute kidney or liver failure during a renally or hepatically handled drug",
      "Respiratory depression, dangerous arrhythmia, seizure, severe bleeding, or coma",
      "Clinical deterioration despite verified delivery and apparently appropriate dosing"
    ], [
      "Tell clinicians exactly when and how each dose was taken because food, formulation, route, and timing can change the concentration they interpret.",
      "A dose that is usual for one person may be unsafe for another because kidney function, liver function, body composition, and interactions change exposure."
    ]),
    card("Respiratory alkalosis", ["nih-alkalosis"], [
      "Confirm pH, carbon dioxide, bicarbonate, oxygenation, timing, and expected acute or chronic compensation because low carbon dioxide may be primary hyperventilation or compensation for metabolic acidosis.",
      "Assess respiratory effort, pain, fever, pregnancy, altitude, ventilator settings, sepsis, pulmonary embolism, pneumothorax, asthma, neurologic disease, and salicylates because anxiety is a diagnosis of exclusion in dangerous presentations.",
      "Trend blood gases, respiratory rate, saturation, ECG, potassium, ionized calcium, lactate, mental status, and cause-specific findings because alkalemia can reduce cerebral blood flow and provoke paresthesias, spasm, or dysrhythmia.",
      "Treat hypoxemia, pain, fever, sepsis, obstruction, toxin exposure, or excessive mechanical ventilation as ordered and coach calm breathing only after urgent causes are assessed because paper-bag rebreathing can worsen hidden hypoxia.",
      "Escalate for chest pain, syncope, hypoxemia, focal deficit, seizure, severe alkalemia, shock, suspected embolism, or salicylate toxicity because the underlying cause, not the low carbon dioxide itself, often determines mortality."
    ], [
      "Chest pain, syncope, hemoptysis, unilateral leg swelling, or suspected pulmonary embolism",
      "Hypoxemia, severe respiratory distress, absent breath sounds, or ventilator instability",
      "Confusion, focal neurologic deficit, seizure, severe headache, or recent head injury",
      "Tinnitus, vomiting, fever, mixed acid-base pattern, or suspected salicylate toxicity"
    ], [
      "Do not breathe into a paper bag unless a clinician specifically directs it because hidden lung or clot disease may already be limiting oxygen.",
      "Tingling and hand spasm can come from rapid carbon-dioxide loss, but new chest pain, fainting, or neurologic symptoms still need urgent evaluation."
    ]),
    card("Urine anion gap and renal ammonium response", ["nih-ammonia"], [
      "Confirm persistent metabolic acidosis with a normal serum anion gap using serum electrolytes and a blood gas before using urine indices because the urine anion gap answers a narrow renal-response question, not whether acidemia exists.",
      "Collect simultaneous fresh urine sodium, potassium, chloride, pH, and when available osmolality or ammonium because mismatched samples and delayed handling make indirect renal ammonium estimates unreliable.",
      "Check and interpret the urine anion gap, calculated as urine sodium plus potassium minus chloride, in clinical context because a negative value usually suggests appropriate ammonium-chloride excretion whereas a nonnegative value may suggest impaired renal acid secretion.",
      "Trend the serum anion gap, bicarbonate, chloride, potassium, creatinine, urine output, and volume status while checking for diarrhea, urinary diversion, ketoanions, toxins, antibiotics, and bicarbonate therapy because a mixed acid-base disorder or unusual urinary anion can invalidate or reverse the expected urine-gap relationship.",
      "Escalate for severe acidemia, hyperkalemia, arrhythmia, weakness, shock, acute kidney injury, or toxic ingestion because definitive stabilization and cause treatment must not wait for a surrogate urine calculation."
    ], [
      "Severe acidemia, rapidly falling bicarbonate, Kussmaul breathing, or altered consciousness",
      "Hyperkalemia with weakness, conduction change, arrhythmia, or ECG abnormality",
      "Oliguria, rapidly rising creatinine, shock, or progressive acute kidney injury",
      "Suspected toxin, ketoacidosis, salicylate exposure, or mixed acid-base disorder"
    ], [
      "The urine anion gap's central limitation is that it indirectly estimates ammonium response rather than measuring ammonium itself, so it is not a standalone diagnosis and must be interpreted with blood results and the clinical cause.",
      "A positive result does not automatically prove renal tubular acidosis because low urine sodium, kidney failure, medicines, and unmeasured urine ions can mislead the calculation."
    ]),
    card("Basal cell carcinoma", ["nci-skin"], [
      "Document lesion site, size, borders, ulceration, bleeding, growth, recurrence, sun exposure, immune suppression, prior radiation, and neurologic symptoms because anatomic location and behavior determine local-risk classification.",
      "Protect the biopsy or treatment site, label specimens accurately, and verify pathology and margin results because basal cell carcinoma is confirmed histologically and incomplete clearance permits locally destructive recurrence.",
      "Coordinate excision, Mohs surgery, curettage, topical treatment, radiation, or systemic therapy according to risk because superficial low-risk lesions and recurrent facial tumors require different margin control.",
      "Monitor wound healing, infection, pain, nerve or eye function, treatment toxicity, new lesions, and scheduled skin examinations because metastasis is rare but local invasion and additional skin cancers remain clinically important.",
      "Escalate for uncontrolled bleeding, orbital or neurologic symptoms, rapidly enlarging destructive lesion, severe wound infection, or systemic-treatment toxicity because advanced local disease can threaten critical structures despite low metastatic risk."
    ], [
      "Uncontrolled lesion or postoperative bleeding despite sustained direct pressure",
      "Vision change, eye-movement limitation, facial weakness, numbness, or severe focal pain",
      "Rapidly enlarging ulceration, exposed cartilage or bone, or destructive recurrent lesion",
      "Fever, purulent wound, spreading cellulitis, severe drug reaction, or organ toxicity"
    ], [
      "A basal cell cancer rarely spreads far, but it can destroy nearby tissue if ignored, so complete treatment and margin follow-up still matter.",
      "Use broad-spectrum sun protection and examine your skin regularly because prior basal cell carcinoma signals increased risk for additional sun-related cancers."
    ]),
    card("Diverticulosis", ["niddk-diverticular"], [
      "Clarify whether diverticula were incidental or associated with chronic pain, bowel change, or prior bleeding because uncomplicated diverticulosis is not the same condition as acute diverticulitis.",
      "Assess stool pattern, fiber and fluid intake, activity, smoking, obesity, NSAIDs, anticoagulants, and comorbidities because bowel pressure and medication-related bleeding influence future complications.",
      "Support gradual dietary fiber, adequate individualized hydration, movement, and bowel regularity as advised because softer stool reduces straining while abrupt fiber increases bloating and discomfort.",
      "Trend abdominal symptoms, bowel movements, hemoglobin, orthostasis, visible blood, fever, and medication exposure because diverticular bleeding can be painless and inflammation can develop after a stable period.",
      "Escalate for significant rectal bleeding, syncope, severe or localized abdominal pain, fever, persistent vomiting, rigidity, or obstruction because hemorrhage or diverticulitis with perforation requires urgent evaluation."
    ], [
      "Large-volume rectal bleeding, clots, dizziness, syncope, tachycardia, or hypotension",
      "New severe left-lower abdominal pain with fever or chills",
      "Rigid abdomen, rebound tenderness, distention, or rapidly worsening generalized pain",
      "Persistent vomiting, inability to pass stool or gas, dehydration, or confusion"
    ], [
      "Diverticulosis means pouches are present and often causes no symptoms, whereas fever with focal pain suggests inflammation that needs reassessment.",
      "Nuts, seeds, and popcorn do not require routine avoidance; build a tolerable high-fiber pattern gradually unless your clinician gives different instructions."
    ]),
    card("Glomerulonephritis", ["niddk-glomerular", "nhlbi-vasculitis"], [
      "Assess recent infection, autoimmune symptoms, medicines, edema, weight, blood pressure, urine color, output, rash, joints, lungs, and neurologic status because glomerular inflammation may be kidney-limited or part of systemic disease.",
      "Trend urinalysis and sediment, protein quantification, creatinine, estimated GFR, potassium, bicarbonate, albumin, blood count, complement, and cause-specific serologies because pattern and trajectory guide biopsy urgency and therapy.",
      "Measure strict intake, output, daily weight, edema, lung sounds, oxygenation, and blood pressure because sodium retention and falling filtration can produce pulmonary edema, hyperkalemia, or hypertensive encephalopathy.",
      "Administer cause-directed antibiotics, immunosuppression, blood-pressure therapy, diuretics, electrolyte management, or kidney-replacement preparation as ordered because treatment differs fundamentally among postinfectious, autoimmune, and rapidly progressive forms.",
      "Escalate for oliguria, rapidly rising creatinine, hemoptysis, hypoxemia, severe hypertension, hyperkalemic ECG change, seizure, or pulmonary edema because rapidly progressive glomerulonephritis can destroy kidney function within days."
    ], [
      "Oliguria or anuria with rapidly rising creatinine or severe fluid overload",
      "Hemoptysis, falling hemoglobin, worsening oxygenation, or pulmonary hemorrhage concern",
      "Severe hypertension with headache, visual change, confusion, seizure, or chest pain",
      "Hyperkalemia, ECG change, severe acidemia, or symptomatic uremia"
    ], [
      "Report dark or foamy urine, reduced output, swelling, breathlessness, or coughing blood promptly because kidney and lung injury can progress together.",
      "Avoid nonprescription anti-inflammatory medicines and unapproved supplements because reduced filtration and immune treatment make kidney injury and interactions more likely."
    ]),
    card("Hypotension", ["aha-hypotension"], [
      "Repeat blood pressure with correct cuff and position, compare baseline and orthostatic values, and assess symptoms because one low number may be normal whereas a symptomatic trend suggests inadequate perfusion.",
      "Evaluate airway, breathing, pulse, mental status, skin, capillary refill, urine output, bleeding, fever, pain, fluid loss, cardiac symptoms, pregnancy, and medicines because shock has hemorrhagic, distributive, cardiogenic, obstructive, and medication causes.",
      "Place the patient safely, prevent falls, obtain vascular access and ordered ECG, laboratories, cultures, imaging, fluids, blood, vasopressors, or antidotes because stabilization must occur alongside identification of the cause.",
      "Trend mean pressure, heart rate, mental status, urine output, lactate, oxygenation, lung sounds, and response to each intervention because raising pressure without restoring organ perfusion or avoiding overload is incomplete treatment.",
      "Activate emergency response for syncope, confusion, chest pain, dyspnea, active bleeding, pregnancy concern, cool mottled skin, oliguria, or persistent low pressure because these findings indicate threatened brain, heart, kidney, or fetal perfusion."
    ], [
      "Altered consciousness, syncope, seizure, or new focal neurologic deficit",
      "Chest pain, acute dyspnea, cyanosis, arrhythmia, or signs of pulmonary embolism",
      "Active major bleeding, rigid abdomen, postpartum hemorrhage, or suspected internal hemorrhage",
      "Cool mottled skin, weak pulses, oliguria, rising lactate, or persistent shock"
    ], [
      "Rise slowly and sit or lie down when dizzy because falls can occur before the underlying blood-pressure problem is corrected.",
      "Seek urgent help for fainting, confusion, chest pain, breathing trouble, bleeding, or cold clammy skin because symptoms matter more than a single threshold."
    ]),
    card("Lung cancer", ["nci-lung", "nci-small-cell-lung"], [
      "Assess cough, hemoptysis, dyspnea, chest or bone pain, voice, swallowing, weight, performance status, smoking exposure, neurologic symptoms, and psychosocial needs because local growth, metastases, and paraneoplastic effects shape immediate care.",
      "Verify tissue type, stage, molecular alterations, immune-marker results, imaging, and treatment intent because surgery, radiation, targeted therapy, immunotherapy, and chemotherapy depend on biologic classification rather than the word cancer alone.",
      "Monitor oxygenation, airway, blood count, renal and hepatic function, electrolytes, nutrition, pain, infection, thrombosis, and regimen-specific toxicities because disease and multimodal treatment can impair several organs simultaneously.",
      "Support smoking cessation without blame, pulmonary rehabilitation, vaccination, symptom control, advance-care planning, and early palliative care because quality, function, and treatment tolerance improve when supportive needs are addressed alongside tumor control.",
      "Escalate for massive or increasing hemoptysis, stridor, severe hypoxemia, facial or neck swelling, new focal deficit, cord-compression symptoms, febrile neutropenia, or severe immune toxicity because airway, vascular, neurologic, and treatment emergencies are time-critical."
    ], [
      "Large-volume hemoptysis, airway obstruction, stridor, or rapidly worsening hypoxemia",
      "Facial or neck swelling, venous distention, severe headache, or superior vena cava syndrome",
      "New weakness, seizure, confusion, severe back pain, or bowel or bladder dysfunction",
      "Fever with neutropenia, severe diarrhea, hepatitis, pneumonitis, myocarditis, or other treatment toxicity"
    ], [
      "Ask what type, stage, biomarkers, and treatment goal apply to your tumor because these details determine which therapies can work.",
      "Call the oncology team for fever, worsening breathlessness, coughing blood, new neurologic symptoms, or severe treatment effects because waiting can close a safe treatment window."
    ]),
    card("Nephrotic syndrome", ["niddk-nephrotic"], [
      "Assess edema distribution, daily weight, blood pressure, urine output and foam, dyspnea, infection, thrombosis symptoms, diabetes, autoimmune disease, medicines, and malignancy risk because nephrotic syndrome is a protein-loss pattern with many causes.",
      "Trend urine protein, albumin, creatinine, electrolytes, lipids, blood count, glucose, cause-specific studies, and biopsy results when ordered because severity and etiology determine prognosis and immunosuppressive decisions.",
      "Manage sodium and individualized fluid intake, skin protection, mobility, diuretics, renin-angiotensin blockade, lipid therapy, anticoagulation, or immunosuppression as prescribed because edema control must be balanced against intravascular depletion and treatment risks.",
      "Monitor leg asymmetry, chest symptoms, temperature, abdominal pain, kidney function, urine output, orthostasis, and medication toxicity because urinary immunoglobulin and anticoagulant-protein loss increases infection and thrombosis while diuresis can reduce perfusion.",
      "Escalate for sudden dyspnea, pleuritic pain, unilateral swelling, fever, peritonitic pain, oliguria, pulmonary edema, or shock because embolism, severe infection, acute kidney injury, or volume complication can progress rapidly."
    ], [
      "Sudden dyspnea, pleuritic chest pain, hemoptysis, syncope, or hypoxemia",
      "Unilateral leg swelling, severe flank pain, hematuria, or suspected venous thrombosis",
      "Fever, rigid or severely tender abdomen, hypotension, or toxic appearance",
      "Oliguria, rapidly rising creatinine, severe edema with respiratory compromise, or shock"
    ], [
      "Weigh yourself under similar conditions and report rapid gain, falling urine, breathlessness, fever, or one swollen leg because these trends reveal fluid, kidney, infection, or clot complications.",
      "Do not change diuretics, fluids, protein supplements, or anti-inflammatory medicines independently because edema can coexist with low effective circulating volume and fragile kidney perfusion."
    ]),
    card("Sleep apnea", ["nhlbi-sleep"], [
      "Assess snoring, witnessed pauses, gasping, morning headache, nocturia, sleep duration, daytime sleepiness, driving risk, opioid use, heart disease, neurologic disease, and airway anatomy because obstructive and central apnea have different mechanisms.",
      "Review sleep-study apnea type, event index, oxygen burden, sleep stage, position, rhythm, and titration results because severity is not captured by snoring or body size alone.",
      "Fit and support prescribed positive airway pressure, oral appliance, positional plan, weight strategy, or surgical pathway because effective therapy must keep the airway open or correct central instability throughout sleep.",
      "Monitor nightly use, mask leak, skin, dryness, residual events, oxygenation, alertness, blood pressure, rhythm, mood, cognition, and device data because untreated or undertreated apnea contributes to accidents and cardiovascular complications.",
      "Escalate for severe daytime somnolence with unsafe driving, prolonged witnessed apnea with cyanosis, acute cardiorespiratory symptoms, opioid-related hypoventilation, or treatment-emergent central events because immediate ventilation and safety risks may exceed routine sleep follow-up."
    ], [
      "Falling asleep while driving, working at height, or operating dangerous equipment",
      "Prolonged apnea with cyanosis, difficult arousal, seizure-like activity, or collapse",
      "Acute chest pain, arrhythmia, stroke symptoms, severe dyspnea, or heart-failure deterioration",
      "Opioid or sedative exposure with slow breathing, hypoxemia, or altered consciousness"
    ], [
      "Use positive airway pressure for every sleep period, including naps, because untreated events return whenever the airway support is absent.",
      "Do not drive when sleepy and avoid unapproved sedatives or alcohol near bedtime because both impairment and worsened airway collapse can cause fatal harm."
    ]),
    card("Urinary incontinence", ["niddk-incontinence"], [
      "Characterize leakage with cough or effort, urgency, retention, continuous flow, mobility barriers, cognition, onset, volume, nocturia, pain, and bowel pattern because stress, urgency, overflow, functional, and mixed incontinence need different care.",
      "Use a bladder diary and assess urinalysis, postvoid residual when indicated, pelvic or prostate findings, glucose, medicines, fluid timing, constipation, neurologic symptoms, and pregnancy because reversible contributors are common.",
      "Provide prompted or timed voiding, pelvic-floor training with correct muscle identification, mobility access, individualized fluids, and skin protection because continence improves when storage, emptying, access, and tissue integrity are addressed together.",
      "Monitor leak frequency, voided volume, residual, infection symptoms, falls, sleep, skin, dry mouth, constipation, cognition, blood pressure, and retention because medicines and devices can trade leakage for other complications.",
      "Escalate for acute retention, saddle anesthesia, new leg weakness, fever with flank pain, gross hematuria, pelvic mass symptoms, or rapidly worsening kidney function because obstruction, cauda equina, infection, or malignancy needs urgent evaluation."
    ], [
      "Inability to void with painful bladder distention, vomiting, or agitation",
      "Saddle numbness, new leg weakness, back pain, or bowel dysfunction",
      "Fever, flank pain, rigors, hypotension, or acute confusion with urinary symptoms",
      "Gross hematuria, clots, pelvic mass symptoms, or rapidly worsening kidney function"
    ], [
      "Keep a two- or three-day bladder diary because timing, intake, urgency, and activity reveal the subtype more accurately than memory alone.",
      "Do not restrict fluids enough to become dehydrated and do not practice pelvic-floor squeezes while urinating because both strategies can worsen bladder problems."
    ]),
    card("Pulse pressure", ["nih-pulse", "eapc-vascular-ageing"], [
      "Confirm a correctly measured blood pressure, then calculate PP = SBP - DBP in mm Hg because cuff error, movement, pain, and rhythm irregularity can make the calculated gap misleading; for example, 120/80 gives a pulse pressure of 40 mm Hg, about the typical resting value for a young adult.",
      "Recognize less than 25% of SBP as a commonly cited adult narrow criterion, 60 mm Hg or greater as an arterial-stiffness and cardiovascular-risk marker in older adults, and greater than 100 mm Hg as markedly widened because objective criteria are more useful than vague labels when their population and purpose remain explicit.",
      "Do not use any of those numbers as a universal cutoff or stand-alone diagnosis because age, baseline, symptoms, trend, heart rate, stroke volume, arterial stiffness, pregnancy, fever, anemia, valve disease, trauma, and clinical setting change their meaning.",
      "Assess pulses, capillary refill, skin temperature, mental status, urine output, chest symptoms, bleeding, and orthostasis, then trend serial pressure, rhythm, perfusion, fluid balance, hemoglobin, ECG, and cause-specific studies because a narrowing trend may reflect falling forward blood flow.",
      "Escalate a narrow or rapidly narrowing pulse pressure with shock findings, or a newly markedly widened pressure with chest pain, bounding pulses, neurologic deficit, syncope, or pregnancy-emergency symptoms because hemorrhage, pump failure, aortic disease, or severe vascular stress may be present."
    ], [
      "Either pulse pressure less than 25% of SBP or a rapidly narrowing trend, together with tachycardia, cool skin, confusion, oliguria, or other poor-perfusion findings",
      "Markedly widened pulse pressure greater than 100 mm Hg with acute chest or back pain, syncope, bounding pulses, or pulse asymmetry",
      "New neurologic deficit, severe headache, vision change, or seizure",
      "Pregnancy or postpartum symptoms with severe hypertension, bleeding, pain, or collapse"
    ], [
      "Pulse pressure is the top number minus the bottom number. About 40 mm Hg is typical for a resting young adult, but age, pregnancy, symptoms, and the trend change what an unusual gap means.",
      "Bring repeated properly taken readings rather than reacting to one unusual value. The less-than-25%-of-SBP narrow criterion, 60 mm Hg older-adult marker, and greater-than-100 mm Hg markedly widened threshold are clinical clues, not diagnoses by themselves."
    ]),
    card("Sensitivity", ["nih-diagnostic", "nih-clinical-methods-diagnostic"], [
      "Verify and document the target condition, reference standard, population, specimen, threshold, and disease stage for a culture, troponin assay, imaging study, or other test because sensitivity is the proportion of affected people whom that test identifies under specified conditions.",
      "Use a highly sensitive test to help rule out disease only when validated for that setting and obtained at the right time because false negatives persist with early disease, poor sampling, or spectrum differences.",
      "Pair sensitivity with specificity, likelihood ratios, pretest probability, predictive values, and consequences of error before acting on a culture, troponin assay, imaging study, or other test because maximizing detection often increases false positives and downstream testing.",
      "Monitor vital signs, oxygenation, mental status, pain, fever, and objective evidence chosen for the suspected disorder, such as cultures, troponin, or imaging, alongside discordant symptoms, repeat testing, specimen quality, and the final diagnosis because real-world sensitivity can fall when timing, workflow, or patient characteristics differ from the validation study.",
      "Escalate critical symptoms or high-risk exposure despite a negative test, and act on critical positive preliminary results per protocol, because test sensitivity cannot safely overrule immediate clinical danger."
    ], [
      "Life-threatening symptoms despite a negative screening or rapid test",
      "High-risk exposure with testing performed before the validated detection window",
      "Poor, mislabeled, contaminated, delayed, or otherwise invalid specimen",
      "Critical preliminary result requiring isolation, treatment, or urgent confirmation"
    ], [
      "A sensitive test misses fewer affected people, but a negative result is reassuring only when the test fits your timing and clinical situation.",
      "Higher sensitivity does not guarantee that a positive result is true because prevalence, specificity, and confirmatory testing determine that meaning."
    ]),
    card("Attention-deficit/hyperactivity disorder", ["cdc-adhd"], [
      "Document inattention, hyperactivity, impulsivity, onset, duration, impairment, strengths, and examples across home, school, work, and relationships because diagnosis requires persistent functional patterns in more than one context.",
      "Assess sleep, hearing, vision, learning, language, trauma, anxiety, depression, autism, substance use, seizures, thyroid disease, medicines, and environmental stress because many conditions mimic or coexist with ADHD.",
      "Coordinate age-appropriate behavioral training, classroom or workplace accommodations, organizational supports, family education, and prescribed medication because combined environmental and skill supports often improve function beyond medication alone.",
      "Trend target symptoms, school or work function, appetite, growth in children, sleep, blood pressure, pulse, mood, tics, diversion, and adverse effects because dose optimization balances meaningful benefit against harm.",
      "Escalate for suicidality, psychosis, mania, chest pain, syncope, severe hypertension, dangerous impulsivity, substance crisis, or suspected abuse because these findings exceed routine ADHD follow-up."
    ], [
      "Suicidal thinking, self-harm, psychosis, mania, or inability to maintain safety",
      "Chest pain, syncope, sustained palpitations, severe hypertension, or seizure",
      "Severe aggression, dangerous driving, elopement, exploitation, or abuse concern",
      "Medication overdose, diversion, intoxication, withdrawal, or escalating substance use"
    ], [
      "ADHD is diagnosed from persistent impairment across settings, not from one difficult day, one checklist score, or normal childhood energy alone.",
      "Use a shared target list for attention, routines, sleep, appetite, and function because treatment should improve daily life, not merely quiet visible behavior."
    ]),
    card("Chronic venous insufficiency", ["svs-cvi"], [
      "Assess dependent edema, aching, heaviness, itching, varicosities, pigmentation, lipodermatosclerosis, ulcer site, pulses, neuropathy, prior thrombosis, mobility, and heart or kidney disease because venous hypertension overlaps with arterial and systemic edema.",
      "Measure limb and wound size, drainage, skin, pain, and distal perfusion and arrange venous duplex or arterial testing when indicated because compression is helpful for venous disease but unsafe with severe arterial insufficiency.",
      "Apply correctly fitted compression, elevate legs, encourage calf-pump walking, manage weight, and protect moisturized skin as prescribed because external pressure and muscle contraction reduce pooling and venous hypertension.",
      "Monitor ulcer healing, infection, contact dermatitis, pressure injury, adherence, pain, swelling, and device fit because long-term compression works only when tolerated without compromising skin or arterial flow.",
      "Escalate for sudden unilateral swelling, chest pain or dyspnea, cold pulseless foot, rapidly spreading infection, bleeding varicosity, or nonhealing atypical ulcer because thrombosis, embolism, ischemia, sepsis, or malignancy must be excluded."
    ], [
      "Sudden unilateral leg swelling, tenderness, redness, or new venous cord",
      "Sudden dyspnea, pleuritic chest pain, hemoptysis, syncope, or hypoxemia",
      "Cold pale foot, absent pulse, severe rest pain, or tissue necrosis",
      "Fever, spreading cellulitis, uncontrolled varicose bleeding, or atypical nonhealing ulcer"
    ], [
      "Wear prescribed compression during waking hours and report numbness, severe pain, color change, or skin injury because fit and arterial circulation determine safety.",
      "Walk and flex your ankles regularly because the calf muscles act as a pump that helps venous blood move against gravity."
    ]),
    card("Diverticulitis", ["niddk-diverticular"], [
      "Assess focal abdominal pain, fever, bowel change, nausea, vomiting, urinary symptoms, prior episodes, immune status, pregnancy, and medication risks because severity and complication risk determine outpatient versus hospital care.",
      "Trend vital signs, tenderness, guarding, blood count, kidney function, hydration, oral tolerance, and ordered imaging because abscess, perforation, obstruction, or fistula can emerge despite initially localized symptoms.",
      "Provide prescribed analgesia, short-term diet modification, fluids, antibiotics when indicated, and bowel rest or drainage support because uncomplicated disease and complicated infection require different treatment intensity.",
      "Monitor improvement, stool and gas passage, pain trajectory, fever, urine output, medication effects, and postepisode follow-up because failure to improve suggests an abscess, alternative diagnosis, or need for surgery.",
      "Escalate for generalized or rigid abdomen, sepsis, persistent vomiting, obstruction, significant bleeding, worsening pain, immunocompromised status with decline, or treatment failure because perforation and uncontrolled infection are time-critical."
    ], [
      "Rigid abdomen, rebound tenderness, generalized severe pain, or free-air concern",
      "Hypotension, confusion, rigors, rising lactate, or other sepsis findings",
      "Persistent vomiting, marked distention, or inability to pass stool or gas",
      "Worsening focal pain or fever despite treatment, significant bleeding, or abscess concern"
    ], [
      "Follow the temporary diet plan and advance foods as symptoms improve because prolonged unnecessary restriction can reduce nutrition without preventing recurrence.",
      "After recovery, discuss gradual fiber, activity, smoking, weight, and medication risks because long-term prevention differs from the short-term plan during acute inflammation."
    ]),
    card("Eczema", ["niams-eczema"], [
      "Assess morphology, distribution, itch, sleep loss, age, atopy, exposures, infection, treatment history, and quality-of-life effect because eczema includes barrier and inflammatory disorders whose pattern guides therapy.",
      "Use lukewarm brief bathing, fragrance-free cleanser, immediate thick moisturizer, trigger reduction, and nail or scratch protection because restoring the barrier lowers water loss, allergen entry, fissuring, and itch amplification.",
      "Apply prescribed topical steroid or nonsteroid by body site, potency, amount, and duration and support phototherapy or systemic therapy monitoring because undertreatment sustains inflammation while misuse causes avoidable toxicity.",
      "Trend affected area, itch, sleep, skin pain, weeping, crusting, fever, eye symptoms, growth in children, and treatment-specific laboratories because bacterial infection, eczema herpeticum, and systemic drug complications require early recognition.",
      "Escalate for rapidly spreading painful monomorphic blisters, punched-out erosions, eye involvement, fever, extensive skin failure, or spreading cellulitis because eczema herpeticum, ocular infection, or sepsis needs urgent antiviral or antimicrobial care."
    ], [
      "Rapidly spreading painful uniform blisters or punched-out erosions with fever",
      "Eye pain, photophobia, eyelid vesicles, vision change, or facial spread",
      "Spreading warmth and redness, purulent drainage, red streaks, or systemic toxicity",
      "Extensive peeling, dehydration, temperature instability, or severe medication reaction"
    ], [
      "Moisturize immediately after bathing and whenever skin feels dry because sealing water into the barrier reduces cracks, itching, and flare frequency.",
      "Use each prescription on the named location and schedule because eyelids, folds, face, and thick body skin require different strengths and safety limits."
    ]),
    card("Gout", ["acr-gout"], [
      "Assess onset, joint distribution, fever, wound or procedure, medicines, kidney disease, alcohol, diet, prior crystals, and immunosuppression because gout and septic arthritis can present with the same hot painful joint.",
      "Obtain synovial fluid for crystals and culture when diagnosis is uncertain or infection is possible because serum urate may be normal during a flare and crystals do not exclude coinfection.",
      "Give prescribed colchicine, NSAID, or glucocorticoid early with renal, gastrointestinal, bleeding, glucose, and interaction checks because rapid inflammation control improves pain while drug risks differ substantially.",
      "Continue established urate-lowering therapy during most flares, monitor adherence, serum urate, renal function, tophi, and attack frequency because sustained target urate dissolves crystals whereas symptom-only treatment does not.",
      "Escalate for toxic appearance, rapidly spreading erythema, prosthetic-joint symptoms, inability to tolerate fluids, severe drug toxicity, or neurovascular compromise because septic arthritis and treatment complications can destroy joint or organ function."
    ], [
      "Hot swollen joint with fever, rigors, hypotension, or toxic appearance",
      "Prosthetic joint pain and swelling or recent surgery, injection, or bacteremia",
      "Rapidly spreading cellulitis, open wound, severe pain out of proportion, or crepitus",
      "Severe diarrhea or vomiting, bleeding, acute kidney injury, cytopenia, or drug rash"
    ], [
      "Do not stop allopurinol during an ordinary flare unless your clinician directs it because stopping lets urate rise again, promotes continued crystal deposition, and does not treat the current inflammation.",
      "Long-term urate lowering prevents crystal reaccumulation; diet can help but usually cannot replace prescribed therapy when recurrent gout is established."
    ]),
    card("Legg-Calve-Perthes disease", ["aaos-perthes"], [
      "Assess limp, hip or referred knee pain, range of motion, abduction, internal rotation, leg length, activity, and symptom duration because femoral-head ischemia may present as painless limping rather than obvious hip pain.",
      "Coordinate serial bilateral hip imaging and record age, disease stage, femoral-head involvement, containment, and growth remaining because remodeling potential and collapse risk determine treatment choices.",
      "Support prescribed activity restriction, protected weight bearing, physical therapy, bracing, casting, or surgery because maintaining motion and acetabular containment helps the softened head remodel more spherically.",
      "Monitor pain, gait, joint motion, muscle strength, device fit, skin, neurovascular status, school participation, and adherence because prolonged staged treatment can cause stiffness, weakness, pressure injury, and psychosocial burden.",
      "Escalate for acute inability to bear weight, severe pain after injury, fever with hip pain, cool numb foot, device-related skin breakdown, or rapid motion loss because fracture, infection, vascular compromise, or accelerated collapse needs urgent review."
    ], [
      "Acute inability to bear weight, deformity, or severe pain after trauma",
      "Fever with severe hip pain, toxic appearance, or painful limited passive motion",
      "Cool pale foot, absent pulse, progressive numbness, or severe swelling",
      "Rapid loss of hip motion, worsening collapse, or brace or cast skin injury"
    ], [
      "Knee pain can come from the hip, so persistent limping or thigh and knee pain still requires a full hip examination.",
      "Follow weight-bearing and motion instructions through every stage because the femoral head is temporarily weak and shape preservation affects adult arthritis risk."
    ]),
    card("Osteoarthritis", ["niams-oa"], [
      "Assess pain pattern, brief morning stiffness, swelling, alignment, range, strength, gait, falls, sleep, mood, work, and activity goals because osteoarthritis severity is defined by function and symptoms, not imaging alone.",
      "Screen for hot joint, prolonged inflammatory stiffness, trauma, crystal disease, infection, referred pain, and neurologic findings because new or atypical features should not be attributed automatically to degenerative change.",
      "Build individualized strengthening, aerobic activity, range work, weight management when relevant, footwear, braces, and assistive devices because stronger muscles and lower mechanical load improve stability and daily function.",
      "Monitor analgesic benefit, blood pressure, kidney and gastrointestinal risk, falls, injection response, pain interference, and functional milestones because medication harm can outweigh modest relief unless goals are explicit.",
      "Escalate for acutely hot swollen joint, fever, inability to bear weight after injury, neurovascular change, rapidly progressive loss of function, or severe medication toxicity because infection, fracture, ischemia, or bleeding requires urgent evaluation."
    ], [
      "Hot swollen joint with fever, rigors, or severe pain on passive movement",
      "Acute deformity, inability to bear weight, or suspected fracture after injury",
      "Cold pale limb, absent pulse, new weakness, or progressive sensory loss",
      "Gastrointestinal bleeding, acute kidney injury, severe hypertension, or drug reaction"
    ], [
      "Regular appropriately dosed movement protects function and usually does not wear the joint out faster because muscles absorb load and reduce instability.",
      "Imaging changes and pain do not always match, so treatment should target the activities, sleep, mobility, and participation that matter most to you."
    ]),
    card("Peripheral arterial disease", ["aha-pad"], [
      "Assess exertional and rest pain, walking distance, wounds, color, temperature, capillary refill, pulses, neuropathy, smoking, diabetes, kidney disease, and cardiovascular symptoms because limb ischemia and systemic atherosclerotic risk must be addressed together.",
      "Obtain ankle-brachial or toe pressures and vascular imaging when indicated while comparing both limbs because calcified arteries can make ankle readings falsely high and anatomy guides revascularization.",
      "Support antiplatelet and lipid therapy, blood-pressure and diabetes control, smoking cessation, structured walking, and preventive foot care because these measures reduce heart, brain, and limb events while improving collateral function.",
      "Inspect feet and footwear, monitor wounds, exercise response, pulses, perfusion, medication effects, and postprocedure access sites because neuropathy can hide tissue loss and intervention can cause bleeding or acute occlusion.",
      "Activate vascular emergency care for sudden severe pain, pallor, an absent pulse, paresthesia, paralysis, or a cold limb, as well as rapidly worsening rest pain, spreading gangrene or infection, or major access-site bleeding, because acute limb ischemia has a short revascularization window."
    ], [
      "Sudden severe limb pain, pallor, pulselessness, paresthesia, paralysis, or coldness",
      "Rapidly spreading gangrene, wet necrosis, crepitus, fever, or sepsis",
      "New nonhealing wound with rest pain, exposed tissue, or progressive ischemic color change",
      "Postprocedure expanding hematoma, absent distal pulse, hypotension, or severe bleeding"
    ], [
      "Inspect both feet every day and never walk barefoot because reduced blood flow and sensation can let a small injury become limb-threatening.",
      "A structured walking plan may cause temporary claudication but promotes better function; stop and seek urgent care for sudden pain, coldness, numbness, or weakness."
    ]),
    card("Renal cell carcinoma", ["nci-renal"], [
      "Assess hematuria, flank pain or mass, weight, fever, blood pressure, anemia or polycythemia symptoms, bone pain, respiratory symptoms, and performance status because renal tumors can bleed, spread, or produce systemic effects.",
      "Verify histology, stage, contralateral kidney, renal function, hereditary risk, imaging, and treatment intent because surveillance, ablation, partial nephrectomy, radical nephrectomy, and systemic therapy depend on oncologic and nephron considerations.",
      "After local treatment, monitor urine output, creatinine, bleeding, pain, wound, fever, blood pressure, respiratory status, and venous thrombosis because nephrectomy and ablation can cause hemorrhage, kidney injury, infection, or embolic complications.",
      "During targeted or immune therapy, trend blood pressure, thyroid, liver, kidney, blood count, skin, bowel, lung, endocrine, and cardiac findings because toxicities may reflect vascular inhibition or immune inflammation in any organ.",
      "Escalate for heavy hematuria with clots, hypotension, acute flank swelling, anuria, sudden dyspnea, new neurologic deficit, severe immune toxicity, or uncontrolled hypertension because hemorrhage, obstruction, embolism, metastasis, or treatment injury can be life-threatening."
    ], [
      "Heavy hematuria with clots, urinary obstruction, tachycardia, syncope, or hypotension",
      "Anuria, rapidly rising creatinine, acute flank swelling, or severe electrolyte disturbance",
      "Sudden dyspnea, pleuritic pain, hypoxemia, unilateral swelling, or suspected embolism",
      "Severe diarrhea, pneumonitis, hepatitis, endocrine crisis, myocarditis, or neurologic change"
    ], [
      "Know whether surgery removed part or all of a kidney and keep renal-function follow-up because preserving remaining nephron function affects medicines, blood pressure, and long-term health.",
      "Report visible blood, falling urine, new breathlessness, severe diarrhea, jaundice, or neurologic change promptly because cancer and immune therapy can cause urgent complications."
    ]),
    card("Rotator cuff tear", ["aaos-rotator"], [
      "Assess traumatic onset, night pain, active and passive motion, strength, lag, neck symptoms, sensation, pulses, occupation, sport, and dominant arm because tear size, chronicity, and alternative neurologic causes affect treatment.",
      "Arrange appropriate radiographs, ultrasound, or MRI and document functional weakness because imaging must be matched to examination rather than treating common age-related tendon findings alone.",
      "Use prescribed analgesia, activity modification, ice, and progressive physical therapy focused on motion, scapular control, and cuff strength because protected loading restores function while avoiding stiffness and repeated overload.",
      "Monitor pain, sleep, range, strength, work tasks, medication effects, injection response, and postrepair wound and neurovascular status because persistent weakness, stiffness, infection, or retear changes the plan.",
      "Escalate for acute traumatic inability to raise the arm, deformity, numb or pulseless limb, fever with a hot shoulder, or postoperative drainage and sudden weakness because fracture-dislocation, nerve injury, infection, or repair failure needs urgent review."
    ], [
      "Sudden inability to actively raise the arm after trauma, deformity, severe weakness, or suspected fracture-dislocation",
      "Cool pale hand, absent pulse, progressive numbness, or new motor deficit",
      "Hot swollen shoulder with fever, severe passive-motion pain, or toxic appearance",
      "Postoperative drainage, wound opening, fever, sudden pop, or abrupt strength loss"
    ], [
      "Keep the shoulder moving only within the prescribed range because too little motion causes stiffness while premature loading can enlarge a tear or disrupt repair.",
      "A tear on imaging does not automatically require surgery; pain, weakness, age, activity demands, trauma, and response to rehabilitation guide that decision."
    ]),
    card("Wilson disease", ["niddk-wilson"], [
      "Assess liver symptoms, tremor, dystonia, speech, swallowing, gait, behavior, mood, hemolysis, medicines, adherence, and family history because copper accumulation can present through hepatic, neurologic, psychiatric, or hematologic injury.",
      "Trend liver tests, bilirubin, INR, blood count, creatinine, urinalysis, ceruloplasmin, serum and timed urine copper, and slit-lamp or neurologic findings because no single measurement alone defines control.",
      "Administer chelator or zinc at the prescribed timing relative to food and other medicines and monitor vitamin, blood, kidney, and neurologic effects because absorption and adverse reactions determine whether lifelong copper control succeeds.",
      "Coordinate liver, neurology, nutrition, mental-health, pregnancy, surgery, and first-degree-relative screening because treatment changes across organ involvement while presymptomatic relatives can avoid irreversible damage.",
      "Escalate for jaundice with coagulopathy, confusion, hypoglycemia, hemolysis, rapidly worsening movement or swallowing, suicidality, or acute kidney injury because these emergencies need immediate specialist care, with urgent transplant-center transfer when acute liver failure is present."
    ], [
      "Jaundice, rising INR, hypoglycemia, confusion, bleeding, or acute liver failure",
      "Rapid hemolysis with severe anemia, dark urine, tachycardia, or kidney injury",
      "Rapidly worsening dystonia, inability to swallow, aspiration, falls, or respiratory compromise",
      "Suicidal behavior, psychosis, severe drug rash, cytopenia, or nephrotoxicity"
    ], [
      "Treatment must continue for life even when tests normalize because stopping allows copper to reaccumulate and can trigger sudden liver failure.",
      "Separate zinc or chelators from food and other medicines exactly as instructed because poor timing can prevent adequate absorption and copper control."
    ]),
    card("Alpha-gal syndrome", ["cdc-alpha"], [
      "Ask about delayed hives, swelling, gastrointestinal symptoms, breathing difficulty, dizziness, mammalian meat, dairy, gelatin, medicines, vaccines, exercise, alcohol, and tick bites because reactions often begin hours after exposure and vary between episodes.",
      "Document the personal reaction pattern and correlate it with alpha-gal specific IgE and allergist assessment because a positive sensitization test without compatible history does not define clinical syndrome.",
      "Review foods, restaurant preparation, gelatin, mammal-derived excipients, biologic products, implants, and planned procedures with pharmacy and allergy teams because hidden exposure risk is individualized and no simple universal product list is complete.",
      "Teach epinephrine use, emergency follow-up, label reading, cross-contact prevention, and tick-bite protection and monitor nutrition and anxiety because avoidance must prevent anaphylaxis without creating unnecessary restriction or deficiency.",
      "Give epinephrine and activate emergency care for airway swelling, wheeze, hypotension, syncope, or rapidly progressive multisystem symptoms because delayed onset does not make alpha-gal anaphylaxis less life-threatening."
    ], [
      "Tongue or throat swelling, hoarse voice, stridor, wheeze, or severe dyspnea",
      "Hypotension, syncope, confusion, cyanosis, or rapidly progressive weakness",
      "Hives or swelling with vomiting, diarrhea, respiratory, or cardiovascular symptoms",
      "Reaction during medication, vaccine, biologic, implant, or perioperative exposure"
    ], [
      "Carry prescribed epinephrine and seek emergency care after using it because symptoms can recur and antihistamines cannot reverse airway or circulatory anaphylaxis.",
      "Prevent new tick bites and review each new medicine or procedure because additional bites may reactivate sensitivity and some mammal-derived ingredients are not obvious."
    ]),
    card("Benign paroxysmal positional vertigo", ["aao-bppv"], [
      "Characterize brief position-triggered spinning, latency, duration, nystagmus, hearing symptoms, headache, neurologic findings, falls, medicines, and vascular risk because classic BPPV must be distinguished from stroke, vestibular neuritis, and other causes.",
      "Perform or assist with the appropriate Dix-Hallpike or supine roll test when safe and observe eye movement because the affected canal and side determine the correct repositioning maneuver.",
      "Deliver the canal-specific repositioning maneuver and provide short-term fall precautions rather than routine prolonged vestibular suppressants because moving otoconia treats the mechanism while sedatives delay compensation and increase falls.",
      "Monitor positional symptoms, nystagmus, gait, nausea, recurrence, and function after treatment because persistent or atypical findings require another canal maneuver, vestibular rehabilitation, or diagnostic evaluation.",
      "Escalate for inability to stand, continuous severe vertigo, new headache or neck pain, focal deficit, gaze-evoked direction-changing nystagmus without head-position change, a persistent vertical or pure torsional pattern inconsistent with the tested canal, sudden hearing loss, or syncope because posterior circulation stroke and other emergencies can mimic BPPV."
    ], [
      "New diplopia, dysarthria, facial weakness, limb weakness, numbness, or severe ataxia",
      "Continuous severe vertigo, inability to stand, central-pattern nystagmus, or new severe headache",
      "Sudden unilateral hearing loss, severe ear pain, or new neurologic auditory symptoms",
      "Syncope, chest pain, palpitations, major trauma, or anticoagulated head injury"
    ], [
      "BPPV causes brief spinning with particular head movements because loose inner-ear crystals stimulate the wrong motion sensor; repositioning moves them out.",
      "Sit before standing and use support until balance is reliable because even brief attacks can cause serious falls, especially at night."
    ]),
    card("Brief psychotic disorder", ["nimh-psychosis"], [
      "Assess hallucinations, delusions, disorganization, catatonia, onset, duration, baseline, mood, sleep, trauma, postpartum status, substances, medicines, neurologic symptoms, and collateral history because brief psychosis is diagnosed only after medical and competing psychiatric causes are excluded.",
      "Perform suicide, homicide, command-hallucination, self-care, exploitation, firearm, child or dependent, and elopement risk assessment because impaired reality testing can create danger even without stated intent.",
      "Use calm nonconfrontational communication, low stimulation, clear choices, hydration and sleep support, and prescribed medication because arguing about beliefs increases distress while therapeutic structure supports stabilization.",
      "Monitor vital signs, cognition, intake, sleep, behavior, movement disorders, QT risk, metabolic effects, and response over time because delirium, intoxication, mania, and medication toxicity may become clearer longitudinally.",
      "Activate emergency psychiatric and medical care for dangerous commands, suicidality, violence, inability to eat or drink, severe agitation, catatonia, fever with rigidity, postpartum rapid decline, or focal neurologic findings because immediate safety and reversible causes take priority."
    ], [
      "Suicidal or homicidal plan, dangerous command hallucinations, weapon access, or escalating violence",
      "Inability to eat, drink, sleep, shelter, or protect self or dependents",
      "Catatonia, fever, severe rigidity, autonomic instability, seizure, or reduced consciousness",
      "Postpartum rapid deterioration, intoxication or withdrawal, focal deficit, or suspected delirium"
    ], [
      "Psychosis is a symptom needing prompt medical assessment, not proof of a lifelong disorder, because substances, illness, mood episodes, and short-lived conditions can look similar.",
      "Reduce stimulation, avoid arguing about the belief, and seek emergency help when safety is uncertain because calm support works better than confrontation during impaired reality testing."
    ]),
    card("Loading dose", ["nih-pk", "fda-clinpharm"], [
      "Verify indication, target concentration, weight scalar, volume of distribution, bioavailability, route, prior exposure, and maximum label dose because a loading dose rapidly fills the apparent distribution space rather than replacing maintenance dosing.",
      "Review age, pregnancy, obesity, edema, shock, burns, albumin, renal and hepatic function, heart disease, and interactions because altered distribution changes the appropriate load while clearance mainly shapes subsequent maintenance.",
      "Use independent calculation and product-concentration checks, divide or slow the dose when protocol requires, and document exact completion time because large front-loaded doses magnify arithmetic and infusion errors.",
      "Monitor vital signs, ECG, neurologic status, infusion site, hypersensitivity, target effect, concentration timing, and organ-specific toxicity because adverse effects can occur before the first maintenance dose.",
      "Stop or escalate for anaphylaxis, hypotension, arrhythmia, seizure, severe sedation, respiratory depression, extravasation, or calculation discrepancy because a loading-dose error delivers a large exposure before correction is possible."
    ], [
      "Anaphylaxis, airway swelling, wheeze, hypotension, or rapidly spreading reaction",
      "Dangerous arrhythmia, severe bradycardia, chest pain, syncope, or cardiac arrest",
      "Seizure, profound sedation, respiratory depression, coma, or acute neurologic decline",
      "Major calculation mismatch, wrong concentration or route, extravasation, or overdose concern"
    ], [
      "A loading dose reaches an effective concentration quickly, while later maintenance doses replace what your body clears; they serve different purposes.",
      "Do not repeat a loading dose after vomiting, delay, or uncertainty unless a clinician verifies what was absorbed because accidental duplication can be toxic."
    ]),
    card("Bacterial vaginosis", ["cdc-bv"], [
      "Assess thin discharge, odor, irritation, pregnancy, sexual history, douching, recent therapy, pelvic symptoms, and self-treatment because history alone cannot reliably separate bacterial vaginosis from candidiasis, trichomoniasis, cervicitis, or noninfectious causes.",
      "Confirm symptomatic disease with validated clinical, microscopy, Gram-stain, or nucleic-acid criteria as appropriate because Gardnerella culture and cervical cytology are not specific diagnostic tests.",
      "Give the prescribed oral or intravaginal regimen and review pregnancy, allergies, interactions, and product effects on barrier contraception because route, formulation, and obstetric context change safe use.",
      "Monitor symptom resolution, recurrence, adherence, adverse effects, pregnancy outcomes, and recommended HIV or STI testing because recurrence is common and BV is associated with reproductive and infection risks.",
      "Escalate for fever, severe pelvic or abdominal pain, pregnancy warning signs, hypotension, spreading rash, anaphylaxis, or persistent symptoms despite treatment because uncomplicated dysbiosis should not cause systemic or upper-tract illness."
    ], [
      "Fever, severe pelvic pain, cervical-motion tenderness, vomiting, or toxic appearance",
      "Pregnancy with contractions, bleeding, fluid leakage, fever, or reduced fetal movement",
      "Hypotension, syncope, confusion, or rapidly worsening systemic illness",
      "Anaphylaxis, severe drug rash, or persistent recurrent symptoms after appropriate therapy"
    ], [
      "Complete the prescribed regimen and avoid douching because disrupting the vaginal ecosystem can worsen dysbiosis and recurrence rather than cleaning an infection away.",
      "BV is a change in vaginal bacterial balance, not proof of infidelity, and routine treatment of male partners is generally not recommended by current guidance."
    ]),
    card("Sjogren syndrome", ["niams-sjogren"], [
      "Assess daily eye and mouth dryness, gritty pain, vision, swallowing, dental disease, gland swelling, fatigue, joints, skin, nerves, lungs, kidneys, medicines, and autoimmune history because Sjogren disease can extend beyond moisture glands.",
      "Coordinate objective tear, ocular-surface, salivary-flow, dental, antibody, and selected gland studies because symptoms or antibodies alone are insufficient and common medicines can mimic dryness.",
      "Provide preservative-free tears, nighttime ointment, saliva support, fluoride and dental prevention, hydration, humidification, and prescribed systemic therapy because surface protection prevents corneal injury, caries, candidiasis, and functional loss.",
      "Monitor eye integrity, teeth, oral infection, gland size, weight, blood count, kidney and liver function, urinalysis, pulmonary and neurologic symptoms, and treatment toxicity because systemic disease and lymphoma risk require longitudinal surveillance.",
      "Escalate for acute painful red eye or vision change, inability to swallow fluids, breathing decline, neurologic deficit, renal tubular complications, persistent asymmetric gland enlargement, night sweats, or weight loss because corneal damage, organ disease, or lymphoma needs urgent evaluation."
    ], [
      "Acute eye pain, severe redness, photophobia, corneal injury, or vision change",
      "Inability to swallow liquids, aspiration, severe dehydration, or rapidly worsening oral infection",
      "New dyspnea, focal neurologic deficit, severe weakness, arrhythmia, or renal electrolyte disturbance",
      "Persistent asymmetric gland enlargement, firm lymph nodes, night sweats, fever, or weight loss"
    ], [
      "Use frequent preservative-free tears when needed and seek urgent eye care for pain, redness, light sensitivity, or vision change because dry corneas can ulcerate.",
      "Brush with fluoride, floss, use saliva-support strategies, and keep dental visits because reduced saliva removes less acid and greatly increases cavities and oral infection."
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
  const targetEntries = activePathologyEntries();

  if (!targetEntries.length) {
    unresolved.push({ name: "__database__", matchCount: 0, reason: "ANI_PATHOLOGY_DATABASE.diseases unavailable" });
  } else {
    patches.forEach((patch) => {
      const target = normalizePrimary(patch.name);
      const matches = targetEntries.filter((entry) => normalizePrimary(canonicalPrimary(entry)) === target);
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

  if (database && typeof database === "object") {
    const referenceMap = new Map((Array.isArray(database.sourceReferences) ? database.sourceReferences : [])
      .map((reference) => [String(reference && (reference.key || reference.id) || "").trim(), reference])
      .filter(([key]) => key));
    sources.filter((source) => ["nih-pulse", "eapc-vascular-ageing"].includes(source.id)).forEach((source) => {
      referenceMap.set(source.id, {
        key: source.id,
        label: source.label,
        url: source.url,
        note: source.note
      });
    });
    database.sourceReferences = Array.from(referenceMap.values());
  }

  const names = patches.map((patch) => patch.name);
  window.ANI_PATHOLOGY_NURSING_WAVE32_B = {
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
