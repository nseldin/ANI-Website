/* eslint-disable */
(function () {
  const pharm = window.ANI_PHARM_DATABASE || { drugs: [] };
  const pathology = window.ANI_PATHOLOGY_DATABASE || { diseases: [] };
  pharm.drugs = Array.isArray(pharm.drugs) ? pharm.drugs : [];
  pathology.diseases = Array.isArray(pathology.diseases) ? pathology.diseases : [];

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const unique = (items) => {
    const seen = new Set();
    const output = [];
    (items || []).forEach((item) => {
      if (item && typeof item === "object") {
        let key = "";
        try {
          key = `object:${JSON.stringify(item)}`;
        } catch {
          key = `object:${output.length}`;
        }
        if (seen.has(key)) return;
        seen.add(key);
        output.push(item);
        return;
      }
      const value = String(item ?? "").trim();
      if (!value) return;
      const key = `scalar:${value}`;
      if (seen.has(key)) return;
      seen.add(key);
      output.push(value);
    });
    return output;
  };

  function mergeEntry(existing, incoming) {
    const replaceArrays = new Set(Array.isArray(incoming.__replaceArrays) ? incoming.__replaceArrays : []);
    Object.entries(incoming).forEach(([key, value]) => {
      if (key.startsWith("__")) return;
      if (Array.isArray(value)) {
        existing[key] = replaceArrays.has(key)
          ? unique(value)
          : unique([...(Array.isArray(existing[key]) ? existing[key] : []), ...value]);
      } else if (value && typeof value === "object") {
        existing[key] = { ...(existing[key] || {}), ...value };
      } else if (value !== undefined && value !== null && value !== "") {
        existing[key] = value;
      }
    });
    existing.aliases = unique([...(existing.aliases || []), ...(incoming.aliases || [])]);
    return existing;
  }

  function upsert(list, incoming) {
    const names = unique([incoming.name, incoming.title, incoming.generic, incoming.displayName, ...(incoming.aliases || [])]).map(normalize);
    let existing = list.find((entry) => {
      const includeAliases = !incoming.classCard || entry.classCard || entry.isDrugClassCard;
      const entryNames = unique([
        entry.name,
        entry.title,
        entry.generic,
        entry.displayName,
        ...(includeAliases ? (entry.aliases || []) : [])
      ]).map(normalize);
      return entryNames.some((name) => names.includes(name));
    });
    if (!existing) {
      existing = {};
      list.push(existing);
    }
    return mergeEntry(existing, incoming);
  }

  function collapseDuplicateEntries(list) {
    const seen = new Map();
    const collapsed = [];
    (list || []).forEach((entry) => {
      const key = normalize(entry && (entry.name || entry.title || entry.generic || entry.displayName));
      if (!key) {
        collapsed.push(entry);
        return;
      }
      const existing = seen.get(key);
      if (!existing) {
        seen.set(key, entry);
        collapsed.push(entry);
        return;
      }
      Object.entries(entry || {}).forEach(([field, value]) => {
        if (Array.isArray(value)) {
          existing[field] = unique([...(Array.isArray(existing[field]) ? existing[field] : []), ...value]);
        } else if (value && typeof value === "object") {
          existing[field] = { ...(value || {}), ...(existing[field] || {}) };
        } else if ((existing[field] === undefined || existing[field] === null || existing[field] === "") && value !== undefined && value !== null && value !== "") {
          existing[field] = value;
        }
      });
    });
    list.splice(0, list.length, ...collapsed);
  }

  function applyAuthoritativeArrayFields(list, updates) {
    (updates || []).forEach((incoming) => {
      const fields = Array.isArray(incoming.__replaceArrays) ? incoming.__replaceArrays : [];
      if (!fields.length) return;
      const incomingNames = unique([incoming.name, incoming.title, incoming.generic, incoming.displayName]).map(normalize);
      const existing = (list || []).find((entry) => {
        const primaryNames = unique([entry.name, entry.title, entry.generic, entry.displayName]).map(normalize);
        return primaryNames.some((name) => incomingNames.includes(name));
      });
      if (!existing) return;
      fields.forEach((field) => {
        existing[field] = unique(Array.isArray(incoming[field]) ? incoming[field] : []);
      });
    });
  }

  const FINAL_PHARM_PLACEHOLDER_RE = /\b(used in [^.]+ contexts\. for nclex study|for nclex study, connect|works through its [^.]+ pharmacology|works through its drug class|tie the mechanism|no known drug-specific boxed warning is listed|still check current prescribing information|not fully curated|verify current label|recognition only|expected action should match|should be studied through|specific indication, formulation, route|read the name as|study the linked examples|class reference for medications)\b/i;
  const FINAL_BROAD_SOURCE_CLASS_RE = /^(?:cardiovascular|respiratory|endocrine|renal|gastrointestinal|central nervous system|neurology|antiinfective|psychiatric\/?cns|emergency\/?critical-care|hematology|oncology|biologics|transplant|pain|anesthesia|dermatology|ophthalmic|otic)(?: drug| medication| reference)?$/i;
  const FINAL_SOURCE_TAXONOMY_RE = /\b(?:renal,\s*electrolytes,\s*dialysis,\s*urinary|cardiac rhythm,\s*heart failure,\s*hypertension,\s*antianginal|emergency,\s*acls,\s*critical care,\s*shock,\s*vasopressors|gi,\s*liver,\s*pancreas,\s*bowel|hematology,\s*oncology,\s*biologics,\s*transplant|pain,\s*anesthesia,\s*anti-inflammatory|dermatology,\s*ophthalmic,\s*otic|neurology\s*-\s*seizures|lipid,\s*vascular,\s*pad)\b/i;
  const textValue = (value) => Array.isArray(value) ? value.join(" ") : String(value || "");

  function finalPharmSourceCleanup() {
    pharm.drugs.forEach((drug) => {
      if (!drug || typeof drug !== "object") return;
      if (FINAL_BROAD_SOURCE_CLASS_RE.test(String(drug.class || "")) || FINAL_SOURCE_TAXONOMY_RE.test(String(drug.class || ""))) {
        delete drug.class;
      }
      ["description", "summary", "overview", "usedToTreat", "commonUses", "indications", "mechanism", "boxedWarning", "boxedWarningSpecificity", "sourceNote"].forEach((field) => {
        if (FINAL_PHARM_PLACEHOLDER_RE.test(textValue(drug[field]))) {
          delete drug[field];
        }
      });
      if (Array.isArray(drug.tags)) {
        drug.tags = unique(drug.tags);
      }
    });
  }

  const pharmUpdates = [
    {
      name: "Amiodarone",
      generic: "amiodarone",
      displayName: "Amiodarone",
      adverseEffects: [
        "Pulmonary toxicity including pneumonitis or fibrosis",
        "Thyroid dysfunction: hypothyroidism or thyrotoxicosis",
        "Hepatotoxicity, elevated AST/ALT, hepatitis pattern, or liver failure",
        "Bradycardia, AV block, QT prolongation, torsades risk, and hypotension especially with IV use",
        "Corneal deposits, optic neuropathy or visual change, photosensitivity, blue-gray skin discoloration, tremor, neuropathy, nausea, and constipation"
      ],
      contraindications: [
        "Known hypersensitivity to amiodarone, iodine-related formulation concerns, or product components.",
        "Cardiogenic shock, severe sinus-node dysfunction, marked sinus bradycardia, or second- or third-degree AV block without a functioning pacemaker.",
        "Clarify pregnancy, lactation, uncontrolled thyroid disease, severe liver injury, baseline pulmonary disease, severe QT prolongation, major electrolyte abnormalities, and interacting antiarrhythmics before giving."
      ],
      nursingEssentials: [
        "Assess rhythm indication, baseline ECG/QT, heart rate, blood pressure, potassium, magnesium, thyroid history, liver history, pulmonary symptoms, and interacting medications before giving.",
        "Monitor for new cough, dyspnea, pleuritic discomfort, hypoxia, fever, crackles, weight loss, fatigue, jaundice, dark urine, tremor, heat or cold intolerance, visual changes, photosensitivity, bradycardia, syncope, and worsening dysrhythmia.",
        "For chronic therapy, expect ordered surveillance such as ECG, chest imaging or pulmonary assessment, thyroid tests, liver tests, and eye or skin assessment depending on the plan."
      ],
      interactions: [
        "Warfarin effect can increase; INR monitoring and dose adjustment are common.",
        "Digoxin exposure can increase through P-glycoprotein effects; toxicity monitoring and dose adjustment may be needed.",
        "Beta blockers, diltiazem, verapamil, digoxin, and other AV-node-slowing drugs can compound bradycardia or heart block.",
        "Other QT-prolonging drugs and low potassium or magnesium raise torsades risk.",
        "CYP3A4 or P-glycoprotein inhibitors and inducers, grapefruit products, and selected statins can change exposure or toxicity."
      ],
      keyLabs: [
        "ECG/QT interval, heart rate, and blood pressure",
        "Potassium and magnesium",
        "TSH and free T4 as ordered",
        "AST, ALT, and bilirubin as ordered",
        "INR with warfarin and digoxin level when clinically indicated"
      ],
      nclexTraps: [
        "New cough or dyspnea on amiodarone is never brushed off as a simple cold until pulmonary toxicity is considered.",
        "Amiodarone can cause both hypothyroidism and hyperthyroidism because it contains iodine and affects thyroid pathways.",
        "The half-life is long. Holding or stopping today does not remove interaction or toxicity risk tomorrow.",
        "It is Class III, but not only Class III. Sodium-channel, beta-adrenergic, and calcium-channel effects explain bradycardia and AV-node issues."
      ],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy risk", note: "Can cause fetal harm, including thyroid and neurodevelopment concerns; use only with specialist risk-benefit direction." },
        { type: "geriatric", label: "Older adult caution", note: "Pulmonary reserve, bradycardia and falls, thyroid disease, hepatic function, and polypharmacy interactions increase risk." },
        { type: "pediatric", label: "Pediatric specialist use", note: "Pediatric dysrhythmia use requires specialist dosing and monitoring." }
      ],
      __replaceArrays: ["adverseEffects", "contraindications", "nursingEssentials", "interactions", "keyLabs", "nclexTraps", "populationRisks"]
    },
    {
      name: "Diclofenac",
      generic: "diclofenac",
      displayName: "Diclofenac",
      nclexEssential: true,
      class: "NSAID; relatively COX-2-selective prostaglandin-synthesis inhibitor",
      usedToTreat: "Pain, inflammation, osteoarthritis/rheumatoid arthritis symptoms, dysmenorrhea, acute migraine formulations, and topical musculoskeletal pain when the ordered route fits.",
      description: "Diclofenac is an NSAID that inhibits cyclooxygenase-driven prostaglandin synthesis, lowering inflammatory pain, swelling, and fever signaling. Its first safety frame is GI bleeding, kidney perfusion injury, blood-pressure/heart-failure worsening, cardiovascular thrombotic risk, and avoiding duplicate NSAIDs.",
      mechanism: "Diclofenac inhibits COX-1 and COX-2 enzymes, with relative COX-2 preference, reducing prostaglandin production from arachidonic acid. Less prostaglandin lowers inflammation and pain but also removes gastric mucosal protection, platelet/vascular balance, and renal afferent-arteriole support, which explains ulcer/bleeding, renal injury, edema, hypertension, and cardiovascular warnings.",
      adverseEffects: ["Dyspepsia, GI ulcer/bleeding, renal injury, edema, hypertension, heart-failure worsening, cardiovascular thrombotic events, liver enzyme elevation, rash, bronchospasm in NSAID-sensitive asthma, and bleeding risk when combined with anticoagulants/antiplatelets."],
      keyLabs: ["Renal function/creatinine, blood pressure, edema/weight trend, CBC if bleeding risk, liver enzymes when clinically indicated, and medication reconciliation for other NSAIDs, anticoagulants, antiplatelets, ACE inhibitors/ARBs, and diuretics."],
      nclexTraps: ["Diclofenac is an NSAID COX/prostaglandin drug, not NAC. Do not let a merged combination or look-alike content turn it into an acetaminophen antidote."],
      tags: ["first-sentence-crash-course-2026-07-11", "nsaid", "cox", "diclofenac"]
    },
    {
      name: "Beta blocker",
      displayName: "Beta blocker",
      generic: "beta blocker",
      classCard: true,
      class: "Beta-adrenergic receptor antagonist drug class",
      description: "Beta blockers antagonize beta-adrenergic receptors so sympathetic stimulation cannot drive the heart, kidney renin release, bronchi, or metabolic responses as strongly. Subclass matters immediately: beta-1 selective drugs focus on heart/renin effects, nonselective beta blockers also block beta-2 bronchodilation/metabolic signaling, and alpha/beta blockers add vasodilation.",
      mechanism: "Beta-1 blockade slows SA rate, AV conduction, contractility, and renin release; beta-2 blockade can worsen bronchospasm and blunt tremor/glycogenolysis cues; alpha-1 blockade with carvedilol/labetalol lowers vascular tone.",
      tags: ["first-sentence-crash-course-2026-07-11", "beta blockers", "drug class"]
    },
    {
      name: "Nonselective beta blocker",
      displayName: "Nonselective beta blocker",
      generic: "nonselective beta blocker",
      classCard: true,
      class: "Nonselective beta-1/beta-2 adrenergic receptor antagonist class",
      description: "Nonselective beta blockers block both beta-1 cardiac receptors and beta-2 receptors in bronchi, vessels, liver, and skeletal muscle. That means rate/contractility reduction comes with extra asthma/COPD caution and stronger masking of adrenergic hypoglycemia warning signs.",
      mechanism: "Beta-1 blockade slows heart rate, AV conduction, contractility, and renin release; beta-2 blockade can reduce bronchodilation and alter metabolic compensation during hypoglycemia.",
      tags: ["first-sentence-crash-course-2026-07-11", "beta blockers", "nonselective"]
    },
    {
      name: "Mixed alpha-1 and nonselective beta blocker",
      displayName: "Mixed alpha-1 and nonselective beta blocker",
      generic: "mixed alpha beta blocker",
      aliases: ["alpha beta blocker", "alpha-1 and beta blocker"],
      classCard: true,
      class: "Mixed alpha-1 plus nonselective beta-adrenergic antagonist class",
      description: "Mixed alpha-1 and nonselective beta blockers reduce cardiac sympathetic drive while also relaxing vascular smooth muscle through alpha-1 blockade. The first-read distinction is lower heart workload plus lower vascular resistance, with orthostatic hypotension, bronchospasm caution, bradycardia, and hypoglycemia-masking risk.",
      mechanism: "Beta blockade slows heart rate, AV conduction, contractility, and renin release, while alpha-1 blockade lowers arteriolar/venous tone and afterload.",
      tags: ["first-sentence-crash-course-2026-07-11", "alpha beta blocker"]
    },
    {
      name: "Anticholinergic drugs",
      displayName: "Anticholinergic drugs",
      generic: "anticholinergic drugs",
      classCard: true,
      class: "Muscarinic receptor antagonist drug class",
      description: "Anticholinergic drugs block muscarinic acetylcholine signaling, reducing parasympathetic smooth-muscle and gland activity. The useful mental model is 'dry, hot, blind, blocked, tachy, confused': dry mouth/eyes, constipation, urinary retention, blurred vision, tachycardia, heat intolerance, and delirium risk.",
      mechanism: "Muscarinic receptor blockade reduces detrusor contraction, GI motility, secretions, accommodation, sweating, and vagal cardiac tone depending on tissue exposure.",
      tags: ["first-sentence-crash-course-2026-07-11", "anticholinergic", "muscarinic"]
    },
    {
      name: "Anticholinergic bronchodilator drugs",
      displayName: "Anticholinergic bronchodilator drugs",
      generic: "anticholinergic bronchodilator drugs",
      classCard: true,
      class: "Inhaled muscarinic antagonist bronchodilator class",
      description: "Anticholinergic bronchodilators block airway muscarinic receptors, especially M3-mediated bronchoconstriction and mucus signaling. They help COPD and selected asthma pathways by opening airways without beta-agonist stimulation, but glaucoma, urinary retention, dry mouth, and technique errors matter.",
      mechanism: "M3 muscarinic blockade prevents acetylcholine-driven bronchial smooth-muscle contraction and reduces vagal airway tone; inhaled delivery keeps most effect local but anticholinergic adverse effects can still occur.",
      tags: ["first-sentence-crash-course-2026-07-11", "anticholinergic", "bronchodilator"]
    },
    {
      name: "SAMA bronchodilators",
      displayName: "SAMA bronchodilators",
      generic: "sama bronchodilators",
      aliases: ["short-acting muscarinic antagonist bronchodilator drugs", "short acting muscarinic antagonist bronchodilator drugs", "ipratropium class"],
      classCard: true,
      class: "Short-acting muscarinic antagonist (SAMA) bronchodilator class",
      description: "Short-acting muscarinic antagonist bronchodilators, such as ipratropium, rapidly block airway M3 signaling to reduce vagal bronchoconstriction for acute symptom relief or exacerbation support. They are bronchodilator partners, not inhaled steroids, and they require inhaler/nebulizer technique plus anticholinergic safety screening.",
      mechanism: "Short-acting inhaled muscarinic blockade relaxes bronchial smooth muscle for several hours by preventing acetylcholine from constricting airways.",
      tags: ["first-sentence-crash-course-2026-07-11", "SAMA", "bronchodilator"]
    },
    {
      name: "LAMA bronchodilators",
      displayName: "LAMA bronchodilators",
      generic: "lama bronchodilators",
      aliases: ["long-acting muscarinic antagonist bronchodilator drugs", "long acting muscarinic antagonist bronchodilator drugs", "tiotropium class"],
      classCard: true,
      class: "Long-acting muscarinic antagonist (LAMA) bronchodilator class",
      description: "Long-acting muscarinic antagonist bronchodilators, such as tiotropium, maintain airway opening by blocking prolonged M3-mediated bronchoconstriction. They are controller bronchodilators for COPD and selected asthma regimens, not rescue drugs for sudden severe bronchospasm.",
      mechanism: "Sustained airway muscarinic blockade lowers parasympathetic bronchial smooth-muscle tone, improving airflow over many hours while preserving the need for rescue therapy when acute symptoms break through.",
      tags: ["first-sentence-crash-course-2026-07-11", "LAMA", "bronchodilator"]
    },
    {
      name: "SABA bronchodilators",
      displayName: "SABA bronchodilators",
      generic: "saba bronchodilators",
      aliases: ["short-acting beta-2 agonists", "short acting beta 2 agonists"],
      classCard: true,
      class: "Short-acting beta-2 agonist (SABA) bronchodilator class",
      description: "Short-acting beta-2 agonist bronchodilators rapidly stimulate beta-2 receptors on airway smooth muscle, raising cAMP and relaxing constricted bronchi. They are rescue drugs for acute bronchospasm; frequent use signals poor control or worsening exacerbation risk.",
      mechanism: "Beta-2 receptor activation increases adenylyl cyclase and cAMP in bronchial smooth muscle, producing quick bronchodilation while also causing tremor, tachycardia, hypokalemia, and anxiety in susceptible clients.",
      tags: ["first-sentence-crash-course-2026-07-11", "SABA", "bronchodilator"]
    },
    {
      name: "LABA bronchodilators",
      displayName: "LABA bronchodilators",
      generic: "laba bronchodilators",
      aliases: ["long-acting beta-2 agonists", "long acting beta 2 agonists"],
      classCard: true,
      class: "Long-acting beta-2 agonist (LABA) bronchodilator class",
      description: "Long-acting beta-2 agonist bronchodilators stimulate airway beta-2 receptors for sustained smooth-muscle relaxation and maintenance symptom control. In asthma they must be paired with anti-inflammatory controller therapy because LABA monotherapy can leave airway inflammation undertreated.",
      mechanism: "Prolonged beta-2 signaling raises airway smooth-muscle cAMP for many hours, improving airflow while preserving rescue inhaler need for acute symptoms.",
      tags: ["first-sentence-crash-course-2026-07-11", "LABA", "bronchodilator"]
    },
    {
      name: "Antiemetic drugs",
      displayName: "Antiemetic drugs",
      generic: "antiemetic drugs",
      classCard: true,
      class: "Antiemetic drug class; receptor-pathway nausea and vomiting blockers",
      description: "Antiemetics reduce nausea/vomiting by interrupting specific emetic pathways: serotonin from gut/vagal signaling, dopamine in the chemoreceptor trigger zone, histamine/muscarinic vestibular pathways, neurokinin substance P, cannabinoids, or motility circuits. The target predicts the adverse effect, such as QT risk, EPS, sedation, anticholinergic burden, or constipation.",
      mechanism: "Different subclasses block 5-HT3, D2, H1, M1, NK1, cannabinoid, or GI motility pathways, so matching cause of nausea to receptor pathway matters.",
      tags: ["first-sentence-crash-course-2026-07-11", "antiemetic", "drug class"]
    },
    {
      name: "Benzodiazepine",
      displayName: "Benzodiazepine",
      generic: "benzodiazepine",
      classCard: true,
      class: "GABA-A positive allosteric modulator sedative/anxiolytic/anticonvulsant class",
      description: "Benzodiazepines are CNS depressants that amplify GABA-A chloride-channel inhibition, quickly reducing anxiety, seizures, alcohol-withdrawal hyperexcitability, muscle spasm, or procedural distress. The same mechanism creates sedation, falls, delirium, dependence, withdrawal seizures, and respiratory-depression danger when combined with opioids, alcohol, or other depressants.",
      mechanism: "They bind an allosteric site on GABA-A receptors and increase the frequency of chloride-channel opening when GABA is present, hyperpolarizing neurons and reducing CNS excitability.",
      tags: ["first-sentence-crash-course-2026-07-11", "benzodiazepine", "GABA"]
    },
    {
      name: "Benzodiazepine anxiolytic/sedative/anticonvulsant",
      displayName: "Benzodiazepine anxiolytic/sedative/anticonvulsant",
      generic: "benzodiazepine anxiolytic sedative anticonvulsant",
      classCard: true,
      class: "Benzodiazepine GABA-A modulator class",
      description: "Benzodiazepine anxiolytic/sedative/anticonvulsants amplify GABA-A inhibition to calm overactive neural circuits, stop selected seizures, treat alcohol withdrawal, or support procedures. Their first-screen danger is CNS and respiratory depression, falls/delirium, dependence, withdrawal, and synergy with opioids or alcohol.",
      mechanism: "GABA-A positive allosteric modulation increases chloride-channel opening frequency, making neurons less likely to fire.",
      tags: ["first-sentence-crash-course-2026-07-11", "benzodiazepine", "GABA"]
    },
    {
      name: "PD-1 checkpoint inhibitors",
      displayName: "PD-1 checkpoint inhibitors",
      generic: "pd 1 checkpoint inhibitors",
      description: "PD-1 checkpoint inhibitors release the PD-1 immune brake on activated T cells so antitumor immunity can attack cancer more effectively. The same immune activation can inflame normal organs, causing pneumonitis, colitis, hepatitis, endocrinopathies, nephritis, myocarditis, rash, or neurologic toxicity.",
      mechanism: "Blocking PD-1 or PD-L1 prevents tumor/immune-ligand signaling from switching off T-cell activity, increasing immune surveillance and immune-related adverse-event risk.",
      tags: ["first-sentence-crash-course-2026-07-11", "PD-1", "checkpoint inhibitor"]
    },
    {
      name: "HER2-directed monoclonal antibodies",
      displayName: "HER2-directed monoclonal antibodies",
      generic: "her2 directed monoclonal antibodies",
      description: "HER2-directed monoclonal antibodies bind the HER2 receptor on HER2-overexpressing cancers to block growth signaling, flag tumor cells for immune attack, or deliver HER2-targeted payloads depending on the product. Cardiac dysfunction, infusion reactions, diarrhea for some agents, and pregnancy avoidance are first-read safety anchors.",
      mechanism: "HER2 blockade interrupts receptor dimerization/signaling and can recruit antibody-dependent cellular cytotoxicity; antibody-drug conjugates add targeted cytotoxic delivery.",
      tags: ["first-sentence-crash-course-2026-07-11", "HER2", "monoclonal antibody"]
    },
    {
      name: "Coenzyme Q10",
      generic: "coenzyme q10",
      displayName: "Coenzyme Q10",
      class: "Mitochondrial electron-transport cofactor; ubiquinone supplement",
      description: "Coenzyme Q10 is ubiquinone, a lipid-soluble electron carrier that shuttles electrons in the mitochondrial respiratory chain and also acts as an antioxidant in membranes. As a supplement it is usually studied for possible statin-associated muscle symptoms, migraine, heart-failure interest, or mitochondrial support, but evidence and product quality vary.",
      mechanism: "CoQ10 cycles between oxidized and reduced forms while transferring electrons between complexes I/II and III in mitochondria, supporting ATP generation and limiting lipid oxidative stress.",
      tags: ["first-sentence-crash-course-2026-07-11", "coenzyme q10", "mitochondria"]
    },
    {
      name: "Vitamin C ascorbic acid",
      generic: "vitamin c",
      displayName: "Vitamin C ascorbic acid",
      class: "Water-soluble antioxidant vitamin; collagen-hydroxylation cofactor",
      description: "Vitamin C is ascorbic acid, a water-soluble antioxidant and required cofactor for collagen hydroxylation, wound healing, capillary integrity, and iron absorption support. Deficiency causes scurvy physiology: fragile vessels, bleeding gums, poor wound healing, bone pain, fatigue, and impaired connective tissue maintenance.",
      mechanism: "Ascorbate donates electrons for prolyl and lysyl hydroxylase enzymes that stabilize collagen and also helps regenerate antioxidants and keep non-heme iron in a more absorbable reduced form.",
      tags: ["first-sentence-crash-course-2026-07-11", "vitamin c", "ascorbic acid"]
    },
    {
      name: "Vitamin E",
      generic: "vitamin e",
      displayName: "Vitamin E",
      class: "Fat-soluble antioxidant vitamin; tocopherol family",
      description: "Vitamin E is a fat-soluble tocopherol antioxidant that protects cell membranes by interrupting free-radical chain reactions in lipids. High supplemental doses can increase bleeding risk, especially with anticoagulants or antiplatelets, while deficiency can cause neurologic and hemolytic problems.",
      mechanism: "Alpha-tocopherol donates electrons to lipid radicals in membranes, limiting lipid peroxidation; because it is fat soluble, accumulation and interaction risk matter more than with many water-soluble vitamins.",
      tags: ["first-sentence-crash-course-2026-07-11", "vitamin e", "tocopherol"]
    },
    {
      name: "Aliskiren",
      generic: "aliskiren",
      displayName: "Aliskiren",
      class: "Direct renin inhibitor antihypertensive",
      description: "Aliskiren is an oral direct renin inhibitor that blocks the first enzymatic step of the RAAS pathway, lowering angiotensin I, angiotensin II, and aldosterone production. That can lower blood pressure but raises the same high-yield concerns as other RAAS drugs: hyperkalemia, renal function change, hypotension, and fetal toxicity.",
      mechanism: "Aliskiren binds renin and prevents angiotensinogen conversion to angiotensin I, reducing downstream vasoconstriction and aldosterone-mediated sodium retention.",
      tags: ["first-sentence-crash-course-2026-07-11", "renin inhibitor", "RAAS"]
    },
    {
      name: "Calcitonin",
      generic: "calcitonin",
      displayName: "Calcitonin",
      class: "Calcitonin hormone; antiresorptive calcium-lowering medication",
      description: "Calcitonin is a calcium-lowering peptide hormone medication that directly inhibits osteoclast bone resorption and increases renal calcium excretion. It can lower calcium faster than bisphosphonates in hypercalcemia, but tachyphylaxis limits sustained effect.",
      mechanism: "Calcitonin binds osteoclast calcitonin receptors, reducing osteoclast activity and release of calcium from bone while promoting urinary calcium loss.",
      tags: ["first-sentence-crash-course-2026-07-11", "calcitonin", "calcium"]
    },
    {
      name: "Calcitriol",
      generic: "calcitriol",
      displayName: "Calcitriol",
      class: "Active vitamin D hormone; vitamin D receptor agonist",
      description: "Calcitriol is active vitamin D hormone, not a routine nutritional supplement: it activates vitamin D receptors to increase intestinal calcium/phosphate absorption and regulate parathyroid-bone-kidney signaling. Hypercalcemia and hyperphosphatemia are the first safety concerns, especially in kidney disease.",
      mechanism: "Calcitriol binds nuclear vitamin D receptors, changing gene transcription for calcium and phosphate transport, bone remodeling signals, and parathyroid hormone regulation.",
      tags: ["first-sentence-crash-course-2026-07-11", "calcitriol", "vitamin d"]
    },
    {
      name: "Guaifenesin",
      generic: "guaifenesin",
      displayName: "Guaifenesin",
      class: "Expectorant",
      description: "Guaifenesin is an expectorant that helps thin and mobilize bronchial secretions so mucus is easier to cough out; it does not suppress the cough reflex. Hydration, cough effectiveness, and red flags such as fever, dyspnea, hemoptysis, or persistent/worsening cough matter more than treating it like a sedating cough medicine.",
      mechanism: "Guaifenesin is thought to increase airway fluid and reduce mucus viscosity, supporting clearance by coughing and ciliary movement.",
      tags: ["first-sentence-crash-course-2026-07-11", "expectorant", "mucus"]
    }
  ];

  const pathologyUpdates = [
    {
      name: "Cannabis intoxication",
      definition: "Cannabis intoxication is acute THC/cannabinoid effect at brain CB1 pathways, altering attention, time perception, coordination, memory, anxiety level, and sometimes sensory perception. The clinical edge is distinguishing expected intoxication from panic, psychosis, severe vomiting, injury, co-ingestion, or unsafe driving/fall risk.",
      pathology: "THC increases cannabinoid signaling that modulates neurotransmitter release in reward, memory, perception, and motor circuits. Tachycardia, conjunctival injection, dry mouth, impaired coordination, anxiety/panic, and delayed reaction time are common bedside clues.",
      tags: ["first-sentence-crash-course-2026-07-11", "toxicology", "cannabis"]
    },
    {
      name: "Chest trauma",
      definition: "Chest trauma is blunt or penetrating injury to the rib cage, lungs, pleura, diaphragm, heart, or great vessels that can fail ventilation, oxygenation, or circulation quickly. The crash-course screen is pneumothorax, tension pneumothorax, hemothorax, flail chest, pulmonary contusion, cardiac tamponade, and aortic injury.",
      pathology: "Pain and structural injury can prevent effective ventilation, while bleeding or air in the pleural/pericardial space can compress lung or heart filling. Sudden dyspnea, asymmetric breath sounds, hypotension, JVD, tracheal shift, or bruising pattern changes urgency.",
      tags: ["first-sentence-crash-course-2026-07-11", "trauma", "chest"]
    },
    {
      name: "Coma",
      definition: "Coma is unarousable unresponsiveness from failure of the cerebral cortex, brainstem reticular activating system, or both. Think hypoxia, hypoglycemia, stroke/bleed, trauma, seizure/postictal state, infection, toxins, metabolic failure, and raised intracranial pressure until proven otherwise.",
      pathology: "The immediate nursing logic is airway protection, glucose/oxygen check, pupils, motor response, vital-sign pattern, medication/toxin exposure, trauma signs, and rapid escalation for reversible causes.",
      tags: ["first-sentence-crash-course-2026-07-11", "coma", "neurology"]
    },
    {
      name: "Crush injury",
      definition: "Crush injury is prolonged compression of muscle and soft tissue causing ischemia, cell rupture, edema, and reperfusion toxin release. The high-yield danger is rhabdomyolysis with myoglobin kidney injury, hyperkalemia, acidosis, hypocalcemia early, compartment syndrome, and shock.",
      pathology: "Damaged muscle releases potassium, phosphate, CK, myoglobin, and organic acids into circulation after pressure relief. ECG changes, dark urine, rising CK/creatinine, severe swelling, pain out of proportion, and weak pulses require urgent action.",
      tags: ["first-sentence-crash-course-2026-07-11", "crush injury", "rhabdomyolysis"]
    },
    {
      name: "Delusional disorder",
      definition: "Delusional disorder is persistent fixed false belief for at least about a month without the broader disorganization, negative symptoms, or functional collapse typical of schizophrenia. The nursing priority is safety, trust, reality-based communication, and assessing whether the belief creates risk to self or others.",
      pathology: "Delusions may be persecutory, jealous, erotomanic, grandiose, somatic, or mixed. Do not argue the belief; assess distress, violence/suicide risk, substance/medical causes, and ability to meet basic needs.",
      tags: ["first-sentence-crash-course-2026-07-11", "psych", "delusion"]
    },
    {
      name: "Diabetic foot ulcer",
      definition: "A diabetic foot ulcer is a chronic wound caused by neuropathy, pressure, vascular disease, impaired immunity, and poor tissue repair in diabetes. Loss of protective sensation lets repetitive trauma continue until infection, ischemia, osteomyelitis, or amputation risk appears.",
      pathology: "Common clues include plantar ulceration, callus rim, reduced sensation, weak pulses, drainage, odor, cellulitis, exposed bone, fever, or unexpectedly little pain despite a serious wound.",
      tags: ["first-sentence-crash-course-2026-07-11", "diabetes", "wound"]
    },
    {
      name: "Dislocation",
      definition: "Dislocation is complete displacement of bones at a joint, tearing or stretching the capsule, ligaments, and nearby soft tissue. The first nursing thought is neurovascular status: pulses, sensation, movement, skin color, pain, and urgent reduction timing.",
      pathology: "Shoulder, finger, patella, hip, and elbow dislocations can injure nerves or vessels and can recur if stabilizing structures are damaged. Do not force movement when deformity and severe pain suggest dislocation.",
      tags: ["first-sentence-crash-course-2026-07-11", "orthopedic", "joint"]
    },
    {
      name: "Disseminated intravascular coagulation in obstetrics",
      definition: "Obstetric DIC is uncontrolled systemic coagulation activation with consumption of platelets and clotting factors during emergencies such as placental abruption, amniotic fluid embolism, severe preeclampsia/HELLP, sepsis, fetal demise, or massive hemorrhage. The paradox is simultaneous microthrombi and dangerous bleeding.",
      pathology: "Watch oozing from IV sites, heavy uterine bleeding, petechiae, shock, falling platelets/fibrinogen, prolonged PT/aPTT, elevated D-dimer, organ injury, and the need to treat the obstetric trigger while replacing blood components.",
      tags: ["first-sentence-crash-course-2026-07-11", "DIC", "obstetrics"]
    },
    {
      name: "Dressler syndrome",
      definition: "Dressler syndrome is delayed autoimmune pericarditis after myocardial infarction or cardiac injury, typically presenting days to weeks later with pleuritic chest pain, fever, pericardial friction rub, and inflammatory markers. It is not recurrent plaque rupture, but it can mimic post-MI chest pain and cause effusion.",
      pathology: "Immune inflammation targets pericardial tissue after myocardial injury. Assess pain quality, ECG changes, troponin context, echo for effusion/tamponade, fever, and response to anti-inflammatory therapy.",
      tags: ["first-sentence-crash-course-2026-07-11", "pericarditis", "post MI"]
    },
    {
      name: "Evisceration",
      definition: "Evisceration is protrusion of abdominal organs through a wound or dehisced surgical incision, making it a surgical emergency. The first action is protect the exposed tissue with sterile saline-moistened dressings, keep the client low/covered, and call for urgent help rather than pushing organs back in.",
      pathology: "Full-thickness wound failure can expose bowel, rapidly risking fluid/heat loss, infection, ischemia, shock, and panic. Coughing, vomiting, obesity, poor wound healing, infection, and increased abdominal pressure increase risk.",
      tags: ["first-sentence-crash-course-2026-07-11", "wound", "surgery"]
    },
    {
      name: "Extrapyramidal symptoms",
      definition: "Extrapyramidal symptoms are drug-induced movement disorders from dopamine pathway blockade or imbalance, most often with antipsychotics and antiemetics. The fast categories are acute dystonia, akathisia, drug-induced parkinsonism, and later tardive dyskinesia.",
      pathology: "D2 blockade in basal ganglia circuits disrupts movement control. Tongue/neck spasm, oculogyric crisis, restlessness, rigidity, tremor, bradykinesia, or involuntary mouth/limb movements should be recognized as medication toxicity, not simply behavior.",
      tags: ["first-sentence-crash-course-2026-07-11", "EPS", "antipsychotic"]
    },
    {
      name: "Eye trauma",
      definition: "Eye trauma is blunt, penetrating, chemical, thermal, or foreign-body injury that can threaten the globe, cornea, retina, optic nerve, or orbital structures. Vision loss, severe pain, irregular pupil, hyphema, chemical exposure, penetrating object, or suspected globe rupture changes care immediately.",
      pathology: "Protect the eye from pressure, irrigate chemical exposures urgently when appropriate, shield suspected open globe, avoid removing embedded objects, and escalate vision-threatening findings.",
      tags: ["first-sentence-crash-course-2026-07-11", "eye", "trauma"]
    },
    {
      name: "Febrile seizure",
      definition: "A febrile seizure is a fever-associated seizure in a young child, classically 6 months to 5 years, without CNS infection, metabolic cause, or prior afebrile seizure disorder. Simple febrile seizures are generalized, last under 15 minutes, and do not recur within 24 hours; complex features need deeper evaluation.",
      pathology: "Rapid temperature rise and immature neuronal excitability lower seizure threshold. Protect airway and safety during the seizure, time it, check glucose/oxygen if indicated, and evaluate fever source after stabilization.",
      tags: ["first-sentence-crash-course-2026-07-11", "seizure", "pediatric"]
    },
    {
      name: "Focal seizure",
      definition: "A focal seizure starts in one brain network or hemisphere, so symptoms match the involved cortex: motor jerking, sensory change, autonomic symptoms, aura, speech arrest, fear, deja vu, or impaired awareness. It can stay focal or spread into bilateral tonic-clonic seizure activity.",
      pathology: "Because focal seizures can look like confusion, staring, odd behavior, stroke mimic, or panic, nursing assessment should capture onset, awareness, motor signs, duration, postictal state, triggers, glucose/oxygen, and injury risk.",
      tags: ["first-sentence-crash-course-2026-07-11", "seizure", "neurology"]
    },
    {
      name: "Full-thickness burn",
      definition: "A full-thickness burn destroys the epidermis and entire dermis and may extend into fat, fascia, muscle, or bone. It can look waxy white, brown, charred, leathery, or insensate because nerve endings are destroyed, but surrounding partial burns may be very painful.",
      pathology: "Full-thickness injury cannot regenerate normal skin from dermal structures, so grafting, infection prevention, fluid balance, compartment/circulation checks, and scar/contracture prevention become central.",
      tags: ["first-sentence-crash-course-2026-07-11", "burn", "wound"]
    },
    {
      name: "Generalized anxiety disorder",
      definition: "Generalized anxiety disorder is persistent excessive worry across multiple life areas with physical tension, restlessness, sleep disturbance, fatigue, irritability, or concentration difficulty. The problem is chronic threat overestimation and autonomic arousal, not a single panic surge.",
      pathology: "Assess function, sleep, substance/caffeine use, thyroid/cardiac mimics, suicidality, and whether avoidance or reassurance seeking is reinforcing the anxiety cycle.",
      tags: ["first-sentence-crash-course-2026-07-11", "anxiety", "psych"]
    },
    {
      name: "Generalized tonic-clonic seizure",
      definition: "A generalized tonic-clonic seizure is bilateral seizure activity with loss of consciousness, tonic stiffening, then clonic rhythmic jerking, usually followed by a postictal period. The immediate danger is airway obstruction, aspiration, injury, hypoxemia, and status epilepticus if prolonged.",
      pathology: "Do not restrain or put anything in the mouth. Time the seizure, protect from injury, position for airway when possible, check glucose/oxygen after, and escalate if it lasts 5 minutes or repeats without recovery.",
      tags: ["first-sentence-crash-course-2026-07-11", "seizure", "neurology"]
    },
    {
      name: "Glomerulonephritis",
      definition: "Glomerulonephritis is inflammation of renal glomeruli that damages the filtration barrier, producing a nephritic pattern of hematuria, proteinuria, edema, hypertension, and reduced kidney function. Immune injury after infection, autoimmune disease, vasculitis, or complement disorders is a common pathway.",
      pathology: "Inflamed glomerular capillaries leak red cells and protein while GFR falls, causing fluid retention and azotemia. Watch urine color/output, BP, edema, creatinine, potassium, and pulmonary edema signs.",
      tags: ["first-sentence-crash-course-2026-07-11", "kidney", "glomerulus"]
    },
    {
      name: "Hallucinogen intoxication",
      definition: "Hallucinogen intoxication is a substance-induced toxidrome that causes acute perceptual, cognitive, autonomic, and behavioral distortion from agents such as LSD, psilocybin, PCP-like drugs, or other psychoactive substances. The clinical issue is not only hallucinations; panic, impaired judgment, trauma, hyperthermia, hypertension, serotonin toxicity, or violent agitation can drive danger.",
      pathology: "Assess substance, co-ingestions, vital signs, temperature, mental status, trauma, serotonin/adrenergic signs, and need for calm low-stimulation safety support.",
      tags: ["first-sentence-crash-course-2026-07-11", "toxicology", "hallucinogen"]
    },
    {
      name: "Head trauma",
      definition: "Head trauma is external force to the scalp, skull, or brain that can cause concussion, contusion, skull fracture, intracranial bleeding, diffuse axonal injury, edema, or raised intracranial pressure. The key first-read cues are loss of consciousness, vomiting, severe headache, seizure, anticoagulants, pupil change, focal deficit, or worsening mental status.",
      pathology: "Primary injury happens at impact; secondary injury comes from hypoxia, hypotension, swelling, bleeding, fever, or metabolic derangement. Trend neuro checks because deterioration can lag behind the injury.",
      tags: ["first-sentence-crash-course-2026-07-11", "trauma", "head injury"]
    },
    {
      name: "Herniated disk",
      definition: "A herniated disk is a spinal disk disorder where nucleus pulposus or disk material displaces through the annulus, often causing nerve-root compression or inflammation. Radicular pain, numbness, weakness, reflex change, and pain worsened by cough/strain point to nerve-root involvement.",
      pathology: "Cauda equina red flags, including saddle anesthesia, bladder/bowel dysfunction, or progressive bilateral weakness, change this from back pain to emergency evaluation.",
      tags: ["first-sentence-crash-course-2026-07-11", "spine", "radiculopathy"]
    },
    {
      name: "Hip fracture",
      definition: "A hip fracture is a proximal femur fracture, often femoral neck, intertrochanteric, or subtrochanteric, classically after a fall in an older adult with osteoporosis. Shortened externally rotated leg, groin pain, inability to bear weight, bleeding risk, delirium, immobility, VTE, and surgery timing are high-yield.",
      pathology: "Intracapsular fractures can disrupt femoral head blood supply and cause avascular necrosis. Early pain control, neurovascular checks, pressure injury prevention, and pulmonary/VTE prevention matter.",
      tags: ["first-sentence-crash-course-2026-07-11", "fracture", "hip"]
    },
    {
      name: "Immune thrombocytopenic purpura",
      definition: "Immune thrombocytopenic purpura is immune-mediated platelet destruction and impaired platelet production causing isolated thrombocytopenia and mucocutaneous bleeding risk. Petechiae, purpura, bruising, epistaxis, gum bleeding, heavy menses, and platelet count trend matter more than clotting-time abnormalities.",
      pathology: "Autoantibodies target platelet antigens and splenic macrophages clear platelets. Severe thrombocytopenia raises intracranial or GI bleeding concern, especially with trauma or antiplatelet/anticoagulant exposure.",
      tags: ["first-sentence-crash-course-2026-07-11", "ITP", "platelets"]
    },
    {
      name: "Inhalation burn injury",
      definition: "Inhalation burn injury is heat, smoke, chemical, or particulate damage to the upper airway, lower airway, or alveoli after fire exposure. Facial burns, singed nasal hairs, soot, hoarseness, stridor, carbonaceous sputum, enclosed-space fire, or altered mental status can warn of delayed airway edema or carbon monoxide/cyanide toxicity.",
      pathology: "Upper-airway swelling can obstruct hours later, while smoke toxins and alveolar injury impair oxygen use and gas exchange. Early airway planning matters before swelling makes intubation difficult.",
      tags: ["first-sentence-crash-course-2026-07-11", "burn", "airway"]
    },
    {
      name: "Intrauterine growth restriction",
      definition: "Intrauterine growth restriction is fetal growth below expected genetic potential, often seen as estimated fetal weight under the 10th percentile or falling growth trajectory. Placental insufficiency, maternal hypertension/preeclampsia, smoking/substance exposure, infection, fetal anomalies, or multiple gestation can reduce nutrient and oxygen delivery.",
      pathology: "IUGR increases stillbirth, fetal distress, hypoglycemia, hypothermia, meconium, and long-term metabolic risk. Serial growth, Doppler studies, amniotic fluid, and fetal testing guide timing of delivery.",
      tags: ["first-sentence-crash-course-2026-07-11", "pregnancy", "IUGR"]
    },
    {
      name: "Kernicterus",
      definition: "Kernicterus is permanent bilirubin-induced neurologic injury, classically when unconjugated bilirubin crosses the newborn blood-brain barrier and deposits in basal ganglia/brainstem nuclei. Poor feeding, lethargy, hypotonia or hypertonia, high-pitched cry, arching, seizures, hearing loss, and choreoathetoid cerebral palsy are the danger path.",
      pathology: "Severe hyperbilirubinemia, hemolysis, prematurity, sepsis, acidosis, low albumin, and delayed treatment raise risk. Phototherapy and exchange transfusion logic is about preventing bilirubin from reaching brain tissue.",
      tags: ["first-sentence-crash-course-2026-07-11", "newborn", "bilirubin"]
    },
    {
      name: "Kidney stones",
      definition: "Kidney stones are crystalline mineral deposits, often calcium oxalate but also uric acid, struvite, calcium phosphate, or cystine, that form in the kidney and may obstruct the ureter. Classic renal colic is severe flank pain radiating to groin with hematuria, nausea, and restlessness.",
      pathology: "Supersaturated urine, dehydration, infection, metabolic risk, diet, medications, or anatomy can promote stone formation. Fever, solitary kidney, obstruction, AKI, pregnancy, or uncontrolled pain/vomiting changes urgency.",
      tags: ["first-sentence-crash-course-2026-07-11", "kidney stone", "nephrolithiasis"]
    },
    {
      name: "Lewy body dementia",
      definition: "Lewy body dementia is an alpha-synuclein neurodegenerative dementia with fluctuating attention, recurrent visual hallucinations, REM sleep behavior disorder, parkinsonism, and autonomic dysfunction. A major safety pearl is severe sensitivity to antipsychotics, which can worsen rigidity, confusion, sedation, and neuroleptic malignant syndrome risk.",
      pathology: "Lewy bodies disrupt cortical, limbic, brainstem, dopaminergic, cholinergic, and autonomic networks. Memory may be less prominent early than visuospatial/executive fluctuation, hallucinations, dream enactment, falls, syncope, constipation, and parkinsonian gait.",
      tags: ["first-sentence-crash-course-2026-07-11", "dementia", "Lewy body"]
    },
    {
      name: "Low back pain",
      definition: "Low back pain is a symptom from lumbar muscle, ligament, disk, facet joint, vertebral, nerve-root, inflammatory, infectious, malignant, renal, or vascular causes. The first split is benign mechanical pain versus red flags: trauma, fever, cancer history, IV drug use, neurologic deficit, saddle anesthesia, bladder/bowel dysfunction, or unexplained weight loss.",
      pathology: "Most uncomplicated low back pain improves with time and activity guidance, but radiculopathy, cauda equina syndrome, fracture, epidural abscess, malignancy, or abdominal aortic aneurysm must not be missed.",
      tags: ["first-sentence-crash-course-2026-07-11", "back pain", "red flags"]
    },
    {
      name: "Lung cancer",
      definition: "Lung cancer is malignant growth from lung or bronchial epithelium, mainly non-small cell or small cell, that can obstruct airways, invade vessels/pleura, metastasize early, or create paraneoplastic syndromes. Persistent cough, hemoptysis, weight loss, chest pain, dyspnea, recurrent pneumonia, hoarseness, bone pain, or SIADH/hypercalcemia clues matter.",
      pathology: "Smoking is a major risk but not the only cause. Stage, histology, mutations, PD-L1 status, and performance status guide surgery, radiation, chemotherapy, immunotherapy, or targeted therapy.",
      tags: ["first-sentence-crash-course-2026-07-11", "lung cancer", "oncology"]
    },
    {
      name: "Macrosomia",
      definition: "Macrosomia is excessive fetal size, often birth weight over 4000 to 4500 g or above the 90th percentile for gestational age. Maternal diabetes, obesity, post-term pregnancy, prior macrosomia, and genetic size raise risk, but shoulder dystocia can still be unpredictable.",
      pathology: "The nursing relevance is birth trauma: shoulder dystocia, brachial plexus injury, clavicle fracture, postpartum hemorrhage, cesarean risk, and neonatal hypoglycemia, especially when maternal hyperglycemia drove fetal insulin excess.",
      tags: ["first-sentence-crash-course-2026-07-11", "pregnancy", "macrosomia"]
    },
    {
      name: "Mania",
      definition: "Mania is a pathologic period of elevated, expansive, or irritable mood plus increased energy, decreased need for sleep, pressured speech, racing thoughts, grandiosity, distractibility, and risky behavior. The danger is impaired judgment, psychosis, exhaustion, aggression, dehydration, substance use, and suicide/violence risk.",
      pathology: "Mania can occur in bipolar disorder, substances/stimulants, steroids, sleep deprivation, neurologic disease, or endocrine disease. Nursing care prioritizes low-stimulation safety, sleep/food/fluids, medication adherence, and boundary setting.",
      tags: ["first-sentence-crash-course-2026-07-11", "mania", "bipolar"]
    },
    {
      name: "Neonatal abstinence syndrome",
      definition: "Neonatal abstinence syndrome is newborn withdrawal after chronic in-utero exposure to opioids or other substances, causing autonomic, GI, and neurologic hyperirritability after birth. High-pitched cry, tremors, poor feeding, vomiting/diarrhea, sweating, fever, sneezing, yawning, sleep difficulty, and weight loss are high-yield cues.",
      pathology: "The newborn's nervous system loses the placental drug supply after delivery. Care focuses on low-stimulation soothing, feeding/hydration, weight, skin protection, family support, scoring/eat-sleep-console approach, and medication when severe.",
      tags: ["first-sentence-crash-course-2026-07-11", "newborn", "withdrawal"]
    },
    {
      name: "Neonatal hypoglycemia",
      definition: "Neonatal hypoglycemia is low newborn blood glucose from limited glycogen stores, high insulin exposure, prematurity, illness, cold stress, poor feeding, or maternal diabetes. Jitteriness, tremor, poor feeding, lethargy, apnea, cyanosis, temperature instability, high-pitched cry, or seizure can signal brain fuel risk.",
      pathology: "Newborns have high glucose demand and limited reserves. Early feeding, glucose gel/IV dextrose protocols, temperature support, and repeat checks prevent neurologic injury.",
      tags: ["first-sentence-crash-course-2026-07-11", "newborn", "glucose"]
    },
    {
      name: "Nephrotic syndrome",
      definition: "Nephrotic syndrome is heavy glomerular protein leakage causing massive proteinuria, hypoalbuminemia, edema, and often hyperlipidemia/lipiduria. Losing albumin lowers oncotic pressure, while urinary loss of antithrombin and immunoglobulins raises thrombosis and infection risk.",
      pathology: "Minimal change disease, FSGS, membranous nephropathy, diabetes, lupus, infections, and drugs can injure podocytes or the filtration barrier. Watch foamy urine, periorbital/generalized edema, weight gain, hypertension, kidney function, and clot/infection signs.",
      tags: ["first-sentence-crash-course-2026-07-11", "nephrotic syndrome", "proteinuria"]
    },
    {
      name: "Nuchal cord",
      definition: "Nuchal cord means the umbilical cord is wrapped around the fetal neck, sometimes loosely and harmlessly, sometimes tight enough to compress cord blood flow during contractions or descent. Variable decelerations, bradycardia, or difficulty reducing the loop at birth are the practical concerns.",
      pathology: "Most nuchal cords are managed at delivery without injury, but tight or multiple loops can reduce venous return and oxygen delivery. Avoid panic; respond to the fetal tracing and provider/midwife maneuvers.",
      tags: ["first-sentence-crash-course-2026-07-11", "labor", "umbilical cord"]
    },
    {
      name: "Obsessive-compulsive disorder",
      definition: "Obsessive-compulsive disorder is intrusive unwanted obsessions plus repetitive compulsions or mental rituals performed to reduce distress or prevent feared outcomes. The loop becomes pathologic when it consumes time, impairs function, or traps the client in reassurance/checking/cleaning/counting cycles.",
      pathology: "Clients often know the thoughts are excessive but feel driven to neutralize anxiety. Assess suicidality, skin injury, malnutrition, family accommodation, and response to CBT/ERP or SSRI/clomipramine therapy.",
      tags: ["first-sentence-crash-course-2026-07-11", "OCD", "psych"]
    },
    {
      name: "Oligohydramnios",
      definition: "Oligohydramnios is low amniotic fluid, often defined by low amniotic fluid index or deepest vertical pocket, and reflects reduced fetal urine production, ruptured membranes, placental insufficiency, post-term pregnancy, or fetal renal/urinary anomalies. Low fluid increases cord compression, fetal distress, limb/face compression, and pulmonary hypoplasia risk when severe early.",
      pathology: "Nursing interpretation connects fetal movement, fundal size, membrane status, fetal testing, Dopplers, and variable decelerations. Management depends on gestational age, cause, and fetal status.",
      tags: ["first-sentence-crash-course-2026-07-11", "pregnancy", "amniotic fluid"]
    },
    {
      name: "Open fracture",
      definition: "An open fracture is a broken bone that communicates with the outside environment through a skin wound, making contamination and infection central risks. Treat it as orthopedic trauma plus wound emergency: cover sterile, assess neurovascular status, control bleeding, give antibiotics/tetanus per protocol, and prepare for irrigation/debridement.",
      pathology: "Bone exposure is not required; a small puncture over a fracture can be open. Complications include osteomyelitis, compartment syndrome, hemorrhage, nonunion, and neurovascular injury.",
      tags: ["first-sentence-crash-course-2026-07-11", "fracture", "trauma"]
    },
    {
      name: "Opioid intoxication",
      definition: "Opioid intoxication is excessive mu-opioid receptor effect causing CNS depression, respiratory depression, and often miosis. Ventilation comes first because hypoventilation and hypoxia kill before the drug level itself does; naloxone reverses receptors but may wear off before long-acting opioids.",
      pathology: "Assess respiratory rate/depth, oxygenation, CO2 retention, level of consciousness, pupils, co-ingestions, long-acting formulations, aspiration, and withdrawal/agitation after reversal.",
      tags: ["first-sentence-crash-course-2026-07-11", "opioid", "toxicology"]
    },
    {
      name: "Osteomalacia",
      definition: "Osteomalacia is defective mineralization of adult bone matrix, usually from vitamin D deficiency, phosphate wasting, malabsorption, kidney disease, or medication effects. Bone becomes soft, causing diffuse bone pain, proximal muscle weakness, waddling gait, fractures, and elevated alkaline phosphatase patterns.",
      pathology: "Unlike osteoporosis, the problem is poor mineralization of osteoid rather than only low bone mass. Calcium, phosphate, vitamin D, PTH, renal function, and malabsorption history guide cause.",
      tags: ["first-sentence-crash-course-2026-07-11", "bone", "vitamin d"]
    },
    {
      name: "Paget disease",
      definition: "Paget disease of bone is excessive disorganized bone remodeling where osteoclast overactivity is followed by chaotic osteoblast repair, creating enlarged but weak vascular bone. Bone pain, deformity, warmth, hearing loss from skull involvement, fracture, spinal stenosis, and high alkaline phosphatase are classic clues.",
      pathology: "The bone may look bigger but is mechanically abnormal. Bisphosphonate logic is to suppress osteoclast-driven high-turnover remodeling.",
      tags: ["first-sentence-crash-course-2026-07-11", "bone", "Paget"]
    },
    {
      name: "Panic disorder",
      definition: "Panic disorder is recurrent unexpected panic attacks followed by persistent worry about more attacks or maladaptive avoidance. A panic attack is a sudden surge of fear with palpitations, dyspnea, chest tightness, trembling, sweating, dizziness, paresthesias, derealization, or fear of dying/losing control.",
      pathology: "Do not assume every panic-like episode is psychiatric; screen chest pain, arrhythmia, asthma/PE, hypoglycemia, thyroid disease, substance/caffeine effects, and suicidality when context fits.",
      tags: ["first-sentence-crash-course-2026-07-11", "panic", "psych"]
    },
    {
      name: "Partial-thickness burn",
      definition: "A partial-thickness burn injures the epidermis and part of the dermis, producing moist painful tissue, blisters, capillary leak, and infection risk while some dermal structures remain for healing. Depth determines whether it is superficial partial thickness with brisk blanching or deep partial thickness with slower healing and scarring risk.",
      pathology: "Pain does not prove severity because full-thickness centers may be numb. Assess TBSA, location, circumferential injury, inhalation risk, tetanus, fluid loss, and wound conversion.",
      tags: ["first-sentence-crash-course-2026-07-11", "burn", "wound"]
    },
    {
      name: "Pelvic fracture",
      definition: "A pelvic fracture is disruption of the pelvic ring or acetabulum that can hide massive retroperitoneal bleeding and injure bladder, urethra, vessels, nerves, or abdominal organs. Hypotension after high-energy pelvic trauma is hemorrhage until proven otherwise.",
      pathology: "Assess pelvic stability only carefully, look for perineal bruising, blood at meatus, urinary retention, leg length/rotation, neurovascular status, and need for binder, transfusion, embolization, or surgery.",
      tags: ["first-sentence-crash-course-2026-07-11", "pelvis", "trauma"]
    },
    {
      name: "Perineal laceration",
      definition: "A perineal laceration is tearing of vaginal/perineal tissue during birth, graded first through fourth degree by depth and anal sphincter/rectal involvement. The key is not just pain: bleeding, hematoma, infection, wound separation, urinary retention, and long-term continence/sexual pain risk depend on severity.",
      pathology: "First degree involves skin/mucosa, second includes perineal muscles, third involves anal sphincter, and fourth extends into rectal mucosa. Ice, pain control, stool softening, hygiene, and escalation for severe pain/pressure matter.",
      tags: ["first-sentence-crash-course-2026-07-11", "postpartum", "laceration"]
    },
    {
      name: "Phantom limb pain",
      definition: "Phantom limb pain is pain perceived in an amputated body part because peripheral nerve injury and central nervous system remapping keep generating limb sensations after tissue loss. It is real neuropathic pain, not imagination.",
      pathology: "Burning, shooting, cramping, or stabbing pain may coexist with residual limb pain or neuroma. Mirror therapy, desensitization, neuropathic pain medications, prosthetic fit, and stump assessment may all matter.",
      tags: ["first-sentence-crash-course-2026-07-11", "amputation", "neuropathic pain"]
    },
    {
      name: "Phobias",
      definition: "A phobia is an anxiety disorder defined by intense disproportionate fear and avoidance of a specific object, situation, or social exposure that causes distress or functional limitation. The core mechanism is learned threat response and avoidance reinforcement, not simple dislike.",
      pathology: "Specific phobia, social anxiety disorder, and agoraphobia differ by trigger. Assessment focuses on impairment, panic symptoms, avoidance, safety behaviors, trauma/substance mimics, and exposure-based treatment readiness.",
      tags: ["first-sentence-crash-course-2026-07-11", "phobia", "psych"]
    },
    {
      name: "Polyhydramnios",
      definition: "Polyhydramnios is excessive amniotic fluid, often linked to maternal diabetes, fetal swallowing impairment, GI obstruction, neural tube disorders, anemia/hydrops, multiple gestation, or idiopathic causes. The distended uterus raises risk for preterm labor, malpresentation, cord prolapse after rupture, placental abruption, and postpartum hemorrhage.",
      pathology: "Large fundal height, maternal dyspnea/discomfort, unstable lie, and abnormal ultrasound fluid measures guide evaluation. Management depends on severity, gestational age, and fetal/maternal cause.",
      tags: ["first-sentence-crash-course-2026-07-11", "pregnancy", "amniotic fluid"]
    },
    {
      name: "Postictal state",
      definition: "Postictal state is the recovery period after a seizure, when the brain is temporarily exhausted or regionally suppressed. Confusion, sleepiness, headache, nausea, muscle soreness, transient weakness, aphasia, or agitation can occur, but failure to return toward baseline raises concern for ongoing seizure, stroke, hypoxia, infection, or metabolic cause.",
      pathology: "Trend airway, breathing, oxygenation, glucose, injury, neuro deficits, and time to baseline. Todd paralysis can mimic stroke but still needs careful assessment.",
      tags: ["first-sentence-crash-course-2026-07-11", "seizure", "postictal"]
    },
    {
      name: "Postpartum depression",
      definition: "Postpartum depression is major depressive illness after childbirth with persistent low mood, anhedonia, guilt, sleep/appetite disruption beyond newborn care, anxiety, impaired bonding, or intrusive harm thoughts. It is more severe and persistent than transient baby blues and requires safety screening.",
      pathology: "Hormonal shifts, sleep deprivation, prior mood disorder, trauma, poor support, thyroid disease, substance use, and birth complications can contribute. Always assess suicidal thoughts, thoughts of harming baby, psychosis, and ability to care safely.",
      tags: ["first-sentence-crash-course-2026-07-11", "postpartum", "depression"]
    },
    {
      name: "Postpartum psychosis",
      definition: "Postpartum psychosis is a psychiatric emergency with hallucinations, delusions, severe confusion, mania, agitation, insomnia, or bizarre behavior after childbirth. It carries high suicide and infanticide risk, so immediate safety protection and urgent psychiatric care matter.",
      pathology: "It is often linked to bipolar spectrum illness or prior postpartum psychosis. Do not treat it as ordinary anxiety or sleep deprivation when reality testing is impaired.",
      tags: ["first-sentence-crash-course-2026-07-11", "postpartum", "psychosis"]
    },
    {
      name: "Retained placenta",
      definition: "Retained placenta means the placenta does not deliver completely or placental fragments remain after birth, preventing firm uterine contraction and increasing postpartum hemorrhage/infection risk. Think persistent bleeding, boggy uterus, missing cotyledon, prolonged third stage, or fever/subinvolution later.",
      pathology: "Causes include trapped placenta, placenta adherens, accreta spectrum, uterine atony, or incomplete separation. Management may require uterotonics, manual removal, curettage, hemorrhage protocol, antibiotics, or surgical support.",
      tags: ["first-sentence-crash-course-2026-07-11", "postpartum", "placenta"]
    },
    {
      name: "Schizoaffective disorder",
      definition: "Schizoaffective disorder combines schizophrenia-spectrum psychosis with major mood episodes, plus at least a period of hallucinations or delusions when mood symptoms are not dominant. The diagnostic hinge is psychosis independent of mood episodes, not simply depression or mania with psychotic features.",
      pathology: "Assess hallucinations, delusions, disorganization, mood polarity, suicidality, medication adherence, substance use, sleep, and ability to maintain safety/basic needs.",
      tags: ["first-sentence-crash-course-2026-07-11", "psychosis", "mood disorder"]
    },
    {
      name: "Sickle cell crisis in children",
      definition: "Sickle cell crisis in children is vaso-occlusion from sickled red cells blocking microcirculation, causing ischemic pain and organ injury. Infection, dehydration, hypoxia, cold stress, acidosis, or fever can trigger crisis, and children may deteriorate quickly from splenic sequestration, acute chest syndrome, stroke, or sepsis.",
      pathology: "Nursing priorities are pain control, hydration without overload, oxygen only if hypoxic, incentive spirometry, fever evaluation, neuro checks, and rapid escalation for chest pain, dyspnea, weakness, severe anemia, or splenic enlargement.",
      tags: ["first-sentence-crash-course-2026-07-11", "sickle cell", "pediatric"]
    },
    {
      name: "Sleep apnea",
      definition: "Sleep apnea is recurrent breathing interruption during sleep, most often from upper-airway collapse in obstructive sleep apnea or impaired respiratory drive in central sleep apnea. Repeated hypoxemia and arousals cause sympathetic surges, fragmented sleep, daytime sleepiness, hypertension, arrhythmia risk, and cardiometabolic strain.",
      pathology: "Snoring, witnessed apneas, morning headache, obesity/neck circumference, resistant hypertension, atrial fibrillation, and excessive daytime sleepiness are high-yield clues. CPAP works by splinting the airway open.",
      tags: ["first-sentence-crash-course-2026-07-11", "sleep apnea", "airway"]
    },
    {
      name: "Sprain",
      definition: "A sprain is stretching or tearing of a ligament, the tissue connecting bone to bone at a joint. Pain, swelling, bruising, instability, pop sensation, and inability to bear weight help separate mild ligament injury from fracture or complete rupture.",
      pathology: "Grade I is microscopic stretch, grade II partial tear, and grade III complete tear/instability. Neurovascular status and Ottawa-style fracture rules can change evaluation.",
      tags: ["first-sentence-crash-course-2026-07-11", "orthopedic", "ligament"]
    },
    {
      name: "Stimulant intoxication",
      definition: "Stimulant intoxication is excessive catecholamine/dopamine signaling from cocaine, amphetamines, or similar drugs, producing agitation, insomnia, tachycardia, hypertension, mydriasis, sweating, tremor, chest pain, hyperthermia, seizures, or psychosis. The lethal risks are dysrhythmia, MI, stroke, severe hyperthermia, rhabdomyolysis, and excited delirium.",
      pathology: "Assess temperature, ECG, BP, chest pain, neuro status, CK/renal risk, co-ingestions, and need for benzodiazepine sedation/cooling/supportive care per protocol.",
      tags: ["first-sentence-crash-course-2026-07-11", "toxicology", "stimulant"]
    },
    {
      name: "Strain",
      definition: "A strain is stretching or tearing of muscle or tendon, the tissue unit that generates movement and attaches muscle to bone. It causes localized pain, spasm, weakness, bruising, and pain with resisted movement, unlike sprain which primarily injures ligaments.",
      pathology: "Severity ranges from microscopic fiber injury to complete rupture with loss of function. Assess mechanism, deformity, neurovascular status, and whether fracture/tendon rupture is possible.",
      tags: ["first-sentence-crash-course-2026-07-11", "orthopedic", "muscle"]
    },
    {
      name: "Stress fracture",
      definition: "A stress fracture is a tiny bone crack from repetitive load exceeding bone remodeling capacity, common in runners, military training, osteoporosis, low energy availability, or sudden activity increases. Focal pain that worsens with activity and improves with rest is the classic clue.",
      pathology: "Early x-rays can be normal; MRI or bone scan may detect injury sooner. Continuing impact can progress to complete fracture, especially in high-risk sites such as femoral neck or navicular.",
      tags: ["first-sentence-crash-course-2026-07-11", "fracture", "overuse"]
    },
    {
      name: "Sundowning",
      definition: "Sundowning is late-day or evening worsening of confusion, agitation, wandering, or sleep-wake disruption, usually in dementia or delirium-prone clients. It reflects reduced cognitive reserve plus fatigue, low light, overstimulation/understimulation, pain, hunger, infection, medications, or sleep disruption.",
      pathology: "The nursing move is not restraint first; assess unmet needs, delirium triggers, environment, toileting, pain, glasses/hearing aids, sleep routine, and safety supervision.",
      tags: ["first-sentence-crash-course-2026-07-11", "dementia", "delirium"]
    },
    {
      name: "Superficial burn",
      definition: "A superficial burn injures only the epidermis, causing red, dry, blanchable, painful skin without blisters, like a mild sunburn. It usually heals without scarring because the dermis and appendages remain intact.",
      pathology: "Escalate if the burn is extensive, chemical/electrical, involves face/hands/genitals/airway, or the appearance suggests deeper partial/full-thickness injury.",
      tags: ["first-sentence-crash-course-2026-07-11", "burn", "skin"]
    },
    {
      name: "Syncope",
      definition: "Syncope is transient loss of consciousness from brief global cerebral hypoperfusion, followed by spontaneous recovery. The first split is reflex/vasovagal, orthostatic, cardiac rhythm/structural, neurologic mimic, hypoglycemia, bleeding, PE, or medication effect.",
      pathology: "Red flags include exertional syncope, chest pain, palpitations, abnormal ECG, family sudden death, severe anemia/bleeding, pregnancy, persistent neuro deficit, or injury.",
      tags: ["first-sentence-crash-course-2026-07-11", "syncope", "perfusion"]
    },
    {
      name: "Tardive dyskinesia",
      definition: "Tardive dyskinesia is delayed involuntary choreiform or athetoid movement after chronic dopamine receptor blockade, especially antipsychotics or metoclopramide. Lip smacking, tongue movements, chewing, grimacing, trunk/limb movements, and persistence after stopping the drug distinguish it from acute EPS.",
      pathology: "Risk rises with older age, female sex, mood disorders, diabetes, longer exposure, and first-generation antipsychotics. Screen with AIMS-style observation and report early because it can become irreversible.",
      tags: ["first-sentence-crash-course-2026-07-11", "tardive dyskinesia", "EPS"]
    },
    {
      name: "Thrombotic thrombocytopenic purpura",
      definition: "Thrombotic thrombocytopenic purpura is life-threatening microangiopathic thrombosis, usually from severe ADAMTS13 deficiency or inhibition, causing platelet-rich microthrombi and sheared red cells. The core pattern is thrombocytopenia plus hemolytic anemia, with neurologic changes, kidney injury, fever, or purpura possible.",
      pathology: "Do not wait for the full classic pentad. Schistocytes, high LDH, low haptoglobin, low platelets, neurologic symptoms, and renal findings require urgent plasma exchange/steroid pathway consideration.",
      tags: ["first-sentence-crash-course-2026-07-11", "TTP", "microangiopathy"]
    },
    {
      name: "Transient tachypnea of newborn",
      definition: "Transient tachypnea of the newborn is delayed clearance of fetal lung fluid causing early newborn tachypnea and mild oxygen need, especially after cesarean birth without labor, prematurity, or maternal diabetes. It is usually self-limited, but it must be distinguished from sepsis, pneumonia, RDS, hypoglycemia, and congenital heart disease.",
      pathology: "Tachypnea soon after birth with relatively mild distress and hyperinflation/fluid in fissures on x-ray supports TTN. Feeding safety depends on respiratory rate and work of breathing.",
      tags: ["first-sentence-crash-course-2026-07-11", "newborn", "respiratory"]
    },
    {
      name: "Type 1 diabetes in children",
      definition: "Type 1 diabetes in children is autoimmune beta-cell destruction causing absolute insulin deficiency, so the child needs exogenous insulin for survival. Polyuria, polydipsia, weight loss, fatigue, nocturnal enuresis, abdominal pain, vomiting, or Kussmaul respirations can be the road into DKA.",
      pathology: "Without insulin, glucose cannot be used effectively, lipolysis produces ketones, and osmotic diuresis causes dehydration and electrolyte loss. Education must protect insulin access, hypoglycemia treatment, sick-day rules, and family dosing skills.",
      tags: ["first-sentence-crash-course-2026-07-11", "type 1 diabetes", "pediatric"]
    },
    {
      name: "Vascular dementia",
      definition: "Vascular dementia is cognitive decline from cerebrovascular disease, including multiple infarcts, strategic single infarct, chronic small-vessel ischemia, or hemorrhagic injury. Executive dysfunction, slowed processing, gait change, focal neurologic signs, stepwise decline, and stroke risk factors often stand out.",
      pathology: "Hypertension, diabetes, atrial fibrillation, smoking, hyperlipidemia, and prior stroke/TIA drive risk. Prevention logic is vascular risk control, antithrombotic plan when indicated, mobility/safety support, and delirium prevention.",
      tags: ["first-sentence-crash-course-2026-07-11", "vascular dementia", "stroke"]
    },
    {
      name: "Addison disease",
      definition: "Addison disease is primary adrenal insufficiency: damaged adrenal cortex cannot make enough cortisol and often aldosterone, causing fatigue, weight loss, hyperpigmentation, hypotension, salt craving, hyponatremia, hyperkalemia, and shock risk under stress. The crash-course danger is adrenal crisis when infection, trauma, surgery, vomiting, or missed steroids outstrips cortisol reserve.",
      pathology: "Autoimmune adrenalitis is common in high-resource settings; TB, hemorrhage, metastasis, or infiltrative disease are other causes. Low cortisol removes vascular/catecholamine support and low aldosterone wastes sodium while retaining potassium.",
      tags: ["first-sentence-crash-course-2026-07-11", "adrenal insufficiency", "cortisol"]
    },
    {
      name: "Anthrax",
      definition: "Anthrax is infection from Bacillus anthracis spores, producing cutaneous black eschar disease, inhalational mediastinitis/sepsis, gastrointestinal disease, injection-related soft-tissue infection, or meningitis depending on exposure route. The reason it is high-yield is toxin-mediated edema, shock, and bioterrorism/exposure-control urgency.",
      pathology: "B. anthracis spores germinate after entering skin, lungs, GI tract, or tissue; protective antigen, edema factor, and lethal factor disrupt host defenses and vascular integrity. Do not treat a painless black eschar or severe flu-like illness after suspicious exposure as routine cellulitis or pneumonia.",
      tags: ["first-sentence-crash-course-2026-07-11", "anthrax", "bioterrorism"]
    },
    {
      name: "Aortic aneurysm",
      definition: "Aortic aneurysm is focal dilation of a weakened aortic wall, usually defined as at least 50% wider than expected, creating rupture, dissection, thromboembolism, and compression risk. Abdominal aneurysms may be silent or pulsatile/back-abdominal pain; thoracic aneurysms may cause chest/back pain, hoarseness, dysphagia, or aortic-regurgitation signs.",
      pathology: "Wall degeneration from atherosclerosis, hypertension, smoking, connective-tissue disease, infection, or inflammation weakens elastin/collagen. Sudden severe pain, hypotension, syncope, pulse deficit, or expanding mass is an emergency pattern.",
      tags: ["first-sentence-crash-course-2026-07-11", "aortic aneurysm", "vascular"]
    },
    {
      name: "Pulmonary compliance",
      definition: "Pulmonary compliance is how easily the lungs and chest wall expand for a given pressure change; low compliance means stiff lungs that need more pressure to deliver volume, while high compliance means floppy overdistended lungs with poor elastic recoil. It is a mechanics concept, not a diagnosis, and it helps explain ARDS, pulmonary edema, fibrosis, emphysema, ventilation pressures, and work of breathing.",
      pathology: "Compliance falls with alveolar flooding, atelectasis, fibrosis, chest-wall restriction, or abdominal pressure; it rises in emphysema when elastic tissue is destroyed. Trend it with plateau pressure, tidal volume, oxygenation, and client effort.",
      tags: ["first-sentence-crash-course-2026-07-11", "respiratory mechanics", "compliance"]
    },
    {
      name: "Pulse pressure",
      definition: "Pulse pressure (PP) is systolic blood pressure (SBP) minus diastolic blood pressure (DBP): PP = SBP - DBP, measured in mm Hg. A blood pressure of 120/80 mm Hg gives a pulse pressure of 40 mm Hg; about 40 mm Hg is typical for a resting young adult. A commonly cited adult definition of narrow pulse pressure is less than 25% of SBP. Definitions of wide pulse pressure vary by purpose: 60 mm Hg or greater is an arterial-stiffness and cardiovascular-risk marker in older adults, while greater than 100 mm Hg is a conventional threshold for markedly widened pulse pressure. No single cutoff applies to every age, pregnancy, or clinical situation, and pulse pressure is not a stand-alone diagnosis.",
      plainLanguage: "Pulse pressure is the gap between the top and bottom blood-pressure numbers.",
      whyItMatters: "Pulse pressure matters because a narrowing trend with poor perfusion can warn of falling forward blood flow and shock, while persistent widening can signal stiff arteries or another circulatory problem; nurses confirm the measurement, assess symptoms and perfusion, and trend the value.",
      pathology: "Pulse pressure is shaped by stroke volume (blood pumped with each beat), arterial compliance (how easily arteries stretch), vascular tone, and diastolic runoff (how quickly pressure falls between beats). Low forward flow tends to narrow the gap; forceful ejection, rapid runoff, vasodilation, or age-related aortic stiffening can widen it. Interpret the number with MAP, heart rate, perfusion, rhythm, valve findings, volume status, age, pregnancy status, symptoms, and trend.",
      tags: ["first-sentence-crash-course-2026-07-11", "hemodynamics", "pulse pressure"]
    },
    {
      name: "Respiratory acidosis",
      definition: "Respiratory acidosis is acidemia from alveolar hypoventilation retaining carbon dioxide, so PaCO2 rises and carbonic acid lowers pH. The clinical meaning is ventilatory failure or inadequate ventilation relative to CO2 production, from COPD, CNS depression, neuromuscular weakness, severe asthma, airway obstruction, chest-wall problems, or fatigue.",
      pathology: "Acute respiratory acidosis can cause confusion, somnolence, headache, dysrhythmias, and hemodynamic instability; chronic cases may show renal bicarbonate retention. Fixing oxygen alone does not remove CO2 when ventilation is failing.",
      tags: ["first-sentence-crash-course-2026-07-11", "acid base", "hypercapnia"]
    },
    {
      name: "Smoke inhalation injury",
      definition: "Smoke inhalation injury is airway and lung injury from heat, soot, chemical irritants, and toxic gases such as carbon monoxide or cyanide, often worsening after the burn scene looks controlled. The first-read danger is delayed airway edema, bronchospasm, impaired oxygen delivery, ARDS, and poisoning despite a pulse oximeter that can look falsely reassuring with carbon monoxide.",
      pathology: "Facial burns, singed nasal hair, soot in mouth/sputum, hoarseness, stridor, enclosed-space fire, altered mental status, or metabolic acidosis should raise urgency. Early airway planning matters because swelling can make later intubation harder.",
      tags: ["first-sentence-crash-course-2026-07-11", "burn", "inhalation injury"]
    },
    {
      name: "Silent MI",
      definition: "Silent MI is myocardial necrosis from prolonged coronary ischemia that occurs without classic crushing chest pain, especially in diabetes, older adults, women, chronic kidney disease, or neuropathy. It may present as dyspnea, fatigue, nausea, diaphoresis, syncope, heart failure, dysrhythmia, or vague epigastric discomfort.",
      pathology: "The myocardium still dies even when pain signaling is muted. ECG changes, troponin rise/fall, new wall-motion abnormality, or heart-failure findings can reveal the event.",
      tags: ["first-sentence-crash-course-2026-07-11", "myocardial infarction", "ischemia"]
    },
    {
      name: "Steatohepatitis",
      definition: "Steatohepatitis is fatty liver disease with hepatocyte injury and inflammation, meaning steatosis has progressed from stored triglyceride to active liver-cell damage that can scar into fibrosis, cirrhosis, portal hypertension, and hepatocellular carcinoma. Alcohol-associated and metabolic dysfunction-associated pathways can look similar histologically, so risk history and labs matter.",
      pathology: "Insulin resistance, obesity, dyslipidemia, diabetes, alcohol exposure, medications, or genetic factors can overload hepatocytes with lipid and oxidative/inflammatory stress. ALT/AST may be mild or misleading, so fibrosis risk assessment matters more than one normal-looking enzyme value.",
      tags: ["first-sentence-crash-course-2026-07-11", "steatohepatitis", "liver"]
    },
    {
      name: "Stroke",
      definition: "Stroke is acute neurologic injury from interrupted brain blood flow or intracranial bleeding, producing sudden focal deficits such as face droop, arm weakness, speech trouble, vision loss, neglect, ataxia, severe headache, or altered mental status. The first split is ischemic versus hemorrhagic because reperfusion, BP targets, antithrombotics, reversal, and neurosurgical priorities diverge fast.",
      pathology: "Time last known well, glucose, CT/CTA pathway, neurologic exam trend, swallow safety, airway, BP, anticoagulant use, and thrombolysis/thrombectomy eligibility drive early care.",
      tags: ["first-sentence-crash-course-2026-07-11", "stroke", "brain"]
    }
  ];

  pharmUpdates.push(
    {
      name: "Caffeine citrate",
      generic: "caffeine citrate",
      displayName: "Caffeine citrate",
      nclexEssential: true,
      class: "Methylxanthine respiratory stimulant; adenosine receptor antagonist",
      usedToTreat: "Apnea of prematurity in premature neonates, with cardiorespiratory monitoring and weight-based dosing.",
      description: "Caffeine citrate is a neonatal methylxanthine respiratory stimulant that antagonizes adenosine receptors, increasing medullary respiratory-drive signaling for apnea of prematurity. The crash-course frame is more breathing effort with a narrow premature-infant safety lens: tachycardia, feeding intolerance, jitteriness, seizures at toxic levels, and serum/weight monitoring when ordered.",
      mechanism: "Caffeine blocks adenosine A1/A2A signaling and weakly inhibits phosphodiesterase at higher concentrations, increasing medullary respiratory drive, respiratory-center responsiveness to carbon dioxide (CO2), and diaphragmatic contractility. In premature infants this reduces central apnea spells, but immature clearance makes dosing interval, heart rate, feeding tolerance, and toxicity surveillance important.",
      adverseEffects: ["Tachycardia, irritability/jitteriness, feeding intolerance, vomiting, diuresis, sleep disruption, and seizures or dysrhythmia with toxicity."],
      keyLabs: ["Weight-based dosing checks, apnea/bradycardia trends, heart rate, feeding tolerance, hydration, and serum caffeine concentration when clinically ordered."],
      nclexTraps: ["Caffeine citrate is not a vague stimulant; it is a neonatal methylxanthine/adenosine antagonist used for apnea of prematurity."],
      tags: ["first-sentence-power-line-2026-07-11", "caffeine citrate", "methylxanthine", "adenosine", "apnea of prematurity"]
    },
    {
      name: "Calcium chloride",
      generic: "calcium chloride",
      displayName: "Calcium chloride",
      class: "Concentrated IV calcium salt; emergency ionized-calcium replacement and myocardial membrane stabilizer",
      description: "Calcium chloride is a concentrated IV calcium salt that rapidly raises ionized calcium and stabilizes myocardial cell membranes during dangerous hypocalcemia, calcium-channel-blocker toxicity, or hyperkalemia ECG instability. It is more caustic and calcium-dense than calcium gluconate, so central-line preference, extravasation injury, ECG monitoring, and compatibility matter.",
      mechanism: "Calcium chloride dissociates into calcium ions that restore extracellular calcium availability for myocardial, neuromuscular, and coagulation physiology. In hyperkalemia it does not remove potassium; it raises the threshold potential and stabilizes cardiac excitability while insulin, beta agonists, bicarbonate when indicated, binders, or dialysis move/remove potassium.",
      nclexTraps: ["Calcium chloride protects the heart fast but does not lower total body potassium."],
      tags: ["first-sentence-power-line-2026-07-11", "calcium chloride", "hyperkalemia", "hypocalcemia"]
    },
    {
      name: "Cetirizine",
      generic: "cetirizine",
      displayName: "Cetirizine",
      class: "Second-generation peripheral H1 antihistamine",
      description: "Cetirizine is a second-generation H1 antihistamine that blocks peripheral histamine H1 signaling to reduce sneezing, rhinorrhea, itching, urticaria, and wheal-flare responses. It penetrates the CNS less than first-generation antihistamines, so sedation and anticholinergic effects are usually lower but drowsiness can still occur.",
      mechanism: "Cetirizine selectively antagonizes peripheral H1 receptors, reducing histamine-mediated vascular leak, sensory-nerve itching, and allergic nasal/skin symptoms. Renal clearance, additive sedation, and older-adult fall risk are practical nursing checks.",
      tags: ["first-sentence-power-line-2026-07-11", "cetirizine", "H1 antihistamine"]
    },
    {
      name: "Cosyntropin",
      generic: "cosyntropin",
      displayName: "Cosyntropin",
      class: "Synthetic ACTH diagnostic agent; adrenal stimulation test medication",
      description: "Cosyntropin is synthetic ACTH that stimulates adrenal melanocortin-2 receptors so clinicians can test whether the adrenal cortex can produce cortisol on demand. A poor cortisol rise after dosing suggests impaired adrenal reserve, so timing, baseline cortisol, recent steroids, acute illness, and specimen handling matter.",
      mechanism: "Cosyntropin mimics adrenocorticotropic hormone at adrenal melanocortin-2 receptors, activating steroidogenesis and cortisol release from the adrenal cortex. It is a diagnostic challenge, not chronic adrenal replacement.",
      tags: ["first-sentence-power-line-2026-07-11", "cosyntropin", "ACTH", "cortisol"]
    },
    {
      name: "Sevelamer",
      generic: "sevelamer",
      displayName: "Sevelamer",
      class: "Non-calcium, nonabsorbed phosphate binder",
      description: "Sevelamer is a nonabsorbed polymer phosphate binder that binds dietary phosphate in the GI tract so phosphate leaves in stool instead of entering the bloodstream. Its first-read identity is CKD hyperphosphatemia control without added calcium or aluminum, with constipation/obstruction risk, meal timing, and drug-separation teaching.",
      mechanism: "Sevelamer's amine groups bind negatively charged phosphate in the intestinal lumen, forming nonabsorbed complexes excreted in feces. It lowers serum phosphate only when taken with meals or snacks that contain phosphate.",
      nclexTraps: ["Sevelamer is not absorbed and does not replace dialysis; it binds phosphate in the gut when taken with food."],
      tags: ["first-sentence-power-line-2026-07-11", "sevelamer", "phosphate binder", "CKD"]
    },
    {
      name: "Vilanterol",
      generic: "vilanterol",
      displayName: "Vilanterol",
      class: "Long-acting beta-2 agonist (LABA) bronchodilator",
      description: "Vilanterol is a long-acting beta-2 agonist bronchodilator that stimulates airway beta-2 receptors to raise cAMP and relax bronchial smooth muscle for maintenance airflow control. It is not a rescue inhaler; asthma use requires anti-inflammatory controller pairing because bronchodilation alone does not treat airway inflammation.",
      mechanism: "Vilanterol activates beta-2 receptors on bronchial smooth muscle, increasing Gs/adenylyl cyclase signaling and cAMP, which relaxes airways for many hours. Tremor, tachycardia, hypokalemia, paradoxical bronchospasm, and correct combination-product use are nursing anchors.",
      tags: ["first-sentence-power-line-2026-07-11", "vilanterol", "LABA", "beta-2"]
    },
    {
      name: "Coenzyme Q10",
      generic: "coenzyme q10",
      displayName: "Coenzyme Q10",
      class: "Mitochondrial electron-transport cofactor; ubiquinone supplement",
      description: "Coenzyme Q10 is ubiquinone, a lipid-soluble electron carrier that shuttles electrons through the mitochondrial respiratory chain and limits membrane lipid oxidation. As a supplement it is studied for possible statin-associated muscle symptoms, migraine, heart-failure interest, or mitochondrial support, but evidence and product quality vary.",
      mechanism: "CoQ10 cycles between oxidized and reduced forms while transferring electrons between complexes I/II and III in mitochondria, supporting ATP generation and antioxidant membrane protection.",
      tags: ["first-sentence-power-line-2026-07-11", "coenzyme q10", "mitochondria"]
    },
    {
      name: "Niacin vitamin B3",
      generic: "niacin",
      displayName: "Niacin vitamin B3",
      aliases: ["vitamin B3", "nicotinic acid"],
      class: "Water-soluble B vitamin; NAD/NADP precursor",
      description: "Niacin is vitamin B3, a precursor that builds NAD and NADP coenzymes for redox metabolism, DNA repair, and energy-transfer reactions. Deficiency causes pellagra with dermatitis, diarrhea, dementia, and possible death; pharmacologic lipid doses can cause flushing, hepatotoxicity, hyperglycemia, and hyperuricemia.",
      mechanism: "Niacin is converted into nicotinamide adenine dinucleotide and NADP, central electron carriers in oxidation-reduction pathways. High lipid-dose nicotinic acid reduces hepatic VLDL synthesis and changes HDL catabolism but is limited by toxicity.",
      tags: ["first-sentence-power-line-2026-07-11", "niacin", "vitamin B3"]
    },
    {
      name: "Riboflavin vitamin B2",
      generic: "riboflavin",
      displayName: "Riboflavin vitamin B2",
      aliases: ["vitamin B2"],
      class: "Water-soluble B vitamin; FAD/FMN coenzyme precursor",
      description: "Riboflavin is vitamin B2, a precursor that forms FAD and FMN coenzymes for mitochondrial oxidation-reduction reactions and energy metabolism. Deficiency affects high-turnover tissues, causing cheilosis/angular stomatitis, glossitis, seborrheic dermatitis, anemia/neuropathy patterns, and bright yellow urine teaching.",
      mechanism: "Riboflavin is phosphorylated into FMN and FAD, flavin coenzymes that shuttle electrons in dehydrogenase reactions, fatty-acid oxidation, and mitochondrial energy pathways.",
      tags: ["first-sentence-power-line-2026-07-11", "riboflavin", "vitamin B2"]
    },
    {
      name: "Thiamine vitamin B1",
      generic: "thiamine",
      displayName: "Thiamine vitamin B1",
      aliases: ["vitamin B1"],
      class: "Water-soluble B vitamin; thiamine pyrophosphate coenzyme precursor",
      description: "Thiamine is vitamin B1, a precursor that forms thiamine pyrophosphate for carbohydrate metabolism, pyruvate dehydrogenase activity, and neuronal energy production. Deficiency can cause Wernicke encephalopathy, Korsakoff syndrome, dry/wet beriberi, neuropathy, and high-output heart failure patterns.",
      mechanism: "Thiamine pyrophosphate is required for pyruvate dehydrogenase, alpha-ketoglutarate dehydrogenase, branched-chain ketoacid dehydrogenase, and transketolase. Give thiamine before glucose in high-risk malnutrition/alcohol-use contexts to avoid worsening neurologic injury.",
      tags: ["first-sentence-power-line-2026-07-11", "thiamine", "vitamin B1"]
    },
    {
      name: "Vitamin C ascorbic acid",
      generic: "vitamin c",
      displayName: "Vitamin C ascorbic acid",
      aliases: ["ascorbic acid"],
      class: "Water-soluble antioxidant vitamin; collagen-hydroxylation cofactor",
      description: "Vitamin C is ascorbic acid, a water-soluble antioxidant that donates electrons and supports collagen hydroxylation for vessel, gum, skin, bone, and wound integrity. Deficiency causes scurvy with bleeding gums, petechiae, bruising, poor wound healing, corkscrew hairs, fatigue, and bone pain.",
      mechanism: "Ascorbate keeps prolyl and lysyl hydroxylase iron in a reduced state so collagen triple helices stabilize properly; it also improves nonheme iron absorption and participates in antioxidant recycling.",
      tags: ["first-sentence-power-line-2026-07-11", "vitamin C", "ascorbic acid", "collagen"]
    },
    {
      name: "Vitamin E",
      generic: "vitamin e",
      displayName: "Vitamin E",
      class: "Fat-soluble antioxidant vitamin; tocopherol family",
      description: "Vitamin E is a fat-soluble antioxidant vitamin whose alpha-tocopherol form interrupts free-radical chain reactions in lipid membranes. Deficiency can cause hemolytic anemia, neuropathy, ataxia, and retinopathy, while high-dose supplementation can increase bleeding risk.",
      mechanism: "Vitamin E donates electrons to lipid peroxyl radicals, protecting polyunsaturated membrane lipids from propagation of oxidative injury. Bleeding risk matters when combined with anticoagulants or vitamin K-related problems.",
      tags: ["first-sentence-power-line-2026-07-11", "vitamin E", "tocopherol"]
    }
  );

  pathologyUpdates.push(
    {
      name: "ARDS",
      aliases: ["acute respiratory distress syndrome"],
      definition: "ARDS is acute hypoxemic respiratory failure from diffuse alveolar-capillary injury that floods/collapses alveoli, lowers lung compliance, and creates shunt-like oxygen failure not explained by primary cardiogenic edema. The key mental picture is stiff, leaky lungs with refractory hypoxemia after sepsis, pneumonia, aspiration, trauma, pancreatitis, transfusion, or inhalation injury.",
      pathology: "Inflammation injures the alveolar-capillary membrane, protein-rich fluid enters alveoli, surfactant function worsens, atelectasis spreads, and oxygen cannot reach perfused blood effectively. Nursing priorities are oxygenation trend, ventilator synchrony, PEEP/proning safety, hemodynamics, skin/eye protection, sedation needs, and treating the trigger.",
      tags: ["first-sentence-power-line-2026-07-11", "ARDS", "refractory hypoxemia", "low compliance"]
    },
    {
      name: "H. pylori infection",
      aliases: ["Helicobacter pylori infection", "H. pylori disease"],
      definition: "H. pylori infection is gastric colonization by urease-producing Helicobacter pylori bacteria that weaken mucosal defenses and drive chronic gastritis, peptic ulcer disease, and gastric cancer risk. Urease generates ammonia to buffer stomach acid, allowing the organism to survive near gastric epithelium.",
      pathology: "Inflammation damages mucosal protection and can increase acid-related injury, especially in duodenal ulcer patterns. Treatment uses combination eradication therapy and adherence matters because partial treatment promotes persistence/resistance.",
      tags: ["first-sentence-power-line-2026-07-11", "H pylori", "ulcer", "gastritis"]
    },
    {
      name: "Tuberculosis",
      aliases: ["TB", "Mycobacterium tuberculosis infection"],
      definition: "Tuberculosis is infection with Mycobacterium tuberculosis, an airborne acid-fast bacillus that survives inside macrophages and can form granulomas, latent infection, or active pulmonary/extrapulmonary disease. Classic active pulmonary clues include chronic cough, hemoptysis, fever, night sweats, weight loss, upper-lobe/cavitary disease, and transmission risk.",
      pathology: "Cell-mediated immunity walls off organisms in granulomas, but immunosuppression, malnutrition, HIV, diabetes, or close exposure can allow reactivation or progressive disease. Airborne isolation, sputum testing, public-health reporting, and RIPE-style multidrug therapy concepts are high-yield.",
      tags: ["first-sentence-power-line-2026-07-11", "tuberculosis", "TB", "airborne"]
    },
    {
      name: "Melanoma",
      definition: "Melanoma is malignant transformation of melanocytes that can invade early and metastasize aggressively through lymphatic or blood routes. ABCDE warning signs, ugly-duckling lesions, new/changing pigmented lesions, bleeding, ulceration, or nodularity should trigger urgent skin evaluation.",
      pathology: "UV exposure, fair skin, family history, many atypical nevi, immunosuppression, and prior melanoma raise risk. Breslow depth, ulceration, nodal spread, and metastasis drive prognosis and treatment intensity.",
      tags: ["first-sentence-power-line-2026-07-11", "melanoma", "skin cancer"]
    },
    {
      name: "Hypoxia",
      definition: "Hypoxia is inadequate oxygen availability at the tissue or cellular level, which can occur from low arterial oxygen, anemia, poor perfusion, impaired unloading, or cellular toxin blockade. It is broader than hypoxemia: pulse oximetry can look acceptable while tissues still fail to receive or use oxygen.",
      pathology: "Clues include restlessness, confusion, dyspnea, tachycardia, cyanosis, chest pain, low urine output, lactate rise, or organ dysfunction depending on cause. Treat the oxygen-delivery problem, not just the saturation number.",
      tags: ["first-sentence-power-line-2026-07-11", "hypoxia", "oxygen delivery"]
    },
    {
      name: "Thyroid cancer",
      definition: "Thyroid cancer is malignant growth of thyroid follicular or parafollicular C cells, often presenting as a thyroid nodule, cervical lymph node, hoarseness, dysphagia, or incidental ultrasound finding. Papillary cancer is most common; medullary disease links to calcitonin/C-cell biology and MEN syndromes.",
      pathology: "Risk and management depend on histology, size, invasion, nodes/metastasis, radiation history, family syndromes, and ultrasound/FNA findings. Rapidly enlarging hard nodules or compressive symptoms deserve urgent evaluation.",
      tags: ["first-sentence-power-line-2026-07-11", "thyroid cancer", "oncology"]
    },
    {
      name: "Esophageal cancer",
      definition: "Esophageal cancer is malignant growth of esophageal squamous or glandular tissue that can obstruct swallowing and invade mediastinal structures before detection. Progressive dysphagia from solids to liquids, weight loss, odynophagia, anemia, hoarseness, or aspiration symptoms are high-yield clues.",
      pathology: "Squamous cancer links with tobacco, alcohol, caustic injury, and achalasia; adenocarcinoma links with Barrett esophagus, chronic GERD, obesity, and distal esophageal disease. Nutrition, aspiration risk, staging, and treatment tolerance dominate nursing care.",
      tags: ["first-sentence-power-line-2026-07-11", "esophageal cancer", "dysphagia"]
    },
    {
      name: "Human papillomavirus infection",
      aliases: ["HPV infection"],
      definition: "Human papillomavirus infection is a common epithelial DNA-virus STI in which low-risk types cause anogenital warts and high-risk types can drive cervical, anal, penile, vulvar, vaginal, and oropharyngeal cancers. Persistent high-risk infection matters more than one transient exposure.",
      pathology: "HPV infects basal epithelial cells through microabrasions; oncogenic E6/E7 proteins can disrupt p53/Rb tumor-suppressor pathways. Vaccination, cervical screening, follow-up of abnormal results, and partner/condom counseling are core teaching points.",
      tags: ["first-sentence-power-line-2026-07-11", "HPV", "STI", "cancer"]
    },
    {
      name: "Cholelithiasis",
      definition: "Cholelithiasis is gallstone disease in the gallbladder, where cholesterol or pigment stones can stay silent or obstruct bile flow and trigger biliary colic, cholecystitis, choledocholithiasis, or pancreatitis. The key distinction is uncomplicated stones versus obstruction/inflammation.",
      pathology: "Stones form when bile becomes supersaturated or gallbladder emptying is impaired. Right upper quadrant pain after fatty meals, nausea, fever, jaundice, Murphy sign, abnormal LFTs, or pancreatitis clues change urgency.",
      tags: ["first-sentence-power-line-2026-07-11", "cholelithiasis", "gallstones", "biliary colic"]
    },
    {
      name: "HIV/AIDS",
      aliases: ["human immunodeficiency virus", "acquired immunodeficiency syndrome"],
      definition: "HIV/AIDS is progressive immune injury from human immunodeficiency virus infecting CD4 T lymphocytes, with AIDS representing advanced immunosuppression or AIDS-defining opportunistic disease. The first-read frame is viral replication, CD4 decline, opportunistic infection/cancer risk, and antiretroviral adherence.",
      pathology: "HIV uses CD4 plus CCR5 or CXCR4 coreceptors to enter immune cells, then reverse transcriptase converts viral RNA into DNA that integrates into the host genome. ART suppresses replication so CD4 recovery and viral load control can prevent AIDS progression.",
      tags: ["first-sentence-power-line-2026-07-11", "HIV", "AIDS", "CD4", "antiretroviral"]
    }
  );

  pharmUpdates.forEach((entry) => upsert(pharm.drugs, entry));
  pathologyUpdates.forEach((entry) => upsert(pathology.diseases, entry));
  collapseDuplicateEntries(pharm.drugs);
  collapseDuplicateEntries(pathology.diseases);
  applyAuthoritativeArrayFields(pharm.drugs, pharmUpdates);
  applyAuthoritativeArrayFields(pathology.diseases, pathologyUpdates);
  finalPharmSourceCleanup();

  window.ANI_PHARM_DATABASE = pharm;
  window.ANI_PATHOLOGY_DATABASE = pathology;
}());
