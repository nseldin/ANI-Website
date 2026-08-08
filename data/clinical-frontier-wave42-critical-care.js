/* eslint-disable */
/* Wave 42 critical-care expansion: pseudocholinesterase deficiency, massive transfusion protocol, and packed red blood cell transfusion. */
(function () {
  "use strict";

  const VERSION = "2026-07-22-wave42-critical-care-1";
  const SCHEMA_VERSION = 1;
  const GLOBAL_NAME = "ANI_CLINICAL_FRONTIER_WAVE42_CRITICAL_CARE";
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
  const titleOf = (entry) => clean(entry && (entry.name || entry.title || entry.displayName));
  const unique = (values) => Array.from(new Map((values || [])
    .map((value) => clean(value))
    .filter(Boolean)
    .map((value) => [normalize(value), value])).values());

  const sourceReferences = Object.freeze([
    Object.freeze({
      key: "w42-ncbi-pseudocholinesterase-deficiency",
      label: "NCBI Bookshelf StatPearls: Pseudocholinesterase Deficiency",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK541032/",
      note: "Supports inherited and acquired butyrylcholinesterase deficiency, prolonged succinylcholine or mivacurium paralysis, diagnosis, ventilation with sedation, avoidance, and family counseling."
    }),
    Object.freeze({
      key: "w42-ncbi-biochemistry-pseudocholinesterase",
      label: "NCBI Bookshelf: Biochemistry, Pseudocholinesterase",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK545284/",
      note: "Supports BCHE biology, the distinction from acetylcholinesterase, qualitative dibucaine-number testing, quantitative enzyme activity, genetic variants, and limits of individual assays."
    }),
    Object.freeze({
      key: "w42-dailymed-succinylcholine-2025",
      label: "DailyMed: Succinylcholine chloride injection prescribing information",
      url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ce12d907-eae4-4fba-b85e-170fac1819c6",
      note: "Current product-label anchor for succinylcholine paralysis, airway and ventilation requirements, prolonged block in reduced plasma cholinesterase activity, and medication-specific safety."
    }),
    Object.freeze({
      key: "w42-aabb-circular-2024",
      label: "AABB, ARC, ABC, and ASBP: Circular of Information for the Use of Human Blood and Blood Components, June 2024",
      url: "https://www.aabb.org/docs/default-source/default-document-library/resources/circular-of-information-watermark.pdf?sfvrsn=7f5d28ab_10",
      note: "Supports red-cell indications and component boundaries, compatibility, administration, expected adult increment, storage and timing, transfusion reactions, and emergency-release principles."
    }),
    Object.freeze({
      key: "w42-aabb-rbc-guideline-2023",
      label: "AABB International Guidelines: Red Blood Cell Transfusion (JAMA 2023)",
      url: "https://pubmed.ncbi.nlm.nih.gov/37824153/",
      note: "Supports restrictive red-cell transfusion consideration in most hemodynamically stable hospitalized adults and emphasizes clinical context and population-specific thresholds."
    }),
    Object.freeze({
      key: "w42-acs-tqip-mtp",
      label: "American College of Surgeons TQIP: Massive Transfusion in Trauma Guidelines",
      url: "https://www.facs.org/media/zcjdtrd1/transfusion_guildelines.pdf",
      note: "Supports early protocol activation, predefined component delivery, hemorrhage control, warming, monitoring, transition to goal-directed therapy, and protocol deactivation."
    }),
    Object.freeze({
      key: "w42-acs-trauma-best-practices",
      label: "American College of Surgeons: Best Practices Guidelines",
      url: "https://www.facs.org/quality-programs/trauma/quality/best-practices-guidelines/",
      note: "Current ACS landing source for institution-level trauma best-practice guidance and coordinated hemorrhage care."
    }),
    Object.freeze({
      key: "w42-jts-damage-control-resuscitation",
      label: "Joint Trauma System: Damage Control Resuscitation Clinical Practice Guideline",
      url: "https://jts.health.mil/assets/docs/cpgs/Damage_Control_Resuscitation_12_Jul_2019_ID18.pdf",
      note: "Supports damage-control physiology, early blood-based resuscitation, prevention of hypothermia, calcium monitoring and replacement, and component or whole-blood protocol context."
    }),
    Object.freeze({
      key: "w42-proppr-rct-2015",
      label: "PROPPR Randomized Clinical Trial: 1:1:1 versus 1:1:2 plasma, platelets, and red cells in severe trauma",
      url: "https://pubmed.ncbi.nlm.nih.gov/25647203/",
      note: "Primary trial supporting a balanced interpretation of component ratios: no significant overall 24-hour or 30-day mortality difference, with more hemostasis and fewer exsanguination deaths in the 1:1:1 group."
    })
  ]);
  const sourceByKey = new Map(sourceReferences.map((source) => [source.key, source]));
  const installSources = (database, keys) => {
    if (!database || typeof database !== "object") return 0;
    if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];
    const byKey = new Map(database.sourceReferences
      .map((source) => [clean(source && (source.key || source.id)), source])
      .filter(([key]) => key));
    keys.forEach((key) => {
      const source = sourceByKey.get(key);
      if (!source) throw new Error("Unknown Wave42 critical-care source key: " + key);
      byKey.set(key, { ...source });
    });
    database.sourceReferences = Array.from(byKey.values());
    return keys.length;
  };
  const sourceNoteFor = (keys) => unique(keys).map((key) => {
    const source = sourceByKey.get(key);
    if (!source) throw new Error("Unknown Wave42 critical-care source key: " + key);
    return source.label + " (" + source.url + ")";
  }).join("; ");

  const pseudoSourceKeys = [
    "w42-ncbi-pseudocholinesterase-deficiency",
    "w42-ncbi-biochemistry-pseudocholinesterase",
    "w42-dailymed-succinylcholine-2025"
  ];
  const transfusionSourceKeys = [
    "w42-aabb-circular-2024",
    "w42-aabb-rbc-guideline-2023"
  ];
  const mtpSourceKeys = [
    "w42-aabb-circular-2024",
    "w42-acs-tqip-mtp",
    "w42-acs-trauma-best-practices",
    "w42-jts-damage-control-resuscitation",
    "w42-proppr-rct-2015"
  ];

  const pseudocholinesteraseDeficiencyCard = {
    name: "Pseudocholinesterase deficiency",
    displayName: "Pseudocholinesterase deficiency",
    entryType: "pathology",
    recordType: "condition",
    owner: "pathology",
    contentOwner: "Anesthesiology, Pharmacogenetics and Perioperative Nursing",
    primaryDomain: "Anesthesiology",
    clinicalDomain: "Neuromuscular blockade and pharmacogenetics",
    primaryCategory: "Anesthesiology & Perioperative Medicine",
    primarySystem: "Neuromuscular and metabolic pharmacology",
    bodySystem: "Neuromuscular",
    category: "Anesthesiology & Perioperative Medicine",
    nclexEssential: true,
    definition: "Pseudocholinesterase deficiency is reduced activity or altered function of butyrylcholinesterase, a liver-produced enzyme circulating in plasma that rapidly hydrolyzes succinylcholine and mivacurium. The condition is usually silent until one of these neuromuscular blockers is given. The expected brief paralysis then lasts much longer because the drug is cleared slowly, leaving the patient awake or potentially aware unless sedation is continued but unable to breathe or move until neuromuscular function returns. The inherited form is caused by BCHE variants; acquired low activity can accompany pregnancy, liver dysfunction, malnutrition, severe illness, burns, malignancy, kidney disease, or selected medicines. Pseudocholinesterase and acetylcholinesterase are not interchangeable names. Acetylcholinesterase terminates acetylcholine signaling at neuromuscular and autonomic synapses and is also present on red cells, while butyrylcholinesterase is principally a plasma scavenger enzyme. This distinction is essential because isolated inherited butyrylcholinesterase deficiency is not organophosphate poisoning and does not produce a cholinergic toxidrome by itself.",
    pathology: "Succinylcholine produces depolarizing neuromuscular block by activating nicotinic acetylcholine receptors and keeping the motor end plate depolarized. Under usual conditions, plasma butyrylcholinesterase hydrolyzes most circulating succinylcholine before it reaches the neuromuscular junction, so only a small fraction reaches its receptor and the block ends rapidly as drug diffuses away. When enzyme quantity is low or its molecular structure binds substrate poorly, active drug remains in plasma longer and continues reaching the junction. The diaphragm and other skeletal muscles cannot generate effective action potentials, although consciousness, pain perception, hearing, and memory are not anesthetized by paralysis. Mivacurium clearance is impaired through the same enzyme pathway. The enzyme also metabolizes ester local anesthetics such as procaine, so their effects or toxicity may be prolonged, but the degree is product and patient specific. Amide local anesthetics are not cleared by butyrylcholinesterase. Acquired deficiency lowers enzyme activity without necessarily changing dibucaine inhibition, while inherited qualitative variants change how the enzyme responds to substrate and inhibitors. This explains why activity level and dibucaine number answer different questions and why either test alone can miss part of the problem.",
    pathophysiology: [
      "BCHE on chromosome 3 encodes butyrylcholinesterase, historically called pseudocholinesterase, plasma cholinesterase, or serum cholinesterase. The enzyme is synthesized mainly in the liver and circulates in plasma; it is distinct from synaptic acetylcholinesterase.",
      "Normal plasma hydrolysis creates a steep barrier between injected succinylcholine and the neuromuscular junction. Reduced or atypical enzyme activity allows more intact drug to persist, so receptor depolarization and paralysis continue beyond the expected few minutes.",
      "Heterozygous inherited variants may produce a modestly prolonged block, whereas people with two function-reducing alleles can remain paralyzed for hours. Exact duration varies with variant, dose, coexisting acquired reduction, temperature, organ function, and other neuromuscular-blocking influences.",
      "The dibucaine number is a functional phenotype: dibucaine inhibits typical enzyme strongly but inhibits some atypical variants less. A lower percentage therefore suggests a qualitative atypical enzyme; it is not the drug concentration and it does not measure duration directly.",
      "A quantitative plasma cholinesterase assay measures activity or amount. Liver disease, pregnancy, malnutrition, inflammation, burns, malignancy, kidney disease, and some medicines can lower the quantitative result while leaving the dibucaine number relatively normal because the remaining molecules are structurally typical.",
      "A normal dibucaine number therefore does not exclude acquired or quantitative deficiency, and low enzyme activity alone does not prove a heritable BCHE variant. Testing after full recovery and away from confounding exposure improves interpretation.",
      "Neuromuscular paralysis does not provide hypnosis, amnesia, analgesia, or anxiolysis. Stopping anesthesia because surgery is over while the patient remains pharmacologically paralyzed creates a preventable awareness and psychological-trauma risk.",
      "Organophosphates can inhibit both acetylcholinesterase and butyrylcholinesterase. Their clinically important synaptic acetylcholine accumulation causes miosis, salivation, bronchorrhea, wheeze, vomiting, diarrhea, bradycardia, fasciculations, weakness, and seizures. Isolated inherited BCHE deficiency does not create that secretory syndrome.",
      "Sugammadex encapsulates rocuronium and vecuronium; it does not bind or reverse succinylcholine. Neostigmine is not a reliable rescue for a prolonged succinylcholine phase I block and can intensify or prolong it. Supportive ventilation and time remain the dependable treatment.",
      "Recovery should be demonstrated objectively rather than inferred from time or a small movement. Residual weakness can impair upper-airway tone, ventilation, coughing, swallowing, and protection from aspiration even after the patient appears more responsive."
    ],
    etiology: "Inherited pseudocholinesterase deficiency results from BCHE variants, commonly with autosomal-recessive expression of marked deficiency. A person can be a heterozygous carrier with intermediate function or have two clinically important alleles. Acquired reduction occurs when liver synthesis falls, enzyme is consumed or diluted, physiologic state changes, or an inhibitor is present. Reported contexts include pregnancy and the early postpartum period, severe liver disease, malnutrition, malignancy, major burns, severe infection or critical illness, kidney disease, cardiopulmonary bypass, and exposure to medicines or chemicals that inhibit cholinesterase activity. More than one mechanism can coexist: an individual with an inherited variant may have a much longer block during pregnancy or severe illness. A prior unexplained delayed extubation after succinylcholine or mivacurium, a family member who remained paralyzed after anesthesia, or an abnormal dibucaine study is a strong clue. The diagnosis should not be inferred from ordinary postoperative sleepiness, opioid-induced hypoventilation, residual nondepolarizing block, neurologic injury, or organophosphate exposure without separating those mechanisms.",
    riskFactors: [
      "Personal history of prolonged apnea, paralysis, delayed extubation, or unexpected intensive-care ventilation after succinylcholine or mivacurium",
      "A first-degree relative with a documented BCHE variant, low dibucaine number, or unexplained prolonged postoperative paralysis",
      "Known heterozygous or biallelic BCHE variant or a previous abnormal qualitative and quantitative enzyme evaluation",
      "Pregnancy or early postpartum physiology, especially when combined with another cause of low enzyme activity",
      "Severe liver dysfunction, malnutrition, malignancy, extensive burns, critical illness, severe infection, kidney disease, or cardiopulmonary bypass",
      "Exposure to cholinesterase-inhibiting medicines or chemicals, including organophosphates, with interpretation based on the entire clinical syndrome",
      "Use of succinylcholine, mivacurium, or an ester local anesthetic without an accurate anesthesia and family history",
      "Prior chart labels such as prolonged emergence or difficult extubation that were never explained or communicated to the patient"
    ],
    signsSymptoms: [
      "The characteristic presentation is persistent flaccid skeletal-muscle weakness or apnea after the expected duration of succinylcholine or mivacurium has passed. The patient may make little or no respiratory effort despite completion of surgery.",
      "Peripheral nerve stimulation may show persistent deep neuromuscular block or an inadequate train-of-four ratio. The pattern depends on dose, timing, phase of succinylcholine block, monitoring site, and other drugs.",
      "Consciousness can return before muscle strength. A patient may hear, understand, feel fear, or experience pain while unable to open the eyes, speak, move, or breathe; tachycardia, hypertension, tearing, or later recall may be the only clues when sedation is inadequate.",
      "Oxygen saturation may initially remain normal because the airway is controlled and the ventilator is functioning. A normal saturation does not mean neuromuscular recovery and should never prompt removal of ventilatory support by itself.",
      "Residual weakness can appear as weak head lift, poor hand grip, shallow breathing, weak cough, inability to sustain tongue protrusion, diplopia, upper-airway obstruction, or difficulty swallowing after partial recovery.",
      "The inherited condition produces no chronic cholinergic secretions, miosis, diarrhea, or bradycardia between anesthetic exposures. Those findings suggest an alternate or additional toxicologic process.",
      "Acquired low activity may be accompanied by findings of its cause, such as jaundice or coagulopathy with liver failure, low body mass with malnutrition, pregnancy, severe systemic illness, or recent burn injury.",
      "A history of unusually prolonged numbness or toxicity after an ester local anesthetic can be supportive but is not diagnostic because dose, site, vascular uptake, and accidental intravascular injection also alter duration and toxicity."
    ],
    diagnostics: [
      "First exclude immediately reversible causes of delayed ventilation or emergence: inadequate airway, circuit or ventilator failure, residual opioid or sedative effect, hypothermia, hypoglycemia, electrolyte or acid-base disturbance, residual nondepolarizing block, stroke, seizure, or a new neuromuscular disorder. Treat threats while the diagnosis is clarified.",
      "Use quantitative neuromuscular monitoring at an appropriate nerve and muscle. Train-of-four count describes depth during profound block; a calibrated train-of-four ratio helps demonstrate recovery. Clinical signs alone can miss residual weakness.",
      "Obtain a quantitative plasma or serum butyrylcholinesterase activity assay after stabilization. A low value supports reduced enzyme activity but can reflect genetics, pregnancy, liver synthesis, illness, medications, dilution, or recent exposure.",
      "Order a qualitative inhibition test such as the dibucaine number when inherited atypical enzyme is suspected. Lower inhibition supports some qualitative variants; local laboratory ranges and nomenclature govern interpretation.",
      "Interpret quantitative activity and dibucaine number together. Low activity with a relatively normal dibucaine number favors reduced quantity or acquired deficiency; a low dibucaine number suggests an atypical enzyme. Neither pattern should be interpreted without timing and clinical context.",
      "BCHE genetic testing can identify pathogenic variants and support family counseling, especially after a severe event or discordant biochemical tests. A variant of uncertain significance does not by itself prove the phenotype.",
      "Review the anesthetic record for exact succinylcholine or mivacurium dose and time, other neuromuscular blockers, reversal agents, volatile anesthetics, aminoglycosides, magnesium, temperature, renal and hepatic function, and the objective monitoring trend.",
      "If organophosphate or carbamate exposure is plausible, assess the toxidrome, scene history, decontamination risk, red-cell acetylcholinesterase or plasma cholinesterase testing available locally, and poison-center guidance. Do not call an isolated low plasma cholinesterase value proof of poisoning.",
      "Document the final suspected or confirmed mechanism in a durable allergy or anesthesia-alert location, not only in an operative note. Include the drugs to avoid and the safe alternative plan rather than recording a vague anesthesia allergy.",
      "Offer appropriately timed testing to biologic relatives after confirmed inherited deficiency because an apparently healthy relative may be at risk only when exposed to the same drugs."
    ],
    assessment: "The immediate assessment is an airway and ventilation emergency, not a laboratory exercise. Confirm the endotracheal tube and circuit, provide oxygen and controlled ventilation, check capnography, temperature, hemodynamics, glucose and relevant electrolytes, and obtain objective neuromuscular data. At the same time, confirm whether hypnosis, amnesia, and analgesia are still adequate. Reconstruct the medication timeline and distinguish persistent paralysis from sedation, opioid toxicity, residual nondepolarizing blockade, central neurologic injury, metabolic disturbance, and organophosphate poisoning. After recovery, ask about previous anesthesia, relatives with delayed awakening, liver and nutritional disease, pregnancy, burns, kidney disease, malignancy, severe illness, medicines, pesticide exposure, and reactions to ester local anesthetics. The assessment is complete only when the patient has objective strength, safe spontaneous ventilation, airway protection, a communicated explanation, and a future avoidance plan.",
    differential: "Residual rocuronium, vecuronium, cisatracurium, or another nondepolarizing neuromuscular blocker is common and requires agent-specific interpretation and reversal. Excess opioid or sedative typically depresses consciousness and respiratory drive rather than causing isolated awake paralysis. Hypothermia, hypokalemia, hypermagnesemia, severe acid-base disturbance, hypothyroidism, critical illness, myasthenia gravis, Lambert-Eaton syndrome, botulism, Guillain-Barre syndrome, spinal or brainstem injury, and ventilator or airway failure can delay breathing. A high spinal or epidural block can suppress respiratory muscle function. Organophosphate or carbamate poisoning combines weakness with muscarinic, nicotinic, and central cholinergic findings and needs toxicologic treatment and contamination precautions. Malignant hyperthermia causes hypermetabolism, rigidity, rising carbon dioxide, acidosis, and hyperthermia rather than isolated flaccid prolonged block. Awareness under paralysis is a complication to detect and support, not a separate explanation for the motor deficit.",
    treatments: [
      "Maintain a patent airway and controlled mechanical ventilation with continuous oxygenation and capnography until spontaneous ventilation and objective neuromuscular function are adequate. Time, not forced extubation, clears succinylcholine or mivacurium when butyrylcholinesterase is deficient.",
      "Continue adequate sedation, amnesia, and analgesia while paralysis persists. Use hemodynamics, anesthesia depth context, and repeated assessment; immobility cannot be used as evidence of comfort or unconsciousness.",
      "Use quantitative neuromuscular monitoring serially and avoid extubation until objective recovery, sustained ventilation, airway reflexes, temperature, cognition, and clinical strength meet the current anesthesia standard.",
      "Provide calm explanation and reassurance as soon as the patient can communicate. Ask specifically about recall, pain, fear, and helplessness; document suspected awareness and arrange anesthesia follow-up and psychological support when needed.",
      "Fresh frozen plasma contains butyrylcholinesterase and has historically been used, but transfusion risk usually outweighs benefit because supportive ventilation is effective and recovery is spontaneous. It is not routine treatment for this condition.",
      "Do not assume anticholinesterase medication will shorten a succinylcholine block. Depending on block phase it may prolong paralysis, and treatment decisions belong to an anesthesiologist using objective monitoring.",
      "Sugammadex may be appropriate only when a concurrent rocuronium or vecuronium block is present; it does not reverse succinylcholine or correct BCHE deficiency.",
      "After the event, avoid succinylcholine and mivacurium. Anesthesia can usually proceed with carefully selected alternatives, appropriate dosing, objective monitoring, and agent-specific reversal rather than avoiding all anesthesia.",
      "Treat acquired causes when possible, such as malnutrition or liver disease, but do not assume the enzyme level will normalize immediately. Future anesthetic planning should use the documented history even if later activity improves."
    ],
    contraindications: [
      "Do not extubate because an expected drug duration has elapsed, oxygen saturation is normal, or the patient makes one small movement. Demonstrate adequate ventilation, airway protection, and objective neuromuscular recovery.",
      "Do not discontinue sedation while pharmacologic paralysis persists. Paralysis is not anesthesia and an immobile patient may be fully conscious.",
      "Do not re-administer succinylcholine or mivacurium to test the diagnosis or overcome a prolonged block. Additional substrate can extend the emergency.",
      "Do not label the condition as acetylcholinesterase deficiency, myasthenia gravis, or organophosphate poisoning solely from a low plasma cholinesterase result.",
      "Do not use atropine and pralidoxime for isolated inherited BCHE deficiency. Those therapies address a compatible cholinergic poisoning syndrome, not uncomplicated pharmacogenetic prolonged paralysis.",
      "Do not present plasma transfusion, neostigmine, or sugammadex as routine reversal of succinylcholine in this condition.",
      "Do not assume every local anesthetic is unsafe. Ester agents may depend on plasma cholinesterase; amide agents use different metabolism but still require ordinary local-anesthetic toxicity precautions.",
      "Do not leave the diagnosis in a narrative note only. Failure to place a durable alert creates preventable re-exposure risk."
    ],
    nursingPriorities: [
      "Recognize persistent apnea or weakness after succinylcholine or mivacurium as a ventilation emergency. Call anesthesia support, verify airway and circuit, provide ordered ventilation, monitor capnography and oxygenation, and remain with the patient.",
      "Confirm that sedation, amnesia, and analgesia continue while neuromuscular block is present. Escalate tearing, tachycardia, hypertension, purposeful autonomic response, or any concern for awareness; do not wait for movement.",
      "Trend quantitative train-of-four findings at the ordered site and time, temperature, respiratory effort, tidal volume, cough, swallowing, mental status, and hemodynamics. Record the device, site, ratio or count, and interventions rather than writing only weak.",
      "Review the medication administration record and anesthetic timeline for exact agents and times. Communicate magnesium, antibiotics, other blockers, reversal agents, hepatic or kidney dysfunction, pregnancy, and hypothermia that may compound weakness.",
      "Prevent pressure injury, corneal injury, venous stasis, aspiration, and accidental awareness during prolonged immobility. Reposition and protect the patient without interrupting airway security or monitoring.",
      "Before extubation, verify the anesthesia team's objective recovery criteria, adequate spontaneous ventilation, intact airway protection, normothermia, alertness, and a rescue plan. Continue surveillance for residual weakness after extubation.",
      "When the patient can communicate, explain that the event reflected delayed drug metabolism rather than failure to wake up. Ask about recall and emotional distress, use trauma-informed listening, and arrange follow-up.",
      "Ensure the discharge record names pseudocholinesterase or butyrylcholinesterase deficiency, lists succinylcholine and mivacurium to avoid, identifies whether the diagnosis is suspected or confirmed, and explains future anesthesia consultation.",
      "Teach the patient to tell every anesthesia, surgery, dental, emergency, and pharmacy team before receiving a paralytic or ester anesthetic and to consider medical-alert identification.",
      "Facilitate genetics or biochemical testing and family notification without implying that an unaffected-looking relative is safe. Document referrals and the plan for result communication."
    ],
    redFlags: [
      "No effective spontaneous breathing after the expected duration of succinylcholine or mivacurium",
      "Loss of airway, absent capnography, ventilator or circuit failure, falling oxygen saturation, rising carbon dioxide, or hemodynamic instability",
      "Possible awareness while paralyzed, including recall, tearing, unexplained sympathetic activation, or later report of pain or helplessness",
      "Premature extubation signs such as weak cough, shallow breathing, upper-airway obstruction, inability to sustain head lift, or inadequate quantitative train-of-four recovery",
      "Miosis, bronchorrhea, salivation, vomiting, diarrhea, bradycardia, fasciculations, seizures, or contaminated clothing suggesting organophosphate or carbamate poisoning rather than isolated inherited deficiency",
      "Hyperthermia, rapidly rising end-tidal carbon dioxide, rigidity, acidosis, or rhabdomyolysis suggesting malignant hyperthermia or another anesthesia emergency",
      "Re-exposure risk because the diagnosis, specific drug names, or future anesthesia plan is absent from handoff and discharge documentation"
    ],
    complications: [
      "Prolonged apnea, unplanned postoperative mechanical ventilation, intensive-care admission, and delayed recovery",
      "Hypoxemic or hypercapnic injury if airway and ventilation support are delayed or interrupted",
      "Awareness under paralysis, panic, post-traumatic stress symptoms, distrust, and persistent psychological distress",
      "Aspiration, atelectasis, pneumonia, pressure injury, corneal injury, venous thromboembolism, and deconditioning during prolonged immobility",
      "Residual neuromuscular weakness with upper-airway obstruction, weak cough, dysphagia, aspiration, or reintubation after premature extubation",
      "Unnecessary antidotes, transfusion, or invasive testing when BCHE deficiency is confused with other mechanisms",
      "Repeat exposure in the patient or an untested relative when the event is poorly documented",
      "Prolonged action or toxicity from ester local anesthetics, especially when dose, vascular uptake, or accidental intravascular injection adds risk"
    ],
    prognosis: "With prompt recognition, secure ventilation, continued sedation, and objective monitoring, recovery is usually complete as the drug redistributes and is eventually hydrolyzed. The enzyme abnormality does not by itself cause progressive neuromuscular disease or chronic weakness. Outcome becomes poor when ventilation is interrupted, awareness is not prevented, extubation is premature, or the event is never communicated and re-exposure occurs. Inherited deficiency persists for life; acquired activity may improve when pregnancy or illness resolves, but a history of clinically prolonged block remains relevant. A clear anesthesia alert and family evaluation turn an unexpected emergency into a preventable future event.",
    prevention: "Ask before anesthesia about previous delayed extubation, unexplained ventilation after surgery, family anesthesia problems, liver or nutritional disease, pregnancy, and known enzyme testing. When risk is known or strongly suspected, avoid succinylcholine and mivacurium, select an alternative neuromuscular strategy, use quantitative monitoring, and plan postoperative observation. Patients should carry specific documentation and tell every procedural team. Confirmed inherited disease supports family counseling and testing. Prevention does not mean avoiding necessary surgery; it means choosing drugs whose metabolism and reversal do not depend on deficient butyrylcholinesterase and maintaining a reliable airway plan.",
    patientEducation: [
      "This enzyme condition usually causes no daily symptoms. It matters when certain anesthesia medicines, especially succinylcholine and mivacurium, are given.",
      "During the event your muscles could not move or breathe normally for longer than expected. The ventilator and sedation are continued until the medicine wears off; this is different from a coma.",
      "Tell every anesthesiologist, surgeon, emergency clinician, dentist, and pharmacist that you have or may have butyrylcholinesterase deficiency. Name the drugs rather than saying only anesthesia allergy.",
      "Ask for a copy of the anesthesia record, test results, and written future plan. Consider a medical-alert bracelet or phone medical ID.",
      "Biologic relatives may carry the same variant even if they have never had surgery. Discuss enzyme or genetic testing before an elective procedure.",
      "If you remember pain, voices, fear, or inability to move, tell the anesthesia team. Awareness is medically important and support is available.",
      "The condition is not the same as pesticide poisoning. New heavy secretions, breathing difficulty, pinpoint pupils, vomiting, diarrhea, twitching, or seizures after a possible exposure needs emergency poison care."
    ],
    nclexTraps: [
      "Pseudocholinesterase deficiency involves plasma butyrylcholinesterase; it is not a deficiency of synaptic acetylcholinesterase.",
      "The problem is prolonged paralysis after succinylcholine or mivacurium, not prolonged unconsciousness. Sedation must be deliberately maintained.",
      "A normal oxygen saturation on a ventilator does not demonstrate recovery or readiness for extubation.",
      "Dibucaine number evaluates qualitative inhibition behavior; quantitative enzyme activity evaluates amount or function. Either alone can be incomplete.",
      "Sugammadex reverses rocuronium or vecuronium, not succinylcholine. Neostigmine is not routine rescue for prolonged succinylcholine block.",
      "Organophosphate poisoning produces a cholinergic toxidrome and requires a different emergency pathway; isolated inherited BCHE deficiency does not.",
      "Fresh frozen plasma is not routine treatment when safe ventilation and sedation can support spontaneous recovery."
    ],
    relatedTopics: [
      "Succinylcholine", "Dibucaine number", "Organophosphate poisoning", "Cholinergic toxidrome",
      "Malignant hyperthermia", "Sugammadex", "Neostigmine", "Procaine"
    ],
    aliases: [
      "butyrylcholinesterase deficiency", "BChE deficiency", "BCHE deficiency", "pseudo cholinesterase deficiency",
      "plasma cholinesterase deficiency", "serum cholinesterase deficiency", "plasma pseudocholinesterase deficiency",
      "atypical pseudocholinesterase", "atypical butyrylcholinesterase", "succinylcholine apnea",
      "succinylcholine sensitivity", "prolonged succinylcholine paralysis", "prolonged paralysis after anesthesia",
      "inherited pseudocholinesterase deficiency", "acquired pseudocholinesterase deficiency",
      "why did succinylcholine last so long", "cannot breathe after succinylcholine"
    ],
    abbreviations: ["BChE deficiency", "BCHE deficiency"],
    commonMisspellings: [
      "pseudocholinesterase deficency", "pseudo cholinesterase defiency", "pseudocolinesterase deficiency",
      "butyryl cholinesterase deficiency", "butyrylcholinesterace deficiency", "succinylcholine apnoea"
    ],
    searchTerms: [
      "pseudocholinesterase deficiency", "butyrylcholinesterase deficiency", "BCHE gene", "dibucaine number",
      "prolonged apnea after succinylcholine", "prolonged mivacurium block", "delayed extubation after anesthesia",
      "awake but paralyzed after surgery", "ester local anesthetic metabolism", "plasma cholinesterase test"
    ],
    tags: [
      "frontier-wave42", "anesthesiology", "pharmacogenetics", "BCHE", "butyrylcholinesterase",
      "succinylcholine", "mivacurium", "prolonged paralysis", "mechanical ventilation", "awareness prevention",
      "perioperative nursing", "mechanism first"
    ],
    sourceKeys: pseudoSourceKeys,
    sourceNote: "Mechanism-first educational synthesis grounded in NCBI clinical and biochemical reviews and current succinylcholine product labeling. Exact enzyme assays, neuromuscular-monitoring criteria, anesthetic alternatives, and treatment decisions require the anesthesia team and current local protocol.",
    evidenceLimitations: [
      "Duration of paralysis cannot be predicted from genotype, enzyme activity, or dibucaine number alone because dose, temperature, illness, pregnancy, other drugs, and monitoring context modify recovery.",
      "Many BCHE variants exist, laboratory methods and reference intervals differ, and a variant of uncertain significance does not prove clinical deficiency.",
      "Acquired low plasma activity is nonspecific. It does not establish organophosphate poisoning, inherited disease, or the cause of delayed emergence without clinical correlation.",
      "This card does not provide an anesthetic drug order. Alternative blockade, reversal, and extubation decisions are patient- and procedure-specific."
    ],
    clinicalFrontierWave42CriticalCareRevision: VERSION
  };

  const article = (spec) => {
    const sourceKeys = unique(spec.sourceKeys || []);
    return {
      icon: spec.icon || "Critical care",
      nclexEssential: true,
      educationalArticle: true,
      ...spec,
      aliases: unique(spec.aliases || []),
      abbreviations: unique(spec.abbreviations || []),
      commonMisspellings: unique(spec.commonMisspellings || []),
      relatedTopics: unique(spec.relatedTopics || []),
      tags: unique(["frontier-wave42", "offline clinical reference", "mechanism first", ...(spec.tags || [])]),
      sourceKeys,
      sourceNote: sourceNoteFor(sourceKeys),
      evidenceNote: "Evidence anchors: " + sourceNoteFor(sourceKeys),
      clinicalFrontierWave42CriticalCareRevision: VERSION
    };
  };

  const massiveTransfusionProtocolCard = article({
    name: "Massive transfusion protocol",
    fullForm: "Massive transfusion protocol for life-threatening hemorrhage",
    displayName: "Massive transfusion protocol",
    type: "procedure",
    recordType: "procedure",
    diagnosticKind: "procedure",
    icon: "MTP",
    category: "Emergency, Trauma & Critical Care Procedures",
    aliases: [
      "massive transfusion", "mass transfusion protocol", "massive blood transfusion", "massive hemorrhage protocol",
      "major hemorrhage protocol", "major haemorrhage protocol", "MTP activation", "activate MTP", "blood bank MTP",
      "trauma transfusion protocol", "hemorrhage resuscitation protocol", "balanced blood product resuscitation",
      "damage control resuscitation", "1 to 1 to 1 transfusion", "massive obstetric hemorrhage protocol",
      "what is an MTP", "when to activate massive transfusion"
    ],
    abbreviations: ["MTP", "MHP", "DCR"],
    commonMisspellings: ["massive tranfusion protocol", "massive transfuion protocol", "mass transfusion protocal", "massive haemorrage protocol"],
    summary: "A massive transfusion protocol is an institution-specific emergency system that rapidly mobilizes blood components or approved whole blood, laboratory support, warming, communication, and hemorrhage-control resources for a patient with life-threatening ongoing bleeding. It is not simply an order for many red-cell units and it is not routine transfusion for stable anemia. The protocol exists because uncontrolled hemorrhage can outrun ordinary ordering and crossmatch workflows while shock, dilution, hypothermia, acidosis, platelet consumption, falling fibrinogen, and citrate-related hypocalcemia progressively impair clot formation. Early predefined packs provide a temporary balanced resuscitation bridge while surgery, interventional radiology, obstetric source control, endoscopy, or another definitive intervention stops bleeding. Activation should be driven by the clinical trajectory and local criteria rather than waiting until a retrospective threshold such as ten units in 24 hours has already been reached. Red cells restore oxygen-carrying capacity; plasma supplies multiple coagulation factors; platelets support primary hemostasis; cryoprecipitate or fibrinogen concentrate addresses fibrinogen according to local policy. These products are related but not interchangeable. Once reliable laboratory or viscoelastic data become available, treatment should shift from fixed empiric delivery toward goal-directed correction, and the protocol must be deliberately deactivated when hemorrhage is controlled to prevent waste, overload, and unnecessary exposure.",
    quickAnswer: "Activate the local MTP early when active hemorrhage is causing shock or is likely to require rapid continuing blood replacement; do not wait for a final hemoglobin, a completed crossmatch, or ten units already given. Call the blood bank with patient identifiers, location, indication, responsible clinician, and an initial product plan. In parallel, secure hemorrhage control, large-bore or rapid-access delivery, blood warmers, frequent ABC reassessment, and appropriate emergency-release compatibility. Use the institution's approved balanced pack or low-titer group O whole-blood pathway rather than inventing a bedside ratio. Monitor temperature, ionized calcium, CBC, PT/INR, aPTT, fibrinogen, blood gas, lactate or base deficit, potassium, acid-base state, and TEG or ROTEM when available. Treat the patient and the trend: replace calcium by local protocol, warm the patient and products, avoid excessive crystalloid, and address fibrinogen and platelets specifically. Tranexamic acid is indication- and time-dependent, not automatic for every MTP. Ratio evidence does not prove that one fixed recipe is superior in every trauma, obstetric, pediatric, gastrointestinal, vascular, or operative hemorrhage. Notify the blood bank promptly when the protocol changes or stops, return unused products correctly, and transition to ordinary patient-specific transfusion only after bleeding and physiology are controlled.",
    sections: [
      { label: "What the protocol is - and is not", text: "MTP is a coordinated emergency workflow, not a diagnosis, a single medication, or a synonym for packed red-cell transfusion. It links bedside teams, the blood bank, laboratory, operating room or procedure service, transport, warming equipment, communication, and predefined product release. It is intended for life-threatening active or anticipated bleeding in which ordinary sequential orders would be too slow. A patient receiving one or two red-cell units for stable symptomatic anemia does not need MTP. Conversely, a patient can need activation before any unit is given if physiology and bleeding pattern predict rapid deterioration. Historic definitions based on ten red-cell units in 24 hours are useful for research but suffer survivor and delay bias: a patient can die before reaching the count, and waiting for the definition defeats the protocol's purpose." },
      { label: "Why hemorrhage becomes a self-amplifying emergency", text: "Blood loss removes circulating volume, red cells, platelets, coagulation factors, and fibrinogen. Tissue hypoperfusion produces anaerobic metabolism and acidosis; exposure and cold fluids lower temperature; crystalloid and red-cell-only replacement dilute platelets and factors; injured endothelium and inflammation alter coagulation and fibrinolysis. Hypothermia slows enzymatic clotting and platelet function, acidosis impairs thrombin generation, and hypocalcemia reduces cardiac contraction and several coagulation steps. Ongoing bleeding then becomes harder to stop, producing more shock and dilution. Damage-control resuscitation interrupts this cycle by controlling the source, minimizing avoidable crystalloid, replacing blood components promptly, maintaining temperature and calcium, and tolerating only those blood-pressure targets appropriate to the injury. Traumatic brain injury, pregnancy, children, and other populations may need different perfusion goals." },
      { label: "Activation: decide from trajectory, not hindsight", text: "Local criteria may combine mechanism, visible bleeding, hemodynamics, response to initial resuscitation, focused imaging, pelvic or long-bone injury, obstetric blood loss, operative findings, and validated prediction tools. No score replaces judgment. Concerning patterns include persistent hypotension or shock index elevation, ongoing external or cavity bleeding, repeated need for blood boluses, active bleeding with poor perfusion, major vascular injury, ruptured ectopic or aortic catastrophe, severe postpartum hemorrhage, or anticipated complex surgery with rapid loss. Hemoglobin may initially remain near baseline because whole blood is lost proportionally and equilibration has not occurred. A normal early hemoglobin therefore cannot exclude exsanguination. Activation is a team decision that should be easy to initiate and easy to stop when reassessment shows it is no longer needed." },
      { label: "Immediate parallel actions", text: "Call the local hemorrhage or trauma response and blood bank; provide two identifiers whenever available, location, urgency, suspected cause, and a callback contact. Establish reliable large-bore peripheral, introducer, or other rapid access without delaying source control. Apply direct pressure, tourniquet, pelvic binder, uterotonics, endoscopic measure, operative packing, interventional radiology, or other cause-specific control as indicated. Draw type and screen or crossmatch plus baseline CBC, coagulation studies, fibrinogen, blood gas, lactate, electrolytes and ionized calcium, but do not delay emergency blood for results. Start active warming, use approved rapid infusion and blood-warming equipment, quantify blood loss and products, and assign one person to track units, laboratories, temperature, calcium, and communication." },
      { label: "What each component contributes", text: "Red blood cells deliver hemoglobin and improve oxygen-carrying capacity but provide little functional plasma coagulation factor, fibrinogen, or platelet support. Plasma supplies multiple soluble clotting factors and volume but is not a concentrated platelet or red-cell product. Platelets provide the cellular surface and primary plug needed for hemostasis. Cryoprecipitate contains concentrated fibrinogen plus factor VIII, von Willebrand factor, factor XIII, and fibronectin; fibrinogen concentrate is used in some protocols and jurisdictions. Whole blood contains red cells, plasma, and platelets in one product but has its own collection, titer, storage, compatibility, and inventory rules. The blood bank and local protocol determine which products are available and how emergency ABO/Rh selection transitions after the patient's type is known." },
      { label: "Balanced empiric delivery and what ratio evidence means", text: "Early in uncontrolled bleeding, laboratory results lag behind physiology, so many protocols issue balanced packs designed to approximate whole-blood replacement. The PROPPR trial compared 1:1:1 with 1:1:2 plasma:platelets:red cells in severe trauma. It did not find a statistically significant difference in overall 24-hour or 30-day mortality, although 1:1:1 achieved hemostasis more often and reduced death from exsanguination. This supports prompt balanced availability but does not prove that every patient, specialty, or phase should receive a fixed 1:1:1 recipe. Product timing, local inventory, prehospital blood, low-titer group O whole blood, fibrinogen, patient size, anticoagulants, and the bleeding mechanism matter. Ratios are a bridge during data-poor active hemorrhage; they are not the end point of individualized resuscitation." },
      { label: "Laboratory and viscoelastic transition", text: "Repeat CBC, PT/INR, aPTT, fibrinogen, blood gas, lactate or base deficit, potassium, ionized calcium and temperature at intervals defined by severity and protocol. Conventional tests sample isolated plasma pathways and can return slowly; TEG or ROTEM, where validated and available, can show clot initiation, strength, fibrinogen contribution, and fibrinolysis in near real time. Neither method replaces the clinical picture. Use results to identify a specific deficit and transition from empiric packs to goal-directed plasma, platelets, fibrinogen, red cells, antifibrinolytic therapy, or cessation. Falling lactate, improving perfusion and hemostasis matter alongside numbers. Sampling after a product bolus, hypothermia, heparin effect, pregnancy physiology, liver disease, and assay methods can change interpretation." },
      { label: "Calcium, temperature, potassium and acid-base physiology", text: "Citrate in transfused products binds ionized calcium. Rapid high-volume delivery can outpace hepatic citrate metabolism, particularly during shock, hypothermia or liver dysfunction, causing hypotension, reduced cardiac contractility, prolonged QT, dysrhythmia and impaired coagulation. Monitor ionized rather than total calcium and replace by the local protocol; do not give calcium through the same line as citrated blood unless equipment and policy specifically allow it. Warm the patient, room and blood because hypothermia worsens coagulopathy and dysrhythmia. Stored red cells can contribute potassium, while citrate metabolism can later cause alkalosis; shock causes acidosis. Serial results and ECG context, not a single assumed direction, guide treatment." },
      { label: "Source control is the definitive treatment", text: "Transfusion can temporarily restore circulation and substrates for clotting, but it cannot close a torn artery, remove retained placenta, repair uterine rupture, tamponade variceal bleeding, or decompress a bleeding cavity. Every product conversation should run beside a source-control conversation. Trauma may require damage-control surgery, pelvic stabilization or angioembolization; obstetric hemorrhage may require uterotonics, uterine tamponade, operative repair or hysterectomy; gastrointestinal bleeding may require endoscopy or interventional radiology; vascular rupture may require immediate operative or endovascular repair. Persistent product need despite resuscitation is a signal to accelerate control and reassess diagnosis, not simply to repeat packs indefinitely." },
      { label: "Antifibrinolytics and reversal are indication specific", text: "Tranexamic acid can reduce bleeding in selected time-sensitive indications, but benefit, timing, dose and contraindications differ among trauma, postpartum hemorrhage, surgery and other causes. It is not an automatic ingredient of every MTP, and delayed or indiscriminate use may not help. Identify warfarin, direct oral anticoagulants, heparin, antiplatelet agents, liver disease and inherited bleeding disorders early. Reversal products and doses are agent-specific and may include vitamin K, prothrombin complex concentrate, specific antidotes or other therapies. Plasma is not the universal best reversal product. Coordinate with hematology, pharmacy, blood bank and current local protocols without delaying immediate hemorrhage control." },
      { label: "Special populations", text: "Obstetric hemorrhage can lose fibrinogen early and requires simultaneous cause-based care for tone, trauma, tissue and thrombin; pregnancy-compatible reference ranges and rapid obstetric escalation matter. Children need weight-based components, equipment and calcium dosing, careful thermal protection, and pediatric targets. Traumatic brain injury may require higher perfusion pressure than permissive hypotension strategies used before hemorrhage control in selected patients without brain injury. Older adults and patients with heart or kidney disease may tolerate volume shifts poorly. Sickle cell disease, prior antibodies, stem-cell transplantation, immunodeficiency, and pregnancy can require specially selected, antigen-matched, irradiated, CMV-safe or otherwise modified products determined by transfusion medicine." },
      { label: "Complications and how to recognize them", text: "MTP can cause or reveal hypothermia, hypocalcemia, acid-base shifts, hyperkalemia, dilutional thrombocytopenia or hypofibrinogenemia, coagulopathy, DIC, volume overload and compartment edema. Standard transfusion reactions remain possible: acute hemolysis from ABO incompatibility, febrile or allergic reactions, anaphylaxis, bacterial contamination, TRALI, TACO and delayed hemolysis. Hypotension may be ongoing bleeding, a reaction, anesthetic effect or obstructive shock; hypoxemia may be shock, lung injury, overload or aspiration. Stop the implicated unit when a reaction is suspected, maintain resuscitation, notify blood bank and provider, and follow the emergency reaction pathway. Do not dismiss a reaction because hemorrhage is also present." },
      { label: "Deactivation and transition", text: "A safe protocol includes a stop process. When bleeding is controlled, hemodynamics and perfusion improve, product demand slows, and targeted data are available, the responsible clinician should notify the blood bank that MTP is deactivated or modified. Return unopened products using validated temperature and transport rules; do not leave coolers unattended or stock units in an unapproved refrigerator. Reconcile every unit issued, transfused, wasted or returned. Continue surveillance for delayed reactions, electrolyte changes, pulmonary edema, abdominal or extremity compartment syndrome, thrombosis, kidney injury and recurrent bleeding. Ordinary restrictive red-cell thresholds apply only after the patient is hemodynamically stable and active hemorrhage has ended." },
      { label: "Nursing coordination and documentation", text: "The bedside nurse protects the protocol from becoming chaotic. Use closed-loop communication, verify emergency identifiers, document unit number, component, start and stop time, vital signs, warmer and rapid-infuser use, and observed response. One team member should maintain a running product and medication total while another performs assessment; roles may be combined only if workload allows. Trend mental status, pulses, skin, capillary refill, blood pressure, urine, temperature, ECG, bleeding sites and drains. Ensure ordered specimens are labeled at the bedside and sent promptly. Communicate calcium, fibrinogen, platelet and anticoagulant concerns, and state the next reassessment time. During handoff, name whether MTP is active, the current pack, total products, last laboratories, source-control status, reactions, and who can deactivate it." },
      { label: "Common misconceptions", text: "MTP does not mean give red cells until the hemoglobin normalizes. It does not make plasma, platelets, red cells and whole blood interchangeable. A 1:1:1 target is not a universal law, and laboratory-guided treatment is not a reason to withhold an initial balanced response from an exsanguinating patient. Permissive hypotension is not appropriate for every patient, especially when cerebral or fetal perfusion is threatened. Calcium should not be guessed from total calcium during rapid citrate load. A normal early hemoglobin does not exclude major loss. Finally, successful activation is only half the workflow: failure to stop and reconcile the protocol can cause preventable transfusion, waste, overload and inventory harm to other patients." }
    ],
    nursingActions: [
      "Activate the exact local MTP pathway and trauma, obstetric, surgical, or rapid-response team when criteria are met; record activation time and responsible clinician.",
      "Use two patient identifiers whenever possible, apply the emergency-identification policy when not, and use closed-loop communication with the blood bank for every identity or compatibility change.",
      "Establish and protect rapid vascular access, confirm line and rapid-infuser compatibility, use an approved blood warmer, and never place blood in a microwave or unvalidated warming device.",
      "Obtain ordered type and screen, CBC, coagulation studies, fibrinogen, blood gas, lactate, electrolytes and ionized calcium without delaying emergency release or source control.",
      "Inspect every unit, verify component, compatibility label, unit number, expiration, patient identity and required modifications according to emergency policy before connection.",
      "Maintain a real-time transfusion record including red cells, plasma, platelets, cryoprecipitate or fibrinogen, whole blood, calcium, tranexamic acid, fluids, output and estimated blood loss.",
      "Trend airway, ventilation, perfusion, mental status, temperature, ECG, bleeding, drains, urine output, lactate and response to each resuscitation phase rather than relying on hemoglobin alone.",
      "Watch for hypocalcemia, hyperkalemia, hypothermia, acidosis, coagulopathy and all standard transfusion reactions; escalate immediately and follow the reaction pathway when suspected.",
      "Coordinate transport to the operating room, interventional suite, endoscopy or obstetric procedure area; transfusion must not delay definitive source control.",
      "Ask explicitly after each pack whether the protocol remains active, whether product composition should change, and when the next laboratory or viscoelastic reassessment is due.",
      "Notify the blood bank promptly on deactivation, return products under validated conditions, and reconcile issued, transfused, returned and wasted components.",
      "Handoff activation status, suspected source, total products, compatibility phase, last results, calcium and temperature trend, reactions, source-control progress, and the named clinician directing resuscitation."
    ],
    safetyAlerts: [
      "MTP is for life-threatening active or anticipated hemorrhage. It is not routine treatment for stable anemia or an order to transfuse to a normal hemoglobin.",
      "Do not delay activation for a low hemoglobin, completed crossmatch, retrospective unit count, or final imaging when the patient is exsanguinating.",
      "Do not give red cells as if they replace platelets, fibrinogen or coagulation factors. Each component has a distinct function and compatibility pathway.",
      "ABO-incompatible red cells can cause catastrophic intravascular hemolysis. Emergency release changes the compatibility workflow but never removes identity verification.",
      "Rapid citrate load can cause severe ionized hypocalcemia, hypotension and dysrhythmia. Measure ionized calcium and follow the local replacement protocol.",
      "Unwarmed products and environmental exposure worsen hypothermia and coagulopathy. Use active warming early.",
      "Do not add medications to blood products or improvise Y-site solutions. Follow the component label, infusion device instructions and transfusion policy.",
      "Persistent bleeding despite products demands urgent source-control reassessment; repeating packs cannot repair structural hemorrhage.",
      "Stop the implicated unit and activate the transfusion-reaction pathway for new fever, rigors, dyspnea, hypoxemia, hypotension, pain, hives, hemoglobinuria or unexpected deterioration.",
      "Deactivate deliberately. Continuing automatic product delivery after hemostasis can cause overload, thrombosis, pulmonary injury and inventory waste."
    ],
    limitations: [
      "Activation criteria, pack composition, use of low-titer group O whole blood, calcium regimen, fibrinogen target, laboratory interval, and deactivation authority are institution specific.",
      "PROPPR studied selected severe trauma patients; its findings should not be generalized as proof of one universal ratio for obstetric, pediatric, gastrointestinal, operative or nontraumatic bleeding.",
      "Conventional coagulation tests and viscoelastic assays measure different aspects of hemostasis and have timing, temperature, anticoagulant and platform limitations.",
      "Published retrospective massive-transfusion definitions are not bedside activation thresholds and can misclassify patients who die early or stop bleeding before a numeric cutoff.",
      "Blood availability, compatibility, previous antibodies, prehospital products and regional systems change the safest implementation.",
      "This educational card does not provide patient-specific component doses, reversal orders, tranexamic-acid dosing, blood-pressure goals or calcium prescriptions.",
      "Whole blood and component therapy have different advantages and constraints; neither should be represented as categorically superior in every setting.",
      "Evidence evolves, and the current hospital protocol and transfusion-medicine service govern real-time practice."
    ],
    relatedTopics: [
      "Packed red blood cell transfusion", "Cryoprecipitate", "Fibrinogen", "Damage control resuscitation",
      "Hemorrhagic shock", "Postpartum hemorrhage", "Tranexamic acid", "Ionized calcium", "Hypocalcemia",
      "Hypothermia", "Disseminated intravascular coagulation", "Transfusion reaction", "TRALI", "TACO"
    ],
    tags: [
      "massive transfusion protocol", "MTP", "major hemorrhage", "damage control resuscitation", "balanced transfusion",
      "hemorrhagic shock", "source control", "blood bank", "trauma nursing", "critical care", "ionized calcium",
      "hypothermia prevention", "goal directed transfusion"
    ],
    sourceKeys: mtpSourceKeys
  });

  const packedRedBloodCellTransfusionCard = article({
    name: "Packed red blood cell transfusion",
    fullForm: "Packed red blood cell component transfusion",
    displayName: "Packed red blood cell transfusion",
    type: "procedure",
    recordType: "procedure",
    diagnosticKind: "procedure",
    icon: "PRBC",
    category: "Hematology, Transfusion Medicine & Nursing Procedures",
    aliases: [
      "PRBC transfusion", "PRBCs", "packed RBC transfusion", "packed red cells", "packed cells",
      "red blood cell transfusion", "RBC transfusion", "red cell transfusion", "red blood cell concentrate",
      "RBC concentrate transfusion", "packed cell transfusion", "blood transfusion for anemia", "transfuse one unit PRBC",
      "one unit of blood", "give packed red cells", "red cells for low hemoglobin", "blood for low Hgb"
    ],
    abbreviations: ["PRBC", "PRBCs", "RBC", "RBCs"],
    commonMisspellings: ["packed red blood cell tranfusion", "PRBC tranfusion", "packed red blood cells transfussion", "pack red cell transfusion"],
    summary: "Packed red blood cell transfusion is intravenous administration of a donor red-cell component to increase circulating hemoglobin and oxygen-carrying capacity. The name packed cells persists in clinical speech, although modern components are usually leukocyte-reduced red cells suspended in additive solution rather than tightly packed cells. Red cells are appropriate when anemia or acute blood loss is impairing or threatening oxygen delivery and the expected benefit exceeds infectious, immune, circulatory, pulmonary, electrolyte and iron-related risks. They are not a general volume expander, nutritional treatment, platelet replacement, fibrinogen source, plasma coagulation-factor product, or whole blood. In a nonbleeding average adult, one unit often raises hemoglobin by about 1 g/dL and hematocrit by about 3 percentage points, but ongoing bleeding, body size, fluid balance, splenic sequestration and hemolysis make the actual response variable. For most hemodynamically stable hospitalized adults, contemporary AABB guidance supports considering transfusion below a restrictive hemoglobin threshold near 7 g/dL, with somewhat higher thresholds considered in selected cardiac-surgery, orthopedic-surgery or preexisting cardiovascular-disease populations. A threshold is a decision point, not an automatic order; symptoms, bleeding, ischemia, cardiopulmonary reserve, goals, alternatives and trajectory remain central. Active exsanguination is managed by hemorrhage protocols rather than stable-anemia thresholds.",
    quickAnswer: "Confirm the indication and whether the patient is stable, actively bleeding, symptomatic, ischemic or in a special population. Verify informed consent or emergency authorization, current type and screen or crossmatch, required modifications, two patient identifiers, unit number, ABO/Rh compatibility label, expiration and product integrity. Obtain baseline assessment and vital signs; use approved blood tubing with a filter and only solutions and devices permitted by the component label and local policy. Begin cautiously and observe closely at the bedside during the early period because severe acute reactions can start after a small volume. Complete the unit within the locally required maximum, commonly no more than four hours after issue or entry into uncontrolled temperature, and never warm blood except with an approved device. Stop the transfusion immediately for a suspected reaction, maintain IV access with new tubing and compatible fluid according to policy, assess ABCs and vital signs, notify the provider and blood bank, perform clerical recheck, and send required specimens and the unit. Do not restart the implicated unit unless the transfusion service explicitly authorizes it. Reassess symptoms and hemoglobin when clinically useful; stable patients are commonly given one unit followed by reassessment rather than automatic multiple units.",
    sections: [
      { label: "What red cells do", text: "Hemoglobin inside red cells binds oxygen in the lungs and releases it in tissues according to partial pressure, pH, temperature and metabolic demand. Anemia reduces arterial oxygen content even when oxygen saturation is normal because saturation reports the percentage of available hemoglobin sites occupied, not how much hemoglobin exists. Transfused red cells increase hemoglobin mass and can improve oxygen delivery when blood flow and ventilation are adequate. They do not directly repair the cause of anemia, create platelets, replace fibrinogen, or correct every coagulation defect. A patient with low hemoglobin from iron, vitamin B12 or folate deficiency still needs replacement of the missing substrate; a patient with bleeding still needs source control; and a patient with hemolysis needs treatment of the destructive process." },
      { label: "Component boundaries", text: "A red-cell unit contains concentrated donor erythrocytes with anticoagulant and preservative or additive solution and has most plasma removed. It therefore differs from fresh frozen plasma, which supplies soluble coagulation factors; platelets, which support primary hemostasis; cryoprecipitate or fibrinogen concentrate, which target low fibrinogen; and whole blood, which retains multiple components in one product. Leukocyte reduction lowers febrile reaction, HLA alloimmunization and some CMV-transmission risk but does not make a unit sterile or eliminate every immune reaction. Irradiation prevents transfusion-associated graft-versus-host disease in selected at-risk recipients; it does not prevent ordinary infection. Washing removes much of the residual plasma for selected severe allergic contexts; it is not routine and does not make an incompatible unit safe." },
      { label: "Indications require physiology and context", text: "Use red cells for clinically important anemia or acute blood loss when added oxygen-carrying capacity is expected to help. Relevant evidence includes hemodynamics, bleeding, dyspnea, chest discomfort, syncope, exercise intolerance, mental status, lactate and perfusion, cardiopulmonary disease, rate of decline and available alternatives. Symptoms are not automatically caused by anemia, and an asymptomatic number is not automatically harmless. In stable nonbleeding adults, a restrictive strategy avoids many unnecessary exposures without worsening major outcomes in studied populations. Patients with active hemorrhage, acute coronary syndromes, chronic transfusion programs, severe thrombocytopenia, pregnancy, neonates or specialized hematologic disease may require different evidence and specialist guidance." },
      { label: "Restrictive thresholds are decision supports", text: "AABB 2023 guidance recommends considering transfusion when hemoglobin is below 7 g/dL for most hemodynamically stable hospitalized adults. Clinicians may choose about 7.5 g/dL in cardiac surgery and about 8 g/dL in orthopedic surgery or preexisting cardiovascular disease. These values are not physiologic cliffs and should not be copied into active bleeding. The word considering matters: the decision integrates symptoms, comorbidity, rate of loss, alternatives, patient preferences and goals. Conversely, a hemoglobin just above a numeric threshold does not prohibit transfusion when there is clear anemia-related instability or ischemia. For stable patients, one-unit transfusion followed by reassessment reduces unnecessary exposure and volume." },
      { label: "Expected response and why it varies", text: "In an average nonbleeding adult, one red-cell unit commonly increases hemoglobin by about 1 g/dL and hematocrit by about 3 percentage points. A smaller adult or child may have a larger concentration change; a larger person may have a smaller change. Ongoing bleeding or hemolysis consumes the increment, while diuresis can concentrate and crystalloid can dilute the post-transfusion sample. Sampling immediately before full circulation mixing can mislead. Lack of the expected rise should trigger a review of timing, fluid balance, ongoing blood loss, hemolysis, laboratory error and patient identity rather than an automatic second unit. The desired clinical response is improved oxygen delivery and symptoms, not achievement of a normal population hemoglobin." },
      { label: "Compatibility and emergency release", text: "Pretransfusion testing identifies ABO and RhD type, unexpected red-cell antibodies and a compatible donor unit. The sample must be collected and labeled from the correct patient because a wrong-blood-in-tube error can defeat technically perfect laboratory testing. Prior pregnancy and transfusion can create antibodies that later become undetectable but still matter, so historical blood-bank records are important. In life-threatening hemorrhage, emergency-release uncrossmatched group O red cells may be issued before testing is complete, with Rh selection based on inventory, sex and pregnancy potential, age, urgency and local policy. Transition to type-specific and then crossmatch-compatible blood when safe. Emergency release accepts calculated compatibility risk to prevent death from delay; it never cancels identity checks or blood-bank communication." },
      { label: "Preparation before starting", text: "Verify the order, indication, consent or emergency authorization, vascular access, current specimen validity, component modifications and a plan for diuretics or slower rate when clinically ordered. Explain the purpose, expected duration and symptoms to report. Obtain baseline temperature, pulse, respiratory rate, blood pressure, oxygenation and focused lung, cardiac, skin and fluid assessment. Confirm the patient with two independent identifiers against the compatibility tag and record; inspect the unit for leaks, clots, discoloration, unusual turbidity, expiration and correct component. Use validated blood administration tubing with the required filter. Follow policy for electronic or independent bedside verification. Do not premedicate routinely merely because a patient is being transfused; acetaminophen and antihistamines do not prevent dangerous hemolysis, TRALI or TACO and can obscure early findings." },
      { label: "Administration and early observation", text: "Start at the locally specified cautious rate when the patient can tolerate it and remain able to stop immediately. Severe acute hemolysis, anaphylaxis or bacterial contamination can begin after only a small volume, so early direct observation and symptom teaching matter. Recheck vital signs at the intervals in policy and whenever symptoms occur. Adjust the rate to the clinical indication, cardiovascular reserve, unit expiration and ordered completion time. A unit should generally be completed within four hours to limit bacterial growth risk, but the local blood-bank issue time and product instructions control. If the required safe rate would exceed the allowed time, contact the blood bank for an aliquot or revised plan rather than leaving blood hanging longer." },
      { label: "Compatible fluids, tubing and warming", text: "Use only fluids, medications, tubing and infusion devices approved by the component circular, manufacturer and local policy. Isotonic 0.9% sodium chloride has traditionally been compatible with red cells; calcium-containing solutions can overcome citrate locally and promote clotting in the line, while hypotonic solutions can damage red cells. Some modern policies permit additional solutions after local validation, so the rule is not to improvise. Never inject medication into a blood bag or run an unapproved drug through the blood line. Use only a monitored approved blood warmer for rapid transfusion, clinically significant cold agglutinins or other authorized indications. Microwaves, hot water, heating pads and uncontrolled devices can hemolyze cells or overheat the product." },
      { label: "Acute transfusion-reaction recognition", text: "Stop and investigate new fever or chills, flushing, hives, itching, wheeze, stridor, dyspnea, hypoxemia, cough, hypertension or hypotension, chest or back pain, severe anxiety, nausea, pain at the IV site, hemoglobinuria, oozing, or unexpected deterioration. Acute hemolytic reaction can result from ABO incompatibility and may cause fever, pain, hypotension, hemoglobinuria, kidney injury and DIC. Bacterial contamination can cause abrupt fever, rigors and shock. Allergic reactions range from hives to anaphylaxis. Febrile nonhemolytic reactions are diagnoses of exclusion because fever can also mark hemolysis or contamination. A patient under anesthesia, very young, confused or nonverbal may show only hypotension, bleeding, dark urine, bronchospasm or a temperature change." },
      { label: "TRALI versus TACO", text: "Both can produce acute dyspnea, hypoxemia and bilateral pulmonary opacities, but their mechanisms differ. Transfusion-related acute lung injury is noncardiogenic permeability edema linked to donor or recipient biologic factors and usually occurs during or within six hours; fever or hypotension may occur, and diuresis is not the primary treatment. Transfusion-associated circulatory overload is hydrostatic edema from volume or rate exceeding cardiovascular capacity and more often includes hypertension, elevated venous pressure, positive fluid balance and response to diuresis. Older age, heart or kidney dysfunction and rapid multiple units increase TACO risk. Stop the transfusion, support ABCs and involve the blood bank; do not guess from one sign or automatically label every post-transfusion hypoxemia as fluid overload." },
      { label: "Immediate response to a suspected reaction", text: "Stop the transfusion and stay with the patient. Assess airway, breathing, circulation, vital signs, oxygenation and symptoms; call emergency support when unstable. Maintain IV access with new tubing and a compatible fluid according to local policy so residual product is not infused. Recheck patient, unit, compatibility tag and paperwork at the bedside. Notify the prescribing clinician and transfusion service immediately. Do not discard the bag or tubing; return them and obtain blood or urine specimens as directed. Treatment depends on mechanism: epinephrine for anaphylaxis, supportive respiratory care for TRALI, diuresis and pressure support for TACO, and aggressive shock, renal and DIC management for acute hemolysis or sepsis. Never restart the implicated unit without explicit transfusion-service authorization." },
      { label: "Delayed and cumulative risks", text: "A delayed hemolytic reaction can appear days to weeks later with an inadequate hemoglobin increment, jaundice, dark urine, pain or a newly detectable antibody. Alloimmunization complicates future matching and is especially important in sickle cell disease, pregnancy and chronically transfused patients. Repeated red-cell exposure can cause iron overload because the body has no regulated pathway to excrete the iron contained in transfused hemoglobin. Transfusion-transmitted infection risk is low but not zero. Other rare harms include transfusion-associated graft-versus-host disease in susceptible recipients and post-transfusion purpura. Accurate history, product modification, antigen matching and specialist surveillance reduce selected risks but do not make transfusion risk free." },
      { label: "Special populations and product modification", text: "Neonates and children usually receive weight-based aliquots with attention to donor exposure, potassium, irradiation, CMV strategy, warming and administration volume. Pregnancy requires attention to maternal antibodies and fetal risk. Sickle cell disease often needs extended antigen matching and a strategy that avoids hyperhemolysis, excessive viscosity and iron accumulation. Oncology, stem-cell-transplant, congenital immunodeficiency and transfusion-dependent patients may need irradiated, CMV-safe, washed, antigen-matched or otherwise selected products. These modifications solve specific problems and are not interchangeable. The transfusion service should verify eligibility before the unit is issued, and emergency need should be balanced against delay." },
      { label: "Patient blood management and alternatives", text: "Avoiding an unnecessary unit begins before hemoglobin becomes critical. Identify and treat iron, B12 or folate deficiency; reduce diagnostic phlebotomy; manage surgical blood loss; use cell salvage where appropriate; optimize anticoagulant reversal and hemostasis; and consider erythropoiesis-stimulating therapy only for supported indications. These strategies do not replace red cells during life-threatening blood loss or severe symptomatic anemia. Shared decision-making should explain the reason, alternatives, expected benefit, major risks and consequences of declining. Respect informed refusal and document an individualized bloodless plan early when possible rather than during crisis." },
      { label: "Post-transfusion evaluation and documentation", text: "Reassess the symptom or physiologic problem that justified transfusion, not only the laboratory number. Obtain a post-transfusion CBC when the result will change management and at a time appropriate to bleeding and mixing. Inspect lungs, fluid balance, temperature, urine, skin and IV site and monitor for delayed symptoms. Document unit number, donor component, compatibility, start and stop times, volume, rate, vital signs, verification, patient tolerance, reaction actions and teaching. If another unit is proposed for a stable patient, pause to assess whether the first unit achieved the intended benefit. Communicate antibodies, reactions and required modifications in discharge and future care records." },
      { label: "Common misconceptions", text: "A red-cell transfusion is not harmless because infection screening is strong; immune, pulmonary, circulatory, clerical, electrolyte and cumulative iron risks remain. Red cells do not correct low platelets or fibrinogen. A hemoglobin of 7 g/dL is not an automatic order or an absolute prohibition above it. Oxygen saturation can be normal during severe anemia because it measures saturation, not hemoglobin amount. Premedication does not prevent serious reactions. Leukocyte reduction is not irradiation, washing or pathogen elimination. Finally, blood transfusion is broader than PRBC transfusion: clicking packed red cells should open this component-specific card, while plasma, platelets, cryoprecipitate and whole blood require their own cards and indications." }
    ],
    nursingActions: [
      "Verify the order, indication, consent or emergency authorization, valid pretransfusion specimen, vascular access, special product requirements and planned rate before requesting the unit.",
      "Assess baseline vital signs, oxygenation, lung sounds, edema, urine output, skin, temperature and prior reaction history; identify TACO risk and communicate need for slower rate, split unit or ordered diuresis.",
      "At the bedside, match two patient identifiers, unit number, component, ABO/Rh and compatibility label, expiration and required modifications using the independent or electronic check in policy.",
      "Inspect the bag for leaks, clots, discoloration or unexpected appearance and use approved filtered blood tubing, compatible access and a validated warmer only when indicated.",
      "Start cautiously, remain available for direct early observation, teach the patient to report fever, chills, itching, breathing difficulty, pain, nausea, anxiety or any sudden change, and record required vital signs.",
      "Complete the unit within the blood bank's permitted time, commonly within four hours, and contact the blood bank rather than exceeding the limit when a slower rate is clinically necessary.",
      "Stop immediately for a suspected reaction, maintain access with new tubing and compatible fluid per policy, perform ABC assessment, notify provider and blood bank, and activate emergency support when unstable.",
      "Do not discard or restart the unit. Recheck clerical identity and send the bag, tubing, blood and urine specimens exactly as the transfusion-reaction protocol directs.",
      "Trend the intended response, CBC when useful, fluid balance, lung findings, urine, temperature and delayed jaundice or dark urine; question automatic additional units in a stable patient before reassessment.",
      "Document unit and product details, verification, times, rate, volume, assessment, patient response, teaching and every reaction intervention with notification times.",
      "Ensure historical antibodies, reaction type and future requirements such as antigen matching, irradiation or washing are visible in handoff and future records.",
      "Teach delayed reaction signs and whom to contact after discharge, especially for jaundice, dark urine, fever, dyspnea, edema, rash or unexpected recurrence of anemia symptoms."
    ],
    safetyAlerts: [
      "Packed red cells increase oxygen-carrying capacity; they do not replace plasma coagulation factors, platelets, fibrinogen or whole blood.",
      "A wrong-patient or wrong-blood-in-tube error can cause fatal ABO-incompatible hemolysis. Bedside identity verification is never optional, including during emergency release.",
      "Stop the transfusion immediately for any suspected reaction. Do not slow it down as a diagnostic trial and do not restart without explicit transfusion-service direction.",
      "Do not add medication to a blood bag or run blood with an unapproved solution. Calcium-containing and hypotonic fluids can create component or line hazards.",
      "Use only approved blood warmers. Uncontrolled warming can hemolyze cells, support bacterial growth or burn the patient.",
      "Finish within the locally permitted time, commonly four hours. Request an aliquot or alternative plan when a slow safe rate would exceed that limit.",
      "TACO risk rises with heart or kidney dysfunction, older age, positive fluid balance, rapid rate and multiple units; one unit with reassessment may be safest when the patient is stable.",
      "TRALI can mimic overload but is noncardiogenic lung injury. Do not assume every hypoxemic reaction should be treated only with diuretics.",
      "Restrictive thresholds apply to hemodynamically stable populations and must not delay hemorrhage resuscitation or replace individualized assessment.",
      "Premedication and leukocyte reduction do not prevent acute hemolysis, bacterial sepsis, TRALI, TACO or all allergic reactions."
    ],
    limitations: [
      "The average 1 g/dL hemoglobin increment per adult unit is an estimate and changes with body size, bleeding, hemolysis, fluid balance and sampling time.",
      "Hemoglobin thresholds in randomized trials apply to studied stable populations; evidence is less certain or different in acute coronary syndromes, active hemorrhage and several specialized groups.",
      "Product names, additive solutions, storage age, irradiation, washing, antigen matching, CMV strategy, bedside checking and vital-sign schedules vary by blood supplier and institution.",
      "Symptoms attributed to anemia can have cardiopulmonary, infectious, neurologic or medication causes, and transfusion may not correct them.",
      "No premedication or screening process removes every transfusion risk. Informed consent should not promise zero infection or reaction risk.",
      "This card does not give a patient-specific transfusion order, infusion rate, pediatric dose, diuretic regimen or reaction medication dose.",
      "Emergency release balances delay against compatibility risk and requires the local transfusion service; ANI cannot determine an individual emergency unit selection.",
      "Reference ranges and practice recommendations change; the current component circular, blood-bank instruction and local policy control."
    ],
    relatedTopics: [
      "Blood transfusion", "Massive transfusion protocol", "Cryoprecipitate", "Hemoglobin", "Hematocrit",
      "Transfusion reaction", "TRALI", "TACO", "Anaphylaxis"
    ],
    tags: [
      "packed red blood cells", "PRBC", "red cell component", "oxygen carrying capacity", "restrictive transfusion",
      "blood administration", "transfusion nursing", "compatibility", "transfusion reaction", "TRALI", "TACO",
      "hematology", "patient blood management"
    ],
    sourceKeys: transfusionSourceKeys
  });

  const application = {
    attemptedTargets: [
      "Pseudocholinesterase deficiency",
      "Massive transfusion protocol",
      "Packed red blood cell transfusion"
    ],
    appliedTargets: [],
    missingTargets: [],
    errors: [],
    sourceReferencesAddedOrUpdated: 0,
    pathology: null,
    clinicalReferences: [],
    prbcAliasOwnershipCleanup: {
      genericTitle: "Blood transfusion",
      recordsInspected: 0,
      removedAliasCount: 0,
      removedSearchTermCount: 0
    }
  };

  const pathologyDatabase = window.ANI_PATHOLOGY_DATABASE;
  if (!pathologyDatabase || !Array.isArray(pathologyDatabase.diseases)) {
    application.missingTargets.push("Pseudocholinesterase deficiency (installed pathology collection unavailable)");
  } else {
    try {
      application.sourceReferencesAddedOrUpdated += installSources(pathologyDatabase, pseudoSourceKeys);
      const canonicalKey = normalize(pseudocholinesteraseDeficiencyCard.name);
      const semanticKeys = new Set([
        canonicalKey,
        "butyrylcholinesterase deficiency",
        "plasma cholinesterase deficiency",
        "serum cholinesterase deficiency",
        "bche deficiency"
      ].map(normalize));
      const matches = pathologyDatabase.diseases
        .map((record, index) => ({ record, index, key: normalize(titleOf(record)) }))
        .filter(({ key }) => semanticKeys.has(key));
      const exact = matches.filter(({ key }) => key === canonicalKey);
      const selected = (exact.length ? exact : matches).slice().sort((left, right) => {
        const score = ({ record, index, key }) => (
          (key === canonicalKey ? 100 : 0)
          + clean(record && record.definition).length / 100
          + (Array.isArray(record && record.nursingPriorities) ? record.nursingPriorities.length : 0)
          + index / Math.max(pathologyDatabase.diseases.length, 1)
        );
        return score(right) - score(left);
      })[0] || { record: {}, index: pathologyDatabase.diseases.length };
      const target = selected.record;
      const inheritedAliases = matches.flatMap(({ record }) => [
        titleOf(record),
        ...(Array.isArray(record.aliases) ? record.aliases : []),
        ...(Array.isArray(record.commonMisspellings) ? record.commonMisspellings : [])
      ]);
      Object.assign(target, pseudocholinesteraseDeficiencyCard, {
        aliases: unique([...pseudocholinesteraseDeficiencyCard.aliases, ...inheritedAliases])
          .filter((value) => normalize(value) !== canonicalKey),
        // Keep this list limited to verified runtime targets. Historical broad
        // related-topic strings would otherwise render as broken internal links.
        relatedTopics: unique(pseudocholinesteraseDeficiencyCard.relatedTopics)
      });
      if (!matches.length) pathologyDatabase.diseases.push(target);
      let removedDuplicateCount = 0;
      for (let index = pathologyDatabase.diseases.length - 1; index >= 0; index -= 1) {
        const record = pathologyDatabase.diseases[index];
        if (record !== target && semanticKeys.has(normalize(titleOf(record)))) {
          pathologyDatabase.diseases.splice(index, 1);
          removedDuplicateCount += 1;
        }
      }
      const familyCountAfter = pathologyDatabase.diseases.filter((record) => semanticKeys.has(normalize(titleOf(record)))).length;
      application.pathology = {
        canonicalName: pseudocholinesteraseDeficiencyCard.name,
        databaseGlobal: "ANI_PATHOLOGY_DATABASE",
        collectionName: "diseases",
        identityMatchesBefore: matches.length,
        selectedIndexBeforeMerge: selected.index,
        removedDuplicateCount,
        canonicalCountAfter: familyCountAfter,
        duplicateCreated: familyCountAfter > 1,
        runtimeOwner: target.owner,
        runtimeType: target.entryType,
        runtimeCategory: target.category
      };
      application.appliedTargets.push(pseudocholinesteraseDeficiencyCard.name);
    } catch (error) {
      application.errors.push("Pseudocholinesterase deficiency merge: " + clean(error && error.message || error || "Unknown error"));
    }
  }

  const foundationDatabase = window.ANI_FOUNDATIONS_DATABASE && typeof window.ANI_FOUNDATIONS_DATABASE === "object"
    ? window.ANI_FOUNDATIONS_DATABASE
    : { entries: [], sourceReferences: [] };
  if (!Array.isArray(foundationDatabase.entries)) foundationDatabase.entries = [];
  if (!Array.isArray(foundationDatabase.sourceReferences)) foundationDatabase.sourceReferences = [];
  const diagnosticDatabase = window.ANI_DIAGNOSTIC_DATABASE && typeof window.ANI_DIAGNOSTIC_DATABASE === "object"
    ? window.ANI_DIAGNOSTIC_DATABASE
    : { entries: [] };
  if (!Array.isArray(diagnosticDatabase.entries)) diagnosticDatabase.entries = [];

  try {
    application.sourceReferencesAddedOrUpdated += installSources(
      foundationDatabase,
      unique([...mtpSourceKeys, ...transfusionSourceKeys])
    );

    const genericBloodTitle = normalize("Blood transfusion");
    const prbcOwnedTerms = new Set([
      "packed red blood cell transfusion", "packed rbc transfusion", "prbc transfusion", "prbcs",
      "packed red cells", "packed cells", "red blood cell concentrate", "rbc concentrate transfusion",
      "red blood cell transfusion", "rbc transfusion", "red cell transfusion", "blood transfusion for anemia"
    ].map(normalize));
    diagnosticDatabase.entries.forEach((record) => {
      if (normalize(titleOf(record)) !== genericBloodTitle) return;
      application.prbcAliasOwnershipCleanup.recordsInspected += 1;
      if (Array.isArray(record.aliases)) {
        const before = record.aliases.length;
        record.aliases = unique(record.aliases.filter((value) => !prbcOwnedTerms.has(normalize(value))));
        application.prbcAliasOwnershipCleanup.removedAliasCount += before - record.aliases.length;
      }
      if (Array.isArray(record.searchTerms)) {
        const before = record.searchTerms.length;
        record.searchTerms = unique(record.searchTerms.filter((value) => !prbcOwnedTerms.has(normalize(value))));
        application.prbcAliasOwnershipCleanup.removedSearchTermCount += before - record.searchTerms.length;
      }
      record.clinicalFrontierWave42PrbcOwnershipRevision = VERSION;
    });

    [massiveTransfusionProtocolCard, packedRedBloodCellTransfusionCard].forEach((card) => {
      const canonicalKey = normalize(card.name);
      const matches = diagnosticDatabase.entries
        .map((record, index) => ({ record, index }))
        .filter(({ record }) => normalize(titleOf(record)) === canonicalKey);
      const selected = matches.slice().sort((left, right) => {
        const score = ({ record, index }) => (
          clean(record && record.summary).length / 100
          + (Array.isArray(record && record.sections) ? record.sections.length : 0)
          + index / Math.max(diagnosticDatabase.entries.length, 1)
        );
        return score(right) - score(left);
      })[0] || { record: {}, index: diagnosticDatabase.entries.length };
      const target = selected.record;
      const inheritedAliases = matches.flatMap(({ record }) => Array.isArray(record.aliases) ? record.aliases : []);
      const identityFields = ["id", "key", "slug", "entryId", "uuid"];
      const inheritedIdentifiers = unique(matches.flatMap(({ record }) => identityFields
        .filter((field) => record && record[field] !== undefined && clean(record[field]))
        .map((field) => field + ":" + clean(record[field]))));
      Object.assign(target, card, {
        aliases: unique([...inheritedAliases, ...card.aliases]).filter((value) => normalize(value) !== canonicalKey),
        // Wave 42 intentionally replaces inherited link lists with targets that
        // are confirmed to resolve in the bundled offline encyclopedia.
        relatedTopics: unique(card.relatedTopics),
        legacyIdentifiers: unique([...(target.legacyIdentifiers || []), ...inheritedIdentifiers])
      });
      if (!matches.length) diagnosticDatabase.entries.push(target);
      let removedDuplicateCount = 0;
      for (let index = diagnosticDatabase.entries.length - 1; index >= 0; index -= 1) {
        const record = diagnosticDatabase.entries[index];
        if (record !== target && normalize(titleOf(record)) === canonicalKey) {
          diagnosticDatabase.entries.splice(index, 1);
          removedDuplicateCount += 1;
        }
      }
      const canonicalCountAfter = diagnosticDatabase.entries.filter((record) => normalize(titleOf(record)) === canonicalKey).length;
      application.clinicalReferences.push({
        canonicalName: card.name,
        databaseGlobal: "ANI_DIAGNOSTIC_DATABASE",
        collectionName: "entries",
        identityMatchesBefore: matches.length,
        selectedIndexBeforeMerge: selected.index,
        removedDuplicateCount,
        canonicalCountAfter,
        duplicateCreated: canonicalCountAfter > 1,
        runtimeOwner: "reference",
        runtimeType: target.type,
        runtimeCategory: target.category
      });
      application.appliedTargets.push(card.name);
    });
  } catch (error) {
    application.errors.push("Critical-care reference merge: " + clean(error && error.message || error || "Unknown error"));
  }

  diagnosticDatabase.cohorts = {
    ...(diagnosticDatabase.cohorts || {}),
    wave42CriticalCare: [massiveTransfusionProtocolCard.name, packedRedBloodCellTransfusionCard.name]
  };
  diagnosticDatabase.componentVersions = {
    ...(diagnosticDatabase.componentVersions || {}),
    wave42CriticalCare: VERSION
  };
  diagnosticDatabase.latestExtensionVersion = VERSION;
  foundationDatabase.componentVersions = {
    ...(foundationDatabase.componentVersions || {}),
    wave42CriticalCareSources: VERSION
  };
  window.ANI_DIAGNOSTIC_DATABASE = diagnosticDatabase;
  window.ANI_FOUNDATIONS_DATABASE = foundationDatabase;

  application.appliedTargets = unique(application.appliedTargets);
  application.missingTargets = unique(application.missingTargets);
  const applied = application.appliedTargets.length === application.attemptedTargets.length
    && !application.errors.length
    && application.pathology
    && !application.pathology.duplicateCreated
    && application.clinicalReferences.length === 2
    && application.clinicalReferences.every((result) => !result.duplicateCreated);

  window[GLOBAL_NAME] = Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    version: VERSION,
    applied: Boolean(applied),
    targetStrategy: "Upsert one pathology owner for the pseudocholinesterase/butyrylcholinesterase-deficiency synonym family; add exact component-specific reference owners for massive transfusion protocol and packed red blood cell transfusion; preserve the general Blood transfusion card while removing only PRBC-specific identity aliases from it.",
    canonicalTopics: Object.freeze([
      Object.freeze({ name: "Pseudocholinesterase deficiency", owner: "pathology", type: "pathology", category: "Anesthesiology & Perioperative Medicine" }),
      Object.freeze({ name: "Massive transfusion protocol", owner: "reference", type: "procedure", category: "Emergency, Trauma & Critical Care Procedures" }),
      Object.freeze({ name: "Packed red blood cell transfusion", owner: "reference", type: "procedure", category: "Hematology, Transfusion Medicine & Nursing Procedures" })
    ]),
    sourceCount: unique([...pseudoSourceKeys, ...mtpSourceKeys, ...transfusionSourceKeys]).length,
    sourceKeys: Object.freeze(unique([...pseudoSourceKeys, ...mtpSourceKeys, ...transfusionSourceKeys])),
    application
  });
}());
