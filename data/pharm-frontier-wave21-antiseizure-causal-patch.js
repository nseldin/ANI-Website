/* eslint-disable */
/* Antiseizure pharmacology, emergency sequencing, and linked causal physiology. */
(function () {
  window.ANI_PHARM_DATABASE = window.ANI_PHARM_DATABASE || {};
  window.ANI_PATHOLOGY_DATABASE = window.ANI_PATHOLOGY_DATABASE || {};
  const db = window.ANI_PHARM_DATABASE;
  const pathology = window.ANI_PATHOLOGY_DATABASE;
  db.drugs = Array.isArray(db.drugs) ? db.drugs : [];
  pathology.diseases = Array.isArray(pathology.diseases) ? pathology.diseases : [];

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
    ...card,
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
    whyClosureRevision: "2026-07-17-antiseizure-causal"
  });

  const drugCard = (card) => ({
    ...card,
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
    whyClosureRevision: "2026-07-17-antiseizure-causal"
  });

  const classCards = [
    classCard({
      name: "Antiseizure medication mechanism and seizure-type map",
      aliases: [
        "antiepileptic drug mechanism map", "anticonvulsant class comparison", "seizure medication classes",
        "which seizure drug for which seizure", "ASM mechanism map", "AED mechanism comparison"
      ],
      class: "Mechanism- and seizure-type-based comparison of antiseizure medications",
      classPathway: ["Neurologic pharmacology", "Antiseizure medications", "Seizure network and drug-target selection"],
      classExampleNames: ["Valproic acid", "Phenytoin", "Fosphenytoin", "Levetiracetam", "Carbamazepine", "Topiramate", "Ethosuximide", "Lacosamide", "Perampanel", "Lamotrigine"],
      usedToTreat: "This map organizes antiseizure medications by the abnormal firing pattern they suppress and the seizure types they can help or aggravate. It is used to understand why a drug that controls focal tonic-clonic spread may fail in absence epilepsy, why broad-spectrum drugs cover several generalized patterns, and why patient factors can outweigh a superficially attractive mechanism.",
      description: "Antiseizure medications reduce pathologic synchronization without simply turning the brain off. Sodium-channel drugs limit sustained high-frequency firing; SV2A ligands alter calcium-dependent vesicle release; GABA-enhancing drugs strengthen inhibition; AMPA antagonism reduces fast glutamate excitation; and T-type calcium-current suppression disrupts the thalamocortical rhythm of typical absence seizures. Mechanism predicts tendencies, not an automatic prescription. Seizure classification, electroclinical syndrome, age, pregnancy potential, organ function, interactions, mood effects, urgency, and comorbidity determine the actual choice. The crucial distinction is narrow versus broad spectrum: carbamazepine and phenytoin are strong focal-seizure drugs but can fail to control or aggravate absence or myoclonic patterns, while valproate, levetiracetam, lamotrigine, and topiramate cover multiple seizure types with very different safety costs.",
      mechanism: "A seizure emerges when excitatory networks recruit enough neighboring neurons to fire synchronously and inhibitory restraint cannot contain the discharge. Use-dependent sodium-channel blockers such as phenytoin and carbamazepine bind channels more avidly during rapid repeated depolarization, so ordinary low-frequency signaling is relatively spared while seizure-rate firing is suppressed. Lacosamide favors slow sodium-channel inactivation, reducing the pool of channels available during sustained depolarization. Levetiracetam binds presynaptic SV2A and modulates vesicle release; perampanel noncompetitively blocks postsynaptic AMPA receptors; topiramate combines sodium-channel, GABA-A, AMPA/kainate, and carbonic-anhydrase effects; ethosuximide reduces thalamic T-type calcium currents that sustain 3-Hz spike-wave oscillation; and valproate combines GABA, sodium-channel, and T-type effects. Because generalized epilepsies are network syndromes rather than one receptor defect, a broad mechanism can help several patterns but also creates broader toxicity.",
      boxedWarning: "There is no single class boxed warning because risk is drug specific. Valproate carries boxed hepatic, fetal, and pancreatitis warnings; carbamazepine carries boxed serious skin-reaction and marrow-failure warnings; perampanel carries a boxed psychiatric-behavioral warning; and rapid IV phenytoin or fosphenytoin carries boxed cardiovascular risk. Treating all antiseizure drugs as interchangeable hides the very warnings that determine safe selection.",
      adverseEffects: [
        "Dizziness, diplopia, ataxia, somnolence, and cognitive slowing occur when therapeutic suppression spreads into normal cerebellar or cortical signaling, so gait and mental-status change can be a dose clue rather than a new neurologic disease.",
        "Rash ranges from benign eruption to SJS/TEN or DRESS because aromatic antiseizure drugs can trigger HLA-associated or multisystem immune reactions; fever, mucosal injury, facial edema, lymphadenopathy, or organ dysfunction requires urgent assessment.",
        "Mood and behavior can worsen because synaptic targets also participate in emotional regulation; levetiracetam may cause irritability or aggression, while perampanel can cause severe hostility or homicidal ideation.",
        "Pregnancy risk differs sharply because valproate has high structural and neurodevelopmental toxicity, while pregnancy also changes clearance of several alternatives and can cause breakthrough seizures if levels fall."
      ],
      contraindications: [
        "Do not choose a drug before classifying the seizure pattern because carbamazepine or phenytoin can aggravate some absence or myoclonic generalized epilepsies while ethosuximide treats absence seizures but does not protect against generalized tonic-clonic seizures.",
        "Do not stop chronic therapy abruptly unless a life-threatening reaction requires immediate withdrawal because sudden loss of network suppression can increase seizure frequency or precipitate status epilepticus.",
        "Do not treat one therapeutic range as universal because total concentration, free concentration, indication, timing, albumin, organ function, interactions, and the patient's clinical response change interpretation."
      ],
      nursingEssentials: [
        "Document the actual event type, duration, recovery, triggers, missed doses, rescue treatment, and injury because 'seizure' alone does not distinguish focal, generalized, absence, myoclonic, nonepileptic, or acute symptomatic events.",
        "Review formulation and schedule at every transition because extended-release, delayed-release, liquid, prodrug, and phenytoin-equivalent products can look similar while delivering different peaks or requiring different calculations.",
        "Escalate a seizure lasting 5 minutes, repeated seizures without recovery, respiratory compromise, pregnancy, injury, or first seizure because prolonged activity becomes harder to terminate and creates systemic and neuronal injury."
      ],
      interactions: [
        "Carbamazepine and phenytoin induce hepatic enzymes, lowering many contraceptive, anticoagulant, immunosuppressant, antiviral, psychiatric, and antiseizure drug concentrations because metabolism accelerates.",
        "Valproate inhibits lamotrigine glucuronidation and increases serious-rash risk because lamotrigine exposure rises, so the starting dose and titration must be substantially lower and slower.",
        "Multiple sodium-channel blockers or sedating agents can add dizziness, diplopia, ataxia, conduction slowing, or respiratory impairment because their physiologic effects converge even when their concentrations do not interact."
      ],
      keyLabs: [
        "Use targeted levels for phenytoin, valproate, carbamazepine, and ethosuximide when response, adherence, toxicity, pregnancy, organ dysfunction, or an interaction makes concentration informative because routine numbers without a clinical question can mislead.",
        "Check a free phenytoin or valproate concentration when albumin is low, renal failure is present, pregnancy changes binding, or a displacement interaction is likely because the active unbound fraction may be toxic while the total level appears ordinary.",
        "Match CBC, liver tests, sodium, bicarbonate, ammonia, renal function, pregnancy review, ECG, and HLA testing to the chosen drug because each detects a different mechanism-linked hazard."
      ],
      nclexTraps: [
        "Absence seizure is not a small focal seizure: its 3-Hz thalamocortical physiology explains why ethosuximide works and why carbamazepine or phenytoin may be poor choices.",
        "A medication that stops visible convulsions does not prove electrographic status has ended because paralysis, sedation, or a postictal state can conceal ongoing nonconvulsive seizure activity.",
        "The newest drug is not automatically safest because low interaction burden may trade against behavioral, cardiac, renal, teratogenic, or cost limitations."
      ],
      populationRisks: populationRisks(
        "Seizure syndrome, weight-based dosing, development, behavior, school performance, and formulation accuracy matter because pediatric epilepsy patterns and clearance differ from adult disease.",
        "Falls, cognitive effects, renal decline, hypoalbuminemia, polypharmacy, and conduction disease increase toxicity because both exposure and pharmacodynamic sensitivity change with age.",
        "Preconception planning is essential because uncontrolled seizures and abrupt withdrawal are dangerous, while fetal risk and pregnancy-driven clearance changes differ substantially among drugs."
      ),
      sourceNote: "Current U.S. product labels plus American Epilepsy Society convulsive status epilepticus guidance.",
      tags: ["frontier-wave21", "antiseizure", "antiepileptic", "anticonvulsant", "seizure type", "mechanism map", "strict why closure"]
    }),

    classCard({
      name: "Status epilepticus medication sequence and why timing matters",
      aliases: [
        "status epilepticus drug sequence", "benzodiazepine first status", "second line status epilepticus",
        "levetiracetam fosphenytoin valproate comparison", "ESETT trial", "seizure over five minutes treatment"
      ],
      class: "Time-critical convulsive status epilepticus stabilization and medication pathway",
      classPathway: ["Neurologic emergency", "Convulsive status epilepticus", "Rapid GABAergic termination followed by durable seizure suppression"],
      classExampleNames: ["Lorazepam", "Midazolam", "Diazepam", "Levetiracetam", "Fosphenytoin", "Valproic acid"],
      usedToTreat: "This pathway treats a convulsive seizure lasting about 5 minutes or recurrent convulsions without recovery, when spontaneous termination is becoming less likely. It explains why a rapid benzodiazepine is given first, why a longer-acting antiseizure load follows if convulsions persist, and why refractory cases require airway planning, continuous EEG, and anesthetic-level treatment rather than repeated delays.",
      description: "Convulsive status epilepticus is a clock-driven emergency in which a benzodiazepine rapidly enhances GABA-A inhibition first and a longer-acting antiseizure load follows when convulsions persist. Stabilization begins immediately, but antiseizure treatment should not wait beyond the 5-minute threshold because prolonged firing internalizes inhibitory GABA-A receptors, recruits excitatory signaling, causes lactic acidosis and hyperthermia, and becomes progressively harder to stop. A benzodiazepine is first because it rapidly increases GABA-A chloride-channel opening at available receptors. Levetiracetam, fosphenytoin, or valproate then supplies more durable network suppression through a different mechanism. The ESETT randomized trial found seizure cessation with improving responsiveness by 60 minutes in roughly 45% to 47% of benzodiazepine-refractory cases for all three, so patient-specific contraindications and local protocol matter more than claiming one universal winner.",
      mechanism: "During the first minutes, synchronized excitation raises oxygen and glucose demand while tonic-clonic muscle work impairs ventilation and produces lactate, heat, potassium shifts, rhabdomyolysis, and aspiration risk. Benzodiazepines allosterically enhance GABA-A receptor signaling and can terminate firing quickly when an adequate full dose reaches the brain. As status continues, surface GABA-A receptors decline and NMDA/AMPA excitatory signaling becomes more prominent, explaining why late small benzodiazepine fragments work poorly and why respiratory depression is often driven by untreated status as well as medication. A second agent then stabilizes sodium channels, synaptic vesicle release, or GABA-related pathways after the short-acting rescue effect fades. Failure after an adequate benzodiazepine and second-line load suggests refractory status, where continuous EEG and anesthetic infusions may be needed because visible movement no longer reliably reports cortical seizure activity.",
      boxedWarning: "This is an emergency pathway rather than one product label. IV fosphenytoin and phenytoin carry boxed cardiovascular warnings because rapid infusion can cause severe hypotension, bradyarrhythmia, heart block, ventricular arrhythmia, or death. Benzodiazepines can depress ventilation, but withholding an adequate first dose can prolong status and increase respiratory and neurologic injury; airway readiness and prompt treatment must occur together.",
      adverseEffects: [
        "Benzodiazepines can cause somnolence, hypoventilation, apnea, and hypotension because enhanced GABA-A signaling suppresses respiratory and arousal networks, so oxygenation, ventilation, suction, and assisted-airway capability must be ready.",
        "Fosphenytoin can cause hypotension and dysrhythmia because its active phenytoin affects cardiac sodium channels, especially at excessive infusion rates; continuous ECG and blood-pressure monitoring are required.",
        "Valproate can cause hepatic, mitochondrial, pancreatic, platelet, and ammonia toxicity because its metabolism and urea-cycle effects extend beyond seizure networks; avoid it when those risks are prohibitive.",
        "Levetiracetam has fewer immediate hemodynamic interactions but can cause somnolence or behavioral toxicity because SV2A modulation affects broader synaptic release."
      ],
      contraindications: [
        "Do not delay bedside glucose testing and correction because hypoglycemia can cause ongoing seizure activity that antiseizure medication cannot solve by itself.",
        "Avoid fosphenytoin when severe conduction disease or phenytoin hypersensitivity makes its cardiac or immune risk unacceptable because the prodrug becomes phenytoin in vivo.",
        "Avoid valproate in significant hepatic disease, POLG-related mitochondrial disease, urea-cycle disorder, or pregnancy when safer effective alternatives exist because its catastrophic toxicities arise from those vulnerabilities.",
        "Do not mistake cessation of motor activity for recovery when the patient remains unresponsive because nonconvulsive status, medication sedation, and postictal suppression require different next steps and often EEG."
      ],
      nursingEssentials: [
        "Time and describe the seizure from the first observed abnormal activity because treatment phase, escalation, and documentation depend on duration rather than an impression that it felt long.",
        "During stabilization, protect the patient from injury, position and suction as feasible, support oxygenation and ventilation, establish access, check glucose, send trigger-directed labs, and avoid placing anything in the mouth because airway support and reversible-cause treatment occur alongside medication.",
        "Use institutional weight-based protocols and verify maximum doses because underdosing leaves receptors untreated while repeated small fragments create delay without reliable seizure termination.",
        "After visible convulsions stop, trend responsiveness, pupils, respirations, blood pressure, temperature, glucose, electrolytes, pregnancy status when relevant, and recurrence because the emergency is not over at the last jerk."
      ],
      interactions: [
        "Opioids, alcohol, sedatives, and anesthetics add respiratory and hemodynamic depression to benzodiazepines because they suppress overlapping brainstem and vascular pathways.",
        "Fosphenytoin/phenytoin induces CYP enzymes after ongoing exposure and is highly protein bound, so later maintenance therapy can destabilize anticoagulants, contraceptives, antiarrhythmics, and other antiseizure drugs.",
        "Carbapenem antibiotics can rapidly collapse valproate concentrations because they interrupt valproate recycling and clearance pathways, risking recurrent seizures despite dose escalation."
      ],
      keyLabs: [
        "Immediate glucose is mandatory because a low value is rapidly reversible and can perpetuate seizure activity.",
        "Use electrolytes, calcium, magnesium, renal and hepatic function, CBC, pregnancy testing, toxicology, antiseizure levels, infection studies, and neuroimaging according to the suspected cause because status is a syndrome with many triggers.",
        "Check phenytoin concentration after distribution at a protocol-appropriate time and use a free level when binding is abnormal because an early or total-only result can misrepresent active exposure.",
        "Check ammonia when valproate-treated patients remain unexpectedly encephalopathic because hyperammonemia can occur without marked transaminase elevation."
      ],
      nclexTraps: [
        "Five minutes is the practical treatment threshold because waiting for the older 30-minute definition sacrifices the period when status is easier to stop.",
        "A benzodiazepine is first for speed; fosphenytoin is not a substitute for the immediate benzodiazepine because conversion and brain effect are not instantaneous.",
        "Levetiracetam, fosphenytoin, and valproate were similarly effective in ESETT, so the correct second agent depends on liver, pregnancy, cardiac, interaction, and prior-drug context.",
        "Paralysis can hide convulsions without treating cortical seizure activity, so continuous EEG matters after intubation or unexplained persistent unresponsiveness."
      ],
      populationRisks: populationRisks(
        "Use weight-based pediatric protocols because fixed adult doses can underdose small children or exceed safe administration limits; neonatal status follows a different pathway.",
        "Older adults have more stroke, metabolic triggers, conduction disease, renal dysfunction, and sedative sensitivity, so cause finding and cardiorespiratory monitoring are especially important.",
        "Pregnancy changes differential diagnosis and drug risk; eclampsia requires magnesium-centered treatment while valproate fetal toxicity and maternal airway risk shape medication selection."
      ),
      sourceNote: "American Epilepsy Society convulsive status epilepticus guideline and the NIH/FDA-funded ESETT randomized trial: https://pubmed.ncbi.nlm.nih.gov/31774955/",
      tags: ["frontier-wave21", "status epilepticus", "benzodiazepine", "ESETT", "fosphenytoin", "levetiracetam", "valproate", "strict why closure"]
    }),

    classCard({
      name: "Sodium-channel antiseizure medication comparison",
      aliases: [
        "sodium channel seizure drug comparison", "phenytoin carbamazepine lacosamide comparison",
        "fast versus slow sodium channel inactivation", "use dependent sodium channel blockade", "AED sodium channel blockers"
      ],
      class: "Voltage-gated sodium-channel antiseizure pharmacology comparison",
      classPathway: ["Neurologic pharmacology", "Antiseizure medications", "Fast and slow sodium-channel inactivation"],
      classExampleNames: ["Phenytoin", "Fosphenytoin", "Carbamazepine", "Lamotrigine", "Lacosamide", "Topiramate"],
      usedToTreat: "This comparison explains why several drugs can all be called sodium-channel blockers yet differ in seizure spectrum, kinetics, interactions, cardiac effects, rash risk, and monitoring. The shared endpoint is fewer channels available for rapid repetitive firing; the binding state, recovery time, metabolism, and non-sodium targets create the clinical differences.",
      description: "Phenytoin and carbamazepine favor the fast-inactivated state of voltage-gated sodium channels and produce use-dependent blockade: the faster a neuron fires, the more channels remain unavailable. Lamotrigine also suppresses sustained firing and glutamate release. Lacosamide selectively enhances slow inactivation, reducing channel availability during more prolonged depolarization and carrying a distinctive PR-interval warning. Topiramate has sodium-channel activity but is not merely a sodium drug because it also enhances GABA-A signaling, antagonizes AMPA/kainate receptors, and inhibits carbonic anhydrase. These drugs are strong against focal seizure networks, but some classic fast-inactivation agents can worsen absence or myoclonic generalized epilepsies, so the words sodium-channel blocker cannot replace seizure-syndrome classification.",
      mechanism: "A voltage-gated sodium channel cycles through resting, open, fast-inactivated, and slower inactivated conformations. Normal neurons have time to recover between action potentials. During seizure-rate firing, phenytoin or carbamazepine binds preferentially to open or fast-inactivated channels and delays recovery, so each depolarization leaves fewer channels ready for the next one. This frequency dependence explains relative selectivity for pathologic bursts. Lacosamide shifts channels toward slow inactivation over hundreds of milliseconds to seconds, reducing excitability in persistently depolarized neurons. The same channel family exists in cardiac conduction tissue, explaining why rapid phenytoin exposure or lacosamide in a vulnerable conduction system can produce bradyarrhythmia or block. Molecular state preference therefore connects seizure control to toxicity.",
      boxedWarning: "There is no uniform sodium-channel class boxed warning. Carbamazepine carries boxed SJS/TEN and aplastic-anemia/agranulocytosis warnings; rapid IV phenytoin or fosphenytoin carries boxed cardiovascular warnings; lamotrigine carries a boxed serious-rash warning; and lacosamide has serious conduction warnings without a box. Always identify the actual drug rather than transferring one warning to the whole mechanism class.",
      adverseEffects: [
        "Diplopia, nystagmus, ataxia, dysarthria, and dizziness occur because excessive sodium-channel suppression impairs cerebellar and vestibular signaling; the pattern can be a concentration clue for phenytoin.",
        "Bradycardia, PR prolongation, AV block, or ventricular arrhythmia can occur when cardiac sodium-channel reserve is reduced or IV exposure rises too quickly, so route and infusion rate matter.",
        "Serious rash and DRESS are concentrated in aromatic agents and genetically susceptible patients because immune presentation and reactive metabolites differ among drugs sharing the same neuronal target.",
        "Drug interactions vary widely because carbamazepine and phenytoin are strong inducers, lamotrigine relies on glucuronidation, lacosamide has fewer induction effects, and topiramate adds carbonic-anhydrase physiology."
      ],
      contraindications: [
        "Do not select a classic narrow-spectrum sodium-channel drug for an unclassified generalized epilepsy because absence or myoclonic seizures can worsen even if tonic-clonic events look superficially similar.",
        "Do not give rapid IV phenytoin or fosphenytoin without rate limits and ECG/blood-pressure monitoring because cardiac channel blockade is concentration- and rate-dependent.",
        "Do not ignore structural heart disease, PR prolongation, AV block, Brugada syndrome, or other conduction-slowing drugs before lacosamide because reduced conduction reserve magnifies its electrophysiologic effect."
      ],
      nursingEssentials: [
        "Separate formulation, route, and rate from the generic name because oral phenytoin, IV phenytoin, and fosphenytoin in phenytoin equivalents have different administration hazards.",
        "Assess gait, eye movements, speech, alertness, rash, fever, mucosa, ECG risk, sodium, CBC, liver function, and levels according to the selected drug because each observation maps to a different mechanism-linked toxicity.",
        "Verify seizure type before interpreting breakthrough events because a medication can suppress focal seizures while aggravating a coexisting generalized pattern."
      ],
      interactions: [
        "Phenytoin and carbamazepine lower concentrations of many CYP substrates because enzyme induction accelerates metabolism; stopping the inducer can then raise the companion drug even when its dose is unchanged.",
        "Valproate can displace phenytoin from albumin and inhibit parts of its metabolism, so total phenytoin can fall while free active exposure rises.",
        "Multiple conduction-slowing drugs can add PR prolongation or bradycardia with lacosamide because electrophysiologic effects are pharmacodynamic as well as pharmacokinetic."
      ],
      keyLabs: [
        "Phenytoin generally uses total and free concentration interpretation because nonlinear clearance and protein binding make dose-to-level relationships unpredictable.",
        "Carbamazepine levels are most useful after autoinduction, dose changes, interactions, toxicity, or breakthrough seizures because clearance evolves during the first 3 to 5 weeks.",
        "ECG before and after lacosamide titration is recommended in patients with proarrhythmic disease or conduction-active co-medications because the PR effect may become clinically meaningful in a vulnerable patient."
      ],
      nclexTraps: [
        "Use-dependent does not mean the drug is used only when needed; it means channel blockade becomes stronger as firing frequency increases.",
        "Lacosamide favors slow inactivation, while phenytoin and carbamazepine classically prolong fast inactivation; that kinetic distinction helps explain different uses and adverse effects.",
        "Fosphenytoin is a prodrug measured in mg phenytoin equivalents, not an unrelated antiseizure molecule."
      ],
      populationRisks: populationRisks(
        "Children can clear some agents faster and require weight-based dosing, while inherited epilepsy syndrome determines whether a narrow-spectrum sodium blocker is appropriate.",
        "Older adults have more hypoalbuminemia, conduction disease, falls, and interacting drugs, so free levels, ECG context, and lower titration speed matter.",
        "Pregnancy can alter clearance and fetal risk; do not abruptly stop effective therapy because maternal convulsions also threaten the fetus."
      ),
      sourceNote: "Current U.S. labels for Dilantin, Cerebyx, Tegretol, Lamictal, Vimpat, and Topamax.",
      tags: ["frontier-wave21", "sodium channel", "fast inactivation", "slow inactivation", "use dependent", "antiseizure comparison", "strict why closure"]
    }),

    classCard({
      name: "Antiseizure therapeutic drug monitoring and free-level logic",
      aliases: [
        "seizure drug level interpretation", "free phenytoin level", "free valproate level",
        "total versus free antiseizure level", "antiepileptic therapeutic ranges", "why check drug levels"
      ],
      class: "Clinical concentration interpretation for protein-bound and concentration-sensitive antiseizure drugs",
      classPathway: ["Clinical pharmacology", "Therapeutic drug monitoring", "Total concentration, free concentration, timing, and nonlinear clearance"],
      classExampleNames: ["Phenytoin", "Valproic acid", "Carbamazepine", "Ethosuximide", "Levetiracetam"],
      usedToTreat: "This is an interpretation tool, not a separate treatment. It explains when an antiseizure concentration can answer a clinical question, why the same total number can be safe in one patient and toxic in another, and why symptoms, sampling time, albumin, kidney function, pregnancy, formulation, adherence, and interacting drugs must accompany the result.",
      description: "Antiseizure therapeutic drug monitoring is a drug concentration interpretation tool that uses a timed total concentration and, when needed, the unbound concentration to explain efficacy, toxicity, adherence, or altered exposure; its therapeutic range is a population reference, not a wall between safe and toxic. Phenytoin is the clearest example: a general total range of 10 to 20 mcg/mL corresponds roughly to a free range of 1 to 2 mcg/mL, but only unbound drug crosses membranes and exerts effect. Low albumin, uremia, pregnancy, critical illness, displacement, and saturable binding can increase the free fraction, producing toxicity at a deceptively low total level. Phenytoin also has capacity-limited metabolism, so a small dose increase near saturation can cause a disproportionate concentration rise. Valproate is also highly and saturably protein bound; carbamazepine autoinduces its metabolism; and levetiracetam usually needs clinical and renal dosing rather than routine level chasing. The useful question is never just 'is it in range?' but 'what does this timed concentration explain in this patient?'.",
      mechanism: "Total concentration equals protein-bound plus unbound drug. Albumin binding acts as a reservoir, while free drug distributes to receptors and clearance organs. When albumin falls or uremic solutes compete for binding, the free fraction rises; the total number may fall even though receptor-active exposure is unchanged or increased. For phenytoin, CYP2C9 and CYP2C19 approach metabolic capacity within the therapeutic range, shifting elimination from roughly concentration-proportional toward capacity limited. Carbamazepine activates CYP3A4 expression and accelerates its own clearance over about 3 to 5 weeks. Pregnancy can increase volume and clearance, while postpartum reversal can raise levels. These mechanisms explain why timing, free measurement, and trend are more informative than a memorized range alone.",
      boxedWarning: "Drug monitoring has no boxed warning, but misinterpretation can cause severe harm: increasing phenytoin because a low total level hides a high free fraction can worsen neurotoxicity, while reducing therapy solely to normalize a number can provoke seizures. Treat toxicity and seizure control in context rather than treating the laboratory range as the patient.",
      adverseEffects: [
        "Phenytoin toxicity typically progresses through nystagmus, diplopia, ataxia, dysarthria, lethargy, confusion, and severe CNS depression because cerebellar and cortical sodium-channel suppression increases with free exposure.",
        "Valproate toxicity can appear as sedation, tremor, thrombocytopenia, hyperammonemic encephalopathy, liver injury, or pancreatitis because concentration is only one part of several organ-specific toxic pathways.",
        "Carbamazepine excess causes diplopia, ataxia, sedation, nystagmus, dysrhythmia, hypotension, hyponatremia, and severe poisoning because parent drug and active epoxide affect neural and cardiac channels."
      ],
      contraindications: [
        "Do not increase a highly protein-bound drug from a total concentration alone when albumin or renal binding is abnormal because the active free exposure may already be therapeutic or toxic.",
        "Do not interpret a post-dose peak as a trough because sampling time changes the number and can create a false impression of accumulation or underdosing.",
        "Do not wait for a level before treating obvious severe toxicity, status epilepticus, airway compromise, or a life-threatening reaction because laboratory confirmation must not delay stabilization."
      ],
      nursingEssentials: [
        "Record exact dose, formulation, administration time, draw time, missed doses, recent load, tube feeds, dialysis, pregnancy, albumin, renal and hepatic function, and interacting drugs because those variables determine whether the result is interpretable.",
        "Request free phenytoin or free valproate when binding is unreliable because correction equations are estimates and can fail in critical illness, uremia, or complex displacement.",
        "Reassess after enough time for the pharmacokinetic change to appear because phenytoin steady state may take 7 to 10 days or longer after a dose change and carbamazepine autoinduction evolves for weeks."
      ],
      interactions: [
        "Valproate can increase free phenytoin through displacement and metabolic effects, so the total phenytoin level may move in the opposite direction from toxicity.",
        "Tube feeding can reduce phenytoin absorption because drug can bind feeding components and delivery conditions change gastrointestinal exposure; separate administration per protocol and monitor response rather than assuming the prescribed dose entered the bloodstream.",
        "Enzyme inducers lower companion-drug concentrations during coadministration, but stopping an inducer can raise those concentrations because metabolic capacity returns toward baseline."
      ],
      keyLabs: [
        "General anchors are phenytoin total 10 to 20 mcg/mL and free 1 to 2 mcg/mL, carbamazepine 4 to 12 mcg/mL, and ethosuximide 40 to 100 mcg/mL; indication, laboratory method, and patient response can justify values outside a reference interval.",
        "Valproate total targets vary by indication and source, often around 50 to 100 mcg/mL for epilepsy and up to 125 mcg/mL in some mania contexts, but free concentration and toxicity signs matter when binding is abnormal.",
        "Use albumin, creatinine/eGFR, liver tests, CBC/platelets, sodium, bicarbonate, and ammonia according to the drug because a concentration cannot detect every important toxicity."
      ],
      nclexTraps: [
        "Only free drug is pharmacologically available, so a normal total level does not exclude toxicity when albumin is low or uremia displaces binding.",
        "Phenytoin dose changes are not proportional to level changes near metabolic saturation, so doubling a dose can produce far more than double the concentration.",
        "Levetiracetam is renally cleared, but routine levels are not automatically required; renal function, seizure control, adherence, pregnancy, and toxicity usually determine whether a level answers a useful question."
      ],
      populationRisks: populationRisks(
        "Growth, weight, maturation, adherence, and liquid-dose accuracy change pediatric exposure, so trends and clinical response are essential.",
        "Low albumin, renal decline, frailty, and polypharmacy make total levels less reliable and CNS toxicity more consequential because falls and delirium can occur early.",
        "Pregnancy can lower several concentrations through increased clearance and altered binding, followed by postpartum rebound, so pre-pregnancy baselines and planned follow-up reduce both breakthrough seizures and toxicity."
      ),
      sourceNote: "Current U.S. labels for Dilantin, Depakote, Tegretol, ethosuximide, and Keppra.",
      tags: ["frontier-wave21", "therapeutic drug monitoring", "free level", "protein binding", "phenytoin", "valproate", "strict why closure"]
    })
  ];

  const drugCards = [
    drugCard({
      name: "Valproic acid",
      aliases: ["valproate", "divalproex", "divalproex sodium", "Depakote", "Depakene", "VPA", "valporic acid", "sodium valproate"],
      brandExamples: ["Depakene", "Depakote", "Depakote ER", "Depacon"],
      class: "Broad-spectrum antiseizure medication and mood stabilizer with GABA-enhancing, sodium-channel, and T-type calcium-current effects",
      classPathway: ["Neurologic and psychiatric medication", "Broad-spectrum antiseizure drug", "GABA metabolism, repetitive firing, and thalamic-current modulation"],
      usedToTreat: "Multiple focal and generalized seizure types, acute manic or mixed episodes, and migraine prevention. Product, formulation, age, indication, and pregnancy status matter because valproic acid, valproate sodium, divalproex delayed-release, extended-release, sprinkle, liquid, and IV products deliver active valproate differently and are not automatic schedule-for-schedule substitutes.",
      description: "Valproic acid is a broad-spectrum antiseizure and mood-stabilizing drug that raises inhibitory GABA tone and dampens rapid neuronal firing through sodium channel and T-type calcium-current effects across several seizure networks. Its hepatotoxicity, thrombocytopenia, and hyperammonemia risks are why LFT and CBC trends, bruising, and new mental-status changes matter instead of serving as routine checklist items. Its breadth makes it useful for mixed or generalized epilepsies, but the same mitochondrial, hepatic, urea-cycle, platelet, pancreatic, endocrine, and fetal effects make it one of the most consequence-heavy drugs in neurology. The defining bedside lesson is that confusion can be hyperammonemic encephalopathy even when liver enzymes and the total valproate level look acceptable. The defining reproductive lesson is that valproate has substantial neural-tube, structural, and neurodevelopmental fetal risk, so migraine prevention is contraindicated in pregnancy and epilepsy or bipolar use requires failure or unacceptability of safer effective alternatives.",
      mechanism: "Valproate has no single proven therapeutic target. It increases brain GABA availability by inhibiting parts of GABA degradation and changing synthesis or turnover, prolongs sodium-channel inactivation to reduce sustained high-frequency firing, and reduces selected T-type calcium currents involved in thalamocortical oscillation. Hepatic glucuronidation and mitochondrial beta-oxidation clear the drug; toxic metabolites and impaired mitochondrial reserve help explain severe hepatotoxicity in young children and POLG-related disease. Valproate can deplete carnitine and interfere with the urea cycle, reducing ammonia disposal and producing cerebral glutamine accumulation and astrocyte swelling. Highly saturable albumin binding means the free active fraction rises disproportionately at higher concentrations, low albumin, uremia, pregnancy, older age, or displacement interactions, so total concentration can understate exposure.",
      boxedWarning: "BOXED WARNINGS: Potentially fatal hepatotoxicity, especially during the first 6 months and in children under 2 years or mitochondrial disease; major fetal structural and neurodevelopmental harm; and potentially fatal pancreatitis. It is contraindicated for migraine prevention during pregnancy and in patients who are not using effective contraception when pregnancy is possible. It is also contraindicated in significant hepatic disease, known POLG-related mitochondrial disease, and urea-cycle disorders because those conditions magnify the mechanisms of fatal toxicity.",
      adverseEffects: [
        "Tremor, sedation, nausea, weight gain, alopecia, and menstrual or endocrine effects occur because valproate affects broad inhibitory, metabolic, and hormonal pathways rather than one seizure-only target.",
        "Dose- and concentration-related thrombocytopenia plus platelet dysfunction can cause bruising or bleeding because platelet number and hemostatic function both decline.",
        "Hyperammonemia can cause vomiting, lethargy, cognitive slowing, hypothermia, or coma because ammonia is converted to glutamine in astrocytes, drawing water and disrupting cerebral function even without major hepatocellular injury.",
        "Pancreatitis can occur early or after years because the reaction is not limited to the initiation period; persistent severe abdominal pain or vomiting requires immediate evaluation."
      ],
      contraindications: [
        "Do not use in known POLG-related mitochondrial disease because impaired oxidative phosphorylation and valproate metabolites create a disproportionate risk of acute liver failure and death.",
        "Do not use in a urea-cycle disorder because reduced ammonia disposal can precipitate severe hyperammonemic encephalopathy.",
        "Do not use for migraine prevention in pregnancy because that non-life-threatening indication does not justify the known fetal risk; for epilepsy or bipolar disorder, specialist use requires that alternatives are ineffective or unacceptable.",
        "Stop and urgently evaluate suspected pancreatitis or significant hepatic dysfunction because continuing exposure can convert early symptoms into organ failure."
      ],
      nursingEssentials: [
        "Escalate new lethargy, confusion, vomiting, seizure worsening, hypothermia, or ataxia and obtain ammonia because hyperammonemic encephalopathy may occur with normal transaminases and a seemingly therapeutic total level.",
        "Assess abdominal pain, persistent vomiting, jaundice, malaise, edema, appetite loss, bruising, and bleeding because clinical toxicity can precede or exceed routine laboratory change.",
        "Verify the exact formulation before conversion because ER bioavailability and dosing schedule differ from delayed-release or immediate-release products, so a casual milligram-for-milligram switch can change exposure."
      ],
      interactions: [
        "Carbapenem antibiotics can rapidly and profoundly lower valproate concentrations because they interrupt valproate-glucuronide recycling and increase elimination, so breakthrough seizures may occur and simple dose escalation often cannot overcome the interaction.",
        "Valproate inhibits lamotrigine glucuronidation, increasing lamotrigine exposure and serious-rash risk, so lamotrigine must begin lower and titrate more slowly.",
        "Topiramate can add hyperammonemia and hypothermia because both drugs disturb ammonia handling and mitochondrial metabolism; unexplained mental-status or temperature change requires evaluation.",
        "Aspirin, warfarin, phenytoin, and other highly protein-bound drugs can alter free fractions or bleeding risk because displacement and platelet effects occur even when total concentrations seem stable."
      ],
      keyLabs: [
        "Obtain baseline and clinically indicated liver tests, CBC/platelets, coagulation assessment, pregnancy testing and counseling, and metabolic history because the major toxicities involve liver, hemostasis, fetus, and inherited metabolism.",
        "Use total valproate concentration for a timed trend, but obtain a free concentration when albumin is low, renal failure or pregnancy changes binding, critical illness is present, or toxicity conflicts with the total result because only unbound drug is active.",
        "Check ammonia for unexplained encephalopathy and lipase for suspected pancreatitis because neither danger is excluded by a routine valproate level."
      ],
      nclexTraps: [
        "Normal AST and ALT do not exclude valproate hyperammonemic encephalopathy because ammonia toxicity can arise from urea-cycle interference without hepatocyte necrosis.",
        "Do not increase valproate solely because a total level is low when albumin is low because the free fraction may already be high.",
        "A patient stable for years can still develop pancreatitis because the boxed risk is not confined to the first weeks.",
        "Carbapenem-associated loss of valproate is often not rescued by simply giving more valproate because the interaction is unusually strong."
      ],
      populationRisks: populationRisks(
        "Children under 2 years, especially with metabolic disease, developmental delay, organic brain disease, or polytherapy, have disproportionate fatal hepatotoxicity because mitochondrial reserve is limited.",
        "Low albumin, hepatic dysfunction, thrombocytopenia, sedation, and polypharmacy increase free exposure, falls, and bleeding because both kinetics and sensitivity change with age.",
        "Major fetal malformation and neurodevelopmental risks require preconception planning, effective contraception when appropriate, folate counseling, and specialist alternatives; abrupt withdrawal can also cause maternal status epilepticus."
      ),
      sourceNote: "Current U.S. Depakote/divalproex labeling: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ded64147-7a43-4055-accc-2c011828079d",
      tags: ["frontier-wave21", "valproic acid", "valproate", "Depakote", "GABA", "hyperammonemia", "POLG", "pancreatitis", "strict why closure"]
    }),

    drugCard({
      name: "Phenytoin",
      aliases: ["Dilantin", "Phenytek", "phenytoen", "phenetoin", "diphenylhydantoin", "phenytoin sodium", "PHT"],
      brandExamples: ["Dilantin", "Phenytek"],
      class: "Hydantoin antiseizure medication with use-dependent fast sodium-channel blockade and capacity-limited hepatic elimination",
      classPathway: ["Neurologic medication", "Narrow-spectrum antiseizure drug", "Fast-inactivated sodium channel and nonlinear pharmacokinetics"],
      usedToTreat: "Focal-onset and generalized tonic-clonic seizures, including maintenance after acute IV loading. It is not an absence-seizure drug and can aggravate some generalized epilepsy patterns because its strongest benefit is suppressing rapid repetitive firing in focal and tonic-clonic networks rather than disrupting the thalamic 3-Hz absence oscillator.",
      description: "Phenytoin blocks fast-inactivated voltage-gated sodium channels during repetitive firing, suppressing focal and tonic-clonic seizure propagation while its narrow therapeutic index makes dose, blood level, and toxicity nonproportional. It delays channel recovery and suppresses sustained high-frequency firing while relatively sparing ordinary slower firing. Near the therapeutic range, CYP2C9 and CYP2C19 metabolism becomes saturated, so a small dose increase can cause a large concentration jump. Because phenytoin is highly albumin bound, low albumin or uremia can make the free active level toxic even when the total result looks low. Those two facts - nonlinear clearance and variable free fraction - explain why phenytoin requires unusually careful dosing, timed levels, formulation review, and bedside neurologic assessment.",
      mechanism: "Rapidly firing neurons repeatedly open sodium channels before all channels recover. Phenytoin binds more avidly to open and fast-inactivated channels and slows return to the resting state, so each high-frequency action potential leaves fewer channels available for the next discharge. This is use-dependent blockade. Hepatic CYP2C9, with a smaller CYP2C19 contribution, converts phenytoin to inactive metabolites. As enzyme capacity approaches saturation, elimination shifts toward capacity limited: additional dose cannot be cleared proportionally and the half-life lengthens. About 90% is usually protein bound; uremic solutes, low albumin, pregnancy, critical illness, and displacement raise the free fraction. Cardiac sodium channels are also affected at high or rapidly delivered IV concentrations, explaining hypotension, bradyarrhythmia, and conduction block.",
      boxedWarning: "BOXED WARNING for injectable phenytoin: IV administration above recommended rates can cause severe hypotension and cardiac arrhythmias, including bradycardia, heart block, ventricular arrhythmia, and death. Continuous ECG, blood-pressure, and respiratory monitoring are required during and after infusion because toxicity can persist after the line stops. Oral phenytoin does not carry this infusion box, but it retains serious rash, DRESS, hepatic, hematologic, and fetal risks.",
      adverseEffects: [
        "Dose-related nystagmus, diplopia, ataxia, dysarthria, lethargy, and confusion occur as free exposure increasingly suppresses cerebellar and cortical sodium-channel signaling.",
        "Gingival overgrowth, hirsutism, acne, coarse facial change, peripheral neuropathy, osteopenia, and vitamin-D disturbance develop with chronic exposure because connective-tissue signaling and hepatic vitamin metabolism are altered.",
        "SJS/TEN, DRESS, hepatitis, blood dyscrasia, and lymphadenopathy can occur because aromatic anticonvulsant hypersensitivity may involve immune recognition and reactive metabolites.",
        "Purple glove syndrome and tissue necrosis can follow IV extravasation or vascular injury because highly alkaline phenytoin solution is locally damaging."
      ],
      contraindications: [
        "Do not use in sinus bradycardia, sinoatrial block, second- or third-degree AV block, or Adams-Stokes syndrome because phenytoin can further depress cardiac conduction.",
        "Do not use after prior phenytoin or hydantoin hypersensitivity, and use genotype-informed caution with HLA-B*1502 or CYP2C9 variants when ancestry and current guidance make testing relevant because severe skin reactions or reduced clearance may be more likely.",
        "Do not use for routine absence seizure control because it does not suppress the thalamocortical 3-Hz mechanism and can worsen some generalized syndromes.",
        "Do not make large maintenance-dose jumps near the upper range because saturable metabolism can convert a modest increment into disproportionate toxicity."
      ],
      nursingEssentials: [
        "Assess nystagmus, gait, coordination, speech, alertness, rash, mucosa, fever, nodes, oral health, and seizure pattern because bedside findings can reveal free-drug toxicity or hypersensitivity before a total level explains it.",
        "Use normal saline and a dedicated monitored line for IV phenytoin per protocol because dextrose can precipitate the drug and alkaline solution can injure tissue; inspect the site continuously.",
        "Separate enteral feeds according to institutional protocol and monitor levels and seizure control because continuous nutrition can reduce and destabilize absorption.",
        "Wait an appropriate interval after a maintenance change, commonly about 7 to 10 days or longer, before assuming steady state because nonlinear elimination can lengthen the time needed for the new concentration to settle."
      ],
      interactions: [
        "Phenytoin induces CYP3A4, CYP2C, and glucuronidation pathways, lowering concentrations of contraceptives, warfarin and some direct anticoagulants, corticosteroids, immunosuppressants, antivirals, and many psychotropics because metabolism accelerates.",
        "Valproate can displace phenytoin from albumin and inhibit metabolism, so total phenytoin may fall while free active concentration and toxicity rise.",
        "Acute alcohol can inhibit metabolism while chronic alcohol use can induce clearance, so the direction of concentration change depends on exposure pattern and liver function.",
        "Tube feeding can lower absorption because phenytoin interacts with feeding components and administration conditions, so a prescribed dose may not produce the expected systemic exposure."
      ],
      keyLabs: [
        "General reference anchors are total phenytoin 10 to 20 mcg/mL and free phenytoin 1 to 2 mcg/mL, but seizure control and toxicity can occur outside those population ranges.",
        "Obtain a free level when albumin is low, renal or hepatic disease is present, pregnancy or critical illness changes binding, or the clinical picture conflicts with the total level because correction formulas are only estimates.",
        "Trend CBC, liver tests, albumin, renal function, vitamin D and bone health, and pregnancy context because concentration monitoring cannot detect immune, hepatic, hematologic, skeletal, or fetal harm."
      ],
      nclexTraps: [
        "A dose increase of 10% can cause far more than a 10% level increase near saturation because phenytoin elimination is capacity limited.",
        "A total level of 8 mcg/mL can still be toxic when albumin is low because the free fraction, not the bound reservoir, reaches receptors.",
        "Fosphenytoin doses are written in mg PE, while phenytoin is written in mg phenytoin; confusing vial content with concentration can cause large overdose.",
        "Nystagmus and ataxia are classic concentration clues, not merely evidence that the original neurologic illness is worsening."
      ],
      populationRisks: populationRisks(
        "Children may clear phenytoin differently and require weight-based expert dosing; liquid suspension must be shaken and measured accurately because settling changes delivered dose.",
        "Low albumin, renal dysfunction, falls, conduction disease, and polypharmacy make free-level and ECG interpretation especially important because toxicity may appear at a low total number.",
        "Pregnancy can lower total concentration and alter binding, while fetal hydantoin-pattern risks and maternal seizure danger require specialist free-level and clinical management rather than abrupt withdrawal."
      ),
      sourceNote: "Current U.S. Dilantin labeling: https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=db8c69b0-4697-433e-98c7-b0b2d2c52a83",
      tags: ["frontier-wave21", "phenytoin", "Dilantin", "sodium channel", "nonlinear", "free level", "nystagmus", "strict why closure"]
    }),

    drugCard({
      name: "Fosphenytoin",
      aliases: ["Cerebyx", "fosphenytoin sodium", "fosphenytoine", "phenytoin equivalents", "mg PE", "fosphenytoin load"],
      brandExamples: ["Cerebyx"],
      class: "Water-soluble phosphate-ester prodrug of phenytoin for parenteral antiseizure loading",
      classPathway: ["Neurologic emergency medication", "Phenytoin prodrug", "Enzymatic conversion to use-dependent sodium-channel blockade"],
      usedToTreat: "Parenteral treatment of generalized convulsive status epilepticus after a rapid benzodiazepine, prevention or treatment of peri-neurosurgical seizures, and short-term substitution when oral phenytoin cannot be given. Every dose is expressed as milligrams of phenytoin equivalents (mg PE) because the prodrug and active drug have different molecular weights.",
      description: "Fosphenytoin is a water-soluble IV or IM prodrug that phosphatases convert to active phenytoin. It was designed to avoid the highly alkaline propylene-glycol formulation and severe local tissue injury of IV phenytoin, permitting faster infusion and better local tolerance. It does not remove phenytoin's cardiac, nonlinear, protein-binding, rash, or interaction hazards because the active molecule after conversion is still phenytoin. The most important safety detail is unit language: the vial is labeled in mg PE, 1.5 mg fosphenytoin equals 1 mg PE, and confusing total vial content, concentration, or molecular mass has caused twofold to tenfold overdoses, including fatal events.",
      mechanism: "Plasma and tissue phosphatases cleave fosphenytoin's phosphate ester, releasing phenytoin, phosphate, and formaldehyde that is rapidly metabolized. Active phenytoin then binds open or fast-inactivated neuronal sodium channels and delays recovery, suppressing sustained high-frequency firing. Conversion and distribution take time, so fosphenytoin is not the immediate GABAergic rescue for a convulsion that is happening now; an IV or IM benzodiazepine is given first in status epilepticus. Once phenytoin appears, high or rapidly rising concentrations can block cardiac sodium channels and vascular function, while albumin binding and saturable hepatic metabolism govern later toxicity.",
      boxedWarning: "BOXED WARNING: The IV rate must not exceed 150 mg PE per minute in adults because faster administration increases severe hypotension and cardiac-arrhythmia risk. Continuous ECG, blood-pressure, and respiratory monitoring are required during and after infusion, with observation through peak phenytoin exposure because bradycardia, heart block, ventricular arrhythmia, cardiovascular collapse, and death can occur even at recommended rates.",
      adverseEffects: [
        "Pruritus, burning, paresthesia, or groin discomfort can occur during infusion because fosphenytoin-related sensory effects increase with dose and rate even without an allergic rash.",
        "Hypotension, bradycardia, AV block, and ventricular arrhythmia can occur because the converted phenytoin affects cardiac sodium channels, especially during rapid exposure.",
        "Nystagmus, ataxia, dysarthria, dizziness, and somnolence occur as active phenytoin suppresses cerebellar and cortical firing.",
        "SJS/TEN, DRESS, hepatic injury, hematologic toxicity, and fetal harm remain possible because prodrug conversion does not remove phenytoin's systemic biology."
      ],
      contraindications: [
        "Do not use in sinus bradycardia, sinoatrial block, second- or third-degree AV block, or Adams-Stokes syndrome because converted phenytoin can further slow conduction.",
        "Do not use after hypersensitivity to fosphenytoin, phenytoin, or another hydantoin because the patient is exposed to active phenytoin after conversion.",
        "Do not use delavirdine with fosphenytoin because enzyme induction can reduce antiviral exposure enough to cause loss of virologic response and resistance.",
        "Do not calculate from milligrams of fosphenytoin molecular mass because all prescribing, dispensing, and pump programming must use mg PE to prevent overdose."
      ],
      nursingEssentials: [
        "Read the vial as both concentration and total mg PE, then independently verify ordered mg PE, patient weight, volume, and rate because confusing 50 mg PE/mL with total vial content has produced fatal tenfold errors.",
        "Monitor ECG, blood pressure, respirations, neurologic status, and the IV site during and after administration because cardiac toxicity can outlast infusion and local injury, though less common than with phenytoin, can still occur.",
        "Give a protocol-approved benzodiazepine first for active convulsive status because fosphenytoin conversion and phenytoin brain effect are not immediate enough to replace rapid GABA-A rescue.",
        "Interpret post-load levels at a protocol-appropriate time because assays can cross-react with prodrug during conversion and an early sample may not represent distributed active phenytoin."
      ],
      interactions: [
        "After conversion, phenytoin induces CYP and glucuronidation pathways, reducing many contraceptive, anticoagulant, antiviral, immunosuppressant, and psychiatric drug concentrations because metabolism accelerates.",
        "Valproate can alter free phenytoin through protein displacement and metabolic effects, so total concentration may understate active exposure.",
        "Other conduction-slowing or hypotensive drugs can add cardiovascular depression because infusion-related phenytoin toxicity is pharmacodynamic as well as concentration dependent."
      ],
      keyLabs: [
        "Use mg PE for every dose, concentration, load, and maintenance conversion because that standardized unit represents the amount of active phenytoin ultimately delivered.",
        "Obtain total and, when binding is abnormal, free phenytoin after conversion and distribution because only unbound active drug produces effect and toxicity.",
        "Check albumin, renal and hepatic function, CBC, liver tests, and trigger-directed status-epilepticus labs because drug concentration cannot identify every toxicity or seizure cause."
      ],
      nclexTraps: [
        "Fosphenytoin is safer for tissue than IV phenytoin but not free of cardiac risk because it becomes phenytoin.",
        "The adult maximum rate is 150 mg PE/min, not 150 mg fosphenytoin/min, because dosing is standardized to phenytoin equivalents.",
        "A 10-mL vial at 50 mg PE/mL contains 500 mg PE; treating 50 as the vial total creates a tenfold error.",
        "It follows, rather than replaces, rapid benzodiazepine therapy in active convulsive status because conversion delays definitive sodium-channel effect."
      ],
      populationRisks: populationRisks(
        "Use weight-based pediatric dosing and the lower protocol rate limit because infusion calculations and cardiovascular reserve differ by size and age.",
        "Conduction disease, hypotension, low albumin, renal failure, and polypharmacy increase cardiac and free-drug risk because reserve and binding are reduced.",
        "Pregnancy requires specialist seizure-risk and fetal-risk planning; abrupt withdrawal can provoke maternal status while active phenytoin exposure carries fetal risk."
      ),
      sourceNote: "Current U.S. Cerebyx labeling: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d4c36fad-0ba2-4cd4-9c5e-dcf843f38a5a",
      tags: ["frontier-wave21", "fosphenytoin", "Cerebyx", "prodrug", "mg PE", "status epilepticus", "cardiac monitoring", "strict why closure"]
    }),

    drugCard({
      name: "Levetiracetam",
      aliases: ["Keppra", "Spritam", "Elepsia XR", "levetiracitam", "levitiracetam", "levetiracetan", "LEV", "SV2A ligand"],
      brandExamples: ["Keppra", "Keppra XR", "Spritam", "Elepsia XR"],
      class: "Broad-spectrum pyrrolidone antiseizure medication that binds synaptic vesicle protein SV2A",
      classPathway: ["Neurologic medication", "Broad-spectrum antiseizure drug", "SV2A modulation of presynaptic vesicle release"],
      usedToTreat: "Focal-onset seizures, myoclonic seizures in juvenile myoclonic epilepsy, and primary generalized tonic-clonic seizures, with IV use common as a second-line load after benzodiazepine-treated convulsive status. It is selected often when rapid use and few CYP interactions are valuable, but renal function and behavior remain central safety variables.",
      description: "Levetiracetam is a broad-spectrum antiseizure drug that binds SV2A, a presynaptic vesicle protein involved in organizing calcium-dependent neurotransmitter release. It does not work by global GABA sedation or classic sodium-channel blockade, and it has minimal hepatic CYP metabolism, so it creates fewer metabolic drug interactions than phenytoin or carbamazepine. That simplicity can be misleading: most drug is eliminated by the kidney, hemodialysis removes a large fraction, and irritability, aggression, psychosis, depression, or suicidal thinking can become the dose-limiting toxicity. The crash-course identity is therefore 'SV2A drug with low interaction burden, renal dosing, and high-yield behavioral monitoring.'",
      mechanism: "Levetiracetam binds the SV2A vesicle protein with an affinity that correlates with antiseizure activity. SV2A helps prime synaptic vesicles and couple calcium entry to neurotransmitter exocytosis. Binding appears to modulate release probability and reduce pathologic hypersynchronous transmitter release without simply blocking all normal synapses; the exact molecular sequence in humans remains incompletely defined. The drug is not extensively metabolized by CYP enzymes. A fraction undergoes enzymatic hydrolysis, while most drug and metabolite leave through renal excretion. Clearance therefore tracks creatinine clearance, and a 4-hour hemodialysis session removes about half of the body pool, explaining dose reduction in renal impairment and a post-dialysis supplement.",
      boxedWarning: "No current U.S. boxed warning. Serious risks still include behavioral abnormalities, psychosis, aggression, suicidal thinking, somnolence, impaired coordination, anaphylaxis or angioedema, serious rash, DRESS, hematologic abnormalities, and seizure worsening after abrupt withdrawal. Absence of a box does not mean behavior change should be normalized or ignored.",
      adverseEffects: [
        "Somnolence, fatigue, dizziness, and coordination difficulty occur because SV2A modulation changes broader synaptic release as well as seizure networks, increasing driving and fall risk during titration.",
        "Irritability, agitation, aggression, emotional lability, depression, psychosis, or suicidal thinking can occur because limbic synaptic signaling is affected; new behavior can be a drug effect rather than a personality problem.",
        "Serious rash, DRESS, angioedema, anaphylaxis, and cytopenias are uncommon but important because immune or marrow toxicity can progress beyond ordinary fatigue or a minor rash.",
        "Breakthrough seizures can follow abrupt discontinuation because sudden removal of synaptic restraint destabilizes a previously controlled network."
      ],
      contraindications: [
        "Do not use after serious levetiracetam hypersensitivity because re-exposure can provoke angioedema, anaphylaxis, or severe cutaneous reaction.",
        "Do not use a normal adult dose unchanged in severe renal impairment or dialysis because reduced clearance raises exposure and neurobehavioral toxicity.",
        "Do not stop abruptly unless a life-threatening reaction requires it because withdrawal can increase seizure frequency or precipitate status epilepticus.",
        "Do not assume a quiet patient is tolerating therapy because depression, withdrawal, or cognitive slowing may be less visible than aggression; ask the patient and family directly."
      ],
      nursingEssentials: [
        "Establish baseline mood, behavior, sleep, cognition, gait, and family observations, then reassess after initiation and dose changes because behavioral toxicity may emerge before the patient identifies it as medication related.",
        "Calculate dosing from current creatinine clearance and verify dialysis timing because renal elimination and extracorporeal removal directly determine exposure.",
        "Use the correct immediate-release, extended-release, oral solution, dissolving tablet, or IV schedule because formulations are not automatically taken at the same frequency.",
        "Taper when discontinuing because seizure control reflects ongoing synaptic suppression rather than a permanent cure."
      ],
      interactions: [
        "Levetiracetam has few CYP interactions because it neither relies heavily on hepatic oxidation nor strongly induces or inhibits common CYP pathways.",
        "Sedatives, alcohol, opioids, and other antiseizure drugs can still add somnolence and impaired coordination because pharmacodynamic effects overlap even without a metabolic interaction.",
        "Hemodialysis is an exposure-changing intervention rather than a conventional drug interaction because it removes about 50% over 4 hours, so a supplemental post-dialysis dose may be needed."
      ],
      keyLabs: [
        "Trend creatinine clearance because renal function, not liver enzyme activity, is the main determinant of routine dose adjustment.",
        "Routine serum levels are not universally required, but a timed level can help with adherence, pregnancy-related clearance change, unexplained toxicity, renal change, or breakthrough seizures because each poses a specific pharmacokinetic question.",
        "Check CBC when infection, bruising, weakness, or unexplained symptoms suggest cytopenia because rare hematologic effects will not be detected by a drug level."
      ],
      nclexTraps: [
        "Few drug interactions does not mean few adverse effects because renal accumulation and behavioral toxicity are independent of CYP metabolism.",
        "A dialysis patient often needs both a reduced maintenance plan and a post-dialysis supplement because dialysis removes drug that the reduced kidneys cannot otherwise clear predictably.",
        "Irritability or aggression after starting Keppra can be medication related and should trigger assessment rather than blame.",
        "SV2A binding is strongly associated with effect, but the complete human molecular mechanism remains incompletely established, so do not overstate certainty."
      ],
      populationRisks: populationRisks(
        "Weight-based dosing, behavioral surveillance, and accurate liquid measurement matter because children may express toxicity as school, sleep, or behavior change.",
        "Renal decline, falls, sedation, and subtle depression require lower dosing and direct caregiver input because toxicity can present nonspecifically.",
        "Pregnancy can lower levetiracetam concentrations through increased clearance, so pre-pregnancy baseline response and level trends can prevent breakthrough seizures followed by postpartum overexposure."
      ),
      sourceNote: "Current U.S. Keppra labeling: https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=c6d5784d-abf9-45fe-ac5a-d5c53bd50f7e&version=29",
      tags: ["frontier-wave21", "levetiracetam", "Keppra", "SV2A", "renal dosing", "behavior", "status epilepticus", "strict why closure"]
    }),

    drugCard({
      name: "Carbamazepine",
      aliases: ["Tegretol", "Carbatrol", "Equetro", "Epitol", "carbemazepine", "carbamezapine", "CBZ", "trigeminal neuralgia drug"],
      brandExamples: ["Tegretol", "Tegretol XR", "Carbatrol", "Equetro", "Epitol"],
      class: "Iminostilbene antiseizure and trigeminal-neuralgia drug with use-dependent sodium-channel blockade and CYP3A4 autoinduction",
      classPathway: ["Neurologic medication", "Narrow-spectrum antiseizure drug", "Fast sodium-channel inactivation, active epoxide, and enzyme induction"],
      usedToTreat: "Focal seizures, generalized tonic-clonic seizures, mixed patterns containing those seizures, and true trigeminal neuralgia; selected products also treat acute manic or mixed bipolar episodes. It is not a simple analgesic and is not an absence-seizure drug because its sodium-channel effect fits rapid focal firing but does not suppress the thalamocortical absence oscillator.",
      description: "Carbamazepine blocks voltage-gated sodium channels in a use-dependent manner, suppressing repetitive seizure firing and ectopic trigeminal discharges while gradually accelerating its own metabolism. It stabilizes fast-inactivated sodium channels so fewer channels recover in time to sustain rapid firing. CYP3A4 converts it to an active 10,11-epoxide and is itself induced by carbamazepine; over about 3 to 5 weeks, the half-life falls and a dose that initially produced one level may later produce less exposure. That autoinduction explains why early levels and dose needs can change without nonadherence. Its high-yield hazards are HLA-associated SJS/TEN, DRESS, aplastic anemia or agranulocytosis, SIADH-related hyponatremia, liver injury, conduction block, fetal harm, and extensive enzyme-inducing interactions.",
      mechanism: "Carbamazepine binds preferentially to open and fast-inactivated voltage-gated sodium channels, delaying recovery and suppressing high-frequency action potentials in cortical seizure networks and hyperexcitable trigeminal afferents. Hepatic CYP3A4 forms carbamazepine-10,11-epoxide, an active metabolite, while epoxide hydrolase converts it onward. Repeated exposure increases expression of CYP3A4 and other enzymes, accelerating parent-drug clearance; autoinduction usually matures over 3 to 5 weeks and can shorten the half-life from roughly 25 to 65 hours initially to about 12 to 17 hours. Carbamazepine can also enhance antidiuretic signaling or renal water retention, producing dilutional hyponatremia, especially at higher doses, in older adults, or with diuretics.",
      boxedWarning: "BOXED WARNINGS: Serious and sometimes fatal SJS/TEN, with a strong HLA-B*1502 association in susceptible ancestry, and aplastic anemia or agranulocytosis. Test for HLA-B*1502 before treatment when ancestry suggests the allele may be present because over 90% of carbamazepine-associated SJS/TEN occurs in the first few months; avoid carbamazepine in a positive patient unless benefit clearly outweighs risk. Obtain baseline blood counts and investigate falling counts or infection because rare marrow failure is far more serious than common mild leukopenia.",
      adverseEffects: [
        "Diplopia, dizziness, ataxia, nystagmus, and somnolence occur as sodium-channel suppression spreads into normal cerebellar and vestibular signaling, especially during initiation or interaction-driven level rise.",
        "Hyponatremia can cause headache, confusion, memory change, unsteadiness, falls, or increased seizures because SIADH-like water retention lowers serum sodium and worsens cerebral swelling.",
        "SJS/TEN, DRESS, angioedema, hepatitis, and vanishing-bile-duct injury can occur because immune hypersensitivity may involve skin and multiple organs even before a dramatic rash appears.",
        "Leukopenia is relatively common, but aplastic anemia and agranulocytosis are rare emergencies because marrow production can fail, causing infection, bleeding, or pancytopenia."
      ],
      contraindications: [
        "Do not use after prior bone-marrow depression, serious carbamazepine hypersensitivity, or tricyclic-compound hypersensitivity because marrow or cross-reactive immune injury can recur.",
        "Do not combine with an MAOI and allow at least 14 days after MAOI discontinuation because overlapping monoamine and toxic effects are unsafe.",
        "Avoid in HLA-B*1502-positive patients when an acceptable alternative exists because the allele strongly increases carbamazepine SJS/TEN risk.",
        "Do not use for routine absence seizures and use caution in mixed disorders containing atypical absence because generalized convulsions can increase rather than improve."
      ],
      nursingEssentials: [
        "Obtain baseline CBC/platelets, liver tests, sodium, pregnancy and ancestry-informed HLA assessment, then trend symptoms and targeted labs because rash, infection, bruising, jaundice, confusion, and falls map to distinct life-threatening toxicities.",
        "Reassess levels and clinical response after several weeks because autoinduction lowers exposure even when the dose and adherence are unchanged.",
        "Shake suspension and do not administer it simultaneously in the same cup with other liquid medicines that can precipitate because formulation handling changes dose delivery.",
        "Taper rather than stop abruptly because sudden loss of sodium-channel seizure suppression can increase seizure frequency."
      ],
      interactions: [
        "Carbamazepine strongly induces CYP3A4 and other enzymes, lowering contraceptives, warfarin and some direct anticoagulants, antipsychotics, antidepressants, steroids, immunosuppressants, antivirals, and companion antiseizure drugs because clearance accelerates.",
        "Strong CYP3A4 inhibitors such as clarithromycin, azole antifungals, some antivirals, and grapefruit can raise carbamazepine and epoxide exposure because metabolism slows, producing diplopia, ataxia, or toxicity.",
        "Valproate and epoxide-hydrolase inhibitors can raise the active epoxide relative to parent drug, so toxicity can occur even when the parent carbamazepine number looks acceptable.",
        "Diuretics add hyponatremia risk because both therapies promote sodium loss or water retention, especially in older adults."
      ],
      keyLabs: [
        "A general total carbamazepine reference range is 4 to 12 mcg/mL, but obtain a timed level for toxicity, breakthrough seizures, autoinduction, adherence, formulation change, or interaction because the number is meaningful only with its question and timing.",
        "Trend CBC/platelets and investigate fever, sore throat, mouth ulcers, bruising, or falling counts because marrow toxicity can progress from subtle symptoms.",
        "Trend sodium and osmolality context when confusion, weakness, gait change, or seizure worsening occurs because SIADH-related hyponatremia can mimic drug sedation or neurologic disease.",
        "Monitor liver tests and consider parent plus epoxide concentrations in complex toxicity because active metabolite accumulation may be clinically important."
      ],
      nclexTraps: [
        "A lower level several weeks after starting does not automatically mean nonadherence because carbamazepine induces its own CYP3A4 metabolism over 3 to 5 weeks.",
        "New confusion and seizures can reflect carbamazepine-induced hyponatremia, so increasing the dose without checking sodium can worsen the cause.",
        "HLA-B*1502 mainly predicts SJS/TEN risk, while HLA-A*3101 is associated with a broader hypersensitivity spectrum; a negative result never replaces rash vigilance.",
        "Carbamazepine treats true trigeminal neuralgia but is not a general-purpose painkiller because the benefit comes from suppressing ectopic neural firing."
      ],
      populationRisks: populationRisks(
        "Children can metabolize the active epoxide faster and require syndrome-specific dosing; rash, blood counts, sodium, and school performance need active surveillance because exposure, immune toxicity, hyponatremia, and learning effects can change during growth.",
        "Older adults have greater SIADH, falls, conduction disease, and interaction risk because renal water handling and medication reserve are reduced.",
        "Carbamazepine can cause fetal harm and lowers hormonal-contraceptive exposure through enzyme induction, so preconception planning and effective alternative or backup contraception are essential."
      ),
      sourceNote: "Current U.S. carbamazepine labeling: https://dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=35298eaf-3478-4dfb-a629-298dd52713f0&type=pdf",
      tags: ["frontier-wave21", "carbamazepine", "Tegretol", "sodium channel", "autoinduction", "HLA-B*1502", "hyponatremia", "strict why closure"]
    }),

    drugCard({
      name: "Topiramate",
      aliases: ["Topamax", "Trokendi XR", "Qudexy XR", "Eprontia", "topirimate", "topiramite", "TPM", "carbonic anhydrase seizure drug"],
      brandExamples: ["Topamax", "Trokendi XR", "Qudexy XR", "Eprontia"],
      class: "Broad-spectrum sulfamate antiseizure and migraine-prevention drug with sodium-channel, GABA-A, AMPA/kainate, and carbonic-anhydrase effects",
      classPathway: ["Neurologic medication", "Broad-spectrum antiseizure drug", "Multimodal excitation-inhibition control and renal bicarbonate loss"],
      usedToTreat: "Focal and primary generalized tonic-clonic seizures, Lennox-Gastaut-associated seizures, and migraine prevention; in fixed-dose phentermine/topiramate, chronic weight management. It prevents migraine rather than aborting an attack because network excitability changes require ongoing exposure rather than a single rescue dose.",
      description: "Topiramate is a broad-spectrum, multi-mechanism antiseizure and migraine-prevention drug that reduces excitation and increases inhibition, but its carbonic-anhydrase effect gives it a distinctive renal and thermoregulatory identity. It limits repetitive sodium-channel firing, enhances selected GABA-A currents, reduces AMPA/kainate glutamate signaling, and weakly inhibits carbonic anhydrase. The last action causes renal bicarbonate loss, creating hyperchloremic non-anion-gap metabolic acidosis, alkaline urine, hypocitraturia, and kidney-stone risk. It can also reduce sweating, cause hyperthermia, slow word retrieval and attention, trigger acute myopia with secondary angle closure, and increase fetal oral-cleft and small-for-gestational-age risk. These are mechanistically connected effects, not an unrelated list.",
      mechanism: "Topiramate prolongs inactivated sodium-channel states, positively modulates some GABA-A receptor currents, antagonizes AMPA/kainate glutamate receptors, and inhibits carbonic-anhydrase isoenzymes. Reduced sodium-channel availability and glutamate transmission limit excitatory propagation, while stronger GABA currents increase inhibitory restraint. Renal carbonic-anhydrase inhibition reduces bicarbonate reclamation, so bicarbonate leaves in urine, chloride rises to preserve electroneutrality, and serum develops a normal-anion-gap acidosis. More alkaline urine and lower urinary citrate reduce calcium-stone inhibition, explaining nephrolithiasis. Reduced sweat production impairs evaporative cooling, especially in children or hot environments. The precise migraine-prevention mechanism is not fully established but likely involves reduced cortical spreading excitability and trigeminovascular signaling.",
      boxedWarning: "No current U.S. boxed warning. Urgent non-boxed dangers include acute myopia with secondary angle-closure glaucoma, severe metabolic acidosis, oligohidrosis with hyperthermia, hyperammonemia or hypothermia especially with valproate, serious rash, suicidal thinking, and fetal oral-cleft or growth risk. Absence of a box does not justify continuing through sudden eye pain or unexplained acidosis.",
      adverseEffects: [
        "Paresthesias, appetite or weight loss, fatigue, dizziness, psychomotor slowing, memory difficulty, and word-finding problems occur because carbonic-anhydrase and broad cortical signaling effects extend beyond seizure networks.",
        "Hyperchloremic non-anion-gap metabolic acidosis occurs because renal bicarbonate is lost; chronic acidosis can impair growth, worsen bone mineralization, increase stones, and stress respiration.",
        "Kidney stones occur because urine becomes more alkaline and citrate falls, removing a natural inhibitor of calcium crystallization.",
        "Oligohidrosis and hyperthermia occur because sweating is impaired, so fever-like heat illness can develop during exercise or hot weather, especially in children.",
        "Acute myopia and secondary angle closure can threaten vision because ciliochoroidal effusion shifts the lens-iris diaphragm forward rather than creating ordinary open-angle glaucoma."
      ],
      contraindications: [
        "Do not continue through sudden blurred vision, eye pain, redness, or halos because rapid drug withdrawal and ophthalmic pressure management are needed to prevent permanent visual loss.",
        "Avoid combining casually with another carbonic-anhydrase inhibitor or ketogenic diet because additive bicarbonate loss and urine chemistry increase acidosis and stone risk.",
        "Do not stop abruptly when used for seizures or at higher chronic doses because withdrawal can increase seizure frequency even in a patient taking it for another indication.",
        "Avoid use in pregnancy for migraine prevention and carefully reassess any reproductive use because first-trimester exposure increases oral-cleft risk and fetal growth restriction is reported."
      ],
      nursingEssentials: [
        "Obtain baseline and periodic serum bicarbonate because fatigue, tachypnea, anorexia, arrhythmia, or cognitive change can be consequences of metabolic acidosis rather than routine adjustment.",
        "Teach hydration and monitor flank pain or hematuria because higher urine pH and lower citrate favor calcium stones.",
        "Ask specifically about sweating, heat exposure, exercise, fever, confusion, and hot dry skin because oligohidrosis can convert warm weather into a medical emergency.",
        "Track cognition, school or work function, weight, mood, and vision because subtle word-finding or attention decline may be the dose-limiting toxicity before a laboratory abnormality appears."
      ],
      interactions: [
        "Valproate can add hyperammonemia and hypothermia because the combination perturbs ammonia and mitochondrial handling; mental-status or temperature change needs ammonia and metabolic evaluation.",
        "Other carbonic-anhydrase inhibitors and ketogenic diets add acidosis and stone risk because bicarbonate loss and acid load converge.",
        "Topiramate can reduce estrogen-containing contraceptive exposure at higher doses and carries fetal risk, so contraceptive effectiveness and breakthrough bleeding require review rather than reassurance.",
        "CNS depressants and alcohol add cognitive and coordination impairment because topiramate already slows cortical processing."
      ],
      keyLabs: [
        "Check baseline and periodic bicarbonate, chloride, renal function, and clinical acid-base status because the characteristic toxicity is hyperchloremic non-anion-gap acidosis.",
        "Check ammonia when unexplained lethargy, vomiting, cognitive decline, or hypothermia occurs, especially with valproate, because transaminases may not identify the problem.",
        "Trend weight, growth, bone health, and urine-stone clues because chronic acidosis affects more than a single chemistry value.",
        "Routine topiramate levels are not usually the primary monitoring tool because symptoms, renal function, bicarbonate, and seizure or migraine response better answer common clinical questions."
      ],
      nclexTraps: [
        "Topiramate causes a normal-anion-gap acidosis because bicarbonate is lost and chloride rises, not because unmeasured ketoacids accumulate.",
        "Stone risk comes from alkaline urine plus low citrate even though the blood is acidotic; serum and urine can move in opposite pH directions.",
        "Acute angle closure is an urgent drug reaction, not a reason to wait for a routine eye appointment.",
        "Taper the topiramate component of phentermine/topiramate because abrupt withdrawal can provoke seizures even in a patient without known epilepsy."
      ],
      populationRisks: populationRisks(
        "Children have greater oligohidrosis, hyperthermia, growth, and cognitive vulnerability because heat regulation and learning demands are high.",
        "Renal decline increases exposure and stone or acidosis risk, while cognitive slowing and falls can be mistaken for aging because symptoms are nonspecific.",
        "Oral-cleft and fetal-growth risks require preconception planning, pregnancy testing when indicated, and effective contraception; abrupt seizure-drug withdrawal also threatens maternal and fetal safety."
      ),
      sourceNote: "Current U.S. Topamax labeling: https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=21628112-0c47-11df-95b3-498d55d89593&version=30",
      tags: ["frontier-wave21", "topiramate", "Topamax", "AMPA", "GABA", "carbonic anhydrase", "metabolic acidosis", "kidney stone", "strict why closure"]
    }),

    drugCard({
      name: "Ethosuximide",
      aliases: ["Zarontin", "ethosuxamide", "ethosuximide absence", "succinimide", "absence seizure drug", "3 Hz spike wave drug"],
      brandExamples: ["Zarontin"],
      class: "Succinimide antiseizure medication that suppresses thalamic T-type calcium currents in typical absence epilepsy",
      classPathway: ["Neurologic medication", "Absence-seizure drug", "Thalamocortical T-type calcium-current suppression"],
      usedToTreat: "Typical absence seizures characterized by brief impaired awareness and generalized 3-Hz spike-wave activity. It is narrow spectrum and does not protect against generalized tonic-clonic seizures, so valproate or another broad-spectrum strategy may be preferred when absence and tonic-clonic seizures coexist.",
      description: "Ethosuximide suppresses low-threshold T-type calcium currents in thalamocortical circuits, interrupting the 3-Hz oscillation that produces typical absence seizures without broadly treating focal or tonic-clonic seizures. Typical absence epilepsy is sustained by rhythmic thalamocortical bursting in which these channels help relay neurons rebound and synchronize. Its specificity explains both its strength and its limit: it is highly useful for isolated typical absence seizures but does not cover generalized tonic-clonic or focal seizures. The major monitoring concerns are GI intolerance, fatigue or headache, mood change, rare blood dyscrasia, serious rash or DRESS, lupus-like disease, and liver or kidney dysfunction.",
      mechanism: "After inhibitory hyperpolarization, thalamic relay neurons recover T-type calcium channels from inactivation. A low-threshold calcium burst then triggers rhythmic cortical-thalamic firing, producing generalized 3-Hz spike-wave discharges and brief lapses of awareness. Ethosuximide reduces low-threshold T-type calcium current in these neurons, weakening the rebound burst and breaking the oscillator. This mechanism targets the electrophysiology of typical absence rather than the high-frequency sodium-channel firing dominant in focal seizures. The drug is absorbed orally and metabolized mainly in the liver, with a relatively long half-life, so dose changes should be gradual and abrupt withdrawal can allow absence seizures or status to recur.",
      boxedWarning: "No current U.S. boxed warning. Serious labeled risks include potentially fatal blood dyscrasias, SJS, DRESS, systemic lupus erythematosus, suicidal thinking, and liver or kidney abnormalities. Fever, sore throat, mucosal injury, facial edema, rash, unusual bruising, or profound fatigue should trigger urgent evaluation because a rare immune or marrow reaction can begin with ordinary-looking symptoms.",
      adverseEffects: [
        "Nausea, abdominal pain, hiccups, anorexia, vomiting, and weight loss are common because gastrointestinal intolerance is a major exposure-limiting effect.",
        "Drowsiness, fatigue, dizziness, headache, ataxia, irritability, or behavioral change can occur because thalamocortical signaling also contributes to attention and arousal.",
        "Leukopenia, agranulocytosis, aplastic anemia, or pancytopenia can occur rarely because marrow production may be suppressed, sometimes with fatal outcome.",
        "SJS, DRESS, lupus-like disease, hepatic injury, and renal abnormalities can occur because immune toxicity may involve skin and multiple organs."
      ],
      contraindications: [
        "Do not use after hypersensitivity to ethosuximide or another succinimide because cross-reactive serious immune reactions can recur.",
        "Do not choose ethosuximide alone when generalized tonic-clonic seizures also require protection because its T-type specificity does not provide broad seizure coverage.",
        "Do not stop abruptly because absence seizures can recur or progress to absence status when thalamocortical suppression is suddenly removed.",
        "Use extreme caution in significant liver or kidney disease because metabolism and elimination may be impaired and labeled organ abnormalities can worsen."
      ],
      nursingEssentials: [
        "Ask family or teachers to count staring spells and note immediate return to activity because absence seizures are brief and can be mistaken for inattention, while treatment response may be more visible outside the clinic.",
        "Obtain periodic CBC and promptly repeat it for fever, sore throat, infection, bruising, or pallor because blood dyscrasia may present symptomatically between scheduled checks.",
        "Monitor rash, mucosa, fever, facial swelling, nodes, urine, liver symptoms, mood, and suicidality because serious reactions extend beyond common GI upset.",
        "Titrate gradually and measure liquid accurately because a long half-life delays the full effect of each dose change."
      ],
      interactions: [
        "Valproate can increase or variably alter ethosuximide exposure because hepatic metabolism and co-therapy effects differ among patients, so clinical response and levels may need reassessment.",
        "Enzyme-inducing antiseizure drugs can lower ethosuximide concentration because hepatic clearance accelerates.",
        "Alcohol and sedating medicines add drowsiness and impaired coordination because their CNS effects overlap despite different molecular targets."
      ],
      keyLabs: [
        "A general ethosuximide reference concentration is 40 to 100 mcg/mL, but use a timed level for adherence, toxicity, interaction, or uncontrolled seizures because response remains the primary target.",
        "Monitor CBC, liver tests, renal function or urinalysis, and clinical immune symptoms because a therapeutic concentration does not exclude marrow, hepatic, renal, or hypersensitivity toxicity.",
        "Use EEG and event history to confirm seizure classification and response because treating daydreaming as absence or absence as inattention leads to the wrong therapy."
      ],
      nclexTraps: [
        "Ethosuximide is first-line for isolated typical absence seizures because it targets the T-type thalamic oscillator, not because it is the broadest antiseizure drug.",
        "If tonic-clonic seizures coexist, ethosuximide monotherapy is incomplete because it does not protect that seizure type.",
        "Typical absence often has immediate recovery without a prolonged postictal state, helping separate it from many focal impaired-awareness seizures.",
        "Fever plus sore throat is not routine adaptation because it can signal agranulocytosis or another blood dyscrasia."
      ],
      populationRisks: populationRisks(
        "Typical absence often begins in childhood, so school observations, weight-based titration, behavior, and growth help measure both efficacy and toxicity because brief seizures and subtle adverse effects may be visible to teachers before they appear in clinic.",
        "Older adults may have slower clearance and more falls from dizziness or sedation because liver, kidney, and CNS reserve are reduced.",
        "Pregnancy data are less extensive than for some alternatives; balance maternal seizure control against fetal exposure and avoid abrupt withdrawal because uncontrolled seizures also cause harm."
      ),
      sourceNote: "Current U.S. ethosuximide labeling: https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=a040dab2-0d70-4c02-a830-5ba1e3506a1b",
      tags: ["frontier-wave21", "ethosuximide", "Zarontin", "absence seizure", "T-type calcium", "3 Hz", "strict why closure"]
    }),

    drugCard({
      name: "Lacosamide",
      aliases: ["Vimpat", "Motpoly XR", "lacosimide", "lacosomide", "slow sodium inactivation drug", "PR interval seizure drug", "LCM"],
      brandExamples: ["Vimpat", "Motpoly XR"],
      class: "Functionalized-amino-acid antiseizure medication that enhances slow inactivation of voltage-gated sodium channels",
      classPathway: ["Neurologic medication", "Focal and generalized tonic-clonic antiseizure drug", "Slow sodium-channel inactivation and cardiac PR conduction"],
      usedToTreat: "Monotherapy or adjunctive treatment of focal-onset seizures and adjunctive treatment of primary generalized tonic-clonic seizures in label-specified ages. IV lacosamide can temporarily replace oral dosing when enteral administration is not feasible, but a loading dose requires medical supervision because CNS and cardiac adverse effects rise rapidly.",
      description: "Lacosamide is a Schedule V antiseizure drug that stabilizes hyperexcitable neurons by enhancing slow, rather than classic fast, inactivation of voltage-gated sodium channels. This reduces the channel pool available during sustained depolarization and repetitive firing. Its cleanest teaching contrast is with phenytoin or carbamazepine: all affect sodium channels, but lacosamide's slow-inactivation preference and lower enzyme-induction burden come with a distinctive cardiac warning. It can prolong the PR interval and has caused bradycardia, AV block, atrial arrhythmia, ventricular tachyarrhythmia, asystole, cardiac arrest, and death, especially in patients with structural disease, conduction disorders, Brugada syndrome, or other conduction-slowing drugs.",
      mechanism: "Voltage-gated sodium channels enter fast inactivation after each action potential and slow inactivation during longer depolarization. Lacosamide selectively enhances the slow-inactivated state, reducing the number of channels available to sustain prolonged hyperexcitability while having less effect on ordinary brief firing. The exact full human antiseizure mechanism remains incompletely defined. Cardiac conduction also depends on sodium-channel availability; greater exposure or reduced conduction reserve can delay atrial-to-ventricular transmission, lengthening PR and progressing to bradycardia or AV block. Lacosamide and its metabolite are eliminated mainly through the kidney, its half-life is about 13 hours, and hemodialysis removes roughly 50% in 4 hours, explaining renal dose limits and post-dialysis supplementation.",
      boxedWarning: "No current U.S. boxed warning. Serious labeled conduction risks include dose-dependent PR prolongation, bradycardia, AV block, ventricular tachyarrhythmia, rare asystole, cardiac arrest, and death. Obtain an ECG before treatment and after titration to steady state in patients with proarrhythmic disease or conduction-active co-medications because a small average PR effect can become dangerous when reserve is limited.",
      adverseEffects: [
        "Dizziness, diplopia, nausea, headache, somnolence, and ataxia occur because sodium-channel suppression affects vestibular and cerebellar signaling, especially during titration or above 400 mg/day.",
        "PR prolongation, bradycardia, AV block, ventricular arrhythmia, atrial fibrillation or flutter, and syncope can occur because cardiac sodium-channel reserve and AV conduction are affected.",
        "DRESS, hypersensitivity, suicidal thinking, and rare hepatic injury can occur because serious immune or neuropsychiatric effects are independent of routine level monitoring.",
        "Euphoria-type effects and misuse potential occur because lacosamide is a Schedule V controlled substance, although abrupt withdrawal risk in epilepsy is primarily seizure recurrence rather than a classic dependence syndrome."
      ],
      contraindications: [
        "The current U.S. label lists no absolute contraindication, but use strong caution in marked first-degree AV block, second- or higher-degree block, sick-sinus syndrome without a pacemaker, structural heart disease, ischemia, heart failure, or Brugada syndrome because conduction reserve is reduced.",
        "Do not combine casually with sodium-channel blockers, beta blockers, calcium-channel blockers, potassium-channel blockers, or other PR-prolonging drugs because additive conduction slowing can produce block or arrhythmia.",
        "Do not use the full maximum dose unchanged in severe renal or hepatic impairment because reduced elimination increases exposure; current labeling reduces the maximum by 25% in those settings.",
        "Do not stop abruptly because current labeling recommends withdrawal over at least 1 week to reduce increased seizure frequency."
      ],
      nursingEssentials: [
        "Screen for syncope, palpitations, bradycardia, conduction disease, structural heart disease, diabetes-related cardiac risk, and conduction-active medicines because the ECG warning is strongest when another vulnerability is present.",
        "Obtain baseline and post-titration ECG in at-risk patients and monitor closely during IV or loading administration because peak exposure can reveal bradycardia or AV block quickly.",
        "Assess dizziness, gait, diplopia, falls, and driving safety during titration because CNS adverse effects are most common when the dose is changing.",
        "Taper over at least 1 week when discontinuing because sudden removal of seizure suppression can increase seizure frequency."
      ],
      interactions: [
        "Conduction-slowing drugs add PR prolongation, bradycardia, or AV block because their electrophysiologic effects converge even without a CYP interaction.",
        "Strong CYP3A4 or CYP2C9 inhibitors can increase lacosamide exposure in renal or hepatic impairment because alternative clearance pathways are already limited.",
        "Hemodialysis removes about half of exposure over 4 hours, so a post-dialysis supplement of up to 50% may be considered because the procedure abruptly lowers concentration."
      ],
      keyLabs: [
        "Trend creatinine clearance because severe renal impairment requires a lower maximum and dialysis substantially removes the drug.",
        "Assess hepatic function because mild or moderate impairment lowers the recommended maximum and severe impairment lacks adequate pharmacokinetic evidence.",
        "Use ECG and symptoms rather than routine serum level alone to detect the defining toxicity because PR prolongation and syncope are electrophysiologic outcomes.",
        "Routine lacosamide levels are not universally required, but a timed level can answer adherence, pregnancy, interaction, renal change, or unexplained toxicity questions."
      ],
      nclexTraps: [
        "Lacosamide enhances slow sodium-channel inactivation, not the classic fast-inactivation pattern emphasized for phenytoin and carbamazepine.",
        "It prolongs PR rather than primarily QT, so the high-yield concern is AV conduction and bradyarrhythmia.",
        "No listed absolute contraindication does not make it appropriate in advanced conduction disease because serious postmarketing arrhythmias have occurred at prescribed doses.",
        "A 4-hour dialysis session removes about 50%, so forgetting the supplement can lower seizure protection while forgetting renal reduction can raise toxicity between sessions."
      ],
      populationRisks: populationRisks(
        "Use label-specific weight dosing and monitor cardiac and CNS effects because pediatric formulations and exposure differ by size.",
        "Conduction disease, structural heart disease, renal decline, and falls make slow titration and ECG review especially important because reserve is reduced.",
        "Pregnancy data remain limited and clearance may change; plan seizure control and postpartum reassessment rather than abruptly stopping effective therapy."
      ),
      sourceNote: "Current U.S. Vimpat labeling: https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=9e79b42c-38a3-4b2c-a196-a5a1948250e2&type=display",
      tags: ["frontier-wave21", "lacosamide", "Vimpat", "slow inactivation", "PR interval", "renal dosing", "Schedule V", "strict why closure"]
    }),

    drugCard({
      name: "Perampanel",
      aliases: ["Fycompa", "perampanell", "perampanel AMPA", "AMPA antagonist seizure drug", "noncompetitive AMPA antagonist", "PER"],
      brandExamples: ["Fycompa"],
      class: "Schedule III noncompetitive AMPA glutamate-receptor antagonist antiseizure medication",
      classPathway: ["Neurologic medication", "Focal and generalized tonic-clonic antiseizure drug", "Postsynaptic AMPA-receptor antagonism"],
      usedToTreat: "Focal-onset seizures with or without bilateral tonic-clonic spread in patients age 4 years and older and adjunctive treatment of primary generalized tonic-clonic seizures in patients age 12 years and older. It is taken once daily, usually at bedtime, because its very long half-life supports daily dosing and sedation or dizziness is easier to manage during sleep.",
      description: "Perampanel is a long-acting noncompetitive AMPA glutamate-receptor antagonist that reduces the fast excitatory current recruiting neighboring neurons into focal or generalized tonic-clonic seizure propagation. Because it binds away from the glutamate site, increasing synaptic glutamate cannot simply outcompete the blockade. The major tradeoff is behavioral: aggression, hostility, anger, irritability, paranoia, psychosis, homicidal ideation, and threats have occurred in patients with or without prior psychiatric disease, especially during titration and at higher doses. Its half-life is roughly 105 hours, so accumulation and washout take weeks; a dose increase made today may not reveal its full benefit or toxicity for many days, which explains weekly or slower titration and continued monitoring after discontinuation.",
      mechanism: "AMPA receptors are ionotropic glutamate receptors that mediate much of the brain's fast excitatory sodium and calcium-permeable postsynaptic current. Perampanel binds an allosteric site and noncompetitively reduces AMPA activation, limiting depolarization and seizure propagation even when glutamate concentration rises. It does not directly block NMDA receptors. The drug is extensively metabolized, mainly by CYP3A4 and CYP3A5, and has a very long terminal half-life. Carbamazepine, phenytoin, oxcarbazepine, and other CYP3A inducers lower exposure because metabolism accelerates; withdrawal of an inducer can then raise perampanel over days to weeks. Slow accumulation explains why titration must respect delayed steady state rather than chasing an immediate response.",
      boxedWarning: "BOXED WARNING: Serious or life-threatening psychiatric and behavioral reactions, including aggression, hostility, irritability, anger, homicidal ideation, and threats, have occurred with or without prior psychiatric history. Monitor closely during titration, at higher doses, and after discontinuation because the long half-life prolongs exposure; reduce the dose for emerging symptoms and discontinue immediately when reactions are severe or worsening.",
      adverseEffects: [
        "Dizziness, gait disturbance, somnolence, fatigue, falls, and ataxia occur because AMPA-mediated excitation is required for normal balance and alertness as well as seizure spread.",
        "Aggression, hostility, anger, paranoia, psychosis, suicidal thinking, or homicidal ideation can occur because glutamate signaling also regulates limbic behavior and impulse control.",
        "Weight gain can occur because central appetite and activity networks are altered even though the drug is not an endocrine therapy.",
        "Falls and serious injury increase at higher doses and in older adults because dizziness, ataxia, sedation, and slowed reaction combine."
      ],
      contraindications: [
        "The current U.S. label lists no absolute contraindication, but severe or worsening psychiatric-behavioral reaction requires immediate discontinuation because continued exposure can endanger the patient or others.",
        "Do not titrate faster than label and patient context allow because the approximately 105-hour half-life means a new dose accumulates for weeks and early tolerance does not prove the eventual steady-state dose is safe.",
        "Do not use in severe hepatic impairment, severe renal impairment, or hemodialysis when current labeling does not recommend it because exposure and safety are not adequately controlled.",
        "Do not stop or change an enzyme inducer without reassessing perampanel because its concentration can rise after the inducer is removed even though the perampanel dose is unchanged."
      ],
      nursingEssentials: [
        "Obtain baseline behavior, aggression, mood, psychosis, substance-use, fall, and caregiver history because new symptoms must be distinguished from preexisting patterns and may be more visible to family.",
        "Ask directly about anger, threats, violent thoughts, paranoia, suicidal thinking, and unusual personality change during titration and after stopping because the boxed toxicity can be concealed by embarrassment or poor insight.",
        "Titrate no more often than weekly in many patients and every 2 weeks in older adults or hepatic impairment because the long half-life delays steady state and adverse effects.",
        "Give at bedtime and reinforce fall precautions because dizziness and somnolence are common, but bedtime dosing does not eliminate next-day impairment."
      ],
      interactions: [
        "Carbamazepine, phenytoin, oxcarbazepine, and other CYP3A inducers lower perampanel concentration because hepatic metabolism accelerates, often requiring a different starting strategy and close response monitoring.",
        "Stopping a CYP3A inducer can raise perampanel slowly because the enzyme effect fades while the drug's own half-life is long, so delayed toxicity is possible.",
        "At 12 mg daily, perampanel can reduce levonorgestrel-containing contraceptive effectiveness, so additional nonhormonal contraception is advised during use and for 1 month after discontinuation because residual long-lived drug can continue lowering levonorgestrel exposure after the last dose.",
        "Alcohol and CNS depressants add sedation, dizziness, and behavioral disinhibition because their pharmacodynamic effects overlap."
      ],
      keyLabs: [
        "Routine serum concentration is not the primary safety test; behavior, falls, seizure frequency, dose timing, and interacting inducers reveal the most important clinical effects.",
        "Assess liver function before and during use when impairment or interacting drugs are present because hepatic metabolism governs the long exposure tail and lowers recommended maximum doses.",
        "Assess renal function because severe impairment and hemodialysis are not recommended under current labeling.",
        "Review pregnancy and contraception because 12 mg can lower levonorgestrel exposure and fetal data remain limited."
      ],
      nclexTraps: [
        "Behavioral toxicity can occur without a psychiatric history, so a normal baseline does not eliminate boxed-warning surveillance because severe aggression, psychosis, or homicidal thinking may begin only after exposure rises.",
        "Perampanel is a noncompetitive AMPA antagonist, so it reduces fast glutamate excitation at an allosteric site rather than competing with glutamate at its binding pocket.",
        "The long half-life explains once-daily dosing, slow titration, delayed toxicity, and continued monitoring after discontinuation.",
        "A CYP3A inducer can make perampanel seem ineffective; removing that inducer without dose review can later uncover excessive exposure."
      ],
      populationRisks: populationRisks(
        "Behavior, aggression, school function, growth, and age-specific indications require caregiver surveillance because children may not verbalize psychiatric change.",
        "Titrate at least every 2 weeks in older adults because falls, sedation, and delayed accumulation are more consequential when physiologic reserve is reduced.",
        "Pregnancy data are limited and contraceptive interaction is dose dependent; plan seizure control and effective contraception rather than abruptly withdrawing therapy."
      ),
      sourceNote: "Current U.S. Fycompa labeling: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=71cf3309-e182-473c-8b0b-280cabd0e122",
      tags: ["frontier-wave21", "perampanel", "Fycompa", "AMPA", "glutamate", "aggression", "boxed warning", "strict why closure"]
    })
  ];

  const pathologyCards = [
    {
      name: "Hyperammonemic encephalopathy",
      category: "Neurologic and metabolic emergency",
      aliases: ["hyperammonemia encephalopathy", "ammonia brain toxicity", "valproate encephalopathy", "high ammonia confusion", "urea cycle encephalopathy"],
      pronunciation: "hy-per-am-moh-NEE-mik en-sef-ah-LOP-ah-thee",
      wordOrigin: "Hyper- means excessive, ammon- refers to ammonia, -emia means in the blood, encephalo- means brain, and -pathy means disease or dysfunction.",
      definition: "Hyperammonemic encephalopathy is acute or subacute brain dysfunction caused by ammonia accumulation, presenting with vomiting, lethargy, confusion, behavioral change, ataxia, asterixis, seizures, hypothermia, cerebral edema, coma, or unexplained failure to recover. It may result from severe liver failure, a urea-cycle disorder, portosystemic shunting, valproate, or a high catabolic load. A normal AST/ALT does not exclude it because ammonia disposal can fail without hepatocyte necrosis.",
      etiology: "Major causes include acute or chronic hepatic failure, portosystemic shunting, inherited urea-cycle defects, valproate with or without topiramate, GI bleeding, infection, constipation, dehydration, high protein or catabolic stress, renal failure, and selected drugs or tumors that increase nitrogen load or impair disposal.",
      pathology: "Ammonia crosses the blood-brain barrier and is incorporated into glutamine inside astrocytes. Glutamine acts osmotically, drawing water into cells, while altered neurotransmission, oxidative stress, mitochondrial dysfunction, and impaired cerebral energy metabolism disturb cortical and subcortical networks.",
      pathophysiology: "The urea cycle normally converts neurotoxic nitrogen to urea for renal excretion. Liver failure, shunting, inherited enzyme deficiency, or valproate-related mitochondrial and carnitine effects reduces this clearance. Astrocytic glutamine synthetase temporarily detoxifies ammonia by combining it with glutamate, but accumulated glutamine causes astrocyte swelling and depletes neurotransmitter pools. Acute severe rises can increase intracranial pressure and cause herniation; chronic hepatic disease may produce a less abrupt but still clinically important network dysfunction. Venous ammonia helps support the diagnosis but imperfectly tracks severity, so mental status and cause matter more than one number.",
      riskFactors: [
        "Valproate, especially with topiramate, fasting, carnitine depletion, liver disease, or an unrecognized urea-cycle disorder because mitochondrial ammonia disposal is stressed.",
        "Acute liver failure or portosystemic shunting because portal nitrogen bypasses functional hepatocyte urea conversion.",
        "GI bleeding, infection, constipation, dehydration, seizures, trauma, or high catabolic state because protein breakdown and gut nitrogen delivery rise.",
        "Infancy, unexplained recurrent vomiting, developmental change, or family history because a urea-cycle disorder may first appear under metabolic stress."
      ],
      signsSymptoms: [
        "Subtle sleep reversal, irritability, slowed thinking, inattention, or behavior change can precede obvious lethargy because cortical network dysfunction evolves before coma.",
        "Vomiting, ataxia, asterixis, dysarthria, hypothermia, seizure worsening, or failure to awaken suggests more advanced toxicity because motor and arousal pathways are involved.",
        "Cerebral edema, abnormal posturing, bradycardia with hypertension, or coma is a medical emergency because intracranial pressure and herniation may be developing."
      ],
      diagnostics: [
        "Measure ammonia with careful collection and prompt processing because tourniquet time, fist clenching, delay, and sample handling can falsely elevate the result.",
        "Check liver tests, bilirubin, INR, glucose, electrolytes, renal function, blood gas, lactate, CBC, infection studies, medication levels, and toxicology because ammonia is a syndrome marker and the cause directs treatment.",
        "With valproate exposure, obtain valproate concentration but do not require a toxic level or abnormal transaminases because hyperammonemia can occur at therapeutic total concentrations.",
        "Use EEG when persistent unresponsiveness could be nonconvulsive status because encephalopathy and ongoing seizure can coexist and look similar."
      ],
      labs: [
        "Ammonia supports diagnosis and trend but does not perfectly correlate with clinical grade because brain exposure, chronicity, collection quality, and individual vulnerability differ.",
        "INR, bilirubin, glucose, lactate, and transaminases identify hepatic synthetic failure or mitochondrial stress, while normal transaminases do not exclude valproate-related disease.",
        "Plasma amino acids, urine orotic acid, and metabolic-genetics testing may identify a urea-cycle disorder because adult or postpartum presentation can occur after years of compensation."
      ],
      treatments: [
        "Stop or reverse the precipitant, support airway and circulation, treat infection, bleeding, constipation, dehydration, or catabolism, and involve toxicology, hepatology, neurology, or metabolic specialists because ammonia will recur if its source remains active.",
        "For valproate toxicity, discontinue valproate and consider L-carnitine and dialysis according to severity and specialist guidance because mitochondrial beta-oxidation and ammonia handling may improve when carnitine is restored and drug is removed.",
        "For hepatic encephalopathy, lactulose and selected rifaximin use reduce gut-derived nitrogen through different mechanisms, while acute liver failure with cerebral edema requires critical-care and transplant-center management.",
        "Treat seizures while avoiding unnecessary prolonged sedation because ongoing electrical activity worsens catabolism, but oversedation can hide neurologic decline."
      ],
      nursingPriorities: [
        "Trend mental status, airway protection, pupils, motor findings, temperature, intake and output, glucose, and seizure activity because deterioration can be rapid and one ammonia number cannot replace serial assessment.",
        "Review valproate, topiramate, liver disease, bowel pattern, GI bleeding, nutrition, infection, and recent fasting because identifying the nitrogen or clearance trigger changes immediate treatment.",
        "Escalate worsening somnolence, repeated vomiting, new seizure, abnormal posturing, or bradycardia with hypertension because cerebral edema or herniation may be developing."
      ],
      complications: [
        "Cerebral edema, intracranial hypertension, herniation, seizure, aspiration, coma, and death because astrocyte swelling and network dysfunction can progress rapidly.",
        "Recurrent episodes and cognitive decline when the liver, shunt, medication, or inherited metabolic cause remains untreated.",
        "Treatment-related dehydration, sodium change, or aspiration when cathartic therapy is used without close volume and airway monitoring."
      ],
      redFlags: [
        "Rapidly worsening consciousness, repeated vomiting, new focal findings, abnormal posturing, or inability to protect the airway.",
        "Pregnancy or postpartum catabolic stress with unexplained encephalopathy because a urea-cycle disorder can first decompensate in this setting.",
        "Valproate plus topiramate with confusion, hypothermia, vomiting, or seizure worsening even when liver tests appear normal."
      ],
      patientEducation: [
        "Report new confusion, severe sleepiness, vomiting, balance change, temperature drop, or increased seizures immediately because these are not routine valproate adjustment symptoms.",
        "Do not stop an antiseizure drug without urgent clinical guidance unless emergency clinicians direct it because abrupt withdrawal can add status epilepticus to the metabolic emergency.",
        "Follow the bowel, infection, diet, and medication plan for hepatic disease because recurrence often begins with a preventable trigger."
      ],
      nclexTraps: [
        "Normal liver enzymes do not rule out hyperammonemic encephalopathy because urea-cycle and mitochondrial dysfunction can occur without hepatocyte necrosis.",
        "Ammonia level and clinical severity do not move perfectly together, so treat the patient and cause rather than waiting for an arbitrary number.",
        "Persistent unresponsiveness may be both encephalopathy and nonconvulsive status, so EEG can be essential."
      ],
      sourceNote: "Current U.S. valproate labeling and peer-reviewed hepatic/urea-cycle physiology.",
      sourceKeys: ["dailymed-depakote", "hyperammonemia-physiology"],
      nclexEssential: true,
      tags: ["frontier-wave21", "hyperammonemia", "encephalopathy", "valproate", "urea cycle", "ammonia"]
    },
    {
      name: "Free drug concentration and protein binding",
      category: "Clinical pharmacology",
      aliases: ["free drug level", "unbound concentration", "total versus free level", "low albumin drug toxicity", "free phenytoin", "free valproate"],
      pronunciation: "free drug con-sen-TRAY-shun and PRO-teen BIND-ing",
      wordOrigin: "Free means not bound to a carrier protein. Concentration describes the amount in a given volume; protein binding describes reversible attachment to albumin or other plasma proteins.",
      definition: "Free drug concentration is the unbound fraction of a medication in plasma that can cross membranes, bind receptors, distribute into tissues, be metabolized, and be filtered. Total concentration combines free plus protein-bound drug. When albumin, renal function, competing drugs, pregnancy, critical illness, or saturable binding changes, the same total number can represent very different active exposure.",
      etiology: "Protein binding changes with hypoalbuminemia, uremia, liver disease, pregnancy, malnutrition, burns, critical illness, hyperbilirubinemia, high drug concentration, and displacement by another highly bound compound. Phenytoin and valproate are classic high-yield examples.",
      pathology: "This is pharmacokinetic physiology rather than a disease. Harm occurs when a total level is interpreted as active exposure despite an abnormal free fraction, leading clinicians to increase an already toxic dose or decrease effective therapy unnecessarily.",
      pathophysiology: "Albumin-bound drug is in reversible equilibrium with unbound drug. Only unbound molecules readily leave plasma and reach receptors or clearance organs. A lower albumin concentration or competing ligand reduces available binding sites, raising the fraction free. Total concentration may then fall because free drug distributes and is cleared, while the free concentration remains therapeutic or toxic. Saturable binding can make the free fraction rise nonlinearly at high valproate concentrations. Uremic toxins also displace phenytoin. Correction equations estimate these effects but cannot capture every critical-illness interaction, so direct free measurement is preferred when decisions are high consequence.",
      riskFactors: [
        "Albumin below the usual range because fewer binding sites increase the fraction of free highly bound drug.",
        "Renal failure or uremia because retained organic acids compete for albumin binding even when albumin concentration is not profoundly low.",
        "Pregnancy, critical illness, burns, malnutrition, liver disease, or interacting highly bound drugs because distribution and binding change quickly.",
        "High valproate concentration because albumin binding becomes saturated and free exposure rises disproportionately."
      ],
      signsSymptoms: [
        "Phenytoin toxicity with nystagmus, diplopia, ataxia, dysarthria, or confusion despite a low or normal total level.",
        "Valproate sedation, tremor, thrombocytopenia, or encephalopathy despite a total concentration that appears acceptable.",
        "A mismatch between expected response and measured total concentration after albumin, renal function, pregnancy, or interacting therapy changes."
      ],
      diagnostics: [
        "Order a direct free concentration when binding is abnormal and the result will change management because it measures the receptor-available fraction rather than estimating it.",
        "Record dose, formulation, administration and draw times because even a perfectly measured free level is misleading if sampled at an uninterpretable time.",
        "Interpret albumin, creatinine/eGFR, bilirubin, pregnancy, critical illness, and interacting drugs alongside the result because they explain why free and total diverge."
      ],
      labs: [
        "General phenytoin anchors are total 10 to 20 mcg/mL and free 1 to 2 mcg/mL, but patient response and local methods remain decisive.",
        "Free valproate reference intervals vary by laboratory and indication because protein binding is saturable and assay methods differ.",
        "Albumin alone cannot fully correct uremic or displacement effects, so direct free measurement is more reliable when the clinical stakes are high."
      ],
      treatments: [
        "Adjust the medication from free exposure, symptoms, seizure control, and indication rather than forcing the total result into a reference interval.",
        "Treat the cause of binding change when possible, such as severe malnutrition or renal failure, because the fraction may shift again as the patient recovers.",
        "Repeat measurement after a meaningful dose, organ-function, pregnancy, dialysis, or interaction change because equilibrium and clearance will reset."
      ],
      nursingPriorities: [
        "Recognize the mismatch of toxicity plus a low total level because escalating the dose in that situation can cause severe harm.",
        "Document exact sample timing and albumin/renal context because the laboratory cannot reconstruct missing administration information.",
        "Assess gait, eye movements, speech, alertness, bruising, and seizure control because clinical effect remains the final measure of active exposure."
      ],
      complications: [
        "Drug toxicity after inappropriate dose escalation when a low total level hides a high free fraction.",
        "Breakthrough seizure after inappropriate dose reduction when a total value is above range but free exposure and response are appropriate.",
        "Rapidly changing exposure during dialysis, critical illness, pregnancy, or albumin recovery."
      ],
      redFlags: [
        "New ataxia, nystagmus, dysarthria, confusion, severe sedation, bleeding, or seizure change with abnormal albumin or renal function.",
        "A total level that conflicts sharply with bedside toxicity or efficacy.",
        "A large dose change proposed from a correction equation alone in a critically ill or uremic patient."
      ],
      patientEducation: [
        "A blood level is not simply high or low; the clinician also considers timing, protein binding, kidney and liver function, and symptoms.",
        "Report balance, vision, speech, confusion, unusual sleepiness, bruising, or seizure changes because those findings may reveal active exposure better than a total number.",
        "Do not change the dose from a portal result without clinician review because the unbound fraction may differ from the printed total."
      ],
      nclexTraps: [
        "Only unbound drug reaches receptors readily, so low albumin can produce toxicity at a low total concentration.",
        "Protein binding and metabolism are different concepts: a higher free fraction changes distribution and clearance, while enzyme saturation changes elimination rate.",
        "Correction formulas are estimates, not replacements for a free level when the patient is critically ill or the decision is high risk."
      ],
      sourceNote: "Current U.S. phenytoin and valproate labels plus clinical pharmacology principles.",
      sourceKeys: ["dailymed-dilantin", "dailymed-depakote"],
      nclexEssential: true,
      tags: ["frontier-wave21", "free drug", "protein binding", "albumin", "phenytoin", "valproate"]
    },
    {
      name: "Capacity-limited elimination",
      category: "Clinical pharmacokinetics",
      aliases: ["saturable metabolism", "Michaelis Menten drug elimination", "nonlinear phenytoin kinetics", "zero order phenytoin", "dose level not proportional"],
      pronunciation: "kuh-PASS-ih-tee LIM-it-ed ee-lim-ih-NAY-shun",
      wordOrigin: "Capacity refers to the maximum work a system can perform. Elimination is removal of drug by metabolism or excretion; capacity limited means the relevant pathway approaches saturation.",
      definition: "Capacity-limited elimination occurs when drug-metabolizing or transport pathways approach their maximum rate, so clearance no longer rises proportionally with concentration. Near saturation, a small dose increase can produce a large concentration rise and a longer apparent half-life. Phenytoin is the classic bedside example because saturation occurs within or near its therapeutic range.",
      etiology: "It appears when the amount of substrate approaches enzyme capacity, when inhibitors lower that capacity, when genetic variants slow metabolism, or when liver dysfunction reduces available enzyme. Ethanol and high-dose salicylate are other contexts, but phenytoin is the major antiseizure teaching example.",
      pathology: "This is a kinetic behavior rather than tissue pathology. Clinical harm occurs when proportional dosing assumptions are applied to a nonlinear drug, causing overshoot, delayed accumulation, and neurotoxicity.",
      pathophysiology: "At concentrations well below enzyme capacity, a roughly constant fraction is removed per unit time and dose changes produce near-proportional steady-state changes. As concentration approaches the Michaelis-Menten constant and maximum metabolic velocity, enzymes spend more time occupied. Elimination approaches a fixed amount per unit time, so additional input accumulates disproportionately. For phenytoin, CYP2C9 and CYP2C19 capacity can be approached in the therapeutic range; the half-life is therefore not fixed and steady state can take longer as concentration rises.",
      riskFactors: [
        "Phenytoin concentration near the upper therapeutic range because CYP capacity is already heavily occupied.",
        "CYP2C9 reduced-function genotype, liver disease, older age, or metabolic inhibitor because available clearance capacity is lower.",
        "A large maintenance-dose increase because the added daily amount may exceed the remaining metabolic reserve.",
        "Dose changes made faster than steady state because delayed accumulation is mistaken for inadequate response."
      ],
      signsSymptoms: [
        "A phenytoin concentration that rises much more than expected after a small dose increase.",
        "Progressive nystagmus, diplopia, ataxia, dysarthria, lethargy, or confusion days after a change because accumulation continues.",
        "A longer time to steady state at higher concentrations because the apparent half-life increases as clearance saturates."
      ],
      diagnostics: [
        "Compare timed concentrations before and after a known dose change rather than assuming linearity because the slope itself demonstrates nonlinear behavior.",
        "Use free phenytoin when binding is abnormal because nonlinear metabolism and abnormal protein binding can coexist.",
        "Review liver function, genotype when clinically relevant, inhibitors, adherence, and formulation because each can mimic or amplify saturation."
      ],
      labs: [
        "Timed total and free phenytoin concentrations are the key measurements because dose alone cannot predict receptor-active exposure.",
        "Liver tests and albumin clarify metabolic capacity and binding but cannot calculate the exact individual saturation point.",
        "Repeat after sufficient time, often at least 7 to 10 days for a routine maintenance change, because an early result can miss continued accumulation."
      ],
      treatments: [
        "Use small individualized phenytoin maintenance adjustments near the upper range because each increment can produce disproportionate exposure.",
        "Hold or reduce treatment according to toxicity severity and specialist guidance because continued dosing adds substrate to an already saturated pathway.",
        "Support airway, circulation, gait safety, and rhythm as needed because there is no antidote that instantly restores saturated metabolism."
      ],
      nursingPriorities: [
        "Ask when the last dose change occurred because toxicity may emerge late as accumulation continues.",
        "Perform serial neurologic assessment because nystagmus and gait change can reveal overshoot before severe encephalopathy.",
        "Question large proportional dose changes because linear arithmetic is unsafe for a capacity-limited drug."
      ],
      complications: [
        "Severe ataxia, falls, delirium, coma, aspiration, and prolonged hospitalization after concentration overshoot.",
        "Breakthrough seizures after overcorrection or abrupt interruption in response to a high level.",
        "Repeated oscillation between low and toxic levels when dose changes are too large or too frequent."
      ],
      redFlags: [
        "Rapid dose escalation near a total phenytoin concentration of 15 to 20 mcg/mL.",
        "New nystagmus, ataxia, dysarthria, or confusion after a seemingly small dose increase.",
        "Low albumin or uremia plus nonlinear dosing because free-fraction and clearance errors compound."
      ],
      patientEducation: [
        "Take the exact prescribed dose because small changes can produce unexpectedly large blood-level changes.",
        "Report new double vision, unsteady walking, slurred speech, or confusion promptly because these can signal accumulation.",
        "Do not take extra doses to make up for a missed dose unless specifically instructed because the body may not clear the added amount proportionally."
      ],
      nclexTraps: [
        "Phenytoin can shift toward zero-order-like behavior near saturation, so its half-life is not one fixed number.",
        "Dose and concentration are not proportional near enzyme capacity.",
        "A level drawn too soon after a change can look acceptable before delayed accumulation produces toxicity."
      ],
      sourceNote: "Current U.S. Dilantin labeling and standard Michaelis-Menten pharmacokinetics.",
      sourceKeys: ["dailymed-dilantin", "michaelis-menten-pharmacokinetics"],
      nclexEssential: true,
      tags: ["frontier-wave21", "capacity limited", "saturable metabolism", "phenytoin", "nonlinear kinetics"]
    },
    {
      name: "Autoinduction",
      category: "Clinical pharmacokinetics",
      aliases: ["drug induces own metabolism", "carbamazepine autoinduction", "self induction CYP", "why carbamazepine level falls", "CYP3A4 autoinduction"],
      pronunciation: "aw-toh-in-DUK-shun",
      wordOrigin: "Auto- means self and induction means increasing production or activity. In pharmacology, a drug increases the metabolic machinery that clears that same drug.",
      definition: "Autoinduction is the progressive acceleration of a drug's own metabolism after repeated exposure. Carbamazepine induces CYP3A4 and related pathways that convert carbamazepine to metabolites, so clearance rises and half-life falls over roughly 3 to 5 weeks even when dose and adherence remain unchanged.",
      etiology: "It occurs when a drug activates transcriptional regulators that increase expression of enzymes or transporters responsible for its own clearance. Carbamazepine is the major nursing pharmacology example; repeated dosing creates the phenomenon rather than a single dose.",
      pathology: "This is an adaptive pharmacokinetic process rather than disease. It can produce breakthrough symptoms if exposure falls during induction, or toxicity if a dose raised during induction is not reconsidered when interacting inducers or inhibitors change.",
      pathophysiology: "Carbamazepine activates nuclear-receptor signaling that increases CYP3A4 and other metabolic proteins. More enzyme converts parent drug to carbamazepine-10,11-epoxide and onward metabolites. Initial half-life may be roughly 25 to 65 hours, then fall to about 12 to 17 hours after repeated dosing as induction matures. Because the active epoxide and interacting drugs also change, parent concentration alone may not capture the full effect. Induction fades after withdrawal, so a companion drug previously cleared rapidly may rise when carbamazepine is stopped.",
      riskFactors: [
        "The first 3 to 5 weeks of carbamazepine therapy because enzyme expression is still increasing.",
        "Dose changes during the induction window because the same dose has a moving clearance target.",
        "Addition or removal of CYP3A inhibitors or other inducers because they alter parent and epoxide exposure on top of autoinduction.",
        "Polypharmacy with narrow-therapeutic-index CYP substrates because carbamazepine also induces their clearance."
      ],
      signsSymptoms: [
        "A falling carbamazepine trough or recurrent seizures despite unchanged adherence as autoinduction matures.",
        "Early dizziness or diplopia that improves as clearance increases, which can be adaptation but must not be assumed when serious toxicity is possible.",
        "Delayed toxicity after a CYP3A inhibitor is added or carbamazepine is changed because the dynamic enzyme system no longer matches the prior dose."
      ],
      diagnostics: [
        "Compare timed troughs and clinical response over the first several weeks because a single early concentration cannot predict the final induced steady state.",
        "Review parent carbamazepine, active epoxide when available, liver function, sodium, adherence, formulation, and interactions because several mechanisms can change response.",
        "Reassess companion-drug concentrations or effects because induction is not limited to carbamazepine itself."
      ],
      labs: [
        "A general carbamazepine total reference range is 4 to 12 mcg/mL, but serial timed values during induction are more informative than one isolated number.",
        "Parent and epoxide concentrations may clarify toxicity when valproate or an epoxide-hydrolase interaction is present.",
        "Liver tests assess injury but do not directly measure enzyme induction because higher clearance can occur without hepatotoxicity."
      ],
      treatments: [
        "Titrate carbamazepine using response, tolerability, and serial timed levels because clearance changes for weeks after initiation.",
        "Reassess all interacting medicines when carbamazepine is started or stopped because their exposure can fall during induction and rise when induction fades.",
        "Do not chase every early low result with a large increase because the full kinetic trajectory and active epoxide must be considered."
      ],
      nursingPriorities: [
        "Document the start date and recent dose changes because the week of therapy predicts whether induction is still evolving.",
        "Verify adherence without assuming noncompliance because a lower level can be expected pharmacokinetic adaptation.",
        "Watch for both breakthrough seizures and toxicity because interactions can move exposure in either direction during autoinduction."
      ],
      complications: [
        "Breakthrough seizure or neuralgic pain when exposure falls below the effective concentration.",
        "Toxicity after an inhibitor is added or after an inducer is withdrawn because the established dose exceeds new clearance capacity.",
        "Failure of contraceptives, anticoagulants, immunosuppressants, antivirals, or psychiatric drugs through broader enzyme induction."
      ],
      redFlags: [
        "Seizure recurrence during the first month despite reported adherence.",
        "New diplopia, ataxia, or sedation after an interacting drug is added.",
        "Stopping carbamazepine without reviewing companion drugs whose concentrations may rise as induction fades."
      ],
      patientEducation: [
        "Early blood levels may change as the liver adapts, so scheduled follow-up is necessary even when the dose has not changed.",
        "Report breakthrough seizures, double vision, unsteadiness, or unusual sleepiness because these show whether exposure has moved too low or high.",
        "Tell every prescriber and pharmacist about carbamazepine because it can lower many other medicines, including hormonal contraception."
      ],
      nclexTraps: [
        "Autoinduction means the drug increases its own clearance, not that the immune system becomes tolerant.",
        "A falling level can occur with perfect adherence because enzyme expression increases.",
        "The effect develops and fades over time, so starting and stopping carbamazepine both create interaction risk."
      ],
      sourceNote: "Current U.S. carbamazepine labeling.",
      sourceKeys: ["dailymed-carbamazepine"],
      nclexEssential: true,
      tags: ["frontier-wave21", "autoinduction", "carbamazepine", "CYP3A4", "half life"]
    },
    {
      name: "SV2A synaptic vesicle protein",
      category: "Neuropharmacology",
      aliases: ["SV2A", "synaptic vesicle protein 2A", "levetiracetam target", "Keppra target", "brivaracetam target"],
      pronunciation: "ess-vee-two-A syn-AP-tik VESS-ih-kul PRO-teen",
      wordOrigin: "SV2A abbreviates synaptic vesicle glycoprotein 2A, one member of a protein family embedded in neurotransmitter-containing vesicles.",
      definition: "SV2A is a widely expressed membrane protein on presynaptic neurotransmitter vesicles that helps organize vesicle priming, calcium-dependent exocytosis, and reliable transmitter release. It is the high-affinity target of levetiracetam and brivaracetam; binding strength correlates with antiseizure activity, although the complete molecular sequence from binding to seizure control remains incompletely defined.",
      etiology: "SV2A is normal synaptic machinery rather than a disease. It becomes clinically relevant when ligands alter vesicle release or when imaging and research use SV2A as a marker of synaptic density.",
      pathology: "During a seizure, large populations release excitatory transmitter synchronously. Modulating SV2A appears to reduce the probability or synchrony of pathologic vesicle release while preserving enough ordinary transmission for function.",
      pathophysiology: "An action potential opens presynaptic voltage-gated calcium channels. Calcium binds the vesicle-fusion apparatus and drives exocytosis. SV2A interacts with vesicle proteins and may help maintain release-ready vesicles, calcium sensitivity, and vesicle recycling. Levetiracetam binding changes this release system most clearly during high-frequency activity, reducing network synchronization. Because SV2A exists throughout the brain, modulation can also affect arousal and behavior, helping explain somnolence, irritability, and aggression despite few metabolic interactions.",
      riskFactors: [
        "Hyperexcitable seizure networks because high-frequency synchronized release makes vesicle modulation therapeutically useful.",
        "Renal impairment during levetiracetam use because exposure rises even though the target is synaptic rather than renal.",
        "Baseline mood or behavioral vulnerability because broad SV2A distribution means treatment can alter limbic signaling."
      ],
      signsSymptoms: [
        "Reduced focal, myoclonic, or generalized tonic-clonic seizure frequency when SV2A ligand exposure is effective.",
        "Somnolence, dizziness, irritability, aggression, depression, or psychosis when modulation affects normal networks.",
        "Breakthrough seizures when renal dosing, dialysis, adherence, pregnancy clearance, or formulation changes lower exposure."
      ],
      diagnostics: [
        "There is no routine bedside SV2A assay; infer target effect from seizure control, behavior, dose, renal function, and drug exposure.",
        "EEG characterizes seizure-network response but does not directly measure SV2A binding.",
        "SV2A PET ligands can estimate synaptic density in research and specialized practice, but they are not routine levetiracetam monitoring."
      ],
      labs: [
        "Creatinine clearance guides levetiracetam dosing because renal elimination determines how much drug reaches SV2A.",
        "Serum levetiracetam can answer selected adherence, pregnancy, dialysis, or toxicity questions but does not measure receptor occupancy directly.",
        "CBC may be needed for rare cytopenia symptoms because target engagement does not predict immune or marrow adverse effects."
      ],
      treatments: [
        "Levetiracetam and brivaracetam bind SV2A to reduce seizure propensity; they differ in affinity, dosing, interactions, and clinical profile.",
        "Adjust dose for renal function and dialysis because target mechanism does not protect against systemic accumulation.",
        "Reduce, switch, or discontinue gradually with clinical guidance when severe behavioral toxicity occurs because safety and seizure recurrence must be balanced."
      ],
      nursingPriorities: [
        "Ask patient and family about behavior before and after treatment because caregivers may detect aggression or personality change first.",
        "Trend renal function and dialysis schedule because exposure is controlled by clearance rather than CYP metabolism.",
        "Do not equate few interactions with no monitoring because target-related CNS effects can be clinically severe."
      ],
      complications: [
        "Violence, self-harm, psychosis, falls, or treatment discontinuation from behavioral or CNS toxicity.",
        "Breakthrough seizure from underdosing after pregnancy or dialysis-related clearance change.",
        "Accumulation and sedation in renal failure when the dose is not reduced."
      ],
      redFlags: [
        "New suicidal thinking, aggression, psychosis, threats, or severe personality change.",
        "Marked somnolence or ataxia after renal function declines.",
        "Seizure recurrence after dialysis, pregnancy progression, or missed doses."
      ],
      patientEducation: [
        "Tell family to report unusual anger, withdrawal, depression, aggression, or hallucinations because behavior change can be medication related.",
        "Keep renal and dialysis follow-up because the kidneys determine how long levetiracetam remains in the body.",
        "Do not stop suddenly because removing seizure protection can provoke recurrence."
      ],
      nclexTraps: [
        "SV2A is a vesicle protein, not a sodium channel or GABA receptor.",
        "Levetiracetam has few CYP interactions but still needs renal dosing and behavioral monitoring.",
        "The target association is strong, but the complete downstream human mechanism is not fully proven."
      ],
      sourceNote: "Current U.S. Keppra labeling and peer-reviewed SV2A physiology.",
      sourceKeys: ["dailymed-keppra", "sv2a-physiology"],
      nclexEssential: true,
      tags: ["frontier-wave21", "SV2A", "synaptic vesicle", "levetiracetam", "Keppra", "behavior"]
    },
    {
      name: "AMPA receptor",
      category: "Neurophysiology",
      aliases: ["AMPA glutamate receptor", "alpha amino 3 hydroxy 5 methyl 4 isoxazolepropionic acid receptor", "perampanel target", "fast glutamate receptor", "GluA receptor"],
      pronunciation: "AM-puh ree-SEP-ter",
      wordOrigin: "AMPA abbreviates alpha-amino-3-hydroxy-5-methyl-4-isoxazolepropionic acid, a synthetic agonist used to identify this glutamate-receptor subtype.",
      definition: "The AMPA receptor is an ionotropic glutamate receptor that mediates most fast excitatory postsynaptic current in the central nervous system. When glutamate opens it, sodium influx depolarizes the neuron and can relieve magnesium block of NMDA receptors. Excessive synchronized AMPA signaling helps seizures propagate; perampanel reduces this excitation through noncompetitive allosteric antagonism.",
      etiology: "AMPA receptors are normal learning, memory, sensory, and motor signaling proteins. Disease relevance arises when receptor number, trafficking, subunit composition, glutamate release, or network synchronization makes excitation excessive, as in epilepsy, ischemia, and excitotoxic injury.",
      pathology: "During seizure propagation, glutamate released from one neuron opens AMPA receptors on neighboring cells, rapidly recruiting them into the discharge. Recurrent excitation can spread across a network before inhibitory systems contain it.",
      pathophysiology: "AMPA receptors are tetrameric GluA-family ligand-gated channels. Glutamate binding opens a cation pore, producing mainly sodium influx and potassium efflux; calcium permeability depends on subunit composition and RNA editing. The resulting depolarization generates fast EPSPs and can recruit voltage-gated channels and NMDA receptors. Perampanel binds an allosteric site and decreases channel activation noncompetitively, so abundant glutamate cannot fully overcome the block. Reduced physiologic excitation explains both antiseizure benefit and dizziness, gait disturbance, sedation, or behavioral change.",
      riskFactors: [
        "High-frequency glutamate release and impaired inhibition because excitatory postsynaptic currents synchronize larger neuronal populations.",
        "Brain injury, ischemia, inflammation, or epilepsy because extracellular glutamate and receptor trafficking can become abnormal.",
        "Perampanel accumulation or interacting CYP3A changes because excessive receptor antagonism increases CNS and behavioral toxicity."
      ],
      signsSymptoms: [
        "Seizure spread and synchronized motor or sensory phenomena when AMPA-mediated excitation recruits a network.",
        "Dizziness, ataxia, somnolence, falls, aggression, or psychosis with excessive perampanel effect because normal circuits also require AMPA signaling.",
        "Delayed toxicity after dose or inducer change because perampanel has a very long half-life."
      ],
      diagnostics: [
        "EEG detects synchronized network discharge but does not directly measure AMPA receptor activity.",
        "Medication history, titration timing, CYP3A inducers, behavior, and gait help identify perampanel-related AMPA antagonism.",
        "Research receptor assays and imaging are not routine bedside tests."
      ],
      labs: [
        "No routine AMPA laboratory test exists because receptor function is assessed through clinical and electrophysiologic outcomes.",
        "Liver and renal function help determine whether perampanel can be used safely because systemic clearance and labeling constraints shape exposure.",
        "Routine perampanel concentration is not the primary behavioral safety measure because direct symptom surveillance detects the boxed toxicity."
      ],
      treatments: [
        "Perampanel noncompetitively antagonizes AMPA receptors to reduce seizure propagation.",
        "Treat the underlying cause of excess glutamate or seizure activity because receptor blockade alone does not correct infection, stroke, metabolic disturbance, or structural disease.",
        "Reduce or discontinue perampanel when severe behavior change occurs because continued long-lived receptor antagonism can endanger the patient or others."
      ],
      nursingPriorities: [
        "Link new gait or behavioral change to recent perampanel titration because full accumulation is delayed by its long half-life.",
        "Ask directly about hostility, threats, psychosis, and suicidal or homicidal thinking because patients may not volunteer boxed-warning symptoms.",
        "Review CYP3A inducers before dose changes because adding or removing them changes perampanel exposure over time."
      ],
      complications: [
        "Seizure propagation and excitotoxic injury when AMPA-driven network excitation is uncontrolled.",
        "Falls, violence, self-harm, or psychosis when pharmacologic antagonism causes severe CNS or behavioral toxicity.",
        "Delayed accumulation after rapid titration because perampanel steady state takes weeks."
      ],
      redFlags: [
        "New severe aggression, homicidal ideation, threats, psychosis, or suicidal thinking on perampanel.",
        "Repeated falls or marked ataxia after a dose increase.",
        "Status epilepticus or persistent unresponsiveness requiring emergency evaluation and EEG."
      ],
      patientEducation: [
        "Report major mood, anger, behavior, balance, or thinking changes immediately because they can be medication effects rather than personal failure.",
        "Do not increase perampanel faster than prescribed because its long half-life hides the eventual full effect of a new dose.",
        "Avoid alcohol or sedatives unless cleared because they can add impairment and disinhibition."
      ],
      nclexTraps: [
        "AMPA mediates fast excitatory glutamate signaling; GABA-A mediates fast inhibitory chloride signaling.",
        "Perampanel is noncompetitive, so extra glutamate cannot simply displace it from the receptor's glutamate site.",
        "Blocking a seizure pathway also affects normal learning, balance, and behavior because the receptor is not disease specific."
      ],
      sourceNote: "Current U.S. Fycompa labeling and standard glutamate-receptor physiology.",
      sourceKeys: ["dailymed-fycompa", "ampa-receptor-physiology"],
      nclexEssential: true,
      tags: ["frontier-wave21", "AMPA", "glutamate", "perampanel", "fast excitation"]
    },
    {
      name: "T-type calcium channel and thalamocortical oscillation",
      category: "Neurophysiology",
      aliases: ["T type calcium channel", "thalamocortical oscillation", "absence seizure mechanism", "3 Hz spike wave mechanism", "ethosuximide target", "low threshold calcium current"],
      pronunciation: "tee-type KAL-see-um CHAN-el and thal-am-oh-KOR-tih-kul os-ih-LAY-shun",
      wordOrigin: "T originally referred to transient current. Thalamo- refers to the thalamus, cortical to cerebral cortex, and oscillation to repeating rhythmic activity.",
      definition: "T-type calcium-channel-driven thalamocortical oscillation is a neurophysiologic process in which low-voltage-activated channels reopen after a neuron has been hyperpolarized and generate rebound bursts. In thalamic relay and reticular circuits, repeated rebound firing can synchronize cortex and thalamus into the generalized 3-Hz spike-wave rhythm of a typical absence seizure. Ethosuximide reduces this current and disrupts the oscillator.",
      etiology: "The channels are normal components of sleep rhythms and thalamic relay. Genetic generalized epilepsy alters network excitability and channel regulation so a physiologic oscillatory circuit becomes pathologically synchronized.",
      pathology: "Typical absence seizures are brief generalized network events rather than small focal seizures. Bilateral thalamocortical synchronization interrupts awareness with abrupt onset and offset, often without a prolonged postictal state.",
      pathophysiology: "Hyperpolarization removes T-channel inactivation. When inhibition relaxes, a low-threshold calcium spike produces a burst of sodium action potentials. Reciprocal thalamic reticular inhibition and cortical excitation repeat the cycle, creating spike-wave oscillation. Hyperventilation can provoke absence activity by changing carbon dioxide, pH, and network excitability. Ethosuximide reduces thalamic T-type current, while valproate adds broader GABA and sodium-channel effects. Carbamazepine and phenytoin do not specifically break this oscillator and can worsen some generalized absence syndromes.",
      riskFactors: [
        "Genetic generalized epilepsy because channel and network predisposition lowers the threshold for synchronized oscillation.",
        "Childhood age range because typical absence syndromes commonly emerge during developing thalamocortical circuitry.",
        "Hyperventilation, sleep deprivation, or missed medication because network excitability shifts toward spike-wave activity.",
        "Misclassification as inattention because untreated brief events can continue for months without recognition."
      ],
      signsSymptoms: [
        "Abrupt brief staring, behavioral arrest, eyelid flutter, or subtle automatisms with immediate return to baseline because the generalized rhythm starts and stops quickly.",
        "Many episodes per day and school-performance decline because each short event interrupts information processing.",
        "Generalized 3-Hz spike-wave activity on EEG in typical absence, although age and syndrome can alter exact frequency."
      ],
      diagnostics: [
        "Use EEG with activation procedures such as supervised hyperventilation when appropriate because the diagnosis is electroclinical, not based on staring alone.",
        "Differentiate focal impaired-awareness seizure by onset, duration, automatisms, postictal state, focal EEG findings, and aura because treatment choices differ.",
        "Ask teachers and family for event frequency and videos because brief episodes may be absent during a short clinic visit."
      ],
      labs: [
        "No blood test diagnoses the oscillation; EEG provides the key physiologic evidence.",
        "Ethosuximide concentration can help with adherence or toxicity, but clinical event control and EEG context remain primary.",
        "Check CBC, liver, and renal surveillance for ethosuximide because drug safety is separate from seizure-network diagnosis."
      ],
      treatments: [
        "Ethosuximide is a first-line option for isolated typical absence because it directly suppresses the relevant T-type current with narrow-spectrum efficacy.",
        "Valproate is useful when absence coexists with generalized tonic-clonic or myoclonic seizures because its broader mechanisms cover multiple generalized patterns.",
        "Lamotrigine may be selected in some patients when reproductive or tolerability context favors it, although response and titration differ.",
        "Avoid reflexive carbamazepine or phenytoin use because classic focal sodium-channel therapy can aggravate absence in some generalized syndromes."
      ],
      nursingPriorities: [
        "Count events and assess school, safety, and treatment adherence because brief seizures can create substantial cumulative learning impact.",
        "Confirm whether tonic-clonic or myoclonic seizures also occur because isolated-absence treatment may not protect the full syndrome.",
        "Teach family that the child is not deliberately ignoring them because awareness is briefly interrupted by a generalized electrical event."
      ],
      complications: [
        "Academic and psychosocial impairment from frequent unrecognized interruptions.",
        "Injury during an event, especially around water, traffic, heights, or machinery despite brief duration.",
        "Absence status with prolonged fluctuating confusion or reduced responsiveness.",
        "Worsening after an inappropriate narrow-spectrum drug in a generalized epilepsy syndrome."
      ],
      redFlags: [
        "A prolonged episode, injury, convulsion, focal deficit, or failure to return immediately to baseline because this is not a routine brief absence event.",
        "New generalized tonic-clonic or myoclonic seizures because the treatment strategy must broaden.",
        "Fever, sore throat, rash, mucosal injury, or severe fatigue on ethosuximide because blood dyscrasia or hypersensitivity may be developing."
      ],
      patientEducation: [
        "Record event timing and frequency because treatment response is measured by what happens throughout the day, not only at appointments.",
        "Use water, bathing, traffic, and sports precautions until seizures are controlled because even a few seconds of lost awareness can be dangerous.",
        "Do not stop medication suddenly because absence seizures or absence status can return."
      ],
      nclexTraps: [
        "Typical absence is a generalized thalamocortical seizure, not a focal seizure with a milder name.",
        "Ethosuximide is narrow spectrum: excellent for isolated absence but not protection against tonic-clonic seizures.",
        "Immediate recovery supports typical absence; prolonged confusion suggests another seizure type or complication."
      ],
      sourceNote: "Current U.S. ethosuximide labeling and standard thalamocortical electrophysiology.",
      sourceKeys: ["dailymed-ethosuximide", "thalamocortical-oscillation"],
      nclexEssential: true,
      tags: ["frontier-wave21", "T-type calcium", "thalamocortical", "absence seizure", "ethosuximide", "3 Hz"]
    }
  ];

  const pharmCards = [...classCards, ...drugCards];
  const curatedAliasOwner = new Map();
  pharmCards.forEach((card) => {
    const owner = normalize(card.generic || card.name || card.displayName);
    [card.name, card.generic, ...(card.aliases || []), ...(card.brandExamples || [])]
      .map(normalize).filter(Boolean).forEach((alias) => curatedAliasOwner.set(alias, owner));
  });

  const map = new Map();
  db.drugs.forEach((drug) => {
    const key = normalize(drug.generic || drug.name || drug.displayName);
    if (!key) return;
    const aliases = (drug.aliases || []).filter((alias) => {
      const owner = curatedAliasOwner.get(normalize(alias));
      return !owner || owner === key;
    });
    const brandExamples = (drug.brandExamples || []).filter((brand) => {
      const owner = curatedAliasOwner.get(normalize(brand));
      return !owner || owner === key;
    });
    map.set(key, { ...drug, aliases, brandExamples });
  });

  pharmCards.forEach((card) => {
    const key = normalize(card.generic || card.name || card.displayName);
    const existing = map.get(key) || {};
    const inheritedAliases = (existing.aliases || []).filter((alias) => {
      const owner = curatedAliasOwner.get(normalize(alias));
      return !owner || owner === key;
    });
    const inheritedBrands = (existing.brandExamples || []).filter((brand) => {
      const owner = curatedAliasOwner.get(normalize(brand));
      return !owner || owner === key;
    });
    map.set(key, {
      ...existing,
      ...card,
      aliases: unique([...(card.aliases || []), ...inheritedAliases]),
      brandExamples: unique([...(card.brandExamples || []), ...inheritedBrands]),
      tags: unique(["frontier-wave21", ...(card.tags || []), ...(existing.tags || [])])
    });
  });
  db.drugs = Array.from(map.values());

  pathologyCards.forEach((incoming) => {
    const keys = unique([incoming.name, ...(incoming.aliases || [])]).map(normalize);
    const index = pathology.diseases.findIndex((entry) => unique([entry.name, entry.title, ...(entry.aliases || [])]).map(normalize).some((key) => keys.includes(key)));
    const existing = index >= 0 ? pathology.diseases[index] : {};
    const merged = {
      ...existing,
      ...incoming,
      aliases: unique([...(incoming.aliases || []), ...(existing.aliases || [])]),
      tags: unique(["frontier-wave21", ...(incoming.tags || []), ...(existing.tags || [])])
    };
    if (index >= 0) pathology.diseases[index] = merged;
    else pathology.diseases.push(merged);
  });

  db.pharmFrontierWave21AntiseizureCausalPatch = {
    version: "2026-07-17-antiseizure-causal",
    promotedDrugCount: drugCards.length,
    pathwayCardCount: classCards.length,
    pathologyConceptCount: pathologyCards.length,
    totalCardCount: pharmCards.length + pathologyCards.length
  };
  db.version = [db.version, "pharm-frontier-wave21-antiseizure-causal"].filter(Boolean).join("+");
  pathology.frontierWave21AntiseizureConceptCount = pathologyCards.length;
  window.ANI_PHARM_DATABASE = db;
  window.ANI_PATHOLOGY_DATABASE = pathology;
}());
