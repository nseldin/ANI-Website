/* eslint-disable */
/* Wave 42: mechanism-first foundation, monitoring, and palliative-assessment references. */
(function () {
  "use strict";

  const VERSION = "2026-08-12-wave42-foundations-diagnostics-2";
  const GLOBAL_NAME = "ANI_FOUNDATIONS_WAVE42_FOUNDATIONS_DIAGNOSTICS";
  if (window[GLOBAL_NAME] && window[GLOBAL_NAME].version === VERSION) return;

  const SOURCE_NOTE = "These mechanism-first educational references follow the cited respiratory-monitoring, coronary-anatomy, coronary-physiology, and palliative-performance sources. They explain clinical reasoning and nursing priorities but do not replace current orders, local monitoring protocols, emergency pathways, or an authorized copy of a copyrighted assessment instrument.";
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

  const localSourceReferences = Object.freeze([
    {
      key: "w42-aarc-capnography-2011",
      label: "American Association for Respiratory Care: Capnography/Capnometry During Mechanical Ventilation Clinical Practice Guideline",
      url: "https://www.aarc.org/wp-content/uploads/2014/08/04.11.0503.pdf",
      note: "Supports capnography terminology, waveform monitoring, artificial-airway confirmation, ventilation and perfusion interpretation, equipment checks, transport monitoring, limitations, and clinical safety."
    },
    {
      key: "w42-aha-adult-als-2025",
      label: "American Heart Association: 2025 Adult Advanced Life Support Guidelines",
      url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support/",
      note: "Supports continuous waveform capnography for confirming and monitoring an endotracheal tube during cardiac arrest, interpretation during CPR, and the warning that end-tidal carbon dioxide must not be used alone to terminate resuscitation."
    },
    {
      key: "w42-ncbi-coronary-physiology",
      label: "NCBI Bookshelf: Physiology, Coronary Circulation",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK482413/",
      note: "Supports coronary perfusion timing, high myocardial oxygen extraction, metabolic flow regulation, supply-demand matching, tachycardia effects, ischemia, and clinical testing connections."
    },
    {
      key: "w42-ncbi-coronary-anatomy",
      label: "NCBI Bookshelf: Anatomy, Thorax, Heart Arteries",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK470522/",
      note: "Supports the origins, major branches, territories, anatomic variation, coronary dominance, and clinical significance of coronary arterial anatomy."
    },
    {
      key: "w42-coronary-flow-regulation-review",
      label: "Comprehensive Physiology: Regulation of Coronary Blood Flow",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5966026/",
      note: "Supports the integrated metabolic, myogenic, endothelial, neural, and mechanical regulation of coronary resistance and myocardial oxygen delivery."
    },
    {
      key: "w42-victoria-hospice-ppsv2",
      label: "Victoria Hospice: Palliative Performance Scale Version 2",
      url: "https://victoriahospice.org/wp-content/uploads/2019/12/PPSv2-English-Sample.pdf",
      note: "Identifies the official copyrighted PPSv2 instrument, its intended performance-status domains, and the need to use an authorized current form rather than a reconstructed scoring table."
    },
    {
      key: "w42-victoria-hospice-ppsv2-instructions",
      label: "Victoria Hospice: PPSv2 Questions and Answers, Instructions, and Definitions",
      url: "https://victoriahospice.org/wp-content/uploads/2020/08/PPSv2-QA-Instructions-and-Definitions-updated-July-2020.pdf",
      note: "Supports official scoring principles, definitions, training cautions, copyright and licensing information, and consistent use of the authorized PPSv2 instrument."
    },
    {
      key: "w42-pps-reliability-validity-2008",
      label: "Ho et al.: A Reliability and Validity Study of the Palliative Performance Scale",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2527603/",
      note: "Supports PPS reliability, content validity, communication value, monitoring and care-planning uses, and the importance of trained, consistent raters."
    }
  ]);

  const database = window.ANI_FOUNDATIONS_DATABASE && typeof window.ANI_FOUNDATIONS_DATABASE === "object"
    ? window.ANI_FOUNDATIONS_DATABASE
    : { entries: [], sourceReferences: [] };
  if (!Array.isArray(database.entries)) database.entries = [];
  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];

  const sourceIndex = new Map(database.sourceReferences
    .filter((reference) => reference && reference.key)
    .map((reference, index) => [String(reference.key), index]));
  localSourceReferences.forEach((reference) => {
    const existingIndex = sourceIndex.get(reference.key);
    if (Number.isInteger(existingIndex)) database.sourceReferences[existingIndex] = { ...reference };
    else {
      sourceIndex.set(reference.key, database.sourceReferences.length);
      database.sourceReferences.push({ ...reference });
    }
  });
  const sourceByKey = new Map(database.sourceReferences.map((reference) => [String(reference.key), reference]));
  const sourceNoteFor = (keys) => unique(keys).map((key) => {
    const source = sourceByKey.get(key);
    if (!source) throw new Error("Unknown Wave42 foundations/diagnostics source key: " + key);
    return source.label + " (" + source.url + ")";
  }).join("; ");

  const article = (spec) => {
    const sourceKeys = unique(spec.sourceKeys || []);
    return {
      icon: spec.icon || "Clinical",
      nclexEssential: true,
      educationalArticle: true,
      sourceNote: SOURCE_NOTE,
      ...spec,
      aliases: unique(spec.aliases || []),
      abbreviations: unique(spec.abbreviations || []),
      commonMisspellings: unique(spec.commonMisspellings || []),
      relatedTopics: unique(spec.relatedTopics || []),
      tags: unique(["wave42", "offline clinical reference", "mechanism first", "clinical reasoning", ...(spec.tags || [])]),
      sourceKeys,
      evidenceNote: "Evidence anchors: " + sourceNoteFor(sourceKeys),
      wave42FoundationsDiagnosticsRevision: VERSION
    };
  };

  const entries = [
    article({
      name: "Capnography and end-tidal carbon dioxide monitoring",
      fullForm: "Continuous waveform capnography and end-tidal carbon dioxide monitoring",
      displayName: "Capnography and end-tidal carbon dioxide monitoring",
      type: "diagnostic-test",
      diagnosticKind: "physiologic-monitoring",
      icon: "ETCO2",
      category: "Diagnostics and Tests / Respiratory Monitoring / Ventilation and Perfusion",
      aliases: [
        "capnography", "capnogram", "capnometry", "end tidal carbon dioxide", "end-tidal carbon dioxide", "end tidal CO2", "end-tidal CO2", "ETCO2 monitoring", "EtCO2", "PETCO2", "waveform capnography", "continuous capnography", "quantitative waveform capnography", "exhaled CO2 monitoring", "expired carbon dioxide monitoring", "CO2 waveform", "carbon dioxide tracing", "nasal capnography", "sidestream capnography", "mainstream capnography", "shark fin capnogram", "capnography during CPR", "capnography during sedation", "confirm endotracheal tube with CO2", "how to interpret ETCO2", "why ETCO2 is low", "why ETCO2 is high", "sudden loss of ETCO2 waveform"
      ],
      abbreviations: ["ETCO2", "EtCO2", "PETCO2", "PaCO2", "CO2", "ROSC", "ETT"],
      commonMisspellings: ["capnogrophy", "capnograpy", "capnogaphy", "capnomitry", "end title CO2", "end tidal C02", "etco 2", "et c o 2", "capnogramm"],
      summary: "Capnography continuously displays carbon dioxide across exhalation and inhalation, while end-tidal carbon dioxide is the concentration or partial pressure measured near the end of exhalation. The waveform shows much more than a number: it can reveal whether exhaled gas is reaching the sensor, whether an advanced airway remains in the trachea, how ventilation is changing, whether exhalation is obstructed, whether rebreathing or equipment failure is occurring, and how pulmonary blood flow changes during shock or resuscitation. Carbon dioxide must travel from cellular metabolism through venous blood, the right heart, pulmonary circulation, alveoli, airway, and sampling device before it appears on the screen. A change can therefore reflect metabolism, circulation, ventilation, airway mechanics, or technology. Safe interpretation starts with the patient and waveform, then asks which link in that chain changed.",
      quickAnswer: "ETCO2 is not a direct substitute for an arterial PaCO2 and is not merely a respiratory-rate monitor. A sustained waveform after intubation strongly supports tracheal placement, and continuous monitoring can reveal later displacement or disconnection. Rising ETCO2 usually means less ventilation or more delivered CO2, while falling ETCO2 can reflect more ventilation, less pulmonary blood flow, increased dead space, leak, disconnection, obstruction, or loss of the airway. During CPR it largely tracks pulmonary blood flow generated by compressions when ventilation is controlled; an abrupt sustained rise can signal return of spontaneous circulation. A very low value during arrest must never be used alone to stop resuscitation. If the waveform suddenly disappears, assess the patient, ventilate as needed, and check the entire airway and sampling system immediately rather than assuming the monitor failed.",
      resultMeanings: [
        ["Stable waveform with a plausible value", "Exhaled gas is consistently reaching the sensor. Interpret ventilation, perfusion, airway mechanics, patient baseline, and the PaCO2-ETCO2 relationship rather than calling one number normal for every setting."],
        ["Progressively rising ETCO2", "Consider hypoventilation, increasing metabolic CO2 production, rebreathing, fever or shivering, bicarbonate-related CO2 generation, improving pulmonary blood flow, or recovery from severe hyperventilation. Check respiratory effort, rate, tidal ventilation, equipment, temperature, circulation, and sedation."],
        ["Progressively falling ETCO2", "Consider increasing ventilation, falling cardiac output, pulmonary embolic or other dead-space physiology, worsening shock, leak, partial obstruction, sampling dilution, or declining metabolic production. A falling value is not automatically successful ventilation."],
        ["Abrupt waveform loss or near-zero value", "Treat as an airway or circuit emergency until proven otherwise: disconnection, apnea, extubation, esophageal placement, complete obstruction, severe leak, cardiac arrest or profound loss of pulmonary flow, or blocked sampling tubing can all cause this pattern."],
        ["Abnormal waveform shape", "The contour may identify obstructed exhalation, rebreathing, spontaneous effort, leak, secretions, valve or circuit malfunction, or sampling artifact. Confirm the pattern over several breaths and connect it to the bedside examination before naming the cause."]
      ],
      sections: [
        { label: "What is measured and how the signal is created", text: "Cells generate carbon dioxide during aerobic metabolism. Venous blood carries it to the right heart and pulmonary capillaries, it diffuses into ventilated alveoli, and exhalation carries it past the sensor. Capnometry reports a numerical CO2 value; capnography displays the value over time as a waveform. Mainstream systems place the sensor in the airway circuit, while sidestream systems draw a small gas sample through tubing to a remote analyzer. Nasal sampling can monitor spontaneously breathing patients, often while also delivering oxygen. Each design has tradeoffs involving response time, added airway weight or dead space, condensation, secretion blockage, leaks, oxygen dilution, and calibration. The displayed value is therefore a physiologic measurement produced through a device, not a device-independent truth." },
        { label: "Normal capnogram phases and why shape matters", text: "At the inspiratory baseline, little or no CO2 should reach the sensor. Early exhalation contains gas from conducting airways with little alveolar CO2. The rapid upstroke appears as alveolar gas mixes into the sample, followed by an alveolar plateau whose end is the ETCO2 value. Inspiration then drives the tracing back toward baseline. A repeating rectangular contour suggests relatively unobstructed emptying and a stable sample. A slanted, prolonged expiratory upstroke and plateau can occur when different lung units empty at different speeds, as in airflow obstruction. Failure to return to baseline suggests rebreathing or an expiratory-system problem. A shape change can be clinically important even before the numerical value crosses an alarm." },
        { label: "ETCO2 versus arterial PaCO2", text: "PaCO2 measures carbon dioxide in arterial blood, whereas ETCO2 samples gas at the airway opening near end exhalation. In a healthy lung, ETCO2 is often slightly lower than PaCO2 because some exhaled gas comes from ventilated regions that received less perfusion. The gap widens when physiologic dead space increases, including pulmonary embolic disease, severe low-flow states, emphysema, or uneven ventilation-perfusion matching. A small or changing gradient cannot be assumed in critical illness. Airway leaks, small tidal volumes, rapid breathing, supplemental oxygen near a nasal sampler, and delayed sidestream response can distort ETCO2. Use an arterial or venous blood gas when the clinical question requires blood pH or a reliable PaCO2 rather than converting ETCO2 with a memorized subtraction." },
        { label: "Ventilation, metabolism, and perfusion relationships", text: "Alveolar ventilation removes CO2, so reduced effective ventilation tends to raise PaCO2 and ETCO2 when pulmonary perfusion is maintained; increased ventilation tends to lower them. Metabolic production rises with fever, shivering, seizures, exertion, or selected drug and treatment effects. Perfusion determines whether venous CO2 reaches ventilated alveoli. When cardiac output abruptly falls, ETCO2 may fall even though tissue CO2 production continues and arterial CO2 may not fall. This is why a low ETCO2 in shock can represent poor pulmonary blood flow rather than overventilation. Conversely, improving perfusion can raise ETCO2 without a decline in ventilation. Interpret the direction by checking respiratory rate and depth, airway pressure, circulation, temperature, activity, and interventions together." },
        { label: "Advanced airway confirmation and continuous surveillance", text: "Continuous waveform capnography is a central method for confirming and monitoring an endotracheal tube during cardiac arrest because sustained exhaled CO2 is expected from a tracheal airway when pulmonary blood flow is present. Direct visualization, chest movement, bilateral breath sounds, tube depth, oxygenation, and imaging when indicated remain part of the assessment. A transient reading can occur from gas in the stomach or after recent ventilation, while profoundly low pulmonary flow can make CO2 difficult to detect despite tracheal placement. After confirmation, the waveform provides ongoing surveillance for displacement, disconnection, obstruction, apnea, or circuit failure. Every transfer, turn, transport, procedure, and change in ventilation is a time to recheck tube depth, patient findings, and the waveform rather than relying on an earlier confirmation." },
        { label: "CPR, cardiac output, and return of circulation", text: "During cardiac arrest with a secured airway and reasonably controlled ventilation, exhaled CO2 delivery depends heavily on pulmonary blood flow created by chest compressions. ETCO2 trends can therefore help the team recognize compression-quality changes, interruptions, fatigue, excessive ventilation, or an abrupt circulation change. A sustained sudden increase can accompany return of spontaneous circulation and should prompt pulse and rhythm assessment without unnecessary compression interruption. Epinephrine, bicarbonate, ventilation changes, airway leak, cause of arrest, and measurement quality also alter the value. Current AHA guidance permits a persistently very low ETCO2 after prolonged ALS in an intubated adult to contribute to a multimodal termination decision, but explicitly rejects using it in isolation. It is not a universal futility threshold, especially in nonintubated patients or potentially reversible states." },
        { label: "Procedural sedation and spontaneous breathing", text: "Capnography can reveal hypoventilation, apnea, or obstruction before oxygen saturation falls, especially when supplemental oxygen delays desaturation. A nasal waveform that becomes smaller, irregular, or absent may reflect shallow breathing, mouth breathing, cannula displacement, obstruction, apnea, or dilution rather than one single diagnosis. Assess chest and abdominal movement, airway sound, responsiveness, respiratory effort, pulse, oxygen saturation, medication timing, and sampling position. Stimulation, airway repositioning, assisted ventilation, reversal medication, or emergency activation follows the clinical state and local sedation protocol. A normal oxygen saturation does not prove adequate ventilation, and a present capnogram does not prove the airway will remain safe after additional sedative or opioid effect." },
        { label: "Waveform patterns and common causes", text: "A prolonged sloping expiratory contour commonly reflects airflow obstruction but can also be shaped by partial tube obstruction, secretions, a kink, bronchospasm, or circuit resistance. A rising inspiratory baseline suggests inspired CO2 from rebreathing, inadequate fresh gas flow, exhausted absorbent, or a faulty expiratory valve in an applicable circuit. Small notches in the plateau may reflect spontaneous respiratory effort or cardiogenic movement, but artifact and ventilator interaction must be considered. Alternating waveforms can occur with uneven ventilation or sampling problems. A steadily shrinking tracing may precede complete disconnection or worsening low flow. Pattern labels are clues, not diagnoses; inspect the patient and equipment from airway to sensor." },
        { label: "Assessment and troubleshooting sequence", text: "When the value or waveform changes, first look at the patient: responsiveness, airway patency, breathing effort, chest rise, color, pulse, perfusion, and hemodynamic state. Call for help and provide oxygenation or ventilation support as indicated. Then trace the system from the patient outward: tube or airway position and depth, bite or kink, secretions, cuff and leak, connections, valves, circuit, water trap, sampling cannula, tubing, filter, sensor, calibration, and power. Compare ventilator volumes and pressures, auscultate, and check for new pneumothorax or bronchospasm when the presentation supports it. If the clinical picture and ETCO2 disagree, obtain the appropriate blood gas or imaging rather than repeatedly silencing an alarm." },
        { label: "Nursing priorities, documentation, and trending", text: "Document the monitoring method, airway type, oxygen or ventilator support, respiratory rate, ETCO2 value and waveform quality, alarm limits, relevant PaCO2, blood pressure and perfusion, sedation and analgesia, position, intervention, and response. Trend direction and morphology rather than charting only a spot number. Before transport or repositioning, secure the airway and sampling line and verify emergency equipment. After suctioning, bronchodilator therapy, ventilation change, fluid or vasoactive intervention, or resuscitation event, reassess the waveform and the patient. Escalate repeated alarms with context: 'ETCO2 fell from the patient's stable trend, waveform amplitude is shrinking, pressure is falling, and pulses are weak' is more actionable than 'capnography abnormal.'" },
        { label: "Urgent red flags", text: "Act immediately for absent breathing, loss of consciousness, central cyanosis, inability to ventilate, sudden waveform disappearance after intubation, rapidly falling ETCO2 with hypotension or weak pulses, rising ETCO2 with decreasing responsiveness or very slow breathing, severe obstructive waveform with silent chest or exhaustion, or abrupt change during transport or turning. Consider displacement, disconnection, complete obstruction, tension pneumothorax, severe bronchospasm, pulmonary embolic obstruction, profound shock, or cardiac arrest according to the whole presentation. Do not wait for oxygen saturation to fall before treating obvious apnea or airway loss, because supplemental oxygen can preserve saturation temporarily while CO2 rises and ventilation fails." },
        { label: "Limitations and common misconceptions", text: "ETCO2 does not equal PaCO2, measure oxygenation, identify the cause of hypercapnia, or independently prove adequate tissue perfusion. A normal-looking number can hide an abnormal gradient, and a low number can mean either excessive ventilation or failing circulation. Pulse oximetry and capnography answer different questions and should not be substituted for each other. Capnography can strongly support tracheal placement but must be interpreted carefully in profound low flow, neonatal and small-tidal-volume settings, major leaks, and contaminated sampling systems. Do not diagnose pulmonary embolism, bronchospasm, malignant hyperthermia, or return of circulation from one waveform alone. The safest response to an unexpected tracing is rapid clinical assessment plus systematic equipment verification." },
        { label: "Connected topics", text: "Connect capnography to arterial blood gases, ventilation-perfusion matching, physiologic dead space, respiratory failure, mechanical ventilation, airway management, endotracheal intubation, procedural sedation, opioid toxicity, asthma and COPD, pulmonary embolism, shock, cardiac arrest, pulse oximetry, oxygen therapy, and return of spontaneous circulation." }
      ],
      relatedTopics: ["Arterial blood gas", "Respiratory failure", "Opioid toxicity", "Asthma", "COPD", "Pulmonary embolism", "Shock"],
      tags: ["capnography", "capnometry", "ETCO2", "end tidal carbon dioxide", "waveform", "ventilation", "perfusion", "airway confirmation", "CPR", "ROSC", "procedural sedation", "respiratory monitoring", "nursing assessment"],
      sourceKeys: ["w42-aarc-capnography-2011", "w42-aha-adult-als-2025"]
    }),

    article({
      name: "Coronary circulation",
      fullForm: "Coronary arterial perfusion, microcirculation, and venous drainage",
      displayName: "Coronary circulation",
      type: "foundation",
      icon: "A&P",
      category: "Anatomy and Physiology / Cardiovascular / Coronary Blood Flow",
      aliases: [
        "coronary blood flow", "coronary perfusion", "blood supply to the heart", "myocardial blood supply", "heart arteries", "coronary artery anatomy", "coronary circulation anatomy", "left and right coronary arteries", "LAD circumflex RCA", "left main coronary artery", "left anterior descending artery", "circumflex artery", "right coronary artery", "posterior descending artery", "posterior interventricular artery", "coronary dominance", "right dominant coronary circulation", "left dominant coronary circulation", "coronary sinus", "cardiac veins", "myocardial oxygen supply and demand", "why coronary flow occurs in diastole", "why tachycardia causes ischemia", "subendocardial ischemia", "coronary autoregulation", "coronary flow reserve"
      ],
      abbreviations: ["LM", "LCA", "LAD", "LCx", "RCA", "PDA", "PL", "SA", "AV", "CAD", "ACS", "MI", "MVO2", "FFR", "iFR"],
      commonMisspellings: ["coronary circultion", "coronery circulation", "coronary perfussion", "mycardial blood supply", "left anterier descending", "circumflecks artery", "posterior decending artery", "coronary dominence"],
      summary: "Coronary circulation supplies the myocardium that generates every heartbeat. The right and left coronary arteries arise from the aortic root, branch over the epicardial surface, and feed penetrating resistance vessels and capillaries; cardiac veins return most blood through the coronary sinus to the right atrium. The myocardium extracts a large share of delivered oxygen even at rest, leaving limited capacity to meet greater demand by extracting more. It must therefore increase coronary blood flow when heart rate, contractility, or wall stress raises oxygen use. Left-ventricular contraction compresses intramyocardial vessels, so much of its perfusion occurs during diastole. Tachycardia shortens diastole while also raising demand, hypotension reduces driving pressure, and elevated ventricular filling pressure opposes subendocardial flow. These relationships explain why supply-demand mismatch can cause ischemia even without a completely blocked artery.",
      quickAnswer: "The left main coronary artery usually divides into the left anterior descending artery, which runs toward the apex in the anterior interventricular groove, and the circumflex artery, which travels in the left atrioventricular groove. The right coronary artery travels in the right atrioventricular groove and commonly supplies the right heart, inferior myocardium, and conduction tissue, but territories vary. Dominance is defined by which system gives rise to the posterior descending or posterior interventricular artery, not by which artery is larger or supplies the most muscle. Coronary oxygen supply depends on blood flow and arterial oxygen content; demand depends mainly on heart rate, contractility, and wall tension. Ischemia develops when flow reserve or oxygen content cannot meet demand. Sudden pressure-like chest discomfort, dyspnea, diaphoresis, nausea, syncope, malignant rhythm, or shock requires an acute coronary pathway rather than an anatomy quiz.",
      resultMeanings: [
        ["Adequate resting flow with preserved reserve", "Resistance vessels can dilate when metabolism rises, allowing coronary flow to increase with exercise or stress while myocardial oxygen balance remains matched."],
        ["Reduced coronary flow reserve", "Resting flow may remain sufficient, but fixed epicardial stenosis, microvascular dysfunction, hypertrophy, high filling pressure, or diffuse disease limits the ability to increase flow when demand rises."],
        ["Primary reduction in oxygen supply", "Plaque rupture and thrombosis, spasm, embolism, dissection, severe hypotension, hypoxemia, anemia, or microvascular failure can reduce oxygen delivery even when demand has not changed."],
        ["Primary increase in oxygen demand", "Tachycardia, hypertension, fever, agitation, hyperthyroidism, increased contractility, or ventricular wall stress can exceed available supply, especially when reserve is already limited."],
        ["Prolonged severe mismatch", "Persistent ischemia impairs relaxation and contraction, destabilizes electrical conduction, and can progress to myocardial injury, infarction, pump failure, malignant dysrhythmia, or death."]
      ],
      sections: [
        { label: "Arterial origins and major branches", text: "The right and left coronary ostia sit in the aortic sinuses just above the aortic valve. The left main artery passes a short distance before commonly dividing into the left anterior descending and left circumflex arteries; an additional ramus branch may be present. The LAD follows the anterior interventricular groove, giving septal perforators and diagonal branches. The circumflex follows the left atrioventricular groove and gives obtuse marginal branches. The RCA courses in the right atrioventricular groove, commonly giving atrial, nodal, right-ventricular marginal, posterior descending, and posterolateral branches. Names describe routes, not guaranteed territories. Congenital origin, course, branching, and dominance vary, so angiography and other imaging must define the individual anatomy before intervention." },
        { label: "Territories and conduction-system blood supply", text: "The LAD commonly supplies the anterior left ventricle, apex, and anterior two thirds of the interventricular septum, including important conduction pathways. The circumflex commonly supplies the lateral left ventricle and, in left-dominant anatomy, more inferior and posterior myocardium. The RCA commonly supplies much of the right atrium and ventricle and, in right-dominant anatomy, inferior left ventricle and posterior septum. The sinoatrial and atrioventricular nodal arteries most often arise from the RCA but may arise from the circumflex or another branch. These are probability maps, not immutable rules. A vessel occlusion can therefore produce different ECG, rhythm, wall-motion, and hemodynamic effects depending on branch location, collateral flow, dominance, prior infarction, and anatomic variation." },
        { label: "Coronary dominance", text: "Dominance is determined by the artery that gives rise to the posterior descending or posterior interventricular artery at the crux of the heart. In right-dominant circulation it comes from the RCA; in left-dominant circulation it comes from the circumflex; codominant patterns share posterior supply. Dominance does not mean that one artery controls every chamber, that the left coronary system is unimportant in a right-dominant heart, or that dominance alone predicts the site of every infarction. It matters because it changes which proximal occlusion threatens the inferior wall, posterior septum, atrioventricular node, and posterolateral myocardium. Clinical reports should name the actual vessel, lesion, and territory rather than using dominance as a shortcut for all coronary anatomy." },
        { label: "Microcirculation and venous drainage", text: "Epicardial arteries are conductance vessels; smaller intramyocardial arteries and arterioles create most adjustable resistance and distribute flow to capillary beds. The subendocardium is exposed to the greatest systolic compression and wall stress, making it especially vulnerable when perfusion pressure falls or demand rises. Venous blood from much of the left ventricle returns through the great cardiac vein, middle cardiac vein, small cardiac vein, and other tributaries into the coronary sinus, which empties into the right atrium. Some anterior cardiac veins drain the right ventricle directly into the right atrium, and very small veins can empty directly into chambers. Coronary arterial inflow and venous outflow together remove heat and metabolites as well as deliver oxygen and nutrients." },
        { label: "Why left-coronary flow is greatest in diastole", text: "During left-ventricular systole, contracting muscle compresses intramyocardial vessels, especially near the endocardium, while ventricular pressure can approach or exceed pressure within small coronary vessels. Flow through portions of the left coronary circulation therefore falls and may briefly reverse. Relaxation during diastole releases compression, and aortic diastolic pressure drives blood into the coronary bed. The right ventricle generates lower systolic pressure, so right-coronary flow is less confined to diastole. This explains why tachycardia is a double burden: it shortens the diastolic perfusion window and raises oxygen demand. It also explains why very low aortic diastolic pressure or high left-ventricular end-diastolic pressure can threaten subendocardial perfusion even without a new thrombotic occlusion." },
        { label: "Myocardial oxygen supply and demand", text: "Oxygen supply equals coronary blood flow multiplied by arterial oxygen content. Flow depends on perfusion pressure, vascular resistance, vessel patency, diastolic duration, and microvascular function; oxygen content depends mainly on hemoglobin concentration and saturation. Myocardial oxygen demand rises with faster heart rate, greater contractility, and greater wall tension, which is influenced by pressure, chamber radius, and wall thickness. Because the heart already extracts a high fraction of arterial oxygen at rest, increased work is met mainly by increasing flow rather than extraction. Anemia or hypoxemia can therefore provoke ischemia despite open epicardial arteries, while severe hypertension or tachyarrhythmia can create demand ischemia without plaque rupture. The safe model always asks what changed on both sides of the balance." },
        { label: "Autoregulation and metabolic matching", text: "Coronary resistance vessels adjust caliber across a range of pressures and metabolic states. Local metabolites, reduced tissue oxygen availability, ion-channel activity, myogenic responses, endothelial nitric oxide, prostaglandins, adenosine during ischemia, and neural influences interact rather than operating as one master switch. When myocardial work rises, vasodilation lowers resistance so flow increases in proportion to oxygen use. A fixed epicardial stenosis may be partly compensated by downstream arteriolar dilation at rest, but this consumes reserve; the bed cannot dilate much further during exertion. Microvascular dysfunction can impair reserve even when angiography shows no major obstructive lesion. Coronary flow reserve therefore describes functional capacity, not merely the visible diameter of one artery." },
        { label: "How ischemia disrupts function", text: "When oxygen delivery cannot support mitochondrial ATP production, myocardial relaxation fails early because calcium reuptake is energy dependent. Contractility then declines, regional wall motion becomes abnormal, metabolites stimulate pain pathways, and electrical gradients become unstable. Transient ischemia may cause angina without cell death; prolonged severe ischemia can injure membranes and produce irreversible necrosis with troponin release. Ischemia can trigger bradyarrhythmia, heart block, ventricular tachycardia or fibrillation, papillary-muscle dysfunction, acute mitral regurgitation, ventricular septal injury, free-wall rupture, right- or left-ventricular failure, and cardiogenic shock. Symptoms and complications depend on territory, duration, collateral supply, baseline function, and whether reperfusion occurs." },
        { label: "Clinical patterns and important nonatherosclerotic causes", text: "Atherosclerotic plaque rupture with thrombosis is a major cause of acute coronary occlusion, but coronary physiology can fail through spontaneous coronary artery dissection, embolism, vasospasm, congenital anomalous origin, external compression, severe hypotension, profound anemia or hypoxemia, inflammation, and microvascular dysfunction. Stable fixed stenosis more often limits flow during increased demand, whereas acute thrombosis can abruptly compromise resting flow. Ischemia may present as chest pressure, arm or jaw discomfort, dyspnea, diaphoresis, nausea, fatigue, syncope, or unexplained hemodynamic or rhythm change; some people have little pain. Diabetes, older age, pregnancy-associated conditions, and critical illness can alter presentation. Absence of classic crushing pain does not make ischemia harmless." },
        { label: "Diagnostics and what each test contributes", text: "A 12-lead ECG localizes electrical injury patterns but does not directly image an artery and can be nondiagnostic early. Serial high-sensitivity troponin detects myocardial injury but does not by itself identify the cause as plaque rupture. Echocardiography evaluates wall motion, valves, mechanical complications, and ventricular function. Coronary CT angiography shows lumen and plaque noninvasively in selected patients; invasive angiography defines anatomy and permits intervention. Stress ECG, echocardiography, nuclear perfusion, PET, or stress CMR tests whether demand exposes ischemia. Fractional flow reserve and related pressure measurements assess the functional significance of selected lesions during catheterization. Clinical probability, timing, kidney function, contrast risk, stability, and the question being asked determine the safest test." },
        { label: "Nursing assessment and actions", text: "For suspected ischemia, obtain exact symptom onset and trajectory, provoking and relieving factors, radiation, associated dyspnea, diaphoresis, nausea, weakness or syncope, prior coronary history, medications, bleeding risk, and relevant stimulant or substance exposure. Assess airway, breathing, circulation, blood pressure in context, pulses, perfusion, oxygen saturation, rhythm, mental status, and signs of heart failure or shock. Activate the current acute-coronary protocol, obtain an ECG promptly, establish monitored access, collect ordered serial biomarkers, and prepare for reperfusion evaluation without delaying emergency care for a complete history. Administer oxygen, antiplatelet, nitrate, anticoagulant, analgesic, or vasoactive therapy only according to indication, contraindications, and orders, then document the physiologic response rather than assuming symptom relief proves the cause." },
        { label: "Urgent red flags", text: "Escalate persistent or recurrent ischemic discomfort, new ST-segment or dynamic ECG change, malignant ventricular rhythm, high-grade heart block, syncope, hypotension, cool clammy skin, altered consciousness, rapidly increasing oxygen need, pulmonary edema, new murmur, unequal pulses with severe chest or back pain, or evidence of right-ventricular failure. Bradycardia and hypotension can accompany inferior or right-ventricular ischemia; aggressive preload reduction may be poorly tolerated and requires clinician-directed management. Aortic dissection, pulmonary embolism, tension pneumothorax, esophageal rupture, and other emergencies can mimic acute coronary syndrome and may be harmed by an incorrect pathway, so communicate discordant findings immediately." },
        { label: "Misconceptions and connected topics", text: "Coronary arteries do not fill only in diastole, but left-ventricular perfusion is strongly diastolic. Dominance does not mean size or total importance. A normal early ECG or troponin does not exclude evolving acute coronary syndrome. Open epicardial arteries do not exclude vasospasm, microvascular ischemia, anemia-related mismatch, or prior transient occlusion. Nitrates can reduce demand and alter vascular tone but do not mechanically dissolve a thrombus. A stenosis percentage alone does not fully describe functional significance. Connect this foundation to coronary artery disease, acute coronary syndrome, myocardial infarction, angina, coronary vasospasm, spontaneous coronary artery dissection, cardiac conduction, cardiac cycle, myocardial oxygen demand, troponin, ECG territories, stress testing, coronary angiography, PCI, CABG, heart failure, and cardiogenic shock." }
      ],
      relatedTopics: ["Coronary artery disease", "Acute coronary syndrome", "Myocardial infarction", "Angina", "Coronary vasospasm", "Cardiac conduction system", "Cardiac cycle", "Troponin", "Electrocardiogram", "Coronary angiography", "Percutaneous coronary intervention", "Coronary artery bypass grafting", "Heart failure", "Cardiogenic shock"],
      tags: ["coronary circulation", "coronary arteries", "coronary perfusion", "LAD", "circumflex", "RCA", "coronary dominance", "coronary sinus", "myocardial oxygen supply", "myocardial oxygen demand", "diastole", "autoregulation", "coronary flow reserve", "ischemia", "cardiac anatomy"],
      sourceKeys: ["w42-ncbi-coronary-physiology", "w42-ncbi-coronary-anatomy", "w42-coronary-flow-regulation-review"]
    }),

    article({
      name: "Palliative Performance Scale",
      fullForm: "Palliative Performance Scale Version 2",
      displayName: "Palliative Performance Scale",
      type: "clinical-assessment-system",
      diagnosticKind: "assessment",
      icon: "PPS",
      category: "Clinical Assessment Tools / Palliative Care / Functional Performance",
      aliases: [
        "Palliative Performance Scale Version 2", "Palliative Performance Scale v2", "PPSv2", "PPS v2", "PPS score", "palliative performance score", "palliative function score", "hospice performance scale", "functional status in palliative care", "performance status in hospice", "palliative mobility self care intake consciousness", "how to score PPS", "what does PPS mean", "PPS declining", "PPS prognosis", "PPS hospice", "PPS 100", "PPS 90", "PPS 80", "PPS 70", "PPS 60", "PPS 50", "PPS 40", "PPS 30", "PPS 20", "PPS 10", "PPS 0"
      ],
      abbreviations: ["PPS", "PPSv2", "KPS", "ECOG", "ADL", "IADL"],
      commonMisspellings: ["paliative performance scale", "pallative performance scale", "palliative performace scale", "palliative preformance scale", "PPSV 2", "paliative PPS", "hospis performance scale"],
      copyrightNote: "PPSv2 is copyrighted by Victoria Hospice Society. This ANI article paraphrases educational concepts and intentionally does not reproduce the PPSv2 scoring table, row descriptors, or scoring algorithm. Use an authorized current form and the official instructions for clinical scoring, licensing, teaching, publication, or organizational implementation.",
      summary: "The Palliative Performance Scale is a clinician-rated description of functional status used in palliative and hospice care. PPSv2 organizes observation across mobility, ability to carry out activity in the setting of disease, need for assistance with self-care, oral intake, and level of consciousness, then assigns an ordered percentage level using the official instrument. A lower level generally reflects greater functional loss and care dependence, and a downward trend can signal increasing symptom burden, caregiver needs, medication-administration challenges, skin and fall risk, or approaching end of life. The score does not diagnose dying, set a date of death, measure suffering, determine decision-making capacity, create a do-not-resuscitate order, or replace goals-of-care discussion. Acute infection, medication toxicity, dehydration, delirium, hypercalcemia, stroke, hypoglycemia, urinary retention, constipation, and other reversible problems can lower performance. The clinical task is to describe function consistently, explain why it changed, and connect the change to care.",
      quickAnswer: "Use the authorized PPSv2 form and its current instructions; ANI intentionally does not reproduce the copyrighted scoring table. Observe the patient's overall pattern rather than averaging five independent subscores or choosing a level from diagnosis alone. Confirm mobility, activity and disease burden, self-care assistance, intake, and consciousness with the patient, caregivers, and direct observation. Record the date, setting, acute modifiers, prior level, and who rated it. Higher PPS levels describe greater independence; lower levels describe increasing dependence and physiologic decline. Trends can help interdisciplinary communication, care planning, and population-level prognostic discussion, but survival varies widely within every level and across cancer, organ failure, neurologic disease, frailty, inpatient, outpatient, and hospice populations. A sudden fall is an assessment trigger: evaluate reversible distress and emergency red flags while honoring the patient's goals rather than assuming every decline is inevitable dying.",
      resultMeanings: [
        ["Higher functional level", "The person retains substantial mobility and self-care. Palliative needs may still be significant because pain, dyspnea, depression, caregiver distress, or treatment burden can be severe despite preserved performance."],
        ["Intermediate functional loss", "Activity is limited and assistance needs are increasing. Review falls, symptom control, medication access, nutrition, equipment, home support, caregiver capacity, and whether the care setting still matches the patient's needs."],
        ["Lower functional level", "The person spends much more time sitting or in bed and needs extensive care. Anticipate pressure-injury prevention, safe transfers, toileting, aspiration and medication-route issues, caregiver support, and urgent reassessment for reversible decline."],
        ["Very limited observable performance", "Consciousness, intake, mobility, and self-care may be profoundly impaired. Prioritize comfort and goals while checking for immediately treatable distress, airway or secretion problems, medication toxicity, seizure, urinary retention, fecal impaction, or another emergency consistent with the care plan."],
        ["Declining trend", "Repeated change is often more informative than one isolated rating. Confirm consistent technique, identify which functions changed, assess the cause, update the interdisciplinary plan, and communicate uncertainty rather than converting the trend into a precise survival promise."]
      ],
      sections: [
        { label: "What the scale describes", text: "PPSv2 is a global performance-status instrument derived from the Karnofsky tradition and adapted for palliative care. It combines five observable areas: how the person moves, how much normal activity remains and how disease limits it, how much help is required for personal care, how intake has changed, and the person's level of consciousness. These areas are related but do not deteriorate at identical rates. A person may be fully alert while physically dependent, or have poor intake from a reversible cause while mobility remains relatively preserved. The official form resolves such mixed patterns through defined instructions. ANI explains the reasoning around the tool but does not recreate its copyrighted table or provide a substitute scoring algorithm." },
        { label: "Copyright-safe use of the official instrument", text: "PPSv2 is copyrighted by Victoria Hospice Society. Clinicians and organizations should obtain the current authorized form, review its instructions and definitions, and follow applicable licensing or permission requirements for reproduction, teaching, software implementation, translation, publication, or commercial use. A screenshot, memorized row, unofficial calculator, or rewritten table can omit qualifiers and create a different instrument. This article therefore does not list the row-by-row combinations or tell the reader which exact percentage to assign from a vignette. It supports understanding, documentation, and safety around scoring. When an exact score affects care, eligibility, research, or reporting, verify it against the authorized instrument and local policy." },
        { label: "Assessment protocol", text: "Score the patient's current observed performance in a defined setting and time frame using the official instructions. Review direct observation, patient report, caregiver report, nursing notes, therapy findings, intake record, mental status, and assistance actually required rather than what equipment happens to be present. Ask whether an acute event, sedative, procedure, fatigue, time of day, unfamiliar environment, or temporary restriction changed function. Determine usual baseline and recent trajectory. Complete the whole assessment before choosing the level; do not average separate percentages, assign a score from one dramatic domain alone, or back-calculate a desired prognosis. If the pattern remains ambiguous, document the uncertainty and repeat after clarification or clinical change." },
        { label: "Mobility, activity, and disease burden", text: "Mobility describes whether the person walks independently, walks with limitation or assistance, is mainly seated or lying, or is confined to bed. Activity asks what meaningful daily activity remains and how extensively disease interferes, not simply whether the person has a cancer diagnosis or is hospitalized. Pain, dyspnea, weakness, neurologic deficit, fractures, edema, fear of falling, depression, and environmental barriers can each reduce activity through different mechanisms. Distinguish physical inability from an order not to ambulate, a missing device, or lack of assistance. A decline in mobility changes venous-thromboembolism risk, pressure exposure, pulmonary hygiene, toileting, caregiver workload, and discharge needs even when the underlying disease has not suddenly progressed." },
        { label: "Self-care, intake, and consciousness", text: "Self-care reflects the help actually needed for bathing, dressing, toileting, feeding, repositioning, and related personal tasks. Intake should be interpreted in context: dysphagia, nausea, bowel obstruction, mucositis, delirium, depression, medication effect, altered taste, fluid restriction, cultural food mismatch, and the natural dying process are different causes. Consciousness includes alertness, drowsiness, confusion, and reduced responsiveness but does not by itself establish capacity or cause. These domains influence medication route, aspiration precautions, skin care, hydration decisions, supervision, and caregiver teaching. A patient can choose less intake while remaining capable, or appear confused because of reversible delirium; the score describes performance and does not decide ethics or treatment goals." },
        { label: "Interpretation and clinical meaning", text: "A single PPS level provides a shared shorthand for function at one point. Repeated levels can describe stability, recovery, fluctuation, or decline and help anticipate care intensity. Lower performance is associated at a group level with shorter survival in many studied palliative populations, but the relationship is probabilistic. Disease type, rate of change, treatment, complications, age, comorbidity, setting, and study population all change prognosis. Functional performance also misses symptom severity, spiritual distress, social risk, and patient priorities. Use PPS as one component of a broader assessment that includes symptoms, disease trajectory, cognition, nutrition, caregiver capacity, goals, clinical judgment, and any validated disease-specific prognostic information." },
        { label: "Reliability and evidence limitations", text: "A published PPS study using standardized clinical scenarios found high overall reliability and supported its content and communication value among trained palliative clinicians. Other studies have linked PPS to survival and resource needs in selected cohorts. Reliability in a controlled exercise does not mean every bedside rating is interchangeable. Ambiguous mixed-domain cases, differing training, translated versions, rapidly fluctuating illness, and local documentation habits can reduce agreement. Prognostic studies often involve advanced cancer or hospice populations and should not be transferred automatically to heart failure, dementia, neurologic disease, pediatrics, acute hospital care, or a different health system. The instrument supports structured observation; it does not eliminate clinical uncertainty." },
        { label: "Why a sudden decline needs causal assessment", text: "Performance can fall because disease is progressing, but sudden change may reflect sepsis, dehydration, anemia, hypoxemia, uncontrolled pain, opioid or sedative accumulation, delirium, stroke, seizure, hypercalcemia, hypoglycemia, urinary retention, fecal impaction, medication withdrawal, fracture, or an environmental problem. Some causes are reversible even when the overall illness is incurable. Clarify the patient's goals and treatment plan, then assess symptoms, vital signs when appropriate, mental status, medication timing, intake and output, bowel and bladder function, falls, focal deficits, infection clues, and caregiver observations. Palliative care means relief of suffering and goal-concordant treatment; it does not mean that an unexpected deterioration should be mislabeled as normal dying without assessment." },
        { label: "Nursing priorities and care planning", text: "Translate the functional pattern into action. Increasing dependence may require pressure-injury prevention, repositioning, safe transfers, falls precautions, toileting plans, mouth care, swallowing review, aspiration precautions, medication-route changes, bowel and bladder management, equipment, home services, respite, and caregiver training. Assess pain, dyspnea, nausea, anxiety, agitation, secretions, fatigue, sleep, skin, nutrition, hydration, and spiritual or psychosocial distress rather than assuming the PPS captures them. Match observation burden to goals and setting. When function improves after symptom treatment or rehabilitation, update the score and plan; when it declines, prepare the patient and family honestly without presenting a percentage as a verdict." },
        { label: "Communication and documentation", text: "Document the exact instrument version, score from the authorized form, date and time, location, rater, evidence supporting the domains, acute modifiers, comparison value, and the resulting plan. In handoff, state what changed: for example, the person now needs two-person transfers, takes less by mouth because of nausea, and is newly drowsy after an opioid increase. This is more useful than announcing a number alone. Communicate discrepancies between raters and repeat the assessment when the clinical state changes. Avoid copying yesterday's PPS forward. A score should create shared understanding and action, not become a billing field detached from the person." },
        { label: "Urgent red flags and escalation", text: "Escalate new unresponsiveness, focal neurologic deficit, seizure, severe respiratory distress, cyanosis, chest pain, major bleeding, repeated aspiration, uncontrolled pain or agitation, suspected opioid toxicity, rapidly worsening delirium, fever with shock signs, fall with possible fracture or head injury, or inability of caregivers to provide essential safety. Follow the patient's documented goals and emergency plan, but do not infer those goals from PPS. Comfort-focused care can still require urgent medication adjustment, airway positioning, secretion relief, treatment of retention, fracture stabilization, crisis support, or transfer when consistent with preferences. If goals are unclear during a crisis, protect the patient while contacting the responsible clinician or surrogate according to policy." },
        { label: "Common misconceptions and pitfalls", text: "PPS is not a pain scale, frailty scale, dementia stage, nutritional score, ECOG or Karnofsky value, resuscitation decision, hospice eligibility rule, or stand-alone survival calculator. A score is not the probability that a patient will die and should never be converted into an exact countdown. Do not assign it from diagnosis, appearance, age, or one domain. Do not force a lower score to justify services or a higher score to preserve treatment. Do not assume reduced intake always requires artificial nutrition or that bedbound status means unconsciousness. Use the authorized descriptors, respect mixed patterns, investigate sudden change, and center interpretation on the person's goals and clinical context." },
        { label: "Connected topics", text: "Connect the Palliative Performance Scale to palliative care, hospice care, goals-of-care communication, advance care planning, symptom assessment, delirium, opioid safety, dysphagia, aspiration prevention, nutrition and hydration near end of life, pressure-injury prevention, caregiver burden, respite care, functional assessment, activities of daily living, Karnofsky Performance Status, ECOG Performance Status, Clinical Frailty Scale, and prognostic uncertainty." }
      ],
      relatedTopics: ["Delirium", "Dysphagia", "Constipation", "Urinary retention", "Malnutrition", "Dehydration", "Hypoglycemia", "Hypercalcemia", "Aspiration pneumonia", "Bowel obstruction"],
      tags: ["Palliative Performance Scale", "PPS", "PPSv2", "palliative care", "hospice", "functional status", "performance status", "mobility", "self care", "intake", "consciousness", "prognosis", "care planning", "nursing assessment", "copyrighted clinical tool"],
      sourceKeys: ["w42-victoria-hospice-ppsv2", "w42-victoria-hospice-ppsv2-instructions", "w42-pps-reliability-validity-2008"]
    })
  ];

  const expectedNames = [
    "Capnography and end-tidal carbon dioxide monitoring",
    "Coronary circulation",
    "Palliative Performance Scale"
  ];
  const actualNames = entries.map((entry) => entry.name);
  if (actualNames.length !== expectedNames.length || actualNames.some((name, index) => name !== expectedNames[index])) {
    throw new Error("Wave42 foundations/diagnostics locked card list drifted.");
  }

  const identityFields = ["id", "key", "slug", "canonicalId", "routeId"];
  const patchedNames = [];
  const addedNames = [];
  entries.forEach((entry) => {
    const key = normalize(entry.name);
    const matchingIndexes = database.entries
      .map((candidate, index) => normalize(candidate && candidate.name) === key ? index : -1)
      .filter((index) => index >= 0);
    if (matchingIndexes.length) {
      const canonicalIndex = matchingIndexes[0];
      const existing = database.entries[canonicalIndex] || {};
      const inheritedAliases = matchingIndexes.flatMap((index) => database.entries[index]?.aliases || []);
      const preservedIdentifiers = unique(matchingIndexes.flatMap((index) => {
        const candidate = database.entries[index] || {};
        return identityFields
          .filter((field) => candidate[field] !== undefined && candidate[field] !== null && String(candidate[field]).trim())
          .map((field) => field + ":" + String(candidate[field]));
      }));
      Object.assign(existing, entry, {
        aliases: unique([...inheritedAliases, ...(entry.aliases || [])]),
        legacyIdentifiers: unique([...(existing.legacyIdentifiers || []), ...preservedIdentifiers, ...(entry.legacyIdentifiers || [])])
      });
      database.entries[canonicalIndex] = existing;
      for (let index = matchingIndexes.length - 1; index >= 1; index -= 1) {
        database.entries.splice(matchingIndexes[index], 1);
      }
      patchedNames.push(entry.name);
    } else {
      database.entries.push(entry);
      addedNames.push(entry.name);
    }
  });

  database.cohorts = {
    ...(database.cohorts || {}),
    wave42FoundationsDiagnostics: expectedNames.slice()
  };
  database.componentVersions = {
    ...(database.componentVersions || {}),
    wave42FoundationsDiagnostics: VERSION
  };
  database.latestExtensionVersion = VERSION;

  window.ANI_FOUNDATIONS_DATABASE = database;
  window[GLOBAL_NAME] = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    applied: true,
    entryNames: expectedNames.slice(),
    entryCount: entries.length,
    patchedNames: patchedNames.slice(),
    addedNames: addedNames.slice(),
    canonicalOwners: Object.freeze(Object.fromEntries(entries.map((entry) => [entry.name, "reference"]))),
    canonicalTypes: Object.freeze(Object.fromEntries(entries.map((entry) => [entry.name, entry.type]))),
    sourceKeys: unique(entries.flatMap((entry) => entry.sourceKeys)),
    sourceCount: unique(entries.flatMap((entry) => entry.sourceKeys)).length,
    copyrightSafeParaphrase: true
  });
}());
