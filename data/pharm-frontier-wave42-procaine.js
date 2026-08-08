/* eslint-disable */
/* Wave 42 pharmacology expansion: canonical standalone procaine study card and identity cleanup. */
(function () {
  "use strict";

  const VERSION = "2026-07-22-wave42-procaine-1";
  const SCHEMA_VERSION = 1;
  const GLOBAL_NAME = "ANI_PHARM_FRONTIER_WAVE42_PROCAINE";
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
  const unique = (values) => Array.from(new Map((values || [])
    .map((value) => clean(value))
    .filter(Boolean)
    .map((value) => [normalize(value), value])).values());
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
      key: "w42-dailymed-procaine-infiltration",
      label: "DailyMed: Procaine hydrochloride injection for local infiltration and peripheral nerve block",
      url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c80c810a-60e0-49bd-139c-95aec3a286fc",
      note: "Product-label anchor for ester local-anesthetic mechanism, plasma cholinesterase hydrolysis, labeled infiltration and peripheral-block context, contraindications, sulfite warning, interactions, administration precautions, and toxicity. The listed NDC status is inactive, so current product availability and labeling must be verified."
    }),
    Object.freeze({
      key: "w42-dailymed-procaine-spinal",
      label: "DailyMed: Procaine hydrochloride injection, spinal product labeling",
      url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=999625d5-3a6b-4753-059a-4f19d04c85a5",
      note: "Separate product-label anchor showing that intrathecal procaine has formulation- and product-specific instructions. It must not be inferred from infiltration-solution labeling or used as a universal route statement."
    }),
    Object.freeze({
      key: "w42-asra-last-checklist",
      label: "American Society of Regional Anesthesia and Pain Medicine: Checklist for Treatment of Local Anesthetic Systemic Toxicity",
      url: "https://asra.com/news-publications/asra-updates/blog-landing/guidelines/2020/11/01/checklist-for-treatment-of-local-anesthetic-systemic-toxicity",
      note: "Specialty-society emergency source for recognition and management of local-anesthetic systemic toxicity, including stopping injection, airway support, seizure treatment, modified resuscitation, and early 20% lipid emulsion by protocol."
    }),
    Object.freeze({
      key: "w42-ncbi-biochemistry-pseudocholinesterase",
      label: "NCBI Bookshelf: Biochemistry, Pseudocholinesterase",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK545284/",
      note: "Supports butyrylcholinesterase biology, BCHE variants, ester local-anesthetic metabolism, and the distinction from synaptic acetylcholinesterase."
    })
  ]);
  const sourceKeys = sourceReferences.map((source) => source.key);

  const procaineCard = {
    name: "Procaine",
    generic: "procaine",
    genericName: "procaine hydrochloride",
    displayName: "Procaine",
    brandExamples: ["Novocain (historical brand name)", "Novocaine (common informal spelling)"],
    aliases: [
      "procaine hydrochloride", "procaine HCl", "Novocain", "Novocaine", "novacaine", "novacain", "Novocain local anesthetic",
      "ester local anesthetic procaine", "short acting ester local anesthetic", "injectable procaine anesthetic",
      "procaine infiltration anesthesia", "procaine peripheral nerve block", "procaine spinal anesthesia",
      "local anesthetic metabolized by pseudocholinesterase", "PABA-forming local anesthetic"
    ],
    abbreviations: ["procaine HCl"],
    commonMisspellings: [
      "procaine hydrocloride", "procain local anesthetic", "procaine hydrochlorid", "procaine anaesthetic",
      "novacaine", "novicane", "novacaine shot", "novacain"
    ],
    entryType: "drug",
    recordType: "medication",
    owner: "pharmacology",
    contentOwner: "Anesthesiology and Local Anesthetic Pharmacology",
    primaryDomain: "Pharmacology",
    clinicalDomain: "Local and regional anesthesia",
    primaryCategory: "Anesthetics & Perioperative Medications",
    primarySystem: "Peripheral nerve and perioperative pharmacology",
    bodySystem: "Nervous system",
    category: "Anesthetics & Perioperative Medications",
    categories: [
      "Local anesthetics", "Ester local anesthetics", "Anesthesiology", "Perioperative medications",
      "Neurologic pharmacology", "Emergency medication safety"
    ],
    class: "Ester-type local anesthetic",
    classCategory: "Local anesthetic - amino ester",
    classPathway: "Voltage-gated sodium-channel blockade; rapid plasma butyrylcholinesterase hydrolysis to para-aminobenzoic acid",
    nclexEssential: true,
    usedToTreat: [
      "Local infiltration anesthesia when a currently available procaine product is labeled and institutionally approved for that use",
      "Peripheral nerve block when the selected product, concentration, technique and clinician credentialing permit it",
      "Intrathecal spinal anesthesia only with a product specifically labeled and formulated for intrathecal use; infiltration solutions are not interchangeable",
      "Short procedures in which a brief ester local anesthetic is clinically appropriate and modern alternatives are unsuitable or unavailable"
    ],
    indications: [
      "Production of local or regional anesthesia by reversible interruption of peripheral nerve conduction",
      "Local tissue infiltration and peripheral nerve block under product-specific labeling",
      "Spinal anesthesia only under separate intrathecal product labeling and specialist technique",
      "Not indicated as an intravenous antiarrhythmic, systemic analgesic, antibiotic, nutritional supplement, anti-aging infusion, or treatment for fatigue"
    ],
    typicalRoutes: [
      "Local infiltration injection with a product labeled for infiltration",
      "Peripheral nerve block with a product labeled for that block and concentration",
      "Intrathecal injection only with a preservative-free formulation specifically labeled for spinal use",
      "Never assume topical, intravenous, epidural, dental, or intrathecal use from the word procaine alone; route is product specific"
    ],
    description: "Procaine is a short-acting amino-ester local anesthetic historically known by the brand name Novocain. It reversibly blocks voltage-gated sodium channels in nerves, preventing the inward sodium current needed to initiate and propagate an action potential. Small myelinated and unmyelinated fibers carrying pain and temperature are often blocked before larger motor fibers, but the sequence varies with concentration, location and technique; local anesthesia is not a guarantee that motor function or all sensation will be preserved. Procaine is rapidly hydrolyzed in plasma by butyrylcholinesterase, also called pseudocholinesterase, to para-aminobenzoic acid (PABA) and diethylaminoethanol. That rapid metabolism helps explain its short duration and why epinephrine was historically added to reduce vascular uptake and prolong local effect. It also creates two distinctive safety links: people with butyrylcholinesterase deficiency can have prolonged exposure, and the PABA metabolite is associated with ester-anesthetic hypersensitivity and can antagonize sulfonamide antibacterial activity. Procaine must remain a standalone medication identity. Penicillin G procaine is a depot antibiotic salt containing penicillin and procaine; its indication, dosing, route, severe-reaction profile and monitoring are not inherited by plain procaine. Procainamide is a class IA antiarrhythmic with an entirely different systemic purpose and toxicity profile. Chloroprocaine is another ester local anesthetic with separate potency, formulation and dosing. Similar spelling does not make these drugs interchangeable.",
    mechanism: "Procaine is a weak base. A fraction is uncharged at physiologic pH and crosses the nerve membrane; inside the axon, protonated drug binds from the cytoplasmic side of voltage-gated sodium channels, with greater affinity for open and inactivated states. Blocking enough channels reduces the rate and amplitude of phase-zero depolarization, raises the threshold for excitation and eventually prevents propagation of the action potential. Rapidly firing, small-diameter fibers are especially susceptible, which helps explain preferential loss of pain before pressure or motor function at clinically appropriate concentrations. The effect is reversible as free drug diffuses away and is hydrolyzed. In inflamed or infected acidic tissue, more procaine remains ionized outside the axon and less membrane-permeable drug reaches the internal binding site; local anesthesia may therefore be slow, incomplete or unreliable. Injection near highly vascular tissue or accidental intravascular administration raises plasma concentration before hydrolysis can protect the patient and can produce local-anesthetic systemic toxicity (LAST). Central nervous system excitation can progress from circumoral numbness, metallic taste, tinnitus, agitation and tremor to seizure, then depression, coma or respiratory arrest. Cardiac sodium-channel blockade and other electrophysiologic effects can cause slowed conduction, hypotension, dysrhythmia and collapse. Epinephrine can reduce systemic uptake and prolong local exposure, but it also adds ischemic and sympathomimetic risk and does not make intravascular injection safe.",
    pharmacokinetics: "Absorption depends primarily on total dose, concentration, injection site vascularity, tissue pH, local blood flow, use of a vasoconstrictor and accidental intravascular delivery. Procaine is relatively short acting because plasma butyrylcholinesterase rapidly hydrolyzes its ester bond. PABA and diethylaminoethanol metabolites are cleared mainly through the kidneys after further handling. Low or atypical butyrylcholinesterase activity can slow hydrolysis; severe liver dysfunction, pregnancy, malnutrition, critical illness, burns, malignancy, kidney disease or cholinesterase-inhibiting exposure can reduce measured activity. Product, dose and technique remain more important than a memorized half-life because regional uptake differs sharply. Placental transfer can occur, and fetal or neonatal clearance and ion trapping may differ during maternal or fetal acidosis. Procaine does not have meaningful topical activity in the older infiltration label and should not be assumed to work through intact skin. Duration from a procaine-containing penicillin depot cannot be used to describe local-anesthetic procaine; that formulation is designed around slow antibiotic release from an intramuscular salt.",
    administrationTiming: [
      "Verify the exact product, concentration, preservative status, route label and intended block before preparation. Procaine infiltration solution and procaine spinal solution are not interchangeable.",
      "Use only clinicians trained in the selected local or regional technique, with oxygen, suction, airway equipment, seizure treatment, lipid emulsion and resuscitation capability immediately available.",
      "Calculate the total milligram dose from concentration and volume, include every procaine-containing syringe, and account for other local anesthetics because systemic toxicity is additive even when agents differ.",
      "Use the lowest effective concentration and dose. Reduce dose or increase caution for older, frail, acutely ill, pregnant, pediatric, cardiac, hepatic or low-butyrylcholinesterase patients according to current product and specialty guidance.",
      "Review allergy to ester local anesthetics, PABA-related compounds, sulfites when the product contains them, and all excipients. A vague Novocaine allergy requires history because epinephrine effects, vasovagal syncope and true hypersensitivity are different.",
      "Assess the injection site for infection, inflammation, vascularity and distorted anatomy. Acidic infected tissue can cause poor block and injection through infected tissue can spread organisms.",
      "Use careful aspiration and incremental injection with repeated verbal and physiologic monitoring. Negative aspiration reduces but does not eliminate intravascular-injection risk because the needle can move or a vessel can collapse.",
      "Allow adequate onset time before beginning the procedure and test sensory effect appropriately. Do not keep repeating large doses simply because acidic tissue or incorrect placement produced an inadequate block.",
      "When epinephrine is included, verify its concentration separately, document the combined product and assess vascular disease, interacting drugs and site-specific ischemic risk under current local-anesthetic guidance.",
      "Monitor continuously or at the intensity appropriate to block depth, dose and patient risk. Keep verbal contact when possible because early tinnitus, metallic taste, circumoral numbness or confusion can precede collapse.",
      "Observe long enough after injection to detect delayed toxicity, block spread, allergic symptoms, falls, urinary retention after neuraxial anesthesia, and return of protective sensation according to route and dose.",
      "Document product, concentration, total milligrams, volume, route, site, laterality, epinephrine concentration if present, aspiration and incremental technique, response, monitoring and any rescue actions."
    ],
    boxedWarning: "No FDA boxed warning is identified in the cited standalone procaine product labels. Absence of a boxed warning does not make administration low risk: unintended intravascular injection, excessive dose, wrong-route use, neuraxial spread, severe hypersensitivity and LAST can rapidly cause seizure, respiratory arrest, hypotension, dysrhythmia or cardiac arrest.",
    boxedWarningSpecificity: "This statement applies only to cited standalone procaine local-anesthetic products. Do not transfer warnings from penicillin G procaine, procainamide, or another anesthetic to procaine, and do not transfer procaine route instructions to those products.",
    contraindications: [
      "Known hypersensitivity to procaine, another structurally related ester local anesthetic, PABA-related metabolites, or a formulation excipient",
      "Use of an infiltration or peripheral-block formulation by the intrathecal, epidural, intravenous, intra-arterial, intraocular or another unlabeled route",
      "Injection through infected or significantly inflamed tissue when it may spread infection or produce unreliable anesthesia, unless a specialist has selected a safer approach",
      "Use without immediately available airway, ventilation, seizure, lipid-emulsion and cardiovascular resuscitation resources appropriate to the dose and block",
      "Unverified total local-anesthetic dose or simultaneous local-anesthetic products whose combined toxicity has not been calculated",
      "A product containing sulfite in a person with serious sulfite hypersensitivity unless the responsible specialist determines the emergency benefit outweighs risk",
      "An anatomic, bleeding, infection, intracranial-pressure or hemodynamic contraindication to neuraxial anesthesia when considering a separately labeled spinal product",
      "Use as a substitute for penicillin G procaine, procainamide, chloroprocaine, intravenous lidocaine or another similarly named but pharmacologically distinct medicine"
    ],
    precautions: [
      "Pseudocholinesterase or butyrylcholinesterase deficiency, pregnancy, severe liver disease, malnutrition, burns, malignancy, critical illness, kidney disease or cholinesterase inhibition may slow ester hydrolysis.",
      "Cardiac conduction disease, low cardiac output, severe valvular disease, shock, hypoxia, acidosis and electrolyte disturbance can lower tolerance for local-anesthetic cardiovascular effects.",
      "Older adults, infants, small children, frail patients and people with severe systemic illness may require lower doses, slower increments and longer observation.",
      "Acidosis and hypercapnia increase the unbound or active fraction and reduce the seizure threshold during toxicity; ventilation and oxygenation are central prevention measures.",
      "Epinephrine-containing solutions add tachycardia, hypertension, dysrhythmia, drug-interaction and local-ischemia concerns. The risk depends on site, concentration, circulation and comorbidity.",
      "A history described as allergy may have been vasovagal syncope, panic, epinephrine palpitations, intravascular injection or LAST. Clarify the phenotype without dismissing a possible true ester or sulfite reaction.",
      "Neurologic disease, preexisting neuropathy or prior nerve injury can complicate baseline assessment and attribution of a postoperative deficit.",
      "An infected or acidic site can resist blockade; escalating dose without reassessing placement, pH and technique can convert an ineffective block into systemic toxicity."
    ],
    adverseEffects: [
      "Expected temporary numbness, sensory loss and sometimes motor weakness in the intended distribution",
      "Injection-site pain, bruising, bleeding, swelling or local tissue irritation",
      "Nausea, dizziness, lightheadedness, anxiety or vasovagal symptoms around the procedure",
      "Headache, back discomfort, urinary retention, hypotension, nausea or post-dural puncture headache in neuraxial contexts",
      "Transient paresthesia or dysesthesia from needle contact, pressure, local trauma or block effect",
      "Tachycardia, tremor, palpitations, anxiety or hypertension when epinephrine is present or inadvertently absorbed rapidly",
      "Allergic rash, urticaria, pruritus, bronchospasm or edema, more plausibly associated with ester/PABA biology or formulation excipients than with amide local anesthetics",
      "Prolonged numbness or weakness when dose, placement, nerve injury or reduced butyrylcholinesterase activity delays recovery"
    ],
    seriousAdverseReactions: [
      "Local-anesthetic systemic toxicity with circumoral numbness, metallic taste, tinnitus, agitation, tremor, seizure, altered consciousness, respiratory arrest, hypotension, conduction slowing, ventricular dysrhythmia or cardiac arrest",
      "Immediate anaphylaxis or severe sulfite-related bronchospasm with airway edema, wheeze, hypotension or shock",
      "High or total spinal block after intrathecal administration, causing rapidly ascending numbness, profound hypotension, bradycardia, respiratory weakness, apnea and loss of consciousness",
      "Direct nerve injury, intraneural injection, hematoma, ischemia, infection, persistent neurologic deficit or cauda equina injury depending on site and technique",
      "Severe local ischemia or tissue necrosis related to vascular injury, excessive vasoconstrictor effect, intra-arterial injection or compromised circulation",
      "Methemoglobinemia is not a defining common procaine toxicity but unexplained cyanosis with an oxygen-saturation gap after local-anesthetic exposure requires evaluation for the actual agent and cause",
      "Fetal or neonatal depression, bradycardia or acid-base disturbance after significant maternal systemic exposure or obstetric neuraxial complications",
      "Medication error from confusing procaine with procainamide, penicillin G procaine, chloroprocaine or a concentration intended for another route"
    ],
    interactions: [
      "Sulfonamide antibacterials: PABA generated from procaine can competitively antagonize the antibacterial action of PABA-antagonist sulfonamides. Verify whether the specific combination is clinically relevant and choose alternatives when appropriate.",
      "Other local anesthetics or class I antiarrhythmics: sodium-channel and systemic toxicities can be additive even when the products are not chemically identical. Count the entire local-anesthetic exposure.",
      "Cholinesterase inhibitors and organophosphates: reduced butyrylcholinesterase activity may slow procaine hydrolysis and prolong exposure. A cholinergic toxidrome is a separate emergency from ordinary procaine metabolism.",
      "Succinylcholine or mivacurium: these also depend on butyrylcholinesterase. A patient with reduced enzyme activity may have prolonged neuromuscular block as well as prolonged ester-anesthetic exposure.",
      "Epinephrine-containing procaine with nonselective beta blockers, tricyclic antidepressants, monoamine oxidase inhibitors, potent inhaled anesthetics, stimulants or other sympathomimetics can change blood pressure or dysrhythmia risk; use product- and patient-specific guidance.",
      "Sedatives, opioids and general anesthetics can mask early neurologic symptoms of LAST and add respiratory depression or hypotension. Monitoring must account for all agents.",
      "Anticoagulants and antiplatelet drugs do not directly change procaine metabolism but alter bleeding and neuraxial or deep-block safety. Follow current procedural anticoagulation guidance.",
      "Neuromuscular blockers can make seizure or toxicity recognition harder and do not provide sedation. Maintain appropriate anesthesia and monitoring."
    ],
    foodSupplementInteractions: [
      "No specific food interaction is central to injected procaine because administration is procedural rather than oral.",
      "Herbal stimulants, high-dose caffeine products and sympathomimetic supplements may add palpitations or blood-pressure effects when epinephrine is included, but this is not a procaine-caffeine combination indication.",
      "Supplements or medicines that affect bleeding may matter for neuraxial or deep peripheral procedures even though they do not alter local anesthetic efficacy directly.",
      "Do not use compounded procaine or supplement products marketed for anti-aging, energy or wellness as if they were equivalent to an approved sterile local-anesthetic product."
    ],
    nursingEssentials: [
      "Perform medication reconciliation by exact name. Confirm whether the order is standalone procaine, penicillin G procaine, procainamide or chloroprocaine before preparing anything.",
      "Verify concentration, total volume and total milligrams independently. Include every syringe and every other local anesthetic given during the encounter because systemic toxicity is additive.",
      "Confirm route-specific formulation, preservative status, site, laterality, block and clinician authorization. Never convert an infiltration product into a spinal product based on concentration alone.",
      "Ask about prior ester local-anesthetic or PABA reactions, sulfite sensitivity, pseudocholinesterase deficiency, prolonged paralysis after succinylcholine, family anesthesia history, liver disease, pregnancy and current sulfonamide therapy.",
      "Obtain baseline neurologic findings, distal perfusion, vital signs, oxygenation and cardiac rhythm at the intensity required for the planned block. Document preexisting numbness or weakness before injection.",
      "Ensure oxygen, suction, bag-mask ventilation, advanced airway equipment, benzodiazepine for seizure treatment, 20% lipid emulsion and the current LAST checklist are immediately accessible before a potentially toxic dose.",
      "During injection, maintain verbal contact when possible and watch for tinnitus, metallic taste, circumoral numbness, agitation, confusion, tremor, seizure, sudden hypotension, bradycardia, conduction change or dysrhythmia.",
      "If LAST is suspected, stop injection, call for help, support airway and oxygenation, treat seizure preferentially with a benzodiazepine, begin 20% lipid emulsion and modified resuscitation according to the current ASRA/local protocol, and avoid large unstructured epinephrine doses.",
      "After neuraxial use, monitor sensory and motor level, blood pressure, heart rate, breathing, consciousness and bladder function. Rapid ascent, arm weakness, dyspnea, bradycardia or hypotension can signal a high spinal emergency.",
      "Protect the anesthetized area from heat, pressure, falls, biting or injury until sensation and motor control return. Give site- and procedure-specific discharge instructions.",
      "Document product and lot when required, concentration, dose in milligrams, volume, route, site, additives, aspiration and incremental injection, monitoring, block effect, adverse symptoms and recovery.",
      "Report prolonged block or toxicity for anesthesia review and durable chart documentation. Arrange evaluation for butyrylcholinesterase deficiency when the pattern and medication history support it."
    ],
    keyLabs: [
      "No routine serum procaine concentration is used to guide ordinary local anesthesia; toxicity is diagnosed clinically and treatment must not wait for a level.",
      "Quantitative plasma butyrylcholinesterase activity and a qualitative dibucaine number may be useful after unexplained prolonged ester-anesthetic exposure or succinylcholine paralysis; the tests answer different questions.",
      "Arterial or venous blood gas, pH, carbon dioxide, oxygenation, glucose, potassium, magnesium, calcium and lactate help identify physiologic contributors during severe LAST or cardiac arrest.",
      "ECG monitoring can reveal PR or QRS prolongation, conduction block, bradycardia or ventricular dysrhythmia during systemic toxicity.",
      "Kidney and liver tests inform vulnerability and recovery but do not replace clinical monitoring or generate a universally safe dose.",
      "Coagulation studies and platelet count may be required before neuraxial or deep block depending on medications, disease and current procedural guidance."
    ],
    requiredMonitoring: [
      "Baseline and serial blood pressure, heart rate, respiratory rate, oxygen saturation, level of consciousness and symptoms",
      "Continuous ECG and ready capnography for high-dose, deep regional, neuraxial, sedated or otherwise high-risk administration according to local policy",
      "Total cumulative local-anesthetic milligrams across all products and injection sites",
      "Frequent aspiration, injection-pressure awareness and incremental dosing during administration; none completely excludes intravascular or intraneural placement",
      "Sensory distribution, motor function, distal perfusion, pain response and return of protective sensation",
      "Signs of LAST during injection and for an observation period appropriate to dose, vascularity, formulation and symptoms",
      "For spinal anesthesia: block height, hemodynamics, ventilation, consciousness, motor recovery and bladder function",
      "Injection-site bleeding, hematoma, infection, ischemia, nerve injury and persistent neurologic symptoms after the expected block",
      "Pregnant patient and fetal status when used in obstetric care, under the current obstetric-anesthesia protocol",
      "Longer observation and anesthesia review when butyrylcholinesterase deficiency or another cause of slowed hydrolysis is suspected"
    ],
    populationRisks: [
      {
        population: "Pregnancy and labor",
        risk: "Procaine can cross the placenta, pregnancy can reduce butyrylcholinesterase activity, and maternal hypotension, hypoxia or systemic toxicity can reduce uteroplacental perfusion. Neuraxial use also has route-specific hemodynamic risks.",
        action: "Use only when the obstetric anesthesia team judges benefit greater than risk; use product-specific dosing, left uterine displacement and maternal-fetal monitoring as indicated, and treat maternal airway or circulation emergencies immediately."
      },
      {
        population: "Lactation",
        risk: "Direct modern lactation data for procaine products may be limited, and exposure depends on dose, site and rapid hydrolysis.",
        action: "Use current product and lactation references rather than assuming safety or requiring unnecessary interruption; coordinate when the infant is premature or medically fragile."
      },
      {
        population: "Pediatrics",
        risk: "Small mass, immature physiology, communication limits and dosing errors increase LAST risk; infants may show toxicity without reporting early auditory or oral symptoms.",
        action: "Use weight-based specialist dosing and concentration, calculate all local anesthetics, monitor closely and have pediatric airway and lipid-rescue resources ready."
      },
      {
        population: "Older or frail adults",
        risk: "Reduced cardiovascular reserve, conduction disease, lower muscle mass, organ dysfunction and polypharmacy reduce tolerance for hypotension and systemic toxicity.",
        action: "Use the lowest effective dose in increments, review interactions, monitor longer and consider alternatives with more contemporary evidence or predictable handling."
      },
      {
        population: "Butyrylcholinesterase deficiency",
        risk: "Inherited or acquired low enzyme activity can delay procaine hydrolysis and may also predict prolonged succinylcholine or mivacurium paralysis.",
        action: "Avoid or reduce ester local-anesthetic exposure when appropriate, consult anesthesia, select an amide alternative when suitable, and document the enzyme risk and drug-specific plan."
      },
      {
        population: "Severe liver disease, malnutrition, burns, malignancy or critical illness",
        risk: "These states can reduce plasma cholinesterase activity or physiologic reserve and can increase the consequence of hypotension, acidosis or toxicity.",
        action: "Reassess whether procaine is the best agent, reduce exposure, correct reversible physiology and use enhanced monitoring."
      },
      {
        population: "Cardiovascular disease or shock",
        risk: "Conduction disease, poor cardiac output, acidosis and hypoxia reduce tolerance for sodium-channel blockade and epinephrine effects.",
        action: "Avoid elective administration during uncontrolled instability, use continuous monitoring and resuscitation readiness, and choose dose and vasoconstrictor through specialist judgment."
      },
      {
        population: "Sulfite-sensitive asthma",
        risk: "Some epinephrine-containing or multidose formulations may contain sulfites capable of provoking severe bronchospasm or hypersensitivity.",
        action: "Inspect exact excipients and choose a sulfite-free alternative when required; do not treat the generic name as proof that every formulation contains or lacks sulfite."
      }
    ],
    redFlags: [
      "Circumoral numbness, metallic taste, tinnitus, auditory change, visual disturbance, agitation, confusion, tremor or sudden drowsiness during or soon after injection",
      "Seizure, loss of consciousness, apnea, severe hypoventilation or inability to protect the airway",
      "Sudden hypotension, bradycardia, conduction delay, wide QRS, ventricular dysrhythmia or cardiac arrest",
      "Hives with wheeze, stridor, facial or tongue swelling, hypotension or shock suggesting anaphylaxis",
      "Rapidly ascending numbness, arm weakness, dyspnea, bradycardia or profound hypotension after spinal administration suggesting high or total spinal block",
      "Severe injection pain, high resistance, electric-shock sensation, persistent weakness, new sensory loss, expanding hematoma, absent pulse or ischemic discoloration",
      "Block lasting much longer than expected, especially with prior succinylcholine apnea or family anesthesia history, suggesting butyrylcholinesterase deficiency or nerve injury",
      "An order or vial whose name could be penicillin G procaine, procainamide, chloroprocaine or a different-route procaine product; stop and clarify before administration"
    ],
    overdoseToxicity: "Procaine overdose usually reflects excessive total dose, rapid absorption from a vascular site, accidental intravascular injection, reduced hydrolysis or additive exposure to another local anesthetic. Treat suspected LAST as a time-critical clinical syndrome; a drug level is neither routinely available nor required. Stop injecting and call for the resuscitation team. Secure oxygenation and ventilation early because hypoxia, hypercapnia and acidosis worsen toxicity. Treat seizures preferentially with benzodiazepines while avoiding large sedative doses that collapse circulation. Follow the current ASRA and local LAST checklist for early 20% lipid-emulsion therapy, modified ACLS, epinephrine dose limits and avoidance of additional local anesthetics; prolonged resuscitation may be successful because toxicity is reversible. For cardiac arrest refractory to standard measures, involve extracorporeal support capability early where available. After stabilization, observe for recurrence according to the event, document the exact total dose and route, investigate product or technique error, and do not attribute every collapse to vasovagal syncope.",
    antidoteReversal: "There is no receptor-specific antidote that removes procaine from sodium channels. The emergency rescue strategy for severe LAST is airway and ventilation support, seizure control, high-quality modified resuscitation and intravenous 20% lipid emulsion using the current ASRA/local dosing checklist. Lipid emulsion is a rescue treatment, not premedication and not permission to exceed safe dosing. Anaphylaxis requires epinephrine and the anaphylaxis pathway; high spinal block requires ventilatory and hemodynamic support; these mechanisms can coexist but are not treated identically. Pseudocholinesterase testing does not reverse toxicity.",
    patientEducation: [
      "Procaine temporarily blocks nerve signals in the treated area. Numbness does not mean the underlying injury or procedure pain source has been cured.",
      "Protect the numb area from heat, ice, pressure, biting, chewing injury, driving, falls and weight bearing until sensation and strength return as instructed.",
      "Tell the clinician immediately about ringing in the ears, metallic taste, numbness around the mouth, unusual dizziness, confusion, shaking, trouble breathing, palpitations or sudden weakness. These can be early toxicity signs.",
      "Report hives, wheeze, facial swelling or faintness immediately. A prior reaction called Novocaine allergy may have several causes, so describe exactly what happened rather than omitting the history.",
      "Procaine, penicillin G procaine and procainamide are different medicines. Keep the exact name and reason in your medication record.",
      "Tell procedural teams about pseudocholinesterase deficiency, prolonged paralysis after succinylcholine, liver disease, pregnancy, sulfite sensitivity, sulfonamide antibiotics and every local anesthetic already received that day.",
      "Seek urgent care for a seizure, trouble breathing, fainting, chest symptoms, persistent or worsening weakness, loss of bladder or bowel control after spinal anesthesia, severe back pain, fever at the site or a cold discolored limb.",
      "Product availability and uses have changed over time. Historical Novocain experience does not mean any current injection, compounded wellness product or similarly named drug is equivalent."
    ],
    evidenceLimitations: [
      "Standalone procaine is an older local anesthetic with limited modern comparative evidence and variable current U.S. product availability. The cited DailyMed records include inactive NDC or historical product context.",
      "Infiltration, peripheral-block and spinal labels describe different formulations. A route or concentration from one product cannot be generalized to another.",
      "Maximum dose depends on product, concentration, site vascularity, epinephrine, patient size, comorbidity, other local anesthetics and local policy; this educational card intentionally does not state one universal maximum.",
      "True ester-local-anesthetic allergy is uncommon and retrospective histories are often nonspecific, but PABA and sulfite biology make careful evaluation important. Skin or challenge testing requires allergy expertise.",
      "LAST can begin atypically or under sedation without classic early neurologic symptoms. A checklist supports response but does not replace trained resuscitation and current specialty guidance.",
      "Data in pregnancy, lactation, neonates and severe butyrylcholinesterase deficiency are limited; use specialist and current product guidance.",
      "This card does not endorse compounded intravenous procaine, procaine supplements, anti-aging protocols or off-label wellness use."
    ],
    nclexTraps: [
      "Procaine is an ester local anesthetic; it is not procainamide, the class IA antiarrhythmic.",
      "Penicillin G procaine is a depot antibiotic combination and must not inherit standalone procaine indications, routes or dosing.",
      "Chloroprocaine is a separate ester local anesthetic. Similar spelling does not make concentrations or routes interchangeable.",
      "Procaine is hydrolyzed by plasma butyrylcholinesterase, not by synaptic acetylcholinesterase. Deficiency may prolong exposure.",
      "Acidic infected tissue reduces the uncharged fraction crossing the nerve membrane, so repeating dose without reassessing placement can raise toxicity without fixing the block.",
      "Negative aspiration does not prove the needle is extravascular. Inject incrementally and monitor continuously.",
      "LAST may start with tinnitus, metallic taste or circumoral numbness and progress to seizure or cardiac collapse; stop injection and use the current lipid-rescue checklist.",
      "Lipid emulsion is emergency rescue, not a traditional antidote that permits unsafe dosing.",
      "An infiltration solution is not automatically safe for spinal, epidural, intravenous, topical or dental use. The exact product label controls.",
      "PABA can antagonize sulfonamide antibacterial action, and ester/PABA or sulfite hypersensitivity must be distinguished from epinephrine palpitations or vasovagal syncope."
    ],
    relatedTopics: [
      "Local anesthetic systemic toxicity", "Pseudocholinesterase deficiency", "Dibucaine number",
      "Succinylcholine", "Chloroprocaine", "Lidocaine", "Bupivacaine", "Ropivacaine",
      "Anaphylaxis", "Procainamide"
    ],
    relatedConcepts: [
      "use-dependent sodium-channel block", "action-potential propagation", "weak-base ionization", "infected tissue pH",
      "plasma ester hydrolysis", "PABA metabolite", "incremental injection", "intravascular injection",
      "additive local-anesthetic toxicity", "LAST checklist", "20% lipid emulsion", "route-specific formulation"
    ],
    regulatoryStatus: "Standalone procaine local-anesthetic labeling exists in DailyMed, but cited U.S. products include inactive NDC or historical labeling and current commercial availability may be limited. Infiltration/peripheral-block and spinal products have separate formulation and route instructions. Verify an actively marketed product, current full prescribing information, local formulary and institutional policy before use.",
    sourceKeys,
    sourceNote: "Original mechanism-first educational synthesis grounded in standalone procaine DailyMed product labeling, the ASRA LAST emergency checklist, and NCBI butyrylcholinesterase biochemistry. It deliberately excludes penicillin G procaine and procainamide content and does not provide a universal dose or route conversion.",
    sourceMetadata: sourceReferences.map((source) => ({ key: source.key, label: source.label, url: source.url })),
    searchTerms: [
      "procaine", "procaine hydrochloride", "Novocain", "Novocaine", "novacaine", "ester local anesthetic",
      "short acting local anesthetic", "procaine nerve block", "procaine infiltration", "procaine spinal",
      "procaine sodium channel blocker", "procaine PABA", "procaine pseudocholinesterase metabolism",
      "procaine allergy", "Novocaine allergy", "procaine toxicity", "local anesthetic systemic toxicity",
      "procaine lipid emulsion", "why does local anesthetic fail in infection", "difference between procaine and procainamide",
      "difference between procaine and penicillin G procaine"
    ],
    tags: [
      "frontier-wave42", "procaine", "Novocain", "amino ester", "local anesthetic", "sodium channel",
      "butyrylcholinesterase", "PABA", "infiltration", "peripheral nerve block", "spinal anesthesia",
      "LAST", "lipid emulsion", "anesthesiology", "medication safety", "mechanism first"
    ],
    confidenceTier: "Curated full study card - standalone product labels and specialty emergency guidance reconciled",
    studentFacing: true,
    hidden: false,
    retired: false,
    expandedIndex: false,
    clinicalFrontierWave42ProcaineRevision: VERSION
  };

  const application = {
    attemptedTarget: "Procaine",
    appliedTarget: "",
    missingTargets: [],
    errors: [],
    sourceReferencesAddedOrUpdated: 0,
    pharmacology: {
      databaseGlobal: "",
      collectionName: "",
      canonicalName: "Procaine",
      identityMatchesBefore: 0,
      selectedIndexBeforeMerge: -1,
      removedDuplicateCount: 0,
      canonicalCountAfter: 0,
      duplicateCreated: false,
      discardedUnsafeInheritedAliasCount: 0,
      discardedUnsafeInheritedBrandCount: 0,
      discardedUnsafeInheritedSearchTermCount: 0,
      preservedLegacyIdentifierCount: 0,
      runtimeOwner: "",
      runtimeType: "",
      runtimeCategory: ""
    },
    classOwnerCleanup: {
      inspectedTitles: ["Local anesthetic drugs", "Local anesthetics"],
      matchingRecords: 0,
      removedBareProcaineIdentityCount: 0,
      fieldsChanged: []
    }
  };

  const pharmCandidates = [
    { globalName: "ANI_PHARM_DATABASE", value: window.ANI_PHARM_DATABASE },
    { globalName: "ANI_PHARMACOLOGY_DATABASE", value: window.ANI_PHARMACOLOGY_DATABASE }
  ];
  let resolvedPharm = null;
  for (const candidate of pharmCandidates) {
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

  const unsafeExactIdentities = new Set([
    "caffeine", "choline", "dexpanthenol", "di isopropylammonium"
  ].map(normalize));
  const unsafeProcaineIdentity = (value) => {
    const key = normalize(value);
    if (!key) return false;
    if (unsafeExactIdentities.has(key)) return true;
    return /(^| )(caffeine|choline|dexpanthenol|di isopropylammonium|penicillin|procainamide|chloroprocaine)( |$)/.test(key);
  };
  const safeInherited = (values, counterName) => {
    const safe = [];
    unique(values).forEach((value) => {
      if (unsafeProcaineIdentity(value)) {
        application.pharmacology[counterName] += 1;
      } else {
        safe.push(value);
      }
    });
    return safe;
  };

  if (!resolvedPharm) {
    application.missingTargets.push("Procaine (installed pharmacology collection unavailable)");
  } else {
    try {
      const records = resolvedPharm.records;
      const canonicalKey = normalize(procaineCard.name);
      const matches = records
        .map((record, index) => ({ record, index }))
        .filter(({ record }) => medicationIdentityKeys(record).includes(canonicalKey));
      application.pharmacology.databaseGlobal = resolvedPharm.globalName;
      application.pharmacology.collectionName = resolvedPharm.collectionName;
      application.pharmacology.identityMatchesBefore = matches.length;

      const richnessScore = ({ record, index }) => {
        let score = index / Math.max(records.length, 1);
        if (normalize(record && record.name) === canonicalKey) score += 100;
        if (normalize(record && record.generic) === canonicalKey) score += 40;
        if (normalize(record && record.displayName) === canonicalKey) score += 20;
        score += clean(record && record.description).length / 200;
        score += Array.isArray(record && record.nursingEssentials) ? record.nursingEssentials.length : 0;
        return score;
      };
      const selected = matches.length
        ? matches.slice().sort((left, right) => richnessScore(right) - richnessScore(left))[0]
        : { record: {}, index: records.length };
      const target = selected.record;
      application.pharmacology.selectedIndexBeforeMerge = selected.index;

      const inheritedAliases = safeInherited(
        matches.flatMap(({ record }) => [
          ...(Array.isArray(record.aliases) ? record.aliases : []),
          ...(Array.isArray(record.commonMisspellings) ? record.commonMisspellings : [])
        ]),
        "discardedUnsafeInheritedAliasCount"
      );
      const inheritedBrands = safeInherited(
        matches.flatMap(({ record }) => Array.isArray(record.brandExamples) ? record.brandExamples : []),
        "discardedUnsafeInheritedBrandCount"
      );
      const inheritedSearchTerms = safeInherited(
        matches.flatMap(({ record }) => Array.isArray(record.searchTerms) ? record.searchTerms : []),
        "discardedUnsafeInheritedSearchTermCount"
      );
      const inheritedTags = matches.flatMap(({ record }) => Array.isArray(record.tags) ? record.tags : []);
      const identityFields = ["id", "key", "slug", "entryId", "uuid"];
      const inheritedIdentifiers = unique(matches.flatMap(({ record }) => identityFields
        .filter((field) => record && record[field] !== undefined && record[field] !== null && clean(record[field]))
        .map((field) => field + ":" + clean(record[field]))));
      application.pharmacology.preservedLegacyIdentifierCount = inheritedIdentifiers.length;

      Object.assign(target, procaineCard, {
        aliases: unique([...inheritedAliases, ...procaineCard.aliases])
          .filter((value) => normalize(value) !== canonicalKey && !unsafeProcaineIdentity(value)),
        brandExamples: unique([...inheritedBrands, ...procaineCard.brandExamples])
          .filter((value) => !unsafeProcaineIdentity(value)),
        searchTerms: unique([...inheritedSearchTerms, ...procaineCard.searchTerms])
          .filter((value) => !unsafeProcaineIdentity(value)),
        // Do not inherit unresolved or combination-product link labels from the
        // legacy record; every related topic here must open a bundled card.
        relatedTopics: unique(procaineCard.relatedTopics),
        tags: unique([...inheritedTags, ...procaineCard.tags])
          .filter((value) => !/generated-placeholder|recognition.only|verify-label|hidden-combination-product/i.test(clean(value))),
        legacyIdentifiers: unique([...(target.legacyIdentifiers || []), ...inheritedIdentifiers])
      });
      if (!matches.length) records.push(target);

      for (let index = records.length - 1; index >= 0; index -= 1) {
        const record = records[index];
        if (record !== target && medicationIdentityKeys(record).includes(canonicalKey)) {
          records.splice(index, 1);
          application.pharmacology.removedDuplicateCount += 1;
        }
      }

      const classOwnerTitles = new Set(application.classOwnerCleanup.inspectedTitles.map(normalize));
      const identityArrayFields = ["aliases", "abbreviations", "commonMisspellings", "searchTerms"];
      records.forEach((record) => {
        if (record === target || !classOwnerTitles.has(normalize(titleOf(record)))) return;
        application.classOwnerCleanup.matchingRecords += 1;
        identityArrayFields.forEach((field) => {
          if (!Array.isArray(record[field])) return;
          const before = record[field].length;
          record[field] = unique(record[field].filter((value) => normalize(value) !== canonicalKey));
          const removed = before - record[field].length;
          if (removed) {
            application.classOwnerCleanup.removedBareProcaineIdentityCount += removed;
            application.classOwnerCleanup.fieldsChanged.push(titleOf(record) + "." + field);
          }
        });
        record.clinicalFrontierWave42ProcaineOwnershipRevision = VERSION;
      });
      application.classOwnerCleanup.fieldsChanged = unique(application.classOwnerCleanup.fieldsChanged);

      if (!Array.isArray(resolvedPharm.database.sourceReferences)) resolvedPharm.database.sourceReferences = [];
      const sourceMap = new Map(resolvedPharm.database.sourceReferences
        .map((source) => [clean(source && (source.key || source.id)), source])
        .filter(([key]) => key));
      sourceReferences.forEach((source) => sourceMap.set(source.key, { ...source }));
      resolvedPharm.database.sourceReferences = Array.from(sourceMap.values());
      application.sourceReferencesAddedOrUpdated = sourceReferences.length;

      application.pharmacology.canonicalCountAfter = records
        .filter((record) => medicationIdentityKeys(record).includes(canonicalKey)).length;
      application.pharmacology.duplicateCreated = application.pharmacology.canonicalCountAfter > 1;
      application.pharmacology.runtimeOwner = target.owner;
      application.pharmacology.runtimeType = target.entryType;
      application.pharmacology.runtimeCategory = target.category;
      application.appliedTarget = procaineCard.name;

      resolvedPharm.database.componentVersions = {
        ...(resolvedPharm.database.componentVersions || {}),
        wave42Procaine: VERSION
      };
      resolvedPharm.database.latestExtensionVersion = VERSION;
      if (resolvedPharm.globalName === "ANI_PHARM_DATABASE") window.ANI_PHARM_DATABASE = resolvedPharm.database;
      if (resolvedPharm.globalName === "ANI_PHARMACOLOGY_DATABASE") window.ANI_PHARMACOLOGY_DATABASE = resolvedPharm.database;
    } catch (error) {
      application.errors.push("Procaine merge: " + clean(error && error.message || error || "Unknown error"));
    }
  }

  const applied = application.appliedTarget === procaineCard.name
    && !application.errors.length
    && !application.missingTargets.length
    && !application.pharmacology.duplicateCreated
    && application.pharmacology.canonicalCountAfter === 1;

  window[GLOBAL_NAME] = Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    version: VERSION,
    applied,
    targetStrategy: "Patch the richest exact Procaine medication identity, discard unsafe aliases inherited from unrelated caffeine, choline, dexpanthenol, di-isopropylammonium, penicillin, procainamide, or chloroprocaine records, remove exact duplicate Procaine owners, and remove only the bare Procaine identity from a broad Local anesthetic drugs class card while preserving educational cross-links.",
    canonicalTopic: Object.freeze({
      name: "Procaine",
      owner: "pharmacology",
      type: "drug",
      category: "Anesthetics & Perioperative Medications"
    }),
    sourceCount: sourceReferences.length,
    sourceKeys: Object.freeze(sourceKeys.slice()),
    application
  });
}());
