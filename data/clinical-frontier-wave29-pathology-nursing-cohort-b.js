(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  const VERSION = "2026-07-18-wave29-pathology-nursing-b-1";
  const COHORT = "B";

  const sources = [
    { id: "cdc-cmv", label: "Centers for Disease Control and Prevention, Clinical Overview of Cytomegalovirus", url: "https://www.cdc.gov/cytomegalovirus/hcp/clinical-overview/index.html", note: "Supports congenital testing timing, hearing and vision surveillance, transmission precautions, and high-risk escalation." },
    { id: "cdc-lyme-care", label: "Centers for Disease Control and Prevention, Clinical Care and Treatment of Lyme Disease", url: "https://www.cdc.gov/lyme/hcp/clinical-care/index.html", note: "Supports stage-specific antibiotic care, symptom monitoring, and follow-up for Lyme disease." },
    { id: "cdc-lyme-carditis", label: "Centers for Disease Control and Prevention, Clinical Care and Treatment of Lyme Carditis", url: "https://www.cdc.gov/lyme/hcp/clinical-care/lyme-carditis.html", note: "Supports rapid recognition of changing heart block, electrocardiographic monitoring, and cardiac escalation." },
    { id: "cdc-mpox-care", label: "Centers for Disease Control and Prevention, Caring for Patients with Mpox", url: "https://www.cdc.gov/mpox/hcp/clinical-care/index.html", note: "Supports pain and lesion care, severe-disease recognition, antiviral coordination, and high-risk follow-up." },
    { id: "cdc-mpox-infection", label: "Centers for Disease Control and Prevention, Infection Prevention and Control in Healthcare Settings for Mpox", url: "https://www.cdc.gov/monkeypox/hcp/infection-control", note: "Supports lesion source control, personal protective equipment, linen handling, environmental cleaning, and duration of precautions." },
    { id: "cdc-anthrax", label: "Centers for Disease Control and Prevention, Clinical Overview of Anthrax", url: "https://www.cdc.gov/anthrax/hcp/clinical-overview/index.html", note: "Supports route-specific recognition, immediate public-health coordination, and severe-anthrax escalation." },
    { id: "cdc-anthrax-guideline", label: "Centers for Disease Control and Prevention, Guidelines for the Prevention and Treatment of Anthrax", url: "https://www.cdc.gov/mmwr/volumes/72/rr/rr7206a1.htm", note: "Supports specimen, antimicrobial, antitoxin, meningitis, and critical-care management for anthrax." },
    { id: "cdc-diphtheria", label: "Centers for Disease Control and Prevention, Clinical Guidance for Diphtheria", url: "https://www.cdc.gov/diphtheria/hcp/clinical-guidance/index.html", note: "Supports presumptive treatment, respiratory or cutaneous precautions, cultures, contact management, and complication surveillance." },
    { id: "cdc-diphtheria-antitoxin", label: "Centers for Disease Control and Prevention, Diphtheria Antitoxin", url: "https://www.cdc.gov/diphtheria/hcp/dat/index.html", note: "Supports urgent antitoxin consultation and administration without waiting for laboratory confirmation." },
    { id: "cdc-ebola", label: "Centers for Disease Control and Prevention, Clinical Guidance for Ebola Disease", url: "https://www.cdc.gov/ebola/hcp/clinical-guidance/index.html", note: "Supports immediate isolation, public-health notification, protected diagnostic care, fluid management, and exposure prevention." },
    { id: "cdc-varicella", label: "Centers for Disease Control and Prevention, Varicella-Zoster Virus Infection Control", url: "https://www.cdc.gov/infection-control/hcp/healthcare-personnel-epidemiology-control/varicella.html", note: "Supports airborne and contact precautions, immunity review, exposure management, and high-risk disease recognition." },
    { id: "cdc-west-nile-signs", label: "Centers for Disease Control and Prevention, Clinical Signs and Symptoms of West Nile Virus Disease", url: "https://www.cdc.gov/west-nile-virus/hcp/clinical-signs/index.html", note: "Supports recognition of meningitis, encephalitis, acute flaccid myelitis, and respiratory neuromuscular failure." },
    { id: "cdc-west-nile-treatment", label: "Centers for Disease Control and Prevention, Treatment and Prevention of West Nile Virus Disease", url: "https://www.cdc.gov/west-nile-virus/hcp/treatment-prevention/index.html", note: "Supports supportive care, neurologic monitoring, airway protection, and complication prevention." },
    { id: "cdc-botulism", label: "Centers for Disease Control and Prevention, Clinical Guidelines for Diagnosis and Treatment of Botulism", url: "https://www.cdc.gov/mmwr/volumes/70/rr/rr7002a1.htm", note: "Supports immediate antitoxin consultation, serial bulbar and respiratory examination, intensive monitoring, and rehabilitation." },
    { id: "cdc-nec-fasc", label: "Centers for Disease Control and Prevention, Clinical Guidance for Type II Necrotizing Fasciitis", url: "https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/necrotizing-fasciitis.html", note: "Supports rapid recognition, immediate surgical exploration, antibiotics, and shock management." },
    { id: "idsa-ssti", label: "Infectious Diseases Society of America, Skin and Soft Tissue Infection Guideline", url: "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/", note: "Supports urgent surgical consultation and broad empiric treatment when necrotizing infection is suspected." },
    { id: "cdc-scarlet", label: "Centers for Disease Control and Prevention, Clinical Guidance for Scarlet Fever", url: "https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/scarlet-fever.html", note: "Supports streptococcal testing, antibiotic completion, transmission reduction, and complication recognition." },
    { id: "pids-septic-arthritis", label: "Pediatric Infectious Diseases Society and Infectious Diseases Society of America, Acute Bacterial Arthritis in Pediatrics Guideline", url: "https://www.idsociety.org/practice-guideline/acute-bacterial-arthritis-in-pediatrics2/", note: "Supports cultures, joint sampling and drainage, antimicrobial monitoring, mobility reassessment, and sepsis escalation." },
    { id: "cdc-smallpox-diagnosis", label: "Centers for Disease Control and Prevention, Smallpox Diagnosis and Testing", url: "https://www.cdc.gov/smallpox/hcp/diagnosis-testing/", note: "Supports immediate isolation, public-health consultation, safe specimen coordination, and differential assessment." },
    { id: "cdc-smallpox-response", label: "Centers for Disease Control and Prevention, Healthcare Facility Response to Smallpox", url: "https://www.cdc.gov/smallpox/php/bioterrorism-response-planning/healthcare-facility-response.html", note: "Supports airborne and contact precautions, controlled transport, exposure management, and response coordination." },
    { id: "cdc-parvovirus", label: "Centers for Disease Control and Prevention, Parvovirus B19 in Pregnancy", url: "https://www.cdc.gov/parvovirus-b19/about/parvovirus-b19-in-pregnancy.html", note: "Supports maternal testing, obstetric referral, fetal anemia and hydrops surveillance, and counseling after exposure." },
    { id: "cdc-isolation-appendix-a", label: "Centers for Disease Control and Prevention, Isolation Precautions Appendix A", url: "https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-type-duration.html", note: "Supports Droplet plus Standard Precautions for hospitalized parvovirus B19 infection, including seven days for transient aplastic or red-cell crisis and the duration of hospitalization for chronic infection in an immunocompromised patient." },
    { id: "cdc-chlamydia", label: "Centers for Disease Control and Prevention, Chlamydial Infections Treatment Guidelines", url: "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", note: "Supports confidential testing, treatment, partner services, abstinence interval, pregnancy test of cure, and retesting." },
    { id: "acog-breastfeeding", label: "American College of Obstetricians and Gynecologists, Breastfeeding Challenges", url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2021/02/breastfeeding-challenges", note: "Supports effective milk removal, breastfeeding continuation, analgesia, and assessment of mastitis complications." },
    { id: "abm-mastitis", label: "Academy of Breastfeeding Medicine, Protocol 36: The Mastitis Spectrum", url: "https://pubmed.ncbi.nlm.nih.gov/35576513/", note: "Supports physiologic feeding, avoidance of aggressive massage and oversupply, anti-inflammatory care, antibiotics, and abscess evaluation." },
    { id: "acog-perineal", label: "American College of Obstetricians and Gynecologists, Management of Perineal Care After Vaginal Delivery", url: "https://www.acog.org/education-and-events/creog/curriculum-resources/cases-in-high-value-care/management-of-perineal-care-after-vaginal-delivery", note: "Supports laceration assessment, pain and bowel care, urinary monitoring, wound surveillance, and follow-up after obstetric anal sphincter injury." },
    { id: "cmqcc-hemorrhage", label: "California Maternal Quality Care Collaborative, Obstetric Hemorrhage Toolkit", url: "https://www.cmqcc.org/toolkits-quality-improvement/hemorrhage", note: "Supports quantified blood loss, staged hemorrhage response, laboratory trending, blood products, and team escalation." },
    { id: "cdph-dic", label: "California Department of Public Health, Hemorrhage Death Prevention Recommendations", url: "https://www.cdph.ca.gov/Programs/CFH/DMCAH/Pages/Policy-Recommendations/CA-PARC-Hemorrhage-Death-Prevention-Recommendations-for-Providers.aspx", note: "Supports early recognition and coordinated treatment of obstetric hemorrhage and coagulopathy." },
    { id: "acog-chorio", label: "American College of Obstetricians and Gynecologists, Intrapartum Management of Intraamniotic Infection", url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/08/intrapartum-management-of-intraamniotic-infection", note: "Supports maternal and fetal monitoring, antibiotics, antipyresis, neonatal notification, and postpartum complication surveillance." },
    { id: "rcog-cord", label: "Royal College of Obstetricians and Gynaecologists, Umbilical Cord Prolapse Guideline", url: "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/umbilical-cord-prolapse-green-top-guideline-no-50/", note: "Supports immediate emergency activation, manual elevation, maternal positioning, fetal monitoring, and expedited birth." },
    { id: "smfm-pprom", label: "Society for Maternal-Fetal Medicine, Previable and Periviable Preterm Prelabor Rupture of Membranes", url: "https://publications.smfm.org/publications/573-society-for-maternal-fetal-medicine-consult-series-71/", note: "Supports individualized counseling, infection surveillance, latency management, and maternal-fetal escalation." },
    { id: "apsa-meckel", label: "American Pediatric Surgical Association, Meckel Diverticulum Patient and Family Resource", url: "https://apsapedsurg.org/parents/learn-about-a-condition/f-o/", note: "Supports recognition of painless bleeding, obstruction and inflammation, diagnostic evaluation, and surgical care." },
    { id: "acr-jia", label: "American College of Rheumatology, Juvenile Idiopathic Arthritis Guideline", url: "https://rheumatology.org/juvenile-idiopathic-arthritis-guideline", note: "Supports joint and function monitoring, medication safety, ophthalmic screening, and systemic complication recognition." },
    { id: "cdc-rheumatic", label: "Centers for Disease Control and Prevention, Clinical Guidance for Acute Rheumatic Fever", url: "https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/acute-rheumatic-fever.html", note: "Supports carditis assessment, electrocardiography and echocardiography, symptom treatment, and secondary prophylaxis." },
    { id: "aap-jaundice", label: "American Academy of Pediatrics, Hyperbilirubinemia in the Newborn Infant Guideline", url: "https://publications.aap.org/pediatrics/article/150/3/e2022058859/188726/Clinical-Practice-Guideline-Revision-Management-of", note: "Supports risk- and age-specific bilirubin measurement, feeding support, phototherapy safety, follow-up, and encephalopathy escalation." },
    { id: "ernica-hirschsprung", label: "European Reference Network for Rare Inherited and Congenital Digestive Disorders, Hirschsprung Disease Guideline", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7318734/", note: "Supports enterocolitis recognition, bowel decompression, perioperative care, and long-term bowel-function follow-up." },
    { id: "rch-pyloric", label: "Royal Children's Hospital Melbourne, Pyloric Stenosis Clinical Practice Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Pyloric_Stenosis/", note: "Supports dehydration and electrolyte correction, safe feeding cessation, surgical preparation, and diagnostic reassessment." },
    { id: "aha-tof", label: "American Heart Association, Tetralogy of Fallot", url: "https://www.heart.org/en/health-topics/congenital-heart-defects/about-congenital-heart-defects/tetralogy-of-fallot", note: "Supports cyanosis and hypercyanotic-spell recognition, cardiac follow-up, feeding and growth care, and postoperative surveillance." },
    { id: "cdc-safe-sleep", label: "Centers for Disease Control and Prevention, Helping Babies Sleep Safely", url: "https://www.cdc.gov/sudden-infant-death/sleep-safely/", note: "Supports supine sleep, a firm flat separate surface, an empty sleep space, room sharing, and smoke and overheating avoidance." },
    { id: "nice-dementia", label: "National Institute for Health and Care Excellence, Dementia: Assessment, Management and Support", url: "https://www.nice.org.uk/guidance/ng97/chapter/Recommendations", note: "Supports person-centered communication, delirium evaluation, function and safety monitoring, caregiver support, and restraint minimization." },
    { id: "ehdn-huntington", label: "European Huntington's Disease Network, Clinical Resources and Services", url: "https://ehdn.org/about-ehdn/resources-and-services/", note: "Supports multidisciplinary motor, swallowing, nutrition, communication, psychiatric, and caregiver care in Huntington disease." },
    { id: "cdc-lead", label: "Centers for Disease Control and Prevention, Clinical Guidance for Lead Exposure", url: "https://www.cdc.gov/lead-prevention/hcp/clinical-guidance/index.html", note: "Supports confirmatory venous testing, reporting, environmental investigation, nutritional and developmental care, and toxicology escalation." },
    { id: "nice-cp", label: "National Institute for Health and Care Excellence, Cerebral Palsy in Under 25s", url: "https://www.nice.org.uk/guidance/ng62/chapter/Recommendations", note: "Supports swallowing, respiratory, pain, mobility, hip, communication, seizure, and multidisciplinary surveillance." },
    { id: "aan-als", label: "American Academy of Neurology, Care of the Patient with Amyotrophic Lateral Sclerosis", url: "https://www.aan.com/Guidelines/Home/GetGuidelineContent/372", note: "Supports serial respiratory and swallowing assessment, noninvasive ventilation, nutrition, communication, and multidisciplinary care." },
    { id: "mg-consensus", label: "International Consensus Guidance for Management of Myasthenia Gravis", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7884987/", note: "Supports bulbar and respiratory surveillance, crisis management, medication review, immunotherapy, and specialist coordination." },
    { id: "nice-seizures", label: "National Institute for Health and Care Excellence, Treating Status Epilepticus, Repeated or Cluster Seizures, and Prolonged Seizures", url: "https://www.nice.org.uk/guidance/ng217/chapter/treating-status-epilepticus-repeated-or-cluster-seizures-and-prolonged-seizures", note: "Supports seizure timing, first aid, rescue treatment, glucose assessment, and emergency escalation." },
    { id: "nice-spinal", label: "National Institute for Health and Care Excellence, Spinal Injury: Assessment and Initial Management", url: "https://www.nice.org.uk/guidance/ng41/chapter/Recommendations", note: "Supports spinal motion restriction, airway and hemodynamic care, serial neurologic assessment, imaging, and transfer." },
    { id: "pva-sci", label: "Paralyzed Veterans of America, Spinal Cord Injury Clinical Practice Guidelines", url: "https://pva.org/research-resources/publications/clinical-practice-guidelines/", note: "Supports respiratory, skin, bowel, bladder, thrombosis, autonomic dysreflexia, mobility, and rehabilitation care." },
    { id: "acs-tbi", label: "American College of Surgeons, Best Practices Guidelines: Traumatic Brain Injury", url: "https://www.facs.org/media/vgfgjpfk/best-practices-guidelines-traumatic-brain-injury.pdf", note: "Supports serial neurologic examination, oxygenation and perfusion, intracranial pressure care, imaging, and deterioration escalation." },
    { id: "btf-tbi", label: "Brain Trauma Foundation, Guidelines for the Management of Severe Traumatic Brain Injury", url: "https://braintrauma.org/coma/guidelines/severe-tbi", note: "Supports intracranial-pressure and cerebral-perfusion monitoring, seizure prevention, and avoidance of secondary injury." },
    { id: "aaos-compartment", label: "American Academy of Orthopaedic Surgeons, Acute Compartment Syndrome Guideline", url: "https://www.aaos.org/quality/quality-programs/acute-compartment-syndrome/", note: "Supports repeated examination, pressure measurement when needed, urgent surgical decision-making, and complete decompression." },
    { id: "aao-retinal", label: "American Academy of Ophthalmology EyeWiki, Retinal Detachment", url: "https://eyewiki.aao.org/Retinal_Detachment", note: "Supports urgent symptom recognition, visual and pupillary examination, ophthalmic evaluation, and treatment planning." },
    { id: "rch-eye-injury", label: "Royal Children's Hospital Melbourne, Acute Eye Injury Clinical Practice Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Acute_eye_injury/", note: "Supports vision-first trauma assessment, globe protection, hyphema recognition, analgesia, and urgent ophthalmology referral." },
    { id: "nhs-mastoiditis", label: "NHS, Mastoiditis", url: "https://www.nhs.uk/conditions/mastoiditis/", note: "Supports rapid hospital and ENT assessment, intravenous antibiotics, drainage or surgery, and complication recognition." },
    { id: "nice-glaucoma", label: "National Institute for Health and Care Excellence, Glaucoma: Diagnosis and Management", url: "https://www.nice.org.uk/guidance/ng81/chapter/Recommendations", note: "Supports intraocular-pressure, visual-field and optic-nerve reassessment, treatment adherence, drop technique, and escalation for progression." },
    { id: "nci-retinoblastoma", label: "National Cancer Institute, Retinoblastoma Treatment: Health Professional Version", url: "https://www.cancer.gov/types/retinoblastoma/hp/retinoblastoma-treatment-pdq", note: "Supports leukocoria recognition, diagnostic staging, multidisciplinary therapy, genetic evaluation, and recurrence surveillance." },
    { id: "acmt-cannabis", label: "American College of Medical Toxicology, Preventing Cannabis Exposures in Children", url: "https://www.acmt.net/news/acmt-position-statement-revision-preventing-cannabis-exposures-in-children/", note: "Supports pediatric exposure prevention, child-resistant storage, and toxicology-informed counseling." },
    { id: "poison-cannabis", label: "America's Poison Centers, Cannabis Edible Exposure in Children", url: "https://www.poison.org/articles/my-child-ate-a-cannabis-edible", note: "Supports immediate poison-center consultation, delayed symptom recognition, respiratory monitoring, and pediatric escalation." },
    { id: "merck-hallucinogens", label: "Merck Manual Professional Edition, Hallucinogens", url: "https://www.merckmanuals.com/professional/special-subjects/illicit-drugs-and-intoxicants/hallucinogens", note: "Supports low-stimulation supportive care, agitation management, temperature and cardiovascular monitoring, and persistent-psychosis follow-up." },
    { id: "nice-bpd", label: "National Institute for Health and Care Excellence, Borderline Personality Disorder: Recognition and Management", url: "https://www.nice.org.uk/guidance/cg78/chapter/Recommendations", note: "Supports validating crisis care, immediate and long-term risk assessment, collaborative planning, psychotherapy, and cautious prescribing." },
    { id: "nice-self-harm", label: "National Institute for Health and Care Excellence, Self-harm: Assessment, Management and Preventing Recurrence", url: "https://www.nice.org.uk/guidance/ng225/chapter/Recommendations", note: "Supports compassionate medical and psychosocial assessment, immediate safety, collaborative safety planning, and follow-up." },
    { id: "nice-eating", label: "National Institute for Health and Care Excellence, Eating Disorders: Recognition and Treatment", url: "https://www.nice.org.uk/guidance/ng69/chapter/Recommendations", note: "Supports medical-instability assessment, electrocardiography and laboratory monitoring, supervised refeeding, and specialist treatment." },
    { id: "extrip-lithium", label: "EXTRIP Workgroup, Lithium Poisoning Recommendations", url: "https://www.extrip-workgroup.org/lithium", note: "Supports extracorporeal treatment consultation for severe lithium poisoning and monitoring for rebound." },
    { id: "dailymed-lithium", label: "U.S. National Library of Medicine DailyMed, Lithium Drug Labeling", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lithium", note: "Supports toxicity recognition, interaction and hydration counseling, renal and thyroid monitoring, and medication safety." },
    { id: "asam-alcohol", label: "American Society of Addiction Medicine, Alcohol Withdrawal Management Guideline", url: "https://www.asam.org/quality-care/clinical-guidelines/alcohol-withdrawal-management-guideline", note: "Supports structured withdrawal assessment, medication monitoring, thiamine, seizure and delirium prevention, and level-of-care decisions." },
    { id: "nice-alcohol", label: "National Institute for Health and Care Excellence, Alcohol-use Disorders: Physical Complications", url: "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations", note: "Supports acute withdrawal, Wernicke encephalopathy, nutrition, medical complications, and continuing treatment linkage." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const patches = [
    card("Cytomegalovirus infection", ["cdc-cmv"], [
      "Clarify pregnancy, newborn age, transplant status, immune suppression, and symptom onset because CMV is often mild in healthy adults but can damage the fetal brain, retina, hearing, lung, liver, or gastrointestinal tract in high-risk patients.",
      "For suspected congenital CMV, coordinate saliva testing with urine confirmation within the first 2 to 3 weeks of life and document timing because testing later cannot reliably distinguish congenital from postnatal infection.",
      "Trend feeding, weight, head growth, jaundice, petechiae, liver and blood-count results, hearing, vision, and development because congenital effects may be multisystem and hearing loss can emerge after the newborn period.",
      "Use Standard Precautions and meticulous hand hygiene after urine, saliva, diapers, or respiratory secretions because CMV spreads through body fluids; add transmission-based precautions only for another indication or facility policy.",
      "Escalate for apnea, seizures, new focal deficit, severe lethargy, respiratory distress, marked jaundice, bleeding, or worsening vision because CNS, pulmonary, hepatic, hematologic, or retinal disease needs urgent specialist care."
    ], [
      "Seizure, bulging fontanel, rapidly changing head size, focal deficit, or reduced responsiveness",
      "Apnea, hypoxemia, respiratory distress, or inability to feed safely",
      "Marked jaundice, hepatosplenomegaly with deterioration, petechiae with bleeding, or falling platelets",
      "New visual behavior change, retinal symptoms, or failed or worsening hearing assessment"
    ], [
      "Wash hands with soap and water after diapers or contact with saliva, avoid sharing utensils or toothbrushes with young children during pregnancy, and understand that ordinary social contact does not require isolation.",
      "Keep every hearing, eye, growth, and developmental appointment even when the baby seems well, because delayed hearing loss and developmental effects are easier to address when found early."
    ]),
    card("Lyme disease", ["cdc-lyme-care", "cdc-lyme-carditis"], [
      "Document tick exposure, geography, rash evolution, facial weakness, joint swelling, headache, neck stiffness, radicular pain, palpitations, syncope, and dyspnea because Lyme manifestations and urgency change as infection spreads to nervous, cardiac, or joint tissue.",
      "Photograph and measure an expanding erythema migrans lesion when present and obtain testing only as clinically indicated because early characteristic rash can be diagnostic while antibody tests may still be negative.",
      "Administer the prescribed antibiotic on schedule, review allergy and pregnancy status, and monitor gastrointestinal, photosensitivity, and infusion effects because drug choice and route depend on manifestation and host factors.",
      "Obtain an electrocardiogram and continuous rhythm monitoring when cardiac symptoms or conduction abnormality are present because Lyme heart block can change rapidly even when the patient initially appears stable.",
      "Escalate immediately for syncope, chest pain, dyspnea, palpitations with bradycardia, new high-grade block, meningismus, severe headache, facial or limb weakness, or a hot swollen joint with sepsis signs because cardiac, neurologic, or septic alternatives are time-sensitive."
    ], [
      "Syncope, chest pain, dyspnea, palpitations, marked bradycardia, or new conduction block",
      "Severe headache, neck stiffness, facial weakness, radicular pain, confusion, or focal deficit",
      "Hot swollen joint with fever, inability to bear weight, or systemic toxicity",
      "Anaphylaxis, severe antibiotic-associated diarrhea, or clinical worsening despite treatment"
    ], [
      "Take the full antibiotic course exactly as prescribed and call if symptoms worsen; a tick bite does not justify leftover antibiotics, and persistent fatigue after treatment is not proof of ongoing infection.",
      "Prevent new bites with repellent, protective clothing, prompt full-body tick checks, and correct removal with fine-tipped tweezers; record the date and location of future bites."
    ]),
    card("Mpox", ["cdc-mpox-care", "cdc-mpox-infection"], [
      "Place the patient in a single room, cover lesions, use recommended personal protective equipment, and avoid shaking linens or dry sweeping because infectious lesion material can contaminate skin, objects, and airborne particles during handling.",
      "Map lesion number and location, especially eye, mouth, genital, perianal, and airway sites, while measuring pain, hydration, urine and stool passage, and secondary infection because mucosal disease can prevent basic intake and elimination.",
      "Provide scheduled multimodal analgesia, gentle cleansing, nonadherent covering, hydration, and bowel support because uncontrolled pain leads to sleep loss, dehydration, urinary retention, and constipation.",
      "Notify infection prevention and public health, obtain specimens with the correct technique, and coordinate antiviral evaluation for severe disease or high-risk immune status because treatment and contact guidance are risk-dependent.",
      "Escalate for eye pain or vision change, confusion, weakness, seizure, dyspnea, rapidly spreading necrotic lesions, uncontrolled mucosal pain, inability to drink or urinate, or sepsis signs because ocular, neurologic, airway, disseminated, and bacterial complications threaten function or life."
    ], [
      "Eye lesion, eye pain, photophobia, blurred vision, or reduced visual acuity",
      "Confusion, seizure, focal weakness, severe headache, or neck stiffness",
      "Dyspnea, airway lesion, inability to swallow fluids, or rapidly progressive disseminated lesions",
      "Urinary retention, severe anorectal pain with obstruction, hypotension, or secondary bacterial sepsis"
    ], [
      "Keep lesions covered, avoid skin-to-skin and sexual contact, do not share towels, bedding, or utensils, and follow public-health guidance until every lesion has healed with a new layer of skin.",
      "Wash hands before and after touching a lesion or dressing, place laundry gently into a washable bag, and seek prompt care for eye symptoms, confusion, breathing trouble, or inability to drink or urinate."
    ]),
    card("Anthrax", ["cdc-anthrax", "cdc-anthrax-guideline"], [
      "Recognize a suspicious painless black-centered skin lesion, severe gastrointestinal illness, injection-site edema, or rapidly progressive respiratory syndrome and immediately notify infection prevention and public health because anthrax is a reportable emergency requiring coordinated testing and countermeasures.",
      "Collect blood and route-specific specimens exactly as directed before antibiotics when this causes no delay, document exposure details, and preserve chain-of-custody instructions because organism confirmation guides both patient care and population response.",
      "Start prescribed combination antimicrobials and antitoxin promptly for systemic disease, verifying doses, interactions, allergies, and neurologic penetration because toxin-mediated deterioration can continue even after bacteria are killed.",
      "Trend airway, oxygenation, hemodynamics, mental status, urine output, lactate, liver and renal function, and pleural or abdominal fluid because shock, meningitis, and large effusions can develop quickly and may need drainage or critical care.",
      "Use Standard Precautions and cover draining lesions; do not stigmatize or unnecessarily isolate ordinary contacts because anthrax is not usually transmitted person to person, while contaminated material still requires public-health handling."
    ], [
      "Rapid respiratory distress, hypoxemia, mediastinal widening or pleural effusion, or airway edema",
      "Hypotension, rising lactate, oliguria, altered mental status, or other shock findings",
      "Severe headache, meningismus, seizure, focal deficit, or suspected anthrax meningitis",
      "Massive edema, rapidly progressive skin or injection-site disease, severe abdominal pain, hematemesis, or bloody diarrhea"
    ], [
      "Take every dose for the full prescribed duration and do not stop when symptoms improve, because inhaled spores can germinate later; report severe diarrhea, rash, or medication intolerance promptly.",
      "Anthrax generally does not spread through casual contact. Follow public-health instructions about contaminated clothing, mail, animal products, prophylaxis, and vaccination instead of cleaning suspected material yourself."
    ]),
    card("Diphtheria", ["cdc-diphtheria", "cdc-diphtheria-antitoxin"], [
      "Institute Droplet Precautions for respiratory disease or Contact Precautions for cutaneous disease, place the patient in an appropriate room, and notify public health immediately because toxin-producing diphtheria requires rapid contact and exposure control.",
      "Assess voice, stridor, work of breathing, neck swelling, pseudomembrane extent, swallowing, and secretion clearance without forcibly removing the membrane because manipulation can cause bleeding and worsen airway obstruction.",
      "Obtain nose, throat, or wound cultures when feasible, but administer prescribed antitoxin and antibiotics without waiting for confirmation because circulating toxin can injure the heart and nerves irreversibly once tissue-bound.",
      "Use continuous rhythm monitoring and trend pulse, blood pressure, cardiac symptoms, swallowing, cranial nerves, limb strength, and breathing because myocarditis and neuropathy may appear after the throat initially improves.",
      "Continue precautions and coordinate clearance cultures, vaccination, and close-contact prophylaxis with public health because treatment does not guarantee eradication or durable immunity."
    ], [
      "Stridor, rapidly enlarging bull neck, inability to handle secretions, cyanosis, or respiratory fatigue",
      "Chest pain, new dysrhythmia, conduction change, hypotension, or heart-failure signs",
      "New dysphagia, nasal speech, cranial-nerve deficit, limb weakness, or shallow breathing",
      "Anaphylaxis during antitoxin, uncontrolled wound drainage, or clinical deterioration despite therapy"
    ], [
      "Do not scrape or touch the throat membrane. Complete antibiotics, remain in isolation until the clinical and public-health clearance plan is met, and keep follow-up cultures.",
      "Recovery does not reliably create immunity, so the patient and contacts still need age-appropriate vaccination and any prophylaxis directed by public health."
    ]),
    card("Ebola virus disease", ["cdc-ebola"], [
      "Immediately place a patient with compatible exposure and symptoms in a single room with a private bathroom, restrict entry, use trained observers and required personal protective equipment, and notify infection prevention and public health because early containment protects both staff and other patients.",
      "Obtain exposure and symptom history without delaying isolation, maintain a log of everyone entering, and use dedicated equipment because contaminated body fluids and untracked contact drive healthcare transmission.",
      "Assess volume loss with mental status, pulse, blood pressure, perfusion, weight, emesis and stool output, urine output, and electrolytes, replacing fluids and electrolytes with closely measured reassessment because profuse gastrointestinal loss can produce shock rapidly.",
      "Coordinate laboratory draws, specimen packaging, imaging, waste, sharps, and environmental cleaning through the Ebola plan while continuing protected evaluation for malaria, bacterial sepsis, pregnancy complications, and other treatable diagnoses because isolation must not delay essential care.",
      "Escalate for hypotension, oliguria, altered consciousness, hypoxemia, uncontrolled bleeding, severe electrolyte or glucose abnormality, pregnancy emergency, or staff exposure because organ failure and exposure events require immediate incident response."
    ], [
      "Hypotension, poor perfusion, rising lactate, oliguria, or rapidly increasing fluid losses",
      "Reduced consciousness, seizure, inability to protect the airway, or hypoxemia",
      "Uncontrolled bleeding, severe thrombocytopenia or coagulopathy, or suspected obstetric hemorrhage",
      "Needlestick, mucous-membrane splash, torn personal protective equipment, or unprotected body-fluid contact"
    ], [
      "Explain each isolation step calmly: the measures protect family and staff and do not reduce the patient's right to pain relief, communication, diagnostics, or respectful care.",
      "Do not travel or have unprotected close contact after a possible exposure; follow public-health monitoring instructions and report fever or symptoms immediately rather than presenting unannounced."
    ]),
    card("Varicella", ["cdc-varicella"], [
      "Initiate Airborne and Contact Precautions, place the patient in an airborne infection isolation room, use required respirator and contact-protection equipment, and assign staff with documented immunity according to policy because varicella spreads through airborne particles and direct contact with vesicle fluid. If an airborne infection isolation room is temporarily unavailable, mask the patient if tolerated, use a private room with the door closed, restrict transport, and contact infection prevention immediately for safe transfer or contingency controls.",
      "Count and stage varicella vesicles, monitor temperature, hydration, respiratory symptoms, neurologic status, and skin warmth or drainage, and document when all lesions crust because progression and infectiousness are visible over time.",
      "Assess pregnancy, newborn age, immune suppression, chronic lung or skin disease, and salicylate exposure because these factors increase severe disease or change antiviral and post-exposure management.",
      "Provide gentle skin care, trimmed nails, hydration, fever and itch treatment that avoids aspirin in children, and prescribed antiviral therapy because scratching promotes bacterial infection and salicylates are linked to Reye syndrome.",
      "Escalate for dyspnea, chest pain, persistent cough, ataxia, confusion, severe headache, rapidly spreading erythema, hypotension, or disseminated lesions in a high-risk patient because pneumonia, encephalitis, invasive bacterial infection, or visceral disease can progress quickly."
    ], [
      "Dyspnea, hypoxemia, chest pain, hemoptysis, or rapidly worsening cough",
      "Ataxia, confusion, seizure, severe headache, neck stiffness, or reduced responsiveness",
      "Rapidly spreading painful erythema, purulent drainage, crepitus, fever, or shock",
      "Varicella in a pregnant, newborn, or severely immunocompromised patient with systemic symptoms"
    ], [
      "Remain away from susceptible people and follow isolation guidance until every lesion has crusted; do not share towels, and call ahead before entering a clinic.",
      "Use the recommended itch and fever medicines, never give aspirin to a child or adolescent with varicella, and seek urgent care for breathing trouble, confusion, severe headache, or an increasingly red painful lesion."
    ]),
    card("West Nile virus", ["cdc-west-nile-signs", "cdc-west-nile-treatment"], [
      "Assess fever, headache, neck stiffness, cognition, cranial nerves, limb strength, reflexes, gait, swallowing, cough strength, and breathing because neuroinvasive West Nile disease can produce encephalitis or an asymmetric flaccid paralysis that reaches respiratory muscles.",
      "Trend level of consciousness, pupil and motor findings, oxygenation, respiratory rate and effort, vital capacity or other ordered respiratory measures, and secretion clearance because declining ventilation may precede dramatic oxygen desaturation.",
      "Provide prescribed fluids, fever and pain treatment, nutrition, aspiration precautions, pressure-injury prevention, thrombosis prevention, and range-of-motion care because treatment is supportive and immobility creates preventable secondary harm.",
      "Collect cerebrospinal fluid, serum, and other specimens as ordered while evaluating bacterial meningitis, stroke, Guillain-Barre syndrome, and other alternatives because no single early symptom confirms West Nile disease.",
      "Escalate for new weakness, weak cough, dysphagia, shallow breathing, seizure, worsening confusion, shock, or falling urine output because respiratory neuromuscular failure, encephalitis, and systemic complications need intensive support."
    ], [
      "Rapidly progressive or asymmetric limb weakness, weak cough, dysphagia, or shallow breathing",
      "Seizure, coma, severe agitation, focal deficit, or worsening encephalopathy",
      "Hypoxemia, rising carbon dioxide, inability to clear secretions, or recurrent aspiration",
      "Hypotension, oliguria, severe dehydration, or secondary bacterial infection"
    ], [
      "Antibiotics do not treat West Nile virus; recovery from neuroinvasive disease may be slow, so rehabilitation and follow-up for weakness, memory, mood, and function are part of treatment.",
      "Prevent future mosquito bites with repellent, long sleeves, window screens, and removal of standing water, especially from dusk to dawn and during local mosquito activity."
    ]),
    card("Botulism", ["cdc-botulism"], [
      "Escalate immediately for symmetric descending weakness with blurred or double vision, ptosis, dysarthria, dysphagia, dry mouth, or weak cough; treat it as botulism until excluded and contact public health because antitoxin benefit is greatest before paralysis advances.",
      "Perform frequent cranial-nerve, bulbar, limb, cough, secretion, respiratory-rate, vital-capacity, and inspiratory-force assessments in a monitored setting because oxygen saturation can remain normal while ventilatory muscle strength falls.",
      "Keep suction, airway equipment, and experienced intubation support ready, maintain aspiration precautions, and avoid sedating or neuromuscular-weakening medicines when alternatives exist because airway loss can be sudden and medication effects can obscure progression.",
      "Administer antitoxin as soon as authorized, monitor for hypersensitivity, and collect serum, stool, food, or wound specimens without delaying treatment because laboratory confirmation is often retrospective.",
      "Provide nutrition, eye protection, bowel and bladder care, thrombosis and pressure-injury prevention, and early rehabilitation because nerve recovery requires regrowth and may take weeks to months."
    ], [
      "Weak cough, pooling secretions, dysphagia, inability to hold the head up, or shallow breathing",
      "Falling vital capacity or inspiratory force, rising carbon dioxide, apnea, or respiratory fatigue",
      "Rapidly advancing cranial or descending paralysis, new aspiration, or inability to communicate",
      "Anaphylaxis during antitoxin or wound botulism with sepsis or spreading tissue infection"
    ], [
      "Do not wait for a test result if vision, swallowing, speech, or breathing weakness appears after home-canned food, an injection wound, or another suspected exposure; call emergency services.",
      "Never give honey to an infant younger than 12 months, discard bulging or leaking food containers safely, and use pressure-canning guidance because smell and taste cannot reliably identify botulinum toxin."
    ]),
    card("Necrotizing fasciitis", ["cdc-nec-fasc", "idsa-ssti"], [
      "Mark the visible border with time, quantify pain and analgesic need, and reassess skin color, edema, bullae, sensation, crepitus, temperature, and systemic status frequently because deep fascial destruction can race ahead of surface findings.",
      "Activate surgical consultation immediately, keep the patient nil by mouth, establish large-bore access, and prepare for urgent exploration and repeat debridement because antibiotics cannot penetrate or remove dead tissue adequately.",
      "Obtain cultures and ordered blood tests without delaying broad empiric antibiotics, then administer doses on time and monitor renal function and drug toxicity because early treatment must cover mixed and toxin-producing organisms.",
      "Trend blood pressure, perfusion, mental status, urine output, lactate, creatine kinase, blood count, coagulation, glucose, and organ function while giving sepsis resuscitation because shock and coagulopathy can evolve within hours.",
      "Escalate any pain out of proportion, spread beyond the marked border, anesthesia, dusky skin, bullae, hypotension, confusion, or oliguria as an operative and critical-care emergency because delay increases amputation and mortality risk."
    ], [
      "Pain out of proportion or rapidly increasing analgesic requirement with minimal surface change",
      "Rapid spread, violaceous or black skin, bullae, crepitus, or new cutaneous anesthesia",
      "Hypotension, confusion, rising lactate, oliguria, coagulopathy, or multiorgan dysfunction",
      "Progression after initial debridement or antibiotics, or concern for another involved compartment"
    ], [
      "A rapidly worsening painful area after a wound, surgery, injection, or even minor injury is an emergency; do not wait for redness to become dramatic.",
      "Explain that repeated operations may be necessary because surgeons must remove all dead tissue, while rehabilitation, wound care, and emotional support help preserve function afterward."
    ]),
    card("Scarlet fever", ["cdc-scarlet"], [
      "Assess fever, sore throat, sandpaper rash, strawberry tongue, hydration, airway, and exposure history, and look for abscess, toxic appearance, or another rash cause because scarlet fever must be distinguished from invasive infection and viral exanthem.",
      "Obtain a rapid antigen test or throat culture as appropriate and follow a negative rapid test with culture in symptomatic children when indicated because confirmed group A streptococcus guides antibiotics and limits unnecessary treatment.",
      "Administer the prescribed antibiotic and analgesic, encourage cool fluids and soft food, and document fever and swallowing response because treatment shortens transmission and reduces acute rheumatic fever risk.",
      "Use Standard plus Droplet Precautions for hospitalized infants and young children until 24 hours after effective therapy, apply facility isolation policy to other patients, and reinforce respiratory and hand hygiene because early respiratory spread is efficient.",
      "Escalate for drooling, muffled voice, stridor, neck swelling, severe unilateral pain, hypotension, rapidly painful skin, reduced urine, edema, chest pain, or migratory joint symptoms because deep-neck infection, invasive streptococcus, kidney injury, or rheumatic fever may be developing."
    ], [
      "Drooling, stridor, tripod position, muffled voice, neck swelling, or inability to swallow",
      "Hypotension, confusion, severe focal pain, rapidly spreading skin change, or toxic shock findings",
      "Dark urine, reduced urine, edema, hypertension, or severe headache after infection",
      "Chest pain, dyspnea, new murmur, choreiform movement, or migratory joint inflammation"
    ], [
      "Finish every antibiotic dose and replace the toothbrush after the contagious period according to local advice; improvement in fever does not mean the bacteria are fully treated.",
      "Return urgently for breathing or swallowing trouble, severe neck swelling, dark urine or swelling, chest symptoms, unusual movements, or a rapidly worsening painful skin area."
    ]),
    card("Septic arthritis", ["pids-septic-arthritis"], [
      "Treat an acutely hot, swollen, severely painful joint or a child refusing to use a limb as an emergency, documenting range of motion, weight bearing, fever, perfusion, and pain because cartilage injury and bacteremia progress quickly.",
      "Obtain blood cultures and prepare for image-guided or operative joint aspiration before antibiotics when the patient is stable, but do not delay antimicrobials in sepsis because culture yield must be balanced against immediate survival.",
      "Keep the affected joint supported, administer prescribed analgesia and antibiotics, and monitor allergy, renal function, drug levels when required, and culture-directed changes because effective exposure and source control determine recovery.",
      "Trend temperature, pain, swelling, active and passive motion, inflammatory markers, blood count, and ability to bear weight because failure to improve can signal inadequate drainage, resistant infection, osteomyelitis, or abscess.",
      "Escalate for hypotension, altered mental status, rapidly expanding swelling, neurovascular compromise, persistent bacteremia or fever, worsening pain after drainage, or a hip or shoulder joint requiring urgent source control because deep-joint infection can be clinically hidden."
    ], [
      "Hypotension, poor perfusion, confusion, rising lactate, or other sepsis findings",
      "New pallor, coolness, weak pulse, paresthesia, paralysis, or severe tense swelling distal to the joint",
      "Persistent fever, bacteremia, rising inflammatory markers, or worsening pain after treatment",
      "Inability to bear weight, severe hip or shoulder pain, or imaging suggesting abscess or osteomyelitis"
    ], [
      "Complete antibiotics and keep every laboratory and joint follow-up visit even after pain improves, because bacteria can persist and damage cartilage silently.",
      "Use the joint only as the treatment team directs, then follow the rehabilitation plan; return for fever, increasing pain or swelling, drainage, numbness, coolness, or loss of movement."
    ]),
    card("Smallpox", ["cdc-smallpox-diagnosis", "cdc-smallpox-response"], [
      "When smallpox is suspected, immediately place the patient in an airborne-infection isolation room, use Standard, Airborne, and Contact Precautions, restrict entry, and notify infection prevention and public health because a single case is an international public-health emergency.",
      "Assess the centrifugal, same-stage deep-seated rash, fever timeline, travel or exposure history, and alternative diagnoses without touching lesions unnecessarily because recognition directs safe testing and prevents a high-consequence exposure.",
      "Coordinate all photography, specimen collection, packaging, transport, waste, laundry, and environmental cleaning through public-health authorities because unplanned handling can spread viable virus and compromise evidence.",
      "Trend airway, breathing, hemodynamics, hydration, urine output, mental status, eye involvement, skin integrity, and secondary infection while providing supportive care because fluid loss, pneumonia, encephalitis, and bacterial complications drive morbidity.",
      "Maintain isolation until public health confirms that every scab has separated and intact skin has formed, while coordinating countermeasures and contact monitoring because scabs remain infectious late in illness."
    ], [
      "Any suspected smallpox case before isolation and public-health notification are complete",
      "Respiratory distress, hypoxemia, shock, severe dehydration, or rapidly declining urine output",
      "Confusion, seizure, severe headache, focal deficit, or reduced consciousness",
      "Eye involvement, uncontrolled bleeding, extensive skin sloughing, or secondary bacterial sepsis"
    ], [
      "Do not travel through shared clinical spaces or collect a home specimen; call public health or emergency services first and follow their exact arrival instructions.",
      "Isolation lasts longer than the fever: every scab must fall off and healthy skin must form before public health clears contact, laundry, and waste restrictions."
    ]),
    card("Fifth disease", ["cdc-parvovirus", "cdc-isolation-appendix-a"], [
      "Assess rash, joint pain, fever, anemia symptoms, pregnancy status, hemolytic disease, and immune suppression because parvovirus B19 is usually mild but can suppress red-cell production or cause fetal anemia.",
      "For pregnancy exposure or illness, notify the obstetric team and coordinate maternal antibody testing and serial fetal surveillance when indicated because hydrops may develop after the maternal rash has resolved.",
      "Trend pallor, heart rate, dyspnea, fatigue, reticulocyte count, and hemoglobin in patients with sickle cell disease or another chronic hemolytic anemia because transient aplastic crisis can cause abrupt life-threatening anemia.",
      "Use Droplet plus Standard Precautions for hospitalized parvovirus B19 infection, maintaining them for seven days during transient aplastic or red-cell crisis and for the hospitalization during chronic infection in an immunocompromised patient because these patients can remain infectious beyond the usual pre-rash period.",
      "Escalate for syncope, chest pain, dyspnea, marked pallor, fetal movement reduction, ultrasound evidence of fetal anemia or hydrops, or persistent infection in an immunocompromised patient because transfusion or specialist treatment may be needed."
    ], [
      "Syncope, chest pain, severe dyspnea, marked tachycardia, or rapidly falling hemoglobin",
      "Pregnancy with reduced fetal movement or ultrasound evidence of fetal anemia or hydrops",
      "Sickle cell disease or another hemolytic disorder with profound pallor, weakness, or low reticulocytes",
      "Persistent fever or anemia in an immunocompromised patient"
    ], [
      "The slapped-cheek rash often appears after the most contagious phase, so focus on hand hygiene and respiratory etiquette rather than blaming or isolating the child unnecessarily.",
      "If pregnant or living with a blood or immune disorder, report a known exposure promptly even if symptoms are mild, because blood tests and follow-up can detect complications before they feel severe."
    ]),
    card("Chlamydia", ["cdc-chlamydia"], [
      "Use private, trauma-informed, nonjudgmental history-taking and obtain site-specific testing based on sexual practices, symptoms, pregnancy, and assault concerns because genital testing alone can miss rectal or pharyngeal infection and stigma reduces disclosure.",
      "Administer the recommended antibiotic after reviewing pregnancy, allergy, interactions, and ability to adhere, and assess for pelvic inflammatory disease, epididymitis, conjunctivitis, or disseminated alternatives because complications change treatment and urgency.",
      "Coordinate confidential partner notification and presumptive partner treatment as allowed, screen for gonorrhea, HIV, and syphilis, and offer prevention services because untreated partners drive reinfection and coinfection is common.",
      "Arrange retesting about 3 months after treatment and a test of cure during pregnancy at the recommended interval because recurrent infection and persistent infection in pregnancy carry reproductive and neonatal risk.",
      "Escalate for severe pelvic or testicular pain, fever, vomiting, pregnancy with abdominal pain or bleeding, neonatal eye discharge, or inability to ensure safety after assault because torsion, ectopic pregnancy, severe pelvic infection, or neonatal infection must be addressed urgently."
    ], [
      "Pregnancy with severe abdominal pain, shoulder pain, syncope, or vaginal bleeding",
      "Severe pelvic pain, fever, vomiting, rebound tenderness, or inability to tolerate oral therapy",
      "Sudden severe testicular pain, swelling, high-riding testis, or absent cremasteric reflex",
      "Neonate with purulent eye discharge, cough, tachypnea, poor feeding, or fever"
    ], [
      "Avoid sex until the patient and partners have completed treatment and the recommended interval has passed; condoms reduce future infection, but retesting still matters because reinfection is common.",
      "Chlamydia is common and treatable and does not prove infidelity. Partners need care without blame, and confidentiality options can be discussed with the clinic."
    ]),
    card("Mastitis", ["acog-breastfeeding", "abm-mastitis"], [
      "Assess symptom onset, temperature, focal breast redness and induration, nipple trauma, milk production, feeding pattern, oversupply, and systemic symptoms because inflammatory mastitis, bacterial infection, phlegmon, and abscess require different intensity of care.",
      "Support normal responsive breastfeeding from both breasts or gentle expression only for infant needs and comfort because abrupt cessation worsens milk stasis while repeated emptying or extra pumping can amplify oversupply and inflammation.",
      "Use cold packs, prescribed anti-inflammatory analgesia, rest, hydration, and a supportive bra, and avoid deep massage, forceful squeezing, or traumatic devices because pressure can worsen edema and tissue injury.",
      "Administer prescribed antibiotics when bacterial mastitis is suspected, review allergy and infant considerations, and reassess fever, pain, erythema, and function within the expected response interval because nonresponse may indicate resistant organisms or a drainable collection.",
      "Escalate for fluctuance, enlarging mass, persistent systemic illness, rapidly spreading erythema, hypotension, confusion, or inability to feed or hydrate because ultrasound, drainage, culture, or sepsis care may be needed."
    ], [
      "Fluctuant or enlarging breast mass, skin necrosis, or spontaneous purulent drainage",
      "Hypotension, confusion, rigors, oliguria, or other sepsis findings",
      "Rapidly spreading erythema, pain out of proportion, crepitus, or toxic appearance",
      "Persistent fever or worsening focal symptoms despite an appropriate treatment interval"
    ], [
      "Continue normal breastfeeding when possible; milk is generally safe for the infant, and sudden weaning can worsen swelling. Pump only enough for the baby's needs or comfort unless the lactation plan says otherwise.",
      "Use cold rather than aggressive kneading, and call for a growing lump, persistent fever, spreading redness, faintness, or worsening illness because an abscess or bloodstream infection needs prompt care."
    ]),
    card("Perineal laceration", ["acog-perineal"], [
      "Confirm laceration degree and repair details, inspect bleeding and approximation with consent and privacy, and assess rectal or anal-sphincter involvement because missed deeper injury can cause hemorrhage, infection, and long-term continence problems.",
      "Trend pain, pulse, blood pressure, quantified lochia, perineal swelling, firmness, and bruising because a concealed expanding hematoma may cause severe pressure pain and shock without heavy external bleeding.",
      "Assess ability to void, bladder volume when indicated, bowel function, flatus and stool continence, and wound pain during movement because edema, nerve injury, and sphincter damage can impair elimination.",
      "Provide ice in the early period, prescribed analgesia, gentle hygiene, pelvic-floor and mobility guidance, hydration, and a stool-softening regimen for severe tears because pain control and soft stool protect the repair without promoting constipation.",
      "Escalate for rapidly increasing pain or swelling, hemodynamic change, urinary retention, fever, foul drainage, wound separation, fecal urgency or incontinence, or passage of stool through the vagina because hematoma, infection, breakdown, or fistula requires prompt evaluation."
    ], [
      "Rapidly enlarging tense swelling, severe pressure pain, tachycardia, hypotension, or syncope",
      "Fever, spreading erythema, purulent or foul drainage, or wound separation",
      "Inability to void, painful bladder distention, or substantially reduced urine output",
      "New fecal incontinence, inability to control gas, rectovaginal stool passage, or severe rectal pain"
    ], [
      "Rinse gently after toileting, pat dry, change pads often, use the prescribed pain and bowel medicines, and avoid straining because protecting clean, well-approximated tissue supports healing.",
      "Seek care for worsening pressure pain, a growing lump, fever, foul drainage, inability to urinate, wound opening, or loss of bowel control; these are treatable complications, not something to endure silently."
    ]),
    card("Disseminated intravascular coagulation in pregnancy", ["cmqcc-hemorrhage", "cdph-dic"], [
      "Activate the obstetric hemorrhage and massive-transfusion response at the first combination of abnormal bleeding and maternal deterioration because obstetric DIC consumes platelets and clotting factors while microvascular clots injure organs.",
      "Quantify blood loss continuously and trend pulse, blood pressure, mental status, temperature, perfusion, urine output, and fetal status because visible blood alone underestimates concealed abruption and physiologic collapse.",
      "Draw and repeat complete blood count, platelets, prothrombin time, activated partial thromboplastin time, fibrinogen, blood gas, lactate, chemistries, and crossmatch as ordered because rapidly changing results guide component replacement rather than a fixed transfusion guess.",
      "Administer warmed blood products, fibrinogen replacement, calcium, fluids, uterotonics, and cause-specific treatment according to the coordinated protocol while using infusion and identity safeguards because resuscitation must restore oxygen delivery and coagulation without hypothermia or citrate toxicity.",
      "Prepare simultaneously for definitive treatment of the trigger, such as delivery, hemorrhage control, sepsis source control, or management of amniotic fluid embolism, and escalate for ongoing bleeding, worsening labs, shock, fetal compromise, or organ failure because DIC resolves only when its cause is controlled."
    ], [
      "Uncontrolled vaginal, operative, line-site, mucosal, or gastrointestinal bleeding",
      "Hypotension, altered mental status, cool mottled skin, rising lactate, or oliguria",
      "Rapidly falling fibrinogen or platelets, worsening coagulation, diffuse oozing, or transfusion requirement",
      "Nonreassuring fetal status, suspected abruption, respiratory collapse, seizure, or multiorgan dysfunction"
    ], [
      "Explain to the patient and support person that DIC is a consequence of a serious pregnancy complication: the team must replace blood components and treat the cause at the same time.",
      "After recovery, keep obstetric and hematology follow-up and seek urgent care for heavy bleeding, chest pain, breathlessness, fainting, severe headache, reduced urine, or new limb swelling."
    ]),
    card("Chorioamnionitis", ["acog-chorio"], [
      "Trend maternal temperature, pulse, blood pressure, uterine tenderness, fluid color and odor, contraction pattern, and fetal heart rate because intraamniotic infection can progress to maternal sepsis and fetal compromise.",
      "Obtain ordered cultures and laboratory tests without delaying prescribed broad-spectrum intrapartum antibiotics, verifying allergy and dose timing because prompt exposure reduces maternal and neonatal infectious morbidity.",
      "Give prescribed antipyretic and measured fluids, monitor urine output and lactate when illness is systemic, and reassess hemodynamics because fever, vasodilation, and infection can produce dehydration and shock.",
      "Notify the obstetric and neonatal teams early, maintain continuous fetal surveillance when indicated, and prepare neonatal evaluation at birth because the infant may need immediate sepsis assessment even when initially vigorous.",
      "After birth, monitor uterine tone, quantified bleeding, temperature, pain, lochia, wound status, and organ function because chorioamnionitis increases postpartum hemorrhage, endometritis, wound infection, and sepsis risk."
    ], [
      "Hypotension, confusion, rising lactate, oliguria, or rapidly worsening maternal status",
      "Persistent fetal tachycardia, recurrent decelerations, bradycardia, or other nonreassuring tracing",
      "Heavy postpartum bleeding, boggy uterus unresponsive to initial measures, or coagulopathy",
      "Persistent fever, worsening uterine pain, foul lochia, respiratory distress, or neonatal instability"
    ], [
      "Explain that infection is treated promptly to protect both parent and baby; antibiotics do not automatically require cesarean birth, but the fetal and obstetric findings guide delivery decisions.",
      "After discharge, seek urgent care for fever, worsening lower-abdominal pain, foul-smelling discharge, heavy bleeding, shortness of breath, faintness, or a baby who feeds poorly or is unusually sleepy."
    ]),
    card("Umbilical cord prolapse", ["rcog-cord"], [
      "Activate the obstetric emergency response immediately when cord prolapse is seen or palpated, note the time, and begin continuous fetal heart monitoring because cord compression can interrupt fetal oxygen delivery within minutes.",
      "With a gloved hand, elevate the presenting part off the cord and maintain elevation until delivery or directed relief because reducing mechanical pressure restores blood flow; avoid repeatedly handling or attempting to replace the cord.",
      "Position the patient knee-chest or left lateral with head down and consider ordered bladder filling or tocolysis while definitive birth is prepared because gravity and reduced contractions can temporarily lessen compression.",
      "If cord is visible, cover it lightly with warm sterile saline-moistened gauze without pushing it back, provide oxygen only for maternal indication, establish intravenous access, and prepare rapid operative or assisted birth because temporizing measures do not replace delivery.",
      "Document fetal tracing, maneuvers, handoff, and response while communicating calmly and continuously with the patient because coordinated action reduces delay and clear explanation limits trauma during an emergency."
    ], [
      "Fetal bradycardia, prolonged deceleration, recurrent severe variable decelerations, or loss of fetal signal",
      "Visible or palpable cord below the presenting part after membrane rupture",
      "Cord becoming cool, dry, pulseless, or increasingly compressed despite maneuvers",
      "Maternal hemorrhage, collapse, seizure, or another concurrent obstetric emergency"
    ], [
      "If something cord-like is felt or seen after the water breaks, call emergency services, do not push it back or walk around, and use the instructed knee-chest or side-lying position while waiting.",
      "Explain that staff may keep a hand in the vagina and move quickly to birth because physically lifting the baby off the cord preserves oxygen; these actions are temporary, purposeful, and time-critical."
    ]),
    card("Premature rupture of membranes", ["smfm-pprom", "acog-chorio"], [
      "Confirm gestational age, time and character of fluid loss, contractions, bleeding, fetal movement, and cord symptoms, and use sterile-speculum rather than routine digital examination because digital exams increase ascending infection and shorten latency when labor is not established.",
      "Trend maternal temperature, pulse, blood pressure, uterine tenderness, fluid odor and color, and fetal heart rate because fever, tenderness, purulent fluid, or fetal tachycardia can signal intraamniotic infection.",
      "Monitor fetal movement, presentation, fluid volume, contractions, and tracing as indicated while observing for bleeding because cord prolapse, compression, abruption, and labor can follow membrane rupture.",
      "Administer gestational-age-appropriate latency antibiotics, corticosteroids, magnesium, or group B streptococcal prophylaxis exactly as prescribed and monitor adverse effects because each treatment targets a different maternal or neonatal risk.",
      "Escalate immediately for visible or palpable cord, fetal bradycardia, fever with uterine tenderness, foul fluid, significant bleeding, maternal instability, active labor, or reduced fetal movement because delivery or urgent intervention may become safer than continued latency."
    ], [
      "Visible or palpable cord, fetal bradycardia, or recurrent severe variable decelerations",
      "Maternal fever with uterine tenderness, foul or purulent fluid, fetal tachycardia, or sepsis findings",
      "Heavy bleeding, severe abdominal pain, uterine hypertonicity, or suspected placental abruption",
      "Reduced fetal movement, active preterm labor, or maternal respiratory or hemodynamic deterioration"
    ], [
      "Use pads rather than tampons, avoid intercourse and inserting anything unless the obstetric team specifically directs it, and record fluid color, odor, temperature, contractions, bleeding, and fetal movement.",
      "Go to the hospital urgently for fever, foul fluid, bleeding, pain, regular contractions, reduced movement, or anything cord-like at the vagina; call emergency services and avoid walking if a cord is seen."
    ]),
    card("Meckel diverticulum", ["apsa-meckel"], [
      "Assess stool color and amount, abdominal pain and distention, emesis character, bowel sounds, hydration, perfusion, and prior episodes because Meckel diverticulum may present as painless bleeding, obstruction, intussusception, inflammation, or perforation.",
      "Quantify blood loss, trend pulse, blood pressure, capillary refill, hemoglobin, urine output, and mental status, and secure intravenous access because children can compensate until substantial blood volume is lost.",
      "Keep the child nil by mouth, provide ordered isotonic fluids, analgesia, antiemetic, and gastric decompression when obstructed, and avoid forcing oral intake because surgery or anesthesia may be urgent.",
      "Prepare for radionuclide imaging, ultrasound, surgery, or transfusion as directed and preserve stool or emesis descriptions because no single presentation identifies every Meckel complication.",
      "Escalate for hemodynamic change, ongoing maroon or bright-red stool, bilious vomiting, peritonitis, rigid distention, fever with worsening pain, or reduced urine because hemorrhage, volvulus, strangulation, or perforation threatens bowel and circulation."
    ], [
      "Syncope, tachycardia with poor perfusion, hypotension, altered mental status, or ongoing large-volume bleeding",
      "Bilious vomiting, rigid or rapidly distending abdomen, absent stool or gas, or severe colicky pain",
      "Guarding, rebound tenderness, fever, free air, or other perforation and peritonitis findings",
      "Oliguria, severe dehydration, rapidly falling hemoglobin, or transfusion requirement"
    ], [
      "Painless dark-red or maroon stool in a child is not harmless; save a photo if safe and seek prompt care, especially with pallor, weakness, pain, or faintness.",
      "After surgery, follow wound, activity, and diet instructions and return for fever, bilious vomiting, increasing abdominal swelling or pain, bloody stool, or inability to pass stool or gas."
    ]),
    card("Juvenile idiopathic arthritis", ["acr-jia"], [
      "Track each joint's swelling, warmth, pain, morning stiffness, range of motion, gait, sleep, school participation, growth, and daily function because inflammation can silently restrict development even when the child minimizes pain.",
      "Administer disease-modifying, biologic, anti-inflammatory, or intra-articular therapy as prescribed and trend blood count, liver and renal tests, infection symptoms, and treatment-specific screening because immune control prevents damage but can suppress host defenses.",
      "Verify scheduled slit-lamp examinations even when vision seems normal because JIA-associated uveitis can scar the eye without pain or redness.",
      "Coordinate physical and occupational therapy, low-impact activity, splinting when prescribed, school accommodations, sleep, and nutrition because protecting motion and participation prevents deconditioning without requiring prolonged joint rest.",
      "Escalate for high persistent fever, evanescent rash, hepatosplenomegaly, bruising, confusion, severe weakness, eye pain or vision change, or a single acutely hot joint with systemic illness because macrophage activation syndrome, uveitis, or septic arthritis is time-critical."
    ], [
      "Persistent high fever with rash, bruising, hepatosplenomegaly, confusion, or rapidly changing blood counts or liver tests",
      "Eye pain, photophobia, redness, new floaters, or any visual change",
      "A single very hot swollen joint with fever, severe pain, or refusal to bear weight",
      "Fever or serious infection symptoms while receiving immunosuppressive therapy"
    ], [
      "Keep eye appointments even when the eyes look and feel normal, because silent uveitis can damage vision before a child notices a change.",
      "Balance medicine adherence with regular joint-friendly movement; call before live vaccines or stopping immune therapy, and report fever, unusual bruising, eye symptoms, or sudden loss of function."
    ]),
    card("Rheumatic fever", ["cdc-rheumatic"], [
      "Document recent group A streptococcal infection and assess migrating joint inflammation, murmur, tachycardia, chest symptoms, involuntary movements, rash, nodules, fever, and function because diagnosis depends on linked systemic findings rather than one test.",
      "Trend pulse, blood pressure, perfusion, respiratory status, electrocardiogram, inflammatory markers, and echocardiographic findings because carditis and conduction delay may be present even when joint pain dominates.",
      "Administer prescribed streptococcal eradication therapy, anti-inflammatory treatment, and heart-failure medication and monitor response and adverse effects because bacterial clearance prevents spread while inflammation treatment limits tissue injury.",
      "Provide rest proportional to carditis, fall and injury protection for chorea, calm low-stimulation communication, and school support because exertion burdens an inflamed heart and involuntary movement can be exhausting and stigmatizing.",
      "Establish a reliable secondary antibiotic prophylaxis schedule and escalate for dyspnea, orthopnea, syncope, chest pain, new murmur, poor perfusion, severe chorea affecting swallowing, or recurrent fever because recurrent streptococcal infection increases permanent valve damage."
    ], [
      "Dyspnea, orthopnea, pulmonary edema, new gallop or murmur, syncope, or poor perfusion",
      "Severe chorea causing falls, inability to eat or drink, aspiration, or major behavioral change",
      "Chest pain, new dysrhythmia, marked PR prolongation with symptoms, or hemodynamic instability",
      "Recurrent fever or streptococcal illness after missed secondary prophylaxis"
    ], [
      "The sore throat may be gone, but the immune reaction can still inflame heart valves; keep cardiology visits and every scheduled preventive antibiotic dose.",
      "Seek care early for future sore throat or fever and report breathlessness, fainting, swelling, chest pain, or worsening involuntary movements; chorea is a neurologic symptom, not intentional behavior."
    ]),
    card("Neonatal jaundice", ["aap-jaundice"], [
      "Measure transcutaneous or serum bilirubin at the appropriate age in hours and interpret it with gestational age, neurotoxicity risk factors, feeding, weight change, and prior trend because treatment thresholds are individualized rather than one universal number.",
      "Assess wakefulness, tone, cry, feeding effectiveness, latch or intake, stool transition, wet diapers, weight, bruising, blood-group incompatibility, and hemolysis risk because poor intake and accelerated red-cell breakdown raise bilirubin by different mechanisms.",
      "Support frequent effective feeding and lactation help, supplement only according to the individualized plan, and track intake and output because improving milk transfer increases stool bilirubin excretion without automatically ending breastfeeding.",
      "During phototherapy, maximize prescribed skin exposure, protect eyes correctly, monitor temperature, hydration, skin, device irradiance when assigned, and repeat bilirubin on schedule because safe effective light converts bilirubin while rebound or treatment failure can occur.",
      "Escalate immediately for poor arousal, weak suck, high-pitched cry, abnormal tone, arching, apnea, seizure, rapidly rising bilirubin, or a value at the exchange-transfusion escalation threshold because acute bilirubin encephalopathy can become irreversible."
    ], [
      "Poor arousal, weak suck, high-pitched cry, hypotonia followed by stiffness or arching",
      "Apnea, fever or hypothermia, seizure, abnormal eye movements, or reduced responsiveness",
      "Bilirubin rising rapidly or reaching the infant's escalation-of-care or exchange threshold",
      "Jaundice in the first day, pale stool, dark urine, severe dehydration, or suspected hemolysis"
    ], [
      "Feed at least as often as the newborn plan directs and track wet diapers and stools; sunlight through a window is not a safe substitute for measured bilirubin follow-up or prescribed phototherapy.",
      "Call urgently if the baby is hard to wake, feeds weakly, becomes very stiff or floppy, arches, has a high-pitched cry, or the yellow color deepens or reaches the legs."
    ]),
    card("Hirschsprung disease", ["ernica-hirschsprung"], [
      "Track abdominal girth, distention, stool frequency and character, flatus, emesis, feeding tolerance, hydration, temperature, and behavior because obstruction and Hirschsprung-associated enterocolitis can progress before dramatic laboratory change.",
      "Perform prescribed rectal irrigations with the ordered catheter, fluid, volume, and return documentation, stopping for resistance, pain, bleeding, or poor return because decompression relieves stasis but force can perforate bowel.",
      "Maintain nil-by-mouth status, intravenous fluids, gastric decompression, antibiotics, and surgical preparation when acute obstruction or enterocolitis is suspected because distended infected bowel can rapidly cause sepsis and perforation.",
      "After pull-through surgery, monitor stool output, abdominal girth, wound and perianal skin, hydration, pain, and prescribed dilation plan because stricture, recurrent enterocolitis, constipation, and skin breakdown can impair recovery.",
      "Escalate for fever, explosive foul or bloody diarrhea, rapidly increasing distention, bilious vomiting, lethargy, poor perfusion, absent stool, or peritoneal signs because enterocolitis, obstruction, or perforation is a surgical emergency."
    ], [
      "Fever with explosive foul-smelling or bloody diarrhea and increasing abdominal distention",
      "Bilious vomiting, absent stool or gas, rigid abdomen, guarding, or rebound tenderness",
      "Lethargy, mottling, poor perfusion, hypotension, oliguria, or other sepsis findings",
      "Rectal irrigation with resistance, significant bleeding, severe pain, or failure to decompress"
    ], [
      "Follow the exact irrigation or dilation technique taught by the surgical team and never force the catheter; record stool, belly size, temperature, and feeding tolerance.",
      "Treat fever, foul explosive diarrhea, new swelling, bilious vomit, unusual sleepiness, or poor feeding as urgent even after corrective surgery, because enterocolitis can recur."
    ]),
    card("Pyloric stenosis", ["rch-pyloric"], [
      "Characterize forceful nonbilious vomiting, hunger after emesis, weight change, wet diapers, stooling, abdominal findings, and alertness because bilious emesis or a toxic infant points away from uncomplicated pyloric obstruction.",
      "Keep the infant nil by mouth, establish intravenous access, measure weight and strict intake and output, and decompress the stomach if ordered because ongoing gastric losses worsen dehydration and aspiration risk.",
      "Trend glucose, chloride, potassium, bicarbonate, kidney function, acid-base status, perfusion, and urine output and replace fluid and electrolytes before surgery because hypochloremic alkalosis increases apnea and anesthetic risk.",
      "Reassess hydration and laboratory correction before pyloromyotomy and monitor breathing closely before and after anesthesia because metabolic alkalosis can suppress respiratory drive even after circulation improves.",
      "Escalate for bilious or bloody emesis, shock, severe lethargy, apnea, seizure, peritonitis, hypoglycemia, or electrolyte and alkalosis values not correcting as expected because another diagnosis or unstable physiology requires urgent action."
    ], [
      "Bilious emesis, abdominal rigidity or marked distention, bloody stool, or peritoneal signs",
      "Poor perfusion, hypotension, oliguria, sunken fontanel, or severe dehydration",
      "Apnea, cyanosis, seizure, profound lethargy, or hypoglycemia",
      "Persistent major electrolyte or acid-base abnormality despite prescribed replacement"
    ], [
      "Do not keep offering larger feeds to replace vomited milk; repeated vomiting worsens salt and water loss, so seek care for forceful vomiting and fewer wet diapers.",
      "Surgery fixes the narrowed outlet after dehydration is corrected. Follow the staged feeding plan afterward and report bilious vomit, fever, wound change, or persistent forceful vomiting."
    ]),
    card("Tetralogy of Fallot", ["aha-tof"], [
      "Establish the child's usual oxygen saturation, color, heart rate, feeding endurance, weight gain, hydration, murmur, and activity tolerance because baseline cyanosis varies and a sudden change is more informative than comparison with a healthy child.",
      "During a hypercyanotic spell, keep the child calm, place infants in knee-chest or older children in a squatting equivalent, give prescribed oxygen and medications, and call the cardiac emergency team because increasing systemic resistance reduces right-to-left shunting.",
      "Monitor pulse oximetry, respiratory effort, mental status, perfusion, and spell duration continuously while securing access and preparing advanced support because prolonged hypoxemia can cause seizure, stroke, acidosis, or arrest.",
      "Use small frequent high-calorie feeds with rest and aspiration-safe pacing, track daily weight and wet diapers, and prevent dehydration because exertion and lower circulating volume worsen cyanotic shunting.",
      "After repair or palliation, trend rhythm, perfusion, chest drainage, respiratory status, fluid balance, pain, and infection signs because arrhythmia, low output, residual obstruction or shunt, and effusion may appear postoperatively."
    ], [
      "Cyanotic spell not resolving promptly with knee-chest positioning and prescribed emergency measures",
      "Reduced responsiveness, seizure, limpness, apnea, or severe persistent hypoxemia",
      "New dysrhythmia, syncope, chest pain, poor perfusion, or sudden exercise intolerance",
      "Feeding-associated diaphoresis or cyanosis with poor weight gain, dehydration, or fewer wet diapers"
    ], [
      "If the child suddenly becomes much bluer or breathless, keep them calm, bring knees toward the chest, use the prescribed emergency plan, and call for help if the spell does not resolve immediately.",
      "Protect hydration, pace feeds and activity, keep cardiology and dental care, and tell every clinician about the heart condition and repair because lifelong follow-up remains necessary."
    ]),
    card("SIDS", ["cdc-safe-sleep"], [
      "For an unresponsive infant, activate emergency response, begin age-appropriate cardiopulmonary resuscitation, and use an automated external defibrillator when available because SIDS is a diagnosis made only after death and no bedside sign can distinguish it from a reversible arrest.",
      "After resuscitation efforts, follow local sudden-unexpected-infant-death procedures, preserve tubes, clothing, sleep-scene information, and an objective timeline, and notify the appropriate medical examiner and safeguarding team because careful investigation may identify infection, injury, metabolic disease, or an unsafe environment.",
      "Provide private, nonjudgmental bereavement support, explain what is known without assigning blame, offer memory-making and spiritual care by family preference, and assess immediate safety because acute grief can impair comprehension and increase self-harm risk.",
      "For every living infant, teach supine positioning on a firm, flat, separate approved surface with only a fitted sheet, room sharing without bed sharing, and avoidance of smoke, overheating, weighted products, and soft objects because these measures reduce sleep-related death risk.",
      "Escalate any apnea, blue or gray color, limpness, abnormal breathing, fever in a young infant, poor feeding, or caregiver concern for emergency assessment because apparent resolved events and serious illness require evaluation rather than reassurance from a home monitor."
    ], [
      "Infant unresponsive, not breathing normally, limp, or blue or gray",
      "Recurrent apnea, choking with color change, seizure-like activity, or marked hypotonia",
      "Fever or hypothermia, poor feeding, respiratory distress, or unusual sleepiness in a young infant",
      "Caregiver expressing self-harm, inability to remain safe, or overwhelming acute distress after a death"
    ], [
      "Place the baby on the back for every sleep on a firm, flat, separate surface with no pillows, blankets, bumpers, toys, positioners, or weighted products; room-share, but do not bed-share.",
      "Home cardiorespiratory monitors do not prevent SIDS. Keep the sleep space smoke-free and comfortably cool, and call emergency services for an infant who is limp, blue, or not breathing normally."
    ]),
    card("Alzheimer disease", ["nice-dementia"], [
      "Establish the person's usual cognition, communication, mobility, continence, sleep, appetite, and self-care with the person and a knowledgeable caregiver because a sudden departure from baseline suggests delirium, pain, infection, medication effect, stroke, or another treatable problem rather than inevitable dementia progression.",
      "Use calm one-step explanations, familiar routines, visible clocks and signs, hearing and vision aids, and validation rather than arguing over mistaken beliefs because reducing cognitive load lowers fear and preserves cooperation and dignity.",
      "Track pain with verbal and behavioral cues, food and fluid intake, weight, swallowing and cough, bowel and bladder function, skin, falls, and wandering risk because unmet physical needs often appear first as agitation or withdrawal.",
      "Review every medicine for benefit, anticholinergic and sedating burden, orthostasis, bradycardia, and adherence, and use restraint or antipsychotic medication only under a documented risk-benefit plan because both can worsen confusion, falls, stroke risk, and loss of function.",
      "Escalate for abrupt confusion, new focal deficit, fever, fall or head injury, inability to swallow, recurrent choking, severe dehydration, unsafe wandering, aggression with imminent danger, or caregiver collapse because acute illness and safety crises require immediate support."
    ], [
      "Abrupt cognitive or behavioral change, inattention, fever, or fluctuating alertness suggesting delirium",
      "New facial droop, unilateral weakness, speech change, seizure, severe headache, or fall with head injury",
      "Repeated choking, wet voice, aspiration, inability to swallow, or significant weight loss and dehydration",
      "Wandering into danger, violence or self-harm risk, suspected abuse, or caregiver unable to maintain safety"
    ], [
      "A sudden bad day is not automatically the Alzheimer disease getting worse; report abrupt confusion, sleepiness, weakness, fever, pain behavior, or urinary and breathing symptoms so reversible causes can be checked.",
      "Use short choices, a predictable routine, labeled spaces, medication supervision, and a current wandering and emergency plan while also arranging respite and support for the caregiver."
    ]),
    card("Huntington disease", ["ehdn-huntington"], [
      "Trend chorea, rigidity, gait, falls, hand function, speech, cognition, mood, impulsivity, sleep, and ability to manage medicines or finances because motor, cognitive, and psychiatric changes interact to determine safety.",
      "Screen directly and respectfully for depression, hopelessness, suicidal thoughts, access to lethal means, aggression, and caregiver safety at diagnosis and during functional transitions because suicide risk can rise before severe physical disability.",
      "Assess weight, meal duration, coughing, wet voice, drooling, and recurrent chest infection and obtain speech-language and nutrition review because involuntary movement increases energy use while impaired swallowing increases aspiration.",
      "Use high-calorie texture-appropriate meals, upright supported feeding, adaptive utensils, fall prevention, physical and occupational therapy, and communication aids because preserving safe participation is more effective than simply restricting activity.",
      "Review dopamine-blocking, mood, sleep, and other medicines for sedation, parkinsonism, swallowing effects, and adherence, and escalate for suicidality, violent unsafe behavior, choking, respiratory distress, sudden functional decline, or suspected medication toxicity because these problems require urgent multidisciplinary action."
    ], [
      "Current suicidal intent, recent attempt, escalating self-harm, or access to lethal means",
      "Choking, inability to handle secretions, recurrent aspiration, hypoxemia, or respiratory distress",
      "Abrupt severe behavioral change, psychosis, aggression with imminent danger, or caregiver unable to maintain safety",
      "Repeated falls, head injury, sudden loss of mobility, severe dehydration, or rapid weight loss"
    ], [
      "Chorea is involuntary and behavior changes are symptoms, not deliberate misconduct; use calm routines and ask what support improves control rather than correcting or shaming the person.",
      "Discuss swallowing, mobility, mental health, driving, work, advance care preferences, and genetic counseling early, while the person can direct decisions and useful supports can be added gradually."
    ]),
    card("Lead poisoning", ["cdc-lead"], [
      "Obtain the exposure history across housing age and renovation, water, work take-home dust, imported products, spices, pottery, cosmetics, hobbies, retained projectiles, and pica because removing the source is the only way to prevent continued absorption.",
      "Confirm an elevated screening result with a venous blood lead level on the recommended schedule, report it as required, and coordinate environmental investigation because capillary contamination can mislead and treatment without source control fails.",
      "Assess cognition, behavior, development, hearing, school performance, abdominal pain, constipation, appetite, pallor, headache, gait, and motor findings, and trend blood count and iron status because chronic toxicity often appears as subtle neurodevelopmental or gastrointestinal change.",
      "Coordinate iron and nutritional assessment, regular meals with calcium- and iron-containing foods, developmental services, and toxicology or poison-center consultation for high or symptomatic levels because deficiency and fasting increase absorption while severe exposure may require chelation.",
      "Escalate for persistent vomiting, severe abdominal pain, ataxia, confusion, seizure, coma, focal weakness, encephalopathy, or a markedly elevated venous level in the urgent treatment range because cerebral edema and organ injury require hospital management."
    ], [
      "Confusion, ataxia, seizure, coma, severe headache, or other encephalopathy findings",
      "Persistent vomiting, severe colicky abdominal pain, ileus, dehydration, or poor perfusion",
      "Rapid developmental regression, new weakness, cranial-nerve change, or major behavior change",
      "Venous blood lead result in the jurisdiction's urgent or chelation range, especially with ongoing exposure"
    ], [
      "Do not sand or dry-scrape old paint or use a household vacuum for lead dust; keep children away from renovation and follow the health department's wet-cleaning and certified-abatement plan.",
      "Wash hands and toys before meals, leave work shoes and clothes outside living areas, serve regular iron- and calcium-containing meals, and keep every repeat blood test because symptoms alone cannot show whether exposure has stopped."
    ]),
    card("Cerebral palsy", ["nice-cp"], [
      "Establish the person's own baseline for tone, movement, communication, cognition, seizure pattern, breathing, feeding, sleep, continence, pain behavior, and participation because cerebral palsy is nonprogressive but secondary problems and acute illness change function.",
      "Assess oral control, meal duration, cough, wet voice, recurrent chest infection, weight and growth, hydration, and constipation, and follow the individualized texture and positioning plan because dysphagia and reflux can cause aspiration and undernutrition.",
      "Use the person's communication system, allow response time, include them directly in decisions, and ask caregivers how pain and distress appear because motor or speech impairment must not be mistaken for lack of understanding.",
      "Provide prescribed positioning, range of motion, orthoses, mobility, skin and hip surveillance, bowel and bladder care, and monitor antispasticity or antiseizure treatment because contracture, dislocation, pressure injury, and medication sedation can erode function.",
      "Escalate for new respiratory distress, repeated aspiration, prolonged seizure, acute severe pain, sudden loss of movement, hip displacement concern, unexplained regression, or caregiver inability to transfer or feed safely because acute complications require targeted assessment rather than attribution to cerebral palsy."
    ], [
      "Choking, wet breathing, recurrent aspiration, cyanosis, or increasing oxygen requirement",
      "Seizure lasting 5 minutes or longer, repeated seizures without recovery, or a changed seizure pattern",
      "New severe pain, swollen or fixed joint, sudden loss of movement, or suspected fracture or hip displacement",
      "Abrupt regression, reduced responsiveness, dehydration, pressure injury, or caregiver unable to provide safe care"
    ], [
      "Use the person's established communication, feeding, seizure, positioning, and pain plans and bring them to every new care setting; unfamiliar staff need the baseline to recognize illness.",
      "Report new choking, breathing change, pain behavior, lost skill, prolonged seizure, skin breakdown, constipation, or equipment fit problem early because these changes are treatable and are not simply 'the cerebral palsy.'"
    ]),
    card("Amyotrophic lateral sclerosis", ["aan-als"], [
      "Trend respiratory rate and effort, orthopnea, morning headache, sleep quality, cough strength, voice volume, oxygenation, and ordered vital capacity or inspiratory measures because hypoventilation often begins during sleep before resting oxygen saturation falls.",
      "Assess swallowing, meal duration, coughing, drooling, weight, hydration, and aspiration events and coordinate texture, calorie, secretion, and feeding-tube discussions early because respiratory weakness makes late procedures riskier.",
      "Teach and support noninvasive ventilation, cough-assist, suction, breath stacking, and secretion management as prescribed, checking mask fit, skin, tolerance, and caregiver technique because ventilation and airway clearance relieve symptoms and prolong safe function.",
      "Preserve communication and mobility with early speech-generating, eye-gaze, positioning, transfer, and pressure-relief equipment because rapidly changing motor ability can otherwise isolate the person despite intact sensation and cognition.",
      "Review goals for ventilation, hospitalization, feeding, emergency response, and comfort before crisis and escalate for weak cough with retained secretions, choking, new daytime somnolence, inability to lie flat, rapidly falling respiratory measures, or acute dyspnea because ventilatory failure and aspiration require urgent support."
    ], [
      "Acute dyspnea, inability to lie flat, paradoxical breathing, cyanosis, or rapidly rising carbon dioxide",
      "Weak or absent cough, retained secretions, recurrent choking, aspiration, or inability to swallow saliva",
      "New daytime somnolence, confusion, severe morning headache, or rapidly declining respiratory measurements",
      "Sudden loss of communication or transfer safety, severe dehydration, or caregiver unable to operate essential equipment"
    ], [
      "Shortness of breath, poor sleep, morning headache, weak cough, and trouble lying flat can signal breathing-muscle weakness even when a finger oxygen reading looks normal; report them early.",
      "Choose communication, feeding, ventilation, and emergency preferences before they are urgently needed, and keep backup power and contact plans for essential respiratory and communication equipment."
    ]),
    card("Myasthenia gravis", ["mg-consensus"], [
      "Assess and compare eyelid, eye movement, voice, chewing, swallowing, neck flexion, proximal limb strength, cough, and breathing before and after activity because fatigable weakness can worsen over a shift and bulbar decline predicts aspiration.",
      "Trend respiratory rate and pattern, ability to count or speak, cough and secretion clearance, and ordered vital capacity or inspiratory force rather than relying on pulse oximetry because carbon dioxide retention and respiratory-muscle failure can precede desaturation.",
      "Schedule anticholinesterase and immunotherapy exactly, plan meals and activity during peak strength, and review every new prescription for myasthenia-worsening potential because missed doses, infection, surgery, and interacting medicines can precipitate crisis.",
      "Use upright small meals, prescribed texture, rest before eating, suction readiness, and nil-by-mouth status when swallowing is unsafe because repeated aspiration accelerates respiratory failure.",
      "Escalate immediately for rapidly worsening dysphagia, nasal or fading speech, inability to manage secretions, weak cough, head drop, shallow breathing, declining respiratory measures, or suspected cholinergic excess because airway support and specialist crisis therapy may be time-critical."
    ], [
      "Pooling secretions, choking, nasal or fading speech, inability to swallow, or weak cough",
      "Shallow or paradoxical breathing, inability to speak a sentence, head drop, or declining vital capacity or inspiratory force",
      "Rapid generalized weakness after infection, surgery, pregnancy-related change, or a new medication",
      "Excess salivation, sweating, diarrhea, bradycardia, fasciculation, and worsening weakness suggesting cholinergic toxicity"
    ], [
      "Take myasthenia medicines at the exact times prescribed and check every new prescription, over-the-counter medicine, and supplement with the neurology or pharmacy team because some can worsen weakness.",
      "Carry a diagnosis and medication list and seek emergency help for trouble swallowing saliva, a weak cough, fading speech, head drop, or breathing difficulty; oxygen saturation can look normal early in a crisis."
    ]),
    card("Seizures", ["nice-seizures"], [
      "Start timing immediately, protect the head, clear hazards, loosen restrictive clothing, and turn the person to the side when possible without restraining movement or putting anything in the mouth because most injury comes from the environment or impaired airway protection.",
      "Assess airway, breathing, oxygenation, pulse, temperature, trauma, pregnancy, and bedside glucose, provide oxygen and suction as needed, and establish access because hypoglycemia, hypoxia, infection, eclampsia, and toxins require cause-specific treatment.",
      "Follow the individualized rescue plan and administer first- and second-line medicine at the protocol times, recording dose, route, response, and respiratory effects because treatment delay makes prolonged seizure harder to stop while sedatives can depress breathing.",
      "After movements stop, trend consciousness, pupils, focal weakness, speech, respiration, aspiration, and recurrent events and preserve a witness description because postictal recovery must be distinguished from stroke, ongoing nonconvulsive seizure, or head injury.",
      "Escalate at 5 minutes, for repeated seizures without recovery, a first seizure, pregnancy, major injury, water exposure, persistent focal deficit, respiratory compromise, or failure of rescue medication because status epilepticus and secondary causes threaten brain and life."
    ], [
      "Seizure lasting 5 minutes or longer or beyond the person's rescue-plan threshold",
      "Repeated seizures without return to baseline or concern for nonconvulsive status",
      "Apnea, cyanosis, aspiration, severe injury, pregnancy, water exposure, or hypoglycemia",
      "First seizure, persistent focal deficit, meningismus, fever with altered consciousness, or failure to recover"
    ], [
      "Time the seizure, cushion the head, clear objects, turn the person to the side, and never hold them down or force food, fingers, or an object between the teeth; give prescribed buccal, intranasal, or other rescue medicine only as the written plan directs.",
      "Use rescue medicine exactly as the written plan directs and call emergency services at 5 minutes, after repeated seizures without recovery, or sooner for breathing trouble, injury, pregnancy, or a first seizure."
    ]),
    card("Spinal cord injury", ["nice-spinal", "pva-sci"], [
      "Use an airway-breathing-circulation assessment with manual inline stabilization and coordinated spinal motion restriction, documenting mechanism and neurologic findings before and after movement because hypoxia, hypotension, and secondary displacement enlarge cord injury.",
      "Trend respiratory effort, voice, cough, secretion clearance, oxygenation, blood pressure, pulse, temperature, and ordered hemodynamic targets because high cervical injury weakens ventilation and neurogenic shock can present with hypotension and relative bradycardia.",
      "Perform serial motor, sensory, rectal, and sacral-sparing assessment with a standardized scale and report any level change because evolving edema, hematoma, or compression may be surgically reversible.",
      "Provide pressure redistribution, skin checks, thrombosis prevention, passive range of motion, temperature control, and individualized bowel and bladder management because immobility and loss of sensation create preventable infection, clot, contracture, and pressure injury.",
      "For injury at or above T6, treat sudden pounding headache, sweating or flushing above the lesion, piloerection, nasal congestion, and rising blood pressure as autonomic dysreflexia: sit upright, loosen restriction, check bladder and bowel triggers, and escalate because severe hypertension can cause stroke or seizure."
    ], [
      "New or ascending weakness or sensory loss, loss of sacral function, or neurologic change after movement",
      "Shallow breathing, weak cough, retained secretions, rising carbon dioxide, or apnea",
      "Hypotension with bradycardia, poor perfusion, hypothermia, or worsening organ function",
      "Sudden severe headache with rising blood pressure, flushing or sweating, seizure, chest pain, or suspected autonomic dysreflexia"
    ], [
      "Keep the written skin, pressure-relief, bowel, bladder, breathing, and clot-prevention routines; loss of sensation means a burn, pressure wound, full bladder, or injury may not hurt.",
      "If autonomic dysreflexia symptoms occur, sit upright, loosen tight items, check the catheter for kinks, and get urgent help if blood pressure remains high or the trigger is not immediately corrected."
    ]),
    card("Traumatic brain injury", ["acs-tbi", "btf-tbi"], [
      "Trend Glasgow Coma Scale components, pupils, limb strength, speech, behavior, headache, vomiting, and seizure frequency against the best prior examination because a small neurologic decline can be the first sign of expanding hemorrhage or swelling.",
      "Prevent secondary brain injury by maintaining airway, oxygenation, ventilation, blood pressure, temperature, glucose, and sodium within the prescribed plan and treating seizures promptly because hypoxia, hypotension, fever, and metabolic extremes worsen injured neurons.",
      "Keep the head midline with ordered elevation, protect the cervical spine until cleared, minimize unnecessary stimulation and suction, and manage pain and agitation without obscuring examination because venous obstruction and physiologic surges can raise intracranial pressure.",
      "Monitor intake and output, electrolytes, osmolality when ordered, intracranial pressure and drainage systems, and medication effects with strict leveling and sterile technique because diabetes insipidus, salt disorders, infection, and overdrainage alter cerebral perfusion.",
      "Escalate for a Glasgow Coma Scale decline, new unequal or fixed pupil, repeated vomiting, new focal deficit, seizure, Cushing-pattern physiology, cerebrospinal-fluid leak, or intracranial pressure above the ordered limit because herniation and expanding lesions require immediate intervention."
    ], [
      "Declining Glasgow Coma Scale, inability to awaken, or abrupt behavior or speech change",
      "New unequal or fixed pupil, focal weakness, posturing, or loss of brainstem reflex",
      "Repeated vomiting, seizure, severe worsening headache, bradycardia with hypertension, or irregular breathing",
      "Clear fluid from nose or ear, penetrating injury, rapidly increasing intracranial pressure, or drainage-system malfunction"
    ], [
      "After discharge, reduce stimulation and increase activity gradually as directed; avoid alcohol, driving, heights, contact sports, and sedating medicines until the brain-injury team clears them.",
      "Return immediately for increasing sleepiness, repeated vomiting, worsening headache, seizure, confusion, slurred speech, weakness, unequal pupils, clear nose or ear fluid, or any new neurologic change."
    ]),
    card("Compartment syndrome", ["aaos-compartment"], [
      "Identify high-risk fracture, crush, reperfusion, burn, bleeding, or constrictive dressing and perform frequent documented pain, passive-stretch pain, compartment firmness, sensation, motor, color, temperature, capillary refill, and pulse checks because irreversible muscle and nerve ischemia can develop while pulses remain present.",
      "Report escalating pain out of proportion or analgesic requirement immediately, remove external constriction only as authorized, keep the limb at heart level, and maintain perfusion because elevation above the heart can further lower compartment blood flow.",
      "Keep the patient nil by mouth, notify orthopedics urgently, and prepare for repeated pressure measurement or fasciotomy without waiting for late paralysis or pulselessness because definitive treatment is surgical decompression.",
      "Trend blood pressure, urine output, creatine kinase, potassium, creatinine, acid-base status, and urine color after major muscle injury or decompression because rhabdomyolysis can cause hyperkalemia, arrhythmia, and kidney injury.",
      "After fasciotomy, monitor bleeding, exposed tissue, neurovascular status, pain, infection, fluid loss, and planned re-exploration or closure because recurrent pressure, necrosis, and wound complications remain possible."
    ], [
      "Pain out of proportion, pain with passive stretch, or rapidly increasing analgesic need",
      "New paresthesia, sensory loss, weakness, paralysis, tense swelling, or worsening firmness",
      "Cool pale limb, delayed capillary refill, diminished pulse, or hypotension compromising perfusion",
      "Dark urine, oliguria, rising potassium or creatinine, dysrhythmia, or recurrent severe pain after decompression"
    ], [
      "A pulse does not rule out compartment syndrome. Report worsening deep pain, pain when fingers or toes are moved, numbness, tight swelling, weakness, or a cast or dressing that feels increasingly constrictive immediately.",
      "Keep the limb at the level directed by the surgical team, do not add tight wraps or ice that hides skin changes, and keep every wound and rehabilitation visit after fasciotomy."
    ]),
    card("Retinal detachment", ["aao-retinal", "rch-eye-injury"], [
      "Treat sudden flashes, a shower of new floaters, a curtain or shadow, or painless field loss as a same-day ophthalmic emergency and document exact onset because retinal cells lose function as detachment approaches or involves the macula.",
      "Measure visual acuity in each eye, pupils, confrontation fields, eye pain, trauma mechanism, anticoagulants, and prior surgery or severe myopia without delaying dilated retinal evaluation because baseline function and risk guide urgency and repair.",
      "Protect a traumatized eye with a rigid shield, avoid pressure, unnecessary drops, food, and activity when urgent surgery or globe injury is possible, and maintain the position directed by ophthalmology because manipulation can extend injury and anesthesia may be needed.",
      "Prepare the patient for dilated examination, ocular ultrasound only when the globe is known intact, and laser, pneumatic, buckle, or vitrectomy treatment as selected because the retinal break, extent, and macular status determine repair.",
      "After treatment, monitor vision, pain, redness, nausea, intraocular pressure symptoms, and positioning or altitude restrictions, and escalate for recurrent curtain, worsening vision, severe pain, vomiting, or new neurologic symptoms because redetachment, pressure crisis, infection, or stroke must be distinguished quickly."
    ], [
      "Sudden curtain, shadow, field cut, or rapidly worsening central vision",
      "New flashes with a shower of floaters, vitreous hemorrhage, or high-risk recent eye surgery or trauma",
      "Severe pain, irregular pupil, open-globe concern, proptosis, or loss of red reflex after trauma",
      "Recurrent vision loss, severe eye pain, vomiting, marked redness, or discharge after retinal treatment"
    ], [
      "New flashes, many floaters, or a curtain in vision needs same-day eye assessment even without pain; do not drive yourself or wait for the other eye to compensate.",
      "After repair, follow head-position and air-travel or altitude rules exactly and wear the medical identification for an intraocular gas bubble because pressure change and certain anesthetic gases can cause blindness."
    ]),
    card("Hyphema", ["rch-eye-injury"], [
      "Assess trauma mechanism and other life threats first, then record visual acuity in each eye, pupil shape and response, visible blood level, pain, photophobia, and eye movement without pressing on the globe because hyphema can coexist with rupture, lens injury, or retinal damage.",
      "Place a rigid eye shield, elevate the head, limit activity, control nausea and pain with prescribed agents, and avoid eye patch pressure because rebleeding can enlarge the clot and abruptly raise intraocular pressure.",
      "Obtain urgent ophthalmology review and monitor intraocular pressure and visual change at the prescribed frequency, with closer attention to sickle cell disease or trait and anticoagulant use because optic-nerve injury can occur at lower pressure in susceptible patients.",
      "Administer cycloplegic, steroid, and pressure-lowering drops only as prescribed, verify technique and systemic contraindications, and avoid aspirin or nonsteroidal anti-inflammatory drugs unless the responsible prescriber determines they are essential because platelet inhibition increases rebleeding risk.",
      "Escalate for declining vision, increasing blood level, severe pain or headache, vomiting, a hard eye, corneal staining, open-globe signs, or new retinal symptoms because rebleeding, acute pressure elevation, or deeper trauma threatens sight."
    ], [
      "Declining visual acuity, enlarging or total hyphema, or new field loss",
      "Severe eye pain or headache, vomiting, halos, or markedly elevated intraocular pressure",
      "Irregular pupil, peaked pupil, globe deformity, uveal tissue, or suspected penetrating injury",
      "New flashes, floaters, curtain, absent red reflex, or recurrent bleeding after initial improvement"
    ], [
      "Keep the head elevated even during sleep, wear the rigid shield, avoid bending, lifting, sports, and rubbing the eye, and attend every pressure check because vision can worsen after the first day.",
      "Use only approved pain medicines and eye drops and tell the eye team about sickle cell trait or disease, blood thinners, aspirin, and supplements; seek emergency care for worse vision, pain, headache, or vomiting."
    ]),
    card("Mastoiditis", ["nhs-mastoiditis"], [
      "Assess fever, ear pain and drainage, mastoid redness, tenderness, fluctuance, pinna displacement, hearing, and prior antibiotic response because infection can erode mastoid bone and form a subperiosteal abscess despite an ordinary ear-infection beginning.",
      "Arrange urgent hospital and ear-nose-throat evaluation, obtain cultures and imaging as directed, and give prescribed intravenous antibiotics on time because delay permits spread to the venous sinuses, meninges, brain, facial nerve, and inner ear.",
      "Trend temperature, pain, swelling measurements, neurologic status, pupils, facial movement, gait, hearing, hydration, and sepsis markers because intracranial or labyrinthine spread may first appear as headache, weakness, vertigo, or behavior change.",
      "Provide analgesia, fluids, safe ear-drainage care without blind instrumentation, and prepare for myringotomy, abscess drainage, or mastoidectomy when response is inadequate because antibiotics may not penetrate a walled-off collection.",
      "Escalate for increasing postauricular swelling, severe headache, vomiting, neck stiffness, altered consciousness, seizure, focal deficit, facial weakness, vertigo, respiratory or hemodynamic instability, or persistent fever despite therapy because these suggest abscess, meningitis, thrombosis, or sepsis."
    ], [
      "Severe headache, neck stiffness, photophobia, repeated vomiting, confusion, or seizure",
      "New facial weakness, double vision, focal deficit, ataxia, severe vertigo, or reduced hearing",
      "Fluctuant postauricular swelling, rapidly displaced pinna, worsening pain, or persistent fever despite antibiotics",
      "Hypotension, poor perfusion, hypoxemia, oliguria, or other sepsis findings"
    ], [
      "Redness, tenderness, or swelling behind the ear that pushes the ear outward needs urgent hospital assessment; do not treat it only with leftover ear drops or wait for it to drain.",
      "Complete the antibiotic and ENT plan and return for fever, swelling, severe headache, vomiting, stiff neck, imbalance, facial weakness, or hearing change because complications can extend beyond the ear."
    ]),
    card("Open-angle glaucoma", ["nice-glaucoma"], [
      "Establish the prescribed target pressure, baseline optic-nerve image and visual field, family history, corneal factors, and current function because open-angle glaucoma is usually painless and progression is detected by trend rather than symptoms.",
      "Administer and teach each drop in the correct order and time, use one drop with eyelid closure or nasolacrimal occlusion when appropriate, and separate different drops because correct technique improves ocular exposure while reducing systemic absorption.",
      "Review adherence without blame and assess redness, ocular-surface pain, iris or eyelash change, bradycardia, bronchospasm, fatigue, dry mouth, and medication interactions because local glaucoma medicines can have important systemic and quality-of-life effects.",
      "Ensure repeat applanation pressure, optic-nerve imaging, visual fields, and gonioscopy when indicated occur at the risk-based interval because a normal home experience cannot reveal silent peripheral field loss.",
      "Escalate for documented pressure or field progression despite treatment and urgently for sudden severe eye pain, halos, red eye, nausea, vomiting, rapid vision loss, or new neurologic field loss because these are not typical stable open-angle glaucoma and may represent angle closure, retinal disease, or stroke."
    ], [
      "Sudden severe eye pain, red eye, halos, headache, nausea, or vomiting",
      "Rapid vision loss, new curtain or field cut, flashes or floaters, or neurologic deficit",
      "Documented optic-nerve or visual-field progression despite treatment",
      "Symptomatic bradycardia, syncope, bronchospasm, severe ocular allergy, or inability to administer essential drops"
    ], [
      "Use glaucoma drops every day even when vision feels normal; place one drop in the pocket of the lower lid, close the eye gently, and press the inner corner if taught rather than squeezing in several drops.",
      "Bring every eye medicine to appointments and keep pressure, field, and optic-nerve tests; seek urgent care for sudden pain, halos, vomiting, or rapid vision change because stable open-angle glaucoma is usually painless."
    ]),
    card("Retinoblastoma", ["nci-retinoblastoma"], [
      "Escalate promptly for leukocoria, a new crossed eye, absent red reflex, unexplained visual behavior change, painful enlarged eye, or family history through an urgent pediatric ophthalmic-oncology referral because early localized disease offers the best survival, eye, and vision outcomes.",
      "Document laterality, onset, family history, photographs noticed by caregivers, visual behavior, pain, proptosis, and neurologic symptoms without performing an invasive biopsy because tumor disruption can risk extraocular spread and diagnosis is usually made by specialized examination and imaging.",
      "Prepare for examination under anesthesia, ocular ultrasound, and magnetic resonance imaging as directed, monitoring fasting, anesthesia, and recovery safety because complete retinal mapping and assessment of optic-nerve or extraocular extension determine treatment.",
      "During systemic, intra-arterial, intravitreal, laser, cryotherapy, radiation, or surgical care, trend blood counts, fever, bleeding, eye pain and redness, vision, vascular access, and treatment-specific toxicity because cure and eye salvage require tightly coordinated multidisciplinary therapy.",
      "Coordinate RB1 genetic counseling and examination of both eyes and at-risk relatives, then maintain surveillance for new tumors, recurrence, trilateral disease, vision development, and later cancers because heritable disease affects every retinal cell and lifelong risk extends beyond the treated eye."
    ], [
      "Leukocoria, absent red reflex, new strabismus, or unexplained loss of visual behavior",
      "Proptosis, painful enlarged eye, severe redness, orbital swelling, or suspected extraocular extension",
      "Severe headache, vomiting, focal deficit, seizure, or other concern for intracranial disease",
      "Fever during immunosuppressive therapy, uncontrolled bleeding, severe eye pain, or sudden post-treatment vision change"
    ], [
      "A white pupil seen in person or repeatedly in flash photographs needs prompt dilated examination; do not wait for pain, because early retinoblastoma is often painless.",
      "Keep every eye and genetics appointment even after successful treatment, and ask which relatives need testing; hereditary retinoblastoma can affect both eyes and increase later cancer risk."
    ]),
    card("Cannabis intoxication", ["acmt-cannabis", "poison-cannabis"], [
      "Immediately assess airway patency, respiratory effort, oxygen saturation, pulse, blood pressure, temperature, and bedside glucose; support ventilation or circulation when impaired, then check alertness, pupils, gait, vomiting, and trauma because severe intoxication and common mimics such as hypoglycemia or head injury can look similar.",
      "Determine product, route, estimated amount, time, co-ingestants, prescribed medicines, pregnancy, and whether a child could access the source, and contact Poison Control or a medical toxicologist because edible effects are delayed, prolonged, and dose estimates are unreliable.",
      "Use a quiet observed environment with fall, aspiration, and driving precautions, provide prescribed fluids and antiemetic support, and avoid routine restraint because most cases improve with time while overstimulation worsens anxiety and dysphoria.",
      "Trend mental status, respirations, oxygenation, heart rate, blood pressure, temperature, oral intake, and ambulation until a safe baseline returns because young children may develop profound somnolence, hypotension, bradycardia, or respiratory depression.",
      "Escalate for apnea, hypoxemia, inability to protect the airway, seizure, chest pain, severe agitation or psychosis, persistent vomiting, hemodynamic instability, or unexplained coma because ventilatory support and evaluation for synthetic cannabinoids, co-ingestion, or another diagnosis may be required."
    ], [
      "Apnea, slow or labored breathing, hypoxemia, aspiration, or inability to protect the airway",
      "Seizure, coma, severe confusion, focal deficit, or failure to improve as expected",
      "Chest pain, dysrhythmia, syncope, severe hypotension, or extreme tachycardia",
      "Violent unsafe behavior, severe psychosis, hyperthermia, persistent vomiting, or suspected co-ingestion"
    ], [
      "Do not drive, swim, cook, supervise children alone, or mix cannabis with alcohol or sedatives while impaired; edible effects can start late and last much longer than inhaled effects.",
      "Keep cannabis locked, high, and out of sight in child-resistant original packaging, never in ordinary food containers; call Poison Control immediately if a child may have eaten any amount, even before symptoms."
    ]),
    card("Hallucinogen intoxication", ["merck-hallucinogens"], [
      "Immediately assess airway patency, respiratory effort, oxygen saturation, pulse, blood pressure, temperature, and glucose; support ventilation or circulation when impaired, then check trauma, pupils, rigidity, clonus, chest symptoms, mental status, and suicidality because a presumed psychedelic reaction can actually be head injury, stimulant or serotonin toxicity, PCP exposure, or another medical emergency.",
      "Clarify substance, formulation, dose, time, route, co-ingestants, medications, setting, and witness information and involve Poison Control or toxicology when severe or uncertain because illicit products may contain unexpected high-potency agents.",
      "Move the patient to a quiet low-stimulation space, use one calm staff member for simple reassurance and orientation, remove hazards, and maintain respectful observation because sensory overload and confrontation can intensify panic, paranoia, and impulsive escape.",
      "Trend temperature, pulse, blood pressure, oxygenation, electrocardiogram when indicated, hydration, agitation, and urine output, and give prescribed benzodiazepine and cooling or fluid support while avoiding unnecessary physical struggle because hyperthermia, acidosis, and rhabdomyolysis worsen with sustained agitation.",
      "Escalate for hyperthermia, seizure, chest pain, dysrhythmia, severe hypertension, rigidity or clonus, violent behavior that cannot be safely redirected, persistent psychosis, suicidal intent, or reduced consciousness because toxic, cardiac, neurologic, and psychiatric complications need emergency care."
    ], [
      "Hyperthermia, severe rigidity or clonus, profuse diaphoresis, acidosis, or dark urine",
      "Seizure, coma, focal deficit, severe headache, or suspected head injury",
      "Chest pain, dysrhythmia, syncope, severe hypertension, or cardiovascular collapse",
      "Persistent psychosis, suicidal intent, violent unsafe behavior, or inability to maintain a protected environment"
    ], [
      "During a frightening reaction, move to a quiet safe place with a sober trusted person, avoid driving or taking more substances to counteract it, and call emergency services for chest pain, overheating, seizure, or unsafe behavior.",
      "A routine drug screen may not identify the substance. Be candid about products and medicines so clinicians can detect co-ingestion, and arrange follow-up if hallucinations, panic, depression, or flashbacks persist."
    ]),
    card("Borderline personality disorder", ["nice-bpd", "nice-self-harm"], [
      "Approach crisis with a calm nonthreatening manner, validate the person's stated distress, ask what happened and what has helped before, and avoid pejorative labels or assumptions of manipulation because respectful curiosity reduces escalation and preserves a therapeutic alliance.",
      "Assess current suicidal thoughts, intent, plan, recent self-harm, access to lethal means, intoxication, violence risk, dissociation, psychosis, medical injury, safeguarding, and dependent-child safety because immediate risk must be separated from chronic background risk.",
      "Treat overdose, wounds, intoxication, pain, and other physical needs without delaying a collaborative psychosocial assessment because self-harm deserves the same medical care and can reveal modifiable triggers and supports.",
      "Use the existing crisis plan or co-create a brief plan with warning signs, coping strategies, supportive contacts, lethal-means safety, service access, and specific follow-up, documenting shared decisions because predictable transitions reduce abandonment fears and recurrent crisis.",
      "Coordinate structured psychotherapy and comorbidity care; do not present medication as treatment for the personality disorder, and if short-term crisis medicine is prescribed, monitor target, quantity, interactions, overdose risk, and stop plan because polypharmacy can add harm without building durable coping."
    ], [
      "Current suicidal intent or plan, recent serious attempt, escalating self-harm, or access to lethal means",
      "Violence risk, severe dissociation or psychosis, intoxication, or inability to collaborate on immediate safety",
      "Overdose, uncontrolled bleeding, strangulation concern, head injury, or another untreated medical emergency",
      "Unsafe discharge, abrupt care transition without a plan, suspected abuse, or dependent child at risk"
    ], [
      "Your distress and safety concerns deserve direct care. Tell the team what changed, what has helped before, and what makes the current moment unsafe so the crisis plan can fit the actual problem.",
      "Evidence-based psychotherapy builds longer-term emotion and relationship skills; keep the written crisis contacts and safety steps accessible, and seek immediate help for suicidal intent or an injury or overdose."
    ]),
    card("Anorexia nervosa", ["nice-eating"], [
      "Assess weight and recent rate of loss without using a single body-mass threshold, along with intake, restriction, exercise, vomiting, laxatives, diuretics, fluid loading, menstrual or endocrine effects, substance use, and functional decline because severe instability can occur at any body size.",
      "Trend lying and standing pulse and blood pressure, temperature, hydration, mental status, electrocardiogram, glucose, electrolytes, bicarbonate, magnesium, phosphate, blood count, kidney and liver tests because bradycardia, hypotension, arrhythmia, hypoglycemia, and electrolyte shifts may be clinically silent.",
      "Assess suicide, self-harm, abuse, depression, obsessive symptoms, and capacity while communicating without praise or criticism about weight and shape because psychiatric danger and shame can obstruct honest disclosure and lifesaving treatment.",
      "Begin nutrition through a trained eating-disorder refeeding protocol with prescribed vitamin and electrolyte support, supervised meals, intake and output, daily clinical review, and serial phosphate, magnesium, potassium, glucose, fluid status, and rhythm monitoring because underfeeding prolongs injury while rapid metabolic shifts can cause refeeding syndrome.",
      "Escalate for syncope, severe bradycardia or hypotension, arrhythmia or prolonged QT, hypothermia, severe dehydration, acute food or fluid refusal, hypoglycemia, major electrolyte abnormality, organ failure, suicidality, or refeeding edema and respiratory or neurologic change because medical stabilization may require inpatient care."
    ], [
      "Syncope, chest pain, dysrhythmia, marked bradycardia or hypotension, prolonged QT, or poor perfusion",
      "Hypoglycemia, severe electrolyte disturbance, acute kidney injury, hypothermia, dehydration, or incipient organ failure",
      "New edema, dyspnea, weakness, confusion, seizure, or rapidly falling phosphate, potassium, or magnesium during refeeding",
      "Current suicidal intent, serious self-harm, complete food or fluid refusal, or inability to remain safe"
    ], [
      "Anorexia is a serious brain-and-body illness, not a choice or a failure of willpower; medical monitoring and nutrition repair help the brain use psychotherapy and make recovery possible.",
      "Follow the supervised meal and laboratory plan and report fainting, chest symptoms, swelling, breathing trouble, confusion, vomiting, laxative or diuretic use, or urges to self-harm without waiting for the next weigh-in."
    ]),
    card("Lithium toxicity", ["extrip-lithium", "dailymed-lithium"], [
      "Stop further lithium and immediately determine formulation, dose, time, acute versus chronic exposure, last dose, fluid loss, kidney disease, and interacting medicines such as NSAIDs, ACE inhibitors, angiotensin-receptor blockers, or thiazides because tissue burden and impaired clearance matter more than one isolated level.",
      "Assess airway, breathing, circulation, temperature, hydration, tremor, ataxia, speech, cognition, muscle tone, seizures, vomiting, diarrhea, and urine output and place severe cases on continuous cardiac and neurologic monitoring because toxicity affects brain, kidney, and rhythm.",
      "Obtain serial lithium levels with collection times, electrolytes, calcium, glucose, kidney function, urinalysis, electrocardiogram, and other ingestion tests as indicated because levels may rise after presentation and symptoms can lag or persist after serum concentration falls.",
      "Give prescribed isotonic fluid with frequent lung, sodium, urine-output, and renal reassessment, avoid nephrotoxic interactions, and follow toxicology guidance for gastrointestinal measures because activated charcoal does not bind lithium and indiscriminate fluids can harm patients with limited reserve.",
      "Consult Poison Control, medical toxicology, nephrology, and dialysis services early and escalate for reduced consciousness, seizure, severe confusion or ataxia, dysrhythmia, oliguria, worsening kidney function, severe electrolyte disturbance, or a level and clinical pattern meeting extracorporeal-treatment criteria because hemodialysis may be lifesaving and rebound requires repeat monitoring."
    ], [
      "Seizure, coma, severe confusion, marked ataxia, dysarthria, rigidity, or worsening neurologic status",
      "Dysrhythmia, syncope, hemodynamic instability, or significant electrocardiographic change",
      "Oliguria, acute kidney injury, severe dehydration, hypernatremia, or inability to clear lithium",
      "Rising or persistently high serial lithium level, sustained-release ingestion, or post-dialysis rebound with symptoms"
    ], [
      "Take lithium at the same dose and time, maintain a consistent normal salt and fluid intake, and call during vomiting, diarrhea, fever, heavy sweating, or poor intake because dehydration can raise lithium even without an overdose.",
      "Check before using ibuprofen, naproxen, water pills, ACE inhibitors, or new prescriptions, and seek urgent care for worsening tremor, unsteady walking, slurred speech, confusion, severe vomiting, or unusual sleepiness."
    ]),
    card("Alcohol use disorder", ["asam-alcohol", "nice-alcohol"], [
      "Ask without stigma about amount, pattern, last drink, prior withdrawal seizure or delirium, other sedatives, medical illness, pregnancy, nutrition, housing, and treatment goals because withdrawal risk and safe level of care depend on history as well as current appearance.",
      "Trend pulse, blood pressure, temperature, respirations, oxygenation, orientation, tremor, sweating, agitation, hallucinations, gait, hydration, and sleep, using a validated withdrawal scale only when the patient can report reliably because delirium, head injury, infection, and intoxication can invalidate a score.",
      "Administer protocol-directed withdrawal medicine and monitor sedation, airway, breathing, falls, and response; maintain seizure precautions and escalate inadequate control because undertreatment permits seizures and delirium while oversedation causes aspiration and respiratory depression.",
      "Check glucose, electrolytes, magnesium, phosphate, blood count, liver and kidney function, electrocardiogram, nutrition, bleeding, pancreatitis, infection, and trauma; give prescribed thiamine promptly and treat hypoglycemia with glucose without delay because the two may be given concurrently and alcohol-related emergencies often coexist.",
      "Create a shared continuing-care plan for medication treatment when appropriate, counseling, mutual-help or peer support, relapse and overdose prevention, primary care, and safe follow-up because withdrawal management alone does not treat alcohol use disorder."
    ], [
      "Withdrawal seizure, delirium, severe agitation, hallucinations with disorientation, or rapidly escalating medication need",
      "Apnea, aspiration, severe oversedation, hypoxemia, or inability to protect the airway",
      "Confusion with ataxia or eye-movement abnormality, hypoglycemia, severe electrolyte disturbance, or refeeding concern",
      "Hematemesis or melena, severe abdominal pain, jaundice with confusion, head injury, suicidality, or sepsis findings"
    ], [
      "Stopping suddenly can be dangerous after regular heavy drinking, especially after a past withdrawal seizure or delirium; seek medical guidance rather than trying to detox alone or using someone else's sedatives.",
      "Alcohol use disorder is treatable. Withdrawal care is the first step, and medications, counseling, peer support, and a practical relapse plan can be combined around your goals without shame or punishment."
    ])
  ];

  function canonicalPrimary(entry) {
    return String((entry && (entry.name || entry.title || entry.displayName)) || "").trim();
  }

  function normalizePrimary(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  const attempted = patches.map((patch) => patch.name);
  const appliedNames = [];
  const unresolved = [];

  if (!database || !Array.isArray(database.diseases)) {
    unresolved.push({ name: "__database__", matchCount: 0, reason: "ANI_PATHOLOGY_DATABASE.diseases unavailable" });
  } else {
    patches.forEach((patch) => {
      const target = normalizePrimary(patch.name);
      const matches = database.diseases.filter((entry) => normalizePrimary(canonicalPrimary(entry)) === target);
      if (matches.length !== 1) {
        unresolved.push({ name: patch.name, matchCount: matches.length, reason: "normalized primary canonical title did not resolve exactly once" });
        return;
      }
      Object.assign(matches[0], {
        nursingPriorities: patch.nursingPriorities.slice(),
        redFlags: patch.redFlags.slice(),
        patientEducation: patch.patientEducation.slice()
      });
      appliedNames.push(patch.name);
    });
  }

  const names = patches.map((patch) => patch.name);
  window.ANI_PATHOLOGY_NURSING_WAVE29_B = {
    schemaVersion: 1,
    version: VERSION,
    cohort: COHORT,
    names: names.slice(),
    highRiskNames: names.slice(),
    cards: patches.map((patch) => ({ name: patch.name, sourceIds: patch.sourceIds.slice() })),
    sources: sources.map((source) => ({ ...source })),
    application: {
      attempted: attempted.slice(),
      appliedNames: appliedNames.slice(),
      unresolved: unresolved.map((item) => ({ ...item }))
    }
  };
})();
