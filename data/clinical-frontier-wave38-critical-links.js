/* eslint-disable */
/* Wave 38: critical-topic discoverability and bidirectional clinical links. */
(function () {
  "use strict";

  const VERSION = "2026-07-21-wave38-critical-links-1";
  const pathologyDatabase = window.ANI_PATHOLOGY_DATABASE;
  const referenceDatabase = window.ANI_FOUNDATIONS_DATABASE;

  if (window.ANI_CLINICAL_FRONTIER_WAVE38_CRITICAL_LINKS?.version === VERSION) return;
  if (!pathologyDatabase || !Array.isArray(pathologyDatabase.diseases)
    || !referenceDatabase || !Array.isArray(referenceDatabase.entries)) {
    window.ANI_CLINICAL_FRONTIER_WAVE38_CRITICAL_LINKS = Object.freeze({
      schemaVersion: 1,
      version: VERSION,
      applied: false,
      reason: "The pathology or clinical-reference database was unavailable."
    });
    return;
  }

  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const normalize = (value) => clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const titleOf = (entry) => clean(entry && (entry.name || entry.displayName || entry.title));
  const findOne = (entries, name) => entries.find((entry) => normalize(titleOf(entry)) === normalize(name));
  const unique = (values) => {
    const seen = new Set();
    return (Array.isArray(values) ? values : [])
      .map((value) => clean(value))
      .filter((value) => {
        const key = normalize(value);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  };
  const addTerms = (entry, field, values) => {
    entry[field] = unique([...(Array.isArray(entry[field]) ? entry[field] : []), ...values]);
  };
  const appendNarrative = (entry, field, value) => {
    const current = clean(entry[field]);
    if (normalize(current).includes(normalize(value).slice(0, 96))) return;
    entry[field] = [current, clean(value)].filter(Boolean).join(" ");
  };
  const addSource = (source) => {
    if (!Array.isArray(pathologyDatabase.sourceReferences)) pathologyDatabase.sourceReferences = [];
    const existing = pathologyDatabase.sourceReferences.find((item) => clean(item?.key || item?.id) === source.key);
    if (existing) Object.assign(existing, source);
    else pathologyDatabase.sourceReferences.push({ ...source });
  };

  const calciphylaxis = findOne(pathologyDatabase.diseases, "Calciphylaxis");
  const chronicKidneyDisease = findOne(pathologyDatabase.diseases, "Chronic kidney disease");
  const kidneyFailure = findOne(pathologyDatabase.diseases, "End-stage renal disease");
  const cerebralSaltWasting = findOne(pathologyDatabase.diseases, "Cerebral salt wasting");
  const osmoticFragility = findOne(referenceDatabase.entries, "Osmotic fragility testing");
  const homanSign = findOne(referenceDatabase.entries, "Homan sign");
  const required = [calciphylaxis, chronicKidneyDisease, kidneyFailure, cerebralSaltWasting, osmoticFragility, homanSign];
  if (required.some((entry) => !entry)) {
    window.ANI_CLINICAL_FRONTIER_WAVE38_CRITICAL_LINKS = Object.freeze({
      schemaVersion: 1,
      version: VERSION,
      applied: false,
      reason: "One or more authoritative Wave 25/36 entries were unavailable; no partial link patch was applied."
    });
    return;
  }

  addSource({
    key: "w38-hs-gene-reviews",
    label: "GeneReviews: EPB42-related hereditary spherocytosis (updated 2022)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK190102/",
    note: "Supports the membrane-disorder phenotype, nonimmune hemolysis pattern, osmotic-fragility and ektacytometry findings, genetic differential, complications, family evaluation, and management principles."
  });
  addSource({
    key: "w38-hs-bsh-guideline",
    label: "British Society for Haematology: Diagnosis and management of hereditary spherocytosis (2011 update)",
    url: "https://b-s-h.org.uk/guidelines/guidelines/diagnosis-and-management-of-hereditary-spherocytosis",
    note: "Supports phenotype-led diagnosis, use of specialized membrane testing when the diagnosis is uncertain, and individualized splenectomy and gallbladder-management decisions."
  });

  addTerms(calciphylaxis, "aliases", [
    "calciphylaxis in ESRD",
    "calciphylaxis in end stage renal disease",
    "calciphylaxis in end stage kidney disease",
    "calciphylaxis in kidney failure",
    "calciphylaxis in CKD",
    "ESRD calciphylaxis",
    "CKD calciphylaxis",
    "end stage renal disease calciphylaxis",
    "end stage kidney disease calciphylaxis",
    "kidney failure calciphylaxis",
    "dialysis calciphylaxis",
    "painful black skin lesions in dialysis",
    "painful skin necrosis in kidney failure",
    "painful retiform purpura in dialysis",
    "why dialysis causes painful purple skin lesions"
  ]);
  addTerms(calciphylaxis, "tags", [
    "ESRD complication",
    "end-stage kidney disease complication",
    "dialysis skin emergency",
    "CKD mineral bone disorder complication",
    "small-vessel calcification and thrombosis"
  ]);
  addTerms(calciphylaxis, "relatedTopics", ["Chronic kidney disease", "End-stage renal disease"]);
  addTerms(calciphylaxis, "patientEducation", [
    "Calciphylaxis is strongly associated with advanced Chronic kidney disease and End-stage renal disease, but it is not an inevitable consequence of dialysis and can occur without kidney failure. The kidney-disease context raises suspicion; it does not replace evaluation of other painful ulcers or ischemic lesions."
  ]);
  calciphylaxis.wave38CriticalLinkRevision = VERSION;

  const ckdCalciphylaxisExplanation = "Calciphylaxis (calcific uremic arteriolopathy) is a rare, life-threatening small-vessel ischemic complication seen most often in advanced Chronic kidney disease, especially with kidney failure or dialysis. Mineral deposition, intimal narrowing, endothelial injury, and thrombosis reduce blood flow through dermal and subcutaneous arterioles. That mechanism explains the severe pain that can precede visible injury and the progression from induration or retiform purple change to necrosis and black eschar. CKD-mineral and bone disorder, inflammation, diabetes, malnutrition, obesity, and warfarin exposure can increase risk, but no calcium, phosphate, or PTH result proves or excludes the disease.";
  const ckdCalciphylaxisNursing = "In advanced CKD, urgently escalate new pain out of proportion to the skin examination, a deeply tender indurated plaque, branching purple discoloration, or black eschar. Do not label every dialysis wound as calciphylaxis, but do not dismiss this pattern as ordinary cellulitis or a pressure injury; early nephrology, dermatology, wound, pain, and infection assessment matters because necrosis can progress to sepsis.";
  addTerms(chronicKidneyDisease, "aliases", ["CKD with calciphylaxis", "calciphylaxis risk in CKD"]);
  addTerms(chronicKidneyDisease, "complications", [ckdCalciphylaxisExplanation]);
  addTerms(chronicKidneyDisease, "nursingPriorities", [ckdCalciphylaxisNursing]);
  addTerms(chronicKidneyDisease, "patientEducation", [
    "Report a new extremely painful firm, purple, mottled, ulcerated, or black skin area promptly. Most people with CKD never develop Calciphylaxis, but early assessment matters because tissue ischemia and secondary infection can become life-threatening."
  ]);
  addTerms(chronicKidneyDisease, "relatedTopics", ["Calciphylaxis"]);
  addTerms(chronicKidneyDisease, "tags", ["calciphylaxis risk", "calcific uremic arteriolopathy"]);
  chronicKidneyDisease.wave38CriticalLinkRevision = VERSION;

  const esrdCalciphylaxisExplanation = "Calciphylaxis is an uncommon but critical End-stage renal disease and dialysis complication. It is not simply a high serum-calcium problem: mineralized, narrowed, and thrombosed skin arterioles cause tissue ischemia, so disproportionate pain may appear before retiform purpura, ulceration, or black eschar. Current calcium and phosphate can be normal. Infection of ischemic tissue can lead to sepsis, which is why a compatible lesion needs urgent multidisciplinary evaluation rather than reassurance from one laboratory result.";
  appendNarrative(kidneyFailure, "pathophysiology", "Kidney failure is a whole-body loss of excretory, regulatory, and endocrine reserve rather than a creatinine label. Too little functioning nephron mass permits potassium, acid, phosphate, sodium, water, uremic solutes, and renally cleared medicines to accumulate. Reduced erythropoietin contributes to anemia, while impaired calcitriol activation and phosphate handling drive secondary hyperparathyroidism and CKD-mineral and bone disorder. Dialysis can replace selected solute and fluid clearance but does not fully restore endocrine function, vascular health, or continuous kidney regulation; transplantation restores broader kidney function but introduces operative and lifelong immunosuppression risks.");
  addTerms(kidneyFailure, "signsSymptoms", [
    "Manifestations reflect the failed function: sodium and water retention can cause edema, hypertension, pulmonary crackles, hypoxemia, and dyspnea; potassium or acid accumulation can cause weakness, deep breathing, conduction changes, or dysrhythmia; retained uremic solutes can cause nausea, anorexia, pruritus, sleep change, cognitive slowing, asterixis, neuropathy, pericarditis, platelet dysfunction, or bleeding. A patient can still make urine and can have few symptoms despite very low filtration, so urine presence and appearance never establish adequate clearance.",
    "Anemia-related fatigue and exertional dyspnea, bone or fracture symptoms from CKD-mineral and bone disorder, restless legs, cramps, malnutrition, infection, and medication accumulation often overlap. The nursing task is to connect each finding to volume, electrolytes, acid-base balance, uremia, endocrine loss, access function, dialysis delivery, and competing disease rather than attributing every symptom to one BUN or creatinine value."
  ]);
  addTerms(kidneyFailure, "labs", [
    "Trend potassium, bicarbonate and pH when indicated, sodium, calcium, phosphate, PTH, magnesium, BUN, creatinine and residual filtration, hemoglobin, reticulocyte response, iron indices, albumin and nutrition measures, glucose, medication levels when relevant, and delivered dialysis adequacy. No single value determines dialysis need: refractory hyperkalemia, acidosis, overload, uremic complications, selected intoxications, symptoms, trajectory, and goals drive urgent and long-term decisions.",
    "Interpret post-dialysis values in relation to sampling time, prescription, access recirculation, missed or shortened treatment, residual kidney function, dietary and medication exposure, and clinical response. A temporarily improved number does not prove adequate ongoing clearance, and a high BUN alone does not diagnose the clinical syndrome of uremia."
  ]);
  addTerms(kidneyFailure, "treatments", [
    "Kidney replacement options include hemodialysis, peritoneal dialysis, and transplantation; comprehensive conservative kidney care is also an active symptom- and goal-focused pathway when dialysis or transplant is not chosen. Modality selection considers physiology, trajectory, vascular or abdominal access, home support, function, comorbidity, transplant eligibility, and patient goals rather than treating dialysis as one uniform intervention.",
    "Continue cause- and complication-directed care: manage volume and blood pressure, potassium and acid-base disturbances, anemia and iron status, CKD-mineral and bone disorder, nutrition, symptoms, infection prevention, vascular risk, and kidney-adjusted medicines. Dialysis does not make unrestricted fluid, potassium, phosphate, or drug exposure safe, and medication doses may differ by modality and timing."
  ]);
  addTerms(kidneyFailure, "complications", [esrdCalciphylaxisExplanation]);
  addTerms(kidneyFailure, "nursingPriorities", [
    ckdCalciphylaxisNursing,
    "Before and after dialysis, trend weight, blood pressure, heart rate, oxygenation, lung findings, edema, intake and output, mental status, cramps, nausea, access or catheter findings, and prescribed laboratories. Verify the delivered treatment and investigate missed time, hypotension, access dysfunction, or peritoneal-effluent change when symptoms and expected clearance do not match.",
    "Protect the chosen dialysis access and assess it according to modality: verify fistula or graft thrill and bruit without using that limb for routine blood pressure or venipuncture; use strict catheter infection precautions; and escalate absent flow, uncontrolled bleeding, fever, drainage, rapidly spreading redness, cloudy peritoneal effluent, or severe abdominal pain. Reconcile every prescription, OTC drug, supplement, and contrast exposure for kidney dosing and dialysis removal."
  ]);
  addTerms(kidneyFailure, "redFlags", [
    "Emergency findings include severe hyperkalemia or ECG change, refractory acidosis, pulmonary edema or hypoxemia, uremic encephalopathy or seizure, pericarditic chest pain or friction rub, active uremic bleeding, dangerous medication accumulation, severe hypertension with organ injury, or a missed dialysis treatment followed by clinical deterioration.",
    "Escalate an absent access thrill, uncontrolled access hemorrhage, catheter or access sepsis, cloudy peritoneal effluent with pain or fever, transplant rejection or severe infection concern, and a new exquisitely painful purple or necrotic skin lesion concerning for Calciphylaxis."
  ]);
  addTerms(kidneyFailure, "patientEducation", [
    "Report a new extremely painful firm, purple, mottled, ulcerated, or black skin lesion immediately. This pattern can signal Calciphylaxis, a time-sensitive tissue-ischemia emergency, even when today's calcium or phosphate value is not high."
  ]);
  addTerms(kidneyFailure, "relatedTopics", ["Calciphylaxis"]);
  addTerms(kidneyFailure, "tags", ["calciphylaxis", "calcific uremic arteriolopathy", "painful dialysis skin necrosis"]);
  kidneyFailure.wave38CriticalLinkRevision = VERSION;

  addTerms(cerebralSaltWasting, "aliases", [
    "low sodium after brain injury",
    "brain injury sodium loss",
    "losing salt in urine after brain injury",
    "hyponatremia after brain injury with hypovolemia",
    "hypovolemic hyponatremia after neurologic injury",
    "low sodium and volume depletion after subarachnoid hemorrhage",
    "high urine sodium after subarachnoid hemorrhage with low volume",
    "salt loss after SAH",
    "natriuresis after intracranial disease",
    "cerebral salt wasting versus SIADH"
  ]);
  addTerms(cerebralSaltWasting, "tags", [
    "post brain injury hyponatremia",
    "hypovolemic hyponatremia",
    "neurologic natriuresis",
    "subarachnoid hemorrhage sodium loss",
    "CSW versus SIADH"
  ]);
  cerebralSaltWasting.wave38CriticalLinkRevision = VERSION;

  const existingHereditarySpherocytosis = findOne(pathologyDatabase.diseases, "Hereditary spherocytosis");
  const hereditarySpherocytosis = existingHereditarySpherocytosis || {
    name: "Hereditary spherocytosis",
    displayName: "Hereditary spherocytosis",
    category: "Hematology / inherited red-cell membrane disorders",
    nclexEssential: true,
    definition: "Hereditary spherocytosis is an inherited red-cell membrane disorder that produces chronic, nonimmune extravascular hemolysis. Defects in proteins that connect the membrane lipid bilayer to its cytoskeleton allow membrane surface to be lost over time. The affected red cell becomes a dense sphere with too little surface area for its volume, cannot deform normally through splenic cords, and is trapped and removed by splenic macrophages. The result ranges from compensated hemolysis with no anemia to neonatal jaundice, chronic anemia, splenomegaly, pigment gallstones, hemolytic crises, or a dangerous aplastic crisis. Spherocytes are an important clue, not proof: autoimmune hemolytic anemia and other acquired processes can also produce them.",
    pathology: "Normal biconcave red cells have spare membrane surface and a flexible spectrin-based cytoskeleton, which let them bend through capillaries and the narrow splenic circulation. In hereditary spherocytosis, abnormal vertical connections among spectrin, ankyrin, band 3, protein 4.2, and the lipid bilayer permit progressive membrane loss. Cell volume is not lost in the same proportion, so surface-area-to-volume ratio falls and the cell rounds into a spherocyte. The less deformable cell becomes relatively dehydrated and dense, repeatedly stalls in the spleen's acidic, low-glucose environment, and is ultimately phagocytosed. That is why hemolysis is mainly extravascular, why splenomegaly develops, and why splenectomy can reduce hemolysis without repairing the membrane defect.",
    pathophysiology: [
      "A pathogenic membrane-protein defect weakens attachment between the red-cell lipid bilayer and cytoskeleton. Small membrane vesicles are shed during circulation, progressively reducing surface area while much of the intracellular volume remains.",
      "The cell becomes spherical and loses the central pallor of a normal biconcave erythrocyte. A sphere has little reserve to expand in hypotonic fluid and little flexibility to elongate through the spleen, explaining increased osmotic fragility and impaired deformability.",
      "Splenic conditioning worsens membrane loss and traps the rigid spherocytes. Macrophage removal causes extravascular hemolysis, raising unconjugated bilirubin and reticulocyte production while lowering haptoglobin. Marrow compensation can keep hemoglobin near baseline until demand exceeds production.",
      "Accelerated bilirubin turnover promotes black pigment gallstones. Viral suppression of erythropoiesis, classically during parvovirus B19 infection, can abruptly stop reticulocyte compensation and produce a severe aplastic crisis because circulating red cells already have shortened survival."
    ],
    etiology: "Hereditary spherocytosis results from pathogenic variants affecting red-cell membrane or cytoskeletal proteins, most often involving ANK1, SPTB, SPTA1, SLC4A1, or EPB42. Many families show autosomal-dominant inheritance, but autosomal-recessive and de novo disease occur, and severity varies within and between genotypes. A negative family history therefore does not exclude the diagnosis. Genetic testing can define a cause in selected uncertain, severe, recessive, prenatal, or counseling situations, but diagnosis usually begins with the phenotype and laboratory pattern rather than a gene result alone.",
    riskFactors: [
      "A parent, sibling, or extended relative with hereditary spherocytosis, chronic unexplained hemolysis, jaundice, splenectomy, or early pigment gallstones",
      "A newborn with significant jaundice or anemia, particularly when spherocytes, high MCHC, or a compatible family history are present",
      "Intercurrent infection that increases hemolysis or transiently suppresses marrow production; parvovirus B19 is especially important when anemia worsens while the reticulocyte count falls",
      "Pregnancy, rapid growth, or another state that increases folate and erythropoietic demand in a person with ongoing hemolysis"
    ],
    signsSymptoms: [
      "Observed signs include pallor, scleral icterus or jaundice, splenomegaly, and sometimes hepatomegaly. Chronic bilirubin turnover can produce pigment gallstones and right-upper-quadrant or biliary symptoms.",
      "Patient-reported symptoms may include fatigue, exercise intolerance, dyspnea, dizziness, abdominal fullness, or episodic worsening during infection. Mild disease may be discovered incidentally and symptoms do not reliably measure the rate of hemolysis.",
      "Neonates may present with jaundice and anemia without obvious splenomegaly. A bilirubin rise in early life requires timely measurement and treatment because neurologic bilirubin toxicity depends on level, age, gestation, and other risks rather than the diagnostic label alone.",
      "Aplastic crisis can cause sudden profound fatigue, pallor, tachycardia, dyspnea, weakness, or syncope with a reticulocyte count that is unexpectedly low for the degree of anemia. Hemolytic crisis more often preserves or raises reticulocytosis unless marrow production is also impaired."
    ],
    diagnostics: [
      "Start with CBC and indices, reticulocyte count, peripheral smear, bilirubin fractions, LDH, and haptoglobin. The coherent pattern is nonimmune hemolysis with spherocytes, reticulocytosis, and often an increased MCHC, but none of these findings is universal or individually diagnostic.",
      "Perform a direct antiglobulin test when immune hemolysis is in the differential. A positive result supports antibody or complement coating in the right context; a negative result supports but does not by itself prove a hereditary membrane disorder. Review transfusion, medicines, infection, burns, and other acquired causes of spherocytes.",
      "Osmotic fragility testing exposes red cells to progressively hypotonic saline. Spherocytes have less spare membrane surface, reach their maximum spherical volume earlier, and lyse in relatively less hypotonic solutions, producing increased fragility. The finding supports a spherocytic population but is neither specific nor perfectly sensitive: acquired spherocytes can be positive, mild disease can be missed, the most fragile cells may already have been cleared during active hemolysis, and recent transfusion can dilute the abnormal population.",
      "EMA binding by flow cytometry evaluates fluorescence associated mainly with band 3 and linked membrane proteins; reduced binding supports hereditary spherocytosis in a validated laboratory. Osmotic-gradient ektacytometry measures deformability across osmolalities and can help distinguish membrane phenotypes. Test selection and cutoffs are laboratory-specific, and discordant cases may need hematology review, additional membrane studies, or genetic testing.",
      "Ultrasound may assess splenic size or gallstones when symptoms or management decisions require it. Bone-marrow examination is not routine for a typical coherent presentation; consider it only when cytopenias, reticulocyte behavior, morphology, or the clinical course suggests marrow failure or another diagnosis."
    ],
    assessment: "Establish the patient's baseline hemoglobin and reticulocyte response, usual jaundice, spleen size, transfusion history, family history, prior gallstones or splenectomy, vaccination status, and the pattern during illnesses. When symptoms worsen, compare CBC and reticulocytes with baseline rather than interpreting hemoglobin alone. Reticulocytosis suggests marrow compensation, whereas a sudden reticulocyte fall during severe anemia raises concern for aplastic crisis. Assess hydration, cardiopulmonary compensation, bilirubin symptoms, abdominal pain, infection exposure, pregnancy, folate intake, and any recent transfusion that could alter testing.",
    differential: "The most important mimic is autoimmune hemolytic anemia because both can produce spherocytes, anemia, reticulocytosis, jaundice, splenomegaly, and increased osmotic fragility. Direct antiglobulin testing, history, age, family pattern, and specialized membrane testing help separate them. Also consider ABO or other immune hemolysis in neonates, hereditary elliptocytosis and other membrane disorders, G6PD or pyruvate-kinase deficiency, hemoglobin disorders, microangiopathic or mechanical hemolysis, congenital dyserythropoietic anemia, burns, transfusion-related mixed populations, and liver or splenic disease. Spherocytes on one smear should start a mechanism-based differential, not end it.",
    treatments: [
      "Treat severity and complications rather than the smear appearance alone. Mild compensated disease may need education and follow-up without transfusion or surgery. Folate supplementation is used when ongoing hemolysis, pregnancy, growth, diet, or local hematology guidance indicates increased need; it should not be presented as a cure for the membrane defect.",
      "Use red-cell transfusion for clinically important symptomatic anemia, severe neonatal disease, or aplastic or hemolytic crisis according to age, physiology, baseline, and hematology guidance. The decision is not based on one universal hemoglobin threshold.",
      "Splenectomy reduces splenic destruction and often improves anemia but leaves spherocytes and the inherited membrane defect in circulation. Because it creates lifelong risk of overwhelming infection and can add thrombotic risk, reserve total or partial splenectomy for selected clinically significant disease after individualized hematology and surgical assessment, not for every diagnosis.",
      "Before an elective splenectomy, complete recommended pneumococcal, meningococcal, and Haemophilus influenzae type b vaccination planning and establish the local fever, antibiotic, and emergency plan. Manage gallstones according to symptoms, imaging, age, and the splenectomy decision rather than automatically removing the gallbladder in every patient."
    ],
    contraindications: [
      "Do not diagnose hereditary spherocytosis from spherocytes or increased osmotic fragility alone; autoimmune and other acquired spherocytosis must be considered.",
      "Do not use a normal osmotic fragility result to exclude mild disease, disease sampled during active hemolysis, or a recently transfused mixed-cell population.",
      "Do not perform splenectomy solely to normalize a smear or laboratory result. Balance symptom burden and transfusion need against age, infection risk, thrombosis, vaccination readiness, and alternatives.",
      "After splenectomy, do not delay urgent evaluation of fever or systemic illness and do not assume vaccination eliminates overwhelming postsplenectomy infection risk."
    ],
    nursingPriorities: [
      "Trend hemoglobin, reticulocyte count, bilirubin, symptoms, heart rate, oxygenation, perfusion, jaundice, spleen-related discomfort, and intake against the patient's baseline. A falling hemoglobin plus falling reticulocytes is more concerning for marrow suppression than a compensated reticulocytosis.",
      "During illness, assess fever, hydration, fatigue, dyspnea, syncope, urine color, abdominal pain, and possible parvovirus exposure. Escalate sudden pallor or weakness promptly rather than assuming it is an ordinary hemolytic fluctuation.",
      "For infants, support timely bilirubin and anemia follow-up, feeding assessment, and caregiver education because jaundice severity can change quickly and visible color is not a reliable bilirubin measurement.",
      "If splenectomy is planned or has occurred, verify immunization and prophylaxis plans, document spleen status prominently, reinforce immediate fever evaluation, and teach medical-alert identification and travel or animal-bite precautions according to local guidance."
    ],
    redFlags: [
      "Sudden severe pallor, profound fatigue, tachycardia, dyspnea, chest pain, syncope, hypotension, or rapidly falling hemoglobin",
      "Severe anemia with an unexpectedly low or falling reticulocyte count, especially during a viral illness, suggesting aplastic crisis",
      "A newborn with rapidly increasing jaundice, poor feeding, lethargy, abnormal tone, or other signs of bilirubin toxicity",
      "Fever, rigors, altered mental status, hypotension, or rapidly progressive illness after splenectomy",
      "Severe left-upper-quadrant pain after trauma or right-upper-quadrant pain with fever, jaundice, or vomiting"
    ],
    complications: [
      "Neonatal hyperbilirubinemia and anemia",
      "Hemolytic crisis and transfusion-requiring anemia",
      "Aplastic crisis, often associated with parvovirus B19, with loss of the compensatory reticulocyte response",
      "Splenomegaly and pigment gallstones from chronic bilirubin turnover",
      "Iron overload in repeatedly transfused patients and folate depletion during high erythropoietic demand",
      "Overwhelming infection and thrombotic complications after splenectomy"
    ],
    prognosis: "Severity ranges from an incidental compensated disorder to transfusion-dependent anemia. Many patients maintain normal function with monitoring and complication prevention, while others have recurrent crises, gallstones, or a need for splenectomy. Splenectomy improves red-cell survival but does not remove the inherited abnormality and exchanges hemolysis burden for lifelong infection precautions and possible thrombotic risk. Prognosis therefore depends on baseline severity, crisis recognition, access to hematology care, and long-term postsplenectomy safety when applicable.",
    prevention: [
      "The inherited membrane defect cannot be prevented, but early family recognition can prevent delayed treatment of neonatal jaundice or aplastic crisis.",
      "Maintain recommended immunizations and a written fever plan after splenectomy; use antibiotic prophylaxis exactly as locally prescribed.",
      "Avoid unreviewed iron supplementation because chronic hemolysis is not automatically iron deficiency, and repeated transfusions can create iron overload."
    ],
    patientEducation: [
      "Spherocytes are round red cells caused by lost membrane surface. They are less flexible, so the spleen removes them early; this explains anemia, jaundice, spleen enlargement, and pigment gallstones.",
      "The Osmotic fragility testing article explains why spherocytes rupture sooner in hypotonic saline and why that result must be combined with smear, hemolysis studies, direct antiglobulin testing, family history, and modern membrane testing.",
      "Seek urgent care for sudden severe weakness, shortness of breath, fainting, rapidly worsening pallor or jaundice, or fever after splenectomy. Tell every care team whether the spleen has been removed.",
      "Family members and newborns may need targeted evaluation, but inheritance varies; genetic counseling can clarify risk when the familial cause or pattern is uncertain."
    ],
    nclexTraps: [
      "A spherocyte is a morphology finding, not a diagnosis. Autoimmune hemolytic anemia can also produce spherocytes and increased osmotic fragility.",
      "Increased osmotic fragility occurs because a sphere has low surface-area-to-volume reserve and cannot swell much before rupturing; it does not mean red cells break because the patient's blood is ordinarily hypotonic.",
      "Aplastic crisis is suggested by worsening anemia with an inappropriately low reticulocyte response, whereas ordinary compensated hemolysis usually increases reticulocytes.",
      "Splenectomy reduces hemolysis but does not correct the red-cell membrane defect and creates a lifelong fever and infection emergency plan."
    ],
    relatedTopics: [
      "Osmotic fragility testing",
      "Peripheral blood smear",
      "Direct antiglobulin test",
      "EMA binding test",
      "Osmotic-gradient ektacytometry",
      "Autoimmune hemolytic anemia",
      "Hemolytic anemia",
      "Reticulocyte count",
      "Unconjugated hyperbilirubinemia",
      "Splenomegaly",
      "Pigment gallstones",
      "Parvovirus B19",
      "Splenectomy safety"
    ],
    aliases: [
      "congenital spherocytosis",
      "familial spherocytosis",
      "inherited spherocytosis",
      "Minkowski-Chauffard disease",
      "inherited red cell membrane hemolysis",
      "Coombs negative spherocytes",
      "spherocytes with jaundice and splenomegaly",
      "round red cells without central pallor",
      "why spherocytes are destroyed in the spleen",
      "spherocytosis osmotic fragility"
    ],
    abbreviations: ["HS"],
    ambiguousAbbreviations: ["HS"],
    commonMisspellings: ["heriditary spherocytosis", "hereditary spherocitosis", "hereditary sphereocytosis", "spherocitosis", "spherocytoses"],
    tags: [
      "hereditary spherocytosis",
      "red blood cell membrane disorder",
      "spherocyte",
      "extravascular hemolysis",
      "osmotic fragility",
      "EMA binding",
      "ektacytometry",
      "splenomegaly",
      "pigment gallstone",
      "aplastic crisis",
      "parvovirus B19"
    ],
    sourceNote: "This educational entry synthesizes GeneReviews and British Society for Haematology guidance. Specialized test interpretation, transfusion, splenectomy, vaccination, and antimicrobial plans require the performing laboratory and treating hematology team.",
    sourceKeys: ["w38-hs-gene-reviews", "w38-hs-bsh-guideline"]
  };

  if (!existingHereditarySpherocytosis) pathologyDatabase.diseases.push(hereditarySpherocytosis);
  addTerms(hereditarySpherocytosis, "aliases", [
    "osmotic fragility in hereditary spherocytosis",
    "hereditary spherocytosis osmotic fragility test",
    "red cell membrane disease with increased osmotic fragility"
  ]);
  addTerms(hereditarySpherocytosis, "relatedTopics", ["Osmotic fragility testing"]);
  hereditarySpherocytosis.wave38CriticalLinkRevision = VERSION;

  addTerms(osmoticFragility, "aliases", [
    "osmotic fragility test for spherocytosis",
    "osmotic fragility test for hereditary spherocytosis",
    "spherocytosis fragility test",
    "spherocyte osmotic fragility",
    "why spherocytes lyse in hypotonic saline",
    "red blood cells lyse in hypotonic saline",
    "increased osmotic fragility in hereditary spherocytosis"
  ]);
  addTerms(osmoticFragility, "relatedTopics", ["Hereditary spherocytosis"]);
  addTerms(osmoticFragility, "tags", ["spherocytosis diagnostic test", "increased fragility in spherocytes"]);
  osmoticFragility.wave38CriticalLinkRevision = VERSION;

  addTerms(homanSign, "aliases", [
    "Homan sign DVT",
    "Homans test for DVT",
    "outdated DVT calf sign",
    "unreliable DVT dorsiflexion sign",
    "historical calf dorsiflexion clot test",
    "calf dorsiflexion sign should not be used"
  ]);
  addTerms(homanSign, "tags", [
    "outdated clinical sign",
    "not recommended for DVT diagnosis",
    "poor diagnostic reliability",
    "historical examination finding"
  ]);
  homanSign.currentRecommendation = "Outdated and unreliable; do not intentionally elicit it to diagnose or exclude deep vein thrombosis.";
  homanSign.wave38CriticalLinkRevision = VERSION;

  pathologyDatabase.cohorts = {
    ...(pathologyDatabase.cohorts || {}),
    wave38CriticalLinks: [
      "Calciphylaxis",
      "Chronic kidney disease",
      "End-stage renal disease",
      "Cerebral salt wasting",
      "Hereditary spherocytosis"
    ]
  };
  pathologyDatabase.componentVersions = {
    ...(pathologyDatabase.componentVersions || {}),
    wave38CriticalLinks: VERSION
  };
  pathologyDatabase.latestExtensionVersion = VERSION;
  referenceDatabase.componentVersions = {
    ...(referenceDatabase.componentVersions || {}),
    wave38CriticalLinks: VERSION
  };
  referenceDatabase.latestExtensionVersion = VERSION;

  window.ANI_CLINICAL_FRONTIER_WAVE38_CRITICAL_LINKS = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    applied: true,
    addedPathologyEntries: existingHereditarySpherocytosis ? [] : ["Hereditary spherocytosis"],
    upgradedPathologyEntries: [
      "Calciphylaxis",
      "Chronic kidney disease",
      "End-stage renal disease",
      "Cerebral salt wasting"
    ],
    upgradedReferenceEntries: ["Osmotic fragility testing", "Homan sign"],
    bidirectionalLinks: [
      ["Calciphylaxis", "Chronic kidney disease"],
      ["Calciphylaxis", "End-stage renal disease"],
      ["Hereditary spherocytosis", "Osmotic fragility testing"]
    ]
  });
}());
