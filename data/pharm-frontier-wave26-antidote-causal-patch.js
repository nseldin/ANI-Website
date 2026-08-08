/* eslint-disable */
/* Wave 26: antidotes, toxicology rescue therapies, antitoxins, and reversal agents. */
(function () {
  "use strict";

  window.ANI_PHARM_DATABASE = window.ANI_PHARM_DATABASE || {};
  const db = window.ANI_PHARM_DATABASE;
  db.drugs = Array.isArray(db.drugs) ? db.drugs : [];

  const VERSION = "2026-07-18-antidote-causal-v2";
  const TOX_CATEGORY = "Toxicology, Antidotes, Reversal Agents";
  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const unique = (values) => Array.from(new Set((values || []).filter(Boolean)));
  const primaryName = (drug) => String(drug && (drug.generic || drug.displayName || drug.name) || "");

  const sourceRefs = Object.freeze({
    "aha-toxicology-2025": { label: "American Heart Association Part 10: Special Circumstances of Resuscitation", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation" },
    "poison-help": { label: "U.S. Poison Help: calling Poison Help", url: "https://poisonhelp.hrsa.gov/faq/calling-poison-help" },
    "acmt-nac-2026": { label: "ACMT 2026 practice statement on duration of intravenous acetylcysteine", url: "https://www.acmt.net/news/acmt-practice-statement-duration-of-intravenous-acetylcysteine-therapy-following-acetaminophen-overdose-2026-update/" },
    "fda-andexxa-2025": { label: "FDA 2025 Andexxa safety and U.S. withdrawal communication", url: "https://www.fda.gov/safety/medical-product-safety-information/update-safety-andexxa-astrazeneca-fda-safety-communication" },
    "cdc-botulism": { label: "CDC clinical guidelines for botulism", url: "https://www.cdc.gov/mmwr/volumes/70/rr/rr7002a1.htm" },
    "cdc-infant-botulism": { label: "CDC clinical overview of infant botulism and BabyBIG access", url: "https://www.cdc.gov/botulism/hcp/clinical-overview/infant-botulism.html" },
    "asra-last": { label: "ASRA local anesthetic systemic toxicity checklist", url: "https://asra.com/docs/default-source/guidelines-articles/local-anesthetic-systemic-toxicity-rgb.pdf?sfvrsn=33b348e_2" },
    "cdc-carbon-monoxide": { label: "CDC clinical guidance for carbon monoxide poisoning", url: "https://www.cdc.gov/carbon-monoxide/hcp/clinical-guidance/index.html" },
    "cdc-diphtheria": { label: "CDC clinical guidance for diphtheria", url: "https://www.cdc.gov/diphtheria/hcp/clinical-guidance/index.html" },
    "cdc-radiation-treatment": { label: "CDC radiation emergency treatment and decorporation overview", url: "https://www.cdc.gov/radiation-emergencies/treatment/index.html" },
    "cdc-lead": { label: "CDC clinical guidance for lead exposure and poisoning", url: "https://www.cdc.gov/lead-prevention/hcp/clinical-guidance/index.html" },
    "fda-vistogard": { label: "FDA Vistogard prescribing information", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2015/208159s000lbl.pdf" },
    "fda-calcium-edta": { label: "FDA calcium disodium edetate product and lead-poisoning safety information", url: "https://www.fda.gov/media/163578/download" },
    "fda-edetate-warning": { label: "FDA warning about edetate disodium substitution", url: "https://www.fda.gov/drugs/postmarket-drug-safety-information-patients-and-providers/information-edetate-disodium-marketed-endrate-and-generic-products" },
    "dailymed-acetylcysteine": { label: "DailyMed acetylcysteine labels", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=acetylcysteine" },
    "dailymed-glucagon": { label: "DailyMed Glucagon for Injection prescribing information", url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=15b49500-0aae-4e25-9a1d-709983233cc6" },
    "dailymed-flumazenil": { label: "DailyMed flumazenil labels", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=flumazenil" },
    "dailymed-fomepizole": { label: "DailyMed fomepizole labels", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=fomepizole" },
    "dailymed-digifab": { label: "DailyMed digoxin immune Fab labels", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=digoxin%20immune%20fab" },
    "dailymed-cyanide": { label: "DailyMed cyanide-antidote labels", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=cyanide%20antidote" },
    "dailymed-methylene-blue": { label: "DailyMed methylene blue labels", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=methylene%20blue" },
    "dailymed-chelators": { label: "DailyMed chelator labels", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=chelator" },
    "dailymed-anticoagulant-reversal": { label: "DailyMed anticoagulant-reversal labels", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=anticoagulant%20reversal" },
    "dailymed-anavip": { label: "DailyMed ANAVIP prescribing information", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=ANAVIP" },
    "dailymed-anascorp": { label: "DailyMed ANASCORP prescribing information", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=ANASCORP" },
    "dailymed-glucarpidase": { label: "DailyMed glucarpidase labels", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=glucarpidase" },
    "dailymed-dexrazoxane": { label: "DailyMed dexrazoxane/TOTECT labels", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=TOTECT" },
    "dailymed-prussian-blue": { label: "DailyMed Radiogardase prescribing information", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=Radiogardase" },
    "dailymed-dtpa": { label: "DailyMed calcium-DTPA and zinc-DTPA labels", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=pentetate" },
    "dailymed-charcoal": { label: "DailyMed activated-charcoal products", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=activated%20charcoal" }
  });

  Object.entries(sourceRefs).forEach(([key, ref]) => {
    if (!ref || !ref.label || !/^https:\/\//i.test(ref.url || "")) {
      throw new Error("Invalid Wave26 antidote source reference: " + key);
    }
  });

  const sourceNoteFor = (keys) => unique(keys).map((key) => {
    const ref = sourceRefs[key];
    return ref ? ref.label + " (" + ref.url + ")" : "";
  }).filter(Boolean).join("; ");

  const makeCard = (spec) => {
    const sourceKeys = unique(spec.sourceKeys || ["aha-toxicology-2025", "poison-help"]);
    sourceKeys.forEach((key) => {
      if (!sourceRefs[key]) throw new Error("Unknown Wave26 antidote source key " + key + " for " + spec.name);
    });
    const card = {
      name: spec.name,
      generic: spec.generic || normalize(spec.name),
      displayName: spec.name,
      aliases: unique(spec.aliases || []),
      brandExamples: unique(spec.brandExamples || []),
      class: spec.class,
      categories: unique([...(spec.categories || []), TOX_CATEGORY]),
      entryType: spec.entryType || "drug",
      classCard: Boolean(spec.classCard),
      isDrugClassCard: Boolean(spec.classCard),
      classExampleNames: unique(spec.classExampleNames || []),
      usedToTreat: spec.usedToTreat,
      description: spec.description,
      mechanism: spec.mechanism,
      administrationTiming: spec.administrationTiming || [],
      nursingEssentials: spec.nursingEssentials || [],
      keyLabs: spec.keyLabs || [],
      adverseEffects: spec.adverseEffects || [],
      contraindications: spec.contraindications || [],
      escalationRecurrence: spec.escalationRecurrence || [],
      interactions: spec.interactions || [],
      evidenceLimitations: spec.evidenceLimitations || [],
      nclexTraps: spec.nclexTraps || [],
      boxedWarning: spec.boxedWarning || "No current U.S. boxed warning. Emergency use still requires toxin-specific risk-benefit assessment, resuscitation readiness, and poison-center or toxicology guidance.",
      sourceKeys,
      sourceNote: sourceNoteFor(sourceKeys),
      tags: unique(["frontier-wave26", "antidote", "toxicology", "causal why closure", ...(spec.tags || [])]),
      nclexEssential: spec.nclexEssential !== false,
      confidenceTier: "Curated full study card",
      studentFacing: true,
      hidden: false,
      antidoteWave26Revision: VERSION
    };
    if (Array.isArray(spec.populationRisks)) card.populationRisks = spec.populationRisks;
    return card;
  };

  const cards = [
    makeCard({
      name: "Antidotes and toxicologic rescue therapies",
      generic: "antidotes and toxicologic rescue therapies",
      aliases: ["antidote overview", "antidote list", "overdose antidotes", "poisoning antidotes", "NCLEX antidotes", "reversal agents", "toxicity reversal table", "main antidotes and toxicologic rescue therapies", "poisoning antidote and reversal agent overview"],
      class: "Mechanism-based antidote and toxicology-rescue overview",
      entryType: "drug-class-card",
      classCard: true,
      classExampleNames: ["Acetylcysteine", "Naloxone", "Fomepizole", "Digoxin immune Fab", "Hydroxocobalamin", "Pyridoxine", "Four factor prothrombin complex concentrate"],
      usedToTreat: "A reasoning framework for matching a poison or dangerous medication effect to a specific antidote, antitoxin, chelator, reversal agent, decontamination strategy, or organ-support intervention.",
      description: "Antidotes work only when their mechanism matches the exposure: some bind a toxin, some block a receptor, some stop toxic metabolite formation, some replace a depleted cofactor, and some restore a physiologic pathway. Airway, ventilation, circulation, glucose, seizure control, temperature control, decontamination, dialysis, surgery, and source control remain treatment rather than background details. Timing matters because toxin may move into cells, bind irreversibly, form toxic metabolites, or outlast a short-acting reversal agent.",
      mechanism: "Receptor antagonists such as naloxone compete with an agonist; binding agents such as digoxin Fab lower free toxin; enzyme blockers such as fomepizole prevent toxic metabolites; substrates such as acetylcysteine or pyridoxine restore protective chemistry; factor products restore coagulation; antitoxins capture circulating toxin before cellular uptake; chelators form excretable complexes. These mechanisms explain why the correct endpoint may be adequate ventilation, dry pulmonary secretions, a narrower QRS, stable glucose and perfusion, falling free toxin, or prevention of further paralysis rather than immediate normalization of every laboratory value.",
      administrationTiming: ["Identify substance, formulation, dose, route, time, co-exposures, symptoms, weight, pregnancy, organ function, and available product while resuscitation begins.", "Use Poison Help or a medical toxicologist because dosing, redosing, observation, and dialysis thresholds are exposure- and protocol-specific."],
      nursingEssentials: ["For severe symptoms, respiratory depression, seizure, shock, serious dysrhythmia, major bleeding, or unresponsiveness, activate emergency response and support ABCs before or alongside antidote preparation.", "Preserve containers, medication lists, photographs, pill counts, and time-stamped laboratory or ECG data because they improve exposure identification and dose reconstruction; assess intent because safety planning can prevent repeat exposure."],
      keyLabs: ["Bedside glucose, ECG, oxygenation/ventilation, acid-base status, electrolytes, renal and hepatic function, coagulation, pregnancy status, and toxin-specific concentrations when they change care."],
      adverseEffects: ["An antidote can create a second emergency through withdrawal, anaphylaxis, seizures, thrombosis, dysrhythmia, hypoglycemia, electrolyte shift, tissue injury, or recurrent toxicity after it wears off."],
      contraindications: ["Do not give an antidote solely because a drug name appears in the history. Confirm that the toxidrome, exposure, timing, and risk-benefit relationship fit; life-threatening poisoning can override ordinary relative cautions."],
      escalationRecurrence: ["Reassess after every intervention. Escalate for worsening ABCs, refractory shock/seizure/dysrhythmia, severe acidosis, organ failure, major bleeding, delayed absorption, or recurrence after a shorter-acting antidote."],
      evidenceLimitations: ["Many toxicology uses are off-label or supported by observational evidence and expert consensus. Product availability and protocols vary; current poison-center guidance controls bedside use."],
      nclexTraps: ["Antidote questions still begin with ABCs and safety.", "Awakening, a corrected INR, or one normal glucose does not prove that the poison is gone."],
      sourceKeys: ["aha-toxicology-2025", "poison-help"]
    }),

    makeCard({
      name: "Acetylcysteine",
      generic: "acetylcysteine",
      aliases: ["N-acetylcysteine", "N acetyl cysteine", "NAC", "Acetadote", "Mucomyst", "acetaminophen antidote", "Tylenol antidote", "paracetamol antidote", "acetyl cysteine", "acetylcystine"],
      brandExamples: ["Acetadote", "Mucomyst"],
      class: "Glutathione-restoring acetaminophen antidote and thiol mucolytic",
      usedToTreat: "Potentially toxic acetaminophen exposure by oral or IV antidote protocols and selected thick-secretion disorders by inhalation. Antidote and mucolytic formulations, doses, routes, and monitoring are not interchangeable.",
      description: "Acetylcysteine is a glutathione-restoring acetaminophen antidote and thiol mucolytic that supplies cysteine for protective glutathione synthesis. It is most protective within eight hours of an acute ingestion, but a late presentation, detectable acetaminophen, rising aminotransferases, or liver failure can still benefit. Do not stop automatically when a standard infusion clock ends: persistent drug, hepatic injury, delayed absorption, or poor prognostic markers require continued treatment and expert reassessment.",
      mechanism: "Acetaminophen glucuronidation and sulfation can saturate, increasing CYP-mediated NAPQI. Glutathione normally reduces NAPQI, but depletion allows mitochondrial and protein injury in centrilobular hepatocytes. Acetylcysteine supplies cysteine for glutathione, supports sulfation, reduces reactive intermediates, and later improves antioxidant and microcirculatory conditions, which explains benefit both before injury and in established hepatic failure. In the airway, its free sulfhydryl group reduces disulfide bonds that cross-link mucin, thereby lowering mucus viscosity. Liquefaction can increase the volume of mobile secretions, so an ineffective cough may require mechanical suction; inhaled delivery can also provoke bronchospasm.",
      administrationTiming: ["Start promptly when indicated; do not wait for a late concentration or every laboratory result when a credible toxic exposure occurred.", "Per ACMT 2026, continue IV therapy beyond the nominal course if acetaminophen remains detectable, AST/ALT are rising, INR or other prognostic markers are abnormal, or clinical hepatic failure persists."],
      nursingEssentials: ["Time-stamp ingestion pattern, formulation, co-ingestants, weight, acetaminophen concentrations, every infusion transition, AST/ALT, INR, creatinine, lactate, pH, phosphate, glucose, urine output, and mental status.", "Before stopping IV NAC, verify all ACMT criteria: acetaminophen under 10 micrograms/mL, AST/ALT normal or falling 25% to 50% from peak, INR under 2, and improving creatinine/lactate/pH/phosphate and clinical condition.", "Manage IV anaphylactoid reactions by severity without reflexively abandoning needed antidote; verify dilution and fluid volume, especially in small children or fluid-sensitive patients.", "For inhaled use, assess bronchospasm, breath sounds, secretion burden, and cough strength before and after treatment because liquefied mucus can pool when cough is ineffective; keep suction available to preserve airway clearance."],
      keyLabs: ["For acetaminophen toxicity, trend serial acetaminophen concentration, AST/ALT, INR/PT, bilirubin, glucose, creatinine, lactate, pH, phosphate, electrolytes, urine output, and encephalopathy because drug clearance and hepatic recovery determine treatment duration.", "For mucolytic use, trend oxygenation, breath sounds, sputum volume, cough effectiveness, and suction need because airway response is clinical rather than defined by a serum acetylcysteine level."],
      adverseEffects: ["Oral or IV acetylcysteine can cause nausea and vomiting; IV treatment can also cause flushing, urticaria, angioedema, bronchospasm, hypotension, or dilution-related fluid overload and hyponatremia.", "Inhaled acetylcysteine can provoke bronchospasm and increase liquefied secretions, which can worsen airway obstruction when cough or suction is inadequate."],
      contraindications: ["Known serious hypersensitivity is a labeled contraindication for IV acetylcysteine, but life-threatening acetaminophen poisoning requires immediate toxicology-guided management of both the reaction and antidote plan.", "A product labeled only for inhalation or oral use is NOT FOR INJECTION because excipients, concentration, sterility, and administration instructions are formulation-specific."],
      interactions: ["Do not mix nebulized acetylcysteine with tetracycline hydrochloride, oxytetracycline hydrochloride, erythromycin lactobionate, or another unverified agent because physical or chemical incompatibility can alter delivery; administer prescribed incompatible agents from separate solutions.", "Published nebulizer-compatibility tables are guides rather than proof for every formulation because manufacturers can change ingredients; consult product-specific compatibility information before combining inhaled drugs."],
      escalationRecurrence: ["Consult toxicology/Poison Help for massive ingestion, delayed peaks, dialysis, pregnancy, persistent acidosis, rising INR/lactate/creatinine, encephalopathy, or failure to meet stopping criteria; involve a liver-transplant center when acute liver failure develops."],
      evidenceLimitations: ["One-, two-, and three-bag IV protocols differ. ACMT supports individualized duration and expert-guided high-dose or dialysis adjustments rather than one universal course."],
      nclexTraps: ["The Rumack-Matthew nomogram does not validate repeated or unknown-time ingestion.", "Finishing 20 or 21 hours does not authorize stopping when drug or liver injury remains."],
      sourceKeys: ["acmt-nac-2026", "dailymed-acetylcysteine", "poison-help"]
    }),

    makeCard({
      name: "Flumazenil",
      generic: "flumazenil",
      aliases: ["Romazicon", "benzodiazepine antidote", "benzo reversal", "benzodiazepine reversal agent", "flumazinal", "flumazanil", "flumazeni"],
      brandExamples: ["Romazicon"],
      class: "Competitive benzodiazepine-site antagonist used only in selected reversal situations",
      usedToTreat: "Selected iatrogenic benzodiazepine sedation or carefully selected isolated benzodiazepine exposure when seizure and withdrawal risk are low. It is not routine treatment for an undifferentiated overdose.",
      description: "Most isolated benzodiazepine poisonings are managed with airway and ventilatory support because flumazenil can abruptly remove protective GABA-A activity and trigger seizures or withdrawal. Its safest role is a known, limited exposure in a benzodiazepine-naive patient, especially monitored procedural reversal. Chronic use, seizure disorder, proconvulsant co-ingestion, tricyclic toxicity, or a wide QRS shifts the balance away from flumazenil.",
      mechanism: "Flumazenil competitively occupies the benzodiazepine recognition site on the GABA-A receptor complex without producing the same positive allosteric effect. It can reverse sedation, but it also removes benzodiazepine anticonvulsant and dependence-suppressing effects. That explains precipitated withdrawal and seizures, especially when another toxin is driving excitation or sodium-channel blockade.",
      administrationTiming: ["Give by slow, titrated IV dosing in a monitored setting only after exposure and contraindications are assessed; the desired endpoint is safe ventilation and arousal, not a forced fully awake state.", "Its effect can be shorter than the benzodiazepine, so repeat dosing or monitored resedation management may be required under protocol."],
      nursingEssentials: ["Support airway and ventilation first; obtain exposure history, chronic benzodiazepine use, seizure history, antidepressant or proconvulsant co-ingestions, ECG/QRS, glucose, and mental status before selected use because these findings identify patients in whom abrupt antagonism could precipitate withdrawal, seizure, or dysrhythmia.", "Maintain continuous ECG, oxygenation, ventilation, suction, seizure treatment, and resuscitation readiness after administration."],
      keyLabs: ["Clinical ventilation and consciousness, ECG/QRS/QTc, glucose, electrolytes, acid-base status, pregnancy and co-ingestant testing chosen by context."],
      adverseEffects: ["Seizure, acute withdrawal, agitation, panic, nausea/vomiting, dizziness, dysrhythmia, hypertension or resedation."],
      contraindications: ["Avoid flumazenil or obtain expert direction with chronic benzodiazepine dependence, a seizure disorder treated with benzodiazepines, TCA or other proconvulsant mixed overdose, wide QRS, serious head injury, or benzodiazepine use to control a life-threatening condition because abrupt antagonism can precipitate withdrawal or seizure and can unmask proconvulsant cardiotoxicity."],
      escalationRecurrence: ["Persistent coma after flumazenil suggests another cause; recurrent sedation, seizure, dysrhythmia, aspiration, or ventilatory failure requires emergency/ICU care rather than repeated blind reversal."],
      evidenceLimitations: ["Benefit is exposure- and patient-selection dependent. It should not be described as a routine home or empiric overdose antidote."],
      nclexTraps: ["Airway support is safer than routine flumazenil in an unknown mixed overdose.", "A benzodiazepine-dependent patient can seize when antagonism abruptly unmasks withdrawal."],
      sourceKeys: ["aha-toxicology-2025", "dailymed-flumazenil", "poison-help"]
    }),

    makeCard({
      name: "Fomepizole",
      generic: "fomepizole",
      aliases: ["Antizol", "4-methylpyrazole", "4 MP", "methanol antidote", "ethylene glycol antidote", "antifreeze antidote", "toxic alcohol antidote", "fomepazole", "fomepizol"],
      brandExamples: ["Antizol"],
      class: "Alcohol-dehydrogenase inhibitor toxic-alcohol antidote",
      usedToTreat: "Known or strongly suspected methanol or ethylene-glycol poisoning before confirmatory levels when clinical, acid-base, osmolar, visual, renal, or exposure evidence supports treatment.",
      description: "Fomepizole is an alcohol-dehydrogenase inhibitor antidote that blocks methanol and ethylene glycol from forming their most toxic metabolites. It prevents new toxic acid production but does not remove acid already formed, so severe acidosis, visual injury, renal failure, very high exposure, or clinical deterioration can still require hemodialysis.",
      mechanism: "Competitive alcohol-dehydrogenase inhibition prevents methanol conversion to formic acid and its formate conjugate base, which injure retina and mitochondria, and prevents ethylene-glycol conversion to glycolate and oxalic acid/oxalate, which drive acidosis, hypocalcemia and renal crystal injury. Parent alcohol then clears slowly or is removed by dialysis.",
      administrationTiming: ["Give the loading dose promptly when suspicion is sufficient; subsequent interval dosing accounts for enzyme induction and changes during hemodialysis.", "Continue until the toxic alcohol is sufficiently low, acidosis has resolved, and the patient is clinically improving under poison-center/toxicology criteria."],
      nursingEssentials: ["Call Poison Help/toxicology early; time-stamp fomepizole and dialysis, verify every interval, and provide airway, seizure, shock, cofactor and acid-base support.", "Prepare transfer for dialysis when severe acidosis, vision findings, renal failure, deterioration, or high concentration meets the active protocol."],
      keyLabs: ["Serial pH/bicarbonate, anion and osmol gaps, methanol/ethylene-glycol concentrations, lactate with assay awareness, creatinine, calcium, electrolytes, urinalysis, ECG, vision and urine output."],
      adverseEffects: ["Headache, nausea, dizziness, infusion-site reaction, transaminase elevation and rare hypersensitivity; untreated toxin remains the larger risk."],
      contraindications: ["Serious hypersensitivity to fomepizole or other pyrazoles is the labeled contraindication because re-exposure can provoke another reaction. Pregnancy or organ dysfunction requires expert dosing assessment because patient-specific exposure or dialysis needs may change, but this should not delay life-saving toxic-metabolite blockade."],
      escalationRecurrence: ["A closing osmol gap can accompany a rising anion gap as parent alcohol becomes acid; trend both. Escalate for any worsening acidemia, vision, kidney, neurologic or hemodynamic status."],
      evidenceLimitations: ["Dialysis thresholds and adjunctive folate, thiamine or pyridoxine practices vary by toxic alcohol and protocol."],
      nclexTraps: ["A normal early pH does not exclude toxic alcohol poisoning.", "Fomepizole blocks metabolism; dialysis removes parent alcohol and toxic metabolites."],
      sourceKeys: ["aha-toxicology-2025", "dailymed-fomepizole", "poison-help"]
    }),

    makeCard({
      name: "Digoxin immune Fab",
      generic: "digoxin immune fab",
      aliases: ["DigiFab", "Digibind", "digoxin Fab", "digitalis antidote", "digoxin antidote", "digoxin immune fragment", "digoxen immune fab"],
      brandExamples: ["DigiFab", "Digibind"],
      class: "Digoxin-specific ovine antibody Fab antidote",
      usedToTreat: "Life-threatening digoxin or related cardiac-glycoside toxicity with unstable ventricular dysrhythmia, severe bradycardia/heart block, shock, cardiac arrest, or clinically important hyperkalemia; selected massive exposures also qualify.",
      description: "Digoxin immune Fab is an ovine antibody-fragment antidote that binds free digoxin and draws it away from sodium-potassium ATPase receptors into inactive complexes. Dose Fab from the estimated body burden when reliable or use an empiric amount when instability makes calculation impossible. Clinical rhythm, potassium and perfusion guide response; total digoxin assays become misleading after Fab because they commonly detect inactive Fab-bound drug.",
      mechanism: "Fab binds free digoxin with greater affinity than the sodium-potassium ATPase. Lower free plasma digoxin draws drug away from tissue receptors into inactive complexes. Restored pump activity moves potassium back into cells and removes inotropic/vagal effects, explaining rapid potassium decline, changing conduction and possible recurrence when Fab complexes clear slowly in renal failure.",
      administrationTiming: ["Do not delay for a digoxin level in an unstable patient. Reconstitute and give the calculated or empiric vial amount under the active label/toxicology protocol.", "Reassess after the expected response interval; additional Fab is considered when life-threatening toxicity persists or recurs."],
      nursingEssentials: ["Obtain a pre-Fab digoxin concentration if it does not delay care, plus the exact product, dose, time, renal function, potassium, magnesium, ECG, and hemodynamics because these data guide vial estimation and establish a baseline before total digoxin assays become misleading.", "Monitor continuously for hypokalemia, faster ventricular response in atrial fibrillation, recurrent heart failure, anaphylaxis, and recurrent toxicity because Fab rapidly changes potassium and conduction while renal failure can prolong Fab-digoxin complexes."],
      keyLabs: ["Continuous ECG, serial potassium/magnesium/creatinine, perfusion and urine output. Do not interpret routine total digoxin levels as free toxicity after Fab."],
      adverseEffects: ["Hypokalemia, worsening heart failure, rapid atrial-fibrillation conduction, infusion reaction, fever and hypersensitivity to ovine protein/papain-related components."],
      contraindications: ["No absolute contraindication should delay Fab in life-threatening toxicity; prior sheep-protein or papain-related allergy increases reaction preparedness."],
      escalationRecurrence: ["Renal failure can prolong Fab-digoxin complexes and permit delayed recurrence. Persistent dysrhythmia, hyperkalemia, shock or rebound toxicity needs toxicology/ICU management."],
      evidenceLimitations: ["Plant cardiac glycosides and chronic versus acute digoxin exposure can require different empiric decisions; use current specialist guidance."],
      nclexTraps: ["After Fab, follow the patient, ECG and potassium—not a high total digoxin assay.", "Hyperkalemia in acute digoxin poisoning is a severity marker, not a reason to give calcium reflexively without expert guidance."],
      sourceKeys: ["aha-toxicology-2025", "dailymed-digifab", "poison-help"]
    }),

    makeCard({
      name: "Hydroxocobalamin",
      generic: "hydroxocobalamin",
      aliases: ["Cyanokit", "cyanide antidote", "smoke inhalation cyanide antidote", "hydroxycobalamin", "hydroxocobolamin"],
      brandExamples: ["Cyanokit"],
      class: "Cobalt-containing cyanide-binding antidote",
      usedToTreat: "Known or suspected cyanide poisoning, including compatible enclosed-space smoke inhalation with shock, severe lactic acidosis, altered mental status, seizure or cardiovascular collapse.",
      description: "Hydroxocobalamin is a cobalt-containing antidote that binds cyanide into cyanocobalamin, preventing further inhibition of mitochondrial cytochrome-c oxidase. Cyanide levels are rarely available quickly enough for an unstable patient, so treatment can begin empirically when exposure and physiology fit while airway, 100% oxygen, burn care, carbon-monoxide assessment and shock treatment continue.",
      mechanism: "Its cobalt center binds cyanide to form cyanocobalamin, lowering cyanide available to inhibit mitochondrial cytochrome-c oxidase. Because binding removes inhibitor from cytochrome oxidase, electron transport can resume and therefore lactate generation can fall as aerobic ATP production recovers, which explains improving perfusion and mental status when cyanide is the driver.",
      administrationTiming: ["Reconstitute and infuse the product promptly when suspicion is high; a second labeled dose may be considered for severity or incomplete response.", "Do not run incompatible medications or blood products through the same line without checking the current product instructions."],
      nursingEssentials: ["Trend airway injury, ventilation, blood pressure, lactate, acid-base status, ECG, neurologic state and burn/CO co-exposure.", "Notify the laboratory and dialysis team because intense red color can interfere with colorimetric tests and some dialysis blood-leak detectors."],
      keyLabs: ["Serial lactate, pH, ECG/hemodynamics, renal function, co-oximetry/carboxyhemoglobin in smoke exposure, and clinical perfusion response."],
      adverseEffects: ["Transient hypertension, red skin/urine, headache, nausea, infusion reaction, acneiform eruption, oxalate crystalluria and extensive laboratory interference."],
      contraindications: ["No absolute contraindication should delay treatment of life-threatening suspected cyanide poisoning; hypersensitivity requires resuscitation readiness."],
      escalationRecurrence: ["Persistent shock, severe acidosis, coma or arrest requires full resuscitation, toxicology and critical-care management; investigate other smoke toxins even after response."],
      evidenceLimitations: ["Empiric use in smoke inhalation is based on clinical risk-benefit because confirmatory cyanide testing is delayed and nonspecific lactate elevation has other causes."],
      nclexTraps: ["Red urine after Cyanokit is expected and can distort laboratory/dialysis equipment.", "A normal pulse-ox reading does not exclude cellular cyanide hypoxia."],
      sourceKeys: ["aha-toxicology-2025", "dailymed-cyanide", "poison-help"]
    }),

    makeCard({
      name: "Sodium nitrite and sodium thiosulfate",
      generic: "sodium nitrite and sodium thiosulfate",
      aliases: ["Nithiodote", "cyanide antidote kit", "nitrite thiosulfate cyanide antidote", "sodium nitrite antidote", "sodium thiosulfate antidote", "amyl nitrite cyanide kit", "nithiodot"],
      brandExamples: ["Nithiodote"],
      class: "Methemoglobin-forming nitrite plus sulfur-donor cyanide antidote combination",
      usedToTreat: "Life-threatening known or strongly suspected cyanide poisoning when this protocol is selected, often as an alternative or adjunct to hydroxocobalamin under toxicology direction.",
      description: "Sodium nitrite deliberately creates methemoglobin that can bind cyanide, while sodium thiosulfate supplies sulfur for conversion of cyanide to renally excreted thiocyanate. Deliberate methemoglobinemia can dangerously reduce oxygen delivery in smoke-inhalation patients who may already have carbon monoxide exposure or anemia, so product selection is not interchangeable.",
      mechanism: "Nitrite oxidizes hemoglobin iron from Fe2+ to Fe3+, creating methemoglobin that competes with mitochondrial cytochrome oxidase for cyanide. Thiosulfate donates sulfur to rhodanese and related sulfurtransferases, accelerating thiocyanate formation. One redistributes cyanide and the other supports detoxification; neither replaces oxygenation and circulation.",
      administrationTiming: ["Give IV in the product-specified sequence and weight-based manner only after cyanide likelihood, oxygen-carrying capacity and competing smoke injuries are considered.", "Thiosulfate may be used with hydroxocobalamin in selected protocols, but line compatibility and evidence must be checked."],
      nursingEssentials: ["Use continuous blood pressure, ECG, oxygenation, ventilation, mental-status and perfusion monitoring; obtain co-oximetry rather than relying on pulse oximetry alone.", "Prepare for hypotension, excessive methemoglobinemia and impaired oxygen delivery; document exact antidote sequence and times."],
      keyLabs: ["Co-oximetry/methemoglobin, lactate, pH, hemoglobin, ECG, blood pressure, renal function and thiocyanate accumulation risk with prolonged/repeated exposure."],
      adverseEffects: ["Nitrite-related hypotension, syncope and excessive methemoglobinemia; thiosulfate-related nausea, vomiting, osmotic/sodium load and hypotension."],
      contraindications: ["Severe anemia, substantial carbon-monoxide co-poisoning or limited oxygen reserve makes nitrite-induced methemoglobinemia especially hazardous; life-threatening decisions require toxicology guidance."],
      escalationRecurrence: ["Persistent shock/acidosis or rising methemoglobin requires critical care and reconsideration of diagnosis/antidote strategy."],
      evidenceLimitations: ["Hydroxocobalamin is often favored for empiric smoke-associated cyanide poisoning because it does not intentionally reduce hemoglobin oxygen capacity; local stocks and protocols vary."],
      nclexTraps: ["Sodium nitrite intentionally creates a dyshemoglobin; that can harm a patient who already has carbon-monoxide poisoning.", "Thiosulfate is not a stand-alone substitute for resuscitation."],
      sourceKeys: ["aha-toxicology-2025", "dailymed-cyanide", "poison-help"]
    }),

    makeCard({
      name: "High-dose insulin euglycemia therapy",
      generic: "high dose insulin euglycemia therapy",
      aliases: ["HIET", "HIE therapy", "HDI therapy", "high dose insulin", "high dose inslin", "euglycemic insulin therapy", "calcium channel blocker overdose insulin", "beta blocker overdose insulin"],
      class: "Insulin-driven myocardial metabolic and inotropic rescue protocol",
      usedToTreat: "Severe calcium-channel-blocker or beta-blocker poisoning with myocardial depression, bradycardia or shock under toxicology/critical-care protocol.",
      description: "High-dose insulin euglycemia therapy is an insulin-driven inotropic rescue protocol that increases myocardial glucose uptake and supports cardiac output in severe calcium-channel-blocker or beta-blocker poisoning. It uses insulin at doses far above diabetes treatment while dextrose maintains euglycemia. Cardiac output can improve before blood pressure rises; vasopressors, calcium, glucagon, lipid emulsion, pacing or extracorporeal support may still be needed according to the poison and shock phenotype.",
      mechanism: "Poisoned myocardium has impaired calcium signaling and shifts away from efficient carbohydrate use. Insulin drives myocardial glucose uptake and oxidation, increases usable energy, improves calcium handling and produces a direct inotropic effect. It also shifts potassium intracellularly, explaining why glucose and potassium monitoring are inseparable from the treatment.",
      administrationTiming: ["Start early in severe cardiogenic shock rather than waiting for every conventional measure to fail. A protocol-directed loading dose is followed by titrated infusion and dextrose support.", "Allow for delayed hemodynamic response; titrate to perfusion/cardiac output and wean slowly with recurrent-shock surveillance."],
      nursingEssentials: ["Use independent dose/pump checks, dedicated access when possible, frequent point-of-care glucose and potassium, continuous ECG/pressure monitoring and time-stamped hemodynamic endpoints.", "Replace dextrose and potassium according to protocol; glucose requirements can continue after insulin is reduced because insulin effect persists."],
      keyLabs: ["Very frequent glucose and potassium initially, magnesium, phosphorus, pH/lactate, renal function, ECG, bedside echo/cardiac output, MAP, urine output and peripheral perfusion."],
      adverseEffects: ["Hypoglycemia, hypokalemia, hypomagnesemia/hypophosphatemia, fluid load from dextrose, dosing error and delayed recurrent shock after premature weaning."],
      contraindications: ["No ordinary diabetes contraindication should block expert-directed HIET in life-threatening poison shock; inability to provide intensive glucose/electrolyte monitoring makes transfer/escalation urgent."],
      escalationRecurrence: ["Escalate refractory shock to toxicology, ICU, vasopressor/vasodilatory phenotype treatment, lipid rescue when appropriate and early ECMO-capable consultation."],
      evidenceLimitations: ["HIET is an accepted off-label toxicology strategy supported mainly by mechanistic, animal and observational evidence; exact dosing/escalation varies."],
      nclexTraps: ["The goal is cardiac output, not diabetes control.", "A normal glucose does not mean dextrose can stop while high-dose insulin remains active."],
      sourceKeys: ["aha-toxicology-2025", "poison-help"]
    }),

    makeCard({
      name: "Glucagon",
      generic: "glucagon",
      aliases: ["GlucaGen", "Gvoke", "Baqsimi", "Zegalogue", "glucagon emergency kit", "hypoglycemia rescue", "beta blocker antidote", "glucogon", "glucagen"],
      brandExamples: ["GlucaGen", "Gvoke", "Baqsimi", "Zegalogue"],
      class: "Glucagon-receptor agonist for hypoglycemia rescue and selected beta-blocker toxicology use",
      usedToTreat: "Severe hypoglycemia when oral carbohydrate is unsafe and, off-label under toxicology direction, selected beta-blocker poisoning with bradycardia or shock. The products and doses for these roles are not interchangeable.",
      description: "Glucagon is a glucagon-receptor agonist hormone that mobilizes hepatic glucose for severe hypoglycemia and can raise cardiac cyclic AMP despite beta-receptor blockade. Community rescue products use injection or nasal delivery, whereas toxicology use generally requires monitored IV dosing and may require an infusion. Because glucagon releases stored fuel rather than supplying carbohydrate, prolonged fasting, malnutrition, alcohol-related illness, or severe liver disease can blunt the glucose response. High toxicology doses often cause vomiting and can be limited by supply, so HIET and vasopressors remain central in severe beta-blocker shock.",
      mechanism: "Glucagon binds the Gs-coupled glucagon receptor, activating adenylyl cyclase, raising cAMP, and activating protein kinase A (PKA). In hepatocytes, PKA activates phosphorylase kinase and glycogen phosphorylase while inhibiting glycogen synthase, so stored hepatic glycogen is mobilized; glucagon also promotes gluconeogenesis. Because it mobilizes rather than supplies glucose, depleted hepatic glycogen during prolonged fasting, malnutrition, alcohol-related illness, or severe liver disease can make rescue ineffective. In cardiac tissue, cAMP and PKA increase calcium entry and handling without requiring beta-adrenergic receptor activation, which explains the off-label chronotropic and inotropic rationale in beta-blocker poisoning. This pathway does not correct every component of toxic shock, and high-dose efficacy is inconsistent; therefore HIET and vasopressors must not be delayed when perfusion remains inadequate.",
      administrationTiming: ["For unconscious hypoglycemia, give the available labeled rescue product promptly while calling for help and obtaining IV access; follow with carbohydrate when swallowing is safe.", "For beta-blocker toxicity, use monitored protocol-directed IV bolus/infusion and prepare antiemetic/airway support; do not substitute a community nasal device for toxicology dosing."],
      nursingEssentials: ["Place an unconscious patient laterally when possible because vomiting is common; recheck glucose and identify persistent insulin or secretagogue action because one response does not remove the cause of hypoglycemia.", "In toxicology, monitor ECG, blood pressure, perfusion, glucose, potassium, and treatment response because persistent shock requires prompt HIET and vasopressor escalation rather than repeated glucagon alone."],
      keyLabs: ["Trend serial bedside glucose and recurrent symptoms because glucagon can fail when hepatic glycogen is depleted and insulin or a secretagogue may outlast the rescue dose.", "For toxicology use, trend ECG, blood pressure, perfusion, potassium, renal and hepatic function, and cause-directed tests because hemodynamic response and adverse effects determine escalation."],
      adverseEffects: ["Nausea and vomiting are common, especially at toxicology doses; an obtunded patient can aspirate, so lateral positioning, airway protection, and suction readiness matter.", "Transient tachycardia, hypertension or hypotension, hyperglycemia followed by recurrent hypoglycemia, injection-site reactions, and rare hypersensitivity can occur; beta-blockers can exaggerate transient pulse and blood-pressure increases."],
      contraindications: ["Pheochromocytoma is a labeled contraindication because glucagon can stimulate tumor catecholamine release and cause abrupt severe hypertension.", "Insulinoma is a labeled contraindication because the initial glucose rise can provoke exaggerated insulin release and recurrent hypoglycemia; known serious hypersensitivity is also a contraindication."],
      interactions: ["With beta-blockers, glucagon may cause a greater transient rise in pulse and blood pressure because its cardiac signaling bypasses beta receptors; monitor hemodynamics when clinically relevant.", "Indomethacin may blunt glucagon's glucose rise or produce hypoglycemia, so recheck glucose and use dextrose when response is inadequate.", "Glucagon may increase warfarin's anticoagulant effect; check INR when clinically relevant because excess anticoagulation increases bleeding risk."],
      escalationRecurrence: ["No response in severe hypoglycemia requires IV dextrose and cause treatment. Refractory beta-blocker shock requires HIET, vasopressors and possible ECMO rather than repeated glucagon alone."],
      evidenceLimitations: ["Evidence for beta-blocker poisoning is limited and agent-dependent; glucagon is not a universal or sufficient beta-blocker antidote."],
      nclexTraps: ["Glucagon mobilizes stored glucose; it does not supply glucose.", "The community hypoglycemia dose is not the toxicology shock regimen."],
      sourceKeys: ["dailymed-glucagon", "aha-toxicology-2025", "poison-help"]
    }),

    makeCard({
      name: "Sodium bicarbonate",
      generic: "sodium bicarbonate",
      aliases: ["bicarb", "sodium bicarb", "TCA antidote", "tricyclic antidote", "sodium channel blocker antidote", "wide QRS overdose treatment", "bicarbonat"],
      class: "Sodium-loading alkalinizer for toxic sodium-channel blockade",
      usedToTreat: "TCA and selected other sodium-channel-blocker poisonings with QRS widening, ventricular dysrhythmia, hypotension or other cardiotoxicity; it also has separate acid-base, hyperkalemia and urine-alkalinization indications.",
      description: "In sodium-channel-blocker poisoning, bicarbonate is given for conduction and hemodynamic toxicity, not simply because serum bicarbonate is low. Repeated boluses and infusion strategies are titrated to ECG, perfusion, sodium and pH endpoints under poison-center guidance.",
      mechanism: "The sodium load increases the extracellular gradient that drives fast-channel depolarization, while alkalemia reduces protonated/free active drug at cardiac sodium channels and changes protein binding. Together this can narrow QRS, suppress ventricular dysrhythmia and improve blood pressure.",
      administrationTiming: ["Give protocol-directed IV boluses promptly for toxic QRS widening, ventricular dysrhythmia or hypotension, then reassess ECG and perfusion after each intervention.", "Ongoing infusion/redosing is individualized; avoid chasing an arbitrary pH after conduction and hemodynamics improve."],
      nursingEssentials: ["Use continuous ECG, frequent pH/sodium/potassium/ionized-calcium checks, strict infusion verification and airway/ventilation support because generated CO2 must be exhaled.", "Treat seizures with appropriate anticonvulsant support and avoid class IA/IC antiarrhythmics because they can worsen sodium-channel blockade and conduction instability."],
      keyLabs: ["Serial QRS/QTc and terminal R-wave pattern, pH/PCO2, sodium, potassium, ionized calcium, bicarbonate, renal function, blood pressure and perfusion."],
      adverseEffects: ["Hypernatremia, alkalemia, hypokalemia, lower ionized calcium, volume overload, tissue injury from extravasation and paradoxical intracellular/CNS acidosis when ventilation is inadequate."],
      contraindications: ["Use caution with severe alkalemia, sodium/volume overload or hypocalcemia, but life-threatening sodium-channel blockade requires mechanism-directed treatment with close monitoring."],
      escalationRecurrence: ["Persistent QRS widening, shock, seizure or dysrhythmia requires toxicology/ICU care and consideration of vasopressors, lipid rescue for selected lipophilic agents, hypertonic sodium or ECMO."],
      evidenceLimitations: ["Target pH, sodium ceiling and infusion regimen vary by toxin and protocol; one TCA regimen should not be generalized to every sodium-channel blocker."],
      nclexTraps: ["Bicarbonate treats sodium-channel blockade and wide QRS, not merely a low bicarbonate result.", "Adequate ventilation is required because bicarbonate generates carbon dioxide."],
      sourceKeys: ["aha-toxicology-2025", "poison-help"]
    }),

    makeCard({
      name: "Intravenous lipid emulsion",
      generic: "intravenous lipid emulsion",
      aliases: ["Intralipid", "lipid emulsion rescue", "ILE", "lipid rescue", "LAST antidote", "bupivacaine antidote", "local anesthetic systemic toxicity treatment", "intralipids"],
      brandExamples: ["Intralipid"],
      class: "Lipid-emulsion rescue for local anesthetic systemic toxicity",
      usedToTreat: "Local anesthetic systemic toxicity with seizure, serious dysrhythmia, hypotension or cardiac arrest; non-LAST lipophilic poison use is less certain and specialist-directed.",
      description: "Intravenous lipid emulsion is a rescue antidote for severe local anesthetic systemic toxicity that binds and redistributes lipophilic anesthetic away from the heart and brain. LAST resuscitation differs from ordinary ACLS, so give lipid early while stopping local anesthetic, securing the airway, treating seizures and following the ASRA checklist's medication modifications.",
      mechanism: "An intravascular lipid phase binds and redistributes lipophilic local anesthetic away from cardiac sodium channels and brain, while fatty-acid substrate and direct myocardial effects may support recovery. The effect depends on drug lipophilicity and does not make lipid a universal antidote.",
      administrationTiming: ["Use the current ASRA weight-based bolus followed by infusion; repeat/escalate for persistent instability while respecting the checklist cumulative limit.", "Continue infusion after stability for the protocol interval and watch for recurrent toxicity because tissue drug can redistribute."],
      nursingEssentials: ["Keep a LAST kit and checklist wherever local anesthetics are used because delay allows more anesthetic to reach cardiac and brain targets; call for help, stop injection, and maintain oxygenation and ventilation because hypoxemia and acidemia worsen sodium-channel blockade; use benzodiazepines for seizures when appropriate and verify every lipid calculation to prevent a compounding error.", "Notify the laboratory that lipemia can invalidate tests and use compatible lines/equipment."],
      keyLabs: ["Continuous ECG/hemodynamics, oxygenation/ventilation, acid-base status, electrolytes, lactate, triglycerides, pancreatic/hepatic markers when prolonged, and clinical neurologic recovery."],
      adverseEffects: ["Fat overload, hypertriglyceridemia, pancreatitis, ARDS, thrombosis, hypersensitivity, volume load, extracorporeal-circuit interference and severe laboratory interference."],
      contraindications: ["There is no practical absolute contraindication in cardiac-arrest LAST; ordinary lipid/nutrition cautions do not outweigh rescue. For non-LAST poisoning, uncertain benefit and complications require toxicology direction."],
      escalationRecurrence: ["Refractory arrest or shock requires early ECMO-capable consultation; observe after recovery because recurrent local-anesthetic toxicity can occur."],
      evidenceLimitations: ["Evidence is strongest for LAST and weaker for other lipophilic toxins; do not route every overdose to lipid emulsion."],
      nclexTraps: ["LAST can begin with tinnitus, metallic taste, circumoral numbness or seizure before cardiovascular collapse.", "Use the LAST checklist rather than ordinary maximal-dose epinephrine habits."],
      sourceKeys: ["asra-last", "aha-toxicology-2025", "poison-help"]
    }),

    makeCard({
      name: "Methylene blue",
      generic: "methylene blue",
      aliases: ["ProvayBlue", "methemoglobinemia antidote", "methaemoglobinemia antidote", "leucomethylene blue", "met blue", "methylene blu", "methlene blue"],
      brandExamples: ["ProvayBlue"],
      class: "NADPH-dependent redox antidote for acquired methemoglobinemia",
      usedToTreat: "Symptomatic or clinically significant acquired methemoglobinemia when impaired oxygen delivery justifies treatment.",
      description: "Methylene blue is an NADPH-dependent redox antidote that restores oxygen-carrying hemoglobin in acquired methemoglobinemia. Its reduced form converts ferric Fe3+ methemoglobin back to ferrous Fe2+ hemoglobin, so response can be poor in G6PD deficiency. Chocolate-brown blood, cyanosis, a saturation gap and pulse oximetry near the mid-80s despite oxygen are key clues; standard PaO2 may remain normal because it measures dissolved oxygen.",
      mechanism: "NADPH-dependent reduction converts methylene blue to leucomethylene blue, which reduces ferric Fe3+ methemoglobin back to oxygen-binding ferrous Fe2+ hemoglobin. G6PD deficiency limits NADPH and can make treatment ineffective while increasing hemolysis risk.",
      administrationTiming: ["Give the labeled weight-based IV dose slowly, reassess clinically and by co-oximetry, and repeat only within product/toxicology limits; excessive cumulative dosing can itself oxidize hemoglobin.", "Stop the oxidant exposure and give oxygen/supportive care at the same time."],
      nursingEssentials: ["Review G6PD risk and serotonergic medications because low NADPH can cause treatment failure or hemolysis and MAO-A inhibition can precipitate serotonin toxicity; monitor ECG, mental status, oxygen delivery, and hemolysis because recurrent methemoglobinemia or red-cell injury changes the rescue plan.", "Use co-oximetry rather than pulse oximetry alone to document response."],
      keyLabs: ["Serial methemoglobin by co-oximetry, CBC, bilirubin/LDH/haptoglobin, pH/lactate, renal function and clinical oxygen-delivery markers."],
      adverseEffects: ["Serotonin syndrome, hemolysis especially with G6PD deficiency, paradoxical methemoglobinemia at high dose, chest pain, hypertension, dyspnea, nausea and blue-green discoloration/interference."],
      contraindications: ["Severe G6PD deficiency, hypersensitivity and high-risk serotonergic combinations require urgent expert risk-benefit assessment; life-threatening hypoxia may require alternatives such as exchange transfusion or hyperbaric oxygen."],
      escalationRecurrence: ["Nonresponse or rebound requires reassessment of ongoing oxidant absorption, G6PD deficiency, sulfhemoglobinemia and need for exchange transfusion/HBO."],
      evidenceLimitations: ["Thresholds vary with symptoms, anemia, cardiopulmonary disease, pregnancy and toxin; do not treat a number without oxygen-delivery context."],
      nclexTraps: ["Normal PaO2 does not exclude methemoglobinemia.", "Methylene blue can cause serotonin syndrome and can fail in G6PD deficiency."],
      sourceKeys: ["aha-toxicology-2025", "dailymed-methylene-blue", "poison-help"]
    }),

    makeCard({
      name: "Pyridoxine",
      generic: "pyridoxine for isoniazid toxicity",
      aliases: ["pyridoxine", "vitamin B6", "B6 antidote", "isoniazid antidote", "INH antidote", "isoniazid seizure antidote", "pyridoxin", "piridoxine"],
      brandExamples: ["Vitamin B6"],
      class: "Cofactor replacement antidote for isoniazid-induced refractory seizure and acidosis",
      usedToTreat: "Acute isoniazid poisoning with seizure, coma or severe metabolic acidosis, and replacement/prevention in selected therapeutic-use contexts.",
      description: "Pyridoxine is a vitamin B6 cofactor-replacement antidote that restores GABA synthesis after isoniazid depletes functional pyridoxal-5-phosphate, helping stop refractory seizures and lactic acidosis. Benzodiazepines and airway support remain necessary because cofactor replacement does not by itself secure ventilation or immediately terminate every seizure.",
      mechanism: "Isoniazid metabolites bind and inactivate pyridoxal-5-phosphate and inhibit pyridoxine phosphokinase. Glutamate decarboxylase then lacks the cofactor needed to make GABA, removing inhibitory tone and permitting status epilepticus. Replacing cofactor therefore restores glutamate-decarboxylase activity and increases GABA synthesis, which reduces pathologic excitation while benzodiazepines provide parallel seizure control.",
      administrationTiming: ["Give IV promptly for serious suspected INH toxicity. When the ingested INH dose is known, toxicology protocols use gram-for-gram pyridoxine; when unknown, an empiric protocol dose is used with pediatric/weight safeguards.", "Large required amounts may exhaust stock, so pharmacy and poison-center coordination should begin immediately."],
      nursingEssentials: ["Simultaneously protect the airway, give benzodiazepines, check glucose, treat shock or acidosis, and monitor continuous ECG and temperature because hypoglycemia, dysrhythmia, hyperthermia, shock, and acidosis can accompany status epilepticus and require parallel treatment.", "Document seizure duration, INH amount/time, pyridoxine amount and response; do not delay antidote for an INH level."],
      keyLabs: ["Serial pH/lactate/bicarbonate/anion gap, glucose, electrolytes, renal/hepatic function, ECG and neurologic/ventilatory status."],
      adverseEffects: ["Large acute doses can cause sensory neuropathy or infusion effects, but untreated refractory status and acidosis dominate emergency risk."],
      contraindications: ["No ordinary vitamin caution should delay pyridoxine in life-threatening suspected INH poisoning; verify formulation and IV compatibility."],
      escalationRecurrence: ["Refractory seizure, severe acidosis, coma or instability requires ICU/toxicology care and consideration of dialysis in exceptional massive poisoning."],
      evidenceLimitations: ["Exact empiric dosing and repeat strategy follow poison-center/protocol guidance; prophylactic low-dose B6 is not the overdose regimen."],
      nclexTraps: ["Isoniazid overdose plus refractory seizure points to pyridoxine, not more antitubercular therapy.", "The antidote dose can be measured in grams, unlike routine supplementation."],
      sourceKeys: ["aha-toxicology-2025", "poison-help"]
    }),

    makeCard({
      name: "Pralidoxime",
      generic: "pralidoxime",
      aliases: ["2-PAM", "2 PAM", "Protopam", "organophosphate antidote", "nerve agent antidote", "oxime antidote", "pralidoxim", "pralidoxime chloride"],
      brandExamples: ["Protopam", "2-PAM"],
      class: "Oxime acetylcholinesterase reactivator",
      usedToTreat: "Organophosphate or nerve-agent poisoning with nicotinic weakness, fasciculation, paralysis or respiratory-muscle failure, alongside atropine, decontamination and ventilatory support.",
      description: "Pralidoxime is an oxime antidote that removes organophosphate from inhibited acetylcholinesterase before enzyme aging, allowing acetylcholine breakdown and neuromuscular function to recover. Atropine separately blocks muscarinic secretions and bronchospasm, so pralidoxime does not replace atropine, suction or ventilation.",
      mechanism: "Its oxime group attacks the phosphorus-enzyme bond and removes the organophosphate from acetylcholinesterase before chemical aging stabilizes the bond. Reactivated enzyme again hydrolyzes acetylcholine at neuromuscular and autonomic synapses.",
      administrationTiming: ["Give early by protocol-directed IV/IM or autoinjector route; repeat or infusion may be required for ongoing absorption, severe weakness or recurrent cholinergic findings.", "Begin atropine and airway treatment immediately rather than waiting for pralidoxime."],
      nursingEssentials: ["Protect staff from secondary contamination; remove clothing and irrigate skin according to hazmat protocol while maintaining airway/suction.", "Trend bronchial secretions, oxygenation, muscle strength, fasciculations, pupils, bowel/bladder findings, ECG and atropine/pralidoxime totals."],
      keyLabs: ["Clinical ventilation/secretions/strength, ABG/VBG, ECG, electrolytes and cholinesterase activity when available; levels do not replace clinical endpoints."],
      adverseEffects: ["Hypertension, tachycardia, nausea, dizziness, diplopia, blurred vision, muscle rigidity and transient neuromuscular blockade with rapid/high dosing."],
      contraindications: ["Risk-benefit varies for carbamate poisoning because inhibition can reverse spontaneously and pralidoxime evidence is agent-specific; organophosphate life threat overrides ordinary cautions."],
      escalationRecurrence: ["Fat-soluble organophosphates can redistribute and cause recurrent weakness/secretions; prolonged ICU ventilation and repeated therapy may be necessary."],
      evidenceLimitations: ["Clinical trial evidence is mixed and agent/timing dependent, but early expert-guided use remains standard in serious organophosphate/nerve-agent poisoning."],
      nclexTraps: ["Atropine dries dangerous secretions; pralidoxime addresses enzyme inhibition and weakness.", "Pupil size is not the atropine endpoint—ventilation and pulmonary secretion control are."],
      sourceKeys: ["aha-toxicology-2025", "poison-help"]
    }),

    makeCard({
      name: "Physostigmine",
      generic: "physostigmine",
      aliases: ["Anticholium", "anticholinergic antidote", "antimuscarinic delirium antidote", "physostigmin", "fysostigmine"],
      brandExamples: ["Anticholium"],
      class: "Tertiary reversible acetylcholinesterase inhibitor for selected pure antimuscarinic delirium",
      usedToTreat: "Severe central antimuscarinic delirium in a carefully selected patient with a compatible toxidrome and reassuring ECG, under toxicology guidance.",
      description: "Physostigmine is a tertiary acetylcholinesterase inhibitor that increases central acetylcholine and can rapidly reverse selected pure antimuscarinic delirium. It can also cause bradycardia, cholinergic toxicity or seizure and can be dangerous when sodium-channel blockade or a mixed/TCA overdose is possible.",
      mechanism: "Reversible acetylcholinesterase inhibition raises acetylcholine in central and peripheral synapses, competitively overcoming muscarinic receptor blockade. Because acetylcholine also slows the heart and increases secretions, the same mechanism explains therapeutic awakening and toxic bradycardia/bronchorrhea.",
      administrationTiming: ["Obtain ECG/QRS and exposure history first, then give slowly in small monitored doses with atropine and resuscitation equipment immediately available.", "Observe for recurrence because physostigmine can wear off before the antimuscarinic drug; repeat use is specialist-directed."],
      nursingEssentials: ["Confirm dry skin/mucosa, mydriasis, urinary retention, reduced bowel sounds, hyperthermia and delirium rather than nonspecific agitation.", "Use continuous ECG, airway/oxygenation and seizure monitoring; stop for bradycardia, conduction change, bronchorrhea or cholinergic findings."],
      keyLabs: ["ECG/QRS/QTc, glucose, electrolytes, temperature, oxygenation/ventilation and co-ingestant studies based on history."],
      adverseEffects: ["Bradycardia/asystole, bronchospasm/secretions, vomiting, diarrhea, diaphoresis, seizure and recurrent delirium."],
      contraindications: ["Avoid with TCA or other sodium-channel-blocker toxicity, wide QRS/conduction disease, serious bradycardia, mechanical GI/GU obstruction, uncontrolled asthma or high seizure risk unless a toxicologist determines otherwise."],
      escalationRecurrence: ["Recurrent delirium, hyperthermia, seizure, wide QRS or instability requires ICU/toxicology care and cause-specific treatment rather than repeated empiric physostigmine."],
      evidenceLimitations: ["This is selected-use therapy, not a universal delirium antidote; safe outcomes depend on toxidrome and ECG selection."],
      nclexTraps: ["Atropine worsens antimuscarinic poisoning; it is kept ready to treat excessive physostigmine effect.", "Check QRS before choosing physostigmine because sodium-channel blockade or a wide QRS raises the risk of bradyarrhythmia, heart block, or seizure after cholinesterase inhibition."],
      sourceKeys: ["aha-toxicology-2025", "poison-help"]
    }),

    makeCard({
      name: "Deferoxamine",
      generic: "deferoxamine",
      aliases: ["Desferal", "iron antidote", "iron poisoning chelator", "ferrioxamine", "deferoxamin", "desferrioxamine"],
      brandExamples: ["Desferal"],
      class: "Parenteral ferric-iron chelator",
      usedToTreat: "Serious acute iron poisoning with systemic toxicity and selected chronic iron-overload settings; acute decisions use clinical shock/acidosis/GI findings, imaging and timed iron concentrations rather than one isolated number.",
      description: "Free iron damages GI mucosa, mitochondria and vasculature, causing vomiting, bleeding, shock, acidosis and hepatic injury. Deferoxamine binds circulating/labile ferric iron but cannot repair established organ injury, so resuscitation and decontamination assessment remain essential.",
      mechanism: "Its multiple hydroxamate groups wrap around Fe3+ to form ferrioxamine, a water-soluble complex excreted in urine and bile. It spares most iron fixed in hemoglobin and essential proteins, so it selectively removes labile toxic iron; renal excretion of the complex can also produce the classic vin-rose urine.",
      administrationTiming: ["For severe acute poisoning, use toxicology-directed continuous IV therapy with careful rate control; rapid infusion can worsen hypotension.", "Duration follows clinical improvement, acidosis/shock resolution, iron trend and toxicity rather than urine color alone."],
      nursingEssentials: ["Call Poison Help, assess airway, shock, and GI hemorrhage, obtain timed iron studies and abdominal imaging when appropriate, and coordinate whole-bowel irrigation for radiopaque tablets when safe because shock and GI injury can progress while the concentration and retained tablets determine antidote and decontamination planning.", "Monitor infusion rate, blood pressure, respiratory status, urine output or color, and hepatic or renal injury because rapid infusion can cause hypotension and falling urine output can impair ferrioxamine elimination."],
      keyLabs: ["Timed serum iron with assay limitations after chelation, pH/lactate, glucose, electrolytes, CBC, liver tests, coagulation, renal function, urine output and abdominal radiography when indicated."],
      adverseEffects: ["Hypotension with rapid infusion, ARDS during prolonged high-dose therapy, Yersinia/mucormycosis susceptibility, visual/auditory toxicity and injection reactions."],
      contraindications: ["Severe renal failure complicates ferrioxamine elimination and may require dialysis planning; instability is an indication for careful monitored therapy, not a generic contraindication."],
      escalationRecurrence: ["Refractory shock, acidosis, hepatic failure, persistent tablet burden or respiratory failure requires ICU/toxicology and possible extracorporeal support."],
      evidenceLimitations: ["Numerical iron thresholds depend on sampling time and clinical context; do not wait for a late or hemolyzed level in a crashing patient."],
      nclexTraps: ["Vin-rose urine supports chelation but is not the treatment endpoint.", "Rapid deferoxamine infusion can worsen hypotension."],
      sourceKeys: ["aha-toxicology-2025", "dailymed-chelators", "poison-help"]
    }),

    makeCard({
      name: "Calcium disodium EDTA",
      generic: "calcium disodium edetate",
      aliases: ["calcium disodium EDTA", "CaNa2EDTA", "calcium edetate", "edetate calcium disodium", "Calcium Disodium Versenate", "lead EDTA antidote", "Ca EDTA"],
      brandExamples: ["Calcium Disodium Versenate"],
      class: "Parenteral calcium-containing aminopolycarboxylate lead chelator",
      usedToTreat: "Moderate-to-severe lead poisoning and lead encephalopathy under specialist protocols, often with dimercaprol first/alongside for severe symptomatic exposure.",
      description: "Calcium disodium EDTA is a parenteral lead chelator that exchanges its supplied calcium for lead, forming a kidney-excreted complex. It must not be confused with edetate disodium, which can chelate the patient's calcium and has caused fatal hypocalcemia. Chelation never replaces removal from the lead source.",
      mechanism: "EDTA donor atoms form a stable ring around divalent/trivalent metals. In CaNa2EDTA, lead has greater binding affinity than calcium, so lead displaces the supplied calcium and the lead-EDTA complex is excreted by the kidney. This explains both lead removal and nephrotoxicity risk from high renal chelate exposure.",
      administrationTiming: ["Use weight/body-surface and renal-function-adjusted IV or IM courses under toxicology; severe encephalopathy protocols sequence dimercaprol before or with CaNa2EDTA.", "Treatment courses include rest intervals for redistribution and toxicity prevention; repeat blood-lead testing guides further courses."],
      nursingEssentials: ["Verify the full generic name and calcium-containing product aloud before preparation; never accept ambiguous 'EDTA' ordering.", "Maintain hydration/urine-output monitoring, remove exposure source and coordinate developmental/neurologic follow-up."],
      keyLabs: ["Blood lead level, CBC, creatinine/BUN, urinalysis/protein, liver tests, zinc, and neurologic status; monitor urine output throughout therapy because falling output can signal renal injury and impaired chelate clearance."],
      adverseEffects: ["Nephrotoxicity/proteinuria, zinc and trace-metal depletion, fever, chills, hypotension and injection-site pain."],
      contraindications: ["Anuria or severe active renal disease may prevent safe elimination. Edetate disodium is not an acceptable substitute and can cause fatal hypocalcemia."],
      escalationRecurrence: ["Lead encephalopathy, seizure, cerebral edema, severe abdominal symptoms or very high levels requires urgent inpatient toxicology care; rebound after redistribution requires planned follow-up."],
      evidenceLimitations: ["Thresholds and chelator combinations differ by age, symptoms and level; public-health/toxicology guidance controls treatment."],
      nclexTraps: ["Calcium disodium EDTA treats lead; edetate disodium can dangerously remove calcium.", "Remove the source or lead burden will return after chelation."],
      sourceKeys: ["fda-calcium-edta", "fda-edetate-warning", "cdc-lead", "poison-help"]
    }),

    makeCard({
      name: "Succimer",
      generic: "succimer",
      aliases: ["Chemet", "DMSA", "dimercaptosuccinic acid", "oral lead chelator", "lead poisoning medicine", "sucimer"],
      brandExamples: ["Chemet"],
      class: "Oral sulfhydryl chelator for selected lead poisoning",
      usedToTreat: "Selected pediatric or adult lead poisoning without encephalopathy when the blood lead level and clinical/public-health criteria support oral chelation.",
      description: "Succimer is an oral vicinal-dithiol chelator for selected lead poisoning without encephalopathy. Its sulfhydryl groups coordinate circulating lead into water-soluble complexes, thereby increasing urinary elimination and lowering diffusible blood lead. Because succimer does not cross the blood-brain barrier and does not rapidly rescue intracranial toxicity, it is not adequate as sole treatment for lead encephalopathy. Tissue lead can redistribute back into blood after a course, which explains why source removal and repeat testing are integral rather than optional.",
      mechanism: "Two sulfhydryl groups bind lead with relative selectivity and form water-soluble complexes that are excreted in urine. This lowers ongoing exposure of enzyme thiols and other molecular targets, but it cannot reverse established developmental or neurologic injury. When an environmental source persists or tissue compartments re-equilibrate, blood lead can rise again; therefore exposure control, adherence, and post-course testing determine whether improvement persists.",
      administrationTiming: ["Give the full oral course and frequency transition prescribed by the active protocol; capsules may be opened/mixed according to label when swallowing is difficult.", "Repeat blood lead after treatment/rest interval to detect rebound and determine whether another course is needed."],
      nursingEssentials: ["Identify and eliminate the lead source with public-health support because chelation lowers body burden only temporarily when exposure continues. Assess adherence, GI symptoms, rash, fever or infection, and developmental or neurologic needs because toxicity and treatment effects can require intervention.", "Obtain a CBC with differential before and during therapy because neutropenia can emerge; interrupt treatment and escalate per the label and toxicology guidance when infection or a clinically important neutrophil decline develops.", "Check baseline and periodic AST/ALT because succimer can cause hepatotoxicity; reassess renal and hepatic function in impaired patients because clearance and safety data are limited.", "Do not delay inpatient parenteral chelation for lead encephalopathy because succimer does not cross the blood-brain barrier and cannot provide rapid central nervous system rescue."],
      keyLabs: ["Serial blood lead, CBC with differential, AST/ALT, renal function and developmental/hearing/neurologic assessment."],
      adverseEffects: ["GI upset, diarrhea, rash, transient transaminase elevation, neutropenia and metallic taste."],
      contraindications: ["Known serious hypersensitivity to succimer is the labeled contraindication because re-exposure can provoke another reaction.", "Succimer is not appropriate as sole therapy for lead encephalopathy because it does not cross the blood-brain barrier or provide rapid central nervous system rescue."],
      escalationRecurrence: ["Encephalopathy, seizure, severe colic/anemia or rising/rebound levels requires toxicology and parenteral-chelation evaluation."],
      evidenceLimitations: ["Chelation thresholds should follow current pediatric/adult public-health guidance, not a memorized number alone."],
      nclexTraps: ["Succimer is oral treatment for selected lead poisoning, not lead encephalopathy.", "Chelation without source removal invites re-exposure."],
      sourceKeys: ["cdc-lead", "dailymed-chelators", "poison-help"]
    }),

    makeCard({
      name: "Dimercaprol",
      generic: "dimercaprol",
      aliases: ["BAL", "British anti-Lewisite", "heavy metal antidote", "arsenic antidote", "mercury antidote", "dimercaprol injection"],
      brandExamples: ["BAL in Oil", "British anti-Lewisite"],
      class: "Deep-IM sulfhydryl chelator for selected severe metal poisoning",
      usedToTreat: "Selected severe arsenic or inorganic mercury poisoning and severe lead poisoning in combination with calcium disodium EDTA; metal choice is toxicology-specific.",
      description: "Dimercaprol is a deep-intramuscular sulfhydryl chelator whose paired thiol groups bind selected metals into excretable complexes, thereby limiting metal attachment to cellular enzyme thiols. The chelator-metal complex is eliminated largely in urine, so renal status matters during treatment. Because dimercaprol complexes with iron, cadmium, and selenium can be more toxic than the unchelated metal, especially to the kidneys, it is not a generic heavy-metal detoxification drug.",
      mechanism: "Two sulfhydryl groups coordinate metals that would otherwise bind and disable tissue enzyme thiols. Formation of a stable chelator-metal complex therefore preserves more enzyme function and promotes urinary excretion while repeated dosing maintains available thiol groups. Because binding strength, redistribution, and complex toxicity differ by metal, a chelator that helps arsenic or lead poisoning can worsen another exposure.",
      administrationTiming: ["Give deep IM by metal- and severity-specific schedule; in severe lead encephalopathy, administer before or with CaNa2EDTA to reduce redistribution risk.", "Dose intervals are initially frequent and then lengthen; pharmacy/toxicology must verify the exact regimen."],
      nursingEssentials: ["Confirm the metal, formulation, weight, peanut-oil allergy history, G6PD risk, blood pressure, and renal or hepatic status because efficacy and complex toxicity are metal- and patient-specific.", "Prepare for painful injections and monitor temperature, vomiting, tachycardia, hypertension, and neurologic change because adverse effects can emerge rapidly after deep-IM dosing."],
      keyLabs: ["Metal-specific levels/speciation, CBC, renal/liver function, urinalysis, blood pressure, glucose in children and hemolysis markers when indicated."],
      adverseEffects: ["Hypertension, tachycardia, fever especially in children, nausea/vomiting, headache, lacrimation, painful sterile abscess and hemolysis risk."],
      contraindications: ["Do not use dimercaprol for iron, cadmium, or selenium poisoning because the resulting complexes can be more toxic than the free metal, particularly in the kidneys.", "Significant hepatic impairment and peanut-oil hypersensitivity require specialist assessment because metabolism and excipient risks can outweigh benefit."],
      escalationRecurrence: ["Severe neurologic, renal, hepatic or hemodynamic toxicity requires inpatient monitoring and combination/alternative chelation planning."],
      evidenceLimitations: ["Modern preferred chelators differ by metal and severity; dimercaprol use is specialist-directed and availability can be limited."],
      nclexTraps: ["BAL is dimercaprol, but 'BAL' can also mean blood alcohol level—use context.", "Do not use one chelator for every metal because each metal-chelator complex has a different efficacy and toxicity profile."],
      sourceKeys: ["dailymed-chelators", "cdc-lead", "poison-help"]
    }),

    makeCard({
      name: "Prussian blue",
      generic: "insoluble prussian blue",
      aliases: ["Radiogardase", "insoluble Prussian blue", "cesium antidote", "thallium antidote", "radiocesium decorporation", "Prussion blue"],
      brandExamples: ["Radiogardase"],
      class: "Nonabsorbed gastrointestinal ion-exchange decorporation agent",
      usedToTreat: "Known or suspected internal contamination with radioactive cesium or nonradioactive/radioactive thallium under public-health/radiation-specialist direction.",
      description: "Prussian blue is a nonabsorbed gastrointestinal ion-exchange binder that binds cesium or thallium secreted in bile and interrupts enterohepatic reabsorption. It stays mainly in the gut and speeds fecal elimination, but it does not remove external contamination or other radionuclides.",
      mechanism: "Its crystal lattice contains channels that exchange potassium-like ions and bind cesium/thallium. The complex remains in the intestine and leaves in stool, pulling additional metal from blood through ongoing biliary secretion and concentration gradients.",
      administrationTiming: ["Begin promptly after confirmed/credible internal contamination and continue the public-health-directed oral course; capsules can be opened and mixed according to label when needed.", "Maintain bowel movement because constipation slows elimination and increases radiation/metal residence time."],
      nursingEssentials: ["Coordinate radiation medicine/public health, contamination control and serial bioassay; teach that stool and mouth may turn blue.", "Track bowel pattern, hydration, potassium, and adherence because constipation can delay fecal elimination and electrolyte loss can accompany treatment; separate interacting oral drugs when binding is possible because Prussian blue can reduce their absorption."],
      keyLabs: ["Whole-body counting or urine/fecal bioassay, electrolytes especially potassium, renal function, CBC and exposure-specific radiation assessment."],
      adverseEffects: ["Constipation, hypokalemia, GI discomfort and blue discoloration of stool/teeth/mouth."],
      contraindications: ["Ileus, bowel obstruction or inability to use the GI tract prevents effective/safe administration; it does not treat plutonium, americium, curium or radioactive iodine."],
      escalationRecurrence: ["Severe thallium neurologic/cardiac toxicity or significant radionuclide burden requires specialty-center management and prolonged serial measurement."],
      evidenceLimitations: ["Use is contaminant-specific; public-health authorities determine duration and bioassay endpoints."],
      nclexTraps: ["Prussian blue is a drug for cesium/thallium, not a topical decontamination dye.", "Constipation reduces decorporation effectiveness."],
      sourceKeys: ["cdc-radiation-treatment", "dailymed-prussian-blue"]
    }),

    makeCard({
      name: "Calcium DTPA and zinc DTPA",
      generic: "pentetate calcium trisodium and pentetate zinc trisodium",
      aliases: ["Ca-DTPA", "Zn-DTPA", "calcium DTPA", "zinc DTPA", "pentetate calcium trisodium", "pentetate zinc trisodium", "plutonium antidote", "americium decorporation", "curium decorporation"],
      brandExamples: ["Pentetate calcium trisodium", "Pentetate zinc trisodium"],
      class: "Aminopolycarboxylate decorporation chelators for selected transuranic radionuclides",
      usedToTreat: "Internal contamination with plutonium, americium or curium after a radiologic incident, under radiation-emergency/public-health direction.",
      description: "Ca-DTPA removes these radionuclides more effectively in the first day, while Zn-DTPA has similar later effectiveness with less depletion of essential metals and is generally preferred for prolonged treatment. Neither treats radioactive cesium, thallium or iodine.",
      mechanism: "DTPA donor groups surround positively charged transuranic ions to form stable water-soluble complexes excreted in urine. Calcium or zinc occupies the chelator until a higher-affinity radionuclide displaces it; Ca-DTPA also removes more normal trace metals.",
      administrationTiming: ["Give as soon as feasible after confirmed/credible internal contamination; select IV or inhaled route and calcium versus zinc product by time, exposure route, pregnancy/age and public-health protocol.", "Repeated treatment follows serial bioassay and contaminant burden rather than a fixed universal duration."],
      nursingEssentials: ["Coordinate radiation specialists and contamination control; verify the exact calcium or zinc product and document radionuclide, route, time and bioassay samples.", "Monitor trace metals and replace zinc/magnesium/manganese when prolonged Ca-DTPA therapy requires it."],
      keyLabs: ["Urine/fecal bioassay, CBC, renal function, electrolytes and trace minerals; external dosimetry does not substitute for internal-contamination assessment."],
      adverseEffects: ["Nausea, chills, headache, infusion reaction, bronchospasm with inhalation and trace-metal depletion, greater with repeated Ca-DTPA."],
      contraindications: ["Use is radionuclide-specific; inhalation is unsuitable with significant airway disease without expert assessment. Product selection in pregnancy/children requires radiation-specialist guidance."],
      escalationRecurrence: ["Large internal burden or ongoing wound contamination may require repeated treatment, wound decontamination/excision and long-term surveillance."],
      evidenceLimitations: ["Rare-event evidence and dosing depend on federal/public-health protocols; these are not general heavy-metal chelators."],
      nclexTraps: ["Ca-DTPA is generally favored early; Zn-DTPA is safer for prolonged courses.", "Prussian blue and DTPA treat different contaminants."],
      sourceKeys: ["cdc-radiation-treatment", "dailymed-dtpa"]
    }),

    makeCard({
      name: "Phytonadione",
      generic: "phytonadione",
      aliases: ["vitamin K", "vitamin K1", "Vitamin K phytonadione", "Mephyton", "warfarin antidote", "warfarin reversal vitamin", "phytomenadione", "phytonadion"],
      brandExamples: ["Mephyton", "Vitamin K1"],
      class: "Vitamin K1 cofactor replacement for durable vitamin-K-antagonist reversal",
      usedToTreat: "Vitamin K deficiency or antagonism, including warfarin-related over-anticoagulation. Major/life-threatening bleeding generally requires rapid factor replacement plus IV phytonadione for sustained reversal.",
      description: "Phytonadione is vitamin K1 cofactor replacement that restores hepatic gamma-carboxylation and production of functional factors II, VII, IX, and X after warfarin inhibition. Clinically meaningful INR improvement generally takes 1 to 8 hours because the liver must synthesize and release newly carboxylated factors. Four-factor PCC therefore supplies factors immediately during major bleeding while phytonadione provides durable reversal as those infused factors decay. Route and dose depend on bleeding severity, INR, and urgency.",
      mechanism: "Reduced vitamin K is the cofactor for gamma-glutamyl carboxylase, which adds calcium-binding residues to factors II, VII, IX and X and proteins C/S. Warfarin blocks vitamin-K recycling; phytonadione replenishes substrate through alternative reduction pathways. Factor half-lives explain delayed onset and why factor VII/INR changes before full prothrombin recovery.",
      administrationTiming: ["For major bleeding, give protocol-directed slow IV phytonadione with 4F-PCC because PCC supplies immediate factors while vitamin K establishes durable reversal; for nonbleeding INR elevation, oral or hold strategies follow INR and bleeding risk.", "INR response generally begins within 1 to 8 hours. Evaluate INR about 6 to 8 hours after parenteral administration because response varies with dose, liver function, and anticoagulant burden; repeat dosing only according to the clinical response and active protocol."],
      nursingEssentials: ["Verify warfarin indication, last dose, INR, bleed site, neurologic status, liver function, PCC order, and anticoagulation restart plan because reversal intensity must balance active bleeding against thrombosis risk.", "With IV use, follow product-specific dilution and rate instructions and maintain anaphylaxis readiness because fatal reactions can occur despite dilution or slow administration; avoid IM injection in an anticoagulated patient because intramuscular trauma can produce a hematoma."],
      keyLabs: ["Trend serial PT/INR because the initial value defines anticoagulant effect and the 6- to 8-hour response shows whether hepatic factor production is recovering.", "Trend CBC and hemoglobin, bleed-site findings, liver function, fibrinogen, and clinical hemostasis because a corrected INR does not prove that an anatomic bleeding source has stopped."],
      adverseEffects: ["IV or IM phytonadione can cause severe hypersensitivity, including fatal anaphylaxis, as well as flushing, hypotension, dyspnea, cyanosis, dizziness, dysgeusia, or tachycardia.", "Injection-site reactions, overcorrection, and temporary resistance to warfarin can occur, which can complicate safe re-anticoagulation and increase thrombosis concern in susceptible patients."],
      contraindications: ["Known serious hypersensitivity to phytonadione or a formulation component is the labeled contraindication because re-exposure can provoke another severe reaction.", "Do not use phytonadione alone for immediate hemostasis in life-threatening warfarin bleeding because INR improvement may take 1 to 8 hours; give protocol-directed 4F-PCC for rapid factor replacement."],
      interactions: ["Phytonadione pharmacodynamically antagonizes warfarin because it restores vitamin-K-dependent factor synthesis; large or repeated doses can produce temporary warfarin resistance and delay safe re-anticoagulation.", "Phytonadione does not reverse unfractionated heparin, low-molecular-weight heparin, or direct oral anticoagulants because those drugs do not block vitamin K recycling; use agent-specific reversal and supportive care."],
      populationRisks: [
        { type: "pediatric", label: "Neonatal and pediatric caution", note: "Use a benzyl-alcohol-free formulation for neonates and infants when available because benzyl alcohol exposure can cause serious toxicity; prophylactic newborn dosing follows a separate prevention protocol." },
        { type: "geriatric", label: "Older adult caution", note: "Individualize reversal and reassess bleeding and thrombosis risk because older adults often have intracranial or gastrointestinal bleeding risk, vascular disease, and a continuing indication for anticoagulation." },
        { type: "pregnancy", label: "Pregnancy and lactation", note: "Use a preservative-free formulation when available because formulation excipients can matter in pregnancy and lactation; the urgency of maternal bleeding still controls the immediate risk-benefit decision." }
      ],
      escalationRecurrence: ["Ongoing bleeding despite corrected INR requires source control and massive-bleeding evaluation; reassess INR as PCC factors decay and plan safe anticoagulation resumption."],
      evidenceLimitations: ["Dose/route differ for asymptomatic INR elevation, urgent procedure and major bleeding; follow current institutional consensus."],
      nclexTraps: ["Vitamin K makes new functional factors later; PCC supplies factors immediately.", "A corrected INR does not prove the bleeding source has stopped."],
      boxedWarning: "Phytonadione injectable emulsion carries a U.S. boxed warning for fatal hypersensitivity reactions, including anaphylaxis, during and immediately after IV or IM administration. Reactions have occurred despite dilution and slow administration. Use the route and setting required by the bleeding emergency with product-label rate precautions and emergency treatment immediately available because anaphylaxis can develop without warning.",
      sourceKeys: ["aha-toxicology-2025", "dailymed-anticoagulant-reversal"]
    }),

    makeCard({
      name: "Four factor prothrombin complex concentrate",
      generic: "four factor prothrombin complex concentrate",
      aliases: ["4-factor PCC", "4F-PCC", "4 factor PCC", "PCC", "prothrombin complex concentrate", "Kcentra", "Balfaxar", "four factor prothombin complex concentrate", "warfarin factor reversal"],
      brandExamples: ["Kcentra", "Balfaxar"],
      class: "Concentrated nonactivated vitamin-K-dependent coagulation-factor replacement",
      usedToTreat: "Urgent vitamin-K-antagonist reversal according to the exact product label; current protocol-directed off-label use may be considered for selected factor-Xa-inhibitor major bleeding because Andexxa is no longer sold or licensed in the United States.",
      description: "Four-factor prothrombin complex concentrate is a small-volume coagulation-factor replacement that rapidly provides factors II, VII, IX and X. For warfarin it must be paired with vitamin K because infused factors decay while warfarin remains. In factor-Xa-inhibitor bleeding it does not bind or remove the drug; it attempts to restore enough thrombin generation to overcome inhibition, so benefit is less direct and thrombosis risk remains.",
      mechanism: "Concentrated functional factors II, VII, IX, and X rebuild tenase, prothrombinase, and thrombin generation, which rapidly lowers warfarin-associated INR. Protein C and protein S are also supplied, but laboratory correction cannot repair an anatomic vessel. Because infused factors decay while warfarin remains, IV vitamin K is needed for durable vitamin-K-antagonist reversal. For apixaban or rivaroxaban, extra factor X and prothrombin may increase thrombin-generation reserve, but the anti-Xa drug remains present; this explains why factor-Xa use is indirect and off-label and why thromboembolism risk persists.",
      administrationTiming: ["Verify exact product, anticoagulant, last dose, weight, pre-dose INR when relevant, indication, vial potency, calculated maximum and concurrent IV vitamin K for VKA reversal.", "Infuse at the product-specific rate; do not interchange activated PCC/FEIBA with nonactivated 4F-PCC."],
      nursingEssentials: ["Use independent calculation and reconstitution checks because vial-potency or weight errors can cause under-reversal or excessive factor exposure; monitor hemodynamics, neurologic status, the bleed site, and signs of stroke, MI, DVT, PE, or limb ischemia because rapid coagulation restoration can trade bleeding risk for thromboembolism.", "Plan anatomic source control and anticoagulation restart as soon as safe because PCC replaces factors temporarily but does not repair the vessel or remove the continuing indication for anticoagulation."],
      keyLabs: ["Trend PT/INR for vitamin-K-antagonist reversal and pair it with site-specific clinical hemostasis because a corrected INR does not prove that the bleeding source has stopped.", "Monitor CBC and hemoglobin, platelets, fibrinogen, renal and liver function, type and screen, and anticoagulant-specific assays when available because blood loss, DIC, organ clearance, and residual anticoagulant can change the response."],
      adverseEffects: ["Arterial or venous thromboembolism can present as MI, ischemic stroke, DVT, PE, or limb ischemia; DIC can worsen when procoagulant factors are given in an already activated coagulation state.", "Hypersensitivity or anaphylaxis, headache, nausea, infusion reactions, HIT with heparin-containing products, and theoretical plasma-derived infection transmission are additional risks."],
      contraindications: ["Known anaphylactic or severe systemic reaction to the selected 4F-PCC or one of its components is a product-label contraindication because re-exposure can provoke another severe reaction.", "Do not use a heparin-containing 4F-PCC in HIT, and follow the selected product's restriction for active DIC, because added heparin can reactivate HIT while infused procoagulant factors can amplify uncontrolled thrombosis."],
      interactions: ["Give IV phytonadione with 4F-PCC for major warfarin bleeding because PCC supplies immediate factors while vitamin K permits durable hepatic factor synthesis after infused factors decay.", "Other procoagulant or antifibrinolytic therapies can add thromboembolism risk; coordinate combined or sequential rescue because evidence and safety depend on the anticoagulant, bleeding site, and active protocol."],
      escalationRecurrence: ["Persistent bleeding needs anatomic source control, transfusion/massive-hemorrhage support and specialty consultation; resume anticoagulation when safe."],
      evidenceLimitations: ["Use for factor-Xa inhibitors is off-label and evidence/protocol dependent. It is current U.S. protocol context, not proof of direct antidote equivalence."],
      nclexTraps: ["PCC plus vitamin K is the rapid-plus-durable warfarin pair.", "Do not describe 4F-PCC as directly neutralizing apixaban or rivaroxaban."],
      sourceKeys: ["aha-toxicology-2025", "dailymed-anticoagulant-reversal", "fda-andexxa-2025"]
    }),

    makeCard({
      name: "Idarucizumab",
      generic: "idarucizumab",
      aliases: ["Praxbind", "dabigatran antidote", "dabigatran reversal", "Pradaxa antidote", "idarucizamab", "idarucizimab"],
      brandExamples: ["Praxbind"],
      class: "Dabigatran-binding humanized monoclonal Fab reversal agent",
      usedToTreat: "Urgent reversal of dabigatran for life-threatening/uncontrolled bleeding or emergency surgery/procedure that cannot wait for drug clearance.",
      description: "Idarucizumab is a humanized monoclonal antibody Fab reversal agent that binds free and thrombin-bound dabigatran into inactive complexes. It is specific for dabigatran and does not reverse factor-Xa inhibitors, warfarin or heparin. The labeled total dose is delivered as two consecutive vials; dabigatran can redistribute and anticoagulant effect can recur, especially with high concentration or renal failure.",
      mechanism: "Its Fab binding pocket has very high affinity for free and thrombin-bound dabigatran and active metabolites. Sequestration lowers free dabigatran and therefore reduces direct thrombin inhibition, allowing fibrin formation to resume without supplying clotting factors. Because renal failure or a large body burden can drive redistribution from tissue into plasma, anticoagulant effect can recur after initial reversal.",
      administrationTiming: ["Give the labeled 5-g total dose as two consecutive 2.5-g/50-mL vials by infusion or bolus according to label; do not delay life-saving reversal for a specialized assay.", "A repeat course is exceptional and requires recurrent clinically relevant bleeding plus laboratory evidence and specialist guidance."],
      nursingEssentials: ["Verify dabigatran identity, last dose, renal function, bleeding/procedure urgency and exact two-vial completion.", "Continue source control and watch for thrombosis, recurrent bleeding or rebound anticoagulant effect; plan restart when safe."],
      keyLabs: ["CBC/hemoglobin, creatinine, thrombin time/dilute thrombin time or ecarin assay when available, aPTT context, hemodynamics and clinical hemostasis."],
      adverseEffects: ["Thromboembolism from underlying risk/reversal, hypersensitivity, hypokalemia, delirium, fever and recurrent anticoagulant effect."],
      contraindications: ["No contraindication based on active bleeding—that is the indication. Serious hypersensitivity and hereditary fructose intolerance concern from sorbitol exposure require label review without delaying fatal-bleeding care."],
      escalationRecurrence: ["Rebleeding or recurrent coagulation effect needs repeat assessment, renal/dabigatran clearance evaluation, source control and specialist decision about additional reversal/dialysis."],
      evidenceLimitations: ["It binds dabigatran only. Normal routine tests do not always exclude clinically relevant dabigatran."],
      nclexTraps: ["Praxbind equals dabigatran; factor-Xa inhibitors use a different current pathway.", "Reversal does not eliminate the patient's thrombotic disease."],
      sourceKeys: ["dailymed-anticoagulant-reversal", "aha-toxicology-2025"]
    }),

    makeCard({
      name: "Andexanet alfa",
      generic: "andexanet alfa",
      aliases: ["Andexxa", "coagulation factor Xa recombinant inactivated zhzo", "historical factor Xa antidote", "withdrawn apixaban antidote", "withdrawn rivaroxaban antidote", "andexanet", "andexanent alfa"],
      brandExamples: ["Andexxa (withdrawn in the United States)"],
      class: "Withdrawn U.S. recombinant factor-Xa decoy reversal product; historical reference",
      usedToTreat: "Historical education only in the United States: Andexxa was formerly authorized for life-threatening or uncontrolled bleeding from apixaban or rivaroxaban. U.S. sales/manufacturing ended December 22, 2025 and the accelerated approval was withdrawn December 23, 2025.",
      description: "Andexanet alfa was a recombinant, catalytically inactive factor-Xa decoy reversal product that acted by binding apixaban and rivaroxaban, transiently reducing their anticoagulant effect. It is unavailable for routine reversal in the United States: FDA withdrew approval after concluding that serious thrombotic risks outweighed benefits. Current severe factor-Xa-inhibitor bleeding requires emergency source control and the active institutional pathway, commonly protocol-directed 4F-PCC or activated PCC context.",
      mechanism: "The modified catalytically inactive factor-Xa protein acted as a decoy that bound factor-Xa inhibitors and reduced measured anti-Xa activity. It also interacted with tissue-factor-pathway inhibitor, helping explain procoagulant and thrombotic effects. Lower anti-Xa activity did not guarantee improved overall clinical benefit.",
      administrationTiming: ["Do not order or promise Andexxa availability in the United States. For current bleeding, identify anticoagulant, last dose, renal function and severity, then activate the present institutional reversal/source-control protocol.", "Retain historical dose concepts only for interpreting old records or non-U.S. contexts where legal availability must be verified locally."],
      nursingEssentials: ["Treat current intracranial, GI, or other major factor-Xa bleeding as an emergency; hold anticoagulant, assess airway and ventilation, establish vascular access, trend hemodynamics and hemoglobin, obtain source control, and prepare protocol-selected PCC or aPCC support because ongoing bleeding threatens airway and perfusion while no andexanet product is currently available in the United States.", "State the December 2025 United States withdrawal explicitly when teaching and redirect learners to the current institutional reversal pathway so historical recognition does not become an outdated bedside choice."],
      keyLabs: ["Trend serial hemoglobin and hemodynamics because a single early hemoglobin may lag acute blood loss; interpret a calibrated anti-Xa assay only when available because routine PT/INR can underrepresent apixaban or rivaroxaban effect; also document renal and hepatic function, last-dose timing, and site-specific hemostasis."],
      adverseEffects: ["Historical use carried arterial/venous thrombosis, ischemic stroke, MI, cardiac arrest, sudden death and infusion reactions."],
      contraindications: ["Active bleeding was the historical indication, not a contraindication. The controlling current limitation is U.S. market/approval withdrawal and unfavorable FDA benefit-risk conclusion."],
      escalationRecurrence: ["Current severe bleeding requires emergency hematology/critical-care/procedural management and timely anticoagulation reassessment after hemostasis."],
      evidenceLimitations: ["Historical mechanism and trial data remain educational, but no current U.S. availability should be inferred. International status must be checked locally."],
      nclexTraps: ["Andexxa is no longer a current U.S. answer.", "Current factor-Xa major bleeding routes to the active institutional PCC/aPCC and source-control pathway."],
      boxedWarning: "Historical boxed warning included arterial and venous thromboembolism, ischemic events, cardiac arrest and sudden death. FDA later concluded risks outweighed benefits; U.S. authorization was withdrawn in December 2025.",
      sourceKeys: ["fda-andexxa-2025", "aha-toxicology-2025"]
    }),

    makeCard({
      name: "Botulism antitoxin",
      generic: "botulism antitoxin",
      aliases: ["BAT", "heptavalent botulism antitoxin", "botulinum antitoxin", "equine botulism antitoxin", "HBAT", "adult botulism antidote"],
      brandExamples: ["BAT"],
      class: "Equine heptavalent botulinum antitoxin for non-infant botulism",
      usedToTreat: "Suspected symptomatic foodborne, wound, inhalational or iatrogenic non-infant botulism after urgent public-health consultation; do not wait for laboratory confirmation.",
      description: "BAT neutralizes toxin still circulating but cannot remove toxin already internalized in nerve terminals. Early treatment can stop progression, while established paralysis improves only as neuromuscular terminals regenerate over weeks to months.",
      mechanism: "Equine antibody fragments bind circulating unbound toxin, including botulinum neurotoxin serotypes A through G, preventing further uptake at presynaptic terminals of the neuromuscular junction. They cannot reach toxin that has entered neurons and cleaved SNARE proteins, explaining why antitoxin does not immediately restore acetylcholine release.",
      administrationTiming: ["Call the state health department/CDC immediately and give released antitoxin as soon as possible after clinical diagnosis; collect specimens without delaying treatment.", "Infuse by the supplied protocol with emergency treatment ready for hypersensitivity."],
      nursingEssentials: ["Monitor bulbar function, secretions, aspiration, vital capacity or NIF, ventilation, and autonomic stability because descending paralysis can cause silent respiratory failure; intubate before fatigue causes a crash because antitoxin cannot reverse toxin already internalized in nerve terminals.", "Coordinate wound debridement and antibiotics for wound botulism and mandatory public-health reporting."],
      keyLabs: ["Serial respiratory mechanics, ABG/VBG as needed and serum/stool/food/wound toxin specimens through public health; treatment is clinical."],
      adverseEffects: ["Anaphylaxis, infusion reaction, fever/chills, rash and delayed serum sickness from equine protein."],
      contraindications: ["Equine-protein hypersensitivity increases risk but suspected progressive botulism is life-threatening; manage with public-health risk-benefit guidance."],
      escalationRecurrence: ["Descending weakness can progress despite antitoxin because already-internalized toxin remains; prolonged ventilation, nutrition and rehabilitation may be required."],
      evidenceLimitations: ["BAT is obtained through public health in the United States and is not the standard product for typical infant botulism."],
      nclexTraps: ["Antitoxin stops new toxin binding; it does not reverse established paralysis.", "An alert, afebrile patient can still be approaching respiratory failure."],
      sourceKeys: ["cdc-botulism", "poison-help"]
    }),

    makeCard({
      name: "Botulism immune globulin intravenous",
      generic: "botulism immune globulin intravenous human",
      aliases: ["BabyBIG", "BIG-IV", "botulism immune globulin intravenous human", "infant botulism antitoxin", "human botulism immune globulin", "baby big"],
      brandExamples: ["BabyBIG"],
      class: "Human botulism immune globulin for infant botulism",
      usedToTreat: "Clinical infant botulism caused by intestinal toxin production, after immediate consultation with the Infant Botulism Treatment and Prevention Program; do not wait for stool confirmation.",
      description: "Botulism immune globulin intravenous is a human immunoglobulin antitoxin that binds circulating botulinum toxin before it enters infant nerve terminals. It shortens illness and hospitalization when given early while intestinally produced toxin remains extracellular; equine adult BAT is not interchangeable for typical infant botulism.",
      mechanism: "Human anti-A and anti-B antibodies bind circulating toxin, preventing attachment and internalization at presynaptic cholinergic terminals. By preventing additional toxin uptake, the antibodies therefore reduce further neuromuscular blockade; because internalized toxin has already disrupted acetylcholine release, recovery still depends on new terminal function, which explains why weakness does not disappear immediately.",
      administrationTiming: ["Call the Infant Botulism Treatment and Prevention Program immediately for consultation/release and administer as soon as available; testing must not delay treatment.", "Infuse the single specialist-directed dose with IVIG and anaphylaxis precautions."],
      nursingEssentials: ["Recognize constipation, poor feeding, weak cry, ptosis, facial weakness, hypotonia, weak gag/suck and descending respiratory weakness.", "Protect the airway and avoid aspiration because descending paralysis impairs swallowing and ventilation; trend respiratory mechanics and support nutrition because recovery can remain slow after circulating toxin is neutralized, and report through public health."],
      keyLabs: ["Clinical respiratory/bulbar assessment; stool or enema specimen through public health for confirmation. Routine labs do not rule out infant botulism."],
      adverseEffects: ["Infusion reaction, hypersensitivity, fever, fluid/renal/thrombotic risks shared with immune-globulin products and rare hemolysis/aseptic meningitis."],
      contraindications: ["Serious human-immune-globulin hypersensitivity or IgA-related risk requires specialist preparation because immune globulin can provoke hypersensitivity or anaphylaxis, but treatment should not be delayed casually when descending paralysis is worsening."],
      escalationRecurrence: ["Weakness can progress before antibodies capture all toxin; NICU/PICU ventilation and prolonged feeding support may be needed."],
      evidenceLimitations: ["BabyBIG primarily targets toxin types A and B in typical infant botulism; unusual toxin types or ingested preformed toxin require public-health distinction."],
      nclexTraps: ["Infant botulism uses BabyBIG, not routine adult equine BAT.", "Do not wait for stool confirmation before treatment."],
      sourceKeys: ["cdc-infant-botulism", "cdc-botulism"]
    }),

    makeCard({
      name: "ANAVIP",
      generic: "crotalidae immune f(ab')2 equine",
      aliases: ["ANAVIP", "Crotalidae immune F(ab')2", "equine crotalid antivenom", "equine F(ab')2 rattlesnake antivenom", "rattlesnake antivenom ANAVIP", "copperhead antivenom ANAVIP", "cottonmouth antivenom ANAVIP", "Anavip antivenin"],
      brandExamples: ["ANAVIP"],
      class: "Equine North American crotalid venom immune F(ab')2 antivenom",
      usedToTreat: "North American rattlesnake, copperhead or cottonmouth envenomation with progressive local injury, coagulopathy, systemic toxicity or neurotoxicity under poison-center guidance.",
      description: "ANAVIP is an equine antibody-fragment antivenom that binds circulating North American crotalid venom before more toxin reaches tissue targets. Binding lowers free venom and therefore reduces additional delivery to coagulation, neuromuscular, and local tissue targets. Because F(ab')2 fragments persist longer than Fab fragments, they can overlap depot absorption longer and may reduce some recurrence, but they do not eliminate delayed coagulopathy. Dose follows venom burden and clinical control rather than patient size, so children can require the same vial count as adults.",
      mechanism: "Two linked antigen-binding arms bind circulating venom components, thereby lowering free toxin and favoring movement of toxin away from tissue targets into neutralized complexes. This reduces additional venom-mediated tissue injury, coagulopathy, and neurotoxicity. Because F(ab')2 fragments remain in circulation longer, their exposure better overlaps continued venom absorption from the bite depot; recurrence and equine-protein reactions can still occur, so clinical and laboratory follow-up remains essential.",
      administrationTiming: ["Immobilize, remove constricting items, call Poison Help or toxicology, and give the product-specific initial-control regimen promptly because antivenom can neutralize circulating venom but cannot instantly reverse established tissue injury; repeat according to clinical control and the active protocol.", "After initial control, observe in a healthcare setting for at least 18 hours because local, systemic, neurologic, or coagulation effects can recur; do not interchange ANAVIP and CroFab vial schedules because their formulations and dosing regimens are not equivalent."],
      nursingEssentials: ["Mark and time swelling, measure circumference, and trend pain, neuro-respiratory status, bleeding, platelets, PT/INR, and fibrinogen because serial change shows whether venom effects are progressing or controlled; avoid ice, cutting, suction, electric shock, or tourniquets because these measures do not neutralize venom and can worsen tissue injury or ischemia.", "Keep epinephrine and resuscitation equipment ready because equine proteins can provoke an acute infusion reaction; arrange delayed laboratory and bleeding follow-up because recurrent coagulopathy can appear after initial control."],
      keyLabs: ["Serial platelets, PT/INR, fibrinogen, hemoglobin, CK, renal function, urinalysis and local/systemic envenomation findings."],
      adverseEffects: ["Anaphylaxis/infusion reaction, nausea, fever, rash and delayed serum sickness; recurrent venom effects remain possible."],
      contraindications: ["Equine-protein hypersensitivity increases risk but progressive envenomation is limb- or life-threatening; use monitored risk-benefit treatment."],
      escalationRecurrence: ["Recurrent coagulopathy, swelling, bleeding or neurotoxicity after initial control requires immediate poison-center reassessment and possible redosing."],
      evidenceLimitations: ["Product choice and observation depend on species, geography, syndrome and stock; ANAVIP and CroFab are not milligram/vial interchangeable."],
      nclexTraps: ["Antivenom dose tracks venom, not child versus adult body size.", "Initial control does not eliminate delayed coagulopathy."],
      sourceKeys: ["dailymed-anavip", "poison-help"]
    }),

    makeCard({
      name: "Anascorp",
      generic: "centruroides immune f(ab')2 equine",
      aliases: ["Anascorp", "ANASCORP", "scorpion antivenom", "bark scorpion antivenom", "Centruroides antivenom", "scorpion antidote"],
      brandExamples: ["Anascorp"],
      class: "Equine F(ab')2 antivenom for clinically important Centruroides scorpion envenomation",
      usedToTreat: "Clinically important Centruroides/bark-scorpion envenomation with cranial-nerve dysfunction, uncontrolled neuromuscular excitation, hypersalivation, respiratory compromise or other severe findings.",
      description: "Severe bark-scorpion venom opens neuronal sodium channels and drives uncontrolled neuromuscular/autonomic activity, especially in children. Antivenom binds free toxin and can rapidly improve the syndrome, while airway and sedation support continue.",
      mechanism: "Polyclonal F(ab')2 fragments bind venom neurotoxins before they remain at voltage-gated sodium-channel targets. Lower free toxin reduces repetitive firing, explaining improvement in roving eyes, tongue fasciculation, jerking, secretions and respiratory distress.",
      administrationTiming: ["Call Poison Help and administer the labeled initial IV vial series for clinically important envenomation; reassess and give additional vials only when significant symptoms persist.", "Mild pain/paresthesia alone may need supportive care rather than antivenom."],
      nursingEssentials: ["Monitor airway, secretions, eye movements, swallowing, speech, muscle activity, oxygenation, heart rate, blood pressure, and pain because neurotoxin-driven bulbar weakness, secretions, and autonomic instability can progress rapidly; keep anaphylaxis treatment ready because equine F(ab')2 fragments can provoke acute hypersensitivity.", "Children can deteriorate quickly and require early transport and monitoring because their respiratory reserve is smaller and severe neuromuscular excitation can evolve rapidly."],
      keyLabs: ["Diagnosis and response are clinical; monitor respiratory and hemodynamic status and obtain labs based on severity and coexisting illness because respiratory failure and autonomic instability, rather than one toxin level, determine escalation."],
      adverseEffects: ["Vomiting, fever, rash, infusion reaction/anaphylaxis and delayed serum sickness."],
      contraindications: ["Equine-protein allergy increases risk but severe neurotoxic envenomation can be life-threatening."],
      escalationRecurrence: ["Persistent bulbar/respiratory findings or autonomic instability requires ICU care and poison-center-directed additional antivenom."],
      evidenceLimitations: ["Species and geography matter; this product is not a universal antivenom for every scorpion."],
      nclexTraps: ["Severe pediatric bark-scorpion findings are neurologic and secretory, not just a painful sting.", "Antivenom treats systemic venom effects; local pain alone does not automatically require it."],
      sourceKeys: ["dailymed-anascorp", "poison-help"]
    }),

    makeCard({
      name: "Leucovorin",
      generic: "leucovorin calcium",
      aliases: ["folinic acid", "calcium folinate", "Wellcovorin", "methotrexate rescue", "leucovorin rescue", "folinate", "leucovorin calcium", "leucavorin"],
      brandExamples: ["Wellcovorin"],
      class: "Reduced-folate cellular rescue and fluoropyrimidine-modulating agent",
      usedToTreat: "Scheduled rescue after high-dose methotrexate and selected folate-antagonist toxicity. In fluorouracil regimens it enhances, rather than rescues from, 5-FU effect; uridine triacetate is the emergency fluorouracil/capecitabine antidote.",
      description: "Leucovorin bypasses dihydrofolate-reductase blockade and supplies reduced folate to normal cells. Rescue timing and intensity are tied to methotrexate dose, elapsed time, kidney function and serial concentration; delayed or inadequate rescue permits mucosal, marrow and organ injury.",
      mechanism: "Leucovorin enters the reduced-folate pool downstream of DHFR, restoring one-carbon transfer needed for purine and thymidylate synthesis despite methotrexate. Restoring reduced folate therefore allows DNA-precursor synthesis to resume in normal cells and reduces methotrexate injury; because leucovorin does not remove methotrexate, rescue intensity must follow drug clearance. With 5-FU, reduced folate instead stabilizes the FdUMP-thymidylate-synthase complex, increasing cytotoxicity—opposite clinical meanings from the same molecule.",
      administrationTiming: ["Start at the regimen-specified time after methotrexate and continue/adjust to serial methotrexate concentration and renal clearance; never use a generic fixed course for delayed elimination.", "Separate leucovorin from glucarpidase by at least two hours before and after because glucarpidase can hydrolyze leucovorin."],
      nursingEssentials: ["Time-stamp methotrexate infusion end, every level, leucovorin dose, hydration/alkalinization and glucarpidase; verify route because oral absorption may be inadequate at high rescue doses.", "Trend mucositis, diarrhea, marrow suppression, infection, bleeding, kidney/liver injury and fluid/electrolyte status."],
      keyLabs: ["Time-specific methotrexate concentrations, creatinine/urine output, urine pH, CBC, liver tests, electrolytes and clinical mucosal/neurologic toxicity."],
      adverseEffects: ["Hypersensitivity, nausea and rare seizure interaction; inadequate rescue permits methotrexate toxicity, while excessive/mistimed rescue can reduce antitumor effect."],
      contraindications: ["It does not treat pernicious anemia neurologic injury and is not the emergency antidote for 5-FU overdose."],
      escalationRecurrence: ["Delayed methotrexate clearance or rising creatinine requires intensified leucovorin, hydration/alkalinization and urgent glucarpidase eligibility assessment."],
      evidenceLimitations: ["Rescue nomograms are regimen-specific; oncology/toxicology protocol controls dose and duration."],
      nclexTraps: ["Leucovorin rescues from methotrexate but strengthens 5-FU.", "Glucarpidase lowers plasma methotrexate; leucovorin protects cells."],
      sourceKeys: ["dailymed-glucarpidase", "poison-help"]
    }),

    makeCard({
      name: "Glucarpidase",
      generic: "glucarpidase",
      aliases: ["Voraxaze", "carboxypeptidase G2", "CPDG2", "methotrexate antidote enzyme", "high methotrexate kidney failure rescue", "glucarpadase"],
      brandExamples: ["Voraxaze"],
      class: "Recombinant methotrexate-cleaving carboxypeptidase antidote",
      usedToTreat: "Toxic plasma methotrexate concentrations with delayed elimination from impaired renal function after high-dose therapy; not routine expected clearance or ordinary low-dose adverse effects.",
      description: "Glucarpidase is an emergency carboxypeptidase antidote that cleaves circulating methotrexate into inactive metabolites when renal dysfunction delays high-dose methotrexate clearance. It can lower circulating methotrexate within minutes without waiting for kidney filtration, which limits further movement of drug from plasma into tissues. It cannot enter cells well enough to remove intracellular methotrexate, so it does not replace leucovorin rescue, hydration, urine alkalinization, or organ-supportive care. The cleavage product DAMPA cross-reacts with many methotrexate immunoassays; during the first 48 hours, an apparently high result can therefore reflect assay interference rather than persistent active methotrexate. Timing and assay method must be interpreted together.",
      mechanism: "Glucarpidase is recombinant carboxypeptidase G2. In plasma it hydrolyzes the terminal glutamate from methotrexate, producing inactive DAMPA and glutamate through a pathway that does not require renal excretion. Rapidly lowering extracellular methotrexate creates a concentration gradient that limits continued tissue exposure, but the large enzyme remains mainly extracellular and cannot reverse drug already trapped inside vulnerable cells. Leucovorin must continue because it supplies reduced folate downstream of dihydrofolate reductase and protects intracellular folate-dependent metabolism. Glucarpidase can also cleave leucovorin, so giving them together would destroy part of the rescue dose; separating leucovorin by at least two hours before and after preserves both therapies. DAMPA persists long enough to make common immunoassays overestimate methotrexate for about 48 hours, which is why chromatographic measurement is preferred during that interval.",
      administrationTiming: ["Assess eligibility early when creatinine rises and time-specific methotrexate levels exceed protocol thresholds; give the labeled single IV dose without waiting for established marrow/mucosal injury.", "Separate leucovorin by at least two hours before and after and continue rescue for the protocol-defined period."],
      nursingEssentials: ["Record the methotrexate dose and infusion end time, each concentration with its collection time and assay method, the creatinine trajectory, urine pH/output, hydration, and every leucovorin/glucarpidase administration time; these timestamps explain whether a value is biologically plausible.", "Protect the two-hour leucovorin window, maintain protocol-directed leucovorin, IV hydration, and urine alkalinization, and monitor for hypersensitivity during and after administration because plasma clearance does not end intracellular toxicity."],
      keyLabs: ["Use a time-stamped chromatographic methotrexate method when available for the first 48 hours because DAMPA can make immunoassays read falsely high; interpret every result with the pre-glucarpidase concentration and active protocol.", "Trend creatinine/eGFR, urine output and pH, electrolytes, CBC, liver tests, fluid balance, mucositis, neurologic findings, infection, and bleeding because intracellular methotrexate injury can continue after the plasma concentration falls."],
      adverseEffects: ["Flushing, paresthesia, nausea or vomiting, headache, and hypotension can occur; assess the temporal relationship to the dose and distinguish them from the underlying toxicity.", "Serious hypersensitivity is uncommon but can progress to airway or hemodynamic compromise, so stop and escalate according to the emergency protocol while preserving the broader methotrexate-rescue plan."],
      contraindications: ["The U.S. label lists no formal contraindication, but glucarpidase is not indicated when methotrexate is clearing as expected because unnecessary enzyme exposure does not improve routine clearance.", "It does not treat intrathecal methotrexate overdose and cannot remove intracellular methotrexate; those situations require their own emergency or oncology protocol rather than substitution of this plasma-directed enzyme."],
      interactions: ["Leucovorin is a glucarpidase substrate. Administer it at least two hours before or two hours after glucarpidase so the enzyme does not reduce the active rescue concentration.", "DAMPA is not a drug interaction, but it creates a clinically important test interaction: many methotrexate immunoassays overestimate active drug for about 48 hours, so use a chromatographic method when possible and do not react to an isolated misleading value."],
      escalationRecurrence: ["Persistent tissue toxicity, unreliable immunoassay results or renal failure needs oncology/toxicology coordination and ongoing leucovorin/support."],
      evidenceLimitations: ["Eligibility thresholds are time- and regimen-specific; use the active high-dose-methotrexate protocol."],
      nclexTraps: ["A high post-glucarpidase immunoassay can be DAMPA, not treatment failure.", "Keep leucovorin, but protect the two-hour window."],
      sourceKeys: ["dailymed-glucarpidase", "poison-help"]
    }),

    makeCard({
      name: "Uridine triacetate",
      generic: "uridine triacetate",
      aliases: ["Vistogard", "5-FU antidote", "5 FU overdose antidote", "fluorouracil antidote", "capecitabine antidote", "Xeloda antidote", "uridine acetate", "uridin triacetate"],
      brandExamples: ["Vistogard"],
      class: "Oral pyrimidine antidote for fluorouracil/capecitabine overdose or early severe toxicity",
      usedToTreat: "Emergency treatment after fluorouracil or capecitabine overdose regardless of symptoms, or early-onset severe/life-threatening cardiac, CNS, GI or hematologic toxicity within 96 hours after treatment ends.",
      description: "Uridine triacetate must be started within the labeled 96-hour window; it is not routine treatment for expected delayed chemotherapy adverse effects because it can reduce anticancer efficacy. Rapid recognition matters when pump programming errors, DPD deficiency or unexpectedly early severe toxicity appears.",
      mechanism: "It delivers bioavailable uridine, increasing intracellular UTP that competes with toxic fluorouridine triphosphate for RNA incorporation. Toxic fluorouridine is therefore incorporated into normal-cell RNA less often, so RNA processing and cell function are protected while the fluoropyrimidine clears.",
      administrationTiming: ["Start as soon as possible and within 96 hours. Adults receive the labeled oral packet dose every six hours for 20 doses; pediatric dosing is body-surface-area based with a per-dose maximum.", "Mix granules with soft food without chewing; NG/G-tube delivery is permitted. Redose if vomiting occurs within the label window and make up missed doses as directed."],
      nursingEssentials: ["Stop fluoropyrimidine, call oncology/toxicology and verify pump amount/rate, last exposure time, body surface area, every dose and vomiting/redosing.", "Trend mental status, ECG/cardiac symptoms, mucositis/diarrhea, hydration, CBC/infection/bleeding and organ function."],
      keyLabs: ["CBC with differential/platelets, electrolytes, renal/liver function, ECG/troponin as indicated, lactate/acid-base status and DPD testing when it informs future therapy."],
      adverseEffects: ["Vomiting, nausea and diarrhea; aspiration or missed absorption can complicate severe mucositis/altered consciousness."],
      contraindications: ["No labeled contraindication; it is not recommended for nonemergent routine toxicity because it may reduce chemotherapy efficacy."],
      escalationRecurrence: ["Early cardiotoxicity, encephalopathy, severe diarrhea/mucositis, neutropenic sepsis or shock requires ICU/oncology care while all 20 antidote doses continue."],
      evidenceLimitations: ["Safety and efficacy when begun more than 96 hours after exposure are not established; late toxicity still requires aggressive supportive oncology care."],
      nclexTraps: ["5-FU/capecitabine overdose points to uridine triacetate, not naloxone or leucovorin.", "The 96-hour start window is time-critical."],
      sourceKeys: ["fda-vistogard", "poison-help"]
    }),

    makeCard({
      name: "Dexrazoxane",
      generic: "dexrazoxane",
      aliases: ["Totect", "anthracycline extravasation antidote", "doxorubicin extravasation antidote", "daunorubicin extravasation antidote", "dexrazoxane extravasation", "dexrazoxan"],
      brandExamples: ["Totect"],
      class: "Topoisomerase-II catalytic inhibitor and iron-chelating anthracycline extravasation antidote",
      usedToTreat: "Suspected or confirmed anthracycline extravasation to prevent progressive tissue necrosis; separate dexrazoxane products/indications also reduce selected anthracycline cardiotoxicity.",
      description: "Anthracyclines bind tissue and generate persistent DNA/topoisomerase and free-radical injury, so damage can expand for days. Totect is time-critical: start within six hours and continue the labeled three-day course while using local extravasation measures.",
      mechanism: "Dexrazoxane enters cells and is hydrolyzed to an EDTA-like chelator that reduces iron-dependent anthracycline radicals; the parent also inhibits topoisomerase II catalytically, reducing anthracycline-DNA damage. These complementary effects limit cell death around the infiltrated vein.",
      administrationTiming: ["Stop infusion but initially leave the catheter for aspiration per extravasation protocol; start Totect IV in a large vein of the opposite limb within six hours and repeat on days 2 and 3.", "Remove cooling at least 15 minutes before Totect and follow product-specific dose caps/renal adjustment; do not substitute topical DMSO in the same area unless the protocol explicitly directs it."],
      nursingEssentials: ["Mark, photograph, and measure the site; document drug, concentration, estimated volume, and time; aspirate without flushing; and notify oncology or pharmacy immediately because accurate extent and timing determine antidote eligibility and reveal progressive tissue injury that needs surgical or wound follow-up.", "Verify opposite-limb infusion, renal adjustment, and daily dose because administration errors can expose injured tissue or increase systemic toxicity; monitor marrow and hepatic toxicity because dexrazoxane can suppress blood counts and raise transaminases."],
      keyLabs: ["CBC, renal/liver function, site pain/erythema/swelling/blistering/necrosis, limb neurovascular status and infection."],
      adverseEffects: ["Myelosuppression, infection, nausea/vomiting, transaminase elevation, infusion reaction and interference with chemotherapy effect."],
      contraindications: ["Product, indication, and timing must be exact because dexrazoxane formulations and evidence are indication-specific. Pregnancy or fetal risk and severe organ dysfunction require oncology guidance because dose or exposure risk may change, but this should not cause avoidable delay after anthracycline extravasation."],
      escalationRecurrence: ["Progressive pain, blistering, ulceration, compartment/neurovascular change or necrosis requires urgent plastic/hand/wound surgery evaluation despite antidote."],
      evidenceLimitations: ["Evidence and labeling are specific to anthracycline extravasation; dexrazoxane does not treat every vesicant."],
      nclexTraps: ["Do not flush an anthracycline extravasation.", "Totect must begin within six hours and uses the opposite limb."],
      sourceKeys: ["dailymed-dexrazoxane"]
    }),

    makeCard({
      name: "Cyproheptadine",
      generic: "cyproheptadine",
      aliases: ["Periactin", "serotonin syndrome antidote", "serotonin toxicity antidote", "5-HT2A antagonist", "cyproheptadin", "cyproheptadine for serotonin syndrome"],
      brandExamples: ["Periactin"],
      class: "Oral first-generation H1 and 5-HT2A antagonist used as an adjunct in serotonin toxicity",
      usedToTreat: "Adjunctive treatment of persistent moderate-to-severe serotonin toxicity after serotonergic drugs are stopped and airway, sedation, cooling and circulation are addressed.",
      description: "Cyproheptadine is oral/enteral only and cannot replace rapid benzodiazepine sedation, active cooling, paralysis/intubation for extreme hyperthermia or treatment of complications. Its sedation and antimuscarinic effects can also cloud serial examination.",
      mechanism: "Competitive 5-HT2A blockade reduces serotonin-driven neuromuscular/autonomic excitation; H1 and antimuscarinic blockade cause sedation, dry mouth and urinary/GI effects. Because severe hyperthermia comes from muscle activity rather than a hypothalamic fever set point, antipyretics do not fix it.",
      administrationTiming: ["Give by mouth or enteral tube using a loading and repeat/maintenance schedule under toxicology protocol; it is not available IV.", "Continue only while clinically needed and monitor for recurrence from long-acting serotonergic agents."],
      nursingEssentials: ["Stop serotonergic drugs, use benzodiazepines for agitation/clonus, cool actively, give IV fluids and trend temperature, rigidity, clonus, mental status, BP and ECG.", "Screen for antimuscarinic burden because cyproheptadine can worsen delirium, urinary retention, ileus, and impaired heat dissipation; assess aspiration risk and enteral access or absorption because an oral or NG adjunct cannot help when airway protection or gut delivery is unreliable."],
      keyLabs: ["Trend temperature, CK, creatinine, potassium, bicarbonate, pH, lactate, ECG, and urine output because sustained clonus and rigidity drive hyperthermia and rhabdomyolysis, leading to hyperkalemia and kidney injury; monitor urine output because falling output can signal evolving renal injury."],
      adverseEffects: ["Sedation, confusion, antimuscarinic delirium, dry mouth, urinary retention, ileus, blurred vision and hypotension."],
      contraindications: ["Enteral inaccessibility/ileus, significant antimuscarinic toxicity, narrow-angle glaucoma or urinary obstruction are important cautions; severe serotonin toxicity still requires supportive critical care."],
      escalationRecurrence: ["Temperature near/above 41 C, severe rigidity, seizure, shock, dysrhythmia or organ injury requires ICU paralysis/intubation and aggressive cooling, not delayed enteral antidote alone."],
      evidenceLimitations: ["Use for serotonin toxicity is off-label and supported mainly by case-level/observational evidence; clinical benefit is less certain than supportive care."],
      nclexTraps: ["Cyproheptadine is an adjunct, not the first ABC/cooling step.", "Antipyretics do not correct serotonin hyperthermia caused by muscle activity."],
      sourceKeys: ["aha-toxicology-2025", "poison-help"]
    }),

    makeCard({
      name: "Dextrose 50%",
      generic: "dextrose 50 percent",
      aliases: ["D50", "D50W", "50 percent dextrose", "IV glucose", "insulin overdose antidote", "severe hypoglycemia IV treatment", "dextros 50"],
      class: "Hypertonic intravenous glucose rescue",
      usedToTreat: "Severe symptomatic hypoglycemia when IV access is available, including insulin or secretagogue poisoning as part of a cause-specific glucose strategy.",
      description: "D50 raises glucose quickly but is highly hypertonic and can cause devastating extravasation. It treats the low glucose measurement, not ongoing insulin secretion; long-acting insulin or sulfonylurea toxicity can cause repeated hypoglycemia after the initial response.",
      mechanism: "Infused glucose immediately supplies substrate to brain and other tissues for ATP production. It does not remove insulin or block a sulfonylurea-stimulated beta cell, explaining recurrence and the role of octreotide for secretagogue poisoning.",
      administrationTiming: ["Confirm a patent IV and give the protocol-selected concentration/dose; many settings use more dilute dextrose for children or peripheral access to reduce osmotic injury.", "Recheck glucose and mental status promptly, then continue infusion/nutrition and observation matched to the causative drug."],
      nursingEssentials: ["Do not give oral carbohydrate to an unconscious or unsafe-swallow patient; protect airway and use glucagon if IV access is unavailable while access is obtained.", "Continuously inspect the IV site because hypertonic D50 extravasation can cause tissue necrosis; use independent concentration checks to prevent dosing errors, and identify the insulin type, sulfonylurea, renal failure, alcohol, sepsis, or missed nutrition because ongoing insulin action or impaired clearance can drive recurrent hypoglycemia."],
      keyLabs: ["Frequent bedside glucose, potassium, renal/hepatic function, cortisol/cause-directed studies and neurologic/airway reassessment."],
      adverseEffects: ["Extravasation necrosis, phlebitis, hyperglycemia, rebound hypoglycemia, hypokalemia, fluid/osmotic shifts and thiamine-demand concerns in severe malnutrition."],
      contraindications: ["No contraindication should delay IV glucose in life-threatening documented hypoglycemia, but access/concentration safety and thiamine administration in high-risk malnutrition must be addressed."],
      escalationRecurrence: ["Recurrent sulfonylurea hypoglycemia requires octreotide/toxicology; recurrent long-acting insulin toxicity may require prolonged dextrose, nutrition, ICU monitoring and electrolyte replacement."],
      evidenceLimitations: ["Dextrose concentration and dose vary by age, access and protocol; D50 is not automatically the safest formulation for every patient."],
      nclexTraps: ["The 15-15 oral rule is for an awake safe-swallow patient.", "One normal glucose does not end observation after long-acting insulin or sulfonylurea exposure."],
      sourceKeys: ["aha-toxicology-2025", "poison-help"]
    }),

    makeCard({
      name: "Oxygen and hyperbaric oxygen for carbon monoxide poisoning",
      generic: "oxygen and hyperbaric oxygen for carbon monoxide poisoning",
      aliases: ["100 percent oxygen", "high flow oxygen", "carbon monoxide antidote", "CO poisoning oxygen", "normobaric oxygen", "oxygen for smoke inhalation", "HBO", "HBOT", "hyperbaric oxygen", "hyperbaric chamber", "carbon monoxide hyperbaric oxygen", "CO chamber treatment", "hyperbaric oxigen"],
      class: "Immediate high-concentration oxygen and specialist-selected pressurized oxygen therapy",
      usedToTreat: "Suspected or confirmed carbon-monoxide poisoning immediately with 100% normobaric oxygen; selected severe cases also receive time-sensitive hyperbaric consultation based on neurologic, cardiac, acid-base, pregnancy, exposure and transport factors.",
      description: "Carbon monoxide binds hemoglobin and cellular heme proteins, impairing oxygen transport and use. Pulse oximetry cannot distinguish oxyhemoglobin from carboxyhemoglobin and may look normal. High-concentration oxygen accelerates carbon-monoxide dissociation; hyperbaric oxygen raises dissolved plasma oxygen further, but referral is a clinical decision because evidence and thresholds are heterogeneous.",
      mechanism: "Raising alveolar oxygen creates a partial-pressure gradient that competitively displaces carbon monoxide from hemoglobin and improves dissolved oxygen delivery. Hyperbaric pressure increases dissolved oxygen by Henry's law and further accelerates elimination. Neither approach instantly reverses cellular injury, which explains continued cardiac and neurologic monitoring after the carboxyhemoglobin level falls.",
      administrationTiming: ["Remove the patient from exposure and give 100% oxygen by an effective high-flow device immediately; intubate and ventilate if airway or consciousness requires it. Draw co-oximetry without delaying oxygen.", "Continue normobaric oxygen during stabilization and transport. Contact a hyperbaric center early for loss of consciousness, persistent neurologic findings, cardiac ischemia, severe acidosis, high-risk pregnancy or other severe features; do not delay airway, trauma, burn or cyanide treatment to arrange chamber transfer."],
      nursingEssentials: ["Assess every co-exposed person, pregnancy, syncope, chest pain, neurologic findings, smoke/cyanide injury and fire-related trauma. Use co-oximetry because ordinary pulse oximetry can be falsely reassuring.", "Before chamber transfer, screen for untreated pneumothorax, pressure-equalization problems, unstable airway/equipment and transport risk. Explain that delayed cognitive, mood, gait or other neurologic symptoms can appear after apparent recovery."],
      keyLabs: ["Carboxyhemoglobin by co-oximetry with the sample time and prior oxygen documented, ECG/troponin, pH/lactate, glucose, pregnancy/fetal assessment and serial neurologic examination; chest imaging when pneumothorax is possible."],
      adverseEffects: ["Prolonged high oxygen can cause absorption atelectasis or oxygen toxicity. Hyperbaric treatment can cause ear/sinus/pulmonary barotrauma, oxygen seizure, transient myopia, confinement anxiety, hypoglycemia and harm from transport delay."],
      contraindications: ["No contraindication should delay immediate normobaric oxygen for suspected significant poisoning. Untreated pneumothorax is a major contraindication to hyperbaric treatment; other chamber risks are weighed by the hyperbaric specialist against poisoning severity."],
      escalationRecurrence: ["Syncope, persistent neurologic deficit, cardiac ischemia/dysrhythmia, severe acidosis, pregnancy concern or persistent symptoms requires urgent hyperbaric consultation and monitored care. Delayed neurologic symptoms days to weeks later require prompt reassessment and follow-up."],
      evidenceLimitations: ["Carboxyhemoglobin correlates imperfectly with symptoms and outcome. Hyperbaric trials and referral thresholds are heterogeneous, so describe it as specialist-selected therapy rather than mandatory treatment based on one number."],
      nclexTraps: ["A normal pulse oximeter does not exclude carbon-monoxide poisoning.", "Start 100% oxygen before arranging hyperbaric treatment; draw carboxyhemoglobin without delaying oxygen."],
      sourceKeys: ["cdc-carbon-monoxide", "aha-toxicology-2025", "poison-help"]
    }),

    makeCard({
      name: "Diphtheria antitoxin",
      generic: "diphtheria antitoxin equine",
      aliases: ["DAT", "diphtheria antidote", "diphtheria toxin antitoxin", "equine diphtheria antitoxin", "diphtheria antiserum", "diptheria antitoxin"],
      class: "Equine antibody antitoxin for respiratory diphtheria",
      usedToTreat: "Suspected respiratory diphtheria after immediate public-health consultation, without waiting for culture confirmation; antibiotics and isolation are also required.",
      description: "Diphtheria toxin that has entered cells irreversibly ADP-ribosylates elongation factor 2 and stops protein synthesis. Antitoxin binds only circulating toxin, so delay permits more myocardium and nerves to be injured even when throat findings appear localized.",
      mechanism: "Equine antibodies neutralize extracellular toxin before receptor binding/internalization. They cannot reach intracellular toxin or reverse established myocarditis/neuropathy, explaining early empirical treatment and prolonged complication monitoring.",
      administrationTiming: ["Contact the health department/CDC immediately for release and dose guidance; give as soon as clinical suspicion supports treatment and collect cultures without delaying antitoxin.", "Administer with equine-protein hypersensitivity testing/preparation according to the public-health protocol."],
      nursingEssentials: ["Use droplet isolation, protect airway without disturbing an adherent pseudomembrane, obtain cultures and give erythromycin/penicillin as directed.", "Continuously monitor ECG/cardiac status and later cranial/peripheral neuropathy; treat contacts and vaccination gaps through public health."],
      keyLabs: ["Throat/nasal cultures and toxin testing, ECG/troponin, CBC/chemistry, renal/hepatic function and serial neurologic assessment."],
      adverseEffects: ["Anaphylaxis/infusion reaction, fever, rash and delayed serum sickness from equine protein."],
      contraindications: ["Equine-protein hypersensitivity increases reaction risk but does not outweigh untreated respiratory diphtheria without expert risk-benefit management."],
      escalationRecurrence: ["Airway obstruction, myocarditis/dysrhythmia, heart failure or neuropathic respiratory weakness requires ICU care; antitoxin cannot reverse toxin already internalized."],
      evidenceLimitations: ["U.S. access is public-health mediated and epidemiology changes; antibiotics stop bacterial production/transmission but do not neutralize toxin already present."],
      nclexTraps: ["Do not wait for culture before antitoxin when respiratory diphtheria is suspected.", "Antibiotics and antitoxin do different jobs."],
      sourceKeys: ["cdc-diphtheria"]
    }),

    makeCard({
      name: "Activated charcoal",
      generic: "activated charcoal",
      aliases: ["activated carbon", "single-dose activated charcoal", "multiple-dose activated charcoal", "charcoal for overdose", "poison charcoal", "activated charcol"],
      class: "Gastrointestinal adsorbent decontamination therapy",
      usedToTreat: "Selected recent oral poisonings when the substance binds charcoal, the expected benefit is meaningful and the airway/GI tract are safe. It is a decontaminant, not a systemic antidote.",
      description: "Activated charcoal is a gastrointestinal adsorbent decontamination therapy that adsorbs selected poisons onto a large porous surface and reduces absorption. Benefit is usually greatest when it is given early, but later or repeated use can be reasonable for delayed-release drugs, slowed gastric emptying or toxins with enterohepatic or enteroenteric circulation. Aspiration can be more dangerous than the poison, so an unprotected airway is a major stop signal.",
      mechanism: "Its enormous porous surface adsorbs many organic molecules in the gut, lowering free drug available for absorption. Multiple doses can maintain a gut concentration gradient and interrupt recirculation for selected toxins. Metals, alcohols, caustics and many hydrocarbons bind poorly or create disproportionate aspiration/procedure risk.",
      administrationTiming: ["Call Poison Help before use. Give the protocol weight-based oral/NG dose only when toxin, time and airway fit; do not induce vomiting.", "Use multiple-dose charcoal only for selected toxins with intact bowel function and intensive fluid/electrolyte monitoring."],
      nursingEssentials: ["Verify substance, formulation, time, mental status, airway protection, vomiting, bowel function, and planned endoscopy because a nonbinding toxin offers no adsorption benefit, while depressed consciousness, vomiting, ileus, obstruction, or planned endoscopy can make aspiration, perforation, or procedural delay outweigh benefit.", "Position the patient and keep suction ready to reduce aspiration risk; document expected black stool so that it is not mistaken for, or allowed to mask, GI bleeding."],
      keyLabs: ["Exposure-specific drug levels, ECG, glucose, electrolytes, renal/hepatic function, bowel function and respiratory assessment after vomiting/aspiration."],
      adverseEffects: ["Vomiting, aspiration pneumonitis/ARDS, constipation, ileus, bowel obstruction or perforation, hypernatremia/dehydration with cathartic products and impaired absorption of needed medications."],
      contraindications: ["Unprotected airway, GI perforation/obstruction/ileus, high aspiration risk, caustic ingestion when endoscopy is needed, and hydrocarbons with low systemic toxicity/high aspiration risk. Poorly adsorbed metals/alcohols are not useful targets."],
      escalationRecurrence: ["Deteriorating airway, persistent vomiting, ileus, aspiration or a toxin needing dialysis/antidote requires emergency escalation; charcoal never replaces definitive therapy."],
      evidenceLimitations: ["Routine outcome benefit is not established for every overdose; poison-center selection is essential."],
      nclexTraps: ["Never give charcoal automatically to an unconscious patient.", "Charcoal does not bind every poison and is not the antidote itself."],
      sourceKeys: ["aha-toxicology-2025", "dailymed-charcoal", "poison-help"]
    })
  ];

  const retiredShadowMap = new Map([
    [normalize("Vitamin K phytonadione"), normalize("Phytonadione")],
    [normalize("Prothrombin complex concentrate"), normalize("Four factor prothrombin complex concentrate")]
  ]);
  const identityKeys = (drug) => unique([drug && drug.generic, drug && drug.displayName, drug && drug.name])
    .map(normalize)
    .filter(Boolean);
  const cardTargetByIdentity = new Map();
  cards.forEach((card) => {
    const target = normalize(card.name);
    identityKeys(card).forEach((identity) => cardTargetByIdentity.set(identity, target));
  });
  const resolveTarget = (drug) => {
    const identities = identityKeys(drug);
    for (const identity of identities) {
      if (retiredShadowMap.has(identity)) return retiredShadowMap.get(identity);
    }
    for (const identity of identities) {
      if (cardTargetByIdentity.has(identity)) return cardTargetByIdentity.get(identity);
    }
    return "";
  };
  const priorByTarget = new Map();

  db.drugs.forEach((drug) => {
    const target = resolveTarget(drug);
    if (!target) return;
    if (!priorByTarget.has(target)) priorByTarget.set(target, []);
    priorByTarget.get(target).push(drug);
  });

  const mergedCards = cards.map((card) => {
    const key = normalize(card.name);
    const priors = priorByTarget.get(key) || [];
    const merged = Object.assign({}, ...priors, card);
    merged.name = card.name;
    merged.generic = card.generic;
    merged.displayName = card.name;
    merged.aliases = unique([...priors.flatMap((item) => item.aliases || []), ...(card.aliases || [])]);
    merged.brandExamples = unique([...priors.flatMap((item) => item.brandExamples || []), ...(card.brandExamples || [])]);
    merged.categories = unique([...priors.flatMap((item) => item.categories || []), ...(card.categories || []), TOX_CATEGORY]);
    merged.tags = unique([...priors.flatMap((item) => item.tags || []), ...(card.tags || [])]).filter((tag) => !/generated-placeholder/i.test(String(tag)));
    merged.sourceKeys = card.sourceKeys;
    merged.sourceNote = card.sourceNote;
    merged.antidoteWave26Revision = VERSION;
    return merged;
  });

  db.drugs = db.drugs.filter((drug) => !resolveTarget(drug));
  db.drugs.push(...mergedCards);

  const cardNames = cards.map((card) => card.name);
  const newCardNames = [
    "Antidotes and toxicologic rescue therapies",
    "Sodium nitrite and sodium thiosulfate",
    "Pyridoxine",
    "Calcium disodium EDTA",
    "Prussian blue",
    "Calcium DTPA and zinc DTPA",
    "Botulism immune globulin intravenous",
    "ANAVIP",
    "Anascorp",
    "Uridine triacetate",
    "Dexrazoxane",
    "Diphtheria antitoxin"
  ];
  const upgradedCardNames = cardNames.filter((name) => !newCardNames.includes(name));
  const highRiskNames = [
    "Acetylcysteine", "Flumazenil", "Fomepizole", "Digoxin immune Fab", "Hydroxocobalamin",
    "Sodium nitrite and sodium thiosulfate", "High-dose insulin euglycemia therapy",
    "Sodium bicarbonate", "Intravenous lipid emulsion", "Pyridoxine",
    "Four factor prothrombin complex concentrate", "Idarucizumab", "Andexanet alfa",
    "Uridine triacetate", "Dexrazoxane"
  ];

  window.ANI_ANTIDOTE_WAVE26 = {
    version: VERSION,
    cardNames,
    newCardNames,
    upgradedCardNames,
    highRiskNames,
    retiredShadowNames: ["Vitamin K phytonadione", "Prothrombin complex concentrate"],
    sourceRefs,
    routingTargets: cardNames.slice(),
    counts: {
      cards: cardNames.length,
      newCards: newCardNames.length,
      upgradedCards: upgradedCardNames.length,
      sources: Object.keys(sourceRefs).length,
      retiredShadows: retiredShadowMap.size
    }
  };
}());
