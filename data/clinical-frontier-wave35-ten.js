/* eslint-disable */
/* Wave 35: standalone, why-centered toxic epidermal necrolysis reference. */
(function () {
  "use strict";

  const VERSION = "2026-07-20-wave35-ten-2";
  if (window.ANI_TEN_WAVE35 && window.ANI_TEN_WAVE35.version === VERSION) return;

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) {
    window.ANI_TEN_WAVE35 = Object.freeze({
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
      key: "w35-ten-vumc-2025",
      label: "Vanderbilt University Medical Center Burn Center: SJS/TEN guidelines (revised July 2025)",
      url: "https://www.vumc.org/burn/sites/default/files/public_files/Protocols/SJSTEN-Guidelines-2025-07.pdf",
      note: "Supports spectrum classification, SCORTEN, transfer, multidisciplinary assessment, supportive care, wound care, and systemic-treatment cautions."
    },
    {
      key: "w35-ten-german-s3-2024-part1",
      label: "German S3 guideline for epidermal necrolysis, Part 1: diagnosis and initial management (2024)",
      url: "https://onlinelibrary.wiley.com/doi/10.1111/ddg.15515",
      note: "Supports diagnostic criteria, culprit-drug assessment, prognosis, care setting, and initial management."
    },
    {
      key: "w35-ten-german-s3-2024-part2",
      label: "German S3 guideline for epidermal necrolysis, Part 2: supportive and specialty care (2024)",
      url: "https://onlinelibrary.wiley.com/doi/10.1111/ddg.15516",
      note: "Supports skin, eye, oral, genitourinary, respiratory, nutritional, infection, and follow-up care."
    },
    {
      key: "w35-ten-bad-2016",
      label: "British Association of Dermatologists guideline for adult SJS/TEN (2016)",
      url: "https://academic.oup.com/bjd/article/174/6/1194/6617016",
      note: "Supports assessment, immediate drug withdrawal, specialist placement, barrier nursing, wound care, and multidisciplinary follow-up."
    },
    {
      key: "w35-ten-consensus-1993",
      label: "Consensus classification of erythema multiforme, SJS, and TEN (1993)",
      url: "https://pubmed.ncbi.nlm.nih.gov/8420497/",
      note: "Supports the less-than-10%, 10%-to-30%, and greater-than-30% detached or detachable BSA classification."
    },
    {
      key: "w35-ten-scorten-2000",
      label: "Bastuji-Garin et al.: SCORTEN severity score (2000)",
      url: "https://pubmed.ncbi.nlm.nih.gov/10951229/",
      note: "Supports the seven original SCORTEN variables and their use for mortality-risk stratification."
    },
    {
      key: "w35-ten-granulysin-2008",
      label: "Chung et al.: granulysin as a key mediator of SJS/TEN keratinocyte death (2008)",
      url: "https://pubmed.ncbi.nlm.nih.gov/19029983/",
      note: "Supports the cytotoxic lymphocyte and granulysin mechanism of widespread epithelial cell death."
    },
    {
      key: "w35-ten-alden-2010",
      label: "Sassolas et al.: ALDEN culprit-drug causality algorithm (2010)",
      url: "https://pubmed.ncbi.nlm.nih.gov/20375998/",
      note: "Supports structured assessment of medication timing, dechallenge, prior exposure, notoriety, and competing causes."
    },
    {
      key: "w35-ten-cochrane-2022",
      label: "Cochrane review: systemic interventions for SJS/TEN (2022)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8915395/",
      note: "Supports the uncertainty and generally low or very-low certainty surrounding systemic immunomodulatory treatments."
    },
    {
      key: "w35-ten-cpic-hla-2018",
      label: "CPIC guideline for HLA genotype and carbamazepine or oxcarbazepine use (2018)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5847474/",
      note: "Supports selected pre-prescription HLA-B*15:02 and HLA-A*31:01 pharmacogenetic risk reduction."
    }
  ];

  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];
  sourceReferences.forEach((source) => {
    const existing = database.sourceReferences.find((item) => clean(item && (item.key || item.id)) === source.key);
    if (existing) Object.assign(existing, source);
    else database.sourceReferences.push({ ...source });
  });

  const tenCard = {
    name: "Toxic epidermal necrolysis",
    displayName: "Toxic epidermal necrolysis",
    category: "Dermatology, Emergency & Critical Care",
    nclexEssential: true,
    definition: "Toxic epidermal necrolysis (TEN, or Lyell syndrome) is the most extensive form of the Stevens-Johnson syndrome/TEN spectrum: an uncommon, usually medication-triggered emergency in which immune cells kill epidermal and mucosal epithelial cells. The damaged epidermis then separates from the dermis over 30% of body surface area. This is not simply a severe rash. Losing the skin barrier causes extreme pain, heat and fluid loss, electrolyte and protein loss, infection risk, vision-threatening ocular injury, airway epithelial injury, respiratory failure, kidney injury, and possible multiorgan failure. A painful spreading rash, blisters, peeling skin, or sores of the mouth, eyes, or genitals after a recently started medication requires immediate emergency evaluation.",
    pathology: "TEN usually begins when a medication interacts with a susceptible person's antigen-presentation system, including particular HLA molecules. Drug-specific CD8 T cells and natural killer cells then release granulysin, perforin, granzyme B, Fas ligand, and inflammatory signals. These signals cause full-thickness keratinocyte death. Because keratinocytes build the epidermal barrier, large-scale death allows the epidermis to detach from the dermis. Related epithelial cells line the mouth, ocular surface, genital tract, airway, and parts of the gastrointestinal tract, so the same immune process can injure multiple mucosal organs. Barrier failure explains why a skin finding becomes a critical-care problem: water, electrolytes, protein, and heat escape, pain is intense, and microbes gain access to vulnerable tissue.",
    pathophysiology: [
      "Trigger and susceptibility: a high-risk or occasionally another medication is encountered during a susceptible immune context. HLA genotype can modify risk for particular drug-ancestry combinations, but genetics alone neither guarantees nor excludes TEN.",
      "Cytotoxic activation: drug-specific CD8 T cells and natural killer cells expand and release granulysin and other death mediators. Granulysin is especially important because it can diffuse through tissue and injure keratinocytes beyond direct cell-to-cell contact.",
      "Epidermal necrosis: widespread keratinocyte death produces dusky tender skin, flaccid bullae, erosions, and sheet-like detachment. Light pressure may extend separation, but a Nikolsky sign is not specific and cannot establish the diagnosis by itself.",
      "Multisystem epithelial injury: oral, ocular, genital, urinary, respiratory, and gastrointestinal surfaces may erode because they share vulnerable epithelium. The extent of visible skin disease does not reliably predict how badly every mucosal organ is affected.",
      "Systemic consequences: loss of barrier and inflammatory stress cause hypovolemia, electrolyte disturbance, hypothermia, hypermetabolism, impaired nutrition, infection, sepsis, respiratory failure, kidney injury, and multiorgan failure. This causal chain is why rapid drug withdrawal and meticulous supportive care change outcomes."
    ],
    etiology: "Most adult cases are medication associated. Strongly established triggers include trimethoprim-sulfamethoxazole and other sulfonamide anti-infectives, allopurinol, carbamazepine, phenytoin, phenobarbital, lamotrigine, oxicam NSAIDs, and nevirapine, although many other drugs can rarely cause the syndrome. On first exposure, symptoms often begin about 4 to 28 days after starting the culprit; ALDEN considers 5 to 28 days especially suggestive and a longer interval up to 56 days compatible in some circumstances. Re-exposure may trigger disease within only a few days. A drug prescribed for fever, pain, or respiratory symptoms after the prodrome began may be wrongly blamed, so clinicians reconstruct the timing of every prescription, over-the-counter product, supplement, prior exposure, dose change, and symptom. Infections are more common triggers of erythema multiforme or reactive infectious mucocutaneous eruption than classic TEN, but competing causes must still be evaluated.",
    riskFactors: [
      "Starting a strongly associated medication during the usual risk window, especially trimethoprim-sulfamethoxazole, allopurinol, lamotrigine, carbamazepine, phenytoin, phenobarbital, an oxicam NSAID, or nevirapine",
      "Prior SJS/TEN from the same drug or a specialist-identified cross-reactive drug, because re-exposure can activate memory immune cells and produce a faster reaction",
      "A relevant drug-HLA combination, such as HLA-B*15:02 with carbamazepine or HLA-B*58:01 with allopurinol; ancestry affects allele prevalence, but no genotype makes clinical monitoring unnecessary",
      "Renal dysfunction or dosing that raises exposure to some culprit drugs, especially allopurinol/oxypurinol, although TEN remains an unpredictable idiosyncratic reaction rather than simple dose toxicity",
      "Active malignancy and older age increase mortality risk after disease begins even though they do not by themselves identify the culprit drug"
    ],
    signsSymptoms: [
      "A prodrome several days before detachment may resemble influenza: fever, profound malaise, sore throat, cough, myalgia, and burning or irritated eyes.",
      "Skin pain or tenderness is an important early clue because keratinocyte injury can hurt before obvious detachment appears. Dusky red or purpuric macules and flat atypical targets may rapidly merge, blister, erode, and peel in sheets.",
      "Oral involvement may cause hemorrhagic lip crusts, painful ulcers, drooling, difficulty swallowing, dehydration, or inability to eat. Eye disease may cause redness, pain, photophobia, discharge, blurred vision, epithelial defects, or adhesions. Genital and urethral erosions may cause pain, dysuria, urinary retention, and later scarring.",
      "Voice change, heavy secretions, low oxygen, dyspnea, tachypnea, or abnormal imaging may indicate airway or pulmonary epithelial injury. Respiratory severity can be substantial even when skin BSA appears less dramatic.",
      "Hypotension, reduced urine output, altered mental status, temperature instability, rising creatinine, metabolic disturbance, or signs of infection indicate systemic deterioration and require immediate escalation."
    ],
    diagnostics: [
      "Treat the suspected syndrome as an emergency while confirming it. Dermatology assessment should document morphology, mucosal sites, progression, and the maximum detached or readily detachable BSA; do not count every erythematous area as detached skin.",
      "Classify by detached or detachable epidermis: SJS is less than 10% BSA, SJS/TEN overlap is 10% to 30%, and TEN is greater than 30%. The labels describe extent along one disease spectrum, not three unrelated mechanisms.",
      "Obtain a prompt skin biopsy from an appropriate lesion edge. Typical histology shows widespread keratinocyte apoptosis, full-thickness epidermal necrosis, and subepidermal separation. Direct immunofluorescence from a separate specimen may help exclude pemphigus, pemphigoid, linear IgA disease, and other immune blistering disorders. No routine blood test confirms TEN.",
      "Build a day-by-day medication and symptom timeline, then apply ALDEN separately to each possible culprit. ALDEN structures causality reasoning but does not prove which drug caused the reaction or make rechallenge safe.",
      "Trend CBC, electrolytes, bicarbonate, glucose, urea/BUN, creatinine, liver tests, albumin, urine output, temperature, hemodynamics, oxygenation, and organ-directed studies. Culture suspected infection rather than using routine prophylactic systemic antibiotics.",
      "Assess severity with SCORTEN within the first 24 hours and repeat around day 3. Give one point each for age over 40 years, active malignancy, heart rate over 120/min, detached or compromised skin over 10% BSA, serum urea over 10 mmol/L (approximately BUN over 28 mg/dL), glucose over 14 mmol/L (about 250 mg/dL), and bicarbonate below 20 mmol/L.",
      "SCORTEN estimates mortality risk for groups; it does not diagnose TEN, select one treatment, or determine an individual's outcome. Its cutoffs discard clinical detail, variables change during resuscitation, and calibration can differ by population and era, so use it with serial bedside assessment.",
      "Distinguish TEN from erythema multiforme major, reactive infectious mucocutaneous eruption, generalized bullous fixed drug eruption, staphylococcal scalded skin syndrome, autoimmune blistering disease, acute graft-versus-host disease, DRESS, AGEP, TEN-like lupus, and thermal or chemical injury using morphology, mucosal pattern, exposure history, biopsy, immunofluorescence, cultures, and clinical context."
    ],
    treatments: [
      "Stop the most likely culprit and all nonessential medications immediately; do not wait for biopsy confirmation. Earlier withdrawal reduces ongoing immune stimulation, and no proposed immunomodulator can compensate for continued exposure.",
      "Secure a threatened airway, support ventilation and circulation, prevent heat loss, and control pain. Every suspected TEN case warrants immediate evaluation by an experienced skin-failure, ICU, or burn-center team and transfer to an appropriate specialty setting when the current facility cannot provide that care; initial physiological stability does not make extensive epidermal failure safe for routine ward management. TEN care requires dermatology, critical care, ophthalmology, pharmacy, nutrition, wound expertise, and site-specific specialty support.",
      "Use individualized fluid and electrolyte replacement guided by hemodynamics, weight, laboratory trends, and urine output. TEN is not a thermal burn, so automatically applying aggressive thermal-burn formulas can cause edema and worsen pulmonary or wound problems.",
      "Protect the remaining epidermis with gentle handling, minimal shear, nonadherent interfaces, a warm environment, pressure-injury prevention, and a center-specific conservative or debridement strategy. Evidence does not establish one universal wound approach.",
      "Start early enteral nutrition when feasible because inflammation, wound loss, and repair increase protein and energy needs. Provide frequent oral and lip care, adequate background and procedural analgesia, VTE prevention when appropriate, mobility support, and psychological care.",
      "Use strict hand hygiene and barrier precautions, inspect wounds and lines, and culture when infection is suspected. Do not use routine prophylactic systemic antibiotics because they do not restore the barrier, can select resistant organisms, and may obscure or create medication-causality problems.",
      "Obtain ophthalmology assessment within 24 hours and repeat ocular-surface examinations during the acute phase. Preservative-free lubrication, topical therapy, adhesion management, and early amniotic membrane treatment for significant disease are specialist directed because early surface protection can prevent irreversible scarring and vision loss.",
      "Examine oral, genital, urinary, and respiratory mucosa repeatedly. Gynecology or urology may use protective ointments, catheterization, stents, or adhesion-prevention plans; ENT, pulmonology, or critical care may evaluate airway and bronchial injury when symptoms appear.",
      "Supportive care and culprit withdrawal are the foundation. Specialist teams may consider corticosteroids, cyclosporine, etanercept, IVIG, or other immunomodulation based on timing, comorbidity, infection and renal risk, and local expertise, but comparative evidence remains limited and no systemic drug is universally superior. Thalidomide should not be used because a randomized trial showed excess mortality. Systemic-therapy debate must never delay the basics."
    ],
    contraindications: [
      "Do not deliberately rechallenge a suspected culprit outside an exceptional specialist decision because recurrence may be faster and life threatening.",
      "Do not use routine prophylactic systemic antibiotics; give culture-guided treatment when infection is clinically suspected or proven because unnecessary antibiotics add resistance and adverse-reaction risk.",
      "Do not automatically apply thermal-burn resuscitation formulas, aggressive skin scrubbing, universal debridement, or adhesive-heavy monitoring because TEN loss patterns and fragile epidermis require individualized care.",
      "Do not use thalidomide for SJS/TEN because a randomized trial found increased mortality, and do not present corticosteroids, IVIG, cyclosporine, or etanercept as universally superior.",
      "Do not delay culprit withdrawal, airway and circulation support, ophthalmology, or transfer while awaiting biopsy, ALDEN scoring, SCORTEN, or a systemic-treatment decision."
    ],
    nursingPriorities: [
      "Stop and quarantine suspected culprit and nonessential medicines as ordered, record the last doses, and obtain a complete prescription, OTC, supplement, brand, generic, start-date, stop-date, and prior-exposure history because accurate withdrawal and future avoidance depend on a reliable timeline.",
      "Assess airway, work of breathing, oxygenation, voice, secretions, circulation, mental status, temperature, pain, and urine output frequently. Escalate changes immediately because mucosal sloughing, hypovolemia, infection, and organ injury can progress faster than the visible rash suggests.",
      "Map and trend detached or readily detachable BSA and each mucosal site using the same method, with photographs when authorized. Record progression rather than counting all redness because the SJS, overlap, and TEN thresholds depend on actual detachment potential.",
      "Minimize friction and adhesive injury during turning, transfers, monitoring, and dressing changes. Premedicate and explain every procedure because exposed dermis is intensely painful and mechanical shear can enlarge detachment.",
      "Trend intake, output, weight, hemodynamics, electrolytes, glucose, bicarbonate, urea/BUN, creatinine, albumin, and edema. Replace losses according to the individualized plan because both under-resuscitation and fluid overload can worsen organ function.",
      "Use warm ambient temperature, clean nonadherent wound technique, meticulous line care, and barrier precautions. Watch for clinical infection and sepsis because prophylactic antibiotics cannot substitute for surveillance and may select resistant organisms.",
      "Coordinate eye evaluation within 24 hours even when ocular symptoms initially seem mild, and report new pain, photophobia, blurred vision, discharge, epithelial defect, or adhesion because irreversible scarring can begin during the acute phase.",
      "Inspect and protect oral, genital, urethral, and perianal surfaces; monitor swallowing, nutrition, voiding, retention, bleeding, and pain. Early specialty measures help prevent dehydration, malnutrition, adhesions, stenosis, and long-term sexual or urinary dysfunction.",
      "Before discharge, make the allergy record unmissable: name the suspected generic and brand drug, reaction as SJS/TEN, date, uncertainty, cross-reactivity advice, and specialist plan. Give written avoidance instructions and medical-alert guidance because accidental re-exposure can trigger a faster, severe recurrence."
    ],
    redFlags: [
      "Painful or rapidly spreading dusky rash, blistering, peeling, or mouth, eye, or genital erosions after a recently started or restarted medication",
      "More than 30% detached or readily detachable BSA, rapid extension, hemodynamic instability, reduced urine output, severe electrolyte disturbance, or altered mental status",
      "Voice change, stridor, dyspnea, hypoxemia, tachypnea, heavy secretions, chest findings, or suspected airway and bronchial sloughing",
      "Eye pain, photophobia, blurred vision, corneal epithelial defect, pseudomembrane, or conjunctival adhesion",
      "Fever with hypotension, worsening organ function, focal infection findings, or sepsis concern"
    ],
    complications: [
      "Acute barrier failure with hypovolemia, electrolyte and protein loss, hypothermia, severe pain, and malnutrition",
      "Bacterial or fungal infection, sepsis, shock, acute kidney injury, respiratory failure, and multiorgan failure",
      "Ocular ulceration, symblepharon, limbal stem-cell failure, severe dry eye, trichiasis, corneal scarring, and blindness",
      "Oral dryness, dysphagia, dental disease, genital adhesions, phimosis, urethral stricture, vaginal stenosis, dyspareunia, and urinary or sexual dysfunction",
      "Pigment change, chronic pruritus or pain, nail loss or dystrophy, alopecia, and hypertrophic or other scarring",
      "Bronchiolitis obliterans, bronchiectasis, chronic bronchitis, reduced exercise tolerance, depression, anxiety, and post-traumatic stress symptoms"
    ],
    patientEducation: [
      "Seek emergency care now for a painful spreading rash, blisters, peeling skin, or mouth, eye, or genital sores after a new or restarted medicine. Do not take another dose unless an emergency clinician who knows the situation specifically directs it.",
      "TEN is classified by detached or detachable skin, not by how red the rash looks. SJS is under 10%, overlap is 10% to 30%, and TEN is over 30%; all forms can be dangerous and need urgent specialist assessment.",
      "Keep a permanent written record of the suspected drug's generic and brand names, the date, and the exact reaction. Use a medical-alert bracelet or wallet card, notify every prescriber and pharmacy, and never test the drug again on your own.",
      "A clinician may identify related drugs to avoid or recommend selected HLA testing before certain medicines. A negative genetic result lowers only specific drug-associated risks; it does not prove that every drug is safe or erase a prior SJS/TEN history.",
      "Keep eye, skin, oral, lung, urinary, genital, mental-health, and medication-allergy follow-up even after the skin closes because important scarring and functional problems may emerge later."
    ],
    nclexTraps: [
      "Do not call every medication rash TEN. The dangerous pattern combines skin pain or dusky lesions, epithelial detachment, mucosal disease, systemic illness, and a plausible exposure timeline; obtain emergency specialist assessment rather than diagnosing from one sign.",
      "Do not use total red BSA for spectrum classification. Use the maximum detached or readily detachable epidermis: SJS under 10%, overlap 10% to 30%, and TEN over 30%.",
      "A positive Nikolsky sign supports fragile epidermis but is not specific to TEN. Biopsy and clinical context help exclude other blistering disorders.",
      "SCORTEN is prognostic, not diagnostic. Calculate it early and repeat it, but do not let a low initial score delay drug withdrawal, eye evaluation, transfer, or supportive care.",
      "Do not apply thermal-burn fluid formulas automatically, give routine prophylactic systemic antibiotics, or scrub fragile skin. Replace measured losses, minimize shear, and treat suspected infection based on evidence.",
      "Do not delay culprit withdrawal and supportive care while debating IVIG, corticosteroids, cyclosporine, etanercept, or another systemic therapy. Evidence is uncertain and specialty decisions are individualized.",
      "Skin BSA does not reliably predict eye, genital, or airway severity. Mild-looking skin or an initially reassuring eye examination does not remove the need for serial mucosal assessment.",
      "Never rechallenge a suspected culprit casually. Re-exposure may provoke a faster reaction, so discharge documentation and cross-setting communication are part of life-saving treatment."
    ],
    relatedTopics: [
      "Stevens-Johnson syndrome",
      "SJS/TEN overlap",
      "SCORTEN",
      "Severe cutaneous adverse reactions",
      "DRESS syndrome",
      "Acute generalized exanthematous pustulosis",
      "Erythema multiforme",
      "Lamotrigine",
      "Carbamazepine",
      "Phenytoin",
      "Allopurinol",
      "Trimethoprim-sulfamethoxazole",
      "HLA-B*15:02",
      "HLA-B*58:01",
      "Sepsis",
      "Ocular emergencies",
      "Wound care"
    ],
    aliases: [
      "Lyell syndrome",
      "Lyell's syndrome",
      "epidermal necrolysis",
      "toxic epidermal necrosis",
      "toxic epideral necrolysis",
      "toxic epidermal necrolisis",
      "toxic epiderma necrolysis",
      "toxic epedermal necrolysis",
      "toxic epidermel necrolysis",
      "toxix epidermal necrolysis",
      "Lyel syndrome"
    ],
    abbreviations: ["TEN"],
    ambiguousAbbreviations: ["TEN"],
    commonMisspellings: [
      "toxic epideral necrolysis",
      "toxic epidermal necrolisis",
      "toxic epiderma necrolysis",
      "toxic epedermal necrolysis",
      "toxic epidermel necrolysis",
      "toxix epidermal necrolysis",
      "Lyel syndrome"
    ],
    tags: [
      "TEN",
      "Lyell syndrome",
      "SJS/TEN spectrum",
      "SJS/TEN overlap",
      "severe cutaneous adverse reaction",
      "SCAR",
      "painful peeling rash after medicine",
      "skin sloughing after medication",
      "blisters and mouth sores after lamotrigine",
      "eye pain after new medicine",
      "epidermal detachment",
      "mucosal erosions",
      "SCORTEN",
      "ALDEN",
      "skin failure",
      "dermatologic emergency",
      "medication emergency"
    ],
    sourceKeys: sourceReferences.map((source) => source.key)
  };

  const tenKey = normalize(tenCard.name);
  const existingTen = database.diseases.filter((entry) => normalize(titleOf(entry)) === tenKey);
  let targetTen = existingTen[0] || null;
  if (targetTen) Object.assign(targetTen, tenCard);
  else {
    targetTen = { ...tenCard };
    database.diseases.push(targetTen);
  }

  let removedDuplicateCount = 0;
  for (let index = database.diseases.length - 1; index >= 0; index -= 1) {
    const entry = database.diseases[index];
    if (entry !== targetTen && normalize(titleOf(entry)) === tenKey) {
      database.diseases.splice(index, 1);
      removedDuplicateCount += 1;
    }
  }

  const tenOwnedAliasKeys = new Set([
    "ten",
    "toxic epidermal necrolysis",
    "toxic epidermal necrosis",
    "epidermal necrolysis",
    "lyell syndrome",
    "sjs ten",
    "sjs ten overlap",
    "sjs ten spectrum",
    "stevens johnson syndrome toxic epidermal necrolysis overlap"
  ]);
  const sjsMatches = database.diseases.filter((entry) => normalize(titleOf(entry)) === "stevens johnson syndrome");
  sjsMatches.forEach((entry) => {
    entry.aliases = (Array.isArray(entry.aliases) ? entry.aliases : [])
      .filter((alias) => !tenOwnedAliasKeys.has(normalize(alias)));
    entry.tags = (Array.isArray(entry.tags) ? entry.tags : [])
      .filter((tag) => !tenOwnedAliasKeys.has(normalize(tag)));
    const additions = ["SJS", "Stevens Johnson syndrome", "Stevens-Johnson disease"];
    additions.forEach((alias) => {
      if (!entry.aliases.some((existing) => normalize(existing) === normalize(alias))) entry.aliases.push(alias);
    });
  });

  window.ANI_TEN_WAVE35 = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    applied: true,
    canonicalName: tenCard.name,
    displayName: tenCard.displayName,
    aliases: Object.freeze(tenCard.aliases.slice()),
    sourceKeys: Object.freeze(tenCard.sourceKeys.slice()),
    sourceCount: tenCard.sourceKeys.length,
    sjsMatchCount: sjsMatches.length,
    removedDuplicateCount
  });
})();
