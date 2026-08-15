/* eslint-disable */
/* Wave 45: source-bound therapeutic nutrition, swallowing safety, and IDDSI references. */
(function () {
  "use strict";

  const VERSION = "2026-08-12-wave45-nutrition-swallowing-1";
  const GLOBAL_NAME = "ANI_CLINICAL_FRONTIER_WAVE45_NUTRITION_SWALLOWING";
  if (window[GLOBAL_NAME] && window[GLOBAL_NAME].version === VERSION) return;

  const THERAPEUTIC_ID = "therapeutic-diets-nutrition";
  const THERAPEUTIC_LABEL = "Therapeutic Diets & Nutrition";
  const SWALLOWING_ID = "swallowing-diet-consistency";
  const SWALLOWING_LABEL = "Swallowing & Diet Consistency";
  const SOURCE_NOTE = "This learner reference is an educational synthesis of the cited government, guideline, standards, and professional sources. Diet, swallowing, medication-route, fluid, electrolyte, and nutrition-support decisions remain patient-specific and must follow the current order, assessment, laboratory trend, qualified clinician recommendations, and facility protocol.";

  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const unique = (values) => Array.from(new Map((values || [])
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .map((value) => [normalize(value), value])).values());
  const slug = (value) => normalize(value).replace(/\s+/g, "-");

  const localSourceReferences = Object.freeze([
    Object.freeze({
      key: "w45-iddsi-framework-v2",
      label: "IDDSI Complete Framework Detailed Definitions 2.0",
      url: "https://www.iddsi.org/images/Publications-Resources/DetailedDefnTestMethods/English/HR/V2DetailedDefnEnglish31july2019.pdf",
      note: "Defines the eight-level IDDSI framework, food and drink characteristics, adult and pediatric size criteria, and the requirement to select a level through individualized clinical assessment rather than from the framework alone."
    }),
    Object.freeze({
      key: "w45-iddsi-testing-v2",
      label: "IDDSI Testing Methods 2.0",
      url: "https://www.iddsi.org/images/Publications-Resources/DetailedDefnTestMethods/English/V2TestingMethodsEnglish31july2019.pdf",
      note: "Defines IDDSI Flow, Fork Drip, Spoon Tilt, Fork Pressure, and related testing methods and supports testing food and drink under intended serving conditions."
    }),
    Object.freeze({
      key: "w45-iddsi-adult-poster",
      label: "IDDSI Adult Food and Drink Classification Poster",
      url: "https://www.iddsi.org/images/Publications-Resources/Poster/OtherPosters/iddsi_framework_poster_adult_food_drink_final_with_bleed_jan2020.pdf",
      note: "Supports concise adult level names, Flow Test endpoints after 10 seconds, the 4 mm minced-and-moist particle anchor, and the 1.5 cm soft-and-bite-sized piece anchor."
    }),
    Object.freeze({
      key: "w45-iddsi-framework-development",
      label: "Development of International Terminology and Definitions for Texture-Modified Foods and Thickened Fluids Used in Dysphagia Management",
      url: "https://www.iddsi.org/images/Publications-Resources/Publications/developmentofframework.pdf",
      note: "Documents worldwide terminology variation and why older labels such as nectar, honey, and pudding thick should not be treated as a universally exact IDDSI crosswalk."
    }),
    Object.freeze({
      key: "w45-asha-adult-dysphagia",
      label: "American Speech-Language-Hearing Association: Adult Dysphagia Practice Portal",
      url: "https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/",
      note: "Supports dysphagia definition, causes, signs, screening-versus-assessment distinctions, VFSS and FEES, interprofessional care, individualized texture and posture decisions, medication concerns, silent aspiration, and limits and burdens of thickened liquids."
    }),
    Object.freeze({
      key: "w45-asha-swallow-screening",
      label: "American Speech-Language-Hearing Association: Swallowing Screening",
      url: "https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/swallowing-screening/",
      note: "Supports screening as risk identification rather than diagnosis, trained staff and documentation, stopping a screen when risk appears, referral for comprehensive assessment, and the absence of one bedside screen that perfectly predicts aspiration."
    }),
    Object.freeze({
      key: "w45-nidcd-aphasia",
      label: "NIH NIDCD: Aphasia",
      url: "https://www.nidcd.nih.gov/health/aphasia",
      note: "Defines aphasia as impaired language expression or understanding, reading, or writing and supports the distinction between aphasia and swallowing impairment."
    }),
    Object.freeze({
      key: "w45-aha-stroke-screen",
      label: "American Heart Association Get With The Guidelines: Stroke Dysphagia Screening Measure",
      url: "https://www.heart.org/en/professional/quality-improvement/get-with-the-guidelines/get-with-the-guidelines-stroke/get-with-the-guidelines-stroke-rural-recognition-criteria",
      note: "Supports an evidence-based dysphagia screen before food, fluid, or oral medication after acute stroke, or continued nothing-by-mouth status until safety is established."
    }),
    Object.freeze({
      key: "w45-cdc-oral-care-pneumonia",
      label: "CDC Oral Health in Healthcare Settings to Prevent Pneumonia Toolkit",
      url: "https://www.cdc.gov/healthcare-associated-infections/hcp/prevention-healthcare/oral-health-pneumonia-toolkit.html",
      note: "Supports protocolized oral assessment and care, aspiration-aware positioning and suction for dependent patients, documentation, and oral hygiene as a modifiable pneumonia-risk intervention."
    }),
    Object.freeze({
      key: "w45-nhlbi-dash",
      label: "NIH NHLBI: DASH Eating Plan",
      url: "https://www.nhlbi.nih.gov/health/dash-eating-plan",
      note: "Defines DASH, its hypertension and heart-health purpose, food pattern, 2,300 mg sodium plan, optional 1,500 mg pattern, and calorie-dependent serving examples."
    }),
    Object.freeze({
      key: "w45-nhlbi-dash-living",
      label: "NIH NHLBI: Living With DASH",
      url: "https://www.nhlbi.nih.gov/health/dash/living-with-dash",
      note: "Supports label reading, processed-food sodium sources, shopping and cooking strategies, and the need to adjust servings and calories to the individual."
    }),
    Object.freeze({
      key: "w45-aha-heart-diet",
      label: "American Heart Association Diet and Lifestyle Recommendations",
      url: "https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition-basics/aha-diet-and-lifestyle-recommendations",
      note: "Supports a heart-healthy overall pattern emphasizing vegetables, fruits, whole grains, healthy proteins, unsaturated oils, minimally processed foods, and less sodium, added sugar, saturated fat, and processed meat."
    }),
    Object.freeze({
      key: "w45-aha-mediterranean",
      label: "American Heart Association: What Is the Mediterranean Diet?",
      url: "https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition-basics/mediterranean-diet",
      note: "Supports Mediterranean-style pattern characteristics, cardiovascular relevance, cultural variation, and the teaching that a person who does not drink alcohol should not start for presumed heart benefit."
    }),
    Object.freeze({
      key: "w45-aha-food-claims",
      label: "American Heart Association: Making Sense of Food Packaging Claims",
      url: "https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition-basics/food-packaging-claims",
      note: "Supports per-serving sodium claim definitions: sodium free under 5 mg, very low sodium 35 mg or less, low sodium 140 mg or less, and reduced sodium at least 25% below the reference product."
    }),
    Object.freeze({
      key: "w45-ada-nutrition-2026",
      label: "American Diabetes Association Standards of Care in Diabetes—2026, Section 5",
      url: "https://doi.org/10.2337/dc26-S005",
      note: "Supports individualized medical nutrition therapy, no universal diabetes eating pattern, nutrient-dense foods, carbohydrate quality and amount, fiber of at least 14 g per 1,000 kcal, and sodium below 2,300 mg/day when appropriate."
    }),
    Object.freeze({
      key: "w45-ada-hospital-2026",
      label: "American Diabetes Association Standards of Care in Diabetes—2026, Section 16: Diabetes Care in the Hospital",
      url: "https://doi.org/10.2337/dc26-S016",
      note: "Supports individualized inpatient nutrition and calculated- or controlled-carbohydrate meal plans that help coordinate prandial insulin with carbohydrate delivery."
    }),
    Object.freeze({
      key: "w45-kdigo-ckd-2024",
      label: "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease",
      url: "https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf",
      note: "Supports individualized CKD nutrition, sodium below 2 g/day for many adults with CKD with exceptions such as sodium-wasting disease, protein near 0.8 g/kg/day in metabolically stable adults with CKD G3-G5, and avoiding high protein above 1.3 g/kg/day in adults at progression risk."
    }),
    Object.freeze({
      key: "w45-kdoqi-ckd-nutrition-2020",
      label: "KDOQI 2020 Clinical Practice Guideline for Nutrition in CKD: Overview",
      url: "https://www.kidney.org/sites/default/files/ckd_nutrition_gl-overview%20-%20Revised%203-24-1.pdf",
      note: "Supports nutrition assessment, adult CKD sodium guidance near 2.3 g/day, and adjusting potassium and phosphorus intake to individual serum values, needs, and clinician judgment rather than universal food bans."
    }),
    Object.freeze({
      key: "w45-nkf-kidney-plate",
      label: "National Kidney Foundation: Creating a Kidney-Friendly Plate",
      url: "https://www.kidney.org/kidney-topics/creating-kidney-friendly-plate",
      note: "Supports individualized portions and nutrient modification based on CKD stage, dialysis, laboratory values, diabetes, appetite, and dietitian guidance; not every person with CKD needs potassium restriction."
    }),
    Object.freeze({
      key: "w45-nkf-hemodialysis-diet",
      label: "National Kidney Foundation: Hemodialysis and Your Diet",
      url: "https://www.kidney.org/kidney-topics/hemodialysis-and-your-diet",
      note: "Supports dialysis-specific differences in protein and fluid needs, residual urine and treatment-schedule effects, phosphorus-additive teaching, and individualized sodium, potassium, phosphorus, and fluid plans."
    }),
    Object.freeze({
      key: "w45-ukka-hyperkalemia-2023",
      label: "UK Kidney Association Clinical Practice Guideline: Treatment of Acute Hyperkalaemia in Adults (2023)",
      url: "https://guidelines.ukkidney.org/hyperkalaemia/",
      note: "Supports the guideline-specific adult hyperkalemia severity anchors of 5.5-5.9 mmol/L (mild), 6.0-6.4 mmol/L (moderate), and at least 6.5 mmol/L (severe), urgent hospital assessment for severe hyperkalemia, and contextual interpretation with repeat testing, acuity, ECG findings, kidney injury, medicines, and dietary review."
    }),
    Object.freeze({
      key: "w45-aha-hf-2022",
      label: "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure",
      url: "https://professional.heart.org/en/guidelines-statements/2022-ahaacchfsa-guideline-for-the-management-of-heart-failure-a-report-of-thecir0000000000001063",
      note: "Supports avoiding excessive sodium in symptomatic heart failure and the limited evidence for routine fluid restriction, requiring individualized use rather than one restriction for every patient."
    }),
    Object.freeze({
      key: "w45-medlineplus-clear-liquid",
      label: "NIH MedlinePlus: Clear Liquid Diet",
      url: "https://medlineplus.gov/ency/patientinstructions/000205.htm",
      note: "Supports the clear-liquid definition, common short-term indications, examples, procedure-specific restrictions, and the diet's nutritional incompleteness."
    }),
    Object.freeze({
      key: "w45-medlineplus-full-liquid",
      label: "NIH MedlinePlus: Full Liquid Diet",
      url: "https://medlineplus.gov/ency/patientinstructions/000206.htm",
      note: "Supports the full-liquid definition, examples, progression uses, and need for nutrition review if used beyond a short interval."
    }),
    Object.freeze({
      key: "w45-medlineplus-low-fiber",
      label: "NIH MedlinePlus: Low-Fiber Diet",
      url: "https://medlineplus.gov/ency/patientinstructions/000200.htm",
      note: "Supports temporary low-fiber use in selected bowel conditions and postoperative states, the commonly used 10-15 g/day example, food examples, and the need for condition-specific duration and progression."
    }),
    Object.freeze({
      key: "w45-niddk-constipation-nutrition",
      label: "NIH NIDDK: Eating, Diet, and Nutrition for Constipation",
      url: "https://www.niddk.nih.gov/health-information/digestive-diseases/constipation/eating-diet-nutrition",
      note: "Supports a common adult fiber target of 22-34 g/day by age and sex, gradual increases, and adequate fluid when the patient's medical plan permits it."
    }),
    Object.freeze({
      key: "w45-niddk-celiac",
      label: "NIH NIDDK: Eating, Diet, and Nutrition for Celiac Disease",
      url: "https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/eating-diet-nutrition",
      note: "Supports lifelong strict gluten avoidance for confirmed celiac disease, wheat/barley/rye/triticale sources, cross-contact, testing before self-treatment, and the U.S. gluten-free label threshold below 20 ppm."
    }),
    Object.freeze({
      key: "w45-niddk-lactose",
      label: "NIH NIDDK: Eating, Diet, and Nutrition for Lactose Intolerance",
      url: "https://www.niddk.nih.gov/health-information/digestive-diseases/lactose-intolerance/eating-diet-nutrition",
      note: "Supports individualized lactose tolerance, the observation that many people tolerate about 12 g lactose (approximately 1 cup or 240 mL milk) with no or mild symptoms, lactose-reduced and lactose-free options, yogurt, hard cheese, lactase products, and maintaining calcium and vitamin D intake."
    }),
    Object.freeze({
      key: "w45-niddk-pancreatitis",
      label: "NIH NIDDK: Eating, Diet, and Nutrition for Pancreatitis",
      url: "https://www.niddk.nih.gov/health-information/digestive-diseases/pancreatitis/eating-diet-nutrition",
      note: "Supports clinician-directed low-fat healthy eating and small frequent meals in pancreatitis and the need to avoid universal unsupervised fasting or alcohol advice detached from clinical care."
    }),
    Object.freeze({
      key: "w45-asa-fasting",
      label: "American Society of Anesthesiologists Practice Guideline for Preoperative Fasting",
      url: "https://www.asahq.org/coveo/~/media/sites/asahq/files/public/resources/standards-guidelines/practice-guidelines-for-preoperative-fasting.pdf",
      note: "Supports elective-procedure fasting anchors for healthy patients—clear liquids up to 2 hours, breast milk 4 hours, infant formula, nonhuman milk, or a light meal 6 hours, and longer fasting such as 8 hours for fatty/fried food or meat—while limiting those times to the guideline population and procedure context."
    }),
    Object.freeze({
      key: "w45-aspen-en-safe",
      label: "ASPEN Safe Practices for Enteral Nutrition Therapy",
      url: "https://doi.org/10.1177/0148607116673053",
      note: "Supports standardized enteral orders, access and route verification, administration and medication safety, contamination and misconnection prevention, aspiration-risk assessment, and monitoring for tolerance and complications."
    }),
    Object.freeze({
      key: "w45-aspen-pn-overview",
      label: "ASPEN: What Is Parenteral Nutrition?",
      url: "https://nutritioncare.org/about/what-we-do/nutrition-support/what-is-parenteral-nutrition/",
      note: "Supports PN indications when the gastrointestinal route cannot meet needs, central versus peripheral concepts, major metabolic and catheter risks, monitoring, and transition toward oral or enteral nutrition when feasible."
    }),
    Object.freeze({
      key: "w45-aspen-pn-safe",
      label: "ASPEN Parenteral Nutrition Safety Consensus Recommendations",
      url: "https://doi.org/10.1177/0148607113511992",
      note: "Supports standardized PN prescribing, compounding, administration, vascular-access safety, and monitoring of glucose, electrolytes, triglycerides, fluid, hepatic and renal function, infection, and thrombosis."
    }),
    Object.freeze({
      key: "w45-nice-nutrition-support",
      label: "NICE CG32: Nutrition Support for Adults",
      url: "https://www.nice.org.uk/guidance/cg32/chapter/Recommendations",
      note: "Supports enteral nutrition when oral intake is inadequate or unsafe and the gastrointestinal tract is functional, PN when oral/enteral routes are inadequate or unsafe or the tract is inaccessible or nonfunctional, and progressive introduction with refeeding and laboratory monitoring."
    }),
    Object.freeze({
      key: "w45-aspen-protein-ltc",
      label: "ASPEN: Protein Supplements for Patients in Long-Term Care",
      url: "https://nutritioncare.org/wp-content/uploads/2024/12/Protein-Supplement-For-Long-Term-Care-Patients.pdf",
      note: "Supports dietitian assessment before protein supplementation and recognizes higher needs in selected malnutrition, wound, recent critical-illness, and dialysis contexts rather than a universal high-protein prescription."
    }),
    Object.freeze({
      key: "w45-aasld-ascites",
      label: "AASLD Practice Guidance: Ascites, Spontaneous Bacterial Peritonitis, and Hepatorenal Syndrome in Cirrhosis",
      url: "https://doi.org/10.1002/hep.31884",
      note: "Supports moderate sodium restriction near 2 g/day for cirrhotic ascites and avoiding routine fluid restriction unless clinically indicated, including selected hyponatremia contexts."
    }),
    Object.freeze({
      key: "w45-aasld-cirrhosis-nutrition",
      label: "AASLD Clinical Pearls: Malnutrition in the Adult With Cirrhosis",
      url: "https://www.aasld.org/liver-fellow-network/core-series/clinical-pearls/malnutrition-adult-cirrhosis",
      note: "Supports avoiding routine protein restriction in hepatic encephalopathy, screening for malnutrition and sarcopenia, and individualized frequent-meal and protein plans."
    })
  ]);

  const foundationDatabase = window.ANI_FOUNDATIONS_DATABASE && typeof window.ANI_FOUNDATIONS_DATABASE === "object"
    ? window.ANI_FOUNDATIONS_DATABASE
    : { entries: [], sourceReferences: [] };
  if (!Array.isArray(foundationDatabase.entries)) foundationDatabase.entries = [];
  if (!Array.isArray(foundationDatabase.sourceReferences)) foundationDatabase.sourceReferences = [];

  const sourceIndex = new Map(foundationDatabase.sourceReferences
    .filter((source) => source && source.key)
    .map((source, index) => [String(source.key), index]));
  localSourceReferences.forEach((source) => {
    if (!/^https:\/\//i.test(source.url)) throw new Error("Wave45 source must use HTTPS: " + source.key);
    const existingIndex = sourceIndex.get(source.key);
    if (Number.isInteger(existingIndex)) foundationDatabase.sourceReferences[existingIndex] = { ...source };
    else {
      sourceIndex.set(source.key, foundationDatabase.sourceReferences.length);
      foundationDatabase.sourceReferences.push({ ...source });
    }
  });
  const sourceByKey = new Map(foundationDatabase.sourceReferences
    .filter((source) => source && source.key)
    .map((source) => [String(source.key), source]));
  const sourceNoteFor = (sourceKeys) => unique(sourceKeys).map((key) => {
    const source = sourceByKey.get(key);
    if (!source || !source.label || !/^https:\/\//i.test(source.url)) {
      throw new Error("Unknown or invalid Wave45 source key: " + key);
    }
    return source.label + " (" + source.url + ")";
  }).join("; ");

  const article = (spec) => {
    const sourceKeys = unique(spec.sourceKeys || []);
    if (!sourceKeys.length) throw new Error("Wave45 card lacks sources: " + spec.name);
    const subcategoryId = spec.holisticSubcategoryId;
    const subcategoryLabel = subcategoryId === THERAPEUTIC_ID ? THERAPEUTIC_LABEL : SWALLOWING_LABEL;
    if (![THERAPEUTIC_ID, SWALLOWING_ID].includes(subcategoryId)) {
      throw new Error("Invalid Wave45 Holistic subcategory: " + spec.name);
    }
    const relatedTopics = unique(spec.relatedTopics || []);
    const clinicalConnections = Array.isArray(spec.clinicalConnections)
      ? spec.clinicalConnections.map((connection) => ({
        topic: String(connection && connection.topic || "").trim(),
        explanation: String(connection && connection.explanation || "").trim()
      }))
      : [];
    let sections = Array.isArray(spec.sections) ? spec.sections.slice() : [];
    if (subcategoryId === THERAPEUTIC_ID) {
      if (!String(spec.whyItMatters || "").trim()) {
        throw new Error("Therapeutic nutrition card lacks a direct clinical why: " + spec.name);
      }
      if (clinicalConnections.length !== relatedTopics.length
        || clinicalConnections.some((connection) => !connection.topic || !connection.explanation)
        || clinicalConnections.some((connection, index) => normalize(connection.topic) !== normalize(relatedTopics[index]))) {
        throw new Error("Therapeutic nutrition connections must explain every related topic in source order: " + spec.name);
      }
      sections = sections.filter((section) => normalize(Array.isArray(section) ? section[0] : section && (section.label || section.heading || section.title)) !== "connected topics");
      sections.push([
        "Why these topics are connected",
        clinicalConnections.map((connection) => `${connection.topic}: ${connection.explanation}`)
      ]);
    }
    return {
      type: "foundation",
      educationalArticle: true,
      encyclopediaSection: "holistic",
      holisticSubcategoryId: subcategoryId,
      holisticSubcategoryLabel: subcategoryLabel,
      category: "Holistic / " + subcategoryLabel,
      icon: subcategoryId === THERAPEUTIC_ID ? "Nutrition" : "Swallow",
      sourceNote: SOURCE_NOTE,
      directTargetId: "holistic:" + slug(spec.name),
      confidenceTier: "Curated full study card",
      studentFacing: true,
      nclexEssential: Boolean(spec.nclexEssential),
      aliases: [],
      abbreviations: [],
      commonMisspellings: [],
      relatedTopics: [],
      tags: [],
      ...spec,
      aliases: unique(spec.aliases || []),
      abbreviations: unique(spec.abbreviations || []),
      commonMisspellings: unique(spec.commonMisspellings || []),
      relatedTopics,
      clinicalConnections,
      sections,
      tags: unique(["wave45", "holistic", subcategoryId, ...(spec.tags || [])]),
      sourceKeys,
      evidenceNote: "Evidence anchors: " + sourceNoteFor(sourceKeys),
      wave45NutritionSwallowingRevision: VERSION
    };
  };

  const therapeutic = (spec) => article({ holisticSubcategoryId: THERAPEUTIC_ID, ...spec });
  const swallowing = (spec) => article({ holisticSubcategoryId: SWALLOWING_ID, ...spec });

  const entries = [];

  const iddsiFoodCard = (spec) => swallowing({
    name: `IDDSI Level ${spec.level} — ${spec.label}`,
    nclexEssential: Boolean(spec.nclexEssential),
    aliases: spec.aliases,
    summary: `IDDSI Level ${spec.level} ${spec.label} is a standardized food-texture category. ${spec.summary} The level describes tested physical properties; it does not independently determine which texture is safest for a particular person.`,
    quickAnswer: `${spec.quickAnswer} Confirm the written food level separately from the drink level, test the actual food under intended serving conditions, and follow the individualized swallowing plan rather than selecting a level from diagnosis alone.`,
    sections: [
      ["What it means", `${spec.meaning} A comprehensive swallowing and nutrition assessment determines whether this level fits the person's chewing, bolus control, pharyngeal clearance, fatigue, cognition, and goals.`],
      ["Characteristics and examples", `${spec.characteristics} Examples are useful only when the prepared item passes the required IDDSI tests; a food name by itself never guarantees the level.`],
      ["IDDSI testing", `${spec.testing} Test at the temperature and time the food will be served because cooling, heating, standing, recipe changes, liquid separation, and brand differences can alter texture.`],
      ["Nursing implementation", "Verify the current order and tray, compare food and drink levels, inspect mixed consistencies and hidden hard pieces, provide only prescribed positioning and assistance, monitor intake and fatigue, and document tolerance and any mismatch."],
      ["Safety and escalation", "A more modified texture is not automatically safer. Stop oral intake and escalate for choking, repeated cough or throat clearing, wet or gurgly voice, inability to manage secretions, significant pocketing, respiratory change, or reduced alertness."],
      ["NCLEX distinctions", `${spec.distinction} Nurses implement and monitor the evaluated plan; they do not independently advance, downgrade, or substitute a texture because a food looks soft.`],
      ["Connected topics", `Connect this level with Food Texture Modification and IDDSI, Dysphagia, Aspiration prevention, Safe Feeding and Mealtime Assistance, and ${spec.relatedLevel}.`]
    ],
    relatedTopics: ["Food Texture Modification and IDDSI", "Dysphagia", "Aspiration prevention", "Safe Feeding and Mealtime Assistance", spec.relatedLevel],
    tags: ["IDDSI", `level ${spec.level}`, spec.label, "food texture", "dysphagia", "swallowing safety"],
    sourceKeys: ["w45-iddsi-framework-v2", "w45-iddsi-testing-v2", "w45-iddsi-adult-poster", "w45-asha-adult-dysphagia"]
  });

  const iddsiDrinkCard = (spec) => swallowing({
    name: `IDDSI Level ${spec.level} — ${spec.label}`,
    nclexEssential: Boolean(spec.nclexEssential),
    aliases: spec.aliases,
    summary: `IDDSI Level ${spec.level} ${spec.label} is a standardized drink-consistency category. ${spec.summary} Flow level is one part of an individualized swallowing plan and does not prove that a drink is safe for every patient.`,
    quickAnswer: `${spec.quickAnswer} Use the specified 10 mL IDDSI Flow Test syringe (61.5 mm between its 0 and 10 mL calibration lines) and the 10-second method where applicable, test at serving temperature, and never guess an IDDSI level from a legacy nectar, honey, or pudding label.`,
    sections: [
      ["What it means", `${spec.meaning} The selected level should reflect swallowing physiology, airway protection, residue, effort, hydration, medication delivery, patient preference, and the results of clinical or instrumental assessment.`],
      ["Characteristics and examples", `${spec.characteristics} Commercial and prepared products still require the ordered method because temperature, recipe, storage, standing time, and added medicines can change flow.`],
      ["IDDSI testing", `${spec.testing} The IDDSI reference syringe measures 61.5 mm between its 0 and 10 mL calibration lines; barrel length and nozzle geometry matter, so a different syringe can give a different result. Level 4 also requires spoon and fork behavior rather than relying on a legacy name.`],
      ["Nursing implementation", "Verify the exact number and name, recipe or product, equipment, cup or straw plan, positioning, pace, and supervision. Measure actual intake, observe tolerance, and prevent unapproved dilution, ice, or bedside thickener changes."],
      ["Safety and monitoring", "Thicker is not automatically safer and thickened drinks do not eliminate aspiration. Monitor cough, throat clearing, wet or gurgly voice, breathing, fatigue, hydration, urine, constipation, medication delivery, and willingness to drink."],
      ["NCLEX distinctions", `${spec.distinction} Stop and reassess rather than independently changing thickness when swallowing signs occur; absence of cough does not exclude silent aspiration.`],
      ["Connected topics", `Connect this level with Liquid Consistency and Thickened Liquids, Dysphagia, Aspiration prevention, Safe Feeding and Mealtime Assistance, and ${spec.relatedLevel}.`]
    ],
    relatedTopics: ["Liquid Consistency and Thickened Liquids", "Dysphagia", "Aspiration prevention", "Safe Feeding and Mealtime Assistance", spec.relatedLevel],
    tags: ["IDDSI", `level ${spec.level}`, spec.label, "liquid consistency", "flow test", "dysphagia"],
    sourceKeys: ["w45-iddsi-framework-v2", "w45-iddsi-testing-v2", "w45-iddsi-adult-poster", "w45-asha-adult-dysphagia"]
  });

  entries.push(
    therapeutic({
      name: "DASH Diet",
      nclexEssential: true,
      aliases: ["DASH", "DASH diet", "hypertension diet", "Dietary Approaches to Stop Hypertension", "blood pressure diet"],
      abbreviations: ["DASH"],
      summary: "DASH—Dietary Approaches to Stop Hypertension—is a flexible eating pattern that lowers blood-pressure risk by emphasizing vegetables, fruits, whole grains, beans, nuts, fish, poultry, low-fat dairy, and unsaturated plant oils while limiting sodium, saturated fat, sugar-sweetened drinks, and sweets. It is a broad pattern, not a list of forbidden foods.",
      quickAnswer: "DASH teaches both pattern and numbers. NHLBI's common plan uses no more than 2,300 mg sodium/day; a 1,500 mg/day option can lower blood pressure further for selected people. Serving examples shown for 2,000 kcal are examples, not universal prescriptions, and potassium-rich DASH foods may need modification in kidney disease or hyperkalemia.",
      whyItMatters: "DASH is commonly used to help prevent or treat hypertension and reduce overall cardiovascular risk. Lower sodium plus a food pattern rich in potassium, calcium, magnesium, and fiber supports blood-pressure control, but kidney disease, hyperkalemia, potassium-altering medicines, energy needs, and tolerance can require modification rather than automatic use of every DASH feature.",
      sections: [
        ["Purpose and pattern", "DASH supports prevention and treatment of hypertension and an overall heart-healthy style. It emphasizes minimally processed plant foods, low-fat dairy, beans and nuts, fish and poultry, and vegetable oils; it limits fatty meats, full-fat dairy, tropical oils, sweets, and sugar-sweetened beverages."],
        ["Objective anchors", "NHLBI's standard DASH sodium target is 2,300 mg/day, with a 1,500 mg/day pattern that can lower blood pressure further. NHLBI's sample servings—such as 4-5 vegetable and 4-5 fruit servings/day—are based on a 2,000-kcal plan and must be adjusted for energy needs."],
        ["Nursing assessment and monitoring", "Review blood pressure trend, weight goals, kidney function, potassium, medicines, food access, culture, and usual sodium sources. Reconcile DASH's potassium-rich pattern with CKD, hyperkalemia, potassium-altering medicines, or an individualized renal plan."],
        ["Patient teaching", "Use labels and serving sizes, choose fresh or frozen foods more often than cured or highly processed foods, rinse appropriate canned items, and flavor food with herbs, spices, citrus, or salt-free blends. Gradual substitutions are usually more sustainable than a sudden rigid menu."],
        ["NCLEX distinctions", "DASH is more than 'no salt.' Sodium reduction is one component of a nutrient-rich pattern. Do not prescribe the 1,500 mg option or high-potassium foods universally, and do not present a 2,000-kcal serving table as appropriate for every patient."],
        ["Connected topics", "Connect DASH Diet with Hypertension, Low-Sodium Diet, Heart-Healthy Nutrition, Chronic kidney disease, and medication-related potassium monitoring."]
      ],
      relatedTopics: ["Hypertension", "Low-Sodium Diet", "Heart-Healthy Nutrition", "Chronic kidney disease"],
      clinicalConnections: [
        { topic: "Hypertension", explanation: "DASH is used most directly for high blood pressure because its overall nutrient pattern and lower sodium intake can reduce blood pressure; the sodium level and medication plan still remain individualized." },
        { topic: "Low-Sodium Diet", explanation: "Sodium reduction is one part of DASH, but a condition-specific low-sodium order may use a different target and does not automatically require the full DASH pattern." },
        { topic: "Heart-Healthy Nutrition", explanation: "DASH is one heart-healthy pattern because it emphasizes minimally processed plant foods, lean proteins, and unsaturated fats while limiting saturated fat and added sugar; it complements rather than replaces other cardiovascular treatment." },
        { topic: "Chronic kidney disease", explanation: "Blood-pressure and sodium control can support CKD management, but potassium-rich foods, protein, phosphorus, and fluid may need stage-, laboratory-, and dialysis-specific modification, so standard DASH is not universal in CKD." }
      ],
      tags: ["DASH", "hypertension", "blood pressure", "2300 mg sodium", "1500 mg sodium", "patient teaching"],
      sourceKeys: ["w45-nhlbi-dash", "w45-nhlbi-dash-living", "w45-kdigo-ckd-2024"]
    }),
    therapeutic({
      name: "Low-Sodium Diet",
      nclexEssential: true,
      // "low sodium" is discovery language, not a safe one-owner identity:
      // it can also describe hyponatremia. Keep the diet-specific aliases and
      // index the short phrase only as a non-routing search term.
      aliases: ["low-sodium diet", "sodium restriction", "sodium-restricted diet", "salt restriction", "2 gram sodium diet"],
      searchTerms: ["low sodium"],
      summary: "A low-sodium diet reduces sodium intake to support blood-pressure and fluid-volume management in selected hypertension, heart-failure, kidney, and liver-disease plans. Sodium is present in table salt, but much intake comes from processed, prepared, restaurant, cured, pickled, and packaged foods.",
      quickAnswer: "The exact target belongs to the condition-specific plan. Common adult anchors include DASH's 2,300 mg/day and KDIGO's below 2,000 mg/day for many adults with CKD; these are not interchangeable universal orders. On labels, 'low sodium' means 140 mg or less per serving, while 'reduced sodium' means at least 25% less than a reference food and may still be high.",
      whyItMatters: "A low-sodium diet is ordered when excess sodium can worsen high blood pressure, thirst, or fluid retention—commonly in selected hypertension, symptomatic heart failure, CKD or dialysis, and cirrhotic ascites plans. Lower sodium reduces water retention and can make blood-pressure and congestion management easier, but the target must match the condition; sodium-wasting states, major losses, poor intake, pregnancy, age, and medicines can make aggressive restriction inappropriate.",
      sections: [
        ["Purpose and indications", "Reducing excess sodium can lower blood pressure and reduce thirst or fluid retention in selected patients. The benefit, target, and urgency differ among uncomplicated hypertension, heart failure, CKD, dialysis, cirrhotic ascites, sodium-wasting disorders, pregnancy, and pediatric care."],
        ["Objective label language", "Per serving, sodium free means under 5 mg, very low sodium means 35 mg or less, low sodium means 140 mg or less, and reduced sodium means at least 25% less than the reference product. 'No salt added' does not guarantee a sodium-free food. Always compare serving size and milligrams per serving."],
        ["Common sources", "Teach the hidden sources: breads, deli or cured meats, cheese, canned or instant soups, frozen meals, sauces, seasoning packets, pickles, snack foods, restaurant meals, and effervescent or sodium-containing products. Salt substitutes may contain potassium and are not automatically safe in CKD or with potassium-raising medicines."],
        ["Nursing monitoring", "Trend blood pressure, edema, lung findings, daily weight when ordered, thirst, intake/output, sodium and kidney function, and response to diuretics. Assess whether the prescribed target causes poor intake or conflicts with malnutrition risk."],
        ["Teaching", "Choose fresh or minimally processed foods, compare brands, rinse suitable canned foods, request sauces or dressings separately, and use herbs, aromatics, vinegar, or citrus. Translate the daily target into the patient's actual meals instead of teaching only a milligram number."],
        ["Safety and nuance", "Do not assume every patient needs 2 g/day, every heart-failure patient needs a fluid restriction, or every CKD patient benefits from the same sodium target. Sodium-wasting disease, heavy losses, medications, age, pregnancy, nutrition status, and specialty guidance change the plan."],
        ["Connected topics", "Connect Low-Sodium Diet with DASH Diet, Hypertension, Heart failure, Renal Nutrition, Fluid Restriction, and cirrhotic ascites."]
      ],
      relatedTopics: ["DASH Diet", "Hypertension", "Heart failure", "Renal Nutrition", "Fluid Restriction", "Cirrhosis"],
      clinicalConnections: [
        { topic: "DASH Diet", explanation: "DASH includes sodium reduction within a broader blood-pressure-lowering food pattern; a low-sodium order can be used without prescribing every DASH feature, and its numeric target may differ." },
        { topic: "Hypertension", explanation: "Reducing excess sodium can lower blood pressure and improve the response to the overall treatment plan, although the exact target depends on the patient's risk, intake, medicines, and tolerance." },
        { topic: "Heart failure", explanation: "Avoiding excessive sodium may reduce thirst and fluid retention in symptomatic heart failure, helping congestion management; very strict sodium or fluid limits are not automatic for every patient." },
        { topic: "Renal Nutrition", explanation: "Sodium reduction is often the first renal-nutrition adjustment because it can support blood-pressure and edema control, while potassium, phosphorus, protein, and fluid remain separate laboratory- and stage-dependent decisions." },
        { topic: "Fluid Restriction", explanation: "Sodium and fluid limits may be paired when volume overload or dilutional hyponatremia is clinically important because sodium increases thirst and retained water, but one restriction does not automatically require the other." },
        { topic: "Cirrhosis", explanation: "Moderate sodium restriction is commonly used when cirrhosis causes ascites or edema to limit additional water retention; fluid restriction is usually reserved for selected circumstances such as clinically important hyponatremia." }
      ],
      tags: ["sodium restriction", "salt restriction", "label reading", "140 mg", "2300 mg", "2000 mg", "fluid balance"],
      sourceKeys: ["w45-nhlbi-dash-living", "w45-aha-food-claims", "w45-kdigo-ckd-2024", "w45-aha-hf-2022", "w45-aasld-ascites"]
    }),
    therapeutic({
      name: "Heart-Healthy Nutrition",
      nclexEssential: false,
      aliases: ["heart healthy diet", "heart-healthy diet", "cardiac diet", "cardiovascular diet", "cardiac nutrition"],
      summary: "Heart-healthy nutrition is an overall eating pattern for cardiovascular risk reduction: vegetables and fruits, whole grains, beans, nuts, fish, lean or plant proteins, low-fat dairy when used, and unsaturated plant oils replace many refined, highly processed, sodium-rich, added-sugar, saturated-fat, and trans-fat foods.",
      quickAnswer: "Teach substitutions, not a vague 'cardiac diet': beans or fish in place of processed meat, whole grains in place of refined grains, and liquid plant oils in place of butter or tropical oils. The exact sodium, calorie, carbohydrate, potassium, and fluid targets still depend on the patient's diseases and treatment plan.",
      whyItMatters: "Heart-healthy nutrition is used to prevent or manage cardiovascular disease and major risk factors such as hypertension, dyslipidemia, and type 2 diabetes. Replacing saturated and trans fats, excess sodium, added sugars, and highly processed foods with unsaturated fats and fiber-rich foods supports lipid, blood-pressure, glucose, and weight goals; it is not one standardized 'cardiac diet,' and kidney, heart-failure, diabetes, swallowing, or malnutrition needs can change the plan.",
      sections: [
        ["Clinical purpose", "The pattern supports blood-pressure, lipid, glucose, weight, and vascular-risk management. It complements medication and activity plans rather than replacing them."],
        ["Foods emphasized", "Use a wide variety of vegetables and fruits, whole grains, beans, peas, lentils, nuts, fish and seafood, lean unprocessed poultry or meat when chosen, low-fat dairy, and non-tropical liquid plant oils."],
        ["Foods limited", "Reduce processed meats, ultraprocessed foods, refined grains, sugar-sweetened drinks, sweets, excess sodium, and foods rich in saturated or trans fat. Alcohol is not required; people who do not drink should not start for heart benefit."],
        ["Nursing education", "Assess budget, food access, cultural pattern, chewing or swallowing needs, allergies, diabetes, CKD, and weight goals. Help the patient name two realistic substitutions and show how to read serving size, sodium, saturated fat, added sugar, and ingredient lists."],
        ["Safety", "'Heart healthy' does not automatically mean low potassium, low carbohydrate, low calorie, or fluid restricted. A plant-forward diet may require renal modification, and severe malnutrition may make calorie and protein adequacy the immediate priority."],
        ["Connected topics", "Connect Heart-Healthy Nutrition with DASH Diet, Low-Sodium Diet, Mediterranean Diet, Hypertension, diabetes, dyslipidemia, and heart failure."]
      ],
      relatedTopics: ["DASH Diet", "Low-Sodium Diet", "Mediterranean Diet", "Hypertension", "Heart failure", "Type 2 diabetes mellitus"],
      clinicalConnections: [
        { topic: "DASH Diet", explanation: "DASH is a specific heart-healthy pattern with strong blood-pressure emphasis; it can be chosen when hypertension is a major goal but still needs patient-specific modification." },
        { topic: "Low-Sodium Diet", explanation: "Lower sodium supports blood-pressure and selected congestion goals within heart-healthy care, but a formal sodium restriction is condition-specific rather than a required feature for every person." },
        { topic: "Mediterranean Diet", explanation: "Mediterranean-style eating is another heart-healthy pattern that uses plant foods, fish, and unsaturated oils; it is an adaptable option, not the only cardiovascular diet." },
        { topic: "Hypertension", explanation: "Reducing sodium and improving the overall food pattern can help lower blood pressure alongside medicines, activity, and weight management when appropriate." },
        { topic: "Heart failure", explanation: "Heart-healthy choices can address ischemic risk and hypertension in heart failure, while sodium, fluid, calorie, and potassium targets must follow symptoms, medicines, kidney function, and the individualized plan." },
        { topic: "Type 2 diabetes mellitus", explanation: "Minimally processed, fiber-rich foods and less added sugar support glucose and cardiovascular-risk management in type 2 diabetes, but carbohydrate timing and medication safety still require a diabetes-specific plan." }
      ],
      tags: ["cardiac diet", "cardiovascular risk", "unsaturated fat", "saturated fat", "whole grains", "plant protein"],
      sourceKeys: ["w45-aha-heart-diet", "w45-nhlbi-dash"]
    }),
    therapeutic({
      name: "Mediterranean Diet",
      nclexEssential: false,
      aliases: ["Mediterranean eating pattern", "Mediterranean-style diet", "Mediterranean nutrition"],
      summary: "The Mediterranean diet is not one fixed menu. It is a family of culturally adaptable, plant-forward patterns that emphasize vegetables, fruits, whole grains, beans, nuts, seeds, and olive or other unsaturated plant oils, with fish and seafood commonly included and less processed meat, refined food, added sugar, and saturated fat.",
      quickAnswer: "Teach the shared pattern rather than claiming one authentic plate or a cure. It can support cardiovascular and metabolic health, but portions, energy needs, allergies, diabetes therapy, kidney function, and food access still individualize the plan. Wine is not required, and a person who does not drink should not start.",
      whyItMatters: "A Mediterranean-style pattern is used as one evidence-based option for long-term cardiovascular risk reduction and can support metabolic health. Its benefit comes from the overall pattern—more minimally processed plant foods, fish, and unsaturated fats and less processed meat, refined food, added sugar, and saturated fat—not from one food or alcohol; kidney disease, diabetes treatment, allergies, energy needs, and access can require adaptation.",
      sections: [
        ["Overall pattern", "Meals center on minimally processed plant foods, whole grains, legumes, nuts, seeds, vegetables, fruits, and unsaturated oils. Fish and seafood are common; poultry, eggs, and dairy vary; red and processed meats and sweets are less frequent."],
        ["Clinical relevance", "The pattern aligns with cardiovascular risk reduction and can be adapted for metabolic goals. Benefit reflects the whole pattern and long-term adherence, not olive oil or one food in isolation."],
        ["Patient teaching", "Start with concrete swaps: beans for part of a meat dish, whole grains for refined grains, nuts or fruit for selected snacks, and olive or another non-tropical plant oil for butter. Adapt traditional foods rather than imposing a foreign menu."],
        ["Safety and nuance", "No single Mediterranean diet exists. Do not encourage alcohol initiation, assume unlimited portions, or ignore sodium in olives, cheese, cured foods, or restaurant meals. CKD and diabetes plans may modify specific foods or portions."],
        ["Connected topics", "Connect Mediterranean Diet with Heart-Healthy Nutrition, Low-Sodium Diet, diabetes nutrition, and cardiovascular prevention."]
      ],
      relatedTopics: ["Heart-Healthy Nutrition", "Low-Sodium Diet", "Consistent-Carbohydrate / Diabetes Nutrition"],
      clinicalConnections: [
        { topic: "Heart-Healthy Nutrition", explanation: "Mediterranean-style eating is one practical heart-healthy pattern because it favors fiber-rich plant foods and unsaturated fats; it is an option rather than a mandatory or curative menu." },
        { topic: "Low-Sodium Diet", explanation: "A Mediterranean pattern can be prepared with less sodium, but olives, cheese, cured foods, and restaurant meals may still be salty, so a prescribed sodium target needs separate label and portion planning." },
        { topic: "Consistent-Carbohydrate / Diabetes Nutrition", explanation: "Whole grains, legumes, vegetables, and minimally processed foods can support metabolic goals, while carbohydrate amount, meal timing, and medicines must still be coordinated for the individual with diabetes." }
      ],
      tags: ["Mediterranean", "plant forward", "olive oil", "legumes", "fish", "cardiovascular prevention"],
      sourceKeys: ["w45-aha-mediterranean", "w45-aha-heart-diet"]
    }),
    therapeutic({
      name: "Consistent-Carbohydrate / Diabetes Nutrition",
      nclexEssential: true,
      aliases: ["diabetic diet", "diabetes diet", "consistent carbohydrate", "consistent-carbohydrate diet", "carb controlled diet", "carbohydrate-controlled diet", "calculated carbohydrate diet", "diabetes meal plan"],
      summary: "Diabetes nutrition coordinates carbohydrate amount and quality, meal timing, medicines, activity, and the person's metabolic and nutrition goals. A consistent-carbohydrate plan delivers a reasonably predictable carbohydrate amount at corresponding meals; it is one useful strategy, especially with fixed mealtime insulin, not a universal diet for every person with diabetes.",
      quickAnswer: "No single 'diabetic diet' fits everyone. Use an individualized plan rich in nonstarchy vegetables, whole fruit, legumes, whole grains, nuts and seeds, lean proteins, and minimally processed foods. ADA anchors include at least 14 g fiber per 1,000 kcal and, when appropriate, sodium below 2,300 mg/day. Match prandial insulin to actual carbohydrate delivery and respond safely to delayed or missed meals.",
      whyItMatters: "A consistent-carbohydrate plan is used when diabetes treatment benefits from predictable carbohydrate delivery, especially with fixed mealtime insulin or insulin-secretagogue therapy and in structured inpatient meals. Coordinating carbohydrate amount and timing with medication helps reduce severe glucose swings and hypoglycemia from a delayed, missed, or smaller meal; it is not a universal diet, and carbohydrate-ratio therapy, pregnancy, CKD, gastroparesis, nutrition status, and patient goals can require a different approach.",
      sections: [
        ["Carbohydrate relationship", "Carbohydrate has the most direct meal-related glucose effect, but protein, fat, fiber, gastric emptying, illness, activity, and medicines alter timing and magnitude. Consistency means predictable amounts and timing when the treatment plan needs predictability; it does not mean zero carbohydrate."],
        ["Meal planning", "Use plate, carbohydrate-counting, exchange, or other culturally acceptable methods chosen with the patient and dietitian. Favor nutrient-dense carbohydrates and pair them with protein, healthy fat, or fiber when appropriate. The goal may be stable intake, weight change, cardiovascular risk reduction, kidney protection, or prevention of malnutrition."],
        ["Objective anchors", "ADA recommends fiber of at least 14 g per 1,000 kcal and sodium below 2,300 mg/day when appropriate. These are population anchors, not a prescription that overrides gastroparesis, CKD, hyperkalemia, low intake, pregnancy, pediatrics, or a clinician-directed plan."],
        ["Medication and meal safety", "Verify glucose, appetite, tray delivery, carbohydrate amount, nausea, NPO status, and timing of prandial insulin or insulin-secretagogue medicines. If a meal is delayed, refused, interrupted, or substantially different from the ordered plan, follow the medication and hypoglycemia protocol rather than giving a fixed dose blindly."],
        ["Hypoglycemia", "Sweating, tremor, hunger, confusion, behavior change, weakness, seizure, or reduced consciousness requires prompt glucose assessment and protocol-directed treatment. Never force oral carbohydrate when swallowing or consciousness is unsafe; use the ordered nonoral rescue pathway."],
        ["Nursing monitoring and teaching", "Trend glucose pattern rather than judging one value, document percentage and carbohydrate consumed when relevant, coordinate tests and procedures with nutrition and insulin, and teach label reading and sick-day or hypoglycemia plans. Respect food culture and access."],
        ["NCLEX distinctions", "'Diabetic diet' is legacy shorthand, not a standardized prescription. Consistent carbohydrate helps coordinate fixed therapy, but patients using carbohydrate-to-insulin ratios may intentionally vary intake. Nutrition and medication timing must be planned together."],
        ["Connected topics", "Connect diabetes nutrition with Type 1 diabetes mellitus, Type 2 diabetes mellitus, hypoglycemia, insulin therapy, gastroparesis, CKD, NPO, enteral nutrition, and PN."]
      ],
      relatedTopics: ["Type 1 diabetes mellitus", "Type 2 diabetes mellitus", "Hypoglycemia", "NPO — Nothing by Mouth", "Enteral Nutrition / Tube Feeding", "Parenteral Nutrition (PN/TPN)"],
      clinicalConnections: [
        { topic: "Type 1 diabetes mellitus", explanation: "Meal carbohydrate must be coordinated with prandial insulin to prevent marked hyperglycemia or hypoglycemia; people using carbohydrate-to-insulin ratios may vary intake rather than follow fixed carbohydrate amounts." },
        { topic: "Type 2 diabetes mellitus", explanation: "Carbohydrate quality, portions, and timing can support glucose and cardiovascular goals, but the plan changes with medicines, weight or nutrition goals, kidney function, and food access." },
        { topic: "Hypoglycemia", explanation: "A delayed, refused, or smaller meal after insulin or an insulin secretagogue can cause hypoglycemia, so nurses coordinate tray delivery, actual intake, glucose, and medication instead of relying on a diet label alone." },
        { topic: "NPO — Nothing by Mouth", explanation: "Stopping oral carbohydrate changes the safety of insulin and other glucose-lowering medicines; NPO requires an explicit glucose-monitoring, medication, and alternate-nutrition plan rather than automatic dose assumptions." },
        { topic: "Enteral Nutrition / Tube Feeding", explanation: "When enteral formulas deliver carbohydrate continuously or intermittently, insulin timing must match the feeding schedule and an interruption plan is needed to reduce hypoglycemia risk." },
        { topic: "Parenteral Nutrition (PN/TPN)", explanation: "PN delivers intravenous dextrose that can raise glucose and may require scheduled monitoring and insulin; abrupt interruption can also change glucose delivery, so the institution's plan controls." }
      ],
      tags: ["diabetes nutrition", "consistent carbohydrate", "carbohydrate counting", "fiber", "prandial insulin", "hypoglycemia"],
      sourceKeys: ["w45-ada-nutrition-2026", "w45-ada-hospital-2026"]
    })
  );

  entries.push(
    therapeutic({
      name: "NPO — Nothing by Mouth",
      nclexEssential: true,
      aliases: ["NPO", "nothing by mouth", "nil per os", "no oral intake", "NPO order"],
      abbreviations: ["NPO"],
      summary: "NPO—nil per os, or nothing by mouth—is an order to withhold oral intake for a defined clinical reason such as anesthesia preparation, unsafe swallowing, GI obstruction or bleeding, or a procedure. The exact order determines what is withheld; NPO alone does not automatically answer whether oral medicines, sips, ice chips, gum, tube feeds, tube medicines, or oral care are permitted.",
      quickAnswer: "Verify the indication, start and stop time, what counts, medication and alternate-route plan, glucose and IV-fluid needs, and restart criteria. Do not independently give or withhold time-critical medication based only on the letters NPO. Provide safe oral care and explain the reason and expected reassessment.",
      whyItMatters: "NPO is used temporarily when eating or drinking could increase aspiration, anesthesia, procedure, bleeding, obstruction, or diagnostic risk. Withholding oral intake protects the airway or gastrointestinal plan while the underlying risk is assessed or treated, but NPO does not by itself define medication, ice, water, tube-feeding, or oral-care instructions and can cause dehydration, hypoglycemia, and malnutrition if continued without reassessment and alternate support.",
      sections: [
        ["Meaning and common reasons", "NPO protects a patient when oral intake could increase aspiration, procedural, surgical, bleeding, obstruction, or diagnostic risk. The order should be tied to a reason and reassessment plan rather than continued by habit."],
        ["What the order includes", "Clarify food, clear liquids, water, ice chips, gum, candy, oral medicines, enteral formula, tube water and medicine, and oral-care products. Different orders and protocols define these differently; do not infer permission from a generic fasting handout."],
        ["Medication safety", "Reconcile every scheduled and time-critical medicine with the prescriber, anesthesia/procedure team, pharmacist, and protocol. Some oral medicines may be given with a permitted sip, some held, and others changed to a nonoral route. Crushing, tube delivery, and liquid formulations require independent formulation and route checks."],
        ["Procedural timing", "For healthy patients undergoing elective anesthesia, ASA anchors commonly allow clear liquids until 2 hours, breast milk until 4 hours, infant formula, nonhuman milk, or a light meal until 6 hours, and longer fasting such as 8 hours after fatty or fried food or meat. These times do not override the patient's order and do not automatically apply to emergency care, dysphagia, obstruction, delayed gastric emptying, pregnancy, or other aspiration-risk states."],
        ["Nursing care", "Post and hand off status, remove unintended food or drink, prevent family-brought intake, provide aspiration-aware oral care, monitor hydration and glucose, review IV fluid and insulin or secretagogue plans, and document any intake or order clarification. Ask daily whether NPO remains necessary."],
        ["Escalation", "Report unintended intake before a procedure, hypoglycemia, dehydration, hypotension, oliguria, worsening obstruction signs, inability to manage secretions, aspiration, or prolonged NPO without a nutrition plan. Do not restart intake until the responsible team establishes safety."],
        ["NCLEX distinctions", "NPO does not mean 'no care' and does not automatically mean no oral medicine or no oral hygiene. A post-stroke patient remains NPO until the validated swallowing process establishes safety, including for water and oral medication."],
        ["Connected topics", "Connect NPO with aspiration prevention, Dysphagia, post-stroke dysphagia screening, anesthesia fasting, bowel obstruction, enteral nutrition, parenteral nutrition, and diabetes medication timing."]
      ],
      relatedTopics: ["Aspiration prevention", "Dysphagia", "Post-stroke dysphagia screening", "Bowel obstruction", "Enteral Nutrition / Tube Feeding", "Parenteral Nutrition (PN/TPN)", "Consistent-Carbohydrate / Diabetes Nutrition"],
      clinicalConnections: [
        { topic: "Aspiration prevention", explanation: "Oral intake may be withheld when alertness, airway protection, or a procedure makes aspiration risk unacceptable, but NPO does not eliminate aspiration from saliva or reflux and does not replace oral care." },
        { topic: "Dysphagia", explanation: "NPO can protect a patient with suspected unsafe swallowing until comprehensive assessment establishes a safe route, texture, liquid, and medication plan; dysphagia does not automatically mean permanent NPO." },
        { topic: "Post-stroke dysphagia screening", explanation: "After acute stroke, food, fluid, and oral medication are withheld until the validated screening pathway establishes safety or triggers specialist assessment; the screen identifies risk rather than diagnosing the exact impairment." },
        { topic: "Bowel obstruction", explanation: "NPO may reduce oral loading while obstruction is evaluated and treated, but it does not relieve ischemia, strangulation, perforation, or the mechanical blockage by itself." },
        { topic: "Enteral Nutrition / Tube Feeding", explanation: "When swallowing is unsafe but the GI tract is usable, enteral nutrition can meet needs through a prescribed tube route; an NPO order does not automatically mean tube feeding or tube medicines must stop." },
        { topic: "Parenteral Nutrition (PN/TPN)", explanation: "PN may be considered when a prolonged inability to use oral or enteral routes prevents adequate nutrition, but brief NPO status alone is not an indication for central-line nutrition." },
        { topic: "Consistent-Carbohydrate / Diabetes Nutrition", explanation: "Removing oral carbohydrate changes insulin and secretagogue safety, so NPO requires glucose monitoring and an explicit medicine, IV-fluid, and nutrition plan rather than automatic continuation or withholding." }
      ],
      tags: ["NPO", "nil per os", "nothing by mouth", "medication safety", "oral care", "procedure fasting"],
      sourceKeys: ["w45-asa-fasting", "w45-asha-swallow-screening", "w45-aha-stroke-screen", "w45-cdc-oral-care-pneumonia"]
    }),
    therapeutic({
      name: "Enteral Nutrition / Tube Feeding",
      nclexEssential: true,
      aliases: ["enteral nutrition", "tube feeding", "enteral feeding", "enteral feeding formula", "feeding tube nutrition", "tube feed", "NG feeding", "gastrostomy feeding", "jejunostomy feeding"],
      abbreviations: ["EN"],
      summary: "Enteral nutrition delivers formula through the gastrointestinal tract when oral intake is inadequate or unsafe but the stomach or intestine is functional and accessible. Routes include nasogastric or orogastric, gastrostomy, and postpyloric or jejunal access; route and access duration are not interchangeable.",
      quickAnswer: "Verify the patient, formula, route, access, tube position according to device and facility policy, rate, water plan, and compatibility before use. Keep the prescribed positioning, monitor tolerance and glucose/electrolytes, protect connections, and remember that a feeding tube does not eliminate aspiration because saliva or refluxed gastric contents can still enter the airway.",
      whyItMatters: "Enteral nutrition is used when oral intake is unsafe or cannot meet needs but the stomach or intestine is functional and accessible—commonly with dysphagia, neurologic illness, critical illness, or prolonged poor intake. Delivering formula through the GI tract supplies energy, protein, fluid, and micronutrients while avoiding some catheter risks of PN, but route, aspiration risk, hemodynamic stability, obstruction or ischemia, refeeding risk, and goals of care determine whether and how it is appropriate.",
      sections: [
        ["Indications and routes", "EN is considered when intake is inadequate or swallowing is unsafe and the GI tract can be used. Gastric access may be nasal/oral or through a gastrostomy; postpyloric access reaches duodenum or jejunum. Short- and long-term choices depend on prognosis, anatomy, aspiration risk, goals, and informed consent."],
        ["Before starting or using", "Confirm the complete order and route, assess abdomen and hemodynamic stability, identify refeeding risk, and verify initial and ongoing tube position with the approved device-specific method. Do not use air insufflation and auscultation as the sole proof of placement."],
        ["Administration and aspiration safety", "Use the prescribed continuous, cyclic, or bolus schedule and positioning. For many adults receiving gastric feeding, keep the head of bed 30-45 degrees when not contraindicated and when consistent with the order and protocol; positioning remains individualized for spinal, hemodynamic, skin, developmental, and airway needs. Assess alertness, vomiting, reflux, abdominal distention, respiratory change, and external tube length or markings. Stop the feeding and escalate for suspected displacement, acute respiratory distress, repeated vomiting, severe distention, ischemia, or intolerance according to protocol."],
        ["Monitoring", "Track delivered versus prescribed volume, weight, hydration, intake/output, stool pattern, skin and tube site, glucose, sodium, potassium, magnesium, phosphorus, kidney function, and signs of refeeding or infection according to risk. Gastric residual practice is protocol- and population-specific and should not be used as one universal stop number."],
        ["Medication safety", "Ask pharmacy whether a medicine is suitable for the tube and site. Do not crush extended-release, enteric-coated, hazardous, or otherwise unsuitable products; give medicines separately rather than mixing them into formula and use the ordered flush plan while accounting for fluid restriction."],
        ["Complications", "Risks include aspiration, displacement, clogging, misconnections, nasal or stomal injury, contamination, diarrhea or constipation, nausea, vomiting, electrolyte and glucose disturbance, refeeding syndrome, and inadequate or excessive delivery."],
        ["NCLEX distinctions", "Use the gut when it is functional and safe to access, but EN is a treatment with device and metabolic risks. A tube supports nutrition; it does not make the airway aspiration-proof and does not replace oral care."],
        ["Connected topics", "Connect EN with Dysphagia, Aspiration prevention, Safe Feeding, NPO, refeeding syndrome, diabetes nutrition, and parenteral nutrition."]
      ],
      relatedTopics: ["Dysphagia", "Aspiration prevention", "Safe Feeding and Mealtime Assistance", "NPO — Nothing by Mouth", "Refeeding syndrome", "Parenteral Nutrition (PN/TPN)"],
      clinicalConnections: [
        { topic: "Dysphagia", explanation: "A feeding tube can provide nutrition when swallowing is unsafe or inadequate while rehabilitation and goals are assessed; it does not treat the swallowing disorder or automatically prevent aspiration." },
        { topic: "Aspiration prevention", explanation: "Positioning, tube-position checks, secretion and reflux assessment, and tolerance monitoring reduce avoidable risk, but saliva or refluxed contents can still be aspirated despite a feeding tube." },
        { topic: "Safe Feeding and Mealtime Assistance", explanation: "Some patients receive both tube nutrition and carefully prescribed oral intake, so mealtime assistance must follow the current route and swallowing plan rather than assuming tube access means permanent NPO." },
        { topic: "NPO — Nothing by Mouth", explanation: "Enteral feeding may support a patient who cannot safely take anything orally, but whether formula, water flushes, or tube medicines continue depends on the exact NPO indication and order." },
        { topic: "Refeeding syndrome", explanation: "Starting carbohydrate-containing formula in a severely malnourished patient can trigger dangerous phosphorus, potassium, magnesium, fluid, and thiamine-related shifts, so risk-based initiation and monitoring are required." },
        { topic: "Parenteral Nutrition (PN/TPN)", explanation: "Enteral nutrition is generally used when the GI tract is functional and safely accessible; PN is reserved for situations in which oral and enteral routes are inadequate, unsafe, inaccessible, or nonfunctional." }
      ],
      tags: ["enteral nutrition", "tube feeding", "feeding tube", "aspiration", "placement", "refeeding"],
      sourceKeys: ["w45-aspen-en-safe", "w45-nice-nutrition-support", "w45-asha-adult-dysphagia"]
    }),
    therapeutic({
      name: "Parenteral Nutrition (PN/TPN)",
      nclexEssential: true,
      aliases: ["parenteral nutrition", "total parenteral nutrition", "TPN", "PN", "intravenous nutrition", "IV nutrition"],
      abbreviations: ["PN", "TPN"],
      summary: "Parenteral nutrition supplies amino acids, dextrose, lipids, electrolytes, vitamins, minerals, and fluid intravenously when oral and enteral routes are inadequate, unsafe, inaccessible, or the gastrointestinal tract is nonfunctional. Central PN can deliver more concentrated solutions; peripheral PN has osmolarity and duration limitations.",
      quickAnswer: "PN is high-alert nutrition therapy, not simply an IV bag. Verify the formulation, patient, access and lumen, rate, tubing/filter policy, compatibility, glucose plan, and daily laboratory and fluid goals. Major risks include central-line bloodstream infection, thrombosis, glucose and electrolyte disturbance, refeeding syndrome, fluid imbalance, hypertriglyceridemia, and liver complications.",
      whyItMatters: "Parenteral nutrition is used when oral and enteral routes cannot safely or adequately meet needs because the GI tract is inaccessible, nonfunctional, or severely intolerant—for example in selected obstruction, ischemia, severe malabsorption, or high-output fistula. It supplies nutrients directly into the bloodstream and can prevent progressive undernutrition, but central-line infection, thrombosis, glucose, electrolyte, fluid, triglyceride, and liver risks make daily reassessment and transition toward the gut important whenever feasible.",
      sections: [
        ["Indications and route", "Use PN when needs cannot be met safely through the GI tract, such as selected obstruction, ischemia, severe malabsorption, high-output fistula, or prolonged intolerance. The team should reassess daily whether oral or enteral nutrition can begin or advance."],
        ["Safe administration", "Use standardized prescribing and independent checks, confirm central versus peripheral access and dedicated-lumen policy, trace the line from bag to patient, use the ordered pump and filter, protect asepsis, and avoid unreviewed admixtures or piggyback compatibility."],
        ["Monitoring", "Trend glucose, potassium, magnesium, phosphorus, sodium, fluid balance, weight, kidney and hepatic function, triglycerides, acid-base status, temperature and line site, and actual energy/protein delivery. Monitoring frequency depends on stability and risk."],
        ["Refeeding safety", "Malnourished patients can develop dangerous intracellular shifts after nutrition starts, especially falling phosphorus, potassium, and magnesium with fluid and thiamine-related complications. Identify risk before initiation, start and advance as prescribed, supplement as ordered, and monitor closely."],
        ["Interruption and glucose", "An unexpected PN interruption can alter glucose delivery, particularly in patients receiving insulin. Do not improvise a replacement fluid or rate; follow the institution's interruption and hypoglycemia plan and notify pharmacy and the responsible clinician."],
        ["Complications and escalation", "Escalate fever or rigors, line redness/drainage, occlusion, swelling or pain suggesting thrombosis, severe hyper- or hypoglycemia, electrolyte decline, fluid overload, respiratory distress, hypertriglyceridemia, or worsening liver tests. Never use the PN line for incompatible medication merely because access is convenient."],
        ["NCLEX distinctions", "Enteral is preferred when the GI tract is functional and safely accessible; PN bypasses the gut and adds catheter and metabolic risk. TPN is common terminology for complete PN but does not create a separate clinical identity."],
        ["Connected topics", "Connect PN with NPO, enteral nutrition, refeeding syndrome, central venous access, bloodstream infection prevention, glucose monitoring, and electrolyte replacement."]
      ],
      relatedTopics: ["NPO — Nothing by Mouth", "Enteral Nutrition / Tube Feeding", "Refeeding syndrome", "Central venous catheter", "Bedside capillary glucose testing", "Hypophosphatemia"],
      clinicalConnections: [
        { topic: "NPO — Nothing by Mouth", explanation: "Prolonged inability to use oral intake may contribute to a PN indication, but short NPO intervals do not automatically justify PN and the expected duration and GI function must be assessed." },
        { topic: "Enteral Nutrition / Tube Feeding", explanation: "Enteral nutrition is preferred when the GI tract is functional and safely accessible; PN is used when that route remains inadequate, unsafe, inaccessible, or nonfunctional and should be reduced as enteral intake becomes adequate." },
        { topic: "Refeeding syndrome", explanation: "Dextrose and calories in PN can trigger intracellular electrolyte shifts in a severely malnourished patient, so risk identification, cautious advancement, thiamine, and phosphorus, potassium, magnesium, glucose, and fluid monitoring follow the prescribed pathway." },
        { topic: "Central venous catheter", explanation: "Concentrated PN commonly requires central venous access, which enables delivery but creates bloodstream-infection, thrombosis, occlusion, and line-placement risks requiring dedicated aseptic care." },
        { topic: "Bedside capillary glucose testing", explanation: "PN dextrose can cause hyperglycemia and insulin may be part of the plan; scheduled glucose checks and an interruption protocol help detect both high and low glucose, with frequency based on stability." },
        { topic: "Hypophosphatemia", explanation: "A falling phosphorus level can be a key sign of refeeding-related intracellular shift and can impair muscle, respiratory, and cardiac function, but interpretation and replacement must include the complete electrolyte and clinical picture." }
      ],
      tags: ["parenteral nutrition", "TPN", "central line", "glucose", "electrolytes", "refeeding syndrome"],
      sourceKeys: ["w45-aspen-pn-overview", "w45-aspen-pn-safe", "w45-nice-nutrition-support"]
    })
  );

  entries.push(
    swallowing({
      name: "Food Texture Modification and IDDSI",
      nclexEssential: true,
      aliases: ["food texture modification", "modified texture diet", "dysphagia food textures", "IDDSI food levels", "texture modified food", "swallowing diet textures"],
      abbreviations: ["IDDSI"],
      summary: "Food texture modification changes particle size, softness, moisture, cohesiveness, and chewing demands to match an individual's swallowing and oral-processing ability. IDDSI standardizes food levels 3-7, but it classifies physical properties; it does not independently prescribe the safest level.",
      quickAnswer: "The prescribing team and speech-language pathologist use comprehensive assessment, and sometimes VFSS or FEES, to select texture and strategies. Staff then prepare and test the food at serving temperature using IDDSI methods. A softer or more puréed diet is not automatically safer, and a patient can require a food level different from the drink level.",
      sections: [
        ["IDDSI food levels", "Adult food levels include Level 7 Regular, Level 7 Easy to Chew, Level 6 Soft & Bite-Sized, Level 5 Minced & Moist, Level 4 Puréed, and Level 3 Liquidised. Transitional foods are recognized by IDDSI but are not a substitute for the prescribed level."],
        ["Selection", "Consider chewing, dentition, tongue control, sensation, pharyngeal clearance, airway protection, fatigue, cognition, self-feeding, positioning, nutrition, hydration, culture, preferences, and quality of life. Nurses implement and monitor the plan; they do not independently choose a consistency from diagnosis alone."],
        ["Testing", "Use the relevant Fork Pressure, Fork Drip, Spoon Tilt, particle-size, or other IDDSI test with the actual food under intended serving conditions. Texture can change with temperature, standing time, liquid separation, recipe, and manufacturer."],
        ["Nursing responsibilities", "Confirm the current order, meal tray, food level, drink level, positioning, supervision and pacing; inspect mixed consistencies, garnish, crust, skins, bones, seeds and thin-liquid separation; document intake and tolerance; and escalate a mismatch before feeding."],
        ["Safety", "Stop oral intake and assess for choking, inability to manage secretions, repeated cough or throat clearing, wet/gurgly voice, respiratory change, reduced alertness, or significant pocketing. Silent aspiration can occur without cough."],
        ["NCLEX distinctions", "Aphasia is a language disorder and does not by itself require texture modification. Dysphagia is a swallowing disorder. A stroke patient can have aphasia, dysphagia, both, or neither."],
        ["Connected topics", "Connect the overview with Dysphagia, Aspiration prevention, Safe Feeding and Mealtime Assistance, each IDDSI food level, and Liquid Consistency and Thickened Liquids."]
      ],
      relatedTopics: ["Dysphagia", "Aspiration prevention", "Safe Feeding and Mealtime Assistance", "Liquid Consistency and Thickened Liquids", "IDDSI Level 4 — Puréed"],
      tags: ["IDDSI", "food texture", "dysphagia", "aspiration", "fork pressure", "spoon tilt"],
      sourceKeys: ["w45-iddsi-framework-v2", "w45-iddsi-testing-v2", "w45-asha-adult-dysphagia"]
    }),
    swallowing({
      name: "Liquid Consistency and Thickened Liquids",
      nclexEssential: true,
      aliases: ["thick liquids", "thickened liquids", "nectar thick", "honey thick", "pudding thick", "liquid consistency", "IDDSI drink levels", "dysphagia liquids"],
      abbreviations: [],
      summary: "Liquid consistency describes how quickly a drink flows. IDDSI standardizes drinks as Level 0 Thin, Level 1 Slightly Thick, Level 2 Mildly Thick, Level 3 Moderately Thick, and Level 4 Extremely Thick. The safest level depends on the person's swallowing physiology, assessment, hydration, medication needs, and goals—not the assumption that thicker is always safer.",
      quickAnswer: "Use the exact IDDSI name, number, recipe or product, and test method. Older terms nectar thick, honey thick, and pudding thick varied across products and settings and do not have a universally exact one-to-one mapping to current IDDSI levels. Clarify a legacy order rather than guessing the level.",
      sections: [
        ["Why flow is changed", "Slower flow can give selected patients more time for airway closure or bolus control, while excessive viscosity can increase residue, effort, poor intake, or silent aspiration for other physiology. A comprehensive swallow evaluation tests the tradeoff."],
        ["IDDSI levels and testing", "The IDDSI Flow Test uses a specified 10 mL syringe and a 10-second flow interval for Levels 0-3; Level 4 uses spoon and fork behavior rather than a flow endpoint. Syringe geometry, temperature, preparation and standing time matter."],
        ["Legacy terminology", "Nectar, honey, pudding, thick liquids, and thickened liquids remain useful search and handoff terms, but older labels were not globally standardized. They belong to this overview for clarification and should not be exact aliases of a guessed IDDSI level."],
        ["Hydration and medication", "Monitor actual fluid intake, thirst, urine, constipation, sodium and kidney context, acceptance, and signs of dehydration. Thickening or crushing can alter medicine delivery; involve pharmacy and the swallowing team rather than mixing medicines into thickener automatically."],
        ["Nursing responsibilities", "Verify the current level at every transition, prepare exactly, test at serving temperature, avoid unapproved dilution or ice, check pre-thickened products, and teach patient and family how to reproduce the plan. A straw, cup, posture, or sip size is used only when included in the individualized plan."],
        ["NCLEX distinctions", "Thicker liquids are not automatically safer and do not eliminate aspiration pneumonia. Nurses do not independently escalate thickness because the patient coughs; stop, assess, and obtain plan-specific reassessment."],
        ["Connected topics", "Connect the overview with each IDDSI drink level, Dysphagia, Aspiration prevention, Food Texture Modification and IDDSI, oral care, and medication administration."]
      ],
      relatedTopics: ["Dysphagia", "Aspiration prevention", "Food Texture Modification and IDDSI", "IDDSI Level 0 — Thin", "IDDSI Level 4 — Extremely Thick"],
      tags: ["IDDSI", "thickened liquids", "nectar thick", "honey thick", "pudding thick", "flow test", "hydration"],
      sourceKeys: ["w45-iddsi-framework-v2", "w45-iddsi-testing-v2", "w45-iddsi-framework-development", "w45-asha-adult-dysphagia"]
    }),
    swallowing({
      name: "Safe Feeding and Mealtime Assistance",
      nclexEssential: true,
      aliases: ["safe feeding", "feeding assistance", "mealtime assistance", "swallow safety", "supervised feeding", "dysphagia feeding"],
      summary: "Safe feeding and mealtime assistance means helping a person eat or drink according to the individualized route, texture, liquid, posture, pace, cueing, equipment, and supervision plan while preserving dignity and adequate intake. Assistance is active assessment, not merely placing a tray within reach.",
      quickAnswer: "Before feeding, confirm identity and order, alertness, breathing, secretion control, posture, dentures or oral condition, texture and liquid level, medication timing, and needed assistance. During the meal, use prescribed bite/sip size and pace, observe swallowing and pocketing, and stop for choking, wet/gurgly voice, repeated cough or throat clearing, respiratory change, reduced alertness, or inability to manage secretions.",
      sections: [
        ["Preparation", "Reduce distractions, provide hand hygiene and oral care as needed, sit the patient in the prescribed stable position, ensure needed glasses, hearing aids, dentures and adaptive equipment, and check that the tray exactly matches both food and drink orders."],
        ["Assistance", "Offer only the prescribed amount and pace, allow time to chew and swallow, alternate food and drink only if the plan permits, cue or assist without rushing, check the mouth for residue, and maintain the prescribed post-meal position. Do not use straws or chin-tuck/head-turn maneuvers unless specified."],
        ["Monitoring", "Observe cough, throat clearing, voice quality, drooling, chewing, multiple swallows, fatigue, breathing-swallow coordination, oxygen or respiratory change, meal duration and completion, pain, and enjoyment. Document what was consumed and which signs occurred."],
        ["When to stop", "Stop feeding immediately for airway obstruction, choking, wet/gurgly voice with concern, persistent cough, inability to clear residue or secretions, vomiting, new respiratory distress, oxygen decline, or reduced consciousness; position and activate the appropriate airway/emergency response and notify the team."],
        ["Oral care and education", "Provide regular oral care because aspirated oral bacteria contribute to pneumonia risk. Teach family the exact plan and ask them not to bring unapproved food, change thickness, or feed a drowsy patient."],
        ["NCLEX distinctions", "Small bites and sips are common but not universal; use the evaluated plan. Absence of coughing does not prove safety, and a feeding tube does not eliminate aspiration."],
        ["Connected topics", "Connect Safe Feeding with Dysphagia, Aspiration prevention, IDDSI food and drink levels, oral care, and enteral nutrition."]
      ],
      relatedTopics: ["Dysphagia", "Aspiration prevention", "Food Texture Modification and IDDSI", "Liquid Consistency and Thickened Liquids", "Enteral Nutrition / Tube Feeding"],
      tags: ["feeding assistance", "meal supervision", "stop feeding", "oral care", "dysphagia", "aspiration"],
      sourceKeys: ["w45-asha-adult-dysphagia", "w45-cdc-oral-care-pneumonia", "w45-iddsi-framework-v2"]
    })
  );


  entries.push(
    therapeutic({
      name: "Clear Liquid Diet",
      nclexEssential: true,
      aliases: ["clear liquid", "clear liquids", "clear liquid diet", "transparent liquid diet"],
      abbreviations: [],
      summary: "A clear liquid diet provides transparent liquids without pulp or solid particles and leaves little gastrointestinal residue. Gelatin and ice pops are included because they become liquid when consumed, but room-temperature melting alone is a broader full-liquid concept. The diet can support hydration and limited carbohydrate for short procedural, postoperative, or GI intervals, but it is nutritionally incomplete and is not the same as a dysphagia-safe liquid consistency.",
      quickAnswer: "Examples may include water, clear broth, pulp-free juice, plain gelatin, ice pops without milk or solids, and clear tea or coffee if permitted. The exact order may prohibit red, purple, blue, carbonated, caffeinated, or other items for a particular procedure. 'Clear' describes GI diet composition, not IDDSI thickness or airway safety.",
      whyItMatters: "A clear liquid diet is used for short, defined intervals such as selected bowel preparation, peri-procedure instructions, early postoperative progression, or recovery from acute nausea and vomiting. Transparent, low-residue liquids help provide some fluid and carbohydrate while minimizing solid material in the GI tract, but the diet is nutritionally incomplete, does not treat the underlying disorder, and is inappropriate as prolonged nutrition or as an assumed dysphagia-safe plan.",
      sections: [
        ["Clinical use", "Common uses include selected bowel preparation, short postoperative progression, acute nausea or vomiting recovery, or a temporary step when solids are not tolerated. Follow the procedure or condition-specific instructions rather than a generic list."],
        ["Included and excluded examples", "Permitted examples are transparent liquids without pulp or solid particles. Milk, cream, smoothies, opaque supplements, pudding, and soups containing solids are not clear liquids. Color and ingredient restrictions vary by procedure."],
        ["Nursing monitoring", "Assess hydration, glucose, nausea, vomiting, bowel status, intake, duration, and the planned next diet. People with diabetes may need medication and carbohydrate coordination, and prolonged use requires escalation because protein, fat, fiber, and micronutrients are inadequate."],
        ["Safety", "Do not assume a clear liquid is safe for dysphagia: water and broth are IDDSI Level 0 Thin unless appropriately tested or modified. Do not use a clear-liquid diet as a prolonged weight-loss or detox regimen."],
        ["NCLEX distinctions", "Clear liquid is narrower than full liquid and is generally a short transitional or procedural diet. It does not mean NPO, and it does not authorize intake when the patient has an NPO order."],
        ["Connected topics", "Connect Clear Liquid Diet with Full Liquid Diet, NPO, bowel preparation, postoperative nutrition, diabetes medication timing, and IDDSI Level 0 Thin."]
      ],
      relatedTopics: ["Full Liquid Diet", "NPO — Nothing by Mouth", "IDDSI Level 0 — Thin", "Consistent-Carbohydrate / Diabetes Nutrition"],
      clinicalConnections: [
        { topic: "Full Liquid Diet", explanation: "Full liquids add milk-based, strained, or smooth foods and may be the next temporary progression when GI or oral tolerance improves; progression follows the specific procedure, symptoms, and nutrition plan rather than a fixed schedule." },
        { topic: "NPO — Nothing by Mouth", explanation: "Clear liquids may be permitted during part of selected elective fasting pathways, but an active NPO order overrides a generic clear-liquid list and the procedure team's timing and ingredient rules control." },
        { topic: "IDDSI Level 0 — Thin", explanation: "Many clear liquids such as water or broth are Level 0 Thin, but 'clear' describes GI composition rather than flow; a patient with dysphagia may need a tested modified consistency instead." },
        { topic: "Consistent-Carbohydrate / Diabetes Nutrition", explanation: "Juice, gelatin, and sweetened beverages can deliver substantial carbohydrate, so glucose and medication plans must be coordinated during a clear-liquid interval; sugar-free choices are not automatically correct if carbohydrate is needed." }
      ],
      tags: ["clear liquids", "procedural diet", "short term", "nutritionally incomplete", "GI progression"],
      sourceKeys: ["w45-medlineplus-clear-liquid", "w45-asa-fasting", "w45-iddsi-framework-v2"]
    }),
    therapeutic({
      name: "Full Liquid Diet",
      nclexEssential: false,
      aliases: ["full liquid", "full liquids", "full liquid diet", "liquid at room temperature diet"],
      abbreviations: [],
      summary: "A full liquid diet includes clear liquids plus foods that are liquid or become liquid at room temperature, such as milk, strained cream soup, yogurt without pieces, pudding, custard, and prescribed nutrition drinks. It can bridge a short period when chewing or solids are limited, but it may not meet fiber or all nutrient needs without planning.",
      quickAnswer: "Full liquid is broader and generally more nourishing than clear liquid, but it is not automatically appropriate for dysphagia. Mixed viscosity, melting foods, thin milk, and supplements must still match the prescribed IDDSI level and swallowing plan.",
      whyItMatters: "A full liquid diet is used temporarily when a patient can swallow and digest liquids but cannot yet chew or tolerate solid foods, such as after selected oral or GI procedures or during short recovery. Its broader liquids can provide more energy and protein than clear liquids while reducing chewing and solid-food demands, but it may still be inadequate in fiber or micronutrients, is not automatically safe for dysphagia, and needs fortification or another route if prolonged intake cannot meet needs.",
      sections: [
        ["Clinical use", "It may be used temporarily after selected procedures, during oral or GI recovery, or when a patient cannot chew solids. The diagnosis, tolerance, nutrition needs, and expected duration determine whether it is appropriate."],
        ["Examples", "Possible items include milk, smooth yogurt, pudding, custard, strained soup, smooth hot cereal, ice cream, and liquid supplements. The exact institution list and restrictions determine whether seeds, pulp, pieces, or melting foods are allowed."],
        ["Monitoring", "Track intake, weight, hydration, stool pattern, glucose when relevant, GI tolerance, and duration. Dietitian review can fortify calories and protein and identify micronutrient or fiber gaps."],
        ["Safety", "A full-liquid order describes composition, not swallowing safety. Ice cream and gelatin melt toward thin liquid, and a smoothie can vary greatly in flow. Follow IDDSI testing and the individual swallowing recommendation when dysphagia exists."],
        ["Connected topics", "Connect Full Liquid Diet with Clear Liquid Diet, NPO, oral or GI surgery recovery, nutrition supplements, and IDDSI liquid consistency."]
      ],
      relatedTopics: ["Clear Liquid Diet", "NPO — Nothing by Mouth", "Liquid Consistency and Thickened Liquids"],
      clinicalConnections: [
        { topic: "Clear Liquid Diet", explanation: "Full liquids include clear liquids plus opaque or smooth foods and can serve as a later progression when clinically tolerated; a patient may instead advance differently based on the procedure and GI function." },
        { topic: "NPO — Nothing by Mouth", explanation: "A patient remains NPO until the responsible team authorizes intake, then full liquids may be one temporary option; the diet name does not itself cancel fasting, obstruction, or aspiration precautions." },
        { topic: "Liquid Consistency and Thickened Liquids", explanation: "Full-liquid composition does not define flow: milk, melted ice cream, pudding, and supplements have different consistencies, so dysphagia care requires the exact tested IDDSI plan rather than the full-liquid label." }
      ],
      tags: ["full liquids", "diet progression", "oral surgery", "nutrition supplement", "dysphagia distinction"],
      sourceKeys: ["w45-medlineplus-full-liquid", "w45-iddsi-framework-v2"]
    }),
    therapeutic({
      name: "Low-Fiber Nutrition",
      nclexEssential: false,
      aliases: ["low fiber diet", "low-fiber diet", "low residue diet", "low-residue diet"],
      searchTerms: ["GI soft low residue"],
      summary: "Low-fiber nutrition temporarily reduces poorly digested plant material and stool bulk for selected bowel flares, narrowing, obstruction-risk plans, or postoperative intervals. 'Low residue' is older, variably defined language and is not perfectly identical to a measured low-fiber prescription.",
      quickAnswer: "Use the indication, duration, and progression plan. Refined grains, tender proteins, and selected cooked or canned produce without skins or seeds may be used; whole grains, nuts, seeds, legumes, raw fibrous produce, and tough skins may be limited. Do not prescribe lifelong low fiber for every person with IBD or diverticular disease.",
      whyItMatters: "Low-fiber nutrition is used mainly as a temporary bowel-rest strategy during selected Crohn disease or ulcerative colitis flares, acute diverticulitis, postoperative bowel healing, or a clinician-directed stricture or obstruction-risk plan. Restricting poorly digested plant material reduces stool bulk and the mechanical workload passing through an inflamed, narrowed, or healing bowel; it does not treat inflammation, infection, ischemia, perforation, or obstruction itself, and fiber should be reassessed and usually advanced when the acute reason resolves unless a persistent narrowing requires a longer plan.",
      sections: [
        ["Why it is used", "Reducing fiber may reduce stool volume and mechanical workload during selected acute GI conditions or healing. Some patient instructions operationalize a low-fiber interval as about 10-15 g/day, but the current order and clinical indication control; 'low residue' remains variably defined. It does not treat infection, ischemia, perforation, or obstruction by itself."],
        ["Food examples", "Plans often favor white bread or rice, refined cereals, tender meats or eggs, smooth nut-free products if allowed, and cooked or canned produce without skins or seeds. Exact tolerated foods vary by diagnosis and institutional definition."],
        ["Nursing monitoring", "Assess pain, distention, nausea/vomiting, stool or ostomy output, hydration, intake, weight, fever, bleeding, and the reintroduction plan. Escalate obstruction or peritonitis signs rather than simply tightening the diet."],
        ["Safety", "Low residue is not a universal permanent diet and may reduce fiber, micronutrient variety, and stool regularity. High-fiber advice can also be unsafe in severe stricture or obstruction risk, so both directions require clinical context."],
        ["Connected topics", "Connect Low-Fiber Nutrition with bowel obstruction, selected Crohn disease or ulcerative colitis flares, diverticulitis, postoperative bowel care, and High-Fiber Nutrition."]
      ],
      relatedTopics: ["Bowel obstruction", "Crohn disease", "Ulcerative colitis", "Diverticulitis", "High-Fiber Nutrition"],
      clinicalConnections: [
        { topic: "Bowel obstruction", explanation: "Reducing bulky residue may be part of a clinician-directed plan for partial narrowing or after treatment, but suspected complete obstruction, ischemia, perforation, worsening pain, distention, or vomiting needs urgent medical or surgical management rather than tighter food restriction." },
        { topic: "Crohn disease", explanation: "Low fiber may temporarily reduce stool bulk and mechanical symptoms during a selected flare or when Crohn disease has a stricture, but it does not suppress inflammation and is not a lifelong diet for every person with Crohn disease." },
        { topic: "Ulcerative colitis", explanation: "A short low-fiber interval may reduce stool volume during a severe symptomatic flare when ordered, but it does not treat colonic inflammation and should not replace anti-inflammatory therapy or become a universal maintenance diet." },
        { topic: "Diverticulitis", explanation: "During acute diverticulitis, a clinician may temporarily reduce fiber and advance intake as pain and tolerance improve; this acute strategy is different from longer-term fiber advice used after recovery and is not appropriate for every presentation." },
        { topic: "High-Fiber Nutrition", explanation: "High fiber supports stool bulk and long-term bowel health when the gut is stable, whereas low fiber temporarily reduces bulk during selected acute or narrowing states; the transition depends on symptoms, anatomy, output, and the treatment plan." }
      ],
      tags: ["low fiber", "low residue", "GI diet", "stricture", "postoperative"],
      sourceKeys: ["w45-medlineplus-low-fiber"]
    }),
    therapeutic({
      name: "High-Fiber Nutrition",
      nclexEssential: false,
      aliases: ["high fiber diet", "high-fiber diet", "fiber rich diet", "increase dietary fiber"],
      summary: "High-fiber nutrition increases plant carbohydrates that are not fully digested, supporting stool bulk, bowel regularity, satiety, and cardiometabolic health in appropriate patients. It should be increased gradually and paired with fluid permitted by the patient's plan.",
      quickAnswer: "A useful NIDDK adult anchor is about 22-34 g fiber/day depending on age and sex. Increase gradually to reduce gas and bloating. Foods include beans, lentils, whole grains, vegetables, fruits, nuts, and seeds—but severe stricture, obstruction, acute intolerance, dysphagia texture limits, or renal electrolyte plans may require modification.",
      whyItMatters: "High-fiber nutrition is commonly used to prevent or manage constipation and to support cardiometabolic and long-term bowel-health goals when the GI tract is stable. Fiber adds stool bulk, holds water, and is fermented in ways that can support bowel regularity, satiety, glucose response, and lipid goals, but it should be increased gradually with only the fluid allowed by the care plan and may be inappropriate during obstruction, severe stricture, marked distention or vomiting, acute intolerance, or a prescribed low-fiber interval.",
      sections: [
        ["Types and effects", "Soluble and fermentable fibers can affect stool water and gut microbiota, while less fermentable insoluble fibers add bulk. Whole foods provide different mixtures; response varies by bowel disorder and medication."],
        ["Objective anchor", "Adults commonly need about 22-34 g/day by age and sex. Food labels list grams per serving; add portions across the day rather than judging a food by a 'whole grain' claim alone."],
        ["Teaching", "Increase over days to weeks, choose several food sources, maintain activity as allowed, and drink enough fluid for the person's medical plan. A patient on fluid restriction should not be told simply to 'drink lots of water.'"],
        ["Safety", "Do not escalate fiber during suspected obstruction, severe narrowing, marked distention, persistent vomiting, or a condition-specific low-fiber order. Some fiber-rich foods also contain substantial potassium or phosphorus and need renal adaptation."],
        ["Connected topics", "Connect High-Fiber Nutrition with constipation, diverticular disease prevention, diabetes nutrition, heart-healthy nutrition, Low-Fiber Nutrition, and Fluid Restriction."]
      ],
      relatedTopics: ["Constipation", "Low-Fiber Nutrition", "Consistent-Carbohydrate / Diabetes Nutrition", "Heart-Healthy Nutrition", "Fluid Restriction"],
      clinicalConnections: [
        { topic: "Constipation", explanation: "Fiber can increase and soften stool when bowel transit is intact, especially with gradual intake, permitted fluid, and activity; impaction, obstruction, severe pain, or vomiting requires assessment before adding bulk." },
        { topic: "Low-Fiber Nutrition", explanation: "Low fiber serves the opposite short-term goal of reducing stool bulk during selected inflammation, narrowing, or healing states; switching back to higher fiber follows clinical recovery and tolerance rather than a preset date." },
        { topic: "Consistent-Carbohydrate / Diabetes Nutrition", explanation: "Fiber-rich carbohydrate foods can slow post-meal glucose rise and improve diet quality, but their carbohydrate amount still counts and gastroparesis, medications, kidney disease, or GI symptoms may require modification." },
        { topic: "Heart-Healthy Nutrition", explanation: "Whole grains, legumes, vegetables, fruits, nuts, and seeds contribute fiber within a heart-healthy pattern and can support lipid and satiety goals; portions and nutrient restrictions remain individualized." },
        { topic: "Fluid Restriction", explanation: "Fiber works best with adequate permitted fluid, but a patient on a fluid allowance should not be told to drink without limit; the team balances stool goals against heart, kidney, sodium, and volume status." }
      ],
      tags: ["fiber", "22-34 g", "constipation", "whole grains", "legumes"],
      sourceKeys: ["w45-niddk-constipation-nutrition", "w45-ada-nutrition-2026"]
    }),
    therapeutic({
      name: "Gluten-Free Diet",
      nclexEssential: true,
      aliases: ["gluten free", "gluten-free diet", "celiac diet", "coeliac diet"],
      summary: "A gluten-free diet excludes gluten from wheat, barley, rye, triticale, and contaminated foods. It is lifelong treatment for confirmed celiac disease, where gluten triggers immune injury to the small intestine; it is not automatically healthier for people without a clinical indication.",
      quickAnswer: "For celiac disease, strict avoidance includes hidden ingredients, medicines or supplements when relevant, shared fryers, crumbs, utensils, and other cross-contact. In the United States, an FDA-labeled gluten-free food must contain less than 20 parts per million gluten. Complete diagnostic testing before starting the diet when possible because avoidance can make testing less informative.",
      whyItMatters: "A strict gluten-free diet is lifelong treatment for confirmed celiac disease because gluten exposure triggers immune injury to the small-intestinal lining, causing malabsorption even when symptoms are mild. Removing wheat, barley, rye, triticale, and cross-contact allows intestinal healing and helps prevent anemia, poor growth, and bone complications, but it should not be presented as universally healthier or started before diagnostic testing when celiac disease is still being evaluated.",
      sections: [
        ["What is excluded", "Avoid wheat and wheat varieties, barley, rye, triticale, and foods or products containing them unless specifically processed and labeled as gluten free. Oats should be verified gluten free because contamination is common, and individual tolerance or specialty advice can vary."],
        ["Why it matters", "Continued exposure in celiac disease can sustain villous injury, malabsorption, anemia, bone disease, poor growth, infertility, neurologic symptoms, and other complications even when symptoms seem mild."],
        ["Label and cross-contact teaching", "Read ingredient and allergen information, verify sauces, soups, seasoning, processed meats, supplements and medicines when relevant, and prevent cross-contact in toasters, cutting boards, colanders, fryers, spreads, and bulk bins."],
        ["Nutrition monitoring", "Assess iron, folate, vitamin B12, vitamin D, calcium, weight, growth when relevant, symptoms, and diet quality as ordered. Gluten-free packaged foods can be low in fiber and enriched nutrients or high in sugar and fat."],
        ["NCLEX distinctions", "Wheat allergy, celiac disease, and nonceliac gluten sensitivity are not interchangeable. 'Wheat free' can still contain barley or rye, and symptom improvement alone does not prove celiac disease."],
        ["Connected topics", "Connect Gluten-Free Diet strongly with Celiac disease, malabsorption, iron deficiency, osteoporosis risk, and label reading."]
      ],
      relatedTopics: ["Celiac disease", "Iron deficiency anemia", "Osteoporosis"],
      clinicalConnections: [
        { topic: "Celiac disease", explanation: "Gluten is the disease trigger, so strict lifelong avoidance is the core treatment after diagnosis; symptom improvement alone does not prove celiac disease, and testing is ideally completed before avoidance changes the results." },
        { topic: "Iron deficiency anemia", explanation: "Small-intestinal injury can reduce iron absorption and chronic GI loss or poor intake may contribute, so gluten avoidance supports healing while blood counts, iron studies, and clinician-directed replacement are monitored separately." },
        { topic: "Osteoporosis", explanation: "Celiac-related malabsorption can reduce calcium and vitamin D availability and harm bone health, so strict treatment, nutrient assessment, and bone evaluation when indicated work together rather than assuming the diet alone reverses established osteoporosis." }
      ],
      tags: ["celiac", "gluten", "wheat", "barley", "rye", "20 ppm", "cross contact"],
      sourceKeys: ["w45-niddk-celiac"]
    }),
    therapeutic({
      name: "Lactose-Reduced / Lactose-Free Diet",
      nclexEssential: false,
      aliases: ["lactose restricted diet", "lactose-free diet", "lactose free", "low lactose diet", "lactose intolerance diet"],
      summary: "Lactose-reduced or lactose-free nutrition lowers the milk sugar lactose to the amount an individual can tolerate. Many people with lactose intolerance can consume some lactose, especially with meals, yogurt, hard cheese, lactose-free dairy, or lactase products; complete dairy avoidance is not always necessary.",
      quickAnswer: "Lactose intolerance is reduced lactose digestion causing symptoms such as bloating, gas, pain, or diarrhea; it is not the same as milk-protein allergy. Preserve calcium, vitamin D, protein, and energy through tolerated dairy or fortified alternatives, and verify that plant beverages meet the patient's nutrient needs.",
      whyItMatters: "Lactose reduction is used when lactose intolerance causes bloating, gas, abdominal pain, or diarrhea after dairy. Lowering the dose of unabsorbed lactose reduces the water drawn into the bowel and the gas produced by bacterial fermentation, but restriction should match individual tolerance—many people can use smaller portions, yogurt, hard cheese, lactose-free dairy, or lactase—and it must not be mistaken for treatment of a milk-protein allergy.",
      sections: [
        ["Individual tolerance", "Symptoms depend on lactase activity, dose, food matrix, gut transit, and other GI disorders. NIDDK notes that many people tolerate about 12 g of lactose—the amount in roughly 1 cup (240 mL) of milk—with no or only mild symptoms, but this is an observation, not a required challenge dose. A patient may tolerate smaller portions, yogurt, or hard cheese even when a larger milk serving causes symptoms."],
        ["Practical options", "Use lactose-free milk, lactase-treated products or tablets when appropriate, smaller portions with meals, and tolerated yogurt or cheese. Read labels for milk solids, whey, and other ingredients when strict reduction is needed."],
        ["Nutrition monitoring", "Assess calcium, vitamin D, protein, energy, weight, symptoms, and dietary variety. Fortified soy or other alternatives vary in protein, sugar, potassium, phosphorus, and allergens."],
        ["Safety", "Do not label anaphylaxis, hives, wheeze, or angioedema as lactose intolerance; those can signal milk allergy and require an allergy safety plan. Lactose-free cow's milk still contains milk protein."],
        ["Connected topics", "Connect this diet with lactose intolerance, diarrhea, calcium and vitamin D, osteoporosis prevention, and food allergy distinctions."]
      ],
      relatedTopics: ["Diarrhea", "Vitamin D deficiency", "Osteoporosis"],
      clinicalConnections: [
        { topic: "Diarrhea", explanation: "Poorly absorbed lactose can retain water in the intestine and be fermented, producing diarrhea, gas, and cramping; persistent diarrhea needs evaluation for other causes rather than automatic lifelong lactose avoidance." },
        { topic: "Vitamin D deficiency", explanation: "Avoiding dairy without a replacement plan can reduce vitamin D intake, so tolerated dairy, fortified alternatives, laboratory assessment, or supplementation may be needed based on the patient's diet and risk." },
        { topic: "Osteoporosis", explanation: "Long-term loss of calcium- and vitamin-D-rich foods can undermine bone health, so the goal is symptom control while preserving these nutrients rather than unnecessary complete dairy exclusion." }
      ],
      tags: ["lactose", "lactase", "milk sugar", "calcium", "vitamin D", "milk allergy distinction"],
      sourceKeys: ["w45-niddk-lactose"]
    }),
    therapeutic({
      name: "Low-Fat Nutrition",
      nclexEssential: false,
      aliases: ["low fat diet", "low-fat diet", "fat restricted diet", "fat restriction"],
      summary: "Low-fat nutrition reduces total or selected fat for a defined indication while preserving essential fatty acids, fat-soluble vitamins, energy, and palatability. It may be used in selected pancreatitis, fat-malabsorption, severe hypertriglyceridemia, gallbladder, or other plans, but 'low fat' is not one universal gram cutoff.",
      quickAnswer: "For pancreatitis, NIDDK describes a clinician-directed healthy low-fat pattern with small frequent meals after intake is resumed and no alcohol. The actual amount and route depend on severity, tolerance, nutrition status, pancreatic function, triglycerides, and specialist guidance; prolonged underfeeding is harmful.",
      whyItMatters: "Low-fat nutrition is used for a defined reason when fat worsens symptoms or physiologic burden, such as selected pancreatitis, fat-malabsorption, severe hypertriglyceridemia, or pancreatobiliary plans. Reducing the relevant fat load or meal size can lessen steatorrhea and post-meal symptoms and may support triglyceride management, but the goal is not a fat-free diet; acute severity, enzyme therapy, enteral needs, essential fats, fat-soluble vitamins, energy intake, and malnutrition risk determine the amount and duration.",
      sections: [
        ["Clinical purpose", "Reducing fat can lessen symptoms or physiologic burden in selected fat-malabsorption, pancreatobiliary, or triglyceride-related conditions. The diagnosis determines whether total fat, saturated fat, long-chain triglyceride, or meal size is the relevant target."],
        ["Food pattern", "Favor lean proteins, low-fat dairy when tolerated, grains, fruits and vegetables appropriate to the GI plan, and smaller amounts of unsaturated fats. Fried foods, fatty meats, high-fat dairy, rich sauces, and large high-fat meals are common targets."],
        ["Monitoring", "Track pain, steatorrhea, nausea, meal tolerance, weight, intake, triglycerides when relevant, and signs of fat-soluble vitamin or essential-fatty-acid deficiency if restriction is prolonged."],
        ["Safety", "Do not teach fat-free eating, apply a chronic restriction to every acute pancreatitis patient, or delay appropriate enteral nutrition. A heart-healthy pattern focuses on replacing saturated fat with unsaturated fat, not eliminating all fat."],
        ["Connected topics", "Connect Low-Fat Nutrition with pancreatitis, hypertriglyceridemia, fat malabsorption, gallbladder disease, enteral nutrition, and Heart-Healthy Nutrition."]
      ],
      relatedTopics: ["Acute pancreatitis", "Chronic pancreatitis", "Enteral Nutrition / Tube Feeding", "Heart-Healthy Nutrition"],
      clinicalConnections: [
        { topic: "Acute pancreatitis", explanation: "A clinician-directed low-fat pattern may be used after oral intake resumes, but prolonged fasting is not a universal treatment and severity, pain, nausea, triglycerides, and tolerance determine the timing and route." },
        { topic: "Chronic pancreatitis", explanation: "Smaller lower-fat meals may reduce symptoms or steatorrhea for some patients, while pancreatic-enzyme therapy and adequate calories are often crucial; aggressive restriction can worsen weight loss and malnutrition." },
        { topic: "Enteral Nutrition / Tube Feeding", explanation: "When oral intake cannot meet needs, enteral nutrition may provide a controlled formula and route, but formula composition and delivery are selected from GI function, tolerance, and specialist assessment rather than the label 'low fat' alone." },
        { topic: "Heart-Healthy Nutrition", explanation: "Cardiovascular nutrition usually replaces saturated fat with unsaturated fat instead of eliminating all fat, so its mechanism and long-term goal differ from a temporary disease-specific fat restriction." }
      ],
      tags: ["low fat", "pancreatitis", "malabsorption", "triglycerides", "small frequent meals"],
      sourceKeys: ["w45-niddk-pancreatitis", "w45-aha-heart-diet"]
    }),
    therapeutic({
      name: "High-Protein Nutrition",
      nclexEssential: false,
      aliases: ["high protein diet", "high-protein diet", "protein enriched diet"],
      summary: "High-protein nutrition increases protein density for selected malnutrition, wound-healing, recent critical-illness, sarcopenia, or dialysis needs. The class of intervention includes protein-rich foods, fortified meals, oral nutrition supplements, and modular protein products; the amount must be calculated rather than assumed.",
      quickAnswer: "Use dietitian assessment, because protein need depends on body size, energy intake, illness, wounds, dialysis, kidney or liver function, and tolerance. Examples include eggs, dairy or fortified alternatives, fish, poultry, beans, soy foods, meat, oral nutrition supplements, and prescribed modular protein—not one supplement for everyone.",
      whyItMatters: "High-protein nutrition is used when protein needs or losses rise, commonly with malnutrition, pressure injuries or other wounds, sarcopenia, recovery from critical illness, or dialysis. Adequate amino acids support muscle maintenance and tissue repair only when energy, perfusion, and the overall treatment plan are also adequate; the amount must be calculated because predialysis CKD, some metabolic disorders, severe organ dysfunction, allergies, swallowing limits, or poor tolerance can make indiscriminate supplementation harmful.",
      sections: [
        ["Indications", "A higher-protein plan may support muscle preservation, pressure-injury or wound healing, recovery after illness, and dialysis-related losses when energy intake is also adequate."],
        ["Assessment and monitoring", "Assess intake, weight and muscle trend, functional strength, wounds, inflammation, hydration, kidney and liver status, swallowing safety, allergies, and the patient's ability to prepare or afford the plan."],
        ["Examples", "Use condition-relevant protein foods and, when needed, fortified meals or oral supplements. Concentrated products may help when volume is limited, but their potassium, phosphorus, sodium, carbohydrate, and fluid content must match the clinical plan."],
        ["Safety", "High protein is not automatically safe in predialysis CKD or certain metabolic disorders, and excessive supplements can displace food or worsen GI symptoms. Do not use serum albumin alone to diagnose low protein intake."],
        ["Connected topics", "Connect High-Protein Nutrition with malnutrition, pressure injury, sarcopenia, dialysis, wounds, enteral nutrition, and Protein Considerations in Kidney Disease."]
      ],
      relatedTopics: ["Malnutrition", "Pressure injuries", "Hemodialysis", "Enteral Nutrition / Tube Feeding", "Protein Considerations in Kidney Disease"],
      clinicalConnections: [
        { topic: "Malnutrition", explanation: "Protein-dense foods or supplements can help rebuild or preserve lean tissue when intake is inadequate, but sufficient calories and treatment of inflammation, chewing, swallowing, access, and disease causes are also necessary." },
        { topic: "Pressure injuries", explanation: "Protein supplies amino acids for tissue repair in a patient with a pressure injury, but healing also depends on adequate energy, perfusion, pressure redistribution, moisture control, infection management, and wound care." },
        { topic: "Hemodialysis", explanation: "Dialysis and illness can increase protein losses or needs, so many hemodialysis patients need more protein than predialysis patients; potassium, phosphorus, sodium, and fluid content still require renal planning." },
        { topic: "Enteral Nutrition / Tube Feeding", explanation: "A higher-protein formula or modular product can supplement needs when oral intake is unsafe or inadequate, but route, renal function, volume, tolerance, and complete nutrient delivery must be reviewed." },
        { topic: "Protein Considerations in Kidney Disease", explanation: "Predialysis metabolically stable CKD may call for moderate rather than high protein, whereas dialysis, wounds, catabolism, or malnutrition can increase need; kidney diagnosis alone cannot select one protein target." }
      ],
      tags: ["high protein", "malnutrition", "wound healing", "dialysis", "oral nutrition supplement"],
      sourceKeys: ["w45-aspen-protein-ltc", "w45-nkf-hemodialysis-diet"]
    })
  );


  entries.push(
    therapeutic({
      name: "Renal Nutrition",
      nclexEssential: true,
      aliases: ["renal diet", "renal nutrition", "kidney diet", "CKD diet", "chronic kidney disease diet", "dialysis diet", "kidney-friendly diet"],
      abbreviations: [],
      summary: "Renal nutrition is individualized medical nutrition therapy for kidney disease. It may modify sodium, potassium, phosphorus, protein, fluid, energy, or carbohydrate, but CKD does not mean restricting everything: stage, serial laboratory values, dialysis status, residual urine, fluid and blood-pressure status, medicines, comorbidities, appetite, and malnutrition risk determine the plan.",
      quickAnswer: "A renal diet, also called renal nutrition, is an individualized kidney-friendly eating plan. It often reduces sodium and may adjust protein, phosphorus, potassium, and fluid intake based on kidney function, blood tests, urine output, and whether the person receives dialysis. The goal is to limit waste and fluid buildup without causing poor nutrition; it is not one universal menu.",
      whyItMatters: "Renal nutrition is used in chronic kidney disease, kidney failure, and dialysis to help manage blood pressure, swelling, waste products, potassium, phosphorus, acid-base balance, and fluid while preserving enough energy and protein for health and healing. Damaged kidneys may not remove water and dissolved wastes normally, while dialysis changes losses and protein needs; therefore stage, serial laboratory values, urine output, dialysis, medicines, diabetes, appetite, and malnutrition risk determine what is restricted, increased, or left unchanged.",
      sections: [
        ["Clinical reasoning", "Reduced filtration and tubular regulation can impair removal of potassium, phosphorus, acid, sodium, and water, but the pattern varies. Dialysis removes some solute and amino acids, medicines alter electrolytes, and a patient with poor intake may be harmed by unnecessary restriction."],
        ["Assessment before restriction", "Review CKD stage and trend, potassium, bicarbonate, phosphate, calcium and parathyroid context, albumin only as a contextual marker, blood pressure, edema, daily weight when ordered, urine output, dialysis modality and schedule, residual kidney function, diabetes, medicines, appetite, weight change, food access, and dietitian/nephrology recommendations."],
        ["Objective anchors", "KDIGO suggests sodium below 2 g/day for many adults with CKD, while KDOQI commonly uses below 2.3 g/day; name the source and context instead of blending them into one universal cutoff. KDIGO suggests protein near 0.8 g/kg/day for metabolically stable adults with CKD G3-G5 and avoiding high intake above 1.3 g/kg/day in adults at progression risk."],
        ["Potassium and phosphorus", "Modify potassium to keep serum potassium in a safe range after addressing causes such as medicines, acidosis, hyperglycemia, constipation, tissue breakdown, missed dialysis, and sample error. Modify phosphorus according to persistent values and CKD-MBD treatment; phosphate additives are highly absorbable, while source bioavailability varies."],
        ["Dialysis differences", "Many dialysis patients need more protein than predialysis CKD patients because treatment and illness increase losses or needs. Fluid allowance varies with residual urine and treatment frequency; home hemodialysis can differ from in-center schedules. Never carry a predialysis restriction forward automatically."],
        ["Nursing care and teaching", "Trend laboratory values and volume findings, reconcile medicines and supplements, ask what the patient actually eats, and teach substitutions that preserve calories and protein. Coordinate binders with the prescribed plan and meals, and refer to a renal dietitian rather than issuing broad food bans."],
        ["NCLEX distinctions", "Do not teach 'no bananas, dairy, beans, protein, salt, or fluids' to every CKD patient. Restrict the nutrient that is clinically indicated while protecting nutrition. One normal or abnormal value should be confirmed and interpreted in context."],
        ["Connected topics", "Connect Renal Nutrition with Chronic kidney disease, dialysis, hyperkalemia, CKD-mineral and bone disorder, Low-Sodium Diet, Fluid Restriction, and the three nutrient-specific kidney cards."]
      ],
      relatedTopics: ["Chronic kidney disease", "Potassium Considerations in Kidney Disease", "Phosphorus Considerations in Kidney Disease", "Protein Considerations in Kidney Disease", "Fluid Restriction", "Low-Sodium Diet"],
      clinicalConnections: [
        { topic: "Chronic kidney disease", explanation: "CKD is the main disease context: declining filtration and regulation can change waste, mineral, blood-pressure, and volume handling, but stage and laboratory trends—not the diagnosis alone—determine the nutrition plan." },
        { topic: "Potassium Considerations in Kidney Disease", explanation: "Potassium may rise when kidney excretion is impaired or fall with losses, medicines, or dialysis, so food changes follow serial potassium, causes, symptoms, ECG context, and treatment rather than a blanket low-potassium list." },
        { topic: "Phosphorus Considerations in Kidney Disease", explanation: "Persistent phosphate retention can contribute to CKD-mineral and bone disorder, so the plan may reduce highly absorbable phosphate additives and coordinate binders while protecting protein and calorie intake." },
        { topic: "Protein Considerations in Kidney Disease", explanation: "Moderate protein may reduce nitrogenous waste in selected stable predialysis CKD, whereas dialysis, catabolism, wounds, pregnancy, growth, or malnutrition can increase need; one renal protein target is unsafe." },
        { topic: "Fluid Restriction", explanation: "A fluid allowance may be needed when low urine output, dialysis, congestion, or dilutional hyponatremia causes water accumulation, but preserved urine, treatment schedule, losses, and volume findings can make restriction unnecessary or harmful." },
        { topic: "Low-Sodium Diet", explanation: "Lower sodium commonly supports blood-pressure and edema control and reduces thirst, but the numeric target follows the renal plan and exceptions such as sodium-wasting states, major losses, or poor intake." }
      ],
      tags: ["renal diet", "CKD", "dialysis", "individualized nutrition", "electrolytes", "malnutrition"],
      sourceKeys: ["w45-kdigo-ckd-2024", "w45-kdoqi-ckd-nutrition-2020", "w45-nkf-kidney-plate", "w45-nkf-hemodialysis-diet"]
    }),
    therapeutic({
      name: "Potassium Considerations in Kidney Disease",
      nclexEssential: true,
      aliases: ["potassium restricted diet", "low potassium diet", "potassium restriction", "renal potassium diet", "hyperkalemia diet", "kidney potassium foods"],
      summary: "Potassium modification in kidney disease aims to keep serum potassium in a safe range without unnecessarily removing nutritious foods. Some patients need restriction, some need no change, and others can become hypokalemic; the prescription follows serial values, kidney function, dialysis, medicines, acid-base and glucose status, bowel function, and intake.",
      quickAnswer: "Do not prescribe a low-potassium diet solely because CKD exists. Confirm the result and cause, review potassium-raising or lowering medicines and supplements, assess ECG and symptoms when potassium is substantially abnormal, and use dietitian-guided portions or substitutions only when the clinical pattern supports them. Guideline thresholds describe hyperkalemia urgency; they do not prescribe one diet for every patient.",
      whyItMatters: "Potassium intake is modified in kidney disease when serial blood levels and the complete clinical picture show a risk of potassium becoming too high or too low. Keeping potassium in a safe range protects nerve, skeletal-muscle, and cardiac electrical function, but diet is only one contributor—kidney injury, acid-base and glucose shifts, medicines, tissue breakdown, constipation, GI loss, and dialysis can dominate—and food restriction is never the acute treatment for dangerous hyperkalemia.",
      sections: [
        ["Why potassium changes", "Kidneys normally excrete potassium, but impaired filtration or distal secretion, acidosis, insulin deficiency, tissue breakdown, constipation, missed dialysis, and medicines can raise serum potassium. Diuretics, GI losses, poor intake, and dialysis can lower it."],
        ["Assessment", "Trend potassium with creatinine/eGFR, bicarbonate, glucose, magnesium, medication changes, dialysis adherence, bowel pattern, symptoms, and ECG when indicated. Consider hemolysis or collection artifact when the result conflicts with the patient."],
        ["Objective anchors and urgency", "The UK Kidney Association adult guideline classifies potassium 5.5-5.9 mmol/L as mild hyperkalemia, 6.0-6.4 mmol/L as moderate, and at least 6.5 mmol/L as severe; severe hyperkalemia requires urgent hospital assessment. Apply the current laboratory range, clinical setting, rate of change, ECG, symptoms, kidney injury, and local protocol because definitions and action pathways can differ."],
        ["Food teaching", "Use portion size, preparation, and lower-potassium substitutions selected by the renal dietitian; do not reduce the topic to one banned-food list. Potassium chloride salt substitutes can deliver substantial potassium and should be reviewed before use."],
        ["Urgent safety", "Weakness, paralysis, palpitations, bradycardia, syncope, or ECG change with significant hyperkalemia requires urgent medical treatment; food teaching is not the acute antidote. Severe hypokalemia can also cause weakness and dysrhythmia."],
        ["NCLEX distinctions", "A potassium-restricted plan treats an individual risk, not the word CKD. Diet is only one contributor; medicines, acid-base shifts, glucose, tissue injury, bowel function, and dialysis can dominate the value."],
        ["Connected topics", "Connect potassium nutrition with Renal Nutrition, hyperkalemia, hypokalemia, Chronic kidney disease, dialysis, and RAAS- or mineralocorticoid-receptor medicines."]
      ],
      relatedTopics: ["Renal Nutrition", "Hyperkalemia", "Hypokalemia", "Chronic kidney disease", "Hemodialysis"],
      clinicalConnections: [
        { topic: "Renal Nutrition", explanation: "Potassium is one adjustable part of the renal plan, considered alongside sodium, phosphorus, protein, fluid, energy, and nutrition status; it is changed only when the patient's pattern supports it." },
        { topic: "Hyperkalemia", explanation: "When potassium is persistently high, portions, substitutions, additives, and salt substitutes may need adjustment, but symptoms, ECG changes, rapid rise, or severe values require urgent medical treatment rather than diet alone." },
        { topic: "Hypokalemia", explanation: "Overrestriction, poor intake, GI losses, diuretics, or dialysis can contribute to low potassium and dysrhythmia risk, so a low-potassium plan must be reduced or reversed when the clinical pattern changes." },
        { topic: "Chronic kidney disease", explanation: "Reduced excretion can raise potassium as CKD advances, yet many people with CKD have normal or low values; CKD by itself is not an indication to remove all higher-potassium foods." },
        { topic: "Hemodialysis", explanation: "Hemodialysis removes potassium intermittently, so intake, residual kidney function, missed treatments, bowel function, medicines, and the time between sessions shape the plan; postdialysis or low values can require a different approach." }
      ],
      tags: ["potassium restriction", "hyperkalemia", "hypokalemia", "CKD", "salt substitute"],
      sourceKeys: ["w45-kdoqi-ckd-nutrition-2020", "w45-nkf-kidney-plate", "w45-nkf-hemodialysis-diet", "w45-ukka-hyperkalemia-2023"]
    }),
    therapeutic({
      name: "Phosphorus Considerations in Kidney Disease",
      nclexEssential: true,
      aliases: ["phosphorus restricted diet", "low phosphorus diet", "phosphate restriction", "renal phosphorus diet", "CKD phosphorus foods"],
      summary: "Phosphorus modification in CKD helps manage persistently abnormal phosphate and CKD-mineral and bone disorder while preserving adequate nutrition. The plan follows laboratory trends, dialysis, parathyroid and bone-mineral context, medicines and binders, food source, and nutritional status—not one universal milligram limit.",
      quickAnswer: "Teach source and bioavailability. Inorganic phosphate additives are highly absorbable and often appear as ingredients containing 'phos'; animal and plant phosphorus are not absorbed identically. KDOQI does not support teaching one evidence-based 800-1,000 mg/day limit to every CKD patient.",
      whyItMatters: "Phosphorus intake is modified when CKD causes persistent phosphate imbalance or contributes to CKD-mineral and bone disorder, especially in advanced disease or dialysis. Reducing highly absorbable phosphate additives and coordinating prescribed binders with meals can lower absorbed phosphorus and support bone and vascular health, but one value or the CKD label does not justify removing every dairy, bean, nut, whole-grain, or protein food because source bioavailability, dialysis, parathyroid context, and malnutrition risk matter.",
      sections: [
        ["Why phosphorus matters", "As kidney function declines, phosphate retention and hormonal adaptation can contribute to CKD-mineral and bone disorder, vascular calcification risk, bone disease, and pruritus. A single phosphate value does not fully describe the process."],
        ["Assessment", "Trend phosphate with calcium, parathyroid hormone context, alkaline phosphatase when relevant, dialysis adequacy, medicines, binders, vitamin D therapy, dietary intake, weight and protein status. Look for hidden additives before removing major protein sources."],
        ["Food and label teaching", "Review processed meats, cola and other additive-containing products, processed cheese, convenience foods, and ingredients containing 'phos.' Plant phosphorus is often less bioavailable than inorganic additives. The goal is lower absorbable phosphorus while protecting protein and calories."],
        ["Phosphate binders", "Binders work in the gastrointestinal tract with food phosphorus, so timing follows the prescription and meal pattern. Do not independently increase, stop, or substitute a binder; monitor constipation, calcium exposure, pill burden, and adherence barriers."],
        ["NCLEX distinctions", "Do not teach that every dairy, bean, nut, or whole-grain food is prohibited. Balance persistent laboratory abnormalities and CKD-MBD management against malnutrition and the patient's dialysis-related protein needs."],
        ["Connected topics", "Connect phosphorus nutrition with Renal Nutrition, Chronic kidney disease-mineral and bone disorder, dialysis, calcium, parathyroid hormone, and phosphate binders."]
      ],
      relatedTopics: ["Renal Nutrition", "Chronic kidney disease-mineral and bone disorder", "Hemodialysis", "Hyperphosphatemia"],
      clinicalConnections: [
        { topic: "Renal Nutrition", explanation: "Phosphorus is one laboratory-directed renal adjustment, balanced against protein, calories, potassium, sodium, fluid, and food quality rather than managed as an isolated banned-food list." },
        { topic: "Chronic kidney disease-mineral and bone disorder", explanation: "Phosphate retention and hormonal changes can disrupt bone and mineral metabolism, so nutrition, dialysis, binders, vitamin D-related therapy, and serial calcium, phosphate, and parathyroid information are interpreted together." },
        { topic: "Hemodialysis", explanation: "Dialysis removes some phosphorus but often not all absorbed between treatments; patients may need additive reduction and prescribed binders while also meeting higher dialysis-related protein needs." },
        { topic: "Hyperphosphatemia", explanation: "Persistently elevated phosphate can prompt lower-absorbable food choices and binder review, but a single result should be interpreted with adherence, dialysis, medicines, nutrition, and the full CKD-mineral and bone picture." }
      ],
      tags: ["phosphorus restriction", "phosphate", "CKD-MBD", "phosphate additives", "binders"],
      sourceKeys: ["w45-kdoqi-ckd-nutrition-2020", "w45-nkf-hemodialysis-diet"]
    }),
    therapeutic({
      name: "Protein Considerations in Kidney Disease",
      nclexEssential: true,
      aliases: ["renal protein diet", "CKD protein intake"],
      searchTerms: ["protein restricted diet", "protein restriction", "low protein diet", "protein-modified diet"],
      summary: "Protein in kidney disease is modified to balance uremic burden and possible progression risk against muscle, wound-healing, immune, and nutrition needs. Predialysis metabolically stable CKD and dialysis are different states; a universal low-protein order is unsafe.",
      quickAnswer: "KDIGO's adult anchor is about 0.8 g/kg/day for metabolically stable CKD G3-G5 and avoidance of high intake above 1.3 g/kg/day in adults at progression risk. Those numbers do not automatically apply to dialysis, pregnancy, children, acute catabolism, critical illness, wounds, or malnutrition; dialysis commonly increases protein need.",
      whyItMatters: "Protein is adjusted in kidney disease to balance two competing risks: moderating protein can reduce nitrogenous waste and support selected predialysis CKD goals, while too little can accelerate muscle loss, poor healing, frailty, and malnutrition. A moderate plan may be used in metabolically stable predialysis CKD, whereas dialysis-related losses, growth, pregnancy, wounds, infection, critical illness, or existing malnutrition can require more protein, so body size, energy intake, clinical state, and treatment stage must drive the prescription.",
      sections: [
        ["Predialysis reasoning", "For selected metabolically stable adults with CKD G3-G5, moderate protein intake may reduce nitrogenous burden while maintaining nutrition. More aggressive restriction requires close dietitian and specialty supervision and adequate energy intake."],
        ["Dialysis and catabolism", "Hemodialysis and peritoneal dialysis can increase amino-acid and protein losses; infection, surgery, wounds, burns, cancer, and critical illness can increase needs further. Do not continue a predialysis low-protein plan automatically after dialysis begins."],
        ["Objective anchors and limits", "Use about 0.8 g/kg/day only in the KDIGO population and avoid high intake above 1.3 g/kg/day in adults at progression risk. Weight basis, body composition, edema, energy intake, and clinical state affect calculation and require an RDN or specialist."],
        ["Monitoring", "Assess weight trajectory, muscle loss, appetite, meal completion, wounds, functional decline, dialysis, uremic symptoms, kidney trajectory, and dietary quality. Albumin is influenced by inflammation and volume and is not a stand-alone protein-intake meter."],
        ["Other diseases", "Do not use routine protein restriction to treat hepatic encephalopathy; cirrhosis commonly carries sarcopenia and malnutrition risk. Any nonrenal protein restriction should have a defined diagnosis, goal, duration, and monitoring plan."],
        ["NCLEX distinctions", "More protein is not always better, and less protein is not always kidney protective. Identify whether the patient is predialysis, on dialysis, acutely ill, pregnant, growing, malnourished, or healing before interpreting the order."],
        ["Connected topics", "Connect protein considerations with Renal Nutrition, Chronic kidney disease, dialysis, malnutrition, pressure injury, critical illness, and cirrhosis."]
      ],
      relatedTopics: ["Renal Nutrition", "Chronic kidney disease", "Hemodialysis", "Malnutrition", "Cirrhosis"],
      clinicalConnections: [
        { topic: "Renal Nutrition", explanation: "Protein is coordinated with the complete kidney plan because lowering it without enough calories can worsen catabolism, while higher-protein foods may also change phosphorus, potassium, sodium, and fluid intake." },
        { topic: "Chronic kidney disease", explanation: "Selected metabolically stable adults with predialysis CKD G3-G5 may use moderate protein to reduce waste burden and avoid excessive intake, but the guideline population and weight basis must be respected." },
        { topic: "Hemodialysis", explanation: "Hemodialysis increases amino-acid and protein losses, so patients commonly need more protein than in stable predialysis CKD; the prescription changes when dialysis starts and with illness or wounds." },
        { topic: "Malnutrition", explanation: "Weight loss, muscle loss, poor appetite, or functional decline can make protein restriction dangerous, so nutrition rehabilitation and adequate energy may take priority over a routine predialysis target." },
        { topic: "Cirrhosis", explanation: "Cirrhosis commonly causes sarcopenia and malnutrition, and routine protein restriction is not treatment for hepatic encephalopathy; combined liver-kidney disease requires specialist balancing rather than carrying forward an old restriction." }
      ],
      tags: ["protein restriction", "0.8 g/kg", "1.3 g/kg", "dialysis protein", "malnutrition"],
      sourceKeys: ["w45-kdigo-ckd-2024", "w45-nkf-hemodialysis-diet", "w45-aspen-protein-ltc", "w45-aasld-cirrhosis-nutrition"]
    }),
    therapeutic({
      name: "Fluid Restriction",
      nclexEssential: true,
      aliases: ["fluid restricted diet", "fluid restriction diet", "restricted fluids", "daily fluid allowance", "fluid limit"],
      summary: "A fluid restriction limits total fluid intake to manage selected excess-volume or dilutional states. It is an individualized order used in some kidney failure, dialysis, heart failure, cirrhosis, or hyponatremia contexts—not a routine rule for every patient with those diagnoses.",
      quickAnswer: "The written allowance must define the amount and what counts. An order such as 1,500 mL per 24 hours is an example, not a default. Water, coffee, milk, soup, gelatin, ice, frozen desserts, enteral water flushes, liquid medicines, and IV fluids may contribute; ice is counted by its melted volume under local practice. Trend weight, intake/output, edema, lung findings, sodium, kidney function, urine output, thirst, and adherence.",
      whyItMatters: "A fluid restriction is ordered when the body cannot safely remove or redistribute water and extra intake can worsen pulmonary congestion, edema, ascites, hypertension, or dilutional hyponatremia—commonly in selected dialysis, kidney failure, advanced heart failure, or cirrhosis plans. Limiting total fluid helps match intake to excretion and treatment, but it is not routine for every patient with these diagnoses; urine output, dialysis schedule, sodium intake, fever, weather, GI losses, medicines, perfusion, and thirst determine the allowance, and excessive restriction can cause dehydration or hypotension.",
      sections: [
        ["Why fluids are limited", "When kidneys cannot excrete water or when effective circulation and hormones retain water, excess intake can worsen edema, pulmonary congestion, hypertension, ascites, or dilutional hyponatremia. Restriction treats a fluid-balance problem; it does not directly correct every cause."],
        ["Who may need it", "Some patients receiving in-center dialysis with little residual urine, selected advanced heart-failure patients, cirrhotic patients with clinically important hyponatremia, and other ordered conditions may need a limit. Home dialysis, preserved urine, medications, weather, fever, GI loss, and sodium intake can change needs."],
        ["Nursing implementation", "Verify the 24-hour allowance, shift allocation, included sources, IV and tube plan, and whether family-brought fluids count. Measure intake consistently, use daily weights under comparable conditions, assess edema and respiratory status, and communicate cumulative intake during handoff."],
        ["Teaching and thirst", "Reduce excess sodium because it drives thirst, spread allowed fluids through the day, use measured cups, oral care, lip moisturizer, cold small portions, or sugar-free gum when permitted, and track all sources. Do not offer ice or gelatin as 'free' fluid without checking the order."],
        ["Escalation", "Escalate new dyspnea, hypoxemia, crackles, rapid weight gain, severe edema, confusion, seizure, hypotension, oliguria/anuria, or a major sodium change. Also report dehydration, poor perfusion, orthostasis, or excessive loss; the restriction may need reassessment."],
        ["NCLEX distinctions", "Heart failure does not automatically equal fluid restriction, and CKD does not automatically equal the same allowance. A daily-weight trend is often more useful than one isolated intake total, but both require clinical context."],
        ["Connected topics", "Connect Fluid Restriction with heart failure, dialysis, Chronic kidney disease, hyponatremia, cirrhotic ascites, Low-Sodium Diet, and daily weight monitoring."]
      ],
      relatedTopics: ["Heart failure", "Chronic kidney disease", "Hemodialysis", "Hyponatremia", "Cirrhosis", "Low-Sodium Diet"],
      clinicalConnections: [
        { topic: "Heart failure", explanation: "A fluid limit may help selected patients with advanced congestion or dilutional hyponatremia, but evidence does not support making the same restriction routine for every heart-failure patient; symptoms, medicines, kidney function, and volume status control." },
        { topic: "Chronic kidney disease", explanation: "Advanced CKD with low urine output can allow water to accumulate, but people with preserved excretion or active losses may not need restriction and can be harmed by an automatic limit." },
        { topic: "Hemodialysis", explanation: "Between treatments, fluid can accumulate when residual urine is low, increasing weight, blood pressure, edema, and pulmonary congestion; allowance varies with urine output, treatment frequency, sodium intake, and the dialysis prescription." },
        { topic: "Hyponatremia", explanation: "Fluid restriction can help selected dilutional hyponatremia by reducing excess free-water intake, but sodium can also be low from depletion or other mechanisms in which restriction may be ineffective or inappropriate." },
        { topic: "Cirrhosis", explanation: "Fluid restriction may be used when cirrhosis includes clinically important dilutional hyponatremia, while sodium restriction is more commonly tied to ascites; routine fluid limitation for every patient with cirrhosis is inappropriate." },
        { topic: "Low-Sodium Diet", explanation: "Reducing excess sodium can lessen thirst and retained water and may make a prescribed fluid allowance easier, but sodium and fluid are separate orders chosen from the condition and volume pattern." }
      ],
      tags: ["fluid allowance", "volume overload", "daily weight", "intake and output", "hyponatremia", "dialysis"],
      sourceKeys: ["w45-nkf-hemodialysis-diet", "w45-aha-hf-2022", "w45-aasld-ascites"]
    })
  );

  entries.push(
    iddsiFoodCard({
      level: 7,
      label: "Regular",
      nclexEssential: false,
      aliases: ["regular texture", "regular diet texture", "IDDSI regular food"],
      summary: "It includes everyday foods without texture modification when chewing and swallowing abilities safely manage varied textures.",
      quickAnswer: "Level 7 Regular permits a broad range of naturally soft, hard, crunchy, fibrous, mixed, and dual-consistency foods as tolerated.",
      meaning: "The person must be able to bite and chew hard, soft, fibrous, stringy, crunchy, and mixed-texture foods and manage variable particle sizes.",
      characteristics: "Examples can include ordinary meats, breads, cereals, vegetables, fruit, rice, and mixed dishes when the individual plan permits them.",
      testing: "Level 7 Regular has no fixed particle-size limit or single fork-pressure pass criterion; normal food safety and the individualized swallowing assessment still apply.",
      distinction: "Regular texture does not mean unrestricted for allergies, therapeutic nutrition, aspiration risk, or required assistance.",
      relatedLevel: "IDDSI Level 7 — Easy to Chew"
    }),
    iddsiFoodCard({
      level: 7,
      label: "Easy to Chew",
      nclexEssential: true,
      aliases: ["easy to chew", "easy-to-chew diet", "IDDSI easy to chew", "soft tender food"],
      summary: "It uses normal everyday foods that are soft and tender enough for easier biting and chewing while retaining varied appearance and particle size.",
      quickAnswer: "Foods should be soft and tender; hard, tough, chewy, fibrous, stringy, crunchy, sharp, or bony pieces are excluded.",
      meaning: "This level reduces chewing effort for selected people but still requires the ability to bite, chew, form, and clear a bolus safely.",
      characteristics: "Examples may include tender fish, slow-cooked soft meat, soft vegetables, ripe soft fruit, eggs, and moist soft grains when each item meets the plan.",
      testing: "There is no fixed particle-size maximum; assess softness and tenderness with the Fork Pressure Test and remove unsafe hard, tough, fibrous, stringy, crunchy, or sharp parts.",
      distinction: "Easy to Chew is not identical to Level 6 Soft & Bite-Sized because Level 7 has no particle-size restriction. It can pose a choking risk for a person with increased choking risk, so the clinician-directed supervision and food-size plan must be followed rather than assuming softness alone is sufficient.",
      relatedLevel: "IDDSI Level 6 — Soft & Bite-Sized"
    }),
    iddsiFoodCard({
      level: 6,
      label: "Soft & Bite-Sized",
      nclexEssential: true,
      aliases: ["soft and bite sized", "soft bite sized", "IDDSI soft and bite-sized", "level 6 food"],
      summary: "It uses soft, tender, moist foods cut into controlled pieces that can be mashed with a fork and require chewing.",
      quickAnswer: "Adult pieces are no larger than 1.5 cm by 1.5 cm; pediatric pieces use an 8 mm maximum, and food should pass the IDDSI Fork Pressure Test.",
      meaning: "Controlled piece size reduces choking risk while soft texture reduces biting and chewing effort for selected swallowing plans.",
      characteristics: "Examples may include tender moist meat cut to size, soft cooked vegetables, soft fruit without unsafe skin or seeds, and moist grains without separate thin liquid.",
      testing: "Press with the side of a fork until the thumbnail blanches; the food should squash, change shape, and not return to its original form. Adult pieces must not exceed 1.5 cm and pediatric pieces 8 mm.",
      distinction: "Level 6 still requires chewing and is not the same as minced or puréed food; sauces must not separate into an unapproved thin liquid.",
      relatedLevel: "IDDSI Level 5 — Minced & Moist"
    }),
    iddsiFoodCard({
      level: 5,
      label: "Minced & Moist",
      nclexEssential: true,
      aliases: ["minced and moist", "minced moist diet", "IDDSI minced and moist", "level 5 food"],
      summary: "It contains very small, soft, moist particles that need minimal chewing and can be mashed easily with the tongue.",
      quickAnswer: "Adult particles are no more than 4 mm in width and 15 mm in length; pediatric particles are no more than 2 mm in width and 8 mm in length. The food is cohesive and has no separate thin liquid.",
      meaning: "Small moist particles reduce chewing demand while requiring enough tongue control to gather and move the bolus.",
      characteristics: "Examples may include finely minced tender meat in thick sauce, mashed soft vegetables with tiny lumps, and finely minced soft fruit when cohesive and nonseparating.",
      testing: "Adult particles must be no more than 4 mm in width and 15 mm in length; pediatric particles must be no more than 2 mm in width and 8 mm in length. They should squash with little pressure, hold together on a spoon, and avoid liquid separation.",
      distinction: "Level 5 permits small soft particles and therefore differs from smooth, lump-free Level 4 Puréed.",
      relatedLevel: "IDDSI Level 4 — Puréed"
    }),
    iddsiFoodCard({
      level: 4,
      label: "Puréed",
      nclexEssential: true,
      aliases: ["pureed", "purée", "puree", "pureed diet", "purée diet", "IDDSI pureed"],
      commonMisspellings: ["pured diet"],
      summary: "It is smooth, cohesive, lump-free food that requires no chewing and is neither sticky nor separated into thin liquid.",
      quickAnswer: "Level 4 holds its shape on a spoon or plate and slides off a tilted spoon with little residue. A small amount may form a short tail below fork prongs, but it should not continuously dollop, flow, or drip through them.",
      meaning: "A smooth cohesive bolus reduces particle and chewing demands but can still be unsafe if too sticky, too runny, or inappropriate for the person's physiology.",
      characteristics: "Examples may include smooth puréed meat with thick sauce, smooth mashed vegetables, or smooth puréed fruit when lump-free and nonsticky.",
      testing: "Use Fork Drip and Spoon Tilt tests: food sits in a mound above fork prongs, may show only a small amount or short tail below them rather than continuous dolloping, flowing, or dripping, holds shape, and slides off a tilted spoon without sticking or leaving excessive residue.",
      distinction: "Puréed is a tested texture, not simply any blended food, and is not automatically safer than less modified levels.",
      relatedLevel: "IDDSI Level 3 — Liquidised"
    }),
    iddsiFoodCard({
      level: 3,
      label: "Liquidised",
      nclexEssential: true,
      aliases: ["liquidised", "liquidized food", "liquidised diet", "IDDSI liquidised", "level 3 food"],
      commonMisspellings: ["liquidized diet"],
      summary: "It is smooth, lump-free food that needs no chewing and can be poured or slowly dripped rather than holding a stable mound.",
      quickAnswer: "Level 3 food pours or slowly drips through fork prongs, leaves only a thin coating after Spoon Tilt testing, and has more than 8 mL remaining in the specified IDDSI Flow Test syringe after 10 seconds.",
      meaning: "This level reduces chewing and particle demands but flows more readily than Level 4 Puréed, which changes oral control and airway timing.",
      characteristics: "Examples may include smooth liquidised meals or smooth cereals when completely lump-free, nonsticky, and free of skins, husks, seeds, gristle, or separate liquid.",
      testing: "Use both the IDDSI Flow and Fork Drip tests: more than 8 mL remains in the specified 10 mL syringe after 10 seconds, and the food drips slowly in dollops through fork prongs, pours from a spoon, and does not hold a firm mound on a plate. Spoon Tilt should leave only a thin coating.",
      distinction: "Level 3 Liquidised food and Level 3 Moderately Thick drink share a number but have different preparation contexts and must follow the exact order.",
      relatedLevel: "IDDSI Level 4 — Puréed"
    })
  );

  entries.push(
    iddsiDrinkCard({
      level: 0,
      label: "Thin",
      nclexEssential: true,
      aliases: ["thin liquids", "thin liquid", "IDDSI thin", "level 0 drink"],
      summary: "It includes drinks that flow like water and require rapid oral control and swallow timing.",
      quickAnswer: "Less than 1 mL remains in the specified 10 mL IDDSI syringe after 10 seconds.",
      meaning: "Thin fluid moves quickly and may be appropriate for many people but can challenge selected swallowing physiology.",
      characteristics: "Examples commonly include water, tea, coffee, milk, juice without pulp, and clear broth when no thickener or texture-changing ingredient is present.",
      testing: "After exactly 10 seconds of flow from the specified syringe, less than 1 mL remains in the barrel.",
      distinction: "A clear-liquid diet often contains Level 0 drinks, but GI clarity and swallowing consistency are separate orders.",
      relatedLevel: "IDDSI Level 1 — Slightly Thick"
    }),
    iddsiDrinkCard({
      level: 1,
      label: "Slightly Thick",
      nclexEssential: true,
      aliases: ["slightly thick", "slightly thick liquids", "IDDSI slightly thick", "level 1 drink"],
      summary: "It is thicker than water but still flows through a straw or nipple and is often used only after individualized assessment.",
      quickAnswer: "Between 1 mL and 4 mL remains in the specified 10 mL IDDSI syringe after 10 seconds.",
      meaning: "Slightly slower flow may alter timing and control while remaining relatively easy to drink for selected patients.",
      characteristics: "Some naturally or commercially prepared drinks may test at this level, but product names and visual appearance cannot replace testing.",
      testing: "After 10 seconds, 1–4 mL remains in the specified 10 mL IDDSI syringe.",
      distinction: "Level 1 is not an exact translation of any legacy nectar label and should be named by both level and current term.",
      relatedLevel: "IDDSI Level 2 — Mildly Thick"
    }),
    iddsiDrinkCard({
      level: 2,
      label: "Mildly Thick",
      nclexEssential: true,
      aliases: ["mildly thick", "mildly thick liquids", "IDDSI mildly thick", "level 2 drink"],
      summary: "It flows more slowly than Slightly Thick liquid while remaining drinkable from a cup and, for some people, through a straw.",
      quickAnswer: "Between 4 mL and 8 mL remains in the specified 10 mL IDDSI syringe after 10 seconds.",
      meaning: "Moderately slowed flow may improve control for selected physiology but can also change residue, effort, intake, and medication delivery.",
      characteristics: "Prepared beverages require a reproducible recipe or product and retesting because thickener type, standing time, temperature, and ingredients change flow.",
      testing: "After 10 seconds, 4–8 mL remains in the specified 10 mL IDDSI syringe.",
      distinction: "Do not automatically equate Mildly Thick with nectar thick; legacy labels lacked a universal one-to-one standard.",
      relatedLevel: "IDDSI Level 3 — Moderately Thick"
    }),
    iddsiDrinkCard({
      level: 3,
      label: "Moderately Thick",
      nclexEssential: true,
      aliases: ["moderately thick", "moderately thick liquids", "IDDSI moderately thick", "level 3 drink"],
      summary: "It is a slow-flowing drink usually taken from a cup or spoon and requires individualized evaluation for swallowing safety and hydration.",
      quickAnswer: "More than 8 mL remains after 10 seconds while some liquid still flows through the specified syringe; complete no-flow behavior suggests Level 4 assessment.",
      meaning: "Substantially slower flow may help one swallowing pattern yet increase residue, effort, poor intake, or silent aspiration in another.",
      characteristics: "Products should be smooth without lumps, fibers, pulp, skins, seeds, or unintended separation and should remain stable for the expected mealtime.",
      testing: "After 10 seconds, more than 8 mL remains but some liquid has flowed; also confirm appropriate fork and spoon behavior when the boundary is uncertain.",
      distinction: "Do not automatically equate Moderately Thick with honey thick, and distinguish it from Level 3 Liquidised food despite the shared number.",
      relatedLevel: "IDDSI Level 4 — Extremely Thick"
    }),
    iddsiDrinkCard({
      level: 4,
      label: "Extremely Thick",
      nclexEssential: true,
      aliases: ["extremely thick", "extremely thick liquids", "IDDSI extremely thick", "level 4 drink"],
      summary: "It is a very thick, smooth drink usually consumed with a spoon rather than by free flow from a cup or straw.",
      quickAnswer: "There is no meaningful flow through the syringe; classify Level 4 with Spoon Tilt and Fork Drip behavior rather than a random syringe or a legacy pudding label.",
      meaning: "Very high viscosity greatly changes bolus movement, effort, residue, intake, hydration, and medication delivery and therefore requires a specifically evaluated plan.",
      characteristics: "It should be smooth and lump-free, hold shape on a spoon, fall off with Spoon Tilt, and avoid stickiness or liquid separation.",
      testing: "No meaningful syringe flow is expected; use Fork Drip and Spoon Tilt tests to confirm that the sample holds together and slides off the spoon appropriately.",
      distinction: "Do not automatically equate Extremely Thick with pudding thick or assume it is the safest possible liquid.",
      relatedLevel: "IDDSI Level 3 — Moderately Thick"
    })
  );

  const pathologyDatabase = window.ANI_PATHOLOGY_DATABASE && typeof window.ANI_PATHOLOGY_DATABASE === "object"
    ? window.ANI_PATHOLOGY_DATABASE
    : { diseases: [], sourceReferences: [] };
  if (!Array.isArray(pathologyDatabase.diseases)) pathologyDatabase.diseases = [];
  if (!Array.isArray(pathologyDatabase.sourceReferences)) pathologyDatabase.sourceReferences = [];

  const pathologySourceMappings = Object.freeze([
    ["w45p-asha-adult-dysphagia", "w45-asha-adult-dysphagia"],
    ["w45p-asha-swallow-screening", "w45-asha-swallow-screening"],
    ["w45p-nidcd-aphasia", "w45-nidcd-aphasia"],
    ["w45p-cdc-oral-care-pneumonia", "w45-cdc-oral-care-pneumonia"],
    ["w45p-iddsi-framework-v2", "w45-iddsi-framework-v2"],
    ["w45p-aspen-en-safe", "w45-aspen-en-safe"],
    ["w45p-nhlbi-dash", "w45-nhlbi-dash"],
    ["w45p-aha-hf-2022", "w45-aha-hf-2022"],
    ["w45p-kdigo-ckd-2024", "w45-kdigo-ckd-2024"],
    ["w45p-ada-nutrition-2026", "w45-ada-nutrition-2026"],
    ["w45p-niddk-celiac", "w45-niddk-celiac"],
    ["w45p-aha-stroke-screen", "w45-aha-stroke-screen"],
    ["w45p-aasld-ascites", "w45-aasld-ascites"],
    ["w45p-medlineplus-low-fiber", "w45-medlineplus-low-fiber"]
  ]);
  const foundationSourceByKey = new Map(localSourceReferences.map((source) => [source.key, source]));
  const pathologySourceIndex = new Map(pathologyDatabase.sourceReferences
    .filter((source) => source && (source.key || source.id))
    .map((source, index) => [String(source.key || source.id), index]));
  pathologySourceMappings.forEach(([pathologyKey, foundationKey]) => {
    const source = foundationSourceByKey.get(foundationKey);
    if (!source) throw new Error("Missing Wave45 pathology source mapping: " + foundationKey);
    const mapped = { ...source, key: pathologyKey };
    const index = pathologySourceIndex.get(pathologyKey);
    if (Number.isInteger(index)) pathologyDatabase.sourceReferences[index] = mapped;
    else {
      pathologySourceIndex.set(pathologyKey, pathologyDatabase.sourceReferences.length);
      pathologyDatabase.sourceReferences.push(mapped);
    }
  });

  const patchedPathologyNames = [];
  const patchPathology = (name, patch, replaceArrayFields = []) => {
    const matches = pathologyDatabase.diseases
      .map((record, index) => ({ record, index }))
      .filter(({ record }) => normalize(record && record.name) === normalize(name));
    if (matches.length !== 1) throw new Error(`Wave45 expected one pathology owner for ${name}; found ${matches.length}.`);
    const { record, index } = matches[0];
    const replaceSet = new Set(replaceArrayFields);
    const merged = { ...record, ...patch };
    Object.entries(patch).forEach(([field, value]) => {
      if (!Array.isArray(value)) return;
      merged[field] = replaceSet.has(field)
        ? unique(value)
        : unique([...(Array.isArray(record[field]) ? record[field] : []), ...value]);
    });
    merged.wave45NutritionSwallowingRevision = VERSION;
    pathologyDatabase.diseases[index] = merged;
    patchedPathologyNames.push(name);
    return merged;
  };

  const dysphagiaReplaceFields = [
    "riskFactors", "signsSymptoms", "diagnostics", "labs", "treatments", "nursingPriorities",
    "complications", "contraindications", "redFlags", "patientEducation", "nclexTraps"
  ];
  patchPathology("Dysphagia", {
    encyclopediaSection: "holistic",
    holisticSubcategoryId: SWALLOWING_ID,
    holisticSubcategoryLabel: SWALLOWING_LABEL,
    nclexEssential: true,
    aliases: ["difficulty swallowing", "swallowing difficulty", "swallow precautions", "swallowing precautions"],
    definition: "Dysphagia is impaired swallowing during oral preparation, pharyngeal transfer, or esophageal passage. It is different from aphasia, which impairs language or communication; a person after stroke may have aphasia, dysphagia, both, or neither.",
    pathology: "Oropharyngeal dysphagia disrupts chewing, bolus control, swallow initiation, airway closure, sensation, or pharyngeal clearance. Esophageal dysphagia interferes with passage after the swallow. Either pattern can cause poor intake, dehydration, malnutrition, medication problems, impaction, or aspiration; aspiration may be silent.",
    pathophysiology: "Stroke or other neurologic disease can impair timing, strength, sensation, coordination, and cough. Head and neck disease can alter structure, while stricture, inflammation, motility disorders, or mass can obstruct or slow esophageal passage. The mechanism determines whether posture, texture, liquid flow, rehabilitation, or nonoral support helps.",
    etiology: "Important causes include stroke, traumatic brain injury, Parkinson disease, dementia, motor neuron or neuromuscular disease, head and neck cancer or treatment, frailty, impaired consciousness, structural narrowing, reflux-related stricture, eosinophilic esophagitis, and esophageal motility disorders.",
    riskFactors: ["Acute stroke or new focal neurologic deficit", "Reduced alertness, weak cough, poor secretion control, or cranial-nerve dysfunction", "Neurodegenerative or neuromuscular disease", "Head and neck surgery, radiation, tumor, or structural obstruction", "Frailty, dependence for feeding, poor dentition, or poor oral hygiene"],
    signsSymptoms: ["Coughing, choking, throat clearing, wet or gurgly voice, or breathing change during or after intake", "Drooling, pocketing, prolonged chewing, multiple swallows, fatigue, or food remaining in the mouth", "Food sticking, regurgitation, painful swallowing, or inability to swallow saliva", "Unexplained weight loss, dehydration, recurrent chest infection, fever, or respiratory decline", "No obvious cough despite aspiration risk because silent aspiration can occur"],
    diagnostics: ["A swallowing screen identifies risk; it does not diagnose the mechanism or prescribe the final diet. Stop the screen and keep oral intake withheld according to protocol when risk appears.", "Speech-language pathology evaluation examines oral and pharyngeal function, cognition, voice, cough, nutrition, and the observed response to selected trials when safe.", "Videofluoroscopic swallow study, also called modified barium swallow study (VFSS/MBSS), or fiberoptic endoscopic evaluation of swallowing (FEES) can define physiology and test strategies.", "Food sticking after the swallow or other esophageal clues may require gastroenterology evaluation, endoscopy, contrast imaging, or motility testing."],
    labs: ["No laboratory test diagnoses dysphagia. Use cause-directed testing and monitor hydration, electrolytes, weight, and nutrition when intake is reduced.", "Fever, oxygenation change, inflammatory findings, or a new infiltrate may support evaluation for an aspiration-related lung complication but do not identify swallowing physiology."],
    treatments: ["Treat the cause and use the route, food texture, drink consistency, posture, pace, cueing, and swallowing exercises selected by the qualified team.", "Use IDDSI-tested food and drink levels only when prescribed; thicker liquid or more puréed food is not automatically safer.", "Develop a pharmacy-reviewed medication plan because crushing, thickening, or tube administration can change formulation safety and delivery.", "Use temporary or longer-term enteral or parenteral nutrition only when goals, gastrointestinal access, aspiration risk, prognosis, and reassessment support it."],
    nursingPriorities: ["After acute stroke, complete the validated dysphagia screen before food, fluid, or oral medication, or maintain NPO status until safety is established.", "Before each meal assess alertness, breathing, secretion control, posture, oral condition, current food and drink orders, needed equipment, and required supervision.", "Use only the individualized positioning, pace, bite or sip size, utensil, cup, straw, and maneuver plan; do not select a consistency independently.", "Provide regular oral care, monitor meal completion, hydration, weight, voice, cough, oxygenation, fatigue, pocketing, and respiratory findings, and document tolerance precisely.", "Stop oral intake and escalate for choking, inability to manage secretions, repeated cough or throat clearing, wet or gurgly voice, new respiratory distress or oxygen decline, vomiting, or reduced alertness."],
    complications: ["Aspiration pneumonitis or aspiration pneumonia", "Airway obstruction", "Dehydration and malnutrition", "Medication omission, altered absorption, or unsafe crushing", "Food impaction and progressive structural disease"],
    contraindications: ["Do not use a gag reflex alone to declare swallowing safe.", "Do not give water, food, ice, or oral medication after a failed or deferred screen unless the current plan permits it.", "Do not assume coughing is required for aspiration or that a feeding tube eliminates aspiration.", "Do not prescribe thicker liquid, a straw, chin tuck, head turn, or texture change without individualized assessment and an authorized plan."],
    redFlags: ["Airway obstruction, cyanosis, stridor, or acute respiratory distress", "Inability to handle secretions or complete food impaction", "Repeated cough, wet voice, falling oxygenation, or respiratory decline with intake", "Fever or focal lung findings after suspected aspiration", "Rapidly progressive swallowing difficulty, bleeding, severe pain, or unexplained weight loss"],
    patientEducation: ["Aphasia affects language; dysphagia affects swallowing. One does not automatically prove the other.", "Follow the exact route, food level, drink level, posture, pacing, oral-care, and medication plan and report any change in swallowing or breathing.", "Family should not bring food, alter thickness, or feed a drowsy patient outside the current plan."],
    nclexTraps: ["Screening identifies risk and occurs before oral intake after acute stroke; formal evaluation determines physiology and the individualized plan.", "Silent aspiration can occur without cough.", "Thicker liquids are not automatically safer, and aphasia alone does not require thickened liquids."],
    relatedTopics: ["Aspiration prevention", "Post-stroke dysphagia screening", "Food Texture Modification and IDDSI", "Liquid Consistency and Thickened Liquids", "Safe Feeding and Mealtime Assistance", "NPO — Nothing by Mouth", "Enteral Nutrition / Tube Feeding", "Aphasia"],
    sourceKeys: ["w45p-asha-adult-dysphagia", "w45p-asha-swallow-screening", "w45p-nidcd-aphasia", "w45p-aha-stroke-screen"],
    tags: ["dysphagia", "swallowing", "SLP", "VFSS", "FEES", "aspiration", "IDDSI"]
  }, dysphagiaReplaceFields);

  patchPathology("Aspiration prevention", {
    encyclopediaSection: "holistic",
    holisticSubcategoryId: SWALLOWING_ID,
    holisticSubcategoryLabel: SWALLOWING_LABEL,
    nclexEssential: true,
    aliases: ["aspiration precautions"],
    clinicalSignificance: "Aspiration prevention uses mechanism-specific assessment and an individualized route, food texture, drink consistency, posture, pace, assistance, medication, oral-care, secretion, and enteral-feeding plan. Wet or gurgly voice, repeated throat clearing, inability to manage secretions, respiratory change, or oxygen decline during intake requires immediate reassessment; no single precaution eliminates aspiration.",
    diagnostics: ["Assess alertness, breathing, oxygenation, voice, cough, throat clearing, secretion control, oral health, posture, feeding dependence, medication route, vomiting or reflux, and swallowing symptoms.", "Involve speech-language pathology when oropharyngeal dysphagia is suspected; VFSS/MBSS or FEES may define physiology and test individualized strategies.", "Evaluate fever, hypoxemia, new focal lung findings, or respiratory decline while distinguishing aspiration pneumonitis from bacterial aspiration pneumonia."],
    nursingPriorities: ["Verify and document the current route, IDDSI food and drink levels, positioning, pace, bite or sip size, supervision, equipment, and medication plan at every transition.", "Provide the prescribed feeding assistance and meal supervision, observe throughout intake, document intake and tolerance, and hand off specific swallowing signs rather than writing only 'tolerated.'", "Provide regular oral care because aspirated oral bacteria contribute to pneumonia risk; use aspiration-aware positioning and suction for dependent oral care when indicated.", "For enteral feeding, verify route and tube position by approved methods, use prescribed positioning, monitor vomiting and respiratory change, and remember that tube feeding does not eliminate aspiration.", "Stop feeding for choking, wet or gurgly voice, repeated cough or throat clearing, inability to clear food or secretions, vomiting, new respiratory distress, oxygen decline, or reduced consciousness; initiate airway or emergency response and escalate as indicated."],
    contraindications: ["Do not feed a drowsy or unstable patient merely because a tray arrived.", "Do not independently add thickener, change IDDSI level, use a straw or postural maneuver, crush medication, or change a tube route outside the authorized individualized plan.", "Do not assume absence of coughing proves safety, that thicker liquid is always safer, or that a feeding tube prevents aspiration."],
    redFlags: ["Complete airway obstruction, cyanosis, stridor, or acute respiratory distress", "Inability to manage secretions", "Wet or gurgly voice, repeated cough or throat clearing, falling oxygenation, or respiratory decline during intake", "Fever, new focal lung findings, or recurrent respiratory infection after suspected silent aspiration"],
    patientEducation: ["Follow the exact route, posture, pace, food texture, drink consistency, oral-care, and medication plan; do not copy another patient's strategy.", "Family should request help for feeding when supervision is ordered and stop immediately for choking, voice change, cough, secretion difficulty, drowsiness, or breathing change."],
    nclexTraps: ["Aspiration can be silent.", "Tube feeding does not eliminate aspiration.", "Thicker liquid is not automatically safer.", "Oral care, documentation, and prescribed supervision are airway-safety interventions."],
    relatedTopics: ["Dysphagia", "Food Texture Modification and IDDSI", "Liquid Consistency and Thickened Liquids", "Safe Feeding and Mealtime Assistance", "Enteral Nutrition / Tube Feeding", "NPO — Nothing by Mouth"],
    sourceKeys: ["w45p-asha-adult-dysphagia", "w45p-cdc-oral-care-pneumonia", "w45p-iddsi-framework-v2", "w45p-aspen-en-safe"],
    tags: ["aspiration precautions", "oral care", "feeding assistance", "meal supervision", "SLP", "VFSS", "FEES"]
  });

  const postStrokeSwallow = pathologyDatabase.diseases.find((record) => normalize(record && record.name) === normalize("Post-stroke dysphagia screening and aspiration prevention"));
  if (!postStrokeSwallow) throw new Error("Wave45 could not find the canonical post-stroke swallowing card.");
  patchPathology("Post-stroke dysphagia screening and aspiration prevention", {
    abbreviations: (Array.isArray(postStrokeSwallow.abbreviations) ? postStrokeSwallow.abbreviations : [])
      .filter((value) => normalize(value) !== "npo"),
    relatedTopics: ["NPO — Nothing by Mouth", "Food Texture Modification and IDDSI", "Liquid Consistency and Thickened Liquids"],
    sourceKeys: ["w45p-aha-stroke-screen"]
  }, ["abbreviations"]);

  const aphasiaMatches = foundationDatabase.entries
    .map((record, index) => ({ record, index }))
    .filter(({ record }) => normalize(record && record.name) === "aphasia");
  if (aphasiaMatches.length !== 1) throw new Error(`Wave45 expected one foundation owner for Aphasia; found ${aphasiaMatches.length}.`);
  const aphasiaOwner = aphasiaMatches[0].record;
  foundationDatabase.entries[aphasiaMatches[0].index] = {
    ...aphasiaOwner,
    clinicalSignificance: "Aphasia impairs language expression or understanding, reading, or writing; it does not itself diagnose impaired swallowing. After stroke, aphasia may complicate communication about a swallowing plan, but the person may have aphasia, dysphagia, both, or neither.",
    relatedTopics: unique([...(Array.isArray(aphasiaOwner.relatedTopics) ? aphasiaOwner.relatedTopics : []), "Dysphagia"]),
    sourceKeys: unique([...(Array.isArray(aphasiaOwner.sourceKeys) ? aphasiaOwner.sourceKeys : []), "w45-nidcd-aphasia"]),
    tags: unique([...(Array.isArray(aphasiaOwner.tags) ? aphasiaOwner.tags : []), "aphasia dysphagia distinction"]),
    wave45NutritionSwallowingRevision: VERSION
  };

  patchPathology("Hypertension", {
    nutritionConnections: ["DASH Diet and Low-Sodium Diet are evidence-based nutrition approaches for many patients, while Heart-Healthy Nutrition supports overall cardiovascular risk reduction; targets remain individualized for kidney function, potassium, energy needs, and treatment plan."],
    relatedTopics: ["DASH Diet", "Low-Sodium Diet", "Heart-Healthy Nutrition"],
    sourceKeys: ["w45p-nhlbi-dash"]
  });
  patchPathology("Heart failure", {
    nutritionConnections: ["Avoid excessive sodium within an individualized heart-failure plan. Fluid restriction is used only when clinically indicated and prescribed; not every person with heart failure needs the same limit. Connect weight, intake/output, edema, lung findings, symptoms, kidney function, and diuretic response."],
    relatedTopics: ["Low-Sodium Diet", "Fluid Restriction", "Heart-Healthy Nutrition"],
    sourceKeys: ["w45p-aha-hf-2022"]
  });
  patchPathology("Chronic kidney disease", {
    nutritionConnections: ["Renal Nutrition individualizes sodium, potassium, phosphorus, protein, and fluid according to CKD stage, serial laboratory values, dialysis, urine output, medicines, comorbidities, appetite, and nutritional status; CKD does not mean restrict everything."],
    relatedTopics: ["Renal Nutrition", "Potassium Considerations in Kidney Disease", "Phosphorus Considerations in Kidney Disease", "Protein Considerations in Kidney Disease", "Fluid Restriction", "Low-Sodium Diet"],
    sourceKeys: ["w45p-kdigo-ckd-2024"]
  });
  ["Type 1 diabetes mellitus", "Type 2 diabetes mellitus"].forEach((name) => patchPathology(name, {
    nutritionConnections: ["Consistent-Carbohydrate / Diabetes Nutrition coordinates carbohydrate amount and quality, meal timing, glucose patterns, activity, and medicines. It is an individualized strategy rather than one universal 'diabetic diet.'"],
    relatedTopics: ["Consistent-Carbohydrate / Diabetes Nutrition"],
    sourceKeys: ["w45p-ada-nutrition-2026"]
  }));
  patchPathology("Celiac disease", {
    nutritionConnections: ["A strict Gluten-Free Diet is the disease-directed nutrition treatment after appropriate diagnostic evaluation; starting it before testing can make diagnosis harder."],
    relatedTopics: ["Gluten-Free Diet"],
    sourceKeys: ["w45p-niddk-celiac"]
  });
  patchPathology("Stroke", {
    swallowingConnections: ["Stroke can cause dysphagia, aphasia, both, or neither. Complete a validated dysphagia screen before food, fluid, or oral medication, or keep the patient NPO until safety is established; formal evaluation determines individualized food texture, liquid consistency, route, and strategies."],
    relatedTopics: ["Dysphagia", "Aspiration prevention", "Food Texture Modification and IDDSI", "Liquid Consistency and Thickened Liquids", "Post-stroke dysphagia screening"],
    sourceKeys: ["w45p-aha-stroke-screen"]
  });
  patchPathology("Cirrhosis", {
    nutritionConnections: ["Low-Sodium Diet may be used for cirrhotic ascites, but the target must balance fluid control with appetite and malnutrition risk. Routine fluid or protein restriction is not appropriate for every patient."],
    relatedTopics: ["Low-Sodium Diet", "Fluid Restriction"],
    sourceKeys: ["w45p-aasld-ascites"]
  });
  patchPathology("Crohn disease", {
    nutritionConnections: ["Low-Fiber Nutrition may be used temporarily during selected symptomatic flares, stricturing disease, or obstruction risk, but it is not a lifelong universal Crohn diet and should be reassessed as inflammation and tolerance change."],
    relatedTopics: ["Low-Fiber Nutrition"],
    sourceKeys: ["w45p-medlineplus-low-fiber"]
  });

  pathologyDatabase.componentVersions = { ...(pathologyDatabase.componentVersions || {}), wave45NutritionSwallowing: VERSION };
  pathologyDatabase.latestExtensionVersion = VERSION;
  pathologyDatabase.diseaseCount = pathologyDatabase.diseases.length;
  window.ANI_PATHOLOGY_DATABASE = pathologyDatabase;

  const mergeEntry = (existing, incoming) => {
    const merged = { ...(existing || {}), ...incoming };
    ["aliases", "abbreviations", "commonMisspellings", "searchTerms", "relatedTopics", "tags", "sourceKeys"].forEach((field) => {
      merged[field] = unique([...(Array.isArray(existing && existing[field]) ? existing[field] : []), ...(Array.isArray(incoming[field]) ? incoming[field] : [])]);
    });
    merged.sections = Array.isArray(incoming.sections)
      ? incoming.sections.map((section) => Array.isArray(section) ? section.slice() : { ...section })
      : [];
    return merged;
  };

  const existingEntryIndex = new Map(foundationDatabase.entries
    .map((entry, index) => [normalize(entry && entry.name), index])
    .filter(([key]) => key));
  let inserted = 0;
  let improved = 0;
  entries.forEach((entry) => {
    const key = normalize(entry.name);
    const index = existingEntryIndex.get(key);
    if (Number.isInteger(index)) {
      foundationDatabase.entries[index] = mergeEntry(foundationDatabase.entries[index], entry);
      improved += 1;
    } else {
      existingEntryIndex.set(key, foundationDatabase.entries.length);
      foundationDatabase.entries.push(entry);
      inserted += 1;
    }
  });

  const replacementByLegacyName = new Map([
    ["enteral feeding formula", entries.find((entry) => entry.name === "Enteral Nutrition / Tube Feeding")],
    ["total parenteral nutrition", entries.find((entry) => entry.name === "Parenteral Nutrition (PN/TPN)")],
    ["tpn", entries.find((entry) => entry.name === "Parenteral Nutrition (PN/TPN)")]
  ]);
  const legacyPharmDuplicateRecords = [];
  const legacyPharmDrugs = window.ANI_PHARM_DATABASE && Array.isArray(window.ANI_PHARM_DATABASE.drugs)
    ? window.ANI_PHARM_DATABASE.drugs
    : [];
  legacyPharmDrugs.forEach((drug) => {
    const key = normalize(drug && (drug.name || drug.generic || drug.displayName));
    const replacement = replacementByLegacyName.get(key);
    if (!replacement || !drug || typeof drug !== "object") return;
    drug.aniSearchSuppressed = true;
    drug.aniSearchSuppressionReason = "Superseded by the richer reviewed Wave 45 nutrition-support reference.";
    drug.supersededByReferenceName = replacement.name;
    drug.supersededByDirectTargetId = replacement.directTargetId;
    legacyPharmDuplicateRecords.push(Object.freeze({
      legacyName: String(drug.name || drug.generic || drug.displayName || ""),
      replacementName: replacement.name,
      replacementTargetId: replacement.directTargetId
    }));
  });

  foundationDatabase.entries.sort((left, right) => String(left && left.name || "").localeCompare(String(right && right.name || "")));
  foundationDatabase.cohorts = { ...(foundationDatabase.cohorts || {}), wave45NutritionSwallowing: entries.map((entry) => entry.name) };
  foundationDatabase.componentVersions = { ...(foundationDatabase.componentVersions || {}), wave45NutritionSwallowing: VERSION };
  foundationDatabase.latestExtensionVersion = VERSION;
  window.ANI_FOUNDATIONS_DATABASE = foundationDatabase;
  window[GLOBAL_NAME] = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    applied: true,
    entryCount: entries.length,
    entryNames: Object.freeze(entries.map((entry) => entry.name)),
    inserted,
    improved,
    legacyPharmDuplicateCount: legacyPharmDuplicateRecords.length,
    legacyPharmDuplicateRecords: Object.freeze(legacyPharmDuplicateRecords.slice()),
    sourceKeys: Object.freeze(unique(entries.flatMap((entry) => entry.sourceKeys || [])))
  });
}());
