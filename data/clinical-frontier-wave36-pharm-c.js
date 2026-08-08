/* eslint-disable */
/* Wave 36 pharmacology C: deepen the existing Methylene blue safety card without creating a duplicate drug. */
(function () {
  "use strict";

  const VERSION = "2026-07-20-wave36-methylene-blue-safety-4";
  const SCHEMA_VERSION = 1;
  const CANONICAL = "Methylene blue";
  const GUIDE_CANONICAL = "Methemoglobinemia rescue pathway";
  const normalize = (value) => String(value || "")
    .toLowerCase().replace(/[\u2019']/g, "").replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
  const unique = (values) => Array.from(new Set((values || []).filter(Boolean)));
  const identityKeys = (record) => unique([
    record && record.displayName,
    record && record.name,
    record && record.generic
  ]).map(normalize).filter(Boolean);

  const sourceRefs = Object.freeze({
    "fda-provayblue-2024": Object.freeze({
      label: "FDA PROVAYBLUE prescribing information, NDA 204630/S-023 (2024)",
      url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/204630Orig1s023lbl.pdf"
    }),
    "dailymed-provayblue-current": Object.freeze({
      label: "Current DailyMed PROVAYBLUE prescribing-information record, NDA 204630",
      url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=4f6848e5-35ed-4046-b13c-3032b5ba3232"
    }),
    "aha-methemoglobinemia-2025": Object.freeze({
      label: "American Heart Association 2025 special-circumstances guideline: life-threatening methemoglobinemia",
      url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation"
    }),
    "poison-help": Object.freeze({
      label: "U.S. Poison Help emergency consultation guidance",
      url: "https://poisonhelp.hrsa.gov/faq/calling-poison-help"
    }),
    "clinbiochem-methylene-blue-interference-2025": Object.freeze({
      label: "Clinical Biochemistry 2025 study of methylene-blue interference with laboratory assays and co-oximetry",
      url: "https://pubmed.ncbi.nlm.nih.gov/40320108/"
    })
  });

  const metadata = {
    schemaVersion: SCHEMA_VERSION,
    version: VERSION,
    canonicalName: CANONICAL,
    targetStrategy: "Patch one existing final medication object by exact normalized displayName, name, or generic identity; never append a second drug.",
    sourceRefs,
    application: {
      attemptedTargets: [CANONICAL, GUIDE_CANONICAL],
      appliedTargets: [],
      missingTargets: [],
      databaseGlobal: "",
      collectionName: "",
      medicationMatches: 0,
      selectedMedicationIndex: -1,
      otherMedicationMatchIndexes: [],
      guideMatches: 0,
      removedGuideAliases: [],
      preservedGuideAliases: [],
      sourceReferencesAddedOrUpdated: 0,
      canonicalDrugCountBefore: 0,
      canonicalDrugCountAfter: 0,
      duplicateDrugCreated: false,
      error: ""
    }
  };
  window.ANI_CLINICAL_FRONTIER_WAVE36_PHARM_C = metadata;

  const databaseCandidates = [
    { globalName: "ANI_PHARM_DATABASE", value: window.ANI_PHARM_DATABASE },
    { globalName: "ANI_PHARMACOLOGY_DATABASE", value: window.ANI_PHARMACOLOGY_DATABASE }
  ];
  let resolved = null;
  for (const candidate of databaseCandidates) {
    if (!candidate.value) continue;
    if (Array.isArray(candidate.value.drugs)) {
      resolved = { globalName: candidate.globalName, database: candidate.value, collectionName: "drugs", records: candidate.value.drugs };
      break;
    }
    if (Array.isArray(candidate.value.medications)) {
      resolved = { globalName: candidate.globalName, database: candidate.value, collectionName: "medications", records: candidate.value.medications };
      break;
    }
    if (Array.isArray(candidate.value)) {
      resolved = { globalName: candidate.globalName, database: candidate.value, collectionName: "$self", records: candidate.value };
      break;
    }
  }

  if (!resolved) {
    metadata.application.missingTargets.push("installed pharmacology collection");
    return;
  }

  const db = resolved.database;
  const drugs = resolved.records;
  metadata.application.databaseGlobal = resolved.globalName;
  metadata.application.collectionName = resolved.collectionName;

  const canonicalKey = normalize(CANONICAL);
  const guideKey = normalize(GUIDE_CANONICAL);
  const medicationMatches = [];
  const guideMatches = [];
  drugs.forEach((record, index) => {
    const identities = identityKeys(record);
    if (identities.includes(canonicalKey)) medicationMatches.push({ record, index });
    if (identities.includes(guideKey)) guideMatches.push({ record, index });
  });
  metadata.application.medicationMatches = medicationMatches.length;
  metadata.application.guideMatches = guideMatches.length;
  metadata.application.canonicalDrugCountBefore = medicationMatches.length;

  const diseaseIdentityAliases = new Set([
    "benzocaine cyanosis",
    "chocolate brown blood",
    "dapsone methemoglobinemia",
    "methaemoglobinaemia",
    "methemaglobinemia",
    "methemoglobin high",
    "methemoglobinemia g6pd",
    "saturation gap"
  ].map(normalize));
  const treatmentGuideAliases = [
    "methemoglobinemia treatment",
    "methemoglobinemia emergency treatment",
    "methemoglobinemia rescue guide",
    "refractory methemoglobinemia treatment",
    "what treats methemoglobinemia",
    "methylene blue antidote",
    "ProvayBlue treatment pathway"
  ];

  let guidePatchesApplied = 0;
  guideMatches.forEach(({ record }) => {
    try {
      const priorAliases = Array.isArray(record.aliases) ? record.aliases : [];
      const removed = priorAliases.filter((alias) => diseaseIdentityAliases.has(normalize(alias)));
      record.aliases = unique([
        ...priorAliases.filter((alias) => !diseaseIdentityAliases.has(normalize(alias))),
        ...treatmentGuideAliases
      ]).filter((alias) => normalize(alias) !== guideKey);
      record.relatedTopics = unique([
        ...(Array.isArray(record.relatedTopics) ? record.relatedTopics : []),
        "Methemoglobinemia",
        CANONICAL,
        "G6PD deficiency",
        "Co-oximetry",
        "Serotonin syndrome"
      ]);
      record.relatedConcepts = unique([
        ...(Array.isArray(record.relatedConcepts) ? record.relatedConcepts : []),
        "methemoglobinemia",
        "methylene blue",
        "G6PD deficiency",
        "co-oximetry",
        "serotonin syndrome"
      ]);
      record.wave36AliasOwnershipRevision = VERSION;
      metadata.application.removedGuideAliases.push(...removed);
      metadata.application.preservedGuideAliases.push(...record.aliases);
      guidePatchesApplied += 1;
    } catch (error) {
      metadata.application.error = "Guide alias cleanup: " + String(error && error.message || error || "Unknown mutation error");
    }
  });
  metadata.application.removedGuideAliases = unique(metadata.application.removedGuideAliases);
  metadata.application.preservedGuideAliases = unique(metadata.application.preservedGuideAliases);
  if (guidePatchesApplied) metadata.application.appliedTargets.push(GUIDE_CANONICAL);
  else metadata.application.missingTargets.push(guideMatches.length ? GUIDE_CANONICAL + " (not mutable)" : GUIDE_CANONICAL);

  if (!medicationMatches.length) {
    metadata.application.missingTargets.push(CANONICAL);
    return;
  }

  const richnessScore = ({ record, index }) => {
    let score = index / Math.max(drugs.length, 1);
    if (normalize(record && record.displayName) === canonicalKey) score += 40;
    if (normalize(record && record.name) === canonicalKey) score += 40;
    if (normalize(record && record.generic) === canonicalKey) score += 20;
    if (record && record.antidoteWave32Revision) score += 100;
    ["description", "mechanism", "nursingEssentials", "interactions", "sourceKeys"].forEach((field) => {
      if (record && record[field] && (!Array.isArray(record[field]) || record[field].length)) score += 5;
    });
    return score;
  };
  const selected = medicationMatches.slice().sort((left, right) => richnessScore(right) - richnessScore(left))[0];
  const target = selected.record;
  metadata.application.selectedMedicationIndex = selected.index;
  metadata.application.otherMedicationMatchIndexes = medicationMatches
    .map(({ index }) => index).filter((index) => index !== selected.index);

  const safetyAliases = [
    "Methylene blue safety",
    "methylene blue medication safety",
    "is methylene blue safe",
    "methylene blue contraindications",
    "methylene blue interactions",
    "methylene blue boxed warning",
    "methylene blue serotonin syndrome",
    "can methylene blue cause serotonin syndrome",
    "why is methylene blue dangerous with antidepressants",
    "methylene blue and opioids",
    "methylene blue and dextromethorphan",
    "methylene blue G6PD safety",
    "ProvayBlue safety",
    "methlene blue safety",
    "methylne blue safety",
    "methylthioninium chloride safety"
  ];
  const sourceKeys = Object.keys(sourceRefs);
  const sourceNote = sourceKeys.map((key) => {
    const source = sourceRefs[key];
    return source.label + " (" + source.url + ")";
  }).join("; ");

  const patch = {
    name: CANONICAL,
    generic: "methylene blue",
    displayName: CANONICAL,
    aliases: unique([
      ...(Array.isArray(target.aliases) ? target.aliases : []),
      ...safetyAliases
    ]).filter((alias) => normalize(alias) !== canonicalKey),
    brandExamples: unique([...(Array.isArray(target.brandExamples) ? target.brandExamples : []), "PROVAYBLUE"]),
    class: "NADPH-dependent redox antidote for acquired methemoglobinemia; reversible monoamine-oxidase inhibitor",
    classPathway: [
      "Thiazine oxidation-reduction agent",
      "NADPH-to-leucomethylene-blue electron shuttle",
      "Acquired methemoglobinemia antidote",
      "High-alert serotonergic interaction risk"
    ],
    categories: unique([
      ...(Array.isArray(target.categories) ? target.categories : []),
      "Toxicology, Antidotes, Reversal Agents",
      "Medication Safety"
    ]),
    entryType: "drug",
    usedToTreat: "FDA-approved treatment of acquired methemoglobinemia in pediatric and adult patients when the clinical picture and measured methemoglobin burden justify specialist treatment. It is not a general treatment for cyanosis, low pulse-oximeter readings, sulfhemoglobinemia, carbon-monoxide poisoning, cyanide poisoning, or hereditary dyshemoglobinemia. Vasoplegia, ifosfamide encephalopathy, surgical dye use, and consumer 'wellness' infusions are separate off-label or nontherapeutic contexts whose benefits and risks cannot be inferred from the acquired-methemoglobinemia label.",
    description: "Methylene blue is a hospital-administered thiazine redox antidote for acquired methemoglobinemia: red-cell NADPH-dependent reductase converts it to leucomethylene blue, which shuttles electrons to ferric (Fe3+) methemoglobin and restores oxygen-binding ferrous (Fe2+) hemoglobin. The important question is not simply whether a patient looks blue: ordinary pulse oximetry and arterial oxygen tension can be misleading in dyshemoglobinemia, while other causes of cyanosis require different treatment. Clinicians therefore connect the exposure history, symptoms, co-oximetry, cardiopulmonary reserve, anemia, and tissue-perfusion findings before using a drug that can itself cause oxidative and serotonergic toxicity. PROVAYBLUE is the FDA-labeled 5 mg/mL intravenous product for acquired methemoglobinemia. Current labeling contextualizes treatment as 1 mg/kg over 5 to 30 minutes, with only one repeat one hour later when symptoms persist or methemoglobin remains above 30%; after two unsuccessful doses, the label directs clinicians toward alternatives. For moderate or severe renal impairment (eGFR 15-59 mL/min/1.73 m2), the current label specifies a single 1 mg/kg dose because systemic exposure rises as renal function falls. These facts are label-literacy boundaries, not a bedside calculation or self-treatment protocol: administration belongs in a monitored emergency setting with pharmacy, toxicology, and resuscitation support.",
    mechanism: "Methylene blue works as an electron shuttle. Inside red cells, NADPH-dependent reductase first converts it to leucomethylene blue. Leucomethylene blue then donates reducing equivalents to ferric iron (Fe3+) in methemoglobin, returning it to ferrous iron (Fe2+) so hemoglobin can bind and deliver oxygen again. This explains both the benefit and the G6PD danger: the pentose-phosphate pathway needs G6PD to generate NADPH, so a deficient red cell may be unable to create enough active leucomethylene blue. Treatment can then fail while the oxidant burden of methylene blue promotes severe hemolysis. The relationship is also dose dependent. At useful low exposure the electron shuttle accelerates reduction, but excessive cumulative exposure makes methylene blue an oxidant that can create more methemoglobin and red-cell injury - the opposite of the intended effect. Independently, literature cited in the label identifies methylene blue as a potent reversible monoamine-oxidase inhibitor. Blocking serotonin breakdown can turn an SSRI, SNRI, MAOI, opioid, dextromethorphan, or another serotonergic medicine into a serious serotonin-syndrome interaction. One molecule therefore links red-cell rescue, oxidative toxicity, and neurotransmitter toxicity; every safety check follows from those mechanisms.",
    administrationTiming: [
      "First remove or stop the suspected oxidant, support airway, breathing, circulation, and oxygen delivery, obtain co-oximetry and exposure history, and contact Poison Help or a medical toxicologist. Methylene blue does not remove dapsone, aniline, benzocaine, nitrite, or another ongoing source, so antidote response can be temporary if the cause remains active.",
      "Use the current product label and institutional emergency protocol. The FDA context is PROVAYBLUE 1 mg/kg IV over 5-30 minutes, with one repeat one hour later only when clinical signs persist or methemoglobin remains above 30%; failure after two doses calls for alternatives rather than automatic escalation.",
      "The current label limits eGFR 15-59 mL/min/1.73 m2 to a single 1 mg/kg dose. Any renal function outside a labeled boundary, hepatic impairment, pregnancy, G6PD uncertainty, or major interacting drug exposure requires pharmacist, toxicologist, and treating-specialist judgment rather than extrapolated dosing.",
      "Confirm a patent vein before infusion and never give subcutaneously. The label permits dilution in 50 mL of 5% dextrose to reduce local pain and warns against sodium-chloride dilution because chloride reduces solubility; exact preparation remains a pharmacy-controlled step."
    ],
    boxedWarning: "FDA BOXED WARNING - SEROTONIN SYNDROME WITH CONCOMITANT SEROTONERGIC DRUGS AND OPIOIDS: PROVAYBLUE can cause serious or fatal serotonin syndrome when combined with serotonergic drugs or opioids. The label directs clinicians to avoid concomitant use with SSRIs, SNRIs, MAOIs, and opioids. Dextromethorphan and several other serotonergic medicines are named in the interaction section. If an emergency makes use unavoidable, the label calls for the lowest possible exposure and close observation for central nervous system effects; the treatment team must actively weigh the oxygen-delivery emergency against this interaction risk.",
    contraindications: [
      "G6PD deficiency is a labeled contraindication because inadequate NADPH can prevent formation of active leucomethylene blue while methylene blue adds oxidant stress, producing lack of effect, severe hemolysis, and severe anemia.",
      "A prior severe hypersensitivity reaction to methylene blue or another thiazine dye is a labeled contraindication because re-exposure can provoke anaphylaxis, angioedema, urticaria, or bronchospasm.",
      "Concomitant serotonergic drugs and opioids are governed by the FDA boxed warning to avoid the combination. This is a high-risk interaction requiring an explicit emergency risk-benefit decision and alternative-treatment review, not an undocumented routine override.",
      "Pregnancy is not listed as an absolute contraindication, but methylene blue may cause fetal harm. Severe maternal hypoxia also threatens the fetus, so treatment requires urgent toxicology, maternal-fetal, neonatal, and resuscitation coordination rather than delay or casual use.",
      "Do not treat an isolated low pulse-oximeter value or cyanosis without establishing the likely dyshemoglobin mechanism. Methylene blue does not correct sulfhemoglobin, carboxyhemoglobin, cyanide-impaired cellular respiration, or a primary cardiopulmonary cause and can add toxicity."
    ],
    adverseEffects: [
      "Serotonin syndrome may be serious or fatal. Watch for a connected pattern of agitation or delirium, diaphoresis and hyperthermia, labile blood pressure or tachycardia, tremor, clonus, myoclonus, hyperreflexia or rigidity, seizure, nausea, vomiting, or diarrhea rather than waiting for every feature.",
      "Hemolytic anemia can be delayed by one or more days. Falling hemoglobin, Heinz bodies, indirect hyperbilirubinemia, low haptoglobin, dark urine, jaundice, pallor, or worsening oxygen delivery can reflect treatment-related red-cell destruction; the direct antiglobulin test may remain negative.",
      "Excess exposure can cause paradoxical methemoglobinemia and hemolysis. Reported overdose effects also include hypotension, wheezing, reduced oxygenation, chest discomfort, dyspnea, tachycardia, tremor, confusion, and ECG changes, which is why repeated dosing without reassessment is unsafe.",
      "Anaphylaxis and severe hypersensitivity can cause urticaria, angioedema, bronchospasm, hypotension, or collapse. Headache, nausea, diarrhea, dizziness, visual disturbance, myoclonus, seizure-like phenomena, hypokalemia, hypomagnesemia, hypertension, and phototoxicity are also reported.",
      "Because extravasation places the concentrated dye solution in tissue instead of circulating blood, it can cause local inflammation and injury, explaining reported swelling, induration, pruritus, urticaria, and necrotic ulceration. Because methylene blue and its metabolites are intensely colored and are excreted into urine, blue-green urine, temporary skin or mucosal discoloration, and altered color-based urine tests can occur; these dye effects must not be used as proof that oxygen delivery has normalized because visible dye color and assay interference can occur independently of methemoglobin reduction and tissue perfusion."
    ],
    interactions: [
      "SSRIs, SNRIs, MAOIs, bupropion, buspirone, clomipramine, mirtazapine, linezolid, serotonergic migraine medicines, opioids, dextromethorphan, and other serotonin-enhancing agents can combine with methylene blue's monoamine-oxidase inhibition to cause serotonin syndrome. Reconcile prescriptions, PRN drugs, cough products, perioperative medicines, and supplements rather than asking only about antidepressants.",
      "The current label advises patients not to take serotonergic drugs for 72 hours after the last PROVAYBLUE dose. Medication stopping and restarting must be clinician directed because abrupt interruption can create withdrawal or destabilize the condition being treated.",
      "Dapsone, aniline compounds, and other long-lived or ongoing oxidants can continue generating methemoglobin after an initial response. A rising value is not automatically an indication for unlimited methylene blue; it is a signal to find the cause, reassess hemolysis and G6PD risk, and plan alternatives.",
      "Methylene blue absorbs light in ranges used by monitoring and laboratory instruments. It can lower pulse-oximeter readings, distort some device-dependent co-oximetry results soon after treatment, and interfere with colorimetric or spectrophotometric assays and blue-indicator urine tests. Record the dose and time and notify the laboratory so a surprising result is not mistaken for clinical failure.",
      "The label describes in-vitro inhibition of several CYP and UGT enzymes and P-glycoprotein and transporter effects. The clinical importance is incompletely defined, so hepatic impairment, polypharmacy, and narrow-therapeutic-index drugs warrant prolonged pharmacist review rather than assuming no interaction beyond serotonin."
    ],
    nursingEssentials: [
      "Before treatment, document the suspected oxidant and whether exposure is ongoing; symptom severity and cardiopulmonary reserve; measured weight; baseline co-oximetry; CBC and hemolysis markers; G6PD result or risk; eGFR and hepatic status; pregnancy and lactation; prior thiazine-dye reaction; and a complete serotonergic, opioid, cough-medicine, migraine, psychiatric, perioperative, and supplement history. Each item changes effectiveness, toxicity, or the alternative plan.",
      "Independently verify the product, 5 mg/mL concentration, measured-weight calculation, total milligrams, volume, renal boundary, infusion time, dilution fluid, single-dose container, and repeat eligibility. This double check prevents a concentration or cumulative-dose error that could turn a reducing therapy into an oxidant injury.",
      "Confirm and continuously observe a patent IV site. Stop using a compromised line and escalate pain, swelling, blanching, urticaria, induration, leakage, or loss of blood return through the institutional extravasation pathway because subcutaneous administration is prohibited and tissue injury has been reported.",
      "Trend symptoms, perfusion, mental status, temperature, blood pressure, ECG, respiratory status, and timed co-oximetry. Do not chase an ordinary pulse-oximeter number alone: both methemoglobin and the blue dye alter optical signals, and methylene blue may transiently interfere with some co-oximeters. Reconcile the instrument, sample timing, clinical response, and laboratory advice.",
      "Perform focused serotonin checks for mental-status change, diaphoresis, hyperthermia, bowel symptoms, tremor, ocular or inducible clonus, hyperreflexia, myoclonus, and rigidity. Stop further exposure and initiate the emergency supportive pathway if the syndrome emerges; do not wait for a serum serotonin test because diagnosis is clinical.",
      "Continue CBC, bilirubin, LDH, haptoglobin, reticulocyte, urine, renal, and oxygen-delivery surveillance after the initial color or co-oximetry response because hemolysis can be delayed and dapsone or aniline exposure can rebound. Document the source-control plan and the threshold for toxicology, transfusion, hyperbaric, or exchange-transfusion consultation."
    ],
    keyLabs: [
      "Before treatment when this does not delay rescue: co-oximetry with methemoglobin fraction, CBC, reticulocyte count, bilirubin, LDH, haptoglobin, blood gas, lactate, creatinine/eGFR, hepatic studies, and G6PD testing. A normal PaO2 describes dissolved oxygen and does not prove that hemoglobin is carrying oxygen normally.",
      "After treatment, interpret serial methemoglobin with the exact collection time, co-oximeter model, symptoms, and perfusion. Methylene blue can overlap optical spectra and transiently bias or prevent some co-oximetry measurements, so an immediate unexpected result should trigger laboratory consultation rather than reflex redosing.",
      "Trend hemoglobin and hemolysis markers for at least the clinically appropriate delayed window because label-described anemia may begin one or more days later. A negative direct antiglobulin test does not exclude this oxidant hemolysis.",
      "Use renal function to enforce the eGFR 15-59 single-dose label boundary, and monitor hepatic impairment longer for toxicity and drug interactions because hepatic metabolism and delayed clearance can prolong risk.",
      "Notify the laboratory that methylene blue was administered. Blue urine can interfere with urine tests using a blue indicator, including leukocyte esterase, and other colorimetric or spectrophotometric assays may be method dependent."
    ],
    requiredMonitoring: [
      "Continuous cardiorespiratory, blood-pressure, neurologic, temperature, and IV-site monitoring during emergency treatment",
      "Timed clinical response and serial co-oximetry interpreted with post-dose optical interference in mind",
      "Focused serotonin-syndrome examinations when any serotonergic, opioid, or dextromethorphan exposure is possible",
      "Delayed CBC and hemolysis surveillance rather than stopping when cyanosis improves",
      "Renal and hepatic review that changes repeat eligibility and duration of toxicity monitoring",
      "Rebound surveillance and source control for dapsone, aniline, sulfa, or another persistent oxidant"
    ],
    populationRisks: [
      { population: "G6PD deficiency", note: "This is a labeled contraindication. Low NADPH makes activation ineffective and turns additional oxidant exposure into severe hemolysis risk; repeated treatment is not the solution." },
      { population: "Renal impairment", note: "Methylene-blue and metabolite exposure increases as eGFR falls. The current label limits eGFR 15-59 mL/min/1.73 m2 to one dose and directs persistent cases toward alternatives." },
      { population: "Hepatic impairment", note: "The drug is extensively metabolized in the liver, so the label calls for extended monitoring for toxicity and drug interactions." },
      { population: "Pregnancy and newborn", note: "The label warns of fetal harm and neonatal intestinal, hematologic, respiratory, skin-staining, methemoglobinemia, and photosensitivity effects after exposure. At term, the newborn needs observation; severe maternal hypoxia still demands urgent multidisciplinary treatment." },
      { population: "Breastfeeding", note: "The current label directs discontinuation of breastfeeding during treatment and for up to 8 days afterward because serious infant effects and genotoxicity are possible." },
      { population: "Children, older adults, anemia, or cardiopulmonary disease", note: "The FDA indication includes children, but measured weight and small volumes magnify errors. Reduced reserve can produce severe tissue hypoxia at a lower methemoglobin percentage, while older adults more often have renal impairment and polypharmacy." }
    ],
    escalationRecurrence: [
      "Immediately escalate recurrent cyanosis with dyspnea, chest pain, confusion, seizure, shock, rising lactate, or worsening co-oximetry. Recheck the diagnosis, exposure source, timing, and optical interference before assuming that more methylene blue is safe.",
      "No meaningful response after two label-directed doses, or persistence after the single renal-impairment dose, requires alternative treatment rather than blind repetition. The 2025 AHA guideline supports toxicology-directed exchange transfusion or hyperbaric oxygen as reasonable options for life-threatening disease unresponsive to methylene blue; ascorbic acid is slower and reserved for contraindication or unavailability in that emergency framework.",
      "Stop further methylene blue and provide emergency supportive management for serotonin syndrome, anaphylaxis, severe hemolysis, paradoxical methemoglobinemia, or major extravasation. Involve critical care, medical toxicology, pharmacy, hematology, and other services according to the failing physiology.",
      "A rebound after initial improvement suggests continued oxidant generation, especially with aniline or dapsone, rather than proof of an inadequate first dose. Poison-center consultation, source control, repeated hemolysis assessment, and an alternative oxygen-delivery plan prevent cumulative oxidant injury."
    ],
    redFlags: [
      "Agitation, delirium, fever, diaphoresis, clonus, hyperreflexia, rigidity, seizure, or diarrhea after exposure - possible serotonin syndrome",
      "Wheeze, urticaria, facial or tongue swelling, hypotension, or collapse - possible anaphylaxis",
      "Dark urine, jaundice, pallor, falling hemoglobin, worsening fatigue, or recurrent hypoxia hours to days later - possible hemolysis",
      "Persistent or recurrent cyanosis, dyspnea, chest pain, confusion, seizure, rising lactate, shock, or methemoglobin after label-limited treatment",
      "New infusion-site pain, swelling, induration, leakage, urticaria, blanching, or skin breakdown - possible extravasation injury",
      "Unexpected pulse-oximetry or co-oximetry deterioration immediately after dye exposure that conflicts with the clinical response - possible optical interference requiring laboratory review"
    ],
    patientEducation: [
      "Explain that blue-green urine and temporary blue discoloration of skin or body fluids can follow treatment because the medicine is a dye. These changes can be expected, but new breathlessness, chest pain, confusion, fainting, or recurrent cyanosis still needs urgent assessment.",
      "Seek immediate help for agitation, confusion, sweating, fever, diarrhea, tremor, muscle jerking, clonus, stiffness, seizure, wheezing, hives, or facial swelling. These patterns can signal serotonin syndrome or anaphylaxis rather than ordinary discoloration.",
      "Report dark urine, yellow skin or eyes, unusual pallor, marked fatigue, or worsening shortness of breath after discharge because red-cell destruction may appear a day or more after treatment.",
      "Do not independently restart an antidepressant, opioid, cough medicine containing dextromethorphan, migraine medicine, or other serotonergic product. The label advises avoiding serotonergic drugs for 72 hours after the last dose, and the treating clinician must balance that rule with withdrawal and disease-control needs.",
      "Avoid driving, machinery, and hazardous activity until confusion, dizziness, and visual symptoms have resolved. Follow light-protection advice because phototoxicity has been reported.",
      "Tell the care team about pregnancy or breastfeeding. The label warns of fetal harm and directs interruption of breastfeeding during treatment and for up to 8 days afterward."
    ],
    evidenceLimitations: [
      "The FDA label defines the approved indication, contraindications, interaction warning, and product-specific administration boundaries. It does not establish that off-label vasoplegia, encephalopathy, wellness, oral, or surgical-dye uses have the same benefit-risk balance.",
      "Treatment thresholds cannot be reduced to one percentage because symptoms, anemia, pregnancy, age, cardiopulmonary reserve, exposure persistence, and tissue perfusion change clinical urgency.",
      "The AHA recommendation for methylene blue in life-threatening methemoglobinemia is supported primarily by observational and case evidence. Exchange transfusion, hyperbaric oxygen, and ascorbic acid alternatives have still more limited evidence and require specialist selection.",
      "Co-oximetry interference is instrument and concentration dependent. Pre-treatment co-oximetry remains central to diagnosis, but a post-dose value must be interpreted with device method, timing, and the whole clinical response rather than dismissed or trusted automatically."
    ],
    nclexTraps: [
      "Methylene blue needs G6PD-generated NADPH to become leucomethylene blue; G6PD deficiency can therefore cause both treatment failure and severe hemolysis.",
      "Methylene blue can cause serotonin syndrome. It is not a treatment for serotonin syndrome, and opioids and dextromethorphan belong in the interaction review along with antidepressants.",
      "More antidote is not always more reduction. Excess methylene blue becomes an oxidant and can worsen methemoglobinemia or hemolysis.",
      "A normal PaO2 does not exclude methemoglobinemia because PaO2 measures dissolved oxygen, while the problem is oxidized hemoglobin. Ordinary pulse oximetry is also unreliable, and post-dose dye can transiently interfere with optical assays.",
      "Blue urine or skin after treatment is an expected dye effect, not proof of persistent cyanosis and not proof that tissue oxygen delivery has recovered.",
      "Rebound after dapsone or aniline exposure points to continued oxidant generation and source kinetics; unlimited repeat dosing can add injury instead of solving the cause."
    ],
    relatedTopics: [
      "Methemoglobinemia",
      GUIDE_CANONICAL,
      "G6PD deficiency",
      "Serotonin syndrome",
      "Co-oximetry",
      "Pulse oximetry",
      "Dapsone",
      "Benzocaine",
      "Sulfhemoglobinemia",
      "Exchange transfusion",
      "Hyperbaric oxygen therapy",
      "Poison Help"
    ],
    relatedConcepts: [
      "methemoglobinemia",
      "leucomethylene blue",
      "NADPH",
      "G6PD deficiency",
      "serotonin syndrome",
      "co-oximetry",
      "pulse oximetry",
      "dapsone rebound",
      "oxidative hemolysis",
      "exchange transfusion",
      "hyperbaric oxygen"
    ],
    regulatoryStatus: "PROVAYBLUE (methylene blue) is FDA approved under NDA 204630 for acquired methemoglobinemia in pediatric and adult patients. The current prescribing information carries an FDA boxed warning for serious or fatal serotonin syndrome with concomitant serotonergic drugs and opioids, contraindicates G6PD deficiency and severe thiazine-dye hypersensitivity, and sets product-specific renal and repeat-dose boundaries. Other proposed therapeutic uses are off-label and require separate evidence and specialist review.",
    sourceKeys,
    sourceNote,
    sourceMetadata: [
      { authority: "U.S. Food and Drug Administration", document: "PROVAYBLUE prescribing information", identifier: "NDA 204630/S-023", revision: "2024", role: "Controlling U.S. indication, boxed warning, contraindications, administration, monitoring, and population-risk source" },
      { authority: "DailyMed, U.S. National Library of Medicine", document: "Current PROVAYBLUE structured product label", identifier: "Set ID 4f6848e5-35ed-4046-b13c-3032b5ba3232", accessed: "2026-07-20", role: "Current online label record and product presentation" },
      { authority: "American Heart Association", document: "2025 adult and pediatric special circumstances of resuscitation", identifier: "Methemoglobinemia recommendations", revision: "2025", role: "Life-threatening treatment and refractory-alternative guidance" },
      { authority: "U.S. Poison Help", document: "Poison-center access guidance", accessed: "2026-07-20", role: "Emergency toxicology consultation pathway" },
      { authority: "Clinical Biochemistry", document: "Determining susceptibility of routine clinical biochemistry assays to methylene blue interference", identifier: "PMID 40320108", revision: "2025", role: "Peer-reviewed assay and co-oximetry interference evidence" }
    ],
    searchTerms: unique([...(Array.isArray(target.searchTerms) ? target.searchTerms : []), ...safetyAliases]),
    tags: unique([
      ...(Array.isArray(target.tags) ? target.tags : []),
      "frontier-wave36",
      "medication safety",
      "methylene blue safety",
      "mechanism first",
      "boxed warning",
      "G6PD contraindication",
      "serotonin syndrome",
      "co-oximetry interference",
      "toxicology consultation"
    ]).filter((tag) => !/generated-placeholder|recognition.only|verify-label|hidden-combination-product/i.test(String(tag))),
    confidenceTier: "Curated full study card - FDA label reconciled",
    studentFacing: true,
    hidden: false,
    retired: false,
    expandedIndex: false,
    clinicalFrontierWave36PharmCRevision: VERSION
  };

  try {
    Object.assign(target, patch);
    if (!Array.isArray(db.sourceReferences)) db.sourceReferences = [];
    const sourceReferenceMap = new Map(db.sourceReferences
      .map((reference) => [reference && reference.key, reference]).filter(([key]) => key));
    Object.entries(sourceRefs).forEach(([key, source]) => {
      sourceReferenceMap.set(key, { key, label: source.label, url: source.url });
      metadata.application.sourceReferencesAddedOrUpdated += 1;
    });
    db.sourceReferences = Array.from(sourceReferenceMap.values());
    metadata.application.appliedTargets.push(CANONICAL);
  } catch (error) {
    metadata.application.error = String(error && error.message || error || "Unknown mutation error");
    metadata.application.missingTargets.push(CANONICAL + " (not mutable)");
  }

  metadata.application.appliedTargets = unique(metadata.application.appliedTargets);
  metadata.application.missingTargets = unique(metadata.application.missingTargets);
  metadata.application.canonicalDrugCountAfter = drugs.filter((record) => identityKeys(record).includes(canonicalKey)).length;
  metadata.application.duplicateDrugCreated = metadata.application.canonicalDrugCountAfter > metadata.application.canonicalDrugCountBefore;
}());
