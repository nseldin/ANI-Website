/* eslint-disable */
/* Cross-frontier causal explanations for high-curiosity pharmacy statements. */
(function () {
  window.ANI_PHARM_DATABASE = window.ANI_PHARM_DATABASE || {};
  const db = window.ANI_PHARM_DATABASE;
  db.drugs = Array.isArray(db.drugs) ? db.drugs : [];

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const updates = new Map(Object.entries({
    "teplizumab": {
      description: "Why do vaccine restrictions extend far beyond the 14-day infusion course? Teplizumab changes T-cell activation and commonly causes transient lymphopenia, so it can weaken vaccine response; live-vaccine safety after treatment has not been established. Therefore current labeling separates vaccine types and uses conservative windows: complete age-appropriate vaccination first, avoid inactivated or mRNA vaccines during the specified shorter interval, and avoid live vaccines from eight weeks before treatment through up to 52 weeks afterward. The long window is an immune-safety rule, not evidence that every patient remains profoundly lymphopenic for a year."
    },
    "carfilzomib": {
      mechanism: "Irreversible beta-5 proteasome blockade makes ubiquitinated and misfolded proteins accumulate, thereby activating the unfolded-protein response, oxidative stress, and apoptosis in plasma cells that already produce large immunoglobulin loads. The same irreversible stress can injure endothelium and strain cardiac, renal, and pulmonary reserve, which explains why dyspnea, rapid weight gain, hypertension, chest symptoms, or creatinine rise requires immediate assessment rather than routine hydration. Because both underhydration and fluid overload can be dangerous, volume support must follow the regimen and the patient's current hemodynamics."
    },
    "venetoclax": {
      mechanism: "BCL-2 blockade frees BH3-only proteins such as BIM, which activate BAX/BAK and create mitochondrial outer-membrane pores. Cytochrome c then activates caspases, leading to rapid programmed cell death. Because a large sensitive tumor burden can die within hours, intracellular potassium, phosphate, and nucleic acids enter blood faster than the kidneys can clear them; therefore ramp-up dosing, hydration, urate control, interaction review, and timed chemistry checks are direct consequences of the mechanism rather than administrative extras."
    },
    "tranexamic acid": {
      description: "Why does the IV dental label say short term? Its 2-to-8-day course is indication-specific: it spans the high-fibrinolysis period around tooth extraction in hemophilia and was not written as a universal duration for trauma, postpartum hemorrhage, surgery, or heavy menstrual bleeding. Extending therapy without reassessing the bleeding source can preserve pathologic clot as well as hemostatic clot, while renal accumulation raises exposure and seizure risk. Therefore each formulation and indication needs its own evidence-based dose, start time, stop point, renal adjustment, and thrombosis review rather than an automatic refill."
    },
    "edaravone": {
      mechanism: "Edaravone can donate electrons to reactive radical species and thereby interrupt lipid-peroxidation chain reactions in experimental membranes. Oxidative stress participates in motor-neuron injury, but ALS has multiple interacting mechanisms and the exact target that produces clinical benefit is unknown. Because antioxidant chemistry is plausible rather than a proven complete disease pathway, the card must not claim that edaravone removes the cause of ALS; it modestly changes functional decline in selected treatment contexts while respiratory, nutritional, mobility, and communication care remain essential."
    },
    "lefamulin": {
      mechanism: "Binding in the 50S peptidyl-transferase center prevents correct A- and P-site tRNA positioning, thereby blocking peptide-bond formation and bacterial protein synthesis. Because lefamulin is both affected by and can affect CYP3A pathways, interacting drugs can raise toxicity or lower antimicrobial exposure depending on route. QT risk rises when exposure, bradycardia, low potassium/magnesium, congenital long-QT physiology, or other QT drugs converge. Oral fasting instructions matter because food substantially lowers exposure, which can turn an apparently correct dose into inadequate pneumonia treatment."
    },
    "prucalopride": {
      mechanism: "Selective 5-HT4 activation on enteric neurons increases acetylcholine release, which coordinates high-amplitude propagating contractions from proximal colon toward rectum and thereby improves transit. It does not draw water into stool, so labeling it an osmotic laxative would hide its true prokinetic action. Because stronger propulsion against a mechanical obstruction can worsen pain, distention, vomiting, or perforation risk, obstruction must be excluded. New depression or suicidal thinking requires prompt reassessment even though the mechanism linking that warning to 5-HT4 selectivity is not established."
    },
    "inclisiran": {
      mechanism: "The GalNAc ligand concentrates inclisiran in hepatocytes through asialoglycoprotein-receptor uptake. Its guide strand remains in the RNA-induced silencing complex and can direct repeated PCSK9-mRNA cleavage, so hepatic PCSK9 production stays suppressed long after plasma drug falls. Less PCSK9 allows more LDL receptors to recycle, thereby increasing LDL clearance. This intracellular catalytic recycling explains the day-1, month-3, then six-month schedule; the interval is a pharmacodynamic consequence, not evidence that LDL no longer needs follow-up or that missed injections are harmless."
    },
    "fenoldopam": {
      description: "Why is fenoldopam short-term and limited to an in-hospital infusion of up to 48 hours? It is a rapidly titratable bridge for severe hypertension, not a chronic outpatient blood-pressure regimen. Its minutes-long half-life makes pressure effects quickly reversible when the infusion is changed, but continued exposure can sustain hypotension, reflex tachycardia, hypokalemia, and increased intraocular pressure. Therefore continuous blood-pressure and perfusion assessment plus transition to a durable oral plan are part of the treatment; exceeding 48 hours is outside the studied label rather than a calendar point at which one new toxicity suddenly begins."
    },
    "patisiran": {
      mechanism: "The lipid nanoparticle enters hepatocytes and releases siRNA, which loads into RISC and directs repeated cleavage of both mutant and wild-type TTR mRNA. Less hepatic TTR means less amyloid precursor, thereby slowing additional deposition rather than removing all existing nerve injury. TTR normally transports retinol-binding protein, so lowering TTR reduces circulating vitamin A and explains supplementation plus symptom-based eye assessment. Lipid-nanoparticle exposure can activate infusion-reaction pathways, which is why corticosteroid, antihistamine, and acetaminophen premedication and monitored infusion are required."
    },
    "mirvetuximab soravtansine": {
      mechanism: "Folate-receptor-alpha binding promotes internalization, after which lysosomal processing releases DM4. DM4 inhibits tubulin dynamics, thereby causing mitotic arrest and death in receptor-expressing tumor cells. Ocular toxicity can progress from dry-eye symptoms to keratopathy and impaired acuity, while its precise tissue mechanism is not fully established; therefore baseline and scheduled slit-lamp examinations, prophylactic drops, and symptom-triggered dose decisions are part of safe drug delivery rather than optional comfort care. D5W-only dilution matters because normal saline is incompatible with the product."
    },
    "enfortumab vedotin": {
      mechanism: "After Nectin-4 binding and internalization, proteases release MMAE, which blocks tubulin polymerization and thereby produces G2/M arrest and apoptosis. Nectin-4 is also expressed in normal skin, helping explain why painful rash, blistering, mucosal lesions, or epidermal detachment can signal mechanism-linked severe cutaneous toxicity rather than a minor infusion reaction. MMAE-related microtubule injury contributes to cumulative peripheral neuropathy. Because hyperglycemia and pneumonitis can become rapidly life-threatening even though their exact mechanisms are less certain, glucose, respiratory symptoms, skin, eyes, and neurologic function all require active surveillance."
    },
    "axicabtagene ciloleucel": {
      mechanism: "The engineered receptor binds CD19 without MHC presentation, then CD28 and CD3-zeta signaling activates and expands the infused T cells, producing perforin/granzyme and cytokine-mediated killing. Rapid immune expansion releases IL-6 and other mediators, leading to cytokine-release syndrome; neuroinflammation and endothelial dysfunction contribute to ICANS. Because normal B cells also express CD19, successful target engagement can cause B-cell aplasia, hypogammaglobulinemia, and infection risk. CD19 targeting therefore links antitumor benefit directly to loss of normal B cells. These same causal links explain REMS-level monitoring, immediate access to rescue treatment, prolonged cytopenia surveillance, and lifelong follow-up for secondary malignancy."
    },
    "tacrolimus topical": {
      description: "Why is topical tacrolimus labeled for short-term and non-continuous chronic use? The ointment suppresses local T-cell signaling without steroid skin atrophy, but continuous long-term safety has not been established and rare malignancy reports prompted a boxed warning even though a causal relationship is unproven. Therefore use is limited to involved skin, stopped when signs clear, and restarted for flares under the plan rather than applied indefinitely as moisturizer. Persistent disease, lymphadenopathy, infection, or failure to improve requires diagnostic reassessment instead of simply extending exposure."
    },
    "ruxolitinib topical": {
      description: "Why is ruxolitinib cream short-term or non-continuous and restricted by body-surface area and weekly quantity? JAK1/JAK2 inhibition is intended to stay predominantly local, but systemic exposure rises as treated area, amount, frequency, barrier disruption, or occlusion increases. Therefore the label limits application and requires reassessment instead of indefinite whole-body use, while infection, blood-count, malignancy, cardiovascular, and thrombosis risks remain clinically relevant. The boxed warning reflects serious events seen with systemic JAK inhibition; it does not mean every topical user has the same exposure, but it makes dose-area discipline meaningful."
    }
  }));

  let updatedCount = 0;
  db.drugs = db.drugs.map((card) => {
    const key = normalize(card && (card.generic || card.name || card.displayName));
    const update = updates.get(key);
    if (!update) return card;
    updatedCount += 1;
    return {
      ...card,
      description: [card.description, update.description].filter(Boolean).join(" "),
      mechanism: [card.mechanism, update.mechanism].filter(Boolean).join(" "),
      tags: Array.from(new Set([...(card.tags || []), "systemic why closure", "causal explanation"])),
      whyClosureRevision: "2026-07-14"
    };
  });

  db.pharmWhyClosureSystemicPatch = {
    version: "2026-07-14-duration-and-causal-closure",
    requestedUpdateCount: updates.size,
    updatedCardCount: updatedCount
  };
  db.version = [db.version, "pharm-why-closure-systemic"].filter(Boolean).join("+");
}());
