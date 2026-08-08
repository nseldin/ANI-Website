/* eslint-disable */
/* SGLT2/SGLT1 pharmacology, perioperative logic, and linked renal physiology. */
(function () {
  window.ANI_PHARM_DATABASE = window.ANI_PHARM_DATABASE || {};
  window.ANI_PATHOLOGY_DATABASE = window.ANI_PATHOLOGY_DATABASE || {};
  const db = window.ANI_PHARM_DATABASE;
  const pathology = window.ANI_PATHOLOGY_DATABASE;
  db.drugs = Array.isArray(db.drugs) ? db.drugs : [];
  pathology.diseases = Array.isArray(pathology.diseases) ? pathology.diseases : [];

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const unique = (values) => Array.from(new Set((values || []).filter(Boolean)));
  const examples = ["Empagliflozin", "Dapagliflozin", "Canagliflozin", "Ertugliflozin", "Bexagliflozin", "Sotagliflozin"];
  const exampleKeys = examples.map(normalize);

  const populationRisks = (pediatric, older, pregnancy) => [
    { type: "pediatric", label: "Pediatric caution", note: pediatric },
    { type: "geriatric", label: "Older adult caution", note: older },
    { type: "pregnancy", label: "Pregnancy and lactation", note: pregnancy }
  ];

  const classCard = (card) => ({
    ...card,
    generic: normalize(card.name),
    displayName: card.name,
    classCard: true,
    isDrugClassCard: true,
    entryType: "drug-class-card",
    classExampleNames: card.classExampleNames || examples,
    classExampleKeys: card.classExampleKeys || exampleKeys,
    expandedIndex: false,
    hidden: false,
    studentFacing: true,
    nclexEssential: true,
    templateKey: "curated drug class card",
    confidenceTier: "Curated full study card",
    whyClosureRevision: "2026-07-17-sglt2-drug-specific"
  });

  const drugCard = (card) => ({
    ...card,
    generic: normalize(card.name),
    displayName: card.name,
    entryType: "drug",
    classCard: false,
    isDrugClassCard: false,
    classExampleNames: [],
    classExampleKeys: [],
    expandedIndex: false,
    hidden: false,
    studentFacing: true,
    nclexEssential: true,
    templateKey: "curated full study card",
    confidenceTier: "Curated full study card",
    whyClosureRevision: "2026-07-17-sglt2-drug-specific"
  });

  const classCards = [
    classCard({
      name: "SGLT2 inhibitor drug-specific comparison",
      aliases: [
        "gliflozin comparison", "SGLT2 drug comparison", "which SGLT2 inhibitor",
        "SGLT2 indications compared", "SGLT2 surgery hold comparison", "SGLT2 differences"
      ],
      class: "SGLT2 and dual SGLT2-SGLT1 inhibitor class comparison",
      classPathway: ["Endocrine and cardiorenal pharmacology", "SGLT2-directed therapy", "Drug-specific indication and safety map"],
      usedToTreat: "This comparison distinguishes agents that share renal glucose transport pharmacology but do not share every indication. Empagliflozin and dapagliflozin have broad heart-failure and chronic-kidney-disease outcome indications; canagliflozin has selected cardiovascular and albuminuric diabetic-nephropathy indications; ertugliflozin and bexagliflozin are labeled for glycemic control in adults with type 2 diabetes; sotagliflozin is labeled for cardiovascular and heart-failure outcomes rather than glycemic control. The distinction matters because class membership cannot substitute for product-specific outcome evidence.",
      description: "SGLT2-directed drugs reduce proximal-tubule sodium and glucose reclamation, causing glycosuria, mild natriuresis, and osmotic diuresis. They look interchangeable at the transporter level, but their labels differ in outcome evidence, ages, kidney thresholds, dose timing, and surgical interruption. Empagliflozin and dapagliflozin can be used for selected heart-failure or CKD outcomes without diabetes because those benefits extend beyond A1c reduction. Ertugliflozin and human bexagliflozin are glycemic drugs rather than automatic heart-failure or CKD substitutes. Sotagliflozin also inhibits intestinal SGLT1, so diarrhea and first-meal timing become part of its identity. The exact generic, brand, indication, eGFR, and current label determine whether a particular gliflozin fits the patient and treatment goal.",
      mechanism: "SGLT2 normally reabsorbs most filtered glucose with sodium in the early proximal tubule. Blocking it lowers the renal glucose threshold, leaves glucose in urine, increases distal sodium delivery, and changes volume and glomerular hemodynamics. More sodium reaching the macula densa restores tubuloglomerular feedback and reduces excessive intraglomerular pressure, which helps explain the early hemodynamic eGFR dip and longer-term kidney benefit seen with outcome-proven agents. During fasting, illness, surgery, insulin reduction, or low-carbohydrate intake, the insulin-to-glucagon ratio can fall while glycosuria prevents marked hyperglycemia; lipolysis and hepatic ketogenesis can therefore produce euglycemic diabetic ketoacidosis. Sotagliflozin adds intestinal SGLT1 inhibition, delaying glucose-sodium absorption and contributing to diarrhea, although the exact mechanism of its cardiovascular outcome benefit is not fully established.",
      boxedWarning: "No current human U.S. SGLT2-directed product in this comparison carries a boxed warning. That does not make the class low-risk because ketoacidosis, intravascular volume contraction, serious genitourinary infection, Fournier gangrene, hypersensitivity, and lower-limb complications can become life threatening. Bexacat's boxed warning belongs to a veterinary bexagliflozin product for cats only and must never be transferred to the human Brenzavvy label or interpreted as a human product instruction.",
      adverseEffects: [
        "Glycosuria promotes genital fungal growth because glucose-rich moist tissue supports yeast; recurrent symptoms therefore need treatment and hygiene teaching rather than being dismissed as unrelated.",
        "Natriuresis and osmotic diuresis can cause orthostasis, dehydration, transient creatinine change, or AKI because intravascular volume falls, especially with loop diuretics, poor intake, fever, vomiting, older age, or impaired kidney reserve.",
        "Ketoacidosis may occur with glucose below 200 to 250 mg/dL because urinary glucose loss masks the hyperglycemia while insulin deficiency and counterregulatory hormones continue driving ketone production.",
        "Lower-limb ulcer, infection, ischemia, osteomyelitis, or prior amputation raises amputation concern because damaged tissue with poor perfusion can progress before systemic symptoms become dramatic."
      ],
      contraindications: [
        "Do not use a product after serious hypersensitivity to that drug because re-exposure can provoke angioedema or anaphylaxis.",
        "Do not use these products as routine glycemic therapy for type 1 diabetes because insulin deficiency creates a substantially higher ketoacidosis risk and none of these human labels provides a U.S. type 1 glycemic indication.",
        "Do not assume one eGFR threshold applies to the class because glucose lowering requires filtered glucose while some heart or kidney outcome indications remain useful at lower eGFR; using the wrong threshold can either deny benefit or produce ineffective glycemic treatment.",
        "Avoid routine use during the second and third trimesters and avoid breastfeeding under current labels because animal renal-development findings and possible exposure during active kidney maturation create fetal or infant concern."
      ],
      nursingEssentials: [
        "Verify why the patient receives the drug, not only whether diabetes is present, because heart-failure, CKD, cardiovascular-risk, and glycemic indications have different products, doses, ages, and renal thresholds.",
        "Withhold empagliflozin, dapagliflozin, canagliflozin, bexagliflozin, and sotagliflozin for at least 3 days before major surgery or prolonged fasting when possible, but withhold ertugliflozin for at least 4 days because its current product label specifies the longer interruption.",
        "Restart only when the patient is clinically stable, hydrated, eating, and free of active ketoacidosis because resuming during fasting or insulin-deficient stress can restart ketone production even when bedside glucose looks acceptable.",
        "Inspect feet and ask about genital or perineal pain, urinary symptoms, intake, vomiting, and dyspnea because the most dangerous class complications are often recognized from symptoms before a routine glucose check identifies them."
      ],
      interactions: [
        "Loop or thiazide diuretics can add volume loss because both therapies reduce effective circulating volume, so orthostasis, renal function, and congestion response need individualized review.",
        "Insulin and insulin secretagogues can add hypoglycemia because the background regimen may become excessive after glucose control improves, even though SGLT2 blockade itself does not force insulin release.",
        "SGLT2-mediated urinary transport can lower lithium concentration because renal lithium excretion may increase, so levels need closer monitoring after initiation or dose change.",
        "Sotagliflozin can increase digoxin exposure and UGT inducers can lower sotagliflozin or canagliflozin exposure, so drug-specific interaction review matters even within one transporter class."
      ],
      keyLabs: [
        "Assess beta-hydroxybutyrate, bicarbonate, anion gap, venous or arterial pH, potassium, and renal function when nausea, vomiting, abdominal pain, malaise, or tachypnea occurs because glucose alone cannot exclude SGLT2-associated DKA.",
        "Trend creatinine and eGFR with volume status because a small early stable dip can reflect tubuloglomerular hemodynamics, while a progressive rise with hypotension, oliguria, or dehydration suggests pathologic AKI.",
        "Use plasma glucose and A1c for glycemic response because urine glucose is an intended pharmacologic effect and cannot reliably report blood-glucose control on an SGLT2 inhibitor.",
        "Monitor product-specific outcomes such as heart-failure events, congestion, albuminuria, CKD progression, or cardiovascular risk because A1c alone cannot prove benefit for a cardiorenal indication."
      ],
      nclexTraps: [
        "Heart-failure and kidney-outcome indications are product-specific because only the trial evidence and labeling for each drug establish those benefits.",
        "Ertugliflozin requires at least 4 days of interruption before surgery or prolonged fasting because current Steglatro labeling uses the longer interval to let persistent glucose-wasting and ketone-prone physiology recede; several other gliflozins specify at least 3 days.",
        "Normal-looking glucose does not exclude DKA when ketones, anion-gap acidosis, abdominal symptoms, or Kussmaul-type breathing are present because glycosuria can conceal the hyperglycemic signal.",
        "Bexacat is a veterinary bexagliflozin product for cats only; Brenzavvy is the U.S. human bexagliflozin product, so their species, dose, formulation, screening, and warning instructions are not interchangeable."
      ],
      populationRisks: populationRisks(
        "Use only within each product's pediatric indication because several agents have adult-only outcome or glycemic labels even when another class member is approved from age 10.",
        "Correct dehydration and use extra caution with diuretics, frailty, autonomic dysfunction, low blood pressure, or reduced renal reserve because osmotic diuresis can produce disproportionate hypotension and AKI.",
        "Avoid routine second- and third-trimester use and breastfeeding under current labels because developing kidneys are vulnerable during those periods; untreated diabetes or heart failure also carries risk, so specialist planning is necessary."
      ),
      sourceNote: "Current U.S. DailyMed labels for Jardiance, Farxiga, Invokana, Steglatro, Brenzavvy, and Inpefa.",
      tags: ["frontier-wave20", "SGLT2", "SGLT1", "gliflozin comparison", "drug-specific indication", "strict why closure"]
    }),

    classCard({
      name: "SGLT2 perioperative hold and restart logic",
      aliases: [
        "why hold SGLT2 before surgery", "gliflozin surgery hold", "Jardiance before surgery",
        "Farxiga before surgery", "SGLT2 three day hold", "ertugliflozin four day hold", "SGLT2 restart after surgery"
      ],
      class: "Perioperative ketoacidosis-prevention pathway for SGLT2-directed drugs",
      classPathway: ["Perioperative medication safety", "SGLT2-directed therapy", "Fasting and ketogenesis prevention"],
      usedToTreat: "This is a safety pathway for patients taking an SGLT2-directed drug who will undergo major surgery or a procedure with prolonged fasting. It prevents avoidable perioperative ketoacidosis because surgical stress, reduced carbohydrate intake, dehydration, and insulin reduction all lower the insulin-to-glucagon ratio while drug-induced glycosuria can keep glucose deceptively modest.",
      description: "SGLT2 inhibitors block proximal-tubule glucose-sodium reabsorption, and their glucose-wasting effect can persist after the last tablet, so this perioperative safety pathway interrupts them for days before major surgery or prolonged fasting to reduce euglycemic-DKA risk. Current U.S. labels specify at least 3 days for empagliflozin, dapagliflozin, canagliflozin, bexagliflozin, and sotagliflozin, but at least 4 days for ertugliflozin because its product label requires the longer interruption. The purpose is not to prevent ordinary hypoglycemia. The hold allows glycosuria and the ketone-prone metabolic state to recede before fasting, stress hormones, reduced intake, and perioperative insulin changes converge. Emergency surgery cannot wait for a full washout, so the missing hold interval becomes a reason for closer ketone, acid-base, fluid, and insulin surveillance rather than a reason to delay lifesaving care.",
      mechanism: "Surgery raises catecholamines, cortisol, glucagon, and inflammatory stress while fasting removes carbohydrate and nausea or bowel preparation can deplete volume. If basal insulin is reduced too far, adipose lipolysis releases free fatty acids that the liver converts to beta-hydroxybutyrate and acetoacetate. SGLT2 blockade simultaneously sends glucose into urine, so plasma glucose may remain below the level clinicians associate with classic DKA. The result can be high-anion-gap metabolic acidosis with substantial ketonemia but no dramatic glucose alarm. A multi-day hold reduces this residual pharmacology; resuming only after hemodynamic stability and reliable oral intake restores carbohydrate and insulin context before transporter blockade returns.",
      boxedWarning: "These human products do not carry a class boxed warning for surgery, but perioperative euglycemic DKA can be fatal because a normal-looking glucose may delay insulin, dextrose, fluids, potassium management, and closure of the anion gap. Stop the drug and evaluate ketones and acid-base status whenever unexplained nausea, vomiting, abdominal pain, tachypnea, malaise, or acidosis appears, even if the planned hold was completed.",
      adverseEffects: [
        "Perioperative euglycemic DKA can cause dehydration, tachypnea, electrolyte loss, shock, arrhythmia, cerebral complications, prolonged hospitalization, or death because ketone acidosis continues without an obvious hyperglycemic warning.",
        "Volume depletion can worsen induction-related hypotension and prerenal injury because fasting, bowel preparation, diuretics, blood loss, and SGLT2 osmotic diuresis can remove volume through different pathways."
      ],
      contraindications: [
        "Do not restart while the patient remains fasting, vomiting, hemodynamically unstable, volume depleted, or ketotic because the precipitating metabolic conditions are still active.",
        "Do not substitute a negative urine ketone test for serum beta-hydroxybutyrate when suspicion is high because early DKA can be beta-hydroxybutyrate dominant and urine testing can lag.",
        "Do not stop basal insulin solely because the patient is NPO because absolute or relative insulin deficiency drives ketogenesis; perioperative insulin adjustment requires a protocol rather than omission."
      ],
      nursingEssentials: [
        "Reconcile the exact generic and last dose because ertugliflozin requires the 4-day distinction while the other listed products use at least 3 days under current U.S. labels.",
        "For urgent surgery without a full hold, notify the perioperative team and trend beta-hydroxybutyrate, anion gap, bicarbonate, pH, glucose, potassium, renal function, intake, and volume status because risk persists despite a modest bedside glucose.",
        "Document the restart decision rather than automatically resuming the home list because clinical stability, hydration, oral intake, and resolution of ketoacidosis must be established first."
      ],
      interactions: [
        "Diuretics, bowel preparation, and restricted intake add volume loss because each lowers effective circulating volume before anesthesia.",
        "Insulin reduction can amplify ketogenesis because SGLT2 therapy does not replace the anti-lipolytic and anti-ketogenic action of insulin.",
        "A ketogenic or very-low-carbohydrate diet adds substrate pressure toward ketone production because carbohydrate restriction lowers insulin signaling and increases fatty-acid use."
      ],
      keyLabs: [
        "Measure serum beta-hydroxybutyrate because it directly captures the dominant ketone in DKA and can reveal danger before urine acetoacetate testing becomes strongly positive.",
        "Trend bicarbonate, anion gap, and pH because DKA is an acid-base emergency, not a diagnosis made or excluded by glucose alone.",
        "Monitor potassium before and during insulin therapy because total-body potassium is depleted even when serum potassium initially looks normal or high, and insulin can rapidly shift it into cells.",
        "Continue insulin with protocol-directed dextrose when glucose is already low enough because ketone clearance requires insulin while dextrose prevents treatment-induced hypoglycemia."
      ],
      nclexTraps: [
        "Do not answer 'hold the morning of surgery' because current SGLT2 labels use multi-day interruption to address persistent glycosuria and ketoacidosis risk.",
        "Do not answer 'all SGLT2 drugs are held 3 days' because ertugliflozin is held at least 4 days under its current U.S. label.",
        "Do not restart simply because surgery is over because the patient must be stable and eating, with ketoacidosis resolved if it occurred.",
        "Do not withhold dextrose merely because DKA is present because euglycemic DKA often needs dextrose so insulin can continue clearing ketones safely."
      ],
      populationRisks: populationRisks(
        "Use pediatric product and institutional perioperative guidance because ages and indications differ and children can dehydrate quickly.",
        "Use extra surveillance in older adults because frailty, CKD, diuretics, autonomic dysfunction, and reduced thirst can magnify fasting-related volume loss.",
        "Pregnancy itself favors accelerated ketosis, so vomiting, fasting, diabetes, and SGLT2 exposure require urgent specialist assessment rather than reassurance from a modest glucose."
      ),
      sourceNote: "Current U.S. DailyMed product labels and the 2024 ADA/EASD hyperglycemic-crises consensus report.",
      tags: ["frontier-wave20", "SGLT2", "perioperative hold", "euglycemic DKA", "three days", "four days", "strict why closure"]
    }),

    classCard({
      name: "SGLT2 cardiorenal pathway and euglycemic ketoacidosis",
      aliases: [
        "SGLT2 inhibitor mechanism", "why SGLT2 causes euglycemic DKA", "gliflozin heart kidney benefits",
        "SGLT2 kidney protection mechanism", "SGLT2 early eGFR dip", "SGLT2 macula densa"
      ],
      class: "Proximal-tubule glucose-sodium transport inhibition with glycemic, volume, glomerular, and ketone consequences",
      classPathway: ["Endocrine and renal pharmacology", "SGLT2-directed therapy", "Glycosuria, tubuloglomerular feedback, and ketogenesis"],
      usedToTreat: "Product-specific therapy for type 2 diabetes, heart failure, chronic kidney disease, cardiovascular risk, or combinations of those conditions. The word product-specific matters because similar transporter action does not prove that every gliflozin has every outcome indication.",
      description: "This pathway card explains the apparent paradox at the center of SGLT2 therapy. Blocking proximal glucose-sodium reabsorption can protect a hyperfiltering glomerulus and improve heart-failure outcomes, yet the same urinary glucose loss can conceal life-threatening ketoacidosis. Glycosuria lowers glucose without requiring insulin, natriuresis reduces volume, and increased sodium delivery to the macula densa restores tubuloglomerular feedback. During fasting or illness, however, low insulin and high glucagon still drive fat breakdown and hepatic ketone production. The kidney removes glucose while acids accumulate, so glucose may look reassuring precisely when beta-hydroxybutyrate, bicarbonate, anion gap, and pH are becoming dangerous.",
      mechanism: "SGLT2 in the S1 proximal tubule uses the sodium gradient to reclaim most filtered glucose; basolateral GLUT2 then returns glucose to blood. Inhibition lowers the renal glucose threshold, producing glycosuria, natriuresis, osmotic diuresis, and modest calorie loss. More distal NaCl reaches macula-densa NKCC2 transporters, increasing ATP/adenosine signaling and afferent arteriolar tone, which reduces excessive intraglomerular pressure. That hemodynamic reset can cause a small early eGFR dip before longer-term nephron protection. Meanwhile, fasting, infection, surgery, alcohol, pancreatic disease, low-carbohydrate intake, dehydration, or insulin reduction lowers the insulin-to-glucagon ratio. Hormone-sensitive lipase releases fatty acids, hepatic beta-oxidation creates ketones, and SGLT2-mediated glucose loss prevents the usual marked hyperglycemia. This is euglycemic DKA, not benign nutritional ketosis, because ketonemia is accompanied by clinically important metabolic acidosis.",
      boxedWarning: "No current human U.S. class boxed warning. Treat suspected ketoacidosis immediately because delay can cause shock, electrolyte-mediated arrhythmia, cerebral complications, respiratory fatigue, or death even when glucose is below 200 to 250 mg/dL. Withhold the product during label-specified surgical or prolonged-fasting intervals and restart only after stability and oral intake return because ongoing fasting preserves the ketone-producing physiology.",
      adverseEffects: [
        "Expected glycosuria and mild diuresis can become dehydration, hypotension, or AKI because urinary glucose obligates water loss and sodium delivery changes volume handling.",
        "Genital mycotic infection, UTI, pyelonephritis, urosepsis, and rare Fournier gangrene can occur because glucose-rich urine and local tissue conditions favor infection while severe perineal infection can spread rapidly.",
        "Euglycemic DKA can occur because ketogenesis depends on insulin and glucagon balance while glycosuria independently lowers plasma glucose.",
        "A small early eGFR decline can occur because afferent glomerular pressure falls; a progressive decline with hypotension or oliguria is different and can indicate AKI."
      ],
      contraindications: [
        "Do not use the class as a replacement for insulin in type 1 diabetes because transporter blockade cannot suppress lipolysis or ketogenesis when insulin is deficient.",
        "Do not initiate through active volume depletion because additional osmotic diuresis can cause symptomatic hypotension and renal hypoperfusion.",
        "Do not dismiss abdominal symptoms or dyspnea based on glucose alone because glycosuria specifically removes the usual hyperglycemic warning signal."
      ],
      nursingEssentials: [
        "Ask about fasting, surgery, ketogenic eating, alcohol, vomiting, infection, insulin reduction, and pancreatic disease because these clues identify the low-insulin states that precipitate SGLT2-associated DKA.",
        "Differentiate an expected early eGFR dip from AKI by trending timing, magnitude, blood pressure, volume status, urine output, and recovery because one reflects hemodynamic unloading while the other may reflect injury.",
        "Teach genital hygiene, hydration, foot care, and urgent perineal-pain reporting because common local effects and rare necrotizing infection arise from the same glucose-rich and vulnerable tissue environment."
      ],
      interactions: [
        "Diuretics add volume loss because both treatments reduce effective circulating volume, increasing orthostasis and prerenal risk.",
        "Insulin and secretagogues add hypoglycemia because their glucose-lowering action continues while SGLT2 blockade removes glucose through urine.",
        "Lithium levels can fall because SGLT2-directed therapy may increase renal lithium excretion, so a previously stable psychiatric regimen can become subtherapeutic."
      ],
      keyLabs: [
        "Check beta-hydroxybutyrate, bicarbonate, anion gap, pH, potassium, creatinine/eGFR, and glucose when symptoms fit because DKA is defined by ketosis and acidosis rather than a required extreme glucose value.",
        "Trend eGFR and volume status after initiation because the expected hemodynamic dip should stabilize, while persistent deterioration requires evaluation for dehydration, sepsis, obstruction, nephrotoxin exposure, or another AKI cause.",
        "Do not use urine glucose to judge diabetes control because pharmacologic glycosuria persists by design and can continue after the last dose."
      ],
      nclexTraps: [
        "Glucose 170 mg/dL does not rule out DKA when an SGLT2-treated patient has vomiting, abdominal pain, tachypnea, ketones, or an anion gap because urinary glucose loss masks hyperglycemia.",
        "The early eGFR dip does not automatically mean nephrotoxicity because restored tubuloglomerular feedback lowers intraglomerular pressure; clinical context separates adaptation from AKI.",
        "SGLT2 drugs are not loop diuretics because their primary site is proximal sodium-glucose cotransport rather than NKCC2 blockade in the thick ascending limb."
      ],
      populationRisks: populationRisks(
        "Use only within a product's pediatric indication because outcome evidence and glycemic approvals differ among agents.",
        "Older adults with CKD, low blood pressure, diuretics, or impaired thirst need closer volume surveillance because glycosuria can produce disproportionate dehydration.",
        "Avoid routine later-pregnancy and breastfeeding exposure under current labels because renal development is active and animal data show renal pelvis and tubular effects."
      ),
      sourceNote: "Current U.S. SGLT2-directed labels and renal physiology literature on macula-densa tubuloglomerular feedback.",
      tags: ["frontier-wave20", "SGLT2", "cardiorenal", "euglycemic DKA", "macula densa", "tubuloglomerular feedback", "strict why closure"]
    })
  ];

  const drugCards = [
    drugCard({
      name: "Empagliflozin",
      aliases: ["Jardiance", "empagliflozine", "empagliflozin SGLT2", "Jardiance heart failure", "Jardiance kidney protection"],
      brandExamples: ["Jardiance"],
      class: "Selective renal SGLT2 inhibitor with glycemic and broad cardiorenal outcome indications",
      classPathway: ["Endocrine and cardiorenal medication", "SGLT2 inhibitor", "Proximal glycosuria and tubuloglomerular-feedback restoration"],
      usedToTreat: "Empagliflozin improves glycemic control in adults and children age 10 years and older with type 2 diabetes; in adults it also reduces cardiovascular death in type 2 diabetes with established cardiovascular disease, reduces cardiovascular death and hospitalization in heart failure, and reduces CKD progression and cardiorenal events in chronic kidney disease at risk of progression. The dose and goal must be identified because increasing from 10 to 25 mg is a glycemic decision, not a proven way to multiply heart or kidney outcome benefit.",
      description: "Empagliflozin is a once-daily SGLT2 inhibitor that blocks early proximal-tubule glucose-sodium reabsorption. It makes urine glucose-positive, produces mild natriuresis and osmotic diuresis, and restores distal sodium signaling to the macula densa. That one transport action explains four seemingly unrelated findings: lower plasma glucose, an early eGFR dip, lower heart-failure congestion risk, and genital infection or dehydration. It also explains the dangerous paradox of euglycemic DKA: ketones can rise during insulin-deficient stress while excess glucose leaves in urine, so a glucose of 180 mg/dL is not reassuring when vomiting or tachypnea is present.",
      mechanism: "Empagliflozin selectively inhibits SGLT2 in the S1 proximal tubule, preventing sodium-coupled uptake of filtered glucose into tubular cells and reducing basolateral glucose return through GLUT2. Filtered glucose therefore remains in urine, lowering plasma glucose independent of insulin and obligating water loss; accompanying natriuresis changes plasma and interstitial volume. Increased NaCl delivery to the macula densa strengthens tubuloglomerular feedback, reducing excessive afferent flow and intraglomerular pressure, which explains the small early hemodynamic eGFR dip and longer-term nephron protection. During fasting, surgery, infection, low-carbohydrate intake, alcohol use, pancreatic insulin deficiency, or insulin dose reduction, low insulin and high glucagon activate lipolysis and hepatic ketogenesis. Urinary glucose loss blunts hyperglycemia but does not neutralize ketone acids, producing euglycemic diabetic ketoacidosis (DKA).",
      boxedWarning: "No current U.S. boxed warning. Stop empagliflozin and urgently assess beta-hydroxybutyrate and acid-base status when nausea, vomiting, abdominal pain, malaise, or dyspnea occurs because ketoacidosis can be fatal below 200 to 250 mg/dL glucose. Withhold at least 3 days before surgery or prolonged fasting when possible and restart only after clinical stability and oral intake return because residual glycosuria plus fasting can sustain ketogenesis. Promptly evaluate genital or perineal pain, fever, urinary sepsis symptoms, dehydration, and foot ulcers because Fournier gangrene, urosepsis, hypotension, AKI, and limb complications can progress rapidly.",
      adverseEffects: [
        "Genital mycotic infection and urinary symptoms occur because pharmacologic glycosuria supplies glucose to the genitourinary environment.",
        "Polyuria, orthostasis, hypotension, transient creatinine rise, or AKI can occur because glucose and sodium loss contract effective circulating volume.",
        "Euglycemic DKA can occur because insulin-deficient ketogenesis continues while urinary glucose excretion limits hyperglycemia.",
        "Lower-limb complications require surveillance because diabetic foot infection, peripheral artery disease, prior ulcers, and prior amputation identify vulnerable tissue."
      ],
      contraindications: [
        "Do not use after serious hypersensitivity to empagliflozin because re-exposure can provoke angioedema or another severe reaction.",
        "Do not use it as type 1 diabetes glycemic treatment because the ketoacidosis risk rises when endogenous insulin reserve is low.",
        "Do not use the glycemic indication below eGFR 30 mL/min/1.73 m2 because too little filtered glucose reaches the transporter for reliable A1c lowering, even though adult heart or kidney indications use different renal logic."
      ],
      nursingEssentials: [
        "Verify whether the goal is glycemic, heart-failure, CKD, or cardiovascular risk reduction because response measures and renal thresholds differ by indication.",
        "Correct volume depletion before starting and reassess diuretics, blood pressure, orthostasis, weight, intake, and renal function because osmotic diuresis can turn compensated low volume into hypotension or AKI.",
        "Teach the 3-day preoperative interruption and symptom-triggered ketone check because a normal glucose reading cannot exclude empagliflozin-associated DKA.",
        "Inspect feet and ask about perineal or genital symptoms because early local treatment can prevent ulcer progression, ascending infection, or necrotizing soft-tissue disease."
      ],
      interactions: [
        "Diuretics add volume loss because both therapies lower effective circulating volume, so congestion benefit must be balanced against orthostasis and renal perfusion.",
        "Insulin or secretagogues can add hypoglycemia because improved glucose disposal can make the previous background dose excessive.",
        "Lithium concentration can fall because SGLT2 inhibition may increase renal lithium excretion, so levels need closer monitoring after initiation or dose change."
      ],
      keyLabs: [
        "Check beta-hydroxybutyrate, bicarbonate, anion gap, pH, potassium, glucose, and creatinine when DKA symptoms occur because glucose alone is an unsafe screen.",
        "Trend eGFR with blood pressure and volume status because a small early stable dip can be hemodynamic, whereas progressive decline with hypotension or oliguria requires AKI evaluation.",
        "Measure A1c for glycemic treatment and track heart-failure or CKD outcomes for cardiorenal treatment because urine glucose remains positive by design."
      ],
      nclexTraps: [
        "Do not rule out DKA because glucose is 184 mg/dL because empagliflozin can lower glucose while ketone acidosis worsens.",
        "Do not stop it automatically for a small early eGFR dip because restored tubuloglomerular feedback can reduce intraglomerular pressure; assess the full volume and renal pattern.",
        "Do not treat positive urine glucose as proof of uncontrolled diabetes because it is an expected drug effect."
      ],
      populationRisks: populationRisks(
        "Glycemic use is label-supported from age 10, but adult heart-failure and CKD outcome indications must not be extrapolated to children because pediatric outcome evidence is not established.",
        "Use extra caution with frailty, diuretics, low blood pressure, CKD, or impaired thirst because older adults can develop disproportionate volume depletion.",
        "Avoid routine second- and third-trimester use and breastfeeding because active renal development creates fetal or infant concern under current labeling."
      ),
      sourceNote: "Current U.S. JARDIANCE label: https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=faf3dd6a-9cd0-39c2-0d2e-232cb3f67565",
      tags: ["frontier-wave20", "empagliflozin", "Jardiance", "SGLT2", "heart failure", "CKD", "euglycemic DKA", "strict why closure"]
    }),

    drugCard({
      name: "Dapagliflozin",
      aliases: ["Farxiga", "Forxiga", "dapagliflozine", "dapagliflozin SGLT2", "Farxiga CKD", "Farxiga heart failure"],
      brandExamples: ["Farxiga", "Forxiga"],
      class: "Selective renal sodium-glucose cotransporter 2 inhibitor",
      classPathway: ["Endocrine and cardiorenal medication", "SGLT2 inhibitor", "Proximal glycosuria and outcome-proven heart-kidney therapy"],
      usedToTreat: "Dapagliflozin improves glycemic control in adults and children age 10 years and older with type 2 diabetes; in adults it reduces hospitalization for heart failure in type 2 diabetes with cardiovascular disease or multiple risk factors, reduces cardiovascular death and worsening events in heart failure, and reduces progression and cardiorenal events in CKD at risk of progression. It is not recommended for CKD due to polycystic kidney disease or kidney disease requiring current or recent immunosuppression because those populations were not expected to benefit under the labeled evidence base.",
      description: "Dapagliflozin is a once-daily proximal-tubule SGLT2 inhibitor whose clinical identity extends beyond diabetes. It lowers glucose by wasting filtered glucose, but it can improve heart-failure and CKD outcomes even when A1c lowering is weak because natriuresis, volume effects, and glomerular hemodynamics do not require a large glucose change. That distinction explains why eGFR below 45 can make it a poor glycemic tool while an adult cardiorenal indication may remain appropriate at a lower eGFR. The same glycosuria also explains genital infection and why DKA can present with only modest glucose elevation.",
      mechanism: "Dapagliflozin inhibits SGLT2 in the proximal nephron, lowering the renal glucose threshold and reducing sodium-glucose reclamation. Glycosuria lowers plasma glucose independent of insulin; osmotic diuresis and natriuresis reduce filling pressure and can improve congestion. More sodium reaches the macula densa, restoring tubuloglomerular feedback and lowering excessive intraglomerular pressure, which explains an early hemodynamic eGFR dip before longer-term kidney protection. Under fasting, surgery, acute illness, alcohol exposure, pancreatic dysfunction, very-low-carbohydrate intake, or insulin reduction, the insulin-to-glucagon ratio falls and hepatic ketone production rises. Glucose exits through urine while beta-hydroxybutyrate and acid accumulate, so euglycemic DKA remains possible even without marked hyperglycemia.",
      boxedWarning: "No current U.S. boxed warning. Assess ketoacidosis regardless of glucose and stop dapagliflozin when suspected because delayed recognition can permit shock and electrolyte complications. Withhold for at least 3 days before major surgery or prolonged fasting when possible and restart only after clinical stability and oral intake return because fasting and residual glycosuria preserve ketone risk. Correct volume depletion and urgently evaluate urosepsis, pyelonephritis, genital infection, or perineal pain because dehydration, AKI, ascending infection, and Fournier gangrene can become severe.",
      adverseEffects: [
        "Genital mycotic infection and urinary infection occur because glucose-rich urine changes the local microbial environment.",
        "Polyuria, hypotension, transient eGFR decline, or AKI can occur because osmotic diuresis contracts volume and can reduce renal perfusion.",
        "Euglycemic DKA can occur because urinary glucose loss lowers the visible glucose signal without correcting insulin-deficient ketogenesis."
      ],
      contraindications: [
        "Do not use after serious hypersensitivity to dapagliflozin because re-exposure can cause angioedema or anaphylaxis.",
        "Do not use it for type 1 diabetes glycemic control because insulin-deficient patients have a substantially higher DKA risk.",
        "Do not use it for glycemic control below eGFR 45 mL/min/1.73 m2 because the filtered glucose load is too low for reliable A1c effect; do not apply that threshold blindly to adult heart-failure or CKD treatment because those labeled goals use different evidence.",
        "Do not initiate it for an adult cardiorenal indication below eGFR 25 mL/min/1.73 m2 because this starting range was not established in the labeled outcome evidence; a patient already taking 10 mg may continue below 25 for CKD, heart-failure, and cardiovascular outcome risk reduction because current labeling distinguishes continuation from new initiation.",
        "Do not assume it treats every CKD cause because polycystic kidney disease and immune-treated kidney disease fall outside the labeled expected-benefit population."
      ],
      nursingEssentials: [
        "Document the actual indication and eGFR because the same tablet may be continued for cardiorenal protection after its glucose-lowering effect has weakened.",
        "Hold at least 3 days before major surgery or prolonged fasting and restart only when stable and eating because perioperative insulin deficiency can cause euglycemic DKA.",
        "Assess volume, blood pressure, diuretics, renal function, genital or urinary symptoms, and perineal pain because class physiology links these findings to preventable complications."
      ],
      interactions: [
        "Diuretics add volume contraction because both therapies increase net fluid loss, so orthostasis and renal perfusion require reassessment.",
        "Insulin or secretagogues add hypoglycemia because the background regimen may become excessive as glucose control improves.",
        "Lithium levels can fall because SGLT2 inhibitors may increase renal lithium excretion, so monitor more closely during initiation or dose changes."
      ],
      keyLabs: [
        "Check beta-hydroxybutyrate, bicarbonate, anion gap, pH, potassium, glucose, and renal function for compatible symptoms because normal-ish glucose cannot exclude DKA.",
        "Trend eGFR and volume status because the expected early dip should stabilize, while progressive dysfunction with hypotension or oliguria suggests AKI.",
        "Track A1c only for the glycemic goal and track CKD, albuminuria, congestion, hospitalization, and functional outcomes for cardiorenal goals because one marker cannot represent all indications."
      ],
      nclexTraps: [
        "Do not discontinue a cardiorenal indication solely because A1c effect is weak at lower eGFR because outcome benefit and glucose lowering have different renal thresholds.",
        "Do not call dapagliflozin a loop diuretic because it acts on proximal sodium-glucose cotransport rather than thick-ascending-limb NKCC2.",
        "Do not restart automatically from medication reconciliation after surgery because stability and oral intake must return first."
      ],
      populationRisks: populationRisks(
        "Glycemic use is label-supported from age 10, but adult heart-failure and CKD indications must not be extrapolated to children because pediatric outcome safety and efficacy are not established.",
        "Use extra caution with frailty, CKD, low blood pressure, or diuretics because older adults have less reserve against osmotic volume loss.",
        "Avoid routine second- and third-trimester use and breastfeeding because developing kidneys may be vulnerable under current labeling."
      ),
      sourceNote: "Current U.S. FARXIGA label: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=01f90c94-71cb-4a1f-81ff-8004b850529b",
      tags: ["frontier-wave20", "dapagliflozin", "Farxiga", "Forxiga", "SGLT2", "heart failure", "CKD", "strict why closure"]
    }),

    drugCard({
      name: "Canagliflozin",
      aliases: ["Invokana", "canagliflozine", "canagliflozin SGLT2", "gliflozin amputation warning", "SGLT2 fracture risk"],
      brandExamples: ["Invokana"],
      class: "Renal sodium-glucose cotransporter 2 inhibitor",
      classPathway: ["Endocrine and cardiorenal medication", "SGLT2 inhibitor", "Proximal glycosuria with foot, fracture, and UGT-interaction distinctions"],
      usedToTreat: "Canagliflozin improves glycemic control in adults and children age 10 years and older with type 2 diabetes, reduces major adverse cardiovascular events in adults with type 2 diabetes and established cardiovascular disease, and reduces kidney failure, creatinine doubling, cardiovascular death, and heart-failure hospitalization in adults with type 2 diabetes plus diabetic nephropathy and albuminuria above 300 mg/day. The kidney indication is specific because outcome evidence in albuminuric diabetic nephropathy cannot be generalized to every CKD phenotype.",
      description: "Canagliflozin is a once-daily SGLT2 inhibitor that lowers the renal glucose threshold and restores tubuloglomerular feedback. It shares euglycemic DKA, genital infection, volume-depletion, and Fournier-gangrene risks with the class, but two additional distinctions deserve immediate recognition. Lower-limb amputations increased in CANVAS, especially around prior amputation, peripheral artery disease, neuropathy, ulcers, ischemia, infection, or osteomyelitis; the former boxed warning was removed, but the clinical warning and foot surveillance remain. Fracture imbalance also appeared early in CANVAS, so falls, volume loss, and bone risk belong in assessment rather than being treated as trivia.",
      mechanism: "Canagliflozin inhibits SGLT2 in the proximal tubule, reducing sodium-glucose cotransport and causing glycosuria, calorie loss, natriuresis, and osmotic diuresis. Increased distal sodium delivery restores macula-densa feedback and lowers excessive glomerular pressure. At high luminal intestinal concentration before absorption, transient SGLT1 inhibition can delay early post-meal glucose uptake, but renal SGLT2 blockade remains the primary action. During insulin-deficient stress, lipolysis and hepatic ketogenesis can progress while glycosuria masks hyperglycemia. Volume contraction can contribute to falls, while neuropathy, poor perfusion, ulcers, infection, and osteomyelitis converge biologically on amputation risk rather than amputation arising from one isolated transporter effect.",
      boxedWarning: "No current U.S. boxed warning; the former lower-limb-amputation boxed warning was removed, but lower-limb surveillance remains required because amputations still occurred and risk clusters around prior amputation, peripheral vascular disease, neuropathy, ulcers, infection, and osteomyelitis. Stop and assess suspected ketoacidosis regardless of glucose because delay can be fatal. Withhold at least 3 days before surgery or prolonged fasting and restart only when stable and eating because perioperative fasting increases ketone risk.",
      adverseEffects: [
        "Genital mycotic infection, urinary infection, polyuria, and volume depletion occur because filtered glucose and sodium remain in urine.",
        "Euglycemic DKA can occur because glycosuria conceals hyperglycemia while low insulin and high glucagon drive ketones.",
        "Lower-limb amputation risk is concentrated in vulnerable feet because ischemia, neuropathy, ulcers, infection, gangrene, and osteomyelitis impair healing.",
        "Fractures and falls can increase because volume-related dizziness and altered mineral or bone context can add to baseline skeletal risk."
      ],
      contraindications: [
        "Do not use after serious hypersensitivity to canagliflozin because re-exposure can provoke a severe reaction.",
        "Do not use it for type 1 diabetes glycemic control because it cannot replace insulin and can amplify DKA risk.",
        "Do not increase to 300 mg for additional glycemic control unless eGFR is at least 60 mL/min/1.73 m2 and 100 mg is tolerated because lower filtration reduces glycemic effect and increases exposure concerns.",
        "Do not ignore a new ulcer, infection, or ischemic pain because continued exposure during an evolving limb threat can delay definitive foot and vascular treatment."
      ],
      nursingEssentials: [
        "Inspect feet before and during therapy and escalate new pain, tenderness, ulcer, infection, color change, or osteomyelitis concern because early intervention can prevent tissue loss.",
        "Give before the first meal for labeled glycemic dosing because timing standardizes exposure and the transient intestinal SGLT1 contribution around a meal.",
        "Hold at least 3 days before surgery or prolonged fasting and assess ketones when symptoms fit because normal-ish glucose does not exclude DKA.",
        "Assess falls, fractures, blood pressure, volume, and renal function because canagliflozin's benefit can coexist with preventable volume and skeletal harm."
      ],
      interactions: [
        "UGT inducers such as rifampin, phenytoin, phenobarbital, or ritonavir can lower canagliflozin exposure because glucuronidation clears the drug, so current renal-function-based label dosing may require adjustment.",
        "Canagliflozin can increase digoxin exposure because transport effects alter digoxin pharmacokinetics, so monitor concentration and toxicity when clinically relevant.",
        "Diuretics add volume loss and insulin or secretagogues add hypoglycemia because those effects combine with glycosuria rather than replacing it."
      ],
      keyLabs: [
        "Check beta-hydroxybutyrate, bicarbonate, anion gap, pH, potassium, glucose, and renal function for DKA symptoms because glucose can be deceptively low.",
        "Measure eGFR and albuminuria because renal dosing and the labeled diabetic-nephropathy outcome indication depend on specific kidney context.",
        "Trend foot findings, perfusion, infection markers, falls, and fracture symptoms because laboratory glucose control cannot capture limb or skeletal risk."
      ],
      nclexTraps: [
        "Do not say the amputation warning disappeared because the boxed format was removed; the clinical risk and foot-monitoring warning remain.",
        "Do not call every CKD patient an Invokana candidate because the labeled kidney outcome population is type 2 diabetes with diabetic nephropathy and albuminuria above 300 mg/day.",
        "Do not reassure from glucose 180 mg/dL when ketone-acidosis symptoms are present because glycosuria can mask DKA."
      ],
      populationRisks: populationRisks(
        "Glycemic use is label-supported from age 10, but adult cardiovascular and kidney outcome indications must not be extrapolated to children because outcome evidence differs.",
        "Use extra caution with prior amputation, peripheral artery disease, neuropathy, ulcers, falls, CKD, or diuretics because limb and volume complications cluster in these patients.",
        "Avoid routine second- and third-trimester use and breastfeeding because developing kidneys may be vulnerable under current labeling."
      ),
      sourceNote: "Current U.S. INVOKANA label: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?lang=en&setid=b9057d3b-b104-4f09-8a61-c61ef9d4a3f3",
      tags: ["frontier-wave20", "canagliflozin", "Invokana", "SGLT2", "amputation", "fracture", "albuminuria", "strict why closure"]
    }),

    drugCard({
      name: "Ertugliflozin",
      aliases: ["Steglatro", "ertugliflozine", "ertugliflozin SGLT2", "four day SGLT2 hold", "SGLT2 held four days"],
      brandExamples: ["Steglatro"],
      class: "Selective renal SGLT2 inhibitor labeled for adult type 2 diabetes glycemic control",
      classPathway: ["Endocrine medication", "SGLT2 inhibitor", "Adult glycemic therapy with a 4-day perioperative interruption"],
      usedToTreat: "Ertugliflozin is an adjunct to diet and exercise to improve glycemic control in adults with type 2 diabetes. Do not automatically substitute it for empagliflozin or dapagliflozin in heart failure or CKD because Steglatro's current U.S. label is a glycemic indication rather than a broad heart-failure or CKD outcome indication.",
      description: "Ertugliflozin is a once-daily SGLT2 inhibitor that makes the proximal tubule excrete filtered glucose and sodium. It lowers A1c without directly forcing insulin release, but its glycosuria can cause genital infection, volume loss, and euglycemic DKA. It is not recommended for glycemic control when eGFR is below 45 mL/min/1.73 m2 because too little filtered glucose reaches its tubular target for reliable A1c lowering. Its other high-yield distinction is the perioperative interval: current Steglatro labeling says withhold at least 4 days before surgery or procedures with prolonged fasting, not the 3-day interval used by several other gliflozins. It also carries lower-limb-amputation surveillance language, so a 'glycemic-only label' does not mean a superficial safety card.",
      mechanism: "Ertugliflozin inhibits SGLT2, the predominant early proximal-tubule transporter that reabsorbs filtered glucose with sodium. Lowering the renal glucose threshold produces glycosuria, urinary calorie loss, increased urine volume, and some natriuresis. Because its glucose effect depends on filtered glucose, reduced eGFR weakens glycemic efficacy. During fasting, surgery, infection, low-carbohydrate intake, alcohol exposure, dehydration, pancreatic dysfunction, or insulin reduction, low insulin and high glucagon activate lipolysis and hepatic ketogenesis. Glycosuria lowers serum glucose while ketone acids accumulate, which explains euglycemic DKA and the need for a 4-day preoperative interruption under the current product label.",
      boxedWarning: "No current U.S. boxed warning. Withhold ertugliflozin for at least 4 days before surgery or prolonged fasting when possible and restart only when clinically stable and eating because residual glucose-wasting pharmacology plus fasting can promote ketoacidosis. Stop and assess ketones and acid-base status regardless of glucose when symptoms fit because delayed DKA treatment can be fatal. Monitor lower-limb ulcers and infection because amputation events occurred and vulnerable feet can deteriorate quickly.",
      adverseEffects: [
        "Genital mycotic infection, urinary symptoms, and polyuria occur because SGLT2 blockade sends glucose and water into urine.",
        "Orthostasis, hypotension, or renal-function change can occur because osmotic diuresis contracts intravascular volume.",
        "Euglycemic DKA can occur because glycosuria masks hyperglycemia without suppressing insulin-deficient ketone production.",
        "Lower-limb complications require surveillance because prior amputation, peripheral vascular disease, neuropathy, ulcers, and infection impair tissue healing."
      ],
      contraindications: [
        "Do not use after serious hypersensitivity to ertugliflozin because angioedema or another severe reaction can recur.",
        "Do not use it for type 1 diabetes glycemic control because insulin deficiency makes ketoacidosis substantially more likely.",
        "Do not use it for glycemic control below eGFR 45 mL/min/1.73 m2 because reduced filtered glucose makes the transporter target ineffective for reliable A1c lowering.",
        "Do not infer a heart-failure or CKD indication from the drug class because outcome labeling is product-specific."
      ],
      nursingEssentials: [
        "Write the 4-day perioperative interval explicitly because using the common 3-day class mnemonic would understate current Steglatro labeling.",
        "Correct volume depletion and review diuretics, blood pressure, intake, renal function, genital symptoms, and feet because one proximal-tubule mechanism links these risks.",
        "Restart only after stability and oral intake return because surgery completion alone does not remove fasting-related ketone physiology."
      ],
      interactions: [
        "Diuretics add volume loss because both treatments lower effective circulating volume, so orthostasis and renal perfusion need reassessment.",
        "Insulin or secretagogues add hypoglycemia because the previous background dose may become excessive after glycemic improvement.",
        "Lithium levels may fall because SGLT2 inhibition can increase renal lithium excretion, so monitor after initiation or dose change."
      ],
      keyLabs: [
        "Check beta-hydroxybutyrate, bicarbonate, anion gap, pH, potassium, glucose, and creatinine when DKA symptoms occur because glucose alone is insufficient.",
        "Trend eGFR before and during therapy because glycemic efficacy falls below the labeled renal threshold and volume depletion can worsen renal function.",
        "Use A1c and plasma glucose for response because positive urine glucose is an expected pharmacologic effect."
      ],
      nclexTraps: [
        "Ertugliflozin is the 4-day preoperative gliflozin in this comparison because current Steglatro labeling specifies at least 4 days.",
        "Do not assign it dapagliflozin's or empagliflozin's broad heart-failure and CKD indications because similar class mechanisms do not replace product outcome evidence.",
        "Do not interpret urine glucose as treatment failure because ertugliflozin is designed to cause glycosuria."
      ],
      populationRisks: populationRisks(
        "Steglatro's current U.S. glycemic indication is adult-only, so pediatric use should not be inferred from other SGLT2 products because labels differ.",
        "Use extra caution with frailty, CKD, diuretics, low blood pressure, or foot disease because volume and limb complications can become disproportionate.",
        "Avoid routine second- and third-trimester use and breastfeeding because developing kidneys may be vulnerable under current labeling."
      ),
      sourceNote: "Current U.S. STEGLATRO label: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e6f3e718-bb99-48f1-ab94-b9f0af05fed6",
      tags: ["frontier-wave20", "ertugliflozin", "Steglatro", "SGLT2", "four day hold", "adult type 2 diabetes", "strict why closure"]
    }),

    drugCard({
      name: "Bexagliflozin",
      aliases: ["Brenzavvy", "bexagliflozine", "bexagliflozin SGLT2", "Bexacat", "Brenzavvy versus Bexacat"],
      brandExamples: ["Brenzavvy"],
      class: "Human oral SGLT2 inhibitor labeled for adult type 2 diabetes glycemic control",
      classPathway: ["Endocrine medication", "SGLT2 inhibitor", "Human Brenzavvy glycemic pathway with veterinary-name safeguard"],
      usedToTreat: "Human bexagliflozin as Brenzavvy is an adjunct to diet and exercise to improve glycemic control in adults with type 2 diabetes. It is not a labeled human heart-failure or CKD outcome drug merely because it belongs to the SGLT2 class. Bexacat is a 15-mg flavored veterinary bexagliflozin product for selected cats and is not a human brand or interchangeable formulation.",
      description: "Bexagliflozin is a once-daily renal SGLT2 inhibitor that blocks proximal-tubule sodium-glucose reabsorption, lowers the renal glucose threshold, and causes glycosuria, osmotic diuresis, and A1c reduction in adults with type 2 diabetes. The U.S. human product is Brenzavvy 20 mg; Bexacat is a separate veterinary product labeled for cats only. That distinction is a medication-safety priority because identical active-ingredient words do not make species, formulation, dose, screening, or boxed-warning instructions interchangeable. The same glucose-sodium blockade that lowers A1c also explains genital infection, volume depletion, euglycemic DKA, and lower-limb surveillance. Its current human indication is glycemic control, not automatic class-wide heart-failure or CKD outcome therapy.",
      mechanism: "Bexagliflozin inhibits SGLT2 in the proximal tubule, reducing reabsorption of filtered glucose and sodium, lowering the renal glucose threshold, and increasing urinary glucose and water loss. The glucose-lowering response weakens as renal impairment reduces filtered glucose delivery, which explains why human Brenzavvy is not recommended below eGFR 30 mL/min/1.73 m2. During fasting, surgery, illness, low-carbohydrate intake, dehydration, alcohol exposure, pancreatic dysfunction, or insulin reduction, the insulin-to-glucagon ratio falls and hepatic ketogenesis rises. Glycosuria prevents marked hyperglycemia while acid accumulates, which explains euglycemic DKA and the 3-day surgical interruption. Lower-limb infection, ischemia, neuropathy, or osteomyelitis can converge on amputation risk because damaged tissue has poor reserve and healing.",
      boxedWarning: "Human Brenzavvy has no current U.S. boxed warning. Do not copy Bexacat's veterinary boxed warning into human care because Bexacat is for cats only, yet do not minimize human danger: stop Brenzavvy and assess suspected ketoacidosis regardless of glucose because delayed treatment can be fatal. Withhold at least 3 days before surgery or prolonged fasting and restart only after stability and oral intake return because fasting preserves ketone risk. Monitor ulcers and lower-limb infection because amputations were more frequent in a human cardiovascular-risk trial.",
      adverseEffects: [
        "Genital mycotic infection and urinary symptoms occur because glucose-rich urine supports local microbial growth.",
        "Volume depletion, orthostasis, and renal-function change occur because glycosuria produces osmotic diuresis.",
        "Euglycemic DKA can occur because urinary glucose loss conceals the glucose rise while ketone acids accumulate.",
        "Lower-limb amputation risk requires surveillance because infection, gangrene, ischemia, osteomyelitis, neuropathy, and prior amputation identify poor-healing tissue."
      ],
      contraindications: [
        "Do not use after serious hypersensitivity to bexagliflozin because re-exposure can cause anaphylaxis or angioedema.",
        "Do not use Brenzavvy to improve glycemic control in type 1 diabetes because insulin deficiency markedly increases ketoacidosis risk.",
        "Do not use human Brenzavvy below eGFR 30 mL/min/1.73 m2 because reduced filtered glucose makes glycemic efficacy inadequate and volume-related adverse effects remain possible.",
        "Never administer Bexacat to a human because it is a veterinary formulation with cat-specific dose, selection, monitoring, and warning requirements."
      ],
      nursingEssentials: [
        "Verify Brenzavvy 20 mg human labeling rather than Bexacat 15 mg veterinary labeling because a name-based substitution would be a species and dose error.",
        "Give the human tablet once each morning with or without food and do not crush or chew because current product administration specifies an intact tablet.",
        "Hold at least 3 days before surgery or prolonged fasting and restart only after stability and oral intake return because perioperative euglycemic DKA can occur despite modest glucose.",
        "Inspect feet and assess genital, urinary, perineal, volume, and renal symptoms because these findings map directly to human label warnings."
      ],
      interactions: [
        "Diuretics add volume contraction because both therapies increase net fluid loss, so hypotension and kidney perfusion require reassessment.",
        "Insulin or secretagogues add hypoglycemia because glycemic improvement can make the previous background dose excessive.",
        "Lithium concentration can fall because SGLT2 inhibition may increase renal lithium excretion, so monitor during initiation and dose changes."
      ],
      keyLabs: [
        "Check eGFR before treatment and as clinically indicated because human glycemic use is not recommended below 30 mL/min/1.73 m2.",
        "Check beta-hydroxybutyrate, bicarbonate, anion gap, pH, potassium, glucose, and renal function for DKA symptoms because glucose alone cannot exclude the emergency.",
        "Use A1c and plasma glucose for response and assess feet, volume, and infection clinically because urine glucose is expected and does not measure net safety."
      ],
      nclexTraps: [
        "Brenzavvy is the human bexagliflozin brand; Bexacat is a veterinary product for cats only, so they are not interchangeable.",
        "Do not assign broad heart-failure or CKD indications to Brenzavvy because its current human U.S. indication is adult type 2 diabetes glycemic control.",
        "Do not let modest glucose exclude DKA because bexagliflozin deliberately removes glucose through urine."
      ],
      populationRisks: populationRisks(
        "Human Brenzavvy is adult-only under current U.S. labeling, so pediatric use should not be inferred from other class members because product evidence differs.",
        "Use extra caution with frailty, CKD, diuretics, low blood pressure, neuropathy, peripheral vascular disease, or ulcers because volume and limb complications cluster in these patients.",
        "Avoid routine second- and third-trimester use and breastfeeding because developing kidneys may be vulnerable under current labeling."
      ),
      sourceNote: "Current human BRENZAVVY label: https://www.dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=3cdf28fc-4194-4ad6-aa03-c9eaa68da83e&type=pdf ; veterinary BEXACAT label: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f918583d-0337-40da-8da1-1e1320b8d027",
      tags: ["frontier-wave20", "bexagliflozin", "Brenzavvy", "Bexacat veterinary only", "SGLT2", "adult type 2 diabetes", "strict why closure"]
    }),

    drugCard({
      name: "Sotagliflozin",
      aliases: ["Inpefa", "sotagliflozine", "dual SGLT1 SGLT2 inhibitor", "SGLT1 SGLT2 heart failure drug", "gliflozin diarrhea digoxin"],
      brandExamples: ["Inpefa"],
      class: "Dual SGLT2 and SGLT1 inhibitor labeled for selected cardiovascular and heart-failure outcomes",
      classPathway: ["Cardiorenal medication", "Dual SGLT2 and SGLT1 inhibitor", "Renal glucose-sodium and intestinal glucose-sodium transport"],
      usedToTreat: "Sotagliflozin reduces cardiovascular death, heart-failure hospitalization, and urgent heart-failure visits in adults with heart failure or adults with type 2 diabetes, CKD, and other cardiovascular risk factors. It is not labeled as a glycemic-control drug, so a lower A1c is not the reason to select or judge Inpefa; the treatment target is clinical cardiorenal outcome risk.",
      description: "Sotagliflozin is an oral dual SGLT2/SGLT1 inhibitor that blocks renal proximal-tubule glucose-sodium reabsorption and delays intestinal glucose-sodium absorption. Its renal SGLT2 action causes glycosuria, natriuresis, osmotic volume change, an early hemodynamic eGFR dip, and euglycemic-DKA risk, while intestinal SGLT1 inhibition helps explain its prominent diarrhea risk. Inpefa is an outcome drug for adults with heart failure or with type 2 diabetes plus CKD and additional cardiovascular risk; it is not labeled simply as a glycemic-control drug. The exact mechanism of its cardiovascular outcome benefit is not fully established, so transporter physiology explains important effects without proving every observed clinical benefit.",
      mechanism: "Sotagliflozin inhibits SGLT2 in the renal proximal tubule, reducing glucose and sodium reabsorption, increasing glycosuria and natriuresis, lowering preload and afterload, and altering sympathetic and glomerular physiology. It also inhibits intestinal SGLT1, reducing or delaying glucose-sodium absorption, which likely contributes to diarrhea. During fasting, surgery, illness, low-carbohydrate intake, volume depletion, alcohol use, pancreatic dysfunction, or insulin reduction, the insulin-to-glucagon ratio falls and hepatic ketogenesis accelerates while glycosuria masks hyperglycemia. That physiology explains euglycemic DKA. Sotagliflozin increases digoxin exposure through a drug-specific pharmacokinetic interaction and is cleared partly through UGT1A9 glucuronidation, so digoxin and UGT-inducer monitoring cannot be inferred from transporter class alone.",
      boxedWarning: "No current U.S. boxed warning. Stop and evaluate ketoacidosis regardless of glucose because fatal events can occur and glucosuria may persist after discontinuation. Withhold at least 3 days before major surgery or prolonged fasting and restart only after stability and oral intake return because fasting and residual transport effects maintain ketone risk. Correct volume depletion before starting and begin after decompensated heart failure only when hemodynamically stable because osmotic diuresis can worsen hypotension in an unstable patient.",
      adverseEffects: [
        "Urinary infection, genital mycotic infection, glycosuria, and volume depletion occur because renal SGLT2 blockade leaves glucose, sodium, and water in urine.",
        "Diarrhea occurs in part because intestinal SGLT1 inhibition reduces glucose-sodium absorption and increases distal osmotic load.",
        "Euglycemic DKA can occur because glycosuria lowers visible glucose while insulin-deficient ketogenesis continues.",
        "Hypoglycemia risk rises with insulin or secretagogues because combined glucose-lowering effects can make the background dose excessive."
      ],
      contraindications: [
        "Do not use after serious hypersensitivity to sotagliflozin because re-exposure can cause a severe allergic reaction.",
        "Do not use it as routine glycemic treatment for type 1 diabetes because DKA risk is markedly increased and Inpefa is not a glycemic-control indication.",
        "Do not initiate during decompensated hemodynamic instability because additional volume loss can worsen hypotension and renal perfusion.",
        "Avoid moderate or severe hepatic impairment because exposure rises substantially and safety and efficacy are not established."
      ],
      nursingEssentials: [
        "Start 200 mg no more than 1 hour before the first meal and increase to 400 mg only after at least 2 weeks as tolerated because the labeled titration balances outcome exposure against volume, GI, and renal tolerance.",
        "If a dose is missed by more than 6 hours, wait until the next scheduled day because doubling or late dosing can increase exposure without restoring the intended first-meal timing.",
        "Hold at least 3 days before surgery or prolonged fasting and restart only when stable and eating because euglycemic DKA can occur despite acceptable glucose.",
        "Monitor volume, blood pressure, renal function, diarrhea, genital or urinary infection, digoxin, and lithium because dual transport and drug-specific pharmacokinetics create more than one safety pathway."
      ],
      interactions: [
        "Sotagliflozin can increase digoxin exposure, so monitor concentration and bradycardia, nausea, vision change, or dysrhythmia because digoxin has a narrow therapeutic range.",
        "Rifampin and other UGT inducers can lower sotagliflozin exposure because UGT1A9 glucuronidation is a major clearance pathway, which can reduce effectiveness.",
        "Lithium concentration can fall because SGLT2 inhibition may increase renal lithium excretion, so monitor during initiation or dose changes.",
        "Diuretics add volume loss and insulin or secretagogues add hypoglycemia because those effects combine with renal glucose-sodium loss."
      ],
      keyLabs: [
        "Check beta-hydroxybutyrate, bicarbonate, anion gap, pH, potassium, glucose, and renal function for DKA symptoms because glucose alone is not a safe exclusion test.",
        "Trend eGFR and volume status because a small early stable dip can be hemodynamic while progressive decline with hypotension can signal AKI.",
        "Monitor digoxin and lithium concentrations when coadministered because sotagliflozin can raise digoxin exposure and lower lithium exposure.",
        "Track heart-failure and cardiorenal outcomes rather than A1c alone because Inpefa's U.S. indication is outcome reduction, not glycemic control."
      ],
      nclexTraps: [
        "Do not call sotagliflozin a selective SGLT2 inhibitor because it directly inhibits both SGLT2 and intestinal SGLT1.",
        "Do not judge Inpefa by A1c alone because its current U.S. indication targets cardiovascular death and heart-failure events.",
        "Do not dismiss diarrhea as unrelated because intestinal SGLT1 inhibition can increase distal osmotic load.",
        "Do not forget digoxin monitoring because sotagliflozin can increase digoxin exposure."
      ],
      populationRisks: populationRisks(
        "Inpefa's outcome indication is adult-only, so pediatric use should not be inferred from other SGLT2 drugs because product evidence differs.",
        "Use extra caution with frailty, eGFR below 30, diuretics, diarrhea, or low blood pressure because volume-related adverse events become more likely.",
        "Avoid routine second- and third-trimester use and breastfeeding because developing kidneys may be vulnerable under current labeling."
      ),
      sourceNote: "Current U.S. INPEFA label: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1a46614e-05f6-421a-b6f4-d6f8760d643a",
      tags: ["frontier-wave20", "sotagliflozin", "Inpefa", "SGLT2", "SGLT1", "heart failure", "digoxin", "strict why closure"]
    })
  ];

  const pharmCards = [...classCards, ...drugCards];
  const canonicalDrugKeys = new Set(drugCards.map((card) => normalize(card.generic || card.name)));
  const canonicalDrugAliasKeys = new Set(drugCards
    .flatMap((card) => [card.name, card.generic, ...(card.aliases || []), ...(card.brandExamples || [])])
    .map(normalize).filter(Boolean));
  const curatedAliasOwner = new Map();
  pharmCards.forEach((card) => {
    const owner = normalize(card.generic || card.name || card.displayName);
    [card.name, card.generic, ...(card.aliases || []), ...(card.brandExamples || [])]
      .map(normalize).filter(Boolean).forEach((alias) => curatedAliasOwner.set(alias, owner));
  });

  const map = new Map();
  db.drugs.forEach((drug) => {
    const key = normalize(drug.generic || drug.name || drug.displayName);
    if (canonicalDrugAliasKeys.has(key) && !canonicalDrugKeys.has(key)) return;
    if (!key || map.has(key)) return;
    const aliases = (drug.aliases || []).filter((alias) => {
      const owner = curatedAliasOwner.get(normalize(alias));
      return !owner || owner === key;
    });
    const brandExamples = (drug.brandExamples || []).filter((brand) => {
      const owner = curatedAliasOwner.get(normalize(brand));
      return !owner || owner === key;
    });
    map.set(key, { ...drug, aliases, brandExamples });
  });

  pharmCards.forEach((card) => {
    const key = normalize(card.generic || card.name || card.displayName);
    const existing = map.get(key) || {};
    const inheritedAliases = (existing.aliases || []).filter((alias) => {
      const owner = curatedAliasOwner.get(normalize(alias));
      return !owner || owner === key;
    });
    const inheritedBrands = (existing.brandExamples || []).filter((brand) => {
      const owner = curatedAliasOwner.get(normalize(brand));
      return !owner || owner === key;
    });
    map.set(key, {
      ...existing,
      ...card,
      generic: key,
      displayName: card.displayName || card.name,
      aliases: unique([...(card.aliases || []), ...inheritedAliases]),
      brandExamples: unique([...(card.brandExamples || []), ...inheritedBrands])
        .filter((brand) => !(key === "bexagliflozin" && normalize(brand) === "bexacat")),
      tags: unique(["frontier-wave20", "strict why closure", "claim rationale consequence", ...(card.tags || []), ...(existing.tags || []).filter((tag) => !/^frontier[- ]wave\d+$/i.test(String(tag || "")))]),
      adverseEffects: Array.isArray(card.adverseEffects) ? card.adverseEffects : [],
      contraindications: Array.isArray(card.contraindications) ? card.contraindications : [],
      nursingEssentials: Array.isArray(card.nursingEssentials) ? card.nursingEssentials : [],
      interactions: Array.isArray(card.interactions) ? card.interactions : [],
      keyLabs: Array.isArray(card.keyLabs) ? card.keyLabs : [],
      nclexTraps: Array.isArray(card.nclexTraps) ? card.nclexTraps : [],
      populationRisks: Array.isArray(card.populationRisks) ? card.populationRisks : []
    });
  });

  db.drugs = Array.from(map.values());

  const pathologyCards = [
    {
      name: "Euglycemic diabetic ketoacidosis",
      category: "Endocrine emergency",
      aliases: ["euglycemic DKA", "EDKA", "euDKA", "SGLT2 ketoacidosis", "DKA with normal glucose", "ketoacidosis below 200"],
      pronunciation: "you-gly-SEE-mik dye-uh-BET-ik kee-toh-as-ih-DOH-sis",
      wordOrigin: "Eu- means good or normal, glyc- refers to glucose, ketone refers to acidic ketone bodies, and -acidosis means an acidotic state. The name means DKA occurring without the marked hyperglycemia usually expected.",
      definition: "Euglycemic diabetic ketoacidosis is DKA with substantial ketonemia and metabolic acidosis despite plasma glucose below 200 mg/dL under the 2024 international consensus definition. It is dangerous because clinicians may falsely exclude DKA when the glucose number looks normal or only mildly elevated. SGLT2 inhibitors are a major modern trigger, but pregnancy, fasting, vomiting, low-carbohydrate intake, alcohol, partial insulin treatment, and reduced glycogen stores can also produce this pattern.",
      etiology: "Relative or absolute insulin deficiency plus excess glucagon, catecholamines, cortisol, and growth hormone drives lipolysis and hepatic ketogenesis. SGLT2 drugs lower glucose through urinary loss; pregnancy and prolonged fasting consume carbohydrate stores; vomiting and reduced intake lower insulin needs on paper but do not eliminate basal insulin requirements. These forces permit ketone acid production without classic severe hyperglycemia.",
      pathology: "Low insulin signaling releases free fatty acids from adipose tissue. The liver converts them into beta-hydroxybutyrate and acetoacetate, consuming bicarbonate and widening the anion gap. Osmotic urinary losses, vomiting, and tachypnea worsen dehydration and electrolyte depletion. Serum potassium may initially look normal or high because acidosis and insulin deficiency move potassium out of cells, even though total-body potassium is depleted.",
      pathophysiology: "SGLT2 blockade lowers the renal threshold for glucose and maintains glycosuria, sometimes for days after the last dose. Glucose leaves the body while low insulin and high glucagon continue activating hormone-sensitive lipase, beta-oxidation, and ketone synthesis. Because the glucose alarm is muted, nausea, abdominal pain, malaise, dyspnea, or Kussmaul respirations may be the first clues. Euglycemic DKA remains true DKA: ketosis plus metabolic acidosis requires insulin-mediated suppression of lipolysis, not observation alone.",
      riskFactors: [
        "SGLT2 or dual SGLT1/SGLT2 therapy, especially with surgery, infection, fasting, dehydration, alcohol use, ketogenic eating, pancreatic disease, or reduced insulin.",
        "Pregnancy because placental and maternal metabolism accelerates fasting ketosis and respiratory compensation lowers buffering reserve.",
        "Type 1 diabetes, latent autoimmune diabetes, pancreatic surgery, pancreatitis, or low endogenous insulin reserve because basal insulin deficiency permits unchecked lipolysis.",
        "Prolonged vomiting, starvation, bariatric surgery, low glycogen stores, or partial treatment with insulin before laboratory testing because glucose can fall before ketones clear."
      ],
      signsSymptoms: [
        "Nausea, vomiting, diffuse abdominal pain, anorexia, malaise, thirst, polyuria, or dehydration despite glucose that may be below 200 mg/dL.",
        "Tachypnea or deep Kussmaul respirations because respiratory compensation attempts to lower carbon dioxide and raise pH.",
        "Tachycardia, orthostasis, dry mucosa, weak pulses, confusion, or shock as volume and acidosis worsen.",
        "A fruity or acetone odor may occur, but its absence does not exclude DKA because bedside smell is neither sensitive nor specific."
      ],
      diagnostics: [
        "Confirm all three DKA components: diabetes or known diabetes context, significant ketonemia, and metabolic acidosis. Glucose below 200 mg/dL defines the euglycemic presentation under the 2024 consensus.",
        "Serum beta-hydroxybutyrate is preferred because it is the dominant ketone in DKA and urine acetoacetate can lag or underestimate early severity.",
        "Calculate the anion gap and measure venous pH and bicarbonate because the emergency is ketone-driven high-anion-gap acidosis rather than hyperglycemia alone.",
        "Search for infection, myocardial ischemia, stroke, pregnancy, pancreatitis, alcohol-related disease, starvation, medication exposure, insulin omission, and surgical stress because treating the trigger prevents recurrence.",
        "Differentiate starvation or alcoholic ketoacidosis, lactic acidosis, toxic alcohol, salicylate toxicity, renal failure, and other high-gap states using history, glucose/diabetes context, lactate, osmolar gap, toxicology, and response pattern."
      ],
      labs: [
        "Plasma glucose is below 200 mg/dL in the current consensus definition, but SGLT2 labels emphasize assessing DKA regardless of glucose because clinically important cases may be described below the older 250-mg/dL expectation.",
        "Beta-hydroxybutyrate at or above 3.0 mmol/L strongly supports DKA in the appropriate acid-base context.",
        "Venous pH below 7.3, bicarbonate below 18 mmol/L, or both establish metabolic acidosis severity when paired with ketosis.",
        "Potassium can be normal or high initially despite total-body depletion, so serial potassium is essential before and during insulin treatment.",
        "Creatinine, BUN, magnesium, phosphate, lactate, CBC, cultures, pregnancy testing, ECG, and trigger-specific studies guide volume, electrolyte, and precipitant treatment."
      ],
      treatments: [
        "Stop the precipitating SGLT2-directed drug and begin protocol-based DKA treatment because transporter blockade is not the only problem once ketogenesis and acidosis are established.",
        "Give isotonic fluid according to hemodynamics, cardiac/renal reserve, and protocol because osmotic loss and vomiting create substantial volume deficit.",
        "Give insulin to suppress lipolysis and ketogenesis; add dextrose early enough to prevent hypoglycemia because glucose may already be low while ketones still require insulin clearance.",
        "Replace potassium according to level and protocol, and delay insulin when potassium is dangerously low because insulin can shift potassium into cells and provoke lethal arrhythmia or respiratory weakness.",
        "Treat the precipitant, continue monitoring until ketonemia and acidosis resolve, and transition to subcutaneous insulin with appropriate overlap because closing glucose alone does not prove DKA resolution."
      ],
      medicationsCommonlyUsed: ["Regular insulin", "Potassium chloride", "Normal saline"],
      nursingPriorities: [
        "Do not wait for severe hyperglycemia before escalating an SGLT2-treated patient with vomiting, abdominal pain, dyspnea, or unexplained anion-gap acidosis.",
        "Trend beta-hydroxybutyrate, pH, bicarbonate, anion gap, potassium, glucose, mental status, perfusion, urine output, and ECG because treatment changes one compartment faster than another.",
        "Verify basal insulin was not omitted because NPO status changes prandial insulin but does not remove the insulin needed to suppress ketogenesis.",
        "Use dextrose with ongoing insulin when ordered because stopping insulin as glucose normalizes can leave lipolysis and ketone production active.",
        "Document the medication hold and restart plan because discharge reconciliation can accidentally restart the precipitating drug before intake and metabolic stability return."
      ],
      complications: [
        "Hypovolemic or distributive shock, AKI, and tissue hypoperfusion from dehydration and the precipitating illness.",
        "Potassium-mediated ventricular dysrhythmia or respiratory muscle weakness during disease or treatment shifts.",
        "Cerebral injury, aspiration, respiratory fatigue, venous thrombosis, prolonged hospitalization, or death when recognition is delayed.",
        "Recurrent DKA if the trigger, insulin deficit, sick-day plan, or medication restart decision is not corrected."
      ],
      redFlags: [
        "SGLT2 use plus vomiting, abdominal pain, malaise, tachypnea, or dyspnea at any glucose level.",
        "Positive beta-hydroxybutyrate with low bicarbonate, low pH, or a widening anion gap.",
        "Hypotension, altered mental status, oliguria, severe potassium abnormality, chest pain, infection signs, or pregnancy.",
        "Recent surgery, prolonged fasting, ketogenic diet, insulin reduction, alcohol excess, or pancreatic disease."
      ],
      patientEducation: [
        "Know the sick-day and procedure plan for the exact SGLT2 drug because several labels require at least 3 days off and ertugliflozin requires at least 4 days before major surgery or prolonged fasting.",
        "Seek urgent care for nausea, vomiting, abdominal pain, rapid breathing, severe fatigue, or ketones even when glucose is not high because euglycemic DKA can be missed at home.",
        "Never stop basal insulin solely because food intake is low without a clinician-directed plan because insulin prevents ketone production as well as lowering glucose.",
        "Avoid ketogenic dieting or prolonged fasting on an SGLT2-directed drug unless the prescribing team has explicitly addressed ketoacidosis risk."
      ],
      nclexTraps: [
        "Glucose below 200 mg/dL does not exclude DKA because the diagnosis rests on ketonemia and metabolic acidosis in the diabetes context.",
        "Do not stop insulin when glucose becomes normal because ketone clearance requires insulin; add dextrose so insulin can continue safely.",
        "Urine ketones can lag because beta-hydroxybutyrate predominates in acute DKA, so serum beta-hydroxybutyrate is the better early test.",
        "NPO means hold prandial intake-related insulin as directed, not automatically omit all basal insulin."
      ],
      sourceNote: "2024 ADA/EASD hyperglycemic-crises consensus report and current U.S. SGLT2-directed product labels.",
      sourceKeys: ["ada-easd-hyperglycemic-crises-2024", "dailymed-sglt2-labels"],
      nclexEssential: true,
      tags: ["frontier-wave20", "euglycemic DKA", "SGLT2", "beta-hydroxybutyrate", "anion gap", "insulin and dextrose"]
    },
    {
      name: "Glycosuria",
      category: "Renal physiology",
      aliases: ["glucosuria", "glucose in urine", "sugar in urine", "urine glucose", "renal glucose threshold"],
      pronunciation: "gly-koh-SYOOR-ee-uh",
      wordOrigin: "Glyc- means sugar or glucose and -uria means a substance or condition in urine. Glycosuria therefore means glucose present in urine above the usual trace amount.",
      definition: "Glycosuria is glucose in urine above the usual trace amount because the filtered glucose load exceeds proximal-tubule reabsorptive capacity or because that capacity is intentionally or pathologically reduced. It can reflect hyperglycemia, SGLT2-inhibitor pharmacology, pregnancy-related threshold change, familial renal glycosuria, Fanconi syndrome, or proximal tubular injury, so urine glucose is a clue rather than a diagnosis of diabetes by itself.",
      etiology: "Hyperglycemia can exceed the transport maximum; SGLT2 inhibitors deliberately lower the renal glucose threshold; SLC5A2 defects reduce SGLT2 function; pregnancy can lower the threshold; and generalized proximal-tubule disorders can waste glucose with phosphate, bicarbonate, uric acid, and amino acids.",
      pathology: "Normally the glomerulus filters large amounts of glucose and the proximal tubule reclaims nearly all of it. SGLT2 handles most early proximal uptake and SGLT1 reclaims much of the remainder downstream. Glycosuria appears when filtered delivery exceeds transport capacity or transporters fail or are blocked. Glucose in the lumen raises osmotic pressure, retaining water and increasing urine volume.",
      pathophysiology: "Hyperglycemic glycosuria tracks a high filtered load, while renal glycosuria can occur at normal plasma glucose because the threshold or transport maximum is reduced. SGLT2 therapy creates the latter mechanism intentionally. Because renal thresholds vary with age, pregnancy, CKD, chronic hyperglycemia, and individual physiology, urine glucose cannot be converted into a reliable bedside serum glucose value.",
      riskFactors: [
        "Diabetes or stress hyperglycemia because plasma glucose can exceed tubular transport capacity.",
        "SGLT2-directed therapy because the intended mechanism lowers the renal glucose threshold.",
        "Pregnancy, familial SLC5A2-related renal glycosuria, Fanconi syndrome, acute tubular injury, or nephrotoxic exposure because proximal reabsorption can be reduced.",
        "Very high carbohydrate load can cause transient alimentary glycosuria, but persistent findings still require clinical context."
      ],
      signsSymptoms: [
        "Often asymptomatic and discovered on urinalysis.",
        "Polyuria, thirst, dehydration, or orthostasis can occur when enough glucose creates osmotic diuresis.",
        "Genital yeast symptoms may recur during SGLT2 therapy because glucose-rich urine alters the local environment.",
        "Weight loss, polydipsia, fatigue, or blurred vision suggests hyperglycemia, while normal plasma glucose with other urinary solute losses suggests proximal tubular dysfunction."
      ],
      diagnostics: [
        "Pair urinalysis with plasma glucose and A1c because glycosuria alone cannot distinguish diabetes from a lowered renal threshold.",
        "Review SGLT2 drugs before labeling the finding abnormal because positive urine glucose is expected during therapy.",
        "If plasma glucose is normal and no SGLT2 drug is present, assess bicarbonate, phosphate, uric acid, potassium, creatinine, protein, and aminoaciduria when Fanconi syndrome or proximal tubular injury is possible.",
        "Consider pregnancy and inherited renal glycosuria when persistent isolated glycosuria occurs without hyperglycemia or generalized tubular loss."
      ],
      labs: [
        "Urine dipstick detects glucose semiquantitatively but can miss low concentrations and cannot show current plasma glucose reliably.",
        "Plasma glucose and A1c determine glycemic status because urine values lag and depend on a variable renal threshold.",
        "Bicarbonate, phosphate, potassium, uric acid, creatinine/eGFR, and urine protein help identify generalized proximal-tubule dysfunction.",
        "Ketones and acid-base studies are needed when an SGLT2-treated patient is ill because glycosuria can coexist with euglycemic DKA."
      ],
      treatments: [
        "Treat hyperglycemia when present because lowering the filtered glucose load reduces pathologic glycosuria and osmotic symptoms.",
        "Do not treat expected SGLT2 glycosuria as an infection or drug failure because it is the intended mechanism; treat dehydration, infection, or ketoacidosis when those complications appear.",
        "Treat Fanconi syndrome or tubular injury by correcting the cause and replacing lost solutes because isolated glucose replacement does not repair generalized proximal wasting.",
        "Familial isolated renal glycosuria often needs no treatment because blood glucose regulation and other tubular functions may remain normal."
      ],
      nursingPriorities: [
        "Check the medication list and plasma glucose before escalating urine glucose because SGLT2 therapy and renal-threshold variation change interpretation.",
        "Assess intake, urine volume, orthostasis, genital symptoms, ketones, and acid-base red flags because osmotic diuresis and euglycemic DKA can accompany pharmacologic glycosuria.",
        "Do not use urine glucose to titrate insulin because the result lags, cannot detect hypoglycemia, and becomes intentionally positive with SGLT2 therapy."
      ],
      complications: [
        "Dehydration and electrolyte loss when osmotic diuresis is substantial.",
        "Genital mycotic infection or skin irritation during sustained glucose-rich urinary exposure.",
        "Missed diabetes, Fanconi syndrome, or euglycemic DKA if glycosuria is interpreted without plasma and acid-base context.",
        "Unnecessary medication discontinuation if expected SGLT2 glycosuria is mistaken for toxicity."
      ],
      redFlags: [
        "Glycosuria with ketones, vomiting, abdominal pain, tachypnea, low bicarbonate, or an anion gap.",
        "Polyuria with hypotension, oliguria after volume loss, confusion, or AKI.",
        "Normal plasma glucose plus acidosis, hypophosphatemia, hypokalemia, proteinuria, or aminoaciduria suggesting generalized tubular dysfunction.",
        "Pregnancy with hyperglycemia or illness because maternal and fetal risk requires timely evaluation."
      ],
      patientEducation: [
        "Positive urine glucose is expected on an SGLT2 inhibitor and does not by itself mean the diabetes is uncontrolled.",
        "Use blood glucose or continuous monitoring and A1c as directed because urine testing cannot detect low blood sugar reliably.",
        "Report vomiting, rapid breathing, severe fatigue, genital or perineal pain, or dehydration because those symptoms can signal a complication rather than harmless glycosuria."
      ],
      nclexTraps: [
        "Do not diagnose diabetes from urine glucose alone because renal threshold and tubular transport vary.",
        "Do not call SGLT2-associated glycosuria an adverse drug reaction by itself because it is the intended action.",
        "Do not let normal plasma glucose reassure you when glycosuria, ketones, and acidosis coexist because that pattern can be euglycemic DKA."
      ],
      sourceNote: "NCBI Clinical Methods: Glucosuria and current SGLT2 product labeling.",
      sourceKeys: ["ncbi-clinical-methods-glucosuria", "dailymed-sglt2-labels"],
      nclexEssential: true,
      tags: ["frontier-wave20", "glycosuria", "glucosuria", "renal threshold", "SGLT2", "Fanconi syndrome"]
    },
    {
      name: "Macula densa",
      category: "Renal physiology",
      aliases: ["macula densa cells", "renal salt sensor", "NaCl sensor kidney", "juxtaglomerular apparatus sensor"],
      pronunciation: "MAK-yoo-luh DEN-suh",
      wordOrigin: "Macula is Latin for spot and densa means dense. The name describes the tightly packed patch of tubular cells visible where the nephron returns to its own glomerulus.",
      definition: "The macula densa is a specialized plaque of NaCl-sensing epithelial cells at the end of the thick ascending limb and beginning of the distal tubule where it contacts the glomerular vascular pole. It translates tubular salt delivery into changes in afferent arteriolar tone and renin release, linking what the nephron receives downstream to how much the glomerulus filters upstream.",
      etiology: "The macula densa is normal anatomy rather than a disease. It becomes clinically important when flow, NaCl reabsorption, perfusion, loop-diuretic action, diabetes-related proximal reabsorption, or SGLT2 therapy changes the amount of chloride reaching its apical NKCC2 transporter.",
      pathology: "High distal NaCl signals that filtration or upstream delivery is excessive, favoring ATP/adenosine signaling and afferent arteriolar constriction to lower glomerular pressure. Low NaCl favors nitric-oxide/prostaglandin signaling and renin release, activating the renin-angiotensin-aldosterone system to preserve pressure and sodium. Chronic disease can reset or distort this feedback.",
      pathophysiology: "Macula-densa NKCC2 uptake is the key luminal sensing step. High NaCl increases ATP breakdown to adenosine, activates A1-receptor signaling on the afferent arteriole, and reduces GFR through tubuloglomerular feedback. Low NaCl increases COX-2/prostaglandin E2 signaling toward juxtaglomerular renin cells and supports afferent dilation. Diabetes can reduce distal NaCl because excess proximal sodium-glucose reabsorption hides salt from the sensor, promoting hyperfiltration; SGLT2 blockade returns more NaCl to the macula densa and restores the brake.",
      riskFactors: [
        "Diabetes-related proximal sodium-glucose hyperreabsorption because reduced distal NaCl weakens the feedback brake and promotes glomerular hyperfiltration.",
        "SGLT2 therapy because increased distal NaCl intentionally strengthens feedback and can cause an early hemodynamic eGFR dip.",
        "Loop diuretics because NKCC2 blockade at the macula densa reduces NaCl sensing and increases renin signaling.",
        "Renal-artery stenosis, dehydration, heart failure, or low effective arterial volume because low perfusion and NaCl delivery activate renin."
      ],
      signsSymptoms: [
        "The macula densa does not create a standalone symptom syndrome; its effects appear through blood pressure, volume, renin, and GFR changes.",
        "An early eGFR dip after SGLT2 initiation can reflect restored feedback rather than tubular injury when blood pressure, volume, and renal trend remain stable.",
        "Excessive RAAS activation can contribute to vasoconstriction, sodium retention, edema, and hypertension when low-delivery signaling persists."
      ],
      diagnostics: [
        "Interpret macula-densa physiology through medication timing, volume status, blood pressure, creatinine/eGFR trend, sodium handling, and clinical disease rather than a direct bedside macula-densa test.",
        "Differentiate expected hemodynamic eGFR change from AKI using timing, magnitude, hypotension, urine output, dehydration, nephrotoxins, obstruction, and recovery pattern.",
        "Renin and aldosterone may help in selected endocrine or vascular evaluations, but posture, sodium intake, medications, and volume alter results."
      ],
      labs: [
        "Creatinine and eGFR show the net filtration response but do not identify the sensor mechanism by themselves.",
        "Electrolytes, urine output, blood pressure, and volume assessment help distinguish regulated hemodynamics from pathologic renal hypoperfusion.",
        "Renin and aldosterone are context-dependent because ACE inhibitors, ARBs, diuretics, beta blockers, sodium intake, and posture alter the axis."
      ],
      treatments: [
        "There is no treatment for the macula densa itself because it is a regulatory sensor.",
        "Treat the underlying volume, vascular, endocrine, diabetic, or medication problem because the sensor responds to upstream physiology.",
        "Use SGLT2 inhibitors, RAAS drugs, or diuretics only for their clinical indications because manipulating one feedback pathway changes pressure, filtration, potassium, and volume elsewhere."
      ],
      nursingPriorities: [
        "Connect a small early SGLT2 eGFR dip to restored tubuloglomerular feedback, then still assess blood pressure, hydration, urine output, and trend because expected physiology and AKI can coexist.",
        "Review loop diuretics and RAAS drugs before interpreting renin, aldosterone, potassium, or creatinine because medication effects are part of the pathway.",
        "Escalate progressive creatinine rise, hypotension, oliguria, hyperkalemia, severe volume loss, or pulmonary edema because these findings exceed a simple adaptive sensor response."
      ],
      complications: [
        "Glomerular hyperfiltration and progressive nephron stress when the feedback brake remains weak in diabetes.",
        "Excessive GFR reduction or AKI when feedback, low perfusion, diuretics, and RAAS blockade combine in a vulnerable patient.",
        "Hypertension and volume retention when chronic low-delivery signaling sustains renin-angiotensin-aldosterone activity."
      ],
      redFlags: [
        "Rapidly progressive creatinine rise rather than a small stable early dip.",
        "Hypotension, syncope, oliguria, severe dehydration, hyperkalemia, or pulmonary edema.",
        "Suspected bilateral renal-artery stenosis or solitary-kidney perfusion dependence with abrupt renal decline after RAAS blockade."
      ],
      patientEducation: [
        "A small early kidney-number change after an SGLT2 drug can reflect lower pressure inside the glomerulus, but follow-up labs still matter because dehydration or AKI must be separated from adaptation.",
        "Report vomiting, poor intake, dizziness, fainting, reduced urine, or rapid swelling because volume changes can overwhelm normal feedback.",
        "Do not stop kidney or heart medicines from one lab value without clinician review because the trend and clinical context determine whether the change is expected or dangerous."
      ],
      nclexTraps: [
        "High NaCl at the macula densa generally applies an afferent-arteriole brake; low NaCl generally promotes renin release.",
        "Loop diuretics block NKCC2 at both the thick ascending limb and macula densa, so they can increase renin despite increasing sodium loss.",
        "The macula densa senses tubular NaCl delivery, not serum sodium concentration directly."
      ],
      sourceNote: "NCBI/PubMed renal physiology literature on macula-densa signaling and tubuloglomerular feedback.",
      sourceKeys: ["pubmed-tubuloglomerular-feedback", "pmc-renal-autoregulation"],
      nclexEssential: true,
      tags: ["frontier-wave20", "macula densa", "NKCC2", "renin", "adenosine", "SGLT2"]
    },
    {
      name: "Tubuloglomerular feedback",
      category: "Renal physiology",
      aliases: ["TGF kidney", "tubulo glomerular feedback", "glomerular feedback brake", "afferent arteriole macula densa feedback", "SGLT2 eGFR dip mechanism"],
      pronunciation: "TOO-byoo-loh-gloh-MER-yoo-ler FEED-bak",
      wordOrigin: "Tubulo- refers to the renal tubule and glomerular refers to the glomerulus. The phrase describes information flowing from downstream tubular content back to the upstream filtering glomerulus.",
      definition: "Tubuloglomerular feedback is the kidney's minute-to-minute negative-feedback system that matches each nephron's glomerular filtration rate to the NaCl reaching its macula densa. High NaCl drives ATP-to-adenosine signaling that constricts the afferent arteriole and lowers glomerular pressure and GFR; low NaCl relaxes that brake and promotes renin release. This protects distal transport capacity and keeps filtration aligned with tubular reabsorptive work.",
      etiology: "It is normal autoregulatory physiology. It becomes clinically visible during diabetes-related hyperfiltration, SGLT2 therapy, loop-diuretic use, volume depletion, renal-artery disease, RAAS blockade, and AKI because each changes distal NaCl delivery, arteriolar tone, or the kidney's ability to compensate.",
      pathology: "In diabetes, increased proximal sodium-glucose reabsorption can reduce NaCl reaching the macula densa, falsely signaling underdelivery and permitting afferent dilation and glomerular hyperfiltration. SGLT2 inhibition reverses part of that signal, increasing distal NaCl and reducing intraglomerular pressure. Excessive feedback during low perfusion, however, can further reduce filtration in a vulnerable kidney.",
      pathophysiology: "Macula-densa NKCC2 senses luminal NaCl. High uptake promotes ATP release and extracellular adenosine formation; A1-receptor signaling constricts the afferent arteriole and lowers glomerular capillary pressure and GFR. Low NaCl favors nitric oxide and prostaglandin E2, supports afferent dilation, and stimulates renin from juxtaglomerular cells. RAAS then increases efferent tone and sodium retention. The loop continually balances filtration with tubular delivery rather than maintaining one fixed GFR.",
      riskFactors: [
        "Diabetes with hyperfiltration because excess proximal sodium-glucose reabsorption weakens macula-densa braking.",
        "SGLT2 initiation because restored distal NaCl can lower intraglomerular pressure and cause an expected early eGFR dip.",
        "Volume depletion, renal-artery stenosis, NSAIDs, RAAS blockade, and diuretics because combined arteriolar and volume effects can exceed autoregulatory reserve.",
        "Advanced CKD because fewer nephrons and altered microvascular responses reduce the margin for hemodynamic change."
      ],
      signsSymptoms: [
        "No unique symptom identifies tubuloglomerular feedback; clinicians infer it from timing, eGFR pattern, blood pressure, volume status, and medication exposure.",
        "A small early creatinine rise after SGLT2 or RAAS therapy may be hemodynamic when it stabilizes and the patient remains well perfused.",
        "Dizziness, hypotension, oliguria, or progressive creatinine rise suggests the response is no longer simply adaptive."
      ],
      diagnostics: [
        "Trend creatinine/eGFR before and after a hemodynamically active drug because a single value cannot show whether the change stabilizes.",
        "Assess blood pressure, orthostasis, weight, edema, intake, losses, urine output, NSAIDs, diuretics, and RAAS therapy because feedback operates inside a whole-patient volume system.",
        "Use urinalysis, sediment, albuminuria, imaging, and trigger-specific tests when injury or obstruction is possible because tubuloglomerular feedback is a physiologic explanation, not a diagnosis of exclusion."
      ],
      labs: [
        "Creatinine and eGFR quantify filtration change but cannot alone distinguish hemodynamic adaptation from structural injury.",
        "Potassium and bicarbonate matter when RAAS drugs, CKD, or volume disorders accompany the change because dangerous electrolyte consequences can occur despite a plausible feedback mechanism.",
        "Albuminuria helps characterize glomerular risk and treatment response because reducing intraglomerular pressure can lower protein leak over time."
      ],
      treatments: [
        "Do not treat normal feedback as a disease because it is protective autoregulation.",
        "Correct excessive volume loss, hypotension, obstruction, nephrotoxin exposure, infection, or vascular compromise because those conditions can turn a regulated eGFR change into AKI.",
        "Continue or adjust SGLT2 and RAAS therapy based on trend, indication, symptoms, potassium, and clinician guidance because long-term benefit may coexist with a tolerable early hemodynamic dip."
      ],
      nursingPriorities: [
        "Establish a baseline creatinine/eGFR, potassium, blood pressure, weight, and volume assessment because later interpretation depends on the starting state.",
        "Reassess after medication initiation or illness because a stable early dip differs from progressive renal decline with hypotension or oliguria.",
        "Review NSAIDs, diuretics, ACE inhibitors, ARBs, ARNIs, SGLT2 drugs, and recent fluid losses because combined effects can overwhelm autoregulation."
      ],
      complications: [
        "Persistent glomerular hyperfiltration, albuminuria, and nephron injury when the feedback brake is chronically weak.",
        "Excessive GFR reduction and AKI when perfusion pressure, arteriolar tone, and volume all move against filtration.",
        "Medication discontinuation and lost cardiorenal benefit when an expected early dip is mislabeled as toxicity without assessing trend and context."
      ],
      redFlags: [
        "Progressive rather than stabilizing creatinine rise.",
        "Hypotension, syncope, oliguria, severe hyperkalemia, acidosis, pulmonary edema, or uremic symptoms.",
        "Active urine sediment, heavy new proteinuria, obstruction symptoms, sepsis, or nephrotoxin exposure suggesting structural or postrenal disease."
      ],
      patientEducation: [
        "Follow scheduled kidney and potassium tests after starting heart or kidney medicines because a trend is more informative than one value.",
        "Report vomiting, diarrhea, poor intake, dizziness, fainting, reduced urine, or sudden swelling because volume changes can alter kidney filtration quickly.",
        "Avoid unsupervised NSAID use during dehydration or kidney-risk treatment because prostaglandin blockade can reduce afferent perfusion reserve."
      ],
      nclexTraps: [
        "High distal NaCl lowers GFR through afferent constriction; low distal NaCl promotes renin and supports filtration.",
        "A small early eGFR dip after SGLT2 therapy can represent a protective pressure reset, not automatic nephrotoxicity.",
        "Do not use feedback physiology to excuse progressive AKI because hypotension, oliguria, severe electrolyte change, and continued creatinine rise require evaluation."
      ],
      sourceNote: "Peer-reviewed renal physiology literature on macula-densa signaling and tubuloglomerular feedback.",
      sourceKeys: ["pubmed-tubuloglomerular-feedback", "pmc-kidney-supply-demand"],
      nclexEssential: true,
      tags: ["frontier-wave20", "tubuloglomerular feedback", "macula densa", "afferent arteriole", "renin", "SGLT2"]
    }
  ];

  pathologyCards.forEach((incoming) => {
    const keys = unique([incoming.name, ...(incoming.aliases || [])]).map(normalize);
    const index = pathology.diseases.findIndex((entry) => unique([entry.name, entry.title, ...(entry.aliases || [])]).map(normalize).some((key) => keys.includes(key)));
    const existing = index >= 0 ? pathology.diseases[index] : {};
    const merged = {
      ...existing,
      ...incoming,
      aliases: unique([...(incoming.aliases || []), ...(existing.aliases || [])]),
      tags: unique(["frontier-wave20", ...(incoming.tags || []), ...(existing.tags || [])])
    };
    if (index >= 0) pathology.diseases[index] = merged;
    else pathology.diseases.push(merged);
  });

  db.pharmFrontierWave20Sglt2CausalPatch = {
    version: "2026-07-17-sglt2-drug-specific-causal",
    promotedDrugCount: drugCards.length,
    pathwayCardCount: classCards.length,
    pathologyConceptCount: pathologyCards.length,
    totalCardCount: pharmCards.length + pathologyCards.length
  };
  db.version = [db.version, "pharm-frontier-wave20-sglt2-causal"].filter(Boolean).join("+");
  pathology.frontierWave20Sglt2ConceptCount = pathologyCards.length;
  window.ANI_PHARM_DATABASE = db;
  window.ANI_PATHOLOGY_DATABASE = pathology;
}());
