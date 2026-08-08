/* eslint-disable */
/* Parkinson pharmacology, motor-fluctuation reasoning, and linked causal physiology. */
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
  const noBoxed = (warning) => "No current U.S. boxed warning. High-yield warning context: " + warning;
  const populationRisks = (pediatric, older, pregnancy) => [
    { type: "pediatric", label: "Pediatric caution", note: pediatric },
    { type: "geriatric", label: "Older adult caution", note: older },
    { type: "pregnancy", label: "Pregnancy and lactation", note: pregnancy }
  ];

  const AAN_GUIDELINE = "https://www.aan.com/Guidelines/home/GuidelineDetail/1043";
  const NIA_PARKINSON = "https://www.nia.nih.gov/health/parkinsons-disease/parkinsons-disease-causes-symptoms-and-treatments";
  const DAILYMED_SEARCH = "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=";

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
    whyClosureRevision: "2026-07-17-parkinson-causal"
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
    whyClosureRevision: "2026-07-17-parkinson-causal"
  });

  const classCards = [
    classCard({
      name: "Parkinson basal-ganglia dopamine circuit and symptom map",
      aliases: [
        "Parkinson medication mechanism map", "basal ganglia direct indirect pathway", "dopamine movement circuit",
        "why dopamine loss slows movement", "Parkinson drug classes", "substantia nigra striatum pathway"
      ],
      class: "Mechanism map linking nigrostriatal dopamine loss, basal-ganglia output, symptoms, and medication targets",
      classExampleNames: ["Carbidopa/levodopa", "Pramipexole", "Rasagiline", "Entacapone", "Amantadine", "Istradefylline"],
      classPathway: ["Neurologic pharmacology", "Parkinson disease", "Nigrostriatal dopamine and basal-ganglia motor-loop control"],
      usedToTreat: "This map explains how Parkinson therapies improve motor function and why they do not all solve the same problem. It connects dopamine replacement, receptor stimulation, reduced dopamine or levodopa breakdown, NMDA-related dyskinesia treatment, and adenosine A2A antagonism to bradykinesia, rigidity, tremor, off time, and treatment-induced dyskinesia.",
      description: "Parkinson disease progressively removes dopamine-producing neurons from the substantia nigra pars compacta. Dopamine normally helps the striatum select intended movement by exciting D1-associated direct-pathway neurons and restraining D2-associated indirect-pathway neurons. Loss of that modulation increases inhibitory basal-ganglia output to the thalamus, making movement harder to initiate and scale. This classical direct-versus-indirect model is a useful teaching scaffold, not a complete description of a highly interconnected circuit. Carbidopa/levodopa supplies precursor for brain dopamine; dopamine agonists stimulate dopamine receptors directly; MAO-B inhibitors slow brain dopamine breakdown; COMT inhibitors prolong levodopa availability; amantadine has an incompletely established antiparkinson and antidyskinetic mechanism; and istradefylline targets adenosine A2A signaling without directly replacing dopamine. These therapies improve symptoms but have not been shown to stop the underlying neurodegeneration.",
      mechanism: "Cortical glutamate activates striatal projection neurons. In the classical model, the D1-rich direct pathway inhibits GPi/SNr output, releasing the motor thalamus from inhibition and facilitating selected movement. The D2-rich indirect pathway runs through GPe and STN and increases inhibitory GPi/SNr output, suppressing competing movement. Nigrostriatal dopamine biases both arms toward movement: D1 signaling supports the direct pathway and D2 signaling restrains the indirect pathway. Dopamine depletion therefore shifts the circuit toward excessive braking, which helps explain bradykinesia and rigidity. Tremor, gait freezing, posture, cognition, sleep, mood, autonomic dysfunction, and dysphagia also involve wider and partly nondopaminergic networks, which is why a stronger dopamine effect can improve limb speed yet leave falls, speech, or cognition unchanged. The AAN early-Parkinson guideline, reaffirmed in 2025, emphasizes that levodopa generally gives greater motor benefit than dopamine agonists or MAO-B inhibitors, while selection must account for dyskinesia risk, cognition, hallucinations, sleepiness, orthostasis, impulse-control risk, and patient goals.",
      boxedWarning: "There is no single class boxed warning because the hazards are mechanism and formulation specific. Dopamine-enhancing therapy can produce dyskinesia, hallucinations, sleep attacks, orthostatic hypotension, and compulsive behavior because the same signaling that supports movement also reaches arousal, reward, autonomic, and limbic circuits. Tolcapone carries a boxed warning for potentially fatal liver failure, while most other cards in this map do not carry a box. Read the actual drug and formulation rather than transferring one warning to the entire pathway.",
      adverseEffects: [
        "Dyskinesia can emerge when pulsatile or excessive dopaminergic stimulation drives maladaptive striatal plasticity, so more movement is not always better movement.",
        "Hallucinations, confusion, sleep attacks, orthostasis, nausea, edema, and impulse-control behaviors occur because dopamine and related targets influence cortical, limbic, arousal, vascular, and chemoreceptor systems as well as motor loops.",
        "Abrupt reduction can produce profound immobility or a hyperpyrexia-rigidity syndrome because an adapted dopamine-depleted system suddenly loses pharmacologic support."
      ],
      contraindications: [
        "Do not choose from the word Parkinson alone; identify the dominant symptom, cognition, psychosis, falls, blood pressure, daytime sleepiness, kidney or liver function, current off time, dyskinesia, and interacting drugs because these factors change benefit and harm.",
        "Avoid reflexively adding dopamine stimulation for gait freezing, falls, or cognitive change without confirming an off-state relationship because many late features respond poorly and added exposure can worsen hallucinations or hypotension.",
        "Do not stop a dopaminergic regimen abruptly unless an emergency plan specifically requires it because severe rigidity, fever, confusion, rhabdomyolysis, aspiration, and loss of mobility can follow."
      ],
      nursingEssentials: [
        "Map symptoms to dose time, meals, sleep, posture, and activity because the same complaint may represent under-treatment, peak-dose dyskinesia, orthostasis, sedation, infection, or disease progression.",
        "Give time-critical Parkinson medicines on the individualized schedule because even a technically correct drug given late can create an avoidable off state with immobility, aspiration, pain, and falls.",
        "Ask the patient and care partner directly about gambling, shopping, eating, sexual urges, hallucinations, sudden sleep, and medication overuse because shame, impaired insight, or poor recall can hide serious dopaminergic toxicity."
      ],
      interactions: [
        "Dopamine D2 blockers such as many antipsychotics and metoclopramide can oppose motor benefit because they block the receptors Parkinson therapy is trying to stimulate.",
        "Sedatives, antihypertensives, and alcohol can add sleepiness or hypotension because their effects converge with dopaminergic adverse effects even without a metabolic interaction.",
        "MAO-B and COMT drugs have target-specific interaction rules, so the broad label dopamine medicine cannot replace review of opioids, antidepressants, sympathomimetics, nonselective MAO inhibitors, CYP inhibitors or inducers, and catechol drugs."
      ],
      keyLabs: [
        "There is no single Parkinson drug level; response is measured through timed mobility, rigidity, tremor, activities, off time, dyskinesia, falls, swallowing, cognition, behavior, sleep, and orthostatic vital signs.",
        "Renal function is central for pramipexole and amantadine because reduced clearance raises exposure, while liver tests are indispensable for tolcapone because hepatocellular injury can be fatal.",
        "Medication reconciliation is a clinical test because omitted, delayed, duplicated, crushed, or formulation-substituted therapy can abruptly change motor control."
      ],
      nclexTraps: [
        "Levodopa improves symptoms but has not been shown to regenerate substantia-nigra neurons or stop Parkinson progression.",
        "A dopamine agonist is not automatically gentler than levodopa; it usually causes less early dyskinesia but more sleepiness, hallucinations, edema, orthostasis, and impulse-control harm.",
        "Tremor is memorable, but bradykinesia, swallowing, falls, cognition, autonomic dysfunction, and medication timing often determine safety."
      ],
      populationRisks: populationRisks(
        "Most wave22 drugs lack established pediatric Parkinson indications because Parkinson disease is overwhelmingly an adult disorder; accidental exposure can still cause serious CNS or cardiovascular toxicity.",
        "Older adults are more vulnerable to hallucinations, delirium, orthostasis, sleep attacks, falls, renal accumulation, and anticholinergic burden because cognitive, autonomic, and clearance reserve decline with age.",
        "Human pregnancy and lactation evidence is limited for many agents, so treatment requires individualized specialist review because maternal mobility and withdrawal risk must be balanced against uncertain fetal or infant exposure."
      ),
      sourceNote: "AAN Dopaminergic Therapy for Motor Symptoms in Early Parkinson Disease guideline, reaffirmed February 8, 2025 (" + AAN_GUIDELINE + "), NIA Parkinson disease overview (" + NIA_PARKINSON + "), and current U.S. product labeling.",
      sourceKeys: ["aan-parkinson-dopaminergic-2025", "nia-parkinson", "dailymed-parkinson-labels"],
      tags: ["frontier-wave22", "Parkinson disease", "basal ganglia", "direct pathway", "indirect pathway", "dopamine", "strict why closure"]
    }),
    classCard({
      name: "Carbidopa/levodopa absorption, wearing-off, on-off, and dyskinesia",
      aliases: [
        "levodopa timing and protein", "Sinemet wearing off", "Parkinson on off phenomenon", "levodopa motor fluctuations",
        "why levodopa stops working before next dose", "peak dose dyskinesia comparison"
      ],
      class: "Levodopa delivery, peripheral decarboxylase inhibition, variable absorption, motor fluctuation, and dyskinesia map",
      classExampleNames: ["Carbidopa/levodopa", "Entacapone", "Tolcapone", "Rasagiline", "Safinamide", "Istradefylline", "Amantadine"],
      classPathway: ["Neurologic pharmacology", "Levodopa therapy", "Delivery-to-response and long-term motor-complication reasoning"],
      usedToTreat: "This card explains why carbidopa/levodopa remains the strongest routine symptomatic motor therapy, why a dose may work smoothly early and become less predictable later, and how clinicians distinguish delayed-on, dose failure, end-of-dose wearing-off, unpredictable on-off transitions, and peak-dose or diphasic dyskinesia.",
      description: "Levodopa must reach the small intestine, use large neutral amino-acid transporters to enter blood and brain, and then be converted to dopamine. Carbidopa blocks peripheral aromatic L-amino-acid decarboxylase, so more levodopa reaches the CNS and less peripheral dopamine causes nausea or hypotension. It does not stop COMT metabolism, fix gastric emptying, or smooth the loss of striatal dopamine buffering. As Parkinson disease advances, fewer terminals store and release dopamine steadily, so plasma levodopa peaks and troughs are translated more directly into motor on and off states. Constipation, gastroparesis, meal protein, iron, formulation, delayed administration, and competing illness then become clinically visible. Dyskinesia often reflects excessive or rapidly changing brain dopamine effect rather than worsening untreated Parkinson disease.",
      mechanism: "After oral administration, gastric emptying delivers levodopa to proximal small-intestinal transport. Dietary large neutral amino acids can compete for intestinal and blood-brain transport, while iron can chelate levodopa and reduce absorption. Peripheral carbidopa preserves levodopa by inhibiting decarboxylation but does not meaningfully cross the blood-brain barrier. In early disease, surviving nigrostriatal terminals buffer fluctuating plasma delivery by storing dopamine. Progressive terminal loss narrows this buffering window; falling exposure produces wearing-off, while a peak can cross the dyskinesia threshold. Unpredictable on-off periods may also reflect variable absorption and nonlinear network response. COMT or MAO-B inhibition can lengthen benefit, but can also reveal or worsen dyskinesia because more dopaminergic effect reaches an already sensitized circuit. Amantadine may reduce dyskinesia, although its exact clinical mechanism is not established.",
      boxedWarning: "Carbidopa/levodopa products do not share a general U.S. boxed warning, but abrupt withdrawal or rapid dose reduction can cause a neuroleptic-malignant-like hyperpyrexia and confusion syndrome. Product formulations are not automatically interchangeable because immediate-release, extended-release, intestinal, and combination products deliver different exposure profiles; an unreviewed substitution can create off time or excessive peak effect.",
      adverseEffects: [
        "Peak-dose choreiform or dystonic dyskinesia occurs when dopaminergic effect exceeds the motor-benefit window in a sensitized striatum.",
        "Nausea and orthostasis arise partly from peripheral and central dopamine effects, while hallucinations and compulsive behavior reflect dopamine signaling outside the motor circuit.",
        "Delayed-on and dose failure can arise from slow gastric emptying, constipation, meal competition, iron, or missed timing even when the prescribed amount is unchanged."
      ],
      contraindications: [
        "Do not call every movement deterioration wearing-off; first distinguish bradykinesia from dyskinesia, tremor, freezing, syncope, sedation, delirium, pain, infection, or stroke because the corrective action differs.",
        "Do not crush, split, substitute, or route-switch a formulation without product-specific verification because modified delivery is part of the treatment mechanism.",
        "Do not remove dopaminergic therapy for hallucinations or surgery without a coordinated plan because abrupt motor collapse, aspiration, and hyperpyrexia-rigidity syndrome may be more dangerous than the symptom being addressed."
      ],
      nursingEssentials: [
        "Record medicine, formulation, administration time, meal and iron timing, onset of benefit, off return, and dyskinesia timing because a time-linked diary separates absorption failure from short duration or excessive peak effect.",
        "Assess swallowing before changing oral delivery because dysphagia can both prevent dose delivery and signal a major aspiration risk during an off period.",
        "Escalate fever, severe rigidity, confusion, autonomic instability, dark urine, or abrupt immobility after interruption because hyperpyrexia syndrome and rhabdomyolysis require urgent treatment."
      ],
      interactions: [
        "Iron salts can reduce absorption through chelation, and high-protein intake can compete for transport; consistency and individualized timing matter more than a blanket prohibition because nutrition must be preserved.",
        "D2-blocking antipsychotics and metoclopramide can oppose motor benefit because they block dopamine signaling, while nonselective MAO inhibition can create dangerous catecholamine effects.",
        "COMT inhibitors, MAO-B inhibitors, dopamine agonists, and istradefylline can reduce off time but may amplify dyskinesia or hallucinations because total dopaminergic network effect increases."
      ],
      keyLabs: [
        "There is no therapeutic levodopa level used for routine titration; the key measurement is a timed symptom and adverse-effect record linked to formulation, meals, and dose administration.",
        "Check orthostatic vital signs, hydration, weight and nutrition, renal and hepatic context, and creatine kinase when severe rigidity or rhabdomyolysis is suspected because complications are clinical rather than concentration-defined.",
        "Evaluate constipation and gastric dysmotility because delayed delivery can masquerade as drug resistance."
      ],
      nclexTraps: [
        "Carbidopa does not become dopamine and does not treat Parkinson motor symptoms alone; it preserves peripheral levodopa so more precursor reaches the brain.",
        "Off means insufficient motor benefit, whereas dyskinesia usually means excessive or poorly smoothed dopaminergic effect; both can occur in the same day.",
        "Protein is not universally banned; the high-yield principle is consistent, individualized timing when protein demonstrably interferes while preventing malnutrition."
      ],
      populationRisks: populationRisks(
        "Safety and effectiveness for typical Parkinson disease are not established in children because the disorder and treatment evidence are adult focused.",
        "Older adults have more hallucination, orthostasis, dysphagia, constipation, cognitive impairment, and falls, so schedule accuracy and small exposure changes can have large functional consequences.",
        "Pregnancy and lactation data are limited; abrupt loss of mobility can itself be harmful, so changes require neurologic and obstetric review rather than automatic discontinuation."
      ),
      sourceNote: "AAN early-Parkinson dopaminergic guideline reaffirmed 2025 (" + AAN_GUIDELINE + ") and current U.S. carbidopa/levodopa labeling (" + DAILYMED_SEARCH + "carbidopa%20levodopa).",
      sourceKeys: ["aan-parkinson-dopaminergic-2025", "dailymed-carbidopa-levodopa"],
      tags: ["frontier-wave22", "carbidopa", "levodopa", "wearing off", "on off", "dyskinesia", "protein", "strict why closure"]
    }),
    classCard({
      name: "Dopamine agonist route, onset, and adverse-effect comparison",
      aliases: [
        "pramipexole ropinirole rotigotine apomorphine comparison", "Parkinson dopamine agonists", "sleep attack gambling Parkinson drugs",
        "dopamine agonist patch versus pill versus rescue injection", "which Parkinson drug causes impulse control"
      ],
      class: "Non-ergoline dopamine-receptor agonist comparison across scheduled oral, continuous transdermal, and rapid rescue routes",
      classExampleNames: ["Pramipexole", "Ropinirole", "Rotigotine", "Apomorphine"],
      classPathway: ["Neurologic pharmacology", "Dopamine agonists", "Route-dependent motor support and shared behavioral-autonomic risk"],
      usedToTreat: "Pramipexole and ropinirole provide scheduled oral treatment for Parkinson motor symptoms and also have restless-legs indications. Rotigotine provides continuous transdermal exposure for Parkinson disease or restless legs. Subcutaneous apomorphine provides rapid, intermittent rescue for advanced-Parkinson off episodes. Route and labeled role matter because these are not interchangeable versions of one drug.",
      description: "Dopamine agonists stimulate dopamine receptors without first being converted to dopamine or stored in surviving terminals. That can provide motor benefit despite nigrostriatal cell loss and often produces less early dyskinesia than levodopa, but it exposes reward, sleep, perception, and autonomic circuits continuously. Pramipexole is predominantly renally cleared; ropinirole relies heavily on CYP1A2; rotigotine bypasses the gut through a daily patch; and apomorphine has rapid rescue use plus a unique, dangerous interaction with 5-HT3 antagonists. The AAN early-Parkinson guideline notes no compelling evidence that one routine dopamine agonist is broadly superior and recommends avoiding this class in people at high risk from older age, cognitive impairment, hallucinations, daytime sleepiness, or impulse-control disorder.",
      mechanism: "Pramipexole, ropinirole, rotigotine, and apomorphine are non-ergoline dopamine agonists with different D-receptor affinity profiles. Motor benefit is attributed mainly to striatal D2-family stimulation, but receptor binding tables do not fully explain each clinical response. Direct receptor activation bypasses levodopa transport and conversion, while pharmacokinetics determine the clinical role: oral maintenance agents rise and fall with dosing, transdermal rotigotine provides steadier systemic delivery, and injected apomorphine reaches effect rapidly enough to rescue a defined off episode. The same receptor activation in mesolimbic and hypothalamic networks explains compulsive behavior and sleep attacks; peripheral vascular and chemoreceptor effects explain orthostasis, syncope, nausea, and vomiting.",
      boxedWarning: "There is no uniform U.S. boxed warning for these non-ergoline agonists. The high-consequence class warnings are sudden sleep during daily activity, symptomatic hypotension or syncope, hallucinations, dyskinesia, and intense compulsive urges. Apomorphine is contraindicated with 5-HT3 antagonists such as ondansetron because profound hypotension and loss of consciousness have occurred; this is a drug-specific rule, not a dopamine-agonist class interaction.",
      adverseEffects: [
        "Somnolence or sleep attacks may occur without a reliable warning because dopamine participates in arousal regulation, making driving and machinery unsafe when symptoms appear.",
        "Gambling, shopping, binge eating, hypersexuality, medication overuse, or other compulsions can emerge because mesolimbic reward signaling is stimulated.",
        "Nausea, edema, hallucinations, dyskinesia, orthostasis, syncope, and falls reflect dopamine effects outside the intended motor pathway and become more consequential with age or cognitive disease."
      ],
      contraindications: [
        "Avoid routine initiation in a person with uncontrolled hallucinations, major cognitive impairment, active impulse-control disorder, or severe daytime sleepiness because the class directly worsens those vulnerabilities.",
        "Do not choose apomorphine without reviewing antiemetics because common 5-HT3 drugs are contraindicated and can cause cardiovascular collapse when combined.",
        "Do not treat all off time with rescue agonist before identifying hypotension, delayed levodopa absorption, missed doses, or dyskinesia because a superficially similar immobile period can have a different cause."
      ],
      nursingEssentials: [
        "Obtain patient and care-partner reports of sleep, driving, hallucinations, falls, standing symptoms, gambling, shopping, eating, sexual urges, and medication-seeking because the patient may not recognize the behavior change.",
        "Match route to technique: verify renal context for pramipexole, smoking and CYP1A2 interactions for ropinirole, skin/heat/procedure safety for rotigotine, and supervised cardiovascular/nausea planning for apomorphine because exposure differs by drug.",
        "Taper rather than abruptly stop when clinically possible because withdrawal can cause anxiety, depression, pain, autonomic symptoms, severe off state, or hyperpyrexia-confusion."
      ],
      interactions: [
        "Dopamine antagonists can reduce benefit because they oppose receptor stimulation; this includes many antipsychotics and antiemetics.",
        "Sedatives and alcohol add impairment, while antihypertensives and vasodilators add orthostasis because the effects converge even when metabolism is unchanged.",
        "Cimetidine or other renal-cation transport competitors may raise pramipexole exposure, CYP1A2 inhibitors can raise ropinirole, external heat can raise rotigotine delivery, and 5-HT3 antagonists are contraindicated with apomorphine."
      ],
      keyLabs: [
        "No routine serum level predicts benefit; trend timed mobility, off episodes, sleep attacks, compulsions, hallucinations, dyskinesia, edema, and supine-standing blood pressure.",
        "Renal function determines pramipexole accumulation, while liver and smoking/CYP1A2 context influence ropinirole exposure.",
        "ECG and electrolyte context matter for apomorphine when QT or arrhythmia risk is present because hypotension and repolarization risk can converge."
      ],
      nclexTraps: [
        "Pramipexole, ropinirole, and rotigotine are maintenance therapies; apomorphine injection is a rapid rescue for defined off episodes, not an opioid despite its name.",
        "Less early dyskinesia than levodopa does not mean lower overall risk because behavioral, sleep, psychosis, edema, and orthostatic harms are more prominent.",
        "Do not pair ondansetron with apomorphine; the familiar antiemetic can cause profound hypotension and loss of consciousness in this combination."
      ],
      populationRisks: populationRisks(
        "Pediatric Parkinson use is not established, and accidental ingestion or patch exposure can cause serious somnolence, hypotension, or behavioral effects.",
        "Older adults have more hallucinations, cognitive impairment, renal decline, orthostasis, and fall injury, which is why routine agonist initiation becomes less attractive after about age 70 in AAN guidance.",
        "Pregnancy and lactation evidence is limited; dopamine agonism can also suppress prolactin and lactation, so reproductive counseling must be drug specific."
      ),
      sourceNote: "AAN early-Parkinson dopaminergic guideline reaffirmed 2025 (" + AAN_GUIDELINE + ") and current U.S. pramipexole, ropinirole, rotigotine, and apomorphine labeling on DailyMed.",
      sourceKeys: ["aan-parkinson-dopaminergic-2025", "dailymed-pramipexole", "dailymed-ropinirole", "dailymed-neupro", "dailymed-apokyn"],
      tags: ["frontier-wave22", "dopamine agonist", "sleep attack", "impulse control", "orthostasis", "apomorphine", "strict why closure"]
    }),
    classCard({
      name: "Parkinson adjunct comparison: MAO-B, COMT, amantadine, and A2A",
      aliases: [
        "Parkinson wearing off adjuncts", "MAO B versus COMT inhibitor", "amantadine istradefylline comparison",
        "what can be added to levodopa for off time", "Parkinson adjunct mechanism map", "A2A antagonist Parkinson"
      ],
      class: "Comparison of dopamine-catabolism inhibitors, levodopa-prolonging COMT inhibitors, amantadine, and adenosine A2A antagonism",
      classExampleNames: ["Selegiline", "Rasagiline", "Safinamide", "Entacapone", "Tolcapone", "Amantadine", "Istradefylline", "Opicapone"],
      classPathway: ["Neurologic pharmacology", "Parkinson adjunct therapy", "Mechanism-specific reduction of symptoms, off time, or dyskinesia"],
      usedToTreat: "These drugs address different gaps: MAO-B inhibitors reduce dopamine breakdown; COMT inhibitors prolong levodopa exposure and are mainly used for end-of-dose wearing-off; selected amantadine formulations treat Parkinson symptoms, levodopa-induced dyskinesia, or off episodes; and istradefylline is an adjunct to carbidopa/levodopa for off episodes. The correct add-on depends on whether the target is mild motor symptoms, predictable wearing-off, unpredictable off time, or dyskinesia.",
      description: "An adjunct is not simply more Parkinson medicine. Selegiline and rasagiline can be used in Parkinson disease as mono- or adjunct therapy, while U.S. safinamide labeling is specifically adjunctive to levodopa/carbidopa in patients with off episodes. Entacapone, opicapone, and tolcapone have no useful standalone antiparkinson role; they preserve levodopa by inhibiting COMT. Tolcapone is restricted by potentially fatal liver failure, whereas entacapone is limited by diarrhea, urine discoloration, and dopaminergic amplification. Amantadine is unusual because its exact clinical mechanism remains unknown and formulations have different labeled roles and are not interchangeable. Istradefylline antagonizes adenosine A2A receptors by pharmacology, but its precise therapeutic sequence in humans remains unknown. Every adjunct can worsen dyskinesia or hallucinations when it increases effective motor-circuit stimulation.",
      mechanism: "MAO-B metabolizes dopamine in the brain; selective inhibition reduces dopamine catabolism, although labels state that the precise therapeutic mechanism remains unknown. COMT converts levodopa to 3-O-methyldopa, especially after carbidopa blocks peripheral decarboxylation. Peripheral COMT inhibition raises levodopa exposure and extends half-life, so effect lasts longer but peaks can also become excessive. Amantadine is a weak uncompetitive NMDA-receptor antagonist with proposed dopaminergic effects, yet current labels explicitly say the mechanism for Parkinson benefit and dyskinesia is unknown. Striatal adenosine A2A receptors interact with indirect-pathway signaling; istradefylline is an A2A antagonist, but in-vitro and animal evidence does not prove the complete human therapeutic mechanism. These distinctions prevent hypotheses from being taught as settled facts.",
      boxedWarning: "Tolcapone carries a boxed warning for potentially fatal acute fulminant liver failure and is generally reserved for patients with fluctuations who do not respond to or are not candidates for other adjuncts. Other drugs in this comparison do not share that box. MAO-B interaction restrictions, amantadine renal accumulation, and istradefylline psychosis or dyskinesia risk remain serious even without boxed warnings.",
      adverseEffects: [
        "Dyskinesia and hallucinations can worsen across adjunct classes because extending or amplifying motor-circuit stimulation narrows the therapeutic window.",
        "MAO-B inhibitors add hypertension, serotonin-syndrome, sleep, impulse, and psychosis concerns because monoamine metabolism affects more than striatal dopamine.",
        "COMT inhibitors can cause diarrhea, orthostasis, and orange-brown urine; tolcapone can cause fatal liver failure, while amantadine can accumulate in renal impairment and cause hallucinations, edema, livedo reticularis, or withdrawal toxicity."
      ],
      contraindications: [
        "Do not add an adjunct until the pattern is defined because delayed-on from gastroparesis, peak-dose dyskinesia, and true end-of-dose wearing-off require different solutions.",
        "Do not combine MAO-B inhibitors with prohibited opioids, other MAO inhibitors, dextromethorphan, or specified serotonergic and sympathomimetic drugs because monoamine excess can cause serotonin syndrome or hypertensive crisis.",
        "Do not use tolcapone with liver disease or prior tolcapone injury, and do not use selected extended-release amantadine products in end-stage renal disease because clearance and toxicity make those risks unacceptable."
      ],
      nursingEssentials: [
        "Track off time and dyskinesia separately because less off time can be purchased at the cost of more abnormal involuntary movement.",
        "Review antidepressants, opioids, cough medicines, stimulants, linezolid, smoking, CYP inhibitors or inducers, liver tests, renal function, and formulation because each adjunct has a different interaction and clearance logic.",
        "Escalate jaundice or dark urine on tolcapone, severe diarrhea or weight loss on entacapone, new vision change or hallucinations on amantadine, and fever-rigidity-confusion after withdrawal because these findings map to specific serious mechanisms."
      ],
      interactions: [
        "MAO-B drugs can interact with serotonergic, opioid, sympathomimetic, and other monoamine-altering therapy because selectivity is not a guarantee against monoamine toxicity.",
        "COMT inhibitors potentiate levodopa and can affect catechol substrates, so dyskinesia, blood pressure, and interacting catechol drugs require review.",
        "Strong CYP3A4 inhibitors raise istradefylline exposure and strong inducers lower it, while heavy tobacco smoking lowers exposure; amantadine interactions are driven more by renal elimination, urinary pH, anticholinergic burden, and CNS effects."
      ],
      keyLabs: [
        "Tolcapone requires liver-enzyme surveillance tied to its boxed warning because severe hepatocellular injury may become fatal.",
        "Amantadine requires creatinine/eGFR and formulation review because renal clearance and release profile determine accumulation.",
        "For most adjuncts, the decisive measurements are timed off hours, dyskinesia, hallucinations, sleepiness, compulsions, falls, and orthostatic blood pressure rather than a serum concentration."
      ],
      nclexTraps: [
        "Entacapone and tolcapone do not replace levodopa; they prolong it by inhibiting COMT.",
        "Orange-brown urine with entacapone can be benign, but dark urine with jaundice or systemic symptoms on tolcapone may signal liver injury and is not a color-change teaching point.",
        "Amantadine's NMDA and dopaminergic actions are plausible pharmacology, but current labeling says the clinical mechanism in Parkinson disease and dyskinesia is unknown."
      ],
      populationRisks: populationRisks(
        "Pediatric use for typical Parkinson disease is not established, and class-specific toxicity can follow accidental exposure.",
        "Older adults have more renal decline, hallucinations, orthostasis, insomnia, and cognitive vulnerability, making amantadine accumulation and dopaminergic amplification especially important.",
        "Pregnancy data are limited and animal findings vary; individualized review is required because abrupt loss of motor function can also harm the pregnant patient."
      ),
      sourceNote: "Current U.S. labels for selegiline, rasagiline, safinamide, entacapone, tolcapone, amantadine, and istradefylline on DailyMed, plus the AAN guideline reaffirmed 2025 (" + AAN_GUIDELINE + ").",
      sourceKeys: ["dailymed-maob", "dailymed-comt", "dailymed-amantadine", "dailymed-nourianz", "aan-parkinson-dopaminergic-2025"],
      tags: ["frontier-wave22", "MAO-B", "COMT", "amantadine", "adenosine A2A", "wearing off", "strict why closure"]
    })
  ];

  const drugCards = [
    drugCard({
      name: "Carbidopa/levodopa",
      studentFacingCombinationCard: true,
      combinationProduct: true,
      deprecatedCombinationProduct: false,
      aliases: ["carbidopa levodopa", "carbidopa-levodopa", "Sinemet", "Rytary", "Duopa", "Crexont", "Dhivy", "l dopa with carbidopa", "levadopa carbadopa", "Parkinson dopamine replacement"],
      brandExamples: ["Sinemet", "Rytary", "Duopa", "Crexont", "Dhivy"],
      class: "Levodopa dopamine precursor plus peripheral DOPA decarboxylase (aromatic L-amino-acid decarboxylase, AADC) inhibitor",
      classPathway: ["Neurologic medication", "Dopamine replacement strategy", "Brain dopamine synthesis with peripheral levodopa preservation"],
      usedToTreat: "Motor symptoms of Parkinson disease and selected other parkinsonian syndromes, especially bradykinesia and rigidity and often tremor. Product and formulation determine whether exposure is immediate, extended, fractionable, or continuously delivered; those distinctions matter because a preparation selected to smooth off time cannot be substituted by name alone.",
      description: "Carbidopa/levodopa restores dopamine signaling by carrying levodopa into the brain for conversion to dopamine while carbidopa blocks its premature peripheral breakdown, making it the strongest routine symptomatic motor therapy for Parkinson disease. Dopamine itself cannot be given for this purpose because it does not enter the brain effectively. Carbidopa stays largely outside the CNS, allowing more levodopa to reach brain while reducing peripheral nausea, vomiting, and cardiovascular effects. The combination does not repair lost substantia-nigra neurons or stop progression. As neuronal buffering declines, the same dose can produce shorter benefit, delayed-on, unpredictable on-off transitions, or dyskinesia. The AAN guideline reaffirmed in 2025 generally prefers levodopa for patients seeking treatment of early motor symptoms because its motor benefit exceeds that of dopamine agonists or MAO-B inhibitors, while emphasizing the lowest effective exposure and monitoring for fluctuations and dyskinesia.",
      mechanism: "Levodopa uses large neutral amino-acid transporters in the intestine and blood-brain barrier. Aromatic L-amino-acid decarboxylase then converts it to dopamine in the brain, restoring signaling in surviving nigrostriatal terminals and downstream basal-ganglia circuits. Peripheral decarboxylation would waste most levodopa and create dopamine-mediated nausea, hypotension, and arrhythmia; carbidopa inhibits that peripheral enzyme without meaningfully entering brain. Carbidopa does not prevent COMT conversion to 3-O-methyldopa, so COMT inhibition can further extend levodopa exposure. Gastric emptying, constipation, iron chelation, protein competition, and formulation determine how much precursor reaches the transporter. Progressive terminal loss reduces storage buffering, making plasma peaks and troughs more directly visible as on, off, and dyskinesia.",
      boxedWarning: noBoxed("Abrupt withdrawal or rapid reduction can cause withdrawal-emergent hyperpyrexia and confusion resembling neuroleptic malignant syndrome because a dopamine-dependent, chronically adapted motor system suddenly loses support. Falling asleep during daily activity, hallucinations or psychosis, impulse-control behaviors, dyskinesia, and orthostasis are prominent labeled warnings. Formulations are not automatically interchangeable because their release and delivery profiles differ."),
      adverseEffects: [
        "Nausea, vomiting, orthostatic hypotension, dizziness, and dysrhythmia can occur because peripheral and central dopamine affects the chemoreceptor trigger zone and autonomic cardiovascular control.",
        "Choreiform, dystonic, or other dyskinesia can occur when brain dopamine effect exceeds the motor-benefit window, especially after long exposure and progressive loss of buffering terminals.",
        "Hallucinations, confusion, vivid dreams, somnolence, sleep attacks, and compulsive behaviors can occur because dopamine reaches cortical, limbic, reward, and arousal networks as well as motor pathways."
      ],
      contraindications: [
        "Avoid concurrent nonselective MAO inhibition because excessive catecholamine signaling can cause severe hypertension; product labeling defines the required separation.",
        "Clarify severe psychosis, narrow-angle glaucoma, major ischemic cardiac disease, suspicious melanoma or skin lesions, and inability to use the formulation safely because dopaminergic, ocular, cardiovascular, and administration risks may outweigh benefit.",
        "Do not abruptly withhold for procedures, swallowing difficulty, or hallucinations without an alternative plan because severe off-state immobility, aspiration, rigidity, fever, and rhabdomyolysis can follow."
      ],
      nursingEssentials: [
        "Administer on the patient's individualized time-critical schedule and verify the exact formulation because delay or substitution changes brain exposure even when the generic ingredients look identical.",
        "Trend mobility, rigidity, tremor, swallowing, falls, orthostatic blood pressure, nausea, hallucinations, sleep, compulsions, off return, and dyskinesia against dose and meal time because timing reveals whether exposure is insufficient, delayed, or excessive.",
        "Escalate fever, profound rigidity, confusion, autonomic instability, dark urine, or abrupt immobility after missed or reduced therapy because hyperpyrexia syndrome and rhabdomyolysis are emergencies."
      ],
      interactions: [
        "Iron can chelate levodopa and large neutral amino acids from protein can compete for transport, so consistent individualized timing may improve response without sacrificing nutrition.",
        "D2 antagonists such as many antipsychotics and metoclopramide can reduce motor benefit because they oppose dopamine signaling; isoniazid may also reduce effectiveness in some patients.",
        "MAO-B inhibitors, COMT inhibitors, dopamine agonists, amantadine, and istradefylline can improve off time but also increase dyskinesia, hallucinations, or orthostasis because overall circuit stimulation rises."
      ],
      keyLabs: [
        "No routine serum levodopa concentration guides therapy; use a timed motor, off, dyskinesia, sleep, behavior, swallowing, and orthostatic assessment because clinical response is the relevant exposure measure.",
        "Review liver, kidney, hematologic, cardiovascular, and nutritional status during prolonged therapy when clinically indicated because systemic illness can alter tolerance and delivery.",
        "Check creatine kinase, renal function, electrolytes, urinalysis, and vital signs urgently when severe rigidity, fever, or dark urine suggests hyperpyrexia syndrome or rhabdomyolysis because these measurements can reveal muscle breakdown, kidney injury, electrolyte danger, myoglobinuria, and autonomic instability."
      ],
      nclexTraps: [
        "Carbidopa preserves levodopa outside the brain; it is not itself the dopamine precursor that produces the main motor benefit.",
        "Do not teach absolute protein avoidance; teach consistent, individualized meal timing when protein clearly interferes and protect against weight loss and malnutrition.",
        "A late Parkinson dose is not merely an inconvenience because an off state can impair swallowing, breathing mechanics, mobility, pain control, and fall safety."
      ],
      populationRisks: populationRisks(
        "Safety and effectiveness for typical Parkinson disease are not established in pediatric patients because the condition and evidence base are adult focused.",
        "Older adults are more likely to develop hallucinations, delirium, orthostasis, dysphagia, and falls because cognitive and autonomic reserve are lower, although age alone does not remove levodopa's motor benefit.",
        "Pregnancy and lactation evidence is limited; levodopa can affect prolactin and milk production, while abrupt severe immobility can also harm the parent, so specialist review is required."
      ),
      sourceNote: "AAN guideline reaffirmed 2025 (" + AAN_GUIDELINE + ") and current U.S. carbidopa/levodopa product labeling: " + DAILYMED_SEARCH + "carbidopa%20levodopa",
      sourceKeys: ["aan-parkinson-dopaminergic-2025", "dailymed-carbidopa-levodopa"],
      tags: ["frontier-wave22", "carbidopa", "levodopa", "Sinemet", "wearing off", "dyskinesia", "strict why closure"]
    }),
    drugCard({
      name: "Pramipexole",
      aliases: ["Mirapex", "Mirapex ER", "pramipexol", "pramipexole dopamine agonist", "Parkinson gambling medicine", "D3 agonist Parkinson"],
      brandExamples: ["Mirapex", "Mirapex ER"],
      class: "Non-ergoline D2-family dopamine agonist with D3-preferring receptor affinity",
      classPathway: ["Neurologic medication", "Dopamine agonist", "Direct striatal receptor stimulation with renal elimination"],
      usedToTreat: "Signs and symptoms of idiopathic Parkinson disease as immediate- or extended-release therapy, and moderate-to-severe primary restless legs syndrome with the immediate-release product. Do not transfer one indication's schedule or assumptions to the other because Parkinson motor support and restless-legs symptom timing have different clinical goals.",
      description: "Pramipexole directly stimulates dopamine receptors and does not need conversion by surviving nigrostriatal neurons. It can improve bradykinesia, rigidity, tremor, and off time, but its defining safety story is the spread of dopamine signaling into sleep, perception, reward, and autonomic circuits. Sudden sleep, hallucinations, orthostatic hypotension, compulsive gambling or shopping, binge eating, hypersexuality, edema, and dyskinesia may be more consequential than the motor benefit. Pramipexole is cleared largely unchanged by the kidneys, so declining renal function lengthens exposure and can turn a previously tolerated regimen into confusion, somnolence, hallucination, or falls.",
      mechanism: "Pramipexole is an agonist at D2-family receptors with greatest in-vitro affinity for D3 receptors. Parkinson motor benefit is attributed to postsynaptic striatal D2-family stimulation that partially replaces lost nigrostriatal dopamine signaling, but the precise contribution of D3 preference to therapeutic effect is not established. Direct receptor stimulation bypasses levodopa transport, decarboxylation, and terminal storage. The same D3-rich mesolimbic exposure helps explain impulse-control disorders, while hypothalamic and arousal-network effects contribute to somnolence and sleep attacks. Renal tubular secretion is central to clearance, so kidney impairment and competing cation transport can raise exposure.",
      boxedWarning: noBoxed("Pramipexole can cause falling asleep during activities of daily living, sometimes without warning; symptomatic orthostatic hypotension; intense compulsive urges; hallucinations or psychotic-like behavior; dyskinesia; postural deformity; and withdrawal symptoms. Renal impairment requires product-specific adjustment because accumulation magnifies CNS and autonomic toxicity."),
      adverseEffects: [
        "Nausea, dizziness, constipation, edema, somnolence, and orthostasis occur because dopamine receptors influence chemoreceptor, vascular, renal, and arousal systems.",
        "Hallucinations and confusion are more common with older age because dopaminergic stimulation meets lower cognitive reserve.",
        "Gambling, shopping, binge eating, hypersexuality, and medication overuse can emerge because D3-rich reward circuits are stimulated even when motor response is appropriate."
      ],
      contraindications: [
        "Avoid or reconsider in uncontrolled psychosis, major cognitive impairment, active impulse-control disorder, severe daytime sleepiness, or unsafe driving because pramipexole directly worsens those vulnerabilities.",
        "Clarify renal function before initiation and after acute kidney injury because unchanged drug is cleared by the kidneys and exposure can rise markedly.",
        "Do not abruptly stop after sustained therapy when tapering is possible because withdrawal can produce anxiety, panic, depression, fatigue, pain, diaphoresis, severe off state, or hyperpyrexia-confusion."
      ],
      nursingEssentials: [
        "Ask the patient and care partner about sleep attacks, driving, hallucinations, falls, gambling, shopping, eating, sexual urges, and medication use because impaired insight may hide toxicity.",
        "Trend supine and standing blood pressure during initiation or escalation because dopamine-mediated vasodilation and impaired autonomic compensation can cause syncope.",
        "Reassess exposure after renal decline, dehydration, or addition of a renal-cation transport competitor because CNS toxicity may reflect clearance rather than disease progression."
      ],
      interactions: [
        "Dopamine antagonists can reduce benefit because they oppose receptor stimulation.",
        "Cimetidine and other organic-cation transport competitors can reduce renal secretion and raise pramipexole exposure, while sedatives and alcohol add somnolence.",
        "Levodopa and other dopaminergic drugs can add dyskinesia, hallucination, and orthostasis because their pharmacodynamic effects converge."
      ],
      keyLabs: [
        "Creatinine and estimated renal function guide safe exposure because pramipexole is predominantly renally eliminated.",
        "No serum drug level is routinely useful; monitor timed motor response, sleep, compulsions, hallucinations, edema, postural change, and orthostatic vital signs because no single concentration predicts benefit while these findings expose motor, behavioral, autonomic, and edema toxicity.",
        "Evaluate creatine kinase and renal injury when severe muscle pain or weakness suggests rare rhabdomyolysis."
      ],
      nclexTraps: [
        "A normal motor response does not rule out dangerous compulsive behavior or sleep attacks because those effects arise in different dopamine circuits.",
        "Pramipexole is used for both Parkinson disease and restless legs syndrome, but the indication-specific schedule and treatment goal are not interchangeable.",
        "New hallucinations after kidney injury may be pramipexole accumulation rather than inevitable Parkinson dementia."
      ],
      populationRisks: populationRisks(
        "Pediatric safety and effectiveness are not established for Parkinson disease or routine restless-legs treatment.",
        "Older adults have higher hallucination and renal-accumulation risk because clearance and cognitive reserve decline, so care-partner observation is especially valuable.",
        "Pregnancy data are limited and dopamine agonism can inhibit prolactin and lactation, so pregnancy and breastfeeding decisions require specialist review."
      ),
      sourceNote: "Current U.S. pramipexole labeling: " + DAILYMED_SEARCH + "pramipexole; AAN guideline reaffirmed 2025: " + AAN_GUIDELINE,
      sourceKeys: ["dailymed-pramipexole", "aan-parkinson-dopaminergic-2025"],
      tags: ["frontier-wave22", "pramipexole", "Mirapex", "dopamine agonist", "renal", "impulse control", "sleep attack"]
    }),
    drugCard({
      name: "Ropinirole",
      aliases: ["Requip", "Requip XL", "ropinerole", "ropinirol", "ropinirole dopamine agonist", "CYP1A2 Parkinson agonist"],
      brandExamples: ["Requip", "Requip XL"],
      class: "Non-ergoline D2-family dopamine agonist metabolized mainly by CYP1A2",
      classPathway: ["Neurologic medication", "Dopamine agonist", "Direct receptor stimulation with CYP1A2-sensitive exposure"],
      usedToTreat: "Signs and symptoms of Parkinson disease and moderate-to-severe primary restless legs syndrome, with product and indication determining the appropriate formulation and schedule. It can be used alone earlier or with levodopa to reduce off time, but added benefit can amplify dyskinesia and hallucinations.",
      description: "Ropinirole directly stimulates D2-family dopamine receptors in striatal motor circuits, improving Parkinson motor signaling without first being converted to dopamine. Its high-yield distinction from pramipexole is clearance: ropinirole is metabolized mainly by CYP1A2, so smoking status and CYP1A2 inhibitors can change exposure. Its shared dopamine-agonist hazards remain central: sudden sleep, syncope, orthostatic hypotension, hallucinations, dyskinesia, and compulsive behavior. A patient who stops smoking or starts a strong CYP1A2 inhibitor can become more exposed even though the prescribed dose did not change, which explains why medication reconciliation must include tobacco use.",
      mechanism: "Ropinirole stimulates D2-family dopamine receptors, with in-vitro affinity at D2 and D3 receptors. Motor benefit is attributed to striatal postsynaptic receptor stimulation, while the exact receptor contribution in an individual patient is not fully defined. CYP1A2 converts ropinirole to largely inactive metabolites. Tobacco smoke induces CYP1A2 and can lower exposure; smoking cessation reverses that induction and can raise exposure. Estrogens and CYP1A2 inhibitors may also alter clearance. Mesolimbic, arousal, and autonomic receptor effects explain compulsions, sleep attacks, hallucinations, nausea, and orthostasis.",
      boxedWarning: noBoxed("Ropinirole can cause sudden sleep during daily activities, syncope, symptomatic hypotension, hallucinations or psychosis, dyskinesia, compulsive behavior, withdrawal symptoms, and withdrawal-emergent hyperpyrexia and confusion. Smoking or CYP1A2 interaction changes can alter exposure because hepatic metabolism is central."),
      adverseEffects: [
        "Nausea, vomiting, dizziness, edema, somnolence, syncope, and orthostasis arise from dopaminergic effects on chemoreceptor, vascular, and arousal pathways.",
        "Hallucinations, confusion, and dyskinesia become more common when levodopa and ropinirole effects overlap because total dopaminergic stimulation rises.",
        "Compulsive gambling, shopping, eating, sexual behavior, or medication use can develop because reward circuitry is stimulated."
      ],
      contraindications: [
        "Avoid or reconsider in uncontrolled hallucinations, cognitive impairment, active impulse-control disorder, severe sleepiness, or recurrent syncope because those are direct class vulnerabilities.",
        "Clarify smoking initiation or cessation, ciprofloxacin or other CYP1A2 inhibitors, and estrogen changes because exposure may shift without a dose change.",
        "Do not stop abruptly when tapering is possible because severe off state, withdrawal symptoms, or hyperpyrexia-confusion may follow."
      ],
      nursingEssentials: [
        "Ask both patient and care partner about driving sleepiness, hallucinations, falls, compulsions, and medication overuse because the patient may not identify a behavioral adverse effect.",
        "Trend supine-standing blood pressure and syncope during initiation or escalation because orthostatic compensation can fail.",
        "Reassess after smoking-status or CYP1A2-medication change because new somnolence, hallucinations, or dyskinesia can be an exposure problem."
      ],
      interactions: [
        "CYP1A2 inhibitors such as ciprofloxacin can raise exposure, while tobacco smoke can lower it; stopping smoking can therefore increase exposure.",
        "Dopamine antagonists reduce effectiveness because they block the target receptor, while sedatives and antihypertensives add sleepiness and hypotension.",
        "Levodopa can add dyskinesia and hallucination because both increase dopaminergic circuit activity."
      ],
      keyLabs: [
        "No routine serum level is used; measure motor response, off time, dyskinesia, sleepiness, hallucinations, compulsions, edema, and orthostatic vital signs because clinical motor, behavioral, sleep, and autonomic effects define useful versus excessive exposure.",
        "Review hepatic function and CYP1A2 context because hepatic metabolism determines exposure.",
        "Document tobacco use as a pharmacokinetic variable rather than only a lifestyle item because smoke induction changes clearance."
      ],
      nclexTraps: [
        "Smoking cessation can raise ropinirole exposure because CYP1A2 induction fades; the healthy change still requires medication review.",
        "Ropinirole treats both Parkinson disease and restless legs syndrome, but the indication-specific regimen and risk discussion differ.",
        "Less off time does not prove the regimen is safer if dyskinesia, hallucination, sleep attack, or gambling appears."
      ],
      populationRisks: populationRisks(
        "Pediatric safety and effectiveness are not established for these routine indications.",
        "Older adults have more hallucinations, orthostasis, cognitive toxicity, and fall injury because reserve is lower.",
        "Pregnancy evidence is limited and dopamine agonism may suppress lactation, so reproductive use requires individualized review."
      ),
      sourceNote: "Current U.S. ropinirole labeling: " + DAILYMED_SEARCH + "ropinirole; AAN guideline reaffirmed 2025: " + AAN_GUIDELINE,
      sourceKeys: ["dailymed-ropinirole", "aan-parkinson-dopaminergic-2025"],
      tags: ["frontier-wave22", "ropinirole", "Requip", "CYP1A2", "dopamine agonist", "sleep attack", "impulse control"]
    }),
    drugCard({
      name: "Rotigotine",
      aliases: ["Neupro", "rotigotine patch", "rotigotene", "Parkinson dopamine patch", "24 hour dopamine agonist patch"],
      brandExamples: ["Neupro"],
      class: "Continuous-delivery transdermal non-ergoline dopamine agonist",
      classPathway: ["Neurologic medication", "Dopamine agonist", "Transdermal receptor stimulation with patch-specific safety"],
      usedToTreat: "Signs and symptoms of Parkinson disease and moderate-to-severe primary restless legs syndrome using a transdermal system. Continuous delivery bypasses gastric absorption and can smooth exposure, but the patch introduces site, heat, sulfite, MRI, cardioversion, and disposal hazards that oral agonists do not share.",
      description: "Rotigotine is a dopamine-agonist patch that delivers medication continuously through skin. It can be useful when swallowing or variable gastrointestinal delivery complicates oral therapy, but transdermal does not mean locally acting or free of systemic toxicity. Sleep attacks, hallucinations, orthostasis, syncope, dyskinesia, edema, nausea, and compulsive behavior remain because rotigotine reaches dopamine receptors throughout the body and brain. External heat can increase absorption; application reactions can become severe; the backing contains metal and must be removed for MRI or cardioversion; and sodium metabisulfite can cause allergic-type reactions in susceptible people.",
      mechanism: "Rotigotine is a non-ergoline agonist at dopamine receptors, with activity across D-receptor subtypes in binding studies. The precise receptor sequence responsible for Parkinson benefit is not fully established, but direct striatal stimulation compensates partly for lost nigrostriatal dopamine. The patch creates sustained systemic delivery and bypasses gastric emptying, yet skin temperature, adhesion, and application technique influence exposure. Continuous stimulation may smooth some fluctuation but still reaches mesolimbic, autonomic, and arousal networks, explaining compulsions, hypotension, hallucinations, and sleep attacks.",
      boxedWarning: noBoxed("Rotigotine can cause sulfite hypersensitivity, sudden sleep, hallucinations or psychosis, orthostatic hypotension, syncope, compulsive behavior, dyskinesia, severe application reactions, and hyperpyrexia-confusion after abrupt reduction. External heat can raise delivery, and the metal-containing backing can cause burns during MRI or cardioversion."),
      adverseEffects: [
        "Application-site erythema, pruritus, dermatitis, or blistering occurs because drug and adhesive contact skin continuously; widespread or persistent reaction may require stopping.",
        "Nausea, edema, dizziness, hallucination, dyskinesia, somnolence, and orthostasis reflect systemic dopamine-receptor stimulation rather than a local patch effect.",
        "Compulsive behaviors and sleep attacks can occur because continuous delivery also exposes reward and arousal circuits."
      ],
      contraindications: [
        "Avoid in serious rotigotine or patch-component hypersensitivity and clarify sulfite sensitivity because sodium metabisulfite can provoke allergic reactions.",
        "Do not expose the applied patch to heating pads, hot tubs, sauna, or other direct heat because increased skin blood flow and diffusion can raise absorption.",
        "Remove before MRI or cardioversion because the metal-containing backing can heat and burn tissue."
      ],
      nursingEssentials: [
        "Verify the old patch was removed, rotate to intact clean skin, document site and time, and inspect skin because duplicate patches or repeated sites cause overdose or injury.",
        "Assess sleep, driving, hallucinations, falls, standing blood pressure, edema, dyskinesia, and compulsions because transdermal delivery does not reduce systemic class effects.",
        "Fold used patches adhesive-to-adhesive and secure disposal away from children and pets because substantial residual drug may remain."
      ],
      interactions: [
        "Dopamine antagonists can reduce motor benefit because they oppose receptor stimulation.",
        "Sedatives, alcohol, antihypertensives, and other dopaminergic drugs can add somnolence, hypotension, hallucination, or dyskinesia.",
        "External heat is a delivery interaction rather than a metabolic interaction because it can increase transdermal absorption."
      ],
      keyLabs: [
        "No routine drug level is used; monitor patch adhesion and skin, timed motor response, sleep attacks, hallucinations, compulsions, edema, and orthostatic vital signs because delivery failure, skin injury, motor response, behavioral toxicity, edema, and autonomic effects are clinical rather than concentration-defined.",
        "Assess blood pressure and heart rate because both hypotension and labeled elevations can occur during systemic dopamine agonism.",
        "Review procedure schedule because MRI and cardioversion require patch removal to prevent burns."
      ],
      nclexTraps: [
        "A patch is systemic therapy, not a local skin treatment; all major dopamine-agonist behavioral and cardiovascular warnings still apply.",
        "Do not cut the patch or place a new patch before confirming the old one is off because delivery becomes unpredictable or duplicated.",
        "Heat, MRI, and cardioversion questions are formulation-specific safety issues, not minor device details."
      ],
      populationRisks: populationRisks(
        "Pediatric safety and effectiveness are not established; accidental patch transfer or ingestion can cause systemic toxicity.",
        "Older adults are more vulnerable to hallucinations, orthostasis, falls, edema, and skin fragility because cognitive, vascular, and dermal reserve decline.",
        "Pregnancy data are limited, and dopamine agonism may inhibit lactation; specialist review is required."
      ),
      sourceNote: "Current U.S. NEUPRO labeling: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=939e28c5-f3a9-42c0-9a2d-8d471d82a6e0",
      sourceKeys: ["dailymed-neupro"],
      tags: ["frontier-wave22", "rotigotine", "Neupro", "transdermal", "heat", "MRI", "dopamine agonist"]
    }),
    drugCard({
      name: "Apomorphine",
      aliases: ["Apokyn", "Onapgo", "Kynmobi", "apomorphone", "apomorphine rescue", "Parkinson off injection", "dopamine rescue injection"],
      brandExamples: ["Apokyn", "Onapgo"],
      class: "Subcutaneous non-ergoline dopamine agonist for intermittent off rescue or continuous motor-fluctuation therapy",
      classPathway: ["Neurologic rescue and infusion medication", "Dopamine agonist", "Rapid intermittent or continuous subcutaneous receptor stimulation"],
      usedToTreat: "Product-specific use in advanced Parkinson disease: APOKYN provides acute intermittent treatment of hypomobility off episodes, including end-of-dose and unpredictable on-off episodes; ONAPGO provides continuous waking-day subcutaneous infusion for adult motor fluctuations with product-specific supplemental use. The products are not substitutable because concentration, device, delivery pattern, and labeled role differ.",
      description: "Apomorphine directly stimulates dopamine receptors through subcutaneous delivery, allowing an intermittent dose to reverse a Parkinson off episode rapidly or a continuous infusion to reduce waking-day motor fluctuations. These are distinct U.S. delivery strategies: APOKYN is intermittent, while ONAPGO continuously infuses apomorphine for advanced-Parkinson motor fluctuations and is explicitly not substitutable for intermittent products. Despite its name, apomorphine is not morphine and does not act as an opioid. Nausea and vomiting are common, but 5-HT3 antagonists such as ondansetron are contraindicated because profound hypotension and loss of consciousness have occurred. Sleep attacks, hallucinations, dyskinesia, compulsions, QT concerns, falls, injection or infusion-site injury, rare hemolytic anemia, and device technique remain important.",
      mechanism: "Apomorphine directly stimulates D1- and D2-family dopamine receptors; the precise receptor contribution to motor benefit is not fully established. Subcutaneous delivery bypasses gastric delay. An intermittent injection reaches systemic circulation quickly enough to rescue an off episode, whereas continuous infusion sustains receptor stimulation to reduce motor fluctuations across the waking day. These delivery patterns are pharmacokinetically and operationally different even though the molecule is the same. Peripheral dopamine effects strongly activate nausea pathways and lower vascular tone. The mechanism behind the profound 5-HT3-antagonist interaction is not fully defined, but the clinical combination is contraindicated because severe hypotension and syncope have been reported.",
      boxedWarning: noBoxed("Concomitant 5-HT3 antagonists, including ondansetron, granisetron, dolasetron, palonosetron, and alosetron, are contraindicated because profound hypotension and loss of consciousness have occurred. Apomorphine also carries serious warnings for nausea/vomiting, sleep attacks, syncope and orthostasis, falls, QT prolongation, psychosis, compulsive behavior, coronary events, and hemolytic anemia."),
      adverseEffects: [
        "Severe nausea and vomiting occur because potent peripheral dopamine-receptor stimulation activates emetic pathways.",
        "Hypotension, syncope, falls, and injury can occur because dopamine agonism reduces vascular compensation, especially with antihypertensives or vasodilators.",
        "Dyskinesia, hallucination, somnolence, sleep attack, yawning, compulsions, injection nodules, and rare hemolytic anemia reflect central, autonomic, local, and immune effects."
      ],
      contraindications: [
        "Do not combine with a 5-HT3 antagonist because profound hypotension and loss of consciousness can occur; verify the antiemetic rather than assuming ondansetron is safe.",
        "Avoid in serious sulfite hypersensitivity or prior apomorphine reaction because injectable products contain sodium metabisulfite.",
        "Clarify baseline hypotension, syncope, significant QT prolongation, electrolyte disturbance, unstable coronary disease, psychosis, and unsafe self-administration because rescue benefit may not outweigh immediate risk."
      ],
      nursingEssentials: [
        "For intermittent use, confirm the episode is an off state and not syncope, freezing despite on state, sedation, stroke, infection, or peak-dose dystonia because extra dopamine will not correct every immobile event.",
        "Verify blood-pressure response, nausea plan, exact product, device, concentration, subcutaneous technique, site rotation, and caregiver capability because intermittent and continuous products are not substitutable and formulation errors are dangerous.",
        "Assess sleep, falls, hallucinations, dyskinesia, compulsions, chest symptoms, injection or infusion sites, and anemia symptoms because motor improvement can conceal accumulating systemic harm."
      ],
      interactions: [
        "5-HT3 antagonists are contraindicated because the combination has caused profound hypotension and unconsciousness.",
        "Antihypertensives, vasodilators, alcohol, and sedatives can add hypotension or impairment, while dopamine antagonists can blunt benefit.",
        "QT-prolonging drugs and low potassium or magnesium add repolarization risk because apomorphine itself can prolong QT at higher exposure."
      ],
      keyLabs: [
        "Measure supine and standing blood pressure and pulse during supervised initiation and after clinically important changes because syncope risk is exposure dependent.",
        "Review ECG/QTc and potassium or magnesium when arrhythmia risk is present because repolarization hazards can add.",
        "CBC, hemoglobin, and hemolysis evaluation are indicated when fatigue, jaundice, dark urine, or falling hemoglobin suggests hemolytic anemia."
      ],
      nclexTraps: [
        "Apomorphine is a dopamine agonist, not an opioid and not an analgesic.",
        "Ondansetron is usually considered a safe antiemetic, but it is specifically contraindicated with apomorphine because cardiovascular collapse can occur.",
        "APOKYN is intermittent rescue, whereas ONAPGO is continuous infusion for motor fluctuations; the same molecule does not make the devices or delivery patterns interchangeable."
      ],
      populationRisks: populationRisks(
        "Pediatric safety and effectiveness are not established.",
        "Older adults have more orthostasis, hallucination, cardiac disease, falls, and caregiver dependence, so supervised technique and risk review are critical.",
        "Pregnancy and lactation data are limited, and animal findings raise concern; specialist review is required."
      ),
      sourceNote: "Current U.S. APOKYN labeling: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3235535d-9ef9-4657-8b2a-176a807d091c and ONAPGO labeling revised May 2026: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f3552b6e-5ae7-4993-aa1a-e399c4a7080a",
      sourceKeys: ["dailymed-apokyn", "dailymed-onapgo"],
      tags: ["frontier-wave22", "apomorphine", "Apokyn", "off episode", "5-HT3 contraindication", "hypotension", "dopamine agonist"]
    }),
    drugCard({
      name: "Selegiline",
      aliases: ["Eldepryl", "Zelapar", "selegeline", "deprenyl", "MAO B inhibitor Parkinson", "selegiline levodopa adjunct"],
      brandExamples: ["Eldepryl", "Zelapar"],
      class: "Selective irreversible monoamine oxidase-B inhibitor at labeled Parkinson exposure",
      classPathway: ["Neurologic medication", "MAO-B inhibitor", "Reduced brain dopamine catabolism with formulation-specific metabolism"],
      usedToTreat: "Adjunctive treatment with levodopa/carbidopa in Parkinson disease when response deteriorates, including wearing-off; formulation labeling differs. Transdermal selegiline is an antidepressant product and should not be treated as an interchangeable Parkinson formulation because route changes exposure, indication, and tyramine and interaction rules.",
      description: "Selegiline inhibits MAO-B, an enzyme involved in dopamine metabolism, and can extend dopaminergic effect in Parkinson disease. The precise therapeutic sequence is not completely established, so it should not be described as making dopamine or replacing levodopa. Selectivity is exposure dependent: above recommended Parkinson exposure, MAO-B selectivity decreases and tyramine or interaction risk rises. Oral metabolism produces L-amphetamine and L-methamphetamine metabolites, which can contribute to insomnia and distinguish selegiline from rasagiline. Serious teaching centers on prohibited opioids and dextromethorphan, serotonergic combinations, sympathomimetics, hypertension, serotonin syndrome, sleep attacks, hallucinations, dyskinesia, and withdrawal-emergent hyperpyrexia and confusion.",
      mechanism: "Selegiline irreversibly inhibits MAO-B at recommended Parkinson exposure. MAO-B contributes to oxidative deamination of dopamine in brain, so enzyme inhibition reduces dopamine breakdown and can increase or prolong extracellular striatal dopamine. Current labeling states that the exact mechanism of clinical benefit is not established. Enzyme activity returns through new enzyme synthesis rather than simple drug clearance, which explains why interaction washout extends beyond the plasma half-life. At higher exposure selectivity for MAO-B diminishes, increasing inhibition of MAO-A-mediated tyramine and monoamine metabolism. Oral first-pass metabolism generates L-amphetamine and L-methamphetamine, which may add stimulation and insomnia.",
      boxedWarning: noBoxed("Serious hypertension and serotonin syndrome can occur when MAO selectivity is exceeded or interacting monoaminergic drugs are combined. Opioids such as meperidine and tramadol, other MAO inhibitors, dextromethorphan, and product-specified antidepressant or sympathomimetic combinations require strict review. Sleep attacks, orthostasis, hallucinations, dyskinesia, compulsions, and withdrawal hyperpyrexia-confusion are also labeled concerns."),
      adverseEffects: [
        "Nausea, dizziness, orthostasis, confusion, hallucinations, insomnia, vivid dreams, and dyskinesia occur because dopamine and other monoamine signaling increases.",
        "Serotonin syndrome can cause agitation, clonus, hyperreflexia, fever, autonomic instability, diarrhea, and confusion because serotonergic metabolism and signaling become excessive with interacting drugs.",
        "Hypertensive reactions can occur when MAO-A inhibition becomes clinically important and tyramine or sympathomimetic monoamines escape normal metabolism."
      ],
      contraindications: [
        "Do not combine with prohibited opioids, other MAO inhibitors, or dextromethorphan because severe CNS excitation, serotonin toxicity, hyperpyrexia, rigidity, coma, or cardiovascular collapse can occur.",
        "Review antidepressants, cyclobenzaprine, linezolid, stimulants, sympathomimetics, and St. John's wort against the exact label because broad statements that selective MAO-B is interaction free are unsafe.",
        "Do not abruptly stop sustained dopaminergic support when tapering is possible because severe off state or hyperpyrexia-confusion may follow."
      ],
      nursingEssentials: [
        "Perform a complete prescription, OTC cough/cold, opioid, antidepressant, stimulant, and supplement review because the most dangerous interactions may be outside the Parkinson list.",
        "Assess blood pressure, sleep, hallucinations, compulsions, dyskinesia, and off time because increased dopamine can improve mobility while worsening neuropsychiatric or autonomic safety.",
        "Differentiate oral or orally disintegrating Parkinson products from transdermal antidepressant selegiline because route changes exposure, indication, and tyramine rules."
      ],
      interactions: [
        "Meperidine, tramadol and other label-prohibited opioids, dextromethorphan, other MAO inhibitors, and many serotonergic drugs can cause life-threatening monoamine toxicity.",
        "Sympathomimetics and very high-tyramine foods can cause hypertension when selectivity is lost or susceptibility is high because monoamines are not metabolized normally.",
        "Levodopa effects can intensify, causing dyskinesia, hallucination, or orthostasis, because dopamine breakdown is reduced."
      ],
      keyLabs: [
        "No routine selegiline level is used; monitor blood pressure, temperature, mental status, clonus, reflexes, sleep, dyskinesia, hallucination, and timed motor benefit because clinical motor, autonomic, neurologic, sleep, and psychiatric effects determine benefit and toxicity.",
        "Review liver function when impairment or interacting metabolism is relevant because formulation exposure can change.",
        "Urgently assess CK, renal function, electrolytes, and ECG when rigidity, fever, severe agitation, or autonomic instability suggests serotonin syndrome or hyperpyrexia syndrome because muscle breakdown, kidney injury, electrolyte disturbance, and dysrhythmia can rapidly compound the neurologic emergency."
      ],
      nclexTraps: [
        "Selegiline inhibits dopamine breakdown; it does not enter the brain and turn into dopamine.",
        "MAO-B selectivity is dose and exposure dependent, so selective does not mean free of tyramine, serotonin, opioid, or sympathomimetic risk.",
        "Oral Parkinson selegiline and transdermal antidepressant selegiline are not interchangeable formulations."
      ],
      populationRisks: populationRisks(
        "Pediatric Parkinson safety and effectiveness are not established.",
        "Older adults have more orthostasis, hallucination, polypharmacy, and interaction exposure because autonomic and cognitive reserve are lower.",
        "Pregnancy and lactation evidence is limited, and amphetamine-related metabolites may be relevant to infant exposure; specialist review is required."
      ),
      sourceNote: "Current U.S. selegiline and ZELAPAR labeling: " + DAILYMED_SEARCH + "selegiline; AAN guideline reaffirmed 2025: " + AAN_GUIDELINE,
      sourceKeys: ["dailymed-selegiline", "dailymed-zelapar", "aan-parkinson-dopaminergic-2025"],
      tags: ["frontier-wave22", "selegiline", "Zelapar", "MAO-B", "serotonin syndrome", "tyramine", "levodopa adjunct"]
    }),
    drugCard({
      name: "Rasagiline",
      aliases: ["Azilect", "rasagaline", "rasaglene", "rasagiline MAO B", "Parkinson dopamine breakdown inhibitor"],
      brandExamples: ["Azilect"],
      class: "Selective irreversible monoamine oxidase-B inhibitor",
      classPathway: ["Neurologic medication", "MAO-B inhibitor", "Reduced brain dopamine catabolism with CYP1A2-sensitive exposure"],
      usedToTreat: "Parkinson disease as monotherapy or adjunct therapy, including use with levodopa when motor benefit is inadequate or wearing-off occurs. It may improve mild motor symptoms or reduce off time, but it is symptomatic therapy and has not been shown to slow neurodegeneration.",
      description: "Rasagiline irreversibly inhibits MAO-B and reduces dopamine breakdown in the brain. Unlike selegiline, it is not metabolized to amphetamine derivatives, but it still shares major monoamine interaction hazards. Current labeling states that the precise mechanism of Parkinson benefit is unknown; increased extracellular striatal dopamine is the accepted pharmacologic explanation, not proof of disease modification. CYP1A2 is important to clearance, so ciprofloxacin and liver impairment can raise exposure and erode MAO-B selectivity. Higher exposure increases hypertension, tyramine, and monoamine-toxicity risk. When combined with levodopa, more sustained dopamine effect can reduce off time while worsening dyskinesia, hallucinations, or orthostasis.",
      mechanism: "Rasagiline selectively and irreversibly inhibits MAO-B at recommended exposure. MAO-B metabolizes dopamine in brain, so inhibition decreases dopamine catabolism and raises or prolongs extracellular dopamine in striatum. The exact causal chain from enzyme inhibition to each clinical improvement remains incompletely defined. Irreversibility means enzyme activity recovers through new protein synthesis, so interaction risk outlasts simple plasma clearance. CYP1A2 metabolizes rasagiline; inhibitors and hepatic impairment raise exposure. At exposures above the recommended range, selectivity diminishes and MAO-A-dependent tyramine and serotonin metabolism can become more important.",
      boxedWarning: noBoxed("Rasagiline can cause hypertension, serotonin syndrome, falling asleep during daily activity, hypotension, dyskinesia, hallucinations or psychosis, impulse-control behaviors, and withdrawal-emergent hyperpyrexia and confusion. Multiple opioids, other MAO inhibitors, St. John's wort, cyclobenzaprine, and dextromethorphan are contraindicated; antidepressant combinations require strict label review."),
      adverseEffects: [
        "Dyskinesia, nausea, orthostasis, hallucination, somnolence, and compulsive behavior can increase because dopamine breakdown is reduced.",
        "Serotonin syndrome can cause agitation, clonus, hyperreflexia, fever, diarrhea, confusion, and autonomic instability when serotonergic load becomes excessive.",
        "Hypertensive reactions can occur when elevated exposure reduces MAO-B selectivity or sympathomimetic or very high-tyramine load overwhelms monoamine metabolism."
      ],
      contraindications: [
        "Do not combine with meperidine, tramadol, methadone, propoxyphene, other MAO inhibitors, St. John's wort, cyclobenzaprine, or dextromethorphan because serious monoamine toxicity can occur.",
        "Avoid moderate or severe hepatic impairment and reduce exposure for mild impairment or CYP1A2 inhibition per label because lost clearance can reduce selectivity.",
        "Do not abruptly withdraw sustained dopaminergic support when tapering is possible because severe off state or hyperpyrexia-confusion may follow."
      ],
      nursingEssentials: [
        "Review prescriptions, antidepressants, opioids, cough medicines, stimulants, linezolid, decongestants, and supplements because an interaction may be hidden outside the Parkinson list.",
        "Assess blood pressure, temperature, mental status, sleep, hallucinations, compulsions, dyskinesia, and timed off benefit because therapeutic and toxic dopamine effects can rise together.",
        "Reassess after ciprofloxacin or another CYP1A2 inhibitor and with liver change because exposure can rise even when the rasagiline dose is unchanged."
      ],
      interactions: [
        "Contraindicated opioids, other MAO inhibitors, dextromethorphan, cyclobenzaprine, and St. John's wort can cause serotonin or hyperpyrexic toxicity because monoamine metabolism is impaired.",
        "CYP1A2 inhibitors such as ciprofloxacin raise exposure, while dopamine antagonists can reduce motor benefit.",
        "Levodopa can add dyskinesia, hallucinations, and orthostasis because rasagiline prolongs dopamine signaling."
      ],
      keyLabs: [
        "No routine rasagiline level is used; monitor blood pressure, temperature, clonus, reflexes, cognition, sleep, hallucinations, compulsions, dyskinesia, and off time because clinical motor, autonomic, neurologic, sleep, and psychiatric effects determine useful versus excessive exposure.",
        "Assess hepatic function when impairment is possible because liver clearance determines exposure and selectivity.",
        "Obtain CK, renal function, electrolytes, and ECG urgently when rigidity, fever, severe agitation, or autonomic instability suggests serotonin or hyperpyrexia syndrome because muscle breakdown, kidney injury, electrolyte disturbance, and dysrhythmia can rapidly compound the neurologic emergency."
      ],
      nclexTraps: [
        "Rasagiline inhibits dopamine breakdown; it is not a dopamine precursor and is not converted to dopamine.",
        "Selective MAO-B inhibition does not erase opioid, antidepressant, cough-medicine, sympathomimetic, or tyramine risk because selectivity is exposure dependent.",
        "Improved off time does not prove disease modification; current evidence supports symptomatic benefit."
      ],
      populationRisks: populationRisks(
        "Pediatric safety and effectiveness in Parkinson disease are not established.",
        "Older adults have more polypharmacy, orthostasis, hallucination, and liver vulnerability, increasing interaction and fall risk.",
        "Pregnancy and lactation evidence is limited; individualized specialist review is required."
      ),
      sourceNote: "Current U.S. rasagiline labeling: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e802c83c-e581-4a11-b83d-1df47120078d; AAN guideline reaffirmed 2025: " + AAN_GUIDELINE,
      sourceKeys: ["dailymed-rasagiline", "aan-parkinson-dopaminergic-2025"],
      tags: ["frontier-wave22", "rasagiline", "Azilect", "MAO-B", "CYP1A2", "serotonin syndrome", "strict why closure"]
    }),
    drugCard({
      name: "Safinamide",
      aliases: ["Xadago", "safinimide", "safinamide MAO B", "Xadago off episodes", "Parkinson add on MAOB"],
      brandExamples: ["Xadago"],
      class: "Selective reversible MAO-B inhibitor used only as a levodopa/carbidopa adjunct in U.S. labeling",
      classPathway: ["Neurologic medication", "MAO-B inhibitor", "Adjunctive reduction of dopamine catabolism during off episodes"],
      usedToTreat: "Adjunctive treatment to levodopa/carbidopa in adults with Parkinson disease who experience off episodes. U.S. labeling does not establish safinamide as monotherapy or as treatment that prevents dyskinesia, so its role must stay tied to the levodopa-treated fluctuating patient.",
      description: "Safinamide is a selective, reversible MAO-B inhibitor added to levodopa/carbidopa for off episodes. Its U.S. label states that the precise therapeutic mechanism is unknown and explains benefit through reduced dopamine catabolism. Sodium-channel modulation and reduced glutamate release have been described in preclinical work, but the U.S. label does not establish those effects as the human therapeutic mechanism; teaching them as settled would overstate evidence. Safinamide has extensive interaction restrictions involving other MAO inhibitors, several opioids and antidepressants, stimulants, dextromethorphan, and sympathomimetics. It can reduce off time while worsening dyskinesia because levodopa effect is amplified.",
      mechanism: "Safinamide selectively and reversibly inhibits MAO-B, with much greater in-vitro selectivity for MAO-B than MAO-A at recommended exposure. Blocking MAO-B reduces dopamine catabolism and can extend extracellular dopamine signaling during levodopa therapy. The precise clinical mechanism remains unknown. Preclinical sodium-channel and glutamate-release findings are hypotheses about additional pharmacology, not a label-established explanation of human benefit. Reversible binding distinguishes it chemically from selegiline and rasagiline, but washout and interaction rules still matter because combined monoamine effects can be dangerous.",
      boxedWarning: noBoxed("Safinamide can cause hypertension, serotonin syndrome, sleep attacks, dyskinesia, hallucinations or psychosis, compulsive behavior, withdrawal-emergent hyperpyrexia and confusion, and retinal concerns. Other MAO inhibitors, several opioids and antidepressants, cyclobenzaprine, stimulants, St. John's wort, and dextromethorphan are contraindicated; severe hepatic impairment is also contraindicated."),
      adverseEffects: [
        "Dyskinesia, falls, nausea, insomnia, hallucination, and orthostasis can increase because levodopa-associated dopamine signaling is prolonged.",
        "Serotonin syndrome or hypertension can occur when interacting monoaminergic therapy overwhelms selective metabolism.",
        "Sleep attacks and compulsive behavior can occur because dopamine-related arousal and reward circuits are exposed alongside motor circuits."
      ],
      contraindications: [
        "Do not combine with other MAO inhibitors or potent MAO-inhibiting drugs such as linezolid because excessive monoamine accumulation can cause hypertensive or hyperpyrexic toxicity.",
        "Do not combine with label-prohibited opioids, SNRIs, tricyclic or related antidepressants, cyclobenzaprine, stimulants, St. John's wort, or dextromethorphan because serotonin syndrome or dangerous excitation can occur.",
        "Avoid severe hepatic impairment because clearance falls and safe exposure cannot be maintained."
      ],
      nursingEssentials: [
        "Verify every opioid, antidepressant, stimulant, cough product, decongestant, antibiotic such as linezolid, and supplement because contraindicated monoaminergic exposure may be missed in routine reconciliation.",
        "Track off time and dyskinesia separately because a shorter off period can coexist with excessive involuntary movement.",
        "Ask about sleep, hallucinations, compulsions, blood-pressure symptoms, and visual change because serious effects involve multiple networks and may not be volunteered."
      ],
      interactions: [
        "Other MAO inhibitors, multiple opioids, serotonergic drugs, stimulants, sympathomimetics, and dextromethorphan can cause serotonin syndrome or hypertension because monoamine signaling becomes excessive.",
        "Dopamine antagonists can reduce benefit, while levodopa and other dopaminergic drugs can add dyskinesia and hallucinations.",
        "Very high tyramine exposure can cause hypertension if functional selectivity is exceeded, so patients need practical label-based teaching rather than the claim that food never matters."
      ],
      keyLabs: [
        "No routine safinamide level is used; monitor off time, dyskinesia, blood pressure, temperature, mental status, sleep, hallucinations, compulsions, and falls because clinical motor, autonomic, neurologic, sleep, and psychiatric effects determine benefit and toxicity.",
        "Review hepatic function because moderate impairment changes allowable exposure and severe impairment is contraindicated.",
        "Assess vision and ophthalmic history when retinal risk exists because labeling recommends periodic monitoring in susceptible patients."
      ],
      nclexTraps: [
        "Safinamide is an adjunct to levodopa/carbidopa for off episodes in U.S. labeling, not a standalone dopamine replacement.",
        "Do not state that sodium-channel blockade or glutamate suppression is the proven human therapeutic mechanism; current labeling says the precise mechanism is unknown.",
        "Less off time can mean more dyskinesia because the medication increases effective dopaminergic exposure."
      ],
      populationRisks: populationRisks(
        "Pediatric safety and effectiveness are not established.",
        "Older adults are more vulnerable to hallucinations, falls, orthostasis, and polypharmacy interactions because reserve is lower.",
        "Pregnancy and lactation evidence is limited and animal data raise concern; specialist review is required."
      ),
      sourceNote: "Current U.S. XADAGO labeling: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c4d65f28-983f-42b4-bb23-023ae0fe81b2",
      sourceKeys: ["dailymed-xadago"],
      tags: ["frontier-wave22", "safinamide", "Xadago", "MAO-B", "off episodes", "mechanism uncertainty", "strict why closure"]
    }),
    drugCard({
      name: "Entacapone",
      aliases: ["Comtan", "entacapon", "entacapone COMT", "Stalevo component", "orange urine Parkinson drug", "wearing off COMT inhibitor"],
      brandExamples: ["Comtan", "Stalevo (combination component)"],
      class: "Selective reversible peripheral catechol-O-methyltransferase inhibitor",
      classPathway: ["Neurologic medication", "COMT inhibitor", "Peripheral levodopa preservation during end-of-dose wearing-off"],
      usedToTreat: "Adjunct to levodopa/carbidopa for end-of-dose wearing-off in Parkinson disease. It has no useful antiparkinson effect by itself because its clinical role is to preserve levodopa rather than stimulate dopamine receptors directly.",
      description: "Entacapone is a peripheral COMT inhibitor that prevents competing levodopa metabolism, extending levodopa exposure and helping predictable end-of-dose wearing-off without providing a useful standalone antiparkinson effect. Once carbidopa blocks peripheral decarboxylation, COMT becomes an important competing route that converts levodopa to 3-O-methyldopa (3-OMD). Inhibiting that route increases levodopa area under the curve and lengthens its half-life. The same mechanism can make a levodopa peak excessive, so dyskinesia may appear or worsen soon after addition. Orange-brown urine can be a benign drug-color effect, while persistent diarrhea, colitis, weight loss, severe muscle injury, hallucinations, or withdrawal hyperpyrexia are not benign.",
      mechanism: "Entacapone selectively and reversibly inhibits COMT. Human data establish predominant peripheral COMT inhibition; a clinically meaningful central effect has not been established. Reduced conversion of levodopa to 3-O-methyldopa raises levodopa exposure and prolongs elimination, allowing more precursor to reach brain between doses. Entacapone does not become dopamine and has no independent benefit without levodopa. Because it potentiates the existing levodopa regimen rather than creating a separate motor pathway, both benefit and dyskinesia closely track levodopa exposure.",
      boxedWarning: noBoxed("Entacapone can potentiate levodopa dyskinesia, somnolence and sleep attacks, orthostatic hypotension or syncope, hallucinations, compulsive behavior, severe or prolonged diarrhea and colitis, weight loss, rhabdomyolysis, and withdrawal-emergent hyperpyrexia and confusion. Orange-brown urine discoloration is expected and usually benign, but must not be confused with dark urine from systemic illness."),
      adverseEffects: [
        "Dyskinesia, nausea, hallucination, orthostasis, and somnolence increase because levodopa exposure is prolonged.",
        "Orange-brown urine occurs because colored drug metabolites are excreted and is usually harmless in the absence of systemic or urinary red flags.",
        "Delayed persistent diarrhea, colitis, weight loss, or dehydration can occur and may appear after weeks or months, so timing does not exclude the drug."
      ],
      contraindications: [
        "Do not use as monotherapy because COMT inhibition does not replace levodopa or directly stimulate dopamine receptors.",
        "Avoid nonselective MAO inhibition because simultaneous blockade of major catecholamine-metabolism pathways can cause dangerous monoamine accumulation.",
        "Clarify severe diarrhea or colitis, major hepatic or biliary disease, prior hyperpyrexia syndrome, or rhabdomyolysis because those conditions increase harm or complicate clearance."
      ],
      nursingEssentials: [
        "Track dose-end off time and dyskinesia after addition because the desired longer levodopa effect can cross the dyskinesia threshold.",
        "Monitor stool frequency, duration, weight, hydration, abdominal symptoms, and fever because delayed colitis and dehydration require more than routine antidiarrheal teaching.",
        "Teach that orange-brown urine can be expected but escalate dark urine with muscle pain, jaundice, weakness, or low output because rhabdomyolysis or liver-related illness is different."
      ],
      interactions: [
        "Levodopa effects intensify by design, so dyskinesia, hallucination, orthostasis, and nausea can increase.",
        "Catechol drugs metabolized by COMT, including selected vasopressors and apomorphine, can have exaggerated cardiovascular effects because their breakdown is reduced.",
        "Warfarin effect can change, so INR monitoring is appropriate when therapy is started or changed; nonselective MAO inhibitors should generally be avoided."
      ],
      keyLabs: [
        "No entacapone serum level is used; measure timed off duration, dyskinesia, blood pressure, cognition, sleep, stool pattern, weight, and hydration because clinical levodopa response, neuropsychiatric effects, and gastrointestinal losses determine benefit and harm.",
        "Monitor INR when clinically relevant with warfarin because interaction can change anticoagulant effect.",
        "Check CK, creatinine, electrolytes, urinalysis, and liver tests when severe muscle symptoms, dark urine, dehydration, jaundice, or systemic illness appears because rhabdomyolysis, kidney injury, electrolyte loss, and hepatobiliary disease require different urgent responses."
      ],
      nclexTraps: [
        "Entacapone prolongs levodopa; it is not converted to dopamine and does not work alone.",
        "Orange-brown urine alone is usually benign, while dark urine plus muscle pain, jaundice, or low output requires evaluation.",
        "New dyskinesia after entacapone often proves the levodopa effect became too strong, not that Parkinson disease suddenly worsened."
      ],
      populationRisks: populationRisks(
        "Pediatric safety and effectiveness are not established.",
        "Older adults have more orthostasis, hallucination, dehydration, and fall risk, so diarrhea and amplified levodopa effects are more consequential.",
        "Pregnancy and lactation evidence is limited; specialist review is required."
      ),
      sourceNote: "Current U.S. entacapone labeling: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e9e94e9f-cd7a-45f5-9aeb-9c28ed804d8c",
      sourceKeys: ["dailymed-entacapone"],
      tags: ["frontier-wave22", "entacapone", "Comtan", "COMT", "wearing off", "orange urine", "levodopa adjunct"]
    }),
    drugCard({
      name: "Tolcapone",
      aliases: ["Tasmar", "tolcapone COMT", "tolcapone liver failure", "central peripheral COMT inhibitor", "Parkinson wearing off liver monitoring"],
      brandExamples: ["Tasmar"],
      class: "Selective reversible COMT inhibitor restricted by potentially fatal hepatotoxicity",
      classPathway: ["Neurologic medication", "COMT inhibitor", "Levodopa prolongation with boxed liver-failure risk"],
      usedToTreat: "Adjunct to levodopa/carbidopa for signs and symptoms of idiopathic Parkinson disease, ordinarily reserved for patients with motor fluctuations who do not respond satisfactorily to or are not appropriate candidates for other adjunctive therapies because potentially fatal liver failure changes the risk-benefit threshold.",
      description: "Tolcapone is a central-and-peripheral COMT inhibitor that prolongs levodopa exposure but carries a boxed warning for acute fulminant liver failure, so it is not a routine interchangeable alternative to entacapone or opicapone. Its clinical value must be observable and justify continued exposure. Baseline liver disease or abnormal transaminases can make initiation unsafe, and new fatigue, anorexia, persistent nausea, jaundice, dark urine, pruritus, or right-upper-quadrant pain can signal hepatocellular injury. Like other levodopa-potentiating drugs, it can worsen dyskinesia, orthostasis, hallucinations, diarrhea, rhabdomyolysis, and hyperpyrexia-confusion after withdrawal.",
      mechanism: "Tolcapone selectively and reversibly inhibits COMT, reducing levodopa conversion to 3-O-methyldopa (3-OMD) and increasing the amount and duration of levodopa available for brain transport. The precise clinical mechanism is not fully established beyond levodopa preservation. Although tolcapone can enter the CNS to some degree, the relative central contribution to human benefit should not be overstated because central COMT inhibition is demonstrated mainly in animal evidence. Tolcapone has no useful standalone antiparkinson action because it preserves levodopa rather than replacing dopamine. Laboratory surveillance remains essential because hepatotoxicity is not explained by therapeutic COMT inhibition alone and cannot be reliably predicted from symptoms.",
      boxedWarning: "Boxed warning: potentially fatal acute fulminant liver failure has occurred. Tolcapone should ordinarily be reserved for levodopa-treated patients with fluctuations who do not respond to or are not appropriate candidates for other adjuncts. Do not initiate with liver disease or transaminases above label thresholds; monitor liver tests according to current labeling, stop for biochemical or clinical liver injury, and do not rechallenge after suspected tolcapone hepatocellular injury because recurrence may be severe.",
      adverseEffects: [
        "Dyskinesia, nausea, hallucination, orthostasis, and sleepiness increase because levodopa exposure is prolonged.",
        "Persistent diarrhea and weight loss can cause dehydration and functional decline because COMT inhibition and intestinal effects continue beyond one dose.",
        "Hepatocellular injury can progress to fulminant failure, while severe dyskinesia or rigidity can contribute to rhabdomyolysis."
      ],
      contraindications: [
        "Do not initiate with active liver disease or abnormal transaminases defined by current labeling because hepatic injury can be fatal.",
        "Do not restart after tolcapone-associated hepatocellular injury and avoid in a history of nontraumatic rhabdomyolysis or medication-related hyperpyrexia-confusion because recurrence risk is unacceptable.",
        "Avoid nonselective MAO inhibition because combined blockade of catecholamine metabolism can cause dangerous monoamine accumulation."
      ],
      nursingEssentials: [
        "Verify that safer adjunct options and expected observable benefit were considered because boxed hepatic risk makes tolcapone a restricted choice.",
        "Obtain and trend liver tests per current label and assess fatigue, anorexia, persistent nausea, jaundice, dark urine, pruritus, and right-upper-quadrant pain because symptoms may signal hepatocellular injury between tests.",
        "Track off time, dyskinesia, stool pattern, weight, blood pressure, hallucinations, muscle pain, and urine because benefit and multiple toxicities are clinically visible."
      ],
      interactions: [
        "Levodopa effect intensifies by design, so dyskinesia, hallucination, orthostasis, and nausea may require regimen reassessment.",
        "Catechol drugs metabolized by COMT can have exaggerated cardiovascular effects because their breakdown is reduced.",
        "Other hepatotoxic exposures and alcohol complicate detection and reserve because liver injury can become fatal; nonselective MAO inhibitors should be avoided."
      ],
      keyLabs: [
        "Baseline and serial ALT and AST are required according to current boxed-warning labeling because biochemical injury may precede liver failure.",
        "Bilirubin, INR, alkaline phosphatase, glucose, renal function, and urgent hepatology assessment matter when liver injury is suspected because synthetic failure changes prognosis.",
        "Check CK, creatinine, potassium, urinalysis, and volume status when severe dyskinesia, rigidity, muscle pain, or dark urine suggests rhabdomyolysis because muscle breakdown can cause myoglobinuria, electrolyte danger, volume depletion, and acute kidney injury."
      ],
      nclexTraps: [
        "Tolcapone is not simply a longer or stronger entacapone; its boxed fatal-liver-failure risk makes it a restricted adjunct.",
        "Dark urine on tolcapone is not dismissed as benign COMT-drug discoloration when liver or muscle symptoms are present.",
        "Normal motor improvement does not cancel liver surveillance because efficacy and hepatotoxicity are separate outcomes."
      ],
      populationRisks: populationRisks(
        "Pediatric safety and effectiveness are not established.",
        "Older adults have more polypharmacy, liver vulnerability, orthostasis, hallucination, diarrhea-related dehydration, and fall risk.",
        "Pregnancy and lactation evidence is limited; boxed hepatic risk and maternal mobility require specialist review."
      ),
      sourceNote: "Current U.S. TASMAR labeling: https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=a0e47a9d-78e7-4523-983a-aa259f221736",
      sourceKeys: ["dailymed-tasmar"],
      tags: ["frontier-wave22", "tolcapone", "Tasmar", "COMT", "boxed warning", "liver failure", "wearing off"]
    }),
    drugCard({
      name: "Amantadine",
      aliases: ["Gocovri", "Osmolex ER", "Symmetrel", "amantidine", "amantadine dyskinesia", "NMDA Parkinson drug", "livedo reticularis Parkinson medicine"],
      brandExamples: ["Gocovri", "Osmolex ER", "Symmetrel (legacy)"],
      class: "Adamantane antiparkinson and antidyskinetic medication with incompletely established mechanism",
      classPathway: ["Neurologic medication", "Antiparkinson and antidyskinetic therapy", "Renally cleared NMDA-related and dopaminergic pharmacology"],
      usedToTreat: "The labeled role depends on formulation: selected immediate-release products treat parkinsonism and drug-induced extrapyramidal reactions; OSMOLEX ER treats Parkinson disease and drug-induced extrapyramidal reactions in adults; GOCOVRI treats levodopa-induced dyskinesia and is an adjunct to levodopa/carbidopa for off episodes. These products are not interchangeable because release profiles and indications differ.",
      description: "Amantadine is an adamantane CNS modulator that can improve Parkinson symptoms and, with selected extended-release use, reduce levodopa-induced dyskinesia and off episodes even though its exact therapeutic mechanism remains unknown. Weak uncompetitive NMDA-receptor antagonism and direct or indirect dopaminergic effects are plausible pharmacology, but they should be presented as proposed contributors rather than settled human mechanism. Amantadine is cleared mainly by the kidneys; reduced renal function can cause hallucinations, confusion, myoclonus, edema, falls, and severe toxicity. Formulation mistakes matter because immediate-release, OSMOLEX ER, and GOCOVRI deliver different exposure and have different labels. Abrupt withdrawal can cause delirium, severe rigidity, fever, or neuroleptic-malignant-like illness.",
      mechanism: "Current labels state that amantadine's mechanism in Parkinson disease and dyskinesia is unknown. It is a weak uncompetitive NMDA-receptor antagonist and may increase dopamine release, reduce reuptake, or alter other dopaminergic signaling, but the contribution of each effect to human benefit has not been established. Reducing abnormal glutamatergic drive is a leading explanation for antidyskinetic benefit, yet it remains a model rather than a complete proven sequence. Renal filtration and secretion dominate elimination; half-life lengthens sharply as kidney function falls, so neuropsychiatric toxicity can reflect accumulation rather than Parkinson progression.",
      boxedWarning: noBoxed("Amantadine formulations carry serious warnings for falling asleep during activity, suicidality or depression, hallucinations and psychosis, dizziness and orthostasis, impulse-control behavior, and withdrawal-emergent hyperpyrexia and confusion. Selected extended-release products are contraindicated in end-stage renal disease because accumulation is dangerous; GOCOVRI also warns about corneal edema and vision change."),
      adverseEffects: [
        "Hallucinations, confusion, insomnia, dizziness, myoclonus, and falls become more likely with renal accumulation because CNS exposure rises.",
        "Peripheral edema and livedo reticularis can occur from vascular effects; the lacy skin pattern may be recognizable but still requires assessment of circulation and overall tolerance.",
        "Dry mouth, constipation, urinary retention, blurred vision, orthostasis, compulsions, and sleepiness can occur even though amantadine has no proven direct anticholinergic therapeutic mechanism."
      ],
      contraindications: [
        "Do not substitute formulations milligram-for-milligram because release profile, timing, indication, and renal rules differ.",
        "Avoid selected extended-release products in end-stage renal disease and review all products carefully in reduced renal function because accumulation can cause severe CNS toxicity.",
        "Avoid abrupt discontinuation when tapering is possible because fever, rigidity, confusion, delirium, agitation, and severe motor decline can follow."
      ],
      nursingEssentials: [
        "Verify product, release form, indication, and renal function before administration because the word amantadine does not define interchangeable exposure.",
        "Assess hallucinations, confusion, sleep, suicidality, compulsions, falls, edema, livedo reticularis, bowel and bladder function, and motor response because toxicity spans CNS, vascular, and autonomic systems.",
        "Escalate new blurred vision, halos, eye pain, or corneal symptoms with GOCOVRI because corneal edema can threaten vision."
      ],
      interactions: [
        "Anticholinergic drugs can add confusion, constipation, urinary retention, blurred vision, and heat intolerance because adverse effects converge.",
        "Urinary-pH-altering drugs can change renal elimination, and alcohol or sedatives can add dizziness and CNS impairment.",
        "Live attenuated influenza vaccine may interact with amantadine's antiviral activity, while other dopaminergic drugs can add hallucination, orthostasis, and compulsions."
      ],
      keyLabs: [
        "Creatinine and estimated renal function are essential because renal clearance determines exposure and formulation eligibility.",
        "No routine serum level guides therapy; monitor cognition, hallucinations, sleep, suicidality, compulsions, falls, edema, skin, bowel and bladder function, dyskinesia, and off time because clinical neurologic, psychiatric, autonomic, motor, and tissue effects determine useful versus excessive exposure.",
        "Obtain ophthalmic evaluation for new visual symptoms on GOCOVRI because corneal edema requires prompt assessment."
      ],
      nclexTraps: [
        "Amantadine's exact Parkinson and antidyskinetic mechanism is unknown; NMDA antagonism and dopaminergic effects are proposed, not a fully proven causal chain.",
        "GOCOVRI, OSMOLEX ER, and immediate-release amantadine are not interchangeable even though the active ingredient is the same.",
        "New hallucinations in kidney injury may represent amantadine accumulation rather than unavoidable Parkinson psychosis."
      ],
      populationRisks: populationRisks(
        "Pediatric use varies by product and indication; wave22 Parkinson roles are adult focused, and accidental exposure can cause serious CNS toxicity.",
        "Older adults often have reduced renal function and higher hallucination, urinary retention, orthostasis, and fall risk, so calculated kidney function and cognition matter.",
        "Pregnancy and lactation evidence is limited and drug can enter milk; specialist review is required."
      ),
      sourceNote: "Current U.S. GOCOVRI, OSMOLEX ER, and immediate-release amantadine labeling: " + DAILYMED_SEARCH + "amantadine",
      sourceKeys: ["dailymed-gocovri", "dailymed-osmolex", "dailymed-amantadine"],
      tags: ["frontier-wave22", "amantadine", "Gocovri", "dyskinesia", "renal", "NMDA", "mechanism uncertainty"]
    }),
    drugCard({
      name: "Istradefylline",
      aliases: ["Nourianz", "istradefiline", "istradefylline A2A", "adenosine antagonist Parkinson", "non dopamine off medicine", "Nourianz off episodes"],
      brandExamples: ["Nourianz"],
      class: "Adenosine A2A-receptor antagonist used as a levodopa/carbidopa adjunct",
      classPathway: ["Neurologic medication", "Nondopaminergic Parkinson adjunct", "Adenosine A2A antagonism during off episodes"],
      usedToTreat: "Adjunctive treatment to levodopa/carbidopa in adults with Parkinson disease who experience off episodes. It does not replace levodopa and is not labeled as monotherapy or as disease-modifying treatment.",
      description: "Istradefylline blocks adenosine A2A receptors in striatal indirect-pathway circuits, which can reduce levodopa off time without directly stimulating dopamine receptors. Current labeling states that the precise therapeutic mechanism is unknown and bases the circuit connection on in-vitro and animal evidence, so the pathway model should not be mistaken for a fully proven human sequence. Dyskinesia, hallucinations, psychosis, insomnia, dizziness, constipation, and compulsive behavior can still occur because changing indirect-pathway signaling interacts with the levodopa-treated motor network. CYP3A4 interactions, hepatic impairment, and heavy tobacco smoking materially alter exposure.",
      mechanism: "Istradefylline is an adenosine A2A-receptor antagonist. In the classical basal-ganglia model, A2A receptors interact with D2-associated indirect-pathway signaling; antagonism may reduce excessive movement-suppressing output in the dopamine-depleted state. The precise human therapeutic mechanism is unknown, and in-vitro receptor binding plus animal models should not be presented as a complete proven sequence. CYP3A4 is a major metabolic pathway. Strong inhibitors raise exposure, strong inducers lower it, and heavy tobacco smoking lowers exposure substantially through enzyme induction, which explains label-specific exposure adjustments.",
      boxedWarning: noBoxed("Istradefylline can cause or worsen dyskinesia, hallucinations, psychotic behavior, and impulse-control or compulsive behavior. Strong CYP3A4 inhibitors raise exposure, strong inducers should be avoided, severe hepatic impairment should be avoided, and heavy smoking lowers exposure. Animal data indicate potential fetal harm."),
      adverseEffects: [
        "Dyskinesia can worsen because indirect-pathway modulation is added to levodopa's dopaminergic effect.",
        "Hallucinations, psychotic behavior, insomnia, dizziness, and compulsions can occur because striatal and wider CNS signaling is altered even without direct dopamine agonism.",
        "Constipation and nausea can occur and become clinically important when Parkinson dysmotility is already present."
      ],
      contraindications: [
        "Avoid or reconsider in uncontrolled psychosis or severe dyskinesia because the drug can worsen both even though it is nondopaminergic by target.",
        "Avoid severe hepatic impairment because clearance is reduced, and review strong CYP3A4 inhibitors or inducers because exposure can move outside the intended range.",
        "Document heavy tobacco use and changes because smoking can lower exposure; cessation can therefore change effect without a prescription change."
      ],
      nursingEssentials: [
        "Track off time and dyskinesia separately because benefit can coexist with excessive involuntary movement.",
        "Ask patient and care partner about hallucinations, paranoia, insomnia, gambling, shopping, eating, and sexual urges because nondopaminergic does not mean behaviorally neutral.",
        "Review liver function, CYP3A4 medicines, and cigarettes per day because metabolism and smoking materially change exposure."
      ],
      interactions: [
        "Strong CYP3A4 inhibitors raise exposure and strong inducers lower it because CYP3A4 is central to metabolism.",
        "Heavy tobacco smoking lowers exposure, while smoking cessation may raise it as induction fades.",
        "Other Parkinson therapies can add dyskinesia, hallucinations, or compulsions because network effects converge even when molecular targets differ."
      ],
      keyLabs: [
        "No routine serum level is used; monitor timed off hours, dyskinesia, hallucinations, psychosis, sleep, compulsions, constipation, and falls because clinical motor, psychiatric, sleep, gastrointestinal, and safety outcomes determine benefit and toxicity.",
        "Assess hepatic function because impairment alters exposure and severe impairment should be avoided.",
        "Record smoking intensity and changes as a pharmacokinetic measurement because heavy smoking can substantially reduce exposure."
      ],
      nclexTraps: [
        "Istradefylline targets adenosine A2A receptors, not dopamine receptors, but it can still worsen dyskinesia and hallucinations through circuit interaction.",
        "The exact human therapeutic mechanism is unknown; the indirect-pathway explanation is a supported model rather than settled proof.",
        "It is an adjunct to levodopa/carbidopa for off episodes, not a replacement for levodopa and not a disease-modifying drug."
      ],
      populationRisks: populationRisks(
        "Pediatric safety and effectiveness are not established.",
        "Older adults have more hallucination, constipation, insomnia, dyskinesia, and polypharmacy interaction risk because reserve is lower.",
        "Animal data suggest fetal harm and human pregnancy or lactation data are limited; specialist review is required."
      ),
      sourceNote: "Current U.S. NOURIANZ labeling: https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=a7d008cb-b273-4049-a5d2-9c6902910d58&version=6",
      sourceKeys: ["dailymed-nourianz"],
      tags: ["frontier-wave22", "istradefylline", "Nourianz", "adenosine A2A", "off episodes", "CYP3A4", "smoking"]
    })
  ];
  const pathologyCards = [
    {
      name: "Parkinson disease",
      category: "Progressive neurodegenerative movement disorder",
      aliases: ["Parkinson's disease", "Parkinsons disease", "PD", "idiopathic Parkinson disease", "shaking slow stiff disease", "substantia nigra dopamine loss", "Lewy body Parkinson"],
      pronunciation: "PAR-kin-sun dih-ZEEZ",
      wordOrigin: "The disorder is named for James Parkinson, who described the clinical syndrome in 1817. Disease emphasizes that it includes motor, cognitive, autonomic, sleep, sensory, and psychiatric biology rather than tremor alone.",
      definition: "Parkinson disease is a progressive neurodegenerative disorder defined clinically by parkinsonism - bradykinesia plus rest tremor, rigidity, or both - together with a compatible pattern and exclusion of stronger alternatives. Degeneration of substantia-nigra pars compacta neurons reduces striatal dopamine and disrupts basal-ganglia selection and scaling of movement. Alpha-synuclein-rich Lewy pathology is common, but symptoms extend beyond dopamine circuits to smell, sleep, mood, cognition, swallowing, bowel, bladder, and autonomic control. Treatment improves symptoms; it does not currently replace lost neurons or prove that progression has stopped.",
      etiology: "Most cases are multifactorial and arise from age-related vulnerability interacting with genetic and environmental factors. Pathogenic variants in genes such as LRRK2, SNCA, PRKN, PINK1, DJ-1, and GBA-related biology contribute in selected patients, while pesticide or toxin exposures are associated with risk in populations but do not explain every individual case. Mitochondrial dysfunction, impaired protein clearance, lysosomal dysfunction, neuroinflammation, and alpha-synuclein aggregation are implicated mechanisms rather than a single universal cause.",
      pathology: "The most recognized lesion is loss of pigmented dopaminergic neurons in substantia nigra pars compacta with denervation of the posterior putamen. Many affected neurons and connected regions contain Lewy bodies or Lewy neurites rich in aggregated alpha-synuclein. Pathology is multisystem: noradrenergic, serotonergic, cholinergic, enteric, olfactory, autonomic, and cortical networks can be involved, explaining why constipation, REM-sleep behavior disorder, depression, anosmia, orthostasis, and cognitive change can precede or outgrow limb symptoms.",
      pathophysiology: "Nigrostriatal dopamine normally supports D1-associated direct pathway activity and restrains D2-associated indirect pathway activity. Dopamine loss shifts basal-ganglia output toward excessive inhibition of motor thalamic and brainstem targets, making intended movement slow, small, and difficult to initiate. This classical model explains bradykinesia and rigidity but is not a complete explanation of tremor, freezing, posture, or nonmotor disease because basal-ganglia pathways overlap and wider networks degenerate. Levodopa restores dopamine precursor, agonists stimulate receptors, and enzyme inhibitors prolong dopaminergic signaling. As terminals disappear, dopamine storage and buffering decline, turning plasma levodopa variation into wearing-off, on-off transitions, and dyskinesia. Alpha-synuclein aggregation correlates with disease biology, but the exact chain from aggregation to selective neuronal death remains incompletely resolved.",
      riskFactors: [
        "Increasing age is the strongest general risk because neuronal, mitochondrial, proteostatic, and repair reserve decline over time.",
        "Family history or a pathogenic genetic variant can raise risk because dopamine-neuron maintenance, lysosomal function, mitochondrial quality control, or alpha-synuclein handling is altered.",
        "Selected pesticide, solvent, or toxin exposures are associated with risk because mitochondrial or oxidative injury may stress vulnerable neurons, although association does not prove an individual cause.",
        "REM-sleep behavior disorder, hyposmia, constipation, and subtle autonomic change can precede motor diagnosis because degeneration begins in distributed networks before threshold motor dopamine loss is obvious."
      ],
      signsSymptoms: [
        "Bradykinesia appears as slowed initiation, reduced amplitude, decrement with repetition, smaller handwriting, soft voice, reduced arm swing, masked face, or difficulty turning because movement scaling is impaired.",
        "Rest tremor and rigidity are common but not required together; postural instability often becomes more prominent later because balance involves partly nondopaminergic networks.",
        "Freezing, festination, falls, dysphagia, drooling, constipation, urinary dysfunction, orthostasis, pain, fatigue, anosmia, depression, hallucinations, sleep disorders, and cognitive change show that Parkinson disease is multisystem.",
        "Marked early falls, vertical gaze palsy, cerebellar signs, severe early autonomic failure, rapid progression, poor levodopa response, or symmetric drug-linked onset suggests an atypical or secondary parkinsonism rather than routine idiopathic disease."
      ],
      diagnostics: [
        "Diagnosis is primarily clinical: document bradykinesia, tremor, rigidity, symmetry, progression, nonmotor features, medication exposure, neurologic examination, and response pattern because no single blood test confirms routine Parkinson disease.",
        "Review dopamine-blocking drugs, vascular events, toxins, hydrocephalus, structural disease, essential tremor, depression, neuropathy, and atypical parkinsonian syndromes because treatment and prognosis differ.",
        "MRI and selected laboratory studies help exclude mimics when the pattern is atypical; dopaminergic imaging may support presynaptic dopamine deficit but does not by itself distinguish every degenerative parkinsonism.",
        "Assess swallowing, cognition, mood, psychosis, sleep, autonomic function, falls, driving, nutrition, and caregiver strain because diagnosis is incomplete if only limb movement is measured."
      ],
      labs: [
        "There is no diagnostic dopamine level because peripheral dopamine does not represent nigrostriatal signaling.",
        "Targeted thyroid, B12, metabolic, infectious, toxic, or genetic testing is selected from the presentation because these tests identify mimics or contributors rather than proving ordinary Parkinson disease.",
        "Medication-specific renal, hepatic, blood-pressure, ECG, and laboratory monitoring is driven by the chosen therapy because Parkinson drugs do not share one safety panel."
      ],
      treatments: [
        "Carbidopa/levodopa generally provides the greatest motor symptom benefit; dopamine agonists or MAO-B inhibitors may fit selected patients, while COMT inhibitors, safinamide, amantadine, istradefylline, and other adjuncts address off time or dyskinesia according to the specific pattern.",
        "Regular exercise plus physical, occupational, speech, voice, and swallowing therapy preserves function and compensatory strategies because medication does not correct every gait, posture, speech, or balance deficit.",
        "Deep-brain stimulation or device-aided therapy may help selected levodopa-responsive motor fluctuations or tremor, but cognition, gait phenotype, comorbidity, and goals determine suitability because surgery does not stop neurodegeneration.",
        "Treat constipation, orthostasis, sleep disorder, depression, psychosis, pain, urinary symptoms, nutrition, and caregiver stress directly because nonmotor disease often determines quality and safety."
      ],
      nursingPriorities: [
        "Give time-critical Parkinson medication on the individualized schedule because delayed doses can cause immobility, pain, aspiration, loss of toileting independence, and falls.",
        "Assess swallowing, cough, voice, weight, hydration, bowel pattern, orthostatic blood pressure, mobility, skin, sleep, cognition, hallucinations, and caregiver reports because the disease is multisystem and insight may decline.",
        "Record symptoms in relation to dose and meal time because the distinction among off state, dyskinesia, orthostasis, sedation, and progression determines the next clinical question.",
        "Avoid unplanned dopamine-blocking antiemetics or antipsychotics because they can abruptly worsen parkinsonism; use a Parkinson-aware medication review."
      ],
      complications: [
        "Aspiration pneumonia, malnutrition, dehydration, falls, fractures, pressure injury, venous thrombosis, and loss of independence can follow immobility and dysphagia.",
        "Motor fluctuations and dyskinesia develop as disease progression narrows dopamine buffering and chronic pulsatile treatment changes network response.",
        "Dementia, psychosis, depression, autonomic failure, sleep disorder, and caregiver burnout can become more disabling than tremor because wider neural systems degenerate.",
        "Abrupt dopaminergic withdrawal can cause Parkinsonism-hyperpyrexia syndrome with rigidity, fever, confusion, autonomic instability, rhabdomyolysis, and death."
      ],
      redFlags: [
        "Sudden focal deficit, abrupt severe change, new inability to awaken, chest pain, syncope, or acute delirium because stroke, infection, medication toxicity, or another emergency should not be labeled progression.",
        "Fever, profound rigidity, confusion, autonomic instability, dark urine, or rapid immobility after medication interruption because Parkinsonism-hyperpyrexia syndrome may be developing.",
        "Choking, wet voice, recurrent pneumonia, weight loss, or inability to manage secretions because silent or overt aspiration can be fatal.",
        "New gambling, shopping, hypersexuality, binge eating, hallucinations, or sleep while driving because dopaminergic toxicity can endanger the patient and others."
      ],
      patientEducation: [
        "Use an exact medication list and schedule, including formulation, because Parkinson function can change when a dose is late or a release form is substituted.",
        "Report falls, faintness, hallucinations, compulsive urges, sudden sleep, swallowing change, constipation, weight loss, dyskinesia, and off periods because each points to a different treatable safety problem.",
        "Exercise and rehabilitation remain treatment, not optional extras, because strength, balance, cueing, voice, and swallowing require practice beyond dopamine replacement.",
        "Do not stop Parkinson medicine abruptly without urgent clinical direction because severe fever-rigidity illness can follow."
      ],
      nclexTraps: [
        "Parkinson disease is not diagnosed by tremor alone; bradykinesia and the overall neurologic pattern are central.",
        "Levodopa treats symptoms but does not prove that neuron loss has stopped, and response does not exclude every atypical syndrome.",
        "Dopamine loss explains major motor features, but nondopaminergic degeneration explains why cognition, orthostasis, swallowing, sleep, and falls may persist despite good limb response.",
        "A hospitalized patient needs home-time dosing, not merely standard medication-pass timing, because timing is part of the therapy."
      ],
      sourceNote: "NIA Parkinson disease overview (" + NIA_PARKINSON + "), NINDS Parkinson materials, AAN dopaminergic guideline reaffirmed 2025 (" + AAN_GUIDELINE + "), and current movement-disorder physiology literature.",
      sourceKeys: ["nia-parkinson", "ninds-parkinson", "aan-parkinson-dopaminergic-2025", "basal-ganglia-physiology"],
      nclexEssential: true,
      tags: ["frontier-wave22", "Parkinson disease", "alpha synuclein", "Lewy body", "substantia nigra", "bradykinesia", "strict why closure"]
    },
    {
      name: "Wearing-off and on-off motor fluctuations",
      category: "Parkinson treatment complication and pharmacokinetic-clinical syndrome",
      aliases: ["Parkinson wearing off", "levodopa wearing off", "on off phenomenon", "motor fluctuations", "dose ends early Parkinson", "unpredictable off episode", "delayed on Parkinson"],
      pronunciation: "WAIR-ing off and on-off MOH-tor fluk-choo-AY-shuns",
      wordOrigin: "On describes a period when medication provides useful motor benefit; off describes re-emergence or worsening of parkinsonian motor and nonmotor symptoms. Wearing-off is predictable loss near the end of a dose interval, while on-off emphasizes transitions that can become abrupt or unpredictable.",
      definition: "Wearing-off and on-off motor fluctuations are time-varying changes in Parkinson symptom control as dopaminergic benefit rises and falls. Predictable end-of-dose wearing-off occurs when benefit shortens before the next scheduled dose. Delayed-on means benefit starts late; dose failure means an expected response does not appear; unpredictable off can occur without a clear dose-end relationship. Correct classification matters because delayed gastric delivery, short pharmacologic duration, disease progression, and excessive peak effect require different solutions.",
      etiology: "Progressive loss of nigrostriatal terminals reduces dopamine storage and buffering, so plasma levodopa variation reaches motor circuits more directly. Short levodopa half-life, pulsatile delivery, gastroparesis, constipation, dietary protein, iron, inconsistent administration, formulation changes, poor absorption, acute illness, stress, and competing dopamine blockers can then produce visible fluctuations. The same patient may have predictable wearing-off, delayed-on, unpredictable off, and dyskinesia at different times.",
      pathology: "Motor fluctuations are functional network and exposure complications rather than a new destructive brain lesion. The damaged nigrostriatal system has a narrowing therapeutic window: too little effective stimulation produces off-state bradykinesia and rigidity, while excessive or rapidly rising stimulation can produce dyskinesia. Nonmotor off symptoms such as anxiety, pain, dyspnea sensation, sweating, urinary urgency, or cognitive slowing occur because dopaminergic and connected networks regulate more than movement.",
      pathophysiology: "Early in Parkinson disease, surviving terminals convert levodopa to dopamine, store it, and release it in a buffered fashion despite plasma variation. Progressive denervation reduces that reservoir, so receptor stimulation follows levodopa delivery more closely. Gastric emptying is often the rate-limiting step because levodopa is absorbed mainly in proximal small bowel; constipation and gastroparesis delay arrival, while amino acids compete for transport and iron can chelate drug. Predictable wearing-off reflects insufficient duration, whereas delayed-on or dose failure often points to delivery. Unpredictable on-off reflects a narrow threshold plus variable absorption and network sensitivity. Anxiety or immobility can further slow gastric emptying, creating a feedback loop.",
      riskFactors: [
        "Longer disease duration and greater nigrostriatal denervation because dopamine buffering capacity is lost.",
        "Higher or more pulsatile levodopa exposure because repeated peaks and troughs are translated into larger circuit swings.",
        "Gastroparesis, constipation, dehydration, high-protein timing, iron, and inconsistent medication administration because they delay or reduce levodopa delivery.",
        "Hospitalization, NPO status, formulary substitution, swallowing difficulty, infection, and dopamine-blocking drugs because routine care changes can interrupt a time-critical regimen."
      ],
      signsSymptoms: [
        "Off-state bradykinesia, rigidity, tremor, freezing, shuffling, dystonia, pain, anxiety, sweating, urinary urgency, low voice, or swallowing difficulty reappear as effective stimulation falls.",
        "Predictable return before the next dose suggests wearing-off, while erratic delayed benefit after meals or constipation suggests absorption variability.",
        "Peak involuntary choreiform movement suggests dyskinesia rather than off, although painful off dystonia can also be an abnormal posture.",
        "Sudden immobility with faintness, focal deficit, fever, sedation, or loss of consciousness requires another diagnosis because not every low-mobility period is off."
      ],
      diagnostics: [
        "Use a diary linking exact product, administration, meal and iron time, onset, useful on time, off return, dyskinesia, sleep, posture, and bowel activity because pattern is the diagnostic test.",
        "Observe a complete dose cycle when possible because brief clinic examination can capture only on or only off and miss the transition.",
        "Review formulation, missed doses, swallowing, gastric symptoms, constipation, interacting drugs, and hospitalization timing because reversible delivery problems can mimic progression.",
        "Evaluate acute focal or systemic red flags separately because stroke, infection, hypotension, seizure, and medication toxicity can resemble an off episode."
      ],
      labs: [
        "No routine levodopa level diagnoses wearing-off because plasma number without timing and symptoms does not define circuit response.",
        "Renal, hepatic, electrolyte, glucose, infection, and hemodynamic testing is selected when systemic illness may be worsening mobility or changing adjunct exposure.",
        "Nutrition and weight assessment matter because overly restrictive protein timing can create malnutrition while trying to improve absorption."
      ],
      treatments: [
        "Correct missed or delayed administration, constipation, gastroparesis contributors, meal or iron interference, swallowing barriers, and inappropriate dopamine blockers because delivery failure cannot be solved reliably by simply adding more drug.",
        "Clinicians may adjust levodopa timing or formulation, add a COMT or MAO-B inhibitor, dopamine agonist, istradefylline, or other adjunct, or use rescue/device-aided therapy according to the pattern because each approach changes onset, duration, or circuit stimulation differently.",
        "Treat dyskinesia separately when more on time becomes excessive movement because extending exposure without recognizing the upper threshold can worsen function.",
        "Use cueing, mobility assistance, swallowing precautions, and fall prevention during off periods because pharmacologic correction may not be immediate."
      ],
      nursingPriorities: [
        "Give the exact formulation at the exact individualized time because a delayed hospital dose can create a preventable off episode.",
        "Document on, off, delayed-on, dose failure, and dyskinesia with times rather than writing medication not working because each phrase supports a different clinical response.",
        "Assess swallowing and aspiration during off periods because bradykinesia and rigidity can impair safe eating and medication delivery.",
        "Protect transfers and toileting during transitions because a person may change rapidly from mobile to frozen or from controlled movement to dyskinesia."
      ],
      complications: [
        "Falls, aspiration, immobility pain, pressure injury, urinary retention, constipation, and loss of independence can occur during off periods.",
        "Dyskinesia, hallucinations, orthostasis, and sleepiness can increase when attempts to reduce off time push exposure above the therapeutic window.",
        "Anxiety, social isolation, medication overuse, and caregiver strain can grow because unpredictable mobility removes confidence and planning ability."
      ],
      redFlags: [
        "Abrupt persistent off state with fever, severe rigidity, confusion, autonomic instability, or dark urine because Parkinsonism-hyperpyrexia syndrome may be developing.",
        "New focal deficit, syncope, chest pain, hypoglycemia, seizure, or inability to awaken because another emergency may be mislabeled as off.",
        "Choking, wet voice, oxygen decline, or inability to swallow medication because aspiration and failed delivery can accelerate deterioration."
      ],
      patientEducation: [
        "Keep a simple time diary of medication, meals, onset, off return, and extra movements because pattern gives the clinician more information than a general bad day.",
        "Use consistent protein and iron timing only when advised, and preserve adequate nutrition because the goal is predictable absorption rather than food avoidance.",
        "Carry an exact medication and formulation list for emergency care because substitutions and standard hospital schedules can create off periods.",
        "Do not self-escalate rescue or maintenance therapy for every immobile episode because hypotension, dyskinesia, or another illness can look similar."
      ],
      nclexTraps: [
        "Wearing-off is predictable end-of-dose loss; delayed-on is late onset; dose failure is absent response; unpredictable on-off lacks a reliable dose-end pattern.",
        "Off-state dystonia and peak-dose dyskinesia are both abnormal movement but represent opposite sides of the exposure window.",
        "A patient can be off because levodopa never reached the intestine, not because the brain suddenly became resistant to the medication."
      ],
      sourceNote: "AAN dopaminergic guideline reaffirmed 2025 (" + AAN_GUIDELINE + "), current U.S. carbidopa/levodopa and adjunct labels, and established levodopa pharmacokinetic physiology.",
      sourceKeys: ["aan-parkinson-dopaminergic-2025", "dailymed-carbidopa-levodopa", "motor-fluctuation-physiology"],
      nclexEssential: true,
      tags: ["frontier-wave22", "wearing off", "on off", "motor fluctuation", "delayed on", "levodopa", "strict why closure"]
    },
    {
      name: "Levodopa-induced dyskinesia",
      category: "Treatment-related movement disorder",
      aliases: ["LID", "levodopa dyskinesia", "peak dose dyskinesia", "diphasic dyskinesia", "Parkinson extra movements", "chorea from levodopa"],
      pronunciation: "lee-voh-DOH-pah in-DOOST dis-kih-NEE-zhuh",
      wordOrigin: "Dys- means abnormal and -kinesia means movement. Levodopa-induced identifies the treatment exposure that interacts with a dopamine-depleted, sensitized basal-ganglia network to produce involuntary movement.",
      definition: "Levodopa-induced dyskinesia is involuntary choreiform, dystonic, writhing, jerking, or stereotyped movement that emerges in relation to dopaminergic treatment in Parkinson disease. Peak-dose dyskinesia occurs near strongest benefit, diphasic dyskinesia occurs as concentration rises or falls, and off dystonia occurs when dopaminergic effect is low. Naming the timing matters because the same visible movement can require opposite adjustments.",
      etiology: "Risk rises with younger Parkinson onset, longer disease and levodopa exposure, greater nigrostriatal denervation, higher levodopa exposure relative to body size, and more pulsatile peaks. It is not simply a toxic dose in a normal brain; progressive loss of dopamine buffering and maladaptive striatal plasticity allow intermittent receptor stimulation to produce an abnormal learned motor response.",
      pathology: "Dyskinesia reflects altered signaling and plasticity across striatal projection neurons, glutamatergic inputs, dopamine receptors, and downstream basal-ganglia output rather than new muscle disease. Dopamine-depleted circuits become sensitized to rapid changes, so medication that restores desired movement can overshoot into involuntary movement.",
      pathophysiology: "Levodopa produces fluctuating dopamine exposure. Early in disease, surviving terminals buffer those changes; later, fewer terminals make receptor stimulation more pulsatile. Repeated peaks alter D1-related signaling, glutamate transmission, gene expression, synaptic plasticity, and downstream firing patterns. Peak-dose dyskinesia appears when stimulation crosses the upper therapeutic threshold. Diphasic dyskinesia appears during rising and falling transitions, while low-exposure off dystonia reflects insufficient stimulation. Amantadine can reduce dyskinesia in selected formulations and patients, but its exact clinical mechanism remains unknown; NMDA-related modulation is a supported hypothesis, not complete proof.",
      riskFactors: [
        "Younger onset and longer anticipated treatment because sensitized circuits experience more years of fluctuating stimulation.",
        "Greater nigrostriatal denervation because fewer terminals remain to store and smooth dopamine delivery.",
        "Higher levodopa exposure, rapid peaks, low body weight, and pulsatile formulation or timing because the upper motor threshold is crossed more abruptly.",
        "Adjuncts that prolong levodopa or dopamine effect because improved off time can also amplify peak stimulation."
      ],
      signsSymptoms: [
        "Peak-dose chorea appears as flowing, dance-like, fidgeting, facial, neck, trunk, or limb movement near best on state.",
        "Dystonia produces sustained painful twisting or posture and may occur at peak, during transitions, or in an off state.",
        "Diphasic dyskinesia often appears as repetitive lower-limb movement during the beginning and end of benefit because the circuit passes through a vulnerable intermediate exposure.",
        "The patient may report feeling well and underestimate movement, while the care partner sees exhaustion, injury, weight loss, or impaired function."
      ],
      diagnostics: [
        "Link movement video or observation to exact dose, formulation, meal, onset of benefit, peak on, and off return because timing classifies the dyskinesia.",
        "Distinguish tremor, akathisia, restless legs, tics, myoclonus, seizure, off dystonia, and functional movement because treatment differs.",
        "Assess whether movement is troublesome, painful, unsafe, exhausting, socially limiting, or causing weight loss because visible severity does not equal patient impact.",
        "Review new COMT, MAO-B, dopamine-agonist, amantadine, or formulation changes because adjunct exposure can shift the motor window."
      ],
      labs: [
        "There is no diagnostic levodopa or dopamine level; timed clinical observation defines the relationship.",
        "Check weight and nutrition because constant movement increases energy expenditure and low body weight can raise exposure per kilogram.",
        "Check CK, renal function, electrolytes, and urinalysis when movement is severe or prolonged because muscle breakdown and dehydration can occur."
      ],
      treatments: [
        "Clinicians reshape levodopa peaks, intervals, formulation, and adjunct burden according to whether dyskinesia is peak-dose, diphasic, or off dystonia because a single strategy can improve one pattern and worsen another.",
        "Selected amantadine formulations can treat levodopa-induced dyskinesia, while renal function and hallucination risk determine safety because accumulation causes serious CNS toxicity.",
        "Device-aided therapy or deep-brain stimulation may help selected levodopa-responsive patients with disabling fluctuations because more continuous stimulation or circuit modulation can widen functional on time.",
        "Physical safety, hydration, nutrition, skin protection, and fall prevention matter while medication strategy is adjusted because dyskinesia itself consumes energy and destabilizes movement."
      ],
      nursingPriorities: [
        "Document exact movement timing and function rather than calling all shaking tremor because peak-dose dyskinesia signals excessive effective stimulation.",
        "Assess falls, pain, exhaustion, hydration, weight, skin injury, sleep, hallucinations, and caregiver burden because motor improvement can coexist with serious harm.",
        "Do not independently hold levodopa for visible dyskinesia because abrupt withdrawal can create profound off state or hyperpyrexia syndrome; escalate for a planned adjustment.",
        "Review renal function before amantadine because hallucination or confusion can reflect accumulation."
      ],
      complications: [
        "Falls, collision injury, pain, exhaustion, dehydration, weight loss, and social withdrawal can occur when involuntary movement becomes severe.",
        "Rhabdomyolysis and kidney injury can occur rarely with extreme sustained movement because muscle energy demand and breakdown become excessive.",
        "Undertreatment can follow if all movement is suppressed without preserving useful on time, causing immobility, aspiration, and loss of independence."
      ],
      redFlags: [
        "Severe continuous movement with fever, muscle pain, weakness, dark urine, low urine output, or dehydration because rhabdomyolysis may be developing.",
        "New movement with loss of awareness, focal deficit, or persistent altered consciousness because seizure or another neurologic emergency is not routine dyskinesia.",
        "Abrupt drug reduction followed by fever, rigidity, and confusion because Parkinsonism-hyperpyrexia syndrome is different from dyskinesia."
      ],
      patientEducation: [
        "Record or safely video movement with medication and meal times because the pattern may be absent during the clinic visit.",
        "Report whether movement is painful, exhausting, unsafe, or functionally limiting because treatment aims for useful on time, not a motionless appearance.",
        "Do not skip or abruptly stop Parkinson doses to suppress extra movement because dangerous immobility and fever-rigidity syndrome can follow.",
        "Maintain hydration and nutrition because constant movement increases energy needs."
      ],
      nclexTraps: [
        "Dyskinesia usually represents excessive or rapidly changing dopaminergic effect, whereas off bradykinesia represents insufficient effect.",
        "Off dystonia can be painful abnormal movement at low exposure, so not every involuntary posture means peak-dose excess.",
        "Amantadine can reduce dyskinesia, but its exact clinical mechanism is unknown and renal accumulation can cause hallucinations."
      ],
      sourceNote: "Current U.S. carbidopa/levodopa and GOCOVRI labels, AAN guideline reaffirmed 2025 (" + AAN_GUIDELINE + "), and established levodopa-induced dyskinesia physiology.",
      sourceKeys: ["dailymed-carbidopa-levodopa", "dailymed-gocovri", "aan-parkinson-dopaminergic-2025", "dyskinesia-physiology"],
      nclexEssential: true,
      tags: ["frontier-wave22", "levodopa induced dyskinesia", "peak dose", "diphasic", "off dystonia", "amantadine", "strict why closure"]
    },
    {
      name: "Parkinsonism-hyperpyrexia syndrome",
      category: "Neurologic and autonomic emergency",
      aliases: ["Parkinson hyperpyrexia syndrome", "PHS", "dopaminergic withdrawal syndrome", "levodopa withdrawal fever rigidity", "neuroleptic malignant like Parkinson syndrome", "akinetic crisis"],
      pronunciation: "PAR-kin-sun-iz-um hy-per-py-REK-see-uh SIN-drohm",
      wordOrigin: "Parkinsonism describes bradykinetic-rigid motor dysfunction. Hyperpyrexia means extreme fever. Syndrome indicates a recognizable emergency pattern with multiple possible triggers rather than a single laboratory-defined disease.",
      definition: "Parkinsonism-hyperpyrexia syndrome is a rare life-threatening emergency characterized by abrupt severe worsening of parkinsonism with rigidity or akinesia, fever, altered mental status, autonomic instability, and often elevated creatine kinase after sudden reduction, interruption, malabsorption, or failure of dopaminergic therapy. It resembles neuroleptic malignant syndrome because both produce central dopamine-deficient physiology, rigidity, hyperthermia, and rhabdomyolysis. Infection, dehydration, surgery, heat, or device failure can precipitate it even when no one intentionally stopped a medication.",
      etiology: "Common triggers include abruptly stopping or sharply reducing levodopa, dopamine agonists, MAO-B inhibitors, COMT-related dopaminergic support, or amantadine; delayed hospital administration; NPO status without alternative delivery; severe dysphagia; vomiting, ileus, or gastroparesis; deep-brain-stimulator failure or battery depletion; infection, trauma, surgery, dehydration, and heat stress. Dopamine-blocking drugs can worsen the same low-dopamine state.",
      pathology: "The syndrome is a functional collapse of dopamine-dependent basal-ganglia, hypothalamic, autonomic, and motor control with secondary systemic injury. Severe rigidity and immobility generate heat and muscle breakdown; hypothalamic and autonomic dysregulation impair temperature, blood pressure, heart rate, and sweating; dysphagia and reduced consciousness promote aspiration; rhabdomyolysis releases myoglobin and electrolytes that injure kidneys and heart.",
      pathophysiology: "Chronic dopaminergic therapy supports an already dopamine-depleted and receptor-adapted motor network. Abrupt loss of effective stimulation sharply increases inhibitory basal-ganglia output and can destabilize hypothalamic and autonomic control. Rigidity and sustained contraction increase heat production, while impaired autonomic regulation limits heat dissipation. Muscle ischemia and breakdown raise CK, potassium, phosphate, and myoglobin, causing acute kidney injury and dysrhythmia. Dehydration worsens renal myoglobin toxicity. The syndrome is diagnosed clinically because no single test distinguishes it from sepsis, serotonin syndrome, malignant catatonia, heat stroke, or neuroleptic malignant syndrome.",
      riskFactors: [
        "Advanced Parkinson disease and high dependence on frequent dopaminergic support because little endogenous buffering remains.",
        "Hospitalization, surgery, NPO orders, formulary substitution, dysphagia, ileus, vomiting, or medication-reconciliation error because effective delivery can stop unintentionally.",
        "Infection, dehydration, hot environment, trauma, or agitation because physiologic stress raises demand and worsens temperature and renal injury.",
        "Deep-brain-stimulator or intestinal-delivery device failure because abrupt loss of circuit or drug support can mimic medication withdrawal."
      ],
      signsSymptoms: [
        "Rapid severe rigidity, bradykinesia or akinesia, inability to turn or swallow, and loss of previous medication response are early motor clues.",
        "High fever, diaphoresis, tachycardia, labile blood pressure, tachypnea, confusion, stupor, or coma reflect hypothalamic and autonomic involvement.",
        "Muscle pain, dark urine, oliguria, rising creatinine, hyperkalemia, or dysrhythmia suggests rhabdomyolysis and kidney injury.",
        "Aspiration, hypoxemia, pressure injury, venous thrombosis, or infection can arise quickly because profound immobility affects every organ system."
      ],
      diagnostics: [
        "Reconstruct the exact Parkinson regimen, last successful doses, formulation, swallowing and GI delivery, recent holds, procedure orders, device function, and dopamine-blocking exposure because the trigger may be hidden in routine care.",
        "Measure core temperature, serial neurologic status, ECG, oxygenation, blood pressure, urine output, and volume status because autonomic and organ injury evolves rapidly.",
        "Check CK, creatinine, potassium, phosphate, calcium, bicarbonate, liver tests, CBC, urinalysis and myoglobin context, coagulation, glucose, cultures, and infection imaging because rhabdomyolysis, kidney injury, DIC, and sepsis can coexist.",
        "Differentiate serotonin syndrome by clonus and hyperreflexia, anticholinergic toxicity by dry skin and bowel/bladder findings, and malignant catatonia or NMS by drug and psychiatric context, while recognizing overlap."
      ],
      labs: [
        "CK often rises because rigid muscle breaks down, but an early normal value does not exclude the syndrome.",
        "Creatinine, potassium, phosphate, calcium, bicarbonate, and urinalysis show rhabdomyolysis consequences because myoglobin and electrolyte release threaten kidneys and rhythm.",
        "Leukocytosis and transaminase elevation can reflect stress or muscle injury and do not by themselves prove infection or primary liver disease.",
        "Cultures and infection studies remain essential because infection can trigger the syndrome and can present simultaneously."
      ],
      treatments: [
        "Restore effective dopaminergic therapy urgently by a safe feasible route under neurologic and critical-care guidance because reversal of dopamine withdrawal addresses the core trigger.",
        "Provide cooling, airway and aspiration support, oxygenation, IV fluid and electrolyte management, renal protection, thrombosis and pressure-injury prevention, and intensive monitoring because systemic complications kill even after motor treatment resumes.",
        "Treat infection, dehydration, ileus, device failure, or medication error because recurrence continues if delivery remains interrupted.",
        "Specialists may use additional agents or organ support in severe cases, but evidence is largely observational, so management should not wait for a single confirmatory test."
      ],
      nursingPriorities: [
        "Treat the home Parkinson schedule as time critical and escalate omissions immediately because prevention is safer than reversing an akinetic crisis.",
        "If oral swallowing fails, notify the team for an alternative plan rather than crushing or withholding an unsuitable formulation because both underdelivery and formulation error are dangerous.",
        "Trend temperature, rigidity, consciousness, respiratory status, blood pressure, heart rhythm, urine output, CK, creatinine, and electrolytes because deterioration can be rapid and multisystem.",
        "Use aspiration, pressure-injury, VTE, contracture, and fall precautions because profound immobility creates secondary harm even when the patient is in bed."
      ],
      complications: [
        "Rhabdomyolysis, hyperkalemia, acute kidney injury, dysrhythmia, disseminated intravascular coagulation, aspiration pneumonia, respiratory failure, shock, venous thrombosis, and death.",
        "Prolonged immobility can cause pressure injury, contracture, deconditioning, delirium, and loss of prior independence.",
        "Recurrence can occur if medication delivery, device function, infection, dehydration, or swallowing is not corrected."
      ],
      redFlags: [
        "Fever plus new severe rigidity, akinesia, confusion, or autonomic instability in a person with Parkinson disease.",
        "Any abrupt medication interruption, NPO order, vomiting, ileus, dysphagia, pump interruption, or stimulator failure followed by motor collapse.",
        "Dark urine, oliguria, severe muscle pain, hyperkalemia, or ECG change because rhabdomyolysis is threatening kidney and cardiac function.",
        "Choking, hypoxemia, inability to handle secretions, or declining consciousness because airway protection is failing."
      ],
      patientEducation: [
        "Do not stop or sharply reduce Parkinson medication without urgent clinical guidance because fever, rigidity, confusion, and muscle breakdown can follow.",
        "Carry an exact medication schedule, formulation list, and device information for emergency or surgical care because standard medication times may be unsafe.",
        "Seek urgent help for fever with sudden immobility, severe rigidity, confusion, fainting, dark urine, or inability to swallow.",
        "Tell clinicians early about vomiting, constipation, swallowing difficulty, or device problems because a prescribed dose does not help if it is not delivered or absorbed."
      ],
      nclexTraps: [
        "Parkinsonism-hyperpyrexia syndrome can be triggered by missed or malabsorbed medication, not only an intentional discontinuation.",
        "It resembles neuroleptic malignant syndrome because both create severe central dopamine deficiency, but the trigger may be withdrawal of dopamine support rather than addition of a D2 blocker.",
        "A normal early CK does not exclude the syndrome; clinical fever, rigidity, mental-status change, autonomic instability, and exposure history drive urgent action.",
        "NPO does not mean Parkinson therapy can simply be omitted; an alternative delivery plan is a safety priority."
      ],
      sourceNote: "Current U.S. carbidopa/levodopa, dopamine-agonist, MAO-B, COMT, and amantadine withdrawal warnings on DailyMed plus peer-reviewed Parkinsonism-hyperpyrexia emergency literature.",
      sourceKeys: ["dailymed-carbidopa-levodopa", "dailymed-dopamine-agonists", "dailymed-maob", "dailymed-comt", "dailymed-amantadine", "parkinsonism-hyperpyrexia-review"],
      nclexEssential: true,
      tags: ["frontier-wave22", "Parkinsonism hyperpyrexia", "dopamine withdrawal", "rigidity", "rhabdomyolysis", "emergency", "strict why closure"]
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
      tags: unique(["frontier-wave22", ...(card.tags || []), ...(existing.tags || [])])
    });
  });
  db.drugs = Array.from(map.values());

  pathologyCards.forEach((incoming) => {
    const canonical = normalize(incoming.name || incoming.title);
    const index = pathology.diseases.findIndex((entry) =>
      [entry.name, entry.title].map(normalize).filter(Boolean).includes(canonical)
    );
    const existing = index >= 0 ? pathology.diseases[index] : {};
    const merged = {
      ...existing,
      ...incoming,
      aliases: unique([...(incoming.aliases || []), ...(existing.aliases || [])]),
      tags: unique(["frontier-wave22", ...(incoming.tags || []), ...(existing.tags || [])])
    };
    if (index >= 0) pathology.diseases[index] = merged;
    else pathology.diseases.push(merged);
  });

  db.pharmFrontierWave22ParkinsonCausalPatch = {
    version: "2026-07-17-parkinson-causal",
    promotedDrugCount: drugCards.length,
    pathwayCardCount: classCards.length,
    pathologyConceptCount: pathologyCards.length,
    totalCardCount: pharmCards.length + pathologyCards.length
  };
  db.version = [db.version, "pharm-frontier-wave22-parkinson-causal"].filter(Boolean).join("+");
  pathology.frontierWave22ParkinsonConceptCount = pathologyCards.length;
  window.ANI_PHARM_DATABASE = db;
  window.ANI_PATHOLOGY_DATABASE = pathology;
}());
