/* eslint-disable */
/* Wave 28: missing antidotes, antitoxins, decontamination, and toxin-removal rescue therapies. */
(function () {
  "use strict";

  window.ANI_PHARM_DATABASE = window.ANI_PHARM_DATABASE || {};
  const db = window.ANI_PHARM_DATABASE;
  db.drugs = Array.isArray(db.drugs) ? db.drugs : [];

  const VERSION = "2026-07-18-antidote-expansion-v1";
  const SCHEMA_VERSION = 1;
  const TOX_CATEGORY = "Toxicology, Antidotes, Reversal Agents";
  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const unique = (values) => Array.from(new Set((values || []).filter(Boolean)));
  const primaryName = (drug) => String(drug && (drug.displayName || drug.name || drug.generic) || "");

  const sourceRefs = Object.freeze({
    "dailymed-dantrolene": { label: "DailyMed dantrolene sodium for injection prescribing information", url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=ab0efc75-0598-4f4e-91ad-6195bb2661fe" },
    "fda-ki": { label: "FDA potassium iodide radiation-emergency questions and answers", url: "https://www.fda.gov/drugs/bioterrorism-and-drug-preparedness/frequently-asked-questions-potassium-iodide-ki" },
    "cdc-ki": { label: "CDC how potassium iodide works", url: "https://www.cdc.gov/radiation-emergencies/infographic/potassium-iodide.html" },
    "aact-wbi": { label: "AACT/EAPCCT position paper update on whole bowel irrigation", url: "https://www.clintox.org/wp-content/uploads/2016/04/Position-Statement-Whole-Bowel-Irrigation-1.pdf" },
    "extrip-index": { label: "EXTRIP executive recommendations index", url: "https://www.extrip-workgroup.org/recommendations" },
    "extrip-methanol": { label: "EXTRIP methanol recommendations", url: "https://www.extrip-workgroup.org/methanol" },
    "extrip-ethylene-glycol": { label: "EXTRIP ethylene glycol recommendations", url: "https://www.extrip-workgroup.org/ethylene-glycol" },
    "extrip-salicylates": { label: "EXTRIP salicylate recommendations", url: "https://www.extrip-workgroup.org/salicylates" },
    "extrip-lithium": { label: "EXTRIP lithium recommendations", url: "https://www.extrip-workgroup.org/lithium" },
    "extrip-metformin": { label: "EXTRIP metformin recommendations", url: "https://www.extrip-workgroup.org/metformin" },
    "extrip-valproate": { label: "EXTRIP valproic-acid recommendations", url: "https://www.extrip-workgroup.org/valproic-acid" },
    "cdc-hf": { label: "CDC hydrogen-fluoride chemical emergency fact sheet", url: "https://www.cdc.gov/chemical-emergencies/chemical-fact-sheets/hydrogen-fluoride.html" },
    "atsdr-hf": { label: "ATSDR hydrogen-fluoride medical management guidelines", url: "https://wwwn.cdc.gov/TSP/MMG/MMGDetails.aspx?mmgid=1142&toxid=250" },
    "cdc-tetanus": { label: "CDC clinical care of tetanus", url: "https://www.cdc.gov/tetanus/hcp/clinical-care/index.html" },
    "dailymed-phentolamine": { label: "DailyMed phentolamine mesylate prescribing information", url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e146c7ee-d2fa-433c-8768-0945e4ff0990" },
    "dailymed-aubagio": { label: "DailyMed Aubagio teriflunomide prescribing information", url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=4650d12c-b9c8-4525-b07f-a2d773eca155&version=28" },
    "dailymed-leflunomide": { label: "DailyMed leflunomide prescribing information", url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=0a4f8671-b632-4cc5-8dc9-6b863e62b467&type=display" },
    "fda-raxibacumab": { label: "FDA 2021 raxibacumab prescribing information with boxed hypersensitivity warning", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2021/125349s026lbl.pdf" },
    "dailymed-anthim": { label: "DailyMed Anthim obiltoxaximab prescribing information", url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=39ad8799-00a4-4fc8-9852-c0536350c474" },
    "dailymed-anthrasil": { label: "DailyMed Anthrasil prescribing information", url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=97cc9a89-6fe0-424e-82d1-0cf9d19444db&version=4" },
    "cdc-anthrax": { label: "CDC guidelines for prevention and treatment of anthrax", url: "https://www.cdc.gov/mmwr/volumes/72/rr/rr7206a1.htm" },
    "dailymed-latrodectus": { label: "DailyMed Antivenin Latrodectus mactans prescribing information", url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=600e54ad-af13-462f-8a2d-2c3f7d91a8cd" },
    "fda-coral": { label: "FDA coral-snake antivenin lot CL6814 expiration extension through December 31, 2026", url: "https://www.fda.gov/vaccines-blood-biologics/safety-availability-biologics/expiration-date-extension-north-american-coral-snake-antivenin-micrurus-fulvius-equine-origin-lot-1" },
    "poison-help": { label: "U.S. Poison Help", url: "https://poisonhelp.hrsa.gov/faq/calling-poison-help" }
  });

  Object.entries(sourceRefs).forEach(([key, ref]) => {
    if (!ref || !ref.label || !/^https:\/\//i.test(ref.url || "")) {
      throw new Error("Invalid Wave28 antidote source reference: " + key);
    }
  });

  const sourceNoteFor = (keys) => unique(keys).map((key) => {
    const ref = sourceRefs[key];
    return ref ? ref.label + " (" + ref.url + ")" : "";
  }).filter(Boolean).join("; ");

  const makeCard = (spec) => {
    const sourceKeys = unique(spec.sourceKeys || ["poison-help"]);
    sourceKeys.forEach((key) => {
      if (!sourceRefs[key]) throw new Error("Unknown Wave28 source key " + key + " for " + spec.name);
    });
    return {
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
      boxedWarning: spec.boxedWarning || "No single warning substitutes for exposure-specific risk assessment, resuscitation, and poison-center or specialist guidance.",
      sourceKeys,
      sourceNote: sourceNoteFor(sourceKeys),
      tags: unique(["frontier-wave28", "antidote expansion", "toxicology", "causal why closure", ...(spec.tags || [])]),
      nclexEssential: spec.nclexEssential !== false,
      confidenceTier: "Curated full study card",
      studentFacing: true,
      hidden: false,
      antidoteWave28Revision: VERSION
    };
  };

  const cards = [
    makeCard({
      name: "Dantrolene",
      generic: "dantrolene sodium",
      aliases: ["Dantrium", "Ryanodex", "Revonto", "malignant hyperthermia antidote", "MH antidote", "dantrolene sodium injection", "dantroline", "dantroline"],
      brandExamples: ["Dantrium", "Ryanodex", "Revonto"],
      class: "Ryanodine-receptor skeletal-muscle calcium-release inhibitor and malignant-hyperthermia antidote",
      usedToTreat: "A suspected malignant-hyperthermia crisis caused by volatile anesthetics or succinylcholine, alongside immediate trigger removal, high-flow oxygen, cooling when indicated, electrolyte and acid-base correction, and organ support. Oral dantrolene for chronic spasticity is a different use with different dosing and risk balance.",
      description: "Dantrolene is a ryanodine-receptor skeletal-muscle calcium-release inhibitor that treats malignant hyperthermia by reducing the uncontrolled cytosolic calcium that drives rigidity and hypermetabolism. Malignant hyperthermia is a runaway skeletal-muscle energy crisis in which sustained actin-myosin cycling consumes ATP and oxygen, generates carbon dioxide and heat, and releases potassium and muscle contents. Prepare dantrolene as soon as the syndrome is suspected rather than waiting for a late temperature rise or confirmatory test. Stopping the trigger and treating hyperkalemia, acidosis, rhabdomyolysis, hyperthermia, and dysrhythmia remain equally urgent because dantrolene cannot instantly undo injury already produced.",
      mechanism: "Dantrolene acts in skeletal muscle at the type-1 ryanodine receptor (RyR1) calcium-release pathway, reducing calcium release from the sarcoplasmic reticulum. Lower cytosolic calcium interrupts sustained cross-bridge cycling and therefore reduces rigidity, oxygen consumption, carbon-dioxide production, heat generation, potassium release, and muscle breakdown. It does not directly block cardiac excitation-contraction coupling to the same degree and is not an antipyretic, which explains why response is judged by falling end-tidal carbon dioxide, improving rigidity, temperature and metabolic status rather than temperature alone.",
      administrationTiming: ["Stop triggering agents, call for the malignant-hyperthermia cart and help, hyperventilate with 100% oxygen, and give the stocked IV formulation according to its own labeled reconstitution, loading, repeat-dose, and cumulative-dose instructions; formulations are not volume-for-volume interchangeable.", "Continue monitored treatment and recurrence surveillance under the active malignant-hyperthermia protocol because recrudescence can follow initial improvement."],
      nursingEssentials: ["Assign parallel roles for dantrolene reconstitution, airway/ventilation, cooling, laboratory collection, urine-output protection, medication documentation, and communication because the number of vials and preparation steps can otherwise delay definitive treatment.", "Trend end-tidal carbon dioxide, core temperature, rigidity, ECG, blood pressure, urine output and urine color continuously or frequently; falling ETCO2 is an early mechanistic response, while dark urine or falling output can signal myoglobin-associated kidney injury.", "Avoid routine calcium-channel blockers during dantrolene treatment because dangerous hyperkalemia and cardiovascular collapse have been reported with the combination; use the crisis protocol for dysrhythmias."],
      keyLabs: ["Serial blood gases, potassium, ionized calcium, CK, creatinine, lactate, glucose, coagulation studies, urinalysis/myoglobin, liver tests and frequent core temperature because metabolic injury evolves after the trigger stops.", "Document the anesthetic timeline, earliest ETCO2 change, every dantrolene dose/formulation, cooling intervention, fluid balance and response so recurrence and cumulative dosing can be interpreted safely."],
      adverseEffects: ["Muscle weakness, respiratory weakness, phlebitis, nausea and tissue injury after extravasation can occur; weakness matters most when the patient is already ventilator-dependent.", "Repeated or chronic exposure can cause hepatotoxicity; acute crisis treatment should not be withheld for this longer-term risk, but subsequent liver assessment is appropriate."],
      contraindications: ["There is no ordinary contraindication that should delay dantrolene during a life-threatening malignant-hyperthermia crisis; manage hypersensitivity and treatment simultaneously if necessary.", "Do not substitute oral capsules for IV crisis treatment or assume different IV formulations use the same dilution volume or preparation time."],
      interactions: ["Avoid verapamil and other calcium-channel blockers during acute dantrolene treatment unless a malignant-hyperthermia expert directs otherwise because severe hyperkalemia and cardiovascular collapse are a recognized interaction concern."],
      escalationRecurrence: ["Persistent hypercapnia, rigidity, hyperthermia, hyperkalemia, acidosis, dysrhythmia, shock, oliguria or rising CK requires immediate repeat protocol treatment and critical-care escalation.", "Recurrent metabolic findings after initial control require renewed trigger review, further labeled dantrolene under expert guidance, and extended intensive monitoring."],
      evidenceLimitations: ["Product concentration, reconstitution and labeled dosing differ among formulations. This entry explains the mechanism and safety checks, while the stocked-product label and institutional malignant-hyperthermia protocol control bedside preparation."],
      nclexTraps: ["A rapid rise in ETCO2 and rigidity can precede extreme fever; do not wait for a high temperature.", "Dantrolene treats the calcium-release mechanism, but trigger removal, oxygenation, cooling, potassium/acidosis treatment and renal protection still occur in parallel."],
      sourceKeys: ["dailymed-dantrolene", "poison-help"]
    }),

    makeCard({
      name: "Potassium iodide for radioiodine thyroid blocking",
      generic: "potassium iodide",
      aliases: ["KI", "radioactive iodine blocker", "radioiodine thyroid blocking", "radiation iodine pill", "iOSAT", "ThyroSafe", "SSKI radiation emergency", "potasium iodide", "potassium iodine radiation"],
      brandExamples: ["iOSAT", "ThyroSafe"],
      class: "Stable-iodine thyroid-blocking medical countermeasure",
      usedToTreat: "Prevention or reduction of thyroid uptake of radioactive iodine after a qualifying release, only when public-health or emergency-management officials direct its use. It does not treat external radiation exposure, acute radiation syndrome, or contamination by other radionuclides.",
      description: "Potassium iodide is a stable-iodine thyroid-blocking countermeasure that saturates the thyroid's iodine transport and storage capacity, reducing thyroid uptake and radiation dose from radioactive iodine when public-health officials direct its use. The thyroid normally concentrates iodine to make hormone and cannot distinguish radioactive iodine from stable iodine, so timing KI before or soon after exposure is what creates protection. That protection is narrow: KI does not stop radioiodine from entering the body, shield other organs, remove material already incorporated into thyroid tissue, or replace sheltering, evacuation and food controls. Taking it without a radioiodine threat adds thyroid and hypersensitivity risk without benefit.",
      mechanism: "A large stable-iodide load acutely saturates thyroid iodide transport and organification, producing thyroid blockade for roughly a day. Less radioactive iodide is therefore trapped and retained in thyroid tissue, and more remains available for elimination. Timing matters because uptake begins soon after exposure; late administration cannot reverse radiation injury already delivered. Age and pregnancy matter because children, fetuses and neonates have greater thyroid-cancer susceptibility but also greater risk of KI-induced thyroid dysfunction.",
      administrationTiming: ["Use only an FDA-approved KI product and only after an official instruction identifies a radioiodine risk. Follow the age-, weight-, pregnancy- and exposure-specific FDA dose rather than improvising from adult tablets or iodine supplements.", "One dose generally protects for about 24 hours. Repeat dosing is controlled by public-health instructions; pregnant people and neonates require special caution because repeated blockade can suppress fetal or neonatal thyroid function."],
      nursingEssentials: ["Confirm the event involves radioactive iodine, the official instruction, patient age/weight, pregnancy or lactation, thyroid disease, iodine-drug sensitivity and the exact product strength before administration.", "Explain that shellfish allergy alone does not prove iodide allergy and that iodized salt, kelp and dietary supplements are not substitutes; this prevents ineffective or harmful self-treatment.", "For neonates or repeated exposure, arrange thyroid-function follow-up as directed because transient hypothyroidism can impair neurodevelopment if it is missed."],
      keyLabs: ["No laboratory result should delay an official population-protection instruction, but TSH and free T4 monitoring may be required in neonates, pregnancy or repeated dosing and in people with significant thyroid disease.", "Document dose, product strength, time relative to plume/exposure, official directive, pregnancy/lactation status and any adverse reaction."],
      adverseEffects: ["Rash, gastrointestinal upset, salivary-gland swelling and iodism can occur; serious hypersensitivity is uncommon but requires emergency care.", "Hypothyroidism or hyperthyroidism can occur, especially with repeated dosing, neonatal exposure, multinodular goiter, Graves disease or autoimmune thyroid disease."],
      contraindications: ["Do not use KI for a dirty bomb or radiation event unless radioactive iodine is involved and officials recommend it, because KI saturates only thyroid iodine handling and cannot shield the body from other radionuclides or external radiation.", "Known iodide hypersensitivity, dermatitis herpetiformis, hypocomplementemic vasculitis and selected thyroid/cardiac conditions require official risk-benefit guidance rather than unsupervised dosing."],
      escalationRecurrence: ["Airway swelling, wheeze, severe rash, cardiovascular symptoms or acute thyroid symptoms require emergency evaluation.", "Ongoing radioiodine risk after the first protection window requires renewed public-health instruction, not automatic indefinite daily use."],
      evidenceLimitations: ["Population instructions depend on radionuclide, projected thyroid dose, age and the evolving event. FDA and local emergency-management guidance supersede any fixed reference schedule."],
      nclexTraps: ["KI protects only the thyroid from radioactive iodine; it does not protect the whole body from radiation.", "More KI is not more protective. Use the directed product and dose, and prioritize sheltering, evacuation and food controls."],
      sourceKeys: ["fda-ki", "cdc-ki"]
    }),

    makeCard({
      name: "Whole bowel irrigation with polyethylene glycol-electrolyte solution",
      generic: "polyethylene glycol electrolyte whole bowel irrigation",
      aliases: ["whole bowel irrigation", "WBI", "PEG-ELS decontamination", "PEG electrolyte lavage", "GoLYTELY overdose irrigation", "body packer irrigation", "sustained release overdose bowel irrigation", "whole bowl irrigation"],
      brandExamples: ["GoLYTELY and other balanced PEG-electrolyte lavage products"],
      class: "Selective gastrointestinal decontamination by osmotically balanced intestinal lavage",
      entryType: "drug",
      classCard: false,
      classExampleNames: [],
      usedToTreat: "Selected potentially dangerous ingestions in which tablets, packets or poorly charcoal-bound material may remain in the gut, including some sustained-release or enteric-coated products, substantial iron, lithium or potassium ingestion, and intact illicit-drug packets in body packers.",
      description: "Whole bowel irrigation is a selective gastrointestinal decontamination procedure that removes unabsorbed tablets, packets, or poorly charcoal-bound material by propelling it through the bowel into stool with large volumes of balanced PEG-electrolyte solution. It is not a universal overdose washout: it can help only while a meaningful intraluminal burden remains, and it neither binds toxin nor reverses drug already absorbed. The procedure creates aspiration, vomiting, distention and obstruction risks, and controlled evidence has not shown routine outcome benefit. Selection therefore depends on the substance, formulation, time, imaging or clinical context, airway, bowel function and whether a safer definitive therapy is available.",
      mechanism: "PEG is poorly absorbed and retains water within the intestinal lumen, while balanced electrolytes reduce net salt and water shifts compared with an unbalanced osmotic cathartic. Continuous enteral flow increases luminal volume and propels tablets or packets through the bowel before more drug dissolves and crosses the mucosa. It does not bind toxin, reverse absorbed toxicity or accelerate renal elimination. That distinction explains why bowel clearance can be an endpoint while ECG, drug levels, antidotes and organ support continue independently.",
      administrationTiming: ["Consult Poison Help or a medical toxicologist before starting. Use the age- and protocol-specific PEG-electrolyte rate by mouth or enteral tube only after airway, hemodynamic and gastrointestinal safety are established.", "Continue until the protocol endpoint, commonly clear rectal effluent and clinical confirmation appropriate to the exposure; do not rely on effluent color alone for drug packets or radiopaque material."],
      nursingEssentials: ["Verify substance, formulation, amount, time, packet integrity, bowel sounds, abdominal findings, airway protection, hemodynamics, imaging plan and competing antidote/dialysis needs before preparation.", "Position to reduce aspiration, keep suction available, measure intake/output and stool, reassess abdominal distention, pain, vomiting and respiratory status, and pause/escalate when intolerance suggests ileus, obstruction, perforation or aspiration.", "Do not assume simultaneous activated charcoal remains fully effective because PEG solution can reduce adsorption for some drugs; coordinate timing with toxicology."],
      keyLabs: ["Exposure-specific levels and ECGs remain necessary because WBI does not treat absorbed drug; trend electrolytes, glucose, renal function, acid-base status and fluid balance when irrigation is prolonged or the patient is vulnerable.", "Use imaging when clinically indicated for packets, radiopaque tablets, obstruction or perforation, but never delay resuscitation for a bowel-clearance image."],
      adverseEffects: ["Nausea, vomiting, aspiration, abdominal distention, cramps, electrolyte disturbance and dehydration can occur.", "WBI can worsen ileus, obstruction or perforation; packet rupture during body-packer management can produce abrupt fatal toxicity."],
      contraindications: ["Bowel obstruction, perforation or ileus; hemodynamic instability; uncontrolled vomiting; or a compromised unprotected airway are major contraindications.", "Do not use routinely after every ingestion or when the substance has already been absorbed and no meaningful intraluminal burden remains, because lavage cannot remove systemic toxin and would add aspiration, distention and obstruction risk without a plausible clearance benefit."],
      escalationRecurrence: ["New abdominal rigidity, severe pain, absent bowel function, GI bleeding, respiratory decline, persistent vomiting, hypotension or suspected packet rupture requires immediate cessation and emergency specialty management.", "Worsening systemic toxicity despite bowel clearance requires toxin-specific antidote, enhanced elimination or critical care because WBI acts only inside the gut."],
      evidenceLimitations: ["AACT/EAPCCT found that WBI may be considered for selected exposures but controlled evidence of improved clinical outcomes is lacking. This should remain a toxicologist-selected procedure, not an automatic order set."],
      nclexTraps: ["WBI is not the same as activated charcoal: it physically flushes bowel contents but does not adsorb toxin.", "An unconscious patient without a protected airway is not a candidate merely because the ingestion was large."],
      sourceKeys: ["aact-wbi", "poison-help"]
    }),

    makeCard({
      name: "Extracorporeal treatment for poisoning",
      generic: "extracorporeal treatment for poisoning",
      aliases: ["ECTR poisoning", "dialysis for overdose", "hemodialysis antidote", "toxin removal dialysis", "blood purification toxicology", "hemoperfusion overdose", "CRRT poisoning", "which poisons can be dialyzed"],
      class: "Mechanism-based extracorporeal toxin removal and physiologic rescue overview",
      entryType: "drug",
      classCard: false,
      classExampleNames: [],
      usedToTreat: "Selected severe poisonings when extracorporeal clearance or rapid correction of otherwise refractory acid-base, electrolyte, volume or metabolic injury is expected to improve the risk-benefit balance.",
      description: "Extracorporeal treatment for poisoning is a blood-clearing rescue that removes selected toxins and can rapidly correct life-threatening acid-base, electrolyte, volume, or metabolic derangements. Dialysis is not a generic antidote for every overdose: clearance is greatest when a toxin is small, water soluble, weakly protein bound, has a relatively small distribution volume and remains substantially in blood. Intermittent hemodialysis usually clears a dialyzable toxin fastest and can simultaneously correct acidosis and electrolytes. Continuous therapy is slower but may be used when intermittent dialysis is unavailable or hemodynamics require another plan. A high serum concentration alone is not always enough: symptoms, organ failure, metabolite toxicity, expected natural clearance and response to standard care determine urgency.",
      mechanism: "In hemodialysis, unbound solute diffuses down a concentration gradient across a semipermeable membrane into dialysate; blood and dialysate flow, membrane surface and free toxin concentration determine clearance. Hemofiltration adds convective solvent drag, and hemoperfusion adsorbs toxin onto a cartridge. Tissue redistribution after plasma clearance can cause rebound, while dialysis can also remove antidotes or supportive drugs. These relationships explain serial post-treatment concentrations, antidote adjustment during ECTR and toxin-specific stopping criteria.",
      administrationTiming: ["Call Poison Help, a medical toxicologist and nephrology early when a severe dialyzable exposure is suspected; vascular access and transfer take time, so consultation should precede terminal deterioration.", "Choose modality, intensity, duration, antidote adjustment and stopping endpoints from the toxin-specific EXTRIP recommendation and current patient physiology rather than one universal dialysis threshold."],
      nursingEssentials: ["Time-stamp exposure, formulation, levels, acid-base data, neurologic findings, shock, kidney function, standard therapy and consultation decisions because trends determine when ECTR adds value.", "During treatment, monitor access, circuit, blood pressure, temperature, ECG, glucose, electrolytes, acid-base state, fluid balance and neurologic status; rapid correction can create hypotension or electrolyte shifts even while toxin clearance improves.", "Verify which antidotes and medications require supplemental dosing during or after ECTR and obtain toxin-specific post-treatment levels because the circuit may remove therapy as well as poison."],
      keyLabs: ["Toxin-specific serial concentrations with collection times, blood gas, electrolytes, osmolality/osmol gap when relevant, renal/hepatic function, lactate, glucose and ECG findings.", "Repeat concentrations and clinical assessment after ECTR to detect redistribution rebound; a low immediate post-dialysis level can rise when tissue toxin returns to plasma."],
      adverseEffects: ["Hypotension, bleeding or anticoagulation complications, vascular-access infection or injury, hypothermia, air embolism and electrolyte or acid-base shifts can occur.", "Removing an antidote or ending ECTR before tissue redistribution is complete can permit recurrent toxicity."],
      contraindications: ["No single absolute contraindication applies to every life-threatening dialyzable poisoning; access risk and hemodynamic instability alter modality and require expert risk-benefit decisions.", "Do not dialyze solely because an exposure sounds severe when toxin properties and guideline criteria show little removable intravascular burden."],
      escalationRecurrence: ["Coma, seizure, shock, life-threatening dysrhythmia, refractory acidosis, progressive organ failure or a toxin-specific EXTRIP criterion requires urgent escalation and transfer if local ECTR is unavailable.", "Clinical or concentration rebound after treatment requires renewed toxicology/nephrology review and sometimes another session."],
      evidenceLimitations: ["ECTR evidence is toxin-specific and often observational. EXTRIP recommendations use graded thresholds that must be read in context, not converted into a single generalized rule."],
      nclexTraps: ["Dialysis can correct physiology and remove toxin, but it does not replace ABC support or a mechanism-specific antidote.", "Protein binding and distribution volume matter: the total amount in the body is not the same as the amount accessible in plasma."],
      sourceKeys: ["extrip-index", "poison-help"]
    }),

    makeCard({
      name: "Hemodialysis for methanol and ethylene glycol poisoning",
      generic: "hemodialysis for toxic alcohol poisoning",
      aliases: ["toxic alcohol dialysis", "methanol dialysis", "ethylene glycol dialysis", "antifreeze dialysis", "windshield washer fluid dialysis", "ECTR toxic alcohol", "hemodialysis for glycol poisoning"],
      class: "Extracorporeal removal and acid-base rescue for severe toxic-alcohol poisoning",
      entryType: "drug",
      classCard: false,
      classExampleNames: [],
      usedToTreat: "Severe methanol or ethylene-glycol poisoning when toxin/metabolite burden, acidosis, end-organ injury, kidney impairment or toxin-specific EXTRIP criteria make extracorporeal treatment necessary in addition to alcohol-dehydrogenase blockade.",
      description: "Hemodialysis is an extracorporeal toxin-removal treatment that removes methanol or ethylene glycol and their circulating toxic metabolites while rapidly correcting severe acidosis. Fomepizole or protocol-directed ethanol prevents formation of new toxic metabolites, but it does not remove formate, glycolate or oxalate already produced. Methanol threatens retina and basal ganglia through formate-mediated mitochondrial injury; ethylene glycol causes glycolate acidosis and calcium-oxalate organ injury. The dialysis decision therefore differs by toxin, antidote used, concentration, anion/osmol gap, vision or neurologic findings, kidney function and response to supportive care.",
      mechanism: "Methanol and ethylene glycol are small, water-soluble molecules with low protein binding, making them accessible to a dialysis membrane. Formate and glycolate are also dialyzable. Removing both parent and metabolites shortens the period during which alcohol-dehydrogenase blockade is needed and corrects acidemia that worsens cellular toxin entry and cardiovascular instability. Because fomepizole and ethanol can also be cleared during dialysis, their protocol must be adjusted so metabolism does not restart while ECTR is running.",
      administrationTiming: ["Start alcohol-dehydrogenase blockade promptly when indicated and contact toxicology, nephrology and a receiving center early; do not delay antidote while waiting for a definitive alcohol concentration.", "Use separate current EXTRIP methanol and ethylene-glycol indications, modality preferences and cessation endpoints. Continue the ADH blocker throughout ECTR with the required dialysis adjustment; continue folate therapy for methanol as directed."],
      nursingEssentials: ["Reconstruct substance, concentration, dose, time, co-ingested ethanol, treatment already given, visual symptoms, urine findings and renal status because osmol and anion gaps change over time as parent alcohol becomes acidic metabolite.", "Trend neurologic status, vision, ECG, ventilation, blood pressure, urine output and fluid balance; preserve time-stamped samples without delaying therapy.", "Verify fomepizole or ethanol redosing/infusion changes during ECTR and prevent calcium replacement from being reflexively driven by asymptomatic oxalate-related hypocalcemia without toxicology guidance."],
      keyLabs: ["Serial methanol or ethylene-glycol concentrations, blood gas, bicarbonate, anion gap, measured osmolality/osmol gap, electrolytes, ionized calcium, creatinine, glucose, lactate interpreted for assay interference, urinalysis and ECG.", "For methanol, repeat formal visual/neurologic assessment; for ethylene glycol, follow kidney function, urine output and calcium while recognizing that absence of crystals does not exclude poisoning."],
      adverseEffects: ["ECTR risks include hypotension, access/anticoagulation complications and rapid electrolyte shifts.", "Stopping ADH blockade too early or failing to adjust it during dialysis can allow renewed toxic-metabolite production; premature ECTR cessation can permit rebound."],
      contraindications: ["Hemodynamic instability changes modality and access planning but does not erase the need for toxin removal in life-threatening poisoning.", "Do not use a single concentration threshold interchangeably for both alcohols or ignore which ADH blocker is being used, because methanol and ethylene glycol cause different metabolite injury and EXTRIP thresholds differ by toxin, antidote and clinical context."],
      escalationRecurrence: ["Visual deficit, coma, seizure, severe or persistent acidosis, kidney injury, rising anion gap, shock or a toxin-specific concentration criterion requires immediate ECTR escalation.", "Recurrent acidosis, gap or detectable toxin after stopping requires repeat expert assessment and possibly continued antidote or another ECTR session."],
      evidenceLimitations: ["EXTRIP indications include graded recommendations and different thresholds depending on toxin, antidote and available measurements. Bedside decisions require current toxicology interpretation."],
      nclexTraps: ["Fomepizole blocks metabolism; dialysis removes toxin/metabolites and corrects acidosis. Severe cases may need both.", "A falling osmol gap can mean the parent alcohol has become toxic acid, not that the patient is recovering."],
      sourceKeys: ["extrip-methanol", "extrip-ethylene-glycol", "poison-help"]
    }),

    makeCard({
      name: "Hemodialysis for salicylate poisoning",
      generic: "hemodialysis for salicylate poisoning",
      aliases: ["aspirin overdose dialysis", "salicylate dialysis", "ASA toxicity dialysis", "ECTR aspirin poisoning", "dialysis for tinnitus and acidosis", "hemodialysis salicylates"],
      class: "Extracorporeal salicylate removal and acid-base rescue",
      usedToTreat: "Severe salicylate poisoning with major concentration, altered mental status, new hypoxemia, impaired kidney function, severe acidemia, or failure of bicarbonate and supportive therapy according to current toxin-specific guidance.",
      description: "Hemodialysis is an extracorporeal toxin-removal treatment that removes circulating salicylate and rapidly corrects the acid-base, electrolyte, and volume consequences of severe poisoning. Salicylate uncouples oxidative phosphorylation and drives both respiratory alkalosis and metabolic acidosis. As systemic pH falls, more salicylate becomes nonionized and crosses into brain and other tissues, so clinical deterioration can occur even while a measured level falls. The decision must integrate symptoms, pH, chronicity and kidney function rather than use one concentration in isolation.",
      mechanism: "Only unbound, intravascular salicylate is immediately available to cross a dialysis membrane, but salicylate's distribution and protein binding become more favorable for extracorporeal removal at toxic concentrations. Dialysate clearance lowers plasma salicylate, draws drug back from tissues and supplies bicarbonate to reverse acidemia. Maintaining alkalemia keeps a larger fraction ionized and less able to enter the CNS; that is why bicarbonate therapy continues while dialysis is arranged and between sessions when directed.",
      administrationTiming: ["Begin airway, glucose, potassium and bicarbonate management and call toxicology/nephrology early when severe features appear; do not wait for respiratory failure because intubation and acidemia can abruptly increase CNS salicylate entry.", "Use EXTRIP criteria and current clinical context for initiation and cessation. Intermittent hemodialysis is preferred when feasible, and IV bicarbonate generally continues around ECTR under protocol."],
      nursingEssentials: ["Obtain serial salicylate levels with times and interpret them beside pH, bicarbonate, potassium, kidney function, mental status, oxygen requirement and ingestion formulation because a falling level can coexist with worsening tissue toxicity.", "Maintain ordered glucose even when serum glucose is normal if neuroglycopenia is suspected; replace potassium as directed because hypokalemia prevents effective urine alkalinization.", "If airway control becomes unavoidable, prevent apnea and loss of compensatory hyperventilation by using an experienced team and an alkalemia-preserving plan while ECTR is expedited."],
      keyLabs: ["Serial salicylate concentration, blood gas, bicarbonate, potassium, sodium, glucose, creatinine, urine pH, lactate, ECG and chest assessment for pulmonary edema.", "Continue post-ECTR levels and clinical assessment because delayed absorption, concretions or tissue redistribution can produce recurrence."],
      adverseEffects: ["Dialysis can cause hypotension, access or anticoagulation complications and rapid electrolyte shifts.", "Premature intubation without matching minute ventilation, delayed potassium correction or interruption of alkalinization can accelerate CNS toxicity before dialysis clears the drug."],
      contraindications: ["Do not withhold indicated ECTR solely because one serum level has fallen; symptoms, pH and kidney function may show that tissue risk is increasing.", "Hemodynamic instability requires modality planning, not abandonment of urgent toxin-removal consultation."],
      escalationRecurrence: ["Altered mental status, seizure, new hypoxemia/pulmonary edema, severe acidemia, kidney failure, refractory symptoms or guideline concentration criteria require urgent ECTR.", "A post-treatment rise or recurrent symptoms requires renewed bicarbonate/toxicology management and possible repeat ECTR."],
      evidenceLimitations: ["Thresholds differ for acute versus chronic exposure and kidney function, and clinical decline overrides a falsely reassuring isolated number."],
      nclexTraps: ["Do not intubate casually: loss of compensatory hyperventilation can lower pH and drive salicylate into the brain.", "A declining serum salicylate concentration is not reassuring when mental status, oxygenation or acidemia worsens."],
      sourceKeys: ["extrip-salicylates", "poison-help"]
    }),

    makeCard({
      name: "Hemodialysis for lithium poisoning",
      generic: "hemodialysis for lithium poisoning",
      aliases: ["lithium toxicity dialysis", "lithium overdose hemodialysis", "ECTR lithium", "dialysis for high lithium level", "lithum dialysis", "lithium rebound after dialysis"],
      class: "Extracorporeal lithium removal with rebound surveillance because tissue lithium can redistribute into plasma after dialysis",
      usedToTreat: "Severe lithium poisoning when neurologic or cardiac toxicity, impaired renal elimination, a high concentration, or an excessively prolonged expected clearance meets current EXTRIP criteria.",
      description: "Hemodialysis is an extracorporeal toxin-removal treatment that rapidly removes plasma lithium in severe poisoning when neurologic or cardiac toxicity, impaired renal clearance, or other EXTRIP criteria make continued exposure dangerous. It lowers plasma lithium by moving the small, non-protein-bound ion across a dialysis membrane down a concentration gradient, while serial post-treatment levels are needed because lithium can redistribute from brain and other tissues and rebound after dialysis stops. Symptoms may therefore lag behind the serum level or persist after it falls. Acute, acute-on-chronic and chronic poisoning are not interchangeable; neurologic findings, renal function and expected time to safe clearance matter as much as the concentration.",
      mechanism: "A steep concentration gradient across the dialysis membrane rapidly removes plasma lithium. Because intracellular and CNS lithium equilibrate more slowly, plasma clearance can temporarily outpace tissue clearance. After treatment, tissue lithium redistributes into blood and creates rebound. Serial levels for at least the toxin-specific observation period therefore determine whether clearance is durable or another session is needed.",
      administrationTiming: ["Stop lithium and drugs that reduce renal clearance, correct volume and sodium deficits carefully, and involve toxicology/nephrology early when neurologic findings, dysrhythmia, renal impairment or EXTRIP criteria are present.", "Intermittent hemodialysis is generally preferred for rapid clearance; subsequent intermittent or continuous treatment and stopping decisions follow clinical improvement, serial levels and rebound surveillance."],
      nursingEssentials: ["Determine whether exposure is acute, acute-on-chronic or chronic; record formulation, last dose, co-medications, sodium/fluid losses, renal trend and neurologic baseline because the same concentration has different meaning across patterns.", "Perform serial mental-status, tremor, gait, speech, tone, seizure and ECG assessments rather than relying on a single lithium level.", "After ECTR, obtain scheduled serial lithium concentrations and maintain fall precautions and neurologic surveillance because rebound and persistent neurotoxicity can follow apparent plasma clearance."],
      keyLabs: ["Serial lithium levels drawn at consistent documented times, creatinine/eGFR, sodium, potassium, calcium, glucose, osmolality, thyroid testing when relevant and ECG.", "Trend urine output and fluid balance; dehydration and sodium depletion increase proximal lithium reabsorption and slow endogenous clearance."],
      adverseEffects: ["ECTR risks include hypotension, access/anticoagulation complications and electrolyte shifts.", "Rapid plasma clearance does not guarantee immediate neurologic recovery, and persistent neurologic sequelae can occur after severe chronic toxicity."],
      contraindications: ["Do not delay ECTR because a patient has few GI symptoms; chronic lithium neurotoxicity may be severe without dramatic gastrointestinal findings.", "Do not interpret one post-dialysis level as final because redistribution can raise it again."],
      escalationRecurrence: ["Decreased consciousness, seizure, life-threatening dysrhythmia, significant confusion, worsening neurologic findings, impaired renal function with severe concentration, or prolonged projected clearance requires urgent ECTR review.", "Rebound concentration or recurrent neurologic toxicity after ECTR requires repeat toxicology/nephrology assessment and may require another session."],
      evidenceLimitations: ["EXTRIP recommendations are graded and must be applied to exposure pattern, symptoms, renal function and expected clearance; serum level alone incompletely represents CNS burden."],
      nclexTraps: ["Lithium has no receptor antidote; fluids help selected patients, but severe poisoning may require dialysis.", "Chronic toxicity can be clinically worse than an acute ingestion at the same serum concentration because tissue loading differs."],
      sourceKeys: ["extrip-lithium", "poison-help"]
    }),

    makeCard({
      name: "Extracorporeal treatment for metformin poisoning",
      generic: "extracorporeal treatment for metformin poisoning",
      aliases: ["metformin dialysis", "MALA dialysis", "metformin associated lactic acidosis dialysis", "ECTR metformin", "biguanide toxicity dialysis", "hemodialysis for metformin overdose"],
      class: "Extracorporeal metformin removal and bicarbonate-buffered correction of severe lactic acidosis",
      usedToTreat: "Severe metformin poisoning or metformin-associated lactic acidosis with profound lactate elevation, acidemia, shock, failure of supportive measures, or lower-threshold high-risk comorbidity according to EXTRIP guidance.",
      description: "Extracorporeal treatment for severe metformin poisoning uses hemodialysis to remove metformin and provide bicarbonate-buffered correction of life-threatening lactic acidosis while shock and its causes are treated. Metformin impairs hepatic lactate use and mitochondrial energy handling, especially when overdose, kidney failure, shock or hypoxia allows drug and lactate to accumulate. The low pH then weakens cardiac performance and vascular responsiveness, worsening shock and lactate production in a self-reinforcing cycle. The goal is not merely a lower metformin level; it is restoration of perfusion and cellular chemistry while the cause of renal or circulatory failure is treated.",
      mechanism: "Metformin is small, water soluble and minimally protein bound, which makes circulating drug dialyzable, although its large apparent distribution volume can require prolonged or repeated treatment. Intermittent hemodialysis removes metformin and lactate and delivers bicarbonate rapidly. Correcting severe acidemia improves catecholamine responsiveness and myocardial function, while continued clearance reduces ongoing inhibition of oxidative metabolism. Rebound can occur as tissue drug redistributes into plasma.",
      administrationTiming: ["Stop metformin, resuscitate airway/circulation, identify sepsis, shock, hypoxia or renal failure, and involve toxicology/nephrology early when lactate and pH approach severe EXTRIP ranges or supportive measures fail.", "Use current EXTRIP initiation and cessation criteria. Intermittent bicarbonate-buffered hemodialysis is preferred initially when feasible; CKRT may be used when HD is unavailable or the clinical plan requires it."],
      nursingEssentials: ["Trend perfusion, vasopressor need, mental status, temperature, ventilation, urine output and source of shock; metformin may contribute to lactic acidosis without being its only cause.", "Time-stamp lactate and blood-gas trends before, during and after ECTR because direction and recurrence matter more than one isolated result.", "Check glucose to detect hypoglycemia, and avoid assuming every high lactate in a metformin user is drug toxicity because sepsis, hypoxia, seizures and liver failure can produce the same finding and require simultaneous treatment."],
      keyLabs: ["Serial arterial or venous blood gas, lactate, bicarbonate, anion gap, glucose, renal/hepatic function, electrolytes, osmolality when indicated and ECG.", "Metformin concentrations are often delayed and should not postpone ECTR when severe clinical criteria are present because waiting can prolong profound acidemia and shock; follow post-ECTR lactate and pH to detect recurrence from redistribution or an untreated shock source."],
      adverseEffects: ["ECTR can cause hypotension, access/anticoagulation complications and electrolyte shifts.", "Rapid bicarbonate and volume changes require close ventilation, sodium, calcium and hemodynamic monitoring."],
      contraindications: ["Do not wait for a metformin concentration when profound acidemia, lactate elevation, shock or organ failure already meets clinical criteria.", "A normal or modest metformin concentration does not exclude a mixed shock state in which metformin accumulation worsens physiology."],
      escalationRecurrence: ["Worsening shock, declining consciousness, severe lactate/pH criteria or failure of standard measures requires urgent ECTR.", "After stopping, recurrent lactate elevation or acidemia requires reassessment for redistribution, inadequate source control, persistent shock or another ECTR session."],
      evidenceLimitations: ["MALA often has multiple causes and EXTRIP evidence is low certainty. Treat the whole shock state while applying the toxin-specific criteria."],
      nclexTraps: ["Dialysis helps by both removing metformin and correcting severe acidemia; it is not chosen from creatinine alone.", "Do not label every lactic acidosis in a metformin user as pure overdose—look for sepsis, hypoxia and shock."],
      sourceKeys: ["extrip-metformin", "poison-help"]
    }),

    makeCard({
      name: "Extracorporeal treatment for valproate poisoning",
      generic: "extracorporeal treatment for valproate poisoning",
      aliases: ["valproic acid dialysis", "valproate overdose hemodialysis", "Depakote toxicity dialysis", "ECTR valproate", "divalproex overdose dialysis", "VPA dialysis"],
      class: "Extracorporeal valproate removal for severe poisoning",
      usedToTreat: "Severe valproic-acid or divalproex poisoning with extreme concentration, shock, cerebral edema, ventilated coma, severe hyperammonemia, marked acidemia or other current EXTRIP criteria.",
      description: "Hemodialysis is an extracorporeal treatment that removes free valproate during severe poisoning after high concentrations saturate albumin binding and sharply increase the dialyzable fraction. At therapeutic concentrations valproate is highly albumin bound and seems poorly dialyzable. In a massive overdose, the free fraction rises sharply, and far more active drug becomes available to cross a dialysis membrane and enter tissues. Severe toxicity can cause coma, respiratory depression, hyperammonemia, cerebral edema, shock and metabolic abnormalities. This concentration-dependent change in protein binding explains why hemodialysis becomes most useful in the sickest patients.",
      mechanism: "Intermittent hemodialysis removes the unbound valproate fraction; as free drug falls, protein-bound drug dissociates and can also be cleared. Dialysis also corrects acid-base and metabolic derangements. Levocarnitine supports mitochondrial handling and the urea cycle in selected patients but does not rapidly remove a massive circulating drug burden, so it may be used alongside rather than instead of ECTR.",
      administrationTiming: ["Stop valproate, support airway/ventilation and circulation, check serial concentrations and ammonia, give protocol-directed levocarnitine when indicated, and contact toxicology/nephrology early for severe features.", "Use EXTRIP initiation and cessation criteria. Intermittent hemodialysis is preferred when feasible; ECTR ends only after clinical and concentration endpoints are met and recurrence risk is reassessed."],
      nursingEssentials: ["Identify formulation and delayed-release potential, exposure time, baseline valproate use, co-ingestants and serial neurologic trajectory because concentrations can peak late.", "Trend consciousness, pupils, ventilation, blood pressure, temperature, seizure activity, ammonia and signs of cerebral edema; protect airway while avoiding sedative explanations for worsening coma without reassessment.", "Coordinate levocarnitine and other medications with ECTR, and continue post-treatment levels because delayed absorption or redistribution can recur."],
      keyLabs: ["Serial total valproate concentration, free level when available, ammonia, blood gas, lactate, glucose, sodium, calcium, liver tests, CBC/platelets, renal function and ECG.", "Do not use ammonia alone to stage severity because its concentration may not track coma, ventilatory failure or cerebral edema; relate it to mental status, ventilation, cerebral findings and serial drug concentration."],
      adverseEffects: ["ECTR can cause hypotension, access/anticoagulation complications and electrolyte shifts.", "Severe poisoning itself can cause thrombocytopenia, pancreatitis, hepatic injury, cerebral edema and respiratory failure, which can persist after plasma clearance."],
      contraindications: ["High therapeutic protein binding is not a reason to dismiss dialysis in massive poisoning because saturation raises the dialyzable free fraction.", "Do not delay ECTR for a free valproate level when clinical and total-concentration criteria already indicate severe poisoning."],
      escalationRecurrence: ["Shock, cerebral edema, extreme concentration, ventilated coma, acute hyperammonemia with severe toxicity or marked acidemia requires urgent ECTR review.", "Recurrent coma, ammonia rise or drug-level rebound after ECTR requires renewed toxicology/nephrology assessment."],
      evidenceLimitations: ["EXTRIP recommendations are based largely on lower-certainty evidence; apply them with clinical severity and poison-center expertise."],
      nclexTraps: ["Valproate becomes more dialyzable in massive overdose because albumin binding saturates.", "Levocarnitine and dialysis solve different problems and may be needed together."],
      sourceKeys: ["extrip-valproate", "poison-help"]
    }),

    makeCard({
      name: "Folic acid and leucovorin for methanol poisoning",
      generic: "folate therapy for methanol poisoning",
      aliases: ["folic acid methanol antidote", "leucovorin methanol poisoning", "folinic acid for methanol", "formate metabolism cofactor", "methanol folate rescue", "folate toxic alcohol adjunct"],
      class: "Folate-dependent formate-metabolism adjunct in methanol poisoning",
      entryType: "drug-class-card",
      classCard: true,
      classExampleNames: ["Folic acid", "Leucovorin"],
      usedToTreat: "Adjunctive support of formate metabolism in suspected or confirmed methanol poisoning, alongside immediate alcohol-dehydrogenase blockade, correction of acidosis, and extracorporeal treatment when severe criteria are met.",
      description: "Methanol itself mainly causes intoxication; alcohol dehydrogenase converts it into formaldehyde and then formate, which inhibits mitochondrial cytochrome oxidase and injures the retina, optic nerve and basal ganglia. Folate-dependent pathways help convert formate into carbon dioxide and water. Folic acid or reduced folate can support that final detoxification step, but the process is too slow and evidence too limited for folate to stand alone. It must never delay fomepizole, protocol-directed ethanol when necessary, bicarbonate or dialysis.",
      mechanism: "Formate combines with tetrahydrofolate and moves through folate-dependent one-carbon metabolism toward carbon dioxide. Providing folate substrate may increase this elimination pathway, particularly when stores are limited. Leucovorin already supplies a reduced folate form, while folic acid requires metabolic reduction. Neither blocks alcohol dehydrogenase or rapidly removes methanol/formate, which explains why this is an adjunct rather than the primary antidote.",
      administrationTiming: ["Start under toxicology protocol when methanol poisoning is suspected or confirmed, without delaying alcohol-dehydrogenase blockade or ECTR evaluation.", "Continue during ECTR when directed. Product, route, dose and duration are protocol-specific and should not be copied from methotrexate-rescue regimens."],
      nursingEssentials: ["Verify that the order is for methanol adjunct therapy rather than methotrexate rescue, because both may use leucovorin but the rationale and regimen are different.", "Track time of exposure, fomepizole or ethanol, folate therapy, bicarbonate, ECTR and visual findings so that treatment gaps are visible before toxic metabolism or organ injury continues unnoticed.", "Continue serial vision, neurologic, acid-base and hemodynamic assessment; improvement cannot be inferred from folate administration alone."],
      keyLabs: ["Serial methanol concentration, blood gas, bicarbonate, anion gap, measured osmolality/osmol gap, electrolytes, glucose, renal function and lactate with awareness of assay limitations.", "Folate concentrations are not a bedside endpoint; clinical recovery and methanol/formate-related metabolic resolution determine progress."],
      adverseEffects: ["Folic acid and leucovorin are usually tolerated but can cause hypersensitivity and gastrointestinal effects; rare seizure interactions are relevant in susceptible patients.", "The major safety risk is therapeutic delay if folate is mistaken for definitive ADH blockade or dialysis."],
      contraindications: ["Do not use folate therapy as monotherapy for a toxic methanol exposure because it neither blocks alcohol dehydrogenase nor rapidly removes methanol or formate.", "Do not assume folic acid and leucovorin doses are interchangeable or borrow an oncology schedule; follow the active toxicology protocol."],
      escalationRecurrence: ["Visual symptoms, coma, seizure, severe acidosis, persistent anion gap, kidney impairment or EXTRIP criteria require urgent ECTR regardless of folate administration.", "Recurrent acidosis or visual/neurologic decline requires reassessment for continued methanol metabolism, inadequate blockade or incomplete clearance."],
      evidenceLimitations: ["Human outcome evidence for folate adjuncts is limited, and use is off-label. EXTRIP supports continued folic acid during methanol ECTR, while toxicology protocols determine the exact product and regimen."],
      nclexTraps: ["Folate helps metabolize formate; fomepizole prevents new formate, and dialysis removes methanol/formate. These are complementary, not interchangeable.", "Leucovorin used here is not a methotrexate-rescue schedule."],
      sourceKeys: ["extrip-methanol", "poison-help"]
    }),

    makeCard({
      name: "Calcium treatment for hydrofluoric acid exposure",
      generic: "calcium gluconate treatment for hydrofluoric acid exposure",
      aliases: ["HF burn calcium gluconate", "hydrofluoric acid antidote", "fluoride binding calcium", "calcium gluconate gel HF", "HF inhalation nebulized calcium", "fluoric acid burn treatment", "hydroflouric acid calcium"],
      class: "Route-specific fluoride-binding calcium rescue for hydrogen-fluoride injury",
      entryType: "drug",
      classCard: false,
      classExampleNames: [],
      usedToTreat: "Hydrogen-fluoride or hydrofluoric-acid exposure after immediate decontamination, using route- and severity-specific calcium therapy for skin injury, inhalational injury, ingestion-related binding, or systemic hypocalcemia and dysrhythmia.",
      description: "Calcium treatment for hydrofluoric acid exposure binds fluoride in injured tissue or blood, limiting ongoing calcium and magnesium sequestration, deep tissue injury, hyperkalemia, and lethal dysrhythmias while the route is matched to exposure severity. Hydrofluoric acid is both a corrosive and a systemic fluoride poison that can penetrate deeply even when the surface burn looks small. Rapid water irrigation removes external chemical; calcium gluconate then supplies calcium that binds fluoride and reduces continued tissue and systemic injury. Route matters: gel belongs on skin, injectable calcium may be needed locally or intravenously, and eye exposure requires irrigation and ophthalmology—not skin gel.",
      mechanism: "Dissociated fluoride has high affinity for divalent cations. Calcium complexes fluoride locally and systemically, lowering the free ion available to penetrate tissue, disrupt enzymes and deplete circulating calcium. Relief of deep pain after correct local therapy can signal reduced fluoride activity, while persistent pain suggests ongoing penetration. Systemic calcium also restores ionized calcium and myocardial membrane stability, but aggressive replacement requires ECG and laboratory guidance because both under-treatment and overcorrection are dangerous.",
      administrationTiming: ["Protect staff, remove contaminated clothing and irrigate immediately; do not postpone decontamination while calcium is prepared. Call Poison Help and a burn/toxicology specialist early.", "Choose topical, infiltrative, intra-arterial, nebulized, enteral-binding or IV calcium only from the exposure route, depth and systemic findings. These specialized uses are protocol-directed and many are off-label."],
      nursingEssentials: ["Wear appropriate chemical protection during decontamination because liquid contamination can injure staff; double-bag clothing and prevent hypothermia during prolonged irrigation.", "Map the exposed surface, concentration and time; trend pain, sensation, color, capillary refill and swelling. Persistent pain after gel is an escalation signal, but local anesthetic can hide this endpoint.", "Maintain continuous ECG for meaningful exposure and trend ionized calcium, magnesium and potassium because dysrhythmia may reflect rapidly changing systemic fluoride binding."],
      keyLabs: ["Serial ionized calcium, magnesium, potassium, blood gas, renal function, glucose and ECG/QT/QRS assessment; add chest imaging and oxygenation/ventilation measures after inhalation.", "Document route-specific calcium concentration, amount, site, response and pain trajectory because accidental substitution of calcium chloride into tissue can worsen injury."],
      adverseEffects: ["Calcium extravasation, tissue necrosis, hypercalcemia, bradycardia and dysrhythmia can occur with incorrect concentration or rapid IV delivery.", "Infiltration can raise compartment pressure, especially in digits; intra-arterial treatment has vascular-access risks and requires expert monitoring."],
      contraindications: ["Do not inject calcium chloride into HF skin burns because it is more tissue-injuring; do not place calcium gluconate gel in the eye.", "Do not give activated charcoal for HF ingestion or induce emesis; fluoride binding and corrosive-injury management require a separate plan."],
      escalationRecurrence: ["Persistent pain, deep or large burn, digit/nail involvement, ECG change, hypocalcemia, hyperkalemia, hypotension, seizure, respiratory distress or ingestion requires urgent toxicology/burn/critical-care escalation.", "Pain recurrence after initial relief can mean residual fluoride and requires reassessment rather than simple analgesic masking."],
      evidenceLimitations: ["Route-specific calcium strategies are supported largely by toxicology experience and observational evidence. ATSDR/CDC guidance and the regional poison center should control the bedside protocol."],
      nclexTraps: ["A small HF burn can cause systemic toxicity because surface area and visible injury underestimate fluoride penetration.", "First irrigate; then use the correct calcium route. Skin gel is never an eye treatment."],
      sourceKeys: ["cdc-hf", "atsdr-hf", "poison-help"]
    }),

    makeCard({
      name: "Tetanus immune globulin",
      generic: "tetanus immune globulin human",
      aliases: ["TIG", "tetanus antitoxin", "HyperTET", "tetanus immune globulin human", "tetanus wound immune globulin", "tetanus immunoglobulin", "tetanous immune globulin"],
      brandExamples: ["HyperTET"],
      class: "Human passive tetanus-antitoxin immunoglobulin",
      usedToTreat: "Clinical tetanus by neutralizing unbound toxin and prevention after selected tetanus-prone wounds when immunization history and immune status meet CDC criteria. Treatment and wound-prophylaxis indications must be distinguished.",
      description: "Tetanus immune globulin is a human passive immunoglobulin antitoxin that immediately supplies antibodies to neutralize tetanospasmin still outside nerve endings. Tetanospasmin travels along motor nerves and blocks inhibitory neurotransmitter release, producing rigidity, spasms and autonomic instability; once toxin is bound within neurons, immune globulin cannot pull it off or reverse established blockade. That explains why early administration matters and why airway care, spasm control, wound debridement, antibiotics and prolonged support remain necessary. Illness itself does not create reliable immunity, so vaccination still begins or continues during recovery.",
      mechanism: "Human IgG antibodies bind circulating and wound-associated tetanospasmin before the toxin enters motor neurons. Antibody-toxin complexes cannot reach neuronal receptors and are cleared. Once tetanospasmin is internalized and cleaves synaptic proteins, TIG cannot reach it; recovery depends on formation of new neural connections and can take months. Passive antibody also fades, while toxoid vaccination creates durable active immunity—hence the need for both in appropriate patients.",
      administrationTiming: ["For clinical tetanus, hospitalize and give the current CDC-recommended commercially available intramuscular TIG preparation promptly; U.S. products are not formulated for intrathecal or IV use.", "For wound prophylaxis, apply CDC criteria based on wound type, prior vaccine doses and immunocompromise, and administer vaccine and TIG at separate sites when both are indicated."],
      nursingEssentials: ["Do not delay treatment for wound culture because tetanus is a clinical diagnosis and culture neither confirms nor excludes it.", "Give TIG, toxoid-containing vaccine and other injections in separate syringes and sites; document product, lot, site and vaccination history so passive and active immunity are not confused.", "Maintain a quiet low-stimulation environment, airway equipment and continuous autonomic/respiratory monitoring because minor stimuli can trigger severe spasms and toxin already bound is unaffected by TIG."],
      keyLabs: ["No serum test rules out tetanus. Follow ventilation, blood gases, CK, renal function, electrolytes, ECG/hemodynamics and wound/infection studies as clinically indicated.", "Record immunization history, wound features, onset and progression of rigidity/spasm, TIG time and vaccine time; these are more useful than a tetanus antibody level during an emergency."],
      adverseEffects: ["Injection-site pain, headache, fever and hypersensitivity can occur; anaphylaxis is rare but requires emergency treatment.", "Human immune globulin has a very low residual risk of transmissible agents despite donor screening and manufacturing controls."],
      contraindications: ["A prior serious immune-globulin reaction requires immediate specialist risk-benefit planning, but suspected clinical tetanus is life-threatening.", "Do not give U.S. IM TIG intravenously or intrathecally and do not assume IVIG is equivalent; CDC describes IVIG only as an off-label alternative when TIG is unavailable."],
      escalationRecurrence: ["Airway compromise, laryngospasm, generalized spasms, respiratory failure, rhabdomyolysis or autonomic instability requires ICU care regardless of TIG administration.", "Ongoing toxin production requires wound debridement and antimicrobial treatment; worsening after TIG does not prove antibody failure because previously bound toxin remains active."],
      evidenceLimitations: ["CDC notes uncertainty around the optimal treatment dose and local wound infiltration. Follow the current CDC clinical-care recommendation rather than older high-dose traditions."],
      nclexTraps: ["TIG provides immediate passive antibody; tetanus vaccine provides delayed active immunity. A patient may need both.", "TIG cannot reverse toxin already bound to nerve endings, so supportive care remains central."],
      sourceKeys: ["cdc-tetanus"]
    }),

    makeCard({
      name: "Phentolamine for norepinephrine extravasation",
      generic: "phentolamine mesylate",
      aliases: ["phentolamine", "Regitine", "norepinephrine extravasation antidote", "vasopressor extravasation reversal", "pressor infiltration antidote", "alpha blocker extravasation", "phentolamin", "fentolamine"],
      brandExamples: ["Regitine"],
      class: "Local nonselective alpha-adrenergic antagonist for norepinephrine extravasation ischemia",
      usedToTreat: "Prevention or treatment of dermal necrosis and sloughing after norepinephrine extravasation according to the labeled local-infiltration procedure; broader vasopressor-extravasation use depends on institutional protocol.",
      description: "Extravasated norepinephrine continues stimulating alpha receptors in small vessels outside the vein, producing intense vasoconstriction, ischemia and possible tissue necrosis. Phentolamine locally blocks those alpha receptors, allowing perfusion to return while drug disperses. The benefit is time-sensitive because receptor blockade cannot restore tissue that is already necrotic. Immediate infusion cessation, aspiration through the existing catheter when directed, limb assessment and pharmacy/provider notification occur while the antidote is prepared.",
      mechanism: "Phentolamine competitively blocks alpha-1 and alpha-2 receptors. Local alpha-1 blockade relaxes vascular smooth muscle and counters norepinephrine-mediated constriction; alpha-2 blockade can increase norepinephrine release, but local vasodilation is the intended dominant effect. Systemic absorption can lower blood pressure and cause tachycardia, which explains careful local dosing, perfusion reassessment and vital-sign monitoring.",
      administrationTiming: ["Stop the norepinephrine infusion immediately but preserve the catheter initially for aspiration if the local protocol directs it; notify the prescriber/pharmacy and obtain the labeled product promptly.", "Infiltrate the label-specified diluted phentolamine throughout the affected area within the labeled time window. Exact dilution, dose and injection pattern must follow the current product label and institutional extravasation kit."],
      nursingEssentials: ["Mark and photograph the border, assess pain, blanching, temperature, capillary refill, pulses, sensation and motor function, elevate as protocol directs, and repeat the same measures after infiltration so that reperfusion is objectively documented and expanding ischemia is detected early.", "Use multiple small local injections with the ordered solution rather than an IV bolus, and monitor systemic blood pressure and heart rate because unintended absorption can cause hypotension or tachycardia.", "File the extravasation event, document drug concentration/volume and catheter site, and arrange wound/plastic-surgery follow-up when perfusion does not normalize."],
      keyLabs: ["Diagnosis is clinical; serial neurovascular examinations and photographs are the key monitoring data. CK, lactate or renal studies may be needed when extensive ischemia or compartment injury is suspected.", "Document phentolamine concentration, total amount, dilution, time from extravasation and every injection site to prevent dosing and handoff errors."],
      adverseEffects: ["Local pain, bleeding and injection injury can occur; systemic absorption can cause hypotension, tachycardia, dysrhythmia, angina or flushing.", "Reperfusion does not guarantee tissue survival when treatment was delayed or the infiltrate was extensive."],
      contraindications: ["Do not inject blindly into an area with suspected compartment syndrome or arterial injury; urgent surgical evaluation takes priority.", "Do not generalize the norepinephrine label regimen to every vasopressor or vesicant without the institution's agent-specific protocol."],
      escalationRecurrence: ["Progressive pain, blistering, cyanosis, delayed capillary refill, sensory/motor loss, absent pulse or expanding injury requires urgent wound, vascular or plastic-surgery escalation.", "Systemic hypotension, chest pain or dysrhythmia after infiltration requires monitored emergency management."],
      evidenceLimitations: ["The U.S. label specifically addresses norepinephrine extravasation. Use for other vasopressors is common in protocols but is not automatically label-equivalent."],
      nclexTraps: ["Do not simply remove the IV and walk away, because norepinephrine left in tissue can sustain vasoconstriction and progress to necrosis; stop infusion, assess/aspirate per protocol, then deliver time-sensitive local rescue.", "Phentolamine restores local perfusion by alpha blockade; it does not neutralize the vasopressor molecule."],
      sourceKeys: ["dailymed-phentolamine"]
    }),

    makeCard({
      name: "Cholestyramine and activated-charcoal accelerated elimination",
      generic: "accelerated elimination of leflunomide and teriflunomide",
      aliases: ["cholestyramine washout", "leflunomide washout", "teriflunomide washout", "Aubagio washout", "Arava washout", "rapid elimination procedure", "activated charcoal teriflunomide elimination", "Questran drug washout", "cholestiramine washout"],
      brandExamples: ["Questran", "Prevalite", "Aubagio", "Arava"],
      class: "Interruption of enterohepatic recycling for accelerated teriflunomide elimination",
      entryType: "drug-class-card",
      classCard: true,
      classExampleNames: ["Cholestyramine", "Activated charcoal"],
      usedToTreat: "Rapid reduction of the long-lived active teriflunomide moiety after leflunomide or teriflunomide when pregnancy, serious liver injury, severe hypersensitivity or skin reaction, serious infection/toxicity, or another label-defined reason requires accelerated elimination.",
      description: "Teriflunomide recirculates between liver, bile and intestine and can otherwise remain in plasma for months to years. Cholestyramine binds biliary drug in the gut, while repeated activated charcoal adsorbs it; both prevent reabsorption and pull more drug into fecal elimination. This is a planned multi-day elimination procedure, not a single emergency charcoal dose. It can reduce drug exposure dramatically, but it also removes therapeutic effect and can bind other medicines or nutrients, so indication, timing, contraception and laboratory verification remain drug-label specific.",
      mechanism: "Leflunomide is converted to teriflunomide, which undergoes biliary secretion and enterohepatic recycling. Nonabsorbed cholestyramine resin sequesters negatively charged bile-associated molecules; activated charcoal provides a large adsorptive surface. Trapping teriflunomide in the bowel prevents return to portal blood and creates a concentration gradient that favors additional biliary elimination. This explains why scheduled repeated doses work and why a one-time dose is insufficient.",
      administrationTiming: ["Stop the causative drug and begin the exact current leflunomide- or teriflunomide-label procedure when indicated. Both labels describe accelerated elimination over 11 days, while the labeled cholestyramine and charcoal regimens, tolerability alternatives and verification requirements are not fully interchangeable.", "If treatment days are interrupted or the target concentration is not achieved, follow the relevant label for completion, repeat testing or another elimination course; do not invent a shorter universal washout."],
      nursingEssentials: ["Confirm which drug was taken, reason for elimination, pregnancy timing, last dose, liver/CBC findings, bowel function and all oral medications before selecting the label pathway.", "Build a spacing plan for other oral drugs because cholestyramine and charcoal can reduce their absorption; verify contraception because elimination and binding interactions can change exposure and disease control.", "Mix cholestyramine fully and never give dry powder; monitor constipation, distention, vomiting and adherence because an incomplete course may leave clinically important drug exposure."],
      keyLabs: ["For reproductive-risk elimination, obtain teriflunomide concentrations using the drug-specific label's target and confirmation schedule because only serial drug-specific results show that the long-lived exposure has fallen below target and remained there. For toxicity, trend ALT/AST, bilirubin, CBC, renal function and the affected organ system to detect continuing hepatic, marrow, renal or organ injury while elimination proceeds.", "Document every administered and missed washout dose because treatment days and verification determine whether elimination is complete."],
      adverseEffects: ["Cholestyramine commonly causes constipation, bloating and nausea and can reduce absorption of other drugs and fat-soluble vitamins; charcoal can cause vomiting, aspiration, constipation or bowel obstruction.", "Accelerated elimination can permit return of MS or rheumatoid disease activity because it removes the therapeutic drug as well as toxic exposure."],
      contraindications: ["Do not give either regimen to a patient with an unprotected airway, ileus or obstruction; charcoal aspiration can be more dangerous than delayed elimination.", "Do not substitute a routine lipid-lowering cholestyramine schedule or single-dose charcoal for the labeled accelerated-elimination procedure."],
      escalationRecurrence: ["Pregnancy, suspected severe liver injury, anaphylaxis, severe cutaneous reaction, serious infection or marrow suppression requires immediate drug cessation, specialist contact and label-directed elimination.", "Persistent concentration above the label target or worsening toxicity requires repeat/alternative elimination and specialist reassessment."],
      evidenceLimitations: ["This is label-defined pharmacokinetic rescue rather than treatment for every adverse effect. Exact regimen, target concentration and confirmation differ by source drug and clinical goal."],
      nclexTraps: ["A drug can remain for up to years because of enterohepatic recycling; stopping the tablet alone may not end fetal or toxicity risk quickly.", "Cholestyramine and charcoal accelerate elimination by trapping drug in the bowel, but they can also trap other essential medications."],
      sourceKeys: ["dailymed-aubagio", "dailymed-leflunomide"]
    }),

    makeCard({
      name: "Raxibacumab",
      generic: "raxibacumab",
      aliases: ["ABthrax", "anthrax monoclonal antitoxin", "raxibacumab injection", "protective antigen antibody", "anthrax toxin antibody", "raxibacumub"],
      brandExamples: ["ABthrax"],
      class: "Human monoclonal antibody against Bacillus anthracis protective antigen",
      usedToTreat: "Systemic or inhalational anthrax as adjunctive antitoxin with appropriate antibacterial drugs, and labeled inhalational-anthrax prophylaxis when alternative therapies are unavailable or inappropriate under public-health direction.",
      description: "Raxibacumab is a human monoclonal antitoxin antibody that binds Bacillus anthracis protective antigen, blocking the gateway required for edema- and lethal-toxin entry into host cells. Anthrax bacteria can continue producing those toxins even after antibiotics begin killing organisms, so raxibacumab limits additional cellular toxin delivery while antibiotics treat the bacteria. Antitoxin cannot replace antimicrobials or reliably reverse toxin already inside cells, which explains early public-health consultation and combined therapy.",
      mechanism: "Raxibacumab binds free protective antigen and prevents its interaction with anthrax-toxin receptors. Without receptor binding and pore formation, edema factor and lethal factor cannot efficiently enter new cells. The antibody has no direct antibacterial activity, so viable Bacillus anthracis can keep multiplying and producing antigen unless an effective antimicrobial regimen is given simultaneously.",
      administrationTiming: ["Notify the jurisdictional health department and CDC immediately for suspected systemic anthrax and antitoxin access. Give in combination with the current CDC antibacterial regimen; do not delay antibiotics while product release is arranged.", "Administer the weight- and label-specific IV infusion with ordered premedication and infusion monitoring. Redosing and product selection are public-health/specialist decisions, not a universal antitoxin schedule."],
      nursingEssentials: ["Collect cultures and public-health specimens without delaying therapy; use appropriate infection-control and preserve an exposure timeline.", "Verify access source, cold-chain/product integrity, patient weight, premedication, infusion rate and resuscitation readiness because correct exposure depends on product integrity, weight and rate, while hypersensitivity can progress to anaphylaxis; monitor throughout and after infusion.", "Trend hemodynamics, respiratory status, pleural effusions, neurologic findings and organ function because neutralizing new toxin does not reverse established edema, shock or meningitis."],
      keyLabs: ["Cultures/PCR and toxin-related public-health testing as directed, CBC, metabolic and liver panels, coagulation, blood gas/lactate, renal function and serial imaging or pleural-fluid assessment when indicated.", "Do not wait for laboratory confirmation when clinical and exposure evidence supports systemic anthrax; public-health experts coordinate diagnostic confirmation."],
      adverseEffects: ["Infusion reactions, rash, pruritus, headache and hypersensitivity can occur; serious anaphylaxis requires immediate treatment.", "Animal-model efficacy under the Animal Rule means human outcome data are necessarily limited."],
      contraindications: ["No ordinary contraindication should delay specialist risk-benefit assessment in lethal systemic anthrax, but serious prior monoclonal-antibody reaction requires resuscitation planning.", "Do not use as antimicrobial monotherapy or assume it treats anthrax meningitis without the required CNS-active antibiotic regimen, because raxibacumab neutralizes circulating toxin but neither kills replicating bacteria nor reliably treats infection behind the blood-brain barrier."],
      boxedWarning: "BOXED WARNING: Hypersensitivity reactions, including anaphylaxis, have occurred during or after IV raxibacumab. Administer only in a monitored setting with epinephrine, appropriate equipment, medication, and personnel trained to manage hypersensitivity, anaphylaxis, and shock; interrupt or stop the infusion and treat promptly if a reaction occurs.",
      escalationRecurrence: ["Shock, respiratory failure, enlarging pleural effusion, altered mental status or meningitis concern requires ICU care, drainage/source management and immediate CDC coordination.", "Progression after infusion may reflect toxin already internalized or ongoing bacterial production and requires reassessment of antibiotics, complications and antitoxin strategy."],
      evidenceLimitations: ["Effectiveness is based primarily on animal models because intentional human trials are unethical. U.S. access is generally through public-health channels and the Strategic National Stockpile rather than routine pharmacy inventory."],
      nclexTraps: ["Anthrax antitoxin blocks toxin entry; antibiotics kill bacteria. The patient needs both.", "Do not wait for final culture when systemic anthrax is strongly suspected and public-health experts recommend treatment."],
      sourceKeys: ["fda-raxibacumab", "cdc-anthrax"]
    }),

    makeCard({
      name: "Obiltoxaximab",
      generic: "obiltoxaximab",
      aliases: ["Anthim", "ANTHIM", "anthrax monoclonal antitoxin", "protective antigen monoclonal antibody", "anthrax toxin blocker", "obiltoxaxamab"],
      brandExamples: ["Anthim"],
      class: "Chimeric monoclonal antibody against Bacillus anthracis protective antigen",
      usedToTreat: "Inhalational or systemic anthrax as adjunctive antitoxin with appropriate antibacterial drugs, and labeled inhalational-anthrax prophylaxis when alternatives are unavailable or inappropriate and benefit outweighs hypersensitivity risk.",
      description: "Obiltoxaximab is a chimeric monoclonal antitoxin antibody that neutralizes Bacillus anthracis protective antigen, blocking the gateway edema and lethal factors use to enter cells. That limits new toxin delivery but does not kill bacteria, remove toxin already inside cells, or cross the blood-brain barrier reliably. Antibiotics, pleural-fluid management, shock care and a meningitis-capable regimen when indicated therefore remain central. The product carries a boxed warning for hypersensitivity and anaphylaxis, so the monitored infusion environment is part of the treatment rather than an optional precaution.",
      mechanism: "The monoclonal antibody binds protective antigen and prevents receptor-mediated assembly and cellular entry of anthrax toxin complexes. Edema factor and lethal factor are then less able to reach intracellular targets. Because bacterial growth and toxin production continue independently, obiltoxaximab must accompany effective antimicrobials. Its limited CNS penetration explains why it cannot substitute for antibiotics that reach cerebrospinal fluid when meningitis is possible.",
      administrationTiming: ["Contact the health department and CDC immediately for release from public-health supplies. Begin appropriate antibiotics at once and give antitoxin as early as directed.", "Use labeled weight-based IV preparation, premedication and infusion-rate instructions in a monitored setting equipped for anaphylaxis; stop and treat serious hypersensitivity immediately."],
      nursingEssentials: ["Verify patient weight, access authorization, product integrity, ordered premedication, dilution and infusion pump settings with an independent check because weight or preparation errors can alter exposure and the infusion can cause rapid anaphylaxis.", "Monitor airway, skin, blood pressure, pulse and oxygenation continuously or at protocol intervals during and after infusion because anaphylaxis can progress rapidly.", "Continue surveillance for pleural effusion, shock, respiratory failure and meningitis because antitoxin does not reverse established organ injury."],
      keyLabs: ["Obtain public-health cultures/PCR and toxin studies as directed, plus CBC, renal/hepatic function, coagulation, blood gas/lactate and organ-specific studies, because these results identify infection and evolving organ injury; collect samples without delaying therapy.", "Track infusion time, rate changes, reaction features and interventions so that a reaction is not mistaken for worsening anthrax or vice versa."],
      adverseEffects: ["Boxed warning: hypersensitivity and anaphylaxis can occur during infusion; rash, pruritus, urticaria, cough and headache are also reported.", "Human safety data come largely from healthy volunteers and effectiveness from animal models."],
      contraindications: ["Prophylaxis should be used only when benefit outweighs hypersensitivity/anaphylaxis risk and alternatives are not appropriate.", "Do not use alone without antibiotics or as a substitute for a CNS-active regimen when anthrax meningitis is suspected, because obiltoxaximab neutralizes toxin but does not kill Bacillus anthracis or reliably treat infection behind the blood-brain barrier."],
      boxedWarning: "BOXED WARNING: Hypersensitivity and anaphylaxis have occurred during IV obiltoxaximab. Administer in a monitored setting with personnel and treatment immediately available; stop the infusion and treat promptly if a serious reaction occurs.",
      escalationRecurrence: ["Any airway swelling, bronchospasm, hypotension or anaphylaxis requires immediate infusion cessation and emergency treatment.", "Clinical progression requires ICU/public-health reassessment of antibiotic coverage, effusion drainage, meningitis and whether additional countermeasures are indicated."],
      evidenceLimitations: ["Effectiveness relies on animal-model evidence under the Animal Rule. Product access is generally public-health/SNS mediated and must be confirmed in real time."],
      nclexTraps: ["Premedication and monitoring do not remove anaphylaxis risk.", "Antitoxin blocks toxin; antibiotics treat the organism, and CNS-active antibiotics are needed when meningitis is possible."],
      sourceKeys: ["dailymed-anthim", "cdc-anthrax"]
    }),

    makeCard({
      name: "Anthrax immune globulin intravenous",
      generic: "anthrax immune globulin human intravenous",
      aliases: ["Anthrasil", "ANTHRASIL", "AIGIV", "anthrax immune globulin", "anthrax polyclonal antitoxin", "human anthrax antitoxin", "anthrax immunoglobulin intravenous"],
      brandExamples: ["Anthrasil"],
      class: "Human polyclonal anthrax protective-antigen immune globulin",
      usedToTreat: "Inhalational or other noncutaneous systemic anthrax as adjunctive antitoxin with appropriate antibacterial drugs under CDC/public-health direction.",
      description: "Anthrax immune globulin intravenous is a human polyclonal immunoglobulin antitoxin that supplies antibodies against protective antigen and other anthrax epitopes, neutralizing circulating toxin without killing Bacillus anthracis. Broader epitope binding may complement antibiotics, but the antibodies still cannot eradicate the organism. The product is reserved in the Strategic National Stockpile and its maltose excipient can make certain bedside glucose meters report a falsely high result. Giving insulin for that false value can cause fatal hypoglycemia, making glucose-method verification a core nursing safety action.",
      mechanism: "Polyclonal IgG binds protective antigen and limits protective-antigen-mediated entry of edema and lethal factors into cells. Multiple antibody clones recognize different epitopes, while antibiotics separately stop bacterial replication and new toxin production. Maltose in the formulation is not glucose, but some nonspecific point-of-care methods detect it as glucose; only a glucose-specific testing method safely reflects the patient's concentration during exposure to the product.",
      administrationTiming: ["Contact the jurisdictional health department and CDC immediately for Strategic National Stockpile release. Start effective antibiotics without waiting for antitoxin arrival.", "Select the labeled severity- and weight-based vial plan, thaw/prepare without shaking, and give by controlled IV infusion with the labeled rate escalation and reaction monitoring."],
      nursingEssentials: ["Before infusion, identify every bedside glucose meter and strip method and remove or label maltose-interfering systems because maltose can look like glucose on susceptible meters and trigger dangerous insulin treatment.", "Assess thrombosis risk, hydration, renal function and IgA-related reaction history because immune globulin can cause thrombosis, renal injury and IgA-related anaphylaxis; use the minimum practical infusion rate in high-risk patients and keep anaphylaxis treatment ready.", "Monitor infusion reaction, thrombosis, hemolysis, renal injury, TRALI/ARDS, pleural disease and shock while antibiotics and source/effusion management continue; antibiotics are still required because immune globulin neutralizes toxin but does not kill Bacillus anthracis."],
      keyLabs: ["Glucose by a glucose-specific method only, CBC, hemolysis studies when indicated, renal/hepatic function, coagulation, blood gas/lactate and public-health anthrax testing.", "Record lot/vials, thaw time, infusion rate, glucose method and all reactions; these details are essential during an SNS countermeasure response."],
      adverseEffects: ["Boxed risks include maltose-related falsely high glucose readings with susceptible meters and thrombosis. Hypersensitivity, hemolysis, aseptic meningitis, renal dysfunction and TRALI can also occur.", "As a human plasma product, it carries a residual transmissible-agent risk despite screening and manufacturing controls."],
      contraindications: ["Contraindicated after anaphylaxis or severe systemic reaction to human immune globulin and in IgA-deficient patients with anti-IgA antibodies plus an IgA hypersensitivity history because re-exposure can trigger another severe systemic reaction, subject to emergency specialist management.", "Do not use as antimicrobial monotherapy because immune globulin neutralizes circulating toxin but does not kill replicating Bacillus anthracis."],
      boxedWarning: "BOXED WARNING: Maltose can cause falsely high glucose readings with some point-of-care systems, leading to inappropriate insulin and life-threatening hypoglycemia. Thrombosis can also occur. Use glucose-specific testing, hydrate appropriately, and monitor high-risk patients.",
      escalationRecurrence: ["Anaphylaxis, thrombosis, hemolysis, respiratory deterioration or renal injury requires immediate infusion reassessment and emergency treatment.", "Progressive systemic anthrax requires ICU/CDC reassessment of antibiotic regimen, drainage, CNS involvement and antitoxin response."],
      evidenceLimitations: ["Effectiveness is based on animal models and limited human experience. U.S. packaging specifies Strategic National Stockpile use; this is not ordinary commercial ward stock."],
      nclexTraps: ["A bedside glucose number can be false because of maltose—verify the testing method before giving insulin.", "AIGIV neutralizes toxin but does not kill anthrax bacteria; antibiotics remain mandatory."],
      sourceKeys: ["dailymed-anthrasil", "cdc-anthrax"]
    }),

    makeCard({
      name: "Black widow spider antivenin",
      generic: "antivenin latrodectus mactans equine",
      aliases: ["Latrodectus mactans antivenin", "black widow antivenom", "black widow bite antidote", "Latrodectus antivenin", "equine black widow antivenin", "widow spider antivenom", "latrodectus mactens antivenin"],
      class: "Equine venom-neutralizing immune globulin for severe black-widow envenomation",
      usedToTreat: "Selected severe black-widow envenomation with significant pain, muscle spasm, autonomic toxicity or high-risk clinical circumstances when benefit outweighs equine-antiserum reaction risk and the product can be obtained.",
      description: "Black-widow alpha-latrotoxin triggers massive presynaptic neurotransmitter release, producing severe regional or generalized pain, rigid muscle spasm, diaphoresis, hypertension, tachycardia and autonomic distress. Equine antivenin binds circulating venom and can shorten active toxin exposure. Many patients recover with analgesia, benzodiazepines and supportive care, while horse-derived antibody can cause immediate anaphylaxis or delayed serum sickness. Selection therefore depends on severity, comorbidity, response to support and real-time product access rather than bite identification alone.",
      mechanism: "Polyclonal equine antibodies bind Latrodectus venom components in plasma, lowering the free fraction available to interact with presynaptic nerve terminals. Antibody cannot immediately reverse neurotransmitter already released or toxin already fixed to tissue, so pain and spasm may not disappear at the instant of infusion. The foreign equine proteins explain both neutralization and immune-reaction risk.",
      administrationTiming: ["Call Poison Help and the receiving pharmacy early for severe suspected latrodectism because this product is FDA licensed but sparsely stocked and real-time availability must be confirmed.", "Use the current label's reconstitution, sensitivity/risk assessment, dilution and slow IV administration in a monitored setting with epinephrine and airway support immediately available."],
      nursingEssentials: ["Confirm a compatible syndrome and exclude surgical abdomen, myocardial ischemia, tetanus and other mimics; preserve spider identification only when it can be done safely.", "Monitor airway, blood pressure, pulse, ECG, skin and respiratory status throughout administration because horse-derived antivenin can trigger rapidly progressive anaphylaxis; stop the infusion and treat the reaction promptly.", "Teach delayed serum-sickness symptoms such as fever, rash, arthralgia and lymph-node swelling and provide a clear return plan because they may appear after discharge."],
      keyLabs: ["Diagnosis is primarily clinical; ECG, CK, electrolytes, renal function and cardiac studies are guided by severity and differential diagnosis.", "Document vial/lot, access source, reaction history, infusion timing, pain/spasm response and discharge serum-sickness instructions."],
      adverseEffects: ["Immediate hypersensitivity and anaphylaxis can be life-threatening; fever and infusion reactions can occur.", "Delayed serum sickness can cause fever, rash, arthralgia and systemic symptoms days later."],
      contraindications: ["Prior horse-serum hypersensitivity raises risk but is a specialist risk-benefit decision in severe envenomation; supportive therapy remains available.", "Do not administer solely for a reported spider bite without a compatible clinically important syndrome."],
      escalationRecurrence: ["Airway symptoms, shock or anaphylaxis during infusion requires immediate emergency treatment.", "Refractory pain/spasm, severe hypertension, respiratory compromise, pregnancy concern, very young/older age or major comorbidity requires toxicology-guided monitored care."],
      evidenceLimitations: ["The product has a current U.S. biologic label, but institutional stocking is uncommon and supply must be verified through pharmacy and Poison Help. Comparative outcome evidence is limited."],
      nclexTraps: ["Antivenin is not automatically required for every black-widow bite; severity and reaction risk guide use.", "Improvement does not end monitoring for immediate anaphylaxis or delayed serum sickness."],
      sourceKeys: ["dailymed-latrodectus", "poison-help"]
    }),

    makeCard({
      name: "North American Coral Snake Antivenin",
      generic: "antivenin micrurus fulvius equine",
      aliases: ["coral snake antivenom", "coral snake antivenin", "NACSA", "Micrurus fulvius antivenin", "Eastern coral snake antivenin", "Texas coral snake antivenin", "Wyeth coral snake antivenin", "coral snake antidote"],
      brandExamples: ["North American Coral Snake Antivenin (Wyeth/Pfizer legacy product)"],
      class: "Equine North American coral-snake venom antivenin with time-critical access limitations",
      usedToTreat: "Eastern or Texas coral-snake envenomation under immediate poison-center and expert direction when a currently authorized, in-date product is actually available. Respiratory surveillance and ventilatory support remain lifesaving because antivenin may be unavailable and antibodies cannot reverse neurotoxin already bound at the motor end plate.",
      description: "North American Coral Snake Antivenin is an equine antivenin that binds circulating Eastern or Texas coral-snake venom before more neurotoxin reaches neuromuscular targets, limiting progression toward bulbar and respiratory paralysis. Coral-snake neurotoxins can cause delayed cranial weakness, ptosis, and dysphagia after deceptively mild local findings, so access and timing matter. On July 1, 2026, FDA extended the expiration of legacy lot CL6814 from June 30 through December 31, 2026 after reviewing stability and potency data, and FDA stated that no alternative product is licensed in the United States. The extension is lot- and date-specific, so teams must verify the exact stock and current FDA status rather than generalizing it to another lot or later date.",
      mechanism: "Equine antibodies bind free Micrurus venom components and reduce delivery to nicotinic neuromuscular targets. They cannot reliably reverse toxin already bound at the motor end plate, which explains continued progression or slow recovery and the need for early airway planning. Ventilation supports the patient until neuromuscular function returns; it is not a lesser substitute when antivenin is inaccessible but the definitive bridge that prevents hypoxic death.",
      administrationTiming: ["Immediately call Poison Help and a regional toxicologist for any credible coral-snake envenomation; do not wait for weakness before arranging transfer, respiratory monitoring and current access verification.", "The cited FDA notice, reviewed July 18, 2026, extends lot CL6814 through December 31, 2026. Before use, verify the vial lot, storage history, current FDA notice and poison-center recommendation because the authorization does not automatically apply to other lots or dates."],
      nursingEssentials: ["Perform serial cranial-nerve, speech, swallow, neck-flexion, limb-strength and respiratory assessments even when the bite site looks benign because neuroparalysis can be delayed and local swelling may remain minor.", "Trend respiratory rate, effort, vital capacity or other protocol respiratory measures, oxygenation and ventilation; pulse oximetry can remain normal until ventilation is failing.", "Keep airway equipment and an experienced intubation team ready, and avoid oral intake when bulbar weakness develops because impaired swallowing raises aspiration risk; document every poison-center/FDA access communication."],
      keyLabs: ["No routine venom level controls treatment. Use serial bedside neuromuscular and respiratory measurements, blood gas/capnography when indicated, ECG and general labs for critical illness.", "Record snake description/location, bite time, symptom progression, product lot/expiration, the exact current FDA authorization checked and consultant recommendations."],
      adverseEffects: ["Equine antivenin can cause immediate anaphylaxis and delayed serum sickness.", "The greater system hazard is false reassurance or delay while searching for unavailable antivenin, allowing preventable respiratory arrest."],
      contraindications: ["Do not apply the CL6814 extension to a different lot or use it beyond December 31, 2026 without a newer FDA action; a fixed reference statement cannot verify an individual vial's authorization or storage integrity.", "Horse-serum sensitivity increases reaction risk but must be weighed by experts against progressive paralysis when authorized product is available."],
      escalationRecurrence: ["Ptosis, dysarthria, dysphagia, weakness, declining respiratory measures, hypercapnia or increased work of breathing requires ICU airway escalation immediately.", "Any antivenin reaction requires emergency treatment while respiratory paralysis from venom remains actively managed."],
      evidenceLimitations: ["Availability is highly time-sensitive. FDA's July 1, 2026 notice extends only lot CL6814 through December 31, 2026 and reports no U.S.-licensed alternative; real-time FDA, pharmacy and poison-center verification remains necessary."],
      nclexTraps: ["Minimal swelling does not mean minimal danger; coral-snake paralysis can be delayed.", "Antivenin access problems never justify waiting to prepare ventilatory support."],
      sourceKeys: ["fda-coral", "poison-help"]
    }),

    makeCard({
      name: "Ethanol for toxic alcohol poisoning",
      generic: "ethanol alcohol dehydrogenase blockade",
      aliases: ["ethanol antidote", "alcohol antidote for methanol", "ethanol for ethylene glycol", "toxic alcohol ethanol infusion", "ADH substrate blocker", "methanol ethanol treatment", "antifreeze ethanol antidote", "ethyl alcohol antidote"],
      class: "Competitive alcohol-dehydrogenase substrate used as a fallback toxic-alcohol antidote",
      usedToTreat: "Methanol or ethylene-glycol poisoning only when fomepizole is unavailable or a medical toxicologist selects ethanol, with protocol-driven loading, maintenance, concentration monitoring and dialysis adjustment.",
      description: "Ethanol is a fallback toxic-alcohol antidote that acts as a preferred alcohol-dehydrogenase substrate, occupying the enzyme so methanol and ethylene glycol form fewer toxic metabolites when fomepizole is unavailable. A controlled ethanol concentration slows formation of formate or glycolate and oxalate, buying time for parent-alcohol elimination or dialysis. Ethanol itself can cause intoxication, hypoglycemia, vomiting, respiratory depression and unstable concentrations, making it harder and less predictable than fomepizole. This is neither beverage-alcohol advice nor a home remedy, and monitored dosing cannot be replaced by a casual IV calculation.",
      mechanism: "Ethanol competes as a high-affinity substrate at alcohol dehydrogenase. While the enzyme metabolizes ethanol, less methanol becomes formate and less ethylene glycol becomes glycolate and oxalate. Protection lasts only while the target ethanol concentration is maintained; metabolism, changing volume, prior alcohol use and extracorporeal clearance can all lower it. Ethanol does not remove metabolites already formed, so severe acidosis, vision injury, kidney injury or EXTRIP criteria still require bicarbonate and ECTR.",
      administrationTiming: ["Prefer fomepizole when available. If ethanol is selected, use a poison-center/medical-toxicology protocol and pharmacy-prepared pharmaceutical product by the directed route; never instruct a patient to self-treat with beverage alcohol.", "Measure concentrations and adjust the infusion frequently, especially during hemodialysis because ECTR removes ethanol. Continue until toxin-specific stopping criteria are met."],
      nursingEssentials: ["Use an independent check for product concentration, loading calculation, infusion rate and line because ethanol preparations and dilution methods vary and dosing errors can be severe.", "Monitor airway, sedation, glucose, blood pressure, sodium/osmolality and ethanol concentrations at protocol intervals because ethanol can cause respiratory depression, hypoglycemia, hypotension and osmolar shifts while an inadequate level allows toxic metabolism to resume; chronic alcohol use changes dose requirements but does not remove toxicity risk.", "Continue methanol visual/neurologic surveillance or ethylene-glycol renal/calcium surveillance and arrange ECTR when indicated because adequate ethanol does not reverse established metabolites."],
      keyLabs: ["Serial ethanol and toxic-alcohol concentrations, blood gas, anion gap, measured osmolality/osmol gap, glucose, electrolytes, renal/hepatic function and toxin-specific studies.", "During ECTR, obtain the protocol-specified ethanol levels and document every rate change because a gap in target concentration allows toxic metabolism to resume."],
      adverseEffects: ["CNS and respiratory depression, vomiting/aspiration, hypoglycemia, hypotension, phlebitis, pancreatitis and electrolyte/osmolar disturbances can occur.", "Under-dosing permits toxic-metabolite formation; over-dosing adds ethanol poisoning and complicates neurologic assessment."],
      contraindications: ["Do not use beverage alcohol, unsupervised enteral alcohol or an improvised infusion because an uncontrolled concentration can permit toxic metabolism when too low and add ethanol poisoning when too high. This is monitored off-label hospital therapy.", "Do not choose ethanol simply because an osmol gap is present; confirm a credible toxin and toxicology indication, and do not delay fomepizole or dialysis when available/needed."],
      escalationRecurrence: ["Falling ethanol below protocol target, worsening acidosis, visual change, coma, seizure, kidney injury or shock requires immediate toxicology reassessment and ECTR evaluation.", "Recurrent gap or toxicity after stopping requires renewed ADH blockade and clearance assessment."],
      evidenceLimitations: ["No dedicated FDA-approved U.S. ethanol antidote product was identified for this use. Treatment is off-label, protocol-dependent and less predictable than fomepizole; real-time poison-center guidance is essential."],
      nclexTraps: ["Ethanol prevents formation of new toxic metabolites but does not remove metabolites already present.", "Never recommend drinking alcohol as home treatment; monitored pharmaceutical dosing and serial concentrations are required."],
      sourceKeys: ["extrip-methanol", "extrip-ethylene-glycol", "poison-help"]
    }),

  ];

  const cardNames = cards.map((card) => card.name);
  const newCardNames = [
    "Extracorporeal treatment for poisoning",
    "Hemodialysis for methanol and ethylene glycol poisoning",
    "Hemodialysis for salicylate poisoning",
    "Hemodialysis for lithium poisoning",
    "Extracorporeal treatment for metformin poisoning",
    "Extracorporeal treatment for valproate poisoning",
    "Folic acid and leucovorin for methanol poisoning",
    "Calcium treatment for hydrofluoric acid exposure",
    "Cholestyramine and activated-charcoal accelerated elimination"
  ];
  const upgradedCardNames = [
    "Dantrolene",
    "Potassium iodide for radioiodine thyroid blocking",
    "Whole bowel irrigation with polyethylene glycol-electrolyte solution",
    "Tetanus immune globulin",
    "Phentolamine for norepinephrine extravasation",
    "Raxibacumab",
    "Obiltoxaximab",
    "Anthrax immune globulin intravenous",
    "Black widow spider antivenin",
    "North American Coral Snake Antivenin",
    "Ethanol for toxic alcohol poisoning"
  ];
  const highRiskNames = cardNames.slice();

  const targetByName = new Map(cards.map((card) => [normalize(card.name), normalize(card.name)]));
  const legacyNameToTarget = new Map([
    [normalize("Dantrolene"), normalize("Dantrolene")],
    [normalize("Dantrolene sodium"), normalize("Dantrolene")],
    [normalize("Potassium iodide"), normalize("Potassium iodide for radioiodine thyroid blocking")],
    [normalize("Whole bowel irrigation solution"), normalize("Whole bowel irrigation with polyethylene glycol-electrolyte solution")],
    [normalize("Tetanus Immune Globulin"), normalize("Tetanus immune globulin")],
    [normalize("Phentolamine"), normalize("Phentolamine for norepinephrine extravasation")],
    [normalize("Raxibacumab"), normalize("Raxibacumab")],
    [normalize("Obiltoxaximab"), normalize("Obiltoxaximab")],
    [normalize("Anthrasil"), normalize("Anthrax immune globulin intravenous")],
    [normalize("Anthrax immune globulin human"), normalize("Anthrax immune globulin intravenous")],
    [normalize("Latrodectus Mactans Antivenin"), normalize("Black widow spider antivenin")],
    [normalize("Antivenin Latrodectus mactans"), normalize("Black widow spider antivenin")],
    [normalize("North American Coral Snake Antivenin"), normalize("North American Coral Snake Antivenin")],
    [normalize("Ethanol antidote"), normalize("Ethanol for toxic alcohol poisoning")]
  ]);

  const identityKeys = (drug) => unique([
    drug && drug.displayName,
    drug && drug.name,
    drug && drug.generic
  ]).map(normalize).filter(Boolean);
  const cardTargetByIdentity = new Map();
  cards.forEach((card) => {
    const target = normalize(card.name);
    identityKeys(card).forEach((identity) => cardTargetByIdentity.set(identity, target));
  });
  const resolveTarget = (drug) => {
    const identities = identityKeys(drug);
    for (const identity of identities) {
      if (legacyNameToTarget.has(identity)) return legacyNameToTarget.get(identity);
    }
    for (const identity of identities) {
      if (cardTargetByIdentity.has(identity)) return cardTargetByIdentity.get(identity);
    }
    return "";
  };

  const priorByTarget = new Map();
  db.drugs.forEach((drug) => {
    const target = resolveTarget(drug);
    if (!target || !targetByName.has(target)) return;
    if (!priorByTarget.has(target)) priorByTarget.set(target, []);
    priorByTarget.get(target).push(drug);
  });

  const mergedCards = cards.map((card) => {
    const target = normalize(card.name);
    const priors = priorByTarget.get(target) || [];
    const merged = Object.assign({}, ...priors, card);
    merged.name = card.name;
    merged.generic = card.generic;
    merged.displayName = card.name;
    merged.aliases = unique([
      ...priors.flatMap((item) => item.aliases || []),
      ...priors.map(primaryName),
      ...(card.aliases || [])
    ]).filter((alias) => normalize(alias) !== normalize(card.name));
    merged.brandExamples = unique([
      ...priors.flatMap((item) => item.brandExamples || []),
      ...(card.brandExamples || [])
    ]);
    merged.categories = unique([
      ...priors.flatMap((item) => item.categories || []),
      ...(card.categories || []),
      TOX_CATEGORY
    ]);
    merged.tags = unique([
      ...priors.flatMap((item) => item.tags || []),
      ...(card.tags || [])
    ]).filter((tag) => !/generated-placeholder|hidden-combination-product|components-have-standalone-cards|pharm-integrity-hidden-combo/i.test(String(tag)));
    merged.sourceKeys = card.sourceKeys;
    merged.sourceNote = card.sourceNote;
    merged.studentFacing = true;
    merged.hidden = false;
    merged.combinationProduct = false;
    merged.deprecatedCombinationProduct = false;
    merged.antidoteWave28Revision = VERSION;
    return merged;
  });

  const retainedDrugs = db.drugs.filter((drug) => !resolveTarget(drug));
  const priorObjectsMatched = db.drugs.length - retainedDrugs.length;
  db.drugs = retainedDrugs.concat(mergedCards);

  const preexistingTargets = cardNames.filter((name) => (priorByTarget.get(normalize(name)) || []).length > 0);
  const addedTargets = cardNames.filter((name) => (priorByTarget.get(normalize(name)) || []).length === 0);
  const unresolvedUpgradeTargets = upgradedCardNames.filter((name) => !preexistingTargets.includes(name));

  window.ANI_ANTIDOTE_WAVE28 = {
    schemaVersion: SCHEMA_VERSION,
    version: VERSION,
    cardNames: cardNames.slice(),
    newCardNames: newCardNames.slice(),
    upgradedCardNames: upgradedCardNames.slice(),
    highRiskNames: highRiskNames.slice(),
    sourceRefs,
    application: {
      attempted: cardNames.length,
      applied: mergedCards.length,
      appliedNames: cardNames.slice(),
      priorObjectsMatched,
      removedLegacyObjects: priorObjectsMatched,
      preexistingTargets,
      addedTargets,
      unresolvedUpgradeTargets,
      duplicatePreventionStrategy: "Normalized primary identity plus explicit legacy-name mapping; all matched shadows are removed before one canonical card per target is appended."
    },
    counts: {
      cards: cardNames.length,
      newCards: newCardNames.length,
      upgradedCards: upgradedCardNames.length,
      highRiskCards: highRiskNames.length,
      sources: Object.keys(sourceRefs).length,
      priorObjectsMatched,
      activeCanonicalCards: mergedCards.length
    }
  };
}());
