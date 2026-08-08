/* eslint-disable */
/* Opioid analgesia, overdose reversal, OUD treatment, withdrawal, and linked pain physiology. */
(function () {
  window.ANI_PHARM_DATABASE = window.ANI_PHARM_DATABASE || {};
  window.ANI_PATHOLOGY_DATABASE = window.ANI_PATHOLOGY_DATABASE || {};
  const db = window.ANI_PHARM_DATABASE;
  const pathology = window.ANI_PATHOLOGY_DATABASE;
  db.drugs = Array.isArray(db.drugs) ? db.drugs : [];
  pathology.diseases = Array.isArray(pathology.diseases) ? pathology.diseases : [];

  const VERSION = "2026-07-17-opioid-causal";
  const CDC_GUIDELINE = "https://www.cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm";
  const CDC_OUD = "https://www.cdc.gov/overdose-prevention/hcp/clinical-care/opioid-use-disorder-treating.html";
  const CDC_NALOXONE = "https://www.cdc.gov/overdose-prevention/reversing-overdose/about-naloxone.html";
  const FDA_CLASS_2023 = "https://www.fda.gov/drugs/drug-safety-communications/fda-updates-prescribing-information-all-opioid-pain-medicines-provide-additional-guidance-safe-use";
  const FDA_CLASS_2025 = "https://www.fda.gov/news-events/press-announcements/fda-requires-major-changes-opioid-pain-medication-labeling-emphasize-risks";
  const FDA_REVERSAL = "https://www.fda.gov/drugs/postmarket-drug-safety-information-patients-and-providers/information-about-naloxone-and-nalmefene";
  const SAMHSA_TIP = "https://www.samhsa.gov/resource/recovery/medications-opioid-use-disorder";
  const ACOG_OUD = "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/08/opioid-use-and-opioid-use-disorder-in-pregnancy";
  const DAILYMED = "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=";
  const NARCAN_LABEL = "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=784a0e98-c2d6-f845-e053-2991aa0ac4b4";
  const OPVEE_LABEL = "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=999a4269-9e54-4801-b2ac-2a7276f0b94f";
  const LUCEMYRA_LABEL = "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=b748f308-ba71-4fd9-84ec-ec7e0f210885";

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const unique = (values) => Array.from(new Set((values || []).filter(Boolean)));
  const populationRisks = (pediatric, older, pregnancy) => [
    { type: "pediatric", label: "Pediatric caution", note: pediatric },
    { type: "geriatric", label: "Older adult caution", note: older },
    { type: "pregnancy", label: "Pregnancy and lactation", note: pregnancy }
  ];

  const classCard = (card) => ({
    generic: normalize(card.name),
    displayName: card.name,
    classCard: true,
    isDrugClassCard: true,
    entryType: "drug-class-card",
    classExampleNames: card.classExampleNames || [],
    classExampleKeys: (card.classExampleNames || []).map(normalize),
    expandedIndex: false,
    hidden: false,
    studentFacing: true,
    nclexEssential: true,
    templateKey: "curated drug class card",
    confidenceTier: "Curated full study card",
    whyClosureRevision: VERSION,
    replaceExistingAliases: true,
    ...card
  });

  const drugCard = (card) => ({
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
    whyClosureRevision: VERSION,
    replaceExistingAliases: true,
    ...card
  });

  const conceptCard = (card) => ({
    aliases: [], abbreviations: [], riskFactors: [], signsSymptoms: [], diagnostics: [], labs: [], treatments: [],
    nursingPriorities: [], complications: [], contraindications: [], redFlags: [], patientEducation: [], nclexTraps: [], relatedTopics: [],
    hidden: false, studentFacing: true, nclexEssential: true, entryType: "clinical-concept",
    confidenceTier: "Curated full study card", whyClosureRevision: VERSION,
    sourceKeys: ["cdc-opioid-guideline-2022", "fda-opioid-labeling-2025", "samhsa-tip63"],
    ...card,
    tags: unique(["frontier-wave24", "strict why closure", "opioid pharmacology", ...(card.tags || [])])
  });

  const fullAgonistPopulation = populationRisks(
    "Children can develop fatal respiratory depression after small or accidental exposures because body size, formulation, metabolism, and airway reserve make dosing errors disproportionately dangerous; use only the product-specific pediatric indication and secure every dose.",
    "Older, frail, cachectic, pulmonary, sleep-apnea, renal, or hepatic patients can accumulate opioid effect and have less ventilatory reserve, so initiation and dose changes require smaller individualized steps and closer sedation and breathing assessment.",
    "Prolonged exposure during pregnancy can produce neonatal opioid withdrawal because placental transfer creates fetal dependence; uncontrolled maternal pain and opioid use disorder also carry risk, so decisions require coordinated obstetric, pain, addiction, and neonatal care rather than abrupt discontinuation."
  );

  const classCards = [
    classCard({
      name: "Opioid analgesics",
      aliases: ["opioids", "opiate pain medicines", "narcotic pain medicines", "mu opioid agonists", "opioid pharmacology", "what are opioids", "how opioids work", "opiods", "opiod analgesics"],
      class: "Opioid-receptor analgesics with shared pain-modulating actions and formulation-specific risks",
      classExampleNames: ["Morphine", "Hydromorphone", "Fentanyl", "Oxycodone", "Hydrocodone", "Codeine", "Tramadol", "Tapentadol", "Methadone", "Buprenorphine"],
      classPathway: ["Pain pharmacology", "Mu-opioid receptor signaling", "Analgesia balanced against ventilation, arousal, bowel, and reward effects"],
      usedToTreat: "Opioid analgesics can be appropriate for selected severe acute, postoperative, cancer-related, palliative, or persistent pain when expected benefit exceeds risk and nonopioid or nonpharmacologic options are inadequate. Methadone and buprenorphine also have distinct roles in opioid use disorder, but the indication, formulation, dose logic, and monitoring are not interchangeable with pain treatment.",
      description: "Opioids do not erase the cause of pain. They reduce nociceptive transmission in the spinal cord and brain and change the emotional salience of pain, which can improve function while tissue injury remains. The same mu-receptor signaling also reduces respiratory drive, arousal, cough, and gastrointestinal propulsion and engages reward circuits. This shared biology explains why analgesia, sedation, constipation, tolerance, physical dependence, misuse, and overdose travel together. A safe choice therefore starts with the pain mechanism, treatment goal, prior exposure, organ function, interacting sedatives, formulation, and reassessment plan rather than a simple strong-versus-weak ranking.",
      mechanism: "Mu, delta, and kappa opioid receptors are inhibitory G-protein-coupled receptors. Agonist binding reduces adenylyl cyclase signaling, closes presynaptic voltage-gated calcium channels, opens postsynaptic potassium channels, and hyperpolarizes neurons. Less calcium entry reduces glutamate and substance-P release from nociceptive afferents, while potassium efflux makes second-order neurons less likely to fire. Supraspinal and descending pathways further change pain perception. Mu signaling in brainstem respiratory networks simultaneously blunts the response to carbon dioxide and hypoxia, while enteric signaling reduces propulsive motility and secretion. Because these desired and harmful effects share receptors, no routine full agonist provides analgesia without respiratory, sedation, bowel, dependence, and overdose risk.",
      boxedWarning: "Current U.S. opioid analgesic labeling emphasizes addiction, abuse, misuse, life-threatening respiratory depression, accidental ingestion, neonatal opioid withdrawal, and profound sedation or death with benzodiazepines, alcohol, gabapentinoids, or other CNS depressants because effects converge on breathing and arousal. Product-specific CYP, formulation, pediatric, and route warnings still matter, so a class warning never replaces the actual label.",
      adverseEffects: [
        "Sedation and respiratory depression arise because mu signaling suppresses arousal and brainstem ventilatory response; new difficulty staying awake can therefore be an earlier danger sign than a low oxygen saturation.",
        "Constipation persists because enteric mu receptors inhibit propulsion and secretion, so tolerance to analgesia does not reliably protect the bowel and prevention often must begin with therapy.",
        "Nausea, vomiting, pruritus, urinary retention, orthostasis, miosis, endocrine effects, sleep-disordered breathing, tolerance, dependence, and opioid-induced hyperalgesia reflect receptor effects beyond the pain pathway."
      ],
      contraindications: [
        "Do not use an opioid as the only answer to an undiagnosed pain syndrome because infection, ischemia, compartment syndrome, hemorrhage, or neurologic compression can progress while perception is muted.",
        "Avoid active significant respiratory depression, unmonitored severe asthma, or known or suspected gastrointestinal obstruction according to product labeling because additional mu effect can cause apnea or ileus.",
        "Do not abruptly stop long-term therapy in a physically dependent person unless an immediate life threat requires a different emergency plan because sudden withdrawal, uncontrolled pain, loss of trust, and unsafe self-treatment can follow."
      ],
      nursingEssentials: [
        "Assess pain mechanism, function goal, sedation, respiratory rate and depth, oxygenation context, blood pressure, bowel and bladder function, sleep apnea, organ function, prior opioid exposure, and co-sedatives because a pain score alone cannot show ventilatory safety.",
        "After initiation, dose increase, route change, or interacting-drug change, reassess when that formulation is expected to peak because respiratory depression can deepen after the patient first reports relief.",
        "Teach secure storage, no sharing, product-specific administration, overdose signs, access to an approved reversal agent, and disposal because accidental and household exposure can be fatal."
      ],
      interactions: [
        "Benzodiazepines, alcohol, gabapentinoids, sedating antihistamines, muscle relaxants, sleep medicines, antipsychotics, and other CNS depressants can produce additive sedation and hypoventilation even when neither dose seems extreme alone.",
        "CYP3A4 or CYP2D6 inhibition and induction can raise toxicity or reduce analgesia for specific opioids, while methadone, codeine, tramadol, fentanyl, and buprenorphine have especially important product-specific interaction logic.",
        "Mixed agonist-antagonists or high-affinity partial agonists can reduce full-agonist effect or precipitate withdrawal in a dependent patient because receptor occupancy changes abruptly."
      ],
      keyLabs: [
        "There is no universal therapeutic opioid level, so timed clinical assessment of arousal, ventilation, pain, function, and adverse effects is more useful than a routine serum concentration.",
        "Renal and hepatic function matter because parent drug or active and neuroexcitatory metabolites can accumulate, while ECG and electrolytes become important with methadone or other QT-prolonging contexts.",
        "A urine drug test can support exposure assessment but cannot by itself diagnose impairment, dose taken, opioid use disorder, or respiratory safety because detection windows and assays vary."
      ],
      nclexTraps: [
        "Opiate often refers to naturally derived compounds, whereas opioid includes natural, semisynthetic, synthetic, and endogenous receptor-active substances; clinical safety principles overlap.",
        "Tolerance, physical dependence, and opioid use disorder are related but not synonymous.",
        "Naloxone treats receptor-mediated respiratory depression temporarily; it does not replace ventilation, emergency evaluation, or monitoring for recurrent toxicity."
      ],
      populationRisks: fullAgonistPopulation,
      sourceNote: "Educational synthesis grounded in the CDC 2022 opioid guideline (" + CDC_GUIDELINE + ") and FDA 2023 and 2025 class-labeling communications (" + FDA_CLASS_2023 + "; " + FDA_CLASS_2025 + ").",
      sourceKeys: ["cdc-opioid-guideline-2022", "fda-opioid-labeling-2023", "fda-opioid-labeling-2025"],
      tags: ["frontier-wave24", "opioids", "mu receptor", "analgesia", "respiratory depression", "constipation", "strict why closure"]
    }),

    classCard({
      name: "Opioid selection, formulation, and incomplete cross-tolerance",
      aliases: ["opioid conversion", "equianalgesic opioid conversion", "opioid rotation", "morphine milligram equivalents", "MME conversion", "switching opioids", "IR vs ER opioids", "immediate release versus extended release opioids", "incomplete cross tolerance"],
      abbreviations: ["MME", "MEDD", "IR", "ER", "LA"],
      class: "Clinical reasoning map for route, formulation, organ function, and safer opioid rotation",
      classExampleNames: ["Morphine", "Hydromorphone", "Fentanyl", "Oxycodone", "Hydrocodone", "Methadone", "Buprenorphine"],
      classPathway: ["Analgesic selection", "Immediate-release versus extended-release", "Equianalgesia and incomplete cross-tolerance"],
      usedToTreat: "This card supports clinician-supervised selection and switching when an opioid is justified. It is not a self-dosing calculator because equianalgesic tables estimate population averages and cannot encode individual tolerance, route bioavailability, organ function, genetics, pain change, methadone nonlinearity, or fentanyl-patch absorption.",
      description: "Immediate-release products rise and fall faster and are generally preferred when initiating opioid therapy, while extended-release or long-acting products expose the patient continuously and are reserved for severe persistent pain when alternatives are inadequate. Equal-looking milligram numbers are not equal analgesic doses across drugs or routes. Equianalgesic estimates provide a starting comparison, but tolerance to one opioid does not transfer completely to another. The new opioid is therefore usually started below the calculated equianalgesic amount and titrated from observed response, with additional caution for methadone and transdermal fentanyl.",
      mechanism: "Potency reflects receptor affinity, intrinsic efficacy, access to the CNS, route bioavailability, active metabolites, and clearance rather than tablet milligrams alone. Repeated exposure adapts receptors and neural networks, but those adaptations are opioid- and effect-specific. A person tolerant to morphine analgesia can remain less tolerant to hydromorphone respiratory depression; this incomplete cross-tolerance explains why direct equianalgesic substitution can overdose the patient. Methadone is especially nonlinear because its long variable elimination and delayed respiratory effect outlast analgesia, while fentanyl-patch delivery changes with skin depot, heat, fever, adhesion, and prior tolerance.",
      boxedWarning: "Every conversion can create a high-risk transition because calculation error, formulation confusion, residual old drug, incomplete cross-tolerance, delayed accumulation, or dose dumping can produce fatal respiratory depression. MME is a population risk metric, not a prescription conversion dose; the CDC specifically cautions against using calculated MME as the dose of the new opioid.",
      adverseEffects: [
        "Early oversedation after a switch suggests the new exposure exceeds ventilatory tolerance, while late oversedation can reflect accumulation from a long half-life or impaired clearance.",
        "Withdrawal or uncontrolled pain can occur when the estimate is too low, but automatically increasing the dose can be dangerous until adherence, route, absorption, disease progression, and opioid-induced hyperalgesia are separated.",
        "ER/LA products can prolong respiratory depression because drug continues entering the circulation after the first sign of toxicity."
      ],
      contraindications: [
        "Do not use a web table or MME total as a direct new-opioid prescription because the calculation does not account for incomplete cross-tolerance and individual pharmacokinetics.",
        "Do not start ER/LA opioids for acute, intermittent, or as-needed pain because delayed and prolonged exposure adds overdose risk without solving a short-lived pain mechanism.",
        "Do not use transdermal fentanyl in an opioid-naive patient or expose a patch to external heat because absorption can become fatal."
      ],
      nursingEssentials: [
        "Verify drug, salt, route, formulation, total daily exposure, last dose, breakthrough use, prior tolerance, renal and hepatic function, and the planned reduction from the calculated estimate because each variable changes the safe starting point.",
        "Treat oral, IV, epidural, transdermal, transmucosal, immediate-release, and extended-release products as distinct delivery systems because route and formulation are part of the dose.",
        "Reassess sedation, ventilation, function, pain, withdrawal, and adverse effects through the old drug's washout and the new drug's accumulation window because one early normal check cannot establish safety."
      ],
      interactions: [
        "CYP inhibitors or inducers can convert a previously stable regimen into toxicity or withdrawal because metabolism changes while the prescribed milligrams stay the same.",
        "Benzodiazepines, alcohol, gabapentinoids, and other sedatives increase conversion risk because pharmacodynamic respiratory effects add even without a shared metabolic pathway.",
        "Mixed agonist-antagonists, buprenorphine, or naltrexone can displace or block a full agonist and precipitate withdrawal when receptor transition is mistimed."
      ],
      keyLabs: [
        "Creatinine and estimated kidney function help identify morphine or hydromorphone metabolite accumulation, while hepatic context matters for CYP-metabolized agents and prodrugs.",
        "ECG and potassium, magnesium, and calcium assessment become important when methadone or multiple QT-prolonging factors are present because torsades risk reflects both drug and substrate.",
        "Clinical sedation and ventilation trends remain the decisive monitoring data because no MME threshold eliminates overdose risk."
      ],
      nclexTraps: [
        "One milligram of hydromorphone is not equivalent to one milligram of morphine.",
        "MME compares population exposure; it does not dictate the replacement dose.",
        "Pain relief can fade before methadone's respiratory effect, and fentanyl-patch heat can raise delivery even when the patch dose printed on the label is unchanged."
      ],
      populationRisks: fullAgonistPopulation,
      sourceNote: "CDC 2022 recommendations on IR versus ER/LA therapy, incomplete cross-tolerance, methadone, fentanyl, and MME cautions (" + CDC_GUIDELINE + ") plus FDA opioid labeling updates (" + FDA_CLASS_2023 + ").",
      sourceKeys: ["cdc-opioid-guideline-2022", "fda-opioid-labeling-2023"],
      tags: ["frontier-wave24", "opioid rotation", "MME", "incomplete cross tolerance", "IR", "ER LA", "strict why closure"]
    }),

    classCard({
      name: "Medications for opioid use disorder",
      aliases: ["MOUD", "medication treatment for opioid use disorder", "medication assisted treatment opioids", "MAT for opioid addiction", "OUD medication comparison", "methadone vs buprenorphine vs naltrexone", "opioid addiction medications"],
      abbreviations: ["MOUD", "MAT"],
      class: "Evidence-based OUD treatment with agonist, partial-agonist, and antagonist pathways",
      classExampleNames: ["Methadone", "Buprenorphine", "Naltrexone", "Naloxone"],
      classPathway: ["Addiction medicine", "Opioid use disorder", "Withdrawal suppression, craving control, overdose prevention, and recovery support"],
      usedToTreat: "Methadone, buprenorphine, and naltrexone are FDA-approved medication pathways for opioid use disorder. They are not interchangeable detox aids: methadone is a full mu agonist, buprenorphine a high-affinity partial agonist, and naltrexone an antagonist that requires an opioid-free transition. Naloxone is rescue treatment for overdose, not maintenance treatment.",
      description: "OUD is a chronic, treatable disorder in which opioid use becomes difficult to control and continues despite harm. Methadone and buprenorphine stabilize mu-receptor signaling, suppress withdrawal and craving, and reduce exposure to unpredictable cycles of intoxication and withdrawal. Naltrexone blocks opioid effects after a completed opioid-free interval. Medication choice depends on current opioid exposure, withdrawal, prior response, access, pregnancy, pain, liver and cardiac context, adherence, patient preference, and treatment setting. Detoxification without ongoing OUD medication is not recommended as a stand-alone strategy because return to use after tolerance falls sharply increases overdose risk.",
      mechanism: "Methadone provides sustained full-agonist occupancy, preventing withdrawal when carefully titrated while avoiding the rapid peaks associated with short-acting nonmedical use. Buprenorphine binds mu receptors with high affinity but activates them only partially, which suppresses withdrawal and craving and limits incremental respiratory effect compared with a full agonist, although overdose remains possible with sedatives. Naltrexone occupies receptors without activating them, so it blocks opioid reward but will precipitate withdrawal if opioids remain. These mechanisms explain the transition differences: methadone can begin without waiting for full withdrawal under a supervised protocol, standard buprenorphine induction waits for sufficient withdrawal, and naltrexone requires an opioid-free interval verified by the treatment plan.",
      boxedWarning: "The greatest avoidable risks are untreated OUD, loss of tolerance, sedative co-use, unsafe induction, abrupt discontinuation, and loss of follow-up. Before a start or transition, assess the last opioid exposure, objective withdrawal, sedatives, breathing, methadone QT and electrolyte risk, liver context, pain plan, and continuity of the next dose. Avoid abrupt discontinuation, and escalate for slowed breathing, severe precipitated withdrawal, syncope or palpitations, or suicidal crisis. Methadone can accumulate and prolong QT; buprenorphine can precipitate withdrawal and still depress breathing with CNS depressants; naltrexone can precipitate severe withdrawal and creates overdose vulnerability when blockade ends because tolerance has fallen.",
      adverseEffects: [
        "Methadone can cause sedation, respiratory depression, constipation, sweating, QT prolongation, and accumulation because analgesic relief may end before drug elimination.",
        "Buprenorphine can cause constipation, headache, nausea, sedation, hepatic injury, dental problems with transmucosal products, and precipitated withdrawal when started too early.",
        "Naltrexone can cause nausea, injection-site reactions, liver injury, dysphoria or mood symptoms, and inability to obtain ordinary opioid analgesia while blockade is active."
      ],
      contraindications: [
        "Do not withhold or stop methadone or buprenorphine merely because counseling participation is imperfect because medication itself reduces fatal risk and engagement can improve over time.",
        "Do not start naltrexone while physiologic opioid dependence or acute withdrawal remains because antagonist displacement can produce abrupt severe withdrawal.",
        "Do not treat detoxification as completion of OUD care because reduced tolerance makes a return to the previous amount especially lethal."
      ],
      nursingEssentials: [
        "Use person-first language and assess last opioid, route, fentanyl exposure, withdrawal, overdose history, sedatives, pregnancy, pain, infection, mental health, housing, and treatment preference because the safest entry pathway is individualized.",
        "Continue verified maintenance therapy during hospitalization and coordinate the next dose at transitions because missed treatment can trigger withdrawal, self-discharge, and return to an unpredictable supply.",
        "Provide or arrange overdose-reversal medication and teach the household because treatment reduces risk but does not eliminate relapse or accidental exposure."
      ],
      interactions: [
        "Alcohol, benzodiazepines, and other sedatives add respiratory risk to methadone and buprenorphine, yet FDA and CDC guidance supports careful coordinated treatment rather than automatically withholding OUD medication.",
        "Methadone has many CYP and QT interactions, while buprenorphine and naltrexone have distinct hepatic and formulation considerations that require actual medication reconciliation.",
        "Full agonist analgesia may require specialist planning during buprenorphine or naltrexone treatment because receptor occupancy changes both pain response and overdose risk."
      ],
      keyLabs: [
        "A toxicology result can inform recent exposure but cannot replace the history, withdrawal examination, and shared plan because common assays miss fentanyl or buprenorphine and do not show current impairment.",
        "ECG and electrolytes support methadone safety when QT risk is present, while liver testing supports buprenorphine and naltrexone decisions because hepatic disease can change risk.",
        "Pregnancy testing, infectious-disease screening, and wound assessment are offered according to exposure and consent because OUD care should connect medical risks rather than punish disclosure."
      ],
      nclexTraps: [
        "Methadone and buprenorphine treatment are not substituting one addiction for another; stable receptor occupancy removes withdrawal and craving cycles so recovery and function can improve.",
        "Naloxone reverses overdose for minutes; naltrexone blocks opioids for relapse prevention after an opioid-free transition.",
        "There is no arbitrary universal duration limit for methadone or buprenorphine OUD treatment because discontinuation can restore craving and overdose risk."
      ],
      populationRisks: populationRisks(
        "Adolescent treatment requires developmentally appropriate addiction expertise and family or support involvement consistent with consent and confidentiality because untreated OUD carries high overdose risk.",
        "Older adults have greater interaction, fall, respiratory, cardiac, hepatic, and renal vulnerability, so medication still treats OUD but dosing and monitoring must reflect reserve.",
        "Methadone or buprenorphine is generally preferred for OUD in pregnancy because stable agonist treatment reduces withdrawal and return-to-use risk; maternal treatment should continue with coordinated obstetric and neonatal planning."
      ),
      sourceNote: "CDC OUD treatment guidance (" + CDC_OUD + "), SAMHSA TIP 63 resource (" + SAMHSA_TIP + "), and CDC 2022 guideline (" + CDC_GUIDELINE + ").",
      sourceKeys: ["cdc-oud-treatment", "samhsa-tip63", "cdc-opioid-guideline-2022"],
      tags: ["frontier-wave24", "MOUD", "OUD", "methadone", "buprenorphine", "naltrexone", "strict why closure"]
    }),

    classCard({
      name: "Buprenorphine/naloxone induction and formulation rationale",
      aliases: ["buprenorphine naloxone", "Suboxone", "Zubsolv", "Bunavail", "why naloxone is in Suboxone", "Suboxone induction", "starting Suboxone", "bup nal", "bupe naloxone"],
      class: "Combination OUD formulation and induction reasoning card",
      classExampleNames: ["Buprenorphine", "Naloxone"],
      classPathway: ["Opioid use disorder", "High-affinity partial agonism", "Route-dependent naloxone deterrence and safe transition"],
      usedToTreat: "Buprenorphine/naloxone transmucosal products treat opioid use disorder as part of a complete, individualized plan. Buprenorphine provides the maintenance effect. Naloxone contributes little when the product is used correctly by the approved transmucosal route but becomes more bioavailable when injected, which is intended to discourage parenteral misuse rather than to improve buprenorphine analgesia.",
      description: "Buprenorphine suppresses withdrawal and craving through high-affinity partial mu-receptor activation, while naloxone discourages injection because that route makes the antagonist more systemically available. The slash therefore marks a fixed combination, not interchangeable tablets of buprenorphine and naloxone. Buprenorphine can replace a lower-affinity full agonist and abruptly reduce net receptor activation if started before adequate transition, causing precipitated withdrawal. Standard induction therefore uses objective withdrawal and opioid timing, while selected clinicians may use alternative low-dose or high-dose strategies in specific settings. The naloxone component does not prevent ordinary opioid overdose after the medication is swallowed or dissolved as directed and does not eliminate the need for take-home overdose reversal.",
      mechanism: "Transmucosal buprenorphine enters systemic circulation and occupies mu receptors strongly, producing enough partial activation to suppress withdrawal and craving while limiting the incremental effect seen with escalating full agonists. Naloxone has poor transmucosal bioavailability and extensive first-pass metabolism, so it contributes little to the intended sublingual or buccal maintenance effect. If the product is injected, naloxone becomes systemically available and can antagonize opioid receptors, which can provoke withdrawal in a dependent person. Because buprenorphine itself can displace fentanyl, heroin, methadone, or prescription full agonists, induction timing remains important even though the product contains naloxone.",
      boxedWarning: "Life-threatening respiratory depression can still occur, especially with benzodiazepines, alcohol, gabapentinoids, or other CNS depressants, because partial agonism is a safety advantage rather than immunity. Accidental pediatric exposure, precipitated withdrawal, hepatic injury, dental adverse events with transmucosal products, and abrupt discontinuation require active prevention.",
      adverseEffects: [
        "Headache, nausea, constipation, sweating, insomnia, sedation, and oral mucosal or dental problems can occur because systemic buprenorphine and local formulation exposure affect multiple tissues.",
        "Precipitated withdrawal presents as abrupt worsening soon after administration because high-affinity buprenorphine displaces a full agonist before dependence physiology is ready.",
        "Injection or other nonprescribed routes can create unpredictable buprenorphine and naloxone exposure and add infection, embolic, withdrawal, and overdose risks."
      ],
      contraindications: [
        "Do not equate a fixed buprenorphine/naloxone product with naloxone rescue spray because the formulation, route, dose, and clinical purpose are entirely different.",
        "Do not use a rigid clock alone to start treatment after fentanyl or methadone because tissue persistence and individual withdrawal may outlast ordinary timing assumptions.",
        "Do not swallow, inject, or change the route because bioavailability and the naloxone contribution change with delivery."
      ],
      nursingEssentials: [
        "Verify the exact product, route, last opioid, long-acting or fentanyl exposure, objective withdrawal, prior induction history, pregnancy, liver context, and sedatives because these factors determine the transition plan.",
        "Teach correct placement and dissolution, oral rinsing and delayed brushing according to labeling, secure storage, and overdose-reversal access because good technique protects both efficacy and dental or household safety.",
        "If symptoms abruptly worsen after the first dose, assess timing, objective withdrawal, hydration, agitation, vomiting, pain, and respiratory status and escalate to the treatment protocol because abandonment of care can raise return-to-use risk."
      ],
      interactions: [
        "Benzodiazepines and other sedatives raise respiratory risk, but coordinated treatment and monitoring are safer than reflexively denying OUD medication.",
        "CYP3A4 inhibitors or inducers can change buprenorphine exposure, while severe hepatic impairment can affect both components and makes product selection formulation-specific.",
        "Naltrexone blocks buprenorphine and should not be started until the opioid-free transition is complete because antagonism can precipitate withdrawal."
      ],
      keyLabs: [
        "Objective withdrawal assessment is a clinical measurement rather than a single laboratory result because toxicology can remain positive after pharmacologic effect changes.",
        "Baseline and clinically indicated liver testing help detect hepatic injury because both disease and medication exposure can alter the safety plan.",
        "Dental evaluation is appropriate when symptoms emerge because transmucosal buprenorphine products have been associated with caries, erosion, abscess, and tooth loss."
      ],
      nclexTraps: [
        "The naloxone component is mainly a route-dependent misuse deterrent; buprenorphine provides the therapeutic OUD effect.",
        "Buprenorphine, not swallowed naloxone, is usually responsible for precipitated withdrawal during a mistimed standard induction.",
        "Suboxone is not an emergency overdose-reversal product."
      ],
      populationRisks: populationRisks(
        "Accidental pediatric exposure can cause severe respiratory depression because even a small amount produces high receptor occupancy; store locked and out of sight.",
        "Older adults need closer sedation, fall, interaction, liver, and pulmonary assessment because partial agonism does not remove physiologic vulnerability.",
        "Pregnancy formulation choice is individualized; ongoing effective OUD treatment is prioritized because maternal withdrawal and return to use endanger both patient and fetus."
      ),
      sourceNote: "SAMHSA TIP 63 (" + SAMHSA_TIP + "), CDC OUD guidance (" + CDC_OUD + "), and current U.S. buprenorphine/naloxone labeling (" + DAILYMED + "buprenorphine%20naloxone).",
      sourceKeys: ["samhsa-tip63", "cdc-oud-treatment", "dailymed-buprenorphine-naloxone"],
      tags: ["frontier-wave24", "buprenorphine naloxone", "Suboxone", "partial agonist", "precipitated withdrawal", "strict why closure"]
    }),

    classCard({
      name: "Opioid antagonists: naloxone, nalmefene, and naltrexone",
      aliases: ["opioid antagonist comparison", "naloxone vs naltrexone", "Narcan vs Vivitrol", "naloxone vs nalmefene", "overdose reversal drugs", "opioid blockers"],
      class: "Acute rescue versus sustained opioid-blockade comparison",
      classExampleNames: ["Naloxone", "Nalmefene", "Naltrexone"],
      classPathway: ["Toxicology", "Opioid receptor antagonism", "Emergency reversal versus relapse prevention"],
      usedToTreat: "Naloxone and nalmefene are approved emergency reversal agents for known or suspected opioid overdose, while naltrexone is a longer-acting treatment for opioid and alcohol use disorders after the required opioid-free transition. The shared antagonist mechanism does not make their onset, duration, route, access, evidence base, or purpose interchangeable.",
      description: "All three occupy opioid receptors without activating them, but timing defines their clinical role. Naloxone is widely available, rapidly acting, and often shorter than the opioid exposure, so recurrent sedation remains possible. Nalmefene nasal spray is another prescription rescue option with longer antagonist exposure, yet its label still requires emergency help, surveillance, and repeat dosing when needed. Naltrexone is not titrated as an overdose rescue; it maintains blockade after detoxification and can create severe precipitated withdrawal if started while dependence remains.",
      mechanism: "Competitive antagonists displace or prevent agonist binding at mu receptors, restoring ventilatory drive when respiratory depression is opioid-mediated. They also reverse analgesia and can abruptly expose dependence physiology, producing pain, vomiting, diarrhea, agitation, sympathetic activation, and craving. Rescue response depends on antagonist delivery, agonist affinity and amount, time to ventilation, co-ingestants, and hypoxic injury. Naltrexone's sustained blockade changes relapse dynamics rather than serving as moment-to-moment resuscitation, while loss of tolerance during blockade makes attempts to override it or return after it ends especially dangerous.",
      boxedWarning: "An antagonist cannot ventilate a patient, reverse non-opioid sedatives, remove an airway obstruction, or guarantee lasting recovery. Emergency services, breathing support, continued observation, and product-specific repeat dosing remain essential because recurrent respiratory depression, severe withdrawal, aspiration, arrhythmia, pulmonary complications, and hypoxic injury can persist.",
      adverseEffects: [
        "Acute rescue can precipitate withdrawal because receptor activation falls abruptly, producing vomiting, diarrhea, pain, agitation, hypertension, tachycardia, and rarely serious cardiovascular stress.",
        "Nalmefene's longer action may prolong antagonist effects and withdrawal, while naloxone's shorter action more often creates concern for recurrent toxicity after initial response.",
        "Naltrexone can cause nausea, liver injury, mood symptoms, and injection-site reactions and prevents ordinary opioid analgesia while blockade is active."
      ],
      contraindications: [
        "Do not use naltrexone as a substitute for naloxone or nalmefene in an active overdose because it is not the community rescue formulation or response pathway.",
        "Do not withhold rescue antagonist because the substance is uncertain when opioid overdose is plausible; giving naloxone to a non-opioid emergency generally does not worsen it, while ventilation and diagnosis continue.",
        "Do not let antagonist administration delay emergency activation or rescue breathing because hypoxia, not the pupil size, causes the immediate injury."
      ],
      nursingEssentials: [
        "Prioritize responsiveness and breathing, activate emergency response, give the available approved rescue product, support ventilation, and repeat using a new device according to its label because one dose may be insufficient or may wear off.",
        "Observe for recurrent sedation, slowed breathing, aspiration, pulmonary edema, withdrawal, pain, agitation, and co-ingestant effects because waking up is not the same as being medically stable.",
        "Before naltrexone, verify the opioid-free transition and pain plan because antagonist blockade can precipitate withdrawal and complicate emergency analgesia."
      ],
      interactions: [
        "High-affinity or partial agonists such as buprenorphine may be incompletely reversed and can require repeated rescue and prolonged ventilation support because receptor competition is difficult.",
        "Benzodiazepines, alcohol, xylazine, gabapentinoids, or other co-ingestants are not reversed by opioid antagonists, so persistent sedation requires continued airway, breathing, and diagnostic care.",
        "Attempts to overcome naltrexone blockade with large opioid amounts can be fatal because blockade is surmountable and tolerance may be low."
      ],
      keyLabs: [
        "Overdose reversal is a clinical decision and should not wait for toxicology because assays can miss fentanyl and results arrive after the ventilation emergency.",
        "Glucose, ventilation and acid-base assessment, ECG, acetaminophen level, organ function, pregnancy status, and co-ingestant testing are selected by the presentation because an opioid response does not exclude other toxicity.",
        "Liver assessment supports naltrexone planning because active hepatic injury can change the benefit-risk decision."
      ],
      nclexTraps: [
        "Narcan is naloxone; Vivitrol is extended-release naltrexone; Opvee is nalmefene.",
        "A person can become alert after reversal and then stop breathing again.",
        "Withdrawal after reversal is uncomfortable and sometimes dangerous, but the rescue priority remains restoring ventilation."
      ],
      populationRisks: populationRisks(
        "Emergency naloxone can be used across ages, while nalmefene nasal-spray labeling begins at age 12; product directions and neonatal withdrawal monitoring therefore matter.",
        "Older adults have greater cardiac, pulmonary, aspiration, and co-ingestant vulnerability, so apparent awakening still requires medical evaluation.",
        "Rescue should not be withheld in pregnancy because maternal hypoxia is immediately dangerous; acute withdrawal and fetal status then require emergency obstetric care."
      ),
      sourceNote: "FDA overdose-reversal information (" + FDA_REVERSAL + "), CDC naloxone guidance (" + CDC_NALOXONE + "), and current NARCAN and OPVEE labels (" + NARCAN_LABEL + "; " + OPVEE_LABEL + ").",
      sourceKeys: ["fda-overdose-reversal", "cdc-naloxone", "dailymed-narcan", "dailymed-opvee"],
      tags: ["frontier-wave24", "naloxone", "nalmefene", "naltrexone", "overdose reversal", "strict why closure"]
    })
  ];

  classCards.push(classCard({
    name: "Common opioid-acetaminophen combination products",
    aliases: ["Percocet", "oxycodone acetaminophen", "oxycodone APAP", "Norco", "Vicodin", "Lortab", "hydrocodone acetaminophen", "hydrocodone APAP", "Tylenol 3", "Tylenol #3", "Tylenol with codeine", "acetaminophen codeine", "opioid APAP combinations"],
    class: "Fixed opioid plus acetaminophen products requiring two-toxin and two-dose accounting",
    classExampleNames: ["Oxycodone", "Hydrocodone", "Codeine", "Acetaminophen", "Naloxone"],
    classPathway: ["Combination analgesics", "Mu-opioid effects", "Acetaminophen dose accounting and overdose assessment"],
    usedToTreat: "Percocet combines oxycodone with acetaminophen; Norco, Vicodin, and Lortab commonly combine hydrocodone with acetaminophen; Tylenol with codeine combines codeine with acetaminophen. They treat selected pain when both components are appropriate, but the fixed ratio can prevent independent titration and can hide duplicate acetaminophen exposure.",
    description: "A combination tablet contains two active medicines and therefore two independent toxicity pathways. The opioid can cause sedation, respiratory depression, constipation, dependence, and overdose. Acetaminophen is converted partly to NAPQI; when glutathione is depleted after excessive total exposure, NAPQI damages hepatocytes. A patient may take several branded pain, cold, sleep, or headache products without realizing they share acetaminophen. Naloxone can improve the opioid respiratory component but does nothing to prevent acetaminophen liver injury, which may be clinically silent early and requires time-sensitive concentration interpretation and acetylcysteine decisions.",
    mechanism: "Oxycodone, hydrocodone, or codeine activates mu receptors directly or through active metabolites, inhibiting nociception while suppressing ventilation. Acetaminophen reduces pain through central mechanisms that remain incompletely defined and is normally conjugated safely, but a smaller CYP-mediated fraction forms NAPQI. Glutathione detoxifies NAPQI until excessive exposure overwhelms reserves. This explains the safety split: respiratory depression may appear early and respond to naloxone, while hepatic injury can evolve later despite an awake patient. Brand recognition therefore must trigger exact ingredient, strength, tablet count, and time assessment.",
    boxedWarning: "Current combination-product labeling emphasizes fatal opioid respiratory depression and acetaminophen hepatotoxicity because both components can kill through different mechanisms. Do not let a brand name hide the acetaminophen amount, and do not assume naloxone completes overdose care.",
    adverseEffects: ["Sedation, respiratory depression, nausea, constipation, pruritus, and dependence arise from the opioid component.", "Hepatic injury can occur after excessive acetaminophen because NAPQI exceeds glutathione detoxification, often before dramatic symptoms appear.", "A fixed ratio can create dose-limiting toxicity from one ingredient before the other provides adequate benefit."],
    contraindications: ["Do not combine with other acetaminophen-containing products without calculating the total because duplicate exposure can be hidden across brands.", "Do not use naloxone response to rule out acetaminophen toxicity because receptor reversal does not detoxify NAPQI.", "Do not list acetaminophen as an alias for oxycodone or hydrocodone because that corrupts single-ingredient identity and search safety."],
    nursingEssentials: ["Reconcile generic ingredients, strength per unit, number taken, timing, all OTC products, alcohol or liver context, sedation, and breathing because both components require assessment.", "After suspected excess, pursue poison-center or emergency guidance and time-sensitive acetaminophen testing while treating ventilation because the two pathways run in parallel.", "Teach patients to read the active-ingredient line rather than relying on the front brand name because formulations can change."],
    interactions: ["Alcohol and chronic liver vulnerability can reduce hepatic reserve, while fasting or malnutrition can reduce glutathione because substrate availability changes.", "Benzodiazepines, alcohol, gabapentinoids, and other sedatives add opioid respiratory depression.", "CYP3A and CYP2D6 interactions alter the opioid component according to whether the product contains oxycodone, hydrocodone, or codeine."],
    keyLabs: ["Timed acetaminophen concentration and liver tests guide toxicity care because early symptoms can be minimal.", "Blood gas, ventilation assessment, glucose, renal function, electrolytes, and ECG support severe or mixed overdose care.", "The Rumack-Matthew nomogram applies only to a known single acute immediate-release ingestion at a known time because repeated, extended, or unknown exposures require different interpretation."],
    nclexTraps: ["Percocet is oxycodone plus acetaminophen; Norco and Vicodin are hydrocodone plus acetaminophen; Tylenol #3 is codeine plus acetaminophen.", "Naloxone reverses the opioid component, not acetaminophen toxicity.", "An awake patient can still be developing liver injury."],
    populationRisks: fullAgonistPopulation,
    sourceNote: "Current U.S. opioid/acetaminophen labeling (" + DAILYMED + "oxycodone%20acetaminophen) and FDA opioid safety guidance (" + FDA_CLASS_2025 + ").",
    sourceKeys: ["dailymed-opioid-acetaminophen", "fda-opioid-labeling-2025"],
    tags: ["frontier-wave24", "Percocet", "Norco", "Vicodin", "Tylenol 3", "acetaminophen", "NAPQI", "strict why closure"]
  }));

  classCards.push(classCard({
    name: "Mixed agonist-antagonist opioids: butorphanol, nalbuphine, and pentazocine",
    aliases: ["mixed opioid agonist antagonist", "butorphanol", "Stadol", "nalbuphine", "Nubain", "pentazocine", "Talwin", "kappa agonist mu antagonist", "opioid agonist antagonist comparison"],
    class: "Kappa-agonist and mu-antagonist or partial-agonist opioid comparison",
    classExampleNames: ["Butorphanol", "Nalbuphine", "Pentazocine", "Buprenorphine"],
    classPathway: ["Opioid pharmacology", "Mixed receptor activity", "Analgesia with precipitated-withdrawal and dysphoria constraints"],
    usedToTreat: "Butorphanol, nalbuphine, and pentazocine provide analgesia through mixed opioid-receptor activity in selected settings. They are not simply weaker full agonists. Kappa agonism and mu antagonism or partial agonism can produce analgesia with a ceiling-like pattern for some effects, but can also cause dysphoria, psychotomimetic symptoms, and abrupt withdrawal in a person dependent on a full mu agonist.",
    description: "These agents relieve selected pain by activating kappa receptors while antagonizing or only partially activating mu receptors, so they can precipitate withdrawal when a full agonist is sustaining dependence. Nalbuphine is primarily a kappa agonist and mu antagonist; butorphanol has prominent kappa agonist and partial mu activity; pentazocine has kappa agonism and weak mu antagonism or partial agonism. Their receptor competition can reverse some full-agonist effect while adding kappa effects. This is why they require special caution during methadone treatment, buprenorphine transitions, chronic opioid therapy, or pregnancy OUD care rather than being chosen from the word opioid alone.",
    mechanism: "Kappa-receptor activation can produce spinal analgesia, sedation, dysphoria, and psychotomimetic effects, while mu antagonism or low intrinsic activity can displace a full agonist and lower net mu signaling. In an opioid-naive patient this may provide analgesia; in a physically dependent patient it can abruptly expose autonomic withdrawal. A ceiling on some respiratory effects does not eliminate respiratory depression, especially with other sedatives. Pentazocine can also increase sympathetic tone, which matters in cardiovascular disease.",
    boxedWarning: "Class members and formulations have product-specific serious opioid warnings, and precipitated withdrawal is a central clinical hazard because receptor displacement can be abrupt. Respiratory depression, sedation, misuse, neonatal effects, and CNS-depressant combinations remain relevant despite mixed activity.",
    adverseEffects: ["Sedation, dizziness, nausea, respiratory depression, and constipation occur because opioid receptors remain active.", "Dysphoria, hallucinations, or psychotomimetic effects can occur because kappa signaling differs from ordinary mu analgesia.", "Precipitated withdrawal can occur in a full-agonist-dependent patient because mu receptor activation falls abruptly."],
    contraindications: ["Avoid use in a patient maintained on methadone or another full agonist unless an experienced plan specifically chooses it because withdrawal can be precipitated.", "Avoid butorphanol, nalbuphine, and pentazocine for routine labor analgesia in an undisclosed or known opioid-dependent patient because abrupt maternal and fetal withdrawal can follow.", "Do not assume a respiratory ceiling means overdose-proof because sedatives and vulnerability still cause hypoventilation."],
    nursingEssentials: ["Ask about methadone, buprenorphine, chronic opioids, fentanyl, and pregnancy before administration because dependence may not be volunteered.", "Monitor pain, dysphoria, mental status, withdrawal, sedation, and ventilation because mixed receptor effects can move in different directions.", "If abrupt withdrawal follows, identify the exact agent and activate the withdrawal or OUD pathway rather than labeling the patient allergic."],
    interactions: ["Full mu agonists can have reduced effect or trigger a competition syndrome because receptor occupancy changes.", "Benzodiazepines, alcohol, gabapentinoids, and other sedatives add respiratory depression because central effects converge.", "Other kappa or serotonergic agents have product-specific interactions, so the exact label remains necessary."],
    keyLabs: ["There is no class drug level; assessment is clinical because receptor effect and dependence determine the syndrome.", "Renal and hepatic function guide product selection because clearance differs among agents.", "Blood gas or ventilation assessment is used when sedation is significant because oxygen saturation alone can miss hypercapnia."],
    nclexTraps: ["Mixed agonist-antagonists can precipitate withdrawal in a full-agonist-dependent patient.", "Kappa agonism can cause dysphoria and psychotomimetic effects.", "A ceiling effect is not immunity from respiratory depression."],
    populationRisks: fullAgonistPopulation,
    sourceNote: "Educational synthesis from current U.S. product labeling (" + DAILYMED + "butorphanol; " + DAILYMED + "nalbuphine; " + DAILYMED + "pentazocine) and ACOG peripartum OUD guidance (" + ACOG_OUD + ").",
    sourceKeys: ["dailymed-mixed-opioids", "acog-oud-pregnancy"],
    tags: ["frontier-wave24", "butorphanol", "nalbuphine", "pentazocine", "kappa agonist", "precipitated withdrawal", "strict why closure"]
  }));

  const drugCards = [
    drugCard({
      name: "Morphine",
      aliases: ["morphine sulfate", "MS Contin", "Roxanol", "Kadian", "morphene", "morphin"],
      brandExamples: ["MS Contin", "Roxanol", "Kadian"],
      class: "Prototypic full mu-opioid receptor agonist",
      classPathway: ["Opioid analgesics", "Full mu agonist", "Pain, palliative, and perioperative use by formulation and route"],
      usedToTreat: "Morphine treats selected severe acute or persistent pain and can relieve refractory dyspnea in carefully titrated palliative contexts because reducing central air-hunger perception can reduce distress. Oral, IV, subcutaneous, epidural, intrathecal, immediate-release, and extended-release products are not milligram-for-milligram interchangeable.",
      description: "Morphine activates mu-opioid receptors to reduce severe pain and air-hunger distress, while the same signaling slows ventilation, gastrointestinal propulsion, and cough. It is the reference full agonist used to teach opioid conversion, but reference does not mean universally safest. Hepatic glucuronidation forms morphine-6-glucuronide, which contributes analgesic and respiratory effects, and morphine-3-glucuronide, which is not analgesic and can contribute neuroexcitation. Both depend substantially on renal elimination, so kidney dysfunction can convert an apparently familiar dose into delayed sedation, myoclonus, confusion, or respiratory depression.",
      mechanism: "Morphine activates mu-opioid receptors in spinal, supraspinal, peripheral, enteric, and brainstem networks. Gi/o signaling reduces presynaptic calcium entry and transmitter release and increases postsynaptic potassium conductance, which dampens ascending nociception and changes pain perception. The same inhibition reduces medullary responsiveness to carbon dioxide, so a patient may breathe more slowly and shallowly without experiencing air hunger. Glucuronidation creates M6G with clinically important mu activity and M3G with possible excitatory effects; renal accumulation explains why toxicity can emerge late even after the parent concentration falls.",
      boxedWarning: "Current morphine labeling warns about addiction, abuse, misuse, life-threatening respiratory depression, accidental ingestion, neonatal opioid withdrawal, and profound sedation or death with benzodiazepines or other CNS depressants because full mu effects can accumulate. Extended-release morphine must be swallowed and handled exactly as labeled because crushing or chewing can release a potentially fatal amount.",
      adverseEffects: [
        "Respiratory depression and sedation intensify after initiation, dose increase, route change, or renal decline because parent drug and M6G exposure can rise before staff or family recognize the trend.",
        "Hypotension, histamine-associated flushing or pruritus, nausea, urinary retention, and constipation occur because morphine affects vascular, chemoreceptor, autonomic, and enteric pathways beyond analgesia.",
        "Myoclonus, allodynia, delirium, or paradoxically worsening pain can reflect metabolite neuroexcitation or opioid-induced hyperalgesia, so simply escalating the dose can worsen the mechanism."
      ],
      contraindications: [
        "Avoid significant respiratory depression, unmonitored severe asthma, and known or suspected gastrointestinal obstruction according to labeling because further mu activation can cause apnea or ileus.",
        "Do not substitute oral and parenteral morphine at the same numeric dose because route bioavailability changes systemic exposure.",
        "Do not crush an extended-release product because dose dumping can produce fatal exposure."
      ],
      nursingEssentials: [
        "Assess arousal, respiratory rate and depth, oxygenation context, pain, function, blood pressure, bowel and bladder function, renal function, and co-sedatives before and after dosing because respiratory safety is not captured by pain score alone.",
        "Reassess after the formulation's expected peak and continue trending in renal impairment because active metabolite accumulation can outlast the immediate analgesic window.",
        "Use an anticipatory bowel plan when appropriate and teach overdose recognition and rescue access because constipation and respiratory depression do not wait for severe tolerance."
      ],
      interactions: [
        "Benzodiazepines, alcohol, gabapentinoids, sedating antihistamines, muscle relaxants, and other opioids add CNS and respiratory depression because their effects converge on arousal and ventilation.",
        "Mixed agonist-antagonists or buprenorphine can reduce analgesia or precipitate withdrawal in a dependent patient because they alter receptor occupancy.",
        "Renal-toxic illness or dehydration can indirectly raise morphine-metabolite exposure by reducing clearance."
      ],
      keyLabs: [
        "Creatinine and kidney-function trend help predict M3G and M6G accumulation because both metabolites are renally cleared.",
        "Blood gas or capnography may be used when ventilation is uncertain because oxygen saturation can remain deceptively normal with supplemental oxygen while carbon dioxide rises.",
        "No routine morphine concentration replaces serial sedation and respiratory assessment because clinical effect varies with tolerance and metabolites."
      ],
      nclexTraps: [
        "Morphine is not preferred merely because it is the conversion reference.",
        "Pinpoint pupils support opioid effect but can be absent, and pupil size never replaces breathing assessment.",
        "Naloxone may wear off before morphine or M6G, so recurrent toxicity requires continued surveillance."
      ],
      populationRisks: fullAgonistPopulation,
      sourceNote: "Current U.S. morphine labeling (" + DAILYMED + "morphine%20sulfate) and FDA/CDC opioid safety guidance (" + FDA_CLASS_2025 + "; " + CDC_GUIDELINE + ").",
      sourceKeys: ["dailymed-morphine", "fda-opioid-labeling-2025", "cdc-opioid-guideline-2022"],
      tags: ["frontier-wave24", "morphine", "M3G", "M6G", "renal", "respiratory depression", "strict why closure"]
    }),

    drugCard({
      name: "Hydromorphone",
      aliases: ["hydromorphone hydrochloride", "Dilaudid", "Exalgo", "hydromorphone PCA", "hydromorfon", "hydromophone"],
      brandExamples: ["Dilaudid", "Exalgo"],
      class: "Potent full mu-opioid receptor agonist",
      classPathway: ["Opioid analgesics", "Full mu agonist", "High-potency oral and parenteral pain therapy"],
      usedToTreat: "Hydromorphone treats selected severe pain when an opioid is justified. Its small milligram numbers reflect higher potency, not lower danger, and oral, injectable, and extended-release formulations require separate conversion logic because route and release rate strongly change exposure.",
      description: "Hydromorphone activates mu-opioid receptors to provide potent, titratable analgesia, while the same signaling can suppress breathing and bowel motility. It has no morphine-6-glucuronide, but hepatic glucuronidation produces hydromorphone-3-glucuronide, which lacks analgesic benefit and can accumulate in kidney dysfunction. That metabolite can contribute agitation, allodynia, myoclonus, or confusion. The medication is therefore not automatically renal-safe; it may be preferable to morphine in some settings, yet still requires dose reduction, interval adjustment, and clinical monitoring when clearance is impaired.",
      mechanism: "Mu-receptor activation inhibits presynaptic calcium channels and opens postsynaptic potassium channels, reducing nociceptive transmission while suppressing brainstem respiratory response and enteric motility. Hydromorphone reaches this effect at lower milligram doses than morphine, so a decimal, concentration, route, or PCA-programming error can create a large potency error. Glucuronidation to H3G removes useful analgesic activity but not all biologic consequences; renal retention explains why neuroexcitation and sedation can coexist during repeated dosing in kidney dysfunction.",
      boxedWarning: "Hydromorphone labeling carries serious opioid warnings for addiction, misuse, life-threatening respiratory depression, accidental ingestion, neonatal withdrawal, and CNS-depressant combinations because high potency magnifies dose and concentration errors. Extended-release products are not as-needed therapy and must not be crushed because rapid release can be fatal.",
      adverseEffects: [
        "Oversedation, slow or shallow breathing, hypotension, nausea, pruritus, urinary retention, and constipation arise from full mu effects and can deepen after repeated dosing.",
        "Myoclonus, agitation, cognitive change, or diffuse pain can appear when H3G accumulates because kidney dysfunction reduces metabolite clearance.",
        "Medication error risk is clinically important because multiple injectable concentrations and high potency make a small numeric mistake consequential."
      ],
      contraindications: [
        "Avoid significant respiratory depression, unmonitored severe asthma, and gastrointestinal obstruction according to labeling because further mu effect can cause apnea or ileus.",
        "Do not convert from morphine by matching milligrams because hydromorphone is substantially more potent and cross-tolerance is incomplete.",
        "Do not assume a PCA demand request proves safety because a sedated patient may receive basal infusion or proxy-activated doses despite declining ventilation."
      ],
      nursingEssentials: [
        "Verify concentration, route, pump library, dose units, lockout, basal setting, and prior opioid exposure because hydromorphone errors often arise from delivery details rather than the drug name.",
        "Trend sedation before respiratory rate, respiratory depth, pain and function, renal status, and neuroexcitation because H3G accumulation can change the clinical pattern over time.",
        "Use independent high-alert checks required by policy and never permit family-activated PCA dosing because the patient safety feedback loop depends on the patient being awake enough to press."
      ],
      interactions: [
        "CNS depressants add sedation and hypoventilation because their effects converge even without a CYP interaction.",
        "Other opioids, residual anesthesia, and continuous PCA infusion can stack with demand doses because the patient receives total exposure from every route.",
        "Mixed agonist-antagonists or buprenorphine can reduce effect or precipitate withdrawal because they compete at the mu receptor."
      ],
      keyLabs: [
        "Kidney-function trend matters because H3G accumulates when renal clearance falls.",
        "Ventilation assessment or blood gas becomes appropriate when sedation and breathing disagree with oxygen saturation because supplemental oxygen can mask hypoventilation.",
        "There is no routine hydromorphone level for titration, so serial clinical response is the primary measurement."
      ],
      nclexTraps: [
        "Hydromorphone is not milligram-equivalent to morphine.",
        "Absence of M6G does not mean absence of renal accumulation risk.",
        "Only the patient should activate a PCA demand button unless a specialized device and protocol explicitly provide a different mode."
      ],
      populationRisks: fullAgonistPopulation,
      sourceNote: "Current U.S. hydromorphone labeling (" + DAILYMED + "hydromorphone) and CDC opioid-conversion guidance (" + CDC_GUIDELINE + ").",
      sourceKeys: ["dailymed-hydromorphone", "cdc-opioid-guideline-2022"],
      tags: ["frontier-wave24", "hydromorphone", "Dilaudid", "H3G", "PCA", "high alert", "strict why closure"]
    }),

    drugCard({
      name: "Fentanyl",
      aliases: ["fentanyl citrate", "Duragesic", "Sublimaze", "fentanyl patch", "transdermal fentanyl", "pharmaceutical fentanyl", "fentenyl", "fentynal"],
      brandExamples: ["Duragesic", "Sublimaze"],
      class: "Highly potent, lipophilic full mu-opioid receptor agonist",
      classPathway: ["Opioid analgesics", "Full mu agonist", "Parenteral, transdermal, and transmucosal formulation-specific use"],
      usedToTreat: "Fentanyl is used in anesthesia and selected severe pain pathways according to route. Transdermal fentanyl treats severe persistent pain only in opioid-tolerant patients when alternatives are inadequate; it is not for opioid-naive, acute, intermittent, or as-needed pain because delivery is delayed, continuous, and difficult to titrate quickly.",
      description: "Fentanyl strongly activates mu-opioid receptors to produce potent analgesia and respiratory depression; its high lipophilicity creates rapid CNS effect after IV administration and slow sustained delivery from a transdermal skin depot. External heat, fever, damaged skin, incorrect placement, or multiple patches can increase absorption, while substantial drug remains in skin after patch removal. Pharmaceutical fentanyl used in monitored care is chemically the same active opioid as illicitly manufactured fentanyl, but illicit supply has unpredictable concentration and co-contaminants. A medication card must distinguish source without implying that a prescribed patch is safe outside its tolerance and heat rules.",
      mechanism: "Fentanyl strongly activates mu receptors, suppressing nociceptive transmission, arousal, and respiratory drive. Lipophilicity allows fast brain entry after IV dosing and partitioning into skin and tissues with transdermal use. A patch establishes a depot that continues releasing drug over days, and higher skin temperature increases molecular movement and perfusion, which can raise systemic delivery without any change to the printed patch strength. Hepatic CYP3A metabolism and high potency create additional interaction risk; naloxone can antagonize the receptor, but repeated doses and ventilation may be needed because fentanyl exposure can exceed the antagonist window.",
      boxedWarning: "Fentanyl products warn about addiction, misuse, fatal respiratory depression, accidental exposure, CNS depressants, and product-specific CYP3A interactions. Transdermal systems carry especially important warnings because use in an opioid-naive person or exposure to direct heat has caused fatal overdose.",
      adverseEffects: [
        "Rapid respiratory depression and chest-wall rigidity can complicate high or rapidly delivered parenteral exposure because potent central and skeletal-muscle effects occur quickly.",
        "Sedation, bradycardia, nausea, constipation, pruritus, and urinary retention reflect systemic mu effects even though fentanyl causes less histamine release than morphine.",
        "Patch-related delayed toxicity can persist after removal because fentanyl remains in the skin depot and tissues."
      ],
      contraindications: [
        "Do not use a fentanyl patch in an opioid-naive patient or for acute, postoperative, intermittent, or as-needed pain because delayed continuous delivery can be fatal.",
        "Do not expose the patch to heating pads, electric blankets, hot tubs, saunas, heat lamps, or direct prolonged sun because heat can increase absorption.",
        "Do not cut, damage, share, or apply extra patches because the delivery system can produce uncontrolled exposure."
      ],
      nursingEssentials: [
        "For every patch, verify opioid tolerance, strength in micrograms per hour, application time, site, number of patches present, old-patch removal, skin integrity, fever, and heat exposure because these details determine delivery.",
        "Fold used patches adhesive-to-adhesive and follow current disposal instructions because residual fentanyl can kill a child, pet, or unintended contact.",
        "After removal for toxicity, continue respiratory and sedation monitoring because the skin depot does not disappear immediately."
      ],
      interactions: [
        "Strong CYP3A inhibitors can raise fentanyl exposure, while inducer withdrawal can do the same because metabolic clearance falls.",
        "Benzodiazepines, alcohol, gabapentinoids, anesthesia, and other sedatives add respiratory depression because central effects converge.",
        "Serotonergic medicines can rarely contribute to serotonin syndrome with fentanyl, so clonus, hyperreflexia, agitation, and hyperthermia require a broader diagnosis than opioid overdose alone."
      ],
      keyLabs: [
        "Routine fentanyl screens can be negative on standard opiate immunoassays because fentanyl requires a specific assay, so a negative screen does not exclude exposure.",
        "Ventilation assessment, blood gas, or capnography may reveal hypercapnia before oxygen desaturation when supplemental oxygen is present.",
        "Hepatic function and interacting-drug review matter because CYP3A changes can alter exposure, while temperature is a clinical measurement of patch-delivery risk."
      ],
      nclexTraps: [
        "Fentanyl patches are dosed in micrograms per hour, not milligrams per day.",
        "Removing a patch does not end exposure immediately.",
        "A routine opiate screen may miss fentanyl because many assays target morphine-class metabolites rather than synthetic fentanyl."
      ],
      populationRisks: fullAgonistPopulation,
      sourceNote: "Current U.S. fentanyl transdermal labeling (" + DAILYMED + "fentanyl%20transdermal) and CDC formulation cautions (" + CDC_GUIDELINE + ").",
      sourceKeys: ["dailymed-fentanyl-transdermal", "cdc-opioid-guideline-2022"],
      tags: ["frontier-wave24", "fentanyl", "Duragesic", "patch heat", "opioid tolerant", "CYP3A", "strict why closure"]
    }),

    drugCard({
      name: "Oxycodone",
      aliases: ["oxycodone hydrochloride", "OxyContin", "Roxicodone", "oxycodone IR", "oxycodone ER", "oxicodone", "oxycodon"],
      brandExamples: ["OxyContin", "Roxicodone"],
      class: "Oral full mu-opioid receptor agonist",
      classPathway: ["Opioid analgesics", "Full mu agonist", "Immediate-release and extended-release oral pain therapy"],
      usedToTreat: "Oxycodone treats selected pain severe enough to require an opioid when alternatives are inadequate. Immediate-release and extended-release oxycodone have different roles, and combination products such as oxycodone/acetaminophen add a second drug with its own daily exposure and toxicity ceiling.",
      description: "Oxycodone activates mu-opioid receptors to reduce severe pain, but the same signaling suppresses breathing, arousal, and bowel motility. CYP3A pathways form largely less-active noroxycodone, while CYP2D6 forms the more potent metabolite oxymorphone; parent oxycodone still contributes substantially to effect. Strong CYP3A inhibition or stopping an inducer can raise oxycodone exposure and cause fatal respiratory depression, while induction can lower exposure and provoke pain or withdrawal. OxyContin is extended-release oxycodone, not a generic synonym for every oxycodone tablet. Percocet contains oxycodone plus acetaminophen, so duplicate acetaminophen must be counted separately rather than hidden under the opioid name.",
      mechanism: "Oxycodone activates mu receptors and inhibits nociceptive signaling through reduced presynaptic calcium influx and increased postsynaptic potassium efflux. The same receptor action suppresses ventilatory response, arousal, and gut motility. Oral exposure depends on formulation and hepatic metabolism. CYP3A inhibition shifts clearance downward and can increase parent-drug concentrations, while CYP2D6 variation changes oxymorphone formation without making the parent inactive. Because analgesia and respiratory depression reflect combined parent and metabolite exposure plus tolerance, genotype or one interaction cannot safely predict effect by itself.",
      boxedWarning: "Current oxycodone labeling emphasizes addiction, misuse, life-threatening respiratory depression, accidental ingestion, neonatal withdrawal, CNS-depressant combinations, and CYP3A changes because stable prescribed milligrams can become unstable systemic exposure. Extended-release tablets must remain intact because crushing or chewing can cause fatal dose dumping.",
      adverseEffects: [
        "Sedation, respiratory depression, constipation, nausea, vomiting, pruritus, urinary retention, and orthostasis arise from full mu activity and can deepen during CYP3A inhibition.",
        "Withdrawal and pain can emerge when CYP3A induction lowers exposure or therapy is stopped abruptly because physiologic dependence adapts to the prior receptor level.",
        "Combination-product acetaminophen toxicity can occur independently of opioid symptoms, so a normal respiratory examination does not exclude liver risk after excess Percocet exposure."
      ],
      contraindications: [
        "Avoid significant respiratory depression, unmonitored severe asthma, and gastrointestinal obstruction according to labeling because further mu activation can cause apnea or ileus.",
        "Do not crush extended-release oxycodone because rapid release can deliver a fatal dose.",
        "Do not treat Percocet, oxycodone/acetaminophen, and standalone oxycodone as identical because the nonopioid component changes overdose assessment."
      ],
      nursingEssentials: [
        "Verify IR versus ER, total daily oxycodone, all acetaminophen-containing products, last dose, organ function, and CYP3A or sedative changes because each can alter toxicity.",
        "Trend sedation and ventilation after initiation or interaction changes because a patient can become hypercapnic before appearing cyanotic.",
        "Teach not to split or crush ER tablets and to secure and dispose of unused medicine because accidental exposure can be fatal."
      ],
      interactions: [
        "Azole antifungals, macrolides, protease inhibitors, and other strong CYP3A inhibitors can increase oxycodone exposure, while rifampin-like induction can decrease it because hepatic clearance changes.",
        "Benzodiazepines, alcohol, gabapentinoids, and other CNS depressants add respiratory risk because sedation effects converge.",
        "Combination products can duplicate acetaminophen, aspirin, or ibuprofen, so the exact label must be reconciled rather than assigning those ingredients as oxycodone aliases."
      ],
      keyLabs: [
        "Hepatic and renal context guides dosing because clearance and metabolite handling can change exposure.",
        "Acetaminophen concentration and liver tests are time-sensitive after suspected oxycodone/acetaminophen overdose because opioid reversal does not treat NAPQI toxicity.",
        "Clinical ventilation and arousal remain primary because standard opiate screening cannot quantify dose or respiratory danger."
      ],
      nclexTraps: [
        "OxyContin is extended-release oxycodone; Roxicodone is immediate-release; Percocet is oxycodone plus acetaminophen.",
        "Naloxone reverses the opioid component but not acetaminophen toxicity.",
        "CYP3A inhibitor addition or inducer withdrawal can raise exposure even when the prescription is unchanged."
      ],
      populationRisks: fullAgonistPopulation,
      sourceNote: "Current U.S. oxycodone labeling (" + DAILYMED + "oxycodone) and FDA class safety guidance (" + FDA_CLASS_2025 + ").",
      sourceKeys: ["dailymed-oxycodone", "fda-opioid-labeling-2025"],
      tags: ["frontier-wave24", "oxycodone", "OxyContin", "Roxicodone", "CYP3A", "combination ingredient", "strict why closure"]
    }),

    drugCard({
      name: "Hydrocodone",
      aliases: ["hydrocodone bitartrate", "Hysingla ER", "Zohydro ER", "hydrocodone ER", "hydrocodon", "hydrocone"],
      brandExamples: ["Hysingla ER", "Zohydro ER"],
      class: "Oral full mu-opioid receptor agonist",
      classPathway: ["Opioid analgesics", "Full mu agonist", "Standalone ER and common fixed-combination products"],
      usedToTreat: "Hydrocodone treats selected severe pain and appears in some adult cough products, but product identity is critical. Standalone extended-release hydrocodone is reserved for severe persistent pain, while common immediate-release products combine hydrocodone with acetaminophen and therefore add independent hepatotoxicity risk.",
      description: "Hydrocodone activates mu-opioid receptors to reduce pain and suppress cough, while the same receptor effect can slow breathing and bowel motility. It is metabolized substantially through CYP3A to norhydrocodone and through CYP2D6 to hydromorphone. The parent drug remains clinically active, so CYP2D6 status does not turn hydrocodone simply on or off. CYP3A inhibition or stopping an inducer can raise parent exposure and respiratory risk. Vicodin, Norco, and Lortab are commonly hydrocodone/acetaminophen products rather than hydrocodone alone; Hysingla ER and Zohydro ER are standalone extended-release formulations. Those names must not be collapsed because release pattern and second ingredients change safety.",
      mechanism: "Hydrocodone activates mu receptors to reduce presynaptic nociceptive transmitter release and hyperpolarize postsynaptic neurons. The same pathway suppresses ventilatory response, arousal, cough, and gut motility. CYP3A clearance influences parent exposure, while CYP2D6 forms hydromorphone that may contribute to effect. A strong CYP3A inhibitor can therefore increase hydrocodone toxicity even if CYP2D6 formation falls, and fixed-combination acetaminophen creates a parallel liver-toxicity mechanism unrelated to mu receptors.",
      boxedWarning: "Hydrocodone labeling warns about addiction, misuse, life-threatening respiratory depression, accidental ingestion, neonatal withdrawal, CNS depressants, and CYP3A changes because exposure can rise unexpectedly. Extended-release products must not be crushed, and combination-product labeling adds acetaminophen or other ingredient hazards.",
      adverseEffects: [
        "Sedation, respiratory depression, constipation, nausea, vomiting, dizziness, pruritus, and urinary retention reflect full mu activity.",
        "CYP3A inhibition can prolong toxicity because parent hydrocodone clearance falls, while induction can reduce effect and provoke withdrawal in dependent patients.",
        "Acetaminophen-containing products can cause liver injury after excess total daily exposure even when hydrocodone symptoms are reversed."
      ],
      contraindications: [
        "Avoid significant respiratory depression, unmonitored severe asthma, and gastrointestinal obstruction according to labeling because further mu effect can cause apnea or ileus.",
        "Do not crush or chew ER hydrocodone because dose dumping can be fatal.",
        "Do not use Vicodin, Norco, or Lortab as if they were ingredient-free brand aliases because acetaminophen exposure must be counted."
      ],
      nursingEssentials: [
        "Verify exact product and ingredients, IR versus ER, total acetaminophen, CYP3A changes, sedation, ventilation, and bowel function because the brand name alone does not reveal the full risk.",
        "Teach secure storage and product-specific administration because accidental ingestion or ER manipulation can be fatal.",
        "After overdose of a combination product, pursue both opioid ventilation/reversal care and time-sensitive acetaminophen evaluation because one antidote does not treat both components."
      ],
      interactions: [
        "Strong CYP3A inhibitors can raise hydrocodone exposure, while inducers can lower it because the parent drug depends on hepatic clearance.",
        "Benzodiazepines, alcohol, gabapentinoids, and other sedatives add respiratory depression because pharmacodynamic effects converge.",
        "Duplicate acetaminophen from cold, sleep, or pain products raises liver risk because patients may not recognize the shared ingredient."
      ],
      keyLabs: [
        "Hepatic and renal context guides exposure assessment because metabolism and elimination influence parent and metabolite levels.",
        "Acetaminophen concentration and liver tests are selected after suspected combination-product excess because hepatic injury can initially be silent.",
        "Clinical sedation and ventilation remain primary because toxicology cannot quantify functional respiratory safety."
      ],
      nclexTraps: [
        "Vicodin and Norco contain hydrocodone plus acetaminophen; Hysingla ER and Zohydro ER are standalone extended-release hydrocodone.",
        "Naloxone does not reverse acetaminophen toxicity.",
        "Hydrocodone is active before conversion to hydromorphone, so it is not a simple CYP2D6-only prodrug."
      ],
      populationRisks: fullAgonistPopulation,
      sourceNote: "Current U.S. hydrocodone labeling (" + DAILYMED + "hydrocodone%20bitartrate) and FDA opioid safety guidance (" + FDA_CLASS_2025 + ").",
      sourceKeys: ["dailymed-hydrocodone", "fda-opioid-labeling-2025"],
      tags: ["frontier-wave24", "hydrocodone", "Hysingla", "Zohydro", "CYP3A", "acetaminophen combination", "strict why closure"]
    }),

    drugCard({
      name: "Codeine",
      aliases: ["codeine sulfate", "codeine phosphate", "codein", "codiene", "codeene"],
      brandExamples: [],
      class: "CYP2D6-dependent opioid analgesic and antitussive",
      classPathway: ["Opioid analgesics", "Prodrug-like CYP2D6 activation", "Pain and selected cough formulations"],
      usedToTreat: "Codeine is used for selected pain and cough indications when an opioid is appropriate, but pediatric, postoperative, breastfeeding, genetic-metabolism, and combination-product restrictions are central because conversion to morphine varies widely.",
      description: "Codeine reduces pain and suppresses cough through weak direct mu-opioid receptor activity plus CYP2D6 conversion to morphine, which creates large person-to-person differences in effect. Poor metabolizers may receive little benefit, while ultrarapid metabolizers can generate unexpectedly high morphine concentrations and develop fatal respiratory depression at ordinary doses. CYP2D6 inhibition can reduce analgesia, whereas CYP3A changes alter the amount available for the CYP2D6 pathway. Many products combine codeine with acetaminophen or other ingredients, so the formulation must be read rather than assuming codeine is the only exposure.",
      mechanism: "After absorption, part of the dose is glucuronidated, part is metabolized by CYP3A to norcodeine, and a smaller clinically important fraction is converted by CYP2D6 to morphine. Morphine then activates mu receptors and inhibits nociceptive signaling while suppressing ventilation. Gene copy number and enzyme inhibition create large differences in morphine formation. This explains both treatment failure in poor metabolizers and toxicity in ultrarapid metabolizers, especially in children whose airway or postoperative sleep-disordered breathing further reduces respiratory reserve.",
      boxedWarning: "Codeine labeling warns about addiction, fatal respiratory depression, accidental ingestion, neonatal withdrawal, CNS depressants, complex CYP interactions, and ultrarapid metabolism. It is contraindicated in children younger than 12 and in patients younger than 18 after tonsillectomy or adenoidectomy, and breastfeeding is not recommended during treatment because morphine exposure can harm the infant.",
      adverseEffects: [
        "Sedation, respiratory depression, constipation, nausea, vomiting, pruritus, and urinary retention arise after codeine and morphine receptor activity.",
        "Analgesic failure can occur with CYP2D6 poor metabolism or inhibition because less morphine is formed.",
        "Unexpected severe toxicity can occur with ultrarapid metabolism because morphine forms faster and to a greater extent than the prescribed codeine dose suggests."
      ],
      contraindications: [
        "Do not use codeine in children younger than 12 or after tonsillectomy or adenoidectomy in patients younger than 18 because fatal respiratory depression has occurred.",
        "Avoid breastfeeding during treatment according to current U.S. labeling because a high maternal morphine concentration can expose the nursing infant.",
        "Do not assume a pharmacogenetic result eliminates all risk because dose, co-sedatives, organ function, sleep apnea, and CYP interactions still matter."
      ],
      nursingEssentials: [
        "Verify age, airway surgery, sleep-disordered breathing, breastfeeding, CYP2D6 or CYP3A interacting drugs, exact combination ingredients, and sedation because these factors can transform ordinary dosing into harm.",
        "Count total acetaminophen or other co-formulated ingredients because naloxone addresses opioid toxicity only.",
        "Teach caregivers to seek emergency help for unusual sleepiness, difficulty waking, slow or noisy breathing, or limpness because toxicity can progress rapidly."
      ],
      interactions: [
        "CYP2D6 inhibitors such as some antidepressants can reduce morphine formation and analgesia, while stopping an inhibitor can increase effect because the metabolic pathway reopens.",
        "CYP3A inhibitors or inducer withdrawal can increase codeine available for CYP2D6 conversion and can increase morphine exposure.",
        "CNS depressants add respiratory risk because sedation and ventilatory suppression converge."
      ],
      keyLabs: [
        "CYP2D6 genotype can explain unusual response but is not routinely required for emergency recognition because treatment follows breathing and clinical effect.",
        "Hepatic and renal context matter because metabolism and morphine-metabolite elimination change exposure.",
        "Acetaminophen testing is time-sensitive after excess of a combination product because early liver injury can be clinically silent."
      ],
      nclexTraps: [
        "Codeine is not predictably weak; ultrarapid conversion can make an ordinary dose dangerous.",
        "Post-tonsillectomy or adenoidectomy use under age 18 is contraindicated because unpredictable morphine formation can cause fatal respiratory depression in a vulnerable postoperative airway.",
        "A CYP2D6 inhibitor can reduce analgesia, while ultrarapid CYP2D6 activity can increase toxicity."
      ],
      populationRisks: populationRisks(
        "Codeine is contraindicated under age 12 and after tonsillectomy or adenoidectomy under age 18 because CYP2D6 variability and airway vulnerability have caused deaths.",
        "Older adults have less respiratory, renal, and cognitive reserve, so variable morphine formation increases fall and hypoventilation risk.",
        "Prolonged pregnancy exposure can cause neonatal withdrawal, and breastfeeding is not recommended during treatment because morphine can reach the infant."
      ),
      sourceNote: "Current U.S. codeine sulfate labeling (" + DAILYMED + "codeine%20sulfate) and FDA opioid class guidance (" + FDA_CLASS_2025 + ").",
      sourceKeys: ["dailymed-codeine", "fda-opioid-labeling-2025"],
      tags: ["frontier-wave24", "codeine", "CYP2D6", "ultrarapid metabolizer", "pediatric contraindication", "strict why closure"]
    }),

    drugCard({
      name: "Tramadol",
      aliases: ["tramadol hydrochloride", "Ultram", "ConZip", "tramadol ER", "tramadol IR", "tramodol", "tramadol"],
      brandExamples: ["Ultram", "ConZip"],
      class: "Mixed-mechanism opioid analgesic with monoamine reuptake inhibition",
      classPathway: ["Opioid analgesics", "Weak parent mu agonism plus active M1 metabolite", "Serotonin and norepinephrine reuptake inhibition"],
      usedToTreat: "Tramadol treats selected pain severe enough to require an opioid when alternatives are inadequate. It is still an opioid with respiratory, dependence, and overdose risk, while its monoamine actions add seizure and serotonin-syndrome hazards that are not shared equally by ordinary full agonists.",
      description: "Tramadol reduces pain through two linked actions: modest mu-opioid signaling and inhibition of serotonin and norepinephrine reuptake. CYP2D6 forms O-desmethyltramadol, or M1, with stronger mu activity. Poor metabolizers or CYP2D6 inhibition can reduce M1 analgesia while increasing parent-related serotonergic and seizure effects. Ultrarapid metabolism can raise opioid effect and respiratory risk. This two-pathway pharmacology explains why a patient can have opioid toxicity, serotonin syndrome, seizure, or overlapping features and why naloxone may improve ventilation without treating the entire poisoning.",
      mechanism: "Parent tramadol reduces monoamine reuptake in descending pain-modulating pathways and weakly activates mu receptors, while CYP2D6-generated M1 produces stronger mu activation. Mu signaling reduces nociception and ventilation; excess monoaminergic signaling can produce agitation, hyperreflexia, clonus, fever, diarrhea, and autonomic instability. Tramadol and M1 also lower seizure threshold through incompletely defined excitatory mechanisms. CYP2D6 and CYP3A changes shift the balance between parent and metabolite, so an interaction can alter both analgesia and the type of toxicity rather than simply raising or lowering one effect.",
      boxedWarning: "Tramadol carries opioid boxed warnings for addiction, misuse, life-threatening respiratory depression, accidental ingestion, neonatal withdrawal, CYP interactions, pediatric ultrarapid metabolism, and CNS-depressant combinations because it is not a benign non-narcotic alternative. Current labeling restricts pediatric and post-tonsillectomy or adenoidectomy use.",
      adverseEffects: [
        "Respiratory depression, sedation, constipation, nausea, and dependence reflect parent and M1 mu activity.",
        "Seizures can occur at recommended or excess doses and become more likely with epilepsy, withdrawal states, head injury, or other seizure-threshold-lowering drugs.",
        "Serotonin syndrome can occur with serotonergic medicines or metabolic interactions because parent tramadol increases serotonin signaling."
      ],
      contraindications: [
        "Do not use with an MAOI or within the product-specified 14-day interval because serotonin syndrome or opioid toxicity can be life-threatening.",
        "Do not use in children younger than 12 or after tonsillectomy or adenoidectomy in patients younger than 18 according to current labeling because fatal respiratory depression has occurred.",
        "Avoid treating a seizure-prone or suicidal patient as though tramadol were safer than other opioids because seizure and overdose mechanisms overlap."
      ],
      nursingEssentials: [
        "Reconcile SSRIs, SNRIs, TCAs, MAOIs, linezolid, methylene blue, triptans, antipsychotics, bupropion, alcohol withdrawal, and seizure history because these factors change the toxicity pattern.",
        "Distinguish quiet opioid hypoventilation from clonus, hyperreflexia, agitation, and hyperthermia because naloxone, ventilation, seizure care, and serotonin-syndrome treatment address different mechanisms.",
        "After naloxone in tramadol overdose, continue seizure and respiratory monitoring because reversal may not resolve monoamine toxicity and recurrent opioid effect can occur."
      ],
      interactions: [
        "CYP2D6 inhibitors can reduce M1 formation while raising parent exposure, which can reduce analgesia yet increase seizure or serotonin risk.",
        "CYP3A inhibitors or inducers can alter total tramadol exposure, while serotonergic medicines add serotonin toxicity because monoamine effects converge.",
        "Benzodiazepines, alcohol, gabapentinoids, and other sedatives add respiratory depression even though benzodiazepines may be used clinically to treat seizures under monitoring."
      ],
      keyLabs: [
        "No routine tramadol level predicts the combined opioid, seizure, and serotonin risks, so serial examination and exposure history drive care.",
        "Electrolytes, glucose, renal and hepatic function, ECG, temperature, CK, and acid-base status are selected in toxicity because seizures and hyperthermia can cause secondary organ injury.",
        "A standard opiate immunoassay may not detect tramadol, so a negative screen does not exclude exposure."
      ],
      nclexTraps: [
        "Tramadol is an opioid even though it also affects serotonin and norepinephrine.",
        "Naloxone can improve opioid respiratory depression but does not treat serotonin syndrome or eliminate seizure risk.",
        "CYP2D6 inhibition can produce less analgesia and more parent-related toxicity at the same time."
      ],
      populationRisks: populationRisks(
        "Pediatric restrictions mirror codeine concerns because ultrarapid M1 formation can cause fatal respiratory depression.",
        "Older adults are more vulnerable to seizures, hyponatremia, falls, renal accumulation, polypharmacy, and serotonin toxicity because reserve and clearance decline.",
        "Prolonged pregnancy exposure can cause neonatal withdrawal, and lactation requires product-specific avoidance because infant opioid exposure can suppress breathing."
      ),
      sourceNote: "Current U.S. tramadol labeling (" + DAILYMED + "tramadol%20hydrochloride) and FDA opioid class safety guidance (" + FDA_CLASS_2025 + ").",
      sourceKeys: ["dailymed-tramadol", "fda-opioid-labeling-2025"],
      tags: ["frontier-wave24", "tramadol", "M1", "CYP2D6", "seizure", "serotonin syndrome", "strict why closure"]
    }),

    drugCard({
      name: "Tapentadol",
      aliases: ["tapentadol hydrochloride", "Nucynta", "Nucynta ER", "tapentadol IR", "tapentadol ER", "tapentodol", "tapentado"],
      brandExamples: ["Nucynta", "Nucynta ER"],
      class: "Mixed-mechanism mu-opioid agonist and norepinephrine reuptake inhibitor",
      classPathway: ["Opioid analgesics", "Mu agonism", "Norepinephrine reuptake inhibition"],
      usedToTreat: "Immediate-release tapentadol treats selected severe acute pain when alternatives are inadequate. Extended-release tapentadol treats selected severe persistent pain and has a product-specific indication for severe persistent diabetic peripheral neuropathic pain; ER is not as-needed therapy because prolonged delivery increases overdose risk.",
      description: "Tapentadol combines direct mu-receptor agonism with norepinephrine reuptake inhibition. Unlike tramadol, it does not require CYP2D6 conversion to create its principal opioid activity, so the parent drug is active and genetic activation variability is less central. That does not make it non-opioid or free of respiratory risk. Norepinephrine effects add interaction and autonomic considerations, and labeling also warns about serotonin syndrome with serotonergic medicines. IR and ER products serve different pain contexts, and severe renal or hepatic impairment can make specific formulations inappropriate.",
      mechanism: "Tapentadol directly activates mu receptors to inhibit ascending nociception and suppress ventilation, while blocking norepinephrine reuptake strengthens descending inhibitory pain pathways. The two mechanisms can contribute to analgesia without relying on an active CYP2D6 metabolite. However, mu effects still cause sedation, respiratory depression, constipation, and dependence, and excess monoamine signaling can contribute to agitation, autonomic change, or serotonin toxicity when interacting drugs are present. MAO inhibition can dangerously amplify norepinephrine or opioid effects, which explains the 14-day separation rule in labeling.",
      boxedWarning: "Tapentadol carries current opioid boxed warnings for addiction, misuse, life-threatening respiratory depression, accidental ingestion, neonatal withdrawal, and CNS-depressant combinations because mixed mechanism does not remove full opioid harm. ER tablets must be swallowed whole because crushing can release a potentially fatal dose.",
      adverseEffects: [
        "Sedation, respiratory depression, constipation, nausea, vomiting, dizziness, and dependence arise from direct mu agonism.",
        "Serotonin syndrome can occur with serotonergic co-medications because tapentadol can participate in monoamine toxicity even though norepinephrine reuptake inhibition is its better-established nonopioid mechanism.",
        "Seizure risk can rise in susceptible patients or with threshold-lowering drugs because CNS excitation can add to opioid toxicity."
      ],
      contraindications: [
        "Do not use with an MAOI or within 14 days of stopping one because severe autonomic, serotonergic, or opioid toxicity can occur.",
        "Do not crush, chew, or dissolve ER tapentadol because uncontrolled release can cause overdose and death.",
        "Do not treat Nucynta ER as an as-needed breakthrough product because its extended delivery is designed for persistent exposure."
      ],
      nursingEssentials: [
        "Verify IR versus ER, pain mechanism, kidney and liver function, MAOI and serotonergic exposure, seizure history, sedation, and ventilation because mixed-mechanism toxicity can be misread as routine opioid drowsiness.",
        "Assess clonus, hyperreflexia, temperature, bowel activity, and autonomic instability when agitation accompanies opioid symptoms because serotonin syndrome requires additional care.",
        "Teach intact ER administration, secure storage, and overdose-reversal access because formulation and household exposure determine safety."
      ],
      interactions: [
        "MAOIs are contraindicated within the label interval because norepinephrine and opioid effects can become life-threatening.",
        "SSRIs, SNRIs, TCAs, triptans, linezolid, methylene blue, tramadol, and other serotonergic agents can add serotonin toxicity.",
        "Benzodiazepines, alcohol, gabapentinoids, and other CNS depressants add respiratory depression because mu-mediated ventilation effects converge."
      ],
      keyLabs: [
        "Renal and hepatic function guide product selection because severe impairment can make exposure unpredictable or use not recommended.",
        "Temperature, CK, electrolytes, renal function, and acid-base status support serotonin or seizure complication assessment because hyperthermia and muscle activity can injure organs.",
        "No routine concentration replaces serial sedation and ventilation assessment because parent tapentadol is clinically active."
      ],
      nclexTraps: [
        "Tapentadol is a direct mu agonist plus norepinephrine reuptake inhibitor; tramadol depends more on CYP2D6-generated M1 and has prominent serotonin effects.",
        "Nucynta ER is not a PRN product.",
        "Mixed mechanism does not mean reduced need for naloxone access or respiratory monitoring."
      ],
      populationRisks: fullAgonistPopulation,
      sourceNote: "Current U.S. Nucynta/tapentadol labeling (" + DAILYMED + "tapentadol) and FDA opioid class guidance (" + FDA_CLASS_2025 + ").",
      sourceKeys: ["dailymed-tapentadol", "fda-opioid-labeling-2025"],
      tags: ["frontier-wave24", "tapentadol", "Nucynta", "norepinephrine reuptake", "MAOI", "strict why closure"]
    }),
    drugCard({
      name: "Meperidine",
      aliases: ["meperidine hydrochloride", "Demerol", "pethidine", "meperadin", "meperidene"],
      brandExamples: ["Demerol"],
      class: "Short-acting full mu-opioid agonist with neurotoxic normeperidine metabolite",
      classPathway: ["Opioid analgesics", "Full mu agonist", "Restricted acute-pain use because metabolite toxicity limits duration"],
      usedToTreat: "Meperidine is labeled for selected acute pain severe enough to require an opioid when alternatives are inadequate. It should not be used for chronic pain because repeated exposure allows normeperidine to accumulate and raise seizure and neurotoxicity risk without improving analgesia.",
      description: "Meperidine reduces pain through mu-opioid receptor activation, but repeated exposure can generate the longer-lived neurotoxic metabolite normeperidine. Normeperidine is cleared by the kidneys, so repeated dosing, kidney dysfunction, or prolonged use can produce tremor, agitation, myoclonus, delirium, and seizures even while opioid sedation or respiratory depression is present. Meperidine also has serotonergic interaction risk and a uniquely dangerous relationship with monoamine oxidase inhibitors, so it is not a routine alternative for morphine allergy or a preferred chronic analgesic.",
      mechanism: "Parent meperidine activates mu receptors, inhibiting nociceptive signaling and depressing ventilation and gut motility. N-demethylation forms normeperidine, which has much less useful analgesia but important CNS excitatory activity and a longer elimination profile. Renal dysfunction reduces normeperidine clearance, so neurologic toxicity can worsen after the desired analgesic effect fades. Meperidine also participates in serotonergic signaling, which helps explain hyperthermia, agitation, clonus, autonomic instability, coma, or severe respiratory depression with MAO inhibition and other serotonergic exposures.",
      boxedWarning: "Current labeling emphasizes addiction, life-threatening respiratory depression, accidental ingestion, neonatal withdrawal, CNS depressants, CYP3A changes, and fatal interaction with MAOIs because opioid and monoamine toxicity can overlap. Use with an MAOI or within 14 days is contraindicated, and prolonged treatment is avoided because normeperidine can cause seizures.",
      adverseEffects: [
        "Sedation, respiratory depression, constipation, nausea, hypotension, and dependence arise from parent mu activity.",
        "Tremor, myoclonus, agitation, delirium, and seizures can arise when normeperidine accumulates because it is neuroexcitatory and renally cleared.",
        "Serotonin syndrome or unpredictable severe autonomic and respiratory reactions can occur with MAOIs because monoamine and opioid effects interact."
      ],
      contraindications: [
        "Do not use with an MAOI or within 14 days of one because coma, severe respiratory depression, hyperpyrexia, convulsions, hypertension, or death can occur.",
        "Do not use for chronic pain because normeperidine accumulation adds toxicity without providing a safer long-term pathway.",
        "Avoid substituting meperidine for another opioid solely because of itching or a reported morphine allergy because histamine symptoms, immune allergy, potency, and metabolite risk require separate assessment."
      ],
      nursingEssentials: [
        "Verify MAOI, linezolid, methylene blue, antidepressant, seizure, and kidney history before administration because a routine pain order can hide a high-risk interaction.",
        "Trend tremor, myoclonus, mental status, temperature, reflexes, clonus, sedation, and ventilation because neuroexcitation and opioid depression can coexist.",
        "Escalate repeated or prolonged dosing in kidney dysfunction because stopping accumulation is safer than treating a preventable seizure later."
      ],
      interactions: [
        "MAOIs are contraindicated within the label interval because severe and fatal reactions can combine serotonin, autonomic, and opioid toxicity.",
        "SSRIs, SNRIs, TCAs, linezolid, methylene blue, tramadol, and other serotonergic drugs can add serotonin syndrome risk.",
        "CNS depressants add respiratory depression, while renal impairment increases normeperidine exposure because elimination falls."
      ],
      keyLabs: [
        "Kidney-function trend is central because normeperidine accumulates as renal clearance declines.",
        "Temperature, CK, electrolytes, renal function, and acid-base status support seizure or serotonin-toxicity assessment because hyperthermia and muscle activity can injure organs.",
        "No routine meperidine level replaces clinical neuroexcitation and ventilation assessment because parent and metabolite produce different effects."
      ],
      nclexTraps: [
        "Meperidine is not preferred in kidney dysfunction because normeperidine is renally cleared.",
        "The MAOI interaction is a contraindication, not a minor monitoring suggestion.",
        "Seizure risk can increase with repeated therapeutic dosing because the metabolite accumulates."
      ],
      populationRisks: fullAgonistPopulation,
      sourceNote: "Current U.S. meperidine labeling (" + DAILYMED + "meperidine%20hydrochloride) and FDA opioid class guidance (" + FDA_CLASS_2025 + ").",
      sourceKeys: ["dailymed-meperidine", "fda-opioid-labeling-2025"],
      tags: ["frontier-wave24", "meperidine", "Demerol", "normeperidine", "seizure", "MAOI", "strict why closure"]
    }),

    drugCard({
      name: "Methadone",
      aliases: ["methadone hydrochloride", "Methadose", "Dolophine", "methadone maintenance", "methadone for OUD", "methadone for pain", "methadon", "methadown"],
      brandExamples: ["Methadose", "Dolophine"],
      class: "Long and variably persistent full mu-opioid agonist used for OUD and selected pain",
      classPathway: ["Medications for opioid use disorder", "Full mu agonist", "Distinct analgesic and OUD dosing pathways"],
      usedToTreat: "Methadone treats opioid use disorder through regulated treatment pathways and can treat selected severe persistent pain when prescribed by clinicians familiar with its nonlinear conversion, delayed accumulation, and cardiac risk. OUD and analgesic dosing are not interchangeable because treatment goals, regulations, titration, and monitoring differ.",
      description: "Methadone activates mu-opioid receptors to suppress OUD withdrawal and craving or provide analgesia, but its long, variable half-life can outlast pain relief and silently accumulate. A patient can therefore report pain before the previous dose has cleared, and repeated dosing can stack until sedation and hypoventilation appear days later. Methadone also blocks cardiac potassium current and can prolong QT, while CYP interactions alter exposure. These features make it effective for stable OUD treatment yet unusually hazardous when converted or titrated as though it behaved like morphine.",
      mechanism: "Sustained mu-receptor activation suppresses withdrawal and craving and produces analgesia. Methadone also has NMDA-antagonist and monoamine effects that may contribute clinically, but full mu activity remains the central benefit and overdose mechanism. Tissue distribution and variable metabolism create a long terminal elimination that is poorly predicted by the shorter analgesic response. In cardiac myocytes, hERG potassium-current inhibition delays repolarization and can lengthen QT, so drug exposure, electrolytes, structural disease, bradycardia, and other QT-prolonging medicines combine to determine torsades risk.",
      boxedWarning: "Methadone labeling warns about addiction, life-threatening respiratory depression, accidental ingestion, neonatal withdrawal, CNS depressants, QT prolongation, and multiple CYP interactions because delayed accumulation and arrhythmia can be fatal. It should not be the first routine ER/LA opioid for pain, and pain conversion requires specialist familiarity rather than a simple MME table.",
      adverseEffects: [
        "Delayed sedation and respiratory depression occur because elimination and respiratory effect can outlast analgesia, especially during initiation or dose increase.",
        "QT prolongation and torsades can occur because methadone delays ventricular repolarization, with risk amplified by low potassium or magnesium and interacting drugs.",
        "Constipation, sweating, sexual or endocrine effects, edema, nausea, and dependence reflect sustained opioid exposure."
      ],
      contraindications: [
        "Do not use a linear MME conversion to set a methadone dose because relative potency changes with prior opioid exposure and accumulation is nonlinear.",
        "Do not increase methadone merely because pain returns before the next dose because respiratory-depressant drug may still be accumulating.",
        "Avoid unreviewed combinations with strong CYP or QT-active drugs because exposure and repolarization risk can change in opposite or additive directions."
      ],
      nursingEssentials: [
        "Verify indication, treatment program or pain plan, last observed dose, take-home schedule, sedation, breathing, ECG risk, electrolytes, and interacting medicines because missing one methadone dose is different from duplicating one.",
        "Continue a verified OUD dose during hospitalization and coordinate discharge dosing because interruption can trigger withdrawal and return to use, while duplication can cause delayed overdose.",
        "Reassess over days after initiation or increase because a normal first dose response does not predict steady-state accumulation."
      ],
      interactions: [
        "CYP inhibitors, inducers, or withdrawal of an inducer can change methadone exposure, so additions and discontinuations both require review.",
        "QT-prolonging medicines and low potassium or magnesium add torsades risk because repolarization reserve falls.",
        "Benzodiazepines, alcohol, gabapentinoids, and other sedatives add respiratory risk, yet coordinated treatment is safer than abruptly withholding OUD medication."
      ],
      keyLabs: [
        "ECG and potassium, magnesium, and calcium are assessed according to QT risk because torsades reflects the interaction of drug and physiologic substrate.",
        "Hepatic function and medication review matter because metabolism and interactions can change delayed exposure.",
        "No routine serum level replaces serial sedation, ventilation, craving, withdrawal, and dose-verification assessment because clinical goals differ by indication."
      ],
      nclexTraps: [
        "Methadone's analgesia can wear off before respiratory-depressant exposure clears.",
        "Pain dosing thresholds and MME cautions cannot be transferred directly to OUD maintenance dosing.",
        "A stable daily dose can become unsafe after an interacting drug or electrolyte change."
      ],
      populationRisks: populationRisks(
        "Pediatric exposure can be fatal because long persistence allows delayed respiratory depression; secure every take-home dose.",
        "Older adults have greater QT, interaction, fall, pulmonary, and accumulation risk because physiologic reserve and clearance decline.",
        "Methadone is an established OUD treatment in pregnancy because stable receptor coverage reduces withdrawal and return-to-use risk; neonatal opioid withdrawal is expected and treatable and requires coordinated monitoring."
      ),
      sourceNote: "CDC opioid and OUD guidance (" + CDC_GUIDELINE + "; " + CDC_OUD + "), SAMHSA TIP 63 (" + SAMHSA_TIP + "), and current U.S. methadone labeling (" + DAILYMED + "methadone).",
      sourceKeys: ["cdc-opioid-guideline-2022", "cdc-oud-treatment", "samhsa-tip63", "dailymed-methadone"],
      tags: ["frontier-wave24", "methadone", "OUD", "QT", "accumulation", "nonlinear conversion", "strict why closure"]
    }),

    drugCard({
      name: "Buprenorphine",
      aliases: ["buprenorphine hydrochloride", "Subutex", "Sublocade", "Brixadi", "Butrans", "Belbuca", "buprenorphine partial agonist", "buprenorfin", "buprenophine"],
      brandExamples: ["Subutex", "Sublocade", "Brixadi", "Butrans", "Belbuca"],
      class: "High-affinity partial mu-opioid agonist with formulation-specific OUD and pain indications",
      classPathway: ["Medications for opioid use disorder", "Partial mu agonist and kappa antagonist", "Transmucosal, injection, implant, and transdermal formulation logic"],
      usedToTreat: "Buprenorphine treats opioid use disorder in transmucosal and selected long-acting formulations and treats pain in different lower-dose formulations. A product approved for OUD is not automatically an analgesic formulation, and a pain patch is not a substitute for an OUD induction because dose, route, and delivery differ.",
      description: "Buprenorphine binds mu receptors with very high affinity but activates them only partially. That can suppress withdrawal and craving with less incremental respiratory effect than a full agonist, yet it can displace fentanyl, heroin, methadone, or prescription opioids and precipitate withdrawal if standard induction begins too early. High affinity also complicates acute pain and overdose reversal. Formulations include sublingual tablets, buccal films, transdermal patches, and extended-release injections, each with distinct indications and administration rules. Partial agonist never means risk-free, especially with benzodiazepines, alcohol, or other sedatives.",
      mechanism: "At the mu receptor, buprenorphine has high affinity, slow dissociation, and partial intrinsic efficacy. It occupies receptors strongly enough to reduce withdrawal, craving, and the effect of other opioids while producing a ceiling-like flattening of some respiratory effects compared with full agonists. That ceiling is incomplete and can be overcome by vulnerability or co-sedatives. If a dependent patient still has substantial full-agonist activation, buprenorphine displacement lowers net receptor signaling abruptly and causes precipitated withdrawal. Kappa antagonism and long receptor residence may contribute to clinical effects but do not replace mu-based safety reasoning.",
      boxedWarning: "Buprenorphine products warn about serious respiratory and CNS depression, especially with benzodiazepines or other sedatives, accidental pediatric exposure, neonatal withdrawal, hepatic injury, dependence, and precipitated withdrawal because high affinity changes both initiation and rescue. Transmucosal labeling also includes dental adverse-event warnings.",
      adverseEffects: [
        "Constipation, nausea, headache, sweating, sedation, orthostasis, and respiratory depression reflect systemic opioid effects.",
        "Precipitated withdrawal occurs when high-affinity partial agonism replaces stronger ongoing full-agonist activation before the transition is ready.",
        "Dental caries, erosion, abscess, or tooth loss can occur with transmucosal products because repeated acidic oral exposure and local conditions affect teeth."
      ],
      contraindications: [
        "Do not start a standard induction solely by the clock after fentanyl or methadone because individual persistence may outlast ordinary timing and objective withdrawal guides safety.",
        "Do not interchange pain and OUD formulations because route and delivered dose are part of the indication.",
        "Do not abruptly stop stable OUD treatment because withdrawal and return-to-use overdose risk can follow."
      ],
      nursingEssentials: [
        "Verify exact product, indication, route, last opioid, objective withdrawal, sedatives, liver context, pregnancy, and prior induction history because buprenorphine safety depends on transition and formulation.",
        "Teach correct transmucosal administration and oral rinsing with delayed brushing according to labeling because technique affects exposure and dental harm.",
        "Maintain overdose-reversal access because partial agonism lowers but does not eliminate overdose risk and relapse may expose the patient to full agonists."
      ],
      interactions: [
        "Benzodiazepines, alcohol, gabapentinoids, and other sedatives add respiratory depression because central effects converge.",
        "Strong CYP3A inhibitors or inducers can change exposure for susceptible formulations because hepatic metabolism contributes to clearance.",
        "Naltrexone blocks buprenorphine, while full agonists may have reduced effect because high-affinity receptor occupancy limits access."
      ],
      keyLabs: [
        "Objective withdrawal assessment guides standard induction because toxicology positivity alone does not show current receptor effect.",
        "Liver testing before and during treatment is selected according to product and risk because hepatitis or hepatic injury can alter exposure and safety.",
        "Toxicology can support treatment but must use an assay that detects buprenorphine because a routine opiate screen may not."
      ],
      nclexTraps: [
        "Partial agonist does not mean no respiratory depression.",
        "Buprenorphine itself can precipitate withdrawal by displacing a full agonist.",
        "Subutex, Sublocade, Brixadi, Butrans, and Belbuca are not route- or dose-interchangeable."
      ],
      populationRisks: populationRisks(
        "Accidental exposure can cause severe pediatric respiratory depression because high-affinity receptor occupancy occurs at small doses.",
        "Older adults need closer respiratory, fall, hepatic, and interaction assessment because partial agonism does not restore physiologic reserve.",
        "Buprenorphine is an established OUD treatment option in pregnancy because stable therapy reduces withdrawal and return-to-use risk; formulation and perinatal planning remain individualized."
      ),
      sourceNote: "CDC OUD guidance (" + CDC_OUD + "), SAMHSA TIP 63 (" + SAMHSA_TIP + "), and current U.S. buprenorphine labeling (" + DAILYMED + "buprenorphine).",
      sourceKeys: ["cdc-oud-treatment", "samhsa-tip63", "dailymed-buprenorphine"],
      tags: ["frontier-wave24", "buprenorphine", "partial agonist", "Subutex", "Sublocade", "precipitated withdrawal", "strict why closure"]
    }),

    drugCard({
      name: "Naloxone",
      aliases: ["Narcan", "Kloxxado", "RiVive", "Rextovy", "naloxone nasal spray", "opioid overdose antidote", "opioid reversal medicine", "nalaxon", "naloxon"],
      brandExamples: ["Narcan", "Kloxxado", "RiVive", "Rextovy"],
      class: "Rapid opioid-receptor antagonist for emergency overdose reversal",
      classPathway: ["Toxicology", "Opioid antagonist", "Community and clinical rescue of opioid-induced respiratory depression"],
      usedToTreat: "Naloxone reverses known or suspected opioid overdose manifested by respiratory or CNS depression. It is given immediately while emergency help and breathing support are activated because it can restore receptor signaling but cannot remove the opioid, reverse co-ingestants, or guarantee that breathing will remain normal.",
      description: "Naloxone rapidly displaces opioids from their receptors to restore breathing during an opioid overdose, but its effect can wear off before the opioid does. Nasal and injectable products differ in concentration and directions, so rescuers use the device in hand and repeat with a new device according to its label when breathing does not improve or depression returns. The goal is adequate breathing, not forcing complete wakefulness or provoking severe withdrawal. Long-acting opioids, potent fentanyl exposure, buprenorphine, delayed absorption, or co-ingestants can outlast or blunt the response.",
      mechanism: "Naloxone binds opioid receptors, especially mu receptors, without activating them. Competitive displacement removes agonist suppression from brainstem respiratory networks, restoring response to carbon dioxide when the cause is opioid-mediated. It simultaneously reverses analgesia, sedation, and euphoria and can abruptly expose dependence physiology, producing pain, vomiting, diarrhea, agitation, tachycardia, hypertension, and craving. Its clinical duration is often shorter than methadone, ER products, fentanyl depots, or active metabolites, which explains recurrent respiratory depression after an initially successful response.",
      boxedWarning: "Naloxone has no opioid-agonist boxed warning, but the emergency warning is practical: response can be incomplete or temporary, severe withdrawal can occur, and recurrent apnea can follow because the opioid remains. Call emergency services, support breathing, repeat as directed, and continue surveillance even when the person awakens.",
      adverseEffects: [
        "Acute withdrawal can cause vomiting, diarrhea, pain, agitation, sweating, hypertension, and tachycardia because receptor activation falls abruptly.",
        "Pulmonary edema, dysrhythmia, or cardiovascular stress can occur rarely, especially after abrupt reversal in vulnerable patients because sympathetic activation and the original hypoxia both contribute.",
        "A partial or absent response can occur with buprenorphine, massive exposure, delayed administration, or non-opioid co-ingestants because receptor antagonism addresses only one mechanism."
      ],
      contraindications: [
        "Do not delay naloxone while waiting for toxicology when opioid overdose is plausible because hypoxia causes time-dependent brain injury.",
        "Do not let naloxone administration delay rescue breathing, CPR, AED use, or emergency activation because the medication cannot ventilate the patient.",
        "Do not assume awakening means discharge-ready stability because naloxone may wear off before the opioid."
      ],
      nursingEssentials: [
        "Assess responsiveness and breathing, call emergency services, give the available product, open the airway and support breathing or CPR per dispatcher and training, and repeat with a new device according to product directions because one dose may be insufficient.",
        "Place a breathing but unconscious person in the recovery position and stay because vomiting, aspiration, recurrent apnea, and trauma remain possible.",
        "Titrate clinical naloxone to ventilation when feasible because abrupt complete reversal can produce severe withdrawal and pain while adequate breathing is the rescue endpoint."
      ],
      interactions: [
        "Buprenorphine and some mixed agonist-antagonists may be incompletely reversed because high receptor affinity or partial agonism makes displacement harder.",
        "Benzodiazepines, alcohol, xylazine, gabapentinoids, or stimulants are not reversed, so persistent toxicity needs continued supportive and diagnostic care.",
        "Long-acting opioids can reassert effect after naloxone clears because the agonist remains available."
      ],
      keyLabs: [
        "Naloxone treatment is clinical and should not wait for laboratory confirmation because common screens miss fentanyl and do not measure ventilatory effect.",
        "Glucose, ventilation and acid-base assessment, ECG, acetaminophen level, organ function, and co-ingestant testing are chosen by context because an opioid response does not exclude mixed poisoning.",
        "Serial respiratory and mental-status examination is the key measurement because recurrent toxicity is a time-dependent clinical event."
      ],
      nclexTraps: [
        "Narcan is naloxone; it is not naltrexone.",
        "Give naloxone and support ventilation; do not choose one instead of the other.",
        "Repeat dosing and observation may be required because naloxone can be shorter-acting than the opioid."
      ],
      populationRisks: populationRisks(
        "Naloxone can be used for suspected opioid overdose across ages because untreated hypoxia is the immediate threat, but neonatal withdrawal can be life-threatening and requires expert care.",
        "Older adults need continued cardiac, aspiration, pulmonary, and co-ingestant evaluation because reversal does not remove underlying vulnerability.",
        "Use in pregnancy is justified for life-threatening overdose because maternal ventilation protects both patient and fetus; acute withdrawal and fetal status then require emergency care."
      ),
      sourceNote: "CDC naloxone guidance (" + CDC_NALOXONE + "), FDA overdose-reversal information (" + FDA_REVERSAL + "), and current NARCAN label (" + NARCAN_LABEL + ").",
      sourceKeys: ["cdc-naloxone", "fda-overdose-reversal", "dailymed-narcan"],
      tags: ["frontier-wave24", "naloxone", "Narcan", "overdose", "ventilation", "recurrent toxicity", "strict why closure"]
    }),

    drugCard({
      name: "Nalmefene",
      aliases: ["nalmefene hydrochloride", "Opvee", "nalmefene nasal spray", "long acting opioid reversal", "nalmefine", "nalmefen"],
      brandExamples: ["Opvee"],
      class: "Longer-persisting opioid-receptor antagonist for emergency overdose reversal",
      classPathway: ["Toxicology", "Opioid antagonist", "Prescription nasal reversal in adults and patients age 12 or older"],
      usedToTreat: "Nalmefene nasal spray treats known or suspected natural or synthetic opioid overdose with respiratory or CNS depression in adults and pediatric patients age 12 or older. It is an additional rescue option, not a replacement for emergency services, ventilation, surveillance, or naloxone access where naloxone is the available product, because antagonism can be incomplete or temporary and cannot reverse non-opioid co-ingestants.",
      description: "Nalmefene antagonizes opioid receptors to reverse opioid-induced respiratory depression and generally persists longer in plasma than naloxone. The longer duration may better overlap some opioid exposures, but it does not guarantee that respiratory depression cannot recur and may produce more prolonged withdrawal or loss of analgesia. Opvee is prescription nasal nalmefene; it uses a single-use device and additional doses use new devices. Community evidence and availability are less extensive than for naloxone, so the practical rule in an emergency is to give the approved antagonist immediately available, support breathing, and call emergency services rather than delay while comparing products.",
      mechanism: "Nalmefene occupies mu, kappa, and delta opioid receptors without activating them, displacing agonist effect and restoring ventilatory drive when depression is opioid-mediated. Its longer systemic persistence extends antagonism, which can help when an agonist outlasts short naloxone exposure but also prolongs precipitated withdrawal, pain, and blockade. Buprenorphine or mixed agonist-antagonist depression can be incompletely reversed because affinity and receptor behavior limit competition. Co-ingestants remain active because nalmefene does not antagonize benzodiazepine, alcohol, xylazine, or other non-opioid targets.",
      boxedWarning: "The Opvee label warns about recurrent respiratory and CNS depression, incomplete reversal of partial agonists, severe opioid withdrawal, cardiovascular effects, and attempts to overcome blockade because longer antagonist action does not eliminate the need for emergency surveillance or repeat dosing.",
      adverseEffects: [
        "Nasal discomfort, headache, nausea, dizziness, hot flush, vomiting, anxiety, sweating, and throat irritation can occur because both local delivery and systemic antagonism contribute.",
        "Severe or prolonged withdrawal can occur in a dependent person because sustained receptor blockade abruptly removes opioid activation.",
        "Cardiovascular stress can follow abrupt reversal, particularly after surgery or in vulnerable patients, because pain, catecholamine release, and hypoxia interact."
      ],
      contraindications: [
        "Do not delay emergency activation or breathing support because nalmefene cannot ventilate a patient or reverse non-opioid causes.",
        "Do not assume its longer duration prevents recurrence because label-directed surveillance and repeat dosing remain necessary.",
        "Do not try to overcome the blockade with large opioid doses because receptor competition can be surmounted unpredictably and cause death."
      ],
      nursingEssentials: [
        "Give the available approved rescue product promptly, call emergency services, support breathing or CPR per training, and repeat with a new device according to the label because the initial response may be inadequate or transient.",
        "Monitor ventilation, consciousness, withdrawal, pain, vomiting, aspiration, and cardiovascular status because longer antagonism can extend both benefit and adverse effects.",
        "Document the exact product and time because subsequent clinicians need to understand antagonist duration and the possibility of prolonged blockade."
      ],
      interactions: [
        "Buprenorphine and mixed agonist-antagonists may be incompletely reversed because their receptor binding or partial efficacy differs from ordinary full agonists.",
        "Non-opioid sedatives are not reversed, so persistent depression requires continued supportive and diagnostic care.",
        "Large opioid attempts to overcome blockade can produce sudden overwhelming agonism as concentrations rise or antagonist effect wanes."
      ],
      keyLabs: [
        "Rescue does not wait for toxicology because assays and results cannot answer the immediate ventilation question.",
        "Glucose, acid-base and ventilation assessment, ECG, organ function, and co-ingestant studies are selected by presentation because opioid and non-opioid toxicity frequently coexist.",
        "Serial respiratory assessment remains decisive because the label acknowledges recurrence despite longer action."
      ],
      nclexTraps: [
        "Opvee is nalmefene; Narcan is naloxone.",
        "Longer action can mean longer withdrawal as well as longer antagonism.",
        "Give the available approved reversal agent immediately rather than delaying to obtain a theoretically preferred product because hypoxic injury progresses while products are compared."
      ],
      populationRisks: populationRisks(
        "Opvee nasal spray is labeled for age 12 and older; younger patients require the appropriate available rescue product and emergency protocol because untreated hypoxia remains critical.",
        "Older adults have greater cardiovascular, pulmonary, aspiration, and interaction vulnerability, so extended observation remains important.",
        "Life-threatening maternal overdose is treated immediately because restoring ventilation protects fetus and patient; withdrawal and fetal effects then require emergency obstetric care."
      ),
      sourceNote: "FDA overdose-reversal information (" + FDA_REVERSAL + ") and current OPVEE label (" + OPVEE_LABEL + ").",
      sourceKeys: ["fda-overdose-reversal", "dailymed-opvee"],
      tags: ["frontier-wave24", "nalmefene", "Opvee", "overdose reversal", "longer antagonist", "strict why closure"]
    }),

    drugCard({
      name: "Naltrexone",
      aliases: ["naltrexone hydrochloride", "Vivitrol", "Revia", "extended release naltrexone", "XR naltrexone", "opioid blocker shot", "naltrexon", "naltexone"],
      brandExamples: ["Vivitrol", "Revia"],
      class: "Long-acting opioid-receptor antagonist for OUD and alcohol use disorder",
      classPathway: ["Medications for opioid use disorder", "Opioid antagonist", "Relapse prevention after an opioid-free transition"],
      usedToTreat: "Naltrexone treats opioid use disorder after the required opioid-free transition and treats alcohol use disorder in appropriate patients. Oral and extended-release injection formulations support sustained receptor blockade; neither is the emergency rescue product for an actively hypoventilating overdose.",
      description: "Naltrexone blocks mu-opioid receptors without activating them, preventing expected opioid reward and effects during maintenance treatment after an opioid-free transition. The transition must come first because giving an antagonist while physiologic dependence remains can precipitate severe withdrawal that is difficult to reverse. Extended-release Vivitrol improves blockade duration but makes emergency pain treatment more complex. During blockade and after missed or discontinued injections, opioid tolerance is lower. Trying to override the blockade or returning to a previously tolerated amount as it wanes can therefore cause fatal overdose.",
      mechanism: "Competitive receptor occupancy prevents heroin, fentanyl, oxycodone, morphine, and other agonists from producing their expected mu effects. Because naltrexone provides no agonist signal, it does not suppress active withdrawal; it abruptly removes residual agonism if started too early. Sustained blockade interrupts opioid reward and cue reinforcement, while alcohol benefit is thought to involve modulation of endogenous opioid reward pathways. As weeks pass without full agonist exposure, physiologic tolerance falls, which explains overdose vulnerability at the end of an injection interval, after missed doses, or after discontinuation.",
      boxedWarning: "The critical safety risks are precipitated withdrawal, liver toxicity, injection-site injury, depressed mood or suicidality, blocked opioid analgesia, attempts to overcome blockade, and fatal overdose after blockade wanes because tolerance has fallen. Before starting, verify the prescribed opioid-free transition and assess withdrawal, liver symptoms, mood, the injection site, and the emergency pain plan. Avoid attempts to override the blockade; provide naloxone and overdose teaching, and escalate for severe withdrawal, jaundice, extensive injection-site injury, or suicidal intent. Naltrexone does not provide overdose rescue or withdrawal relief.",
      adverseEffects: [
        "Nausea, headache, fatigue, sleep change, dysphoria, and liver-enzyme elevation can occur because systemic antagonist and hepatic effects extend beyond craving.",
        "Extended-release injection can cause pain, induration, cellulitis, abscess, necrosis, or tissue injury because the depot remains at the site.",
        "Precipitated withdrawal can be severe and prolonged because sustained antagonism cannot be removed after injection."
      ],
      contraindications: [
        "Do not initiate during current opioid use, physiologic dependence, or acute withdrawal because antagonism can precipitate a severe syndrome.",
        "Do not use naltrexone as Narcan because its formulation and purpose are maintenance blockade, not immediate community resuscitation.",
        "Do not attempt to override blockade with high opioid doses because the blockade is surmountable and fatal intoxication can occur."
      ],
      nursingEssentials: [
        "Verify last opioid, methadone or buprenorphine exposure, withdrawal status, treatment-specific opioid-free interval, liver context, pregnancy, pain plan, and challenge testing when ordered because one hidden exposure can make induction dangerous.",
        "Teach the patient to carry medical identification and tell all clinicians about naltrexone because emergency analgesia and anesthesia require a nonroutine plan.",
        "Provide overdose-reversal access and explain end-of-interval, missed-dose, and post-discontinuation vulnerability because blockade does not preserve prior tolerance."
      ],
      interactions: [
        "Opioid analgesics can be ineffective at ordinary doses during blockade, and escalating them outside a monitored specialist plan can cause delayed fatal toxicity.",
        "Methadone and buprenorphine are blocked and can be displaced, causing precipitated withdrawal if the opioid-free transition is incomplete.",
        "Other hepatotoxic exposures can add liver risk because naltrexone is hepatically handled and underlying liver disease is common in the treatment population."
      ],
      keyLabs: [
        "Liver tests support baseline and symptom-triggered assessment because hepatic injury can change the benefit-risk decision.",
        "Toxicology and a naloxone challenge may support a protocol but cannot replace history and clinical withdrawal assessment because assays can miss specific opioids.",
        "Injection-site examination detects evolving tissue injury because severe reactions can extend beyond ordinary soreness."
      ],
      nclexTraps: [
        "Naltrexone prevents opioid effects; naloxone reverses an active overdose.",
        "Naltrexone requires an opioid-free transition and does not treat acute withdrawal.",
        "Overdose risk rises when blockade ends because tolerance falls."
      ],
      populationRisks: populationRisks(
        "Pediatric OUD use requires specialist guidance because formulation evidence and developmental needs differ.",
        "Older adults need hepatic, mood, pain-plan, and interaction review because sustained blockade can complicate acute illness and injury.",
        "Pregnancy decisions are individualized, while methadone or buprenorphine has the more established role for active OUD because agonist treatment prevents withdrawal and return to use."
      ),
      sourceNote: "CDC OUD guidance (" + CDC_OUD + "), SAMHSA TIP 63 (" + SAMHSA_TIP + "), and current U.S. Vivitrol/naltrexone labeling (" + DAILYMED + "naltrexone).",
      sourceKeys: ["cdc-oud-treatment", "samhsa-tip63", "dailymed-naltrexone"],
      tags: ["frontier-wave24", "naltrexone", "Vivitrol", "opioid free", "overdose vulnerability", "strict why closure"]
    }),

    drugCard({
      name: "Lofexidine",
      aliases: ["lofexidine hydrochloride", "Lucemyra", "opioid withdrawal non opioid medicine", "alpha 2 agonist opioid withdrawal", "lofexadin", "lofexedine"],
      brandExamples: ["Lucemyra"],
      class: "Central alpha-2 adrenergic agonist for mitigation of opioid withdrawal symptoms",
      classPathway: ["Opioid withdrawal", "Sympathetic symptom control", "Non-opioid supportive medication"],
      usedToTreat: "Lofexidine mitigates opioid withdrawal symptoms to facilitate abrupt opioid discontinuation in adults. It must not be presented as equivalent to buprenorphine or methadone maintenance because it does not occupy mu receptors, treat craving, reduce OUD mortality, or preserve opioid tolerance.",
      description: "Opioid withdrawal includes rebound noradrenergic activity after chronic mu signaling is removed. Lofexidine stimulates central alpha-2 receptors and reduces sympathetic outflow, which can improve sweating, chills, restlessness, tachycardia, and related distress. The same mechanism lowers blood pressure and heart rate and can cause orthostasis, syncope, sedation, and QT prolongation. Symptom relief may help a transition, but detoxification alone leaves OUD and overdose vulnerability untreated; ongoing medication treatment and harm-reduction planning remain essential when OUD is present.",
      mechanism: "Central presynaptic alpha-2 agonism reduces norepinephrine release from autonomic pathways that become overactive during opioid withdrawal. Lower sympathetic tone reduces tachycardia, sweating, piloerection, anxiety, and restlessness but also lowers vascular tone and pulse. Lofexidine does not occupy mu receptors, so it does not directly relieve opioid craving, restore tolerance, block fentanyl, or reverse apnea. It can prolong QT, and concurrent methadone adds QT effect, while CYP2D6 inhibition can raise exposure and worsen hypotension or bradycardia.",
      boxedWarning: "Lofexidine has no U.S. boxed warning, but labeling emphasizes hypotension, bradycardia, syncope, QT prolongation, CNS depression, overdose vulnerability after opioid discontinuation, and discontinuation symptoms because autonomic suppression can become excessive and tolerance can fall quickly.",
      adverseEffects: [
        "Orthostatic hypotension, bradycardia, dizziness, syncope, somnolence, sedation, and dry mouth occur because central sympathetic outflow is reduced.",
        "QT prolongation can become clinically important when methadone, congenital long QT, electrolyte abnormality, or other QT-active medicines reduce repolarization reserve.",
        "Rebound blood-pressure elevation and withdrawal-like symptoms can follow abrupt lofexidine discontinuation because adrenergic tone readapts."
      ],
      contraindications: [
        "Avoid congenital long QT and use caution or avoidance in marked bradycardia, severe coronary or cerebrovascular disease, recent myocardial infarction, or major renal disease according to labeling because hypotension or arrhythmia can be dangerous.",
        "Do not combine casually with other pulse- or blood-pressure-lowering medicines because bradycardia and syncope can add.",
        "Do not describe lofexidine detoxification as OUD treatment completion because return to use after tolerance loss can be fatal."
      ],
      nursingEssentials: [
        "Check supine and standing symptoms, blood pressure, pulse, hydration, fall risk, QT risk, and concurrent methadone because the treatment mechanism directly lowers autonomic tone.",
        "Teach outpatients to follow label and prescriber instructions about holding and contacting the clinician for symptomatic hypotension or bradycardia because continued dosing can worsen syncope.",
        "Pair withdrawal relief with MOUD discussion, naloxone or other reversal access, and follow-up because symptom suppression does not reduce OUD mortality by itself."
      ],
      interactions: [
        "Methadone adds QT prolongation, so ECG monitoring is recommended when they are used together because repolarization effects converge.",
        "CYP2D6 inhibitors can raise lofexidine exposure and increase hypotension or bradycardia because metabolic clearance falls.",
        "Sedatives and other antihypertensives add somnolence, hypotension, or syncope because pharmacodynamic effects overlap."
      ],
      keyLabs: [
        "ECG and potassium, magnesium, and calcium are assessed when QT risk is present because arrhythmia requires both drug and physiologic context.",
        "Kidney and liver function guide dose modification because clearance changes exposure.",
        "Blood pressure and pulse before dosing are the core clinical measurements because alpha-2 agonism directly changes both."
      ],
      nclexTraps: [
        "Lofexidine treats withdrawal symptoms, not OUD itself.",
        "It can lower pulse and blood pressure and prolong QT; it is not simply a comfort medicine.",
        "Detoxification lowers tolerance, so overdose-prevention planning becomes more important, not less."
      ],
      populationRisks: populationRisks(
        "Pediatric safety and effectiveness are not established for the adult opioid-withdrawal indication because the pivotal evidence is adult focused.",
        "Older adults have greater orthostatic, bradycardic, QT, fall, renal, and polypharmacy vulnerability because autonomic reserve is lower.",
        "Pregnancy and lactation decisions require specialist review because symptom treatment cannot replace established OUD care with methadone or buprenorphine."
      ),
      sourceNote: "Current U.S. Lucemyra labeling (" + LUCEMYRA_LABEL + ") and CDC/SAMHSA OUD guidance (" + CDC_OUD + "; " + SAMHSA_TIP + ").",
      sourceKeys: ["dailymed-lofexidine", "cdc-oud-treatment", "samhsa-tip63"],
      tags: ["frontier-wave24", "lofexidine", "Lucemyra", "alpha 2 agonist", "withdrawal", "QT", "strict why closure"]
    })
  ];
  const pathologyCards = [
    conceptCard({
      name: "Nociception and endogenous pain modulation",
      category: "Pain physiology",
      aliases: ["nociception", "pain pathway", "how pain travels to the brain", "ascending pain pathway", "descending pain pathway", "pain gate control", "A delta and C fibers", "spinothalamic tract pain", "endogenous opioid system"],
      definition: "Nociception is the nervous system's detection, transmission, modulation, and cortical processing of actual or threatened tissue injury. It is not identical to pain: nociceptive signals can occur without conscious pain, and pain can persist when ongoing tissue injury is small because attention, threat, memory, inflammation, and neural sensitization change the network. The pathway begins when peripheral nociceptors transduce mechanical, thermal, or chemical energy, continues through A-delta and C fibers to the dorsal horn and ascending tracts, and is shaped by descending inhibitory and facilitatory systems before the brain constructs the sensory and emotional experience.",
      etiology: "Tissue injury, inflammation, ischemia, distention, mechanical compression, neuropathic damage, and central network disease can initiate or amplify pain. Context changes the experience because fear, sleep loss, prior trauma, depression, expectation, culture, and attention modify descending control without making the pain imaginary.",
      pathology: "Peripheral nociceptor terminals express channels and receptors that respond to heat, acid, ATP, prostaglandins, bradykinin, cytokines, pressure, and tissue metabolites. A-delta fibers conduct faster, sharper, better-localized signals, while unmyelinated C fibers conduct slower, aching or burning signals. Primary afferents release glutamate and substance P in the dorsal horn, where local inhibitory interneurons, projection neurons, and descending input determine how much signal enters ascending spinothalamic and related pathways.",
      pathophysiology: "Transduction converts tissue energy into action potentials. Transmission carries those impulses through dorsal-root ganglia to the spinal cord and then through ascending networks to thalamic, somatosensory, insular, limbic, and frontal regions. Modulation occurs at every level. Descending pathways from periaqueductal gray and medullary networks use serotonin, norepinephrine, and endogenous opioids to inhibit or facilitate dorsal-horn signaling. Opioids reduce presynaptic calcium entry and postsynaptic firing, which explains analgesia, but they also act in respiratory, enteric, arousal, and reward networks. Effective pain care therefore treats the cause, reduces nociceptive input, restores function, and addresses sleep, fear, mood, and movement rather than relying on one receptor or one pain score.",
      riskFactors: ["Inflammation, ischemia, surgery, trauma, cancer, visceral distention, or musculoskeletal loading can activate nociceptors because they release mechanical and chemical danger signals.", "Neuropathy, spinal-cord or brain injury, and persistent nociceptor input can change neural excitability so pain outlasts the original trigger.", "Sleep loss, anxiety, depression, trauma, catastrophizing, and social threat can reduce descending inhibition and increase vigilance, which amplifies suffering without invalidating the underlying experience."],
      signsSymptoms: ["Fast A-delta signaling often feels sharp and localized, while C-fiber signaling often feels dull, aching, burning, or diffuse because conduction and receptor populations differ.", "Visceral pain can be poorly localized or referred because visceral and somatic afferents converge on shared spinal neurons.", "Pain behavior, autonomic change, guarding, and function add information, but absence of visible distress does not exclude severe pain because expression varies."],
      diagnostics: ["Identify location, quality, timing, provoking and relieving factors, functional impact, neurologic features, and red flags because pain mechanism guides treatment.", "Examine perfusion, inflammation, strength, sensation, reflexes, movement, abdomen, spine, and relevant organs because a pain score cannot exclude ischemia, infection, compartment syndrome, or compression.", "Use imaging, laboratory testing, electrodiagnostics, or specialty assessment only when the suspected cause will change management because pain itself is not diagnosed by one scan."],
      labs: ["Inflammatory markers, CK, lactate, troponin, urinalysis, liver tests, or other studies are selected by the suspected tissue mechanism rather than ordered as a generic pain panel.", "Normal testing does not prove absence of pain because many functional and neuropathic mechanisms do not create a routine biomarker.", "Medication and substance history is a diagnostic test because withdrawal, toxicity, tolerance, and interaction can alter both pain and behavior."],
      treatments: ["Treat time-sensitive causes first because analgesia alone cannot restore perfusion, decompress tissue, drain infection, or stabilize a fracture.", "Use multimodal therapy that matches mechanism, such as anti-inflammatory, neuropathic, local anesthetic, physical, behavioral, procedural, or opioid strategies, because different nodes in the pathway respond to different interventions.", "Set function and safety goals and reassess because lower intensity without better breathing, mobility, sleep, or participation may not represent meaningful benefit."],
      nursingPriorities: ["Assess pain and sedation separately because a comfortable but difficult-to-arouse patient may be experiencing opioid toxicity.", "Trend function, sleep, movement, bowel and bladder status, mood, and neurologic findings because the trajectory often reveals mechanism better than one number.", "Use validating, nonjudgmental language because trust improves disclosure and does not require agreeing to an unsafe medication plan."],
      complications: ["Untreated acute pain can impair ventilation, mobility, sleep, and stress response, while excessive analgesia can cause respiratory depression, delirium, falls, or ileus.", "Persistent input can promote peripheral and central sensitization, which expands pain beyond the original tissue injury.", "Fear and avoidance can drive deconditioning and disability because reduced movement further lowers function and confidence."],
      contraindications: ["Do not equate nociception with conscious pain or pain with visible tissue damage because the concepts overlap but are not identical.", "Do not let analgesia delay evaluation of red-flag pain because ischemia, infection, hemorrhage, and compression are time-sensitive.", "Do not dismiss pain as psychological because mood and attention modulate a real neural network rather than manufacture a false symptom."],
      redFlags: ["Chest pain, sudden severe headache, pulseless or pale limb, peritonitis, rapidly progressive swelling, fever with spinal pain, or new neurologic deficit", "Pain out of proportion with tense compartment, ischemic signs, or rapidly spreading infection", "Pain treatment followed by difficult arousal, slow or shallow breathing, cyanosis, or new confusion"],
      patientEducation: ["Pain is produced by a protective nervous system, but persistent pain can remain after tissue healing because the system can become sensitized.", "A multimodal plan is not disbelief; it targets several parts of the pathway so one medicine does not carry the entire burden.", "Report new weakness, bowel or bladder change, fever, chest symptoms, severe sudden change, or breathing difficulty because those clues can signal a different emergency."],
      nclexTraps: ["Pain is subjective, but safety assessment remains objective and comprehensive.", "A-delta is faster and sharper; C-fiber input is slower and more diffuse.", "Opioid analgesia and opioid respiratory depression share receptor biology."],
      relatedTopics: ["Pain mechanisms, central sensitization, hyperalgesia, and allodynia", "Opioid analgesics", "Opioid-induced hyperalgesia"],
      sourceNote: "Educational physiology synthesis grounded in FDA opioid mechanism and safety communication (" + FDA_CLASS_2023 + ") and CDC pain-treatment framework (" + CDC_GUIDELINE + ").",
      tags: ["nociception", "A delta", "C fibers", "dorsal horn", "spinothalamic", "descending modulation"]
    }),

    conceptCard({
      name: "Pain mechanisms, central sensitization, hyperalgesia, and allodynia",
      category: "Pain physiology and assessment",
      aliases: ["nociceptive vs neuropathic pain", "pain types", "central sensitization", "peripheral sensitization", "hyperalgesia vs allodynia", "allodynia", "hyperalgesia", "why touch hurts", "pain amplification"],
      definition: "Pain mechanism classification asks what is generating and amplifying the experience. Nociceptive pain arises from activation of intact tissue-danger pathways; neuropathic pain arises from a lesion or disease of the somatosensory system; nociplastic pain reflects altered nociceptive processing without clear ongoing tissue damage or a lesion sufficient to explain the pattern. Peripheral sensitization lowers nociceptor thresholds at injured tissue. Central sensitization increases excitability within spinal and brain networks. Hyperalgesia means an exaggerated response to a normally painful stimulus, while allodynia means pain from a normally nonpainful stimulus such as light touch.",
      etiology: "Inflammation, repeated injury, nerve damage, chemotherapy, diabetes, herpes zoster, spinal or brain lesions, migraine, persistent pain, sleep disruption, stress, and some long-term opioid exposures can alter peripheral or central processing. Mixed mechanisms are common because tissue injury can inflame nerves and sustained input can sensitize central networks.",
      pathology: "Inflammatory mediators phosphorylate ion channels and lower nociceptor thresholds in peripheral sensitization. Repeated dorsal-horn input can strengthen excitatory synapses, reduce inhibitory signaling, recruit normally low-threshold touch pathways, and expand receptive fields. Damaged nerves can fire ectopically and lose normal sensory coding. These changes make stimulus intensity and pain experience diverge.",
      pathophysiology: "In nociceptive pain, reducing tissue inflammation or mechanical load reduces the initiating signal. In neuropathic pain, abnormal nerve firing and disinhibition make sodium channels, calcium channels, monoamine modulation, and membrane stabilization more relevant. In central sensitization, repeated input produces wind-up and longer-term network plasticity, so light touch, movement, sound, poor sleep, or stress can amplify symptoms. Hyperalgesia and allodynia describe response patterns rather than a single disease. Opioid-induced hyperalgesia is one possible cause, but disease progression, withdrawal, tolerance, and new injury must be separated because their treatments differ.",
      riskFactors: ["Persistent inflammation or repeated nociceptive input can lower thresholds because sensitizing mediators and synaptic plasticity accumulate.", "Direct nerve injury, diabetes, shingles, chemotherapy, spinal disease, or stroke can produce neuropathic pain because somatosensory pathways become damaged.", "Poor sleep, fear, inactivity, depression, and repeated high-dose opioid exposure can amplify processing because descending inhibition and network gain change."],
      signsSymptoms: ["Burning, electric, shooting pain, numbness, paresthesia, dermatomal or nerve-distribution findings suggest neuropathic involvement because sensory pathways themselves are abnormal.", "Tenderness or pain spreading beyond the original injury, exaggerated pinprick pain, or light-touch allodynia suggests sensitization because receptive fields and thresholds have changed.", "Mechanical aching and pain linked to tissue loading can be nociceptive, but mixed features are common and should not be forced into one label."],
      diagnostics: ["Map sensory loss, allodynia, hyperalgesia, strength, reflexes, distribution, function, sleep, and temporal triggers because mechanism is inferred from pattern rather than one laboratory test.", "Investigate red flags and the underlying lesion with targeted imaging or electrodiagnostics because central sensitization must not become a label that hides compression, inflammation, infection, or cancer.", "Review medication timing and opioid escalation because withdrawal, end-of-dose pain, tolerance, and opioid-induced hyperalgesia can look similar."],
      labs: ["A1c, B12, thyroid, renal, inflammatory, infectious, or toxic studies are selected by the neuropathy or inflammatory differential because no central-sensitization biomarker exists.", "Normal routine testing does not invalidate pain because altered processing can occur without structural abnormalities on standard imaging.", "Medication reconciliation identifies neurotoxic chemotherapy, withdrawal, serotonergic toxicity, or opioid exposure that may drive the pattern."],
      treatments: ["Treat the cause and use mechanism-matched multimodal therapy because inflammation, nerve injury, muscle guarding, sleep loss, and sensitization respond to different tools.", "Graded movement, sleep treatment, education, psychological skills, and rehabilitation can lower network threat and restore function because avoidance and deconditioning reinforce amplification.", "If opioid-induced hyperalgesia is suspected, reassess and consider supervised dose reduction or rotation rather than automatic escalation because more exposure may worsen pain."],
      nursingPriorities: ["Document distribution and stimulus-response pattern rather than only intensity because allodynia and hyperalgesia reveal mechanism.", "Protect insensate areas and support gradual function because numbness raises injury risk while avoidance raises disability.", "Validate the experience while explaining sensitization in plain language because patients may hear altered processing as imagined pain unless the mechanism is clear."],
      complications: ["Persistent sensitization can broaden pain and impair sleep, mood, mobility, and participation because the network becomes increasingly reactive.", "Escalating opioids for opioid-induced hyperalgesia can create a cycle of more pain and more respiratory risk.", "Untreated neuropathy can cause falls, wounds, weakness, and missed compressive lesions because sensory loss hides injury."],
      contraindications: ["Do not use allodynia and hyperalgesia interchangeably because one involves a normally nonpainful stimulus and the other an exaggerated painful stimulus.", "Do not diagnose central sensitization before excluding red-flag structural or inflammatory disease because both can coexist.", "Do not assume greater pain always means greater tissue injury or less pain always means safety because modulation changes perception."],
      redFlags: ["New weakness, saddle anesthesia, bowel or bladder dysfunction, fever, cancer history, trauma, rapidly progressive sensory loss, or severe night pain", "Pain out of proportion with vascular, compartment, or infectious findings", "Diffuse worsening pain with escalating opioid exposure, allodynia, sedation, or reduced function"],
      patientEducation: ["Sensitization means the alarm system has become easier to trigger; it does not mean the pain is imagined.", "Improvement can be measured by sleep, movement, and function as well as intensity because recovery often precedes complete symptom resolution.", "Do not increase opioid doses without review when pain spreads or touch becomes painful because opioid-induced hyperalgesia is one possible explanation."],
      nclexTraps: ["Allodynia is pain from a normally nonpainful stimulus; hyperalgesia is too much pain from a painful stimulus.", "Neuropathic pain results from a lesion or disease of the somatosensory system.", "Normal imaging does not prove absence of sensitized pain processing."],
      relatedTopics: ["Nociception and endogenous pain modulation", "Opioid-induced hyperalgesia", "Opioid tolerance, physical dependence, and addiction distinctions"],
      sourceNote: "Educational synthesis aligned with FDA opioid-induced hyperalgesia communication (" + FDA_CLASS_2023 + ") and CDC pain-mechanism assessment principles (" + CDC_GUIDELINE + ").",
      tags: ["central sensitization", "peripheral sensitization", "allodynia", "hyperalgesia", "neuropathic pain", "nociplastic pain"]
    }),

    conceptCard({
      name: "Opioid-induced respiratory depression",
      category: "Medication safety and toxicology",
      aliases: ["OIRD", "opioid respiratory depression", "slow breathing after morphine", "opioids and CO2", "why opioids stop breathing", "respitory depresion after opioid", "opioid hypoventilation"],
      abbreviations: ["OIRD"],
      definition: "Opioid-induced respiratory depression is inadequate ventilation caused by opioid suppression of brainstem respiratory drive, arousal, airway tone, and the normal response to rising carbon dioxide and falling oxygen. It is not defined by respiratory rate alone: a patient can breathe at an apparently acceptable rate with very shallow tidal volumes and still retain carbon dioxide. Sedation often precedes severe respiratory failure because the same mu-receptor effect reduces arousal before apnea becomes obvious. Supplemental oxygen can delay desaturation while hypercapnia worsens, so oxygen saturation must be interpreted with depth, effort, arousability, and ventilation monitoring.",
      etiology: "Risk rises after opioid initiation, dose increase, route or formulation change, residual anesthesia, renal or hepatic decline, sleep, unexpected heat exposure to fentanyl patches, methadone accumulation, medication error, or addition of benzodiazepines, alcohol, gabapentinoids, or other sedatives.",
      pathology: "Mu receptors in respiratory rhythm and chemosensory networks reduce ventilatory response to carbon dioxide. Opioids also suppress upper-airway tone and arousal, worsening obstructive or central sleep-disordered breathing. Hypoventilation raises PaCO2, lowers pH, and eventually reduces oxygen, causing cerebral and cardiac hypoxia.",
      pathophysiology: "Ventilation equals respiratory rate times effective tidal volume. Opioids can reduce both and blunt the alarm response that would normally wake a hypercapnic person. Early findings can be increasing somnolence, snoring or obstructed sounds, reduced tidal volume, or rising exhaled CO2. With progression, hypercapnia, acidosis, hypoxemia, bradycardia, hypotension, aspiration, arrest, and hypoxic brain injury follow. Naloxone or nalmefene can remove receptor suppression, but ventilation and airway support remain immediate because antagonist onset is not instantaneous and the opioid can outlast the rescue drug.",
      riskFactors: ["Opioid-naive state, older age, frailty, obesity, sleep apnea, COPD, neuromuscular weakness, renal or hepatic impairment, and head injury reduce respiratory reserve or clearance.", "Methadone, ER/LA products, fentanyl patches, basal PCA infusions, repeated parenteral doses, and neuraxial opioids can produce delayed or prolonged exposure.", "Benzodiazepines, alcohol, gabapentinoids, sedating antihistamines, muscle relaxants, sleep agents, and residual anesthetics add depression because arousal and ventilation effects converge."],
      signsSymptoms: ["Increasing sedation, difficult arousal, slow or shallow breathing, reduced chest movement, snoring or obstructed sounds, cyanosis, and pinpoint pupils support OIRD.", "A normal respiratory rate does not exclude low minute ventilation when breaths are shallow.", "Agitation or confusion can reflect hypercapnia or hypoxia rather than pain or psychiatric behavior because respiratory failure alters brain function."],
      diagnostics: ["Assess arousability, respiratory rate, depth, rhythm, airway sounds, chest movement, oxygen context, and last opioid or sedative because one vital sign cannot define ventilation.", "Use capnography, blood gas, or other ventilation assessment when indicated because supplemental oxygen can preserve saturation while carbon dioxide accumulates.", "Review route, formulation, pump settings, patches, renal and hepatic function, co-sedatives, and timing because correcting the exposure source prevents recurrence."],
      labs: ["ABG or VBG can show respiratory acidosis and hypercapnia because inadequate alveolar ventilation retains carbon dioxide.", "Glucose, electrolytes, renal and hepatic function, and co-ingestant studies identify mimics and accumulation drivers.", "Toxicology may support exposure but should not delay rescue and can miss fentanyl or synthetic opioids."],
      treatments: ["Activate emergency response, open the airway, support breathing, and use CPR or AED as indicated because hypoxia causes immediate injury.", "Give an approved opioid-reversal agent when opioid effect is suspected and repeat according to product or protocol because the first dose can be insufficient or shorter than the opioid.", "Stop additional opioid and sedative delivery, remove transdermal sources safely, and treat aspiration, hypotension, or pulmonary complications because reversal alone does not correct every consequence."],
      nursingPriorities: ["Treat new sedation as a respiratory warning and pause escalation because waiting for cyanosis loses the earlier rescue window.", "Trend ventilation after apparent response because methadone, ER products, patches, and active metabolites can cause recurrent depression.", "Verify high-alert pump and medication details because concentration, basal rate, lockout, and duplicate routes can explain unexpected exposure."],
      complications: ["Respiratory acidosis, hypoxic brain injury, aspiration, pulmonary edema, rhabdomyolysis, cardiac arrest, and death can follow prolonged hypoventilation.", "Recurrent apnea can occur after antagonist effect fades because the agonist remains.", "Severe precipitated withdrawal can cause vomiting, aspiration, agitation, and cardiovascular stress after abrupt reversal."],
      contraindications: ["Do not rely on pulse oximetry alone, especially with supplemental oxygen, because it measures oxygenation rather than ventilation.", "Do not give oxygen and omit ventilation support because oxygen does not remove carbon dioxide or restore tidal volume.", "Do not delay naloxone or emergency response for a toxicology result because hypoxic injury is time-dependent."],
      redFlags: ["Cannot wake, slow or shallow breathing, gurgling or snoring in an unresponsive person, blue or gray lips, or apnea", "New severe sedation after opioid initiation, dose increase, pump change, renal decline, or sedative coadministration", "Recurrent somnolence or slowed breathing after initial naloxone response"],
      patientEducation: ["Difficulty staying awake, slowed or shallow breathing, and blue lips are emergency signs, not normal pain relief.", "Avoid alcohol and unreviewed sedatives because their breathing effects add to opioids.", "Keep an approved reversal agent available and teach household members because the patient may be unable to self-rescue."],
      nclexTraps: ["Sedation often precedes respiratory arrest.", "Oxygen saturation can remain normal while carbon dioxide rises on supplemental oxygen.", "Naloxone plus ventilation is the response; neither should delay the other."],
      relatedTopics: ["Opioid overdose", "Naloxone response and recurrent opioid toxicity", "Patient-controlled analgesia opioid safety"],
      sourceNote: "FDA opioid respiratory-risk communication (" + FDA_CLASS_2023 + "), CDC naloxone guidance (" + CDC_NALOXONE + "), and current reversal labels (" + NARCAN_LABEL + ").",
      tags: ["OIRD", "hypoventilation", "hypercapnia", "sedation", "naloxone", "ventilation"]
    }),

    conceptCard({
      name: "Opioid tolerance, physical dependence, and addiction distinctions",
      category: "Addiction and pain pharmacology",
      aliases: ["opioid tolerance vs dependence", "dependence vs addiction", "tolerance physical dependence OUD", "am I addicted if I have withdrawal", "opioid dependence meaning", "opioid adaptation"],
      definition: "Tolerance, physical dependence, and opioid use disorder describe different phenomena. Tolerance is reduced effect after repeated exposure, so more drug may be needed for the same effect. Physical dependence is physiologic adaptation that produces withdrawal when exposure falls or an antagonist is given. Both can occur during appropriate prescribed treatment and do not by themselves prove addiction. Opioid use disorder is a harmful behavioral and clinical pattern involving impaired control, craving, risky use, role impairment, or continued use despite harm. A person can have any combination of these, so respectful assessment must not infer behavior from dose or withdrawal alone.",
      etiology: "Repeated receptor exposure drives cellular adaptation, while genetics, mental health, trauma, pain, environment, drug potency and speed, reinforcement, stress, and access shape the risk of compulsive use. OUD is not a moral failure because reward, learning, stress, and executive-control circuits change with repeated exposure.",
      pathology: "Chronic mu signaling causes receptor desensitization, altered second-messenger activity, network homeostasis, and changes in endogenous stress and reward pathways. Locus-coeruleus and autonomic systems adapt to suppressed norepinephrine, then become overactive when opioids stop. Cue learning and relief of withdrawal reinforce repeated use.",
      pathophysiology: "Tolerance is effect-specific: analgesic or euphoric tolerance can develop differently from respiratory or constipating tolerance, so escalating to chase one effect can still cause overdose. Physical dependence becomes visible when agonism falls, producing autonomic and gastrointestinal rebound. OUD adds impaired control and continued use despite consequences; prescribed exposure alone is insufficient for diagnosis. After abstinence, tolerance falls faster than memory of the prior dose, which explains fatal overdose when a person returns to an amount that was once tolerated.",
      riskFactors: ["High-potency or rapid-delivery opioids, long exposure, escalating dose, polysedative use, prior overdose, and unpredictable fentanyl supply increase adaptation and harm risk.", "Trauma, depression, anxiety, untreated pain, unstable housing, incarceration, stigma, and limited treatment access can increase reinforcement and reduce protective support.", "Abstinence after detoxification, hospitalization, incarceration, or naltrexone lowers tolerance, which makes return to a previous amount especially dangerous."],
      signsSymptoms: ["Tolerance appears as reduced duration or effect but can be mimicked by disease progression, poor absorption, hyperalgesia, or diversion.", "Dependence appears as withdrawal after dose reduction, missed doses, antagonist exposure, or a high-affinity partial agonist transition.", "OUD features include unsuccessful efforts to cut down, craving, time spent, role failure, hazardous use, social impairment, or continued use despite physical or psychological harm."],
      diagnostics: ["Use DSM-based OUD assessment and a nonjudgmental history because tolerance and withdrawal during appropriate medical treatment do not automatically count toward diagnosis.", "Review dose timing, function, adherence, pain mechanism, withdrawal, overdose, co-sedatives, and consequences because the same complaint can represent several mechanisms.", "Assess suicide risk, infection, pregnancy, housing, and treatment access because safety and recovery depend on more than substance amount."],
      labs: ["Toxicology supports exposure but cannot diagnose tolerance, dependence, impairment, or OUD because assays show neither control nor consequences.", "Renal and hepatic function and medication interactions identify pharmacokinetic accumulation that can mimic behavioral escalation.", "No laboratory biomarker substitutes for the clinical pattern of impaired control and harm."],
      treatments: ["For OUD, offer or arrange methadone, buprenorphine, or naltrexone as appropriate because medication treatment reduces overdose risk and mortality.", "For prescribed physical dependence without OUD, use individualized gradual tapering when benefits no longer outweigh risks because abrupt discontinuation can cause harm.", "Provide overdose-reversal access and harm-reduction education because tolerance changes across transitions and treatment does not eliminate risk."],
      nursingPriorities: ["Use person-first language and separate observed physiology from assumptions about behavior because stigma reduces disclosure and treatment engagement.", "Verify maintenance medications and avoid missed or duplicated doses because withdrawal and delayed overdose are both preventable.", "Teach that tolerance loss follows abstinence because the prior remembered amount may now be fatal."],
      complications: ["Overdose can occur when respiratory tolerance is less than assumed or sedatives add effect.", "Withdrawal, uncontrolled pain, self-discharge, and unsafe return to use can follow abrupt interruption.", "Untreated OUD can cause overdose, infection, trauma, family and role disruption, and death, while stigma can delay life-saving care."],
      contraindications: ["Do not label every physically dependent patient addicted because dependence is an expected pharmacologic adaptation.", "Do not assume a high prescribed dose proves OUD or a low dose excludes it because diagnosis rests on behavior and harm.", "Do not abruptly discontinue stable therapy as punishment because withdrawal and overdose risk can increase."],
      redFlags: ["Prior overdose, using alone, sedative co-use, reduced tolerance, counterfeit pills, or return after abstinence", "Loss of control, suicidal intent, injection infection, pregnancy, or inability to care safely for dependents", "Severe sedation or slowed breathing during supposed tolerance"],
      patientEducation: ["Dependence means the body adapted; OUD means use has become difficult to control and harmful. Either deserves care without shame.", "After abstinence, a previously tolerated amount can kill because tolerance falls.", "Medication treatment supports recovery by stabilizing receptors and reducing withdrawal and craving."],
      nclexTraps: ["Tolerance and withdrawal alone do not diagnose OUD during appropriate medical treatment.", "Tolerance is not equal across analgesia, euphoria, constipation, and respiratory depression.", "Detoxification without ongoing treatment can raise overdose risk because tolerance falls."],
      relatedTopics: ["Opioid use disorder", "Opioid withdrawal", "Opioid-induced hyperalgesia"],
      sourceNote: "CDC OUD guidance (" + CDC_OUD + "), SAMHSA TIP 63 (" + SAMHSA_TIP + "), and FDA safe-discontinuation guidance (" + FDA_CLASS_2025 + ").",
      tags: ["tolerance", "physical dependence", "addiction", "OUD", "stigma", "loss of tolerance"]
    }),

    conceptCard({
      name: "Opioid-induced hyperalgesia",
      category: "Medication-related pain amplification",
      aliases: ["OIH", "opioid hyperalgesia", "pain worse on opioids", "opioids causing more pain", "paradoxical opioid pain", "allodynia from opioids"],
      abbreviations: ["OIH"],
      definition: "Opioid-induced hyperalgesia is paradoxically increased pain or pain sensitivity caused or amplified by opioid exposure. It can present as pain that becomes more diffuse, less anatomically consistent, more sensitive to touch, or worse despite dose escalation. It is distinct from tolerance, in which the same pain returns as effect diminishes, and from withdrawal-associated pain, which follows falling exposure with autonomic symptoms. Disease progression, new injury, infection, neuropathy, and undertreatment must still be excluded because no single finding proves OIH.",
      etiology: "OIH can occur at any opioid dose but is reported more often with higher or longer exposure. Rapid high-dose exposure, repeated escalation, potent opioids, and susceptible pain networks may contribute, while the exact mechanism remains incompletely established.",
      pathology: "Proposed mechanisms include NMDA-mediated excitation, increased spinal dynorphin, descending facilitation, glial activation, altered glutamate signaling, and pronociceptive metabolite effects. These pathways increase neural gain despite ongoing mu analgesia.",
      pathophysiology: "Opioids initially reduce nociceptive transmission, but repeated exposure can recruit counter-regulatory pronociceptive systems. The therapeutic window narrows: more drug may briefly sedate or blunt pain while also increasing central excitability and future sensitivity. This creates the clinical trap of escalating dose in response to an effect caused by the dose. FDA notes that OIH can improve after supervised dose reduction or rotation, which helps distinguish it retrospectively, but decisions must protect against withdrawal and uncontrolled disease pain.",
      riskFactors: ["Higher-dose or longer-term exposure can increase risk because pronociceptive adaptations have more time and intensity to develop.", "Rapid perioperative opioid escalation or potent agents can reveal hyperalgesia because network excitation changes quickly.", "Renal accumulation of neuroexcitatory metabolites and existing central sensitization can amplify pain because several excitatory mechanisms converge."],
      signsSymptoms: ["Pain becomes more diffuse or extends beyond the original area because central receptive fields expand.", "Allodynia or exaggerated pain appears despite escalating opioid exposure because the nervous system becomes more sensitive.", "Sedation or reduced function increases without durable pain improvement, suggesting the harm curve is rising faster than benefit."],
      diagnostics: ["Reassess the original disease, new injury, infection, ischemia, neuropathy, withdrawal timing, adherence, and mood because OIH is a diagnosis of pattern and exclusion.", "Map pain distribution, allodynia, dose-response, timing, function, and withdrawal signs because tolerance and OIH can look alike.", "Review renal function, metabolites, formulation, and co-medications because accumulation or interaction can worsen both pain and toxicity."],
      labs: ["No laboratory test confirms OIH because the diagnosis rests on clinical trajectory and response to a supervised change.", "Renal and hepatic function identify accumulation that can contribute to neuroexcitation.", "Inflammatory, infectious, or disease-specific studies are selected when worsening pathology remains possible."],
      treatments: ["Reevaluate the indication and consider supervised opioid reduction, rotation, or a different strategy because automatic escalation can worsen hyperalgesia and respiratory risk.", "Strengthen multimodal nonopioid, regional, rehabilitative, sleep, and behavioral treatment because reducing reliance on one pathway preserves function.", "Taper gradually when dependence exists unless an immediate emergency dictates otherwise because abrupt withdrawal can itself intensify pain."],
      nursingPriorities: ["Document distribution, function, allodynia, dose timing, sedation, and respiratory status because intensity alone cannot distinguish OIH.", "Do not frame the finding as malingering because paradoxical pain amplification is a pharmacologic phenomenon.", "Monitor withdrawal and safety during any change because reducing exposure and abandoning the patient are not the same action."],
      complications: ["Dose escalation can worsen pain, sedation, respiratory depression, constipation, and overdose risk.", "Abrupt discontinuation can create withdrawal-associated pain and unsafe self-treatment.", "Mislabeling disease progression as OIH can delay diagnosis, while missing OIH can perpetuate a harmful escalation cycle."],
      contraindications: ["Do not diagnose OIH from dose alone because tolerance, new disease, withdrawal, and undertreatment remain alternatives.", "Do not respond to diffuse worsening pain with automatic escalation because the dose may be driving the symptom.", "Do not stop abruptly in a dependent patient without a safety plan because withdrawal can cause serious harm."],
      redFlags: ["Worsening diffuse pain or allodynia with dose escalation and increasing sedation", "New focal deficit, fever, ischemic signs, trauma, cancer change, or compartment findings that suggest another emergency", "Breathing difficulty or difficult arousal during attempts to chase pain"],
      patientEducation: ["Rarely, an opioid can make the pain system more sensitive; this is different from pain being imagined.", "Do not increase the dose on your own because more exposure can worsen both pain and breathing risk.", "A supervised reduction or rotation is paired with other pain treatment and withdrawal prevention."],
      nclexTraps: ["Tolerance usually improves transiently with more opioid; OIH may worsen with more opioid.", "Withdrawal pain occurs as exposure falls and usually includes autonomic or gastrointestinal clues.", "OIH can occur at any dose, although higher and longer exposure may increase risk."],
      relatedTopics: ["Pain mechanisms, central sensitization, hyperalgesia, and allodynia", "Opioid tolerance, physical dependence, and addiction distinctions", "Opioid analgesics"],
      sourceNote: "FDA opioid-induced hyperalgesia labeling communication (" + FDA_CLASS_2023 + ") and CDC individualized pain-treatment guidance (" + CDC_GUIDELINE + ").",
      tags: ["OIH", "hyperalgesia", "allodynia", "dose escalation", "central sensitization"]
    }),

    conceptCard({
      name: "Opioid use disorder",
      category: "Substance use and addiction medicine",
      replaceExistingAliases: true,
      aliases: ["OUD", "opioid addiction", "opiate use disorder", "pain pill addiction", "fentanyl addiction", "heroin addiction", "addicted to opioids", "can't stop pain pills", "opioid dependence with addiction", "opiod use disorder"],
      abbreviations: ["OUD"],
      definition: "Opioid use disorder is a chronic, treatable condition in which opioid use becomes difficult to control and continues despite meaningful harm or risk. Diagnosis rests on impaired control, craving, role or relationship impairment, hazardous use, and continued use despite consequences. Tolerance and withdrawal can occur with prescribed therapy and do not by themselves establish OUD. The condition can involve heroin, illicitly manufactured fentanyl, counterfeit pills, or prescribed opioids. It changes reward, stress, learning, and executive-control circuits, but recovery remains possible because those same circuits can restabilize with medication, safety, support, and time.",
      etiology: "OUD develops through interaction of opioid exposure with genetic vulnerability, potency and speed of delivery, pain, trauma, mental illness, social environment, stress, unstable housing, stigma, and repeated reinforcement from euphoria or withdrawal relief. No single personality or social group is protected.",
      pathology: "Repeated mu-receptor activation and withdrawal cycles alter reward prediction, cue salience, stress response, habit learning, and prefrontal control. Environmental cues can trigger craving long after detoxification, while fentanyl's potency and unpredictable supply magnify overdose risk.",
      pathophysiology: "Short-acting opioid peaks can reinforce use through rapid reward, while falling concentrations create withdrawal that negatively reinforces the next dose. Over time, use may shift from seeking euphoria to avoiding sickness, and cues acquire powerful motivational value. Methadone and buprenorphine stabilize receptor occupancy and reduce withdrawal and craving, interrupting the cycle. Naltrexone blocks agonist reward after an opioid-free transition. Detoxification alone leaves cue learning and low tolerance intact, which explains the high risk of return and fatal overdose.",
      riskFactors: ["Prior overdose, high-potency fentanyl, counterfeit pills, injection, using alone, polysedative use, and reduced tolerance increase immediate fatal risk.", "Trauma, depression, anxiety, chronic pain, unstable housing, incarceration, and treatment barriers can increase vulnerability because stress and limited support reinforce use.", "Family history and early exposure influence risk, but they do not determine destiny because protective care and medication change outcomes."],
      signsSymptoms: ["Using more or longer than intended, unsuccessful efforts to cut down, craving, or much time spent obtaining, using, or recovering indicates impaired control.", "Role failure, relationship conflict, giving up activities, hazardous use, or continued use despite harm indicates clinical impairment.", "Withdrawal relief use, overdose, abscess, endocarditis, hepatitis, sedation, or repeated emergency care can reveal consequences without defining the person's worth."],
      diagnostics: ["Use DSM-based criteria and a nonjudgmental history of substance, route, amount, last use, fentanyl exposure, overdose, withdrawal, treatment, pain, and goals because trust improves accuracy.", "Assess respiratory safety, sedatives, suicide risk, infection, pregnancy, wounds, housing, and dependent-care safety because acute needs may outrank diagnostic labeling.", "Toxicology supports exposure but does not diagnose OUD, quantify impairment, or prove diversion because assays and detection windows vary."],
      labs: ["Offer HIV, hepatitis B and C, pregnancy, STI, liver, renal, and infection testing according to exposure and consent because OUD care should connect treatable health needs.", "ECG and electrolytes support methadone decisions when QT risk is present.", "A fentanyl- or buprenorphine-specific assay may be needed because routine opiate screens can miss them."],
      treatments: ["Offer or arrange buprenorphine, methadone, or naltrexone according to exposure, withdrawal, preference, pregnancy, access, and clinical context because medication treatment reduces overdose risk.", "Provide overdose-reversal medication, safer-use counseling, sterile-equipment and infection services where available, and avoid using alone because harm reduction keeps people alive for recovery.", "Add behavioral, peer, housing, pain, mental-health, and social support according to patient goals because medication and environment work together."],
      nursingPriorities: ["Use person-first language and ask permission before sensitive questions because shame and coercion reduce engagement.", "Continue verified MOUD during hospitalization and arrange the next dose because treatment interruption can cause withdrawal and self-discharge.", "Plan overdose prevention at every transition because tolerance changes after hospitalization, incarceration, detoxification, or naltrexone."],
      complications: ["Fatal respiratory depression, aspiration, hypoxic brain injury, and recurrent overdose can occur, especially with fentanyl or sedative co-use.", "Injection or unsafe supply can cause abscess, endocarditis, HIV, hepatitis, sepsis, embolic disease, and xylazine-associated wounds.", "Untreated OUD can worsen pain, mood, housing, relationships, pregnancy outcomes, and suicide risk, while stigma compounds each complication."],
      contraindications: ["Do not diagnose OUD from tolerance or withdrawal alone during appropriate prescribed treatment because physiologic adaptation is not identical to impaired control.", "Do not use detoxification alone as the default treatment because return after tolerance loss increases overdose death risk.", "Do not withhold care as punishment for recurrence because recurrence signals a need to strengthen treatment and safety."],
      redFlags: ["Unresponsive, slow or absent breathing, blue lips, or recurrent sedation", "Prior overdose, using alone, sedative mixing, reduced tolerance, counterfeit pills, or recent abstinence", "Fever, new murmur, focal neurologic sign, severe back pain, spreading wound, pregnancy instability, or suicidal intent"],
      patientEducation: ["OUD is treatable; medication reduces withdrawal and craving so recovery work becomes possible.", "Keep naloxone or another approved reversal product available and do not use alone because supply strength can be unpredictable.", "After any abstinence, a previous amount can be fatal because tolerance falls."],
      nclexTraps: ["MOUD is evidence-based treatment, not replacing one addiction with another.", "Tolerance and physical dependence alone do not diagnose OUD.", "Detoxification without medication can increase overdose risk after return to use."],
      relatedTopics: ["Medications for opioid use disorder", "Opioid overdose", "Opioid withdrawal", "Heroin"],
      sourceNote: "CDC OUD treatment guidance (" + CDC_OUD + ") and SAMHSA TIP 63 (" + SAMHSA_TIP + ").",
      tags: ["OUD", "opioid addiction", "MOUD", "fentanyl", "heroin", "recovery", "harm reduction"]
    }),

    conceptCard({
      name: "Opioid withdrawal",
      category: "Substance withdrawal and addiction medicine",
      replaceExistingAliases: true,
      aliases: ["opiate withdrawal", "dope sick", "opioid detox symptoms", "COWS score", "clinical opiate withdrawal scale", "heroin withdrawal", "fentanyl withdrawal", "pain pill withdrawal", "opioid withdrawl", "opiod withdrawal"],
      abbreviations: ["COWS"],
      definition: "Opioid withdrawal is the autonomic, gastrointestinal, musculoskeletal, and emotional syndrome that follows a substantial reduction in opioid-receptor activation after physical dependence. Early findings often include anxiety, restlessness, yawning, tearing, runny nose, sweating, and dilated pupils; later findings include gooseflesh, cramping, vomiting, diarrhea, aching, insomnia, tachycardia, and hypertension. It is usually not directly seizure- or delirium-lethal like alcohol or benzodiazepine withdrawal, but dehydration, pregnancy stress, comorbidity, unsafe self-treatment, and return to use after tolerance loss can make it medically dangerous.",
      etiology: "Withdrawal follows missed or reduced doses, abrupt discontinuation, rapid taper, loss of access, vomiting or malabsorption, metabolic induction, antagonist exposure, or transition to a high-affinity partial agonist before the prior full agonist effect has fallen sufficiently.",
      pathology: "Chronic mu signaling suppresses locus-coeruleus and autonomic activity, and neurons compensate by increasing intracellular and noradrenergic drive. When agonism disappears, the compensation is unopposed, producing sympathetic and gastrointestinal rebound.",
      pathophysiology: "Rising norepinephrine produces anxiety, sweating, tachycardia, hypertension, piloerection, tearing, and rhinorrhea. Loss of enteric mu inhibition restores motility and secretion, producing cramps, vomiting, and diarrhea. Pain pathways become more excitable, causing myalgia and hyperalgesia. Timing follows the opioid's pharmacokinetics: short-acting heroin may produce earlier withdrawal, while methadone or long depots begin later and last longer. Buprenorphine or naltrexone can precipitate a more abrupt syndrome by displacing or blocking ongoing agonist effect.",
      riskFactors: ["Longer exposure, higher dependence, short-acting cycles, fentanyl tissue persistence, methadone, and abrupt antagonist transitions shape onset and severity.", "Pregnancy, cardiovascular disease, dehydration, severe mental illness, and limited support increase complications because physiologic and social reserve is lower.", "Recent detoxification or interrupted treatment raises later overdose risk because tolerance falls while craving may persist."],
      signsSymptoms: ["Yawning, lacrimation, rhinorrhea, sweating, mydriasis, piloerection, restlessness, and anxiety reflect autonomic rebound.", "Abdominal cramps, nausea, vomiting, diarrhea, bone or muscle aching, and insomnia follow enteric and pain-system rebound.", "Pinpoint pupils and respiratory depression suggest intoxication rather than uncomplicated withdrawal because mu activation remains high."],
      diagnostics: ["Establish exact opioid, route, last use, formulation, fentanyl or methadone exposure, MOUD, antagonist exposure, sedatives, pregnancy, and prior withdrawal because timing guides treatment.", "Use the Clinical Opiate Withdrawal Scale as one structured snapshot when appropriate, but combine it with history and examination because anxiety, infection, GI illness, and stimulant effects can inflate items.", "Assess dehydration, suicidality, infection, pain emergencies, and ability to follow up because the greatest danger may be the context rather than the score."],
      labs: ["Electrolytes, kidney function, glucose, pregnancy testing, ECG, and infection studies are selected by vomiting, diarrhea, comorbidity, methadone, or differential diagnosis.", "Toxicology can support exposure but cannot determine current receptor effect or readiness for a specific induction by itself.", "No COWS laboratory exists because the score is based on observed and reported clinical features."],
      treatments: ["Offer buprenorphine or methadone treatment when appropriate because receptor stabilization treats withdrawal and the underlying OUD rather than symptoms alone.", "Use lofexidine or clonidine and symptom-targeted hydration, antiemetic, antidiarrheal, sleep, and pain care according to protocol because autonomic and GI distress can be reduced when MOUD is not yet used.", "Provide overdose-reversal access and linkage to continuing care because detoxification lowers tolerance and return to use can be fatal."],
      nursingPriorities: ["Treat symptoms without judgment and reassess because withdrawal distress can drive self-discharge or unsafe use.", "Monitor hydration, orthostasis, vomiting, diarrhea, pregnancy, mood, and cardiovascular status because usually nonlethal does not mean harmless.", "Do not confuse severe sedation or slow breathing with withdrawal because intoxication requires ventilation and reversal, not another agonist dose without assessment."],
      complications: ["Dehydration, electrolyte disturbance, aspiration, worsening pain, insomnia, and psychiatric destabilization can require medical care.", "Pregnancy withdrawal and return to use can affect maternal and fetal stability because physiologic stress and overdose risk involve both.", "Return to a prior amount after tolerance falls can cause fatal overdose."],
      contraindications: ["Do not use alcohol or benzodiazepine withdrawal rules for opioid withdrawal because seizure and delirium risk differ.", "Do not start standard buprenorphine induction solely from elapsed time without assessing objective withdrawal because fentanyl and methadone can persist.", "Do not call detoxification completed treatment because OUD and overdose risk continue."],
      redFlags: ["Severe dehydration, syncope, chest pain, pregnancy instability, suicidal intent, or inability to keep fluids down", "Sedation, slow breathing, cyanosis, or pinpoint pupils suggesting concurrent intoxication", "Abrupt severe worsening immediately after buprenorphine or naltrexone suggesting precipitated withdrawal"],
      patientEducation: ["Withdrawal is a predictable body adaptation, not a failure of willpower.", "Medication treatment can relieve withdrawal and reduce overdose risk; you do not need to endure severe symptoms to deserve care.", "Tolerance falls during abstinence, so returning to a previous amount can be fatal."],
      nclexTraps: ["Mydriasis, diarrhea, yawning, and piloerection point toward withdrawal; miosis and slow breathing point toward intoxication.", "COWS supports assessment but does not replace opioid timing and objective clinical judgment.", "The major post-withdrawal danger is return to use after tolerance loss."],
      relatedTopics: ["Precipitated opioid withdrawal", "Opioid use disorder", "Lofexidine", "Medications for opioid use disorder"],
      sourceNote: "SAMHSA TIP 63 (" + SAMHSA_TIP + "), CDC OUD guidance (" + CDC_OUD + "), and current buprenorphine and lofexidine labeling (" + DAILYMED + "buprenorphine; " + LUCEMYRA_LABEL + ").",
      tags: ["opioid withdrawal", "COWS", "dope sick", "mydriasis", "diarrhea", "MOUD"]
    }),

    conceptCard({
      name: "Precipitated opioid withdrawal",
      category: "Medication transition complication",
      aliases: ["precipitated withdrawal", "buprenorphine made withdrawal worse", "Suboxone precipitated withdrawal", "naltrexone precipitated withdrawal", "PW from fentanyl", "started bupe too soon", "rapid opioid withdrawal after antagonist"],
      abbreviations: ["POW", "PW"],
      definition: "Precipitated opioid withdrawal is an abrupt fall in net opioid-receptor activation caused by a medication that displaces or blocks an agonist while physical dependence remains. Standard buprenorphine induction can precipitate withdrawal because high-affinity partial agonism replaces a stronger ongoing full-agonist effect. Naloxone, nalmefene, and naltrexone can precipitate withdrawal because antagonists remove agonist signaling. Symptoms often intensify rapidly after the triggering dose rather than following the slower natural decline of spontaneous withdrawal.",
      etiology: "Common contexts include buprenorphine started before sufficient objective withdrawal, naltrexone begun before the opioid-free interval is complete, emergency antagonist reversal, and transitions from methadone, fentanyl, ER products, or tissue depots whose effect persists longer than expected.",
      pathology: "Dependence physiology has increased autonomic and cellular drive to compensate for chronic mu activation. Displacement by a partial agonist or antagonist removes that activation within minutes to hours, exposing the compensation abruptly.",
      pathophysiology: "Buprenorphine's affinity allows it to outcompete many full agonists. If the displaced agonist was producing more receptor activation than buprenorphine can provide, net signaling falls and severe withdrawal begins. Antagonists provide no activation, so the drop can be larger. Fentanyl's lipophilicity and repeated exposure can create tissue persistence that makes a simple clock unreliable. The syndrome is not proof that buprenorphine allergy exists or that treatment can never work; management depends on the trigger, severity, respiratory status, hydration, and an experienced protocol.",
      riskFactors: ["Recent fentanyl, methadone, ER/LA opioid, or high-dose exposure increases risk because agonist effect can persist beyond ordinary timing estimates.", "Low objective withdrawal at standard buprenorphine induction increases risk because full-agonist activation remains substantial.", "Naltrexone injection creates prolonged antagonist exposure, so an incomplete opioid-free transition can produce severe sustained symptoms."],
      signsSymptoms: ["Abrupt escalation of anxiety, restlessness, sweating, yawning, piloerection, mydriasis, cramping, vomiting, diarrhea, aching, and tachycardia after the trigger supports the diagnosis.", "Temporal linkage to buprenorphine, naloxone, nalmefene, or naltrexone distinguishes precipitation from gradually evolving spontaneous withdrawal.", "Slow breathing, miosis, or inability to wake suggests persistent or recurrent opioid intoxication and must not be misread as withdrawal."],
      diagnostics: ["Document the exact agonist, last use, formulation, trigger medication, dose, route, and symptom timeline because mechanism depends on receptor transition.", "Assess objective withdrawal, hydration, cardiovascular status, pregnancy, pain, agitation, and respiratory status because treatment must protect both withdrawal and overdose safety.", "Exclude serotonin syndrome, stimulant toxicity, sepsis, gastroenteritis, diabetic crisis, or other mimics when the pattern is atypical."],
      labs: ["Electrolytes, kidney function, glucose, ECG, pregnancy testing, CK, and acid-base assessment are selected by severity because vomiting, agitation, and comorbidity can create secondary injury.", "Toxicology can support exposure but cannot quantify receptor occupancy or prove induction readiness.", "No laboratory confirms precipitated withdrawal; the defining evidence is abrupt symptom worsening after receptor-displacing medication."],
      treatments: ["Use the setting's experienced buprenorphine or withdrawal protocol because selected cases are managed with additional buprenorphine while others require symptom control and individualized reassessment.", "Treat vomiting, diarrhea, pain, anxiety, dehydration, and autonomic symptoms while monitoring breathing because distress and co-ingestant sedation can coexist.", "Maintain engagement and arrange continuing OUD treatment because abandoning care after a difficult induction increases return-to-use and overdose risk."],
      nursingPriorities: ["Stay calm and validate the mechanism because the patient may interpret sudden worsening as punishment or treatment failure.", "Trend COWS features, hydration, vital signs, mental status, and respiration because severity and direction guide the protocol.", "Do not independently reverse the treatment plan with full agonists or sedatives because receptor competition and respiratory risk require coordinated expertise."],
      complications: ["Severe vomiting, diarrhea, dehydration, agitation, pain, and self-discharge can follow the abrupt syndrome.", "Return to a potent or unpredictable opioid supply can cause overdose because distress is intense and tolerance may be changing.", "Aspiration or cardiovascular stress can occur when severe withdrawal is layered on hypoxia, pregnancy, or comorbidity."],
      contraindications: ["Do not label the reaction as a buprenorphine allergy because the mechanism is receptor displacement rather than immune hypersensitivity.", "Do not rely on elapsed time alone after fentanyl or methadone because tissue persistence varies.", "Do not withhold emergency naloxone from a life-threatening overdose to avoid withdrawal because restoring ventilation comes first."],
      redFlags: ["Uncontrolled vomiting or diarrhea, syncope, chest pain, severe agitation, pregnancy instability, or inability to hydrate", "Recurrent sedation or slowed breathing after antagonist reversal", "Suicidal intent or immediate plan to return to a high-risk supply"],
      patientEducation: ["The reaction means receptor activation dropped too quickly; it does not mean treatment is impossible.", "Tell clinicians exactly when and what opioid you last used because fentanyl, methadone, and ER products can persist.", "Do not try to overpower an antagonist with large opioid amounts because overdose can occur abruptly."],
      nclexTraps: ["Buprenorphine precipitates withdrawal through high-affinity partial agonism, not because of an allergy.", "Naltrexone requires an opioid-free transition because it provides no agonist activity.", "Withdrawal risk never justifies delaying naloxone for apnea."],
      relatedTopics: ["Opioid withdrawal", "Buprenorphine/naloxone induction and formulation rationale", "Naltrexone", "Naloxone"],
      sourceNote: "SAMHSA TIP 63 (" + SAMHSA_TIP + ") and current buprenorphine, buprenorphine/naloxone, naltrexone, naloxone, and nalmefene labeling (" + DAILYMED + "buprenorphine; " + NARCAN_LABEL + "; " + OPVEE_LABEL + ").",
      tags: ["precipitated withdrawal", "buprenorphine", "fentanyl", "naltrexone", "naloxone", "receptor displacement"]
    }),

    conceptCard({
      name: "Opioid intoxication",
      category: "Toxicology and substance effects",
      replaceExistingAliases: true,
      aliases: ["opioid intoxication syndrome", "opiate intoxication", "opioid toxidrome", "opioid high", "miosis sedation", "pinpoint pupils and drowsy"],
      definition: "Opioid intoxication is excessive opioid-receptor effect causing a spectrum from euphoria, analgesia, drowsiness, slurred speech, miosis, nausea, and impaired judgment to life-threatening respiratory depression, coma, hypotension, and hypoxia. The classic triad of depressed consciousness, slow or inadequate breathing, and pinpoint pupils is useful but not mandatory. Pupils may be normal after hypoxia, with certain drugs, or in mixed poisoning. The decisive danger is ventilation: a sleepy person who is easily awakened and breathing adequately differs from a person who cannot be awakened or has shallow, irregular, or absent breaths.",
      etiology: "Intoxication can follow prescribed dosing, medication error, opioid-naive exposure, dose escalation, renal or hepatic accumulation, extended-release manipulation, fentanyl-patch heat, return after tolerance loss, counterfeit pills, illicit fentanyl, or combinations with alcohol, benzodiazepines, gabapentinoids, xylazine, or other sedatives.",
      pathology: "Excess mu activation suppresses arousal, respiratory rhythm and chemosensitivity, cough, gastrointestinal motility, and autonomic tone. Hypoventilation retains carbon dioxide and eventually causes hypoxemia, acidosis, brain injury, and cardiac arrest.",
      pathophysiology: "Opioid effect exists on a continuum, but deterioration can accelerate when absorption continues or active metabolites accumulate. Supplemental oxygen may preserve saturation while carbon dioxide rises, so sedation and tidal volume matter. Mixed intoxication may not respond completely to naloxone because only the opioid component is reversed. Long-acting opioids can outlast reversal, and abrupt antagonism can produce vomiting, pain, agitation, and withdrawal. This explains why an initially awake person still needs observation and cause-specific evaluation.",
      riskFactors: ["Opioid-naive exposure, high potency, ER/LA products, fentanyl patches, methadone, renal or hepatic impairment, and recent tolerance loss increase exposure or reduce reserve.", "Benzodiazepines, alcohol, gabapentinoids, sleep agents, and other sedatives increase risk because respiratory and arousal effects add.", "Using alone, counterfeit pills, unknown concentration, and prior overdose reduce the chance of timely rescue."],
      signsSymptoms: ["Drowsiness, slurred speech, impaired coordination, nausea, pruritus, constipation, and miosis reflect opioid effect before severe failure.", "Difficult arousal, slow or shallow breathing, snoring or gurgling while unresponsive, blue lips, bradycardia, hypotension, or apnea indicate severe toxicity.", "Agitation after hypoxia or reversal does not exclude opioid poisoning because brain dysfunction and withdrawal can change the presentation."],
      diagnostics: ["Assess airway, breathing depth and rate, circulation, responsiveness, glucose, oxygen context, pupils, trauma, temperature, and exact exposure because stabilization and differential diagnosis occur together.", "Review all formulations, patches, pill containers, prescriptions, co-ingestants, last-known-well, and tolerance change because exposure history predicts delayed recurrence.", "Use toxicology as supportive evidence rather than a gate because routine opiate assays can miss fentanyl, buprenorphine, methadone, tramadol, and other synthetics."],
      labs: ["Glucose is immediate because hypoglycemia can mimic coma and is rapidly reversible.", "Blood gas, electrolytes, kidney and liver function, ECG, CK, acetaminophen and salicylate levels, pregnancy testing, and co-ingestant studies are selected by severity and product because mixed toxicity is common.", "A negative routine opiate screen does not exclude opioid intoxication because assay targets differ."],
      treatments: ["Support airway and ventilation and activate emergency response because hypoxia is the immediate killer.", "Give naloxone or another approved reversal agent for clinically significant respiratory or CNS depression and repeat as directed because response can be incomplete or temporary.", "Stop ongoing delivery, remove patches safely, treat aspiration or shock, and observe according to the opioid and response because antagonism does not remove the source."],
      nursingPriorities: ["Trend arousability and ventilation rather than waiting for oxygen desaturation because sedation often precedes arrest.", "Protect against aspiration and falls and avoid leaving the person alone because vomiting, recurrent depression, and trauma are common.", "Use nonstigmatizing communication after stabilization because intoxication can occur through treatment, accident, or OUD and shame impairs follow-up."],
      complications: ["Respiratory acidosis, aspiration, pulmonary edema, rhabdomyolysis, pressure injury, compartment syndrome, hypoxic brain injury, arrest, and death can follow prolonged unconsciousness.", "Recurrent toxicity can occur when the opioid outlasts naloxone or absorption continues.", "Withdrawal and acute pain can follow reversal because antagonism removes opioid effect abruptly."],
      contraindications: ["Do not require miosis before treating suspected opioid respiratory depression because pupils are not universally pinpoint.", "Do not interpret a positive toxicology result as proof that opioids explain every finding because trauma, infection, stroke, hypoglycemia, and mixed poisoning can coexist.", "Do not let a partial response to naloxone end evaluation because co-ingestants or hypoxic injury may persist."],
      redFlags: ["Cannot wake, slow or shallow breathing, gurgling or snoring while unresponsive, cyanosis, or apnea", "Recurrent sedation after reversal", "Unknown pill or fentanyl exposure with declining consciousness"],
      patientEducation: ["Unusual sleepiness and slowed breathing are overdose warning signs, not a normal high.", "Avoid mixing opioids with alcohol or sedatives and keep a reversal agent available because effects add unpredictably.", "Seek care after reversal because breathing can slow again when the antagonist wears off."],
      nclexTraps: ["The classic triad is helpful but not required.", "Ventilation is more important than pupil size.", "Naloxone response supports opioid effect but does not exclude other causes."],
      relatedTopics: ["Opioid overdose", "Opioid-induced respiratory depression", "Naloxone response and recurrent opioid toxicity"],
      sourceNote: "CDC naloxone guidance (" + CDC_NALOXONE + "), FDA opioid safety communication (" + FDA_CLASS_2023 + "), and current reversal labels (" + NARCAN_LABEL + "; " + OPVEE_LABEL + ").",
      tags: ["opioid intoxication", "toxidrome", "miosis", "sedation", "hypoventilation"]
    }),

    conceptCard({
      name: "Opioid overdose",
      category: "Emergency and toxicology",
      replaceExistingAliases: true,
      aliases: ["opiate overdose", "narcotic overdose", "fentanyl overdose", "heroin overdose", "pain pill overdose", "OD on opioids", "OD on pain pills", "pinpoint pupils slow breathing", "cannot wake after opioid", "blue lips after fentanyl", "fentynal overdose", "heroine overdose", "opiod overdose"],
      definition: "Opioid overdose is a life-threatening degree of opioid intoxication in which breathing, airway protection, circulation, or consciousness is failing. The most important signs are inability to wake, slow, shallow, irregular, or absent breathing, gurgling or snoring sounds in an unresponsive person, and blue or gray lips or fingertips. Pinpoint pupils support the diagnosis but are not required. Treat suspected overdose immediately because hypoventilation raises carbon dioxide, lowers oxygen, and causes irreversible brain and cardiac injury. Give an approved reversal agent if available, call emergency services, and support breathing rather than waiting to identify the exact opioid.",
      etiology: "Overdose follows excessive prescribed or nonmedical exposure, counterfeit pills, illicitly manufactured fentanyl, dose or pump error, opioid-naive exposure, patch heat, renal or hepatic accumulation, methadone stacking, ER manipulation, return after abstinence, or sedative co-use. A person may not know an opioid was present because fentanyl can contaminate other drugs.",
      pathology: "Excess mu activation suppresses medullary respiratory rhythm, carbon-dioxide response, arousal, cough, and upper-airway tone. Carbon dioxide retention produces respiratory acidosis; hypoxemia then injures brain and heart. Immobility adds aspiration, pressure, muscle, and compartment injury.",
      pathophysiology: "Breathing failure usually precedes cardiac arrest, so ventilation is the central rescue. Naloxone or nalmefene competitively removes receptor suppression, but the medication needs time to absorb and may be shorter than the opioid. Recurrent apnea can therefore follow initial awakening. Buprenorphine, massive fentanyl exposure, or mixed agonists may be harder to reverse, while benzodiazepines, alcohol, xylazine, and other co-ingestants remain active. Rescue is a sequence of parallel actions: emergency activation, airway and breathing support, antagonist administration, repeat assessment, additional doses as directed, and continued observation.",
      riskFactors: ["Prior overdose, using alone, unknown or counterfeit supply, fentanyl exposure, injection, high dose, and rapid route increase risk because rescue time or dose predictability falls.", "Tolerance loss after detoxification, hospitalization, incarceration, abstinence, or naltrexone increases risk because a previously tolerated amount can now suppress breathing.", "Alcohol, benzodiazepines, gabapentinoids, sleep medicines, and other sedatives add respiratory depression because CNS effects converge."],
      signsSymptoms: ["Unresponsiveness or inability to wake is a major warning because arousal circuits are suppressed.", "Slow, shallow, irregular, or absent breathing; choking, gurgling, or snoring while unresponsive; and cyanosis indicate inadequate ventilation.", "Miosis, limpness, bradycardia, hypotension, cool skin, vomiting, or drug paraphernalia support the diagnosis but should not delay rescue."],
      diagnostics: ["Diagnose the immediate emergency clinically from breathing and responsiveness because toxicology results arrive too late for rescue.", "Check glucose, trauma, temperature, pupils, patches, containers, medication records, co-ingestants, and last-known-well because reversible mimics and mixed poisoning are common.", "After stabilization, ECG, blood gas, imaging, laboratory studies, and exposure-specific tests evaluate hypoxia, aspiration, rhabdomyolysis, acetaminophen, infection, or trauma."],
      labs: ["Glucose is checked immediately because hypoglycemia can mimic coma and coexist.", "Blood gas can show hypercapnic respiratory acidosis, while electrolytes, kidney and liver function, CK, troponin, lactate, and ECG assess complications.", "Acetaminophen and salicylate levels are considered in unknown or combination-pill ingestion because naloxone does not treat those toxins."],
      treatments: ["Call emergency services, open the airway, provide rescue breathing or CPR and AED use according to training and dispatcher guidance, and do not leave the person because hypoxia is time-critical.", "Give the available approved opioid-overdose reversal product immediately and repeat with a new device according to its instructions if breathing does not improve or depression returns.", "Continue emergency evaluation and observation, treat aspiration or shock, remove ongoing delivery sources safely, and link survivors to OUD treatment and overdose prevention because one reversal does not remove future risk."],
      nursingPriorities: ["Prioritize ventilation over forcing complete wakefulness because adequate breathing is the life-saving endpoint.", "Trend for recurrent sedation and slowed breathing through the opioid's likely duration because antagonist effect can end first.", "Provide naloxone or other approved reversal access, nonstigmatizing education, and a warm treatment handoff because a nonfatal overdose predicts future risk."],
      complications: ["Hypoxic brain injury, aspiration pneumonia, noncardiogenic pulmonary edema, rhabdomyolysis, compartment syndrome, acute kidney injury, pressure injury, arrest, and death can follow delayed rescue.", "Recurrent respiratory depression can occur after initial response because the opioid remains.", "Precipitated withdrawal can cause vomiting, agitation, pain, aspiration, and immediate return-to-use risk."],
      contraindications: ["Do not wait for pinpoint pupils, a toxicology result, or certainty about fentanyl because ventilation cannot wait.", "Do not put an unresponsive person in a shower, make them walk, induce vomiting, or leave them alone because these actions do not reverse respiratory depression and can cause injury.", "Do not assume one naloxone dose or one awakening ends the emergency because recurrence is common with longer exposure."],
      redFlags: ["Unable to wake, absent or inadequate breathing, gurgling or snoring in an unresponsive person, cyanosis, or collapse", "Recurrent sedation after reversal", "Possible methadone, fentanyl patch, ER opioid, buprenorphine, or unknown counterfeit pill exposure"],
      patientEducation: ["Call emergency services and give the available reversal medicine immediately; support breathing and stay until help arrives.", "Keep reversal medication where others can find it and check expiration because the person overdosing cannot self-administer reliably.", "After abstinence, use is especially dangerous because tolerance falls; treatment with buprenorphine or methadone reduces fatal risk."],
      nclexTraps: ["Ventilation and antagonist are parallel priorities.", "A person who wakes can become apneic again.", "Naloxone reverses opioids, not benzodiazepines, alcohol, xylazine, acetaminophen, or hypoxic injury."],
      relatedTopics: ["Naloxone", "Nalmefene", "Opioid-induced respiratory depression", "Opioid use disorder"],
      sourceNote: "CDC naloxone response guidance (" + CDC_NALOXONE + "), FDA overdose-reversal information (" + FDA_REVERSAL + "), and current NARCAN and OPVEE labels (" + NARCAN_LABEL + "; " + OPVEE_LABEL + ").",
      tags: ["opioid overdose", "fentanyl overdose", "heroin overdose", "naloxone", "ventilation", "911", "emergency"]
    }),

    conceptCard({
      name: "Naloxone response and recurrent opioid toxicity",
      category: "Overdose reversal and monitoring",
      aliases: ["renarcotization", "recurrent respiratory depression after naloxone", "naloxone wore off", "Narcan wore off", "repeat naloxone", "how often repeat Narcan", "naloxone response", "why overdose comes back"],
      definition: "A naloxone response is improvement in opioid-mediated respiratory or CNS depression after competitive receptor antagonism. Recurrent opioid toxicity, sometimes informally called renarcotization, is return of sedation or inadequate breathing after the antagonist effect wanes while the opioid remains active or continues absorbing. Waking up is not the endpoint; sustained adequate ventilation is. Methadone, extended-release products, fentanyl patches, large exposures, active metabolites, and body depots can outlast naloxone, while buprenorphine or mixed agonists may be incompletely reversed.",
      etiology: "Recurrence reflects a duration mismatch, ongoing absorption, delayed gastric emptying, patch or depot delivery, active metabolites, repeated exposure, or insufficient initial reversal. Persistent depression without recurrence can reflect non-opioid co-ingestants, hypoxic injury, trauma, or another diagnosis.",
      pathology: "Naloxone temporarily occupies mu receptors but is cleared while agonist molecules remain in blood, tissue, gastrointestinal tract, or skin depot. As antagonist concentration falls, agonists can reoccupy receptors and suppress breathing again.",
      pathophysiology: "Competitive reversal depends on relative concentrations and affinities. The initial dose may restore some breathing without displacing all agonist, especially with high-affinity buprenorphine or large fentanyl exposure. Repeated nasal devices or clinical titration can increase antagonism, but ventilation must continue during onset. Once naloxone clears, residual agonist can rebind. Co-ingestants do not respond at all, so persistent coma after improved ventilation requires broader assessment. Observation duration is therefore individualized to opioid, route, formulation, response, co-ingestants, and clinical course rather than a universal clock.",
      riskFactors: ["Methadone, ER/LA opioids, fentanyl patches, buprenorphine, large doses, and renal metabolite accumulation increase mismatch risk because agonist effect persists.", "Unknown counterfeit pills and mixed sedatives make response incomplete because more than one mechanism may be present.", "Early departure after awakening increases risk because recurrence can occur without a rescuer present."],
      signsSymptoms: ["Increasing sleepiness, slower or shallower breathing, recurrent snoring or gurgling while unresponsive, miosis, or cyanosis after initial improvement indicates recurrent toxicity.", "Vomiting, pain, diarrhea, agitation, tachycardia, and mydriasis after reversal suggest precipitated withdrawal rather than recurrent agonism.", "Persistent normal pupils or incomplete awakening does not exclude opioid effect because pupils and co-ingestants vary."],
      diagnostics: ["Record product, dose, route, time, breathing response, repeat doses, suspected opioid, formulation, patches, and co-ingestants because the time course guides surveillance.", "Continue serial arousal and ventilation assessment because a single post-dose check can miss recurrence.", "Investigate glucose, trauma, stroke, infection, hypoxia, and co-ingestants when response is partial because naloxone is also a diagnostic clue, not a complete diagnosis."],
      labs: ["Blood gas can show persistent hypercapnia because oxygenation improvement does not guarantee adequate ventilation.", "Kidney and liver function help identify prolonged parent or metabolite exposure.", "Toxicology can miss fentanyl or buprenorphine and should not determine whether repeat rescue is given."],
      treatments: ["Repeat the available naloxone product with a new device according to its label when breathing fails to improve or depression returns because antagonist exposure may be insufficient.", "Support ventilation and activate emergency care throughout because each dose requires time and may not reverse co-ingestants.", "In monitored clinical care, repeated boluses or infusion may be considered by protocol for recurrent long-acting toxicity because maintaining antagonist effect can match ongoing agonist exposure."],
      nursingPriorities: ["Trend breathing depth and arousability continuously or at protocol intervals because recurrence can be subtle before apnea.", "Avoid chasing complete alertness when adequate ventilation is restored because excessive antagonism can worsen pain and withdrawal.", "Prepare for vomiting, agitation, aspiration, and rapid transition to OUD care because reversal creates both medical and engagement opportunities."],
      complications: ["Recurrent apnea and hypoxic injury can occur if observation ends too early.", "Severe withdrawal, aspiration, pulmonary edema, or cardiovascular stress can follow abrupt reversal.", "Persistent non-opioid toxicity can be missed if every abnormality is attributed to opioids."],
      contraindications: ["Do not set a universal safe discharge time because opioid duration and clinical course vary.", "Do not withhold repeat naloxone when breathing worsens because concern about withdrawal is secondary to ventilation.", "Do not interpret absent response as proof no opioid is present because dose, delivery, buprenorphine, and co-ingestants can limit response."],
      redFlags: ["Recurrent slow or shallow breathing, difficult arousal, cyanosis, or apnea", "Need for repeated doses, suspected methadone, patch, ER product, or unknown counterfeit pill", "Persistent coma, focal deficit, fever, trauma, or severe hypoxia despite adequate ventilation"],
      patientEducation: ["Stay with the person and call emergency services even after they wake because naloxone can wear off first.", "Use a new nasal device for each repeat dose according to the product instructions.", "A nonfatal overdose is a strong reason to offer medication treatment and take-home reversal supplies."],
      nclexTraps: ["Renarcotization means recurrent opioid effect after reversal wanes.", "Adequate ventilation, not complete wakefulness, is the titration goal in monitored care.", "Repeat doses do not replace observation and breathing support."],
      relatedTopics: ["Naloxone", "Opioid overdose", "Opioid-induced respiratory depression", "Nalmefene"],
      sourceNote: "Current NARCAN label (" + NARCAN_LABEL + "), CDC naloxone guidance (" + CDC_NALOXONE + "), and FDA overdose-reversal information (" + FDA_REVERSAL + ").",
      tags: ["naloxone response", "renarcotization", "repeat naloxone", "recurrent toxicity", "ventilation"]
    }),

    conceptCard({
      name: "Opioid use disorder in pregnancy and peripartum care",
      category: "Maternal health and addiction medicine",
      aliases: ["OUD in pregnancy", "pregnant on methadone", "pregnant on buprenorphine", "opioid addiction pregnancy", "opioid use in pregnancy", "labor on methadone", "postpartum OUD", "breastfeeding methadone buprenorphine"],
      definition: "Opioid use disorder in pregnancy is treated as a chronic medical condition requiring coordinated obstetric, addiction, pediatric, anesthesia, and social care. Methadone or buprenorphine is generally preferred because stable receptor coverage reduces withdrawal, craving, nonmedical use, overdose, and erratic fetal exposure. Medically supervised withdrawal is not the routine preferred approach because return-to-use rates are high. Neonatal opioid withdrawal can occur after appropriate maternal treatment; it is expected, monitorable, and treatable and is not a reason to deny or underdose life-saving maternal medication.",
      etiology: "Pregnancy may occur during prescribed opioid exposure, nonmedical use, or established OUD. Physiologic changes in plasma volume, metabolism, renal clearance, and gastrointestinal function can alter medication exposure, especially later in pregnancy and after delivery.",
      pathology: "Maternal intoxication can cause hypoventilation and fetal hypoxia, while withdrawal and repeated short-acting cycles create autonomic and fetal stress. Stable agonist therapy reduces those peaks and troughs. Placental exposure can produce neonatal dependence, leading to withdrawal after birth when placental supply stops.",
      pathophysiology: "Methadone full-agonist or buprenorphine partial-agonist treatment stabilizes maternal receptors and reduces craving and unsafe supply exposure. Pregnancy can accelerate methadone metabolism, so selected patients require individualized dose or interval adjustment rather than intentional underdosing to reduce neonatal symptoms. During labor and postpartum care, the maintenance medication continues because it prevents withdrawal but does not provide complete surgical or labor analgesia; multimodal and neuraxial strategies address additional pain. The postpartum period increases return-to-use and overdose vulnerability, making continuity and support essential.",
      riskFactors: ["Untreated OUD, fentanyl exposure, sedative co-use, prior overdose, unstable housing, intimate-partner violence, and poor treatment access increase maternal and fetal risk.", "Rapid pregnancy-related metabolic changes can produce end-of-dose withdrawal because exposure falls faster.", "Postpartum sleep loss, pain, mood disorders, loss of services, and tolerance change increase recurrence and overdose risk."],
      signsSymptoms: ["Withdrawal, intoxication, craving, missed doses, sedation, respiratory depression, infection, poor nutrition, and inconsistent prenatal care can signal unmet treatment needs.", "End-of-dose withdrawal in pregnancy may present as craving, cramps, insomnia, anxiety, nausea, and autonomic symptoms because clearance has changed.", "Newborn tremor, high-pitched cry, poor feeding, diarrhea, sweating, and sleep difficulty can reflect neonatal withdrawal after delivery."],
      diagnostics: ["Use universal verbal screening with consent and nonpunitive communication because trust improves prenatal care and disclosure.", "Assess exact opioids, MOUD, last dose, withdrawal, overdose, sedatives, infection, mental health, safety, and social needs because pregnancy care must address the whole risk context.", "Coordinate pediatric monitoring for opioid-exposed newborns because symptoms can begin after birth according to the maternal drug and timing."],
      labs: ["Offer pregnancy-appropriate HIV, hepatitis, STI, liver, renal, and infection testing according to exposure because treatment improves maternal and neonatal outcomes.", "ECG and electrolytes support methadone safety when QT risk is present.", "Toxicology is used with informed consent and knowledge of local policy because punitive use can drive patients away from care."],
      treatments: ["Continue or initiate methadone or buprenorphine through an experienced pathway because stable treatment reduces withdrawal and return-to-use risk.", "Continue the maintenance dose through labor and postpartum hospitalization and add individualized analgesia because MOUD prevents withdrawal but does not cover all acute pain.", "Provide naloxone, postpartum treatment continuity, mental-health care, contraception or reproductive planning, and social support because mortality risk extends beyond delivery."],
      nursingPriorities: ["Verify and give time-critical MOUD because missed dosing can provoke maternal withdrawal and unsafe return to use.", "Avoid mixed agonist-antagonist opioids such as butorphanol, nalbuphine, or pentazocine in a dependent patient because they can precipitate withdrawal.", "Use nonjudgmental family-centered teaching and prepare newborn monitoring because expected withdrawal is treatable and does not imply maternal failure."],
      complications: ["Overdose, infection, placental complications, fetal growth problems, preterm birth, and loss of prenatal care can follow untreated or unstable OUD.", "Neonatal opioid withdrawal can impair feeding, sleep, weight gain, and autonomic stability but responds to supportive and medication care.", "Postpartum recurrence, overdose, depression, and suicide risk can rise when treatment and support fragment."],
      contraindications: ["Do not abruptly stop methadone or buprenorphine to protect the fetus because withdrawal and return to use can be more dangerous.", "Do not reduce methadone solely to minimize neonatal withdrawal because symptom severity does not reliably track maternal dose and undertreatment increases craving.", "Do not assume maintenance medication supplies labor analgesia because additional pain control is usually required."],
      redFlags: ["Maternal slow breathing, unresponsiveness, cyanosis, overdose, severe withdrawal, or suicidal intent", "Missed MOUD with inability to obtain the next dose", "Newborn poor feeding, excessive sleep disruption, weight loss, fever, seizure, or respiratory difficulty"],
      patientEducation: ["Methadone or buprenorphine treatment protects pregnancy by preventing withdrawal and reducing unsafe opioid exposure.", "Neonatal withdrawal is expected and treatable; continuing effective maternal treatment is not harming the baby by default.", "Postpartum treatment and naloxone access remain essential because overdose risk can rise after delivery."],
      nclexTraps: ["Continue maintenance medication during labor and add analgesia.", "Avoid mixed agonist-antagonists because they can precipitate withdrawal.", "NOWS is not a reason to deny maternal MOUD."],
      relatedTopics: ["Medications for opioid use disorder", "Neonatal abstinence syndrome", "Methadone", "Buprenorphine"],
      sourceNote: "ACOG opioid use and OUD in pregnancy guidance (" + ACOG_OUD + "), CDC OUD guidance (" + CDC_OUD + "), and SAMHSA TIP 63 (" + SAMHSA_TIP + ").",
      sourceKeys: ["acog-oud-pregnancy", "cdc-oud-treatment", "samhsa-tip63"],
      tags: ["pregnancy", "OUD", "methadone", "buprenorphine", "peripartum", "postpartum"]
    }),

    conceptCard({
      name: "Neonatal abstinence syndrome",
      category: "Newborn withdrawal and family-centered care",
      replaceExistingAliases: true,
      aliases: ["neonatal opioid withdrawal syndrome", "NOWS", "NAS", "baby withdrawing from opioids", "newborn opioid withdrawal", "eat sleep console", "high pitched cry tremor diarrhea newborn", "neonatal opiate withdrawal"],
      abbreviations: ["NOWS", "NAS", "ESC"],
      definition: "Neonatal abstinence syndrome is a broader term for newborn withdrawal after prenatal substance exposure; neonatal opioid withdrawal syndrome is the opioid-specific form. After birth, placental opioid delivery stops while the newborn nervous, autonomic, and gastrointestinal systems remain adapted to exposure. Symptoms can include tremor, increased tone, irritability, high-pitched cry, poor sleep, sweating, sneezing, yawning, vomiting, loose stools, feeding difficulty, poor weight gain, and skin breakdown. Severity depends on opioid type and timing, metabolism, genetics, co-exposures, feeding, environment, and care—not simply the maternal medication dose.",
      etiology: "NOWS can follow prenatal methadone, buprenorphine, heroin, fentanyl, or prescription opioid exposure. Nicotine, benzodiazepines, SSRIs, gabapentinoids, and other exposures can modify the presentation, while prematurity may change expression.",
      pathology: "Fetal opioid exposure creates receptor and autonomic adaptation. Cord separation abruptly removes drug delivery, leaving increased noradrenergic and neural excitability, faster gastrointestinal transit, disorganized state regulation, and impaired feeding-sleep coordination.",
      pathophysiology: "Withdrawal timing reflects maternal drug half-life, placental transfer, last exposure, and newborn clearance. Short-acting exposures may present earlier, while methadone or buprenorphine symptoms may be delayed. Low-stimulation care, swaddling, skin-to-skin contact, rooming-in, caregiver presence, and frequent calorie-dense or otherwise individualized feeding reduce energy expenditure and help regulation. Eat, Sleep, Console assesses whether the infant can eat effectively, sleep adequately, and be consoled, linking treatment to function. Medication is added when supportive care cannot maintain safe function or complications emerge.",
      riskFactors: ["Longer or later prenatal opioid exposure can produce dependence because fetal receptors remain activated near delivery.", "Polysubstance exposure, prematurity, illness, poor feeding, and fragmented caregiver support can change severity because several regulatory stressors combine.", "Stigma and separation can worsen engagement and reduce caregiver participation, which is itself therapeutic."],
      signsSymptoms: ["High-pitched cry, tremor, hypertonia, exaggerated Moro response, irritability, poor sleep, sneezing, yawning, sweating, and temperature instability reflect neurologic and autonomic excitation.", "Poor feeding, uncoordinated suck, vomiting, loose stools, weight loss, and excoriation reflect GI hyperactivity and high energy expenditure.", "Seizure, respiratory difficulty, fever, lethargy, or focal findings require evaluation for other newborn disease because not every symptom is withdrawal."],
      diagnostics: ["Obtain a respectful prenatal exposure and medication history and review timing because withdrawal onset follows drug pharmacology.", "Use the facility's validated functional or symptom-based approach, such as Eat, Sleep, Console, because consistent trends guide care better than isolated impressions.", "Evaluate sepsis, hypoglycemia, electrolyte disturbance, neurologic disease, feeding disorder, and other exposures when findings are atypical because withdrawal is a diagnosis of context and exclusion."],
      labs: ["Glucose, electrolytes, bilirubin, infection studies, or toxicology are selected by presentation because newborn metabolic and infectious disease can mimic withdrawal.", "Toxicology cannot show severity or parenting fitness and has different detection windows by specimen.", "Weight, intake, output, and feeding effectiveness are essential physiologic measurements because dehydration and growth failure are common complications."],
      treatments: ["Prioritize rooming-in, skin-to-skin contact, swaddling, low stimulation, caregiver soothing, and individualized frequent feeding because regulation and energy conservation reduce symptoms.", "Use the institutional medication pathway when the infant cannot safely eat, sleep, be consoled, gain weight, or remain physiologically stable because supportive care alone is then insufficient.", "Coordinate maternal OUD treatment, lactation guidance, social support, safe sleep, follow-up, and a nonpunitive discharge plan because infant and caregiver recovery are linked."],
      nursingPriorities: ["Trend feeding volume and coordination, sleep, consolability, tone, tremor, stools, emesis, weight, hydration, skin, and temperature because function determines escalation.", "Teach and coach caregivers in soothing rather than separating them because caregiver presence is an active treatment.", "Use nonstigmatizing language and protect confidentiality because shame can reduce prenatal, postpartum, and pediatric follow-up."],
      complications: ["Dehydration, poor weight gain, aspiration, skin breakdown, sleep disruption, and prolonged hospitalization can occur when feeding and regulation fail.", "Seizures are uncommon and require evaluation for other causes because hypoglycemia, infection, and neurologic disease can coexist.", "Caregiver treatment interruption and postpartum overdose can threaten family safety after discharge."],
      contraindications: ["Do not reduce effective maternal methadone or buprenorphine solely to prevent NOWS because undertreatment raises maternal withdrawal and return-to-use risk.", "Do not diagnose every irritable or tremulous newborn with NOWS because sepsis, hypoglycemia, neurologic disease, and other exposures must be considered.", "Do not treat the score instead of the infant because feeding, sleep, consolability, growth, and physiology define clinical need."],
      redFlags: ["Poor feeding with dehydration or excessive weight loss", "Seizure, respiratory distress, fever, lethargy, apnea, or focal neurologic findings", "Unsafe caregiver sedation, loss of maternal treatment, or inability to arrange follow-up"],
      patientEducation: ["Withdrawal is an expected physiologic adaptation after exposure, not proof of poor parenting.", "Your voice, touch, skin-to-skin contact, swaddling, and feeding help regulate the baby's nervous system.", "Continue your own OUD treatment and keep postpartum follow-up because caregiver stability protects the infant."],
      nclexTraps: ["NOWS is opioid-specific; NAS is the broader term.", "Eat, Sleep, Console links treatment to function.", "Maternal MOUD should not be stopped merely to prevent neonatal withdrawal."],
      relatedTopics: ["Opioid use disorder in pregnancy and peripartum care", "Methadone", "Buprenorphine"],
      sourceNote: "ACOG OUD in pregnancy guidance (" + ACOG_OUD + ") and SAMHSA OUD treatment guidance (" + SAMHSA_TIP + ").",
      sourceKeys: ["acog-oud-pregnancy", "samhsa-tip63"],
      tags: ["NOWS", "NAS", "Eat Sleep Console", "newborn", "withdrawal", "family centered"]
    }),

    conceptCard({
      name: "Patient-controlled analgesia opioid safety",
      category: "Nursing medication safety",
      aliases: ["PCA opioid safety", "PCA pump", "patient controlled analgesia", "morphine PCA", "hydromorphone PCA", "PCA basal rate", "PCA lockout", "can family press PCA button"],
      abbreviations: ["PCA"],
      definition: "Patient-controlled analgesia is an opioid-delivery and medication-safety process that lets an eligible patient self-administer small demand doses within programmable limits. Its central safety principle is behavioral feedback: a patient becoming sedated should stop pressing the button. Proxy activation by family or untrained staff breaks that feedback loop and can continue dosing a patient whose ventilation is already declining. Demand dose, lockout interval, concentration, loading dose, hourly limit, basal infusion, and every other opioid or sedative route together determine total exposure.",
      etiology: "PCA is used for selected postoperative, acute, cancer, or sickle-cell pain when the patient can understand and physically activate the device. Harm arises from programming or concentration error, basal infusion in an opioid-naive or high-risk patient, proxy dosing, duplicate opioids, residual anesthesia, renal decline, sleep apnea, or inadequate monitoring.",
      pathology: "PCA opioids produce the same mu-receptor analgesia and respiratory depression as other routes. Rapid parenteral delivery shortens the time between dose and peak effect, while repeated demands and basal infusion can stack before prior doses fully equilibrate.",
      pathophysiology: "Correctly selected demand dosing can match analgesia to episodic need while lockout limits repeated delivery. The lockout does not cap total risk from basal infusion, clinician boluses, other routes, or co-sedatives. Sedation usually develops before arrest, so serial arousability and ventilation assessment detect risk earlier than cyanosis. Supplemental oxygen can mask desaturation, making respiratory depth and ventilation monitoring important in high-risk patients. A patient who cannot understand, remember, or physically press independently cannot provide the intended safety feedback.",
      riskFactors: ["Opioid-naive state, basal infusion, older age, obesity, sleep apnea, lung disease, renal or hepatic impairment, and residual anesthesia increase respiratory risk.", "Hydromorphone concentration confusion, programming error, duplicate orders, and route stacking increase exposure because PCA limits apply only to the programmed channel.", "Family pressing the button increases risk because sedation no longer stops demand dosing."],
      signsSymptoms: ["Increasing sedation, snoring, shallow breathing, reduced respiratory rate, confusion, hypotension, and decreasing demand attempts can signal excessive effect.", "Uncontrolled pain with frequent attempts can reflect inadequate regimen, anxiety, device misunderstanding, infiltration, or a new complication rather than drug-seeking.", "Miosis supports opioid effect but ventilation and arousability determine urgency."],
      diagnostics: ["Assess cognition, dexterity, language, understanding, pain mechanism, prior opioid exposure, sleep apnea, organ function, and co-sedatives before PCA because eligibility is a safety intervention.", "Verify concentration, demand dose, lockout, hourly limit, basal rate, clinician bolus, line tracing, and all other opioids because total delivery is distributed across settings and routes.", "Trend pain, function, sedation, respiratory rate and depth, oxygen context, and device history because the pump record alone cannot show physiologic effect."],
      labs: ["Kidney and liver function help predict parent or metabolite accumulation because repeated parenteral doses can stack when clearance falls.", "Blood gas or capnography is selected when ventilation is uncertain because supplemental oxygen can mask hypercapnia.", "No drug level replaces bedside sedation and respiratory assessment."],
      treatments: ["Stop or pause opioid delivery and activate the respiratory-depression protocol when significant sedation or hypoventilation appears because continued infusion can worsen apnea.", "Support airway and breathing and give naloxone according to protocol when opioid respiratory depression is clinically significant because ventilation is time-critical.", "Reassess pain cause, settings, multimodal options, and organ function rather than simply increasing the demand dose because uncontrolled pain and toxicity can coexist."],
      nursingPriorities: ["Only the patient presses the demand button unless a specialized protocol explicitly defines another mode because patient sedation is the safety brake.", "Use independent high-alert verification and line tracing because concentration and route errors can be fatal.", "Assess at protocol frequency and after settings, bolus, sedation, sleep, or clinical status changes because risk is dynamic."],
      complications: ["Respiratory depression, aspiration, hypotension, delirium, falls, ileus, urinary retention, and overdose can follow excessive delivery.", "Undertreated pain can impair coughing, mobility, sleep, and recovery when fear of opioids replaces balanced titration.", "Proxy dosing can cause fatal overdose because unconsciousness no longer stops administration."],
      contraindications: ["Do not use standard self-administered PCA when the patient cannot understand or independently activate the device because the feedback mechanism fails.", "Do not permit family or visitors to press the button because proxy dosing bypasses sedation protection.", "Do not interpret lockout as protection from basal infusion or other opioid routes because total exposure still accumulates."],
      redFlags: ["Difficult arousal, slow or shallow breathing, snoring or obstruction while unresponsive, cyanosis, or apnea", "Unexpectedly high delivered dose, concentration discrepancy, empty syringe, or programming mismatch", "New severe pain with swelling, neurologic deficit, fever, ischemia, or compartment signs"],
      patientEducation: ["Press only when you need a dose and only you should press the button because sleepiness is part of the safety design.", "Tell staff if pain remains severe, the line hurts, or the medicine makes you very sleepy because the settings or diagnosis may need review.", "Do not combine outside sedatives or alcohol with PCA opioids because breathing effects add."],
      nclexTraps: ["PCA by proxy is unsafe.", "The lockout does not limit a basal infusion or separate opioid order.", "Sedation is an early respiratory warning."],
      relatedTopics: ["Hydromorphone", "Morphine", "Opioid-induced respiratory depression", "Naloxone"],
      sourceNote: "Educational synthesis based on FDA opioid respiratory-risk communication (" + FDA_CLASS_2023 + ") and current morphine and hydromorphone labeling (" + DAILYMED + "morphine; " + DAILYMED + "hydromorphone).",
      tags: ["PCA", "patient controlled analgesia", "PCA by proxy", "lockout", "basal infusion", "nursing safety"]
    }),

    conceptCard({
      name: "Heroin",
      category: "Illicit opioid and toxicology",
      aliases: ["diacetylmorphine", "diamorphine", "street heroin", "heroine drug", "heroin use", "heroin withdrawal", "heroin overdose", "dope opioid"],
      definition: "Heroin, or diacetylmorphine, is a rapidly acting opioid derived from morphine. Acetyl groups increase lipid solubility, allowing fast brain entry after injection, smoking, or insufflation. It is deacetylated to 6-monoacetylmorphine and then morphine, which activate mu receptors and can produce euphoria, analgesia, sedation, dependence, and fatal respiratory depression. In many current illicit markets, material sold as heroin may contain or be replaced by illicitly manufactured fentanyl, so appearance, prior experience, and the seller's name cannot predict potency.",
      etiology: "Use can begin through experimentation, pain, trauma, social exposure, prior prescription-opioid use, or established OUD. Repeated rapid reward and withdrawal relief reinforce continued use, while unstable supply and injection increase toxicity and infection risk.",
      pathology: "Rapid CNS entry creates a steep reward signal and potent mu-receptor activation. Respiratory networks, arousal, cough, and gut motility are suppressed. Injection adds direct bloodstream exposure to bacteria, fungi, particulates, and adulterants.",
      pathophysiology: "Diacetylmorphine crosses the blood-brain barrier quickly and is converted to active 6-MAM and morphine. Fast peaks strengthen reinforcement; falling concentrations produce withdrawal and craving. Respiratory depression can progress to hypercapnia, hypoxemia, aspiration, arrest, and brain injury. Fentanyl contamination can make onset faster and naloxone requirements greater, while xylazine or benzodiazepines can prolong sedation that opioid antagonists do not reverse. Injection can seed skin, bone, valves, lungs, and the epidural space.",
      riskFactors: ["Using alone, injection, fentanyl contamination, unknown supply, prior overdose, sedative co-use, and reduced tolerance increase fatal risk.", "Nonsterile equipment, skin licking, groin or neck injection, and poor wound access increase infection and vascular injury.", "Abstinence after incarceration, hospitalization, detoxification, or treatment interruption lowers tolerance and makes a previous amount dangerous."],
      signsSymptoms: ["Euphoria, analgesia, drowsiness, miosis, slowed breathing, constipation, and impaired coordination reflect mu activation.", "Yawning, tearing, rhinorrhea, mydriasis, piloerection, aching, vomiting, diarrhea, and restlessness reflect withdrawal.", "Fever, new murmur, back pain, focal deficit, abscess, chest pain, or coughing blood can indicate injection-related infection or embolic disease."],
      diagnostics: ["Assess breathing and responsiveness first because overdose treatment cannot wait for substance confirmation.", "Ask route, last use, amount, fentanyl or xylazine possibility, sedatives, prior overdose, injection sites, and treatment goals because the supply name is unreliable.", "Use fentanyl-specific testing when relevant because routine opiate assays may detect morphine metabolites but do not characterize the full supply."],
      labs: ["Glucose, blood gas, renal and liver function, CK, ECG, acetaminophen level, and co-ingestant studies are selected in overdose because mixed poisoning and prolonged immobility are common.", "Blood cultures, CBC, inflammatory markers, HIV, hepatitis, and imaging are selected when injection infection is suspected because endocarditis and epidural abscess can be occult.", "Urine 6-MAM specifically supports recent heroin exposure but has a short detection window and is not needed to begin emergency care."],
      treatments: ["Treat overdose with emergency activation, ventilation, naloxone or another approved reversal agent, repeat dosing, and observation because illicit potency and co-ingestants are unpredictable.", "Offer buprenorphine or methadone treatment and take-home reversal medication because MOUD reduces withdrawal, craving, and overdose risk.", "Provide sterile-equipment, wound, infection, hepatitis, HIV, and social services where available because harm reduction and treatment are complementary."],
      nursingPriorities: ["Use person-first language and avoid assumptions about the supply because a patient may not know fentanyl was present.", "Inspect injection sites and ask about fever, back pain, chest symptoms, and neurologic change because serious infection can present subtly.", "Plan for tolerance loss and next-dose continuity at discharge because the transition period is high risk."],
      complications: ["Respiratory arrest, aspiration, hypoxic brain injury, pulmonary edema, rhabdomyolysis, compartment syndrome, and death can follow overdose.", "Abscess, cellulitis, endocarditis, sepsis, osteomyelitis, epidural abscess, HIV, hepatitis, vascular injury, and emboli can follow injection.", "OUD, depression, homelessness, trauma, and incarceration can compound risk when care remains fragmented."],
      contraindications: ["Do not assume material sold as heroin contains only heroin because fentanyl and other adulterants are common.", "Do not wait for a positive heroin test before treating apnea because ventilation is time-critical.", "Do not use stigmatizing labels because they reduce disclosure and life-saving engagement."],
      redFlags: ["Unresponsiveness, slow or absent breathing, cyanosis, or recurrent sedation", "Fever, new murmur, severe back pain, focal neurologic deficit, spreading wound, chest pain, or hemoptysis", "Return to use after abstinence or treatment interruption"],
      patientEducation: ["The illicit supply is unpredictable, so carry naloxone, avoid using alone, and use test or drug-checking resources where available.", "Buprenorphine and methadone are effective treatments that reduce withdrawal and overdose risk.", "Seek urgent care for fever, new back pain, weakness, chest symptoms, or spreading skin injury because injection infections can become life-threatening."],
      nclexTraps: ["Heroin becomes 6-MAM and morphine; illicit fentanyl may be present even when heroin was expected.", "Naloxone reverses opioid effect but not xylazine, benzodiazepines, or infection.", "A negative routine screen cannot characterize an unknown supply."],
      relatedTopics: ["Opioid use disorder", "Opioid overdose", "Opioid withdrawal", "Naloxone"],
      sourceNote: "CDC overdose and OUD guidance (" + CDC_NALOXONE + "; " + CDC_OUD + ") and SAMHSA TIP 63 (" + SAMHSA_TIP + ").",
      sourceKeys: ["cdc-naloxone", "cdc-oud-treatment", "samhsa-tip63"],
      tags: ["heroin", "diacetylmorphine", "6-MAM", "fentanyl contamination", "injection", "OUD"]
    })
  ];

  const pharmCards = [...classCards, ...drugCards];

  /* Curated Wave24 identities own their exact names, aliases, abbreviations, and brands.
     This removes legacy source aliases from other cards before canonical-name upsert. */
  const curatedAliasOwner = new Map();
  pharmCards.forEach((card) => {
    const owner = normalize(card.generic || card.name || card.displayName);
    [card.name, card.generic, card.displayName, ...(card.aliases || []), ...(card.abbreviations || []), ...(card.brandExamples || [])]
      .map(normalize).filter(Boolean).forEach((identity) => curatedAliasOwner.set(identity, owner));
  });

  db.drugs = db.drugs.map((drug) => {
    const key = normalize(drug.generic || drug.name || drug.displayName);
    if (!key) return drug;
    const aliases = (drug.aliases || []).filter((alias) => {
      const owner = curatedAliasOwner.get(normalize(alias));
      return !owner || owner === key;
    });
    const abbreviations = (drug.abbreviations || []).filter((abbreviation) => {
      const owner = curatedAliasOwner.get(normalize(abbreviation));
      return !owner || owner === key;
    });
    const brandExamples = (drug.brandExamples || []).filter((brand) => {
      const owner = curatedAliasOwner.get(normalize(brand));
      return !owner || owner === key;
    });
    return { ...drug, aliases, abbreviations, brandExamples };
  });

  /* Only canonical generic/name/displayName equality may replace a medication card.
     Alias matches never merge cards, and curated replacements do not inherit polluted aliases. */
  pharmCards.forEach((card) => {
    const key = normalize(card.generic || card.name || card.displayName);
    const matchingIndices = [];
    db.drugs.forEach((entry, index) => {
      if (normalize(entry.generic || entry.name || entry.displayName) === key) matchingIndices.push(index);
    });
    const index = matchingIndices.find((candidate) =>
      !db.drugs[candidate].hidden && db.drugs[candidate].studentFacing !== false
    );
    const targetIndex = Number.isInteger(index) ? index : matchingIndices[0];
    const existing = Number.isInteger(targetIndex) ? db.drugs[targetIndex] : {};
    const inheritIdentity = !card.replaceExistingAliases;
    const inheritedAliases = inheritIdentity ? (existing.aliases || []).filter((alias) => {
      const owner = curatedAliasOwner.get(normalize(alias));
      return !owner || owner === key;
    }) : [];
    const inheritedAbbreviations = inheritIdentity ? (existing.abbreviations || []).filter((abbreviation) => {
      const owner = curatedAliasOwner.get(normalize(abbreviation));
      return !owner || owner === key;
    }) : [];
    const inheritedBrands = inheritIdentity ? (existing.brandExamples || []).filter((brand) => {
      const owner = curatedAliasOwner.get(normalize(brand));
      return !owner || owner === key;
    }) : [];
    const merged = {
      ...existing,
      ...card,
      aliases: unique([...(card.aliases || []), ...inheritedAliases]),
      abbreviations: unique([...(card.abbreviations || []), ...inheritedAbbreviations]),
      brandExamples: unique([...(card.brandExamples || []), ...inheritedBrands]),
      tags: unique(["frontier-wave24", "strict why closure", ...(card.tags || []), ...(existing.tags || [])])
    };
    delete merged.replaceExistingAliases;
    if (Number.isInteger(targetIndex)) db.drugs[targetIndex] = merged;
    else db.drugs.push(merged);

    /* Preserve unrelated source-array ordering, but hide duplicate exact canonical cards so
       only the curated Wave24 study card remains student-facing. */
    matchingIndices.filter((candidate) => candidate !== targetIndex).forEach((duplicateIndex) => {
      db.drugs[duplicateIndex] = {
        ...db.drugs[duplicateIndex],
        aliases: [],
        abbreviations: [],
        brandExamples: [],
        hidden: true,
        studentFacing: false,
        recognitionOnly: true,
        canonicalDuplicateOf: key
      };
    });
  });

  /* Pathology and clinical concepts also merge only by exact canonical name/title. */
  pathologyCards.forEach((incoming) => {
    const canonical = normalize(incoming.name || incoming.title);
    const index = pathology.diseases.findIndex((entry) =>
      [entry.name, entry.title].map(normalize).filter(Boolean).includes(canonical)
    );
    const existing = index >= 0 ? pathology.diseases[index] : {};
    const inheritAliases = !incoming.replaceExistingAliases;
    const merged = {
      ...existing,
      ...incoming,
      aliases: unique([...(incoming.aliases || []), ...(inheritAliases ? (existing.aliases || []) : [])]),
      abbreviations: unique([...(incoming.abbreviations || []), ...(inheritAliases ? (existing.abbreviations || []) : [])]),
      tags: unique(["frontier-wave24", "strict why closure", ...(incoming.tags || []), ...(existing.tags || [])])
    };
    delete merged.replaceExistingAliases;
    if (index >= 0) pathology.diseases[index] = merged;
    else pathology.diseases.push(merged);
  });

  /* The generic substance-use umbrella must not retain the dedicated OUD card's identities. */
  pathology.diseases = pathology.diseases.map((entry) => {
    const key = normalize(entry.name || entry.title);
    if (key !== "substance use disorders") return entry;
    const reserved = new Set(["opioid use disorder", "oud", "opiate use disorder", "opioid addiction"]);
    return {
      ...entry,
      aliases: (entry.aliases || []).filter((alias) => !reserved.has(normalize(alias))),
      abbreviations: (entry.abbreviations || []).filter((abbreviation) => !reserved.has(normalize(abbreviation)))
    };
  });

  const sourceReferences = [
    { key: "cdc-opioid-guideline-2022", label: "CDC Clinical Practice Guideline for Prescribing Opioids for Pain (2022)", url: CDC_GUIDELINE },
    { key: "cdc-oud-treatment", label: "CDC: Opioid Use Disorder—Treating", url: CDC_OUD },
    { key: "cdc-naloxone", label: "CDC: About Naloxone and Opioid Overdose Reversal", url: CDC_NALOXONE },
    { key: "fda-opioid-labeling-2023", label: "FDA opioid pain medicine labeling update (2023)", url: FDA_CLASS_2023 },
    { key: "fda-opioid-labeling-2025", label: "FDA major opioid pain medicine labeling changes (2025)", url: FDA_CLASS_2025 },
    { key: "fda-overdose-reversal", label: "FDA information about naloxone and nalmefene", url: FDA_REVERSAL },
    { key: "samhsa-tip63", label: "SAMHSA TIP 63: Medications for Opioid Use Disorder", url: SAMHSA_TIP },
    { key: "acog-oud-pregnancy", label: "ACOG: Opioid Use and Opioid Use Disorder in Pregnancy", url: ACOG_OUD },
    { key: "dailymed-narcan", label: "DailyMed NARCAN naloxone nasal spray label", url: NARCAN_LABEL },
    { key: "dailymed-opvee", label: "DailyMed OPVEE nalmefene nasal spray label", url: OPVEE_LABEL },
    { key: "dailymed-lofexidine", label: "DailyMed LUCEMYRA lofexidine label", url: LUCEMYRA_LABEL },
    { key: "dailymed-buprenorphine-naloxone", label: "DailyMed buprenorphine/naloxone labels", url: DAILYMED + "buprenorphine%20naloxone" },
    { key: "dailymed-opioid-acetaminophen", label: "DailyMed opioid/acetaminophen combination labels", url: DAILYMED + "opioid%20acetaminophen" },
    { key: "dailymed-mixed-opioids", label: "DailyMed butorphanol, nalbuphine, and pentazocine labels", url: DAILYMED + "butorphanol" },
    { key: "dailymed-morphine", label: "DailyMed morphine labels", url: DAILYMED + "morphine" },
    { key: "dailymed-hydromorphone", label: "DailyMed hydromorphone labels", url: DAILYMED + "hydromorphone" },
    { key: "dailymed-fentanyl-transdermal", label: "DailyMed fentanyl transdermal system labels", url: DAILYMED + "fentanyl%20transdermal" },
    { key: "dailymed-oxycodone", label: "DailyMed oxycodone labels", url: DAILYMED + "oxycodone" },
    { key: "dailymed-hydrocodone", label: "DailyMed hydrocodone labels", url: DAILYMED + "hydrocodone" },
    { key: "dailymed-codeine", label: "DailyMed codeine labels", url: DAILYMED + "codeine" },
    { key: "dailymed-tramadol", label: "DailyMed tramadol labels", url: DAILYMED + "tramadol" },
    { key: "dailymed-tapentadol", label: "DailyMed tapentadol labels", url: DAILYMED + "tapentadol" },
    { key: "dailymed-meperidine", label: "DailyMed meperidine labels", url: DAILYMED + "meperidine" },
    { key: "dailymed-methadone", label: "DailyMed methadone labels", url: DAILYMED + "methadone" },
    { key: "dailymed-buprenorphine", label: "DailyMed buprenorphine labels", url: DAILYMED + "buprenorphine" },
    { key: "dailymed-naltrexone", label: "DailyMed naltrexone labels", url: DAILYMED + "naltrexone" }
  ];
  const referenceMap = new Map((Array.isArray(db.sourceReferences) ? db.sourceReferences : [])
    .map((reference) => [reference && reference.key, reference]).filter(([key]) => key));
  sourceReferences.forEach((reference) => referenceMap.set(reference.key, reference));
  db.sourceReferences = Array.from(referenceMap.values());

  db.pharmFrontierWave24OpioidCausalPatch = {
    version: VERSION,
    promotedDrugCount: drugCards.length,
    pathwayCardCount: classCards.length,
    pathologyConceptCount: pathologyCards.length,
    totalCardCount: pharmCards.length + pathologyCards.length,
    canonicalNameMergeOnly: true,
    aliasSetsReplaced: true,
    sourceRevision: "CDC 2022 + FDA 2023/2025 + SAMHSA TIP 63 + current DailyMed labels"
  };
  db.version = [db.version, "pharm-frontier-wave24-opioid-causal"].filter(Boolean).join("+");
  pathology.frontierWave24OpioidConceptCount = pathologyCards.length;
  pathology.diseaseCount = pathology.diseases.length;
  pathology.version = [pathology.version, "pharm-frontier-wave24-opioid-causal"].filter(Boolean).join("+");
  window.ANI_PHARM_DATABASE = db;
  window.ANI_PATHOLOGY_DATABASE = pathology;
}());
