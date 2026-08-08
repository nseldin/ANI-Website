/* eslint-disable */
/* Wave 37 clinical C: canonical Lenacapavir, folate-deficiency-anemia, and diabetic-foot-ulcer references. */
(function () {
  "use strict";

  const VERSION = "2026-07-21-wave37-clinical-c-4";
  const SCHEMA_VERSION = 1;
  const GLOBAL_NAME = "ANI_CLINICAL_FRONTIER_WAVE37_CLINICAL_C";
  if (window[GLOBAL_NAME] && window[GLOBAL_NAME].version === VERSION) return;

  const clean = (value) => String(value == null ? "" : value).trim();
  const normalize = (value) => clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const unique = (values) => Array.from(new Set((values || []).filter((value) => clean(value))));
  const titleOf = (entry) => clean(entry && (entry.name || entry.title || entry.displayName));
  const medicationIdentityKeys = (entry) => unique([
    entry && entry.name,
    entry && entry.displayName,
    entry && entry.generic,
    entry && entry.genericName,
    entry && entry.title
  ]).map(normalize).filter(Boolean);

  const sourceReferences = Object.freeze([
    Object.freeze({
      key: "w37-fda-sunlenca-2026",
      label: "FDA-approved SUNLENCA (lenacapavir) prescribing information, revised March 2026",
      url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=e5652804-29c4-40d7-aeb2-0142ed2a7b5b",
      note: "Controlling current U.S. treatment indication, schedule, contraindication, long-acting tail, interaction, resistance, administration, and safety source."
    }),
    Object.freeze({
      key: "w37-fda-sunlenca-original-2022",
      label: "FDA SUNLENCA original approval prescribing information (2022)",
      url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/215973s000lbl.pdf",
      note: "FDA approval record supporting the original product indication and label history; the 2026 current label controls when details differ."
    }),
    Object.freeze({
      key: "w37-fda-yeztugo-2025",
      label: "FDA-approved YEZTUGO (lenacapavir) prescribing information (2025)",
      url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=1c241af1-ce62-4b0a-9eb7-f6b626174f01",
      note: "Controlling U.S. PrEP indication, HIV-screening, resistance-tail, injection, interaction, and population source."
    }),
    Object.freeze({
      key: "w37-nih-lenacapavir-2026",
      label: "NIH Clinicalinfo pediatric antiretroviral drug information: Lenacapavir (updated June 25, 2026)",
      url: "https://clinicalinfo.hiv.gov/sites/g/files/mnhszr391/files/guidelines/documents/pediatric-arv/drug-information-capsid-inhibitors-lenacapavir-pediatric-arv.pdf",
      note: "Current federal HIV guidance reconciling Sunlenca treatment, Yeztugo PrEP, product-specific initiation, continuation, and prolonged pharmacokinetic-persistence planning."
    }),
    Object.freeze({
      key: "w37-nih-len-interactions-2024",
      label: "NIH Adult and Adolescent ARV Guidelines, lenacapavir drug-interaction table",
      url: "https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-arv/drug-interactions-capsid-inhibitor",
      note: "Supports mechanism-based, medication-specific interaction review and the persistent interaction window after injection."
    }),
    Object.freeze({
      key: "w37-nih-len-characteristics-2025",
      label: "NIH Adult and Adolescent ARV Guidelines, characteristics of the capsid inhibitor",
      url: "https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-arv/drug-characteristics-tables",
      note: "Supports current treatment formulation, pharmacokinetic, adverse-effect, and administration context."
    }),
    Object.freeze({
      key: "w37-nih-hiv-resistance-2024",
      label: "NIH Adult and Adolescent ARV Guidelines, drug-resistance testing",
      url: "https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-arv/drug-resistance-testing",
      note: "Supports resistance-testing limitations, including the absence of a routinely available commercial capsid-inhibitor assay."
    }),
    Object.freeze({
      key: "w37-nih-ods-folate",
      label: "NIH Office of Dietary Supplements: Folate fact sheet for health professionals",
      url: "https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/",
      note: "Supports one-carbon physiology, megaloblastic anemia, intake, biomarker limitations, risk groups, pregnancy relevance, and excess-supplement cautions."
    }),
    Object.freeze({
      key: "w37-nih-ods-b12",
      label: "NIH Office of Dietary Supplements: Vitamin B12 fact sheet for health professionals",
      url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
      note: "Supports B12 physiology, neurologic risk, and methylmalonic-acid interpretation in the central folate-versus-B12 differential."
    }),
    Object.freeze({
      key: "w37-nhlbi-anemia-diagnosis",
      label: "NIH/NHLBI: Anemia diagnosis",
      url: "https://www.nhlbi.nih.gov/health/anemia/diagnosis",
      note: "Supports clinical history, examination, CBC-based evaluation, etiologic testing, and hematology escalation."
    }),
    Object.freeze({
      key: "w37-nhlbi-anemia-treatment",
      label: "NIH/NHLBI: Anemia treatment and management",
      url: "https://www.nhlbi.nih.gov/health/anemia/treatment",
      note: "Supports cause- and severity-directed management, specialist treatment, and transfusion only for serious anemia contexts."
    }),
    Object.freeze({
      key: "w37-nhsbt-b12-folate-2025",
      label: "NHS Blood and Transplant: B12 and folate deficiency anemia toolkit (reviewed 2025)",
      url: "https://hospital.blood.co.uk/patient-services/patient-blood-management/anaemia/b12-and-folate-deficiency/",
      note: "Current hematology-service source emphasizing timely recognition, mixed deficiency, and prevention of irreversible B12-related harm."
    }),
    Object.freeze({
      key: "w37-bsh-folate-guideline",
      label: "British Society for Haematology: diagnosis of B12 and folate deficiency",
      url: "https://b-s-h.org.uk/guidelines/guidelines/diagnosis-of-b12-and-folate-deficiency",
      note: "Supports folate-assay interpretation and hematologic differential. Its B12 recommendations are superseded by NICE 2024, so ANI does not use it as current B12 treatment guidance."
    }),
    Object.freeze({
      key: "w37-bc-folate-2026",
      label: "Province of British Columbia: Folate Deficiency - Investigation and Management (updated May 2026)",
      url: "https://www2.gov.bc.ca/gov/content/health/practitioner-professional-resources/bc-guidelines/folate-deficiency",
      note: "Current public-health-system guidance for risk recognition, replacement context, and the B12 safety caution."
    }),
    Object.freeze({
      key: "w37-ada-foot-2026",
      label: "American Diabetes Association Standards of Care in Diabetes - 2026: Retinopathy, Neuropathy, and Foot Care",
      url: "https://diabetesjournals.org/care/article/49/Supplement_1/S261/163919/12-Retinopathy-Neuropathy-and-Foot-Care-Standards",
      note: "Current U.S. diabetes guidance for risk stratification, urgent referral, core ulcer treatment, surveillance, and evidence-limited adjuncts."
    }),
    Object.freeze({
      key: "w37-iwgdf-practical-2023",
      label: "International Working Group on the Diabetic Foot: Practical Guidelines (2023)",
      url: "https://iwgdfguidelines.org/wp-content/uploads/2023/07/IWGDF-2023-01-Practical-Guidelines.pdf",
      note: "Supports integrated ulcer assessment, wound care, infection, ischemia, offloading, and recurrence-prevention principles."
    }),
    Object.freeze({
      key: "w37-iwgdf-offloading-2023",
      label: "IWGDF guideline on offloading diabetes-related foot ulcers (2023)",
      url: "https://iwgdfguidelines.org/wp-content/uploads/2023/07/IWGDF-2023-06-Offloading-Guideline.pdf",
      note: "Supports location- and severity-specific offloading choices and why adherence to pressure relief changes healing."
    }),
    Object.freeze({
      key: "w37-iwgdf-idsa-infection-2023",
      label: "IWGDF/IDSA guideline on diagnosis and treatment of diabetes-related foot infections (2023)",
      url: "https://www.idsociety.org/practice-guideline/diabetic-foot-infections/",
      note: "Supports clinical infection diagnosis, culture technique, osteomyelitis evaluation, antibiotic stewardship, hospitalization, and surgical escalation."
    }),
    Object.freeze({
      key: "w37-iwgdf-pad-2023",
      label: "IWGDF/ESVS/SVS intersocietal guideline on peripheral artery disease and the diabetic foot (2023)",
      url: "https://iwgdfguidelines.org/wp-content/uploads/2023/07/IWGDF-2023-05-PAD-Guideline.pdf",
      note: "Supports multimodal perfusion assessment, prognosis, vascular consultation, and revascularization reasoning."
    }),
    Object.freeze({
      key: "w37-cdc-diabetes-feet-2024",
      label: "CDC: Your Feet and Diabetes (2024)",
      url: "https://www.cdc.gov/diabetes/diabetes-complications/diabetes-and-your-feet.html",
      note: "Supports patient-centered daily inspection, neuropathy and blood-flow mechanisms, early treatment, and amputation prevention."
    })
  ]);
  const sourceByKey = new Map(sourceReferences.map((source) => [source.key, source]));
  const installSourceReferences = (database, keys) => {
    if (!database || typeof database !== "object") return 0;
    if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];
    const current = new Map(database.sourceReferences
      .map((source) => [clean(source && (source.key || source.id)), source])
      .filter(([key]) => key));
    let installed = 0;
    keys.forEach((key) => {
      const source = sourceByKey.get(key);
      if (!source) return;
      current.set(key, { ...source });
      installed += 1;
    });
    database.sourceReferences = Array.from(current.values());
    return installed;
  };

  const lenacapavirSourceKeys = [
    "w37-fda-sunlenca-2026",
    "w37-fda-sunlenca-original-2022",
    "w37-fda-yeztugo-2025",
    "w37-nih-lenacapavir-2026",
    "w37-nih-len-interactions-2024",
    "w37-nih-len-characteristics-2025",
    "w37-nih-hiv-resistance-2024"
  ];
  const folateSourceKeys = [
    "w37-nih-ods-folate",
    "w37-nih-ods-b12",
    "w37-nhlbi-anemia-diagnosis",
    "w37-nhlbi-anemia-treatment",
    "w37-nhsbt-b12-folate-2025",
    "w37-bsh-folate-guideline",
    "w37-bc-folate-2026"
  ];
  const diabeticFootSourceKeys = [
    "w37-ada-foot-2026",
    "w37-iwgdf-practical-2023",
    "w37-iwgdf-offloading-2023",
    "w37-iwgdf-idsa-infection-2023",
    "w37-iwgdf-pad-2023",
    "w37-cdc-diabetes-feet-2024"
  ];

  const lenacapavirCard = {
    name: "Lenacapavir",
    generic: "lenacapavir",
    displayName: "Lenacapavir",
    brandExamples: ["SUNLENCA", "YEZTUGO"],
    aliases: [
      "lenacapavir sodium", "LEN", "Sunlenca", "Sunlenca injection", "Sunlenca tablets",
      "Yeztugo", "Yeztugo injection", "Yeztugo tablets", "twice-yearly HIV capsid inhibitor",
      "every six month HIV shot", "six month HIV injection", "six monthly HIV medicine",
      "long acting HIV capsid inhibitor", "lenacapavir for resistant HIV", "lenacapavir HIV treatment",
      "lenacapavir PrEP", "lenacapavir pre exposure prophylaxis", "twice yearly PrEP shot",
      "HIV capsid inhibitor", "HIV-1 capsid medicine", "Sunlenka", "Sunlencha", "Sulencca",
      "lenacaprivir", "lenacapevir", "lenacapivar", "lenacapiver", "lenacapavir safety",
      "what is the twice yearly HIV injection", "what happens if I miss lenacapavir",
      "why does lenacapavir cause resistance", "can Sunlenca be used alone", "is Yeztugo HIV treatment"
    ],
    abbreviations: ["LEN"],
    ambiguousAbbreviations: ["LEN"],
    commonMisspellings: ["lenacaprivir", "lenacapevir", "lenacapivar", "lenacapiver", "Sunlenka", "Sunlencha", "Sulencca", "Yeztugo shot"],
    entryType: "drug",
    recordType: "medication",
    owner: "pharmacology",
    contentOwner: "Infectious Disease Pharmacology",
    primaryDomain: "Infectious Disease",
    clinicalDomain: "HIV pharmacology",
    primaryCategory: "Infectious Disease & HIV Pharmacology",
    primarySystem: "Infectious Disease",
    bodySystem: "Infectious Disease",
    category: "Infectious Disease & HIV Pharmacology",
    categories: ["Pharmacy", "Infectious Disease & HIV Pharmacology", "Antiretroviral Therapy", "HIV Prevention"],
    class: "Long-acting, first-in-class HIV-1 capsid inhibitor",
    classCategory: "Antiretroviral; HIV-1 capsid inhibitor",
    sourceCategory: "Infectious Disease & HIV Pharmacology",
    classPathway: [
      "Anti-infective medication",
      "Antiretroviral therapy and HIV prevention",
      "Multistage HIV-1 capsid inhibitor",
      "Long-acting subcutaneous depot"
    ],
    nclexEssential: true,
    usedToTreat: "Lenacapavir has two product-specific U.S. roles. SUNLENCA is used with other antiretrovirals to treat heavily treatment-experienced adults with multidrug-resistant HIV-1 whose current regimen is failing because of resistance, intolerance, or safety concerns. It is not a complete regimen and is not routine initial therapy. YEZTUGO is pre-exposure prophylaxis (PrEP) to reduce sexually acquired HIV-1 in HIV-negative adults and adolescents weighing at least 35 kg who remain at risk. YEZTUGO alone does not treat established HIV. The same molecule therefore supports both salvage treatment and prevention, but the brand, eligibility, HIV-testing, interaction, missed-dose, and discontinuation rules must be taken from the correct current label.",
    description: "Lenacapavir is a highly potent, long-acting inhibitor that binds a pocket between p24 capsid subunits in the HIV-1 capsid hexamer. The capsid is not just a shell: it protects viral genetic material, coordinates transport of the viral complex into the nucleus, times uncoating, and later organizes assembly of new virions. Binding this structural hub disrupts several steps rather than a single enzyme reaction. Subcutaneous lenacapavir forms a depot and has an apparent half-life measured in weeks, enabling maintenance injections every 26 weeks after product-specific oral and injection initiation. That convenience creates an unusual safety obligation: a missed dose or an incomplete companion regimen can leave months of slowly declining drug exposure. HIV can then replicate in the presence of enough drug to select capsid resistance but not enough to suppress it. The long tail also means drug interactions can remain clinically relevant after injections stop. Every lenacapavir plan must therefore connect virologic activity, the partner regimen or prevention plan, reliable return for injections, HIV testing, interaction review, and a written contingency for delays or discontinuation.",
    mechanism: "Lenacapavir binds directly at the interface between capsid protein subunits. Early in the viral life cycle, this interferes with capsid interactions needed for nuclear import of proviral DNA and alters the timing and stability of the incoming capsid. Late in the cycle, it disrupts Gag and Gag-Pol processing, capsid-subunit production, assembly, and formation of a correctly shaped mature core. A malformed or mistimed capsid cannot coordinate productive infection. This multistage mechanism explains why lenacapavir remains active against many viruses resistant to reverse-transcriptase, protease, integrase, entry, or attachment inhibitors: those classes act at different targets, so their mutations do not automatically confer capsid resistance. It also explains why lenacapavir still needs other active treatment drugs. HIV has a high replication and mutation rate, and a single selective pressure can enrich capsid substitutions such as M66I, Q67 variants, K70 variants, N74 variants, or T107 variants. An optimized background regimen suppresses replication from several directions and raises the genetic barrier. For PrEP, infection must be excluded because preventive lenacapavir alone is functional monotherapy in a person who already has HIV and can select resistance.",
    pharmacokinetics: "Oral lenacapavir has an apparent half-life of roughly 10 to 12 days; the subcutaneous depot produces an apparent half-life of roughly 8 to 12 weeks, with residual systemic concentrations reported for 12 months or longer. It is highly protein bound, eliminated mainly through feces, and is a substrate of P-glycoprotein, UGT1A1, and CYP3A. It moderately inhibits CYP3A and also inhibits important transporters, so exposure to sensitive concomitant medicines can rise. Because injection cannot be removed, prevention of an interaction is more reliable than trying to reverse one after administration. The labels do not recommend adjustment for mild through severe renal impairment with creatinine clearance at least 15 mL/min or mild-to-moderate hepatic impairment, but end-stage renal disease and severe hepatic impairment remain insufficiently studied. Dialysis is not expected to remove a highly protein-bound depot drug meaningfully.",
    administrationTiming: [
      "Use only the schedule for the selected brand and indication. For SUNLENCA treatment, the current label offers two initiation options that combine oral loading with a 927 mg subcutaneous dose, followed by 927 mg subcutaneously every 26 weeks, plus or minus 2 weeks. The injection dose consists of two separate 1.5 mL abdominal injections given by a trained clinician. Lenacapavir is added to an optimized, fully suppressive background antiretroviral regimen; it never replaces that regimen.",
      "For YEZTUGO PrEP, the current label uses Day 1 oral loading plus the 927 mg subcutaneous injection, Day 2 oral loading, then 927 mg subcutaneously every 26 weeks, plus or minus 2 weeks. Confirm negative HIV-1 status with the label-directed acute-infection testing approach before starting, before every continuation injection, and whenever exposure or acute retroviral symptoms create concern.",
      "Inject only into subcutaneous abdominal tissue. Intradermal administration has caused serious ulceration and necrosis. Inspect the yellow solution and use the exact single-use kit instructions; two injections are required for one full maintenance dose. Do not improvise a different site, route, vial-sharing method, or injection volume.",
      "A planned delay beyond the allowed window may require product-specific oral bridging; an unplanned delay beyond 28 weeks may require reinitiation. The Sunlenca and Yeztugo instructions are not interchangeable, and interacting inducers can change Yeztugo supplemental-dose requirements. Contact the HIV or PrEP team rather than guessing from a prior schedule.",
      "When SUNLENCA is stopped, establish an alternative fully suppressive treatment regimen no later than 28 weeks after the final injection when possible. When YEZTUGO is stopped and HIV risk continues, begin an effective alternative PrEP strategy within 28 weeks and continue follow-up HIV testing. These transition plans prevent the long pharmacokinetic tail from becoming a resistance-selection window."
    ],
    boxedWarning: "Neither the current SUNLENCA nor YEZTUGO label carries an FDA boxed warning. Absence of a box does not make the long-acting tail low risk. SUNLENCA can select resistance when companion antiretrovirals are inactive or missed; YEZTUGO is contraindicated when HIV status is positive or unknown because PrEP monotherapy can select resistance. Both require product-specific interaction review and careful planning for missed or discontinued injections.",
    boxedWarningSpecificity: "Current product-specific label reconciliation; no FDA boxed warning",
    contraindications: [
      "SUNLENCA is contraindicated with strong CYP3A inducers because markedly reduced lenacapavir exposure can cause treatment failure and resistance. Examples in the label include rifampin, carbamazepine, phenytoin, and St. John's wort, but the interaction screen must use the complete current label rather than a memorized short list.",
      "YEZTUGO is contraindicated in people with positive or unknown HIV-1 status. A negative screening result must be interpreted with timing and acute-infection symptoms; when an antigen/antibody test is used at initiation, the label directs confirmation with an HIV-1 RNA assay.",
      "Do not generalize Sunlenca's strong-inducer contraindication to the Yeztugo label: current Yeztugo labeling instead provides product-specific supplemental dosing when a strong or moderate CYP3A inducer is initiated. This is a specialist and pharmacist calculation, not permission to ignore an interaction.",
      "Do not use SUNLENCA alone as HIV treatment or add it to a failing regimen without constructing the most active achievable background regimen. Functional monotherapy creates the conditions in which capsid resistance emerges.",
      "Do not give either product intradermally or by an unapproved route. The long-acting depot cannot be withdrawn, and improper placement has caused injection-site necrosis and ulceration."
    ],
    precautions: [
      "Screen every prescription, over-the-counter medicine, supplement, and herbal product before initiation and again whenever anything changes. The interaction consequences may persist for up to 9 months after the last injection.",
      "Assess whether the person can reliably return every 26 weeks and can access oral bridging, reinitiation, alternative ART, or alternative PrEP if plans change. Transportation, insurance, housing, privacy, incarceration, travel, disaster displacement, and clinic transitions are clinical adherence risks, not character flaws.",
      "For SUNLENCA, monitor for immune reconstitution inflammatory syndrome after effective combination ART begins. A new fever, lymph-node process, respiratory syndrome, neurologic change, or autoimmune manifestation can reflect recovering immunity unmasking infection rather than drug allergy or treatment failure.",
      "Pregnancy data and recommendations differ by treatment versus prevention context and continue to evolve. Review current perinatal HIV guidance and the Antiretroviral Pregnancy Registry rather than withholding effective HIV care or assuming safety from limited numbers.",
      "End-stage kidney disease, dialysis, severe hepatic impairment, pediatric HIV treatment, and children under the Yeztugo weight threshold have limited or absent label evidence. Do not extrapolate dosing without specialty guidance."
    ],
    adverseEffects: [
      "Injection-site reactions are the dominant adverse effect: pain, nodule, induration, erythema, swelling, pruritus, bruising, warmth, or a palpable mass. Nodules and induration can persist for months because the subcutaneous depot provokes a local foreign-body or granulomatous response; persistence alone is not infection, but worsening tenderness, drainage, spreading erythema, fever, skin breakdown, or fluctuance needs evaluation.",
      "Improper intradermal injection can cause serious ulceration or necrosis. Examine technique and tissue depth rather than dismissing a severe reaction as an expected nodule.",
      "Nausea, diarrhea, headache, dizziness, and vomiting occur in product trials. Because patients also receive other antiretrovirals or may have acute HIV, opportunistic disease, pregnancy, or another illness, symptom attribution requires timing and differential diagnosis.",
      "SUNLENCA labeling reports laboratory abnormalities including creatinine, glycosuria, hyperglycemia, proteinuria, and transaminase or direct-bilirubin elevations in some trial participants. These observations occurred with background regimens and complex illness and are not all established direct toxicities, but significant changes still require clinical review.",
      "An apparent inflammatory worsening after SUNLENCA-containing treatment may be immune reconstitution rather than direct toxicity. The distinction matters because stopping effective ART can be harmful, while an unrecognized opportunistic infection also requires treatment."
    ],
    interactions: [
      "Lenacapavir is a substrate of CYP3A, P-glycoprotein, and UGT1A1. Strong or moderate CYP3A induction lowers exposure and can create virologic failure or prevention failure. Sunlenca contraindicates strong inducers and does not recommend moderate inducers; Yeztugo has separate supplemental-dose instructions when an inducer is initiated. Always use the correct product label.",
      "Combined inhibition of P-glycoprotein, UGT1A1, and strong CYP3A can greatly raise lenacapavir exposure and is not recommended. Atazanavir with cobicistat or ritonavir illustrates why looking only at the CYP label on one medicine misses combined pathway inhibition.",
      "Lenacapavir is a moderate CYP3A inhibitor and inhibits transporters including P-glycoprotein. It can increase sensitive substrates such as certain sedatives, antiarrhythmics, direct oral anticoagulants, PDE-5 inhibitors, immunosuppressants, opioids, ergot derivatives, or statins. The appropriate action ranges from avoidance to dose limitation or therapeutic monitoring and depends on the exact drug and indication.",
      "The interaction window outlasts the visible dosing visit. New medicines started within 9 months after the final subcutaneous dose still require lenacapavir review because the depot continues to release active inhibitor.",
      "Acid suppressants do not meaningfully alter lenacapavir exposure, which prevents an unnecessary interaction assumption. Conversely, rifamycins, enzyme-inducing antiseizure medicines, St. John's wort, efavirenz, nevirapine, and tipranavir/ritonavir are important exposure-lowering examples; do not infer safety from drug class alone."
    ],
    resistance: [
      "Capsid substitutions associated with reduced susceptibility include changes at L56, M66, Q67, K70, N74, A105, and T107. M66I can produce especially large loss of susceptibility, but the clinical effect of a mutation depends on the complete viral population and regimen.",
      "In SUNLENCA treatment, resistance is most likely when lenacapavir becomes the only fully active drug, when adherence to the oral optimized background regimen fails, or when an injection is missed and viral replication resumes during the tail. A falling CD4 count or confirmed viral rebound requires prompt adherence, interaction, partner-activity, and resistance review.",
      "In YEZTUGO PrEP, starting during undiagnosed acute HIV or acquiring HIV while concentrations are inadequate exposes replicating virus to a single capsid inhibitor. This is why testing before every injection and additional testing after suspected exposure or acute retroviral symptoms are part of pharmacology, not administrative paperwork.",
      "Routine commercial resistance assays generally evaluate reverse transcriptase, protease, and integrase, not capsid. NIH guidance notes that a commercial lenacapavir resistance test is not currently available. Specialist laboratories and genotype interpretation may be needed; a standard report that says no resistance must not be mistaken for proof that capsid was assessed."
    ],
    nursingEssentials: [
      "Verify the exact product and purpose: Sunlenca treatment versus Yeztugo PrEP. Confirm age and weight eligibility, HIV status, current regimen or prevention plan, last dose, planned injection date, and the permitted window before preparing anything.",
      "For Sunlenca, reconcile the complete resistance and treatment history and confirm that an optimized background regimen is ordered and available. Ask about actual adherence without blame because oral partner failure can convert a powerful long-acting drug into functional monotherapy.",
      "For Yeztugo, verify label-directed HIV testing before the first and every continuation injection. Ask about fever, rash, lymphadenopathy, sore throat, myalgia, diarrhea, night sweats, or a recent high-risk exposure because acute infection can precede a positive screening antibody response.",
      "Perform a pharmacist-level interaction screen that includes rifamycins, antiseizure drugs, antiretrovirals, anticoagulants, sedatives, opioids, erectile-dysfunction or pulmonary-hypertension drugs, immunosuppressants, statins, herbal products, and medicines begun since the last visit. Document that the nine-month post-injection interaction tail was considered.",
      "Administer as two separate subcutaneous abdominal injections using the current kit instructions and aseptic technique. Inspect solution and sites, avoid intradermal placement, document lot, exact sites and time, and teach what local reactions are expected versus urgent.",
      "Before the patient leaves, schedule the next injection, create reminders, identify barriers, and write a missed-dose contact plan. A future appointment is part of resistance prevention.",
      "Trend HIV-1 RNA and CD4 count for treatment, HIV testing for PrEP, clinical response, partner-regimen adherence, injection sites, new medications, pregnancy context, and organ function when clinically indicated. Escalate virologic rebound, possible seroconversion, or severe local injury promptly."
    ],
    keyLabs: [
      "SUNLENCA treatment: baseline and serial quantitative HIV-1 RNA, CD4 count, historical and current resistance information, hepatitis and opportunistic-infection context, and safety laboratories appropriate to the complete regimen. Lenacapavir does not make the partner drugs' renal, hepatic, hematologic, or viral-hepatitis monitoring disappear.",
      "YEZTUGO PrEP: FDA-cleared testing capable of identifying acute or primary HIV-1 before initiation and every continuation injection, with HIV-1 RNA confirmation in the label-directed initiation algorithm and additional testing for recent exposure or acute retroviral symptoms.",
      "Renal and hepatic status do not routinely drive dose adjustment above the studied boundaries, but they identify unstudied end-stage or severe hepatic disease and affect interacting drugs and companion ART.",
      "When viral rebound or breakthrough infection occurs, obtain recommended viral load and resistance studies promptly while recognizing that standard commercial genotypes may not include the capsid gene. Coordinate specimen timing and specialized testing with an HIV expert and laboratory."
    ],
    requiredMonitoring: [
      "Exact injection-date registry with a 26-week target, plus or minus 2-week window, outreach plan, and documented bridge or reinitiation pathway",
      "HIV-1 RNA suppression, CD4 recovery, companion-regimen activity and adherence for Sunlenca treatment",
      "Acute-HIV-capable testing before initiation and every Yeztugo injection, plus symptom- or exposure-triggered testing",
      "Injection-site assessment for expected nodules versus ulcer, necrosis, abscess, or hypersensitivity",
      "Medication-interaction review during therapy and for 9 months after the final subcutaneous dose",
      "Alternative suppressive ART or PrEP established within the prolonged pharmacokinetic transition window when injections stop"
    ],
    populationRisks: [
      { population: "Heavily treatment-experienced adults", note: "Sunlenca can restore an active mechanism, but benefit depends on the most active achievable background regimen and adherence. A history of multiclass resistance makes casual regimen changes especially hazardous." },
      { population: "Adolescents", note: "Yeztugo is approved for PrEP in adolescents weighing at least 35 kg. Sunlenca is not FDA approved to treat pediatric HIV, and Yeztugo evidence does not authorize treatment use." },
      { population: "Pregnancy and postpartum", note: "Available data are evolving and differ by treatment versus prevention context. Acute HIV has major maternal and perinatal consequences; use current perinatal guidance and the pregnancy registry rather than an automatic stop-or-start rule." },
      { population: "Kidney or liver disease", note: "No adjustment is recommended within studied renal and mild-to-moderate hepatic ranges, but ESRD and severe hepatic impairment remain insufficiently studied and comedications may still need changes." },
      { population: "People with unstable access", note: "Housing, transport, cost, privacy, travel, detention, or clinic-transfer barriers can convert a scheduled long-acting regimen into a resistance tail. Build continuity before injection rather than blaming a later missed visit." }
    ],
    redFlags: [
      "Detectable or rising HIV-1 RNA, falling CD4 count, new opportunistic illness, or repeated missed companion ART while receiving Sunlenca",
      "Positive or indeterminate HIV test, acute retroviral symptoms, or a high-risk exposure around a Yeztugo dosing gap",
      "Injection-site ulceration, black tissue, drainage, fluctuance, rapidly expanding erythema, severe pain, fever, or suspected intradermal administration",
      "A new strong inducer, interacting narrow-therapeutic-index medicine, or unreviewed herbal product during the nine-month interaction window",
      "A delayed injection approaching or beyond 28 weeks without a documented bridge, reinitiation, or alternative ART/PrEP plan"
    ],
    patientEducation: [
      "Lenacapavir is long acting, not self-sustaining. Keep every injection and laboratory appointment and call before a planned delay; do not wait until the allowed window has passed.",
      "Sunlenca must be taken with the rest of the HIV regimen exactly as prescribed. Feeling well or having a twice-yearly injection does not make the oral partners optional.",
      "Yeztugo prevents sexually acquired HIV but does not treat HIV and does not prevent other sexually transmitted infections. HIV testing is required because taking preventive lenacapavir alone during unrecognized infection can make the virus resistant.",
      "Tell every prescriber and pharmacist about lenacapavir, even after injections stop. It can affect new medicines for up to 9 months, and some medicines or supplements can lower its concentration.",
      "A small lump, firmness, or soreness can persist at an injection site. Seek prompt care for skin breakdown, a growing painful area, drainage, spreading redness, fever, or black tissue.",
      "If injections stop, the medicine may remain in the body for a year or longer. Continue the written HIV treatment or prevention plan and follow-up testing during that tail."
    ],
    evidenceLimitations: [
      "Sunlenca treatment evidence comes from a small, highly treatment-experienced population receiving individualized optimized background regimens. It should not be generalized to routine initial HIV treatment or used as monotherapy.",
      "Yeztugo efficacy trials support prevention of sexually acquired HIV in the labeled population; they do not establish it as post-exposure prophylaxis, HIV treatment, or prevention for every exposure route without current guideline review.",
      "The same active ingredient has different label constraints by product and indication. A combined educational card must not erase those differences, and the current brand-specific prescribing information controls.",
      "Resistance interpretation is evolving, and routinely available genotypes may omit capsid. Absence of a reported capsid mutation can reflect absence of testing rather than susceptibility.",
      "Long-term pregnancy, rare-event, and repeated-depot safety data remain more limited than for older antiretroviral classes."
    ],
    nclexTraps: [
      "Lenacapavir inhibits the HIV capsid, not reverse transcriptase, integrase, or protease. That nonoverlapping target can retain activity against multidrug-resistant virus, but does not make resistance impossible.",
      "Sunlenca is never a complete HIV regimen. The six-month injection does not replace active companion antiretrovirals.",
      "Yeztugo requires confirmed negative HIV status. A preventive single agent given during acute HIV can select resistance.",
      "A missed long-acting dose is not just one missed day: slowly falling concentrations can create a prolonged selection window. Bridge, reinitiation, or alternative therapy must be planned.",
      "Product rules differ. Strong CYP3A inducers are contraindicated with Sunlenca treatment, while the current Yeztugo label uses specific supplemental dosing when certain inducers begin; never transfer one brand's rule to the other.",
      "A standard resistance panel may not test capsid. Coordinate specialized assessment when lenacapavir failure is suspected.",
      "Persistent injection-site nodules can be expected, but ulceration or necrosis is not. Intradermal rather than subcutaneous injection is a preventable serious error."
    ],
    relatedTopics: [
      "HIV-1 infection", "Antiretroviral therapy", "HIV pre-exposure prophylaxis", "HIV viral load",
      "CD4 count", "HIV drug-resistance testing", "Acute HIV infection", "Immune reconstitution inflammatory syndrome",
      "CYP3A drug interactions", "P-glycoprotein", "Rifampin", "St. John's wort", "Long-acting injectable medications",
      "Cabotegravir", "Fostemsavir", "Ibalizumab", "Opportunistic infections"
    ],
    relatedConcepts: [
      "HIV capsid", "p24 hexamer", "nuclear import", "viral assembly", "optimized background regimen",
      "functional monotherapy", "pharmacokinetic tail", "capsid resistance", "acute HIV testing", "PrEP adherence"
    ],
    searchTerms: [
      "lenacapavir", "Sunlenca", "Yeztugo", "LEN", "capsid inhibitor", "twice yearly HIV injection",
      "six month PrEP injection", "multidrug resistant HIV medication", "long acting HIV medicine",
      "missed lenacapavir injection", "lenacapavir drug interactions", "lenacapavir resistance"
    ],
    tags: [
      "frontier-wave37", "lenacapavir", "Sunlenca", "Yeztugo", "HIV-1", "capsid inhibitor",
      "antiretroviral", "PrEP", "long acting injection", "pharmacokinetic tail", "drug interactions",
      "resistance prevention", "infectious disease pharmacology", "mechanism first"
    ],
    regulatoryStatus: "SUNLENCA is FDA approved, with other antiretrovirals, for heavily treatment-experienced adults with multidrug-resistant HIV-1 whose regimen is failing. YEZTUGO is FDA approved for PrEP to reduce sexually acquired HIV-1 in HIV-negative adults and adolescents weighing at least 35 kg. Product-specific current labeling controls.",
    sourceKeys: lenacapavirSourceKeys,
    sourceNote: "Original educational synthesis from current FDA-approved Sunlenca and Yeztugo labeling and current NIH HIV guidance. It explains product-specific boundaries and clinical reasoning; it is not a prescribing order or substitute for an HIV pharmacist, specialist, or the current full label.",
    confidenceTier: "Curated full study card - FDA label and NIH guideline reconciled",
    studentFacing: true,
    hidden: false,
    retired: false,
    expandedIndex: false,
    clinicalFrontierWave37ClinicalCRevision: VERSION
  };

  const installWave37ClinicalC = () => {
  const application = {
    attemptedTargets: ["Lenacapavir", "Folate deficiency anemia", "Diabetic foot ulcer"],
    appliedTargets: [],
    missingTargets: [],
    errors: [],
    sourceReferencesAddedOrUpdated: 0,
    pharmacology: {
      databaseGlobal: "",
      collectionName: "",
      canonicalName: "Lenacapavir",
      identityMatchesBefore: 0,
      canonicalCountAfter: 0,
      selectedIndexBeforeMerge: -1,
      removedDuplicateCount: 0,
      duplicateCreated: false,
      runtimeOwner: "",
      runtimeType: "",
      runtimeCategory: ""
    },
    pathology: [],
    routingRemediations: {
      attempted: [
        { query: "vitamin B12 deficiency anemia", canonicalTarget: "Vitamin B12 deficiency" },
        { query: "vitamin B12 deficiency anaemia", canonicalTarget: "Vitamin B12 deficiency" },
        { query: "burning diabetic foot pain with intact skin and no ulcer", canonicalTarget: "Diabetic neuropathy" },
        { query: "burning diabetic foot pain without an open wound", canonicalTarget: "Diabetic neuropathy" },
        { query: "burning diabetic foot pain with an open ulcer", canonicalTarget: "Diabetic foot ulcer" }
      ],
      applied: [],
      missingTargets: []
    }
  };

  const pharmDatabaseCandidates = [
    { globalName: "ANI_PHARM_DATABASE", value: window.ANI_PHARM_DATABASE },
    { globalName: "ANI_PHARMACOLOGY_DATABASE", value: window.ANI_PHARMACOLOGY_DATABASE }
  ];
  let resolvedPharm = null;
  for (const candidate of pharmDatabaseCandidates) {
    if (!candidate.value) continue;
    if (Array.isArray(candidate.value.drugs)) {
      resolvedPharm = { ...candidate, database: candidate.value, collectionName: "drugs", records: candidate.value.drugs };
      break;
    }
    if (Array.isArray(candidate.value.medications)) {
      resolvedPharm = { ...candidate, database: candidate.value, collectionName: "medications", records: candidate.value.medications };
      break;
    }
    if (Array.isArray(candidate.value)) {
      resolvedPharm = { ...candidate, database: candidate.value, collectionName: "$self", records: candidate.value };
      break;
    }
  }

  if (!resolvedPharm) {
    application.missingTargets.push("Lenacapavir (installed pharmacology collection unavailable)");
  } else {
    try {
      const records = resolvedPharm.records;
      const canonicalKey = normalize(lenacapavirCard.name);
      const lenacapavirFamilyKeys = new Set([canonicalKey, "sunlenca", "yeztugo"]);
      const isLenacapavirIdentity = (record) => medicationIdentityKeys(record)
        .some((key) => lenacapavirFamilyKeys.has(key));
      const matches = records
        .map((record, index) => ({ record, index }))
        .filter(({ record }) => isLenacapavirIdentity(record));
      application.pharmacology.databaseGlobal = resolvedPharm.globalName;
      application.pharmacology.collectionName = resolvedPharm.collectionName;
      application.pharmacology.identityMatchesBefore = matches.length;

      const richnessScore = ({ record, index }) => {
        let score = index / Math.max(records.length, 1);
        if (normalize(record && record.displayName) === canonicalKey) score += 40;
        if (normalize(record && record.name) === canonicalKey) score += 40;
        if (normalize(record && record.generic) === canonicalKey) score += 20;
        ["description", "mechanism", "nursingEssentials", "interactions", "sourceKeys"].forEach((field) => {
          const value = record && record[field];
          if (value && (!Array.isArray(value) || value.length)) score += 5;
        });
        return score;
      };
      const selected = matches.length
        ? matches.slice().sort((left, right) => richnessScore(right) - richnessScore(left))[0]
        : { record: {}, index: records.length };
      const target = selected.record;
      application.pharmacology.selectedIndexBeforeMerge = selected.index;

      const inheritedAliases = matches.flatMap(({ record }) => Array.isArray(record.aliases) ? record.aliases : []);
      const inheritedBrands = matches.flatMap(({ record }) => Array.isArray(record.brandExamples) ? record.brandExamples : []);
      const inheritedSearchTerms = matches.flatMap(({ record }) => Array.isArray(record.searchTerms) ? record.searchTerms : []);
      const inheritedRelatedTopics = matches.flatMap(({ record }) => Array.isArray(record.relatedTopics) ? record.relatedTopics : []);
      const inheritedTags = matches.flatMap(({ record }) => Array.isArray(record.tags) ? record.tags : []);

      Object.assign(target, lenacapavirCard, {
        aliases: unique([...inheritedAliases, ...lenacapavirCard.aliases]).filter((alias) => normalize(alias) !== canonicalKey),
        brandExamples: unique([...inheritedBrands, ...lenacapavirCard.brandExamples]),
        searchTerms: unique([...inheritedSearchTerms, ...lenacapavirCard.searchTerms]),
        relatedTopics: unique([...inheritedRelatedTopics, ...lenacapavirCard.relatedTopics]),
        tags: unique([...inheritedTags, ...lenacapavirCard.tags]).filter((tag) => !/generated-placeholder|recognition.only|verify-label|hidden-combination-product/i.test(clean(tag)))
      });
      if (!matches.length) records.push(target);

      for (let index = records.length - 1; index >= 0; index -= 1) {
        const record = records[index];
        if (record !== target && isLenacapavirIdentity(record)) {
          records.splice(index, 1);
          application.pharmacology.removedDuplicateCount += 1;
        }
      }

      application.sourceReferencesAddedOrUpdated += installSourceReferences(resolvedPharm.database, lenacapavirSourceKeys);
      application.pharmacology.canonicalCountAfter = records
        .filter((record) => isLenacapavirIdentity(record)).length;
      application.pharmacology.duplicateCreated = application.pharmacology.canonicalCountAfter > 1;
      application.pharmacology.runtimeOwner = target.owner;
      application.pharmacology.runtimeType = target.entryType;
      application.pharmacology.runtimeCategory = target.category;
      application.appliedTargets.push(lenacapavirCard.name);
    } catch (error) {
      application.errors.push("Lenacapavir merge: " + clean(error && error.message || error || "Unknown error"));
      application.missingTargets.push("Lenacapavir (merge failed)");
    }
  }

  const pathologyDatabase = window.ANI_PATHOLOGY_DATABASE;
  const pathologyRecords = pathologyDatabase && Array.isArray(pathologyDatabase.diseases)
    ? pathologyDatabase.diseases
    : null;

  const applyPathologyCard = (card, semanticTitles) => {
    if (!pathologyRecords) {
      application.missingTargets.push(card.name + " (installed pathology collection unavailable)");
      return;
    }

    const familyKeys = new Set(semanticTitles.map(normalize));
    const canonicalKey = normalize(card.name);
    const matches = pathologyRecords
      .map((record, index) => ({ record, index, key: normalize(titleOf(record)) }))
      .filter(({ key }) => familyKeys.has(key));
    const exactCanonical = matches.filter(({ key }) => key === canonicalKey);
    const selected = (exactCanonical.length ? exactCanonical : matches)
      .slice()
      .sort((left, right) => {
        const score = ({ record, index, key }) => (
          (key === canonicalKey ? 100 : 0)
          + (clean(record && record.definition).length > 250 ? 20 : 0)
          + (Array.isArray(record && record.nursingPriorities) ? record.nursingPriorities.length : 0)
          + index / Math.max(pathologyRecords.length, 1)
        );
        return score(right) - score(left);
      })[0] || { record: {}, index: pathologyRecords.length, key: canonicalKey };
    const target = selected.record;

    const inheritedAliases = matches.flatMap(({ record }) => [
      ...(Array.isArray(record.aliases) ? record.aliases : []),
      ...(Array.isArray(record.commonMisspellings) ? record.commonMisspellings : []),
      titleOf(record)
    ]);
    const inheritedRelatedTopics = matches.flatMap(({ record }) => Array.isArray(record.relatedTopics) ? record.relatedTopics : []);
    const inheritedTags = matches.flatMap(({ record }) => Array.isArray(record.tags) ? record.tags : []);

    Object.assign(target, card, {
      aliases: unique([...inheritedAliases, ...card.aliases]).filter((alias) => normalize(alias) !== canonicalKey),
      relatedTopics: unique([...inheritedRelatedTopics, ...card.relatedTopics]),
      tags: unique([...inheritedTags, ...card.tags])
    });
    if (!matches.length) pathologyRecords.push(target);

    let removedDuplicateCount = 0;
    for (let index = pathologyRecords.length - 1; index >= 0; index -= 1) {
      const record = pathologyRecords[index];
      if (record !== target && familyKeys.has(normalize(titleOf(record)))) {
        pathologyRecords.splice(index, 1);
        removedDuplicateCount += 1;
      }
    }

    const familyCountAfter = pathologyRecords.filter((record) => familyKeys.has(normalize(titleOf(record)))).length;
    application.pathology.push({
      canonicalName: card.name,
      semanticTitlesMerged: semanticTitles.slice(),
      identityMatchesBefore: matches.length,
      selectedIndexBeforeMerge: selected.index,
      removedDuplicateCount,
      familyCountAfter,
      duplicateCreated: familyCountAfter > 1,
      runtimeOwner: target.owner,
      runtimeType: target.entryType,
      runtimeCategory: target.category
    });
    application.appliedTargets.push(card.name);
  };

  const applyPathologyRoutingAliases = (canonicalTarget, aliases) => {
    const canonicalKey = normalize(canonicalTarget);
    const targets = pathologyRecords
      ? pathologyRecords.filter((record) => normalize(titleOf(record)) === canonicalKey)
      : [];
    if (!targets.length) {
      application.routingRemediations.missingTargets.push(canonicalTarget);
      application.missingTargets.push(canonicalTarget + " (routing-alias target unavailable)");
      return;
    }
    targets.forEach((target) => {
      const priorAliases = Array.isArray(target.aliases) ? target.aliases : [];
      const priorSearchTerms = Array.isArray(target.searchTerms) ? target.searchTerms : [];
      target.aliases = unique([...priorAliases, ...aliases]);
      target.searchTerms = unique([...priorSearchTerms, ...aliases]);
      target.clinicalFrontierWave37ClinicalCRoutingRevision = VERSION;
    });
    aliases.forEach((query) => {
      application.routingRemediations.applied.push({ query, canonicalTarget, patchedRecordCount: targets.length });
    });
  };

  if (!pathologyRecords) {
    application.missingTargets.push("installed pathology collection");
  } else {
    try {
      application.sourceReferencesAddedOrUpdated += installSourceReferences(
        pathologyDatabase,
        unique([...folateSourceKeys, ...diabeticFootSourceKeys])
      );
      applyPathologyCard(folateDeficiencyAnemiaCard, ["Folate deficiency anemia", "Folate deficiency"]);
      applyPathologyCard(diabeticFootUlcerCard, ["Diabetic foot ulcer", "Diabetes-related foot ulcer", "Neuropathic diabetic foot ulcer"]);
      applyPathologyRoutingAliases("Vitamin B12 deficiency", [
        "vitamin B12 deficiency anemia",
        "vitamin B12 deficiency anaemia"
      ]);
      applyPathologyRoutingAliases("Diabetic neuropathy", [
        "burning diabetic foot pain with intact skin and no ulcer",
        "burning diabetic foot pain without an open wound"
      ]);
      applyPathologyRoutingAliases("Diabetic foot ulcer", ["burning diabetic foot pain with an open ulcer"]);
    } catch (error) {
      application.errors.push("Pathology merge: " + clean(error && error.message || error || "Unknown error"));
    }
  }

  application.appliedTargets = unique(application.appliedTargets);
  application.missingTargets = unique(application.missingTargets);
  const applied = application.appliedTargets.length === 3
    && !application.errors.length
    && !application.pharmacology.duplicateCreated
    && application.pathology.every((result) => !result.duplicateCreated)
    && application.routingRemediations.applied.length === application.routingRemediations.attempted.length
    && !application.routingRemediations.missingTargets.length;

  window[GLOBAL_NAME] = Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    version: VERSION,
    applied,
    targetStrategy: "Patch the richest exact lenacapavir/Sunlenca/Yeztugo medication-family identity; merge the folate-deficiency semantic family into Folate deficiency anemia; merge exact diabetes-foot-ulcer title variants; preserve aliases and remove superseded runtime objects so one canonical card owns each topic; route two explicit non-target intents to their installed Vitamin B12 deficiency and Diabetic neuropathy owners.",
    canonicalTopics: Object.freeze([
      Object.freeze({ name: "Lenacapavir", owner: "pharmacology", type: "drug", category: "Infectious Disease & HIV Pharmacology" }),
      Object.freeze({ name: "Folate deficiency anemia", owner: "pathology", type: "pathology", category: "Hematology, Nutrition & Pregnancy" }),
      Object.freeze({ name: "Diabetic foot ulcer", owner: "pathology", type: "pathology", category: "Endocrinology, Vascular & Wound Care" })
    ]),
    sourceCount: sourceReferences.length,
    sourceKeys: Object.freeze(sourceReferences.map((source) => source.key)),
    routingRemediationCount: application.routingRemediations.applied.length,
    application
  });
  };

  const folateDeficiencyAnemiaCard = {
    name: "Folate deficiency anemia",
    displayName: "Folate deficiency anemia",
    entryType: "pathology",
    recordType: "condition",
    owner: "pathology",
    contentOwner: "Hematology and Nutrition",
    primaryDomain: "Hematology",
    clinicalDomain: "Hematology and nutrition",
    primaryCategory: "Hematology, Nutrition & Pregnancy",
    primarySystem: "Hematology",
    bodySystem: "Hematology",
    category: "Hematology, Nutrition & Pregnancy",
    nclexEssential: true,
    definition: "Folate deficiency anemia is a megaloblastic anemia caused by too little biologically available folate for normal DNA synthesis in bone marrow. Folate is vitamin B9, a family of one-carbon carriers; folic acid is the stable synthetic form used in fortified foods and many supplements. When folate-dependent thymidylate and purine production falls, rapidly dividing erythroid precursors cannot copy DNA at the pace needed for cell division. Their cytoplasm continues to mature while their nuclei lag behind, producing large abnormal precursors, ineffective erythropoiesis, macro-ovalocytes, and sometimes leukopenia or thrombocytopenia. The entry intentionally includes folate depletion before overt anemia because a normal hemoglobin does not make poor intake, pregnancy risk, or a developing mixed deficiency irrelevant. It also keeps vitamin B12 at the center of every decision: B12 and folate deficiency can look nearly identical in blood, but isolated folate replacement can improve B12-related anemia while neurologic injury continues. New paresthesia, gait difficulty, loss of vibration sense, cognitive change, or an uncertain B12 result must therefore change the plan rather than be labeled an unusual feature of simple folate deficiency.",
    pathology: "Folate coenzymes transfer single-carbon units needed to make thymidylate, purines, methionine, and S-adenosylmethionine. A depleted folate pool slows nuclear DNA replication most visibly in tissues with rapid turnover. In marrow, precursor cells grow but cannot divide normally, causing nuclear-cytoplasmic asynchrony and intramedullary death. This ineffective production explains an apparently paradoxical pattern: the marrow may be hypercellular, yet the reticulocyte count is low because many precursors die before becoming circulating red cells. Their breakdown can raise lactate dehydrogenase and indirect bilirubin and lower haptoglobin, mimicking peripheral hemolysis unless the low reticulocyte response and smear are connected to the mechanism. Mature circulating cells are often large and oval, and neutrophils can become hypersegmented. Macrocytosis is a clue rather than a requirement: concurrent iron deficiency, inflammation, thalassemia trait, or recent transfusion can pull the mean corpuscular volume toward normal. Folate is also required for embryonic neural-tube closure and other rapid growth, so pregnancy and preconception folate adequacy matter before maternal anemia appears. Unlike vitamin B12, isolated folate deficiency is not a typical cause of a progressive posterior-column or peripheral-neuropathy syndrome. That clinical asymmetry is a safety clue, not permission to diagnose by symptoms alone.",
    pathophysiology: [
      "Body folate stores are modest compared with vitamin B12 stores, so sustained low intake, impaired absorption, increased demand, or an antifolate effect can produce deficiency over months rather than the years often seen with B12 depletion.",
      "Reduced tetrahydrofolate availability limits conversion of deoxyuridylate to thymidylate and reduces purine synthesis. DNA replication slows while RNA and protein production continue, creating large cells with immature nuclei.",
      "Ineffective marrow production causes many abnormal precursors to die inside the marrow. Hemoglobin falls, reticulocyte output remains inappropriately low, and LDH or indirect bilirubin may rise even without destructive antibodies or a primary red-cell membrane disorder.",
      "Folate-dependent remethylation of homocysteine to methionine also slows, so homocysteine can rise. This finding is not specific because B12 or B6 deficiency, kidney dysfunction, hypothyroidism, genetics, smoking, and medicines can also alter homocysteine.",
      "Vitamin B12 is needed to transfer a methyl group from 5-methyltetrahydrofolate. In B12 deficiency, folate becomes metabolically trapped and the blood picture overlaps. Giving folic acid can restore enough nucleotide synthesis to improve the CBC without correcting B12-dependent myelin injury; this is why a prettier hemoglobin is not proof that treatment was safe or complete.",
      "Rapidly dividing oral and gastrointestinal epithelium can also be affected, producing glossitis, shallow oral ulceration, appetite or gastrointestinal symptoms. During pregnancy, inadequate folate before and early in gestation increases neural-tube-defect risk because neural-tube closure occurs before many people know they are pregnant."
    ],
    etiology: "The diagnosis is incomplete until the source of depletion is explained. Low intake can follow food insecurity, restrictive eating, frailty, poorly planned diets, prolonged illness, or alcohol use. Alcohol adds several mechanisms at once: inadequate intake, reduced intestinal absorption and hepatic uptake, altered metabolism, and increased loss. Malabsorption occurs with celiac disease, inflammatory bowel disease affecting absorptive surfaces, tropical sprue, extensive small-bowel disease, or bariatric and other gastrointestinal surgery. Demand rises during pregnancy, lactation, infancy and growth, chronic hemolysis, recovery from severe marrow stress, and extensive inflammatory skin disease. Dialysis and other losses may contribute. Medicines can antagonize folate metabolism or reduce levels, including methotrexate, trimethoprim, pyrimethamine, sulfasalazine, and some antiseizure medicines; the risk and correct rescue strategy differ by drug. A low result can also coexist with vitamin B12, iron, copper, or broader nutritional deficiencies. In countries with folic-acid fortification, isolated severe dietary deficiency is less common, so an unexplained case should prompt a deliberate search for alcohol exposure, malabsorption, medication effect, increased demand, and mixed disease rather than a supplement-only reflex.",
    riskFactors: [
      "Low intake from food insecurity, frailty, eating disorder, restrictive or poorly planned diet, prolonged illness, or dependence on foods with little folate",
      "Alcohol use disorder because intake, absorption, hepatic handling, metabolism, and renal loss can all worsen at the same time",
      "Celiac disease, inflammatory bowel disease, small-bowel disease or resection, bariatric surgery, chronic diarrhea, or another malabsorptive condition",
      "Pregnancy, lactation, infancy, adolescence, chronic hemolysis, high marrow turnover, or extensive inflammatory skin disease because cellular demand rises",
      "Methotrexate, trimethoprim, pyrimethamine, sulfasalazine, phenytoin, phenobarbital, primidone, or another medicine that changes folate absorption or metabolism",
      "Dialysis, severe systemic illness, cancer treatment, or a broader state of malnutrition with concurrent iron, B12, protein, or trace-element deficiency",
      "Previous neural-tube-defect-affected pregnancy or another high-risk reproductive context, which changes prevention dosing but does not by itself diagnose anemia"
    ],
    signsSymptoms: [
      "Early or mild depletion may produce no anemia symptoms. When oxygen-carrying capacity falls, fatigue, weakness, reduced exercise tolerance, exertional dyspnea, headache, poor concentration, palpitations, pallor, or resting tachycardia can appear.",
      "Glossitis may make the tongue red, smooth, sore, or swollen; shallow oral ulcers, angular discomfort, appetite change, diarrhea, or weight loss can reflect epithelial injury or the underlying malabsorptive disease.",
      "Severe anemia can cause chest pressure, syncope, hypotension, dyspnea at rest, heart-failure findings, or ischemic symptoms, especially in older adults, pregnancy, or people with cardiac or pulmonary disease.",
      "Leukopenia can increase infection concern and thrombocytopenia can cause bruising or bleeding when megaloblastosis is severe, although pancytopenia also requires evaluation for marrow failure, leukemia, myelodysplasia, medications, infection, and other deficiencies.",
      "Progressive numbness, paresthesia, gait imbalance, reduced vibration or position sense, weakness, cognitive change, or visual symptoms are not comfortably explained by isolated folate deficiency. They should trigger urgent B12 and neurologic evaluation even if folate is low.",
      "Pregnancy complications are not predicted by maternal hemoglobin alone. Inadequate folate around conception can affect fetal neural-tube development before macrocytic anemia or maternal symptoms become evident."
    ],
    diagnostics: [
      "Start with the whole anemia pattern: CBC with indices and red-cell distribution width, reticulocyte count, peripheral smear, and comparison with prior values. Macro-ovalocytes and hypersegmented neutrophils support megaloblastosis, while an inappropriately low reticulocyte response supports ineffective production. A normal MCV does not exclude folate deficiency when iron deficiency, inflammation, hemoglobinopathy, transfusion, or mixed cell populations coexist.",
      "Measure folate according to local laboratory practice. Serum folate is commonly used and responds quickly to recent intake; a low value in a compatible clinical setting supports deficiency, but a normal value after recent food or supplements may not describe longer-term stores. Red-cell folate reflects a longer interval but has analytic limitations and is not routinely required in many systems. Interpret the assay and cutoff used by the local laboratory rather than treating one universal number as infallible.",
      "Evaluate vitamin B12 at the same time, before folate alone obscures the hematologic clue. When B12 is borderline or the clinical picture is discordant, methylmalonic acid can support B12 deficiency, although kidney dysfunction raises it. Homocysteine can rise in both folate and B12 deficiency and is too nonspecific to diagnose either by itself. In isolated folate deficiency, methylmalonic acid is generally not elevated because the methylmalonyl-CoA pathway requires B12, not folate.",
      "Assess iron studies because mixed iron and folate deficiency may produce a normal MCV and a broad size distribution. Add bilirubin, LDH, haptoglobin, liver tests, thyroid testing, kidney function, and targeted hemolysis, infection, or marrow studies when the presentation requires them.",
      "Find the cause through a detailed food, alcohol, supplement, medication, pregnancy, gastrointestinal, surgery, diarrhea, weight-loss, bleeding, and family history. Consider celiac testing or gastroenterology evaluation when malabsorption is plausible; do not assume every low intake story fully explains severe or recurrent cytopenias.",
      "Bone marrow examination is not a routine folate test. It may be needed when cytopenias, abnormal cells, splenomegaly, systemic findings, or failure to respond raise concern for myelodysplastic syndrome, aplastic anemia, leukemia, infiltrative disease, or another marrow disorder.",
      "Recheck the trajectory after treatment. A reticulocyte response should precede a sustained hemoglobin rise. Failure of counts or symptoms to improve should reopen adherence, diagnosis, ongoing alcohol use, malabsorption, continued antifolate exposure, mixed deficiency, bleeding, kidney or inflammatory disease, and marrow pathology rather than trigger indefinite dose escalation."
    ],
    assessment: "Assess severity and cause in parallel. Establish cardiopulmonary stability, functional decline, pregnancy status, bleeding, infection, and neurologic findings first. Then reconstruct the nutrition and medication timeline: what the patient actually eats, access to food, alcohol amount and pattern, supplements already taken, gastrointestinal symptoms or surgery, pregnancy or lactation, chronic hemolysis, and the exact last doses of antifolate or antiseizure medicines. Review CBC morphology and reticulocytes with folate, B12, iron, hemolysis, liver, thyroid, and renal data rather than diagnosing from MCV or serum folate alone. Ask specifically about numbness, gait, cognition, and visual change, because a low folate level can coexist with B12 deficiency and should not explain those findings away. Document barriers to replacement and follow-up. The goal is not simply to make hemoglobin rise; it is to restore safe DNA synthesis, protect neurologic function, correct the reason stores fell, and prevent relapse or pregnancy-related harm.",
    differential: "Vitamin B12 deficiency is the highest-stakes mimic because its smear and CBC can be identical while neurologic injury may become irreversible. Alcohol toxicity, liver disease, hypothyroidism, myelodysplastic syndrome, aplastic anemia, leukemia, copper deficiency, medication-related macrocytosis, and reticulocytosis after bleeding or hemolysis can also raise MCV. Iron deficiency, thalassemia trait, inflammation, kidney disease, or recent transfusion can mask macrocytosis and create a mixed picture. High LDH and indirect bilirubin from intramedullary precursor death can resemble peripheral hemolysis, but the reticulocyte response is usually low rather than appropriately high. Pancytopenia or persistent cytopenias require broader marrow thinking. Neurologic symptoms shift the differential toward B12 deficiency, copper deficiency, diabetes, alcohol-related neuropathy, spinal disease, medication toxicity, or another neurologic disorder. Pregnancy-related prevention needs are distinct from established folate-deficiency anemia: a person can need folic acid to prevent fetal neural-tube defects without being folate deficient or anemic.",
    treatments: [
      "Stabilize severe symptomatic anemia first. Chest pain, syncope, shock, heart-failure physiology, severe dyspnea, active bleeding, or major fetal-maternal compromise requires urgent evaluation; transfusion is based on physiology, hemoglobin, comorbidity, and clinical context, not used routinely for a correctable mild deficiency.",
      "Replace vitamin B12 before or together with folate when B12 deficiency is confirmed, strongly suspected, or cannot be excluded promptly. This preserves the hematologic benefit of folate while avoiding the false reassurance of corrected counts during ongoing B12-related neurologic injury.",
      "Use clinician-prescribed folic acid according to severity, cause, age, pregnancy context, absorption, interacting medicines, and local guidance. Public-system guidance commonly uses oral replacement and continues until blood indices normalize; persistent malabsorption, ongoing demand, or an uncorrectable cause may require longer therapy. Dose and duration for treating established deficiency are not the same as routine dietary allowance or standard prenatal prevention.",
      "Correct the driver: restore reliable folate-rich nutrition, address alcohol use safely, diagnose and treat celiac or other malabsorption, review bariatric needs, manage chronic hemolysis, and coordinate pregnancy care. Replacement without cause control invites relapse.",
      "Do not stop methotrexate, trimethoprim, pyrimethamine, an antiseizure medicine, or another essential drug independently. The prescriber must balance the indication and determine whether folic acid, folinic acid (leucovorin), dose adjustment, or an alternative is appropriate. Leucovorin rescue for toxic antifolate exposure is a different clinical problem from routine nutritional replacement.",
      "Monitor symptoms, reticulocyte response, CBC and MCV, and the relevant cause-specific markers. Potassium can fall during brisk hematopoietic recovery in severe cases, so individualized laboratory follow-up matters. Lack of response requires reassessment rather than assuming the patient needs unlimited folate.",
      "Provide reproductive counseling based on current national guidance. Routine periconception folic acid, higher-dose plans for selected high-risk patients, and treatment of established anemia have different goals; high-risk dosing should be coordinated with obstetric and prescribing specialists."
    ],
    contraindications: [
      "Do not treat a macrocytic or megaloblastic anemia with folic acid alone until vitamin B12 deficiency has been reasonably excluded or covered. Hemoglobin can improve while neurologic injury progresses.",
      "Do not assume a normal MCV excludes deficiency or that a low MCV proves isolated iron deficiency. Mixed deficiencies can cancel each other's size signal.",
      "Do not diagnose folate deficiency from homocysteine alone or interpret a serum folate without recent intake, supplements, assay method, kidney function, and the clinical pattern.",
      "Do not use over-the-counter megadoses to manage unexplained fatigue, neuropathy, or cytopenias. High supplemental intake can obscure diagnostic clues and may exceed established upper limits for unsupervised synthetic folic acid.",
      "Do not automatically stop an antifolate or antiseizure medication; abrupt withdrawal or loss of disease control can be more dangerous than the deficiency. Coordinate the correction and medication plan.",
      "Do not attribute progressive neurologic deficits to uncomplicated isolated folate deficiency. Evaluate vitamin B12 and other neurologic causes urgently."
    ],
    nursingPriorities: [
      "Assess airway, breathing, circulation, chest pain, syncope, orthostasis, resting dyspnea, heart-failure findings, bleeding, and pregnancy context because anemia severity is defined by oxygen-delivery consequences as well as the hemoglobin number.",
      "Perform and document a focused neurologic examination including sensation, gait, balance, vibration or position sense when appropriate, strength, cognition, and vision. Escalate new findings before folate monotherapy can hide the B12-related blood pattern.",
      "Reconcile foods, alcohol, supplements, methotrexate or other antifolates, antiseizure medicines, bariatric or bowel history, diarrhea, pregnancy, lactation, dialysis, chronic hemolysis, and access barriers. Ask neutrally and concretely because vague labels such as 'poor diet' do not create a workable cause plan.",
      "Trend CBC, MCV, red-cell distribution width, reticulocytes, folate, B12 and ordered metabolites, iron studies, LDH, bilirubin, haptoglobin, potassium, and symptoms. Relate each change to timing of treatment rather than treating an isolated lab as success or failure.",
      "Administer folic acid and B12 exactly as prescribed, verify that the B12 safety decision is documented, and teach why both may be started before every result is final. Avoid representing a supplement as harmless simply because it is a vitamin.",
      "Coordinate dietitian, social work, addiction care, gastroenterology, hematology, obstetric, pharmacy, and primary-care follow-up according to the cause. Sustainable access to food and treatment is part of correcting the disease.",
      "Monitor for an expected reticulocyte and hemoglobin response and report nonresponse, recurrent cytopenia, persistent weight loss or diarrhea, new bruising or infection, or neurologic deterioration because the initial diagnosis may be incomplete."
    ],
    redFlags: [
      "Chest pain, syncope, hypotension, dyspnea at rest, acute heart-failure findings, confusion, or other evidence of inadequate oxygen delivery",
      "New paresthesia, gait imbalance, weakness, loss of vibration or position sense, cognitive change, or visual symptoms suggesting B12 or another neurologic disorder",
      "Rapidly falling hemoglobin, active bleeding, severe jaundice or dark urine, or a laboratory pattern inconsistent with simple ineffective production",
      "Fever or serious infection with neutropenia, uncontrolled bleeding with thrombocytopenia, blasts or marked dysplasia, or unexplained pancytopenia",
      "Pregnancy with severe anemia, poor intake, persistent vomiting, malabsorption, or inability to maintain prescribed supplementation",
      "No reticulocyte or hemoglobin response despite documented replacement, raising concern for nonadherence, ongoing loss, mixed deficiency, malabsorption, or marrow disease"
    ],
    complications: [
      "Progressive symptomatic anemia with reduced exercise capacity, myocardial ischemia, high-output strain, heart failure, falls, syncope, or functional decline",
      "Leukopenia, thrombocytopenia, or pancytopenia in severe megaloblastosis, with infection or bleeding risk and possible confusion with primary marrow failure",
      "Glossitis, oral ulceration, poor intake, weight loss, and worsening broader malnutrition",
      "Fetal neural-tube defects and other adverse pregnancy associations when folate is inadequate during the critical periconception period",
      "Delayed recognition of vitamin B12 deficiency with ongoing or irreversible neurologic injury after folate improves the CBC",
      "Relapse when alcohol use, food insecurity, malabsorption, high demand, or an interacting medicine remains unaddressed"
    ],
    prognosis: "Counts and symptoms usually improve when true deficiency is replaced and the driver is corrected, but the trajectory is the proof. Reticulocyte recovery should occur before hemoglobin normalizes, and the MCV may take longer to settle as older macrocytes leave circulation. Lack of improvement is diagnostically useful: it argues for an uncorrected cause, mixed deficiency, wrong diagnosis, continued marrow toxicity, bleeding, inflammation, kidney disease, or primary marrow pathology. Isolated folate-related blood changes are generally reversible. Neurologic deficits are a different matter because they suggest B12 or another process and can become permanent if the reassuring CBC response delays treatment. Pregnancy outcome depends on adequate folate before and early in gestation, so treating anemia later cannot undo every developmental risk. Long-term prognosis is best when nutrition, absorption, medicines, alcohol, pregnancy needs, and follow-up ownership are solved rather than maintained by an unexplained supplement indefinitely.",
    prevention: "Prevention combines a varied diet with folate-rich foods, access to fortified foods where available, and life-stage-appropriate supplementation. Dark green vegetables, beans and peas, citrus, asparagus, avocado, liver, and fortified grains are useful sources, but food advice must fit culture, affordability, comorbidity, and absorption. People who can become pregnant should follow current national periconception folic-acid guidance because neural-tube closure occurs early. Prior neural-tube-defect pregnancy, certain antiseizure medicines, malabsorption, bariatric surgery, hemolysis, and other high-risk states require individualized specialist dosing rather than a generic prenatal plan. Preventing recurrence also means treating alcohol use disorder, screening plausible malabsorption, reviewing interacting medications, and monitoring people with ongoing demand. Routine megadosing is not a substitute for B12 evaluation or a balanced diet.",
    patientEducation: [
      "Folate helps cells copy DNA. Bone marrow works quickly, so it is one of the first places a shortage becomes visible; the anemia is a production problem, not simply blood disappearing from the body.",
      "Vitamin B12 deficiency can look the same on a blood count. Tell the clinician about numbness, tingling, balance trouble, memory change, or vision symptoms and do not self-treat with folic acid alone.",
      "Take the prescribed amount and keep follow-up blood tests. More is not automatically better, and a normalizing hemoglobin does not prove the cause has been corrected.",
      "Bring a complete list of medicines and supplements. Do not stop methotrexate, trimethoprim, an antiseizure medicine, or another prescription on your own; the clinician may change the plan or use a different form of folate support.",
      "Choose realistic folate sources such as leafy greens, beans or peas, citrus, asparagus, avocado, and fortified grains, while following any renal, pregnancy, allergy, or other dietary plan from the care team.",
      "If pregnancy is possible or planned, ask about folic acid before conception. Prevention timing and dose can differ from treatment of anemia and may need a higher-risk obstetric plan."
    ],
    nclexTraps: [
      "Folate and B12 deficiency both cause macro-ovalocytes, hypersegmented neutrophils, ineffective erythropoiesis, and elevated homocysteine. Methylmalonic acid points toward B12, not isolated folate, but kidney disease can confound it.",
      "Correcting the anemia with folate does not treat B12-related neurologic injury. B12 must be assessed or covered before folate alone.",
      "Macrocytosis is not mandatory. Iron deficiency or another microcytic process can produce a normal MCV in a mixed deficiency.",
      "High LDH and indirect bilirubin can come from precursor death inside marrow; a low reticulocyte response helps distinguish ineffective production from an appropriate response to peripheral hemolysis.",
      "Isolated folate deficiency does not usually cause the classic progressive neurologic syndrome of B12 deficiency. Neurologic findings require a broader explanation.",
      "Pregnancy prevention and anemia treatment are related but not identical. Adequate folate is needed before anemia and often before pregnancy is recognized.",
      "Folic acid and folinic acid are not interchangeable labels for every situation. Leucovorin rescue for antifolate toxicity follows drug-specific specialist protocols."
    ],
    relatedTopics: [
      "Vitamin B12 deficiency anemia", "Megaloblastic anemia", "Macrocytic anemia", "Iron deficiency anemia",
      "Homocysteine", "Methylmalonic acid", "Reticulocyte count", "Peripheral blood smear", "Pancytopenia",
      "Celiac disease", "Alcohol use disorder", "Bariatric surgery", "Methotrexate", "Leucovorin",
      "Pregnancy nutrition", "Neural tube defects", "Myelodysplastic syndrome"
    ],
    aliases: [
      "folate deficiency", "folic acid deficiency", "folate-deficiency anemia", "folate-deficiency anaemia",
      "folic acid deficiency anemia", "folic acid deficiency anaemia", "vitamin B9 deficiency",
      "vitamin B9 deficiency anemia", "vitamin B9 deficiency anaemia", "B9 deficiency",
      "folate deficient anemia", "folate deficient anaemia",
      "megaloblastic anemia from folate deficiency", "macrocytic anemia from low folate",
      "low folate anemia", "low folic acid blood test", "anemia from not enough folate",
      "why does folate deficiency cause big red blood cells", "folate versus B12 deficiency",
      "can folic acid hide B12 deficiency", "folate anemia in pregnancy", "folat deficiency",
      "folate deficency", "folic acid deficency", "folate defficiency", "folate deficientcy"
    ],
    abbreviations: ["B9 deficiency"],
    ambiguousAbbreviations: ["B9"],
    commonMisspellings: ["folat deficiency", "folate deficency", "folic acid deficency", "folate defficiency", "folate deficientcy", "folate defiency anemia"],
    searchTerms: [
      "folate deficiency anemia", "folic acid deficiency", "vitamin B9 deficiency", "megaloblastic anemia",
      "macrocytosis hypersegmented neutrophils", "low folate", "folate versus B12", "folic acid masks B12",
      "high homocysteine normal methylmalonic acid", "folate deficiency pregnancy"
    ],
    tags: [
      "frontier-wave37", "folate deficiency anemia", "vitamin B9", "megaloblastic anemia", "macrocytosis",
      "DNA synthesis", "vitamin B12 differential", "homocysteine", "pregnancy", "neural tube defects",
      "nutrition", "hematology", "mechanism first"
    ],
    sourceKeys: folateSourceKeys,
    sourceNote: "Original educational synthesis grounded in NIH/ODS nutrition physiology, NIH/NHLBI anemia resources, current blood-service guidance, and public clinical guidance. Laboratory cutoffs, assay availability, pregnancy protocols, and replacement regimens vary; local hematology, obstetric, pharmacy, and laboratory guidance controls.",
    evidenceLimitations: [
      "Serum folate changes with recent intake, red-cell folate assays have method limitations, and some health systems no longer use either test routinely. Diagnosis must reconcile assay behavior with clinical and hematologic evidence.",
      "The cited BSH folate document remains useful for folate-assay reasoning, but its B12 guidance has been superseded. ANI uses current B12 sources for the neurologic-safety differential.",
      "Homocysteine and MCV are nonspecific, and methylmalonic acid is affected by kidney function. No isolated biomarker replaces the pattern and treatment response.",
      "Treatment doses differ among countries, indications, pregnancy-risk groups, and antifolate exposures. A static educational card cannot safely replace a current patient-specific prescription."
    ],
    clinicalFrontierWave37ClinicalCRevision: VERSION
  };

  const diabeticFootUlcerCard = {
    name: "Diabetic foot ulcer",
    displayName: "Diabetic foot ulcer",
    entryType: "pathology",
    recordType: "condition",
    owner: "pathology",
    contentOwner: "Endocrinology, Vascular and Wound Care",
    primaryDomain: "Endocrinology",
    clinicalDomain: "Diabetes-related foot disease",
    primaryCategory: "Endocrinology, Vascular & Wound Care",
    primarySystem: "Endocrinology and Wound Care",
    bodySystem: "Endocrinology",
    category: "Endocrinology, Vascular & Wound Care",
    nclexEssential: true,
    definition: "A diabetic foot ulcer, increasingly called a diabetes-related foot ulcer, is an open wound on the foot of a person with diabetes in which loss of protective sensation, repetitive pressure or shear, deformity, impaired perfusion, and impaired tissue repair interact. It is not simply a cut with a high glucose value. Neuropathy can remove the pain alarm, alter muscle balance and foot shape, and dry the skin; callus then focuses mechanical stress on a small area. Peripheral artery disease can limit oxygen, nutrient, immune-cell, and antibiotic delivery. Hyperglycemia and comorbidity impair leukocyte function and healing. Once skin fails, bacteria may remain surface colonizers or may invade soft tissue, tendon, joint, or bone. Infection is therefore a complication diagnosed clinically, not an automatic synonym for every ulcer. A painless plantar crater can be limb threatening because the same neuropathy that allowed the injury can hide its depth. Every new ulcer requires prompt assessment of three linked threats: mechanical load, infection, and ischemia. Treating only the dressing while pressure continues, treating only bacteria while pus remains trapped, or debriding ischemic tissue without a vascular plan can each fail for a mechanistically predictable reason.",
    pathology: "The common pathway begins with repetitive tissue stress exceeding the foot's capacity to recover. Sensory neuropathy prevents the patient from detecting a blister, foreign object, hot surface, or pressure point. Motor neuropathy contributes to claw toes, prominent metatarsal heads, limited joint motion, and altered gait, concentrating plantar force. Autonomic dysfunction reduces sweating and promotes dry fissured skin. Callus is not protective padding: it can raise focal pressure and hide hemorrhage or a cavity underneath. Repeated loading causes inflammation, microhemorrhage, tissue necrosis, and finally a full-thickness break. If perfusion is adequate and pressure is removed, coordinated inflammation, granulation, epithelial migration, and remodeling can heal the wound. Diabetes, kidney disease, malnutrition, edema, smoking, and ischemia impair those phases. When bacteria invade, edema and purulence increase tissue pressure within tight foot compartments, further lowering capillary flow and allowing infection to track along tendons and fascial planes. Osteomyelitis commonly develops by contiguous spread from a deep or chronic ulcer rather than through the bloodstream. Thus ulcer depth, duration, pressure, perfusion, and infection are not separate checkboxes; each can amplify the others and determine whether tissue can survive.",
    pathophysiology: [
      "Loss of protective sensation removes feedback. A person continues walking on a blister, stone, seam, callus, or deformity because damaging pressure no longer causes enough pain to trigger rest or inspection.",
      "Motor and autonomic neuropathy change the load-bearing surface. Intrinsic muscle imbalance, clawing, prominent metatarsal heads, Charcot deformity, dry skin, and fissures increase focal pressure and create entry points.",
      "Repetitive plantar pressure and shear cause subcallus hemorrhage and microtrauma. When injury accumulates faster than repair, tissue breaks down. Continued walking repeatedly disrupts the fragile wound edge, which explains why an excellent dressing cannot substitute for offloading.",
      "Peripheral artery disease reduces perfusion and reserve. Oxygen-dependent collagen formation, leukocyte killing, granulation, and antibiotic delivery all suffer. Diabetes-associated medial arterial calcification can make ankle arteries difficult to compress, so a normal or high ankle-brachial index does not reliably exclude ischemia.",
      "Hyperglycemia, kidney disease, smoking, malnutrition, anemia, edema, and inflammation impair immune and reparative function. Glycemic management supports healing, but an ulcer is rarely healed by glucose correction alone because mechanical and vascular drivers persist.",
      "Colonizing organisms are expected on an open wound. Infection begins when microbes invade viable tissue and produce local or systemic inflammation. Neuropathy, ischemia, and immune dysfunction can blunt pain, warmth, leukocytosis, or fever, so serial examination and severity classification matter.",
      "Deep infection spreads through contiguous compartments, tendon sheaths, joints, and bone. Purulence and edema raise compartment pressure, worsening ischemia and necrosis. This infection-ischemia cycle explains why drainage, debridement, antibiotics, and revascularization sometimes must proceed urgently together."
    ],
    etiology: "Most diabetes-related foot ulcers arise from neuropathy plus unrecognized repetitive mechanical stress, often over a plantar metatarsal head, heel, toe apex, or deformity. A tight shoe, foreign object, burn, puncture, nail injury, cracked callus, poorly fitted orthosis, or minor trauma can be the initiating event. Peripheral artery disease may be a major co-driver or, less commonly, the dominant cause, especially in distal toe or margin wounds with poor pulses and tissue loss. Charcot neuro-osteoarthropathy changes architecture and creates new pressure points. Prior ulcer or amputation predicts recurrence because the underlying neuropathy, deformity, altered load, and vascular disease remain after skin closes. Kidney failure, smoking, visual or mobility impairment, inability to inspect the foot, limited access to footwear or podiatry, and poorly coordinated transitions increase risk. Infection does not usually create the original neuropathic ulcer, but once present it can rapidly enlarge tissue loss. Not every wound in a person with diabetes is caused by diabetes: pressure injury, venous or arterial ulcer, vasculitis, malignancy, trauma, gout, pyoderma gangrenosum, calciphylaxis, and other conditions remain possible and may require opposite treatment choices.",
    riskFactors: [
      "Loss of protective sensation from peripheral neuropathy, especially when the patient cannot feel a 10-g monofilament or has reduced vibration or pinprick sensation",
      "Previous foot ulcer, minor or major amputation, Charcot neuro-osteoarthropathy, callus, preulcerative hemorrhage, deformity, limited joint mobility, or prominent bony pressure points",
      "Peripheral artery disease, smoking, absent or abnormal pedal pulses, prior revascularization, ischemic rest pain, or tissue loss",
      "Long diabetes duration, chronic hyperglycemia, kidney failure or dialysis, cardiovascular disease, anemia, malnutrition, edema, visual impairment, or limited mobility",
      "Poorly fitting footwear, walking barefoot, thermal injury, foreign body, repetitive occupational or activity pressure, nail trauma, or self-treatment of callus",
      "Inability to inspect or care for the feet because of poor vision, limited reach or dexterity, cognitive impairment, social isolation, unstable housing, cost, or lack of foot-care access",
      "Active infection, delayed presentation, deep ulcer, exposed or probe-to-bone findings, or combined ischemia and infection, which sharply increase limb-loss risk"
    ],
    signsSymptoms: [
      "A neuropathic ulcer is often on a plantar pressure point or toe apex, surrounded by callus, and may be surprisingly painless. The foot can be warm with palpable pulses, but those findings do not establish adequate healing perfusion.",
      "An ischemic component is suggested by distal toe or margin tissue loss, cool skin, dependent rubor, pallor with elevation, delayed refill, absent pulses, poor nail or skin quality, gangrene, or rest pain. Neuropathy can blunt ischemic pain, and calcified arteries can make bedside pressure results misleading.",
      "Clinical soft-tissue infection is suggested by purulent drainage or at least two inflammatory features such as erythema, warmth, tenderness or pain, induration, or swelling after competing causes are considered. Malodor or a positive culture alone does not prove invasion.",
      "Spreading erythema, lymphangitis, fluctuance, crepitus, bullae, skin necrosis, new discoloration, rapidly increasing drainage, systemic illness, or metabolic instability suggests a moderate-to-severe or deep infection.",
      "Osteomyelitis becomes more likely with a chronic, deep, or large ulcer, visible bone, a positive probe-to-bone finding in an appropriate setting, a swollen sausage toe, recurrent infection, or failure to heal despite credible offloading and wound care.",
      "A red, hot, swollen foot with little pain and relatively intact skin may be acute Charcot neuro-osteoarthropathy rather than cellulitis, gout, or simple edema. Continued walking can collapse the foot, so urgent immobilization and specialist assessment are required.",
      "Systemic fever and leukocytosis can be absent even in important diabetic foot infection. When fever, chills, hypotension, confusion, tachypnea, severe hyperglycemia, or ketoacidosis is present, the infection is especially concerning."
    ],
    diagnostics: [
      "Remove both shoes and socks and inspect the entire feet, interdigital spaces, heels, nails, and footwear. Document wound location, length, width, depth, undermining, sinus tracts, base, edge, callus, exudate, odor after cleansing, surrounding erythema, temperature, tenderness, fluctuance, crepitus, exposed structures, and serial photographs when authorized. A consistent measurement method makes trend meaningful.",
      "Assess neurologic and mechanical drivers with a 10-g monofilament plus another sensory modality when appropriate, foot shape, range of motion, gait, callus, prior amputation, footwear wear pattern, and the patient's ability to follow an offloading plan. Sensation testing predicts risk; it does not measure wound depth.",
      "Assess perfusion in every ulcer. Take a vascular history, inspect color and temperature, palpate pulses, and use pedal Doppler waveforms with ankle-brachial and toe-brachial measurements rather than relying on one test. Medial calcification can make ABI falsely high or reassuring. Toe pressure, transcutaneous oxygen, skin perfusion pressure, duplex, and anatomic imaging are selected according to local expertise and whether revascularization is being considered.",
      "Diagnose infection clinically and classify severity with the IWGDF/IDSA scheme. If examination is equivocal or difficult, CRP, ESR, or procalcitonin may support the assessment, but no inflammatory marker proves or excludes infection by itself.",
      "When an infected wound needs microbiology, cleanse and debride first and obtain an aseptic tissue specimen by curettage or biopsy when feasible. Superficial swabs preferentially recover colonizers and can drive unnecessarily broad antibiotics. Do not culture an uninfected ulcer simply to find bacteria.",
      "For possible osteomyelitis, combine probe-to-bone, plain radiographs, and ESR, CRP, or procalcitonin as initial studies. Plain films also reveal gas, foreign body, deformity, fracture, or Charcot changes but can be normal early. Repeat imaging or further evaluation may be needed when suspicion remains.",
      "Obtain MRI when osteomyelitis or a deep collection remains uncertain after clinical, radiographic, and laboratory assessment. MRI is sensitive and maps soft tissue, but reactive marrow edema from trauma, surgery, or Charcot can reduce specificity. PET, leukocyte scintigraphy, or SPECT can be alternatives when MRI is unsuitable.",
      "Bone culture and histology, obtained aseptically through uninfected skin or during surgery when feasible, provide the most direct etiologic evidence for osteomyelitis. A wound swab growing an organism does not establish that the same organism infects bone.",
      "Use a structured classification to communicate the problem: wound depth and location, ischemia, and infection severity. Systems such as WIfI can estimate amputation risk and potential revascularization benefit. Do not call an ulcer 'stage 3' without naming the classification because pressure-injury, Wagner, University of Texas, SINBAD, and IWGDF terms are not interchangeable.",
      "Evaluate healing modifiers with glucose and HbA1c context, CBC, kidney function, electrolytes, nutrition and albumin context, inflammatory markers, and other tests guided by illness. Albumin is affected by inflammation and fluid status and should not be treated as a stand-alone nutrition diagnosis."
    ],
    assessment: "A safe assessment asks why the wound formed, why it is not healing, and what threatens the limb today. Measure the wound after appropriate cleansing, map depth and tissue involvement, and compare serially. Determine whether pressure is still reaching the site during every step, transfer, and work activity; offloading that sits unused at home is not active treatment. Classify infection from clinical invasion rather than culture positivity and look for deep collections or bone involvement. Assess ischemia with multiple modalities because neuropathy can mask pain and arterial calcification can distort ABI. Reconcile glucose, kidney and cardiovascular disease, smoking, nutrition, anemia, edema, medications, vision, mobility, footwear, home support, and access. Examine the opposite foot because it often bears extra load during offloading. A small surface area does not guarantee low risk: depth, infection, ischemia, location, and trajectory matter more than appearance alone. Escalate infection and perfusion together when both are present because delaying either drainage or blood-flow restoration can sacrifice viable tissue.",
    differential: "A plantar callus-rimmed wound with loss of sensation suggests a neuropathic pressure ulcer, but pressure injury from immobility, pure arterial ulcer, venous ulcer, traumatic puncture, thermal burn, foreign-body wound, tinea fissure, gout, cellulitis, abscess, osteomyelitis, and Charcot neuro-osteoarthropathy can overlap. Distal punched-out tissue loss, gangrene, and poor perfusion suggest an arterial mechanism; gaiter-region edema and hemosiderin suggest venous disease, though mixed disease is common. A hot swollen intact foot may be acute Charcot, deep infection, gout, fracture, or thrombosis. Calciphylaxis, vasculitis, cholesterol emboli, pyoderma gangrenosum, pressure-related heel eschar, and malignancy matter when pain, distribution, border, systemic context, or treatment response is atypical. Do not debride presumed pyoderma or stable ischemic eschar reflexively, and do not dismiss rapidly progressive infection as gout. Imaging, vascular testing, carefully obtained tissue, and specialist review are chosen to separate mechanisms that demand different treatment.",
    treatments: [
      "Build an interdisciplinary limb-preservation plan. Podiatry or foot surgery, wound care, endocrinology or primary diabetes care, vascular surgery, infectious diseases or microbiology, orthotics, nursing, rehabilitation, nutrition, and social support contribute according to severity. A handoff must name who owns offloading, wound review, vascular results, antimicrobials, glucose management, and the next visit.",
      "Offload the injuring force. For a neuropathic plantar forefoot or midfoot ulcer without a contraindication, IWGDF recommends a nonremovable knee-high device as first choice because it redistributes pressure and prevents unintentional nonadherence. A total-contact cast or rendered-nonremovable walker is selected by a trained clinician based on wound, infection, ischemia, fall risk, limb shape, resources, and patient preference.",
      "When a nonremovable device is contraindicated or not tolerated, use a removable knee-high or ankle-high device and support use during every weight-bearing activity. Conventional or standard therapeutic footwear alone is not adequate first-line offloading for an active plantar ulcer. Nonplantar wounds need location-specific footwear modification, orthosis, toe spacer, or other device. Severe infection or ischemia takes priority and usually requires a removable strategy that permits frequent inspection.",
      "Cleanse the wound, remove surrounding callus and nonviable tissue when perfusion and clinical context make debridement safe, protect viable tissue, and choose a dressing that controls exudate while maintaining a wound-healing environment. Dressing brand is secondary to pressure relief, perfusion, infection control, and consistent reassessment. Stable dry ischemic eschar or gangrene requires vascular and surgical planning before routine aggressive debridement.",
      "Do not give systemic or local antibiotics to a clinically uninfected ulcer to promote healing or prevent infection. When infection is present, classify severity, obtain an appropriate tissue culture when useful, start empiric therapy according to severity, likely organisms, prior cultures, recent antibiotics, renal function, allergies, and local resistance, then narrow to culture-directed treatment. Antibiotics cannot drain an abscess or restore blood flow.",
      "Obtain urgent surgical evaluation for severe infection or moderate infection with extensive gangrene, necrotizing process, deep abscess, compartment syndrome, or severe ischemia. Early surgery and antibiotics may be needed to drain pus and remove infected or necrotic tissue. Preserve as much functional tissue as safely possible, but do not let a desire to avoid amputation delay life-saving source control.",
      "When infection coexists with PAD, obtain urgent surgical and vascular consultation to coordinate drainage and revascularization timing. Revascularization is considered when ischemia limits healing or threatens tissue; the choice of endovascular, open, or hybrid treatment depends on anatomy, conduit, comorbidity, function, goals, and local expertise.",
      "Treat suspected osteomyelitis with a bone- and patient-specific plan. Some selected forefoot cases without PAD, exposed bone, or an immediate drainage need may be treated medically; others require conservative bone resection or more extensive surgery plus systemic antibiotics. Route and duration depend on resection margins, residual infected bone, organism, clinical response, and current guidance.",
      "Optimize glucose safely, manage blood pressure and lipids, stop smoking, treat edema and anemia appropriately, ensure adequate protein and energy, and adjust renal-risk medicines. Tightening glucose too aggressively can cause hypoglycemia without correcting pressure or ischemia, so targets remain individualized.",
      "Consider advanced wound products or adjunctive therapies only after standard care is genuinely optimized and healing trajectory is inadequate. Evidence supports selected products in selected chronic ulcers, but no skin substitute, negative-pressure device, topical oxygen treatment, or other adjunct compensates for unrelieved pressure, untreated infection, or inadequate perfusion.",
      "After closure, transition to recurrence prevention: pressure-relieving therapeutic footwear, callus and nail care, frequent risk-based foot surveillance, self-inspection, prompt treatment of preulcerative lesions, and gradual monitored return to activity. Closed skin is remission, not removal of neuropathy or deformity."
    ],
    contraindications: [
      "Do not prescribe antibiotics for a clinically uninfected ulcer merely because a culture grows bacteria, the wound smells before cleansing, or diabetes is present. Colonization is expected and unnecessary antibiotics cause harm and resistance.",
      "Do not use a superficial swab as the preferred culture for a deep infected ulcer when a cleansed aseptic tissue specimen can be obtained. Surface organisms may misdirect treatment.",
      "Do not rely on pain to grade severity. Neuropathy can make a deep ulcer, abscess, ischemic wound, or osteomyelitis nearly painless.",
      "Do not rely on a normal or high ABI to exclude PAD in diabetes. Noncompressible calcified arteries can create false reassurance; combine waveforms, toe testing, examination, and vascular judgment.",
      "Do not place every patient in a nonremovable cast. Moderate or severe infection, significant ischemia, frequent inspection needs, major edema, fall risk, inability to attend follow-up, or other individual factors may make a removable or different plan safer.",
      "Do not aggressively debride stable dry gangrene or ischemic eschar without assessing perfusion and the revascularization or surgical plan. Converting dry tissue to an open poorly perfused wound can increase infection risk.",
      "Do not let topical products, soaking, peroxide, heat, or a home callus blade replace professional wound care. These can macerate, burn, traumatize, or delay escalation."
    ],
    nursingPriorities: [
      "Inspect both feet and footwear at every relevant encounter. Measure and document the ulcer consistently, mark erythema when appropriate, assess drainage after cleansing, and compare with prior photographs or measurements because trend detects failure earlier than memory.",
      "Assess perfusion and sensation, not just the wound bed. Record pulses, Doppler or ordered pressure results, color, temperature, refill, rest pain, monofilament findings, and new necrosis; escalate discordant or worsening findings.",
      "Verify that the prescribed offloading device is present, fits, and is used for transfers, bathroom trips, work, and other weight-bearing activity. Explore discomfort, balance, stairs, driving, sleep, work, and cost barriers without blame and arrange device adjustment rather than accepting nonuse.",
      "Perform cleansing and dressing changes with hand hygiene and the ordered technique, protect periwound skin from moisture, and avoid cutting callus unless trained and authorized. Report undermining, exposed tendon or bone, new odor after cleansing, unexpected bleeding, or rapid tissue change.",
      "Monitor temperature, heart rate, blood pressure, mental status, glucose, kidney function, CBC and ordered inflammatory markers, and the entire leg. Older adults and people with kidney disease may develop severe infection with muted fever or leukocytosis.",
      "Administer antimicrobials exactly as ordered for clinically infected wounds, obtain cultures before antibiotics when feasible without delaying emergency therapy, review allergies and renal dosing, and monitor response and adverse effects. Document that antibiotics do not replace offloading, drainage, perfusion, and glucose care.",
      "Protect the contralateral foot from overload and inspect skin under and around casts, walkers, braces, and footwear. Offloading one side can create a new ulcer or fall risk on the other.",
      "Coordinate nutrition, smoking cessation, diabetes education, home health, podiatry, vascular, surgery, infectious disease, rehabilitation, transportation, supplies, and follow-up. Confirm that the patient can describe whom to call and when.",
      "Escalate immediately for systemic illness, rapidly progressive inflammation, crepitus, bullae, gangrene, deep fluctuance, severe ischemia, or new metabolic decompensation. Do not wait for the next wound-clinic appointment."
    ],
    redFlags: [
      "Fever or hypothermia, hypotension, confusion, tachypnea, rigors, marked hyperglycemia, ketoacidosis, or other systemic toxicity with a foot wound",
      "Rapidly spreading erythema, bullae, crepitus, skin anesthesia beyond baseline, dusky or black tissue, severe swelling, purulence under pressure, or suspected necrotizing infection",
      "Extensive gangrene, deep abscess, compartment syndrome, exposed joint, new tendon dysfunction, or infection tracking proximally",
      "Cold pale or mottled foot, absent Doppler flow, new rest pain, sudden loss of perfusion, severe ischemia, or infection plus PAD",
      "Visible bone, positive probe-to-bone in a high-risk ulcer, sausage toe, pathologic fracture, or persistent deep ulcer suggesting osteomyelitis",
      "Hot swollen foot with deformity or relatively little pain suggesting active Charcot neuro-osteoarthropathy",
      "Wound enlargement, new necrosis, or absent healing trajectory despite documented offloading, perfusion assessment, and wound care"
    ],
    complications: [
      "Cellulitis, deep-space abscess, necrotizing infection, septic arthritis, tenosynovitis, osteomyelitis, bacteremia, sepsis, shock, and death",
      "Progressive ischemia, gangrene, tissue loss, minor or major amputation, impaired mobility, falls, deconditioning, and loss of independence",
      "Charcot collapse, recurrent ulceration, transfer lesions, and new contralateral wounds caused by persistent deformity or altered load",
      "Kidney injury, C. difficile infection, drug interactions, and antimicrobial resistance from unnecessary or overly broad antibiotic therapy",
      "Depression, stigma, financial strain, work loss, repeated hospitalization, caregiver burden, and reduced quality of life",
      "Cardiovascular events and mortality associated with systemic atherosclerotic disease in patients whose ulcer also reveals PAD"
    ],
    prognosis: "Healing depends on whether mechanical stress is actually removed, blood flow can support repair, infection is controlled, nonviable or infected tissue is managed, and systemic barriers are addressed. Surface size alone is not enough to predict outcome. Deep wounds, PAD, infection, kidney failure, prior amputation, poor access, and a weak early healing trajectory raise risk. Even after closure, recurrence is common because neuropathy, deformity, and pressure remain; the foot is in remission rather than cured. A history of ulcer moves the patient into a high-risk surveillance group. The most useful prognosis is therefore dynamic: measure change, verify offloading, reassess perfusion and infection when progress stalls, and modify the plan early. Failure to heal is not automatically nonadherence and should trigger a search for hidden pressure, ischemia, bone infection, edema, malnutrition, wrong diagnosis, or an ineffective care system.",
    prevention: "Prevention starts before an ulcer appears. Inspect feet daily, including soles and between toes; use a mirror or another person's help when vision or reach is limited. Wash and dry gently, moisturize dry skin but not between toes, avoid barefoot walking and thermal extremes, and check shoes before wearing them. Professional nail and callus care is safer for high-risk feet than blades or chemical removers at home. Every person with diabetes needs periodic comprehensive foot assessment, with more frequent specialist surveillance for loss of sensation, PAD, deformity, kidney failure, prior ulcer, or amputation. Properly fitted therapeutic footwear and pressure-relieving orthoses reduce recurrent injury when matched to foot shape and worn consistently. Smoking cessation, safe glucose management, vascular risk reduction, nutrition, vision and mobility support, and rapid treatment of a blister, fissure, redness, swelling, warmth, or callus hemorrhage all reduce the chance that a small problem becomes limb threatening.",
    patientEducation: [
      "Check both feet every day even when they do not hurt. Neuropathy can hide a blister, burn, foreign object, or deep ulcer; pain is not a reliable alarm.",
      "Do not walk barefoot, soak the feet, use heating pads or hot-water bottles, cut calluses, or apply corn removers, peroxide, or unapproved chemicals. Test bath water safely and wear properly fitted shoes and clean socks.",
      "Wear the offloading device for every weight-bearing step unless the care team gives a specific exception. A removable boot cannot reduce pressure while it is beside the bed.",
      "Keep dressings clean and follow the exact change plan. Call promptly for spreading redness, swelling, drainage, odor after cleaning, fever, new black tissue, a hot swollen foot, or a wound that becomes larger or deeper.",
      "Antibiotics are used when tissue is infected, not simply because bacteria live on an open wound. Healing also requires pressure relief, enough blood flow, wound care, nutrition, and diabetes management.",
      "After the skin closes, keep podiatry visits and therapeutic footwear. The previous ulcer site and new pressure points remain vulnerable, so prevention continues for life.",
      "Bring shoes, inserts, offloading devices, glucose records, medicine list, and dressing supplies to visits when requested. These show the team what the foot experiences outside the clinic."
    ],
    nclexTraps: [
      "A painless diabetic foot ulcer is not reassuring. Loss of protective sensation is often why damage continued unnoticed.",
      "A wound culture does not diagnose infection. Diagnose invasion clinically, and prefer cleansed deep tissue over a superficial swab when culture is needed.",
      "Do not give prophylactic antibiotics to an uninfected ulcer. Colonization is expected and antibiotics do not improve pressure, perfusion, or routine healing.",
      "Offloading is causal treatment. A dressing may protect the wound, but continued plantar pressure repeatedly tears repair tissue.",
      "A normal or high ABI can be falsely reassuring in diabetes because calcified arteries may not compress. Pair it with Doppler waveforms, toe testing, and the clinical picture.",
      "Probe-to-bone, plain radiographs, and inflammatory markers are initial pieces of an osteomyelitis assessment; none alone proves or excludes bone infection. MRI helps when doubt remains.",
      "Infection plus ischemia needs urgent surgical and vascular coordination. Antibiotics cannot penetrate dead tissue reliably, drain an abscess, or restore arterial flow.",
      "A hot swollen neuropathic foot may be Charcot even without an ulcer. Continued weight bearing can cause collapse and needs urgent immobilization and specialist review.",
      "Do not call every ulcer 'stage 3' without naming the scale. Pressure-injury staging and diabetic-foot classification systems answer different questions."
    ],
    relatedTopics: [
      "Diabetic peripheral neuropathy", "Peripheral arterial disease", "Diabetic foot infection",
      "Osteomyelitis", "Charcot neuro-osteoarthropathy", "Wound assessment", "Offloading",
      "Total contact cast", "Ankle-brachial index", "Toe-brachial index", "Doppler waveform",
      "WIfI classification", "Debridement", "Gangrene", "Sepsis", "Amputation prevention",
      "Therapeutic footwear", "Diabetes self-management", "Smoking cessation"
    ],
    aliases: [
      "diabetes-related foot ulcer", "diabetes related foot ulcer", "diabetic foot wound", "diabetes foot wound",
      "diabetic ulcer", "diabetic foot sore", "diabetic sore on foot", "diabetic toe ulcer",
      "diabetic heel ulcer", "plantar diabetic ulcer", "neuropathic diabetic foot ulcer",
      "neuropathic foot ulcer", "diabetic pressure ulcer of foot", "DFU", "DFUs",
      "foot ulcer in diabetes", "open sore on diabetic foot", "painless foot ulcer diabetes",
      "hole in bottom of foot diabetes", "black toe wound diabetes", "diabetic wound not healing",
      "why doesn't my diabetic foot wound hurt", "does every diabetic foot ulcer need antibiotics",
      "how do you offload a diabetic foot ulcer", "diabetic foot ulcer probe to bone",
      "diabtic foot ulcer", "diabetic foot ulser", "diabetec foot ulcer", "diabetic feet ulcer"
    ],
    abbreviations: ["DFU", "DFUs"],
    ambiguousAbbreviations: ["DFU"],
    commonMisspellings: ["diabtic foot ulcer", "diabetic foot ulser", "diabetec foot ulcer", "diabetic feet ulcer", "diabetic foot ucler", "diabete foot wound"],
    searchTerms: [
      "diabetic foot ulcer", "diabetes related foot ulcer", "DFU", "neuropathic foot wound",
      "painless plantar ulcer", "diabetic foot infection", "diabetic foot osteomyelitis",
      "offloading diabetic ulcer", "probe to bone", "diabetic foot poor circulation", "diabetic foot gangrene"
    ],
    tags: [
      "frontier-wave37", "diabetic foot ulcer", "diabetes-related foot disease", "neuropathy", "offloading",
      "peripheral artery disease", "wound infection", "osteomyelitis", "vascular assessment",
      "limb preservation", "amputation prevention", "wound care", "mechanism first"
    ],
    sourceKeys: diabeticFootSourceKeys,
    sourceNote: "Original educational synthesis grounded in ADA 2026 Standards, the current IWGDF 2023 practical, offloading, PAD, and IWGDF/IDSA infection guidelines, and CDC patient guidance. Device eligibility, debridement, antibiotic selection, revascularization, and surgical timing require current local protocols and an interdisciplinary foot team.",
    evidenceLimitations: [
      "Many offloading, dressing, advanced-product, and surgical recommendations have low or very-low certainty and depend on ulcer location, infection, ischemia, patient tolerance, training, and resources.",
      "No single bedside perfusion test excludes PAD in diabetes, and no single probe-to-bone, biomarker, radiograph, or MRI finding proves or excludes osteomyelitis in every context.",
      "Wound classification systems serve different purposes and are not interchangeable. This card teaches the variables that matter rather than imposing one universal stage label.",
      "Antibiotic choice and duration depend on severity, source control, bone involvement, cultures, renal function, local resistance, and current guidance; a static encyclopedia should not provide a one-size regimen.",
      "Advanced wound therapies should be evaluated only after standard care is truly optimized. Evidence for one selected product cannot be generalized to every chronic ulcer."
    ],
    clinicalFrontierWave37ClinicalCRevision: VERSION
  };

  installWave37ClinicalC();
}());
