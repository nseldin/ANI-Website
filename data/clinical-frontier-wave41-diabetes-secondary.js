/* eslint-disable */
/* Wave 41: secondary, treatment-associated, and terminology diabetes references. */
(function () {
  "use strict";

  const VERSION = "2026-07-21-wave41-diabetes-secondary-1";
  const SOURCE_NOTE = "This educational synthesis uses the cited current classification, pharmacology, inpatient endocrine, lipodystrophy, and diabetes-insipidus references. A temporal association does not automatically prove that a medicine, hormone disorder, or other condition caused diabetes. Treat urgent hyperglycemia first, then classify with the prescribing and specialty teams; never stop an essential cancer, transplant, HIV, psychiatric, or anti-inflammatory treatment independently.";

  if (window.ANI_PATHOLOGY_WAVE41_DIABETES_SECONDARY && window.ANI_PATHOLOGY_WAVE41_DIABETES_SECONDARY.version === VERSION) return;

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) {
    window.ANI_PATHOLOGY_WAVE41_DIABETES_SECONDARY = Object.freeze({ schemaVersion: 1, version: VERSION, applied: false, reason: "ANI pathology database was unavailable." });
    return;
  }

  const clean = (value) => String(value || "").trim();
  const normalize = (value) => clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\u2019']/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
  const titleOf = (entry) => clean(entry && (entry.name || entry.title || entry.displayName));
  const unique = (values) => Array.from(new Map((values || []).map(clean).filter(Boolean).map((value) => [normalize(value), value])).values());

  const sourceReferences = [
    { key: "w41-ada-classification-2026", label: "American Diabetes Association: Diagnosis and Classification of Diabetes, Standards of Care in Diabetes - 2026", url: "https://diabetesjournals.org/care/article/49/Supplement_1/S27/163926/2-Diagnosis-and-Classification-of-Diabetes", note: "Supports medication, HIV, glucocorticoid, cancer-therapy, endocrine, pancreatic, monogenic, and formal diabetes-category distinctions." },
    { key: "w41-ada-pharmacology-2026", label: "American Diabetes Association: Pharmacologic Approaches to Glycemic Treatment, Standards of Care in Diabetes - 2026", url: "https://diabetesjournals.org/care/article/49/Supplement_1/S183/163934/9-Pharmacologic-Approaches-to-Glycemic-Treatment", note: "Supports individualized glucose-lowering treatment and drug-specific safety." },
    { key: "w41-ada-behavior-2026", label: "American Diabetes Association: Facilitating Positive Health Behaviors and Well-being, Standards of Care in Diabetes - 2026", url: "https://diabetesjournals.org/care/article/49/Supplement_1/S89/163932/5-Facilitating-Positive-Health-Behaviors-and-Well", note: "Supports metabolic monitoring and person-centered care for people using second-generation antipsychotics." },
    { key: "w41-endocrine-inpatient-2022", label: "Endocrine Society: Management of Hyperglycemia in Hospitalized Adult Patients in Non-Critical Care Settings", url: "https://academic.oup.com/jcem/article/107/8/2101/6605637", note: "Supports inpatient glucocorticoid-associated hyperglycemia monitoring and insulin strategies with safeguards during steroid taper." },
    { key: "w41-lipodystrophy-guideline", label: "Multi-Society Practice Guideline: Diagnosis and Management of Lipodystrophy Syndromes", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5155679/", note: "Supports clinical recognition, metabolic surveillance, organ complications, genetic assessment, and cause-specific treatment of lipodystrophy." },
    { key: "w41-niddk-di", label: "NIH NIDDK: Diabetes Insipidus", url: "https://www.niddk.nih.gov/health-information/kidney-disease/diabetes-insipidus", note: "Supports the distinction from diabetes mellitus, central, nephrogenic, dipsogenic and gestational forms, water-balance danger, and cause-specific treatment." },
    { key: "w41-ada-crises-2024", label: "ADA, EASD, JBDS, AACE, and DTS: Hyperglycemic Crises in Adults With Diabetes Consensus Report (2024)", url: "https://diabetesjournals.org/care/article/47/8/1257/156808/Hyperglycemic-Crises-in-Adults-With-Diabetes-A", note: "Supports DKA and HHS recognition and monitored treatment principles." }
  ];

  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];
  sourceReferences.forEach((source) => {
    const existing = database.sourceReferences.find((item) => clean(item && (item.key || item.id)) === source.key);
    if (existing) Object.assign(existing, source);
    else database.sourceReferences.push({ ...source });
  });

  function card(spec) {
    return {
      nclexEssential: true,
      sourceNote: SOURCE_NOTE,
      displayName: spec.name,
      abbreviations: [],
      commonMisspellings: [],
      tags: [],
      ...spec
    };
  }

  const cards = [
    card({
      name: "Secondary diabetes mellitus",
      category: "Endocrinology - Other Specific Diabetes",
      definition: "Secondary diabetes mellitus is hyperglycemia caused or substantially driven by another disease, hormone disorder, medication, chemical exposure, pancreatic injury, or treatment. It is an umbrella, not a single mechanism. The safest answer is therefore two-layered: control dangerous glucose now and identify the driver so pancreatic disease, cortisol or growth-hormone excess, transplantation, cancer therapy, lipodystrophy, iron overload, or another treatable cause is not mislabeled ordinary type 2 diabetes.",
      pathology: "Each secondary form changes the balance between insulin secretion and demand differently. Pancreatic disease removes islet tissue; glucocorticoids and hormone excess raise hepatic glucose output and resistance; calcineurin inhibitors and immune checkpoint inhibitors can damage beta-cell function through different pathways; lipodystrophy removes safe fat storage and creates severe ectopic-fat resistance. Several mechanisms can coexist with genetic type 2 susceptibility.",
      pathophysiology: ["A primary disorder or treatment perturbs insulin secretion, insulin action, or both.", "Hyperglycemia itself then worsens beta-cell function and resistance through glucotoxicity.", "Treating the driver can reduce glucose, but established beta-cell loss may persist.", "Dose changes, remission of illness, organ recovery, or withdrawal of the driver can rapidly lower insulin need and cause hypoglycemia unless therapy is adjusted."],
      etiology: "Major groups are exocrine pancreatic disease; endocrine hormone excess; drug- or chemical-induced diabetes; post-transplantation diabetes; genetic defects of insulin action; lipodystrophy; hemochromatosis; infection-related or syndromic disease; and emerging malnutrition-related diabetes. The causal claim should be proportional to evidence and timing.",
      riskFactors: ["New diabetes after pancreatitis, pancreatic surgery, transplantation, cancer treatment, or steroid exposure", "Cushing syndrome, acromegaly, pheochromocytoma, glucagonoma, somatostatinoma, or other hormone excess", "Unusual fat loss, extreme triglycerides, fatty liver, or severe insulin resistance", "Iron overload, cystic fibrosis, genetic syndrome, HIV, or complex medication exposure", "Atypical age, family pattern, weight trajectory, C-peptide, or treatment response"],
      signsSymptoms: ["Usual hyperglycemia symptoms plus features of the underlying cause", "Rapid or patterned glucose rise linked to a dose, feed, procedure, or illness", "Pancreatic pain or steatorrhea, cushingoid changes, acral growth, episodic catecholamine symptoms, or abnormal fat distribution", "DKA or HHS when insulin deficiency or stress becomes severe"],
      diagnostics: ["Confirm diabetes by standard criteria, then construct a timeline of glucose, symptoms, disease, medicines, surgery, pregnancy, and organ function.", "Assess antibodies and stable-state C-peptide when autoimmune versus secretory disease changes treatment.", "Use cause-directed hormone, pancreatic, genetic, iron, lipid, liver, imaging, or medication evaluation rather than one generic panel.", "Reassess after the driver changes; improvement supports contribution but does not prove exclusive causality.", "Screen ordinary renal, retinal, neural, foot, and cardiovascular complications because secondary diabetes still causes chronic glucose injury."],
      treatments: ["Stabilize DKA, HHS, severe dehydration, or catabolism immediately.", "Treat glucose with insulin or other therapy matched to secretion, resistance, organ function, nutrition, and acute illness.", "Treat or remove the driver when medically appropriate through the responsible specialty.", "Anticipate falling insulin need when steroids taper, hormone excess is corrected, infection resolves, or nutrition changes.", "Preserve essential transplant, cancer, HIV, psychiatric, and inflammatory treatment until the prescribing team makes a coordinated risk-benefit decision."],
      contraindications: ["Do not stop a suspected causative medicine independently.", "Do not assume every temporal association is causal.", "Do not use a type 2-only treatment template for severe insulin deficiency, pancreatic malabsorption, or pregnancy.", "Do not forget that the underlying condition may be more urgent than the glucose label."],
      nursingPriorities: ["Build and document a precise exposure and disease timeline.", "Trend glucose with medicine dose and timing, nutrition, illness, and organ function.", "Assess for mechanism-specific findings and communicate them rather than charting only 'diabetic'.", "Coordinate dose reduction as the driver resolves and monitor recurrent hypoglycemia.", "Ensure specialty ownership, follow-up testing, sick-day education, and emergency escalation."],
      redFlags: ["Ketones, vomiting, deep breathing, severe dehydration, or altered consciousness", "Rapid glucose escalation after a new treatment", "Severe hypoglycemia as a medicine, hormone, feed, or organ function changes", "Cancer, transplant rejection, sepsis, pancreatic obstruction, or hormone-crisis findings"],
      complications: ["DKA, HHS, hypoglycemia, and electrolyte disturbance", "Standard microvascular and macrovascular diabetes complications", "Progression of the underlying endocrine, pancreatic, genetic, transplant, or malignant disease", "Treatment interaction and diagnostic anchoring"],
      prognosis: "Outcome depends on whether the driver is reversible, how much beta-cell reserve remains, and how quickly therapy tracks changing physiology. Some cases resolve after treatment withdrawal or disease control; others persist because beta-cell or organ injury is permanent.",
      prevention: "Screen before and during high-risk treatments, monitor after pancreatic disease and transplantation, recognize endocrine and genetic clues, and reduce avoidable exposure when the benefit-risk balance permits. Never withhold necessary therapy solely to prevent glucose change without a coordinated alternative.",
      patientEducation: ["Secondary diabetes means another condition or treatment contributes to the glucose problem.", "Do not stop steroids, cancer therapy, transplant medicine, HIV medicine, or psychiatric medicine on your own.", "Ask how glucose monitoring should change when the driver dose changes.", "Seek urgent care for vomiting, ketones, deep breathing, severe dehydration, confusion, or an unmanageable low."],
      nclexTraps: ["Secondary diabetes is an umbrella, not one standardized disease.", "Treat the glucose and the driver in parallel.", "Improvement after stopping an exposure supports but does not alone prove causality.", "Insulin need may fall quickly when the driver resolves."],
      relatedTopics: ["Diabetes mellitus classification", "Pancreatic diabetes", "Medication- or chemical-induced diabetes mellitus", "Endocrinopathy-associated diabetes mellitus", "Post-transplantation diabetes mellitus", "Lipodystrophy-associated diabetes mellitus", "Hemochromatosis-associated diabetes"],
      aliases: ["secondary diabetes", "other specific diabetes", "diabetes due to another condition", "disease-induced diabetes", "secondary DM"],
      abbreviations: ["SDM"],
      commonMisspellings: ["secondary diabetis", "secodary diabetes", "diabetes from another condtion"],
      tags: ["other specific diabetes", "causal timeline", "reversible hyperglycemia", "underlying disease"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ada-pharmacology-2026"]
    }),

    card({
      name: "Medication- or chemical-induced diabetes mellitus",
      category: "Endocrinology and Pharmacology - Other Specific Diabetes",
      definition: "Medication- or chemical-induced diabetes mellitus is persistent diabetes caused or unmasked by a drug or toxic exposure. Glucocorticoids, selected antipsychotics, immunosuppressants, HIV therapies, immune checkpoint inhibitors, PI3K-alpha inhibitors, mTOR inhibitors, and other agents act through different mechanisms. A glucose rise after a medicine is a safety signal, not permission to stop essential therapy without the prescribing team.",
      pathology: "Drugs can increase hepatic glucose output, reduce muscle and fat uptake, promote weight or ectopic fat, directly suppress beta-cell secretion, trigger autoimmune beta-cell destruction, or combine these effects. Timing can be diagnostic: morning prednisone often raises afternoon and evening glucose; checkpoint-inhibitor diabetes can appear abruptly with DKA; antipsychotic risk evolves with metabolic change; calcineurin inhibitors impair beta-cell function after transplant.",
      pathophysiology: ["The exposure changes insulin action or supply according to its pharmacology.", "Preexisting beta-cell susceptibility determines whether hyperglycemia is transient or crosses diabetes thresholds.", "Repeated hyperglycemia creates glucotoxicity that can persist after the exposure changes.", "When the drug is tapered or stopped, glucose-lowering treatment can become excessive, causing hypoglycemia."],
      etiology: "Potential agents include glucocorticoids; second-generation antipsychotics; tacrolimus and other immunosuppressants; selected antiretroviral agents; immune checkpoint, PI3K-alpha and mTOR inhibitors; and less commonly other drugs or chemicals. Statins and thiazides modestly increase population risk but should not be portrayed as automatic individual causes.",
      riskFactors: ["Prediabetes, family history, prior GDM, or limited beta-cell reserve", "Higher dose, longer duration, combination therapy, or recurrent courses", "Transplantation, cancer, infection, or illness that independently raises glucose", "Kidney or liver dysfunction changing drug and insulin handling", "Concurrent enteral/parenteral nutrition or inactivity"],
      signsSymptoms: ["Often asymptomatic until scheduled monitoring detects a pattern", "Polyuria, thirst, blurred vision, fatigue, infection, or weight change", "Afternoon/evening hyperglycemia with morning glucocorticoids", "Abrupt thirst, weight loss, ketones, vomiting, or DKA with immune checkpoint inhibitor-associated insulin deficiency"],
      diagnostics: ["Establish baseline glucose and A1C when recommended before high-risk therapy.", "Match monitoring to drug timing and mechanism rather than relying only on fasting glucose.", "Confirm diabetes when stable and evaluate preexisting versus unmasked disease.", "Use antibodies, C-peptide, ketones, or cause-specific tests when abrupt insulin deficiency is possible.", "Document start, dose, changes, symptoms, glucose trajectory, and competing stressors."],
      treatments: ["Continue or modify the causative therapy only through the prescribing specialty's risk-benefit decision.", "Use insulin during severe or rapidly changing hyperglycemia and match its action to the drug pattern.", "Select noninsulin treatment according to mechanism, organ function, cancer or transplant context, and interactions.", "Reduce glucose-lowering doses proactively as the exposure tapers or resolves.", "Provide hydration, ketone, low-glucose, and emergency education."],
      contraindications: ["Do not independently stop steroids, immunosuppression, antipsychotics, ART, or cancer therapy.", "Do not assume fasting glucose excludes a post-meal drug pattern.", "Do not label SGLT2-associated euglycemic DKA as SGLT2-induced diabetes; it is an adverse crisis in a treated person.", "Do not leave insulin unchanged during a major steroid taper without reassessment."],
      nursingPriorities: ["Reconcile exact agent, dose, schedule, infusion cycle, steroid taper, and co-medications.", "Schedule glucose checks when the expected drug effect peaks.", "Monitor food intake, infection, renal and liver function, and hypoglycemia during dose transitions.", "Teach why the medicine may continue while glucose is treated.", "Escalate ketones, DKA/HHS symptoms, or rapid treatment-related deterioration."],
      redFlags: ["Ketones, vomiting, deep breathing, dehydration, or confusion", "Rapid glucose rise after checkpoint, PI3K, mTOR, or high-dose steroid therapy", "Severe low during taper or interrupted nutrition", "Stopping a graft-, cancer-, HIV-, psychiatric-, or inflammation-protective medicine without specialist direction"],
      complications: ["DKA, HHS, infection, dehydration, and hypoglycemia", "Long-term diabetes if beta-cell injury persists", "Loss of essential disease control from inappropriate treatment withdrawal", "Interactions with renal, hepatic, transplant, cancer, or psychiatric care"],
      prognosis: "Some forms improve after exposure ends; autoimmune checkpoint-inhibitor diabetes often leaves permanent insulin deficiency, while steroid patterns may resolve or reveal underlying type 2 susceptibility. Continued testing after therapy changes determines persistence.",
      prevention: "Obtain baseline and scheduled monitoring, choose the lowest effective exposure only when clinically appropriate, support feasible metabolic health, and respond to early patterns before crisis. Prevention never means unilaterally withholding essential treatment.",
      patientEducation: ["The medicine may be contributing, but stopping it suddenly can be more dangerous than treating the glucose.", "Check glucose at the times recommended for that medicine, not only before breakfast.", "Know whether dose reductions require an insulin or tablet change.", "Report thirst, weight loss, vomiting, ketones, confusion, or severe lows immediately."],
      nclexTraps: ["Medication-associated hyperglycemia can unmask preexisting susceptibility.", "Mechanism and timing differ by drug class.", "Checkpoint-inhibitor diabetes is usually an insulin-deficient emergency phenotype.", "Steroid taper is a hypoglycemia risk when insulin is not reduced."],
      relatedTopics: ["Secondary diabetes mellitus", "Glucocorticoid-induced diabetes mellitus", "Immune checkpoint inhibitor-associated diabetes", "Antipsychotic-associated diabetes mellitus", "Post-transplantation diabetes mellitus", "HIV-associated dysglycemia", "PI3K inhibitor-induced hyperglycemia"],
      aliases: ["drug-induced diabetes", "medication induced diabetes", "chemical-induced diabetes", "iatrogenic diabetes", "medicine caused diabetes", "drug related hyperglycemia"],
      abbreviations: ["DIDM"],
      commonMisspellings: ["medication induced diabetis", "drug indused diabetes", "iatrogenic diabtes"],
      tags: ["drug-induced", "glucocorticoids", "antipsychotics", "immunotherapy", "immunosuppression", "temporal relationship"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ada-pharmacology-2026"]
    }),

    card({
      name: "Glucocorticoid-induced diabetes mellitus",
      category: "Endocrinology and Pharmacology - Medication-Induced Diabetes",
      definition: "Glucocorticoid-induced diabetes mellitus is diabetes caused or unmasked by systemic corticosteroid exposure. Steroids increase hepatic glucose production, oppose insulin in muscle and fat, and can impair beta-cell compensation. With morning prednisone, fasting glucose can appear nearly normal while afternoon and evening post-meal glucose is markedly high, so fasting-only screening can miss the clinically important pattern.",
      pathology: "Glucocorticoid receptor signaling increases gluconeogenic enzymes and mobilizes amino acids and fatty acids, providing the liver more substrate for glucose. Peripheral insulin resistance rises and beta cells must secrete more insulin. The glucose curve follows steroid pharmacology: intermediate-acting morning doses commonly peak later in the day, while divided, long-acting, or IV therapy can cause round-the-clock hyperglycemia.",
      pathophysiology: ["Steroid dose and timing set the period of greatest insulin resistance.", "Post-meal glucose often rises before fasting glucose because meals add substrate during peak resistance.", "Infection, inflammation, nutrition support, and inactivity amplify the effect.", "Tapering reverses resistance faster than long-acting insulin disappears, creating predictable hypoglycemia risk."],
      etiology: "Systemic prednisone, methylprednisolone, dexamethasone, hydrocortisone and similar therapies can cause the disorder; repeated joint, epidural, inhaled, topical, or local exposure contributes less predictably depending on dose and absorption. Endogenous cortisol excess belongs under endocrinopathy-associated diabetes.",
      riskFactors: ["Higher dose, longer duration, repeated courses, or long-acting/divided steroids", "Prediabetes, prior GDM, family history, metabolic syndrome, or older age", "Cancer, transplant, autoimmune disease, infection, or enteral nutrition", "Reduced activity, sleep disruption, or weight change", "Kidney or liver dysfunction that changes treatment safety"],
      signsSymptoms: ["Afternoon or evening thirst, polyuria, fatigue, blurred vision, or infection", "Post-meal hyperglycemia with a deceptively reassuring fasting result", "HHS or, less commonly, DKA when severe", "Hypoglycemia after a steroid dose is delayed, reduced, stopped, or vomited"],
      diagnostics: ["Obtain baseline risk and glucose when feasible before recurrent or prolonged systemic therapy.", "Monitor postprandial or random glucose during long-term or recurrent glucocorticoid use as ADA recommends.", "Map values against steroid name, dose, route, and time.", "Confirm persistent diabetes after the steroid course when the patient is clinically stable.", "Assess ketones, electrolytes, hydration, and osmolality when crisis is possible."],
      treatments: ["Treat the underlying disease with the clinically necessary steroid plan; use the lowest effective exposure only through the prescribing clinician.", "Match insulin type and timing to the steroid curve, with basal-bolus or NPH-based strategies chosen by protocol and patient context.", "Use noninsulin medicines in selected stable settings after checking onset, organ function, interactions, and severity.", "Reduce glucose-lowering therapy as steroids taper and increase monitoring around every change.", "Treat HHS or DKA with full emergency protocols."],
      contraindications: ["Do not abruptly stop chronic steroids because of hyperglycemia; adrenal crisis and disease flare can result.", "Do not monitor only fasting glucose with morning prednisone.", "Do not leave feed- or steroid-linked insulin unchanged when the dose or nutrition stops.", "Do not assume the diabetes has resolved until follow-up confirms it."],
      nursingPriorities: ["Document exact steroid and glucose times on the same trend.", "Check afternoon/evening values when the regimen predicts them.", "Coordinate insulin changes with every steroid taper or escalation.", "Assess infection, hydration, nutrition, mental status, and adrenal-risk symptoms.", "Teach the patient never to self-stop steroids and how to prevent lows during taper."],
      redFlags: ["Severe dehydration, confusion, extreme glucose, ketones, vomiting, or deep breathing", "Steroid stopped abruptly after chronic use", "Recurrent hypoglycemia after taper or missed steroid/meal", "Sepsis, transplant rejection, cancer complication, or autoimmune flare driving the steroid need"],
      complications: ["HHS, DKA, infection, impaired healing, and electrolyte loss", "Hypoglycemia during taper", "Persistent type 2 diabetes after exposure reveals limited reserve", "Adrenal crisis or disease flare from inappropriate steroid cessation"],
      prognosis: "Glucose may normalize after a short course, but some patients have persistent diabetes because steroids exposed preexisting beta-cell limitation. Follow-up after taper separates transient hyperglycemia from lasting disease.",
      prevention: "Risk screening, post-meal monitoring, anticipatory treatment, and planned dose reduction prevent crises. The underlying disease and adrenal safety determine whether steroid reduction is possible.",
      patientEducation: ["Morning steroids often raise glucose later in the day, so check at the prescribed times.", "Never stop steroids suddenly unless the prescribing clinician gives a taper.", "Your diabetes medicine may need to fall as the steroid dose falls.", "Report confusion, severe thirst, vomiting, ketones, or repeated low glucose."],
      nclexTraps: ["Normal fasting glucose does not exclude steroid hyperglycemia.", "Prednisone's glucose pattern often peaks after lunch and dinner.", "Taper creates low-glucose risk.", "Exogenous steroid diabetes differs from Cushing syndrome, which is endogenous cortisol excess."],
      relatedTopics: ["Medication- or chemical-induced diabetes mellitus", "Prednisone", "Dexamethasone", "Cushing syndrome", "Hyperosmolar hyperglycemic state", "Hypoglycemia"],
      aliases: ["steroid diabetes", "steroid-induced diabetes", "steroid hyperglycemia", "prednisone diabetes", "prednisone high sugar", "glucocorticoid hyperglycemia", "corticosteroid-induced diabetes", "steroid afternoon high blood sugar", "afternoon high glucose from steroids", "prednisone afternoon hyperglycemia", "steroid post-meal hyperglycemia"],
      abbreviations: ["GC-DM", "GIH"],
      commonMisspellings: ["steriod diabetes", "predisone high sugar", "glucocorticoid diabetis"],
      tags: ["prednisone", "afternoon hyperglycemia", "postprandial monitoring", "steroid taper", "NPH"],
      sourceKeys: ["w41-ada-classification-2026", "w41-endocrine-inpatient-2022"]
    }),

    card({
      name: "Immune checkpoint inhibitor-associated diabetes",
      category: "Endocrinology and Oncology - Medication-Induced Diabetes",
      definition: "Immune checkpoint inhibitor-associated diabetes is abrupt insulin-deficient diabetes triggered by cancer immunotherapy, most often PD-1 or PD-L1 blockade and less often other checkpoint pathways. It can present with DKA after previously normal glucose and generally requires lifelong insulin. It is an immune-related adverse event, but the oncology team—not the patient—decides whether cancer therapy is held, resumed, or changed.",
      pathology: "Checkpoint blockade releases inhibitory brakes on T-cell activity so immunity can attack tumor cells. In susceptible patients, activated immune cells also destroy pancreatic beta cells. Loss can be rapid, leaving very low C-peptide before A1C has had time to rise dramatically. Islet autoantibodies may be positive or negative; their absence does not exclude this mechanism.",
      pathophysiology: ["Immune activation produces rapid beta-cell injury rather than gradual insulin resistance.", "A1C can understate acuity because it averages earlier weeks before the abrupt rise.", "Absolute insulin loss drives lipolysis, ketones, acidosis, and DKA.", "Concurrent thyroid, adrenal, pituitary, hepatic, or other immune toxicities can change symptoms and treatment safety."],
      etiology: "Associated agents include anti-PD-1, anti-PD-L1, and some combination immune checkpoint regimens. It is uncommon and unpredictable; absence of ordinary type 2 risk does not protect against it. PI3K-alpha and mTOR inhibitor hyperglycemia have different nonautoimmune mechanisms and should not be merged with this card.",
      riskFactors: ["Current or recent checkpoint inhibitor therapy", "Combination immunotherapy", "Personal or family autoimmunity or susceptible HLA background, though many affected people lack known risk", "New hyperglycemia with low C-peptide", "Other immune-related endocrine adverse events"],
      signsSymptoms: ["Abrupt thirst, urination, weight loss, fatigue, blurred vision, or dehydration", "Nausea, vomiting, abdominal pain, deep breathing, ketones, and altered consciousness with DKA", "Glucose can be newly severe while A1C is only modestly elevated", "Headache, hypotension, weakness, thyroid symptoms, or jaundice may signal concurrent immune toxicity"],
      diagnostics: ["Check glucose before treatment, at each oncology visit, and whenever symptoms occur during or after therapy according to ADA guidance.", "Evaluate ketones, electrolytes, bicarbonate or venous pH, kidney function, and hydration immediately when hyperglycemia is symptomatic.", "Measure C-peptide with glucose and islet antibodies, but do not delay insulin or DKA care for results.", "Assess cortisol, thyroid, pituitary, liver, and other systems when symptoms suggest additional immune toxicity.", "Distinguish PI3K-alpha inhibitor resistance and steroid hyperglycemia from checkpoint-mediated insulin loss."],
      treatments: ["Treat DKA with protocol-directed fluids, insulin, potassium and electrolyte monitoring, and oncology-endocrine coordination.", "Begin physiologic insulin replacement when deficiency is established; most patients require ongoing basal-bolus or pump therapy.", "Treat concurrent immune adverse events according to the relevant specialty; steroids generally do not restore destroyed beta cells and can worsen glucose.", "Let oncology determine immunotherapy interruption or continuation based on cancer benefit and overall toxicity.", "Provide CGM, hypoglycemia, glucagon, ketone, and sick-day education when appropriate."],
      contraindications: ["Do not wait for a very high A1C before suspecting abrupt insulin deficiency.", "Do not exclude the diagnosis because autoantibodies are negative.", "Do not stop immunotherapy independently.", "Do not expect high-dose steroids to reverse established beta-cell destruction."],
      nursingPriorities: ["Screen and document glucose at oncology visits and ask directly about thirst, urine, weight, nausea, and fatigue.", "Treat any ketotic presentation as an emergency and notify oncology and endocrine teams.", "Check for concurrent adrenal, thyroid, pituitary, hepatic, neurologic, or cardiac immune toxicity.", "Ensure continuous basal insulin and teach a complete type 1-style safety plan.", "Document the specific checkpoint agent, last dose, onset, C-peptide, antibodies, and oncology plan."],
      redFlags: ["Ketones, vomiting, abdominal pain, deep breathing, dehydration, or confusion", "New insulin deficiency during or after checkpoint therapy", "Hypotension, severe headache, hyponatremia, weakness, or other endocrine-crisis concern", "Patient stopping cancer therapy or insulin without coordinated guidance"],
      complications: ["DKA and permanent insulin deficiency", "Severe hypoglycemia during insulin transition", "Concurrent immune-related organ toxicity", "Cancer-treatment disruption or delayed diagnosis"],
      prognosis: "Beta-cell loss is usually permanent even if checkpoint therapy stops. With insulin and education, glucose can be managed; cancer prognosis and other immune toxicities remain separate major determinants.",
      prevention: "No reliable prevention exists. Baseline and every-visit glucose surveillance, symptom education, and immediate ketone evaluation reduce diagnostic delay and DKA severity.",
      patientEducation: ["This is an immune side effect that can remove insulin quickly, even when earlier glucose was normal.", "Do not stop either insulin or cancer therapy without the teams' plan.", "Keep ketone and hypoglycemia supplies and follow type 1 sick-day rules.", "Report thirst, urination, weight loss, vomiting, abdominal pain, or deep breathing immediately."],
      nclexTraps: ["A modest A1C can coexist with severe new DKA.", "Negative antibodies do not exclude checkpoint-associated diabetes.", "PI3K inhibitor hyperglycemia is a different mechanism.", "Steroids used for other immune toxicities can worsen glucose but usually do not restore beta cells."],
      relatedTopics: ["Medication- or chemical-induced diabetes mellitus", "Diabetic ketoacidosis", "Type 1 diabetes mellitus", "Pembrolizumab", "Nivolumab", "Immune-related adverse events"],
      aliases: ["checkpoint inhibitor diabetes", "ICI diabetes", "immunotherapy-induced diabetes", "PD-1 diabetes", "PD-L1 diabetes", "pembrolizumab diabetes", "nivolumab diabetes", "checkpoint inhibitor DKA"],
      abbreviations: ["ICI-DM", "CIADM"],
      commonMisspellings: ["check point inhibitor diabetes", "imunotherapy diabetes", "pembrolizimab diabetis"],
      tags: ["immune checkpoint inhibitor", "PD-1", "PD-L1", "abrupt insulin deficiency", "DKA", "oncology"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ada-crises-2024"]
    }),

    card({
      name: "Antipsychotic-associated diabetes mellitus",
      category: "Endocrinology and Psychiatry - Medication-Associated Diabetes",
      definition: "Antipsychotic-associated diabetes mellitus is diabetes that develops or worsens during antipsychotic treatment, particularly with some second-generation agents. Risk can involve increased appetite and weight, altered lipid and adipose signaling, hepatic and peripheral insulin resistance, and possible direct beta-cell effects. The association is clinically important, but psychiatric stability and metabolic safety must be managed together rather than stopping treatment abruptly.",
      pathology: "Different antipsychotics have different metabolic effects. Increased appetite and weight can raise insulin demand, while changes in insulin signaling and hepatic glucose output may raise glucose before major weight change. Serious mental illness itself is associated with sleep, stress, food access, activity, and healthcare barriers that also influence risk; attributing everything to one drug oversimplifies the mechanism.",
      pathophysiology: ["Receptor effects can increase appetite and change satiety and energy balance.", "Adipose and hepatic insulin resistance increase after-meal and fasting glucose.", "Beta-cell reserve determines whether compensation succeeds.", "Stopping medication abruptly can destabilize psychosis or mood, which may create greater immediate danger and further impair diabetes care."],
      etiology: "Second-generation antipsychotics are the main medication context, but risk varies by agent and patient. Baseline metabolic disease, family history, sleep, tobacco, socioeconomic barriers, and concurrent medicines contribute. A temporal rise supports association but does not prove the drug is the only cause.",
      riskFactors: ["Prediabetes, prior GDM, family history, or metabolic syndrome", "Higher-risk antipsychotic agent, dose change, or polypharmacy", "Rapid weight or waist increase", "Sleep disruption, food insecurity, low activity, or tobacco exposure", "Limited access to primary and metabolic care"],
      signsSymptoms: ["Often asymptomatic until screening", "Weight, appetite, waist, lipid, or glucose change", "Polyuria, thirst, fatigue, blurred vision, recurrent infection", "Rare severe hyperglycemia, DKA, or HHS"],
      diagnostics: ["Obtain baseline weight and metabolic screening as clinically feasible.", "ADA recommends diabetes screening at baseline, again 12-16 weeks after initiation, and annually, or sooner when indicated.", "Monitor weight, glycemia, and lipids every 12-16 weeks after changes according to current behavioral guidance.", "Assess symptoms, family history, food access, activity, sleep, and other medicines.", "Confirm diabetes and assess crisis severity using standard criteria."],
      treatments: ["Continue psychiatric treatment while psychiatry, primary care, pharmacy, and endocrine teams evaluate safer options.", "Use person-centered nutrition, activity, sleep, and glucose therapy without stigmatizing weight or mental illness.", "Consider switching to a lower-metabolic-risk agent only through shared psychiatric decision-making.", "Treat DKA or HHS urgently and use insulin when severe hyperglycemia requires it.", "Support medication adherence, follow-up, and simplified monitoring."],
      contraindications: ["Do not abruptly stop antipsychotic medication.", "Do not blame all risk on behavior or body weight.", "Do not omit scheduled 12-16 week and annual screening because the patient appears well.", "Do not allow metabolic concerns to be ignored because psychiatric illness is severe, or psychiatric risk to be ignored because glucose is high."],
      nursingPriorities: ["Track weight, waist when used, glucose, A1C in context, lipids, blood pressure, appetite, activity, and psychiatric stability.", "Ask about polyuria, thirst, infection, medication adherence, sedation, and food access.", "Coordinate lab appointments and communicate trends to psychiatry and primary care.", "Teach simple low- and high-glucose plans compatible with cognitive and social needs.", "Escalate crisis symptoms, inability to care for self, suicidality, severe psychosis, or medication discontinuation."],
      redFlags: ["DKA/HHS symptoms or severe dehydration", "Abrupt medication cessation with psychosis, mania, suicidality, or unsafe behavior", "Rapid glucose and weight change after initiation", "Severe low from newly added glucose therapy"],
      complications: ["Type 2 phenotype diabetes, dyslipidemia, cardiovascular disease, and fatty liver", "DKA, HHS, and hypoglycemia", "Psychiatric relapse from uncoordinated switching", "Stigma, fragmented care, and reduced treatment adherence"],
      prognosis: "Metabolic risk can often be reduced through monitoring, treatment, and sometimes a coordinated medication change. Some diabetes persists despite switching because underlying susceptibility remains.",
      prevention: "Baseline, 12-16 week, and annual monitoring; early response to weight or glucose trends; and integrated psychiatric-metabolic care reduce harm while preserving psychiatric treatment.",
      patientEducation: ["The medicine and other factors may raise diabetes risk, but do not stop it suddenly.", "Keep the 12-16 week and yearly glucose and lipid checks.", "Tell the team about thirst, urination, blurred vision, infection, or rapid weight change.", "Ask for one coordinated plan that protects both mental and metabolic health."],
      nclexTraps: ["Psychiatric medication safety and glucose safety are simultaneous priorities.", "Metabolic change can occur before dramatic weight gain.", "Screening continues even without symptoms.", "A medication switch is a psychiatric-team decision, not an independent nursing or patient action."],
      relatedTopics: ["Medication- or chemical-induced diabetes mellitus", "Type 2 diabetes mellitus", "Metabolic syndrome", "Olanzapine", "Clozapine", "Hyperosmolar hyperglycemic state"],
      aliases: ["antipsychotic diabetes", "atypical antipsychotic diabetes", "second generation antipsychotic diabetes", "olanzapine diabetes", "clozapine diabetes", "antipsychotic high sugar"],
      abbreviations: ["SGA-associated DM"],
      commonMisspellings: ["antipsycotic diabetes", "olanzepine diabetis", "clozepine high sugar"],
      tags: ["second-generation antipsychotic", "12-16 weeks", "metabolic monitoring", "psychiatric stability"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ada-behavior-2026"]
    }),

    card({
      name: "HIV-associated dysglycemia",
      category: "Endocrinology and Infectious Disease - Other Specific Diabetes",
      definition: "HIV-associated dysglycemia describes prediabetes or diabetes in a person with HIV when chronic inflammation, body-composition change, coinfection, aging, and selected antiretroviral exposures may contribute. It is not one uniform subtype and should not be used to blame effective antiretroviral therapy. Fasting plasma glucose is preferred for scheduled screening because A1C may underestimate glycemia in some people with HIV or altered red-cell indices.",
      pathology: "HIV-related inflammation and adipose dysfunction can increase insulin resistance, while some older or selected therapies alter fat distribution, mitochondrial function, or glucose handling. Modern ART has different profiles, and untreated HIV creates far greater danger. Macrocytosis, anemia, hemolysis, kidney disease, and therapy-related red-cell changes can uncouple A1C from actual glucose.",
      pathophysiology: ["Inflammation and altered adipose signaling can raise insulin demand.", "Therapy and aging modify lipids, weight, liver fat, and insulin action.", "Red-cell turnover can lower A1C relative to measured glucose, masking risk.", "Infection and opportunistic illness can acutely raise glucose while poor intake raises hypoglycemia risk during treatment."],
      etiology: "Usually multifactorial: ordinary type 2 susceptibility, HIV inflammation, body-composition change, hepatitis or liver disease, medicines, and social determinants. Autoimmune, pancreatic, steroid, and other secondary causes remain possible.",
      riskFactors: ["Prediabetes, family history, prior GDM, age, or metabolic syndrome", "Selected current or prior antiretroviral exposure", "Lipodystrophy or major body-composition change", "Hepatitis, liver disease, kidney disease, or glucocorticoid exposure", "Food insecurity, tobacco, sleep disruption, or limited preventive care"],
      signsSymptoms: ["Often asymptomatic", "Polyuria, thirst, fatigue, blurred vision, infection, or slow healing", "Central fat gain or peripheral fat loss in some lipodystrophy phenotypes", "Discordant normal or modest A1C despite elevated fasting or home glucose"],
      diagnostics: ["ADA recommends fasting plasma glucose before starting ART, when switching ART, and 3-6 months afterward, then annually if normal.", "Use plasma glucose criteria when A1C is likely discordant in HIV or altered red-cell states.", "Review ART history, steroids, opportunistic infection, hepatitis, lipids, body composition, renal and liver function.", "Confirm persistent diabetes by standard criteria and consider ordinary type 1 or type 2 mechanisms.", "Assess cardiovascular and kidney risk and medication interactions."],
      treatments: ["Continue effective ART unless the HIV team deliberately changes it.", "Treat diabetes according to mechanism, organ function, cardiovascular risk, interactions, and access.", "Address infection, hepatitis, lipids, tobacco, nutrition, and body-composition concerns.", "Coordinate pharmacy review before any ART or diabetes medicine change.", "Use insulin during severe illness or marked hyperglycemia when needed."],
      contraindications: ["Do not stop ART independently.", "Do not rely on A1C alone when it conflicts with glucose.", "Do not label all HIV-associated diabetes as drug-induced.", "Do not ignore interaction, renal, hepatic, and infection considerations."],
      nursingPriorities: ["Track fasting glucose at guideline intervals and compare A1C with measured glucose.", "Reconcile ART, steroids, and diabetes medicines for interactions.", "Assess adherence, infection, nutrition, body-composition change, renal and liver function.", "Protect confidentiality and use non-stigmatizing language.", "Coordinate HIV, primary, pharmacy, and endocrine follow-up."],
      redFlags: ["DKA/HHS symptoms, severe dehydration, or altered consciousness", "Acute infection or opportunistic disease with worsening glucose", "ART interruption", "Major A1C-glucose discordance causing delayed treatment"],
      complications: ["Standard diabetes vascular and neurologic complications", "Cardiovascular and liver risk", "Medication interaction or toxicity", "HIV progression from interrupted ART"],
      prognosis: "Outcomes are best when HIV remains suppressed and metabolic disease is recognized with appropriate glucose testing. Diabetes may persist even after an ART change because mechanisms are multifactorial.",
      prevention: "Use fasting-glucose screening before and after ART changes and annually, support feasible cardiometabolic health, and choose regimens through HIV specialist risk-benefit review.",
      patientEducation: ["Keep taking ART unless your HIV clinician changes it.", "A1C can underestimate glucose in some people with HIV, so fasting testing matters.", "Ask for interaction review before starting supplements or diabetes medicine.", "Report thirst, urination, weight loss, infection, vomiting, or confusion."],
      nclexTraps: ["A1C can be falsely reassuring in HIV.", "ART benefit generally outweighs metabolic risk.", "Not all diabetes in HIV is medication-induced.", "Fasting glucose screening is required around ART changes."],
      relatedTopics: ["Medication- or chemical-induced diabetes mellitus", "Type 2 diabetes mellitus", "Lipodystrophy-associated diabetes mellitus", "HIV", "Antiretroviral therapy", "Hemoglobin A1c"],
      aliases: ["HIV diabetes", "HIV-associated diabetes", "ART-associated diabetes", "antiretroviral diabetes", "HIV high blood sugar", "protease inhibitor diabetes"],
      abbreviations: ["HIV-DM", "ART"],
      commonMisspellings: ["antiretroviral diabetis", "HIV diabtes", "protease inhibiter diabetes"],
      tags: ["HIV", "ART", "fasting plasma glucose", "A1C underestimation", "drug interactions"],
      sourceKeys: ["w41-ada-classification-2026"]
    }),

    card({
      name: "PI3K inhibitor-induced hyperglycemia",
      category: "Endocrinology and Oncology - Treatment-Associated Hyperglycemia",
      definition: "PI3K inhibitor-induced hyperglycemia is a predictable on-target effect of PI3K-alpha cancer therapy such as alpelisib or inavolisib. Blocking insulin's PI3K signaling reduces glucose uptake and increases hepatic glucose output, producing rapid insulin resistance. It is not autoimmune checkpoint-inhibitor diabetes, and aggressive insulin use can sometimes create rebound lows when the drug is held because the resistance can fall quickly.",
      pathology: "Insulin receptor signaling normally activates PI3K-AKT pathways that move glucose transporters and suppress liver glucose production. PI3K-alpha inhibition interrupts that signal. The pancreas responds with more insulin, but susceptible patients cannot compensate. Drug exposure and breaks create fast changes, so glucose therapy must track the oncology schedule.",
      pathophysiology: ["PI3K blockade directly impairs insulin signaling.", "Hepatic glucose output rises and peripheral uptake falls.", "Compensatory hyperinsulinemia may be inadequate and could theoretically stimulate tumor pathways, shaping treatment strategy.", "Holding the inhibitor removes resistance quickly, so insulin given for the active-drug state may become excessive."],
      etiology: "The effect is associated with PI3K-alpha inhibitors used in selected cancers. Baseline prediabetes, type 2 risk, higher glucose, and concurrent steroids increase severity. mTOR inhibitors also cause hyperglycemia but through overlapping rather than identical mechanisms.",
      riskFactors: ["Prediabetes, diabetes, higher BMI, family history, or older age", "PI3K-alpha inhibitor initiation or escalation", "Concurrent glucocorticoid, infection, or nutrition stress", "Limited glucose-monitoring access", "Kidney or liver dysfunction affecting treatment options"],
      signsSymptoms: ["Rapid fasting or post-meal glucose rise after therapy begins", "Thirst, polyuria, fatigue, blurred vision, dehydration", "HHS or ketosis when severe, though autoimmune insulin loss is not the expected mechanism", "Hypoglycemia after the inhibitor is held while insulin continues"],
      diagnostics: ["Check fasting or random glucose and A1C before therapy.", "ADA recommends random glucose weekly for the first two weeks and then every four weeks during PI3K-alpha therapy, with periodic A1C consideration.", "Monitor more frequently when glucose rises or steroids are added.", "Assess ketones, electrolytes, hydration, and osmolality in severe symptomatic cases.", "Distinguish from checkpoint inhibitor insulin deficiency with C-peptide and antibodies when the clinical course is abrupt or ketotic."],
      treatments: ["Coordinate nutrition and glucose-lowering therapy with oncology and current protocol.", "Use mechanism-appropriate noninsulin treatment when safe; insulin may be necessary for severe glucose but requires close adjustment around drug holds.", "Treat HHS/DKA urgently.", "Do not change cancer dosing independently.", "Reassess rapidly after interruption because resistance can fall."],
      contraindications: ["Do not confuse this with autoimmune checkpoint diabetes.", "Do not continue the active-drug insulin dose unchanged through a PI3K inhibitor hold.", "Do not stop cancer therapy independently.", "Do not delay treatment of severe symptomatic hyperglycemia."],
      nursingPriorities: ["Map glucose against each cancer dose, hold, steroid, and meal.", "Verify the oncology threshold and communication plan.", "Watch for lows after holds and highs after restarts.", "Assess hydration, ketones, infection, and treatment adherence.", "Teach the patient to call before independently changing either cancer or glucose medicine."],
      redFlags: ["Severe dehydration, confusion, ketones, vomiting, or extreme glucose", "Hypoglycemia after treatment hold", "Cancer therapy changed without oncology direction", "Abrupt insulin-deficient pattern suggesting checkpoint toxicity or another diagnosis"],
      complications: ["HHS, ketosis, dehydration, and electrolyte disturbance", "Hypoglycemia during drug interruptions", "Cancer-treatment delay", "Persistent diabetes in predisposed people"],
      prognosis: "Hyperglycemia is often temporally linked to exposure and may improve when therapy ends, but underlying susceptibility can persist. Successful management preserves cancer treatment while preventing metabolic crisis.",
      prevention: "Baseline risk assessment, early weekly monitoring, preplanned treatment, and rapid adjustment around holds prevent severe events.",
      patientEducation: ["This cancer drug blocks part of insulin signaling, so glucose may rise quickly.", "Follow the exact early monitoring schedule.", "Call before changing insulin when the cancer drug is held or restarted.", "Report severe thirst, vomiting, confusion, ketones, or any low immediately."],
      nclexTraps: ["PI3K hyperglycemia is on-target insulin resistance, not typical autoimmune beta-cell destruction.", "The first two weeks need especially close monitoring.", "Drug holds can rapidly reduce insulin need.", "Oncology controls cancer-treatment decisions."],
      relatedTopics: ["Medication- or chemical-induced diabetes mellitus", "Immune checkpoint inhibitor-associated diabetes", "Alpelisib", "Inavolisib", "Hyperosmolar hyperglycemic state"],
      aliases: ["PI3K diabetes", "PI3K inhibitor hyperglycemia", "alpelisib hyperglycemia", "alpelisib diabetes", "inavolisib high sugar", "PI3K-alpha inhibitor diabetes"],
      abbreviations: ["PI3Ki hyperglycemia"],
      commonMisspellings: ["alpelisib hyperglycemai", "PI3K inhibiter diabetes", "inavolisib diabetis"],
      tags: ["PI3K-alpha", "alpelisib", "on-target insulin resistance", "oncology", "drug hold"],
      sourceKeys: ["w41-ada-classification-2026"]
    }),

    card({
      name: "Endocrinopathy-associated diabetes mellitus",
      category: "Endocrinology - Other Specific Diabetes",
      definition: "Endocrinopathy-associated diabetes mellitus is secondary diabetes caused or amplified by excess counterregulatory hormones or another endocrine disorder. Cushing syndrome, acromegaly, pheochromocytoma, glucagonoma, somatostatinoma, and some thyroid disorders can raise hepatic glucose output, insulin resistance, or both. The glucose pattern is a consequence and a complication; treating only glucose while missing the hormone disorder leaves the causal physiology active.",
      pathology: "Cortisol increases gluconeogenesis and resistance; growth hormone opposes insulin and promotes lipolysis; catecholamines stimulate glycogenolysis and inhibit insulin release; glucagon directly raises hepatic glucose production; somatostatin suppresses insulin and other gut hormones. Severity depends on hormone level, duration, beta-cell reserve, and coexisting type 2 susceptibility.",
      pathophysiology: ["Hormone excess raises glucose supply or blocks insulin action.", "Beta cells compensate until reserve is exceeded.", "Hyperglycemia feeds back through glucotoxicity and may persist after cure if beta-cell damage is advanced.", "Definitive endocrine treatment can abruptly lower insulin need, making hypoglycemia a predictable transition risk."],
      etiology: "Causes include endogenous cortisol excess, growth-hormone excess, catecholamine-secreting tumors, glucagonoma, somatostatinoma, hyperthyroidism and rarer endocrine states. Exogenous glucocorticoids belong on the steroid-induced card. Symptoms and biochemical testing must guide evaluation because nonspecific screening can create false positives.",
      riskFactors: ["Cushingoid phenotype, pituitary or adrenal disease", "Acral growth, sleep apnea, headaches, or visual-field symptoms", "Episodic headache, palpitations, diaphoresis, and labile hypertension", "Necrolytic migratory erythema, weight loss, gallstones, or other neuroendocrine-tumor clues", "New difficult diabetes with an endocrine tumor or hormone abnormality"],
      signsSymptoms: ["Usual hyperglycemia symptoms", "Purple striae, proximal weakness, bruising, or cushingoid changes", "Enlarged hands or jaw, sweating, sleep apnea, headache, or visual change in acromegaly", "Paroxysmal headache, palpitations, diaphoresis and hypertension in pheochromocytoma", "Characteristic rash, diarrhea, weight loss, gallstones, or nutritional findings with rare pancreatic endocrine tumors"],
      diagnostics: ["Confirm diabetes and identify a coherent endocrine phenotype before ordering specialized tests.", "Use syndrome-specific hormone testing with attention to timing, stress, medicines, and confirmatory protocols.", "Image only after biochemical and clinical reasoning supports it, except in an emergency.", "Assess diabetes reserve and complications while the hormone workup proceeds.", "Recheck glucose treatment after endocrine therapy."],
      treatments: ["Treat dangerous hyperglycemia with insulin or other appropriate therapy.", "Treat the hormone-producing tumor or endocrine disorder with specialist-directed surgery, medicine, radiation, or combined care.", "Prepare for rapid glucose improvement after causal treatment.", "Manage blood pressure, electrolytes, infection, thrombosis, cardiac, and perioperative risks specific to the syndrome.", "Continue complication surveillance if diabetes persists."],
      contraindications: ["Do not label nonspecific weight gain or hypertension Cushing syndrome without proper testing.", "Do not manipulate a suspected pheochromocytoma or give isolated beta blockade before adequate alpha control.", "Do not forget to reduce glucose therapy after successful endocrine treatment.", "Do not confuse exogenous steroid diabetes with endogenous Cushing syndrome."],
      nursingPriorities: ["Assess syndrome-specific findings and document their timeline with glucose.", "Monitor pressure, pulse, electrolytes, glucose, and organ-specific danger.", "Prepare and teach around endocrine testing conditions.", "Coordinate perioperative glucose and hormone-replacement plans.", "Watch closely for hypoglycemia when hormone excess is corrected."],
      redFlags: ["Catecholamine crisis, severe hypertension, chest pain, pulmonary edema, arrhythmia, or focal deficit", "Adrenal crisis after treatment or steroid withdrawal", "Visual loss, pituitary apoplexy, severe headache, or altered consciousness", "DKA/HHS or severe low during treatment transition"],
      complications: ["Persistent diabetes and vascular complications", "Cardiovascular, thrombotic, infectious, and skeletal endocrine complications", "Tumor mass effect or metastasis", "Hypoglycemia after definitive treatment"],
      prognosis: "Glucose can improve substantially when hormone excess is cured, especially before beta-cell failure becomes fixed. Long duration, persistent tumor, and ordinary type 2 susceptibility make ongoing diabetes more likely.",
      prevention: "Most endogenous tumors are not preventable. Early recognition, medication review, and scheduled glucose monitoring in known endocrine disease prevent crisis and delayed classification.",
      patientEducation: ["The hormone disorder can raise glucose; both problems need care.", "Complete specialized tests exactly as instructed because timing and medicines affect results.", "Expect diabetes doses to change after endocrine treatment.", "Report crisis symptoms such as severe headache, chest pain, fainting, confusion, vomiting, or severe lows."],
      nclexTraps: ["Counterregulatory hormone excess can cause secondary diabetes.", "Biochemical confirmation generally precedes tumor localization.", "Pheochromocytoma requires alpha before beta blockade.", "Cure of the driver can rapidly lower insulin requirement."],
      relatedTopics: ["Secondary diabetes mellitus", "Cushing syndrome", "Acromegaly", "Pheochromocytoma", "Glucagonoma", "Somatostatinoma", "Glucocorticoid-induced diabetes mellitus"],
      aliases: ["endocrine diabetes", "hormone-induced diabetes", "diabetes from hormone excess", "Cushing diabetes", "acromegaly diabetes", "pheochromocytoma diabetes"],
      abbreviations: ["EDM"],
      commonMisspellings: ["endocrinopathy diabetis", "hormone excess diabtes", "endocrine diabeties"],
      tags: ["cortisol", "growth hormone", "catecholamine", "glucagon", "secondary diabetes"],
      sourceKeys: ["w41-ada-classification-2026"]
    }),

    card({
      name: "Lipodystrophy-associated diabetes mellitus",
      category: "Endocrinology and Genetics - Severe Insulin Resistance",
      definition: "Lipodystrophy-associated diabetes mellitus is severe insulin-resistant diabetes caused by congenital or acquired loss or abnormal distribution of adipose tissue. When safe subcutaneous fat storage is absent, triglycerides accumulate in liver and muscle, leptin may be deficient, appetite and hepatic glucose output rise, and ordinary insulin doses may be inadequate. It is not simply being lean and it is not the localized dents that can occur at insulin injection sites.",
      pathology: "Adipose tissue is an endocrine storage organ. In generalized or partial lipodystrophy, limited storage sends fatty acids to ectopic sites, causing severe insulin resistance, fatty liver, hypertriglyceridemia, and pancreatitis risk. Low leptin in selected generalized forms increases hunger and metabolic dysfunction. Acquired forms may follow autoimmunity or other disease; familial forms have diverse genes.",
      pathophysiology: ["Inadequate adipose capacity diverts lipid into liver and skeletal muscle.", "Ectopic lipid interferes with insulin signaling and drives hepatic glucose production.", "Hypertriglyceridemia can cause pancreatitis, adding pancreatic insulin deficiency.", "Leptin deficiency alters appetite and neuroendocrine signaling in selected generalized disease."],
      etiology: "Congenital generalized, familial partial, acquired generalized, and acquired partial lipodystrophy have distinct causes. HIV-associated body-composition change and rare autoimmune or genetic disorders are part of the differential. Clinical fat distribution and metabolic severity guide genetic and specialist evaluation.",
      riskFactors: ["Generalized or regional absence of subcutaneous fat", "Muscular appearance with prominent veins, acanthosis, or disproportionate central fat", "Very high triglycerides, fatty liver, early diabetes, or pancreatitis", "Family history or childhood onset", "Autoimmune disease, panniculitis, or acquired progressive fat loss"],
      signsSymptoms: ["Abnormal fat distribution rather than ordinary low weight", "Acanthosis, severe hyperglycemia, high insulin requirement, eruptive xanthomas", "Hepatomegaly or fatty liver, hypertriglyceridemia, pancreatitis", "Reproductive, renal, cardiac, or muscular findings depending on subtype"],
      diagnostics: ["Perform a careful body-fat distribution examination and longitudinal photo or history review.", "Measure glucose, lipids, liver and kidney status and assess pancreatitis risk.", "Use DXA or MRI body-composition assessment when specialist evaluation requires it.", "Pursue genetic testing or autoimmune evaluation according to phenotype; a negative panel does not erase a convincing acquired syndrome.", "Distinguish generalized/partial lipodystrophy from anorexia, uncontrolled diabetes weight loss, Cushing phenotype, and ordinary central obesity."],
      treatments: ["Use intensive nutrition and activity plans that lower metabolic risk without worsening inadequate energy intake.", "Treat diabetes and hypertriglyceridemia aggressively; very high insulin doses or concentrated insulin may require specialist safety systems.", "Use metreleptin in eligible generalized or selected patients according to regulatory indication and specialty guidance.", "Treat fatty liver, pancreatitis risk, renal and reproductive complications.", "Provide genetic counseling and multidisciplinary follow-up."],
      contraindications: ["Do not diagnose lipodystrophy from leanness alone.", "Do not confuse injection-site lipoatrophy or lipohypertrophy with systemic lipodystrophy syndrome.", "Do not use concentrated insulin without device, dose, and unit safeguards.", "Do not overlook pancreatitis when triglycerides and abdominal pain are severe."],
      nursingPriorities: ["Document fat distribution, skin, acanthosis, waist and limb changes, glucose, insulin dose, triglycerides, liver and pain symptoms.", "Verify concentrated-insulin units and device with independent checks.", "Assess nutrition, stigma, body image, reproductive health, and access to specialty medicine.", "Teach pancreatitis and hypoglycemia warning signs.", "Coordinate endocrine, lipid, liver, genetics, nutrition, and mental-health care."],
      redFlags: ["Severe abdominal pain, vomiting, or pancreatitis concern with extreme triglycerides", "DKA/HHS or severe dehydration", "Concentrated-insulin dosing error or severe low", "Rapid liver, renal, or cardiac deterioration"],
      complications: ["Severe diabetes, hypertriglyceridemia, and recurrent pancreatitis", "Fatty liver, steatohepatitis, cirrhosis, and cardiovascular disease", "Kidney, reproductive, cardiac, and growth complications by subtype", "Stigma and medication-access barriers"],
      prognosis: "Metabolic complications can be severe at young ages, but early recognition and mechanism-specific therapy reduce pancreatitis and organ injury. Prognosis varies widely by subtype and organ involvement.",
      prevention: "Inherited disease is not preventable; acquired harm may be reduced through early recognition and treatment. Prevent crises through triglyceride control, safe insulin systems, and liver surveillance.",
      patientEducation: ["Lipodystrophy is a disorder of fat storage, not a judgment about appearance.", "Very high triglycerides can inflame the pancreas; report severe abdominal pain.", "Confirm every concentrated-insulin dose in units and device.", "Keep liver, lipid, kidney, reproductive, and genetic follow-up."],
      nclexTraps: ["Adipose loss can cause extreme insulin resistance despite a lean appearance.", "Injection-site changes are not the same as systemic lipodystrophy.", "Hypertriglyceridemia links lipodystrophy to pancreatitis and then possible pancreatic diabetes.", "Metreleptin eligibility is subtype- and jurisdiction-specific."],
      relatedTopics: ["Secondary diabetes mellitus", "Severe insulin resistance syndromes", "Hypertriglyceridemia", "Acute pancreatitis", "Fatty liver disease", "HIV-associated dysglycemia"],
      aliases: ["lipodystrophy diabetes", "lipoatrophic diabetes", "diabetes from lipodystrophy", "congenital generalized lipodystrophy diabetes", "familial partial lipodystrophy diabetes"],
      abbreviations: ["LD-DM", "CGL", "FPLD"],
      commonMisspellings: ["lipodistrophy diabetes", "lipoatrofic diabetis", "partial lipodystrophy diabtes"],
      tags: ["ectopic fat", "leptin", "severe insulin resistance", "hypertriglyceridemia", "fatty liver"],
      sourceKeys: ["w41-ada-classification-2026", "w41-lipodystrophy-guideline"]
    }),

    card({
      name: "Severe insulin resistance syndromes",
      category: "Endocrinology and Genetics - Other Specific Diabetes",
      definition: "Severe insulin resistance syndromes are rare genetic or acquired disorders in which insulin signaling is profoundly impaired beyond ordinary type 2 resistance. They include insulin-receptor disorders such as type A insulin resistance, Donohue syndrome, and Rabson-Mendenhall syndrome, and autoimmune type B insulin resistance. Extreme insulin levels, striking acanthosis, hyperandrogenism, unusual growth or facial features, lipodystrophy, or alternating hyperglycemia and hypoglycemia are clues.",
      pathology: "Pathogenic insulin-receptor variants reduce receptor number or signaling, so even very high insulin cannot move glucose normally or suppress hepatic output. Type B disease uses autoantibodies that can block or sometimes stimulate the receptor, causing severe hyperglycemia or paradoxical hypoglycemia. Ovarian insulin signaling can drive androgen excess, while extreme insulin activates related growth pathways and produces acanthosis.",
      pathophysiology: ["Receptor or post-receptor failure forces beta cells to produce extreme insulin levels.", "High insulin cross-activates growth pathways, thickening pigmented skin and altering ovarian steroid production.", "Beta cells can eventually fail, producing overt diabetes.", "Autoantibody behavior in type B can shift, causing alternating resistance and hypoglycemia."],
      etiology: "Genetic INSR and related signaling disorders often present young and may be syndromic. Type B insulin resistance is acquired and often associated with autoimmune disease. Lipodystrophy creates a different severe-resistance mechanism and has its own card.",
      riskFactors: ["Very early or disproportionate insulin resistance", "Extreme fasting insulin or insulin dose requirement", "Severe acanthosis without ordinary metabolic explanation", "Hyperandrogenism, growth abnormality, dysmorphic features, or family pattern", "Systemic autoimmune disease with abrupt severe resistance or spontaneous lows"],
      signsSymptoms: ["Severe acanthosis, skin tags, muscular or unusual habitus", "Hyperandrogenism, irregular menses, ovarian enlargement", "Failure to thrive or growth and facial abnormalities in severe congenital forms", "Extreme hyperglycemia, ketosis, or alternating fasting hypoglycemia in type B disease"],
      diagnostics: ["Confirm glucose and quantify insulin resistance in context; assay interpretation requires specialist expertise.", "Examine fat distribution to separate receptor disorders from lipodystrophy.", "Use genetic testing and counseling for suspected inherited disease.", "Evaluate autoimmune disease and insulin-receptor antibodies in suspected type B disease through specialist laboratories.", "Exclude assay interference, exogenous insulin, endocrine hormone excess, and medication effects."],
      treatments: ["Use specialist-directed high-dose insulin or sensitizing therapy with rigorous dose safeguards.", "Treat autoimmune type B disease with coordinated immunomodulation when indicated.", "Treat hyperandrogenism, nutrition, growth, and organ complications.", "Use concentrated insulin only with explicit device and unit systems.", "Provide genetic and psychosocial support."],
      contraindications: ["Do not label ordinary difficult type 2 diabetes a receptor syndrome without evidence.", "Do not give concentrated insulin using volume-only communication.", "Do not assume all acanthosis means the same severity or cause.", "Do not miss spontaneous hypoglycemia in type B disease."],
      nursingPriorities: ["Verify insulin concentration, units, device, administration site, and independent checks.", "Assess acanthosis, fat distribution, growth, reproductive and autoimmune findings.", "Trend glucose for both extreme highs and unexpected lows.", "Coordinate genetic, endocrine, rheumatology, nutrition, and reproductive care.", "Address stigma and teach family-specific emergency plans."],
      redFlags: ["Concentrated-insulin error", "DKA/HHS or severe dehydration", "Unexpected severe fasting hypoglycemia", "Autoimmune organ crisis or rapid catabolism"],
      complications: ["Severe diabetes and hypoglycemia", "Cardiovascular, liver, ovarian, renal, and growth complications", "Medication dosing error", "Psychosocial and genetic-family burden"],
      prognosis: "Prognosis varies from life-threatening congenital syndromes to manageable adult disease. Type B can improve with immune control but may fluctuate. Experienced specialty care is essential.",
      prevention: "Inherited forms cannot be prevented. Early recognition prevents unsafe dose escalation and permits family counseling; autoimmune disease monitoring may identify type B earlier.",
      patientEducation: ["This is a signaling disorder, not simply poor diet or ordinary type 2 diabetes.", "State insulin concentration and units every time.", "Know signs of both high and low glucose.", "Family and autoimmune evaluation may be part of care."],
      nclexTraps: ["Extreme insulin resistance can occur without obesity.", "Type B disease is autoimmune and can cause hypoglycemia as well as resistance.", "Lipodystrophy is a distinct cause of severe resistance.", "Concentrated insulin requires unit-based safety communication."],
      relatedTopics: ["Lipodystrophy-associated diabetes mellitus", "Secondary diabetes mellitus", "Acanthosis nigricans", "Concentrated insulin", "Hypoglycemia", "Type B insulin resistance"],
      aliases: ["genetic insulin resistance", "insulin receptor diabetes", "type A insulin resistance", "type B insulin resistance", "Donohue syndrome diabetes", "Rabson-Mendenhall syndrome", "extreme insulin resistance"],
      abbreviations: ["SIRS", "INSR"],
      commonMisspellings: ["severe insulin resistence syndrome", "insulin recepter diabetes", "Rabson Mendenhal"],
      tags: ["INSR", "type A insulin resistance", "type B insulin resistance", "acanthosis", "concentrated insulin"],
      sourceKeys: ["w41-ada-classification-2026", "w41-lipodystrophy-guideline"]
    }),

    card({
      name: "Gestational diabetes insipidus",
      category: "Obstetrics and Endocrinology - Water Balance Disorder",
      definition: "Gestational diabetes insipidus is a rare temporary pregnancy-related water-balance disorder, not gestational diabetes mellitus. Placental vasopressinase breaks down the pregnant person's arginine vasopressin faster than it can act, so the kidneys cannot concentrate urine. The result is very high-volume dilute urine, intense thirst, dehydration, and possible hypernatremia while blood glucose may be normal.",
      pathology: "The enlarging placenta produces vasopressinase, an enzyme that degrades endogenous vasopressin. Multiple gestation increases placental mass; preeclampsia, HELLP syndrome, and liver dysfunction can reduce enzyme clearance. Desmopressin resists placental vasopressinase, which explains why it can replace the missing antidiuretic effect when prescribed.",
      pathophysiology: ["Excess vasopressin breakdown reduces collecting-duct water reabsorption.", "Large volumes of dilute urine remove free water faster than sodium.", "Thirst and water access compensate until vomiting, illness, restricted access, or severe loss produces hypernatremia.", "Placental delivery removes the enzyme source, so the condition usually resolves but can recur in a later pregnancy."],
      etiology: "Pregnancy-related placental vasopressinase excess, amplified by multiple gestation or impaired hepatic clearance. Central or nephrogenic diabetes insipidus can also first become apparent in pregnancy and must be distinguished.",
      riskFactors: ["Multiple gestation or large placental mass", "Preeclampsia or HELLP syndrome", "Liver dysfunction that reduces vasopressinase clearance", "Prior gestational DI", "Pituitary or kidney disease affecting water balance"],
      signsSymptoms: ["Abrupt or progressive high-volume pale urine, nocturia, and unrelenting thirst", "Dehydration, weakness, dizziness, dry mucosa, tachycardia", "Hypernatremia causing irritability, confusion, seizure, or reduced consciousness", "Normal glucose and no glucosuria help separate it from gestational diabetes mellitus"],
      diagnostics: ["Measure serum sodium and osmolality, urine volume, osmolality and specific gravity, glucose, kidney function, calcium and potassium.", "Document true urine volume rather than relying on frequency alone.", "Evaluate preeclampsia, HELLP and liver disease urgently when clinically indicated.", "Use specialist-supervised dynamic testing or copeptin strategies when needed; unsupervised water deprivation is dangerous in pregnancy.", "Reassess postpartum to confirm resolution and identify underlying central or nephrogenic disease."],
      treatments: ["Ensure free-water access and replace deficit carefully according to sodium, volume and obstetric status.", "Use desmopressin when prescribed; placental vasopressinase does not rapidly destroy it.", "Treat preeclampsia, HELLP, liver disease or another driver.", "Monitor sodium, urine output, weight, fluid balance and fetal status.", "Reduce or stop desmopressin only with postpartum reassessment because needs usually fall after delivery."],
      contraindications: ["Do not confuse this with gestational diabetes mellitus or treat it with insulin.", "Do not restrict water from a patient with uncontrolled DI.", "Do not perform an unsupervised water-deprivation test.", "Do not continue unchanged desmopressin with low sodium, low urine output, headache, nausea, or postpartum resolution."],
      nursingPriorities: ["Strict timed intake and urine output, daily weight, thirst, neurologic and volume assessment.", "Trend sodium and osmolality and record desmopressin timing and response.", "Maintain reliable water access unless a supervised plan says otherwise.", "Assess blood pressure, headache, vision, upper abdominal pain, platelets and liver concerns for preeclampsia/HELLP.", "Teach postpartum reassessment and recurrence risk."],
      redFlags: ["Hypernatremia, confusion, seizure, syncope, or severe dehydration", "Headache, vision change, severe hypertension, upper abdominal pain, or HELLP concern", "Hyponatremia, headache, nausea, weight gain, or low urine output on desmopressin", "Inability to access or retain water"],
      complications: ["Hypernatremic dehydration, seizure, brain injury, and shock", "Water intoxication and hyponatremia from excessive desmopressin or intake", "Preeclampsia, HELLP, or liver disease complications", "Recurrence in later pregnancy"],
      prognosis: "It usually resolves after delivery as placental vasopressinase disappears. Persistent symptoms require evaluation for central or nephrogenic DI. Prompt water and sodium management generally produces good outcomes.",
      prevention: "It cannot always be prevented. Early recognition in prior gestational DI, multiple gestation, preeclampsia, HELLP, or liver disease prevents severe dehydration.",
      patientEducation: ["This is a water-hormone disorder, not high blood sugar.", "Keep water available and follow the exact desmopressin and sodium-testing plan.", "Report confusion, fainting, seizure, inability to drink, or a sudden fall in urine with headache or nausea.", "Symptoms usually improve after delivery but can recur in another pregnancy."],
      nclexTraps: ["Gestational DI and GDM are unrelated disorders.", "The urine is dilute because vasopressin effect is lost, not because glucose is pulling water.", "Desmopressin resists placental vasopressinase.", "Liver disease, preeclampsia and HELLP are important associations."],
      relatedTopics: ["Diabetes insipidus", "Gestational diabetes mellitus", "Hypernatremia", "Desmopressin", "Preeclampsia", "HELLP syndrome"],
      aliases: ["pregnancy diabetes insipidus", "gestational DI", "vasopressinase diabetes insipidus", "DI in pregnancy", "pregnancy water diabetes"],
      abbreviations: ["GDI", "DI"],
      commonMisspellings: ["gestational diabetes insipidous", "pregnency DI", "vasopresinase diabetes"],
      tags: ["vasopressinase", "polyuria", "dilute urine", "hypernatremia", "desmopressin", "pregnancy"],
      sourceKeys: ["w41-niddk-di"]
    }),

    card({
      name: "Type 3 diabetes terminology",
      category: "Medical Terminology - Diabetes Classification",
      definition: "Type 3 diabetes is an ambiguous informal phrase, not a current ADA clinical diabetes category. Some people use it loosely for Alzheimer disease or brain insulin signaling research; others accidentally shorten type 3c pancreatic diabetes. ANI should not silently choose between them. A search for type 3 should explain the ambiguity and direct pancreatic questions to Pancreatic diabetes and cognitive questions to Alzheimer disease.",
      pathology: "There is no single type 3 mechanism. Pancreatic/type 3c diabetes results from exocrine pancreatic injury and loss of insulin and other pancreatic functions. Alzheimer disease involves neurodegeneration with complex amyloid, tau, synaptic, vascular and metabolic biology; describing it as diabetes is a research metaphor that can mislead patients into thinking it is diagnosed or treated like blood-glucose diabetes.",
      pathophysiology: ["The same informal label has been attached to unrelated concepts.", "Type 3c has a defined pancreatic context and clinical glucose disorder.", "Brain insulin resistance is one research pathway among many in Alzheimer disease.", "Disambiguation prevents wrong cards, tests and treatments."],
      etiology: "Terminology confusion arises from dropping the letter c in type 3c and from popular use of type 3 diabetes in Alzheimer discussions. Neither justifies a standalone metabolic diagnosis called type 3 diabetes.",
      riskFactors: ["Query contains only type 3 without pancreatic or neurologic context", "Pancreatitis, pancreatectomy, steatorrhea or pancreatic cancer suggests type 3c", "Memory loss, cognitive decline, amyloid or tau context suggests Alzheimer discussion", "Online or informal source using numbered labels outside formal classification"],
      signsSymptoms: ["No unique symptoms because this is a terminology card", "Pancreatic symptoms direct to type 3c", "Progressive cognitive symptoms direct to Alzheimer evaluation", "Hyperglycemia still requires standard diagnostic testing regardless of label"],
      diagnostics: ["Ask what context the user means when context is absent.", "For pancreatic disease, evaluate glucose, exocrine function and pancreatic history.", "For cognitive decline, use a neurologic and functional evaluation rather than diabetes tests alone.", "Do not diagnose Alzheimer disease from insulin resistance or diabetes.", "Use ADA categories for clinical diabetes classification."],
      treatments: ["There is no treatment for the phrase itself.", "Treat confirmed pancreatic diabetes according to endocrine-exocrine physiology.", "Treat Alzheimer disease according to neurologic guidance.", "Treat ordinary diabetes risk without claiming it proves a neurodegenerative diagnosis."],
      contraindications: ["Do not auto-route type 3 Alzheimer to type 3c.", "Do not tell a patient that Alzheimer disease is literally diabetes mellitus.", "Do not omit the c when documenting pancreatic diabetes.", "Do not recommend diabetes medication as Alzheimer treatment from the nickname alone."],
      nursingPriorities: ["Clarify pancreatic versus cognitive intent.", "Use the exact documented diagnosis.", "Correct misleading terminology without dismissing the user's question.", "Route to urgent neurologic or metabolic evaluation when symptoms warrant.", "Document education and the destination card provided."],
      redFlags: ["Acute confusion, focal deficit, seizure, or sudden cognitive change", "DKA/HHS symptoms in a person with hyperglycemia", "Jaundice, progressive weight loss, or persistent pancreatic pain", "Medication changes based only on informal terminology"],
      complications: ["Wrong diagnostic pathway", "Missed pancreatic cancer or insulin deficiency", "Misunderstanding of Alzheimer disease", "Unsafe self-treatment"],
      prognosis: "The meaning depends entirely on context. Accurate naming improves care navigation.",
      prevention: "Use pancreatic diabetes or type 3c in pancreatic disease and Alzheimer disease for neurodegeneration; avoid the unqualified type 3 label in clinical documentation.",
      patientEducation: ["Type 3 alone is not an official diagnosis.", "If you mean pancreas damage, search type 3c or pancreatic diabetes.", "If you mean memory disease, search Alzheimer disease; diabetes can affect risk but is not the same diagnosis.", "Ask the clinician to write the exact type and cause."],
      nclexTraps: ["Type 3c is recognized pancreatic diabetes terminology; type 3 alone is ambiguous.", "Alzheimer disease is not diagnosed by glucose criteria.", "A nickname is not a clinical category.", "Context should control routing."],
      relatedTopics: ["Pancreatic diabetes", "Alzheimer disease", "Diabetes mellitus classification", "Type 2 diabetes mellitus"],
      aliases: ["type 3 diabetes", "type III diabetes", "Alzheimer diabetes", "brain diabetes", "diabetes type 3", "is Alzheimer type 3 diabetes"],
      commonMisspellings: ["type three diabetis", "alzeimer diabetes", "diabtes type 3"],
      tags: ["ambiguous terminology", "type 3c", "Alzheimer", "search disambiguation"],
      sourceKeys: ["w41-ada-classification-2026"]
    }),

    card({
      name: "Type 4 diabetes terminology",
      category: "Medical Terminology - Diabetes Classification",
      definition: "Type 4 diabetes is not a recognized ADA clinical diabetes category. The phrase has been used inconsistently in research or popular media, including for proposed age-related insulin resistance in lean older adults, but it has no standardized diagnostic criteria or treatment pathway. ANI should explain this status and route the user to the documented mechanism, usually type 2, secondary diabetes, pancreatic disease, or another specific diagnosis.",
      pathology: "Because the label is not standardized, it has no single pathology. Age can reduce muscle mass, activity, beta-cell reserve and insulin sensitivity, but those mechanisms are evaluated within established diabetes categories. Creating a numbered diagnosis from one research model would falsely imply consensus.",
      pathophysiology: ["Research clusters can describe biological heterogeneity without becoming clinical disease categories.", "Older lean adults can have type 2, LADA, pancreatic, monogenic, medication-induced, or other diabetes.", "Age and body size are clues, not etiologic tests.", "Mechanism-based evaluation prevents a speculative label from hiding a treatable cause."],
      etiology: "The term's meaning depends on the source. It should be treated as an intent-clarification query, not assigned to a patient.",
      riskFactors: ["Unqualified online claim about a fourth diabetes type", "Older lean adult with new diabetes", "Atypical treatment response", "Pancreatic, autoimmune, medication, or genetic clues", "No source-defined criteria"],
      signsSymptoms: ["No unique symptoms", "Usual diabetes symptoms require standard evaluation", "Frailty or sarcopenia may change treatment but not establish type 4", "Atypical findings should redirect classification"],
      diagnostics: ["Confirm diabetes using standard criteria.", "Evaluate antibodies, C-peptide, pancreatic and medication history when type is uncertain.", "Assess frailty, nutrition, kidney function, cognition and hypoglycemia risk in older adults.", "Ask what source or concept the user means.", "Use an established diagnosis in documentation."],
      treatments: ["There is no type 4-specific treatment.", "Individualize established diabetes therapy to mechanism, frailty, organ function and goals.", "Avoid overtreatment and hypoglycemia in vulnerable older adults.", "Treat nutrition and sarcopenia without implying they define a new type."],
      contraindications: ["Do not present type 4 as settled clinical classification.", "Do not infer type from age or leanness.", "Do not use speculative labels to change medication.", "Do not overlook LADA or pancreatic disease."],
      nursingPriorities: ["Clarify the intended meaning and source.", "Assess actual glucose, function, nutrition, medicines, and hypoglycemia risk.", "Document the established diagnosis.", "Provide fall and low-glucose safety in frailty.", "Escalate acute hyperglycemia or atypical catabolism."],
      redFlags: ["Confusion, dehydration, ketones, or severe hyperglycemia", "Severe low, fall, or inability to self-manage", "Rapid weight loss suggesting insulin deficiency, cancer, or malnutrition", "Self-treatment based on an online numbered label"],
      complications: ["Misclassification", "Delayed atypical-diabetes diagnosis", "Hypoglycemia from inappropriate treatment", "Confusion and misinformation"],
      prognosis: "Prognosis belongs to the actual diabetes mechanism and the patient's functional and organ status, not the informal label.",
      prevention: "Use current formal classification and explain emerging research honestly.",
      patientEducation: ["Type 4 is not a standard clinical diagnosis.", "Ask which established type or cause your records support.", "Older and lean does not automatically mean one diabetes mechanism.", "Do not change treatment based on the label alone."],
      nclexTraps: ["Research cluster names are not automatically clinical categories.", "Age does not establish etiology.", "Frailty changes goals and safety, not the fundamental classification by itself.", "Clarification is safer than auto-routing."],
      relatedTopics: ["Diabetes mellitus classification", "Type 2 diabetes mellitus", "Latent autoimmune diabetes in adults", "Pancreatic diabetes", "Secondary diabetes mellitus"],
      aliases: ["type 4 diabetes", "type IV diabetes", "type four diabetes", "age related diabetes type 4", "lean elderly diabetes"],
      commonMisspellings: ["type four diabetis", "type 4 diabtes", "age releated diabetes"],
      tags: ["unrecognized category", "research terminology", "older adult", "disambiguation"],
      sourceKeys: ["w41-ada-classification-2026"]
    }),

    card({
      name: "Double diabetes",
      category: "Medical Terminology - Mixed Diabetes Phenotype",
      definition: "Double diabetes is an informal term for autoimmune type 1 diabetes plus substantial insulin resistance or type 2-like metabolic features. It is not a separate formal diabetes type and does not mean two independent glucose diseases must be coded. The concept matters because a person who absolutely needs insulin can also develop hypertension, dyslipidemia, central adiposity, fatty liver, or high insulin requirements that add cardiovascular and kidney risk.",
      pathology: "Autoimmune beta-cell destruction creates absolute insulin need. Genetics, adiposity, puberty, pregnancy, medications, sleep, activity, or other metabolic pressures can simultaneously reduce insulin sensitivity. More insulin is then required for the same effect, but reducing insulin to avoid weight gain creates hyperglycemia and ketosis rather than treating resistance.",
      pathophysiology: ["Type 1 removes endogenous insulin.", "Insulin resistance raises replacement requirements.", "Higher doses and defensive eating after lows can reinforce weight and variability without being the sole cause.", "Cardiometabolic risks accumulate alongside the microvascular risks of hyperglycemia."],
      etiology: "The term describes coexistence, not a unique cause. It can occur in any person with type 1 as ordinary insulin-resistance risks evolve.",
      riskFactors: ["Type 1 diabetes with rising insulin need", "Family history or features of type 2 diabetes", "Puberty, pregnancy, glucocorticoids, sleep apnea, or weight change", "Hypertension, dyslipidemia, fatty liver, or acanthosis", "Frequent hypoglycemia prompting excess corrective intake"],
      signsSymptoms: ["Known type 1 plus increasing dose requirement", "Acanthosis, central adiposity, hypertension, dyslipidemia, or fatty liver", "Glucose variability and hypoglycemia from escalating doses", "Ketosis if insulin is withheld to address weight"],
      diagnostics: ["Confirm the underlying type 1 diagnosis and continuous insulin need.", "Assess insulin delivery, sites, adherence, infection, puberty, pregnancy and medicines before attributing resistance.", "Evaluate blood pressure, lipids, liver, kidney, sleep and body composition.", "Avoid rigid dose-per-kilogram cutoffs as a standalone diagnosis.", "Use person-centered trend review."],
      treatments: ["Continue basal-bolus insulin without interruption.", "Address nutrition, activity, sleep, blood pressure, lipids and weight respectfully.", "Consider adjunctive therapy only under current type 1 evidence and specialist guidance.", "Reduce recurrent hypoglycemia and defensive eating through insulin-pattern adjustment.", "Treat cardiovascular and kidney risk aggressively."],
      contraindications: ["Do not reduce or omit necessary insulin solely for weight control.", "Do not reclassify type 1 as type 2 because resistance appears.", "Do not use shame-based counseling.", "Do not use adjunct medicines without type 1-specific safety review, especially ketone risk."],
      nursingPriorities: ["Verify insulin delivery and sites before calling a pattern resistance.", "Assess lows, food insecurity, sleep, puberty, pregnancy, steroids and infection.", "Trend pressure, lipids, kidney and liver markers.", "Teach ketone safety with any adjunct strategy.", "Support sustainable, non-stigmatizing goals."],
      redFlags: ["Insulin omission, ketones, vomiting, or DKA", "Severe hypoglycemia after dose escalation", "Chest pain, focal deficit, or acute vascular symptoms", "Unsafe weight-control behavior or eating disorder concern"],
      complications: ["DKA from insulin restriction", "Hypoglycemia and weight cycling", "Accelerated cardiovascular, kidney and fatty-liver risk", "Diabetes distress and disordered eating"],
      prognosis: "Risk can improve when insulin delivery, hypoglycemia, resistance, and cardiovascular factors are treated together. The person remains physiologically type 1 and always needs insulin.",
      prevention: "Prevent avoidable resistance through feasible activity, sleep, medication review and low-glucose reduction while recognizing genetics and life stages. Prevent stigma by explaining that insulin resistance can coexist with type 1.",
      patientEducation: ["Double diabetes is an informal way to describe insulin resistance on top of type 1.", "You still need basal insulin continuously.", "Address dose needs without shame and ask about cardiovascular protection.", "Never omit insulin for weight control; seek help for distress or eating concerns."],
      nclexTraps: ["It is not a formal third type.", "Type 1 physiology remains present.", "Insulin resistance does not make insulin optional.", "Adjunct therapy can add DKA or hypoglycemia risk."],
      relatedTopics: ["Type 1 diabetes mellitus", "Type 2 diabetes mellitus", "Insulin resistance", "Metabolic syndrome", "Diabetic ketoacidosis", "Hypoglycemia"],
      aliases: ["hybrid diabetes", "type 1 with insulin resistance", "type 1 and type 2 diabetes", "dual diabetes", "double DM"],
      commonMisspellings: ["double diabetis", "hybrid diabtes", "insulin resistent type 1"],
      tags: ["mixed phenotype", "type 1", "insulin resistance", "cardiometabolic risk"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ada-pharmacology-2026"]
    }),

    card({
      name: "Brittle diabetes terminology",
      category: "Medical Terminology - Diabetes Variability",
      definition: "Brittle diabetes is an outdated and often stigmatizing label historically used for severe, recurrent, hard-to-predict glucose instability, usually in type 1 diabetes. It is not a separate diabetes type. Modern care looks for causes such as insulin-delivery failure, gastroparesis, kidney or adrenal disease, celiac disease, infection, lipohypertrophy, medication effects, food insecurity, distress, disordered eating, impaired hypoglycemia awareness, or limited access to insulin and technology.",
      pathology: "Glucose becomes unstable when insulin action and glucose appearance repeatedly mismatch. The mismatch may come from variable absorption, pump interruption, delayed gastric emptying, changing kidney clearance, hormonal illness, intentional or accidental dose omission, or unpredictable food access. Calling the person brittle hides these mechanisms and can wrongly imply that instability is a personality trait.",
      pathophysiology: ["A small absolute insulin deficit can rapidly produce ketones in type 1.", "Delayed food absorption can cause an early low followed by late high glucose.", "Reduced kidney clearance prolongs insulin and increases lows.", "Recurrent lows blunt warning responses, while psychosocial and access barriers disrupt consistent treatment."],
      etiology: "The phrase is descriptive and should trigger a structured root-cause assessment. Multiple medical, device, pharmacologic, behavioral, and social causes can coexist.",
      riskFactors: ["Recurrent DKA or severe hypoglycemia", "Pump, infusion-set, sensor, storage, or injection-site problems", "Gastroparesis, celiac, adrenal, thyroid, renal or autonomic disease", "Food or insulin insecurity, depression, distress, disordered eating, or cognitive limitations", "Impaired awareness of hypoglycemia"],
      signsSymptoms: ["Wide unpredictable glucose swings", "Repeated emergency visits for DKA or severe lows", "Mismatch with meals, overnight periods, menstruation, exercise, or illness", "Device alarms, site abnormalities, nausea, early satiety, diarrhea, weight loss, or psychosocial clues"],
      diagnostics: ["Download glucose, pump and insulin data and align them with food, symptoms, activity and dosing.", "Inspect sites, storage, technique and device function.", "Evaluate kidney, thyroid, adrenal, celiac, gastric and infection causes as indicated.", "Assess hypoglycemia awareness, cognition, food and insulin access, mental health and eating behavior without blame.", "Confirm the underlying diabetes type rather than creating a new one."],
      treatments: ["Correct the identified mechanism: delivery, timing, absorption, organ disease, access, education or psychosocial care.", "Use CGM and automated insulin delivery when appropriate and accessible.", "Temporarily relax targets to reduce recurrent lows and restore awareness when directed.", "Provide reliable backup insulin, ketone, glucagon and emergency plans.", "Coordinate endocrine, gastroenterology, mental health, social work and diabetes education."],
      contraindications: ["Do not use brittle as a blame label.", "Do not assume nonadherence before checking physiology, devices and access.", "Do not omit basal insulin to stop glucose swings.", "Do not ignore recurrent DKA or severe lows as expected behavior."],
      nursingPriorities: ["Create a time-linked glucose-insulin-food-symptom record.", "Inspect devices and sites and verify backup supplies.", "Screen privately and respectfully for food insecurity, distress and insulin restriction.", "Teach caregivers glucagon and ketone response.", "Escalate repeated crisis, unsafe discharge resources, or suspected eating disorder."],
      redFlags: ["Recurrent DKA, pump interruption, or insulin omission", "Severe hypoglycemia, seizure, or loss of awareness", "Suicidality, intentional insulin misuse, or eating-disorder concern", "No access to insulin, food, monitoring, or safe caregiver support"],
      complications: ["Recurrent DKA and severe hypoglycemia", "Injury, arrhythmia, cognitive harm, and death", "Hospitalization, distress, stigma, and financial harm", "Progressive complications from sustained variability and hyperglycemia"],
      prognosis: "Instability often improves when its medical and structural drivers are found. Repeated crisis should never be accepted as an immutable personality trait.",
      prevention: "Continuous access, device backup, early low-glucose treatment, screening for gastroparesis and organ disease, and nonjudgmental psychosocial support prevent recurrence.",
      patientEducation: ["Brittle is not a separate type and does not mean you caused the instability.", "Bring glucose, dose, food and symptom timing to the team.", "Keep backup insulin, ketone supplies and glucagon.", "Ask for help immediately if cost, food access, distress or eating concerns affect insulin."],
      nclexTraps: ["The term is outdated and nonspecific.", "Look for reversible mechanism and access problems.", "Gastroparesis can cause early lows and late highs.", "Never normalize recurrent DKA or severe hypoglycemia."],
      relatedTopics: ["Type 1 diabetes mellitus", "Hypoglycemia", "Impaired awareness of hypoglycemia", "Diabetic ketoacidosis", "Gastroparesis", "Continuous glucose monitoring"],
      aliases: ["brittle diabetes", "labile diabetes", "unstable diabetes", "hard to control diabetes", "wild blood sugar swings"],
      commonMisspellings: ["britle diabetes", "labile diabetis", "unstabel blood sugar"],
      tags: ["outdated terminology", "glucose variability", "recurrent DKA", "severe hypoglycemia", "social determinants"],
      sourceKeys: ["w41-ada-classification-2026", "w41-ada-pharmacology-2026"]
    })
  ];

  const results = [];
  cards.forEach((rawCard) => {
    const { mergeNames = [], ...payload } = rawCard;
    const identityNames = unique([payload.name, ...mergeNames]);
    const identitySet = new Set(identityNames.map(normalize));
    const matches = database.diseases.filter((entry) => identitySet.has(normalize(titleOf(entry))));
    const preservedAliases = unique(matches.flatMap((entry) => [titleOf(entry), ...(entry.aliases || []), ...(entry.abbreviations || []), ...(entry.commonMisspellings || [])])).filter((value) => normalize(value) !== normalize(payload.name));
    let target = matches[0] || null;
    if (!target) {
      target = {};
      database.diseases.push(target);
    }
    Object.assign(target, payload, { aliases: unique([...(payload.aliases || []), ...preservedAliases]) });
    let removedDuplicateCount = 0;
    matches.forEach((entry) => {
      if (entry === target) return;
      const index = database.diseases.indexOf(entry);
      if (index >= 0) {
        database.diseases.splice(index, 1);
        removedDuplicateCount += 1;
      }
    });
    results.push(Object.freeze({ canonicalName: payload.name, aliasCount: target.aliases.length, sourceCount: (payload.sourceKeys || []).length, removedDuplicateCount }));
  });

  // Diabetes insipidus is already a first-class renal/endocrine card. Extend
  // its identity vocabulary here so water-balance questions stay separated
  // from diabetes mellitus and from the desmopressin medication card.
  const diabetesInsipidusCard = database.diseases.find((entry) => normalize(titleOf(entry)) === "diabetes insipidus");
  if (diabetesInsipidusCard) {
    diabetesInsipidusCard.aliases = unique([
      ...(Array.isArray(diabetesInsipidusCard.aliases) ? diabetesInsipidusCard.aliases : []),
      "water diabetes",
      "diabetes insipidus dilute urine",
      "polyuria with dilute urine",
      "excessive thirst and dilute urine",
      "ADH deficiency diabetes insipidus",
      "vasopressin deficiency diabetes insipidus"
    ]);
    diabetesInsipidusCard.tags = unique([
      ...(Array.isArray(diabetesInsipidusCard.tags) ? diabetesInsipidusCard.tags : []),
      "dilute high-volume urine",
      "water balance",
      "hypernatremia",
      "vasopressin"
    ]);
  }

  window.ANI_PATHOLOGY_WAVE41_DIABETES_SECONDARY = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    applied: true,
    sourceNote: SOURCE_NOTE,
    cardCount: cards.length,
    sourceCount: sourceReferences.length,
    diabetesInsipidusAliasCount: diabetesInsipidusCard && Array.isArray(diabetesInsipidusCard.aliases)
      ? diabetesInsipidusCard.aliases.length
      : 0,
    cards: Object.freeze(results)
  });
})();
