/* eslint-disable */
/* Wave 41: comprehensive diabetes taxonomy, core and pancreatic forms. */
(function () {
  "use strict";

  const VERSION = "2026-07-21-wave41-diabetes-core-1";
  const SOURCE_NOTE = "This mechanism-first educational reference follows the cited diabetes classification, pregnancy, pancreatic-disease, cystic-fibrosis, transplant, and hyperglycemic-crisis guidance. Diabetes classification can change as antibodies, C-peptide, genetics, pancreatic history, pregnancy timing, medicines, and the clinical course become clearer. It supports learning and nursing assessment; current specialist guidance and local protocols govern individual diagnosis and treatment.";

  if (window.ANI_PATHOLOGY_WAVE41_DIABETES_CORE && window.ANI_PATHOLOGY_WAVE41_DIABETES_CORE.version === VERSION) return;

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) {
    window.ANI_PATHOLOGY_WAVE41_DIABETES_CORE = Object.freeze({
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
  const unique = (values) => Array.from(new Map((values || [])
    .map((value) => clean(value))
    .filter(Boolean)
    .map((value) => [normalize(value), value])).values());

  const sourceReferences = [
    {
      key: "w41-ada-classification-2026",
      label: "American Diabetes Association: Diagnosis and Classification of Diabetes, Standards of Care in Diabetes - 2026",
      url: "https://diabetesjournals.org/care/article/49/Supplement_1/S27/163926/2-Diagnosis-and-Classification-of-Diabetes",
      note: "Supports the current classification, diagnostic criteria, type 1 evaluation, pancreatic diabetes, monogenic diabetes, medication-related diabetes, post-transplantation diabetes, CFRD, and gestational diabetes distinctions."
    },
    {
      key: "w41-ada-pharmacology-2026",
      label: "American Diabetes Association: Pharmacologic Approaches to Glycemic Treatment, Standards of Care in Diabetes - 2026",
      url: "https://diabetesjournals.org/care/article/49/Supplement_1/S183/163934/9-Pharmacologic-Approaches-to-Glycemic-Treatment",
      note: "Supports physiology- and comorbidity-directed glucose-lowering treatment, insulin safety, and pancreatic-disease cautions."
    },
    {
      key: "w41-ada-pregnancy-2026",
      label: "American Diabetes Association: Management of Diabetes in Pregnancy, Standards of Care in Diabetes - 2026",
      url: "https://diabetesjournals.org/care/article/49/Supplement_1/S321/163918/15-Management-of-Diabetes-in-Pregnancy-Standards",
      note: "Supports gestational diabetes screening, pregnancy monitoring, treatment principles, postpartum testing, and maternal-fetal safety."
    },
    {
      key: "w41-ada-crises-2024",
      label: "ADA, EASD, JBDS, AACE, and DTS: Hyperglycemic Crises in Adults With Diabetes Consensus Report (2024)",
      url: "https://diabetesjournals.org/care/article/47/8/1257/156808/Hyperglycemic-Crises-in-Adults-With-Diabetes-A",
      note: "Supports recognition and monitored treatment principles for DKA, HHS, mixed crises, fluids, insulin, potassium, and precipitating illness."
    },
    {
      key: "w41-niddk-type1",
      label: "NIH NIDDK: Type 1 Diabetes",
      url: "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes",
      note: "Supports autoimmune beta-cell destruction, lifelong insulin replacement, monitoring technology, hypoglycemia prevention, and education."
    },
    {
      key: "w41-who-diabetes",
      label: "World Health Organization: Diabetes Fact Sheet",
      url: "https://www.who.int/news-room/fact-sheets/detail/diabetes",
      note: "Supports the broad pathophysiology, burden, complications, prevention, and care principles of diabetes mellitus."
    },
    {
      key: "w41-lada-consensus-2020",
      label: "International Expert Panel: Management of Latent Autoimmune Diabetes in Adults (2020)",
      url: "https://diabetesjournals.org/diabetes/article/69/10/2037/16062/Management-of-Latent-Autoimmune-Diabetes-in-Adults",
      note: "Supports LADA as slowly progressive adult autoimmune diabetes, antibody and C-peptide interpretation, heterogeneity, and the need to anticipate insulin deficiency."
    },
    {
      key: "w41-pancreasfest-2012",
      label: "PancreasFest: Detection, Evaluation and Treatment of Diabetes Mellitus in Chronic Pancreatitis",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3830751/",
      note: "Supports recognition of pancreatogenic diabetes as distinct from type 1 and type 2 diabetes, annual surveillance in chronic pancreatitis, exocrine insufficiency assessment, and tailored treatment."
    },
    {
      key: "w41-cff-cfrd",
      label: "Cystic Fibrosis Foundation and ADA: Cystic Fibrosis-Related Diabetes Clinical Care Guidelines",
      url: "https://www.cff.org/medical-professionals/cystic-fibrosis-related-diabetes-clinical-care-guidelines",
      note: "Supports CFRD screening, OGTT-based diagnosis, insulin treatment, nutrition preservation, and pulmonary-exacerbation monitoring."
    },
    {
      key: "w41-ptdm-consensus-2024",
      label: "International Consensus on Post-Transplantation Diabetes Mellitus (2024)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11024828/",
      note: "Supports stable-state diagnosis, OGTT use, combined beta-cell and metabolic mechanisms, graft-first immunosuppression decisions, and individualized treatment."
    },
    {
      key: "w41-idf-type5-2025",
      label: "International Diabetes Federation: Type 5 Diabetes (Malnutrition-Related Diabetes)",
      url: "https://idf.org/about-diabetes/type-5-diabetes/",
      note: "Supports the 2025 IDF recognition of malnutrition-related diabetes as type 5 while formal diagnostic and treatment criteria remain under development."
    },
    {
      key: "w41-endotext-fcpd-2024",
      label: "NCBI Endotext: Fibrocalculous Pancreatic Diabetes (updated 2024)",
      url: "https://www.ncbi.nlm.nih.gov/sites/books/NBK578126/",
      note: "Supports the pancreatic-calculus, exocrine-failure, diabetes, nutrition, insulin, and pancreatic-cancer features of fibrocalculous pancreatic diabetes."
    },
    {
      key: "w41-easl-hemochromatosis-2022",
      label: "European Association for the Study of the Liver: Haemochromatosis Clinical Practice Guideline (2022)",
      url: "https://easl.eu/wp-content/uploads/2022/06/PIIS01688278220021121.pdf",
      note: "Supports diagnosis and management of iron overload and its hepatic, endocrine, cardiac, and pancreatic consequences."
    }
  ];

  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];
  sourceReferences.forEach((source) => {
    const existing = database.sourceReferences.find((item) => clean(item && (item.key || item.id)) === source.key);
    if (existing) Object.assign(existing, source);
    else database.sourceReferences.push({ ...source });
  });

  function completeCard(spec) {
    return {
      nclexEssential: true,
      sourceNote: SOURCE_NOTE,
      abbreviations: [],
      commonMisspellings: [],
      tags: [],
      ...spec,
      displayName: spec.displayName || spec.name
    };
  }

  const cards = [
    completeCard({
      name: "Diabetes mellitus classification",
      category: "Endocrinology - Diabetes Classification",
      definition: "Diabetes mellitus is a family of metabolic disorders in which blood glucose remains abnormally high because insulin is absent, insufficient, ineffective, or disrupted by another disease or treatment. It is not one uniform illness. The major clinical categories are type 1 diabetes, type 2 diabetes, gestational diabetes, and other specific forms such as pancreatic, monogenic, medication-induced, and post-transplantation diabetes. Correct classification matters because the safest treatment for one mechanism can be inadequate or harmful for another.",
      pathology: "Insulin normally restrains hepatic glucose output and helps muscle and adipose tissue use and store nutrients. When insulin supply cannot meet physiologic need, the liver continues releasing glucose while peripheral tissues cannot use it normally, causing hyperglycemia. The reason for that mismatch defines the type: autoimmune beta-cell loss in type 1; progressive beta-cell failure often with insulin resistance in type 2; pregnancy-related resistance exceeding beta-cell reserve in gestational diabetes; pancreatic destruction, a single-gene variant, hormone excess, or a medicine in other specific forms. Severe insulin deficiency also releases fatty acids and ketones, which explains DKA risk, while profound hyperglycemia causes osmotic diuresis, dehydration, and possible HHS.",
      pathophysiology: [
        "First establish that hyperglycemia meets diagnostic criteria. In a nonpregnant person, diabetes can be diagnosed by A1C at least 6.5%, fasting plasma glucose at least 126 mg/dL, 2-hour plasma glucose at least 200 mg/dL during a 75-g OGTT, or random plasma glucose at least 200 mg/dL with classic symptoms or a hyperglycemic crisis. Without unequivocal hyperglycemia, an abnormal result requires confirmation.",
        "Then identify mechanism rather than guessing from age or appearance. Islet autoantibodies and the tempo of insulin loss support type 1; C-peptide estimates endogenous insulin secretion when interpreted with glucose, timing, kidney function, and recent crisis; family pattern and extra-pancreatic findings may prompt genetic testing; pancreatic disease, pregnancy timing, transplantation, hormone excess, and medicines supply different causal clues.",
        "Classification can evolve. An adult initially labeled type 2 may have LADA, pancreatic diabetes, MODY, or ketosis-prone diabetes. A person with obesity can still have type 1 or monogenic diabetes, and a lean person can have type 2. Insulin treatment describes therapy, not etiology.",
        "Chronic hyperglycemia injures small vessels, nerves, kidneys, retina, and larger arteries through glycation, oxidative stress, endothelial dysfunction, inflammation, and altered lipid handling. The acute and chronic risks overlap across types, but the likelihood of ketosis, hypoglycemia, malabsorption, genetic organ disease, pregnancy complications, or medication interactions depends on the underlying form."
      ],
      etiology: "Classification asks why insulin supply and demand no longer match. Causes include immune-mediated beta-cell destruction; polygenic beta-cell dysfunction and insulin resistance; placental hormones; exocrine pancreatic inflammation, resection, fibrosis, cancer, cystic fibrosis, iron overload, or calcific disease; single-gene variants; endocrine hormone excess; lipodystrophy or insulin-receptor disorders; transplantation and immunosuppression; medications or chemicals; and malnutrition-related insulin deficiency. More than one mechanism can coexist.",
      riskFactors: [
        "Family or personal autoimmune disease, islet autoantibodies, or rapidly progressive insulin deficiency",
        "Family history, prior gestational diabetes, metabolic syndrome, insulin resistance, age, ancestry, or polycystic ovary syndrome",
        "Pancreatitis, pancreatic surgery or cancer, cystic fibrosis, hemochromatosis, exocrine insufficiency, or chronic undernutrition",
        "Young-onset multigenerational diabetes, diabetes before 6 months, renal or hearing abnormalities, or another syndromic clue",
        "Pregnancy, organ transplantation, glucocorticoids, selected antipsychotic, HIV, cancer, or immunosuppressive therapies, and hormone-excess disorders"
      ],
      signsSymptoms: [
        "Polyuria and nocturia occur because filtered glucose exceeds renal reabsorptive capacity and drags water into urine; polydipsia is the compensatory response.",
        "Weight loss, fatigue, blurred vision, recurrent infection, slow wound healing, or neuropathic symptoms may occur, but type 2 and gestational diabetes can be asymptomatic at diagnosis.",
        "Vomiting, abdominal pain, deep rapid breathing, fruity breath, dehydration, and altered consciousness suggest DKA; profound dehydration and neurologic change with very high glucose suggest HHS.",
        "Mechanism-specific clues include autoimmune disease, pancreatic pain or steatorrhea, a multigenerational pattern, low birth weight, pregnancy timing, unusual fat distribution, renal cysts, hearing loss, or a temporal relationship to a medicine."
      ],
      diagnostics: [
        "Confirm diabetes with standardized venous plasma glucose or laboratory A1C criteria. Use plasma glucose rather than relying on A1C when pregnancy, altered red-cell turnover, hemoglobin variants, transfusion, erythropoietin therapy, dialysis, or certain other conditions distort the A1C-glycemia relationship.",
        "When type is uncertain, integrate age, tempo, body habitus without stereotyping, family history, autoimmune history, ketones, islet autoantibodies, and C-peptide. Do not interpret C-peptide during or immediately after a hyperglycemic emergency as if it represented stable reserve.",
        "Ask about pancreatitis, surgery, cancer, cystic fibrosis, iron overload, pregnancy, transplantation, nutrition, endocrine symptoms, and medication exposure. These histories can redirect classification more reliably than a label assigned from glucose alone.",
        "Use genetic testing with counseling when neonatal diabetes, MODY, mitochondrial disease, or another monogenic syndrome is plausible. A variant of uncertain significance does not establish a diagnosis.",
        "Assess acute severity with electrolytes, bicarbonate or venous blood gas, beta-hydroxybutyrate or ketones, kidney function, hydration, and osmolality when indicated; then screen long-term kidney, eye, nerve, foot, and cardiovascular complications according to the confirmed type and duration."
      ],
      treatments: [
        "Treat acute DKA or HHS as an emergency with protocol-directed fluids, insulin, electrolyte and potassium management, frequent reassessment, and treatment of the precipitating cause; the classification debate must not delay stabilization.",
        "Replace insulin continuously when endogenous supply is absent or critically low. Other forms may use nutrition, activity, noninsulin medicines, insulin, pancreatic enzymes, genetic precision therapy, cause-directed endocrine care, or a combination.",
        "Choose therapy around mechanism, pregnancy, kidney and liver function, cardiovascular risk, hypoglycemia risk, nutrition, access, and the patient's priorities rather than assuming every diabetes card shares the type 2 algorithm.",
        "Address blood pressure, lipids, tobacco, vaccination, kidney protection, eye and foot surveillance, sleep, dental health, and psychosocial burden because glucose is only one pathway to diabetes-related harm."
      ],
      contraindications: [
        "Do not classify diabetes from age, weight, race, insulin use, or DKA alone.",
        "Do not stop basal insulin in type 1 or another severely insulin-deficient state because food is withheld; use a supervised adjustment and glucose-ketone plan.",
        "Do not mix pregnancy OGTT strategies or apply nonpregnancy A1C assumptions without checking the clinical context.",
        "Do not stop transplant, cancer, HIV, psychiatric, or steroid therapy independently because it may contribute to hyperglycemia; coordinate risk-benefit decisions with the prescribing specialty."
      ],
      nursingPriorities: [
        "Verify the documented diabetes type, usual medicines or pump settings, glucose technology, meal pattern, hypoglycemia rescue plan, and who manages dose changes. Clarify a vague or contradictory label before transitions of care.",
        "Trend glucose with symptoms, food, activity, steroid timing, enteral feeds, illness, kidney function, and insulin delivery because a number is meaningful only in its physiologic context.",
        "Check ketones according to the person's plan during illness, vomiting, persistent hyperglycemia, pregnancy, or suspected pump failure and escalate early for evolving acidosis.",
        "Inspect injection, infusion, and sensor sites; protect access to insulin and supplies; reconcile doses during fasting and procedures; and use independent checks for high-risk insulin administration.",
        "Teach-back sick-day care, hypoglycemia treatment, glucagon, hydration, foot care, follow-up testing, and type-specific red flags. Document the suspected mechanism and any unresolved classification question in handoff."
      ],
      redFlags: [
        "Vomiting, abdominal pain, deep breathing, ketones, dehydration, or altered consciousness",
        "Severe hypoglycemia, seizure, unconsciousness, or inability to swallow",
        "Pump interruption or missed basal insulin without a safe replacement plan",
        "Chest pain, focal neurologic deficit, acute limb or foot infection, sudden vision loss, or rapidly worsening kidney function",
        "Pregnancy with ketones, reduced fetal movement, severe hypertension symptoms, or recurrent hypoglycemia"
      ],
      complications: [
        "Diabetic ketoacidosis, hyperosmolar hyperglycemic state, severe hypoglycemia, dehydration, and electrolyte disturbance",
        "Retinopathy, kidney disease, neuropathy, foot ulceration, infection, and impaired wound healing",
        "Atherosclerotic cardiovascular disease, heart failure, stroke, and peripheral artery disease",
        "Type-specific harm from missed insulin deficiency, malabsorption, genetic organ disease, pregnancy complications, or an untreated secondary cause"
      ],
      prognosis: "Prognosis depends on mechanism, timeliness of correct classification, access to effective treatment and monitoring, coexisting disease, and prevention of acute and chronic complications. Correctly reclassifying LADA, pancreatic, monogenic, gestational, medication-induced, or post-transplantation diabetes can materially change treatment and family counseling. No classification label replaces ongoing reassessment because beta-cell reserve, pregnancy, medicines, organ function, and complications change over time.",
      prevention: "Type 1 and most monogenic forms are not prevented by lifestyle changes. Type 2 risk can often be reduced or delayed through feasible nutrition, activity, weight, sleep, and cardiometabolic interventions; gestational and medication-related risk can be recognized through timely screening; pancreatic and transplant-related harm can be reduced through surveillance. Across all forms, prevention also means avoiding diagnostic delay, maintaining access to insulin, and screening for complications before symptoms appear.",
      patientEducation: [
        "The word diabetes describes high glucose, but the type explains why it is happening. Ask what evidence supports your classification and whether antibodies, C-peptide, pancreatic history, pregnancy timing, medicines, or genetic testing could change it.",
        "Insulin use does not automatically mean type 1, and not using insulin does not exclude autoimmune or monogenic diabetes.",
        "Keep a written sick-day and emergency plan, rapid carbohydrate and glucagon when prescribed, medication and device backups, and a current list of the exact diabetes type.",
        "Seek urgent care for vomiting with ketones, deep breathing, severe dehydration, confusion, seizure, inability to treat a low, chest pain, stroke symptoms, or a rapidly worsening infected foot."
      ],
      nclexTraps: [
        "DKA is not exclusive to type 1, and HHS is not exclusive to type 2.",
        "Obesity does not exclude type 1 or MODY; leanness does not prove type 1.",
        "LADA belongs within autoimmune type 1 diabetes in ADA classification, while pancreatic diabetes belongs among other specific types.",
        "Diabetes insipidus is a water-balance disorder, not a glucose disorder; gestational diabetes insipidus is not gestational diabetes mellitus."
      ],
      relatedTopics: [
        "Type 1 diabetes mellitus", "Latent autoimmune diabetes in adults", "Type 2 diabetes mellitus",
        "Pancreatic diabetes", "Monogenic diabetes mellitus", "Gestational diabetes mellitus",
        "Ketosis-prone diabetes", "Post-transplantation diabetes mellitus", "Medication- or chemical-induced diabetes mellitus",
        "Type 5 diabetes mellitus", "Diabetes insipidus", "Diabetic ketoacidosis", "Hyperosmolar hyperglycemic state"
      ],
      aliases: ["diabetes", "diabetes mellitus", "diabetes overview", "diabetes mellitus overview", "diabetes classification", "types of diabetes", "all diabetes types", "kinds of diabetes", "DM classification", "sugar diabetes", "what type of diabetes do I have"],
      abbreviations: ["DM"],
      commonMisspellings: ["diabetis classification", "diabtes mellitus types", "diebetes types", "diabetes clasification"],
      tags: ["diabetes taxonomy", "diabetes diagnosis", "autoantibodies", "C-peptide", "A1C", "OGTT", "insulin deficiency", "insulin resistance", "secondary diabetes"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ada-crises-2024", "w41-who-diabetes"]
    }),

    completeCard({
      name: "Type 1 diabetes mellitus",
      mergeNames: ["Type 1 diabetes"],
      category: "Endocrinology - Autoimmune Diabetes",
      definition: "Type 1 diabetes mellitus is autoimmune destruction of pancreatic beta cells that progressively removes the body's ability to make enough insulin. It can begin at any age and may progress rapidly or slowly. Once insulin secretion is insufficient, exogenous insulin is required continuously to prevent catabolism and ketoacidosis; age, body weight, or an initial response to tablets cannot safely rule it out.",
      pathology: "T lymphocytes and islet-directed autoimmunity damage beta cells. Insulin normally suppresses hepatic glucose and ketone production while allowing tissues to use and store nutrients. As beta-cell mass falls, glucose rises and fat breakdown accelerates; the liver converts fatty acids into ketones, consuming bicarbonate and producing metabolic acidosis. C-peptide falls because it is released with endogenous insulin. The process often coexists with autoimmune thyroid or celiac disease because immune susceptibility is systemic rather than confined to the pancreas.",
      pathophysiology: [
        "Stage 1 has persistent multiple islet autoantibodies with normal glucose; stage 2 adds dysglycemia but not yet symptomatic clinical diabetes; stage 3 is overt diabetes. These stages explain why immune disease can be active before polyuria or weight loss appears.",
        "When endogenous insulin becomes inadequate, hepatic gluconeogenesis and glycogenolysis continue despite extracellular glucose abundance. Muscle and adipose uptake fall, so cells behave as if they are starving while blood glucose rises.",
        "Unrestrained lipolysis sends fatty acids to the liver for ketogenesis. Accumulating beta-hydroxybutyrate and acetoacetate lower bicarbonate and pH; osmotic diuresis removes water and electrolytes, creating DKA.",
        "The pace varies. Children may deteriorate quickly, adults may retain measurable C-peptide for years, and a temporary honeymoon after insulin begins reflects partial surviving beta-cell function rather than cure."
      ],
      etiology: "Type 1 diabetes arises from genetic susceptibility plus immune and environmental influences that are not fully understood. GAD, IA-2, ZnT8, insulin, and islet-cell autoantibodies can mark the process. A negative antibody panel does not completely exclude type 1, particularly after long duration or when testing is incomplete; classification must integrate the clinical course and endogenous insulin reserve.",
      riskFactors: ["First-degree relative with type 1 diabetes", "Multiple islet autoantibodies", "Personal or family autoimmune thyroid, celiac, adrenal, or other autoimmune disease", "Younger age increases suspicion but adult onset is common", "Immune checkpoint inhibitor exposure can trigger an abrupt autoimmune insulin-deficient phenotype"],
      signsSymptoms: ["Polyuria, polydipsia, nocturia, weight loss, fatigue, blurred vision, and dehydration", "New enuresis, candidiasis, poor growth, or declining school or work performance", "Nausea, vomiting, abdominal pain, fruity breath, and deep rapid breathing with DKA", "Hypoglycemia symptoms during treatment: sweating, tremor, hunger, palpitations, confusion, behavior change, seizure, or unconsciousness"],
      diagnostics: ["Confirm diabetes with standard plasma glucose or A1C criteria; a symptomatic crisis with unequivocal hyperglycemia does not wait for repeat outpatient confirmation.", "Measure GAD first in many adult algorithms, followed when appropriate by IA-2 and/or ZnT8; insulin autoantibody is most interpretable before exogenous insulin exposure.", "Interpret C-peptide with simultaneous glucose, kidney function, disease duration, and recent metabolic stability. Do not use a value during or within the immediate recovery from DKA to justify insulin withdrawal.", "Check beta-hydroxybutyrate, electrolytes, bicarbonate or venous pH, kidney function, and hydration when DKA is possible.", "Screen for autoimmune thyroid and celiac disease and other complications according to current age- and duration-based guidance."],
      treatments: ["Provide continuous physiologic insulin replacement using basal-bolus injections or pump therapy; automated insulin delivery and CGM can reduce burden and improve safety when accessible and appropriate.", "Match insulin to carbohydrate, current glucose, activity, illness, and individual sensitivity while preserving a basal component during fasting or sickness.", "Treat hypoglycemia promptly with measured fast carbohydrate when awake and able to swallow or glucagon when severe; reassess because insulin action can outlast initial rescue.", "Treat DKA with monitored fluids, insulin, potassium and other electrolyte management, and precipitant care rather than an isolated insulin dose.", "Address cardiovascular risk, eye, kidney, nerve and foot surveillance, vaccination, nutrition, exercise, mental health, and access to supplies."],
      contraindications: ["Never casually hold all basal insulin because the patient is NPO, vomiting, or has a normal current glucose.", "Do not diagnose or exclude type 1 from age, BMI, family history, one antibody, or DKA alone.", "Do not give oral carbohydrate to an unconscious person or someone unable to protect the airway.", "Do not rely on CGM alone when symptoms and sensor readings conflict; confirm according to the device and clinical plan."],
      nursingPriorities: ["Verify basal insulin is ordered and delivered during admission, procedures, nutrition interruption, and device transitions; escalate any gap immediately.", "Assess glucose, ketones during illness or persistent hyperglycemia, hydration, respiration, mental status, and pump or infusion integrity.", "Coordinate prandial insulin with food actually available and consumed, and know the plan for delayed meals, tube feeds, exercise, and vomiting.", "Keep rapid carbohydrate and protocol-directed glucagon accessible, use independent insulin checks when required, and reassess after treatment.", "Teach-back pump failure backup, injection technique, site rotation, sick-day dosing, ketone thresholds, driving and exercise safety, medical identification, and supply continuity."],
      redFlags: ["Pump interruption, occlusion, or missed basal insulin without immediate backup", "Moderate or large ketones, vomiting, abdominal pain, deep breathing, or dehydration", "Severe hypoglycemia, seizure, unconsciousness, or inability to swallow", "Rapidly changing glucose with confusion, hypotension, or inability to retain fluids"],
      complications: ["DKA and recurrent ketosis when insulin delivery is interrupted", "Severe hypoglycemia and impaired awareness", "Retinopathy, nephropathy, neuropathy, foot disease, cardiovascular disease, and infection", "Diabetes distress, disordered eating, device or supply failure, and autoimmune comorbidity"],
      prognosis: "With reliable insulin access, glucose technology when useful, education, and complication prevention, people with type 1 diabetes can live long and active lives. Risk rises with repeated DKA, severe hypoglycemia, persistent hyperglycemia, kidney or cardiovascular disease, and barriers to insulin or monitoring. A honeymoon phase reduces dose need temporarily but does not mean immune destruction has reversed.",
      prevention: "Routine lifestyle measures do not prevent autoimmune type 1 diabetes. Screening of selected at-risk relatives can identify presymptomatic stages, and specialist-directed disease-modifying therapy may delay progression in eligible people. Preventable harm centers on early symptom recognition, uninterrupted insulin access, vaccination and illness planning, and avoiding missed or duplicated doses.",
      patientEducation: ["You need a source of basal insulin even when you are not eating; ask for a dose-adjustment plan rather than stopping it.", "Check ketones during illness, vomiting, persistent high glucose, or suspected pump failure and follow the written hydration, correction, and escalation plan.", "Carry rapid carbohydrate, prescribed glucagon, medical identification, and backup insulin and delivery supplies.", "Autoimmune diabetes can occur in adults and in people of any body size; needing insulin reflects physiology, not personal failure."],
      nclexTraps: ["Type 1 diabetes is autoimmune insulin deficiency, not simply childhood diabetes.", "A honeymoon period is temporary residual secretion, not remission that makes basal insulin optional.", "Potassium may be normal or high in DKA while total body potassium is depleted; insulin can rapidly lower serum potassium.", "LADA is slowly progressive autoimmune type 1 diabetes, not a mixture created by taking both insulin and tablets."],
      relatedTopics: ["Diabetes mellitus classification", "Latent autoimmune diabetes in adults", "Diabetic ketoacidosis", "Hypoglycemia", "Insulin", "C-peptide", "Islet autoantibodies", "Type 1 diabetes in children"],
      aliases: ["type 1 diabetes", "diabetes type 1", "diabetes 1", "type one diabetes", "diabetes one", "diabetes type one", "T1 diabetes", "T1DM", "type 1 DM", "juvenile diabetes", "juvenile-onset diabetes", "autoimmune diabetes", "autoantibody-negative type 1 diabetes", "idiopathic type 1 diabetes", "type 1B diabetes", "insulin-dependent diabetes mellitus", "IDDM", "DM1"],
      abbreviations: ["T1DM", "T1D", "DM1"],
      commonMisspellings: ["type one diabetis", "type 1 diabtes", "t1 diabeties", "autoimune diabetes"],
      tags: ["autoimmune beta cell destruction", "absolute insulin deficiency", "islet autoantibodies", "C-peptide", "basal insulin", "DKA", "CGM", "insulin pump"],
      sourceKeys: ["w41-ada-classification-2026", "w41-niddk-type1", "w41-ada-crises-2024"]
    }),

    completeCard({
      name: "Latent autoimmune diabetes in adults",
      category: "Endocrinology - Autoimmune Diabetes",
      definition: "Latent autoimmune diabetes in adults (LADA) is slowly progressive autoimmune type 1 diabetes that begins in adulthood and does not always require insulin immediately at diagnosis. The informal name type 1.5 diabetes reflects its initial resemblance to type 2, but it is not a formal fifth category or a half-type. Islet autoimmunity gradually reduces beta-cell reserve, so an early response to noninsulin treatment does not remove the future risk of insulin deficiency and DKA.",
      pathology: "The immune mechanism is the same family of beta-cell-directed injury seen in type 1 diabetes, but the pace is often slower. GAD antibodies are common, and C-peptide may be measurable initially because some beta cells remain. As immune loss continues, meal-stimulated insulin becomes inadequate first, then fasting control worsens. This explains why a person can look like type 2 at diagnosis yet progressively lose response to therapies that depend on endogenous insulin secretion.",
      pathophysiology: ["Autoantibody-positive beta-cell injury begins before symptoms and progresses at a variable rate.", "Residual secretion can temporarily control fasting glucose while post-meal excursions reveal limited reserve.", "Falling C-peptide makes insulin-secretagogue-only strategies less effective and increases catabolic and ketotic risk.", "Insulin resistance can coexist with autoimmunity, so body size and metabolic syndrome modify the presentation without changing the autoimmune cause."],
      etiology: "LADA reflects autoimmune susceptibility expressed in adulthood. There is no single universally accepted age or insulin-free duration that biologically separates it from other adult-onset type 1 diabetes. The practical purpose of the label is to prevent an adult with evolving insulin deficiency from being managed indefinitely as ordinary type 2 diabetes.",
      riskFactors: ["Adult-onset diabetes with personal or family autoimmunity", "Lower BMI or unintentional weight loss, although overweight and obesity do not exclude LADA", "Rapid failure of noninsulin therapy or unexpectedly low insulin secretion", "GAD, IA-2, ZnT8, or other validated islet autoantibodies", "Ketosis, marked glucose variability, or another clue to progressive insulin deficiency"],
      signsSymptoms: ["Polyuria, polydipsia, fatigue, blurred vision, or weight loss may be mild or gradual", "Initial phenotype can appear indistinguishable from type 2 diabetes", "Increasing post-meal glucose and declining medication response as beta-cell reserve falls", "Ketones, vomiting, abdominal pain, deep breathing, and dehydration when severe insulin deficiency develops"],
      diagnostics: ["Confirm diabetes by standard criteria, then test validated islet autoantibodies when adult type is uncertain; GAD is commonly the first test.", "Confirm an isolated low-specificity or clinically discordant antibody result with another validated antibody or specialist review because false positives can misclassify type 2 diabetes.", "Trend C-peptide with simultaneous glucose in a stable state to estimate reserve; one value is not a permanent classification.", "Review autoimmune history, weight trajectory, time to treatment failure, ketosis, and insulin needs rather than relying on an arbitrary age cutoff.", "Reassess the label when control worsens despite adherence because progressive insulin deficiency may require a different regimen."],
      treatments: ["Individualize treatment according to glucose pattern and C-peptide reserve while anticipating eventual insulin need.", "Start insulin promptly when hyperglycemia is symptomatic, catabolic, ketotic, or inadequately controlled; do not wait for DKA to prove insulin deficiency.", "Use noninsulin therapies only when physiology, organ function, and evidence support them, with continued surveillance for declining secretion.", "Teach the same ketone, sick-day, hypoglycemia, and insulin-delivery safety skills used in type 1 diabetes once insulin deficiency is present."],
      contraindications: ["Do not call LADA type 2 solely because insulin was not required on day one.", "Do not call every adult with a single unconfirmed GAD result LADA without clinical correlation.", "Do not promise that oral medication will permanently avoid insulin.", "Do not stop basal insulin during illness or fasting once continuous replacement is required."],
      nursingPriorities: ["Document the autoimmune classification and current residual function rather than only listing 'diabetes'.", "Assess weight loss, ketones, dehydration, glucose pattern, and speed of treatment failure.", "Prepare the patient for insulin education before an emergency makes the transition abrupt.", "Coordinate antibody and C-peptide follow-up and screen related autoimmune disease as ordered.", "Use nonjudgmental language: insulin need reflects progressive beta-cell loss, not failure by the patient."],
      redFlags: ["Ketones with vomiting, abdominal pain, rapid breathing, or dehydration", "Rapid unintentional weight loss or severe symptomatic hyperglycemia", "Falling C-peptide with worsening glucose despite appropriate therapy", "Severe hypoglycemia after an insulin transition or dose change"],
      complications: ["DKA from delayed recognition of advanced insulin deficiency", "Hypoglycemia during treatment transitions", "Standard microvascular and cardiovascular diabetes complications", "Diagnostic delay, repeated ineffective therapy, and psychological harm from blaming the patient"],
      prognosis: "The pace of insulin loss varies, but LADA generally progresses toward greater insulin dependence. Early recognition enables planned education and safer therapy before DKA or severe catabolism. Long-term complication risk follows cumulative glycemia, blood pressure, lipids, kidney disease, tobacco exposure, and access to care rather than the LADA label alone.",
      prevention: "LADA is not known to be preventable through lifestyle choices. Preventable harm comes from testing when the phenotype is atypical, confirming credible autoimmunity, monitoring reserve, and starting insulin before metabolic decompensation.",
      patientEducation: ["LADA is adult autoimmune type 1 diabetes that can progress slowly; type 1.5 is an informal nickname.", "An early period without insulin does not mean the disease is type 2 or that later insulin represents failure.", "Know the signs of insulin deficiency and check ketones according to your plan during illness or persistent hyperglycemia.", "Ask for a written transition plan and training before insulin becomes urgently necessary."],
      nclexTraps: ["LADA is included within type 1 diabetes in ADA classification.", "Adult age and obesity do not exclude autoimmune diabetes.", "One antibody test can mislead; use validated assays and clinical context.", "C-peptide must be interpreted with glucose, kidney function, treatment, disease duration, and recent crisis."],
      relatedTopics: ["Type 1 diabetes mellitus", "Type 2 diabetes mellitus", "Diabetes mellitus classification", "C-peptide", "Islet autoantibodies", "Diabetic ketoacidosis"],
      aliases: ["LADA", "latent autoimmune diabetes", "latent adult autoimmune diabetes", "latent autoimmune diabetes of adults", "latent autoimmune diabetes in adulthood", "type 1.5 diabetes", "type one and a half diabetes", "slowly progressive autoimmune diabetes", "adult autoimmune diabetes", "SPIDDM"],
      abbreviations: ["LADA", "SPIDDM"],
      commonMisspellings: ["latent autoimune diabetes", "late autoimmune diabetes adults", "lada diabetis", "type 1 point 5 diabeties"],
      tags: ["adult-onset type 1", "GAD antibody", "C-peptide decline", "type 1.5", "progressive insulin deficiency"],
      sourceKeys: ["w41-ada-classification-2026", "w41-lada-consensus-2020"]
    }),

    completeCard({
      name: "Type 2 diabetes mellitus",
      mergeNames: ["Type 2 diabetes"],
      category: "Endocrinology - Insulin Resistance and Beta-Cell Dysfunction",
      definition: "Type 2 diabetes mellitus is a heterogeneous disorder in which pancreatic beta cells cannot sustain enough insulin secretion for the body's needs, commonly on a background of insulin resistance. It is not simply 'too much sugar' or a disease defined by body weight. Genetics, ectopic fat, inflammation, sleep, medicines, age, environment, and other metabolic pressures can all raise insulin demand, while progressive beta-cell dysfunction determines when glucose rises.",
      pathology: "Early in the process, muscle, liver, and adipose tissue respond less effectively to insulin. Beta cells compensate by secreting more, but susceptible cells eventually cannot maintain that output. The liver then releases excessive glucose during fasting, muscle clears less glucose after meals, and adipose lipolysis increases. Hyperglycemia and excess fatty acids further impair beta-cell function, creating a feedback loop. Relative rather than absolute insulin deficiency is typical, but severe decompensation can produce DKA as well as HHS.",
      pathophysiology: ["Insulin resistance increases the amount of insulin required to restrain hepatic glucose output and move glucose into tissue.", "Compensatory hyperinsulinemia can maintain normal glucose for years, which explains why risk factors precede diagnostic thresholds.", "Progressive beta-cell dysfunction first raises post-meal glucose and later fasting glucose; glucotoxicity and lipotoxicity worsen both secretion and action.", "Osmotic diuresis causes dehydration when glucose is very high, while chronic glycation and vascular injury drive renal, retinal, neural, and cardiovascular complications."],
      etiology: "Type 2 diabetes is polygenic and strongly shaped by social and environmental conditions. Family history, prior gestational diabetes, age, sleep disorders, polycystic ovary syndrome, some medicines, and patterns of adiposity influence risk. Body mass index is an imperfect proxy: type 2 diabetes occurs in lean people, especially when beta-cell reserve is limited, while obesity does not prove that an atypical presentation is type 2.",
      riskFactors: ["Family history and high-risk genetic or ancestral background", "Prediabetes, prior gestational diabetes, polycystic ovary syndrome, or acanthosis nigricans", "Central or ectopic adiposity, physical inactivity, sleep apnea, or metabolic dysfunction", "Hypertension, dyslipidemia, cardiovascular disease, fatty liver disease, or chronic kidney disease", "Glucocorticoids, some antipsychotic or HIV medicines, transplantation, and other diabetogenic exposures"],
      signsSymptoms: ["Often no symptoms until screening identifies hyperglycemia", "Polyuria, polydipsia, fatigue, blurred vision, recurrent candidiasis, or slow wound healing", "Acanthosis nigricans, central adiposity, hypertension, dyslipidemia, or fatty liver may suggest insulin resistance", "Profound dehydration, weakness, neurologic change, or altered consciousness with HHS; ketones and DKA can also occur"],
      diagnostics: ["Use standard A1C, fasting glucose, OGTT, or symptomatic random-glucose criteria and confirm when hyperglycemia is not unequivocal.", "Assess the phenotype for autoimmune, monogenic, pancreatic, medication, endocrine, or ketosis-prone alternatives when age, weight loss, ketosis, family pattern, or treatment response is atypical.", "Measure C-peptide and islet autoantibodies when classification affects safety, interpreting them in clinical context rather than as isolated yes-or-no tests.", "Screen urine albumin and eGFR, blood pressure, lipids, eyes, feet, neuropathy, dental health, liver risk, and cardiovascular disease according to current guidance.", "Review glucose patterns rather than one value, including fasting, post-meal, overnight, illness, medication timing, and hypoglycemia."],
      treatments: ["Build an individualized plan combining feasible nutrition, activity, sleep, weight and tobacco support with medication chosen for glycemia, cardiovascular and kidney benefit, heart failure, hypoglycemia, organ function, cost, and preference.", "Use insulin when catabolism, severe symptomatic hyperglycemia, ketosis, pregnancy, acute illness, or inadequate endogenous secretion makes it necessary; insulin use does not reclassify the disease as type 1.", "Teach class-specific risks such as hypoglycemia with insulin or secretagogues, dehydration and genital infection with SGLT2 inhibitors, and gastrointestinal or nutritional effects with other agents.", "Treat blood pressure, lipids, kidney and cardiovascular risk and maintain eye, foot, vaccine, dental, and complication surveillance."],
      contraindications: ["Do not assume type 2 from adult age or higher body weight when ketosis, rapid loss, autoimmunity, pancreatic disease, or monogenic clues are present.", "Do not use shame-based food or weight language; it impairs engagement and misrepresents multifactorial biology.", "Do not continue a medicine through acute illness, fasting, contrast, or renal decline without checking its specific sick-day and procedure plan.", "Do not call DKA impossible in type 2, especially with severe illness, SGLT2 inhibitor exposure, or ketosis-prone diabetes."],
      nursingPriorities: ["Reconcile every glucose-lowering medicine, dose, meal relationship, organ-function limitation, and hypoglycemia risk.", "Trend glucose with food, activity, steroid exposure, infection, hydration, renal function, and treatment changes.", "Inspect feet and footwear and document skin, temperature, pulses, protective sensation, wounds, drainage, and off-loading needs.", "Coordinate eye, kidney, cardiovascular, lipid, vaccine, dental, and nutrition follow-up because prevention extends beyond A1C.", "Teach-back monitoring, medication purpose, hypoglycemia rescue, sick-day holds or continuation, and urgent HHS or DKA symptoms."],
      redFlags: ["Severe hypoglycemia, seizure, unconsciousness, or inability to self-treat", "Marked dehydration, confusion, extreme hyperglycemia, vomiting, ketones, or deep breathing", "Hot swollen foot, spreading ulcer infection, black tissue, or systemic toxicity", "Chest pain, focal neurologic deficit, acute limb ischemia, or sudden vision loss"],
      complications: ["HHS, DKA, hypoglycemia, dehydration, and infection", "Kidney disease, retinopathy, neuropathy, foot ulcer, amputation, and dental disease", "Atherosclerotic cardiovascular disease, stroke, heart failure, and peripheral artery disease", "Fatty liver disease, sleep apnea, psychosocial burden, and treatment-access harm"],
      prognosis: "Type 2 diabetes is progressive but highly modifiable. Early comprehensive care can delay kidney, eye, nerve, cardiovascular, and foot complications. Remission can occur after substantial sustained metabolic change or surgery in selected people, but recurrence remains possible and ongoing surveillance is necessary; remission does not erase prior vascular risk.",
      prevention: "Type 2 diabetes can often be delayed through accessible nutrition, physical activity, sleep, weight and cardiometabolic support, and medication in selected high-risk people. Prevention must also address food access, safe places to move, medication effects, and follow-up rather than placing responsibility solely on individual willpower.",
      patientEducation: ["Type 2 diabetes combines beta-cell limits with insulin resistance; it is not a moral judgment or proof that a person ate incorrectly.", "Learn what each medicine does, when it can cause a low, and what changes during illness, fasting, procedures, or kidney decline.", "Check feet daily and keep kidney, eye, cardiovascular, dental, and vaccine appointments even when glucose feels fine.", "Seek urgent care for confusion, severe dehydration, vomiting, ketones, deep breathing, chest pain, stroke signs, or a rapidly worsening foot wound."],
      nclexTraps: ["Insulin use does not convert type 2 into type 1.", "Type 2 can occur in children and lean adults; neither age nor body size is diagnostic.", "DKA can occur in type 2, and SGLT2-associated DKA may have only modest glucose elevation.", "A1C can be misleading when red-cell lifespan, pregnancy, transfusion, dialysis, or hemoglobin variation changes its relationship to glucose."],
      relatedTopics: ["Diabetes mellitus classification", "Prediabetes", "Hyperosmolar hyperglycemic state", "Diabetic ketoacidosis", "Hypoglycemia", "Metabolic syndrome", "Diabetic foot ulcer", "Hemoglobin A1c"],
      aliases: ["type 2 diabetes", "diabetes type 2", "diabetes 2", "type two diabetes", "diabetes two", "diabetes type two", "T2 diabetes", "T2DM", "type 2 DM", "adult-onset diabetes", "non-insulin-dependent diabetes mellitus", "NIDDM", "DM2", "insulin resistant diabetes"],
      abbreviations: ["T2DM", "T2D", "DM2"],
      commonMisspellings: ["type two diabetis", "type 2 diabtes", "t2 diabeties", "insulin resistent diabetes"],
      tags: ["insulin resistance", "relative insulin deficiency", "beta-cell dysfunction", "HHS", "cardiorenal risk", "foot care"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ada-pharmacology-2026", "w41-who-diabetes", "w41-ada-crises-2024"]
    }),

    completeCard({
      name: "Pancreatic diabetes",
      category: "Endocrinology and Gastroenterology - Other Specific Diabetes",
      definition: "Pancreatic diabetes is diabetes caused by structural or functional disease of the exocrine pancreas. It is also called pancreatogenic diabetes or type 3c diabetes. Causes include acute or chronic pancreatitis, pancreatic resection or trauma, pancreatic cancer, cystic fibrosis, hemochromatosis, fibrocalculous pancreatopathy, and rare pancreatic disorders. It is commonly mislabeled type 2, even though loss of insulin, glucagon, digestive enzymes, and nutrient absorption creates a different safety problem.",
      pathology: "Inflammation, fibrosis, resection, infiltration, or destruction damages islets embedded within exocrine pancreatic tissue. Beta-cell loss reduces insulin, while alpha-cell and pancreatic-polypeptide dysfunction can weaken counterregulation. Exocrine insufficiency causes maldigestion, weight loss, and unpredictable carbohydrate absorption. The combined result can be both hyperglycemia and unusually dangerous hypoglycemia: insulin need may rise while glucagon rescue and nutrient delivery become less reliable.",
      pathophysiology: ["Pancreatic injury reduces endocrine cell mass, so insulin secretion no longer matches meals or hepatic glucose output.", "Loss of glucagon and other islet signals limits the normal response to falling glucose, which explains brittle swings after major pancreatic loss.", "Reduced enzymes and bicarbonate impair digestion and absorption; inconsistent nutrient entry makes an apparently correct insulin dose act before or after glucose appears.", "Pain, inflammation, alcohol or tobacco exposure, infection, cancer, surgery, and malnutrition add stress hormones and variable intake, further destabilizing control."],
      etiology: "The preferred umbrella includes diabetes after pancreatitis, pancreatectomy, trauma, neoplasia, cystic fibrosis, hemochromatosis, fibrocalculous pancreatic disease, and other exocrine disorders. Type 3c is a useful synonym but not a reason to assume all pancreatic causes behave identically. Some people also have ordinary type 2 risk or autoimmune disease, so mixed mechanisms remain possible.",
      riskFactors: ["Acute, recurrent, or chronic pancreatitis", "Partial or total pancreatectomy, pancreatic trauma, or pancreatic cancer", "Exocrine pancreatic insufficiency, steatorrhea, weight loss, or abnormal pancreatic imaging", "Cystic fibrosis, hemochromatosis, fibrocalculous pancreatopathy, or rare pancreatic genetic disease", "Smoking, alcohol exposure, malnutrition, calcification, or extensive pancreatic necrosis"],
      signsSymptoms: ["Polyuria, polydipsia, fatigue, blurred vision, weight loss, or recurrent infection", "Pancreatic pain, prior pancreatitis, surgical scars, steatorrhea, bulky oily stool, bloating, or fat-soluble vitamin deficiency", "Large glucose swings or hypoglycemia that is difficult to recognize or reverse", "New diabetes with unexplained weight loss, jaundice, or back pain can be a pancreatic-cancer warning rather than routine type 2 diabetes"],
      diagnostics: ["Confirm diabetes by standard criteria and establish the pancreatic timeline rather than assuming temporal association proves causation.", "Review pancreatitis episodes, surgery, trauma, cystic fibrosis, iron overload, cancer symptoms, nutrition, alcohol and tobacco exposure, and pancreatic imaging.", "Assess exocrine insufficiency with symptoms, nutritional markers, and fecal elastase or other specialist-directed testing; no single test alone proves type 3c.", "Use islet autoantibodies and C-peptide when type 1 or residual secretion is uncertain, and consider concurrent type 2 insulin resistance.", "Screen 3-6 months after acute pancreatitis and annually thereafter, and screen annually in chronic pancreatitis according to ADA guidance."],
      treatments: ["Use insulin early when secretion is substantially reduced, catabolism is present, or other therapy cannot safely control glucose; titrate cautiously because glucagon reserve and absorption may be impaired.", "Treat exocrine insufficiency with correctly timed pancreatic enzyme replacement and adequate energy, protein, and fat-soluble vitamins under pancreatic and nutrition guidance.", "Treat pain, pancreatitis cause, obstruction, cancer, alcohol or tobacco exposure, and other pancreatic disease rather than treating glucose in isolation.", "Coordinate medication choice with pancreatitis history, nutrition, kidney and liver function, and current guidance; ADA advises avoiding incretin-based therapies in pancreatitis-associated diabetes.", "Use CGM or structured monitoring when variability or hypoglycemia risk is high and provide glucagon while recognizing that response can be limited after major pancreatic loss."],
      contraindications: ["Do not label pancreatic diabetes as type 2 solely because it began in adulthood.", "Do not restrict calories or pursue weight loss automatically in a person with malabsorption or pancreatic cachexia.", "Do not give insulin without matching actual intake, enzyme use, and counterregulatory risk.", "Do not dismiss new diabetes plus weight loss, jaundice, or back pain as ordinary metabolic disease without pancreatic evaluation."],
      nursingPriorities: ["Assess pancreatic history, pain, stool characteristics, weight trend, diet, enzyme timing, alcohol and tobacco exposure, and cancer warning symptoms.", "Coordinate glucose checks with meals, enteral feeds, enzymes, insulin, procedures, and periods of poor intake.", "Monitor for hypoglycemia longer after treatment because reduced glucagon and inconsistent absorption can cause recurrence.", "Trend weight, hydration, albumin or other nutrition markers, fat-soluble vitamins as ordered, and signs of exocrine failure.", "Escalate unexplained weight loss, jaundice, persistent vomiting, severe pain, ketones, dehydration, or recurrent severe hypoglycemia."],
      redFlags: ["New painless jaundice, progressive weight loss, persistent back or epigastric pain, or a pancreatic mass concern", "Vomiting, ketones, deep breathing, dehydration, or altered consciousness", "Recurrent or prolonged severe hypoglycemia, especially after pancreatectomy", "Acute pancreatitis symptoms, gastrointestinal bleeding, sepsis, or inability to maintain nutrition"],
      complications: ["DKA or severe hyperglycemia from insulin deficiency", "Recurrent severe hypoglycemia from impaired glucagon counterregulation", "Malnutrition, fat-soluble vitamin deficiency, osteoporosis, and sarcopenia from exocrine failure", "Pancreatitis recurrence, pancreatic cancer, pain, infection, and standard microvascular complications"],
      prognosis: "Outcome depends on the pancreatic cause, remaining endocrine and exocrine reserve, nutrition, cancer risk, and access to coordinated care. Correct classification improves insulin safety and prevents malabsorption from being mistaken for adherence failure. Progression is common after chronic or extensive injury, so surveillance continues even when early glucose tests are normal.",
      prevention: "Not every pancreatic injury is preventable, but recurrence reduction, tobacco and alcohol support, treatment of gallstone or metabolic causes, nutrition, enzyme adherence, and scheduled glucose surveillance can reduce harm. After acute pancreatitis, a normal early result does not remove the need for later screening.",
      patientEducation: ["Type 3c means pancreatic diabetes; it is not Alzheimer's disease and it is not ordinary type 2 diabetes.", "Take pancreatic enzymes exactly with food as prescribed because digestion changes both nutrition and glucose timing.", "Carry hypoglycemia treatment and tell caregivers that lows may recur or respond unpredictably after major pancreatic loss.", "Report jaundice, progressive weight loss, persistent back or abdominal pain, vomiting, ketones, or severe lows promptly."],
      nclexTraps: ["Type 3c is an other-specific diabetes caused by pancreatic disease, not a severity stage of type 2.", "Exocrine insufficiency and diabetes can share one pancreatic cause but are not identical findings.", "Glucagon deficiency can make insulin-related hypoglycemia more dangerous.", "A1C or fasting glucose alone may miss early post-pancreatitis dysglycemia; surveillance and sometimes OGTT are needed."],
      relatedTopics: ["Post-pancreatitis diabetes mellitus", "Post-pancreatectomy diabetes mellitus", "Cystic fibrosis-related diabetes", "Fibrocalculous pancreatic diabetes", "Hemochromatosis-associated diabetes", "Chronic pancreatitis", "Pancreatic enzyme replacement therapy", "Type 3 diabetes terminology"],
      aliases: ["type 3c diabetes", "diabetes type 3c", "diabetes 3c", "type IIIc diabetes", "T3c", "pancreatogenic diabetes", "pancreaticogenic diabetes", "diabetes of the exocrine pancreas", "pancreatopathy-associated diabetes", "T3cDM", "secondary pancreatic diabetes"],
      abbreviations: ["T3cDM", "DEP"],
      commonMisspellings: ["pancreatogenic diabetis", "pancreatic diabtes", "type 3 c diabeties", "pancreatagenic diabetes"],
      tags: ["type 3c", "exocrine pancreatic disease", "insulin deficiency", "glucagon deficiency", "pancreatic enzymes", "malabsorption"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ada-pharmacology-2026", "w41-pancreasfest-2012"]
    }),

    completeCard({
      name: "Post-pancreatitis diabetes mellitus",
      category: "Endocrinology and Gastroenterology - Pancreatic Diabetes",
      definition: "Post-pancreatitis diabetes mellitus is pancreatic diabetes that develops after acute, recurrent, or chronic pancreatitis. The inflammation can permanently reduce islet mass and disturb exocrine digestion even after abdominal pain resolves. Because it may appear months or years later and can coexist with ordinary type 2 risk, the diagnosis requires a coherent timeline and ongoing surveillance rather than assuming every high glucose during an acute attack is permanent diabetes.",
      pathology: "Pancreatic inflammation, necrosis, fibrosis, duct obstruction, and local immune signaling can damage beta cells and other islet cells. Acute stress hormones also cause temporary hyperglycemia, so an inpatient high value may resolve. Persistent injury reduces insulin and sometimes glucagon, while exocrine insufficiency makes nutrient absorption variable. This combination explains delayed onset, glucose volatility, and hypoglycemia risk.",
      pathophysiology: ["Acute inflammatory stress raises glucose transiently through catecholamines, cortisol, cytokines, nutrition changes, and treatment.", "Necrosis or repeated inflammation removes functional endocrine tissue; fibrosis and duct disease continue the loss in chronic pancreatitis.", "Exocrine failure alters digestion and incretin signaling, so meal absorption and insulin response become mismatched.", "Residual insulin and glucagon reserve differ by injury extent, which is why some patients resemble type 2 while others need early insulin and have recurrent lows."],
      etiology: "Causes follow the underlying pancreatitis: gallstones, alcohol, hypertriglyceridemia, medications, autoimmunity, trauma, infection, genetic pancreatitis, duct disease, or idiopathic episodes. Severity, necrosis, recurrence, exocrine insufficiency, and pancreatic surgery increase risk, but mild pancreatitis can still be followed by diabetes.",
      riskFactors: ["Necrotizing, recurrent, or chronic pancreatitis", "Pancreatic surgery, drainage procedures, pseudocyst, or extensive structural damage", "Exocrine insufficiency, calcification, steatorrhea, or weight loss", "Preexisting prediabetes, family history, metabolic risk, tobacco, or alcohol exposure", "Pancreatic cancer or hereditary pancreatitis"],
      signsSymptoms: ["New polyuria, thirst, fatigue, blurred vision, infection, or unexplained weight loss after pancreatitis", "Ongoing epigastric pain radiating to the back, steatorrhea, bloating, or poor nutrition", "Hyperglycemia during enteral or parenteral nutrition, infection, or recurrent inflammation", "Unexpected severe lows after insulin because food absorption and glucagon reserve are impaired"],
      diagnostics: ["Distinguish transient stress hyperglycemia from persistent diabetes with follow-up after recovery.", "ADA recommends diabetes screening within 3-6 months after acute pancreatitis and annually thereafter; chronic pancreatitis warrants annual screening.", "Review fasting glucose, A1C limitations, and OGTT when indicated, plus symptoms and glucose trends.", "Assess exocrine function, nutrition, pancreatic imaging and cause; use antibodies and C-peptide if mixed or autoimmune disease is plausible.", "Investigate new diabetes with jaundice, progressive weight loss, or persistent pain for pancreatic malignancy."],
      treatments: ["Treat active pancreatitis and its cause while stabilizing glucose, hydration, electrolytes, and nutrition.", "Use insulin when deficiency, catabolism, acute illness, enteral feeding, or severe hyperglycemia requires it, with conservative titration and close low-glucose surveillance.", "Replace pancreatic enzymes and vitamins when indicated and avoid inappropriate caloric restriction.", "Coordinate pain, alcohol and tobacco support, gallstone or triglyceride management, and pancreatic specialist follow-up.", "Select noninsulin agents cautiously according to current pancreatic guidance and individual physiology."],
      contraindications: ["Do not diagnose permanent diabetes from one glucose during acute pancreatitis without follow-up unless criteria and clinical context are unequivocal.", "Do not assume resolution of pain means future diabetes risk is gone.", "Do not treat weight loss as a desirable metabolic goal when maldigestion or cancer may be present.", "Do not ignore recurrent hypoglycemia or continue the same insulin dose through poor intake without review."],
      nursingPriorities: ["Record pancreatitis date, cause, necrosis, procedures, nutrition route, exocrine symptoms, and weight trajectory.", "Arrange and reinforce 3-6 month and annual glucose surveillance.", "Match glucose and insulin checks to feed changes, meals, enzymes, procedures, and vomiting.", "Monitor hydration, electrolytes, stool, pain, weight, vitamins, and hypoglycemia recurrence.", "Escalate cancer clues, recurrent pancreatitis, DKA symptoms, severe malnutrition, or repeated severe lows."],
      redFlags: ["Jaundice, progressive weight loss, persistent back pain, or new mass concern", "Severe recurrent abdominal pain, fever, hypotension, or persistent vomiting", "Ketones, deep breathing, dehydration, or altered consciousness", "Recurrent severe hypoglycemia or inability to maintain nutrition"],
      complications: ["Persistent pancreatic diabetes, DKA, HHS, and severe hypoglycemia", "Recurrent or chronic pancreatitis, pseudocyst, obstruction, and infection", "Exocrine insufficiency, malnutrition, vitamin deficiency, and bone disease", "Pancreatic cancer and usual microvascular or cardiovascular diabetes complications"],
      prognosis: "Risk continues after the acute episode and rises with recurrent, necrotizing, chronic, or surgically treated disease. Early surveillance and combined endocrine-exocrine care improve recognition and nutrition. Prognosis is worse when cancer, ongoing inflammation, malnutrition, tobacco or alcohol exposure, or barriers to insulin and enzymes remain unaddressed.",
      prevention: "Prevent recurrence when possible by treating gallstones, triglycerides, alcohol exposure, tobacco use, medication causes, and hereditary risk. Preserve nutrition and attend follow-up screening even when the patient feels recovered.",
      patientEducation: ["Pancreatitis can damage both digestive and insulin-producing pancreas tissue, so diabetes may appear after the pain is gone.", "Keep the 3-6 month and yearly glucose checks recommended after pancreatitis.", "Report oily stool, weight loss, jaundice, persistent pain, vomiting, ketones, or severe lows.", "Use enzymes with meals and insulin with the actual nutrition plan exactly as prescribed."],
      nclexTraps: ["Stress hyperglycemia during pancreatitis is not automatically permanent diabetes, but it predicts a need for follow-up.", "Post-pancreatitis diabetes is within pancreatic/type 3c diabetes.", "Both insulin and glucagon secretion may be impaired.", "A normal discharge glucose does not replace later screening."],
      relatedTopics: ["Pancreatic diabetes", "Acute pancreatitis", "Chronic pancreatitis", "Pancreatic enzyme replacement therapy", "Post-pancreatectomy diabetes mellitus", "Pancreatic cancer"],
      aliases: ["PPDM", "post pancreatitis diabetes", "diabetes after pancreatitis", "new onset diabetes after pancreatitis", "NODAP", "pancreatitis-related diabetes", "postpancreatitis diabetes"],
      abbreviations: ["PPDM", "NODAP"],
      commonMisspellings: ["post pancreatits diabetes", "pancretitis diabetes", "postpancreatitis diabetis"],
      tags: ["acute pancreatitis", "chronic pancreatitis", "3-6 month screening", "exocrine insufficiency", "type 3c"],
      sourceKeys: ["w41-ada-classification-2026", "w41-pancreasfest-2012"]
    }),

    completeCard({
      name: "Post-pancreatectomy diabetes mellitus",
      category: "Endocrinology and Surgery - Pancreatic Diabetes",
      definition: "Post-pancreatectomy diabetes mellitus is pancreatic diabetes caused by surgical removal of part or all of the pancreas. Total pancreatectomy eliminates endogenous insulin and glucagon and usually causes complete exocrine insufficiency; partial resection leaves variable reserve. The resulting diabetes can be highly unstable because treatment must replace insulin while digestion and the main hormonal defense against hypoglycemia are also impaired.",
      pathology: "Resection physically removes beta cells, alpha cells, and exocrine acinar tissue. Less insulin permits hyperglycemia and ketosis, while less glucagon limits hepatic glucose release during a low. Fewer digestive enzymes cause malabsorption unless replaced. After total pancreatectomy, even small mismatches among insulin, food, enzymes, pain, nausea, and activity can cause large glucose swings.",
      pathophysiology: ["Endocrine cell loss is proportional to resection and prior pancreatic disease, but remaining tissue may function unpredictably.", "Absent or reduced glucagon weakens counterregulation, so hypoglycemia may be prolonged and awareness may be unreliable.", "Exocrine insufficiency delays or reduces nutrient absorption until pancreatic enzymes are correctly taken with food.", "Surgical stress, infection, drains, delayed gastric emptying, nutrition support, and changing oral intake add rapid insulin-demand changes."],
      etiology: "Pancreatectomy may be performed for pancreatic cancer, chronic pancreatitis, trauma, cystic neoplasm, neuroendocrine tumor, congenital disease, or other structural pathology. Total pancreatectomy creates a predictable insulin-deficient state; distal, central, or pancreaticoduodenal resections have variable risk. Islet autotransplantation can preserve some secretion in selected chronic-pancreatitis cases but does not guarantee insulin independence.",
      riskFactors: ["Total or extensive partial pancreatectomy", "Low preoperative beta-cell reserve, chronic pancreatitis, or preexisting diabetes", "Postoperative infection, delayed gastric emptying, fistula, or changing enteral/parenteral nutrition", "Exocrine pancreatic insufficiency and poor enzyme access or adherence", "Renal or hepatic dysfunction that changes insulin clearance and glycogen reserve"],
      signsSymptoms: ["Immediate or delayed hyperglycemia after resection", "Weight loss, steatorrhea, bloating, diarrhea, and fat-soluble vitamin deficiency without adequate enzymes", "Rapid glucose swings and recurrent severe hypoglycemia", "Ketones, dehydration, or DKA when insulin delivery is interrupted, especially after total resection"],
      diagnostics: ["Document the exact operation, percent and region resected, islet autotransplant status, preoperative diabetes, and remaining pancreatic disease.", "Trend glucose closely through changing postoperative nutrition and infection.", "Assess exocrine insufficiency, weight, stool, fat-soluble vitamins, bone health, and enzyme effectiveness.", "Evaluate ketones and acid-base status promptly when insulin is interrupted or vomiting develops.", "Use CGM and structured pattern review when available because single checks can miss rapid excursions."],
      treatments: ["Provide continuous basal insulin after total pancreatectomy with prandial and correction dosing matched to actual nutrition; use pump or automated delivery when appropriate.", "Administer pancreatic enzyme replacement with every meal, snack, and enteral-feed plan as prescribed and titrate with nutrition and pancreatic teams.", "Treat lows promptly and observe for recurrence; prescribed glucagon may be less effective when hepatic reserve or glucagon pathways are impaired, so prevention is central.", "Coordinate dietitian, endocrine, surgery, pain, and gastroenterology care and monitor vitamin and bone needs.", "Use IV insulin with frequent electrolyte and glucose checks during unstable postoperative or critical illness states according to protocol."],
      contraindications: ["Do not omit basal insulin after total pancreatectomy.", "Do not assume standard type 1 doses are appropriate; loss of glucagon and malabsorption often lower and destabilize requirements.", "Do not give enzymes long before or after food without following the prescribed timing.", "Do not discharge without a backup insulin, hypoglycemia, enzyme, and nutrition plan."],
      nursingPriorities: ["Verify operation type, basal-insulin continuity, enzyme timing, nutrition route, drains, nausea, pain, and renal and liver function.", "Check glucose frequently during every feed or diet transition and inspect infusion or pump function.", "Treat hypoglycemia and continue observation because recurrence can be prolonged.", "Track stool, weight, hydration, electrolytes, vitamins, wound, infection, and intake.", "Ensure the patient and caregivers can demonstrate insulin, CGM, glucagon or emergency response, enzyme use, and sick-day ketone care before discharge."],
      redFlags: ["Any basal-insulin interruption after total pancreatectomy", "Severe or recurrent hypoglycemia, seizure, unconsciousness, or failed oral rescue", "Ketones, vomiting, deep breathing, dehydration, or altered consciousness", "Postoperative fever, hypotension, increasing abdominal pain, drain change, or inability to absorb nutrition"],
      complications: ["DKA after insulin interruption and severe hypoglycemia from impaired counterregulation", "Malnutrition, vitamin deficiency, diarrhea, and osteoporosis from exocrine failure", "Postoperative leak, infection, delayed gastric emptying, or nutritional interruption", "Long-term retinal, renal, neural, and cardiovascular diabetes complications"],
      prognosis: "Glucose control is possible but requires unusually tight coordination among insulin, enzymes, nutrition, and monitoring. Total pancreatectomy creates lifelong endocrine and exocrine replacement needs. Outcomes improve with experienced multidisciplinary care, CGM or pump technology when useful, reliable supplies, and rapid response to lows, illness, and nutrition changes.",
      prevention: "The diabetes is not preventable once sufficient tissue is removed, but preoperative education, islet-preservation strategies when appropriate, uninterrupted postoperative insulin, enzyme replacement, and structured transition planning prevent many crises.",
      patientEducation: ["After total pancreatectomy, both insulin and digestive enzymes are lifelong replacements.", "Never stop basal insulin; use the written fasting, vomiting, and pump-failure plan.", "Take enzymes with all nutrition as directed and report oily stool or weight loss.", "Treat lows early, keep emergency support available, and seek help when a low recurs or cannot be safely swallowed."],
      nclexTraps: ["Post-pancreatectomy diabetes is not automatically managed like ordinary type 2.", "Total pancreatectomy removes glucagon as well as insulin.", "Enzyme timing changes glucose absorption and insulin safety.", "Glucagon rescue may be less predictable, so preventing and monitoring recurrent lows is essential."],
      relatedTopics: ["Pancreatic diabetes", "Pancreatectomy", "Pancreatic enzyme replacement therapy", "Hypoglycemia", "Insulin", "Continuous glucose monitoring"],
      aliases: ["surgical diabetes", "diabetes after pancreatectomy", "post pancreatectomy diabetes", "pancreatectomy-induced diabetes", "apancreatic diabetes", "diabetes after Whipple", "diabetes after pancreatic surgery"],
      abbreviations: ["PPxDM"],
      commonMisspellings: ["post pancreatecomy diabetes", "pancreatectomy diabetis", "diabetes after whippel"],
      tags: ["total pancreatectomy", "partial pancreatectomy", "glucagon deficiency", "pancreatic enzymes", "brittle glucose"],
      sourceKeys: ["w41-ada-classification-2026", "w41-pancreasfest-2012"]
    }),

    completeCard({
      name: "Cystic fibrosis-related diabetes",
      category: "Endocrinology and Pulmonology - Pancreatic Diabetes",
      definition: "Cystic fibrosis-related diabetes (CFRD) is a distinct form of pancreatic diabetes in people with cystic fibrosis. Progressive pancreatic and islet injury primarily reduces insulin secretion, while pulmonary exacerbations, infection, tube feeds, and glucocorticoids add temporary insulin resistance. CFRD is not simply type 1 plus type 2, and a normal-looking A1C does not reliably exclude it.",
      pathology: "Thick secretions, duct obstruction, inflammation, fibrosis, and altered islet function reduce early meal-related insulin release. Hyperglycemia can worsen protein catabolism, weight, lung function, and infection recovery even before classic symptoms. Because red-cell and disease factors can make A1C less sensitive and fasting glucose may remain normal, post-meal or OGTT abnormalities often appear first.",
      pathophysiology: ["Loss of first-phase insulin causes early post-meal hyperglycemia while fasting glucose can remain normal.", "CF pulmonary infection and systemic glucocorticoids increase counterregulatory hormones and insulin resistance, exposing limited beta-cell reserve.", "Continuous or overnight enteral feeds deliver carbohydrate for hours and can create a glucose pattern missed by daytime fasting checks.", "Insulin deficiency promotes catabolism, so untreated CFRD can worsen weight and pulmonary outcomes; restrictive type 2 diet advice can therefore be harmful."],
      etiology: "CFRD develops from CF-related pancreatic and islet dysfunction, modified by age, genotype, exocrine insufficiency, illness, transplantation, feeds, and glucocorticoid exposure. It is classified separately because its screening, nutrition, and pulmonary implications differ from classic type 1 and type 2 diabetes.",
      riskFactors: ["Cystic fibrosis with increasing age", "Pancreatic exocrine insufficiency and severe CFTR dysfunction", "Pulmonary exacerbation, infection, systemic glucocorticoids, or transplantation", "Overnight or continuous enteral feeding", "Prior impaired glucose tolerance or intermittent hyperglycemia"],
      signsSymptoms: ["Often asymptomatic and detected by scheduled screening", "Unexplained weight loss, inability to gain expected weight, fatigue, thirst, or polyuria", "Declining lung function or poor recovery from pulmonary exacerbation", "Hyperglycemia during steroids, infection, pregnancy, transplantation, or enteral feeding"],
      diagnostics: ["Begin annual OGTT screening by age 10 according to CF guidance and continue even when fasting glucose or A1C appears reassuring.", "Use standard CFRD diagnostic criteria and confirm outside unequivocal symptomatic hyperglycemia; interpret results with illness, feeds, and steroid timing.", "ADA 2026 permits an A1C-based two-step alternative when OGTT is infeasible, but an ordinary normal A1C alone must not be used to rule CFRD out.", "Monitor fasting and post-meal glucose during pulmonary exacerbations, systemic glucocorticoids, pregnancy, and enteral feeding.", "Assess weight, growth, nutrition, pulmonary function, infection, exocrine therapy, and transplant status together with glucose."],
      treatments: ["Use insulin as the established treatment for CFRD and match dosing to meals, snacks, illness, steroids, and enteral-feed timing.", "Preserve the high-energy, high-protein CF nutrition plan and pancreatic enzyme replacement; do not import routine caloric restriction from type 2 care.", "Use CGM or structured monitoring when helpful, especially around overnight feeds, exacerbations, and steroid courses.", "Coordinate endocrine, CF pulmonary, dietitian, pharmacy, and transplant teams and reassess doses rapidly as infection or steroids change.", "Treat hypoglycemia with measured carbohydrate or glucagon as prescribed and evaluate repeated lows for feed interruption or dose mismatch."],
      contraindications: ["Do not rule out CFRD with a normal A1C alone.", "Do not prescribe generic weight-loss dieting that compromises CF nutrition.", "Do not give feed-linked insulin without a clear plan for interrupted or delayed tube feeding.", "Do not independently stop glucocorticoids or transplant immunosuppression to lower glucose."],
      nursingPriorities: ["Track glucose with meals, overnight feeds, pulmonary status, steroids, infection, weight, and pancreatic enzymes.", "Verify a feed-interruption rescue plan before administering long-acting or feed-coverage insulin.", "Assess growth or weight trend, stool, appetite, lung function, respiratory effort, and infection markers.", "Teach insulin and hypoglycemia care without undermining the prescribed CF calorie and salt plan.", "Escalate DKA symptoms, severe lows, respiratory deterioration, persistent feed intolerance, or unexplained weight loss."],
      redFlags: ["Feed interruption after insulin without immediate glucose and dose management", "Severe hypoglycemia, seizure, unconsciousness, or repeated overnight lows", "Vomiting, ketones, deep breathing, dehydration, or altered consciousness", "Pulmonary exacerbation with rising glucose, weight loss, or inability to maintain nutrition"],
      complications: ["Loss of weight or lean mass and worsening pulmonary outcomes", "Hypoglycemia related to insulin, variable intake, or interrupted feeds", "DKA is less common than in classic type 1 but remains possible with severe insulin deficiency", "Microvascular complications with duration and cumulative hyperglycemia"],
      prognosis: "Early detection and insulin treatment can improve weight and metabolic health and support pulmonary care. Prognosis depends heavily on underlying CF lung disease, nutrition, infection burden, transplantation, and reliable coordination of insulin with feeds and steroids.",
      prevention: "CFRD itself may not be preventable, but annual screening from age 10 and targeted monitoring during high-risk periods detect it before catabolism and lung decline become obvious. Reliable nutrition, enzymes, and prompt infection care reduce destabilizing stress.",
      patientEducation: ["CFRD is caused mainly by reduced insulin secretion from CF-related pancreatic disease; it is not your fault.", "Keep the CF nutrition plan unless the CF dietitian changes it; insulin is matched to nutrition rather than nutrition being withheld to avoid insulin.", "Know what to do if a tube feed stops after insulin.", "Continue annual OGTT screening even when A1C seems normal and report weight or lung-function decline."],
      nclexTraps: ["A normal A1C does not reliably exclude CFRD.", "CFRD treatment preserves nutrition; generic diabetic calorie restriction is unsafe.", "Insulin is standard treatment, but CFRD is not automatically type 1 diabetes.", "Illness, steroids, and tube feeds can expose hyperglycemia that fasting testing misses."],
      relatedTopics: ["Pancreatic diabetes", "Cystic fibrosis", "Pancreatic enzyme replacement therapy", "Oral glucose tolerance test", "Insulin", "Enteral nutrition"],
      aliases: ["CFRD", "CF-related diabetes", "cystic fibrosis diabetes", "diabetes in cystic fibrosis", "CF diabetes"],
      abbreviations: ["CFRD", "CF"],
      commonMisspellings: ["cystic fibrosus diabetes", "cystic fibrosis diabetis", "CFR diabeties"],
      tags: ["cystic fibrosis", "OGTT age 10", "insulin insufficiency", "enteral feeds", "pulmonary exacerbation", "nutrition"],
      sourceKeys: ["w41-ada-classification-2026", "w41-cff-cfrd"]
    }),

    completeCard({
      name: "Fibrocalculous pancreatic diabetes",
      category: "Endocrinology and Gastroenterology - Pancreatic Diabetes",
      definition: "Fibrocalculous pancreatic diabetes (FCPD) is diabetes caused by fibrocalculous pancreatopathy, a form of chronic calcific pancreatic disease characterized by fibrosis, large ductal stones or calculi, exocrine dysfunction, and progressive endocrine failure. It has been described especially in lean people from tropical and resource-limited settings, but geography or low body weight alone does not diagnose it. It belongs under pancreatic/type 3c diabetes, not under type 5 solely because malnutrition may coexist.",
      pathology: "Repeated pancreatic injury and ductal obstruction produce fibrosis and intraductal calculi. Exocrine tissue fails, causing steatorrhea and malnutrition, while islet loss reduces insulin and sometimes counterregulatory hormones. Chronic inflammation and structural disease also increase pancreatic-cancer concern. Historical theories blamed cassava or protein deficiency alone, but current evidence supports a more complex interaction of genetic susceptibility and environmental factors.",
      pathophysiology: ["Duct stones and fibrosis obstruct pancreatic flow and sustain chronic inflammation and pain.", "Acinar destruction reduces digestive enzymes, producing maldigestion and fat-soluble vitamin deficiency.", "Islet injury reduces insulin secretion and creates diabetes, often severe enough to require insulin.", "Persistent calcific disease and inflammation may increase pancreatic adenocarcinoma risk, so changing pain, jaundice, or weight loss requires evaluation."],
      etiology: "The cause is incompletely understood. Genetic susceptibility, recurrent tropical calcific pancreatitis, environmental exposures, nutrition, and oxidative stress have been proposed. Malnutrition can worsen the phenotype but should not be presented as a proven single cause. Common pancreatitis causes must still be evaluated rather than assumed absent.",
      riskFactors: ["Chronic calcific pancreatitis with large duct stones", "Young or middle-age onset with abdominal pain, steatorrhea, and diabetes", "Residence or ancestry in regions where tropical calcific pancreatitis has been reported", "Genetic susceptibility or family history of pancreatitis", "Undernutrition, tobacco, or other pancreatic stressors"],
      signsSymptoms: ["Recurrent abdominal pain beginning years before diabetes", "Steatorrhea, weight loss, poor muscle mass, or vitamin deficiency", "Polyuria, thirst, fatigue, and severe hyperglycemia", "Pancreatic calcifications or large ductal stones on imaging; ketosis may be less common but is not impossible"],
      diagnostics: ["Demonstrate diabetes and structural fibrocalculous pancreatic disease rather than diagnosing from geography or BMI.", "Use pancreatic imaging to identify ductal stones, calcification, atrophy, or fibrosis and evaluate obstruction or cancer.", "Assess exocrine insufficiency, nutrition, fat-soluble vitamins, and bone health.", "Exclude autoimmune type 1 and assess residual secretion when classification remains uncertain.", "Investigate changing pain, jaundice, new weight loss, or worsening diabetes for pancreatic malignancy."],
      treatments: ["Use insulin when needed, titrating to nutrition and hypoglycemia risk.", "Replace pancreatic enzymes with food and correct energy, protein, and vitamin deficiencies.", "Treat pain and ductal obstruction through a pancreatic specialty team; endoscopic or surgical care may be needed.", "Address tobacco and alcohol exposure and screen complications of chronic pancreatitis.", "Maintain cancer vigilance without claiming that every pain change is malignancy."],
      contraindications: ["Do not equate FCPD with type 5 diabetes; one is calcific exocrine pancreatic disease and the other is an evolving malnutrition-related classification.", "Do not diagnose from a lean phenotype or tropical residence alone.", "Do not impose caloric restriction in an undernourished patient.", "Do not ignore pancreatic-cancer red flags."],
      nursingPriorities: ["Assess pain history, stool, weight, food access, enzyme timing, glucose, and insulin safety.", "Monitor for malnutrition, vitamins, bone risk, dehydration, and hypoglycemia.", "Coordinate imaging, endocrine, gastroenterology, nutrition, and pain follow-up.", "Teach enzymes with food and insulin with actual absorbed nutrition.", "Escalate jaundice, changing pain, progressive weight loss, severe hyperglycemia, ketones, or recurrent lows."],
      redFlags: ["New jaundice, progressive weight loss, or a change in chronic pancreatic pain", "Severe abdominal pain, fever, obstruction, or vomiting", "Ketones, dehydration, deep breathing, or altered consciousness", "Severe malnutrition or recurrent hypoglycemia"],
      complications: ["Pancreatic diabetes and severe glucose variability", "Exocrine insufficiency, malnutrition, vitamin deficiency, and osteoporosis", "Chronic pain, duct obstruction, pseudocyst, and infection", "Elevated pancreatic-cancer concern and standard diabetes complications"],
      prognosis: "Course depends on structural disease, nutrition, endocrine reserve, cancer risk, and access to enzymes, insulin, imaging, and specialty care. Modern management can improve survival and nutrition, but long-term follow-up remains essential.",
      prevention: "No single proven prevention exists. Earlier recognition of chronic pancreatitis, nutrition support, tobacco and alcohol reduction, treatment of obstruction, and continued cancer and glucose surveillance can reduce harm.",
      patientEducation: ["FCPD means diabetes from a calcified, fibrotic pancreas; it is a type of pancreatic diabetes.", "Enzymes and nutrition are as important as glucose treatment.", "Low body weight is a sign to assess nutrition, not a reason to avoid insulin when it is needed.", "Report jaundice, changing pain, progressive weight loss, vomiting, ketones, or severe lows."],
      nclexTraps: ["FCPD is not diagnosed by tropical location or malnutrition alone.", "Ketosis resistance is a tendency described in cohorts, not a guarantee against DKA.", "Pancreatic exocrine and endocrine failure must both be treated.", "Pancreatic-cancer vigilance is part of long-term care."],
      relatedTopics: ["Pancreatic diabetes", "Chronic pancreatitis", "Type 5 diabetes mellitus", "Pancreatic enzyme replacement therapy", "Pancreatic cancer"],
      aliases: ["FCPD", "fibrocalculous pancreatopathy diabetes", "tropical calcific pancreatic diabetes", "tropical pancreatic diabetes", "diabetes with pancreatic stones", "calcific pancreatic diabetes"],
      abbreviations: ["FCPD", "TCP"],
      commonMisspellings: ["fibrocalculus pancreatic diabetes", "fibrocalculous diabetis", "tropical pancretic diabetes"],
      tags: ["pancreatic calculi", "tropical calcific pancreatitis", "exocrine insufficiency", "type 3c", "pancreatic cancer"],
      sourceKeys: ["w41-ada-classification-2026", "w41-endotext-fcpd-2024"]
    }),

    completeCard({
      name: "Hemochromatosis-associated diabetes",
      category: "Endocrinology and Hepatology - Pancreatic Diabetes",
      definition: "Hemochromatosis-associated diabetes is diabetes that develops when systemic iron overload injures pancreatic beta cells and often adds hepatic insulin resistance. It is an other-specific, frequently pancreatic form of diabetes, not automatically type 2. Correct recognition matters because iron overload also threatens the liver, heart, joints, pituitary, and gonads and requires cause-directed treatment beyond glucose control.",
      pathology: "Excess iron generates oxidative injury and deposits in the pancreas and liver. Beta-cell damage lowers insulin secretion, while hepatic fibrosis or cirrhosis impairs insulin handling and increases resistance. Genetic HFE-related hemochromatosis and secondary transfusional iron overload have different causes but can converge on this physiology. Treating iron burden may improve metabolic function earlier in disease but cannot reliably reverse established beta-cell loss or cirrhosis.",
      pathophysiology: ["Iron accumulates when intestinal absorption is inappropriately high or repeated transfusions exceed removal capacity.", "Reactive iron injures beta cells, reducing insulin secretion.", "Liver iron, inflammation, and fibrosis alter glucose production and insulin clearance, adding resistance and hypoglycemia complexity in advanced disease.", "Cardiomyopathy and endocrine organ injury widen the safety problem beyond glucose."],
      etiology: "Causes include hereditary hemochromatosis, non-HFE iron-loading disorders, repeated transfusions, ineffective erythropoiesis, and other secondary iron overload. Ferritin alone is nonspecific because inflammation, liver disease, infection, and metabolic disease can raise it; diagnosis integrates transferrin saturation, genetics or imaging, organ findings, and specialist assessment.",
      riskFactors: ["Confirmed hereditary hemochromatosis or pathogenic iron-regulation variant", "Repeated transfusion or chronic ineffective erythropoiesis", "High transferrin saturation and documented hepatic or systemic iron overload", "Liver fibrosis or cirrhosis, pancreatic injury, or family history", "Cardiac, pituitary, gonadal, joint, or skin manifestations of iron overload"],
      signsSymptoms: ["Diabetes symptoms may accompany fatigue, bronze or gray skin pigmentation, arthropathy, hepatomegaly, or sexual and gonadal dysfunction", "Liver enzyme abnormality, fibrosis, cirrhosis, or hepatocellular-cancer risk", "Cardiomyopathy, arrhythmia, or heart failure", "Insulin deficiency, resistance, or both; advanced liver disease can also produce unpredictable hypoglycemia"],
      diagnostics: ["Confirm diabetes using standard criteria and evaluate iron overload with fasting or appropriately interpreted transferrin saturation, ferritin, and cause-specific testing.", "Do not diagnose hemochromatosis from ferritin alone; assess inflammation, alcohol, fatty liver, infection, malignancy, and transfusion history.", "Use HFE or broader genetic testing when indicated and MRI or other organ assessment under specialist guidance.", "Assess liver fibrosis, cardiac function, pituitary and gonadal effects, joints, and family implications.", "Evaluate residual insulin secretion and other diabetes types when the mechanism is mixed."],
      treatments: ["Treat iron overload with therapeutic phlebotomy when appropriate for hereditary disease or chelation for selected transfusional states under specialist supervision.", "Treat diabetes according to insulin reserve, liver and heart function, nutrition, hypoglycemia risk, and comorbidities.", "Use insulin when secretion is substantially impaired or hyperglycemia is severe.", "Manage cirrhosis and hepatocellular-cancer surveillance, cardiomyopathy, and endocrine complications.", "Offer family testing and counseling when hereditary disease is confirmed."],
      contraindications: ["Do not use ferritin alone as proof of iron-overload diabetes.", "Do not phlebotomize a patient with incompatible anemia or hemodynamic instability without specialist direction.", "Do not assume glucose will normalize after iron removal once beta-cell injury is established.", "Do not select glucose-lowering medicine without considering liver, heart, and hematologic status."],
      nursingPriorities: ["Trend glucose, transferrin saturation, ferritin in context, blood count, liver and cardiac status, and symptoms during iron-removal therapy.", "Assess dizziness, hypotension, anemia symptoms, access, and hydration with phlebotomy.", "Monitor hypoglycemia when insulin needs change during treatment or liver disease progresses.", "Reinforce liver cancer, cardiac, endocrine, and family follow-up.", "Escalate chest pain, arrhythmia, syncope, liver decompensation, severe hyperglycemia, or recurrent lows."],
      redFlags: ["Arrhythmia, syncope, chest pain, or heart-failure deterioration", "Jaundice, ascites, encephalopathy, gastrointestinal bleeding, or liver mass concern", "Severe symptomatic hyperglycemia, ketones, or dehydration", "Hypotension or symptomatic anemia during iron-removal treatment"],
      complications: ["Insulin-deficient or mixed diabetes and its vascular complications", "Cirrhosis and hepatocellular carcinoma", "Cardiomyopathy and arrhythmia", "Hypogonadism, pituitary dysfunction, arthropathy, and treatment-related anemia"],
      prognosis: "Earlier iron removal can prevent or limit organ injury, but established diabetes, cirrhosis, arthropathy, or endocrine damage may persist. Prognosis is driven by liver fibrosis, cardiac involvement, cancer surveillance, glycemic safety, and adherence to lifelong iron monitoring.",
      prevention: "Family detection and early treatment of hereditary iron overload and careful monitoring of transfusional iron can prevent organ injury. Avoid unprescribed iron or high-dose vitamin C in established overload unless the treating team approves it.",
      patientEducation: ["This diabetes can reflect iron injury to the pancreas and liver, so both glucose and iron burden need treatment.", "A high ferritin does not by itself prove hemochromatosis.", "Keep liver, heart, hormone, joint, and family-screening appointments.", "Report fainting after phlebotomy, palpitations, swelling, jaundice, confusion, severe hyperglycemia, or repeated lows."],
      nclexTraps: ["Hemochromatosis diabetes is not automatically ordinary type 2.", "Ferritin is an acute-phase reactant and must be interpreted with transferrin saturation and clinical context.", "Iron removal prevents progression better than it reverses established beta-cell loss.", "Advanced liver disease can increase both hyperglycemia and hypoglycemia risk."],
      relatedTopics: ["Pancreatic diabetes", "Hemochromatosis", "Cirrhosis", "Therapeutic phlebotomy", "Transferrin saturation", "Ferritin"],
      aliases: ["hemochromatosis diabetes", "haemochromatosis-associated diabetes", "iron overload diabetes", "bronze diabetes", "diabetes from iron overload", "secondary diabetes in hemochromatosis"],
      abbreviations: ["HH-DM"],
      commonMisspellings: ["hemochromotosis diabetes", "haemachromatosis diabetis", "iron overlaod diabetes"],
      tags: ["iron overload", "bronze diabetes", "beta-cell iron", "cirrhosis", "phlebotomy", "transferrin saturation"],
      sourceKeys: ["w41-ada-classification-2026", "w41-easl-hemochromatosis-2022"]
    }),

    completeCard({
      name: "Gestational diabetes mellitus",
      mergeNames: ["Gestational diabetes"],
      category: "Obstetrics and Endocrinology - Diabetes in Pregnancy",
      definition: "Gestational diabetes mellitus (GDM) is diabetes diagnosed in the second or third trimester of pregnancy that was not clearly overt diabetes before gestation. Placental hormones progressively increase insulin resistance; GDM develops when maternal beta cells cannot increase insulin output enough to compensate. Diabetes found early in pregnancy at ordinary diagnostic thresholds is more likely preexisting diabetes complicating pregnancy and must not be mislabeled GDM.",
      pathology: "Human placental lactogen, placental growth hormone, progesterone, cortisol, prolactin, inflammatory signals, and rising maternal fuel availability reduce insulin sensitivity as pregnancy advances. This physiologic resistance directs nutrients toward the fetus. If beta-cell reserve is limited, maternal glucose rises and crosses the placenta. Fetal insulin then rises, promoting growth and fat deposition; after birth the glucose supply stops abruptly while fetal insulin remains high, explaining neonatal hypoglycemia.",
      pathophysiology: ["Placental hormone production increases with gestation, so insulin resistance usually peaks in later pregnancy.", "Maternal beta-cell compensation determines whether glucose remains normal or GDM appears.", "Glucose crosses the placenta but maternal insulin does not; fetal hyperinsulinemia drives macrosomia and can delay lung and metabolic adaptation.", "Placental delivery rapidly lowers insulin resistance, but GDM reveals future susceptibility to type 2 diabetes and can recur in later pregnancies."],
      etiology: "GDM reflects pregnancy-induced insulin resistance superimposed on limited beta-cell reserve. Risk rises with prior GDM, family history, prediabetes, polycystic ovary syndrome, age, prior large-for-gestational-age infant, and some ancestral backgrounds, but absence of risk factors does not exclude it. Hyperglycemia before 15 weeks needs evaluation for preexisting diabetes or high-risk abnormal metabolism.",
      riskFactors: ["Prior gestational diabetes or delivery of a large-for-gestational-age infant", "Prediabetes, family history of type 2 diabetes, polycystic ovary syndrome, or metabolic risk", "Older maternal age or higher pre-pregnancy weight, while recognizing GDM can occur without either", "High-risk abnormal glucose early in pregnancy", "Glucocorticoid exposure, multifetal pregnancy, or other stress that raises insulin demand"],
      signsSymptoms: ["Usually asymptomatic, which is why routine 24-28 week screening matters", "Mild thirst or polyuria can be mistaken for ordinary pregnancy symptoms", "Ultrasound evidence of excessive fetal growth or polyhydramnios may raise concern but does not diagnose GDM", "Vomiting, abdominal pain, tachypnea, ketones, dehydration, or altered consciousness can indicate pregnancy DKA, sometimes without extreme glucose elevation"],
      diagnostics: ["Test for undiagnosed preexisting diabetes early in pregnancy when indicated and screen for GDM at 24-28 weeks if diabetes has not already been found.", "Use either a one-step 75-g OGTT or the locally selected two-step 50-g screen followed by a 100-g OGTT. Keep the strategy and its thresholds together; do not mix criteria.", "ADA recommends a 75-g OGTT at 4-12 weeks postpartum because A1C can be distorted by pregnancy-related red-cell turnover and delivery blood loss.", "Continue lifelong diabetes screening every 1-3 years after GDM.", "Assess maternal glucose pattern, blood pressure and preeclampsia symptoms, fetal growth and movement, nutrition, ketones when ill, and medication safety."],
      treatments: ["Use an individualized pregnancy nutrition plan that supports fetal growth, distributes carbohydrate predictably, and avoids starvation ketosis; pair it with safe activity when obstetrically appropriate.", "Monitor fasting and post-meal glucose according to the pregnancy plan and use medication, commonly insulin, when targets are not met.", "Coordinate fetal surveillance, growth assessment, delivery planning, intrapartum glucose, and newborn feeding and glucose monitoring.", "Treat vomiting, dehydration, ketones, and suspected DKA urgently with obstetric, endocrine, and critical-care coordination.", "After delivery, reassess medication need, support lactation, arrange postpartum OGTT, and provide long-term type 2 prevention support."],
      contraindications: ["Do not call overt diabetes found early in pregnancy GDM without classification review.", "Do not mix one-step and two-step OGTT thresholds.", "Do not prescribe weight loss or severe carbohydrate restriction during pregnancy; starvation ketosis can harm parent and fetus.", "Do not reassure from a normal A1C when pregnancy physiology or glucose patterns suggest otherwise."],
      nursingPriorities: ["Review fasting and post-meal logs, meter or CGM technique, meal timing, activity, medication, and hypoglycemia response.", "Assess blood pressure, headache, vision, upper abdominal pain, edema, fetal movement, contractions, and hydration.", "Teach insulin preparation and timing, ketone sick-day rules, and measured low-glucose treatment.", "Coordinate fetal growth, labor glucose, newborn glucose and feeding, and postpartum dose reduction.", "Secure the 4-12 week postpartum OGTT and lifelong 1-3 year screening plan before discharge."],
      redFlags: ["Moderate or large ketones, vomiting, abdominal pain, rapid breathing, or dehydration", "Reduced fetal movement, abnormal fetal testing, bleeding, or preterm-labor concern", "Severe headache, visual change, upper abdominal pain, dyspnea, or severe-range blood pressure", "Severe or recurrent hypoglycemia, seizure, or inability to swallow"],
      complications: ["Preeclampsia, operative delivery, and future type 2 diabetes", "Fetal overgrowth, shoulder dystocia, birth injury, and stillbirth risk when control is poor", "Neonatal hypoglycemia, respiratory or metabolic complications, and NICU admission", "Pregnancy DKA, severe hypoglycemia, and psychosocial burden"],
      prognosis: "Glucose often improves rapidly after placental delivery, but GDM is a long-term metabolic risk marker. Postpartum testing identifies persistent diabetes or prediabetes, and continued screening can detect type 2 diabetes early. Future pregnancy planning and preconception testing reduce recurrence-related harm.",
      prevention: "GDM cannot always be prevented. Preconception metabolic care, feasible nutrition and activity, and early identification of high-risk glucose can reduce risk or severity. Once pregnant, the goal is healthy gain and glucose control, not weight loss.",
      patientEducation: ["Placental hormones cause insulin resistance; needing insulin is not a personal failure.", "Follow the exact fasting and after-meal targets provided by the pregnancy team and do not substitute a different clinic's OGTT thresholds.", "Report ketones, vomiting, reduced fetal movement, severe headache, vision change, or repeated lows immediately.", "Complete a 75-g OGTT 4-12 weeks after delivery and continue diabetes screening every 1-3 years."],
      nclexTraps: ["GDM is not every diabetes first noticed during pregnancy; overt early disease is classified as diabetes complicating pregnancy.", "Maternal glucose crosses the placenta; maternal insulin does not.", "Neonatal hypoglycemia follows persistent fetal insulin after maternal glucose delivery stops.", "Gestational diabetes insipidus is an unrelated water-balance disorder."],
      relatedTopics: ["Diabetes mellitus classification", "Type 2 diabetes mellitus", "Oral glucose tolerance test", "Pregnancy diabetic ketoacidosis", "Neonatal hypoglycemia", "Gestational diabetes insipidus", "Preeclampsia"],
      aliases: ["gestational diabetes", "GDM", "diabetes during pregnancy", "pregnancy diabetes", "maternal diabetes", "gestational DM", "sugar in pregnancy"],
      abbreviations: ["GDM"],
      commonMisspellings: ["gestational diabetis", "gestation diabetes", "gestational diabtes", "pregnency diabetes"],
      tags: ["placental insulin resistance", "24-28 weeks", "OGTT", "postpartum 4-12 weeks", "macrosomia", "neonatal hypoglycemia"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ada-pregnancy-2026"]
    }),

    completeCard({
      name: "Ketosis-prone diabetes",
      category: "Endocrinology - Atypical Diabetes Phenotype",
      definition: "Ketosis-prone diabetes (KPD) is a heterogeneous diabetes phenotype in which a person presents with DKA or unprovoked ketosis but does not necessarily have classic lifelong autoimmune type 1 diabetes. Some retain or recover meaningful beta-cell reserve after the crisis; others remain permanently insulin deficient. The descriptive terms ketosis-prone type 2 or Flatbush diabetes must never be used to promise insulin independence or to make a race-based diagnosis.",
      pathology: "During the acute episode, insulin secretion and action are inadequate enough to permit lipolysis, ketogenesis, dehydration, and acidosis. After fluids and insulin remove glucotoxic stress, beta-cell function may recover in some people. Classification uses islet autoimmunity (A positive or negative) and beta-cell reserve (beta positive or negative), creating A+beta-, A+beta+, A-beta-, and A-beta+ groups with different trajectories.",
      pathophysiology: ["Severe reversible glucotoxicity can temporarily suppress beta-cell secretion in some A-beta+ patients.", "Autoantibody-positive groups have evidence of immune disease even when reserve initially remains.", "Beta-negative groups have inadequate reserve and generally require ongoing insulin.", "Relapse can follow infection, missed treatment, or renewed metabolic stress even after an insulin-free interval."],
      etiology: "KPD is a syndrome, not one cause. It spans autoimmune and nonautoimmune disease, permanent and reversible insulin deficiency, and varied genetic and metabolic backgrounds. It has been described across ancestries. DKA precipitants such as infection, infarction, drugs, dehydration, or treatment interruption must be sought separately.",
      riskFactors: ["Presentation with DKA but an atypical type 1 phenotype", "Family history or features of type 2 diabetes", "Obesity or insulin resistance can occur but are not required", "Acute infection, surgery, trauma, dehydration, medication, or other metabolic stress", "Prior remission followed by recurrent ketosis"],
      signsSymptoms: ["Classic DKA: polyuria, thirst, weight loss, vomiting, abdominal pain, deep breathing, dehydration, and altered consciousness", "A phenotype that may resemble type 2 before or after the crisis", "Rapid improvement in insulin requirement after glucotoxicity resolves in some groups", "Recurrent hyperglycemia or ketosis when reserve declines or treatment is withdrawn"],
      diagnostics: ["Treat DKA first; do not delay emergency care to determine subtype.", "After metabolic stabilization, test validated islet autoantibodies and assess C-peptide reserve with simultaneous glucose at an appropriate interval.", "Do not use C-peptide within two weeks of a hyperglycemic emergency to justify insulin withdrawal because glucotoxic suppression can distort it.", "Classify A+/A- and beta+/beta- with endocrinology guidance and reassess over time.", "Identify the DKA precipitant and evaluate monogenic, pancreatic, medication, and autoimmune alternatives when indicated."],
      treatments: ["Give full protocol-directed DKA treatment with fluids, insulin, potassium and other electrolyte management, and precipitant control.", "Discharge on a safe insulin regimen unless a specialist-directed plan establishes otherwise after recovery.", "Consider cautious insulin reduction only after stable glucose, documented reserve, negative or contextualized autoimmunity, reliable follow-up, and ketone education.", "Use type 2 risk-reduction and noninsulin therapy when appropriate for the stable phenotype, without weakening relapse surveillance.", "Provide supplies, sick-day rules, and rapid access to care because recurrence can be abrupt."],
      contraindications: ["Do not stop insulin because the patient looks like type 2 or belongs to a particular racial or ethnic group.", "Do not measure early crisis C-peptide and call low reserve permanent or normal reserve reassuring.", "Do not promise remission; even A-beta+ disease can relapse.", "Do not call SGLT2-associated euglycemic DKA ketosis-prone diabetes without evaluating the medication-related event."],
      nursingPriorities: ["Manage the presenting event exactly as DKA regardless of presumed long-term type.", "Document antibody and C-peptide timing, not just the result.", "Verify insulin access and competence at discharge and schedule close endocrine follow-up.", "Teach glucose and ketone sick-day monitoring and signs of relapse.", "Use culturally safe, non-stereotyping language and avoid race as a diagnostic shortcut."],
      redFlags: ["Any recurrent vomiting, ketones, deep breathing, dehydration, or confusion", "Insulin discontinuation without documented reserve and specialist plan", "Rising glucose during infection or poor intake", "Severe hypoglycemia during recovery as insulin requirement falls"],
      complications: ["Recurrent DKA and electrolyte disturbance", "Severe hypoglycemia during rapidly changing insulin needs", "Misclassification leading either to unsafe insulin withdrawal or unnecessary permanent assumptions", "Long-term renal, retinal, neural, and cardiovascular diabetes complications"],
      prognosis: "A-beta+ patients may recover enough reserve for supervised insulin withdrawal, whereas beta-negative groups generally remain insulin dependent; antibody-positive reserve can decline. Individual trajectory cannot be inferred from appearance. Close follow-up and repeat physiology-based assessment determine prognosis.",
      prevention: "Prevent recurrence through treatment access, illness and ketone plans, precipitant management, and avoiding unsupervised insulin withdrawal. There is no proven way to guarantee remission.",
      patientEducation: ["The DKA was real even if later tests show that your pancreas recovered some insulin production.", "Do not stop insulin on your own; reserve testing must be done after recovery and interpreted by the diabetes team.", "Check ketones when ill or persistently high and seek urgent help for vomiting or deep breathing.", "Remission means close monitoring without insulin for a time, not cure."],
      nclexTraps: ["DKA does not prove classic autoimmune type 1 diabetes.", "KPD is not a race-based diagnosis.", "A-beta classification separates autoimmunity from reserve.", "C-peptide immediately after DKA is unreliable for an insulin-withdrawal decision."],
      relatedTopics: ["Diabetic ketoacidosis", "Type 1 diabetes mellitus", "Type 2 diabetes mellitus", "C-peptide", "Islet autoantibodies", "Diabetes mellitus classification"],
      aliases: ["ketosis prone diabetes", "ketosis-prone type 2 diabetes", "ketosis prone type 2", "KPD", "Flatbush diabetes", "atypical diabetes with DKA", "A beta diabetes classification"],
      abbreviations: ["KPD", "A-beta"],
      commonMisspellings: ["ketosis prone diabetis", "ketotis-prone diabetes", "flat bush diabetes"],
      tags: ["DKA phenotype", "A beta classification", "C-peptide recovery", "remission", "insulin withdrawal safety"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ada-crises-2024"]
    }),

    completeCard({
      name: "Post-transplantation diabetes mellitus",
      category: "Endocrinology and Transplant Medicine - Other Specific Diabetes",
      definition: "Post-transplantation diabetes mellitus (PTDM) means diabetes recognized in the post-transplant setting after a solid-organ transplant, regardless of whether susceptibility existed before surgery. The older term new-onset diabetes after transplantation (NODAT) is narrower and can wrongly exclude previously unrecognized diabetes. Early postoperative hyperglycemia is common and may be transient; formal PTDM classification is best made when the patient is clinically stable on maintenance immunosuppression and without acute infection.",
      pathology: "Preexisting insulin resistance and beta-cell vulnerability interact with surgical stress, infection, nutrition, glucocorticoids, and diabetogenic immunosuppression. Calcineurin inhibitors can impair beta-cell signaling and secretion; glucocorticoids increase hepatic glucose output and resistance. Kidney and liver function change drug and insulin handling. The graft-protective regimen remains the priority because reducing immunosuppression can cause rejection and graft loss.",
      pathophysiology: ["Surgical catecholamines, inflammation, dextrose, nutrition, and high-dose steroids produce common transient early hyperglycemia.", "Calcineurin-inhibitor beta-cell toxicity and chronic steroid resistance can expose or accelerate diabetes.", "Stable-state post-meal glucose may be abnormal despite less striking fasting values, which is why OGTT detects cases other tests miss.", "Infection raises glucose while hyperglycemia weakens host defense, creating a clinically important feedback loop."],
      etiology: "PTDM reflects overlapping pretransplant risk, organ failure, operative stress, infection, rejection therapy, and maintenance immunosuppression. It does not imply that one drug alone caused the disease. Type 1, type 2, pancreatic, and preexisting unrecognized diabetes can also occur in transplant recipients and should be classified when possible.",
      riskFactors: ["Pretransplant prediabetes, family history, age, metabolic syndrome, or prior gestational diabetes", "Tacrolimus or other calcineurin inhibitor and glucocorticoid exposure", "Acute rejection treatment, infection, surgical stress, or enteral/parenteral nutrition", "Hepatitis, organ-specific metabolic disease, and reduced kidney or liver function", "Post-transplant weight gain and reduced activity"],
      signsSymptoms: ["Often asymptomatic and detected through protocol monitoring", "Post-meal or evening hyperglycemia related to steroid timing", "Polyuria, thirst, infection, poor wound healing, fatigue, or blurred vision", "DKA or HHS can occur, but early postoperative glucose alone may reflect transient stress"],
      diagnostics: ["Screen glucose after transplantation and distinguish immediate postoperative stress hyperglycemia from stable PTDM.", "Make a formal diagnosis when clinically stable on likely maintenance immunosuppression and without acute infection, often around three months according to contemporary consensus.", "Use OGTT as the preferred diagnostic test in stable recipients; interpret A1C cautiously early after transplant when anemia, transfusion, renal disease, or erythropoietin alter it.", "Review pretransplant records so missed preexisting diabetes is not falsely called new onset.", "Assess graft function, infection, rejection treatment, steroid and calcineurin-inhibitor timing, kidney and liver function, and drug interactions."],
      treatments: ["Use insulin during unstable hospitalization, high-dose steroid exposure, infection, changing nutrition, or severe hyperglycemia because it can be titrated quickly.", "Individualize stable outpatient therapy around graft and kidney function, cardiovascular risk, infection, interactions, and current transplant evidence.", "Preserve the immunosuppressive regimen that best protects patient and graft unless the transplant team deliberately changes it.", "Treat infection and rejection promptly and coordinate every medication change with transplant pharmacy and endocrinology.", "Provide nutrition, activity, weight, blood pressure, lipid, and complication care without compromising graft nutrition or recovery."],
      contraindications: ["Do not reduce or stop immunosuppression independently to improve glucose.", "Do not diagnose permanent PTDM during acute infection, rejection treatment, or immediate postoperative instability without later confirmation.", "Do not rely on early A1C alone.", "Do not prescribe glucose-lowering medication without checking graft function, kidney function, infection risk, and interactions."],
      nursingPriorities: ["Trend fasting and post-meal glucose with steroid and tacrolimus timing, meals, renal function, infection, and rejection therapy.", "Reconcile every transplant and diabetes medicine and notify the transplant pharmacist before interaction-sensitive changes.", "Assess graft-specific function, wound, fever, urinary or respiratory infection, hydration, and nutrition.", "Teach insulin and low-glucose care during rapidly changing steroid doses.", "Protect follow-up for stable-state OGTT and long-term complication monitoring."],
      redFlags: ["Fever, sepsis, graft pain or dysfunction, reduced urine output, jaundice, or rejection concern", "Severe hyperglycemia with dehydration, ketones, vomiting, or confusion", "Recurrent hypoglycemia as steroids taper or kidney function changes", "Missed or altered immunosuppression because of glucose concerns"],
      complications: ["Infection, impaired wound healing, cardiovascular disease, and graft stress", "DKA, HHS, and hypoglycemia during changing renal function or steroids", "Medication interaction and toxicity", "Rejection or graft loss if immunosuppression is inappropriately weakened"],
      prognosis: "PTDM increases cardiovascular, infectious, and graft-related risk, but outcomes improve with early monitoring and integrated transplant-endocrine care. Stable graft function and the safest effective immunosuppression take precedence; glucose therapy adapts around them.",
      prevention: "Pretransplant risk assessment, early post-transplant monitoring, feasible nutrition and activity, and minimizing avoidable metabolic stress can reduce risk. Immunosuppression should not be selected or weakened solely to prevent PTDM when graft outcomes would suffer.",
      patientEducation: ["High glucose soon after transplant may be temporary, but it still needs treatment and later reassessment.", "Never change anti-rejection medicine on your own.", "Check glucose at the times recommended around steroid dosing and report infection or graft symptoms promptly.", "Ask when your stable-state OGTT and long-term diabetes follow-up will occur."],
      nclexTraps: ["PTDM is preferred over NODAT because preexisting missed diabetes and transient hyperglycemia complicate the timeline.", "OGTT is preferred for stable-state diagnosis.", "Early A1C can be misleading after transplant.", "Graft-protective immunosuppression takes priority while hyperglycemia is treated."],
      relatedTopics: ["Diabetes mellitus classification", "Medication- or chemical-induced diabetes mellitus", "Glucocorticoid-induced diabetes mellitus", "Organ transplantation", "Tacrolimus", "Prednisone"],
      aliases: ["PTDM", "post transplant diabetes", "post-transplant diabetes", "new-onset diabetes after transplantation", "NODAT", "transplant diabetes", "tacrolimus diabetes"],
      abbreviations: ["PTDM", "NODAT"],
      commonMisspellings: ["post transplant diabetis", "posttransplantaion diabetes", "tacrolimus diabtes"],
      tags: ["organ transplant", "immunosuppression", "tacrolimus", "glucocorticoid", "OGTT", "graft safety"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ptdm-consensus-2024"]
    }),

    completeCard({
      name: "Type 5 diabetes mellitus",
      category: "Endocrinology and Global Health - Evolving Diabetes Classification",
      definition: "Type 5 diabetes mellitus is the International Diabetes Federation's 2025 name for a distinct malnutrition-related diabetes phenotype associated with chronic undernutrition, usually beginning in lean adolescents or young adults in resource-limited settings. It appears to involve reduced insulin secretion without the typical autoimmune markers of type 1 or the dominant insulin resistance pattern of common type 2 diabetes. Recognition is recent, and formal diagnostic criteria and treatment guidelines are still being developed, so the label must be used cautiously rather than inferred from low weight alone.",
      pathology: "Chronic undernutrition during pancreatic development and repeated infection or food insecurity may limit beta-cell mass and insulin-secretory capacity. Hyperglycemia develops when this reduced reserve cannot meet metabolic need. Unlike classic type 1, islet autoimmunity is usually absent and DKA appears less typical; unlike common type 2, pronounced obesity-related insulin resistance is not the central pattern. Nutritional depletion also makes standard glucose-lowering doses more likely to cause hypoglycemia.",
      pathophysiology: ["Early-life and adolescent undernutrition may impair pancreatic growth and beta-cell reserve.", "Reduced insulin secretion permits hyperglycemia, but enough residual insulin may suppress ketogenesis in many patients.", "Low glycogen, muscle, fat, and micronutrient stores reduce protection from fasting and treatment-related hypoglycemia.", "Food insecurity creates alternating scarcity and refeeding, so treatment cannot be separated from reliable nutrition and social support."],
      etiology: "The IDF associates type 5 with chronic undernutrition and health inequity, especially in low- and middle-income countries. Causality, biomarkers, and boundaries remain under investigation. Autoimmune type 1, pancreatic disease including FCPD, monogenic diabetes, infection, and lean type 2 must be actively excluded; malnutrition can accompany any of them.",
      riskFactors: ["Long-standing undernutrition or food insecurity beginning in childhood or adolescence", "Lean body habitus, often BMI below 19 kg/m2, without using one cutoff as a diagnosis", "Young-adult hyperglycemia with negative credible islet autoantibodies", "Low insulin secretion without classic pancreatic calcification or another established cause", "Residence in a setting with recurrent infection and limited nutrition access"],
      signsSymptoms: ["Polyuria, thirst, fatigue, blurred vision, weakness, and weight or muscle loss", "Clinical undernutrition, micronutrient deficiency, or reduced functional reserve", "Hyperglycemia without the typical autoimmune pattern", "DKA may occur but appears less characteristic than in type 1; any ketones or illness still require urgent assessment"],
      diagnostics: ["Confirm diabetes by standard criteria and document objective nutrition history and status.", "Exclude type 1 with validated antibodies and stable-state C-peptide, while recognizing no test is perfect.", "Evaluate pancreatic imaging or exocrine symptoms, monogenic clues, infection, medications, and endocrine causes.", "Do not equate FCPD with type 5: calcific exocrine pancreatic disease supports pancreatic diabetes.", "Use specialist assessment because consensus diagnostic criteria and validated biomarkers remain in development."],
      treatments: ["Restore reliable, nutritionally complete intake gradually and address infection, micronutrient deficiency, and food access.", "Use individualized glucose-lowering treatment with conservative doses and frequent monitoring because low body stores increase hypoglycemia risk.", "Insulin may be required, but dose need can be lower than in classic type 1 and must follow actual nutrition.", "Avoid unvalidated one-size protocols while international guidance evolves.", "Screen and treat standard diabetes complications and the broader consequences of undernutrition."],
      contraindications: ["Do not diagnose type 5 from low BMI, poverty, or geography alone.", "Do not withhold insulin during dangerous insulin deficiency, but do not assume classic type 1 dosing.", "Do not prescribe weight loss or carbohydrate restriction to an undernourished patient.", "Do not present emerging criteria or treatment as settled evidence."],
      nursingPriorities: ["Assess food security, anthropometrics, muscle loss, infection, vitamins, electrolytes, hydration, and ability to obtain consistent meals.", "Coordinate glucose treatment with nutrition delivery and watch closely for lows during scarcity or recovery.", "Use respectful, non-stigmatizing language and involve nutrition, social work, endocrine, and primary care.", "Document why type 1, pancreatic, monogenic, and type 2 alternatives are less likely.", "Escalate severe hyperglycemia, ketones, dehydration, refeeding electrolyte shifts, infection, or inability to access food and medicine."],
      redFlags: ["Vomiting, ketones, deep breathing, dehydration, or altered consciousness", "Severe hypoglycemia or insulin administered without reliable food", "Marked wasting, edema, infection, electrolyte disturbance, or refeeding concern", "Diagnostic anchoring that delays evaluation for type 1, pancreatic disease, or another treatable cause"],
      complications: ["Hyperglycemic crisis and treatment-related hypoglycemia", "Standard retinal, renal, neural, and cardiovascular diabetes complications", "Protein-energy and micronutrient malnutrition, infection, and reduced muscle function", "Misclassification and inequitable access to nutrition, testing, and insulin"],
      prognosis: "Evidence is still developing. Prognosis likely depends on nutrition restoration, infection control, glucose treatment matched to intake, and access to ongoing care. The new name is intended to improve recognition, not to replace careful differential diagnosis.",
      prevention: "Prevention centers on maternal, child, and adolescent nutrition, food security, infection prevention, and accessible primary care. For an individual already affected, prevent harm through nutrition-linked dosing, hypoglycemia surveillance, and honest acknowledgment of evidence gaps.",
      patientEducation: ["Type 5 is a newly recognized malnutrition-related form; experts are still defining exact diagnostic and treatment criteria.", "Low body weight alone does not prove it, and tests must exclude autoimmune, pancreatic, and genetic causes.", "Treatment includes reliable nutrition as well as glucose control.", "Report vomiting, ketones, severe weakness, swelling, infection, or any low that cannot be safely treated."],
      nclexTraps: ["Type 5 is not another name for MODY5; MODY5 refers to HNF1B-related diabetes.", "Type 5 and fibrocalculous pancreatic diabetes are not interchangeable.", "Absence of obesity does not by itself establish type 5.", "IDF recognition is current, but formal criteria and treatment guidance remain in development."],
      relatedTopics: ["Diabetes mellitus classification", "Type 1 diabetes mellitus", "Type 2 diabetes mellitus", "Fibrocalculous pancreatic diabetes", "Pancreatic diabetes", "Monogenic diabetes mellitus", "Malnutrition"],
      aliases: ["type 5 diabetes", "diabetes type 5", "diabetes 5", "type five diabetes", "type V diabetes", "malnutrition-related diabetes mellitus", "malnutrition related diabetes", "undernutrition-related diabetes", "MRDM", "lean malnutrition diabetes"],
      abbreviations: ["T5DM", "MRDM"],
      commonMisspellings: ["malnutriton diabetes", "type 5 diabetis", "malnourishment diabeties"],
      tags: ["IDF 2025", "malnutrition-related diabetes", "undernutrition", "insulin deficiency", "evolving criteria", "global health"],
      sourceKeys: ["w41-idf-type5-2025", "w41-ada-classification-2026"]
    }),

    completeCard({
      name: "Prediabetes",
      category: "Endocrinology - Intermediate Hyperglycemia",
      definition: "Prediabetes is an intermediate range of dysglycemia in which glucose regulation is abnormal but does not meet diabetes thresholds. ADA criteria include A1C 5.7-6.4%, fasting plasma glucose 100-125 mg/dL, or 2-hour glucose 140-199 mg/dL during a 75-g OGTT in nonpregnant people. It is a risk state, not a guarantee of progression and not a separate numbered type of diabetes.",
      pathology: "Insulin resistance and early beta-cell dysfunction often begin before diagnostic diabetes. Post-meal glucose may rise first because rapid insulin release is impaired; fasting glucose rises as hepatic insulin resistance develops. Vascular risk factors such as blood pressure, lipids, smoking, sleep apnea, and fatty liver can already be present, so prevention is broader than watching a glucose number.",
      pathophysiology: ["Compensation is still sufficient to keep glucose below diabetes thresholds but not fully normal.", "Impaired fasting glucose emphasizes hepatic glucose output, while impaired glucose tolerance emphasizes post-meal disposal; many people have both.", "A1C averages exposure but can disagree with plasma glucose when red-cell biology changes.", "Progression, stability, or return to normal depends on beta-cell reserve, metabolic stress, medicines, pregnancy history, and accessible prevention support."],
      etiology: "Prediabetes shares many type 2 risk factors but can also reflect medication exposure, pancreatic disease, pregnancy history, or early atypical diabetes. It should prompt context-specific evaluation rather than automatic assignment to type 2.",
      riskFactors: ["Family history, prior gestational diabetes, age, or high-risk ancestry", "Central adiposity, inactivity, sleep apnea, hypertension, dyslipidemia, or PCOS", "Glucocorticoids, antipsychotics, HIV therapy, or transplantation", "Pancreatitis or other pancreatic disease", "Cardiovascular disease, fatty liver disease, or rising glucose trend"],
      signsSymptoms: ["Usually no symptoms", "Acanthosis nigricans can indicate insulin resistance", "Polyuria, thirst, weight loss, or blurred vision should prompt testing for progression or another diagnosis", "Cardiometabolic risk may be evident through blood pressure, lipids, fatty liver, or sleep apnea"],
      diagnostics: ["Use A1C, fasting glucose, or 75-g OGTT criteria and repeat according to risk and proximity to thresholds.", "Use plasma glucose when A1C is unreliable because of pregnancy, anemia, transfusion, hemoglobin variation, dialysis, or altered red-cell turnover.", "Review medications, pancreatic history, pregnancy history, family pattern, and autoimmune symptoms when the phenotype is atypical.", "Check blood pressure, lipids, weight trajectory, liver risk, sleep, tobacco, and cardiovascular disease.", "Test at least yearly according to ADA guidance while prediabetes persists, with earlier reassessment when symptoms or risk change."],
      treatments: ["Use an individualized prevention plan with feasible nutrition, activity, sleep, and weight goals that respect disability, culture, food access, and preference.", "Consider metformin or other evidence-based prevention strategies in selected high-risk people under current guidance.", "Treat blood pressure, lipids, tobacco exposure, and sleep apnea because cardiovascular risk is not deferred until diabetes appears.", "Modify diabetogenic medicines only through risk-benefit discussion with the prescribing clinician.", "After gestational diabetes, maintain lifelong screening and prevention support."],
      contraindications: ["Do not call prediabetes inevitable diabetes or blame the patient.", "Do not diagnose from point-of-care or nonstandard testing without appropriate confirmation.", "Do not rely on A1C when red-cell physiology makes it discordant.", "Do not miss type 1, pancreatic, monogenic, or medication-related disease when symptoms or progression are atypical."],
      nursingPriorities: ["Explain the exact abnormal test and what it measures.", "Assess food access, activity capacity, sleep, stress, medicines, pregnancy history, and cardiovascular risks.", "Set specific follow-up and repeat-testing dates rather than vague advice.", "Use collaborative, non-stigmatizing goals and connect resources.", "Escalate classic symptoms, rapid weight loss, ketones, pregnancy, or rapidly rising results for earlier diagnostic evaluation."],
      redFlags: ["Polyuria, polydipsia, weight loss, vomiting, ketones, or rapid deterioration", "Pregnancy or planned pregnancy with abnormal glucose", "Marked discordance between A1C and plasma glucose", "Medication or pancreatic exposure with rapidly rising post-meal glucose"],
      complications: ["Progression to type 2 or another form of diabetes", "Cardiovascular disease and fatty liver risk", "Psychological stigma or false reassurance", "Delayed recognition of atypical autoimmune, pancreatic, or medication-related diabetes"],
      prognosis: "Many people do not inevitably progress, and risk can fall with sustained support. A rising trajectory, prior GDM, greater metabolic burden, or declining beta-cell reserve increases risk. Ongoing surveillance remains important even after values improve.",
      prevention: "Prediabetes is itself a prevention opportunity. Effective programs combine nutrition, movement, sleep, cardiometabolic care, medication review, and structural support. The plan should be realistic and maintained rather than a short restrictive diet.",
      patientEducation: ["Prediabetes means higher risk, not certainty and not personal failure.", "Ask which test was abnormal because fasting, post-meal, and A1C patterns can differ.", "Keep yearly or clinician-directed testing even if you feel well.", "Report thirst, urination, weight loss, blurred vision, vomiting, or ketones before the next routine visit."],
      nclexTraps: ["Prediabetes is not a numbered diabetes subtype.", "A1C, fasting glucose, and OGTT identify overlapping but not identical groups.", "An asymptomatic patient still needs cardiovascular risk assessment.", "Rapid symptomatic progression should trigger reclassification, not simply more lifestyle advice."],
      relatedTopics: ["Type 2 diabetes mellitus", "Diabetes mellitus classification", "Gestational diabetes mellitus", "Hemoglobin A1c", "Fasting glucose", "Oral glucose tolerance test", "Metabolic syndrome"],
      aliases: ["pre diabetes", "borderline diabetes", "intermediate hyperglycemia", "impaired fasting glucose", "impaired glucose tolerance", "high risk glucose", "IFG", "IGT"],
      abbreviations: ["IFG", "IGT"],
      commonMisspellings: ["prediabetis", "pre diabeties", "borderline diabtes"],
      tags: ["A1C 5.7-6.4", "fasting glucose 100-125", "2-hour glucose 140-199", "diabetes prevention", "annual testing"],
      sourceKeys: ["w41-ada-classification-2026", "w41-who-diabetes"]
    })
  ];

  const results = [];
  cards.forEach((rawCard) => {
    const { mergeNames = [], ...card } = rawCard;
    const identityNames = unique([card.name, ...mergeNames]);
    const identitySet = new Set(identityNames.map(normalize));
    const matches = database.diseases.filter((entry) => identitySet.has(normalize(titleOf(entry))));
    const preservedAliases = unique(matches.flatMap((entry) => [
      titleOf(entry),
      ...(Array.isArray(entry.aliases) ? entry.aliases : []),
      ...(Array.isArray(entry.abbreviations) ? entry.abbreviations : []),
      ...(Array.isArray(entry.commonMisspellings) ? entry.commonMisspellings : [])
    ])).filter((value) => normalize(value) !== normalize(card.name));

    let target = matches[0] || null;
    if (!target) {
      target = {};
      database.diseases.push(target);
    }
    Object.assign(target, card, {
      aliases: unique([...(card.aliases || []), ...preservedAliases])
    });

    let removedDuplicateCount = 0;
    matches.forEach((entry) => {
      if (entry === target) return;
      const index = database.diseases.indexOf(entry);
      if (index >= 0) {
        database.diseases.splice(index, 1);
        removedDuplicateCount += 1;
      }
    });

    results.push(Object.freeze({
      canonicalName: card.name,
      mergedNames: Object.freeze(identityNames.slice()),
      aliasCount: target.aliases.length,
      sourceCount: Array.isArray(card.sourceKeys) ? card.sourceKeys.length : 0,
      removedDuplicateCount
    }));
  });

  // Keep the general DKA identity owned by the general DKA card. Older
  // pediatric cohorts carried unqualified "DKA" aliases, which could make an
  // adult or generic diabetic-ketoacidosis search open the pediatric card.
  // Pediatric terms remain fully searchable through explicitly child-focused
  // aliases, while the general card retains the unqualified identity.
  const pediatricDkaTitles = new Set([
    "dka in children",
    "pediatric diabetic ketoacidosis",
    "diabetic ketoacidosis in children"
  ]);
  const unqualifiedDkaAliases = new Set(["dka", "diabetic ketoacidosis"]);
  let pediatricDkaAliasCleanupCount = 0;
  database.diseases.forEach((entry) => {
    if (!pediatricDkaTitles.has(normalize(titleOf(entry)))) return;
    const originalAliases = Array.isArray(entry.aliases) ? entry.aliases : [];
    const qualifiedAliases = [
      "pediatric DKA",
      "DKA in children",
      "childhood DKA",
      "diabetic ketoacidosis in children",
      "pediatric diabetic ketoacidosis"
    ];
    const filteredAliases = originalAliases.filter((alias) => !unqualifiedDkaAliases.has(normalize(alias)));
    pediatricDkaAliasCleanupCount += originalAliases.length - filteredAliases.length;
    entry.aliases = unique([...filteredAliases, ...qualifiedAliases]);
  });

  window.ANI_PATHOLOGY_WAVE41_DIABETES_CORE = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    applied: true,
    sourceNote: SOURCE_NOTE,
    cardCount: cards.length,
    sourceCount: sourceReferences.length,
    pediatricDkaAliasCleanupCount,
    cards: Object.freeze(results)
  });
})();
