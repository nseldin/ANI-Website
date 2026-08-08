/*
 * ANI Clinical Frontier Wave 44 - hematology content integrity.
 *
 * This file deliberately replaces the complete Hemophilia, Hemophilia A, and
 * Hemophilia B records instead of merging selected fields. Earlier generated
 * scaffolds contained hematology/oncology boilerplate that was inappropriate
 * for inherited factor deficiencies. The explicit medication lists are also
 * a safety boundary: contraindicated antiplatelet language must never be
 * interpreted as a treatment recommendation.
 */
(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  const VERSION = "2026-07-22-wave44-heme-integrity-1";
  const GENERATED_AT = "2026-07-22";

  const sources = [
    {
      key: "w44-niddk-hemochromatosis-definition",
      label: "NIDDK: Definition and Facts for Hemochromatosis",
      url: "https://www.niddk.nih.gov/health-information/liver-disease/hemochromatosis/definition-facts",
      note: "Supports the primary, secondary, and neonatal classifications and the liver, heart, pancreatic, endocrine, and joint consequences of iron overload."
    },
    {
      key: "w44-niddk-hemochromatosis-diagnosis",
      label: "NIDDK: Diagnosis of Hemochromatosis",
      url: "https://www.niddk.nih.gov/health-information/liver-disease/hemochromatosis/diagnosis",
      note: "Supports transferrin saturation, ferritin, HFE testing, and selective liver assessment in the diagnosis and staging of hemochromatosis."
    },
    {
      key: "w44-niddk-hemochromatosis-treatment",
      label: "NIDDK: Treatment of Hemochromatosis",
      url: "https://www.niddk.nih.gov/health-information/liver-disease/hemochromatosis/treatment",
      note: "Supports therapeutic phlebotomy for most primary hemochromatosis and iron chelation when transfusion-related anemia makes phlebotomy unsuitable."
    },
    {
      key: "w44-easl-hemochromatosis-2022",
      label: "EASL Clinical Practice Guidelines on Haemochromatosis (2022)",
      url: "https://easl.eu/wp-content/uploads/2022/06/PIIS01688278220021121.pdf",
      note: "Supports diagnosis, fibrosis and organ assessment, phlebotomy targets, maintenance monitoring, family evaluation, and hepatocellular-carcinoma surveillance."
    },
    {
      key: "w44-ncbi-hfe-genereviews-2024",
      label: "NCBI GeneReviews: HFE-Related Hemochromatosis (updated 2024)",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK1440/",
      note: "Supports hepcidin-ferroportin physiology, penetrance-aware genetic interpretation, organ manifestations, phlebotomy, and long-term surveillance."
    },
    {
      key: "w44-cdc-hemophilia-overview",
      label: "CDC: About Hemophilia",
      url: "https://www.cdc.gov/hemophilia/about/index.html",
      note: "Supports the factor VIII and IX distinction, deep and joint bleeding pattern, critical-site hemorrhage risk, and prompt factor replacement."
    },
    {
      key: "w44-cdc-hemophilia-treatment",
      label: "CDC: Treatment of Hemophilia",
      url: "https://www.cdc.gov/hemophilia/treatment/index.html",
      note: "Supports factor replacement, episodic versus prophylactic treatment, hemophilia treatment-center care, inhibitor awareness, and emicizumab prophylaxis for hemophilia A."
    },
    {
      key: "w44-nhlbi-bleeding-treatment",
      label: "NHLBI: Bleeding Disorders Treatment",
      url: "https://www.nhlbi.nih.gov/health/bleeding-disorders/treatment",
      note: "Supports factor replacement, selected desmopressin and antifibrinolytic use, nonfactor therapy, and bypassing treatment when inhibitors block replacement factor."
    },
    {
      key: "w44-nhlbi-bleeding-diagnosis",
      label: "NHLBI: Bleeding Disorders Diagnosis",
      url: "https://www.nhlbi.nih.gov/health/bleeding-disorders/diagnosis",
      note: "Supports CBC, PT, aPTT, mixing studies, specific factor assays, inhibitor testing, and genetic evaluation for inherited and acquired bleeding disorders."
    },
    {
      key: "w44-wfh-hemophilia-guidelines",
      label: "World Federation of Hemophilia: Guidelines for the Management of Hemophilia, Third Edition",
      url: "https://guidelines.wfh.org/guidelines/",
      note: "Supports prophylaxis, early bleed treatment, musculoskeletal protection, inhibitor and laboratory management, procedural planning, and multidisciplinary hemophilia care."
    },
    {
      key: "w44-fda-emicizumab",
      label: "FDA: Emicizumab for Hemophilia A With or Without Factor VIII Inhibitors",
      url: "https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-emicizumab-kxwh-hemophilia-or-without-factor-viii-inhibitors",
      note: "Supports emicizumab as routine prophylaxis for hemophilia A and the thrombotic-microangiopathy and thrombosis warning with high cumulative activated PCC exposure."
    },
    {
      key: "w44-isth-antithrombotic-hemophilia",
      label: "ISTH, EHA, EAHAD, and ESO: Antithrombotic Treatment in Patients With Hemophilia Guidance",
      url: "https://www.isth.org/news/642515/ISTH-EHA-EAHAD-and-ESO-Publishes-Antithrombotic-Treatment-in-Patients-with-Hemophilia-Guideline.htm",
      note: "Supports individualized specialist management when a separate cardiovascular or thrombotic indication requires antiplatelet or anticoagulant therapy in a person with hemophilia."
    }
  ];

  const hemochromatosis = {
    name: "Hemochromatosis",
    displayName: "Hemochromatosis",
    category: "Hematology and Hepatology - Iron Overload Disorders",
    sourceCategory: "Hematology and Hepatology",
    sourceSubcategory: "Iron overload disorders",
    definition: "Hemochromatosis is a disorder in which iron accumulates beyond the body's needs and progressively injures organs. In the common hereditary form, impaired hepcidin signaling leaves ferroportin too active, so the intestine continues absorbing iron even when stores are already high. Transferrin eventually becomes overly saturated; reactive non-transferrin-bound iron then enters the liver, pancreas, heart, pituitary, skin, and joints, where oxidative injury can cause cirrhosis, diabetes, cardiomyopathy, hypogonadism, pigmentation, and arthropathy. The key treatment principle is to remove excess iron before irreversible organ damage develops.",
    pathology: "Iron balance is normally controlled at absorption because the body has no regulated pathway for excreting large amounts of iron. Hepcidin made by the liver binds ferroportin, the iron exporter on intestinal cells and macrophages, and causes it to be internalized. In hereditary hemochromatosis, HFE-related or less common iron-regulation defects lower effective hepcidin signaling or create hepcidin resistance. Ferroportin remains active, plasma iron rises, transferrin saturation increases, and excess reactive iron catalyzes free-radical injury. Secondary iron overload reaches the same organ-toxicity endpoint by a different route, most often repeated transfusion; each transfused red-cell unit adds iron that the body cannot actively eliminate.",
    pathophysiology: [
      "Inappropriately low hepcidin activity or hepcidin resistance allows continued intestinal iron absorption and macrophage iron release despite adequate stores.",
      "When transferrin binding capacity is exceeded, reactive iron circulates outside normal protein protection and enters parenchymal cells.",
      "Iron-driven oxidative stress damages membranes, proteins, mitochondria, and DNA; repeated injury activates inflammation and fibrosis, especially in the liver.",
      "Pancreatic beta-cell injury can reduce insulin secretion, while liver injury can add insulin resistance; this explains the connection with hemochromatosis-associated diabetes.",
      "Cardiac iron can impair conduction and contraction, pituitary or gonadal iron can lower sex hormones, and joint iron is associated with a characteristic arthropathy that may persist after iron removal."
    ],
    classification: [
      "Primary or hereditary hemochromatosis: most often HFE-related, with less common non-HFE forms involving other iron-regulation genes.",
      "Secondary iron overload, also called secondary hemochromatosis or hemosiderosis in some references: usually repeated transfusion, ineffective erythropoiesis, or another acquired iron-loading state.",
      "Neonatal hemochromatosis is a distinct fetal liver-injury syndrome and must not be treated as ordinary adult HFE-related disease."
    ],
    etiology: "The common hereditary form is associated with biallelic pathogenic HFE variants, especially p.Cys282Tyr, but genotype does not equal inevitable clinical disease because penetrance varies. Non-HFE hereditary forms can involve HJV, HAMP, TFR2, SLC40A1, and other iron-regulation genes and may present earlier or behave differently. Secondary overload most often follows chronic red-cell transfusion or ineffective erythropoiesis. Chronic liver disease, alcohol exposure, metabolic liver disease, inflammation, and iron supplementation can alter ferritin or worsen injury, but an elevated ferritin alone does not prove hemochromatosis.",
    riskFactors: [
      "A first-degree relative with confirmed hereditary hemochromatosis or iron overload",
      "HFE p.Cys282Tyr homozygosity or another established iron-regulation disorder",
      "Repeated red-cell transfusion, transfusion-dependent anemia, or ineffective erythropoiesis",
      "Persistently elevated transferrin saturation together with rising ferritin",
      "Heavy alcohol exposure or coexisting chronic liver disease, which can accelerate fibrosis",
      "Earlier severe disease, cardiomyopathy, or hypogonadism suggesting a non-HFE or juvenile form"
    ],
    signsSymptoms: [
      "Many patients are asymptomatic early; fatigue and weakness are common but nonspecific.",
      "Pain or stiffness in the second and third metacarpophalangeal joints, knees, hips, or other joints may reflect iron-related arthropathy or calcium-pyrophosphate deposition.",
      "Hepatomegaly, right-upper-quadrant discomfort, elevated liver tests, fibrosis, cirrhosis, jaundice, ascites, or portal-hypertension findings indicate hepatic involvement.",
      "Bronze or gray skin pigmentation can occur, but its absence does not exclude clinically important iron overload.",
      "Polyuria, polydipsia, weight change, or hyperglycemia can reflect pancreatic and hepatic injury causing diabetes.",
      "Loss of libido, erectile dysfunction, amenorrhea, infertility, or osteoporosis can reflect pituitary or gonadal injury.",
      "Palpitations, conduction disease, arrhythmia, exertional dyspnea, edema, syncope, or heart failure can reflect cardiac iron and require prompt assessment."
    ],
    diagnostics: [
      "Start with transferrin saturation and ferritin interpreted together and in clinical context. Persistent elevation of transferrin saturation suggests excessive circulating iron, whereas ferritin estimates stores but also rises with inflammation, infection, alcohol-associated or metabolic liver disease, kidney disease, and malignancy.",
      "Repeat or confirm abnormal iron studies as clinically appropriate and review transfusions, anemia, supplements, alcohol, inflammation, liver disease, and family history before assigning the diagnosis.",
      "Use HFE genotyping when biochemical and clinical findings support hereditary hemochromatosis. A variant alone does not show how much organ injury exists, and common low-penetrance genotypes should not be used to explain every high ferritin result.",
      "When the genotype is not the usual diagnostic HFE pattern, confirm actual hepatic iron overload with validated MRI or, when specifically indicated, liver biopsy before labeling a rare hereditary form.",
      "Stage liver fibrosis noninvasively when possible and assess glucose, liver function, cardiac symptoms, endocrine function, bones, and joints according to the phenotype because treatment urgency and surveillance depend on organ injury.",
      "Offer appropriately counseled testing to adult first-degree relatives after hereditary disease is confirmed."
    ],
    labs: [
      "Transferrin saturation is often persistently elevated in absorption-driven hemochromatosis.",
      "Ferritin may be elevated from iron stores, inflammation, liver injury, infection, kidney disease, or malignancy; it is not diagnostic by itself.",
      "Hemoglobin and hematocrit must be checked during phlebotomy because excessive removal can create symptomatic anemia.",
      "AST, ALT, bilirubin, albumin, INR, platelet count, glucose or A1C, and cause-directed endocrine tests help assess organ consequences rather than confirm iron overload alone.",
      "MRI-based liver or cardiac iron measurement may be used when biochemical results, transfusion history, genotype, or organ findings require direct iron quantification."
    ],
    differentialDiagnoses: [
      "Inflammation, infection, malignancy, kidney disease, alcohol-associated liver disease, and metabolic dysfunction-associated steatotic liver disease causing high ferritin without primary iron overload",
      "Transfusional iron overload or ineffective erythropoiesis rather than absorption-driven HFE hemochromatosis",
      "Ferroportin disease and other non-HFE hereditary iron disorders",
      "Wilson disease, alpha-1 antitrypsin deficiency, viral hepatitis, and autoimmune liver disease",
      "Iron-loading anemias, excessive supplements, and rare occupational or dietary iron exposure"
    ],
    treatments: [
      "For most patients with primary hemochromatosis and true iron overload who can tolerate blood removal, therapeutic phlebotomy is first-line because every removed red-cell volume forces the marrow to use stored iron to make replacement hemoglobin.",
      "During the iron-depletion phase, remove blood at an individualized interval while checking hemoglobin and ferritin. Guideline targets are approximately 50 micrograms/L ferritin during induction and 50-100 micrograms/L during maintenance when tolerated; the treating service adjusts frequency for age, symptoms, comorbidity, and laboratory response.",
      "After iron depletion, use less frequent maintenance phlebotomy and lifelong ferritin monitoring because the inherited absorption tendency persists even when current stores are normal.",
      "For transfusion-related overload, clinically important anemia, or another situation in which phlebotomy is unsafe, use specialist-directed iron chelation such as deferasirox, deferiprone, or deferoxamine only when the specific disease, organ burden, kidney and liver function, blood counts, interactions, and product label support it. Chelation is not routine first-line treatment for uncomplicated HFE hemochromatosis.",
      "Treat cirrhosis, diabetes, cardiomyopathy or arrhythmia, hypogonadism, osteoporosis, and joint disease directly because established organ damage may not reverse when iron is removed.",
      "Continue hepatocellular-carcinoma surveillance when advanced fibrosis or cirrhosis warrants it even after iron depletion, because removing iron does not erase preexisting cancer risk."
    ],
    medicationsCommonlyUsed: ["Deferasirox", "Deferiprone", "Deferoxamine"],
    directTreatmentMedications: ["Deferasirox", "Deferiprone", "Deferoxamine"],
    medicationTreatmentSafetyPolicy: "curated-explicit-v2",
    medicationInferenceMode: "explicit-only",
    medicationTreatmentNote: "These chelators are conditional therapies for selected secondary or phlebotomy-intolerant iron overload. Therapeutic phlebotomy, a procedure rather than a medication, is first-line for most uncomplicated hereditary hemochromatosis with iron overload.",
    contraindications: [
      "Do not diagnose or treat hemochromatosis from ferritin alone; confirm the iron-loading pattern and investigate inflammatory, hepatic, metabolic, malignant, renal, transfusional, and supplement-related explanations.",
      "Do not perform routine phlebotomy in a patient with incompatible anemia, hemodynamic instability, or inability to replace red cells safely; reassess the cause and use specialist alternatives.",
      "Do not prescribe iron supplements or high-dose vitamin C in established overload unless a clinician identifies a separate indication, because vitamin C can increase iron absorption and mobilize reactive iron.",
      "Do not use a restrictive diet as a substitute for iron removal. Avoid raw or undercooked shellfish because iron overload increases vulnerability to severe Vibrio vulnificus infection, and minimize alcohol when liver injury is present.",
      "Do not assume that phlebotomy will reverse cirrhosis, established diabetes, hypogonadism, or arthropathy; continue disease-specific treatment and surveillance."
    ],
    nursingPriorities: [
      "Verify the type and evidence of iron overload, transfusion and anemia history, baseline hemoglobin, ferritin trend, liver status, cardiac symptoms, and prescribed removal target because primary and secondary overload do not use the same treatment pathway.",
      "Before and after phlebotomy, assess blood pressure, pulse, hydration, dizziness, syncope risk, venous access, and hemoglobin because rapid volume removal can cause hypotension and repeated treatment can cause anemia.",
      "Trend ferritin across treatments rather than reacting to one value, and communicate an unexpected rise, falling hemoglobin, poor tolerance, or failure to reach target because inflammation, ongoing iron input, incorrect diagnosis, or an unsafe schedule may be present.",
      "Assess for liver decompensation, hyperglycemia, dysrhythmia or heart failure, endocrine dysfunction, skin change, and joint limitation because iron toxicity is systemic even when the original abnormality was found on a liver panel.",
      "For chelation, verify the exact agent and label-specific CBC, kidney, liver, hearing, vision, gastrointestinal, rash, and interaction monitoring because the three chelators are not interchangeable and can cause serious toxicity.",
      "Reinforce family evaluation, avoidance of unprescribed iron, liver-protective care, and scheduled cancer surveillance because early detection prevents more injury than late treatment can reverse."
    ],
    redFlags: [
      "Syncope, chest pain, new palpitations, sustained arrhythmia, rapidly worsening dyspnea, or heart-failure signs",
      "Jaundice, ascites, hematemesis, melena, confusion, marked coagulopathy, or another sign of liver decompensation",
      "Severe hyperglycemia, ketones, dehydration, or altered consciousness",
      "Hypotension, fainting, chest symptoms, or symptomatic anemia during or after phlebotomy",
      "Fever, sepsis symptoms, or rapidly progressive skin and soft-tissue infection after raw-shellfish or seawater exposure",
      "Chelator-associated agranulocytosis warning symptoms, acute kidney or liver injury, severe rash, gastrointestinal bleeding, or sensory change"
    ],
    complications: [
      "Hepatic fibrosis, cirrhosis, portal hypertension, liver failure, and hepatocellular carcinoma",
      "Diabetes from pancreatic beta-cell injury plus hepatic metabolic dysfunction",
      "Cardiomyopathy, conduction disease, atrial or ventricular arrhythmia, and heart failure",
      "Hypogonadotropic hypogonadism, infertility, hypothyroidism in selected forms, and osteoporosis",
      "Chronic arthropathy and calcium-pyrophosphate crystal disease that may persist after iron depletion",
      "Treatment-related anemia or hypotension from excessive phlebotomy and drug-specific toxicity from chelation"
    ],
    prognosis: "Diagnosis before cirrhosis or cardiac injury allows iron removal to prevent much of the excess morbidity and can preserve a normal lifespan. Liver and cardiac function may improve when injury is not fixed, but arthropathy, endocrine failure, established diabetes, and cirrhosis often persist. Advanced fibrosis continues to carry hepatocellular-carcinoma risk after iron depletion, so successful phlebotomy does not end surveillance.",
    prevention: "Inherited susceptibility cannot be prevented, but adult family detection, confirmation of biochemical iron loading, and treatment before organ damage can prevent complications. In transfusion-dependent patients, track cumulative exposure and iron burden early so chelation begins before severe organ deposition. Avoid unnecessary iron supplementation and address alcohol and coexisting liver disease.",
    patientEducation: [
      "Hemochromatosis means too much iron, not iron-deficiency anemia. Do not start or stop iron-containing vitamins based on fatigue alone.",
      "Phlebotomy works because the body must draw stored iron into new red cells after blood is removed; maintenance is still needed after the first course because the absorption tendency remains.",
      "Ferritin can rise from inflammation, so one high value is a clue rather than proof. Keep repeat iron studies, genetic counseling, imaging, and organ-assessment appointments.",
      "Report fainting with phlebotomy, palpitations, swelling, jaundice, abdominal enlargement, black stool, confusion, severe thirst or urination, or rapidly worsening joint function.",
      "Tell first-degree adult relatives when hereditary disease is confirmed so they can seek properly counseled testing before symptoms develop."
    ],
    nclexTraps: [
      "High ferritin does not equal hemochromatosis; ferritin is an acute-phase reactant and must be paired with transferrin saturation and the clinical context.",
      "Phlebotomy is first-line for most hereditary hemochromatosis with iron overload, while chelation is mainly for selected secondary overload or inability to remove blood safely.",
      "Removing iron prevents progression more reliably than it reverses cirrhosis, diabetes, hypogonadism, or arthropathy.",
      "Hereditary hemochromatosis and transfusional iron overload share iron toxicity but not the same cause or routine treatment.",
      "A positive HFE result does not by itself measure penetrance, current iron burden, fibrosis, or organ damage."
    ],
    relatedTopics: [
      "Hemochromatosis-associated diabetes",
      "Ferritin",
      "Transferrin saturation",
      "Cirrhosis",
      "Liver cancer",
      "Cardiomyopathy",
      "Diabetes mellitus",
      "Calcium pyrophosphate deposition disease",
      "Deferasirox",
      "Deferiprone",
      "Deferoxamine"
    ],
    aliases: [
      "haemochromatosis",
      "hereditary hemochromatosis",
      "hereditary haemochromatosis",
      "HFE hemochromatosis",
      "HFE-related hemochromatosis",
      "primary hemochromatosis",
      "primary iron overload",
      "iron overload disease",
      "secondary hemochromatosis",
      "secondary iron overload",
      "hemosiderosis"
    ],
    abbreviations: ["HH", "HFE-HC"],
    commonMisspellings: [
      "hemochromotosis",
      "hemachromatosis",
      "heamochromatosis",
      "haemachromatosis",
      "hemochromatoses",
      "iron overlaod"
    ],
    tags: [
      "iron overload",
      "hepcidin",
      "ferroportin",
      "HFE",
      "transferrin saturation",
      "ferritin",
      "therapeutic phlebotomy",
      "iron chelation",
      "cirrhosis",
      "bronze skin",
      "pancreatic iron"
    ],
    sourceKeys: [
      "w44-niddk-hemochromatosis-definition",
      "w44-niddk-hemochromatosis-diagnosis",
      "w44-niddk-hemochromatosis-treatment",
      "w44-easl-hemochromatosis-2022",
      "w44-ncbi-hfe-genereviews-2024"
    ],
    nclexEssential: true,
    evidenceLastReviewed: GENERATED_AT,
    wave44HemeIntegrity: true
  };

  const hemophilia = {
    name: "Hemophilia",
    displayName: "Hemophilia",
    category: "Hematology - Inherited Coagulation Disorders",
    sourceCategory: "Hematology",
    sourceSubcategory: "Inherited factor deficiencies",
    definition: "Hemophilia is an inherited bleeding disorder in which too little functional factor VIII or factor IX prevents an adequate thrombin burst and stable fibrin clot. Platelets can still form the first plug, so the characteristic problem is not usually isolated petechiae; it is prolonged or recurrent deep bleeding into joints, muscles, soft tissues, the head, the neck, or after trauma and procedures. Hemophilia A is factor VIII deficiency and hemophilia B is factor IX deficiency. They can look alike clinically, but the missing factor matters because treatment must replace or bypass the correct coagulation defect.",
    pathology: "Factor IXa and factor VIIIa normally assemble on an activated platelet surface to form intrinsic tenase, which rapidly activates factor X. Factor Xa then supports the thrombin burst that converts fibrinogen to fibrin and stabilizes the platelet plug. Deficiency of factor VIII or IX weakens this amplification step. Initial bleeding may appear to stop because platelets are present, then restart or expand because the fibrin scaffold is inadequate. This explains delayed postoperative bleeding, hemarthrosis, muscle hematoma, and dangerous bleeding in closed spaces. Congenital hemophilia is distinct from acquired hemophilia A, in which an autoantibody neutralizes factor VIII in a person without the inherited disorder.",
    pathophysiology: [
      "Hemophilia A removes factor VIII cofactor activity; hemophilia B removes factor IX enzyme precursor activity. Either defect severely reduces intrinsic-tenase efficiency.",
      "Reduced factor X activation produces less thrombin, so fibrin formation and clot reinforcement are delayed and fragile despite a generally normal platelet count.",
      "Repeated blood in a joint triggers synovial inflammation, iron deposition, cartilage injury, muscle inhibition, and a cycle of recurrent hemarthrosis and chronic arthropathy.",
      "An inhibitor is an alloantibody against infused factor VIII or IX; it lowers factor recovery and can make a previously effective replacement plan fail.",
      "Hemophilia severity is determined by residual factor activity, but trauma site, inhibitor status, prophylaxis, and treatment timing also determine how dangerous a particular bleed becomes."
    ],
    classification: [
      "Hemophilia A: congenital factor VIII deficiency.",
      "Hemophilia B, also called Christmas disease: congenital factor IX deficiency.",
      "Severe disease generally has factor activity below 1 IU/dL, moderate disease 1-5 IU/dL, and mild disease above 5 to below 40 IU/dL; local laboratory reporting and specialist interpretation govern classification.",
      "Acquired hemophilia A is an autoimmune inhibitor disorder and is not simply late-onset inherited hemophilia."
    ],
    etiology: "Congenital hemophilia A and B are usually caused by pathogenic variants in F8 or F9 and follow X-linked inheritance. Males are more often affected, but females can have clinically important bleeding because of skewed X-inactivation, Turner syndrome, biallelic variants, or low factor levels in a carrier; sex alone must not dismiss symptoms. A substantial minority of cases arise from a new variant without a known family history. Acquired hemophilia A results from a factor VIII autoantibody and requires a different diagnostic and treatment pathway.",
    riskFactors: [
      "Known F8 or F9 pathogenic variant, affected relative, or carrier status",
      "Low baseline factor VIII or IX activity",
      "Prior inhibitor, poor factor recovery, or bleeding despite an expected dose",
      "Trauma, surgery, dental work, childbirth, invasive procedure, or intramuscular injection without adequate hemostatic coverage",
      "High-impact activity, a target joint, chronic synovitis, or established hemophilic arthropathy",
      "Aspirin, nonselective NSAIDs, antiplatelet agents, anticoagulants, and other therapies that add platelet or coagulation impairment when not managed through a specialist plan"
    ],
    signsSymptoms: [
      "Hemarthrosis causes deep joint pain, warmth, tingling or fullness, swelling, guarded movement, and later loss of range of motion; early bleeding can precede visible swelling.",
      "Muscle bleeding causes pain, firmness, swelling, weakness, reduced motion, or nerve and vascular compression; iliopsoas bleeding may present with groin, hip, abdominal, or back pain and a flexed hip.",
      "Prolonged bleeding after circumcision, tooth loss, venipuncture, surgery, trauma, or childbirth may be the first clue in mild disease.",
      "Easy bruising, oral bleeding, epistaxis, hematuria, or gastrointestinal bleeding can occur, but a mainly petechial pattern should prompt assessment for platelet or vascular disease.",
      "Headache, vomiting, confusion, seizure, focal deficit, neck or tongue swelling, dyspnea, severe abdominal or back pain, or a tense painful limb can signal critical-site bleeding."
    ],
    diagnostics: [
      "Obtain CBC, PT/INR, aPTT, and specific factor VIII and IX activity. Platelet count and PT are often normal; aPTT is often prolonged but can be normal in mild disease depending on reagent sensitivity, so a normal screening result does not erase a convincing history.",
      "Use a mixing study and factor-specific inhibitor assay when an inhibitor, heparin effect, lupus anticoagulant, or acquired factor deficiency is possible. Time-dependent factor VIII inhibitors may require incubated testing.",
      "Classify the exact factor deficiency and baseline activity before assuming that factor VIII, factor IX, desmopressin, or a nonfactor product is interchangeable.",
      "When emicizumab is present, routine aPTT and aPTT-based factor VIII assays can be misleading; the hemophilia laboratory must select an appropriate assay.",
      "For suspected intracranial, airway, abdominal, iliopsoas, retroperitoneal, or compartment bleeding, begin the prescribed hemostatic plan promptly and obtain site-directed imaging without delaying treatment for a dangerous bleed.",
      "Offer genetic counseling and carrier or prenatal discussion through a hemophilia center when desired."
    ],
    labs: [
      "Factor VIII is reduced in hemophilia A and factor IX is reduced in hemophilia B.",
      "aPTT is often prolonged while PT/INR and platelet count are usually normal, but mild disease can escape a screening aPTT.",
      "A mixing study that corrects supports a deficiency; failure to correct, especially after incubation, raises concern for an inhibitor or another circulating anticoagulant.",
      "Hemoglobin may fall with internal bleeding even when external blood loss is absent.",
      "Emicizumab shortens aPTT and invalidates routine aPTT-based interpretations for factor VIII activity and inhibitor measurement."
    ],
    differentialDiagnoses: [
      "Von Willebrand disease, platelet dysfunction, thrombocytopenia, and connective-tissue bleeding disorders",
      "Acquired hemophilia A or another acquired factor inhibitor",
      "Hemophilia A versus hemophilia B, which cannot be distinguished by symptoms alone",
      "Liver disease, vitamin K deficiency, disseminated intravascular coagulation, and multiple-factor deficiency",
      "Heparin, direct oral anticoagulant, warfarin, or another medication effect",
      "Trauma, nonaccidental injury, septic arthritis, inflammatory arthritis, or tumor causing pain and swelling"
    ],
    treatments: [
      "Treat hemophilia A with the prescribed factor VIII product for bleeding, procedures, or prophylaxis when replacement is the selected plan; treat hemophilia B with factor IX. The products are not interchangeable because they replace different components of intrinsic tenase.",
      "Use regular prophylaxis rather than waiting for recurrent spontaneous bleeding in severe disease because preventing blood from entering joints protects cartilage and long-term function.",
      "Emicizumab is subcutaneous prophylaxis for hemophilia A with or without factor VIII inhibitors. It is not factor IX replacement, does not treat hemophilia B, and does not by itself define the breakthrough-bleed plan.",
      "Use desmopressin only for selected responsive mild hemophilia A under a documented plan; it releases endogenous factor VIII and von Willebrand factor, so it does not correct hemophilia B and requires fluid and sodium precautions.",
      "Use tranexamic acid as an adjunct for selected oral, nasal, menstrual, or dental bleeding when prescribed; it protects formed fibrin from premature breakdown but does not replace factor and requires special caution in gross hematuria.",
      "When an inhibitor makes ordinary replacement ineffective, follow the treatment center's specific bypassing, nonfactor prophylaxis, and inhibitor-eradication plan because bypassing agents carry thrombosis risk and interact with some nonfactor therapies.",
      "Selected adults may be evaluated for approved gene therapy, but eligibility, liver assessment, durability, immune response, and long-term surveillance make this a specialist option rather than acute bleed treatment or a guaranteed permanent cure."
    ],
    medicationsCommonlyUsed: [
      "Antihemophilic factor",
      "Coagulation factor IX",
      "Emicizumab",
      "Desmopressin",
      "Tranexamic Acid"
    ],
    directTreatmentMedications: [
      "Antihemophilic factor",
      "Coagulation factor IX",
      "Emicizumab",
      "Desmopressin",
      "Tranexamic Acid"
    ],
    medicationTreatmentSafetyPolicy: "curated-explicit-v2",
    medicationInferenceMode: "explicit-only",
    medicationTreatmentNote: "The correct product depends on hemophilia type, factor activity, inhibitor status, bleed site, prophylaxis plan, and procedure. Antiplatelet and anticoagulant drugs are not hemophilia treatments.",
    contraindications: [
      "Anticoagulants and antiplatelet drugs do not treat hemophilia; they can increase bleeding by weakening coagulation or platelet function. A patient may still need one for a separate condition such as atrial fibrillation, venous thromboembolism, acute coronary syndrome, or a coronary stent, but only through an individualized hematology and cardiovascular plan with appropriate hemostatic coverage.",
      "Avoid aspirin and nonselective NSAIDs for routine pain treatment unless the hemophilia team explicitly approves them; platelet inhibition adds a second hemostatic defect. Use a specialist-approved analgesic plan.",
      "Avoid unnecessary intramuscular injections, arterial punctures, rectal procedures, and traumatic instrumentation because bleeding can continue in a closed tissue space.",
      "Do not wait for imaging or visible swelling before giving the prescribed hemostatic treatment for a suspected critical-site bleed.",
      "Do not use factor VIII for hemophilia B, factor IX for hemophilia A, desmopressin for hemophilia B, or emicizumab as a universal acute-bleed drug.",
      "Avoid unplanned high cumulative activated prothrombin complex concentrate exposure during emicizumab because thrombotic microangiopathy and thrombosis have occurred; follow the written inhibitor plan."
    ],
    nursingPriorities: [
      "Identify the exact hemophilia type, baseline severity, factor or nonfactor product, inhibitor history, prophylaxis schedule, last dose, target joints, venous access, and written emergency plan because treatment failure can result from giving the wrong pathway or delaying the correct one.",
      "For head, neck, chest, abdominal, gastrointestinal, iliopsoas, retroperitoneal, major muscle, or uncontrolled bleeding, activate the hemophilia plan and administer the prescribed hemostatic therapy promptly because blood can expand and compress the brain, airway, nerves, vessels, or organs before external signs appear.",
      "Assess pain, swelling, warmth, range of motion, neurovascular status, neurologic findings, airway and swallowing, abdominal and back findings, urine, stool, vital signs, and serial hemoglobin because internal bleeding may be hidden.",
      "Use prolonged direct pressure after venipuncture, the smallest appropriate needle, careful fall and injury prevention, and coordinated procedural factor coverage because minimizing tissue trauma prevents avoidable bleeding.",
      "Protect an acutely bleeding joint after hemostatic treatment and involve hemophilia physical therapy for safe return of movement because prolonged immobilization causes weakness while aggressive early motion can restart bleeding.",
      "Reconcile aspirin, NSAIDs, antiplatelets, anticoagulants, supplements, and new prescriptions and never display them as hemophilia treatment; escalate any separate antithrombotic indication to the hemophilia and prescribing teams."
    ],
    redFlags: [
      "Any head injury, severe or progressive headache, vomiting, confusion, somnolence, seizure, weakness, speech change, or other new neurologic finding",
      "Neck, tongue, or throat swelling; voice change; dysphagia; stridor; dyspnea; or chest symptoms",
      "Severe abdominal, flank, hip, groin, or back pain; hematemesis; melena; gross hematuria; pallor; tachycardia; hypotension; or falling hemoglobin",
      "Rapidly expanding muscle or joint swelling, severe pain, paresthesia, weakness, diminished pulse, or another neurovascular change",
      "Bleeding that continues after the usual factor or nonfactor plan, unexpectedly low factor recovery, or a hypersensitivity reaction with loss of factor response",
      "Chest pain, dyspnea, neurologic change, kidney injury, thrombocytopenia, or hemolysis during emicizumab plus bypassing-agent exposure"
    ],
    complications: [
      "Intracranial, airway, gastrointestinal, retroperitoneal, iliopsoas, and other life-threatening hemorrhage",
      "Compartment syndrome, nerve compression, anemia, shock, and organ injury from occult bleeding",
      "Recurrent hemarthrosis, chronic synovitis, hemophilic arthropathy, pain, weakness, and disability",
      "Factor VIII or IX inhibitor development with reduced treatment response",
      "Thrombosis or thrombotic microangiopathy from selected bypassing and nonfactor combinations",
      "Treatment access burden, central-line infection or thrombosis, psychosocial stress, and reduced participation when prophylaxis and rehabilitation are inadequate"
    ],
    prognosis: "Modern prophylaxis, rapid home treatment, treatment-center care, and coordinated musculoskeletal management allow many people with hemophilia to prevent spontaneous bleeding and preserve function. Outcome is worse when critical bleeding is treated late, inhibitors are missed, access to prophylaxis is poor, or recurrent hemarthrosis has already damaged joints.",
    prevention: "The inherited variant cannot be prevented, but bleeding can often be prevented with regular prophylaxis, safe activity, protective equipment, dental care, planned factor coverage for procedures, avoidance of unnecessary platelet-impairing drugs, and early treatment of suspected bleeding. Genetic counseling supports informed reproductive choices without assuming that every carrier has the same factor level or bleeding phenotype.",
    patientEducation: [
      "Carry the exact diagnosis, factor product, dose plan, inhibitor status, allergies, and hemophilia treatment-center contact; 'hemophilia' alone is not enough information in an emergency.",
      "Treat serious suspected bleeding according to the written plan before waiting for a bruise, major swelling, or imaging because early treatment limits tissue damage.",
      "Do not take aspirin, an NSAID, an antiplatelet drug, an anticoagulant, or a new supplement without checking the hemophilia plan. If another disease truly requires an antithrombotic, both teams must coordinate it rather than simply omitting necessary cardiovascular care.",
      "Learn the earliest sensation of a joint bleed, maintain prescribed prophylaxis and physical therapy, protect teeth and gums, and use recommended activity and safety equipment.",
      "Report reduced response to the usual factor, infusion reaction, breakthrough bleeding on prophylaxis, head injury, severe pain, neurologic change, airway symptoms, or gastrointestinal or urinary bleeding immediately."
    ],
    nclexTraps: [
      "Hemophilia A is factor VIII deficiency; hemophilia B is factor IX deficiency. The symptoms overlap, so use factor assays rather than guessing from presentation.",
      "Hemophilia is a secondary-hemostasis disorder: deep tissue and joint bleeding is more characteristic than isolated petechiae.",
      "Normal PT and platelet count do not exclude hemophilia, and a screening aPTT can miss mild disease.",
      "Aspirin, antiplatelet drugs, anticoagulants, and routine NSAIDs do not treat hemophilia. A separate thrombotic indication is a specialist exception, not hemophilia therapy.",
      "Emicizumab is prophylaxis for hemophilia A and changes aPTT interpretation; it is not factor IX and not a universal one-dose treatment for an acute bleed.",
      "Do not delay the prescribed factor or bypassing plan for imaging when critical-site bleeding is suspected."
    ],
    relatedTopics: [
      "Hemophilia A",
      "Hemophilia B",
      "Von Willebrand disease",
      "Antihemophilic factor",
      "Coagulation factor IX",
      "Emicizumab",
      "Desmopressin",
      "Tranexamic Acid",
      "aPTT",
      "Mixing study",
      "Hemarthrosis",
      "Compartment syndrome"
    ],
    aliases: [
      "haemophilia",
      "congenital hemophilia",
      "inherited hemophilia",
      "inherited factor deficiency bleeding disorder",
      "factor VIII or IX deficiency",
      "bleeder disease"
    ],
    abbreviations: ["PWH"],
    commonMisspellings: ["hemofilia", "hemophelia", "haemofilia", "hemophillia"],
    tags: [
      "factor VIII",
      "factor IX",
      "intrinsic tenase",
      "secondary hemostasis",
      "hemarthrosis",
      "factor inhibitor",
      "prophylaxis",
      "bleeding disorder"
    ],
    sourceKeys: [
      "w44-cdc-hemophilia-overview",
      "w44-cdc-hemophilia-treatment",
      "w44-nhlbi-bleeding-treatment",
      "w44-nhlbi-bleeding-diagnosis",
      "w44-wfh-hemophilia-guidelines",
      "w44-fda-emicizumab",
      "w44-isth-antithrombotic-hemophilia"
    ],
    nclexEssential: true,
    evidenceLastReviewed: GENERATED_AT,
    wave44HemeIntegrity: true
  };

  const hemophiliaA = {
    name: "Hemophilia A",
    displayName: "Hemophilia A",
    category: "Hematology - Inherited Coagulation Disorders",
    sourceCategory: "Hematology",
    sourceSubcategory: "Factor VIII deficiency",
    definition: "Hemophilia A is congenital factor VIII deficiency. Factor VIIIa normally acts as the cofactor that lets factor IXa activate factor X efficiently on an activated platelet surface. Without enough factor VIII, the thrombin burst is weak and fibrin cannot reliably stabilize the platelet plug, producing recurrent joint and muscle bleeding, delayed bleeding after trauma or procedures, and dangerous hemorrhage in the head, neck, abdomen, retroperitoneum, or other closed spaces. Treatment must restore or functionally bypass factor VIII activity; anticoagulants and antiplatelet drugs do the opposite and are not hemophilia A therapy.",
    pathology: "Thrombin normally activates factor VIII to VIIIa. VIIIa binds factor IXa, factor X, calcium, and platelet phospholipid to assemble intrinsic tenase, accelerating factor X activation and downstream thrombin generation. An F8 pathogenic variant lowers the quantity or function of factor VIII, so the early platelet plug lacks a strong fibrin scaffold. Blood can therefore reaccumulate after apparent initial hemostasis. Repeated hemarthrosis exposes synovium and cartilage to blood and iron, driving inflammation, hypertrophy, recurrent bleeding, and progressive arthropathy.",
    pathophysiology: [
      "Low factor VIII activity weakens intrinsic tenase, reducing factor Xa, thrombin, and cross-linked fibrin generation.",
      "Factor VIII circulates bound to von Willebrand factor, which protects it from clearance; this relationship explains why severe von Willebrand disease can also lower factor VIII but is not identical to hemophilia A.",
      "Residual factor VIII activity influences baseline severity, while trauma site, prophylaxis, inhibitor status, and treatment delay determine the immediate clinical threat.",
      "A factor VIII inhibitor neutralizes infused VIII and lowers recovery; persistent bleeding after an expected dose is a treatment-failure signal, not a reason for blind repeated dosing.",
      "Emicizumab bridges factor IXa and factor X to mimic VIIIa's positioning function, improving hemostasis without being factor VIII itself."
    ],
    classification: [
      "Severe hemophilia A: factor VIII activity below 1 IU/dL.",
      "Moderate hemophilia A: factor VIII activity 1-5 IU/dL.",
      "Mild hemophilia A: factor VIII activity above 5 to below 40 IU/dL.",
      "Hemophilia A with a factor VIII inhibitor requires an inhibitor-aware treatment pathway.",
      "Acquired hemophilia A is caused by an autoantibody and is a separate acquired disorder, not a congenital severity class."
    ],
    etiology: "Hemophilia A is usually caused by a pathogenic F8 variant with X-linked inheritance. A new variant can produce disease without family history. Males are more often affected, but females can have low factor VIII and significant bleeding because of skewed X-inactivation, chromosomal variation, or biallelic disease. Factor VIII also changes with stress, inflammation, pregnancy, estrogen, blood group, and von Willebrand factor, so diagnosis requires a coherent bleeding history and factor evaluation rather than sex or family history alone.",
    riskFactors: [
      "Pathogenic F8 variant, affected relative, or carrier status with low factor VIII",
      "Severe baseline factor VIII deficiency or inconsistent prophylaxis",
      "Prior factor VIII inhibitor, unexpectedly low factor recovery, or breakthrough bleeding despite replacement",
      "Trauma, surgery, dental work, childbirth, invasive procedure, or intramuscular injection without planned hemostatic coverage",
      "Target joint, chronic synovitis, prior intracranial hemorrhage, or established hemophilic arthropathy",
      "Uncoordinated aspirin, NSAID, antiplatelet, anticoagulant, or high-risk supplement exposure"
    ],
    signsSymptoms: [
      "Painful warm joints with fullness, tingling, swelling, guarding, or reduced motion from hemarthrosis",
      "Deep muscle pain, swelling, firmness, weakness, or nerve and vascular compression from hematoma",
      "Large bruises and prolonged or delayed bleeding after trauma, tooth loss, circumcision, injection, surgery, or childbirth",
      "Hematuria, gastrointestinal bleeding, oral bleeding, or epistaxis, although a petechial-only pattern suggests another mechanism",
      "Headache, vomiting, neurologic change, neck or throat swelling, dyspnea, severe abdominal or back pain, or neurovascular compromise from critical-site bleeding"
    ],
    diagnostics: [
      "Measure factor VIII activity with CBC, PT/INR, and aPTT. PT and platelets are usually normal; aPTT is often prolonged but may be normal in mild disease depending on the reagent.",
      "Distinguish hemophilia A from von Willebrand disease by a bleeding history plus von Willebrand antigen and activity when indicated, because VWF carries factor VIII and deficiency can lower its level.",
      "Use an immediate and incubated mixing study plus Bethesda or other validated inhibitor assay when bleeding is new, replacement response is poor, or acquired hemophilia is possible.",
      "Use chromogenic or other hemophilia-laboratory methods appropriate for emicizumab exposure because routine aPTT-based factor VIII assays can be falsely reassuring.",
      "Image suspected head, airway, iliopsoas, abdominal, retroperitoneal, or compartment bleeding urgently, but do not delay the written hemostatic plan for a dangerous suspected bleed.",
      "Use genetic evaluation and counseling for confirmation, family testing, carrier care, and reproductive planning when desired."
    ],
    labs: [
      "Factor VIII activity is reduced; activity defines baseline severity.",
      "aPTT is often prolonged with normal PT/INR and platelet count, but mild hemophilia A can have a normal screening aPTT.",
      "A correcting mixing study supports deficiency; time-dependent failure to correct suggests a factor VIII inhibitor.",
      "Hemoglobin and hematocrit can fall with hidden internal bleeding.",
      "Emicizumab shortens aPTT and interferes with aPTT-based factor VIII and inhibitor assays."
    ],
    differentialDiagnoses: [
      "Hemophilia B, distinguished by factor IX rather than factor VIII deficiency",
      "Von Willebrand disease, including severe disease with low factor VIII",
      "Acquired hemophilia A from a factor VIII autoantibody",
      "Heparin or direct-anticoagulant effect, lupus anticoagulant, and other factor deficiencies",
      "Platelet disorder, liver disease, vitamin K deficiency, or disseminated intravascular coagulation",
      "Septic or inflammatory arthritis, trauma, tumor, or nonaccidental injury"
    ],
    treatments: [
      "Use the prescribed factor VIII concentrate for on-demand bleeding control, perioperative hemostasis, or routine prophylaxis when replacement therapy is selected. Product half-life, recovery, age, prior treatment, inhibitor history, and dose plan are specific and not casually interchangeable.",
      "Provide regular prophylaxis for severe disease and other high-bleeding phenotypes because preventing hemarthrosis is more effective than treating established joint destruction.",
      "Use emicizumab for routine prophylaxis when prescribed in hemophilia A with or without factor VIII inhibitors; it is not a universal acute-bleed dose, and breakthrough bleeding follows a separate written plan.",
      "Use desmopressin only for selected mild hemophilia A after an adequate response has been demonstrated; monitor fluid intake and sodium because repeated or excessive dosing can cause dangerous hyponatremia and tachyphylaxis.",
      "Use tranexamic acid as an adjunct for selected oral, nasal, menstrual, or dental bleeding when prescribed, recognizing that it stabilizes fibrin but does not replace factor VIII and needs caution in gross hematuria.",
      "For a factor VIII inhibitor, use hemophilia-center-directed bypassing therapy, emicizumab prophylaxis, immune-tolerance or eradication strategies, and appropriate specialized assays rather than simply escalating ordinary factor without assessing recovery.",
      "Selected eligible adults may consider approved factor VIII gene therapy after liver and immune evaluation with long-term follow-up; it is not emergency bleed treatment and durable expression varies."
    ],
    medicationsCommonlyUsed: ["Antihemophilic factor", "Emicizumab", "Desmopressin", "Tranexamic Acid"],
    directTreatmentMedications: ["Antihemophilic factor", "Emicizumab", "Desmopressin", "Tranexamic Acid"],
    medicationTreatmentSafetyPolicy: "curated-explicit-v2",
    medicationInferenceMode: "explicit-only",
    medicationTreatmentNote: "Factor VIII replacement and hemophilia A-specific prophylaxis are the core pathways. Desmopressin applies only to selected responsive mild disease, and tranexamic acid is an adjunct rather than factor replacement.",
    contraindications: [
      "Anticoagulants and antiplatelet drugs do not treat hemophilia A. They may be necessary for a separate thrombotic or cardiovascular diagnosis only through a coordinated specialist plan that balances factor coverage against bleeding risk.",
      "Avoid routine aspirin and nonselective NSAIDs unless the hemophilia team specifically approves them because platelet inhibition adds to the factor VIII defect.",
      "Do not substitute factor IX for factor VIII, and do not treat hemophilia A as von Willebrand disease solely because both involve factor VIII physiology.",
      "Do not use desmopressin without a responsive mild phenotype or ignore fluid and sodium precautions.",
      "Do not interpret a short aPTT during emicizumab as normal coagulation or absence of bleeding.",
      "Avoid unplanned high cumulative activated PCC during emicizumab because of thrombosis and thrombotic-microangiopathy risk."
    ],
    nursingPriorities: [
      "Verify factor VIII activity, product, dose plan, inhibitor status, prophylaxis, last dose, target joints, and emicizumab exposure because the laboratory and breakthrough-bleed pathway changes with each.",
      "Administer prescribed factor VIII or inhibitor-aware therapy promptly for serious suspected bleeding and notify the hemophilia center because treatment delay permits blood to expand into brain, airway, muscle, abdomen, or retroperitoneum.",
      "Assess joint and muscle pain, warmth, swelling, range of motion, neurovascular status, neurologic change, airway, abdomen, back, urine, stool, vital signs, and hemoglobin because occult bleeding may be the first threat.",
      "Avoid unnecessary intramuscular injections, rectal procedures, arterial punctures, aspirin, and nonapproved NSAIDs; use prolonged gentle pressure after venipuncture because tissue trauma and platelet inhibition increase bleeding.",
      "During desmopressin, enforce ordered fluid limits and trend sodium and neurologic status; during emicizumab plus bypassing therapy, monitor for thrombosis, hemolysis, thrombocytopenia, and kidney injury.",
      "Coordinate dental work, surgery, pregnancy and delivery, rehabilitation, and antithrombotic decisions with the hemophilia center before the exposure occurs."
    ],
    redFlags: [
      "Any head injury, severe headache, vomiting, confusion, weakness, seizure, or other neurologic change",
      "Neck or throat swelling, voice change, dysphagia, stridor, or breathing difficulty",
      "Abdominal, back, hip, flank, or groin pain; gastrointestinal bleeding; gross hematuria; pallor; tachycardia; hypotension; or falling hemoglobin",
      "Rapidly expanding muscle or joint swelling, severe pain, paresthesia, weakness, or diminished distal perfusion",
      "Bleeding that continues despite the expected factor VIII plan or evidence of an infusion reaction and poor recovery",
      "Headache, confusion, seizure, or rapid weight gain during desmopressin; or thrombosis/TMA findings during emicizumab plus activated PCC"
    ],
    complications: [
      "Intracranial, airway, gastrointestinal, retroperitoneal, iliopsoas, and other life-threatening bleeding",
      "Recurrent hemarthrosis, chronic synovitis, hemophilic arthropathy, pain, weakness, and disability",
      "Factor VIII inhibitor development and failure of ordinary replacement",
      "Compartment syndrome, nerve compression, anemia, and shock from occult bleeding",
      "Desmopressin-associated hyponatremia and seizure",
      "Thrombosis or thrombotic microangiopathy with unsafe bypassing-agent exposure during emicizumab"
    ],
    prognosis: "With effective prophylaxis, rapid bleed treatment, inhibitor surveillance, and joint rehabilitation, many people with hemophilia A can avoid spontaneous bleeding and preserve near-normal function. Established arthropathy may not fully reverse, and an inhibitor adds treatment complexity, making continuous treatment-center follow-up important.",
    prevention: "Prevent bleeding through prescribed factor VIII or emicizumab prophylaxis, safe activity, protective equipment, dental care, planned procedure coverage, avoidance of unnecessary platelet-impairing drugs, and early response to joint sensations or trauma. Genetic counseling and factor testing support care for symptomatic carriers and pregnancy planning.",
    patientEducation: [
      "State 'hemophilia A, factor VIII deficiency' in an emergency and carry the exact factor or emicizumab plan and inhibitor status.",
      "Treat serious suspected bleeding according to the written plan before waiting for visible swelling or a scan.",
      "Emicizumab prevents bleeding but changes laboratory interpretation and does not replace the individualized breakthrough-bleed plan.",
      "Desmopressin works only in selected mild hemophilia A and can lower sodium; follow fluid instructions exactly.",
      "Do not use aspirin, routine NSAIDs, antiplatelet drugs, or anticoagulants as hemophilia treatment. Ask both specialists if another disease creates a true antithrombotic indication."
    ],
    nclexTraps: [
      "Hemophilia A is factor VIII deficiency, not factor IX deficiency and not platelet deficiency.",
      "Normal PT and platelets do not exclude hemophilia A; a normal aPTT can occur in mild disease.",
      "Desmopressin is for selected responsive mild hemophilia A, not severe A, hemophilia B, or every bleeding episode.",
      "Emicizumab is hemophilia A prophylaxis and can make aPTT look corrected; it is not a universal acute-bleed antidote.",
      "Aspirin and anticoagulation do not treat the factor VIII defect."
    ],
    relatedTopics: [
      "Hemophilia",
      "Hemophilia B",
      "Von Willebrand disease",
      "Antihemophilic factor",
      "Emicizumab",
      "Desmopressin",
      "Tranexamic Acid",
      "aPTT",
      "Mixing study",
      "Hemarthrosis"
    ],
    aliases: [
      "haemophilia A",
      "classic hemophilia",
      "classical hemophilia",
      "factor VIII deficiency",
      "factor 8 deficiency",
      "FVIII deficiency",
      "congenital factor VIII deficiency"
    ],
    abbreviations: ["HA", "FVIII deficiency"],
    commonMisspellings: ["hemophilia 8", "hemofilia A", "hemophilia type A", "factor v111 deficiency"],
    tags: ["factor VIII", "F8", "intrinsic tenase", "emicizumab", "hemarthrosis", "factor VIII inhibitor", "prophylaxis"],
    sourceKeys: [
      "w44-cdc-hemophilia-overview",
      "w44-cdc-hemophilia-treatment",
      "w44-nhlbi-bleeding-treatment",
      "w44-nhlbi-bleeding-diagnosis",
      "w44-wfh-hemophilia-guidelines",
      "w44-fda-emicizumab",
      "w44-isth-antithrombotic-hemophilia"
    ],
    nclexEssential: true,
    evidenceLastReviewed: GENERATED_AT,
    wave44HemeIntegrity: true
  };

  const hemophiliaB = {
    name: "Hemophilia B",
    displayName: "Hemophilia B",
    category: "Hematology - Inherited Coagulation Disorders",
    sourceCategory: "Hematology",
    sourceSubcategory: "Factor IX deficiency",
    definition: "Hemophilia B is congenital factor IX deficiency, historically called Christmas disease. Factor IXa is the enzyme component of intrinsic tenase; with factor VIIIa as its cofactor, it activates factor X and supports the thrombin burst that builds stable fibrin. When factor IX is deficient, deep joint and muscle bleeding, delayed procedural bleeding, and critical hemorrhage can occur. Factor IX replacement treats this defect. Factor VIII, desmopressin, emicizumab, anticoagulants, and antiplatelet drugs do not replace factor IX and must not be presented as routine hemophilia B treatment.",
    pathology: "Factor IX is a vitamin K-dependent zymogen made in the liver. After activation to IXa, it binds factor VIIIa, factor X, calcium, and platelet phospholipid to form intrinsic tenase. An F9 pathogenic variant lowers functional factor IX, sharply reducing factor X activation, thrombin generation, and fibrin reinforcement. Platelet number and the first platelet plug may remain normal, which explains why bleeding often occurs deep in joints and muscles or reappears after an apparently controlled procedure. Factor IX inhibitors are less common than factor VIII inhibitors but can be accompanied by severe allergic reactions and make replacement ineffective.",
    pathophysiology: [
      "Low factor IX removes the enzyme precursor that becomes IXa, so intrinsic tenase cannot efficiently activate factor X.",
      "Reduced factor Xa and thrombin leave the platelet plug under-reinforced by fibrin, producing prolonged or recurrent deep bleeding.",
      "Repeated hemarthrosis creates synovial iron deposition, inflammation, cartilage damage, muscle weakness, and a self-perpetuating target joint.",
      "A factor IX inhibitor neutralizes replacement and may occur with anaphylaxis or nephrotic syndrome; loss of response plus hypersensitivity is an emergency signal.",
      "Extended-half-life factor IX changes dose intervals but does not make products automatically interchangeable because recovery and pharmacokinetics vary."
    ],
    classification: [
      "Severe hemophilia B: factor IX activity below 1 IU/dL.",
      "Moderate hemophilia B: factor IX activity 1-5 IU/dL.",
      "Mild hemophilia B: factor IX activity above 5 to below 40 IU/dL.",
      "Hemophilia B with a factor IX inhibitor requires specialist bypassing and prophylaxis decisions.",
      "Hemophilia B Leyden is a rare F9 regulatory phenotype in which factor IX expression can rise after puberty; it still requires specialist confirmation."
    ],
    etiology: "Hemophilia B is caused by a pathogenic F9 variant and usually follows X-linked inheritance. A new variant can occur without family history. Males are more often affected, but females can have clinically important low factor IX and bleeding through skewed X-inactivation, chromosomal variation, or biallelic disease. Acquired isolated factor IX deficiency is uncommon; liver disease, vitamin K deficiency, anticoagulants, or multiple-factor disorders should be considered when the history is not congenital.",
    riskFactors: [
      "Pathogenic F9 variant, affected relative, or carrier status with low factor IX",
      "Severe baseline factor IX deficiency or inconsistent prophylaxis",
      "Prior factor IX inhibitor, allergic reaction to factor, nephrotic syndrome, unexpectedly low recovery, or bleeding despite replacement",
      "Trauma, surgery, dental work, childbirth, invasive procedure, or intramuscular injection without hemostatic coverage",
      "Target joint, chronic synovitis, previous intracranial hemorrhage, or established arthropathy",
      "Uncoordinated aspirin, NSAID, antiplatelet, anticoagulant, or supplement exposure"
    ],
    signsSymptoms: [
      "Painful warm joint fullness, tingling, swelling, guarding, or reduced motion from hemarthrosis",
      "Deep muscle pain, firmness, swelling, weakness, or neurovascular compression from hematoma",
      "Large bruises and prolonged or delayed bleeding after trauma, injections, surgery, dental work, circumcision, or childbirth",
      "Hematuria, gastrointestinal bleeding, oral bleeding, or epistaxis, although isolated petechiae suggest another mechanism",
      "Headache, vomiting, neurologic change, neck or throat swelling, dyspnea, severe abdominal or back pain, or a tense painful limb from critical-site bleeding"
    ],
    diagnostics: [
      "Measure factor IX activity with CBC, PT/INR, and aPTT. PT and platelets are usually normal; aPTT is often prolonged but mild disease can be missed by a screening reagent.",
      "Use mixing and inhibitor testing when the aPTT fails to correct, bleeding is new, factor response is poor, or a medication effect is possible.",
      "Differentiate hemophilia B from hemophilia A by factor assay, not by symptoms, because both impair intrinsic tenase and create the same deep-bleeding pattern.",
      "Assess liver function, vitamin K context, and anticoagulant exposure when more than isolated factor IX deficiency is plausible.",
      "Image suspected head, airway, iliopsoas, abdominal, retroperitoneal, or compartment bleeding urgently without delaying the prescribed factor IX plan for a dangerous bleed.",
      "Use genetic evaluation and counseling for confirmation, family testing, carrier care, and reproductive planning when desired."
    ],
    labs: [
      "Factor IX activity is reduced and defines baseline severity.",
      "aPTT is often prolonged with normal PT/INR and platelet count, but mild hemophilia B can have a normal screening aPTT.",
      "A correcting mixing study supports deficiency; failure to correct suggests an inhibitor or another circulating anticoagulant.",
      "Hemoglobin and hematocrit can fall with hidden internal bleeding.",
      "Factor IX recovery and inhibitor testing are important when bleeding persists, particularly after an allergic infusion reaction."
    ],
    differentialDiagnoses: [
      "Hemophilia A, distinguished by factor VIII rather than factor IX deficiency",
      "Other intrinsic-pathway factor deficiencies and acquired inhibitors",
      "Heparin or direct-anticoagulant effect and lupus anticoagulant",
      "Liver disease or vitamin K deficiency causing multiple vitamin K-dependent factor abnormalities",
      "Von Willebrand disease, platelet disorder, disseminated intravascular coagulation, or connective-tissue bleeding",
      "Septic or inflammatory arthritis, trauma, tumor, or nonaccidental injury"
    ],
    treatments: [
      "Use the prescribed factor IX concentrate for on-demand bleeding control, perioperative hemostasis, or routine prophylaxis. Recovery, half-life, age, inhibitor history, and product plan determine dosing, so standard- and extended-half-life products are not casually exchanged.",
      "Provide regular prophylaxis for severe disease and other high-bleeding phenotypes because preventing hemarthrosis preserves cartilage and function better than treating recurrent damage.",
      "Use tranexamic acid as an adjunct for selected oral, nasal, menstrual, or dental bleeding when prescribed; it stabilizes fibrin but does not replace factor IX and requires caution in gross hematuria.",
      "For a factor IX inhibitor, stop and treat hypersensitivity immediately and use a hemophilia-center-directed bypassing or approved nonfactor prophylaxis plan; immune-tolerance decisions in hemophilia B require particular caution because allergic and nephrotic complications can occur.",
      "Selected eligible adults may be evaluated for approved factor IX gene therapy after liver, immune, and thrombosis assessment with long-term follow-up; it is not emergency bleed treatment and factor expression varies.",
      "Treat acute joint bleeding promptly, then use protected rest and specialist rehabilitation to restore movement after hemostasis without provoking rebleeding."
    ],
    medicationsCommonlyUsed: ["Coagulation factor IX", "Tranexamic Acid"],
    directTreatmentMedications: ["Coagulation factor IX", "Tranexamic Acid"],
    medicationTreatmentSafetyPolicy: "curated-explicit-v2",
    medicationInferenceMode: "explicit-only",
    medicationTreatmentNote: "Factor IX replacement is the disease-specific medication pathway. Tranexamic acid is a conditional adjunct for selected mucosal or dental bleeding, not a substitute for factor IX.",
    contraindications: [
      "Anticoagulants and antiplatelet drugs do not treat hemophilia B. They may be required for a separate cardiovascular or thrombotic indication only through a coordinated specialist plan with hemostatic coverage.",
      "Avoid routine aspirin and nonselective NSAIDs unless the hemophilia team approves them because platelet inhibition adds to the factor IX defect.",
      "Do not substitute factor VIII, desmopressin, or emicizumab for factor IX; those therapies do not correct congenital factor IX deficiency.",
      "Stop factor IX and provide emergency care for anaphylaxis; allergic reaction plus poor recovery requires urgent inhibitor assessment rather than automatic redosing.",
      "Do not delay factor IX for imaging when a critical-site bleed is suspected under the written plan.",
      "Do not treat all factor IX products as dose-for-dose interchangeable; use the prescribed product-specific recovery and half-life plan."
    ],
    nursingPriorities: [
      "Verify factor IX activity, product, dose plan, inhibitor and allergy history, prophylaxis, last dose, and target joints because product recovery and inhibitor risk determine safe treatment.",
      "Administer prescribed factor IX promptly for serious suspected bleeding and notify the hemophilia center because blood can expand into brain, airway, abdomen, retroperitoneum, iliopsoas, or muscle before external signs appear.",
      "Assess joints, muscles, abdomen, flank, groin, back, mouth, urine, stool, vital signs, hemoglobin, neurologic status, and distal neurovascular function because internal bleeding may be subtle.",
      "Avoid unnecessary intramuscular injections, rectal procedures, arterial punctures, aspirin, and nonapproved NSAIDs; use prolonged direct pressure after venipuncture because tissue trauma and platelet inhibition increase bleeding.",
      "Stop the infusion and treat anaphylaxis for urticaria, wheeze, angioedema, hypotension, or collapse; notify the hemophilia team because factor IX allergy can accompany inhibitor development.",
      "Coordinate dental work, surgery, pregnancy and delivery, rehabilitation, gene-therapy follow-up, and any antithrombotic decision with the comprehensive hemophilia team."
    ],
    redFlags: [
      "Any head injury, severe headache, vomiting, confusion, weakness, seizure, or other neurologic change",
      "Neck or throat swelling, voice change, dysphagia, stridor, or breathing difficulty",
      "Abdominal, flank, groin, hip, or back pain; gastrointestinal bleeding; gross hematuria; pallor; tachycardia; hypotension; or falling hemoglobin",
      "Rapidly expanding muscle or joint swelling, severe pain, paresthesia, weakness, or diminished distal perfusion",
      "Persistent bleeding despite factor IX, unexpectedly poor recovery, or a new inhibitor concern",
      "Urticaria, wheeze, angioedema, hypotension, collapse, proteinuria, or edema after factor IX exposure"
    ],
    complications: [
      "Intracranial, airway, gastrointestinal, retroperitoneal, iliopsoas, and other life-threatening bleeding",
      "Recurrent hemarthrosis, chronic synovitis, hemophilic arthropathy, pain, weakness, and disability",
      "Factor IX inhibitor with treatment failure, anaphylaxis, and possible nephrotic syndrome",
      "Compartment syndrome, nerve compression, anemia, and shock from occult bleeding",
      "Thrombosis from selected bypassing or nonfactor therapy",
      "Gene-therapy liver inflammation, loss of expression, or other therapy-specific adverse effects requiring long-term surveillance"
    ],
    prognosis: "Effective factor IX prophylaxis, rapid bleed treatment, inhibitor surveillance, and rehabilitation can prevent most spontaneous bleeding and preserve function. Prognosis worsens with delayed critical-site treatment, established arthropathy, poor access to prophylaxis, or a factor IX inhibitor complicated by allergy or nephrotic syndrome.",
    prevention: "Prevent bleeding with prescribed factor IX prophylaxis, early home treatment, safe activity, protective equipment, dental care, procedure planning, and avoidance of unnecessary platelet-impairing drugs. Genetic counseling and factor testing support symptomatic carriers, family evaluation, and pregnancy planning.",
    patientEducation: [
      "State 'hemophilia B, factor IX deficiency' in an emergency and carry the exact product, dose plan, inhibitor and allergy history, and treatment-center contact.",
      "Treat serious suspected bleeding according to the written plan before waiting for visible swelling or imaging.",
      "Factor VIII, emicizumab, and desmopressin do not replace factor IX; verify every product before administration.",
      "Report hives, wheeze, swelling, fainting, reduced urine, new edema, or poor bleed response after factor IX immediately because allergy, inhibitor, or nephrotic complications may be developing.",
      "Do not use aspirin, routine NSAIDs, antiplatelet drugs, or anticoagulants as hemophilia treatment. Ask both specialists if a separate disease creates a true antithrombotic indication."
    ],
    nclexTraps: [
      "Hemophilia B is factor IX deficiency and is also called Christmas disease; it cannot be distinguished from hemophilia A by symptoms alone.",
      "Factor IX is the enzyme component of intrinsic tenase; factor VIIIa is its cofactor.",
      "Normal PT and platelets do not exclude hemophilia B, and mild disease can have a normal screening aPTT.",
      "Emicizumab and desmopressin are not routine hemophilia B therapies because neither replaces factor IX.",
      "Aspirin and anticoagulation do not treat the factor IX defect.",
      "Factor IX allergy plus treatment failure raises inhibitor concern and requires urgent escalation."
    ],
    relatedTopics: [
      "Hemophilia",
      "Hemophilia A",
      "Coagulation factor IX",
      "Tranexamic Acid",
      "aPTT",
      "Mixing study",
      "Hemarthrosis",
      "Compartment syndrome",
      "Vitamin K",
      "Liver coagulation-factor synthesis"
    ],
    aliases: [
      "haemophilia B",
      "Christmas disease",
      "factor IX deficiency",
      "factor 9 deficiency",
      "FIX deficiency",
      "congenital factor IX deficiency"
    ],
    abbreviations: ["HB", "FIX deficiency"],
    commonMisspellings: ["hemophilia 9", "hemofilia B", "hemophilia type B", "factor 1X deficiency"],
    tags: ["factor IX", "F9", "Christmas disease", "intrinsic tenase", "hemarthrosis", "factor IX inhibitor", "prophylaxis"],
    sourceKeys: [
      "w44-cdc-hemophilia-overview",
      "w44-cdc-hemophilia-treatment",
      "w44-nhlbi-bleeding-treatment",
      "w44-nhlbi-bleeding-diagnosis",
      "w44-wfh-hemophilia-guidelines",
      "w44-isth-antithrombotic-hemophilia"
    ],
    nclexEssential: true,
    evidenceLastReviewed: GENERATED_AT,
    wave44HemeIntegrity: true
  };

  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];
  sources.forEach((source) => {
    const existing = database.sourceReferences.find((item) => item && (item.key || item.id) === source.key);
    if (existing) Object.assign(existing, source);
    else database.sourceReferences.push({ ...source });
  });

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const cards = [hemochromatosis, hemophilia, hemophiliaA, hemophiliaB];
  const application = [];

  cards.forEach((card) => {
    const key = normalize(card.name);
    const matches = database.diseases.filter((entry) => normalize(entry && (entry.name || entry.displayName)) === key);
    database.diseases = database.diseases.filter((entry) => normalize(entry && (entry.name || entry.displayName)) !== key);
    database.diseases.push({ ...card });
    application.push({
      name: card.name,
      priorMatchCount: matches.length,
      action: matches.length ? "replaced-completely" : "added-standalone",
      sourceKeys: card.sourceKeys.slice(),
      explicitMedications: card.directTreatmentMedications.slice(),
      medicationTreatmentSafetyPolicy: card.medicationTreatmentSafetyPolicy
    });
  });

  database.diseases.sort((left, right) => String(left && left.name || "").localeCompare(String(right && right.name || "")));
  database.diseaseCount = database.diseases.length;
  if (!String(database.version || "").includes(VERSION)) {
    database.version = [database.version, VERSION].filter(Boolean).join("+");
  }

  const forbiddenHemophiliaTreatmentMedications = [
    "Aspirin",
    "NSAIDs",
    "Ticagrelor",
    "Prasugrel",
    "Clopidogrel",
    "Warfarin",
    "Heparin",
    "Apixaban",
    "Rivaroxaban",
    "Dabigatran",
    "Sulfasalazine",
    "5-aminosalicylates",
    "Balsalazide"
  ];

  window.ANI_CLINICAL_FRONTIER_WAVE44_HEME_INTEGRITY = {
    schemaVersion: 1,
    version: VERSION,
    generatedAt: GENERATED_AT,
    cardNames: cards.map((card) => card.name),
    standaloneCardsAdded: ["Hemochromatosis"],
    cardsReplacedCompletely: ["Hemophilia", "Hemophilia A", "Hemophilia B"],
    sourceKeys: sources.map((source) => source.key),
    safetyContracts: {
      compositeHasStandaloneComponent: {
        composite: "Hemochromatosis-associated diabetes",
        requiredComponent: "Hemochromatosis",
        satisfied: database.diseases.some((entry) => normalize(entry && entry.name) === "hemochromatosis")
      },
      medicationInferenceMode: "explicit-only",
      medicationTreatmentSafetyPolicy: "curated-explicit-v2",
      hemophiliaExplicitMedicationLists: Object.fromEntries(
        [hemophilia, hemophiliaA, hemophiliaB].map((card) => [card.name, card.directTreatmentMedications.slice()])
      ),
      forbiddenHemophiliaTreatmentMedications: forbiddenHemophiliaTreatmentMedications.slice(),
      antithromboticCaution: "Antithrombotics are not hemophilia therapy; a separate thrombotic indication requires coordinated specialist care."
    },
    application: application.map((entry) => ({ ...entry }))
  };
}());
