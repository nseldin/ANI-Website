/*
 * ANI Clinical Frontier Wave 44 - standalone component parity, P2.
 *
 * These records separate independently searchable mechanisms, dialysis
 * concepts, laboratory interpretations, and Parkinson motor complications
 * from the combined teaching cards that introduced them.
 */
(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  const VERSION = "2026-07-22-wave44-component-parity-p2-1";
  const GENERATED_AT = "2026-07-22";

  const sourceReferences = [
    {
      key: "w44-iasp-pain-terminology",
      label: "International Association for the Study of Pain: Pain Terminology",
      url: "https://www.iasp-pain.org/resources/terminology/",
      note: "Supports the distinction between nociception and the personal experience of pain, terminology for nociceptors and sensitization, and respect for pain when a person cannot communicate verbally."
    },
    {
      key: "w44-ncbi-pain-modulation",
      label: "NCBI Bookshelf, Neuroscience: The Physiological Basis of Pain Modulation",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK10985/",
      note: "Supports spinal and descending pain modulation involving the periaqueductal gray, rostral medulla, dorsal horn, and endogenous opioid systems."
    },
    {
      key: "w44-ncbi-t-type-epilepsy",
      label: "NCBI Bookshelf, Jasper's Basic Mechanisms of the Epilepsies: Voltage-Gated Calcium Channels in Epilepsy",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK98147/",
      note: "Supports low-threshold T-type calcium currents, thalamic burst firing, normal thalamocortical rhythms, and pathologic spike-and-wave oscillation in absence epilepsy."
    },
    {
      key: "w44-aes-epilepsy-guidance",
      label: "American Epilepsy Society: Clinical Guidance",
      url: "https://www.aesnet.org/clinical-care/clinical-guidance",
      note: "Supports syndrome-based seizure classification, antiseizure-treatment safety, rescue planning, and urgent recognition of prolonged or clinically dangerous seizure activity."
    },
    {
      key: "w44-aan-parkinson-dopaminergic",
      label: "American Academy of Neurology: Dopaminergic Therapy for Motor Symptoms in Early Parkinson Disease",
      url: "https://www.aan.com/Guidelines/home/GuidelineDetail/1048",
      note: "Supports individualized levodopa therapy, motor-complication surveillance, and balancing mobility benefit against dyskinesia and other adverse effects."
    },
    {
      key: "w44-parkinson-foundation-off-time",
      label: "Parkinson's Foundation: Managing Off Time",
      url: "https://www.parkinson.org/sites/default/files/documents/managing-off-time-2026.pdf",
      note: "Supports recognition of wearing-off and less predictable off periods, medication and meal timing review, symptom diaries, and specialist-guided strategies for motor fluctuations."
    },
    {
      key: "w44-nice-parkinson-disease",
      label: "NICE Guideline NG71: Parkinson's Disease in Adults",
      url: "https://www.nice.org.uk/guidance/ng71",
      note: "Supports specialist-guided management of motor fluctuations, medication safety, and avoidance of abrupt antiparkinsonian-drug withdrawal."
    }
  ];

  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];
  sourceReferences.forEach((source) => {
    const existing = database.sourceReferences.find((entry) => entry && (entry.key || entry.id) === source.key);
    if (existing) Object.assign(existing, source);
    else database.sourceReferences.push({ ...source });
  });

  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const unique = (values) => Array.from(new Map((values || [])
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .map((value) => [normalize(value), value])).values());

  const parentSourceKeys = (parentName) => {
    const parent = database.diseases.find((entry) => normalize(entry && (entry.name || entry.displayName)) === normalize(parentName));
    return unique(parent && parent.sourceKeys || []);
  };

  const patientEducationByName = {
    Diffusion: ["In dialysis, completing the prescribed time matters because shortened or interrupted treatment reduces the time available for waste solutes to diffuse out of blood."],
    Convection: ["Filtered volume, replacement-fluid volume, and net fluid removed from the body are different numbers. Ask the dialysis team which value is being discussed before interpreting the machine display."],
    "Hemodialysis prescription": ["Do not change dialysis time, dialysate, flow, fluid goal, or anticoagulation on your own. Report cramps, dizziness, chest symptoms, severe headache, access problems, or prolonged post-treatment weakness so the prescription can be reassessed."],
    Nociception: ["Pain is a real personal experience and is not disproved by normal vital signs or imaging. New severe pain, weakness, fever, poor circulation, or loss of bowel or bladder control still needs urgent assessment."],
    "Endogenous pain modulation": ["Stress, sleep, mood, and attention can change the nervous system's pain gain without making pain imaginary. A useful plan treats both the source of injury and the factors that amplify or inhibit signaling."],
    "Peritoneal dialysis exchange": ["Use the taught sterile connection technique for every exchange and report cloudy drain fluid, abdominal pain, fever, breathing difficulty, a leak, or inability to drain immediately."],
    "Peritoneal dialysis dwell": ["Follow the prescribed dwell time and solution. Do not shorten, extend, or strengthen exchanges on your own; report repeated low drainage, weight gain, swelling, pain, a leak, or shortness of breath."],
    "Peritoneal membrane transport": ["A fast or slow transport category is not a grade. It helps the dialysis team choose dwell times and solutions that fit how your peritoneal membrane actually exchanges solute and water."],
    "Peritoneal dialysis adequacy": ["Adequacy is more than one clearance number. Keep accurate exchange and collection records and report appetite loss, nausea, itching, swelling, breathing trouble, confusion, or declining urine output."],
    "Renal acid excretion": ["This physiology explains an acid-base problem; it is not a home treatment plan. Take prescribed alkali exactly as directed and report weakness, palpitations, breathing change, confusion, swelling, or reduced urine."],
    "Bicarbonate regeneration": ["Bicarbonate products can change sodium, potassium, fluid balance, and pH. Do not self-treat a low carbon-dioxide or bicarbonate result without confirming the cause and the correct product."],
    "T-type calcium-channel physiology": ["This channel mechanism helps explain typical absence seizures, but it does not make every staring spell a seizure. Record what happened and follow the prescribed seizure and emergency plan."],
    "Thalamocortical oscillation": ["Brief staring or loss of awareness should be described by duration, responsiveness, movements, and recovery. Prolonged events, repeated events without recovery, injury, or breathing difficulty require emergency help."],
    "Urine anion gap": ["The urine anion gap is an indirect calculation, not a diagnosis. Do not change fluids, electrolytes, or bicarbonate from the number alone; clinicians must interpret it with blood pH, potassium, kidney function, and the cause of acidosis."],
    "Renal ammonium excretion": ["This kidney response cannot be judged from urine pH alone. Keep laboratory follow-up and seek urgent care for palpitations, severe weakness, confusion, breathing change, or markedly reduced urine."],
    "Wearing-off phenomenon": ["Take Parkinson medicines at the exact prescribed times and keep a diary of doses, meals, mobility, swallowing, dyskinesia, and symptom return. Do not stop or retime therapy abruptly without the Parkinson team."],
    "On-off phenomenon": ["During an off episode, use the established fall and swallowing plan and record the timing. A new one-sided deficit, fainting, fever with severe rigidity, loss of consciousness, or an unusually prolonged episode needs urgent assessment rather than being assumed to be Parkinson off-time."]
  };

  const concept = (spec) => ({
    name: spec.name,
    displayName: spec.name,
    category: spec.category,
    sourceCategory: spec.sourceCategory || spec.category,
    sourceSubcategory: spec.sourceSubcategory || "Standalone component reference",
    definition: spec.definition,
    pathology: spec.mechanism,
    pathophysiology: spec.why,
    signsSymptoms: spec.clinicalClues,
    diagnostics: spec.interpretation,
    treatments: spec.clinicalUse,
    nursingPriorities: spec.nursing,
    complications: spec.consequences,
    patientEducation: spec.patientEducation || patientEducationByName[spec.name] || [
      `Use the ${spec.name} card to understand the component itself, then open the linked parent card to see how it fits into the larger clinical problem.`
    ],
    contraindications: unique(spec.contraindications || []),
    redFlags: unique(spec.redFlags || []),
    nclexTraps: spec.pitfalls,
    relatedTopics: unique([spec.parent, ...(spec.relatedTopics || [])]),
    aliases: unique(spec.aliases || []),
    abbreviations: unique(spec.abbreviations || []),
    commonMisspellings: unique(spec.commonMisspellings || []),
    directTreatmentMedications: [],
    medicationsCommonlyUsed: [],
    medicationInferenceMode: "explicit-only",
    medicationTreatmentSafetyPolicy: "curated-explicit-v2",
    medicationTreatmentReviewDisposition: "reviewed-no-direct-medication",
    medicationTreatmentNote: "This standalone mechanism or clinical concept does not infer medication treatment from its title. Any medication belongs only to a separately verified disease-specific indication.",
    tags: unique(["Wave44 component parity", spec.category, ...(spec.tags || [])]),
    sourceKeys: unique(spec.sourceKeys || parentSourceKeys(spec.parent)),
    evidenceLastReviewed: GENERATED_AT,
    wave44ComponentParity: true,
    wave44Priority: "P2",
    componentParent: spec.parent,
    nclexEssential: spec.nclexEssential !== false,
    hidden: false,
    studentFacing: true
  });

  const dialysisParent = "Hemodialysis: diffusion, convection, ultrafiltration, and prescription";
  const painParent = "Nociception and endogenous pain modulation";
  const peritonealParent = "Peritoneal dialysis: exchanges, dwell, transport, and adequacy";
  const acidParent = "Renal acid excretion and bicarbonate regeneration";
  const thalamicParent = "T-type calcium channel and thalamocortical oscillation";
  const urineParent = "Urine anion gap and renal ammonium response";
  const parkinsonParent = "Wearing-off and on-off motor fluctuations";

  const cards = [
    concept({
      name: "Diffusion",
      category: "Physiology - Membrane Transport and Dialysis",
      parent: dialysisParent,
      definition: "Diffusion is the net movement of dissolved particles from an area of higher concentration to an area of lower concentration because random molecular motion produces more movement down the concentration gradient than against it. In hemodialysis, blood and dialysate flow on opposite sides of a semipermeable membrane, so urea, potassium, and other small solutes move toward the side where each is less concentrated.",
      mechanism: "The concentration difference supplies the driving force. The rate increases with a larger gradient, greater membrane area and permeability, and thinner diffusion distance, but falls for larger or protein-bound solutes that cross the membrane poorly. Countercurrent blood and dialysate flow helps preserve the gradient across the dialyzer instead of allowing early equilibration.",
      why: [
        "Small molecules diffuse rapidly because they move through membrane pores more easily than middle or large molecules.",
        "Raising effective blood or dialysate flow can present fresh high-concentration blood and low-concentration dialysate to the membrane, but access performance and patient tolerance limit the useful increase.",
        "A solute can be cleared from plasma yet rebound after dialysis when it redistributes from tissues, which explains why one immediate value may not represent total-body removal."
      ],
      clinicalClues: [
        "Diffusion is a transport mechanism, not a symptom or disease.",
        "Poor delivered clearance may reflect shortened treatment, access recirculation, low blood flow, dialyzer clotting, or an inadequate membrane rather than failure of diffusion as a physical principle."
      ],
      interpretation: [
        "Relate diffusive clearance to the solute concentration gradient, molecular size, membrane properties, effective treatment time, and blood and dialysate flow.",
        "Interpret urea-based adequacy measures with symptoms, potassium, acid-base status, volume, nutrition, residual kidney function, and treatment delivery rather than as proof that every toxin was removed."
      ],
      clinicalUse: [
        "Use diffusion deliberately when selecting dialysis modality, membrane, duration, and flow settings; the prescription is individualized by the nephrology team.",
        "Correct mechanical delivery problems rather than assuming that increasing one flow number will solve access dysfunction or severe clinical instability."
      ],
      nursing: [
        "Verify prescribed blood and dialysate flows, treatment time, dialyzer, access pressures, and completion because each changes delivered diffusive clearance.",
        "Escalate repeated alarms, unexpected pressure changes, visible clotting, shortened treatment, or poor laboratory response because the patient may not be receiving the ordered clearance.",
        "Trend neurologic status and electrolytes in severe uremia; removing urea much faster than brain osmoles equilibrate can contribute to dialysis disequilibrium."
      ],
      consequences: [
        "Underdelivery can leave uremia, hyperkalemia, or acidosis insufficiently corrected.",
        "Overly rapid solute reduction in a highly uremic patient can create osmotic water movement into the brain and dialysis disequilibrium."
      ],
      pitfalls: [
        "Diffusion moves solute down a concentration gradient; ultrafiltration moves water down a pressure gradient.",
        "A normal postdialysis urea value does not prove adequate volume control or removal of every clinically important solute."
      ],
      relatedTopics: ["Convection", "Ultrafiltration", "Hemodialysis prescription"],
      aliases: ["solute diffusion", "diffusive transport", "dialysis diffusion"]
    }),
    concept({
      name: "Convection",
      category: "Physiology - Membrane Transport and Dialysis",
      parent: dialysisParent,
      definition: "Convection is solute transport produced when water crosses a membrane and carries dissolved particles with it, a process often called solvent drag. In kidney replacement therapy, a transmembrane pressure drives plasma water through a filter; replacement fluid or another fluid-management strategy is then used according to the modality and net volume goal.",
      mechanism: "Convective clearance depends on the volume of ultrafiltrate produced, the membrane's permeability, and a solute's sieving coefficient—the fraction that can pass with the water. It can remove some middle molecules more effectively than diffusion alone because transport is tied to bulk water flow rather than only the concentration gradient.",
      why: [
        "A freely filterable solute follows water well, whereas a large or strongly protein-bound solute has a low sieving coefficient and remains in blood.",
        "Hemofiltration emphasizes convection; hemodiafiltration combines convection with diffusion.",
        "Net fluid removal and convective clearance are related but not identical: replacement fluid can support high convective volume while the prescribed net fluid balance remains much smaller."
      ],
      clinicalClues: [
        "Convection is a transport mechanism rather than a bedside sign.",
        "Increasing filtration fraction or convective volume can concentrate blood within the circuit and promote clotting if access flow, anticoagulation, or replacement strategy is inadequate."
      ],
      interpretation: [
        "Interpret convective delivery from prescribed and achieved ultrafiltration or substitution volume, membrane properties, treatment time, access flow, circuit pressures, and clotting.",
        "Do not equate an ultrafiltration-machine display automatically with net patient fluid loss; distinguish total filtered volume, replacement volume, and net balance."
      ],
      clinicalUse: [
        "Select and adjust convective therapy through the nephrology or critical-care prescription based on solute goals, hemodynamics, access, and modality.",
        "Respond to filter clotting, rising transmembrane pressure, hemoconcentration, and hemodynamic intolerance rather than chasing a convective target without considering safety."
      ],
      nursing: [
        "Verify modality, replacement-fluid route and rate, net balance goal, anticoagulation plan, access pressures, and cumulative intake and output.",
        "Trend filter pressures and delivered versus prescribed therapy; escalate repeated clotting or falling clearance because downtime reduces effective treatment.",
        "Assess blood pressure, perfusion, electrolytes, temperature, and medication clearance because continuous convective therapy changes fluid, solute, and drug handling."
      ],
      consequences: [
        "Excessive net removal can cause hypotension and organ hypoperfusion.",
        "Circuit clotting or excessive downtime reduces clearance and wastes blood and filter resources.",
        "Drug concentrations can become subtherapeutic or toxic if extracorporeal clearance is not incorporated into dosing."
      ],
      pitfalls: [
        "Convection is solvent drag; diffusion is movement down a concentration gradient.",
        "Replacement fluid does not mean the patient receives all filtered volume back—net balance is separately prescribed and measured."
      ],
      relatedTopics: ["Diffusion", "Ultrafiltration", "Continuous kidney replacement therapy"],
      aliases: ["convective transport", "solvent drag", "dialysis convection"]
    }),
    concept({
      name: "Hemodialysis prescription",
      category: "Nephrology - Hemodialysis",
      parent: dialysisParent,
      definition: "A hemodialysis prescription is the individualized set of treatment parameters used to remove solute and fluid safely. It specifies more than treatment time. Modality, frequency and duration, dialyzer, blood and dialysate flow, dialysate electrolytes and bicarbonate, temperature when relevant, ultrafiltration goal, vascular access, and the anticoagulation plan—including when anticoagulation must be withheld—must work together.",
      mechanism: "Each parameter changes a different part of treatment. Time, flow, membrane, and gradients shape solute clearance; the ultrafiltration goal and rate shape volume removal; dialysate composition shapes electrolyte and acid-base exchange; vascular access and the circuit-anticoagulation plan determine whether the planned treatment can actually be delivered.",
      why: [
        "Longer or more frequent dialysis can improve clearance without relying on an intolerably high instantaneous rate.",
        "A large fluid goal compressed into a short session raises the ultrafiltration rate, reduces plasma refill time, and increases intradialytic hypotension and ischemic stress.",
        "Residual kidney function, current potassium and bicarbonate, nutrition, body size, catabolism, access performance, and comorbidity make one standard prescription unsafe for every patient."
      ],
      clinicalClues: [
        "Recurrent cramps, nausea, dizziness, hypotension, chest symptoms, headache, or postdialysis exhaustion can signal poor volume or prescription tolerance.",
        "Persistent hyperkalemia, acidosis, uremic symptoms, or low delivered adequacy can signal inadequate treatment, access dysfunction, missed time, or a changing clinical state."
      ],
      interpretation: [
        "Compare prescribed with delivered duration, blood flow, dialysate flow, dialyzer, access performance, ultrafiltration, interruptions, and adequacy results.",
        "Interpret pre- and post-treatment weight, blood pressure, symptoms, edema, potassium, bicarbonate, nutrition, and residual urine output together."
      ],
      clinicalUse: [
        "The nephrology team adjusts the prescription to the patient's solute, electrolyte, acid-base, and volume goals while limiting hemodynamic injury.",
        "Urgent dialysis indications and critical illness may require a different modality or slower continuous treatment rather than simply intensifying a routine outpatient session."
      ],
      nursing: [
        "Perform a prescription-to-machine check before treatment and an achieved-treatment check afterward, including patient identity, access, dialyzer, dialysate, flows, time, anticoagulation, and net fluid goal.",
        "Assess baseline and interval weight, blood pressure, rhythm when indicated, lungs, edema, perfusion, symptoms, access, and recent intake and losses.",
        "Stop or modify treatment under protocol and escalate chest pain, severe hypotension, acute neurologic change, air or blood leak, hemolysis concern, severe reaction, access hemorrhage, or dangerous electrolyte change."
      ],
      consequences: [
        "Underdialysis can leave uremia, hyperkalemia, acidosis, or volume overload.",
        "Overaggressive fluid or solute removal can cause hypotension, arrhythmia, ischemia, cramps, disequilibrium, or loss of residual kidney function.",
        "A prescription transcribed or programmed incorrectly can create rapid, preventable harm."
      ],
      pitfalls: [
        "The prescribed treatment is not necessarily the delivered treatment; alarms, access problems, clotting, and early termination reduce dose.",
        "Adequacy is not a single urea number—volume, symptoms, nutrition, electrolytes, and residual function remain clinically important."
      ],
      relatedTopics: ["Diffusion", "Convection", "Ultrafiltration", "Hemodialysis vascular access: fistula, graft, and catheter"],
      aliases: ["HD prescription", "dialysis prescription", "hemodialysis order"]
    }),
    concept({
      name: "Nociception",
      category: "Neurology - Pain Physiology",
      parent: painParent,
      sourceKeys: ["w44-iasp-pain-terminology", "w44-ncbi-pain-modulation"],
      definition: "Nociception is the nervous system's detection and processing of actual or threatened tissue injury. Noxious mechanical, thermal, or chemical stimuli are transduced by nociceptors into electrical signals, transmitted through peripheral nerves and spinal pathways, modulated at several levels, and represented in brain networks. Pain is the person's conscious sensory and emotional experience; it is related to nociception but is not identical to it.",
      mechanism: "Inflammatory mediators can lower nociceptor thresholds, injured nerves can fire ectopically, dorsal-horn circuits can amplify or suppress signals, and descending brain pathways can inhibit or facilitate transmission. The final pain experience also reflects attention, threat, memory, sleep, mood, culture, and context without making the experience unreal.",
      why: [
        "Transduction converts tissue-threatening energy into ion-channel activity at a sensory ending.",
        "Transmission carries the signal through primary afferents to the dorsal horn and ascending pathways.",
        "Modulation can reduce or amplify signaling before perception emerges from distributed brain networks."
      ],
      clinicalClues: [
        "Nociceptive pain often tracks tissue injury and may be somatic or visceral, but mixed nociceptive and neuropathic mechanisms are common.",
        "A patient can experience severe pain with limited ongoing nociceptor input, or have nociceptive activity without being able to communicate pain."
      ],
      interpretation: [
        "Assess location, quality, timing, triggers, function, neurologic findings, inflammation or injury, sleep, mood, prior treatment, and patient goals.",
        "Use self-report when possible; behavior and physiologic signs support assessment but cannot reliably quantify another person's pain."
      ],
      clinicalUse: [
        "Match treatment to mechanism: protect or treat injured tissue, reduce inflammation when appropriate, address neuropathic mechanisms, preserve function, and use nonpharmacologic modulation.",
        "Reassess benefit in function and adverse effects rather than escalating therapy from a number alone."
      ],
      nursing: [
        "Believe and document the patient's report while assessing time-critical causes such as ischemia, compartment syndrome, hemorrhage, infection, or acute neurologic compression.",
        "Separate pain intensity from sedation and respiratory status; analgesia can improve pain while medication toxicity worsens ventilation.",
        "Use developmentally and cognitively appropriate tools and include function, sleep, movement, and goals in reassessment."
      ],
      consequences: [
        "Untreated acute nociception can impair breathing, mobility, sleep, and recovery.",
        "Persistent amplification can contribute to central sensitization and chronic pain.",
        "Treating pain without evaluating the cause can delay recognition of an emergency."
      ],
      pitfalls: [
        "Nociception is neural processing; pain is a conscious experience. They overlap but are not synonyms.",
        "Normal vital signs, calm behavior, or a normal scan do not prove that pain is absent."
      ],
      relatedTopics: ["Endogenous pain modulation", "Central sensitization", "Hyperalgesia", "Allodynia"],
      aliases: ["nociceptive processing", "pain signal processing"]
    }),
    concept({
      name: "Endogenous pain modulation",
      category: "Neurology - Pain Physiology",
      parent: painParent,
      sourceKeys: ["w44-iasp-pain-terminology", "w44-ncbi-pain-modulation"],
      definition: "Endogenous pain modulation is the body's ability to inhibit or facilitate nociceptive signaling through local spinal circuits and descending brain pathways. It explains why the same peripheral stimulus can feel different across attention, expectation, stress, sleep, mood, prior injury, and clinical context.",
      mechanism: "Networks involving the periaqueductal gray, rostral ventromedial medulla, locus coeruleus, spinal dorsal horn, endogenous opioids, norepinephrine, serotonin, and inhibitory interneurons can dampen transmission. Other descending and spinal circuits can facilitate it. Healthy control is therefore a balance, not a single pain-off switch.",
      why: [
        "Descending inhibition can reduce transmitter release from primary afferents and make dorsal-horn neurons less responsive.",
        "Facilitation can maintain vigilance after injury but becomes maladaptive when it persists after tissue healing.",
        "Sleep loss, anxiety, repeated nociception, and some chronic pain states can shift the balance toward amplification."
      ],
      clinicalClues: [
        "Pain that changes markedly with stress, sleep, attention, movement confidence, or competing stimuli may reflect changing modulation as well as peripheral input.",
        "Diffuse tenderness, hyperalgesia, or allodynia can accompany impaired inhibition or increased facilitation but is not explained by one pathway alone."
      ],
      interpretation: [
        "Assess peripheral disease and neurologic red flags first, then consider modulation, sleep, mood, trauma, activity, and medication effects.",
        "Experimental conditioned-pain-modulation tests inform research but are not a standalone bedside diagnosis of a specific chronic pain disorder."
      ],
      clinicalUse: [
        "Use multimodal care that can engage modulation—graded activity, sleep treatment, psychological strategies, rehabilitation, and mechanism-appropriate medication when indicated.",
        "Avoid implying that centrally modulated pain is imaginary; neural amplification is biologically real and still requires evaluation of treatable peripheral causes."
      ],
      nursing: [
        "Document patterns, function, sleep, mood, triggers, relieving factors, and response to both drug and non-drug interventions.",
        "Use calm explanation and shared goals to reduce threat while preserving vigilance for new weakness, fever, ischemia, trauma, or bowel and bladder change.",
        "Monitor for sedation, respiratory depression, falls, and medication overuse when pharmacologic treatment is used."
      ],
      consequences: [
        "Persistent facilitation can maintain pain, disability, sleep disruption, and fear-avoidance after the original injury improves.",
        "Overreliance on passive or sedating treatment can reduce function without correcting the modulation problem."
      ],
      pitfalls: [
        "Pain modulation does not mean the patient chooses the pain or that no peripheral pathology exists.",
        "Serotonin and norepinephrine can participate in pain control, but their roles vary by receptor, circuit, and drug; a simple 'more is better' rule is inaccurate."
      ],
      relatedTopics: ["Nociception", "Central sensitization", "Pain assessment"],
      aliases: ["descending pain modulation", "descending pain inhibition", "endogenous analgesia"]
    }),
    concept({
      name: "Peritoneal dialysis exchange",
      category: "Nephrology - Peritoneal Dialysis",
      parent: peritonealParent,
      definition: "A peritoneal dialysis exchange is one complete drain-fill-dwell cycle. Used dialysate is drained from the abdomen, fresh sterile solution is infused through the peritoneal catheter, and the solution remains for a prescribed dwell while the peritoneal membrane permits solute and water movement.",
      mechanism: "Each exchange renews concentration and osmotic gradients. Small waste solutes diffuse into dialysate, while the osmotic agent draws water across the peritoneal capillaries. Repeating exchanges provides continuous or intermittent clearance without circulating blood through an external dialyzer.",
      why: [
        "A complete drain prevents retained old fluid from diluting the next prescription and obscuring true ultrafiltration.",
        "Aseptic connection technique matters because the catheter directly accesses the peritoneal cavity.",
        "Fill volume, dwell time, solution strength, position, constipation, catheter location, and membrane transport all affect flow and clearance."
      ],
      clinicalClues: [
        "Normal effluent should be inspected with each drain; new cloudiness, abdominal pain, fever, nausea, or systemic illness raises concern for peritonitis.",
        "Slow or incomplete drainage can reflect kinking, clamping, constipation, fibrin, migration, posture, or mechanical obstruction."
      ],
      interpretation: [
        "Record prescribed and actual fill, dwell, drain volume, net ultrafiltration, effluent appearance, symptoms, and connection problems for each exchange.",
        "Treat low drain volume as a clinical finding to investigate, not as permission to force fluid through a painful or obstructed catheter."
      ],
      clinicalUse: [
        "Perform manual or automated exchanges exactly to the nephrology prescription and trained technique.",
        "Obtain effluent studies promptly under protocol when peritonitis is suspected, then begin ordered therapy without avoidable delay."
      ],
      nursing: [
        "Use meticulous hand hygiene, mask and connection technique, a clean environment, and warmed—not microwaved—solution.",
        "Check solution, concentration, expiration, clarity, leaks, prescribed additives, inflow and outflow, weight, blood pressure, edema, lungs, glucose when relevant, and catheter exit site.",
        "Urgently escalate cloudy effluent, abdominal pain, fever, rebound or rigidity, sepsis signs, bloody effluent with instability, respiratory compromise during fill, or inability to drain."
      ],
      consequences: [
        "Peritonitis and exit-site or tunnel infection",
        "Insufficient clearance or volume removal from missed, shortened, leaking, or obstructed exchanges",
        "Hyperglycemia, protein loss, hernia, leak, and respiratory discomfort from intra-abdominal volume"
      ],
      pitfalls: [
        "An exchange is the whole drain-fill-dwell cycle; the dwell is only one phase.",
        "Cloudy effluent is peritonitis until assessed, even when fever is absent."
      ],
      relatedTopics: ["Peritoneal dialysis dwell", "Peritoneal membrane transport", "Peritoneal dialysis adequacy"],
      aliases: ["PD exchange", "peritoneal dialysis cycle", "drain fill dwell cycle"]
    }),
    concept({
      name: "Peritoneal dialysis dwell",
      category: "Nephrology - Peritoneal Dialysis",
      parent: peritonealParent,
      definition: "A peritoneal dialysis dwell is the prescribed time during which dialysis solution remains in the peritoneal cavity. During the dwell, solutes diffuse between peritoneal capillary blood and dialysate, and the osmotic agent draws water into the cavity.",
      mechanism: "Early in a dwell, concentration and osmotic gradients are strongest. As solutes equilibrate and glucose or another osmotic agent is absorbed, the gradients weaken. The best dwell length therefore depends on the patient's membrane transport pattern, solution, clearance goal, and schedule.",
      why: [
        "A dwell that is too short may limit small-solute equilibration in a slow transporter.",
        "A very long glucose-based dwell in a fast transporter can lose its osmotic gradient and allow net ultrafiltration to fall or reverse.",
        "Icodextrin may be selected for a long dwell in appropriate patients because its colloid osmotic effect behaves differently from glucose."
      ],
      clinicalClues: [
        "Unexpected weight gain, edema, hypertension, or falling drain volume can signal inadequate net ultrafiltration.",
        "Pain during a dwell, leak, dyspnea, reflux, or hernia symptoms can reflect intolerance to intra-abdominal volume or a mechanical complication."
      ],
      interpretation: [
        "Compare prescribed and actual dwell time with fill and drain volume, net ultrafiltration, transport testing, glucose exposure, symptoms, and residual kidney function.",
        "Do not change dwell time or solution strength from one low drain without checking retention, constipation, leaks, catheter flow, intake, and the total pattern."
      ],
      clinicalUse: [
        "Individualize dwell duration and solution through the nephrology prescription to balance solute clearance and fluid removal.",
        "Address mechanical or infectious causes of poor performance instead of repeatedly increasing osmotic strength without assessment."
      ],
      nursing: [
        "Protect the prescribed dwell interval and document interruptions, alarms, bypasses, early drains, and retained volume.",
        "Trend daily weight, blood pressure, edema, lungs, intake and output, glucose, and exchange-by-exchange ultrafiltration.",
        "Escalate cloudy fluid, severe pain, respiratory distress, new leak, genital edema, hernia symptoms, or persistent negative ultrafiltration."
      ],
      consequences: [
        "Inadequate dwell can reduce solute clearance or fluid removal.",
        "Excess glucose exposure can worsen hyperglycemia, weight gain, and membrane injury over time.",
        "Excess intra-abdominal pressure can contribute to leaks, hernia, reflux, and breathing difficulty."
      ],
      pitfalls: [
        "Longer is not always better; the osmotic gradient can dissipate during a long glucose dwell.",
        "Dwell time must be interpreted with membrane transport type and the specific solution."
      ],
      relatedTopics: ["Peritoneal dialysis exchange", "Peritoneal membrane transport", "Peritoneal dialysis adequacy"],
      aliases: ["PD dwell", "dwell time", "peritoneal dialysis dwell time"]
    }),
    concept({
      name: "Peritoneal membrane transport",
      category: "Nephrology - Peritoneal Dialysis",
      parent: peritonealParent,
      definition: "Peritoneal membrane transport describes how quickly solutes and water move between peritoneal capillary blood and dialysis fluid. Patients differ in effective capillary surface area and transport rate, so the same dwell schedule can produce very different clearance and ultrafiltration.",
      mechanism: "A faster transporter equilibrates small solutes quickly but also absorbs glucose quickly, causing the osmotic gradient for water removal to fade sooner. A slower transporter preserves that gradient longer but may need longer dwells for adequate small-solute diffusion.",
      why: [
        "The peritoneal equilibration test compares dialysate and plasma solute relationships over a standardized exchange to characterize transport.",
        "Transport category guides prescription design but does not alone measure total dialysis adequacy, residual kidney function, volume, or symptoms.",
        "Peritonitis and long-term membrane exposure can change transport behavior, so the pattern may evolve."
      ],
      clinicalClues: [
        "Fast transport can present as good early solute equilibration but poor ultrafiltration during long glucose dwells.",
        "Slow transport can present as incomplete small-solute equilibration during short dwells despite preserved osmotic gradient."
      ],
      interpretation: [
        "Interpret standardized transport testing with net ultrafiltration, prescription, recent peritonitis, glucose exposure, residual kidney function, volume status, and symptoms.",
        "Repeat assessment when performance changes substantially after reversible causes and technique problems are evaluated."
      ],
      clinicalUse: [
        "Match dwell length, cycler strategy, solution, and modality to transport pattern and clinical goals under nephrology guidance.",
        "Preserve membrane health through infection prevention, avoidance of unnecessary high-glucose exposure, and timely evaluation of ultrafiltration failure."
      ],
      nursing: [
        "Ensure transport testing follows the prescribed standardized procedure because timing and sampling errors invalidate interpretation.",
        "Track exchange volumes, dwell durations, glucose strengths, peritonitis episodes, weight, blood pressure, edema, and residual urine.",
        "Report a sustained change in ultrafiltration or clearance rather than compensating with unreviewed solution changes."
      ],
      consequences: [
        "A mismatched prescription can cause inadequate clearance or chronic volume overload.",
        "Progressive membrane injury can produce ultrafiltration failure and require a modality change."
      ],
      pitfalls: [
        "A fast transporter is not simply a 'better' membrane; rapid glucose absorption can impair long-dwell fluid removal.",
        "Transport category is not interchangeable with peritoneal dialysis adequacy."
      ],
      relatedTopics: ["Peritoneal equilibration test", "Peritoneal dialysis dwell", "Peritoneal dialysis adequacy"],
      aliases: ["peritoneal transport status", "PD membrane transport", "peritoneal equilibration"]
    }),
    concept({
      name: "Peritoneal dialysis adequacy",
      category: "Nephrology - Peritoneal Dialysis",
      parent: peritonealParent,
      definition: "Peritoneal dialysis adequacy is the degree to which the entire dialysis plan—including peritoneal clearance, residual kidney function, fluid management, nutrition, and treatment experience—controls uremia and supports health. Urea clearance measures such as weekly Kt/V contribute information, but adequacy is not a single laboratory threshold.",
      mechanism: "Total clearance comes from both the peritoneal prescription and remaining kidneys. As residual function declines, the same exchange schedule may no longer control solute, potassium, acid-base balance, or volume. Conversely, a numerical urea target cannot compensate for chronic congestion, poor nutrition, symptoms, or frequent treatment failure.",
      why: [
        "Residual kidney function often contributes disproportionately to fluid and middle-molecule clearance and must be measured and protected.",
        "Collection or timing errors in urine and dialysate volumes can distort calculated clearance.",
        "Adherence, catheter function, transport type, body water estimate, protein intake, infection, and missed exchanges all affect interpretation."
      ],
      clinicalClues: [
        "Possible underdialysis includes anorexia, nausea, pruritus, fatigue, sleep or cognitive change, restless legs, hyperkalemia, acidosis, malnutrition, and volume overload.",
        "Symptoms are nonspecific, so evaluate infection, anemia, cardiac disease, medication effects, depression, sleep disorders, and other causes as well."
      ],
      interpretation: [
        "Review delivered prescription, standardized clearance collections, residual urine and kidney clearance, net ultrafiltration, weight and blood pressure trend, edema, lungs, potassium, bicarbonate, nutrition, symptoms, hospitalizations, and quality of life.",
        "Confirm collection accuracy and delivered exchanges before escalating from one unexpected adequacy result."
      ],
      clinicalUse: [
        "Adjust fill volume, number and duration of exchanges, cycler strategy, solution, or modality with the nephrology team when total clinical adequacy is insufficient.",
        "Treat constipation, catheter dysfunction, infection, adherence barriers, and volume or dietary contributors that prevent the prescription from being delivered effectively."
      ],
      nursing: [
        "Teach and verify accurate timed urine and dialysate collection, labels, storage, total volumes, and exchange records.",
        "Trend symptoms, daily weight, blood pressure, edema, lungs, intake, residual urine, nutrition, exit site, peritonitis, and missed or shortened exchanges.",
        "Escalate refractory hyperkalemia, pulmonary edema, severe uremic symptoms, pericarditis concern, encephalopathy, or inability to perform exchanges."
      ],
      consequences: [
        "Persistent underdialysis can cause uremic complications, malnutrition, hyperkalemia, acidosis, and volume-related cardiovascular injury.",
        "Increasing treatment burden without addressing technique or access barriers can worsen adherence and quality of life."
      ],
      pitfalls: [
        "Adequacy is not synonymous with Kt/V.",
        "Do not ignore residual kidney function or volume status when interpreting peritoneal clearance."
      ],
      relatedTopics: ["Peritoneal dialysis exchange", "Peritoneal membrane transport", "Residual kidney function"],
      aliases: ["PD adequacy", "peritoneal dialysis clearance", "weekly Kt/V in peritoneal dialysis"],
      abbreviations: ["PD adequacy"]
    }),
    concept({
      name: "Renal acid excretion",
      category: "Nephrology - Acid-Base Physiology",
      parent: acidParent,
      definition: "Renal acid excretion is the kidney's removal of the daily nonvolatile acid load while conserving filtered bicarbonate. Hydrogen ions cannot be excreted in large amounts as free acid alone, so they leave mainly buffered as ammonium and titratable acids such as phosphate.",
      mechanism: "Tubules reclaim nearly all filtered bicarbonate, secrete hydrogen ions, generate ammonium from glutamine, and trap ammonium in urine. Each net hydrogen ion excreted with ammonium or titratable buffer adds new bicarbonate to blood, offsetting acids produced by protein metabolism and other cellular processes.",
      why: [
        "The lungs remove volatile acid as carbon dioxide, but the kidneys must handle fixed acids and replace bicarbonate consumed buffering them.",
        "Urine pH measures free hydrogen-ion activity and can be low even when total ammonium excretion is inadequate.",
        "Reduced nephron mass, impaired distal secretion, or reduced ammonium generation produces normal-anion-gap or later high-anion-gap metabolic acidosis depending on the setting."
      ],
      clinicalClues: [
        "Impaired renal acid handling can present with low serum bicarbonate, hyperchloremia, potassium disturbance, bone buffering, muscle catabolism, nephrolithiasis, or growth impairment.",
        "The potassium pattern helps localize renal tubular acidosis: type 4 is typically hyperkalemic, whereas distal and proximal forms are often hypokalemic."
      ],
      interpretation: [
        "Interpret serum electrolytes, anion gap, pH and carbon dioxide, kidney function, potassium, urine pH, urine anion or osmolal gap, medicines, and gastrointestinal losses together.",
        "Use urine ammonium directly when available; surrogate gaps have important failure conditions."
      ],
      clinicalUse: [
        "Treat the cause and replace alkali when clinically indicated, with attention to sodium load, potassium, volume, and kidney function.",
        "Urgent severe acidemia requires stabilization and cause-directed management; a normal-looking urine pH does not make severe systemic acidosis safe."
      ],
      nursing: [
        "Trend mental status, breathing pattern, blood pressure, rhythm, potassium, bicarbonate, pH, creatinine, intake and output, and volume status.",
        "Verify specimen timing and collection quality for urine electrolytes and pH, and document diuretics, alkali, diarrhea, and intravenous fluids that change interpretation.",
        "Escalate severe acidemia, rising potassium, arrhythmia, shock, oliguria, or worsening neurologic status."
      ],
      consequences: [
        "Chronic metabolic acidosis promotes bone mineral loss, muscle protein breakdown, growth impairment, and progression of kidney disease.",
        "Severe acidemia reduces cardiovascular performance and increases arrhythmia and vasopressor resistance."
      ],
      pitfalls: [
        "Urine pH is not the same as net acid excretion.",
        "Bicarbonate reabsorption prevents loss of existing buffer; ammonium and titratable-acid excretion generate new bicarbonate."
      ],
      relatedTopics: ["Bicarbonate regeneration", "Renal ammonium excretion", "Urine anion gap", "Renal tubular acidosis types 1, 2, and 4"],
      aliases: ["net renal acid excretion", "kidney acid excretion", "net acid excretion"]
    }),
    concept({
      name: "Bicarbonate regeneration",
      category: "Nephrology - Acid-Base Physiology",
      parent: acidParent,
      definition: "Bicarbonate regeneration is the production of new bicarbonate that replaces buffer consumed by nonvolatile acid. It is different from reclaiming filtered bicarbonate: reclamation prevents existing bicarbonate from being lost, whereas net acid excretion through ammonium and titratable acid adds bicarbonate back to extracellular fluid.",
      mechanism: "Proximal tubular glutamine metabolism produces ammonium and bicarbonate. The ammonium is ultimately excreted, while the bicarbonate returns to blood. Distal hydrogen secretion buffered by urinary phosphate also permits new bicarbonate generation. The accounting works only when the corresponding acid is actually excreted rather than returned to the body.",
      why: [
        "Every day, metabolism consumes bicarbonate while buffering sulfuric, phosphoric, and other fixed acids.",
        "During acidosis, ammoniagenesis normally increases substantially, allowing more acid to leave without requiring an impossibly low urine pH.",
        "Hyperkalemia suppresses ammonium generation and helps explain the acidosis of type 4 renal tubular acidosis."
      ],
      clinicalClues: [
        "Failure of bicarbonate regeneration contributes to persistent metabolic acidosis in chronic kidney disease and renal tubular disorders.",
        "Chronic acid retention may be present before a dramatic fall in serum bicarbonate because bone and intracellular buffers temporarily compensate."
      ],
      interpretation: [
        "Separate filtered-bicarbonate loss, gastrointestinal bicarbonate loss, reduced ammonium excretion, impaired distal acidification, and addition of unmeasured acids.",
        "Use blood gas, electrolytes, anion gap, potassium, kidney function, urine pH, and ammonium or validated surrogates in context."
      ],
      clinicalUse: [
        "Correct the cause and give individualized alkali when indicated; treatment replaces missing buffer but does not remove an ongoing acid source by itself.",
        "Monitor sodium, potassium, volume, and carbon dioxide generation because bicarbonate therapy can create complications when used indiscriminately."
      ],
      nursing: [
        "Trend bicarbonate rather than reacting to one chemistry value, and correlate with pH, ventilation, potassium, creatinine, diarrhea, fluids, and medications.",
        "Confirm the exact alkali product and dose because sodium bicarbonate, sodium citrate, and potassium citrate have different electrolyte consequences.",
        "Escalate severe acidemia, arrhythmia, hyperkalemia, pulmonary edema, or neurologic deterioration."
      ],
      consequences: [
        "Insufficient regeneration causes chronic or acute metabolic acidosis.",
        "Excess or poorly selected alkali can cause alkalosis, sodium and volume overload, or dangerous potassium change."
      ],
      pitfalls: [
        "Reabsorbing filtered bicarbonate is not the same as generating new bicarbonate.",
        "Giving bicarbonate changes the buffer pool but may not correct shock, ketoacid production, toxin metabolism, renal failure, or diarrhea."
      ],
      relatedTopics: ["Renal acid excretion", "Renal ammonium excretion", "Bicarbonate buffer system"],
      aliases: ["new bicarbonate generation", "renal bicarbonate generation", "bicarbonate replacement physiology"]
    }),
    concept({
      name: "T-type calcium-channel physiology",
      category: "Neurology - Ion Channels and Seizure Physiology",
      parent: thalamicParent,
      sourceKeys: ["w44-ncbi-t-type-epilepsy", "w44-aes-epilepsy-guidance"],
      definition: "T-type calcium channels are low-voltage-activated calcium channels that open transiently after a cell has been hyperpolarized. In thalamic relay neurons, this rebound current can generate burst firing and help organize normal sleep rhythms; excessive synchronized thalamocortical bursting contributes to typical absence seizures.",
      mechanism: "Hyperpolarization removes channel inactivation. When membrane voltage rises again, a brief low-threshold calcium current produces a burst of action potentials. Reciprocal thalamic reticular, relay-neuron, and cortical signaling can synchronize these bursts across both hemispheres.",
      why: [
        "The channel is called T-type because its current is transient and activates at relatively low voltage.",
        "T-type activity is physiologic in rhythmic sleep circuitry; disease reflects inappropriate network synchronization rather than the mere presence of the channel.",
        "Reducing thalamic T-type current is one mechanism by which ethosuximide suppresses typical absence seizures."
      ],
      clinicalClues: [
        "Typical absence seizures cause brief impaired awareness with generalized spike-and-wave activity and little or no postictal confusion.",
        "Focal staring, prolonged confusion, loss of tone, myoclonus, or atypical electroencephalography requires a broader seizure classification."
      ],
      interpretation: [
        "Use seizure semiology and electroencephalography to classify the clinical syndrome; channel physiology alone is not a bedside diagnostic test.",
        "Review age, developmental history, medication exposure, metabolic triggers, and EEG pattern before assigning typical absence epilepsy."
      ],
      clinicalUse: [
        "Select antiseizure therapy from the diagnosed seizure syndrome, comorbidities, pregnancy potential, interactions, and safety profile—not from an isolated channel label.",
        "Avoid drugs known to aggravate typical absence seizures when the diagnosis is established."
      ],
      nursing: [
        "Document event duration, responsiveness, automatisms, motor features, recovery, frequency, injury risk, and medication adherence.",
        "Monitor ordered blood counts, liver tests, mood, pregnancy precautions, and drug-specific adverse effects.",
        "Escalate prolonged or repeated seizures without recovery, injury, respiratory compromise, or a new focal neurologic deficit."
      ],
      consequences: [
        "Frequent unrecognized absence seizures can impair learning, safety, and daily function.",
        "Misclassifying focal or atypical events can delay correct investigation and treatment."
      ],
      pitfalls: [
        "T-type calcium channels are not the same as cardiac L-type calcium channels.",
        "A mechanism associated with absence seizures does not mean every staring episode is caused by T-type channel dysfunction."
      ],
      relatedTopics: ["Thalamocortical oscillation", "Absence seizure", "Ethosuximide"],
      aliases: ["T type calcium channel", "low-voltage-activated calcium channel", "Cav3 channel physiology"],
      abbreviations: ["T-type Ca2+ channel"]
    }),
    concept({
      name: "Thalamocortical oscillation",
      category: "Neurology - Network Physiology",
      parent: thalamicParent,
      sourceKeys: ["w44-ncbi-t-type-epilepsy", "w44-aes-epilepsy-guidance"],
      definition: "A thalamocortical oscillation is rhythmic activity generated by interacting thalamic relay neurons, the thalamic reticular nucleus, and cerebral cortex. These loops help organize sleep spindles and other normal rhythms, but pathologic hypersynchrony can produce generalized spike-and-wave discharges and impaired awareness.",
      mechanism: "Inhibitory reticular input hyperpolarizes relay neurons, low-threshold calcium currents permit rebound bursts, and excitatory corticothalamic feedback recruits a wider network. Timing and receptor balance determine whether the rhythm remains physiologic or becomes a seizure discharge.",
      why: [
        "The thalamus and cortex form a reciprocal loop rather than a one-way relay.",
        "Synchronized oscillation can interrupt normal information processing even without a convulsion.",
        "Normal sleep rhythms and absence seizures share circuit elements but differ in network state, frequency, and clinical effect."
      ],
      clinicalClues: [
        "Generalized spike-and-wave activity with abrupt brief impaired awareness supports an absence network syndrome.",
        "EEG rhythms without a matching clinical event, or clinical events without the expected EEG pattern, require expert interpretation."
      ],
      interpretation: [
        "Interpret EEG timing, morphology, activation by hyperventilation or sleep, clinical responsiveness, and video together.",
        "Do not localize a generalized thalamocortical discharge to one structural thalamic lesion without additional evidence."
      ],
      clinicalUse: [
        "Use network physiology to understand seizure classification and why certain medicines help or aggravate generalized seizure types.",
        "Treat the diagnosed epilepsy syndrome and underlying cause when present rather than the word 'oscillation' itself."
      ],
      nursing: [
        "During EEG activation procedures, follow safety protocols and observe for impaired awareness or generalized seizure activity.",
        "Teach families to record brief staring frequency and safety consequences because events may be mistaken for inattention.",
        "Escalate status epilepticus, injury, respiratory compromise, pregnancy-related seizure change, or a new focal deficit."
      ],
      consequences: [
        "Frequent generalized discharges can impair attention and learning.",
        "Wrong seizure classification can lead to ineffective or aggravating therapy."
      ],
      pitfalls: [
        "Thalamocortical oscillation is a network mechanism, not a diagnosis by itself.",
        "Normal sleep spindles are not absence seizures."
      ],
      relatedTopics: ["T-type calcium-channel physiology", "Electroencephalography", "Absence seizure"],
      aliases: ["thalamocortical rhythm", "thalamocortical synchrony", "spike-and-wave network"]
    }),
    concept({
      name: "Urine anion gap",
      category: "Laboratory Medicine - Renal Acid-Base Tests",
      parent: urineParent,
      definition: "The urine anion gap is a calculated surrogate for urinary ammonium excretion, usually urine sodium plus urine potassium minus urine chloride. It is most useful in selected patients with a normal-anion-gap metabolic acidosis when direct urine ammonium is unavailable.",
      mechanism: "Ammonium is excreted with an anion, commonly chloride. Because routine urine electrolyte panels do not measure ammonium, a strongly negative gap can indicate abundant unmeasured ammonium paired with chloride, while a positive or minimally negative gap can suggest impaired ammonium excretion. The inference fails when ammonium is paired with other unmeasured anions.",
      why: [
        "Appropriate renal response to diarrhea-related bicarbonate loss is increased ammonium chloride excretion, often making the gap negative.",
        "Renal tubular acidosis can limit ammonium excretion, leaving the gap positive or insufficiently negative.",
        "Ketoanions, hippurate after toluene exposure, bicarbonaturia, unusual urinary salts, very low urine sodium, and advanced kidney disease can break the simple chloride-based inference."
      ],
      clinicalClues: [
        "Use only after confirming a real metabolic acidosis and determining that the serum anion gap is normal or only appropriately changed.",
        "Diarrhea and renal tubular acidosis may produce similar serum hyperchloremia but different renal ammonium responses."
      ],
      interpretation: [
        "Calculate UAG = urine sodium + urine potassium - urine chloride, using values from the same appropriately timed sample.",
        "A negative value generally supports increased ammonium chloride excretion; a positive value suggests reduced ammonium excretion only when the clinical assumptions are met.",
        "Prefer direct urine ammonium or consider the urine osmolal gap when the result conflicts with physiology or unusual urinary anions are likely."
      ],
      clinicalUse: [
        "Use the result to narrow gastrointestinal bicarbonate loss versus impaired renal acid excretion, then confirm the specific cause with potassium, urine pH, kidney function, medications, and history.",
        "Treat the underlying acid-base disorder rather than treating the calculated gap."
      ],
      nursing: [
        "Collect sodium, potassium, and chloride from the same urine specimen and document timing, diuretics, intravenous fluids, alkali, vomiting, diarrhea, and toxin concern.",
        "Trend serum pH or bicarbonate, anion gap, potassium, creatinine, volume, mental status, and rhythm while the cause is evaluated.",
        "Urgently escalate severe acidemia, hyperkalemia, shock, oliguria, arrhythmia, or suspected toxic exposure."
      ],
      consequences: [
        "Misuse can falsely label diarrhea as renal tubular acidosis or miss impaired renal ammonium excretion.",
        "Delayed cause recognition can prolong dangerous potassium and pH abnormalities."
      ],
      pitfalls: [
        "The urine anion gap is not the serum anion gap and does not detect all unmeasured urinary ions.",
        "A positive result is not diagnostic of renal tubular acidosis without the correct acid-base context.",
        "The calculation estimates ammonium indirectly; it does not measure ammonium."
      ],
      relatedTopics: ["Renal ammonium excretion", "Urine osmolal gap", "Normal anion gap metabolic acidosis"],
      aliases: ["urinary anion gap", "UAG", "urine Na plus K minus Cl"],
      abbreviations: ["UAG"]
    }),
    concept({
      name: "Renal ammonium excretion",
      category: "Nephrology - Acid-Base Physiology",
      parent: urineParent,
      definition: "Renal ammonium excretion is the kidney's adaptable pathway for removing a large fraction of the daily acid load. Proximal tubular cells metabolize glutamine to ammonium and new bicarbonate; ammonium is then handled through the nephron and trapped in final urine, allowing acid excretion without driving free urine pH to an impossible level.",
      mechanism: "Ammonium enters tubular fluid, participates in medullary recycling, and can dissociate to ammonia, which diffuses into the collecting duct and accepts secreted hydrogen to become trapped ammonium. Acidosis normally increases ammoniagenesis, while hyperkalemia, reduced nephron mass, and selected tubular disorders can blunt it.",
      why: [
        "Ammonium provides buffer capacity, so total acid excretion can rise dramatically even though urine pH changes modestly.",
        "Excreting ammonium generated from glutamine adds new bicarbonate to blood and replaces bicarbonate consumed buffering fixed acid.",
        "Hyperkalemia suppresses proximal ammonium production and medullary handling, linking type 4 renal tubular acidosis to a reduced ammonium response."
      ],
      clinicalClues: [
        "An inadequate ammonium response contributes to hyperchloremic metabolic acidosis in type 4 renal tubular acidosis and tubulointerstitial or advanced kidney disease.",
        "A low urine pH does not guarantee adequate ammonium excretion."
      ],
      interpretation: [
        "Measure urine ammonium directly when available or use urine anion and osmolal gaps cautiously as surrogates.",
        "Interpret with systemic pH, bicarbonate, serum anion gap, potassium, kidney function, urine pH, volume, medicines, and gastrointestinal losses."
      ],
      clinicalUse: [
        "Correct the cause of impaired acid excretion and manage potassium because hyperkalemia and acidosis reinforce each other in type 4 physiology.",
        "Use alkali and other therapy only under an individualized plan that accounts for sodium, potassium, volume, and kidney function."
      ],
      nursing: [
        "Trend potassium, bicarbonate, pH, creatinine, rhythm, blood pressure, intake and output, and medications that suppress the renin-aldosterone axis or potassium excretion.",
        "Verify urine-sample timing and all values used in surrogate calculations.",
        "Escalate rising potassium, ECG change, severe acidemia, oliguria, shock, or progressive weakness."
      ],
      consequences: [
        "Reduced ammonium excretion causes persistent metabolic acidosis and can worsen hyperkalemia.",
        "Chronic acidosis contributes to bone disease, muscle catabolism, and kidney disease progression."
      ],
      pitfalls: [
        "Urine pH measures free hydrogen activity, not total ammonium or total acid excretion.",
        "A urine anion gap is a context-dependent surrogate, not a direct ammonium assay."
      ],
      relatedTopics: ["Urine anion gap", "Renal acid excretion", "Bicarbonate regeneration", "Type 4 renal tubular acidosis"],
      aliases: ["urinary ammonium excretion", "renal ammoniagenesis", "ammonium response"],
      abbreviations: ["NH4+ excretion"]
    }),
    concept({
      name: "Wearing-off phenomenon",
      category: "Neurology - Parkinson Disease Complications",
      parent: parkinsonParent,
      sourceKeys: ["w44-aan-parkinson-dopaminergic", "w44-parkinson-foundation-off-time", "w44-nice-parkinson-disease"],
      definition: "Wearing-off is a generally predictable return of Parkinson motor or nonmotor symptoms before the next scheduled dopaminergic dose. It develops as disease progression reduces the brain's ability to buffer short changes in levodopa concentration, so benefit tracks the dosing interval more closely.",
      mechanism: "Early in Parkinson disease, surviving dopaminergic terminals store and release dopamine, smoothing plasma levodopa fluctuations. As that reserve declines, the clinical response becomes more dependent on each dose's absorption and duration. Delayed gastric emptying, dietary protein competition, constipation, missed doses, and interacting medicines can further shorten or delay benefit.",
      why: [
        "Symptoms recur in a recognizable end-of-dose pattern rather than at random.",
        "Both motor symptoms—slowness, rigidity, tremor, gait difficulty—and nonmotor symptoms such as anxiety, pain, sweating, or cognitive slowing can wear off.",
        "A diary relating dose time, meals, onset, benefit, dyskinesia, and symptom return reveals the pattern better than one clinic examination."
      ],
      clinicalClues: [
        "Benefit starts after a dose, lasts for a fairly consistent interval, and fades before the next dose.",
        "Dose failure or delayed-on can mimic wearing-off but suggests an absorption, timing, or administration problem."
      ],
      interpretation: [
        "Review an exact medication and symptom diary, adherence, meal protein timing, constipation, gastric symptoms, formulation, interactions, sleep, infection, and orthostatic blood pressure.",
        "Distinguish wearing-off from dyskinesia, freezing, anxiety alone, deconditioning, and an abrupt global decline caused by infection or medication interruption."
      ],
      clinicalUse: [
        "The neurology team may adjust dose timing or formulation or add an adjunct that prolongs dopaminergic effect; changes must balance additional on-time against dyskinesia, hallucination, hypotension, sleepiness, and impulse-control risk.",
        "Address constipation, delayed gastric emptying, adherence, and meal timing when these reduce reliable levodopa delivery."
      ],
      nursing: [
        "Administer levodopa on time; hospital delays can cause immobility, aspiration risk, falls, and severe withdrawal syndromes.",
        "Document dose, meal, on, off, dyskinesia, gait, swallowing, cognition, orthostasis, sleepiness, hallucinations, and falls.",
        "Do not abruptly stop dopaminergic therapy; urgently escalate severe rigidity, fever, autonomic instability, reduced consciousness, aspiration, or inability to take medication."
      ],
      consequences: [
        "Falls, freezing, aspiration, pain, anxiety, loss of independence, and unpredictable care needs",
        "Excess medication adjustment can trade off-time for troublesome dyskinesia, psychosis, hypotension, or sleep attacks"
      ],
      pitfalls: [
        "Wearing-off is predictably related to dose duration; the on-off phenomenon is less predictably tied to dose timing.",
        "A late hospital dose is a medication-safety problem, not an acceptable scheduling variation."
      ],
      relatedTopics: ["On-off phenomenon", "Parkinson disease", "Levodopa and carbidopa", "Dyskinesia"],
      aliases: ["end-of-dose wearing off", "levodopa wearing off", "end of dose deterioration", "off before next dose"]
    }),
    concept({
      name: "On-off phenomenon",
      category: "Neurology - Parkinson Disease Complications",
      parent: parkinsonParent,
      sourceKeys: ["w44-aan-parkinson-dopaminergic", "w44-parkinson-foundation-off-time", "w44-nice-parkinson-disease"],
      definition: "The on-off phenomenon is an abrupt fluctuation between better mobility during an 'on' state and marked bradykinesia, rigidity, or freezing during an 'off' state that can become poorly predictable from levodopa dose timing. It is a motor complication of more advanced Parkinson disease and differs from simple end-of-dose wearing-off.",
      mechanism: "Progressive loss of dopamine storage makes the motor system sensitive to small changes in brain levodopa delivery, while altered basal-ganglia signaling narrows the therapeutic window. Absorption variability, gastric emptying, dietary competition, stress, and activity can add unpredictability, but some transitions occur despite apparently stable dosing.",
      why: [
        "An on state may permit movement but can include dyskinesia; an off state can abruptly impair gait, speech, swallowing, dexterity, breathing comfort, mood, or pain.",
        "Because transitions are not always dose-predictable, a time-stamped diary and direct observation are essential.",
        "Treatment aims to smooth dopaminergic stimulation while avoiding hallucination, hypotension, impulse-control problems, excessive sleepiness, and dyskinesia."
      ],
      clinicalClues: [
        "Sudden freezing or severe slowness can occur despite a recently effective dose and may later reverse.",
        "A new sustained decline, fever, delirium, focal deficit, or syncope is not assumed to be an off state."
      ],
      interpretation: [
        "Record exact medication, meal, sleep, activity, on and off timing, dyskinesia, orthostatic symptoms, hallucinations, cognition, and falls.",
        "Differentiate off episodes from seizure, transient ischemia, syncope, medication sedation, hypotension, freezing in a specific environment, infection, and structural neurologic change."
      ],
      clinicalUse: [
        "Neurology may use formulation and schedule changes, adjunctive medicines, rescue therapy, infusion strategies, or device-aided therapy after individualized assessment.",
        "Rehabilitation, cueing, fall prevention, swallowing plans, and caregiver preparation remain important even when medicines are optimized."
      ],
      nursing: [
        "Give time-critical Parkinson medicines at the patient's individualized times and never substitute a hospital default schedule without review.",
        "During off periods, protect from falls, allow extra response time, assess swallowing before oral intake, and use the patient's established cueing or rescue plan.",
        "Urgently evaluate an atypical or prolonged episode, new focal deficit, loss of consciousness, aspiration, chest symptoms, injury, fever with severe rigidity, or inability to take medication."
      ],
      consequences: [
        "Falls, immobility, aspiration, panic, pain, caregiver burden, and loss of independence",
        "Overcorrection can produce dyskinesia, hallucinations, hypotension, sleep attacks, or impulsive behavior"
      ],
      pitfalls: [
        "On-off fluctuations are not the same as bipolar mood episodes.",
        "Do not label every abrupt decline as Parkinson off-time; rule out stroke, infection, syncope, injury, and medication toxicity when the pattern is atypical."
      ],
      relatedTopics: ["Wearing-off phenomenon", "Parkinson disease", "Levodopa and carbidopa", "Freezing of gait"],
      aliases: ["on off motor fluctuations", "unpredictable off episodes", "Parkinson on-off fluctuations"]
    })
  ];

  const application = [];
  cards.forEach((card) => {
    const key = normalize(card.name);
    const prior = database.diseases.filter((entry) => normalize(entry && (entry.name || entry.displayName)) === key);
    database.diseases = database.diseases.filter((entry) => normalize(entry && (entry.name || entry.displayName)) !== key);
    database.diseases.push({ ...card });
    application.push({
      name: card.name,
      priorMatchCount: prior.length,
      action: prior.length ? "replaced-completely" : "added-standalone",
      parent: card.componentParent,
      sourceKeys: card.sourceKeys.slice()
    });
  });

  database.diseases.sort((left, right) => String(left && left.name || "").localeCompare(String(right && right.name || "")));
  database.diseaseCount = database.diseases.length;
  if (!String(database.version || "").includes(VERSION)) {
    database.version = [database.version, VERSION].filter(Boolean).join("+");
  }

  window.ANI_CLINICAL_FRONTIER_WAVE44_COMPONENT_PARITY_P2 = {
    schemaVersion: 1,
    version: VERSION,
    generatedAt: GENERATED_AT,
    priority: "P2",
    cardCount: cards.length,
    cardNames: cards.map((card) => card.name),
    sourceStrategy: "uses locally registered topic-specific sources for pain, absence-network physiology, and Parkinson motor fluctuations; other cards inherit registered sourceKeys from their combined owner card",
    registeredSourceKeys: sourceReferences.map((source) => source.key),
    application
  };
}());
