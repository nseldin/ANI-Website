/* eslint-disable */
/* Wave 36: mechanism-first pathology references for three high-risk diagnostic problems. */
(function () {
  "use strict";

  const VERSION = "2026-07-20-wave36-pathology-a-3";
  const SOURCE_NOTE = "This educational synthesis is grounded in the cited renal, hematology, toxicology, neurology, and hyponatremia references. Evidence is uneven for these uncommon syndromes, and local protocols, current product labeling, specialist judgment, and the patient's physiology take priority over a static reference card. Treatment details intentionally emphasize reasoning, monitoring, uncertainty, and escalation rather than standing orders.";

  if (window.ANI_PATHOLOGY_WAVE36_A && window.ANI_PATHOLOGY_WAVE36_A.version === VERSION) return;

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) {
    window.ANI_PATHOLOGY_WAVE36_A = Object.freeze({
      schemaVersion: 1,
      version: VERSION,
      applied: false,
      reason: "ANI pathology database was unavailable."
    });
    return;
  }

  const clean = (value) => String(value || "").trim();
  const normalize = (value) => clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const titleOf = (entry) => clean(entry && (entry.name || entry.title || entry.displayName));

  const sourceReferences = [
    {
      key: "w36-calciphylaxis-era-2025",
      label: "European Renal Association CKD-MBD Working Group: Calciphylaxis diagnosis, management and future directions (2025)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12683247/",
      note: "Supports contemporary diagnosis, clinical evolution, biopsy and imaging limitations, risk-factor modification, multidisciplinary care, and the limited evidence for available treatments."
    },
    {
      key: "w36-calciphylaxis-ajkd-2015",
      label: "Nigwekar et al.: Calciphylaxis—risk factors, diagnosis, and treatment (American Journal of Kidney Diseases, 2015)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4696752/",
      note: "Supports uremic and nonuremic disease, lesion recognition, biopsy risk-benefit reasoning, differential diagnosis, and multimodal team management."
    },
    {
      key: "w36-calciphylaxis-ncbi-2023",
      label: "NCBI Bookshelf: Calciphylaxis (updated 2023)",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK519020/",
      note: "Supports the arteriolar calcification-thrombosis mechanism, normal calcium/phosphate possibility, risk factors, clinical findings, complications, and interprofessional care."
    },
    {
      key: "w36-methem-eha-2022",
      label: "European Hematology Association and EuroBloodNet: Recommendations for diagnosis and treatment of methemoglobinemia (2022)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9291883/",
      note: "Supports congenital and acquired mechanisms, co-oximetry, clinical severity assessment, methylene-blue limitations, rebound, and specialist alternatives."
    },
    {
      key: "w36-methem-fda-provayblue-2024",
      label: "US FDA: PROVAYBLUE (methylene blue) prescribing information (2024)",
      url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/204630Orig1s023lbl.pdf",
      note: "Supports labeled use in acquired methemoglobinemia and warnings concerning G6PD deficiency, serotonin syndrome, hemolysis, pulse-oximetry interference, and rebound after arylamine or dapsone exposure."
    },
    {
      key: "w36-methem-ncbi-2025",
      label: "NCBI Bookshelf: Methemoglobinemia (updated 2025)",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK537317/",
      note: "Supports Fe2+-to-Fe3+ oxidation, functional anemia, exposure patterns, the saturation gap, confirmation by co-oximetry, and toxicology-guided management."
    },
    {
      key: "w36-csw-aha-asa-2023",
      label: "American Heart Association/American Stroke Association: Guideline for aneurysmal subarachnoid hemorrhage (2023)",
      url: "https://www.ahajournals.org/doi/10.1161/STR.0000000000000436",
      note: "Supports euvolemia-focused care after aneurysmal subarachnoid hemorrhage and cautious use of mineralocorticoids for natriuresis and hyponatremia without assuming improved neurologic outcome."
    },
    {
      key: "w36-csw-european-hyponatremia-2014",
      label: "European Society of Endocrinology, ERA-EDTA, and ESICM: Clinical practice guideline on hyponatraemia (2014)",
      url: "https://academic.oup.com/ejendo/article/170/3/G1/6668028",
      note: "Supports confirmation of hypotonic hyponatremia, symptom-driven emergency treatment, correction safeguards, and cautious interpretation of urine and volume findings."
    },
    {
      key: "w36-csw-fact-fiction-2020",
      label: "Sterns and Rondon-Berrios: The curious story of cerebral salt wasting—fact or fiction? (2020)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7646250/",
      note: "Supports the controversy around the syndrome, the need for demonstrable extracellular-volume depletion and ongoing natriuresis, and avoidance of diagnosis from brain injury plus hyponatremia alone."
    },
    {
      key: "w36-csw-siadh-review-2023",
      label: "Syndrome of inappropriate antidiuresis: from pathophysiology to management (2023)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10502587/",
      note: "Supports the SIADH comparison, limits of bedside volume assessment, proposed salt-wasting mechanisms, and dynamic response-to-therapy reasoning."
    }
  ];

  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];
  sourceReferences.forEach((source) => {
    const existing = database.sourceReferences.find((item) => clean(item && (item.key || item.id)) === source.key);
    if (existing) Object.assign(existing, source);
    else database.sourceReferences.push({ ...source });
  });

  const calciphylaxis = {
    name: "Calciphylaxis",
    displayName: "Calciphylaxis",
    category: "Nephrology, Dermatology & Wound Emergencies",
    nclexEssential: true,
    sourceNote: SOURCE_NOTE,
    definition: "Calciphylaxis is a rare, life-threatening occlusive disease of small vessels in the skin and subcutaneous fat. Calcium deposition within arteriolar walls, intimal thickening, endothelial injury, and thrombosis progressively narrow blood flow, producing intense ischemic pain, tissue infarction, necrotic ulcers, infection risk, and possible sepsis. It is often called calcific uremic arteriolopathy because most recognized cases occur in advanced kidney disease, especially during dialysis, but the name must not hide nonuremic calciphylaxis: the same clinicopathologic syndrome can occur with earlier kidney disease or apparently normal kidney function. A new exquisitely painful indurated plaque, retiform purple lesion, or black eschar in a person with relevant risks deserves urgent nephrology and dermatology evaluation; it should not be dismissed as an ordinary pressure injury or cellulitis.",
    pathology: "The central lesion is not a simple pile of calcium in the skin. Medial mineralization makes small dermal and subcutaneous arterioles stiff, while fibrointimal growth and microthrombi narrow or close the lumen. Adipose tissue and skin downstream then receive too little oxygen. Ischemia explains why severe pain may begin before the surface breaks down and why lesions evolve from firmness or mottling to purpura, necrosis, and eschar. Uremia, inflammation, oxidative stress, disturbed bone-mineral signaling, loss of natural calcification inhibitors, vitamin K antagonism, malnutrition, and prothrombotic conditions may converge on this pathway. No single abnormal laboratory value is necessary or sufficient. Serum calcium and phosphate can be normal when disease is diagnosed because a blood sample is only a current snapshot; prior exposure, tissue-level regulation, local injury, inhibitor failure, and thrombosis are not captured by that snapshot. Most people with high calcium or phosphate never develop calciphylaxis, while susceptible people can develop it without high current values.",
    pathophysiology: [
      "Vascular susceptibility develops: chronic kidney disease-mineral and bone disorder, uremic inflammation, diabetes, malnutrition, liver disease, obesity, vitamin K antagonism, or another systemic stress can reduce the vessel wall's resistance to inappropriate mineralization. Matrix Gla protein is one vitamin K-dependent inhibitor under study, which helps explain the association with warfarin, but calciphylaxis is multifactorial and warfarin is not the cause in every case.",
      "Small-vessel remodeling follows: calcium-phosphate mineral accumulates predominantly in the medial layer of dermal and subcutaneous arterioles. Intimal hyperplasia and endothelial dysfunction further reduce the lumen. Mineralization alone can exist without calciphylaxis; the clinically destructive step involves critical flow limitation, thrombosis, and tissue ischemia.",
      "Ischemia produces the characteristic pain: metabolically active fat and skin downstream become hypoxic. Deep, burning, or stabbing pain can precede visible injury because nerves and subcutaneous tissue are already ischemic before epidermal necrosis appears. Firm plaques, nodules, livedoid mottling, or retiform purpura mark the vascular distribution rather than a superficial dermatitis.",
      "Tissue infarction breaks the barrier: skin becomes violaceous, ulcerates, and forms necrotic eschar. The open wound is difficult to heal because perfusion remains impaired, and devitalized tissue supports microbial growth. Infection and sepsis are therefore consequences of vascular failure, not proof that infection started the lesion.",
      "A self-amplifying cycle may develop: inflammation, repeated tissue trauma, infection, hypotension, malnutrition, and immobility add further endothelial and wound stress. Effective management must interrupt several parts of this cycle rather than expecting one drug to reverse established infarction."
    ],
    etiology: "Calciphylaxis has no single established cause. It usually reflects several interacting vulnerabilities in a patient with advanced chronic kidney disease, but it can arise before dialysis, after transplantation, in acute kidney injury, or without clinically important renal failure. Reported nonuremic settings include primary hyperparathyroidism, malignancy, chronic liver disease, autoimmune or hypercoagulable disease, diabetes, obesity, corticosteroid exposure, and warfarin exposure. These are associations, not diagnostic criteria. In an individual patient, clinicians review kidney function and dialysis adequacy, longitudinal calcium-phosphate-PTH patterns, vitamin D and binder exposure, anticoagulants, nutrition, liver disease, inflammatory disease, thrombosis history, injections or trauma at the lesion, and competing explanations. The term nonuremic calciphylaxis should be reserved for a compatible clinical and usually histopathologic process, not used for every painful ulcer in a person without kidney failure.",
    riskFactors: [
      "Advanced chronic kidney disease, kidney failure treated with hemodialysis or peritoneal dialysis, and longer exposure to the uremic and CKD-mineral-bone environment",
      "Diabetes, obesity, female sex, hypoalbuminemia, protein-energy malnutrition, chronic inflammation, liver disease, autoimmune disease, malignancy, or a hypercoagulable state",
      "Secondary hyperparathyroidism, hyperphosphatemia, hypercalcemia, calcium-based phosphate binders, activated vitamin D, or high-calcium exposure; very low PTH and adynamic bone disease may also impair appropriate mineral buffering",
      "Warfarin or another vitamin K-antagonist exposure, possibly because reduced activation of matrix Gla protein weakens an important defense against vascular mineralization",
      "Corticosteroid exposure and repeated local trauma, including injections into adipose-rich tissue; these associations modify suspicion but do not prove causality",
      "Previous calciphylaxis, a current ischemic wound, poor wound perfusion, or delayed recognition, which can permit necrosis and secondary infection to progress"
    ],
    signsSymptoms: [
      "Clinical signs — Early disease may present as pain out of proportion to visible skin change, a deep tender nodule, woody induration, edema, or a painful erythematous-to-violaceous plaque. The pain is often severe and can precede ulceration, so intact skin does not exclude dangerous ischemia.",
      "Clinical signs — Livedo reticularis or a branching, netlike retiform purpura suggests compromise of small and medium cutaneous vessels. Lesions may become stellate, develop bullae, then progress to ulceration and a thick black eschar as downstream tissue infarcts.",
      "Clinical signs — Proximal adipose-rich areas such as the abdomen, thighs, buttocks, or breasts are common sites, but distal legs, digits, and genital tissue can be affected. Distribution alone cannot confirm or exclude the disorder.",
      "Clinical signs — Drainage, malodor, expanding erythema, warmth, fluctuance, fever, hemodynamic change, altered mentation, or rising inflammatory markers can indicate secondary infection or sepsis. A wound may also be infected without fever in an immunocompromised patient.",
      "Symptoms and function — Ischemic pain may prevent sleep, movement, dialysis positioning, wound care, nutrition, and rehabilitation. Fear, depression, delirium, and medication adverse effects can magnify suffering and complicate assessment, which is why pain and palliative-care expertise are part of active disease treatment."
    ],
    diagnostics: [
      "Begin with pattern recognition and urgency, not a screening number. Document the onset and evolution of pain, lesion morphology, depth, distribution, medications, injections, kidney history, dialysis course, weight and nutrition trend, mineral-bone history, and systemic symptoms. Examine all skin, including folds and pressure-prone or private areas with consent, because a second lesion may reveal the vascular pattern.",
      "No serum test diagnoses calciphylaxis. Check calcium, phosphate, PTH, alkaline phosphatase, albumin, kidney and liver function, CBC, inflammatory markers, coagulation studies, and cultures when infection is suspected to guide treatment and identify modifiers. Normal calcium, phosphate, or PTH does not rule it out; abnormal values support a treatment problem but are not proof that an ulcer is calciphylaxis.",
      "Skin biopsy can support the diagnosis by showing medial calcification of small dermal or subcutaneous vessels, intimal fibroplasia, thrombosis, ischemic fat change, and necrosis. Sampling must reach subcutis and is best planned by experienced dermatology and pathology teams, often at an active lesion margin rather than the dead eschar center. Special calcium stains may improve detection.",
      "Biopsy is not a harmless yes-or-no test. It can bleed, become infected, ulcerate, enlarge necrosis, or miss disease if the specimen is too superficial or from the wrong site. When the clinical picture is very characteristic or biopsy risk is unacceptable, a multidisciplinary team may treat presumptively; when mimics would change hazardous therapy, tissue may be especially valuable. A negative or nonspecific biopsy does not automatically end the evaluation.",
      "Plain radiography, mammography-type imaging, CT, or bone scintigraphy may show soft-tissue or vascular calcification, sometimes in a netlike pattern. These tests can support suspicion or identify extent, but vascular calcification is common in kidney failure and imaging protocols and accuracy are not standardized enough to replace clinical judgment and pathology.",
      "Important differentials include warfarin skin necrosis, cholesterol embolization, antiphospholipid syndrome, vasculitis, purpura fulminans, cryoglobulinemia, pyoderma gangrenosum, necrotizing soft-tissue infection, cellulitis, pressure injury, venous or arterial ulcer, hypertensive ischemic leg ulcer, oxalosis, injection injury, and cholesterol or septic emboli. Timing, pulses, organ findings, cultures, vascular studies, autoimmune testing, and biopsy are selected to discriminate these mechanisms.",
      "Distinguish calciphylaxis from warfarin-induced skin necrosis rather than equating them. Classic warfarin necrosis often begins soon after warfarin initiation during a transient procoagulant imbalance; calciphylaxis can appear after prolonged exposure and demonstrates calcified, narrowed dermal arterioles. Overlap and atypical timing occur, so the anticoagulation decision still requires hematology, nephrology, and dermatology input."
    ],
    assessment: "Assess the whole patient and the whole skin surface, not only the most visible ulcer. Establish when deep pain, firmness, mottling, purpura, blistering, or eschar began; compare the pain with the apparent surface injury; map lesion depth and distribution; and examine for a second lesion with consent. Reconcile kidney function, dialysis tolerance, mineral-bone trends, nutrition, anticoagulants, injections, trauma, perfusion, and competing vascular or inflammatory disease. At every contact, reassess infection and sepsis risk through drainage, odor, spreading inflammation, temperature, hemodynamics, mentation, and laboratory trends. Also assess sleep, mobility, intake, mood, and ability to tolerate dialysis and wound care because severe ischemic pain can destabilize each of them. No single laboratory value, image, or bedside feature replaces this converging clinical assessment.",
    differential: "The differential follows the mechanism and timing. Necrotizing soft-tissue infection and sepsis demand immediate exclusion when pain, systemic illness, crepitus, or rapid progression is present. Warfarin skin necrosis, cholesterol or septic embolization, antiphospholipid disease, vasculitis, cryoglobulinemia, purpura fulminans, pyoderma gangrenosum, pressure injury, cellulitis, venous or arterial ulceration, hypertensive ischemic ulcer, oxalosis, and injection injury can resemble parts of the presentation. Pulses, lesion geometry, medication timing, systemic organ findings, cultures, vascular studies, targeted autoimmune or coagulation testing, and a deliberately planned biopsy are selected according to the competing mechanisms. A familiar risk factor such as dialysis must not prematurely close this differential.",
    treatments: [
      "Treat suspected calciphylaxis as an urgent multidisciplinary problem. Coordinate nephrology, dermatology, wound and surgical expertise, pain or palliative care, nutrition, pharmacy, and infectious-disease support as needed. Early goals are to preserve perfusion, stop avoidable contributors, control pain, protect tissue, detect infection, and support nutrition while diagnostic uncertainty is resolved.",
      "Review warfarin, calcium supplements and binders, activated vitamin D, dialysate calcium, iron and injection practices, systemic corticosteroids, and other plausible modifiers. Do not stop essential anticoagulation casually; reassess the indication, thrombosis risk, kidney function, and alternatives with the prescribing specialists because both continued exposure and an unsafe switch can cause harm.",
      "Optimize dialysis adequacy and CKD-mineral-bone management without chasing one laboratory target. Avoid excess calcium loading and uncontrolled phosphate, and address clearly abnormal PTH. Cinacalcet may be favored for secondary hyperparathyroidism when increasing calcium or phosphate is undesirable; parathyroidectomy is reserved for selected refractory disease rather than performed solely because calciphylaxis exists. Excess suppression can worsen adynamic bone physiology.",
      "Sodium thiosulfate is widely used off label, most often integrated with hemodialysis, but no high-certainty trial proves that it heals wounds or improves survival. A specialist should define the route and schedule, monitor response rather than continue automatically, and watch for nausea, vomiting, hypotension, volume or sodium burden, QT concerns, and anion-gap metabolic acidosis. Apparent pain improvement can be meaningful but does not establish cure.",
      "Use wound care tailored to perfusion, tissue burden, infection, exudate, and patient goals. Nonadherent protection, moisture balance, pressure relief, and careful cleansing reduce additional injury. Surgical or enzymatic debridement may help selected wounds by removing infected or devitalized tissue, yet an ischemic stable eschar or poorly perfused wound may worsen after aggressive debridement. There is no universal debridement rule.",
      "Do not give prophylactic antibiotics just because an ulcer exists. Obtain appropriate cultures and treat cellulitis, deep infection, bacteremia, or sepsis promptly when clinical evidence supports infection. Source control may be necessary, and declining physiology should trigger emergency sepsis and surgical evaluation rather than routine outpatient wound follow-up.",
      "Provide multimodal analgesia with kidney-safe selection, anticipatory medication before wound care, bowel and sedation monitoring, and nonpharmacologic support. Severe pain can require opioids and specialist strategies; undertreatment impairs mobility, nutrition, dialysis, and trust, while accumulation of renally cleared drugs can cause respiratory depression or delirium.",
      "Correct protein-energy malnutrition and specific deficiencies with renal dietitian guidance rather than imposing restrictions that prevent adequate intake. Selected centers consider hyperbaric oxygen, vitamin K repletion when appropriate, bisphosphonates, or other adjuncts, but evidence is limited and patient selection matters. Kidney transplantation can improve the uremic setting in some patients but is neither an immediate antidote nor guaranteed prevention."
    ],
    contraindications: [
      "Do not rule out calciphylaxis because calcium, phosphate, PTH, or their product is normal; these current blood values do not measure cumulative exposure, local vessel biology, thrombosis, or tissue mineralization.",
      "Do not perform an unplanned superficial or central-eschar biopsy. Poor sampling can be falsely reassuring, while trauma can produce bleeding, infection, nonhealing ulceration, and additional necrosis.",
      "Do not automatically debride every eschar or, conversely, declare debridement universally forbidden. Perfusion, infection, tissue stability, surgical feasibility, and goals determine whether benefit outweighs harm.",
      "Do not use prophylactic systemic antibiotics without evidence of infection, and do not delay cultures, source control, and sepsis therapy when infection is suspected.",
      "Do not present sodium thiosulfate, hyperbaric oxygen, parathyroidectomy, vitamin K, or any other adjunct as proven curative therapy. Monitor toxicities and reassess nonresponse.",
      "Do not stop warfarin or another essential medication without a coordinated replacement plan, but do not leave a plausible modifiable contributor unreviewed."
    ],
    nursingPriorities: [
      "Assess pain quality, location, depth, onset, severity, and functional effect at baseline and before and after interventions. Report pain that is new, escalating, or disproportionate to visible findings because it may be the earliest sign of progressive ischemia or a deep infection.",
      "Map every lesion with location, size, color, induration, temperature, drainage, odor, surrounding skin, eschar, and authorized photography. Use a consistent technique because an apparent surface improvement can coexist with expanding deep injury.",
      "Protect skin from friction, pressure, adhesives, moisture, and avoidable needle trauma. Reposition using an individualized schedule and surfaces that redistribute pressure without shearing painful plaques; coordinate injection sites and access care with the team.",
      "Perform wound care exactly to the multidisciplinary plan, premedicate in time for painful procedures, maintain asepsis, and stop if unexpected bleeding or tissue separation occurs. Document tolerance because inability to complete care may require a different analgesic or wound strategy.",
      "Trend temperature, heart rate, blood pressure, mental status, CBC and ordered inflammatory data, wound drainage, and line findings. Escalate possible infection early because devitalized tissue and kidney failure can permit rapid sepsis with muted local signs.",
      "Monitor dialysis attendance and tolerance, weight, edema, intake and output, calcium-phosphate-PTH trends, bicarbonate and anion gap, ECG when ordered, and symptoms during sodium-thiosulfate therapy. Hypotension and acidosis can worsen perfusion even while a therapy is intended to help.",
      "Screen nutrition and swallowing, record intake, coordinate renal-dietitian goals, and avoid turning a restrictive renal diet into inadequate protein and energy. Support mobility, sleep, bowel function, mood, and family communication because healing depends on more than the wound dressing.",
      "Reconcile anticoagulants, calcium products, vitamin D products, binders, injections, OTC products, and supplements with exact last doses. Ensure that risk-benefit decisions and follow-up ownership are visible during every transition of care."
    ],
    redFlags: [
      "New severe deep skin pain, especially pain out of proportion to visible change, with induration, livedoid mottling, retiform purpura, necrosis, or black eschar",
      "Rapid lesion expansion, bullae, crepitus, drainage, malodor, spreading erythema, fever or hypothermia, hypotension, confusion, oliguria, or other concern for invasive infection or sepsis",
      "Painful genital, digital, facial, or other anatomically threatened involvement; loss of distal perfusion; or a wound exposing deeper structures",
      "New anion-gap acidosis, severe nausea, hypotension, rhythm concern, or declining dialysis tolerance during sodium-thiosulfate treatment",
      "Uncontrolled pain, excessive sedation, respiratory depression, inability to eat, missed dialysis, or inability to complete essential wound care"
    ],
    complications: [
      "Progressive skin and subcutaneous infarction, nonhealing ulceration, secondary bacterial or fungal infection, bacteremia, sepsis, shock, and death",
      "Severe acute and chronic pain, sleep deprivation, immobility, deconditioning, pressure injury, falls, opioid toxicity, depression, anxiety, and traumatic distress",
      "Protein and fluid loss from wounds, malnutrition, impaired rehabilitation, recurrent hospitalization, and inability to tolerate dialysis",
      "Deep-tissue destruction requiring surgery or amputation and loss of function when acral, genital, or other critical tissue is involved",
      "Treatment complications including biopsy-related necrosis, debridement-related wound expansion, sodium-thiosulfate-associated acidosis or hypotension, and anticoagulation-related thrombosis or bleeding"
    ],
    prognosis: "Calciphylaxis is life-threatening and can produce prolonged pain, nonhealing necrosis, repeated hospitalization, loss of function, sepsis, and death. Prognosis is shaped by lesion burden and location, ulceration, infection, nutrition, perfusion, comorbidity, and how early coordinated care begins; it cannot be predicted from calcium, phosphate, or response to one treatment alone. Healing, when achieved, is usually a staged process requiring control of infection and contributors, viable tissue, adequate nutrition, pain relief, and sustained wound support. No current therapy guarantees recovery, so reassessment should include both survival-related complications and the patient's function, comfort, and goals. Early palliative-care involvement can improve symptom support while disease-directed care continues and does not mean treatment has stopped.",
    prevention: "There is no proven strategy that prevents every case. Risk reduction means avoiding unnecessary calcium loading, treating CKD-mineral-bone abnormalities without oversuppression, maintaining dialysis and nutrition, reviewing warfarin and other plausible contributors with specialists, minimizing avoidable injections or trauma in vulnerable tissue, and addressing wounds and infection promptly. Routine skin surveillance in high-risk patients should treat new disproportionate pain or induration as meaningful even before ulceration. Warfarin, calcium products, vitamin D, dialysis prescriptions, or essential procedures should not be changed reflexively; their benefits and alternatives must be reviewed for the individual patient. Prophylactic antibiotics or sodium thiosulfate are not substitutes for surveillance and do not have established roles as universal prevention.",
    patientEducation: [
      "Report a new intensely painful firm, purple, mottled, or black skin area immediately, even if the surface is still closed. Earlier evaluation matters because pain may begin while the injury is still deep.",
      "Calciphylaxis usually occurs with advanced kidney disease but can occur without dialysis or even without major kidney failure. It is a blood-vessel and tissue-ischemia problem, not poor hygiene and not simply too much calcium in today's blood test.",
      "Do not cut, squeeze, heat, massage, or apply unapproved products to a lesion. Follow the wound and pressure-relief plan, keep dressings clean and dry as directed, and seek urgent help for fever, spreading redness, drainage, odor, confusion, faintness, or rapidly worsening pain.",
      "Bring all prescription, over-the-counter, vitamin, binder, injection, and anticoagulant information to visits. Never stop warfarin, dialysis, or another essential therapy on your own; clinicians must balance the calciphylaxis concern against clotting and other risks.",
      "Treatment usually combines wound protection, pain control, nutrition, dialysis and mineral-bone optimization, risk-factor review, and sometimes off-label therapies. A medicine such as sodium thiosulfate is one part of care, not a guaranteed cure, so monitoring and reassessment remain essential."
    ],
    nclexTraps: [
      "Do not wait for an ulcer. Severe pain with a deep firm plaque or retiform discoloration can precede skin breakdown and requires escalation.",
      "Do not equate calciphylaxis with hypercalcemia. Normal calcium and phosphate do not exclude it, and abnormal results alone do not diagnose it.",
      "Do not assume every dialysis wound is calciphylaxis. Infection, arterial or venous disease, pressure injury, vasculitis, emboli, and warfarin necrosis can require very different management.",
      "A biopsy can confirm characteristic vascular changes but can also harm and can miss disease. The safest answer is coordinated risk-benefit planning, adequate depth, and clinical-pathologic correlation.",
      "Do not select routine antibiotics for a clean lesion or ignore infection in a necrotic wound. Surveillance and evidence-directed treatment are different from prophylaxis.",
      "Do not describe sodium thiosulfate as proven curative. It is common off-label practice supported mainly by lower-quality evidence and requires toxicity monitoring.",
      "Pain control, nutrition, dialysis, wound strategy, medication review, and sepsis surveillance are core disease treatment, not optional comfort measures."
    ],
    relatedTopics: [
      "Chronic kidney disease-mineral and bone disorder",
      "Secondary hyperparathyroidism",
      "Adynamic bone disease",
      "Warfarin-induced skin necrosis",
      "Peripheral arterial disease",
      "Cholesterol embolization",
      "Vasculitis",
      "Necrotizing soft-tissue infection",
      "Sepsis",
      "Wound assessment",
      "Sodium thiosulfate",
      "Hemodialysis",
      "Pain management"
    ],
    aliases: [
      "calcific uremic arteriolopathy",
      "uremic calciphylaxis",
      "nonuremic calciphylaxis",
      "non-uremic calciphylaxis",
      "calcific uraemic arteriolopathy",
      "CUA",
      "painful dialysis skin necrosis",
      "painful purple plaques in dialysis",
      "calciphlaxis",
      "calciphylaxsis",
      "calciphylaxix"
    ],
    abbreviations: ["CUA"],
    ambiguousAbbreviations: ["CUA"],
    commonMisspellings: ["calciphlaxis", "calciphylaxsis", "calciphylaxix", "calcifylaxis", "calcifilaxis", "calcific uremic arteriopathy"],
    tags: [
      "calciphylaxis",
      "calcific uremic arteriolopathy",
      "nonuremic calciphylaxis",
      "pain out of proportion skin lesion",
      "retiform purpura dialysis",
      "painful black eschar kidney failure",
      "dermal arteriolar calcification",
      "normal calcium calciphylaxis",
      "sodium thiosulfate",
      "dialysis wound emergency",
      "skin ischemia",
      "wound sepsis"
    ],
    sourceKeys: ["w36-calciphylaxis-era-2025", "w36-calciphylaxis-ajkd-2015", "w36-calciphylaxis-ncbi-2023"]
  };

  const methemoglobinemia = {
    name: "Methemoglobinemia",
    displayName: "Methemoglobinemia",
    category: "Hematology, Toxicology & Emergency Medicine",
    nclexEssential: true,
    sourceNote: SOURCE_NOTE,
    definition: "Methemoglobinemia is a dyshemoglobinemia in which too much hemoglobin iron has been oxidized from the ferrous Fe2+ state to the ferric Fe3+ state. Fe3+ heme cannot bind oxygen, and its presence makes the remaining Fe2+ sites hold oxygen more tightly. The result is functional anemia: blood may contain a normal amount of hemoglobin and a normal dissolved-oxygen pressure, yet less oxygen can be carried and unloaded to tissue. Acquired disease usually follows an oxidizing medication or chemical; congenital disease results from impaired reduction pathways or an abnormal hemoglobin. Unexplained cyanosis, chocolate-brown blood, symptoms of hypoxia, and a pulse-oximeter value that changes little with oxygen should prompt immediate co-oximetry and toxicology consultation.",
    pathology: "Red cells constantly encounter oxidants, so a small amount of Fe2+ normally becomes Fe3+. The NADH-dependent cytochrome b5 reductase system converts it back and keeps methemoglobin low. An oxidant exposure can overwhelm that system, or inherited cytochrome b5 reductase deficiency can weaken it. Hemoglobin M variants stabilize iron in the ferric state. Fe3+ sites are unavailable for oxygen binding while also increasing the oxygen affinity of neighboring normal sites, shifting the dissociation relationship left. Tissue delivery therefore falls through two linked mechanisms: reduced carrying capacity and impaired unloading. Methylene blue uses a separate NADPH-dependent pathway after it is reduced to leukomethylene blue; this explains both its therapeutic effect and why inadequate NADPH generation in G6PD deficiency can make it ineffective and increase oxidative hemolysis risk.",
    pathophysiology: [
      "Oxidation changes heme chemistry: Fe2+ can reversibly bind oxygen, while Fe3+ cannot. Methemoglobin is therefore not merely deoxygenated hemoglobin; it is chemically unable to participate normally in oxygen carriage.",
      "Cooperativity magnifies the loss: ferric heme changes the conformation of the hemoglobin tetramer so remaining ferrous sites release oxygen less readily. A methemoglobin fraction can impair delivery more than an equal fraction of ordinary anemia would suggest.",
      "The primary repair pathway uses NADH-cytochrome b5 reductase. Acquired oxidant production that exceeds this capacity causes rapid disease. Erythrocyte-limited CYB5R3 deficiency causes lifelong cyanosis with relatively preserved neurologic function, whereas generalized deficiency affects tissues beyond red cells and causes severe neurologic disease.",
      "The rescue pathway depends on G6PD-derived NADPH to reduce methylene blue to leukomethylene blue, which donates electrons to ferric heme. G6PD deficiency reduces this rescue capacity, and unreduced or excessive methylene blue can itself act as an oxidant.",
      "Clinical severity reflects more than the reported percentage. Anemia, cardiac or pulmonary disease, sepsis, acidosis, age, exposure duration, and concurrent carbon monoxide or cyanide toxicity reduce reserve. A patient with ischemia or altered mentation may need urgent antidotal action at a lower fraction than a healthy asymptomatic patient."
    ],
    etiology: "Acquired methemoglobinemia follows oxidant stress. Important causes include dapsone and its metabolites; benzocaine and prilocaine and, less often, other local anesthetics; nitrates or nitrites in medications, contaminated well water, food, or intentional ingestion; nitric oxide; aniline dyes; rasburicase; primaquine; phenazopyridine; chlorates; and various industrial or agricultural chemicals. Multiple modest exposures can combine, and impaired clearance can prolong risk. Infants are more susceptible because fetal hemoglobin oxidizes more readily and reductase activity is lower. Congenital forms include biallelic CYB5R3-related cytochrome b5 reductase deficiency and autosomal-dominant hemoglobin M variants. Congenital disease should be considered with lifelong cyanosis, affected relatives, persistent elevation without an exposure, or recurrence, but a known congenital condition does not prevent a superimposed acquired oxidant crisis.",
    riskFactors: [
      "Use or overdose of an oxidizing agent, particularly dapsone, topical benzocaine or prilocaine, nitrate or nitrite products, inhaled nitric oxide, rasburicase, primaquine, phenazopyridine, or aniline-containing chemicals",
      "Combined oxidant exposures, renal or hepatic impairment that prolongs a culprit or metabolite, enteric recirculation such as with dapsone, or continued skin, mucosal, inhaled, or gastrointestinal absorption",
      "Infancy, especially with nitrate-contaminated well water or significant diarrheal illness, because reductive capacity and physiologic reserve differ from adults",
      "Congenital cytochrome b5 reductase deficiency, hemoglobin M, or another rare reduction-pathway disorder",
      "Anemia, coronary or cerebrovascular disease, lung disease, sepsis, acidosis, pregnancy, or other states with limited oxygen-delivery reserve",
      "G6PD deficiency and serotonergic medication use do not necessarily cause the methemoglobinemia, but they materially alter the safety of methylene-blue treatment"
    ],
    signsSymptoms: [
      "Clinical signs — Central and peripheral cyanosis may look slate gray or blue and often improves little with supplemental oxygen. Skin pigmentation, lighting, perfusion, and anemia can make cyanosis subtle, so its absence does not exclude a clinically important level.",
      "Clinical signs — Freshly drawn blood may remain chocolate brown rather than becoming bright red when exposed to air. This is a useful clue, not a bedside confirmation and not a reason to delay co-oximetry.",
      "Clinical signs — Standard pulse oximetry often drifts toward the mid-80% range and changes less than expected with high inspired oxygen. The number is neither the true functional oxygen saturation nor a reliable measure of severity.",
      "Early tissue-hypoxia symptoms include headache, fatigue, dizziness, anxiety, nausea, tachycardia, tachypnea, dyspnea, weakness, or exercise intolerance. These symptoms are nonspecific, so connect them to exposure history and oxygen-measurement discordance.",
      "Severe toxicity can cause confusion, agitation, syncope, chest pain, ischemic ECG change, dysrhythmia, hypotension, metabolic acidosis, seizure, coma, or cardiovascular collapse. Coexisting anemia or heart-lung disease can produce severe symptoms at a lower methemoglobin fraction.",
      "Congenital erythrocyte-limited disease may cause persistent cyanosis with fewer symptoms than the color suggests; generalized cytochrome b5 reductase deficiency causes serious developmental and neurologic impairment. Hemoglobin M commonly causes lifelong cyanosis and typically responds poorly to methylene blue."
    ],
    diagnostics: [
      "Because functional hemoglobin can fall while PaO2 remains deceptively normal, evaluate oxygenation, ventilation, perfusion, neurologic status, and the exposure source while co-oximetry is being obtained; stop the oxidant and provide high-concentration oxygen without waiting for confirmation. Oxygen does not reduce ferric iron, but it maximizes oxygen carried by still-functional hemoglobin and dissolved in plasma while the diagnosis and antidote decision are made.",
      "Confirm with arterial or venous blood gas co-oximetry, which uses multiple wavelengths to directly distinguish oxyhemoglobin, deoxyhemoglobin, carboxyhemoglobin, and methemoglobin. Either arterial or venous blood can quantify methemoglobin; obtain an arterial sample when PaO2, ventilation, or a concurrent lung problem must also be assessed.",
      "Understand the saturation gap. A conventional arterial blood gas commonly calculates oxygen saturation from PaO2 and assumes ordinary hemoglobin, so it can report a reassuring calculated saturation while the pulse oximeter remains low. PaO2 measures oxygen dissolved in plasma and may be normal because the lung transferred oxygen correctly. The difference between pulse oximetry and the calculated value suggests a dyshemoglobin but is not specific and cannot replace co-oximetry.",
      "Conventional two-wavelength pulse oximetry is distorted because methemoglobin absorbs both wavelengths and drives the display toward approximately 85% as the fraction rises. A stable 85% is not a therapeutic target, and a displayed improvement after methylene blue may itself be affected by the blue dye. Follow symptoms, serial co-oximetry, hemodynamics, acid-base status, and end-organ findings.",
      "Take a precise exposure history: generic and brand medicines; topical sprays or gels used during procedures; dapsone indication and last doses; nitrates, nitrites, well water, recreational products, workplace chemicals, and shared exposures. Contact Poison Control or a medical toxicologist early because product concentration, metabolites, absorption route, and delayed recurrence change management.",
      "Check CBC and smear, reticulocytes, bilirubin, LDH, haptoglobin, electrolytes, kidney and liver function, lactate, ECG, and organ-directed studies as appropriate. Evaluate hemolysis before and after treatment. G6PD testing is important when methylene blue is being considered, but urgent life-saving decisions may precede a result, and testing during acute hemolysis or after transfusion can be misleadingly normal.",
      "When no acquired cause is found or cyanosis is lifelong, hematology may use reductase activity, hemoglobin analysis, family studies, and molecular testing to distinguish CYB5R3 deficiency from hemoglobin M and other dyshemoglobins. Sulfhemoglobinemia, carboxyhemoglobinemia, cyanide toxicity, congenital heart disease, severe lung disease, sepsis, and artifact remain important alternatives or coexposures."
    ],
    assessment: "Begin with airway, breathing, circulation, mental status, hemodynamics, work of breathing, chest symptoms, neurologic findings, and the possibility of an ongoing exposure. Ask exactly which prescription, topical, procedural, recreational, occupational, food, or water source was involved, how much, by which route, and when; review serotonergic medicines and possible G6PD deficiency before antidotal decisions. Compare the patient's appearance and symptoms with SpO2, PaO2, calculated saturation, and direct co-oximetry rather than trusting one oxygen number. Assess hemoglobin concentration, cardiovascular and pulmonary reserve, pregnancy, infancy, anemia, acidosis, kidney and liver function, and evidence of hemolysis because a given methemoglobin fraction can have very different clinical consequences in different patients. Repeat assessment after exposure removal and treatment because rebound and treatment toxicity are possible.",
    differential: "Cyanosis or unexplained low pulse oximetry can reflect pulmonary gas-exchange failure, congenital or acquired cardiac shunting, hypoventilation, shock, severe anemia with poor perfusion, carboxyhemoglobinemia, sulfhemoglobinemia, cyanide toxicity, peripheral vasoconstriction, or device and sampling artifact. A normal PaO2 with persistent cyanosis points toward a dyshemoglobin but does not identify which one. Co-oximetry separates major hemoglobin species, while exposure history, lactate, ECG, imaging, blood count, acid-base data, and organ-directed testing address coexisting toxic or cardiopulmonary disease. Lifelong cyanosis raises CYB5R3 deficiency or hemoglobin M; an abrupt change after a drug or chemical favors acquired oxidation. The diagnosis should explain both the measured species and the patient's physiology.",
    treatments: [
      "Stop the oxidizing drug or exposure, decontaminate only when safely indicated, support airway and circulation, and provide high-concentration oxygen. Call Poison Control or a medical toxicologist because symptom burden, fraction, culprit, timing, comorbidity, pregnancy, and contraindications determine treatment more safely than one universal number.",
      "Use intravenous methylene blue for clinically significant acquired methemoglobinemia when benefits outweigh risks. Specialist protocols use a weight-based dose and reassess symptoms and co-oximetry promptly before any repeat. Repeated or excessive administration can cause hemolysis and paradoxically worsen methemoglobinemia, so failure to improve should trigger diagnostic and treatment reassessment rather than unlimited redosing.",
      "Methylene blue works only after NADPH-dependent reduction to leukomethylene blue. The FDA-labeled product is contraindicated in G6PD deficiency because response may be poor and severe hemolysis or anemia may occur. When severe methemoglobinemia and possible G6PD deficiency collide, obtain immediate toxicology, hematology, and transfusion support rather than making a casual bedside assumption.",
      "Methylene blue is also a potent monoamine oxidase inhibitor. It can precipitate serotonin syndrome with SSRIs, SNRIs, MAO inhibitors and other serotonergic medicines. In a life-threatening emergency the team may judge that antidotal benefit exceeds interaction risk, but this requires medication reconciliation, toxicology-guided risk assessment, close neurologic and autonomic monitoring, and a plan for serotonergic drugs—not the false claim that the interaction is irrelevant or always an absolute reason to withhold rescue.",
      "Consider alternatives when methylene blue is contraindicated, unavailable, ineffective, or the diagnosis involves hemoglobin M. Ascorbic acid reduces methemoglobin more slowly and has variable regimens and evidence; it is not an equally rapid substitute in a crashing patient. Severe refractory disease may require red-cell exchange transfusion, simple transfusion in selected anemia, or hyperbaric oxygen through toxicology, hematology, transfusion-medicine, and hyperbaric specialists.",
      "Expect delayed or rebound methemoglobinemia after long-acting oxidants, notably dapsone and its hydroxylamine metabolites. Enterohepatic recirculation and continued metabolite formation can raise the level again after an initial response. Continue serial co-oximetry and symptom monitoring; toxicology may recommend repeated-dose activated charcoal in a selected ingestion with a protected airway or additional antidotal and extracorporeal strategies.",
      "Manage congenital disease according to subtype and symptoms. Avoid known oxidants. Some patients with cytochrome b5 reductase deficiency use specialist-directed methylene blue or ascorbic acid, while hemoglobin M generally does not respond to methylene blue because the structural globin change stabilizes Fe3+. Genetic counseling and an emergency exposure plan reduce repeated misdiagnosis and unsafe therapy."
    ],
    contraindications: [
      "Do not diagnose severity from conventional pulse oximetry or a calculated ABG saturation. Confirm and trend with co-oximetry while treating the patient and end-organ signs.",
      "Do not assume a normal PaO2 excludes tissue hypoxia. PaO2 reports dissolved oxygen, not whether ferric hemoglobin can carry and unload it.",
      "Do not give repeated methylene-blue doses without reassessment. Excess can cause oxidative hemolysis and paradoxical methemoglobinemia.",
      "The FDA-labeled methylene-blue product is contraindicated in known G6PD deficiency because of severe hemolysis risk and inadequate NADPH-dependent effect; urgent refractory cases require specialist alternatives.",
      "Do not overlook serotonergic drugs. Methylene blue can produce serotonin toxicity through monoamine oxidase inhibition, so emergency risk-benefit decisions require expert monitoring and a medication plan.",
      "Do not discharge a dapsone or other long-acting oxidant exposure after one improved number without an observation and repeat-testing plan for rebound."
    ],
    nursingPriorities: [
      "Assess airway, work of breathing, respiratory rate, circulation, neurologic state, chest symptoms, perfusion, and exposure timing immediately. Apply high-concentration oxygen and escalate end-organ symptoms even when PaO2 appears normal because functional oxygen delivery may still be critically impaired.",
      "Compare the pulse-oximeter trend with the co-oximeter result and clearly label calculated versus directly measured values during handoff. Avoid repeatedly changing oxygen or delaying treatment in pursuit of a conventional SpO2 number that the device cannot interpret correctly.",
      "Obtain and preserve an exact medication and exposure history, including dapsone, topical anesthetics used during endoscopy or dentistry, nitrates or nitrites, well water, nitric oxide, rasburicase, industrial products, and serotonergic medicines. Contact Poison Control or toxicology and record their recommendations.",
      "Before methylene blue, identify known G6PD deficiency, prior hemolysis, serotonergic therapy, pregnancy, renal impairment, and allergies while not delaying a truly life-saving escalation. Use the verified concentration, independent dose check, compatible line and solution per current product instructions, and monitor during administration.",
      "Trend serial co-oximetry, symptoms, mental status, ECG, blood pressure, lactate and acid-base data, urine color and output, and hemolysis markers as ordered. Methylene blue can discolor urine and interfere with optical monitors; visual color change alone does not prove either toxicity or recovery.",
      "Watch for serotonin syndrome after methylene blue: new agitation or confusion, diaphoresis, fever, diarrhea, tremor, clonus, hyperreflexia, rigidity, autonomic instability, or seizure. Report a compatible cluster immediately rather than attributing it to anxiety or persistent hypoxia.",
      "Continue observation after apparent response when the source is dapsone, aniline, or another long-acting oxidant. Recurrent cyanosis, headache, dyspnea, altered mentation, or a rising co-oximeter fraction can represent rebound and requires prompt toxicology-guided treatment.",
      "For congenital disease, document the subtype, baseline cyanosis and methemoglobin range when known, usual treatment response, oxidants to avoid, specialist contacts, and medical-alert plan so future clinicians do not repeatedly treat a baseline color as acute lung failure."
    ],
    redFlags: [
      "Cyanosis or low pulse-oximeter readings that improve little with high-concentration oxygen, especially after dapsone, a topical anesthetic, nitrate/nitrite, nitric oxide, rasburicase, or chemical exposure",
      "Chocolate-brown blood, a saturation gap, or a normal PaO2 that conflicts with cyanosis and hypoxia symptoms; obtain urgent co-oximetry",
      "Altered mental status, seizure, syncope, chest pain, ischemic ECG changes, dysrhythmia, hypotension, acidosis, rising lactate, or cardiovascular collapse",
      "Recurrent symptoms or a rising methemoglobin fraction after initial improvement, particularly following dapsone exposure",
      "Hemolysis after methylene blue or oxidant exposure, or agitation, clonus, hyperreflexia, fever, and autonomic instability suggesting serotonin syndrome"
    ],
    complications: [
      "Tissue hypoxia with myocardial or cerebral ischemia, dysrhythmia, seizure, coma, shock, cardiac arrest, and death",
      "Hemolytic anemia from the original oxidant, G6PD vulnerability, or excessive methylene blue, with jaundice, kidney injury, and worsened oxygen delivery",
      "Rebound methemoglobinemia after a long-acting or recirculating exposure, especially dapsone, causing recurrent hypoxia after initial improvement",
      "Serotonin syndrome when methylene blue interacts with serotonergic medicines",
      "Aspiration or other harm during unsafe decontamination, and delayed diagnosis when low SpO2 is treated only as lung disease",
      "In congenital generalized reductase deficiency, severe developmental and neurologic impairment; in chronic cyanosis, polycythemia and repeated unnecessary cardiopulmonary procedures"
    ],
    prognosis: "Acquired methemoglobinemia often improves when the oxidant is stopped, oxygen delivery is supported, and an appropriate antidotal strategy is used, but severe or delayed treatment can cause myocardial or cerebral ischemia, dysrhythmia, seizure, shock, or death. Prognosis depends on symptoms, exposure duration and metabolism, anemia, acidosis, heart-lung reserve, age, and whether hemolysis or another poison is also present rather than on one percentage alone. Dapsone and other long-acting oxidants can produce delayed recurrence after apparent improvement, so a reassuring early response does not end observation. Erythrocyte-limited congenital disease may permit chronic cyanosis with variable symptoms, whereas generalized reductase deficiency can cause major neurologic impairment. Follow-up must match the cause and verify that both symptoms and co-oximetry remain improved.",
    prevention: "Prevent acquired episodes by identifying and avoiding the responsible oxidant, reconciling all topical and systemic medicines, and using dose, storage, labeling, ventilation, and occupational controls appropriate to the product. Procedural teams should recognize risks from topical anesthetics and document prior reactions; patients using dapsone or another oxidant need symptom teaching and the monitoring plan chosen for their indication. Protect infants from nitrate-contaminated water and unreviewed remedies because their reductive capacity and oxygen reserve differ from adults. A person with congenital methemoglobinemia or G6PD deficiency should carry an accurate medical-alert record and a clinician-reviewed avoid list. Prevention is exposure-specific: a broad label such as 'avoid all anesthetics' is inaccurate and can itself obstruct safe care.",
    patientEducation: [
      "Seek emergency help for blue or gray lips or skin, shortness of breath, severe headache, confusion, fainting, chest pain, or seizure after a medication, numbing spray, well-water, chemical, nitrate, or nitrite exposure. Do not drive yourself.",
      "This condition changes hemoglobin iron so it cannot carry oxygen normally. Oxygen pressure in the blood can look normal and an ordinary finger monitor can be misleading; a co-oximeter is needed to identify the abnormal hemoglobin.",
      "Bring the product, medication container, or a photo of its label when safe, and report every prescription, nonprescription, topical, recreational, and workplace exposure. Never intentionally re-test a suspected oxidant.",
      "If you take dapsone, symptoms can return after initial treatment because active metabolites remain in the body. Follow the observation and repeat-blood-test plan and return immediately if cyanosis, fatigue, headache, breathlessness, or confusion returns.",
      "If you have congenital methemoglobinemia or G6PD deficiency, carry a medical-alert record naming the condition, substances to avoid, your specialist, and how you have responded to methylene blue. Tell clinicians about antidepressants and migraine or pain medicines because some are serotonergic."
    ],
    nclexTraps: [
      "Methemoglobin contains Fe3+, which cannot bind oxygen; the remaining Fe2+ sites also hold oxygen more tightly. This is functional anemia and impaired unloading, not merely bronchospasm or low inspired oxygen.",
      "A normal PaO2 does not mean oxygen delivery is normal. It measures oxygen dissolved in plasma, while co-oximetry measures hemoglobin species.",
      "The saturation gap is a clue, not a diagnosis. Carboxyhemoglobin, sulfhemoglobin, device error, and calculation differences can also create discordance.",
      "Do not titrate care to a pulse oximeter hovering near 85%. Two-wavelength devices are intrinsically unreliable in methemoglobinemia.",
      "Methylene blue needs G6PD-derived NADPH. Known G6PD deficiency raises the risks of poor response and severe hemolysis, and excessive doses can become oxidizing even without known deficiency.",
      "Methylene blue is a monoamine oxidase inhibitor, so reconcile serotonergic medicines and monitor for serotonin syndrome. A life-threatening antidote decision belongs with toxicology, not a simplistic yes-or-no rule.",
      "Dapsone commonly teaches the rebound principle: an improved initial co-oximeter value does not end monitoring when active metabolites and enterohepatic cycling remain.",
      "Congenital cytochrome b5 reductase deficiency and hemoglobin M are not interchangeable. Hemoglobin M generally responds poorly to methylene blue."
    ],
    relatedTopics: [
      "Oxygen-hemoglobin dissociation curve",
      "Co-oximetry",
      "Dapsone",
      "Methylene blue",
      "G6PD deficiency",
      "Serotonin syndrome",
      "Carbon monoxide poisoning",
      "Cyanide poisoning",
      "Sulfhemoglobinemia",
      "Hemolytic anemia",
      "Pulse oximetry limitations",
      "Functional anemia",
      "Poison Control"
    ],
    aliases: [
      "methemoglobinaemia",
      "acquired methemoglobinemia",
      "congenital methemoglobinemia",
      "dapsone methemoglobinemia",
      "benzocaine methemoglobinemia",
      "ferric hemoglobin toxicity",
      "oxidized hemoglobin",
      "blue patient normal PaO2",
      "chocolate brown blood",
      "methemaglobinemia",
      "methemoglobinema"
    ],
    abbreviations: ["MetHb", "MetHgb"],
    ambiguousAbbreviations: ["MetHb"],
    commonMisspellings: ["methemaglobinemia", "methemoglobinema", "methaemoglobinaemia", "methemaglobinaemia", "met hemoglobinemia", "methemoglobenemia"],
    tags: [
      "methemoglobinemia",
      "methemoglobinaemia",
      "Fe3+ hemoglobin",
      "functional anemia",
      "saturation gap",
      "co-oximetry",
      "chocolate brown blood",
      "cyanosis normal PaO2",
      "pulse ox stuck at 85",
      "dapsone rebound",
      "methylene blue G6PD",
      "methylene blue serotonin syndrome",
      "toxicology emergency"
    ],
    sourceKeys: ["w36-methem-eha-2022", "w36-methem-fda-provayblue-2024", "w36-methem-ncbi-2025"]
  };

  const cerebralSaltWasting = {
    name: "Cerebral salt wasting",
    displayName: "Cerebral salt wasting",
    category: "Neurology, Nephrology & Electrolyte Emergencies",
    nclexEssential: true,
    sourceNote: SOURCE_NOTE,
    definition: "Cerebral salt wasting (CSW), also called cerebral or renal salt-wasting syndrome, is a proposed cause of hypotonic hyponatremia after an intracranial disorder in which the kidneys lose sodium inappropriately, water follows, and extracellular and intravascular volume contract. The fall in effective volume then stimulates antidiuretic hormone appropriately, so urine can remain concentrated even though plasma is hypo-osmolar. This creates a dangerous resemblance to SIADH: both can show low serum osmolality, concentrated urine, high urine sodium, and hypouricemia, yet true salt wasting needs sodium and volume replacement while routine fluid restriction can worsen hypovolemia. The syndrome's definition, frequency, mechanisms, and best discriminators remain debated. It must be treated as a carefully supported longitudinal diagnosis, not assigned from brain injury plus one high urine-sodium result.",
    pathology: "The proposed initiating event is renal natriuresis after a cerebral insult. Reduced renal sympathetic drive, increased natriuretic peptides, altered renin-angiotensin-aldosterone signaling, and other tubular factors have been proposed, but no single mechanism or biomarker is established. Persistent sodium loss lowers extracellular solute, and urinary water loss contracts circulating volume. Baroreceptors then stimulate vasopressin and thirst appropriately to defend perfusion; retained free water can deepen the hyponatremia while the kidney continues losing sodium. The causal sequence matters: in CSW, sodium loss and volume depletion are primary and ADH is responding to hypovolemia; in SIADH, inappropriate antidiuresis is primary and secondary natriuresis tends to preserve a clinically euvolemic state. At the bedside, volume findings and fluid balance are noisy, treatments alter the data, and both mechanisms may be considered during acute brain disease, so repeated integrated assessment is safer than a fixed checklist.",
    pathophysiology: [
      "A cerebral event such as aneurysmal subarachnoid hemorrhage, traumatic brain injury, neurosurgery, stroke, infection, or tumor creates a context in which renal sodium handling can change. Association does not prove the syndrome; pain, nausea, drugs, cortisol deficiency, IV fluids, and kidney dysfunction can produce competing hyponatremia in the same patient.",
      "In the proposed CSW sequence, renal sodium excretion exceeds intake despite falling effective circulating volume. Water accompanies sodium, creating negative sodium balance, negative fluid balance, weight loss, and hypovolemic physiology if replacement does not keep pace.",
      "Hypovolemia becomes a nonosmotic signal for vasopressin. Concentrated urine is therefore physiologically appropriate for preserving circulation even while low serum osmolality would normally suppress ADH. This explains why urine osmolality alone cannot separate CSW from SIADH.",
      "Hyponatremia shifts water into brain cells and can worsen cerebral edema, while volume depletion may impair systemic and cerebral perfusion. In subarachnoid hemorrhage, both consequences are concerning, which is why euvolemia and careful sodium management matter more than winning a label quickly.",
      "Treatment changes the diagnostic picture. Restoring volume can suppress appropriate ADH, increase dilute urine, and accelerate sodium correction; ongoing natriuresis can then make hyponatremia recur when replacement stops. Serial balances and response patterns are more informative than an isolated urine specimen, but response to saline is still not perfectly specific."
    ],
    etiology: "CSW has been reported after aneurysmal subarachnoid hemorrhage, traumatic brain injury, intracranial surgery, ischemic or hemorrhagic stroke, central nervous system infection, and brain tumors. Its true prevalence is uncertain because published definitions differ and bedside volume classification is unreliable. Some experts prefer the broader term renal salt wasting because similar physiology has been proposed without cerebral disease; others argue that many reported cases are SIADH, ordinary hypovolemia, adrenal insufficiency, or treatment effects. Use the term as a working pathophysiologic diagnosis only when hypotonic hyponatremia, ongoing renal sodium loss, and credible extracellular-volume depletion remain coherent after excluding stronger alternatives. A brain lesion is context, not a diagnostic test.",
    riskFactors: [
      "Recent aneurysmal subarachnoid hemorrhage, traumatic brain injury, neurosurgery, stroke, central nervous system infection, or intracranial tumor",
      "High urine output and sodium losses that exceed administered sodium and fluid, particularly when weight, hemodynamics, or cumulative balance suggest contraction",
      "Complex neurocritical care with osmotic agents, diuretics, large fluid shifts, glucocorticoid changes, nausea, pain, mechanical ventilation, or enteral losses that can create or obscure similar physiology",
      "Inadequate sodium or isotonic-fluid replacement during ongoing natriuresis, or fluid restriction applied before credible hypovolemia has been excluded",
      "Limited physiologic reserve, cerebral edema, vasospasm or delayed cerebral ischemia risk, cardiac disease, or kidney dysfunction, which increases the harm from either volume depletion or over-replacement",
      "Chronic malnutrition, alcohol use disorder, liver disease, hypokalemia, or very low sodium, which increase concern for harm if correction becomes too rapid"
    ],
    signsSymptoms: [
      "Clinical signs — Findings that may support volume depletion include falling weight, negative cumulative balance, orthostatic or persistent hypotension, otherwise unexplained tachycardia, dry mucosa, low jugular venous pressure, reduced central filling measures when clinically obtained, cool extremities, hemoconcentration, or prerenal kidney findings. No single sign is sufficiently accurate by itself.",
      "Clinical signs — Urine output may be high and replacement needs may rise, but polyuria is neither required nor specific. Diuretics, osmotic diuresis, diabetes insipidus, resolving acute kidney injury, and high solute delivery must be considered.",
      "Clinical signs — Mild or evolving hyponatremia may cause headache, nausea, gait instability, attention change, lethargy, muscle cramps, or confusion. These symptoms overlap the underlying brain injury, medication effects, and rising intracranial pressure, so any change needs neurologic reassessment rather than automatic attribution to sodium.",
      "Clinical signs — Acute severe hyponatremia can produce vomiting, marked confusion, agitation, seizure, depressed consciousness, respiratory compromise, or signs of cerebral edema. Symptom severity and rate of fall drive emergency treatment even before CSW versus SIADH is settled.",
      "Clinical signs — Worsening neurologic examination, reduced cerebral perfusion concern, oliguria, rising creatinine, or hemodynamic instability may reflect harmful volume contraction; crackles, rising oxygen need, edema, hypertension, or cardiac strain may instead indicate over-replacement or another diagnosis."
    ],
    diagnostics: [
      "First confirm true hypotonic hyponatremia. Repeat a questionable sodium, measure serum osmolality, account for hyperglycemia and exogenous osmoles, and exclude pseudohyponatremia when the laboratory method and context make it possible. A low sodium number alone does not define either CSW or SIADH.",
      "Obtain urine osmolality and urine sodium near the serum sample before major therapy when feasible, but do not delay emergency treatment for severe symptoms. Both CSW and SIADH often have urine that is inappropriately concentrated for the plasma and urine sodium above common screening cutoffs. Diuretics, kidney disease, recent saline, osmotic agents, and variable intake can invalidate simple interpretation.",
      "Demonstrate the proposed process over time: sodium output exceeding intake, ongoing renal sodium loss, negative fluid balance, falling weight, and converging evidence of extracellular or intravascular depletion despite appropriate measurement. Because routine physical examination misses mild hypovolemia and charted intake/output is imperfect, combine bedside, laboratory, hemodynamic, medication, and response data rather than declaring volume status from dry mucosa or one central venous pressure.",
      "Exclude more established explanations: SIADH; diuretic effect; adrenal insufficiency, including glucocorticoid withdrawal or pituitary injury; kidney failure; gastrointestinal or third-space losses; osmotic diuresis from glucose, mannitol, or urea; hypothyroidism when clinically relevant; heart or liver failure; excessive hypotonic intake; and diabetes insipidus with replacement of dilute urine by free water.",
      "Compare the mechanisms explicitly. SIADH is primarily excess antidiuresis with clinical euvolemia after compensatory sodium excretion; CSW is proposed primary natriuresis with true volume depletion and appropriate ADH. High urine sodium, concentrated urine, low serum urate, and increased fractional urate excretion can occur in both during hyponatremia, so none of these is a stand-alone discriminator.",
      "Fractional excretion of urate has been proposed as a dynamic aid: it may normalize after sodium correction in SIADH but remain elevated in renal salt wasting. This approach is not universally accepted, depends on kidney function and medications, and lacks enough standardization to overrule an incoherent clinical picture. Treat it as supporting evidence, not a definitive biomarker.",
      "Response to isotonic saline can add evidence. A truly volume-depleted patient may suppress ADH after repletion, begin excreting dilute urine, and improve sodium, whereas persistent SIADH may not correct and can sometimes worsen as sodium is excreted while water is retained. Mixed physiology, ongoing losses, kidney impairment, and prior therapy blur this distinction; monitor the response rather than using an unobserved fluid challenge as proof.",
      "Trend sodium, potassium, chloride, bicarbonate, glucose, urea/BUN, creatinine, magnesium, serum and urine osmolality, urine electrolytes, urate when useful, weight, hemodynamics, neurologic status, and cumulative sodium-fluid balance. Reconsider the diagnosis whenever the trajectory contradicts it."
    ],
    assessment: "Assessment must demonstrate a coherent physiologic trajectory rather than attach a label to one urine sodium. Confirm hypotonic hyponatremia, perform frequent neurologic and hemodynamic examinations, and trend weight, timed intake and output, urine concentration, sodium balance, kidney function, and evidence of extracellular-volume depletion. Record diuretics, osmotic agents, glucocorticoids, enteral and intravenous fluids, gastrointestinal losses, and the timing of paired serum and urine specimens because treatment can rapidly change the pattern. Look simultaneously for cerebral edema from hyponatremia, impaired perfusion from volume loss, and pulmonary or cardiac stress from replacement. No single bedside sign accurately establishes volume status; agreement among serial measurements, losses, treatment response, and the underlying neurologic course is more persuasive than any isolated value.",
    differential: "SIADH is the central competing diagnosis because both syndromes can show hypotonic hyponatremia, concentrated urine, and elevated urine sodium. The proposed distinction is primary renal sodium loss with genuine volume depletion in cerebral salt wasting versus inappropriate antidiuresis with clinical euvolemia after compensatory natriuresis in SIADH. Also exclude diuretic effect, adrenal insufficiency or glucocorticoid withdrawal, kidney failure, gastrointestinal or third-space loss, hyperglycemia and other osmotic diuresis, mannitol, hypothyroidism when relevant, low-solute or excessive hypotonic intake, heart or liver failure, pseudohyponatremia, and diabetes insipidus whose dilute urine is being replaced with free water. Mixed states occur, so a diagnostic label must be revised when serial balance, urine behavior, or response to treatment contradicts it.",
    treatments: [
      "If severe neurologic symptoms are plausibly due to hyponatremia, give protocol-directed hypertonic saline to achieve a small prompt rise while protecting airway and treating seizure. Emergency symptom relief does not require waiting to distinguish CSW from SIADH. Frequent sodium and neurologic checks are essential because the goal is controlled improvement, not immediate normalization.",
      "For credible CSW, replace sodium and intravascular volume according to symptoms, hemodynamics, measured losses, and serial sodium. Isotonic saline may address volume depletion; hypertonic saline is used when symptoms or severity require more concentrated sodium; oral or enteral salt can support ongoing needs in stable patients. Match the plan to dynamic urine losses rather than prescribing a fixed volume indefinitely.",
      "Avoid routine fluid restriction when true salt wasting and hypovolemia are supported. Restriction treats free-water excess in SIADH but can deepen volume contraction, reduce kidney and cerebral perfusion, and intensify nonosmotic ADH in CSW. When the diagnosis is uncertain, neurocritical care, nephrology, or endocrinology should guide a closely observed strategy rather than an automatic restriction or unlimited fluid loading.",
      "In aneurysmal subarachnoid hemorrhage, target euvolemia. Prophylactic hypervolemia does not improve the underlying problem and can cause pulmonary edema or cardiac stress. Replace documented losses and preserve perfusion while continuing disease-specific surveillance for vasospasm, delayed cerebral ischemia, hydrocephalus, seizures, and other causes of neurologic decline.",
      "A mineralocorticoid such as fludrocortisone may reduce natriuresis and fluid requirements in selected persistent cases, particularly in subarachnoid hemorrhage care. Evidence supports effects on sodium balance more clearly than improved neurologic outcome. Monitor potassium, blood pressure, edema, pulmonary status, and cardiac function because hypokalemia, hypertension, and fluid overload can offset benefit.",
      "Set an individualized maximum correction plan based on acuity and osmotic-demyelination risk, count potassium repletion as part of the sodium trajectory, and anticipate spontaneous water diuresis after volume restoration. If sodium begins rising too rapidly, stop the driver and use protocol-directed desmopressin and electrolyte-free water when indicated under expert supervision.",
      "Treat the underlying brain disorder and every competing contributor. Review diuretics and hypotonic fluids, replace cortisol when adrenal insufficiency is established or urgently suspected, manage hyperglycemia and osmotic agents, and reassess nutrition and solute delivery. A CSW label should never stop the search for a second treatable cause."
    ],
    contraindications: [
      "Do not diagnose CSW from hyponatremia plus intracranial disease, high urine sodium, concentrated urine, or polyuria alone. Each finding has common alternative explanations.",
      "Do not fluid-restrict a patient with supported hypovolemic salt wasting; restriction can worsen perfusion and stimulate more ADH. Conversely, do not give unbounded saline to a patient whose physiology supports SIADH or cardiac intolerance.",
      "Do not delay hypertonic saline for severe hyponatremic symptoms while debating etiology, and do not attempt immediate normalization after initial symptom improvement.",
      "Do not rely on a single bedside volume sign, CVP value, serum urate, fractional urate excretion, or response to one saline bolus as a definitive test.",
      "Do not ignore correction speed after volume repletion. Suppression of ADH can trigger abrupt water diuresis and dangerous overcorrection.",
      "Do not use fludrocortisone without monitoring potassium, blood pressure, oxygenation, edema, and cardiac status, and do not claim that correcting natriuresis necessarily improves neurologic outcome."
    ],
    nursingPriorities: [
      "Perform frequent neurologic assessment using the same method and distinguish baseline brain-injury findings from new headache, nausea, confusion, seizure, declining consciousness, or focal change. Escalate change immediately because sodium disturbance, rebleeding, vasospasm, hydrocephalus, seizure, infection, and medication effects can look similar.",
      "Maintain accurate timed intake and output, including IV solutions, medication carriers, enteral water, drains, emesis, stool, and urine. Report urine output that suddenly rises or exceeds replacement because a changing balance can precede hypotension, sodium decline, or overcorrection.",
      "Obtain daily or more frequent weights under consistent conditions and trend blood pressure, orthostatic response when safe, heart rate, mucosa, jugular venous findings, edema, lung sounds, oxygen need, perfusion, and renal markers. Interpret the cluster rather than charting 'dry' or 'euvolemic' without evidence because no single bedside sign reliably defines volume status, and excessive replacement can cause congestion.",
      "Draw paired serum and urine studies at ordered times and record what fluids, diuretics, osmotic therapies, tube feeds, and glucocorticoids were active. This context is essential because treatment can change urine sodium and osmolality within hours, which explains why two apparently contradictory results may both be physiologically appropriate.",
      "Administer isotonic or hypertonic saline through the correct access and pump with an independent check according to facility protocol. Trend sodium at the ordered short intervals during active correction because symptomatic hyponatremia requires controlled correction, while an unverified value can prompt an unsafe infusion change; notify the team before changing the infusion based on one result.",
      "Watch for a sudden dilute high-volume diuresis after volume restoration because loss of the prior ADH stimulus can cause sodium to climb faster than planned. Record the exact onset, obtain ordered urine data, and escalate promptly so the team can consider stopping therapy, desmopressin, or electrolyte-free water.",
      "During fludrocortisone therapy, monitor potassium, blood pressure, edema, lung sounds, oxygenation, weight, and fluid balance because mineralocorticoid-driven sodium retention can also cause potassium wasting, hypertension, and volume overload. Report hypokalemia, hypertension, pulmonary congestion, or cardiac symptoms before further doses.",
      "Make the working diagnosis and uncertainty explicit in handoff: evidence for and against CSW, current correction ceiling, latest sodium and trend, cumulative balance, urine output, replacement plan, rescue plan for overcorrection, and which service owns reassessment. This precision matters because the receiving team must distinguish ongoing natriuresis from treatment-driven water diuresis before safely changing replacement."
    ],
    redFlags: [
      "Seizure, rapidly declining consciousness, severe confusion, repeated vomiting, respiratory compromise, or other severe symptoms with hyponatremia",
      "Worsening focal neurologic deficit, abrupt severe headache, or declining examination after a cerebral insult; do not attribute automatically to sodium",
      "Hypotension, unexplained tachycardia, falling weight, marked negative balance, rising creatinine, cool perfusion, or escalating urine and sodium losses",
      "Sodium rising faster than the individualized correction ceiling, especially with sudden high-volume dilute urine after volume restoration",
      "New crackles, hypoxemia, edema, hypertension, chest symptoms, or cardiac strain during saline or fludrocortisone therapy",
      "Hypokalemia, dysrhythmia, or recurrent hyponatremia when replacement is reduced"
    ],
    complications: [
      "Cerebral edema, seizure, aspiration, coma, respiratory arrest, and death from acute or severe hyponatremia",
      "Hypovolemia with hypotension, acute kidney injury, impaired cerebral perfusion, and possible contribution to secondary neurologic ischemia",
      "Recurrent sodium decline when ongoing natriuresis exceeds replacement or a transient response is mistaken for resolution",
      "Pulmonary edema, hypertension, heart failure, and electrolyte burden from excessive saline or mineralocorticoid therapy",
      "Hypokalemia and dysrhythmia during mineralocorticoid treatment or brisk diuresis",
      "Osmotic demyelination and permanent neurologic injury when chronic or high-risk hyponatremia is corrected too rapidly",
      "Harm from diagnostic anchoring, including fluid restriction in true hypovolemia or unneeded volume loading in SIADH"
    ],
    prognosis: "Outcome depends heavily on the underlying brain disorder, severity and duration of hyponatremia, degree of volume depletion, and safety of correction. A supported salt-wasting pattern may resolve as the neurologic insult and natriuresis improve, but the timing is not reliably predicted and recurrence can follow premature withdrawal of replacement. Severe hyponatremia can cause cerebral edema, seizure, coma, and respiratory failure; hypovolemia can impair kidney and cerebral perfusion. Treatment can also worsen outcome through pulmonary edema, hypokalemia, or osmotic demyelination if replacement is excessive or correction becomes too rapid. Prognosis therefore requires two parallel trends: neurologic recovery and stable sodium-volume physiology without ongoing rescue therapy or treatment toxicity.",
    prevention: "The initiating neurologic injury and the proposed renal salt-wasting response are not always preventable. Preventable harm comes from surveillance and disciplined fluid management: monitor sodium, urine output, weight, and cumulative balance after high-risk neurologic events; investigate a falling sodium before severe symptoms develop; avoid unreviewed hypotonic fluid; and do not impose automatic fluid restriction until credible hypovolemia has been excluded. In aneurysmal subarachnoid hemorrhage, maintain goal-directed euvolemia rather than prophylactic hypervolemia. During replacement, schedule frequent sodium checks, anticipate water diuresis after volume restoration, and keep an explicit correction ceiling and rescue plan. These steps prevent complications of delayed recognition, misclassification, under-replacement, overload, and overcorrection; they do not prove that CSW itself has been prevented.",
    patientEducation: [
      "This diagnosis means the team suspects the kidneys are losing salt and water after a brain problem, causing low blood sodium and low circulating volume. It can look nearly identical to SIADH on initial tests, so repeated blood, urine, weight, and fluid-balance checks are necessary.",
      "Report worsening headache, nausea, confusion, unusual sleepiness, weakness, unsteadiness, faintness, seizure, shortness of breath, swelling, or a major change in urination immediately. These can reflect low sodium, the brain condition, low volume, treatment complications, or another urgent cause.",
      "Do not change water, salt, electrolyte drinks, tablets, or medicines on your own. Fluid restriction can be harmful in true salt wasting, while excess water or salt can be harmful in other forms of hyponatremia; the safe plan depends on current physiology.",
      "The goal is a controlled sodium rise and stable circulation, not making the sodium normal as quickly as possible. Correction that is too fast can injure the brain even when the low number initially improves.",
      "If fludrocortisone or salt supplementation continues after discharge, keep all laboratory and blood-pressure checks and ask for a written plan covering dose ownership, fluid goals, symptoms requiring urgent care, and when therapy will be reassessed."
    ],
    nclexTraps: [
      "CSW and SIADH can both have hypotonic hyponatremia, concentrated urine, high urine sodium, low serum urate, and cerebral disease. The conceptual distinction is hypovolemia from primary sodium loss versus clinical euvolemia from primary inappropriate antidiuresis.",
      "High urine sodium does not prove CSW. Diuretics, saline, kidney disease, adrenal insufficiency, osmotic diuresis, and SIADH can all raise it.",
      "A brain injury is a risk context, not a diagnostic criterion. Establish ongoing renal loss and credible volume contraction and exclude stronger explanations.",
      "Fluid restriction is a common SIADH treatment but can be dangerous in true CSW. Replacement is appropriate only with close reassessment because overloading a misclassified patient is also harmful.",
      "Treat severe hyponatremic neurologic symptoms promptly with protocol-directed hypertonic saline before the etiologic debate is finished, then stop after the intended small initial rise and control the remaining correction.",
      "After volume replacement, ADH may switch off and a water diuresis may rapidly raise sodium. More urine is not always worsening salt wasting; inspect urine concentration and the whole trajectory.",
      "Fludrocortisone can reduce natriuresis but can cause hypokalemia, hypertension, and fluid overload, and improved sodium balance does not guarantee improved neurologic outcome.",
      "Diabetes insipidus usually produces dilute high-volume urine and tends toward hypernatremia unless free water replacement obscures it; polyuria alone does not separate DI from salt wasting."
    ],
    relatedTopics: [
      "SIADH",
      "Hyponatremia",
      "Hypertonic saline",
      "Osmotic demyelination syndrome",
      "Aneurysmal subarachnoid hemorrhage",
      "Traumatic brain injury",
      "Delayed cerebral ischemia",
      "Adrenal insufficiency",
      "Diabetes insipidus",
      "Fractional excretion of urate",
      "Fluid volume assessment",
      "Fludrocortisone",
      "Serum and urine osmolality"
    ],
    aliases: [
      "cerebral salt-wasting syndrome",
      "cerebral salt wasting syndrome",
      "CSW syndrome",
      "CSWS",
      "renal salt wasting",
      "renal salt-wasting syndrome",
      "cerebral renal salt wasting",
      "salt wasting after brain injury",
      "hyponatremia with hypovolemia after SAH",
      "cerebal salt wasting",
      "cerebral salt waisting",
      "cerbral salt wasting"
    ],
    abbreviations: ["CSW", "CSWS", "RSW"],
    ambiguousAbbreviations: ["CSW", "RSW"],
    commonMisspellings: ["cerebal salt wasting", "cerebral salt waisting", "cerbral salt wasting", "cerebral salt waisting syndrome", "cereberal salt wasting"],
    tags: [
      "cerebral salt wasting",
      "renal salt wasting",
      "CSW versus SIADH",
      "hyponatremia after SAH",
      "hyponatremia hypovolemia high urine sodium",
      "natriuresis after brain injury",
      "negative sodium balance",
      "fluid restriction danger",
      "hypertonic saline",
      "fludrocortisone",
      "hyponatremia correction",
      "diagnostic uncertainty"
    ],
    sourceKeys: ["w36-csw-aha-asa-2023", "w36-csw-european-hyponatremia-2014", "w36-csw-fact-fiction-2020", "w36-csw-siadh-review-2023"]
  };

  const cards = [calciphylaxis, methemoglobinemia, cerebralSaltWasting];
  const results = [];

  cards.forEach((card) => {
    const key = normalize(card.name);
    const matches = database.diseases.filter((entry) => normalize(titleOf(entry)) === key);
    let target = matches[0] || null;
    if (target) Object.assign(target, card);
    else {
      target = { ...card };
      database.diseases.push(target);
    }

    let removedDuplicateCount = 0;
    for (let index = database.diseases.length - 1; index >= 0; index -= 1) {
      const entry = database.diseases[index];
      if (entry !== target && normalize(titleOf(entry)) === key) {
        database.diseases.splice(index, 1);
        removedDuplicateCount += 1;
      }
    }

    results.push(Object.freeze({
      canonicalName: card.name,
      aliases: Object.freeze(card.aliases.slice()),
      sourceKeys: Object.freeze(card.sourceKeys.slice()),
      sourceCount: card.sourceKeys.length,
      removedDuplicateCount
    }));
  });

  window.ANI_PATHOLOGY_WAVE36_A = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    applied: true,
    sourceNote: SOURCE_NOTE,
    cardCount: cards.length,
    sourceCount: sourceReferences.length,
    cards: Object.freeze(results)
  });
})();
