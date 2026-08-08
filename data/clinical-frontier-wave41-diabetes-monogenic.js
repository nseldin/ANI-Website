/* eslint-disable */
/* Wave 41: gene-first monogenic diabetes reference cards. */
(function () {
  "use strict";

  const VERSION = "2026-07-21-wave41-diabetes-monogenic-1";
  const SOURCE_NOTE = "This educational synthesis uses the American Diabetes Association Standards of Care in Diabetes—2026, NIDDK monogenic-diabetes materials, and NIH/NCBI GeneReviews. Monogenic diabetes is genetically and clinically heterogeneous: phenotype can guide testing but cannot establish a molecular diagnosis, treatment must follow the confirmed gene and variant, and a variant of uncertain significance (VUS) must not be treated as diagnostic. Current specialist judgment, genetic counseling, laboratory standards, pregnancy context, and the patient's physiology take priority over a static card.";

  if (window.ANI_PATHOLOGY_WAVE41_DIABETES_MONOGENIC && window.ANI_PATHOLOGY_WAVE41_DIABETES_MONOGENIC.version === VERSION) return;

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) {
    window.ANI_PATHOLOGY_WAVE41_DIABETES_MONOGENIC = Object.freeze({
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
      key: "w41-ada-classification-2026",
      label: "American Diabetes Association: Diagnosis and Classification of Diabetes, Standards of Care in Diabetes—2026",
      url: "https://diabetesjournals.org/care/article/49/Supplement_1/S27/163926/2-Diagnosis-and-Classification-of-Diabetes",
      note: "Supports classification of monogenic diabetes among other specific diabetes types, phenotype-based suspicion, islet-autoantibody and C-peptide interpretation, genetic testing, and gene-directed treatment principles."
    },
    {
      key: "w41-niddk-monogenic",
      label: "NIDDK: Monogenic Diabetes (MODY and Neonatal Diabetes Mellitus)",
      url: "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/monogenic-neonatal-mellitus-mody",
      note: "Supports patient-centered definitions, clinical clues, inheritance, testing and counseling, and the fact that treatment differs by molecular cause."
    },
    {
      key: "w41-genereviews-mody",
      label: "GeneReviews: Maturity-Onset Diabetes of the Young Overview",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK500456/",
      note: "Supports gene-first MODY classification; GCK, HNF1A, HNF4A, and HNF1B phenotypes; molecular diagnosis; inheritance; complications; pregnancy reasoning; and gene-specific therapy."
    },
    {
      key: "w41-genereviews-pndm",
      label: "GeneReviews: Permanent Neonatal Diabetes Mellitus",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK1447/",
      note: "Supports neonatal presentation, genotype spectrum, urgent stabilization, KATP-channel mechanisms and sulfonylurea responsiveness, syndromic clues, surveillance, and inheritance."
    },
    {
      key: "w41-genereviews-6q24",
      label: "GeneReviews: 6q24-Related Transient Neonatal Diabetes Mellitus",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK1534/",
      note: "Supports imprinting mechanisms, neonatal features, remission and relapse, management, molecular testing, and differentiation from other neonatal diabetes causes."
    },
    {
      key: "w41-genereviews-wfs1",
      label: "GeneReviews: WFS1 Spectrum Disorder",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK4144/",
      note: "Supports classic Wolfram syndrome, WFS1-related endoplasmic-reticulum dysfunction, optic atrophy, diabetes insipidus, hearing and neurologic manifestations, surveillance, and genetic counseling."
    },
    {
      key: "w41-genereviews-mito-hearing",
      label: "GeneReviews: Nonsyndromic Hearing Loss and Deafness, Mitochondrial",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK1422/",
      note: "Supports the MT-TL1 m.3243A>G association with maternally inherited diabetes and deafness, maternal inheritance, variable expression, progressive sensorineural hearing loss, and molecular differential diagnosis."
    },
    {
      key: "w41-niddk-dia-monogenic",
      label: "NIDDK Diabetes in America: Monogenic Forms of Diabetes",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK597414/",
      note: "Supports contemporary neonatal and MODY gene spectra, syndromic presentations, clinical selection for testing, molecularly directed therapy, and limits of phenotype-only classification."
    }
  ];

  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];
  const sourceResults = [];
  sourceReferences.forEach((source) => {
    const existing = database.sourceReferences.find((item) => clean(item && (item.key || item.id)) === source.key);
    if (existing) Object.assign(existing, source);
    else database.sourceReferences.push({ ...source });
    sourceResults.push(Object.freeze({
      key: source.key,
      action: existing ? "updated" : "inserted",
      url: source.url
    }));
  });

  const monogenicDiabetes = {
    name: "Monogenic diabetes mellitus",
    displayName: "Monogenic Diabetes Mellitus",
    category: "Endocrinology, Diabetes & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "Monogenic diabetes mellitus is a group of uncommon diabetes disorders in which a disease-causing change in one gene is the principal driver of hyperglycemia. It is not one uniform disease and is not simply 'type 1 without antibodies' or 'type 2 in a thin person.' A molecular cause may alter beta-cell glucose sensing, insulin synthesis, ion-channel closure, transcription, pancreatic development, mitochondrial energy production, or insulin action. That mechanism can change treatment dramatically: some people need no glucose-lowering medicine, some respond especially well to a sulfonylurea, and others need lifelong insulin plus surveillance for kidney, hearing, vision, neurologic, hepatic, or congenital disease.",
    pathology: "The shared endpoint is inadequate insulin effect for the current glucose load, but the route to that endpoint is gene-specific. A beta cell must sense glucose, metabolize it to raise ATP, close its ATP-sensitive potassium channel, depolarize, admit calcium, make and process insulin, and remain healthy enough to repeat the process. Pathogenic variants can interrupt any step. Other genes build the pancreas or regulate insulin-responsive tissues, while mitochondrial DNA variants impair cellular energy production across several organs. This diversity explains why age, body habitus, family history, C-peptide, and autoantibodies are clues rather than a final diagnosis.",
    pathophysiology: [
      "Glucose-sensing defects such as heterozygous GCK loss of function shift the beta-cell threshold upward. Insulin is still produced, but release begins at a higher glucose concentration, creating mild stable fasting hyperglycemia rather than progressive beta-cell destruction.",
      "Transcription-factor disorders such as HNF1A-, HNF4A-, and HNF1B-related diabetes alter networks needed for beta-cell function or organ development. The result may be progressive secretory failure, an unusual renal glucose threshold, fetal hyperinsulinism, renal malformations, or pancreatic hypoplasia depending on the gene.",
      "Activating KCNJ11 or ABCC8 variants keep the beta-cell KATP channel open despite rising ATP. The membrane cannot depolarize normally, calcium entry falls, and insulin secretion is blocked; a sulfonylurea can close many mutant channels through SUR1, which explains the gene-specific treatment response.",
      "INS and endoplasmic-reticulum stress disorders can impair insulin production or injure beta cells. Pancreatic-development genes can reduce beta-cell mass and may also produce exocrine insufficiency or congenital anomalies.",
      "Mitochondrial and syndromic disorders affect more than glucose control because the altered protein or mitochondrial genome is used in multiple tissues. Diabetes may therefore be accompanied by deafness, optic atrophy, diabetes insipidus, renal disease, cardiomyopathy, liver failure, skeletal dysplasia, immune dysregulation, or neurodevelopmental findings."
    ],
    etiology: "A pathogenic or likely pathogenic germline variant causes the disorder, but inheritance varies. Many MODY forms are autosomal dominant; several neonatal and syndromic forms are autosomal recessive; IPEX is X-linked; mitochondrial diabetes follows maternal transmission; and many neonatal cases arise de novo. Reduced penetrance, mosaicism, variable expression, imprinting, and mitochondrial heteroplasmy can obscure the pedigree. A common risk allele, a benign variant, or a VUS is not equivalent to a disease-causing result. The laboratory classification, phenotype, segregation, and specialist interpretation must agree before the genotype directs care.",
    riskFactors: [
      "Diabetes diagnosed in the first 6 months of life; this is almost always a reason for prompt monogenic testing rather than an assumption of autoimmune type 1 diabetes",
      "Diabetes in successive generations at relatively young ages, especially with an autosomal-dominant pattern, preserved C-peptide, and negative islet autoantibodies",
      "Mild fasting hyperglycemia that is stable over years, disproportionate post-meal glycosuria, or marked sulfonylurea sensitivity",
      "Diabetes plus renal cysts or dysplasia, hypomagnesemia, deafness, optic atrophy, diabetes insipidus, pancreatic insufficiency, congenital anomalies, cardiomyopathy, liver crises, or neurodevelopmental findings",
      "A maternal-only pattern of diabetes and sensorineural hearing loss, consanguinity with neonatal or syndromic disease, or a relative with a confirmed causal variant",
      "Atypical mismatch with the assigned type 1 or type 2 diagnosis; obesity does not exclude a monogenic cause and leanness alone does not establish one"
    ],
    signsSymptoms: [
      "Hyperglycemia may be asymptomatic or cause polyuria, polydipsia, weight loss, blurred vision, fatigue, candidiasis, dehydration, or diabetic ketoacidosis (DKA). The severity depends on residual insulin secretion, not on the label 'monogenic.'",
      "Preserved endogenous insulin years after diagnosis, absence of ketosis without insulin, negative islet autoantibodies, or low insulin requirements can support a nonautoimmune mechanism, but none is diagnostic alone.",
      "A stable mildly elevated fasting glucose from childhood suggests GCK-MODY; progressive young-onset diabetes with glycosuria suggests HNF1A-MODY; neonatal macrosomia or hypoglycemia in the family can suggest HNF4A-MODY.",
      "Renal or genital-tract anomalies, hypomagnesemia, hyperuricemia, abnormal liver tests, or pancreatic exocrine insufficiency suggest HNF1B-related disease rather than isolated beta-cell MODY.",
      "Hearing loss, optic atrophy, central diabetes insipidus, cardiomyopathy, episodic liver dysfunction, skeletal abnormalities, severe infantile diarrhea/eczema, or developmental delay are diagnostic-direction signs of a syndromic form."
    ],
    diagnostics: [
      "First establish diabetes using standard plasma-glucose or A1C criteria and stabilize acute hyperglycemia. A glucose test diagnoses diabetes but does not identify its type. Do not delay insulin, fluids, electrolytes, or DKA treatment while awaiting genetics.",
      "Characterize the phenotype: exact age at onset, pregnancy and birth history, growth, ketosis, medication response, insulin requirements, C-peptide paired with glucose, GAD/IA-2/ZnT8 and other appropriate islet autoantibodies, renal and liver data, magnesium, hearing and eye findings, pancreatic function, and a three-generation pedigree.",
      "Offer molecular testing promptly for diabetes diagnosed before age 6 months and consider it from 6 to 12 months when autoimmunity is absent or congenital, neurologic, or syndromic findings exist. In older patients, use a phenotype-directed multigene panel or other genetics strategy with a monogenic-diabetes specialist rather than ordering one fashionable gene blindly.",
      "A pathogenic or likely pathogenic variant in a gene that fits the inheritance and phenotype can establish a molecular diagnosis. Confirm identity and classification through a qualified clinical laboratory and arrange genetic counseling before predictive testing of relatives.",
      "A VUS neither confirms nor excludes monogenic diabetes. Do not change insulin, start a gene-specific drug, label relatives, or make reproductive predictions from a VUS; pursue segregation data, phenotype review, laboratory reclassification, or broader testing as advised.",
      "Consider type 1 diabetes, type 2 diabetes, pancreatic diabetes, cystic-fibrosis-related diabetes, endocrinopathy, medication-induced diabetes, lipodystrophy, and mitochondrial or chromosomal syndromes. Autoantibodies can rarely coexist with monogenic diabetes, and obesity can coexist with any genotype, so avoid single-feature exclusion."
    ],
    treatments: [
      "Treat the current physiology safely before refining the label. Use insulin for DKA, marked catabolism, severe insulin deficiency, or an unstable infant; never withdraw basal insulin merely because genetic testing was ordered.",
      "After a confirmed diagnosis, match therapy to the gene: usually no pharmacologic treatment for isolated GCK-MODY outside selected pregnancy situations; low-dose sulfonylurea often for HNF1A- or HNF4A-MODY; specialist-supervised high-dose sulfonylurea transition for many activating KCNJ11/ABCC8 variants; and insulin for INS-related, pancreatic-development, many HNF1B, Wolfram, and other insulin-deficient forms.",
      "Treat non-glycemic disease as part of the same diagnosis: renal and electrolyte abnormalities, pancreatic enzyme deficiency, hearing and vision loss, diabetes insipidus, cardiomyopathy, liver disease, developmental needs, and reproductive counseling may carry more immediate risk than A1C.",
      "Use cascade testing for relatives only after a familial pathogenic variant is established. A negative targeted result can spare a relative unnecessary lifelong surveillance; a positive result allows anticipatory care, but age-dependent penetrance and gene-specific risks still require counseling.",
      "Pregnancy management must be genotype-aware. Maternal genotype, possible fetal genotype, fetal growth, placental transfer of medication, and neonatal hypoglycemia risk can reverse the usual treatment logic, so endocrinology, maternal-fetal medicine, pediatrics, and genetics should coordinate care."
    ],
    contraindications: [
      "Do not use a VUS, direct-to-consumer result, research-only result, or phenotype alone to declare a molecular diagnosis or alter a high-risk treatment.",
      "Do not assume negative autoantibodies prove MODY; type 2, pancreatic, mitochondrial, and other secondary diabetes can also be antibody-negative.",
      "Do not stop insulin during illness, ketosis, pregnancy, or suspected severe insulin deficiency without a written specialist transition and ketone plan.",
      "Do not treat every MODY label with a sulfonylurea. GCK usually needs no drug, HNF1B often needs insulin, and rare genes have different or uncertain responses.",
      "Do not infer inheritance from one affected or unaffected relative. De novo variants, incomplete penetrance, recessive inheritance, imprinting, mosaicism, and heteroplasmy can all disrupt a simple pedigree."
    ],
    nursingPriorities: [
      "Verify the exact molecular diagnosis, gene, variant classification, current regimen, and emergency plan at every transition; 'MODY' or 'genetic diabetes' alone is not enough to administer therapy safely.",
      "Assess glucose trends, hypoglycemia, ketones during illness or sustained hyperglycemia, hydration, weight, injection or medication technique, and access to insulin, glucose, ketone supplies, and glucagon as appropriate.",
      "Before and after a gene-directed medication change, increase glucose surveillance and document who may adjust doses. Sulfonylurea-sensitive forms can develop prolonged hypoglycemia, while an unsuccessful insulin withdrawal can cause rapid hyperglycemia and ketosis.",
      "Screen and coordinate gene-specific surveillance: blood pressure, kidney function, magnesium, urine albumin, eye and foot care, hearing, vision, growth and development, pancreatic nutrition, liver and cardiac findings, and diabetes-insipidus fluid balance as indicated.",
      "Use plain language in genetic education. Distinguish pathogenic/likely pathogenic from VUS, explain the inheritance pattern without blame, protect privacy, and refer relatives to genetics rather than recommending informal sharing of raw test interpretations.",
      "Document pregnancy status and reproductive plans because medication safety, fetal growth, neonatal glucose monitoring, and recurrence counseling are genotype-specific."
    ],
    redFlags: [
      "Vomiting, abdominal pain, deep breathing, altered mental status, dehydration, positive ketones, or rapidly rising glucose suggesting DKA or severe insulin deficiency",
      "Severe or recurrent hypoglycemia, seizure, loss of consciousness, or inability to take carbohydrate during a sulfonylurea or insulin transition",
      "Diabetes in an infant younger than 6 months, especially with poor weight gain, dehydration, low birth weight, congenital anomalies, hypotonia, seizures, or developmental regression",
      "Acute liver dysfunction, cardiomyopathy symptoms, sudden vision or hearing change, severe electrolyte disturbance, polyuria with hypernatremia, or another syndromic organ crisis",
      "A proposed insulin discontinuation based only on a screening result, VUS, or unconfirmed family report"
    ],
    complications: [
      "DKA, hyperosmolar decompensation, severe hypoglycemia, dehydration, growth failure, and medication-related harm when the mechanism is misclassified",
      "Retinopathy, nephropathy, neuropathy, cardiovascular disease, foot injury, and infection in genotypes that produce sustained clinically important hyperglycemia",
      "Gene-specific renal failure, electrolyte loss, hearing or vision impairment, pancreatic malabsorption, neurodevelopmental disability, cardiomyopathy, liver failure, or endocrine deficiencies",
      "Psychological distress, family conflict, reproductive uncertainty, insurance or access barriers, and harm from inaccurate interpretation of relatives' genetic results",
      "Years of unnecessary insulin or ineffective type 2 therapy when a treatable molecular diagnosis is missed"
    ],
    prognosis: "Prognosis is determined by the gene, variant, degree of insulin deficiency, glycemic exposure, and extra-pancreatic disease. Isolated GCK-MODY is usually mild with very low complication risk, while HNF1A- and HNF4A-related diabetes can produce ordinary microvascular complications if hyperglycemia is not treated. Neonatal and syndromic forms range from highly sulfonylurea-responsive channel disease to lifelong insulin deficiency with serious neurologic, renal, hepatic, cardiac, hearing, or visual disease. A precise diagnosis often improves prognosis by replacing trial-and-error therapy with mechanism-directed care and by identifying relatives before complications occur.",
    prevention: "The inherited or de novo molecular cause usually cannot be prevented. Preventable harm includes delayed diagnosis, unsafe insulin withdrawal, unrecognized hypoglycemia, untreated hyperglycemia, missed organ surveillance, and misinformed reproductive decisions. Early genetic evaluation in eligible infants and atypical families, accurate variant interpretation, cascade testing with counseling, routine diabetes complication prevention when hyperglycemia is substantial, vaccination and sick-day preparation, and pregnancy planning reduce these harms.",
    patientEducation: [
      "Monogenic diabetes means one gene is the main cause, but there are many different genes and they do not all behave or respond to medicine the same way.",
      "A genetic result labeled 'variant of uncertain significance' is not a diagnosis. Keep the report and ask whether it is reclassified over time, but do not change treatment from that result alone.",
      "Never stop insulin or replace it with tablets on your own. Some genetically confirmed forms can switch safely, but the transition requires close glucose and ketone monitoring.",
      "Tell the team about hearing, vision, kidney, urine-volume, growth, digestive, neurologic, liver, or heart symptoms and about diabetes or deafness patterns on both sides of the family; these details help select the correct test.",
      "Ask for a written copy of the gene, variant, inheritance pattern, treatment implications, emergency plan, and recommendations for relatives and pregnancy."
    ],
    nclexTraps: [
      "Monogenic diabetes is not synonymous with MODY. Neonatal, mitochondrial, and other syndromic forms are also monogenic.",
      "Negative islet antibodies are a clue, not proof; preserved C-peptide is context-dependent and must be interpreted with glucose, disease duration, and kidney function.",
      "A VUS is not a positive diagnostic test. Only a clinically interpreted pathogenic or likely pathogenic result that fits the phenotype can direct gene-specific care.",
      "Do not give the same treatment to all MODY subtypes: GCK often needs none, HNF1A/HNF4A often respond to sulfonylurea, and HNF1B commonly requires insulin.",
      "Diabetes diagnosed before 6 months should trigger urgent genetic evaluation even without a family history because many cases are de novo.",
      "Obesity does not exclude monogenic diabetes, and a lean young person does not automatically have it."
    ],
    relatedTopics: ["Type 1 diabetes mellitus", "Type 2 diabetes mellitus", "C-peptide", "Islet autoantibodies", "Genetic testing", "Genetic counseling", "Diabetic ketoacidosis", "Hypoglycemia", "Maturity-onset diabetes of the young", "Neonatal diabetes mellitus", "Mitochondrial disease"],
    aliases: ["single-gene diabetes", "single gene diabetes", "genetic diabetes", "monogenic forms of diabetes", "inherited diabetes", "atypical genetic diabetes", "monogenetic diabetes"],
    abbreviations: ["MGD"],
    commonMisspellings: ["monogenetic diabetes", "monogenic diabeties", "monogenic diabetis", "monogenec diabetes"],
    tags: ["monogenic diabetes", "single gene diabetes", "MODY", "neonatal diabetes", "genetic testing diabetes", "pathogenic variant", "VUS not diagnostic", "gene-directed therapy", "atypical diabetes", "genetic counseling"],
    sourceKeys: ["w41-ada-classification-2026", "w41-niddk-monogenic", "w41-genereviews-mody", "w41-genereviews-pndm", "w41-niddk-dia-monogenic"]
  };

  const mody = {
    name: "Maturity-onset diabetes of the young (MODY)",
    displayName: "Maturity-Onset Diabetes of the Young (MODY)",
    category: "Endocrinology, Diabetes & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "Maturity-onset diabetes of the young (MODY) is a clinical-genetic group of usually autosomal-dominant, nonautoimmune diabetes disorders caused by a pathogenic variant affecting beta-cell function. The historical name is imperfect: onset can occur after youth, and not every young-onset familial diabetes is MODY. Modern care should use the causal gene first—such as GCK-MODY, HNF1A-MODY, HNF4A-MODY, or HNF1B-related diabetes—because the old numbers do not explain mechanism and can be confused with diabetes 'types.'",
    pathology: "MODY usually reflects impaired glucose sensing or insulin secretion rather than autoimmune beta-cell destruction or primary obesity-related insulin resistance. The beta-cell defect varies by gene. GCK raises the glucose threshold for insulin release; HNF1A and HNF4A progressively impair transcriptional programs required for secretion; HNF1B disrupts development and function in the kidney, pancreas, and genital tract. Because residual insulin is often present, patients can initially appear to have mild type 1 or type 2 diabetes, but the natural history, extra-pancreatic findings, and best therapy differ.",
    pathophysiology: [
      "A heterozygous causal variant is commonly present in every cell and may be transmitted to each child with a 50% probability, but age at diagnosis and severity can vary within one family.",
      "GCK-MODY produces a stable sensing-set-point abnormality; HNF1A- and HNF4A-MODY produce progressive secretory failure and therefore rising glucose with age; HNF1B-related disease combines beta-cell and pancreatic-development problems with multisystem disease.",
      "Endogenous insulin and C-peptide commonly persist beyond the honeymoon period expected in type 1 diabetes, and islet autoantibodies are usually absent. Neither finding is unique to MODY.",
      "Chronic complication risk follows the degree and duration of hyperglycemia. It is very low in isolated GCK-MODY but clinically important in HNF1A/HNF4A and other progressive forms."
    ],
    etiology: "MODY is caused by a heterozygous pathogenic or likely pathogenic variant in a validated MODY-associated gene, most often GCK, HNF1A, HNF4A, or HNF1B. Many older 'MODY numbers' were assigned before modern large-scale gene validation; some very rare reported gene-disease relationships remain uncertain or disputed. Therefore, a number label or VUS should not be converted into a definitive diagnosis. De novo disease occurs, particularly with HNF1B, so an absent family history does not exclude MODY.",
    riskFactors: [
      "Diabetes or consistent fasting hyperglycemia diagnosed at a young age with affected relatives in two or more successive generations",
      "Negative islet autoantibodies and measurable endogenous C-peptide beyond the expected early type 1 period",
      "Mild stable fasting hyperglycemia from childhood, unusually low renal threshold for glucose, or marked response to a small sulfonylurea dose",
      "Renal cysts or dysplasia, hypomagnesemia, genital anomalies, pancreatic hypoplasia, or unexplained abnormal liver tests suggesting HNF1B",
      "A parent with gestational diabetes, young-onset 'type 2' diabetes, neonatal macrosomia or hypoglycemia, or a known familial pathogenic variant",
      "A diagnosis that does not behave as expected; body size and ancestry must not be used as exclusion criteria"
    ],
    signsSymptoms: [
      "Many patients are asymptomatic when mild hyperglycemia is discovered through screening, pregnancy testing, family testing, or glycosuria.",
      "Progressive forms cause polyuria, polydipsia, weight loss, blurred vision, fatigue, infections, and eventually substantial hyperglycemia; DKA is less typical while insulin reserve persists but remains possible if insulin becomes severely deficient or treatment is withheld.",
      "GCK-MODY usually shows mild fasting hyperglycemia with little change over years; HNF1A-MODY often shows post-meal glucose rise and glycosuria before fasting glucose becomes markedly abnormal.",
      "HNF4A families may include infants with macrosomia and transient neonatal hyperinsulinemic hypoglycemia, followed by diabetes later in life.",
      "HNF1B-related disease may be recognized by kidney, magnesium, urate, pancreatic, hepatic, or reproductive-tract findings before diabetes appears."
    ],
    diagnostics: [
      "Confirm the glucose disorder and reconstruct the original course before classifying it: age at first abnormal glucose, treatment history, ketosis, pregnancy and neonatal history, BMI trajectory, medication response, and complications.",
      "Measure appropriate islet autoantibodies near diagnosis when possible and interpret C-peptide with concurrent glucose, disease duration, therapy, and kidney function. Persistent C-peptide plus negative antibodies supports but does not prove MODY.",
      "Draw a three-generation pedigree that includes mild hyperglycemia, gestational diabetes, neonatal size or hypoglycemia, kidney disease, deafness, and age at diagnosis—not only relatives who use insulin.",
      "Use a qualified monogenic-diabetes panel or phenotype-directed testing with deletion/duplication analysis when indicated. HNF1B whole-gene deletion and 17q12 deletion can be missed by sequence-only testing; mitochondrial disease requires a different strategy.",
      "A pathogenic/likely pathogenic result that matches the phenotype establishes the subtype. A VUS does not; do not use it for predictive family testing or medication withdrawal.",
      "Differentiate type 1 and type 2 diabetes, LADA, ketosis-prone diabetes, pancreatic disease, mitochondrial diabetes, lipodystrophy, and medication-induced diabetes. Multiple conditions can coexist."
    ],
    treatments: [
      "Use the confirmed gene to choose treatment. Isolated GCK-MODY usually needs no glucose-lowering medication outside selected pregnancies; HNF1A- and HNF4A-MODY are often highly sulfonylurea-responsive; HNF1B-related diabetes often progresses to insulin; rarer forms require gene-specific evidence and specialist review.",
      "If the patient is catabolic, ketotic, pregnant with uncertain physiology, or severely hyperglycemic, stabilize with insulin as needed before waiting for the molecular result.",
      "When switching a genetically confirmed responsive patient from insulin to sulfonylurea, use a specialist-written transition with frequent glucose checks, hypoglycemia education, ketone instructions, and rapid access to dose adjustment.",
      "Apply standard cardiovascular and microvascular risk reduction to progressive hyperglycemic subtypes, while avoiding unnecessary treatment burden and hypoglycemia in isolated GCK-MODY.",
      "Offer genetic counseling and targeted testing for relatives after the familial pathogenic variant is known; coordinate genotype-specific pregnancy and newborn planning."
    ],
    contraindications: [
      "Do not diagnose MODY solely because a patient is young, lean, antibody-negative, or has a diabetic parent.",
      "Do not use 'MODY2' or another number without verifying the gene; numbers are aliases, not mechanisms, and rare historical assignments may be unreliable.",
      "Do not stop insulin from an unconfirmed MODY suspicion or a VUS, and do not start sulfonylurea across all subtypes.",
      "Do not assume an unaffected parent excludes dominant MODY; mild disease, nonpenetrance, de novo variants, or incomplete family information may explain the pedigree.",
      "Do not overlook pregnancy-specific fetal-genotype effects, especially in GCK- and HNF4A-related disease."
    ],
    nursingPriorities: [
      "Record the gene-qualified diagnosis rather than only 'MODY,' and verify whether the report says pathogenic, likely pathogenic, or VUS.",
      "Monitor glucose and hypoglycemia closely after any gene-directed treatment change; ensure access to meter or CGM, rapid carbohydrate, glucagon when indicated, ketone testing, and a sick-day plan.",
      "Assess for subtype clues at every transition: kidney function and magnesium for HNF1B, glycosuria and progressive glucose for HNF1A, neonatal history for HNF4A, and stable mild fasting glucose for GCK.",
      "Coordinate retinal, kidney, neuropathy, cardiovascular, foot, and blood-pressure surveillance according to actual hyperglycemic exposure, not simply the rarity of the diagnosis.",
      "Refer patients and relatives for genetic counseling; avoid interpreting raw family results or implying blame, certainty, or reproductive outcomes beyond the confirmed inheritance."
    ],
    redFlags: [
      "Ketones, vomiting, deep breathing, altered mentation, severe dehydration, or catabolic weight loss",
      "Severe or recurrent hypoglycemia after a sulfonylurea initiation, titration, missed meal, exercise change, or pregnancy-related adjustment",
      "Pregnancy with uncertain subtype, rapid fetal growth change, or a prior newborn with macrosomia or hypoglycemia",
      "Kidney dysfunction, severe hypomagnesemia, arrhythmia, or congenital renal/pancreatic findings suggesting unrecognized HNF1B disease",
      "Any plan to withdraw insulin based only on phenotype, a historical number, or a VUS"
    ],
    complications: [
      "Retinopathy, nephropathy, neuropathy, cardiovascular disease, and pregnancy complications in progressive forms with sustained hyperglycemia",
      "Severe hypoglycemia from sulfonylurea sensitivity or excessive insulin after misclassification",
      "DKA or catabolic decompensation if insulin-dependent physiology is mistaken for a tablet-responsive form",
      "Gene-specific kidney, electrolyte, pancreatic, liver, reproductive, or neonatal complications",
      "Misdiagnosis-related cost, distress, unnecessary injections, and missed opportunities for relatives"
    ],
    prognosis: "MODY prognosis is subtype-specific. Isolated GCK-MODY usually remains mild and causes very few classic diabetes complications. HNF1A- and HNF4A-MODY generally progress but can have excellent control with appropriately selected therapy; complication risk resembles other diabetes when glycemia is comparably elevated. HNF1B-related prognosis may be driven by kidney and other organ disease as much as glucose. Molecular diagnosis improves treatment precision and family risk assessment but does not erase the need for long-term follow-up.",
    prevention: "The causal variant cannot usually be prevented. Early recognition can prevent years of wrong treatment, severe medication-related hypoglycemia, and missed organ disease. Family counseling, targeted testing after a causal variant is established, planned pregnancy care, newborn glucose surveillance where indicated, healthy cardiovascular habits, and complication screening matched to glycemic exposure reduce preventable harm.",
    patientEducation: [
      "MODY is a family of gene-specific diabetes conditions, not a single mild form and not another name for type 2 diabetes in a young adult.",
      "Ask the clinic to write the gene with the diagnosis—for example GCK-MODY or HNF1A-MODY—because treatment and family advice depend on that gene.",
      "A VUS is an uncertain result, not proof. Do not ask relatives to change care or stop medication from a VUS.",
      "Carry a current medication and emergency plan, especially during a switch from insulin to tablets or during pregnancy.",
      "Relatives should pursue counseling and targeted clinical testing rather than assume they are affected from symptoms or a shared last name."
    ],
    nclexTraps: [
      "MODY is usually nonautoimmune beta-cell dysfunction, but antibody negativity alone is insufficient for diagnosis.",
      "GCK-MODY is mild and usually untreated; HNF1A/HNF4A are progressive and often sulfonylurea-sensitive; HNF1B is multisystem and often insulin-requiring.",
      "Old MODY numbers must map to a gene: MODY2 = GCK, MODY3 = HNF1A, MODY1 = HNF4A, and MODY5 = HNF1B.",
      "Preserved C-peptide does not mean a patient can safely stop insulin today.",
      "Autosomal dominant inheritance commonly means a 50% chance for each pregnancy, but only after the familial pathogenic variant and inheritance are confirmed."
    ],
    relatedTopics: ["Monogenic diabetes mellitus", "GCK-MODY", "HNF1A-MODY", "HNF4A-MODY", "HNF1B-related diabetes", "Genetic testing", "C-peptide", "Islet autoantibodies", "Sulfonylureas", "Gestational diabetes mellitus"],
    aliases: ["MODY", "maturity onset diabetes of the young", "maturity-onset diabetes in the young", "young onset monogenic diabetes", "familial young onset diabetes", "monogenic beta cell diabetes"],
    abbreviations: ["MODY"],
    commonMisspellings: ["maturity onset diabeties of the young", "mature onset diabetes of the young", "MODDY", "MODY diabetes"],
    tags: ["MODY", "maturity-onset diabetes of the young", "autosomal dominant diabetes", "young onset familial diabetes", "MODY genetic testing", "MODY numbers", "negative autoantibodies", "preserved C-peptide"],
    sourceKeys: ["w41-ada-classification-2026", "w41-niddk-monogenic", "w41-genereviews-mody", "w41-niddk-dia-monogenic"]
  };

  const gckMody = {
    name: "GCK-MODY",
    displayName: "GCK-MODY (Glucokinase-Related Diabetes)",
    category: "Endocrinology, Diabetes & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "GCK-MODY is an autosomal-dominant glucose-sensing disorder caused by one disease-causing GCK variant. It was historically called MODY2. Heterozygous loss of glucokinase function raises the glucose concentration at which pancreatic beta cells begin releasing insulin, producing mild, stable fasting hyperglycemia from birth. It is fundamentally a reset glucose thermostat, not progressive autoimmune beta-cell destruction, so isolated GCK-MODY usually does not need glucose-lowering medication and rarely causes classic microvascular complications.",
    pathology: "Glucokinase phosphorylates glucose in beta cells and liver and acts as a glucose sensor. When one GCK copy has reduced function, more glucose is required to generate the ATP signal that initiates insulin release. The body regulates around this higher set point: fasting glucose is usually about 99-144 mg/dL (5.5-8.0 mmol/L), the rise after an oral glucose load is often modest, and beta-cell function deteriorates little beyond normal aging. This mechanism explains both the stable lifelong pattern and why routine drug treatment often lowers glucose only temporarily while adding hypoglycemia burden.",
    pathophysiology: [
      "Reduced glucokinase activity slows the first committed step of glucose metabolism in the beta cell, so the ATP/ADP ratio rises at a higher plasma glucose than usual.",
      "Delayed ATP signaling delays KATP-channel closure, membrane depolarization, calcium entry, and insulin granule release. Insulin secretion remains coordinated but around a higher threshold.",
      "The liver also senses glucose differently, contributing to the stable fasting elevation. Because beta cells are not being destroyed, C-peptide persists and ketosis is not an expected feature of isolated disease.",
      "During pregnancy, fetal genotype changes growth physiology. An affected fetus shares the higher set point and usually grows appropriately for that genotype; an unaffected fetus exposed to maternal hyperglycemia may secrete more insulin and grow excessively."
    ],
    etiology: "The usual cause is a heterozygous pathogenic or likely pathogenic loss-of-function variant in GCK, inherited in an autosomal-dominant pattern. Each child of an affected parent has a 50% chance of inheriting the variant. Biallelic loss of GCK is a different and much more severe disorder that can cause permanent neonatal diabetes; activating GCK variants can cause hyperinsulinemic hypoglycemia. Therefore, 'a GCK variant' is not enough—the variant effect, zygosity, classification, and phenotype must be correct. A GCK VUS does not establish GCK-MODY.",
    riskFactors: [
      "Incidental mild fasting hyperglycemia present on repeated tests and showing little progression over months or years",
      "A parent and multiple relatives with similarly mild fasting glucose, often labeled prediabetes, diet-controlled diabetes, or gestational diabetes",
      "A1C modestly elevated and disproportionate to a diagnosis of progressive type 1 or typical type 2 diabetes",
      "Negative islet autoantibodies, preserved C-peptide, absence of ketosis, and little response or need for glucose-lowering therapy",
      "Discovery during pregnancy or family screening; normal body weight can support suspicion but obesity can coexist and does not exclude GCK-MODY"
    ],
    signsSymptoms: [
      "Most individuals have no hyperglycemic symptoms because glucose elevation is mild and present from birth.",
      "Fasting glucose is consistently mildly elevated, commonly 99-144 mg/dL, with limited year-to-year progression unless another form of diabetes develops.",
      "Marked polyuria, weight loss, DKA, rapidly rising A1C, or severe post-meal hyperglycemia is not explained by isolated GCK-MODY and should trigger evaluation for an additional disorder.",
      "Pregnancy may be the first time the pattern is recognized; fetal growth direction depends in part on whether the fetus inherited the maternal GCK variant."
    ],
    diagnostics: [
      "Confirm the stable pattern with prior fasting glucose and A1C records. A typical oral glucose tolerance test may show a relatively small 2-hour increment, but overlap is substantial and an OGTT cannot provide a genetic diagnosis.",
      "Review age of first abnormal glucose, symptoms, ketosis, medications, BMI trajectory, pregnancy history, fetal growth, birth weights, and similarly mild results in relatives.",
      "Check islet autoantibodies and C-peptide when the assigned type is uncertain. Their pattern can make autoimmune diabetes less likely but cannot confirm GCK-MODY.",
      "Establish diagnosis with a clinically interpreted pathogenic/likely pathogenic heterozygous GCK variant consistent with the phenotype. A VUS must remain uncertain; pursue segregation and expert review rather than labeling the family.",
      "Look for coexisting type 1, type 2, steroid-related, pancreatic, or pregnancy-related diabetes if glucose becomes substantially higher or progressive. A confirmed GCK diagnosis does not make a patient immune to common diabetes."
    ],
    treatments: [
      "Outside pregnancy, most people with isolated GCK-MODY do not need insulin or oral glucose-lowering medication. Stopping unnecessary therapy after molecular confirmation should still be clinician-supervised so a coexisting cause is not missed.",
      "Use general nutrition, activity, blood-pressure, lipid, and preventive-health counseling without framing the inherited set point as a failure of lifestyle.",
      "In pregnancy, coordinate maternal-fetal medicine, endocrinology, and genetics. Management depends on likely or known fetal genotype and serial fetal growth: treating maternal glucose may be appropriate when the fetus is unaffected and showing excessive growth, while aggressive lowering can restrict growth in an affected fetus.",
      "If separate type 1 or type 2 diabetes develops, treat that additional physiology according to current standards rather than assuming all hyperglycemia remains benign GCK-MODY.",
      "Offer targeted testing and counseling to adult relatives after the familial pathogenic variant is confirmed; test children when the result will clarify persistent hyperglycemia or change care."
    ],
    contraindications: [
      "Do not intensify medication solely to normalize the inherited mild fasting set point in a nonpregnant patient with isolated confirmed GCK-MODY.",
      "Do not stop therapy from phenotype alone or a VUS; molecular confirmation and review for coexisting diabetes are required.",
      "Do not apply one pregnancy target or treatment rule without considering fetal genotype and growth; overtreatment can reduce fetal growth when the fetus also has GCK-MODY.",
      "Do not attribute catabolism, ketosis, major A1C progression, or symptomatic severe hyperglycemia to GCK-MODY.",
      "Do not confuse heterozygous GCK-MODY with biallelic GCK permanent neonatal diabetes or activating GCK hyperinsulinism."
    ],
    nursingPriorities: [
      "Confirm that the chart contains the actual GCK pathogenic/likely pathogenic result and whether any second diabetes diagnosis is present before changing monitoring or medication.",
      "Trend fasting glucose and A1C over time rather than reacting to one mild elevation; report a departure from the individual's stable pattern.",
      "Prevent medication-related hypoglycemia when unnecessary insulin or secretagogues are being de-escalated under clinician direction.",
      "During pregnancy, document fetal-growth surveillance, the agreed treatment threshold, maternal glucose data, and the newborn glucose-monitoring plan; do not improvise dose targets.",
      "Teach that the mild elevation is caused by a glucose-sensing set point, while preserving routine healthy-lifestyle and cardiovascular prevention counseling."
    ],
    redFlags: [
      "Ketones, vomiting, weight loss, dehydration, deep breathing, or altered mental status—these require evaluation for another or additional diabetes process",
      "Rapidly increasing glucose or A1C beyond the established stable range",
      "Severe or recurrent hypoglycemia caused by unnecessary treatment",
      "Pregnancy with accelerated or restricted fetal growth or unclear genotype-related plan",
      "A proposed family diagnosis or medication withdrawal based on a GCK VUS"
    ],
    complications: [
      "Classic retinopathy and nephropathy are uncommon in isolated GCK-MODY because hyperglycemia is mild, but ordinary age-related and cardiovascular risks still require care",
      "Hypoglycemia, burden, cost, and anxiety from unnecessary medication or excessive monitoring",
      "Fetal overgrowth when an unaffected fetus is exposed to maternal hyperglycemia, or reduced fetal growth when an affected fetus is exposed to unnecessary aggressive treatment",
      "Missed coexisting type 1 or type 2 diabetes if a rising glucose trajectory is dismissed as GCK-MODY",
      "Incorrect cascade testing and reproductive counseling after VUS misinterpretation"
    ],
    prognosis: "Isolated heterozygous GCK-MODY is usually lifelong but stable, asymptomatic, and associated with very low rates of classic glucose-mediated complications. It does not usually progress to insulin dependence. Prognosis changes if a separate diabetes process develops or if pregnancy is managed without attention to fetal genotype and growth. Correct diagnosis often improves quality of life by safely removing unnecessary treatment and by clarifying family results.",
    prevention: "The inherited set-point change cannot be prevented. Preventable harms include unnecessary treatment, hypoglycemia, missed coexisting diabetes, and poorly matched pregnancy therapy. Confirming the genotype, documenting the patient's expected glucose range, periodically watching for deviation, providing genetic counseling, and planning pregnancies and newborn observation reduce these risks.",
    patientEducation: [
      "Your glucose sensor is set slightly higher; this is why fasting glucose is mildly elevated even with healthy habits and why it usually changes little over time.",
      "Most nonpregnant people with confirmed GCK-MODY do not need diabetes medicine, but do not stop current treatment until your clinician confirms the diagnosis and excludes another cause.",
      "Call for review if glucose rises far above your usual range, you lose weight, develop ketones, or become very thirsty and dehydrated—GCK-MODY alone should not cause that pattern.",
      "Pregnancy is different because whether the fetus inherited the variant affects growth and treatment decisions; attend all fetal-growth and diabetes visits.",
      "A GCK VUS is not confirmation. Ask genetics what the laboratory classification means for you and relatives."
    ],
    nclexTraps: [
      "GCK-MODY is MODY2, but gene-first terminology is safer and more informative.",
      "Stable mild fasting hyperglycemia reflects a raised sensing threshold, not progressive beta-cell loss.",
      "Routine glucose-lowering medication is usually unnecessary outside pregnancy; more treatment can add hypoglycemia without changing long-term biology.",
      "Pregnancy management depends on fetal genotype or growth, so 'never treat GCK-MODY' is incorrect.",
      "Severe symptoms or DKA require another explanation; never dismiss them because a GCK variant is present."
    ],
    relatedTopics: ["Maturity-onset diabetes of the young", "Glucokinase", "Gestational diabetes mellitus", "Oral glucose tolerance test", "Genetic counseling", "Neonatal diabetes mellitus", "Hypoglycemia"],
    aliases: ["MODY2", "MODY 2", "GCK MODY", "glucokinase MODY", "glucokinase-related diabetes", "glucokinase diabetes", "familial mild fasting hyperglycemia", "GCK-related fasting hyperglycemia"],
    abbreviations: ["GCK-MODY", "MODY2"],
    commonMisspellings: ["glucokinace MODY", "glucokinese diabetes", "GCK MODDY", "MODY type 2"],
    tags: ["GCK-MODY", "MODY2", "glucokinase", "mild stable fasting hyperglycemia", "glucose sensing set point", "no treatment MODY", "GCK pregnancy fetal genotype", "autosomal dominant diabetes"],
    sourceKeys: ["w41-genereviews-mody", "w41-niddk-monogenic", "w41-ada-classification-2026"]
  };

  const hnf1aMody = {
    name: "HNF1A-MODY",
    displayName: "HNF1A-MODY (Hepatocyte Nuclear Factor 1-Alpha Diabetes)",
    category: "Endocrinology, Diabetes & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "HNF1A-MODY is an autosomal-dominant, progressive insulin-secretory disorder caused by a pathogenic HNF1A variant; its historical alias is MODY3. Beta cells function adequately early in life but progressively lose the transcriptional program needed for glucose-stimulated insulin secretion. The kidney also reabsorbs less glucose, so glycosuria can appear at lower plasma glucose than expected. Many patients are highly sensitive to low-dose sulfonylureas, but that useful clue becomes dangerous if it leads to unmonitored treatment or hypoglycemia.",
    pathology: "HNF1A is a transcription factor that regulates genes in pancreatic beta cells, liver, kidney, and other tissues. Reduced dosage does not abruptly destroy beta cells; it gradually weakens insulin release as glucose rises. Early fasting values may be near normal while post-meal glucose and urinary glucose are already abnormal. With time, endogenous insulin becomes insufficient and clinically important hyperglycemia develops. Because glucose exposure can become substantial, retinopathy, nephropathy, and neuropathy are real risks, unlike the very low complication risk of GCK-MODY.",
    pathophysiology: [
      "Reduced HNF1A transcription impairs beta-cell glucose metabolism and insulin-secretory capacity. The progressive defect explains why relatives with the same variant can be normoglycemic when young and diabetic later.",
      "The renal glucose threshold is reduced because HNF1A influences tubular glucose handling. Glucose can spill into urine before plasma glucose reaches the usual renal threshold, so glycosuria is a clue but not a diagnostic test.",
      "Sulfonylureas bind SUR1 on the KATP channel and amplify depolarization and insulin release downstream of the transcriptional defect. Residual beta-cell capacity makes many patients unusually responsive to small doses.",
      "As beta-cell reserve declines, fasting glucose and A1C rise and some patients ultimately need combination therapy or insulin despite an initially excellent sulfonylurea response."
    ],
    etiology: "A heterozygous pathogenic or likely pathogenic HNF1A variant usually causes disease with autosomal-dominant inheritance and high but age-dependent penetrance. Each child of an affected person generally has a 50% chance of inheriting the variant, but onset and severity vary. A de novo variant is possible. HNF1A variants also require formal classification: a VUS, a rare variant without sufficient evidence, or an HNF1A risk allele must not be treated as confirmed MODY3.",
    riskFactors: [
      "Young-onset progressive diabetes across successive generations, often initially labeled type 1 or lean type 2 diabetes",
      "Negative islet autoantibodies with persistent C-peptide beyond the expected type 1 honeymoon",
      "Glycosuria at a plasma glucose lower than usually expected or a large post-meal glucose rise before marked fasting hyperglycemia",
      "A striking glucose response or hypoglycemia with a small sulfonylurea dose",
      "A known familial pathogenic HNF1A variant; obesity or insulin resistance can coexist and should not automatically exclude testing"
    ],
    signsSymptoms: [
      "Early disease may be asymptomatic and found through family screening, glycosuria, pregnancy testing, or post-meal hyperglycemia.",
      "Progression causes polyuria, polydipsia, fatigue, blurred vision, weight loss, infections, and increasing A1C.",
      "Urine glucose may be positive when the concurrent blood glucose seems too low to explain it; this reflects a low renal threshold, not primary kidney failure.",
      "DKA is not the usual initial pattern while endogenous insulin persists, but ketosis can occur with advanced insulin deficiency, severe illness, or inappropriate insulin withdrawal.",
      "Microvascular signs can develop after years of poor control and must not be discounted because the condition is genetic."
    ],
    diagnostics: [
      "Confirm diabetes and review the longitudinal pattern, including post-meal values, glycosuria, medication response, ketosis, insulin requirements, and age of onset in relatives.",
      "Use islet autoantibodies and glucose-paired C-peptide to assess competing type 1 diabetes. Negative antibodies and persistent secretion support testing but do not prove HNF1A disease.",
      "Construct a three-generation pedigree and distinguish true diabetes from a relative's single borderline result. Age-dependent penetrance means young carriers may not yet have hyperglycemia.",
      "Confirm with a pathogenic/likely pathogenic HNF1A variant in a qualified laboratory. Sequence and deletion/duplication methods may be used according to the testing strategy; a VUS cannot direct a sulfonylurea switch or predictive family testing.",
      "Differentiate HNF4A-MODY, GCK-MODY, type 1, type 2, LADA, mitochondrial diabetes, and HNF1B disease. Neonatal macrosomia/hypoglycemia favors HNF4A; stable mild fasting glucose favors GCK; renal structural disease favors HNF1B."
    ],
    treatments: [
      "A low-dose sulfonylurea is often first-line after molecular confirmation because residual beta cells can respond strongly. Start and titrate under a clinician familiar with HNF1A-MODY; lower doses than typical type 2 regimens may be sufficient.",
      "Use frequent glucose monitoring during initiation or transition from insulin. Do not simply stop insulin and begin a tablet; retain a rescue and ketone plan until response and endogenous reserve are clear.",
      "If sulfonylurea becomes inadequate or causes unacceptable hypoglycemia, individualize other agents or insulin with specialist review. Progressive secretory failure can eventually require insulin.",
      "Apply standard retinal, kidney, neuropathy, foot, blood-pressure, lipid, smoking, and cardiovascular prevention because chronic hyperglycemia produces ordinary diabetes complications.",
      "Coordinate pregnancy with maternal-fetal medicine and endocrinology; insulin is commonly used when tighter controllability or fetal safety is needed, and neonatal glucose observation should follow the genotype-informed plan."
    ],
    contraindications: [
      "Do not initiate or intensify sulfonylurea from phenotype or a VUS alone; hypoglycemia sensitivity can be substantial.",
      "Do not confuse glycosuria with proof of uncontrolled plasma glucose or use urine glucose alone to adjust medication.",
      "Do not promise that sulfonylurea will permanently replace insulin; response depends on remaining beta-cell reserve, duration, and molecular diagnosis.",
      "Do not omit standard complication screening—the risk is not benign when A1C is elevated.",
      "Do not withhold insulin during DKA, severe illness, catabolism, or a failed tablet transition."
    ],
    nursingPriorities: [
      "Verify the HNF1A pathogenic/likely pathogenic result and the prescribed transition plan before changing insulin or administering a secretagogue.",
      "Teach and monitor for sulfonylurea hypoglycemia, including delayed or prolonged episodes, missed-meal risk, exercise, alcohol interaction, driving safety, and access to rapid carbohydrate and glucagon when prescribed.",
      "Track fasting and post-meal glucose, A1C, ketones during illness or sustained hyperglycemia, and signs that beta-cell reserve is declining.",
      "Explain that urine glucose is unusually easy to produce in this subtype; base safety decisions on blood or sensor glucose and symptoms, not urine glucose alone.",
      "Ensure ongoing eye, kidney, foot, neuropathy, cardiovascular, pregnancy, and family-genetics follow-up."
    ],
    redFlags: [
      "Severe, recurrent, nocturnal, or prolonged hypoglycemia after sulfonylurea therapy",
      "Ketones, vomiting, deep breathing, dehydration, weight loss, or rising glucose during insulin withdrawal or illness",
      "Rapid loss of glycemic response suggesting progressive insulin deficiency or an additional diagnosis",
      "Pregnancy with unstable glucose or absent maternal-fetal specialist plan",
      "Medication change based on 'MODY3' family lore or an HNF1A VUS without a verified report"
    ],
    complications: [
      "Retinopathy, nephropathy, neuropathy, cardiovascular disease, foot disease, and pregnancy complications from sustained hyperglycemia",
      "Severe or prolonged sulfonylurea-associated hypoglycemia",
      "DKA or catabolism after unsafe insulin discontinuation in a person with advanced secretory failure",
      "Progressive treatment failure as beta-cell reserve declines",
      "Misclassification of young relatives before penetrance is expressed or after VUS misuse"
    ],
    prognosis: "HNF1A-MODY is usually progressive, but molecularly matched therapy can provide excellent control for years. Prognosis depends on early recognition, A1C exposure, hypoglycemia avoidance, and cardiovascular and microvascular prevention. Sulfonylurea responsiveness is common rather than guaranteed forever. Relatives who carry the pathogenic variant require age-appropriate surveillance because a currently normal glucose does not remove future risk.",
    prevention: "The pathogenic variant cannot be prevented. Preventable complications are reduced through early family identification, glucose surveillance before symptoms, careful low-dose therapy, hypoglycemia education, standard retinal and kidney screening, cardiovascular risk control, smoking avoidance, sick-day planning, and pregnancy preparation.",
    patientEducation: [
      "HNF1A-MODY gradually weakens insulin release; it is not caused by personal failure and is not the same as mild GCK-MODY.",
      "Many people respond strongly to a sulfonylurea, so take exactly the prescribed dose, do not skip meals, and carry rapid sugar.",
      "Do not stop insulin unless your diabetes specialist gives a monitored transition and ketone plan.",
      "Urine glucose can appear at lower blood glucose in this condition. Check blood or sensor glucose when making treatment decisions.",
      "Because high glucose can cause eye, kidney, nerve, and cardiovascular complications, keep routine diabetes screening even when a small tablet controls it well."
    ],
    nclexTraps: [
      "HNF1A-MODY is MODY3, not type 3 diabetes and not pancreatic type 3c diabetes.",
      "Low renal glucose threshold explains glycosuria; it does not mean a normal blood glucose requires emergency treatment.",
      "Sulfonylurea sensitivity supports mechanism-directed care but also creates a major hypoglycemia risk.",
      "Unlike GCK-MODY, HNF1A-MODY is progressive and carries meaningful microvascular risk when poorly controlled.",
      "A normal young relative may still carry the familial variant because penetrance is age-dependent."
    ],
    relatedTopics: ["Maturity-onset diabetes of the young", "HNF4A-MODY", "GCK-MODY", "Sulfonylureas", "C-peptide", "Islet autoantibodies", "Glycosuria", "Hypoglycemia", "Diabetic ketoacidosis"],
    aliases: ["MODY3", "MODY 3", "HNF1A MODY", "HNF-1-alpha MODY", "hepatocyte nuclear factor 1 alpha diabetes", "HNF1 alpha diabetes", "familial sulfonylurea-sensitive diabetes"],
    abbreviations: ["HNF1A-MODY", "MODY3"],
    commonMisspellings: ["HNF1 MODY", "HNF1A MODDY", "hepatocyte nuclear factor one alpha diabeties", "MODY type 3"],
    tags: ["HNF1A-MODY", "MODY3", "progressive insulin secretion defect", "low renal glucose threshold", "glycosuria", "sulfonylurea sensitive diabetes", "autosomal dominant diabetes", "young onset diabetes"],
    sourceKeys: ["w41-genereviews-mody", "w41-niddk-monogenic", "w41-ada-classification-2026"]
  };

  const hnf4aMody = {
    name: "HNF4A-MODY",
    displayName: "HNF4A-MODY (Hepatocyte Nuclear Factor 4-Alpha Diabetes)",
    category: "Endocrinology, Diabetes & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "HNF4A-MODY is an autosomal-dominant, progressive insulin-secretory disorder caused by a pathogenic HNF4A variant and historically called MODY1. It often resembles HNF1A-MODY in adolescence or adulthood and can respond strongly to sulfonylureas. Its distinctive clue comes earlier: an affected fetus may grow large and develop transient hyperinsulinemic hypoglycemia after birth, even though the same variant later impairs insulin secretion and causes diabetes. This age-dependent reversal is why pregnancy and newborn history matter.",
    pathology: "HNF4A is a transcription factor upstream of HNF1A and regulates beta-cell, liver, and metabolic genes. During fetal and neonatal life, some pathogenic variants paradoxically increase insulin secretion, producing macrosomia and hypoglycemia. Later, the beta-cell transcriptional network cannot sustain normal glucose-stimulated insulin release, so glucose tolerance progressively worsens. A family can therefore contain a hypoglycemic newborn, an asymptomatic child, and a sulfonylurea-treated adult carrying the same variant.",
    pathophysiology: [
      "Altered HNF4A-dependent transcription disrupts the coordinated expression of genes needed for mature beta-cell glucose sensing and insulin release. Secretory reserve declines with age rather than disappearing abruptly.",
      "In utero, variant-related hyperinsulinism can accelerate fetal growth because insulin is a major fetal growth signal. After delivery, continued insulin release without placental glucose can cause neonatal hypoglycemia.",
      "Later progressive insulin-secretory failure raises post-meal and then fasting glucose. Residual beta cells often remain responsive to KATP-channel closure by sulfonylureas.",
      "The phenotype is variable: absence of macrosomia or neonatal hypoglycemia does not exclude HNF4A-MODY, and not every large infant in an affected family inherited the variant."
    ],
    etiology: "A heterozygous pathogenic or likely pathogenic HNF4A variant usually causes autosomal-dominant disease; each child generally has a 50% chance of inheriting it. Penetrance and severity vary with age and variant. De novo disease can occur. Only a clinically interpreted pathogenic/likely pathogenic result that fits the family and phenotype should establish HNF4A-MODY; an HNF4A VUS cannot justify predictive testing, sulfonylurea conversion, or neonatal risk labeling.",
    riskFactors: [
      "Young-onset, nonautoimmune progressive diabetes affecting multiple successive generations",
      "Personal or family history of birth weight above expectation, fetal macrosomia, or transient neonatal hyperinsulinemic hypoglycemia",
      "Negative islet autoantibodies, preserved C-peptide, and strong response or hypoglycemia with a small sulfonylurea dose",
      "A parent labeled with gestational diabetes or young-onset type 2 diabetes and a child with neonatal hypoglycemia",
      "A known familial pathogenic HNF4A variant; absence of the classic neonatal history does not exclude it"
    ],
    signsSymptoms: [
      "Neonatal findings can include macrosomia and low glucose caused by excess fetal insulin; hypoglycemia may be transient but can be severe enough to require urgent treatment.",
      "Children carrying the variant may have normal glucose before later progressive secretory failure.",
      "Adolescent or adult diabetes can cause polyuria, polydipsia, fatigue, blurred vision, weight loss, infection, and rising A1C.",
      "The adult glucose phenotype can closely resemble HNF1A-MODY, including marked sulfonylurea sensitivity.",
      "Chronic poorly controlled hyperglycemia can produce ordinary retinal, kidney, nerve, pregnancy, and cardiovascular manifestations."
    ],
    diagnostics: [
      "Review both diabetes and perinatal history across three generations: birth weights, gestational age, neonatal glucose, need for IV dextrose, gestational diabetes, age at later diabetes onset, and treatment response.",
      "Evaluate the assigned diabetes type with islet autoantibodies and glucose-paired C-peptide when appropriate. These help select genetic testing but cannot distinguish HNF4A from HNF1A reliably.",
      "Confirm with a pathogenic/likely pathogenic HNF4A variant in a qualified clinical laboratory. Do not use a VUS as a predictive newborn or pregnancy result.",
      "Differentiate HNF1A-MODY, GCK-MODY, type 1, type 2, congenital hyperinsulinism, maternal diabetes-related macrosomia, and other causes of neonatal hypoglycemia. Birth size is influenced by both maternal glucose and fetal genotype.",
      "In an at-risk pregnancy, coordinate genetic counseling and fetal/newborn planning. Prenatal testing is a values-sensitive decision and does not replace fetal-growth or neonatal-glucose surveillance."
    ],
    treatments: [
      "After molecular confirmation, a low-dose sulfonylurea often controls diabetes because residual beta cells are highly responsive. Initiate and titrate cautiously with frequent glucose monitoring.",
      "Use insulin for DKA, marked catabolism, severe hyperglycemia, pregnancy when clinically preferred, or inadequate/unsafe secretagogue response. Insulin need does not invalidate the genetic diagnosis.",
      "Treat neonatal hypoglycemia immediately according to newborn protocols with feeding, dextrose, and escalation as severity requires; do not wait for the genetic result because prolonged neuroglycopenia can injure the brain.",
      "Apply standard eye, kidney, nerve, foot, blood-pressure, lipid, smoking, and cardiovascular prevention when hyperglycemia is clinically important.",
      "Provide genotype-aware pregnancy care and arrange newborn glucose observation even when prenatal genotype is unknown."
    ],
    contraindications: [
      "Do not delay treatment of neonatal hypoglycemia while debating whether the infant has inherited HNF4A disease.",
      "Do not infer fetal genotype from macrosomia alone; maternal glucose, placental factors, and other disorders can produce the same finding.",
      "Do not start sulfonylurea or stop insulin from a family story or VUS without a verified molecular diagnosis and monitored plan.",
      "Do not assume transient newborn hypoglycemia means lifelong hyperinsulinism; HNF4A can later cause the opposite problem of insulin-secretory failure.",
      "Do not omit standard complication surveillance in an adult whose glucose is well controlled on a small dose."
    ],
    nursingPriorities: [
      "For newborns at known or possible risk, ensure protocol-timed glucose checks, feeding support, thermal stability, rapid dextrose access, and prompt escalation for symptoms or persistent low values.",
      "Document birth weight, gestational age, maternal glucose, neonatal nadir and treatment, and the exact familial variant; these details guide later diagnosis and counseling.",
      "During adult sulfonylurea therapy or insulin-to-tablet transition, watch closely for prolonged hypoglycemia and verify meal, exercise, alcohol, illness, and driving safety education.",
      "Maintain ketone and sick-day education because progressive insulin deficiency can decompensate despite a historically tablet-responsive course.",
      "Coordinate pregnancy, neonatal, genetics, and long-term diabetes follow-up across services so the early hypoglycemia history is not lost."
    ],
    redFlags: [
      "Jitteriness, lethargy, apnea, poor feeding, cyanosis, temperature instability, seizure, or a low newborn glucose requiring immediate protocol-based treatment",
      "Severe or recurrent hypoglycemia in a patient taking sulfonylurea or insulin",
      "Ketones, vomiting, deep breathing, dehydration, or catabolic weight loss",
      "Pregnancy without fetal-growth and newborn-glucose planning in a confirmed HNF4A family",
      "A treatment or reproductive decision based on an HNF4A VUS"
    ],
    complications: [
      "Neuroglycopenic injury if significant neonatal hypoglycemia is delayed or recurrent",
      "Retinopathy, nephropathy, neuropathy, cardiovascular disease, and pregnancy complications from later chronic hyperglycemia",
      "Severe sulfonylurea-associated hypoglycemia",
      "DKA after unsafe insulin withdrawal or advanced secretory failure",
      "Incorrect recurrence counseling if fetal and maternal genotype effects are conflated"
    ],
    prognosis: "The neonatal hypoglycemia often resolves, but carriers remain at substantial age-dependent risk for later diabetes. Adult glycemia can respond extremely well to sulfonylurea, although secretory failure may progress and complications follow cumulative glucose exposure. Early recognition improves newborn safety, allows appropriate family surveillance, and can simplify adult therapy. A normal childhood glucose in a carrier is not proof that diabetes will never develop.",
    prevention: "The variant cannot be prevented. Preventable harms include untreated neonatal hypoglycemia, sulfonylurea-related hypoglycemia, delayed adult diagnosis, and missed pregnancy planning. Genetic counseling, antenatal coordination, newborn screening, age-appropriate glucose surveillance in confirmed carriers, and routine diabetes complication prevention address these risks.",
    patientEducation: [
      "The same HNF4A variant can cause too much insulin around birth and too little effective insulin later in life; the apparent contradiction reflects changing beta-cell biology with age.",
      "Tell obstetric and newborn teams about the familial diagnosis before delivery so the baby's glucose can be checked promptly.",
      "Take sulfonylurea exactly as directed, carry rapid sugar, and report recurrent lows; many people with this subtype are unusually sensitive.",
      "A child with a confirmed variant may have normal glucose for years and still needs the follow-up plan recommended by genetics and endocrinology.",
      "Do not use a VUS to predict that a baby will have hypoglycemia or later diabetes."
    ],
    nclexTraps: [
      "HNF4A-MODY is MODY1; the number does not mean type 1 diabetes.",
      "Macrosomia and transient neonatal hypoglycemia are distinctive clues because fetal hyperinsulinism can precede later insulin deficiency.",
      "Treat a symptomatic low newborn glucose first; genetics explains risk but does not replace emergency stabilization.",
      "Like HNF1A-MODY, HNF4A often responds to low-dose sulfonylurea and therefore has important hypoglycemia risk.",
      "Absence of neonatal hypoglycemia does not rule out HNF4A-MODY."
    ],
    relatedTopics: ["Maturity-onset diabetes of the young", "HNF1A-MODY", "Neonatal hypoglycemia", "Macrosomia", "Sulfonylureas", "Gestational diabetes mellitus", "Genetic counseling", "C-peptide"],
    aliases: ["MODY1", "MODY 1", "HNF4A MODY", "HNF-4-alpha MODY", "hepatocyte nuclear factor 4 alpha diabetes", "HNF4 alpha diabetes", "MODY with neonatal hypoglycemia"],
    abbreviations: ["HNF4A-MODY", "MODY1"],
    commonMisspellings: ["HNF4 MODY", "HNF4A MODDY", "hepatocyte nuclear factor four alpha diabeties", "MODY type 1"],
    tags: ["HNF4A-MODY", "MODY1", "neonatal hypoglycemia", "fetal macrosomia", "progressive insulin secretion defect", "sulfonylurea sensitive diabetes", "autosomal dominant diabetes", "pregnancy genetic diabetes"],
    sourceKeys: ["w41-genereviews-mody", "w41-niddk-monogenic", "w41-ada-classification-2026"]
  };

  const hnf1bDiabetes = {
    name: "HNF1B-related diabetes",
    displayName: "HNF1B-Related Diabetes (Renal Cysts and Diabetes Syndrome)",
    category: "Endocrinology, Nephrology & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "HNF1B-related diabetes is a multisystem developmental disorder caused by a pathogenic HNF1B variant or deletion. Its historical aliases include HNF1B-MODY, MODY5, and renal cysts and diabetes (RCAD) syndrome, but the kidney and other organs may be affected more prominently than diabetes. HNF1B helps form and regulate the kidneys, pancreas, genital tract, and liver. Diabetes can reflect pancreatic hypoplasia, reduced beta-cell mass, abnormal secretion, and sometimes insulin resistance; many patients eventually require insulin rather than showing the classic sulfonylurea sensitivity of HNF1A-MODY.",
    pathology: "HNF1B is a transcription factor active during organ development. Haploinsufficiency can produce renal cysts, dysplasia, tubulointerstitial disease, congenital anomalies of the kidney and urinary tract, magnesium wasting, hyperuricemia, genital-tract anomalies, abnormal liver enzymes, pancreatic hypoplasia, and exocrine pancreatic insufficiency. The diabetes phenotype varies because both pancreatic structure and beta-cell function can be impaired. A whole-gene deletion may occur alone or as part of a 17q12 recurrent deletion with neurodevelopmental or psychiatric features.",
    pathophysiology: [
      "Abnormal renal development can reduce nephron mass or alter collecting-system structure, producing cysts, dysplasia, declining kidney function, and urinary-tract complications.",
      "Renal tubular dysfunction can waste magnesium and alter urate handling, causing hypomagnesemia, hyperuricemia, or gout; these findings may precede diabetes.",
      "Pancreatic hypoplasia or maldevelopment reduces beta-cell and sometimes exocrine tissue. Less insulin secretion causes hyperglycemia, while inadequate digestive enzymes cause steatorrhea, weight loss, and fat-soluble vitamin risk.",
      "Genital-tract, liver, and other developmental findings arise because HNF1B regulates programs shared across organs. A deletion spanning neighboring genes can broaden the phenotype beyond a sequence variant confined to HNF1B."
    ],
    etiology: "A heterozygous pathogenic/likely pathogenic HNF1B sequence variant, intragenic deletion, whole-gene deletion, or 17q12 deletion causes the disorder, usually with autosomal-dominant inheritance. Many cases are de novo, so a negative family history is common. Each child of an affected individual generally has a 50% chance of inheriting the variant or deletion, but expression is highly variable. Sequence-only testing can miss a deletion, and an HNF1B VUS does not establish MODY5 or RCAD.",
    riskFactors: [
      "Renal cysts, dysplasia, a solitary or small kidney, congenital urinary-tract anomaly, or unexplained chronic kidney disease plus diabetes",
      "Persistent hypomagnesemia from renal wasting, hyperuricemia or early gout, or unexplained liver-enzyme elevation",
      "Pancreatic hypoplasia, exocrine pancreatic insufficiency, steatorrhea, poor weight gain, or fat-soluble vitamin deficiency",
      "Uterine, vaginal, vas deferens, epididymal, or other genital-tract malformation",
      "Diabetes that does not fit type 1 or type 2 and is not strongly sulfonylurea-responsive",
      "Neurodevelopmental, learning, autism-spectrum, or psychiatric features suggesting a larger 17q12 deletion; absence of family history does not lower suspicion substantially because de novo disease is common"
    ],
    signsSymptoms: [
      "Kidney findings may precede glucose abnormalities and range from asymptomatic structural anomalies to hypertension, reduced filtration, electrolyte loss, recurrent urinary issues, or progressive chronic kidney disease.",
      "Diabetes causes ordinary polyuria, polydipsia, weight loss, blurred vision, fatigue, and infections; severity and age at onset vary.",
      "Hypomagnesemia may cause weakness, tremor, cramps, seizures, or dysrhythmia when severe, although it is often discovered on laboratory testing.",
      "Exocrine pancreatic insufficiency can cause greasy stools, bloating, poor growth, weight loss, and deficiency of vitamins A, D, E, or K.",
      "Genital-tract anomalies, gout, abnormal liver tests, or developmental/psychiatric findings may provide the clue that diabetes is part of a wider syndrome."
    ],
    diagnostics: [
      "Evaluate the full phenotype rather than ordering a diabetes-only panel: renal ultrasound or prior imaging, kidney function, urinalysis/albumin, blood pressure, magnesium, potassium, urate, liver tests, pancreatic anatomy and exocrine function when symptomatic, and reproductive history.",
      "Assess the diabetes mechanism with glucose/A1C, islet autoantibodies, and glucose-paired C-peptide as clinically indicated. Kidney dysfunction can raise C-peptide by reducing clearance, so interpret it cautiously.",
      "Use molecular testing that can detect both sequence variants and deletion/duplication changes. If a whole-gene or larger deletion is suspected, chromosomal microarray or another copy-number method may be necessary.",
      "A pathogenic/likely pathogenic HNF1B result or 17q12 deletion that matches the phenotype establishes the molecular diagnosis. A VUS does not; obtain genetics review and do not use it for family prediction.",
      "Differentiate cystic kidney disorders, diabetic nephropathy, GCK/HNF1A/HNF4A MODY, pancreatic diabetes, cystic fibrosis, mitochondrial disease, and medication-related diabetes. Kidney disease before diabetes strongly argues against simply calling it diabetic nephropathy."
    ],
    treatments: [
      "Individualize glucose therapy to endogenous secretion and kidney function. Many patients need insulin; some may respond to noninsulin therapy early, but HNF1B disease should not be assumed sulfonylurea-sensitive.",
      "Manage chronic kidney disease, hypertension, albuminuria, magnesium wasting, hyperuricemia/gout, and urinary-tract problems with nephrology as indicated. Drug choice and dose must account for kidney function.",
      "Provide pancreatic enzyme replacement and nutrition/fat-soluble vitamin management when exocrine insufficiency is established; enzymes treat malabsorption, not the insulin deficiency itself.",
      "Coordinate gynecologic/urologic, liver, developmental, psychiatric, and reproductive care according to the individual's findings and whether a 17q12 deletion is present.",
      "Offer genetic counseling and targeted testing after the causal variant/deletion is confirmed; pregnancy planning should address kidney status, diabetes, medication safety, and inheritance."
    ],
    contraindications: [
      "Do not label renal disease as a late diabetes complication when structural anomalies or electrolyte wasting predated hyperglycemia.",
      "Do not prescribe a universal MODY sulfonylurea strategy; HNF1B-related insulin deficiency often requires insulin and kidney disease alters medication safety.",
      "Do not rely on sequence-only testing when deletion/duplication disease or 17q12 deletion is possible.",
      "Do not correct recurrent hypomagnesemia once and ignore the renal-wasting mechanism; ongoing replacement and surveillance may be needed.",
      "Do not use a VUS to diagnose relatives or explain every renal cyst—common incidental cysts have a broad differential."
    ],
    nursingPriorities: [
      "Trend glucose, ketones when ill, insulin needs, kidney function, urine albumin, blood pressure, magnesium, potassium, urate, and medication renal dosing.",
      "Escalate symptomatic or severe hypomagnesemia and monitor ECG when ordered because neuromuscular symptoms and dysrhythmias can occur.",
      "Assess stool quality, weight, growth, nutrition, enzyme timing with meals/snacks, and fat-soluble vitamin monitoring when pancreatic insufficiency is present.",
      "Protect remaining kidney function through medication reconciliation, avoidance of unreviewed nephrotoxins, hydration guidance appropriate to renal status, and timely nephrology follow-up.",
      "Ensure handoffs name the HNF1B or 17q12 diagnosis and list affected organs; a diabetes-only handoff can miss the highest-priority renal or electrolyte problem.",
      "Coordinate genetics and reproductive counseling with sensitivity to de novo disease and variable expression; a mildly affected parent can have a more affected child and vice versa."
    ],
    redFlags: [
      "Ketones, vomiting, deep breathing, dehydration, or rapidly rising glucose suggesting severe insulin deficiency or DKA",
      "Severe weakness, tetany, seizure, syncope, palpitations, or dysrhythmia with hypomagnesemia",
      "Acute kidney injury, falling urine output, severe hypertension, obstruction, infection, or rapid decline in kidney function",
      "Failure to thrive, marked weight loss, persistent steatorrhea, or evidence of fat-soluble vitamin deficiency",
      "Pregnancy with significant kidney disease, uncontrolled diabetes, or no coordinated genetics/maternal-fetal plan"
    ],
    complications: [
      "Progressive chronic kidney disease, hypertension, electrolyte disorders, gout, urinary-tract complications, and possible kidney failure",
      "DKA, severe hyperglycemia, hypoglycemia, and ordinary microvascular or cardiovascular diabetes complications",
      "Malnutrition, poor growth, bone disease, and fat-soluble vitamin deficiency from pancreatic exocrine insufficiency",
      "Reproductive-tract complications and pregnancy risks",
      "Developmental, learning, autism-spectrum, or psychiatric morbidity in some people with a broader 17q12 deletion"
    ],
    prognosis: "Outcome varies widely. Kidney disease may be the dominant determinant and can progress independently of glucose control. Diabetes often becomes insulin-requiring, while exocrine, electrolyte, reproductive, hepatic, and neurodevelopmental findings require parallel care. Molecular diagnosis improves prognosis by unifying apparently unrelated problems, selecting copy-number and family testing correctly, and preventing the mistaken assumption that every renal abnormality is a diabetes complication.",
    prevention: "The developmental disorder cannot be prevented. Preventable harm is reduced by early recognition of congenital renal disease, blood-pressure and kidney protection, repeated electrolyte surveillance, appropriate insulin and sick-day management, pancreatic nutrition support, medication renal-dose review, family counseling, and planned pregnancy care.",
    patientEducation: [
      "HNF1B affects organ development, so the kidney, magnesium level, pancreas, liver, and reproductive tract may need care in addition to blood glucose.",
      "This form often needs insulin and does not follow the same tablet rule as HNF1A- or HNF4A-MODY.",
      "Report reduced urine, swelling, fever with urinary symptoms, severe cramps, palpitations, greasy stools, or unexplained weight loss promptly.",
      "Take pancreatic enzymes with the foods specified by your care plan; they help absorb nutrients but do not replace insulin.",
      "Ask whether your result is an HNF1B sequence variant, a whole-gene deletion, or a 17q12 deletion because surveillance and family counseling can differ."
    ],
    nclexTraps: [
      "HNF1B-related diabetes is MODY5/RCAD, but kidney disease is often more prominent than diabetes.",
      "Renal cysts plus diabetes are a clue, not proof; molecular confirmation and a full renal differential are required.",
      "Hypomagnesemia reflects renal wasting and may be a key diagnostic clue.",
      "Unlike HNF1A/HNF4A, HNF1B diabetes is often not strongly sulfonylurea-responsive and commonly requires insulin.",
      "A negative family history does not exclude HNF1B because de novo variants and deletions are common."
    ],
    relatedTopics: ["Maturity-onset diabetes of the young", "Renal cysts", "Chronic kidney disease", "Hypomagnesemia", "Pancreatic exocrine insufficiency", "17q12 deletion syndrome", "Genetic testing", "Insulin"],
    aliases: ["HNF1B-MODY", "HNF1B MODY", "MODY5", "MODY 5", "renal cysts and diabetes syndrome", "RCAD syndrome", "renal cysts and diabetes", "HNF-1-beta diabetes", "HNF1B disease"],
    abbreviations: ["HNF1B-MODY", "RCAD", "MODY5"],
    commonMisspellings: ["HNF1B MODDY", "HNF1 beta diabeties", "renal cyst diabetes syndrome", "MODY type 5"],
    tags: ["HNF1B-related diabetes", "MODY5", "RCAD", "renal cysts and diabetes", "hypomagnesemia", "pancreatic hypoplasia", "exocrine pancreatic insufficiency", "17q12 deletion", "congenital kidney anomalies"],
    sourceKeys: ["w41-genereviews-mody", "w41-genereviews-pndm", "w41-niddk-dia-monogenic", "w41-ada-classification-2026"]
  };

  const katpDiabetes = {
    name: "KATP-channel monogenic diabetes",
    displayName: "KATP-Channel Monogenic Diabetes (KCNJ11- or ABCC8-Related)",
    category: "Endocrinology, Neonatology & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "KATP-channel monogenic diabetes is diabetes caused by an activating pathogenic variant in KCNJ11 or ABCC8, the genes encoding the Kir6.2 pore and SUR1 regulatory subunit of the pancreatic beta-cell ATP-sensitive potassium channel. It most often presents as transient or permanent neonatal diabetes, although rare later-onset/MODY phenotypes occur. The channel remains too open when glucose raises ATP, preventing membrane depolarization, calcium entry, and insulin release. Many affected people can replace injected insulin with an oral sulfonylurea because that drug closes the channel through SUR1—but only after molecular confirmation and a specialist-supervised transition.",
    pathology: "The KATP channel couples beta-cell energy state to electrical insulin secretion. Four Kir6.2 subunits form the potassium pore and four SUR1 subunits regulate it. Normally, glucose metabolism raises ATP and closes the channel; potassium stops leaving, the membrane depolarizes, voltage-gated calcium channels open, and insulin granules fuse. Activating variants resist ATP-mediated closure, so the beta cell may contain insulin yet fail to release it. KATP channels also function in the nervous system, explaining developmental delay, hypotonia, epilepsy, attention, sleep, or motor findings—especially with KCNJ11 DEND-spectrum variants.",
    pathophysiology: [
      "Activating KCNJ11 or ABCC8 variants increase KATP current or reduce ATP sensitivity. Persistent potassium efflux holds the membrane hyperpolarized and interrupts calcium-triggered exocytosis.",
      "Reduced fetal insulin impairs growth, so low birth weight can be an early clue. After birth, insulin deficiency causes hyperglycemia, osmotic diuresis, dehydration, poor weight gain, and sometimes DKA.",
      "Sulfonylureas bind SUR1 and close many mutant channels through an ATP-independent route. This restores electrical activity and endogenous insulin secretion, explaining why a tablet can succeed after years of insulin in a confirmed responsive genotype.",
      "Neuronal KATP dysfunction can produce developmental delay, epilepsy, and neonatal diabetes (DEND) or intermediate DEND. Earlier effective channel closure may improve some neurologic features, but response is variable and developmental support remains necessary.",
      "Less severe activating variants can remit after infancy or present later. Inactivating variants in the same genes cause congenital hyperinsulinism—the opposite glucose phenotype—so variant direction is essential."
    ],
    etiology: "Activating pathogenic/likely pathogenic variants in KCNJ11 or ABCC8 cause the disorder. KCNJ11 neonatal disease is often autosomal dominant and de novo; ABCC8 disease can be dominant or recessive, and mosaicism or variable expression can complicate counseling. A given variant may cause permanent, transient, or later-onset diabetes and may or may not include neurologic features. A KCNJ11/ABCC8 VUS does not establish channel diabetes, and an inactivating variant can cause hyperinsulinism rather than diabetes.",
    riskFactors: [
      "Diabetes diagnosed before age 6 months, especially with low birth weight, dehydration, poor growth, DKA, or no islet autoimmunity",
      "Neonatal diabetes accompanied by developmental delay, hypotonia, muscle weakness, epilepsy, attention, sleep, or motor problems",
      "Transient neonatal diabetes that remits and later relapses",
      "A relative with neonatal or unusual young-onset diabetes and a confirmed KCNJ11 or ABCC8 pathogenic variant",
      "Long-standing presumed type 1 diabetes beginning in infancy with absent autoantibodies and a clinical history predating typical autoimmune onset"
    ],
    signsSymptoms: [
      "Neonates can present with hyperglycemia, glycosuria, osmotic polyuria, severe dehydration, low birth weight, failure to thrive, or DKA.",
      "Permanent disease requires ongoing therapy; transient disease may enter remission in infancy and relapse during adolescence, adulthood, pregnancy, illness, or metabolic stress.",
      "DEND syndrome includes developmental delay, epilepsy, and neonatal diabetes; intermediate DEND can have developmental or motor problems without epilepsy.",
      "Older patients may have isolated diabetes, reduced insulin needs, or a family pattern that resembles rare MODY.",
      "During a successful sulfonylurea transition, endogenous insulin response improves; during an unsuccessful transition, sustained hyperglycemia and ketones signal inadequate channel closure or reserve."
    ],
    diagnostics: [
      "Stabilize the infant first, then obtain prompt monogenic testing for all diabetes diagnosed before 6 months. Do not require a family history because de novo variants are common.",
      "Use a neonatal-diabetes panel or equivalent testing that includes KCNJ11 and ABCC8 and other major genes. Confirm pathogenicity, activating effect/known phenotype, zygosity, and inheritance through a qualified laboratory.",
      "Perform a careful neurologic and developmental assessment, hearing/vision review, growth evaluation, and seizure history; use neurology, EEG, and therapy assessments when indicated.",
      "A VUS or an unspecified 'KATP mutation' is not enough to switch therapy. Inactivating KCNJ11/ABCC8 variants can cause hyperinsulinemic hypoglycemia, so the molecular mechanism must be verified.",
      "Differentiate INS-related diabetes, 6q24 transient neonatal diabetes, pancreatic-development disorders, congenital infection/stress hyperglycemia, and rare autoimmune diabetes after 6 months. Clinical course alone cannot reliably predict transient versus permanent disease."
    ],
    treatments: [
      "Treat initial dehydration, electrolyte disturbance, DKA, and severe insulin deficiency promptly with neonatal/pediatric protocols and insulin. Do not delay stabilization for genetic results.",
      "For a confirmed responsive activating KCNJ11 or ABCC8 variant, a specialist may transition from insulin to sulfonylurea using a structured high-intensity protocol with frequent glucose, ketone, feeding, and hypoglycemia monitoring. The required dose can exceed standard type 2 dosing and must never be improvised.",
      "Continue insulin when the genotype is nonresponsive, the transition fails, or acute physiology requires it. Never omit basal coverage before the team has shown adequate endogenous secretion.",
      "Provide developmental, neurologic, physical, occupational, speech, educational, and seizure care for DEND-spectrum disease; glycemic improvement does not eliminate these needs.",
      "Monitor long-term diabetes complications and growth, and provide genetic counseling and targeted family testing after the causal variant is established."
    ],
    contraindications: [
      "Do not attempt an outpatient or unsupervised insulin-to-sulfonylurea switch, and do not copy a dose from ordinary type 2 diabetes guidance.",
      "Do not use sulfonylurea based on age, phenotype, or a VUS alone; verify an activating pathogenic/likely pathogenic KCNJ11 or ABCC8 variant.",
      "Do not stop emergency insulin or fluids while awaiting genetics in an infant with DKA, dehydration, or catabolism.",
      "Do not assume remission means cure; transient neonatal diabetes has substantial relapse risk.",
      "Do not overlook neurologic assessment in apparently isolated diabetes or assume glucose normalization will reverse established developmental disability."
    ],
    nursingPriorities: [
      "In acute neonatal disease, monitor glucose at protocol frequency, ketones/acid-base status, electrolytes, intake/output, weight, perfusion, neurologic status, IV access, feeding, and tiny-dose insulin safety.",
      "During sulfonylurea transition, use independent medication checks, exact formulation and concentration, timed glucose/feeding records, ketone surveillance, and clearly defined criteria for insulin reduction and rescue.",
      "Teach caregivers signs of hypoglycemia and hyperglycemia, glucagon use if prescribed, sick-day care, ketone testing, and when to seek emergency help; confirm return demonstration.",
      "Track developmental milestones, tone, movement, seizures, sleep, hearing, school function, and therapy access rather than documenting only A1C.",
      "Ensure the chart contains the precise gene, variant, molecular classification, transient/permanent course, neurologic phenotype, and current transition status."
    ],
    redFlags: [
      "Infant hyperglycemia with dehydration, poor perfusion, vomiting, acidosis, ketones, respiratory change, or altered responsiveness",
      "Seizure, apnea, severe hypotonia, developmental regression, or new focal neurologic change",
      "Severe/recurrent hypoglycemia or inability to feed during sulfonylurea therapy",
      "Rising glucose, ketones, weight loss, or dehydration during insulin dose reduction",
      "Any proposed gene-directed switch without a confirmed activating pathogenic variant and specialist protocol"
    ],
    complications: [
      "DKA, severe dehydration, electrolyte disturbance, growth failure, and death if neonatal insulin deficiency is missed",
      "Severe hypoglycemia or recurrent hyperglycemia during an unsafe medication transition",
      "Developmental delay, epilepsy, motor dysfunction, attention or sleep disorders in DEND-spectrum disease",
      "Retinopathy, nephropathy, neuropathy, and other chronic diabetes complications with prolonged hyperglycemia",
      "Relapse after apparent transient remission and delayed re-entry into care"
    ],
    prognosis: "Many molecularly confirmed KCNJ11/ABCC8 patients achieve durable glycemic control with sulfonylurea and less hypoglycemia than insulin, but response depends on variant and remaining beta-cell function. Earlier diagnosis may also improve some neurologic outcomes, although established DEND features can persist. Transient forms can relapse, and permanent forms require lifelong surveillance. Accurate variant interpretation transforms prognosis; an assumed channel diagnosis without molecular evidence can be dangerous.",
    prevention: "The variant is usually not preventable. Preventable harm includes delayed genetic testing in an infant, DKA, unsafe insulin withdrawal, medication errors with concentrated pediatric doses, unrecognized neurologic needs, and loss to follow-up after remission. Prompt testing, structured transition protocols, caregiver training, developmental support, relapse surveillance, and genetic counseling reduce these risks.",
    patientEducation: [
      "This channel is the beta cell's electrical switch. Your variant may keep it open, and a sulfonylurea can close some mutant channels—but only confirmed variants respond predictably.",
      "Never stop insulin or change the sulfonylurea dose without the specialist transition plan. Check glucose and ketones exactly as directed.",
      "If diabetes went away in infancy, it can return later. Keep scheduled glucose checks and report thirst, urination, weight loss, or pregnancy promptly.",
      "Tell the team about seizures, learning, movement, weakness, sleep, or developmental concerns; these may be part of the same channel disorder.",
      "A VUS is not enough to call this KATP diabetes, and changes in the same genes can sometimes cause low rather than high glucose."
    ],
    nclexTraps: [
      "KCNJ11 encodes Kir6.2 and ABCC8 encodes SUR1; both form the beta-cell KATP channel.",
      "Activating variants keep the channel open and cause diabetes; inactivating variants can close it and cause congenital hyperinsulinism.",
      "Many confirmed cases can transition to sulfonylurea, but acute DKA still requires insulin and fluids first.",
      "DEND means developmental delay, epilepsy, and neonatal diabetes; intermediate DEND may lack epilepsy.",
      "Transient neonatal diabetes is remission, not guaranteed cure."
    ],
    relatedTopics: ["Neonatal diabetes mellitus", "Permanent neonatal diabetes mellitus", "Transient neonatal diabetes mellitus", "Sulfonylureas", "ATP-sensitive potassium channel", "DEND syndrome", "Congenital hyperinsulinism", "Diabetic ketoacidosis", "Genetic testing"],
    aliases: ["KATP diabetes", "K-ATP channel diabetes", "KCNJ11 diabetes", "ABCC8 diabetes", "Kir6.2 diabetes", "SUR1 diabetes", "potassium channel neonatal diabetes", "sulfonylurea-responsive neonatal diabetes", "DEND spectrum diabetes", "ABCC8-MODY", "MODY12", "KCNJ11-MODY", "MODY13"],
    abbreviations: ["KATP-NDM", "DEND", "iDEND"],
    commonMisspellings: ["KATP chanel diabetes", "KCNJII diabetes", "ABCC-8 diabetes", "potasium channel diabetes", "sulfonurea responsive neonatal diabetes"],
    tags: ["KATP-channel diabetes", "KCNJ11", "ABCC8", "Kir6.2", "SUR1", "neonatal diabetes", "sulfonylurea responsive diabetes", "DEND syndrome", "ATP-sensitive potassium channel", "MODY12", "MODY13"],
    sourceKeys: ["w41-genereviews-pndm", "w41-niddk-monogenic", "w41-niddk-dia-monogenic", "w41-ada-classification-2026"]
  };

  const neonatalDiabetes = {
    name: "Neonatal diabetes mellitus",
    displayName: "Neonatal Diabetes Mellitus",
    category: "Neonatology, Endocrinology & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "Neonatal diabetes mellitus is persistent diabetes that begins in early infancy, conventionally most often within the first 6 months of life. In most affected infants, a single-gene disorder disrupts pancreatic development, beta-cell survival, glucose sensing, insulin production, or insulin release, leaving too little effective insulin to control blood glucose. Despite the name, presentation is not limited to the first 28 days. Diabetes diagnosed before 6 months is almost always a prompt for monogenic evaluation rather than being presumed autoimmune type 1 diabetes; selected infants diagnosed between 6 and 12 months also warrant testing. Neonatal diabetes can be transient, permanent, isolated, or syndromic, and the molecular cause can change therapy, prognosis, organ surveillance, and recurrence counseling.",
    pathology: "Insulin is a fetal growth factor and the central postnatal regulator of glucose use. A gene defect that prevents pancreatic formation, beta-cell survival, insulin production, glucose sensing, or KATP-channel closure can cause both low birth weight and severe postnatal insulin deficiency. Hyperglycemia then exceeds the renal threshold, causing osmotic diuresis, water and electrolyte loss, dehydration, poor weight gain, and sometimes DKA. Some imprinting or channel disorders recover enough secretion to enter remission, whereas other defects remain permanent; the initial bedside appearance often cannot predict which course will occur.",
    pathophysiology: [
      "Reduced insulin action in utero limits anabolic growth, so intrauterine growth restriction or low birth weight may be the first clue even before hyperglycemia is recognized.",
      "After birth, insufficient insulin prevents normal glucose uptake and suppresses neither hepatic glucose output nor lipolysis. Hyperglycemia, glycosuria, polyuria, dehydration, and catabolism follow; severe deficiency permits ketogenesis and acidosis.",
      "KCNJ11/ABCC8 channel variants block electrical insulin release, INS variants impair insulin production, and pancreatic-development genes reduce or eliminate endocrine tissue. The same clinical glucose value therefore can arise from different mechanisms.",
      "6q24 imprinting abnormalities and some milder KATP variants can cause transient disease. Insulin need falls during remission but susceptibility remains, explaining relapse with puberty, pregnancy, illness, or later metabolic stress.",
      "Syndromic genes act outside the beta cell, so congenital heart, kidney, thyroid, liver, skeletal, gastrointestinal, neurologic, immune, hearing, vision, or pancreatic-exocrine findings can be integral to the diagnosis."
    ],
    etiology: "More than 20 genes and several imprinting mechanisms can cause neonatal diabetes. Common important causes include activating KCNJ11 and ABCC8 variants, INS variants, and 6q24 overexpression; other causes affect GCK, GATA6, EIF2AK3, PDX1, PTF1A, GLIS3, RFX6, HNF1B, SLC19A2, and additional beta-cell or developmental pathways. Inheritance may be autosomal dominant, autosomal recessive, X-linked, mitochondrial, imprinted, or de novo. Family history is therefore often absent. A VUS does not establish etiology or justify a gene-specific medication.",
    riskFactors: [
      "Persistent hyperglycemia diagnosed before age 6 months, regardless of family history or presumed neonatal stress",
      "Diabetes from 6 to 12 months with negative islet autoantibodies, low birth weight, congenital anomalies, developmental findings, or an unusual family pattern",
      "Intrauterine growth restriction, failure to thrive, unexplained dehydration, glycosuria, or recurrent high glucose in early infancy",
      "Hypotonia, seizures, developmental delay, congenital hypothyroidism, renal cysts, liver dysfunction, skeletal dysplasia, cardiac or pancreatic anomalies, chronic diarrhea, eczema, or infection",
      "Consanguinity, siblings with early infant deaths or diabetes, or a known familial neonatal-diabetes variant; absence of these features does not exclude de novo disease"
    ],
    signsSymptoms: [
      "Hyperglycemia, glycosuria, large urine output, dehydration, poor feeding, irritability or lethargy, weight loss or failure to gain, and low birth weight are common clues.",
      "DKA may cause vomiting, tachypnea or deep breathing, acidosis, ketones, poor perfusion, and altered responsiveness; infants can deteriorate rapidly and may not show classic adult symptoms.",
      "Transient forms may appear to resolve as insulin needs decline, while permanent forms continue to require treatment; bedside features alone do not reliably determine the course.",
      "KATP disease may include hypotonia, developmental delay, epilepsy, muscle weakness, attention, or sleep problems.",
      "Congenital anomalies, exocrine pancreatic insufficiency, liver crises, skeletal abnormalities, hypothyroidism, glaucoma, severe diarrhea/eczema, or recurrent infection suggest a syndromic cause."
    ],
    diagnostics: [
      "Confirm persistent plasma hyperglycemia and distinguish it from a contaminated specimen, dextrose infusion effect, brief stress hyperglycemia, sepsis-related dysregulation, or medication effect. Persistent diabetes still requires treatment while cause is clarified.",
      "Assess glucose, ketones, blood gas/acid-base status, electrolytes, hydration, renal function, weight trajectory, feeding, infection, and concurrent medications. Obtain critical samples only when they do not delay stabilization.",
      "Order prompt clinical molecular testing for diabetes before 6 months, ideally with a comprehensive neonatal-diabetes strategy that includes KCNJ11, ABCC8, INS, 6q24 mechanisms, and syndromic/developmental genes. Extend consideration to 6-12 months when features are atypical for type 1 diabetes.",
      "Perform a complete dysmorphology and systems assessment: pancreas and other abdominal anatomy when indicated, cardiac/renal/thyroid/liver evaluation, exocrine function, eye and hearing review, neurologic/developmental examination, skin and gastrointestinal history, and a three-generation pedigree.",
      "Interpret pathogenic/likely pathogenic variants with inheritance and phenotype. A VUS is not diagnostic; a negative initial panel may warrant copy-number, methylation, mitochondrial, exome/genome, or research evaluation through genetics.",
      "Do not assume transient versus permanent course at presentation. Genetic results and longitudinal insulin need provide the best classification, but remission should be declared only with closely documented safe glycemia off treatment."
    ],
    treatments: [
      "Stabilize severe hyperglycemia, dehydration, electrolyte abnormalities, and DKA immediately with neonatal/pediatric protocols, carefully titrated fluids and insulin, frequent bedside glucose, and intensive monitoring. Genetics must not delay resuscitation.",
      "Use age-appropriate insulin delivery with expert pharmacy and endocrine support because doses may be tiny and feeding is variable. Concentration, pump settings, syringe accuracy, timing, and independent checks are high-risk safety issues.",
      "After molecular confirmation, change therapy only when evidence supports the specific mechanism. Many activating KCNJ11/ABCC8 cases respond to specialist-supervised sulfonylurea; INS, pancreatic-development, and many syndromic causes require insulin.",
      "Support adequate calories and catch-up growth, treat pancreatic malabsorption or other organ disease, and provide developmental/neurologic therapies. Glycemic treatment alone is incomplete in syndromic disease.",
      "Provide genetic counseling, parent testing when indicated, recurrence-risk explanation, targeted evaluation of siblings/relatives, and coordinated transition from pediatric to adult care."
    ],
    contraindications: [
      "Do not diagnose ordinary autoimmune type 1 diabetes in an infant younger than 6 months without urgent monogenic evaluation.",
      "Do not delay insulin, fluids, or electrolyte treatment while waiting for genetic testing.",
      "Do not give a sulfonylurea or withdraw insulin from age alone, a presumed KATP phenotype, or a VUS.",
      "Do not dilute insulin, change pump concentration, or improvise fractional doses without standardized pharmacy preparation, labeling, and independent verification.",
      "Do not call transient remission a cure or stop glucose surveillance; relapse is common in several genotypes."
    ],
    nursingPriorities: [
      "Measure and trend glucose at ordered short intervals, ketones and acid-base data, electrolytes, intake/output, diaper weights, daily weight, perfusion, neurologic status, temperature, and feeding tolerance.",
      "Use two-person checks for insulin formulation, concentration, dose, route, pump settings, and line connection. Trace IV tubing and protect against inadvertent interruption or bolus in a tiny infant.",
      "Coordinate glucose checks and insulin with breast, bottle, tube, or parenteral feeding; report feed interruption immediately because both hypoglycemia and hyperglycemia can develop quickly.",
      "Teach caregivers meter/CGM confirmation, insulin or medicine technique, hypoglycemia treatment, glucagon when prescribed, ketone testing, sick-day rules, hydration, and emergency thresholds using teach-back and return demonstration.",
      "Assess growth and every organ-system clue, not only glucose. Document tone, milestones, seizures, hearing/vision, stool, jaundice/liver signs, thyroid and renal findings, congenital anomalies, and family history for the genetics team.",
      "Before discharge, ensure an exact gene/result plan when available, 24-hour diabetes contact, prescriptions and supplies, feeding/insulin schedule, emergency letter, genetics follow-up, and primary/pediatric coordination."
    ],
    redFlags: [
      "Infant hyperglycemia with ketones, acidosis, vomiting, tachypnea, poor perfusion, severe dehydration, lethargy, or altered responsiveness",
      "Hypoglycemia with jitteriness, apnea, cyanosis, poor feeding, seizure, reduced consciousness, or inability of caregivers to administer rescue treatment",
      "Rapid weight loss, falling urine output after profound diuresis, major sodium or potassium disturbance, or acute kidney injury",
      "Seizure, severe hypotonia, developmental regression, liver failure, congenital heart decompensation, sepsis, or another syndromic organ emergency",
      "Loss of insulin delivery, feed interruption without dose review, medication-concentration error, or unmonitored insulin withdrawal"
    ],
    complications: [
      "DKA, shock, severe dehydration, electrolyte disturbance, acute kidney injury, cerebral injury, and death",
      "Severe hypoglycemia and medication/concentration errors caused by very small doses and unpredictable feeding",
      "Failure to thrive and neurodevelopmental harm from prolonged catabolism or recurrent glucose extremes",
      "Gene-specific epilepsy, developmental disability, exocrine pancreatic failure, congenital anomalies, renal, hepatic, thyroid, immune, skeletal, hearing, or vision disease",
      "Later microvascular complications and relapse after transient remission"
    ],
    prognosis: "Prognosis ranges from remission with later relapse to lifelong insulin dependence or highly successful sulfonylurea therapy. It also depends on whether diabetes is isolated or one part of serious neurologic, hepatic, renal, immune, pancreatic, or congenital disease. Rapid stabilization, early molecular diagnosis, safe precision dosing, growth support, and mechanism-directed therapy can markedly improve outcome. A normal A1C during remission does not eliminate future relapse risk.",
    prevention: "Most molecular causes are not preventable. Preventable injury comes from delayed recognition, dehydration/DKA, insulin dosing errors, recurrent hypoglycemia, missed syndromic features, and loss to follow-up after remission. Glucose evaluation of symptomatic or growth-faltering infants, prompt testing before 6 months, standardized pediatric medication systems, caregiver education, genetics support, and lifelong genotype-specific surveillance reduce harm.",
    patientEducation: [
      "Neonatal diabetes means diabetes starting very early in life; it is usually genetic and is different from typical childhood type 1 diabetes.",
      "Give insulin or other medicine exactly as prescribed and call immediately if feeding stops, glucose is repeatedly high or low, ketones appear, or the child is vomiting or hard to wake.",
      "Genetic testing matters because it can show whether tablets may work, whether diabetes may remit, and which other organs or relatives need evaluation.",
      "A remission is not a guaranteed cure. Keep the long-term glucose and pregnancy follow-up plan even when no medicine is currently needed.",
      "A VUS is uncertain and should not be used to stop insulin or predict another child's condition."
    ],
    nclexTraps: [
      "Diabetes before 6 months is a genetic-testing emergency, not routine autoimmune type 1 until proven otherwise.",
      "The word neonatal is used clinically beyond the first 28 days in this diagnosis; the key testing threshold is usually onset before 6 months.",
      "Treat DKA and dehydration before the gene result; precision medicine never replaces stabilization.",
      "Not all neonatal diabetes is KATP-responsive, and not all is permanent.",
      "Tiny insulin doses and interrupted feeds make medication and hypoglycemia safety central nursing priorities."
    ],
    relatedTopics: ["Monogenic diabetes mellitus", "Permanent neonatal diabetes mellitus", "Transient neonatal diabetes mellitus", "KATP-channel monogenic diabetes", "6q24 imprinting", "Diabetic ketoacidosis", "Infant hypoglycemia", "Genetic testing", "Failure to thrive"],
    aliases: ["NDM", "neonatal diabetes", "diabetes in infancy", "infant-onset diabetes", "congenital diabetes", "monogenic infant diabetes", "diabetes before 6 months", "early infancy diabetes"],
    abbreviations: ["NDM", "NDM mellitus"],
    commonMisspellings: ["neonatel diabetes", "neonatal diabeties", "neo natal diabetes", "neonatal diabetis"],
    tags: ["neonatal diabetes mellitus", "NDM", "diabetes before 6 months", "infant hyperglycemia", "monogenic diabetes infant", "low birth weight diabetes", "neonatal DKA", "genetic testing infant diabetes", "transient or permanent diabetes"],
    sourceKeys: ["w41-genereviews-pndm", "w41-genereviews-6q24", "w41-niddk-monogenic", "w41-niddk-dia-monogenic", "w41-ada-classification-2026"]
  };

  const transientNeonatalDiabetes = {
    name: "Transient neonatal diabetes mellitus",
    displayName: "Transient Neonatal Diabetes Mellitus",
    category: "Neonatology, Endocrinology & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "Transient neonatal diabetes mellitus (TNDM) is monogenic diabetes that begins in early infancy, improves enough for glucose-lowering treatment to stop, and commonly returns later. 'Transient' describes an interval of remission, not a harmless condition or guaranteed cure. The most common mechanism is overexpression of imprinted genes at chromosome 6q24; milder activating KCNJ11 or ABCC8 variants and rarer causes can produce a similar biphasic course. Initial hyperglycemia and dehydration still require treatment, and genetic diagnosis guides relapse and family counseling.",
    pathology: "In 6q24-related TNDM, the normally regulated imprinted region has excess expression from the paternal pattern, involving PLAGL1 and HYMAI. This impairs fetal growth and early beta-cell insulin secretion through mechanisms that are not fully resolved. Insulin need often declines over weeks or months as beta-cell function improves, but the underlying susceptibility remains. KATP-channel TNDM instead reflects a milder electrical secretion defect that can also remit and recur. Because different mechanisms share the transient course, treatment cannot be chosen from the word 'transient' alone.",
    pathophysiology: [
      "6q24 overexpression can result from paternal uniparental disomy of chromosome 6, a paternally inherited 6q24 duplication, or loss of methylation on the maternal allele. Some methylation defects involve biallelic ZFP57 variants or broader multilocus imprinting disturbance.",
      "Reduced fetal insulin signaling causes marked intrauterine growth restriction. After birth, insufficient insulin causes hyperglycemia, glycosuria, polyuria, dehydration, and poor weight gain; macroglossia or umbilical hernia can accompany 6q24 disease.",
      "Insulin secretion improves with maturation, allowing remission often within infancy. The molecular defect is not erased, so beta-cell demand during puberty, pregnancy, illness, obesity, or aging can reveal diabetes again.",
      "Milder activating KCNJ11/ABCC8 variants keep KATP channels overly open early in life and may later permit enough secretion for remission. These genotypes may be sulfonylurea-responsive, unlike 6q24 disease.",
      "Clinical findings overlap enough that age at remission, birth weight, macroglossia, and ketosis can guide but cannot replace molecular testing."
    ],
    etiology: "Most TNDM is caused by 6q24 imprinting abnormalities; KCNJ11 and ABCC8 activating variants are other major causes, with INS and rarer genes reported. Recurrence risk differs sharply by mechanism: a paternal duplication can be inherited, uniparental disomy is usually sporadic, methylation defects may be sporadic or related to recessive ZFP57 disease, and KATP variants have their own dominant/recessive patterns. A VUS or an uncharacterized methylation finding must not be used for definitive recurrence counseling.",
    riskFactors: [
      "Low birth weight or intrauterine growth restriction followed by hyperglycemia in the first weeks or months of life",
      "Macroglossia, umbilical hernia, relative absence of ketoacidosis, or marked dehydration suggesting 6q24-related disease",
      "Neonatal diabetes that begins requiring insulin and then needs progressively less during infancy",
      "Hypotonia, developmental delay, epilepsy, or later remission suggesting a KATP-channel phenotype or multilocus imprinting disorder",
      "Family history of neonatal diabetes, later young-onset diabetes, gestational diabetes, or a known 6q24/KCNJ11/ABCC8 molecular diagnosis"
    ],
    signsSymptoms: [
      "Neonatal hyperglycemia, glycosuria, polyuria, dehydration, poor feeding, failure to gain, and low birth weight are typical; DKA is less characteristic in classic 6q24 disease but can occur in other TNDM causes and must be assessed.",
      "Macroglossia and umbilical hernia support 6q24-related TNDM but are neither required nor specific.",
      "Insulin requirements fall during remission. Frequent hypoglycemia or repeatedly normal glucose despite reduced doses can signal changing secretion and requires supervised dose adjustment.",
      "Intermittent childhood hyperglycemia can occur during illness, and overt diabetes may recur in adolescence or adulthood.",
      "Pregnancy can reveal relapse in an affected woman, so a remote neonatal history remains clinically relevant decades later."
    ],
    diagnostics: [
      "Confirm and stabilize diabetes, then obtain comprehensive neonatal-diabetes testing. Include a method capable of detecting 6q24 methylation, paternal duplication, and uniparental disomy as well as sequence testing for KCNJ11, ABCC8, INS, and other relevant genes.",
      "Document birth weight, gestational age, age at hyperglycemia, ketosis, macroglossia, umbilical hernia, congenital anomalies, neurologic findings, insulin trajectory, and diabetes on both sides of the family.",
      "Use parent testing and genetic counseling to determine whether a 6q24 abnormality is sporadic, inherited, or related to multilocus imprinting disturbance; the molecular mechanism is necessary for recurrence-risk accuracy.",
      "Do not diagnose TNDM prospectively from a low insulin dose or an apparently mild first week. Permanent and transient courses overlap; continue therapy until monitored physiology supports remission.",
      "During remission, monitor fasting/A1C or other specialist-selected glucose measures at planned intervals and during illness, puberty, pregnancy, or symptoms. Diagnose relapse using standard diabetes criteria and clinical context."
    ],
    treatments: [
      "Treat neonatal hyperglycemia, dehydration, electrolyte disturbance, and DKA when present with carefully titrated insulin and neonatal/pediatric protocols. Support calories and catch-up growth.",
      "Reduce insulin only in response to closely monitored falling requirements and recurrent low/normal glucose, under pediatric endocrine direction. Abrupt discontinuation can miss continuing insulin deficiency.",
      "For confirmed activating KCNJ11/ABCC8 TNDM, specialist-supervised sulfonylurea may be appropriate; it should not be used for presumed or 6q24 TNDM merely because both are transient.",
      "After remission, maintain a written relapse-surveillance plan and rapid pathway back to care. Treat recurrent diabetes according to genotype, current insulin reserve, severity, pregnancy, and specialist guidance.",
      "Provide mechanism-specific genetic counseling and assess additional organ/developmental needs when multilocus imprinting disturbance or a syndromic genotype is present."
    ],
    contraindications: [
      "Do not call remission cure, discharge permanently from diabetes care, or omit adolescent and pregnancy surveillance.",
      "Do not stop insulin simply because the diagnosis says transient; document safe glucose as doses are tapered.",
      "Do not infer the 6q24 mechanism from macroglossia or low birth weight alone, and do not infer KATP responsiveness from remission alone.",
      "Do not use sulfonylurea without a confirmed responsive KCNJ11/ABCC8 pathogenic variant and specialist plan.",
      "Do not give a single recurrence-risk percentage until the imprinting, copy-number, or sequence mechanism is known."
    ],
    nursingPriorities: [
      "During active disease, perform precise insulin checks, coordinate dosing with feeds, trend glucose/ketones/electrolytes/intake/output/weight, and respond rapidly to dehydration or hypoglycemia.",
      "As insulin need falls, record every dose, feed, and glucose trend and notify the prescribing team before adjustment. Prevent accidental continuation of an obsolete higher dose.",
      "At remission, teach caregivers that symptoms can return and provide exact schedules for routine checks, illness checks, puberty/adolescent follow-up, and future pregnancy notification.",
      "Ensure the molecular mechanism—not only 'TNDM'—appears in the problem list and discharge summary because it determines medication options and recurrence counseling.",
      "Assess growth, development, hearing, neurologic status, congenital anomalies, and signs of broader imprinting disturbance; coordinate early-intervention and genetics services."
    ],
    redFlags: [
      "Hyperglycemia with dehydration, ketones, acidosis, vomiting, altered responsiveness, or poor perfusion",
      "Severe/recurrent hypoglycemia as endogenous secretion returns or insulin is not reduced safely",
      "Weight loss, polyuria, polydipsia, fatigue, infection, or rising glucose after remission suggesting relapse",
      "Pregnancy in a person with prior TNDM and no current glucose surveillance",
      "A family recurrence prediction or sulfonylurea plan made without mechanism-specific molecular confirmation"
    ],
    complications: [
      "Neonatal dehydration, DKA in susceptible genotypes, electrolyte disturbance, growth failure, and severe hypoglycemia during changing insulin need",
      "Recurrent diabetes in adolescence, adulthood, pregnancy, or illness with delayed recognition",
      "Microvascular and cardiovascular complications if recurrent hyperglycemia remains untreated",
      "Neurologic or congenital morbidity in KATP or multilocus imprinting phenotypes",
      "Incorrect reproductive counseling when distinct 6q24 mechanisms are treated as one inheritance pattern"
    ],
    prognosis: "Initial diabetes commonly remits in infancy, but timing varies and relapse later in life is frequent enough that lifelong awareness is essential. Prognosis is favorable when neonatal dehydration is prevented, nutrition recovers, and relapse is recognized early. It is modified by KATP neurologic disease or multilocus imprinting features. Molecular mechanism provides more useful prognostic and reproductive information than the transient label alone.",
    prevention: "The molecular event usually cannot be prevented. Preventable harms include neonatal dehydration, insulin-related hypoglycemia as secretion recovers, missed relapse, and inaccurate family counseling. Careful dose tapering, written lifelong surveillance, symptom education, preconception glucose evaluation, and mechanism-specific genetics reduce these risks.",
    patientEducation: [
      "Transient means the diabetes can go into remission; it does not mean the gene or relapse risk disappears.",
      "Never stop or reduce insulin without the pediatric diabetes team, because the safe timing depends on glucose and feeding trends.",
      "Keep the genetic report. A 6q24 imprinting cause and a KATP-channel cause can look similar in infancy but have different medicine and family implications.",
      "During remission, seek testing for thirst, frequent urination, weight loss, fatigue, illness-related high glucose, or pregnancy.",
      "Tell future clinicians and obstetric teams about neonatal diabetes even if no medicine has been needed for years."
    ],
    nclexTraps: [
      "TNDM is a biphasic disorder—infant diabetes, remission, and possible later relapse—not a permanent cure.",
      "6q24 is the major imprinting cause; KCNJ11/ABCC8 can also be transient and may be sulfonylurea-responsive.",
      "Macroglossia, umbilical hernia, severe growth restriction, and little ketosis suggest 6q24 but do not prove it.",
      "Falling insulin need requires hypoglycemia prevention and supervised tapering, not abrupt discontinuation.",
      "Recurrence risk cannot be generalized because paternal duplication, uniparental disomy, methylation defects, and sequence variants inherit differently."
    ],
    relatedTopics: ["Neonatal diabetes mellitus", "Permanent neonatal diabetes mellitus", "6q24 imprinting", "KATP-channel monogenic diabetes", "Genomic imprinting", "Infant hypoglycemia", "Gestational diabetes mellitus", "Genetic counseling"],
    aliases: ["TNDM", "transient neonatal diabetes", "temporary neonatal diabetes", "remitting neonatal diabetes", "6q24 transient neonatal diabetes", "6q24-TNDM", "neonatal diabetes with remission", "relapsing neonatal diabetes"],
    abbreviations: ["TNDM", "6q24-TNDM"],
    commonMisspellings: ["transiant neonatal diabetes", "transient neonatel diabeties", "transent neonatal diabetes", "temporary neo natal diabetes"],
    tags: ["transient neonatal diabetes mellitus", "TNDM", "6q24", "PLAGL1", "HYMAI", "genomic imprinting diabetes", "neonatal diabetes remission", "diabetes relapse", "low birth weight", "macroglossia"],
    sourceKeys: ["w41-genereviews-6q24", "w41-genereviews-pndm", "w41-niddk-monogenic", "w41-niddk-dia-monogenic"]
  };

  const permanentNeonatalDiabetes = {
    name: "Permanent neonatal diabetes mellitus",
    displayName: "Permanent Neonatal Diabetes Mellitus",
    category: "Neonatology, Endocrinology & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "Permanent neonatal diabetes mellitus (PNDM) is persistent diabetes caused by severe insulin deficiency beginning most often in the first 6 months of life and not entering sustained medication-free remission. It is a genetically heterogeneous endpoint, not one gene. KCNJ11, ABCC8, and INS are major causes, while pancreatic-development and syndromic genes can add neurologic, hepatic, renal, skeletal, thyroid, gastrointestinal, cardiac, or exocrine pancreatic disease. Molecular testing is urgent because many KATP cases can use sulfonylurea, whereas other causes require lifelong insulin and organ-specific care.",
    pathology: "Persistent beta-cell electrical failure, insulin misfolding, beta-cell loss, or inadequate pancreatic development leaves too little effective insulin to maintain glucose homeostasis. In utero insulin deficiency restricts growth; after birth it produces hyperglycemia, glycosuria, osmotic water loss, dehydration, and catabolism. The permanence reflects a sustained molecular defect rather than the initial glucose level. Extra-pancreatic findings identify which developmental or cellular pathway is affected and can dominate prognosis.",
    pathophysiology: [
      "KCNJ11/ABCC8 activating variants keep KATP channels open and block depolarization; many remain pharmacologically closable through SUR1 with a sulfonylurea.",
      "Dominant INS variants often produce misfolded proinsulin and endoplasmic-reticulum stress, injuring beta cells; recessive INS mechanisms can reduce insulin production. These forms generally need insulin.",
      "Biallelic GCK loss prevents normal glucose sensing, while PDX1, PTF1A, GATA6, and other developmental defects can reduce pancreatic endocrine tissue and sometimes exocrine tissue.",
      "Syndromic genes such as EIF2AK3, GLIS3, RFX6, SLC19A2, and others affect shared pathways, linking diabetes to liver crises, skeletal dysplasia, congenital hypothyroidism, glaucoma, intestinal/pancreatic anomalies, anemia, deafness, or neurologic disease.",
      "Without adequate insulin, lipolysis and ketogenesis can proceed, so DKA is a common or serious presentation in several genotypes despite the patient's very young age."
    ],
    etiology: "PNDM can result from pathogenic/likely pathogenic variants in KCNJ11, ABCC8, INS, GATA6, EIF2AK3, GCK, GLIS3, HNF1B, MNX1, NEUROD1, NKX2-2, PDX1, PTF1A, RFX6, SLC2A2, SLC19A2, and other validated genes. Inheritance varies from dominant—often de novo—to recessive and syndromic patterns. A single phenotype cannot identify the gene. A VUS cannot establish permanent disease or a medication response, and continued follow-up can reveal that an initially persistent course later remits in some genotypes.",
    riskFactors: [
      "Diabetes beginning before 6 months with ongoing insulin requirement, low birth weight, dehydration, poor growth, or DKA",
      "A confirmed KCNJ11, ABCC8, INS, pancreatic-development, or syndromic pathogenic variant",
      "Consanguinity, affected siblings, recurrent infant deaths, or congenital anomalies suggesting a recessive syndrome",
      "Developmental delay, epilepsy, skeletal dysplasia, episodic liver dysfunction, congenital hypothyroidism, glaucoma, renal or cardiac anomalies, intestinal atresia, or pancreatic exocrine insufficiency",
      "Persistent hyperglycemia beyond the expected remission window; course alone still does not replace molecular diagnosis"
    ],
    signsSymptoms: [
      "Hyperglycemia, glycosuria, polyuria, dehydration, failure to gain weight, low birth weight, irritability, lethargy, poor feeding, and DKA are common presenting features.",
      "KCNJ11 disease can add hypotonia, developmental delay, muscle weakness, attention/sleep issues, and epilepsy in DEND-spectrum disease.",
      "INS-related disease is often isolated insulin deficiency, while developmental-gene disease may show pancreatic hypoplasia or exocrine malabsorption.",
      "EIF2AK3/Wolcott-Rallison can cause later skeletal dysplasia and episodic liver failure; GLIS3 can combine congenital hypothyroidism, glaucoma, cystic kidneys, cholestasis, or fibrosis.",
      "Persistent treatment need differentiates the course over time, but no symptom at initial presentation guarantees permanence."
    ],
    diagnostics: [
      "Treat acute metabolic instability, then send comprehensive molecular testing for every infant with diabetes before 6 months. Include copy-number and syndrome-appropriate methods; do not restrict testing to the three most familiar genes when extra-pancreatic findings exist.",
      "Document gestational age, birth weight, family structure/consanguinity, age at hyperglycemia, DKA, insulin need, feeding and growth, pancreatic anatomy/function, neurologic development, and congenital/organ-system findings.",
      "Confirm a pathogenic/likely pathogenic result and match it to the inheritance and phenotype. Parental testing may identify de novo disease, recessive carrier status, mild parental diabetes, or mosaicism.",
      "Use neurologic evaluation and EEG when seizures or DEND are possible; assess exocrine pancreatic function for malabsorption; select thyroid, liver, renal, skeletal, cardiac, eye, hearing, and gastrointestinal evaluation from the suspected genotype.",
      "Do not use a VUS to declare permanence or switch medicine. If no cause is found, continue insulin and specialist surveillance while genetics considers reanalysis or broader testing.",
      "Differentiate transient neonatal diabetes, stress hyperglycemia, congenital infection, medication exposure, and very rare autoimmune disease. A period of apparent low insulin need must be monitored before calling remission."
    ],
    treatments: [
      "Provide prompt rehydration, electrolyte correction, IV insulin for DKA or unstable severe hyperglycemia, then precise subcutaneous or pump insulin when stable and feeding. Ensure enough calories for catch-up growth.",
      "For confirmed responsive activating KCNJ11/ABCC8 disease, transition to sulfonylurea only through an experienced pediatric endocrine protocol. Continue insulin for INS-related, pancreatic-development, most syndromic, or nonresponsive disease.",
      "Tailor insulin delivery to tiny doses and variable intake. Technology may help but does not replace concentration checks, backup insulin, caregiver competency, and feed-interruption planning.",
      "Treat exocrine insufficiency with enzymes and nutrition; provide seizure and developmental care; and manage thyroid, liver, renal, cardiac, skeletal, immune, hearing, or vision disease according to genotype.",
      "Provide lifelong diabetes complication surveillance, genetics follow-up, targeted relative testing, reproductive counseling, school plans, and structured transition to adult care."
    ],
    contraindications: [
      "Do not withdraw insulin from a child with persistent insulin deficiency based on age, improved A1C, or a VUS.",
      "Do not assume every PNDM case is KATP-related or sulfonylurea-responsive.",
      "Do not use ordinary adult insulin scales or unverified dilution methods for an infant; dosing precision is a critical safety requirement.",
      "Do not focus only on glucose when liver failure, hypothyroidism, epilepsy, malabsorption, kidney disease, or congenital anomalies can be the more urgent genotype-specific threat.",
      "Do not tell families that no family history means no genetic cause; dominant neonatal variants are frequently de novo."
    ],
    nursingPriorities: [
      "Use independent double checks for insulin type, concentration, dose, pump setting, route, and timing; coordinate every dose with actual feeding and have a plan for vomiting or interrupted feeds.",
      "Monitor glucose/CGM with confirmatory testing as indicated, ketones, acid-base/electrolytes during illness, weight and growth, intake/output, injection/pump sites, and hypoglycemia awareness.",
      "Ensure caregivers can calculate or deliver the exact prescribed dose, treat low glucose, use glucagon if prescribed, check ketones, manage sick days, replace failed technology, and contact the team at any hour.",
      "Track developmental milestones, seizures, tone, vision/hearing, stool and nutrition, thyroid, liver, kidney, skeletal, and cardiac findings according to the gene; escalate new multisystem symptoms promptly.",
      "Maintain a current emergency letter naming the gene, usual therapy, concentration, DKA and hypoglycemia plan, neurologic/syndromic risks, and specialist contacts.",
      "Support caregiver mental health, respite, school/daycare training, supply access, and transition planning because lifelong high-intensity diabetes care begins in infancy."
    ],
    redFlags: [
      "DKA signs, severe dehydration, shock, vomiting, altered responsiveness, or interrupted insulin delivery",
      "Severe hypoglycemia, seizure, apnea, inability to feed, or repeated low values without a safe dose adjustment",
      "New epilepsy, developmental regression, severe hypotonia, or loss of motor function",
      "Jaundice, hepatomegaly, coagulopathy, or acute liver dysfunction; respiratory/cardiac compromise; severe thyroid or electrolyte abnormality",
      "Failure to thrive, persistent diarrhea/steatorrhea, or evidence of pancreatic malabsorption",
      "Any unmonitored plan to replace insulin with sulfonylurea"
    ],
    complications: [
      "DKA, shock, electrolyte disturbance, severe hypoglycemia, growth failure, and medication errors",
      "Retinopathy, nephropathy, neuropathy, cardiovascular disease, and other consequences of lifelong hyperglycemia",
      "DEND-related epilepsy and neurodevelopmental disability",
      "Syndromic liver failure, skeletal dysplasia, renal or thyroid disease, glaucoma, pancreatic malabsorption, congenital anomalies, and infection/immune complications",
      "Caregiver burnout, disrupted development or schooling, supply insecurity, and unsafe transition to adult services"
    ],
    prognosis: "PNDM requires lifelong surveillance, but treatment burden and outcome are highly gene-specific. Many KATP patients can achieve excellent long-term control on sulfonylurea; INS and structural pancreatic causes generally remain insulin-dependent. Neurodevelopmental and multisystem syndromic disease can dominate prognosis. Early molecular diagnosis, stable access to therapy, prevention of glucose extremes, nutrition and developmental support, and organ-specific surveillance materially improve outcomes.",
    prevention: "The causal genotype generally cannot be prevented. Preventable injury includes DKA, severe hypoglycemia, imprecise infant dosing, malnutrition, unrecognized organ crises, and missed family counseling. Reliable insulin delivery, emergency and feed-interruption plans, early gene-directed therapy where appropriate, developmental and organ surveillance, caregiver support, and preconception counseling reduce harm.",
    patientEducation: [
      "Permanent neonatal diabetes means the insulin problem continues, but the best treatment still depends on the exact gene.",
      "Never stop insulin because glucose looks better or a genetic report mentions KCNJ11/ABCC8; the specialist must confirm that the variant is disease-causing and responsive.",
      "Keep backup insulin, delivery supplies, glucose and ketone testing, rapid carbohydrate, glucagon if prescribed, and a written plan for vomiting, missed feeds, or pump failure.",
      "Report developmental, seizure, liver, thyroid, kidney, vision, hearing, stool, growth, or heart concerns because they may be part of the same genetic condition.",
      "Ask for genetic counseling before testing relatives or planning another pregnancy; recurrence risk is different for dominant, recessive, and de novo causes."
    ],
    nclexTraps: [
      "PNDM is a course category, not a single molecular diagnosis.",
      "KATP-channel PNDM may switch to sulfonylurea; INS and many developmental/syndromic forms generally require insulin.",
      "Low birth weight reflects reduced fetal insulin, while postnatal poor growth reflects ongoing catabolism and possible malabsorption.",
      "A de novo pathogenic variant explains why many affected infants have no family history.",
      "Glucose control does not replace surveillance for DEND, liver failure, hypothyroidism, pancreatic insufficiency, or other gene-specific disease."
    ],
    relatedTopics: ["Neonatal diabetes mellitus", "Transient neonatal diabetes mellitus", "KATP-channel monogenic diabetes", "INS-related diabetes", "DEND syndrome", "Wolcott-Rallison syndrome", "Pancreatic agenesis", "Diabetic ketoacidosis", "Genetic counseling"],
    aliases: ["PNDM", "permanent neonatal diabetes", "lifelong neonatal diabetes", "persistent neonatal diabetes", "permanent infant diabetes", "neonatal insulin-dependent diabetes", "genetic diabetes from birth"],
    abbreviations: ["PNDM"],
    commonMisspellings: ["permenant neonatal diabetes", "permanent neonatel diabeties", "persistant neonatal diabetes", "PNDM diabetes"],
    tags: ["permanent neonatal diabetes mellitus", "PNDM", "lifelong infant diabetes", "KCNJ11", "ABCC8", "INS gene", "pancreatic development", "DEND", "infant insulin safety", "syndromic neonatal diabetes"],
    sourceKeys: ["w41-genereviews-pndm", "w41-niddk-monogenic", "w41-niddk-dia-monogenic", "w41-ada-classification-2026"]
  };

  const midd = {
    name: "Maternally inherited diabetes and deafness",
    displayName: "Maternally Inherited Diabetes and Deafness (MIDD)",
    category: "Endocrinology, Audiology & Mitochondrial Medicine",
    sourceNote: SOURCE_NOTE,
    definition: "Maternally inherited diabetes and deafness (MIDD) is a mitochondrial form of monogenic diabetes, most often associated with the heteroplasmic mitochondrial DNA variant m.3243A>G in MT-TL1. Impaired oxidative phosphorylation weakens glucose-stimulated insulin secretion and affects other energy-dependent tissues, especially the cochlea. Diabetes is often progressive and sensorineural hearing loss may precede it. Expression varies greatly because different tissues and family members carry different proportions of altered mitochondrial DNA, so the diagnosis cannot be excluded by the absence of deafness or by one unaffected maternal relative.",
    pathology: "Mitochondria generate ATP needed both for beta-cell glucose sensing and for high-energy tissues such as cochlea, retina, myocardium, kidney, skeletal muscle, and nervous system. A pathogenic mitochondrial DNA variant can coexist with normal mitochondrial genomes in the same person (heteroplasmy). Tissue-specific heteroplasmy and energy demand determine which organs fail and when. In beta cells, insufficient ATP signaling impairs KATP closure and insulin release; progressive beta-cell dysfunction can eventually require insulin. In cochlear cells, energy failure produces progressive sensorineural hearing loss.",
    pathophysiology: [
      "MT-TL1 m.3243A>G alters mitochondrial transfer RNA and disrupts synthesis of respiratory-chain proteins. Oxidative phosphorylation becomes less efficient, reducing ATP and increasing cellular stress.",
      "The beta cell depends on a rise in ATP after glucose metabolism to close KATP channels and trigger calcium-dependent insulin release. A blunted ATP signal causes secretory failure; peripheral insulin sensitivity may also vary.",
      "Cochlear hair cells and neural structures have high energy requirements and limited regenerative capacity, explaining progressive sensorineural hearing loss that may appear before diabetes.",
      "Random mitochondrial segregation creates heteroplasmy differences among tissues and relatives. Blood may contain a lower detectable variant fraction than another tissue, especially with age, so testing strategy matters when suspicion remains high.",
      "The same mitochondrial variant can produce overlapping phenotypes such as MIDD or MELAS-spectrum disease, and additional retinal, renal, cardiac, muscle, neurologic, or gastrointestinal findings can emerge over time."
    ],
    etiology: "The most frequent cause is a pathogenic heteroplasmic m.3243A>G variant in MT-TL1; rarer mitochondrial DNA variants can produce a similar diabetes-deafness phenotype. Mitochondrial DNA is transmitted through the maternal line: an affected mother may transmit the variant to children, while an affected father generally does not transmit mitochondrial DNA. Phenotype and severity cannot be predicted from a simple 50% Mendelian rule because heteroplasmy shifts between eggs, tissues, and generations. A low-level result, negative blood result, or mitochondrial VUS requires specialist interpretation rather than a binary conclusion.",
    riskFactors: [
      "Diabetes plus progressive sensorineural hearing loss, especially in a lean or nonobese adult with negative islet autoantibodies",
      "Diabetes, deafness, cardiomyopathy, kidney disease, short stature, migraine-like or neurologic symptoms recurring through the maternal lineage",
      "Macular pattern dystrophy or other characteristic retinal change without the typical retinopathy pattern",
      "Progressive insulin requirement with preserved but declining C-peptide and no convincing autoimmune explanation",
      "A known maternal mtDNA pathogenic variant; absence of hearing loss or a weak pedigree does not exclude disease because expression is variable"
    ],
    signsSymptoms: [
      "Progressive bilateral sensorineural hearing loss often begins before or around the diabetes diagnosis; difficulty understanding speech may be more noticeable than awareness of reduced hearing.",
      "Diabetes may present gradually with polyuria, polydipsia, fatigue, blurred vision, weight loss, or incidental hyperglycemia and can progress from noninsulin to insulin-requiring treatment.",
      "Short stature, maternal family pattern, macular pigmentary change, renal disease, cardiomyopathy, muscle fatigue, exercise intolerance, migraine-like episodes, or neurologic findings strengthen suspicion.",
      "DKA is not the defining presentation but can occur when insulin secretion becomes severely inadequate or insulin is interrupted.",
      "Severity differs even among siblings because heteroplasmy and tissue distribution differ."
    ],
    diagnostics: [
      "Confirm diabetes and evaluate the assigned type with islet autoantibodies, glucose-paired C-peptide, body-composition/history, medication response, and a maternal-line pedigree that explicitly asks about hearing, kidney, heart, vision, neurologic, and short-stature phenotypes.",
      "Obtain formal audiology rather than relying on conversational hearing, and perform ophthalmic evaluation for macular pattern dystrophy and ordinary diabetes complications.",
      "Test for the common MT-TL1 m.3243A>G pathogenic variant and use broader mitochondrial testing when phenotype warrants. Because heteroplasmy differs by tissue and may be low in blood, a negative blood result does not always end evaluation; a mitochondrial genetics service should select any alternative specimen or method.",
      "Evaluate kidney function/albuminuria, ECG and cardiac structure/function when indicated, neurologic and muscle symptoms, lactate only in a clinically interpretable context, and other organ findings guided by mitochondrial specialists.",
      "A pathogenic mtDNA result that fits the phenotype supports diagnosis. A VUS or low-level finding of uncertain significance must not be used alone to label maternal relatives, stop insulin, or make reproductive predictions.",
      "Differentiate type 1, type 2, LADA, HNF1A/HNF4A MODY, Wolfram syndrome, Alstrom syndrome, medication/age-related hearing loss, ototoxicity, and other mitochondrial syndromes including MELAS."
    ],
    treatments: [
      "Individualize glucose therapy to current insulin secretion, kidney function, nutritional status, and risk of catabolism. Many patients ultimately need insulin; do not delay insulin when hyperglycemia is severe or C-peptide reserve is failing.",
      "Review the safety of metformin and other agents with a diabetes/mitochondrial specialist, particularly during renal, hepatic, cardiac, hypoxic, dehydrating, or acute illness that raises lactic-acidosis risk. Mitochondrial disease is a reason for individualized risk review, not permission for an unsupervised blanket drug change.",
      "Provide hearing rehabilitation with audiology, hearing aids or other technology, communication support, and periodic reassessment; coordinate ophthalmology, nephrology, cardiology, neurology, and mitochondrial medicine according to manifestations.",
      "Use standard glucose, blood-pressure, lipid, foot, eye, and kidney risk reduction while distinguishing mitochondrial macular/renal disease from ordinary diabetic complications.",
      "Provide mitochondrial genetic counseling for maternal relatives and reproductive planning; heteroplasmy makes severity prediction and prenatal counseling more complex than simple dominant inheritance."
    ],
    contraindications: [
      "Do not assume all children of an affected mother will have the same manifestations or severity, and do not use a paternal family pattern to support mitochondrial transmission.",
      "Do not exclude MIDD because hearing is currently normal, because one maternal relative is unaffected, or because a blood test is negative when clinical suspicion remains high.",
      "Do not attribute all hearing loss to MIDD without audiology and a medication/noise/age-related differential.",
      "Do not stop insulin or other therapy from a mitochondrial VUS, and do not continue or stop metformin reflexively without reviewing current organ function and acute illness.",
      "Do not mistake MIDD for autoimmune type 1 solely because insulin is eventually required."
    ],
    nursingPriorities: [
      "Verify communication needs before teaching: reduce background noise, face the patient, use hearing devices/interpreters or written/visual instructions, and confirm understanding by teach-back rather than assuming nonadherence.",
      "Monitor glucose, ketones during illness or sustained hyperglycemia, hypoglycemia, insulin access, weight/nutrition, kidney and liver function, and symptoms of dehydration or lactic acidosis when relevant to current therapy.",
      "Screen for changing hearing, vision, exercise tolerance, muscle weakness, palpitations, syncope, edema, kidney findings, neurologic symptoms, and maternal-family history at transitions of care.",
      "Reconcile ototoxic and mitochondrially stressful exposures with pharmacy and specialists, but distinguish MIDD-associated MT-TL1 disease from MT-RNR1 variants that confer particular aminoglycoside susceptibility.",
      "Document the exact mtDNA variant, tested tissue, heteroplasmy information if reported, organ manifestations, and genetics plan; do not reduce the diagnosis to 'type 2 with hearing aids.'"
    ],
    redFlags: [
      "Ketones, vomiting, deep breathing, dehydration, altered mentation, or insulin interruption",
      "Syncope, chest pain, palpitations, new heart-failure symptoms, or evidence of cardiomyopathy",
      "Sudden or rapidly progressive hearing/vision change or new focal neurologic symptoms, seizure, stroke-like episode, or marked muscle weakness",
      "Acute kidney injury, severe dehydration, hypoxia, sepsis, or hepatic/cardiac decompensation in a patient taking a medication with lactic-acidosis concern",
      "A reproductive or family diagnosis based on a mitochondrial VUS or simple Mendelian percentage"
    ],
    complications: [
      "Progressive insulin deficiency, DKA in severe deficiency, hypoglycemia, and ordinary microvascular/cardiovascular consequences of chronic hyperglycemia",
      "Progressive sensorineural hearing loss with communication, safety, employment, and social effects",
      "Macular pattern dystrophy or other visual impairment, kidney disease, cardiomyopathy or conduction disease, myopathy, and neurologic disease",
      "Medication toxicity or lactic acidosis risk during physiologic stress when organ function and treatment are not reassessed",
      "Misleading family counseling caused by ignoring heteroplasmy, maternal inheritance, or tissue-sensitive testing"
    ],
    prognosis: "MIDD is usually progressive but highly variable. Diabetes may initially respond to noninsulin therapy and later require insulin; hearing loss commonly progresses. Kidney, eye, cardiac, muscle, or neurologic disease can determine outcome. Early recognition prevents the condition from being managed as glucose alone, improves communication access, and identifies maternal relatives who may benefit from evaluation. Heteroplasmy limits precise prediction for any one relative or pregnancy.",
    prevention: "The mtDNA variant cannot usually be prevented. Preventable harm includes prolonged hyperglycemia, missed hearing or cardiac disease, communication-related medication errors, dehydration-related metabolic decompensation, and inaccurate reproductive advice. Regular metabolic and multisystem surveillance, accessible communication, acute-illness medication review, smoking and cardiovascular risk reduction, and expert mitochondrial counseling reduce these harms.",
    patientEducation: [
      "MIDD affects mitochondria, which make cellular energy. This connects insulin-release problems with hearing and sometimes eye, kidney, heart, muscle, or neurologic symptoms.",
      "The condition usually follows the mother's mitochondrial line, but relatives can be affected very differently because the amount of altered mitochondrial DNA varies by tissue.",
      "Tell clinicians about the mitochondrial diagnosis during acute illness and before medication changes; never stop insulin or metformin on your own.",
      "Use hearing supports during diabetes teaching and ask for written instructions so dose and sick-day information is not missed.",
      "A negative blood test or VUS may need specialist interpretation. Keep the full laboratory report, including which tissue was tested."
    ],
    nclexTraps: [
      "MIDD follows mitochondrial maternal inheritance, not autosomal-dominant MODY inheritance.",
      "Heteroplasmy explains variable severity and why a blood test can be less sensitive than the overall phenotype suggests.",
      "Progressive sensorineural hearing loss may precede diabetes and should change how education is delivered.",
      "Insulin requirement does not convert MIDD into type 1 diabetes; mechanism and autoantibodies still matter.",
      "Aminoglycoside hypersensitivity is classically linked to particular MT-RNR1 variants; do not automatically claim every MIDD variant has the same drug-specific risk."
    ],
    relatedTopics: ["Monogenic diabetes mellitus", "Mitochondrial disease", "Sensorineural hearing loss", "MT-TL1", "MELAS", "C-peptide", "Genetic counseling", "Cardiomyopathy", "Macular pattern dystrophy"],
    aliases: ["MIDD", "mitochondrial diabetes and deafness", "maternally inherited diabetes mellitus and deafness", "diabetes deafness syndrome", "MT-TL1 diabetes", "m.3243A>G diabetes", "maternal diabetes and hearing loss", "mitochondrial diabetes"],
    abbreviations: ["MIDD", "mtDNA"],
    commonMisspellings: ["maternaly inherited diabetes and deafness", "maternal inherited diabeties deafness", "mitocondrial diabetes deafness", "MIDD syndrome"],
    tags: ["maternally inherited diabetes and deafness", "MIDD", "mitochondrial diabetes", "MT-TL1", "m.3243A>G", "sensorineural hearing loss", "maternal inheritance", "heteroplasmy", "diabetes and deafness"],
    sourceKeys: ["w41-genereviews-mito-hearing", "w41-niddk-dia-monogenic", "w41-ada-classification-2026"]
  };

  const wolframSyndrome = {
    name: "Wolfram syndrome",
    displayName: "Wolfram Syndrome (WFS1 Spectrum Disorder)",
    category: "Endocrinology, Neuro-Ophthalmology & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "Wolfram syndrome is a rare progressive neurodegenerative and endocrine disorder. Classic Wolfram syndrome is usually caused by biallelic pathogenic WFS1 variants and is characterized by childhood-onset nonautoimmune insulin-dependent diabetes mellitus and optic atrophy, often followed by central diabetes insipidus, sensorineural hearing loss, urinary-tract dysfunction, and neurologic disease. The acronym DIDMOAD describes diabetes insipidus, diabetes mellitus, optic atrophy, and deafness, but not every feature is present when the diagnosis is first considered. WFS1-related dominant disorders and CISD2-related Wolfram syndrome have overlapping but distinct phenotypes.",
    pathology: "WFS1 encodes wolframin, an endoplasmic-reticulum membrane protein involved in calcium balance and the unfolded-protein stress response. Biallelic loss of function leaves pancreatic beta cells and vulnerable neurons unable to manage chronic ER stress, causing progressive cell dysfunction and death. Beta-cell loss causes insulin-deficient diabetes; optic-nerve degeneration causes optic atrophy; hypothalamic/posterior-pituitary pathway damage can cause arginine-vasopressin deficiency; and cochlear, brainstem, autonomic, and urinary-tract neural injury broadens the syndrome.",
    pathophysiology: [
      "Unresolved ER stress and disturbed intracellular calcium homeostasis activate injury pathways in beta cells, which have a high insulin-production burden. Progressive beta-cell loss causes nonautoimmune insulin-dependent diabetes.",
      "Retinal ganglion-cell and optic-nerve degeneration cause declining visual acuity, color-vision loss, and optic-disc pallor rather than ordinary diabetic retinopathy.",
      "Degeneration of vasopressin-producing pathways can cause central diabetes insipidus: large volumes of dilute urine lead to thirst, dehydration, and hypernatremia unless water and desmopressin are appropriately managed.",
      "Cochlear and central auditory injury causes sensorineural hearing loss, while brainstem, cerebellar, peripheral, autonomic, and psychiatric involvement can affect gait, swallowing, breathing, mood, and safety.",
      "Neurogenic bladder and upper urinary-tract dilation can injure kidneys. This is a neurologic/urologic complication and should not be assumed to be diabetic nephropathy."
    ],
    etiology: "Classic disease usually results from biallelic pathogenic/likely pathogenic WFS1 variants with autosomal-recessive inheritance. Heterozygous WFS1 variants can cause dominant WFS1 spectrum phenotypes such as hearing loss, cataracts, or variable diabetes and should not automatically be labeled classic Wolfram syndrome. Biallelic CISD2 variants cause Wolfram syndrome type 2, which can include diabetes, hearing loss, optic findings, and bleeding/peptic-ulcer features, often without classic diabetes insipidus. A WFS1 VUS or diabetes plus visual symptoms alone does not establish the syndrome.",
    riskFactors: [
      "Childhood or adolescent nonautoimmune insulin-dependent diabetes followed by optic atrophy",
      "Diabetes plus central diabetes insipidus, sensorineural hearing loss, neurogenic bladder, upper-tract dilation, ataxia, swallowing difficulty, or psychiatric symptoms",
      "Optic atrophy that is disproportionate to or mechanistically different from diabetic retinopathy",
      "Consanguinity, an affected sibling, or a known familial biallelic WFS1/CISD2 diagnosis",
      "Progressive multisystem disease with negative islet autoantibodies; no single DIDMOAD feature is required at first presentation"
    ],
    signsSymptoms: [
      "Diabetes mellitus commonly begins in childhood and causes polyuria, polydipsia, weight loss, fatigue, hyperglycemia, and insulin dependence; DKA can occur but is not the defining mechanism.",
      "Optic atrophy causes progressive loss of central visual acuity, color discrimination, and visual function with optic-disc pallor.",
      "Central diabetes insipidus causes intense thirst and high-volume dilute urine; inability to access water can rapidly produce dehydration and hypernatremia.",
      "Sensorineural hearing loss, tinnitus, imbalance, ataxia, peripheral neuropathy, dysphagia, sleep-disordered or central breathing problems, and autonomic dysfunction can emerge.",
      "Urinary frequency can reflect hyperglycemia, diabetes insipidus, or neurogenic bladder; residual urine, recurrent infection, hydronephrosis, and renal impairment require targeted evaluation.",
      "Depression, anxiety, impulsivity, cognitive or behavioral change, and suicide risk require direct assessment rather than being attributed to coping alone."
    ],
    diagnostics: [
      "Suspect the disorder when juvenile nonautoimmune diabetes and optic atrophy coexist, then map the full phenotype and age of onset: hearing, urine volume/thirst, sodium, bladder emptying, renal imaging/function, neurologic examination, swallowing/breathing, and mental health.",
      "Confirm diabetes and assess islet autoantibodies/C-peptide as appropriate. Diagnose optic atrophy with neuro-ophthalmic examination, visual acuity/color testing, fields and retinal/optic imaging; do not assume all visual loss is retinopathy.",
      "Evaluate suspected diabetes insipidus with paired serum/urine sodium and osmolality and specialist-directed testing. Exclude uncontrolled glucose, diuretics, primary polydipsia, renal concentrating defects, and other causes of polyuria.",
      "Obtain audiology, urologic assessment including residual/tract imaging when indicated, kidney function, neurologic/developmental assessment, swallow and respiratory evaluation when symptomatic, and mental-health screening.",
      "Establish the molecular diagnosis with biallelic pathogenic/likely pathogenic WFS1 variants for classic recessive disease or the appropriate confirmed spectrum genotype. A VUS does not establish Wolfram syndrome; phase and parental testing may be essential.",
      "Differentiate mitochondrial diabetes/MIDD, Alstrom syndrome, thiamine-responsive megaloblastic anemia, autoimmune polyglandular disease, isolated optic atrophy, hereditary hearing loss, and separate diabetes plus diabetes insipidus."
    ],
    treatments: [
      "Treat diabetes mellitus with insulin, glucose monitoring, hypoglycemia prevention, ketone/sick-day care, nutrition and standard complication surveillance. There is no established therapy that restores lost beta-cell mass.",
      "Treat confirmed central diabetes insipidus with carefully titrated desmopressin and assured water access under endocrinology guidance. Dose, route, illness, fluid intake, sodium, and periods of breakthrough urination must be coordinated to avoid both hypernatremia and dilutional hyponatremia.",
      "Provide low-vision rehabilitation, audiology/hearing technology, communication support, urologic bladder-emptying and renal-protection strategies, physical/occupational/speech/swallow therapies, and respiratory support as indicated.",
      "Screen and treat depression, anxiety, behavioral symptoms, sleep problems, and suicide risk. Integrate palliative/supportive care for symptom burden without abandoning disease-directed care.",
      "Offer genetic counseling, sibling/relative testing where appropriate, reproductive planning, and coordinated multidisciplinary follow-up; experimental therapies should be discussed only through qualified specialty/research programs."
    ],
    contraindications: [
      "Do not diagnose classic Wolfram syndrome from one heterozygous WFS1 variant or a VUS; dominant WFS1 spectrum disease and recessive classic disease are not interchangeable.",
      "Do not assume polyuria is simply high glucose. Diabetes insipidus and neurogenic bladder require different treatment, and multiple causes can coexist.",
      "Do not restrict water in suspected diabetes insipidus or give/hold desmopressin without reviewing urine output, intake, sodium, and the prescribed plan.",
      "Do not attribute optic atrophy to diabetic retinopathy or neurogenic urinary disease to diabetic nephropathy without targeted assessment.",
      "Do not ignore dysphagia, central apnea, depression, or suicidal thinking; neurologic and psychiatric complications can be life-threatening."
    ],
    nursingPriorities: [
      "Track glucose, insulin delivery, hypoglycemia, ketones during illness, and nutrition while distinguishing osmotic glucose diuresis from diabetes-insipidus urine loss.",
      "For diabetes insipidus, measure intake/output and urine pattern, daily weight when unstable, serum sodium/osmolality as ordered, thirst/access to water, desmopressin timing, and signs of both dehydration and water intoxication.",
      "Assess vision and hearing accommodations before education; use high-contrast/large-print, audio or tactile methods as appropriate and verify independent medication identification safely.",
      "Monitor bladder symptoms, timed voiding/catheter plan when prescribed, residuals, urinary infection, hydronephrosis/renal function, bowel function, gait/falls, swallowing and respiratory symptoms.",
      "Screen directly for mood change, self-harm and suicide risk, caregiver burden, school/work access, and progressive loss of function; escalate urgent safety concerns immediately.",
      "Keep one coordinated care plan naming diabetes mellitus, diabetes insipidus, vision/hearing status, bladder/renal needs, neurologic risks, emergency thresholds, and molecular diagnosis."
    ],
    redFlags: [
      "DKA signs, severe hypoglycemia, insulin interruption, or inability to self-administer safely because of vision/hearing/neurologic decline",
      "Very high dilute urine output, inability to access water, dehydration, confusion, seizure, or hypernatremia; or headache, nausea, confusion, seizure, weight gain, and hyponatremia after desmopressin/excess fluid",
      "New dysphagia, choking, aspiration, central apnea, breathing change, severe ataxia, or rapid neurologic decline",
      "Urinary retention, recurrent febrile infection, hydronephrosis, reduced kidney function, or inability to perform the bladder plan",
      "Suicidal thoughts, self-harm, severe behavioral change, or acute psychiatric crisis",
      "Rapid visual or hearing decline requiring safety and diagnostic reassessment"
    ],
    complications: [
      "DKA, severe hypoglycemia, and chronic diabetes microvascular/cardiovascular complications",
      "Progressive blindness from optic atrophy and communication disability from sensorineural hearing loss",
      "Hypernatremic dehydration from untreated diabetes insipidus or hyponatremic water intoxication from desmopressin/fluid mismatch",
      "Neurogenic bladder, recurrent urinary infection, hydronephrosis, and renal impairment",
      "Ataxia, dysphagia, aspiration, respiratory failure, peripheral/autonomic neuropathy, falls, and loss of independence",
      "Depression, suicide risk, social isolation, caregiver burden, and reduced quality of life"
    ],
    prognosis: "Classic Wolfram syndrome is progressive. Vision, hearing, neurologic, urinary, and endocrine manifestations often accumulate over time, and respiratory/brainstem or psychiatric complications can be life-threatening. The pace varies, including among siblings. Early molecular diagnosis, meticulous management of both diabetes types, renal/bladder protection, sensory accessibility, swallow/respiratory surveillance, and mental-health care improve safety and function but do not currently cure the neurodegenerative process.",
    prevention: "The genetic disorder cannot be prevented. Preventable complications include DKA and hypoglycemia, sodium emergencies, aspiration, urinary tract damage, falls, inaccessible education, and unaddressed suicide risk. Scheduled multidisciplinary surveillance, assured free-water access with a desmopressin plan, bladder care, sensory aids, vaccination and sick-day preparation, swallowing/respiratory assessment, and genetic counseling reduce harm.",
    patientEducation: [
      "Wolfram syndrome can affect insulin-producing cells, optic nerves, water-balance hormone pathways, hearing, bladder, and nervous system. New symptoms may be connected and should be reported early.",
      "Diabetes mellitus and diabetes insipidus are different: one concerns blood glucose and insulin; the other concerns water balance and vasopressin. Each needs its own emergency plan.",
      "Never restrict water or change desmopressin on your own. Seek urgent help for extreme urine output, inability to drink, confusion, seizure, sudden weight gain, or severe headache/nausea.",
      "Ask for visual and hearing accommodations for every medication lesson and device; loss of vision or hearing should not be mistaken for inability to participate in care.",
      "Report swallowing, breathing, bladder, balance, or mood changes promptly, including any thought of self-harm."
    ],
    nclexTraps: [
      "DIDMOAD = diabetes insipidus, diabetes mellitus, optic atrophy, and deafness, but the full tetrad may emerge over years.",
      "Diabetes mellitus is nonautoimmune insulin deficiency; diabetes insipidus is a water-balance disorder and does not cause hyperglycemia.",
      "Desmopressin without appropriate fluid/sodium management can cause dangerous hyponatremia; lack of water in untreated DI can cause dangerous hypernatremia.",
      "Optic atrophy is not diabetic retinopathy, and neurogenic bladder is not automatically diabetic nephropathy.",
      "Classic recessive Wolfram syndrome requires an appropriate biallelic molecular diagnosis; heterozygous WFS1 spectrum disease can be different."
    ],
    relatedTopics: ["Monogenic diabetes mellitus", "WFS1 spectrum disorder", "Central diabetes insipidus", "Optic atrophy", "Sensorineural hearing loss", "Neurogenic bladder", "Desmopressin", "Hypernatremia", "Hyponatremia", "Genetic counseling"],
    aliases: ["DIDMOAD syndrome", "DIDMOAD", "WFS1 spectrum disorder", "WFS1-related Wolfram syndrome", "Wolfram type 1", "Wolfram syndrome type 1", "Wolfram syndrome type 2", "juvenile diabetes optic atrophy syndrome"],
    abbreviations: ["WS", "DIDMOAD", "WFS1-SD"],
    commonMisspellings: ["Wolfgram syndrome", "Wolfram syndrom", "Wolfrom syndrome", "DIDMOAD syndome"],
    tags: ["Wolfram syndrome", "DIDMOAD", "WFS1", "diabetes mellitus and diabetes insipidus", "optic atrophy", "sensorineural hearing loss", "neurogenic bladder", "ER stress", "juvenile nonautoimmune diabetes"],
    sourceKeys: ["w41-genereviews-wfs1", "w41-niddk-dia-monogenic", "w41-ada-classification-2026"]
  };

  const syndromicMonogenicDiabetes = {
    name: "Syndromic monogenic diabetes",
    displayName: "Syndromic Monogenic Diabetes",
    category: "Endocrinology, Pediatrics & Medical Genetics",
    sourceNote: SOURCE_NOTE,
    definition: "Syndromic monogenic diabetes is diabetes caused by a single-gene or mitochondrial disorder in which clinically important disease also affects organs outside the pancreatic beta cell. It is a category for diagnostic reasoning, not one diagnosis and not a substitute for naming the syndrome. The combination of diabetes with congenital anomalies, deafness, optic disease, severe insulin resistance, immune dysregulation, liver failure, skeletal dysplasia, pancreatic malabsorption, renal disease, cardiomyopathy, or neurodevelopmental findings can reveal the causal pathway and urgent risks.",
    pathology: "A gene used across several tissues can connect hyperglycemia to an apparently unrelated organ pattern. A developmental transcription factor may build both pancreas and heart; an ER-stress protein may protect beta cells, liver, and bone; an immune-regulatory gene may prevent both enteropathy and autoimmune beta-cell loss; a ciliary gene may connect retinal degeneration, obesity, cardiomyopathy, kidney disease, and insulin resistance; and mitochondrial dysfunction can link diabetes to deafness or neuromuscular disease. The extra-pancreatic phenotype is therefore mechanistic evidence, not incidental decoration.",
    pathophysiology: [
      "Pancreatic-development disorders such as GATA6, PDX1, PTF1A, RFX6, and HNF1B reduce endocrine mass and may add cardiac, cerebellar, intestinal, gallbladder, renal, genital, or exocrine pancreatic anomalies.",
      "Cell-stress disorders include EIF2AK3-related Wolcott-Rallison syndrome, in which inability to manage ER stress causes neonatal diabetes, episodic liver failure, and skeletal dysplasia, and WFS1 disease, which causes beta-cell and neurodegenerative injury.",
      "Immune-regulatory disorders such as FOXP3-related IPEX can cause early autoimmune diabetes together with severe enteropathy, eczema, cytopenias, nephropathy, infection risk, and systemic autoimmunity.",
      "Ciliopathies and severe-insulin-resistance syndromes can produce diabetes through insulin resistance rather than primary secretory failure. ALMS1-related Alstrom syndrome combines cone-rod dystrophy, hearing loss, obesity, cardiomyopathy, kidney/liver disease, and early severe insulin resistance.",
      "Mitochondrial and transport disorders can link secretory failure to deafness, anemia, cardiac, retinal, neurologic, or multisystem disease; SLC19A2-related thiamine-responsive megaloblastic anemia is a key treatable example but still requires specialist dosing and surveillance.",
      "The same glucose phenotype can therefore reflect absent pancreas, beta-cell death, autoimmune destruction, secretion failure, or severe resistance. Mechanism determines whether therapy centers on insulin, sulfonylurea, thiamine, immune treatment, leptin in selected lipodystrophy, or another syndrome-specific strategy."
    ],
    etiology: "The category includes validated pathogenic variants with many inheritance patterns: autosomal recessive EIF2AK3, ALMS1, WFS1 classic disease, SLC19A2 and multiple pancreatic-development syndromes; X-linked FOXP3; autosomal-dominant HNF1B or GATA6; and maternal mitochondrial disorders. De novo variants are common in some dominant conditions. Not every syndrome with diabetes is monogenic, and an obesity, deafness, or congenital-anomaly phenotype does not identify one gene. Molecular confirmation requires a pathogenic/likely pathogenic result and coherent phenotype; a VUS must not be used as a syndrome label.",
    riskFactors: [
      "Neonatal or very early diabetes plus any congenital anomaly, severe growth failure, developmental delay, hypotonia, seizure, liver dysfunction, skeletal disease, thyroid disorder, glaucoma, or malabsorption",
      "Diabetes plus optic atrophy, cone-rod dystrophy, sensorineural hearing loss, cardiomyopathy, diabetes insipidus, renal/urinary anomalies, or neurogenic bladder",
      "Early diabetes with severe watery diarrhea, eczema, recurrent infection, cytopenia, nephropathy, or other autoimmune disease suggesting immune dysregulation",
      "Severe insulin resistance out of proportion to body size, acanthosis, abnormal fat distribution/lipodystrophy, extreme triglycerides, fatty liver, or early cardiometabolic disease",
      "Consanguinity, affected siblings, maternal-only multisystem disease, recurrent unexplained childhood deaths, or a known familial pathogenic variant",
      "Atypical clinical evolution that cannot be unified by type 1 or type 2 diabetes alone"
    ],
    signsSymptoms: [
      "Hyperglycemia may be mild, progressive, insulin-resistant, or profoundly insulin-deficient with DKA; the label syndromic does not predict metabolic severity.",
      "Wolcott-Rallison clues include neonatal/infant diabetes, later spondyloepiphyseal dysplasia, growth failure, and episodic potentially fatal liver dysfunction.",
      "IPEX clues in an infant—especially a male—include insulin-dependent diabetes, intractable watery diarrhea, eczematous dermatitis, cytopenias, and other autoimmunity or infection.",
      "Alstrom clues include infantile nystagmus/photophobia from cone-rod dystrophy, childhood obesity and insulin resistance, progressive hearing loss, cardiomyopathy, kidney/liver disease, and hypertriglyceridemia.",
      "Thiamine-responsive megaloblastic anemia syndrome can combine megaloblastic anemia, diabetes, and sensorineural deafness; anemia may improve with thiamine even when diabetes/hearing response is incomplete.",
      "Pancreatic-development syndromes can include exocrine insufficiency, intestinal atresia, gallbladder agenesis, congenital heart disease, renal anomalies, hypothyroidism, glaucoma, or cerebellar disease."
    ],
    diagnostics: [
      "Stabilize the glucose emergency first, then create a timed phenotype map: prenatal growth, birth findings, age at diabetes, DKA, insulin resistance versus deficiency, development, hearing/vision, heart, liver, kidneys/urinary tract, thyroid, skeleton, skin/immune system, stool/nutrition, and congenital anatomy.",
      "Use targeted clinical studies to protect organs while genetics proceeds: CBC and immune data, liver/coagulation studies, thyroid and renal/electrolytes, cardiac testing, formal ophthalmology/audiology, pancreatic exocrine tests and imaging, skeletal or neuroimaging, and developmental assessment as indicated.",
      "Choose genetic testing with a medical geneticist or monogenic-diabetes service. A broad panel, copy-number analysis, methylation study, mitochondrial testing, or exome/genome may be more appropriate than sequential single-gene tests when the phenotype overlaps.",
      "Interpret pathogenicity, zygosity, phase, inheritance, and phenotype together. Two variants in a recessive gene may need proof they are on opposite copies; a VUS does not establish the syndrome or justify high-risk targeted therapy.",
      "Continue evaluating common and acquired disease. Infection, medications, malnutrition, autoimmune type 1 diabetes, type 2 diabetes, pancreatic injury, and chromosomal disorders can coexist with or mimic a monogenic syndrome.",
      "Revisit the diagnosis over time. Age-dependent features may make a previously nonspecific infant phenotype recognizable, and negative older genetic tests may warrant reanalysis as methods and gene validation improve."
    ],
    treatments: [
      "Treat DKA, severe hyperglycemia, hypoglycemia, dehydration, sepsis, liver failure, cardiac decompensation, adrenal/thyroid crisis, or other acute physiology immediately; do not wait for a syndrome name.",
      "Use mechanism-directed diabetes therapy after confirmation: insulin for profound deficiency; sulfonylurea for selected KATP disease; intensive insulin-resistance treatment for Alstrom/lipodystrophy phenotypes; and syndrome-specific therapy such as thiamine for confirmed SLC19A2 disease. Response must be monitored rather than assumed.",
      "Treat the extra-pancreatic disease through a coordinated team. Examples include pancreatic enzymes/nutrition, hearing and vision rehabilitation, thyroid replacement, liver and cardiac surveillance, bladder/renal protection, developmental therapies, and orthopedic care.",
      "Immune-dysregulation syndromes require urgent immunology/transplant expertise; ordinary diabetes treatment alone cannot control systemic autoimmunity, severe enteropathy, infection, or cytopenias.",
      "Provide genetic counseling, molecularly targeted relative testing, reproductive planning, mental-health and social support, school/work accommodations, and a written emergency plan naming the syndrome-specific risks."
    ],
    contraindications: [
      "Do not use 'syndromic diabetes' as the final diagnosis when a specific molecular syndrome is known; the exact name carries treatment and emergency information.",
      "Do not delay resuscitation, insulin, dextrose, antimicrobials, liver support, or other urgent care for genetic testing.",
      "Do not apply one therapy to the whole category or use a VUS to justify sulfonylurea, thiamine, immunosuppression, insulin withdrawal, or reproductive prediction.",
      "Do not assume obesity proves ordinary type 2 diabetes or that leanness proves insulin deficiency; syndromic mechanisms include both resistance and secretion failure.",
      "Do not allow normal findings early in childhood to end surveillance for age-dependent hearing, vision, renal, hepatic, cardiac, skeletal, or neurologic disease."
    ],
    nursingPriorities: [
      "Lead with the immediate threat: glucose/ketones and hydration, liver/coagulation, infection and immune status, cardiac/respiratory function, sodium/water balance, feeding/nutrition, or neurologic status according to presentation.",
      "Maintain a syndrome-specific observation plan rather than a generic diabetes checklist. Trend growth, development, stool, skin, hearing/vision, mobility, urine/bladder, blood pressure, relevant laboratory data, and treatment toxicities.",
      "Reconcile exact insulin and special formulations, enzyme or vitamin timing, immunosuppressants, hormone replacements, cardiac/renal dosing, emergency rescue medicines, and interactions; rare-disease regimens are vulnerable to transition errors.",
      "Adapt teaching for sensory, cognitive, developmental, language, motor, and health-literacy needs. Train multiple caregivers and school/work supports using teach-back and return demonstration.",
      "Escalate new organ symptoms even when glucose is stable; in Wolcott-Rallison, for example, an acute liver crisis may be more immediately lethal than the diabetes.",
      "Document the exact gene, inheritance, variant classification, confirmed and anticipated manifestations, emergency risks, specialist owners, and family plan in every handoff."
    ],
    redFlags: [
      "DKA, severe hypoglycemia, dehydration, shock, or interrupted insulin delivery",
      "Jaundice, hepatomegaly, bleeding, hypoglycemia, vomiting, or acute liver dysfunction in a child with possible EIF2AK3/Wolcott-Rallison disease",
      "Severe infant diarrhea, eczema, infection, cytopenia, or multisystem autoimmunity suggesting IPEX or another immune dysregulation emergency",
      "Cardiomyopathy symptoms, syncope, respiratory distress, severe hypertriglyceridemia/pancreatitis, or progressive kidney failure",
      "Seizure, developmental regression, acute vision/hearing change, severe hypothyroidism, glaucoma, intestinal obstruction, or major congenital-organ decompensation",
      "Any high-risk syndrome-specific treatment proposed from a VUS or unverified external report"
    ],
    complications: [
      "DKA, severe hypoglycemia, growth failure, and standard microvascular/cardiovascular complications where chronic hyperglycemia is substantial",
      "Acute liver failure, skeletal disease, renal failure, cardiomyopathy, severe hypertriglyceridemia, pancreatic malabsorption, thyroid or other endocrine failure",
      "Blindness, hearing loss, neurodevelopmental disability, epilepsy, neurogenic bladder, respiratory/swallowing disease, and loss of independence",
      "Life-threatening autoimmunity, enteropathy, cytopenias, infection, and treatment-related immunosuppression complications",
      "Diagnostic delay, fragmented specialty care, inaccessible education, caregiver burnout, and inaccurate family/reproductive counseling"
    ],
    prognosis: "Prognosis ranges from manageable multisystem disease to life-threatening infancy syndromes and depends on the gene and organ burden, not the umbrella label. A molecular diagnosis can reveal treatable pathways, anticipate crises, and focus family testing, but does not guarantee a therapy. Long-term outcome improves when glucose safety, nutrition, development, sensory access, organ surveillance, mental health, and care coordination are addressed together.",
    prevention: "The causal variant is generally not preventable. Preventable harm includes missed DKA, sepsis, liver or cardiac crisis, malnutrition, organ damage, medication errors, and delayed recognition in relatives. Early phenotype-guided testing, newborn/child surveillance when familial risk is known, vaccination and infection planning, emergency letters, multidisciplinary follow-up, accessible education, and genetic counseling reduce these harms.",
    patientEducation: [
      "Syndromic monogenic diabetes means the same genetic condition can affect glucose and other organs. The exact syndrome name is more useful than the umbrella term.",
      "Report new hearing, vision, growth, stool, skin, infection, liver, heart, kidney, bladder, bone, movement, learning, or mood symptoms even when glucose is stable.",
      "Never start a special vitamin, tablet, immune medicine, or stop insulin because an online list matches symptoms; gene-specific treatments require confirmed diagnosis and monitoring.",
      "Ask for one written plan that lists routine surveillance, emergency warning signs, medication details, accommodations, and which specialist owns each problem.",
      "A VUS is uncertain. It should not be used to label relatives or predict a pregnancy without genetics review."
    ],
    nclexTraps: [
      "Syndromic monogenic diabetes is a category, not a single card-ready final diagnosis; name the gene/syndrome whenever confirmed.",
      "Extra-pancreatic findings explain mechanism and may identify the most urgent threat, such as liver failure in Wolcott-Rallison or enteropathy/sepsis risk in IPEX.",
      "Not every syndromic form is insulin-deficient: Alstrom and lipodystrophy phenotypes can involve profound insulin resistance.",
      "Thiamine-responsive megaloblastic anemia is a gene-specific treatable clue; thiamine is not a universal treatment for monogenic diabetes.",
      "A VUS never replaces phenotype, inheritance, phase, and pathogenicity evidence."
    ],
    relatedTopics: ["Monogenic diabetes mellitus", "Neonatal diabetes mellitus", "Wolfram syndrome", "Maternally inherited diabetes and deafness", "Wolcott-Rallison syndrome", "IPEX syndrome", "Alstrom syndrome", "Thiamine-responsive megaloblastic anemia", "Lipodystrophy", "Pancreatic agenesis", "Genetic counseling"],
    aliases: ["syndromic diabetes", "genetic syndromic diabetes", "monogenic diabetes syndrome", "diabetes with congenital anomalies", "diabetes with deafness and blindness", "multisystem genetic diabetes", "rare genetic diabetes syndrome"],
    abbreviations: ["SMD"],
    commonMisspellings: ["syndromic monogenetic diabetes", "syndromal diabetes", "syndromic diabeties", "multisystem monogenic diabetis"],
    tags: ["syndromic monogenic diabetes", "multisystem diabetes", "diabetes congenital anomalies", "Wolcott-Rallison", "IPEX", "Alstrom syndrome", "thiamine-responsive megaloblastic anemia", "pancreatic development genes", "immune dysregulation diabetes", "genetic counseling"],
    sourceKeys: ["w41-genereviews-pndm", "w41-genereviews-wfs1", "w41-genereviews-mito-hearing", "w41-niddk-dia-monogenic", "w41-ada-classification-2026"]
  };

  const cards = [
    monogenicDiabetes,
    mody,
    gckMody,
    hnf1aMody,
    hnf4aMody,
    hnf1bDiabetes,
    katpDiabetes,
    neonatalDiabetes,
    transientNeonatalDiabetes,
    permanentNeonatalDiabetes,
    midd,
    wolframSyndrome,
    syndromicMonogenicDiabetes
  ];

  const upsertResults = [];
  cards.forEach((card) => {
    const key = normalize(card.name);
    const matches = database.diseases.filter((entry) => normalize(titleOf(entry)) === key);
    const existed = matches.length > 0;
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

    upsertResults.push(Object.freeze({
      canonicalName: card.name,
      action: existed ? "updated" : "inserted",
      sourceKeys: Object.freeze(card.sourceKeys.slice()),
      aliasCount: card.aliases.length,
      removedDuplicateCount
    }));
  });

  const frozenSourceResults = Object.freeze(sourceResults.slice());
  const frozenUpsertResults = Object.freeze(upsertResults.slice());

  window.ANI_PATHOLOGY_WAVE41_DIABETES_MONOGENIC = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    applied: true,
    sourceNote: SOURCE_NOTE,
    cardCount: cards.length,
    sourceCount: sourceReferences.length,
    insertedCount: upsertResults.filter((result) => result.action === "inserted").length,
    updatedCount: upsertResults.filter((result) => result.action === "updated").length,
    removedDuplicateCount: upsertResults.reduce((sum, result) => sum + result.removedDuplicateCount, 0),
    sourceResults: frozenSourceResults,
    upsertResults: frozenUpsertResults,
    cards: frozenUpsertResults
  });
})();
