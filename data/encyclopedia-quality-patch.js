/* eslint-disable */
(function () {
  const pharm = window.ANI_PHARM_DATABASE || { drugs: [], labRanges: [] };
  const pathology = window.ANI_PATHOLOGY_DATABASE || { diseases: [] };

  pharm.labRanges = Array.isArray(pharm.labRanges) ? pharm.labRanges : [];
  pathology.diseases = Array.isArray(pathology.diseases) ? pathology.diseases : [];

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const unique = (items) => {
    const seen = new Set();
    const output = [];
    (items || []).forEach((item) => {
      if (item && typeof item === "object") {
        let key = "";
        try {
          key = `object:${JSON.stringify(item)}`;
        } catch {
          key = `object:${output.length}`;
        }
        if (seen.has(key)) return;
        seen.add(key);
        output.push(item);
        return;
      }
      const value = String(item ?? "").trim();
      if (!value) return;
      const key = `scalar:${value}`;
      if (seen.has(key)) return;
      seen.add(key);
      output.push(value);
    });
    return output;
  };

  function mergeEntry(existing, incoming) {
    Object.entries(incoming).forEach(([key, value]) => {
      if (key.startsWith("__")) return;
      const replaceArrays = new Set(Array.isArray(incoming.__replaceArrays) ? incoming.__replaceArrays : []);
      if (Array.isArray(value)) {
        existing[key] = replaceArrays.has(key)
          ? unique(value)
          : unique([...(Array.isArray(existing[key]) ? existing[key] : []), ...value]);
      } else if (value && typeof value === "object") {
        existing[key] = { ...(existing[key] || {}), ...value };
      } else if (value !== undefined && value !== null && value !== "") {
        existing[key] = value;
      } else if (typeof value === "boolean") {
        existing[key] = value;
      }
    });
    existing.aliases = unique([...(existing.aliases || []), ...(incoming.aliases || [])]);
    return existing;
  }

  function upsert(list, incoming) {
    const incomingPrimaryNames = unique([
      incoming.name,
      incoming.title,
      incoming.generic,
      incoming.displayName
    ]).map(normalize).filter(Boolean);
    const incomingAliases = unique(incoming.aliases || []).map(normalize).filter(Boolean);
    let existing = list.find((entry) => {
      const entryPrimaryNames = unique([
        entry.name,
        entry.title,
        entry.generic,
        entry.displayName
      ]).map(normalize).filter(Boolean);
      return entryPrimaryNames.some((name) => incomingPrimaryNames.includes(name));
    });
    if (!existing) {
      existing = list.find((entry) => {
        const entryPrimaryNames = unique([
          entry.name,
          entry.title,
          entry.generic,
          entry.displayName
        ]).map(normalize).filter(Boolean);
        const entryAliases = unique(entry.aliases || []).map(normalize).filter(Boolean);
        return incomingPrimaryNames.some((name) => entryAliases.includes(name))
          || entryPrimaryNames.some((name) => incomingAliases.includes(name));
      });
    }
    if (!existing) {
      existing = {};
      list.push(existing);
    }
    mergeEntry(existing, incoming);
  }

  function dedupeByPrimaryName(list) {
    const seen = new Map();
    for (let index = list.length - 1; index >= 0; index -= 1) {
      const entry = list[index];
      const key = normalize(entry.name || entry.title || entry.generic || entry.displayName);
      if (!key) continue;
      if (!seen.has(key)) {
        seen.set(key, entry);
        continue;
      }
      const keeper = seen.get(key);
      mergeEntry(keeper, entry);
      list.splice(index, 1);
    }
  }

  function consolidateKnownPathologyVariants(list) {
    const groups = [
      { canonical: "Fracture", variants: ["Fractures"] }
    ];
    groups.forEach(({ canonical, variants }) => {
      const canonicalEntry = list.find((entry) => normalize(entry.name || entry.title) === normalize(canonical));
      if (!canonicalEntry) return;
      variants.forEach((variantName) => {
        const variantEntry = list.find((entry) => entry !== canonicalEntry
          && normalize(entry.name || entry.title) === normalize(variantName));
        if (!variantEntry) return;
        const aliases = unique([
          ...(canonicalEntry.aliases || []),
          ...(variantEntry.aliases || []),
          variantName
        ]).filter((alias) => normalize(alias) !== normalize(canonical));
        const consolidated = { ...variantEntry, name: canonical, aliases };
        Object.keys(canonicalEntry).forEach((key) => delete canonicalEntry[key]);
        Object.assign(canonicalEntry, consolidated);
        const variantIndex = list.indexOf(variantEntry);
        if (variantIndex >= 0) list.splice(variantIndex, 1);
      });
    });
  }

  const PHARM_IMPORTER_FILLER_RE = /\b(expanded medication reference|expanded reference entry|medication reference entry|recognition only|name recognition|class matching|interaction screening|included as a pharmacology reference|connect the drug class|not encoded|not stored|not fully curated|current prescribing label|current prescribing information|current drug labeling|verify current label|verify the current|verify the exact product|use depends on the approved indication|used according to its labeled indication|used in [a-z, /-]+ contexts|for nclex study, connect|works through its drug class|works through its [^.]+ pharmacology|tie the mechanism|expected action should match|mechanism depends on the individual medication|mechanism depends on the drug class|intended therapeutic effect|class reference for medications|exact boxed-warning status|used when its pharmacologic effect fits|most important clinical anchors)\b/i;
  const PHARM_APP_META_RE = /\bANI\b|offline encyclopedia|offline index|installed .* encyclopedia|expanded-index entry/i;
  const PATHOLOGY_IMPORTER_FILLER_RE = /\b(NCLEX-relevant condition|NCLEX-relevant [^.]+ condition|focus on the underlying body-system disruption|condition-specific pain, function change, vital-sign change, or mental-status change|Common causes and risks depend on the specific client context|Do not memorize the label only|Do not memorize only the diagnosis name|Teach the specific warning signs that require urgent care|History or exposure pattern consistent with|age-specific risks when pediatric, geriatric, pregnant, immunocompromised, postoperative, or critically ill|subtle or atypical presentation in older adults, newborns, and immunocompromised clients|age-specific assessment|growth\/development trend|vital signs by age|Avoid assuming a single protocol fits every client|Clinically important findings come from the physiologic stress|condition-specific imaging\/labs|condition-specific labs or imaging|condition-specific labs|affected body system, safety risk, and likely complication pattern|Focused assessment and vital-sign trend|Stabilize airway, breathing, circulation|stabilize ABCs|give antidote when indicated|treat shock and dysrhythmias|support airway\/hydration\/nutrition|use weight-based dosing|protect family education and safety|prepare referral or surgery for congenital conditions when indicated|Know the personal red flags that require urgent care|Take prescribed therapy as directed|Keep follow-up appointments)\b/i;
  const PATHOLOGY_PROFILE_FILLER_EXACT = new Set([
    "primary survey",
    "vital-sign trend",
    "toxicology/medication history",
    "prepare procedures, surgery, or ICU support",
    "support ABCs",
    "give specific antidote when indicated",
    "prevent further absorption when appropriate and ordered",
    "pulse oximetry trend",
    "work of breathing",
    "lung sounds",
    "chest x-ray or CT when ordered",
    "ABG/VBG when ventilation or acid-base status is unclear",
    "sputum testing when infection is suspected",
    "position upright",
    "support oxygenation",
    "give bronchodilators, steroids, antibiotics, anticoagulation, or ventilatory support when indicated",
    "treat the trigger",
    "correct the hormone/electrolyte problem safely",
    "replace deficits slowly when needed",
    "treat emergencies before teaching",
    "use ordered endocrine therapy and monitoring",
    "protect the affected organ",
    "avoid pressure or unsafe manipulation",
    "give ordered antimicrobials, drops, steroids, or procedure support",
    "focused assessment",
    "history and risk-factor review",
    "treat the underlying cause",
    "support airway, breathing, circulation, fluids, pain, safety, and infection control as indicated"
  ].map((item) => item.toLowerCase()));
  const PATHOLOGY_PROFILE_FILLER_BUNDLE_RE = /\b(primary survey\s*\|\s*vital-sign trend\s*\|\s*ECG|pulse oximetry trend\s*\|\s*work of breathing\s*\|\s*lung sounds|position upright\s*\|\s*support oxygenation\s*\|\s*give bronchodilators|correct the hormone\/electrolyte problem safely\s*\|\s*replace deficits slowly|protect the affected organ\s*\|\s*avoid pressure|focused assessment\s*\|\s*vital-sign trend\s*\|\s*history and risk-factor review|treat the underlying cause\s*\|\s*support airway, breathing, circulation)/i;
  const PATHOLOGY_GENERIC_COMPLICATION_BUNDLE = new Set([
    "organ dysfunction",
    "shock",
    "infection",
    "bleeding",
    "long-term functional impairment when not treated promptly"
  ]);
  const PATHOLOGY_GENERIC_PATIENT_EDUCATION = new Set([
    "Know the personal red flags that require urgent care.",
    "Take prescribed therapy as directed and verify before stopping high-risk medication.",
    "Keep follow-up appointments and monitoring labs/tests."
  ]);

  const PATHOLOGY_CRASH_OPENING_OVERRIDES = {
    "cerebral contusion": "Cerebral contusion is a focal brain bruise from head trauma where small vessels leak blood and edema into injured cortex. The danger is expanding swelling or hemorrhage that raises intracranial pressure and worsens neurologic function.",
    "cholinergic toxicity": "Cholinergic toxicity is excess acetylcholine at muscarinic and nicotinic receptors, classically from organophosphates, carbamates, or cholinergic drugs. Secretions, bronchospasm, bradycardia, diarrhea, sweating, fasciculations, weakness, seizures, and respiratory failure define the risk pattern.",
    "chronic lymphocytic leukemia": "Chronic lymphocytic leukemia is a slow-growing clonal B-lymphocyte leukemia in which abnormal mature-appearing lymphocytes accumulate in blood, marrow, lymph nodes, spleen, or liver. The fast recognition frame is older adult, persistent lymphocytosis, painless lymphadenopathy, fatigue, infection risk, anemia, thrombocytopenia, autoimmune cytopenias, and possible watchful waiting until symptomatic or progressive.",
    "chronic myeloid leukemia": "Chronic myeloid leukemia is a myeloproliferative leukemia driven in most cases by the Philadelphia chromosome BCR-ABL1 tyrosine kinase. It overproduces granulocytic white cells, often with basophilia and splenomegaly; the key mental hook is chronic-phase disease that can accelerate or blast-transform if not controlled with targeted tyrosine kinase therapy.",
    "chronic rejection": "Chronic rejection is slow immune-mediated graft injury with vascular narrowing, fibrosis, and progressive loss of organ function months to years after transplant. It is less explosive than hyperacute rejection but often causes irreversible decline.",
    "chronic respiratory failure": "Chronic respiratory failure is persistent failure of gas exchange, causing long-standing hypoxemia, hypercapnia, or both. COPD, neuromuscular weakness, obesity hypoventilation, and interstitial lung disease can make compensation fragile.",
    "constipation": "Constipation is infrequent or difficult stool passage from slowed transit, hard stool, pelvic-floor dysfunction, obstruction, dehydration, immobility, or constipating medications. The clinical risk is pain, fecal impaction, obstruction-like symptoms, delirium in older adults, and bowel perforation in severe cases.",
    "cushing triad": "Cushing triad is the late high-intracranial-pressure pattern of hypertension with widened pulse pressure, bradycardia, and irregular respirations. It reflects brainstem pressure and falling cerebral perfusion, so it is a neurologic emergency sign.",
    "cyanide poisoning": "Cyanide poisoning blocks mitochondrial cytochrome oxidase, so cells cannot use oxygen even when oxygen delivery is present. Severe lactic acidosis, altered mental status, seizures, cardiovascular collapse, and smoke-inhalation context are key clues.",
    "delirium after surgery": "Delirium after surgery is acute fluctuating inattention and disorganized thinking after anesthesia, pain, sleep disruption, medications, infection, hypoxia, metabolic disturbance, or withdrawal. It is brain dysfunction from physiologic stress, not normal confusion.",
    "delirium tremens": "Delirium tremens is severe alcohol withdrawal with autonomic hyperactivity and delirium, usually after abrupt reduction in heavy alcohol use. Tremor, agitation, hallucinations, fever, hypertension, tachycardia, seizures, dehydration, and electrolyte derangements can become fatal.",
    "dependent personality disorder": "Dependent personality disorder is a persistent pattern of excessive need to be cared for, leading to submissive behavior, separation fear, and difficulty making decisions without reassurance. The nursing issue is supporting autonomy while assessing safety, abuse risk, and comorbid anxiety or depression.",
    "diabetic neuropathy": "Diabetic neuropathy is nerve injury from chronic hyperglycemia, microvascular damage, oxidative stress, and metabolic injury to peripheral or autonomic nerves. Burning pain, numbness, loss of protective sensation, gastroparesis, orthostasis, and foot-ulcer risk make assessment practical.",
    "diarrhea": "Diarrhea is excessive loose or watery stool from infection, inflammation, malabsorption, medication effect, tube feeding intolerance, endocrine causes, or bowel disease. The danger is dehydration, electrolyte loss, skin breakdown, sepsis clues, and C. difficile when antibiotic exposure fits.",
    "diffuse axonal injury": "Diffuse axonal injury is widespread shearing of white-matter axons during rapid acceleration-deceleration trauma. Clients may have coma or severe neurologic dysfunction even when early CT findings look subtle.",
    "digoxin toxicity": "Digoxin toxicity is excessive cardiac glycoside effect causing increased vagal tone and disrupted sodium-potassium ATPase physiology. GI symptoms, confusion, visual changes, bradycardia, AV block, ventricular dysrhythmias, and hyperkalemia in acute overdose are high-yield clues.",
    "dysphagia": "Dysphagia is impaired swallowing from oropharyngeal, esophageal, neurologic, muscular, obstructive, or inflammatory causes. The immediate nursing concern is aspiration, poor nutrition/hydration, medication safety, and identifying stroke or airway red flags.",
    "empyema": "Empyema is pus in the pleural space, usually from pneumonia, thoracic surgery, trauma, or esophageal rupture. Infected fluid traps the lung and drives fever, pleuritic pain, dyspnea, sepsis risk, and need for drainage plus antimicrobials.",
    "epidural hematoma": "Epidural hematoma is arterial bleeding between skull and dura, classically after temporal bone trauma injures the middle meningeal artery. A lucid interval followed by rapid decline, ipsilateral pupil dilation, and herniation risk make it a neurosurgical emergency.",
    "fecal impaction": "Fecal impaction is a hardened stool mass trapped in the rectum or colon that the client cannot pass. It can cause pain, anorexia, urinary retention, obstruction, overflow diarrhea, delirium, or stercoral ulceration.",
    "flail chest": "Flail chest is multiple adjacent rib fractures creating a free-floating chest wall segment that moves paradoxically with breathing. Pain, poor ventilation, pulmonary contusion, hypoxemia, and respiratory fatigue drive deterioration.",
    "gastric cancer": "Gastric cancer is a malignant tumor of the stomach, usually adenocarcinoma, that can ulcerate, bleed, obstruct gastric emptying, or spread before symptoms are obvious. Weight loss, early satiety, persistent epigastric pain, iron-deficiency anemia, occult bleeding, dysphagia, vomiting, H. pylori history, and alarm features matter more than treating it like routine dyspepsia.",
    "hand foot mouth disease": "Hand-foot-mouth disease is a contagious enteroviral illness, often coxsackievirus, causing oral ulcers and vesicular rash on hands, feet, buttocks, or extremities. Dehydration from painful mouth lesions is the main nursing risk in children.",
    "hemophilia": "Hemophilia is inherited factor VIII or IX deficiency causing impaired clot formation with deep bleeding into joints, muscles, soft tissue, or after procedures. Hemarthrosis, intracranial bleeding risk, and factor replacement timing are the core safety issues.",
    "hemorrhoids": "Hemorrhoids are enlarged vascular cushions in the anal canal caused by venous engorgement, straining, pregnancy, constipation, or portal pressure. They can cause bright red bleeding, itching, pain if thrombosed, and confusion with more serious rectal bleeding.",
    "hepatopulmonary syndrome": "Hepatopulmonary syndrome is hypoxemia from liver disease causing intrapulmonary vascular dilation and abnormal oxygen diffusion. Platypnea, orthodeoxia, cirrhosis signs, low oxygen saturation, and transplant evaluation context matter.",
    "hiatal hernia": "Hiatal hernia is herniation of the stomach through the diaphragm hiatus into the chest. It can weaken the gastroesophageal junction, promoting reflux, dysphagia, chest/epigastric discomfort, or volvulus risk in large paraesophageal hernias.",
    "hodgkin lymphoma": "Hodgkin lymphoma is a lymphoid cancer defined by Hodgkin/Reed-Sternberg cells in an inflammatory background, often presenting with painless lymphadenopathy and possible B symptoms. It tends to spread in a more orderly nodal pattern than many non-Hodgkin lymphomas, so staging, bulky mediastinal disease, fever, night sweats, weight loss, and treatment toxicity monitoring are central.",
    "hyperacute rejection": "Hyperacute rejection is immediate antibody-mediated transplant failure caused by preformed recipient antibodies against donor antigens. Complement activation thromboses graft vessels within minutes to hours, causing abrupt ischemia and graft loss.",
    "hypoplastic left heart syndrome": "Hypoplastic left heart syndrome is a congenital defect where the left ventricle, aorta, and mitral/aortic valves are underdeveloped. Systemic blood flow depends on ductus arteriosus patency, so closure can cause shock, cyanosis, and acidosis.",
    "hypoxemia": "Hypoxemia is abnormally low oxygen level in arterial blood, usually from V/Q mismatch, shunt, diffusion limitation, hypoventilation, or low inspired oxygen. It is measured by PaO2 or oxygen saturation and can progress to tissue hypoxia.",
    "icu delirium": "ICU delirium is acute brain dysfunction in critical illness with fluctuating attention, awareness, and cognition. Sedatives, sepsis, hypoxia, sleep disruption, pain, immobility, metabolic derangement, and ventilation all contribute.",
    "idiopathic pulmonary fibrosis": "Idiopathic pulmonary fibrosis is progressive scarring of lung interstitium without a known cause, producing stiff lungs and impaired oxygen diffusion. Exertional dyspnea, dry cough, crackles, clubbing, low diffusion capacity, and honeycombing on HRCT are classic.",
    "ileus": "Ileus is functional bowel paralysis where peristalsis slows or stops without a mechanical blockage. Postoperative stress, opioids, electrolyte abnormalities, inflammation, or severe illness can cause distention, nausea/vomiting, absent bowel sounds, and feeding intolerance.",
    "iron overdose": "Iron overdose is corrosive and systemic iron toxicity, often after acute ingestion, causing GI bleeding, shock, metabolic acidosis, hepatic injury, and mitochondrial dysfunction. A deceptive latent phase can occur before severe deterioration.",
    "iron poisoning": "Iron poisoning is toxic iron exposure that injures GI mucosa and overwhelms transferrin, leaving free iron to damage mitochondria, liver, and cardiovascular function. Vomiting, abdominal pain, shock, acidosis, and hepatic failure are danger signs.",
    "irritable bowel syndrome": "Irritable bowel syndrome is a disorder of gut-brain interaction causing recurrent abdominal pain linked to stool frequency or form without structural damage. Visceral hypersensitivity, motility changes, stress pathways, and diet triggers drive symptoms.",
    "large bowel obstruction": "Large bowel obstruction is blockage of colonic flow, often from cancer, volvulus, diverticular stricture, fecal impaction, or hernia. Progressive distention, pain, constipation/obstipation, vomiting, ischemia, and perforation risk guide urgency.",
    "laryngeal cancer": "Laryngeal cancer is malignancy of the voice box, most often squamous cell carcinoma, that can threaten voice, swallowing, and airway protection. Persistent hoarseness, dysphagia, odynophagia, neck mass, ear pain, hemoptysis, smoking/alcohol history, and stridor or airway compromise are the first-read danger cues.",
    "legionnaires disease": "Legionnaires disease is severe pneumonia from Legionella, often acquired from contaminated water aerosols. High fever, GI symptoms, confusion, hyponatremia, relative bradycardia, and severe hypoxemia can distinguish it from routine pneumonia.",
    "leukemia": "Leukemia is malignant clonal proliferation of blood-forming cells in marrow and blood, crowding out normal hematopoiesis. Anemia, infection, bleeding, bone pain, blasts, leukostasis, and tumor lysis risk shape priority.",
    "lithium toxicity": "Lithium toxicity occurs when serum lithium rises, often from dehydration, renal impairment, NSAIDs, ACE inhibitors, ARBs, or diuretics. GI upset, coarse tremor, ataxia, confusion, seizures, dysrhythmias, and nephrogenic diabetes insipidus are key clues.",
    "liver cancer": "Liver cancer usually refers to hepatocellular carcinoma arising from chronically injured hepatocytes, especially with cirrhosis, hepatitis B or C, alcohol-associated liver disease, or metabolic fatty liver disease. The crash-course pattern is weight loss, RUQ pain/fullness, worsening ascites or jaundice, vascular invasion risk, AFP/imaging surveillance context, and fragile hepatic reserve.",
    "liver failure": "Liver failure is loss of hepatic synthetic, detoxifying, metabolic, and bile-handling function. Coagulopathy, encephalopathy, jaundice, hypoglycemia, ascites, infection risk, renal dysfunction, and medication accumulation define severity.",
    "lymphoma": "Lymphoma is malignant proliferation of lymphocytes in lymph nodes, extranodal tissue, marrow, or blood. Painless lymphadenopathy, B symptoms, bulky mass effects, immune dysfunction, and treatment-related tumor lysis risk matter.",
    "mallory weiss tear": "Mallory-Weiss tear is a mucosal laceration at the gastroesophageal junction caused by forceful vomiting, retching, coughing, or straining. It causes upper GI bleeding, often hematemesis after repeated retching.",
    "mechanical valve complications": "Mechanical valve complications include thrombosis, embolic stroke, bleeding from anticoagulation, hemolysis, endocarditis, pannus obstruction, or structural dysfunction. Valve sounds, INR, dyspnea, neurologic deficits, fever, and echo findings guide urgency.",
    "meckel diverticulum": "Meckel diverticulum is a congenital ileal outpouching from persistent vitelline duct tissue that may contain ectopic gastric mucosa. Painless lower GI bleeding, obstruction, diverticulitis, or intussusception can occur.",
    "mesothelioma": "Mesothelioma is malignant cancer of mesothelial lining, most often pleura, strongly associated with asbestos exposure. Progressive dyspnea, pleural effusion, chest pain, weight loss, and restrictive lung mechanics are common.",
    "mitral regurgitation": "Mitral regurgitation is backward blood flow from left ventricle to left atrium during systole because the mitral valve fails to close fully. Volume overload causes murmur, dyspnea, atrial enlargement, pulmonary congestion, and heart failure risk.",
    "mitral stenosis": "Mitral stenosis is narrowing of the mitral valve, often from rheumatic disease, obstructing left atrial emptying into the left ventricle. Left atrial pressure rises, causing pulmonary congestion, atrial fibrillation, thromboembolism, and low output.",
    "mitral valve prolapse": "Mitral valve prolapse is systolic billowing of mitral leaflets into the left atrium, sometimes causing mitral regurgitation. Click-murmur findings, palpitations, atypical chest pain, dysrhythmias, and endocarditis context matter.",
    "mononucleosis": "Mononucleosis is usually Epstein-Barr virus infection causing fever, pharyngitis, lymphadenopathy, fatigue, atypical lymphocytes, and splenomegaly. Avoid contact sports when spleen enlargement raises rupture risk.",
    "multiple myeloma": "Multiple myeloma is malignant plasma-cell proliferation producing monoclonal protein and bone marrow infiltration. CRAB features--hypercalcemia, renal injury, anemia, and bone lesions--plus infection risk and hyperviscosity guide assessment.",
    "muscular dystrophy": "Muscular dystrophy is a group of inherited muscle-degeneration disorders causing progressive weakness from abnormal structural muscle proteins. Respiratory muscle failure, cardiomyopathy, contractures, falls, and loss of mobility are major concerns.",
    "myasthenic crisis": "Myasthenic crisis is life-threatening respiratory or bulbar weakness in myasthenia gravis from impaired neuromuscular transmission. Declining vital capacity, weak cough, dysphagia, ptosis, infection, surgery, or medication triggers require rapid airway planning.",
    "nonalcoholic fatty liver disease": "Nonalcoholic fatty liver disease is hepatic fat accumulation linked to insulin resistance and metabolic risk without heavy alcohol use. It ranges from simple steatosis to steatohepatitis, fibrosis, cirrhosis, and hepatocellular carcinoma risk.",
    "non-hodgkin lymphoma": "Non-Hodgkin lymphoma is a diverse group of B-cell, T-cell, or NK-cell lymphoid cancers that may involve lymph nodes, blood, marrow, skin, GI tract, CNS, or other extranodal sites. Unlike Hodgkin lymphoma, behavior ranges from indolent to explosive; rapid node growth, B symptoms, bulky compression, immune dysfunction, cytopenias, and tumor lysis risk drive triage.",
    "non-small cell lung cancer": "Non-small cell lung cancer is the major lung-cancer category that includes adenocarcinoma, squamous cell carcinoma, and large-cell carcinoma. It often grows and spreads less explosively than small cell lung cancer, so early-stage disease may be surgical, while advanced care depends on stage, histology, driver mutations, PD-L1 status, symptoms, and metastasis pattern.",
    "normal pressure hydrocephalus": "Normal pressure hydrocephalus is enlarged ventricles with gait disturbance, cognitive decline, and urinary incontinence despite often normal measured CSF pressure. The gait change is usually earliest and most reversible with shunting.",
    "obstructive sleep apnea": "Obstructive sleep apnea is recurrent upper-airway collapse during sleep causing intermittent hypoxemia, arousals, sympathetic surges, and fragmented sleep. Snoring, witnessed apneas, daytime sleepiness, hypertension, and arrhythmia risk are key.",
    "open angle glaucoma": "Open-angle glaucoma is chronic optic neuropathy from progressive retinal ganglion cell loss, often associated with impaired aqueous outflow and elevated intraocular pressure. Peripheral vision loss is gradual and often silent until advanced.",
    "opioid overdose": "Opioid overdose is excessive mu-opioid receptor activation causing CNS depression, respiratory depression, miosis, bradycardia, hypotension, and hypoxia. Ventilation and naloxone matter because respiratory failure kills first.",
    "organophosphate poisoning": "Organophosphate poisoning irreversibly inhibits acetylcholinesterase, causing acetylcholine accumulation at muscarinic, nicotinic, and CNS synapses. Bronchorrhea, bronchospasm, bradycardia, diarrhea, sweating, fasciculations, seizures, and respiratory failure are classic.",
    "pediatric asthma": "Pediatric asthma is chronic airway inflammation with episodic bronchoconstriction, mucus, and airway hyperresponsiveness in a child. Retractions, wheeze or silent chest, cough, fatigue, SpO2 trend, and ability to speak/feed show severity.",
    "peripheral neuropathy": "Peripheral neuropathy is damage to peripheral sensory, motor, or autonomic nerves from diabetes, toxins, vitamin deficiency, infection, autoimmune disease, compression, or medications. Numbness, burning pain, weakness, falls, ulcers, and autonomic symptoms guide assessment.",
    "pernicious anemia": "Pernicious anemia is autoimmune intrinsic-factor deficiency causing vitamin B12 malabsorption and megaloblastic anemia. Neuropathy, glossitis, cognitive change, high methylmalonic acid, and lifelong B12 replacement are key.",
    "pneumoconiosis": "Pneumoconiosis is occupational dust-induced lung fibrosis from inhaled mineral particles such as coal, silica, or asbestos. Progressive dyspnea, cough, restrictive physiology, impaired gas exchange, and exposure history define the pattern.",
    "poisoning and overdose": "Poisoning and overdose are toxic exposures where dose, timing, formulation, and substance determine organ injury. Airway, breathing, circulation, glucose, ECG, toxidrome pattern, decontamination window, antidote, and safety intent shape care.",
    "polycythemia vera": "Polycythemia vera is a myeloproliferative neoplasm, usually JAK2-driven, causing excess red cell mass and often high platelets or leukocytes. Hyperviscosity, thrombosis, pruritus after warm bathing, splenomegaly, and erythromelalgia are clues.",
    "polymyalgia rheumatica": "Polymyalgia rheumatica is an inflammatory syndrome in older adults causing bilateral shoulder and hip girdle pain and morning stiffness. High ESR/CRP, rapid steroid response, and screening for giant cell arteritis symptoms matter.",
    "ptsd": "PTSD is a trauma- and stressor-related disorder where a past traumatic event continues to trigger intrusive re-experiencing, avoidance, negative mood/cognition changes, and hyperarousal after the immediate danger is over. The key idea is not weak coping; it is persistent threat-learning physiology that keeps the brain and body reacting as if danger is still present.",
    "pseudogout": "Pseudogout is calcium pyrophosphate crystal arthritis, often affecting knee, wrist, or other large joints. Acute swelling, pain, chondrocalcinosis, and positively birefringent rhomboid crystals distinguish it from gout.",
    "pulmonary hypertension": "Pulmonary hypertension is elevated pressure in pulmonary arteries that overloads the right ventricle. Dyspnea, syncope, loud P2, edema, right-heart failure, hypoxemia, and cause-specific therapy determine risk.",
    "pulmonic stenosis": "Pulmonic stenosis is obstruction from right ventricle to pulmonary artery, usually at the pulmonic valve. Right ventricular pressure overload can cause murmur, exertional dyspnea, cyanosis in severe disease, and right-sided failure.",
    "respiratory distress syndrome of newborn": "Respiratory distress syndrome of newborn is surfactant deficiency in premature lungs causing alveolar collapse, low compliance, shunting, and hypoxemia. Grunting, retractions, nasal flaring, tachypnea, and rising oxygen need are classic.",
    "respiratory failure": "Respiratory failure is inability to maintain oxygenation, ventilation, or both, producing hypoxemia, hypercapnia, or acid-base failure. Work of breathing, mental status, ABG/VBG trend, SpO2, and fatigue show severity.",
    "salicylate toxicity": "Salicylate toxicity causes direct respiratory stimulation, uncoupled oxidative phosphorylation, metabolic acidosis, and fluid/electrolyte derangements. Tinnitus, vomiting, tachypnea, fever, confusion, pulmonary edema, and rising anion gap are high-yield clues.",
    "scleroderma": "Scleroderma is systemic sclerosis, an autoimmune disease causing microvascular injury and fibrosis of skin and internal organs. Raynaud phenomenon, skin thickening, reflux/dysphagia, interstitial lung disease, pulmonary hypertension, and renal crisis are key.",
    "self harm": "Self-harm is intentional self-injury or self-poisoning that may or may not include suicidal intent. Immediate care separates medical lethality, current intent, means access, psychiatric drivers, and protective supervision needs.",
    "severe combined immunodeficiency": "Severe combined immunodeficiency is profound T-cell dysfunction with impaired B-cell function, causing life-threatening infections early in infancy. Chronic diarrhea, thrush, failure to thrive, severe viral/fungal/opportunistic infections, and live-vaccine danger are classic.",
    "shingles disseminated": "Disseminated shingles is varicella-zoster reactivation spreading beyond one dermatome or involving visceral organs, usually in immunocompromised clients. Airborne/contact precautions, antivirals, eye/CNS involvement, and pain control matter.",
    "small cell lung cancer": "Small cell lung cancer is a high-grade neuroendocrine lung cancer strongly associated with smoking, rapid growth, early metastasis, and paraneoplastic syndromes such as SIADH or ectopic ACTH. It is often chemotherapy/radiation-sensitive at first but clinically aggressive, so new cough, hemoptysis, weight loss, hyponatremia, neurologic symptoms, and superior vena cava signs matter.",
    "sickle cell crisis": "Sickle cell crisis is vaso-occlusion from sickled red cells blocking microcirculation, causing ischemic pain and organ injury. Hypoxia, dehydration, infection, cold stress, acidosis, and fever can trigger escalation.",
    "sids": "SIDS is the sudden unexplained death of an infant younger than 1 year, usually during sleep, that remains unexplained after investigation. Prevention teaching matters because many risk reducers target the sleep environment: supine position, firm flat surface, no soft bedding, no overheating, smoke avoidance, and room-sharing without bed-sharing.",
    "silicosis": "Silicosis is fibrotic lung disease from inhaled crystalline silica dust, often from mining, sandblasting, stone cutting, or construction. Progressive dyspnea, cough, upper-lobe nodules, eggshell lymph-node calcification, and TB risk are classic.",
    "small bowel obstruction": "Small bowel obstruction is blockage of intestinal contents through the small intestine, commonly from adhesions, hernia, tumor, Crohn disease, or volvulus. Colicky pain, vomiting, distention, obstipation, ischemia, and perforation risk guide urgency.",
    "spinal cord injury": "Spinal cord injury is traumatic or nontraumatic damage to cord pathways causing motor, sensory, autonomic, bowel, bladder, and respiratory dysfunction below the lesion. Neurogenic shock, spinal shock, autonomic dysreflexia, and pressure injury prevention matter.",
    "spinal muscular atrophy": "Spinal muscular atrophy is an inherited motor neuron disease, usually SMN1-related, causing progressive symmetric weakness and muscle atrophy. Bulbar weakness, respiratory failure, feeding difficulty, and motor milestone delay are key.",
    "status asthmaticus": "Status asthmaticus is a severe asthma exacerbation that does not respond adequately to initial bronchodilator therapy. Air trapping, worsening obstruction, fatigue, rising CO2, silent chest, hypoxemia, and altered mental status signal impending respiratory failure.",
    "subdural hematoma": "Subdural hematoma is venous bleeding between dura and arachnoid, often from bridging vein rupture after trauma or falls. Symptoms can evolve slowly with headache, confusion, focal deficits, decreased consciousness, and raised ICP risk.",
    "substance use disorders": "Substance use disorders are clinically significant patterns of alcohol, medication, or drug use where reward, craving, impaired control, risky use, and continued use despite harm begin to override health, roles, and safety. The core nursing idea is a treatable brain-behavior disorder, not a character flaw.",
    "suicidal ideation": "Suicidal ideation is thinking about, planning, or desiring self-inflicted death. Severity depends on intent, plan, means, past attempts, substance use, psychosis, agitation, protective factors, and ability to maintain safety.",
    "systemic lupus erythematosus": "Systemic lupus erythematosus is a multisystem autoimmune disease with autoantibody-driven immune-complex inflammation. Rash, arthritis, nephritis, cytopenias, serositis, neurologic symptoms, thrombosis risk, and photosensitivity guide assessment.",
    "thalassemia": "Thalassemia is inherited reduced alpha- or beta-globin chain production causing microcytic hemolytic anemia and ineffective erythropoiesis. Severity ranges from silent carrier state to transfusion-dependent anemia with iron overload.",
    "thrombocytopenia": "Thrombocytopenia is a low platelet count from decreased production, increased destruction, splenic sequestration, dilution, or consumption. Petechiae, mucosal bleeding, severe bleeding, HIT/TTP/DIC context, and platelet trend matter.",
    "toxic megacolon": "Toxic megacolon is acute colonic dilation with systemic toxicity, usually from severe colitis such as ulcerative colitis, C. difficile, or infection. Fever, tachycardia, pain, distention, leukocytosis, perforation, and sepsis risk make it an emergency.",
    "transplant rejection": "Transplant rejection is recipient immune injury against donor tissue, causing graft inflammation, vascular injury, or fibrosis. Timing and mechanism differ in hyperacute, acute cellular, antibody-mediated, and chronic rejection.",
    "transposition of the great arteries": "Transposition of the great arteries is a congenital heart defect where the aorta leaves the right ventricle and pulmonary artery leaves the left ventricle, creating parallel circuits. Survival depends on mixing through PDA, ASD, or VSD until repair.",
    "traumatic brain injury": "Traumatic brain injury is brain dysfunction from external force causing concussion, contusion, hemorrhage, diffuse axonal injury, edema, or raised intracranial pressure. Changing mental status, vomiting, seizure, pupil change, or focal deficit signals danger.",
    "tricuspid regurgitation": "Tricuspid regurgitation is backward blood flow from right ventricle to right atrium during systole due to poor tricuspid valve closure. Right-sided volume overload causes JVD, hepatomegaly, ascites, edema, murmur, and atrial arrhythmias.",
    "tricyclic antidepressant overdose": "Tricyclic antidepressant overdose causes anticholinergic toxicity, alpha blockade, CNS toxicity, and cardiac fast sodium-channel blockade. QRS widening, hypotension, seizures, dysrhythmias, and coma drive sodium bicarbonate and airway priorities.",
    "trigeminal neuralgia": "Trigeminal neuralgia is paroxysmal severe facial pain from trigeminal nerve irritation, often vascular compression near the root entry zone. Light touch, chewing, brushing teeth, or cold air can trigger electric shock-like pain.",
    "upper airway obstruction": "Upper airway obstruction is blockage above the thoracic trachea that limits airflow to the lungs. Stridor, retractions, drooling, voice change, swelling, foreign body, anaphylaxis, epiglottitis, or trauma can make airway loss sudden.",
    "urticaria": "Urticaria is transient wheals from mast-cell mediator release causing itchy raised skin lesions. Angioedema, airway symptoms, hypotension, wheeze, or GI symptoms suggest anaphylaxis rather than isolated hives.",
    "violence risk": "Violence risk is the likelihood of imminent harm to others from agitation, threats, paranoia, intoxication, delirium, mania, trauma response, or access to weapons. Safety assessment focuses on intent, target, means, impulse control, and medical causes.",
    "vocal cord dysfunction": "Vocal cord dysfunction is paradoxical vocal fold adduction during inspiration or expiration, producing episodic upper-airway obstruction. Stridor, throat tightness, normal oxygenation, poor bronchodilator response, and trigger pattern help distinguish it from asthma.",
    "volvulus": "Volvulus is twisting of bowel around its mesentery, causing obstruction and possible ischemia. Sudden pain, distention, vomiting, obstipation, coffee-bean sigmoid imaging, and peritonitis signs change urgency.",
    "von willebrand disease": "Von Willebrand disease is inherited or acquired deficiency or dysfunction of von Willebrand factor, impairing platelet adhesion and factor VIII stability. Mucosal bleeding, heavy menses, easy bruising, and procedure bleeding are typical.",
    "warfarin toxicity": "Warfarin toxicity is excessive vitamin K antagonist effect causing over-anticoagulation and bleeding risk. High INR, bruising, GI bleeding, intracranial bleed symptoms, drug/diet interactions, liver disease, and reversal needs guide priority."
  };

  function hasPharmFiller(value) {
    return typeof value === "string" && (PHARM_IMPORTER_FILLER_RE.test(value) || PHARM_APP_META_RE.test(value));
  }

  function hasPathologyFiller(value) {
    if (typeof value !== "string") return false;
    const exact = value.trim().replace(/\.$/, "").toLowerCase();
    return PATHOLOGY_IMPORTER_FILLER_RE.test(value)
      || /\b(becomes unsafe when oxygenation|threatens neurologic function through|affects the brain, spinal cord, nerves|is a gastrointestinal or hepatobiliary condition|is an infectious, inflammatory, or immune-risk condition|affects oxygen carrying capacity, clotting|is a valve-structure or prosthetic-valve problem|toxic exposure overwhelms normal physiology|must be interpreted with age-|is a cardiovascular condition that can alter|is a renal or urinary problem where|centers on tissue perfusion, structural integrity|is unsafe when cognition, perception|core physiology to recognize|named body system or tissue|clinical danger comes from the way|useful bedside proof comes from)\b/i.test(value)
      || PATHOLOGY_PROFILE_FILLER_EXACT.has(exact)
      || PATHOLOGY_PROFILE_FILLER_BUNDLE_RE.test(value);
  }

  function cleanDrugName(drug) {
    return String(drug.generic || drug.name || drug.displayName || "this medication")
      .replace(/\s+drug$/i, "")
      .trim() || "this medication";
  }

  function categoryText(drug) {
    return String(drug.category || drug.class || drug.sourceCategory || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function inferPharmClass(drug) {
    const text = categoryText(drug).toLowerCase();
    if (/antipsychotic/.test(text)) return "Antipsychotic medication";
    if (/antiarrhythmic/.test(text)) return "Antiarrhythmic medication";
    if (/antithyroid/.test(text)) return "Antithyroid medication";
    if (/anticoagulant/.test(text)) return "Anticoagulant medication";
    if (/antiplatelet/.test(text)) return "Antiplatelet medication";
    if (/antibiotic|penicillin|cephalosporin|carbapenem|monobactam|aminoglycoside|macrolide|tetracycline|fluoroquinolone/.test(text)) return "Anti-infective medication";
    if (/antiviral/.test(text)) return "Antiviral medication";
    if (/antifungal/.test(text)) return "Antifungal medication";
    if (/antiparasitic/.test(text)) return "Antiparasitic medication";
    if (/diabetes|insulin|glucose/.test(text)) return "Diabetes medication";
    if (/thyroid|adrenal|pituitary|bone|endocrine/.test(text)) return "Endocrine medication";
    if (/seizure|parkinson|migraine|neurology|ms\b/.test(text)) return "Neurologic medication";
    if (/psych|substance|sleep|anxiety|depress/.test(text)) return "Psychiatric medication";
    if (/pain|anesthesia|anti-inflammatory|rheumatology/.test(text)) return "Pain, anesthesia, or anti-inflammatory medication";
    if (/cardiac|heart|hypertension|antianginal|vasopressor|shock|critical/.test(text)) return "Cardiovascular or critical-care medication";
    if (/\b(?:gi|gastrointestinal|liver|pancreas|bowel|antiemetic)\b/.test(text)) return "Gastrointestinal medication";
    if (/renal|electrolyte|dialysis|urinary/.test(text)) return "Renal, electrolyte, or urinary medication";
    if (/respiratory|asthma|copd|allergy|airway/.test(text)) return "Respiratory or allergy medication";
    if (/ob|gyn|fertility|pregnancy|postpartum/.test(text)) return "Maternal-newborn or reproductive medication";
    if (/pediatric|neonatal|vaccine/.test(text)) return "Pediatric, neonatal, or vaccine-related medication";
    if (/hematology|oncology|biologic|transplant/.test(text)) return "Hematology, oncology, biologic, or transplant medication";
    if (/dermatology|ophthalmic|otic/.test(text)) return "Dermatology, ophthalmic, or otic medication";
    if (/toxicology|antidote|reversal/.test(text)) return "Antidote, reversal, or toxicology medication";
    if (/vitamin|mineral|nutrition|supplement|herbal/.test(text)) return "Vitamin, mineral, nutrition, supplement, or herbal agent";
    if (categoryText(drug)) return categoryText(drug);
    return "Pharmacology reference";
  }

  function inferPharmUse(drug) {
    const cls = inferPharmClass(drug);
    const text = categoryText(drug).toLowerCase();
    if (/antipsychotic/.test(text)) return "psychotic disorders, bipolar mania, agitation, or other psychiatric indications when the medication and patient context fit.";
    if (/antithyroid/.test(text)) return "reduction of thyroid hormone activity in hyperthyroid states when ordered.";
    if (/antiarrhythmic/.test(text)) return "selected rhythm disturbances, with nursing focus on ECG rhythm, heart rate, blood pressure, electrolytes, and drug-specific toxicity.";
    if (/anticoagulant|antiplatelet|thrombolytic/.test(text)) return "prevention, treatment, or breakdown of thrombosis depending on the agent; nursing focus is bleeding risk and ordered monitoring.";
    if (/antibiotic|antiviral|antifungal|antiparasitic|anti-infective/.test(text)) return "treatment or prevention of infection when the suspected organism and site match the agent.";
    if (/diabetes|insulin|glucose/.test(text)) return "blood glucose management or hypoglycemia rescue depending on the agent.";
    if (/respiratory|asthma|copd|allergy|airway/.test(text)) return "airway, allergy, asthma, COPD, cough, or respiratory-support indications depending on the agent.";
    if (/pain|anesthesia|anti-inflammatory|rheumatology/.test(text)) return "pain, inflammation, anesthesia, muscle spasm, or rheumatologic disease depending on the agent.";
    if (/\b(?:gi|gastrointestinal|liver|pancreas|bowel|antiemetic)\b/.test(text)) return "nausea, acid suppression, bowel regulation, liver/pancreatic support, or GI inflammation depending on the agent.";
    if (/renal|electrolyte|dialysis|urinary/.test(text)) return "renal, electrolyte, dialysis, urinary, or fluid-balance indications depending on the agent.";
    if (/toxicology|antidote|reversal/.test(text)) return "antidote therapy, reversal, or supportive toxicology intervention depending on the exposure.";
    return `ordered indications that match ${cleanDrugName(drug)}'s pharmacologic effect. The most important clinical anchors are the drug class, intended physiologic target, expected benefit, contraindications, organ-clearance needs, interactions, and early toxicity signs.`;
  }

  function inferPharmMechanism(drug) {
    const text = categoryText(drug).toLowerCase();
    if (/anticoagulant/.test(text)) return "Mechanism centers on interrupting clot formation or clot propagation. The exact target depends on the agent.";
    if (/antiplatelet/.test(text)) return "Mechanism centers on reducing platelet activation or aggregation.";
    if (/thrombolytic/.test(text)) return "Mechanism promotes fibrin clot breakdown and carries major bleeding risk.";
    if (/antiarrhythmic/.test(text)) return "Mechanism changes cardiac conduction, refractoriness, automaticity, or ion-channel movement depending on the class.";
    if (/antithyroid/.test(text)) return "Mechanism reduces thyroid hormone synthesis or thyroid-hormone effect depending on the agent.";
    if (/insulin/.test(text)) return "Mechanism lowers blood glucose by moving glucose into cells and suppressing hepatic glucose output.";
    if (/antibiotic|anti-infective/.test(text)) return "Mechanism targets microbial growth, survival, or replication depending on the drug class.";
    if (/bronchodilator|asthma|copd|airway/.test(text)) return "Mechanism improves airflow or reduces airway inflammation depending on the agent.";
    if (/opioid/.test(text)) return "Mechanism activates opioid receptors, reducing pain perception and potentially depressing respirations.";
    if (/benzodiazepine/.test(text)) return "Mechanism enhances GABA activity, producing sedation, anxiolysis, muscle relaxation, and seizure control.";
    return "Mechanism centers on the medication's primary pharmacologic target: a receptor, enzyme, ion channel, transporter, organism structure, hormone pathway, immune signal, or replacement substrate that changes measurable physiology.";
  }

  function sanitizePharmString(value, drug, key) {
    if (typeof value !== "string") return value;
    let text = value.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
    const warningDetail = text.match(/\b(?:High-alert safety focus|The clinically important warning pattern is|High-alert sedation warnings are still central):\s*(.+)$/i);
    if (warningDetail && /box|black|warning/i.test(String(key || ""))) {
      const label = /sedation/i.test(warningDetail[0])
        ? "High-alert sedation warning"
        : /clinically important/i.test(warningDetail[0])
          ? "Clinically important warning pattern"
          : "High-alert safety focus";
      return `${label}: ${warningDetail[1].trim()}`;
    }
    if (!hasPharmFiller(text)) return text;

    const lowerKey = String(key || "").toLowerCase();
    const drugName = cleanDrugName(drug);
    if (/class|category|tier/.test(lowerKey)) return inferPharmClass(drug);
    if (/box|black|warning/.test(lowerKey)) return `No drug-specific boxed warning is listed for ${drugName} in this nursing reference. Major safety review centers on hypersensitivity, organ toxicity, route-specific hazards, high-alert dosing, population risk, and serious class warnings when present.`;
    if (/mechanism|moa/.test(lowerKey)) return inferPharmMechanism(drug);
    if (/indication|use|treat/.test(lowerKey)) return inferPharmUse(drug);
    if (/contra/.test(lowerKey)) return `Clarify before giving ${drugName} if there is serious hypersensitivity, pregnancy risk, severe renal/hepatic impairment, unstable vital signs, or a high-risk interaction.`;
    if (/interaction/.test(lowerKey)) return `Screen ${drugName} for additive sedation, bleeding, QT prolongation, potassium changes, blood-pressure effects, renal/hepatic clearance issues, and duplicate therapy when relevant.`;
    if (/nursing|monitor|concept|education|teaching/.test(lowerKey)) return `Nursing focus for ${drugName}: verify indication, dose, route, allergies, contraindications, pregnancy status, renal/hepatic function, baseline vital signs, and drug-specific monitoring before giving.`;
    if (/trap|pearl|nclex/.test(lowerKey)) return `High-yield safety variables for ${drugName}: major danger signs, monitoring labs or vital signs, contraindications, reversal options when available, route-specific risks, and patient teaching points vary with the drug's actual pharmacology.`;
    if (/source|confidence/.test(lowerKey)) return "";
    return `${drugName}: ${inferPharmUse(drug)}`;
  }

  function sanitizePharmValue(value, drug, key) {
    if (Array.isArray(value)) {
      return unique(value.map((item) => sanitizePharmValue(item, drug, key)).flat().filter(Boolean));
    }
    if (value && typeof value === "object") {
      Object.keys(value).forEach((childKey) => {
        value[childKey] = sanitizePharmValue(value[childKey], drug, childKey);
      });
      return value;
    }
    return sanitizePharmString(value, drug, key);
  }

  function cleanVisiblePharmacyPlaceholders() {
    if (!Array.isArray(pharm.drugs)) return;
    pharm.drugs.forEach((drug) => {
      Object.keys(drug).forEach((key) => {
        if (/^raw|sourceNote|sourceFile|sourceModel|sourceCategory$/i.test(key)) return;
        drug[key] = sanitizePharmValue(drug[key], drug, key);
      });

      const drugName = cleanDrugName(drug);
      if (!drug.class || hasPharmFiller(drug.class)) drug.class = inferPharmClass(drug);
      if (!drug.usedToTreat || hasPharmFiller(drug.usedToTreat)) drug.usedToTreat = inferPharmUse(drug);
      if (!drug.mechanism || hasPharmFiller(drug.mechanism)) drug.mechanism = inferPharmMechanism(drug);
      if (!drug.boxedWarning || hasPharmFiller(drug.boxedWarning)) {
        drug.boxedWarning = `No drug-specific boxed warning is listed for ${drugName} in this nursing reference. Major safety review centers on hypersensitivity, organ toxicity, route-specific hazards, high-alert dosing, population risk, and serious class warnings when present.`;
      }
      if (!drug.nursingEssentials || hasPharmFiller(drug.nursingEssentials)) {
        drug.nursingEssentials = `Before giving ${drugName}, verify the ordered indication, allergies, dose, route, vital signs, pregnancy status when relevant, and renal/hepatic function when clearance matters.`;
      }
      if (!drug.nclexTraps || hasPharmFiller(drug.nclexTraps)) {
        drug.nclexTraps = `High-yield safety variables for ${drugName}: adverse effects, monitoring parameters, contraindications, patient teaching, route-specific risks, dose, and client risk factors vary with the drug's actual pharmacology.`;
      }
      if (drug.studentFacing && !drug.hidden && Array.isArray(drug.tags) && !drug.combinationProduct) {
        drug.tags = unique(drug.tags.filter((tag) => !/hidden-combination-product|components-have-standalone-cards|pharm-integrity-hidden-combo/i.test(String(tag || ""))));
      }
    });
  }

  function cleanPathologyValue(value, field = "") {
    if (Array.isArray(value)) {
      let cleaned = unique(value
        .map((item) => cleanPathologyValue(item, field))
        .flat()
        .filter((item) => item && !hasPathologyFiller(item)));
      if (field === "complications") {
        const exactMatches = cleaned.filter((item) => PATHOLOGY_GENERIC_COMPLICATION_BUNDLE.has(String(item || "").trim().toLowerCase())).length;
        if (exactMatches >= 4) {
          cleaned = cleaned.filter((item) => !PATHOLOGY_GENERIC_COMPLICATION_BUNDLE.has(String(item || "").trim().toLowerCase()));
        }
      }
      if (field === "patientEducation") {
        cleaned = cleaned.filter((item) => !PATHOLOGY_GENERIC_PATIENT_EDUCATION.has(String(item || "").trim()));
      }
      return cleaned;
    }
    if (value && typeof value === "object") {
      Object.keys(value).forEach((childKey) => {
        value[childKey] = cleanPathologyValue(value[childKey], childKey);
      });
      return value;
    }
    return hasPathologyFiller(value) ? "" : value;
  }

  function cleanVisiblePathologyPlaceholders() {
    if (!Array.isArray(pathology.diseases)) return;
    pathology.diseases.forEach((disease) => {
      [
        "definition",
        "pathology",
        "pathophysiology",
        "etiology",
        "riskFactors",
        "signsSymptoms",
        "diagnostics",
        "labs",
        "treatments",
        "nursingPriorities",
        "complications",
        "contraindications",
        "redFlags",
        "patientEducation",
        "nclexTraps"
      ].forEach((key) => {
        disease[key] = cleanPathologyValue(disease[key], key);
      });
    });
  }

  function pathologyFieldText(value) {
    if (Array.isArray(value)) return value.map(pathologyFieldText).filter(Boolean).join(" ");
    if (value && typeof value === "object") return Object.values(value).map(pathologyFieldText).filter(Boolean).join(" ");
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function pathologyFieldNeedsContent(disease, field) {
    const text = pathologyFieldText(disease[field]);
    return text.length < 35 || PATHOLOGY_IMPORTER_FILLER_RE.test(text);
  }

  function pathologyName(disease) {
    return String(disease.name || disease.title || disease.displayName || "this condition").trim();
  }

  function pathologyProfile(disease) {
    const category = String(disease.category || disease.sourceCategory || "").toLowerCase();
    const name = pathologyName(disease).toLowerCase();
    const text = `${category} ${name}`;
    if (/esophageal atresia|tracheoesophageal fistula|\btef\b/.test(text)) {
      return {
        system: "newborn airway protection, esophageal continuity, aspiration prevention, and surgical repair",
        diagnostics: ["Recognize excessive drooling, choking/coughing/cyanosis with feeds, respiratory distress, abdominal distention, or inability to pass an orogastric/nasogastric tube", "chest/abdomen x-ray with tube coiled in the upper pouch and assessment for distal bowel gas pattern", "screen for associated VACTERL anomalies with cardiac, vertebral, renal, limb, and anorectal evaluation as ordered"],
        treatments: ["Keep NPO, position to reduce aspiration risk, maintain continuous or frequent pouch suction as ordered, support oxygenation, and avoid oral feeds", "prepare for surgical repair and gastrostomy/airway support when indicated", "give IV fluids, antibiotics, and postoperative nutrition/feeding support as ordered"],
        priorities: ["Protect airway first, monitor secretions, oxygen saturation, work of breathing, abdominal distention, and aspiration signs", "verify tube placement orders carefully; repeated blind attempts can injure tissue", "teach caregivers that repair and feeding progression depend on anatomy and anastomosis healing"],
        complications: ["aspiration pneumonia", "anastomotic leak", "stricture", "recurrent fistula", "tracheomalacia", "GERD", "feeding difficulty", "associated congenital anomalies"],
        trap: "A newborn who coughs, chokes, turns blue with feeds, and has copious secretions needs NPO and airway protection, not another oral feeding attempt."
      };
    }
    if (/tension pneumothorax/.test(text)) {
      return {
        system: "obstructive shock from trapped pleural air and falling venous return",
        diagnostics: ["Clinical recognition is the priority when unstable: severe respiratory distress, unilateral absent breath sounds, hypotension, tachycardia, JVD, tracheal deviation late, and rapidly worsening oxygenation", "do not wait for chest x-ray if tension physiology is present", "ultrasound or chest x-ray helps when stable or after decompression"],
        treatments: ["Immediate needle decompression or finger thoracostomy per protocol for unstable tension pneumothorax", "follow with chest tube placement to evacuate air and prevent recurrence", "support oxygenation, ventilation, IV access, and treatment of the trigger such as trauma, procedure complication, or positive-pressure ventilation"],
        priorities: ["Escalate absent unilateral breath sounds with hypotension as an emergency", "monitor post-decompression breath sounds, blood pressure, oxygenation, chest tube bubbling/tidaling, and recurrence", "avoid delaying decompression for imaging in an unstable client"],
        complications: ["cardiac arrest from obstructive shock", "persistent air leak", "re-expansion pulmonary edema", "infection or bleeding from chest tube", "recurrence"],
        trap: "Tension pneumothorax is treated from clinical signs when unstable; waiting for imaging can be fatal."
      };
    }
    if (normalize(name) === "stroke") {
      return {
        system: "brain perfusion, hemorrhage exclusion, neurologic rescue, swallowing safety, and secondary prevention",
        diagnostics: ["BE-FAST/focused neurologic assessment with last-known-well time", "bedside glucose immediately to rule out hypoglycemia mimic", "noncontrast head CT or MRI to distinguish ischemic from hemorrhagic stroke before reperfusion decisions", "NIH Stroke Scale, swallow screen, ECG/telemetry, vascular imaging, labs, and blood pressure assessment as ordered"],
        treatments: ["Activate stroke pathway rapidly", "prepare thrombolysis or thrombectomy evaluation for eligible ischemic stroke", "control blood pressure, anticoagulation reversal, neurosurgical care, or hemorrhage-specific treatment when bleeding is present", "keep NPO until swallow safety is screened"],
        priorities: ["Time last-known-well, protect airway/swallowing, monitor neuro status, glucose, blood pressure, oxygenation, and aspiration risk", "escalate worsening headache, vomiting, declining consciousness, new neuro deficit, seizure, or signs of increased ICP"],
        complications: ["cerebral edema", "hemorrhagic transformation", "aspiration pneumonia", "DVT/PE", "pressure injury", "falls", "long-term disability"],
        trap: "Do not give anything by mouth or assume ischemic stroke treatment before brain bleeding is excluded."
      };
    }
    if (/\bshock\b/.test(text)) {
      return {
        system: "failure of effective circulation to deliver enough oxygenated blood for cellular metabolism, producing anaerobic metabolism, lactate generation, organ hypoperfusion, and possible cardiovascular collapse",
        diagnostics: ["blood pressure and MAP trend with heart rate, pulses, capillary refill, skin temperature, mentation, urine output, and shock index", "serum lactate, ABG/VBG, CBC, CMP, coagulation tests, cultures when infection is possible, ECG/troponin when pump failure is possible, and bedside ultrasound or focused imaging when bleeding/obstruction is possible"],
        treatments: ["restore the missing hemodynamic variable: volume for hypovolemia/burn losses, pump support and reperfusion for cardiogenic shock, source control and vasopressors for distributive shock, or removal of mechanical obstruction for tamponade/tension pneumothorax/PE", "support oxygenation, establish IV/IO access, trend response, and escalate early for ICU, procedure, blood products, vasopressors, or airway support when perfusion is failing"],
        priorities: ["recognize shock before blood pressure fully crashes by trending mentation, tachycardia, cool or flushed skin pattern, narrowing pulse pressure, delayed capillary refill, rising lactate, and falling urine output", "separate shock type because fluids, vasopressors, inotropes, antibiotics, blood, reperfusion, and decompression do different jobs"],
        complications: ["acute kidney injury", "myocardial ischemia", "respiratory failure", "DIC", "ischemic hepatitis", "bowel ischemia", "multi-organ failure", "cardiac arrest"],
        trap: "Shock is not defined by one low blood-pressure number. Early compensated shock can show tachycardia, altered mentation, low urine output, rising lactate, and poor perfusion before overt hypotension."
      };
    }
    if (/cardiac|vascular|heart|coronary|aortic|shock|thromb|embol|hypertension|dysrhythm|tamponade|infarct/.test(text)) {
      return {
        system: "cardiovascular perfusion",
        diagnostics: ["Vital-sign and perfusion trend", "12-lead ECG or rhythm monitoring when indicated", "targeted imaging or vascular study when ordered", "CBC, electrolytes, renal function, coagulation studies, and cardiac markers when the presentation suggests them"],
        treatments: ["Support oxygenation and circulation", "give ordered fluids, vasoactive medication, anticoagulation, antihypertensive therapy, or procedure preparation based on cause", "prepare for urgent intervention when perfusion, bleeding, or occlusion is worsening"],
        priorities: ["Trend blood pressure, heart rate, rhythm, pulses, capillary refill, mentation, urine output, pain, and oxygenation", "escalate hypotension, chest pain, new neurologic findings, absent pulses, or signs of shock"],
        complications: ["shock", "organ hypoperfusion", "dysrhythmia", "thromboembolism", "bleeding or rupture when vascular integrity is involved"],
        trap: "For cardiovascular and vascular questions, do not chase a label first; decide whether perfusion, rhythm, bleeding, or airway/oxygenation is failing right now."
      };
    }
    if (/resp|lung|airway|pneumonia|copd|asthma|pulmonary|oxygen|ventilat/.test(text)) {
      return {
        system: "gas exchange and airway movement",
        diagnostics: ["Respiratory assessment and pulse oximetry", "ABG or venous gas when ventilation or acid-base status matters", "chest imaging or sputum testing when infection, edema, collapse, or embolic disease is possible"],
        treatments: ["Optimize positioning, oxygenation, ventilation, airway clearance, bronchodilator or anti-infective therapy when ordered", "prepare escalation for noninvasive ventilation, intubation, or procedure support if work of breathing worsens"],
        priorities: ["Assess airway patency, breath sounds, respiratory effort, oxygen saturation trend, mental status, and fatigue", "escalate stridor, cyanosis, silent chest, severe hypoxemia, rising carbon dioxide signs, or exhaustion"],
        complications: ["acute respiratory failure", "hypoxemia", "hypercapnia", "aspiration", "sepsis or pulmonary hypertension depending on cause"],
        trap: "A normal-looking oxygen number can lag behind fatigue; increased work of breathing and mental-status change can be the earlier danger cues."
      };
    }
    if (/neuro|brain|seizure|stroke|spinal|intracranial|cord|\bcoma\b|delirium|cerebral/.test(text)) {
      return {
        system: "neurologic function, cerebral perfusion, and safety",
        diagnostics: ["Focused neurologic checks", "glucose and oxygenation check for reversible causes", "CT/MRI, EEG, lumbar puncture, toxicology, or stroke workup when ordered and appropriate"],
        treatments: ["Protect airway and safety", "treat reversible causes such as hypoglycemia, hypoxia, infection, medication toxicity, or electrolyte disturbance", "prepare disease-specific therapy such as antiseizure medication, reperfusion evaluation, ICP management, or surgery when indicated"],
        priorities: ["Trend level of consciousness, pupils, motor changes, speech, swallowing, seizure activity, vital signs, and fall/aspiration risk", "escalate sudden neurologic change, seizure, severe headache, focal deficit, or declining consciousness"],
        complications: ["airway loss", "aspiration", "seizure injury", "increased intracranial pressure", "permanent neurologic deficit"],
        trap: "Always rule out glucose, oxygenation, medication effect, and acute stroke cues before assuming confusion or behavior is baseline."
      };
    }
    if (/renal|kidney|urinary|\buti\b|pyelo|urosepsis|electrolyte|dialysis|dehydrat|fluid|acid|base/.test(text)) {
      return {
        system: "fluid balance, renal clearance, electrolytes, and acid-base stability",
        diagnostics: ["Intake/output and daily weight trend", "BMP with creatinine, BUN, sodium, potassium, bicarbonate, calcium, magnesium, and glucose as relevant", "urinalysis, urine culture, renal imaging, or dialysis access assessment when indicated"],
        treatments: ["Correct volume status carefully", "adjust nephrotoxic or renally cleared medications when ordered", "treat electrolyte emergencies and prepare dialysis or urinary decompression when severe"],
        priorities: ["Monitor urine output, mental status, edema, lung sounds, heart rhythm, blood pressure, and electrolyte trends", "escalate severe potassium abnormality, pulmonary edema, anuria, seizure, dysrhythmia, or worsening acidosis"],
        complications: ["dysrhythmia", "seizure", "pulmonary edema", "acute kidney injury", "shock or chronic kidney disease progression"],
        trap: "Electrolyte and kidney questions are safety questions; potassium, sodium shifts, urine output, and ECG changes can outrank routine teaching."
      };
    }
    if (/\bgi\b|liver|bowel|pancrea|abdomen|gall|hepat|cholang|constipation|diarrhea/.test(text)) {
      return {
        system: "digestion, hepatic metabolism, nutrition, bleeding risk, and abdominal perfusion",
        diagnostics: ["Abdominal assessment including pain pattern, distention, bowel sounds, stool/emesis, and hydration", "CBC, CMP, liver enzymes, bilirubin, lipase, coagulation studies, stool testing, or imaging/endoscopy when indicated"],
        treatments: ["Support hydration, nutrition, nausea/pain control, bowel rest or bowel regimen as ordered", "treat infection, obstruction, bleeding, inflammation, or hepatic complications based on the cause"],
        priorities: ["Track pain trend, guarding, bleeding, vomiting, stool pattern, jaundice, mental status, intake/output, and shock signs", "escalate rigid abdomen, GI bleeding, peritonitis signs, severe dehydration, altered mental status, or worsening jaundice"],
        complications: ["dehydration", "bleeding", "peritonitis", "sepsis", "malnutrition", "hepatic or pancreatic organ complications"],
        trap: "Do not dismiss abdominal disease as comfort-only; bleeding, perforation, obstruction, sepsis, and fluid shifts can become the priority."
      };
    }
    if (/endocrine|diabet|\bdka\b|ketoacidosis|\bhhs\b|thyroid|adrenal|pituitary|metabolic|calcium|glucose|cushing|conn/.test(text)) {
      return {
        system: "hormone regulation, glucose control, electrolytes, temperature, and hemodynamic stability",
        diagnostics: ["Glucose and vital-sign trend", "targeted hormone testing such as TSH/free T4, cortisol, ACTH, aldosterone/renin, PTH, or serum/urine osmolality when the disorder fits", "electrolytes, renal function, ketones, osmolality, ECG, or imaging when indicated"],
        treatments: ["Correct unstable glucose, fluid, electrolyte, temperature, and blood-pressure problems first", "give ordered hormone replacement, suppression therapy, insulin, dextrose, fluids, or targeted medication based on the disorder"],
        priorities: ["Monitor mental status, glucose, sodium, potassium, blood pressure, heart rate, temperature, hydration, and medication timing", "escalate shock, severe hypo/hyperglycemia, seizure, dysrhythmia, adrenal crisis, thyroid storm, or DKA/HHS cues"],
        complications: ["shock", "seizure", "dysrhythmia", "coma", "dehydration", "long-term vascular or organ injury"],
        trap: "Endocrine emergencies often look like vague weakness or confusion; connect the vital signs, glucose, sodium, potassium, and medication history."
      };
    }
    if (/ob|maternal|newborn|pregnan|postpartum|uterine|fetal|pediatric|neonatal|infant|child|cord/.test(text)) {
      return {
        system: "maternal-newborn or pediatric physiology with age-specific safety risks",
        diagnostics: ["Age-appropriate vital signs and focused assessment", "maternal/fetal monitoring, growth/development checks, glucose, bilirubin, CBC, infection testing, congenital-anomaly evaluation, or imaging when the presentation fits"],
        treatments: ["Correct immediate pediatric or maternal-newborn threats first: oxygenation, perfusion, temperature, glucose, hydration, hemorrhage, pain, or sepsis risk.", "prepare ordered obstetric, neonatal, pediatric, medication, or procedural interventions based on age and acuity"],
        priorities: ["Use age-specific norms, monitor feeding/hydration, respiratory effort, perfusion, neurologic status, pain cues, family teaching needs, and safeguarding concerns", "escalate fetal distress, postpartum hemorrhage, neonatal respiratory distress, dehydration, sepsis signs, or altered responsiveness"],
        complications: ["hypoxia", "shock", "sepsis", "dehydration", "developmental or pregnancy-related complications"],
        trap: "Use pediatric and pregnancy norms; adult vital-sign assumptions can miss deterioration in newborns, children, and pregnant or postpartum clients."
      };
    }
    if (/psych|substance|withdrawal|intoxication|personality|delirium|cannabis|alcohol|opioid|benzodiazepine/.test(text)) {
      return {
        system: "behavioral health, substance exposure, cognition, and immediate safety",
        diagnostics: ["Mental-status and suicide/violence risk assessment", "substance, medication, glucose, oxygenation, infection, and neurologic screening when behavior changes acutely", "toxicology or withdrawal scoring when ordered"],
        treatments: ["Maintain safety, reduce stimuli when appropriate, treat withdrawal or intoxication complications, and use therapeutic communication", "give ordered symptom-targeted medication while addressing medical causes and support needs"],
        priorities: ["Assess airway, breathing, circulation, orientation, agitation, hallucinations, self-harm risk, withdrawal signs, hydration, and trauma history", "escalate respiratory depression, severe withdrawal, delirium, suicidal intent, violent behavior, or unstable vitals"],
        complications: ["self-harm", "violence", "withdrawal seizure", "aspiration", "respiratory depression", "medical instability hidden by behavioral symptoms"],
        trap: "Do not assume behavior is purely psychiatric until hypoxia, hypoglycemia, infection, head injury, intoxication, withdrawal, and medication effects are considered."
      };
    }
    if (/infect|immune|sepsis|fever|abscess|cellulitis|clostridioides|c difficile|covid|central line|catheter/.test(text)) {
      return {
        system: "host defense, infection control, inflammation, and sepsis risk",
        diagnostics: ["Temperature and full vital-sign trend", "source-focused assessment", "CBC with differential, cultures before antibiotics when ordered, lactate if sepsis concern, imaging or specimen testing based on source"],
        treatments: ["Start ordered antimicrobials promptly after appropriate cultures when sepsis or serious infection is suspected", "support fluids, oxygenation, source control, isolation precautions, and device removal or wound care when indicated"],
        priorities: ["Monitor fever or hypothermia, tachycardia, hypotension, mental status, urine output, oxygenation, WBC/ANC, lactate, and infection source", "escalate sepsis signs, neutropenic fever, rapidly spreading infection, airway swelling, or shock"],
        complications: ["sepsis", "shock", "organ dysfunction", "abscess", "transmission to vulnerable clients"],
        trap: "Older adults and immunocompromised clients may not mount a strong fever; confusion, low temperature, tachypnea, or hypotension can be infection cues."
      };
    }
    if (/hema|oncology|cancer|anemia|leukemia|lymphoma|platelet|bleed|transfusion|hypercalcemia/.test(text)) {
      return {
        system: "oxygen carrying capacity, clotting, immune defense, and malignancy complications",
        diagnostics: ["CBC with differential and platelet trend", "coagulation studies, type and screen, chemistry panel, tumor- or treatment-specific testing, and focused bleeding/infection assessment"],
        treatments: ["Support oxygenation, transfusion needs, bleeding precautions, infection prevention, hydration, and ordered chemotherapy, immunotherapy, anticoagulation, reversal, or electrolyte treatment"],
        priorities: ["Watch fatigue, dyspnea, bleeding, bruising, fever, bone pain, lymph nodes, neurologic change, calcium symptoms, and treatment toxicity", "escalate neutropenic fever, active bleeding, severe anemia symptoms, tumor lysis signs, hypercalcemia crisis, or transfusion reaction"],
        complications: ["sepsis", "hemorrhage", "thrombosis", "organ damage", "tumor lysis", "treatment toxicity"],
        trap: "Low counts can be quiet until dangerous; fever with neutropenia, bleeding with thrombocytopenia, and confusion with hypercalcemia need rapid action."
      };
    }
    if (/skin|burn|wound|trauma|fracture|musculo|pressure|ulcer|chemical|crush|extravasation/.test(text)) {
      return {
        system: "tissue integrity, perfusion, pain, mobility, infection prevention, and compartment pressure",
        diagnostics: ["Neurovascular and skin/wound assessment", "pain, pulses, sensation, movement, color, temperature, drainage, size/depth, and mechanism of injury", "x-ray, CT, labs, cultures, or compartment pressure testing when indicated"],
        treatments: ["Protect the injured area, control bleeding/pain, restore perfusion, prevent infection, and prepare debridement, immobilization, antidote/extravasation protocol, or surgery when indicated"],
        priorities: ["Monitor circulation, sensation, movement, swelling, wound drainage, fever, urine output after crush/burn injury, and pain out of proportion", "escalate absent pulses, compartment syndrome signs, spreading infection, evisceration, circumferential burn compromise, or chemical exposure"],
        complications: ["infection", "sepsis", "compartment syndrome", "contracture", "fluid loss", "rhabdomyolysis or impaired healing depending on injury"],
        trap: "Pain out of proportion, paresthesia, pulselessness, or tight swelling after injury is not routine pain; think neurovascular compromise."
      };
    }
    if (/eye|ent|ophthalm|ocular|retina|cornea|cataract|glaucoma|epistaxis|tinnitus|hearing|vision|visual|ear|nasal|nose|throat/.test(text)) {
      return {
        system: "vision, hearing, mucosal integrity, airway proximity, and sensory safety",
        diagnostics: ["Visual acuity or hearing screen compared with baseline", "focused eye, ear, nose, throat, neuro, pain, drainage, bleeding, medication, and trauma assessment", "slit-lamp/fluorescein exam, fundoscopy, otoscopy, audiology, nasal exam, culture, or imaging when the finding suggests it"],
        treatments: ["Protect the affected sensory organ from further injury", "give ordered topical/systemic medication, irrigation, pressure, packing, procedure support, or specialist referral based on the exact structure involved", "escalate acute vision loss, penetrating injury, painful red eye, airway-risk swelling, uncontrolled bleeding, or neurologic symptoms"],
        priorities: ["Trend visual acuity, pain, photophobia, pupil change, drainage, bleeding amount, dizziness, hearing change, and safety/fall risk", "avoid pressure, irrigation, drops, or removal attempts when penetrating eye injury or globe rupture is possible"],
        complications: ["permanent vision loss", "infection", "corneal scarring", "aspiration or airway compromise when bleeding/swelling is severe", "falls or communication barriers from sensory loss"],
        trap: "Eye/ENT questions often hinge on red flags: sudden vision loss, severe eye pain, chemical exposure, penetrating injury, posterior nosebleed, or airway threat changes the priority."
      };
    }
    if (/emergency|critical|toxicology|poison|overdose|drowning|frostbite|heat|hypothermia|hyperthermia|bite|envenomation|snake|spider|malignant hyperthermia|postoperative|atelectasis|ileus/.test(text)) {
      return {
        system: "time-sensitive rescue physiology: oxygenation, perfusion, temperature control, toxic exposure, and organ protection",
        diagnostics: ["Immediate vital-sign, mental-status, oxygenation, perfusion, pain, exposure/mechanism, medication, and timeline assessment", "bedside glucose, ECG, ABG/VBG, electrolytes, renal/liver function, CK, lactate, toxicology, imaging, or procedure-specific tests when indicated", "repeat assessments because early findings can look deceptively mild"],
        treatments: ["Remove the trigger or exposure when possible", "support oxygenation, ventilation, circulation, temperature correction, decontamination, antidote/antivenom, fluids, or procedure preparation based on the emergency", "prepare ICU, surgery, code response, poison control, or specialty consultation when deterioration risk is high"],
        priorities: ["Reassess airway, work of breathing, rhythm, blood pressure, temperature, urine output, pain, neuro status, skin/tissue changes, and treatment response", "escalate altered mental status, shock, dysrhythmia, respiratory distress, rapidly spreading tissue injury, or uncontrolled temperature abnormality"],
        complications: ["respiratory failure", "shock", "dysrhythmia", "acute kidney injury", "rhabdomyolysis", "compartment syndrome", "sepsis or delayed pulmonary injury depending on cause"],
        trap: "Emergency cards are trend-sensitive; a client who looks stable at first can deteriorate after rewarming, submersion, toxin absorption, tissue swelling, or post-op hypoventilation."
      };
    }
    return {
      system: "the affected body system, safety risk, and likely complication pattern",
      diagnostics: ["Focused assessment tied to the involved organ system", "vital-sign trend, pain/function change, medication/exposure review, age and pregnancy context, immune status, and comorbidity screen", "targeted labs, imaging, bedside tests, or specialist evaluation selected by the suspected diagnosis"],
      treatments: ["Correct the unstable problem first: oxygenation, perfusion, severe pain, glucose, fluid deficit/excess, bleeding, infection risk, or neurologic decline.", "give ordered disease-specific medication, procedure preparation, monitoring, teaching, or referral"],
      priorities: ["Trend symptoms, vital signs, mental status, intake/output, pain, mobility, and response to therapy", "escalate sudden deterioration, unstable vital signs, severe pain, new neurologic change, bleeding, hypoxia, or sepsis signs"],
      complications: ["organ dysfunction", "infection", "bleeding", "shock", "functional decline", "treatment complications"],
      trap: "Priority hinges on the first unstable physiology: airway/oxygenation, perfusion, neurologic status, bleeding, infection, severe pain, fluid balance, or a complication that can accelerate deterioration."
    };
  }

  function fallbackPathologyTeaching(disease, profile) {
    const name = pathologyName(disease);
    const text = `${String(disease.category || "")} ${String(disease.sourceSubcategory || "")} ${name}`.toLowerCase();
    const normalizedName = normalize(name);
    if (PATHOLOGY_CRASH_OPENING_OVERRIDES[normalizedName]) {
      return PATHOLOGY_CRASH_OPENING_OVERRIDES[normalizedName];
    }
    if (/esophageal atresia/.test(text)) {
      return `${name} is congenital interruption of the esophageal lumen, usually ending in a blind upper pouch and often paired with a tracheoesophageal fistula. Saliva and feeds cannot reach the stomach normally, so the newborn has drooling, choking, coughing, cyanosis with feeds, aspiration risk, and inability to pass an orogastric/nasogastric tube to the stomach.`;
    }
    if (/tracheoesophageal fistula|\btef\b/.test(text)) {
      return `${name} is an abnormal connection between trachea and esophagus. Air can enter the stomach and gastric contents or feeds can enter the airway, so the newborn may cough, choke, desaturate, develop recurrent aspiration pneumonia, or show abdominal distention during ventilation.`;
    }
    if (/tension pneumothorax/.test(text)) {
      return `${name} is a one-way air leak into the pleural space that raises intrathoracic pressure with each breath. The affected lung collapses, the mediastinum shifts, venous return falls, and obstructive shock can develop; severe dyspnea, unilateral absent breath sounds, hypotension, JVD, and tracheal deviation are emergency cues.`;
    }
    if (normalizedName === "stroke") {
      return `${name} is acute brain injury from interrupted blood flow or bleeding. Neurons lose oxygen and glucose quickly, so sudden face droop, arm weakness, speech change, vision loss, neglect, severe headache, or imbalance is time-sensitive until CT/MRI distinguishes ischemic from hemorrhagic pathways.`;
    }
    if (/burn shock/.test(text)) {
      return `${name} is early circulatory shock after major burns caused by inflammatory capillary leak, plasma loss into burned and unburned tissues, evaporative fluid loss, and reduced effective circulating volume. The danger is inadequate preload and tissue perfusion with tachycardia, low urine output, rising lactate, edema, and hypothermia risk; resuscitation is guided by burn size, time from injury, urine output, perfusion, and electrolyte/acid-base trends.`;
    }
    if (/cardiogenic shock after mi|cardiogenic shock/.test(text)) {
      return `${name} is shock from myocardial pump failure, classically after a large myocardial infarction or mechanical MI complication. The ventricle cannot generate enough forward flow despite adequate or high filling pressure, so pulmonary edema, cool clammy skin, altered mentation, oliguria, hypotension, rising lactate, ischemic ECG/troponin findings, and need for reperfusion/inotrope or mechanical support become the priority.`;
    }
    if (/distributive shock/.test(text)) {
      return `${name} is shock from pathologic vasodilation and maldistributed blood flow rather than simple fluid loss. Sepsis, anaphylaxis, and neurogenic shock lower systemic vascular resistance; capillary leak, relative hypovolemia, mitochondrial oxygen-use problems, or loss of sympathetic tone can leave tissues hypoperfused even when the skin is warm or the cardiac output is high early.`;
    }
    if (/\bshock\b/.test(text)) {
      return `${name} means effective circulation is failing to deliver enough oxygenated blood for cellular metabolism. Cells shift toward anaerobic metabolism, lactate rises, compensatory tachycardia and vasoconstriction try to preserve brain/heart perfusion, and decompensation causes hypotension, oliguria, altered mentation, acidosis, organ injury, and possible cardiac arrest.`;
    }
    if (/corneal abrasion/.test(text)) {
      return `${name} is a scratch through corneal epithelium, exposing densely innervated corneal tissue. It causes foreign-body sensation, tearing, photophobia, pain, and fluorescein uptake; contact lens wear raises concern for Pseudomonas keratitis and vision-threatening infection.`;
    }
    if (/diabetic nephropathy/.test(text)) {
      return `${name} is diabetic microvascular kidney injury. Chronic hyperglycemia glycosylates glomerular proteins, thickens the basement membrane, expands mesangium, raises intraglomerular pressure, and causes albuminuria that can progress to declining GFR and end-stage kidney disease.`;
    }
    if (/diabetic retinopathy/.test(text)) {
      return `${name} is diabetic microvascular retinal injury. Capillary basement membrane damage, pericyte loss, microaneurysms, leakage, ischemia, and VEGF-driven neovascularization can cause macular edema, vitreous hemorrhage, traction retinal detachment, and vision loss.`;
    }
    if (/drowning|near drowning/.test(text)) {
      return `${name} causes respiratory impairment after submersion or immersion. Hypoxemia comes from aspiration, laryngospasm, surfactant washout, atelectasis, bronchospasm, pulmonary edema, and delayed acute lung injury; neurologic outcome depends heavily on hypoxia duration.`;
    }
    if (/epistaxis/.test(text)) {
      return `${name} is nasal mucosal bleeding, most often anterior from Kiesselbach plexus where fragile septal vessels sit close to the surface. Posterior bleeding is less common but more dangerous because it can bleed briskly, drain into the throat, threaten airway protection, and occur with anticoagulation or hypertension.`;
    }
    if (/folate deficiency/.test(text)) {
      return `${name} impairs thymidine synthesis and DNA replication, so rapidly dividing marrow cells mature poorly. The result is megaloblastic macrocytic anemia, glossitis, fatigue, and in pregnancy increased neural tube defect risk; neurologic deficits point more toward B12 deficiency than isolated folate deficiency.`;
    }
    if (/frostbite/.test(text)) {
      return `${name} freezes tissue and injures endothelium, causing ice-crystal damage, vasoconstriction, microthrombi, edema, and reperfusion inflammation. Digits, ears, nose, and cheeks can progress from numb pale skin to blistering, necrosis, compartment pressure, and amputation risk.`;
    }
    if (/heat exhaustion/.test(text)) {
      return `${name} is heat stress with volume and salt depletion before frank CNS failure. Heavy sweating, weakness, dizziness, nausea, tachycardia, and cool clammy skin can progress to heat stroke if cooling, rest, and fluid/electrolyte replacement do not occur.`;
    }
    if (/hyperparathyroidism/.test(text)) {
      return `${name} is excess parathyroid hormone activity that raises serum calcium by increasing bone resorption, renal calcium reabsorption, and vitamin D activation. Think stones, bones, abdominal groans, psychiatric overtones, constipation, dehydration, shortened QT, and kidney/bone complications.`;
    }
    if (/hypoparathyroidism/.test(text)) {
      return `${name} is deficient parathyroid hormone activity, often after thyroid/parathyroid surgery, causing hypocalcemia and hyperphosphatemia. Low ionized calcium increases neuromuscular excitability, producing paresthesias, tetany, Chvostek/Trousseau signs, laryngospasm, seizures, and prolonged QT.`;
    }
    if (/iron deficiency/.test(text)) {
      return `${name} limits hemoglobin synthesis, producing microcytic hypochromic anemia. Common drivers are blood loss, pregnancy, low intake, or malabsorption; symptoms reflect reduced oxygen delivery plus epithelial changes such as brittle nails, pica, glossitis, and restless legs.`;
    }
    if (/malignant hyperthermia/.test(text)) {
      return `${name} is an inherited skeletal-muscle calcium-release crisis, usually triggered by volatile anesthetics or succinylcholine. Uncontrolled sarcoplasmic reticulum calcium release causes sustained contraction, rapid CO2 rise, acidosis, hyperkalemia, rigidity, hyperthermia, rhabdomyolysis, and cardiac arrest risk.`;
    }
    if (/malnutrition/.test(text)) {
      return `${name} is inadequate protein, energy, micronutrients, or usable nutrient absorption for physiologic needs. Lean mass, immune function, wound healing, respiratory muscle strength, albumin-dependent oncotic balance, and medication tolerance can deteriorate before weight alone tells the full story.`;
    }
    if (/metabolic syndrome/.test(text)) {
      return `${name} is a cluster of visceral adiposity and insulin resistance that drives hypertension, atherogenic dyslipidemia, hyperglycemia, fatty liver risk, endothelial dysfunction, and chronic inflammation, greatly increasing type 2 diabetes and cardiovascular disease risk.`;
    }
    if (/obesity/.test(text)) {
      return `${name} is excess adiposity that acts as an endocrine and inflammatory organ, not only stored weight. Adipokines, insulin resistance, mechanical load, sleep-disordered breathing, fatty liver, hypertension, osteoarthritis, and stigma-related barriers all shape health risk.`;
    }
    if (/postoperative atelectasis/.test(text)) {
      return `${name} is alveolar collapse after anesthesia, pain-limited deep breathing, immobility, mucus retention, or splinting. Collapsed lung units create shunt physiology, low-grade fever, crackles, hypoxemia, and pneumonia risk unless expansion and mobilization improve ventilation.`;
    }
    if (/postoperative ileus/.test(text)) {
      return `${name} is temporary bowel motility failure after surgery, anesthesia, opioids, inflammation, electrolyte disturbance, or immobility. Gas and fluid accumulate, causing distention, nausea/vomiting, absent flatus/stool, poor intake, and aspiration or prolonged hospitalization risk.`;
    }
    if (/refeeding syndrome/.test(text)) {
      return `${name} occurs when calories, especially carbohydrate, restart after starvation and insulin drives phosphate, potassium, and magnesium into cells. ATP demand rises while serum electrolytes fall, risking respiratory failure, dysrhythmia, seizures, rhabdomyolysis, heart failure, and death.`;
    }
    if (/retinoblastoma/.test(text)) {
      return `${name} is a malignant retinal tumor of childhood, usually involving RB1 tumor-suppressor pathway loss. Leukocoria, strabismus, red painful eye, or poor vision can reflect an intraocular tumor that can invade optic nerve, orbit, or metastasize if not treated early.`;
    }
    if (/snake bite/.test(text)) {
      return `${name} can inject venom that damages tissue, blood clotting, neuromuscular transmission, kidneys, or cardiovascular stability depending on species. Progressive swelling, pain, coagulopathy, neuro weakness, hypotension, or systemic symptoms guide antivenom and monitoring decisions.`;
    }
    if (/spider bite/.test(text)) {
      return `${name} is usually local irritation, but high-yield exceptions are black widow neurotoxin with painful muscle cramping/autonomic symptoms and brown recluse cytotoxic injury with necrosis and possible hemolysis. Expanding necrosis, systemic illness, or severe pain changes urgency.`;
    }
    if (/tetany/.test(text)) {
      return `${name} is involuntary muscle spasm from increased neuromuscular excitability, most often low ionized calcium or alkalosis reducing available calcium. Perioral numbness, carpopedal spasm, Chvostek/Trousseau signs, laryngospasm, seizures, and prolonged QT are key danger cues.`;
    }
    if (/thyroid nodules/.test(text)) {
      return `${name} are discrete thyroid lesions that may be benign cysts/adenomas, inflammatory nodules, or thyroid cancer. Risk stratification depends on TSH, ultrasound features, size, growth, radiation/family history, compressive symptoms, and fine-needle aspiration when indicated.`;
    }
    if (/tinnitus/.test(text)) {
      return `${name} is perceived sound without an external source, often from cochlear hair-cell injury, sensorineural hearing loss, noise exposure, ototoxic medications, cerumen, vascular turbulence, or temporomandibular/neurologic causes. Pulsatile, unilateral, or neurologic tinnitus needs deeper evaluation.`;
    }
    if (/type 1 diabetes mellitus/.test(text)) {
      return `${name} is autoimmune pancreatic beta-cell destruction causing absolute insulin deficiency. Without basal insulin, hepatic glucose output and lipolysis accelerate, so clients depend on exogenous insulin and are vulnerable to DKA, hypoglycemia, and microvascular complications.`;
    }
    if (/type 2 diabetes mellitus/.test(text)) {
      return `${name} combines insulin resistance with progressive beta-cell dysfunction. Hyperglycemia injures blood vessels and nerves through glycation, oxidative stress, dyslipidemia, and inflammation, increasing cardiovascular, kidney, retinal, neuropathic, and infection risks.`;
    }
    if (/vitamin b12 deficiency/.test(text)) {
      return `${name} impairs DNA synthesis and myelin maintenance, causing megaloblastic anemia plus neurologic injury. Paresthesias, gait imbalance, cognitive change, glossitis, and high methylmalonic acid help distinguish it from folate deficiency.`;
    }
    if (/vitamin d deficiency/.test(text)) {
      return `${name} reduces calcium/phosphate absorption and mineralization. Children can develop rickets with bowed legs or delayed growth; adults can develop osteomalacia, bone pain, proximal weakness, falls, secondary hyperparathyroidism, and fracture risk.`;
    }
    if (/wernicke encephalopathy/.test(text)) {
      return `${name} is acute thiamine deficiency injuring energy-dependent brain regions, classically mammillary bodies and periaqueductal gray. Confusion, ataxia, ophthalmoplegia/nystagmus, hypothermia, or hypotension can occur; give thiamine before glucose when suspected.`;
    }
    if (/dka|diabetic ketoacidosis/.test(text)) {
      return `${name} is an insulin-deficiency emergency: cells cannot use glucose well, lipolysis produces ketones, osmotic diuresis causes dehydration, and potassium shifts can hide total-body potassium depletion. The danger is cerebral edema, shock, dysrhythmia, and rapid neurologic change during treatment.`;
    }
    if (/catheter-associated uti|cauti/.test(text)) {
      return `${name} develops when an indwelling urinary catheter bypasses normal urethral defenses and lets bacteria form biofilm along the catheter surface. The high-yield nursing issue is prevention and early recognition: remove unnecessary catheters, maintain a closed drainage system, and watch for delirium, fever, suprapubic pain, flank pain, leukocytosis, or sepsis in high-risk clients.`;
    }
    if (/cardiomyopathy/.test(text)) {
      return `${name} means diseased heart muscle cannot pump or relax normally. Dilated forms reduce systolic squeeze, hypertrophic forms can obstruct outflow and impair filling, and restrictive forms make the ventricle stiff; all can lead to dyspnea, fatigue, dysrhythmias, thromboembolism, and heart-failure decompensation.`;
    }
    if (/cauda equina/.test(text)) {
      return `${name} is compression of lumbosacral nerve roots below the conus medullaris. Saddle anesthesia, urinary retention or incontinence, bowel dysfunction, bilateral leg weakness, or severe back pain with neurologic deficit are surgical red flags because delayed decompression can leave permanent bladder, bowel, sexual, and motor dysfunction.`;
    }
    if (/cerebral edema/.test(text)) {
      return `${name} is excess brain water that raises intracranial pressure inside a fixed skull. As ICP rises, cerebral perfusion falls; headache, vomiting, declining level of consciousness, pupillary change, Cushing response, seizure, or posturing means the brain is running out of compensatory space.`;
    }
    if (/cor pulmonale/.test(text)) {
      return `${name} is right-sided heart strain or failure caused by pulmonary hypertension from chronic lung or pulmonary vascular disease. The right ventricle pumps against high pulmonary resistance, leading to JVD, edema, hepatomegaly, exertional dyspnea, hypoxemia, and eventual low-output symptoms.`;
    }
    if (/cord prolapse/.test(text)) {
      return `${name} occurs when the umbilical cord slips below or beside the presenting fetal part and becomes compressed. Fetal oxygen delivery can drop suddenly, so recurrent variable decelerations, bradycardia, or visible/palpable cord after membrane rupture is an emergency requiring pressure relief and rapid birth preparation.`;
    }
    if (/cholangitis/.test(text)) {
      return `${name} is infected biliary obstruction until proven otherwise. Obstruction raises duct pressure, bacteria ascend, and clients can progress from fever, right-upper-quadrant pain, and jaundice to hypotension and confusion; antibiotics plus urgent biliary drainage can be lifesaving.`;
    }
    if (/choledocholithiasis/.test(text)) {
      return `${name} means a gallstone is lodged in the common bile duct. Bile cannot drain normally, so direct bilirubin and alkaline phosphatase rise, jaundice/dark urine/pale stools can appear, and obstruction can trigger cholangitis or pancreatitis.`;
    }
    if (/cholinergic/.test(text)) {
      return `${name} reflects excess acetylcholine at muscarinic and nicotinic sites. Think salivation, lacrimation, urination, diarrhea, GI cramping, emesis, bronchorrhea/bronchospasm, bradycardia, sweating, fasciculations, weakness, and respiratory failure risk.`;
    }
    if (/chemical burn/.test(text)) {
      return `${name} causes ongoing tissue injury until the chemical is removed or neutralized according to protocol. Dry powders are brushed off before irrigation when appropriate; liquid exposures need prolonged irrigation, eye exposures are vision emergencies, and systemic absorption can cause acid-base or electrolyte problems.`;
    }
    if (/extravasation/.test(text)) {
      return `${name} occurs when a vesicant or irritating infusion leaks into tissue instead of staying intravascular. Anthracyclines, vinca alkaloids, vasopressors, contrast, and concentrated electrolytes can cause blistering, necrosis, compartment pressure, and loss of function unless the infusion is stopped and the drug-specific protocol is started quickly.`;
    }
    if (/pressure injury|deep tissue/.test(text)) {
      return `${name} is local tissue ischemia from pressure, shear, friction, moisture, or device compression. The key is depth and tissue viability: nonblanchable erythema, partial-thickness loss, full-thickness exposure, eschar/slough, or purple/maroon deep tissue change alters staging, offloading, dressing choice, and escalation.`;
    }
    if (/seizure|postictal/.test(text)) {
      return `${name} involves abnormal neuronal hyperexcitability or the recovery period after that electrical event. Safety centers on airway protection, injury prevention, seizure timing, glucose/oxygenation checks, focal-feature observation, and rapid escalation for prolonged seizure activity or failure to return toward baseline.`;
    }
    if (/renal|kidney|aki|dialysis|uremia|urinary|urologic/.test(text)) {
      return `${name} is a renal or urinary problem where filtration, drainage, electrolyte balance, or toxin clearance can fail. Link symptoms to urine output, creatinine/BUN, potassium, acid-base status, fluid overload, infection signs, obstruction, and medication clearance.`;
    }
    if (/resp|lung|pneumonia|airway|ards|copd|asthma|pleural|pneumo/.test(text)) {
      return `${name} becomes unsafe when oxygenation, ventilation, airway patency, or pulmonary circulation cannot meet demand. Tie findings to work of breathing, SpO2/ABG trend, breath sounds, chest imaging pattern, sputum or infection clues, and fatigue or mental-status change.`;
    }
    if (/coronary vasospasm|prinzmetal|variant angina/.test(text)) {
      return `${name} is transient coronary artery smooth-muscle constriction that reduces myocardial blood flow, often at rest. The ischemia can cause episodic chest pain and transient ST changes even without fixed plaque rupture, so nitrates/calcium-channel blockers, trigger avoidance, ECG changes, and troponin assessment matter.`;
    }
    if (/deep vein thrombosis|dvt/.test(text)) {
      return `${name} is thrombus formation in the deep venous system, often promoted after surgery by venous stasis, endothelial injury, and hypercoagulability. Calf or thigh swelling, unilateral pain, warmth, risk history, D-dimer context, venous ultrasound, anticoagulation safety, and pulmonary embolism warning signs are the high-yield links.`;
    }
    if (/pulmonary embolism/.test(text)) {
      return `${name} occurs when embolic material, usually thrombus from deep veins, lodges in pulmonary arteries and blocks perfusion to ventilated lung. Sudden dyspnea, pleuritic chest pain, tachycardia, hypoxemia, syncope, right-heart strain, D-dimer/CT angiography context, anticoagulation, and thrombolysis criteria drive urgency.`;
    }
    if (/diastolic heart failure|hfpef/.test(text)) {
      return `${name} is heart failure with impaired ventricular relaxation or stiffness, so filling pressures rise even when ejection fraction may be preserved. Pulmonary congestion, exertional dyspnea, hypertension, atrial fibrillation, LV hypertrophy, diuretic sensitivity, and careful volume/BP control are central.`;
    }
    if (/systolic heart failure|hfref/.test(text)) {
      return `${name} is heart failure from reduced ventricular contractile squeeze and reduced ejection fraction. Low forward output and neurohormonal activation cause fatigue, dyspnea, edema, renal hypoperfusion, congestion, dysrhythmia risk, and need for guideline-directed therapy and volume monitoring.`;
    }
    if (/left-sided heart failure/.test(text)) {
      return `${name} is failure of the left ventricle to fill or eject effectively, raising pulmonary venous pressure and reducing forward cardiac output. Dyspnea, crackles, orthopnea, pulmonary edema, S3, hypoxemia, BNP/chest imaging, diuretics, afterload control, and oxygenation are key.`;
    }
    if (/right-sided heart failure/.test(text)) {
      return `${name} is failure of the right ventricle to move venous blood through the pulmonary circulation. Systemic venous congestion causes JVD, hepatomegaly, ascites, peripheral edema, weight gain, renal congestion, and sensitivity to pulmonary hypertension or left-sided failure.`;
    }
    if (/post-mi heart failure/.test(text)) {
      return `${name} is ventricular dysfunction after myocardial infarction from lost contractile myocardium, stunning, remodeling, papillary muscle problems, or recurrent ischemia. Dyspnea, crackles, hypotension, S3, rising BNP, renal hypoperfusion, dysrhythmias, and cardiogenic shock cues change priority.`;
    }
    if (/heart failure/.test(text)) {
      return `${name} is impaired cardiac filling, ejection, or both, causing congestion and/or inadequate forward output. Severity is reflected by dyspnea, orthopnea, edema, crackles, JVD, weight gain, BNP, renal function, oxygenation, blood pressure, rhythm, and response to diuretics or afterload/pump support.`;
    }
    if (/hypertensive emergency/.test(text)) {
      return `${name} is severe blood-pressure elevation with acute target-organ injury such as encephalopathy, stroke, MI, pulmonary edema, aortic dissection, AKI, or retinal injury. The danger is organ damage, so controlled IV BP reduction and neurologic, cardiac, renal, and vascular assessment matter more than the number alone.`;
    }
    if (/hypertensive urgency/.test(text)) {
      return `${name} is severe blood-pressure elevation without acute target-organ injury. It still requires prompt assessment and medication follow-up, but rapid IV BP crashing can cause hypoperfusion; the priority is ruling out neurologic, cardiac, renal, retinal, and aortic emergency findings.`;
    }
    if (/primary hypertension/.test(text)) {
      return `${name} is chronic elevated blood pressure without a single reversible secondary cause, driven by vascular tone, renal sodium handling, sympathetic activity, genetics, age, obesity, sleep apnea, and lifestyle factors. Long-term injury affects brain, heart, kidneys, retina, and arteries.`;
    }
    if (/secondary hypertension/.test(text)) {
      return `${name} is elevated blood pressure caused by an identifiable condition or drug, such as kidney disease, renal artery stenosis, primary aldosteronism, sleep apnea, endocrine disease, pregnancy disorders, NSAIDs, stimulants, or oral contraceptives. Clues are abrupt onset, resistant BP, hypokalemia, renal bruit, or atypical age.`;
    }
    if (/inferior wall mi|silent mi|\bmi\b|myocardial infarction/.test(text)) {
      return `${name} is myocardial necrosis from prolonged coronary ischemia. Inferior MI often involves the RCA or LCx territory and may cause bradycardia, AV block, right-ventricular involvement, nausea, or hypotension; silent MI presents without classic chest pain, especially in diabetes or older adults.`;
    }
    if (/torsades de pointes/.test(text)) {
      return `${name} is a form of polymorphic ventricular tachycardia that occurs on a prolonged-QT substrate; the QRS complexes change axis and amplitude from beat to beat, creating the classic twisting appearance around the ECG baseline. Delayed ventricular repolarization permits early afterdepolarizations that can trigger recurrent runs, syncope, loss of pulse, or degeneration into ventricular fibrillation. Look for QT-prolonging drugs, hypokalemia, hypomagnesemia, bradycardia or pauses, and congenital long-QT syndrome. Sustained polymorphic VT cannot be synchronized reliably and requires immediate unsynchronized shock; for recurrent long-QT torsades, give IV magnesium per protocol, stop QT-prolonging causes, correct electrolytes, and seek expert help for pause-dependent recurrence such as overdrive pacing or isoproterenol.`;
    }
    if (/long qt|r-on-t|wolff-parkinson-white|wpw|sick sinus|premature ventricular|sinus bradycardia|sinus tachycardia|pulseless electrical activity/.test(text)) {
      return `${name} is an electrical rhythm or conduction problem where impulse timing, refractoriness, accessory pathways, ectopic beats, or absent mechanical output can reduce perfusion or trigger lethal dysrhythmia. ECG pattern, pulse presence, symptoms, potassium/magnesium, QT-prolonging drugs, ischemia, and ACLS stability criteria determine urgency.`;
    }
    if (/mitral|tricuspid|pulmonic|mechanical valve|valve/.test(text)) {
      return `${name} is a valve-structure or prosthetic-valve problem that changes forward flow, backward regurgitation, chamber pressure, or thrombosis/embolism risk. Murmur pattern, dyspnea, edema, syncope, atrial fibrillation, anticoagulation status, echo findings, pulmonary pressures, and endocarditis clues guide priority.`;
    }
    if (/orthostatic hypotension/.test(text)) {
      return `${name} is a blood-pressure drop with position change from impaired autonomic compensation, low volume, medication effects, deconditioning, or neurodegenerative disease. Dizziness, syncope, falls, heart-rate response, dehydration, bleeding, diabetic autonomic neuropathy, and medication review matter.`;
    }
    if (/pericardial effusion/.test(text)) {
      return `${name} is fluid accumulation in the pericardial sac. The danger is tamponade physiology: rising pericardial pressure limits ventricular filling, causing tachycardia, hypotension, JVD, muffled heart sounds, pulsus paradoxus, dyspnea, and obstructive shock if untreated.`;
    }
    if (/intermittent claudication|peripheral artery disease|peripheral vascular disease/.test(text)) {
      return `${name} is limb ischemia from atherosclerotic arterial narrowing or occlusion. Exertional muscle pain relieved by rest, reduced pulses, cool skin, delayed capillary refill, nonhealing wounds, ABI testing, smoking/diabetes risk, antiplatelet/statin therapy, and acute limb ischemia red flags matter.`;
    }
    if (/raynaud/.test(text)) {
      return `${name} is episodic vasospasm of small arteries/arterioles, usually in fingers or toes, triggered by cold or stress. Triphasic color change, numbness or pain, ulcers, connective-tissue disease clues, smoking/vasoconstrictor exposure, and warming/vasodilator strategies guide care.`;
    }
    if (/lymphedema/.test(text)) {
      return `${name} is protein-rich interstitial fluid accumulation from impaired lymphatic drainage. Chronic swelling, heaviness, skin thickening, infection risk, cancer surgery/radiation history, limb measurement, compression therapy, skin care, and cellulitis prevention are the learning anchors.`;
    }
    if (/portal hypertension/.test(text)) {
      return `${name} is elevated pressure in the portal venous system, most often from cirrhosis increasing intrahepatic resistance. Ascites, splenomegaly/thrombocytopenia, varices, GI bleeding, hepatic encephalopathy risk, SAAG/ultrasound/endoscopy findings, and beta-blocker or banding strategies matter.`;
    }
    if (/rheumatic heart disease/.test(text)) {
      return `${name} is chronic valve damage after immune-mediated rheumatic fever, most often affecting the mitral valve. Fibrosis and commissural fusion cause stenosis or regurgitation, leading to murmur, atrial fibrillation, pulmonary hypertension, embolic risk, and need for strep prevention history.`;
    }
    if (/venous stasis ulcer/.test(text)) {
      return `${name} is a lower-leg wound caused by chronic venous hypertension and edema. Shallow irregular ulcers near the medial malleolus, hemosiderin staining, drainage, aching improved by elevation, compression after arterial assessment, and cellulitis prevention are key.`;
    }
    if (/disseminated intravascular coagulation|immune thrombocytopenic purpura|thrombotic thrombocytopenic purpura|\bitp\b|\bttp\b/.test(text)) {
      return `${name} is a hematologic disorder where clotting, platelet number/function, or microvascular thrombosis changes bleeding and organ-risk patterns. Severity is shown by platelet count, hemolysis markers, PT/aPTT/fibrinogen/D-dimer when relevant, neurologic or renal findings, pregnancy/sepsis/cancer triggers, and active bleeding.`;
    }
    if (/cardiac|vascular|heart|coronary|shock|embol|hypertension|dysrhythm|infarct/.test(text)) {
      return `${name} is a cardiovascular condition that can alter pump function, rhythm timing, vascular resistance, vessel patency, valve flow, or pressure load. Clinically important clues include chest pain quality, dyspnea, syncope, pulse and perfusion changes, edema, urine output, mentation, ECG findings, troponin/BNP trends, blood pressure pattern, and vascular imaging when indicated.`;
    }
    if (/neuro|brain|stroke|spinal|\bcoma\b|delirium|intracranial/.test(text)) {
      return `${name} threatens neurologic function through altered perfusion, pressure, inflammation, electrical activity, toxic-metabolic injury, or structural compression. Trend level of consciousness, pupils, speech, motor asymmetry, swallowing, glucose, oxygenation, and sudden changes because small changes can signal irreversible injury.`;
    }
    if (/gi|liver|bowel|pancrea|abdomen|gall|hepat|cholang/.test(text)) {
      return `${name} is a gastrointestinal or hepatobiliary condition where obstruction, inflammation, bleeding, infection, malabsorption, hepatic synthetic failure, or abdominal perfusion may drive the clinical picture. High-yield clues include pain pattern, vomiting, stool or emesis changes, jaundice, guarding, hydration status, CBC/CMP/lipase/coagulation trends, and imaging or endoscopy findings.`;
    }
    if (/pediatric|neonatal|infant|child|maternal|newborn|pregnan|postpartum|fetal|uterine/.test(text)) {
      return `${name} must be interpreted with age- or pregnancy-specific norms. Small changes in feeding, tone, respiratory effort, perfusion, fetal tracing, bleeding, temperature, glucose, bilirubin, or hydration can be more important than adult-style symptom descriptions.`;
    }
    if (/infect|immune|sepsis|fever|abscess|cellulitis|central line|catheter/.test(text)) {
      return `${name} is an infectious, inflammatory, or immune-risk condition where host defenses, organism spread, and sepsis physiology determine urgency. Important findings include fever or hypothermia, tachycardia, tachypnea, hypotension, mental-status change, WBC/ANC trend, cultures, lactate, isolation needs, and source control.`;
    }
    if (/hema|oncology|cancer|anemia|leukemia|lymphoma|platelet|bleed|transfusion/.test(text)) {
      return `${name} affects oxygen delivery, clotting, immune defense, tumor burden, or treatment toxicity. Clinical severity is shown by CBC trends, bleeding or thrombosis risk, fever with neutropenia, organ compression, tumor lysis, hypercalcemia, transfusion needs, and therapy complications.`;
    }
    if (/psych|substance|withdrawal|intoxication|personality|delirium/.test(text)) {
      return `${name} is unsafe when cognition, perception, impulse control, intoxication, withdrawal physiology, or self-harm risk changes immediate safety. Always check oxygenation, glucose, infection, head injury, medication/substance exposure, and vital-sign instability before assuming a purely psychiatric cause.`;
    }
    if (/skin|burn|wound|trauma|fracture|musculo|ulcer|crush|extravasation/.test(text)) {
      return `${name} centers on tissue perfusion, structural integrity, infection prevention, pain, and mobility. Neurovascular checks, wound depth/drainage, mechanism of injury, swelling, pain out of proportion, fever, pulses, sensation, movement, and compartment risk guide escalation.`;
    }
    const category = String(disease.category || disease.sourceCategory || "clinical").replace(/\s+/g, " ").trim().toLowerCase();
    const system = profile?.system && !/affected body system/i.test(profile.system)
      ? profile.system
      : "the named body system or tissue";
    return `${name} is a ${category} problem involving ${system}. The clinical danger comes from the way the condition changes perfusion, oxygenation, neurologic function, inflammation, bleeding, infection, obstruction, fluid balance, electrolyte balance, or tissue integrity. Useful bedside proof comes from vital-sign trend, pain or function change, targeted labs or imaging, treatment response, and the complication most likely to accelerate deterioration.`;
  }

  function firstMeaningfulPathologyItem(value) {
    const items = Array.isArray(value) ? value : [value];
    return items
      .map((item) => pathologyFieldText(item))
      .find((item) => item && item.length >= 35 && !hasPathologyFiller(item) && !/\bmechanism depends\b/i.test(item)) || "";
  }

  function pathologyOpeningText(disease, profile) {
    return pathologyFieldText([
      disease.definition,
      disease.plainMeaning,
      disease.pathology,
      disease.pathophysiology
    ]);
  }

  function pathologyOpeningNeedsDepth(disease) {
    const text = pathologyOpeningText(disease, {});
    return text.length < 180 || hasPathologyFiller(text) || /\bexact mechanism depends\b/i.test(text);
  }

  function repairPathologyDefinition(disease, profile) {
    const name = pathologyName(disease);
    const current = pathologyFieldText(disease.definition || disease.plainMeaning);
    if (current && !hasPathologyFiller(current) && !/\bexact mechanism depends\b/i.test(current) && current.length >= 45) {
      disease.definition = current
        .replace(/\s*The exact mechanism depends on the shock type\./i, " Different shock types reach this failure through low volume, pump failure, vasodilation, or obstructed circulation.")
        .trim();
      return;
    }
    const replacement = firstMeaningfulPathologyItem(disease.pathology)
      || firstMeaningfulPathologyItem(disease.pathophysiology)
      || fallbackPathologyTeaching(disease, profile);
    disease.definition = replacement.includes(name)
      ? replacement
      : `${name}: ${replacement}`;
  }

  function buildRichPathologyOpening(disease, profile) {
    const name = pathologyName(disease);
    const existing = firstMeaningfulPathologyItem(disease.pathology)
      || firstMeaningfulPathologyItem(disease.pathophysiology)
      || firstMeaningfulPathologyItem(disease.definition)
      || fallbackPathologyTeaching(disease, profile);
    const system = pathologyFieldText(profile?.system);
    const diagnostic = firstMeaningfulPathologyItem(profile?.diagnostics)
      || firstMeaningfulPathologyItem(disease.diagnostics);
    const treatment = firstMeaningfulPathologyItem(profile?.treatments)
      || firstMeaningfulPathologyItem(disease.treatments);
    const priority = firstMeaningfulPathologyItem(profile?.priorities)
      || firstMeaningfulPathologyItem(disease.nursingPriorities);
    const signs = firstMeaningfulPathologyItem(disease.signsSymptoms)
      || firstMeaningfulPathologyItem(fallbackPathologySigns(disease));
    const sentences = [
      existing,
      signs ? `Common recognition clues include ${signs.replace(/\.$/, "")}.` : "",
      diagnostic ? `Diagnostic confirmation is anchored by ${diagnostic.replace(/\.$/, "")}.` : "",
      treatment ? `Treatment priorities center on ${treatment.replace(/\.$/, "")}.` : "",
      priority ? `Nursing priority is ${priority.replace(/\.$/, "")}.` : ""
    ].filter(Boolean);
    const deduped = unique(sentences.map((sentence) => sentence.replace(/\s+/g, " ").trim()));
    const value = deduped.join(" ");
    return value.length >= 180 ? value : `${value} Severity is shown by the failing structure, the measurable bedside finding, and the complication that changes urgency.`;
  }

  function fallbackPathologySigns(disease) {
    const name = pathologyName(disease);
    const text = `${String(disease.category || "")} ${String(disease.sourceSubcategory || "")} ${name}`.toLowerCase();
    if (/cryptorchidism/.test(text)) return [];
    if (/esophageal atresia|tracheoesophageal fistula|\btef\b/.test(text)) {
      return [
        "Copious drooling or frothy secretions, choking/coughing/cyanosis with feeds, desaturation, respiratory distress, or recurrent aspiration.",
        "Inability to pass an orogastric/nasogastric tube, tube coiling in the upper pouch, and abdominal distention when a distal fistula lets air enter the stomach."
      ];
    }
    if (/tension pneumothorax/.test(text)) {
      return [
        "Sudden severe dyspnea, unilateral absent or markedly decreased breath sounds, pleuritic chest pain, tachycardia, hypoxemia, anxiety, or cyanosis.",
        "Hypotension, JVD, tracheal deviation away from the affected side, distended neck veins, or cardiac arrest are late obstructive-shock cues."
      ];
    }
    if (normalize(name) === "stroke") {
      return [
        "Sudden face droop, arm or leg weakness/numbness, speech trouble, vision loss, neglect, severe headache, dizziness, ataxia, or imbalance.",
        "Last-known-well time, glucose check, and rapid neuro change matter because reperfusion eligibility and hemorrhage risk are time-sensitive."
      ];
    }
    if (/corneal abrasion/.test(text)) {
      return [
        "Acute eye pain, foreign-body sensation, tearing, photophobia, blepharospasm, redness, and fluorescein staining of the epithelial defect.",
        "Contact lens use, decreased visual acuity, purulent drainage, corneal opacity, or penetrating trauma changes the urgency."
      ];
    }
    if (/diabetic nephropathy/.test(text)) {
      return [
        "Often asymptomatic early; albuminuria, rising blood pressure, edema, foamy urine, or declining eGFR can appear as kidney damage progresses.",
        "Worsening creatinine, hyperkalemia, fluid overload, or uncontrolled hypertension changes priority."
      ];
    }
    if (/malignant hyperthermia/.test(text)) {
      return [
        "Early clues are rapidly rising end-tidal CO2, tachycardia, tachypnea, masseter or generalized rigidity, acidosis, and hyperkalemia during/after anesthesia.",
        "High fever may be later; cola urine, high CK, dysrhythmias, and shock signal rhabdomyolysis and severe crisis."
      ];
    }
    if (/\bsids\b|sudden infant death/.test(text)) {
      return [
        "SIDS is typically an unexplained sudden death during sleep in an infant younger than 1 year, so there may be no warning symptoms before the event.",
        "Risk context matters for prevention teaching: prone or side sleeping, soft bedding, overheating, bed-sharing hazards, smoke exposure, prematurity, and lack of a separate firm sleep surface."
      ];
    }
    if (/cardiac|vascular|heart|shock|dysrhythm|infarct/.test(text)) {
      return ["Chest pain, dyspnea, syncope, palpitations, hypotension, weak/absent pulses, cool skin, altered mentation, or low urine output depending on the perfusion problem.", "Worsening trend matters: new ECG change, rising troponin/BNP, escalating oxygen need, or falling blood pressure changes priority."];
    }
    if (/resp|lung|airway|pneumonia|ards|copd|asthma/.test(text)) {
      return ["Dyspnea, tachypnea, accessory-muscle use, abnormal breath sounds, cough/sputum, chest pain, hypoxemia, cyanosis, fatigue, or confusion.", "Silent chest, stridor, rising CO2 signs, or exhaustion is more dangerous than a noisy but moving airway."];
    }
    if (/neuro|brain|stroke|spinal|seizure|\bcoma\b/.test(text)) {
      return ["Altered level of consciousness, focal weakness, speech change, pupil change, seizure activity, sensory loss, severe headache, gait change, or new swallowing trouble.", "Sudden change from baseline is a red flag even when vital signs are not dramatic."];
    }
    if (/renal|kidney|urinary|\buti\b|pyelo|urosepsis|electrolyte|dialysis|dehydrat|fluid|acid|base/.test(text)) {
      return ["Urine output change, edema, thirst, dry mucosa, dizziness, flank/suprapubic pain, dysuria, confusion, weakness, weight change, or abnormal heart rhythm can reveal renal, fluid, or electrolyte stress.", "Escalate anuria, severe potassium abnormality, pulmonary edema, seizure, dysrhythmia, shock, or worsening acidosis."];
    }
    if (/\bgi\b|liver|bowel|pancrea|abdomen|gall|hepat|cholang|constipation|diarrhea|dysphagia|fecal|gastric/.test(text)) {
      return ["Abdominal pain pattern, distention, nausea/vomiting, diarrhea or constipation, stool/emesis blood, jaundice, dysphagia, poor intake, dehydration, or guarding are the useful GI clues.", "Escalate rigid abdomen, peritonitis signs, GI bleeding, shock, severe dehydration, fever with jaundice, or worsening mental status."];
    }
    if (/endocrine|diabet|\bdka\b|ketoacidosis|\bhhs\b|thyroid|adrenal|pituitary|metabolic|calcium|glucose|cushing|conn|parathyroid|folate|vitamin|refeeding|malnutrition|obesity/.test(text)) {
      return ["Weakness, sweating, tremor, palpitations, mental-status change, weight change, thirst/polyuria, muscle cramps/spasm, paresthesias, fatigue, temperature intolerance, or abnormal growth/nutrition cues can reveal metabolic instability.", "Escalate severe hypo/hyperglycemia, seizure, dysrhythmia, tetany/laryngospasm, adrenal crisis, thyroid storm, refeeding electrolyte collapse, or DKA/HHS signs."];
    }
    if (/emergency|critical|toxicology|poison|overdose|drowning|frostbite|heat|hypothermia|hyperthermia|bite|envenomation|snake|spider|postoperative|atelectasis|ileus|cyanide|digoxin/.test(text)) {
      return ["Timeline and trigger matter: exposure, ingestion, submersion, temperature stress, anesthesia, procedure, bite, or postoperative immobility plus vital-sign, neurologic, respiratory, skin, pain, and perfusion changes.", "Escalate altered mental status, airway trouble, shock, dysrhythmia, severe temperature abnormality, rapidly spreading tissue injury, respiratory distress, or worsening pain/swelling."];
    }
    if (/eye|ent|ophthalm|ocular|retina|cornea|cataract|glaucoma|epistaxis|tinnitus|hearing|vision|visual|ear|nasal|nose|throat/.test(text)) {
      return ["Vision change, eye pain, photophobia, foreign-body sensation, redness, drainage, hearing change, vertigo, nasal bleeding, throat swelling, or facial/ear pain anchor eye and ENT assessment.", "Escalate sudden vision loss, painful red eye, chemical exposure, penetrating eye injury, posterior/uncontrolled nosebleed, airway swelling, or neurologic symptoms."];
    }
    if (/psych|substance|withdrawal|intoxication|personality|delirium|cannabis|alcohol|opioid|benzodiazepine|hallucinogen|extrapyramidal/.test(text)) {
      return ["Orientation change, agitation, hallucinations, paranoia, sedation, respiratory rate, autonomic instability, tremor, rigidity, dystonia, self-harm risk, violence risk, hydration, and sleep disruption guide safety.", "Escalate respiratory depression, severe withdrawal, delirium, suicidal intent, violent behavior, hyperthermia/rigidity, or unstable vital signs."];
    }
    if (/infect|immune|sepsis|fever|abscess|cellulitis|clostridioides|c difficile|covid|central line|catheter|hand-foot|mumps|shingles|graft/.test(text)) {
      return ["Fever or hypothermia, chills, source pain/redness/drainage, cough, dysuria, diarrhea, rash, mucosal lesions, lymph nodes, mental-status change, hypotension, tachypnea, or immunosuppression cues reveal infection risk.", "Escalate sepsis signs, neutropenic fever, rapidly spreading infection, airway swelling, meningitis signs, or shock."];
    }
    if (/hema|oncology|cancer|anemia|leukemia|lymphoma|platelet|bleed|transfusion|hypercalcemia|hemophilia/.test(text)) {
      return ["Fatigue, dyspnea, pallor, bruising, petechiae, mucosal bleeding, fever, bone pain, lymphadenopathy, weight loss, neurologic change, or transfusion symptoms guide hematology/oncology priority.", "Escalate neutropenic fever, active bleeding, severe anemia symptoms, tumor lysis signs, hypercalcemia crisis, or transfusion reaction."];
    }
    if (/skin|burn|wound|trauma|fracture|musculo|pressure|ulcer|chemical|crush|extravasation|dislocation|evisceration|injury/.test(text)) {
      return ["Pain, swelling, deformity, wound depth, drainage, odor, tissue color, blistering, numbness/tingling, pulses, movement, sensation, capillary refill, fever, or mechanism of injury shapes tissue-risk assessment.", "Escalate absent pulses, compartment syndrome signs, evisceration, circumferential burn compromise, spreading infection, necrosis, or pain out of proportion."];
    }
    if (/pediatric|neonatal|infant|child|maternal|newborn|pregnan|postpartum|fetal/.test(text)) {
      return ["Age- or pregnancy-specific cues: feeding change, weak cry, tone change, respiratory effort, poor perfusion, abnormal fetal tracing, bleeding, fever or low temperature, dehydration, or caregiver concern.", "Infants and pregnant/postpartum clients may deteriorate with subtle symptoms, so trend and context matter."];
    }
    return [`For ${name}, bedside cues to compare over time include pain location/quality, function loss, vital signs, mental status, perfusion, oxygenation, urine output, bleeding, infection signs, and response to treatment.`, "Escalate sudden deterioration, unstable vital signs, severe pain, new neurologic change, hypoxia, uncontrolled bleeding, or sepsis physiology."];
  }

  function enrichThinPathologyEntries() {
    if (!Array.isArray(pathology.diseases)) return;
    pathology.diseases.forEach((disease) => {
      const name = pathologyName(disease);
      const profile = pathologyProfile(disease);
      if (/\bmechanism depends\b/i.test(pathologyFieldText(disease.pathophysiology))) {
        disease.pathophysiology = "";
      }
      if (/\bmechanism depends\b/i.test(pathologyFieldText(disease.pathology))) {
        disease.pathology = "";
      }
      repairPathologyDefinition(disease, profile);
      if (pathologyOpeningNeedsDepth(disease)) {
        disease.pathology = buildRichPathologyOpening(disease, profile);
      }
      if (pathologyFieldNeedsContent(disease, "pathology")) {
        disease.pathology = fallbackPathologyTeaching(disease, profile);
      }
      if (pathologyFieldNeedsContent(disease, "signsSymptoms")) {
        disease.signsSymptoms = fallbackPathologySigns(disease);
      }
      if (pathologyFieldNeedsContent(disease, "diagnostics")) disease.diagnostics = profile.diagnostics;
      if (pathologyFieldNeedsContent(disease, "treatments")) disease.treatments = profile.treatments;
      if (pathologyFieldNeedsContent(disease, "nursingPriorities")) disease.nursingPriorities = profile.priorities;
      if (pathologyFieldNeedsContent(disease, "complications")) disease.complications = profile.complications;
      if (pathologyFieldNeedsContent(disease, "nclexTraps")) disease.nclexTraps = [profile.trap];
    });
  }

  const pharmUpdates = [
    {
      name: "Benserazide",
      generic: "Benserazide",
      displayName: "Benserazide",
      aliases: ["benserazide levodopa", "levodopa benserazide", "DOPA decarboxylase inhibitor"],
      class: "Peripheral aromatic L-amino-acid decarboxylase inhibitor used only with levodopa",
      description: "Benserazide is the peripheral decarboxylase-inhibitor partner in some levodopa products for Parkinson disease. Its job is not to treat dopamine deficiency by itself; it protects levodopa in the bloodstream so more levodopa reaches the brain and fewer peripheral dopamine effects occur.",
      usedToTreat: "Parkinson disease motor symptoms only as part of a levodopa-benserazide combination product in countries where that product is used.",
      mechanism: "Benserazide inhibits peripheral aromatic L-amino-acid decarboxylase, the enzyme that converts levodopa into dopamine outside the CNS. Because benserazide does not meaningfully cross the blood-brain barrier, it reduces peripheral dopamine formation while allowing more levodopa to enter the brain, where levodopa can be converted to dopamine for motor benefit.",
      nursingEssentials: [
        "Assess mobility, tremor/rigidity, swallowing, orthostatic blood pressure, nausea, hallucinations, dyskinesias, and wearing-off before the next dose.",
        "Teach that abrupt stopping of dopaminergic therapy can cause severe rigidity, fever, confusion, or neuroleptic-malignant-like deterioration."
      ],
      interactions: [
        "Antipsychotics and metoclopramide can reduce dopaminergic benefit.",
        "High-protein meals and iron may reduce levodopa absorption in some clients.",
        "MAOIs and sympathomimetic drugs can increase blood-pressure risk depending on regimen."
      ],
      keyLabs: ["No routine benserazide level is used. Track symptom timing, blood pressure, falls, hallucinations, and dyskinesias."],
      nclexTraps: [
        "Benserazide is not the dopamine replacement; levodopa is the CNS dopamine precursor.",
        "Peripheral dopamine blockade explains less nausea and orthostasis, but it does not remove CNS dyskinesia or hallucination risk."
      ],
      tags: ["benserazide", "levodopa", "parkinson", "dopa decarboxylase", "dopamine"]
    },
    {
      name: "Enmetazobactam",
      generic: "Enmetazobactam",
      displayName: "Enmetazobactam",
      aliases: ["cefepime enmetazobactam", "beta-lactamase inhibitor"],
      class: "Beta-lactamase inhibitor paired with cefepime",
      description: "Enmetazobactam is a beta-lactamase inhibitor used in combination with cefepime. It is included to protect the cephalosporin partner from enzymatic destruction by susceptible beta-lactamase-producing gram-negative bacteria.",
      usedToTreat: "Complicated urinary tract infection and pyelonephritis due to susceptible organisms when given as the cefepime-enmetazobactam combination product.",
      mechanism: "Enmetazobactam inhibits selected bacterial beta-lactamases, including many extended-spectrum beta-lactamase enzymes, so cefepime is less likely to be hydrolyzed before it reaches penicillin-binding proteins. The antibacterial killing comes mainly from cefepime blocking peptidoglycan cell-wall cross-linking; enmetazobactam widens the activity of the partner beta-lactam when the resistance mechanism is beta-lactamase mediated.",
      nursingEssentials: [
        "Confirm allergy history, infection site, cultures, renal function, and response to therapy.",
        "Monitor for diarrhea/C. difficile, rash, anaphylaxis, kidney-adjusted dosing needs, seizure risk from cefepime accumulation, and clinical improvement."
      ],
      interactions: ["Other nephrotoxic drugs or renal impairment can increase safety concerns for the cefepime-containing regimen."],
      keyLabs: ["Creatinine/eGFR, WBC trend, temperature, urine culture/susceptibility, and stool pattern if diarrhea develops."],
      nclexTraps: [
        "Enmetazobactam is not the main antibiotic killer; it protects cefepime from beta-lactamase breakdown.",
        "Broad gram-negative coverage still requires culture review and renal dosing."
      ],
      tags: ["enmetazobactam", "cefepime", "beta lactamase inhibitor", "ESBL", "UTI"]
    },
    {
      name: "Ethinyl Estradiol",
      generic: "Ethinyl Estradiol",
      displayName: "Ethinyl estradiol",
      aliases: ["ethinyl oestradiol", "synthetic estrogen", "combined oral contraceptive estrogen"],
      class: "Synthetic estrogen; estrogen-receptor agonist used in hormonal contraception and hormone therapy combinations",
      description: "Ethinyl estradiol is a potent synthetic estrogen used most often as the estrogen component of combined hormonal contraceptives. The nursing identity is estrogen-receptor signaling plus hypothalamic-pituitary feedback suppression, endometrial effects, and thromboembolic/BP risk screening.",
      usedToTreat: "Pregnancy prevention in combined hormonal contraception, menstrual-cycle regulation, abnormal uterine bleeding, acne or dysmenorrhea in selected products, and other estrogen-responsive indications depending on formulation.",
      mechanism: "Ethinyl estradiol activates estrogen receptors and provides negative feedback at the hypothalamus and pituitary, suppressing follicle-stimulating hormone and helping prevent dominant follicle development. In combination with a progestin, it stabilizes the endometrium, improves cycle control, and supports ovulation suppression. Hepatic estrogen effects increase clotting-factor production, which explains venous thromboembolism, stroke, and myocardial infarction warnings in high-risk clients.",
      contraindications: [
        "Clarify history of VTE, stroke, ischemic heart disease, migraine with aura, uncontrolled hypertension, smoking age 35 or older, breast cancer, severe liver disease, pregnancy, or major surgery/immobility risk."
      ],
      nursingEssentials: [
        "Screen blood pressure, smoking status, migraine pattern, clot history, postpartum timing, cancer/liver history, and interacting drugs.",
        "Teach ACHES warning cues: abdominal pain, chest pain/shortness of breath, headache severe/new neurologic symptoms, eye/vision changes, and severe leg pain/swelling."
      ],
      interactions: ["Strong enzyme inducers such as rifampin, certain antiseizure drugs, and St. John's wort can reduce contraceptive effectiveness."],
      keyLabs: ["No routine estrogen level is used. Monitor blood pressure and pregnancy status when clinically indicated."],
      nclexTraps: [
        "Ethinyl estradiol is the clot-risk driver in many combined contraceptive safety questions.",
        "Migraine with aura or smoking after age 35 changes the safety answer."
      ],
      tags: ["ethinyl estradiol", "estrogen", "contraception", "combined oral contraceptive", "VTE"]
    },
    {
      name: "Norethindrone",
      generic: "Norethindrone",
      displayName: "Norethindrone",
      aliases: ["norethisterone", "progestin", "progestin-only pill"],
      class: "Synthetic progestin; progesterone-receptor agonist",
      description: "Norethindrone is a synthetic progestin used in progestin-only contraception, combined hormonal contraception, and selected gynecologic bleeding or endometriosis regimens. Its core pharmacology is progesterone-receptor signaling that changes cervical mucus, endometrium, and ovulation patterns.",
      usedToTreat: "Pregnancy prevention, abnormal uterine bleeding, endometriosis-related pain/bleeding, menstrual suppression, and other progestin-responsive indications depending on dose and formulation.",
      mechanism: "Norethindrone activates progesterone receptors. Low-dose progestin-only therapy thickens cervical mucus so sperm penetration is reduced, alters endometrial receptivity, and may inconsistently suppress ovulation; higher-dose or combined regimens more reliably suppress the hypothalamic-pituitary-ovarian axis. These same hormonal effects explain irregular bleeding, breast tenderness, mood changes, and androgenic effects in some clients.",
      contraindications: [
        "Clarify current breast cancer, unexplained vaginal bleeding, severe liver disease, pregnancy, hypersensitivity, and thrombotic-risk context for combined estrogen-progestin products."
      ],
      nursingEssentials: [
        "Ask which formulation the client uses because progestin-only pills require tighter same-time dosing than many combined pills.",
        "Assess bleeding pattern, pregnancy possibility, migraine/clot history when estrogen is also present, mood changes, and medication interactions."
      ],
      interactions: ["Enzyme-inducing drugs such as rifampin, some antiseizure medications, and St. John's wort can reduce contraceptive reliability."],
      keyLabs: ["No routine progestin level is used. Pregnancy testing is important when doses are missed or bleeding pattern changes unexpectedly."],
      nclexTraps: [
        "Norethindrone-only products are not the same safety profile as estrogen-containing products.",
        "Missed or late progestin-only pills can matter quickly because cervical-mucus effect is time sensitive."
      ],
      tags: ["norethindrone", "norethisterone", "progestin", "contraception", "endometriosis"]
    },
    {
      name: "Relebactam",
      generic: "Relebactam",
      displayName: "Relebactam",
      aliases: ["imipenem cilastatin relebactam", "Recarbrio", "diazabicyclooctane beta-lactamase inhibitor"],
      class: "Diazabicyclooctane beta-lactamase inhibitor paired with imipenem/cilastatin",
      description: "Relebactam is the beta-lactamase-inhibitor partner in imipenem-cilastatin-relebactam. It is not the primary antibacterial drug; it protects imipenem from selected resistance enzymes so the carbapenem can reach its cell-wall target.",
      usedToTreat: "Complicated urinary tract infection, complicated intra-abdominal infection, and hospital-acquired or ventilator-associated bacterial pneumonia due to susceptible organisms when the combination product is appropriate.",
      mechanism: "Relebactam inhibits selected class A and class C beta-lactamases, including some carbapenemase and AmpC-type enzymes, restoring or improving imipenem activity when resistance is enzyme mediated. Imipenem then binds penicillin-binding proteins and blocks bacterial cell-wall synthesis, while cilastatin reduces renal imipenem breakdown. Relebactam does not solve every carbapenem resistance mechanism, such as porin loss or metallo-beta-lactamases.",
      nursingEssentials: [
        "Verify cultures, allergy history, renal dosing, seizure history, ventilator or intra-abdominal source-control needs, and clinical response.",
        "Monitor diarrhea/C. difficile, kidney function, neurologic changes or seizures, and superinfection."
      ],
      interactions: ["Carbapenems can lower valproic acid levels and raise seizure risk; therapy usually needs a different plan."],
      keyLabs: ["Creatinine/eGFR, WBC trend, cultures/susceptibilities, temperature, oxygenation if pneumonia, and stool pattern if diarrhea occurs."],
      nclexTraps: [
        "Relebactam protects imipenem; it is not a stand-alone antibiotic.",
        "Carbapenem-valproate interaction is a serious seizure-risk clue."
      ],
      tags: ["relebactam", "imipenem", "cilastatin", "beta lactamase inhibitor", "carbapenem", "Recarbrio"]
    },
    {
      name: "Sacubitril",
      generic: "Sacubitril",
      displayName: "Sacubitril",
      aliases: ["sacubitril valsartan", "Entresto", "neprilysin inhibitor", "ARNI"],
      class: "Neprilysin inhibitor component of angiotensin receptor-neprilysin inhibitor therapy",
      description: "Sacubitril is the neprilysin-inhibitor half of sacubitril/valsartan, the ARNI used in heart failure care. Its value comes from increasing beneficial natriuretic-peptide signaling while valsartan blocks angiotensin II receptor effects.",
      usedToTreat: "Heart failure with reduced ejection fraction and selected heart-failure populations when prescribed as the sacubitril/valsartan combination product.",
      mechanism: "Sacubitril is converted to an active metabolite that inhibits neprilysin, an enzyme that breaks down natriuretic peptides, bradykinin, adrenomedullin, and related vasoactive peptides. Higher natriuretic-peptide activity promotes vasodilation, natriuresis, diuresis, lower sympathetic tone, and less maladaptive remodeling. Because neprilysin inhibition can increase angioedema mediators, it must be paired with ARB rather than ACE inhibitor and separated from ACE inhibitors by the required washout window.",
      contraindications: [
        "Do not use with an ACE inhibitor or within the unsafe ACE-inhibitor washout window.",
        "Clarify history of angioedema, pregnancy, severe hyperkalemia, hypotension, renal artery stenosis, or severe renal/hepatic impairment."
      ],
      nursingEssentials: [
        "Monitor blood pressure, dizziness/falls, potassium, renal function, weight/edema, dyspnea, and angioedema symptoms.",
        "Teach clients not to combine with ACE inhibitors and to seek urgent care for face, lip, tongue, or throat swelling."
      ],
      interactions: ["ACE inhibitors, aliskiren in diabetes, potassium supplements, potassium-sparing diuretics, NSAIDs, lithium, and other blood-pressure-lowering drugs can be important."],
      keyLabs: ["Potassium, creatinine/eGFR, blood pressure trend, weight, edema, and heart-failure symptom response."],
      nclexTraps: [
        "Sacubitril is not used alone in routine heart failure products; think sacubitril plus valsartan.",
        "ACE-inhibitor washout and angioedema risk are the high-yield safety details."
      ],
      tags: ["sacubitril", "valsartan", "ARNI", "neprilysin", "heart failure", "Entresto"]
    },
    {
      name: "Vilanterol",
      generic: "Vilanterol",
      displayName: "Vilanterol",
      aliases: ["fluticasone vilanterol", "umeclidinium vilanterol", "Breo Ellipta", "Anoro Ellipta", "Trelegy Ellipta", "LABA"],
      class: "Long-acting beta-2 agonist bronchodilator",
      description: "Vilanterol is a long-acting beta-2 agonist used in inhaled maintenance products for COPD and asthma-related combination therapy. It is a controller bronchodilator, not a rescue medication for sudden bronchospasm.",
      usedToTreat: "Maintenance bronchodilation in COPD and asthma control only in appropriate combination inhalers, usually with an inhaled corticosteroid for asthma or with LAMA/ICS partners depending on product.",
      mechanism: "Vilanterol stimulates beta-2 receptors on bronchial smooth muscle, activating Gs signaling and adenylyl cyclase to raise intracellular cAMP. Higher cAMP relaxes airway smooth muscle and improves airflow for many hours. Because LABA monotherapy can increase asthma-related risk, asthma products pair vilanterol with an inhaled corticosteroid to treat airway inflammation as well as bronchoconstriction.",
      nursingEssentials: [
        "Confirm the inhaler is for maintenance, not acute rescue; keep a SABA rescue inhaler available if prescribed.",
        "Assess breath sounds, dyspnea, exacerbation frequency, tremor, palpitations, heart rate, potassium risk, and inhaler technique."
      ],
      interactions: ["Other sympathomimetics, beta blockers, diuretics that lower potassium, MAOIs/TCAs, and QT-risk drugs can increase adverse-effect concerns."],
      keyLabs: ["No routine level is used. Monitor respiratory symptoms, rescue-inhaler use, heart rate, and potassium if high-risk or symptomatic."],
      nclexTraps: [
        "Vilanterol is LABA maintenance therapy, not fast rescue.",
        "Asthma LABA use should be with anti-inflammatory controller therapy, not LABA alone."
      ],
      tags: ["vilanterol", "LABA", "beta 2 agonist", "COPD", "asthma", "Breo", "Anoro", "Trelegy"]
    },
    {
      name: "Rifampin",
      generic: "Rifampin",
      displayName: "Rifampin",
      aliases: ["rifampicin", "Rifadin", "R", "RIPE R", "rifamycin"],
      class: "Rifamycin antimycobacterial; first-line RIPE tuberculosis medication; strong CYP/P-gp inducer",
      description: "Rifampin is a rifamycin antibiotic used as a backbone drug in tuberculosis therapy. It is memorable because it turns body fluids red-orange, but clinically it is even more important as a bacterial RNA-polymerase inhibitor and one of the strongest interaction drugs in routine nursing pharmacology.",
      usedToTreat: "Active drug-susceptible tuberculosis as part of combination therapy, selected latent TB regimens, meningococcal or Haemophilus influenzae prophylaxis when ordered, and selected serious staphylococcal or device-related infections only as part of specialist-directed combination therapy.",
      mechanism: "Rifampin binds the beta subunit of bacterial DNA-dependent RNA polymerase, blocking RNA transcription so susceptible mycobacteria cannot make the RNA needed for protein synthesis and replication. It is bactericidal against active Mycobacterium tuberculosis and helps prevent resistance only when used in an appropriate multi-drug regimen. In human liver and gut, rifampin strongly induces CYP enzymes and P-glycoprotein, which is why it can lower exposure to oral contraceptives, warfarin, many antivirals, azoles, transplant drugs, and other narrow-therapeutic-index medications.",
      contraindications: [
        "Hypersensitivity to rifamycins.",
        "Clarify severe active liver disease, jaundice, porphyria history, or a medication list that contains drugs whose levels cannot safely be reduced.",
        "Concurrent atazanavir, darunavir, fosamprenavir, lurasidone, praziquantel, or tipranavir-containing regimens require specialist/pharmacy review because rifampin can make therapy unsafe or ineffective."
      ],
      nursingEssentials: [
        "Review the entire medication list before the first dose and at every change; rifampin can make hormonal contraception, warfarin, some HIV drugs, azole antifungals, many seizure drugs, and transplant drugs fail or require adjustment.",
        "Monitor adherence, liver symptoms, AST/ALT/bilirubin when ordered, fever/rash, thrombocytopenia or bleeding/bruising cues, and TB symptom response.",
        "Teach that orange-red urine, sweat, saliva, and tears are expected, but jaundice, dark urine with systemic illness, severe fatigue, abdominal pain, fever, rash, bruising, or bleeding is not expected."
      ],
      interactions: [
        "Major inducer of CYP3A4, CYP2C9, CYP2C19, UGT pathways, and P-gp; many drugs can become subtherapeutic.",
        "Can reduce effectiveness of hormonal contraceptives; use nonhormonal backup as directed.",
        "Can lower warfarin effect and destabilize INR; anticoagulation plans need close monitoring.",
        "Alcohol and other hepatotoxic drugs increase liver-injury concern."
      ],
      keyLabs: [
        "AST/ALT, bilirubin, symptoms of hepatitis, CBC/platelets if bleeding or bruising occurs, TB cultures/smear response when ordered, and INR if on warfarin."
      ],
      patientEducation: [
        "RIPE memory anchor: R = red/orange. Rifampin can harmlessly discolor urine, sweat, saliva, and tears orange-red and can permanently stain soft contact lenses.",
        "Take the full TB regimen exactly as directed even when symptoms improve; missed or partial therapy promotes resistance.",
        "Report jaundice, dark urine with illness, severe fatigue, abdominal pain, fever, rash, unusual bruising/bleeding, or worsening TB symptoms."
      ],
      nclexTraps: [
        "Orange secretions are expected teaching; liver injury, thrombocytopenia, severe rash, and major interactions are safety problems.",
        "Do not give rifampin as TB monotherapy. TB treatment needs combination therapy to prevent resistance.",
        "Rifampin can make oral contraceptives fail; this is a classic high-yield counseling point."
      ],
      tags: ["rifampin", "rifampicin", "rifamycin", "RIPE", "tuberculosis", "RNA polymerase", "orange secretions", "CYP inducer", "hepatotoxicity"]
    },
    {
      name: "Isoniazid",
      generic: "Isoniazid",
      displayName: "Isoniazid",
      aliases: ["INH", "H", "RIPE H", "isonicotinic acid hydrazide"],
      class: "First-line antimycobacterial; mycolic acid synthesis inhibitor; RIPE tuberculosis medication",
      description: "Isoniazid is a first-line tuberculosis drug that targets the mycobacterial cell wall. Its nursing identity is mycolic acid blockade plus two major safety anchors: hepatotoxicity and pyridoxine-responsive peripheral neuropathy.",
      usedToTreat: "Active drug-susceptible tuberculosis as part of RIPE combination therapy, latent TB infection regimens, and selected nontuberculous mycobacterial regimens when susceptibility and specialist guidance support it.",
      mechanism: "Isoniazid is a prodrug activated inside Mycobacterium tuberculosis by the KatG catalase-peroxidase enzyme. Activated INH inhibits enzymes involved in mycolic acid synthesis, especially InhA-related fatty acid and mycolic acid pathways, weakening the waxy mycobacterial cell wall that protects TB bacilli. Human toxicity is tied to hepatic metabolism and functional vitamin B6 depletion, which can reduce neurotransmitter support in peripheral nerves and cause neuropathy unless pyridoxine is given to at-risk clients.",
      boxedWarning: "Drug-specific boxed warning: severe and sometimes fatal hepatitis can occur and may develop even after many months of therapy. Risk rises with age, alcohol use, liver disease, and other hepatotoxic exposures.",
      contraindications: [
        "Acute liver disease or prior severe isoniazid-associated hepatic injury unless specialist-directed.",
        "Clarify heavy alcohol use, chronic liver disease, pregnancy/postpartum context, diabetes, HIV, malnutrition, renal failure, seizure disorder, and concurrent hepatotoxic medications."
      ],
      nursingEssentials: [
        "Monitor liver symptoms, AST/ALT/bilirubin when ordered, adherence, neuropathy symptoms, alcohol use, and seizure risk.",
        "Give pyridoxine vitamin B6 when ordered, especially in pregnancy, breastfeeding, diabetes, HIV, alcoholism, malnutrition, renal failure, advanced age, or existing neuropathy.",
        "Teach that numbness, tingling, burning pain, confusion, seizures, severe fatigue, jaundice, dark urine, nausea/vomiting, or loss of appetite requires prompt reporting."
      ],
      interactions: [
        "Alcohol and other hepatotoxic agents increase liver-injury risk.",
        "Can increase exposure/toxicity risk of selected drugs such as phenytoin, carbamazepine, benzodiazepines, and warfarin depending on regimen and client factors.",
        "Food can reduce absorption; follow the prescribed timing instructions."
      ],
      keyLabs: [
        "AST/ALT and bilirubin when ordered or symptoms occur, TB microbiology response when ordered, neuropathy assessment, and drug levels only in special situations."
      ],
      patientEducation: [
        "RIPE memory anchor: I = injury to nerves. Isoniazid can cause peripheral neuropathy, and vitamin B6 (pyridoxine) helps prevent it in at-risk clients.",
        "Avoid alcohol unless the prescriber says otherwise because liver injury is a major danger.",
        "Finish the regimen exactly as prescribed even if symptoms improve."
      ],
      nclexTraps: [
        "Peripheral neuropathy on INH points to pyridoxine, not a routine side effect to ignore.",
        "Jaundice, dark urine, severe fatigue, anorexia, nausea/vomiting, or abdominal pain suggests hepatitis until proven otherwise.",
        "Latent TB therapy and active TB therapy are not the same thing; active TB needs combination treatment."
      ],
      tags: ["isoniazid", "INH", "RIPE", "tuberculosis", "mycolic acid", "KatG", "pyridoxine", "vitamin B6", "peripheral neuropathy", "hepatotoxicity"]
    },
    {
      name: "Pyrazinamide",
      generic: "Pyrazinamide",
      displayName: "Pyrazinamide",
      aliases: ["PZA", "Z", "RIPE Z"],
      class: "First-line antimycobacterial prodrug; pyrazinoic-acid tuberculosis medication; RIPE drug",
      description: "Pyrazinamide is the RIPE drug that helps shorten drug-susceptible TB therapy by acting well in acidic inflammatory TB environments. Its bedside identity is prodrug activation to pyrazinoic acid plus hepatotoxicity, hyperuricemia, arthralgia/gout, and photosensitivity monitoring.",
      usedToTreat: "Active drug-susceptible tuberculosis during the intensive phase of combination therapy. It is not generally used alone and is not a routine latent TB monotherapy drug.",
      mechanism: "Pyrazinamide enters M. tuberculosis and is converted by mycobacterial pyrazinamidase (pncA product) into pyrazinoic acid. Pyrazinoic acid accumulates especially in acidic, inflamed TB lesions and disrupts survival physiology in semi-dormant bacilli, including membrane energetics and coenzyme-A/pantothenate pathway targets described in modern research. Resistance commonly involves pncA mutations that prevent activation. In humans, pyrazinamide reduces renal uric-acid excretion, explaining hyperuricemia and gout flare risk.",
      contraindications: [
        "Severe liver disease or acute severe gout unless TB specialist risk-benefit direction justifies therapy.",
        "Clarify pregnancy/lactation risk-benefit, porphyria history, significant renal impairment, and other hepatotoxic drugs."
      ],
      nursingEssentials: [
        "Monitor liver symptoms/labs, uric acid or gout symptoms, joint pain, photosensitivity, GI intolerance, adherence, and TB response.",
        "Teach sun protection and to report yellow skin/eyes, dark urine, severe fatigue, abdominal pain, nausea/vomiting, loss of appetite, severe rash, or painful swollen joints.",
        "Do not interpret joint pain automatically as injury; pyrazinamide can raise uric acid and provoke gout-like pain."
      ],
      interactions: [
        "Other hepatotoxic medications and alcohol increase liver-injury concern.",
        "May interfere with uric-acid-lowering plans or worsen gout risk; coordinate with the prescriber.",
        "TB regimens must be evaluated as a full combination because overlapping hepatotoxicity can occur with INH and rifamycins."
      ],
      keyLabs: [
        "AST/ALT, bilirubin, uric acid when clinically relevant, renal function for dosing context, and TB cultures/clinical response when ordered."
      ],
      patientEducation: [
        "RIPE memory anchor: P = painful joints and purines. Pyrazinamide can raise uric acid and trigger gout-like joint pain, so uric acid/gout symptoms and LFTs matter.",
        "Use sunscreen/protective clothing because photosensitivity can occur.",
        "Take the full TB regimen; stopping one RIPE drug without direction can undermine treatment."
      ],
      nclexTraps: [
        "Pyrazinamide is a common hepatotoxicity suspect in RIPE therapy; do not ignore jaundice or dark urine.",
        "Hyperuricemia from pyrazinamide can cause painful joints/gout symptoms.",
        "PZA helps shorten therapy; if it is omitted or resistance is present, treatment duration may change."
      ],
      tags: ["pyrazinamide", "PZA", "RIPE", "tuberculosis", "pyrazinoic acid", "pncA", "hyperuricemia", "gout", "hepatotoxicity", "photosensitivity"]
    },
    {
      name: "Ethambutol",
      generic: "Ethambutol",
      displayName: "Ethambutol",
      aliases: ["EMB", "E", "RIPE E", "Myambutol"],
      class: "First-line antimycobacterial; arabinosyl-transferase inhibitor; RIPE tuberculosis medication",
      description: "Ethambutol is the RIPE drug used early in TB therapy to protect the regimen while drug susceptibility is being clarified. Its mechanism is mycobacterial cell-wall arabinogalactan disruption, and its signature toxicity is optic neuritis with decreased visual acuity or red-green color discrimination.",
      usedToTreat: "Active tuberculosis as part of initial RIPE combination therapy, especially until susceptibility confirms the isolate is treatable without ethambutol. It is also used in selected nontuberculous mycobacterial regimens when ordered.",
      mechanism: "Ethambutol inhibits mycobacterial arabinosyl transferases, impairing arabinogalactan construction in the mycobacterial cell wall. Arabinogalactan normally links peptidoglycan to mycolic acids; disrupting it weakens the cell-wall scaffold and increases vulnerability of actively growing bacilli. Dose-related optic nerve toxicity is the clinical limitation, so vision monitoring is not optional trivia.",
      contraindications: [
        "Optic neuritis, major baseline visual impairment, or inability to report vision changes unless benefits outweigh risks and monitoring is feasible.",
        "Clarify young children who cannot reliably describe visual changes, renal impairment requiring dose adjustment, pregnancy/lactation questions, and prior ethambutol optic neuropathy."
      ],
      nursingEssentials: [
        "Assess baseline and ongoing visual acuity, red-green color discrimination, blurred vision, eye pain, visual field changes, and renal function.",
        "Teach clients to stop/notify the prescriber promptly for blurred vision, reduced sharpness, color-vision change, or eye pain.",
        "Pair ethambutol with the TB regimen, not as stand-alone therapy for active TB."
      ],
      interactions: [
        "Aluminum-containing antacids can reduce ethambutol absorption; separate administration as directed.",
        "Renal impairment increases toxicity risk because ethambutol is renally cleared.",
        "Overlapping optic-nerve disease or medications that affect vision increase monitoring importance."
      ],
      keyLabs: [
        "Baseline/periodic visual acuity and color discrimination, renal function, and TB microbiology/clinical response when ordered."
      ],
      patientEducation: [
        "RIPE memory anchor: E = eye. Ethambutol can cause optic neuritis, blurred vision, and red-green color blindness.",
        "Report any vision change immediately instead of waiting for the next appointment.",
        "Take the full combination regimen exactly as prescribed."
      ],
      nclexTraps: [
        "Ethambutol equals eye safety. Red-green color changes are a classic warning sign.",
        "A client too young or unable to report vision changes needs special caution and monitoring.",
        "Renal impairment can raise ethambutol toxicity risk."
      ],
      tags: ["ethambutol", "EMB", "RIPE", "tuberculosis", "arabinosyl transferase", "optic neuritis", "red green color blindness", "renal dosing"]
    },
    {
      name: "Antitubercular medications",
      displayName: "Antitubercular medications",
      generic: "antitubercular medications",
      aliases: ["TB drugs", "RIPE drugs", "tuberculosis medications", "first-line TB medications", "rifampin isoniazid pyrazinamide ethambutol"],
      class: "Drug class card",
      entryType: "drug-class-card",
      isDrugClassCard: true,
      classCard: true,
      nclexEssential: true,
      description: "Antitubercular medications are combination-regimen drugs used to kill or suppress Mycobacterium tuberculosis while preventing resistance. The first-line RIPE framework is rifampin, isoniazid, pyrazinamide, and ethambutol; each drug has a different mechanism and a different safety anchor.",
      usedToTreat: "Drug-susceptible active tuberculosis, latent TB infection regimens, and selected nontuberculous mycobacterial infections depending on organism, susceptibility, site, pregnancy/HIV status, and specialist/public-health guidance.",
      mechanism: "RIPE therapy attacks TB from multiple angles: rifampin blocks bacterial RNA polymerase, isoniazid blocks mycolic acid cell-wall synthesis after activation, pyrazinamide becomes pyrazinoic acid and stresses semi-dormant bacilli in acidic lesions, and ethambutol blocks arabinogalactan cell-wall construction. Multi-drug therapy matters because TB develops resistance when exposed to inadequate or partial treatment.",
      nursingEssentials: [
        "Teach full-course adherence and directly observed therapy when used; symptom improvement does not mean the organism is eradicated.",
        "Screen for liver injury across INH/rifampin/pyrazinamide, neuropathy with INH, orange secretions/interactions with rifampin, hyperuricemia/gout with pyrazinamide, and vision changes with ethambutol.",
        "Coordinate public health, isolation/infectiousness teaching, culture/susceptibility follow-up, and medication interaction review."
      ],
      nclexTraps: [
        "RIPE memory: R = red/orange fluids, I = injury to nerves/B6, P = painful joints/purines, E = eyes.",
        "Never treat active TB with one drug just because one card sounds familiar.",
        "Rifampin interactions and INH/PZA hepatotoxicity are as testable as the infection itself."
      ],
      drugExamples: ["Rifampin", "Isoniazid", "Pyrazinamide", "Ethambutol", "Rifabutin", "Rifapentine", "Streptomycin"],
      classExampleNames: ["Rifampin", "Isoniazid", "Pyrazinamide", "Ethambutol", "Rifabutin", "Rifapentine", "Streptomycin"],
      classExampleKeys: ["rifampin", "isoniazid", "pyrazinamide", "ethambutol", "rifabutin", "rifapentine", "streptomycin"],
      tags: ["RIPE", "tuberculosis", "antimycobacterial", "rifampin", "isoniazid", "pyrazinamide", "ethambutol", "DOT", "hepatotoxicity"]
    },
    {
      name: "Bethanechol",
      generic: "Bethanechol",
      displayName: "Bethanechol",
      aliases: ["bethanechol chloride", "Urecholine", "muscarinic agonist", "parasympathomimetic", "cholinergic agonist"],
      class: "Direct-acting muscarinic cholinergic agonist; parasympathomimetic urinary-retention medication",
      nclexEssential: true,
      studentFacing: true,
      hidden: false,
      confidenceTier: "Curated NCLEX medication card",
      usedToTreat: "Selected nonobstructive urinary retention, including postoperative or postpartum urinary retention and neurogenic bladder atony/overflow retention when the detrusor muscle can still respond. It is not a medication for mechanical obstruction such as severe bladder outlet obstruction.",
      mechanism: "Bethanechol directly stimulates muscarinic acetylcholine receptors, especially M3 receptors on detrusor smooth muscle. M3 activation uses Gq signaling, phospholipase C, IP3-mediated calcium release, and smooth-muscle contraction, so a bladder that is atonic but not mechanically obstructed can generate pressure to void. Because muscarinic receptors also exist in GI smooth muscle, exocrine glands, bronchi, and vagal cardiac pathways, the same mechanism explains cramping, diarrhea, salivation, bronchospasm, bradycardia, hypotension, sweating, and cholinergic toxicity.",
      boxedWarning: "No drug-specific boxed warning is listed here for Bethanechol. The high-yield warning is mechanism-based cholinergic excess: bronchospasm, bradycardia, hypotension, abdominal cramping, diarrhea, salivation, sweating, and worsening obstruction-related pain/retention.",
      contraindications: [
        "Known hypersensitivity to bethanechol.",
        "Mechanical urinary obstruction, bladder neck obstruction, or situations where detrusor contraction against obstruction could cause harm.",
        "Mechanical GI obstruction, recent GI or bladder surgery where contraction could stress a suture line, active peptic ulcer disease, peritonitis, or marked GI inflammation when ordered precautions apply.",
        "Active asthma or bronchospasm risk, significant bradycardia, hypotension, coronary artery disease/vasomotor instability, hyperthyroidism, epilepsy, or Parkinson disease require clarification before giving."
      ],
      nursingEssentials: [
        "Confirm the retention is functional/nonobstructive before giving. A bladder scan, post-void residual trend, catheter output history, and obstruction/BPH symptoms matter more than the medication schedule.",
        "Assess ability to void, lower abdominal distention/pain, urine output, blood pressure, heart rate, lung sounds/wheezing, bowel sounds, cramping, diarrhea, salivation, sweating, and dizziness.",
        "Teach that benefit is bladder emptying, not sedation or analgesia. Report severe abdominal pain, wheezing, faintness, very slow pulse, severe diarrhea, or excessive sweating/salivation."
      ],
      interactions: [
        "Anticholinergic drugs such as oxybutynin, tolterodine, benztropine, diphenhydramine, and many antipsychotics can oppose bethanechol's muscarinic effect.",
        "Cholinesterase inhibitors or other cholinergic medications can add to bradycardia, bronchospasm, cramping, diarrhea, salivation, and sweating.",
        "Beta blockers and other rate-slowing drugs can make bethanechol-related bradycardia or hypotension more clinically important."
      ],
      adverseEffects: [
        "Abdominal cramping, nausea, diarrhea, borborygmi, urinary urgency, sweating, flushing, lacrimation, and salivation",
        "Bronchospasm or increased bronchial secretions",
        "Bradycardia, hypotension, dizziness, syncope, or reflex tachycardia in vulnerable clients",
        "Cholinergic toxicity pattern with muscarinic excess"
      ],
      keyLabs: [
        "No routine serum drug level is used.",
        "Trend bladder scan/post-void residual, urine output, vital signs, hydration status, and renal function if retention or obstruction is affecting kidney function."
      ],
      requiredMonitoring: [
        "Voiding response, post-void residual when ordered, abdominal distention/pain, blood pressure, heart rate, lung sounds, bowel effects, and cholinergic-excess symptoms"
      ],
      patientEducation: [
        "Take exactly as prescribed and do not self-treat urinary retention without ruling out obstruction.",
        "Report wheezing, trouble breathing, fainting, very slow heartbeat, severe cramps, diarrhea, or heavy sweating/salivation.",
        "Avoid assuming more is better. Too much muscarinic stimulation can become dangerous."
      ],
      nclexTraps: [
        "The trap is giving bethanechol for obstruction. It contracts the detrusor; it does not open a blocked outlet.",
        "A helpful response is improved bladder emptying and falling post-void residual. Unsafe response is cholinergic excess: SLUDGE-like secretions/GI symptoms plus bronchospasm, bradycardia, or hypotension.",
        "Bethanechol is the opposite concept from bladder antimuscarinics like oxybutynin. One stimulates detrusor contraction; the other blocks detrusor spasm."
      ],
      populationRisks: [
        { type: "geriatric", label: "Older adult caution", note: "Orthostasis, falls, bradycardia, bronchospasm risk, constipation/obstruction history, and polypharmacy anticholinergic burden deserve careful review." },
        { type: "pregnancy", label: "Pregnancy/postpartum context", note: "Postpartum retention can be an indication, but pregnancy or lactation questions should be clarified with the prescriber/pharmacist." },
        { type: "pediatric", label: "Pediatric caution", note: "Use requires pediatric-specific dosing and clear confirmation that urinary retention is nonobstructive." }
      ],
      tags: ["bethanechol", "muscarinic agonist", "M3 receptor", "detrusor", "nonobstructive urinary retention", "neurogenic bladder", "cholinergic", "bronchospasm", "bradycardia"],
      sourceKeys: ["dailymed-bethanechol-label", "statpearls-bethanechol"]
    },
    {
      name: "Amiodarone",
      generic: "Amiodarone",
      displayName: "Amiodarone",
      aliases: ["Cordarone", "Pacerone", "Nexterone", "class III antiarrhythmic", "potassium channel blocker"],
      class: "Class III antiarrhythmic with class I, II, and IV electrophysiologic effects; multichannel antiarrhythmic",
      nclexEssential: true,
      studentFacing: true,
      hidden: false,
      confidenceTier: "Curated NCLEX medication card",
      usedToTreat: "Life-threatening ventricular dysrhythmias and selected atrial dysrhythmia rhythm-control situations when the risk-benefit balance justifies a high-toxicity antiarrhythmic. Acute use, chronic rhythm control, and ACLS contexts have different monitoring priorities.",
      mechanism: "Amiodarone is a multichannel antiarrhythmic. Its class III action blocks outward potassium current, especially rapid delayed rectifier repolarizing current, which prolongs phase 3 repolarization, action-potential duration, QT interval, and the effective refractory period. It also blocks fast sodium-channel conduction, has noncompetitive beta-adrenergic blocking effects, and reduces L-type calcium-channel nodal activity, so SA/AV nodal automaticity and conduction slow. Its iodine-rich structure, thyroid-hormone resemblance, high lipid solubility, tissue accumulation, hepatic CYP metabolism, P-gp effects, and very long half-life explain why benefit and toxicity can be delayed and why pulmonary, thyroid, hepatic, ocular/skin, bradycardia/QT, warfarin, digoxin, statin, and grapefruit interactions are high-yield.",
      boxedWarning: "Amiodarone carries serious toxicity warnings. Pulmonary toxicity can be fatal, hepatotoxicity can be severe, and proarrhythmia or worsened arrhythmia can occur; use requires careful rhythm, organ-toxicity, and interaction monitoring.",
      contraindications: [
        "Known hypersensitivity to amiodarone, iodine-related formulation concerns, or product components.",
        "Cardiogenic shock, severe sinus-node dysfunction, marked sinus bradycardia, or second-/third-degree AV block without a functioning pacemaker.",
        "Clarify pregnancy, lactation, uncontrolled thyroid disease, severe liver injury, baseline pulmonary disease, severe QT prolongation, major electrolyte abnormalities, and interacting antiarrhythmics before giving."
      ],
      nursingEssentials: [
        "Assess rhythm indication, baseline ECG/QT, heart rate, blood pressure, potassium, magnesium, thyroid history, liver history, pulmonary symptoms, and interacting medications before giving.",
        "Monitor for new cough, dyspnea, pleuritic discomfort, hypoxia, fever, crackles, weight loss, fatigue, jaundice, dark urine, tremor, heat/cold intolerance, visual changes, photosensitivity, bradycardia, syncope, and worsening dysrhythmia.",
        "For chronic therapy, expect ordered surveillance such as ECG, chest imaging/pulmonary assessment, thyroid tests, liver tests, and eye/skin assessment depending on the plan."
      ],
      interactions: [
        "Warfarin effect can increase; INR monitoring and dose adjustment are common.",
        "Digoxin exposure can increase through P-gp effects; toxicity monitoring and dose adjustment may be needed.",
        "Beta blockers, diltiazem, verapamil, digoxin, and other AV-node slowing drugs can compound bradycardia or heart block.",
        "Other QT-prolonging drugs and low potassium or magnesium raise torsades risk.",
        "CYP3A4/P-gp inhibitors, inducers, grapefruit products, and selected statins can change exposure or toxicity."
      ],
      adverseEffects: [
        "Pulmonary toxicity including pneumonitis or fibrosis",
        "Thyroid dysfunction: hypothyroidism or thyrotoxicosis",
        "Hepatotoxicity, elevated AST/ALT, hepatitis pattern, or liver failure",
        "Bradycardia, AV block, QT prolongation, torsades risk, hypotension especially with IV use",
        "Corneal deposits, optic neuropathy/visual changes, photosensitivity, blue-gray skin discoloration, tremor, neuropathy, nausea, constipation"
      ],
      keyLabs: [
        "ECG/QT interval, heart rate, blood pressure",
        "Potassium and magnesium",
        "TSH/free T4 as ordered",
        "AST/ALT/bilirubin as ordered",
        "INR with warfarin and digoxin level when clinically indicated"
      ],
      requiredMonitoring: [
        "Rhythm and QT trend, bradycardia/heart block, blood pressure, potassium/magnesium, pulmonary symptoms, thyroid tests, liver tests, eye/skin findings, neurologic effects, and interaction-driven drug levels"
      ],
      patientEducation: [
        "Report new cough, shortness of breath, chest discomfort, fainting, severe dizziness, palpitations, jaundice, dark urine, severe fatigue, tremor, heat/cold intolerance, vision change, or severe sun reaction promptly.",
        "Avoid grapefruit products unless the prescriber specifically approves them.",
        "Use sun protection and keep lab, ECG, pulmonary/thyroid/liver, and follow-up appointments because toxicity can appear slowly."
      ],
      nclexTraps: [
        "New cough or dyspnea on amiodarone is never brushed off as a simple cold until pulmonary toxicity is considered.",
        "Amiodarone can cause both hypothyroidism and hyperthyroidism because it contains iodine and affects thyroid pathways.",
        "The half-life is long. Holding or stopping today does not remove interaction or toxicity risk tomorrow.",
        "It is class III, but not only class III. Sodium-channel, beta-blocking, and calcium-channel effects explain bradycardia and AV-node issues."
      ],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy risk", note: "Can cause fetal harm, including thyroid and neurodevelopment concerns; use only with specialist risk-benefit direction." },
        { type: "geriatric", label: "Older adult caution", note: "Pulmonary reserve, bradycardia/falls, thyroid disease, hepatic function, and polypharmacy interactions increase risk." },
        { type: "pediatric", label: "Pediatric specialist use", note: "Pediatric dysrhythmia use requires specialist dosing and monitoring." }
      ],
      tags: ["amiodarone", "class III antiarrhythmic", "potassium channel blocker", "sodium channel", "beta blocker effect", "calcium channel effect", "QT", "pulmonary toxicity", "thyroid", "CYP3A4", "P-gp", "warfarin", "digoxin"],
      sourceKeys: ["dailymed-amiodarone-label", "fda-amiodarone-label", "statpearls-amiodarone"]
    },
    {
      name: "Tacrolimus",
      generic: "Tacrolimus",
      displayName: "Tacrolimus",
      aliases: ["Prograf", "Envarsus XR", "Astagraf XL", "FK-506", "calcineurin inhibitor"],
      class: "Calcineurin inhibitor immunosuppressant; transplant anti-rejection medication",
      nclexEssential: true,
      studentFacing: true,
      hidden: false,
      confidenceTier: "Curated NCLEX medication card",
      usedToTreat: "Prevents rejection after kidney, liver, or heart transplant and may be used as part of a transplant-team plan for rejection treatment. Topical tacrolimus products are separate dermatology formulations with product-specific teaching.",
      mechanism: "Binds FKBP-12 and inhibits calcineurin signaling, which reduces interleukin-2 transcription and T-cell activation. The nursing link is less rejection risk versus infection, malignancy, kidney, neurologic, glucose, potassium, and blood-pressure toxicity.",
      boxedWarning: "Boxed warning: tacrolimus and other immunosuppressants increase the risk of serious infections and malignancies, including lymphoma and skin cancers; severe outcomes can include hospitalization or death.",
      contraindications: [
        "Hypersensitivity to tacrolimus; IV formulation also requires caution for polyoxyl 60 hydrogenated castor oil hypersensitivity.",
        "Do not interchange immediate-release and extended-release tacrolimus products without transplant-team direction because underexposure can cause rejection and overexposure can cause serious toxicity.",
        "Avoid live vaccines during significant immunosuppression unless the transplant or infectious-disease team specifically directs otherwise."
      ],
      nursingEssentials: [
        "Check trough timing and result, transplant organ function, creatinine/eGFR, potassium, magnesium, glucose, blood pressure, neurologic status, infection signs, and current interacting medications before giving.",
        "Do not casually hold or substitute tacrolimus. If infection, renal injury, toxicity, vomiting/diarrhea, or inability to take oral medication is present, contact the transplant team promptly.",
        "Use consistent administration timing and food pattern. Grapefruit and grapefruit juice can raise tacrolimus exposure."
      ],
      interactions: [
        "CYP3A inhibitors such as azole antifungals, macrolides, protease inhibitors, diltiazem/verapamil, grapefruit, and cannabidiol can raise tacrolimus levels.",
        "CYP3A inducers such as rifampin, carbamazepine, phenytoin, phenobarbital, and St. John's wort can lower tacrolimus levels and increase rejection risk.",
        "Nephrotoxic drugs such as NSAIDs, aminoglycosides, amphotericin B, vancomycin, IV contrast, or cyclosporine can increase kidney injury risk.",
        "ACE inhibitors, ARBs, potassium supplements, trimethoprim, and potassium-sparing diuretics can worsen hyperkalemia risk."
      ],
      adverseEffects: [
        "Serious infection and malignancy risk",
        "Nephrotoxicity with rising creatinine or reduced urine output",
        "Neurotoxicity such as tremor, headache, confusion, seizure, or posterior reversible encephalopathy syndrome",
        "Hyperkalemia, hypomagnesemia, hypertension, QT prolongation, hyperglycemia or new-onset diabetes after transplant",
        "Thrombotic microangiopathy, including HUS/TTP patterns, and rare pure red cell aplasia"
      ],
      keyLabs: [
        "Tacrolimus trough level drawn at the ordered timing",
        "Creatinine/eGFR/BUN and urine output",
        "Potassium, magnesium, glucose/A1c when relevant",
        "CBC, liver enzymes, lipids, and infection markers as ordered"
      ],
      requiredMonitoring: [
        "Trough level, renal function, electrolytes, glucose, blood pressure, neurologic assessment, infection signs, malignancy/skin surveillance, and transplant organ function trends"
      ],
      patientEducation: [
        "Take exactly as prescribed at the same times each day and keep the same food pattern unless the transplant team changes the plan.",
        "Do not switch brands, formulations, doses, or schedules without transplant-team direction.",
        "Avoid grapefruit products and St. John's wort; check before starting new prescriptions, over-the-counter drugs, or supplements.",
        "Report fever, sore throat, infection symptoms, tremor, seizure, confusion, decreased urine, swelling, severe diarrhea/vomiting, unusual skin lesions, or high-glucose symptoms promptly.",
        "Use sun protection and keep lab/trough appointments."
      ],
      nclexTraps: [
        "Tacrolimus is not interchangeable across formulations. Wrong product or timing can mean rejection or toxicity.",
        "A rising creatinine after transplant could be rejection, tacrolimus nephrotoxicity, dehydration, obstruction, or infection; escalate instead of guessing.",
        "Fever on tacrolimus is high priority even when the client looks only mildly ill because immunosuppression can blunt infection signs.",
        "Low tacrolimus levels can be just as dangerous as high levels because underexposure can trigger graft rejection."
      ],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy risk", note: "Tacrolimus can cause fetal harm; transplant and obstetric specialists balance rejection prevention with fetal risk." },
        { type: "geriatric", label: "Older adult caution", note: "Renal reserve, infection risk, malignancy risk, hypertension, diabetes, and polypharmacy interactions deserve close monitoring." },
        { type: "pediatric", label: "Pediatric transplant dosing", note: "Children often need transplant-specialist dosing and trough monitoring; never extrapolate adult schedules casually." }
      ],
      tags: ["immunosuppressant", "calcineurin inhibitor", "transplant", "boxed warning", "infection", "malignancy", "nephrotoxicity", "hyperkalemia", "trough level"],
      sourceKeys: ["dailymed-tacrolimus-label-2025"]
    },
    {
      name: "Atovaquone",
      generic: "Atovaquone",
      displayName: "Atovaquone",
      aliases: ["Mepron", "atovaquone oral suspension", "PCP prophylaxis", "Pneumocystis jirovecii pneumonia medication"],
      class: "Antiprotozoal anti-infective; Pneumocystis jirovecii pneumonia treatment/prophylaxis option",
      nclexEssential: true,
      studentFacing: true,
      hidden: false,
      confidenceTier: "Curated NCLEX medication card",
      usedToTreat: "Used to treat mild-to-moderate Pneumocystis jirovecii pneumonia in adolescents and adults and to prevent PCP when first-line prophylaxis is not tolerated or appropriate. It may also be used with other medications for selected protozoal infections such as babesiosis under specialist guidance.",
      mechanism: "Atovaquone inhibits protozoal mitochondrial electron transport, impairing energy production and nucleic-acid synthesis in susceptible organisms. The practical nursing link is that adequate absorption and adherence are essential because underexposure can lead to treatment failure.",
      boxedWarning: "No boxed warning is listed in the patient medication monograph. Serious hypersensitivity reactions can still occur and infection worsening requires urgent reassessment.",
      contraindications: [
        "Hypersensitivity to atovaquone or product ingredients.",
        "Use caution and provider review with significant liver disease, severe vomiting/diarrhea, malabsorption, or inability to take with food because exposure may be inadequate.",
        "Pregnancy or breastfeeding requires prescriber risk-benefit review, especially when treating or preventing serious opportunistic infection."
      ],
      nursingEssentials: [
        "Give oral suspension with food or a meal as directed; food improves absorption and missed/poorly absorbed doses can reduce protection or treatment success.",
        "Shake suspension gently before measuring. Use an oral measuring device, not a household spoon.",
        "Assess respiratory status, fever, oxygenation, cough, HIV/immunocompromised status, GI tolerance, rash, and adherence throughout therapy."
      ],
      interactions: [
        "Rifampin and rifabutin can reduce atovaquone exposure and may make therapy less effective.",
        "Tetracycline and some GI-motility or absorption problems may reduce levels; verify with pharmacy when starting interacting antibiotics or when vomiting/diarrhea is present.",
        "Report all antiretrovirals, antibiotics, anticonvulsants, supplements, and OTC products so the prescriber/pharmacist can screen for interactions."
      ],
      adverseEffects: [
        "Nausea, vomiting, diarrhea, abdominal discomfort, headache, dizziness, anxiety, and insomnia",
        "Rash or urticaria; swelling of face/lips/tongue/throat, hoarseness, dyspnea, or trouble swallowing can signal serious allergy",
        "Fever or worsening respiratory symptoms can mean progression of infection or another pulmonary process",
        "Liver enzyme abnormalities are possible, especially in clients with liver disease or complex anti-infective regimens"
      ],
      keyLabs: [
        "Baseline and follow-up oxygenation/ABG only if clinically indicated by severity",
        "Liver enzymes when ordered or liver disease is present",
        "CBC/CMP and renal function based on immunocompromised status and concurrent therapies",
        "Diagnostic confirmation and pathogen testing as ordered for PCP or alternative infections"
      ],
      requiredMonitoring: [
        "Respiratory status, oxygen saturation, fever curve, cough/work of breathing, GI tolerance, rash/allergy signs, medication adherence, ability to take with food, and response over the prescribed course"
      ],
      patientEducation: [
        "Take exactly as prescribed and finish the full course; do not stop early because symptoms improve.",
        "Take each dose with food or a meal unless the prescriber gives different instructions.",
        "Shake liquid and measure with the provided device.",
        "Call promptly for rash, hives, facial/tongue/throat swelling, trouble breathing or swallowing, severe vomiting/diarrhea, blue-gray lips/skin, worsening shortness of breath, persistent fever, or missed doses."
      ],
      nclexTraps: [
        "Atovaquone absorption is food-dependent; a client who cannot eat or is vomiting may not be getting enough medication.",
        "Worsening dyspnea on PCP therapy is not routine teaching; reassess oxygenation and escalate.",
        "Do not confuse single-agent atovaquone for PCP with the atovaquone/proguanil malaria combination.",
        "Rifampin or rifabutin can undermine atovaquone effectiveness."
      ],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy risk-benefit review", note: "Use during pregnancy requires prescriber assessment of infection risk versus medication uncertainty." },
        { type: "pediatric", label: "Age/weight-specific dosing", note: "Do not extrapolate adult PCP regimens to children without pediatric infectious-disease or prescribing guidance." },
        { type: "geriatric", label: "Older adult caution", note: "Assess nutrition, swallowing, liver disease, polypharmacy, and pulmonary reserve." }
      ],
      tags: ["atovaquone", "Mepron", "antiprotozoal", "Pneumocystis jirovecii pneumonia", "PCP", "HIV", "immunocompromised", "with food", "rifampin interaction"],
      sourceKeys: ["medlineplus-atovaquone"]
    }
  ];

  const labUpdates = [
    {
      name: "Uric acid",
      category: "Renal / metabolic labs",
      aliases: ["serum urate", "urate"],
      range: "Adult female about 2.4-6.0 mg/dL. Adult male about 3.4-7.0 mg/dL. Facility ranges vary.",
      why: "Purine metabolism and renal-excretion marker. High uric acid supports gout, uric-acid stones, tumor lysis risk, renal impairment, dehydration, or diuretic effect.",
      highCauses: ["Gout flare or chronic hyperuricemia", "Chronic kidney disease or acute kidney injury", "Tumor lysis syndrome", "Dehydration", "Loop or thiazide diuretics", "High cell turnover"],
      lowCauses: ["Less commonly clinically urgent", "Possible liver disease, SIADH, or medication effect depending context"],
      criticalConcerns: ["Severe joint pain with red hot swollen joint suggests gout but infection must be ruled out.", "Cancer treatment plus high uric acid can point toward tumor lysis syndrome."],
      nursingConsiderations: ["Trend kidney function and urine output.", "Assess pain, joint redness, fever, and medication history.", "Encourage ordered hydration unless contraindicated."],
      nclexTraps: ["Do not treat a swollen painful joint as gout automatically when fever, wound, or immunosuppression suggests septic arthritis.", "Allopurinol is chronic urate-lowering therapy; acute flare management usually uses NSAIDs, colchicine, or corticosteroids as ordered."]
    },
    {
      name: "Lactate",
      category: "Perfusion / sepsis labs",
      aliases: ["lactic acid"],
      range: "Often about 0.5-2.2 mmol/L. Lactate >=2 mmol/L is abnormal in many sepsis pathways. Lactate >=4 mmol/L is a high-risk hypoperfusion/shock cue.",
      why: "Lactate rises when tissue oxygen delivery or utilization is impaired. It helps identify occult shock, sepsis severity, hypoperfusion, seizures, severe hypoxia, or metformin-associated lactic acidosis risk.",
      highCauses: ["Sepsis or septic shock", "Hypovolemic, cardiogenic, or obstructive shock", "Severe hypoxia", "Seizure activity", "Severe anemia", "Metformin-associated lactic acidosis in renal failure or hypoxia"],
      lowCauses: ["Low lactate is usually not the safety problem."],
      criticalConcerns: ["Rising lactate means perfusion is worsening until proven otherwise.", "Normal blood pressure does not rule out occult hypoperfusion."],
      nursingConsiderations: ["Trend lactate after fluids/antibiotics/oxygenation interventions per protocol.", "Assess perfusion: mental status, urine output, skin, pulses, capillary refill, MAP, and respiratory status."],
      nclexTraps: ["Do not wait for hypotension if lactate is climbing and the client looks septic.", "A falling lactate supports improving perfusion, but the whole patient still matters."]
    },
    {
      name: "Beta-hCG",
      category: "Pregnancy / tumor marker labs",
      aliases: ["beta hCG", "hCG", "human chorionic gonadotropin", "quantitative hCG", "qualitative hCG", "pregnancy test"],
      range: "Nonpregnant is generally negative or very low. Pregnancy interpretation is gestational-age and assay dependent. Quantitative serum results are reported in mIU/mL and should be trended with symptoms and ultrasound when ectopic pregnancy or pregnancy viability is a concern.",
      why: "Beta-hCG is the pregnancy hormone measured in urine or blood. Qualitative tests answer whether hCG is detected. Quantitative serum tests measure the amount and help evaluate early pregnancy, ectopic pregnancy, miscarriage risk, molar pregnancy, selected prenatal screening questions, and some germ-cell or trophoblastic tumors.",
      highCauses: ["Pregnancy", "Multiple gestation", "Molar pregnancy or gestational trophoblastic disease", "Some ovarian/testicular or germ-cell tumors", "Recent pregnancy loss or delivery"],
      lowCauses: ["Very early pregnancy before detectable rise", "Dilute urine sample causing false-negative urine test", "Pregnancy loss or nonviable pregnancy pattern when serial values fall or fail to rise appropriately", "Ectopic pregnancy can have an abnormal serial rise"],
      criticalConcerns: ["Positive hCG with unilateral pelvic pain, shoulder pain, syncope, hypotension, or vaginal bleeding is ectopic pregnancy until proven otherwise.", "Do not rule out pregnancy from one early negative urine test when symptoms/timing still fit; repeat or obtain serum testing as ordered."],
      nursingConsiderations: ["Ask date of last menstrual period, pregnancy symptoms, fertility medication use, bleeding, pain, and ectopic risk factors.", "For possible ectopic pregnancy, trend quantitative hCG with transvaginal ultrasound and clinical assessment.", "Avoid excess fluid intake before urine testing because dilution can reduce detectability."],
      nclexTraps: ["A blood hCG can detect smaller amounts than urine testing, but one number does not prove pregnancy location or viability.", "Fertility medications containing hCG can cause false-positive results.", "In early pregnancy emergencies, hCG trend plus symptoms and ultrasound matter more than a single value."],
      sourceKeys: ["medlineplus-pregnancy-test"]
    },
    {
      name: "Parathyroid hormone",
      category: "Endocrine / calcium-phosphate labs",
      aliases: ["PTH", "intact PTH", "parathormone", "parathyroid hormone test"],
      range: "Common intact PTH adult reference ranges are often roughly 10-65 pg/mL, but assay and lab ranges vary. Interpret PTH with calcium, phosphorus/phosphate, vitamin D, magnesium, kidney function, and symptoms.",
      why: "PTH is made by the parathyroid glands and helps regulate blood calcium and phosphate. The test helps evaluate abnormal calcium levels, parathyroid disorders, chronic kidney disease mineral-bone disease, severe osteoporosis workups, and response after parathyroid surgery.",
      highCauses: ["Primary hyperparathyroidism with high calcium", "Secondary hyperparathyroidism from chronic kidney disease", "Vitamin D deficiency or low calcium stimulus", "Low magnesium/phosphate-related mineral disorders depending context", "Parathyroid hyperplasia or adenoma"],
      lowCauses: ["Hypoparathyroidism after neck surgery or radiation", "Autoimmune or genetic parathyroid dysfunction", "Suppression from high calcium or excess vitamin D/calcium intake", "Severe illness or magnesium disturbance depending context"],
      criticalConcerns: ["Low calcium symptoms such as tetany, seizures, laryngospasm, or dysrhythmia are urgent.", "High calcium with confusion, dehydration, kidney stones, severe weakness, or arrhythmia requires prompt evaluation.", "Never interpret PTH alone; the calcium-PTH pairing is the key clinical clue."],
      nursingConsiderations: ["Review calcium, ionized calcium, phosphorus, magnesium, vitamin D, creatinine/eGFR, medications, supplements, neck surgery history, kidney disease, stones, bone pain, cramps, tingling, seizures, and mental-status changes.", "For post-thyroid/parathyroid surgery clients, monitor for hypocalcemia symptoms and airway/neuromuscular changes.", "Clarify fasting or time-of-day instructions if the lab requires them."],
      nclexTraps: ["High PTH plus high calcium points toward primary hyperparathyroidism; high PTH plus low/normal calcium often points toward secondary causes such as kidney disease or vitamin D deficiency.", "PTH controls calcium and phosphate, so abnormal results need mineral labs together, not a memorized single number."],
      sourceKeys: ["medlineplus-pth-test"]
    },
    {
      name: "Triglycerides",
      category: "Lipid / metabolic labs",
      aliases: ["triglyceride level", "TG", "TRIG", "fasting triglycerides", "lipid panel triglycerides"],
      range: "Adult guideline categories commonly use healthy <150 mg/dL, borderline high 150-199 mg/dL, high 200-499 mg/dL, and very high >=500 mg/dL. Pediatric targets and fasting requirements differ by age and clinical context.",
      why: "Triglycerides are blood fats measured alone or as part of a lipid profile. Elevated levels help assess cardiovascular, stroke, metabolic-syndrome, diabetes, thyroid, kidney/liver, alcohol, medication, familial lipid, and pancreatitis risk.",
      highCauses: ["High sugar/refined carbohydrate or high-fat intake", "Poorly controlled diabetes or insulin resistance", "Obesity or metabolic syndrome", "Alcohol use disorder", "Hypothyroidism", "Kidney or liver disease", "Inherited lipid disorders", "Certain medications such as some diuretics, breast cancer therapies, or HIV therapies"],
      lowCauses: ["Low values are uncommon and usually less urgent; consider malnutrition, malabsorption, hyperthyroidism, or chronic illness depending context"],
      criticalConcerns: ["Very high triglycerides, especially >=500 mg/dL, increase acute pancreatitis risk.", "Abdominal pain, vomiting, and very high triglycerides should raise pancreatitis concern.", "Triglycerides must be interpreted with the full lipid panel and overall ASCVD risk, not in isolation."],
      nursingConsiderations: ["Confirm whether the sample required fasting and whether the client followed instructions.", "Assess diabetes control, alcohol use, diet, weight changes, thyroid disease, kidney/liver disease, pregnancy status, family history, pancreatitis history, and medication causes.", "Teach heart-healthy diet, limiting added sugar/refined carbohydrates and alcohol, activity, smoking cessation, and prescribed lipid therapy adherence."],
      nclexTraps: ["Triglycerides are not just a heart-risk number; very high results can become a pancreatitis priority.", "A nonfasting or recently high-fat/high-sugar meal may affect interpretation, so check collection instructions before overreacting."],
      sourceKeys: ["medlineplus-triglycerides-test"]
    },
    {
      name: "Homocysteine",
      category: "Vitamin / cardiovascular risk labs",
      aliases: ["total homocysteine", "plasma total homocysteine", "homocysteine level"],
      range: "Often about 5-15 micromol/L in adults, but reference ranges vary by lab. Interpret with vitamin B12, folate, vitamin B6 status, kidney function, thyroid status, age, sex, smoking, symptoms, and reason for testing.",
      why: "Homocysteine is an amino acid normally broken down with help from vitamin B12, vitamin B6, and folate. Testing helps evaluate suspected B-vitamin deficiency, homocystinuria, and selected cardiovascular or thrombotic risk questions, but it is not a routine screening test for everyone.",
      highCauses: ["Vitamin B12 deficiency", "Folate deficiency", "Vitamin B6 deficiency", "Homocystinuria", "Chronic kidney disease", "Hypothyroidism", "Smoking", "Older age", "Some medications or supplement patterns", "Malnutrition or alcohol use disorder"],
      lowCauses: ["Low values are usually not the clinical priority."],
      criticalConcerns: ["High homocysteine can signal B-vitamin deficiency with anemia or neurologic symptoms.", "Homocystinuria can involve eye problems, weak bones, and blood clots.", "Do not promise that lowering homocysteine will prevent myocardial infarction or stroke; treatment depends on context."],
      nursingConsiderations: ["Ask about fasting instructions; some clients may need to fast 8-12 hours.", "Document vitamin B supplements, B12/folate therapy, diet, alcohol use, malabsorption risk, kidney disease, thyroid disease, smoking, neurologic symptoms, anemia symptoms, clotting history, and family or newborn-screening history.", "Pair results with CBC, vitamin B12, folate, methylmalonic acid, renal function, thyroid testing, and cardiovascular risk assessment as ordered."],
      nclexTraps: ["Homocysteine is often a B12, folate, or B6 clue, not a stand-alone diagnosis.", "A high level does not automatically mean treat-and-prevent-stroke; routine heart-risk screening is not recommended for everyone and lowering levels does not always reduce cardiovascular events."],
      sourceKeys: ["medlineplus-homocysteine-test"]
    },
    {
      name: "Ceruloplasmin",
      category: "Copper metabolism / liver labs",
      aliases: ["ceruloplasmin test", "serum ceruloplasmin", "copper-carrying protein"],
      range: "Reference ranges vary by lab and age. Interpret with serum copper, 24-hour urine copper, liver tests, neuro/psychiatric findings, and slit-lamp exam when Wilson disease is suspected.",
      why: "Ceruloplasmin is a liver-made protein that carries most copper in blood. Low levels support Wilson disease or other copper/protein disorders; high levels can rise with inflammation, estrogen states, pregnancy, or malignancy.",
      highCauses: ["Inflammation or acute-phase response", "Pregnancy or estrogen therapy", "Some malignancies", "Infection or tissue injury"],
      lowCauses: ["Wilson disease", "Menkes disease", "Severe liver disease or impaired synthesis", "Protein loss such as nephrotic syndrome", "Malnutrition or malabsorption", "Copper deficiency or excess zinc exposure"],
      criticalConcerns: ["Young client with liver disease plus tremor, dystonia, psychiatric change, hemolysis, or Kayser-Fleischer rings needs Wilson disease evaluation.", "Do not use ceruloplasmin alone to rule in or rule out Wilson disease."],
      nursingConsiderations: ["Assess liver symptoms, neurologic changes, psychiatric changes, family history, hemolysis clues, nutrition status, kidney/protein loss, and zinc/copper supplement use.", "Pair results with serum copper, 24-hour urine copper, AST/ALT/bilirubin/INR, CBC/hemolysis labs, and ophthalmology slit-lamp findings as ordered."],
      nclexTraps: ["Low ceruloplasmin is a clue, not a complete diagnosis.", "Wilson disease is a liver-neuro-psych copper disorder; do not treat it like ordinary hepatitis only."],
      sourceKeys: ["medlineplus-ceruloplasmin-test"]
    },
    {
      name: "HLA-B27",
      category: "Immunology / rheumatology labs",
      aliases: ["HLA B27", "HLA-B27 antigen", "human leukocyte antigen B27"],
      range: "Reported as positive or negative, not as a numeric normal range.",
      why: "HLA-B27 testing detects a genetic immune marker associated with ankylosing spondylitis and other spondyloarthritis patterns. It supports diagnosis only when symptoms, exam, inflammatory markers, and imaging fit.",
      highCauses: ["Positive HLA-B27 can be seen in ankylosing spondylitis", "Reactive arthritis", "Psoriatic arthritis", "IBD-associated arthritis", "Acute anterior uveitis association", "Some healthy people also test positive"],
      lowCauses: ["Negative HLA-B27 makes some spondyloarthritis patterns less likely but does not fully exclude them."],
      criticalConcerns: ["Eye pain, photophobia, red eye, or vision change in a spondyloarthritis client can be acute uveitis and needs urgent evaluation.", "Progressive inflammatory back pain, neurologic deficits, fever, or infection symptoms need escalation beyond a lab result."],
      nursingConsiderations: ["Ask about inflammatory back pain, morning stiffness improving with movement, alternating buttock pain, enthesitis, dactylitis, psoriasis, IBD symptoms, recent GI/GU infection, uveitis, family history, and NSAID/biologic use.", "Interpret with ESR/CRP, sacroiliac imaging, exam findings, and rheumatology plan."],
      nclexTraps: ["A positive HLA-B27 is not a diagnosis by itself; many positive people never develop disease.", "Do not miss uveitis red flags in spondyloarthritis patterns."],
      sourceKeys: ["medlineplus-hla-b27-test"]
    },
    {
      name: "Anti-CCP antibody",
      category: "Autoimmune / rheumatology labs",
      aliases: ["CCP antibody", "cyclic citrullinated peptide antibody", "anti-cyclic citrullinated peptide", "ACPA", "anti citrullinated peptide antibody"],
      range: "Reported as negative, weak/low positive, or positive by the performing lab. Numeric cutoffs vary by assay, so interpret with that lab's reference range.",
      why: "Anti-CCP detects autoantibodies associated with rheumatoid arthritis. It is more RA-specific than rheumatoid factor in many contexts, but diagnosis still requires symptoms, exam, inflammatory markers, imaging, and exclusion of mimics.",
      highCauses: ["Rheumatoid arthritis, including early or future-risk RA patterns", "Can rarely appear with other autoimmune disease", "Can rarely be seen with chronic lung disease or active tuberculosis depending context"],
      lowCauses: ["Negative anti-CCP makes classic seropositive RA less likely but does not exclude seronegative RA or another inflammatory arthritis."],
      criticalConcerns: ["New hot swollen joint with fever or immunosuppression is septic arthritis until proven otherwise, even if anti-CCP is positive.", "Progressive joint swelling, functional loss, nodules, lung symptoms, eye symptoms, or medication toxicity needs provider/rheumatology follow-up."],
      nursingConsiderations: ["Assess symmetric small-joint pain/swelling, morning stiffness, fatigue, fever, rheumatoid factor, ESR/CRP, CBC, liver/kidney tests before DMARDs, pregnancy plans, infection risk, and current NSAID/steroid/DMARD/biologic use.", "Teach that lab positivity supports the workup but does not replace joint exam or imaging."],
      nclexTraps: ["Positive anti-CCP is not permission to ignore septic arthritis, gout, lupus, viral arthritis, or trauma.", "Negative anti-CCP does not rule out all rheumatoid arthritis; seronegative disease exists."],
      sourceKeys: ["medlineplus-ccp-antibody-test"]
    },
    {
      name: "Serum protein electrophoresis",
      category: "Hematology / protein studies",
      aliases: ["SPEP", "protein electrophoresis", "serum electrophoresis", "M-spike test", "monoclonal protein screen"],
      range: "Pattern-based test. Labs report albumin and globulin fractions and whether a monoclonal band or M-spike is present. Numeric fraction ranges vary by lab.",
      why: "SPEP separates serum proteins by charge/size pattern. It helps evaluate monoclonal gammopathy, multiple myeloma, MGUS, Waldenstrom macroglobulinemia, chronic inflammation, immune deficiency, liver disease, kidney protein loss, and unexplained high total protein.",
      highCauses: ["Monoclonal spike from plasma-cell or lymphoplasmacytic disorders", "Polyclonal gamma elevation from chronic inflammation, infection, autoimmune disease, or liver disease", "Alpha fraction elevations with acute inflammation", "Relative albumin changes from dehydration or protein loss context"],
      lowCauses: ["Low albumin from malnutrition, liver disease, nephrotic syndrome, protein-losing enteropathy, or inflammation", "Low gamma globulins from immunodeficiency, protein loss, or immunosuppressive therapy"],
      criticalConcerns: ["Bone pain, anemia, renal injury, hypercalcemia, recurrent infection, weight loss, neuropathy, or M-spike needs prompt provider/hematology follow-up.", "SPEP alone may miss light-chain disease; urine studies, immunofixation, and serum free light chains may be needed."],
      nursingConsiderations: ["Assess fatigue, bone/back pain, fractures, infection history, neuropathy, renal symptoms, edema, bleeding/bruising, hypercalcemia symptoms, total protein/albumin gap, CBC, calcium, creatinine, urine protein, and hydration.", "Prepare clients for possible follow-up testing such as immunofixation, serum free light chains, UPEP, imaging, or bone marrow biopsy."],
      nclexTraps: ["An M-spike is not automatically multiple myeloma, but it is never ignored.", "Normal total protein does not fully exclude monoclonal disease when symptoms or light-chain clues are present."],
      sourceKeys: ["clevelandclinic-protein-electrophoresis"]
    },
    {
      name: "Lipoprotein(a)",
      category: "Cardiovascular / lipid risk labs",
      aliases: ["Lp(a)", "Lp a", "lipoprotein a blood test", "apolipoprotein(a) lipoprotein"],
      range: "Units and cutoffs vary. Many references consider roughly <30 mg/dL or <75 nmol/L lower risk and >=50 mg/dL or >=125 nmol/L higher risk, but use the lab's units and cardiology guidance.",
      why: "Lipoprotein(a) is a genetically influenced LDL-like particle that can increase atherosclerotic cardiovascular disease and aortic stenosis risk. It is not included in a standard lipid panel and is often measured once to clarify inherited risk.",
      highCauses: ["Inherited elevated Lp(a)", "Family history of premature ASCVD", "Premature myocardial infarction, stroke, peripheral artery disease, or aortic stenosis", "Risk can remain despite normal LDL-C"],
      lowCauses: ["Low Lp(a) is usually not a safety concern and generally indicates less Lp(a)-related inherited risk."],
      criticalConcerns: ["Chest pain, stroke symptoms, limb ischemia, syncope with aortic stenosis symptoms, or known premature ASCVD needs urgent care independent of the Lp(a) number.", "High Lp(a) should trigger aggressive management of modifiable risk factors rather than false reassurance from a normal basic lipid panel."],
      nursingConsiderations: ["Assess personal/family premature heart disease, stroke, PAD, aortic stenosis, LDL-C/non-HDL-C, ApoB if ordered, diabetes, BP, smoking, kidney disease, pregnancy history, and statin/PCSK9/aspirin or cardiology plan.", "Teach that lifestyle may not substantially lower inherited Lp(a), but risk reduction still depends on LDL lowering, BP control, diabetes care, smoking cessation, exercise, and follow-up."],
      nclexTraps: ["Lp(a) is not the same as LDL-C and is not part of a routine lipid panel.", "A high inherited marker does not mean ignore lifestyle; it means tighten every modifiable risk factor."],
      sourceKeys: ["medlineplus-lipoprotein-a-test"]
    },
    {
      name: "Osmolar gap",
      category: "Toxicology / metabolic labs",
      aliases: ["osmolal gap", "osmol gap", "serum osmolar gap", "serum osmolal gap", "osmolarity gap", "osmolality gap"],
      range: "Calculated as measured serum osmolality minus calculated serum osmolality. Many references treat a gap around <=10 mOsm/kg as expected, but lab methods and ethanol correction vary. Interpret with anion gap, pH, bicarbonate, lactate, ketones, glucose, BUN/creatinine, sodium, ethanol, and clinical exposure history.",
      why: "The osmolar gap estimates unmeasured osmotically active solutes. It is most useful in suspected toxic alcohol or solvent exposure, especially methanol, ethylene glycol, isopropanol, propylene glycol, or ethanol patterns, and in complex high-anion-gap metabolic acidosis workups.",
      highCauses: ["Methanol ingestion", "Ethylene glycol ingestion", "Isopropyl alcohol ingestion", "Ethanol or other alcohols", "Propylene glycol exposure", "Mannitol or sorbitol", "Severe ketoacidosis, lactic acidosis, or renal failure depending context", "Hyperlipidemia or hyperproteinemia can affect measurements"],
      lowCauses: ["A normal gap can occur late after toxic alcohol metabolism and does not rule out poisoning.", "Calculation error, missing ethanol correction, or timing after exposure can make the gap falsely reassuring."],
      criticalConcerns: ["Suspected methanol or ethylene glycol exposure is an emergency even before confirmatory levels return.", "High anion gap acidosis, visual symptoms, renal injury, coma, seizure, or shock with an elevated osmolar gap needs immediate toxicology/provider escalation.", "A falling osmolar gap with worsening anion gap can mean the parent alcohol is being metabolized into toxic acids."],
      nursingConsiderations: ["Assess exact exposure, time, amount, coingestants, mental status, vision changes, respiratory pattern, urine output, calcium oxalate crystal clues, and access to antifreeze, windshield fluid, solvents, sanitizer, or IV propylene glycol sources.", "Prepare for poison control/toxicology consultation, serial electrolytes/ABGs, anion gap trending, ethanol/toxic alcohol levels if available, ECG, antidote therapy such as fomepizole when ordered, and hemodialysis readiness for severe cases.", "Verify the formula used by the facility and whether ethanol was included in the calculated osmolality."],
      nclexTraps: ["A normal osmolar gap does not exclude toxic alcohol poisoning, especially late after ingestion.", "Do not wait for a perfect lab before escalating a client with high-anion-gap acidosis plus exposure clues.", "Osmolar gap and anion gap move differently over time in toxic alcohol poisoning."],
      sourceKeys: ["toxic-alcohol-osmol-gap"]
    },
    {
      name: "Anti-Mullerian hormone",
      category: "Reproductive endocrinology labs",
      aliases: ["AMH", "anti Mullerian hormone", "antimullerian hormone", "Mullerian inhibiting substance", "MIS", "ovarian reserve test"],
      range: "Reported in ng/mL or pmol/L. Reference ranges vary by age, sex, assay, and clinical purpose. Reproductive-age ovarian reserve discussions often use age-adjusted interpretation rather than one universal normal value.",
      why: "AMH is produced by ovarian follicle cells and is used as one marker of ovarian reserve and expected response to ovarian stimulation. It can support IVF/egg-freezing planning and selected PCOS or ovarian mass evaluations, but it does not by itself predict natural fertility, egg quality, pregnancy chance, or exact menopause timing.",
      highCauses: ["Higher antral follicle count or ovarian reserve for age", "Polycystic ovary syndrome pattern", "Granulosa cell tumor monitoring in selected cases", "Assay variation or age-related interpretation issues"],
      lowCauses: ["Lower ovarian reserve for age", "Older reproductive age", "Prior ovarian surgery, chemotherapy, radiation, endometriosis, autoimmune or genetic ovarian insufficiency patterns", "Hormonal contraception or smoking may lower values in some contexts"],
      criticalConcerns: ["AMH should not be used alone to tell a client they cannot conceive.", "Very high AMH with irregular menses, hyperandrogen symptoms, or ovarian enlargement needs PCOS/ovarian evaluation, not reassurance.", "Fertility decisions should involve reproductive history, age, ovulation, partner factors, tubal/uterine evaluation, and specialist counseling."],
      nursingConsiderations: ["Ask menstrual history, age, pregnancy goals, infertility duration, PCOS symptoms, prior ovarian surgery, chemo/radiation, endometriosis, contraception, smoking, and family history of early menopause.", "Teach that AMH is a blood test that can usually be drawn any day of the menstrual cycle, but interpretation depends on the lab and the clinical question.", "Pair results with antral follicle count ultrasound, FSH/estradiol, ovulation history, semen analysis, tubal/uterine evaluation, and reproductive endocrinology guidance when indicated."],
      nclexTraps: ["AMH is an ovarian response/reserve clue, not a standalone fertility verdict.", "A low AMH result can be emotionally loaded; avoid fatalistic counseling and route to specialist interpretation.", "A high AMH can fit PCOS and does not automatically mean better reproductive health."],
      sourceKeys: ["clevelandclinic-amh-test"]
    },
    {
      name: "Methylmalonic acid",
      category: "Vitamin / metabolic labs",
      aliases: ["MMA", "methylmalonic acid test", "methylmalonate", "serum MMA", "urine MMA"],
      range: "Reference ranges vary by lab, specimen type, and age. Results are reported from blood or urine; interpret with that lab's range, vitamin B12 level, homocysteine, CBC/MCV, renal function, symptoms, and newborn-screen context.",
      why: "Methylmalonic acid rises when vitamin B12-dependent metabolism is impaired. It is most often used to support diagnosis of vitamin B12 deficiency and is also part of newborn evaluation for methylmalonic acidemia.",
      highCauses: ["Vitamin B12 deficiency or poor B12 absorption", "Pernicious anemia or autoimmune gastritis patterns", "Strict vegan/vegetarian intake without supplementation", "Malabsorption from celiac disease, Crohn disease, gastric or ileal surgery, or bariatric history", "Older age and chronic acid-suppressing or metformin therapy can contribute to B12 risk", "Kidney impairment can raise MMA and complicate interpretation", "Methylmalonic acidemia in infants or children"],
      lowCauses: ["Low MMA is not usually a clinical problem and generally does not indicate B12 deficiency."],
      criticalConcerns: ["Neurologic symptoms such as paresthesias, gait change, confusion, cognitive change, or weakness with suspected B12 deficiency need timely provider follow-up because deficits can become persistent.", "Infants with vomiting, dehydration, lethargy, developmental delay, metabolic acidosis, or abnormal newborn screen need urgent metabolic evaluation.", "Do not interpret MMA without renal function because kidney impairment can elevate results."],
      nursingConsiderations: ["Assess fatigue, pallor, glossitis, neuropathy symptoms, gait, mood/cognition, diet, alcohol use, GI disease/surgery, metformin or acid-suppressing therapy, pregnancy/lactation, and prior B12 replacement.", "Pair MMA with CBC, MCV, reticulocyte response, vitamin B12, folate, homocysteine, intrinsic factor/parietal cell antibody testing when ordered, and creatinine/eGFR.", "Teach that MMA is a clue to B12-related metabolism, not a stand-alone diagnosis; treatment route and dose depend on severity and absorption risk."],
      nclexTraps: ["A normal hemoglobin does not exclude early B12 deficiency when neurologic symptoms are present.", "High MMA plus high homocysteine points toward B12 deficiency; folate deficiency raises homocysteine but usually not MMA.", "Replacing folate alone can improve anemia while neurologic B12 injury continues."],
      sourceKeys: ["medlineplus-methylmalonic-acid-test"]
    },
    {
      name: "Anti-Smith antibody",
      category: "Autoimmune / rheumatology labs",
      aliases: ["anti-Sm", "Smith antibody", "anti Sm antibody", "Sm antibody", "ENA anti-Sm", "extractable nuclear antigen anti-Sm"],
      range: "Usually reported as negative or positive, sometimes with an assay-specific numeric value. Interpret with the performing lab's cutoff, ANA, anti-dsDNA, complements, CBC, urinalysis/proteinuria, kidney function, and clinical lupus features.",
      why: "Anti-Smith is an extractable nuclear antigen autoantibody. A positive result is highly specific for systemic lupus erythematosus, but sensitivity is low, so a negative result does not rule out lupus.",
      highCauses: ["Systemic lupus erythematosus when symptoms and other testing fit", "May appear with overlapping autoimmune patterns but is classically used as a lupus-specific marker", "Assay or lab variability can affect borderline results"],
      lowCauses: ["Negative anti-Smith does not exclude lupus, especially if ANA, anti-dsDNA, complements, kidney findings, rash, arthritis, serositis, cytopenias, or neurologic features suggest SLE."],
      criticalConcerns: ["Proteinuria, hematuria, rising creatinine, edema, hypertension, or active urinary sediment in a lupus workup suggests possible lupus nephritis and needs prompt escalation.", "Chest pain, dyspnea, neurologic deficits, seizure, severe headache, severe cytopenias, fever on immunosuppression, or pregnancy complications require urgent evaluation independent of antibody status."],
      nursingConsiderations: ["Assess malar/photosensitive rash, oral ulcers, inflammatory joint pain, serositis symptoms, fatigue/fever, Raynaud symptoms, neurologic changes, pregnancy status, renal symptoms, medication history, infection risk, and family autoimmune history.", "Pair results with ANA pattern/titer, ENA panel, anti-dsDNA, C3/C4, ESR/CRP, CBC, CMP/creatinine, urinalysis, urine protein-to-creatinine ratio, and rheumatology assessment.", "Teach that autoantibodies support diagnosis only when the clinical picture fits; they are not home-screening tests and should not be used to self-diagnose."],
      nclexTraps: ["Anti-Smith is specific but not sensitive: positive strongly supports lupus, negative does not rule it out.", "Do not confuse anti-Smith with anti-smooth-muscle antibody, which belongs to a different autoimmune liver workup.", "A lupus flare question often hinges on kidneys, CNS, blood counts, serositis, or infection risk rather than the antibody name alone."],
      sourceKeys: ["testingcom-ena-panel", "niams-lupus"]
    },
    {
      name: "Transferrin saturation",
      category: "Iron studies / hematology labs",
      aliases: ["TSAT", "transferrin saturation percentage", "percent transferrin saturation", "iron saturation", "Fe saturation", "serum iron saturation"],
      range: "Often roughly 20-50% in adults, but reference ranges vary by lab, sex, age, pregnancy status, inflammation, and assay. Calculate as serum iron divided by TIBC times 100 when both are reported; use the lab's range and clinical context.",
      why: "Transferrin saturation estimates how much of the iron-binding capacity is occupied by iron. It helps interpret iron deficiency, iron overload/hemochromatosis, inflammation-related anemia, liver disease, and response to iron therapy.",
      highCauses: ["Hereditary hemochromatosis or iron overload", "Excess iron supplementation or repeated transfusions", "Hemolysis or acute liver injury context", "Low TIBC/transferrin states can make saturation appear high", "Recent iron dose can transiently affect results"],
      lowCauses: ["Iron deficiency from blood loss, heavy menses, pregnancy demand, poor intake, malabsorption, or frequent donation", "Anemia of inflammation/chronic disease patterns", "High transferrin/TIBC states such as pregnancy or estrogen therapy can lower percent saturation"],
      criticalConcerns: ["Severe anemia symptoms, syncope, chest pain, dyspnea at rest, active GI or heavy uterine bleeding, or pregnancy with symptomatic anemia needs urgent provider evaluation.", "Very high saturation with ferritin elevation, abnormal liver enzymes, diabetes, cardiomyopathy, arthropathy, skin bronze/gray change, or family history should prompt iron-overload follow-up."],
      nursingConsiderations: ["Review timing of iron supplements, fasting instructions if ordered, inflammation/infection, pregnancy, menstrual/GI bleeding, diet, bariatric or bowel disease, transfusion history, family hemochromatosis, alcohol use, liver disease, and anemia symptoms.", "Interpret with ferritin, serum iron, TIBC/transferrin, CBC/MCV/RDW, reticulocyte count, CRP/ESR when inflammation is suspected, stool/bleeding workup, and genetic or liver testing when ordered.", "Teach clients not to start or stop iron based on one isolated saturation value; iron can harm clients with overload and under-treatment can harm clients with deficiency."],
      nclexTraps: ["Low ferritin is the strongest simple clue for iron deficiency, but transferrin saturation helps complete the pattern.", "High ferritin can reflect inflammation, liver disease, malignancy, or iron overload; look at TSAT and the whole client.", "Serum iron varies during the day and after supplements, so one isolated value can mislead."],
      sourceKeys: ["medlineplus-iron-tests", "medlineplus-tibc-test"]
    },
    {
      name: "Sodium",
      category: "Electrolytes",
      aliases: ["Na", "Na+"],
      range: "135-145 mEq/L",
      why: "Sodium reflects water balance more than salt intake alone. It is a neuro-safety lab tied to seizures, confusion, SIADH, diabetes insipidus, dehydration, and fluid shifts.",
      highCauses: ["Free-water loss", "Diabetes insipidus", "Dehydration", "Hypertonic sodium administration"],
      lowCauses: ["SIADH", "Fluid overload", "Diuretics", "Vomiting/diarrhea with replacement by free water", "Adrenal insufficiency"],
      criticalConcerns: ["Seizures, severe confusion, coma, and rapid sodium shifts are priority concerns."],
      nursingConsiderations: ["Institute seizure precautions when severe or symptomatic.", "Assess neuro status and fluid balance.", "Correct slowly unless emergent orders specify otherwise."],
      nclexTraps: ["The danger is often water imbalance and brain swelling/shrinking, not the sodium number by itself."]
    },
    {
      name: "Potassium",
      category: "Electrolytes",
      aliases: ["K", "K+"],
      range: "3.5-5.0 mEq/L",
      why: "Potassium is a cardiac-rhythm safety lab. Too high or too low can trigger life-threatening dysrhythmias.",
      highCauses: ["Kidney failure", "ACE inhibitors or ARBs", "Potassium-sparing diuretics", "Cell breakdown", "Acidosis", "Hemolyzed specimen"],
      lowCauses: ["Loop/thiazide diuretics", "Vomiting or nasogastric suction", "Diarrhea", "Insulin therapy", "Alkalosis"],
      criticalConcerns: ["ECG changes, weakness, paralysis, palpitations, and potassium above about 6.0 mEq/L are urgent."],
      nursingConsiderations: ["Place unstable hyperkalemia on cardiac monitoring.", "Verify renal function and urine output before replacement.", "Never give IV potassium push."],
      nclexTraps: ["In DKA, serum potassium can look normal or high while total-body potassium is depleted."]
    },
    {
      name: "Chloride",
      category: "Electrolytes",
      aliases: ["Cl", "Cl-"],
      range: "98-106 mEq/L",
      why: "Chloride helps interpret acid-base and fluid-balance patterns, especially metabolic alkalosis/acidosis and gastrointestinal losses.",
      highCauses: ["Dehydration", "Large normal-saline load", "Metabolic acidosis", "Renal tubular acidosis"],
      lowCauses: ["Vomiting", "Nasogastric suction", "Metabolic alkalosis", "Diuretics"],
      criticalConcerns: ["Interpret chloride with bicarbonate, sodium, and clinical fluid status."],
      nursingConsiderations: ["Assess GI losses, IV-fluid type, respiratory compensation, and kidney function."],
      nclexTraps: ["A vomiting client may have low chloride and metabolic alkalosis."]
    },
    {
      name: "Bicarbonate",
      category: "Acid-base labs",
      aliases: ["HCO3", "CO2", "serum CO2", "total CO2"],
      range: "22-28 mEq/L",
      why: "Bicarbonate is the metabolic side of acid-base balance. Low bicarbonate suggests metabolic acidosis. High bicarbonate suggests metabolic alkalosis or chronic compensation.",
      highCauses: ["Vomiting", "Nasogastric suction", "Diuretics", "Chronic respiratory acidosis compensation"],
      lowCauses: ["DKA", "Lactic acidosis", "Renal failure", "Diarrhea", "Sepsis"],
      criticalConcerns: ["Very low bicarbonate with an elevated anion gap suggests a dangerous metabolic acidosis pattern."],
      nursingConsiderations: ["Correlate with pH, PaCO2, anion gap, glucose, lactate, ketones, and renal function."],
      nclexTraps: ["Do not memorize acid-base without asking whether the problem is respiratory or metabolic first."]
    },
    {
      name: "Calcium",
      category: "Electrolytes",
      aliases: ["Ca", "Ca++", "serum calcium", "corrected calcium"],
      range: "8.5-10.5 mg/dL total calcium. Ionized calcium often about 4.5-5.6 mg/dL.",
      why: "Calcium affects neuromuscular excitability, cardiac conduction, bone health, parathyroid disorders, pancreatitis severity, and transfusion/citrate risk.",
      highCauses: ["Hyperparathyroidism", "Malignancy", "Thiazide diuretics", "Immobilization", "Vitamin D excess"],
      lowCauses: ["Hypoparathyroidism", "Low vitamin D", "Chronic kidney disease", "Acute pancreatitis", "Massive transfusion", "Hypomagnesemia"],
      criticalConcerns: ["Low calcium: tetany, laryngospasm, seizures, prolonged QT.", "High calcium: weakness, constipation, kidney stones, shortened QT, dysrhythmia risk."],
      nursingConsiderations: ["Assess Chvostek/Trousseau signs when appropriate.", "Place symptomatic or severe abnormalities on cardiac monitoring.", "Check albumin because total calcium is albumin-bound."],
      nclexTraps: ["Low calcium can cause airway-danger laryngospasm in children and adults.", "Albumin changes can make total calcium misleading."]
    },
    {
      name: "Magnesium",
      category: "Electrolytes",
      aliases: ["Mg", "Mg++"],
      range: "1.7-2.2 mg/dL. Therapeutic magnesium sulfate in obstetrics is commonly about 4-7 mEq/L depending facility protocol.",
      why: "Magnesium affects reflexes, respiratory drive, cardiac rhythm, seizure prevention in preeclampsia/eclampsia, and potassium/calcium stability.",
      highCauses: ["Magnesium sulfate therapy", "Renal failure", "Excess magnesium-containing antacids/laxatives"],
      lowCauses: ["Alcohol use disorder", "Diarrhea", "Diuretics", "Poor nutrition", "Uncontrolled diabetes"],
      criticalConcerns: ["Magnesium toxicity: loss of deep tendon reflexes, respiratory depression, hypotension, decreased urine output, cardiac arrest."],
      nursingConsiderations: ["During magnesium sulfate infusion, monitor respiratory rate, reflexes, urine output, blood pressure, and level per policy.", "Keep calcium gluconate available as antidote."],
      nclexTraps: ["Magnesium sulfate prevents seizures in preeclampsia. It is not primarily an antihypertensive."]
    },
    {
      name: "Phosphorus",
      category: "Electrolytes",
      aliases: ["phosphate", "PO4"],
      range: "2.5-4.5 mg/dL",
      why: "Phosphorus is tied to ATP/energy, bone-mineral balance, kidney disease, refeeding syndrome, and respiratory muscle strength.",
      highCauses: ["Chronic kidney disease", "Tumor lysis", "Hypoparathyroidism", "Rhabdomyolysis"],
      lowCauses: ["Refeeding syndrome", "Alcohol use disorder", "Malnutrition", "Respiratory alkalosis", "Hyperparathyroidism"],
      criticalConcerns: ["Severe hypophosphatemia can cause respiratory failure, weakness, hemolysis, and rhabdomyolysis."],
      nursingConsiderations: ["Monitor closely when feeding is restarted after malnutrition.", "Assess renal function before phosphorus replacement."],
      nclexTraps: ["Refeeding syndrome is not just glucose. Watch phosphorus, potassium, and magnesium."]
    },
    {
      name: "BUN",
      category: "Renal labs",
      aliases: ["blood urea nitrogen"],
      range: "10-20 mg/dL",
      why: "BUN reflects urea nitrogen and is influenced by renal perfusion, hydration, protein load, GI bleeding, and kidney function.",
      highCauses: ["Dehydration", "Prerenal hypoperfusion", "Kidney dysfunction", "High protein intake", "Upper GI bleed", "Catabolic states"],
      lowCauses: ["Liver dysfunction", "Low protein intake", "Overhydration", "Pregnancy can lower BUN"],
      criticalConcerns: ["BUN rising with creatinine and low urine output suggests kidney injury or poor perfusion."],
      nursingConsiderations: ["Interpret with creatinine, urine output, fluid status, GI bleeding clues, and medications."],
      nclexTraps: ["BUN alone is not kidney failure. Dehydration and GI bleed can raise it."]
    },
    {
      name: "Creatinine",
      category: "Renal labs",
      aliases: ["serum creatinine", "Cr"],
      range: "Adult female often 0.5-1.0 mg/dL. Adult male often 0.7-1.3 mg/dL. Pregnancy usually runs lower.",
      why: "Creatinine helps estimate kidney filtration and medication-clearance safety.",
      highCauses: ["Acute kidney injury", "Chronic kidney disease", "Dehydration", "Obstruction", "Nephrotoxic medication effect", "Rhabdomyolysis"],
      lowCauses: ["Low muscle mass", "Pregnancy", "Low protein/muscle states"],
      criticalConcerns: ["Rising creatinine plus low urine output is a priority kidney perfusion/injury cue."],
      nursingConsiderations: ["Question nephrotoxic or renally cleared medication dosing when creatinine rises.", "Trend with urine output and eGFR."],
      nclexTraps: ["A creatinine that looks normal in pregnancy may still be concerning because pregnancy normally lowers creatinine."]
    },
    {
      name: "eGFR",
      category: "Renal labs",
      aliases: ["GFR", "estimated glomerular filtration rate", "glomerular filtration rate"],
      range: "G1 >=90, G2 60-89, G3a 45-59, G3b 30-44, G4 15-29, G5 <15 mL/min/1.73 m2 when kidney damage is persistent.",
      why: "eGFR stages chronic kidney disease and guides medication dosing, contrast precautions, and nephrology follow-up.",
      highCauses: ["High eGFR is usually not the concern; interpret with age, pregnancy, and kidney-damage markers."],
      lowCauses: ["Chronic kidney disease", "Acute kidney injury", "Reduced renal perfusion", "Obstruction"],
      criticalConcerns: ["eGFR below 30 means advanced kidney impairment. eGFR below 15 suggests kidney failure range."],
      nursingConsiderations: ["Do not use eGFR alone; check albuminuria, urine output, creatinine trend, electrolytes, and symptoms."],
      nclexTraps: ["CKD staging requires persistence/chronicity, not one isolated low eGFR during acute illness."]
    },
    {
      name: "Urine output",
      category: "Renal / perfusion assessment",
      aliases: ["UOP", "urinary output", "hourly urine output"],
      range: "Adult minimum target often at least 0.5 mL/kg/hr. Pediatric targets are commonly at least 1 mL/kg/hr. Facility policies vary.",
      why: "Urine output is a bedside perfusion and kidney-function vital sign.",
      highCauses: ["Diabetes insipidus", "Osmotic diuresis", "Diuretic therapy", "Post-obstructive diuresis"],
      lowCauses: ["Shock", "Dehydration", "AKI", "Urinary obstruction", "Heart failure with poor perfusion"],
      criticalConcerns: ["Falling urine output with hypotension, rising creatinine, sepsis, or magnesium therapy is priority."],
      nursingConsiderations: ["Trend hourly output in unstable clients.", "Assess catheter patency before assuming kidney failure."],
      nclexTraps: ["A client can have a normal blood pressure and still have poor kidney perfusion."]
    },
    {
      name: "Urine specific gravity",
      category: "Urinalysis",
      aliases: ["specific gravity", "USG"],
      range: "About 1.005-1.030",
      why: "Specific gravity estimates urine concentration and helps assess hydration, SIADH, diabetes insipidus, and kidney concentrating ability.",
      highCauses: ["Dehydration", "SIADH", "Glycosuria/proteinuria can raise readings"],
      lowCauses: ["Diabetes insipidus", "Overhydration", "Impaired concentrating ability"],
      criticalConcerns: ["Very dilute urine with hypernatremia and high output suggests diabetes insipidus."],
      nursingConsiderations: ["Interpret with serum sodium, serum osmolality, urine osmolality, intake/output, and neuro status."],
      nclexTraps: ["Do not diagnose SIADH or DI from urine specific gravity alone."]
    },
    {
      name: "Anion gap",
      category: "Acid-base labs",
      aliases: ["AG"],
      commonMisspellings: ["anion app", "anion cap", "an iron gap"],
      range: "Often about 8-12 mEq/L without potassium, but facility calculation varies.",
      why: "An elevated anion gap flags unmeasured acids such as ketones, lactate, renal acids, toxic alcohols, or salicylates.",
      highCauses: ["DKA", "Lactic acidosis", "Renal failure/uremia", "Toxic alcohol ingestion", "Salicylate toxicity"],
      lowCauses: ["Hypoalbuminemia", "Lab variation", "Less commonly intoxications or paraproteinemia"],
      criticalConcerns: ["High anion gap plus low bicarbonate points to dangerous metabolic acidosis."],
      nursingConsiderations: ["Match the gap to glucose, ketones, lactate, renal function, medication/toxin history, and clinical perfusion."],
      nclexTraps: ["Do not miss DKA when glucose is high, bicarbonate is low, and anion gap is high."]
    },
    {
      name: "Beta-hydroxybutyrate",
      category: "Diabetes / ketone labs",
      aliases: ["BHB", "serum ketones"],
      range: "Often less than 0.6 mmol/L. Levels >=3 mmol/L strongly support significant ketoacidosis in the right context.",
      why: "Beta-hydroxybutyrate is the dominant ketone in DKA and is more specific than urine ketones for DKA trend.",
      highCauses: ["DKA", "Starvation ketosis", "Alcoholic ketoacidosis", "SGLT2-inhibitor associated euglycemic DKA"],
      lowCauses: ["Improving ketosis or no ketone-producing state."],
      criticalConcerns: ["High ketones with low bicarbonate or low pH suggests ketoacidosis even if glucose is not extremely high."],
      nursingConsiderations: ["Trend with anion gap, bicarbonate, pH, glucose, potassium, and fluid status."],
      nclexTraps: ["SGLT2 inhibitors can contribute to euglycemic DKA, so glucose may not be dramatically high."]
    },
    {
      name: "Serum osmolality",
      category: "Fluid / endocrine labs",
      aliases: ["osmolality", "serum osm"],
      range: "About 275-295 mOsm/kg",
      why: "Serum osmolality helps evaluate water balance, hyperosmolar states, SIADH, diabetes insipidus, and toxic alcohol patterns.",
      highCauses: ["HHS", "Dehydration", "Diabetes insipidus", "Hypernatremia", "Toxic alcohols"],
      lowCauses: ["SIADH", "Excess free water", "Hyponatremia"],
      criticalConcerns: ["Very high osmolality with altered mental status suggests serious dehydration/hyperosmolar emergency."],
      nursingConsiderations: ["Interpret with sodium, glucose, BUN, urine osmolality, and neuro status."],
      nclexTraps: ["In HHS, severe hyperosmolality and dehydration dominate; ketosis is minimal or absent."]
    },
    {
      name: "Glucose",
      category: "Endocrine labs",
      aliases: ["blood glucose", "serum glucose", "BG", "CBG"],
      range: "Fasting often 70-99 mg/dL. Random inpatient targets vary by protocol.",
      why: "Glucose is a safety lab for hypoglycemia, DKA, HHS, infection stress response, steroid therapy, and insulin/oral diabetes medication risk.",
      highCauses: ["Diabetes", "DKA", "HHS", "Steroids", "Stress/infection", "Tube feeding/TPN"],
      lowCauses: ["Insulin excess", "Sulfonylureas", "Poor intake", "Sepsis", "Adrenal insufficiency", "Alcohol use"],
      criticalConcerns: ["Severe hypoglycemia can cause seizure, coma, and brain injury.", "Very high glucose with dehydration or acidosis is emergency-pattern thinking."],
      nursingConsiderations: ["Treat hypoglycemia promptly per protocol.", "Check potassium before insulin infusion in DKA."],
      nclexTraps: ["Do not give insulin in DKA without knowing potassium safety."]
    },
    {
      name: "Hemoglobin",
      category: "Hematology",
      aliases: ["Hgb", "Hb"],
      range: "Adult female about 12-16 g/dL. Adult male about 13.5-17.5 g/dL. Pregnancy often lower from hemodilution.",
      why: "Hemoglobin carries oxygen. Low values can mean anemia, bleeding, hemolysis, kidney disease, nutrition deficiency, or bone-marrow failure.",
      highCauses: ["Dehydration", "Polycythemia", "Chronic hypoxia"],
      lowCauses: ["Bleeding", "Iron deficiency", "B12/folate deficiency", "Hemolysis", "CKD", "Aplastic anemia", "Pregnancy hemodilution"],
      criticalConcerns: ["Low hemoglobin with chest pain, dyspnea, hypotension, tachycardia, active bleeding, or altered mental status is priority."],
      nursingConsiderations: ["Trend with hematocrit, MCV, reticulocytes, iron studies, B12/folate, and bleeding assessment."],
      nclexTraps: ["Treat the patient and trend, not one number alone."]
    },
    {
      name: "Hematocrit",
      category: "Hematology",
      aliases: ["Hct"],
      range: "Adult female about 36-46%. Adult male about 41-53%. Pregnancy commonly lower from hemodilution.",
      why: "Hematocrit estimates red-cell proportion and helps identify anemia, dehydration, bleeding, and hemodilution.",
      highCauses: ["Dehydration", "Polycythemia", "Chronic hypoxia"],
      lowCauses: ["Bleeding", "Anemia", "Overhydration", "Pregnancy hemodilution"],
      criticalConcerns: ["Rapidly falling hematocrit after trauma, surgery, birth, or GI bleed suggests active blood loss."],
      nursingConsiderations: ["Compare with hemoglobin and vital signs.", "Assess bleeding, fluid status, and oxygenation."],
      nclexTraps: ["Low hematocrit in pregnancy can be physiologic, but symptomatic anemia or bleeding is not ignored."]
    },
    {
      name: "MCV",
      category: "Hematology",
      aliases: ["mean corpuscular volume"],
      range: "80-100 fL",
      why: "MCV sorts anemia by red-cell size: microcytic, normocytic, or macrocytic.",
      highCauses: ["Vitamin B12 deficiency", "Folate deficiency", "Alcohol use disorder", "Liver disease", "Some medications"],
      lowCauses: ["Iron deficiency", "Thalassemia", "Anemia of chronic disease can be low or normal"],
      criticalConcerns: ["Macrocytosis with neuro symptoms points toward B12 deficiency rather than folate alone."],
      nursingConsiderations: ["Link MCV to iron studies, B12, folate, reticulocyte count, and bleeding history."],
      nclexTraps: ["Folate may improve anemia in B12 deficiency but will not fix neurologic injury."]
    },
    {
      name: "Platelets",
      category: "Hematology",
      aliases: ["PLT", "platelet count", "thrombocytes"],
      range: "150,000-400,000/mm3",
      why: "Platelets are clotting-cell fragments. Low platelets increase bleeding risk. Platelets below 100,000/mm3 with pregnancy hypertension or elevated LFTs is a dangerous preeclampsia/HELLP clue.",
      highCauses: ["Inflammation", "Iron deficiency", "Postsplenectomy", "Myeloproliferative disorders"],
      lowCauses: ["ITP", "DIC", "HELLP syndrome", "Sepsis", "Heparin-induced thrombocytopenia", "Bone marrow suppression", "Massive transfusion"],
      criticalConcerns: ["Below 50,000/mm3 increases procedure/bleeding concern. Below 20,000/mm3 can create spontaneous bleeding risk."],
      nursingConsiderations: ["Use bleeding precautions when low.", "Avoid IM injections and unnecessary sticks when severely low.", "Trend with coagulation studies and clinical bleeding."],
      nclexTraps: ["Mild gestational thrombocytopenia is usually above 100,000/mm3. Platelets below 100,000/mm3 with hypertension, RUQ pain, headache, or elevated LFTs suggests severe disease."]
    },
    {
      name: "WBC",
      category: "Hematology / infection labs",
      aliases: ["white blood cell count", "white count"],
      range: "4,500-11,000/mm3",
      why: "White blood cells support infection/inflammation and bone-marrow assessment.",
      highCauses: ["Infection", "Inflammation", "Steroids", "Stress response", "Leukemia"],
      lowCauses: ["Bone marrow suppression", "Chemotherapy", "Severe infection/sepsis", "Autoimmune disease", "Viral illness"],
      criticalConcerns: ["Low WBC with fever can be a neutropenic emergency if ANC is low."],
      nursingConsiderations: ["Look at differential and ANC, not WBC alone."],
      nclexTraps: ["Older adults and immunosuppressed clients may have severe infection without a big WBC rise."]
    },
    {
      name: "ANC",
      category: "Hematology / infection labs",
      aliases: ["absolute neutrophil count"],
      range: "Often >1500/mm3 normal. 1000-1500 mild neutropenia. 500-1000 moderate. <500 severe.",
      why: "ANC estimates bacterial/fungal infection defense and neutropenic fever risk.",
      highCauses: ["Acute infection/inflammation", "Steroid effect", "Stress response"],
      lowCauses: ["Chemotherapy", "Clozapine", "Bone marrow failure", "Severe infection", "Autoimmune neutropenia"],
      criticalConcerns: ["Fever with ANC <500/mm3 is an emergency until proven otherwise."],
      nursingConsiderations: ["Institute neutropenic precautions per policy.", "Report fever immediately in neutropenia."],
      nclexTraps: ["Do not wait for obvious infection signs in severe neutropenia."]
    },
    {
      name: "Troponin",
      category: "Cardiac labs",
      aliases: ["cardiac troponin", "troponin I", "troponin T"],
      range: "Assay-specific. Any value above the lab reference limit plus ischemic symptoms/trend is concerning.",
      why: "Troponin rises with myocardial injury and is central to acute coronary syndrome evaluation.",
      highCauses: ["Myocardial infarction", "Myocarditis", "Heart failure strain", "Pulmonary embolism", "Sepsis", "Renal disease can complicate interpretation"],
      lowCauses: ["Normal/undetectable is expected when there is no myocardial injury."],
      criticalConcerns: ["Chest pain, ECG changes, hemodynamic instability, or rising troponin is priority."],
      nursingConsiderations: ["Trend serial values and ECGs.", "Assess pain, vitals, oxygenation, rhythm, and contraindications to ordered therapies."],
      nclexTraps: ["Do not dismiss a small elevation if the trend is rising and symptoms fit."]
    },
    {
      name: "BNP",
      category: "Cardiac labs",
      aliases: ["B-type natriuretic peptide", "NT-proBNP"],
      range: "BNP often <100 pg/mL argues against heart failure, but age, renal disease, obesity, and assay type affect interpretation.",
      why: "BNP supports heart-failure suspicion when ventricles are stretched by volume/pressure.",
      highCauses: ["Heart failure", "Renal disease", "Pulmonary hypertension", "Older age", "Acute coronary syndrome"],
      lowCauses: ["Obesity can lower BNP despite heart failure."],
      criticalConcerns: ["High BNP plus dyspnea, crackles, edema, hypoxia, or pulmonary edema pattern supports heart failure."],
      nursingConsiderations: ["Interpret with respiratory assessment, chest imaging, weight trend, intake/output, and renal function."],
      nclexTraps: ["BNP is supportive, not a standalone diagnosis."]
    },
    {
      name: "D-dimer",
      category: "Coagulation / clot labs",
      aliases: ["d dimer"],
      range: "Usually lab-specific. Negative D-dimer can help rule out clot in low-risk clients. Positive is nonspecific.",
      why: "D-dimer reflects fibrin breakdown and can rise with clot, infection, inflammation, pregnancy, cancer, trauma, or surgery.",
      highCauses: ["DVT/PE", "DIC", "Recent surgery/trauma", "Pregnancy", "Cancer", "Infection/inflammation"],
      lowCauses: ["A low/negative value is useful mainly in low pretest probability."],
      criticalConcerns: ["Do not use a positive D-dimer alone to diagnose pulmonary embolism."],
      nursingConsiderations: ["Escalate sudden dyspnea, pleuritic chest pain, hypoxia, tachycardia, unilateral leg swelling, or hemoptysis."],
      nclexTraps: ["D-dimer is sensitive but nonspecific."]
    },
    {
      name: "PT/INR",
      category: "Coagulation labs",
      aliases: ["prothrombin time", "INR", "international normalized ratio"],
      range: "INR about 0.8-1.2 without warfarin. Therapeutic warfarin goals often 2.0-3.0 or 2.5-3.5 for select valves.",
      why: "PT/INR monitors extrinsic clotting and warfarin effect.",
      highCauses: ["Warfarin", "Liver disease", "Vitamin K deficiency", "DIC", "Massive transfusion"],
      lowCauses: ["Lower INR means less anticoagulation effect."],
      criticalConcerns: ["High INR plus bleeding is priority. Severe bleeding may require vitamin K and PCC/FFP as ordered."],
      nursingConsiderations: ["Bleeding precautions.", "Assess diet/medication interactions.", "Verify warfarin hold parameters."],
      nclexTraps: ["Warfarin reversal is vitamin K; severe bleeding often needs faster factor replacement too."]
    },
    {
      name: "aPTT",
      category: "Coagulation labs",
      aliases: ["PTT", "activated partial thromboplastin time"],
      range: "About 25-35 seconds without anticoagulation. Therapeutic heparin ranges are facility-specific.",
      why: "aPTT monitors intrinsic clotting and unfractionated heparin effect in many protocols.",
      highCauses: ["Unfractionated heparin", "Hemophilia", "Liver disease", "DIC", "Lupus anticoagulant"],
      lowCauses: ["May suggest increased clotting tendency but context matters."],
      criticalConcerns: ["Very high aPTT with bleeding or heparin infusion requires urgent protocol action."],
      nursingConsiderations: ["Bleeding precautions.", "Monitor platelets for HIT risk during heparin therapy.", "Protamine sulfate reverses heparin."],
      nclexTraps: ["LMWH is not usually monitored with aPTT."]
    },
    {
      name: "Fibrinogen",
      category: "Coagulation labs",
      aliases: ["factor I"],
      range: "About 200-400 mg/dL",
      why: "Fibrinogen is consumed in DIC and major bleeding and rises with inflammation/pregnancy.",
      highCauses: ["Inflammation", "Pregnancy", "Acute-phase response"],
      lowCauses: ["DIC", "Massive hemorrhage", "Severe liver disease", "Consumptive coagulopathy"],
      criticalConcerns: ["Low fibrinogen with bleeding, low platelets, prolonged PT/aPTT, and high D-dimer suggests DIC."],
      nursingConsiderations: ["Monitor bleeding, clotting labs, hemodynamics, and underlying trigger."],
      nclexTraps: ["DIC causes both clotting and bleeding because clotting factors are consumed."]
    },
    {
      name: "AST",
      category: "Liver labs",
      aliases: ["aspartate aminotransferase", "SGOT"],
      range: "Often about 10-40 U/L, facility dependent.",
      why: "AST rises with liver injury but also muscle injury, hemolysis, or cardiac injury.",
      highCauses: ["Hepatitis", "Alcohol-associated liver injury", "Ischemic liver injury", "Rhabdomyolysis", "Medication toxicity"],
      lowCauses: ["Low AST is usually not the safety problem."],
      criticalConcerns: ["AST/ALT elevation with RUQ pain, jaundice, confusion, bleeding, or pregnancy hypertension is priority."],
      nursingConsiderations: ["Interpret with ALT, bilirubin, INR, albumin, symptoms, and medication exposures."],
      nclexTraps: ["AST is not liver-specific; muscle injury can raise it."]
    },
    {
      name: "ALT",
      category: "Liver labs",
      aliases: ["alanine aminotransferase", "SGPT"],
      range: "Often about 7-56 U/L, facility dependent.",
      why: "ALT is more liver-specific than AST and rises with hepatocellular injury.",
      highCauses: ["Viral hepatitis", "Medication toxicity", "Fatty liver disease", "Ischemic hepatitis", "Alcohol-associated liver injury"],
      lowCauses: ["Low ALT is usually not the safety problem."],
      criticalConcerns: ["ALT elevation plus jaundice, RUQ pain, coagulopathy, or altered mental status signals high concern."],
      nursingConsiderations: ["Check acetaminophen exposure, alcohol use, viral risk, and hepatotoxic meds."],
      nclexTraps: ["A falling ALT is not always improvement if liver failure is worsening and cells can no longer leak enzymes."]
    },
    {
      name: "ALP",
      category: "Liver / biliary labs",
      aliases: ["alkaline phosphatase"],
      range: "Often about 44-147 U/L, facility dependent.",
      why: "ALP rises with bile-duct obstruction or bone turnover.",
      highCauses: ["Biliary obstruction", "Cholestasis", "Bone disease/growth", "Pregnancy can increase placental ALP"],
      lowCauses: ["Malnutrition or rare disorders; usually less urgent."],
      criticalConcerns: ["ALP plus direct bilirubin elevation and RUQ pain suggests obstructive biliary disease."],
      nursingConsiderations: ["Interpret with bilirubin, GGT, AST/ALT, pain, fever, and imaging."],
      nclexTraps: ["ALP is not only liver; bone and pregnancy can raise it."]
    },
    {
      name: "Total bilirubin",
      category: "Liver / hemolysis labs",
      aliases: ["bilirubin"],
      range: "About 0.1-1.2 mg/dL",
      why: "Bilirubin rises with hemolysis, hepatocellular injury, or biliary obstruction and can cause jaundice.",
      highCauses: ["Hemolysis", "Hepatitis", "Cirrhosis", "Bile duct obstruction", "Neonatal jaundice"],
      lowCauses: ["Low bilirubin is usually not clinically important."],
      criticalConcerns: ["Newborn bilirubin elevation can progress to kernicterus if severe/untreated."],
      nursingConsiderations: ["Assess jaundice, sclera, stool/urine color, itching, mental status, and neonatal risk factors."],
      nclexTraps: ["Direct bilirubin suggests cholestasis/obstruction more than isolated unconjugated patterns."]
    },
    {
      name: "Albumin",
      category: "Protein / liver / nutrition labs",
      aliases: ["serum albumin"],
      range: "About 3.5-5.0 g/dL",
      why: "Albumin reflects oncotic pressure, liver synthesis, inflammation, kidney/GI protein loss, and nutrition trends.",
      highCauses: ["Dehydration is the common cause of relative elevation."],
      lowCauses: ["Liver disease", "Nephrotic syndrome", "Malnutrition", "Inflammation", "Burns", "Protein-losing enteropathy"],
      criticalConcerns: ["Low albumin contributes to edema, poor wound healing, and medication-binding changes."],
      nursingConsiderations: ["Assess edema, nutrition, wounds, liver function, kidney protein loss, and inflammation."],
      nclexTraps: ["Total calcium can look low when albumin is low; ionized or corrected calcium may be needed."]
    },
    {
      name: "Ammonia",
      category: "Liver / neuro labs",
      aliases: ["serum ammonia"],
      range: "Often about 15-45 mcg/dL or 11-32 micromol/L depending lab.",
      why: "Ammonia can rise in liver failure and hepatic encephalopathy, contributing to altered mental status.",
      highCauses: ["Cirrhosis", "Liver failure", "GI bleeding in liver disease", "Portosystemic shunting", "Urea-cycle disorders"],
      lowCauses: ["Low ammonia is usually not the safety problem."],
      criticalConcerns: ["Confusion, asterixis, somnolence, or coma with high ammonia is urgent."],
      nursingConsiderations: ["Monitor mental status, fall/aspiration risk, bowel movement goals with lactulose, and precipitating triggers."],
      nclexTraps: ["Treat the encephalopathy pattern, not the ammonia number alone."]
    },
    {
      name: "Lipase",
      category: "Pancreatic labs",
      aliases: ["serum lipase"],
      range: "Often about 10-140 U/L, facility dependent.",
      why: "Lipase rises with pancreatic inflammation and is more specific for pancreatitis than amylase.",
      highCauses: ["Acute pancreatitis", "Pancreatic obstruction", "Some renal disease", "Gallstone disease"],
      lowCauses: ["Low lipase is usually not the acute safety problem."],
      criticalConcerns: ["Severe epigastric pain radiating to the back plus elevated lipase suggests pancreatitis."],
      nursingConsiderations: ["Monitor pain, N/V, hydration, calcium, glucose, respiratory status, and shock signs."],
      nclexTraps: ["Low calcium with pancreatitis can signal severity."]
    },
    {
      name: "Amylase",
      category: "Pancreatic / GI labs",
      aliases: ["serum amylase"],
      range: "Often about 30-110 U/L, facility dependent.",
      why: "Amylase can rise in pancreatitis but is less specific than lipase.",
      highCauses: ["Pancreatitis", "Salivary gland disease", "Bowel disease", "Renal impairment"],
      lowCauses: ["Low amylase is usually not the acute safety problem."],
      criticalConcerns: ["Interpret with lipase and symptoms."],
      nursingConsiderations: ["Do not rely on amylase alone when lipase and clinical picture disagree."],
      nclexTraps: ["Lipase is usually the stronger pancreatitis clue."]
    },
    {
      name: "TSH",
      category: "Thyroid labs",
      aliases: ["thyroid stimulating hormone", "thyroid-stimulating hormone"],
      range: "Often about 0.4-4.0 mIU/L, facility dependent.",
      why: "TSH screens thyroid axis function. High TSH usually suggests primary hypothyroidism. Low TSH usually suggests hyperthyroidism or overreplacement.",
      highCauses: ["Primary hypothyroidism", "Underreplacement with levothyroxine"],
      lowCauses: ["Hyperthyroidism", "Excess thyroid hormone replacement", "Central pituitary disease can be low/inappropriately normal"],
      criticalConcerns: ["Thyroid storm and myxedema coma are emergency extremes."],
      nursingConsiderations: ["Interpret with free T4 and symptoms."],
      nclexTraps: ["TSH moves opposite thyroid hormone in primary thyroid disease."]
    },
    {
      name: "Free T4",
      category: "Thyroid labs",
      aliases: ["thyroxine", "FT4"],
      range: "Often about 0.8-1.8 ng/dL, facility dependent.",
      why: "Free T4 reflects circulating thyroid hormone and helps confirm hypo/hyperthyroidism.",
      highCauses: ["Hyperthyroidism", "Thyroid hormone overreplacement", "Thyroiditis"],
      lowCauses: ["Hypothyroidism", "Pituitary disease", "Severe illness can affect values"],
      criticalConcerns: ["Very high thyroid hormone with fever, tachycardia, agitation, or heart failure suggests thyroid storm."],
      nursingConsiderations: ["Check pulse, temperature, weight, bowel pattern, tremor, and medication adherence."],
      nclexTraps: ["Levothyroxine is taken on an empty stomach and separated from calcium/iron."]
    },
    {
      name: "Cortisol",
      category: "Endocrine labs",
      aliases: ["serum cortisol", "AM cortisol"],
      range: "Morning cortisol is lab-specific, often roughly 5-25 mcg/dL.",
      why: "Cortisol supports adrenal insufficiency and Cushing-pattern evaluation.",
      highCauses: ["Cushing syndrome", "Stress response", "Steroid therapy"],
      lowCauses: ["Addison disease/adrenal insufficiency", "Pituitary ACTH deficiency", "Abrupt steroid withdrawal"],
      criticalConcerns: ["Hypotension, hyponatremia, hyperkalemia, hypoglycemia, and shock can signal adrenal crisis."],
      nursingConsiderations: ["Do not abruptly stop chronic corticosteroids.", "Expect stress-dose steroids in acute adrenal crisis as ordered."],
      nclexTraps: ["Addison disease is too little cortisol and often too little aldosterone. Cushing syndrome is too much cortisol."]
    },
    {
      name: "ESR",
      category: "Inflammation labs",
      aliases: ["erythrocyte sedimentation rate", "sed rate"],
      range: "Female often 0-20 mm/hr. Male often 0-15 mm/hr. Rises with age and varies by lab.",
      why: "ESR is a nonspecific inflammation trend marker. It moves slowly and is less acute than CRP.",
      highCauses: ["Inflammation", "Infection", "Autoimmune disease", "Temporal arteritis", "Malignancy", "Pregnancy/older age can increase"],
      lowCauses: ["Usually less clinically urgent."],
      criticalConcerns: ["Headache, jaw claudication, vision changes, and high ESR can suggest temporal arteritis."],
      nursingConsiderations: ["Interpret with symptoms and CRP; do not diagnose from ESR alone."],
      nclexTraps: ["ESR is nonspecific and slow-moving."]
    },
    {
      name: "CRP",
      category: "Inflammation labs",
      aliases: ["C-reactive protein", "c reactive protein"],
      range: "Often <10 mg/L, assay dependent.",
      why: "CRP rises with acute inflammation/infection and changes faster than ESR.",
      highCauses: ["Infection", "Inflammation", "Autoimmune flare", "Tissue injury"],
      lowCauses: ["Low/normal CRP makes major inflammation less likely but does not rule everything out."],
      criticalConcerns: ["High CRP plus fever, instability, or focal infection requires clinical action."],
      nursingConsiderations: ["Trend with fever curve, WBC, cultures, lactate, symptoms, and treatment response."],
      nclexTraps: ["CRP is a trend/supporting marker, not a diagnosis."]
    },
    {
      name: "Procalcitonin",
      category: "Infection labs",
      aliases: ["PCT"],
      range: "Often <0.1-0.25 ng/mL is low, but protocols vary.",
      why: "Procalcitonin can support bacterial infection/sepsis assessment and antibiotic stewardship.",
      highCauses: ["Bacterial infection", "Sepsis", "Major trauma/surgery can also raise it"],
      lowCauses: ["Viral illness or noninfectious inflammation may have lower values, but exceptions occur."],
      criticalConcerns: ["Do not ignore clinical sepsis because procalcitonin is low early."],
      nursingConsiderations: ["Use with cultures, lactate, vitals, source assessment, and provider orders."],
      nclexTraps: ["Never let one biomarker override an unstable client."]
    },
    {
      name: "Haptoglobin",
      category: "Hemolysis labs",
      aliases: ["serum haptoglobin"],
      range: "Often about 30-200 mg/dL, but ranges vary by laboratory.",
      why: "Haptoglobin binds free hemoglobin released into plasma. Low haptoglobin supports intravascular hemolysis when paired with anemia, high LDH, indirect bilirubin rise, reticulocytosis, hemoglobinuria, or a positive DAT/Coombs context.",
      highCauses: ["Inflammation can raise haptoglobin because it is an acute-phase protein."],
      lowCauses: ["Intravascular hemolysis", "Severe liver synthetic dysfunction can lower production", "Large hematoma or transfusion reaction context can consume binding capacity"],
      criticalConcerns: ["Falling hemoglobin with jaundice, dark urine, back/flank pain after transfusion, hypotension, kidney injury, or schistocytes requires urgent escalation."],
      nursingConsiderations: ["Interpret with hemoglobin/hematocrit trend, LDH, indirect bilirubin, reticulocytes, peripheral smear, DAT/Coombs, urine color/output, transfusion history, and liver function."],
      nclexTraps: ["Low haptoglobin is a hemolysis clue, not a stand-alone diagnosis. Normal/high values can be misleading during inflammation."]
    },
    {
      name: "MCHC",
      category: "Hematology",
      aliases: ["mean corpuscular hemoglobin concentration"],
      range: "About 32-36 g/dL.",
      why: "MCHC describes how concentrated hemoglobin is inside red blood cells. It helps characterize anemia patterns with MCV, MCH, RDW, hemoglobin, hematocrit, iron studies, B12, and folate.",
      highCauses: ["Spherocytosis pattern", "Severe dehydration or lab artifact can make values look higher"],
      lowCauses: ["Iron deficiency anemia", "Thalassemia pattern", "Hypochromic microcytic anemia"],
      criticalConcerns: ["Very low hemoglobin, symptomatic anemia, chest pain, syncope, dyspnea, or active bleeding matters more than MCHC alone."],
      nursingConsiderations: ["Interpret MCHC with the full CBC trend, symptoms, bleeding risk, nutrition history, and iron/B12/folate results."],
      nclexTraps: ["Do not diagnose anemia type from one RBC index alone. Use the CBC pattern plus clinical findings."]
    },
    {
      name: "PT",
      category: "Coagulation",
      aliases: ["prothrombin time"],
      range: "Often about 11-13.5 seconds. Facility ranges vary. INR standardizes warfarin monitoring.",
      why: "PT checks the extrinsic and common coagulation pathways. It rises with warfarin effect, vitamin K deficiency, liver dysfunction, DIC, and factor deficiencies.",
      highCauses: ["Warfarin therapy or toxicity", "Vitamin K deficiency", "Liver disease", "DIC", "Massive transfusion or clotting factor deficiency"],
      lowCauses: ["Short PT is usually less clinically important than prolonged PT."],
      criticalConcerns: ["Bleeding, neuro changes after a fall, GI bleeding, or very high INR requires rapid escalation."],
      nursingConsiderations: ["Assess bleeding, bruising, stool/urine blood, medication interactions, diet consistency with warfarin, and fall risk."],
      nclexTraps: ["PT is related to warfarin, but NCLEX usually asks about INR for warfarin safety. Heparin is commonly tied to aPTT or anti-Xa."]
    },
    {
      name: "Urine pH",
      category: "Urinalysis",
      aliases: ["urinary pH"],
      range: "Usually about 4.5-8.0.",
      why: "Urine pH helps interpret stone risk, urinary tract infection patterns, renal tubular acidosis clues, diet/medication effects, and acid-base compensation.",
      highCauses: ["Urea-splitting UTI organisms", "Renal tubular acidosis", "Vomiting/metabolic alkalosis", "Old urine specimen can become falsely alkaline"],
      lowCauses: ["Metabolic acidosis compensation", "Diabetic ketoacidosis", "High-protein diet", "Starvation/ketosis"],
      criticalConcerns: ["Fever, flank pain, pregnancy, obstruction, sepsis signs, or immunosuppression with abnormal urinalysis needs escalation."],
      nursingConsiderations: ["Interpret with leukocyte esterase, nitrites, WBCs, RBCs, ketones, specific gravity, symptoms, and culture results."],
      nclexTraps: ["Urine pH alone does not diagnose UTI or kidney stone type. It is a clue, not the whole case."]
    },
    {
      name: "CSF WBC",
      category: "CSF",
      aliases: ["cerebrospinal fluid white blood cells", "cerebrospinal fluid WBC"],
      range: "Usually 0-5 cells/mcL in adults.",
      why: "CSF WBC elevation supports meningitis, encephalitis, inflammation, or blood contamination depending on the cell pattern and clinical picture.",
      highCauses: ["Bacterial meningitis often has high neutrophils", "Viral meningitis often has lymphocyte predominance", "Fungal/TB meningitis", "Inflammatory CNS disease", "Traumatic tap can add WBCs"],
      lowCauses: ["Low/normal CSF WBC is expected, but early infection or immunosuppression can still be dangerous."],
      criticalConcerns: ["Fever, neck stiffness, altered mental status, seizure, petechial rash, or signs of increased intracranial pressure are urgent."],
      nursingConsiderations: ["Maintain isolation when ordered, monitor neuro status, prepare for cultures/antibiotics, and watch for post-lumbar-puncture complications."],
      nclexTraps: ["Do not delay ordered antibiotics for suspected bacterial meningitis while waiting for every lab detail."]
    },
    {
      name: "CSF protein",
      category: "CSF",
      aliases: ["cerebrospinal fluid protein"],
      range: "Often about 15-45 mg/dL in adults.",
      why: "CSF protein rises when the blood-brain barrier is inflamed, infected, bleeding, or disrupted. It helps interpret meningitis and Guillain-Barre syndrome patterns.",
      highCauses: ["Bacterial, viral, fungal, or TB meningitis", "Guillain-Barre syndrome", "Subarachnoid bleeding", "Tumor/inflammation", "Traumatic tap"],
      lowCauses: ["Low CSF protein is less commonly a priority finding."],
      criticalConcerns: ["High CSF protein with low glucose and high WBC supports serious CNS infection until proven otherwise."],
      nursingConsiderations: ["Pair with CSF glucose, WBC differential, Gram stain/culture, opening pressure, symptoms, and neuro assessment."],
      nclexTraps: ["Guillain-Barre classically can show high CSF protein with relatively normal WBC count after the early phase."]
    }
  ];

  const PATHOLOGY_FULL_REPLACE_FIELDS = [
    "riskFactors",
    "signsSymptoms",
    "diagnostics",
    "labs",
    "treatments",
    "nursingPriorities",
    "complications",
    "redFlags",
    "patientEducation",
    "nclexTraps"
  ];

  const pathologyUpdates = [
    {
      name: "Tripod position",
      category: "Respiratory assessment / physical finding",
      aliases: ["tripod posture", "forward-leaning arm-supported position", "forward leaning with hands on knees", "braced-arm breathing position"],
      pronunciation: "TRY-pod puh-ZISH-un",
      definition: "Tripod position is a respiratory-distress posture in which a person sits or stands leaning forward and braces the hands or forearms on the knees, thighs, bed, or table. It is an observed physical finding, not a diagnosis: bracing fixes the shoulder girdle so accessory inspiratory muscles can raise the rib cage more effectively, temporarily easing work of breathing while signaling pulmonary or airway distress.",
      etiology: "People may assume tripod position during severe airflow obstruction or high work of breathing, including COPD exacerbation, severe asthma, upper-airway obstruction, epiglottitis, pneumonia, pulmonary edema/heart failure, or advanced respiratory fatigue. Athletes may briefly use a similar stance after exertion, so urgency comes from the full clinical context rather than posture alone.",
      pathology: "Bracing the arms fixes the shoulder girdle, giving pectoral and other accessory inspiratory muscles a stable point from which to elevate the rib cage. Forward lean can also improve chest-wall and diaphragmatic mechanics in some clients. The posture may reduce perceived dyspnea, but needing it at rest means the respiratory system is recruiting extra mechanical help.",
      pathophysiology: "Tripod positioning does not correct hypoxemia, hypercapnia, bronchospasm, edema, infection, or airway obstruction. It is a compensation for respiratory load. In chronic COPD it may accompany hyperinflation and a mechanically flattened diaphragm; in acute illness it can precede fatigue and respiratory failure. In a drooling, febrile child with stridor or muffled voice, tripod position is an epiglottitis/upper-airway emergency clue and the throat should not be forcibly examined.",
      riskFactors: ["COPD or asthma with airflow limitation", "Upper-airway swelling or obstruction", "Pneumonia, pulmonary edema, heart failure, or other causes of severe dyspnea", "Respiratory muscle fatigue, hyperinflation, or reduced lung compliance"],
      signsSymptoms: ["Forward lean with hands or forearms braced on the knees, thighs, bed, or table", "Accessory-muscle use, retractions, nasal flaring, tachypnea, wheeze, stridor, grunting, or markedly decreased air movement", "Inability to speak full sentences, diaphoresis, anxiety/restlessness, orthopnea, or preference not to lie supine", "Hypoxemia, cyanosis, confusion, drowsiness, a silent chest, or paradoxical breathing are late/severe danger findings"],
      diagnostics: ["Assess the client before equipment: airway patency, respiratory rate/pattern, work of breathing, ability to speak, mental status, skin color, symmetry, and position of comfort", "Measure SpO2 and trend vital signs; auscultate for stridor, wheeze, crackles, unequal breath sounds, or a silent chest", "Use ABG/VBG, peak flow, chest imaging, ECG, or targeted testing only as the suspected cause and stability require; do not delay airway support for testing"],
      labs: ["ABG/VBG when ventilation, fatigue, or acid-base status is uncertain", "Cause-directed tests may include CBC/cultures, BNP/troponin, electrolytes, lactate, viral testing, or imaging; the posture itself has no diagnostic laboratory value"],
      treatments: ["Allow upright or tripod positioning if it eases breathing; do not force a distressed client supine", "Support oxygenation and ventilation, call for urgent respiratory/airway help when severe, and treat the cause with bronchodilators, corticosteroids, epinephrine, diuresis, antibiotics, noninvasive ventilation, or advanced airway care as clinically indicated", "For suspected epiglottitis, keep the child calm and upright, avoid throat instrumentation, and prepare a controlled emergency airway"],
      nursingPriorities: ["Recognize tripod position as a work-of-breathing clue and immediately assess whether the client is compensating or beginning to fail", "Trend SpO2 with mental status, speech, respiratory rate, accessory-muscle use, breath sounds, ABG/VBG when ordered, and response to treatment", "Escalate early for stridor, drooling, silent chest, unequal breath sounds, exhaustion, confusion, cyanosis, worsening hypercapnia, or inability to maintain oxygenation", "Keep emergency airway and ventilation equipment available when the presentation is severe; never leave an unstable client alone"],
      complications: ["Respiratory muscle fatigue", "Acute hypoxemic or hypercapnic respiratory failure", "Airway obstruction", "Need for noninvasive or invasive ventilation", "Cardiorespiratory arrest if the underlying cause is not reversed"],
      redFlags: ["New tripod position at rest with inability to speak full sentences", "Stridor, drooling, muffled voice, or toxic appearance in a child", "Silent chest, altered mental status, cyanosis, paradoxical breathing, or falling respiratory effort", "Sudden unilateral absent breath sounds, hypotension, or chest pain suggesting tension pneumothorax"],
      patientEducation: ["Use the prescribed rescue plan and seek urgent help when breathing remains difficult despite medication or when speaking, walking, or staying awake becomes hard", "Report increasing rescue-inhaler use, new orthopnea, rapid weight gain/edema, fever, chest pain, or declining oxygen readings according to the care plan", "Tripod position may temporarily ease breathing, but it does not treat the cause of respiratory distress"],
      nclexTraps: ["Tripod position is a sign of increased work of breathing, not proof of one specific disease", "Do not make a severely dyspneic client lie flat for convenience", "A quieter chest is not always improvement: severe asthma can become silent when airflow is critically low", "In suspected epiglottitis, do not inspect the throat with a tongue blade"],
      tags: ["tripod position", "tripod posture", "respiratory distress", "accessory muscles", "work of breathing", "COPD", "asthma", "epiglottitis", "forward leaning"],
      sourceKeys: ["merck", "nhlbi"],
      sourceNote: "Mechanism and assessment anchors checked against Merck Manual Professional pulmonary examination guidance and NCBI Bookshelf/MedGen respiratory-distress descriptions.",
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Preload",
      category: "Hemodynamics / cardiac physiology",
      aliases: ["pre-load", "ventricular preload", "end-diastolic volume", "EDV", "ventricular filling"],
      pronunciation: "PREE-load",
      definition: "Preload is ventricular filling/stretch at the end of diastole: how full the ventricle is before it contracts. Clinically it tracks venous return and end-diastolic volume, so it is the volume side of stroke-volume physiology.",
      etiology: "Preload rises with fluid/blood administration, venoconstriction, renal sodium/water retention, heart failure congestion, and supine/leg-raise venous return. It falls with hemorrhage, dehydration, excessive diuresis, vasodilation, positive-pressure ventilation, tamponade, tension pneumothorax, or poor venous return.",
      pathology: "A ventricle needs enough preload to stretch myocardial fibers and generate useful stroke volume through the Frank-Starling mechanism. Too little preload causes low stroke volume and poor perfusion; too much preload overwhelms the ventricle and backs fluid into lungs or systemic veins.",
      pathophysiology: "Preload is not the same as total body water. A septic client can have swollen tissues but low effective intravascular preload, while a heart-failure client can have excessive preload with pulmonary congestion. The nurse interprets preload through filling, perfusion, lungs, urine output, and response to fluids or diuresis.",
      signsSymptoms: ["Low preload: hypotension, tachycardia, flat neck veins, poor skin perfusion, dizziness, low urine output, rising lactate, narrow pulse pressure.", "High preload/congestion: crackles, dyspnea, orthopnea, JVD, edema, weight gain, hepatomegaly, ascites, pulmonary edema."],
      diagnostics: ["Vital signs, MAP, pulse pressure, urine output, mentation, daily weight, intake/output, lung sounds, JVD, edema, lactate/perfusion markers.", "CVP, pulmonary artery pressures, ultrasound/echo, passive leg raise response, and hemodynamic monitoring when used; no single number defines preload alone."],
      treatments: ["Low preload may need fluid, blood, positioning, source control, or vasopressor/inotrope support depending cause.", "High preload may need diuresis, nitrates, dialysis/ultrafiltration, sodium/fluid management, or heart-failure therapy depending cause."],
      nursingPriorities: ["Ask whether the ventricle is underfilled, overfilled, or unable to use the volume.", "Trend lungs and perfusion together; do not chase blood pressure with fluid if pulmonary edema is worsening.", "Escalate hypotension with poor urine output, acute dyspnea/crackles, chest pain, new confusion, or shock signs."],
      complications: ["Shock from underfilling", "Pulmonary edema from excessive filling", "Reduced stroke volume", "Renal hypoperfusion", "Right- or left-sided congestion"],
      patientEducation: ["Report sudden weight gain, worsening swelling, shortness of breath, dizziness, fainting, or much lower urine output."],
      nclexTraps: ["Preload means filling before contraction, not blood pressure alone.", "Edema does not prove adequate intravascular preload.", "PEEP can improve oxygenation but lower preload by reducing venous return."],
      tags: ["preload", "venous return", "EDV", "filling", "Frank-Starling", "stroke volume", "cardiac output"],
      sourceKeys: ["openstax-cardiac-physiology"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Afterload",
      category: "Hemodynamics / cardiac physiology",
      aliases: ["after-load", "ventricular afterload", "outflow resistance", "ejection resistance", "systemic vascular resistance load"],
      pronunciation: "AF-ter-load",
      definition: "Afterload is the pressure/resistance the ventricle must overcome to eject blood during systole. For the left ventricle, systemic vascular resistance, aortic pressure, and aortic stenosis are common bedside anchors.",
      etiology: "Afterload rises with hypertension, vasoconstriction, aortic stenosis, arterial stiffness, catecholamine/pressor effect, hypothermia, and some shock states. It falls with vasodilation, sepsis/distributive shock, anesthetics, nitrates, nitroprusside, ACE inhibitors, ARBs, and other vasodilators.",
      pathology: "High afterload makes ejection harder, reduces stroke volume in vulnerable ventricles, increases myocardial oxygen demand, and can worsen heart failure or pulmonary edema. Very low afterload can make blood pressure and organ perfusion collapse even if the heart is squeezing.",
      pathophysiology: "Afterload is not simply the cuff pressure; it is the load against ventricular fiber shortening. A failing or dilated ventricle is especially sensitive to afterload because more wall tension is required to eject blood.",
      signsSymptoms: ["High afterload: hypertension, widened workload, dyspnea/pulmonary edema in heart failure, chest pressure, cool extremities when output falls.", "Low afterload: warm flushed skin in early distributive shock, bounding pulses, hypotension, low diastolic pressure, altered mentation, low urine output."],
      diagnostics: ["BP/MAP, pulse pressure, perfusion exam, urine output, lactate, echo/valve evaluation, arterial line trend when present, vasopressor/vasodilator dose response.", "Interpret afterload with cardiac output: a high MAP can still coexist with poor forward flow in severe pump failure."],
      treatments: ["High afterload may need vasodilators, antihypertensives, diuresis, valve intervention, or heart-failure afterload reduction.", "Low afterload may need fluids when appropriate, vasopressors, infection/source control, adrenal support, or removal of vasodilating triggers."],
      nursingPriorities: ["Ask whether the ventricle is pushing against too much resistance or whether vascular tone is too low to maintain perfusion.", "Trend BP/MAP with mentation, skin, urine output, lactate, lungs, chest pain, and medication effects.", "Escalate severe hypertension with organ symptoms or hypotension with shock signs."],
      complications: ["Reduced stroke volume", "Myocardial ischemia", "Pulmonary edema", "Shock from vasodilation", "Worsening heart failure"],
      patientEducation: ["Explain that controlling blood pressure lowers the force the heart must pump against and protects heart, brain, kidney, and vessel health."],
      nclexTraps: ["Afterload is ejection resistance, not preload/filling.", "Raising MAP with pure vasoconstriction can worsen cardiac output in some low-output clients.", "Vasodilators can reduce afterload but may cause dangerous hypotension."],
      tags: ["afterload", "SVR", "ejection", "systemic vascular resistance", "hypertension", "vasodilation", "cardiac output"],
      sourceKeys: ["openstax-cardiac-physiology"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Stroke volume",
      category: "Hemodynamics / cardiac physiology",
      aliases: ["SV", "left ventricular stroke volume", "beat volume", "volume ejected per beat"],
      pronunciation: "STROHK VOL-yoom",
      definition: "Stroke volume is the amount of blood one ventricle ejects with each heartbeat. The crash-course equation is SV = EDV - ESV, and cardiac output equals stroke volume multiplied by heart rate.",
      etiology: "Stroke volume changes with preload, afterload, contractility, rhythm, ventricular filling time, valve disease, myocardial ischemia, cardiomyopathy, blood volume, ventilation pressure, and obstruction such as tamponade or massive pulmonary embolism.",
      pathology: "Low stroke volume means each beat moves less blood forward, so cardiac output and tissue oxygen delivery can fall even if the heart rate rises. High stroke volume can occur with exercise, fever, anemia, pregnancy, or high-output physiology, but context decides whether it is adaptive or pathologic.",
      pathophysiology: "Preload fills the ventricle, contractility squeezes it, and afterload resists ejection. Stroke volume is the result of that balance; compensatory tachycardia can hide a falling stroke volume until perfusion worsens.",
      signsSymptoms: ["Low stroke volume: weak pulse, narrow pulse pressure, cool clammy skin, hypotension, fatigue, dyspnea, altered mentation, low urine output, rising lactate.", "Congestive pattern may coexist when the ventricle cannot eject volume effectively: crackles, JVD, edema, or pulmonary edema."],
      diagnostics: ["Pulse pressure, BP/MAP, perfusion exam, urine output, lactate, echocardiography, ejection fraction, hemodynamic monitoring, cardiac output/index when measured.", "Interpret with heart rate: cardiac output can fall from low stroke volume, too slow HR, or ineffective rapid rhythms."],
      treatments: ["Treat the driver: fluids/blood for underfilling, inotropes for contractility, vasodilators for excessive afterload, rate/rhythm management, reperfusion, valve/obstruction management, or diuresis when congestion dominates."],
      nursingPriorities: ["Do not equate a fast pulse with good output.", "Trend pulse pressure, mentation, urine output, skin perfusion, lung sounds, rhythm, and response to therapy.", "Escalate shock signs, chest pain, new dysrhythmia, acute pulmonary edema, or falling urine output."],
      complications: ["Low cardiac output", "Shock", "Renal hypoperfusion", "Pulmonary edema", "Syncope", "Myocardial ischemia"],
      patientEducation: ["Teach heart-failure clients to report worsening dyspnea, weight gain, swelling, dizziness, fainting, chest pain, or lower urine output."],
      nclexTraps: ["Stroke volume is per beat; cardiac output is per minute.", "A normal heart rate does not guarantee adequate stroke volume.", "Ejection fraction is a percentage of EDV ejected, not the same as stroke volume."],
      tags: ["stroke volume", "SV", "EDV", "ESV", "ejection fraction", "cardiac output", "preload", "afterload", "contractility"],
      sourceKeys: ["openstax-cardiac-physiology"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Cardiac output",
      category: "Hemodynamics / cardiac physiology",
      aliases: ["CO", "heart output", "cardiac index concept", "forward flow"],
      pronunciation: "KAR-dee-ak OUT-put",
      definition: "Cardiac output is the volume of blood one ventricle pumps per minute. The crash-course equation is CO = heart rate x stroke volume, so output can fail from rate problems, weak stroke volume, or both.",
      etiology: "Cardiac output falls with hypovolemia, hemorrhage, myocardial infarction, heart failure, cardiomyopathy, bradycardia, tachydysrhythmias, tamponade, tension pneumothorax, massive pulmonary embolism, severe valve disease, acidosis, hypoxia, and high afterload. It rises with exercise, fever, pregnancy, anemia, sepsis/hyperdynamic states, and thyroid excess.",
      pathology: "Low cardiac output means tissues are not receiving enough forward blood flow for oxygen delivery. The nurse sees this as perfusion failure: altered mentation, cool skin, weak pulses, hypotension or narrow pulse pressure, low urine output, lactate rise, chest pain, dyspnea, or shock.",
      pathophysiology: "Cardiac output is a flow variable, not just a blood-pressure number. A client can have a MAP that looks acceptable but poor cardiac output if vasoconstriction is high, and a client can have warm shock with high/normal output but poor distributive perfusion.",
      signsSymptoms: ["Low-output cues: fatigue, weakness, dizziness/syncope, confusion, cool clammy skin, weak pulses, delayed cap refill, oliguria, hypotension, narrow pulse pressure, dyspnea, crackles if congested.", "High-output or hyperdynamic cues: bounding pulses, wide pulse pressure, warm skin, tachycardia, fever/sepsis/anemia/thyroid clues."],
      diagnostics: ["BP/MAP, HR/rhythm, pulse pressure, cap refill, mentation, urine output, lactate, ABG/VBG when indicated, ECG, echo, BNP/troponin when context fits, hemodynamic monitoring/cardiac index if used.", "Always connect CO with oxygen content: anemia or hypoxemia can reduce oxygen delivery even when flow seems adequate."],
      treatments: ["Treat the cause: fluids/blood for volume loss, inotropes for pump failure, vasopressors for distributive shock, rate/rhythm treatment, oxygen/ventilation support, reperfusion, obstruction relief, diuresis, or mechanical circulatory support when ordered."],
      nursingPriorities: ["Think forward flow plus oxygen delivery.", "Trend mentation, urine output, skin, MAP, HR/rhythm, pulse pressure, lungs, lactate, and therapy response.", "Escalate signs of shock, chest pain, severe dyspnea, falling urine output, new confusion, or unstable rhythm."],
      complications: ["Shock", "Acute kidney injury", "Myocardial ischemia", "Respiratory failure", "Multi-organ dysfunction", "Cardiac arrest"],
      patientEducation: ["Report worsening shortness of breath, chest pain, fainting, new confusion, severe fatigue, swelling/weight gain, or much lower urine output."],
      nclexTraps: ["Cardiac output is HR x SV; fixing only the rate may not fix output.", "Blood pressure is not the same as cardiac output.", "Oxygen delivery also depends on hemoglobin and oxygen saturation."],
      tags: ["cardiac output", "CO", "heart rate", "stroke volume", "perfusion", "shock", "oxygen delivery"],
      sourceKeys: ["openstax-cardiac-physiology"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Systemic vascular resistance",
      category: "Hemodynamics / cardiac physiology",
      aliases: ["SVR", "vascular resistance", "systemic resistance", "arterial tone", "total peripheral resistance"],
      pronunciation: "sis-TEM-ik VAS-kyoo-ler ree-ZIS-tans",
      definition: "Systemic vascular resistance is the resistance the systemic arterial circulation creates against blood flow. It is a major part of left-ventricular afterload and helps determine MAP along with cardiac output.",
      etiology: "SVR rises with sympathetic activation, vasopressors, pain, anxiety, hypothermia, chronic hypertension, vasoconstriction, and some shock compensation. SVR falls with sepsis, anaphylaxis, neurogenic shock, vasodilator drugs, anesthetics, adrenal crisis, and severe inflammatory vasoplegia.",
      pathology: "High SVR can preserve blood pressure during shock but makes the heart eject against more resistance and may worsen low-output states. Low SVR causes distributive hypotension: vessels are too relaxed to maintain pressure and organ perfusion despite normal or high cardiac output early on.",
      pathophysiology: "MAP is often simplified as cardiac output times SVR plus venous pressure. Clinically, that means a low MAP can come from low flow, low tone, or both; and a high SVR can make the blood pressure look better while microcirculatory perfusion remains poor.",
      signsSymptoms: ["High SVR: cool clammy skin, narrow pulse pressure, weak pulses, hypertension or compensated shock, increased afterload.", "Low SVR: warm flushed skin, bounding pulses, low diastolic pressure, hypotension, wide pulse pressure early, altered mentation, low urine output."],
      diagnostics: ["BP/MAP, pulse pressure, skin temperature/color, cap refill, urine output, lactate, HR/rhythm, vasopressor/vasodilator dose response, invasive hemodynamics when available.", "Interpret SVR with CO: vasoconstriction may raise MAP but reduce stroke volume in a failing ventricle."],
      treatments: ["Low SVR may need fluids when appropriate, vasopressors such as norepinephrine, epinephrine, vasopressin, source control/antibiotics, steroids when indicated, or anaphylaxis/neurogenic-specific care.", "High SVR may need pain/anxiety control, warming, vasodilators, antihypertensives, afterload reduction, or shock-cause treatment."],
      nursingPriorities: ["Ask whether vascular tone is too tight, too relaxed, or compensating for poor flow.", "Trend MAP with skin, pulses, mentation, urine output, lactate, temperature, infection/allergy/spinal clues, and medication effects.", "Protect IV sites for vasopressors and watch for ischemia or extravasation."],
      complications: ["Distributive shock", "Low cardiac output from excessive afterload", "Tissue ischemia", "Renal hypoperfusion", "Pulmonary edema in heart failure"],
      patientEducation: ["For chronic hypertension, explain that high vascular resistance makes the heart pump against more force and injures vessels over time."],
      nclexTraps: ["SVR is vascular tone/resistance, not blood volume.", "Warm shock can still be life-threatening even when the skin is not cold.", "A vasopressor raises tone; it does not automatically fix preload, contractility, oxygenation, or infection source."],
      tags: ["systemic vascular resistance", "SVR", "afterload", "MAP", "vasoconstriction", "vasodilation", "distributive shock"],
      sourceKeys: ["openstax-cardiac-physiology"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Barotrauma",
      category: "Ventilation / lung injury",
      aliases: ["ventilator barotrauma", "pressure injury from ventilation", "air leak from ventilation"],
      pronunciation: "BAIR-oh-TRAW-muh",
      definition: "Barotrauma is pressure-related lung injury, classically from positive-pressure ventilation causing alveolar rupture and air leak. The bedside danger is pneumothorax, tension pneumothorax, pneumomediastinum, or subcutaneous emphysema after excessive airway/alveolar pressure.",
      etiology: "High airway pressures, excessive plateau pressure, severe obstructive air trapping, ARDS with noncompliant lungs, high PEEP in a vulnerable client, vigorous manual ventilation, and uneven regional overdistension.",
      pathology: "When pressure stress exceeds what fragile alveoli can tolerate, alveolar walls tear and air dissects into pleural, mediastinal, subcutaneous, or other spaces. The result can abruptly impair oxygenation, venous return, and cardiac output.",
      pathophysiology: "Barotrauma overlaps with volutrauma because pressure and stretch interact. A stiff, heterogenous ARDS lung may have small recruitable areas that receive disproportionate stress even when the set tidal volume looks modest.",
      signsSymptoms: ["Sudden hypoxemia, increased peak/plateau pressures, dyspnea or ventilator distress, asymmetric breath sounds, chest pain if awake, subcutaneous crepitus, hypotension or JVD if tension physiology develops."],
      diagnostics: ["Respiratory assessment, ventilator pressure trends, SpO2/ABG, chest x-ray or bedside ultrasound for pneumothorax, hemodynamics, and evaluation for auto-PEEP/air trapping."],
      treatments: ["Immediate escalation for suspected tension pneumothorax; anticipate needle decompression/chest tube per protocol.", "Adjust ventilation toward lung-protective pressures/volumes, treat air trapping, and reassess PEEP/plateau/driving pressure with the team."],
      nursingPriorities: ["Treat sudden desaturation plus hypotension on a ventilator as possible pneumothorax/tension until assessed.", "Compare breath sounds, inspect chest rise, palpate for crepitus, check tubing, call rapid help, and prepare emergency equipment.", "Trend peak pressure, plateau pressure, PEEP, oxygenation, and hemodynamics after setting changes."],
      complications: ["Pneumothorax", "Tension pneumothorax", "Pneumomediastinum", "Subcutaneous emphysema", "Obstructive shock", "Worsening hypoxemia"],
      patientEducation: ["For awake clients, report sudden chest pain, worsening shortness of breath, or neck/chest swelling/air crackling sensation."],
      nclexTraps: ["Barotrauma is an air-leak emergency when sudden deterioration occurs.", "Do not keep increasing pressure blindly for hypoxemia without reassessing lungs, hemodynamics, and pneumothorax risk.", "Peak pressure can rise from tube/airway resistance; plateau pressure better reflects alveolar distending pressure."],
      tags: ["barotrauma", "ventilator", "pneumothorax", "tension pneumothorax", "plateau pressure", "PEEP", "ARDS"],
      sourceKeys: ["ventilator-associated-lung-injury", "mechanical-ventilation-complications"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Volutrauma",
      category: "Ventilation / lung injury",
      aliases: ["ventilator volutrauma", "alveolar overdistension", "tidal volume injury", "overstretch lung injury"],
      pronunciation: "VOL-yoo-TRAW-muh",
      definition: "Volutrauma is lung injury from excessive alveolar stretch/volume, especially when tidal volume or regional overdistension overinflates the usable lung. It is a major mechanism of ventilator-induced lung injury even when an obvious pneumothorax is not present.",
      etiology: "High tidal volume, poor respiratory-system compliance, ARDS baby-lung physiology, uneven ventilation distribution, excessive transpulmonary pressure, and ventilation that overdistends already open alveoli.",
      pathology: "Overstretched alveoli and capillaries develop epithelial/endothelial injury, surfactant dysfunction, inflammatory mediator release, edema, and worse compliance. This can propagate ARDS-like lung injury.",
      pathophysiology: "In ARDS, only part of the lung may be open and available for ventilation, so a normal-looking tidal volume for body size can be too large for the functional baby lung. Driving pressure and plateau pressure help reveal that stress.",
      signsSymptoms: ["Worsening oxygenation, rising plateau/driving pressure, decreasing compliance, ventilator dyssynchrony, respiratory acidosis if lung-protective ventilation requires permissive hypercapnia, and new infiltrates/edema pattern."],
      diagnostics: ["Tidal volume by predicted body weight, plateau pressure, driving pressure, compliance trend, ABG, chest imaging, oxygenation response, and ARDS severity context."],
      treatments: ["Use lung-protective ventilation principles such as low tidal volume based on predicted body weight, limiting plateau/driving pressure, appropriate PEEP, proning or adjuncts when ordered, and treating the underlying ARDS trigger."],
      nursingPriorities: ["Notice when tidal volume, plateau pressure, or driving pressure is moving in an unsafe direction.", "Use predicted body weight, not actual edema/obesity weight, when discussing lung-protective tidal volumes.", "Trend oxygenation, CO2/pH tolerance, sedation/synchrony, lung sounds, hemodynamics, and provider respiratory-therapy changes."],
      complications: ["Ventilator-induced lung injury", "Worsening ARDS", "Pulmonary edema from permeability injury", "Barotrauma", "Respiratory failure"],
      patientEducation: ["For ventilated clients/families, explain that smaller breaths may be intentional to protect injured lungs even if the ventilator looks less forceful."],
      nclexTraps: ["Volutrauma is stretch/volume injury, not just pressure injury.", "Bigger breaths can worsen ARDS even if oxygenation briefly looks better.", "Actual body weight is not the same as predicted body weight for lung-protective tidal volume."],
      tags: ["volutrauma", "tidal volume", "VILI", "ARDS", "plateau pressure", "driving pressure", "lung protective ventilation"],
      sourceKeys: ["ventilator-associated-lung-injury", "ards-mechanical-ventilation"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Atelectrauma",
      category: "Ventilation / lung injury",
      aliases: ["atelectotrauma", "cyclic atelectasis", "repeated alveolar opening and closing"],
      pronunciation: "at-uh-LEK-TRAW-muh",
      definition: "Atelectrauma is shear injury from repeated alveolar collapse at end-expiration and reopening during inspiration. It is the low-volume/open-close side of ventilator-induced lung injury and is one reason carefully chosen PEEP can protect lungs.",
      etiology: "Insufficient PEEP, low functional residual capacity, surfactant loss, ARDS, obesity/abdominal pressure, anesthesia, dependent atelectasis, mucus plugging, and unstable recruitable alveoli.",
      pathology: "Repeated collapse and reopening creates shear stress at alveolar walls, worsens epithelial injury, increases inflammation, reduces compliance, and can amplify hypoxemia from shunt/collapse.",
      pathophysiology: "PEEP can hold recruitable alveoli open at end-expiration, reducing cyclic opening/closing. Too little PEEP allows atelectrauma; too much pressure can cause overdistension, hypotension, barotrauma, or volutrauma.",
      signsSymptoms: ["Worsening oxygenation when PEEP is too low, dependent crackles/atelectasis, rising work of breathing, reduced compliance, recurrent derecruitment after suctioning/disconnection, and shunt-like hypoxemia."],
      diagnostics: ["SpO2/ABG response to PEEP/positioning, chest imaging, compliance trend, ventilator pressure-volume behavior, derecruitment after circuit breaks, and bedside assessment for secretions/atelectasis."],
      treatments: ["Use ordered PEEP/recruitment strategies, lung-protective ventilation, proning/mobilization when appropriate, suctioning when secretions contribute, and treatment of ARDS/pneumonia/atelectasis triggers."],
      nursingPriorities: ["Prevent avoidable derecruitment: minimize unnecessary ventilator disconnections and preoxygenate/suction according to protocol.", "Watch oxygenation and BP after PEEP changes because recruitment benefit can trade off with preload reduction.", "Escalate refractory hypoxemia, sudden deterioration, or inability to maintain oxygenation after repositioning/suctioning."],
      complications: ["Ventilator-induced lung injury", "Refractory hypoxemia", "ARDS worsening", "Respiratory fatigue", "Need for higher ventilatory support"],
      patientEducation: ["Explain that PEEP is not extra oxygen; it is pressure that helps keep air sacs open between breaths."],
      nclexTraps: ["Atelectrauma is repeated collapse/reopening, not alveolar overdistension.", "More PEEP is not always better; oxygenation and hemodynamics must both be watched.", "Suctioning or disconnecting a ventilated ARDS client can cause derecruitment."],
      tags: ["atelectrauma", "atelectotrauma", "cyclic atelectasis", "PEEP", "alveolar recruitment", "ARDS", "VILI"],
      sourceKeys: ["atelectotrauma", "ventilator-associated-lung-injury"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Transpulmonary pressure",
      category: "Ventilation / lung mechanics",
      aliases: ["trans-pulmonary pressure", "lung distending pressure", "alveolar minus pleural pressure", "Ptp", "PL"],
      pronunciation: "trans-PUL-muh-nair-ee PRESH-er",
      definition: "Transpulmonary pressure is the distending pressure across the lung: alveolar pressure minus pleural pressure. It tells you how much pressure is actually stretching lung tissue, not just what pressure is displayed at the ventilator airway.",
      etiology: "Transpulmonary pressure becomes clinically important in ARDS, obesity, abdominal hypertension, chest wall stiffness, pleural disease, high PEEP strategies, and ventilator cases where airway pressure may not equal lung stress.",
      pathology: "Excessive transpulmonary pressure can overdistend alveoli and contribute to volutrauma/barotrauma. Too little end-expiratory transpulmonary pressure can allow derecruitment and atelectrauma.",
      pathophysiology: "Airway pressure is divided between the lung and chest wall. A high airway plateau pressure may reflect stiff chest wall rather than excessive lung stretch, while a seemingly acceptable airway pressure can still overdistend a small baby lung.",
      signsSymptoms: ["The pressure itself is calculated/estimated, not felt by the client.", "Concern rises when oxygenation worsens, compliance falls, plateau/driving pressures rise, PEEP changes cause hypotension, or air-leak signs appear."],
      diagnostics: ["Ventilator pressures, plateau pressure, PEEP, compliance, oxygenation, hemodynamics, and sometimes esophageal pressure monitoring to estimate pleural pressure in advanced ventilator management."],
      treatments: ["Team strategies may adjust PEEP, tidal volume, recruitment, proning, sedation/synchrony, or chest-wall/abdominal contributors to balance recruitment against overdistension."],
      nursingPriorities: ["Know the distinction: airway pressure is measured at the circuit; transpulmonary pressure is the lung-distending pressure.", "Report rising pressures, falling compliance, hypotension after PEEP changes, new subcutaneous emphysema, sudden desaturation, or pneumothorax concern.", "Connect this term with ARDS lung-protective ventilation rather than memorizing a number alone."],
      complications: ["Volutrauma", "Barotrauma", "Atelectrauma if too low at end-expiration", "Hypotension from excessive pressure strategy", "Refractory hypoxemia"],
      patientEducation: ["For families, explain that ventilator pressure is adjusted to keep air sacs open without overstretching fragile lung tissue."],
      nclexTraps: ["Transpulmonary pressure is not the same as peak airway pressure.", "High airway pressure does not always mean high lung stretch if chest wall pressure is high.", "Low pressure is not automatically safe if alveoli repeatedly collapse and reopen."],
      tags: ["transpulmonary pressure", "alveolar pressure", "pleural pressure", "ARDS", "PEEP", "driving pressure", "lung mechanics"],
      sourceKeys: ["ards-mechanical-ventilation", "ventilator-associated-lung-injury"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Driving pressure",
      category: "Ventilation / lung mechanics",
      aliases: ["ventilator driving pressure", "delta pressure", "plateau minus PEEP", "driving pressure ventilation"],
      pronunciation: "DRY-ving PRESH-er",
      definition: "Driving pressure is the pressure used to deliver tidal volume above PEEP, commonly calculated as plateau pressure minus PEEP during passive ventilation. It reflects tidal volume relative to respiratory-system compliance, so high driving pressure means the lung/chest system is being stressed to deliver each breath.",
      etiology: "Driving pressure rises when tidal volume is high, compliance is low, ARDS/stiff lungs worsen, recruitable lung is small, abdominal/chest wall pressure contributes, or plateau pressure rises relative to PEEP.",
      pathology: "High driving pressure is a lung-stress clue and has become an important ARDS/lung-protective ventilation concept. It links the delivered volume to the size/stiffness of the available lung rather than looking at tidal volume alone.",
      pathophysiology: "Driving pressure is roughly tidal volume divided by respiratory-system compliance. A smaller baby lung or stiffer respiratory system requires more pressure for the same volume, increasing risk of ventilator-induced injury.",
      signsSymptoms: ["Driving pressure itself is a ventilator/hemodynamic measurement, not a symptom.", "Bedside clues that should make the nurse look at pressures include worsening oxygenation, rising plateau pressure, reduced compliance, dyssynchrony, hypotension after pressure changes, or barotrauma signs."],
      diagnostics: ["Measure plateau pressure during an inspiratory hold when the client is passive/synchronous, subtract set PEEP, and interpret with tidal volume, compliance, oxygenation, pH/CO2, and hemodynamics.", "Do not calculate from peak pressure alone because peak includes airway resistance."],
      treatments: ["Team strategies may include lowering tidal volume, optimizing PEEP/recruitment, proning, improving synchrony/sedation when appropriate, treating secretions/bronchospasm, and addressing ARDS cause."],
      nursingPriorities: ["Know the phrase: driving pressure = plateau pressure minus PEEP.", "Report rising plateau/driving pressure trends, sudden oxygenation decline, hypotension, or new air-leak signs.", "Pair pressure safety with gas exchange: lung-protective ventilation may accept permissive hypercapnia if ordered and pH is tolerable."],
      complications: ["Ventilator-induced lung injury", "Volutrauma", "Barotrauma", "Worsening ARDS", "Hypotension if pressure strategy reduces venous return"],
      patientEducation: ["For families, explain that ventilator settings may be adjusted to protect lung tissue, not only to chase a bigger breath."],
      nclexTraps: ["Driving pressure is not the same as peak inspiratory pressure.", "A normal tidal volume can still be too stressful if compliance is poor.", "PEEP can improve recruitment but also changes hemodynamics, so pressure numbers and patient perfusion both matter."],
      tags: ["driving pressure", "plateau pressure", "PEEP", "ARDS", "compliance", "tidal volume", "lung protective ventilation"],
      sourceKeys: ["ards-mechanical-ventilation", "ventilator-associated-lung-injury"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Third spacing",
      category: "Fluid balance / perfusion",
      aliases: ["third-space fluid shift", "third space fluid", "third spacing fluid", "fluid third spacing"],
      pronunciation: "third SPAY-sing",
      definition: "Third spacing is movement of fluid out of the usable intravascular space into tissues or body cavities where it does not support circulation. The classic bedside paradox is edema, ascites, or effusions with low effective circulating volume and poor perfusion.",
      etiology: "Sepsis, burns, pancreatitis, trauma, major surgery, peritonitis, bowel obstruction, liver disease/ascites, nephrotic syndrome, hypoalbuminemia, capillary leak, inflammation, and aggressive fluid shifts.",
      pathology: "Fluid leaves the vascular compartment because hydrostatic pressure is high, oncotic pressure is low, capillary permeability is increased, lymph drainage is impaired, or a body cavity is collecting fluid. The client can look fluid overloaded while organs are underfilled.",
      pathophysiology: "Starling forces explain the movement: pressure can push fluid out, albumin normally pulls fluid in, and leaky capillaries let protein-rich fluid escape. Once fluid is in the interstitium, peritoneum, pleura, or bowel wall, it may not maintain preload, MAP, urine output, or tissue oxygen delivery.",
      signsSymptoms: ["Edema, ascites, pleural effusion, abdominal distention, weight gain, weeping tissue, crackles if lungs are involved.", "Perfusion danger: tachycardia, hypotension, narrow pulse pressure, cool skin, dizziness, confusion, low urine output, rising lactate, hemoconcentration early in burns/pancreatitis."],
      diagnostics: ["Daily weight, strict intake/output, urine output, BP/MAP, HR, perfusion exam, edema/abdominal girth, lung sounds, albumin/total protein, hematocrit trend, creatinine/BUN, lactate, imaging for ascites/effusions/edema when indicated."],
      treatments: ["Treat the cause: sepsis/source control, burn resuscitation, pancreatitis support, albumin/diuresis/paracentesis for selected ascites protocols, nutrition/protein support, compression/elevation when appropriate, and careful fluid/vasopressor strategy in shock."],
      nursingPriorities: ["Do not assume swelling means adequate circulating volume.", "Trend perfusion and lungs together before and after fluids, albumin, diuretics, paracentesis, or vasopressors.", "Escalate hypotension, falling urine output, new confusion, respiratory distress, rapidly increasing abdominal distention, or shock signs."],
      complications: ["Hypovolemic or distributive shock physiology", "Acute kidney injury", "Pulmonary edema/pleural effusion", "Ascites/abdominal compartment concern", "Skin breakdown", "Poor wound healing"],
      patientEducation: ["Report rapid weight gain, swelling, shortness of breath, dizziness/fainting, abdominal swelling, or much lower urine output."],
      nclexTraps: ["Third spacing means fluid is outside the useful vascular space.", "A third-spaced client may need perfusion support even while visibly edematous.", "Albumin, capillary leak, hydrostatic pressure, and lymph obstruction can each drive the fluid shift."],
      tags: ["third spacing", "fluid shift", "edema", "ascites", "oncotic pressure", "capillary permeability", "hypovolemia", "Starling forces"],
      sourceKeys: ["openstax-fluid-balance", "starling-forces"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Starling forces",
      category: "Fluid balance / microcirculation",
      aliases: ["Starling force", "capillary Starling forces", "Starling principle", "Starling equation", "fluid movement across capillaries"],
      pronunciation: "STAR-ling FOR-siz",
      definition: "Starling forces are the pressures that determine whether fluid moves out of capillaries into tissue or back into the vascular space. The quick frame is hydrostatic pressure pushes fluid out, oncotic pressure pulls fluid in, and capillary permeability plus lymph drainage modify the result.",
      etiology: "Starling-force imbalance appears in heart failure, nephrotic syndrome, liver failure, malnutrition, burns, sepsis, anaphylaxis, pancreatitis, venous obstruction, fluid overload, pregnancy physiology, and inflammation.",
      pathology: "Edema, ascites, pleural effusion, pulmonary edema, and third spacing occur when outward forces or leak exceed inward pull and lymph return. The mechanism matters because edema from high venous pressure is not the same as edema from low albumin or capillary leak.",
      pathophysiology: "Capillary hydrostatic pressure pushes water out; plasma oncotic pressure, mainly albumin, pulls water back in. Interstitial pressure, interstitial oncotic pressure, endothelial permeability, glycocalyx integrity, and lymphatic drainage decide how much fluid stays in tissue.",
      signsSymptoms: ["Peripheral edema, ascites, pleural effusion, pulmonary crackles, rapid weight gain, weeping tissue, low effective circulating volume, hypotension, or low urine output depending on the imbalance."],
      diagnostics: ["Daily weight, intake/output, edema grade, lung sounds, JVD, BP/MAP, urine output, albumin/total protein, renal/liver studies, urine protein, BNP when heart failure is suspected, and imaging for effusions/ascites/DVT when indicated."],
      treatments: ["Treat the dominant mechanism: diuresis/afterload or heart-failure care for high hydrostatic pressure, protein/nutrition/liver/renal treatment for low oncotic pull, source control/anti-inflammatory or shock care for capillary leak, and drainage/compression/lymph strategies when ordered."],
      nursingPriorities: ["Ask which force is abnormal before labeling edema as simple fluid overload.", "Trend perfusion and respiratory status because edema can coexist with intravascular depletion.", "Escalate acute pulmonary edema, shock signs, unilateral painful swelling, or rapidly worsening third spacing."],
      complications: ["Pulmonary edema", "Third spacing", "Hypovolemia despite edema", "Skin breakdown", "Pleural effusion", "Ascites", "Poor wound healing"],
      patientEducation: ["Report sudden swelling, rapid weight gain, shortness of breath, abdominal distention, or much lower urine output."],
      nclexTraps: ["Hydrostatic pushes out; oncotic pulls in.", "Low albumin edema does not mean the client is intravascularly full.", "Capillary leak can create edema and shock at the same time."],
      tags: ["Starling forces", "hydrostatic pressure", "oncotic pressure", "capillary permeability", "edema", "third spacing", "albumin"],
      sourceKeys: ["starling-forces", "openstax-fluid-balance"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Effective circulating volume",
      category: "Fluid balance / perfusion",
      aliases: ["effective arterial blood volume", "EABV", "effective intravascular volume", "effective circulating blood volume", "usable circulating volume"],
      pronunciation: "eh-FEK-tiv SER-kyoo-lay-ting VOL-yoom",
      definition: "Effective circulating volume is the usable arterial blood volume that fills the circulation well enough to maintain organ perfusion. It falls when blood, vascular tone, or pump function cannot deliver forward flow, even if total body water is high.",
      etiology: "It falls with hemorrhage, dehydration, sepsis/vasodilation, anaphylaxis, heart failure low forward flow, cirrhosis/splanchnic pooling, nephrotic syndrome, third spacing, burns, pancreatitis, and aggressive diuresis.",
      pathology: "A client can have edema, ascites, or fluid overload while still having low effective circulating volume because fluid is in tissues/body spaces or the pump/vascular tone is failing. Organs respond as if underfilled: sympathetic tone, RAAS, ADH, thirst, sodium/water retention, and low urine output can increase.",
      pathophysiology: "Baroreceptors and kidneys care about arterial stretch and renal perfusion more than visible swelling. Low effective arterial volume triggers sodium and water retention even when total body fluid is high, which is why cirrhosis, heart failure, and nephrotic syndrome can produce both edema and renal sodium retention.",
      signsSymptoms: ["Tachycardia, hypotension or narrow pulse pressure, dizziness, cool skin, delayed cap refill, altered mentation, low urine output, rising BUN/creatinine, lactate rise, thirst.", "May coexist with edema, ascites, pleural effusion, crackles, or weight gain depending cause."],
      diagnostics: ["BP/MAP, orthostatics when appropriate, HR, urine output, mentation, cap refill, daily weight, intake/output, lactate/perfusion markers, BUN/creatinine, sodium, albumin, edema/ascites/lung assessment, and response to fluid/diuretic/vasopressor therapy."],
      treatments: ["Treat the cause: fluids or blood for true volume loss, vasopressors/source control for distributive shock, heart-failure therapy/diuresis when congested, albumin/paracentesis strategies for selected cirrhosis protocols, and renal/hemodynamic support when perfusion is failing."],
      nursingPriorities: ["Do not use visible edema as proof of good perfusion.", "Trend urine output, mentation, MAP, skin, lactate, lungs, edema, and renal labs together.", "Escalate low urine output, hypotension, new confusion, shock signs, or respiratory distress after fluids."],
      complications: ["Acute kidney injury", "Shock", "Worsening edema/ascites if compensatory retention continues", "Hyponatremia in some low-effective-volume states", "Organ hypoperfusion"],
      patientEducation: ["Report dizziness/fainting, very low urine output, rapid swelling/weight gain, shortness of breath, or confusion."],
      nclexTraps: ["Effective circulating volume is not total body fluid.", "A swollen client can still be intravascularly underfilled.", "Low urine output in heart failure/cirrhosis/nephrotic syndrome may reflect perceived arterial underfilling, not dehydration alone."],
      tags: ["effective circulating volume", "effective arterial blood volume", "third spacing", "edema", "perfusion", "RAAS", "ADH", "renal perfusion"],
      sourceKeys: ["fluid-balance", "starling-forces"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Kussmaul respirations",
      category: "Respiratory pattern / acid-base",
      aliases: ["Kussmaul breathing", "Kussmaul respirations pattern", "deep labored breathing in DKA", "acidotic breathing"],
      pronunciation: "KOOS-mowl RES-pih-RAY-shunz",
      definition: "Kussmaul respirations are deep, labored, often rapid respirations driven by severe metabolic acidosis. The pattern is the body trying to blow off CO2 to compensate for excess acid, classically in diabetic ketoacidosis.",
      etiology: "Diabetic ketoacidosis, lactic acidosis, renal failure/uremia, toxic alcohols, salicylate toxicity later phases, severe sepsis/shock, and other high-anion-gap metabolic acidosis states.",
      pathology: "The medullary respiratory center responds to acidemia by increasing ventilation. Breaths become deep and heavy because lowering PaCO2 can raise pH partially, but breathing harder does not fix the acid source.",
      pathophysiology: "In metabolic acidosis, bicarbonate is low or acid load is high. Hyperventilation lowers carbonic acid by reducing CO2, creating respiratory compensation. If fatigue, altered mental status, or respiratory failure develops, pH can crash quickly.",
      signsSymptoms: ["Deep labored breathing, tachypnea, air hunger, fruity/acetone breath in DKA, dehydration, abdominal pain, nausea/vomiting, altered mentation, hypotension or shock signs depending cause."],
      diagnostics: ["ABG/VBG showing metabolic acidosis with low bicarbonate and low PaCO2 compensation, anion gap, glucose/ketones or beta-hydroxybutyrate for DKA, lactate, renal function, electrolytes especially potassium, toxicology/osmol gap when indicated."],
      treatments: ["Treat the cause: DKA insulin/fluids/potassium protocol, sepsis/shock resuscitation, renal replacement therapy when indicated, toxic ingestion management, and airway/ventilation support if the client cannot sustain compensation."],
      nursingPriorities: ["Recognize Kussmaul breathing as an acidosis danger cue, not anxiety alone.", "Check glucose/ketones, vitals, mental status, hydration, potassium, anion gap, and ABG/VBG context.", "Escalate fatigue, decreasing level of consciousness, hypotension, severe dehydration, or inability to maintain respiratory compensation."],
      complications: ["Respiratory fatigue", "Severe acidemia", "Dysrhythmias from potassium shifts", "Shock", "Cerebral edema risk in pediatric DKA", "Cardiac arrest"],
      patientEducation: ["For diabetes education, teach that deep labored breathing, vomiting, fruity breath, or confusion with high glucose/ketones requires urgent care."],
      nclexTraps: ["Kussmaul respirations are compensation for metabolic acidosis; they are not the primary lung disease.", "Do not slow the breathing with sedatives unless airway/ventilation is being managed.", "In DKA, potassium can fall dangerously after insulin even if the starting serum potassium is normal/high."],
      tags: ["Kussmaul respirations", "metabolic acidosis", "DKA", "anion gap", "respiratory compensation", "acid base"],
      sourceKeys: ["acid-base-compensation", "dka"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Prone positioning",
      category: "Critical care / oxygenation",
      aliases: ["proning", "prone ventilation", "prone position ARDS", "awake proning"],
      pronunciation: "PROHN poh-ZISH-uh-ning",
      definition: "Prone positioning means placing the client face-down to improve oxygenation, especially in moderate to severe ARDS or refractory hypoxemia. It works because dorsal lung units recruit, heart/abdominal weight shifts off dependent lung tissue, and ventilation-perfusion matching often improves.",
      etiology: "It is used when severe hypoxemia persists despite oxygen, PEEP, lung-protective ventilation, or other ordered support. ARDS, COVID-like viral pneumonia, severe pneumonia, and selected ICU hypoxemia scenarios are common contexts.",
      pathology: "In ARDS, much of the posterior lung collapses or fills with inflammatory edema while blood flow remains gravity dependent. Turning prone can open recruitable dorsal alveoli and reduce shunt without simply forcing larger ventilator breaths.",
      pathophysiology: "Proning redistributes transpulmonary pressure, reduces ventral overdistension, recruits dependent dorsal lung, improves secretion drainage, and can lower ventilator-induced lung injury risk when paired with lung-protective ventilation. Oxygenation may improve quickly, but survival benefit depends on correct patient selection, duration, and team execution.",
      signsSymptoms: ["Severe hypoxemia, high oxygen/PEEP requirement, low PaO2/FiO2 ratio, ARDS imaging pattern, ventilator dyssynchrony, or work of breathing when awake proning is attempted."],
      diagnostics: ["PaO2/FiO2 ratio, SpO2 trend, ABG, ventilator settings, chest imaging, hemodynamics, skin/pressure assessment, tube/line position, and sedation/synchrony status."],
      treatments: ["Use ordered prone sessions with a trained team, lung-protective ventilation, eye/skin protection, padding, tube/line security, pressure-injury prevention, secretion management, and hemodynamic monitoring."],
      nursingPriorities: ["Secure airway, lines, drains, feeding tubes, and monitoring before the turn.", "Protect eyes, face, breasts/genitals, bony prominences, and peripheral nerves from pressure injury.", "Watch for accidental extubation, obstruction, vomiting/aspiration, hypotension, dysrhythmia, pressure injury, and inability to tolerate the position."],
      complications: ["Pressure injury", "Facial/airway edema", "Tube or line displacement", "Corneal injury", "Brachial plexus injury", "Aspiration", "Hemodynamic instability"],
      patientEducation: ["Explain that proning is not decorative positioning; it is a lung-recruitment strategy used when oxygen exchange is dangerously impaired."],
      nclexTraps: ["Proning helps oxygenation; it does not replace lung-protective tidal volumes.", "Do not prone an unstable airway casually; airway and line security are priority.", "Improved SpO2 after proning does not mean the ARDS cause is fixed."],
      tags: ["prone positioning", "proning", "ARDS", "refractory hypoxemia", "PaO2 FiO2", "shunt", "PEEP"],
      sourceKeys: ["ards-mechanical-ventilation"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Ketogenesis",
      category: "Metabolism / acid-base",
      aliases: ["ketone production", "ketone-body production", "hepatic ketogenesis", "ketones"],
      pronunciation: "kee-toh-JEN-uh-sis",
      definition: "Ketogenesis is hepatic production of ketone bodies from fatty acids when carbohydrate use is limited or insulin effect is too low. The high-yield danger is diabetic ketoacidosis, where uncontrolled ketone production creates an anion-gap metabolic acidosis.",
      etiology: "Fasting, starvation, very low carbohydrate intake, prolonged exercise, alcohol-related poor intake, pregnancy physiology, type 1 diabetes, missed insulin, infection, myocardial infarction, steroids, SGLT2 inhibitors, and other stress states can push metabolism toward ketone production.",
      pathology: "Low insulin and high glucagon/catecholamines activate lipolysis. The liver converts free fatty acids into acetoacetate and beta-hydroxybutyrate; these acids can overwhelm buffering capacity and lower bicarbonate.",
      pathophysiology: "Ketones are an alternate fuel, not automatically a disease. The problem is rate and context: physiologic fasting ketosis is controlled, while DKA combines ketogenesis with hyperglycemia, osmotic diuresis, dehydration, potassium shifts, and acidemia.",
      signsSymptoms: ["Polyuria, polydipsia, dehydration, nausea/vomiting, abdominal pain, fruity breath, Kussmaul respirations, tachycardia, weakness, confusion, or coma when severe."],
      diagnostics: ["Beta-hydroxybutyrate, anion gap, bicarbonate, pH on VBG/ABG, glucose, potassium, sodium correction, creatinine, urine ketones with caution, infection/stress trigger workup."],
      treatments: ["Treat DKA with ordered fluid, insulin, potassium, electrolyte, trigger, and monitoring protocols. Starvation or alcoholic ketoacidosis management differs and often emphasizes dextrose, thiamine when indicated, fluids, and trigger care."],
      nursingPriorities: ["Connect ketones to acid-base status, hydration, and potassium rather than treating the word ketone in isolation.", "In DKA, verify potassium status before insulin when levels are low because insulin shifts potassium into cells.", "Escalate altered mental status, shock signs, severe acidosis, or pediatric cerebral-edema concern."],
      complications: ["DKA", "Severe metabolic acidosis", "Dysrhythmias from potassium shifts", "Cerebral edema risk in children", "Shock", "Acute kidney injury"],
      patientEducation: ["Teach diabetes clients to check ketones during illness, vomiting, missed insulin, pregnancy risk, or persistently high glucose according to their plan."],
      nclexTraps: ["Ketones are not just a urine finding; beta-hydroxybutyrate is the dominant DKA ketone.", "Do not give insulin in DKA without thinking about potassium.", "Euglycemic DKA can occur, especially with SGLT2 inhibitors."],
      tags: ["ketogenesis", "ketones", "beta-hydroxybutyrate", "DKA", "anion gap", "metabolic acidosis", "insulin"],
      sourceKeys: ["dka", "acid-base-compensation"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Osmotic diuresis",
      category: "Renal / fluid balance",
      aliases: ["solute diuresis", "osmotic polyuria", "glucose diuresis", "mannitol diuresis"],
      pronunciation: "oz-MOT-ik dye-yoo-REE-sis",
      definition: "Osmotic diuresis is excessive urination because unreabsorbed solute holds water inside the renal tubules. The classic clinical picture is hyperglycemia causing glucose-rich urine, polyuria, dehydration, and electrolyte loss in DKA or HHS.",
      etiology: "Hyperglycemia, mannitol, high urea load after catabolism or tube feeding, radiocontrast/solute load, recovery from obstruction or acute tubular injury, and some renal concentrating defects can create solute-driven water loss.",
      pathology: "When filtered solute exceeds reabsorption capacity, water follows the solute into urine instead of returning to circulation. The client can lose liters of water plus sodium, potassium, magnesium, and phosphate.",
      pathophysiology: "Glucose becomes an osmotic particle in the tubule once the proximal transporter capacity is exceeded. This lowers effective circulating volume, stimulates thirst, worsens hyperosmolarity, and can accelerate shock if replacement does not match losses.",
      signsSymptoms: ["Polyuria, polydipsia, nocturia, dehydration, dry mucosa, tachycardia, hypotension, weight loss, weakness, dizziness, high serum osmolality, altered mental status when severe."],
      diagnostics: ["Urine output trend, glucose, urine glucose, serum sodium with correction for hyperglycemia, potassium/magnesium/phosphate, BUN/creatinine, osmolality, anion gap and ketones when DKA is possible."],
      treatments: ["Treat the driver: insulin and fluids for DKA/HHS, stop or adjust osmotic agents when ordered, replace electrolytes, monitor renal function, and correct volume deficits carefully."],
      nursingPriorities: ["Strict intake/output and frequent electrolyte trends matter because water loss can hide until perfusion drops.", "Expect potassium to change rapidly once insulin and fluids begin.", "Escalate hypotension, altered mental status, very high urine output, dysrhythmia, or severe electrolyte abnormality."],
      complications: ["Hypovolemia", "Hyperosmolar state", "Acute kidney injury", "Hypokalemia during treatment", "Dysrhythmias", "Shock"],
      patientEducation: ["Teach that frequent urination with intense thirst, vomiting, high glucose, or ketones can signal dangerous dehydration and needs prompt care."],
      nclexTraps: ["Polyuria in DKA is not kidney wellness; it is solute-driven water loss.", "Corrected sodium matters in severe hyperglycemia.", "A falling glucose during treatment does not mean the fluid/electrolyte problem is finished."],
      tags: ["osmotic diuresis", "polyuria", "hyperglycemia", "DKA", "HHS", "electrolytes", "dehydration"],
      sourceKeys: ["dka", "fluid-balance"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Gluconeogenesis",
      category: "Metabolism / endocrine",
      aliases: ["new glucose production", "hepatic gluconeogenesis", "renal gluconeogenesis"],
      pronunciation: "gloo-koh-nee-oh-JEN-uh-sis",
      definition: "Gluconeogenesis is production of new glucose from non-carbohydrate substrates such as lactate, glycerol, and amino acids. It is a fasting and stress survival pathway, but in diabetes and critical illness it can worsen hyperglycemia.",
      etiology: "Fasting, starvation, prolonged exercise, stress hormones, sepsis, trauma, glucagon excess, cortisol excess, catecholamines, pregnancy needs, and poorly controlled diabetes increase gluconeogenesis.",
      pathology: "The liver and kidney make glucose to protect the brain and red blood cells when dietary glucose is low. When insulin is absent or resistance is high, glucose output continues despite already elevated serum glucose.",
      pathophysiology: "Glucagon, cortisol, epinephrine, and growth hormone promote substrate mobilization and hepatic glucose output. Insulin normally suppresses gluconeogenesis; loss of that brake is a major reason DKA and HHS produce severe hyperglycemia.",
      signsSymptoms: ["The pathway itself has no direct symptom; clinical clues come from hypoglycemia prevention during fasting or hyperglycemia during stress/diabetes.", "Stress hyperglycemia, polyuria, thirst, dehydration, weight loss, or ketone production may appear when dysregulated."],
      diagnostics: ["Glucose trend, A1c context, ketones/anion gap when DKA is possible, cortisol/endocrine testing when indicated, nutrition status, liver/kidney function, lactate when shock or sepsis is present."],
      treatments: ["Treat the clinical context: insulin for diabetes-related excess output, nutrition support for fasting/starvation, sepsis/stress management, steroid review when appropriate, and glucose monitoring during illness."],
      nursingPriorities: ["Teach why glucose can rise even when the client has not eaten.", "Monitor glucose closely during steroids, infection, tube feeds, TPN, and critical illness.", "Escalate hyperglycemia with ketones, dehydration, altered mental status, or high anion gap."],
      complications: ["Stress hyperglycemia", "DKA/HHS contribution", "Catabolic muscle loss", "Electrolyte shifts during treatment", "Poor wound healing from uncontrolled glucose"],
      patientEducation: ["Explain that the liver can release or make glucose during illness, so diabetes sick-day monitoring matters even with poor intake."],
      nclexTraps: ["Not eating does not guarantee low glucose in diabetes.", "Gluconeogenesis creates new glucose; glycogenolysis breaks stored glycogen.", "Steroids can raise glucose partly by increasing hepatic glucose production and insulin resistance."],
      tags: ["gluconeogenesis", "glucose", "fasting", "glucagon", "cortisol", "diabetes", "stress hyperglycemia"],
      sourceKeys: ["diabetes-metabolism"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Glycogenolysis",
      category: "Metabolism / endocrine",
      aliases: ["glycogen breakdown", "hepatic glycogenolysis", "muscle glycogenolysis"],
      pronunciation: "gly-koh-jen-OL-ih-sis",
      definition: "Glycogenolysis is breakdown of stored glycogen into glucose units for rapid energy use. Liver glycogen helps maintain blood glucose; muscle glycogen mainly fuels local muscle work.",
      etiology: "Fasting between meals, exercise, stress, hypoglycemia, epinephrine, glucagon, sepsis/critical illness, and early diabetes decompensation activate glycogen breakdown.",
      pathology: "This is the fast glucose-rescue pathway, but stores are limited. Once glycogen runs low, the body relies more on gluconeogenesis and fat metabolism, which can lead toward ketogenesis in low-insulin states.",
      pathophysiology: "Glucagon primarily signals liver glycogen breakdown, while epinephrine signals liver and muscle. Glucose-6-phosphatase in liver allows free glucose release into blood; muscle lacks meaningful release capacity for systemic glucose.",
      signsSymptoms: ["No direct symptom from the pathway itself.", "Clinical signs relate to hypoglycemia correction, stress hyperglycemia, exercise energy use, or later depletion with fasting/illness."],
      diagnostics: ["Glucose trend, nutrition/fasting history, diabetes medications, liver disease context, exercise/stress context, and ketones when stores are depleted and insulin is low."],
      treatments: ["Treat the scenario: carbohydrate or glucagon for hypoglycemia when appropriate, insulin/fluids for diabetes decompensation, and nutrition support when fasting or catabolism is driving instability."],
      nursingPriorities: ["Distinguish quick glycogen release from slower new glucose production.", "Know that glucagon depends on hepatic glycogen stores and may work poorly after prolonged starvation or severe liver disease.", "Monitor rebound glucose after hypoglycemia treatment."],
      complications: ["Stress hyperglycemia", "Recurrent hypoglycemia if stores are depleted", "Progression to ketogenesis during prolonged fasting or insulin deficiency"],
      patientEducation: ["Teach diabetes clients that exercise and missed meals can change glycogen use and hypoglycemia risk."],
      nclexTraps: ["Glycogenolysis is stored glucose breakdown, not fat breakdown.", "Glucagon is less useful when hepatic glycogen is depleted.", "Muscle glycogen does not directly raise blood glucose for the whole body."],
      tags: ["glycogenolysis", "glycogen", "glucagon", "epinephrine", "hypoglycemia", "exercise", "liver"],
      sourceKeys: ["diabetes-metabolism"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Albuminuria",
      category: "Renal / urine findings",
      aliases: ["urine albumin", "microalbuminuria", "macroalbuminuria", "albumin in urine", "urine albumin-to-creatinine ratio"],
      pronunciation: "al-byoo-min-YOO-ree-uh",
      definition: "Albuminuria is abnormal leakage of albumin into urine, usually signaling glomerular endothelial or filtration-barrier injury. It is a high-yield early marker of diabetic kidney disease, hypertensive kidney damage, preeclampsia risk, and cardiovascular risk.",
      etiology: "Diabetes, hypertension, chronic kidney disease, glomerulonephritis, preeclampsia, obesity, heart failure, fever/exercise transiently, infection, and systemic endothelial injury can increase urinary albumin.",
      pathology: "Albumin is normally mostly retained in blood by glomerular size and charge barriers. When podocytes, basement membrane, or endothelial glycocalyx are injured, albumin crosses into the filtrate.",
      pathophysiology: "Albuminuria is not just a lab nuisance; filtered protein can worsen tubular inflammation and fibrosis. Persistent albuminuria predicts kidney disease progression and vascular risk even before creatinine looks alarming.",
      signsSymptoms: ["Often asymptomatic early.", "Foamy urine, edema, hypertension, declining eGFR, or nephrotic features may appear when protein loss is heavier or kidney disease advances."],
      diagnostics: ["Urine albumin-to-creatinine ratio, repeat confirmation because exercise/fever/UTI can transiently elevate it, urinalysis, eGFR/creatinine, BP trend, diabetes control, pregnancy/preeclampsia evaluation when relevant."],
      treatments: ["Treat the driver: BP and diabetes control, ACE inhibitor or ARB when indicated and safe, SGLT2 inhibitor or kidney-protective therapy when ordered, salt reduction, pregnancy-specific management, and nephrology referral for concerning patterns."],
      nursingPriorities: ["Do not dismiss albuminuria because creatinine is normal.", "Verify repeat testing and assess BP, diabetes, pregnancy symptoms, edema, and nephrotoxin exposure.", "Escalate heavy proteinuria, hematuria, rapidly falling eGFR, severe hypertension, or preeclampsia symptoms."],
      complications: ["Chronic kidney disease progression", "Edema with heavy loss", "Cardiovascular risk", "Nephrotic syndrome pattern", "Preeclampsia complications when pregnant"],
      patientEducation: ["Explain that urine albumin can be an early kidney warning sign before symptoms, so repeat testing and BP/glucose control matter."],
      nclexTraps: ["Microalbuminuria is not tiny importance; it can be early kidney damage.", "Albuminuria is a type of proteinuria, but proteinuria is broader.", "A normal creatinine does not rule out early diabetic kidney disease."],
      tags: ["albuminuria", "microalbuminuria", "proteinuria", "kidney", "diabetes", "hypertension", "preeclampsia", "ACR"],
      sourceKeys: ["kidney-disease-screening"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Proteinuria",
      category: "Renal / urine findings",
      aliases: ["protein in urine", "urinary protein", "foamy urine", "nephrotic proteinuria"],
      pronunciation: "proh-tee-NYOO-ree-uh",
      definition: "Proteinuria is excess protein in urine from glomerular leak, tubular reabsorption failure, overflow proteins, or transient physiologic stress. The first question is whether it is persistent and whether it comes with hematuria, low eGFR, hypertension, edema, or pregnancy danger signs.",
      etiology: "Diabetes, hypertension, glomerulonephritis, nephrotic syndrome, lupus nephritis, preeclampsia, infection, fever, exercise, orthostatic proteinuria, myeloma light chains, tubular injury, and CKD can cause it.",
      pathology: "Glomerular disease leaks albumin and larger proteins; tubular disease fails to reclaim filtered low-molecular-weight proteins; overflow states produce too much abnormal protein for reabsorption. Pattern recognition directs urgency.",
      pathophysiology: "Persistent protein exposure can injure tubules, drive inflammation, and accelerate kidney scarring. Heavy protein loss lowers oncotic pressure and can produce edema, hyperlipidemia, and thrombosis risk in nephrotic syndrome.",
      signsSymptoms: ["Often silent.", "Foamy urine, edema, weight gain, hypertension, hematuria, fatigue, flank symptoms if infection/stone context, or pregnancy headache/vision/RUQ symptoms if preeclampsia."],
      diagnostics: ["Urinalysis, urine protein-to-creatinine ratio or albumin-to-creatinine ratio, microscopy, eGFR/creatinine, BP, diabetes/A1c, pregnancy testing when relevant, complements/autoimmune tests or SPEP/free light chains when indicated."],
      treatments: ["Treat the cause: BP/glucose control, ACE inhibitor/ARB when indicated and safe, kidney-protective diabetes therapy, immunosuppression for selected glomerular disease, preeclampsia management, infection treatment, and nephrology referral for high-risk findings."],
      nursingPriorities: ["Check whether proteinuria is isolated, persistent, heavy, or paired with hematuria/edema/hypertension.", "Pregnancy plus proteinuria requires preeclampsia thinking.", "Escalate nephrotic edema, oliguria, rapidly rising creatinine, severe hypertension, or active urinary sediment."],
      complications: ["CKD progression", "Nephrotic syndrome", "Edema", "Thrombosis risk with severe nephrotic syndrome", "Pregnancy complications", "Cardiovascular risk"],
      patientEducation: ["Teach that foamy urine or swelling should be reported, and that repeat urine testing often matters more than one isolated dipstick."],
      nclexTraps: ["Proteinuria is a finding, not a final diagnosis.", "Do not confuse albumin-specific screening with all protein types.", "Heavy edema plus proteinuria points toward nephrotic physiology and clot risk."],
      tags: ["proteinuria", "albuminuria", "urinalysis", "nephrotic syndrome", "glomerulonephritis", "preeclampsia", "CKD"],
      sourceKeys: ["kidney-disease-screening"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Hemolysis",
      category: "Hematology",
      aliases: ["red blood cell destruction", "hemolytic anemia", "RBC lysis", "intravascular hemolysis", "extravascular hemolysis"],
      pronunciation: "hee-MOL-ih-sis",
      definition: "Hemolysis is premature red blood cell destruction, either inside blood vessels or by macrophages in the spleen/liver. The crash-course pattern is anemia plus reticulocytosis, elevated LDH and indirect bilirubin, low haptoglobin, jaundice, dark urine, or splenomegaly depending mechanism.",
      etiology: "Autoimmune hemolytic anemia, transfusion reaction, G6PD deficiency, sickle cell disease, hereditary spherocytosis, mechanical valves, microangiopathy, DIC, TTP/HUS, malaria, severe burns, toxins, and some drugs can cause hemolysis.",
      pathology: "Intravascular hemolysis releases free hemoglobin into plasma and urine, consuming haptoglobin and risking kidney injury. Extravascular hemolysis occurs when abnormal or antibody-coated RBCs are removed by macrophages, often causing splenomegaly and jaundice.",
      pathophysiology: "The marrow responds by releasing reticulocytes if it has enough iron, folate, and function. Hemolysis becomes dangerous when RBC destruction exceeds production or when free hemoglobin, potassium release, thrombosis, or transfusion reaction physiology injures organs.",
      signsSymptoms: ["Fatigue, pallor, dyspnea, tachycardia, jaundice, dark tea-colored urine, back/flank pain in transfusion reaction, splenomegaly, gallstones, fever or shock signs if acute/severe."],
      diagnostics: ["CBC, reticulocyte count, LDH, indirect bilirubin, haptoglobin, peripheral smear, direct antiglobulin test/Coombs, urinalysis for hemoglobin, potassium/creatinine if severe, and cause-specific testing."],
      treatments: ["Treat the cause: stop incompatible transfusion or offending drug, steroids/immune therapy for autoimmune hemolysis when ordered, folate/support, transfusion when indicated, plasma exchange for TTP, infection/toxin-specific care, and kidney/electrolyte monitoring."],
      nursingPriorities: ["During transfusion, fever, chills, back pain, dyspnea, hypotension, or dark urine is stop-transfusion-and-act territory.", "Trend hemoglobin with bilirubin/LDH/haptoglobin to distinguish bleeding from destruction.", "Escalate shock, acute kidney injury, hyperkalemia, neurologic signs, or suspected TTP/HUS/DIC."],
      complications: ["Severe anemia", "Acute kidney injury", "Hyperkalemia in massive hemolysis", "Gallstones", "Shock in transfusion reaction", "Thrombosis in some hemolytic disorders"],
      patientEducation: ["Teach clients with hemolytic risk to report dark urine, jaundice, severe fatigue, shortness of breath, fever, or new back/abdominal pain."],
      nclexTraps: ["A falling hemoglobin is not always bleeding.", "Low haptoglobin points toward hemolysis.", "Schistocytes suggest mechanical shearing/microangiopathy, not simple iron deficiency."],
      tags: ["hemolysis", "hemolytic anemia", "LDH", "haptoglobin", "bilirubin", "reticulocytes", "schistocytes", "Coombs"],
      sourceKeys: ["hematology-hemolysis"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Schistocytes",
      category: "Hematology / smear findings",
      aliases: ["fragmented red cells", "helmet cells", "RBC fragments", "red cell fragments"],
      pronunciation: "SHIS-toh-sites",
      definition: "Schistocytes are jagged red cell fragments formed when red blood cells are mechanically sheared in circulation. They point to microangiopathic hemolysis from tiny-vessel clotting, fibrin strands, damaged endothelium, or mechanical valve trauma until proven otherwise.",
      etiology: "TTP, HUS, DIC, HELLP syndrome, malignant hypertension, mechanical heart valves, severe burns, vasculitis, and other thrombotic microangiopathies can produce schistocytes.",
      pathology: "RBCs are sliced as they pass through fibrin strands, microthrombi, damaged endothelium, or mechanical valve surfaces. The smear finding links anemia to destruction rather than underproduction.",
      pathophysiology: "Schistocytes often travel with elevated LDH, indirect bilirubin, low haptoglobin, reticulocytosis, thrombocytopenia, kidney injury, neurologic symptoms, or coagulation abnormalities depending on the cause.",
      signsSymptoms: ["Fatigue, pallor, jaundice, dark urine, petechiae/bruising if platelets are low, confusion/headache/seizure in TTP, kidney injury/low urine output in HUS/TMA, bleeding or clotting in DIC."],
      diagnostics: ["Peripheral smear, CBC/platelets, hemolysis labs, creatinine, coagulation studies, fibrinogen/D-dimer for DIC, ADAMTS13 testing when TTP is suspected, stool/Shiga toxin or complement testing when relevant."],
      treatments: ["Treat the emergency cause: urgent plasma exchange for suspected TTP, supportive/renal care for HUS, source control and coagulation support for DIC, delivery for severe HELLP when indicated, and valve/mechanical evaluation when relevant."],
      nursingPriorities: ["Treat schistocytes plus thrombocytopenia/organ injury as urgent, not cosmetic smear trivia.", "Assess neuro status, bleeding, bruising, urine output, BP, infection/sepsis signs, pregnancy status, and renal labs.", "Escalate possible TTP quickly because delay can be fatal."],
      complications: ["Microangiopathic hemolytic anemia", "Acute kidney injury", "Stroke/seizure in TTP", "Bleeding or thrombosis", "Multi-organ dysfunction"],
      patientEducation: ["Explain that fragmented cells are a clue that blood cells are being damaged in circulation and usually require urgent cause-finding."],
      nclexTraps: ["Schistocytes are not normal anemia cells.", "TTP can need treatment before every confirmatory result is back.", "Platelet transfusion is not routine in TTP unless life-threatening bleeding/procedure need is present."],
      tags: ["schistocytes", "microangiopathic hemolysis", "TTP", "HUS", "DIC", "HELLP", "hemolysis", "peripheral smear"],
      sourceKeys: ["hematology-smear"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Coagulopathy",
      category: "Hematology / clotting",
      aliases: ["clotting disorder", "impaired coagulation", "bleeding disorder", "coagulation abnormality"],
      pronunciation: "koh-ag-yoo-LOP-uh-thee",
      definition: "Coagulopathy is abnormal clot formation or clot control, usually presenting as bleeding risk, thrombosis risk, or both. The nurse should immediately ask which part is failing: platelets, coagulation factors, fibrinogen, anticoagulant medication, liver synthesis, vitamin K, or pathologic consumption such as DIC.",
      etiology: "Liver failure, vitamin K deficiency, warfarin/heparin/DOACs, DIC, massive transfusion, sepsis, trauma, obstetric hemorrhage, renal failure platelet dysfunction, thrombocytopenia, inherited factor disorders, and antiphospholipid syndrome can cause coagulopathy.",
      pathology: "Hemostasis requires platelet plug formation, coagulation-factor fibrin generation, and controlled fibrinolysis. Disease or medication can make clots too weak, too strong, or consumed so quickly that bleeding and microthrombosis coexist.",
      pathophysiology: "PT/INR often reflects extrinsic/common factor activity, aPTT reflects intrinsic/common pathway activity, platelet count/function handles primary hemostasis, and fibrinogen/D-dimer help identify consumption and fibrinolysis. No single lab explains every bleeding client.",
      signsSymptoms: ["Easy bruising, petechiae, mucosal bleeding, oozing from lines, heavy menses, GI/GU bleeding, intracranial bleeding signs, wound bleeding, or thrombosis/organ ischemia in mixed states."],
      diagnostics: ["CBC/platelets, PT/INR, aPTT, fibrinogen, D-dimer, liver tests, renal function, medication history, anti-Xa or drug-specific tests when ordered, thromboelastography/ROTEM in some critical settings."],
      treatments: ["Treat the cause and severity: hold/reverse anticoagulants when ordered, vitamin K, PCC/FFP, cryoprecipitate/fibrinogen, platelets, source control for sepsis/DIC, liver/renal support, and bleeding-site control."],
      nursingPriorities: ["Assess bleeding and clotting at the same time.", "Review anticoagulants, antiplatelets, supplements, liver disease, sepsis/trauma/obstetric context, and invasive lines/procedures.", "Escalate neurologic change, severe headache, hypotension, uncontrolled bleeding, black stools, hematuria, or suspected DIC."],
      complications: ["Hemorrhage", "Intracranial bleeding", "DIC", "Microthrombi and organ failure", "Transfusion need", "Thrombosis in mixed disorders"],
      patientEducation: ["Teach anticoagulated clients to report falls, head injury, black stools, vomiting blood, severe headache, hematuria, or uncontrolled bleeding."],
      nclexTraps: ["Coagulopathy is not always bleeding only; DIC can clot and bleed.", "A normal platelet count does not prove normal platelet function.", "INR does not measure every anticoagulant equally."],
      tags: ["coagulopathy", "PT INR", "aPTT", "platelets", "fibrinogen", "DIC", "bleeding", "thrombosis"],
      sourceKeys: ["coagulation"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Fibrinolysis",
      category: "Hematology / clotting",
      aliases: ["clot breakdown", "plasmin fibrinolysis", "fibrin breakdown", "thrombolysis"],
      pronunciation: "fye-brin-OL-ih-sis",
      definition: "Fibrinolysis is enzymatic breakdown of fibrin clots, mainly by plasmin. It is normal clot cleanup, but excessive fibrinolysis can cause bleeding and therapeutic fibrinolysis can intentionally dissolve dangerous clots.",
      etiology: "Normal healing, DIC, trauma-induced coagulopathy, liver disease, thrombolytic drugs such as alteplase/tenecteplase, massive bleeding, obstetric complications, and some hyperfibrinolytic states affect fibrinolysis.",
      pathology: "Plasmin cuts cross-linked fibrin into fragments, including D-dimer when the fibrin was cross-linked. Too little fibrinolysis favors thrombosis; too much makes clots unstable and bleeding harder to control.",
      pathophysiology: "The body balances clot formation with clot removal. Tissue plasminogen activator converts plasminogen to plasmin; inhibitors keep the system from dissolving every clot. DIC can activate both coagulation and fibrinolysis at the same time.",
      signsSymptoms: ["No symptom when physiologic.", "Excess: oozing, mucosal bleeding, wound bleeding, low fibrinogen, high D-dimer. Therapeutic thrombolysis risk: intracranial or major bleeding."],
      diagnostics: ["D-dimer, fibrinogen, PT/INR, aPTT, platelets, hemoglobin, bleeding assessment, thromboelastography/ROTEM when used, and clinical context for clot versus bleeding."],
      treatments: ["Treat the cause. Thrombolytics require strict inclusion/exclusion screening and bleeding monitoring; antifibrinolytics such as tranexamic acid may be ordered in selected bleeding contexts."],
      nursingPriorities: ["Before thrombolysis, verify timing, contraindications, BP, bleeding history, anticoagulants, recent surgery, stroke/head injury, and baseline neuro status.", "After thrombolysis, monitor neuro checks, puncture sites, gums/urine/stool, BP, and sudden headache or deterioration.", "Escalate any major bleeding or neurologic change immediately."],
      complications: ["Major bleeding", "Intracranial hemorrhage", "Persistent thrombosis if inadequate", "DIC-related bleeding/clotting", "Re-occlusion after clot treatment"],
      patientEducation: ["Teach that clot-busting treatment can save tissue but bleeding warning signs need immediate reporting."],
      nclexTraps: ["D-dimer reflects fibrin breakdown, not a diagnosis by itself.", "Thrombolytic drugs are fibrinolytic therapy and require bleeding precautions.", "Fibrinolysis is different from anticoagulation; one breaks fibrin, the other reduces new clot formation."],
      tags: ["fibrinolysis", "plasmin", "D-dimer", "alteplase", "thrombolysis", "tranexamic acid", "DIC"],
      sourceKeys: ["coagulation"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Microthrombi",
      category: "Hematology / microcirculation",
      aliases: ["microvascular thrombi", "small-vessel clots", "microclots", "fibrin microthrombi"],
      pronunciation: "MY-kroh-THROM-bye",
      definition: "Microthrombi are tiny clots in small vessels that can block capillary blood flow and injure organs. The classic high-yield settings are DIC, TTP, HUS, sepsis, HELLP, antiphospholipid syndrome, and severe endothelial injury.",
      etiology: "DIC from sepsis/trauma/obstetric catastrophe, thrombotic microangiopathy, TTP, HUS, malignant hypertension, HELLP syndrome, antiphospholipid syndrome, severe inflammation, malignancy, and some drug/toxin reactions.",
      pathology: "Small-vessel clots consume platelets/factors, shear RBCs into schistocytes, and reduce oxygen delivery to kidney, brain, lung, liver, skin, or gut. Bleeding can coexist because clotting resources are consumed.",
      pathophysiology: "Endothelial activation, tissue factor exposure, platelet aggregation, complement injury, ADAMTS13 deficiency, or inflammatory cytokines can trigger microvascular clotting. The bedside result is organ dysfunction that can look worse than large-vessel imaging suggests.",
      signsSymptoms: ["Petechiae/purpura, bruising, bleeding/oozing in DIC, confusion, headache, seizure, renal injury/oliguria, abdominal pain, dyspnea, jaundice/hemolysis, thrombocytopenia, shock signs depending cause."],
      diagnostics: ["CBC/platelets, smear for schistocytes, LDH/haptoglobin/bilirubin, creatinine/urine output, PT/INR/aPTT, fibrinogen, D-dimer, ADAMTS13 when TTP is suspected, cultures/sepsis workup when relevant."],
      treatments: ["Treat the cause urgently: source control/antibiotics for sepsis DIC, plasma exchange for suspected TTP, renal/supportive care for HUS, delivery/OB management for HELLP, anticoagulation or blood products only when indicated by context."],
      nursingPriorities: ["Connect low platelets plus organ injury plus hemolysis to microthrombi thinking.", "Monitor neuro status, urine output, bleeding, skin changes, labs, and hemodynamics closely.", "Escalate suspected TTP or DIC rapidly because delay changes survival."],
      complications: ["Acute kidney injury", "Stroke/seizure", "Respiratory failure", "DIC bleeding", "Multi-organ failure", "Death if untreated"],
      patientEducation: ["Explain that tiny clots can injure organs even when no large clot is visible to the client."],
      nclexTraps: ["Microthrombi can cause both clotting damage and bleeding.", "Schistocytes are a clue to shearing from microvascular disease.", "Do not wait for every send-out test before escalating possible TTP."],
      tags: ["microthrombi", "DIC", "TTP", "HUS", "schistocytes", "microangiopathy", "sepsis", "HELLP"],
      sourceKeys: ["coagulation", "hematology-smear"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Lactate clearance",
      category: "Perfusion / shock",
      aliases: ["lactate trend", "clearing lactate", "lactate normalization", "serial lactate"],
      pronunciation: "LAK-tayt KLEER-ens",
      definition: "Lactate clearance is the fall in lactate over time after perfusion and oxygen delivery improve. It is a shock-resuscitation trend: improving clearance suggests better tissue perfusion or metabolism, while poor clearance warns that shock, hypoxia, seizures, liver dysfunction, or drug/toxin effects may persist.",
      etiology: "Sepsis, hypovolemia, cardiogenic shock, hypoxemia, seizures, severe work of breathing, beta-agonists, epinephrine, liver dysfunction, toxins, ischemia, and mitochondrial dysfunction can elevate lactate or slow clearance.",
      pathology: "Lactate rises when glycolysis outpaces mitochondrial use or clearance, often during tissue hypoperfusion but not only during anaerobic metabolism. The trend after treatment is often more useful than a single number.",
      pathophysiology: "Restoring circulating volume, cardiac output, hemoglobin/oxygenation, source control, and microcirculatory flow should reduce lactate if the driver is reversible. Liver dysfunction or ongoing catecholamine stimulation can keep lactate high despite some perfusion improvement.",
      signsSymptoms: ["Shock clues: hypotension, tachycardia, cool or mottled skin, altered mentation, low urine output, dyspnea, fever/infection signs, chest pain, abdominal pain, or severe work of breathing."],
      diagnostics: ["Serial lactate with timing, vital signs, MAP, urine output, mental status, cap refill, ABG/VBG context, cultures/infection workup, hemoglobin, oxygenation, cardiac evaluation, liver/kidney function."],
      treatments: ["Treat the cause: fluids/blood, vasopressors, source control/antibiotics, oxygen/ventilation, inotropes, seizure control, ischemia management, and toxin-specific care when relevant."],
      nursingPriorities: ["Trend lactate with the patient, not instead of the patient.", "Report lactate that stays high or rises despite resuscitation.", "Use urine output, mentation, cap refill, MAP, skin, and respiratory effort as parallel perfusion markers."],
      complications: ["Persistent shock", "Multi-organ dysfunction", "Severe metabolic acidosis", "Delayed source control", "Cardiac arrest"],
      patientEducation: ["For families, explain that lactate is a blood marker clinicians trend to see whether tissues are getting enough effective oxygen delivery."],
      nclexTraps: ["Lactate is not synonymous with sepsis, but high lactate in infection is dangerous.", "A normal blood pressure does not guarantee good lactate clearance.", "One lactate value is less useful than the direction after treatment."],
      tags: ["lactate clearance", "lactate", "shock", "sepsis", "perfusion", "oxygen delivery", "resuscitation"],
      sourceKeys: ["shock-resuscitation"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Capillary refill",
      category: "Perfusion / bedside assessment",
      aliases: ["cap refill", "capillary refill time", "CRT", "nailbed refill", "delayed capillary refill", "prolonged capillary refill", "slow capillary refill"],
      pronunciation: "KAP-ih-lair-ee REE-fill",
      definition: "Capillary refill is a bedside estimate of peripheral perfusion by pressing until skin blanches, releasing, and timing return of color. Delayed refill can signal poor perfusion, vasoconstriction, hypovolemia, shock, hypothermia, or local vascular disease, but it must be interpreted with temperature, age, lighting, and site.",
      etiology: "Hypovolemia, sepsis/shock compensation, cardiogenic shock, obstructive shock, hypothermia, vasopressors, peripheral arterial disease, dehydration, pain/stress vasoconstriction, and low cardiac output can prolong refill.",
      pathology: "When peripheral vessels constrict or flow falls, capillary beds refill slowly after blanching. A brisk refill does not rule out shock, especially distributive shock, but a delayed refill is a useful warning sign when paired with other findings.",
      pathophysiology: "Skin perfusion is sacrificed early when the body protects brain and heart. Capillary refill therefore gives a quick view of peripheral microcirculation, sympathetic tone, and effective circulating volume.",
      signsSymptoms: ["Delayed refill, cool/mottled skin, weak pulses, altered mentation, tachycardia, hypotension, narrow pulse pressure, low urine output, dizziness, or rising lactate depending cause."],
      diagnostics: ["Measure centrally or peripherally with consistent pressure/time, compare with skin temperature, pulse quality, BP/MAP, mental status, urine output, lactate, SpO2, and shock context."],
      treatments: ["Treat the perfusion cause: fluids/blood when volume depleted, vasopressors for distributive shock, inotropes for pump failure, warming for hypothermia, source control, oxygenation, or vascular evaluation when local ischemia is suspected."],
      nursingPriorities: ["Use cap refill as one piece of the perfusion picture, not a standalone diagnosis.", "Trend it after fluids, vasopressors, warming, or shock treatment.", "Escalate delayed refill with altered mentation, oliguria, hypotension, mottling, severe pain, or absent pulses."],
      complications: ["Shock progression", "Peripheral ischemia", "Acute kidney injury from poor perfusion", "Delayed recognition if ignored"],
      patientEducation: ["Teach that cold hands can slow refill, so clinicians combine it with pulse, BP, urine, and mental-status checks."],
      nclexTraps: ["Normal cap refill does not rule out sepsis.", "Cold room or nail polish can mislead.", "Delayed refill is more concerning when it comes with low urine output or mental-status change."],
      tags: ["capillary refill", "cap refill", "perfusion", "shock", "microcirculation", "skin assessment", "effective circulating volume"],
      sourceKeys: ["shock-assessment"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Pulse pressure",
      category: "Hemodynamics / vital signs",
      aliases: ["PP", "systolic minus diastolic", "narrow pulse pressure", "narrowed pulse pressure", "low pulse pressure", "wide pulse pressure", "widened pulse pressure", "high pulse pressure"],
      pronunciation: "PULS PRESH-er",
      definition: "Pulse pressure is systolic blood pressure minus diastolic blood pressure. It is a quick bedside clue to stroke volume and arterial compliance: narrow pulse pressure can signal low stroke volume, while wide pulse pressure can signal high stroke volume, low diastolic tone, or stiff arteries.",
      etiology: "Narrow pulse pressure appears with hypovolemia, cardiogenic shock, tamponade, tension pneumothorax, severe aortic stenosis, or low stroke volume. Wide pulse pressure appears with aortic regurgitation, sepsis/vasodilation, fever, anemia, hyperthyroidism, pregnancy physiology, AV fistula, or arterial stiffness.",
      pathology: "Systolic pressure reflects ejected stroke volume and arterial stiffness; diastolic pressure reflects vascular tone and runoff between beats. The gap between them can reveal a hemodynamic pattern before the MAP alone tells the story.",
      pathophysiology: "A falling stroke volume often narrows the pulse pressure as systolic pressure drops toward diastolic pressure. A wide pulse pressure may mean forceful ejection, fast runoff, vasodilation, or noncompliant vessels.",
      signsSymptoms: ["Narrow with shock: weak pulses, cool skin, tachycardia, dizziness, low urine output, altered mentation.", "Wide with bounding pulses, warm skin, widened pressure gap, murmur in aortic regurgitation, fever/sepsis clues, or elderly arterial stiffness."],
      diagnostics: ["Manual/accurate BP, MAP, pulse quality, HR/rhythm, cap refill, urine output, lactate, echo/valve assessment when indicated, infection/thyroid/anemia context."],
      treatments: ["Treat the cause: fluids/blood for volume loss, obstruction relief, inotropes/pressors, valve care, sepsis treatment, fever/anemia/thyroid management, and medication adjustment when indicated."],
      nursingPriorities: ["Calculate the gap, do not just read systolic pressure.", "Pair pulse pressure with pulse quality, skin, mentation, urine output, lungs, and rhythm.", "Escalate new narrow pulse pressure with shock signs or new wide pulse pressure with chest pain, dyspnea, sepsis, or valve symptoms."],
      complications: ["Shock if low stroke volume is missed", "Myocardial strain", "Falls/syncope", "Delayed recognition of aortic regurgitation or distributive shock"],
      patientEducation: ["Explain that clinicians look at the blood-pressure gap because it can reflect how strongly blood is being pumped and how tight or stiff vessels are."],
      nclexTraps: ["A systolic number alone can hide a dangerous narrow pulse pressure.", "Wide pulse pressure is not always good; it may mean aortic regurgitation or sepsis.", "MAP and pulse pressure answer different hemodynamic questions."],
      tags: ["pulse pressure", "systolic", "diastolic", "stroke volume", "arterial compliance", "shock", "aortic regurgitation"],
      sourceKeys: ["hemodynamics"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Pharmacokinetics",
      category: "Pharmacology / core concept",
      aliases: ["PK", "what the body does to the drug", "ADME", "absorption distribution metabolism excretion"],
      pronunciation: "far-muh-koh-kih-NET-iks",
      definition: "Pharmacokinetics is what the body does to a drug over time: absorption, distribution, metabolism, and excretion. It explains onset, peak, duration, half-life, steady state, dose adjustment, toxicity, and why kidney or liver dysfunction can turn a normal dose into a dangerous one.",
      etiology: "PK becomes clinically important when route, age, pregnancy, obesity, edema, kidney disease, liver disease, shock, albumin level, drug interactions, genetics, or critical illness changes drug exposure.",
      pathology: "This is not a disease; it is the movement-and-clearance side of pharmacology. If exposure rises too high, toxicity appears; if exposure is too low, treatment fails.",
      pathophysiology: "Absorption determines how drug enters blood, distribution determines where it goes, metabolism transforms it, and excretion removes it. Clearance and volume of distribution determine half-life and dosing intervals.",
      signsSymptoms: ["Clinical clues of PK problems include unexpected sedation, hypotension, bleeding, arrhythmia, nephrotoxicity, subtherapeutic response, toxicity after renal decline, or withdrawal before the next dose."],
      diagnostics: ["Drug levels when available, creatinine/eGFR, liver tests, albumin, age/weight, route, interacting drugs, timing of last dose, trough/peak/AUC protocols, and symptom response."],
      treatments: ["Adjust route, dose, interval, loading dose, maintenance dose, renal/hepatic dosing, therapeutic drug monitoring, or interacting medications according to ordered protocols."],
      nursingPriorities: ["Ask where the drug goes and how it leaves the body.", "Check renal/hepatic function, timing, route, weight, and interactions before giving high-risk drugs.", "Do not interpret a drug level without knowing when the sample was drawn relative to the dose."],
      complications: ["Drug toxicity", "Treatment failure", "Accumulation in renal/hepatic impairment", "Withdrawal or breakthrough symptoms", "Drug interaction harm"],
      patientEducation: ["Teach that dose timing and lab timing matter because the body handles medicines in changing patterns over time."],
      nclexTraps: ["Pharmacokinetics is body-to-drug; pharmacodynamics is drug-to-body.", "Half-life drives accumulation and time to steady state.", "Renal dosing is not optional for many cleared drugs."],
      tags: ["pharmacokinetics", "PK", "ADME", "half-life", "clearance", "volume of distribution", "steady state", "bioavailability"],
      sourceKeys: ["pharmacology-core"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Pharmacodynamics",
      category: "Pharmacology / core concept",
      aliases: ["what the drug does to the body", "drug response", "receptor effect"],
      pronunciation: "far-muh-koh-dye-NAM-iks",
      definition: "Pharmacodynamics is what a drug does to the body: receptor binding, enzyme inhibition, channel effects, immune effects, physiologic response, and toxicity. It explains why two drugs with similar levels can have different clinical effects.",
      etiology: "Pharmacodynamics matters when receptor sensitivity, age, genetics, tolerance, disease state, electrolyte abnormalities, organ reserve, pregnancy, interactions, or competing agonist/antagonist drugs change response.",
      pathology: "This is the response side of pharmacology, not a disease. A drug can have a normal concentration but excessive effect if the client is more sensitive, or weak effect if receptors/pathways are blocked or downregulated.",
      pathophysiology: "Agonists activate receptors, antagonists block activation, partial agonists produce limited activation, inverse agonists reduce baseline activity, and many drugs act through enzymes, transporters, ion channels, or immune targets rather than classic receptors.",
      signsSymptoms: ["Clues include exaggerated hypotension, respiratory depression, bradycardia, bleeding, QT prolongation, inadequate pain relief, tolerance, withdrawal, paradoxical reaction, or toxicity despite ordinary dosing."],
      diagnostics: ["Clinical effect, vital signs, target symptom response, ECG/labs for effect markers, receptor/pathway-specific monitoring, and drug levels only when they correlate with response."],
      treatments: ["Adjust dose, choose another mechanism, reverse antagonizable effects when indicated, treat toxicity, avoid interacting mechanisms, and monitor pharmacodynamic endpoints such as BP, INR, glucose, pain, rhythm, or sedation score."],
      nursingPriorities: ["Ask what physiologic pathway the drug changes, not just what class it belongs to.", "Monitor the intended effect and the dangerous exaggerated effect.", "Teach clients which symptom means the drug is working and which symptom means stop/call."],
      complications: ["Excess drug effect", "Lack of effect", "Tolerance", "Withdrawal", "Receptor-mediated toxicity", "Dangerous interactions"],
      patientEducation: ["Explain that a medicine is judged by both dose and body response, so monitoring symptoms and safety signs matters."],
      nclexTraps: ["A normal blood level does not guarantee safe effect.", "Antagonist does not mean antidote in every context.", "Drug class names are not enough; mechanism and target tissue explain the effect."],
      tags: ["pharmacodynamics", "receptors", "agonist", "antagonist", "drug effect", "mechanism"],
      sourceKeys: ["pharmacology-core"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Elimination half-life",
      category: "Pharmacology / dosing",
      aliases: ["half-life", "drug half life", "t half", "t1/2"],
      pronunciation: "ee-lim-ih-NAY-shun HAF-lyfe",
      definition: "Elimination half-life is the time it takes drug amount or concentration to fall by about 50 percent during elimination. It predicts dosing interval, accumulation, washout time, and roughly how long it takes to reach steady state.",
      etiology: "Half-life changes with clearance, volume of distribution, kidney/liver function, age, drug interactions, pregnancy, obesity/edema, shock, protein binding, and saturation of metabolism for some drugs.",
      pathology: "This is a dosing concept. A long half-life means the drug persists and accumulates longer; a short half-life means levels fall quickly and missed doses matter sooner.",
      pathophysiology: "For many first-order drugs, about 4 to 5 half-lives reach near steady state and about 4 to 5 half-lives clear most of the drug after stopping. Nonlinear drugs do not always follow this clean rule.",
      signsSymptoms: ["Clinical clues include delayed toxicity, prolonged sedation, breakthrough symptoms before next dose, accumulation after renal decline, or prolonged interaction effects."],
      diagnostics: ["Drug levels when used, dose timing, renal/liver function, age/weight, interacting drugs, symptoms, ECG/labs for toxicity, and time since last dose."],
      treatments: ["Adjust dose interval, loading dose, maintenance dose, monitoring interval, hold time before procedures, or antidote/support when accumulation causes toxicity."],
      nursingPriorities: ["Connect half-life with when to expect effect, toxicity, steady state, and washout.", "For narrow-therapeutic-index drugs, timing of levels matters.", "Do not assume stopping a long half-life drug removes risk immediately."],
      complications: ["Accumulation toxicity", "Withdrawal/breakthrough symptoms", "Delayed adverse effects", "Persistent drug interaction", "Incorrect level interpretation"],
      patientEducation: ["Teach that some medicines remain in the body for days to weeks, so missed doses or stopping can have delayed effects."],
      nclexTraps: ["Half-life is not onset time.", "Four to five half-lives is a useful rule of thumb for steady state and washout.", "Renal failure can lengthen half-life for renally cleared drugs."],
      tags: ["elimination half-life", "half-life", "steady state", "clearance", "dosing interval", "drug accumulation"],
      sourceKeys: ["pharmacology-core"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Steady state",
      category: "Pharmacology / dosing",
      aliases: ["drug steady state", "steady-state concentration", "Css", "plateau concentration"],
      pronunciation: "STED-ee stayt",
      definition: "Steady state is the point where drug input equals drug elimination, producing a predictable average concentration with repeated dosing. For many drugs it takes about 4 to 5 half-lives to get close to steady state.",
      etiology: "Steady-state timing changes with half-life, renal/liver clearance, drug interactions, loading doses, infusion rate, missed doses, adherence, critical illness, and nonlinear metabolism.",
      pathology: "This is a concentration-timing concept. Before steady state, levels may still be rising; after a dose change, the full effect or toxicity may not appear immediately.",
      pathophysiology: "Repeated doses stack until the amount added per interval matches the amount removed. Loading doses can reach target concentration faster, but maintenance dosing still depends on clearance.",
      signsSymptoms: ["Delayed therapeutic effect, delayed toxicity, breakthrough symptoms after missed doses, or unexpected levels before steady state is reached."],
      diagnostics: ["Therapeutic drug monitoring at correct steady-state timing, trough/peak/AUC protocols, renal/liver function, dose history, missed doses, and toxicity/response assessment."],
      treatments: ["Use loading dose when rapid target is needed and ordered, adjust maintenance dose by clearance, wait appropriate time before judging full dose-change effect unless toxicity requires faster action."],
      nursingPriorities: ["Know whether a level is drawn before or after steady state.", "Document exact dose times and blood draw times.", "Warn that dose changes may take several half-lives to fully show."],
      complications: ["Misinterpreted levels", "Premature dose escalation", "Accumulation toxicity", "Subtherapeutic treatment", "Poor adherence interpretation"],
      patientEducation: ["Explain that some medications need several doses before the body reaches a stable level."],
      nclexTraps: ["Steady state is not the first dose effect.", "Loading dose affects time to target; maintenance dose maintains the target.", "Half-life drives time to steady state more than dose size does for first-order drugs."],
      tags: ["steady state", "half-life", "loading dose", "maintenance dose", "therapeutic drug monitoring", "trough"],
      sourceKeys: ["pharmacology-core"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Drug clearance",
      category: "Pharmacology / dosing",
      aliases: ["clearance", "CL", "renal clearance", "hepatic clearance", "drug elimination capacity"],
      pronunciation: "drug KLEER-ens",
      definition: "Drug clearance is the volume of plasma effectively cleared of drug per unit time. It determines maintenance dosing because the ongoing dose must replace what the body removes.",
      etiology: "Clearance changes with kidney function, liver blood flow/enzyme activity, heart failure/shock, age, pregnancy, drug interactions, genetics, dialysis, protein binding, and saturation of elimination pathways.",
      pathology: "Low clearance causes accumulation and toxicity at ordinary doses. High clearance can make levels subtherapeutic, especially in augmented renal clearance during some critical illness states.",
      pathophysiology: "Renal clearance uses filtration, secretion, and reabsorption; hepatic clearance uses blood flow, enzymes, transporters, and bile. Clearance combined with volume of distribution determines half-life.",
      signsSymptoms: ["Toxicity after kidney/liver decline, unexpectedly low drug response, high or low trough levels, prolonged sedation, bleeding, dysrhythmia, nephrotoxicity, or infection not improving despite therapy."],
      diagnostics: ["Creatinine/eGFR or creatinine clearance, liver tests with synthetic function, drug levels/AUC, urine output, dialysis status, interacting drugs, age/weight, and clinical response."],
      treatments: ["Adjust maintenance dose or interval, monitor levels, avoid interactions, change agent if clearance route is unsafe, and coordinate dialysis-related dosing when applicable."],
      nursingPriorities: ["Check renal function before renally cleared or narrow-index drugs.", "Ask whether the dose is for kidney function, not just the diagnosis.", "Document dialysis timing and drug-level timing."],
      complications: ["Accumulation toxicity", "Treatment failure", "Renal or hepatic injury worsening", "Incorrect therapeutic drug monitoring"],
      patientEducation: ["Teach that kidney or liver changes can require dose changes even if the medication name stays the same."],
      nclexTraps: ["Clearance is removal capacity, not volume of distribution.", "Maintenance dose follows clearance; loading dose follows volume of distribution.", "Serum creatinine can look deceptively normal in low-muscle older adults."],
      tags: ["drug clearance", "clearance", "renal dosing", "hepatic metabolism", "maintenance dose", "half-life", "AUC"],
      sourceKeys: ["pharmacology-core"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Volume of distribution",
      category: "Pharmacology / dosing",
      aliases: ["Vd", "apparent volume of distribution", "drug distribution volume"],
      pronunciation: "VOL-yoom of dis-trih-BYOO-shun",
      definition: "Volume of distribution is an apparent volume that relates the amount of drug in the body to the measured plasma concentration. High Vd means much of the drug leaves plasma for tissues; low Vd means it stays mostly in blood/plasma.",
      etiology: "Vd changes with lipophilicity, tissue binding, protein binding, edema, obesity, pregnancy, burns, critical illness, hypoalbuminemia, age, and fluid shifts.",
      pathology: "This is a distribution concept. It predicts loading dose because a drug that distributes widely needs a larger initial amount to reach a target plasma concentration.",
      pathophysiology: "Vd is calculated conceptually as amount in body divided by plasma concentration. It is not a real anatomic space; it tells how diluted the drug appears after tissue binding and distribution.",
      signsSymptoms: ["Clinical clues include delayed redistribution, prolonged sedation for lipophilic drugs, lower plasma levels after large fluid shifts, or toxicity when protein binding changes increase free drug."],
      diagnostics: ["Weight, edema/ascites, albumin, pregnancy/critical illness context, drug levels, timing after dose, and whether levels reflect free or total drug when protein binding matters."],
      treatments: ["Use Vd to plan loading dose when ordered, reassess levels after large fluid shifts, and consider free drug levels for highly protein-bound drugs when available."],
      nursingPriorities: ["Remember loading dose depends heavily on Vd.", "Large edema/ascites or critical illness can change distribution.", "Do not assume a low total level always means low active free drug in hypoalbuminemia."],
      complications: ["Incorrect loading dose", "Delayed effect", "Free-drug toxicity", "Subtherapeutic tissue exposure", "Misread drug levels"],
      patientEducation: ["Explain that body fluid, tissue binding, and protein levels can change how medicine spreads through the body."],
      nclexTraps: ["Vd is apparent, not a literal container.", "Loading dose is driven by Vd; maintenance dose is driven by clearance.", "Low albumin can increase free active drug even when total level looks normal or low."],
      tags: ["volume of distribution", "Vd", "loading dose", "protein binding", "free drug", "distribution", "pharmacokinetics"],
      sourceKeys: ["pharmacology-core"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Bioavailability",
      category: "Pharmacology / absorption",
      aliases: ["F", "oral bioavailability", "systemic availability", "drug bioavailability"],
      pronunciation: "bye-oh-uh-vay-luh-BIL-ih-tee",
      definition: "Bioavailability is the fraction of a dose that reaches systemic circulation unchanged. IV bioavailability is 100 percent; oral bioavailability can fall because of poor absorption, gut metabolism, first-pass liver metabolism, food effects, or transporters.",
      etiology: "Route, formulation, GI motility, vomiting/diarrhea, bariatric surgery, tube feeds, food, antacids/minerals, gut enzymes, liver first-pass metabolism, P-glycoprotein, and drug interactions affect bioavailability.",
      pathology: "This is an exposure concept. Low bioavailability can cause treatment failure if a drug is not absorbed; unexpectedly high bioavailability can cause toxicity when formulation or interactions change.",
      pathophysiology: "For oral drugs, the dose must dissolve, cross gut barriers, survive gut/liver metabolism, and enter systemic blood. Some drugs are intentionally designed as prodrugs to improve this process.",
      signsSymptoms: ["Unexpected weak response to oral therapy, toxicity after formulation change, breakthrough seizures/pain/infection, or GI/tube-feed interaction patterns."],
      diagnostics: ["Medication route/formulation, administration with food or minerals, tube feed timing, GI disease/surgery, liver function, interacting drugs, drug levels when used, and clinical response."],
      treatments: ["Change route, separate interacting foods/minerals/tube feeds, choose a different formulation, adjust dose when appropriate, or use therapeutic drug monitoring for high-risk medications."],
      nursingPriorities: ["Do not assume PO and IV doses are interchangeable.", "Check whether tablets can be crushed and whether tube feeds bind or reduce absorption.", "Watch for route changes that require dose conversion."],
      complications: ["Treatment failure", "Toxicity after route/formulation change", "Subtherapeutic antibiotic or antiseizure levels", "Drug-food interaction harm"],
      patientEducation: ["Teach whether the medicine must be taken with food, away from minerals, or exactly as a special formulation."],
      nclexTraps: ["IV is 100 percent bioavailable; oral is not automatically equivalent.", "First-pass metabolism lowers systemic availability for some oral drugs.", "Extended-release tablets are often unsafe to crush."],
      tags: ["bioavailability", "oral absorption", "first-pass metabolism", "IV", "formulation", "tube feeds", "pharmacokinetics"],
      sourceKeys: ["pharmacology-core"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "First-pass metabolism",
      category: "Pharmacology / absorption",
      aliases: ["first pass effect", "presystemic metabolism", "hepatic first pass", "gut first pass"],
      pronunciation: "first-pass meh-TAB-oh-liz-um",
      definition: "First-pass metabolism is drug metabolism in the gut wall or liver before an oral dose reaches systemic circulation. Strong first-pass effect lowers oral bioavailability and explains why some drugs need non-oral routes or different oral doses.",
      etiology: "CYP enzymes, gut enzymes, hepatic blood flow, liver disease, drug interactions, grapefruit effect for some drugs, genetics, age, and formulation/route influence first-pass metabolism.",
      pathology: "This is a route/exposure concept. A drug swallowed by mouth drains through portal circulation to the liver first, so metabolism can remove much of it before the rest of the body sees it.",
      pathophysiology: "Sublingual, transdermal, inhaled, rectal partial, or parenteral routes can bypass some first-pass metabolism. Liver enzyme inhibition can raise systemic exposure; induction can lower exposure.",
      signsSymptoms: ["Therapeutic failure with low oral exposure, toxicity after enzyme inhibition, stronger effect after switching from oral to IV, or withdrawal/loss of effect after enzyme induction."],
      diagnostics: ["Route, dose conversion, liver function, interacting drugs, grapefruit/herbal use, pharmacogenomic context when available, drug levels when monitored, and clinical response."],
      treatments: ["Use route-specific dosing, avoid interactions, choose alternate route/formulation, monitor effect/toxicity, and educate on food/herbal restrictions for affected drugs."],
      nursingPriorities: ["Check route before comparing doses.", "Ask about grapefruit, St. John's wort, and enzyme-altering drugs when relevant.", "Treat route conversion as a safety moment, especially for opioids, beta blockers, nitrates, and antiseizure/anticoagulant drugs."],
      complications: ["Toxicity after bypassing first pass", "Subtherapeutic oral therapy", "Interaction-related overdose or failure", "Incorrect route conversion"],
      patientEducation: ["Explain that swallowing a medicine sends it through the gut and liver first, so route instructions matter."],
      nclexTraps: ["First pass is before systemic circulation, not kidney excretion.", "Sublingual nitroglycerin works fast partly because it avoids first-pass metabolism.", "Enzyme inducers and inhibitors can change effective exposure without changing the written dose."],
      tags: ["first-pass metabolism", "bioavailability", "oral route", "CYP", "liver", "portal circulation", "route conversion"],
      sourceKeys: ["pharmacology-core"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Therapeutic index",
      category: "Pharmacology / safety",
      aliases: ["therapeutic window", "narrow therapeutic index", "narrow therapeutic window", "safety margin"],
      pronunciation: "thair-uh-PYOO-tik IN-deks",
      definition: "Therapeutic index is the safety margin between an effective dose and a toxic dose. A narrow therapeutic index means small dosing, renal, interaction, or adherence changes can cause toxicity or treatment failure.",
      etiology: "Digoxin, lithium, warfarin, phenytoin, carbamazepine, theophylline, aminoglycosides, tacrolimus/cyclosporine, and many chemotherapy agents are high-yield narrow-index examples.",
      pathology: "This is a medication-safety concept. The closer the effective and toxic concentrations are, the more important exact dosing, monitoring, interactions, and organ function become.",
      pathophysiology: "Small concentration changes can produce large clinical harm because target and off-target effects overlap. Some narrow-index drugs also have nonlinear kinetics or delayed toxicity, making levels and timing crucial.",
      signsSymptoms: ["Drug-specific toxicity: bleeding with warfarin, dysrhythmia/GI/visual changes with digoxin, tremor/confusion with lithium, ataxia/nystagmus with phenytoin, nephro/ototoxicity with aminoglycosides."],
      diagnostics: ["Therapeutic drug levels or INR when used, dose timing, renal/liver function, electrolytes, ECG for some drugs, interacting medications/supplements, adherence, and toxicity symptoms."],
      treatments: ["Dose carefully, monitor levels/effect, hold or adjust for toxicity, reverse when indicated, correct electrolytes, avoid interactions, and educate on consistent administration."],
      nursingPriorities: ["Treat narrow-index drugs as high-alert learning moments.", "Verify dose, timing, labs, renal function, and interactions before administration.", "Teach exact toxicity symptoms for the specific drug."],
      complications: ["Life-threatening toxicity", "Treatment failure", "Bleeding", "Dysrhythmias", "Seizures", "Organ injury"],
      patientEducation: ["Teach clients not to double doses, skip monitoring, start interacting supplements, or ignore early toxicity signs."],
      nclexTraps: ["Therapeutic window is not a comfort phrase; it means safety margin.", "Narrow-index drugs need timing discipline for labs.", "Normal dose does not mean safe dose when kidney function or interactions change."],
      tags: ["therapeutic index", "therapeutic window", "narrow therapeutic index", "digoxin", "warfarin", "lithium", "aminoglycosides"],
      sourceKeys: ["pharmacology-core"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Loading dose",
      category: "Pharmacology / dosing",
      aliases: ["load dose", "initial loading dose", "bolus loading dose"],
      pronunciation: "LOH-ding dohs",
      definition: "A loading dose is a larger initial dose used to reach a target concentration quickly. It is based mainly on volume of distribution, not on drug clearance.",
      etiology: "Loading doses are used when waiting 4 to 5 half-lives for steady state would be too slow, such as urgent antiarrhythmic, antimicrobial, anticonvulsant, anticoagulant, or critical-care therapy contexts.",
      pathology: "This is a dosing strategy. Without a loading dose, long half-life drugs may take days to become therapeutic; with an excessive loading dose, toxicity can occur before maintenance dosing even begins.",
      pathophysiology: "Loading dose conceptually equals target concentration times volume of distribution divided by bioavailability. Maintenance dose then replaces drug cleared over time.",
      signsSymptoms: ["Too low: delayed response or persistent symptoms.", "Too high: acute toxicity such as hypotension, dysrhythmia, CNS depression, infusion reaction, or drug-specific adverse effects."],
      diagnostics: ["Weight, Vd context, route/bioavailability, renal/liver function for later maintenance, drug levels when available, timing, and immediate clinical response/toxicity monitoring."],
      treatments: ["Use ordered loading protocols, infusion rates, monitoring, and follow-up maintenance dosing. Adjust for route, weight, and drug-specific safety rules."],
      nursingPriorities: ["Do not confuse loading dose with maintenance dose.", "Monitor closely during and after loading because concentration rises quickly.", "Verify weight, route, rate, allergies, baseline labs, ECG/vitals, and drug-level timing when required."],
      complications: ["Acute toxicity", "Infusion reaction", "Delayed therapeutic effect if omitted", "Incorrect maintenance transition", "Drug-level misinterpretation"],
      patientEducation: ["Explain that the first dose may be larger to get the medicine working faster, then later doses may be smaller to maintain the level."],
      nclexTraps: ["Loading dose is mainly Vd-based; maintenance dose is clearance-based.", "A long half-life drug can need a loading dose if rapid effect matters.", "Do not keep giving loading doses as maintenance."],
      tags: ["loading dose", "volume of distribution", "steady state", "maintenance dose", "bioavailability", "therapeutic drug monitoring"],
      sourceKeys: ["pharmacology-core"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Minimum inhibitory concentration",
      category: "Infectious disease / antibiotic pharmacology",
      aliases: ["MIC", "m i c", "minimum inhibitory concentration MIC", "antibiotic MIC"],
      pronunciation: "MIN-ih-mum in-HIB-ih-tor-ee kon-sen-TRAY-shun",
      definition: "Minimum inhibitory concentration is the lowest antibiotic concentration that visibly inhibits growth of a specific organism in the lab. It helps decide whether an organism is susceptible, intermediate, or resistant to a drug at achievable body concentrations.",
      etiology: "MIC is used in culture-and-susceptibility testing for bacterial and fungal infections, especially serious infections, resistant organisms, bacteremia, pneumonia, UTI, bone/joint infection, and stewardship decisions.",
      pathology: "MIC is not a patient symptom; it is an organism-drug measurement. A low MIC usually means less drug is needed to inhibit that organism, but site penetration, dosing, immune status, and PK/PD target still decide success.",
      pathophysiology: "Antibiotic effect depends on exposure compared with MIC: time above MIC for beta-lactams, peak/MIC for aminoglycosides, and AUC/MIC for vancomycin and fluoroquinolones are common anchors.",
      signsSymptoms: ["Persistent fever, leukocytosis, worsening infection, bacteremia, or lack of clinical response may raise concern that current exposure is not adequate despite lab susceptibility."],
      diagnostics: ["Culture and susceptibility report, MIC value and interpretation, infection site, renal function, source control, drug levels/AUC when used, organism burden, immune status, and local resistance pattern."],
      treatments: ["Choose and dose antibiotics using susceptibility, site, severity, PK/PD target, renal/hepatic function, source control, and stewardship guidance. Do not choose by MIC alone when tissue penetration is poor."],
      nursingPriorities: ["Understand MIC as a lab anchor for antibiotic choice, not as a dose by itself.", "Verify cultures were collected before antibiotics when possible and ordered.", "Monitor clinical response, renal dosing, levels when needed, and adverse effects."],
      complications: ["Treatment failure", "Resistance selection", "Toxicity from over-escalation", "Sepsis progression", "Poor source control mistaken for drug failure"],
      patientEducation: ["Explain that culture testing helps match the germ to an antibiotic likely to work at safe body levels."],
      nclexTraps: ["Susceptible does not guarantee cure without source control.", "MIC is organism-drug specific, not a universal antibiotic strength score.", "Do not compare MICs across different drugs without breakpoint context."],
      tags: ["minimum inhibitory concentration", "MIC", "susceptibility", "antibiotic", "PK PD", "time above MIC", "AUC MIC"],
      sourceKeys: ["antibiotic-pharmacology"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Time-dependent killing",
      category: "Infectious disease / antibiotic pharmacology",
      aliases: ["time dependent killing", "time above MIC", "T greater than MIC", "beta-lactam killing"],
      pronunciation: "time-dee-PEN-dent KIL-ing",
      definition: "Time-dependent killing means antibiotic success depends mainly on how long drug concentration stays above the organism's MIC. Beta-lactams are the classic group, so dose timing and infusion strategy matter more than a huge peak.",
      etiology: "Penicillins, cephalosporins, carbapenems, and many other beta-lactams show time-dependent activity; some agents use related exposure targets depending organism and infection site.",
      pathology: "This is an antibiotic-effect pattern. Letting concentrations fall below MIC for too long can reduce bacterial killing even when each individual dose looks correct.",
      pathophysiology: "Cell-wall active beta-lactams work best when bacteria are repeatedly exposed during growth. Extended or continuous infusions may be used in selected severe infections to maximize time above MIC while managing toxicity.",
      signsSymptoms: ["Clinical concern appears as persistent fever, worsening infection, positive repeat cultures, or failure to improve when dosing, source control, or organism susceptibility is inadequate."],
      diagnostics: ["Culture/MIC, renal function, dosing interval adherence, infusion time, infection severity/site, beta-lactam allergy history, response trend, and drug levels in specialized settings."],
      treatments: ["Give doses on schedule, use ordered extended infusion when prescribed, adjust for renal function and severity, and pair antibiotic exposure with source control."],
      nursingPriorities: ["On-time beta-lactam administration matters.", "Do not casually delay scheduled antibiotics in sepsis or serious infection.", "Monitor renal changes because dose interval affects time above MIC and toxicity."],
      complications: ["Treatment failure", "Resistance selection", "Sepsis progression", "Toxicity if renal adjustment is missed"],
      patientEducation: ["Teach clients to complete timed antibiotic schedules as prescribed because spacing can affect bacterial killing."],
      nclexTraps: ["Time-dependent does not mean give whenever during the day.", "A bigger peak is not the main beta-lactam goal.", "Source control still matters even with perfect timing."],
      tags: ["time-dependent killing", "time above MIC", "beta-lactam", "penicillin", "cephalosporin", "carbapenem", "antibiotic timing"],
      sourceKeys: ["antibiotic-pharmacology"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Concentration-dependent killing",
      category: "Infectious disease / antibiotic pharmacology",
      aliases: ["concentration dependent killing", "peak dependent killing", "Cmax MIC", "peak to MIC"],
      pronunciation: "kon-sen-TRAY-shun-dee-PEN-dent KIL-ing",
      definition: "Concentration-dependent killing means bacterial killing improves as antibiotic peak concentration rises relative to the organism's MIC. Aminoglycosides are the classic example, which is why high peak and toxicity monitoring matter.",
      etiology: "Aminoglycosides and fluoroquinolones are high-yield concentration-dependent or exposure-dependent examples, though each class has its own PK/PD target and toxicity profile.",
      pathology: "This is an antibiotic-effect pattern. Too low a peak may under-treat serious infection; excessive exposure can injure kidneys, ears, tendons, nerves, QT conduction, or glucose control depending drug.",
      pathophysiology: "Aminoglycosides use peak/MIC plus post-antibiotic effect, allowing extended-interval dosing in many protocols. Fluoroquinolones often use AUC/MIC exposure targets and carry important boxed-warning safety limits.",
      signsSymptoms: ["Persistent infection if exposure is low.", "Toxicity signs include tinnitus, vertigo, hearing changes, rising creatinine with aminoglycosides; tendon pain, neuropathy, CNS effects, dysglycemia, or palpitations with fluoroquinolones."],
      diagnostics: ["Culture/MIC, peak/trough or AUC protocol, creatinine/urine output, hearing/vestibular assessment, QT/electrolytes for fluoroquinolones when relevant, infection response."],
      treatments: ["Use ordered dosing protocols, therapeutic drug monitoring, renal adjustment, avoidance of nephrotoxic/ototoxic combinations when possible, and source control."],
      nursingPriorities: ["Know which antibiotics need levels and what timing the level requires.", "Ask about hearing, tinnitus, vertigo, tendon pain, neuropathy, glucose symptoms, and renal changes.", "Do not hold or redraw levels without clarifying timing and protocol."],
      complications: ["Nephrotoxicity", "Ototoxicity", "Treatment failure", "Resistance", "Fluoroquinolone serious adverse effects"],
      patientEducation: ["Teach clients to report hearing changes, dizziness/vertigo, tendon pain, numbness/tingling, palpitations, severe diarrhea, or low/high glucose symptoms."],
      nclexTraps: ["Concentration-dependent does not mean unlimited dose.", "Aminoglycoside level timing is protocol-specific.", "Once-daily aminoglycoside dosing uses peak killing and post-antibiotic effect."],
      tags: ["concentration-dependent killing", "aminoglycoside", "fluoroquinolone", "peak MIC", "AUC MIC", "post-antibiotic effect", "ototoxicity"],
      sourceKeys: ["antibiotic-pharmacology"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "PTSD",
      category: "Psychiatric",
      aliases: ["post-traumatic stress disorder", "posttraumatic stress disorder", "trauma-related PTSD"],
      pronunciation: "pee-tee-es-DEE",
      definition: "PTSD is a trauma- and stressor-related disorder where a past traumatic event continues to trigger intrusive re-experiencing, avoidance, negative mood/cognition changes, and hyperarousal after the immediate danger is over.",
      etiology: "PTSD can follow exposure to actual or threatened death, serious injury, sexual violence, combat, assault, disaster, severe accident, abuse, or repeated trauma exposure. Risk is shaped by trauma severity, prior trauma, childhood adversity, limited support, ongoing danger, comorbid depression/anxiety/substance use, sleep disruption, and biologic stress-system vulnerability.",
      pathology: "The brain keeps treating trauma-linked cues as current threat. Amygdala-driven salience, noradrenergic arousal, impaired contextual memory processing, sleep disturbance, and weaker prefrontal regulation can make reminders trigger flashbacks, nightmares, startle, irritability, avoidance, guilt, shame, and emotional numbing.",
      pathophysiology: "PTSD is not simple fear or poor coping. It reflects persistent threat-learning physiology: the nervous system pairs sensory cues, body sensations, places, smells, sounds, or relationships with danger, while avoidance temporarily lowers distress but prevents new safety learning. Hypervigilance and insomnia then keep the stress response rehearsed.",
      riskFactors: [
        "Severe, repeated, interpersonal, childhood, combat, sexual, or life-threatening trauma.",
        "Prior PTSD, anxiety, depression, substance use disorder, traumatic brain injury, chronic pain, or limited social support.",
        "Ongoing threat, unsafe housing, intimate partner violence, moral injury, grief, or lack of control during/after the trauma.",
        "Occupational repeated exposure such as military, EMS, emergency, ICU, forensic, or disaster work."
      ],
      signsSymptoms: [
        "Intrusion: unwanted memories, flashbacks, nightmares, physiologic distress or panic when reminded of the trauma.",
        "Avoidance: avoiding thoughts, feelings, places, conversations, people, news, smells, sounds, procedures, or situations linked to the trauma.",
        "Negative mood/cognition: guilt, shame, distorted blame, emotional numbing, detachment, inability to feel safe, memory gaps, loss of interest, or persistent negative beliefs.",
        "Hyperarousal: insomnia, irritability, anger, exaggerated startle, hypervigilance, poor concentration, reckless behavior, or panic-like autonomic surges.",
        "Safety concerns: suicidal ideation, self-harm, substance misuse, dissociation, aggression risk in acute states, or inability to function."
      ],
      diagnostics: [
        "Assess trauma exposure, symptom clusters, duration, functional impairment, sleep, dissociation, triggers, and avoidance pattern.",
        "Screen immediate safety every time it is relevant: suicide, self-harm, homicide risk, abuse, weapons, intoxication/withdrawal, psychosis, and safe housing.",
        "Differentiate acute stress disorder when symptoms are 3 days to 1 month after trauma; PTSD is generally considered when symptoms persist beyond 1 month with impairment.",
        "Review medical mimics and amplifiers: TBI, pain, thyroid disease, substance intoxication/withdrawal, medication effects, panic disorder, depression, psychosis, and delirium."
      ],
      treatments: [
        "Trauma-focused psychotherapy is central when the client is ready and safe enough: prolonged exposure, cognitive processing therapy, trauma-focused CBT, EMDR, or other evidence-based approaches.",
        "SSRIs or SNRIs may be used for PTSD symptoms, depression, and anxiety when ordered; monitor activation, suicidality risk early in therapy, adherence, and adverse effects.",
        "Prazosin may be used for trauma-related nightmares in selected clients; orthostatic hypotension and first-dose syncope are the nursing watch points.",
        "Stabilize safety, sleep, substance use, pain, housing, and crisis needs before pushing detailed trauma processing.",
        "Use grounding, breathing, orientation, predictable communication, and consent-based care during procedures that could trigger trauma responses."
      ],
      nursingPriorities: [
        "Start with safety and control: ask permission before touch, explain steps, offer choices, and avoid surprise stimulation when possible.",
        "Use calm, validating, nonjudgmental communication; do not force the client to retell trauma details during routine nursing care.",
        "Identify triggers and grounding strategies: orient to date/place, name objects in the room, slow breathing, feet on floor, sensory anchors, and support person when appropriate.",
        "Monitor for sleep deprivation, substance use, worsening depression, suicidal ideation, medication adverse effects, and withdrawal from care.",
        "Escalate if the client has intent/plan/means for self-harm or harm to others, severe dissociation, psychosis, unsafe environment, or inability to maintain basic safety."
      ],
      complications: [
        "Major depression",
        "Substance use disorder",
        "Suicidal ideation or self-harm",
        "Insomnia and nightmares",
        "Chronic pain and somatic symptoms",
        "Relationship and occupational impairment",
        "Panic symptoms, dissociation, or functional decline"
      ],
      redFlags: [
        "Suicidal thoughts with plan, intent, means, prior attempt, intoxication, or inability to agree to safety.",
        "Homicidal ideation, weapon access, escalating agitation, paranoia, or command hallucinations.",
        "Dissociation with unsafe behavior, severe insomnia, inability to eat/sleep/function, or active abuse/unsafe home situation.",
        "New confusion, fever, hypoxia, head injury, withdrawal, or medication toxicity that could be delirium rather than PTSD alone."
      ],
      patientEducation: [
        "PTSD symptoms are treatable trauma-response patterns; having symptoms does not mean weakness or failure.",
        "Avoidance can feel protective short term but often keeps the fear network alive; treatment helps the brain relearn safety gradually.",
        "Seek urgent help for suicidal thoughts, unsafe impulses, severe substance use, inability to sleep for days, or feeling detached from reality.",
        "Tell nurses and clinicians about known triggers so care can be explained, paced, and made more predictable."
      ],
      nclexTraps: [
        "Do not force detailed trauma disclosure as a nursing intervention.",
        "Do not give false reassurance such as 'you are safe now' if the client's body is reacting; orient, validate, and ground.",
        "Safety comes before insight-oriented discussion.",
        "PTSD can coexist with depression, substance use, pain, TBI, and intimate partner violence; screen broadly."
      ],
      sourceKeys: ["nimh-ptsd", "va-national-center-ptsd"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Substance use disorders",
      category: "Psychiatric",
      aliases: ["SUD", "substance use disorder", "addiction", "drug use disorder", "alcohol use disorder", "opioid use disorder"],
      pronunciation: "SUB-stans YOOS dis-OR-derz",
      definition: "Substance use disorders are clinically significant patterns of alcohol, medication, or drug use where reward, craving, impaired control, risky use, and continued use despite harm begin to override health, roles, and safety.",
      etiology: "Risk reflects substance exposure plus vulnerability: genetics, adolescent exposure, trauma, chronic pain, mental illness, peer/environmental availability, homelessness, stigma, high-potency substances, and repeated reinforcement of intoxication or withdrawal relief.",
      pathology: "Repeated rewarding or withdrawal-relieving substance use can reshape mesolimbic reward, stress, memory, and prefrontal control circuits. Cues, craving, tolerance, withdrawal, and habit learning can drive continued use even when the person understands the harm.",
      pathophysiology: "The substance and pattern matter. Opioids can cause fatal respiratory depression; alcohol and benzodiazepine withdrawal can cause seizures and delirium tremens; stimulants can cause dysrhythmia, hyperthermia, psychosis, or stroke; IV use raises endocarditis, HIV, hepatitis, and abscess risk.",
      riskFactors: [
        "Family history, early adolescent use, trauma/adverse childhood experiences, PTSD, depression, anxiety, bipolar disorder, ADHD, psychosis, or chronic pain.",
        "High-dose or long-term opioid, benzodiazepine, stimulant, alcohol, nicotine, cannabis, or sedative exposure.",
        "Unstable housing, incarceration history, poverty, stigma, limited treatment access, peer exposure, intimate partner violence, or unsafe supply.",
        "Prior overdose, polysubstance use, using alone, reduced tolerance after abstinence, or fentanyl contamination."
      ],
      signsSymptoms: [
        "Impaired control: using more than intended, unsuccessful cut-down attempts, craving, or spending much time obtaining/using/recovering.",
        "Social impairment: missed work/school/home obligations, relationship conflict, isolation, or giving up important activities.",
        "Risky use: use while driving/working/parenting unsafely, continued use despite physical or psychological harm, unsafe injection, or mixing sedatives.",
        "Pharmacologic clues: tolerance or withdrawal for some substances; remember tolerance/withdrawal from appropriately prescribed therapy alone does not automatically equal SUD.",
        "Acute danger signs: respiratory depression, severe intoxication, psychosis, chest pain, hyperthermia, seizure, delirium, suicidal ideation, or withdrawal instability."
      ],
      diagnostics: [
        "Use a nonjudgmental substance history: substance, route, amount, frequency, last use, withdrawal history, overdose history, treatment history, pregnancy status, pain, mental health, and safety.",
        "Screen for suicide, violence, psychosis, withdrawal severity, intoxication, pregnancy, infectious risk, trauma, and ability to safely leave.",
        "Use validated tools when available, such as AUDIT-C/AUDIT, DAST, CAGE-AID, CIWA-Ar, COWS, PHQ-9, GAD-7, or facility protocols.",
        "Labs/tests are supportive, not the diagnosis: urine toxicology, blood alcohol level, CMP, CBC, glucose, pregnancy test, ECG, CK, acetaminophen/salicylate levels, hepatitis/HIV testing, or cultures based on presentation."
      ],
      treatments: [
        "Treat immediate instability first: airway/ventilation, naloxone for opioid overdose, glucose/thiamine when indicated, cooling, fluids, seizure control, ECG monitoring, or poison control consultation.",
        "Manage withdrawal with evidence-based protocols: benzodiazepines/phenobarbital pathways for alcohol withdrawal when ordered, buprenorphine or methadone pathways for opioid use disorder, and supportive/stimulant-specific care as appropriate.",
        "Medication treatment can be disease-changing: buprenorphine, methadone, or naltrexone for opioid use disorder; naltrexone, acamprosate, or disulfiram for alcohol use disorder when appropriate.",
        "Behavioral treatment, motivational interviewing, contingency management, CBT, peer recovery support, harm reduction, and treatment linkage reduce relapse and death risk.",
        "Harm reduction includes naloxone access, safer-use counseling, fentanyl/xylazine awareness, sterile equipment access where legal, infection screening, contraception/pregnancy care, and avoiding use alone."
      ],
      nursingPriorities: [
        "Use person-first, nonstigmatizing language; shame makes disclosure and treatment linkage worse.",
        "Assess withdrawal and overdose risk before discharge: last use, tolerance drop, polysubstance sedatives, using alone, prior overdose, seizure/DT history, and access to naloxone.",
        "Do not withhold pain or anxiety assessment because of SUD history; undertreated symptoms can worsen unsafe use and mistrust.",
        "Teach overdose response: call emergency services, give naloxone for suspected opioid overdose, support breathing, and stay with the person.",
        "Link to treatment before discharge whenever possible; a warm handoff is stronger than a list of phone numbers."
      ],
      complications: [
        "Overdose and respiratory arrest",
        "Alcohol or sedative withdrawal seizure/delirium tremens",
        "Endocarditis, abscess, HIV, hepatitis B/C, and sepsis with injection exposure",
        "Trauma, motor vehicle injury, aspiration, rhabdomyolysis, dysrhythmia, stroke, or hyperthermia depending on substance",
        "Pregnancy/neonatal complications",
        "Suicide, depression, homelessness, incarceration, relationship loss, and functional decline"
      ],
      redFlags: [
        "Slow or absent breathing, cyanosis, pinpoint pupils, unresponsiveness, or recurrent sedation after naloxone.",
        "Alcohol/benzodiazepine withdrawal with seizure, delirium, hallucinations, severe autonomic instability, or prior DT history.",
        "Chest pain, severe headache, hyperthermia, agitation, psychosis, or neurologic deficit after stimulant use.",
        "Pregnancy with withdrawal/intoxication, suicidal ideation, unsafe home, or inability to care for dependents.",
        "Fever, new murmur, back pain, neurologic signs, or embolic lesions in a person who injects substances."
      ],
      patientEducation: [
        "SUD is treatable and relapse risk does not mean treatment failed; it means the plan needs support and adjustment.",
        "Do not mix opioids, benzodiazepines, alcohol, or other sedatives because respiratory depression risk stacks.",
        "Keep naloxone available if opioids are possible, including counterfeit pills or unknown street supply.",
        "Seek medical help for severe withdrawal, pregnancy, overdose, chest pain, seizure, suicidal thoughts, or fever after injection use."
      ],
      nclexTraps: [
        "Tolerance and withdrawal alone can occur with prescribed therapy; SUD requires a harmful pattern with impaired control, risk, or impairment.",
        "Alcohol and benzodiazepine withdrawal can kill; opioid withdrawal is miserable but overdose respiratory depression is the immediate killer.",
        "Do not lecture an intoxicated or withdrawing client; stabilize, assess, then teach when the brain can receive it.",
        "A positive toxicology screen does not explain every symptom; still assess sepsis, trauma, hypoglycemia, stroke, pregnancy, and overdose."
      ],
      sourceKeys: ["samhsa-substance-use", "nida-addiction-science"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "SIDS",
      category: "OB/Peds",
      aliases: ["sudden infant death syndrome", "sudden unexplained infant death", "SUID", "sleep-related infant death"],
      pronunciation: "sids",
      definition: "SIDS is the sudden unexplained death of an infant younger than 1 year, usually during sleep, that remains unexplained after a complete investigation.",
      etiology: "The exact cause is not fully known. Teaching uses a risk-reduction model: a vulnerable infant, a critical developmental period, and an external sleep stressor can overlap; modifiable risks include prone/side sleep, soft bedding, overheating, smoke exposure, bed-sharing hazards, and unsafe sleep surfaces.",
      pathology: "There are often no warning symptoms. Suspected mechanisms include impaired arousal, autonomic or cardiorespiratory vulnerability, rebreathing/airway obstruction risk in unsafe sleep environments, and reduced ability to recover from oxygen or carbon dioxide stress during sleep.",
      pathophysiology: "Prevention works by reducing external stressors the infant may not be able to escape: supine sleep keeps the airway safer, a firm flat surface reduces suffocation/rebreathing risk, no soft bedding reduces obstruction, and smoke avoidance reduces respiratory/autonomic vulnerability.",
      riskFactors: [
        "Prone or side sleeping instead of supine sleeping.",
        "Soft bedding, pillows, blankets, bumper pads, stuffed toys, inclined sleepers, couches, adult beds, or other unsafe sleep surfaces.",
        "Bed-sharing hazards, overheating, head covering, tobacco/nicotine exposure, alcohol or drug exposure, prematurity, low birth weight, and young infant age.",
        "Lack of prenatal care, missed well-child visits, or limited caregiver access to a safe crib/bassinet."
      ],
      signsSymptoms: [
        "No warning symptoms by definition; the infant is found unresponsive, often during sleep.",
        "Prevention questions focus on sleep environment and caregiver teaching rather than symptom recognition."
      ],
      diagnostics: [
        "SIDS is a diagnosis after investigation, not a bedside diagnosis made from appearance alone.",
        "Post-event evaluation may include scene investigation, autopsy, review of medical history, infection/metabolic/cardiac assessment, and exclusion of accidental suffocation, abuse, trauma, or known disease.",
        "For a live infant with apnea, cyanosis, poor tone, abnormal breathing, fever, seizure, or poor perfusion, assess and stabilize as an emergency rather than labeling it SIDS."
      ],
      treatments: [
        "Prevention is the main nursing intervention: supine sleep for every sleep, firm flat approved surface, fitted sheet only, no soft objects or loose bedding, avoid overheating, and room-share without bed-sharing.",
        "Promote smoke/nicotine avoidance during pregnancy and around the infant, breastfeeding when possible, recommended immunizations, well-child visits, and pacifier use at sleep once feeding is established when appropriate.",
        "After a death, support emergency response, preserve investigation needs per policy, provide compassionate family care, and connect grief/bereavement resources."
      ],
      nursingPriorities: [
        "Teach and model safe sleep before discharge and during every infant encounter; place the baby supine in the crib, not in a swing, couch, car seat, or adult bed for routine sleep.",
        "Use teach-back: ask the caregiver to describe where and how the baby will sleep tonight.",
        "Screen for barriers: no crib, crowded housing, caregiver exhaustion, smoking, cultural practices, or misinformation about choking risk.",
        "Correct myths calmly: back sleeping does not increase choking risk in healthy infants; home apnea monitors do not replace safe sleep."
      ],
      complications: [
        "Infant death",
        "Family grief, trauma, guilt, depression, anxiety, PTSD symptoms, and need for bereavement support",
        "Investigation-related distress for caregivers"
      ],
      redFlags: [
        "Any unresponsive infant requires emergency response and resuscitation according to protocol.",
        "Apnea, cyanosis, seizure, fever, poor feeding, lethargy, abnormal tone, respiratory distress, or poor perfusion in a live infant is not SIDS; it needs urgent evaluation.",
        "Unsafe sleep setup identified before an event requires immediate teaching and resource support."
      ],
      patientEducation: [
        "Place baby on the back for every sleep, naps and nighttime.",
        "Use a firm, flat sleep surface with only a fitted sheet; keep blankets, pillows, bumpers, and soft toys out of the sleep area.",
        "Keep the baby's sleep area in the caregiver's room when possible, but do not bed-share.",
        "Avoid smoke/nicotine exposure and overheating; keep well-child visits and vaccines."
      ],
      nclexTraps: [
        "The safest routine sleep position is supine, not side-lying.",
        "A soft-looking sleep space is dangerous; firm, flat, and empty is the high-yield phrase.",
        "Do not teach home apnea monitors as SIDS prevention.",
        "Do not label a symptomatic live infant as SIDS; stabilize and investigate."
      ],
      sourceKeys: ["cdc-sids-safe-sleep", "aap-safe-sleep"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Cryptorchidism",
      category: "Pediatrics",
      aliases: ["undescended testis", "undescended testes", "undescended testicle", "UDT", "maldescended testis", "cryptorcidism", "cryptorchism", "undecended testicle"],
      pronunciation: "krip-TOR-kid-izm",
      wordOrigin: "Crypto- means hidden and orchid/o means testis; cryptorchidism literally points to a hidden or non-scrotal testis.",
      definition: "Cryptorchidism is an undescended or maldescended testis: one or both testes remain abdominal, inguinal, ectopic, or otherwise outside the scrotum after the expected period of fetal and early-infant descent. The reason it matters early is heat-related germ-cell injury, subfertility or infertility risk, torsion/hernia risk, and lifelong testicular cancer surveillance.",
      etiology: "Most cases are idiopathic, but risk rises with prematurity, low birth weight, family history, small-for-gestational-age status, maternal diabetes or preeclampsia, and congenital/genetic syndromes. Descent depends on fetal testicular development, anti-Mullerian hormone activity, androgen signaling, the gubernaculum, and the postnatal mini-puberty surge of gonadotropins and testosterone.",
      pathology: "A testis that remains in the abdomen or inguinal canal sits in a warmer environment than the scrotum. Heat exposure plus abnormal fetal hormonal/gubernacular development can reduce germ-cell maturation, impair later spermatogenesis, and increase risks for infertility, testicular torsion, inguinal hernia, and testicular germ-cell cancer. Orchiopexy improves position, surveillance, and fertility potential, but it does not erase all long-term cancer risk.",
      pathophysiology: "Normal descent has a transabdominal phase and an inguinoscrotal phase. The testis forms high in the abdomen, migrates toward the internal inguinal ring, then passes through the inguinal canal into the scrotum late in gestation. If androgen signaling, AMH-related development, gubernacular guidance, or postnatal hormonal surge is insufficient, the testis may stay abdominal, inguinal, ectopic, retractile, atrophic, or absent.",
      riskFactors: [
        "Prematurity or low birth weight; many premature infants are born before normal late-gestation descent is complete.",
        "Family history of cryptorchidism or disorders of sex development.",
        "Associated syndromes or genital anomalies such as hypospadias, micropenis, ambiguous genitalia, persistent Mullerian duct syndrome, androgen insensitivity, or 5-alpha-reductase deficiency.",
        "Bilateral nonpalpable testes are higher-risk because they can indicate anorchia or a disorder of sex development rather than simple unilateral maldescent."
      ],
      signsSymptoms: [
        "Empty, underdeveloped, or asymmetric hemiscrotum on newborn or well-child exam.",
        "Palpable testis in the inguinal canal or upper scrotum, or a nonpalpable testis when it is abdominal, atrophic, or absent.",
        "Usually painless; acute groin/abdominal/scrotal pain, vomiting, or a high-riding tender testis raises concern for torsion and is urgent.",
        "Retractile testis can be manipulated into the scrotum and stays there after the cremasteric reflex relaxes; a true undescended testis cannot be maintained in the scrotum.",
        "Bilateral nonpalpable testes, ambiguous genitalia, hypospadias, micropenis, hypoglycemia, or jaundice should trigger urgent specialist/endocrine evaluation rather than routine reassurance."
      ],
      diagnostics: [
        "Diagnosis is primarily by careful physical exam: warm hands, relaxed child, palpation from inguinal canal toward scrotum, and comparison with the opposite testis.",
        "Document whether the testis is palpable, nonpalpable, unilateral, bilateral, retractile, ectopic, or possibly ascending after prior descent.",
        "Routine ultrasound is usually low value before referral because it often does not change management and can miss intra-abdominal testes.",
        "If both testes are nonpalpable or genital findings are ambiguous, evaluate urgently for disorder of sex development: electrolytes/glucose if congenital adrenal hyperplasia is possible, karyotype, anti-Mullerian hormone/inhibin B/FSH/LH/testosterone as ordered, and pediatric urology/endocrinology consultation.",
        "Surgical exploration or diagnostic laparoscopy may be used for nonpalpable testes when specialist evaluation indicates it."
      ],
      labs: [
        "No routine lab confirms simple unilateral palpable cryptorchidism.",
        "Bilateral nonpalpable testes can require AMH/inhibin B to show functioning Sertoli-cell tissue, gonadotropins/testosterone to assess testicular endocrine function, and karyotype/hormonal testing if DSD is possible.",
        "Electrolytes and glucose matter urgently if an infant with ambiguous genitalia could have salt-wasting congenital adrenal hyperplasia."
      ],
      treatments: [
        "Observe only through the expected early descent window; spontaneous descent after about 6 months corrected age is unlikely.",
        "Refer to pediatric urology if a testis is not scrotal by 6 months corrected age, if there is newly acquired/ascending testis after infancy, or if exam is uncertain.",
        "Orchiopexy is the standard treatment, ideally performed between 6 and 18 months for congenital undescended testis to improve scrotal position, fertility potential, and tumor surveillance.",
        "Hormonal therapy is generally not recommended as routine descent treatment because response is inconsistent and long-term benefit is poor compared with surgery.",
        "Emergency evaluation is needed for suspected torsion, incarcerated hernia, severe pain, vomiting, or an acutely swollen/tender groin or scrotum."
      ],
      nursingPriorities: [
        "Do not document 'testes descended' unless both testes are actually felt in the scrotum; absence from the scrotum is the key finding.",
        "Differentiate retractile versus undescended in wording: retractile can be brought down and remain temporarily, while undescended cannot be maintained in the scrotum.",
        "Teach caregivers that early referral protects fertility potential and cancer surveillance; waiting for school age is not benign.",
        "For post-orchiopexy care, monitor incision/scrotal swelling, fever, bleeding, pain control, urination, activity limits, and signs of infection or testicular atrophy.",
        "Escalate bilateral nonpalpable testes or genital ambiguity promptly; do not circumcise or reassure before specialist evaluation when DSD is possible."
      ],
      complications: [
        "Subfertility or infertility, especially with bilateral disease, intra-abdominal testes, or delayed correction.",
        "Increased lifetime testicular germ-cell tumor risk; orchiopexy improves examination and may reduce risk when done before puberty, but ongoing awareness is still needed.",
        "Testicular torsion because an undescended or poorly fixed testis can twist on its vascular pedicle.",
        "Inguinal hernia or patent processus vaginalis associated with the descent pathway.",
        "Testicular atrophy after prolonged malposition or rare vascular compromise after surgery.",
        "Psychosocial distress related to scrotal asymmetry, fertility concerns, or delayed diagnosis."
      ],
      redFlags: [
        "Bilateral nonpalpable testes.",
        "Ambiguous genitalia, severe hypospadias, micropenis, hypoglycemia, vomiting, dehydration, hyponatremia, or hyperkalemia.",
        "Acute testicular/groin/abdominal pain with nausea or vomiting.",
        "Incarcerated hernia signs: painful groin bulge, abdominal distention, vomiting, or inconsolable crying.",
        "A testis that was previously scrotal but is no longer consistently in the scrotum."
      ],
      patientEducation: [
        "Keep urology referral if the testis is not in the scrotum by 6 months corrected age; delayed surgery can reduce fertility potential.",
        "After repair, follow activity, bathing, wound-care, and pain-control instructions; report fever, increasing redness, drainage, severe swelling, uncontrolled pain, or trouble urinating.",
        "Teach adolescents with a history of cryptorchidism or orchiopexy to know normal testicular feel and report a new lump, firmness, asymmetry, or persistent ache."
      ],
      nclexTraps: [
        "Do not order routine ultrasound as the first nursing answer for a typical undescended testis; physical exam and timely referral are the key pathway.",
        "Do not confuse retractile testis with true cryptorchidism. Retractile can be brought into the scrotum and stays there briefly; true undescended testis does not.",
        "The priority red flag is bilateral nonpalpable testes or ambiguous genitalia because this can be a disorder of sex development or adrenal emergency.",
        "Orchiopexy reduces risk and improves surveillance, but it does not make the lifetime cancer risk identical to someone who never had cryptorchidism."
      ],
      sourceKeys: ["ncbi-statpearls-cryptorchidism", "aua-cryptorchidism-guideline"],
      nclexEssential: true,
      __replaceArrays: [
        "riskFactors",
        "signsSymptoms",
        "diagnostics",
        "labs",
        "treatments",
        "nursingPriorities",
        "complications",
        "redFlags",
        "patientEducation",
        "nclexTraps"
      ]
    },
    {
      name: "DKA in children",
      category: "Pediatrics",
      aliases: ["pediatric DKA", "diabetic ketoacidosis in children", "childhood diabetic ketoacidosis"],
      pronunciation: "dee-kay-AY",
      definition: "Pediatric diabetic ketoacidosis is an acute insulin-deficiency emergency with hyperglycemia or relative hyperglycemia, ketone production, dehydration, electrolyte loss, and metabolic acidosis.",
      etiology: "Common triggers are new-onset type 1 diabetes, missed insulin, insulin pump failure, infection, steroid exposure, physiologic stress, vomiting/poor intake with inadequate sick-day insulin, or limited access to insulin and supplies.",
      pathology: "Without enough insulin, glucose cannot enter insulin-dependent tissues well, while counter-regulatory hormones drive glycogenolysis, gluconeogenesis, and lipolysis. Free fatty acids are converted into ketones, especially beta-hydroxybutyrate, creating high-anion-gap acidosis. Hyperglycemia causes osmotic diuresis, so the child loses water, sodium, potassium, phosphate, and magnesium even when the first serum potassium looks normal or high.",
      pathophysiology: "Children are especially monitored for cerebral edema/brain injury during DKA treatment. Risk rises with severe acidosis, dehydration, younger age, new-onset diabetes, high BUN, low carbon dioxide, and rapid neurologic change. Insulin moves potassium back into cells and stops ketone production, so potassium must be known and replaced safely before or during insulin therapy.",
      riskFactors: [
        "Known type 1 diabetes with missed basal insulin, pump dislodgement/occlusion, illness, vomiting, or poor sick-day plan.",
        "New-onset diabetes with polyuria, polydipsia, weight loss, nocturia, fatigue, abdominal pain, vomiting, or Kussmaul respirations.",
        "Adolescents with eating disorder behaviors, psychosocial stress, insulin omission, or limited access to insulin.",
        "Use of medications that worsen glucose control, including glucocorticoids or selected antipsychotics, when clinically relevant."
      ],
      signsSymptoms: [
        "Polyuria, polydipsia, weight loss, dehydration, tachycardia, dry mucosa, poor skin turgor, delayed capillary refill, or hypotension if shock develops.",
        "Nausea, vomiting, abdominal pain, fruity/acetone breath, and deep Kussmaul respirations from metabolic acidosis.",
        "Lethargy, irritability, headache, confusion, decreasing Glasgow Coma Scale, seizure, bradycardia, hypertension, or pupillary change can signal cerebral edema/brain injury.",
        "Children can look like gastroenteritis or sepsis first; checking glucose and ketones prevents missing DKA."
      ],
      diagnostics: [
        "Bedside glucose immediately, then serum beta-hydroxybutyrate or serum/urine ketones, venous blood gas, bicarbonate, anion gap, electrolytes, BUN/creatinine, corrected sodium, osmolality if ordered, and strict intake/output.",
        "Potassium is a priority interpretation point: serum potassium may be normal or high despite total-body depletion; insulin can cause dangerous hypokalemia if potassium is not monitored and replaced.",
        "Search for the trigger: infection assessment, cultures only when indicated, medication/insulin delivery history, pump site/tubing check, and HbA1c to understand baseline control.",
        "Continuous neurologic assessment is part of diagnosis during treatment because cerebral edema is a clinical emergency, not just a lab abnormality."
      ],
      labs: [
        "Glucose is commonly elevated, but the severity of acidosis and ketones matters more than the glucose number alone.",
        "Low bicarbonate and low pH show metabolic acidosis; anion gap closes as ketoacids clear.",
        "Beta-hydroxybutyrate is the dominant DKA ketone and is more informative than urine ketones when available.",
        "Corrected sodium, potassium, phosphate, magnesium, BUN/creatinine, and urine output guide fluid/electrolyte safety."
      ],
      treatments: [
        "If the child is unstable, prioritize oxygenation, circulation, mental status, perfusion, IV access, and ordered isotonic fluid resuscitation.",
        "Start continuous IV insulin after initial fluid resuscitation and after potassium safety is addressed; avoid stopping basal insulin in pump/known diabetes plans unless provider protocol says otherwise.",
        "Replace potassium according to protocol once urine output and serum level permit; hold/clarify insulin if potassium is dangerously low.",
        "Add dextrose to IV fluids when glucose falls but acidosis/ketones are not resolved, so insulin can continue clearing ketones safely.",
        "Treat cerebral edema immediately when suspected, usually with hypertonic saline or mannitol per protocol, fluid adjustment, head elevation, ICU escalation, and provider notification."
      ],
      nursingPriorities: [
        "Trend neuro status frequently; headache, slowing heart rate, rising blood pressure, vomiting, confusion, or decreased responsiveness is not routine fatigue.",
        "Track glucose, anion gap/bicarbonate, potassium, corrected sodium, urine output, vital signs, respiratory pattern, and fluid balance on the ordered schedule.",
        "Do not give insulin without understanding potassium status; serum potassium can drop quickly once insulin and acidosis correction begin.",
        "Teach sick-day rules after stabilization: never stop basal insulin, check ketones during illness/high glucose, hydrate, know when to call, and verify pump function/sites."
      ],
      complications: [
        "Cerebral edema/brain injury.",
        "Hypokalemia, dysrhythmia, or muscle weakness during insulin therapy.",
        "Hypoglycemia if insulin continues without adequate dextrose.",
        "Shock, acute kidney injury, aspiration from vomiting, venous thrombosis, or recurrent DKA if the trigger is not corrected."
      ],
      redFlags: [
        "Declining mental status, headache, seizure, bradycardia, hypertension, or abnormal pupils.",
        "Serum potassium low or falling, absent urine output, or ECG changes.",
        "Persistent shock, worsening acidosis, or inability to tolerate/continue ordered therapy."
      ],
      patientEducation: [
        "During illness, check glucose and ketones more often, keep taking basal insulin, drink fluids with electrolytes/carbohydrates as instructed, and call early for vomiting, moderate/large ketones, or persistent high glucose.",
        "For pump users, unexplained high glucose with ketones means assume delivery failure until proven otherwise: change site/tubing, give correction by injection if directed, and seek care if ketones persist.",
        "Families need a written plan for school, sports, overnight symptoms, emergency supplies, and when to use glucagon or call emergency services."
      ],
      nclexTraps: [
        "Normal or high potassium does not mean the child has enough body potassium.",
        "Do not stop insulin just because glucose is falling if the anion gap remains open; add dextrose so insulin can clear ketones.",
        "Abdominal pain and vomiting can be DKA, not only gastroenteritis.",
        "Cerebral edema is suspected by neurologic change during DKA care and must be escalated immediately."
      ],
      sourceKeys: ["ncbi-endotext-diabetic-ketoacidosis"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Catheter-associated UTI",
      category: "Renal/Urinary",
      aliases: ["CAUTI", "catheter associated urinary tract infection", "foley-associated UTI", "indwelling catheter UTI"],
      pronunciation: "KAW-tee",
      definition: "Catheter-associated UTI is a urinary tract infection that occurs in a client with a urinary catheter in place or recently removed, after the catheter has bypassed normal urethral defenses.",
      etiology: "Risk rises with each unnecessary catheter day, breaks in the closed drainage system, nonsterile insertion, dependent loops or backflow, fecal contamination, diabetes, older age, immunosuppression, critical illness, and poor catheter securement.",
      pathology: "The catheter gives organisms a surface for biofilm formation. Bacteria can ascend outside the catheter along the urethra or inside the lumen if the system is opened; biofilm protects microbes from host defenses and can seed bladder infection, pyelonephritis, bacteremia, or sepsis.",
      pathophysiology: "A catheter-associated positive culture is not automatically symptomatic infection. The key distinction is symptoms/signs of infection plus catheter context, because asymptomatic bacteriuria is common with indwelling devices and overtreatment drives resistance.",
      riskFactors: [
        "Longer catheter duration; catheter necessity should be reviewed daily.",
        "Disconnection from the drainage system, bag above bladder level, dependent tubing loops, or poor hand hygiene.",
        "Urinary retention/obstruction, fecal incontinence, diabetes, pregnancy, immunosuppression, spinal cord injury, or recent urologic procedure.",
        "Catheter placed for staff convenience or incontinence without an appropriate indication."
      ],
      signsSymptoms: [
        "Fever or rigors without another source, suprapubic pain, flank pain/CVA tenderness, pelvic discomfort, acute hematuria, dysuria/urgency after removal, or new sepsis physiology.",
        "Older adults may show delirium or functional decline, but do not label cloudy or foul-smelling urine alone as CAUTI without assessment.",
        "Catheter obstruction, leakage, bladder spasms, or reduced urine output can suggest mechanical problems that increase infection risk."
      ],
      diagnostics: [
        "Assess whether the catheter is still indicated and remove it promptly when it is not needed.",
        "If symptomatic infection is suspected, collect urine culture correctly from the sampling port after disinfecting it; do not culture from the drainage bag.",
        "If the catheter has been in place long enough to carry biofilm, replace it before culture when ordered so the specimen better reflects bladder urine.",
        "Evaluate for sepsis with vital signs, mental status, urine output, CBC, lactate, blood cultures, and renal function when clinically indicated."
      ],
      labs: [
        "Urinalysis may show pyuria or bacteriuria but cannot alone distinguish colonization from symptomatic CAUTI.",
        "Urine culture guides antibiotic narrowing; mixed flora or bag specimens can be misleading.",
        "Creatinine matters for antibiotic choice and dosing; WBC/lactate matter when systemic infection is suspected."
      ],
      treatments: [
        "Remove the catheter if it is not required; if urinary drainage is still required, replace the catheter using aseptic technique when ordered.",
        "Give antibiotics only when clinical criteria support symptomatic infection or high-risk indications; tailor therapy to culture and local resistance patterns.",
        "Maintain hydration and unobstructed drainage; manage retention, obstruction, stones, prostatitis, or pyelonephritis if present.",
        "Escalate sepsis, hypotension, flank pain, rigors, or acute kidney injury promptly."
      ],
      nursingPriorities: [
        "Use the CAUTI prevention bundle: insert only for valid indications, aseptic insertion, securement, closed drainage, bag below bladder, no dependent loops, unobstructed flow, perineal hygiene, and daily removal review.",
        "Never disconnect the system for convenience or raise the drainage bag above bladder level without clamping/precautions per policy.",
        "Do not send cultures for cloudy urine alone; assess symptoms, catheter indication, and alternate sources of fever or delirium.",
        "Teach catheter care for home clients: hand hygiene, bag position, avoiding kinks, drainage emptying technique, and when to call."
      ],
      complications: [
        "Pyelonephritis.",
        "Gram-negative bacteremia or sepsis.",
        "Prostatitis, epididymitis, or orchitis in males.",
        "Encrustation, obstruction, bladder stones, urethral trauma, antimicrobial resistance, and prolonged hospitalization."
      ],
      redFlags: [
        "Fever with hypotension, tachypnea, confusion, or low urine output.",
        "Flank pain/CVA tenderness or rigors.",
        "Blocked catheter with bladder distention or autonomic dysreflexia risk in spinal cord injury."
      ],
      patientEducation: [
        "Keep the bag below bladder level, tubing unkinked, and the system closed; wash hands before and after handling the bag.",
        "Report fever, chills, flank pain, pelvic pain, new confusion, catheter blockage, no drainage, or blood in urine.",
        "Ask daily whether the catheter is still needed; fewer catheter days means lower infection risk."
      ],
      nclexTraps: [
        "Cloudy or smelly urine alone is not enough to diagnose CAUTI.",
        "Culture from the sampling port, not the drainage bag.",
        "The best prevention is avoiding unnecessary catheters and removing them early.",
        "Opening the closed system increases infection risk."
      ],
      sourceKeys: ["cdc-cauti-recommendations"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Cardiomyopathy",
      category: "Cardiac/Vascular",
      aliases: ["heart muscle disease", "dilated cardiomyopathy", "hypertrophic cardiomyopathy", "restrictive cardiomyopathy"],
      pronunciation: "kar-dee-oh-my-OP-uh-thee",
      wordOrigin: "Cardio- means heart, myo- means muscle, and -pathy means disease; cardiomyopathy is literally heart-muscle disease.",
      definition: "Cardiomyopathy is disease of the myocardium that impairs ventricular filling, contraction, electrical stability, or more than one of these functions.",
      etiology: "Causes include genetic sarcomere or cytoskeletal disease, hypertension, ischemia, viral myocarditis, alcohol, cocaine, chemotherapy such as anthracyclines, peripartum cardiomyopathy, infiltrative disease such as amyloid, endocrine disease, tachycardia-mediated remodeling, and idiopathic disease.",
      pathology: "Dilated cardiomyopathy stretches the ventricle and weakens systolic squeeze, lowering ejection fraction. Hypertrophic cardiomyopathy thickens myocardium, often the septum, causing diastolic dysfunction and sometimes dynamic left-ventricular outflow obstruction. Restrictive cardiomyopathy makes the ventricle stiff, so filling is poor despite a normal or near-normal ejection fraction early.",
      pathophysiology: "Any subtype can produce heart failure symptoms, mitral/tricuspid regurgitation from chamber remodeling, atrial or ventricular dysrhythmias, mural thrombus, syncope, sudden cardiac death, and poor perfusion. Treatment depends on subtype because a dilated low-EF ventricle, an obstructive hypertrophic ventricle, and an infiltrated restrictive ventricle do not tolerate the same hemodynamic changes.",
      riskFactors: [
        "Family history of cardiomyopathy, sudden death, unexplained syncope, or inherited arrhythmia.",
        "Longstanding hypertension, coronary disease, diabetes, obesity, sleep apnea, or chronic tachyarrhythmia.",
        "Alcohol or cocaine use, myocarditis, HIV, Chagas disease, thyroid disease, hemochromatosis, amyloidosis, sarcoidosis, or muscular dystrophy.",
        "Pregnancy/postpartum period or exposure to cardiotoxic chemotherapy."
      ],
      signsSymptoms: [
        "Dyspnea, orthopnea, edema, fatigue, exercise intolerance, chest discomfort, palpitations, syncope, JVD, crackles, S3, murmur, or low urine output.",
        "Hypertrophic obstructive disease may produce exertional syncope or sudden death risk, especially with dehydration, vasodilation, or intense exertion.",
        "Restrictive/infiltrative disease can look like right-sided failure with edema, ascites, hepatomegaly, and preserved ejection fraction."
      ],
      diagnostics: [
        "Echocardiogram is central: chamber size, wall thickness, ejection fraction, diastolic filling, valve regurgitation, and outflow obstruction.",
        "ECG and rhythm monitoring check atrial fibrillation, ventricular tachycardia, conduction disease, ischemia, or hypertrophy patterns.",
        "BNP/NT-proBNP, troponin when ischemia/myocarditis is possible, CMP, thyroid studies, iron studies, viral/inflammatory testing, or genetic testing are selected by history.",
        "Cardiac MRI can define scar, myocarditis, infiltrative disease, and ventricular morphology; coronary evaluation rules out ischemic mimics when indicated."
      ],
      labs: [
        "BNP/NT-proBNP often rises with wall stress and congestion.",
        "Troponin may rise with ischemia, myocarditis, demand strain, or infiltrative injury.",
        "Creatinine, potassium, magnesium, liver tests, thyroid tests, and iron studies affect cause-finding and medication safety."
      ],
      treatments: [
        "Treat the subtype and cause: guideline-directed heart-failure therapy for dilated/systolic dysfunction, rhythm control or anticoagulation when indicated, and remove toxins or cardiotoxic triggers.",
        "For hypertrophic obstructive cardiomyopathy, avoid dehydration and clarify medications that sharply reduce preload/afterload; beta blockers or non-dihydropyridine calcium channel blockers are common specialist therapies.",
        "ICD, cardiac resynchronization therapy, septal reduction therapy, mechanical circulatory support, or transplant may be needed for selected high-risk clients.",
        "Diuretics relieve congestion but can worsen obstruction or renal perfusion if overdone; dose response and subtype matter."
      ],
      nursingPriorities: [
        "Trend dyspnea, lung sounds, edema, daily weight, strict intake/output, blood pressure, heart rhythm, syncope, chest pain, renal function, and electrolytes.",
        "Ask about family history of sudden death and exertional syncope; these are not casual findings in cardiomyopathy.",
        "Teach medication adherence, sodium/fluid plan if prescribed, avoiding alcohol/cocaine, infection prevention, and when to report rapid weight gain or worsening breathlessness.",
        "Escalate new syncope, sustained palpitations, hypotension, pulmonary edema, chest pain, or ventricular dysrhythmia."
      ],
      complications: [
        "Acute decompensated heart failure and pulmonary edema.",
        "Atrial fibrillation, ventricular tachycardia, sudden cardiac death, or conduction disease.",
        "Mural thrombus, stroke/systemic embolism, cardiogenic shock, renal/hepatic congestion, and transplant need."
      ],
      redFlags: [
        "Syncope during exertion or palpitations.",
        "Family history of sudden unexplained death.",
        "New ventricular dysrhythmia, hypotension, pulmonary edema, or chest pain."
      ],
      patientEducation: [
        "Report fainting, near-fainting, sustained palpitations, chest pain, new/worse shortness of breath, swelling, or rapid weight gain.",
        "Keep echo/cardiology follow-up and ask whether family screening or genetic counseling is needed.",
        "Avoid dehydration, binge alcohol, cocaine/stimulants, and unapproved intense exertion if hypertrophic cardiomyopathy is suspected."
      ],
      nclexTraps: [
        "Do not treat all cardiomyopathies as the same disease; dilated, hypertrophic, and restrictive have different physiology.",
        "Syncope in hypertrophic cardiomyopathy is a sudden-death warning.",
        "A preserved ejection fraction does not rule out severe restrictive or hypertrophic filling disease.",
        "Diuretics help congestion but can harm if they create hypotension, renal injury, or worsen outflow obstruction."
      ],
      sourceKeys: ["nhlbi-cardiomyopathy"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Cauda equina syndrome",
      category: "Neuro",
      aliases: ["CES", "cauda equina compression", "lumbosacral nerve root compression"],
      pronunciation: "KAW-duh eh-KWY-nuh",
      wordOrigin: "Cauda equina is Latin for horse tail, describing the bundle of lumbar and sacral nerve roots below the spinal cord.",
      definition: "Cauda equina syndrome is compression or injury of the lumbosacral nerve roots below the conus medullaris, threatening bladder, bowel, sexual, sensory, and lower-extremity motor function.",
      etiology: "Major causes include large central lumbar disc herniation, spinal stenosis, trauma, epidural abscess, epidural hematoma, tumor/metastasis, postoperative complication, and severe infection or bleeding around the spinal canal.",
      pathology: "The cauda equina contains peripheral nerve roots that supply the bladder, bowel, saddle area, and legs. Compression blocks sensory and motor signals and can impair parasympathetic bladder emptying, producing painless urinary retention that may overflow as incontinence.",
      pathophysiology: "The danger is time-dependent nerve injury. Incomplete CES may have urinary difficulty and saddle sensory change; CES with retention is more advanced. Delayed decompression can leave permanent neurogenic bladder, bowel dysfunction, sexual dysfunction, pain, numbness, and weakness.",
      riskFactors: [
        "Known lumbar disc disease with new bilateral neurologic symptoms.",
        "Cancer history, fever, IV drug use, immunosuppression, recent spinal procedure, anticoagulation, or trauma.",
        "New urinary retention, saddle anesthesia, or bowel dysfunction with back pain."
      ],
      signsSymptoms: [
        "Severe low back pain with unilateral or bilateral sciatica, leg weakness, sensory loss, or gait change.",
        "Saddle anesthesia or numbness in the perineum, genitals, buttocks, or inner thighs.",
        "Urinary retention, reduced urinary sensation, overflow incontinence, fecal incontinence/constipation, reduced anal tone, or sexual dysfunction.",
        "Fever, cancer symptoms, or anticoagulant use changes the likely cause and urgency."
      ],
      diagnostics: [
        "Emergency focused neurologic exam: lower-extremity strength, sensation, reflexes, perineal sensation, rectal tone when appropriate, gait, and pain pattern.",
        "Bladder scan/post-void residual helps identify retention; large residual with red-flag symptoms strongly supports urgent escalation.",
        "MRI lumbar spine is the preferred diagnostic test when available; CT myelography or CT may be used if MRI is unavailable or contraindicated.",
        "CBC, ESR/CRP, blood cultures, coagulation studies, or cancer/infection workup are selected by suspected cause, but imaging and surgical consultation should not be delayed."
      ],
      labs: [
        "No lab rules out CES.",
        "Inflammatory markers or cultures support epidural abscess evaluation.",
        "Coagulation studies matter when epidural hematoma or urgent surgery is possible."
      ],
      treatments: [
        "Urgent neurosurgical or spine-surgery evaluation for decompression when compressive CES is suspected.",
        "Manage bladder retention with catheterization as ordered while preserving neurologic documentation.",
        "Give antibiotics for epidural abscess and reverse/hold anticoagulation when ordered for suspected bleeding; treat the cause without delaying decompression decisions.",
        "Pain control, fall precautions, and postoperative neuro/bladder monitoring are supportive, not substitutes for source control."
      ],
      nursingPriorities: [
        "Ask the embarrassing questions clearly: new trouble starting urine, loss of bladder sensation, saddle numbness, bowel accidents, sexual dysfunction, or bilateral leg symptoms.",
        "Escalate immediately; CES is not routine back pain or sciatica.",
        "Document baseline motor/sensory/bladder findings before and after interventions.",
        "Maintain NPO/IV access readiness if emergency surgery is likely."
      ],
      complications: [
        "Permanent neurogenic bladder requiring catheterization.",
        "Bowel incontinence or constipation.",
        "Sexual dysfunction, chronic neuropathic pain, saddle anesthesia, foot drop, gait impairment, and disability."
      ],
      redFlags: [
        "Saddle anesthesia.",
        "Urinary retention or overflow incontinence.",
        "Bowel dysfunction with back pain.",
        "Bilateral leg weakness/numbness or rapidly worsening neurologic deficit."
      ],
      patientEducation: [
        "Seek emergency care for back pain with new saddle numbness, bladder retention, loss of urine/bowel control, or leg weakness.",
        "After treatment, follow bladder program, bowel regimen, wound instructions, physical therapy, and neurologic follow-up."
      ],
      nclexTraps: [
        "Urinary retention is more concerning than urinary frequency in suspected CES.",
        "Do not reassure severe back pain with saddle anesthesia as muscle strain.",
        "Analgesics do not fix nerve compression.",
        "MRI and urgent surgical evaluation are priority pathways."
      ],
      sourceKeys: ["ninds-cauda-equina-syndrome"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Cataracts",
      category: "Neuro/Ophthalmic",
      aliases: ["cataract", "lens opacity", "clouded lens"],
      pronunciation: "KAT-uh-rakts",
      definition: "A cataract is clouding of the eye lens that scatters and blocks light, causing gradual painless visual impairment.",
      etiology: "Most cataracts are age-related, but risk increases with diabetes, smoking, ultraviolet exposure, eye trauma, radiation, corticosteroid use, prior eye surgery, congenital infection/genetic disorders, and poor nutrition.",
      pathology: "The normally transparent lens becomes opaque as lens proteins denature, aggregate, and scatter light. Instead of focusing a sharp image on the retina, the lens creates blur, glare, halos, reduced contrast, and faded color perception.",
      pathophysiology: "Cataracts usually progress slowly and painlessly. Central nuclear cataracts impair distance vision and cause yellow/brown color shift; posterior subcapsular cataracts often cause glare and reading difficulty; cortical cataracts create spoke-like light scatter.",
      riskFactors: [
        "Older age.",
        "Diabetes mellitus, smoking, alcohol overuse, chronic corticosteroid exposure, ultraviolet light exposure, eye injury, or prior ocular inflammation/surgery.",
        "Congenital cataracts can occur with genetic syndromes or prenatal infections and need early detection to prevent amblyopia."
      ],
      signsSymptoms: [
        "Gradual painless blurry/cloudy vision.",
        "Glare, halos around lights, poor night driving, faded colors, frequent eyeglass prescription changes, or monocular double vision.",
        "No eye pain, severe redness, sudden curtain, or sudden vision loss in uncomplicated cataracts."
      ],
      diagnostics: [
        "Visual acuity testing, glare testing when relevant, red reflex, slit-lamp lens exam, and dilated retinal exam by eye care specialist.",
        "Assess effect on function: driving, reading, medication labels, falls, self-care, and ability to manage diabetes/medications.",
        "Sudden vision loss, painful red eye, new flashes/floaters/curtain, or neurologic symptoms require a different urgent pathway."
      ],
      labs: [
        "No routine blood test diagnoses cataracts.",
        "Glucose/A1c may matter because diabetes accelerates cataracts and affects perioperative healing risk."
      ],
      treatments: [
        "Early support includes stronger lighting, glare reduction, updated lenses, magnification, and fall-prevention strategies.",
        "Definitive treatment is surgical removal of the cloudy lens with intraocular lens placement when vision loss affects function or eye evaluation requires lens clarity.",
        "Postoperative care includes prescribed eye drops, eye shield/protection, activity restrictions, and avoiding rubbing or straining as instructed."
      ],
      nursingPriorities: [
        "Teach that cataracts are painless and gradual; sudden painful or curtain-like vision changes are not cataract progression.",
        "Reduce fall risk with lighting, contrast, clutter removal, and medication-label support.",
        "After surgery, monitor for severe pain, sudden decreased vision, increasing redness, discharge, flashes/floaters, or nausea/vomiting."
      ],
      complications: [
        "Falls, driving injury, medication errors, loss of independence, depression/social isolation.",
        "Postoperative infection/endophthalmitis, increased intraocular pressure, cystoid macular edema, retinal detachment, or posterior capsule opacification."
      ],
      redFlags: [
        "Sudden vision loss or curtain/shadow.",
        "Eye pain with redness, halos, nausea/vomiting.",
        "Flashes and many new floaters after surgery."
      ],
      patientEducation: [
        "Use brighter task lighting and glare control until surgery is needed.",
        "After surgery, use drops exactly as prescribed, protect the eye, avoid rubbing, and call for severe pain, worsening vision, redness, or drainage.",
        "Manage diabetes, avoid smoking, and wear UV-protective sunglasses to slow preventable risk where possible."
      ],
      nclexTraps: [
        "Cataracts cause painless cloudy vision; acute painful red eye with halos suggests angle-closure glaucoma.",
        "A sudden curtain over vision suggests retinal detachment, not routine cataract.",
        "After cataract surgery, severe pain or sudden vision drop is urgent."
      ],
      sourceKeys: ["nei-cataracts"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Hepatorenal syndrome",
      category: "GI/Hepatic",
      aliases: ["HRS", "hepatorenal syndrome acute kidney injury", "HRS-AKI", "hepatorenal renal failure"],
      pronunciation: "hep-uh-toh-REE-nal SIN-drohm",
      definition: "Hepatorenal syndrome is kidney dysfunction in advanced cirrhosis and portal hypertension driven mainly by circulatory and renal vasoconstrictive changes rather than primary kidney structural disease.",
      etiology: "It occurs in decompensated cirrhosis, especially with ascites, and is often triggered by spontaneous bacterial peritonitis or other infection, GI bleeding, excessive diuresis, large-volume paracentesis without adequate albumin support, nephrotoxins such as NSAIDs/aminoglycosides, or severe systemic inflammation.",
      pathology: "Portal hypertension causes marked splanchnic arterial vasodilation, so the body senses low effective arterial volume despite total fluid overload. RAAS, sympathetic tone, and vasopressin activate, producing renal vasoconstriction, sodium/water retention, ascites, hyponatremia, and falling GFR.",
      pathophysiology: "Classic HRS has little structural kidney damage at first, which is why vasoconstrictor plus albumin therapy and liver transplantation can reverse kidney dysfunction in selected clients. Modern practice still must exclude hypovolemia, shock, acute tubular necrosis, obstruction, and nephrotoxins because cirrhosis patients can have more than one kidney injury mechanism.",
      riskFactors: [
        "Advanced cirrhosis with ascites, hyponatremia, low mean arterial pressure, or severe portal hypertension.",
        "Spontaneous bacterial peritonitis or systemic infection.",
        "GI bleeding, overdiuresis, vomiting/diarrhea, large-volume paracentesis without albumin when indicated, NSAIDs, aminoglycosides, IV contrast, or septic shock."
      ],
      signsSymptoms: [
        "Oliguria, rising creatinine, worsening ascites/edema, fatigue, nausea, jaundice, hypotension, and severe liver-failure findings.",
        "Hepatic encephalopathy, GI bleeding, fever, abdominal pain, or tense ascites may reveal the precipitating decompensation.",
        "Urine may be bland compared with ATN; absence of dramatic urinary sediment does not mean the kidney dysfunction is safe."
      ],
      diagnostics: [
        "Trend creatinine against baseline and stage AKI; urine output alone can miss early disease.",
        "Stop diuretics/nephrotoxins, evaluate volume status, screen for infection including diagnostic paracentesis when ascites/SBP is possible, and assess GI bleeding or shock.",
        "Urinalysis checks protein, blood, and casts; renal ultrasound excludes obstruction or structural disease.",
        "Albumin challenge/volume assessment and nonresponse support HRS diagnosis when shock, nephrotoxins, and structural kidney disease are excluded."
      ],
      labs: [
        "Rising creatinine is central; BUN may rise but is not specific.",
        "Hyponatremia, low urine sodium/FENa, bland urinalysis, and no significant proteinuria/hematuria support functional renal vasoconstriction, but interpretation is limited in cirrhosis.",
        "CBC, INR, bilirubin, albumin, cultures, ascitic fluid PMN count, and lactate help identify infection, bleeding, and liver severity."
      ],
      treatments: [
        "Treat the trigger: antibiotics for SBP/infection, control GI bleeding, stop nephrotoxins, hold diuretics initially, and correct hypovolemia or shock.",
        "Albumin plus splanchnic vasoconstrictor therapy, commonly terlipressin where available or norepinephrine/midodrine-octreotide per setting, aims to restore effective arterial volume and renal perfusion.",
        "Evaluate early for liver transplant because it is the definitive therapy for eligible clients.",
        "Renal replacement therapy can bridge selected clients with severe complications but does not fix the liver-driven circulatory problem."
      ],
      nursingPriorities: [
        "Trend urine output, daily weight, abdominal girth, edema, lung sounds, mental status, blood pressure/MAP, creatinine, sodium, potassium, INR, and infection signs.",
        "Question NSAIDs and other nephrotoxins; they can remove the prostaglandin compensation cirrhotic kidneys depend on.",
        "Monitor albumin/vasoconstrictor therapy for pulmonary edema, ischemia, hypertension, chest pain, abdominal pain, and respiratory worsening.",
        "Escalate fever, abdominal pain, GI bleeding, worsening confusion, shock, anuria, severe hyponatremia, or respiratory distress."
      ],
      complications: [
        "Severe AKI, hyperkalemia, metabolic acidosis, pulmonary edema, hepatic encephalopathy, infection/sepsis, GI bleeding, multiorgan failure, and death.",
        "Medication-related ischemia or respiratory failure during vasoconstrictor/albumin therapy in high-risk clients."
      ],
      redFlags: [
        "Cirrhosis with rising creatinine and infection signs.",
        "Tense ascites with fever or abdominal pain.",
        "Oliguria/anuria, shock, severe confusion, GI bleeding, or respiratory distress."
      ],
      patientEducation: [
        "Avoid NSAIDs unless explicitly approved; they can precipitate kidney failure in cirrhosis.",
        "Report fever, abdominal pain, black/bloody stool, vomiting blood, decreased urination, worsening swelling, confusion, or shortness of breath.",
        "Keep hepatology follow-up, paracentesis plans, sodium guidance, diuretic instructions, and transplant evaluation appointments."
      ],
      nclexTraps: [
        "HRS is not simple dehydration, although effective arterial volume is low.",
        "A swollen ascitic client may still have kidneys sensing underfilling.",
        "Do not give NSAIDs to cirrhosis/ascites clients casually.",
        "Treat infection/SBP aggressively because it commonly precipitates HRS."
      ],
      sourceKeys: ["ncbi-statpearls-hepatorenal-syndrome"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Fragile X syndrome",
      category: "Pediatrics",
      aliases: ["FXS", "FMR1 full mutation", "fragile X"],
      pronunciation: "FRAJ-il eks SIN-drohm",
      definition: "Fragile X syndrome is an inherited neurodevelopmental disorder caused by silencing of the FMR1 gene, leading to reduced fragile X mental retardation protein and abnormal synaptic development.",
      etiology: "Most cases result from CGG trinucleotide repeat expansion in FMR1 on the X chromosome. Full mutations cause methylation and reduced FMRP; premutations can expand in offspring and are associated with separate adult conditions such as fragile X-associated tremor/ataxia syndrome and primary ovarian insufficiency.",
      pathology: "FMRP normally regulates translation of proteins needed for synaptic plasticity. Without enough FMRP, neuronal circuits involved in learning, sensory processing, language, attention, anxiety regulation, and social behavior develop atypically.",
      pathophysiology: "Because the gene is X-linked, males often have more severe intellectual disability and behavioral features, while females may have variable severity due to X-inactivation. The condition overlaps with autism, ADHD, anxiety, seizures, and connective-tissue features.",
      riskFactors: [
        "Family history of intellectual disability, autism, unexplained developmental delay, premature ovarian insufficiency, or tremor/ataxia in older relatives.",
        "Known FMR1 premutation carrier in a parent, especially maternal transmission because repeat expansion occurs through oogenesis.",
        "Male sex increases typical severity, but females can still be significantly affected."
      ],
      signsSymptoms: [
        "Developmental delay, speech/language delay, intellectual disability, learning problems, poor eye contact, social anxiety, sensory hypersensitivity, hand flapping, hyperactivity, impulsivity, or autism features.",
        "Physical clues can include long narrow face, large ears, prominent jaw/forehead, flexible joints, flat feet, soft skin, and macroorchidism after puberty in males.",
        "Seizures, sleep problems, feeding difficulty, recurrent otitis media, and behavioral outbursts may occur."
      ],
      diagnostics: [
        "FMR1 DNA testing confirms CGG repeat category and methylation status; routine chromosome/karyotype testing is not enough.",
        "Developmental screening and formal neuropsychological, speech-language, occupational therapy, autism, ADHD, anxiety, hearing, and vision evaluations guide support.",
        "Genetic counseling is essential because results affect siblings, parents, future pregnancies, and extended family."
      ],
      labs: [
        "FMR1 molecular testing is the key diagnostic lab.",
        "Medication monitoring labs depend on symptom-targeted therapy, such as antiseizure or psychiatric medications."
      ],
      treatments: [
        "There is no cure that restores FMRP; management is early developmental intervention, speech therapy, occupational therapy, behavioral supports, school accommodations, and family education.",
        "Treat comorbid ADHD, anxiety, aggression, sleep problems, seizures, constipation/reflux, hearing issues, or autism-related needs with targeted therapy.",
        "Genetic counseling helps families understand carrier testing, recurrence risk, and premutation-associated adult disorders."
      ],
      nursingPriorities: [
        "Use calm, concrete communication and reduce sensory overload during care.",
        "Screen for caregiver stress, sleep problems, safety risks, seizures, feeding/GI issues, and school support gaps.",
        "Do not frame behavior as willful defiance first; anxiety, sensory overload, communication difficulty, and executive dysfunction often drive outbursts.",
        "Encourage early intervention and genetic counseling rather than waiting for school failure."
      ],
      complications: [
        "Learning disability, autism spectrum disorder, ADHD, anxiety, social impairment, seizures, sleep disorder, feeding/GI problems, and family reproductive risk.",
        "Premutation carriers can develop fragile X-associated tremor/ataxia syndrome or primary ovarian insufficiency."
      ],
      redFlags: [
        "Developmental regression, new seizures, self-injury, severe aggression, or caregiver inability to maintain safety.",
        "Family history suggesting premutation disorders or multiple affected relatives."
      ],
      patientEducation: [
        "Ask for early intervention, school evaluation, speech/OT supports, hearing/vision screening, and autism/ADHD evaluation when needed.",
        "Genetic counseling can identify carriers and explain risks for future children and relatives.",
        "Predictable routines, sensory supports, sleep hygiene, and communication tools often reduce behavior crises."
      ],
      nclexTraps: [
        "Fragile X is not diagnosed by appearance alone; FMR1 molecular testing is key.",
        "Females can be affected even though males are often more severe.",
        "The family tree matters because premutation carriers may have adult neurologic or ovarian conditions.",
        "Behavior support should account for sensory and anxiety triggers."
      ],
      sourceKeys: ["cdc-fragile-x-syndrome"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Epispadias",
      category: "Pediatrics",
      aliases: ["dorsal urethral opening", "exstrophy-epispadias complex"],
      pronunciation: "ep-ih-SPAY-dee-us",
      wordOrigin: "Epi- means upon or above; epispadias describes a urethral opening on the dorsal/upper surface rather than the usual tip/ventral position.",
      definition: "Epispadias is a rare congenital urethral malformation in which the urethral opening is abnormally located on the dorsal surface of the penis or anteriorly/split in female anatomy, often within the exstrophy-epispadias spectrum.",
      etiology: "It results from abnormal embryologic development of the lower abdominal wall, genital tubercle, urethra, bladder neck, and pelvic structures. It can occur alone or with bladder exstrophy, pelvic floor defects, pubic diastasis, urinary incontinence, and genital differences.",
      pathology: "The urethral tube and surrounding genital tissues fail to close in the usual location. In males the meatus may open along the top of the penis with a short broad phallus and dorsal curvature; in females the urethra and clitoris may be split with bladder-neck weakness and incontinence.",
      pathophysiology: "Continence depends on bladder neck, urethral sphincter, pelvic floor, and bladder capacity. Epispadias is not only a cosmetic meatus issue; urinary continence, upper-tract protection, infection risk, sexual function, and psychosocial development guide long-term care.",
      riskFactors: [
        "Association with bladder exstrophy or cloacal exstrophy.",
        "Other congenital urinary, genital, pelvic, abdominal wall, or inguinal hernia findings.",
        "Family history is uncommon but congenital anomaly evaluation is still important."
      ],
      signsSymptoms: [
        "Abnormal urethral opening on the dorsal penis or anterior female urethral/clitoral split.",
        "Urinary spraying, continuous dribbling, incontinence, recurrent UTI, abnormal genital appearance, pubic bone separation, or visible bladder mucosa if exstrophy is present.",
        "May be recognized at birth; milder forms can be noticed later during toilet training because of incontinence."
      ],
      diagnostics: [
        "Careful newborn genital and abdominal exam, including location of meatus, bladder exposure, urine stream, pubic separation, and associated anomalies.",
        "Pediatric urology evaluation; renal/bladder ultrasound, voiding cystourethrogram, cystoscopy, or pelvic imaging may be used to map anatomy and protect upper tracts.",
        "Assess continence, UTIs, hydronephrosis, renal function, and family readiness for staged repair/follow-up."
      ],
      labs: [
        "Urinalysis/culture if UTI symptoms occur.",
        "Creatinine and renal monitoring when upper-tract involvement, obstruction, reflux, or repeated surgery is relevant."
      ],
      treatments: [
        "Surgical reconstruction is individualized: urethral/genital repair, bladder neck reconstruction, exstrophy closure, pelvic osteotomy, or staged continence procedures depending anatomy.",
        "Protect exposed bladder mucosa if exstrophy is present with sterile moist coverings and urgent specialty care.",
        "Long-term follow-up monitors continence, UTIs, renal function, sexual/reproductive health, and psychosocial support."
      ],
      nursingPriorities: [
        "Do not circumcise until pediatric urology has evaluated congenital urethral anomalies; foreskin tissue may be needed for reconstruction.",
        "Protect privacy and use neutral language with families; this is anatomy, continence, and kidney protection care, not blame.",
        "Monitor urine output, signs of UTI, skin breakdown from dribbling, post-op catheter/stent care, pain, bleeding, and wound complications.",
        "Teach families that multiple surgeries or long follow-up may be normal depending severity."
      ],
      complications: [
        "Urinary incontinence, recurrent UTI, vesicoureteral reflux, hydronephrosis/renal injury, urethral stricture/fistula, sexual dysfunction, fertility concerns, and psychosocial distress."
      ],
      redFlags: [
        "Visible bladder mucosa/exstrophy at birth.",
        "No urine output, fever, flank pain, severe bleeding, catheter obstruction, or postoperative wound separation.",
        "Hydronephrosis, recurrent febrile UTI, or poor renal growth."
      ],
      patientEducation: [
        "Keep pediatric urology appointments and ask exactly which anatomy was repaired and what complications to watch for.",
        "Report fever, foul urine, flank pain, decreased urine output, catheter blockage, bleeding, wound drainage, or worsening incontinence.",
        "Older children may need developmentally appropriate privacy, body-image support, and continence planning for school."
      ],
      nclexTraps: [
        "Epispadias is dorsal; hypospadias is ventral/underside.",
        "Do not circumcise before urology evaluation in urethral malformations.",
        "Incontinence can be a bladder-neck problem, not simply poor toilet training.",
        "Look for bladder exstrophy and renal/urinary tract complications."
      ],
      sourceKeys: ["medlineplus-epispadias", "johns-hopkins-epispadias"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Hypospadias",
      category: "Pediatrics",
      aliases: ["ventral urethral opening", "hypospadia", "chordee with hypospadias"],
      pronunciation: "hy-poh-SPAY-dee-us",
      wordOrigin: "Hypo- means under or below; hypospadias describes a urethral opening on the underside/ventral surface rather than the tip.",
      definition: "Hypospadias is a congenital condition in which the urethral meatus opens on the ventral surface of the penis, anywhere from near the glans to the scrotum or perineum.",
      etiology: "It reflects incomplete urethral fold fusion during androgen-dependent genital development. Risk is higher with prematurity, low birth weight, family history, placental insufficiency, assisted reproduction, and disorders of sex development in severe/proximal cases.",
      pathology: "The urethral channel ends short of the tip, often with ventral curvature called chordee and an incomplete dorsal hooded foreskin. More proximal openings are more likely to affect urination, sexual function, fertility, and require complex repair.",
      pathophysiology: "Severity depends on meatal location, chordee, penile size, foreskin configuration, and associated findings. Proximal hypospadias with undescended testes or ambiguous genitalia suggests possible disorder of sex development and needs endocrine/urology evaluation.",
      riskFactors: [
        "Family history, prematurity, low birth weight, small-for-gestational-age status, and assisted reproductive technology.",
        "Associated cryptorchidism, bifid scrotum, micropenis, or ambiguous genitalia increases DSD concern.",
        "Maternal/placental factors affecting androgen signaling can contribute."
      ],
      signsSymptoms: [
        "Urethral opening on underside of glans, shaft, penoscrotal junction, scrotum, or perineum.",
        "Downward urine spray, hooded foreskin, chordee/ventral curvature, or difficulty standing to void.",
        "Severe/proximal cases may have undescended testes, bifid scrotum, or ambiguous genitalia."
      ],
      diagnostics: [
        "Physical exam identifies meatal location, chordee, foreskin pattern, testicular position, and genital symmetry.",
        "Most distal isolated cases need no extensive imaging before urology referral; proximal or complex cases may need renal/bladder imaging and DSD labs/genetic evaluation.",
        "Document urine stream and any UTIs, obstruction, or associated anomalies."
      ],
      labs: [
        "No lab is needed for simple distal isolated hypospadias.",
        "Proximal hypospadias with nonpalpable testes or ambiguous genitalia can require karyotype, electrolytes/glucose, and endocrine testing as ordered."
      ],
      treatments: [
        "Refer to pediatric urology; repair is often planned in infancy when indicated, commonly around 6 to 18 months depending anatomy and local practice.",
        "Goals are a straight penis, urethral opening near the tip, usable urine stream, preserved sexual function, and acceptable appearance.",
        "Avoid circumcision before specialist evaluation because foreskin tissue may be needed for repair."
      ],
      nursingPriorities: [
        "Do not retract or circumcise without urology guidance.",
        "Assess for cryptorchidism or ambiguous genitalia; proximal hypospadias plus undescended testes is higher priority than cosmetic reassurance.",
        "Post-op, protect stent/catheter, monitor urine output, spasms, fever, bleeding, fistula signs, infection, pain, and dressing integrity.",
        "Teach caregivers normal post-op drainage expectations and red flags."
      ],
      complications: [
        "Urethrocutaneous fistula, meatal stenosis, urethral stricture, persistent chordee, spraying stream, recurrent surgery, UTI, sexual/fertility concerns, and psychosocial distress."
      ],
      redFlags: [
        "Hypospadias with bilateral nonpalpable testes, ambiguous genitalia, severe micropenis, vomiting/dehydration, hypoglycemia, hyponatremia, or hyperkalemia.",
        "Postoperative inability to void, catheter obstruction, fever, heavy bleeding, or wound breakdown."
      ],
      patientEducation: [
        "Keep urology follow-up and avoid circumcision until the surgeon has evaluated anatomy.",
        "After repair, call for fever, no urine drainage, catheter/stent displacement, heavy bleeding, worsening swelling, wound opening, or foul drainage.",
        "Long-term, report spraying stream, straining, recurrent UTIs, or curvature with erections."
      ],
      nclexTraps: [
        "Hypospadias is ventral/underside; epispadias is dorsal/top.",
        "Do not circumcise because foreskin may be needed for repair.",
        "Proximal hypospadias with undescended testes can signal DSD/adrenal risk.",
        "A hooded foreskin is a clue, not an indication for routine newborn circumcision."
      ],
      sourceKeys: ["ncbi-statpearls-hypospadias"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Failure to thrive",
      category: "Pediatrics",
      aliases: ["FTT", "growth faltering", "faltering growth", "pediatric poor weight gain"],
      pronunciation: "FAYL-yer tuh THRYV",
      definition: "Failure to thrive, more precisely growth faltering, is inadequate weight gain or growth trajectory for age/sex/gestation that signals insufficient usable nutrition, increased needs, malabsorption, chronic disease, or unsafe caregiving context.",
      etiology: "Causes group into inadequate intake, inadequate absorption, increased metabolic demand, and psychosocial/environmental factors. Examples include incorrect formula mixing, feeding skill problems, neglect/food insecurity, GERD, celiac disease, milk protein allergy, chronic infection, congenital heart disease, cystic fibrosis, renal disease, endocrine disease, and genetic syndromes.",
      pathology: "Weight is usually affected first because the body uses fat and muscle stores to maintain essential function. If the problem persists, length/height velocity slows, and head circumference can be affected in infants with severe or prolonged undernutrition.",
      pathophysiology: "The most important diagnostic tool is the growth curve over time, not a single small child. Weight-for-length/BMI, crossing down major percentiles, feeding history, observed feeds, stool pattern, developmental status, and family resources reveal the mechanism.",
      riskFactors: [
        "Prematurity, chronic disease, congenital heart disease, neurologic impairment, oral-motor dysfunction, cleft palate, recurrent vomiting/diarrhea, or high metabolic demand.",
        "Incorrect formula preparation, limited food access, caregiver depression/substance use, domestic violence, neglect, unsafe housing, or poor feeding routines.",
        "Medications that reduce appetite or chronic infections/inflammation."
      ],
      signsSymptoms: [
        "Poor weight gain, weight loss, crossing downward percentiles, low weight-for-length/BMI, loss of subcutaneous fat, irritability, fatigue, delayed milestones, or recurrent illness.",
        "Feeding red flags: choking/coughing, sweating with feeds, prolonged feeds, vomiting, diarrhea, refusal, rigid rituals, or caregiver-child conflict during meals.",
        "Dehydration, lethargy, hypothermia, bradycardia, or severe wasting signals urgent instability."
      ],
      diagnostics: [
        "Plot accurate weight, length/height, head circumference, and BMI/weight-for-length on the correct WHO/CDC chart using corrected age for prematurity when appropriate.",
        "Get a detailed feeding history: breast/formula technique, mixing recipe, ounces/calories, meal schedule, who feeds, duration, vomiting/stool pattern, and food security.",
        "Observe a feed when possible; oral-motor skill, caregiver response, fatigue, sweating, cough, and latch can reveal the cause.",
        "Targeted labs only when history/exam suggests disease: CBC, CMP, thyroid, celiac testing, ESR/CRP, urinalysis/culture, stool studies, sweat chloride, lead, or cardiac evaluation."
      ],
      labs: [
        "Routine broad lab panels have low yield without clues.",
        "Electrolytes/glucose matter urgently if dehydration, severe malnutrition, vomiting/diarrhea, or refeeding risk is present.",
        "Albumin/prealbumin are not simple nutrition scores and must be interpreted with inflammation and liver/kidney context."
      ],
      treatments: [
        "Treat instability first: dehydration, hypoglycemia, severe malnutrition, infection, or unsafe home situation.",
        "Create a nutrition plan with adequate calories/protein, correct formula mixing, feeding schedule, breastfeeding support, calorie fortification when ordered, and close weight follow-up.",
        "Treat the cause: reflux strategy, constipation plan, celiac diet, cardiac/respiratory disease management, swallow therapy, OT/speech feeding therapy, or social work resources.",
        "Hospitalize when severe malnutrition, dehydration, medical instability, failed outpatient plan, unsafe environment, or need for observed feeding exists."
      ],
      nursingPriorities: [
        "Weigh consistently with the same scale/process and avoid blaming language; the goal is pattern recognition and support.",
        "Verify formula mixing by having the caregiver demonstrate it.",
        "Screen for food insecurity, caregiver stress, postpartum depression, transportation barriers, and safety concerns.",
        "Monitor refeeding risk in severely malnourished children: phosphorus, potassium, magnesium, glucose, edema, and cardiac rhythm when ordered."
      ],
      complications: [
        "Developmental delay, impaired immunity, micronutrient deficiency, anemia, short stature, delayed puberty, cognitive/behavioral effects, hospitalization, and in severe cases organ dysfunction or death."
      ],
      redFlags: [
        "Dehydration, lethargy, hypoglycemia, hypothermia, severe wasting, bradycardia, or respiratory distress.",
        "Signs of abuse/neglect, unsafe feeding, or inability to obtain food/formula.",
        "Dysmorphic features, hepatosplenomegaly, persistent vomiting/diarrhea, blood in stool, recurrent pneumonia, cyanosis, or sweating with feeds."
      ],
      patientEducation: [
        "Use the exact formula recipe and feeding plan; small errors in powder-to-water ratio can cause underfeeding or dangerous electrolyte problems.",
        "Keep weight checks and bring bottles/formula/feeding logs to visits.",
        "Call for poor intake, fewer wet diapers, repeated vomiting, diarrhea, fever, lethargy, or weight loss."
      ],
      nclexTraps: [
        "A small child with steady growth may be normal; crossing down percentiles is more concerning.",
        "Do not order every lab first; feeding history and growth chart are high-yield.",
        "Formula mixing errors are common and important.",
        "Refeeding syndrome can occur when severely malnourished children start calories too quickly."
      ],
      sourceKeys: ["aafp-failure-to-thrive-practical-guide", "nice-faltering-growth"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Fetal alcohol spectrum disorder",
      category: "Pediatrics",
      aliases: ["FASD", "fetal alcohol syndrome", "FAS", "prenatal alcohol exposure"],
      pronunciation: "FEE-tul AL-kuh-hol SPEK-trum dis-OR-der",
      definition: "Fetal alcohol spectrum disorders are lifelong neurodevelopmental and physical effects caused by prenatal alcohol exposure; fetal alcohol syndrome is the most recognizable severe form.",
      etiology: "Alcohol crosses the placenta and exposes fetal tissues to ethanol and acetaldehyde. There is no known safe amount or timing of alcohol exposure in pregnancy; risk depends on dose, pattern, timing, maternal/fetal genetics, nutrition, and co-exposures.",
      pathology: "Alcohol acts as a teratogen. It disrupts neural crest migration, neuronal proliferation, synapse formation, apoptosis, placental function, and growth signaling. The result can be brain-based impairment even when classic facial features are absent.",
      pathophysiology: "The classic FAS pattern includes growth deficiency, central nervous system abnormality, and characteristic facial features: short palpebral fissures, smooth philtrum, and thin upper lip. Many children with FASD lack the full facial pattern but still have executive-function, learning, memory, attention, impulse-control, sensory, and adaptive-function deficits.",
      riskFactors: [
        "Alcohol use during pregnancy, especially binge drinking or continued use across pregnancy.",
        "Unplanned pregnancy with alcohol exposure before pregnancy recognition.",
        "Co-use of tobacco, other substances, poor nutrition, limited prenatal care, trauma, or untreated substance use disorder."
      ],
      signsSymptoms: [
        "Growth restriction, low birth weight, microcephaly, short palpebral fissures, smooth philtrum, thin upper lip, or other congenital anomalies in some clients.",
        "Developmental delay, learning disability, poor executive function, impulsivity, ADHD-like symptoms, social immaturity, sensory issues, sleep problems, speech/language delay, and difficulty learning from consequences.",
        "Infants may have feeding problems, irritability, sleep disturbance, or poor regulation."
      ],
      diagnostics: [
        "Diagnosis is clinical and multidisciplinary: prenatal alcohol exposure history when available, growth measurements, facial feature assessment, neurodevelopmental testing, hearing/vision evaluation, and review of medical/social history.",
        "Absence of facial features does not rule out alcohol-related neurodevelopmental impairment.",
        "Screen for trauma, neglect, ADHD, autism, learning disability, sleep disorder, and other genetic or environmental contributors without using them to dismiss FASD."
      ],
      labs: [
        "No single lab proves FASD after birth.",
        "Genetic testing or metabolic evaluation may be used when features suggest another syndrome.",
        "Pregnancy screening focuses on alcohol use and support, not punishment."
      ],
      treatments: [
        "No cure reverses prenatal alcohol injury; treatment is early intervention, stable routines, speech/OT/PT, educational accommodations, caregiver coaching, mental health care, and symptom-targeted medication when appropriate.",
        "Preventive treatment is complete alcohol avoidance during pregnancy and support for stopping alcohol use before and during pregnancy.",
        "Address safety, sleep, nutrition, trauma-informed care, and family resources."
      ],
      nursingPriorities: [
        "Use nonjudgmental, trauma-informed language; shame reduces disclosure and care.",
        "Teach that behavior is often brain-based difficulty with impulse control, memory, sequencing, and cause-effect learning.",
        "Help caregivers use concrete rules, visual routines, repetition, environmental structure, and close supervision.",
        "Screen pregnant clients for alcohol use and connect to treatment/support early."
      ],
      complications: [
        "Learning disability, ADHD, poor school performance, mental health disorders, substance use risk, legal/safety problems, sleep disturbance, unemployment, social vulnerability, and caregiver strain.",
        "Growth and congenital anomalies may persist depending severity."
      ],
      redFlags: [
        "Self-harm, unsafe impulsivity, severe aggression, exploitation risk, caregiver burnout, or unsafe home environment.",
        "Pregnancy with ongoing alcohol use and withdrawal risk."
      ],
      patientEducation: [
        "There is no known safe alcohol amount during pregnancy; stopping at any point helps reduce further risk.",
        "Children with FASD learn best with repetition, structure, visual cues, concrete instructions, and supportive school plans.",
        "Ask for early intervention and neurodevelopmental evaluation rather than waiting for repeated school failure."
      ],
      nclexTraps: [
        "FASD can exist without the classic face.",
        "Do not label the child as simply defiant when memory/executive dysfunction is driving behavior.",
        "Prevention messaging should be clear but nonjudgmental.",
        "Fetal alcohol syndrome is one diagnosis within the broader FASD spectrum."
      ],
      sourceKeys: ["cdc-fasd-about"],
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    },
    {
      name: "Abdominal aortic aneurysm",
      category: "Cardiac/Vascular",
      aliases: ["AAA", "aortic aneurysm - abdominal"],
      definition: "Abdominal aortic aneurysm is dilation or ballooning of the abdominal aorta caused by weakness in the aortic wall.",
      etiology: "Risk increases with smoking, older age, male sex, hypertension, atherosclerotic vascular disease, family history, and connective-tissue disorders.",
      pathology: "The abdominal aortic wall weakens and enlarges over time. The danger is rupture: blood can escape into the retroperitoneum or abdomen, causing sudden severe abdominal/back/flank pain, hypovolemic shock, and death if not repaired rapidly.",
      pathophysiology: "Aortic wall degeneration plus ongoing pressure enlarges the vessel diameter. Larger or rapidly growing aneurysms have higher rupture risk; rupture causes internal hemorrhage and poor distal perfusion.",
      riskFactors: ["Smoking history", "Male sex and age over 60-65", "Hypertension", "Atherosclerosis or peripheral vascular disease", "Family history of AAA", "Connective-tissue disorder"],
      signsSymptoms: ["Often asymptomatic until found on screening or imaging", "Deep abdominal, back, flank, groin, buttock, or leg pain", "Pulsatile abdominal mass or pulsating sensation", "Syncope, dizziness, clammy skin, tachycardia, hypotension, or shock with rupture"],
      diagnostics: ["Abdominal ultrasound for screening or initial detection", "CT/CTA to define size, rupture concern, or surgical planning", "Assess lower-extremity pulses and perfusion", "CBC, type and crossmatch, renal function, and hemodynamic monitoring if rupture suspected"],
      labs: ["Hemoglobin/hematocrit can fall with bleeding", "Creatinine matters before contrast and surgery", "Type and crossmatch if rupture or repair is possible"],
      treatments: ["Risk-factor control and serial ultrasound/CT monitoring for small stable aneurysms", "Open repair or endovascular aneurysm repair for large, rapidly growing, symptomatic, leaking, or ruptured aneurysms", "Emergency surgery and blood-product resuscitation for rupture"],
      nursingPriorities: ["Do not deeply palpate a suspected pulsatile abdominal mass.", "Treat sudden severe back/abdominal pain with hypotension as possible rupture.", "Maintain IV access, monitor BP/HR/perfusion, prepare for blood products and surgical/endovascular repair.", "After repair, monitor distal pulses, renal function, bleeding, graft complications, and abdominal/back pain recurrence."],
      complications: ["Rupture", "Hypovolemic shock", "Aortic dissection or leak", "Distal embolization or limb ischemia", "Renal hypoperfusion", "Death"],
      patientEducation: ["Stop smoking, control blood pressure, keep imaging follow-up, and seek emergency care for sudden severe abdominal/back/flank pain, fainting, or shock symptoms."],
      nclexTraps: ["AAA may be silent; a stable screening aneurysm is not cared for like a ruptured aneurysm.", "The classic triad is abdominal/back pain, hypotension/shock, and pulsatile mass, but all three are not always present.", "Ultrasound is common for screening; CT/CTA is used for detail and planning when stable."]
    },
    {
      name: "Abdominal trauma",
      category: "MSK/Skin/Trauma",
      aliases: ["blunt abdominal trauma", "penetrating abdominal trauma"],
      definition: "Abdominal trauma is blunt or penetrating injury that may damage the abdominal wall, solid organs, hollow viscera, vasculature, kidneys/bladder/ureters, or diaphragm.",
      etiology: "Common mechanisms include motor-vehicle collision, fall, assault, handlebar injury, blast injury, stab wound, and gunshot wound.",
      pathology: "Blunt or penetrating force can lacerate solid organs, rupture hollow organs, tear blood vessels, or create hematomas. Solid-organ or vascular injury causes internal hemorrhage; bowel or bladder perforation leaks contents into the peritoneum and causes peritonitis/sepsis.",
      pathophysiology: "Hemorrhage reduces circulating volume and oxygen delivery. Hollow-viscus injury may look subtle early, then worsen as peritonitis, sepsis, or abdominal compartment syndrome develops.",
      riskFactors: ["High-energy deceleration injury", "Seatbelt sign or handlebar mark", "Penetrating wound to abdomen, flank, back, lower chest, buttock, or perineum", "Anticoagulant use", "Distracting injury or altered sensorium"],
      signsSymptoms: ["Abdominal pain or tenderness", "Guarding, rebound, rigidity, or peritoneal signs", "Seatbelt sign or abdominal ecchymosis", "Distention or increasing girth", "Tachycardia, hypotension, cool clammy skin, or shock", "Shoulder pain with splenic irritation", "Hematuria or pelvic/perineal bruising with GU injury"],
      diagnostics: ["Primary survey and repeated abdominal exams", "FAST/E-FAST ultrasound for intraperitoneal free fluid in unstable or initial trauma assessment", "CT abdomen/pelvis with IV contrast when stable", "CBC/serial hemoglobin and hematocrit", "Type and crossmatch", "Urinalysis for hematuria", "Lactate/base deficit if shock suspected"],
      labs: ["Hemoglobin/hematocrit may fall with bleeding", "Lactate/base deficit can rise with shock", "WBC may rise with inflammation or perforation", "Creatinine matters before contrast"],
      treatments: ["Airway, breathing, circulation, hemorrhage control, and damage-control resuscitation", "Immediate laparotomy for hemodynamic instability, peritonitis, evisceration, or many penetrating injuries as directed", "Observation, serial exams, embolization, or operative repair depending injury and stability", "Antibiotics when hollow-viscus injury or surgery is expected"],
      nursingPriorities: ["Trend vital signs, pain, mental status, abdominal exam, urine output, and skin perfusion.", "Keep NPO, maintain large-bore IV access, prepare blood products, and anticipate CT/FAST/OR based on stability.", "Report worsening pain, guarding, hypotension, tachycardia, falling hematocrit, fever, leukocytosis, low urine output, or ventilatory difficulty."],
      complications: ["Hemorrhagic shock", "Peritonitis", "Sepsis", "Abdominal compartment syndrome", "Delayed splenic/liver hematoma rupture", "Bowel obstruction or ileus", "Intra-abdominal abscess"],
      patientEducation: ["After discharge from observed solid-organ injury, avoid restricted activity as ordered and return for worsening abdominal pain, dizziness, fever, vomiting, fainting, or weakness."],
      nclexTraps: ["A soft abdomen once does not clear trauma; repeated assessment matters.", "Seatbelt sign is a clue for possible internal injury, not a bruise to ignore.", "FAST finds free fluid quickly but does not rule out every hollow-organ injury."]
    },
    {
      name: "ABO incompatibility",
      category: "Maternal/Newborn/Reproductive",
      aliases: ["ABO hemolytic disease of the newborn", "ABO HDN", "newborn ABO incompatibility"],
      definition: "ABO incompatibility occurs when maternal antibodies target fetal/newborn A or B red-cell antigens, causing hemolysis and neonatal jaundice risk.",
      etiology: "It is most often clinically important when a type O mother has a type A, B, or AB newborn and maternal IgG anti-A or anti-B crosses the placenta.",
      pathology: "Maternal IgG antibodies attach to newborn red blood cells, causing hemolysis. Hemoglobin breakdown increases unconjugated bilirubin; the newborn liver may not clear bilirubin fast enough, so jaundice and hyperbilirubinemia can develop early.",
      pathophysiology: "Hemolysis raises bilirubin production. Severe or rapidly rising bilirubin can cross into brain tissue and cause bilirubin-induced neurologic dysfunction or kernicterus if not treated.",
      riskFactors: ["Type O birthing parent with type A or B newborn", "Early jaundice in first 24 hours", "Positive direct antiglobulin test/direct Coombs", "Sibling with significant jaundice", "Prematurity or additional neurotoxicity risks"],
      signsSymptoms: ["Jaundice, often early", "Yellow skin/sclera", "Poor feeding or lethargy if bilirubin is significant", "Pallor or anemia in more severe hemolysis", "Dark urine is not the usual unconjugated pattern and should prompt evaluation"],
      diagnostics: ["Maternal and newborn ABO/Rh type", "Direct antiglobulin test/direct Coombs on newborn blood", "Total and direct bilirubin plotted by age in hours and gestational age", "Hemoglobin/hematocrit and reticulocyte count when hemolysis suspected", "Assess risk factors for bilirubin neurotoxicity"],
      labs: ["Unconjugated bilirubin rises", "Direct Coombs may be positive", "Hemoglobin/hematocrit may be low", "Reticulocytes may increase"],
      treatments: ["Frequent feeding and hydration support", "Phototherapy based on bilirubin nomogram/risk factors", "IVIG or exchange transfusion for selected severe isoimmune hemolysis per neonatal protocol", "Follow-up bilirubin and anemia monitoring after discharge"],
      nursingPriorities: ["Assess jaundice under good light and do not rely on skin color during phototherapy.", "Protect eyes/skin during phototherapy per policy, maximize skin exposure, monitor temperature, hydration, stools, and bilirubin trend.", "Teach parents to report worsening jaundice, poor feeding, lethargy, high-pitched cry, or decreased wet diapers."],
      complications: ["Severe hyperbilirubinemia", "Acute bilirubin encephalopathy", "Kernicterus", "Anemia", "Need for exchange transfusion in severe cases"],
      patientEducation: ["Keep newborn follow-up and bilirubin checks. Seek care for increasing jaundice, sleepiness, poor feeding, fewer wet diapers, or abnormal tone/cry."],
      nclexTraps: ["ABO incompatibility can occur in a first pregnancy; it is not the same teaching pattern as classic Rh sensitization.", "Phototherapy treats bilirubin, not the antibody itself.", "A negative or weak Coombs does not always eliminate concern if jaundice is early or rising quickly."]
    },
    {
      name: "Absence seizure",
      category: "Neuro",
      aliases: ["petit mal seizure", "childhood absence epilepsy"],
      definition: "Absence seizures are brief generalized seizures with sudden impaired awareness, usually staring and interruption of activity, followed by rapid return to baseline.",
      etiology: "Typical absence seizures are usually part of genetic generalized epilepsy syndromes in children. Hyperventilation can provoke typical absence seizures during evaluation.",
      pathology: "Abnormal thalamocortical network firing produces brief, generalized spike-and-wave seizure activity. Consciousness pauses for seconds, but there is usually no prolonged postictal confusion.",
      pathophysiology: "Typical EEG shows generalized spike-and-wave discharges, classically around 3-Hz in childhood absence epilepsy, with abrupt onset and termination.",
      riskFactors: ["Childhood onset, often school-age", "Family history of generalized seizures", "Episodes misread as daydreaming or inattention", "Hyperventilation trigger during testing"],
      signsSymptoms: ["Brief staring spell", "Sudden pause in speech or activity", "Unresponsive for seconds", "Eyelid flutter or subtle automatisms may occur", "Immediate return to baseline", "Usually no postictal lethargy or confusion"],
      diagnostics: ["EEG with generalized spike-and-wave activity, often 3-Hz in classic childhood absence epilepsy", "Hyperventilation during EEG may provoke event", "History from teachers/family because events can be frequent and subtle", "Differentiate from focal impaired-awareness seizures, syncope, and inattention"],
      labs: ["No diagnostic routine lab; medication labs may be needed depending antiseizure therapy."],
      treatments: ["Ethosuximide is classic first-line therapy for absence-only seizures", "Valproate may be used when generalized tonic-clonic seizures also occur or when ordered", "Lamotrigine is another option but may be less effective for absence-only control", "Avoid seizure triggers and follow neurology plan"],
      nursingPriorities: ["Maintain safety during brief events and document frequency, duration, triggers, and recovery.", "Teach school safety plan and medication adherence.", "Monitor ethosuximide for GI upset, fatigue, mood changes, and rare blood dyscrasias as ordered."],
      complications: ["Learning problems from frequent unrecognized seizures", "Injury if event occurs during swimming, heights, street crossing, or machinery", "Progression to other generalized seizure types in some syndromes"],
      patientEducation: ["Events may look like daydreaming but are not voluntary. Keep seizure logs, supervise water activities, and follow activity restrictions until cleared."],
      nclexTraps: ["Absence seizures are brief staring spells, not convulsive tonic-clonic events.", "No postictal confusion is a major clue.", "Ethosuximide treats absence seizures; phenytoin is not the classic answer and can worsen some generalized seizure patterns."]
    },
    {
      name: "Acute respiratory failure",
      category: "Respiratory",
      aliases: ["acute respiratory insufficiency", "ARF respiratory"],
      definition: "Acute respiratory failure is an emergency in which gas exchange fails suddenly, causing inadequate oxygenation, inadequate carbon dioxide removal, or both.",
      etiology: "Causes include pneumonia, COPD/asthma exacerbation, pulmonary edema, ARDS, pulmonary embolism, chest trauma, neuromuscular weakness, CNS depression, opioid/sedative overdose, airway obstruction, and sepsis.",
      pathology: "The lungs, airway, respiratory muscles, or brain drive cannot maintain oxygen delivery and carbon dioxide elimination. Hypoxemic failure mainly lowers PaO2; hypercapnic failure raises PaCO2 from inadequate ventilation.",
      pathophysiology: "Ventilation-perfusion mismatch, shunt, diffusion impairment, alveolar hypoventilation, or respiratory muscle fatigue reduces gas exchange. Brain and heart function deteriorate quickly when oxygen is low or CO2/pH are severely abnormal.",
      riskFactors: ["COPD or severe asthma", "Pneumonia or sepsis", "Pulmonary edema or heart failure", "ARDS risk", "Opioids/sedatives/alcohol overdose", "Neuromuscular disease", "Chest trauma or inhalation injury"],
      signsSymptoms: ["Dyspnea or air hunger", "Tachypnea or very slow/shallow respirations", "Accessory muscle use", "Cyanosis", "Confusion, agitation, somnolence, or loss of consciousness", "Arrhythmia or tachycardia", "Low SpO2 or rising oxygen requirement"],
      diagnostics: ["Pulse oximetry", "Arterial blood gas for PaO2, PaCO2, and pH", "Chest x-ray or other imaging for cause", "Capnography when ventilatory failure or airway management is relevant", "ECG and labs based on suspected trigger"],
      labs: ["ABG may show low PaO2, high PaCO2, acidemia, or mixed disorder", "Lactate may rise if shock/hypoxia", "CBC/CMP/cultures/troponin/BNP as cause-directed"],
      treatments: ["Position airway and give oxygen to target saturation per condition", "Treat the cause", "Bronchodilators, antibiotics, diuretics, reversal agents, anticoagulation, or steroids when indicated", "Noninvasive ventilation or mechanical ventilation if oxygenation/ventilation or work of breathing fails"],
      nursingPriorities: ["Assess airway, work of breathing, mental status, SpO2 trend, lung sounds, ABG results, and fatigue.", "Escalate rapidly for inability to speak, cyanosis, decreasing respiratory rate with exhaustion, worsening confusion, or persistent hypoxemia.", "Prepare for ventilatory support if oxygen alone is not enough."],
      complications: ["Cardiac arrest", "Dysrhythmias", "Shock", "Respiratory acidosis", "Brain injury from hypoxemia", "Ventilator-associated complications"],
      patientEducation: ["For chronic-risk clients, teach when to seek emergency care: worsening shortness of breath, trouble speaking, blue lips, confusion, severe sleepiness, or oxygen saturation below the ordered threshold."],
      nclexTraps: ["A normal or falling respiratory rate can be bad if the client is tiring.", "Oxygenation and ventilation are not the same; SpO2 can miss rising CO2.", "Acute respiratory failure requires cause treatment, not oxygen alone."]
    },
    {
      name: "Uterine atony",
      category: "Maternal/Newborn/Reproductive",
      aliases: ["atony of uterus", "boggy uterus", "atonic postpartum hemorrhage"],
      definition: "Uterine atony is failure of the uterus to contract firmly after birth, causing postpartum hemorrhage risk.",
      etiology: "Risk factors include uterine overdistention, prolonged or very rapid labor, prolonged oxytocin exposure, magnesium sulfate, chorioamnionitis, high parity, retained placental tissue, placenta disorders, prior postpartum hemorrhage, and coagulopathy.",
      pathology: "After placental delivery, myometrial contraction should compress uterine blood vessels. If the uterus stays soft or boggy, vessels remain open and heavy lochia/bleeding can progress to postpartum hemorrhage and shock.",
      pathophysiology: "Tone failure is the most common postpartum hemorrhage mechanism. Bleeding continues until uterine contraction, uterotonics, tamponade, repair, or surgery controls the source.",
      riskFactors: ["Overdistended uterus from multiple gestation, polyhydramnios, or macrosomia", "Prolonged labor or precipitous birth", "Magnesium sulfate", "Chorioamnionitis", "Retained placenta", "Prior postpartum hemorrhage", "Grand multiparity"],
      signsSymptoms: ["Boggy uterus or soft enlarged fundus", "Heavy lochia or saturating pads", "Large clots", "Fundus rising or deviated if bladder distended", "Tachycardia, hypotension, pallor, dizziness, or shock"],
      diagnostics: ["Fundal tone and location assessment", "Quantified blood loss", "Vital-sign trend", "Inspect for retained tissue and lacerations if uterus firms but bleeding continues", "CBC, fibrinogen/coagulation studies, type and crossmatch when hemorrhage significant"],
      labs: ["Hemoglobin/hematocrit may fall", "Platelets/coagulation labs if severe bleeding or DIC risk", "Fibrinogen can fall in major obstetric hemorrhage"],
      treatments: ["Fundal massage and bimanual compression per protocol", "Empty bladder", "Oxytocin first-line uterotonic as ordered", "Additional uterotonics such as methylergonovine, carboprost, or misoprostol when appropriate and not contraindicated", "Tranexamic acid, balloon tamponade, transfusion, embolization, or surgery if bleeding persists"],
      nursingPriorities: ["Massage a boggy fundus and call for help while assessing bleeding.", "Maintain IV access, give ordered uterotonics, quantify blood loss, monitor vitals, and prepare blood products.", "Reassess uterus after intervention; if firm but bleeding continues, suspect laceration, retained tissue, inversion, or coagulopathy."],
      complications: ["Postpartum hemorrhage", "Hypovolemic shock", "DIC", "Severe anemia", "Renal injury", "Maternal death"],
      patientEducation: ["Report soaking a pad in an hour, passing large clots, dizziness, fainting, racing heart, or persistent heavy bleeding after discharge."],
      nclexTraps: ["Boggy fundus plus heavy lochia means massage first and call for help.", "If the fundus is firm but bleeding continues, think trauma/laceration rather than more massage only.", "Methylergonovine is avoided/clarified in hypertension; carboprost is avoided/clarified in asthma."]
    },
    {
      name: "Wound dehiscence",
      category: "MSK/Skin/Trauma",
      aliases: ["surgical wound dehiscence", "incision separation", "evisceration risk"],
      definition: "Wound dehiscence is partial or complete separation of a surgical incision before it has healed.",
      etiology: "Risk factors include infection, poor tissue perfusion, diabetes, obesity, malnutrition, smoking/nicotine, corticosteroids, increased abdominal pressure from coughing/vomiting/straining, poor closure, and early heavy lifting.",
      pathology: "The healing incision loses tensile strength and separates. If the fascial layer opens after abdominal surgery, bowel or other organs can protrude through the wound, called evisceration, which is a surgical emergency.",
      pathophysiology: "Poor collagen formation, infection, tension, or pressure disrupts wound approximation. Separation increases infection risk and can progress from superficial skin opening to deep fascial failure.",
      riskFactors: ["Postoperative infection", "Diabetes or poor glycemic control", "Obesity", "Malnutrition or low protein", "Smoking/nicotine", "Chronic steroids or immunosuppression", "Coughing, vomiting, straining, or heavy lifting", "Abdominal surgery"],
      signsSymptoms: ["Incision edges separating", "New serosanguineous drainage or popping sensation", "Visible underlying tissue", "Redness, warmth, swelling, pain, fever, or purulent drainage if infected", "Protruding bowel/organs with evisceration"],
      diagnostics: ["Focused wound assessment including depth, drainage, odor, tissue color, and approximation", "Vital signs and infection assessment", "Wound culture if infection suspected", "CBC/glucose/nutrition markers as clinically indicated", "Surgical evaluation for deep dehiscence or evisceration"],
      labs: ["WBC may rise with infection", "Glucose affects healing", "Albumin/prealbumin may support nutrition assessment when ordered"],
      treatments: ["Notify surgeon/provider", "Support incision and reduce strain", "Wound care, dressing changes, antibiotics, negative-pressure therapy, or re-closure depending severity", "Emergency surgery for evisceration or fascial dehiscence"],
      nursingPriorities: ["For evisceration, stay with client, call for emergency help, place supine with knees bent if tolerated, cover protruding organs with sterile saline-moistened dressings, keep NPO, and do not push organs back in.", "Teach splinting when coughing and avoid heavy lifting/straining.", "Monitor for infection, increasing drainage, pain, fever, and wound widening."],
      complications: ["Evisceration", "Infection", "Delayed healing", "Sepsis", "Hernia", "Need for reoperation"],
      patientEducation: ["Report wound opening, new drainage, fever, increasing redness/warmth, sudden popping, or any visible tissue/organ immediately. Support the incision when coughing and follow lifting restrictions."],
      nclexTraps: ["Evisceration is an emergency: cover with sterile saline-moistened dressing and call for help; never reinsert organs.", "A sudden gush of serosanguineous drainage after abdominal surgery can precede dehiscence.", "Coughing/straining can trigger separation, so splinting and stool-softener teaching matter."]
    },
    {
      name: "Acute decompensated heart failure",
      category: "Cardiac/Vascular",
      aliases: ["ADHF", "acute heart failure exacerbation", "acute CHF exacerbation", "flash pulmonary edema"],
      definition: "Acute decompensated heart failure is sudden or worsening heart failure with congestion, impaired oxygenation, and sometimes low cardiac output.",
      etiology: "Common triggers include myocardial ischemia or infarction, dysrhythmias such as atrial fibrillation, uncontrolled hypertension, infection, pulmonary embolism, renal dysfunction, excess sodium/fluid intake, missed diuretics, NSAIDs, and other medications that worsen fluid retention.",
      pathology: "The failing ventricle cannot handle preload/afterload demands. Filling pressures rise, causing pulmonary edema and systemic venous congestion; if forward flow falls, kidneys, brain, and other organs become underperfused and cardiogenic shock can develop.",
      pathophysiology: "Neurohormonal activation, sodium/water retention, and elevated ventricular filling pressures drive dyspnea, crackles, edema, weight gain, and worsening renal function. Severe pulmonary edema impairs gas exchange and can rapidly become respiratory failure.",
      riskFactors: ["Known heart failure", "Coronary artery disease or MI", "Hypertension", "Atrial fibrillation or other dysrhythmia", "Kidney disease", "High sodium intake or missed diuretics", "NSAID or thiazolidinedione use", "Infection"],
      signsSymptoms: ["Dyspnea, orthopnea, paroxysmal nocturnal dyspnea", "Crackles, wheeze, pink frothy sputum, or hypoxemia with pulmonary edema", "Jugular venous distention", "Peripheral edema and rapid weight gain", "Tachycardia, S3, fatigue", "Oliguria, cool clammy skin, confusion, or hypotension if low output"],
      diagnostics: ["Focused airway/breathing/circulation assessment", "Pulse oximetry and possible ABG if severe distress", "Chest x-ray for pulmonary edema or effusions", "ECG and troponin to check ischemia/dysrhythmia triggers", "BNP or NT-proBNP to support diagnosis", "BMP including potassium/creatinine, magnesium, liver tests, and echocardiography when indicated"],
      labs: ["BNP/NT-proBNP often elevated", "Creatinine/BUN may rise with poor perfusion or diuresis", "Potassium and magnesium may be abnormal", "Troponin may rise with MI or demand ischemia", "Hyponatremia can signal severe congestion"],
      treatments: ["Oxygen only if hypoxemic or in respiratory distress", "Noninvasive ventilation or intubation for severe pulmonary edema/respiratory failure", "IV loop diuretic such as furosemide for fluid overload", "Vasodilators such as nitroglycerin when hypertensive and ordered", "Inotropes/vasopressors and ICU care for cardiogenic shock", "Treat the trigger such as MI, dysrhythmia, infection, or medication nonadherence"],
      nursingPriorities: ["Sit upright, assess work of breathing, lung sounds, oxygen saturation, blood pressure, perfusion, and mental status.", "Track strict intake/output, urine response to IV loop diuretic, daily weights, edema, potassium, magnesium, and renal function.", "Escalate rapidly for pink frothy sputum, worsening hypoxemia, hypotension, new chest pain, dysrhythmia, low urine output, or altered mental status."],
      complications: ["Pulmonary edema", "Acute respiratory failure", "Cardiogenic shock", "Acute kidney injury", "Dysrhythmias", "Electrolyte derangements", "Hepatic congestion", "Death"],
      patientEducation: ["Teach daily weights, sodium/fluid plan if prescribed, medication adherence, avoiding NSAIDs unless approved, and reporting rapid weight gain, worsening dyspnea, edema, or needing more pillows to breathe."],
      nclexTraps: ["Do not lay a client with pulmonary edema flat for a long assessment.", "Edema does not automatically mean give IV fluids; assess perfusion and congestion first.", "BNP supports the picture but does not replace airway assessment, lung sounds, renal function, ECG, and trigger search.", "IV loop diuretic response is judged by urine output, breathing, weight/fluid balance, blood pressure, and electrolytes."]
    },
    {
      name: "Acute limb ischemia",
      category: "Cardiac/Vascular",
      aliases: ["ALI", "acute arterial occlusion", "acute extremity ischemia", "acute leg ischemia"],
      definition: "Acute limb ischemia is a sudden drop in arterial blood flow to an extremity that threatens limb viability.",
      etiology: "Common causes include embolus from atrial fibrillation or cardiac thrombus, thrombosis on peripheral artery disease, graft or stent thrombosis, trauma, arterial dissection, aneurysm thrombosis, and hypercoagulable states.",
      pathology: "An acute arterial blockage deprives distal nerves and muscles of oxygen. Nerves fail early, then muscle necrosis, rhabdomyolysis, reperfusion injury, compartment syndrome, amputation, or death can occur if blood flow is not restored.",
      pathophysiology: "Because collateral circulation is not prepared for the sudden occlusion, symptoms progress quickly. Paresthesia and paralysis suggest threatened limb and need urgent revascularization evaluation.",
      riskFactors: ["Atrial fibrillation", "Peripheral artery disease", "Smoking", "Diabetes", "Recent vascular procedure or graft", "Hypercoagulable disorder", "Trauma", "Known aneurysm"],
      signsSymptoms: ["Six Ps: pain, pallor, pulselessness, paresthesia, paralysis, and poikilothermia/cold limb", "Mottled or cyanotic skin", "Delayed capillary refill", "Decreased motor or sensory function", "Severe pain out of proportion or sudden rest pain"],
      diagnostics: ["Compare bilateral pulses, color, temperature, capillary refill, sensation, and movement", "Handheld Doppler pulse assessment", "ABI, duplex ultrasound, CTA, or angiography when the client is stable enough", "ECG to look for atrial fibrillation", "Creatinine before contrast when possible", "CK, lactate, potassium, coagulation studies, and type/screen when severe or procedural care likely"],
      labs: ["CK may rise with muscle injury", "Potassium may rise with ischemia or reperfusion", "Lactate may rise with severe ischemia", "Creatinine guides contrast and renal risk"],
      treatments: ["Urgent vascular surgery/interventional consultation", "IV unfractionated heparin unless contraindicated", "Analgesia and NPO status while preparing for possible procedure", "Catheter-directed thrombolysis, thrombectomy, embolectomy, bypass, angioplasty/stenting, or amputation depending viability", "Fasciotomy if compartment syndrome develops"],
      nursingPriorities: ["Perform frequent neurovascular checks and mark/report changes in pulses, pain, sensation, movement, color, and temperature.", "Keep the limb protected and avoid compression, heat/cold packs, massage, or high elevation that can further reduce arterial flow.", "Prepare for heparin, labs, imaging, NPO status, and urgent revascularization; time is limb."],
      complications: ["Limb loss", "Compartment syndrome", "Rhabdomyolysis", "Hyperkalemia after reperfusion", "Acute kidney injury", "Sepsis/gangrene", "Death"],
      patientEducation: ["Teach urgent reporting of sudden severe limb pain, cold pale limb, numbness/weakness, or absent pulse, and prevention through smoking cessation, anticoagulation adherence when prescribed, PAD care, and atrial fibrillation follow-up."],
      nclexTraps: ["The six Ps are arterial ischemia clues, not routine DVT symptoms.", "Paralysis or anesthesia is late and limb-threatening.", "Do not delay provider/vascular notification while waiting for every diagnostic test.", "A Doppler signal does not mean the limb is safe if neuro deficits are progressing."]
    },
    {
      name: "Acute lymphoblastic leukemia",
      category: "Hematology/Oncology",
      aliases: ["ALL", "acute lymphocytic leukemia", "acute lymphoid leukemia"],
      definition: "Acute lymphoblastic leukemia is an aggressive leukemia in which immature lymphoblasts overgrow in bone marrow, blood, and sometimes extramedullary sites.",
      etiology: "Most cases have no single identifiable cause. Risk is increased with some genetic syndromes, prior chemotherapy/radiation, high radiation exposure, and certain cytogenetic changes such as Philadelphia chromosome in some clients.",
      pathology: "Lymphoblasts crowd out normal marrow production, causing anemia, neutropenia/infection risk, and thrombocytopenia/bleeding risk. ALL can spread to the CNS, testes, lymph nodes, liver, and spleen, and treatment can trigger tumor lysis syndrome.",
      pathophysiology: "The acute blast burden rises quickly. Circulating WBC may be high, normal, or low, so ANC, hemoglobin, platelets, blasts, and clinical infection/bleeding cues matter more than total WBC alone.",
      riskFactors: ["Down syndrome or other genetic syndromes", "Prior chemotherapy or radiation", "High radiation exposure", "Male sex", "Older adult age for adult ALL", "Philadelphia chromosome or other high-risk cytogenetics"],
      signsSymptoms: ["Fatigue, pallor, dyspnea from anemia", "Fever or recurrent infections from neutropenia", "Easy bruising, petechiae, mucosal bleeding", "Bone or joint pain", "Painless lymphadenopathy, hepatosplenomegaly", "Headache, vomiting, cranial nerve findings, or neurologic change if CNS involvement"],
      diagnostics: ["CBC with differential", "Peripheral smear for blasts", "Bone marrow aspiration/biopsy", "Flow cytometry/immunophenotyping", "Cytogenetic and molecular testing such as BCR-ABL1", "Lumbar puncture for CNS assessment/prophylaxis planning"],
      labs: ["Hemoglobin may be low", "Platelets often low", "ANC may be low", "Blasts may be present", "LDH and uric acid may be high", "Electrolytes can shift with tumor lysis"],
      treatments: ["Multiagent chemotherapy with induction and consolidation/maintenance phases", "CNS prophylaxis with intrathecal chemotherapy", "Targeted therapy for selected mutations such as Philadelphia chromosome-positive disease", "Immunotherapy or stem cell transplant for selected clients", "Transfusion, antimicrobials, and tumor lysis prophylaxis/support"],
      nursingPriorities: ["Treat fever in neutropenia as urgent; obtain cultures and start ordered antibiotics promptly.", "Use bleeding precautions, infection precautions, central-line care, and monitor CBC, uric acid, potassium, phosphorus, calcium, creatinine, and hydration during therapy.", "Assess neurologic symptoms because CNS prophylaxis and CNS relapse are key ALL issues."],
      complications: ["Sepsis", "Severe bleeding", "Tumor lysis syndrome", "CNS disease or relapse", "Anemia-related hypoxia", "Medication toxicity", "Relapse"],
      patientEducation: ["Teach fever reporting, infection prevention, bleeding precautions, adherence to long treatment phases, central-line safety, and why lumbar puncture/intrathecal therapy may be part of care."],
      nclexTraps: ["A low or normal WBC does not rule out acute leukemia.", "CNS prophylaxis matters in ALL even when neurologic symptoms are absent.", "Tumor lysis labs can become the priority after therapy starts.", "Bone pain plus bruising/infections in a child is not simply growing pains."]
    },
    {
      name: "Acute myeloid leukemia",
      category: "Hematology/Oncology",
      aliases: ["AML", "acute myelogenous leukemia", "acute nonlymphocytic leukemia"],
      definition: "Acute myeloid leukemia is an aggressive malignancy of myeloid precursor cells with rapid accumulation of myeloblasts in marrow and blood.",
      etiology: "Risk increases with older age, prior chemotherapy or radiation, myelodysplastic syndrome, benzene exposure, smoking, Down syndrome, and inherited marrow-failure or leukemia predisposition syndromes.",
      pathology: "Myeloblasts replace normal marrow and cause pancytopenia. Auer rods support myeloid lineage; acute promyelocytic leukemia is an AML subtype strongly associated with DIC and is treated as an emergency.",
      pathophysiology: "Marrow failure causes anemia, neutropenia, and thrombocytopenia. High blast burden and treatment can produce tumor lysis; very high WBC can cause leukostasis with respiratory or neurologic compromise.",
      riskFactors: ["Older age", "Prior chemotherapy/radiation", "Myelodysplastic syndrome", "Benzene exposure", "Smoking", "Down syndrome", "Inherited marrow-failure syndromes"],
      signsSymptoms: ["Fatigue, pallor, dyspnea", "Fever or infection", "Easy bruising, petechiae, epistaxis, gum bleeding", "Bone pain", "Weight loss or night sweats", "Gingival hypertrophy or skin lesions in some subtypes", "Neurologic/respiratory symptoms if leukostasis"],
      diagnostics: ["CBC with differential", "Peripheral smear for blasts or Auer rods", "Bone marrow aspiration/biopsy", "Flow cytometry", "Cytogenetic and molecular testing", "Coagulation studies when APL/DIC possible"],
      labs: ["Hemoglobin low", "Platelets low", "ANC often low", "WBC may be high, normal, or low", "Blasts present", "Uric acid/LDH may be high", "PT/PTT/fibrinogen/D-dimer may show DIC in APL"],
      treatments: ["Induction chemotherapy when appropriate", "Consolidation therapy or stem cell transplant for selected clients", "Targeted agents based on mutations/subtype", "ATRA/arsenic-based urgent therapy when APL is suspected per protocol", "Transfusions, antimicrobials, tumor lysis prophylaxis, and supportive care"],
      nursingPriorities: ["Escalate fever in neutropenia, bleeding, neurologic change, dyspnea, or DIC signs immediately.", "Use bleeding and infection precautions; monitor CBC, coagulation studies, electrolytes, uric acid, renal function, and treatment complications.", "If APL is suspected, anticipate urgent differentiation therapy and aggressive DIC monitoring."],
      complications: ["Sepsis", "Hemorrhage", "DIC, especially APL", "Tumor lysis syndrome", "Leukostasis", "Severe anemia", "Relapse", "Treatment toxicity"],
      patientEducation: ["Teach fever and bleeding reporting, infection prevention, avoiding rectal temps/suppositories when neutropenic or thrombocytopenic unless ordered, and why transfusions and frequent labs are needed."],
      nclexTraps: ["AML blasts do not function like normal WBCs, so a high WBC can still mean infection risk.", "Auer rods point toward AML; bleeding/DIC with suspected APL is an emergency.", "Induction chemotherapy can quickly shift potassium, phosphorus, calcium, uric acid, and kidney function.", "Do not give IM injections or unnecessary invasive procedures when platelets are dangerously low."]
    },
    {
      name: "Acute rejection",
      category: "Immune/Infectious",
      aliases: ["acute transplant rejection", "acute graft rejection", "allograft rejection"],
      definition: "Acute rejection is immune-mediated injury to a transplanted organ that causes new or worsening graft dysfunction.",
      etiology: "Risk rises with HLA or donor-recipient mismatch, inadequate immunosuppression, missed immunosuppressant doses, medication interactions that lower drug levels, prior rejection, infection/inflammation, and donor-specific antibodies.",
      pathology: "Recipient immune cells and/or antibodies recognize donor alloantigens. T-cell-mediated rejection and antibody-mediated rejection injure graft tissue and vessels, producing inflammation, impaired organ function, and possible graft loss.",
      pathophysiology: "Acute rejection often occurs weeks to months after transplant but can happen later, especially with nonadherence or under-immunosuppression. Clinical clues depend on the organ and biopsy is often needed to classify rejection.",
      riskFactors: ["Missed tacrolimus/cyclosporine/mycophenolate/steroid or other immunosuppressant doses", "Drug interactions affecting trough levels", "Prior rejection", "Donor-specific antibodies", "Infection or inflammatory stress", "High immunologic mismatch"],
      signsSymptoms: ["May be asymptomatic with abnormal labs", "Fever, malaise, graft tenderness, or flu-like symptoms", "Kidney transplant: rising creatinine, oliguria, hypertension, graft tenderness", "Liver transplant: rising AST/ALT/bilirubin, jaundice, pruritus", "Heart/lung transplant: dyspnea, dysrhythmia, heart failure signs, falling pulmonary function"],
      diagnostics: ["Trend organ-specific function labs", "Immunosuppressant trough levels", "Donor-specific antibody testing", "Ultrasound/Doppler or organ-specific imaging to exclude obstruction/vascular issues", "Biopsy when indicated to classify T-cell-mediated versus antibody-mediated rejection", "Infection workup because infection can mimic or trigger rejection"],
      labs: ["Creatinine may rise in kidney rejection", "AST/ALT/bilirubin may rise in liver rejection", "Troponin/BNP may change in heart rejection", "Donor-specific antibodies may be present", "Tacrolimus/cyclosporine levels may be low or toxic"],
      treatments: ["Urgent transplant-team notification", "High-dose corticosteroids for many T-cell-mediated episodes", "Adjustment/intensification of baseline immunosuppression", "Plasmapheresis, IVIG, rituximab, or other therapies for selected antibody-mediated rejection", "Treat infection and medication-interaction causes"],
      nursingPriorities: ["Do not casually hold immunosuppressants; clarify immediately with the transplant team if infection, renal injury, or drug toxicity is present.", "Assess adherence, recent vomiting/diarrhea, new medications, supplements, and trough timing because these can change immunosuppression exposure.", "Trend graft function and teach that rejection and infection can look similar but require fast evaluation."],
      complications: ["Graft failure", "Chronic rejection", "Need for retransplantation", "Severe infection from intensified immunosuppression", "Medication toxicity", "Death"],
      patientEducation: ["Teach never to stop immunosuppressants without transplant-team direction, report fever or graft-function symptoms, avoid unapproved interacting meds/supplements, and keep lab/trough appointments."],
      nclexTraps: ["Fever after transplant is not automatically infection only; rejection is also on the table.", "A rising creatinine in a kidney transplant client is not just dehydration until rejection, obstruction, drug toxicity, and infection are considered.", "Medication nonadherence and drug interactions are high-yield rejection triggers.", "Biopsy classification matters because T-cell-mediated and antibody-mediated rejection are treated differently."]
    },
    {
      name: "Acute tubular necrosis",
      category: "Renal/Urologic",
      aliases: ["ATN", "acute tubular injury", "ischemic ATN", "nephrotoxic ATN"],
      definition: "Acute tubular necrosis is intrinsic acute kidney injury caused by ischemic or nephrotoxic injury to renal tubular epithelial cells.",
      etiology: "Common triggers include prolonged hypotension or shock, sepsis, major surgery, severe volume depletion, rhabdomyolysis/myoglobin, hemolysis, contrast exposure, aminoglycosides, amphotericin B, cisplatin, and other nephrotoxins.",
      pathology: "Tubular cells are injured and slough into the nephron, forming muddy brown granular casts and obstructing flow. Tubules lose reabsorptive function, GFR falls, and the client may progress through oliguric and diuretic recovery phases.",
      pathophysiology: "ATN is an intrinsic renal cause of AKI. Unlike simple prerenal azotemia, the damaged tubules cannot conserve sodium and water normally, so urine sodium/FENa patterns and muddy brown casts support the diagnosis.",
      riskFactors: ["Shock or sustained hypotension", "Sepsis", "Major surgery or trauma", "Nephrotoxic medications", "IV contrast exposure", "Rhabdomyolysis", "Older age or baseline CKD"],
      signsSymptoms: ["Oliguria or sometimes nonoliguric AKI", "Fluid overload, edema, hypertension, or crackles", "Fatigue, nausea, confusion, pruritus if uremic", "Weakness, palpitations, or ECG changes if hyperkalemia", "High output/dehydration risk during diuretic recovery phase"],
      diagnostics: ["Rising creatinine and BUN", "Urinalysis with muddy brown granular casts", "Urine sodium/FENa often elevated when not confounded by diuretics", "Electrolytes, bicarbonate, phosphorus, calcium, magnesium", "Renal ultrasound when obstruction must be excluded", "Medication/contrast and perfusion review"],
      labs: ["Creatinine and BUN rise", "Potassium may rise", "Bicarbonate may fall", "Phosphorus may rise", "Urine may show muddy brown casts", "FENa often >2% unless confounded"],
      treatments: ["Treat shock, sepsis, or volume problem while avoiding overload", "Stop/avoid nephrotoxins and adjust medication doses for kidney function", "Manage hyperkalemia, acidosis, and fluid overload", "Renal replacement therapy/dialysis for refractory hyperkalemia, severe acidosis, pulmonary edema, uremic complications, or toxin indications", "Nutrition and careful fluid/electrolyte support"],
      nursingPriorities: ["Strict intake/output, daily weights, lung sounds, edema, blood pressure, and urine trend.", "Monitor potassium and ECG changes, creatinine/BUN, bicarbonate, and medication renal dosing.", "Prevent further kidney injury by flagging nephrotoxins, contrast, dehydration, and hypotension."],
      complications: ["Hyperkalemia", "Pulmonary edema", "Metabolic acidosis", "Uremic encephalopathy or pericarditis", "Need for dialysis", "Chronic kidney disease after severe injury", "Death"],
      patientEducation: ["Teach avoidance of unapproved NSAIDs/nephrotoxins, hydration guidance as prescribed, follow-up labs, and reporting low urine output, swelling, shortness of breath, or palpitations."],
      nclexTraps: ["Muddy brown casts point toward ATN/intrinsic renal injury.", "Do not keep giving fluid for oliguria when lungs are wet or perfusion is already restored.", "The diuretic phase can cause dehydration and electrolyte loss even while creatinine is recovering.", "Hyperkalemia is an immediate safety issue, not just an abnormal lab."]
    },
    {
      name: "Addisonian crisis",
      category: "Endocrine/Metabolic",
      aliases: ["acute adrenal insufficiency", "acute adrenal failure"],
      definition: "Addisonian crisis is life-threatening adrenal insufficiency with inadequate cortisol, often with aldosterone deficiency, causing shock risk.",
      etiology: "Triggers include infection, surgery, trauma, vomiting/diarrhea, dehydration, abrupt glucocorticoid withdrawal, missed stress-dose steroids, adrenal hemorrhage, pituitary/adrenal disease, and medications that accelerate steroid metabolism.",
      pathology: "Cortisol deficiency causes catecholamine-resistant vasodilation, hypoglycemia, weakness, and impaired stress response. In primary adrenal failure, aldosterone deficiency causes sodium and water loss with hyperkalemia, hypovolemia, and hypotensive shock.",
      pathophysiology: "A client under stress cannot mount the needed cortisol response. Hyponatremia, hyperkalemia, hypoglycemia, dehydration, and refractory hypotension can progress quickly to circulatory collapse.",
      riskFactors: ["Known Addison disease or adrenal insufficiency", "Chronic steroid therapy stopped abruptly", "Recent infection, surgery, trauma, or GI illness", "Pituitary/adrenal disease", "Adrenal hemorrhage", "Rifampin or enzyme-inducing medications in steroid-dependent clients"],
      signsSymptoms: ["Severe weakness or fatigue", "Nausea, vomiting, abdominal pain", "Fever", "Hypotension or shock", "Dehydration", "Confusion, lethargy, syncope, or coma", "Hyperpigmentation may be present in chronic primary adrenal insufficiency"],
      diagnostics: ["Do not delay emergency steroids for confirmatory testing in unstable clients", "Serum cortisol and ACTH if blood can be drawn immediately", "BMP for sodium, potassium, glucose, bicarbonate, BUN/creatinine", "Evaluate infection or other trigger", "ECG if hyperkalemia"],
      labs: ["Hyponatremia", "Hyperkalemia in primary adrenal insufficiency", "Hypoglycemia", "Low cortisol", "High ACTH in primary adrenal insufficiency", "Azotemia may reflect dehydration"],
      treatments: ["Immediate IV hydrocortisone in suspected crisis", "Isotonic saline fluid resuscitation", "Dextrose for hypoglycemia", "Treat infection or other trigger", "Vasopressors if shock persists after steroids/fluids", "Transition to maintenance glucocorticoid/mineralocorticoid plan when stable"],
      nursingPriorities: ["Prioritize circulation, mental status, glucose, potassium/ECG, and rapid steroid/fluid administration.", "Draw cortisol/ACTH if available immediately, but do not delay hydrocortisone for labs in shock.", "Teach sick-day steroid rules, emergency injection kit use, medical alert identification, and when to seek urgent care."],
      complications: ["Refractory shock", "Seizures from hypoglycemia or severe hyponatremia", "Dysrhythmias from hyperkalemia", "Acute kidney injury", "Coma", "Death"],
      patientEducation: ["Carry medical alert identification, keep injectable emergency hydrocortisone if prescribed, increase steroids during illness as instructed, and seek urgent help for vomiting, severe weakness, fever, injury, or inability to keep steroids down."],
      nclexTraps: ["Hydrocortisone is not optional in suspected adrenal crisis with shock.", "Do not wait for cortisol confirmation when the client is unstable.", "Hyponatremia plus hyperkalemia plus hypoglycemia is a classic adrenal crisis safety pattern.", "Abruptly stopping chronic steroids can precipitate crisis."]
    },
    {
      name: "Adrenal crisis",
      category: "Endocrine/Metabolic",
      aliases: ["acute adrenal crisis", "adrenal insufficiency crisis"],
      definition: "Adrenal crisis is acute, life-threatening cortisol deficiency with hypotension, hypovolemia, electrolyte/glucose abnormalities, and shock risk.",
      etiology: "Triggers include sepsis or other infection, surgery, trauma, severe illness, vomiting/diarrhea, missed steroids, abrupt steroid withdrawal, adrenal hemorrhage, pituitary/adrenal disease, and drug interactions that reduce steroid effect.",
      pathology: "Without enough cortisol, vascular tone and stress response fail. Primary adrenal crisis also lacks aldosterone, causing renal sodium wasting, water loss, hyperkalemia, metabolic acidosis tendency, and worsening hypotension.",
      pathophysiology: "The body cannot sustain blood pressure, glucose, and inflammatory control during stress. Hypotension can be resistant to fluids/vasopressors until glucocorticoid replacement is given.",
      riskFactors: ["Known primary or secondary adrenal insufficiency", "Chronic glucocorticoid use", "Recent infection, surgery, trauma, or GI illness", "Adrenal hemorrhage or pituitary disease", "Missed stress dosing"],
      signsSymptoms: ["Hypotension, syncope, or shock", "Severe weakness", "Nausea, vomiting, abdominal pain", "Fever", "Confusion or decreased level of consciousness", "Dehydration", "Possible hyperpigmentation in chronic primary disease"],
      diagnostics: ["Clinical emergency diagnosis when shock pattern fits", "Cortisol/ACTH before steroids only if this causes no delay", "Sodium, potassium, glucose, bicarbonate, renal function", "CBC/cultures or other trigger workup", "ECG for hyperkalemia"],
      labs: ["Hyponatremia", "Hyperkalemia in primary adrenal crisis", "Hypoglycemia", "Low cortisol", "Creatinine/BUN may rise with dehydration", "Metabolic acidosis may occur"],
      treatments: ["Immediate hydrocortisone", "Rapid isotonic saline resuscitation", "Dextrose if hypoglycemic", "Treat precipitating illness", "Vasopressors for persistent shock after steroid/fluid support", "Ongoing steroid replacement and education after stabilization"],
      nursingPriorities: ["Recognize shock plus vomiting/weakness/electrolyte pattern as adrenal crisis until proven otherwise.", "Give ordered hydrocortisone and fluids promptly; monitor BP, glucose, potassium, urine output, and mental status.", "Reinforce sick-day rules and emergency steroid plan before discharge."],
      complications: ["Circulatory collapse", "Seizure", "Dysrhythmia", "Acute kidney injury", "Coma", "Death"],
      patientEducation: ["Use stress-dose steroid plan during illness, never stop chronic steroids abruptly, carry emergency steroid and medical alert identification, and seek emergency care for vomiting or severe illness."],
      nclexTraps: ["Adrenal crisis can look like sepsis; both may need urgent treatment.", "Hydrocortisone should not be delayed for a perfect endocrine workup in unstable clients.", "Hyperkalemia points more toward primary adrenal failure than secondary adrenal insufficiency.", "Vomiting can prevent oral steroid absorption and trigger crisis."]
    },
    {
      name: "AIDS",
      category: "Immune/Infectious",
      aliases: ["acquired immunodeficiency syndrome", "advanced HIV", "stage 3 HIV"],
      definition: "AIDS is late-stage HIV infection with severe immune damage, defined by very low CD4 count or an AIDS-defining opportunistic infection or cancer.",
      etiology: "AIDS develops when untreated or inadequately controlled HIV progressively depletes CD4 T cells. Risk increases with delayed diagnosis, no ART, poor adherence, drug resistance, and barriers to ongoing HIV care.",
      pathology: "HIV infects and destroys CD4 T cells, weakening cell-mediated immunity. As CD4 counts fall, opportunistic infections, certain cancers, wasting, neurologic disease, and severe systemic illness become more likely.",
      pathophysiology: "A CD4 count below 200 cells/mm3 or an AIDS-defining illness indicates advanced immunosuppression. Viral load shows replication/activity and response to ART; CD4 helps estimate immune vulnerability and prophylaxis needs.",
      riskFactors: ["Untreated HIV", "Interrupted ART or poor adherence", "Late HIV diagnosis", "Drug resistance", "Substance use or unstable housing affecting care access", "Coinfections or severe comorbid illness"],
      signsSymptoms: ["May be asymptomatic until opportunistic disease appears", "Fever, night sweats, weight loss, chronic diarrhea", "Oral/esophageal candidiasis", "Recurrent or unusual infections", "Dyspnea/cough with Pneumocystis pneumonia", "Neurologic changes, vision changes, lymphadenopathy, Kaposi sarcoma lesions"],
      diagnostics: ["HIV antigen/antibody testing and confirmatory testing when diagnosis uncertain", "HIV viral load", "CD4 count and percentage", "Resistance genotype before or during ART planning", "Screen for opportunistic infections such as Pneumocystis, TB, toxoplasmosis, cryptococcosis, CMV when symptoms or CD4 risk indicate", "Baseline hepatitis/STI and safety labs"],
      labs: ["CD4 <200 cells/mm3 supports AIDS diagnosis", "High HIV viral load if uncontrolled", "CBC may show anemia, leukopenia, or thrombocytopenia", "Opportunistic infection labs/imaging depend on symptoms", "Renal/liver labs guide ART and antimicrobial choices"],
      treatments: ["Antiretroviral therapy (ART) unless a specific OI timing issue requires specialist sequencing", "Treat active opportunistic infections", "OI prophylaxis such as TMP-SMX for Pneumocystis risk when indicated", "Vaccination with appropriate non-live vaccines", "Adherence, interaction, and resistance management", "Support nutrition, mental health, and access to care"],
      nursingPriorities: ["Assess for fever, respiratory symptoms, neurologic changes, oral lesions, diarrhea/dehydration, weight loss, and medication adherence barriers.", "Protect from infection while avoiding stigmatizing isolation; use standard precautions unless a specific infection requires more.", "Monitor ART interactions, OI prophylaxis, CD4/viral load trends, and immune reconstitution inflammatory syndrome after starting ART."],
      complications: ["Pneumocystis jirovecii pneumonia", "Tuberculosis", "Toxoplasmosis", "Cryptococcal meningitis", "CMV disease", "Kaposi sarcoma", "Lymphoma", "Wasting", "HIV-associated neurocognitive disorder", "Death"],
      patientEducation: ["Teach ART adherence, U=U when viral load is durably undetectable, safer sex/needle practices, prophylaxis adherence, vaccines as recommended, and urgent reporting of fever, dyspnea, severe headache, vision changes, or confusion."],
      nclexTraps: ["AIDS is not defined by looking ill; CD4 count and AIDS-defining conditions matter.", "Viral load and CD4 answer different questions: replication versus immune vulnerability.", "Do not skip Pneumocystis prophylaxis teaching when CD4 is below threshold.", "Standard precautions are appropriate for HIV itself; extra isolation depends on the opportunistic infection."]
    },
    {
      name: "Airway obstruction",
      category: "High-Yield Priority",
      aliases: ["obstructed airway", "upper airway obstruction", "foreign body airway obstruction", "choking"],
      definition: "Airway obstruction is partial or complete blockage of airflow through the upper or lower airway.",
      etiology: "Causes include foreign body/choking, tongue obstruction with decreased consciousness, secretions or blood, anaphylaxis/angioedema, croup, epiglottitis, burns/inhalation injury, trauma, tumors, laryngospasm, asthma/COPD mucus plugging, and aspiration.",
      pathology: "Obstruction limits ventilation and oxygen delivery. Upper airway obstruction often causes stridor; lower airway obstruction often causes wheeze. Complete obstruction rapidly leads to hypoxemia, bradycardia, arrest, and brain injury.",
      pathophysiology: "Work of breathing rises as airflow narrows. A client who can cough or speak has some airflow; inability to speak/cough, cyanosis, altered mental status, or silent chest means impending failure.",
      riskFactors: ["Young children with small objects/foods", "Older adults or neurologic disease with dysphagia", "Reduced level of consciousness", "Facial/neck trauma", "Anaphylaxis or ACE inhibitor angioedema", "Airway burns", "Recent airway surgery"],
      signsSymptoms: ["Choking, clutching throat, inability to speak or cough", "Stridor, wheeze, gurgling, or silent chest", "Retractions, nasal flaring, tripod posture", "Drooling or muffled voice with upper airway infection concern", "Cyanosis, agitation, confusion, decreased level of consciousness", "Falling oxygen saturation is late if ventilation is still partially present"],
      diagnostics: ["Clinical assessment comes first; do not delay intervention for imaging in severe obstruction", "Assess ability to speak/cough, breath sounds, work of breathing, mental status, and pulse", "Pulse oximetry and capnography when available", "Laryngoscopy/bronchoscopy or imaging only when stable or as part of definitive airway/foreign body removal", "Look for anaphylaxis, infection, trauma, or aspiration cause"],
      labs: ["ABG/VBG may show hypoxemia or hypercapnia in severe obstruction", "Labs are secondary to airway intervention unless the client is stable"],
      treatments: ["Encourage forceful cough if obstruction is partial and cough is effective", "Back blows and abdominal thrusts/chest thrusts for severe choking according to age and pregnancy/body habitus", "Suction visible secretions and avoid blind finger sweep", "Jaw thrust/head tilt-chin lift as appropriate, airway adjuncts, high-flow oxygen, bag-mask ventilation", "Epinephrine for anaphylaxis or selected croup protocols as ordered", "Endotracheal intubation, bronchoscopy, cricothyrotomy, or tracheostomy when needed"],
      nursingPriorities: ["Call for help and treat airway before paperwork, teaching, or transport.", "Differentiate partial obstruction with effective cough from severe obstruction with inability to speak/cough, cyanosis, or altered mental status.", "Keep suspected epiglottitis clients calm and avoid throat probing; prepare advanced airway support.", "For choking, use age-appropriate maneuvers and never perform a blind finger sweep."],
      complications: ["Hypoxic brain injury", "Respiratory arrest", "Cardiac arrest", "Aspiration pneumonia", "Negative-pressure pulmonary edema", "Airway trauma", "Death"],
      patientEducation: ["Teach choking prevention, cutting high-risk foods for children, avoiding small objects, dysphagia precautions when prescribed, carrying epinephrine for anaphylaxis, and seeking emergency care for stridor, swelling, or trouble speaking/breathing."],
      nclexTraps: ["Stridor is an upper airway warning until proven otherwise.", "Silent chest can be worse than wheezing.", "Do not do a blind finger sweep; remove only visible objects.", "Abdominal thrusts are for severe choking in responsive adults/children over 1 year; infants need back blows/chest thrusts.", "If basic maneuvers fail and ventilation is impossible, advanced or surgical airway is the rescue path."]
    },
    {
      name: "Acute stress disorder",
      category: "Psych/Substance",
      aliases: ["ASD", "acute stress reaction"],
      definition: "Acute stress disorder is a trauma- and stressor-related disorder with intrusive, avoidance, mood, dissociative, and arousal symptoms soon after a traumatic event.",
      etiology: "It follows exposure to actual or threatened death, serious injury, or sexual violence through direct experience, witnessing, learning about close-family/friend trauma, or repeated exposure to aversive trauma details.",
      pathology: "Trauma exposure activates persistent threat processing before the brain has integrated the event. Symptoms begin after the trauma and last from 3 days to 1 month; if the syndrome persists beyond 1 month, PTSD becomes the more likely diagnosis.",
      pathophysiology: "Hyperarousal, intrusive re-experiencing, avoidance, negative mood, sleep disruption, and dissociation can impair safety, function, relationships, and coping. Substance use and suicidality must be screened because they change priority.",
      riskFactors: ["Severe or interpersonal trauma", "Prior trauma", "History of anxiety, depression, PTSD, or substance use", "Limited support", "Ongoing danger", "Dissociation during or after the trauma"],
      signsSymptoms: ["Intrusive memories, nightmares, or flashbacks", "Avoidance of reminders", "Negative mood or emotional numbing", "Dissociation, derealization, depersonalization, or amnesia for parts of the event", "Hypervigilance, exaggerated startle, irritability, sleep disturbance, poor concentration"],
      diagnostics: ["Trauma timeline and symptom assessment", "Confirm duration is 3 days to 1 month after trauma", "Assess safety, suicidal ideation, homicidal ideation, abuse risk, substance use, sleep, and functional impairment", "Screen for traumatic brain injury, intoxication/withdrawal, psychosis, depression, and PTSD if symptoms persist"],
      labs: ["No diagnostic lab test; toxicology, pregnancy, injury, or medical testing depends on the trauma context and symptoms"],
      treatments: ["Trauma-focused cognitive behavioral therapy or other early trauma-focused psychotherapy", "Safety planning and stabilization", "Sleep support and short-term symptom-targeted medications when ordered", "Treat injuries, pain, substance use, or comorbid depression/anxiety", "Follow-up to monitor for PTSD"],
      nursingPriorities: ["Assess immediate safety first: self-harm, violence, abuse, safe housing, intoxication, and medical injuries.", "Use calm, grounding, trauma-informed communication and avoid forcing detailed retelling when the client is overwhelmed.", "Connect the client to trauma-focused follow-up and teach that persistent symptoms beyond 1 month need reassessment for PTSD."],
      complications: ["PTSD", "Major depression", "Substance misuse", "Sleep deprivation", "Suicidal ideation", "Functional impairment", "Relationship strain"],
      patientEducation: ["Teach grounding skills, sleep hygiene, crisis resources, avoiding alcohol/drugs to self-medicate, and returning for worsening panic, dissociation, nightmares, substance use, or suicidal thoughts."],
      nclexTraps: ["Acute stress disorder is time-limited: 3 days to 1 month after trauma.", "Do not label symptoms as PTSD before the duration criterion is met.", "Priority is safety and stabilization before deep trauma processing.", "Dissociation after trauma is a clue, not psychosis by itself.", "Do not force a distressed client to retell the trauma in detail as a nursing intervention."]
    },
    {
      name: "Alcohol intoxication",
      category: "Psych/Substance",
      aliases: ["ethanol intoxication", "acute alcohol intoxication", "alcohol poisoning"],
      definition: "Alcohol intoxication is acute impairment from ethanol causing dose-related CNS depression, poor coordination, judgment changes, and possible poisoning.",
      etiology: "It results from recent ethanol ingestion, especially binge drinking, rapid intake, low body size/tolerance, co-ingestion with sedatives or opioids, liver disease, or limited food intake.",
      pathology: "Ethanol enhances inhibitory CNS signaling and impairs excitatory signaling, producing sedation, ataxia, slurred speech, nystagmus, vomiting, and poor judgment. Severe intoxication can suppress airway reflexes and breathing, causing aspiration, hypoglycemia, coma, or death.",
      pathophysiology: "Alcohol impairs cerebellar coordination and cortical judgment, then deeper brain function at high levels. Vomiting plus reduced gag reflex raises aspiration risk; poor intake and impaired gluconeogenesis increase hypoglycemia risk, especially in children and malnourished clients.",
      riskFactors: ["Binge drinking", "Alcohol use disorder", "Sedative/opioid co-ingestion", "Low body weight", "Pregnancy", "Liver disease", "Fasting or malnutrition", "Adolescent or older adult vulnerability"],
      signsSymptoms: ["Disinhibition, impaired judgment, mood lability", "Slurred speech, ataxia, nystagmus, slowed reaction time", "Vomiting, hypothermia, dehydration", "Confusion, stupor, coma", "Respiratory depression or irregular breathing in severe poisoning", "Trauma or assault risk"],
      diagnostics: ["Airway, breathing, circulation, neurologic status, glucose, temperature, and trauma assessment", "Blood alcohol concentration when needed", "Finger-stick glucose", "Consider acetaminophen/salicylate levels, toxic alcohols, urine drug screen, pregnancy test, head CT, or labs when history or exam suggests mixed ingestion/injury"],
      labs: ["Blood alcohol level may be elevated", "Glucose may be low", "Electrolytes/osmol gap or acid-base testing if toxic alcohol or metabolic issue suspected"],
      treatments: ["Support airway and breathing; recovery position and suction if vomiting", "IV fluids only for dehydration/hypotension, not to speed sobriety", "Thiamine before or with glucose in malnourished or alcohol-use-disorder clients", "Dextrose for hypoglycemia", "Treat trauma, hypothermia, and co-ingestions", "Observation until clinically sober and safe"],
      nursingPriorities: ["Protect airway and prevent aspiration, especially with vomiting or decreased consciousness.", "Check glucose early and give thiamine before or with dextrose when Wernicke risk exists.", "Do not assume intoxication explains all altered mental status; assess trauma, infection, hypoxia, hypoglycemia, and co-ingestions."],
      complications: ["Aspiration pneumonia", "Respiratory depression", "Hypoglycemia", "Hypothermia", "Trauma", "Rhabdomyolysis", "Coma", "Death"],
      patientEducation: ["Teach overdose warning signs, avoiding mixing alcohol with sedatives/opioids, safer drinking limits, transportation safety, and referral options for alcohol use disorder."],
      nclexTraps: ["Airway beats detox counseling in severe intoxication.", "Hypoglycemia can mimic or worsen intoxication.", "Thiamine matters when chronic alcohol use or malnutrition is possible.", "IV fluids do not rapidly sober the client.", "A drunk client with a fall still needs a real neuro/trauma assessment."]
    },
    {
      name: "Alcoholic hepatitis",
      category: "GI/Liver",
      aliases: ["alcohol-associated hepatitis", "acute alcoholic hepatitis"],
      definition: "Alcoholic hepatitis is inflammatory liver injury caused by heavy alcohol use, ranging from mild illness to severe liver failure.",
      etiology: "It occurs after sustained heavy alcohol exposure, often with malnutrition, underlying steatosis or cirrhosis, infection, or ongoing drinking. Women and clients with obesity or viral hepatitis are at higher risk for severe alcohol-related liver injury.",
      pathology: "Alcohol metabolism and oxidative stress injure hepatocytes, triggering inflammation, cholestasis, and impaired synthetic function. Severe disease causes jaundice, coagulopathy, encephalopathy, ascites, kidney injury, infection risk, and high short-term mortality.",
      pathophysiology: "AST is typically higher than ALT, often with an AST:ALT ratio above 2, but aminotransferases are usually only moderately elevated. Bilirubin and INR reflect severity and are used with scores such as Maddrey discriminant function or MELD.",
      riskFactors: ["Long-term heavy alcohol use", "Recent binge on chronic use", "Malnutrition", "Female sex", "Obesity", "Viral hepatitis", "Cirrhosis"],
      signsSymptoms: ["Jaundice", "Fever and malaise", "Tender hepatomegaly or right upper quadrant pain", "Nausea, anorexia, weight loss", "Ascites or edema", "Confusion, asterixis, or sleep-wake reversal with encephalopathy", "GI bleeding or bruising if coagulopathic"],
      diagnostics: ["Alcohol history and timeline", "Liver panel with AST/ALT, bilirubin, alkaline phosphatase", "PT/INR, albumin, CBC, BMP/creatinine", "Screen for infection, GI bleed, viral hepatitis, biliary obstruction, acetaminophen toxicity, and other liver disease", "Calculate Maddrey discriminant function, MELD, or other severity scores when severe disease suspected"],
      labs: ["AST greater than ALT, often AST:ALT ratio >2", "Bilirubin elevated", "INR/PT prolonged", "Albumin may be low", "WBC may rise", "Creatinine elevation suggests severe disease or hepatorenal risk"],
      treatments: ["Complete alcohol abstinence and withdrawal prevention/treatment", "Nutritional support with vitamins including thiamine/folate as ordered", "Treat infection, GI bleeding, encephalopathy, ascites, and renal injury", "Corticosteroids for selected severe cases after contraindications such as infection/GI bleed are addressed", "Specialty referral and transplant evaluation in selected severe cases"],
      nursingPriorities: ["Assess mental status, bleeding, infection, ascites/edema, renal function, glucose, nutrition, and alcohol withdrawal risk.", "Trend bilirubin, INR, creatinine, sodium, AST/ALT, and severity score response when ordered.", "Teach that abstinence is the central treatment and connect the client to alcohol-use-disorder care."],
      complications: ["Acute liver failure", "Hepatic encephalopathy", "GI bleeding", "Ascites and spontaneous bacterial peritonitis", "Hepatorenal syndrome", "Infection", "Progression to cirrhosis", "Death"],
      patientEducation: ["Teach complete alcohol abstinence, nutrition support, medication safety including avoiding acetaminophen excess, follow-up labs, and urgent reporting of confusion, black stools, fever, worsening jaundice, vomiting blood, or swelling."],
      nclexTraps: ["AST/ALT can be only moderately elevated even when the client is critically ill.", "Bilirubin, INR, creatinine, encephalopathy, and infection drive severity thinking.", "Steroids are not automatic; infection and GI bleeding must be considered.", "Abstinence and nutrition are treatment, not side notes.", "Confusion in alcoholic hepatitis can be encephalopathy, withdrawal, infection, or hypoglycemia."]
    },
    {
      name: "Allergic rhinitis",
      category: "Immune/Infectious",
      aliases: ["hay fever", "seasonal allergic rhinitis", "perennial allergic rhinitis"],
      definition: "Allergic rhinitis is IgE-mediated inflammation of the nasal mucosa after allergen exposure.",
      etiology: "Triggers include pollen, dust mites, animal dander, molds, cockroach allergen, and occupational exposures. Atopy, asthma, eczema, and family history increase risk.",
      pathology: "Allergen cross-linking of IgE on mast cells releases histamine and other mediators, causing sneezing, itching, rhinorrhea, congestion, watery eyes, and postnasal drip. Chronic inflammation can worsen sleep, asthma control, sinus symptoms, and ear pressure.",
      pathophysiology: "The early phase causes sneezing and watery rhinorrhea; the late inflammatory phase drives nasal congestion. Symptoms are allergic rather than bacterial unless fever, purulent discharge, focal sinus pain, or prolonged worsening suggests infection.",
      riskFactors: ["Atopy", "Asthma", "Eczema", "Family history of allergies", "Seasonal pollen exposure", "Indoor dust mites, molds, pets, or cockroach exposure"],
      signsSymptoms: ["Sneezing", "Clear rhinorrhea", "Nasal itching or congestion", "Itchy watery eyes", "Postnasal drip and cough", "Allergic shiners or nasal crease", "Symptoms linked to season or exposure"],
      diagnostics: ["Clinical pattern and trigger history", "Assess asthma symptoms and sleep impairment", "Allergy testing when triggers are unclear or immunotherapy is considered", "Evaluate for sinusitis, infection, medication rhinitis, nasal polyps, or structural obstruction when symptoms are atypical"],
      labs: ["No routine lab is required; specific IgE or skin testing may identify triggers when clinically useful"],
      treatments: ["Allergen avoidance or reduction", "Intranasal corticosteroid for persistent or moderate/severe symptoms", "Second-generation oral antihistamine or intranasal antihistamine for itching/sneezing/rhinorrhea", "Saline irrigation", "Leukotriene receptor antagonist for selected clients", "Allergen immunotherapy when symptoms persist despite treatment or avoidance"],
      nursingPriorities: ["Teach correct nasal spray technique and daily use for intranasal corticosteroids because effect is preventive, not instant rescue.", "Screen for asthma, sleep disruption, otitis/sinus complications, and sedating first-generation antihistamine risks.", "Clarify prolonged decongestant nasal spray use because rebound congestion can occur."],
      complications: ["Poor sleep and fatigue", "Sinusitis", "Otitis media or eustachian tube dysfunction", "Asthma worsening", "Medication sedation or anticholinergic effects"],
      patientEducation: ["Teach trigger control, pollen/dust-mite reduction, nasal steroid technique, avoiding driving with sedating antihistamines, and seeking care for fever, severe sinus pain, wheezing, or unilateral symptoms."],
      nclexTraps: ["Allergic rhinitis usually has clear drainage and itching, not purulent bacterial drainage.", "Intranasal corticosteroid is often first-line for persistent symptoms, but it works best with regular use.", "First-generation antihistamines can cause sedation and anticholinergic effects, especially in older adults.", "Topical nasal decongestants used too long can cause rebound congestion.", "Immunotherapy is for selected persistent allergic disease after trigger evaluation."]
    },
    {
      name: "Amputation complications",
      category: "MSK/Skin/Trauma",
      aliases: ["post-amputation complications", "residual limb complications", "stump complications"],
      definition: "Amputation complications are early and late problems after limb loss that affect healing, pain, mobility, prosthesis use, and safety.",
      etiology: "Complications are related to trauma or vascular disease, diabetes, infection, poor perfusion, edema, nerve injury, immobility, pressure from prosthesis fit, malnutrition, smoking, and psychosocial stress.",
      pathology: "The residual limb must heal while soft tissue, bone, nerves, circulation, and skin adapt to new loading. Poor perfusion or infection can break down the incision; nerve remodeling can form neuromas; CNS remapping contributes to phantom limb pain; immobility can cause contracture and falls.",
      pathophysiology: "Early threats include hemorrhage, infection, ischemia, wound dehiscence, DVT/PE, and pain. Later issues include phantom limb pain, residual limb pain, neuroma, contracture, pressure injury, heterotopic ossification, depression, and prosthesis intolerance.",
      riskFactors: ["Diabetes", "Peripheral artery disease", "Smoking", "Malnutrition", "Infection", "Poor prosthesis fit", "Immobility", "Poor pain control", "Depression or limited support"],
      signsSymptoms: ["Increasing residual limb pain, swelling, redness, warmth, drainage, odor, fever", "Phantom limb pain or sensation", "Skin breakdown or pressure areas from prosthesis", "Hip or knee flexion contracture", "DVT signs, shortness of breath, or chest pain", "Falls, depression, grief, or body-image distress"],
      diagnostics: ["Residual limb inspection including incision, skin, drainage, perfusion, sensation, and edema", "Pain assessment distinguishing surgical pain, phantom limb pain, residual limb pain, and neuroma pain", "Vascular assessment when ischemia suspected", "CBC/cultures/imaging if infection or osteomyelitis suspected", "Prosthesis fit and gait evaluation", "DVT/PE evaluation when symptoms occur"],
      labs: ["CBC may show infection/anemia", "Glucose affects healing", "Albumin/prealbumin or nutrition labs may guide support when ordered", "Inflammatory markers/cultures if deep infection suspected"],
      treatments: ["Wound care and infection treatment", "Edema control and residual limb shaping", "Pain plan including multimodal analgesia and neuropathic/phantom pain options", "Positioning and physical therapy to prevent contracture", "Prosthetist adjustment for fit/pressure problems", "DVT prophylaxis, mobility training, mental health support, and smoking cessation"],
      nursingPriorities: ["Inspect the residual limb every shift and before/after prosthesis use for infection, dehiscence, pressure injury, ischemia, and edema.", "Prevent contracture with ordered positioning and range of motion; avoid prolonged pillows under a lower-limb residual limb unless specifically ordered.", "Address phantom limb pain as real pain and coordinate pain control, mirror therapy/rehab strategies, and psychosocial support."],
      complications: ["Hemorrhage", "Infection", "Wound dehiscence", "Residual limb ischemia", "Phantom limb pain", "Neuroma", "Contracture", "Pressure injury", "DVT/PE", "Falls", "Depression"],
      patientEducation: ["Teach daily residual limb skin checks, hygiene, shrinker/prosthesis schedule, reporting redness/drainage/fever/open areas, positioning to prevent contracture, fall prevention, and that phantom pain should be reported and treated."],
      nclexTraps: ["Phantom limb pain is real pain, not attention-seeking.", "Contracture prevention starts early; positioning errors can block later prosthesis use.", "A prosthesis should not be worn over open skin or unreported pressure injury.", "Diabetes and peripheral artery disease make infection/ischemia checks a priority.", "Do not ignore grief, depression, or suicide risk after limb loss."]
    },
    {
      name: "Anal fissure",
      category: "GI/Liver",
      aliases: ["fissure-in-ano"],
      definition: "An anal fissure is a linear tear in the anoderm, usually causing severe pain with defecation and small-volume bright red bleeding.",
      etiology: "Common triggers include hard stool, constipation, diarrhea, childbirth, anal trauma, inflammatory bowel disease, infection, malignancy, and high internal anal sphincter tone that reduces local blood flow.",
      pathology: "A tear, often in the posterior midline, exposes sensitive anoderm. Pain triggers internal sphincter spasm, which reduces perfusion and delays healing, creating a pain-spasm-tear cycle.",
      pathophysiology: "Acute fissures are superficial and often heal with stool-softening measures. Chronic fissures may have a sentinel tag, exposed internal sphincter fibers, and persistent spasm or ischemia requiring topical vasodilator therapy or procedure.",
      riskFactors: ["Constipation and straining", "Hard stools", "Chronic diarrhea", "Postpartum state", "Crohn disease", "Anal intercourse or trauma", "Low-fiber intake"],
      signsSymptoms: ["Sharp tearing pain during defecation", "Burning pain lasting minutes to hours after stool", "Bright red blood on toilet paper or stool surface", "Visible linear tear", "Internal sphincter spasm", "Fear of bowel movements due to pain"],
      diagnostics: ["Gentle external inspection", "Avoid painful digital rectal exam until tolerated unless another emergency is suspected", "Assess constipation, diarrhea, bleeding amount, weight loss, fever, immunosuppression, and IBD symptoms", "Atypical lateral or multiple fissures require evaluation for Crohn disease, infection, malignancy, or trauma"],
      labs: ["No routine lab is needed for simple fissure; CBC or inflammatory/infectious testing depends on bleeding, systemic symptoms, or suspected secondary cause"],
      treatments: ["Fiber, fluids, stool softeners or osmotic laxatives when indicated", "Sitz baths and local hygiene", "Topical anesthetic for short-term pain relief", "Topical nitroglycerin or calcium channel blocker such as diltiazem/nifedipine for chronic sphincter spasm", "Botulinum toxin or lateral internal sphincterotomy for refractory chronic fissure"],
      nursingPriorities: ["Focus on soft, regular stool and pain control so the client does not avoid defecation and worsen constipation.", "Teach sitz bath use and gentle hygiene after bowel movements.", "Escalate atypical fissures, heavy bleeding, fever, immunosuppression, weight loss, severe rectal pain, or suspected Crohn disease."],
      complications: ["Chronic fissure", "Sentinel skin tag", "Persistent sphincter spasm", "Abscess or fistula if alternative diagnosis present", "Constipation from fear of defecation", "Reduced quality of life"],
      patientEducation: ["Teach fiber/fluid plan, stool softener use if ordered, avoiding straining, sitz baths, and reporting heavy bleeding, fever, worsening pain, drainage, or nonhealing symptoms."],
      nclexTraps: ["Bright red streaking with severe defecation pain fits fissure more than painless hemorrhoid bleeding.", "Pain can cause stool withholding, which worsens constipation and tearing.", "Do not perform aggressive rectal exams when a fissure is exquisitely painful unless clinically necessary.", "Lateral or multiple fissures are atypical and need evaluation for secondary causes.", "Fiber and stool softening are core treatment, not optional comfort measures."]
    },
    {
      name: "Angioedema",
      category: "Immune/Infectious",
      aliases: ["angioneurotic edema", "ACE inhibitor angioedema", "hereditary angioedema"],
      definition: "Angioedema is sudden, localized swelling of deeper dermis, subcutaneous tissue, or submucosa, often affecting lips, tongue, face, extremities, GI tract, or airway.",
      etiology: "Mechanisms include histamine-mediated allergy/anaphylaxis, bradykinin-mediated ACE inhibitor angioedema, hereditary or acquired C1 esterase inhibitor deficiency, NSAID reactions, infection, trauma, and idiopathic episodes.",
      pathology: "Vascular permeability increases in deeper tissues, causing nonpitting swelling. Histamine-mediated angioedema often has urticaria/pruritus and responds to epinephrine/antihistamines/steroids; bradykinin-mediated disease often lacks hives and can threaten the laryngeal airway without responding well to allergy medications.",
      pathophysiology: "Tongue, floor-of-mouth, or laryngeal edema can narrow the airway quickly. Abdominal angioedema can cause severe cramping, vomiting, or diarrhea from bowel wall edema.",
      riskFactors: ["ACE inhibitor use", "History of hereditary angioedema", "Prior angioedema", "Food, medication, latex, or insect allergy", "NSAID sensitivity", "Family history", "Trauma or dental/airway procedures in hereditary angioedema"],
      signsSymptoms: ["Swelling of lips, face, tongue, eyelids, hands, feet, or genitals", "Throat tightness, hoarseness, stridor, drooling, dyspnea, or dysphagia with airway involvement", "Urticaria or itching in histamine-mediated reactions", "Abdominal pain, nausea, vomiting, or diarrhea", "Normal skin color or nonpitting swelling"],
      diagnostics: ["Immediate airway assessment", "Medication/exposure review including ACE inhibitor and NSAIDs", "Look for urticaria/anaphylaxis, hypotension, wheeze, GI symptoms, and family history", "C4 and C1 esterase inhibitor level/function when hereditary/acquired angioedema suspected", "Laryngoscopy if airway involvement is unclear and expert help is available"],
      labs: ["C4 may be low in hereditary/acquired C1 inhibitor deficiency", "C1 esterase inhibitor level or function may be abnormal", "Tryptase may support anaphylaxis when drawn appropriately"],
      treatments: ["Airway preparation and early intubation/surgical airway backup for tongue/laryngeal edema", "IM epinephrine for anaphylaxis or severe histamine-mediated reaction", "Antihistamines and corticosteroids for histamine-mediated disease", "Stop ACE inhibitor permanently if implicated", "C1 inhibitor concentrate, icatibant, ecallantide, or fresh frozen plasma per protocol for selected bradykinin-mediated attacks", "Observation for progression or recurrence"],
      nursingPriorities: ["Assess airway first: voice change, tongue swelling, drooling, stridor, dyspnea, and ability to swallow.", "Give epinephrine promptly for anaphylaxis, but recognize ACE inhibitor/bradykinin angioedema may need different therapy and airway planning.", "Document the trigger and teach permanent avoidance of the offending ACE inhibitor or allergen when identified."],
      complications: ["Laryngeal obstruction", "Respiratory arrest", "Anaphylactic shock", "Recurrent attacks", "Bowel obstruction-like abdominal episodes", "Death"],
      patientEducation: ["Teach emergency care for tongue/throat swelling, epinephrine autoinjector use when prescribed, ACE inhibitor avoidance if implicated, hereditary angioedema action plan, and alerting all providers to the reaction history."],
      nclexTraps: ["Airway risk is the priority even if oxygen saturation is still normal.", "ACE inhibitor angioedema can occur after months or years of use.", "No hives does not rule out dangerous angioedema; bradykinin forms often lack urticaria.", "Epinephrine is essential for anaphylaxis, but bradykinin angioedema may not respond well to antihistamines/steroids/epinephrine.", "Voice change or stridor means prepare for advanced airway help."]
    },
    {
      name: "Angle-closure glaucoma",
      category: "Eye/ENT",
      aliases: ["acute angle-closure glaucoma", "closed-angle glaucoma", "narrow-angle glaucoma"],
      definition: "Angle-closure glaucoma is obstruction of aqueous humor drainage at the anterior chamber angle, causing elevated intraocular pressure and optic nerve risk.",
      etiology: "Primary angle closure is often related to narrow anterior chamber anatomy and pupillary block. Risk rises with older age, hyperopia, Asian or Inuit ancestry, family history, and medications or drops that dilate the pupil; secondary causes include neovascular, inflammatory, lens-related, or traumatic mechanisms.",
      pathology: "The iris blocks the drainage angle, aqueous humor cannot leave the anterior chamber, and intraocular pressure rises rapidly. Acute attacks can cause corneal edema, ischemia of ocular tissues, optic nerve damage, and permanent vision loss.",
      pathophysiology: "Pupillary dilation can worsen iris-lens contact and close the angle. IOP may reach very high levels within hours, producing severe eye pain, halos, nausea/vomiting, a hazy cornea, and a fixed mid-dilated pupil.",
      riskFactors: ["Narrow angles", "Older age", "Hyperopia", "Asian or Inuit ancestry", "Family history", "Anticholinergic or adrenergic medications that cause mydriasis", "Prior attack in the other eye"],
      signsSymptoms: ["Severe unilateral eye pain and redness", "Blurred vision or decreased vision", "Colored halos around lights", "Headache, nausea, and vomiting", "Hazy cornea", "Fixed mid-dilated pupil", "Very firm eye or markedly elevated intraocular pressure"],
      diagnostics: ["Emergency eye assessment and intraocular pressure measurement", "Pupil, cornea, visual acuity, and anterior chamber assessment", "Gonioscopy by ophthalmology when possible", "Do not let nausea/headache distract from examining the eyes"],
      labs: ["No diagnostic lab; electrolytes/renal function may matter before systemic acetazolamide or osmotic therapy"],
      treatments: ["Immediate ophthalmology consultation", "Topical pressure-lowering drops such as timolol, brimonidine, and pilocarpine when ordered", "Systemic acetazolamide and/or osmotic agent such as mannitol when ordered", "Pain/nausea control", "Definitive laser peripheral iridotomy once the cornea clears; often both eyes need evaluation/treatment"],
      nursingPriorities: ["Treat acute angle closure as an emergency because vision can be lost quickly.", "Ask about halos, eye pain, nausea/vomiting, and recent anticholinergic/mydriatic medications.", "Avoid giving pupil-dilating or anticholinergic medications to a suspected acute angle-closure client unless specifically directed."],
      complications: ["Permanent vision loss", "Optic nerve damage", "Recurrent attack", "Corneal edema", "Pain/vomiting-related dehydration"],
      patientEducation: ["Teach urgent care for sudden painful red eye with halos or nausea, medication precautions if narrow angles are known, and the purpose of laser peripheral iridotomy."],
      nclexTraps: ["Sudden headache, nausea, and vomiting can be eye disease; look at the eyes.", "A fixed mid-dilated pupil plus painful red eye is an emergency.", "Do not confuse acute angle closure with conjunctivitis.", "Acetazolamide lowers aqueous production but definitive treatment is laser peripheral iridotomy.", "Anticholinergic or mydriatic drugs can precipitate an attack in narrow angles."]
    },
    {
      name: "Anticholinergic toxicity",
      category: "Emergency/Critical Care/Toxicology",
      aliases: ["anticholinergic poisoning", "antimuscarinic toxicity", "anticholinergic toxidrome"],
      definition: "Anticholinergic toxicity is poisoning from muscarinic receptor blockade causing delirium, dry skin/mucosa, mydriasis, hyperthermia, tachycardia, urinary retention, and decreased bowel activity.",
      etiology: "Common causes include overdose or accumulation of diphenhydramine and other antihistamines, tricyclic antidepressants, antipsychotics, antiparkinson drugs, antispasmodics, scopolamine, atropine-like plants, and polypharmacy in older adults.",
      pathology: "Muscarinic acetylcholine blockade reduces secretions, sweating, gut motility, bladder contraction, and pupillary constriction while causing central delirium. Severe toxicity can cause hyperthermia, seizures, rhabdomyolysis, dysrhythmias, coma, or cardiovascular collapse.",
      pathophysiology: "The classic toxidrome is remembered as dry as a bone, blind as a bat, hot as a hare, red as a beet, mad as a hatter, and full as a flask. Dry skin helps distinguish it from sympathomimetic toxicity, which usually has diaphoresis.",
      riskFactors: ["Diphenhydramine or antihistamine overdose", "Tricyclic antidepressant overdose", "Older adult polypharmacy", "Antipsychotics or antiparkinson medications", "Scopolamine/atropine exposure", "Intentional self-harm ingestion"],
      signsSymptoms: ["Agitated delirium, hallucinations, confusion, picking behavior", "Mydriasis and blurred vision", "Dry mucous membranes and dry flushed skin", "Hyperthermia due to anhidrosis", "Tachycardia", "Urinary retention", "Decreased bowel sounds", "Seizures or wide-complex dysrhythmia in severe/mixed overdose"],
      diagnostics: ["Airway/breathing/circulation and temperature assessment", "Medication/plant exposure history and pill count", "ECG for QRS/QT changes", "Finger-stick glucose", "Acetaminophen/salicylate levels, pregnancy test, BMP, CK, and toxicology testing as clinically indicated", "Assess for trauma, infection, serotonin syndrome, sympathomimetic toxicity, and withdrawal"],
      labs: ["CK may rise with agitation/hyperthermia/rhabdomyolysis", "Electrolytes and creatinine assess complications", "Acid-base testing if severe", "Drug levels depend on suspected co-ingestions"],
      treatments: ["Supportive care with airway protection and monitoring", "Benzodiazepines for agitation or seizures", "Cooling measures for hyperthermia", "IV fluids for hypotension or rhabdomyolysis risk", "Activated charcoal if appropriate timing/airway safety", "Sodium bicarbonate for wide QRS from sodium-channel blockade", "Physostigmine only for selected severe pure anticholinergic poisoning with expert guidance and resuscitation readiness"],
      nursingPriorities: ["Place on continuous cardiac monitoring, check temperature/glucose, protect airway, and reduce stimulation.", "Use benzodiazepines rather than physical struggle alone for severe agitation because agitation worsens hyperthermia/rhabdomyolysis.", "Call poison control and clarify mixed overdose before physostigmine."],
      complications: ["Respiratory failure", "Seizures", "Hyperthermia", "Rhabdomyolysis", "Urinary retention", "Ileus", "Wide-complex dysrhythmias", "Coma", "Death"],
      patientEducation: ["Teach medication storage, avoiding duplicate OTC antihistamine/sleep products, older-adult anticholinergic risk, and urgent care for confusion, fever, inability to urinate, or overdose."],
      nclexTraps: ["Dry skin and urinary retention point toward anticholinergic toxicity; sweating points more toward sympathomimetic toxicity.", "Benzodiazepines are first-line for dangerous agitation/seizures.", "Physostigmine is not routine for every delirious overdose and is risky in mixed/TCA overdose.", "Check ECG before antidote decisions.", "Diphenhydramine overdose can cause anticholinergic delirium and sodium-channel cardiac toxicity."]
    },
    {
      name: "Aortic regurgitation",
      category: "Cardiac/Vascular",
      aliases: ["AR", "aortic insufficiency"],
      definition: "Aortic regurgitation is incomplete closure of the aortic valve, allowing blood to flow backward from the aorta into the left ventricle during diastole.",
      etiology: "Causes include aortic valve degeneration, bicuspid aortic valve, aortic root dilation, infective endocarditis, aortic dissection, rheumatic disease, connective tissue disorders such as Marfan syndrome, trauma, and inflammatory aortitis.",
      pathology: "Regurgitant flow creates left ventricular volume overload. Chronic AR leads to LV dilation and hypertrophy until decompensation causes heart failure; acute severe AR can rapidly raise LV pressure, causing pulmonary edema and cardiogenic shock.",
      pathophysiology: "A wide pulse pressure and bounding/water-hammer pulse occur in chronic AR because systolic pressure rises with high stroke volume and diastolic pressure falls with runoff back into the LV. The classic murmur is an early diastolic decrescendo murmur.",
      riskFactors: ["Bicuspid aortic valve", "Aortic root aneurysm/dilation", "Endocarditis", "Aortic dissection", "Rheumatic fever history", "Marfan or connective tissue disorder", "Hypertension"],
      signsSymptoms: ["May be asymptomatic for years", "Exertional dyspnea, orthopnea, paroxysmal nocturnal dyspnea", "Palpitations", "Angina", "Wide pulse pressure and bounding pulses", "Early diastolic murmur", "Acute severe AR: hypotension, pulmonary edema, shock"],
      diagnostics: ["Echocardiography with Doppler to confirm and grade severity", "Assess LV size and ejection fraction", "Blood pressure and pulse pressure assessment", "ECG and chest x-ray", "CT/MRI for aortic root/ascending aorta when indicated", "Blood cultures if endocarditis suspected"],
      labs: ["BNP may rise with heart failure", "Blood cultures if endocarditis suspected", "Renal function/electrolytes guide heart failure therapy"],
      treatments: ["Aortic valve replacement or repair for symptomatic severe AR, LV dysfunction, or selected aortic-root indications", "Urgent surgery for acute severe AR from dissection/endocarditis when indicated", "Treat heart failure when not surgical candidate", "Control hypertension and manage aortic root disease", "Endocarditis treatment when present"],
      nursingPriorities: ["Assess for new dyspnea, orthopnea, pulmonary edema, chest pain, syncope, hypotension, fever/endocarditis signs, and widened pulse pressure.", "Do not dismiss acute AR: severe acute regurgitation can have a soft murmur but shock physiology.", "Monitor heart failure status, daily weights, BP, renal function, and surgical referral timing."],
      complications: ["Heart failure", "Pulmonary edema", "Cardiogenic shock in acute AR", "Arrhythmias", "LV dysfunction", "Endocarditis", "Aortic dissection", "Sudden death"],
      patientEducation: ["Teach reporting new dyspnea, chest pain, syncope, fever, edema, or reduced exercise tolerance; keeping echocardiography follow-up; and understanding valve-surgery warning signs."],
      nclexTraps: ["Aortic regurgitation is a diastolic backflow problem; the murmur is diastolic, not systolic.", "Wide pulse pressure fits chronic AR.", "Acute severe AR can be an emergency even if classic chronic signs are absent.", "Intra-aortic balloon pump is contraindicated in significant AR because diastolic balloon inflation worsens regurgitation.", "Echocardiography drives severity and timing decisions."]
    },
    {
      name: "Aortic stenosis",
      category: "Cardiac/Vascular",
      aliases: ["AS", "calcific aortic stenosis"],
      definition: "Aortic stenosis is narrowing of the aortic valve opening, obstructing left ventricular outflow.",
      etiology: "Common causes include age-related calcific degeneration, bicuspid aortic valve, rheumatic heart disease, and congenital stenosis.",
      pathology: "The narrowed valve causes pressure overload of the left ventricle. LV hypertrophy initially maintains output, but fixed outflow obstruction eventually causes exertional angina, syncope, dyspnea/heart failure, dysrhythmias, and sudden death risk.",
      pathophysiology: "Because the ventricle cannot increase output well during exertion, clients may develop syncope or angina. The classic murmur is a systolic crescendo-decrescendo ejection murmur radiating to the carotids with delayed carotid upstroke in severe disease.",
      riskFactors: ["Older age", "Bicuspid aortic valve", "Rheumatic fever history", "Chronic kidney disease", "Hyperlipidemia and cardiovascular risk factors", "Prior chest radiation"],
      signsSymptoms: ["Often asymptomatic until severe", "Exertional dyspnea or heart failure", "Exertional angina", "Exertional syncope or presyncope", "Harsh systolic murmur radiating to carotids", "Delayed/weak carotid upstroke", "Fatigue or reduced exercise tolerance"],
      diagnostics: ["Echocardiography with Doppler to measure valve area and gradients", "Assess symptoms carefully because new symptoms in severe AS are high risk", "ECG and chest x-ray may support LVH or heart failure", "Cardiac catheterization or CT planning when valve intervention is being evaluated"],
      labs: ["BNP may rise with ventricular strain/heart failure", "Renal function and electrolytes guide medication/procedure planning"],
      treatments: ["Aortic valve replacement for symptomatic severe AS or selected severe asymptomatic criteria", "Transcatheter aortic valve replacement (TAVR) or surgical AVR depending risk/anatomy", "Careful heart failure/BP management while avoiding hypotension", "Endocarditis and cardiovascular risk management as indicated"],
      nursingPriorities: ["Ask specifically about exertional syncope, angina, and dyspnea because these symptoms change urgency.", "Maintain hemodynamic stability; avoid sudden hypotension and monitor preload-sensitive clients carefully.", "Escalate chest pain, syncope, acute pulmonary edema, or new dysrhythmia in known/suspected severe AS."],
      complications: ["Heart failure", "Syncope with falls", "Angina/ischemia", "Dysrhythmias", "Sudden cardiac death", "Pulmonary hypertension", "Endocarditis"],
      patientEducation: ["Teach reporting exertional chest pain, fainting, worsening dyspnea, edema, or reduced exercise tolerance, and keeping echocardiography/cardiology follow-up for valve replacement timing."],
      nclexTraps: ["The classic symptomatic triad is angina, syncope, and dyspnea/heart failure.", "Aortic stenosis is a systolic outflow murmur that can radiate to the carotids.", "Severe symptomatic AS usually needs valve replacement; medications do not fix the obstruction.", "Avoid careless vasodilation or dehydration in severe AS because the client is preload/pressure dependent.", "New syncope in AS is not a routine fainting episode."]
    },
    {
      name: "Arterial ulcer",
      category: "Cardiac/Vascular",
      aliases: ["ischemic ulcer", "arterial insufficiency ulcer", "PAD ulcer"],
      definition: "An arterial ulcer is a skin wound caused by inadequate arterial blood flow, most often from peripheral artery disease.",
      etiology: "Common causes include atherosclerotic peripheral artery disease, diabetes, smoking, hypertension, hyperlipidemia, embolic disease, vasculitis, trauma to an ischemic limb, and poor footwear or pressure over bony prominences.",
      pathology: "Reduced arterial perfusion deprives tissue of oxygen and nutrients. Minor pressure or injury can become a painful punched-out wound with pale or necrotic base, weak pulses, cool skin, delayed capillary refill, and poor healing.",
      pathophysiology: "Ischemic tissue cannot mount normal healing. Elevating the limb may worsen pain because arterial inflow falls; dependency may temporarily improve pain by using gravity to increase flow, but it also increases edema risk.",
      riskFactors: ["Peripheral artery disease", "Diabetes", "Smoking", "Hypertension", "Hyperlipidemia", "Older age", "Chronic kidney disease", "Prior vascular disease or amputation"],
      signsSymptoms: ["Painful punched-out ulcer on toes, foot, ankle, or pressure points", "Cool pale or shiny skin", "Weak or absent pedal pulses", "Delayed capillary refill", "Dependent rubor and elevation pallor", "Rest pain that may improve when the leg is dependent", "Dry black eschar or gangrene when severe"],
      diagnostics: ["Pedal pulse and Doppler assessment", "Ankle-brachial index (ABI) or toe pressure because ABI can be falsely high in calcified diabetic vessels", "Duplex ultrasound, CTA, MRA, or angiography for revascularization planning", "Assess for infection, osteomyelitis, and neuropathy", "Glucose/A1c, lipids, renal function, CBC/CRP when infection suspected"],
      labs: ["A1c and glucose guide healing risk", "Lipids guide vascular prevention", "CBC/CRP may rise with infection", "Creatinine matters before contrast imaging"],
      treatments: ["Urgent vascular referral for critical limb ischemia or nonhealing ischemic ulcer", "Revascularization when indicated", "Smoking cessation, statin, antiplatelet therapy, BP/diabetes control as prescribed", "Protect from pressure and trauma", "Moist wound care and debridement only when perfusion is adequate or vascular team directs", "Antibiotics only when clinically infected"],
      nursingPriorities: ["Assess pulses, skin temperature/color, capillary refill, pain pattern, wound base, and infection signs.", "Do not apply compression therapy until arterial flow is evaluated and orders support it.", "Keep the wound protected and pressure-free; avoid heat packs, massage, and aggressive debridement without adequate perfusion.", "Escalate rest pain, wet gangrene, spreading cellulitis, fever, or suddenly worse perfusion."],
      complications: ["Critical limb ischemia", "Gangrene", "Osteomyelitis", "Sepsis", "Amputation", "MI or stroke from systemic atherosclerosis"],
      patientEducation: ["Teach smoking cessation, daily foot checks, protective footwear, avoiding heating pads, reporting new sores/rest pain/color change, and keeping vascular/diabetes follow-up."],
      nclexTraps: ["Arterial ulcers are ischemic and often painful; venous ulcers are usually edema-related and need different compression logic.", "No compression on an arterial ulcer until ABI/toe pressure or vascular guidance supports it.", "Dependent positioning may reduce ischemic pain but is not a cure.", "Dry stable eschar on an ischemic foot is not casually debrided without perfusion planning.", "Treat the limb and the whole vascular client: MI and stroke risk travel with PAD."]
    },
    {
      name: "Asbestosis",
      category: "Respiratory",
      aliases: ["asbestos-related pulmonary fibrosis", "asbestos pneumoconiosis"],
      definition: "Asbestosis is chronic interstitial lung fibrosis caused by inhalation of asbestos fibers.",
      etiology: "It follows significant occupational or environmental asbestos exposure, often years before symptoms, with higher risk in construction, shipyard, insulation, mining, brake, and demolition work. Smoking worsens respiratory risk and greatly increases lung cancer risk when combined with asbestos exposure.",
      pathology: "Inhaled asbestos fibers lodge in distal airways and alveoli, causing inflammation and progressive scarring. Fibrosis stiffens the lungs, reduces gas exchange, and can lead to restrictive lung disease, hypoxemia, pulmonary hypertension, cor pulmonale, lung cancer, and mesothelioma risk.",
      pathophysiology: "Symptoms usually appear after a long latency, often decades after exposure. Pleural plaques can mark asbestos exposure but do not by themselves equal asbestosis; interstitial fibrosis plus exposure history supports the disease.",
      riskFactors: ["Occupational asbestos exposure", "Demolition or renovation of older buildings", "Shipyard or insulation work", "Family/household take-home exposure", "Long duration or high intensity exposure", "Smoking"],
      signsSymptoms: ["Progressive exertional dyspnea", "Persistent dry cough", "Bibasilar fine crackles", "Chest tightness", "Clubbing in advanced disease", "Hypoxemia with exertion or advanced fibrosis"],
      diagnostics: ["Detailed occupational/environmental exposure history", "Chest x-ray or high-resolution CT for interstitial fibrosis and pleural plaques", "Pulmonary function tests often showing restrictive pattern and reduced DLCO", "Pulse oximetry and exertional oxygen assessment", "Evaluate for lung cancer or mesothelioma when red flags occur"],
      labs: ["No diagnostic blood test; ABG may show hypoxemia in advanced disease"],
      treatments: ["Remove/avoid asbestos exposure", "Smoking cessation", "Vaccination against influenza, COVID, and pneumococcus as appropriate", "Oxygen for hypoxemia", "Pulmonary rehabilitation and symptom management", "Treat respiratory infections promptly", "Cancer surveillance/risk-based follow-up"],
      nursingPriorities: ["Assess exposure history, dyspnea progression, oxygenation at rest/exertion, crackles, cough, weight loss, and chest pain.", "Teach that there is no cure for established fibrosis, so prevention of further exposure and smoking cessation are central.", "Escalate hemoptysis, unexplained weight loss, new pleural effusion, worsening hypoxemia, or chest wall pain because malignancy must be considered."],
      complications: ["Progressive pulmonary fibrosis", "Respiratory failure", "Pulmonary hypertension", "Cor pulmonale", "Lung cancer", "Mesothelioma", "Recurrent respiratory infections"],
      patientEducation: ["Teach avoiding asbestos disturbance, using trained abatement professionals, smoking cessation, vaccine adherence, oxygen safety if prescribed, and follow-up for new respiratory or cancer warning symptoms."],
      nclexTraps: ["Asbestosis has long latency; symptoms may appear decades after exposure.", "Pleural plaques show exposure but are not the same as impaired gas exchange from fibrosis.", "Smoking cessation is especially urgent because asbestos plus smoking sharply raises lung cancer risk.", "Oxygen helps hypoxemia but does not reverse fibrosis.", "New chest pain, weight loss, or pleural findings require cancer/mesothelioma evaluation."]
    },
    {
      name: "Ascites",
      category: "GI/Liver",
      aliases: ["peritoneal fluid", "cirrhotic ascites"],
      definition: "Ascites is abnormal free fluid in the peritoneal cavity, most commonly from portal hypertension due to cirrhosis.",
      etiology: "Common causes include cirrhosis with portal hypertension, severe alcohol-associated hepatitis, heart failure, nephrotic syndrome, malignancy/peritoneal carcinomatosis, infection such as tuberculosis, pancreatitis, Budd-Chiari syndrome, and hypoalbuminemia.",
      pathology: "Portal hypertension and splanchnic vasodilation activate renal sodium and water retention. Low oncotic pressure and increased portal pressure move fluid into the abdomen, causing distention, dyspnea, hernia risk, renal stress, and spontaneous bacterial peritonitis risk.",
      pathophysiology: "New or worsening ascites can signal decompensated liver disease. Ascitic fluid analysis, including cell count and differential, culture, albumin, protein, and serum-ascites albumin gradient (SAAG), helps distinguish portal hypertensive ascites from infection, malignancy, or other causes.",
      riskFactors: ["Cirrhosis", "Alcohol-associated liver disease", "Chronic hepatitis", "Portal hypertension", "Heart failure", "Malignancy", "Nephrotic syndrome", "Prior spontaneous bacterial peritonitis"],
      signsSymptoms: ["Increasing abdominal girth and weight gain", "Abdominal distention, fluid wave, shifting dullness", "Early satiety or reflux", "Dyspnea from diaphragm elevation", "Peripheral edema", "Umbilical hernia", "Fever, abdominal pain, encephalopathy, or renal worsening with SBP"],
      diagnostics: ["Ultrasound or CT if diagnosis unclear", "Diagnostic paracentesis for new ascites, unknown cause, hospitalization with cirrhosis/ascites, or suspected SBP", "Ascitic fluid cell count/differential, culture, albumin/protein, and SAAG", "CMP, bilirubin, INR, albumin, CBC, creatinine, sodium", "Assess for GI bleed, infection, renal injury, and encephalopathy"],
      labs: ["SAAG >= 1.1 g/dL suggests portal hypertension", "Ascitic PMN count >= 250 cells/mcL suggests SBP", "Low serum sodium or rising creatinine worsens risk", "Albumin often low in cirrhosis"],
      treatments: ["Dietary sodium restriction", "Spironolactone often with furosemide for cirrhotic ascites", "Therapeutic paracentesis for tense or symptomatic ascites", "Albumin after large-volume paracentesis per protocol", "Antibiotics for SBP", "TIPS or transplant referral for refractory/recurrent ascites when appropriate"],
      nursingPriorities: ["Measure abdominal girth, daily weight, intake/output, lung sounds, edema, mental status, sodium, potassium, and renal function.", "Prepare for paracentesis and monitor for hypotension, bleeding, leakage, infection, and albumin need after large-volume removal.", "Escalate fever, abdominal pain, confusion, GI bleeding, hypotension, or rising creatinine because SBP or hepatorenal syndrome may be developing."],
      complications: ["Spontaneous bacterial peritonitis", "Hepatorenal syndrome", "Hyponatremia", "Hepatic hydrothorax", "Respiratory compromise", "Umbilical hernia rupture", "Malnutrition", "Encephalopathy"],
      patientEducation: ["Teach sodium restriction, daily weights, medication adherence, avoiding alcohol, reporting fever/abdominal pain/confusion/black stools, and keeping liver follow-up."],
      nclexTraps: ["New ascites or suspected SBP needs diagnostic paracentesis, not just diuretics.", "SBP can be subtle; confusion or renal worsening may be the clue.", "Spironolactone raises potassium while furosemide lowers it, so labs matter.", "Large-volume paracentesis can require albumin to prevent circulatory dysfunction.", "Fluid restriction is not routine unless significant hyponatremia is present."]
    },
    {
      name: "Aspiration pneumonia",
      category: "Respiratory",
      aliases: ["aspiration pneumonitis and pneumonia", "aspiration lung infection"],
      definition: "Aspiration pneumonia is lung infection caused by inhalation of oropharyngeal or gastric contents into the lower respiratory tract.",
      etiology: "Risk increases with dysphagia, stroke, dementia, decreased level of consciousness, seizures, alcohol or sedative/opioid use, vomiting, tube feeding, poor oral hygiene, GERD, impaired cough, and mechanical ventilation.",
      pathology: "Aspirated material brings bacteria and inflammatory injury into dependent lung segments. Chemical pneumonitis can occur from acidic gastric contents, while bacterial aspiration pneumonia develops when colonized secretions or gastric contents seed infection.",
      pathophysiology: "Dependent infiltrates often occur in posterior upper lobes or superior lower lobes when supine, and lower lobes when upright. Anaerobic coverage is not automatic for all aspiration events but matters when abscess, empyema, necrotizing infection, severe periodontal disease, or classic anaerobic syndrome is suspected.",
      riskFactors: ["Dysphagia", "Stroke or neuromuscular disease", "Decreased consciousness", "Vomiting", "Sedatives/opioids/alcohol", "Tube feeding with poor positioning", "Poor oral hygiene", "Mechanical ventilation"],
      signsSymptoms: ["Cough, fever, dyspnea, tachypnea", "Hypoxemia", "Crackles or decreased breath sounds", "Purulent sputum may occur", "Witnessed aspiration or choking episode may be absent", "Delirium or weakness in older adults", "Foul sputum if anaerobic infection/abscess"],
      diagnostics: ["Clinical exam and oxygen assessment", "Chest x-ray or CT showing dependent infiltrate", "Swallow evaluation when dysphagia suspected", "CBC, cultures if severe or hospitalized", "Assess aspiration risk, oral hygiene, mental status, and medication sedation burden"],
      labs: ["WBC may rise", "ABG/VBG may show hypoxemia or hypercapnia when severe", "Cultures guide therapy when obtainable and clinically useful"],
      treatments: ["Airway support, oxygen, suctioning when needed", "Antibiotics when bacterial pneumonia is suspected", "Anaerobic coverage only when indicated by abscess, empyema, necrotizing infection, or high anaerobic risk", "Treat dysphagia/GERD/vomiting and reduce sedating medications when possible", "Oral care, positioning, and aspiration precautions"],
      nursingPriorities: ["Assess airway, oxygenation, work of breathing, fever, lung sounds, and mental status.", "Keep high-risk clients upright for meals/feeds and follow swallow precautions; stop oral intake and notify provider if coughing/choking with meals occurs.", "Do not assume all aspiration is immediately bacterial pneumonia; monitor closely and match antibiotics to clinical infection signs and orders."],
      complications: ["Respiratory failure", "Lung abscess", "Empyema", "Sepsis", "Recurrent pneumonia", "ARDS", "Death"],
      patientEducation: ["Teach upright positioning, slow small bites/sips, oral care, avoiding sedative/alcohol misuse, swallow therapy recommendations, and reporting fever, worsening cough, dyspnea, or choking."],
      nclexTraps: ["Right lower/dependent infiltrate after choking or decreased LOC points toward aspiration.", "Dysphagia precautions and oral care are pneumonia prevention, not comfort extras.", "Tube feeding does not eliminate aspiration risk.", "Anaerobic antibiotics are not automatic for every aspiration event.", "Sudden chemical pneumonitis can look inflammatory before bacterial infection is proven."]
    },
    {
      name: "Asystole",
      category: "Cardiac/Vascular",
      aliases: ["flatline", "cardiac standstill", "ventricular asystole"],
      definition: "Asystole is cardiac arrest with absence of meaningful ventricular electrical activity and no pulse.",
      etiology: "It can result from prolonged untreated ventricular fibrillation/pulseless VT, severe hypoxia, acidosis, hyperkalemia or hypokalemia, hypovolemia, hypothermia, toxins, cardiac tamponade, tension pneumothorax, coronary or pulmonary thrombosis, trauma, or terminal deterioration.",
      pathology: "Without organized electrical activity, the ventricles do not contract and no effective circulation reaches the brain, heart, or other organs. Irreversible injury and death occur quickly without high-quality CPR and correction of reversible causes.",
      pathophysiology: "Asystole is a non-shockable rhythm. Defibrillation treats chaotic shockable rhythms such as VF/pulseless VT; it does not restart a true flatline. Management centers on CPR, epinephrine, airway/ventilation, and Hs and Ts.",
      riskFactors: ["Severe cardiac disease or MI", "Respiratory arrest or hypoxia", "Severe electrolyte abnormality", "Drug/toxin overdose", "Sepsis or shock", "Trauma/hemorrhage", "End-stage illness"],
      signsSymptoms: ["Unresponsive", "No normal breathing or only agonal gasps", "No pulse", "Flatline on monitor in at least two leads", "No measurable blood pressure", "Cyanosis or pallor"],
      diagnostics: ["Confirm unresponsiveness, breathing, and pulse rapidly", "Cardiac monitor rhythm check in two leads to rule out lead disconnection or fine VF", "Glucose and rapid labs during resuscitation when possible", "Search for Hs and Ts: hypoxia, hypovolemia, hydrogen ion/acidosis, hypo/hyperkalemia, hypothermia, toxins, tamponade, tension pneumothorax, thrombosis"],
      labs: ["Potassium, glucose, ABG/VBG, lactate, and toxicology may reveal reversible causes if obtained during/after resuscitation"],
      treatments: ["Immediate high-quality CPR with minimal interruptions", "Epinephrine 1 mg IV/IO every 3 to 5 minutes per ACLS", "Airway and ventilation support", "Treat reversible Hs and Ts", "Do not defibrillate confirmed asystole; shock only if rhythm changes to VF/pulseless VT", "Post-ROSC ICU care if circulation returns"],
      nursingPriorities: ["Start compressions and call code/emergency response immediately; do not spend time searching for a blood pressure.", "Confirm leads/pads are connected and check another lead while CPR continues.", "Prepare epinephrine, airway support, access, rhythm checks, and rapid reversible-cause treatment."],
      complications: ["Death", "Hypoxic brain injury", "Multiorgan failure", "Recurrent cardiac arrest", "Rib/sternal injury from CPR"],
      patientEducation: ["For prevention contexts, teach emergency response, CPR/AED access, medication adherence, and reporting serious cardiac, respiratory, or electrolyte danger symptoms. During arrest, education is deferred."],
      nclexTraps: ["Asystole is non-shockable; CPR and epinephrine are the core actions.", "Always confirm a flatline in another lead and check connections without delaying compressions.", "Atropine is no longer routine ACLS for asystole.", "Search Hs and Ts while resuscitation continues.", "Fine VF can masquerade as asystole, so lead/pad confirmation matters."]
    },
    {
      name: "Atherosclerosis",
      category: "Cardiac/Vascular",
      aliases: ["atherosclerotic cardiovascular disease", "plaque buildup", "ASCVD"],
      definition: "Atherosclerosis is chronic plaque buildup in arterial walls that narrows arteries and increases thrombosis risk.",
      etiology: "It is driven by endothelial injury and lipid/inflammatory plaque formation. Risk factors include high LDL cholesterol, smoking, diabetes, hypertension, chronic kidney disease, obesity, sedentary lifestyle, unhealthy diet, older age, family history, and inflammatory conditions.",
      pathology: "Fat, cholesterol, inflammatory cells, calcium, and fibrous tissue form plaques within arteries. Plaques can narrow blood flow or rupture, triggering clot formation that can cause MI, stroke, acute limb ischemia, renal ischemia, mesenteric ischemia, or limb loss.",
      pathophysiology: "Stable plaques cause chronic ischemic symptoms such as angina or claudication when demand exceeds supply. Unstable plaque rupture creates acute thrombotic occlusion and tissue infarction.",
      riskFactors: ["High LDL or low HDL", "Smoking", "Diabetes", "Hypertension", "Older age", "Family history of premature ASCVD", "Chronic kidney disease", "Obesity", "Inflammatory disease"],
      signsSymptoms: ["Often asymptomatic until flow is limited or plaque ruptures", "Angina or MI symptoms when coronary arteries involved", "TIA/stroke symptoms when carotid/cerebral vessels involved", "Claudication, rest pain, weak pulses, or nonhealing ulcers in PAD", "Renal artery stenosis or mesenteric ischemia symptoms in affected beds"],
      diagnostics: ["Risk assessment and lipid panel", "Blood pressure, A1c/glucose, kidney function, smoking history", "ECG, stress testing, coronary imaging, carotid ultrasound, ABI, vascular ultrasound/CTA/MRA depending symptoms", "Evaluate acute chest pain/stroke/limb ischemia emergently"],
      labs: ["LDL cholesterol often elevated", "A1c/glucose may show diabetes", "Creatinine/eGFR guides medication and contrast safety", "Troponin if ACS suspected"],
      treatments: ["Lifestyle therapy: stop smoking, heart-healthy diet, exercise, weight and BP control", "Statin therapy when indicated", "Antiplatelet therapy for established ASCVD when prescribed", "Diabetes and hypertension management", "Revascularization/stent/bypass for selected severe symptomatic disease", "Emergency reperfusion for acute MI/stroke/limb ischemia when eligible"],
      nursingPriorities: ["Connect symptoms to the vascular bed: chest pain, neuro deficits, claudication/rest pain, renal changes, or abdominal pain after meals.", "Teach statin adherence and risk-factor control; plaque disease is systemic even if symptoms start in one area.", "Escalate sudden chest pain, stroke signs, cold pulseless limb, or tearing pain immediately."],
      complications: ["Myocardial infarction", "Stroke/TIA", "Peripheral artery disease and limb loss", "Aneurysm", "Renal artery stenosis", "Mesenteric ischemia", "Heart failure", "Death"],
      patientEducation: ["Teach smoking cessation, statin and BP/diabetes medication adherence, diet/exercise plan, foot care if PAD/diabetes, and emergency symptoms of MI/stroke/acute limb ischemia."],
      nclexTraps: ["Atherosclerosis is systemic; PAD means higher MI and stroke risk too.", "Stable plaque narrows; ruptured plaque clots.", "Statins are prevention and plaque-stabilization therapy, not just a number-lowering drug.", "Do not ignore nonhealing foot wounds in a client with PAD/diabetes.", "Lifestyle change is treatment, not a discharge decoration."]
    },
    {
      name: "Atrial flutter",
      category: "Cardiovascular",
      aliases: ["A flutter", "atrial tachyarrhythmia"],
      definition: "Atrial flutter is a regular atrial tachyarrhythmia usually caused by a macro-reentrant circuit, often with sawtooth flutter waves.",
      etiology: "It is associated with structural heart disease, atrial enlargement, heart failure, COPD, pulmonary embolism, hyperthyroidism, alcohol use, cardiac surgery, and prior atrial fibrillation or ablation.",
      pathology: "The atria depolarize rapidly, commonly around 250 to 350 beats/minute, while the AV node conducts only some impulses to the ventricles. Rapid ventricular response can reduce filling, lower cardiac output, worsen ischemia or heart failure, and allow atrial thrombus formation with embolic stroke risk.",
      pathophysiology: "The ventricular rhythm may be regular, often 150/minute with 2:1 AV conduction. Thromboembolic risk is managed similarly to atrial fibrillation using risk assessment and anticoagulation when indicated.",
      riskFactors: ["Older age", "Heart failure", "Valvular or structural heart disease", "COPD or pulmonary disease", "Hyperthyroidism", "Alcohol use", "Recent cardiac surgery", "Prior atrial fibrillation"],
      signsSymptoms: ["Palpitations", "Regular narrow-complex tachycardia often near 150/minute", "Dyspnea, fatigue, dizziness", "Chest discomfort", "Hypotension or syncope if unstable", "Worsening heart failure"],
      diagnostics: ["12-lead ECG showing sawtooth flutter waves", "Assess hemodynamic stability", "Electrolytes, magnesium, thyroid studies, troponin if ischemia suspected", "Echocardiography for structural disease", "Stroke risk assessment and anticoagulation review", "TEE if cardioversion timing and thrombus risk require it"],
      labs: ["Potassium and magnesium abnormalities can worsen arrhythmia", "TSH may identify hyperthyroidism", "Troponin if ischemia suspected", "Renal function guides anticoagulant dosing"],
      treatments: ["Synchronized cardioversion for unstable atrial flutter", "Rate control with beta blocker or nondihydropyridine calcium channel blocker when appropriate", "Rhythm control or antiarrhythmic therapy in selected clients", "Anticoagulation based on stroke risk and cardioversion timing", "Catheter ablation is often effective for typical flutter"],
      nursingPriorities: ["Check stability first: blood pressure, chest pain, acute heart failure, shock, altered mental status.", "Prepare synchronized cardioversion for unstable tachyarrhythmia.", "Monitor for stroke risk, anticoagulation safety, rate-control medication effects, and electrolyte triggers."],
      complications: ["Thromboembolic stroke", "Systemic embolism", "Tachycardia-induced cardiomyopathy", "Heart failure exacerbation", "Hypotension", "Myocardial ischemia", "Progression to atrial fibrillation"],
      patientEducation: ["Teach pulse/symptom monitoring, anticoagulant adherence/bleeding precautions if prescribed, trigger reduction, follow-up for ablation/cardiology, and emergency care for stroke signs, chest pain, syncope, or severe dyspnea."],
      nclexTraps: ["A regular rate near 150 can be atrial flutter with 2:1 conduction.", "Do not skip anticoagulation thinking just because it is flutter and not fibrillation.", "Unstable tachycardia needs synchronized cardioversion, not slow medication trial first.", "Adenosine may reveal flutter waves but does not fix the macro-reentry circuit.", "Rate control can hide symptoms while stroke risk remains."]
    },
    {
      name: "Atypical pneumonia",
      category: "Respiratory",
      aliases: ["walking pneumonia", "Mycoplasma pneumonia", "atypical community-acquired pneumonia"],
      definition: "Atypical pneumonia is pneumonia caused by organisms that often produce a more gradual or extrapulmonary presentation and may not respond to beta-lactam therapy alone.",
      etiology: "Common causes include Mycoplasma pneumoniae, Chlamydia pneumoniae, Legionella species, and respiratory viruses. Exposure clues include school/dorm outbreaks, contaminated water systems for Legionella, travel, and community clusters.",
      pathology: "Pathogens infect the respiratory tract and cause airway/interstitial inflammation. Mycoplasma can cause tracheobronchitis or pneumonia; Legionella can cause severe pneumonia with GI, neurologic, hepatic, renal, and hyponatremia findings.",
      pathophysiology: "Symptoms may be gradual with persistent dry cough, fever, headache, malaise, sore throat, and less dramatic exam findings than expected. Chest imaging can show pneumonia even when auscultation is mild.",
      riskFactors: ["Crowded living settings", "School or dorm exposure", "Smoking", "Chronic lung disease", "Older age or immunocompromise", "Contaminated water system exposure for Legionella"],
      signsSymptoms: ["Slowly worsening cough", "Fever, chills, headache, malaise", "Sore throat or hoarseness", "Dyspnea in pneumonia", "Wheezing in children", "GI symptoms, confusion, or hyponatremia in Legionella"],
      diagnostics: ["Clinical assessment and pulse oximetry", "Chest x-ray when pneumonia suspected", "PCR or respiratory testing when results will change care", "Legionella urine antigen/culture/PCR for severe pneumonia or exposure risk", "CBC/CMP, sodium, renal/liver tests in severe cases"],
      labs: ["WBC may be normal or mildly elevated", "Sodium may be low in Legionella", "LFTs/creatinine can be abnormal in severe Legionella"],
      treatments: ["Supportive care for mild bronchitis-type illness", "Macrolide, doxycycline, or respiratory fluoroquinolone coverage when atypical bacterial pneumonia requires antibiotics and local guidance supports it", "Oxygen/fluids as needed", "Hospital care for hypoxemia, severe disease, sepsis, or high-risk clients"],
      nursingPriorities: ["Assess oxygenation and severity; walking pneumonia can still become serious.", "Ask about outbreak, school/dorm, travel, and water-system exposure clues.", "Monitor for Legionella red flags: diarrhea, confusion, hyponatremia, renal/liver abnormalities, or severe hypoxemia."],
      complications: ["Severe pneumonia", "Asthma exacerbation", "Respiratory failure", "Encephalitis or neurologic complications", "Hemolytic anemia", "Renal dysfunction", "Sepsis in severe Legionella"],
      patientEducation: ["Teach cough hygiene, hydration, completing antibiotics if prescribed, avoiding school/work during fever/acute illness per guidance, and seeking care for difficulty breathing, persistent fever, confusion, or worsening symptoms."],
      nclexTraps: ["A client can look less sick than the x-ray in Mycoplasma pneumonia.", "Beta-lactam-only therapy may miss atypical bacteria because Mycoplasma lacks a cell wall.", "Legionella is the atypical pneumonia that can bring diarrhea, confusion, hyponatremia, and severe disease.", "Do not dismiss walking pneumonia if oxygen saturation or work of breathing is abnormal.", "Children with Mycoplasma may wheeze or have upper-respiratory/GI symptoms."]
    },
    {
      name: "Autonomic dysreflexia",
      category: "Neuro",
      aliases: ["autonomic hyperreflexia", "AD in spinal cord injury"],
      definition: "Autonomic dysreflexia is a sudden dangerous sympathetic surge causing hypertension in clients with spinal cord injury, usually at or above T6.",
      etiology: "Triggers are usually noxious or irritating stimuli below the injury level, especially bladder distention, blocked catheter, urinary tract infection, bowel impaction, pressure injury, tight clothing, fracture, ingrown toenail, sexual activity, labor, or procedures.",
      pathology: "A stimulus below the lesion triggers massive sympathetic vasoconstriction below the injury. Baroreceptors sense hypertension and cause vagal slowing above the lesion, but descending inhibition cannot pass the spinal cord injury, so severe hypertension persists until the trigger is removed.",
      pathophysiology: "Baseline blood pressure may be low in spinal cord injury, so a rise of 20 to 30 mmHg above baseline can be significant. Untreated episodes can cause stroke, seizure, retinal hemorrhage, pulmonary edema, MI, or death.",
      riskFactors: ["Spinal cord injury at or above T6", "Bladder catheter obstruction", "UTI", "Bowel impaction", "Pressure injury", "Skin burns/cold injury", "Tight clothing or devices", "Pregnancy/labor"],
      signsSymptoms: ["Sudden severe hypertension", "Pounding headache", "Bradycardia or tachycardia", "Flushing and sweating above lesion", "Pale cool skin and piloerection below lesion", "Nasal congestion", "Blurred vision", "Anxiety or feeling of doom"],
      diagnostics: ["Immediate blood pressure comparison with baseline", "Assess bladder first: kinked catheter, full drainage bag, retention, UTI", "Assess bowel impaction after bladder issues addressed", "Full skin/device check for pressure, tight clothing, burns, wounds, or fractures", "Monitor neurologic symptoms and ECG if severe"],
      labs: ["Urinalysis/culture if UTI suspected", "Labs depend on trigger or complications"],
      treatments: ["Sit upright and lower legs if possible", "Loosen tight clothing/devices", "Check blood pressure frequently", "Relieve bladder distention or catheter obstruction using ordered/local protocol", "Evaluate bowel impaction with topical anesthetic per protocol", "Rapid short-acting antihypertensive such as nitrates or nifedipine per protocol if BP remains dangerously high", "Treat the trigger"],
      nursingPriorities: ["Sit the client upright, call for help, and search for the trigger while monitoring BP every few minutes.", "Check bladder/catheter first because it is the most common trigger.", "Do not lay the client flat or delay treatment for a routine neuro workup while BP is dangerously high."],
      complications: ["Hemorrhagic stroke", "Seizure", "Retinal hemorrhage", "Pulmonary edema", "Myocardial ischemia", "Dysrhythmias", "Death"],
      patientEducation: ["Teach the client/caregiver to carry an autonomic dysreflexia emergency card, monitor BP, prevent bladder/bowel triggers, inspect skin daily, and seek emergency care for uncontrolled hypertension or severe symptoms."],
      nclexTraps: ["Autonomic dysreflexia is a hypertensive emergency in spinal cord injury, especially T6 or above.", "Sit them up first; do not lay them flat.", "Bladder distention or a kinked catheter is the first trigger to check.", "A BP that looks normal for other clients may be very high for someone with baseline SCI hypotension.", "Headache plus sweating/flushing above the lesion is a classic clue."]
    },
    {
      name: "AV fistula infection",
      category: "Renal/Urologic",
      aliases: ["arteriovenous fistula infection", "dialysis fistula infection", "hemodialysis access infection"],
      definition: "AV fistula infection is infection involving a surgically created hemodialysis artery-vein access.",
      etiology: "It can occur from needle cannulation, poor skin hygiene, skin breakdown, bacteremia, buttonhole technique contamination, immunosuppression, diabetes, or repeated access manipulation. Staphylococcus aureus is a common concern.",
      pathology: "Bacteria enter the access puncture site or surrounding tissue, causing cellulitis, abscess, bacteremia, septic thrombophlebitis, aneurysm/pseudoaneurysm infection, access loss, sepsis, or endocarditis.",
      pathophysiology: "The fistula is a high-flow vascular access. Infection near it can spread to the bloodstream quickly, and excessive pressure, puncture through infected skin, or cannulation of an infected site can worsen bleeding and access failure risk.",
      riskFactors: ["Hemodialysis needle cannulation", "Diabetes", "Poor hand/skin hygiene", "Buttonhole tract problems", "Skin breakdown or scab picking", "Immunosuppression", "Recent bacteremia"],
      signsSymptoms: ["Redness, warmth, swelling, tenderness over access", "Drainage, pustule, ulceration, or scab changes", "Fever, chills, malaise", "Pain during dialysis cannulation", "Bleeding or pseudoaneurysm change", "Thrill/bruit may still be present or may change if thrombosis occurs"],
      diagnostics: ["Inspect access before cannulation", "Assess thrill/bruit, distal perfusion, and bleeding", "Blood cultures if febrile or systemic symptoms", "Wound culture if drainage", "Ultrasound for abscess, pseudoaneurysm, or thrombosis", "Evaluate for endocarditis if persistent bacteremia"],
      labs: ["WBC may rise", "Blood cultures may be positive", "CRP/ESR may rise", "Vancomycin or other drug levels may be needed depending antibiotic"],
      treatments: ["Do not cannulate through infected skin", "Notify nephrology/dialysis access team", "Antibiotics guided by severity/cultures", "Drain abscess or surgically revise/remove infected access if needed", "Temporary dialysis catheter may be needed if access cannot be used", "Strict access hygiene"],
      nursingPriorities: ["Check access for redness, warmth, drainage, scabs, tenderness, and thrill/bruit before dialysis.", "Escalate fever/chills or access drainage immediately because bacteremia and sepsis are possible.", "Protect the access arm: no BP, no venipuncture, no tight clothing, and no scratching/picking scabs."],
      complications: ["Bacteremia", "Sepsis", "Endocarditis", "Access thrombosis", "Pseudoaneurysm rupture", "Loss of dialysis access", "Need for temporary catheter"],
      patientEducation: ["Teach washing access daily and before dialysis, checking for redness/warmth/drainage, feeling the thrill daily, and reporting fever, chills, access pain, drainage, or thrill changes."],
      nclexTraps: ["Do not cannulate through infected skin.", "A thrill does not rule out infection.", "Fever or chills during dialysis can be access bacteremia.", "Never use the fistula arm for BP or routine blood draws.", "Access infection can cost the client their dialysis lifeline."]
    },
    {
      name: "AV fistula thrombosis",
      category: "Renal/Urologic",
      aliases: ["dialysis fistula thrombosis", "clotted AV fistula", "hemodialysis access thrombosis"],
      definition: "AV fistula thrombosis is clotting of a hemodialysis fistula that reduces or stops access blood flow.",
      etiology: "Causes include venous stenosis, low flow, hypotension, dehydration, excessive compression after needle removal, tight clothing or sleeping on the access arm, hypercoagulability, infection, trauma, and repeated cannulation injury.",
      pathology: "A clot forms within the access circuit, often over an underlying stenosis. Flow falls, the thrill/bruit weakens or disappears, dialysis becomes inadequate, and the client may need urgent declotting or a temporary catheter.",
      pathophysiology: "A healthy fistula has a palpable thrill and audible bruit. Loss or change of thrill is a warning sign of stenosis or thrombosis; early salvage is time-sensitive before the clot organizes and the access is lost.",
      riskFactors: ["Venous stenosis", "Low blood pressure episodes", "Dehydration", "Prolonged pressure after dialysis needle removal", "Tight jewelry/clothing", "Sleeping on access arm", "Infection", "Prior access thrombosis"],
      signsSymptoms: ["Absent or decreased thrill", "Absent or changed bruit", "Access swelling or pain", "Difficulty cannulating", "High venous pressures or poor dialysis flow", "Prolonged bleeding can suggest stenosis before clot", "Cool hand or steal symptoms if flow/perfusion problem"],
      diagnostics: ["Palpate thrill and auscultate bruit", "Compare access appearance and dialysis flow trends", "Duplex ultrasound or fistulogram to identify stenosis/thrombus", "Assess distal pulses, capillary refill, sensation, and hand pain", "Dialysis adequacy and access pressure review"],
      labs: ["Potassium and fluid status matter if dialysis is missed/inadequate", "Coagulation testing if indicated", "Renal labs trend dialysis adequacy"],
      treatments: ["Urgent nephrology/vascular access notification", "Percutaneous thrombectomy/declot or surgical revision when salvageable", "Angioplasty/stent for stenosis when indicated", "Temporary dialysis catheter if urgent dialysis is needed", "Avoid pressure, BP cuffs, venipuncture, and heavy loads on access arm"],
      nursingPriorities: ["Teach and verify daily thrill checks; absent thrill is an urgent call.", "Protect the access arm from BP cuffs, blood draws, tight clothing, heavy pressure, or sleeping on it.", "If dialysis was missed due to thrombosis, monitor potassium, fluid overload, BP, and uremic symptoms."],
      complications: ["Loss of access", "Inadequate dialysis", "Hyperkalemia", "Fluid overload", "Need for central venous catheter", "Infection risk from catheter", "Distal ischemia if vascular compromise"],
      patientEducation: ["Feel for the thrill several times daily, report any change immediately, avoid sleeping on or compressing the access arm, use only gentle pressure after dialysis, and never allow BP or blood draws in the access arm."],
      nclexTraps: ["No thrill or changed thrill is urgent; do not wait until the next dialysis session.", "Too much pressure after needle removal can stop access flow.", "A clotted fistula threatens dialysis adequacy, so potassium and fluid overload become safety checks.", "Do not use the access arm for BP or venipuncture.", "Treat infection and stenosis early because both can lead to thrombosis."]
    },
    {
      name: "Avoidant personality disorder",
      category: "Psych/Substance",
      aliases: ["AVPD", "avoidant PD"],
      definition: "Avoidant personality disorder is a pervasive personality disorder marked by social inhibition, feelings of inadequacy, and hypersensitivity to criticism, rejection, or humiliation.",
      etiology: "Risk is associated with temperamentally high social anxiety/avoidance and early experiences of rejection, neglect, criticism, or marginalization. It often overlaps with social anxiety disorder, depression, obsessive-compulsive disorder, and dependent or borderline personality traits.",
      pathology: "The core pathology is a stable maladaptive pattern of fearing rejection while still wanting connection. The client avoids work, school, relationships, and new activities because expected criticism feels intolerable; this reinforces isolation, low self-worth, and functional impairment.",
      pathophysiology: "This is not a loss of desire for relationships. Anxiety, shame sensitivity, negative self-appraisal, and avoidance learning keep the client away from corrective social experiences.",
      riskFactors: ["Family or personal history of anxiety disorders", "Childhood rejection, bullying, neglect, or criticism", "Inhibited temperament", "Major depressive disorder", "Social anxiety disorder", "Other personality disorders"],
      signsSymptoms: ["Avoids interpersonal work or school activities because of criticism fears", "Unwilling to get involved unless sure of being liked", "Reserved in close relationships from fear of ridicule", "Preoccupation with rejection", "Feels socially inept, unappealing, or inferior", "Reluctant to take personal risks", "Isolation despite desire for relationships"],
      diagnostics: ["Clinical psychiatric assessment using DSM-5-TR criteria", "Pattern begins by early adulthood and is pervasive across settings", "Assess severity, function, safety, depression, suicidality, trauma history, substance use, and comorbid social anxiety", "Differentiate from schizoid personality disorder, autism spectrum disorder, agoraphobia, major depression, and psychotic disorders"],
      labs: ["No diagnostic lab test; testing is guided by symptoms or medication monitoring."],
      treatments: ["Cognitive behavioral therapy focused on social skills, graded exposure, cognitive restructuring, and shame/rejection beliefs", "Supportive psychotherapy", "Psychodynamic psychotherapy when appropriate", "Treat comorbid anxiety or depression with SSRIs/SNRIs or other prescribed medications when indicated", "Group therapy can help when paced safely"],
      nursingPriorities: ["Use a calm, respectful, nonshaming approach and explain confidentiality and boundaries.", "Assess suicide risk, depression, anxiety, isolation, and ability to meet work/school/self-care needs.", "Encourage small achievable social goals rather than forced confrontation.", "Reinforce strengths and participation while avoiding public criticism or sarcasm."],
      complications: ["Social isolation", "Occupational or academic impairment", "Major depressive disorder", "Social anxiety disorder", "Substance misuse", "Suicidal ideation when shame and depression worsen"],
      patientEducation: ["Teach that avoidant personality disorder is treatable, improvement is gradual, therapy works best with repeated small practice steps, and medication may target comorbid anxiety or depression rather than changing personality overnight."],
      nclexTraps: ["Avoidant personality disorder is not schizoid personality disorder; avoidant clients usually want relationships but fear rejection.", "Do not push sudden group exposure as a first step; use paced, supportive goals.", "Differentiate pervasive lifelong avoidance from a single depressive episode.", "CBT and supportive therapy are central.", "Always screen for depression and suicide risk."]
    },
    {
      name: "Benign paroxysmal positional vertigo",
      category: "Eye/ENT",
      aliases: ["BPPV", "benign positional vertigo", "benign postural vertigo"],
      definition: "Benign paroxysmal positional vertigo is a common peripheral vestibular disorder that causes brief episodes of spinning vertigo triggered by specific head positions.",
      etiology: "BPPV usually occurs when otoconia, calcium carbonate crystals from the utricle, dislodge into a semicircular canal, most often the posterior canal. Risk rises with aging, head trauma, vestibular neuritis, ear surgery, prolonged bed rest, osteoporosis, and prior vestibular disease.",
      pathology: "Free-floating otoconia shift with head movement and abnormally stimulate semicircular canal hair cells. The brain receives a false motion signal, producing sudden positional vertigo and characteristic nystagmus.",
      pathophysiology: "Episodes are typically short, often less than 60 seconds, with latency and fatigability on positional testing. Hearing loss, persistent neurologic deficits, severe new headache, direction-changing vertical nystagmus, or nonfatigable symptoms point away from simple BPPV and toward central causes.",
      riskFactors: ["Older age", "Female sex", "Head trauma", "Recent viral vestibular neuritis", "Prolonged immobilization", "Osteoporosis", "Prior inner-ear disorder"],
      signsSymptoms: ["Brief spinning vertigo triggered by rolling in bed, looking up, bending, or turning the head", "Nausea", "Positional nystagmus", "Unsteady gait during episodes", "No hearing loss or tinnitus in typical BPPV", "Symptoms fatigue with repeated provoking positions"],
      diagnostics: ["Dix-Hallpike maneuver for posterior canal BPPV", "Supine roll test when horizontal canal BPPV is suspected", "Neuro exam and gait assessment", "Imaging is not needed when findings are classic and no central red flags are present", "MRI/urgent evaluation for focal deficits, vertical nonfatigable nystagmus, severe headache, or stroke concern"],
      labs: ["No diagnostic lab test."],
      treatments: ["Canalith repositioning maneuver such as Epley for posterior canal BPPV", "Semont, Brandt-Daroff, or canal-specific maneuvers when appropriate", "Fall precautions during active vertigo", "Avoid routine vestibular suppressants because they can worsen balance and interfere with diagnosis", "Treat refractory or atypical cases with vestibular specialist referral"],
      nursingPriorities: ["Protect from falls and assist ambulation during acute vertigo.", "Ask about hearing loss, neuro deficits, severe headache, new weakness, diplopia, dysarthria, or inability to walk.", "Teach slow position changes and safe performance of prescribed canalith maneuvers.", "Document trigger positions, duration, nystagmus, nausea, and response to maneuver."],
      complications: ["Falls and injury", "Activity restriction", "Anxiety about movement", "Recurrence", "Missed central vertigo if red flags are ignored"],
      patientEducation: ["Teach that BPPV is mechanical crystal displacement, not infection. Report hearing loss, severe headache, fainting, weakness, speech problems, double vision, or vertigo that does not fit brief positional episodes."],
      nclexTraps: ["BPPV causes brief positional vertigo, usually less than 60 seconds, without hearing loss.", "Dix-Hallpike helps diagnose posterior canal BPPV.", "Epley repositions otoconia and is first-line for typical posterior canal disease.", "Do not make meclizine the main treatment for classic BPPV.", "Central signs need urgent evaluation, not repeated home maneuvers."]
    },
    {
      name: "Benign prostatic hyperplasia",
      category: "Renal/Urologic",
      aliases: ["BPH", "enlarged prostate", "benign prostate enlargement"],
      definition: "Benign prostatic hyperplasia is noncancerous enlargement of the prostate that can narrow the prostatic urethra and cause lower urinary tract symptoms.",
      etiology: "BPH is strongly age-related and is influenced by androgen signaling, stromal and epithelial growth, and bladder outlet obstruction. It is not prostate cancer, but symptoms can overlap with malignancy, infection, prostatitis, or neurogenic bladder.",
      pathology: "Hyperplastic prostate tissue compresses the urethra and increases resistance to urine outflow. The bladder initially compensates by contracting harder, then may develop incomplete emptying, trabeculation, urinary retention, infections, stones, hydronephrosis, or kidney injury.",
      pathophysiology: "Symptoms come from static obstruction from prostate size and dynamic smooth-muscle tone at the prostate/bladder neck. Anticholinergics, antihistamines, decongestants, opioids, and some antidepressants can worsen urinary retention.",
      riskFactors: ["Older age", "Family history", "Obesity", "Diabetes", "Sedentary lifestyle", "Cardiovascular disease", "Medications that reduce bladder emptying"],
      signsSymptoms: ["Hesitancy", "Weak or interrupted urine stream", "Straining", "Dribbling", "Incomplete emptying", "Nocturia", "Frequency and urgency", "Acute urinary retention when severe"],
      diagnostics: ["Symptom score and urinary history", "Digital rectal exam", "Urinalysis to rule out infection or hematuria", "PSA when clinically appropriate after shared decision-making", "Postvoid residual and uroflowmetry when retention/obstruction is suspected", "Creatinine, renal ultrasound, cystoscopy, or urodynamic testing when complicated"],
      labs: ["Urinalysis may show UTI or hematuria", "Creatinine rises if obstructive nephropathy occurs", "PSA may be elevated from BPH, prostatitis, or prostate cancer"],
      treatments: ["Watchful waiting and lifestyle changes for mild symptoms", "Reduce evening fluids, caffeine, alcohol, and bladder irritants", "Alpha-1 blocker such as tamsulosin for symptom relief", "5-alpha-reductase inhibitor such as finasteride or dutasteride for enlarged prostate over time", "Catheterization for acute urinary retention", "Urology procedures such as TURP or minimally invasive therapy when medication fails or complications occur"],
      nursingPriorities: ["Ask about inability to void, suprapubic pain, fever/chills, hematuria, recurrent UTI, and kidney disease signs.", "Monitor intake/output, postvoid residual if ordered, urinary retention, orthostatic hypotension with alpha blockers, and sexual side effects.", "Avoid giving decongestants or anticholinergics without checking retention risk.", "Escalate complete inability to urinate, fever with urinary symptoms, gross hematuria, or flank pain."],
      complications: ["Acute urinary retention", "Recurrent UTI", "Bladder stones", "Hematuria", "Hydronephrosis", "Kidney injury", "Bladder decompensation"],
      patientEducation: ["Teach timed voiding, limiting late fluids/caffeine/alcohol, rising slowly with alpha blockers, not stopping medications abruptly, and seeking urgent care for inability to urinate."],
      nclexTraps: ["BPH is benign but can still cause dangerous urinary retention and kidney injury.", "Alpha-1 blocker medications can cause orthostatic hypotension.", "Finasteride/dutasteride work slowly and can lower PSA interpretation.", "Do not dismiss fever, chills, hematuria, or inability to void.", "Avoid decongestants and anticholinergics when retention risk is high."]
    },
    {
      name: "Benzodiazepine intoxication",
      category: "Psych/Substance",
      aliases: ["benzodiazepine toxicity", "benzodiazepine poisoning", "benzo intoxication"],
      definition: "Benzodiazepine intoxication is a sedative-hypnotic toxidrome from excessive benzodiazepine effect at the GABA-A receptor.",
      etiology: "It may follow recreational use, accidental extra dosing, older adult sensitivity, medication errors, renal/hepatic vulnerability with some agents, or combining benzodiazepines with alcohol, opioids, barbiturates, antipsychotics, or other CNS depressants.",
      pathology: "Benzodiazepines enhance GABA-mediated inhibition, causing CNS depression. Isolated intoxication often produces drowsiness, slurred speech, ataxia, and altered mental status with relatively normal vital signs, but coingestants can cause respiratory depression, aspiration, coma, hypotension, and death.",
      pathophysiology: "The danger is usually airway and breathing, especially with opioids or alcohol. A urine drug screen can miss some benzodiazepines and does not prove causality, so clinical assessment and coingestion screening matter.",
      riskFactors: ["Older age", "High dose or rapid dose escalation", "Concurrent opioids or alcohol", "Sleep apnea or COPD", "Liver disease", "Polypharmacy", "Substance use disorder", "Intentional self-harm"],
      signsSymptoms: ["Sedation", "Drowsiness to coma", "Slurred speech", "Ataxia", "Nystagmus", "Confusion", "Impaired coordination", "Respiratory depression when severe or with coingestants"],
      diagnostics: ["Airway/breathing/circulation assessment", "Point-of-care glucose", "Medication reconciliation and pill count when possible", "Screen for acetaminophen, salicylate, ethanol, opioids, and other coingestants", "ECG for QRS/QTc abnormalities suggesting other drugs", "Urine drug screen may support exposure but can be falsely negative"],
      labs: ["Glucose immediately for altered mental status", "Acetaminophen/salicylate/ethanol levels when overdose possible", "ABG/VBG if hypoventilation suspected", "Pregnancy test when relevant"],
      treatments: ["Supportive care and monitoring", "Airway positioning, oxygen, ventilation, or intubation if needed", "IV fluids for hypotension if present", "Naloxone if opioid coingestion is suspected", "Flumazenil only in carefully selected nondependent patients because it can trigger seizures or withdrawal", "Mental health evaluation for intentional intoxication"],
      nursingPriorities: ["Prioritize airway, respiratory rate, oxygenation, end-tidal CO2 if available, aspiration precautions, and fall precautions.", "Do not assume isolated benzodiazepine exposure; assess for alcohol, opioids, acetaminophen, salicylates, and trauma.", "Monitor level of consciousness and protect from self-harm if intentional use is possible.", "Prepare for ventilatory support rather than relying on an antidote."],
      complications: ["Aspiration pneumonitis", "Respiratory arrest", "Coma", "Falls and trauma", "Rhabdomyolysis with prolonged immobilization", "Death especially with coingestants"],
      patientEducation: ["Teach not to mix benzodiazepines with alcohol, opioids, or other sedatives, to use only prescribed doses, to secure medications, and to seek help for misuse or self-harm thoughts."],
      nclexTraps: ["Isolated benzodiazepine intoxication often has CNS depression with near-normal vital signs.", "Airway and breathing come first.", "Flumazenil is not routine because chronic users can seize or enter withdrawal.", "Check glucose and coingestants.", "A negative urine drug screen does not rule out all benzodiazepines."]
    },
    {
      name: "Benzodiazepine overdose",
      category: "Emergency/Critical Care/Toxicology",
      aliases: ["benzodiazepine OD", "benzo overdose"],
      definition: "Benzodiazepine overdose is ingestion or exposure to a benzodiazepine dose high enough to cause clinically important sedation, impaired coordination, or coma.",
      etiology: "Common situations include intentional overdose, accidental pediatric ingestion, taking extra doses for anxiety/insomnia, combining benzodiazepines with alcohol or opioids, and procedural sedation overshoot.",
      pathology: "Excess benzodiazepine receptor stimulation increases inhibitory GABA-A signaling. Pure overdose is often survivable with time and supportive care, but mixed overdose can suppress respirations, airway reflexes, and blood pressure.",
      pathophysiology: "The overdose risk is multiplied by opioids, ethanol, barbiturates, gabapentinoids, and other sedatives. Flumazenil can reverse sedation but may precipitate seizures, dysrhythmias, or life-threatening withdrawal in dependent patients or mixed overdoses.",
      riskFactors: ["Access to large medication supply", "Opioid or alcohol use", "Depression or suicidal ideation", "Older age", "COPD or sleep apnea", "History of substance use disorder", "Concurrent sedatives"],
      signsSymptoms: ["Somnolence", "Slurred speech", "Ataxia", "Confusion", "Hyporeflexia", "Stupor or coma", "Respiratory depression with high dose or coingestants", "Falls or trauma"],
      diagnostics: ["ABCs and continuous pulse oximetry/cardiac monitoring", "Point-of-care glucose", "ECG", "Acetaminophen, salicylate, ethanol, and opioid assessment", "Medication list, timing, amount, and intent", "Consider CT head or trauma workup if altered mental status is unexplained"],
      labs: ["Glucose", "CMP and renal/hepatic function if prolonged sedation", "ABG/VBG if hypoventilation", "Acetaminophen/salicylate/ethanol levels", "Pregnancy test when relevant"],
      treatments: ["Supportive care with airway protection, oxygen, ventilation, and observation", "Treat hypotension with fluids and appropriate support", "Avoid activated charcoal in most benzodiazepine overdose because aspiration risk usually outweighs benefit", "Flumazenil only for selected nondependent cases such as iatrogenic oversedation or accidental pediatric ingestion after expert consultation", "Psychiatric evaluation and safety planning for intentional overdose"],
      nursingPriorities: ["Position to protect airway, suction as needed, and prepare for bag-mask ventilation/intubation if respirations decline.", "Institute fall, aspiration, seizure, and suicide precautions as indicated.", "Do not give flumazenil reflexively; clarify chronic benzodiazepine use and coingestions.", "Trend mental status and respiratory status until sedation clears."],
      complications: ["Respiratory arrest", "Aspiration", "Hypoxic injury", "Trauma", "Withdrawal or seizures after inappropriate flumazenil", "Recurrent sedation after short flumazenil effect", "Death with coingestants"],
      patientEducation: ["Teach safe storage, avoiding alcohol/opioid combinations, using one prescriber/pharmacy when possible, and calling poison control or emergency services for overdose."],
      nclexTraps: ["Supportive care is the mainstay of benzodiazepine overdose.", "Do not choose activated charcoal or hemodialysis as routine therapy.", "Flumazenil can cause seizures in dependent patients and mixed overdoses.", "Intentional overdose needs mental health evaluation before discharge.", "Respiratory depression usually means severe exposure or coingestants."]
    },
    {
      name: "Benzodiazepine withdrawal",
      category: "Psych/Substance",
      aliases: ["benzo withdrawal", "benzodiazepine discontinuation syndrome"],
      definition: "Benzodiazepine withdrawal is a potentially serious withdrawal syndrome that occurs after abrupt stopping or rapid dose reduction in a physically dependent person.",
      etiology: "Dependence can follow long-term prescribed use, high-dose use, short-acting agents such as alprazolam, substance use disorder, or repeated cycles of stopping and restarting. Risk rises when the taper is too fast.",
      pathology: "Chronic benzodiazepine exposure downregulates and adapts GABAergic signaling. Sudden removal leaves unopposed CNS excitability, causing rebound anxiety/insomnia, autonomic symptoms, perceptual changes, tremor, delirium, psychosis, and seizures.",
      pathophysiology: "Short-acting drugs can produce faster, more intense rebound between doses. Safe discontinuation usually requires individualized gradual tapering under clinical supervision; abrupt discontinuation can be dangerous and potentially life-threatening.",
      riskFactors: ["Long duration of use", "High daily dose", "Short-acting benzodiazepine", "History of withdrawal seizures", "Alcohol or sedative use disorder", "Older age", "Pregnancy", "Comorbid anxiety/PTSD", "Rapid taper"],
      signsSymptoms: ["Anxiety and panic", "Insomnia and nightmares", "Tremor", "Sweating", "Tachycardia or hypertension", "Nausea", "Perceptual hypersensitivity", "Agitation", "Confusion", "Hallucinations", "Seizures in severe withdrawal"],
      diagnostics: ["Medication history including agent, dose, duration, timing of last dose, and taper speed", "Vital signs and CIWA-style symptom monitoring when used by protocol", "Assess alcohol/other sedative withdrawal overlap", "Screen for suicidality, delirium, psychosis, and seizure risk", "Evaluate electrolytes/glucose or other causes when symptoms are severe"],
      labs: ["Glucose and electrolytes if altered, seizing, vomiting, or medically unstable", "Toxicology testing may help identify co-use but does not replace history."],
      treatments: ["Do not abruptly stop chronic benzodiazepines unless medically necessary with expert management", "Individualized slow taper, often using the current drug or a longer-acting benzodiazepine when appropriate", "Treat severe withdrawal or seizures in a monitored setting", "Psychotherapy and nonbenzodiazepine treatment for underlying anxiety/insomnia", "Substance use treatment and safety planning when misuse is present"],
      nursingPriorities: ["Assess seizure risk, delirium, autonomic instability, suicidality, and concurrent alcohol withdrawal.", "Use seizure and fall precautions for moderate to severe withdrawal.", "Do not shame the client; explain physical dependence and supervised tapering.", "Escalate hallucinations, severe agitation, confusion, unstable vitals, or seizure activity immediately."],
      complications: ["Generalized seizures", "Delirium", "Psychosis", "Severe insomnia", "Suicidality", "Relapse/misuse", "Injury from tremor/falls/seizures"],
      patientEducation: ["Teach that tapering must be clinician-guided, symptoms may fluctuate, alcohol/other sedatives increase danger, and urgent help is needed for seizures, confusion, hallucinations, chest pain, or self-harm thoughts."],
      nclexTraps: ["Benzodiazepine withdrawal can cause seizures; do not abruptly stop chronic therapy.", "Withdrawal is opposite of intoxication: CNS hyperexcitability rather than sedation.", "A slow taper is safer than a rapid stop.", "Short-acting agents can have intense rebound symptoms.", "Check for overlapping alcohol withdrawal and suicide risk."]
    },
    {
      name: "Blood transfusion reaction",
      category: "Hematology/Oncology",
      aliases: ["transfusion reaction", "acute transfusion reaction", "hemolytic transfusion reaction"],
      definition: "A blood transfusion reaction is an adverse immune, circulatory, infectious, or metabolic response that occurs during or after transfusion of a blood component.",
      etiology: "Causes include febrile nonhemolytic reaction, allergic reaction, acute hemolytic transfusion reaction from ABO incompatibility, delayed hemolysis, transfusion-associated circulatory overload (TACO), transfusion-related acute lung injury (TRALI), bacterial contamination, and rare graft-versus-host disease.",
      pathology: "The most urgent concern is acute hemolysis, where recipient antibodies destroy donor red cells, causing intravascular hemolysis, hemoglobinuria, shock, acute kidney injury, and DIC. TRALI causes noncardiogenic pulmonary edema, while TACO causes volume-overload pulmonary edema.",
      pathophysiology: "Fever, chills, dyspnea, flank/back pain, hypotension, urticaria, itching, dark urine, or anxiety during transfusion can signal reaction. Localized mild hives may be managed differently, but systemic symptoms require stopping the transfusion and blood bank investigation.",
      riskFactors: ["Prior transfusion reaction", "Multiple transfusions", "Pregnancy history", "IgA deficiency", "Heart failure or renal insufficiency for TACO", "Clerical mismatch or wrong patient/unit", "Immunocompromised state for GVHD"],
      signsSymptoms: ["Fever or chills", "Rigors", "Dyspnea", "Light-headedness", "Urticaria or itching", "Flank/back/chest pain", "Hypotension", "Tachycardia", "Dark urine or hemoglobinuria", "Wheezing or angioedema in allergic reaction"],
      diagnostics: ["Stop transfusion and recheck patient/unit identification", "Notify provider and blood bank", "Send remaining blood product and tubing per policy", "Direct antiglobulin test (DAT/Coombs), repeat type and crossmatch, plasma/urine hemoglobin", "CBC, bilirubin, LDH, haptoglobin, creatinine, coagulation tests when hemolysis/DIC suspected", "Chest imaging/BNP assessment to distinguish TACO vs TRALI when respiratory distress occurs"],
      labs: ["Positive DAT may support hemolysis", "Low haptoglobin, high LDH/bilirubin, hemoglobinuria", "Creatinine may rise with acute kidney injury", "Coagulation abnormalities if DIC", "Blood cultures if bacterial contamination suspected"],
      treatments: ["Stop transfusion immediately for systemic symptoms", "Keep IV line open with normal saline using new tubing", "Support airway, breathing, circulation, BP, and renal perfusion", "Treat fever, allergic symptoms, anaphylaxis, TACO, TRALI, or hemolysis according to cause", "Do not restart the implicated unit until the reaction is evaluated and blood bank approves next steps"],
      nursingPriorities: ["Before transfusion, verify patient and blood product with another qualified clinician per policy.", "Stay with the client during early transfusion and monitor vital signs closely.", "At first systemic reaction sign, stop transfusion, maintain IV access with normal saline, notify provider/blood bank, and send required specimens.", "Document exact symptoms, timing, vital signs, product type, unit number, and interventions."],
      complications: ["Acute hemolytic reaction", "Shock", "Acute kidney injury", "DIC", "TRALI", "TACO", "Anaphylaxis", "Sepsis", "Death"],
      patientEducation: ["Teach clients to report chills, feverish feeling, itching, hives, trouble breathing, chest/back/flank pain, dizziness, or dark urine immediately during or after transfusion."],
      nclexTraps: ["First action for systemic transfusion reaction symptoms is stop the transfusion, not slow it down.", "Keep the IV open with normal saline and new tubing.", "ABO incompatibility can cause acute hemolytic reaction, shock, DIC, and kidney injury.", "Do not restart the same blood unit after a serious reaction.", "Differentiate TACO volume overload from TRALI noncardiogenic lung injury."]
    },
    {
      name: "Brain abscess",
      category: "Neuro",
      aliases: ["cerebral abscess", "intracranial abscess"],
      definition: "A brain abscess is a focal collection of pus within brain tissue caused by infection.",
      etiology: "It can result from direct extension from sinusitis, otitis media, mastoiditis, dental infection, penetrating trauma, neurosurgery, or hematogenous spread from endocarditis, lung infection, cyanotic heart disease, or bacteremia. Immunocompromised clients may have fungal or toxoplasma causes.",
      pathology: "Infection causes cerebritis that becomes an encapsulated abscess with surrounding edema and mass effect. Increased intracranial pressure, focal brain injury, seizures, ventriculitis, rupture, or herniation can occur.",
      pathophysiology: "Fever may be absent after encapsulation. Lumbar puncture is avoided when brain abscess is suspected because pressure shifts can precipitate herniation and CSF findings are nonspecific.",
      riskFactors: ["Chronic sinusitis or otitis", "Dental infection", "Endocarditis", "Penetrating head trauma", "Recent neurosurgery", "Immunosuppression", "Cyanotic congenital heart disease", "IV drug use"],
      signsSymptoms: ["Headache", "Nausea/vomiting", "Lethargy", "Seizures", "Personality change", "Papilledema", "Focal neurologic deficits", "Fever or chills may be absent"],
      diagnostics: ["Contrast-enhanced MRI with diffusion-weighted imaging preferred", "Contrast CT if MRI unavailable", "Blood cultures when hematogenous source possible", "Stereotactic aspiration or surgical sample for culture when needed", "Evaluate source such as ear/sinus/dental/lung/endocarditis", "Avoid lumbar puncture if mass lesion or increased ICP is suspected"],
      labs: ["CBC may show leukocytosis but can be normal", "Blood cultures may identify hematogenous source", "Inflammatory markers may support infection but are nonspecific"],
      treatments: ["Immediate empiric IV antibiotics without waiting for culture when suspected", "Common empiric regimens include ceftriaxone or cefotaxime plus metronidazole, with vancomycin when staphylococcal risk exists", "Culture-directed antibiotics for weeks", "CT-guided stereotactic aspiration or surgical drainage for many abscesses, especially larger or accessible lesions", "Corticosteroids only for significant edema/mass effect when directed", "Antiseizure therapy when indicated"],
      nursingPriorities: ["Monitor neurologic status, seizure activity, ICP signs, airway, fever, and focal deficits.", "Institute seizure and fall precautions.", "Prepare for MRI/CT, blood cultures, IV antibiotics, and possible neurosurgical drainage.", "Do not prepare for lumbar puncture when increased ICP or mass lesion is suspected unless specialist direction changes the plan."],
      complications: ["Seizures", "Increased intracranial pressure", "Brain herniation", "Ventricular rupture", "Meningitis", "Focal neurologic deficit", "Sepsis", "Death"],
      patientEducation: ["Teach the need for prolonged antibiotics, follow-up imaging, seizure precautions if prescribed, and urgent reporting of worsening headache, fever, confusion, weakness, or seizures."],
      nclexTraps: ["Brain abscess may have no fever.", "Contrast MRI/CT comes before lumbar puncture when mass effect is possible.", "Do not delay antibiotics for culture results if abscess is suspected.", "Seizure precautions matter.", "Drainage is often needed for larger accessible abscesses."]
    },
    {
      name: "Brain herniation",
      category: "Neuro",
      aliases: ["cerebral herniation", "uncal herniation", "tonsillar herniation", "transtentorial herniation"],
      definition: "Brain herniation is life-threatening displacement of brain tissue across rigid intracranial structures because of increased intracranial pressure or mass effect.",
      etiology: "Causes include traumatic hematoma, intracerebral hemorrhage, ischemic stroke with edema, brain tumor, abscess, hydrocephalus, cerebral edema, venous sinus thrombosis, liver failure, and posterior fossa masses.",
      pathology: "Rising intracranial pressure pushes brain tissue through the tentorial notch, under the falx, centrally downward, upward from the posterior fossa, or through the foramen magnum. Compressed cranial nerves, cerebral arteries, brainstem structures, and CSF pathways can cause infarction, respiratory arrest, and brain death.",
      pathophysiology: "Uncal herniation can compress cranial nerve III, causing an ipsilateral fixed dilated pupil. Progressive brainstem compression causes declining consciousness, abnormal respirations, posturing, loss of brainstem reflexes, and Cushing reflex with hypertension, bradycardia, and irregular respirations.",
      riskFactors: ["Traumatic brain injury", "Intracranial hemorrhage", "Large ischemic stroke", "Brain tumor", "Brain abscess", "Hydrocephalus", "Posterior fossa lesion", "Anticoagulation with bleed risk"],
      signsSymptoms: ["Decreasing level of consciousness", "Severe headache and vomiting", "Fixed dilated pupil or unequal pupils", "Oculomotor palsy", "Hemiparesis", "Decorticate or decerebrate posturing", "Cushing reflex", "Abnormal respirations", "Loss of brainstem reflexes", "Cardiorespiratory arrest in late tonsillar herniation"],
      diagnostics: ["Immediate ABC stabilization", "Urgent CT or MRI after stabilization", "Frequent neurologic exams including pupils, motor response, and brainstem reflexes", "ICP monitoring in selected ICU/neurosurgical patients", "Evaluate cause such as hemorrhage, tumor, abscess, hydrocephalus, or edema"],
      labs: ["Glucose and sodium/osmolality guide neurocritical care", "Coagulation studies if hemorrhage or anticoagulant reversal is possible", "ABG if ventilated or respiratory failure suspected"],
      treatments: ["Immediate airway, breathing, circulation stabilization", "ICU admission and neurosurgical consultation", "Head midline and head of bed about 30 degrees if perfusion allows", "Hyperosmolar therapy such as mannitol or hypertonic saline when ordered", "Controlled ventilation/intubation when indicated", "Treat underlying cause such as surgical decompression, hematoma evacuation, CSF diversion, antibiotics/drainage for abscess, or tumor therapy", "Avoid hypotension and hypoxia"],
      nursingPriorities: ["This is an emergency: call rapid response/provider/neurosurgery for acute pupil change, posturing, or declining consciousness.", "Maintain airway/oxygenation and avoid hypotension.", "Keep head midline, avoid neck flexion/rotation, cluster care to reduce ICP spikes, and monitor pupils frequently.", "Prepare for CT, hyperosmolar therapy, intubation, and surgical decompression."],
      complications: ["Brainstem compression", "Stroke/infarction", "Hydrocephalus", "Respiratory arrest", "Cardiac arrest", "Permanent neurologic deficit", "Brain death", "Death"],
      patientEducation: ["For families, explain that sudden worsening, pupil changes, and breathing changes signal a life-threatening pressure shift requiring emergency ICU/neurosurgical care."],
      nclexTraps: ["A fixed dilated pupil with declining LOC is a herniation red flag.", "Cushing reflex is late and ominous.", "Stabilize ABCs before transport/imaging.", "Do not lower BP aggressively if cerebral perfusion is threatened.", "Keep head midline and avoid actions that spike ICP."]
    },
    {
      name: "Brief psychotic disorder",
      category: "Psych/Substance",
      aliases: ["brief reactive psychosis", "acute brief psychosis"],
      definition: "Brief psychotic disorder is sudden onset of at least one psychotic symptom lasting at least 1 day but less than 1 month, followed by return to premorbid functioning.",
      etiology: "It may occur with a major stressor such as bereavement or trauma, without an obvious stressor, or postpartum. Predisposing factors include certain personality disorders, medical illness, steroid exposure, substance use, and family or personal vulnerability to psychosis.",
      pathology: "The pathology is an acute transient disruption in reality testing with delusions, hallucinations, disorganized speech, or grossly disorganized/catatonic behavior. Duration and full recovery distinguish it from schizophreniform disorder or schizophrenia.",
      pathophysiology: "Stress, sleep deprivation, medical illness, substance exposure, and vulnerability can precipitate acute dopaminergic/psychotic symptoms. Diagnosis requires ruling out mood disorders with psychosis, substance/medication effects, delirium, neurologic disease, and schizophrenia-spectrum disorders.",
      riskFactors: ["Major psychosocial stressor", "Postpartum period", "Sleep deprivation", "Personality disorder traits", "Substance use", "Steroids or other medication triggers", "Family history of psychosis"],
      signsSymptoms: ["Delusions", "Hallucinations", "Disorganized speech", "Grossly disorganized behavior", "Catatonic behavior", "Emotional turmoil", "Impaired judgment", "Possible agitation or fear"],
      diagnostics: ["Clinical psychiatric assessment using DSM-5-TR duration criteria", "Assess suicide, homicide, command hallucinations, ability to care for self, and risk to infant if postpartum", "Rule out delirium, intoxication/withdrawal, medication effects, mood disorder, schizophrenia, neurologic disease, and endocrine/metabolic causes", "Collateral history helps determine onset/duration and baseline function"],
      labs: ["Toxicology, pregnancy test, CBC/CMP/TSH or other tests as clinically indicated to rule out medical/substance causes"],
      treatments: ["Safe low-stimulation environment", "Psychosocial support and crisis stabilization", "Short-term antipsychotic medication when needed", "Hospitalization if danger to self/others, inability to care for self, severe agitation, or postpartum psychosis concern", "Follow-up because relapse or later schizophrenia-spectrum illness can occur"],
      nursingPriorities: ["Assess safety first: suicide, homicide, command hallucinations, severe agitation, self-care ability, and postpartum infant safety.", "Use calm, simple communication and do not argue with delusions.", "Reduce stimuli, maintain boundaries, and orient gently.", "Monitor medication effects, hydration/nutrition, sleep, and response to antipsychotics if used."],
      complications: ["Self-harm", "Harm to others", "Poor intake/dehydration", "Trauma from disorganized behavior", "Relapse", "Progression to schizophrenia-spectrum or mood disorder"],
      patientEducation: ["Teach the client/family that symptoms require prompt follow-up even when they resolve, medications may be short-term, and urgent care is needed for suicidal thoughts, command hallucinations, severe insomnia, or postpartum safety concerns."],
      nclexTraps: ["Brief psychotic disorder lasts 1 day to less than 1 month with return to baseline.", "Longer duration points toward schizophreniform disorder or schizophrenia.", "Always rule out substance, medication, delirium, and mood causes.", "Do not argue with hallucinations or delusions.", "Postpartum psychosis signs require emergency safety action."]
    },
    {
      name: "Bronchiectasis",
      category: "Respiratory",
      aliases: ["non-CF bronchiectasis", "bronchial dilation"],
      definition: "Bronchiectasis is chronic, usually irreversible dilation and destruction of bronchi caused by repeated infection, inflammation, and impaired airway clearance.",
      etiology: "Causes include cystic fibrosis, primary ciliary dyskinesia, immune deficiency, recurrent pneumonia, tuberculosis or nontuberculous mycobacteria, allergic bronchopulmonary aspergillosis, chronic aspiration/GERD, airway obstruction, COPD/asthma overlap, autoimmune disease, and idiopathic cases.",
      pathology: "Chronic infection and inflammation damage bronchial wall elastin, cartilage, and muscle. Dilated airways retain mucus, promote bacterial colonization, and drive a vicious cycle of more infection, inflammation, airway obstruction, and lung injury.",
      pathophysiology: "Purulent sputum reflects impaired mucociliary clearance and chronic infection. Pseudomonas colonization signals more severe disease and worse outcomes. Bronchial artery neovascularization can cause hemoptysis, sometimes massive.",
      riskFactors: ["Cystic fibrosis", "Primary ciliary dyskinesia", "Recurrent severe respiratory infections", "Immunodeficiency such as CVID", "Chronic aspiration", "Airway obstruction", "ABPA", "Rheumatoid arthritis or Sjogren syndrome", "COPD"],
      signsSymptoms: ["Chronic cough", "Daily thick purulent sputum", "Dyspnea", "Wheezing", "Crackles/rhonchi", "Recurrent exacerbations", "Hemoptysis", "Fatigue", "Weight loss or low lean body mass in advanced disease"],
      diagnostics: ["High-resolution CT is the diagnostic imaging test of choice", "Chest x-ray may show tram-track lines but can miss disease", "Sputum Gram stain/culture including mycobacteria when indicated", "Pulmonary function tests for baseline and monitoring", "Test for underlying causes such as immunoglobulins, CF, ABPA, aspiration, or autoimmune disease when suspected"],
      labs: ["Sputum culture can show Pseudomonas, H. influenzae, S. aureus, nontuberculous mycobacteria, or other organisms", "CBC/CRP may rise during exacerbation", "Immunoglobulin levels when immune deficiency is suspected"],
      treatments: ["Airway clearance techniques such as chest physiotherapy, postural drainage, positive expiratory pressure, or active cycle breathing", "Regular exercise and pulmonary rehabilitation", "Vaccination against influenza, pneumococcus, COVID, and RSV when indicated", "Bronchodilators for airflow obstruction or dyspnea", "Antibiotics for exacerbations guided by sputum culture", "Suppressive or inhaled antibiotics for selected frequent exacerbators", "Treat underlying cause and manage hemoptysis urgently"],
      nursingPriorities: ["Assess sputum volume/color, cough, dyspnea, oxygenation, fever, hemoptysis, and exacerbation pattern.", "Encourage hydration if appropriate and teach sustainable airway clearance.", "Collect sputum culture before antibiotics when ordered.", "Escalate massive hemoptysis, hypoxemia, sepsis signs, or worsening respiratory distress."],
      complications: ["Recurrent pneumonia", "Massive hemoptysis", "Respiratory failure", "Pulmonary hypertension", "Right heart failure", "Multidrug-resistant infection", "Lung abscess"],
      patientEducation: ["Teach daily airway clearance, recognizing exacerbation signs, vaccine adherence, avoiding smoke, completing antibiotics, and seeking urgent care for large-volume blood, severe dyspnea, or low oxygen."],
      nclexTraps: ["Bronchiectasis is not just chronic bronchitis; HRCT shows dilated damaged airways.", "Daily purulent sputum and recurrent infections are key.", "Airway clearance is core treatment, not optional hygiene.", "Culture sputum to guide antibiotics.", "Hemoptysis can become life-threatening."]
    },
    {
      name: "Buerger disease",
      category: "Cardiac/Vascular",
      aliases: ["thromboangiitis obliterans", "Buerger's disease"],
      definition: "Buerger disease is inflammatory, segmental thrombosis of small and medium arteries and veins, strongly linked to tobacco or nicotine exposure.",
      etiology: "Nearly all affected clients smoke or use tobacco/nicotine products. Cannabis use and secondhand smoke may contribute. The disease is not classic atherosclerosis; it is a tobacco-associated inflammatory occlusive vasculopathy of distal extremity vessels.",
      pathology: "Inflamed vessels develop thrombi that obstruct blood flow to fingers, toes, hands, and feet. Recurrent ischemia causes claudication, rest pain, Raynaud-like color change, ischemic ulcers, infection, gangrene, and possible amputation.",
      pathophysiology: "Nicotine/tobacco exposure irritates or activates vascular inflammation and clotting in susceptible people. Even small ongoing exposure can worsen disease, and nicotine replacement may perpetuate symptoms because nicotine itself can affect vessels.",
      riskFactors: ["Cigarette smoking", "Smokeless tobacco", "Vaping or nicotine exposure", "Secondhand smoke", "Cannabis use", "Male sex historically", "Younger age than typical atherosclerotic PAD"],
      signsSymptoms: ["Pain in hands/feet with activity or at rest", "Finger or toe ischemia", "Cold sensitivity and Raynaud-like color changes", "Numbness or tingling", "Diminished distal pulses", "Painful nonhealing ulcers", "Superficial thrombophlebitis", "Gangrene"],
      diagnostics: ["Clinical diagnosis after excluding mimics", "Detailed tobacco/nicotine/cannabis exposure history", "Vascular exam and distal pulse assessment", "ABI/toe pressures and vascular lab testing", "Blood tests to rule out diabetes, autoimmune disease, and clotting disorders", "CT/MR angiography or catheter angiogram showing distal segmental occlusions/collaterals"],
      labs: ["No single diagnostic lab test", "Testing may exclude diabetes, lupus/scleroderma, hypercoagulable states, or other vasculitis"],
      treatments: ["Complete cessation of all tobacco and nicotine exposure is the only proven disease-modifying treatment", "Avoid secondhand smoke, vaping, nicotine replacement, and cannabis smoke when suspected", "Pain control and wound care", "Exercise as tolerated and vascular specialist follow-up", "Medications/procedures may support blood flow in selected cases but work less well than cessation", "Amputation for infected, dead, or gangrenous tissue when unavoidable"],
      nursingPriorities: ["Assess distal perfusion, pain, ulcers, infection, skin temperature/color, capillary refill, and tobacco/nicotine use without judgment.", "Teach absolute cessation and connect to non-nicotine cessation support when prescribed.", "Protect extremities from cold, trauma, tight shoes, and burns.", "Escalate spreading infection, gangrene, rest pain, or sudden perfusion worsening."],
      complications: ["Ischemic ulcers", "Gangrene", "Infection", "Severe rest pain", "Amputation", "Functional disability", "Recurrent thrombophlebitis"],
      patientEducation: ["Teach that even one cigarette or ongoing nicotine exposure can worsen disease, inspect fingers/toes daily, keep extremities warm, avoid injury, and report nonhealing sores, black/blue tissue, fever, or worsening rest pain immediately."],
      nclexTraps: ["Buerger disease is thromboangiitis obliterans and is tightly linked to tobacco/nicotine.", "Smoking cessation is the key treatment; one cigarette can matter.", "Do not confuse it with typical older-adult atherosclerotic PAD.", "Protect fingers and toes from cold and injury.", "Gangrene or infected tissue can require amputation."]
    },
    {
      name: "Asthma",
      category: "Respiratory",
      aliases: ["reactive airway disease"],
      treatments: ["Albuterol or another short-acting beta-2 agonist rescue bronchodilator", "Inhaled corticosteroid controller therapy", "Systemic corticosteroids for moderate/severe exacerbation", "Oxygen as needed", "Trigger control"],
      nursingInterventions: ["Assess work of breathing, wheezing, silent chest, ability to speak, oxygen saturation, peak flow when available, and response to albuterol rescue therapy."],
      nclexPearls: ["Albuterol is the classic rescue bronchodilator; inhaled corticosteroids are controller therapy.", "In severe asthma, less wheezing can mean worse airflow, not improvement."]
    },
    {
      name: "DKA",
      category: "Endocrine",
      aliases: ["diabetic ketoacidosis"],
      definition: "Diabetic ketoacidosis is an acute diabetes emergency caused by severe insulin deficiency with hyperglycemia, ketone production, dehydration, and high-anion-gap metabolic acidosis.",
      etiology: "Common triggers include missed insulin, infection, new-onset type 1 diabetes, myocardial infarction, stroke, pregnancy, pancreatitis, steroids, and SGLT2 inhibitors.",
      pathology: "Without enough insulin, cells cannot use glucose effectively. Counterregulatory hormones rise, lipolysis increases, ketones accumulate, bicarbonate falls, the anion gap rises, and osmotic diuresis causes severe fluid and electrolyte loss.",
      signsSymptoms: ["Polyuria and polydipsia", "Dehydration and tachycardia", "Nausea, vomiting, and abdominal pain", "Kussmaul respirations", "Fruity breath", "Weakness", "Altered mental status"],
      diagnostics: ["Glucose often >250 mg/dL, but euglycemic DKA can occur", "pH <7.30", "bicarbonate <18 mEq/L", "positive serum ketones or beta-hydroxybutyrate elevation", "elevated anion gap", "potassium may be normal/high initially despite total-body depletion"],
      labs: ["Glucose high", "Anion gap high", "Bicarbonate low", "pH low", "Beta-hydroxybutyrate high", "Potassium can fall quickly after insulin"],
      treatments: ["Isotonic IV fluids first", "Regular insulin infusion after potassium safety is verified", "Potassium replacement when indicated", "Dextrose-containing fluids when glucose falls but acidosis persists", "Treat the trigger such as infection or missed insulin"],
      nursingInterventions: ["Cardiac monitoring if potassium is abnormal or insulin infusion is running", "Frequent glucose, potassium, anion gap, bicarbonate, neuro, and fluid-status checks", "Strict intake/output", "Assess for infection and precipitating cause"],
      redFlags: ["Potassium <3.3 mEq/L before insulin", "Decreasing level of consciousness", "Shock signs", "Respiratory fatigue", "Persistent vomiting", "Worsening anion gap"],
      nclexPearls: ["Fluids come first unless another immediate airway/circulation emergency exists.", "Insulin moves potassium into cells, so potassium can crash.", "Do not stop insulin just because glucose improves if the anion gap is still open."],
      medicationsCommonlyUsed: ["Regular insulin", "Potassium chloride", "Normal saline", "Dextrose 5% in half-normal saline when ordered"]
    },
    {
      name: "Hyperosmolar hyperglycemic state",
      category: "Endocrine",
      aliases: ["HHS", "hyperosmolar hyperglycemic syndrome", "HONK"],
      definition: "HHS is a severe hyperglycemic emergency with profound dehydration and hyperosmolality, usually without significant ketoacidosis.",
      etiology: "Common triggers include infection, missed diabetes medications, stroke, MI, steroids, thiazides, dehydration, and limited access to fluids.",
      pathology: "Some insulin is present, so ketone production is limited, but glucose becomes extremely high. Osmotic diuresis causes profound water loss, hypernatremia risk, high serum osmolality, and neurologic changes.",
      signsSymptoms: ["Extreme thirst", "Polyuria early then possible oliguria", "Dry mucous membranes", "Weakness", "Confusion", "Seizure or coma in severe cases"],
      diagnostics: ["Glucose often >600 mg/dL", "Serum osmolality often >320 mOsm/kg", "Minimal ketones", "pH usually >7.30", "Bicarbonate usually >18 mEq/L"],
      labs: ["Glucose very high", "Serum osmolality high", "BUN/creatinine may rise from dehydration", "Ketones absent or mild"],
      treatments: ["Aggressive IV fluids", "Electrolyte correction", "Insulin after initial fluids and potassium assessment", "Treat precipitating cause"],
      nursingInterventions: ["Frequent neuro checks", "Strict intake/output", "Monitor sodium/osmolality correction carefully", "Fall/aspiration precautions"],
      redFlags: ["Altered mental status", "Shock", "Seizure", "Low urine output"],
      nclexPearls: ["HHS is more about severe dehydration and hyperosmolality than ketones.", "Older adults are high risk."]
    },
    {
      name: "Gout",
      category: "Musculoskeletal",
      aliases: ["gouty arthritis", "podagra"],
      definition: "Gout is inflammatory arthritis caused by monosodium urate crystal deposition in joints or soft tissues.",
      etiology: "Risk rises with hyperuricemia, chronic kidney disease, diuretics, alcohol, high-purine intake, obesity, dehydration, and rapid cell turnover.",
      pathology: "Urate crystals trigger intense neutrophil-driven inflammation. The classic presentation is sudden severe pain, redness, heat, and swelling, often in the first metatarsophalangeal joint.",
      signsSymptoms: ["Sudden severe joint pain", "Red hot swollen joint", "Podagra", "Limited range of motion", "Tophi in chronic disease"],
      diagnostics: ["Joint aspiration showing negatively birefringent monosodium urate crystals is definitive", "Uric acid can be high but may be normal during an acute flare", "Assess fever or infection risk if septic arthritis is possible"],
      labs: ["Uric acid may be high", "WBC/CRP/ESR can rise during inflammation"],
      treatments: ["NSAIDs for acute flare when safe", "Colchicine for acute flare when ordered", "Corticosteroids when NSAIDs/colchicine are not appropriate", "Allopurinol or febuxostat for long-term urate lowering", "Hydration and trigger reduction"],
      nursingInterventions: ["Assess kidney function before NSAIDs/colchicine", "Monitor pain and mobility", "Teach that long-term urate-lowering therapy is prevention, not instant flare relief"],
      redFlags: ["Fever, immunosuppression, prosthetic joint, or severe systemic illness requires evaluation for septic arthritis"],
      nclexPearls: ["Do not assume every red swollen joint is gout.", "Allopurinol can trigger flares when initiated; prophylaxis may be ordered."]
    },
    {
      name: "Hyperuricemia",
      category: "Renal / metabolic",
      aliases: ["high uric acid", "elevated uric acid"],
      definition: "Hyperuricemia means uric acid is elevated above the expected range because production is high, excretion is reduced, or both.",
      etiology: "Common contributors include CKD, diuretics, dehydration, tumor lysis, high cell turnover, alcohol, and purine-heavy diet.",
      pathology: "Excess urate can crystallize in joints causing gout or in the urinary tract causing uric-acid nephrolithiasis.",
      signsSymptoms: ["Often asymptomatic", "Gout flares", "Kidney stones", "Flank pain or hematuria if stones occur"],
      diagnostics: ["Serum uric acid", "Renal function", "Urinalysis", "Stone workup if nephrolithiasis symptoms occur"],
      labs: ["Uric acid high", "Creatinine/eGFR may be abnormal if renal impairment contributes"],
      treatments: ["Treat underlying cause", "Hydration when appropriate", "Urate-lowering therapy such as allopurinol when indicated", "Rasburicase may be used for selected tumor lysis risk"],
      nursingInterventions: ["Assess gout symptoms, renal function, hydration, and medication causes.", "Teach not to stop or start urate therapy without prescriber guidance."],
      redFlags: ["Cancer therapy with high uric acid, rising potassium/phosphorus, low calcium, or AKI suggests tumor lysis syndrome."],
      nclexPearls: ["Uric acid is both a gout clue and a tumor-lysis clue depending context."]
    },
    {
      name: "Lactic acidosis",
      category: "Acid-base / shock",
      aliases: ["high lactate", "elevated lactate"],
      definition: "Lactic acidosis is metabolic acidosis caused by lactate accumulation, usually from impaired tissue oxygen delivery, impaired lactate clearance, or mitochondrial/toxin effects.",
      etiology: "Common causes include sepsis, shock, severe hypoxia, seizures, ischemia, severe anemia, liver failure, and medication/toxin effects such as metformin in renal failure or hypoxic states.",
      pathology: "When tissue perfusion or oxygen use is inadequate, anaerobic metabolism increases lactate. Bicarbonate falls and anion gap rises.",
      signsSymptoms: ["Tachypnea", "Weakness", "Confusion", "Hypotension or poor perfusion signs", "Cool clammy skin or mottling in shock"],
      diagnostics: ["Lactate elevated", "Low bicarbonate", "Low pH", "High anion gap", "Assess source of hypoperfusion or toxin exposure"],
      labs: ["Lactate >=2 mmol/L abnormal in many sepsis pathways", "Lactate >=4 mmol/L high risk", "Anion gap high", "Bicarbonate low"],
      treatments: ["Restore perfusion and oxygen delivery", "Treat sepsis or shock source", "Fluids, oxygen, vasopressors, antibiotics, or source control as ordered", "Stop contributing medication/toxin when ordered"],
      nursingInterventions: ["Trend lactate and perfusion response", "Monitor MAP, urine output, mental status, skin, oxygenation, and respiratory effort"],
      redFlags: ["Rising lactate despite treatment", "Hypotension", "Altered mental status", "Low urine output"],
      nclexPearls: ["Lactate is a perfusion warning. Do not wait for blood pressure to fall before escalating a septic client."]
    },
    {
      name: "Acute kidney injury",
      category: "Renal",
      aliases: ["AKI", "acute renal failure"],
      definition: "Acute kidney injury is an abrupt decline in kidney filtration, shown by rising creatinine, falling urine output, or both.",
      etiology: "Prerenal causes include dehydration, shock, heart failure, and low perfusion. Intrinsic causes include acute tubular necrosis, nephrotoxins, glomerulonephritis, and sepsis. Postrenal causes include obstruction.",
      pathology: "Reduced filtration impairs fluid, electrolyte, acid-base, and waste removal. Potassium, acid, and fluid can accumulate quickly.",
      signsSymptoms: ["Low urine output", "Edema", "Fatigue", "Confusion if uremic", "Shortness of breath with fluid overload", "Nausea"],
      diagnostics: ["Creatinine rising", "BUN rising", "eGFR falling", "Urinalysis", "Electrolytes", "Renal ultrasound when obstruction is possible"],
      labs: ["Creatinine high", "BUN high", "Potassium may be high", "Bicarbonate may be low", "Phosphorus may be high", "Urine output low"],
      treatments: ["Treat the cause", "Optimize perfusion and volume status", "Stop or adjust nephrotoxins", "Manage potassium/acidosis/fluid overload", "Dialysis for refractory life-threatening complications"],
      nursingInterventions: ["Strict intake/output", "Daily weights", "Monitor potassium and ECG changes", "Review medications for renal dosing", "Assess volume status"],
      redFlags: ["Hyperkalemia with ECG changes", "Pulmonary edema", "Severe acidosis", "Uremic symptoms", "Anuria"],
      nclexPearls: ["Check catheter obstruction before assuming kidneys stopped making urine.", "Low urine output is an early bedside clue."]
    },
    {
      name: "Chronic kidney disease",
      category: "Renal",
      aliases: ["CKD", "chronic renal disease"],
      definition: "Chronic kidney disease is persistent kidney damage or reduced kidney function, commonly staged by eGFR and albuminuria.",
      etiology: "Common causes include diabetes, hypertension, glomerular disease, polycystic kidney disease, recurrent obstruction, autoimmune disease, and nephrotoxic exposure.",
      pathology: "Nephron loss causes reduced filtration, sodium/water retention, hypertension, anemia from low erythropoietin, mineral-bone disorder, acidosis, and uremic toxin accumulation.",
      signsSymptoms: ["Often silent early", "Hypertension", "Edema", "Fatigue", "Anemia", "Pruritus", "Nausea", "Uremic symptoms in advanced stages"],
      diagnostics: ["eGFR staging", "Urine albumin/creatinine ratio", "Creatinine trend", "Electrolytes", "Bicarbonate", "Hemoglobin", "Calcium/phosphorus/PTH patterns"],
      labs: ["eGFR down", "Creatinine up", "BUN up", "Potassium may rise", "Phosphorus up", "Calcium may fall", "Hemoglobin/Hematocrit down", "Bicarbonate may fall"],
      stages: ["G1: eGFR >=90 with kidney damage marker", "G2: eGFR 60-89 with kidney damage marker", "G3a: eGFR 45-59", "G3b: eGFR 30-44", "G4: eGFR 15-29", "G5: eGFR <15 or kidney failure"],
      treatments: ["Blood pressure control", "Diabetes control", "ACE inhibitor/ARB when appropriate for albuminuria", "Diuretics for volume as ordered", "Phosphate binders", "Vitamin D/calcitriol when ordered", "Erythropoiesis-stimulating agents and iron when indicated", "Dialysis or transplant planning in advanced disease"],
      nursingInterventions: ["Monitor fluid status, weight, edema, lung sounds, blood pressure, electrolytes, anemia, and medication renal dosing."],
      redFlags: ["Hyperkalemia", "Pulmonary edema", "Uremic pericarditis", "Severe acidosis", "Mental status change"],
      nclexPearls: ["CKD stage is not just creatinine. eGFR and albuminuria matter.", "Anemia in CKD is commonly related to low erythropoietin."]
    },
    {
      name: "Sepsis",
      category: "Infectious / critical care",
      aliases: ["severe infection"],
      definition: "Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection.",
      etiology: "Common sources include pneumonia, urinary tract infection, abdominal infection, skin/soft tissue infection, line infection, meningitis, and wound infection.",
      pathology: "Inflammation and endothelial dysfunction cause vasodilation, capillary leak, microthrombi, impaired oxygen utilization, and organ hypoperfusion.",
      signsSymptoms: ["Fever or hypothermia", "Tachycardia", "Tachypnea", "Altered mental status", "Hypotension", "Low urine output", "Mottled/cool skin", "Possible high lactate"],
      diagnostics: ["Cultures before antibiotics if this does not delay treatment", "Lactate", "CBC", "CMP", "coagulation studies", "source-specific imaging/tests"],
      labs: ["Lactate may be high", "WBC high or low", "Creatinine may rise", "Platelets may fall", "Bilirubin may rise", "Procalcitonin may support bacterial infection"],
      treatments: ["Rapid antibiotics", "IV fluids", "Source control", "Oxygen support", "Vasopressors if shock persists after fluids as ordered"],
      nursingInterventions: ["Recognize early deterioration", "Obtain cultures/lactate per protocol", "Give antibiotics promptly", "Trend MAP, mental status, urine output, respiratory status, and lactate"],
      redFlags: ["Hypotension", "Lactate elevation", "New confusion", "Low urine output", "Respiratory distress"],
      nclexPearls: ["Older adults may present with confusion or hypothermia instead of fever.", "Do not wait for every lab before acting on unstable sepsis."]
    },
    {
      name: "Septic shock",
      category: "Infectious / critical care",
      aliases: ["shock from sepsis"],
      definition: "Septic shock is sepsis with profound circulatory/metabolic dysfunction and high mortality risk, usually requiring vasopressors after fluids and often associated with elevated lactate.",
      etiology: "Usually follows uncontrolled or severe infection with vasodilation, capillary leak, myocardial depression, and microcirculatory dysfunction.",
      pathology: "Vasodilation lowers systemic vascular resistance, capillary leak reduces effective circulating volume, and cellular oxygen use becomes impaired.",
      signsSymptoms: ["Hypotension", "Tachycardia", "Tachypnea", "Altered mental status", "Low urine output", "Mottled skin", "High lactate"],
      diagnostics: ["Lactate", "cultures", "source evaluation", "organ-function labs", "hemodynamic monitoring"],
      labs: ["Lactate often high", "Creatinine may rise", "Platelets may fall", "Bilirubin may rise", "metabolic acidosis may occur"],
      treatments: ["Broad-spectrum antibiotics", "Crystalloid fluids", "Norepinephrine commonly first-line vasopressor as ordered", "Source control", "Oxygen/ventilatory support as needed"],
      nursingInterventions: ["Frequent MAP and perfusion checks", "Strict intake/output", "Rapid escalation for worsening shock", "Monitor vasopressor IV site/central access per policy"],
      redFlags: ["MAP <65 despite fluids", "Rising lactate", "Worsening mentation", "Anuria", "Respiratory failure"],
      nclexPearls: ["Persistent hypotension after fluids is not a wait-and-see situation."]
    },
    {
      name: "Hypocalcemia",
      category: "Electrolyte disorder",
      aliases: ["low calcium"],
      definition: "Hypocalcemia is low serum or ionized calcium, producing neuromuscular irritability and cardiac conduction risk.",
      etiology: "Causes include hypoparathyroidism, vitamin D deficiency, chronic kidney disease, acute pancreatitis, massive transfusion, sepsis, and hypomagnesemia.",
      pathology: "Low calcium lowers the threshold for nerve and muscle firing, causing tetany and potentially laryngospasm or seizures.",
      signsSymptoms: ["Paresthesias", "Tetany", "Muscle cramps", "Chvostek sign", "Trousseau sign", "Laryngospasm", "Seizures", "Prolonged QT"],
      diagnostics: ["Calcium low", "Ionized calcium low", "Check magnesium, phosphorus, albumin, PTH, vitamin D, renal function"],
      treatments: ["Calcium replacement as ordered", "Treat magnesium deficiency", "Vitamin D/calcitriol when indicated", "Airway support if laryngospasm occurs"],
      nursingInterventions: ["Seizure precautions if severe", "Airway readiness with stridor/laryngospasm", "Cardiac monitoring if symptomatic or severe"],
      redFlags: ["Stridor/laryngospasm", "Seizure", "Prolonged QT", "Post-thyroidectomy tingling/spasm"],
      nclexPearls: ["Low calcium can be an airway problem, not just a lab problem."]
    },
    {
      name: "Hypercalcemia",
      category: "Electrolyte disorder",
      aliases: ["high calcium"],
      definition: "Hypercalcemia is elevated calcium that can impair neuromuscular, renal, GI, and cardiac function.",
      etiology: "Common causes include hyperparathyroidism, malignancy, thiazides, immobilization, and vitamin D excess.",
      pathology: "High calcium depresses neuromuscular excitability, contributes to dehydration/polyuria, kidney stones, constipation, and dysrhythmia risk.",
      signsSymptoms: ["Weakness", "Fatigue", "Constipation", "Nausea", "Polyuria", "Kidney stones", "Confusion", "Shortened QT"],
      diagnostics: ["Calcium high", "Ionized calcium if needed", "PTH", "renal function", "ECG if severe"],
      treatments: ["IV fluids when appropriate", "Loop diuretic only after rehydration if ordered", "Calcitonin", "Bisphosphonates", "Treat cause"],
      nursingInterventions: ["Hydration monitoring", "Fall precautions", "Cardiac monitoring when severe", "Assess kidney stone symptoms"],
      redFlags: ["Confusion", "dehydration", "dysrhythmia", "severe weakness"],
      nclexPearls: ["Fluids are often the first move for significant hypercalcemia unless contraindicated."]
    },
    {
      name: "Hypokalemia",
      category: "Electrolyte disorder",
      aliases: ["low potassium"],
      definition: "Hypokalemia is low serum potassium that can cause muscle weakness and dangerous cardiac dysrhythmias.",
      etiology: "Common causes include loop/thiazide diuretics, GI losses, insulin therapy, alkalosis, poor intake, and hyperaldosteronism.",
      pathology: "Low potassium disrupts cardiac repolarization and skeletal/smooth muscle function.",
      signsSymptoms: ["Weakness", "Cramps", "Constipation", "Ileus", "Palpitations", "Flattened T waves or U waves"],
      diagnostics: ["Potassium low", "ECG changes", "Check magnesium because low magnesium can worsen refractory hypokalemia"],
      treatments: ["Potassium replacement oral or IV as ordered", "Treat cause", "Correct magnesium if low"],
      nursingInterventions: ["Never IV push potassium", "Cardiac monitoring for IV replacement or severe hypokalemia", "Assess renal function and urine output"],
      redFlags: ["Dysrhythmia", "severe weakness", "digoxin use with low potassium"],
      nclexPearls: ["Low potassium increases digoxin toxicity risk."]
    },
    {
      name: "Hyperkalemia",
      category: "Electrolyte disorder",
      aliases: ["high potassium"],
      definition: "Hyperkalemia is elevated potassium that can rapidly cause fatal cardiac conduction problems.",
      etiology: "Causes include kidney failure, ACE inhibitors/ARBs, potassium-sparing diuretics, acidosis, cell breakdown, adrenal insufficiency, and hemolyzed specimens.",
      pathology: "High extracellular potassium alters myocardial conduction and can progress to ventricular dysrhythmia or asystole.",
      signsSymptoms: ["Weakness", "Paresthesias", "Palpitations", "Peaked T waves", "Widened QRS", "Bradycardia"],
      diagnostics: ["Potassium high", "ECG", "Renal function", "Medication review", "Repeat if hemolysis suspected and client stable"],
      treatments: ["Calcium gluconate or chloride stabilizes myocardium as ordered", "Insulin with dextrose shifts potassium into cells", "Albuterol and sodium bicarbonate may be used in selected cases", "Potassium binders or dialysis remove potassium"],
      nursingInterventions: ["Cardiac monitoring", "Hold potassium supplements and clarify potassium-raising drugs", "Assess renal function and urine output"],
      redFlags: ["ECG changes", "K >=6.0 mEq/L with symptoms", "weakness/paralysis", "renal failure"],
      nclexPearls: ["Calcium does not lower potassium. It buys cardiac safety time."]
    },
    {
      name: "Hyponatremia",
      category: "Electrolyte disorder",
      aliases: ["low sodium"],
      definition: "Hyponatremia is low sodium concentration, usually reflecting excess water relative to sodium.",
      etiology: "Causes include SIADH, diuretics, adrenal insufficiency, heart failure, cirrhosis, vomiting/diarrhea with free-water replacement, and excess hypotonic fluid.",
      pathology: "Low extracellular osmolality moves water into brain cells and can cause cerebral edema.",
      signsSymptoms: ["Headache", "Nausea", "Confusion", "Lethargy", "Seizures", "Coma"],
      diagnostics: ["Sodium low", "Serum osmolality", "Urine osmolality", "Urine sodium", "Assess volume status"],
      treatments: ["Fluid restriction for many SIADH patterns", "Hypertonic saline for severe symptomatic cases as ordered", "Treat cause", "Seizure precautions"],
      nursingInterventions: ["Neuro checks", "Seizure precautions", "Monitor correction rate carefully"],
      redFlags: ["Seizure", "severe confusion", "rapid onset", "very low sodium"],
      nclexPearls: ["Correcting too fast can cause osmotic demyelination."]
    },
    {
      name: "Hypernatremia",
      category: "Electrolyte disorder",
      aliases: ["high sodium"],
      definition: "Hypernatremia is high sodium concentration, usually reflecting water deficit.",
      etiology: "Causes include dehydration, diabetes insipidus, osmotic diuresis, impaired thirst, fever, and excessive sodium administration.",
      pathology: "High extracellular osmolality pulls water out of brain cells, causing neurologic symptoms.",
      signsSymptoms: ["Thirst", "Dry mucous membranes", "Restlessness", "Confusion", "Weakness", "Seizures in severe cases"],
      diagnostics: ["Sodium high", "Serum osmolality high", "Urine specific gravity/osmolality help distinguish dehydration from diabetes insipidus"],
      treatments: ["Careful free-water replacement", "Treat diabetes insipidus if present", "Monitor correction rate"],
      nursingInterventions: ["Assess mental status, intake/output, daily weight, and access to water."],
      redFlags: ["Seizure", "coma", "rapid sodium shift", "severe dehydration"],
      nclexPearls: ["Correct hypernatremia carefully to avoid cerebral edema."]
    },
    {
      name: "Acute pancreatitis",
      category: "GI / pancreatic",
      aliases: ["pancreatitis"],
      definition: "Acute pancreatitis is sudden pancreatic inflammation, often caused by gallstones or alcohol use, that can become systemic and life-threatening.",
      etiology: "Common causes include gallstones, alcohol use, hypertriglyceridemia, ERCP, medications, trauma, and hypercalcemia.",
      pathology: "Premature pancreatic enzyme activation injures pancreatic tissue and can trigger third spacing, hypovolemia, hypocalcemia, respiratory compromise, and shock.",
      signsSymptoms: ["Severe epigastric pain radiating to back", "Nausea/vomiting", "Fever", "Tachycardia", "Abdominal tenderness", "Possible Grey Turner/Cullen signs in severe hemorrhagic cases"],
      diagnostics: ["Lipase elevated", "Amylase may rise", "LFTs/bilirubin if gallstone cause", "Triglycerides", "Calcium", "Imaging when indicated"],
      labs: ["Lipase high", "Calcium may be low in severe disease", "Glucose may be high", "WBC may rise", "BUN/hematocrit can suggest dehydration/hemoconcentration"],
      treatments: ["Aggressive IV fluids early when appropriate", "Pain control", "Antiemetics", "Bowel rest/nutrition plan", "Treat gallstone/alcohol/triglyceride cause"],
      nursingInterventions: ["Monitor pain, respiratory status, glucose, calcium, fluid balance, and shock signs."],
      nursingPriorities: ["Monitor pain, respiratory status, oxygenation, glucose, calcium, fluid balance, urine output, and shock signs.", "Watch for systemic inflammatory response and organ failure involving lungs, kidneys, or circulation.", "Trend lipase with the clinical picture, but prioritize hydration/perfusion, worsening hypoxia, hypotension, and mental status changes."],
      redFlags: ["Hypotension", "hypoxia", "low calcium with tetany", "confusion", "worsening renal function", "organ failure"],
      nclexPearls: ["Pancreatitis is not only pain. Watch fluids, calcium, glucose, respiratory status, and shock."],
      nclexTraps: ["Lipase is usually more specific than amylase for acute pancreatitis.", "Severe pancreatitis can become a systemic organ failure problem, not just abdominal pain.", "Hypocalcemia, hypoxia, hypotension, confusion, or worsening renal function are escalation cues.", "Early IV fluids matter, but keep reassessing for overload or shock."]
    },
    {
      name: "HELLP syndrome",
      category: "Maternal / pregnancy",
      aliases: ["HELLP"],
      definition: "HELLP syndrome is a life-threatening pregnancy complication involving hemolysis, elevated liver enzymes, and low platelets. It is commonly considered a severe preeclampsia-spectrum disorder.",
      etiology: "It usually occurs in the third trimester or postpartum and is linked to abnormal placental/endothelial disease.",
      pathology: "Endothelial injury and microangiopathy cause red-cell destruction, liver injury, and platelet consumption.",
      signsSymptoms: ["RUQ or epigastric pain", "Nausea/vomiting", "Headache", "Malaise", "Hypertension may be present", "Visual changes may occur"],
      diagnostics: ["Platelets low, often <100,000/mm3 in severe disease", "AST/ALT elevated", "LDH elevated", "Hemolysis evidence", "Proteinuria may or may not be present"],
      labs: ["Platelets down", "AST/ALT up", "LDH up", "Bilirubin may rise", "Creatinine may rise if severe"],
      treatments: ["Stabilize mother", "Magnesium sulfate for seizure prophylaxis when ordered", "Antihypertensives for severe-range blood pressure", "Delivery is definitive treatment depending gestational age/severity"],
      nursingInterventions: ["Assess RUQ pain, headache, vision changes, reflexes, clonus, bleeding, fetal status, and magnesium toxicity signs."],
      redFlags: ["RUQ pain", "platelets <100,000/mm3", "elevated LFTs", "severe BP", "headache/vision changes", "bleeding"],
      nclexPearls: ["HELLP means Hemolysis, Elevated Liver enzymes, Low Platelets. Liver damage must be front-and-center."]
    },
    {
      name: "Preeclampsia",
      category: "Maternal / pregnancy",
      aliases: ["pre-eclampsia"],
      definition: "Preeclampsia is new-onset hypertension after 20 weeks gestation with proteinuria or end-organ dysfunction.",
      etiology: "Abnormal placental vascular development and endothelial dysfunction drive maternal vasospasm, capillary leak, and organ injury.",
      pathology: "Endothelial injury causes hypertension, kidney involvement/proteinuria, liver irritation, cerebral symptoms, platelet consumption, and fetal growth concerns.",
      signsSymptoms: ["Hypertension", "Headache", "Visual changes", "RUQ/epigastric pain", "Edema", "Hyperreflexia or clonus", "Shortness of breath if pulmonary edema"],
      diagnostics: ["BP elevation", "Proteinuria or protein/creatinine ratio >=0.3", "Platelets <100,000/mm3", "Creatinine >1.1 mg/dL or doubled", "AST/ALT elevated", "Pulmonary edema", "Cerebral/visual symptoms"],
      labs: ["Platelets down if severe", "AST/ALT up", "Creatinine up", "Proteinuria may be present"],
      treatments: ["Magnesium sulfate for seizure prophylaxis when indicated", "Antihypertensives for severe-range BP", "Fetal/maternal monitoring", "Delivery when indicated"],
      nursingInterventions: ["Seizure precautions", "Monitor BP, reflexes, clonus, urine output, lung sounds, headache, vision, RUQ pain, and fetal status"],
      redFlags: ["Severe-range BP", "headache", "vision changes", "RUQ pain", "clonus", "low platelets", "elevated LFTs", "low urine output"],
      nclexPearls: ["Magnesium prevents seizures; antihypertensives lower severe BP."]
    },
    {
      name: "Fractures",
      category: "Musculoskeletal",
      aliases: ["fracture", "broken bone"],
      definition: "A fracture is a break in bone continuity that can threaten alignment, mobility, pain control, bleeding, infection risk, and neurovascular function.",
      etiology: "Causes include trauma, falls, osteoporosis, stress injury, malignancy/pathologic bone weakness, and child/elder abuse.",
      pathology: "Bone disruption causes bleeding, inflammation, pain, swelling, and possible injury to nerves/vessels or surrounding tissue.",
      signsSymptoms: ["Pain", "Swelling", "Deformity", "Bruising", "Crepitus", "Loss of function", "Shortening or external rotation in hip fracture"],
      diagnostics: ["X-ray", "CT/MRI for complex or occult fractures", "Neurovascular assessment distal to injury"],
      treatments: ["Immobilization", "Reduction", "Casting/splinting", "Surgery/fixation when indicated", "Pain control", "Open fracture antibiotics/tetanus/surgical washout"],
      nursingInterventions: ["Neurovascular checks: pain, pulses, pallor, paresthesia, paralysis, poikilothermia", "Elevate/ice as ordered", "Teach cast care", "Prevent DVT and immobility complications"],
      redFlags: ["Pain out of proportion", "paresthesia", "pulselessness", "increasing tightness under cast", "open fracture"],
      nclexPearls: ["Compartment syndrome is the do-not-miss fracture complication."]
    },
    {
      name: "Osteoarthritis",
      category: "Musculoskeletal",
      aliases: ["OA", "degenerative joint disease"],
      definition: "Osteoarthritis is degenerative joint disease with cartilage breakdown, osteophytes, pain, stiffness, and reduced function.",
      etiology: "Risk factors include age, obesity, prior joint injury, repetitive stress, genetics, and malalignment.",
      pathology: "Cartilage loss and subchondral bone changes create mechanical pain and limited motion. Inflammation is usually less systemic than rheumatoid arthritis.",
      signsSymptoms: ["Joint pain worse with use", "Brief morning stiffness usually less than 30 minutes", "Crepitus", "Bony enlargement", "Reduced range of motion"],
      diagnostics: ["Clinical pattern", "X-ray may show joint-space narrowing and osteophytes"],
      treatments: ["Exercise/physical therapy", "Weight reduction if appropriate", "Acetaminophen or NSAIDs when safe", "Topical NSAIDs", "Intra-articular injections", "Joint replacement for severe disease"],
      nursingInterventions: ["Promote low-impact exercise", "Heat/cold strategies", "Fall prevention", "Medication safety teaching"],
      redFlags: ["Hot swollen feverish joint suggests infection or inflammatory arthritis, not routine OA."],
      nclexPearls: ["OA gets worse with use. RA has longer inflammatory morning stiffness and systemic autoimmune pattern."]
    },
    {
      name: "Osteoporosis",
      category: "Musculoskeletal",
      aliases: ["low bone density"],
      definition: "Osteoporosis is reduced bone mass and microarchitectural deterioration that increases fracture risk.",
      etiology: "Risk factors include aging, postmenopause, low calcium/vitamin D, immobility, low body weight, smoking, alcohol, corticosteroids, and endocrine disorders.",
      pathology: "Bone resorption exceeds formation, causing fragile bones that fracture easily, especially hip, spine, and wrist.",
      signsSymptoms: ["Often silent", "Fragility fracture", "Loss of height", "Kyphosis", "Back pain from vertebral compression fracture"],
      diagnostics: ["DEXA scan", "fracture history", "calcium/vitamin D and secondary-cause labs as indicated"],
      treatments: ["Weight-bearing exercise", "Calcium/vitamin D optimization", "Bisphosphonates such as alendronate", "Denosumab or other agents when indicated", "Fall prevention"],
      nursingInterventions: ["Teach bisphosphonate administration: take with water, stay upright, empty stomach per directions.", "Assess fall risks and home safety."],
      redFlags: ["Hip fracture symptoms after a fall", "new severe back pain with neurologic symptoms"],
      nclexPearls: ["Preventing falls is treatment, not just safety decoration."]
    },
    {
      name: "Rheumatoid arthritis",
      category: "Musculoskeletal / autoimmune",
      aliases: ["RA"],
      definition: "Rheumatoid arthritis is a chronic systemic autoimmune inflammatory arthritis that can destroy joints and affect extra-articular organs.",
      etiology: "Autoimmune synovial inflammation is associated with genetic risk, smoking, and immune dysregulation.",
      pathology: "Inflamed synovium forms pannus that damages cartilage and bone, causing symmetric inflammatory joint disease.",
      signsSymptoms: ["Symmetric small-joint pain/swelling", "Morning stiffness often more than 1 hour", "Fatigue", "Warm tender joints", "Possible nodules or extra-articular lung/eye involvement"],
      diagnostics: ["Clinical pattern", "RF", "anti-CCP", "ESR/CRP", "x-ray/ultrasound for erosions"],
      treatments: ["DMARDs such as methotrexate", "NSAIDs or corticosteroids for symptom control when ordered", "Biologics such as TNF inhibitors or rituximab when indicated"],
      nursingInterventions: ["Monitor CBC/LFTs for methotrexate", "Screen infection risk with biologics", "Teach joint protection and energy conservation"],
      redFlags: ["Fever or infection signs on immunosuppressants", "new shortness of breath", "severe medication toxicity symptoms"],
      nclexPearls: ["Methotrexate is disease-modifying and requires lab/pregnancy safety attention."]
    },
    {
      name: "Iron deficiency anemia",
      category: "Hematology",
      aliases: ["IDA", "microcytic anemia"],
      definition: "Iron deficiency anemia is anemia caused by inadequate iron for hemoglobin production, usually producing microcytic, hypochromic red cells.",
      etiology: "Common causes include chronic blood loss, heavy menses, GI bleeding, pregnancy demand, poor intake, and malabsorption.",
      pathology: "Low iron reduces hemoglobin synthesis, decreasing oxygen-carrying capacity.",
      signsSymptoms: ["Fatigue", "Pallor", "Dyspnea on exertion", "Tachycardia", "Pica", "Brittle nails", "Glossitis"],
      diagnostics: ["Hemoglobin low", "Hematocrit low", "MCV low", "Ferritin low", "TIBC high", "Transferrin saturation low"],
      labs: ["MCV low", "Ferritin low", "TIBC high", "Serum iron low"],
      treatments: ["Oral iron such as ferrous sulfate", "IV iron when indicated", "Treat bleeding source"],
      nursingInterventions: ["Teach iron with vitamin C if tolerated and away from calcium/antacids when possible.", "Warn dark stools and constipation can occur."],
      redFlags: ["Chest pain, syncope, active bleeding, severe dyspnea, pregnancy symptoms"],
      nclexPearls: ["In adults, always think: why is iron low? Chronic blood loss must be considered."]
    },
    {
      name: "Aplastic anemia",
      category: "Hematology",
      aliases: ["bone marrow failure anemia"],
      definition: "Aplastic anemia is bone marrow failure causing pancytopenia: low red cells, white cells, and platelets.",
      etiology: "Causes include autoimmune marrow failure, chemotherapy/radiation, benzene, some medications, viral hepatitis, EBV, HIV, and inherited marrow-failure syndromes.",
      pathology: "The marrow becomes hypocellular and cannot produce enough blood cells, causing anemia, infection risk, and bleeding risk.",
      signsSymptoms: ["Fatigue and pallor", "Frequent infections", "Fever with neutropenia", "Petechiae/purpura", "Bleeding gums", "Shortness of breath"],
      diagnostics: ["CBC with pancytopenia", "Reticulocyte count low", "Bone marrow biopsy hypocellular", "Evaluate medication/toxin/infection causes"],
      labs: ["Hemoglobin low", "WBC/ANC low", "Platelets low", "Reticulocytes low"],
      treatments: ["Remove offending cause", "Transfusion support", "Infection treatment/prevention", "Immunosuppressive therapy", "Stem cell transplant in selected clients"],
      nursingInterventions: ["Bleeding precautions", "Neutropenic precautions", "Prompt fever reporting", "Energy conservation"],
      redFlags: ["Fever with neutropenia", "active bleeding", "severe shortness of breath"],
      nclexPearls: ["Aplastic anemia is not just low hemoglobin. The danger is pancytopenia."]
    },
    {
      name: "Disseminated intravascular coagulation",
      category: "Hematology / critical care",
      aliases: ["DIC"],
      definition: "DIC is uncontrolled systemic clotting activation followed by consumption of platelets and clotting factors, causing both microthrombi and bleeding.",
      etiology: "Triggers include sepsis, trauma, obstetric complications, malignancy, transfusion reaction, and severe shock.",
      pathology: "Widespread coagulation forms microvascular clots, consumes platelets/fibrinogen/factors, and activates fibrinolysis.",
      signsSymptoms: ["Oozing from IV sites", "Petechiae", "Ecchymosis", "Bleeding", "Organ dysfunction", "Shock signs"],
      diagnostics: ["Platelets low", "PT/aPTT prolonged", "D-dimer high", "Fibrinogen low", "Schistocytes may be seen"],
      labs: ["Platelets down", "PT/INR up", "aPTT up", "D-dimer up", "Fibrinogen down"],
      treatments: ["Treat underlying trigger", "Blood products such as platelets, FFP, cryoprecipitate as ordered", "Support perfusion and oxygenation"],
      nursingInterventions: ["Bleeding precautions", "Minimize invasive sticks", "Trend labs and hemodynamics", "Assess organ perfusion"],
      redFlags: ["Bleeding plus clotting/organ dysfunction", "postpartum hemorrhage with abnormal coagulation", "sepsis with falling platelets"],
      nclexPearls: ["DIC is both clotting and bleeding. The underlying cause must be treated."]
    },
    {
      name: "Endometriosis",
      category: "Reproductive / gynecology",
      aliases: ["endo", "endometriosis implants", "endometriosis lesions", "endometrioma", "chocolate cyst"],
      definition: "Endometriosis is a chronic estrogen-sensitive condition in which tissue similar to the uterine lining grows outside the uterus, commonly on ovaries, fallopian tubes, pelvic support tissues, bowel, or bladder.",
      etiology: "The exact cause is unknown. Risk is higher with family history, early menarche, short menstrual cycles, heavy or prolonged menses, nulliparity, and menstrual outflow, immune, or hormonal factors.",
      pathology: "Ectopic endometrial-like implants respond to hormonal cycling, causing inflammation, bleeding, scarring, adhesions, ovarian endometriomas, pelvic pain, and infertility. Lesion burden does not always match pain severity.",
      pathophysiology: "Cyclic inflammation and fibrosis irritate pelvic nerves and organs; adhesions can distort anatomy and impair fertility. Bowel, bladder, or rarely thoracic involvement can create symptom patterns tied to menses.",
      riskFactors: ["First-degree relative with endometriosis", "Menarche before age 11", "Short menstrual cycles", "Heavy or prolonged menstrual bleeding", "Never pregnant", "Infertility history", "Delayed diagnosis of cyclic pelvic pain"],
      signsSymptoms: ["Dysmenorrhea that may worsen over time", "Chronic pelvic pain", "Deep dyspareunia", "Pain with bowel movements or urination, often cyclic", "Heavy menses", "Spotting or bleeding between periods", "GI symptoms or bloating", "Fatigue", "Infertility"],
      diagnostics: ["History focused on cyclic pain, bleeding, bowel/bladder symptoms, dyspareunia, infertility, and impact on activities", "Pelvic exam may show tenderness, nodularity, fixed uterus, or adnexal mass", "Pelvic ultrasound for endometrioma or alternate causes", "MRI for deep infiltrating disease or surgical planning when ordered", "Laparoscopy with visualization and sometimes biopsy can confirm diagnosis"],
      labs: ["No blood test rules out endometriosis", "Pregnancy test when pelvic pain or bleeding could be pregnancy-related", "CBC if heavy bleeding or anemia symptoms", "STI testing, urinalysis, or inflammatory testing as clinically indicated to exclude mimics"],
      treatments: ["NSAIDs for pain when safe", "Hormonal suppression such as combined hormonal contraceptives, progestins, or levonorgestrel IUD when appropriate", "GnRH agonists or antagonists with add-back therapy when ordered", "Laparoscopic excision or ablation for selected pain, endometrioma, or infertility cases", "Fertility referral and assisted reproductive options such as IVF when indicated"],
      nursingPriorities: ["Validate severe menstrual or pelvic pain; do not normalize pain that limits work, school, sex, bowel/bladder function, or fertility.", "Assess pregnancy possibility, ectopic-pregnancy red flags, infection symptoms, severe acute abdomen, heavy bleeding, anemia, and mental-health impact.", "Teach medication safety, heat/activity strategies, follow-up with gynecology, and keeping a symptom/bleeding diary."],
      nursingInterventions: ["Encourage timely evaluation for worsening pain, infertility, bowel/bladder symptoms, dyspareunia, or pain unrelieved by first-line measures.", "Monitor for adverse effects of NSAIDs and hormonal therapies.", "Provide perioperative teaching for laparoscopy if planned."],
      complications: ["Infertility or subfertility", "Chronic pain", "Adhesions", "Ovarian endometrioma", "Bowel or bladder involvement", "Pain-related depression/anxiety", "Recurrence after treatment"],
      redFlags: ["Positive pregnancy test with pelvic pain or bleeding", "Syncope", "Shoulder pain", "Fever", "Purulent discharge", "Severe sudden pelvic pain", "Peritoneal signs", "Heavy bleeding with dizziness", "New neurologic or urinary obstruction symptoms"],
      patientEducation: ["Seek urgent care for pregnancy with pain or bleeding, fainting, fever, severe sudden pain, or heavy bleeding.", "Endometriosis has no simple cure, but symptoms and fertility goals can often be managed.", "Track pain timing, bleeding, bowel/bladder symptoms, sex-related pain, and medication response."],
      nclexTraps: ["Do not dismiss worsening dysmenorrhea as normal menstruation.", "Endometriosis is a chronic inflammatory pelvic disease that can affect fertility; pain severity does not reliably equal disease extent.", "A negative ultrasound does not fully exclude endometriosis, especially superficial disease.", "Rule out ectopic pregnancy, PID, torsion, appendicitis, and acute abdomen when symptoms are acute or unstable."],
      sourceKeys: ["medlineplus-endometriosis"]
    },
    {
      name: "Henoch-Schonlein purpura",
      category: "Immune / vasculitis / pediatric",
      aliases: ["IgA vasculitis", "HSP", "anaphylactoid purpura", "IgA-mediated small vessel vasculitis", "Henoch-Schonlein purpura"],
      definition: "Henoch-Schonlein purpura, now commonly called IgA vasculitis, is a small-vessel vasculitis caused by IgA immune-complex deposition that most often affects skin, joints, GI tract, and kidneys.",
      etiology: "Often follows an upper respiratory or other infection, especially in children, but can also follow medications, vaccines, or other immune triggers. Many cases have no single proven trigger.",
      pathology: "IgA-containing immune complexes inflame small blood vessels. This produces palpable purpura, joint pain/swelling, abdominal pain or GI bleeding, and kidney inflammation with hematuria/proteinuria.",
      pathophysiology: "Vessel-wall inflammation increases leakage and bleeding into skin and tissues. Renal involvement ranges from microscopic hematuria to nephritic or nephrotic patterns; GI vasculitis can cause severe pain, bleeding, or intussusception.",
      riskFactors: ["Childhood age group", "Recent respiratory or GI infection", "Male sex slight predominance in some cohorts", "History of IgA vasculitis recurrence", "Family or personal immune/inflammatory pattern"],
      signsSymptoms: ["Palpable purpura, often on legs or buttocks", "Arthralgia or arthritis, especially knees/ankles", "Colicky abdominal pain", "Nausea/vomiting", "GI bleeding or positive stool blood", "Hematuria", "Proteinuria", "Edema", "Scrotal/testicular pain in some children"],
      diagnostics: ["Clinical pattern of palpable purpura plus joint, GI, or renal findings", "Urinalysis for blood and protein", "Blood pressure measurement and renal function testing", "CBC/platelets/coagulation tests to rule out thrombocytopenia or coagulopathy when needed", "Skin or kidney biopsy showing IgA deposition if diagnosis is uncertain or kidney disease is significant", "Abdominal ultrasound if intussusception or severe GI complication is suspected"],
      labs: ["Urinalysis may show hematuria or proteinuria", "Creatinine/eGFR for kidney involvement", "CBC may show normal platelets, helping distinguish from platelet purpura", "ESR/CRP can rise", "Stool occult blood if GI bleeding suspected"],
      treatments: ["Supportive care for many cases with hydration, rest, and pain control", "Acetaminophen or NSAID only if renal function and GI bleeding risk allow and provider approves", "Corticosteroids may be ordered for severe abdominal or joint symptoms", "Nephrology referral for significant proteinuria, hypertension, impaired renal function, or persistent urinary abnormalities", "Treat complications such as intussusception, GI bleeding, or renal disease urgently"],
      nursingPriorities: ["Monitor rash spread, pain, abdominal symptoms, stool blood, urine color/output, urinalysis protein/blood, blood pressure, edema, and renal function.", "Escalate severe abdominal pain, bilious vomiting, GI bleeding, testicular pain, hypertension, oliguria, rising creatinine, or heavy proteinuria.", "Teach families that follow-up urine/BP monitoring matters even if the rash improves."],
      nursingInterventions: ["Use skin comfort measures and avoid trauma to purpuric areas.", "Maintain hydration and monitor intake/output.", "Prepare for ultrasound or specialty referral if GI, renal, or scrotal symptoms appear."],
      complications: ["Kidney involvement or chronic kidney disease", "Hypertension", "Nephrotic or nephritic syndrome", "GI bleeding", "Intussusception", "Bowel ischemia/perforation rarely", "Recurrence"],
      redFlags: ["Severe or worsening abdominal pain", "Bilious vomiting", "Bloody stool", "Scrotal/testicular pain", "Decreased urine output", "Gross hematuria", "Hypertension", "Edema", "Rising creatinine", "Neurologic symptoms"],
      patientEducation: ["Return urgently for severe belly pain, vomiting, bloody stool, testicular pain, swelling, high BP symptoms, decreased urine, or blood in urine.", "Keep follow-up urinalysis and blood pressure checks because kidney involvement can appear after the rash.", "Do not assume a purpuric rash is low priority if platelets, kidney, or GI symptoms are abnormal."],
      nclexTraps: ["Palpable purpura with normal platelets points away from ITP and toward vasculitis patterns.", "The kidney follow-up is the safety anchor; rash improvement does not prove renal risk is gone.", "Severe abdominal pain in IgA vasculitis can be intussusception or GI bleeding, not routine cramping."],
      sourceKeys: ["niddk-iga-vasculitis"]
    },
    {
      name: "Molluscum contagiosum",
      category: "Dermatology / viral infection",
      aliases: ["molluscum", "molluscum contagiosum virus", "MCV skin infection", "water warts"],
      definition: "Molluscum contagiosum is a contagious poxvirus skin infection that causes small, firm, dome-shaped, often umbilicated papules.",
      etiology: "It spreads by direct skin-to-skin contact, autoinoculation from scratching or shaving, contaminated objects such as towels or equipment, and sexual contact when lesions are in the genital area.",
      pathology: "The virus infects epidermal skin cells, producing localized papules that can persist for months. Inflammation or scratching can make lesions red, itchy, crusted, or secondarily infected.",
      pathophysiology: "Healthy immune systems often clear lesions over time without systemic illness. Atopic dermatitis, immunosuppression, or HIV can lead to more numerous, persistent, atypical, or widespread lesions.",
      riskFactors: ["Children", "Atopic dermatitis or eczema", "Skin-to-skin sports/contact", "Shared towels or equipment", "Sexual contact for genital lesions", "Immunocompromised state"],
      signsSymptoms: ["Flesh-colored, white, pink, or pearly papules", "Central dimple or umbilication", "Clusters on face, trunk, extremities, groin, or genital area", "Itching or surrounding dermatitis", "Redness/crusting during inflammation or infection", "Usually no fever or systemic symptoms"],
      diagnostics: ["Clinical skin exam is usually enough", "Dermoscopy or biopsy if atypical, persistent, widespread, or malignancy/other rash is a concern", "Evaluate genital lesions in adults for sexual transmission and STI risk", "Consider immunocompromise evaluation if severe, extensive, or atypical"],
      labs: ["No routine lab test is needed for typical cases", "Culture only if secondary bacterial infection is suspected", "HIV or immune evaluation may be considered for extensive atypical disease"],
      treatments: ["Observation is common because many cases resolve spontaneously", "Cover lesions, avoid scratching, avoid shaving over lesions, and do not share towels or personal items", "Clinician-directed removal or treatment such as cantharidin, cryotherapy, curettage, or topical therapy may be used when lesions spread, irritate, persist, or involve sensitive areas", "Treat secondary bacterial infection if present", "Immunocompromised clients may need specialist management"],
      nursingPriorities: ["Teach transmission control without shaming: cover lesions, hand hygiene, avoid picking, avoid shared towels/equipment, and clean contact surfaces.", "Assess lesion location, number, duration, eczema, immunosuppression, infection signs, and whether lesions are genital or near eyes.", "Escalate extensive, facial/ocular, genital, infected, painful, or immunocompromised presentations."],
      nursingInterventions: ["Use gloves for direct lesion care and reinforce not squeezing or scraping at home.", "Support eczema control to reduce scratching and spread.", "Provide age-appropriate privacy and safeguarding assessment when genital lesions appear in children."],
      complications: ["Autoinoculation and spread", "Secondary bacterial infection", "Eczema flare or molluscum dermatitis", "Scarring from picking or aggressive treatment", "Persistent widespread disease in immunocompromised clients"],
      redFlags: ["Eye involvement", "Large widespread or atypical lesions", "Rapid spread in immunocompromised client", "Fever or cellulitis signs", "Painful genital lesions", "Genital lesions in a child requiring careful abuse/safeguarding evaluation per policy"],
      patientEducation: ["Do not pick, scratch, shave over, or attempt home removal of lesions.", "Keep lesions covered when contact is likely and avoid sharing towels, razors, or sports equipment.", "Seek care for eye-area lesions, infection signs, widespread lesions, immunosuppression, or genital lesions."],
      nclexTraps: ["Molluscum is contagious but usually not a systemic emergency in healthy children.", "Do not squeeze or scrape lesions at home; this spreads infection and scars.", "Genital molluscum changes the assessment: think sexual transmission in adults and safeguarding/context in children."],
      sourceKeys: ["cdc-molluscum-contagiosum"]
    },
    {
      name: "Alpha-gal syndrome",
      category: "Allergy / immunology",
      aliases: ["AGS", "alpha gal allergy", "red meat allergy", "mammalian meat allergy", "tick bite meat allergy", "galactose alpha 1 3 galactose allergy", "cetuximab alpha gal allergy", "delayed meat anaphylaxis"],
      pronunciation: "AL-fuh gal SIN-drohm",
      wordOrigin: "Alpha-gal is shorthand for galactose-alpha-1,3-galactose, a carbohydrate found in most non-primate mammals. Syndrome means a recognizable group of findings that share one mechanism.",
      definition: "Alpha-gal syndrome is an IgE-mediated allergy to the mammalian carbohydrate galactose-alpha-1,3-galactose, usually acquired after sensitization from certain tick bites. Unlike most food allergy, oral mammalian meat or gelatin often causes symptoms 2 to 6 hours later because lipid-associated alpha-gal is absorbed gradually; injected products such as cetuximab can reach the bloodstream immediately and trigger rapid anaphylaxis.",
      etiology: "Certain tick bites expose or induce immune recognition of alpha-gal and shift the person toward alpha-gal-specific IgE production. In the United States the lone star tick is strongly associated, while other tick species are implicated elsewhere. A tick bite does not guarantee disease, and a positive antibody without compatible reactions represents sensitization rather than automatically proving symptomatic alpha-gal syndrome.",
      pathology: "Alpha-gal-specific IgE binds high-affinity Fc-epsilon receptors on mast cells and basophils. When enough alpha-gal-containing antigen enters the circulation, adjacent IgE molecules are cross-linked and the cells release histamine, tryptase, leukotrienes, prostaglandins, and cytokines. Vasodilation and capillary leak produce hives, edema, and hypotension; bronchial and GI smooth-muscle effects produce wheeze, cramping, vomiting, or diarrhea.",
      pathophysiology: "The unusual delay after food reflects antigen delivery rather than a different allergy type: alpha-gal is carried in glycolipids and glycoproteins that are processed, packaged into lipoprotein particles, and transported through lymph before substantial bloodstream exposure. Route and dose therefore matter. IV cetuximab can expose preexisting alpha-gal IgE within minutes, while a fatty mammalian meal may not provoke symptoms until the patient is asleep. Alcohol, exercise, NSAIDs, illness, and larger or fattier exposures may lower the reaction threshold in some patients.",
      riskFactors: ["Residence, work, hunting, hiking, or outdoor activity in tick-endemic areas", "Repeated tick bites or large local reactions after a tick bite", "Prior delayed hives, GI symptoms, or anaphylaxis after beef, pork, lamb, venison, organ meat, gelatin, or mammalian fat", "Known alpha-gal-specific IgE or prior alpha-gal syndrome", "Exposure to alpha-gal-containing medications, gelatin, biologic tissue products, or selected monoclonal antibodies such as cetuximab", "Mast-cell disease or cofactors such as alcohol, exercise, NSAIDs, and acute illness that may intensify reactions"],
      signsSymptoms: ["Delayed urticaria, flushing, or intense itching 2 to 6 hours after oral mammalian exposure", "Lip, tongue, throat, or facial angioedema", "Abdominal cramping, nausea, vomiting, or diarrhea; some patients have predominantly GI reactions", "Cough, wheeze, chest tightness, dyspnea, or stridor", "Dizziness, syncope, hypotension, shock, or multisystem anaphylaxis", "Rapid reaction during or soon after an injected alpha-gal-containing product", "Variable reactions: the same food may not cause identical symptoms every time because dose, fat content, tick re-exposure, and cofactors change the threshold"],
      diagnostics: ["Build a timed exposure history: exact food or product, mammalian ingredients, time eaten or administered, symptom onset, cofactors, tick exposure, and whether poultry, fish, or plant foods were tolerated.", "Measure serum alpha-gal-specific IgE when the history suggests the diagnosis. Interpret the result with symptoms and exposure; no antibody cutoff by itself proves clinical allergy.", "Allergy-specialist evaluation can distinguish alpha-gal syndrome from conventional immediate meat-protein allergy, chronic urticaria, mast-cell disease, food poisoning, medication reaction, or idiopathic anaphylaxis.", "Do not perform an unsupervised home challenge. A specialist may use carefully selected testing or supervised challenge only when benefit outweighs anaphylaxis risk."],
      labs: ["Serum alpha-gal-specific IgE supports sensitization when paired with a compatible clinical history", "Total IgE can help contextualize a low positive but is not diagnostic by itself", "Acute serum tryptase can support mast-cell activation when obtained in the appropriate post-reaction window; a normal value does not exclude anaphylaxis", "Baseline tryptase may be considered after severe, recurrent, or unexplained reactions to assess an underlying mast-cell disorder"],
      treatments: ["For anaphylaxis, give IM epinephrine in the mid-anterolateral thigh immediately, activate emergency response, support airway/breathing/circulation, repeat epinephrine as indicated, and observe for recurrence. Antihistamines do not replace epinephrine.", "Use an individualized avoidance plan based on reaction severity and allergist guidance. Many patients must avoid mammalian meat and organ meat; some also react to dairy, gelatin, mammalian fat, or medical products, but unnecessary blanket restriction can impair nutrition.", "Carry prescribed epinephrine auto-injectors, know how and when to use them, and seek emergency care after use.", "Prevent additional tick bites with clothing, repellents, tick checks, prompt removal, and environmental precautions because re-exposure may sustain or raise IgE sensitivity.", "Review medications, vaccines, capsules, hemostatic agents, biologic implants, and monoclonal antibodies with pharmacy/allergy specialists when mammalian-derived ingredients are plausible."],
      nursingPriorities: ["Recognize the delayed pattern. Ask what the patient ate several hours before symptoms and whether reactions occur overnight; limiting the history to the previous few minutes misses the diagnosis.", "Treat respiratory compromise, hypotension, or multisystem reaction as anaphylaxis and give epinephrine first. Hives are not required, and isolated severe GI symptoms can still be clinically important.", "Before cetuximab or other relevant biologic exposure, ask specifically about alpha-gal syndrome, red-meat reactions, tick bites, gelatin reactions, and prior mammalian-product allergy; document the mechanism clearly rather than recording only 'food allergy'.", "Separate sensitization from disease: a positive alpha-gal IgE without compatible symptoms does not by itself justify labeling every mammalian-derived product as contraindicated."],
      nursingInterventions: ["Position according to hemodynamic and respiratory status, provide oxygen, establish monitoring and IV access, and prepare repeat epinephrine and fluids during anaphylaxis.", "Review ingredient sources with a pharmacist rather than guessing from a product name; manufacturing source and formulation can change.", "Teach label reading, restaurant questions, cross-contact planning, medical-alert identification, epinephrine technique, storage, expiration checks, and an emergency action plan.", "Refer to an allergy specialist and dietitian when avoidance is broad, nutrition is affected, reactions are recurrent, pregnancy is present, or medication/procedure choices are complex."],
      complications: ["Biphasic or protracted anaphylaxis", "Airway edema, bronchospasm, hypoxemia, shock, dysrhythmia, or death", "Recurrent nighttime reactions when the delayed food link is missed", "Avoidable medication or biologic reactions, including severe cetuximab anaphylaxis", "Malnutrition, iron or vitamin deficiency, anxiety, social restriction, or unnecessary avoidance from an overly broad diet", "Persistent or increased sensitivity after additional tick bites"],
      redFlags: ["Throat tightness, hoarseness, tongue swelling, stridor, wheeze, or respiratory distress", "Hypotension, collapse, syncope, confusion, cyanosis, or rapidly progressing symptoms", "Symptoms affecting two or more systems after a plausible exposure", "Severe repetitive vomiting or abdominal pain with dizziness, hives, swelling, or breathing change", "Reaction during an infusion or after an injection containing a possible mammalian-derived ingredient", "Need for more than one epinephrine dose or symptoms returning after initial improvement"],
      patientEducation: ["Beef, pork, lamb, venison, and other non-primate mammalian meats can contain alpha-gal; poultry, fish, reptiles, eggs, and plant foods do not contain the alpha-gal carbohydrate, though cross-contact and added mammalian ingredients still matter.", "Food reactions are often delayed 2 to 6 hours, so write down meals, ingredients, cofactors, and symptom timing rather than assuming the last bite caused the reaction.", "Use epinephrine immediately for breathing difficulty, throat swelling, faintness, shock signs, or a rapidly progressive multisystem reaction; do not wait for an antihistamine to work.", "Tell clinicians, dentists, pharmacists, and infusion staff about alpha-gal syndrome before new medications, vaccines, biologics, surgery, or implants.", "Preventing new tick bites is part of treatment because repeated exposure can maintain sensitization."],
      nclexTraps: ["Alpha-gal is a carbohydrate allergy with a delayed oral pattern; it is not the same as immediate allergy to a meat protein.", "Positive alpha-gal IgE means sensitization. Diagnosis requires a compatible exposure-and-reaction history.", "Cetuximab can cause an immediate reaction because IV delivery bypasses the slow GI/lipid-transport delay.", "Epinephrine is first-line for anaphylaxis. Antihistamines improve itching and hives but do not reliably reverse airway obstruction or shock."],
      tags: ["alpha-gal", "alpha gal syndrome", "red meat allergy", "tick bite", "delayed anaphylaxis", "IgE", "cetuximab", "galactose alpha 1 3 galactose", "mammalian products", "epinephrine"],
      sourceKeys: ["cdc-alpha-gal-syndrome"],
      sourceNote: "CDC Alpha-gal Syndrome clinical guidance: https://www.cdc.gov/alpha-gal-syndrome/about/index.html ; symptoms: https://www.cdc.gov/alpha-gal-syndrome/signs-symptoms/index.html ; diagnosis: https://www.cdc.gov/alpha-gal-syndrome/hcp/diagnosis-testing/index.html ; product exposure: https://www.cdc.gov/alpha-gal-syndrome/data-research/products-containing-alpha-gal/index.html",
      nclexEssential: true,
      __replaceArrays: PATHOLOGY_FULL_REPLACE_FIELDS
    }
  ];

  const pharmSpecificDrug = (name, classText, classPathway, tags = [], extra = {}) => ({
    name,
    generic: name,
    displayName: name,
    class: classText,
    classPathway,
    studentFacing: true,
    hidden: false,
    combinationProduct: false,
    deprecatedCombinationProduct: false,
    expandedIndex: false,
    confidenceTier: "Curated subclass-specific study card",
    templateKey: "curated-subclass",
    sourceNote: "Curated subclass-specific study card. Clinical use still depends on the active order, local protocol, and current product labeling.",
    nursingEssentials: [`Subclass specificity: ${name} is categorized here as ${classText}. Pathway: ${classPathway.join(" > ")}. This subtype shapes the expected mechanism, contraindications, boxed/high-alert warnings, monitoring, interactions, and patient teaching.`],
    tags: unique(["drug subclass specificity", ...tags]),
    ...extra
  });

  const pharmSpecificClassCard = (entry) => ({
    generic: entry.name,
    displayName: entry.name,
    class: "Drug class card",
    entryType: "drug-class-card",
    classCard: true,
    isDrugClassCard: true,
    studentFacing: true,
    hidden: false,
    ...entry,
    tags: unique(["drug subclass card", ...(entry.tags || [])])
  });

  const pharmClassSpecificityUpdates = [
    pharmSpecificDrug("Haloperidol", "High-potency first-generation typical antipsychotic", ["Psychiatric medication", "Antipsychotic", "First-generation typical antipsychotic", "High-potency FGA"], ["typical antipsychotic", "first generation antipsychotic", "high potency fga", "dopamine d2 antagonist"], {
      nursingEssentials: ["Subclass signal: high-potency first-generation antipsychotics strongly block D2 receptors, so EPS, dystonia, akathisia, parkinsonism, and neuroleptic malignant syndrome are priority surveillance points."],
      nclexTraps: ["Do not lump haloperidol with atypical antipsychotics. Its higher EPS liability is a major safety distinction."]
    }),
    pharmSpecificDrug("Chlorpromazine", "Low-potency first-generation typical antipsychotic", ["Psychiatric medication", "Antipsychotic", "First-generation typical antipsychotic", "Low-potency FGA"], ["typical antipsychotic", "first generation antipsychotic", "low potency fga", "dopamine d2 antagonist"], {
      nursingEssentials: ["Subclass signal: low-potency FGAs still block D2, but anticholinergic, antihistamine, and alpha-1 blockade effects are more prominent, so sedation, dry mouth, constipation, urinary retention, and orthostatic hypotension matter."],
      nclexTraps: ["Low potency does not mean low risk. It shifts the risk pattern toward autonomic and sedation effects."]
    }),
    pharmSpecificDrug("Fluphenazine", "High-potency first-generation typical antipsychotic", ["Psychiatric medication", "Antipsychotic", "First-generation typical antipsychotic", "High-potency FGA"], ["typical antipsychotic", "first generation antipsychotic", "high potency fga", "depot antipsychotic"], {
      nursingEssentials: ["Subclass signal: high-potency FGA behavior means EPS monitoring and tardive dyskinesia screening are core teaching points, especially with long-acting/depot formulations."]
    }),
    pharmSpecificDrug("Risperidone", "Second-generation atypical antipsychotic; D2/5-HT2A antagonist", ["Psychiatric medication", "Antipsychotic", "Second-generation atypical antipsychotic", "Dopamine-serotonin antagonist subgroup"], ["atypical antipsychotic", "second generation antipsychotic", "d2 5 ht2a antagonist", "prolactin elevation"], {
      nursingEssentials: ["Subclass signal: risperidone is atypical but can still cause EPS and prolactin elevation at higher D2 occupancy, so assess movement symptoms, amenorrhea/galactorrhea, and metabolic risk."]
    }),
    pharmSpecificDrug("Paliperidone", "Second-generation atypical antipsychotic; D2/5-HT2A antagonist", ["Psychiatric medication", "Antipsychotic", "Second-generation atypical antipsychotic", "Dopamine-serotonin antagonist subgroup"], ["atypical antipsychotic", "second generation antipsychotic", "active metabolite of risperidone", "prolactin elevation"], {
      nursingEssentials: ["Subclass signal: paliperidone behaves like risperidone's active metabolite, so prolactin effects, EPS, metabolic monitoring, and long-acting injection adherence questions are high yield."]
    }),
    pharmSpecificDrug("Olanzapine", "Second-generation atypical antipsychotic; high metabolic-risk SGA", ["Psychiatric medication", "Antipsychotic", "Second-generation atypical antipsychotic", "High metabolic-risk SGA"], ["atypical antipsychotic", "second generation antipsychotic", "metabolic syndrome risk", "weight gain"], {
      nursingEssentials: ["Subclass signal: olanzapine's antipsychotic effect comes with high metabolic liability. Track weight, waist trend, glucose/A1c, lipids, sedation, and anticholinergic burden."]
    }),
    pharmSpecificDrug("Quetiapine", "Second-generation atypical antipsychotic; sedating low-EPS SGA", ["Psychiatric medication", "Antipsychotic", "Second-generation atypical antipsychotic", "Sedating low-EPS SGA"], ["atypical antipsychotic", "second generation antipsychotic", "sedating antipsychotic", "orthostatic hypotension"], {
      nursingEssentials: ["Subclass signal: quetiapine has relatively lower EPS risk but strong H1 and alpha-1 effects, so sedation, falls, and orthostatic hypotension are key clinical catches."]
    }),
    pharmSpecificDrug("Ziprasidone", "Second-generation atypical antipsychotic; QT-prolonging SGA", ["Psychiatric medication", "Antipsychotic", "Second-generation atypical antipsychotic", "QT-prolonging SGA"], ["atypical antipsychotic", "second generation antipsychotic", "qt prolongation"], {
      nursingEssentials: ["Subclass signal: ziprasidone is an SGA where QT interval, electrolyte abnormalities, and other QT-prolonging drugs deserve extra attention."]
    }),
    pharmSpecificDrug("Lurasidone", "Second-generation atypical antipsychotic; lower metabolic-risk SGA", ["Psychiatric medication", "Antipsychotic", "Second-generation atypical antipsychotic", "Lower metabolic-risk SGA"], ["atypical antipsychotic", "second generation antipsychotic", "bipolar depression"], {
      nursingEssentials: ["Subclass signal: lurasidone is an SGA often remembered for bipolar depression use and comparatively lower metabolic burden, but EPS/akathisia can still occur."]
    }),
    pharmSpecificDrug("Clozapine", "Second-generation atypical antipsychotic; clozapine REMS/ANC-monitoring agent", ["Psychiatric medication", "Antipsychotic", "Second-generation atypical antipsychotic", "Treatment-resistant schizophrenia agent"], ["atypical antipsychotic", "second generation antipsychotic", "clozapine rems", "absolute neutrophil count", "agranulocytosis"], {
      nursingEssentials: ["Subclass signal: clozapine is not just another SGA. ANC monitoring, myocarditis/cardiomyopathy symptoms, seizures, constipation/ileus, sialorrhea, sedation, and metabolic effects are distinctive safety anchors."]
    }),
    pharmSpecificDrug("Aripiprazole", "Second-generation atypical antipsychotic; dopamine-serotonin partial agonist", ["Psychiatric medication", "Antipsychotic", "Second-generation atypical antipsychotic", "Dopamine-serotonin partial agonist subgroup"], ["atypical antipsychotic", "second generation antipsychotic", "partial dopamine agonist", "akathisia"], {
      nursingEssentials: ["Subclass signal: partial D2 agonism can stabilize dopamine tone rather than only blocking it, but akathisia, impulse-control symptoms, and activation can still be clinically important."]
    }),
    pharmSpecificDrug("Brexpiprazole", "Second-generation atypical antipsychotic; dopamine-serotonin partial agonist", ["Psychiatric medication", "Antipsychotic", "Second-generation atypical antipsychotic", "Dopamine-serotonin partial agonist subgroup"], ["atypical antipsychotic", "second generation antipsychotic", "partial dopamine agonist"]),
    pharmSpecificDrug("Cariprazine", "Second-generation atypical antipsychotic; D3-preferring dopamine-serotonin partial agonist", ["Psychiatric medication", "Antipsychotic", "Second-generation atypical antipsychotic", "D3-preferring partial agonist subgroup"], ["atypical antipsychotic", "second generation antipsychotic", "partial dopamine agonist", "d3 preferring"]),

    pharmSpecificDrug("Metoprolol", "Beta-1 selective beta blocker", ["Cardiovascular medication", "Beta blocker", "Beta-1 selective"], ["cardioselective beta blocker", "class ii antiarrhythmic"]),
    pharmSpecificDrug("Atenolol", "Beta-1 selective beta blocker", ["Cardiovascular medication", "Beta blocker", "Beta-1 selective"], ["cardioselective beta blocker", "class ii antiarrhythmic"]),
    pharmSpecificDrug("Bisoprolol", "Beta-1 selective beta blocker", ["Cardiovascular medication", "Beta blocker", "Beta-1 selective"], ["cardioselective beta blocker", "heart failure beta blocker"]),
    pharmSpecificDrug("Esmolol", "Beta-1 selective ultra-short-acting beta blocker", ["Cardiovascular medication", "Beta blocker", "Beta-1 selective", "Ultra-short-acting IV agent"], ["cardioselective beta blocker", "class ii antiarrhythmic", "iv beta blocker"]),
    pharmSpecificDrug("Nebivolol", "Beta-1 selective beta blocker with nitric-oxide vasodilatory effect", ["Cardiovascular medication", "Beta blocker", "Beta-1 selective", "Nitric-oxide vasodilatory beta blocker"], ["cardioselective beta blocker", "nitric oxide"]),
    pharmSpecificDrug("Propranolol", "Nonselective beta blocker", ["Cardiovascular medication", "Beta blocker", "Nonselective beta blocker"], ["nonselective beta blocker", "beta 1 beta 2 blocker", "class ii antiarrhythmic"]),
    pharmSpecificDrug("Nadolol", "Nonselective beta blocker", ["Cardiovascular medication", "Beta blocker", "Nonselective beta blocker"], ["nonselective beta blocker", "beta 1 beta 2 blocker"]),
    pharmSpecificDrug("Timolol", "Nonselective beta blocker", ["Cardiovascular medication", "Beta blocker", "Nonselective beta blocker"], ["nonselective beta blocker", "ophthalmic beta blocker"]),
    pharmSpecificDrug("Pindolol", "Nonselective beta blocker with intrinsic sympathomimetic activity", ["Cardiovascular medication", "Beta blocker", "Nonselective beta blocker", "Intrinsic sympathomimetic activity"], ["nonselective beta blocker", "partial agonist beta blocker"]),
    pharmSpecificDrug("Carvedilol", "Mixed alpha-1 and nonselective beta blocker", ["Cardiovascular medication", "Beta blocker", "Mixed alpha-1/beta blocker"], ["alpha beta blocker", "heart failure beta blocker", "vasodilating beta blocker"], {
      nursingEssentials: ["Subclass signal: carvedilol blocks beta receptors and alpha-1 receptors, so it lowers heart workload and adds vasodilation. Watch heart rate, blood pressure, orthostasis, and bronchospasm risk."]
    }),
    pharmSpecificDrug("Labetalol", "Mixed alpha-1 and nonselective beta blocker", ["Cardiovascular medication", "Beta blocker", "Mixed alpha-1/beta blocker"], ["alpha beta blocker", "hypertensive emergency", "pregnancy hypertension"]),

    pharmSpecificClassCard({
      name: "ACE inhibitors",
      aliases: ["angiotensin-converting enzyme inhibitors", "ACE inhibitor class", "ACE inhibitor drugs"],
      description: "ACE inhibitors reduce angiotensin II production and aldosterone signaling, which lowers vasoconstriction and sodium/water retention while protecting selected cardiac and kidney physiology.",
      usedToTreat: "Hypertension, heart failure with reduced ejection fraction, post-MI remodeling protection, diabetic/proteinuric kidney protection, and other cardiovascular indications depending on the specific drug and patient context.",
      mechanism: "They inhibit angiotensin-converting enzyme, decreasing angiotensin II and aldosterone while increasing bradykinin. Less angiotensin II lowers arteriolar tone and aldosterone-mediated sodium retention; bradykinin accumulation explains cough and contributes to angioedema risk.",
      nursingEssentials: ["Assess blood pressure, potassium, creatinine/eGFR trend, cough, facial/tongue swelling, pregnancy status, dehydration, renal-artery stenosis risk, and duplicate RAAS blockade.", "A small creatinine rise can occur after initiation, but marked renal decline, hyperkalemia, pregnancy, or angioedema symptoms require urgent clarification."],
      keyLabs: ["Potassium", "Creatinine/eGFR", "Blood pressure trend", "Pregnancy status when relevant"],
      nclexTraps: ["ACE inhibitors are RAAS blockers, not beta blockers or diuretics. The signature safety triad is pregnancy/fetal toxicity, hyperkalemia/renal function change, and bradykinin cough/angioedema."],
      classExampleNames: ["Lisinopril", "Enalapril", "Captopril", "Benazepril", "Ramipril"],
      classExampleKeys: ["lisinopril", "enalapril", "captopril", "benazepril", "ramipril"],
      tags: ["ace inhibitor", "raas blocker", "hyperkalemia", "angioedema", "fetal toxicity"]
    }),

    pharmSpecificDrug("Caffeine citrate", "Methylxanthine respiratory stimulant; nonselective adenosine receptor antagonist", ["Pediatric/neonatal medication", "Methylxanthine", "Respiratory stimulant", "Adenosine receptor antagonist"], ["caffeine", "apnea of prematurity", "neonatal apnea", "respiratory stimulant"], {
      aliases: ["Caffeine", "caffeine citrate injection", "caffeine citrate oral solution"],
      description: "Caffeine citrate is the neonatal caffeine salt used as a respiratory stimulant, most classically for apnea of prematurity. The important concept is not that it is a generic stimulant; it removes adenosine-mediated inhibition from the immature respiratory control system.",
      usedToTreat: "Apnea of prematurity or short-term neonatal apnea management after other causes of apnea are assessed and treated.",
      mechanism: "Caffeine antagonizes adenosine receptors, especially the adenosine brake on CNS and respiratory-center activity. In premature neonates this increases medullary respiratory drive, improves CO2 responsiveness, increases minute ventilation, and can improve diaphragmatic contractility. Citrate is the salt/counterion, so ordered doses may be expressed as caffeine citrate rather than caffeine base.",
      boxedWarning: "No formal drug-specific boxed warning is listed for caffeine citrate in this study reference. The clinically important warning pattern is neonatal methylxanthine toxicity: tachycardia, feeding intolerance, irritability, jitteriness, seizures at toxic exposure, and dosing-unit confusion between caffeine citrate and caffeine base.",
      nursingEssentials: ["Monitor apnea/bradycardia episodes, respiratory effort, oxygen need, heart rate, feeding tolerance, irritability, sleep pattern, weight gain, and serum levels when ordered.", "Clarify dose units because caffeine citrate dose and caffeine base dose are not interchangeable milligram-for-milligram."],
      keyLabs: ["Serum caffeine level if ordered or toxicity is suspected.", "Glucose and feeding/weight trend in fragile neonates.", "Clinical apnea/bradycardia event trend is often more important than a single number."],
      interactions: ["Other methylxanthines or stimulants can increase toxicity. Drugs that alter caffeine metabolism can change exposure; neonatal clearance changes rapidly with maturation."],
      contraindications: ["Hypersensitivity to caffeine/caffeine citrate. Clarify significant tachyarrhythmia, uncontrolled seizures, necrotizing-enterocolitis concern, or another untreated cause of apnea before routine administration."],
      nclexTraps: ["Caffeine citrate is an adenosine-antagonist neonatal respiratory stimulant, not a vague stimulant. The signature safety traps are tachycardia, feeding intolerance/irritability, and dose-unit errors between caffeine citrate and caffeine base."]
    }),
    pharmSpecificDrug("Ketamine", "Dissociative anesthetic; NMDA receptor antagonist", ["Emergency/critical-care medication", "Anesthetic/sedation agent", "Dissociative anesthetic", "NMDA receptor antagonist"], ["ketalar", "procedural sedation", "dissociative anesthesia", "analgesia", "sympathetic stimulation"], {
      aliases: ["Ketalar", "ketamine injection", "dissociative sedation"],
      description: "Ketamine is a dissociative anesthetic that separates cortical perception from limbic and thalamocortical sensory processing. The clinical personality is unusual: analgesia and amnesia with relative preservation of airway reflexes, plus sympathetic stimulation rather than the hypotension seen with many sedatives.",
      usedToTreat: "Induction and maintenance of anesthesia, procedural sedation with analgesia, painful emergency procedures, selected acute pain protocols, and selected critical-care sedation when airway, hemodynamic, psychiatric, and secretion risks are addressed.",
      mechanism: "Ketamine is a noncompetitive NMDA glutamate receptor antagonist. Blocking NMDA signaling reduces excitatory transmission and central sensitization, producing a dissociative state with analgesia and amnesia. It also increases catecholamine tone by inhibiting neuronal catecholamine reuptake and stimulating sympathetic outflow, which can raise heart rate and blood pressure; in catecholamine-depleted shock, myocardial depressant effects may become more visible.",
      boxedWarning: "No formal drug-specific boxed warning is listed for ketamine in this study reference. High-alert sedation warnings are still central: respiratory depression or laryngospasm can occur, emergence reactions can be severe, blood pressure/heart rate may rise, secretions may increase, and dosing/monitoring must match procedural-sedation or anesthesia standards.",
      nursingEssentials: ["Prepare airway, suction, oxygen, cardiorespiratory monitoring, resuscitation equipment, and recovery observation before administration.", "Assess baseline blood pressure, heart rate, neurologic/psychiatric history, substance use, intracranial/ocular pressure concerns, pregnancy context, and concurrent CNS depressants.", "Watch for hypersalivation, vomiting, emergence agitation, hallucinations, hypertension, tachycardia, and rare laryngospasm or apnea."],
      contraindications: ["Clarify hypersensitivity, severe uncontrolled hypertension, conditions where marked blood pressure rise is dangerous, severe psychiatric instability/psychosis risk, elevated intracranial or intraocular pressure concern when relevant, and unsafe airway/procedural-sedation setup."],
      interactions: ["Benzodiazepines, opioids, alcohol, propofol, antipsychotics, and other CNS depressants can deepen sedation or respiratory risk. Sympathomimetics or poorly controlled hypertension can magnify cardiovascular stimulation."],
      keyLabs: ["No single routine lab proves ketamine safety. Assessment anchors are airway/ventilation, oxygen saturation, end-tidal CO2 when used, blood pressure, heart rate/rhythm, pain/sedation scale, and recovery mental status."],
      nclexTraps: ["Ketamine provides analgesia and dissociation, not routine paralysis. Preserved airway reflexes do not mean no airway risk. Sympathetic stimulation can support blood pressure in some clients but can be dangerous in severe hypertension, aneurysm/vascular risk, or tachyarrhythmia-prone states."]
    }),
    pharmSpecificDrug("Calcium acetate", "Calcium-based phosphate binder", ["Renal/electrolyte medication", "Phosphate binder", "Calcium salt", "CKD/dialysis hyperphosphatemia"], ["phosphate binder", "phosphorus binder", "hyperphosphatemia", "dialysis"], {
      aliases: ["calcium acetate phosphate binder"],
      description: "Calcium acetate is a calcium-based phosphate binder. The learning anchor is mechanical/chemical binding in the gut: it lowers phosphorus absorption rather than changing kidney filtration directly.",
      usedToTreat: "Hyperphosphatemia in chronic kidney disease, especially dialysis clients, when taken with meals or snacks that contain phosphate.",
      mechanism: "Calcium acetate dissociates in the GI tract and calcium binds dietary phosphate to form insoluble calcium phosphate complexes. Those complexes are excreted in stool, lowering phosphate absorption and serum phosphorus. Because the binder adds calcium, hypercalcemia and vascular-calcification concern are central safety issues.",
      nursingEssentials: ["Give with meals/snacks that contain phosphate; it works in the gut lumen at the time phosphate is present.", "Monitor calcium, phosphorus, calcium-phosphorus product when used locally, constipation, nausea, and timing separation from interacting oral medications."],
      keyLabs: ["Serum phosphorus.", "Serum calcium.", "PTH and vitamin D context when ordered.", "Kidney function/dialysis context."],
      interactions: ["Can reduce absorption of tetracyclines, fluoroquinolones, levothyroxine, iron, bisphosphonates, and other oral drugs that bind polyvalent cations; separate timing per policy/order."],
      contraindications: ["Hypercalcemia is a major stop/clarify cue. Clarify severe constipation/ileus risk, calcium-based binder stacking, vitamin D/calcium supplement stacking, and history of significant vascular/soft-tissue calcification risk."],
      nclexTraps: ["The phosphate-binding logic requires dosing with food that contains phosphate. Calcium acetate is a gut phosphate binder with hypercalcemia risk, not simply a calcium replacement product."]
    }),

    pharmSpecificDrug("Diltiazem", "Non-dihydropyridine calcium channel blocker; Class IV antiarrhythmic", ["Cardiovascular medication", "Calcium channel blocker", "Non-dihydropyridine CCB", "AV-nodal rate-control agent"], ["non dihydropyridine ccb", "class iv antiarrhythmic", "av nodal blocker"], {
      aliases: ["Cardizem", "diltiazem ER", "diltiazem drip"],
      description: "Diltiazem is a non-dihydropyridine calcium channel blocker that slows AV-node conduction and also relaxes vascular smooth muscle, so it is a rate-control drug with blood-pressure effects.",
      usedToTreat: "Atrial fibrillation/flutter or SVT rate control when appropriate, chronic angina, and hypertension depending on formulation and order context.",
      mechanism: "Diltiazem blocks L-type calcium channels in AV nodal tissue and vascular smooth muscle. Less calcium entry slows AV-node conduction and contractility while also lowering vascular tone, explaining bradycardia, heart block, hypotension, edema, and worsening heart-failure risk in susceptible clients.",
      nursingEssentials: ["Check heart rate, blood pressure, rhythm/PR interval, signs of heart block, dizziness, edema, and heart-failure symptoms before and during therapy.", "Clarify use with beta blockers, digoxin, severe bradycardia, AV block, or reduced ejection fraction unless specifically directed."],
      keyLabs: ["Potassium/magnesium if dysrhythmia context.", "Liver/kidney context for frail clients when ordered."],
      nclexTraps: ["Diltiazem is not amlodipine. Its AV-node effect is useful for rate control but dangerous in bradycardia, heart block, or selected decompensated heart failure."],
      tags: ["diltiazem", "cardizem", "non-dihydropyridine", "av node", "rate control"]
    }),
    pharmSpecificDrug("Verapamil", "Non-dihydropyridine calcium channel blocker; Class IV antiarrhythmic", ["Cardiovascular medication", "Calcium channel blocker", "Non-dihydropyridine CCB", "AV-nodal rate-control agent"], ["non dihydropyridine ccb", "class iv antiarrhythmic", "av nodal blocker"], {
      aliases: ["Calan", "Verelan", "verapamil ER"],
      description: "Verapamil is a non-dihydropyridine calcium channel blocker with strong AV-node slowing and negative inotropic effects, making it a rate-control/antianginal drug rather than a pure vascular CCB.",
      usedToTreat: "Selected SVT or atrial fibrillation/flutter rate-control situations, chronic angina, hypertension, and some migraine/cluster-headache prevention contexts when ordered.",
      mechanism: "Verapamil blocks L-type calcium channels in AV nodal tissue, myocardium, and vascular smooth muscle. Slower AV-node conduction and reduced contractility explain bradycardia, PR prolongation, heart block, hypotension, constipation, and heart-failure worsening risk.",
      nursingEssentials: ["Check apical pulse/heart rate, blood pressure, rhythm/PR interval, constipation, dizziness, edema, and heart-failure symptoms.", "Clarify beta blocker stacking, digoxin interaction, significant bradycardia, AV block, hypotension, or reduced ejection fraction unless specialist-directed."],
      keyLabs: ["Electrolytes if dysrhythmia context; digoxin level if interacting therapy is used and ordered."],
      nclexTraps: ["Verapamil slows the AV node and squeezes less strongly; constipation is a classic clue. It is not interchangeable with dihydropyridine vasodilators such as amlodipine."],
      tags: ["verapamil", "non-dihydropyridine", "av node", "rate control", "constipation"]
    }),
    pharmSpecificDrug("Amlodipine", "Dihydropyridine calcium channel blocker; vascular smooth-muscle selective arterial vasodilator", ["Cardiovascular medication", "Calcium channel blocker", "Dihydropyridine CCB", "Vascular smooth-muscle selective vasodilator"], ["dihydropyridine ccb", "vascular calcium channel blocker"], {
      aliases: ["Norvasc", "amlodipine besylate"],
      description: "Amlodipine is a dihydropyridine calcium channel blocker that relaxes arterial vascular smooth muscle, lowering systemic vascular resistance and myocardial afterload without being a primary AV-node rate-control drug.",
      usedToTreat: "Hypertension and chronic stable or vasospastic angina; it is not used like diltiazem/verapamil for routine AV-nodal rate control.",
      mechanism: "Amlodipine blocks L-type calcium channels in arterial smooth muscle more than cardiac conduction tissue. Less calcium entry relaxes arterioles, lowers afterload, improves coronary blood flow in vasospasm, and explains edema, flushing, dizziness, and reflex tachycardia tendency.",
      nursingEssentials: ["Assess blood pressure, dizziness/orthostasis, peripheral edema, flushing, headache, heart-failure fluid status, and angina pattern.", "Teach slow position changes and report new/worsening edema or chest pain."],
      contraindications: ["Clarify severe hypotension, shock, unstable acute decompensated heart failure context, severe aortic stenosis concern, or hypersensitivity."],
      keyLabs: ["No routine serum level. Track BP, edema/weight, and symptom response."],
      nclexTraps: ["Amlodipine is the vascular/afterload dihydropyridine CCB. Do not teach it as the classic AV-node slowing CCB; that is the non-dihydropyridine lane."],
      tags: ["amlodipine", "norvasc", "dihydropyridine", "arterial vasodilator", "edema"]
    }),
    pharmSpecificDrug("Nifedipine", "Dihydropyridine calcium channel blocker", ["Cardiovascular medication", "Calcium channel blocker", "Dihydropyridine CCB", "Vascular smooth-muscle selective vasodilator"], ["dihydropyridine ccb", "vascular calcium channel blocker"]),
    pharmSpecificDrug("Nicardipine", "Dihydropyridine calcium channel blocker", ["Cardiovascular medication", "Calcium channel blocker", "Dihydropyridine CCB", "IV arterial vasodilator"], ["dihydropyridine ccb", "hypertensive emergency"]),
    pharmSpecificDrug("Clevidipine", "Dihydropyridine calcium channel blocker", ["Cardiovascular medication", "Calcium channel blocker", "Dihydropyridine CCB", "Ultra-short-acting IV arterial vasodilator"], ["dihydropyridine ccb", "hypertensive emergency"]),
    pharmSpecificDrug("Felodipine", "Dihydropyridine calcium channel blocker", ["Cardiovascular medication", "Calcium channel blocker", "Dihydropyridine CCB"], ["dihydropyridine ccb"]),
    pharmSpecificDrug("Nimodipine", "Dihydropyridine calcium channel blocker; cerebral vasospasm-focused agent", ["Cardiovascular medication", "Calcium channel blocker", "Dihydropyridine CCB", "Subarachnoid hemorrhage vasospasm prophylaxis"], ["dihydropyridine ccb", "cerebral vasospasm"]),

    pharmSpecificDrug("Warfarin", "Vitamin K antagonist anticoagulant", ["Hematology medication", "Anticoagulant", "Vitamin K antagonist"], ["vitamin k antagonist", "inr monitoring"]),
    pharmSpecificDrug("Heparin", "Unfractionated heparin anticoagulant; antithrombin-mediated factor IIa/Xa inhibition", ["Hematology medication", "Anticoagulant", "Parenteral heparin", "Antithrombin-mediated IIa/Xa inhibition"], ["unfractionated heparin", "antithrombin", "aptt monitoring"]),
    pharmSpecificDrug("Enoxaparin", "Low-molecular-weight heparin anticoagulant; factor Xa-predominant", ["Hematology medication", "Anticoagulant", "Low-molecular-weight heparin", "Factor Xa-predominant"], ["lmwh", "low molecular weight heparin", "factor xa"]),
    pharmSpecificDrug("Apixaban", "Direct oral factor Xa inhibitor anticoagulant", ["Hematology medication", "Anticoagulant", "Direct oral anticoagulant", "Factor Xa inhibitor"], ["doac", "factor xa inhibitor"]),
    pharmSpecificDrug("Rivaroxaban", "Direct oral factor Xa inhibitor anticoagulant", ["Hematology medication", "Anticoagulant", "Direct oral anticoagulant", "Factor Xa inhibitor"], ["doac", "factor xa inhibitor"]),
    pharmSpecificDrug("Edoxaban", "Direct oral factor Xa inhibitor anticoagulant", ["Hematology medication", "Anticoagulant", "Direct oral anticoagulant", "Factor Xa inhibitor"], ["doac", "factor xa inhibitor"]),
    pharmSpecificDrug("Dabigatran", "Direct thrombin inhibitor anticoagulant", ["Hematology medication", "Anticoagulant", "Direct oral anticoagulant", "Direct thrombin inhibitor"], ["doac", "direct thrombin inhibitor", "factor iia inhibitor"]),
    pharmSpecificDrug("Aspirin", "Irreversible COX-1 antiplatelet NSAID", ["Hematology medication", "Antiplatelet", "Irreversible COX-1 platelet inhibition"], ["cox 1 antiplatelet", "thromboxane a2"]),
    pharmSpecificDrug("Clopidogrel", "P2Y12 receptor inhibitor antiplatelet", ["Hematology medication", "Antiplatelet", "P2Y12 receptor inhibitor"], ["p2y12 inhibitor", "adp receptor blocker"]),
    pharmSpecificDrug("Prasugrel", "P2Y12 receptor inhibitor antiplatelet", ["Hematology medication", "Antiplatelet", "P2Y12 receptor inhibitor"], ["p2y12 inhibitor", "adp receptor blocker"]),
    pharmSpecificDrug("Ticagrelor", "P2Y12 receptor inhibitor antiplatelet", ["Hematology medication", "Antiplatelet", "P2Y12 receptor inhibitor"], ["p2y12 inhibitor", "adp receptor blocker"]),

    pharmSpecificDrug("Insulin lispro", "Rapid-acting prandial insulin analog", ["Endocrine medication", "Diabetes medication", "Insulin", "Rapid-acting prandial insulin"], ["rapid acting insulin", "mealtime insulin", "prandial insulin"]),
    pharmSpecificDrug("Insulin aspart", "Rapid-acting prandial insulin analog", ["Endocrine medication", "Diabetes medication", "Insulin", "Rapid-acting prandial insulin"], ["rapid acting insulin", "mealtime insulin", "prandial insulin"]),
    pharmSpecificDrug("Insulin glulisine", "Rapid-acting prandial insulin analog", ["Endocrine medication", "Diabetes medication", "Insulin", "Rapid-acting prandial insulin"], ["rapid acting insulin", "mealtime insulin", "prandial insulin"]),
    pharmSpecificDrug("Regular insulin", "Short-acting regular insulin", ["Endocrine medication", "Diabetes medication", "Insulin", "Short-acting regular insulin"], ["short acting insulin", "regular insulin", "iv insulin"]),
    pharmSpecificDrug("Insulin glargine", "Long-acting basal insulin analog", ["Endocrine medication", "Diabetes medication", "Insulin", "Long-acting basal insulin"], ["long acting insulin", "basal insulin"]),
    pharmSpecificDrug("Insulin detemir", "Long-acting basal insulin analog", ["Endocrine medication", "Diabetes medication", "Insulin", "Long-acting basal insulin"], ["long acting insulin", "basal insulin"]),
    pharmSpecificDrug("Insulin degludec", "Ultra-long-acting basal insulin analog", ["Endocrine medication", "Diabetes medication", "Insulin", "Long-acting basal insulin", "Ultra-long basal insulin"], ["long acting insulin", "ultra long insulin", "basal insulin"]),
    pharmSpecificDrug("Semaglutide", "GLP-1 receptor agonist incretin medication", ["Endocrine medication", "Diabetes/weight medication", "Incretin pathway", "GLP-1 receptor agonist"], ["glp 1 receptor agonist", "incretin mimetic"]),
    pharmSpecificDrug("Liraglutide", "GLP-1 receptor agonist incretin medication", ["Endocrine medication", "Diabetes/weight medication", "Incretin pathway", "GLP-1 receptor agonist"], ["glp 1 receptor agonist", "incretin mimetic"]),
    pharmSpecificDrug("Dulaglutide", "GLP-1 receptor agonist incretin medication", ["Endocrine medication", "Diabetes/weight medication", "Incretin pathway", "GLP-1 receptor agonist"], ["glp 1 receptor agonist", "incretin mimetic"]),
    pharmSpecificDrug("Exenatide", "GLP-1 receptor agonist incretin medication", ["Endocrine medication", "Diabetes/weight medication", "Incretin pathway", "GLP-1 receptor agonist"], ["glp 1 receptor agonist", "incretin mimetic"]),
    pharmSpecificDrug("Tirzepatide", "Dual GIP/GLP-1 receptor agonist incretin medication", ["Endocrine medication", "Diabetes/weight medication", "Incretin pathway", "Dual GIP/GLP-1 receptor agonist"], ["dual incretin agonist", "gip glp 1"]),
    pharmSpecificDrug("Empagliflozin", "SGLT2 inhibitor antidiabetic", ["Endocrine medication", "Diabetes medication", "SGLT2 inhibitor"], ["sglt2 inhibitor", "glucosuria", "euglycemic dka"]),
    pharmSpecificDrug("Dapagliflozin", "SGLT2 inhibitor antidiabetic", ["Endocrine medication", "Diabetes medication", "SGLT2 inhibitor"], ["sglt2 inhibitor", "glucosuria", "euglycemic dka"]),
    pharmSpecificDrug("Canagliflozin", "SGLT2 inhibitor antidiabetic", ["Endocrine medication", "Diabetes medication", "SGLT2 inhibitor"], ["sglt2 inhibitor", "glucosuria", "euglycemic dka"]),
    pharmSpecificDrug("Sitagliptin", "DPP-4 inhibitor antidiabetic", ["Endocrine medication", "Diabetes medication", "Incretin pathway", "DPP-4 inhibitor"], ["dpp 4 inhibitor", "incretin preservation"]),
    pharmSpecificDrug("Linagliptin", "DPP-4 inhibitor antidiabetic", ["Endocrine medication", "Diabetes medication", "Incretin pathway", "DPP-4 inhibitor"], ["dpp 4 inhibitor", "incretin preservation"]),
    pharmSpecificDrug("Pioglitazone", "Thiazolidinedione PPAR-gamma agonist antidiabetic", ["Endocrine medication", "Diabetes medication", "Thiazolidinedione", "PPAR-gamma agonist"], ["tzd", "ppar gamma", "insulin sensitizer"]),
    pharmSpecificDrug("Rosiglitazone", "Thiazolidinedione PPAR-gamma agonist antidiabetic", ["Endocrine medication", "Diabetes medication", "Thiazolidinedione", "PPAR-gamma agonist"], ["tzd", "ppar gamma", "insulin sensitizer"]),

    pharmSpecificDrug("Albuterol", "Short-acting beta-2 agonist bronchodilator", ["Respiratory medication", "Beta-2 agonist bronchodilator", "SABA"], ["saba", "rescue inhaler"]),
    pharmSpecificDrug("Levalbuterol", "Short-acting beta-2 agonist bronchodilator", ["Respiratory medication", "Beta-2 agonist bronchodilator", "SABA"], ["saba", "rescue inhaler"]),
    pharmSpecificDrug("Salmeterol", "Long-acting beta-2 agonist bronchodilator", ["Respiratory medication", "Beta-2 agonist bronchodilator", "LABA"], ["laba", "long acting beta agonist"]),
    pharmSpecificDrug("Formoterol", "Long-acting beta-2 agonist bronchodilator", ["Respiratory medication", "Beta-2 agonist bronchodilator", "LABA"], ["laba", "long acting beta agonist"]),
    pharmSpecificDrug("Ipratropium", "Short-acting muscarinic antagonist bronchodilator", ["Respiratory medication", "Muscarinic antagonist bronchodilator", "SAMA"], ["sama", "short acting muscarinic antagonist"]),
    pharmSpecificDrug("Tiotropium", "Long-acting muscarinic antagonist bronchodilator", ["Respiratory medication", "Muscarinic antagonist bronchodilator", "LAMA"], ["lama", "long acting muscarinic antagonist"]),
    pharmSpecificDrug("Umeclidinium", "Long-acting muscarinic antagonist bronchodilator", ["Respiratory medication", "Muscarinic antagonist bronchodilator", "LAMA"], ["lama", "long acting muscarinic antagonist"]),
    pharmSpecificDrug("Budesonide", "Inhaled corticosteroid controller medication", ["Respiratory medication", "Anti-inflammatory airway controller", "Inhaled corticosteroid"], ["ics", "inhaled corticosteroid"]),
    pharmSpecificDrug("Fluticasone", "Inhaled corticosteroid controller medication", ["Respiratory medication", "Anti-inflammatory airway controller", "Inhaled corticosteroid"], ["ics", "inhaled corticosteroid"]),
    pharmSpecificDrug("Succinylcholine", "Depolarizing neuromuscular blocker", ["Anesthesia/critical-care medication", "Neuromuscular blocker", "Depolarizing blocker"], ["depolarizing neuromuscular blocker", "phase i block"]),
    pharmSpecificDrug("Rocuronium", "Nondepolarizing neuromuscular blocker", ["Anesthesia/critical-care medication", "Neuromuscular blocker", "Nondepolarizing blocker"], ["nondepolarizing neuromuscular blocker", "competitive nicotinic antagonist"]),
    pharmSpecificDrug("Vecuronium", "Nondepolarizing neuromuscular blocker", ["Anesthesia/critical-care medication", "Neuromuscular blocker", "Nondepolarizing blocker"], ["nondepolarizing neuromuscular blocker", "competitive nicotinic antagonist"]),
    pharmSpecificDrug("Cisatracurium", "Nondepolarizing neuromuscular blocker", ["Anesthesia/critical-care medication", "Neuromuscular blocker", "Nondepolarizing blocker", "Hofmann elimination"], ["nondepolarizing neuromuscular blocker", "hofmann elimination"]),

    pharmSpecificDrug("Cefazolin", "First-generation cephalosporin antibiotic", ["Anti-infective medication", "Beta-lactam antibiotic", "Cephalosporin", "First generation"], ["first generation cephalosporin", "beta lactam"]),
    pharmSpecificDrug("Cephalexin", "First-generation cephalosporin antibiotic", ["Anti-infective medication", "Beta-lactam antibiotic", "Cephalosporin", "First generation"], ["first generation cephalosporin", "beta lactam"]),
    pharmSpecificDrug("Cefuroxime", "Second-generation cephalosporin antibiotic", ["Anti-infective medication", "Beta-lactam antibiotic", "Cephalosporin", "Second generation"], ["second generation cephalosporin", "beta lactam"]),
    pharmSpecificDrug("Ceftriaxone", "Third-generation cephalosporin antibiotic", ["Anti-infective medication", "Beta-lactam antibiotic", "Cephalosporin", "Third generation"], ["third generation cephalosporin", "beta lactam"]),
    pharmSpecificDrug("Ceftazidime", "Third-generation cephalosporin antibiotic with antipseudomonal activity", ["Anti-infective medication", "Beta-lactam antibiotic", "Cephalosporin", "Third generation", "Antipseudomonal cephalosporin"], ["third generation cephalosporin", "antipseudomonal"]),
    pharmSpecificDrug("Cefepime", "Fourth-generation antipseudomonal cephalosporin antibiotic", ["Anti-infective medication", "Beta-lactam antibiotic", "Cephalosporin", "Fourth generation", "Antipseudomonal cephalosporin"], ["fourth generation cephalosporin", "antipseudomonal"]),
    pharmSpecificDrug("Ceftaroline", "Fifth-generation MRSA-active cephalosporin antibiotic", ["Anti-infective medication", "Beta-lactam antibiotic", "Cephalosporin", "Fifth generation", "MRSA-active cephalosporin"], ["fifth generation cephalosporin", "mrsa active beta lactam"]),
    pharmSpecificDrug("Linezolid", "Oxazolidinone antibiotic", ["Anti-infective medication", "Protein synthesis inhibitor", "Oxazolidinone"], ["oxazolidinone", "50s ribosomal inhibitor"]),

    pharmSpecificClassCard({
      name: "First-generation typical antipsychotics",
      aliases: ["conventional antipsychotics", "FGAs"],
      description: "First-generation typical antipsychotics are older antipsychotic drugs whose core therapeutic action is strong dopamine D2 receptor antagonism in mesolimbic pathways. That same D2 blockade in nigrostriatal, tuberoinfundibular, and other pathways explains many adverse effects.",
      usedToTreat: "Schizophrenia spectrum disorders, acute agitation, psychosis, delirium-related agitation when ordered, Tourette/tic disorders for selected agents, and nausea/hiccups for selected phenothiazines.",
      mechanism: "D2 blockade reduces dopaminergic signaling that contributes to positive psychotic symptoms. It is not a selective brain-only effect: D2 blockade in movement pathways causes EPS, in pituitary pathways raises prolactin, and hypothalamic/autonomic receptor effects vary by potency.",
      nursingEssentials: ["Separate potency from strength. High-potency FGAs usually cause more EPS; low-potency FGAs usually cause more sedation, anticholinergic effects, and orthostasis.", "Monitor abnormal movements, temperature/rigidity/autonomic instability for NMS, QT risk, sedation, falls, and adherence."],
      nclexTraps: ["Do not describe typical antipsychotics as only sedatives. Their defining pharmacology is dopamine D2 antagonism."],
      classExampleNames: ["Haloperidol", "Chlorpromazine", "Fluphenazine"],
      classExampleKeys: ["haloperidol", "chlorpromazine", "fluphenazine"],
      tags: ["typical antipsychotic", "first generation antipsychotic", "dopamine d2 antagonist"]
    }),
    pharmSpecificClassCard({
      name: "High-potency first-generation antipsychotics",
      aliases: ["high potency FGAs"],
      description: "High-potency first-generation antipsychotics achieve antipsychotic D2 blockade at lower milligram doses and tend to have less antihistamine/anticholinergic activity than low-potency phenothiazines, but a higher EPS burden.",
      usedToTreat: "Psychosis, acute agitation, mania-related agitation, and other ordered psychiatric indications where strong D2 blockade is desired.",
      mechanism: "The main useful effect is D2 antagonism in mesolimbic dopamine circuits. Because high-potency agents strongly occupy D2 receptors, the movement system is vulnerable to acute dystonia, akathisia, parkinsonism, and tardive dyskinesia.",
      nursingEssentials: ["Assess new muscle spasms, restlessness, tremor/rigidity, swallowing trouble, fever/rigidity, and abnormal involuntary movements.", "Have the EPS rescue plan clear when ordered: anticholinergic or antihistamine treatment may be used for acute dystonia per protocol."],
      nclexTraps: ["Akathisia can look like anxiety or agitation; worsening restlessness after a high-potency FGA may be medication-induced."],
      classExampleNames: ["Haloperidol", "Fluphenazine"],
      classExampleKeys: ["haloperidol", "fluphenazine"],
      tags: ["high potency fga", "eps"]
    }),
    pharmSpecificClassCard({
      name: "Low-potency first-generation antipsychotics",
      aliases: ["low potency FGAs"],
      description: "Low-potency first-generation antipsychotics still block dopamine D2 receptors, but they also have more clinically obvious histamine H1, muscarinic, and alpha-1 receptor blockade.",
      usedToTreat: "Psychosis, agitation, and selected nonpsychiatric indications for specific phenothiazines when ordered.",
      mechanism: "D2 antagonism produces antipsychotic benefit. Off-target H1 blockade causes sedation and weight gain; muscarinic blockade causes dry mouth, constipation, urinary retention, and blurred vision; alpha-1 blockade causes orthostatic hypotension.",
      nursingEssentials: ["Teach slow position changes, constipation prevention, fall precautions, heat safety, and avoiding alcohol/CNS depressants unless cleared.", "Assess urinary retention, ileus risk, glaucoma history, delirium risk, and orthostatic blood pressure."],
      nclexTraps: ["Low potency means lower D2 potency per milligram, not low adverse-effect risk."],
      classExampleNames: ["Chlorpromazine"],
      classExampleKeys: ["chlorpromazine"],
      tags: ["low potency fga", "anticholinergic", "orthostasis"]
    }),
    pharmSpecificClassCard({
      name: "Second-generation atypical antipsychotics",
      aliases: ["second generation antipsychotics", "second-generation antipsychotics", "second generation antipsychotic medications", "second gen antipsychotics", "atypical antipsychotics", "SGAs"],
      description: "Second-generation atypical antipsychotics are antipsychotics that generally combine dopamine D2 modulation with serotonin 5-HT2A antagonism or partial agonist activity. They reduce positive symptoms and often have less classic EPS than high-potency FGAs, but metabolic, cardiac, prolactin, sedation, and drug-specific risks vary widely.",
      usedToTreat: "Schizophrenia spectrum disorders, bipolar mania, bipolar depression for selected agents, augmentation of major depression for selected agents, irritability/agitation indications for selected populations, and other ordered psychiatric uses.",
      mechanism: "Most SGAs reduce excessive dopamine signaling while serotonin 5-HT2A blockade increases dopamine release in some motor pathways, which can lower EPS risk compared with strong pure D2 blockade. Partial agonists such as aripiprazole modulate D2 signaling instead of simply blocking it.",
      nursingEssentials: ["Do not teach SGAs as one risk profile. Clozapine needs ANC monitoring; olanzapine/clozapine have high metabolic risk; ziprasidone has QT emphasis; risperidone/paliperidone can raise prolactin; aripiprazole-class partial agonists can cause akathisia/activation.", "Monitor weight, glucose/A1c, lipids, movement symptoms, sedation, orthostasis, QT risks, suicidality warnings, and adherence."],
      nclexTraps: ["Atypical does not mean no EPS or no serious adverse effects. It means the receptor pattern and risk balance differ from typical FGAs."],
      classExampleNames: ["Clozapine", "Olanzapine", "Quetiapine", "Risperidone", "Paliperidone", "Ziprasidone", "Lurasidone", "Aripiprazole", "Brexpiprazole", "Cariprazine"],
      classExampleKeys: ["clozapine", "olanzapine", "quetiapine", "risperidone", "paliperidone", "ziprasidone", "lurasidone", "aripiprazole", "brexpiprazole", "cariprazine"],
      tags: ["second generation antipsychotic", "atypical antipsychotic", "5 ht2a"]
    }),
    pharmSpecificClassCard({
      name: "Dopamine-serotonin partial agonist antipsychotics",
      aliases: ["D2 partial agonist antipsychotics"],
      description: "This subgroup of atypical antipsychotics acts more like dopamine-system stabilization than pure dopamine blockade. They partially stimulate D2 receptors when dopamine tone is low and compete with dopamine when tone is excessive.",
      usedToTreat: "Schizophrenia, bipolar disorder indications, and depression augmentation for selected agents depending on the label.",
      mechanism: "Partial D2 agonism can reduce dopaminergic overactivity while preserving some receptor signaling. Serotonin receptor actions contribute to mood and tolerability effects. The practical bedside distinction is less prolactin elevation for many clients but more activation/akathisia in some.",
      nursingEssentials: ["Ask specifically about inner restlessness, pacing, insomnia, new impulsive behavior, nausea, and activation.", "Do not assume partial agonist means weak; it can be very effective but has a different adverse-effect pattern."],
      nclexTraps: ["Akathisia from a partial agonist may be mistaken for worsening psychiatric illness."],
      classExampleNames: ["Aripiprazole", "Brexpiprazole", "Cariprazine"],
      classExampleKeys: ["aripiprazole", "brexpiprazole", "cariprazine"],
      tags: ["partial dopamine agonist", "atypical antipsychotic"]
    }),
    pharmSpecificClassCard({
      name: "Beta-1 selective beta blockers",
      aliases: ["cardioselective beta blockers"],
      description: "Beta-1 selective beta blockers preferentially block cardiac beta-1 receptors at usual doses. Selectivity is relative, not absolute, and can decrease at higher doses or in sensitive clients.",
      usedToTreat: "Hypertension, angina, rate control, selected tachyarrhythmias, post-MI care, heart failure for selected agents, and other ordered cardiovascular indications.",
      mechanism: "Beta-1 blockade slows sinus rate, slows AV-node conduction, decreases myocardial contractility, and suppresses renin release from juxtaglomerular cells. The result is lower oxygen demand, slower rate, and reduced maladaptive sympathetic drive in selected disease states.",
      nursingEssentials: ["Check heart rate, blood pressure, conduction disease, decompensated heart failure cues, bronchospasm history, and hypoglycemia masking risk.", "Cardioselective does not mean safe for every asthma/COPD client; assess respiratory status and orders."],
      nclexTraps: ["Do not hold solely because the drug is a beta blocker; use ordered hold parameters and assess symptoms, HR, BP, rhythm, and perfusion."],
      classExampleNames: ["Metoprolol", "Atenolol", "Bisoprolol", "Esmolol", "Nebivolol"],
      classExampleKeys: ["metoprolol", "atenolol", "bisoprolol", "esmolol", "nebivolol"],
      tags: ["beta 1 selective", "class ii antiarrhythmic", "cardioselective"]
    }),
    pharmSpecificClassCard({
      name: "Nonselective beta blockers",
      aliases: ["beta-1 beta-2 blockers"],
      description: "Nonselective beta blockers block both beta-1 cardiac receptors and beta-2 receptors in bronchial and vascular/metabolic tissues. This makes their adverse-effect pattern different from beta-1 selective drugs.",
      usedToTreat: "Hypertension, migraine prevention, tremor, portal hypertension/variceal bleeding prevention for selected agents, arrhythmia/rate-control uses, glaucoma for ophthalmic timolol, and other ordered indications.",
      mechanism: "Beta-1 blockade slows heart rate and lowers contractility/renin. Beta-2 blockade can constrict bronchial smooth muscle and blunt some metabolic warning responses to hypoglycemia.",
      nursingEssentials: ["Screen asthma/COPD/reactive airway disease, diabetes with hypoglycemia risk, bradycardia, hypotension, and peripheral perfusion concerns.", "Teach not to stop abruptly unless directed because rebound tachycardia/angina can occur."],
      nclexTraps: ["A client with wheezing after a nonselective beta blocker is not just anxious; beta-2 blockade can worsen bronchospasm."],
      classExampleNames: ["Propranolol", "Nadolol", "Timolol", "Pindolol"],
      classExampleKeys: ["propranolol", "nadolol", "timolol", "pindolol"],
      tags: ["nonselective beta blocker", "beta 2 blockade"]
    }),
    pharmSpecificClassCard({
      name: "Mixed alpha-1 and beta blockers",
      aliases: ["alpha beta blockers"],
      description: "Mixed alpha-1 and beta blockers combine beta blockade with alpha-1 vascular blockade. The beta effect slows the heart and decreases renin; the alpha-1 effect relaxes arteries and reduces systemic vascular resistance.",
      usedToTreat: "Hypertension, hypertensive emergencies for IV labetalol, heart failure for carvedilol, pregnancy-related hypertension for selected protocols, and other ordered indications.",
      mechanism: "Beta blockade lowers chronotropy/inotropy and renin. Alpha-1 blockade reduces vasoconstriction, which can improve afterload but also increases orthostatic hypotension risk.",
      nursingEssentials: ["Assess HR, BP, orthostatic symptoms, bronchospasm risk, heart failure status, and IV monitoring needs.", "Teach fall precautions and slow position changes when starting or titrating."],
      nclexTraps: ["Carvedilol/labetalol are not simply interchangeable with every beta blocker; alpha-1 blockade changes blood-pressure and orthostasis behavior."],
      classExampleNames: ["Carvedilol", "Labetalol"],
      classExampleKeys: ["carvedilol", "labetalol"],
      tags: ["alpha 1 blocker", "vasodilating beta blocker"]
    }),
    pharmSpecificClassCard({
      name: "Dihydropyridine calcium channel blockers",
      aliases: ["DHP calcium channel blockers"],
      description: "Dihydropyridine calcium channel blockers act mainly on vascular smooth muscle L-type calcium channels. They are thought of primarily as arterial vasodilators rather than AV-node blockers.",
      usedToTreat: "Hypertension, angina/vasospasm, hypertensive emergency for selected IV agents, and cerebral vasospasm prevention for nimodipine.",
      mechanism: "Blocking L-type calcium entry in vascular smooth muscle lowers intracellular calcium, relaxes arterioles, decreases afterload, and can trigger reflex tachycardia with shorter-acting agents.",
      nursingEssentials: ["Monitor blood pressure, edema, flushing, headache, dizziness, reflex tachycardia, and gum hyperplasia teaching where relevant.", "Differentiate from diltiazem/verapamil: DHP drugs do not provide the same AV-node rate-control effect."],
      nclexTraps: ["Do not use the calcium-channel-blocker label alone. DHP means vascular dilation; non-DHP means AV-node and contractility effects."],
      classExampleNames: ["Amlodipine", "Nifedipine", "Nicardipine", "Clevidipine", "Felodipine", "Nimodipine"],
      classExampleKeys: ["amlodipine", "nifedipine", "nicardipine", "clevidipine", "felodipine", "nimodipine"],
      tags: ["dihydropyridine", "vascular smooth muscle"]
    }),
    pharmSpecificClassCard({
      name: "Non-dihydropyridine calcium channel blockers",
      aliases: ["non-DHP calcium channel blockers"],
      description: "Non-dihydropyridine calcium channel blockers act more strongly on the heart than DHP agents. They slow SA/AV nodal conduction and reduce contractility, so they are also class IV antiarrhythmics.",
      usedToTreat: "Rate control for selected supraventricular tachyarrhythmias, angina, hypertension, and other ordered cardiovascular indications.",
      mechanism: "L-type calcium-channel blockade in AV nodal tissue slows phase 0 depolarization in nodal cells, prolongs AV nodal conduction, and decreases ventricular response in AV-node-dependent rhythms. Myocardial calcium reduction also lowers contractility.",
      nursingEssentials: ["Assess HR, BP, rhythm, AV block, heart failure with reduced ejection fraction cautions, constipation with verapamil, and additive bradycardia with beta blockers/digoxin.", "Link the mechanism to the hold concern: too much AV-node suppression can produce bradycardia or heart block."],
      nclexTraps: ["Diltiazem/verapamil are not interchangeable with amlodipine for rate control teaching."],
      classExampleNames: ["Diltiazem", "Verapamil"],
      classExampleKeys: ["diltiazem", "verapamil"],
      tags: ["non dihydropyridine", "class iv antiarrhythmic", "av node"]
    }),
    pharmSpecificClassCard({
      name: "Direct oral factor Xa inhibitors",
      aliases: ["factor Xa inhibitor DOACs"],
      description: "Direct oral factor Xa inhibitors are anticoagulants that directly inhibit activated factor X, reducing thrombin generation and fibrin clot formation without routine INR titration.",
      usedToTreat: "Atrial fibrillation stroke prevention, venous thromboembolism treatment/prevention, and other ordered thromboembolic indications depending on the drug.",
      mechanism: "Factor Xa sits at the convergence of intrinsic and extrinsic coagulation pathways. Inhibiting Xa lowers conversion of prothrombin to thrombin, so less fibrin is generated and clot propagation slows.",
      nursingEssentials: ["Assess bleeding, renal/hepatic function considerations, adherence, peri-procedure hold instructions, drug interactions, and reversal/urgent bleeding policy.", "No routine INR monitoring does not mean no monitoring; trend CBC, renal function, bleeding, and adherence."],
      nclexTraps: ["Do not use warfarin teaching for DOACs. INR diet teaching is not the anchor; bleeding, adherence, renal function, and interaction review are."],
      classExampleNames: ["Apixaban", "Rivaroxaban", "Edoxaban"],
      classExampleKeys: ["apixaban", "rivaroxaban", "edoxaban"],
      tags: ["factor xa", "doac", "anticoagulant"]
    }),
    pharmSpecificClassCard({
      name: "Direct thrombin inhibitors",
      aliases: ["factor IIa inhibitors"],
      description: "Direct thrombin inhibitors block thrombin, also called factor IIa, which is the enzyme that turns fibrinogen into fibrin and activates several amplification steps in clotting.",
      usedToTreat: "Atrial fibrillation stroke prevention, venous thromboembolism treatment/prevention, heparin-induced thrombocytopenia contexts for selected parenteral agents, and other ordered indications.",
      mechanism: "By directly inhibiting thrombin, these drugs reduce fibrin formation and thrombin-driven platelet/coagulation amplification. Dabigatran is the key oral example in ANI's core deck.",
      nursingEssentials: ["Monitor bleeding, renal function for dabigatran, adherence, peri-procedure instructions, and reversal/urgent bleeding policy.", "Know the target difference: factor Xa inhibitors reduce thrombin generation; direct thrombin inhibitors block thrombin itself."],
      nclexTraps: ["Dabigatran is a DOAC but not a factor Xa inhibitor."],
      classExampleNames: ["Dabigatran"],
      classExampleKeys: ["dabigatran"],
      tags: ["direct thrombin", "factor iia"]
    }),
    pharmSpecificClassCard({
      name: "Vitamin K antagonist anticoagulants",
      aliases: ["warfarin class anticoagulants"],
      description: "Vitamin K antagonists reduce hepatic activation of vitamin K dependent clotting factors. They are slower-onset anticoagulants that require INR monitoring and careful interaction teaching.",
      usedToTreat: "Atrial fibrillation stroke prevention, venous thromboembolism treatment/prevention, mechanical heart valves, and other ordered thromboembolic indications.",
      mechanism: "Warfarin inhibits vitamin K epoxide reductase, so the liver cannot fully gamma-carboxylate factors II, VII, IX, X and proteins C/S. Existing clotting factors must decay before full anticoagulant effect appears.",
      nursingEssentials: ["Monitor INR, bleeding, diet consistency with vitamin K foods, pregnancy contraindication concerns, drug/herbal interactions, and bridging instructions when ordered.", "Remember protein C/S reduction early in therapy explains why bridging may be needed for high-risk starts."],
      nclexTraps: ["Warfarin is not adjusted by aPTT; INR is the key monitoring anchor."],
      classExampleNames: ["Warfarin"],
      classExampleKeys: ["warfarin"],
      tags: ["vitamin k", "inr"]
    }),
    pharmSpecificClassCard({
      name: "P2Y12 receptor inhibitor antiplatelets",
      aliases: ["ADP receptor antiplatelets"],
      description: "P2Y12 inhibitors prevent ADP-mediated platelet activation and aggregation. They are central antiplatelet drugs in acute coronary syndrome and stent-related therapy plans.",
      usedToTreat: "Acute coronary syndrome, post-stent dual antiplatelet therapy, stroke/TIA prevention for selected clients, and other ordered atherothrombotic indications.",
      mechanism: "ADP normally binds platelet P2Y12 receptors, amplifying platelet activation and GP IIb/IIIa expression. Blocking P2Y12 reduces platelet aggregation and clot growth on injured plaque or stents.",
      nursingEssentials: ["Assess bleeding, planned surgery/procedures, adherence after stent placement, aspirin combination therapy, and drug-specific contraindications.", "Teach not to stop after stent placement unless the prescriber gives a clear plan, because thrombosis risk can be catastrophic."],
      nclexTraps: ["Antiplatelet does not equal anticoagulant. These drugs affect platelet signaling, not the coagulation cascade factors directly."],
      classExampleNames: ["Clopidogrel", "Prasugrel", "Ticagrelor"],
      classExampleKeys: ["clopidogrel", "prasugrel", "ticagrelor"],
      tags: ["p2y12", "adp receptor"]
    }),
    pharmSpecificClassCard({
      name: "Rapid-acting prandial insulin analogs",
      aliases: ["rapid acting insulins"],
      description: "Rapid-acting insulin analogs are designed for mealtime glucose coverage. They enter the bloodstream quickly and should be coordinated closely with carbohydrate intake and blood glucose checks.",
      usedToTreat: "Mealtime hyperglycemia, correction dosing, insulin pump therapy, and diabetic ketoacidosis protocols for selected rapid analogs when ordered by facility policy.",
      mechanism: "Insulin receptor activation moves glucose into skeletal muscle and adipose tissue through GLUT4 translocation, suppresses hepatic glucose production, and shifts potassium into cells. Rapid analog structure reduces self-association so absorption is faster.",
      nursingEssentials: ["Match timing to meals, current glucose, correction scale, and hypoglycemia risk. Hold/clarify when the meal is delayed or the client cannot eat unless protocol says otherwise.", "Teach peak-risk thinking: hypoglycemia can occur when insulin action outlasts food absorption."],
      nclexTraps: ["Do not give rapid-acting insulin and then discover the tray is unavailable."],
      classExampleNames: ["Insulin lispro", "Insulin aspart", "Insulin glulisine"],
      classExampleKeys: ["insulin lispro", "insulin aspart", "insulin glulisine"],
      tags: ["rapid acting insulin", "prandial insulin"]
    }),
    pharmSpecificClassCard({
      name: "Long-acting basal insulin analogs",
      aliases: ["basal insulins"],
      description: "Long-acting basal insulin analogs provide background insulin coverage between meals and overnight. They are not designed to correct a single meal spike.",
      usedToTreat: "Basal insulin replacement in type 1 diabetes and basal support in type 2 diabetes or inpatient insulin regimens when ordered.",
      mechanism: "These analogs slow absorption or prolong receptor exposure so insulin signaling is flatter and longer. The goal is steady suppression of hepatic glucose output and background glucose uptake support.",
      nursingEssentials: ["Give consistently as ordered even when NPO unless the prescriber/protocol changes the plan, because basal insulin prevents ketosis and fasting hyperglycemia.", "Monitor fasting glucose trends and hypoglycemia, especially with renal impairment, poor intake, or dose changes."],
      nclexTraps: ["Basal insulin is not the same job as rapid mealtime insulin. Do not use basal insulin as a quick correction tool."],
      classExampleNames: ["Insulin glargine", "Insulin detemir", "Insulin degludec"],
      classExampleKeys: ["insulin glargine", "insulin detemir", "insulin degludec"],
      tags: ["long acting insulin", "basal insulin"]
    }),
    pharmSpecificClassCard({
      name: "GLP-1 receptor agonists",
      aliases: ["GLP-1 agonists"],
      description: "GLP-1 receptor agonists are incretin-pathway medications that amplify glucose-dependent insulin release, suppress glucagon, slow gastric emptying, and increase satiety.",
      usedToTreat: "Type 2 diabetes, chronic weight management for selected products, and cardiovascular/renal risk reduction indications for selected agents depending on the label.",
      mechanism: "GLP-1 receptor activation in pancreatic beta cells enhances insulin when glucose is elevated, while alpha-cell glucagon suppression lowers hepatic glucose output. CNS and gastric effects contribute to reduced intake and delayed absorption.",
      nursingEssentials: ["Monitor nausea/vomiting, dehydration, hypoglycemia when combined with insulin/sulfonylureas, pancreatitis symptoms, gallbladder symptoms, kidney injury from volume depletion, and peri-procedure gastric-emptying guidance.", "Teach that glucose-dependent insulin release lowers hypoglycemia risk alone but not when paired with insulin secretagogues or insulin."],
      nclexTraps: ["Do not reduce these drugs to appetite suppressants; the incretin physiology explains both benefit and GI safety concerns."],
      classExampleNames: ["Semaglutide", "Liraglutide", "Dulaglutide", "Exenatide"],
      classExampleKeys: ["semaglutide", "liraglutide", "dulaglutide", "exenatide"],
      tags: ["glp 1", "incretin"]
    }),
    pharmSpecificClassCard({
      name: "SGLT2 inhibitors",
      aliases: ["sodium glucose cotransporter 2 inhibitors"],
      description: "SGLT2 inhibitors lower glucose by making the kidney excrete more glucose in urine. Their renal and heart-failure benefits make the class broader than a glucose-only drug group.",
      usedToTreat: "Type 2 diabetes, heart failure, chronic kidney disease, and cardiovascular/renal risk reduction indications for selected agents depending on the label.",
      mechanism: "SGLT2 blockade in the proximal tubule reduces glucose and sodium reabsorption. Glucosuria lowers plasma glucose; natriuresis and tubuloglomerular feedback effects contribute to blood-pressure, heart-failure, and kidney outcomes.",
      nursingEssentials: ["Teach genital/urinary infection symptoms, hydration, sick-day/perioperative hold instructions, euglycemic ketoacidosis symptoms, volume depletion, and renal function monitoring.", "Check whether the drug is being used for diabetes, heart failure, CKD, or more than one reason."],
      nclexTraps: ["Ketoacidosis can occur with only modest glucose elevation. Do not wait for extreme hyperglycemia if symptoms fit."],
      classExampleNames: ["Empagliflozin", "Dapagliflozin", "Canagliflozin"],
      classExampleKeys: ["empagliflozin", "dapagliflozin", "canagliflozin"],
      tags: ["sglt2", "euglycemic dka"]
    }),
    pharmSpecificClassCard({
      name: "SABA bronchodilators",
      aliases: ["short acting beta 2 agonists"],
      description: "Short-acting beta-2 agonists are rapid relief bronchodilators. They relax airway smooth muscle quickly and are used for acute bronchospasm symptoms.",
      usedToTreat: "Acute bronchospasm in asthma/COPD, exercise-induced bronchospasm prevention for selected use, and other ordered rescue bronchodilator indications.",
      mechanism: "Beta-2 receptor stimulation activates adenylate cyclase, raises cAMP, lowers smooth-muscle contractile activity, and opens airways. Systemic beta effects explain tremor, tachycardia, and hypokalemia risk.",
      nursingEssentials: ["Assess respiratory effort, lung sounds, oxygenation, heart rate, tremor, potassium risk in high-dose treatment, and whether frequent rescue use signals poor control.", "Teach rescue versus controller difference."],
      nclexTraps: ["Needing albuterol repeatedly is a control warning, not proof that the regimen is adequate."],
      classExampleNames: ["Albuterol", "Levalbuterol"],
      classExampleKeys: ["albuterol", "levalbuterol"],
      tags: ["saba", "rescue inhaler"]
    }),
    pharmSpecificClassCard({
      name: "LABA bronchodilators",
      aliases: ["long acting beta 2 agonists"],
      description: "Long-acting beta-2 agonists provide prolonged bronchodilation. In asthma, LABAs are used with anti-inflammatory controller therapy rather than alone.",
      usedToTreat: "Maintenance bronchodilation in COPD and asthma controller regimens when combined appropriately, depending on product and indication.",
      mechanism: "Sustained beta-2 receptor stimulation keeps cAMP higher in airway smooth muscle for prolonged relaxation. The long duration supports maintenance control but is not ideal as a sole rescue strategy.",
      nursingEssentials: ["Check whether the client also has inhaled corticosteroid therapy when used for asthma, and teach maintenance versus rescue roles.", "Monitor tremor, palpitations, paradoxical bronchospasm, and overuse."],
      nclexTraps: ["A LABA is not the same as a rescue SABA; do not teach salmeterol as quick rescue therapy."],
      classExampleNames: ["Salmeterol", "Formoterol"],
      classExampleKeys: ["salmeterol", "formoterol"],
      tags: ["laba", "maintenance bronchodilator"]
    }),
    pharmSpecificClassCard({
      name: "SAMA bronchodilators",
      aliases: ["short acting muscarinic antagonists"],
      description: "Short-acting muscarinic antagonists block acetylcholine-driven bronchoconstriction for short-term bronchodilation, especially useful in COPD and some acute exacerbation regimens.",
      usedToTreat: "COPD bronchospasm, acute exacerbation bronchodilator combinations, and selected asthma exacerbation protocols when ordered.",
      mechanism: "Muscarinic M3 blockade in bronchial smooth muscle reduces vagal-mediated bronchoconstriction and mucus-related airway narrowing. Because it is anticholinergic, dry mouth and urinary retention/glaucoma cautions matter.",
      nursingEssentials: ["Assess anticholinergic burden, urinary retention/BPH, glaucoma cautions, dry mouth, and nebulizer mask eye exposure.", "Differentiate it from beta agonists: SAMA blocks acetylcholine; SABA stimulates beta-2 receptors."],
      nclexTraps: ["Do not call ipratropium a steroid or beta agonist. It is an antimuscarinic bronchodilator."],
      classExampleNames: ["Ipratropium"],
      classExampleKeys: ["ipratropium"],
      tags: ["sama", "antimuscarinic"]
    }),
    pharmSpecificClassCard({
      name: "LAMA bronchodilators",
      aliases: ["long acting muscarinic antagonists"],
      description: "Long-acting muscarinic antagonists provide sustained blockade of acetylcholine-mediated bronchoconstriction and are core maintenance bronchodilators in COPD.",
      usedToTreat: "Maintenance COPD therapy, asthma add-on therapy for selected products/clients, and other ordered chronic airway indications.",
      mechanism: "Longer M3 receptor antagonism reduces vagal bronchoconstrictor tone across the dosing interval. This improves airflow and exacerbation risk in selected COPD regimens without providing immediate rescue relief.",
      nursingEssentials: ["Teach maintenance use, dry mouth management, urinary retention warning signs, glaucoma eye exposure precautions for mist/nebulized products, and rescue inhaler availability.", "Assess inhaler technique and whether the patient confuses maintenance and rescue devices."],
      nclexTraps: ["A LAMA is long-acting maintenance therapy; it is not the first tool for sudden severe bronchospasm relief."],
      classExampleNames: ["Tiotropium", "Umeclidinium"],
      classExampleKeys: ["tiotropium", "umeclidinium"],
      tags: ["lama", "antimuscarinic"]
    }),
    pharmSpecificClassCard({
      name: "Depolarizing neuromuscular blockers",
      aliases: ["depolarizing paralytics"],
      description: "Depolarizing neuromuscular blockers activate nicotinic receptors at the neuromuscular junction and keep the motor endplate depolarized, producing fasciculations followed by paralysis.",
      usedToTreat: "Rapid sequence intubation and short procedures when ordered, with full airway/ventilation support.",
      mechanism: "Succinylcholine mimics acetylcholine at nicotinic receptors. Persistent depolarization prevents repolarization and blocks new neuromuscular transmission until the drug is hydrolyzed, so skeletal muscles cannot contract.",
      nursingEssentials: ["Paralysis does not equal sedation or analgesia. Confirm airway support, oxygenation/ventilation, sedation/analgesia plan, potassium risk, malignant hyperthermia risk, and bradycardia precautions.", "Watch hyperkalemia risk in burns, crush injury, neuromuscular disease, denervation, and prolonged immobility contexts."],
      nclexTraps: ["A paralyzed patient can still be awake and in pain if sedation/analgesia is inadequate."],
      classExampleNames: ["Succinylcholine"],
      classExampleKeys: ["succinylcholine"],
      tags: ["depolarizing neuromuscular blocker", "paralytic"]
    }),
    pharmSpecificClassCard({
      name: "Nondepolarizing neuromuscular blockers",
      aliases: ["competitive neuromuscular blockers"],
      description: "Nondepolarizing neuromuscular blockers competitively block nicotinic acetylcholine receptors at the neuromuscular junction, preventing skeletal muscle contraction without depolarizing the endplate.",
      usedToTreat: "Intubation, mechanical ventilation synchrony, surgery, and procedural paralysis when ordered with airway and sedation/analgesia support.",
      mechanism: "Competitive nicotinic receptor antagonism stops acetylcholine from triggering endplate depolarization. Paralysis continues until the drug redistributes/metabolizes or is reversed depending on the agent and protocol.",
      nursingEssentials: ["Confirm sedation/analgesia, ventilator support, eye care, DVT/skin precautions, train-of-four or ordered paralysis monitoring, and reversal plan.", "Know elimination differences: cisatracurium is useful in organ dysfunction because Hofmann elimination is less kidney/liver dependent."],
      nclexTraps: ["Neuromuscular blockers do not treat pain, anxiety, or awareness."],
      classExampleNames: ["Rocuronium", "Vecuronium", "Cisatracurium"],
      classExampleKeys: ["rocuronium", "vecuronium", "cisatracurium"],
      tags: ["nondepolarizing neuromuscular blocker", "paralytic"]
    }),
    pharmSpecificClassCard({
      name: "Cephalosporin antibiotic generations",
      aliases: ["cephalosporin generations"],
      description: "Cephalosporins are beta-lactam antibiotics organized partly by generation. The generation pattern helps learners predict gram-positive, gram-negative, CNS, antipseudomonal, and MRSA coverage tendencies, though local susceptibility and the exact drug always matter.",
      usedToTreat: "Skin/soft tissue, respiratory, urinary, intra-abdominal, bone/joint, meningitis, sepsis, surgical prophylaxis, and other infections when organism, site, and susceptibility fit the selected cephalosporin.",
      mechanism: "Cephalosporins bind penicillin-binding proteins and inhibit bacterial peptidoglycan cross-linking, weakening the cell wall and causing bacterial lysis. Generation differences come from side-chain chemistry that changes beta-lactamase stability and target penetration.",
      nursingEssentials: ["Do not treat all cephalosporins as identical. Cefazolin/cephalexin lean gram-positive; ceftriaxone is broad third generation; ceftazidime/cefepime add antipseudomonal emphasis; ceftaroline adds MRSA activity.", "Assess beta-lactam allergy history, renal dosing needs, culture data, C. difficile risk, and site penetration."],
      nclexTraps: ["A cephalosporin generation is a study map, not a substitute for culture/susceptibility and local antibiogram data."],
      classExampleNames: ["Cefazolin", "Cephalexin", "Cefuroxime", "Ceftriaxone", "Ceftazidime", "Cefepime", "Ceftaroline"],
      classExampleKeys: ["cefazolin", "cephalexin", "cefuroxime", "ceftriaxone", "ceftazidime", "cefepime", "ceftaroline"],
      tags: ["cephalosporin", "beta lactam", "antibiotic generations"]
    }),
    pharmSpecificClassCard({
      name: "Oxazolidinone antibiotics",
      aliases: ["linezolid class antibiotics"],
      description: "Oxazolidinones are protein-synthesis inhibitors with important gram-positive activity, including MRSA and VRE coverage for selected infections.",
      usedToTreat: "Selected gram-positive infections such as pneumonia, skin/soft tissue infection, and VRE infections when ordered and susceptibility fits.",
      mechanism: "Linezolid binds the 50S ribosomal subunit and blocks formation of the initiation complex, stopping bacterial protein synthesis early. Its MAOI-like activity explains serotonin-syndrome and tyramine/BP interaction teaching.",
      nursingEssentials: ["Monitor CBC for thrombocytopenia/myelosuppression, neuropathy with longer courses, lactic acidosis symptoms, serotonergic medications, and culture/susceptibility data.", "Teach serotonin syndrome warning signs when combined with SSRIs/SNRIs/MAOIs or other serotonergic drugs."],
      nclexTraps: ["Linezolid is not just 'another antibiotic'; serotonin interaction and CBC monitoring are defining safety details."],
      classExampleNames: ["Linezolid"],
      classExampleKeys: ["linezolid"],
      tags: ["oxazolidinone", "50s ribosomal inhibitor", "mrsa", "vre"]
    }),

    pharmSpecificDrug("Adalimumab", "TNF-alpha inhibitor biologic", ["Biologic/targeted therapy", "Immunology biologic", "TNF-alpha inhibitor"], ["tnf inhibitor", "serious infection boxed warning", "tb screening"]),
    pharmSpecificDrug("Infliximab", "TNF-alpha inhibitor biologic", ["Biologic/targeted therapy", "Immunology biologic", "TNF-alpha inhibitor", "Infusion biologic"], ["tnf inhibitor", "serious infection boxed warning", "tb screening", "infusion reaction"]),
    pharmSpecificDrug("Etanercept", "TNF-alpha inhibitor biologic", ["Biologic/targeted therapy", "Immunology biologic", "TNF-alpha inhibitor"], ["tnf inhibitor", "serious infection boxed warning", "tb screening"]),
    pharmSpecificDrug("Pembrolizumab", "PD-1 immune checkpoint inhibitor monoclonal antibody", ["Biologic/targeted therapy", "Oncology biologic", "Immune checkpoint inhibitor", "PD-1 inhibitor"], ["pd 1 inhibitor", "immune mediated adverse reactions", "oncology immunotherapy"]),
    pharmSpecificDrug("Nivolumab", "PD-1 immune checkpoint inhibitor monoclonal antibody", ["Biologic/targeted therapy", "Oncology biologic", "Immune checkpoint inhibitor", "PD-1 inhibitor"], ["pd 1 inhibitor", "immune mediated adverse reactions", "oncology immunotherapy"]),
    pharmSpecificDrug("Ipilimumab", "CTLA-4 immune checkpoint inhibitor monoclonal antibody", ["Biologic/targeted therapy", "Oncology biologic", "Immune checkpoint inhibitor", "CTLA-4 inhibitor"], ["ctla 4 inhibitor", "immune mediated adverse reactions", "oncology immunotherapy"]),
    pharmSpecificDrug("Atezolizumab", "PD-L1 immune checkpoint inhibitor monoclonal antibody", ["Biologic/targeted therapy", "Oncology biologic", "Immune checkpoint inhibitor", "PD-L1 inhibitor"], ["pd l1 inhibitor", "immune mediated adverse reactions", "oncology immunotherapy"]),
    pharmSpecificDrug("Durvalumab", "PD-L1 immune checkpoint inhibitor monoclonal antibody", ["Biologic/targeted therapy", "Oncology biologic", "Immune checkpoint inhibitor", "PD-L1 inhibitor"], ["pd l1 inhibitor", "immune mediated adverse reactions", "oncology immunotherapy"]),
    pharmSpecificDrug("Trastuzumab", "HER2-directed monoclonal antibody", ["Biologic/targeted therapy", "Oncology biologic", "HER2-directed antibody"], ["her2 antibody", "cardiomyopathy boxed warning", "lvef monitoring"]),
    pharmSpecificDrug("Pertuzumab", "HER2-directed monoclonal antibody", ["Biologic/targeted therapy", "Oncology biologic", "HER2-directed antibody"], ["her2 antibody", "cardiomyopathy", "lvef monitoring"]),
    pharmSpecificDrug("Bevacizumab", "VEGF-pathway inhibitor monoclonal antibody", ["Biologic/targeted therapy", "Oncology biologic", "VEGF-pathway inhibitor"], ["vegf inhibitor", "gi perforation boxed warning", "wound healing", "hemorrhage"]),
    pharmSpecificDrug("Rituximab", "CD20-directed monoclonal antibody", ["Biologic/targeted therapy", "Oncology/immune biologic", "CD20-directed antibody"], ["cd20 antibody", "hepatitis b reactivation", "pml", "infusion reaction"]),
    pharmSpecificDrug("Imatinib", "BCR-ABL tyrosine kinase inhibitor", ["Oncology/targeted therapy", "Kinase inhibitor", "BCR-ABL tyrosine kinase inhibitor"], ["bcr abl inhibitor", "bcr abl tki", "tyrosine kinase inhibitor", "cml targeted therapy"]),
    pharmSpecificDrug("Dasatinib", "BCR-ABL tyrosine kinase inhibitor", ["Oncology/targeted therapy", "Kinase inhibitor", "BCR-ABL tyrosine kinase inhibitor"], ["bcr abl inhibitor", "bcr abl tki", "tyrosine kinase inhibitor", "cml targeted therapy", "pleural effusion"]),
    pharmSpecificDrug("Nilotinib", "BCR-ABL tyrosine kinase inhibitor", ["Oncology/targeted therapy", "Kinase inhibitor", "BCR-ABL tyrosine kinase inhibitor"], ["bcr abl inhibitor", "bcr abl tki", "tyrosine kinase inhibitor", "cml targeted therapy", "qt warning"]),
    pharmSpecificDrug("Erlotinib", "EGFR tyrosine kinase inhibitor", ["Oncology/targeted therapy", "Kinase inhibitor", "EGFR tyrosine kinase inhibitor"], ["egfr inhibitor", "egfr tki", "tyrosine kinase inhibitor", "rash diarrhea"]),
    pharmSpecificDrug("Gefitinib", "EGFR tyrosine kinase inhibitor", ["Oncology/targeted therapy", "Kinase inhibitor", "EGFR tyrosine kinase inhibitor"], ["egfr inhibitor", "egfr tki", "tyrosine kinase inhibitor", "rash diarrhea"]),
    pharmSpecificDrug("Osimertinib", "EGFR tyrosine kinase inhibitor", ["Oncology/targeted therapy", "Kinase inhibitor", "EGFR tyrosine kinase inhibitor", "T790M/EGFR-mutated NSCLC therapy"], ["egfr inhibitor", "egfr tki", "tyrosine kinase inhibitor", "qt", "cardiomyopathy", "interstitial lung disease"]),
    pharmSpecificDrug("Ibrutinib", "BTK inhibitor targeted therapy", ["Oncology/targeted therapy", "Kinase inhibitor", "BTK inhibitor"], ["btk inhibitor", "bleeding", "atrial fibrillation"]),
    pharmSpecificDrug("Acalabrutinib", "BTK inhibitor targeted therapy", ["Oncology/targeted therapy", "Kinase inhibitor", "BTK inhibitor"], ["btk inhibitor", "bleeding", "atrial fibrillation"]),
    pharmSpecificDrug("Palbociclib", "CDK4/6 inhibitor targeted therapy", ["Oncology/targeted therapy", "Cell-cycle inhibitor", "CDK4/6 inhibitor"], ["cdk4 6 inhibitor", "neutropenia", "breast cancer"], {
      usedToTreat: "Hormone receptor-positive, HER2-negative advanced or metastatic breast cancer in combination endocrine regimens when ordered.",
      mechanism: "Palbociclib inhibits cyclin-dependent kinases 4 and 6, keeping retinoblastoma protein active and slowing G1-to-S cell-cycle progression in susceptible tumor cells.",
      boxedWarning: "High-alert warning: CDK4/6 inhibitors can cause clinically important neutropenia and serious infection risk; monitor CBC by cycle and hold/reduce per oncology protocol.",
      sourceNote: "Upgraded subclass-specific oncology card. Verify regimen, cycle timing, lab hold parameters, and current oncology protocol for clinical use.",
      keyLabs: ["CBC with ANC and platelets", "Liver function as ordered", "Pregnancy status when relevant"],
      nclexTraps: ["Oral targeted breast-cancer therapy can still cause serious neutropenia."]
    }),
    pharmSpecificDrug("Ribociclib", "CDK4/6 inhibitor targeted therapy", ["Oncology/targeted therapy", "Cell-cycle inhibitor", "CDK4/6 inhibitor"], ["cdk4 6 inhibitor", "neutropenia", "qt prolongation"], {
      usedToTreat: "Hormone receptor-positive, HER2-negative advanced or metastatic breast cancer in combination endocrine regimens when ordered.",
      mechanism: "Ribociclib inhibits CDK4/6, reducing cell-cycle progression through the G1/S checkpoint. QT prolongation and hepatotoxicity monitoring distinguish it from some classmates.",
      boxedWarning: "High-alert warning: ribociclib can cause neutropenia, hepatobiliary toxicity, QT prolongation, interstitial lung disease/pneumonitis, and embryo-fetal harm.",
      sourceNote: "Upgraded subclass-specific oncology card. Verify ECG/electrolyte schedule, liver tests, cycle timing, and oncology hold parameters.",
      keyLabs: ["CBC with ANC", "Liver function tests", "ECG/QTc and potassium/magnesium/calcium when ordered"],
      nclexTraps: ["CDK4/6 inhibitor does not mean identical monitoring. Ribociclib adds QT emphasis."]
    }),
    pharmSpecificDrug("Abemaciclib", "CDK4/6 inhibitor targeted therapy", ["Oncology/targeted therapy", "Cell-cycle inhibitor", "CDK4/6 inhibitor"], ["cdk4 6 inhibitor", "diarrhea", "neutropenia"], {
      usedToTreat: "Hormone receptor-positive, HER2-negative breast cancer regimens when ordered, including selected high-risk early or advanced/metastatic settings.",
      mechanism: "Abemaciclib inhibits CDK4/6 to slow cell-cycle progression; compared with palbociclib/ribociclib, diarrhea and VTE monitoring are especially prominent.",
      boxedWarning: "High-alert warning: abemaciclib can cause severe diarrhea/dehydration, neutropenia/infection, hepatotoxicity, venous thromboembolism, interstitial lung disease/pneumonitis, and embryo-fetal harm.",
      sourceNote: "Upgraded subclass-specific oncology card. Verify diarrhea plan, CBC/LFT schedule, VTE risk, and oncology hold parameters.",
      keyLabs: ["CBC with ANC", "Liver function tests", "Hydration/electrolyte assessment if diarrhea occurs"],
      nclexTraps: ["Severe diarrhea on abemaciclib is an early escalation issue because dehydration and kidney injury can follow."]
    }),

    pharmSpecificDrug("Amoxicillin", "Aminopenicillin beta-lactam antibiotic", ["Anti-infective medication", "Beta-lactam pathway", "Penicillin subclass", "Aminopenicillin"], ["aminopenicillin", "beta lactam", "cell wall synthesis"]),
    pharmSpecificDrug("Ampicillin", "Aminopenicillin beta-lactam antibiotic", ["Anti-infective medication", "Beta-lactam pathway", "Penicillin subclass", "Aminopenicillin"], ["aminopenicillin", "beta lactam", "cell wall synthesis"]),
    pharmSpecificDrug("Piperacillin", "Extended-spectrum antipseudomonal penicillin beta-lactam antibiotic", ["Anti-infective medication", "Beta-lactam pathway", "Penicillin subclass", "Antipseudomonal ureidopenicillin"], ["antipseudomonal penicillin", "beta lactam", "piperacillin tazobactam"]),
    pharmSpecificDrug("Tazobactam", "Beta-lactamase inhibitor", ["Anti-infective medication", "Beta-lactam pathway", "Beta-lactamase inhibitor"], ["beta lactamase inhibitor", "piperacillin tazobactam"]),
    pharmSpecificDrug("Meropenem", "Carbapenem beta-lactam antibiotic", ["Anti-infective medication", "Beta-lactam pathway", "Carbapenem subclass"], ["carbapenem", "broad spectrum beta lactam"]),
    pharmSpecificDrug("Imipenem", "Carbapenem beta-lactam antibiotic", ["Anti-infective medication", "Beta-lactam pathway", "Carbapenem subclass"], ["carbapenem", "cilastatin", "seizure risk"]),
    pharmSpecificDrug("Ertapenem", "Carbapenem beta-lactam antibiotic", ["Anti-infective medication", "Beta-lactam pathway", "Carbapenem subclass"], ["carbapenem", "broad spectrum beta lactam"]),
    pharmSpecificDrug("Aztreonam", "Monobactam beta-lactam antibiotic", ["Anti-infective medication", "Beta-lactam pathway", "Monobactam subclass"], ["monobactam", "gram negative aerobic coverage"]),
    pharmSpecificDrug("Ciprofloxacin", "Fluoroquinolone antibiotic; DNA gyrase/topoisomerase inhibitor", ["Anti-infective medication", "Fluoroquinolone DNA-gyrase/topoisomerase inhibitor"], ["fluoroquinolone boxed warning", "tendon rupture", "peripheral neuropathy", "myasthenia gravis"]),
    pharmSpecificDrug("Levofloxacin", "Fluoroquinolone antibiotic; DNA gyrase/topoisomerase inhibitor", ["Anti-infective medication", "Fluoroquinolone DNA-gyrase/topoisomerase inhibitor", "Respiratory fluoroquinolone"], ["fluoroquinolone boxed warning", "tendon rupture", "qt prolongation"]),
    pharmSpecificDrug("Moxifloxacin", "Fluoroquinolone antibiotic; DNA gyrase/topoisomerase inhibitor", ["Anti-infective medication", "Fluoroquinolone DNA-gyrase/topoisomerase inhibitor", "Respiratory fluoroquinolone"], ["fluoroquinolone boxed warning", "tendon rupture", "qt prolongation"]),
    pharmSpecificDrug("Azithromycin", "Macrolide 50S ribosomal inhibitor antibiotic", ["Anti-infective medication", "Protein synthesis inhibitor", "Macrolide 50S inhibitor"], ["macrolide", "qt prolongation", "atypical pneumonia"]),
    pharmSpecificDrug("Clarithromycin", "Macrolide 50S ribosomal inhibitor antibiotic", ["Anti-infective medication", "Protein synthesis inhibitor", "Macrolide 50S inhibitor"], ["macrolide", "cyp3a4 inhibitor", "qt prolongation"]),
    pharmSpecificDrug("Gentamicin", "Aminoglycoside 30S ribosomal inhibitor antibiotic", ["Anti-infective medication", "Protein synthesis inhibitor", "Aminoglycoside 30S inhibitor"], ["aminoglycoside boxed warning", "nephrotoxicity", "ototoxicity"]),
    pharmSpecificDrug("Tobramycin", "Aminoglycoside 30S ribosomal inhibitor antibiotic", ["Anti-infective medication", "Protein synthesis inhibitor", "Aminoglycoside 30S inhibitor"], ["aminoglycoside boxed warning", "nephrotoxicity", "ototoxicity"]),
    pharmSpecificDrug("Vancomycin", "Glycopeptide cell-wall inhibitor antibiotic", ["Anti-infective medication", "Cell-wall inhibitor", "Glycopeptide antibiotic"], ["glycopeptide", "mrsa", "trough", "kidney", "infusion reaction"]),
    pharmSpecificDrug("Daptomycin", "Lipopeptide membrane depolarizing antibiotic", ["Anti-infective medication", "Membrane-active antibiotic", "Lipopeptide"], ["lipopeptide", "ck monitoring", "myopathy"]),
    pharmSpecificDrug("Clindamycin", "Lincosamide 50S ribosomal inhibitor antibiotic", ["Anti-infective medication", "Protein synthesis inhibitor", "Lincosamide 50S inhibitor"], ["lincosamide boxed warning", "c difficile", "severe colitis"]),
    pharmSpecificDrug("Metronidazole", "Nitroimidazole anaerobic/antiprotozoal antimicrobial", ["Anti-infective medication", "Anaerobic antimicrobial", "Nitroimidazole DNA-damaging antimicrobial"], ["anaerobic coverage", "c difficile adjunct history", "disulfiram like reaction"]),
    pharmSpecificDrug("Fidaxomicin", "Narrow-spectrum macrocyclic antibiotic for C. difficile", ["Anti-infective medication", "C. difficile therapy", "Macrocyclic RNA-polymerase inhibitor"], ["c difficile", "fidaxomicin", "narrow spectrum"]),

    pharmSpecificClassCard({
      name: "TNF-alpha inhibitor biologics",
      aliases: ["TNF inhibitors", "anti-TNF biologics"],
      description: "TNF-alpha inhibitor biologics block tumor necrosis factor alpha, a cytokine that amplifies inflammatory cell recruitment, granuloma maintenance, fever/inflammation signaling, and tissue damage in autoimmune disease.",
      usedToTreat: "Rheumatoid arthritis, psoriatic arthritis, ankylosing spondylitis, inflammatory bowel disease for selected agents, plaque psoriasis, hidradenitis suppurativa, uveitis, and related immune-mediated diseases depending on the drug.",
      mechanism: "Binding TNF-alpha reduces TNF receptor signaling and downstream NF-kB-driven inflammatory cytokines. The same mechanism weakens granuloma defense, explaining tuberculosis and invasive fungal infection warnings.",
      nursingEssentials: ["Screen TB and hepatitis risk before therapy. Clarify active serious infection before giving.", "Teach fever, cough, night sweats, weight loss, nonhealing wounds, and unusual infections. Avoid live vaccines when applicable."],
      nclexTraps: ["Do not treat biologic fever as routine. Immunosuppressed infection can look subtle."],
      classExampleNames: ["Adalimumab", "Infliximab", "Etanercept"],
      classExampleKeys: ["adalimumab", "infliximab", "etanercept"],
      tags: ["tnf inhibitor", "biologic", "serious infection boxed warning"]
    }),
    pharmSpecificClassCard({
      name: "Immune checkpoint inhibitor monoclonal antibodies",
      aliases: ["checkpoint inhibitors", "immune checkpoint inhibitors", "checkpoint inhibitor immunotherapy"],
      description: "Checkpoint inhibitors remove inhibitory signals from T cells so the immune system can attack cancer more effectively. Their danger is the same biology: immune activation can inflame normal organs.",
      usedToTreat: "Melanoma, lung cancer, renal cell carcinoma, bladder cancer, head/neck cancer, MSI-high tumors, and many other oncology indications depending on marker and drug.",
      mechanism: "PD-1/PD-L1 blockade restores exhausted T-cell signaling in the tumor microenvironment. CTLA-4 blockade increases early T-cell activation. Immune-related adverse events can affect colon, lungs, liver, endocrine glands, kidneys, skin, heart, and nervous system.",
      nursingEssentials: ["Teach clients to report diarrhea, abdominal pain, cough/dyspnea, jaundice, severe fatigue, headache/vision changes, polyuria, rash, chest pain, weakness, or confusion early.", "Steroid/hold protocols are time-sensitive and diagnosis often depends on recognizing the drug class."],
      nclexTraps: ["Diarrhea on immunotherapy can be immune colitis, not just a GI side effect."],
      classExampleNames: ["Pembrolizumab", "Nivolumab", "Ipilimumab", "Atezolizumab", "Durvalumab"],
      classExampleKeys: ["pembrolizumab", "nivolumab", "ipilimumab", "atezolizumab", "durvalumab"],
      tags: ["oncology immunotherapy", "immune mediated adverse reactions"]
    }),
    pharmSpecificClassCard({
      name: "PD-1 checkpoint inhibitors",
      aliases: ["PD-1 inhibitors", "programmed death 1 inhibitors", "PD1 inhibitors"],
      description: "PD-1 checkpoint inhibitors block the PD-1 brake on activated T cells. This can restore antitumor T-cell activity, especially when a tumor is using PD-1 signaling to create immune exhaustion.",
      usedToTreat: "Melanoma, non-small cell lung cancer, renal cell carcinoma, Hodgkin lymphoma, MSI-high tumors, and many other oncology indications depending on biomarker, tumor type, line of therapy, and protocol.",
      mechanism: "PD-1 is an inhibitory receptor on T cells. When PD-1 binds PD-L1/PD-L2, T-cell receptor signaling is dampened. PD-1 monoclonal antibodies block that inhibitory receptor, increasing cytotoxic immune activity against tumor cells. The same release of immune restraint can inflame normal tissue, causing immune-mediated colitis, pneumonitis, hepatitis, endocrinopathies, nephritis, myocarditis, skin reactions, and neurologic toxicity.",
      nursingEssentials: ["Ask specifically about diarrhea, abdominal pain, cough, dyspnea, fatigue, headache, vision changes, polyuria, rash, jaundice, chest pain, palpitations, weakness, and confusion.", "Do not normalize delayed symptoms; immune-related adverse events can occur during therapy or after therapy is stopped."],
      nclexTraps: ["Diarrhea on pembrolizumab or nivolumab can be immune colitis. Treat it as a serious immune toxicity cue, not routine upset stomach."],
      classExampleNames: ["Pembrolizumab", "Nivolumab", "Cemiplimab", "Dostarlimab"],
      classExampleKeys: ["pembrolizumab", "nivolumab", "cemiplimab", "dostarlimab"],
      tags: ["pd 1", "checkpoint inhibitor", "oncology immunotherapy", "immune mediated adverse reactions"]
    }),
    pharmSpecificClassCard({
      name: "PD-L1 checkpoint inhibitors",
      aliases: ["PD-L1 inhibitors", "programmed death ligand 1 inhibitors", "PDL1 inhibitors"],
      description: "PD-L1 checkpoint inhibitors bind the ligand side of the PD-1/PD-L1 checkpoint. They prevent tumor or immune-cell PD-L1 from delivering an inhibitory signal to PD-1-positive T cells.",
      usedToTreat: "Lung cancer, urothelial carcinoma, renal cell carcinoma, hepatocellular carcinoma, and other oncology indications depending on drug, biomarker, and regimen.",
      mechanism: "PD-L1 blockade interrupts ligand-mediated PD-1 signaling, restoring T-cell activation in the tumor microenvironment. Because immune restraint is reduced, the nurse must watch for immune-mediated organ inflammation across GI, lung, liver, endocrine, kidney, skin, cardiac, and neurologic systems.",
      nursingEssentials: ["Trend respiratory symptoms, stool frequency, liver symptoms/labs when ordered, endocrine red flags, skin reactions, renal changes, and infusion reactions.", "Teach clients to report new inflammation symptoms early instead of waiting for the next oncology visit."],
      nclexTraps: ["PD-L1 drugs are not ordinary chemo. The urgent problem may be immune pneumonitis, colitis, hepatitis, endocrinopathy, myocarditis, or nephritis."],
      classExampleNames: ["Atezolizumab", "Durvalumab", "Avelumab"],
      classExampleKeys: ["atezolizumab", "durvalumab", "avelumab"],
      tags: ["pd l1", "checkpoint inhibitor", "oncology immunotherapy", "immune mediated adverse reactions"]
    }),
    pharmSpecificClassCard({
      name: "CTLA-4 checkpoint inhibitors",
      aliases: ["CTLA-4 inhibitors", "cytotoxic T-lymphocyte antigen 4 inhibitors"],
      description: "CTLA-4 checkpoint inhibitors act earlier in T-cell activation than PD-1/PD-L1 drugs. They enhance T-cell priming and expansion, which can deepen antitumor immunity but also increases immune-toxicity risk.",
      usedToTreat: "Melanoma, renal cell carcinoma, hepatocellular carcinoma, and combination immunotherapy regimens depending on oncology protocol.",
      mechanism: "CTLA-4 competes with CD28 for B7 costimulatory ligands on antigen-presenting cells. Blocking CTLA-4 shifts signaling toward T-cell activation and proliferation. Because this is a broad immune-activation step, immune-mediated colitis, hepatitis, endocrinopathies, dermatitis, pneumonitis, neurologic effects, and combination-therapy toxicity are high-yield concerns.",
      nursingEssentials: ["Assess stool frequency, abdominal pain, rash, liver symptoms/labs when ordered, endocrine symptoms, respiratory symptoms, neurologic changes, and combination immunotherapy toxicity.", "Escalate severe diarrhea, blood in stool, dyspnea, chest pain, confusion, severe headache, or jaundice quickly."],
      nclexTraps: ["Ipilimumab-related diarrhea is a red flag for immune colitis and can become life-threatening."],
      classExampleNames: ["Ipilimumab", "Tremelimumab"],
      classExampleKeys: ["ipilimumab", "tremelimumab"],
      tags: ["ctla 4", "checkpoint inhibitor", "oncology immunotherapy", "immune mediated adverse reactions"]
    }),
    pharmSpecificClassCard({
      name: "HER2-directed monoclonal antibodies",
      aliases: ["HER2 antibodies"],
      description: "HER2-directed antibodies target HER2-positive cancer signaling. They are powerful targeted agents, but cardiac monitoring is the signature nursing distinction.",
      usedToTreat: "HER2-positive breast cancer and other HER2-positive tumors depending on the product and regimen.",
      mechanism: "HER2 blockade interferes with receptor signaling that promotes tumor growth. Antibody-drug conjugates add cytotoxic payload delivery. HER2 signaling also matters in cardiac myocyte survival pathways, explaining cardiomyopathy risk.",
      nursingEssentials: ["Verify baseline/follow-up LVEF monitoring, pregnancy prevention, infusion reaction readiness, and dyspnea/edema/cough reporting.", "Anthracycline exposure increases the importance of cardiac surveillance."],
      nclexTraps: ["Targeted therapy can still be cardiotoxic."],
      classExampleNames: ["Trastuzumab", "Pertuzumab"],
      classExampleKeys: ["trastuzumab", "pertuzumab"],
      tags: ["her2", "lvef", "cardiomyopathy"]
    }),
    pharmSpecificClassCard({
      name: "VEGF-pathway inhibitor biologics",
      aliases: ["VEGF inhibitors", "anti-VEGF antibodies"],
      description: "VEGF-pathway inhibitors reduce angiogenesis signaling that tumors use for blood-vessel growth. That vascular mechanism explains bleeding, wound-healing, hypertension, proteinuria, and perforation concerns.",
      usedToTreat: "Colorectal, lung, renal, glioblastoma, gynecologic, and ophthalmic neovascular indications depending on the agent and route.",
      mechanism: "VEGF blockade decreases endothelial proliferation and new-vessel formation. Normal tissue repair and vascular integrity can be impaired, especially around surgery or fragile tumor/GI tissue.",
      nursingEssentials: ["Assess bleeding, abdominal pain, wound healing, recent/planned surgery, blood pressure, urine protein, thrombosis, and infusion reactions.", "Hold timing around surgery is a drug/protocol-specific safety issue."],
      nclexTraps: ["New severe abdominal pain on bevacizumab can be GI perforation until proven otherwise."],
      classExampleNames: ["Bevacizumab"],
      classExampleKeys: ["bevacizumab"],
      tags: ["vegf", "gi perforation", "wound healing"]
    }),
    pharmSpecificClassCard({
      name: "BCR-ABL tyrosine kinase inhibitors",
      aliases: ["BCR-ABL TKIs"],
      description: "BCR-ABL TKIs target the abnormal tyrosine kinase produced by the Philadelphia chromosome fusion protein, a driver in chronic myeloid leukemia and selected leukemias.",
      usedToTreat: "Chronic myeloid leukemia and Philadelphia chromosome-positive acute lymphoblastic leukemia depending on agent and mutation profile.",
      mechanism: "Blocking BCR-ABL kinase reduces downstream proliferative signaling. Different TKIs also hit other kinases, which explains fluid retention, cytopenias, QT/vascular events, pleural effusion, liver injury, and mutation-specific selection.",
      nursingEssentials: ["Monitor CBC, liver tests, fluid retention, dyspnea/pleural effusion, QT risk for selected agents, adherence, and interaction-heavy CYP3A4 medication lists.", "Do not stop targeted oral therapy casually; adherence drives disease control."],
      nclexTraps: ["The -tinib suffix is not enough. The target determines the toxicity pattern."],
      classExampleNames: ["Imatinib", "Dasatinib", "Nilotinib"],
      classExampleKeys: ["imatinib", "dasatinib", "nilotinib"],
      tags: ["bcr abl", "kinase inhibitor", "cml"]
    }),
    pharmSpecificClassCard({
      name: "EGFR tyrosine kinase inhibitors",
      aliases: ["EGFR TKIs"],
      description: "EGFR TKIs block epidermal growth factor receptor signaling in susceptible tumors. Skin and GI toxicity are mechanism-linked because EGFR is important in normal epithelium.",
      usedToTreat: "EGFR-mutated non-small cell lung cancer and selected other EGFR-driven tumors depending on mutation and drug.",
      mechanism: "EGFR kinase inhibition reduces downstream MAPK/PI3K growth signaling. On-target effects in skin and gut cause acneiform rash and diarrhea; lung inflammation, liver injury, QT/cardiomyopathy for selected agents, and ocular effects require monitoring.",
      nursingEssentials: ["Monitor rash severity, diarrhea/dehydration, cough/dyspnea for interstitial lung disease/pneumonitis, liver tests, QT risk for selected agents, and adherence.", "Teach early rash/diarrhea reporting; uncontrolled diarrhea can become dehydration and kidney injury."],
      nclexTraps: ["A rash with EGFR therapy often means on-target effect, but severe rash or infection still needs care."],
      classExampleNames: ["Erlotinib", "Gefitinib", "Osimertinib"],
      classExampleKeys: ["erlotinib", "gefitinib", "osimertinib"],
      tags: ["egfr", "targeted therapy", "rash diarrhea"]
    }),
    pharmSpecificClassCard({
      name: "BTK inhibitor targeted therapies",
      aliases: ["Bruton tyrosine kinase inhibitors"],
      description: "BTK inhibitors block B-cell receptor signaling used by several B-cell malignancies. Their signature clinical concerns include bleeding, atrial fibrillation, infection, cytopenias, and interactions.",
      usedToTreat: "Chronic lymphocytic leukemia, mantle cell lymphoma, Waldenstrom macroglobulinemia, and other B-cell malignancies depending on agent.",
      mechanism: "BTK inhibition disrupts B-cell survival and trafficking signals. Platelet signaling and immune effects explain bleeding and infection risks; off-target kinase effects contribute to atrial fibrillation and hypertension with some agents.",
      nursingEssentials: ["Assess bleeding, anticoagulant/antiplatelet use, procedure hold timing, infection, CBC, atrial fibrillation/palpitations, blood pressure, and CYP3A interactions.", "Teach to report black stools, unusual bruising, palpitations, fever, or severe diarrhea."],
      nclexTraps: ["An oral oncology drug can still be high risk for bleeding and rhythm problems."],
      classExampleNames: ["Ibrutinib", "Acalabrutinib"],
      classExampleKeys: ["ibrutinib", "acalabrutinib"],
      tags: ["btk", "bleeding", "atrial fibrillation"]
    }),
    pharmSpecificClassCard({
      name: "CDK4/6 inhibitor targeted therapies",
      aliases: ["CDK 4/6 inhibitors"],
      description: "CDK4/6 inhibitors slow cell-cycle progression from G1 to S phase in hormone receptor-positive breast cancer. The class is oral, targeted, and still requires close CBC and toxicity monitoring.",
      usedToTreat: "Hormone receptor-positive, HER2-negative advanced or metastatic breast cancer in combination regimens depending on agent.",
      mechanism: "Cyclin-dependent kinase 4/6 blockade prevents retinoblastoma protein phosphorylation, slowing tumor-cell proliferation. Neutropenia is common; ribociclib has QT/liver emphasis and abemaciclib has more diarrhea/VTE emphasis.",
      nursingEssentials: ["Monitor CBC, infection signs, liver tests, diarrhea management, QT/ECG and electrolytes for ribociclib, VTE symptoms, adherence cycles, and pregnancy avoidance.", "Teach that oral targeted therapy still needs lab-timed holds and dose changes."],
      nclexTraps: ["Neutropenia can occur without classic IV chemotherapy."],
      classExampleNames: ["Palbociclib", "Ribociclib", "Abemaciclib"],
      classExampleKeys: ["palbociclib", "ribociclib", "abemaciclib"],
      tags: ["cdk4 6", "breast cancer", "neutropenia"]
    }),
    pharmSpecificClassCard({
      name: "Penicillin beta-lactam antibiotics",
      aliases: ["penicillin antibiotics", "aminopenicillin", "aminopenicillins", "antipseudomonal penicillin", "antipseudomonal penicillins"],
      description: "Penicillins are beta-lactam antibiotics that inhibit bacterial cell-wall synthesis. Subgroups matter: natural penicillins, aminopenicillins, anti-staphylococcal penicillins, and antipseudomonal penicillins do different jobs.",
      usedToTreat: "Strep/syphilis and other susceptible infections for natural penicillins, respiratory/ENT/urinary/GI organisms for aminopenicillins, MSSA for anti-staphylococcal agents, and broad gram-negative/Pseudomonas coverage for piperacillin-tazobactam when appropriate.",
      mechanism: "Penicillins bind penicillin-binding proteins and block peptidoglycan cross-linking. Beta-lactamase inhibitors protect partner beta-lactams from enzymatic destruction but are not the main antibacterial drug by themselves.",
      nursingEssentials: ["Clarify allergy phenotype, culture/site, renal dosing, sodium load for some IV agents, diarrhea/C. difficile cues, and timed administration.", "For piperacillin-tazobactam, think broad coverage plus kidney/electrolyte monitoring."],
      nclexTraps: ["Tazobactam is a beta-lactamase inhibitor partner, not the primary antibiotic."],
      classExampleNames: ["Penicillin", "Amoxicillin", "Ampicillin", "Piperacillin", "Tazobactam"],
      classExampleKeys: ["penicillin", "amoxicillin", "ampicillin", "piperacillin", "tazobactam"],
      tags: ["penicillin", "aminopenicillin", "antipseudomonal penicillin", "beta lactam", "cell wall"]
    }),
    pharmSpecificClassCard({
      name: "Carbapenem antibiotics",
      aliases: ["carbapenems"],
      description: "Carbapenems are very broad beta-lactam antibiotics often reserved for serious resistant or polymicrobial infections. They are powerful stewardship drugs, not casual first-line agents.",
      usedToTreat: "Serious gram-negative, anaerobic, polymicrobial, intra-abdominal, hospital-acquired, and resistant infections when ordered and susceptibility supports use.",
      mechanism: "Carbapenems bind PBPs and inhibit cell-wall cross-linking, with high stability against many beta-lactamases. Imipenem is paired with cilastatin to reduce renal metabolism and toxicity.",
      nursingEssentials: ["Monitor allergy history, renal dosing, seizure risk especially imipenem/renal impairment/CNS disease, cultures, diarrhea/C. difficile, and valproate interaction.", "Ertapenem lacks Pseudomonas coverage compared with meropenem/imipenem."],
      nclexTraps: ["Broad spectrum does not mean covers everything. Ertapenem is not a Pseudomonas workhorse."],
      classExampleNames: ["Meropenem", "Imipenem", "Ertapenem"],
      classExampleKeys: ["meropenem", "imipenem", "ertapenem"],
      tags: ["carbapenem", "beta lactam", "resistant infection"]
    }),
    pharmSpecificClassCard({
      name: "Fluoroquinolone antibiotics",
      aliases: ["quinolone antibiotics"],
      description: "Fluoroquinolones are DNA gyrase/topoisomerase inhibitors with broad tissue penetration. Their boxed warnings make them a class where indication discipline matters.",
      usedToTreat: "Complicated UTI/pyelonephritis, prostatitis, selected pneumonia, GI infections, bone/joint infections, anthrax/plague exposure, and other susceptible infections when benefits outweigh risks.",
      mechanism: "Inhibiting bacterial topoisomerase II/IV prevents DNA supercoiling and replication. Human tissue toxicity patterns explain tendon rupture, neuropathy, CNS effects, dysglycemia, QT prolongation, and aortic risk cautions.",
      nursingEssentials: ["Avoid routine use for uncomplicated sinusitis/bronchitis/UTI when safer options fit. Teach tendon pain, neuropathy, mood/CNS changes, severe diarrhea, palpitations, and glucose symptoms.", "Separate from calcium/iron/magnesium/zinc and assess myasthenia gravis and aneurysm risk."],
      nclexTraps: ["Leg tendon pain on ciprofloxacin is a stop-and-call warning, not a normal side effect."],
      classExampleNames: ["Ciprofloxacin", "Levofloxacin", "Moxifloxacin"],
      classExampleKeys: ["ciprofloxacin", "levofloxacin", "moxifloxacin"],
      tags: ["fluoroquinolone", "boxed warning", "topoisomerase"]
    }),
    pharmSpecificClassCard({
      name: "Macrolide antibiotics",
      aliases: ["macrolides"],
      description: "Macrolides are 50S ribosomal inhibitors commonly used for respiratory and atypical organisms. QT and interaction details separate a strong nurse from a memorizer.",
      usedToTreat: "Atypical pneumonia, respiratory infections, pertussis, selected STIs, MAC prophylaxis/treatment, and other susceptible infections depending on agent.",
      mechanism: "Macrolides bind the 50S ribosomal subunit and inhibit translocation during bacterial protein synthesis. Clarithromycin/erythromycin strongly inhibit CYP3A4; azithromycin has fewer CYP interactions but still carries QT caution.",
      nursingEssentials: ["Assess QT risk, potassium/magnesium, interacting drugs, liver disease, warfarin/digoxin/statin interactions especially with clarithromycin/erythromycin, and diarrhea.", "Teach not to ignore palpitations or syncope."],
      nclexTraps: ["Azithromycin is not interaction-free; it is just less CYP3A4-heavy than clarithromycin/erythromycin."],
      classExampleNames: ["Azithromycin", "Clarithromycin", "Erythromycin"],
      classExampleKeys: ["azithromycin", "clarithromycin", "erythromycin"],
      tags: ["macrolide", "50s", "qt"]
    }),
    pharmSpecificClassCard({
      name: "Aminoglycoside antibiotics",
      aliases: ["aminoglycosides"],
      description: "Aminoglycosides are concentration-dependent 30S inhibitors used for serious gram-negative infections and synergy in selected regimens. Toxicity monitoring is the class identity.",
      usedToTreat: "Serious aerobic gram-negative infections, synergy for selected gram-positive infections, and topical/ophthalmic/otic uses depending on formulation.",
      mechanism: "Aminoglycosides bind the 30S ribosomal subunit and cause misreading of mRNA, producing faulty proteins and bacterial death. Renal cortical and inner-ear accumulation explain nephrotoxicity and ototoxicity.",
      nursingEssentials: ["Monitor creatinine, urine output, peak/trough or AUC-style levels per protocol, hearing/tinnitus/vertigo, neuromuscular weakness, and nephrotoxic/ototoxic co-medications.", "Once-daily dosing uses concentration-dependent killing and post-antibiotic effect."],
      nclexTraps: ["Hearing changes on gentamicin are not minor; ototoxicity may be irreversible."],
      classExampleNames: ["Gentamicin", "Tobramycin", "Amikacin"],
      classExampleKeys: ["gentamicin", "tobramycin", "amikacin"],
      tags: ["aminoglycoside", "30s", "nephrotoxicity", "ototoxicity"]
    }),
    pharmSpecificClassCard({
      name: "Glycopeptide and lipopeptide gram-positive antibiotics",
      aliases: ["vancomycin daptomycin class comparison", "MRSA gram-positive antibiotics"],
      description: "Vancomycin-class glycopeptides and daptomycin-class lipopeptides are major resistant gram-positive tools. They are grouped for study because nurses often compare MRSA coverage, renal/muscle monitoring, and infusion safety.",
      usedToTreat: "MRSA, resistant gram-positive infections, bacteremia/endocarditis for selected agents, skin/soft tissue infections, and oral vancomycin for C. difficile when indicated.",
      mechanism: "Vancomycin binds D-Ala-D-Ala cell-wall precursors and blocks peptidoglycan synthesis. Daptomycin depolarizes bacterial membranes. Vancomycin does not treat VRE; daptomycin does not treat pneumonia because surfactant inactivates it.",
      nursingEssentials: ["Vancomycin: monitor renal function, levels/AUC per protocol, infusion reaction, and hearing/renal risk. Daptomycin: monitor CK/myopathy and eosinophilic pneumonia symptoms.", "Route matters: oral vancomycin treats C. difficile in the gut; IV vancomycin does not reach the colon lumen well."],
      nclexTraps: ["Do not use vancomycin for VRE just because the name contains vancomycin."],
      classExampleNames: ["Vancomycin", "Daptomycin"],
      classExampleKeys: ["vancomycin", "daptomycin"],
      tags: ["glycopeptide", "lipopeptide", "mrsa", "vre"]
    }),
    pharmSpecificClassCard({
      name: "Anaerobic antibiotics and C. difficile anchors",
      aliases: ["Anaerobic and C. difficile antibiotic anchors", "anaerobic antibiotics", "anaerobic antibiotic", "C difficile antibiotics"],
      description: "Anaerobic and C. difficile therapy is a study pathway rather than one structural class. It helps nurses connect site, oxygen tolerance, toxin-mediated colitis, and drug-specific monitoring.",
      usedToTreat: "Anaerobic intra-abdominal/pelvic/dental infections, bacterial vaginosis/trichomoniasis for metronidazole, C. difficile infection for fidaxomicin or oral vancomycin, and selected anaerobic coverage combinations.",
      mechanism: "Metronidazole forms reactive metabolites in anaerobes that damage DNA. Clindamycin inhibits 50S protein synthesis but has high C. difficile risk. Fidaxomicin inhibits bacterial RNA polymerase in the gut with narrow C. difficile activity.",
      nursingEssentials: ["Ask infection site and organism. Teach metronidazole alcohol reaction warning, clindamycin severe diarrhea warning, and C. difficile recurrence monitoring.", "For C. difficile, contact precautions and diarrhea trend matter as much as the medication name."],
      nclexTraps: ["Clindamycin can treat anaerobes but can also trigger C. difficile colitis."],
      classExampleNames: ["Metronidazole", "Clindamycin", "Fidaxomicin", "Vancomycin"],
      classExampleKeys: ["metronidazole", "clindamycin", "fidaxomicin", "vancomycin"],
      tags: ["anaerobic", "c difficile", "metronidazole", "fidaxomicin"]
    })
  ];

  pharmUpdates.forEach((entry) => upsert(pharm.drugs, entry));
  pharmClassSpecificityUpdates.forEach((entry) => upsert(pharm.drugs, entry));
  labUpdates.forEach((entry) => upsert(pharm.labRanges, entry));
  pathologyUpdates.forEach((entry) => upsert(pathology.diseases, entry));
  consolidateKnownPathologyVariants(pathology.diseases);
  cleanVisiblePharmacyPlaceholders();
  cleanVisiblePathologyPlaceholders();
  enrichThinPathologyEntries();
  dedupeByPrimaryName(pharm.drugs);
  cleanVisiblePharmacyPlaceholders();
  dedupeByPrimaryName(pharm.labRanges);
  dedupeByPrimaryName(pathology.diseases);

  window.ANI_PHARM_DATABASE = pharm;
  window.ANI_PATHOLOGY_DATABASE = pathology;
}());
