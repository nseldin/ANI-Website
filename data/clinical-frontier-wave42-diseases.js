/* eslint-disable */
/* Wave 42: mechanism-first disease expansion across neonatal, obstetric, and psychiatric care. */
(function () {
  "use strict";

  const VERSION = "2026-07-22-wave42-diseases-1";
  const SOURCE_NOTE = "This mechanism-first educational reference follows the cited neonatal infection, obstetric hemorrhage, and bipolar-disorder guidance. It supports education, nursing assessment, and recognition of emergencies; it does not replace current local neonatal antibiograms, obstetric hemorrhage protocols, psychiatric prescribing guidance, specialist judgment, or individualized orders.";

  if (window.ANI_PATHOLOGY_WAVE42_DISEASES && window.ANI_PATHOLOGY_WAVE42_DISEASES.version === VERSION) return;

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) {
    window.ANI_PATHOLOGY_WAVE42_DISEASES = Object.freeze({
      schemaVersion: 1,
      version: VERSION,
      applied: false,
      reason: "ANI pathology database was unavailable."
    });
    return;
  }

  const clean = (value) => String(value || "").trim();
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

  const sourceReferences = [
    {
      key: "w42-aap-eos-term-2018",
      label: "American Academy of Pediatrics: Management of Neonates Born at 35 Weeks or More With Suspected or Proven Early-Onset Bacterial Sepsis (2018)",
      url: "https://publications.aap.org/pediatrics/article/142/6/e20182894/37522/Management-of-Neonates-Born-at-35-0-7-Weeks",
      note: "Supports gestational-age-specific early-onset sepsis risk assessment, serial observation, culture-based diagnosis, empirical treatment, and antibiotic stewardship in infants born at 35 weeks or more."
    },
    {
      key: "w42-aap-eos-preterm-2018",
      label: "American Academy of Pediatrics: Management of Neonates Born at 34 6/7 Weeks or Less With Suspected or Proven Early-Onset Bacterial Sepsis (2018)",
      url: "https://publications.aap.org/pediatrics/article/142/6/e20182896/37519/Management-of-Neonates-Born-at-34-6-7-Weeks",
      note: "Supports separate assessment of preterm infants, use of delivery circumstances rather than a term-infant calculator, blood culture as the diagnostic standard, and empirical ampicillin plus gentamicin for typical early-onset risk under local guidance."
    },
    {
      key: "w42-cdc-gbs-guidance-2025",
      label: "US CDC: Clinical Guidelines for Group B Streptococcal Disease (2025)",
      url: "https://www.cdc.gov/group-b-strep/hcp/clinical-guidance/index.html",
      note: "Identifies the current coordinated obstetric and pediatric guidance for prevention and management of early- and late-onset group B streptococcal disease."
    },
    {
      key: "w42-who-young-infant-sbi-2024",
      label: "World Health Organization: Management of Serious Bacterial Infections in Infants Aged 0-59 Days (2024)",
      url: "https://www.who.int/publications/i/item/9789240102903/",
      note: "Supports recognition, referral, hospital management, and resource-aware care of serious bacterial infection, sepsis, meningitis, and pneumonia in young infants."
    },
    {
      key: "w42-cdc-nicu-clabsi-2024",
      label: "US CDC: Prevention and Control of Central Line-Associated Bloodstream Infection in NICU Patients",
      url: "https://www.cdc.gov/infection-control/media/pdfs/Guideline-NICU-CLABSI-508.pdf",
      note: "Supports neonatal central-line infection prevention and the importance of device necessity, aseptic access, maintenance bundles, and surveillance in late-onset infection risk."
    },
    {
      key: "w42-bjae-uterine-inversion-2024",
      label: "British Journal of Anaesthesia Education: Uterine inversion (2024)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10928309/",
      note: "Supports classification, pathophysiology, recognition of hemorrhagic and neurogenic shock, immediate replacement, uterine relaxation when needed, escalation to operative reduction, and post-reduction care."
    },
    {
      key: "w42-sahealth-uterine-inversion-v6",
      label: "SA Health: Uterine Inversion Perinatal Practice Guideline, version 6.0",
      url: "https://www.sahealth.sa.gov.au/wps/wcm/connect/09c138804eee7aaf804aa36a7ac0d6e4/Uterine%2Binversion_PPG_v6_0_.pdf?MOD=AJPERES",
      note: "Supports emergency team activation, simultaneous resuscitation, immediate manual replacement, leaving an attached placenta until reduction, tocolysis or anesthesia when required, operative escalation, and uterotonics after successful replacement."
    },
    {
      key: "w42-who-pph-2025",
      label: "WHO, FIGO, and ICM: Consolidated Guidelines for Prevention, Diagnosis and Treatment of Postpartum Haemorrhage (2025)",
      url: "https://www.who.int/publications/i/item/9789240115637",
      note: "Supports rapid recognition, quantified blood-loss assessment, first-response hemorrhage care, transfusion and escalation systems, and supportive care while the cause-specific inversion response proceeds."
    },
    {
      key: "w42-vadod-bipolar-2023",
      label: "VA/DoD Clinical Practice Guideline for Management of Bipolar Disorder (2023)",
      url: "https://healthquality.va.gov/HEALTHQUALITY/guidelines/MH/bd/VA-DoD-CPG-BD-Full-CPGFinal508.pdf",
      note: "Supports the required bipolar II history of hypomania and major depression without mania, structured assessment, suicide-risk management, acute bipolar depression care, and maintenance treatment."
    },
    {
      key: "w42-nice-bipolar-2025",
      label: "NICE CG185: Bipolar Disorder - Assessment and Management (updated 2025)",
      url: "https://www.nice.org.uk/guidance/cg185",
      note: "Supports recognition, differential diagnosis, collaborative care, psychological treatment, medication monitoring, pregnancy considerations, crisis planning, and long-term relapse prevention across bipolar I and II disorders."
    },
    {
      key: "w42-nimh-bipolar-current",
      label: "US National Institute of Mental Health: Bipolar Disorder",
      url: "https://www.nimh.nih.gov/health/publications/bipolar-disorder",
      note: "Supports natural-language explanation of bipolar II, overlooked hypomania, the burden of depression and suicide risk, longitudinal diagnosis, medication and psychotherapy, and antidepressant-switch safety."
    },
    {
      key: "w42-canmat-isbd-bipolar-2023",
      label: "CANMAT and ISBD: Bipolar Disorder Guidelines Summary and 2023 Evidence Update",
      url: "https://psychiatryonline.org/doi/10.1176/appi.focus.20230009",
      note: "Supports bipolar II diagnostic boundaries, episode-specific treatment, maintenance options, psychoeducation, and cautious or avoided antidepressant use with mixed features, rapid cycling, or prior treatment-emergent elevation."
    }
  ];

  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];
  sourceReferences.forEach((source) => {
    const existing = database.sourceReferences.find((item) => clean(item && (item.key || item.id)) === source.key);
    if (existing) Object.assign(existing, source);
    else database.sourceReferences.push({ ...source });
  });

  function completeCard(spec) {
    return {
      nclexEssential: true,
      sourceNote: SOURCE_NOTE,
      abbreviations: [],
      ambiguousAbbreviations: [],
      commonMisspellings: [],
      tags: [],
      ...spec,
      displayName: spec.displayName || spec.name
    };
  }

  const neonatalSepsis = completeCard({
    name: "Neonatal sepsis",
    category: "Neonatology, Pediatrics, Infectious Disease & Critical Care",
    definition: "Neonatal sepsis is a life-threatening systemic infection in a newborn, usually involving bacteria in the blood and sometimes meningitis, pneumonia, urinary infection, or another invasive focus. Newborns can deteriorate before they develop a high fever because innate immune defenses, skin and mucosal barriers, complement, antibody protection, and physiologic reserves are still developing. The safest mental model is therefore not 'fever equals sepsis,' but 'a new change in breathing, temperature, feeding, activity, perfusion, glucose, or behavior may be infection until the whole clinical picture proves otherwise.' Early-onset and late-onset disease are related but not interchangeable: their acquisition routes, organisms, risk assessment, culture strategy, and empirical antibiotics differ. Premature infants also require a separate risk framework from term infants rather than inheriting a healthy-term newborn algorithm.",
    classification: [
      "Early-onset sepsis generally begins during the first 72 hours after birth in neonatal practice, although surveillance systems and publications sometimes use the first 6 or 7 days. The team must state the cutoff being used rather than mixing definitions.",
      "Late-onset sepsis begins after the early-onset window, often after 72 hours, and may be tracked through 28 or 90 days depending on the organism and system. It can be community acquired or health care associated, including central-line infection.",
      "Culture-confirmed sepsis means a credible pathogen is recovered from blood or cerebrospinal fluid in a clinically compatible infant. Culture-negative clinical sepsis is a working diagnosis of exclusion and must not be inferred from a CBC or C-reactive protein alone.",
      "Meningitis, pneumonia, urinary tract infection, osteoarticular infection, omphalitis, skin or soft-tissue infection, and necrotizing enterocolitis can coexist with bloodstream infection or mimic it and require site-specific evaluation."
    ],
    pathology: "Early-onset infection usually begins before or during birth. Organisms from the maternal genital or gastrointestinal tract ascend through ruptured or microscopically disrupted membranes, contaminate amniotic fluid, and are inhaled or swallowed by the fetus, or enter during delivery. Group B Streptococcus is a leading cause in term infants, while Escherichia coli carries a disproportionate burden in preterm and very-low-birthweight infants. Late-onset infection is more often acquired from caregivers, the environment, human contact, respiratory or gastrointestinal colonization, or invasive devices. Once organisms cross a neonatal barrier, pathogen products and an immature but powerful inflammatory response cause endothelial leak, vasodilation, myocardial dysfunction, impaired oxygen delivery, microvascular injury, and disordered coagulation. The same cascade explains why subtle apnea or poor feeding can progress to hypotension, metabolic acidosis, disseminated intravascular coagulation, respiratory failure, and multiorgan injury.",
    pathophysiology: [
      "Barrier entry comes first. In early-onset disease, ascending intra-amniotic infection, prolonged or preterm rupture of membranes, maternal GBS colonization, or infected fluid can expose fetal lungs, gut, skin, and blood before birth. In late-onset disease, a central line, endotracheal tube, injured skin, umbilicus, gastrointestinal disease, or dense colonization creates a route from the outside environment into normally sterile tissue.",
      "Immature host defense allows invasion. Newborn neutrophil recruitment, complement activity, antibody repertoire, and barrier integrity are limited; prematurity reduces these defenses further. A smaller inoculum can therefore produce invasive disease, and the infant may not localize infection with pus, redness, or fever.",
      "Systemic inflammation disrupts circulation. Cytokines and microbial products cause capillary leak and vasodilation, while hypoxia and inflammatory mediators impair myocardial performance. Relative or absolute intravascular depletion reduces tissue perfusion, which raises lactate and worsens acidosis.",
      "Organ reserve is quickly exhausted. Apnea and respiratory distress reflect lung disease, brainstem effects, metabolic acidosis, or fatigue. Glucose can fall because infection increases demand while intake and glycogen stores are limited, or rise through stress hormones. Kidney, liver, brain, marrow, and coagulation function can fail together.",
      "Prematurity changes both cause and consequence. Extremely preterm infants have thinner barriers, more devices, longer hospitalization, different pathogen exposure, smaller blood volume for cultures, and higher mortality. Respiratory instability that might be transitional in a term newborn can be infection, prematurity, or both, so delivery circumstances and serial trajectory matter.",
      "Unnecessary antibiotics also cause harm. Prolonged empirical exposure in uninfected infants can disrupt the microbiome, select resistant organisms, increase invasive fungal risk, separate families, interfere with feeding, and in preterm populations is associated with necrotizing enterocolitis and other adverse outcomes. Prompt treatment and prompt de-escalation are both safety goals."
    ],
    etiology: "Early-onset bacterial sepsis commonly involves GBS and E. coli; other gram-negative bacilli, viridans streptococci, enterococci, and Listeria occur less often and patterns vary by region and gestational age. Late-onset disease includes coagulase-negative staphylococci in device-associated settings, Staphylococcus aureus, gram-negative bacilli, GBS, enterococci, and Candida, with the likely organism shaped by birth setting, age, devices, nutrition, surgery, colonization, and the local antibiogram. Viral infections, especially neonatal herpes simplex virus, enterovirus, and parechovirus, can produce a sepsis-like syndrome but require different testing and treatment. A positive culture with a common skin organism must be interpreted using collection quality, number and timing of cultures, devices, symptoms, and repeat results rather than automatically labeled contamination or true infection.",
    riskFactors: [
      "Early onset: maternal intra-amniotic infection or fever, GBS colonization without adequate indicated prophylaxis, GBS bacteriuria, a previous infant with invasive GBS disease, prolonged rupture of membranes, preterm labor, preterm prelabor rupture, or unexplained fetal compromise",
      "Preterm birth, very low birth weight, impaired placental or fetal condition, resuscitation needs, and birth following labor or membrane rupture; gestational age is one of the strongest predictors of early-onset risk",
      "Late onset: central venous or umbilical catheter, parenteral nutrition, mechanical ventilation, surgery, prolonged hospitalization, frequent skin breaks, broad antibiotics, or delayed full enteral feeding",
      "Necrotizing enterocolitis, skin or umbilical infection, urinary tract abnormality, pneumonia, meningitis exposure, household infection, or poor access to prompt follow-up",
      "Immune compromise, asplenia, congenital anomaly, and maternal or neonatal HSV risk clues; these can broaden the differential beyond routine bacterial sepsis"
    ],
    signsSymptoms: [
      "Temperature instability may mean fever, hypothermia, or failure to maintain temperature. Absence of fever never reassures by itself in a newborn.",
      "Respiratory clues include apnea, bradycardia, tachypnea, grunting, retractions, cyanosis, rising oxygen need, ventilator deterioration, or an infant who fails to improve as expected after birth.",
      "Neurologic and behavioral clues include reduced alertness, weak cry, hypotonia, irritability, poor state regulation, seizures, a bulging fontanelle, or a caregiver's observation that the infant is simply not acting normally.",
      "Feeding and gastrointestinal clues include weak suck, feeding intolerance, vomiting, abdominal distention, diarrhea, bloody stool, reduced intake, or new glucose instability. These findings overlap necrotizing enterocolitis and metabolic disease.",
      "Circulatory clues include pallor, mottling, prolonged capillary refill, cool extremities, weak pulses, tachycardia or bradycardia, hypotension, reduced urine output, edema from capillary leak, or metabolic acidosis.",
      "Focal clues include pustules or vesicles, omphalitis, cellulitis, joint swelling or reduced limb movement, eye discharge, pneumonia findings, urinary abnormalities, or line-site inflammation. Serious bloodstream infection can still occur without a focal sign."
    ],
    diagnostics: [
      "Stabilize airway, breathing, circulation, temperature, and glucose while obtaining cultures; do not postpone antibiotics in an ill infant for a difficult specimen or imaging study. Record antibiotic time relative to every culture because pretreatment lowers yield.",
      "Obtain an adequately collected blood culture before antibiotics whenever this does not delay care. Blood volume, asepsis, bottle choice, and prompt transport affect sensitivity; a negative low-volume culture is less reassuring than a properly collected specimen.",
      "Perform lumbar puncture for cerebrospinal fluid cell count, glucose, protein, Gram stain, culture, and targeted molecular tests when meningitis is suspected, blood culture is positive, or illness strongly supports sepsis, provided the infant can tolerate the procedure and it does not delay stabilization. A negative blood culture does not completely exclude meningitis.",
      "For suspected late-onset disease, obtain a catheterized or suprapubic urine culture as indicated because urinary infection is meaningful after the immediate birth period. Routine urine culture is generally not part of an uncomplicated early-onset evaluation acquired before birth.",
      "CBC indices, immature-to-total neutrophil ratio, CRP, procalcitonin, lactate, blood gas, glucose, coagulation tests, renal and liver studies can describe severity or support serial decisions but cannot diagnose or exclude neonatal sepsis alone. Trends are more useful than one abnormal inflammatory marker.",
      "Use chest imaging for respiratory disease, abdominal imaging for suspected necrotizing enterocolitis, echocardiography for persistent shock or pulmonary hypertension, and focused studies for bone, joint, soft-tissue, or urinary sources. Imaging supports a suspected focus; it must not delay treatment of systemic instability.",
      "For early-onset risk in infants born at 35 weeks or more, use the institution's AAP-consistent pathway: categorical risk assessment, a validated multivariable calculator, or structured serial examinations. A calculator estimate never overrides a clinically ill infant.",
      "For infants born at 34 6/7 weeks or less, use preterm-specific assessment based on the circumstances of delivery and the infant's course. Do not apply a healthy-term newborn pathway or a sepsis calculator below its validated gestational age. Preterm birth after maternal noninfectious indication, cesarean delivery, no labor, and intact membranes differs from preterm birth after labor, membrane rupture, suspected intra-amniotic infection, or unexplained fetal compromise.",
      "Evaluate sepsis mimics in parallel: transient tachypnea, respiratory distress syndrome, meconium aspiration, congenital heart disease, persistent pulmonary hypertension, hypoglycemia, electrolyte or inborn metabolic disease, intracranial injury, drug exposure or withdrawal, adrenal insufficiency, necrotizing enterocolitis, and viral infection."
    ],
    assessment: "Use serial, gestational-age-aware assessment rather than one normal examination. Establish gestational and postnatal age, birth circumstances, maternal temperature and cultures, rupture duration, GBS status and intrapartum treatment, resuscitation, baseline respiratory needs, devices, feeds, prior antibiotics, local outbreaks, and family observations. Examine temperature, respiratory effort and apnea, color, perfusion, pulses, capillary refill, blood pressure, tone, alertness, cry, fontanelle, glucose, abdomen, skin, umbilicus, joints, urine output, and every invasive line. Compare the infant with their own prior trend: a preterm infant's baseline apnea or oxygen need does not make new deterioration normal. Document whether the working problem is early-onset or late-onset, community or health care associated, term or preterm, culture-confirmed or suspected, and whether meningitis, HSV, NEC, or a device source remains possible.",
    differential: "The differential is broad because newborns have a limited set of responses to illness. Respiratory distress syndrome, transient tachypnea, aspiration, pneumothorax, congenital pneumonia, persistent pulmonary hypertension, and duct-dependent congenital heart disease can resemble pulmonary sepsis. Hypoglycemia, hypocalcemia, adrenal disease, and inborn errors can cause lethargy, apnea, acidosis, or seizures. Intracranial hemorrhage, hypoxic-ischemic injury, medication exposure, withdrawal, and nonaccidental injury may alter neurologic behavior. NEC, bowel obstruction, feeding intolerance, and milk-protein inflammation can mimic abdominal infection. Neonatal HSV, enterovirus, parechovirus, and congenital infections need organism-specific testing and therapy. A common skin organism in one culture may be contamination, but dismissing it without considering a central line, repeated positivity, and clinical deterioration can miss true late-onset infection.",
    treatments: [
      "Begin neonatal resuscitation and sepsis support immediately when indicated: maintain airway and ventilation, normothermia, oxygen delivery, glucose, perfusion, and urine output; obtain neonatal intensive care and infectious-disease support for critical illness. Fluid, vasoactive, ventilation, and transfusion decisions must account for gestational age, myocardial function, pulmonary hypertension, capillary leak, and the danger of fluid overload.",
      "For typical early-onset bacterial risk, ampicillin plus gentamicin is a common initial regimen in AAP guidance because it covers GBS, Listeria, and many gram-negative organisms while limiting unnecessary broad cephalosporin exposure. The actual regimen and dosing must follow gestational age, postnatal age, kidney function, meningitis concern, local susceptibility, and neonatal pharmacy protocol.",
      "Late-onset empirical therapy must reflect community versus NICU acquisition, central-line history, prior cultures and antibiotics, MRSA prevalence, gram-negative resistance, fungal risk, and the suspected focus. Do not copy the early-onset regimen or default indefinitely to vancomycin and maximal gram-negative coverage without local evidence and stewardship review.",
      "Add acyclovir promptly under the neonatal HSV pathway when vesicles, seizures, hepatitis or coagulopathy, severe unexplained illness, CSF findings, maternal primary infection, or another credible clue raises concern. Acyclovir does not treat bacterial sepsis, and antibacterial therapy should continue until bacterial risk is resolved.",
      "Narrow therapy to the organism, susceptibility, infection site, and sterile follow-up cultures. Meningitis, osteoarticular infection, endovascular infection, deep abscess, and some gram-negative or fungal infections require longer and more site-specific treatment than uncomplicated bacteremia.",
      "Remove or replace an infected central line when source control and access needs support that decision. Culture timing, hemodynamic stability, pathogen, persistent bacteremia, thrombosis, and the need for nutrition or vasoactive access shape the plan.",
      "Stop empirical antibiotics when cultures remain negative and serial clinical and laboratory evidence makes bacterial infection unlikely under the institutional pathway. Continuing because one CBC or CRP is abnormal exposes an uninfected infant without proving benefit.",
      "Support human milk and family contact when clinically safe, treat a focal source, and use developmentally appropriate pain and neuroprotective care. Isolation or precautions follow the suspected organism and facility policy rather than the generic word sepsis."
    ],
    contraindications: [
      "Do not wait for fever, hypotension, or a positive culture before treating a clinically deteriorating newborn; these may be late findings.",
      "Do not diagnose or exclude sepsis using CBC, CRP, procalcitonin, lactate, or a risk calculator alone. A clinically ill infant requires evaluation and treatment regardless of a low calculated estimate.",
      "Do not apply a term-infant early-onset pathway to an infant born at 34 6/7 weeks or less, and do not interpret expected prematurity-related instability without examining whether it is new or worsening.",
      "Do not treat late-onset sepsis as if it inherited early-onset organisms and antibiotics. Devices, NICU ecology, community exposure, urine, meningitis, and fungal or viral risk change the plan.",
      "Avoid routine ceftriaxone in neonates because bilirubin displacement and calcium-containing intravenous solutions can create serious safety problems; use neonatal formulary guidance for any cephalosporin.",
      "Do not continue broad empirical antibiotics solely because an inflammatory marker remains abnormal when cultures, examination, and trajectory argue against bacterial disease. Conversely, do not stop solely because one marker is normal.",
      "Do not label a positive common-commensal culture contamination without reviewing collection quality, devices, repeated cultures, time to positivity, and the infant's clinical course."
    ],
    nursingPriorities: [
      "Recognize change early. Trend temperature, respiratory rate and effort, apnea and bradycardia, oxygen and ventilator needs, heart rate, blood pressure, capillary refill, pulses, color, tone, alertness, cry, feeding, abdominal findings, glucose, urine output, and pain using the same method and gestationally appropriate ranges.",
      "Activate the neonatal sepsis pathway for deterioration, obtain ordered blood and other cultures with meticulous asepsis and documented volumes, and give the first antimicrobial doses on time. Record whether cultures preceded antibiotics and immediately report collection difficulty rather than quietly accepting an inadequate specimen.",
      "Maintain thermoregulation and cardiorespiratory monitoring, verify weight-based doses and renal intervals, use independent checks for high-alert medications, and monitor gentamicin or other therapeutic levels according to protocol. Observe IV sites and central lines closely because infiltration can interrupt time-critical therapy.",
      "Assess perfusion and response to fluids or vasoactive therapy minute by minute during shock. Report rising lactate or acidosis, weaker pulses, longer capillary refill, oliguria, hepatomegaly, crackles, edema, or increasing oxygen need because both under-resuscitation and overload injure newborns.",
      "Use central-line and ventilator bundles, scrub every hub, maintain dressing integrity, review device necessity daily, protect skin, and use hand hygiene before every contact. Prevention of late-onset sepsis is a bedside action repeated at each access, not a one-time order.",
      "Protect nutrition and neurodevelopment. Coordinate expressed human milk, feeding holds or restart decisions, glucose support, oral care, minimal handling when unstable, sleep, skin-to-skin care when safe, and family presence without allowing routine separation to replace clinical reasoning.",
      "Communicate uncertainty precisely at handoff: early versus late onset, term versus preterm pathway, maternal and delivery risks, culture sites and times, antibiotics and doses, current devices, suspected focus, HSV or meningitis concern, hemodynamic trend, and explicit criteria for narrowing or stopping therapy.",
      "Teach caregivers that subtle change matters and invite them to report poor feeding, altered cry, color, temperature, breathing, activity, wet diapers, rash, or a sense that the baby is different. Family observations are clinical data, not interruptions."
    ],
    redFlags: [
      "Apnea, cyanosis, grunting, severe retractions, rapidly rising oxygen or ventilator need, or recurrent bradycardia",
      "Mottling, weak pulses, prolonged capillary refill, hypotension, oliguria, rising lactate or metabolic acidosis, hypothermia, or rapidly changing temperature",
      "Marked lethargy, hypotonia, inconsolable irritability, seizure, bulging fontanelle, weak cry, or inability to feed",
      "Vesicles, hepatitis, coagulopathy, seizures, or severe unexplained illness that could represent neonatal HSV",
      "Abdominal distention, bilious emesis, bloody stool, discoloration, tenderness, or concern for necrotizing enterocolitis",
      "Persistent positive cultures, a new murmur or embolic finding, focal bone or joint findings, line-site infection, or deterioration despite appropriate initial therapy"
    ],
    complications: [
      "Septic shock, respiratory failure, persistent pulmonary hypertension, myocardial dysfunction, acute kidney or liver injury, DIC, adrenal dysfunction, and multiorgan failure",
      "Meningitis, ventriculitis, seizures, stroke, hearing loss, cerebral palsy, and long-term neurodevelopmental impairment",
      "Pneumonia, urinary infection, osteomyelitis, septic arthritis, endocarditis, abscess, central-line thrombosis, and recurrent bacteremia",
      "Necrotizing enterocolitis, feeding failure, growth impairment, prolonged ventilation and hospitalization, and death",
      "Medication nephrotoxicity or ototoxicity, line complications, resistant or fungal infection, microbiome disruption, and family separation from unnecessary prolonged treatment"
    ],
    prognosis: "Outcome depends on gestational age, birth weight, organism, meningitis, time to effective therapy, shock severity, source control, and organ injury. Preterm and very-low-birthweight infants have substantially less reserve and a higher risk of death and neurodevelopmental harm. A rapid clinical response does not by itself define treatment duration, and a negative culture is only as reliable as specimen timing and quality. Survivors of meningitis, severe shock, seizures, prolonged ventilation, or extreme prematurity need hearing, vision, growth, neurologic, and developmental follow-up rather than discharge from concern when antibiotics end.",
    prevention: "Prevent early-onset GBS disease through current maternal screening and indicated intrapartum prophylaxis; communicate maternal fever, cultures, rupture duration, antibiotics, and the circumstances of preterm birth directly to the newborn team. Prevent late-onset disease through hand hygiene, human-milk support, aseptic line insertion and access, daily device-necessity review, skin protection, ventilator and central-line bundles, environmental cleaning, antimicrobial stewardship, and surveillance for unit transmission. No maternal GBS prophylaxis prevents all early-onset organisms or late-onset GBS, and no normal appearance at birth eliminates the need for serial observation when risk is meaningful.",
    patientEducation: [
      "Newborn infection may cause low temperature, poor feeding, sleepiness, fast or difficult breathing, unusual color, fewer wet diapers, irritability, or a weak cry rather than a clear fever. Seek urgent care for any of these changes.",
      "Early-onset infection usually relates to exposure before or during birth. Late-onset infection has different routes, including community contact and hospital devices; one is not simply a later version of the same treatment plan.",
      "Cultures identify the organism, but treatment may need to begin before results because newborns can worsen quickly. If cultures stay negative and the baby remains well, stopping antibiotics can be safer than continuing without evidence.",
      "Clean hands before touching the baby or feeding equipment, follow line and wound instructions, limit contact with ill people, and keep every follow-up appointment after a severe infection.",
      "Call emergency services for pauses in breathing, blue or gray color, seizure, extreme difficulty waking, severe breathing effort, or a baby who cannot feed."
    ],
    specialPopulations: [
      "Infants born at 35 weeks or more: use an institutionally selected AAP-consistent approach with serial clinical observation; a calculator may support but never replace examination.",
      "Infants born at 34 6/7 weeks or less: use delivery-circumstance and preterm-specific guidance. The lower-risk profile of cesarean birth for a noninfectious maternal indication without labor or membrane rupture must not be generalized to preterm labor, rupture, intra-amniotic infection, or unexplained fetal compromise.",
      "Very-low-birthweight or extremely preterm infants: expect higher E. coli and late-onset device-associated risk, different dosing and culture constraints, and greater harms from both missed infection and unnecessary prolonged antibiotics.",
      "Community newborns after discharge: evaluate feeding, weight, urine, household illness, urinary and meningitis sources, and HSV; do not assume the NICU organism profile.",
      "Resource-limited or referral-constrained settings: follow current WHO young-infant serious-bacterial-infection guidance and pursue urgent referral whenever feasible rather than improvising an adult regimen."
    ],
    nclexTraps: [
      "Fever is not required. Hypothermia, apnea, poor feeding, glucose instability, or subtle behavior change can be neonatal sepsis.",
      "A CBC or CRP does not diagnose sepsis, and one normal result does not exclude it. Blood or CSF culture establishes culture-confirmed bacterial disease.",
      "Do not use the neonatal early-onset sepsis calculator for an infant below its validated gestational age or to overrule clinical illness.",
      "Early- and late-onset disease do not share one organism list or one empirical regimen. Age, setting, devices, prior antibiotics, focus, and local susceptibility determine coverage.",
      "Ampicillin plus gentamicin is a common early-onset starting regimen, not a universal order for every newborn sepsis presentation.",
      "A sepsis-like newborn with vesicles, seizures, hepatitis, or coagulopathy needs urgent HSV evaluation and acyclovir consideration in addition to bacterial care.",
      "Promptly stopping unnecessary empirical antibiotics is part of sepsis safety, not therapeutic neglect, when cultures and serial assessment make infection unlikely."
    ],
    relatedTopics: [
      "Early-onset neonatal sepsis",
      "Late-onset neonatal sepsis",
      "Necrotizing enterocolitis",
      "Respiratory distress syndrome",
      "Persistent pulmonary hypertension of the newborn",
      "Blood culture collection",
      "Lumbar puncture",
      "Central line-associated bloodstream infection",
      "Ampicillin",
      "Gentamicin",
      "Acyclovir",
      "Septic shock"
    ],
    aliases: [
      "newborn sepsis",
      "sepsis in a newborn",
      "sepsis in neonates",
      "neonatal septicemia",
      "neonatal septicaemia",
      "neonatal bloodstream infection",
      "newborn bloodstream infection",
      "early-onset neonatal sepsis",
      "early onset neonatal sepsis",
      "early-onset sepsis",
      "early onset sepsis",
      "EOS in newborns",
      "late-onset neonatal sepsis",
      "late onset neonatal sepsis",
      "late-onset sepsis",
      "late onset sepsis",
      "LOS in newborns",
      "neonatal bacterial sepsis",
      "neonatal infection with shock",
      "newborn not feeding infection",
      "newborn low temperature sepsis",
      "sepsis in preterm infant",
      "sepsis in premature baby",
      "NICU sepsis"
    ],
    abbreviations: ["EOS", "LOS", "EONS", "LONS"],
    ambiguousAbbreviations: ["EOS", "LOS"],
    commonMisspellings: ["neonatel sepsis", "neonatal sepsus", "neo natal sepsis", "newborn septis", "neonatal septicimia", "early onset sepssis"],
    tags: [
      "neonatal sepsis",
      "newborn infection",
      "early-onset sepsis",
      "late-onset sepsis",
      "term versus preterm sepsis",
      "GBS newborn",
      "E coli preterm sepsis",
      "newborn hypothermia",
      "newborn poor feeding",
      "neonatal blood culture",
      "neonatal meningitis",
      "NICU central line infection",
      "ampicillin gentamicin",
      "antibiotic stewardship"
    ],
    sourceKeys: [
      "w42-aap-eos-term-2018",
      "w42-aap-eos-preterm-2018",
      "w42-cdc-gbs-guidance-2025",
      "w42-who-young-infant-sbi-2024",
      "w42-cdc-nicu-clabsi-2024"
    ]
  });

  const uterineInversion = completeCard({
    name: "Uterine inversion",
    category: "Obstetrics, Maternal Emergency & Postpartum Hemorrhage",
    definition: "Uterine inversion is an obstetric emergency in which the uterine fundus collapses inward and turns partly or completely inside out, usually immediately after birth. The inverted fundus may remain within the uterine cavity, descend through the cervix, protrude into the vagina, or extend beyond the introitus with the vagina inverted as well. Hemorrhage can be massive, but shock may be worse than visible blood loss because traction on the ovaries, tubes, ligaments, and peritoneum can trigger intense pain and a vagal or neurogenic response. The cause-specific priority is immediate uterine replacement while resuscitation occurs. Treating the patient only as routine uterine-atony postpartum hemorrhage - fundal massage and uterotonics before the uterus is restored - can tighten the cervix around the inverted fundus and make reduction harder.",
    classification: [
      "First degree or incomplete: the fundus indents into the uterine cavity but has not passed through the cervix.",
      "Second degree or complete: the inverted fundus passes through the cervix into the vagina but does not reach the perineum.",
      "Third degree or prolapsed: the fundus reaches or passes the vaginal opening.",
      "Fourth degree or total: both uterus and vagina are inverted beyond the introitus.",
      "Acute puerperal inversion occurs within 24 hours after birth. Common timing systems call later postpartum presentation subacute through about 4 weeks and chronic thereafter, but definitions vary. Nonpuerperal inversion is usually associated with a uterine mass and does not inherit the postpartum emergency algorithm."
    ],
    pathology: "The process begins when the fundus is pulled or pushed inward while the uterus is relaxed or the placenta remains attached near the fundus. Excessive cord traction before placental separation, fundal pressure, or abnormal placental adherence can contribute, but many cases occur despite appropriate care and no single risk factor. As inversion progresses, the round and broad ligaments, tubes, ovaries, and peritoneum are drawn into the uterine cup. Stretching produces severe pain and parasympathetic stimulation, which helps explain abrupt bradycardia, hypotension, nausea, or collapse out of proportion to measured bleeding. The cervix then contracts around the inverted segment. Venous and lymphatic outflow become obstructed, the fundus becomes congested and edematous, and every minute of delay can make manual replacement more difficult. Placental-bed bleeding and loss of effective myometrial contraction simultaneously create hemorrhagic shock.",
    pathophysiology: [
      "The fundus loses its normal convex shape and dimples into the cavity. A relaxed uterus, fundal placental attachment, excessive traction, abnormal placental adherence, or fundal pressure may initiate the movement, but inversion can occur without a preventable action.",
      "Downward movement drags uterine supports and adnexa centrally. Stretching of ligaments and peritoneum produces severe visceral pain and vagal stimulation, so the patient may collapse with hypotension and sometimes bradycardia before visible blood loss appears proportionate.",
      "The placental implantation site and uterine vessels bleed while the inverted myometrium cannot contract in its normal geometry. If the placenta remains attached, premature removal before reduction can expose a large bleeding surface and worsen hemorrhage.",
      "The cervical ring constricts around the fundus. Trapped tissue becomes congested and edematous because venous and lymphatic drainage are impaired; this creates a mechanical cycle in which delay makes reduction increasingly difficult.",
      "After successful replacement, the uterus can invert again until it contracts. Uterotonics, fundal support, treatment of atony and retained tissue, and continued hemorrhage surveillance therefore follow - not precede - anatomic restoration unless a specialist directs otherwise during a complex attempt."
    ],
    etiology: "Puerperal inversion is often multifactorial. Associated factors include traction on the umbilical cord before placental separation, fundal pressure during a relaxed third stage, a fundal placenta, placenta accreta spectrum or retained placenta, uterine atony, a short cord, uterine anomaly, connective-tissue laxity, rapid or prolonged labor, overdistension, macrosomia, and use of uterine-relaxing medicines. Associations do not establish fault, and a substantial proportion of cases have no identifiable precipitant. Nonpuerperal inversion is rare and often reflects a fundal submucosal leiomyoma, sarcoma, or another mass pulling the fundus downward; it requires gynecologic-oncology-aware evaluation rather than an obstetric PPH pathway.",
    riskFactors: [
      "Excessive umbilical-cord traction before clear placental separation or forceful fundal pressure while the uterus is relaxed",
      "Fundal placental implantation, retained placenta, placenta accreta spectrum, or difficult third-stage placental separation",
      "Uterine atony, uterine anomaly, short umbilical cord, overdistension, macrosomia, multiple gestation, or polyhydramnios",
      "Rapid, prolonged, or instrumented labor and uterine-relaxing anesthesia or medication; these are associations and do not predict most individual events",
      "Prior uterine inversion may increase concern in a subsequent birth, but recurrence risk is not precisely established",
      "For nonpuerperal inversion: a fundal submucosal fibroid or malignant uterine mass"
    ],
    signsSymptoms: [
      "The normally firm uterine fundus is not palpable in its expected abdominal position, or a cup-shaped depression is felt. Repeated forceful abdominal palpation is unnecessary once inversion is suspected.",
      "A smooth red-blue or hemorrhagic mass may be visible or palpable in the vagina or beyond the introitus. The placenta may still be attached to it; do not pull on the placenta or cord.",
      "Sudden severe pelvic, lower abdominal, or back pain, pressure, an urge to bear down, nausea, restlessness, fear, or collapse can occur immediately after birth.",
      "Bleeding ranges from limited visible loss to torrential postpartum hemorrhage. Concealed blood, ongoing placental attachment, and neurogenic physiology mean the vital signs can look worse than the measured blood loss.",
      "Tachycardia, hypotension, pallor, diaphoresis, altered mental status, weak pulses, prolonged capillary refill, or oliguria suggests hemorrhagic shock. Marked bradycardia or abrupt hypotension can reflect a vagal component.",
      "A chronic or nonpuerperal case may present with pelvic pressure, foul or bloody discharge, anemia, a vaginal mass, or necrotic tissue rather than immediate postpartum collapse."
    ],
    diagnostics: [
      "Diagnosis is primarily clinical and treatment must not wait for imaging. Suspect inversion when postpartum hemorrhage or collapse occurs with an absent abdominal fundus, fundal depression, or vaginal mass.",
      "Activate the obstetric hemorrhage response, quantify cumulative blood loss, and obtain CBC, type and crossmatch, coagulation studies including fibrinogen, blood gas or lactate, electrolytes, and other tests required by the massive-hemorrhage protocol. Repeat results according to bleeding and transfusion, not a routine schedule.",
      "Use bedside ultrasound only when the diagnosis remains uncertain and the patient is stable enough; it may show a U-shaped uterine cavity or central fundal invagination. Imaging must never delay manual reduction in an obvious acute case.",
      "Assess whether the placenta remains attached without attempting traction. Consider placenta accreta spectrum when separation is abnormal because forceful removal can worsen hemorrhage.",
      "After reduction, examine for uterine atony, retained placenta or tissue, genital-tract laceration, uterine rupture, coagulopathy, and ongoing concealed or visible bleeding. Multiple causes of PPH can coexist.",
      "Differentiate inversion from uterine prolapse, a prolapsed submucosal fibroid, retained placenta, vaginal hematoma, uterine rupture, cervical laceration, and atony. In nonpuerperal or chronic inversion, imaging and pathology evaluation for a uterine mass are essential."
    ],
    assessment: "Call out the suspected anatomy while assessing airway, breathing, circulation, mental status, pain, blood loss, uterine position, and placental attachment. The critical pattern is postpartum collapse or hemorrhage plus an absent abdominal fundus, a fundal cup, or a vaginal mass. Assign simultaneous roles: one trained clinician attempts reduction, anesthesia manages resuscitation and relaxation, nursing activates hemorrhage resources and medications, blood bank prepares products, and another team member records events and supports the patient and family. Track cumulative quantified loss, heart rate, blood pressure, perfusion, temperature, urine output, acid-base status, fibrinogen and coagulation, and response to blood products. Continue assessment after the uterus appears restored because reinversion, atony, retained tissue, laceration, DIC, pulmonary edema, and transfusion complications can follow.",
    differential: "Uterine atony causes a boggy enlarged uterus in its expected position, while inversion makes the fundus absent, indented, or visible below; however, atony can coexist after replacement. Uterine rupture may cause pain, hemorrhage, loss of uterine contour, fetal compromise before birth, or intra-abdominal bleeding without a characteristic inverted vaginal mass. Retained placenta or accreta can cause hemorrhage and may be attached to an inverted fundus. Cervical or vaginal laceration causes bleeding despite a firm correctly positioned uterus. Uterine prolapse preserves the uterine cavity's orientation, while a prolapsed fibroid is a discrete mass arising from the uterus. Amniotic fluid embolism, pulmonary embolism, anesthetic complication, and cardiomyopathy can cause postpartum collapse without explaining the absent fundus. Nonpuerperal inversion demands evaluation for benign or malignant uterine masses.",
    treatments: [
      "Call for immediate obstetric, anesthesia, nursing, operating-room, and blood-bank help. Begin airway and oxygen support, warming, large-bore vascular access, rapid laboratory sampling, balanced blood-product resuscitation or massive-transfusion protocol when indicated, calcium and coagulation management, and continuous hemodynamic monitoring while reduction proceeds. Give tranexamic acid promptly when indicated by the postpartum-hemorrhage protocol; it can run in parallel but does not replace immediate anatomic reduction.",
      "Stop umbilical-cord traction and do not pull on an attached placenta. Generally leave the placenta attached until the uterus is replaced because detachment opens the placental bed while the uterus cannot contract normally; specialist judgment applies if abnormal adherence or another operative plan is present.",
      "Attempt immediate manual replacement by a trained clinician. With a hand supporting the inverted fundus, apply steady pressure upward through the vagina toward the umbilicus, directing the portion that inverted last through the cervical ring first when feasible. Sustained pressure is safer than repeated forceful jabs. Do not delay for transfer to an operating room if immediate bedside reduction is possible.",
      "Pause uterotonics during attempted reduction because a contracted uterus or cervical ring resists replacement. If pain, constriction, or failure prevents reduction, anesthesia may provide rapid uterine relaxation with a short-acting tocolytic or anesthetic according to the emergency protocol while resuscitation continues. Relaxants can worsen hypotension and bleeding, so this is a monitored specialist intervention, not a routine PPH medication.",
      "If manual reduction fails, proceed quickly to a protocol-approved hydrostatic method or operative reduction. Surgical options include abdominal traction on the round ligaments using a Huntington-type approach, incision of a constricting cervical ring using a Haultain-type approach, or other combined vaginal-abdominal techniques. Hysterectomy is a last-resort life-saving option for uncontrollable hemorrhage, irreducible injury, or associated pathology.",
      "Once the uterus is anatomically restored, maintain manual support while it contracts, remove the placenta under direct obstetric management if still attached, give uterotonics, massage the now-correctly-positioned fundus, treat atony, inspect for retained tissue and trauma, and continue cause-directed PPH therapy and blood products according to timing, contraindications, and local protocol.",
      "Give antibiotic prophylaxis or treatment according to the facility's manual-replacement and operative-birth guidance, especially after extensive manipulation or retained tissue. Monitor for endometritis rather than assuming antibiotics eliminate risk.",
      "Provide adequate analgesia, explain events as the emergency permits, debrief afterward, screen for acute stress, and arrange obstetric follow-up. Physical survival does not erase the psychological impact of sudden pain, hemorrhage, invasive procedures, or separation from the newborn."
    ],
    contraindications: [
      "Do not treat an inverted uterus as routine atony before reduction. Fundal massage and uterotonics can increase constriction and make replacement harder while the fundus remains inverted.",
      "Do not continue cord traction, pull on the placenta, or routinely detach an attached placenta before the uterus is replaced; bleeding can accelerate when the placental bed is exposed without effective contraction.",
      "Do not delay manual reduction for ultrasound, laboratory results, transfer, consent paperwork that can follow emergency doctrine, or completion of the generic PPH bundle.",
      "Do not make repeated traumatic reduction attempts without escalating anesthesia, relaxation, hydrostatic, or operative support. Edema and tissue injury increase with time and force.",
      "Do not use uterine relaxants without simultaneous resuscitation and hemodynamic monitoring; they can worsen hypotension and uterine bleeding.",
      "Do not assume replacement ends the emergency. Reinversion, atony, retained placenta, laceration, coagulopathy, and ongoing hemorrhage require active reassessment.",
      "Do not apply the acute postpartum algorithm to chronic or nonpuerperal inversion caused by a mass; manipulation can injure friable or malignant tissue."
    ],
    nursingPriorities: [
      "Activate the obstetric emergency and hemorrhage protocols immediately, state 'possible uterine inversion,' call anesthesia and the operating room, notify the blood bank, obtain the hemorrhage cart, and assign a recorder. Specific language prevents the event from being managed as undifferentiated atony alone.",
      "Support airway, oxygenation, warmth, two large-bore IVs or equivalent access, rapid infuser and blood administration, continuous ECG and pulse oximetry, frequent blood pressure, and urinary catheter output as ordered. Quantify every blood source and preserve weighed materials when feasible without delaying resuscitation.",
      "Stop cord traction and routine fundal massage. If tissue is outside the body, support it gently with warm sterile saline-moistened material, minimize manipulation, and never attempt untrained replacement or placental removal.",
      "Prepare short-acting uterine relaxation and anesthesia medications for the reduction phase, then prepare uterotonics for immediately after successful replacement. Read back the phase and indication because giving the correct drug at the wrong phase can worsen the emergency.",
      "During transfusion, use independent product checks and trend temperature, ionized calcium when ordered, fibrinogen, coagulation, acid-base status, and signs of pulmonary edema or reaction. Hemorrhage resuscitation requires correction of oxygen-carrying capacity, coagulation, calcium, temperature, and perfusion rather than crystalloid volume alone.",
      "After reduction, palpate and document the correctly positioned fundus as directed, watch for reinversion and atony, continue quantified blood loss, inspect lochia and perineum, administer uterotonics and antibiotics on time, and escalate any recurrent pain, mass, bleeding, hypotension, or loss of fundal position.",
      "Keep one team member communicating with the patient and support person using brief direct explanations. Reunite parent and newborn when safe, offer lactation support after stabilization, and arrange trauma-informed debriefing and follow-up.",
      "Document the time inversion was recognized, examination findings, placenta status, every reduction attempt and medication phase, blood loss, products, laboratory trends, successful replacement, post-reduction tone, retained tissue or injury, and follow-up ownership."
    ],
    redFlags: [
      "Postpartum hemorrhage or sudden collapse with an absent abdominal fundus, a fundal depression, or a red-blue mass in the vagina or beyond the introitus",
      "Hypotension, altered consciousness, pallor, weak pulses, severe pain, or bradycardia out of proportion to visible blood loss",
      "Ongoing heavy bleeding, falling fibrinogen, worsening acidosis, hypothermia, coagulopathy, or need for rapidly escalating transfusion",
      "Failed immediate manual replacement, a tight cervical constriction ring, increasing edema, suspected placenta accreta, or possible uterine rupture",
      "Reappearance of a vaginal mass, loss of the abdominal fundus, recurrent severe pain, or renewed hemorrhage after apparent reduction",
      "Fever, uterine tenderness, foul discharge, delayed heavy bleeding, syncope, or worsening pelvic pain after discharge"
    ],
    complications: [
      "Massive postpartum hemorrhage, mixed hemorrhagic and neurogenic shock, DIC, severe anemia, myocardial or kidney injury, respiratory failure, and maternal death",
      "Cervical, vaginal, uterine, ligament, tube, ovarian, or bladder injury; uterine necrosis when reduction is delayed; and emergency hysterectomy",
      "Retained placenta, placenta accreta-related hemorrhage, uterine atony, reinversion, endometritis, sepsis, and secondary postpartum hemorrhage",
      "Transfusion reaction, hypocalcemia, hypothermia, dilutional coagulopathy, pulmonary edema, venous thromboembolism, and intensive-care complications",
      "Acute stress, post-traumatic stress symptoms, depression, impaired bonding, breastfeeding disruption, fear of future pregnancy, and grief after loss of fertility"
    ],
    prognosis: "Rapid recognition, immediate replacement, and simultaneous hemorrhage resuscitation usually permit uterine preservation and recovery. Delay allows edema and cervical constriction to make reduction harder and increases hemorrhage, shock, transfusion, infection, tissue injury, and hysterectomy risk. Future fertility can be preserved after successful reduction, but evidence about recurrence is limited. A prior inversion should be clearly documented and discussed during future pregnancy so delivery occurs where an experienced obstetric team, anesthesia, hemorrhage medications, and blood products are immediately available.",
    prevention: "Use skilled active management of the third stage of labor: wait for signs of placental separation, apply controlled rather than forceful cord traction with uterine counter-support, avoid fundal pressure on a relaxed uterus, and stop if the fundus descends or placental separation is uncertain. Identify placenta accreta risk and do not force separation. Prevention reduces avoidable traction-related cases but cannot eliminate inversion because many events have no recognized cause. Teams should rehearse the inversion-specific sequence so generic PPH habits do not delay replacement.",
    patientEducation: [
      "Uterine inversion means the top of the uterus turned inward after birth. It is rare, can cause severe pain, bleeding, and shock, and required immediate repositioning while the team replaced blood and supported circulation.",
      "The emergency was not necessarily caused by anything you did or by improper care; many cases have no clear cause. Ask for a plain-language review of your individual risk factors and what treatment was required.",
      "Seek emergency care for heavy bleeding, fainting, severe or increasing pelvic pain, fever, foul discharge, shortness of breath, chest pain, or a vaginal mass after discharge.",
      "Tell the obstetric team early in every future pregnancy that you had a uterine inversion and carry a copy of the delivery summary. Plan birth in a facility prepared for obstetric hemorrhage.",
      "Emotional reactions after a sudden life-threatening birth emergency are common. Ask for trauma-informed debriefing, mental-health support, lactation help, and follow-up for anemia and recovery."
    ],
    specialPopulations: [
      "Placenta accreta spectrum or an attached fundal placenta: avoid forceful separation; replacement, operative planning, blood products, and possible hysterectomy require senior multidisciplinary management.",
      "Patients who decline or cannot receive allogeneic blood: activate the institution's blood-management pathway early; this does not alter the urgency of reduction and hemorrhage control.",
      "Prior uterine inversion: recurrence is not precisely quantified, but future births warrant an explicit delivery plan, cautious third-stage management, and immediate hemorrhage capability.",
      "Chronic or nonpuerperal inversion: evaluate for fibroid, sarcoma, or another mass with imaging and pathology-aware gynecologic care; do not use the acute puerperal reduction sequence reflexively."
    ],
    nclexTraps: [
      "An absent fundus plus a vaginal mass after birth is uterine inversion until proven otherwise; do not answer routine fundal massage for atony.",
      "Resuscitation and manual uterine replacement happen simultaneously. Do not wait for quantified blood loss to cross a threshold or for imaging confirmation.",
      "If the placenta remains attached, do not pull it off before replacement in the usual acute sequence because this can worsen hemorrhage.",
      "Uterine relaxation may be needed before reduction; uterotonics are given after successful replacement to prevent reinversion and treat atony.",
      "Shock can exceed visible blood loss because severe pain and traction produce a vagal or neurogenic component in addition to hemorrhage.",
      "A successful reduction does not end PPH care. Continue uterotonics, quantified loss, trauma and retained-tissue assessment, coagulation support, and reinversion surveillance."
    ],
    relatedTopics: [
      "Postpartum hemorrhage",
      "Uterine atony",
      "Retained placenta",
      "Placenta accreta spectrum",
      "Disseminated intravascular coagulation in obstetrics",
      "Tranexamic acid",
      "Oxytocin",
      "Uterine rupture",
      "Hemorrhagic shock",
      "Disseminated intravascular coagulation"
    ],
    aliases: [
      "inverted uterus",
      "uterus turned inside out",
      "uterine fundal inversion",
      "acute uterine inversion",
      "acute puerperal uterine inversion",
      "puerperal uterine inversion",
      "postpartum uterine inversion",
      "postpartum inversion of the uterus",
      "complete uterine inversion",
      "incomplete uterine inversion",
      "prolapsed uterine inversion",
      "total uterine inversion",
      "chronic uterine inversion",
      "nonpuerperal uterine inversion",
      "non-puerperal uterine inversion",
      "uterine inversion after delivery",
      "vaginal mass after placental delivery",
      "absent fundus postpartum hemorrhage"
    ],
    commonMisspellings: ["uterine inverson", "uterin inversion", "uterine invertion", "inverted uturus", "puerperal uterine invesion"],
    tags: [
      "uterine inversion",
      "postpartum hemorrhage",
      "absent uterine fundus",
      "postpartum vaginal mass",
      "manual uterine replacement",
      "leave placenta attached",
      "uterine relaxation before reduction",
      "uterotonics after reduction",
      "neurogenic shock childbirth",
      "obstetric massive hemorrhage",
      "reinversion"
    ],
    sourceKeys: ["w42-bjae-uterine-inversion-2024", "w42-sahealth-uterine-inversion-v6", "w42-who-pph-2025"]
  });

  const bipolarTwo = completeCard({
    name: "Bipolar II disorder",
    category: "Psychiatry, Behavioral Health & Mood Disorders",
    definition: "Bipolar II disorder is a mood disorder defined by both at least one hypomanic episode and at least one major depressive episode, with no lifetime manic episode. Hypomania is an observable period of elevated, expansive, or irritable mood plus increased energy or activity that is clearly different from the person's baseline but is not severe enough to cause marked functional impairment, require hospitalization, or include psychosis. The depressive episodes often cause far more disability than the hypomania and carry substantial suicide risk. Bipolar II is therefore not 'mild bipolar disorder.' If a true manic episode has ever occurred, including psychosis or severity requiring hospitalization for the elevated state, the diagnosis is bipolar I disorder rather than bipolar II.",
    classification: [
      "A hypomanic episode requires a distinct period of mood elevation or irritability with increased energy or activity, usually lasting at least 4 consecutive days, plus at least 3 characteristic activation symptoms - or 4 when the mood is only irritable - and an unequivocal observable change from baseline.",
      "A major depressive episode usually lasts at least 2 weeks and includes depressed mood or loss of interest plus enough cognitive, physical, and behavioral symptoms to cause clinically important distress or impairment.",
      "Bipolar II requires both kinds of episode and excludes any lifetime mania. Hypomania alone, recurrent depression alone, brief activation that never meets episode criteria, and antidepressant side effects alone do not establish the diagnosis.",
      "Current or most recent episode and specifiers matter: depressed, hypomanic, in partial or full remission, with anxious distress, mixed features, seasonal pattern, peripartum onset, psychotic features during depression, or rapid cycling. Mixed features can sharply increase agitation, switch risk, and suicide concern.",
      "Four or more distinct mood episodes in 12 months is termed rapid cycling; it is a course specifier, not a separate bipolar type."
    ],
    pathology: "Bipolar II arises from interacting genetic vulnerability, brain-network regulation, circadian and sleep instability, stress biology, and environmental exposures rather than one chemical imbalance or character flaw. During hypomania, reward pursuit, energy, speech, thought speed, and goal-directed activity rise while sleep need and inhibition fall. Because reality testing and basic function can remain relatively intact, the change may feel productive and escape clinical attention. Depression reflects a different network state with reduced reward responsiveness, slowed or agitated activity, impaired concentration, altered sleep and appetite, guilt, hopelessness, and possible suicidal thinking. Episodes are connected: sleep loss, substances, antidepressants, corticosteroids, postpartum physiology, and psychosocial stress can destabilize vulnerable rhythms and help trigger a switch. Treatment must therefore relieve depression without accelerating activation and prevent future episodes rather than treating each mood in isolation.",
    pathophysiology: [
      "Genetic risk is distributed across many variants affecting neuronal signaling, plasticity, circadian timing, and stress response. Family history raises probability but neither proves nor excludes the disorder.",
      "Sleep and circadian disruption are both symptom and driver. Reduced need for sleep during hypomania differs from insomnia: the person sleeps less yet initially feels energized rather than tired. Continued sleep loss can intensify impulsivity, irritability, psychosis risk, and a transition toward mania.",
      "Reward and salience systems become overactivated during hypomania, increasing confidence, social drive, spending, sexual behavior, speech, projects, distractibility, and risk-taking. The absence of catastrophic impairment does not make consequences harmless.",
      "Depressive states reduce motivation and pleasure while altering sleep, appetite, cognition, movement, and self-evaluation. Recurrent or prolonged depression explains much of bipolar II disability and suicide risk.",
      "Mixed features place activation inside depression: racing thoughts, agitation, reduced sleep, impulsivity, or increased energy can coexist with hopelessness. This combination can supply the energy to act on suicidal thoughts and makes routine antidepressant escalation especially unsafe.",
      "Medication and substance effects can imitate or trigger elevation. A sustained syndromal episode beyond the expected physiologic effect may reveal bipolarity, but transient jitteriness, insomnia, or euphoria during intoxication is not automatically hypomania. A longitudinal timeline is essential."
    ],
    etiology: "There is no single cause or diagnostic biomarker. Risk reflects polygenic inheritance, family mood history, neurodevelopment, sleep and circadian sensitivity, trauma and stress, postpartum hormonal change, substance exposure, medical illness, and medication effects. Antidepressants, stimulants, corticosteroids, dopaminergic drugs, thyroid excess, sleep deprivation, and recreational substances may precipitate or resemble hypomania. The diagnosis is not explained away by stress, but neither should every stress-related mood shift be labeled bipolar II without syndromal duration, symptoms, observable change, and longitudinal recurrence.",
    riskFactors: [
      "First-degree family history of bipolar disorder, recurrent mood episodes, early-onset depression, postpartum mood elevation, or prior antidepressant-associated activation",
      "Recurrent depression with brief energized periods, atypical depressive features, psychomotor agitation, mixed symptoms, seasonal pattern, or repeated loss of antidepressant response",
      "Sleep deprivation, shift work, transmeridian travel, major schedule disruption, childbirth, severe psychosocial stress, or inconsistent medication use",
      "Alcohol, cannabis, cocaine, amphetamine, stimulant misuse, or other substances that worsen sleep, judgment, and mood cycling",
      "Thyroid disease, neurologic illness, corticosteroids, dopaminergic medicines, prescribed stimulants, or other medical and medication causes of mood elevation",
      "Prior suicide attempt, self-harm, mixed features, agitation, substance use, access to lethal means, recent discharge, relationship or financial crisis, and abrupt medication change"
    ],
    signsSymptoms: [
      "Hypomania: decreased need for sleep, increased energy or activity, unusual confidence, rapid or increased speech, racing thoughts, distractibility, more projects or social contact, irritability, spending, sexual risk, driving risk, or other impulsive behavior that represents a clear change noticed by others.",
      "Hypomania does not cause the marked impairment, hospitalization, or psychosis of mania. If those occur because of the elevated episode, reassess for bipolar I, a substance or medication state, delirium, or another disorder.",
      "Major depression: sustained low or irritable mood, loss of interest, fatigue, sleep and appetite change, slowed or agitated movement, poor concentration, guilt, worthlessness, hopelessness, death wishes, or suicidal thoughts and behavior.",
      "Mixed features: depression accompanied by activation such as racing thoughts, increased talk, agitation, impulsivity, or reduced need for sleep. The patient may feel both driven and desperate, which requires urgent safety assessment.",
      "Between episodes, function may return close to baseline, but residual depression, anxiety, sleep disturbance, cognitive complaints, relationship strain, debt, occupational disruption, or shame can persist.",
      "People often seek care only during depression and describe hypomania as their 'good' or productive period. Collateral history may reveal that the energized state was unusual, sustained, observable, and consequential."
    ],
    diagnostics: [
      "Build a lifetime mood timeline, not only a current symptom list. Ask about the longest periods of reduced sleep need, increased energy, speech, confidence, irritability, projects, spending, sexuality, driving risk, and observable change; then establish duration, impairment, substances, medications, and consequences.",
      "Confirm at least one syndromal hypomanic episode and one major depressive episode. Verify that no manic episode ever occurred. Hospitalization or psychosis during an elevated episode generally makes it mania, while psychosis can occur during a severe depressive episode without changing the diagnosis to bipolar I.",
      "Seek collateral information, with consent when possible, from family, partners, prior records, financial or occupational history, and pharmacy data. Insight during hypomania may be limited, and retrospective recall during depression can minimize prior activation.",
      "Use a validated bipolar screening questionnaire only as a prompt for fuller assessment. A positive screen is not a diagnosis, and bipolar II can be missed by tools weighted toward severe mania.",
      "Assess suicide risk directly at diagnosis, every depressive or mixed presentation, medication change, emergency visit, discharge, and major stressor. Ask about thoughts, intent, plan, rehearsal, past attempts, substance use, reasons for living, supports, access to firearms or medications, and ability to use a safety plan.",
      "Review alcohol and drug use, caffeine and supplements, sleep schedule, pregnancy and postpartum timing, corticosteroids, antidepressants, stimulants, thyroid products, dopaminergic drugs, and adherence. Determine whether symptoms persist outside intoxication, withdrawal, or the expected medication effect.",
      "Perform physical and neurologic examination and targeted testing for mimics. Common baseline studies before medication include CBC, metabolic and liver profile, renal function, thyroid testing, pregnancy testing when relevant, weight, waist or BMI, blood pressure, glucose or A1C, and lipids; ECG, toxicology, or other tests depend on history and the planned drug.",
      "Differentiate bipolar II from bipolar I, recurrent unipolar major depression, cyclothymic disorder, borderline personality disorder, ADHD, PTSD, anxiety, grief, schizoaffective or psychotic disorders, substance- or medication-induced bipolar disorder, thyroid disease, seizure or neurocognitive disorders, and normal temperament. Comorbidity can exist, so one diagnosis does not erase another."
    ],
    assessment: "Assessment has two simultaneous goals: establish the longitudinal diagnosis and determine today's safety. Document current mood, energy, sleep need, psychomotor state, speech, thought speed and organization, impulsivity, psychosis, cognition, substances, medication changes, function, and supports. Compare the current state with the person's baseline and prior episodes. Ask directly about suicidal and violent thoughts, access to lethal means, dependent-child safety, driving, spending, sexual risk, nutrition, hydration, and capacity to follow treatment. Review pregnancy potential, postpartum status, kidney, thyroid, liver, metabolic and cardiac health because these change medication safety. Record why an episode is hypomanic rather than manic and why recurrent depression is bipolar rather than unipolar; if the history is uncertain, preserve diagnostic uncertainty instead of forcing a label.",
    differential: "Bipolar I is distinguished by any lifetime manic episode; bipolar II cannot be retained after true mania. Unipolar depression lacks syndromal hypomania, although agitation or antidepressant side effects can confuse the picture. Cyclothymia has chronic fluctuating hypomanic and depressive symptoms that do not meet full episode criteria for much of the course. ADHD traits begin earlier and are more persistent rather than episodic; borderline personality symptoms are often rapidly reactive to interpersonal context but can coexist with bipolar disorder. PTSD, anxiety, grief, sleep deprivation, stimulant or cocaine use, alcohol withdrawal, corticosteroids, thyroid excess, seizures, frontotemporal disease, and delirium can produce activation or mood change. Psychotic symptoms limited to depression do not automatically establish bipolar I, but psychosis during an elevated episode indicates mania rather than hypomania.",
    treatments: [
      "For acute bipolar depression, select a treatment with evidence for bipolar depression and fit it to prior response, episode features, medical risks, pregnancy, and patient preference. Quetiapine has direct evidence for bipolar II depression; lithium, lamotrigine, and other guideline-supported strategies may be used depending on acuity and the goal of acute versus maintenance care. Much drug evidence combines bipolar I and II, so do not present every bipolar I approval as proven equally effective in bipolar II.",
      "Use antidepressants cautiously and never by reflex because the patient appears depressed. Before starting or increasing one, recheck lifetime hypomania, mixed symptoms, rapid cycling, prior switch, substances, and sleep. Avoid or use particular caution with antidepressant monotherapy when mixed features, recent rapid cycling, or prior treatment-emergent hypomania exists. If a specialist uses an antidepressant for selected pure bipolar II depression, create a mood-stabilizing and monitoring plan and stop or reassess promptly for activation.",
      "Treat current hypomania by restoring sleep and safety, stopping or reducing destabilizing antidepressants, stimulants, substances, or corticosteroids when medically appropriate, and using a guideline-supported mood stabilizer or antipsychotic matched to severity. Escalation to marked impairment, psychosis, dangerous behavior, or need for hospitalization is mania-level illness and requires diagnostic revision and urgent care.",
      "For severe depression with imminent suicide risk, catatonia, psychosis, inability to eat or drink, or need for rapid response, hospital care and electroconvulsive therapy may be appropriate. ECT is a medical treatment, not punishment, and requires individualized consent and anesthesia assessment.",
      "Maintenance treatment aims to prevent both depressive and hypomanic recurrence. Lithium, lamotrigine, quetiapine, or another guideline-supported regimen may be selected from episode polarity, prior response, suicide risk, organ function, adverse effects, and reproductive goals. Avoid copying an acute rescue drug indefinitely without reassessing long-term benefit.",
      "Add structured psychotherapy and education: psychoeducation, cognitive behavioral therapy, interpersonal and social rhythm therapy, family-focused approaches, relapse-signature tracking, and collaborative care improve recognition, adherence, relationships, and sleep regularity. Psychotherapy complements rather than replaces medication when medication is indicated.",
      "Build a written suicide safety plan with warning signs, coping steps, supportive contacts, professional resources, and lethal-means safety. Use emergency evaluation or 988 in the United States for imminent or escalating risk; a no-suicide contract is not an adequate intervention.",
      "Address alcohol and substances, sleep apnea, thyroid disease, trauma, anxiety, ADHD, pain, obesity, diabetes, and cardiovascular risk. Treating comorbidity reduces relapse pressure, but stimulant, antidepressant, and corticosteroid decisions require coordinated monitoring for mood destabilization."
    ],
    medicationsCommonlyUsed: ["Quetiapine", "Lithium", "Lamotrigine"],
    contraindications: [
      "Do not diagnose bipolar II unless both hypomania and major depression are established and no mania has ever occurred. If mania emerges later, change the diagnosis to bipolar I.",
      "Do not equate brief happiness, productivity, irritability, insomnia with fatigue, trauma reactivity, ADHD, or antidepressant jitteriness with a hypomanic episode without duration, activation, observable change, and exclusion of substances or medical causes.",
      "Do not treat bipolar depression as routine unipolar depression without checking for hypomania. Antidepressants can worsen mixed symptoms, induce hypomania or mania, or accelerate cycling in susceptible patients.",
      "Do not abruptly stop lithium, anticonvulsants, antipsychotics, benzodiazepines, or antidepressants without a supervised plan; withdrawal, relapse, rebound, toxicity, or suicide risk may increase.",
      "Lithium requires renal and thyroid monitoring, pregnancy counseling, stable salt and fluid intake, interaction review, and urgent evaluation for vomiting, coarse tremor, ataxia, confusion, or toxicity. Dehydration, NSAIDs, ACE inhibitors, ARBs, and some diuretics can raise levels.",
      "Lamotrigine requires slow titration and immediate evaluation of rash, mucosal lesions, blistering, fever, or systemic symptoms. It is not a rapid antimanic rescue drug.",
      "Valproate has major fetal and developmental risks and should not be treated as a routine choice in pregnancy or people who could become pregnant without specialist risk-benefit review and effective prevention of exposure.",
      "Antipsychotics require metabolic, movement, sedation, orthostasis, and cardiac-risk monitoring. Do not allow symptom improvement to hide medication harm."
    ],
    nursingPriorities: [
      "Assess suicide and self-harm risk directly, calmly, and repeatedly. Escalate intent, plan, rehearsal, inability to maintain safety, severe agitation, psychosis, intoxication, access to lethal means, or sudden apparent calm after a suicidal crisis.",
      "Track sleep as a vital mood signal: bedtime, hours slept, whether the person feels rested despite little sleep, energy, speech, activity, spending, irritability, and risk-taking. A falling sleep need often precedes obvious hypomania.",
      "Create a low-stimulation, predictable environment during activation; use clear limits, brief directions, hydration and nutrition support, fall and elopement precautions, and collaborative alternatives to confrontation. Protect dignity while restricting dangerous driving, spending, sexual, or aggressive behavior through the least restrictive safe plan.",
      "During depression, assess intake, hygiene, mobility, cognition, medication access, dependent care, social isolation, and ability to perform basic tasks. Do not mistake psychomotor slowing or hopelessness for noncompliance.",
      "Administer and monitor medication with exact indication. Trend weight, blood pressure, glucose or A1C, lipids, renal, thyroid and liver data, ECG when indicated, lithium levels, rash, movement symptoms, sedation, orthostasis, sexual effects, and pregnancy considerations.",
      "When an antidepressant starts or changes, teach the patient and supports to report reduced need for sleep, sudden energy, racing thoughts, unusual confidence, irritability, agitation, impulsivity, or rapid speech immediately. Document the switch plan and prescriber ownership.",
      "Use teach-back for the difference between hypomania and wellness, early relapse signs, medication toxicity, pregnancy planning, sleep regularity, substance risk, and crisis contacts. Invite trusted supporters into relapse planning with consent.",
      "At every transition, hand off the lifetime mania screen, current episode and mixed features, suicide formulation, lethal-means plan, sleep trend, recent medication changes, adherence barriers, laboratory monitoring, pregnancy status when relevant, and follow-up appointment."
    ],
    redFlags: [
      "Suicidal thoughts with intent, plan, rehearsal, escalating hopelessness, recent attempt, access to lethal means, or inability to use a safety plan",
      "Depression plus agitation, racing thoughts, reduced sleep, impulsivity, or sudden energy - possible mixed features with high short-term risk",
      "Psychosis, marked functional impairment, dangerous behavior, or hospitalization caused by an elevated episode; this is mania-level severity, not hypomania",
      "Several nights of little sleep without fatigue, rapidly increasing speech or activity, reckless spending, unsafe driving, aggression, or sexual risk",
      "Severe medication rash or mucosal lesions, lithium toxicity symptoms, serotonin toxicity, neuroleptic malignant syndrome, severe metabolic disturbance, or pregnancy exposure concern",
      "Abrupt medication discontinuation, intoxication or withdrawal, inability to eat or drink, catatonia, or loss of housing, caregiving, or basic safety"
    ],
    complications: [
      "Suicide attempt and death, self-harm, accidental injury, violence exposure, substance poisoning, and unsafe driving or sexual behavior",
      "Recurrent or chronic depression, mixed states, rapid cycling, progression to a recognized manic episode and diagnostic revision to bipolar I",
      "Relationship disruption, job or school loss, debt, legal problems, housing instability, parenting strain, and social isolation",
      "Alcohol or substance-use disorder, anxiety, PTSD, ADHD, sleep disorders, obesity, diabetes, cardiovascular disease, and medication adverse effects",
      "Antidepressant-associated activation, medication nonadherence after pleasant hypomania, lithium or anticonvulsant toxicity, severe rash, metabolic syndrome, and reproductive harm from unsafe prescribing"
    ],
    prognosis: "Bipolar II is usually recurrent, but sustained recovery and meaningful work, relationships, and parenting are achievable with accurate diagnosis, effective episode-specific treatment, regular sleep, psychotherapy, substance-risk reduction, and a plan that patients can continue. The course is not uniformly progressive. Frequent depression, mixed features, rapid cycling, comorbid substance use, trauma, delayed diagnosis, and poor access worsen outcomes. A later manic episode changes the diagnosis to bipolar I but does not mean earlier observations were dishonest; longitudinal diagnoses can become clearer as the illness unfolds.",
    prevention: "The underlying vulnerability cannot be completely prevented, but relapse and harm can be reduced. Maintain a regular sleep-wake and activity schedule, protect sleep during travel, shift work, postpartum care, and stress, avoid recreational stimulants and destabilizing substances, take medication consistently, monitor early warning signs, and arrange rapid access before a full episode develops. Review antidepressants, steroids, stimulants, thyroid medicine, pregnancy plans, and seasonal patterns proactively. Suicide prevention requires a living safety plan, lethal-means safety, supportive contacts, and follow-up after crisis or discharge rather than relying on verbal promises.",
    patientEducation: [
      "Bipolar II requires real episodes of both hypomania and major depression and no history of mania. Hypomania may feel productive, but it is an observable change in sleep, energy, activity, speech, judgment, or behavior - not simply a good day.",
      "Bipolar II is not a milder illness. Depression can be prolonged and suicide risk is real, so report hopelessness, mixed agitation, self-harm thoughts, or sudden energy during depression immediately.",
      "Before taking an antidepressant, tell the prescriber about every period of reduced sleep need, unusual energy, racing thoughts, impulsive spending, or prior medication-related activation. Never change or stop mood medicine on your own.",
      "Keep a daily record of sleep, mood, energy, medicines, menstrual or postpartum timing when relevant, and substances. Share early warning signs with a trusted person who can notice changes before you do.",
      "Call or text 988 in the United States or use local crisis services for escalating suicidal thoughts; call emergency services for immediate danger, psychosis, inability to care for yourself, or severe medication reactions."
    ],
    specialPopulations: [
      "Pregnancy and postpartum: relapse risk can rise sharply around childbirth. Preconception medication review, avoidance of abrupt discontinuation, fetal and lactation risk counseling, sleep protection, and a postpartum emergency plan require psychiatry and obstetric coordination.",
      "Adolescents: distinguish episodic activation from developmental variability, ADHD, trauma, substances, and chronic irritability; obtain family and school history while respecting confidentiality and assessing self-harm.",
      "Older adults or first late-life presentation: search carefully for medications, neurologic disease, thyroid disorder, delirium, and substance effects; reduce fall, renal, metabolic, and interaction risk.",
      "People with kidney, liver, thyroid, metabolic, cardiac, or seizure disease: select and monitor mood treatments around organ function rather than inheriting a standard regimen.",
      "People with substance use or trauma: provide integrated treatment. Do not withhold mood care, and do not attribute every episode to bipolar disorder without establishing the relationship to intoxication, withdrawal, and trauma cues."
    ],
    nclexTraps: [
      "Bipolar II requires at least one hypomanic episode plus at least one major depressive episode and no mania. Depression plus mood swings is not enough.",
      "Hypomania does not cause marked impairment, require hospitalization, or include psychosis. Those features during elevation indicate mania and therefore bipolar I or another cause.",
      "The absence of full mania does not mean low suicide risk; depressive and mixed episodes can be severe.",
      "Reduced need for sleep means sleeping less without feeling tired, which differs from insomnia with fatigue.",
      "Do not give a routine antidepressant-only answer without checking for mixed features, rapid cycling, or prior switching and ensuring a monitoring or mood-stabilizing plan.",
      "A screening questionnaire supports assessment but cannot establish a lifetime hypomanic episode or exclude substances and medical causes.",
      "If a patient later has mania, revise the diagnosis to bipolar I; bipolar I and bipolar II are not simultaneous severity grades."
    ],
    relatedTopics: [
      "Bipolar disorder",
      "Lithium",
      "Lamotrigine",
      "Quetiapine",
      "Postpartum psychosis"
    ],
    aliases: [
      "bipolar 2 disorder",
      "bipolar type II",
      "bipolar type 2",
      "type II bipolar disorder",
      "type 2 bipolar disorder",
      "bipolar II depression",
      "bipolar 2 depression",
      "bipolar depression with hypomania",
      "depression with hypomania",
      "major depression with hypomania",
      "hypomania with recurrent depression",
      "bipolar 2 with hypomania and depression",
      "hypomania and major depression",
      "recurrent depression with hypomania",
      "BD II",
      "BD-II",
      "BD2",
      "BP II",
      "BP-II",
      "bipolar two",
      "bipolar second type",
      "manic depression type 2"
    ],
    abbreviations: ["BD II", "BD-II", "BD2", "BP II", "BP-II"],
    ambiguousAbbreviations: ["BP II", "BD2"],
    commonMisspellings: ["bipolor II", "biploar 2", "bipolar ll disorder", "bipolar two disoder", "biploar depression hypomania"],
    tags: [
      "bipolar II disorder",
      "bipolar depression with hypomania",
      "major depression with hypomania",
      "recurrent depression with hypomania",
      "hypomania plus major depression",
      "no history of mania",
      "bipolar II depression",
      "decreased need for sleep",
      "mixed features suicide risk",
      "antidepressant switch",
      "antidepressant-induced hypomania",
      "quetiapine bipolar depression",
      "lithium monitoring",
      "lamotrigine rash",
      "mood safety plan"
    ],
    sourceKeys: ["w42-vadod-bipolar-2023", "w42-nice-bipolar-2025", "w42-nimh-bipolar-current", "w42-canmat-isbd-bipolar-2023"]
  });

  const cards = [neonatalSepsis, uterineInversion, bipolarTwo];
  const results = [];

  cards.forEach((rawCard) => {
    const { mergeNames = [], ...card } = rawCard;
    const identityNames = unique([card.name, ...mergeNames]);
    const identitySet = new Set(identityNames.map(normalize));
    const matches = database.diseases.filter((entry) => identitySet.has(normalize(titleOf(entry))));
    const preservedAliases = unique(matches.flatMap((entry) => [
      titleOf(entry),
      ...(Array.isArray(entry.aliases) ? entry.aliases : []),
      ...(Array.isArray(entry.abbreviations) ? entry.abbreviations : []),
      ...(Array.isArray(entry.commonMisspellings) ? entry.commonMisspellings : [])
    ])).filter((value) => normalize(value) !== normalize(card.name));

    let target = matches[0] || null;
    if (!target) {
      target = {};
      database.diseases.push(target);
    }
    Object.assign(target, card, {
      aliases: unique([...(card.aliases || []), ...preservedAliases])
    });

    let removedDuplicateCount = 0;
    matches.forEach((entry) => {
      if (entry === target) return;
      const index = database.diseases.indexOf(entry);
      if (index >= 0) {
        database.diseases.splice(index, 1);
        removedDuplicateCount += 1;
      }
    });

    results.push(Object.freeze({
      canonicalName: card.name,
      mergedNames: Object.freeze(identityNames.slice()),
      aliasCount: target.aliases.length,
      sourceKeys: Object.freeze(card.sourceKeys.slice()),
      sourceCount: card.sourceKeys.length,
      removedDuplicateCount
    }));
  });

  window.ANI_PATHOLOGY_WAVE42_DISEASES = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    applied: true,
    sourceNote: SOURCE_NOTE,
    cardCount: cards.length,
    sourceCount: sourceReferences.length,
    cards: Object.freeze(results)
  });
})();
