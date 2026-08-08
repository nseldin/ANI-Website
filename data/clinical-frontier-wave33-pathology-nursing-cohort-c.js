(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  const VERSION = "2026-07-19-wave33-pathology-nursing-c-1";
  const COHORT = "C";

  function activePathologyEntries() {
    if (typeof pathologyDiseases !== "undefined" && Array.isArray(pathologyDiseases)) return pathologyDiseases;
    return database && Array.isArray(database.diseases) ? database.diseases : [];
  }

  const sources = [
    { id: "fda-clinpharm", label: "FDA, Clinical Pharmacology Section of Prescription Drug Labeling", url: "https://www.fda.gov/media/74346/download?attachment=", note: "Supports drug-specific interpretation of clearance, capacity-limited metabolism, concentration changes, interactions, organ function, and the need to use the individual medicine's labeling rather than a generic pharmacokinetic rule." },
    { id: "ncbi-pk", label: "NCBI Bookshelf, Pharmacokinetics", url: "https://www.ncbi.nlm.nih.gov/books/NBK557744/", note: "Supports absorption, distribution, metabolism, elimination, clearance, half-life, steady state, saturation, and clinically contextual monitoring of drug exposure." },
    { id: "niddk-hemodialysis", label: "NIDDK, Hemodialysis", url: "https://www.niddk.nih.gov/health-information/kidney-disease/kidney-failure/hemodialysis", note: "Supports dry-weight assessment, ultrafiltration and fluid removal, access protection, treatment adequacy, symptom surveillance, and prevention of intradialytic hypotension or chronic volume overload." },
    { id: "aha-stroke-2026", label: "American Heart Association, 2026 Guideline for Early Management of Acute Ischemic Stroke", url: "https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke", note: "Supports rapid stroke recognition, last-known-well, glucose and imaging assessment, thrombolysis, thrombectomy, stroke-unit nursing, neurologic surveillance, swallow safety, cause evaluation, and secondary prevention." },
    { id: "aha-stroke-top", label: "American Heart Association, 2026 Acute Ischemic Stroke Guideline: Top Things to Know", url: "https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke/top-things-to-know", note: "Supports practical time-sensitive reperfusion pathways, eligible extended-window treatment, individualized blood-pressure management, and organized multidisciplinary stroke care." },
    { id: "cdc-heroin", label: "Centers for Disease Control and Prevention, Heroin", url: "https://www.cdc.gov/overdose-prevention/about/heroin.html", note: "Supports heroin-specific overdose risk, unpredictable fentanyl contamination, infectious complications, opioid use disorder, harm reduction, naloxone readiness, and nonstigmatizing treatment linkage." },
    { id: "cdc-overdose", label: "Centers for Disease Control and Prevention, Overdose Prevention", url: "https://www.cdc.gov/overdose-prevention/prevention/index.html", note: "Supports opioid-overdose recognition, risk reduction, emergency response, polysubstance danger, treatment connection, and prevention after a nonfatal overdose." },
    { id: "cdc-naloxone", label: "Centers for Disease Control and Prevention, Reversing Opioid Overdose with Naloxone", url: "https://www.cdc.gov/overdose-prevention/reversing-overdose/index.html", note: "Supports immediate naloxone administration, emergency-service activation, rescue breathing, repeat dosing, observation for recurrent toxicity, and household overdose planning." },
    { id: "samhsa-oud", label: "SAMHSA, TIP 63: Medications for Opioid Use Disorder", url: "https://store.samhsa.gov/product/tip-63-medications-opioid-use-disorder-full-document/pep21-02-01-002", note: "Supports opioid intoxication and withdrawal assessment, buprenorphine-precipitated withdrawal prevention, methadone and naltrexone care, overdose prevention, continuity, and recovery-oriented follow-up." },
    { id: "iasp-pain", label: "International Association for the Study of Pain, Pain Terminology", url: "https://www.iasp-pain.org/resources/terminology/", note: "Supports distinctions among nociception, pain, sensitization, hyperalgesia, and endogenous modulation, with multidimensional, mechanism-informed assessment rather than treating pain intensity as a complete explanation." },
    { id: "aes-epilepsy", label: "American Epilepsy Society, Clinical Guidance", url: "https://www.aesnet.org/clinical-care/clinical-guidance", note: "Supports antiseizure-medication safety, seizure first aid, rescue planning, status-epilepticus recognition, treatment adherence, and clinically meaningful monitoring around synaptic-vesicle targets." },
    { id: "ncbi-levetiracetam", label: "NCBI Bookshelf, Levetiracetam", url: "https://www.ncbi.nlm.nih.gov/books/NBK499890/", note: "Supports SV2A binding as levetiracetam's principal antiseizure mechanism, renal dose considerations, behavioral adverse effects, concentration context, and seizure-response monitoring." },
    { id: "aan-parkinson", label: "American Academy of Neurology, Dopaminergic Therapy for Motor Symptoms in Early Parkinson Disease", url: "https://www.aan.com/Guidelines/home/GuidelineDetail/1048", note: "Supports individualized levodopa-based therapy, medication adverse-effect surveillance, and shared decisions that provide context for later motor fluctuations and dose-timing review." },
    { id: "parkinson-motor", label: "Parkinson's Foundation, Managing Off Time", url: "https://www.parkinson.org/library/fact-sheets/managing-off-time", note: "Supports recognition of predictable wearing-off and unpredictable on-off periods, medication-timing and meal review, symptom diaries, fall prevention, and specialist-guided regimen adjustment." },
    { id: "ncbi-metabolic-acidosis", label: "NCBI Bookshelf, Anion Gap and Non-Anion Gap Metabolic Acidosis", url: "https://www.ncbi.nlm.nih.gov/books/NBK448090/", note: "Supports pH, bicarbonate, respiratory compensation, anion-gap and non-gap classification, cause-directed testing, and urgent management of shock, toxins, renal failure, ketoacidosis, and electrolyte complications." },
    { id: "ncbi-lactic-acidosis", label: "NCBI Bookshelf, Lactic Acidosis", url: "https://www.ncbi.nlm.nih.gov/books/NBK470202/", note: "Supports differentiation of hypoperfusion-related and nonhypoxic hyperlactatemia, serial lactate interpretation, source treatment, perfusion reassessment, and recognition of severe acidemia or organ failure." },
    { id: "ncbi-cell-injury", label: "NCBI Bookshelf, Cell Injury and Death", url: "https://www.ncbi.nlm.nih.gov/books/NBK557627/", note: "Supports oxygen-delivery failure, reversible and irreversible ischemic injury, reperfusion injury, cause-directed restoration of perfusion, and the distinction between ischemia as a mechanism and a site-specific diagnosis." },
    { id: "acr-gout", label: "American College of Rheumatology, Gout", url: "https://rheumatology.org/patients/gout", note: "Supports hyperuricemia as a risk state rather than synonymous with gout, flare recognition, urate-lowering treatment adherence, medication and kidney-risk review, and lifestyle counseling without blame." },
    { id: "nci-breast", label: "National Cancer Institute, Breast Cancer Treatment PDQ", url: "https://www.cancer.gov/types/breast/hp/breast-treatment-pdq", note: "Supports tissue diagnosis, stage and biomarker-directed treatment, surgical and systemic-therapy care, lymphedema precautions, toxicity surveillance, symptom control, and recurrence evaluation." },
    { id: "endocrine-cushing", label: "Endocrine Society, Treatment of Cushing's Syndrome Guideline", url: "https://www.endocrine.org/clinical-practice-guidelines/treatment-of-cushing-syndrome", note: "Supports confirmation and cause-directed treatment of hypercortisolism, cardiovascular and infection-risk management, perioperative glucocorticoid planning, and surveillance for adrenal insufficiency or recurrence." },
    { id: "nice-endometriosis", label: "NICE, Endometriosis: Diagnosis and Management", url: "https://www.nice.org.uk/guidance/ng73", note: "Supports symptom-based recognition, respectful pain assessment, empiric and surgical pathways, fertility discussion, longitudinal review, and urgent evaluation when symptoms suggest another acute pelvic process." },
    { id: "cdc-molluscum", label: "Centers for Disease Control and Prevention, About Molluscum Contagiosum", url: "https://www.cdc.gov/molluscum-contagiosum/about/index.html", note: "Supports typical lesion recognition, transmission reduction, avoidance of lesion trauma, natural resolution, treatment indications, and evaluation of extensive disease or secondary infection." },
    { id: "nhlbi-aplastic", label: "National Heart, Lung, and Blood Institute, Aplastic Anemia", url: "https://www.nhlbi.nih.gov/health/anemia/aplastic-anemia", note: "Supports pancytopenia recognition, marrow-failure evaluation, infection and bleeding precautions, transfusion and transplant pathways, immunosuppressive treatment, and emergency response to fever or hemorrhage." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const patches = [
    card("Capacity-limited elimination", ["fda-clinpharm", "ncbi-pk"], [
      "Identify the exact medicine, dose, formulation, timing, organ function, interacting drugs, and recent changes because capacity-limited elimination is drug-specific and cannot safely be inferred from a pathway name alone.",
      "Explain that elimination becomes saturated when concentration exceeds available metabolic or transport capacity because a small additional dose can then produce a disproportionate rise in exposure and toxicity.",
      "Trend ordered drug concentrations, dose and sample times, neurologic status, vital signs, liver tests, and treatment response because nonlinear accumulation can be mistaken for disease progression or ordinary dose dependence.",
      "Administer doses at consistent times and prevent unsupervised extra or catch-up doses because irregular intake obscures concentration interpretation and may abruptly exceed the body's elimination capacity.",
      "Escalate for a level above the medicine-specific critical threshold, new ataxia, nystagmus, confusion, seizure, dysrhythmia, hypotension, or respiratory depression because saturated elimination can convert a modest dosing change into severe toxicity."
    ], [
      "Drug concentration above the laboratory or prescribing protocol's critical treatment threshold",
      "New ataxia, nystagmus, slurred speech, confusion, seizure, or reduced consciousness",
      "New dysrhythmia, hypotension, syncope, respiratory slowing, or severe oxygen desaturation",
      "Rapid toxicity after a dose increase, interaction, organ failure, or formulation change"
    ], [
      "Take each dose exactly as prescribed and never double a missed dose because nonlinear elimination can make a small excess unexpectedly dangerous.",
      "Keep laboratory appointments and record dose and blood-draw times because an accurately timed concentration is essential for interpreting exposure."
    ]),
    card("Circle of Willis and cerebral arterial territories", ["aha-stroke-2026"], [
      "Map sudden weakness, sensory loss, language change, neglect, visual loss, ataxia, and cranial-nerve findings to anterior or posterior arterial territories because localization accelerates recognition without replacing emergency brain and vascular imaging.",
      "Document exact last-known-well, baseline function, anticoagulants, recent surgery, glucose, and blood pressure because reperfusion eligibility depends on time, hemorrhage risk, metabolic exclusion, and physiologic safety.",
      "Activate the stroke pathway and prepare noncontrast brain plus vascular imaging because collateral connections in the Circle of Willis vary and clinical deficits cannot prove whether an artery remains occluded.",
      "Monitor level of consciousness, pupils, speech, gaze, visual fields, limb strength, sensation, coordination, and NIH Stroke Scale trend because extension, edema, hemorrhage, or collateral failure may change the vascular pattern rapidly.",
      "Escalate immediately for any new focal deficit, NIH Stroke Scale increase, declining consciousness, unequal pupils, severe headache, repeated vomiting, or seizure because large-vessel occlusion, hemorrhage, and rising intracranial pressure require urgent reassessment."
    ], [
      "Sudden aphasia, neglect, gaze deviation, hemiparesis, visual loss, or severe ataxia",
      "NIH Stroke Scale increase or recurrence of a previously resolved focal deficit",
      "Declining consciousness, unequal pupils, posturing, or inability to protect the airway",
      "Thunderclap headache, repeated vomiting, seizure, or severe uncontrolled hypertension"
    ], [
      "Call emergency services for any sudden focal neurologic change because arterial territory knowledge is useful only when treatment begins quickly.",
      "Do not give food, drink, aspirin, or extra blood-pressure medicine before evaluation because swallowing safety, hemorrhage, and reperfusion eligibility remain unknown."
    ]),
    card("Dialysis ultrafiltration, target weight, and volume management", ["niddk-hemodialysis"], [
      "Compare pre-dialysis weight with the individualized post-dialysis target, recent intake, edema, lung sounds, blood pressure, and symptoms because prescribed ultrafiltration should remove accumulated fluid without depleting circulating volume.",
      "Verify treatment duration, ultrafiltration goal and rate, dialysate prescription, access function, and interval weight gain because shortened treatment or an unrealistic fluid goal increases both overload and intradialytic instability.",
      "Monitor blood pressure, pulse, cramps, nausea, dizziness, chest symptoms, consciousness, access pressures, and machine alarms throughout treatment because rapid plasma-volume decline can cause hypotension, ischemia, and inadequate dialysis.",
      "Respond to symptomatic hypotension according to the dialysis protocol, reassess the ultrafiltration goal, and position safely because continuing fluid removal despite poor perfusion can injure the heart, brain, and residual kidney function.",
      "Escalate for systolic pressure below the unit threshold with symptoms, chest pain, severe dyspnea, new hypoxemia, altered consciousness, dysrhythmia, absent access thrill, or refractory cramping because shock, pulmonary edema, cardiac ischemia, or access failure needs immediate intervention."
    ], [
      "Symptomatic hypotension below the dialysis unit's treatment threshold or recurrent syncope",
      "Severe dyspnea, new hypoxemia, frothy sputum, crackles, or hypertensive pulmonary edema",
      "Chest pain, new dysrhythmia, altered consciousness, seizure, or focal neurologic deficit",
      "Absent access thrill, uncontrolled access bleeding, machine blood leak, or suspected air embolism"
    ], [
      "Follow the individualized sodium and fluid plan between treatments because large interval gains require faster removal and increase cramps, hypotension, and cardiac strain.",
      "Record daily weights under similar conditions and report a persistent change because true target weight changes with nutrition, illness, and residual kidney function."
    ]),
    card("Dominant versus nondominant hemisphere stroke localization", ["aha-stroke-2026"], [
      "Determine handedness and baseline language while assessing speech, comprehension, repetition, naming, neglect, gaze, visual fields, affect, and bilateral strength because hemisphere dominance varies and aphasia differs fundamentally from inattention.",
      "Treat sudden aphasia, neglect, visuospatial failure, or behavioral change as a stroke emergency because apparently conversational or subtle cortical deficits can still represent a disabling large-vessel occlusion.",
      "Use short commands, yes-or-no choices, demonstration, communication boards, and scanning cues matched to the deficit because language impairment and neglect require different support despite similar bedside misunderstanding.",
      "Monitor NIH Stroke Scale trend, consciousness, language, attention, gaze, fields, motor function, swallowing, and safety awareness because edema or infarct extension can broaden a previously localized hemispheric syndrome.",
      "Escalate for new or worsening aphasia, neglect, gaze deviation, weakness, NIH Stroke Scale increase, reduced consciousness, severe headache, vomiting, or seizure because recurrent ischemia, hemorrhagic transformation, and swelling require emergency imaging."
    ], [
      "Sudden aphasia, profound neglect, forced gaze deviation, or new unilateral weakness",
      "NIH Stroke Scale increase or rapid loss of language, attention, or safety awareness",
      "Reduced consciousness, unequal pupils, posturing, or inability to protect the airway",
      "Severe headache, repeated vomiting, seizure, or new hypertension with neurologic decline"
    ], [
      "Difficulty speaking does not mean loss of intelligence, so allow response time and offer supported ways to communicate.",
      "Approach a person with neglect from the attended side initially, then practice guided scanning because unrecognized hazards increase falls and injury."
    ]),
    card("Hemispatial neglect", ["aha-stroke-2026"], [
      "Assess visual, tactile, auditory, and personal-space inattention with extinction testing, line cancellation, grooming, eating, mobility, and safety tasks because neglect is an attention disorder that may persist despite intact primary sensation.",
      "Differentiate neglect from hemianopia, aphasia, delirium, weakness, and poor vision because each problem changes communication, rehabilitation, environmental setup, and the meaning of an apparently missed stimulus.",
      "Place essential items on the attended side during acute care, supervise mobility and meals, and introduce structured scanning toward the neglected side because awareness failure creates collision, fall, and malnutrition risks.",
      "Monitor attention, NIH Stroke Scale components, meal completion, skin and limb protection, transfers, collisions, and rehabilitation response because fluctuating neglect may signal neurologic change and causes preventable functional injury.",
      "Escalate for sudden-onset neglect, worsening inattention, new weakness or aphasia, NIH Stroke Scale increase, reduced consciousness, severe headache, vomiting, or seizure because acute stroke, hemorrhage, edema, or recurrent ischemia requires immediate reassessment."
    ], [
      "New hemispatial neglect, extinction, gaze preference, or failure to recognize one side",
      "Worsening neglect with new weakness, aphasia, visual loss, or NIH Stroke Scale increase",
      "Reduced consciousness, unequal pupils, repeated vomiting, seizure, or posturing",
      "Repeated collisions, falls, unrecognized limb injury, aspiration, or inability to complete meals"
    ], [
      "Neglect is reduced awareness, not stubbornness, so calm cueing and repeated scanning practice are more useful than criticism.",
      "Turn the head and eyes systematically toward the affected side before eating or moving because hazards may not enter awareness automatically."
    ]),
    card("Heroin", ["cdc-heroin", "cdc-naloxone", "samhsa-oud"], [
      "Assess breathing rate and depth, oxygenation, consciousness, pupils, circulation, temperature, trauma, co-ingestants, pregnancy, injection sites, and last use because heroin can cause fatal respiratory depression and infectious or traumatic complications.",
      "Give naloxone immediately for suspected opioid respiratory depression, support ventilation, and activate emergency services because heroin potency is unpredictable and fentanyl contamination may require repeated rescue doses.",
      "Monitor respiratory effort, sedation, oxygen saturation, end-tidal carbon dioxide when available, naloxone response, withdrawal, and recurrent toxicity because naloxone may wear off before the opioid effect ends.",
      "Use nonstigmatizing language, screen for opioid use disorder and infection risk, and offer medication treatment, sterile-use services, vaccination, and testing because survival improves when the underlying disorder and exposure harms are addressed.",
      "Escalate for fewer than eight effective breaths per minute, apnea, cyanosis, inability to awaken, recurrent sedation, chest rigidity, hypotension, seizure, fever with murmur, or a painful swollen limb because overdose, fentanyl toxicity, endocarditis, or deep infection needs emergency care."
    ], [
      "Apnea, fewer than eight effective breaths per minute, cyanosis, or inability to awaken",
      "Recurrent respiratory depression or sedation after an initial naloxone response",
      "Hypotension, chest pain, seizure, severe agitation, hyperthermia, or suspected polysubstance toxicity",
      "Fever with murmur, spreading injection-site redness, severe limb pain, or neurologic deficit"
    ], [
      "Carry naloxone, teach companions to use it, and call emergency services after every dose because breathing can slow again after temporary improvement.",
      "Avoid using alone or mixing opioids with alcohol, benzodiazepines, or sedatives because combined respiratory suppression greatly increases fatal overdose risk."
    ]),
    card("Homonymous hemianopia and visual-field localization", ["aha-stroke-2026"], [
      "Test each visual field by confrontation with one eye covered, compare both sides, and assess pupils, acuity, gaze, neglect, reading, and onset because retrochiasmal field loss differs from monocular eye disease and inattention.",
      "Activate emergency stroke evaluation for sudden homonymous field loss and document last-known-well, glucose, anticoagulants, headache, and associated deficits because an isolated visual deficit may still qualify as disabling cerebral ischemia.",
      "Keep pathways uncluttered, place items within the seeing field initially, supervise mobility, and teach deliberate head and eye scanning because lost field awareness causes collisions, falls, and unsafe driving.",
      "Monitor visual-field pattern, gaze, pupils, headache, NIH Stroke Scale trend, reading, mobility, swallowing, and new neurologic findings because extension, edema, hemorrhage, or seizure may alter the original localization.",
      "Escalate for sudden or expanding field loss, new weakness or aphasia, NIH Stroke Scale increase, painful red eye, unequal pupils, severe headache, vomiting, or reduced consciousness because stroke progression and ocular or intracranial emergencies need urgent differentiation."
    ], [
      "Sudden loss of the same side of vision in both eyes or abrupt navigation difficulty",
      "Expanding field loss with weakness, aphasia, neglect, gaze deviation, or ataxia",
      "Severe headache, repeated vomiting, unequal pupils, seizure, or reduced consciousness",
      "Painful red eye, abrupt monocular blindness, flashing lights, or a curtain-like visual loss"
    ], [
      "Do not drive until formally cleared because homonymous field loss can hide vehicles, pedestrians, and hazards despite normal central acuity.",
      "Practice systematic scanning toward the missing field before walking, reading, or reaching because compensation must become deliberate before it becomes reliable."
    ]),
    card("Internal capsule and corticospinal tract stroke localization", ["aha-stroke-2026"], [
      "Assess face, arm, and leg strength separately, pronator drift, tone, reflexes, sensation, speech clarity, eye movements, language, and coordination because dense proportional weakness can localize to compact descending fibers while cortical signs suggest another site.",
      "Document exact onset and activate the stroke pathway even when weakness is the only finding because a small internal-capsule infarct can produce profound disability and remains time sensitive.",
      "Support the weak shoulder, position joints neutrally, protect insensate skin, and use assisted transfers with fall precautions because early traction, pressure, and unsafe movement cause avoidable pain and injury.",
      "Monitor NIH Stroke Scale trend, limb strength, speech, swallowing, consciousness, blood pressure, glucose, and mobility tolerance because evolving infarction, edema, aspiration, or recurrent ischemia can worsen an initially pure motor syndrome.",
      "Escalate for new or worsening hemiparesis, NIH Stroke Scale increase, dysphagia with aspiration, reduced consciousness, severe headache, vomiting, seizure, or respiratory compromise because stroke progression, hemorrhage, and airway failure require immediate reassessment."
    ], [
      "Sudden dense weakness affecting the face, arm, and leg on one side",
      "Progressive motor deficit, NIH Stroke Scale increase, or recurrent fluctuating weakness",
      "Coughing, wet voice, inability to handle secretions, aspiration, or oxygen decline",
      "Reduced consciousness, severe headache, repeated vomiting, seizure, or unequal pupils"
    ], [
      "Call emergency services for sudden one-sided weakness even without pain or speech change because a small deep stroke can be severely disabling.",
      "Never pull on the weak arm during transfers because unsupported traction can injure the shoulder before protective muscle control returns."
    ]),
    card("Intravenous thrombolysis for acute ischemic stroke", ["aha-stroke-2026", "aha-stroke-top"], [
      "Verify disabling deficit, last-known-well, glucose, emergency imaging result, blood pressure, anticoagulants, platelets, recent surgery or bleeding, and protocol contraindications because thrombolysis benefit depends on rapid selection while hemorrhage risk remains individualized.",
      "Record baseline neurologic findings, weight, vital signs, intravenous access, and all treatment milestones before administering the prescribed thrombolytic because precise dosing and time documentation support safe reperfusion care.",
      "Monitor neurologic examination and blood pressure at protocol intervals, airway, oxygenation, headache, nausea, bleeding, and puncture sites because intracranial hemorrhage, angioedema, and systemic bleeding may emerge during or after treatment.",
      "Avoid unnecessary invasive procedures, intramuscular injections, and antithrombotic medicines until the post-treatment pathway permits them because accelerated fibrin breakdown makes fresh tissue trauma and overlapping anticoagulation hazardous.",
      "Stop the infusion when applicable and escalate immediately for NIH Stroke Scale increase, severe headache, vomiting, acute hypertension, tongue swelling, stridor, hypotension, or major bleeding because symptomatic intracranial hemorrhage and orolingual angioedema require emergency imaging and treatment."
    ], [
      "NIH Stroke Scale increase, new deficit, severe headache, vomiting, or acute hypertension",
      "Tongue or lip swelling, stridor, drooling, wheeze, or inability to handle secretions",
      "Hemodynamic instability, rapidly falling hemoglobin, hematemesis, melena, or uncontrolled bleeding",
      "Reduced consciousness, unequal pupils, seizure, posturing, or acute respiratory compromise"
    ], [
      "Report any new headache, weakness, nausea, mouth swelling, or bleeding immediately because these may be early treatment complications.",
      "Do not take aspirin, anticoagulants, or unapproved medicines after thrombolysis because the stroke team must first confirm post-treatment bleeding safety."
    ]),
    card("Ischemic stroke", ["aha-stroke-2026", "aha-stroke-top"], [
      "Identify sudden focal neurologic deficits, establish exact last-known-well and baseline function, check glucose, and activate emergency stroke transport because viable threatened brain is lost as arterial occlusion persists.",
      "Prepare noncontrast brain and vascular imaging while obtaining anticoagulant, bleeding, surgery, medication, and comorbidity history because hemorrhage exclusion and vessel status determine safe thrombolysis and thrombectomy pathways.",
      "Maintain nothing-by-mouth status until swallowing is screened, position and protect weak limbs, and prevent fever, hypoxia, and severe glucose disturbance because aspiration and physiologic stress expand secondary injury.",
      "Monitor NIH Stroke Scale trend, consciousness, pupils, blood pressure, rhythm, oxygenation, glucose, swallowing, temperature, urine, and reperfusion complications because edema, hemorrhagic transformation, recurrent ischemia, and atrial fibrillation can change care quickly.",
      "Escalate for NIH Stroke Scale increase, declining consciousness, unequal pupils, severe headache, repeated vomiting, seizure, airway compromise, aspiration, or blood pressure outside the treatment-specific target because progression, swelling, hemorrhage, and loss of reperfusion eligibility are time critical."
    ], [
      "Sudden aphasia, facial droop, unilateral weakness, visual loss, neglect, or severe ataxia",
      "NIH Stroke Scale increase, recurrent deficit, or rapid neurologic deterioration",
      "Declining consciousness, unequal pupils, posturing, severe headache, or repeated vomiting",
      "Aspiration, inability to protect the airway, severe hypoxemia, seizure, or unstable blood pressure"
    ], [
      "Call emergency services for sudden neurologic symptoms even when they resolve because transient improvement does not exclude an unstable cerebral artery.",
      "Do not drive to the hospital or eat, drink, or take aspirin first because emergency transport and imaging preserve treatment options safely."
    ]),
    card("Lacunar stroke", ["aha-stroke-2026"], [
      "Assess pure motor weakness, pure sensory loss, sensorimotor deficit, dysarthria-clumsy hand, ataxic hemiparesis, and absence of cortical signs because small penetrating-artery infarcts often produce recognizable deep syndromes.",
      "Activate the same emergency stroke pathway used for larger infarcts and document last-known-well because lacunar appearance cannot exclude hemorrhage or large-vessel disease before imaging.",
      "Review chronic blood pressure, diabetes, smoking, lipids, sleep apnea, antithrombotic use, and medication adherence because small-vessel injury reflects cumulative vascular exposure and secondary prevention must address its drivers.",
      "Monitor NIH Stroke Scale trend, strength, sensation, speech, coordination, swallowing, blood pressure, glucose, and mobility because early neurologic deterioration, aspiration, and falls may occur despite a small imaging lesion.",
      "Escalate for progressive weakness, recurrent deficits, NIH Stroke Scale increase, new aphasia or neglect, reduced consciousness, severe headache, vomiting, or seizure because evolving infarction, an alternative localization, or hemorrhage requires urgent reassessment."
    ], [
      "Sudden pure motor or sensory deficit affecting the face, arm, or leg",
      "Progressive weakness, recurrent fluctuation, or NIH Stroke Scale increase after presentation",
      "New aphasia, neglect, gaze deviation, visual loss, or other unexpected cortical sign",
      "Reduced consciousness, severe headache, repeated vomiting, seizure, or aspiration"
    ], [
      "A small deep infarct can cause major disability, so sudden weakness or numbness still requires immediate emergency care.",
      "Control blood pressure, diabetes, smoking, and lipids consistently because repeated penetrating-artery injury can accumulate into gait and cognitive impairment."
    ]),
    card("Large-vessel occlusion stroke", ["aha-stroke-2026", "aha-stroke-top"], [
      "Recognize severe hemiparesis, aphasia, neglect, forced gaze, visual loss, decreased consciousness, or posterior-circulation signs because proximal arterial occlusion threatens a large brain territory and may need thrombectomy.",
      "Establish last-known-well, baseline independence, glucose, anticoagulants, and transport destination while activating comprehensive stroke capability because vessel imaging and endovascular access should occur without avoidable interfacility delay.",
      "Prepare emergency noncontrast and vascular imaging, intravenous thrombolysis when eligible, and thrombectomy workflow in parallel because one treatment evaluation should not unnecessarily postpone another beneficial reperfusion option.",
      "Monitor NIH Stroke Scale trend, consciousness, pupils, airway, oxygenation, blood pressure, rhythm, glucose, vomiting, and aspiration because edema, collateral failure, hemorrhage, and brainstem dysfunction can cause sudden deterioration.",
      "Escalate immediately for NIH Stroke Scale increase, falling consciousness, unequal pupils, repeated vomiting, seizure, airway failure, or new hemodynamic instability because expanding core, malignant edema, basilar compromise, and hemorrhage demand emergency action."
    ], [
      "Forced gaze with dense hemiparesis, aphasia, neglect, or rapidly rising NIH Stroke Scale",
      "Reduced consciousness, quadriparesis, abnormal eye movements, or inability to protect the airway",
      "Unequal pupils, posturing, severe headache, repeated vomiting, or seizure",
      "New aspiration, severe hypoxemia, unstable blood pressure, dysrhythmia, or treatment-site bleeding"
    ], [
      "Request emergency transport for severe stroke signs because hospitals differ in their ability to perform mechanical thrombectomy quickly.",
      "Record the last time the person was definitely normal because advanced imaging may still identify treatment benefit when onset is uncertain."
    ]),
    card("Mechanical thrombectomy for large-vessel occlusion", ["aha-stroke-2026", "aha-stroke-top"], [
      "Confirm the stroke and endovascular handoff includes last-known-well, baseline function, NIH Stroke Scale, vessel and perfusion imaging, thrombolytic status, anticoagulants, allergies, renal information, and family contact because rapid decisions require a complete risk-and-benefit picture.",
      "Prepare prescribed access, laboratory work, blood pressure control, airway strategy, and transfer without delaying the procedure for nonessential tasks because reperfusion benefit declines as salvageable tissue becomes infarcted.",
      "Keep the treated limb straight as ordered and assess puncture site, distal pulse, color, temperature, capillary refill, pain, and swelling because femoral or radial access complications can cause occult hemorrhage or limb ischemia.",
      "Monitor NIH Stroke Scale trend, consciousness, pupils, blood pressure within the post-reperfusion target, oxygenation, rhythm, glucose, headache, nausea, and urine because hemorrhage, edema, reocclusion, reperfusion injury, and contrast-related complications need early recognition.",
      "Escalate for NIH Stroke Scale increase, severe headache, vomiting, acute hypertension, reduced consciousness, expanding access hematoma, absent distal pulse, hypotension, flank pain, or airway compromise because intracranial hemorrhage and access-site bleeding are time-critical emergencies."
    ], [
      "New neurologic deficit, NIH Stroke Scale increase, severe headache, vomiting, or seizure",
      "Reduced consciousness, unequal pupils, posturing, aspiration, or inability to protect the airway",
      "Expanding access-site hematoma, uncontrolled bleeding, hypotension, or new flank or back pain",
      "Absent distal pulse, cool pale limb, severe access-limb pain, or progressive swelling"
    ], [
      "Keep the access limb in the instructed position and call before getting up because movement can reopen the artery and cause serious bleeding.",
      "Report new weakness, speech change, headache, nausea, groin swelling, numbness, or limb coolness immediately because these can signal reocclusion or procedural complications."
    ]),
    card("Metabolic acidosis", ["ncbi-metabolic-acidosis"], [
      "Assess breathing pattern, perfusion, mental status, glucose, ketones, renal function, diarrhea, medications, toxins, infection, and fluid losses because low bicarbonate reflects multiple mechanisms that require different treatments.",
      "Interpret pH, bicarbonate, carbon dioxide, anion gap, albumin, chloride, lactate, ketones, electrolytes, and expected respiratory compensation together because a near-normal pH can conceal a dangerous mixed acid-base disorder.",
      "Treat the identified driver with prescribed fluids, insulin, perfusion support, toxin antidote, renal replacement, or electrolyte therapy because bicarbonate replacement alone does not stop ongoing acid generation or loss.",
      "Monitor serial blood gas, bicarbonate, anion gap, potassium, glucose, lactate, creatinine, urine output, respiratory effort, rhythm, and consciousness because worsening acidemia impairs circulation while treatment can shift potassium rapidly.",
      "Escalate for pH at or below the unit's critical threshold, rising potassium with electrocardiographic change, shock, deep respiratory fatigue, oliguria, seizure, or suspected toxic ingestion because severe acidemia, dysrhythmia, ventilatory failure, and dialyzable poisoning require urgent intervention."
    ], [
      "Critical acidemia at the laboratory threshold or a rapidly falling arterial pH",
      "Hyperkalemia with peaked T waves, widening QRS, bradycardia, or another dysrhythmia",
      "Hypotension, rising lactate, cool mottled skin, oliguria, or worsening consciousness",
      "Deep breathing with fatigue, seizure, coma, or suspected methanol, ethylene glycol, or salicylate exposure"
    ], [
      "Follow the cause-specific sick-day and medication plan because dehydration, missed insulin, kidney failure, and toxins require very different responses.",
      "Seek urgent care for deep rapid breathing, confusion, persistent vomiting, fainting, or inability to hydrate because severe acidemia can deteriorate quickly."
    ]),
    card("Middle cerebral artery stroke", ["aha-stroke-2026"], [
      "Assess contralateral face and arm greater than leg weakness or sensory loss, gaze preference, aphasia, neglect, and homonymous field loss because the middle cerebral artery supplies lateral motor, sensory, language, and attention networks.",
      "Establish last-known-well, baseline function, glucose, anticoagulant exposure, and stroke severity while activating brain and vascular imaging because proximal MCA occlusion may benefit from thrombolysis, thrombectomy, or both.",
      "Use supported communication for aphasia, structured scanning for neglect, shoulder protection, fall precautions, and nothing-by-mouth status until screening because cortical deficits create immediate communication, injury, and aspiration risks.",
      "Monitor NIH Stroke Scale trend, consciousness, pupils, gaze, language, neglect, strength, swallowing, blood pressure, oxygenation, and headache because large MCA infarction can develop hemorrhagic transformation or malignant edema.",
      "Escalate for NIH Stroke Scale increase, increasing somnolence, unequal pupils, repeated vomiting, severe headache, seizure, posturing, or airway compromise because malignant hemispheric swelling and hemorrhage may require urgent neurosurgical and critical-care treatment."
    ], [
      "Sudden face-arm predominant weakness with aphasia, neglect, gaze deviation, or field loss",
      "NIH Stroke Scale increase, recurrent deficit, or rapid decline in language or attention",
      "Increasing somnolence, unequal pupils, posturing, severe headache, or repeated vomiting",
      "Seizure, aspiration, inability to protect the airway, or severe oxygen desaturation"
    ], [
      "Call emergency services for sudden speech, gaze, face, or arm changes because MCA occlusion can destroy a large brain territory quickly.",
      "Do not assume neglect or aphasia is confusion or unwillingness because targeted communication and scanning support safer recovery."
    ]),
    card("Naloxone response and recurrent opioid toxicity", ["cdc-naloxone", "cdc-overdose"], [
      "Assess effective breathing, oxygenation, consciousness, pupils, pulse, temperature, trauma, co-ingestants, opioid formulation, route, and time because response to naloxone supports opioid toxicity but does not exclude other emergencies.",
      "Administer naloxone promptly, provide rescue breathing or bag-mask ventilation, call emergency services, and repeat dosing per protocol because restoring ventilation matters more than achieving complete wakefulness.",
      "Monitor respiratory rate and depth, sedation score, oxygen saturation, end-tidal carbon dioxide when available, pulse, temperature, and repeated naloxone need because naloxone duration may be shorter than fentanyl, methadone, or extended-release opioid effects.",
      "Position to protect the airway, assess aspiration and pulmonary edema, and manage agitation or vomiting safely because abrupt awakening and withdrawal can create secondary respiratory, behavioral, and injury risks.",
      "Escalate for apnea, fewer than eight effective breaths per minute, recurrent sedation, three or more protocol rescue doses, chest rigidity, severe hypoxemia, hypotension, seizure, or failure to respond because persistent opioid burden, potent synthetic exposure, or another diagnosis needs advanced support."
    ], [
      "Apnea, fewer than eight effective breaths per minute, cyanosis, or severe hypoxemia",
      "Recurrent sedation or respiratory depression after an initial naloxone response",
      "Failure to improve after repeated protocol doses with effective ventilation support",
      "Chest rigidity, aspiration, pulmonary edema, hypotension, seizure, or dangerous agitation"
    ], [
      "Call emergency services after giving naloxone even when the person wakes because respiratory depression can return after naloxone wears off.",
      "Stay with the person, support breathing, and give another dose if symptoms return because observation alone cannot reverse recurrent hypoventilation."
    ]),
    card("Nociception and endogenous pain modulation", ["iasp-pain"], [
      "Distinguish nociception from the conscious experience of pain and assess location, quality, function, mood, sleep, culture, cognition, and prior response because neural threat signaling and lived pain overlap without being identical.",
      "Identify likely nociceptive, neuropathic, nociplastic, inflammatory, ischemic, or visceral mechanisms and screen for dangerous causes because mechanism guides treatment while a familiar pain score must never hide new pathology.",
      "Combine prescribed analgesics with positioning, movement, heat or cold when appropriate, sleep support, reassurance, and cognitive or behavioral strategies because descending inhibitory and facilitatory systems are influenced by context, attention, emotion, and prior experience.",
      "Monitor pain intensity and quality, functional goal, sedation, respiratory rate, bowel function, blood pressure, mood, sleep, and adverse effects because improved participation with tolerable toxicity is more informative than a pain number alone.",
      "Escalate for sudden maximal pain, new neurologic deficit, chest pressure, rigid abdomen, pulseless painful limb, fever with spinal pain, suicidality, or opioid-related respiratory slowing because these named triggers suggest emergencies beyond routine pain modulation."
    ], [
      "Sudden maximal headache, chest pain, tearing back pain, or rigid acute abdomen",
      "New weakness, saddle anesthesia, bladder retention, loss of pulses, or cold painful limb",
      "Fever with focal spinal pain, immunosuppression, hypotension, or worsening consciousness",
      "Suicidal intent, severe sedation, fewer than eight breaths per minute, or cyanosis"
    ], [
      "Pain is real even when tissue damage is not proportional because nervous-system amplification and endogenous modulation can change the experience.",
      "Track activity, sleep, triggers, and treatment effects alongside pain intensity because function reveals whether the overall plan is helping."
    ]),
    card("Opioid intoxication", ["cdc-overdose", "cdc-naloxone", "samhsa-oud"], [
      "Assess arousability, speech, coordination, pupils, respiratory rate and depth, oxygenation, pulse, blood pressure, temperature, glucose, trauma, and co-ingestants because intoxication ranges from mild impairment to evolving respiratory failure.",
      "Remove access to driving, falls, water, additional opioids, alcohol, benzodiazepines, and other sedatives while maintaining calm observation because impaired judgment and combined central nervous system depression create preventable injury.",
      "Support airway and ventilation and give naloxone when breathing becomes inadequate rather than waiting for complete unresponsiveness because hypoventilation can cause irreversible hypoxic injury before cyanosis is obvious.",
      "Monitor sedation score, effective respiratory rate, oxygen saturation, end-tidal carbon dioxide when available, temperature, aspiration signs, and symptom trajectory because oxygen alone may conceal worsening carbon-dioxide retention.",
      "Escalate for fewer than eight effective breaths per minute, apnea, inability to awaken, recurrent sedation, severe hypoxemia, aspiration, hypotension, chest rigidity, seizure, or suspected long-acting exposure because these triggers mark overdose or another critical toxidrome."
    ], [
      "Fewer than eight effective breaths per minute, apnea, cyanosis, or inability to awaken",
      "Rising carbon dioxide, severe hypoxemia, snoring airway obstruction, or recurrent sedation",
      "Vomiting with aspiration, pulmonary edema, chest rigidity, hypotension, or seizure",
      "Mixed opioid, alcohol, benzodiazepine, xylazine, stimulant, or long-acting exposure"
    ], [
      "Do not drive, swim, cook, or take more sedatives while intoxicated because slowed reactions and breathing can worsen unexpectedly.",
      "Keep naloxone nearby and avoid being alone after opioid use because another person must recognize and respond to respiratory depression."
    ]),
    card("Opioid overdose", ["cdc-overdose", "cdc-naloxone"], [
      "Recognize unresponsiveness, slow or absent breathing, choking or gurgling, cyanosis, and pinpoint pupils because the decisive threat in opioid overdose is inadequate ventilation rather than the drug history alone.",
      "Call emergency services, administer naloxone, open the airway, and provide rescue breathing or bag-mask ventilation because oxygen delivery must be restored while the antagonist reaches opioid receptors.",
      "Repeat naloxone according to protocol and use an automated defibrillator or cardiopulmonary resuscitation when indicated because potent synthetic opioids may require multiple doses and cardiac arrest needs full resuscitation.",
      "Monitor effective respirations, oxygenation, end-tidal carbon dioxide when available, consciousness, pulse, temperature, glucose, aspiration, pulmonary edema, and recurrent toxicity because temporary reversal does not establish sustained safety.",
      "Escalate for apnea, persistent hypoventilation after two to three protocol doses, recurrent sedation, chest rigidity, severe hypoxemia, pulmonary edema, hypotension, seizure, or cardiac arrest because advanced airway, toxicology, and critical-care support may be required."
    ], [
      "Apnea, agonal breathing, cyanosis, absent pulse, or cardiac arrest",
      "Persistent hypoventilation despite repeated naloxone and effective ventilation support",
      "Recurrent respiratory depression after awakening or suspected long-acting opioid exposure",
      "Chest rigidity, aspiration, pulmonary edema, severe hypotension, seizure, or hyperthermia"
    ], [
      "Give naloxone and call emergency services immediately because waiting to confirm the exact opioid sacrifices oxygen-sensitive brain tissue.",
      "Use another naloxone dose if slow breathing returns and continue rescue breathing because one response does not guarantee lasting reversal."
    ]),
    card("Opioid withdrawal", ["samhsa-oud", "cdc-overdose"], [
      "Assess last opioid, route, daily amount, treatment medication, prior withdrawal, pregnancy, co-use, vital signs, pupils, yawning, sweating, gastrointestinal loss, pain, and standardized withdrawal score because severity and safe medication timing depend on current receptor activity.",
      "Differentiate opioid withdrawal from intoxication, alcohol or benzodiazepine withdrawal, sepsis, gastroenteritis, stimulant toxicity, and acute pain because giving sedating or opioid medication to the wrong syndrome can be dangerous.",
      "Provide prescribed buprenorphine, methadone, alpha-2 agonist, antiemetic, antidiarrheal, analgesic, fluids, and electrolyte support because treatment reduces physiologic distress and improves continuation in opioid use disorder care.",
      "Monitor withdrawal score, pulse, blood pressure, temperature, hydration, vomiting, diarrhea, electrolytes, fetal status when pregnant, mood, and response after medication because fluid loss, precipitated withdrawal, and coexisting illness can alter the course.",
      "Escalate for chest pain, severe dehydration, uncontrolled vomiting, bloody diarrhea, fever, confusion, seizure, suicidality, pregnancy contractions, or worsening immediately after buprenorphine because these triggers suggest complication, another withdrawal syndrome, or precipitation requiring urgent review."
    ], [
      "Severe dehydration, syncope, oliguria, uncontrolled vomiting, or critical electrolyte disturbance",
      "Fever, confusion, seizure, chest pain, severe hypertension, or a rigid abdomen",
      "Suicidal intent, severe agitation, hallucinations, or suspected alcohol or benzodiazepine withdrawal",
      "Abrupt marked worsening after buprenorphine or withdrawal symptoms during pregnancy"
    ], [
      "Opioid withdrawal is usually not fatal by itself, but dehydration, pregnancy, and mixed withdrawal can make it medically dangerous.",
      "Tolerance falls quickly during abstinence, so returning to a previous dose greatly increases overdose risk and makes naloxone essential."
    ]),
    card("Post-reperfusion stroke monitoring and cause workup", ["aha-stroke-2026", "aha-stroke-top"], [
      "Monitor neurologic findings and blood pressure at protocol intervals after thrombolysis or thrombectomy because early NIH Stroke Scale worsening may indicate hemorrhage, reocclusion, edema, or reperfusion injury before other signs appear.",
      "Assess airway, oxygenation, temperature, glucose, swallowing, urine, headache, nausea, puncture sites, distal circulation, and visible bleeding because post-reperfusion complications involve both brain and treatment access.",
      "Maintain the ordered treatment-specific blood-pressure range and avoid unapproved antithrombotic or invasive procedures because excessive pressure and premature hemostatic interference increase hemorrhage risk while hypotension can threaten reperfused tissue.",
      "Coordinate rhythm monitoring, vascular imaging, cardiac evaluation, lipids, glycated hemoglobin, and selected thrombophilia or structural studies because identifying atrial, arterial, cardiac, and systemic sources determines secondary prevention.",
      "Escalate immediately for NIH Stroke Scale increase, severe headache, vomiting, acute hypertension, reduced consciousness, tongue swelling, expanding access hematoma, absent distal pulse, or hypotension because intracranial hemorrhage, angioedema, and access bleeding require emergency treatment."
    ], [
      "NIH Stroke Scale increase, new deficit, severe headache, vomiting, or acute hypertension",
      "Reduced consciousness, unequal pupils, seizure, posturing, aspiration, or airway swelling",
      "Expanding puncture-site hematoma, uncontrolled bleeding, hypotension, or falling hemoglobin",
      "Absent distal pulse, cool painful access limb, recurrent focal deficit, or new dysrhythmia"
    ], [
      "Report any new weakness, speech change, headache, nausea, mouth swelling, or access-site swelling immediately because complications are most treatable when recognized early.",
      "Complete the heart, vessel, and risk-factor workup even after full recovery because preventing another stroke depends on finding its mechanism."
    ]),
    card("Precipitated opioid withdrawal", ["samhsa-oud"], [
      "Recognize abrupt severe withdrawal soon after a partial agonist or antagonist, documenting the last full-agonist opioid, formulation, route, time, fentanyl exposure, and induction dose because displacement from receptors explains the sudden onset.",
      "Assess standardized withdrawal score, vital signs, hydration, vomiting, diarrhea, pain, agitation, pregnancy, co-ingestants, and other diagnoses because not every deterioration after buprenorphine is precipitated withdrawal.",
      "Continue a clinician-directed buprenorphine rescue or alternative protocol and provide antiemetic, antidiarrheal, alpha-2 agonist, analgesic, fluid, and electrolyte support because adequate receptor stabilization and symptom control can restore engagement.",
      "Monitor withdrawal score, pulse, blood pressure, temperature, intake and output, electrolytes, mental status, fetal status when pregnant, and response after each intervention because dehydration and autonomic stress can become clinically significant.",
      "Escalate for syncope, severe dehydration, uncontrolled vomiting, chest pain, critical hypertension, confusion, seizure, suicidality, pregnancy contractions, or no improvement after the protocol-defined rescue dose because complications or an alternative toxidrome need urgent management."
    ], [
      "Syncope, oliguria, uncontrolled vomiting, severe diarrhea, or critical electrolyte disturbance",
      "Chest pain, critical hypertension, dysrhythmia, hyperthermia, confusion, or seizure",
      "Suicidal intent, uncontrollable agitation, hallucinations, or unsafe attempt to leave care",
      "Pregnancy contractions, vaginal bleeding, fetal concern, or failure of protocol-directed rescue"
    ], [
      "Tell the clinician exactly when and what opioid was last used because fentanyl and long-acting products change safe induction timing.",
      "Do not abandon treatment after precipitated withdrawal because supervised receptor stabilization and a revised induction plan can still succeed."
    ]),
    card("Stroke", ["aha-stroke-2026", "aha-stroke-top"], [
      "Use sudden balance, vision, face, arm, speech, sensory, coordination, and consciousness changes to recognize possible stroke because ischemia and hemorrhage both demand immediate imaging rather than bedside certainty.",
      "Establish exact last-known-well, baseline function, glucose, anticoagulants, blood pressure, recent surgery or bleeding, and transport destination because these facts determine reperfusion, reversal, and neurosurgical pathways.",
      "Activate emergency stroke care, maintain nothing-by-mouth status, protect the airway and weak limbs, and avoid empiric aspirin before imaging because aspiration and unrecognized intracranial bleeding can worsen outcomes.",
      "Monitor NIH Stroke Scale trend, consciousness, pupils, blood pressure, rhythm, oxygenation, glucose, temperature, swallowing, headache, and seizure activity because neurologic injury and treatment eligibility can change minute by minute.",
      "Escalate immediately for any new focal deficit, NIH Stroke Scale increase, declining consciousness, unequal pupils, severe headache, repeated vomiting, seizure, aspiration, or airway failure because occlusion, hemorrhage, edema, and herniation are time-critical emergencies."
    ], [
      "Sudden facial droop, unilateral weakness, aphasia, visual loss, neglect, or ataxia",
      "NIH Stroke Scale increase, recurrent focal deficit, or rapidly declining consciousness",
      "Thunderclap headache, repeated vomiting, unequal pupils, posturing, or seizure",
      "Aspiration, inability to protect the airway, severe hypoxemia, or hemodynamic instability"
    ], [
      "Call emergency services for any sudden stroke sign even if it disappears because transient symptoms may precede permanent disability.",
      "Write down the last time the person was definitely normal and bring the medication list because time and anticoagulants guide emergency treatment."
    ]),
    card("Stroke mimics and bedside glucose", ["aha-stroke-2026"], [
      "Check bedside glucose immediately while documenting exact onset and focal findings because hypoglycemia can imitate stroke and is rapidly treatable without delaying the stroke pathway.",
      "Assess seizure and postictal state, migraine, intoxication, infection, electrolyte disorder, functional symptoms, tumor, and prior deficits because a mimic can coexist with stroke and one plausible alternative does not safely exclude occlusion.",
      "Correct protocol-defined hypoglycemia and repeat glucose plus neurologic examination promptly because persistent focal deficit after normalization still requires emergency brain and vascular imaging.",
      "Monitor glucose trend, NIH Stroke Scale findings, consciousness, pupils, vital signs, oxygenation, seizure activity, temperature, and response to targeted treatment because fluctuation may clarify the cause or expose evolving cerebral injury.",
      "Escalate for glucose below the severe threshold with inability to swallow, persistent deficit after correction, recurrent hypoglycemia, NIH Stroke Scale increase, fever with meningismus, seizure lasting five minutes, or declining consciousness because stroke, infection, status, and metabolic brain injury remain emergencies."
    ], [
      "Severe hypoglycemia with inability to swallow, seizure, coma, or repeated recurrence",
      "Persistent focal deficit after glucose normalizes or a rising NIH Stroke Scale score",
      "Seizure lasting five minutes, recurrent seizures without recovery, or new Todd-like deficit",
      "Fever with meningismus, declining consciousness, unequal pupils, or severe headache and vomiting"
    ], [
      "Do not assume an abnormal glucose fully explains one-sided weakness because stroke evaluation continues when focal symptoms persist after correction.",
      "Call emergency services rather than treating at home when sudden focal symptoms occur because imaging is needed to separate stroke from its mimics."
    ]),
    card("SV2A synaptic vesicle protein", ["ncbi-levetiracetam", "aes-epilepsy"], [
      "Teach that SV2A synaptic vesicle protein helps regulate neurotransmitter release and binds levetiracetam and brivaracetam because this target explains antiseizure action without functioning as a bedside diagnosis or laboratory value.",
      "Assess the exact SV2A-directed medicine, indication, dose, adherence, renal function, interacting sedatives, seizure pattern, mood history, and pregnancy status because levetiracetam and brivaracetam effects depend on the whole clinical regimen.",
      "Administer SV2A-binding levetiracetam or brivaracetam on schedule and use seizure, fall, and driving precautions because abrupt missed doses can permit recurrence while somnolence and impaired coordination create injury risk.",
      "Monitor seizure frequency and duration, consciousness, behavior, suicidality, gait, sedation, renal function, and treatment changes because seizure control and neuropsychiatric tolerability determine whether SV2A-directed therapy is helping.",
      "Escalate during SV2A-directed therapy for a seizure lasting five minutes, recurrent seizures without recovery, suicidal intent, severe aggression, psychosis, profound sedation, respiratory compromise, or worsening renal function because status epilepticus and serious toxicity require urgent action."
    ], [
      "Seizure lasting five minutes or repeated seizures without neurologic recovery",
      "New suicidal intent, violent aggression, hallucinations, psychosis, or dangerous impulsivity",
      "Profound sedation, repeated falls, aspiration, respiratory slowing, or inability to awaken",
      "Abrupt seizure increase after missed doses or rapidly worsening renal function with toxicity"
    ], [
      "SV2A is a medicine target, not a diagnosis, so judge treatment by seizure control, function, and adverse effects.",
      "Do not stop levetiracetam or brivaracetam abruptly because sudden withdrawal can provoke breakthrough seizures or status epilepticus."
    ]),
    card("Vertebrobasilar and posterior circulation stroke", ["aha-stroke-2026", "aha-stroke-top"], [
      "Assess sudden vertigo with inability to walk, diplopia, dysarthria, dysphagia, nystagmus, visual-field loss, crossed findings, limb ataxia, weakness, and consciousness because posterior strokes are often missed by face-arm-speech screening.",
      "Establish last-known-well, baseline function, glucose, anticoagulants, headache and neck trauma, then activate emergency brain and vascular imaging because basilar or vertebral occlusion can deteriorate catastrophically despite a modest NIH Stroke Scale score.",
      "Maintain nothing-by-mouth status, protect the airway, use aspiration and fall precautions, and prepare reperfusion transfer because bulbar dysfunction and severe imbalance create immediate risks while posterior tissue remains salvageable.",
      "Monitor consciousness, pupils, eye movements, speech, swallowing, respiratory pattern, limb strength, coordination, blood pressure, rhythm, and oxygenation because brainstem edema or basilar progression can abruptly impair ventilation and airway reflexes.",
      "Escalate immediately for declining consciousness, new quadriparesis, abnormal pupils or eye movements, inability to handle secretions, apnea, recurrent vomiting, NIH Stroke Scale increase, or severe occipital headache because basilar occlusion, hemorrhage, and brainstem compression require emergency intervention."
    ], [
      "Sudden diplopia, dysarthria, dysphagia, severe ataxia, or inability to stand unaided",
      "Declining consciousness, quadriparesis, locked-in features, or abnormal respiratory pattern",
      "Inability to handle secretions, aspiration, apnea, cyanosis, or severe oxygen desaturation",
      "Severe occipital headache, repeated vomiting, unequal pupils, seizure, or rapid neurologic decline"
    ], [
      "Call emergency services for sudden severe imbalance, double vision, slurred speech, or swallowing difficulty because posterior stroke may lack facial droop.",
      "Do not walk unassisted, eat, drink, or drive during abrupt posterior symptoms because falls and aspiration can occur before diagnosis."
    ]),
    card("Wearing-off and on-off motor fluctuations", ["aan-parkinson", "parkinson-motor"], [
      "Record exact levodopa and meal times, onset and duration of benefit, predictable end-of-dose return, unpredictable off periods, dyskinesia, freezing, and nonmotor symptoms because timing patterns distinguish wearing-off from irregular on-off fluctuation.",
      "Review constipation, delayed gastric emptying, protein timing, missed or late doses, formulation, interacting medicines, infection, sleep, and stress because absorption and physiologic stress can shorten or destabilize motor benefit.",
      "Administer dopaminergic medicines at the individualized clock time and coordinate meals as prescribed because hospital delays and unplanned protein competition can cause profound immobility, aspiration risk, and loss of independence.",
      "Monitor gait, transfers, freezing, falls, swallowing, orthostatic blood pressure, dyskinesia, hallucinations, sleepiness, and diary response because regimen changes trade off mobility against involuntary movement and neuropsychiatric toxicity.",
      "Escalate for sudden severe rigidity with fever, inability to swallow medicines or secretions, repeated falls, syncope, aspiration, new psychosis, or immobility persisting beyond the individualized rescue plan because akinetic crisis, infection, injury, and medication toxicity need urgent review."
    ], [
      "Severe rigidity or akinesia with fever, autonomic instability, confusion, or elevated creatine kinase concern",
      "Inability to swallow medicines or secretions, aspiration, choking, or new oxygen decline",
      "Repeated falls, syncope, traumatic injury, or severe symptomatic orthostatic hypotension",
      "New hallucinations, dangerous impulsivity, severe dyskinesia, or off state beyond the rescue plan"
    ], [
      "Take levodopa at the exact agreed times and track meals and symptoms because timing reveals treatable wearing-off patterns.",
      "Do not stop dopaminergic medicine suddenly because abrupt withdrawal can cause dangerous immobility, fever, rigidity, and autonomic instability."
    ]),
    card("Ischemia", ["ncbi-cell-injury", "aha-stroke-2026"], [
      "Identify the threatened organ by assessing chest pressure, focal neurologic deficit, abdominal pain, limb pain and pulses, renal output, skin perfusion, onset, and precipitating factors because ischemia means inadequate blood flow but consequences depend on location.",
      "Assess oxygenation, circulation, rhythm, blood pressure, glucose, blood count, vascular risks, and site-specific tests because reduced supply, increased demand, obstruction, anemia, and shock require different restoration strategies.",
      "Protect the affected tissue, maintain prescribed oxygen and perfusion support, and activate the relevant cardiac, stroke, vascular, or surgical pathway because delayed reperfusion converts reversible dysfunction into infarction.",
      "Monitor site-specific function, pain, pulses, capillary refill, neurologic findings, electrocardiogram, lactate, urine output, rhythm, and hemodynamics because worsening function or systemic hypoperfusion signals expanding injury.",
      "Escalate immediately for ongoing chest pressure with electrocardiographic change, sudden focal deficit, pain out of proportion, pulseless cold limb, peritonitis, rising lactate with hypotension, or oliguria because coronary, cerebral, mesenteric, limb, and global ischemia are time-critical emergencies."
    ], [
      "Chest pressure with ischemic electrocardiographic change, dysrhythmia, hypotension, or diaphoresis",
      "Sudden focal neurologic deficit, visual loss, aphasia, severe ataxia, or declining consciousness",
      "Painful pale cold pulseless limb, pain out of proportion, or new motor and sensory loss",
      "Rigid abdomen, gastrointestinal bleeding, rising lactate, shock, or abrupt oliguria"
    ], [
      "Seek emergency care for sudden chest, neurologic, abdominal, or cold-limb symptoms because tissue can remain salvageable only briefly.",
      "Control tobacco exposure, blood pressure, diabetes, lipids, and prescribed antithrombotic therapy because vascular injury and thrombosis commonly recur across organs."
    ]),
    card("Ischemic core and penumbra", ["aha-stroke-2026", "ncbi-cell-injury"], [
      "Explain that the ischemic core is already severely injured while the penumbra is hypoperfused but potentially salvageable because reperfusion aims to preserve threatened tissue rather than revive irreversibly infarcted cells.",
      "Establish last-known-well, baseline function, glucose, deficit severity, and treatment contraindications while expediting noncontrast, vascular, and selected perfusion imaging because time and tissue both inform reperfusion decisions.",
      "Prevent hypoxia, fever, severe hypo- or hyperglycemia, aspiration, and avoidable hypotension while following the individualized blood-pressure plan because systemic insults can collapse collateral flow and recruit penumbra into the core.",
      "Monitor NIH Stroke Scale trend, consciousness, pupils, blood pressure, oxygenation, glucose, temperature, rhythm, and new headache or vomiting because neurologic worsening may reflect core expansion, edema, reocclusion, or hemorrhage.",
      "Escalate for NIH Stroke Scale increase, recurrent deficit, treatment-delay milestone breach, falling pressure with neurologic worsening, reduced consciousness, unequal pupils, severe headache, vomiting, or seizure because salvageable tissue and post-reperfusion safety are both time sensitive."
    ], [
      "NIH Stroke Scale increase, recurrent focal deficit, or rapid loss of previously preserved function",
      "Falling blood pressure with worsening neurologic findings or severe refractory hypoxemia",
      "Reduced consciousness, unequal pupils, posturing, severe headache, or repeated vomiting",
      "Seizure, aspiration, airway compromise, or a critical delay in reperfusion transfer"
    ], [
      "Every minute matters because threatened penumbral brain may become irreversibly injured while the artery remains blocked.",
      "Do not delay emergency care to watch symptoms at home because temporary improvement can reflect unstable collateral blood flow."
    ]),
    card("NIH Stroke Scale interpretation and limitations", ["aha-stroke-2026"], [
      "Perform each NIH Stroke Scale item in the standardized order using the patient's actual best response because coaching, inference, and inconsistent technique make serial scores misleading.",
      "Document item-level findings, baseline disability, language, hearing, vision, dominant hand, intubation, amputation, and sedation because the total score cannot explain why points were gained or whether testing was limited.",
      "Pair the score with gait, truncal stability, swallowing, distal hand function, cognition, and posterior-circulation examination because disabling deficits such as severe ataxia or visual loss may receive relatively few points.",
      "Monitor total and item-level NIH Stroke Scale trends with consciousness, pupils, vital signs, glucose, headache, and treatment milestones because a small numerical change may represent clinically important hemorrhage, edema, or reocclusion.",
      "Escalate for any new disabling deficit, protocol-defined NIH Stroke Scale increase, declining consciousness, unequal pupils, severe headache, vomiting, seizure, or basilar signs even when the total remains low because the scale supports but never replaces clinical judgment."
    ], [
      "Protocol-defined NIH Stroke Scale increase or a new disabling item-level deficit",
      "Low score with inability to walk, severe dysphagia, diplopia, visual loss, or profound hand weakness",
      "Declining consciousness, unequal pupils, posturing, severe headache, or repeated vomiting",
      "New seizure, quadriparesis, abnormal breathing, aspiration, or other posterior-circulation sign"
    ], [
      "A low NIH Stroke Scale score does not guarantee a minor stroke because vision, balance, swallowing, and hand function may be disabling.",
      "Report any new symptom even when the total score barely changes because item patterns and function guide urgent decisions."
    ]),
    card("Opioid-induced respiratory depression", ["cdc-naloxone", "cdc-overdose"], [
      "Assess sedation before and after every opioid dose, respiratory rate and depth, arousability, snoring, oxygenation, pain, dose timing, organ function, sleep apnea, and co-sedatives because advancing sedation usually precedes respiratory arrest.",
      "Hold further opioid and sedative exposure according to protocol, stimulate the patient, open the airway, provide oxygen and ventilation support, and summon help because ventilation failure cannot wait for laboratory confirmation.",
      "Administer titrated naloxone as prescribed when clinically significant hypoventilation occurs because the goal is restored breathing while avoiding unnecessary severe pain, sympathetic stress, and abrupt withdrawal.",
      "Monitor effective respiratory rate, sedation score, oxygen saturation, end-tidal carbon dioxide when available, blood pressure, pulse, naloxone response, and recurrence because supplemental oxygen may mask hypoventilation and antagonist effect may end first.",
      "Escalate for fewer than eight effective breaths per minute, apnea, inability to awaken, rising carbon dioxide, recurrent depression, severe hypoxemia, chest rigidity, hypotension, or repeated naloxone need because advanced airway and critical-care support may be required."
    ], [
      "Fewer than eight effective breaths per minute, apnea, cyanosis, or inability to awaken",
      "Rising end-tidal carbon dioxide, shallow breathing, airway obstruction, or severe hypoxemia",
      "Recurrent respiratory depression after naloxone or repeated antagonist requirement",
      "Chest rigidity, aspiration, pulmonary edema, hypotension, dysrhythmia, or cardiac arrest"
    ], [
      "Avoid alcohol, benzodiazepines, sleep medicines, and extra opioid doses unless specifically approved because respiratory depressant effects combine unpredictably.",
      "Keep naloxone accessible and teach household members to call emergency services because the affected person may be unable to self-rescue."
    ]),
    card("Post-stroke dysphagia screening and aspiration prevention", ["aha-stroke-2026"], [
      "Keep the patient nothing by mouth, including medicines, until a validated swallow screen is completed by trained staff because alert appearance and absence of coughing do not exclude silent aspiration.",
      "Assess alertness, secretion control, voice quality, cough, facial and tongue movement, respiratory status, dentition, positioning, and screen eligibility because impaired consciousness or bulbar weakness may require direct specialist evaluation instead.",
      "Follow the prescribed texture, liquid consistency, pacing, upright position, supervision, oral-care, and medication route after evaluation because individualized compensations reduce aspiration while preserving nutrition and hydration.",
      "Monitor cough, wet voice, oxygenation, respiratory rate, temperature, lung sounds, meal completion, weight, hydration, glucose, and swallowing change because aspiration pneumonia and inadequate intake may emerge after an initially acceptable screen.",
      "Stop oral intake and escalate for choking, inability to handle secretions, wet respirations, new oxygen decline, fever with pulmonary findings, reduced consciousness, or repeated failed screening because acute airway compromise, aspiration, and neurologic deterioration require urgent reassessment."
    ], [
      "Choking, stridor, inability to handle secretions, cyanosis, or acute airway obstruction",
      "Wet voice or respirations with new oxygen decline, tachypnea, or respiratory distress",
      "Fever, new crackles, productive cough, or infiltrate concern after suspected aspiration",
      "Reduced consciousness, new neurologic deficit, recurrent screen failure, or severe dehydration"
    ], [
      "Do not offer water, food, pills, or ice before screening because even a small trial can enter the lungs silently.",
      "Use the prescribed texture and upright supervised technique every time because swallowing safety may vary with fatigue and neurologic recovery."
    ]),
    card("Hyperuricemia", ["acr-gout"], [
      "Assess prior gout flares, tophi, kidney stones, renal function, diet and alcohol pattern, medicines, chemotherapy, rapid cell turnover, blood pressure, and metabolic risks because an elevated urate is a risk marker with several different causes and consequences.",
      "Distinguish asymptomatic hyperuricemia from crystal-proven or clinically likely gout, uric-acid nephrolithiasis, and tumor lysis because the urate number alone does not determine whether immediate drug treatment is beneficial.",
      "Administer prescribed urate-lowering and flare-prophylaxis therapy consistently, review renal dosing and interactions, and avoid starting or stopping medicines independently because changing urate can mobilize crystals and trigger early flares.",
      "Monitor serum urate against the individualized target, creatinine, urine output, joint findings, stone symptoms, adherence, rash, liver tests, and blood counts because effective prevention requires sustained exposure without missing serious toxicity.",
      "Escalate for a hot swollen joint with fever, obstructive flank pain with oliguria, rapidly rising urate plus potassium or phosphate during cancer therapy, blistering rash, facial swelling, or mucosal lesions because septic arthritis, obstruction, tumor lysis, and severe hypersensitivity are emergencies."
    ], [
      "Hot swollen joint with fever, rigors, hypotension, or inability to bear weight",
      "Severe flank pain with fever, anuria, oliguria, vomiting, or a solitary kidney",
      "Rapid urate rise with hyperkalemia, hyperphosphatemia, hypocalcemia, dysrhythmia, or seizure",
      "Blistering rash, mucosal sores, facial swelling, fever, or systemic hypersensitivity"
    ], [
      "Take urate-lowering medicine every day rather than only during pain because crystal burden falls through sustained target control.",
      "Hydrate as individually advised and discuss alcohol, sweetened drinks, weight, and medicines because several modifiable factors raise urate without causing every flare."
    ]),
    card("Breast cancer", ["nci-breast"], [
      "Assess breast or axillary change, pain, skin or nipple findings, constitutional symptoms, family history, pregnancy potential, function, distress, and patient goals because presentation and treatment burden extend beyond a palpable mass.",
      "Coordinate diagnostic imaging, tissue biopsy, receptor and genomic testing when indicated, staging, baseline organ assessment, and fertility discussion because histology, extent, hormone receptors, HER2 status, and life priorities determine therapy.",
      "Provide prescribed surgical, radiation, endocrine, targeted, or cytotoxic care with wound, drain, infection, venous-thromboembolism, and symptom precautions because multimodal treatment improves control while creating distinct acute and long-term risks.",
      "Monitor blood counts, temperature, treatment-specific cardiac and liver tests, neuropathy, skin, pain, arm circumference or swelling, range of motion, nutrition, mood, and adherence because cytopenia, cardiotoxicity, lymphedema, and functional loss need early management.",
      "Escalate for neutropenic fever, chest pain, acute dyspnea, unilateral arm swelling with redness, uncontrolled wound bleeding, spreading infection, new focal neurologic deficit, or cord-compression symptoms because sepsis, thrombosis, treatment toxicity, and metastatic emergencies require urgent care."
    ], [
      "Fever at or above the oncology emergency threshold during neutropenia",
      "New chest pain, acute dyspnea, hemoptysis, syncope, or unilateral limb swelling",
      "Rapidly spreading breast, wound, or arm redness with drainage, pain, or systemic illness",
      "New weakness, seizure, severe headache, loss of bladder control, or progressive spinal pain"
    ], [
      "Report fever, breathing difficulty, wound change, or new neurologic symptoms immediately because treatment complications and metastatic emergencies are most treatable early.",
      "Follow the individualized arm and rehabilitation plan after lymph-node treatment because movement supports recovery while infection and swelling require prompt assessment."
    ]),
    card("Cushing syndrome", ["endocrine-cushing"], [
      "Assess glucocorticoid medicines and injections, weight distribution, proximal weakness, skin fragility, bruising, infection, mood, sleep, menstrual or sexual change, fractures, and growth because chronic cortisol excess affects nearly every organ system.",
      "Coordinate ordered cortisol confirmation, ACTH-directed cause testing, imaging, glucose, electrolytes, bone, cardiovascular, and infection assessment because exogenous exposure, pituitary, adrenal, and ectopic causes require different treatment.",
      "Protect fragile skin and bones, prevent falls and infection, manage prescribed glucose, pressure, potassium, and thrombosis precautions, and prepare cause-directed therapy because cardiovascular, infectious, and thrombotic complications drive substantial morbidity.",
      "Monitor blood pressure, glucose, potassium, weight, edema, temperature, wounds, mood, muscle strength, treatment adherence, and post-treatment cortisol status because improvement is gradual while therapy can abruptly produce adrenal insufficiency.",
      "Escalate for hypotension with vomiting or profound weakness after treatment, fever with infection, critical hypokalemia or dysrhythmia, severe hyperglycemia, chest pain, dyspnea, suicidality, or acute neurologic change because adrenal crisis and cortisol-related complications are time critical."
    ], [
      "Hypotension, vomiting, abdominal pain, confusion, or profound weakness after cortisol-lowering treatment",
      "Fever, rapidly spreading infection, poor wound healing, or sepsis physiology",
      "Critical hypokalemia, dysrhythmia, severe hyperglycemia, chest pain, or acute dyspnea",
      "Suicidal intent, psychosis, acute focal deficit, fracture, or sudden severe back pain"
    ], [
      "Never stop long-term glucocorticoids suddenly because suppressed adrenal glands may not produce enough cortisol during physiologic stress.",
      "Carry the prescribed steroid emergency information after treatment because illness or surgery may require temporary stress dosing."
    ]),
    card("Endometriosis", ["nice-endometriosis"], [
      "Assess cyclical and noncyclical pelvic pain, dysmenorrhea, dyspareunia, bowel or urinary symptoms, bleeding, fatigue, fertility goals, pregnancy possibility, and functional impact because lesion burden and pain severity do not correlate reliably.",
      "Validate symptoms and coordinate examination, imaging, empiric treatment, or laparoscopy according to the pathway because normal imaging does not exclude superficial disease and delayed recognition compounds disability.",
      "Provide prescribed anti-inflammatory, hormonal, pelvic-health, surgical, fertility, and psychosocial care while reviewing contraindications and patient preferences because effective treatment is longitudinal and must fit reproductive goals.",
      "Monitor pain pattern, bleeding, medication adverse effects, mood, anemia symptoms, bowel and bladder function, school or work participation, and response over agreed intervals because meaningful improvement includes function, not only pain intensity.",
      "Escalate for positive pregnancy test with unilateral pain or bleeding, sudden severe pelvic pain with vomiting, syncope, fever, rigid abdomen, heavy bleeding with instability, urinary obstruction, or suicidal distress because ectopic pregnancy, torsion, infection, hemorrhage, and crisis require urgent evaluation."
    ], [
      "Positive pregnancy test with unilateral pelvic pain, shoulder pain, bleeding, or syncope",
      "Sudden severe pelvic pain with vomiting, fever, guarding, rebound, or rigid abdomen",
      "Heavy bleeding with dizziness, tachycardia, hypotension, or rapidly worsening anemia symptoms",
      "Urinary retention, bowel obstruction symptoms, severe medication reaction, or suicidal intent"
    ], [
      "Normal ultrasound does not always exclude endometriosis, so persistent symptoms deserve planned follow-up rather than dismissal.",
      "Track pain, bleeding, bowel, bladder, medicines, and function across cycles because patterns help tailor treatment and fertility planning."
    ]),
    card("Molluscum contagiosum", ["cdc-molluscum"], [
      "Inspect the number, location, central umbilication, inflammation, scratching, secondary infection, genital involvement, eczema, and immune status because typical lesions are benign while atypical or extensive disease changes evaluation.",
      "Differentiate molluscum from bacterial infection, varicella, warts, herpes, mpox, and skin cancer when morphology or context is atypical because visually similar lesions have different transmission risks and treatments.",
      "Keep lesions clean and covered when practical, discourage scratching, squeezing, and shaving across them, and use separate towels because autoinoculation and skin contact spread the virus to new sites and people.",
      "Monitor lesion count, surrounding redness, pain, drainage, fever, eczema activity, treatment-site injury, and healing because irritation may accompany immune clearance but progressive tenderness and warmth suggest bacterial infection.",
      "Escalate for rapidly spreading painful redness, purulent drainage with fever, eye involvement, extensive giant lesions in an immunocompromised patient, severe genital lesions, or diagnostic uncertainty after a high-risk exposure because cellulitis, ocular injury, immune dysfunction, and alternative infections need prompt review."
    ], [
      "Rapidly spreading painful redness, purulent drainage, fever, streaking, or systemic illness",
      "Eyelid or ocular-surface involvement with pain, photophobia, swelling, or visual change",
      "Numerous giant, facial, or treatment-resistant lesions with suspected immune suppression",
      "Painful vesicles, necrosis, genital ulceration, or lesions after a concerning infectious exposure"
    ], [
      "Do not squeeze or scrape lesions at home because skin trauma spreads virus and creates openings for bacterial infection.",
      "Cover visible lesions during close-contact activities and avoid shared towels or razors because direct contact and contaminated objects transmit molluscum."
    ]),
    card("Lactic acidosis", ["ncbi-lactic-acidosis", "ncbi-metabolic-acidosis"], [
      "Assess perfusion, oxygenation, infection, seizure, work of breathing, liver and renal function, medicines, toxins, alcohol, malignancy, nutrition, and exertion because lactate rises from both impaired oxygen delivery and nonhypoxic metabolic mechanisms.",
      "Interpret lactate with pH, bicarbonate, anion gap, blood pressure, capillary refill, urine output, glucose, ketones, hemoglobin, cultures, and clinical trajectory because one elevated value neither proves sepsis nor measures tissue perfusion perfectly.",
      "Treat the identified driver with prescribed oxygenation, ventilation, fluids, blood products, antimicrobials, source control, seizure termination, toxin management, or circulatory support because clearing lactate requires restoration of physiology rather than normalization of a number alone.",
      "Monitor serial lactate, pH, bicarbonate, potassium, glucose, vital signs, mental status, skin perfusion, urine output, respiratory effort, and treatment response because persistent elevation with organ dysfunction signals ongoing danger.",
      "Escalate for rising lactate with hypotension, critical acidemia, oliguria, mottling, altered consciousness, respiratory fatigue, dysrhythmia, persistent seizure, or suspected metformin or toxic alcohol accumulation because shock, ventilatory failure, and toxin-related acidosis may require critical care or dialysis."
    ], [
      "Rising lactate with hypotension, cool mottled skin, delayed capillary refill, or oliguria",
      "Critical acidemia, hyperkalemic electrocardiographic change, dysrhythmia, or rapidly worsening bicarbonate",
      "Respiratory fatigue, severe hypoxemia, altered consciousness, seizure, or inability to protect the airway",
      "Suspected metformin accumulation, cyanide exposure, toxic alcohol ingestion, or acute liver failure"
    ], [
      "An elevated lactate is a warning signal rather than a diagnosis because infection, shock, seizure, medicines, and liver dysfunction can all contribute.",
      "Seek urgent care for confusion, fainting, deep rapid breathing, severe weakness, or persistent vomiting because worsening acidemia can impair circulation and consciousness."
    ]),
    card("Aplastic anemia", ["nhlbi-aplastic"], [
      "Assess fever, infection exposure, bleeding, bruising, fatigue, dyspnea, medication and toxin history, viral illness, pregnancy, autoimmune disease, and prior counts because marrow failure reduces white cells, platelets, and red cells simultaneously.",
      "Trend complete blood count with differential, reticulocytes, marrow results, type and screen, renal and liver tests, and ordered clonal or infectious studies because severe cytopenias require confirmation and distinction from leukemia, myelodysplasia, and reversible suppression.",
      "Use neutropenic, bleeding, transfusion, and central-line precautions and administer prescribed antimicrobial, immunosuppressive, growth-factor, or transplant care because limited marrow reserve makes infection and hemorrhage rapidly life threatening.",
      "Monitor temperature, oral and skin integrity, bleeding, neurologic status, oxygenation, activity tolerance, transfusion response, iron burden, kidney and liver function, and treatment toxicity because supportive therapy and definitive treatment create different complications.",
      "Escalate immediately for fever at the hematology threshold, uncontrolled bleeding, severe headache or focal deficit, chest pain, dyspnea at rest, hypotension, transfusion reaction, or sepsis signs because neutropenic infection, intracranial hemorrhage, and severe anemia cannot wait."
    ], [
      "Fever at or above the hematology emergency threshold with severe neutropenia",
      "Uncontrolled bleeding, black stool, hematemesis, heavy vaginal bleeding, or rapidly spreading bruising",
      "Severe headache, focal deficit, seizure, reduced consciousness, or suspected intracranial hemorrhage",
      "Chest pain, dyspnea at rest, syncope, hypotension, sepsis physiology, or transfusion reaction"
    ], [
      "Follow the fever plan immediately and do not take fever-reducing medicine first because severe neutropenia can hide infection until it becomes critical.",
      "Avoid unapproved aspirin, anti-inflammatory medicines, rectal procedures, and injury-prone activities because low platelets make minor trauma bleed dangerously."
    ]),
    // WAVE33_COHORT_C_CARDS
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

  const names = patches.map((patch) => patch.name);
  window.ANI_PATHOLOGY_NURSING_WAVE33_C = {
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
