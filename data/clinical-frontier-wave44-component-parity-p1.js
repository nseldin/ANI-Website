/* eslint-disable */
/* Wave 44: standalone component parity for high-priority combined clinical concepts. */
(function () {
  window.ANI_PATHOLOGY_DATABASE = window.ANI_PATHOLOGY_DATABASE || {};
  const db = window.ANI_PATHOLOGY_DATABASE;
  db.diseases = Array.isArray(db.diseases) ? db.diseases : [];

  const VERSION = "2026-07-22-wave44-component-parity-p1";
  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const unique = (values) => Array.from(new Set((values || []).filter(Boolean)));
  const wave44SourceCatalog = window.ANI_WAVE44_AUTHORITATIVE_SOURCE_CATALOG || Object.freeze({
    "aha-stroke-2026": {
      key: "aha-stroke-2026",
      label: "American Heart Association: 2026 Guideline for Early Management of Acute Ischemic Stroke",
      url: "https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke"
    },
    "cdc-opioid-guideline-2022": {
      key: "cdc-opioid-guideline-2022",
      label: "CDC Clinical Practice Guideline for Prescribing Opioids for Pain (2022)",
      url: "https://www.cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm"
    },
    "dailymed-depakote": {
      key: "dailymed-depakote",
      label: "DailyMed: Depakote (divalproex sodium) prescribing information",
      url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ded64147-7a43-4055-accc-2c011828079d"
    },
    "dailymed-dilantin": {
      key: "dailymed-dilantin",
      label: "DailyMed: Dilantin (phenytoin sodium) prescribing information",
      url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=db8c69b0-4697-433e-98c7-b0b2d2c52a83"
    },
    "fda-opioid-labeling-2023": {
      key: "fda-opioid-labeling-2023",
      label: "FDA opioid pain medicine labeling update (2023)",
      url: "https://www.fda.gov/drugs/drug-safety-communications/fda-updates-prescribing-information-all-opioid-pain-medicines-provide-additional-guidance-safe-use"
    },
    "samhsa-tip63": {
      key: "samhsa-tip63",
      label: "SAMHSA TIP 63: Medications for Opioid Use Disorder",
      url: "https://www.samhsa.gov/resource/recovery/medications-opioid-use-disorder"
    }
  });
  const sourceKeyOf = (source) => String(source && (source.key || source.id) || "").trim();

  function registerCardSources(cards) {
    db.sourceReferences = Array.isArray(db.sourceReferences) ? db.sourceReferences : [];
    const otherDatabases = [
      window.ANI_PHARM_DATABASE,
      window.ANI_DIAGNOSTIC_DATABASE,
      window.ANI_FOUNDATIONS_DATABASE,
      window.ANI_HOLISTIC_DATABASE
    ].filter((database) => database && Array.isArray(database.sourceReferences));
    const registered = [];
    const unresolved = [];
    unique(cards.flatMap((card) => card.sourceKeys || [])).forEach((key) => {
      const existing = db.sourceReferences.find((source) => sourceKeyOf(source) === key);
      let elsewhere = null;
      for (const database of otherDatabases) {
        elsewhere = database.sourceReferences.find((source) => sourceKeyOf(source) === key) || null;
        if (elsewhere) break;
      }
      const catalog = wave44SourceCatalog[key];
      const resolved = { ...(catalog || {}), ...(elsewhere || {}), ...(existing || {}), key, id: key };
      if (!resolved.label || !resolved.url) {
        unresolved.push(key);
        return;
      }
      if (existing) Object.assign(existing, resolved);
      else db.sourceReferences.push(resolved);
      registered.push(key);
    });
    return Object.freeze({
      registered: Object.freeze(registered.slice()),
      unresolved: Object.freeze(unresolved.slice())
    });
  }
  const concept = (card) => ({
    aliases: [],
    abbreviations: [],
    diagnostics: [],
    nursingPriorities: [],
    contraindications: [],
    redFlags: [],
    patientEducation: [],
    nclexTraps: [],
    relatedTopics: [],
    causalLinks: [],
    directTreatmentMedications: [],
    medicationsCommonlyUsed: [],
    medicationInferenceMode: "explicit-only",
    medicationTreatmentSafetyPolicy: "curated-explicit-v2",
    medicationTreatmentReviewDisposition: "reviewed-no-direct-medication",
    medicationTreatmentSafetyNote: "This standalone anatomy, physiology, assessment, or safety concept does not infer treatment medications from its title, warnings, related topics, or explanatory prose.",
    hidden: false,
    studentFacing: true,
    nclexEssential: true,
    entryType: "clinical-concept",
    confidenceTier: "Curated full study card",
    componentParityWave44: true,
    whyClosureRevision: VERSION,
    replaceExistingAliases: true,
    sourceNote: "Standalone educational synthesis derived from ANI's registered guideline, government, and peer-reviewed evidence anchors for the parent concept. Interpret measurements and bedside findings in the full clinical context and current local protocol.",
    ...card,
    pathology: card.pathology || card.anatomy || "",
    tags: unique(["frontier-wave44", "component parity", "standalone concept", ...(card.tags || [])])
  });

  const cards = [
    concept({
      name: "Bicarbonate buffer system",
      category: "Acid-base physiology",
      aliases: ["bicarbonate buffer", "carbonic acid bicarbonate buffer", "CO2 bicarbonate buffer", "blood bicarbonate buffering", "how bicarbonate controls pH"],
      abbreviations: ["HCO3-", "CO2/HCO3-"],
      definition: "The bicarbonate buffer system is the body's major extracellular chemical buffer. It links dissolved carbon dioxide, carbonic acid, hydrogen ions, and bicarbonate in a reversible reaction, allowing the lungs to regulate the volatile acid component and the kidneys to regulate bicarbonate and net acid excretion.",
      pathology: "Carbon dioxide combines with water to form carbonic acid, which dissociates into hydrogen and bicarbonate. Carbonic anhydrase accelerates the reaction in red cells, renal tubules, and other tissues; hemoglobin and nonbicarbonate buffers accept hydrogen while carbon dioxide is carried to the lungs.",
      pathophysiology: "The system is powerful because it is open at both ends. Ventilation can remove carbon dioxide within minutes, while kidneys reclaim filtered bicarbonate and generate new bicarbonate by excreting titratable acid and ammonium over hours to days. A primary rise in carbon dioxide drives hydrogen upward and pH downward; a primary bicarbonate loss or acid gain does the same from the metabolic side. Compensation changes the other component but does not erase the initiating disorder.",
      clinicalSignificance: "The Henderson-Hasselbalch relationship explains why pH reflects the ratio of bicarbonate to dissolved carbon dioxide rather than either value alone. A nearly normal pH can therefore conceal two opposing primary disorders.",
      diagnostics: ["Interpret pH, PaCO2, and bicarbonate together; then determine whether compensation is appropriate for the identified primary process.", "Compare blood-gas bicarbonate with chemistry total CO2 in context because they are related but obtained differently and may diverge with sampling or processing problems.", "Use anion gap, albumin, electrolytes, lactate, ketones, renal function, ventilation, and exposure history to identify the cause rather than treating the buffer number alone."],
      nursingPriorities: ["Assess respiratory effort, mental status, perfusion, oxygenation, electrolytes, and the timing of fluids or ventilation changes with each sample.", "Escalate severe acidemia or alkalemia, fatigue during compensatory hyperventilation, dysrhythmia, shock, or rapidly changing results.", "Verify specimen type and collection conditions before acting on an unexpected blood-gas result."],
      contraindications: ["Do not recommend oral or intravenous bicarbonate merely because bicarbonate is low; benefit and harm depend on the cause, pH, sodium load, ventilation, potassium, and volume status.", "Do not call compensation a second primary disorder unless it falls outside the expected physiologic response."],
      redFlags: ["Severe pH disturbance with altered consciousness, dysrhythmia, hypotension, seizure, or respiratory fatigue", "Rapid bicarbonate decline with a rising anion gap or worsening perfusion", "Inability to ventilate the carbon dioxide generated during alkali therapy"],
      patientEducation: ["Explain that lungs and kidneys regulate different sides of the same buffer pair, which is why breathing and kidney problems can both change blood pH."],
      nclexTraps: ["Bicarbonate buffers hydrogen; it does not remove the underlying acid source.", "Compensation limits pH change but does not normally overcorrect a simple disorder.", "A normal pH does not exclude a mixed acid-base disorder."],
      relatedTopics: ["Acid-base balance", "Systematic blood gas interpretation", "Expected acid-base compensation", "Anion gap physiology and interpretation", "Delta gap"],
      causalLinks: ["CO2 retention -> more carbonic acid and hydrogen -> lower pH", "Net renal acid excretion -> new bicarbonate returned to blood -> restoration of buffer capacity", "Bicarbonate loss -> lower HCO3-to-CO2 ratio -> metabolic acidosis"],
      sourceKeys: ["kidney-acid-control-2022", "ajkd-mixed-acid-base-2025"],
      tags: ["bicarbonate", "carbonic acid", "buffer", "Henderson Hasselbalch", "acid base"]
    }),

    concept({
      name: "Antidiuretic hormone physiology",
      category: "Renal and endocrine physiology",
      aliases: ["ADH physiology", "vasopressin physiology", "arginine vasopressin", "how ADH works", "posterior pituitary water hormone"],
      abbreviations: ["ADH", "AVP"],
      definition: "Antidiuretic hormone, also called arginine vasopressin, is the principal rapid hormonal regulator of renal water excretion. It is synthesized in hypothalamic nuclei, transported to the posterior pituitary, and released when effective plasma tonicity rises or when circulatory signals indicate substantial underfilling.",
      pathology: "Hypothalamic osmoreceptors sense effective tonicity, while baroreceptor pathways relay arterial and cardiac filling. In the kidney, ADH binds collecting-duct V2 receptors and promotes insertion of aquaporin-2 water channels; V1 receptor effects at higher concentrations include vasoconstriction.",
      pathophysiology: "When ADH is present and the medullary osmotic gradient is intact, collecting ducts become water permeable. Water leaves the tubule without an equal solute loss, urine becomes concentrated, and plasma dilution is favored. When ADH is absent or the kidney resists it, urine stays dilute and water is lost. Low effective arterial volume can override low tonicity, explaining why heart failure or cirrhosis may produce concentrated urine and dilutional hyponatremia despite excess total-body water.",
      clinicalSignificance: "ADH activity is inferred from the relationship among serum osmolality, urine osmolality, urine volume, volume status, and clinical context; one urine value cannot establish SIADH or diabetes insipidus.",
      diagnostics: ["Pair measured serum osmolality and sodium with urine osmolality and urine output.", "Review glucose, renal function, calcium, potassium, diuretics, lithium, cortisol and thyroid context, recent surgery, CNS disease, pulmonary disease, pain, and nausea.", "Use supervised specialist dynamic testing when central and nephrogenic diabetes insipidus cannot be separated safely from routine data."],
      nursingPriorities: ["Trend neurologic status, strict intake/output, weight, sodium, serum and urine osmolality, thirst, and access to water.", "Watch for sudden water diuresis during treatment because sodium can rise faster than planned.", "Follow prescribed fluid restriction or replacement precisely and explain its physiologic purpose."],
      contraindications: ["Do not diagnose SIADH before excluding important renal, endocrine, medication, and volume causes.", "Do not perform unsupervised water deprivation in a patient with major polyuria or hypernatremia.", "Do not give desmopressin reflexively for every high-output state; osmotic diuresis and renal failure require different care."],
      redFlags: ["Seizure, coma, severe confusion, or respiratory decline with sodium disturbance", "Abrupt high-volume dilute urine after neurosurgery or head injury", "Inability to access water during ongoing free-water loss"],
      patientEducation: ["ADH changes how much water the kidneys return to the body; it does not directly retain sodium in the same way aldosterone does."],
      nclexTraps: ["ADH retains water more directly than sodium.", "Low effective circulating volume can stimulate ADH even when serum sodium is low.", "A concentrated urine shows water conservation, not the cause of that conservation."],
      relatedTopics: ["Free-water clearance", "Renal concentrating mechanism", "Diabetes insipidus", "SIADH", "Hyponatremia", "Hypernatremia"],
      causalLinks: ["High effective tonicity -> ADH release -> V2 signaling -> aquaporin-2 insertion -> water reabsorption", "Absent ADH effect -> dilute polyuria -> hypernatremic dehydration risk", "Low effective arterial volume -> nonosmotic ADH -> water retention despite low sodium"],
      sourceKeys: ["niddk-kidney-function", "kdigo-ckd-2024"],
      tags: ["ADH", "vasopressin", "aquaporin 2", "water balance", "V2 receptor"]
    }),

    concept({
      name: "Free-water clearance",
      category: "Renal water-balance physiology",
      aliases: ["free water clearance", "electrolyte free water clearance", "CH2O", "kidney dilute versus concentrate water", "positive negative free water clearance"],
      abbreviations: ["CH2O", "CeH2O"],
      definition: "Free-water clearance describes whether urine removes water in excess of isotonic solute or conserves water relative to plasma. Conventional free-water clearance uses urine osmolality; electrolyte-free water clearance focuses on urine sodium plus potassium relative to plasma sodium and is often more useful for anticipating how ongoing urine losses may affect serum sodium.",
      pathology: "This is a calculated water-balance concept, not a measured substance and not a disease. Positive clearance means the kidney is excreting relatively dilute water; negative clearance means urine is more concentrated and the kidney is retaining water relative to solute.",
      pathophysiology: "With low ADH effect, collecting ducts remain relatively water impermeable, producing dilute urine and positive free-water clearance. With strong ADH effect and an intact medullary gradient, water is reclaimed and clearance becomes negative. Osmotic diuresis complicates interpretation because glucose, urea, or another non-electrolyte can raise urine osmolality while the urine still carries electrolyte-free water relative to plasma sodium.",
      clinicalSignificance: "The calculation helps explain direction of water handling, but serum sodium also depends on intake, insensible losses, gastrointestinal losses, administered fluids, total exchangeable sodium and potassium, and changing kidney function.",
      diagnostics: ["Measure urine volume and obtain serum and urine values from a clinically coherent time window.", "Use urine osmolality for conventional clearance and urine sodium plus potassium for electrolyte-free water reasoning; do not interchange the formulas.", "Interpret with ADH context, glucose, urea, kidney function, diuretics, fluid intake, and ongoing nonrenal losses."],
      nursingPriorities: ["Measure output accurately and document fluid administration, tube feeds, diarrhea, fever, drains, and changes in urine concentration.", "Trend sodium frequently when output changes abruptly because calculated clearance can shift during obstruction relief, DKA treatment, or recovery from ADH excess.", "Escalate a sodium trajectory that is faster than the prescribed correction plan."],
      contraindications: ["Do not use a spot calculation as a fixed prediction during rapidly changing illness.", "Do not equate high urine osmolality with sodium retention when glucose or urea is driving osmoles.", "Do not replace direct bedside volume and neurologic assessment with a derived number."],
      redFlags: ["Massive new dilute polyuria", "Rapid sodium rise during treatment of hyponatremia", "Ongoing water loss in a patient unable to drink"],
      patientEducation: ["The calculation describes the balance of water and dissolved particles in urine; it is not a recommendation to drink or restrict water without a clinical plan."],
      nclexTraps: ["Positive free-water clearance means relatively dilute water is being excreted.", "Electrolyte-free and osmolal free-water clearance answer related but different questions.", "Serum sodium is a water-to-solute relationship, not a direct measure of total-body sodium."],
      relatedTopics: ["Antidiuretic hormone physiology", "Serum osmolality", "Urine osmolality", "Hyponatremia", "Hypernatremia", "Osmotic diuresis"],
      causalLinks: ["Urine more dilute than plasma -> positive free-water clearance -> tendency toward water loss", "Concentrated urine under ADH -> negative clearance -> water conservation", "Abrupt loss of ADH effect -> large positive clearance -> unexpectedly fast sodium rise"],
      sourceKeys: ["niddk-kidney-function", "kdigo-ckd-2024"],
      tags: ["free water", "urine osmolality", "electrolyte free water", "sodium correction"]
    }),

    concept({
      name: "Cerebral blood flow",
      category: "Neurovascular physiology",
      aliases: ["brain blood flow", "cerebral circulation flow", "CBF", "oxygen delivery to brain", "regional cerebral perfusion"],
      abbreviations: ["CBF"],
      definition: "Cerebral blood flow is the volume of blood delivered to brain tissue over time. It supplies oxygen and glucose to an organ with little fuel storage, so regional flow interruption can impair neurologic function within seconds and begin irreversible cell injury if collateral delivery is not restored.",
      pathology: "Flow depends on cerebral perfusion pressure, vascular resistance, arterial oxygen content, carbon dioxide, metabolic demand, vessel patency, and collateral anatomy. A normal systemic pressure does not prove that flow beyond an occluded cerebral artery is adequate.",
      pathophysiology: "Arterioles normally adjust resistance in response to pressure, carbon dioxide, oxygen, and local metabolism. Carbon dioxide elevation tends to dilate cerebral vessels, while hypocapnia constricts them; extreme hypoxemia also drives dilation. During ischemia, distal arterioles may already be maximally dilated, making regional flow dependent on collateral pressure. Falling flow first causes electrical failure in threatened tissue and then ATP depletion, ion-pump failure, excitotoxicity, edema, and infarction.",
      clinicalSignificance: "CBF is not routinely inferred from one vital sign. Neurologic examination, vessel imaging, perfusion or diffusion imaging, oxygenation, hemoglobin, temperature, glucose, cardiac output, and intracranial context show whether delivery is adequate.",
      diagnostics: ["Trend focal neurologic findings with blood pressure, oxygenation, ventilation, temperature, and glucose.", "Use CTA or MRA to identify blocked vessels and collateral routes; use perfusion/diffusion imaging when it will change acute selection or prognosis.", "Assess hemoglobin, rhythm, cardiac output, volume state, and intracranial pressure context because oxygen delivery depends on more than flow alone."],
      nursingPriorities: ["Avoid unplanned hypotension, hypoxemia, fever, severe glucose disturbance, and neck or head positions that impair venous drainage when cerebral perfusion is threatened.", "Escalate fluctuating or worsening deficits immediately; re-occlusion, hemorrhage, edema, seizure, or pressure-dependent flow must be distinguished.", "Align neurologic observations and physiologic measurements on the same timeline."],
      contraindications: ["Do not assume high blood pressure guarantees brain perfusion.", "Do not intentionally hyperventilate a neurologically injured patient outside a specific emergency protocol because hypocapnia can reduce flow.", "Do not apply one blood-pressure target across all stroke, hemorrhage, trauma, and raised-ICP states."],
      redFlags: ["New deficit after hypotension or blood-pressure reduction", "Declining consciousness, pupil asymmetry, posturing, or abnormal respirations", "Neurologic worsening after reperfusion"],
      patientEducation: ["Opening an artery is only part of brain rescue; oxygen, blood pressure, temperature, glucose, and swelling also affect threatened tissue."],
      nclexTraps: ["Cerebral blood flow is regional; a normal systemic circulation can coexist with focal ischemia.", "Oxygen saturation does not measure hemoglobin concentration or regional vessel patency.", "Hypocapnia can constrict cerebral vessels."],
      relatedTopics: ["Cerebral autoregulation", "Cerebral perfusion pressure", "Ischemic core", "Ischemic penumbra", "Circle of Willis"],
      causalLinks: ["Arterial occlusion -> reduced regional CBF -> ATP failure -> infarction", "Collateral flow -> delayed core expansion -> more salvageable tissue", "Hypotension or hypoxemia -> reduced delivery to pressure-dependent tissue -> neurologic worsening"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["CBF", "brain perfusion", "oxygen delivery", "collateral flow"]
    }),

    concept({
      name: "Cerebral autoregulation",
      category: "Neurovascular physiology",
      aliases: ["brain autoregulation", "cerebral pressure autoregulation", "autoregulation of CBF", "myogenic cerebral response", "why brain flow stays stable"],
      abbreviations: ["CA"],
      definition: "Cerebral autoregulation is the capacity of cerebral resistance vessels to adjust their diameter so blood flow remains relatively stable across a limited range of perfusion pressures. It is a dynamic protective response, not a fixed universal blood-pressure interval.",
      pathology: "Myogenic, metabolic, endothelial, and neurogenic signals contribute. Chronic hypertension, acute ischemia, traumatic brain injury, hemorrhage, sepsis, severe hypoxemia, anesthetic drugs, and extreme pressure can shift or impair the response.",
      pathophysiology: "When perfusion pressure falls, arterioles dilate to lower resistance; when pressure rises, they constrict to limit excess flow. Once vessels reach maximal dilation or constriction, flow becomes pressure-passive. In ischemic penumbra, distal arterioles may already be maximally dilated, so a systemic pressure drop directly reduces collateral flow. Chronic hypertension can shift the working curve toward higher pressures, making abrupt normalization hazardous in selected acute states.",
      clinicalSignificance: "Autoregulation explains why the same blood pressure may be tolerated in one patient but inadequate or harmful in another. Its limits are not reliably established by a routine cuff reading and depend on disease, time, treatment, and regional vessel status.",
      diagnostics: ["Interpret blood pressure alongside serial neurologic examination and the acute diagnosis.", "Use invasive pressure monitoring, transcranial Doppler, perfusion methods, or specialized autoregulation indices only in appropriate monitored settings.", "Review sedation, ventilation, carbon dioxide, temperature, cardiac output, and vasoactive changes that can alter vascular tone."],
      nursingPriorities: ["Prevent sudden unplanned pressure changes and titrate vasoactive therapy to the ordered disease-specific target.", "Report a reproducible neurologic change with position or pressure because it may signal pressure-dependent perfusion.", "Document medication, ventilator, and position changes with neurologic trends."],
      contraindications: ["Do not use a memorized autoregulatory range as an individual treatment target.", "Do not aggressively normalize chronic hypertension during acute neurovascular illness without the applicable protocol.", "Do not infer intact autoregulation because mean arterial pressure is normal."],
      redFlags: ["Deficit worsening during hypotension", "Neurologic decline with extreme hypertension", "Rising ICP or shock that narrows the usable perfusion range"],
      patientEducation: ["Blood-pressure goals can look unusual during acute brain injury because clinicians are balancing tissue perfusion against bleeding and swelling."],
      nclexTraps: ["Autoregulation has limits and can fail regionally.", "An ischemic territory may be pressure-dependent even while the rest of the brain autoregulates.", "The curve is shifted or altered by chronic disease and acute injury."],
      relatedTopics: ["Cerebral blood flow", "Cerebral perfusion pressure", "Mean arterial pressure", "Increased intracranial pressure", "Ischemic penumbra"],
      causalLinks: ["Lower pressure -> arteriolar dilation -> resistance falls -> flow buffered", "Maximal dilation reached -> flow becomes pressure-dependent", "Chronic hypertension or acute injury -> altered autoregulatory response -> individualized pressure risk"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["autoregulation", "cerebral resistance", "blood pressure", "pressure passive"]
    }),

    concept({
      name: "Cerebral perfusion pressure",
      category: "Neurocritical care physiology",
      aliases: ["brain perfusion pressure", "CPP", "MAP minus ICP", "pressure gradient through brain", "cerebral perfusion gradient"],
      abbreviations: ["CPP", "MAP", "ICP"],
      definition: "Cerebral perfusion pressure is the pressure gradient available to move blood through the brain. When central venous pressure is not the dominant downstream pressure, it is commonly represented as CPP = mean arterial pressure minus intracranial pressure.",
      pathology: "CPP is a pressure estimate, not a direct measurement of regional blood flow or oxygen delivery. It can fall because systemic arterial pressure drops or because intracranial pressure rises; an occluded artery can still leave a region ischemic despite an apparently adequate global CPP.",
      pathophysiology: "The rigid skull contains brain, blood, and cerebrospinal fluid. Edema, hemorrhage, mass, or impaired CSF drainage can raise ICP, subtracting from the gradient that drives inflow. Autoregulatory dilation can preserve flow initially, but once reserve is exhausted, further CPP reduction causes ischemia. Excessive pressure may also worsen edema or bleeding, so treatment aims at a disease-specific balance rather than the highest possible CPP.",
      clinicalSignificance: "A valid calculation requires a reliable MAP and measured ICP referenced correctly. The treatment target differs among traumatic brain injury, ischemic stroke, hemorrhage, hydrocephalus, and other causes and must follow current protocol.",
      diagnostics: ["Calculate only when ICP is actually measured or clearly label an estimate; use consistent pressure reference levels.", "Trend neurologic examination, pupils, MAP, ICP waveform/quality, oxygenation, ventilation, temperature, and imaging together.", "Investigate the cause of low CPP: shock, medication, cardiac failure, hemorrhage, edema, hydrocephalus, venous obstruction, or monitoring artifact."],
      nursingPriorities: ["Level and zero invasive monitors per device protocol and verify waveform quality before escalating a number.", "Maintain head and neck alignment and avoid unnecessary venous obstruction when ICP is elevated.", "Escalate declining CPP with worsening examination, sustained ICP elevation, or systemic instability immediately."],
      contraindications: ["Do not subtract an assumed ICP from MAP and present the result as measured CPP.", "Do not chase CPP by raising pressure without considering bleeding, edema, cardiac stress, and the cause of high ICP.", "Do not use one universal target across neurologic diagnoses."],
      redFlags: ["Sustained elevated ICP with falling CPP", "New fixed or unequal pupil, posturing, or declining consciousness", "Low MAP plus brain injury or shock"],
      patientEducation: ["CPP describes the pressure available to perfuse the brain; it does not by itself show whether every brain region receives enough oxygen."],
      nclexTraps: ["CPP is usually MAP minus ICP, but the inputs must be valid.", "Normal CPP does not exclude a focal arterial occlusion.", "Treating CPP means correcting its cause, not only changing MAP."],
      relatedTopics: ["Cerebral blood flow", "Cerebral autoregulation", "Mean arterial pressure", "Intracranial pressure monitoring", "Increased intracranial pressure"],
      causalLinks: ["Higher ICP at the same MAP -> lower CPP", "Lower CPP beyond autoregulatory reserve -> reduced CBF -> ischemia", "ICP treatment or hemodynamic support -> wider perfusion gradient when appropriately targeted"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["CPP", "MAP", "ICP", "neurocritical care"]
    }),

    concept({
      name: "Circle of Willis",
      category: "Neurovascular anatomy",
      aliases: ["cerebral arterial circle", "Willis arterial circle", "circle of willis anatomy", "anterior posterior communicating arteries", "brain collateral circle"],
      abbreviations: ["ACom", "PCom", "ACA", "ICA", "PCA"],
      definition: "The Circle of Willis is an arterial connection at the base of the brain that links the left and right anterior circulations and connects them with the posterior circulation. It can provide alternative inflow when one proximal route narrows, but common anatomic variants mean the textbook circle is often incomplete or asymmetric.",
      anatomy: "The proximal anterior cerebral arteries are joined by the anterior communicating artery. Each internal carotid circulation can connect with a posterior cerebral artery through a posterior communicating artery; the posterior cerebral arteries arise from the basilar system in the usual pattern.",
      pathology: "Collateral effectiveness depends on vessel caliber, completeness, downstream resistance, speed of occlusion, and leptomeningeal connections beyond the circle. A visible communicating artery does not guarantee enough flow to rescue a large threatened territory.",
      pathophysiology: "A slowly progressive stenosis can allow collateral channels to enlarge, whereas an abrupt embolus may overwhelm them. Flow can redirect across the anterior communicating artery or a posterior communicating artery when pressure gradients change. The same communicating vessels are also common sites of saccular aneurysm formation because branch-point hemodynamic stress acts on susceptible arterial walls.",
      clinicalSignificance: "Circle anatomy helps explain variable stroke severity and collateral routes, but deficits arise from downstream tissue and cannot be localized from the circle alone.",
      diagnostics: ["CTA, MRA, or catheter angiography depicts vessel patency, variants, aneurysms, and collateral routes according to the clinical question.", "Interpret arterial anatomy with the neurologic exam and tissue imaging because an anatomic variant may be incidental.", "In acute stroke, identify the actual occlusion and downstream perfusion rather than assuming the circle is protective."],
      nursingPriorities: ["Recognize sudden focal deficit or thunderclap headache as an emergency regardless of known vascular variants.", "After angiography, follow access-site, neurovascular, renal/contrast, and neurologic monitoring protocols.", "Use clear vessel names in handoff to avoid confusing a communicating artery with the territory it connects."],
      contraindications: ["Do not describe the Circle of Willis as a guaranteed backup circulation.", "Do not infer aneurysm rupture or stroke from a variant alone.", "Do not treat an image without clinical and specialist interpretation."],
      redFlags: ["Thunderclap headache, meningismus, syncope, or new focal deficit", "Suspected large-vessel occlusion", "Neurologic decline after a known aneurysm or vascular procedure"],
      patientEducation: ["Many people have harmless variations in this arterial ring; clinical meaning depends on symptoms, vessel disease, and imaging context."],
      nclexTraps: ["The Circle of Willis connects proximal inflow; cortical collateral vessels also matter.", "An incomplete circle is common and not itself a disease.", "Communicating arteries connect systems but do not supply all downstream territories directly."],
      relatedTopics: ["Cerebral arterial territories", "Cerebral blood flow", "Collateral circulation", "Cerebral aneurysm", "Large-vessel occlusion stroke"],
      causalLinks: ["Proximal pressure difference -> flow across communicating artery -> collateral support", "Incomplete or small collateral channel -> less backup flow -> faster ischemic injury", "Branch-point wall susceptibility plus hemodynamic stress -> aneurysm risk"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["circle of Willis", "ACom", "PCom", "collateral anatomy"]
    }),

    concept({
      name: "Cerebral arterial territories",
      category: "Neurovascular anatomy and localization",
      aliases: ["brain arterial territories", "cerebral artery map", "ACA MCA PCA territories", "anterior and posterior circulation", "stroke territory localization"],
      abbreviations: ["ACA", "MCA", "PCA", "PICA", "AICA", "SCA"],
      definition: "Cerebral arterial territories are the brain regions supplied by named arterial branches. Territory knowledge links a sudden pattern of motor, sensory, language, visual, behavioral, cranial-nerve, or coordination loss to a likely vessel, while recognizing that individual anatomy, collaterals, and branch-level occlusion create overlap.",
      anatomy: "The ACA primarily supplies medial frontal and parietal cortex; the MCA supplies much of the lateral hemisphere and deep perforator structures; the PCA supplies occipital, inferomedial temporal, thalamic, and selected midbrain regions. Vertebrobasilar branches supply brainstem and cerebellum.",
      pathology: "A proximal occlusion threatens more branches than a distal one. Perforator infarcts can cause compact motor, sensory, or cranial-nerve syndromes without the cortical features expected from a large surface territory.",
      pathophysiology: "MCA injury often emphasizes face-arm function, gaze, language in the dominant hemisphere, or neglect in the nondominant hemisphere. ACA injury often emphasizes leg function and frontal initiation. PCA injury often causes homonymous visual loss or memory dysfunction. Brainstem injury can create crossed face-body findings because cranial nuclei and long tracts lie close together. These are probability patterns, not rigid one-symptom rules.",
      clinicalSignificance: "Territorial localization accelerates vessel imaging and treatment activation, but imaging must confirm the vessel and distinguish ischemia from hemorrhage, seizure, tumor, migraine, or metabolic mimic.",
      diagnostics: ["Test face, arm, leg, language, gaze, fields, sensation, neglect, coordination, cranial nerves, gait, and consciousness as a pattern.", "Use CTA or MRA to identify the vessel and CT/MRI to identify the tissue affected.", "Do not let a low screening score exclude posterior circulation or isolated disabling deficits."],
      nursingPriorities: ["Document item-level neurologic findings rather than only a total score.", "Keep the patient NPO until swallowing safety is established when acute stroke is possible.", "Escalate sudden or fluctuating focal findings even when weakness is absent."],
      contraindications: ["Do not use territory mnemonics as a substitute for complete examination and imaging.", "Do not assume laterality identifies the mechanism; embolic, thrombotic, dissecting, hemorrhagic, and other causes can affect the same territory.", "Do not label isolated dizziness benign when focal posterior signs or inability to walk are present."],
      redFlags: ["Aphasia, neglect, gaze deviation, field loss, or dense unilateral weakness", "Diplopia, dysphagia, crossed findings, severe truncal ataxia, or declining consciousness", "Abrupt focal deficit of any duration"],
      patientEducation: ["Different arteries nourish different brain networks, so stroke can present with language, vision, balance, or behavior changes even without classic weakness."],
      nclexTraps: ["MCA, ACA, and PCA patterns overlap.", "Posterior circulation stroke can be devastating with a low NIHSS.", "A small deep infarct can cause dense weakness because fibers are tightly packed."],
      relatedTopics: ["Circle of Willis", "Middle cerebral artery stroke", "Anterior cerebral artery stroke", "Posterior cerebral artery stroke", "Vertebrobasilar stroke"],
      causalLinks: ["Occlusion location -> affected arterial branches -> network-specific deficit", "Collateral quality -> rate of territory failure", "Perforator injury -> compact deep syndrome without cortical signs"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["vascular territories", "ACA", "MCA", "PCA", "stroke localization"]
    }),

    concept({
      name: "Countercurrent multiplication",
      category: "Renal physiology",
      aliases: ["countercurrent multiplier", "loop of Henle countercurrent system", "medullary gradient generation", "how loop of Henle concentrates urine", "urea recycling gradient"],
      definition: "Countercurrent multiplication is the loop-of-Henle process that builds the corticomedullary osmotic gradient used to concentrate urine. Opposite flow in descending and ascending limbs repeatedly amplifies a small transverse solute difference along the length of juxtamedullary loops.",
      anatomy: "The descending thin limb is highly water permeable, while the thick ascending limb reabsorbs sodium, potassium, and chloride through NKCC2 but is relatively impermeable to water. The vasa recta preserve the gradient by countercurrent exchange, and inner-medullary urea recycling adds osmoles during antidiuresis.",
      pathophysiology: "Salt leaves the water-impermeable ascending limb, making interstitium hypertonic and tubular fluid dilute. Water then leaves the descending limb, concentrating fluid that flows toward the salt-transporting limb. Repeated flow multiplies the gradient. ADH does not create the loop gradient by itself; it increases collecting-duct water permeability so water can use that gradient.",
      clinicalSignificance: "Loop diuretics, tubular injury, advanced CKD, sickle medullary damage, hypercalcemia, hypokalemia, low solute intake, or medullary washout can weaken concentrating capacity even when ADH is present.",
      diagnostics: ["Pair serum sodium/osmolality with urine volume and urine osmolality.", "Review loop diuretics, kidney function, calcium, potassium, glucose, protein/solute intake, sickle disease, and obstruction.", "Separate water diuresis from osmotic diuresis because both cause polyuria through different mechanisms."],
      nursingPriorities: ["Trend urine output, weight, orthostasis, thirst, sodium, glucose, and urine concentration.", "Escalate polyuria with hemodynamic instability or rapidly changing sodium.", "Ensure prescribed water access or replacement during ongoing concentrating failure."],
      contraindications: ["Do not assume ADH therapy can fully concentrate urine when the medullary gradient or collecting duct is damaged.", "Do not diagnose diabetes insipidus from polyuria alone.", "Do not perform unsupervised water deprivation."],
      redFlags: ["Large ongoing water loss with hypernatremia", "Abrupt polyuria after obstruction relief or CNS injury", "Hypotension with inability to match urine output"],
      patientEducation: ["The loop of Henle builds a salty medullary environment; ADH later opens water channels so the collecting duct can use it."],
      nclexTraps: ["The thick ascending limb reabsorbs salt without water.", "Vasa recta mainly preserve rather than generate the gradient.", "ADH and the medullary gradient are both required for maximal concentration."],
      relatedTopics: ["Renal concentrating mechanism", "Antidiuretic hormone physiology", "Nephron anatomy", "Loop diuretics", "Osmotic diuresis"],
      causalLinks: ["TAL salt transport without water -> hypertonic medulla", "Descending-limb water exit plus opposite flow -> gradient multiplication", "Urea recycling -> stronger inner-medullary gradient"],
      sourceKeys: ["niddk-kidney-function"],
      tags: ["countercurrent", "loop of Henle", "NKCC2", "medullary gradient"]
    }),

    concept({
      name: "Renal concentrating mechanism",
      category: "Renal water-balance physiology",
      aliases: ["urine concentration mechanism", "how kidneys concentrate urine", "renal concentrating ability", "urine dilution and concentration", "medullary gradient and ADH"],
      definition: "The renal concentrating mechanism is the integrated process by which the kidney generates a medullary osmotic gradient, preserves it, and changes collecting-duct water permeability to produce urine ranging from dilute to concentrated. Countercurrent multiplication creates capacity; ADH determines how much of that capacity is used at a given moment.",
      anatomy: "Juxtamedullary loops establish the gradient, vasa recta limit washout, urea recycling strengthens the inner medulla, distal nephron segments dilute tubular fluid, and collecting ducts use aquaporin-2 channels to reclaim water under ADH signaling.",
      pathophysiology: "During water deprivation, ADH rises and collecting-duct water follows the medullary gradient, lowering urine volume and raising osmolality. During water excess, ADH falls and dilute fluid delivered from the ascending limb remains water-rich, producing high-volume dilute urine. Low GFR, reduced solute delivery, loop dysfunction, medullary injury, or collecting-duct resistance narrows this concentrating and diluting range.",
      clinicalSignificance: "Urine concentration is a response, not a diagnosis. Dilute urine can be appropriate after water intake or pathologic in hypernatremia; concentrated urine can be appropriate in dehydration or inappropriate in hypotonic hyponatremia.",
      diagnostics: ["Interpret urine osmolality against serum osmolality, sodium, urine volume, volume state, and timing.", "Check glucose and other osmoles, renal function, calcium, potassium, drugs, diet/solute intake, and water access.", "Use supervised specialist testing when diabetes insipidus or primary polydipsia remains uncertain."],
      nursingPriorities: ["Record precise intake/output and obtain paired serum/urine specimens when ordered.", "Watch neurologic status and sodium during active water-balance correction.", "Recognize that advanced CKD patients may be unable to make either very dilute or very concentrated urine."],
      contraindications: ["Do not interpret one urine specific gravity as equivalent to a complete osmolality assessment in every context.", "Do not assume a concentrated urine proves SIADH.", "Do not restrict or force fluids without identifying the disorder."],
      redFlags: ["Polyuria with hypernatremia or altered mental status", "Oliguria with worsening hyponatremia or overload", "Rapid serum sodium change during therapy"],
      patientEducation: ["Urine color alone cannot reliably diagnose hydration or hormone disease; laboratory concentration must be interpreted with blood values and symptoms."],
      nclexTraps: ["Concentrating capacity and ADH activity are different parts of the same process.", "Osmotic diuresis may produce concentrated but high-volume urine.", "Advanced CKD limits both dilution and concentration."],
      relatedTopics: ["Countercurrent multiplication", "Antidiuretic hormone physiology", "Free-water clearance", "Urine osmolality", "Diabetes insipidus", "SIADH"],
      causalLinks: ["Medullary gradient plus ADH -> water reabsorption -> concentrated urine", "Low ADH -> water-impermeable collecting duct -> dilute urine", "Tubular or medullary injury -> reduced concentrating reserve -> water-balance vulnerability"],
      sourceKeys: ["niddk-kidney-function", "kdigo-ckd-2024"],
      tags: ["urine concentration", "ADH", "medullary gradient", "aquaporin"]
    }),

    concept({
      name: "Delta gap",
      category: "Acid-base calculations",
      aliases: ["delta delta", "delta ratio", "anion gap delta", "corrected bicarbonate calculation", "delta gap calculation", "mixed metabolic disorder screen"],
      abbreviations: ["delta AG", "delta HCO3"],
      definition: "The delta gap is a screening comparison between the increase in anion gap and the decrease in bicarbonate during high-anion-gap metabolic acidosis. It asks whether a second metabolic process may be raising or lowering bicarbonate beyond what the accumulating unmeasured acid would broadly predict.",
      pathology: "This is a calculated interpretation tool, not a diagnosis. Delta AG is the measured, preferably albumin-aware anion gap minus the laboratory's upper-normal gap. Delta bicarbonate is a usual bicarbonate anchor near 24 minus measured bicarbonate; the changes can be compared directly or as a ratio.",
      pathophysiology: "A retained organic acid adds an unmeasured anion while its hydrogen consumes bicarbonate, so the two deltas often rise roughly together. A bicarbonate fall much larger than the gap rise suggests additional normal-gap acidosis, such as diarrhea or chloride-rich fluid. A gap rise much larger than the bicarbonate fall suggests concurrent metabolic alkalosis or a preexisting high-bicarbonate state such as chronic respiratory acidosis. Timing, albumin, renal handling, and treatment can disrupt the simple relationship.",
      clinicalSignificance: "Boundaries are approximate and unstable when either delta is small. Delta analysis evaluates metabolic mixing; expected PaCO2 formulas separately evaluate respiratory compensation.",
      diagnostics: ["First confirm a true elevated anion gap using the local reference and consider albumin.", "Use electrolytes from one time point and calculate the deltas with explicitly stated anchors.", "Confirm the proposed second process with history, chloride, blood gas, urine chloride when relevant, lactate, ketones, renal function, toxins, fluids, vomiting, or diarrhea."],
      nursingPriorities: ["Document the timing of fluids, insulin, dialysis, ventilation, GI losses, and diuretics between panels.", "Report the complete suspected pattern rather than only the ratio.", "Trend potassium and rhythm because mixed disorders and their treatments can move potassium in opposing directions."],
      contraindications: ["Do not calculate or interpret a delta ratio without a confirmed elevated gap.", "Do not use rigid cutoffs as treatment targets.", "Do not substitute delta analysis for respiratory-compensation assessment or disease-specific markers."],
      redFlags: ["Large anion gap with near-normal pH", "Bicarbonate much lower than the gap rise predicts", "Clinical deterioration despite apparent gap closure"],
      patientEducation: ["Two acid-base processes can offset each other, so a nearly normal pH does not always mean normal physiology."],
      nclexTraps: ["Delta gap screens for another metabolic process.", "Use the local normal gap and same-time values.", "A ratio is a clue, not proof of a named disorder."],
      relatedTopics: ["Anion gap", "Mixed acid-base disorders", "Metabolic acidosis", "Normal-anion-gap metabolic acidosis", "Expected acid-base compensation"],
      causalLinks: ["Delta bicarbonate greater than delta AG -> added bicarbonate loss or chloride gain", "Delta AG greater than delta bicarbonate -> added alkalosis or chronic CO2 retention", "Treatment timing -> changing acid species -> changing delta interpretation"],
      sourceKeys: ["ajkd-mixed-acid-base-2025", "ajkd-high-ag-2021"],
      tags: ["delta gap", "delta ratio", "mixed metabolic", "anion gap"]
    }),

    concept({
      name: "Ultrafiltration",
      category: "Dialysis physiology",
      aliases: ["dialysis ultrafiltration", "UF dialysis", "fluid removal during dialysis", "transmembrane pressure fluid removal", "convective water removal"],
      abbreviations: ["UF", "TMP"],
      definition: "Ultrafiltration is movement of plasma water across a semipermeable dialysis membrane under a pressure or osmotic gradient. In hemodialysis, transmembrane hydrostatic pressure drives water from blood into dialysate; in peritoneal dialysis, dialysate osmoles create an osmotic gradient that draws water across the peritoneum.",
      pathology: "Ultrafiltration is a treatment process rather than a disease. Solutes can accompany water by convection, but fluid removal and diffusive solute clearance are distinct: a treatment can remove urea while removing little net water, or remove water while solute targets require separate attention.",
      pathophysiology: "Hemodialysis removes water from the vascular compartment first. Interstitial water must refill plasma while the heart and vessels preserve cardiac output. If net removal exceeds refill and compensatory reserve, preload and organ perfusion fall. Peritoneal ultrafiltration depends on glucose or another osmotic agent, dwell time, membrane transport, lymphatic absorption, and catheter function; the gradient weakens during a dwell as osmoles are absorbed.",
      clinicalSignificance: "The ordered net goal is not the same as whole-patient fluid balance because saline, medications, nutrition, urine, drains, and other inputs and outputs continue during therapy. Ultrafiltration must be interpreted with symptoms, hemodynamics, congestion, residual kidney function, and the reason for dialysis.",
      diagnostics: ["Compare prescribed and delivered net removal with accurate pre/post weights and all intradialytic inputs.", "Assess blood pressure, orthostasis, rhythm, lungs, edema, venous pressure, cramps, nausea, perfusion, and recovery time.", "For peritoneal dialysis, compare instilled and drained volume while checking dwell time, leaks, constipation, catheter flow, and membrane transport context."],
      nursingPriorities: ["Measure weights on a consistent calibrated scale and record every input and output.", "Recognize yawning, nausea, cramps, dizziness, cool skin, chest symptoms, or neurologic change as possible hypoperfusion during removal.", "Follow protocol for slowing or stopping removal and escalate persistent hypotension or organ-ischemia symptoms."],
      contraindications: ["Do not continue aggressive removal solely to reach a number when tissue perfusion is failing.", "Do not equate machine net removal with total patient balance.", "Do not treat every dialysis-associated pressure fall as benign UF intolerance; bleeding, sepsis, arrhythmia, ischemia, and reaction require exclusion."],
      redFlags: ["Hypotension with chest pain, focal deficit, syncope, severe abdominal pain, or arrhythmia", "Severe pulmonary edema when the prescribed goal cannot be achieved", "Unexpectedly absent peritoneal drainage, leak, severe pain, or cloudy effluent"],
      patientEducation: ["Ultrafiltration removes water, while other dialysis processes remove dissolved wastes; the safest amount and speed depend on the whole clinical picture."],
      nclexTraps: ["Fluid is removed from plasma before interstitial refill catches up.", "Diffusion and ultrafiltration are related but not identical.", "An edematous patient can still become intravascularly underfilled during rapid removal."],
      relatedTopics: ["Dialysis target weight", "Dialysis volume management", "Dialysis hypotension", "Hemodialysis", "Peritoneal dialysis"],
      causalLinks: ["Transmembrane or osmotic gradient -> water crosses membrane -> extracellular volume falls", "UF faster than plasma refill -> lower venous return -> hypotension and ischemia", "Longer treatment for the same volume -> lower hourly removal burden -> potentially better tolerance"],
      sourceKeys: ["niddk-hemodialysis", "niddk-peritoneal-dialysis", "kdigo-ckd-2024"],
      tags: ["ultrafiltration", "fluid removal", "dialysis", "transmembrane pressure"]
    }),

    concept({
      name: "Dialysis target weight",
      category: "Dialysis volume assessment",
      aliases: ["dialysis dry weight", "target dry weight", "postdialysis target weight", "euvolemic dialysis weight", "estimated dry weight"],
      abbreviations: ["EDW"],
      definition: "Dialysis target weight is the individualized post-treatment weight at which extracellular volume is judged acceptable without clinically important congestion or underfilling. The traditional term dry weight can sound exact, but the value is a revisable clinical estimate rather than an ideal body-weight or dieting goal.",
      pathology: "Scale weight combines fluid, muscle, fat, organs, clothing, food, and equipment. Nutrition change, amputation, pregnancy, hospitalization, inflammation, tissue loss, edema, and recovery can alter body mass independently of fluid, so yesterday's target can become unsafe.",
      pathophysiology: "A target set too high leaves excess extracellular water, promoting hypertension, pulmonary congestion, and cardiac remodeling. A target set too low requires removal beyond vascular refill and physiologic reserve, producing cramps, dizziness, hypotension, organ hypoperfusion, and slow recovery. Repeated symptom-free observations and objective congestion trends refine the estimate over time.",
      clinicalSignificance: "No single blood pressure, edema finding, chest image, biomarker, or device measurement establishes target weight by itself. The best estimate integrates serial weights, symptoms, examination, treatment tolerance, residual urine, and changing body composition.",
      diagnostics: ["Compare pre/post weights across treatments with edema, lungs, JVP, orthostasis, pressure pattern, breathlessness, cramps, and recovery time.", "Reassess after hospitalization, infection, surgery, pregnancy, nutritional change, amputation, or major change in urine output.", "Use lung ultrasound or bioimpedance as adjuncts when available; interpret them within the clinical picture."],
      nursingPriorities: ["Use a consistent scale, clothing approach, and documentation method.", "Report a new mismatch between target and symptoms rather than repeatedly forcing the historical number.", "Connect sodium intake, thirst, interdialytic gain, session duration, and removal tolerance during teaching."],
      contraindications: ["Do not describe target weight as permanent or as a weight-loss objective.", "Do not force removal through symptomatic hypotension solely to reach the charted value.", "Do not assume every change on the scale is water."],
      redFlags: ["Persistent pulmonary congestion despite reaching target", "Recurrent syncope, ischemic symptoms, or severe cramps near target", "Rapid unexplained change in true body mass or residual urine"],
      patientEducation: ["Target weight is the team's best current estimate of balanced fluid after dialysis and should change when health or body composition changes."],
      nclexTraps: ["Dry weight is not literally water-free.", "Edema can coexist with low effective circulating volume.", "Target weight requires serial reassessment."],
      relatedTopics: ["Ultrafiltration", "Dialysis volume management", "Dialysis hypotension", "Effective circulating volume", "Edema"],
      causalLinks: ["Target too high -> retained extracellular water -> hypertension and congestion", "Target too low -> excessive removal -> hypoperfusion", "Body-composition change -> old target no longer represents volume balance"],
      sourceKeys: ["niddk-hemodialysis", "kdigo-ckd-2024"],
      tags: ["target weight", "dry weight", "euvolemia", "dialysis assessment"]
    }),

    concept({
      name: "Dialysis volume management",
      category: "Dialysis nursing and clinical management",
      aliases: ["dialysis fluid management", "interdialytic volume control", "fluid balance on dialysis", "dialysis volume assessment", "interdialytic weight gain management"],
      abbreviations: ["IDWG"],
      definition: "Dialysis volume management is the ongoing process of balancing sodium and water intake, residual kidney output, dialysis frequency and duration, ultrafiltration, target weight, hemodynamic tolerance, and comorbid heart or liver disease. Its goal is stable perfusion without chronic congestion, not simply the largest possible fluid removal.",
      pathology: "Kidney failure reduces the ability to excrete sodium and water. Sodium burden increases thirst and extracellular water, while missed or shortened treatment compresses the needed removal into less time. At the same time, heart failure, autonomic dysfunction, low albumin, infection, or frailty may reduce tolerance of rapid intravascular change.",
      pathophysiology: "Water gained between sessions expands extracellular volume. Rapid ultrafiltration then contracts plasma faster than interstitial fluid can refill it, reducing preload. Persistent under-removal promotes edema, pulmonary congestion, and cardiac strain; repeated over-removal promotes hypotension, falls, access thrombosis, and myocardial or cerebral stunning. Extending treatment time can lower the hourly removal burden even when total volume is unchanged.",
      clinicalSignificance: "Total-body overload and intravascular underfilling can coexist. Management therefore combines serial examination and trends rather than treating one pressure or weight in isolation.",
      diagnostics: ["Trend interdialytic gain, pre/post pressure and weight, residual urine, edema, lungs, JVP, orthostasis, symptoms, and session completion.", "Account for sodium-rich foods, tube feeds, IV fluids, medications, and dialysate factors.", "Investigate infection, bleeding, arrhythmia, cardiac dysfunction, venous congestion, and nutrition change when the ordinary pattern no longer fits."],
      nursingPriorities: ["Document actual delivered therapy and whole-patient balance, not only the machine goal.", "Reinforce individualized sodium and fluid guidance and explain why sodium drives thirst.", "Escalate recurrent hypotension, inability to reach a safe volume state, rapid loss of residual urine, or pulmonary edema."],
      contraindications: ["Do not use a one-size fluid allowance without residual output and clinical context.", "Do not give routine fluid for every low pressure without assessing congestion and alternate emergencies.", "Do not frame nonadherence as the only cause before assessing access, schedule, symptoms, food insecurity, cognition, and treatment tolerance."],
      redFlags: ["Hypoxemic pulmonary edema", "Persistent hypotension or organ-ischemia symptoms during treatment", "Rapid weight gain with absent dialysis or urine", "Confusion, severe weakness, or dysrhythmia with missed therapy"],
      patientEducation: ["Sodium restriction often reduces thirst and makes fluid limits more achievable; completing prescribed time allows removal to occur more gradually."],
      nclexTraps: ["Interdialytic gain is a clinical clue, not a moral judgment.", "Longer time can improve tolerance by lowering the rate of removal.", "Volume assessment includes congestion and perfusion."],
      relatedTopics: ["Ultrafiltration", "Dialysis target weight", "Dialysis hypotension", "Sodium balance", "End-stage renal disease"],
      causalLinks: ["Sodium retention -> thirst and water gain -> extracellular overload", "Short treatment plus large gain -> high UF rate -> hypoperfusion risk", "Persistent congestion -> cardiac and pulmonary burden", "Recurrent underfilling -> organ stunning and access thrombosis"],
      sourceKeys: ["niddk-hemodialysis", "niddk-peritoneal-dialysis", "kdigo-ckd-2024"],
      tags: ["volume management", "interdialytic weight gain", "sodium", "fluid balance"]
    }),

    concept({
      name: "Arteriovenous fistula",
      category: "Hemodialysis vascular access",
      aliases: ["AV fistula", "dialysis fistula", "native arteriovenous access", "AVF", "fistula thrill and bruit"],
      abbreviations: ["AVF"],
      definition: "An arteriovenous fistula is a surgically created connection between a native artery and vein that arterializes and enlarges the vein for repeated hemodialysis cannulation. It usually requires weeks to months of maturation and is selected within an individualized kidney-failure life plan rather than by a blanket rule.",
      anatomy: "Common configurations connect vessels in the forearm or upper arm. Arterial pressure increases venous flow and wall stress, producing remodeling, greater diameter, and a palpable continuous thrill when maturation succeeds.",
      pathophysiology: "Adequate flow enables dialysis, but turbulence and repeated cannulation can produce stenosis, thrombosis, aneurysmal change, infection, or bleeding. Flow diverted from the hand can cause distal ischemia, while very high access flow can increase venous return and contribute to high-output cardiac stress in susceptible patients.",
      clinicalSignificance: "A thrill or bruit confirms some flow, not adequate dialysis and not freedom from stenosis or infection. Change from the patient's baseline, prolonged post-needle bleeding, difficult cannulation, pressure alarms, or falling adequacy can reveal dysfunction.",
      diagnostics: ["Inspect skin and arm, palpate the thrill along the access, and auscultate the bruit before use.", "Trend cannulation difficulty, circuit pressures, recirculation, adequacy, hand perfusion, and bleeding time.", "Use duplex ultrasound or fistulography when maturation failure, stenosis, thrombosis, aneurysm, or steal is suspected."],
      nursingPriorities: ["Avoid routine blood pressure, venipuncture, constriction, and prolonged compression on the access arm.", "Never cannulate infected, ulcerated, or dangerously thinned skin.", "Escalate absent or abrupt thrill change, uncontrolled bleeding, fever/rigors, or a cold painful weak hand."],
      contraindications: ["Do not assume every patient should receive a fistula regardless of anatomy, timing, prognosis, heart function, or preference.", "Do not use the access for routine non-dialysis procedures without a specific specialist plan.", "Do not remove an adherent scab from aneurysmal or thin skin."],
      redFlags: ["Absent thrill", "Severe bleeding", "Cold painful hand or tissue loss", "Rapidly expanding aneurysm, skin breakdown, purulence, fever, or rigors"],
      patientEducation: ["Feel the thrill daily, protect the arm from pressure and injury, keep the site clean, and report any change immediately; severe bleeding requires firm direct pressure and emergency help."],
      nclexTraps: ["A fistula is native-vessel access, not a synthetic graft.", "Presence of a thrill does not exclude stenosis or infection.", "Prolonged bleeding can signal outflow stenosis."],
      relatedTopics: ["Arteriovenous graft", "Hemodialysis catheter", "AV fistula thrombosis", "AV fistula infection", "Hemodialysis"],
      causalLinks: ["Artery-to-vein connection -> high venous flow -> maturation for cannulation", "Outflow stenosis -> higher pressure and recirculation -> thrombosis risk", "Excess access flow or distal diversion -> cardiac strain or hand ischemia"],
      sourceKeys: ["kdoqi-vascular-access", "niddk-hemodialysis"],
      tags: ["AV fistula", "AVF", "thrill", "bruit", "dialysis access"]
    }),

    concept({
      name: "Arteriovenous graft",
      category: "Hemodialysis vascular access",
      aliases: ["AV graft", "dialysis graft", "synthetic hemodialysis graft", "AVG", "prosthetic dialysis access"],
      abbreviations: ["AVG"],
      definition: "An arteriovenous graft is a synthetic or biologic conduit connecting an artery and vein for hemodialysis access. It can often be cannulated sooner than a conventional fistula and may be appropriate when native vessels are unsuitable, but it generally has more stenosis, thrombosis, and infection burden than a mature native fistula.",
      anatomy: "The conduit is placed subcutaneously, commonly in an arm, creating a defined cannulation segment between arterial inflow and venous outflow. A palpable thrill and audible bruit reflect flow through the circuit.",
      pathophysiology: "Neointimal hyperplasia commonly narrows the venous anastomosis or outflow, increasing pressure, recirculation, prolonged bleeding, and thrombosis risk. Prosthetic material is less resistant to infection than native tissue, and repeated puncture can weaken the wall or form pseudoaneurysm. Distal ischemia and high-flow cardiac stress can also occur.",
      clinicalSignificance: "Graft choice is individualized by access urgency, anatomy, expected duration, prior failures, infection risk, heart function, and patient priorities. It is not simply a failed fistula or an inferior choice in every circumstance.",
      diagnostics: ["Inspect, palpate, and auscultate before use and compare with baseline.", "Trend pressures, adequacy, recirculation, post-needle bleeding, cannulation difficulty, and hand perfusion.", "Use ultrasound or angiographic evaluation for suspected stenosis, thrombosis, pseudoaneurysm, or infection."],
      nursingPriorities: ["Use prescribed site rotation/cannulation technique and avoid infected or compromised skin.", "Protect the limb from compression, routine pressure cuffs, and venipuncture.", "Escalate absent thrill, uncontrolled bleeding, drainage, fever/rigors, rapidly enlarging bulge, or hand ischemia."],
      contraindications: ["Do not cannulate through cellulitis, ulceration, or a pseudoaneurysm without the vascular-access plan.", "Do not assume a present thrill proves adequate flow.", "Do not treat severe graft bleeding by blind clamping or removing a clot."],
      redFlags: ["Absent thrill or abrupt loss of dialysis flow", "Purulence, fever, or bacteremia", "Skin erosion or severe bleeding", "Cold painful hand or neurologic deficit"],
      patientEducation: ["Check the graft daily for its usual vibration, avoid pressure on the limb, and report redness, drainage, bleeding, coolness, pain, or a change in the thrill."],
      nclexTraps: ["A graft contains a conduit; a fistula is a native artery-vein connection.", "Earlier usability does not eliminate maturation and access-assessment needs.", "Prosthetic infection often requires source-control planning, not antibiotics alone."],
      relatedTopics: ["Arteriovenous fistula", "Hemodialysis catheter", "Dialysis access infection", "Dialysis access thrombosis", "Hemodialysis"],
      causalLinks: ["Synthetic conduit -> high-flow access despite limited native vein", "Outflow hyperplasia -> stenosis -> thrombosis and poor dialysis", "Prosthetic surface plus cannulation -> infection and pseudoaneurysm risk"],
      sourceKeys: ["kdoqi-vascular-access", "niddk-hemodialysis"],
      tags: ["AV graft", "AVG", "prosthetic access", "dialysis graft"]
    }),

    concept({
      name: "Hemodialysis catheter",
      category: "Hemodialysis vascular access",
      aliases: ["dialysis catheter", "tunneled dialysis catheter", "temporary dialysis catheter", "hemodialysis CVC", "HD catheter"],
      abbreviations: ["HD catheter", "CVC"],
      definition: "A hemodialysis catheter is a large-bore central venous catheter with separate withdrawal and return lumens that can provide immediate extracorporeal blood flow. Non-tunneled catheters are generally used for urgent short-term access; tunneled cuffed catheters can support longer use when another access is not ready or appropriate.",
      anatomy: "The catheter tip is positioned in a high-flow central vein near the right atrium according to device and procedural standards. A tunneled cuff creates a tissue barrier, but the external hub still provides a direct route from skin to bloodstream.",
      pathophysiology: "Hub contamination and intraluminal or extraluminal biofilm can cause bloodstream infection, sepsis, endocarditis, or metastatic infection. Fibrin sheath, malposition, kinking, central venous stenosis, or thrombosis reduces flow and creates recirculation. Large lumens also create catastrophic air-entry or blood-loss risk if a connection opens.",
      clinicalSignificance: "Catheters are immediately usable but carry the highest infection and central-venous injury burden among common dialysis access types. Their presence should prompt an ongoing access plan rather than an assumption they are permanent or universally avoidable.",
      diagnostics: ["Inspect the exit site, tunnel, dressing, clamps, caps, connections, and external length before use.", "Trend blood-flow performance, circuit pressure, recirculation, alarms, and delivered adequacy.", "Obtain cultures and assess for alternate or metastatic sources when fever, rigors, hypotension, or local infection is present."],
      nursingPriorities: ["Use full prescribed aseptic hub and dressing technique and keep connections visible and secure.", "Do not use dialysis lumens for routine infusion or blood sampling without an explicit protocol and authorization.", "Escalate fever/rigors during dialysis, drainage, tunnel pain, dislodgement, air/blood leak, or inability to achieve flow."],
      contraindications: ["Do not submerge the site or manipulate caps and clamps outside trained care.", "Do not force-flush a resistant catheter or reverse lumens as a routine substitute for investigating dysfunction.", "Do not dismiss catheter bacteremia because the exit site looks normal."],
      redFlags: ["Air entry, disconnection, or uncontrolled bleeding", "Fever, rigors, hypotension, confusion, or new murmur", "Catheter migration or sudden flow failure", "Chest, neck, or arm swelling suggesting central thrombosis"],
      patientEducation: ["Keep the dressing clean and dry, do not open or use the lumens, and report fever, chills, drainage, pain, swelling, bleeding, or a changed catheter position immediately."],
      nclexTraps: ["A normal-looking exit site does not exclude catheter bloodstream infection.", "A tunneled catheter is not infection-proof.", "Air and blood loss are immediate connection emergencies."],
      relatedTopics: ["Arteriovenous fistula", "Arteriovenous graft", "Central-line-associated bloodstream infection", "Hemodialysis", "Central venous stenosis"],
      causalLinks: ["External hub and biofilm -> bloodstream invasion -> sepsis/endocarditis", "Fibrin sheath or malposition -> poor flow and recirculation -> underdialysis", "Open large-bore lumen -> rapid blood loss or air embolism"],
      sourceKeys: ["kdoqi-vascular-access", "niddk-hemodialysis"],
      tags: ["dialysis catheter", "CVC", "CLABSI", "tunneled catheter"]
    }),

    concept({
      name: "Dominant-hemisphere stroke syndrome",
      category: "Stroke localization",
      aliases: ["dominant hemisphere stroke", "language hemisphere stroke", "left brain stroke syndrome", "aphasic stroke", "dominant cerebral hemisphere infarct"],
      definition: "Dominant-hemisphere stroke syndrome is the pattern produced when an acute stroke injures the hemisphere specialized for language and related symbolic functions. The left hemisphere is language-dominant in most people, but handedness is an imperfect clue and the examination must establish the actual functional pattern.",
      anatomy: "Distributed frontal, temporal, parietal, insular, subcortical, and white-matter networks support speaking, comprehension, naming, repetition, reading, writing, calculation, learned actions, and right-left orientation. MCA territory injury is common, but no single 'language center' explains every presentation.",
      pathophysiology: "Network injury or disconnection can cause nonfluent or fluent aphasia, impaired comprehension, naming, repetition, reading, or writing. Adjacent motor and visual pathways may add contralateral weakness, sensory loss, gaze preference, or field loss. Aphasia impairs access to language and can mask preserved reasoning; it is not the same as dysarthria or delirium.",
      clinicalSignificance: "Sudden aphasia is a disabling stroke symptom even when limb strength and a total screening score appear mild. Prior stroke, developmental variation, bilingual organization, epilepsy, migraine, or tumor can modify the expected pattern or mimic it.",
      diagnostics: ["Test spontaneous speech, naming, repetition, comprehension, reading, writing, calculation, gesture, gaze, fields, motor and sensory function.", "Separate aphasia from dysarthria, reduced arousal, hearing loss, language barrier, and delirium.", "Activate emergency CT/CTA and reperfusion evaluation for sudden onset rather than waiting for a complete taxonomy of aphasia."],
      nursingPriorities: ["Use short concrete statements, one request at a time, visual supports, and adequate response time.", "Verify yes/no reliability and comprehension before consent, teaching, pain assessment, or discharge decisions.", "Keep NPO until swallowing safety is screened and escalate any acute change immediately."],
      contraindications: ["Do not infer intelligence or decision-making incapacity from speech output alone.", "Do not assume every dominant hemisphere is left-sided.", "Do not call aphasia confusion without testing language components."],
      redFlags: ["Sudden new aphasia or alexia", "Worsening language after reperfusion", "Aphasia with gaze deviation, field loss, or dense weakness suggesting large-vessel occlusion"],
      patientEducation: ["Aphasia is a brain-language disorder, not deliberate silence or loss of intelligence; communication can improve through supported practice and rehabilitation."],
      nclexTraps: ["Aphasia is language impairment; dysarthria is impaired speech-muscle execution.", "Isolated aphasia can be disabling.", "Dominance is functional, not guaranteed by handedness."],
      relatedTopics: ["Nondominant-hemisphere stroke syndrome", "Broca aphasia", "Wernicke aphasia", "Middle cerebral artery stroke", "Post-stroke dysphagia screening"],
      causalLinks: ["Dominant network ischemia -> impaired language representation -> aphasia", "White-matter disconnection -> selective naming/repetition deficits", "Communication barrier -> missed symptoms and needs unless supported"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["dominant hemisphere", "aphasia", "language", "stroke localization"]
    }),

    concept({
      name: "Nondominant-hemisphere stroke syndrome",
      category: "Stroke localization",
      aliases: ["nondominant hemisphere stroke", "right brain stroke syndrome", "spatial neglect stroke", "non language hemisphere stroke", "hemispatial neglect syndrome"],
      definition: "Nondominant-hemisphere stroke syndrome is the pattern produced when acute stroke disrupts networks that emphasize spatial attention, body awareness, visual construction, emotional prosody, and insight. In most people this is a right-hemisphere syndrome, but functional lateralization varies.",
      anatomy: "Right frontoparietal and connected subcortical attention networks normally distribute attention across both sides of space. Injury commonly produces left neglect because the intact left hemisphere has less capacity to compensate for attention to the left side.",
      pathophysiology: "Neglect is failure to attend to or respond to contralesional stimuli despite adequate primary sensation. Extinction may appear only when both sides are stimulated together. Anosognosia reflects impaired awareness of deficit, so a patient may sincerely deny paralysis or attempt unsafe mobility. Visual-field loss can coexist but is a separate primary sensory pathway problem.",
      clinicalSignificance: "This syndrome can be highly disabling and unsafe despite fluent speech or a modest screening score. Impulsivity, poor prosody, constructional difficulty, and unrecognized hazards can complicate mobility, eating, grooming, and adherence.",
      diagnostics: ["Test visual, tactile, and auditory attention on each side and with simultaneous bilateral stimulation.", "Assess line bisection, cancellation, drawing, body awareness, insight, gaze, fields, strength, and sensation.", "Use acute stroke imaging and vessel evaluation; do not attribute abrupt neglect to personality or poor cooperation."],
      nursingPriorities: ["Provide close mobility and fall supervision because confidence may exceed awareness.", "Place urgent safety items where they can initially be found while systematically cueing scanning toward the neglected side.", "Check the neglected side for food, grooming, pressure, injury, IV lines, and limb positioning."],
      contraindications: ["Do not equate neglect with blindness or weakness.", "Do not rely on the patient's denial of deficit as evidence of safety.", "Do not permanently place every item only on the intact side; rehabilitation requires graded attention training."],
      redFlags: ["Sudden neglect, extinction, or anosognosia", "Repeated collision or unsafe attempts to walk", "New neglect after reperfusion"],
      patientEducation: ["Neglect is a neurologic loss of attention and awareness, not intentional ignoring; consistent scanning strategies and supervision reduce harm."],
      nclexTraps: ["Neglect and homonymous hemianopia can coexist but are not identical.", "Nondominant stroke may preserve fluent speech while severely impairing safety.", "Anosognosia is neurologic lack of awareness."],
      relatedTopics: ["Dominant-hemisphere stroke syndrome", "Hemispatial neglect", "Homonymous hemianopia", "Middle cerebral artery stroke", "Stroke rehabilitation"],
      causalLinks: ["Nondominant attention-network injury -> contralateral neglect", "Impaired self-monitoring -> anosognosia -> unsafe behavior", "Neglected sensory input -> missed hazards and self-care needs"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["nondominant hemisphere", "neglect", "anosognosia", "spatial attention"]
    }),

    concept({
      name: "Homonymous hemianopia",
      category: "Neuro-ophthalmic finding",
      aliases: ["homonymous hemianopsia", "same side visual field loss both eyes", "post chiasmal field cut", "half vision loss after stroke", "right homonymous hemianopia", "left homonymous hemianopia"],
      definition: "Homonymous hemianopia is loss of the same half of visual space in both eyes from a lesion behind the optic chiasm. A left optic tract, lateral geniculate, optic-radiation, or occipital lesion causes right visual-field loss in both eyes; a right-sided lesion causes left field loss.",
      anatomy: "After retinal fibers partially cross at the optic chiasm, each post-chiasmal pathway represents the contralateral visual field from both eyes. Optic radiations pass through temporal and parietal lobes before reaching occipital visual cortex.",
      pathophysiology: "Injury removes cortical access to one side of space from both retinas. More posterior lesions tend to produce more congruous defects between eyes. Temporal-lobe Meyer's loop injury can cause a contralateral superior quadrantanopia, while parietal radiation injury can cause an inferior quadrantanopia. Macular sparing may occur in occipital stroke but is not required.",
      clinicalSignificance: "Patients may bump into objects, miss food or text, become unsafe driving, or have impaired reading. Lack of complaint does not exclude loss; visual neglect or impaired awareness can obscure it.",
      diagnostics: ["Test each eye separately by confrontation while fixation is maintained, then confirm with formal perimetry when feasible.", "Examine pupils, acuity, eye movements, retina/optic nerve clues, attention, and simultaneous stimulation to separate field loss from ocular disease or neglect.", "Sudden onset requires urgent brain and vascular evaluation."],
      nursingPriorities: ["Approach within the intact field initially, then cue deliberate head and eye scanning toward the missing side.", "Clear walking paths, supervise mobility, position food and personal items deliberately, and assess reading and self-care.", "Follow driving restrictions and occupational/vision rehabilitation guidance."],
      contraindications: ["Do not call homonymous loss monocular blindness.", "Do not diagnose from poor bedside cooperation alone.", "Do not assume neglect and field loss are interchangeable."],
      redFlags: ["Sudden new field cut", "Field loss with headache, weakness, aphasia, or neglect", "Progressive field defect or new seizure"],
      patientEducation: ["Both eyes can see, but the brain has lost one side of the visual map; scanning training helps compensate but does not prove the pathway has recovered."],
      nclexTraps: ["Post-chiasmal lesions cause contralateral homonymous defects.", "The same visual field is missing in both eyes, not one whole eye.", "Visual-field loss and neglect require different testing."],
      relatedTopics: ["Visual field examination", "Posterior cerebral artery stroke", "Optic chiasm", "Hemispatial neglect", "Cerebral arterial territories"],
      causalLinks: ["Post-chiasmal lesion -> loss of contralateral visual representation from both eyes -> homonymous field defect", "Field loss -> collisions and reading difficulty", "Coexisting neglect -> reduced awareness of the deficit"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["hemianopia", "hemianopsia", "visual field", "post chiasmal"]
    }),

    concept({
      name: "Visual field examination",
      category: "Neuro-ophthalmic assessment",
      aliases: ["visual-field localization", "visual field testing", "visual-field localization and testing", "confrontation fields", "localize visual pathway lesion", "quadrantanopia localization", "perimetry", "field cut examination"],
      definition: "Visual field examination uses the pattern of missing vision to identify where the retina-to-occipital pathway may be injured. Bedside confrontation is a screen; formal automated or kinetic perimetry maps defects more precisely and is needed when accuracy changes diagnosis, function, or safety decisions.",
      anatomy: "Retina and optic nerve carry monocular information, the chiasm contains crossing nasal-retinal fibers, and each post-chiasmal tract carries the opposite visual field from both eyes. Temporal and parietal optic radiations reach occipital cortex.",
      pathophysiology: "Monocular defects usually localize before the chiasm. A bitemporal pattern suggests chiasmal injury. A homonymous pattern localizes behind the chiasm; superior quadrantanopia often points toward temporal radiation and inferior quadrantanopia toward parietal radiation, although real lesions may not obey a perfect mnemonic.",
      clinicalSignificance: "Field testing requires stable fixation, adequate acuity, comprehension, and attention. Ptosis, cataract, refractive error, fatigue, poor technique, or neglect can create apparent deficits or hide true ones.",
      diagnostics: ["Test one eye at a time against the examiner's comparison field, sampling each quadrant while the patient fixates centrally.", "Vary stimulus size, movement, and bilateral simultaneous presentation when attention is in question.", "Confirm persistent or consequential defects with formal perimetry and targeted ocular, neurologic, and imaging evaluation."],
      nursingPriorities: ["Document the side and pattern rather than writing only 'vision impaired.'", "Institute fall and collision precautions while acute loss is evaluated.", "Teach scanning and environmental strategies and verify prescribed driving restrictions."],
      contraindications: ["Do not interpret confrontation testing as a high-sensitivity exclusion test.", "Do not move fingers predictably or allow the patient to shift fixation.", "Do not label an inattentive side a primary field cut without assessing neglect."],
      redFlags: ["Sudden monocular or homonymous loss", "Field defect with focal neurologic findings or severe headache", "Bitemporal loss with headache or endocrine symptoms", "Painful visual loss"],
      patientEducation: ["A field test checks the edges and halves of visual space while the eyes remain centered; it answers a different question from reading an acuity chart."],
      nclexTraps: ["Acuity and visual field are different functions.", "Bitemporal loss points toward the chiasm; homonymous loss points behind it.", "Bedside confrontation can miss subtle defects."],
      relatedTopics: ["Homonymous hemianopia", "Hemispatial neglect", "Optic neuritis", "Retinal artery occlusion", "Posterior cerebral artery stroke"],
      causalLinks: ["Lesion location along pathway -> characteristic field geometry -> localization clue", "Poor fixation or attention -> unreliable screen", "Formal perimetry -> reproducible map -> functional and diagnostic planning"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["visual field", "perimetry", "confrontation", "neuro ophthalmology"]
    }),

    concept({
      name: "Internal capsule",
      category: "Neuroanatomy",
      aliases: ["internal capsule anatomy", "posterior limb internal capsule", "genu internal capsule", "PLIC", "compact motor pathway brain"],
      abbreviations: ["PLIC"],
      definition: "The internal capsule is a compact deep white-matter corridor carrying ascending and descending fibers between cerebral cortex, thalamus, brainstem, and spinal cord. Because many motor and sensory fibers are tightly packed there, a small lesion can cause a dense contralateral deficit.",
      anatomy: "The anterior limb lies between caudate and lentiform nuclei, the genu contains many corticobulbar fibers, and the posterior limb carries corticospinal and sensory pathways. Retrolenticular and sublenticular portions carry visual and auditory-related fibers.",
      pathophysiology: "A deep infarct involving the posterior limb can interrupt face, arm, and leg motor output without cortical signs such as aphasia, neglect, or gaze deviation. Nearby thalamocortical sensory fibers can create a sensorimotor syndrome. Lesions above the pyramidal crossing usually cause contralateral weakness; acute weakness may be flaccid before hyperreflexia and spasticity evolve.",
      clinicalSignificance: "Chronic hypertension and diabetes can injure penetrating arteries, but lesion size and location do not prove small-vessel cause; embolism, parent-artery disease, hemorrhage, demyelination, tumor, and inflammation remain possible.",
      diagnostics: ["Map face, arm, and leg power with tone, reflexes, sensation, fields, language, gaze, and neglect.", "MRI diffusion is more sensitive than early CT for a small acute internal-capsule infarct.", "Evaluate vascular mechanism rather than assuming every compact lesion is a lacune."],
      nursingPriorities: ["Support the weak shoulder and never pull the arm during transfers.", "Assess swallowing and speech because corticobulbar fibers may be affected.", "Prevent falls, pressure injury, DVT, contracture, and learned nonuse through safe early rehabilitation."],
      contraindications: ["Do not equate a small imaging lesion with minor disability.", "Do not assume all face-arm-leg weakness localizes to the capsule.", "Do not expect upper-motor-neuron spasticity to be immediate."],
      redFlags: ["Sudden dense unilateral weakness", "New dysphagia or weak cough", "Extension of deficit or new cortical signs"],
      patientEducation: ["Many movement fibers pass through this small corridor, so a tiny deep stroke can cause major weakness."],
      nclexTraps: ["Internal-capsule injury can cause pure motor weakness without aphasia or neglect.", "Compact anatomy magnifies functional impact.", "Mechanism still requires a complete stroke workup."],
      relatedTopics: ["Corticospinal tract", "Lacunar stroke", "Cerebral arterial territories", "Upper motor neuron signs", "Post-stroke dysphagia screening"],
      causalLinks: ["Compact fiber injury -> face-arm-leg weakness", "Loss of descending inhibition -> later hyperreflexia and spasticity", "Deep lesion without cortical involvement -> absence of aphasia/neglect"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["internal capsule", "PLIC", "pure motor", "white matter"]
    }),

    concept({
      name: "Corticospinal tract",
      category: "Motor neuroanatomy",
      aliases: ["pyramidal tract", "motor tract", "corticospinal pathway", "upper motor neuron pathway", "lateral corticospinal tract"],
      abbreviations: ["CST"],
      definition: "The corticospinal tract is the major descending pathway for voluntary, skilled movement, especially fractionated distal-limb control. Neurons originate across motor-related cortex, descend through corona radiata and internal capsule, traverse brainstem pyramids, and mostly cross in the lower medulla before continuing in the lateral spinal cord.",
      anatomy: "Corticobulbar fibers branch toward cranial motor nuclei, while corticospinal fibers descend to spinal interneurons and motor neurons. Most fibers cross at the pyramidal decussation; therefore a lesion above the crossing usually weakens the opposite body side and a spinal lesion below it weakens the same side.",
      pathophysiology: "Acute interruption reduces voluntary activation and fine movement. Over time, loss of descending modulation produces hyperreflexia, spasticity, clonus, and an extensor plantar response. These upper-motor-neuron findings differ from lower-motor-neuron denervation, which more directly causes atrophy, fasciculation, and reduced reflexes.",
      clinicalSignificance: "Distribution plus accompanying signs localize the lesion: cortical injury may add aphasia or neglect, internal-capsule injury may cause dense pure motor weakness, brainstem injury may cause crossed cranial/body findings, and spinal injury may create a sensory level and bladder involvement.",
      diagnostics: ["Test strength by joint and side, pronator drift, speed/fractionation, tone, reflexes, plantar responses, sensation, cranial nerves, gait, and coordination.", "Use brain or spine imaging based on localization and time course.", "Consider stroke, compression, inflammation, demyelination, trauma, tumor, and degenerative disease rather than treating Babinski as a diagnosis."],
      nursingPriorities: ["Protect weak limbs and shoulders, use safe transfers, prevent falls and pressure injury, and begin prescribed range-of-motion and task practice.", "Monitor swallowing, cough, bladder, respiratory function, and rapid progression according to lesion level.", "Document evolving tone and reflexes rather than describing all weakness as flaccid or spastic."],
      contraindications: ["Do not localize from weakness alone without sensory, cranial-nerve, reflex, and cortical testing.", "Do not assume early flaccidity excludes an upper-motor-neuron lesion.", "Do not force a spastic joint through pain or resistance."],
      redFlags: ["Sudden unilateral weakness", "Rapid ascending or bilateral weakness", "Weakness with bowel/bladder dysfunction, sensory level, respiratory decline, or severe spine pain"],
      patientEducation: ["Recovery and safety depend on the lesion site and cause; spasticity may appear later even when the limb was initially limp."],
      nclexTraps: ["Above the medullary crossing usually means contralateral weakness.", "Spasticity can be delayed after acute injury.", "Corticospinal and lower-motor-neuron lesions have different reflex patterns."],
      relatedTopics: ["Internal capsule", "Upper motor neuron lesion", "Spinal cord tracts", "Stroke", "Brown-Sequard syndrome"],
      causalLinks: ["CST interruption -> loss of voluntary motor drive -> weakness", "Loss of descending inhibition -> hyperreflexia and spasticity", "Lesion relative to decussation -> side of weakness"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["corticospinal", "pyramidal tract", "upper motor neuron", "decussation"]
    }),

    concept({
      name: "Ischemic core",
      category: "Stroke pathophysiology and imaging",
      aliases: ["stroke core", "infarct core", "irreversibly injured brain tissue", "DWI core", "CT perfusion core"],
      definition: "The ischemic core is brain tissue with such severe and sustained perfusion failure that irreversible infarction is predicted or already established. It is surrounded in many acute strokes by less severely hypoperfused tissue that may remain salvageable, but the boundary evolves continuously rather than forming a fixed ring.",
      pathology: "Profound oxygen and glucose deprivation depletes ATP, disables ion pumps, depolarizes membranes, drives calcium entry and excitotoxicity, produces cytotoxic edema, and ultimately disrupts cell and microvascular integrity.",
      pathophysiology: "Core grows outward when collateral flow fails or reperfusion is delayed. Temperature, glucose, oxygen content, blood pressure, vessel location, and collateral anatomy change the rate. Reopening the artery can prevent additional penumbra from joining the core, but it cannot reliably regenerate tissue that is already infarcted.",
      clinicalSignificance: "Imaging core is an estimate. Diffusion restriction or CT-perfusion thresholds can overestimate or underestimate irreversible injury depending on timing, technical factors, reperfusion, motion, and posterior-fossa or small-lesion limitations; treatment selection follows validated protocols, not the label alone.",
      diagnostics: ["Use noncontrast CT or MRI to assess hemorrhage and established injury and CTA/MRA to identify the vessel.", "Use DWI/ADC or perfusion methods when the applicable treatment pathway requires tissue selection.", "Interpret image estimates with onset/last-known-well, deficit, collateral status, and scan quality."],
      nursingPriorities: ["Minimize avoidable treatment delay while maintaining reperfusion safety checks.", "Prevent hypotension, hypoxemia, fever, and severe glucose disturbance that can accelerate threatened-tissue failure.", "Trend neurologic findings after reperfusion for hemorrhage, edema, re-occlusion, or core expansion."],
      contraindications: ["Do not describe an imaging threshold as microscopic certainty.", "Do not delay standard-window treatment for advanced imaging that is not required by the pathway.", "Do not promise that reperfusion will restore established core function."],
      redFlags: ["Rapid neurologic worsening", "Large established hemispheric or cerebellar injury with edema risk", "Decline after reperfusion"],
      patientEducation: ["Treatment aims to stop threatened brain from becoming permanently injured; already infarcted tissue is not the part reperfusion is expected to revive."],
      nclexTraps: ["Core and penumbra are tissue states, not separate diseases.", "Core estimates are probabilistic.", "Collateral failure makes core grow."],
      relatedTopics: ["Ischemic penumbra", "Ischemic stroke", "Acute stroke imaging", "Mechanical thrombectomy", "Cerebral blood flow"],
      causalLinks: ["Severe sustained hypoperfusion -> ATP failure -> irreversible infarction", "Collateral failure or delay -> core expansion", "Reperfusion -> prevents additional threatened tissue from joining core"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["ischemic core", "infarct", "DWI", "CT perfusion"]
    }),

    concept({
      name: "Ischemic penumbra",
      category: "Stroke pathophysiology and imaging",
      aliases: ["stroke penumbra", "salvageable brain tissue", "tissue at risk", "perfusion diffusion mismatch", "threatened ischemic tissue"],
      definition: "The ischemic penumbra is hypoperfused brain tissue that has lost normal function but remains potentially recoverable if blood flow is restored before irreversible injury. Collateral circulation temporarily sustains it between normally perfused tissue and the expanding infarct core.",
      pathology: "Penumbra has inadequate energy for normal electrical activity but enough residual delivery to preserve cell structure for a limited time. Distal vessels are often maximally dilated, making the tissue sensitive to systemic pressure, oxygen content, temperature, and metabolic demand.",
      pathophysiology: "Without reperfusion, continued ATP shortage, excitotoxicity, edema, inflammation, and collateral failure convert penumbra into core. Good collaterals slow this process; poor collaterals accelerate it. This tissue-based variation explains why some later or unknown-onset patients remain eligible for advanced-imaging reperfusion pathways while others develop a large core early.",
      clinicalSignificance: "Penumbra is inferred from validated imaging and clinical context rather than directly seen as guaranteed viable neurons. Perfusion mismatch can include benign oligemia, artifact, or tissue that will not recover, so protocol thresholds and expert interpretation matter.",
      diagnostics: ["Identify the occluded vessel with CTA/MRA and estimate core-at-risk mismatch with validated perfusion or diffusion methods when indicated.", "Document last-known-well, baseline function, deficit severity, blood pressure, oxygenation, glucose, and collateral information.", "Do not withhold standard-window reperfusion while waiting for optional advanced imaging."],
      nursingPriorities: ["Protect oxygenation, perfusion, normothermia, and safe glucose range while reperfusion evaluation proceeds.", "Treat neurologic fluctuation as possible unstable collateral flow or re-occlusion.", "Coordinate rapid imaging and transfer without avoidable sequential delays."],
      contraindications: ["Do not call all tissue around a core salvageable.", "Do not equate symptom improvement with durable reperfusion.", "Do not apply one blood-pressure target across untreated stroke and post-reperfusion care."],
      redFlags: ["Fluctuating deficit with pressure change", "Cortical large-vessel-occlusion syndrome", "Worsening while awaiting transfer or treatment"],
      patientEducation: ["The threatened tissue is the reason stroke care is urgent: it may recover now but can become permanently injured as time and collateral support run out."],
      nclexTraps: ["Penumbra is dysfunctional but potentially viable.", "Time matters, but collateral biology makes tissue loss rates differ.", "Advanced imaging estimates rather than guarantees salvageability."],
      relatedTopics: ["Ischemic core", "Cerebral blood flow", "Collateral circulation", "Intravenous thrombolysis", "Mechanical thrombectomy"],
      causalLinks: ["Partial collateral flow -> temporary cell survival despite lost function", "Reperfusion -> restored substrate delivery -> possible recovery", "Persistent occlusion -> penumbra-to-core conversion"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["penumbra", "tissue at risk", "collaterals", "reperfusion"]
    }),

    concept({
      name: "Post-stroke dysphagia screening",
      category: "Stroke bedside assessment",
      aliases: ["stroke swallow screen", "bedside dysphagia screen after stroke", "NPO until swallow screen", "poststroke swallowing screen", "aspiration screen stroke"],
      definition: "Post-stroke dysphagia screening is a validated bedside safety screen performed before food, liquid, or oral medication to identify patients who may not swallow safely. It is a screen for aspiration risk, not a complete diagnostic swallowing evaluation, and inability to participate counts as failure to establish safety rather than a pass.",
      pathology: "Stroke can impair cortical planning, sensation, cranial motor control, timing, laryngeal closure, pharyngeal propulsion, cough, attention, or consciousness. Aspiration can be silent when laryngeal sensation or cough response is impaired.",
      pathophysiology: "Material entering the airway can cause obstruction, pneumonitis, or pneumonia. A normal voice or absence of cough does not prove protection, while an unnecessarily restrictive diet can worsen hydration, nutrition, medication delivery, and quality of life. Failed screening therefore triggers speech-language pathology and, when indicated, instrumental evaluation rather than permanent diet assignment by the screen alone.",
      clinicalSignificance: "The institution's validated tool, eligibility rules, trained examiner, and stop criteria must be followed. Informal sips or medication administration before screening defeat the safety purpose.",
      diagnostics: ["First assess alertness, posture, secretion handling, voice, cough, respiratory stability, and ability to follow the tool.", "Use the validated protocol exactly and stop with coughing, wet voice, respiratory change, or other specified failure.", "After failure or persistent concern, obtain comprehensive swallowing assessment and FEES or videofluoroscopy when it will guide the plan."],
      nursingPriorities: ["Keep NPO, including oral medications, until screening is passed or an alternate plan is ordered.", "Provide oral hygiene, upright positioning, suction readiness as indicated, and clear handoff of status.", "Arrange safe nonoral medication, hydration, and nutrition routes after failure rather than simply omitting essential therapy."],
      contraindications: ["Do not perform an oral trial in a patient who cannot maintain alertness or manage secretions unless the validated protocol explicitly directs it.", "Do not substitute a gag reflex for swallow safety.", "Do not assume a passed screen rules out every texture-specific or fatigue-related problem."],
      redFlags: ["Choking, cyanosis, or acute respiratory distress", "Wet voice, repeated cough, falling oxygenation, or inability to handle secretions", "Fever or respiratory decline after suspected aspiration"],
      patientEducation: ["The temporary NPO period protects the airway while the team determines the safest way to provide food, fluid, and medicine."],
      nclexTraps: ["Screening precedes oral intake.", "Silent aspiration may occur without cough.", "A screen identifies risk; it does not prescribe the final diet."],
      relatedTopics: ["Aspiration prevention", "Dysphagia", "Ischemic stroke", "Speech-language pathology", "Aspiration pneumonia"],
      causalLinks: ["Stroke network injury -> impaired swallow timing/sensation -> aspiration risk", "Validated screen failure -> diagnostic evaluation -> individualized route and texture", "Missed silent aspiration -> pneumonia and respiratory decline"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["swallow screen", "dysphagia", "NPO", "stroke nursing"]
    }),

    concept({
      name: "Aspiration prevention",
      category: "Airway and nursing safety",
      aliases: ["aspiration precautions", "prevent aspiration pneumonia", "swallow safety nursing", "airway protection during feeding", "aspiration risk reduction"],
      definition: "Aspiration prevention is a coordinated set of measures that reduce entry of food, liquid, saliva, gastric contents, or medication into the airway while preserving nutrition, hydration, comfort, and autonomy. It begins by identifying the mechanism of risk rather than applying one diet or positioning rule to everyone.",
      pathology: "Risk rises with dysphagia, impaired consciousness, weak cough, poor oral hygiene, reflux or vomiting, enteral feeding, sedatives, neurologic disease, frailty, and dependence for feeding. Aspiration may be overt or silent.",
      pathophysiology: "Airway invasion can obstruct airflow, chemically injure lung, or deliver pathogenic oral material that causes pneumonia. Tube feeding does not eliminate aspiration because saliva and refluxed gastric material can still enter the airway. Thickened liquid may slow flow for selected physiology but can reduce intake or leave residue, so texture requires individualized assessment.",
      clinicalSignificance: "Prevention combines swallowing assessment, alertness, upright posture, feeding pace, bite/sip size, prescribed texture, medication formulation, oral care, reflux/vomiting control, mobility, and secretion management. No single intervention makes aspiration impossible.",
      diagnostics: ["Assess alertness, voice, cough, secretion control, respiratory status, oral health, feeding dependence, and swallowing symptoms.", "Use speech-language and instrumental evaluation when bedside findings are uncertain or consequences are high.", "Investigate fever, hypoxemia, new infiltrate, wheeze, or respiratory decline while recognizing that aspiration pneumonitis and bacterial pneumonia are not identical."],
      nursingPriorities: ["Follow the current route, texture, posture, pace, assistance, and medication plan exactly.", "Provide regular oral care because reducing oral pathogen burden can reduce pneumonia risk.", "Stop feeding and assess immediately for choking, wet voice, coughing, respiratory change, or reduced alertness; keep suction and emergency response available as indicated."],
      contraindications: ["Do not feed a drowsy or unstable patient merely because a tray arrived.", "Do not use straws, thickener, crushed medication, or tube administration unless the individualized plan and medication formulation permit it.", "Do not assume a feeding tube prevents aspiration."],
      redFlags: ["Complete airway obstruction", "Acute hypoxemia or respiratory distress during intake", "Inability to manage secretions", "Recurrent fever or respiratory decline with suspected silent aspiration"],
      patientEducation: ["Safe swallowing strategies are specific to the person's physiology; follow the prescribed pace, posture, texture, and oral-care plan rather than copying another patient's precautions."],
      nclexTraps: ["Aspiration can be silent.", "Tube feeding does not eliminate aspiration.", "Oral care is an airway-safety intervention, not only comfort care."],
      relatedTopics: ["Post-stroke dysphagia screening", "Dysphagia", "Aspiration pneumonia", "Enteral feeding", "Airway obstruction"],
      causalLinks: ["Impaired airway closure or sensation -> material enters airway", "Oral pathogen burden plus aspiration -> pneumonia risk", "Individualized texture and positioning -> reduced but not eliminated airway invasion"],
      sourceKeys: ["aha-stroke-2026"],
      tags: ["aspiration precautions", "oral care", "dysphagia", "airway safety"]
    }),

    concept({
      name: "Glomerular filtration barrier",
      category: "Renal microanatomy and physiology",
      aliases: ["glomerular barrier", "kidney filtration barrier", "GBM podocyte barrier", "why albumin stays out of urine", "glomerular capillary wall"],
      abbreviations: ["GFB", "GBM"],
      definition: "The glomerular filtration barrier is the layered capillary interface that permits water and small solutes to enter Bowman space while retaining blood cells and most plasma proteins. It is a selective living structure, not a passive kitchen sieve.",
      anatomy: "The barrier includes fenestrated endothelium and its glycocalyx, the glomerular basement membrane, and podocyte foot processes joined by slit diaphragms. Mesangial cells support capillary loops and regulate matrix and filtration surface.",
      pathophysiology: "Endothelial or glycocalyx injury increases albumin passage, basement-membrane defects alter structural selectivity, and podocyte effacement or loss disrupts slit-diaphragm control. Hemodynamic stress can stretch these components. Filtered albumin is then taken up by proximal tubules, where excessive load promotes inflammatory and fibrotic signaling; proteinuria can therefore be both a marker and a mediator of progression.",
      clinicalSignificance: "Protein in urine can also result from reduced tubular reclamation or overflow of small abnormal proteins, so proteinuria is not automatically proof of primary glomerular disease.",
      diagnostics: ["Confirm persistent albuminuria with urine albumin-to-creatinine ratio and use total protein testing when nonalbumin proteins are possible.", "Examine urine sediment, eGFR trend, blood pressure, edema, serum albumin, and systemic clues.", "Use serology, electrophoresis, genetic testing, or biopsy when the pattern suggests immune, inherited, or monoclonal disease and results would change care."],
      nursingPriorities: ["Trend urine albumin and eGFR separately because barrier injury can precede a large filtration decline.", "Assess edema, weight, pressure, skin, infection, and thrombosis symptoms when protein loss is heavy.", "Escalate rapidly rising creatinine, oliguria, nephritic sediment, pulmonary-renal features, or pregnancy hypertension."],
      contraindications: ["Do not diagnose glomerular disease from foam alone.", "Do not treat one transient protein result as established chronic disease without confirmation.", "Do not assume all urinary protein is albumin."],
      redFlags: ["Proteinuria with rapidly falling kidney function", "Hematuria with casts or pulmonary hemorrhage", "Heavy protein loss with thrombosis symptoms", "Proteinuria in pregnancy with severe features"],
      patientEducation: ["A urine albumin test can reveal kidney and vascular injury before symptoms or a major creatinine change."],
      nclexTraps: ["Albuminuria is a subset of proteinuria.", "The filtration barrier normally retains cells and most protein, not every small molecule.", "Tubular and overflow proteinuria have different mechanisms."],
      relatedTopics: ["Proteinuria", "Albuminuria", "Nephrotic syndrome", "Glomerulonephritis", "Nephron anatomy", "Glomerular filtration rate physiology"],
      causalLinks: ["Podocyte or GBM injury -> albumin filtration -> albuminuria", "Filtered protein uptake -> tubular inflammation -> fibrosis", "Heavy albumin loss plus sodium retention -> edema"],
      sourceKeys: ["kdigo-ckd-2024", "niddk-kidney-function"],
      tags: ["glomerulus", "podocyte", "GBM", "slit diaphragm", "albuminuria"]
    }),

    concept({
      name: "Nephron anatomy",
      category: "Renal anatomy",
      aliases: ["parts of the nephron", "kidney microscopic anatomy", "glomerulus tubule collecting duct", "nephron segments", "how a nephron is organized"],
      abbreviations: ["PCT", "TAL", "DCT", "CD"],
      definition: "The nephron is the kidney's microscopic filtration and processing unit. A renal corpuscle creates ultrafiltrate, and a connected sequence of tubules reclaims needed water and solutes, secretes selected substances, and delivers final fluid to the collecting system.",
      anatomy: "The corpuscle contains glomerular capillaries within Bowman capsule. Filtrate flows through proximal tubule, thin descending and ascending limbs, thick ascending limb, distal convoluted tubule, connecting segment, and collecting duct. Peritubular capillaries and vasa recta return reabsorbed material and support exchange.",
      pathophysiology: "Cortical nephrons have shorter loops, while juxtamedullary nephrons have long loops essential for the medullary gradient. High-energy proximal and thick-ascending cells are vulnerable to ischemia and toxins. Segment location predicts the consequences of injury or medication because each part has different transporters, water permeability, oxygen demand, and hormonal control.",
      clinicalSignificance: "A person can make urine while filtration, solute clearance, or endocrine kidney function is poor. Nephron anatomy explains why urine volume alone cannot establish kidney health.",
      diagnostics: ["Map serum and urine patterns to a segment only after reviewing GFR, medications, intake, and changing illness.", "Use urinalysis and sediment to identify glomerular cells/casts, tubular epithelial injury, crystals, or infection.", "Interpret imaging for gross anatomy and obstruction; routine imaging does not show individual nephrons."],
      nursingPriorities: ["Connect urine output with creatinine/eGFR, electrolytes, acid-base status, weight, pressure, and exposure history.", "Recognize nephron sites of common diuretics and toxins because monitoring needs follow their targets.", "Escalate anuria, severe electrolyte disturbance, rapidly rising creatinine, or pulmonary edema."],
      contraindications: ["Do not equate the collecting duct with the nephron in every anatomic definition; it receives fluid from multiple nephrons.", "Do not infer the injured segment from one isolated urine value.", "Do not assume normal urine output means normal filtration."],
      redFlags: ["Abrupt oliguria or anuria", "Severe potassium or acid-base change", "Pigment urine with AKI", "Obstruction symptoms with kidney dysfunction"],
      patientEducation: ["The kidney filters first and then edits that fluid segment by segment; most filtered water and useful solutes are returned to blood."],
      nclexTraps: ["Glomerulus filters; tubules modify the filtrate.", "Juxtamedullary loops are central to concentration.", "Urine volume and GFR are related but not interchangeable."],
      relatedTopics: ["Segmental renal transport", "Glomerular filtration barrier", "Countercurrent multiplication", "Glomerular filtration rate physiology", "Acute tubular necrosis"],
      causalLinks: ["Glomerular filtration -> tubular processing -> final urine", "Segment specialization -> predictable transport pattern", "Tubular ischemia/toxin injury -> failed reabsorption, backleak, and obstruction -> AKI"],
      sourceKeys: ["niddk-kidney-function", "kdigo-aki-2012"],
      tags: ["nephron", "renal tubule", "glomerulus", "collecting duct"]
    }),

    concept({
      name: "Segmental renal transport",
      category: "Renal physiology",
      aliases: ["nephron segment transport", "what each nephron segment reabsorbs", "renal tubular transport map", "proximal loop distal collecting duct transport", "kidney reabsorption and secretion"],
      definition: "Segmental renal transport is the ordered reabsorption and secretion performed by successive nephron segments. Excretion equals filtration minus reabsorption plus secretion, so the final urine reflects both the initial filtered load and every downstream transport decision.",
      anatomy: "Proximal tubule performs bulk isosmotic reclamation; descending limb favors water movement; thick ascending limb reabsorbs salt without water; distal tubule refines sodium and calcium handling; collecting segments make hormone-sensitive sodium, potassium, acid, and water adjustments.",
      pathophysiology: "Proximal sodium gradients reclaim glucose, amino acids, phosphate, bicarbonate, and water. NKCC2 in the thick ascending limb helps dilute tubular fluid and build the medullary gradient. NCC in distal tubule and ENaC in collecting duct refine sodium balance; distal sodium delivery and aldosterone influence potassium and hydrogen secretion. Aquaporin-2 makes final water permeability ADH-responsive. Downstream adaptation can blunt chronic diuretic effect.",
      clinicalSignificance: "Transport defects and medications produce characteristic but overlapping electrolyte, volume, and acid-base patterns. Pattern recognition should guide questions, not substitute for confirming intake, GI loss, kidney function, and drug exposure.",
      diagnostics: ["Review serum electrolytes, bicarbonate, glucose, magnesium, phosphate, calcium, urine findings, and medication timing together.", "Distinguish filtered-load excess from transport failure—for example hyperglycemic glycosuria versus generalized proximal dysfunction.", "Use specialist urine studies or genetic evaluation when a persistent inherited tubulopathy is suspected."],
      nursingPriorities: ["Trend weight, pressure, orthostasis, rhythm, neuromuscular findings, intake/output, and relevant electrolytes after diuretic or tubular-toxin changes.", "Replace electrolytes only under a plan that accounts for ongoing losses and kidney function.", "Escalate ECG change, severe weakness, tetany, seizure, rapidly changing sodium, or profound polyuria."],
      contraindications: ["Do not assume all diuretics have the same site or calcium pattern.", "Do not assign a named tubulopathy from one value during acute illness.", "Do not overlook GI losses and shifts that mimic renal wasting."],
      redFlags: ["Severe potassium, magnesium, sodium, or acid-base disturbance", "Polyuria with hypotension", "Glycosuria plus acidosis and phosphate wasting", "Oliguria after toxin or ischemia"],
      patientEducation: ["Different kidney medicines work at different tubular sites, which is why each requires a different laboratory and symptom plan."],
      nclexTraps: ["The thick ascending limb moves salt but not water.", "More distal sodium delivery can increase potassium and hydrogen loss.", "ADH mainly changes collecting-duct water permeability."],
      relatedTopics: ["Nephron anatomy", "Countercurrent multiplication", "Renal concentrating mechanism", "Renal tubular acidosis", "Nephron diuretic site map"],
      causalLinks: ["Segment transporter activity -> solute movement -> serum and urine pattern", "Distal sodium delivery plus ENaC uptake -> potassium and hydrogen secretion", "TAL salt transport -> medullary gradient -> concentrating capacity"],
      sourceKeys: ["niddk-kidney-function", "kdigo-aki-2012"],
      tags: ["renal transport", "reabsorption", "secretion", "tubule"]
    }),

    concept({
      name: "Renal blood flow",
      category: "Renal hemodynamics",
      aliases: ["kidney blood flow", "renal perfusion", "RBF", "renal plasma flow", "blood supply to kidneys"],
      abbreviations: ["RBF", "RPF"],
      definition: "Renal blood flow is the blood volume delivered to the kidneys over time; renal plasma flow is the plasma portion available to the glomeruli. This high flow supports filtration, but oxygen distribution is uneven because the medulla operates near a lower oxygen tension while performing energy-intensive transport.",
      anatomy: "Renal arteries branch to interlobar, arcuate, and cortical vessels, then afferent arterioles and glomerular capillaries. Efferent arterioles form peritubular capillaries or vasa recta, coupling filtration to tubular reabsorption and medullary exchange.",
      pathophysiology: "Flow depends on systemic perfusion pressure, afferent and efferent resistance, blood viscosity, venous pressure, and autoregulation. Shock or afferent constriction reduces delivery; venous congestion narrows the transrenal pressure gradient. Redistribution and high tubular oxygen demand make outer medullary segments vulnerable even when total flow seems partly preserved.",
      clinicalSignificance: "Renal blood flow and GFR can move differently because arteriolar tone changes filtration pressure and fraction. A preserved urine volume does not prove adequate perfusion or clearance.",
      diagnostics: ["Assess MAP, pulses, capillary refill, orthostasis, JVP, edema, lungs, urine output, weight, and cardiac context.", "Trend creatinine/eGFR and urine sediment; routine creatinine is not a direct flow meter.", "Use Doppler or vascular imaging only when obstruction, thrombosis, renal-artery disease, or another structural question warrants it."],
      nursingPriorities: ["Avoid both uncorrected hypoperfusion and indiscriminate fluids that worsen venous congestion.", "Review NSAIDs, RAAS-active drugs, diuretics, contrast, and vasoactive changes in context.", "Escalate shock, flash pulmonary edema, anuria, or rapidly worsening kidney function."],
      contraindications: ["Do not equate renal blood flow with GFR.", "Do not assume every creatinine rise means true volume depletion.", "Do not use one urine sodium result as direct proof of renal perfusion."],
      redFlags: ["Shock or rapidly falling urine", "Severe hypertension with pulmonary edema", "Acute flank pain with vascular risk", "Congestion with progressive AKI"],
      patientEducation: ["Kidneys can receive too little effective flow from dehydration or low cardiac output, but severe venous congestion can also impair them despite extra body fluid."],
      nclexTraps: ["High total-body water does not guarantee good renal perfusion.", "Efferent tone can change GFR without a parallel change in RBF.", "The renal medulla is especially vulnerable to oxygen imbalance."],
      relatedTopics: ["Glomerular filtration rate physiology", "Filtration fraction", "Renal autoregulation", "Prerenal AKI", "Cardiorenal syndrome"],
      causalLinks: ["Lower arterial inflow -> reduced renal oxygen and filtration substrate", "Higher renal venous pressure -> reduced transrenal gradient -> congestion-related dysfunction", "Medullary oxygen demand plus limited delivery -> tubular injury vulnerability"],
      sourceKeys: ["niddk-kidney-function", "kdigo-aki-2012", "kdigo-ckd-2024"],
      tags: ["renal blood flow", "RBF", "renal plasma flow", "perfusion"]
    }),

    concept({
      name: "Glomerular filtration rate physiology",
      category: "Renal filtration physiology",
      aliases: ["GFR physiology", "what controls GFR", "how kidneys filter plasma", "filtration pressure kidney", "GFR explained"],
      abbreviations: ["GFR"],
      definition: "Glomerular filtration rate is the volume of ultrafiltrate formed by all functioning glomeruli per unit time. It reflects the product of filtration-barrier capacity and the net forces moving plasma water from glomerular capillaries into Bowman space.",
      pathology: "The driving forces include glomerular hydrostatic pressure opposed by Bowman-space hydrostatic pressure and plasma oncotic pressure. Filtration surface area and permeability, renal plasma flow, afferent/efferent tone, obstruction, and nephron number all matter.",
      pathophysiology: "Afferent constriction lowers inflow and filtration pressure. Moderate efferent constriction can support glomerular pressure during low perfusion, while intense constriction lowers flow and raises capillary oncotic pressure enough to limit filtration. Obstruction raises downstream pressure, and glomerular injury reduces surface or permeability. Remaining nephrons can hyperfilter after nephron loss, preserving total GFR temporarily at the cost of higher single-nephron stress.",
      clinicalSignificance: "Measured or estimated GFR is not identical to creatinine concentration. Creatinine generation, tubular secretion, muscle mass, diet, drugs, and non-steady-state illness affect estimates; eGFR is especially unreliable while creatinine is changing rapidly.",
      diagnostics: ["Trend creatinine-based eGFR and urine albumin rather than interpreting either alone.", "Use cystatin C or measured clearance when greater accuracy is clinically important and limitations are understood.", "Assess obstruction, perfusion, medications, urine sediment, and structural disease when GFR changes."],
      nursingPriorities: ["Review medication dosing and nephrotoxic exposure as filtration changes.", "Trend urine output but do not use it as a substitute for GFR.", "Escalate anuria, severe potassium/acidosis, pulmonary edema, or uremic neurologic/pericardial findings."],
      contraindications: ["Do not apply steady-state eGFR equations as exact values during rapidly evolving AKI.", "Do not call a small patient with low creatinine automatically normal.", "Do not infer total kidney function from GFR alone; tubular and endocrine functions add essential information."],
      redFlags: ["Rapidly falling filtration with oliguria", "Hyperkalemia or severe acidosis", "Pulmonary edema", "Uremic encephalopathy or pericarditic symptoms"],
      patientEducation: ["eGFR is an estimate of filtration; urine albumin and the trend over time reveal risks that one number can miss."],
      nclexTraps: ["Creatinine is a marker used to estimate GFR, not GFR itself.", "A patient can make urine with poor filtration.", "Hyperfiltration can conceal nephron loss early."],
      relatedTopics: ["Renal blood flow", "Filtration fraction", "Glomerular filtration barrier", "Creatinine clearance", "Chronic kidney disease"],
      causalLinks: ["Net filtration pressure times filtration coefficient -> GFR", "Nephron loss -> single-nephron hyperfiltration -> glomerular stress", "Obstruction -> higher Bowman-space pressure -> lower GFR"],
      sourceKeys: ["niddk-kidney-function", "kdigo-ckd-2024", "kdigo-aki-2012"],
      tags: ["GFR", "glomerular filtration", "eGFR", "creatinine"]
    }),

    concept({
      name: "Filtration fraction",
      category: "Renal hemodynamics",
      aliases: ["renal filtration fraction", "GFR divided by renal plasma flow", "FF kidney", "fraction of plasma filtered"],
      abbreviations: ["FF", "RPF", "GFR"],
      definition: "Filtration fraction is the fraction of renal plasma flow converted into glomerular ultrafiltrate, conventionally expressed as GFR divided by renal plasma flow. It describes the relationship between filtration and delivered plasma, not the percentage of whole blood or final urine volume.",
      pathology: "This is a derived physiologic ratio. Changes may reflect altered afferent or efferent resistance, plasma flow, filtration coefficient, oncotic pressure, or measurement assumptions rather than a single named disease.",
      pathophysiology: "Moderate efferent constriction can reduce renal plasma flow while preserving or raising glomerular pressure, increasing filtration fraction. As more water is filtered, protein concentration and oncotic pressure rise along the glomerular capillary and peritubular capillaries, influencing the limit to filtration and favoring downstream reabsorption. Intense efferent constriction can eventually reduce GFR despite a high ratio.",
      clinicalSignificance: "A higher or lower filtration fraction is not automatically beneficial or harmful. Meaning depends on absolute GFR, plasma flow, volume state, medications, and disease. Routine clinical care usually estimates GFR more often than directly measuring renal plasma flow.",
      diagnostics: ["Calculate only when GFR and renal plasma flow are measured or estimated by compatible methods and time points.", "Interpret with blood pressure, volume/congestion, RAAS state, and arteriolar medication effects.", "Do not derive a bedside filtration fraction from serum creatinine and urine output alone."],
      nursingPriorities: ["Use the concept to understand hemodynamic medication effects, not as an independent bedside target.", "Trend perfusion, congestion, creatinine, potassium, and urine output when renal hemodynamics change.", "Communicate whether values are measured or estimated."],
      contraindications: ["Do not confuse filtration fraction with ejection fraction or fractional excretion of sodium.", "Do not use a ratio without checking the absolute GFR and flow.", "Do not infer a specific arteriolar lesion from the ratio alone."],
      redFlags: ["A falling GFR with systemic hypoperfusion", "Abrupt kidney decline after major hemodynamic change", "Severe hyperkalemia or oliguria"],
      patientEducation: ["The ratio describes how much delivered plasma is filtered at the glomerulus; it is not the amount of urine ultimately produced."],
      nclexTraps: ["FF = GFR/RPF.", "It is not FeNa and not ejection fraction.", "A ratio can rise even while absolute renal flow falls."],
      relatedTopics: ["Renal blood flow", "Glomerular filtration rate physiology", "Renal autoregulation", "Renin physiology", "Fractional excretion of sodium"],
      causalLinks: ["Moderate efferent constriction -> RPF falls relative to GFR -> FF rises", "Higher FF -> greater peritubular oncotic force -> favors reabsorption", "Extreme flow reduction -> rising oncotic pressure and low delivery -> GFR eventually falls"],
      sourceKeys: ["niddk-kidney-function", "kdigo-ckd-2024"],
      tags: ["filtration fraction", "GFR", "RPF", "renal hemodynamics"]
    }),

    concept({
      name: "Renal autoregulation",
      category: "Renal hemodynamics",
      aliases: ["kidney autoregulation", "renal blood flow autoregulation", "myogenic response kidney", "renal perfusion feedback", "autoregulation of GFR"],
      definition: "Renal autoregulation is the kidney's local ability to buffer renal blood flow and glomerular filtration against moderate changes in perfusion pressure. The main mechanisms are the afferent arteriolar myogenic response and tubuloglomerular feedback.",
      pathology: "Vascular smooth muscle constricts when stretched and relaxes as pressure falls. The macula densa adjusts afferent tone and renin signaling according to tubular sodium-chloride delivery. Prostaglandins and angiotensin II help preserve filtration during stress but also create medication-sensitive dependencies.",
      pathophysiology: "Within its working range, autoregulation limits transmission of systemic pressure to glomerular capillaries. Severe hypotension, shock, renal-artery disease, sepsis, CKD, or combined arteriolar drug effects can exceed or disrupt reserve. NSAID-mediated prostaglandin inhibition can remove afferent support, while ACE inhibitor or ARB therapy reduces efferent support; during low effective perfusion the combination may produce a hemodynamic GFR fall.",
      clinicalSignificance: "The useful range varies with chronic hypertension, vascular disease, age, and acute illness. A memorized pressure range is not an individual treatment target.",
      diagnostics: ["Interpret kidney-function changes with MAP, orthostasis, congestion, urine output, and the timing of NSAIDs, RAAS agents, diuretics, anesthesia, or sepsis.", "Use urine sediment and imaging to exclude intrinsic injury and obstruction.", "Follow the trend after correcting hemodynamics rather than assuming every change is reversible autoregulation."],
      nursingPriorities: ["Avoid unplanned hypotension and review potentially interacting hemodynamic medicines during acute illness.", "Monitor creatinine, potassium, pressure, intake/output, weight, and symptoms after therapy changes.", "Escalate progressive oliguria, shock, pulmonary edema, or severe electrolyte change."],
      contraindications: ["Do not assume autoregulation prevents AKI during shock.", "Do not automatically stop long-term kidney-protective therapy for every small stable creatinine change; assess context.", "Do not automatically give fluid for every hemodynamic GFR decline when congestion is present."],
      redFlags: ["Persistent hypotension with falling urine output", "Progressive creatinine rise despite hemodynamic correction", "Hyperkalemia, pulmonary edema, or anuria"],
      patientEducation: ["During vomiting, poor intake, or acute illness, medicines that affect kidney pressure may need clinician-guided review; do not stop or continue them blindly."],
      nclexTraps: ["Autoregulation has limits.", "Myogenic response and tubuloglomerular feedback are distinct mechanisms.", "Afferent and efferent drug effects become most important when perfusion reserve is low."],
      relatedTopics: ["Renal blood flow", "Glomerular filtration rate physiology", "Tubuloglomerular feedback", "Renin physiology", "Prerenal AKI"],
      causalLinks: ["Higher afferent pressure -> myogenic constriction -> buffered glomerular pressure", "High distal NaCl -> afferent feedback constriction -> lower GFR", "Loss of compensatory arteriolar tone during low perfusion -> hemodynamic AKI"],
      sourceKeys: ["niddk-kidney-function", "kdigo-aki-2012", "kdigo-ckd-2024"],
      tags: ["renal autoregulation", "myogenic", "tubuloglomerular feedback"]
    }),

    concept({
      name: "Renin physiology",
      category: "Renal endocrine physiology",
      aliases: ["renin", "kidney renin release", "juxtaglomerular renin", "renin angiotensin physiology", "what stimulates renin"],
      abbreviations: ["RAAS", "PRA"],
      definition: "Renin is a proteolytic enzyme released by juxtaglomerular cells that initiates the renin-angiotensin-aldosterone system. It links perceived renal underperfusion, sympathetic stimulation, and low macula-densa sodium-chloride delivery to vascular tone, sodium conservation, and potassium regulation.",
      anatomy: "Renin-producing cells lie in afferent arteriolar walls near the macula densa. Renin cleaves liver-derived angiotensinogen to angiotensin I, which is converted to angiotensin II; downstream signaling stimulates aldosterone and affects arterioles, thirst, ADH, and sodium handling.",
      pathophysiology: "Angiotensin II supports systemic pressure and preferential efferent arteriolar tone during reduced perfusion, while aldosterone promotes distal sodium retention and potassium/hydrogen secretion. This response is protective in acute underfilling but chronic or inappropriate activation contributes to hypertension, remodeling, fibrosis, edema, and hypokalemia. Sodium retention and rising perfusion normally suppress renin through feedback.",
      clinicalSignificance: "Renin concentration or activity is highly sensitive to posture, sodium intake, time, medications, potassium, kidney function, and volume state. It is interpreted with aldosterone under a controlled diagnostic protocol, not as a routine measure of all hypertension or CKD.",
      diagnostics: ["When evaluating aldosterone-renin relationships, follow protocol for posture, timing, potassium, sodium, and medication review.", "Interpret renin with aldosterone and the clinical question; resistant hypertension, hypokalemia, or suspected renovascular disease requires a targeted pathway.", "Assess perfusion and medications before labeling a high renin value pathologic."],
      nursingPriorities: ["Document medication, posture, collection time, potassium, and preparation for specialized sampling.", "Monitor pressure, orthostasis, potassium, and kidney function with RAAS-active therapy.", "Escalate hypertensive emergency, severe hypokalemia, hyperkalemia, or rapid kidney decline."],
      contraindications: ["Do not interpret renin in isolation.", "Do not call renin a hormone that directly retains sodium; it initiates a cascade.", "Do not ignore medication and volume effects on the result."],
      redFlags: ["Severe resistant hypertension with end-organ symptoms", "Marked potassium disturbance", "Flash pulmonary edema with renovascular concern"],
      patientEducation: ["Renin is the kidney's signal that starts a blood-pressure and salt-conservation cascade; medicines may block different steps of that cascade."],
      nclexTraps: ["Low perfusion, sympathetic beta-1 input, and low macula-densa NaCl stimulate renin.", "Aldosterone is downstream from renin.", "RAAS can preserve filtration acutely while causing chronic cardiovascular and kidney harm when overactive."],
      relatedTopics: ["Renal autoregulation", "Aldosterone", "Renal artery stenosis", "Primary hyperaldosteronism", "ACE inhibitors"],
      causalLinks: ["Low afferent pressure or low distal NaCl -> renin release", "Renin -> angiotensin II -> efferent support, vasoconstriction, aldosterone", "Chronic RAAS activation -> sodium retention and remodeling"],
      sourceKeys: ["niddk-kidney-function", "kdigo-ckd-2024"],
      tags: ["renin", "RAAS", "juxtaglomerular", "angiotensin"]
    }),

    concept({
      name: "Erythropoietin physiology",
      category: "Renal and hematologic physiology",
      aliases: ["erythropoietin", "EPO physiology", "kidney red blood cell hormone", "renal EPO production", "hypoxia erythropoiesis signal"],
      abbreviations: ["EPO"],
      definition: "Erythropoietin is a glycoprotein hormone produced mainly by specialized renal interstitial cells in response to reduced local oxygen signaling. It supports survival and maturation of erythroid precursors in bone marrow, increasing red-cell production when iron, vitamins, marrow function, and time are adequate.",
      anatomy: "EPO-producing fibroblast-like cells lie in renal cortical and outer-medullary interstitium. Hypoxia-inducible factor pathways regulate transcription according to cellular oxygen sensing.",
      pathophysiology: "When oxygen availability falls, stabilized hypoxia signaling increases EPO, which prevents apoptosis of erythroid progenitors. New reticulocytes then enter circulation over days. CKD interstitial injury disrupts this response; inflammation also raises hepcidin and restricts usable iron, so CKD anemia is not pure hormone deficiency and may respond poorly when iron, infection, bleeding, or inflammation is unresolved.",
      clinicalSignificance: "An EPO level is not routinely needed to diagnose typical CKD anemia. Hemoglobin, reticulocyte response, iron indices, B12/folate, bleeding, hemolysis, inflammation, marrow disease, and kidney function establish the broader mechanism.",
      diagnostics: ["Evaluate CBC pattern, reticulocytes, ferritin, transferrin saturation, B12/folate, bleeding and hemolysis before attributing anemia solely to CKD.", "Use EPO testing only for a defined differential where it changes interpretation.", "Monitor hemoglobin trajectory, iron availability, pressure, thrombosis risk, and symptoms when erythropoiesis-directed therapy is used."],
      nursingPriorities: ["Do not assume fatigue in CKD is always anemia or that every anemia is EPO deficiency.", "Ensure adequate iron assessment and follow the prescribed monitoring interval.", "Escalate chest pain, severe dyspnea, syncope, unstable bleeding, thrombosis symptoms, or severe hypertension."],
      contraindications: ["Do not use erythropoiesis therapy as an immediate substitute for transfusion in unstable life-threatening anemia.", "Do not chase a normal-population hemoglobin without weighing thrombosis and cardiovascular risk.", "Do not give iron automatically when overload or another anemia mechanism is possible."],
      redFlags: ["Symptomatic severe anemia", "Active hemorrhage", "New thrombosis or hypertensive crisis during therapy", "Failure to respond suggesting bleeding, inflammation, deficiency, or marrow disease"],
      patientEducation: ["EPO tells marrow to make red cells but does not supply iron; improvement takes time and requires monitoring."],
      nclexTraps: ["Kidneys are the major adult EPO source.", "EPO stimulates marrow; it is not a red-cell transfusion.", "Inflammation and iron restriction commonly coexist with CKD EPO deficiency."],
      relatedTopics: ["Anemia of chronic kidney disease", "Iron studies", "Hepcidin", "Chronic kidney disease", "Erythropoiesis-stimulating agents"],
      causalLinks: ["Renal hypoxia sensing -> EPO -> erythroid precursor survival -> reticulocyte production", "CKD interstitial injury -> inadequate EPO response -> anemia", "Inflammation -> hepcidin -> iron restriction -> impaired erythropoietic response"],
      sourceKeys: ["kdigo-anemia-2026", "niddk-kidney-function", "kdigo-ckd-2024"],
      tags: ["erythropoietin", "EPO", "erythropoiesis", "CKD anemia"]
    }),

    concept({
      name: "Vitamin D physiology",
      category: "Endocrine and mineral physiology",
      aliases: ["vitamin D metabolism", "calcitriol physiology", "kidney activates vitamin D", "calcium phosphate vitamin D", "1 alpha hydroxylase"],
      abbreviations: ["25-OH-D", "1,25-(OH)2-D", "FGF23", "PTH"],
      definition: "Vitamin D physiology links skin or dietary precursor, liver conversion to 25-hydroxyvitamin D, and regulated renal conversion to active 1,25-dihydroxyvitamin D (calcitriol). Calcitriol increases intestinal calcium and phosphate absorption and participates in feedback among parathyroid hormone, FGF23, bone, and kidney.",
      anatomy: "The liver performs 25-hydroxylation, while proximal tubular 1-alpha-hydroxylase produces calcitriol. Skin synthesis depends on ultraviolet exposure; storage and transport involve fat and vitamin-D-binding protein.",
      pathophysiology: "PTH promotes renal calcitriol production when calcium signaling is low, while FGF23 and high phosphate suppress it. CKD reduces functioning proximal tubular mass and raises phosphate/FGF23, lowering calcitriol and contributing to secondary hyperparathyroidism. Deficiency or impaired activation reduces mineral availability for bone, but calcium, phosphate, PTH, and bone turnover depend on the full disease context.",
      clinicalSignificance: "25-hydroxyvitamin D is generally the preferred marker of body stores; calcitriol may be normal or high in ordinary deficiency and is measured for selected disorders. Total calcium also depends on albumin and pH, while ionized calcium reflects the active fraction more directly.",
      diagnostics: ["Select 25-hydroxyvitamin D for nutritional status and reserve calcitriol testing for a defined indication.", "Interpret calcium, phosphate, PTH, alkaline phosphatase, kidney function, magnesium, diet, malabsorption, and medications together.", "In CKD, use serial trends and guideline context rather than one isolated mineral value."],
      nursingPriorities: ["Verify which vitamin-D form is prescribed because nutritional precursors and active analogs are not interchangeable.", "Monitor calcium and phosphate as ordered and review antacids, supplements, binders, and timing.", "Escalate symptomatic calcium disturbance, pathologic fracture, severe weakness, or toxicity symptoms."],
      contraindications: ["Do not treat calcitriol and 25-hydroxyvitamin D as the same laboratory test.", "Do not assume more supplementation is harmless; hypercalcemia and hypercalciuria can cause injury.", "Do not interpret total calcium without albumin/pH context when accuracy matters."],
      redFlags: ["Tetany, seizure, laryngospasm, or dysrhythmia with hypocalcemia", "Confusion, dehydration, vomiting, or AKI with hypercalcemia", "Fracture or severe bone pain"],
      patientEducation: ["The kidneys activate vitamin D, so advanced kidney disease can disrupt calcium, phosphate, parathyroid, and bone regulation even when intake is adequate."],
      nclexTraps: ["25-hydroxyvitamin D reflects stores; calcitriol is the active hormone.", "PTH and FGF23 regulate renal activation.", "CKD mineral-bone disease is not simply nutritional vitamin-D deficiency."],
      relatedTopics: ["Calcitriol", "Parathyroid hormone", "CKD-mineral and bone disorder", "Hypocalcemia", "Hyperphosphatemia", "Osteomalacia"],
      causalLinks: ["Skin/diet precursor -> liver 25-hydroxylation -> renal 1-alpha-hydroxylation -> calcitriol", "Calcitriol -> intestinal calcium/phosphate absorption", "CKD plus FGF23/phosphate retention -> lower calcitriol -> secondary hyperparathyroidism"],
      sourceKeys: ["kdigo-ckd-mbd-2017", "niddk-kidney-function", "kdigo-ckd-2024"],
      tags: ["vitamin D", "calcitriol", "PTH", "FGF23", "mineral metabolism"]
    }),

    concept({
      name: "Free drug concentration",
      category: "Clinical pharmacokinetics",
      aliases: ["free drug level", "unbound drug concentration", "active drug concentration", "total versus free level", "free phenytoin", "free valproate"],
      definition: "Free drug concentration is the amount of medication in plasma that is not bound to protein. The unbound fraction can cross many membranes, reach receptors, undergo metabolism, and be filtered, while total concentration includes both free and protein-bound drug.",
      pathology: "This is pharmacokinetic physiology rather than a disease. A total level can misrepresent active exposure when albumin, uremic solutes, bilirubin, pregnancy, critical illness, competing drugs, or saturable binding changes the free fraction.",
      pathophysiology: "Bound and unbound molecules exist in reversible equilibrium. If binding sites decrease or competing ligands displace drug, the free fraction initially rises. Free drug then distributes and is cleared, so the total concentration may fall even while unbound exposure remains therapeutic or toxic. Highly bound drugs with narrow therapeutic windows, such as phenytoin and valproate, make this mismatch clinically important.",
      clinicalSignificance: "The measured free concentration must still be interpreted with dose, formulation, draw timing, indication, symptoms, organ function, and assay-specific range. Unbound does not mean permanently active: free drug is also the fraction most available for clearance.",
      diagnostics: ["Order a direct free level when abnormal binding is likely and the result will change a high-consequence decision.", "Record exact administration, formulation, steady-state context, and sample time.", "Interpret albumin, renal and liver function, bilirubin, pregnancy, critical illness, dialysis, and interacting drugs with the result."],
      nursingPriorities: ["Recognize toxicity despite a low or ordinary total level, especially with hypoalbuminemia or uremia.", "Document neurologic, bleeding, sedation, and seizure-control findings with sample timing.", "Question a large dose change based only on a correction formula when the patient is critically ill or the clinical picture conflicts."],
      contraindications: ["Do not change a dose from a portal result without prescriber review.", "Do not treat a population reference interval as a substitute for the patient's response.", "Do not assume a higher free fraction always produces a proportionally higher steady free concentration because clearance also changes."],
      redFlags: ["Ataxia, nystagmus, dysarthria, confusion, severe sedation, bleeding, or seizure change", "Large mismatch between total level and bedside effect", "Rapid organ-function or albumin change during a narrow-therapeutic-index drug"],
      patientEducation: ["A printed total drug level may not show how much medication is unbound and active; timing, protein, kidney function, and symptoms all matter."],
      nclexTraps: ["Free concentration and free fraction are related but not identical.", "Only unbound drug reaches many targets readily, but only unbound drug is also readily cleared.", "A low total level can coexist with toxic free exposure."],
      relatedTopics: ["Plasma protein binding", "Therapeutic drug monitoring", "Phenytoin", "Valproate", "Hypoalbuminemia"],
      causalLinks: ["Fewer or occupied binding sites -> larger free fraction", "More free drug -> greater receptor access and clearance", "Abnormal binding -> total level diverges from active exposure"],
      sourceKeys: ["dailymed-dilantin", "dailymed-depakote"],
      tags: ["free drug", "unbound concentration", "therapeutic drug monitoring"]
    }),

    concept({
      name: "Plasma protein binding",
      category: "Clinical pharmacokinetics",
      aliases: ["drug protein binding", "albumin binding", "alpha-1 acid glycoprotein binding", "bound versus unbound drug", "drug displacement from albumin"],
      abbreviations: ["AAG"],
      definition: "Plasma protein binding is reversible attachment of medication molecules to circulating proteins, chiefly albumin for many acidic drugs and alpha-1-acid glycoprotein for many basic drugs. Binding acts as a dynamic reservoir that limits immediate distribution while drug repeatedly associates and dissociates.",
      pathology: "Binding depends on protein concentration and affinity, drug concentration, endogenous competitors, pH, illness, and other medications. Albumin falls with inflammation, liver disease, malnutrition, burns, pregnancy, and dilution; uremic solutes or bilirubin can compete even when albumin is not profoundly low.",
      pathophysiology: "Only unbound molecules readily cross many capillaries and reach receptors or clearance organs. A displacement interaction can briefly raise free drug, but increased distribution and clearance may reduce the long-term effect unless the drug has a narrow therapeutic index, limited clearance, simultaneous metabolic inhibition, or rapidly changing physiology. Saturable binding makes the free fraction rise nonlinearly at high concentrations for selected drugs such as valproate.",
      clinicalSignificance: "Percent bound is not a fixed property in every patient. Protein binding affects apparent volume of distribution, dialysis removal, total-level interpretation, onset, and clearance, but it must be considered with the drug's full pharmacokinetics.",
      diagnostics: ["Review albumin, renal/liver function, bilirubin, pregnancy, critical illness, concentration, and interacting ligands when total level and effect disagree.", "Measure free concentration directly when available and clinically consequential.", "Use correction equations only as estimates and respect drug- and assay-specific limitations."],
      nursingPriorities: ["Assess for drug-specific toxicity instead of chasing a total number.", "Verify timing and formulation when collecting levels.", "Communicate dialysis, albumin infusion, nutrition, organ-function, and interaction changes that may shift binding."],
      contraindications: ["Do not assume two highly bound drugs will always cause a clinically important displacement interaction.", "Do not equate protein binding with protein metabolism.", "Do not infer low active exposure solely from a low total concentration in hypoalbuminemia."],
      redFlags: ["Toxicity with an apparently therapeutic total level", "Marked hypoalbuminemia or uremia with a narrow-therapeutic-index drug", "Abrupt interaction or organ-function change"],
      patientEducation: ["Blood proteins temporarily carry some medicines; illness can change that balance, so symptoms and correctly timed levels matter."],
      nclexTraps: ["Binding is reversible.", "Displacement alone does not guarantee sustained toxicity because free drug can redistribute and clear.", "Albumin and alpha-1-acid glycoprotein bind different drug patterns."],
      relatedTopics: ["Free drug concentration", "Volume of distribution", "Therapeutic drug monitoring", "Hypoalbuminemia", "Hemodialysis drug clearance"],
      causalLinks: ["Lower albumin or competing ligand -> higher free fraction", "Free drug distribution/clearance -> re-equilibration with bound reservoir", "Saturable binding -> disproportionate free fraction at higher concentration"],
      sourceKeys: ["dailymed-dilantin", "dailymed-depakote"],
      tags: ["protein binding", "albumin", "AAG", "displacement"]
    }),

    concept({
      name: "Opioid tolerance",
      category: "Pain pharmacology and medication safety",
      aliases: ["tolerance to opioids", "opioid dose tolerance", "opioid pharmacodynamic adaptation", "needing more opioid for same effect", "cross tolerance opioids"],
      definition: "Opioid tolerance is physiologic adaptation in which repeated exposure produces less effect from the same dose or requires greater exposure to reproduce a prior effect. Tolerance may develop at different rates to analgesia, euphoria, sedation, respiratory depression, nausea, or other effects and is not by itself opioid use disorder.",
      pathology: "This is receptor and neural-network adaptation rather than a moral behavior or allergy. Receptor desensitization, signaling changes, altered trafficking, and counter-regulatory pain and stress pathways contribute; disease progression and new injury can mimic apparent analgesic tolerance.",
      pathophysiology: "Repeated mu-receptor signaling recruits cellular processes that oppose the drug effect. Cross-tolerance between opioids is often incomplete, so an equianalgesic calculation does not guarantee equal safety after switching. Tolerance falls during abstinence, hospitalization, incarceration, detoxification, or treatment interruption, making a previously used amount potentially fatal. Tolerance to respiratory depression may be incomplete and is destabilized by sedatives or acute illness.",
      clinicalSignificance: "Dose escalation should trigger reassessment of diagnosis, function, timing, adherence, withdrawal, interaction, opioid-induced hyperalgesia, and goals. Tolerance alone does not prove addiction, but it also does not make high doses safe.",
      diagnostics: ["Compare pain, function, sedation, breathing, dose timing, duration of benefit, withdrawal features, and disease trajectory.", "Review alcohol, benzodiazepines, gabapentinoids, sleep apnea, renal/liver change, and formulation or route changes.", "Distinguish tolerance from physical dependence, opioid-induced hyperalgesia, and opioid use disorder using their defining features."],
      nursingPriorities: ["Assess pain and sedation/ventilation separately before and after doses.", "Treat an opioid rotation as a new safety period because cross-tolerance is incomplete.", "Provide overdose-reversal education and escalate difficult arousal, shallow breathing, cyanosis, or rising carbon dioxide."],
      contraindications: ["Do not increase dose automatically when pain worsens.", "Do not assume a tolerant patient is protected from respiratory depression.", "Do not equate tolerance with addiction or physical dependence."],
      redFlags: ["Dose escalation with worsening pain, allodynia, sedation, or declining function", "Return to a prior amount after abstinence", "Opioid plus other sedatives with slow or shallow breathing"],
      patientEducation: ["Tolerance can reduce some effects over time, but it is incomplete and falls after a break; never resume or increase an old amount without clinical guidance."],
      nclexTraps: ["Tolerance, physical dependence, and OUD are distinct.", "Cross-tolerance is incomplete.", "Loss of tolerance is a major overdose risk."],
      relatedTopics: ["Physical dependence", "Opioid use disorder", "Opioid-induced hyperalgesia", "Opioid respiratory depression", "Naloxone"],
      causalLinks: ["Repeated receptor exposure -> adaptive signaling -> reduced same-dose effect", "Abstinence -> lost tolerance -> overdose risk at prior dose", "Incomplete cross-tolerance -> switch-related overdose risk"],
      sourceKeys: ["cdc-opioid-guideline-2022", "fda-opioid-labeling-2023", "samhsa-tip63"],
      tags: ["opioid tolerance", "cross tolerance", "overdose risk"]
    }),

    concept({
      name: "Physical dependence",
      category: "Medication adaptation and withdrawal",
      aliases: ["physiologic dependence", "drug physical dependence", "opioid physical dependence", "withdrawal adaptation", "body dependent on medicine"],
      definition: "Physical dependence is physiologic adaptation in which abrupt reduction, discontinuation, or receptor blockade produces a withdrawal syndrome. It can occur during correctly prescribed therapy and does not by itself mean craving, impaired control, compulsive use, or substance use disorder.",
      pathology: "Repeated exposure causes homeostatic changes that oppose the drug's ongoing effect. The withdrawal pattern is drug-class specific: opioid withdrawal differs from alcohol, benzodiazepine, corticosteroid, antidepressant, beta-blocker, or clonidine withdrawal and carries different urgency.",
      pathophysiology: "With opioids, chronic mu signaling suppresses autonomic and noradrenergic activity; compensatory signaling increases. When agonism abruptly falls, that compensation becomes unopposed, causing yawning, tearing, sweating, mydriasis, restlessness, pain, vomiting, diarrhea, tachycardia, and hypertension. Antagonists or a high-affinity partial agonist started at the wrong time can precipitate an abrupt syndrome.",
      clinicalSignificance: "Dependence is expected with many sustained therapies and is managed through medication-specific planning. OUD requires a broader pattern of impaired control and continued use despite harm; tolerance and withdrawal alone during appropriate medical treatment do not establish it.",
      diagnostics: ["Identify the exact medication, formulation, duration, dose pattern, last exposure, receptor antagonist, and other substances.", "Compare symptoms with the expected drug-specific withdrawal timeline and exclude infection, toxicity, endocrine crisis, GI disease, pain emergency, or psychiatric crisis.", "Assess dehydration, pregnancy, cardiovascular risk, suicidality, and overdose risk after tolerance loss."],
      nursingPriorities: ["Do not abruptly omit a dependence-producing medication without assessing the prescribed taper or substitution plan.", "Monitor hydration, orthostasis, mental status, autonomic findings, GI losses, pain, and respiratory status.", "Plan overdose prevention when opioid tolerance will fall."],
      contraindications: ["Do not use the word dependence as a synonym for addiction.", "Do not assume all withdrawal syndromes are harmless; alcohol/benzodiazepine or adrenal withdrawal can be life-threatening.", "Do not force a rapid taper without a specific urgent safety reason and clinical plan."],
      redFlags: ["Seizure, delirium, severe autonomic instability, or adrenal-crisis features", "Pregnancy instability or inability to maintain hydration", "Return to opioid use after abstinence", "Sedation and slow breathing suggesting intoxication rather than withdrawal"],
      patientEducation: ["Physical dependence means the body has adapted; it is not a character flaw or proof of addiction. Medication changes should be supervised to prevent withdrawal and other harms."],
      nclexTraps: ["Dependence is defined by withdrawal after reduction.", "Tolerance is reduced effect; OUD is impaired-control and harm behavior.", "Withdrawal severity and danger depend on the drug class."],
      relatedTopics: ["Opioid tolerance", "Opioid withdrawal", "Opioid use disorder", "Benzodiazepine withdrawal", "Corticosteroid withdrawal"],
      causalLinks: ["Repeated exposure -> homeostatic opposition -> physical dependence", "Abrupt reduction or blockade -> unopposed adaptation -> withdrawal", "Abstinence -> lower opioid tolerance -> overdose vulnerability"],
      sourceKeys: ["cdc-opioid-guideline-2022", "fda-opioid-labeling-2023", "samhsa-tip63"],
      tags: ["physical dependence", "withdrawal", "adaptation"]
    }),

    concept({
      name: "Central sensitization",
      category: "Pain physiology",
      aliases: ["central pain sensitization", "spinal sensitization", "pain amplification network", "wind-up pain", "nociplastic amplification"],
      definition: "Central sensitization is increased responsiveness of nociceptive neurons and pain-processing networks within the central nervous system. It can make pain responses larger, longer, or more widespread than the current peripheral input alone would predict and can contribute to hyperalgesia and allodynia.",
      pathology: "Repeated or intense nociceptive input can strengthen excitatory synapses, reduce inhibitory control, recruit normally low-threshold inputs, expand receptive fields, and alter descending modulation in spinal and brain networks. Sleep loss, stress, mood, expectation, and prior trauma can modulate the same real neural system without making pain imaginary.",
      pathophysiology: "Short-term wind-up reflects progressively larger dorsal-horn responses to repeated C-fiber input. Longer-lasting plasticity involves glutamate/NMDA signaling, glial and inflammatory mediators, altered inhibition, and network learning. Once gain is increased, touch, movement, sound, poor sleep, or stress may amplify symptoms even after tissue healing, but ongoing tissue injury or nerve disease can coexist.",
      clinicalSignificance: "Central sensitization is a mechanism, not a catch-all diagnosis and not synonymous with any single syndrome. No routine biomarker confirms it; the pattern is inferred after evaluating distribution, stimulus-response, neurologic signs, function, and red flags.",
      diagnostics: ["Map pain, sensory loss, allodynia, hyperalgesia, spread, triggers, sleep, mood, function, and medication trajectory.", "Examine strength, reflexes, perfusion, inflammation, spine, joints, skin, and relevant organs to exclude urgent causes.", "Use targeted imaging, laboratory, or electrodiagnostic studies when a suspected structural, inflammatory, infectious, malignant, or neuropathic cause would change care."],
      nursingPriorities: ["Document distribution and response to defined stimuli rather than intensity alone.", "Validate pain while explaining that altered processing is biologic and potentially modifiable.", "Support graded function and sleep while escalating new weakness, bowel/bladder change, fever, vascular signs, or rapid progression."],
      contraindications: ["Do not use sensitization to dismiss unexplained pain or stop searching for red flags.", "Do not equate normal imaging with absence of pain.", "Do not assume greater pain always means greater tissue damage or vice versa."],
      redFlags: ["New neurologic deficit, saddle anesthesia, bowel/bladder dysfunction, fever, trauma, cancer change, or vascular compromise", "Pain out of proportion with tense compartment or spreading infection", "Worsening diffuse pain with escalating opioid exposure and sedation"],
      patientEducation: ["Sensitization means the nervous system's alarm has become easier to trigger; the pain is real even when standard imaging does not show a matching new injury."],
      nclexTraps: ["Central sensitization is a mechanism, not malingering.", "It may coexist with nociceptive or neuropathic disease.", "Allodynia and hyperalgesia describe findings, not causes."],
      relatedTopics: ["Hyperalgesia", "Allodynia", "Nociception", "Neuropathic pain", "Opioid-induced hyperalgesia"],
      causalLinks: ["Repeated nociceptive input -> increased central gain -> amplified pain", "Reduced inhibition and expanded receptive fields -> allodynia and spread", "Sleep/stress disruption -> weaker descending control -> greater symptom burden"],
      sourceKeys: ["cdc-opioid-guideline-2022", "fda-opioid-labeling-2023"],
      tags: ["central sensitization", "wind up", "pain amplification", "nociplastic"]
    }),

    concept({
      name: "Hyperalgesia",
      category: "Pain finding and physiology",
      aliases: ["increased pain response", "exaggerated response to painful stimulus", "pain hypersensitivity", "primary hyperalgesia", "secondary hyperalgesia"],
      definition: "Hyperalgesia is an exaggerated pain response to a stimulus that is normally painful. It is a clinical sensory finding, not a diagnosis, and may result from peripheral inflammation, nerve injury, central sensitization, selected toxic or withdrawal states, or opioid-induced hyperalgesia.",
      pathology: "Primary hyperalgesia occurs at injured tissue where inflammatory mediators lower nociceptor thresholds. Secondary hyperalgesia extends beyond the injury and reflects central amplification. Neuropathic lesions can add sensory loss, spontaneous pain, and abnormal evoked responses.",
      pathophysiology: "Inflammatory mediators sensitize peripheral ion channels so heat or pressure produces more firing. Repeated central input strengthens dorsal-horn responses and reduces inhibition, magnifying the same nociceptive stimulus. Opioid-induced hyperalgesia is a specific possible drug-related mechanism and must be distinguished from tolerance, withdrawal, disease progression, and undertreatment.",
      clinicalSignificance: "Testing is comparative and context dependent. A stronger response can be influenced by anxiety, expectation, cognition, communication, and technique without invalidating pain; consistent mapping and associated neurologic findings improve interpretation.",
      diagnostics: ["Apply a clearly defined normally painful stimulus gently and compare side-to-side or inside/outside the affected region.", "Map allodynia, sensory loss, reflexes, strength, skin, perfusion, inflammation, and medication timing.", "Investigate urgent tissue, vascular, infectious, compressive, or malignant causes before attributing the pattern to sensitization."],
      nursingPriorities: ["Avoid repeatedly provoking severe pain once the finding is established.", "Protect numb or sensitized skin and document stimulus, location, and response.", "Escalate rapidly spreading pain, new weakness, fever, ischemic findings, or pain out of proportion."],
      contraindications: ["Do not use hyperalgesia and allodynia interchangeably.", "Do not diagnose opioid-induced hyperalgesia from one pain score.", "Do not perform unsafe pin or pressure testing over damaged skin or compromised tissue."],
      redFlags: ["Pain out of proportion with compartment or ischemic signs", "New neurologic deficit", "Rapidly spreading infection", "Dose escalation with diffuse pain and increasing sedation"],
      patientEducation: ["Hyperalgesia means a painful stimulus hurts more than expected; it describes the response and does not by itself identify the cause."],
      nclexTraps: ["Hyperalgesia uses a normally painful stimulus.", "Allodynia uses a normally nonpainful stimulus.", "Peripheral and central sensitization can both contribute."],
      relatedTopics: ["Allodynia", "Central sensitization", "Peripheral sensitization", "Neuropathic pain", "Opioid-induced hyperalgesia"],
      causalLinks: ["Inflammatory mediator -> lower nociceptor threshold -> primary hyperalgesia", "Central amplification -> exaggerated response beyond injury", "Drug or withdrawal mechanism -> altered pain processing -> diffuse hyperalgesia"],
      sourceKeys: ["cdc-opioid-guideline-2022", "fda-opioid-labeling-2023"],
      tags: ["hyperalgesia", "pain hypersensitivity", "sensory finding"]
    }),

    concept({
      name: "Allodynia",
      category: "Pain finding and physiology",
      aliases: ["pain from light touch", "normally nonpainful stimulus hurts", "tactile allodynia", "dynamic mechanical allodynia", "cold allodynia"],
      definition: "Allodynia is pain caused by a stimulus that is not normally painful, such as light brushing, clothing, mild pressure, or innocuous temperature. It is a sensory finding rather than a disease and can occur with neuropathic pain, migraine, complex regional pain, central sensitization, postherpetic neuralgia, and other disorders.",
      pathology: "Nerve injury, peripheral sensitization, loss of spinal inhibition, central synaptic plasticity, or recruitment of low-threshold touch pathways can allow normally innocuous input to activate pain networks.",
      pathophysiology: "After sensitization, input from A-beta touch fibers may gain access to amplified nociceptive circuits or be interpreted within a high-gain network. Dynamic mechanical allodynia is evoked by brushing, static allodynia by gentle pressure, and thermal allodynia by normally tolerable temperature. The subtype can suggest mechanism but does not identify one unique diagnosis.",
      clinicalSignificance: "Allodynia can severely impair clothing tolerance, hygiene, sleep, mobility, and examination. It may coexist with sensory loss, so pain to light touch does not prove that all sensory function is increased.",
      diagnostics: ["Use a gentle standardized stimulus such as cotton or light brush and compare regions while avoiding damaged skin.", "Map pinprick, temperature, vibration, proprioception, strength, reflexes, autonomic/skin change, and nerve distribution.", "Evaluate for zoster, neuropathy, migraine, CRPS, spinal/brain disease, medication effects, and urgent structural or vascular causes according to context."],
      nursingPriorities: ["Ask before touching and modify clothing, linens, monitoring devices, and handling to reduce unnecessary provocation.", "Protect insensate areas and inspect skin because painful touch can coexist with impaired protective sensation.", "Document stimulus and distribution, not only the word tenderness."],
      contraindications: ["Do not test repeatedly once established.", "Do not call ordinary tenderness allodynia unless the stimulus is normally nonpainful.", "Do not assume allodynia proves psychological causation or one specific pain syndrome."],
      redFlags: ["Allodynia with rapidly progressive weakness or sensory loss", "New vesicular rash near eye or ear", "Painful swollen limb with vascular or compartment concern", "New widespread allodynia during opioid escalation with sedation"],
      patientEducation: ["Allodynia occurs when ordinary touch is processed as pain; it is a real nervous-system finding, and treatment depends on the underlying mechanism."],
      nclexTraps: ["Allodynia is pain from a normally nonpainful stimulus.", "Hyperalgesia is an excessive response to a painful stimulus.", "Pain and numbness can coexist in neuropathic disease."],
      relatedTopics: ["Hyperalgesia", "Central sensitization", "Neuropathic pain", "Postherpetic neuralgia", "Complex regional pain syndrome"],
      causalLinks: ["Loss of inhibition or altered circuit access -> touch activates pain pathways", "Central gain -> expanded painful receptive field", "Allodynia -> avoidance and sleep disruption -> functional burden"],
      sourceKeys: ["cdc-opioid-guideline-2022", "fda-opioid-labeling-2023"],
      tags: ["allodynia", "light touch pain", "neuropathic pain", "sensory finding"]
    })
  ];

  const sourceRegistration = registerCardSources(cards);

  cards.forEach((incoming) => {
    const canonical = normalize(incoming.name || incoming.title);
    const index = db.diseases.findIndex((entry) =>
      [entry.name, entry.title].map(normalize).filter(Boolean).includes(canonical)
    );
    const existing = index >= 0 ? db.diseases[index] : {};
    const merged = {
      ...existing,
      ...incoming,
      aliases: unique(incoming.aliases || []),
      abbreviations: unique(incoming.abbreviations || []),
      tags: unique(["frontier-wave44", "component parity", ...(incoming.tags || [])])
    };
    delete merged.replaceExistingAliases;
    if (index >= 0) db.diseases[index] = merged;
    else db.diseases.push(merged);
  });

  const canonicalCardNames = cards.map((card) => card.name);
  db.frontierWave44ComponentParityP1 = {
    version: VERSION,
    cardCount: cards.length,
    canonicalCardNames,
    exactTitleUpsertOnly: true,
    standaloneComponentCards: true,
    compositeParentsPreserved: true,
    dialysisUltrafiltrationCanonical: "Ultrafiltration",
    noPlaceholderCards: true,
    sourcePolicy: "Authoritative source records copied into the owning pathology sourceReferences store",
    sourceRegistration
  };
  db.frontierWave44ComponentParityP1CardCount = cards.length;
  db.diseaseCount = db.diseases.length;
  db.version = [db.version, "clinical-frontier-wave44-component-parity-p1"].filter(Boolean).join("+");
  window.ANI_PATHOLOGY_DATABASE = db;
}());
