/* eslint-disable */
/* Wave 44: standalone ingredient cards for visible multi-ingredient pharmacy owners. */
(function () {
  "use strict";

  const database = window.ANI_PHARM_DATABASE;
  if (!database || !Array.isArray(database.drugs)) return;

  const VERSION = "2026-07-22-wave44-pharmacy-component-parity-1";
  const GENERATED_AT = "2026-07-22";
  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const unique = (values) => Array.from(new Map((values || []).filter(Boolean).map((value) => [normalize(value), value])).values());
  const title = (entry) => String(entry && (entry.name || entry.generic || entry.displayName) || "").trim();

  const sourceRefs = Object.freeze({
    "w44-dailymed-ca-dtpa": {
      label: "DailyMed pentetate calcium trisodium prescribing information",
      url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=6052c707-a8a3-43a7-80c2-7ad1ad9391a4"
    },
    "w44-dailymed-zn-dtpa": {
      label: "DailyMed pentetate zinc trisodium prescribing information",
      url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=366e7ca9-4fd3-4688-bd83-1f369885e0fc"
    },
    "w44-cdc-dtpa-2025": {
      label: "CDC treatment of internal radiation contamination with DTPA, reviewed 2025",
      url: "https://www.cdc.gov/radiation-emergencies/treatment/dtpa.html"
    },
    "w44-fda-dtpa-qa": {
      label: "FDA questions and answers on calcium-DTPA and zinc-DTPA",
      url: "https://www.fda.gov/drugs/bioterrorism-and-drug-preparedness/questions-and-answers-calcium-dtpa-and-zinc-dtpa-updated"
    },
    "w44-fda-inmazeb-2024": {
      label: "FDA INMAZEB prescribing information, 2024",
      url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/761169s011lbl.pdf"
    },
    "w44-dailymed-nithiodote-2025": {
      label: "DailyMed NITHIODOTE prescribing information, updated 2025",
      url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=ff4941b3-9901-4aab-adcf-c5327bede34e"
    },
    "w44-dailymed-ammonul": {
      label: "DailyMed AMMONUL prescribing information",
      url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d564f2b1-9fc7-4201-8066-d745ac3a671f"
    },
    "w44-genereviews-ucd-2025": {
      label: "GeneReviews urea cycle disorders overview, updated 2025",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK1217/"
    }
  });
  Object.entries(sourceRefs).forEach(([key, reference]) => {
    if (!reference.label || !/^https:\/\//i.test(reference.url || "")) throw new Error("Invalid Wave44 pharmacy source: " + key);
  });
  const sourceReferenceMap = new Map((Array.isArray(database.sourceReferences) ? database.sourceReferences : [])
    .map((reference) => [reference && reference.key, reference]).filter(([key]) => key));
  Object.entries(sourceRefs).forEach(([key, reference]) => sourceReferenceMap.set(key, { key, ...reference }));
  database.sourceReferences = Array.from(sourceReferenceMap.values());
  const sourceNoteFor = (keys) => unique(keys).map((key) => {
    const reference = sourceReferenceMap.get(key);
    return reference ? `${reference.label} (${reference.url})` : "";
  }).filter(Boolean).join("; ");

  const medication = (spec) => {
    // A component owns its evidence. Do not silently inherit a combination
    // parent's references because that can import claims that apply only to
    // the complete marketed product.
    const sourceKeys = unique(spec.sourceKeys || []);
    sourceKeys.forEach((key) => {
      if (!sourceReferenceMap.has(key)) throw new Error(`Unknown source ${key} for Wave44 pharmacy component ${spec.name}`);
    });
    return {
      name: spec.name,
      displayName: spec.name,
      generic: normalize(spec.name),
      aliases: unique(spec.aliases || []),
      brandExamples: unique(spec.brandExamples || []),
      class: spec.class,
      classPathway: [spec.class],
      categories: unique(["Toxicology, Antidotes, Reversal Agents", ...(spec.categories || [])]),
      entryType: "drug",
      classCard: false,
      isDrugClassCard: false,
      usedToTreat: spec.usedToTreat,
      description: spec.description || spec.usedToTreat,
      mechanism: spec.mechanism,
      routes: unique(spec.routes || []),
      administrationTiming: unique(spec.administrationTiming || []),
      boxedWarning: spec.boxedWarning || "No FDA boxed warning is assigned to this ingredient as an independently marketed product; warnings from its fixed combination still apply when that product is administered.",
      adverseEffects: unique(spec.adverseEffects || []),
      contraindications: unique(spec.contraindications || []),
      nursingEssentials: unique(spec.nursingEssentials || []),
      interactions: unique(spec.interactions || []),
      keyLabs: unique(spec.keyLabs || []),
      patientTeaching: unique(spec.patientTeaching || []),
      nclexTraps: unique(spec.nclexTraps || []),
      populationRisks: spec.populationRisks || [],
      relatedTopics: unique([spec.parent, ...(spec.relatedTopics || [])]),
      sourceKeys,
      sourceNote: sourceNoteFor(sourceKeys),
      evidenceLastReviewed: GENERATED_AT,
      componentParent: spec.parent,
      componentParityWave44: true,
      standaloneCombinationComponent: true,
      combinationProduct: false,
      hidden: false,
      studentFacing: true,
      nclexEssential: true,
      confidenceTier: "Curated full study card",
      tags: unique(["wave44", "standalone ingredient", "combination component parity", ...(spec.tags || [])])
    };
  };

  const calciumDtpaParent = "Calcium DTPA and zinc DTPA";
  const inmazebParent = "INMAZEB (atoltivimab, maftivimab, and odesivimab-ebgn)";
  const cyanideParent = "Sodium nitrite and sodium thiosulfate";
  const ammoniaParent = "Sodium phenylacetate and sodium benzoate";

  const cards = [
    medication({
      name: "Pentetate calcium trisodium",
      parent: calciumDtpaParent,
      aliases: ["calcium DTPA", "Ca-DTPA", "calcium diethylenetriaminepentaacetate"],
      brandExamples: ["Pentetate calcium trisodium injection"],
      class: "Decorporation chelator; medical countermeasure",
      sourceKeys: ["w44-dailymed-ca-dtpa", "w44-cdc-dtpa-2025", "w44-fda-dtpa-qa"],
      usedToTreat: "Internal contamination with plutonium, americium, or curium under specialist radiation-emergency guidance. It is not a general heavy-metal chelator and is not interchangeable with zinc DTPA for every treatment day.",
      mechanism: "Calcium DTPA exchanges its calcium for selected transuranic metals in blood and extracellular fluid. The resulting stable, water-soluble complexes are excreted mainly in urine, reducing retained radioactive material. It is most useful soon after contamination but can also remove essential endogenous metals, which explains why zinc DTPA is generally favored when repeated therapy continues after the initial treatment period.",
      routes: ["Intravenous", "Nebulized inhalation in selected inhalational contamination protocols"],
      administrationTiming: ["Begin promptly after confirmed or strongly suspected eligible internal contamination without delaying lifesaving decontamination and supportive care.", "Specialist assessment determines whether subsequent doses transition to zinc DTPA."],
      boxedWarning: "The cited Ca-DTPA label does not carry a boxed warning. Major precautions are loss of essential trace metals, respiratory difficulty with nebulization, fetal risk from repeated mineral depletion, and radionuclide-specific use under specialist oversight.",
      adverseEffects: ["Depletion of zinc and other essential trace metals", "Nausea, chills, headache, injection reactions", "Cough or bronchospasm with inhaled administration"],
      contraindications: ["Do not use as a substitute for external decontamination or for radionuclides it does not chelate effectively.", "Use inhalation cautiously or avoid it in patients with significant airway reactivity unless the emergency specialist determines benefit outweighs risk."],
      nursingEssentials: ["Contact radiation-emergency experts and poison/public-health resources; identify radionuclide, route, time, and contamination burden.", "Collect ordered urine bioassay and trend blood count, renal function, electrolytes and trace elements during repeated treatment.", "Prevent staff contamination with appropriate decontamination and radiation-safety procedures."],
      interactions: ["Mineral supplements and other chelators require specialist coordination because the treatment alters metal balance."],
      keyLabs: ["Urine radioactivity/bioassay", "Renal function", "CBC", "Electrolytes and zinc/trace elements during prolonged therapy"],
      patientTeaching: ["The medicine removes selected radioactive metals from inside the body; it does not remove external contamination or make all radiation exposure harmless."],
      nclexTraps: ["Calcium DTPA and zinc DTPA are distinct agents with different repeated-use considerations.", "Chelation is radionuclide-specific, not universal."],
      populationRisks: [{ type: "pregnancy", label: "Pregnancy specialist decision", note: "Zinc DTPA is generally preferred when treatment is needed during pregnancy, but major eligible contamination may justify calcium DTPA under radiation-emergency expertise." }],
      relatedTopics: ["Pentetate zinc trisodium", "Radiation contamination", "Chelation therapy"]
    }),
    medication({
      name: "Pentetate zinc trisodium",
      parent: calciumDtpaParent,
      aliases: ["zinc DTPA", "Zn-DTPA", "zinc diethylenetriaminepentaacetate"],
      brandExamples: ["Pentetate zinc trisodium injection"],
      class: "Decorporation chelator; medical countermeasure",
      sourceKeys: ["w44-dailymed-zn-dtpa", "w44-cdc-dtpa-2025", "w44-fda-dtpa-qa"],
      usedToTreat: "Internal contamination with plutonium, americium, or curium, especially when ongoing decorporation treatment is needed after initial management. Use is directed by radiation-emergency specialists.",
      mechanism: "Zinc DTPA exchanges its zinc for eligible transuranic metals and forms complexes excreted mainly in urine. Because it already contains zinc, it depletes essential trace metals less than calcium DTPA and is generally better suited to repeated treatment.",
      routes: ["Intravenous", "Nebulized inhalation in selected protocols"],
      administrationTiming: ["Use on the specialist-directed schedule after contamination assessment; it may follow an initial calcium DTPA dose or be selected from the outset for specific populations."],
      boxedWarning: "BOXED WARNING: nebulized Zn-DTPA may exacerbate asthma, and treatment can deplete trace metals, especially over months. Monitor zinc, renal function, electrolytes, urinalysis, and blood counts during prolonged Ca-DTPA or Zn-DTPA therapy.",
      adverseEffects: ["Nausea, chills, headache, injection reactions", "Cough or bronchospasm with inhaled delivery", "Trace-metal imbalance remains possible during prolonged therapy"],
      contraindications: ["Do not use for external contamination alone or for radionuclides outside its effective spectrum.", "Do not assume the nebulized route is safe in severe reactive-airway disease without specialist assessment."],
      nursingEssentials: ["Coordinate radiation-safety, public-health, and toxicology expertise.", "Trend ordered urine bioassay and renal, hematologic, electrolyte, and trace-element measures.", "Document contamination route and timing and maintain decontamination precautions."],
      interactions: ["Other chelators and mineral replacement require coordination with the decorporation plan."],
      keyLabs: ["Urine radioactivity/bioassay", "Renal function", "CBC", "Electrolytes and trace elements"],
      patientTeaching: ["Repeated urine testing helps show whether eligible radioactive metal is still being removed and whether therapy should continue."],
      nclexTraps: ["Zinc DTPA is a separate medication, not merely the same name for calcium DTPA.", "It does not treat every radionuclide exposure."],
      populationRisks: [{ type: "pregnancy", label: "Pregnancy preferred component when indicated", note: "When decorporation therapy is indicated during pregnancy, zinc DTPA is generally preferred because it causes less essential-metal depletion; specialist oversight remains mandatory." }],
      relatedTopics: ["Pentetate calcium trisodium", "Radiation contamination", "Chelation therapy"]
    }),
    ...[
      {
        name: "Atoltivimab",
        aliases: ["REGN3470"],
        mechanism: "Atoltivimab binds one epitope on the Zaire ebolavirus glycoprotein and has both virus-neutralizing activity and Fc-gamma-receptor IIIa signaling activity. That combination can interfere with infection while also recruiting antibody-dependent immune effector activity against glycoprotein-bearing targets. Its studied clinical role is inside the complete three-antibody INMAZEB product."
      },
      {
        name: "Maftivimab",
        aliases: ["REGN3471"],
        mechanism: "Maftivimab is the directly neutralizing INMAZEB component identified in the FDA label: it binds a distinct glycoprotein epitope and blocks viral entry into susceptible cells. It is co-formulated with two antibodies that add nonoverlapping binding and complementary effector activity; maftivimab alone is not the labeled treatment regimen."
      },
      {
        name: "Odesivimab-ebgn",
        aliases: ["odesivimab", "REGN3479"],
        mechanism: "Odesivimab is a non-neutralizing INMAZEB component that binds a third glycoprotein epitope, including soluble glycoprotein, and induces Fc-gamma-receptor IIIa-mediated antibody effector signaling when target-bound. Its contribution is complementary immune clearance rather than independent viral-entry blockade, and it is not an approved monotherapy."
      }
    ].map((spec) => medication({
      name: spec.name,
      parent: inmazebParent,
      aliases: spec.aliases,
      brandExamples: ["INMAZEB component"],
      class: "Ebola virus glycoprotein-directed monoclonal antibody component",
      sourceKeys: ["w44-fda-inmazeb-2024"],
      usedToTreat: `${spec.name} is one of three noncompeting antibodies supplied together in INMAZEB for infection caused by Zaire ebolavirus (Orthoebolavirus zairense). It is not an independently established monotherapy and must not inherit a stand-alone dosing regimen from the combination indication.`,
      description: `${spec.name} has its own pharmacologic identity, binding role, and searchable card, but the FDA-approved medicine is the fixed 1:1:1 INMAZEB combination of atoltivimab, maftivimab, and odesivimab-ebgn. The label gives 50 mg/kg of each antibody as one IV infusion; that is combination dosing, not evidence for giving this component alone.`,
      mechanism: spec.mechanism,
      routes: ["Intravenous as the fixed INMAZEB combination"],
      administrationTiming: ["Administer the complete weight-based combination under the current product protocol and high-level infection-control procedures."],
      boxedWarning: "INMAZEB has no FDA boxed warning. The product can cause hypersensitivity and infusion-associated events; no individual component has a separately approved monotherapy label or dosing regimen.",
      adverseEffects: ["Infusion-associated fever, chills, tachycardia, tachypnea, hypotension, vomiting, or rash", "Hypersensitivity reactions"],
      contraindications: ["Do not administer this component alone as though it had an independent validated Ebola regimen.", "Do not delay full Ebola supportive care, fluid/electrolyte management, hemodynamic support, and public-health isolation while arranging the antibody product."],
      nursingEssentials: ["Verify that all three components and the full calculated dose are prepared under the combination label.", "Monitor closely during and after infusion for hypersensitivity or worsening hemodynamics.", "Maintain Ebola isolation, exposure control, specimen precautions, and public-health coordination."],
      interactions: ["Live-virus vaccine timing and other investigational Ebola therapies require specialist protocol review."],
      keyLabs: ["Hemodynamics and oxygenation", "CBC, electrolytes, renal and liver function", "Ebola diagnostic and virologic monitoring under protocol"],
      patientTeaching: ["This antibody is one part of a three-antibody medicine; receiving one component alone is not equivalent to receiving INMAZEB."],
      nclexTraps: ["The component has its own searchable identity, but the approved treatment is the complete combination.", "Antibody therapy does not replace isolation or aggressive supportive care."],
      populationRisks: [{ type: "pediatric", label: "Pediatric/neonatal protocol", note: "Use the current combination label's weight-based instructions, including specialized neonatal and pediatric preparation." }, { type: "pregnancy", label: "Pregnancy life-threatening infection", note: "Zaire ebolavirus is life-threatening; maternal-fetal decisions require infectious-disease, obstetric, and product-label guidance." }],
      relatedTopics: ["Ebola virus disease", "Monoclonal antibodies", "Infusion reaction"]
    })),
    medication({
      name: "Sodium nitrite",
      parent: cyanideParent,
      aliases: ["sodium nitrite injection", "nitrite cyanide antidote"],
      brandExamples: ["Nithiodote component"],
      class: "Methemoglobin-forming cyanide antidote component",
      sourceKeys: ["w44-dailymed-nithiodote-2025"],
      usedToTreat: "Selected severe or strongly suspected cyanide poisoning as part of a protocol that commonly pairs sodium nitrite with sodium thiosulfate. It is not routine therapy for nonspecific smoke exposure and differs from hydroxocobalamin.",
      mechanism: "Sodium nitrite oxidizes some ferrous hemoglobin to ferric methemoglobin, which binds cyanide and draws it away from cytochrome oxidase. Sodium thiosulfate then supplies sulfur for conversion to thiocyanate. The same methemoglobin formation and vasodilation can reduce oxygen delivery, explaining the major safety tradeoff.",
      routes: ["Intravenous"],
      administrationTiming: ["Give only through the emergency cyanide protocol with immediate airway, oxygenation, circulation, and antidote coordination."],
      boxedWarning: "BOXED WARNING: sodium nitrite can cause life-threatening hypotension and methemoglobin formation. Closely monitor perfusion and oxygenation, and weigh the risk especially carefully when smoke inhalation, carbon monoxide exposure, anemia, shock, or hypoxemia already impairs oxygen delivery.",
      adverseEffects: ["Methemoglobinemia", "Hypotension and syncope", "Headache, dizziness, tachycardia, nausea"],
      contraindications: ["Use extreme caution when carbon monoxide exposure, severe anemia, hypoxemia, or shock already compromises oxygen delivery.", "Do not give reflexively when cyanide probability is low and antidote harm may exceed benefit."],
      nursingEssentials: ["Provide high-concentration oxygen and continuous hemodynamic monitoring.", "Assess coexisting carbon monoxide exposure, lactate, acid-base state, neurologic status, hemoglobin, and antidote response.", "Use co-oximetry for methemoglobin; pulse oximetry alone is unreliable."],
      interactions: ["Other methemoglobin-forming or hypotensive agents can increase toxicity."],
      keyLabs: ["Co-oximetry/methemoglobin", "Lactate and blood gas", "Hemoglobin", "Renal function and cyanide-context testing when available"],
      patientTeaching: ["The antidote intentionally changes part of hemoglobin to bind cyanide, so oxygen delivery and blood pressure require close monitoring."],
      nclexTraps: ["Nitrite therapy can worsen oxygen delivery in smoke-inhalation patients with carbon monoxide exposure.", "Do not confuse sodium nitrite with sodium thiosulfate or hydroxocobalamin."],
      populationRisks: [{ type: "pediatric", label: "Weight-based high-alert dosing", note: "Children require exact weight-based dosing and methemoglobin monitoring." }, { type: "pregnancy", label: "Pregnancy emergency risk-benefit", note: "Maternal cyanide poisoning is life-threatening; select antidote through emergency toxicology guidance." }],
      relatedTopics: ["Sodium thiosulfate", "Hydroxocobalamin", "Cyanide poisoning", "Methemoglobinemia"]
    }),
    medication({
      name: "Sodium phenylacetate",
      parent: ammoniaParent,
      aliases: ["phenylacetate", "sodium phenylacetate injection"],
      brandExamples: ["AMMONUL component"],
      class: "Alternative-pathway nitrogen scavenger component",
      sourceKeys: ["w44-dailymed-ammonul", "w44-genereviews-ucd-2025"],
      usedToTreat: "Acute hyperammonemia caused by selected urea-cycle disorders as part of the intravenous sodium phenylacetate/sodium benzoate regimen with calories, arginine when indicated, and dialysis when required. It is not a general treatment for every cause of elevated ammonia.",
      mechanism: "Phenylacetate conjugates with glutamine to form phenylacetylglutamine, which is excreted by the kidneys and carries two nitrogen atoms per molecule. This creates an alternate route for waste nitrogen when the urea cycle cannot clear it.",
      routes: ["Intravenous only as the combination regimen"],
      administrationTiming: ["Begin urgently through the metabolic-emergency protocol while stopping catabolism, providing calories, treating the trigger, and arranging dialysis when ammonia is severe or rising."],
      adverseEffects: ["Large sodium load and fluid or electrolyte disturbance", "Nausea, vomiting, headache, neurologic toxicity", "Infusion-site injury and dosing error risk"],
      contraindications: ["Do not let scavenger infusion delay dialysis for severe, rapidly rising, or neurologically symptomatic hyperammonemia.", "Do not apply a urea-cycle regimen to hepatic encephalopathy or another cause without diagnostic context."],
      nursingEssentials: ["Use an exact current weight/body-surface-area protocol and independent high-alert verification.", "Trend ammonia frequently with neurologic status, glucose, electrolytes, acid-base state, renal function, intake/output, and sodium burden.", "Prevent protein catabolism with prescribed dextrose/lipid and specialty nutrition while the metabolic team directs protein reintroduction."],
      interactions: ["Other high-sodium therapies and drugs competing for renal organic-acid handling require specialist review."],
      keyLabs: ["Serial ammonia", "Electrolytes and blood gas", "Glucose", "Renal and liver function", "Plasma amino acids and urine orotic acid for diagnosis"],
      patientTeaching: ["The medicine removes nitrogen through an alternate urinary product; emergency calories and sometimes dialysis are equally important parts of protecting the brain."],
      nclexTraps: ["A falling ammonia number does not replace repeated neurologic assessment.", "This component is administered in the combined product, not improvised as a separate infusion."],
      populationRisks: [{ type: "pediatric", label: "Pediatric metabolic emergency", note: "Infants and children can deteriorate rapidly and require metabolic-center dosing and early dialysis planning." }, { type: "pregnancy", label: "Pregnancy specialist emergency", note: "Use requires maternal-fetal and metabolic-toxicology risk-benefit guidance." }],
      relatedTopics: ["Sodium benzoate", "Urea-cycle disorder", "Hyperammonemia", "Hemodialysis"]
    }),
    medication({
      name: "Sodium benzoate",
      parent: ammoniaParent,
      aliases: ["benzoate nitrogen scavenger", "sodium benzoate injection"],
      brandExamples: ["AMMONUL component"],
      class: "Alternative-pathway nitrogen scavenger component",
      sourceKeys: ["w44-dailymed-ammonul", "w44-genereviews-ucd-2025"],
      usedToTreat: "Acute hyperammonemia from selected urea-cycle disorders as one component of intravenous sodium phenylacetate/sodium benzoate. Oral sodium benzoate may appear in specialist chronic regimens, but formulation and dosing are not interchangeable.",
      mechanism: "Benzoate conjugates with glycine to form hippurate, which is excreted by the kidneys and removes one nitrogen atom per molecule. This bypasses the blocked urea-cycle pathway and complements phenylacetate's glutamine-scavenging route.",
      routes: ["Intravenous as the combination product", "Oral in selected specialist chronic protocols using an appropriate formulation"],
      administrationTiming: ["In acute crisis, start the full metabolic-emergency regimen promptly and arrange dialysis according to ammonia level, trajectory, symptoms, and protocol."],
      adverseEffects: ["Sodium and fluid load", "Nausea, vomiting, metabolic or electrolyte disturbance", "Infusion-site injury and dosing error"],
      contraindications: ["Do not substitute a food-preservative product or nonmedical formulation.", "Do not delay extracorporeal ammonia clearance when severe neurologic risk or an inadequate response is present."],
      nursingEssentials: ["Verify the complete combination dose independently and use the prescribed central/peripheral administration precautions.", "Trend ammonia and neurologic status frequently and monitor sodium, potassium, acid-base state, glucose, renal function, fluid balance, and nutrition.", "Coordinate genetics/metabolic testing and family emergency planning after stabilization."],
      interactions: ["High-sodium therapies and renally handled organic acids require metabolic-pharmacy review."],
      keyLabs: ["Serial ammonia", "Electrolytes and blood gas", "Glucose", "Renal and liver function", "Diagnostic amino-acid and urine studies"],
      patientTeaching: ["This medicine creates a different urinary route for nitrogen; it does not correct the inherited enzyme defect and must be part of an emergency plan."],
      nclexTraps: ["Sodium benzoate and sodium phenylacetate remove nitrogen through different conjugation partners.", "Hyperammonemia with cerebral edema is a dialysis emergency, not a wait-for-the-next-dose situation."],
      populationRisks: [{ type: "pediatric", label: "Pediatric metabolic emergency", note: "Neonates and children require exact protocol dosing and rapid transfer/consultation with a metabolic center." }, { type: "pregnancy", label: "Pregnancy specialist emergency", note: "Treatment decisions require metabolic and obstetric expertise while prioritizing maternal neurologic safety." }],
      relatedTopics: ["Sodium phenylacetate", "Urea-cycle disorder", "Hyperammonemia", "Cerebral edema"]
    })
  ];

  const application = [];
  cards.forEach((card) => {
    const key = normalize(card.name);
    const prior = database.drugs.filter((entry) => [entry && entry.name, entry && entry.generic, entry && entry.displayName].some((value) => normalize(value) === key));
    database.drugs = database.drugs.filter((entry) => ![entry && entry.name, entry && entry.generic, entry && entry.displayName].some((value) => normalize(value) === key));
    database.drugs.push({ ...card });
    application.push({ name: card.name, parent: card.componentParent, priorMatchCount: prior.length, sourceKeys: card.sourceKeys.slice() });
  });

  database.drugs.sort((left, right) => title(left).localeCompare(title(right)));
  window.ANI_CLINICAL_FRONTIER_WAVE44_PHARMACY_COMPONENT_PARITY = {
    schemaVersion: 1,
    version: VERSION,
    generatedAt: GENERATED_AT,
    cardCount: cards.length,
    cardNames: cards.map((card) => card.name),
    application,
    combinationOwnersPreserved: unique(cards.map((card) => card.componentParent))
  };
}());
