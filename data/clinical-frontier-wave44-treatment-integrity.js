/*
 * ANI Clinical Frontier Wave 44 - treatment-role integrity.
 *
 * A medication can be clinically relevant to a card without treating the
 * card's underlying condition. This patch separates direct treatment from
 * prevention, symptom relief, perioperative support, complication treatment,
 * and temporary stabilization. Only a curated non-empty direct-treatment
 * list receives the medicationTreatmentSafetyPolicy contract.
 */
(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) return;

  const VERSION = "2026-07-22-wave44-treatment-integrity-1";
  const GENERATED_AT = "2026-07-22";
  const CURATED_POLICY = "curated-explicit-v2";

  const sources = [
    {
      key: "w44-cdc-hepa-care",
      label: "CDC: Clinical Care of Hepatitis A",
      url: "https://www.cdc.gov/hepatitis-a/hcp/clinical-care/index.html",
      note: "Supports supportive care for established hepatitis A and distinguishes vaccination or immune globulin postexposure prophylaxis from treatment of active infection."
    },
    {
      key: "w44-cdc-hepb-care",
      label: "CDC: Clinical Care of Hepatitis B",
      url: "https://www.cdc.gov/hepatitis-b/hcp/clinical-care/index.html",
      note: "Supports supportive care for most acute hepatitis B, specialist selection of antiviral therapy for chronic infection, and separation of HBV postexposure prophylaxis from treatment."
    },
    {
      key: "w44-aasld-hbv-2025",
      label: "AASLD/IDSA: Treatment of Chronic Hepatitis B Practice Guideline",
      url: "https://www.aasld.org/practice-guidelines/chronic-hepatitis-b",
      note: "Supports entecavir, tenofovir disoproxil fumarate, and tenofovir alafenamide as high-efficacy chronic-HBV therapies and individualized treatment eligibility and monitoring."
    },
    {
      key: "w44-cns-hydrocephalus-diversion",
      label: "Congress of Neurological Surgeons: CSF Shunt or Endoscopic Third Ventriculostomy for Pediatric Hydrocephalus",
      url: "https://www.cns.org/guidelines/pediatric-hydrocephalus/4-cerebrospinal-fluid-shunt-endoscopic-third-ventr",
      note: "Supports cerebrospinal-fluid shunting and endoscopic third ventriculostomy as definitive diversion options in appropriately selected pediatric hydrocephalus."
    },
    {
      key: "w44-cns-hydrocephalus-phh",
      label: "Congress of Neurological Surgeons: Management of Posthemorrhagic Hydrocephalus in Premature Infants",
      url: "https://www.cns.org/guidelines/pediatric-hydrocephalus/2-management-of-posthemorrhagic-hydrocephalus-in-p",
      note: "Supports that acetazolamide plus furosemide is not recommended to reduce shunt need in premature infants with posthemorrhagic hydrocephalus."
    },
    {
      key: "w44-cdc-rabies-pep",
      label: "CDC: Rabies Post-exposure Prophylaxis Guidance",
      url: "https://www.cdc.gov/rabies/hcp/clinical-care/post-exposure-prophylaxis.html",
      note: "Supports immediate wound care and exposure-specific HRIG and vaccine use before symptoms, including important administration distinctions."
    },
    {
      key: "w44-cdc-rabies-overview",
      label: "CDC: Clinical Overview of Rabies",
      url: "https://www.cdc.gov/rabies/hcp/clinical-overview/index.html",
      note: "Supports that symptomatic rabies is nearly always fatal and care is generally intensive supportive care rather than curative medication therapy."
    },
    {
      key: "w44-aao-retinal-detachment",
      label: "American Academy of Ophthalmology EyeWiki: Retinal Detachment",
      url: "https://eyewiki.aao.org/Retinal_Detachment",
      note: "Supports urgent ophthalmic classification and anatomic repair with retinopexy, pneumatic retinopexy, scleral buckle, vitrectomy, or cause-directed treatment for exudative disease."
    },
    {
      key: "w44-cdc-rubella-overview",
      label: "CDC: Clinical Overview of Rubella",
      url: "https://www.cdc.gov/rubella/hcp/clinical-overview/index.html",
      note: "Supports that rubella has no specific antiviral therapy and distinguishes supportive care and isolation from vaccination-based prevention."
    },
    {
      key: "w44-rcog-shoulder-dystocia",
      label: "Royal College of Obstetricians and Gynaecologists: Shoulder Dystocia Guideline",
      url: "https://www.rcog.org.uk/media/ewgpnmio/gtg_42.pdf",
      note: "Supports immediate obstetric maneuvers, suprapubic pressure, avoidance of fundal pressure, and structured escalation rather than medication treatment."
    },
    {
      key: "w44-rcog-placenta-2026",
      label: "RCOG Green-top Guideline No. 27a: Placenta Praevia and Placenta Accreta Spectrum",
      url: "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/placenta-praevia-and-placenta-accreta-diagnosis-and-management-green-top-guideline-no-27a/",
      note: "Supports diagnosis, hemorrhage planning, specialist delivery, and distinction between obstetric adjuncts and correction of placental location or invasion."
    },
    {
      key: "w44-acog-placenta-accreta",
      label: "ACOG/SMFM: Placenta Accreta Spectrum",
      url: "https://www.acog.org/clinical/clinical-guidance/obstetric-care-consensus/articles/2018/12/placenta-accreta-spectrum",
      note: "Supports planned multidisciplinary delivery, leaving the placenta in situ during typical cesarean hysterectomy, and classifying uterotonics, tranexamic acid, transfusion, and antibiotics as contextual adjuncts rather than cures for abnormal invasion."
    },
    {
      key: "w44-bts-pleural-disease",
      label: "British Thoracic Society: Pleural Disease Guideline",
      url: "https://www.brit-thoracic.org.uk/quality-improvement/guidelines/pleural-disease/",
      note: "Supports cause-directed pleural-effusion evaluation, pleural-fluid sampling, drainage decisions, pleural-infection treatment, and procedural safety."
    },
    {
      key: "w44-international-pressure-injury",
      label: "International Guideline for Prevention and Treatment of Pressure Ulcers/Injuries",
      url: "https://internationalguideline.com/",
      note: "Supports pressure redistribution, repositioning, support surfaces, skin and perfusion assessment, nutrition, local wound care, and infection-specific escalation."
    },
    {
      key: "w44-aha-stroke-pfo-2021",
      label: "AHA/ASA: 2021 Guideline for Prevention of Stroke in Patients With Stroke and TIA",
      url: "https://professional.heart.org/en/science-news/2021-guideline-for-the-prevention-of-stroke-in-patients-with-stroke-and-transient-ischemic-attack/top-things-to-know",
      note: "Supports comprehensive stroke-cause evaluation, selected PFO closure, and use of antithrombotic therapy according to the stroke or thrombotic indication rather than simply because a PFO exists."
    },
    {
      key: "w44-aha-atrial-septal-defect",
      label: "American Heart Association: Atrial Septal Defect",
      url: "https://www.heart.org/en/health-topics/congenital-heart-defects/about-congenital-heart-defects/atrial-septal-defect-asd",
      note: "Supports observation of small defects, catheter or surgical closure of significant defects, and distinction between defect closure and medication for associated heart failure, rhythm, pulmonary-pressure, or postoperative concerns."
    },
    {
      key: "w44-acc-aortic-2022",
      label: "ACC/AHA: 2022 Guideline for the Diagnosis and Management of Aortic Disease",
      url: "https://www.acc.org/Guidelines/Guidelines/2022/11/02/14/08/Aortic-Disease",
      note: "Supports imaging surveillance, risk-factor and blood-pressure management, condition-specific thresholds for repair, and conditional statin or aspirin use only when atherosclerosis or penetrating aortic ulcer provides a separate indication."
    },
    {
      key: "w44-esc-cardiac-tamponade",
      label: "European Society of Cardiology: Cardiac Tamponade and Pericardiocentesis",
      url: "https://www.escardio.org/communities/councils/cardiology-practice/scientific-documents-and-publications/ejournal/volume-15/Pericardiocentesis-in-cardiac-tamponade-indications-and-practical-aspects/",
      note: "Supports urgent pericardial drainage as definitive treatment, temporary limited hemodynamic support while drainage is prepared, and avoidance of therapies that further reduce preload."
    },
    {
      key: "w44-aaos-rotator-cuff-2025",
      label: "AAOS: Management of Rotator Cuff Injuries Clinical Practice Guideline (2025)",
      url: "https://www.aaos.org/rccpg2025",
      note: "Supports activity modification and rehabilitation, consideration of one local corticosteroid injection for short-term pain and function, and procedure selection according to tear severity and response; it does not support routine systemic prednisone as tendon-healing therapy."
    }
  ];

  function patch(name, sourceKeys, treatments, directTreatmentMedications, medicationTreatmentNote, contraindications) {
    return {
      name,
      sourceKeys,
      treatments,
      directTreatmentMedications,
      medicationTreatmentNote,
      contraindications
    };
  }

  const patches = [
    patch("Hepatitis A", ["w44-cdc-hepa-care"], [
      "There is no specific antiviral treatment for established hepatitis A. Most patients need oral fluids, balanced nutrition, rest as needed, nausea control when prescribed, and follow-up until hydration and liver function are clinically safe.",
      "Hospitalize or urgently escalate inability to maintain hydration, worsening coagulopathy, hypoglycemia, encephalopathy, severe vomiting, hemodynamic instability, or another sign of acute liver failure because supportive care may require close monitoring or transplant-center input.",
      "Review alcohol, supplements, and prescription and nonprescription products that can injure the liver. Acetaminophen may sometimes be used only through an individualized liver-safe plan; it relieves symptoms and does not eliminate hepatitis A virus.",
      "For susceptible people recently exposed to hepatitis A, vaccine and sometimes immune globulin should be given promptly according to age, immune status, liver disease, and public-health guidance. This is postexposure prevention for the exposed contact, not treatment of the infected person's active hepatitis.",
      "Coordinate enteric hygiene, food-handling restrictions when applicable, contact assessment, and public-health reporting because interrupting fecal-oral spread protects others but does not substitute for monitoring the patient."
    ], [], "No medication directly cures established hepatitis A. Symptom medicines are supportive, while hepatitis A vaccine and immune globulin are prevention or postexposure prophylaxis for susceptible people rather than treatment of active infection.", [
      "Do not display hepatitis A vaccine or immune globulin as treatment for established hepatitis A; their role is preexposure or timely postexposure prevention.",
      "Do not recommend routine antiviral therapy for uncomplicated hepatitis A because no specific antiviral has an established curative role.",
      "Avoid alcohol and do not assume an over-the-counter product is liver-safe; medication and supplement use should be reviewed when hepatitis is active."
    ]),

    patch("Hepatitis B", ["w44-cdc-hepb-care", "w44-aasld-hbv-2025"], [
      "Most uncomplicated acute hepatitis B is managed with hydration, nutrition, symptom control, and clinical and laboratory follow-up. Severe, protracted, or fulminant disease requires urgent hepatology or transplant-center evaluation and may need specialist antiviral therapy.",
      "Chronic hepatitis B treatment is selected from HBV DNA level, ALT pattern, fibrosis or cirrhosis, age, comorbidity, pregnancy and transmission context, prior therapy, and renal or bone risk; not every person with chronic HBV starts medication at the same point.",
      "When chronic-HBV antiviral therapy is indicated, high-barrier oral agents include tenofovir disoproxil fumarate, tenofovir alafenamide, and entecavir. They suppress viral replication and lower cirrhosis and liver-cancer risk, but usually do not eradicate intrahepatic cccDNA, so adherence and long-term monitoring remain important.",
      "Peginterferon alfa may be a finite specialist option for selected patients, but interferon beta is a multiple-sclerosis therapy and is not an appropriate hepatitis B treatment. Do not treat the words 'interferon' as interchangeable.",
      "Continue HBV DNA, ALT, renal and bone safety when relevant, fibrosis, and hepatocellular-carcinoma surveillance according to risk. Hepatitis B vaccine and HBIG prevent infection after qualifying exposure or at birth; they do not clear established chronic infection."
    ], ["Tenofovir", "Entecavir"], "ANI's Tenofovir umbrella card covers the tenofovir prodrugs discussed above, while Entecavir has its own medication card; both links represent high-confidence direct antiviral therapy for appropriately selected chronic hepatitis B. Peginterferon alfa can also directly treat selected chronic HBV, but it is discussed in the treatment text rather than linked to ANI's incorrect interferon beta card.", [
      "Interferon beta does not treat hepatitis B and must not be substituted for peginterferon alfa.",
      "Do not present vaccination or HBIG as treatment of established infection; they are preventive immunoprophylaxis.",
      "Do not stop nucleos(t)ide analogue therapy without the hepatitis clinician's plan because withdrawal can trigger a severe hepatitis flare.",
      "Check pregnancy, renal function, bone risk, HIV coinfection, cirrhosis, prior resistance, and product-specific requirements before choosing an antiviral."
    ]),

    patch("Hydrocephalus", ["w44-cns-hydrocephalus-diversion", "w44-cns-hydrocephalus-phh"], [
      "Treat progressive or symptomatic hydrocephalus by restoring cerebrospinal-fluid flow or diversion. Depending on cause and anatomy, this may require a ventriculoperitoneal shunt, endoscopic third ventriculostomy, temporary external ventricular drainage, or another neurosurgical pathway.",
      "Acute declining consciousness, new pupillary change, bradycardia with hypertension, repeated vomiting, bulging fontanel with deterioration, or shunt-failure signs require emergency neurosurgical assessment because pressure can injure the brain before a medication could correct the obstruction.",
      "Treat the cause separately when possible, such as removing an obstructing lesion, managing hemorrhage, or treating proven meningitis or shunt infection. Antibiotics treat infection; they do not reopen an obstructed CSF pathway.",
      "Do not present acetazolamide or furosemide as routine definitive hydrocephalus therapy or as a reliable substitute for needed diversion. In premature infants with posthemorrhagic hydrocephalus, the studied combination is specifically not recommended to reduce shunt need.",
      "After diversion, monitor neurologic status, head growth in infants, wound and shunt tract, fever, vomiting, behavior, gait, headache pattern, and signs of overdrainage or infection because shunt obstruction and infection can recur abruptly."
    ], [], "No medication is a universal direct treatment for hydrocephalus. Definitive care is cause- and anatomy-specific CSF diversion or restoration; drugs may address a separate cause, symptom, or infection but should not appear as generic hydrocephalus-treatment buttons.", [
      "Do not delay neurosurgical evaluation for worsening intracranial-pressure signs while trying diuretics.",
      "Acetazolamide plus furosemide is not recommended to reduce shunt placement in premature infants with posthemorrhagic hydrocephalus.",
      "Do not label antibiotics as hydrocephalus therapy; they are used when a shunt or central nervous system infection is actually present."
    ]),

    patch("Rabies", ["w44-cdc-rabies-pep", "w44-cdc-rabies-overview"], [
      "After a credible exposure and before symptoms, immediately wash and irrigate wounds and obtain urgent public-health risk assessment. For a previously unvaccinated person, indicated postexposure prophylaxis combines human rabies immune globulin with vaccine; prior vaccination changes the regimen and removes the HRIG indication.",
      "Infiltrate HRIG into and around accessible wounds when indicated and keep it separate from the first vaccine dose and site. Follow the current age-, immune-status-, and prior-vaccination-specific vaccine schedule rather than improvising from a generic disease card.",
      "Postexposure prophylaxis prevents rabies from becoming established; it is not a cure once clinical rabies has begun. Symptomatic rabies is nearly always fatal and requires immediate infectious-disease, critical-care, public-health, infection-control, and goals-of-care coordination.",
      "Once symptomatic, manage airway, autonomic instability, seizures, agitation, pain, hydration, and organ failure in an intensive supportive plan. Sedatives, analgesics, and antiseizure drugs treat manifestations but do not eradicate rabies virus.",
      "Do not wait for symptoms after a credible exposure because the preventive window is the actionable window and symptoms generally indicate established central nervous system disease."
    ], [], "Rabies vaccine and HRIG are exposure-directed prophylaxis before symptoms, not direct medication treatment of symptomatic rabies. Symptom-control medicines provide supportive care only; there is no reliably curative medication for established clinical rabies.", [
      "Do not list acetaminophen, benzodiazepines, or other symptom-control medicines as rabies treatment.",
      "Do not give HRIG to a previously vaccinated person, and never mix HRIG with vaccine or place the first doses at the same anatomic site.",
      "Do not delay indicated postexposure prophylaxis while waiting for symptoms or routine testing of the exposed person."
    ]),

    patch("Retinal detachment", ["w44-aao-retinal-detachment"], [
      "Treat new flashes, a sudden shower of floaters, a curtain or shadow, or acute visual-field loss as a same-day ophthalmic emergency because the repair strategy and visual prognosis depend on detachment type, extent, macular status, and timing.",
      "Rhegmatogenous and tractional detachments generally require anatomic repair with laser retinopexy or cryopexy for selected breaks, pneumatic retinopexy, scleral buckle, vitrectomy, or a combined procedure. These interventions close the break or relieve traction so the retina can reappose.",
      "Exudative detachment is treated by identifying and treating the inflammatory, vascular, or neoplastic cause; a corticosteroid or anti-VEGF drug in that context treats the cause, not every retinal detachment.",
      "Postoperative antibiotic, anti-inflammatory, cycloplegic, or analgesic medicines prevent or manage procedural consequences and do not reattach the retina. Follow prescribed positioning and gas-bubble restrictions because tamponade works only when the bubble contacts the intended break.",
      "Escalate recurrent curtain, worsening vision, severe pain, purulent discharge, fever, nausea with ocular pain, or failure to maintain required positioning because redetachment, pressure rise, hemorrhage, or infection can threaten vision."
    ], [], "No generic medication reattaches a detached retina. The definitive pathway is urgent type-specific ophthalmic repair or treatment of a clearly identified exudative cause; postoperative eye drops are adjuncts rather than treatment of the detachment itself.", [
      "Do not display prednisolone eye drops, ciprofloxacin ophthalmic, or acetaminophen as direct treatment for a generic retinal detachment.",
      "Do not delay ophthalmology referral while trying eye drops.",
      "After an intraocular gas bubble, follow explicit altitude, air-travel, positioning, and anesthesia restrictions; nitrous oxide can dangerously expand intraocular gas."
    ]),

    patch("Rubella", ["w44-cdc-rubella-overview"], [
      "There is no specific antiviral treatment for rubella. Provide hydration, rest, and symptom relief when needed while confirming the diagnosis through public-health guidance because the rash is nonspecific and many infections are mild or subclinical.",
      "Use appropriate isolation and notify public health promptly because preventing exposure, especially to pregnant people, is more important than treating the usually mild symptoms.",
      "A pregnant patient with suspected exposure or infection needs urgent obstetric and public-health evaluation of immunity, testing, gestational timing, and fetal risk; acetaminophen may reduce fever but cannot prevent congenital rubella syndrome.",
      "MMR vaccine prevents future rubella but does not treat current infection and is contraindicated during pregnancy. A nonimmune postpartum patient should receive vaccination according to current recommendations.",
      "Monitor rare encephalitis, thrombocytopenic bleeding, severe dehydration, or other complications and treat the complication specifically without relabeling that therapy as antiviral rubella treatment."
    ], [], "Rubella has no specific antiviral medication. Antipyretics are symptom relief, and MMR is preventive vaccination rather than treatment of active rubella.", [
      "Do not list MMR vaccine as treatment for active rubella.",
      "Do not administer live MMR vaccine during pregnancy; arrange postpartum vaccination when indicated.",
      "Do not assume a compatible rash is rubella without public-health-directed testing, especially during pregnancy."
    ]),

    patch("Shoulder dystocia", ["w44-rcog-shoulder-dystocia"], [
      "Announce shoulder dystocia, call the obstetric and neonatal response teams, record the head-to-body interval, and begin a rehearsed maneuver sequence because the emergency is mechanical impaction of the shoulder, not a contraction problem that medication can release.",
      "Use McRoberts positioning and correctly directed suprapubic pressure, then proceed through institution-approved internal rotation, posterior-arm delivery, all-fours positioning, or other advanced maneuvers based on response and expertise.",
      "Do not use fundal pressure because it can drive the anterior shoulder more firmly behind the pubic symphysis and increase fetal and maternal injury.",
      "After birth, assess the newborn for brachial-plexus injury, fracture, hypoxia, and respiratory compromise and assess the mother for hemorrhage, severe laceration, uterine injury, and shock.",
      "Oxytocin, tranexamic acid, misoprostol, methylergonovine, or carboprost may be indicated after delivery for uterine atony or postpartum hemorrhage according to contraindications; none releases the impacted shoulder or treats shoulder dystocia itself."
    ], [], "No medication treats the mechanical impaction of shoulder dystocia. Obstetric maneuvers are definitive; uterotonics and tranexamic acid may treat a postpartum hemorrhage complication only after delivery.", [
      "Never present uterotonics or tranexamic acid as shoulder-dystocia treatment.",
      "Avoid fundal pressure during shoulder dystocia.",
      "Do not allow attempts to obtain medication to delay immediate mechanical maneuvers and team activation."
    ]),

    patch("Placenta previa", ["w44-rcog-placenta-2026"], [
      "Stabilize maternal circulation, quantify bleeding, obtain appropriate laboratory testing and blood-bank preparation, and monitor the fetus when viable. Avoid digital cervical examination until placental location is known because touching a placenta over the os can provoke catastrophic bleeding.",
      "Management depends on placental relationship to the cervical os, bleeding severity and recurrence, gestational age, maternal and fetal status, labor, and local capability. Observation is possible only when stable; major hemorrhage or instability requires urgent delivery and resuscitation.",
      "Persistent placenta previa usually requires planned cesarean delivery because no medication can move placental tissue away from the cervical opening.",
      "Antenatal corticosteroids may mature the fetal lungs when preterm delivery risk meets gestational criteria, and magnesium sulfate may provide fetal neuroprotection in a qualifying very-preterm birth. These medicines benefit the fetus in threatened early delivery; they do not treat placenta previa.",
      "Uterotonics and tranexamic acid may be used after delivery if postpartum hemorrhage occurs and product-specific contraindications are satisfied. Their role is hemorrhage management, not correction of placental location."
    ], [], "No medication moves or resolves placenta previa. Corticosteroids and magnesium sulfate are fetal-protection adjuncts for selected preterm-delivery risk, while uterotonics or tranexamic acid treat hemorrhage after it occurs.", [
      "Do not list betamethasone, magnesium sulfate, oxytocin, or tranexamic acid as direct treatment for placenta previa.",
      "Avoid digital cervical examination until previa has been excluded by appropriate imaging and the obstetric plan permits examination.",
      "Do not delay delivery and hemorrhage response for medication administration when bleeding is severe or maternal or fetal status is unstable."
    ]),

    patch("Placenta accreta spectrum", ["w44-rcog-placenta-2026", "w44-acog-placenta-accreta"], [
      "Plan delivery at an experienced maternal-care center with maternal-fetal medicine, anesthesia, pelvic surgical expertise, neonatology, critical care, interventional resources when appropriate, and a blood bank prepared for massive hemorrhage.",
      "For significant placenta accreta spectrum, the generally accepted approach is planned cesarean hysterectomy with the placenta left in situ after fetal delivery because forced placental separation can tear invaded vessels and cause catastrophic hemorrhage.",
      "Conservative or expectant uterine-preserving strategies are not routine medication alternatives; they require careful selection, counseling, specialist expertise, and prolonged surveillance for delayed bleeding, infection, fistula, organ injury, and later hysterectomy.",
      "No medication detaches an abnormally invasive placenta safely. Uterotonics address contractile uterine bleeding, tranexamic acid reduces fibrin breakdown during hemorrhage, antibiotics prevent or treat infection, and blood components replace losses; each is an adjunct to the operative and hemorrhage plan.",
      "Antenatal corticosteroids may be indicated because planned delivery is often preterm, but fetal lung maturation does not treat placental invasion. Escalate labor, membrane rupture, bleeding, shock, fetal compromise, or unplanned intraoperative discovery immediately."
    ], [], "Placenta accreta spectrum is an anatomic invasion disorder with no direct medication cure. Uterotonics, tranexamic acid, antibiotics, antenatal corticosteroids, and transfusion products have contextual perioperative, fetal, infection, or hemorrhage roles rather than detaching or eradicating the invasive placenta.", [
      "Do not display oxytocin, misoprostol, tranexamic acid, or antibiotics as direct treatment for placenta accreta spectrum.",
      "Do not forcibly remove a placenta suspected to be accreta; pause and mobilize the planned hemorrhage and surgical response when circumstances allow.",
      "Do not present methotrexate as routine treatment for placenta accreta spectrum; mature placental tissue is not reliably removed by this approach and serious toxicity can occur."
    ]),

    patch("Pleural effusion", ["w44-bts-pleural-disease"], [
      "First determine why fluid accumulated because pleural effusion is a manifestation, not one disease. Use clinical context, imaging, ultrasound-guided sampling when indicated, and pleural-fluid analysis to distinguish transudative, infectious, malignant, hemorrhagic, chylous, and inflammatory pathways.",
      "Treat the cause: diuresis may reduce a heart-failure transudate, antimicrobials and source control treat pleural infection, cancer therapy addresses malignant disease, and disease-specific therapy addresses embolic, hepatic, renal, or autoimmune causes. These drugs treat the cause rather than a universal pleural-fluid target.",
      "Use therapeutic thoracentesis for selected large symptomatic effusions and an intercostal drain for empyema, complicated parapneumonic effusion, hemothorax, or another drainage indication. Recurrent malignant effusion may require an indwelling pleural catheter or pleurodesis.",
      "Analgesics or opioids may reduce pain or dyspnea but do not remove pleural fluid or treat its cause. Monitor oxygenation, work of breathing, blood pressure, procedure site, drainage system, and postprocedure pneumothorax or re-expansion injury.",
      "Escalate respiratory distress, rapidly enlarging effusion, sepsis, pus or low-pH infectious fluid, mediastinal shift, active hemothorax, or hemodynamic instability because drainage and source control may be urgent."
    ], [], "There is no single direct medication for the syndrome of pleural effusion. Furosemide, antibiotics, chemotherapy, and anti-inflammatory drugs may treat a specific underlying cause; analgesics treat symptoms; drainage directly removes fluid when indicated.", [
      "Do not present furosemide, ceftriaxone, vancomycin, or morphine as universal pleural-effusion treatment.",
      "Do not start antibiotics solely because an effusion exists; use the clinical, microbiologic, imaging, and pleural-fluid evidence for infection.",
      "Do not perform blind drainage when ultrasound guidance and a safer planned route are available."
    ]),

    patch("Pressure injuries", ["w44-international-pressure-injury"], [
      "Immediately offload the injured area and correct the pressure, shear, friction, moisture, device, perfusion, mobility, or nutrition contributors because a dressing cannot heal tissue that remains mechanically compressed or ischemic.",
      "Use an individualized repositioning plan, pressure-redistributing support surface, heel suspension or other site-specific offloading, moisture and incontinence care, and daily skin and device inspection. Frequency depends on tissue tolerance and clinical stability rather than one rigid clock rule.",
      "Stage accurately and assess wound size, depth, undermining, tunneling, drainage, odor, surrounding skin, pain, perfusion, and exposed structures. Debride devitalized tissue when appropriate, but protect stable dry heel eschar when the vascular and wound plan indicates it should remain intact.",
      "Choose dressings and local wound therapy for moisture balance, depth, exudate, bioburden, anatomy, goals, and product indications. Nutrition and hydration assessment supports healing, but protein or supplements cannot overcome ongoing pressure or critical ischemia.",
      "Analgesics treat pain, topical agents serve selected wound-plan roles, and systemic antibiotics treat cellulitis, osteomyelitis, bacteremia, or another confirmed invasive infection. Colonization alone and the presence of a wound do not make antibiotics a direct treatment for pressure injury."
    ], [], "No single medication heals a pressure injury. The direct treatment foundation is pressure relief, shear and moisture control, perfusion and nutrition assessment, stage-appropriate wound care, and debridement when indicated; analgesics and antibiotics address symptoms or complications.", [
      "Do not display acetaminophen, morphine, mupirocin, silver sulfadiazine, or systemic antibiotics as generic direct treatment for pressure injuries.",
      "Do not use systemic antibiotics for colonization or a positive surface culture without clinical invasive infection.",
      "Do not massage nonblanchable erythema or continue pressure over injured tissue."
    ]),

    patch("Patent foramen ovale", ["w44-aha-stroke-pfo-2021"], [
      "Most patent foramen ovales are incidental and require no treatment. Before attributing a stroke to a PFO, complete an age-appropriate search for atrial fibrillation, arterial disease, small-vessel disease, thrombophilia, venous thromboembolism, and another plausible embolic source.",
      "Percutaneous closure can reduce recurrent stroke risk in selected patients after a nonlacunar ischemic stroke when no better cause is found and PFO anatomy and patient factors support a causal role. Closure is a secondary-prevention procedure, not a routine response to every incidental PFO.",
      "Antiplatelet therapy may be selected for secondary prevention after a noncardioembolic stroke, while anticoagulation is selected for a separate indication such as venous thromboembolism or atrial fibrillation. Neither medicine closes the foramen, and an incidental PFO alone is not an indication for empiric anticoagulation.",
      "After device closure, temporary antiplatelet therapy and follow-up imaging may be prescribed to prevent device thrombosis and confirm closure. That postoperative role must not be mislabeled as medication treatment of the original opening.",
      "Escalate new focal neurologic deficit, hypoxemia with positional change, suspected venous thrombosis, arrhythmia, or device-related symptoms because the urgent problem is stroke, embolic source, hypoxemia, or a procedural complication."
    ], [], "No medication closes a patent foramen ovale. Antiplatelets and anticoagulants may prevent recurrent embolic events when a separate stroke or thrombotic indication exists, and short-term antiplatelet therapy may follow device closure; those are prevention or peri-device roles.", [
      "Do not prescribe or display aspirin, clopidogrel, warfarin, or apixaban as direct treatment merely because a PFO is present.",
      "Do not empirically anticoagulate an embolic stroke of uncertain source without a defined indication.",
      "Do not send an incidental PFO directly to closure without determining whether it plausibly caused the clinical event."
    ]),

    patch("Atrial septal defect", ["w44-aha-atrial-septal-defect"], [
      "Observe a small hemodynamically insignificant atrial septal defect with appropriate cardiology follow-up; no medication is needed simply because the opening exists.",
      "Close a significant secundum defect by catheter device when anatomy is suitable or by surgery when the defect type, size, anatomy, associated lesions, or operative needs require it. Closure corrects the left-to-right shunt and right-heart volume load.",
      "Diuretics may relieve congestion, rate or rhythm medicines treat atrial arrhythmias, and pulmonary-hypertension therapy treats a defined pulmonary vascular complication. These medicines do not close the septum and should not be presented as interchangeable ASD treatment.",
      "Antiplatelet therapy after device closure is a temporary device-healing or thrombosis-prevention plan. Anticoagulation is reserved for a separate embolic or rhythm indication, not routinely for every ASD.",
      "Evaluate pulmonary vascular resistance before closure in advanced pulmonary hypertension because closing a shunt after irreversible Eisenmenger physiology can remove a pressure-relief pathway and worsen hemodynamics."
    ], [], "No medication directly closes an atrial septal defect. Drugs may treat heart failure, arrhythmia, pulmonary hypertension, thrombosis risk, or the temporary post-device period; observation or anatomic closure is the defect-specific pathway.", [
      "Do not list furosemide, digoxin, metoprolol, aspirin, or warfarin as universal direct treatment for ASD.",
      "Do not close an ASD automatically when severe irreversible pulmonary vascular disease or Eisenmenger physiology may make closure harmful.",
      "Do not give routine endocarditis prophylaxis indefinitely after an uncomplicated fully healed closure; follow current lesion- and procedure-specific guidance."
    ]),

    patch("Aortic aneurysm", ["w44-acc-aortic-2022"], [
      "Use the same validated imaging method and anatomic measurement conventions for surveillance because intervention thresholds depend on location, diameter, growth rate, body size, cause, family history, symptoms, valve disease, and pregnancy plans rather than one universal number.",
      "Reduce wall stress and future vascular events through individualized blood-pressure control, smoking cessation, exercise and lifting guidance, and treatment of relevant lipids or atherosclerotic disease. Beta blockers or an ARB may be appropriate in selected thoracic or heritable aortopathy contexts, but they do not remove an existing aneurysm.",
      "Use statin therapy when atherosclerosis provides an indication and low-dose aspirin only when concomitant atherosclerosis or penetrating aortic ulcer and bleeding risk support it. These agents are not universal aneurysm-shrinking drugs.",
      "Repair by open or endovascular technique when location-specific size, symptoms, rapid growth, rupture risk, associated surgery, or genetic condition crosses the specialist threshold. Repair, not chronic medication, corrects the threatened segment.",
      "Sudden severe chest, back, or abdominal pain, syncope, hypotension, pulse or neurologic deficit, or a tender symptomatic abdominal aneurysm requires emergency evaluation for rupture or acute aortic syndrome; acute anti-impulse therapy belongs to that emergency pathway and must not be copied onto every stable aneurysm."
    ], [], "No medication removes an established aortic aneurysm. Antihypertensives reduce wall stress, while statins and aspirin apply only to appropriate atherosclerotic indications; surveillance and timely open or endovascular repair are aneurysm-specific management.", [
      "Do not display esmolol, nicardipine, or other acute anti-impulse drugs as routine direct treatment for every stable aneurysm; that regimen belongs to acute aortic syndrome or severe hypertension pathways.",
      "Do not display aspirin or a statin as universal aneurysm treatment without an atherosclerotic or other guideline-supported indication.",
      "Do not delay emergency imaging and surgical consultation for symptoms suggesting rupture or dissection while attempting outpatient blood-pressure treatment."
    ]),

    patch("Rotator cuff tear", ["w44-aaos-rotator-cuff-2025"], [
      "Begin with an individualized combination of activity modification, ice or other comfort measures, appropriate nonopioid analgesia when safe, and progressive physical therapy that restores motion, scapular control, and rotator-cuff strength. These measures reduce pain and improve function but do not physically reconnect a full-thickness tendon tear.",
      "A single local corticosteroid injection with anesthetic can be considered for short-term pain and function when symptoms limit rehabilitation. It is symptom treatment, not tendon repair, and timing near planned surgery plus repeated injections require orthopedic review because they can affect tissue and surgical risk.",
      "Routine systemic prednisone is not a standard treatment for healing a rotator-cuff tear and should not be inherited from the word corticosteroid. If an oral glucocorticoid is being considered for a separate inflammatory diagnosis, that indication and its risks must be documented separately.",
      "Refer promptly after an acute traumatic tear with marked weakness or inability to raise the arm, and obtain orthopedic assessment when substantial weakness, a large or full-thickness tear, progression, or persistent pain and dysfunction despite rehabilitation makes repair or another procedure appropriate.",
      "After repair, follow the procedure-specific immobilization and staged rehabilitation plan because loading too early can disrupt healing while prolonged unplanned immobilization can produce stiffness and weakness."
    ], [], "No medication reconnects a torn rotator-cuff tendon. Analgesics and a selected single local corticosteroid injection may reduce symptoms; rehabilitation and, when indicated, surgical repair address function and anatomy. Systemic prednisone must not appear as routine tear treatment.", [
      "Do not present oral prednisone as routine rotator-cuff-tear treatment or as a way to heal the tendon.",
      "Do not repeat corticosteroid injections or inject near planned repair without orthopedic risk review.",
      "Do not push strengthening through acute traumatic weakness, severe pain, fracture-dislocation concern, neurovascular compromise, or a postoperative restriction."
    ]),

    patch("Cardiac tamponade", ["w44-esc-cardiac-tamponade"], [
      "Cardiac tamponade is relieved by urgently removing the compressing pericardial fluid with image-guided pericardiocentesis or surgical drainage. Drainage restores diastolic filling; medication cannot create space inside the pressurized pericardium.",
      "While definitive drainage is being mobilized, carefully selected small-volume isotonic fluid and a short vasoactive or inotropic bridge may support perfusion in a hypotensive, preload-depleted patient. Temporary improvement must never delay drainage.",
      "Choose surgical drainage or controlled specialist strategy when trauma, clot, loculation, purulent fluid, post-infarction free-wall rupture, or acute aortic dissection changes the safety of ordinary needle drainage.",
      "If anticoagulant-related bleeding caused the hemopericardium, drug-specific reversal and blood components may help stop ongoing bleeding, but reversal does not remove accumulated blood or relieve established tamponade.",
      "Avoid routine diuresis, venodilation, excessive positive-pressure ventilation, or deep induction before hemodynamic planning because reducing venous return can abruptly collapse the already preload-dependent circulation."
    ], [], "No medication directly relieves cardiac tamponade. Limited fluid or vasoactive support is a bridge, and anticoagulant reversal treats ongoing causative bleeding; definitive treatment is urgent pericardial drainage or surgery.", [
      "Do not display normal saline, norepinephrine, dopamine, epinephrine, vitamin K, protamine, idarucizumab, or andexanet as direct treatment for tamponade.",
      "Do not allow temporary blood-pressure improvement from fluids or pressors to delay drainage.",
      "Avoid diuretics and unnecessary preload reduction in hemodynamically significant tamponade."
    ])
  ];

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function canonicalTitle(entry) {
    return String((entry && (entry.name || entry.title || entry.displayName)) || "").trim();
  }

  function uniqueStrings(values) {
    const output = [];
    const seen = new Set();
    (values || []).forEach((value) => {
      const text = String(value || "").trim();
      const key = normalize(text);
      if (!text || seen.has(key)) return;
      seen.add(key);
      output.push(text);
    });
    return output;
  }

  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];
  sources.forEach((source) => {
    const existing = database.sourceReferences.find((entry) => entry && (entry.key || entry.id) === source.key);
    const registered = { ...source, id: source.key };
    if (existing) Object.assign(existing, registered);
    else database.sourceReferences.push(registered);
  });

  const application = [];
  const unresolved = [];

  patches.forEach((entry) => {
    const target = normalize(entry.name);
    const matches = database.diseases.filter((card) => normalize(canonicalTitle(card)) === target);
    if (matches.length !== 1) {
      unresolved.push({ name: entry.name, matchCount: matches.length });
      return;
    }

    const card = matches[0];
    const priorMedications = Array.isArray(card.medicationsCommonlyUsed) ? card.medicationsCommonlyUsed.slice() : [];
    const priorTreatmentCount = Array.isArray(card.treatments) ? card.treatments.length : 0;
    const direct = uniqueStrings(entry.directTreatmentMedications);

    Object.assign(card, {
      treatments: entry.treatments.slice(),
      medicationsCommonlyUsed: direct.slice(),
      directTreatmentMedications: direct.slice(),
      medicationInferenceMode: "explicit-only",
      medicationTreatmentNote: entry.medicationTreatmentNote,
      contraindications: entry.contraindications.slice(),
      sourceKeys: uniqueStrings([
        ...(Array.isArray(card.sourceKeys)
          ? card.sourceKeys.filter((key) => key !== "pathology-medication-treatment-supplement")
          : []),
        ...entry.sourceKeys
      ]),
      treatmentIntegrityReviewed: true,
      treatmentIntegrityVersion: VERSION,
      evidenceLastReviewed: GENERATED_AT
    });

    if (direct.length) card.medicationTreatmentSafetyPolicy = CURATED_POLICY;
    else delete card.medicationTreatmentSafetyPolicy;

    application.push({
      name: entry.name,
      action: "treatment-fields-replaced",
      priorTreatmentCount,
      newTreatmentCount: entry.treatments.length,
      priorMedications,
      directTreatmentMedications: direct.slice(),
      medicationTreatmentSafetyPolicy: direct.length ? CURATED_POLICY : null,
      sourceKeysAdded: entry.sourceKeys.slice()
    });
  });

  if (!String(database.version || "").includes(VERSION)) {
    database.version = [database.version, VERSION].filter(Boolean).join("+");
  }

  window.ANI_CLINICAL_FRONTIER_WAVE44_TREATMENT_INTEGRITY = {
    schemaVersion: 1,
    version: VERSION,
    generatedAt: GENERATED_AT,
    requestedCanonicalTitles: patches.map((entry) => entry.name),
    matchedAndPatchedTitles: application.map((entry) => entry.name),
    unresolved: unresolved.map((entry) => ({ ...entry })),
    authoritativeSourceKeys: sources.map((source) => source.key),
    patchedFields: [
      "treatments",
      "medicationsCommonlyUsed",
      "directTreatmentMedications",
      "medicationInferenceMode",
      "medicationTreatmentNote",
      "contraindications",
      "sourceKeys",
      "treatmentIntegrityReviewed",
      "treatmentIntegrityVersion",
      "evidenceLastReviewed"
    ],
    directMedicationPolicy: {
      value: CURATED_POLICY,
      policyAppliedOnlyWhenDirectListIsNonempty: application.every((entry) => Boolean(entry.medicationTreatmentSafetyPolicy) === Boolean(entry.directTreatmentMedications.length)),
      cardsWithCuratedDirectMedicationButtons: application.filter((entry) => entry.directTreatmentMedications.length).map((entry) => entry.name),
      cardsWithNoDirectMedicationButtons: application.filter((entry) => !entry.directTreatmentMedications.length).map((entry) => entry.name)
    },
    pressureInjuryScope: {
      umbrellaPatched: application.some((entry) => entry.name === "Pressure injuries"),
      stageAndSubtypeCardsIntentionallyUntouched: [
        "Deep tissue pressure injury",
        "Pressure injury stage 1",
        "Pressure injury stage 2",
        "Pressure injury stage 3",
        "Pressure injury stage 4",
        "Unstageable pressure injury"
      ]
    },
    application: application.map((entry) => ({ ...entry }))
  };
}());
