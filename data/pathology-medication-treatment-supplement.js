/* eslint-disable */
/*
 * Adds medication-treatment coverage to pathology cards.
 * Loaded after pathology-database.js and pathology-bible-supplement.js.
 */
(function () {
  const db = window.ANI_PATHOLOGY_DATABASE || { diseases: [] };

  const updates = {
    "anorexia nervosa": {
      medicationsCommonlyUsed: ["fluoxetine", "sertraline", "olanzapine", "potassium chloride", "potassium phosphate", "magnesium sulfate", "thiamine"],
      treatments: [
        "Medication treatment: no medication restores weight by itself. Nutrition rehabilitation, medical stabilization, psychotherapy, electrolyte correction, and refeeding-syndrome prevention are first-line.",
        "Common ordered medications target comorbid symptoms or complications: fluoxetine or sertraline after nutritional stabilization for depression or obsessive-compulsive symptoms, olanzapine for severe rigidity/anxiety in selected patients, and potassium chloride, potassium phosphate, magnesium sulfate, or thiamine when refeeding risk or electrolyte depletion is present."
      ],
      nclexTraps: ["Do not treat anorexia nervosa as a medication-only disorder. The priority is physiologic stability, nutrition, suicide risk, electrolyte monitoring, and safe refeeding."]
    },
    "antisocial personality disorder": {
      medicationsCommonlyUsed: ["sertraline", "fluoxetine", "valproic acid", "risperidone", "olanzapine"],
      treatments: [
        "Medication treatment: no medication cures antisocial personality disorder. Medications are symptom-targeted when comorbid depression, anxiety, impulsive aggression, or psychosis-like symptoms are present.",
        "Examples include sertraline or fluoxetine for comorbid depression/anxiety, valproic acid for severe impulsive aggression, and risperidone or olanzapine for severe agitation or psychotic symptoms when ordered."
      ],
      nclexTraps: ["The nursing priority is safety, boundaries, manipulation awareness, and violence risk, not expecting a medication to change the personality disorder itself."]
    },
    "aortic aneurysm": {
      medicationsCommonlyUsed: ["esmolol", "labetalol", "metoprolol", "nicardipine", "atorvastatin", "rosuvastatin", "aspirin"],
      treatments: [
        "Medication treatment: anti-impulse and blood-pressure control reduce wall stress while the team determines surveillance versus repair. Esmolol, labetalol, metoprolol, or nicardipine may be used depending on acuity and provider orders.",
        "Atherosclerosis-risk management may include a statin such as atorvastatin or rosuvastatin and antiplatelet therapy such as aspirin when appropriate. Surgery or endovascular repair is the definitive treatment for rupture risk, rapid growth, symptoms, or dissection."
      ],
      nclexTraps: ["Sudden tearing pain, hypotension, syncope, or pulse deficits are emergency cues. Do not delay escalation for oral teaching."]
    },
    "atrial septal defect": {
      medicationsCommonlyUsed: ["furosemide", "digoxin", "metoprolol", "aspirin", "warfarin"],
      treatments: [
        "Medication treatment: closure is definitive when indicated. Furosemide or digoxin may be ordered for heart-failure symptoms in selected clients, metoprolol may be used for dysrhythmia control, and aspirin or warfarin may be used when clot or stroke risk is part of the plan.",
        "Endocarditis antibiotics are not automatic for every atrial septal defect. They are used when infection is present or prophylaxis is specifically indicated by the provider."
      ],
      nclexTraps: ["Watch for pulmonary hypertension, dysrhythmias, paradoxical emboli, and worsening exercise intolerance."]
    },
    "attention-deficit/hyperactivity disorder": {
      medicationsCommonlyUsed: ["methylphenidate", "amphetamine salts", "atomoxetine", "clonidine"],
      treatments: [
        "Medication treatment: stimulants such as methylphenidate or amphetamine salts are common first-line agents. Atomoxetine is a nonstimulant option, and clonidine may be used for hyperactivity, impulsivity, sleep difficulty, or tics when ordered.",
        "Monitor appetite, weight, sleep, blood pressure, pulse, growth pattern, misuse risk, and mood changes."
      ],
      nclexTraps: ["Do not ignore growth, appetite suppression, insomnia, or cardiovascular symptoms in children taking stimulants."]
    },
    "autism spectrum disorder": {
      medicationsCommonlyUsed: ["risperidone", "aripiprazole", "melatonin", "sertraline", "fluoxetine"],
      treatments: [
        "Medication treatment: no medication treats the core social-communication features of autism spectrum disorder. Medications target specific symptoms.",
        "Risperidone or aripiprazole may be ordered for severe irritability or aggression, melatonin for sleep difficulty, and sertraline or fluoxetine for comorbid anxiety or obsessive-compulsive symptoms."
      ],
      nclexTraps: ["Match the intervention to the target symptom. Communication supports, routines, sensory planning, and caregiver education remain central."]
    },
    "borderline personality disorder": {
      medicationsCommonlyUsed: ["sertraline", "fluoxetine", "valproic acid", "lamotrigine", "quetiapine", "olanzapine"],
      treatments: [
        "Medication treatment: no medication cures borderline personality disorder. Medications may target depression, anxiety, mood lability, impulsivity, insomnia, or transient paranoia.",
        "Examples include sertraline or fluoxetine for mood/anxiety symptoms, valproic acid or lamotrigine for mood instability in selected clients, and quetiapine or olanzapine for severe agitation or transient psychotic symptoms."
      ],
      nclexTraps: ["Safety, suicide/self-harm assessment, consistent boundaries, and dialectical behavior therapy are the high-yield priorities."]
    },
    "cardiac tamponade": {
      medicationsCommonlyUsed: ["normal saline", "norepinephrine", "dopamine", "epinephrine", "vitamin K", "protamine sulfate", "idarucizumab", "andexanet alfa"],
      treatments: [
        "Medication treatment: pericardiocentesis or surgical drainage is definitive. Normal saline and vasopressors such as norepinephrine, dopamine, or epinephrine may temporarily support perfusion while preparing for drainage.",
        "If bleeding or anticoagulation contributed, reversal may include vitamin K, protamine sulfate, idarucizumab, or andexanet alfa depending on the anticoagulant."
      ],
      nclexTraps: ["Beck triad, narrowed pulse pressure, muffled heart sounds, jugular venous distention, hypotension, and pulsus paradoxus are emergency cues."]
    },
    "cerebral palsy": {
      medicationsCommonlyUsed: ["baclofen", "diazepam", "tizanidine", "levetiracetam", "acetaminophen", "ibuprofen"],
      treatments: [
        "Medication treatment: baclofen, diazepam, or tizanidine may be used for spasticity. Levetiracetam or other antiseizure medication may be used if seizures occur. Acetaminophen or ibuprofen may be used for pain when appropriate.",
        "Therapy, mobility support, feeding/swallowing safety, respiratory care, and orthopedic management remain central."
      ],
      nclexTraps: ["Watch aspiration risk, nutrition, communication needs, contractures, pain, skin breakdown, and caregiver support."]
    },
    "clubfoot": {
      medicationsCommonlyUsed: ["acetaminophen", "ibuprofen"],
      treatments: [
        "Medication treatment: no medication corrects clubfoot. Serial casting, bracing, and sometimes surgery correct alignment.",
        "Acetaminophen or ibuprofen may be used for discomfort when ordered."
      ],
      nclexTraps: ["Teach cast circulation checks, skin inspection, brace adherence, and when to report swelling, cool toes, or poor perfusion."]
    },
    "compartment syndrome": {
      medicationsCommonlyUsed: ["morphine", "fentanyl", "acetaminophen"],
      treatments: [
        "Medication treatment: fasciotomy is definitive. Opioids such as morphine or fentanyl and nonopioid pain medication may be ordered, but pain medication must not distract from worsening neurovascular findings.",
        "Remove constrictive items, keep the extremity at heart level, notify the provider immediately, and prepare for emergency decompression."
      ],
      nclexTraps: ["Pain out of proportion, pain with passive stretch, paresthesia, pallor, paralysis, and pulselessness are danger cues. Pulses can remain present early."]
    },
    "congenital torch infection": {
      medicationsCommonlyUsed: ["acyclovir", "ganciclovir", "penicillin G"],
      treatments: [
        "Medication treatment: therapy depends on the organism. Acyclovir is used for neonatal herpes simplex virus, ganciclovir may be used for severe congenital cytomegalovirus, and penicillin G is used for congenital syphilis.",
        "Supportive care, hearing/vision follow-up, growth monitoring, and infection-specific precautions are essential."
      ],
      nclexTraps: ["Do not lump TORCH infections together. Match treatment and isolation/follow-up to the organism and newborn findings."]
    },
    "conjunctivitis": {
      medicationsCommonlyUsed: ["erythromycin ophthalmic", "ciprofloxacin ophthalmic", "artificial tears", "diphenhydramine", "cetirizine"],
      treatments: [
        "Medication treatment: bacterial conjunctivitis may be treated with erythromycin ophthalmic or ciprofloxacin ophthalmic depending on age, organism risk, and orders. Viral cases are usually supportive with artificial tears. Allergic conjunctivitis may use antihistamines such as diphenhydramine or cetirizine.",
        "Teach hand hygiene, no shared towels, contact-lens safety, and when to report eye pain, vision change, or photophobia."
      ],
      nclexTraps: ["Pain, photophobia, vision loss, trauma, or corneal findings are not simple conjunctivitis."]
    },
    "deep vein thrombosis": {
      medicationsCommonlyUsed: ["heparin", "enoxaparin", "warfarin", "apixaban", "rivaroxaban", "dabigatran", "alteplase"],
      treatments: [
        "Medication treatment: anticoagulation is the core therapy unless contraindicated. Common options include heparin, enoxaparin, warfarin, apixaban, rivaroxaban, or dabigatran.",
        "Alteplase or procedural thrombolysis is reserved for selected severe cases. Monitor bleeding risk, platelet trend with heparin, and pulmonary embolism symptoms."
      ],
      nclexTraps: ["Do not massage the leg. Sudden dyspnea, chest pain, tachycardia, hemoptysis, or syncope suggests pulmonary embolism."]
    },
    "developmental dysplasia of the hip": {
      medicationsCommonlyUsed: ["acetaminophen", "ibuprofen"],
      treatments: [
        "Medication treatment: no medication corrects developmental dysplasia of the hip. Pavlik harness, bracing, casting, or surgery guides the femoral head into the acetabulum.",
        "Acetaminophen or ibuprofen may be used for discomfort when ordered."
      ],
      nclexTraps: ["Check skin under the harness, avoid forced leg extension, and teach parents not to remove the device unless instructed."]
    },
    "duchenne muscular dystrophy": {
      medicationsCommonlyUsed: ["prednisone", "lisinopril", "carvedilol"],
      treatments: [
        "Medication treatment: corticosteroids such as prednisone can slow functional decline. Lisinopril or carvedilol may be used when cardiomyopathy develops or for cardiac protection based on provider plan.",
        "Respiratory support, cardiac surveillance, mobility support, vaccines, and family education are central."
      ],
      nclexTraps: ["Gowers sign, progressive weakness, respiratory failure risk, and cardiomyopathy are the nursing anchors."]
    },
    "eczema": {
      medicationsCommonlyUsed: ["hydrocortisone topical", "triamcinolone topical", "diphenhydramine", "cetirizine", "dupilumab", "mupirocin"],
      treatments: [
        "Medication treatment: topical corticosteroids such as hydrocortisone topical or triamcinolone topical reduce inflammation. Diphenhydramine or cetirizine may help itching. Dupilumab may be used for severe atopic disease. Mupirocin or systemic antibiotics may be used if secondary bacterial infection occurs.",
        "Moisturizers, trigger avoidance, short lukewarm baths, and skin-barrier protection are essential."
      ],
      nclexTraps: ["Teach thin-layer steroid use and avoid confusing infected eczema with a routine flare."]
    },
    "ehlers-danlos syndrome": {
      medicationsCommonlyUsed: ["acetaminophen", "ibuprofen", "atenolol", "propranolol", "losartan"],
      treatments: [
        "Medication treatment: no medication cures Ehlers-Danlos syndrome. Acetaminophen or ibuprofen may be used for pain. Atenolol, propranolol, or losartan may be used in selected vascular-risk patients to reduce aortic stress.",
        "Joint protection, injury prevention, physical therapy, skin care, and vascular surveillance are central."
      ],
      nclexTraps: ["Easy bruising, hypermobility, fragile skin, and vascular rupture risk require careful assessment and safety teaching."]
    },
    "electrical injury": {
      medicationsCommonlyUsed: ["morphine", "fentanyl", "normal saline", "lactated ringer"],
      treatments: [
        "Medication treatment: analgesics such as morphine or fentanyl may be ordered for pain, and aggressive IV fluids such as normal saline or lactated Ringer's may be needed for rhabdomyolysis and burn shock risk.",
        "Continuous cardiac monitoring, burn assessment, urine output, myoglobin/rhabdomyolysis screening, and trauma evaluation are priorities."
      ],
      nclexTraps: ["Skin burns may underestimate deep tissue injury. Dysrhythmias and compartment syndrome can be life-threatening."]
    },
    "endocarditis": {
      medicationsCommonlyUsed: ["vancomycin", "ceftriaxone", "penicillin G", "gentamicin"],
      treatments: [
        "Medication treatment: prolonged IV antibiotics are selected by cultures and valve risk. Common examples include vancomycin, ceftriaxone, penicillin G, and sometimes gentamicin.",
        "Valve surgery may be needed for heart failure, abscess, persistent infection, or embolic complications."
      ],
      nclexTraps: ["Blood cultures before antibiotics are high yield unless the client is crashing. Watch for new murmur, emboli, fever, and heart failure."]
    },
    "endometritis": {
      medicationsCommonlyUsed: ["clindamycin", "gentamicin", "ampicillin"],
      treatments: [
        "Medication treatment: postpartum endometritis is commonly treated with broad-spectrum IV antibiotics such as clindamycin plus gentamicin. Ampicillin may be added if enterococcus is suspected.",
        "Monitor fever, uterine tenderness, foul lochia, tachycardia, and sepsis cues."
      ],
      nclexTraps: ["Postpartum fever with uterine tenderness and foul-smelling lochia is not normal after-birth discomfort."]
    },
    "generalized anxiety disorder": {
      medicationsCommonlyUsed: ["sertraline", "escitalopram", "paroxetine", "venlafaxine", "duloxetine", "buspirone", "lorazepam"],
      treatments: [
        "Medication treatment: SSRIs such as sertraline, escitalopram, or paroxetine and SNRIs such as venlafaxine or duloxetine are common long-term options. Buspirone is a non-benzodiazepine anxiolytic option. Lorazepam may be used short term for severe acute anxiety when ordered.",
        "Therapy, sleep, caffeine/substance assessment, and suicide screening matter."
      ],
      nclexTraps: ["Benzodiazepines are not the default long-term answer because of sedation, dependence, falls, and respiratory/CNS depression risks."]
    },
    "glaucoma": {
      medicationsCommonlyUsed: ["latanoprost", "timolol ophthalmic", "brimonidine", "dorzolamide", "acetazolamide", "pilocarpine"],
      treatments: [
        "Medication treatment: latanoprost, timolol ophthalmic, brimonidine, dorzolamide, acetazolamide, or pilocarpine may be used depending on glaucoma type and urgency.",
        "Acute angle-closure glaucoma is an emergency with eye pain, halos, nausea, and sudden vision changes."
      ],
      nclexTraps: ["Check beta-blocker eye drop systemic effects such as bradycardia or bronchospasm risk with timolol."]
    },
    "hemorrhagic stroke": {
      medicationsCommonlyUsed: ["vitamin K", "protamine sulfate", "idarucizumab", "andexanet alfa", "nicardipine", "labetalol"],
      treatments: [
        "Medication treatment: reverse anticoagulation when present and control blood pressure carefully. Vitamin K, protamine sulfate, idarucizumab, or andexanet alfa may be used depending on the anticoagulant. Nicardipine or labetalol may be used for blood-pressure control.",
        "Neurosurgical intervention may be needed. Thrombolytics such as alteplase are contraindicated in hemorrhagic stroke."
      ],
      nclexTraps: ["Sudden severe headache, vomiting, decreased level of consciousness, or very high blood pressure is not a routine ischemic-stroke pathway."]
    },
    "hemothorax": {
      medicationsCommonlyUsed: ["morphine", "fentanyl", "normal saline", "lactated ringer"],
      treatments: [
        "Medication treatment: chest tube drainage and hemorrhage control are definitive. Morphine or fentanyl may be used for pain, and IV fluids such as normal saline or lactated Ringer's support perfusion while bleeding is managed.",
        "Blood products and surgery may be required for massive or ongoing bleeding."
      ],
      nclexTraps: ["Unilateral decreased breath sounds, shock, tracheal shift, or high chest-tube output are priority cues."]
    },
    "hepatitis a": {
      medicationsCommonlyUsed: ["acetaminophen"],
      treatments: [
        "Medication treatment: no antiviral cures hepatitis A. Treatment is supportive with hydration, nutrition, rest, antiemetic support when ordered, and avoidance of alcohol or hepatotoxic medications.",
        "Acetaminophen requires caution because liver injury changes safe-use thinking."
      ],
      nclexTraps: ["The key nursing prevention point is fecal-oral transmission, hand hygiene, food safety, and vaccination/postexposure protocol."]
    },
    "hepatitis b": {
      medicationsCommonlyUsed: ["tenofovir", "interferon beta"],
      treatments: [
        "Medication treatment: chronic hepatitis B may be treated with antiviral therapy such as tenofovir and selected interferon-based therapy under specialist guidance.",
        "Acute hepatitis B is often supportive unless severe. Prevention includes vaccination, exposure management, and blood/body-fluid precautions."
      ],
      nclexTraps: ["Screen pregnancy, needle exposure, sexual exposure, and liver-function trends. Teach no sharing razors or needles."]
    },
    "hydrocephalus": {
      medicationsCommonlyUsed: ["acetazolamide", "furosemide"],
      treatments: [
        "Medication treatment: shunt placement or external ventricular drainage is definitive when cerebrospinal fluid diversion is needed. Acetazolamide or furosemide may temporarily reduce cerebrospinal fluid production in selected cases.",
        "Antibiotics are used if shunt infection or meningitis is present."
      ],
      nclexTraps: ["Bulging fontanel, sunset eyes, vomiting, irritability, increasing head circumference, or decreased level of consciousness are priority cues."]
    },
    "legg-calve-perthes disease": {
      medicationsCommonlyUsed: ["acetaminophen", "ibuprofen"],
      treatments: [
        "Medication treatment: no medication restores femoral-head blood supply. Treatment uses activity restriction, containment bracing/casting, physical therapy, and sometimes surgery.",
        "Acetaminophen or ibuprofen may be used for pain or inflammation when ordered."
      ],
      nclexTraps: ["Limp, hip/knee pain, limited abduction/internal rotation, and delayed diagnosis are classic concerns."]
    },
    "marfan syndrome": {
      medicationsCommonlyUsed: ["atenolol", "propranolol", "metoprolol", "losartan"],
      treatments: [
        "Medication treatment: beta blockers such as atenolol, propranolol, or metoprolol and angiotensin-receptor blockers such as losartan may be used to reduce aortic wall stress.",
        "Aortic imaging surveillance and activity restrictions are central."
      ],
      nclexTraps: ["Chest/back pain or syncope can mean aortic dissection. Tall stature is not the priority. Aorta safety is."]
    },
    "mastitis": {
      medicationsCommonlyUsed: ["dicloxacillin", "cephalexin", "clindamycin", "ibuprofen", "acetaminophen"],
      treatments: [
        "Medication treatment: dicloxacillin or cephalexin are common first-line antibiotics. Clindamycin may be used if allergy or MRSA risk is part of the plan. Ibuprofen or acetaminophen may help pain and fever.",
        "Continue milk removal unless told otherwise. Teach latch support, warm compresses, hydration, and worsening-infection signs."
      ],
      nclexTraps: ["A breast abscess, sepsis signs, or persistent fever after antibiotics needs escalation."]
    },
    "meniere disease": {
      medicationsCommonlyUsed: ["meclizine", "ondansetron", "promethazine", "hydrochlorothiazide", "diazepam"],
      treatments: [
        "Medication treatment: meclizine may reduce vertigo, ondansetron or promethazine may help nausea, hydrochlorothiazide may be used to reduce fluid pressure, and diazepam may be used short-term for severe vertigo when ordered.",
        "Low-sodium diet, fall precautions, and hearing/tinnitus support are key."
      ],
      nclexTraps: ["Vertigo attacks create fall risk. Do not tell a client to drive during active symptoms."]
    },
    "narcissistic personality disorder": {
      medicationsCommonlyUsed: ["sertraline", "fluoxetine", "venlafaxine", "quetiapine", "olanzapine"],
      treatments: [
        "Medication treatment: no medication cures narcissistic personality disorder. Medications may target comorbid depression, anxiety, insomnia, or severe mood instability.",
        "Examples include sertraline, fluoxetine, venlafaxine, quetiapine, or olanzapine when clinically indicated."
      ],
      nclexTraps: ["Use clear boundaries, avoid power struggles, and assess safety or comorbid mood symptoms."]
    },
    "obsessive-compulsive disorder": {
      medicationsCommonlyUsed: ["fluoxetine", "sertraline", "fluvoxamine", "paroxetine", "clomipramine"],
      treatments: [
        "Medication treatment: SSRIs such as fluoxetine, sertraline, fluvoxamine, or paroxetine are common first-line options. Clomipramine is a tricyclic option for OCD.",
        "Exposure and response prevention therapy is high yield and often combined with medication."
      ],
      nclexTraps: ["Do not rush rituals abruptly. Set limits therapeutically and support exposure-based treatment."]
    },
    "otitis media": {
      medicationsCommonlyUsed: ["amoxicillin", "cefdinir", "ceftriaxone", "acetaminophen", "ibuprofen"],
      treatments: [
        "Medication treatment: amoxicillin is a common first-line antibiotic when antibiotics are indicated. Cefdinir or ceftriaxone may be used in selected cases. Acetaminophen or ibuprofen helps pain and fever.",
        "Observation may be appropriate for selected low-risk children depending on age/severity and provider guidance."
      ],
      nclexTraps: ["Pain control matters. Watch mastoiditis signs, persistent fever, ear protrusion, swelling, or neurologic symptoms."]
    },
    "panic disorder": {
      medicationsCommonlyUsed: ["sertraline", "fluoxetine", "paroxetine", "venlafaxine", "lorazepam", "clonazepam"],
      treatments: [
        "Medication treatment: SSRIs such as sertraline, fluoxetine, or paroxetine and SNRIs such as venlafaxine are common long-term therapies. Lorazepam or clonazepam may be short-term bridge therapy when ordered.",
        "Cognitive behavioral therapy and breathing/grounding skills are important."
      ],
      nclexTraps: ["First rule out medical mimics such as hypoglycemia, dysrhythmia, hyperthyroidism, or substance use if symptoms are new or atypical."]
    },
    "patent foramen ovale": {
      medicationsCommonlyUsed: ["aspirin", "clopidogrel", "warfarin", "apixaban"],
      treatments: [
        "Medication treatment: many patent foramen ovale cases need no medication. If stroke risk or cryptogenic stroke is part of the picture, aspirin, clopidogrel, warfarin, or apixaban may be used depending on provider plan.",
        "Device closure is considered for selected clients."
      ],
      nclexTraps: ["Think paradoxical embolus when venous clot symptoms and stroke/TIA symptoms connect."]
    },
    "pelvic inflammatory disease": {
      medicationsCommonlyUsed: ["ceftriaxone", "doxycycline", "metronidazole"],
      treatments: [
        "Medication treatment: pelvic inflammatory disease is commonly treated with broad coverage such as ceftriaxone plus doxycycline plus metronidazole.",
        "Treat partners, avoid sex until treatment is complete, and assess pregnancy/ectopic risk."
      ],
      nclexTraps: ["Shoulder pain, syncope, severe unilateral pelvic pain, or positive pregnancy test can indicate ectopic pregnancy, not routine PID."]
    },
    "placenta accreta spectrum": {
      medicationsCommonlyUsed: ["oxytocin", "tranexamic acid", "misoprostol"],
      treatments: [
        "Medication treatment: no medication detaches an abnormally adherent placenta. Planned delivery with hemorrhage preparation is central.",
        "Oxytocin, tranexamic acid, or misoprostol may be used for hemorrhage management when ordered, but surgery and blood replacement are often the key interventions."
      ],
      nclexTraps: ["Do not pull aggressively on the cord if accreta is suspected. Prepare for hemorrhage and possible hysterectomy."]
    },
    "placenta previa": {
      medicationsCommonlyUsed: ["betamethasone", "magnesium sulfate", "oxytocin"],
      treatments: [
        "Medication treatment: no medication moves the placenta. Betamethasone may be given for fetal lung maturity if preterm delivery risk exists, magnesium sulfate may be used for fetal neuroprotection in selected preterm situations, and oxytocin may be used after delivery for uterine tone when appropriate.",
        "Pelvic rest, bleeding monitoring, fetal monitoring, and delivery planning are central."
      ],
      nclexTraps: ["Painless bright-red bleeding after midpregnancy means avoid vaginal exam until placenta location is known."]
    },
    "pleural effusion": {
      medicationsCommonlyUsed: ["furosemide", "ceftriaxone", "vancomycin", "morphine"],
      treatments: [
        "Medication treatment: treat the cause. Furosemide may help heart-failure effusions, antibiotics such as ceftriaxone or vancomycin may be used for infectious effusions/empyema, and morphine may be used for severe dyspnea or pain when ordered.",
        "Thoracentesis or chest drainage may be needed for large, symptomatic, malignant, or infected effusions."
      ],
      nclexTraps: ["Worsening dyspnea, tracheal shift, hypoxia, fever, or post-thoracentesis pneumothorax signs require escalation."]
    },
    "pressure injuries": {
      medicationsCommonlyUsed: ["acetaminophen", "morphine", "mupirocin", "silver sulfadiazine"],
      treatments: [
        "Medication treatment: no systemic medication heals a pressure injury without pressure relief, nutrition, moisture control, and wound care. Acetaminophen or morphine may be used for pain. Mupirocin, silver sulfadiazine, or systemic antibiotics may be used only when infection or wound plan indicates.",
        "Offloading, turning schedule, nutrition/protein support, moisture management, and staging are core nursing actions."
      ],
      nclexTraps: ["Do not massage reddened skin. Stage correctly and treat pressure as the cause."]
    },
    "ptsd": {
      medicationsCommonlyUsed: ["sertraline", "paroxetine", "fluoxetine", "prazosin"],
      treatments: [
        "Medication treatment: sertraline, paroxetine, or fluoxetine may be used for PTSD symptoms. Prazosin may be used for trauma-related nightmares when ordered.",
        "Trauma-focused psychotherapy and safety planning are central."
      ],
      nclexTraps: ["Avoid forcing detailed trauma retelling in an unsafe or unstable moment. Assess suicide risk, sleep, substance use, and triggers."]
    },
    "pyelonephritis": {
      medicationsCommonlyUsed: ["ceftriaxone", "ciprofloxacin", "levofloxacin", "trimethoprim", "sulfamethoxazole", "ampicillin", "gentamicin"],
      treatments: [
        "Medication treatment: antibiotics depend on severity, pregnancy status, resistance patterns, and cultures. Examples include ceftriaxone, ciprofloxacin, levofloxacin, trimethoprim plus sulfamethoxazole, or inpatient regimens such as ampicillin plus gentamicin.",
        "Hydration, fever/pain control, urine culture, and sepsis screening matter."
      ],
      nclexTraps: ["Fever, flank pain, chills, nausea/vomiting, pregnancy, or sepsis signs make this more serious than uncomplicated cystitis."]
    },
    "rabies": {
      medicationsCommonlyUsed: ["acetaminophen", "lorazepam"],
      treatments: [
        "Medication treatment: no reliable medication reverses symptomatic rabies. Prevention through urgent postexposure prophylaxis before symptoms is the emergency priority.",
        "Acetaminophen may be used for fever/pain and lorazepam may be used for severe agitation or seizures when ordered, but these are supportive."
      ],
      nclexTraps: ["A bite exposure needs immediate wound washing, reporting, and postexposure planning. Waiting for symptoms is unsafe."]
    },
    "retinal detachment": {
      medicationsCommonlyUsed: ["prednisolone eye drops", "ciprofloxacin ophthalmic", "acetaminophen"],
      treatments: [
        "Medication treatment: laser repair, cryotherapy, pneumatic retinopexy, scleral buckle, or vitrectomy is definitive. Prednisolone eye drops, ciprofloxacin ophthalmic, or acetaminophen may be used after procedures when ordered.",
        "Positioning instructions may be critical after gas bubble placement."
      ],
      nclexTraps: ["Flashes, floaters, curtain-like vision loss, or sudden field defect is urgent."]
    },
    "rheumatic fever": {
      medicationsCommonlyUsed: ["penicillin G", "aspirin", "ibuprofen", "prednisone"],
      treatments: [
        "Medication treatment: penicillin G treats group A streptococcal infection and prevents recurrence. Aspirin or ibuprofen may be used for arthritis/inflammation, and prednisone may be used for severe carditis when ordered.",
        "Long-term antibiotic prophylaxis may be needed to prevent recurrent rheumatic fever."
      ],
      nclexTraps: ["Untreated strep throat can lead to carditis and valve damage. Migratory polyarthritis plus new murmur is a major cue."]
    },
    "rotator cuff tear": {
      medicationsCommonlyUsed: ["ibuprofen", "naproxen", "acetaminophen", "prednisone"],
      treatments: [
        "Medication treatment: ibuprofen, naproxen, or acetaminophen may reduce pain. Corticosteroid therapy such as prednisone or local steroid injection may be used in selected cases, but physical therapy or surgery may be needed for major tears.",
        "Rest, ice, strengthening, range-of-motion guidance, and postoperative teaching matter."
      ],
      nclexTraps: ["Weakness with overhead movement or inability to abduct after injury is more than soreness."]
    },
    "rubella": {
      medicationsCommonlyUsed: ["acetaminophen", "MMR vaccine"],
      treatments: [
        "Medication treatment: no antiviral cures rubella. Acetaminophen may be used for fever or discomfort. MMR vaccine prevents rubella but is not given during pregnancy.",
        "Pregnancy exposure is high risk because congenital rubella can cause fetal harm."
      ],
      nclexTraps: ["Check immunity before pregnancy when possible. Live vaccines are avoided during pregnancy."]
    },
    "schizophrenia": {
      medicationsCommonlyUsed: ["haloperidol", "risperidone", "olanzapine", "quetiapine", "aripiprazole", "clozapine"],
      treatments: [
        "Medication treatment: antipsychotics are the core drug therapy. Examples include haloperidol, risperidone, olanzapine, quetiapine, aripiprazole, and clozapine.",
        "Monitor extrapyramidal symptoms, metabolic syndrome, QT risk, sedation, adherence, safety, and clozapine ANC requirements."
      ],
      nclexTraps: ["Command hallucinations, suicidality, inability to care for self, and medication adverse effects are priority cues."]
    },
    "scoliosis": {
      medicationsCommonlyUsed: ["acetaminophen", "ibuprofen", "morphine"],
      treatments: [
        "Medication treatment: no medication straightens scoliosis. Bracing, observation, physical therapy, and surgery are used based on curve severity and growth.",
        "Acetaminophen or ibuprofen may be used for discomfort. Morphine may be used for severe postoperative pain when ordered."
      ],
      nclexTraps: ["After spinal fusion, monitor neurologic status, pain, respiratory function, wound drainage, and logrolling/spinal precautions."]
    },
    "shoulder dystocia": {
      medicationsCommonlyUsed: ["oxytocin", "misoprostol", "methylergonovine", "carboprost"],
      treatments: [
        "Medication treatment: no medication releases the impacted shoulder. Maneuvers and emergency obstetric response are definitive.",
        "After delivery, oxytocin, misoprostol, methylergonovine, or carboprost may be used if postpartum hemorrhage occurs and is not contraindicated."
      ],
      nclexTraps: ["Call for help, McRoberts maneuver, suprapubic pressure, and avoid fundal pressure."]
    },
    "sids": {
      medicationsCommonlyUsed: [],
      treatments: [
        "Medication treatment: no medication prevents SIDS. Prevention is safe sleep: supine position, firm flat surface, no loose bedding, no overheating, and smoke-free environment.",
        "Emergency response after an event focuses on resuscitation and family support."
      ],
      nclexTraps: ["Do not recommend side sleeping, pillows, blankets, or bed-sharing as prevention."]
    },
    "slipped capital femoral epiphysis": {
      medicationsCommonlyUsed: ["acetaminophen", "ibuprofen", "morphine"],
      treatments: [
        "Medication treatment: no medication corrects slipped capital femoral epiphysis. Urgent non-weight-bearing and surgical pinning are definitive.",
        "Acetaminophen, ibuprofen, or morphine may be used for pain when ordered."
      ],
      nclexTraps: ["Adolescent hip, groin, thigh, or knee pain with limp needs urgent orthopedic evaluation. Do not encourage walking it off."]
    },
    "somatic symptom disorder": {
      medicationsCommonlyUsed: ["sertraline", "fluoxetine", "duloxetine"],
      treatments: [
        "Medication treatment: no medication removes the disorder itself. Sertraline, fluoxetine, or duloxetine may help comorbid anxiety/depression or pain syndromes.",
        "Consistent follow-up, validation without unnecessary testing, and functional goals are key."
      ],
      nclexTraps: ["Do not dismiss symptoms as fake. Assess safety while avoiding reinforcement of repeated unnecessary testing."]
    },
    "spinal cord compression": {
      medicationsCommonlyUsed: ["dexamethasone", "morphine", "fentanyl"],
      treatments: [
        "Medication treatment: dexamethasone is commonly used for suspected malignant spinal cord compression to reduce edema. Morphine or fentanyl may be used for severe pain.",
        "Radiation, surgery, or chemotherapy depends on cause and urgency."
      ],
      nclexTraps: ["New weakness, sensory loss, saddle anesthesia, or bowel/bladder dysfunction is urgent."]
    },
    "squamous cell carcinoma": {
      medicationsCommonlyUsed: ["fluorouracil", "cisplatin", "acetaminophen"],
      treatments: [
        "Medication treatment: surgery or local destruction is common for skin squamous cell carcinoma. Fluorouracil may be used for in-situ lesions/field therapy, and cisplatin may be used in selected advanced disease.",
        "Acetaminophen may be used for procedure-related discomfort when appropriate."
      ],
      nclexTraps: ["Nonhealing scaly lesion, ulceration, bleeding, rapid growth, or immunosuppression increases concern."]
    },
    "substance use disorders": {
      medicationsCommonlyUsed: ["naltrexone", "acamprosate", "disulfiram", "methadone", "buprenorphine", "naloxone", "nicotine patch", "varenicline"],
      treatments: [
        "Medication treatment: treatment depends on substance. Alcohol use disorder may use naltrexone, acamprosate, or disulfiram. Opioid use disorder may use methadone or buprenorphine, and naloxone reverses opioid overdose. Nicotine patch or varenicline may support tobacco cessation.",
        "Behavioral therapy, withdrawal safety, relapse prevention, and harm reduction matter."
      ],
      nclexTraps: ["Withdrawal can be life-threatening for alcohol and benzodiazepines. Opioid withdrawal is miserable but usually not the same seizure/delirium risk."]
    },
    "testicular cancer": {
      medicationsCommonlyUsed: ["cisplatin", "etoposide", "bleomycin"],
      treatments: [
        "Medication treatment: orchiectomy is usually diagnostic and therapeutic first. Chemotherapy may include cisplatin, etoposide, and bleomycin depending on type and stage.",
        "Fertility preservation discussion before therapy is important."
      ],
      nclexTraps: ["Painless testicular mass is cancer until proven otherwise. Do not delay evaluation."]
    },
    "urinary retention": {
      medicationsCommonlyUsed: ["tamsulosin", "finasteride", "bethanechol"],
      treatments: [
        "Medication treatment: tamsulosin relaxes smooth muscle in benign prostatic hyperplasia, finasteride shrinks prostate tissue over time, and bethanechol may be used for selected nonobstructive bladder atony.",
        "Bladder scan, catheterization, renal function, infection risk, and obstruction evaluation are priorities."
      ],
      nclexTraps: ["A distended bladder, severe pain, hydronephrosis, fever, or acute kidney injury changes this into an urgent problem."]
    },
    "vasa previa": {
      medicationsCommonlyUsed: ["betamethasone", "magnesium sulfate"],
      treatments: [
        "Medication treatment: no medication moves fetal vessels away from the cervix. Betamethasone may be used for fetal lung maturity and magnesium sulfate may be used for fetal neuroprotection in selected preterm situations.",
        "Planned cesarean before labor/rupture and emergency response to bleeding are central."
      ],
      nclexTraps: ["Painless bleeding after rupture of membranes with fetal heart-rate abnormalities can be fetal hemorrhage. This is an emergency."]
    },
    "vesicoureteral reflux": {
      medicationsCommonlyUsed: ["nitrofurantoin", "trimethoprim", "sulfamethoxazole"],
      treatments: [
        "Medication treatment: low-dose antibiotic prophylaxis may be used in selected children, commonly nitrofurantoin or trimethoprim plus sulfamethoxazole. Surgery may be needed for severe reflux or recurrent kidney infections.",
        "Monitor febrile urinary infections, renal scarring risk, hydration, and follow-up imaging."
      ],
      nclexTraps: ["A fever in a child with urinary history can mean upper-tract infection risk, not just a minor bladder issue."]
    },
    "west nile virus": {
      medicationsCommonlyUsed: ["acetaminophen", "lorazepam", "levetiracetam"],
      treatments: [
        "Medication treatment: no specific antiviral cures West Nile virus. Care is supportive. Acetaminophen may be used for fever/pain, and lorazepam or levetiracetam may be used if seizures occur when ordered.",
        "Severe neuroinvasive disease needs airway, neurologic, and supportive ICU-level monitoring."
      ],
      nclexTraps: ["Older adults and immunocompromised clients are at higher risk for encephalitis, meningitis, weakness, and respiratory failure."]
    }
  };

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const unique = (...values) => [...new Set(values.flatMap((value) => Array.isArray(value) ? value : value ? [value] : []).filter(Boolean))];
  const normalizedUpdates = Object.fromEntries(Object.entries(updates).map(([key, value]) => [normalize(key), value]));
  const keyFor = (entry) => normalize(entry.name || entry.displayName || "");
  const updateFor = (entry) => {
    const keys = [keyFor(entry), ...((entry.aliases || []).map(normalize))].filter(Boolean);
    return keys.map((key) => normalizedUpdates[key]).find(Boolean);
  };

  for (const disease of db.diseases || []) {
    const update = updateFor(disease);
    if (!update) continue;
    disease.medicationsCommonlyUsed = unique(disease.medicationsCommonlyUsed, update.medicationsCommonlyUsed);
    disease.treatments = unique(disease.treatments, update.treatments);
    disease.nursingPriorities = unique(disease.nursingPriorities, update.nursingPriorities);
    disease.nclexTraps = unique(disease.nclexTraps, update.nclexTraps);
    disease.tags = unique(disease.tags, "medication-treatment-reviewed");
    disease.sourceKeys = unique(disease.sourceKeys, "pathology-medication-treatment-supplement");
    disease.medicationTreatmentReviewed = true;
  }

  db.version = [db.version, "pathology-medication-treatment-supplement-v1"].filter(Boolean).join("+");
  window.ANI_PATHOLOGY_DATABASE = db;
})();
