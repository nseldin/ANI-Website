(function () {
  "use strict";

  const database = window.ANI_PATHOLOGY_DATABASE;
  const VERSION = "2026-07-18-wave31-pathology-nursing-b-1";
  const COHORT = "B";

  const sources = [
    { id: "msud-genereviews", label: "NIH GeneReviews, Maple Syrup Urine Disease", url: "https://www.ncbi.nlm.nih.gov/books/NBK1319/", note: "Supports leucine and amino-acid monitoring, sick-day calories, protein interruption only under the metabolic plan, dialysis escalation, and neurologic surveillance in MSUD." },
    { id: "aha-aortic", label: "ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease", url: "https://professional.heart.org/en/science-news/2022-guideline-for-the-diagnosis-and-management-of-aortic-disease/top-things-to-know", note: "Supports serial aortic imaging, blood-pressure control, family screening, pregnancy planning, and urgent recognition of aortic dissection in Marfan syndrome." },
    { id: "nci-neuroblastoma", label: "National Cancer Institute, Neuroblastoma Treatment PDQ", url: "https://www.cancer.gov/types/neuroblastoma/hp/neuroblastoma-treatment-pdq", note: "Supports risk-adapted neuroblastoma treatment, tumor-burden and cord-compression assessment, multimodal therapy, toxicity monitoring, and survivorship care." },
    { id: "endocrine-paget", label: "Endocrine Society, Paget's Disease of Bone Clinical Practice Guideline", url: "https://www.endocrine.org/clinical-practice-guidelines/pagets-disease-of-bone", note: "Supports alkaline-phosphatase and imaging assessment, bisphosphonate treatment, complication monitoring, and preparation before surgery on pagetic bone." },
    { id: "nice-b12", label: "NICE, Vitamin B12 Deficiency in Over 16s", url: "https://www.nice.org.uk/guidance/ng239/chapter/Recommendations", note: "Supports autoimmune-gastritis evaluation, prompt vitamin B12 replacement, lifelong therapy when malabsorption is irreversible, neurologic reassessment, and safety follow-up." },
    { id: "nci-prostate", label: "National Cancer Institute, Prostate Cancer Treatment PDQ", url: "https://www.cancer.gov/types/prostate/hp/prostate-treatment-pdq", note: "Supports risk-based surveillance or treatment, urinary and skeletal complication assessment, treatment-toxicity monitoring, and shared decision-making in prostate cancer." },
    { id: "aad-psoriasis", label: "American Academy of Dermatology, Psoriasis Clinical Guideline", url: "https://www.aad.org/member/clinical-quality/guidelines/psoriasis", note: "Supports severity and comorbidity assessment, topical and systemic therapy, infection and laboratory monitoring, trigger reduction, and psoriatic-arthritis recognition." },
    { id: "ats-sarcoid", label: "American Thoracic Society, Diagnosis and Detection of Sarcoidosis Guideline", url: "https://www.thoracic.org/statements/guideline-implementation-tools/diagnosis-and-detection-of-sarcoidosis.php", note: "Supports organ-specific sarcoidosis evaluation, pulmonary, cardiac, ocular, calcium, and renal screening, and longitudinal monitoring." },
    { id: "srs-scoliosis", label: "Scoliosis Research Society, Adolescent Idiopathic Scoliosis", url: "https://www.srs.org/Patients/Conditions/Scoliosis/Idiopathic-Scoliosis", note: "Supports serial curve assessment, growth-aware observation, brace adherence, function monitoring, and surgical referral when progression exceeds conservative control." },
    { id: "aaos-scfe", label: "American Academy of Orthopaedic Surgeons, Slipped Capital Femoral Epiphysis", url: "https://orthoinfo.aaos.org/diseases--conditions/slipped-capital-femoral-epiphysis-scfe", note: "Supports immediate non-weight-bearing care, urgent orthopedic fixation, contralateral-hip assessment, and monitoring for avascular necrosis and chondrolysis." },
    { id: "cdc-thal", label: "Centers for Disease Control and Prevention, Treatment of Thalassemia", url: "https://www.cdc.gov/thalassemia/treatment/index.html", note: "Supports scheduled transfusion care, alloimmunization and reaction surveillance, iron-overload monitoring, chelation adherence, and infection prevention." },
    { id: "nci-thyroid", label: "National Cancer Institute, Thyroid Cancer Treatment PDQ", url: "https://www.cancer.gov/types/thyroid/hp/thyroid-treatment-pdq", note: "Supports type- and stage-specific thyroid cancer evaluation, surgery and radioactive-iodine care, hormone replacement, recurrence surveillance, and aggressive-disease escalation." },
    { id: "turner-guideline", label: "2023 Aarhus International Turner Syndrome Clinical Practice Guideline", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11759048/", note: "Supports lifelong aortic and blood-pressure surveillance, endocrine and hearing screening, growth and puberty care, and pregnancy risk assessment in Turner syndrome." },
    { id: "aua-vur", label: "American Urological Association, Vesicoureteral Reflux Guideline", url: "https://www.auanet.org/guidelines-and-quality/guidelines/vesicoureteral-reflux-topics", note: "Supports prompt febrile-UTI management, prophylaxis selection, bladder and bowel care, renal-growth and blood-pressure monitoring, and surgical reassessment." },
    { id: "kdigo-transplant", label: "KDIGO, Managing Kidney Transplant Recipients", url: "https://kdigo.org/wp-content/uploads/2017/02/KDIGO_TX_NephsTool-Managing-Kidney-Transplant-Recipients.pdf", note: "Supports allograft-function and proteinuria trends, adherence and drug-level review, infection evaluation, biopsy for unexplained decline, and rejection surveillance." },
    { id: "ishlt-heart-transplant", label: "ISHLT Guidelines for the Care of Heart Transplant Recipients", url: "https://www.ishlt.org/education-and-publications/standards-guidelines-detail/ishlt-guidelines-for-the-care-of-heart-transplant-recipients", note: "Supports heart-allograft rejection surveillance with graft-function assessment, donor-specific antibodies, endomyocardial biopsy when indicated, and cardiac-allograft-vasculopathy screening." },
    { id: "ishlt-clad", label: "ISHLT Consensus Report on Chronic Lung Allograft Dysfunction", url: "https://www.ishlt.org/education-and-publications/standards-guidelines-detail/chronic-lung-allograft-dysfunction-definition-diagnostic-criteria-and-approaches-to-treatment", note: "Supports serial lung-function surveillance, recognition of persistent FEV1 decline, exclusion of reversible causes, and phenotype-specific evaluation of chronic lung allograft dysfunction." },
    { id: "aasld-liver-transplant", label: "AASLD/AST Adult Liver Transplantation Guideline: Graft-Related Complications", url: "https://www.aasld.org/aasld-and-ast-announce-new-practice-guideline-adult-liver-transplantation-diagnosis-and-management", note: "Supports current diagnosis and management of liver-allograft rejection, recurrent disease, immunosuppression, and other graft-related complications." },
    { id: "endocrine-pa", label: "Endocrine Society, Primary Aldosteronism Clinical Practice Guideline", url: "https://www.endocrine.org/clinical-practice-guidelines/primary-aldosteronism-2", note: "Supports aldosterone and renin screening, potassium-aware interpretation, subtype testing, adrenalectomy or mineralocorticoid-receptor blockade, and blood-pressure, renal, potassium, and renin follow-up." },
    { id: "ada-2026", label: "American Diabetes Association, 2026 Retinopathy, Neuropathy, and Foot Care Standards", url: "https://diabetesjournals.org/docm-care/article/doi/10.2337/doc26-a012/164621/Section-12-Retinopathy-Neuropathy-and-Foot-Care", note: "Supports annual neuropathy and foot assessment, protective-sensation testing, retinal screening, risk-factor control, ulcer prevention, and urgent ophthalmic or foot escalation." },
    { id: "aaos-dislocation", label: "American Academy of Orthopaedic Surgeons, Shoulder Dislocation", url: "https://orthoinfo.aaos.org/en/diseases--conditions/dislocated-shoulder", note: "Supports shoulder-specific emergency evaluation, imaging, pre- and post-reduction neurovascular checks, immobilization, rehabilitation, and recurrence follow-up." },
    { id: "msd-dislocations", label: "MSD Manual Professional Edition, Overview of Dislocations", url: "https://www.msdmanuals.com/professional/injuries-poisoning/dislocations/overview-of-dislocations", note: "Supports joint-neutral assessment for fractures, open injury, neurovascular compromise, and compartment syndrome; clinician-performed reduction; post-reduction immobilization; and joint-appropriate rehabilitation." },
    { id: "nih-folate", label: "NIH Office of Dietary Supplements, Folate Fact Sheet for Health Professionals", url: "https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/", note: "Supports folate-risk assessment, replacement, medication interaction review, pregnancy prevention guidance, and exclusion of vitamin B12 deficiency before high-dose folate." },
    { id: "nice-low-back", label: "NICE, Low Back Pain and Sciatica in Over 16s", url: "https://www.nice.org.uk/guidance/NG59/chapter/recommendations", note: "Supports red-flag screening, continued safe activity, risk-stratified rehabilitation, restrained imaging, and specialist escalation for persistent or progressive radicular disease." },
    { id: "nice-hyperpara", label: "NICE, Primary Hyperparathyroidism: Diagnosis, Assessment and Initial Management", url: "https://www.nice.org.uk/guidance/NG132/chapter/Recommendations", note: "Supports calcium, PTH, renal and skeletal assessment, parathyroid surgery criteria, medical monitoring, and complication prevention." },
    { id: "kdigo-ckd-mbd", label: "KDIGO Clinical Practice Guideline for CKD-Mineral and Bone Disorder", url: "https://kdigo.org/guidelines/ckd-mbd/", note: "Supports serial interpretation of calcium, phosphate, PTH, alkaline phosphatase, and vitamin D and cause-directed management of secondary hyperparathyroidism and renal bone disease in CKD." },
    { id: "niddk-ckd-mbd", label: "NIDDK, Mineral and Bone Disorder in Chronic Kidney Disease", url: "https://www.niddk.nih.gov/health-information/kidney-disease/mineral-bone-disorder", note: "Supports the renal mechanisms linking phosphate retention, impaired calcitriol activation, secondary hyperparathyroidism, renal osteodystrophy, vascular calcification, and cause-directed surveillance." },
    { id: "aga-iron", label: "American Gastroenterological Association, Management of Iron Deficiency Anemia", url: "https://gastro.org/clinical-guidance/management-of-iron-deficiency-anemia/", note: "Supports cause-directed evaluation, tolerable oral dosing, intravenous iron indications, infusion-reaction monitoring, and response assessment." },
    { id: "ninds-lbd", label: "NIH NINDS, Lewy Body Dementia", url: "https://www.ninds.nih.gov/health-information/disorders/lewy-body-dementia", note: "Supports cognitive, motor, sleep, swallowing, and autonomic assessment; fall prevention; medication review; and avoidance of hazardous antipsychotic exposure." },
    { id: "cdc-mono", label: "Centers for Disease Control and Prevention, Infectious Mononucleosis", url: "https://www.cdc.gov/epstein-barr/about/mononucleosis.html", note: "Supports hydration and symptom care, avoidance of ampicillin-class drugs and contact sports, and recognition of splenic, airway, hepatic, and hematologic complications." },
    { id: "cdc-dmd", label: "CDC Stacks, Duchenne Muscular Dystrophy Care Considerations", url: "https://stacks.cdc.gov/view/cdc/53174", note: "Supports Duchenne-specific respiratory, cardiac, bone, orthopedic, corticosteroid, and multidisciplinary surveillance." },
    { id: "cdc-md-types", label: "Centers for Disease Control and Prevention, Types of Muscular Dystrophy", url: "https://www.cdc.gov/muscular-dystrophy/types/index.html", note: "Supports subtype-wide distinctions among Duchenne, Becker, myotonic, limb-girdle, facioscapulohumeral, congenital, distal, oculopharyngeal, and Emery-Dreifuss muscular dystrophies." },
    { id: "aan-fshd", label: "AAN/AANEM Guideline for Facioscapulohumeral Muscular Dystrophy", url: "https://www.neurology.org/doi/10.1212/WNL.0000000000001783", note: "Supports FSHD-specific pulmonary risk assessment and explains why routine cardiac screening is not required in asymptomatic FSHD, illustrating the need for subtype-specific surveillance." },
    { id: "aan-nph", label: "American Academy of Neurology, Idiopathic Normal Pressure Hydrocephalus Guideline", url: "https://www.aan.com/Guidelines/home/GuidelineDetail/725", note: "Supports objective gait and cognitive assessment, shunt-response counseling and testing, and longitudinal surveillance for shunt benefit and complications." },
    { id: "uspstf-obesity", label: "U.S. Preventive Services Task Force, Behavioral Interventions for Adult Obesity", url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/obesity-in-adults-interventions", note: "Supports respectful assessment and referral to intensive multicomponent interventions, self-monitoring, comorbidity reduction, and long-term weight maintenance." },
    { id: "aga-obesity-pharm", label: "American Gastroenterological Association, Pharmacological Interventions for Adults With Obesity", url: "https://gastro.org/clinical-guidance/pharmacological-interventions-for-adults-with-obesity/", note: "Supports adding evidence-based anti-obesity medication to lifestyle intervention when response is inadequate and choosing therapy according to benefits, risks, contraindications, and comorbidities." },
    { id: "asmbs-ifso", label: "2022 ASMBS/IFSO Indications for Metabolic and Bariatric Surgery", url: "https://asmbs.org/resources/2022-asmbs-and-ifso-indications-for-metabolic-and-bariatric-surgery/", note: "Supports current indications, multidisciplinary selection, and long-term follow-up for metabolic and bariatric surgery." },
    { id: "nih-vitd", label: "NIH Office of Dietary Supplements, Vitamin D Fact Sheet for Health Professionals", url: "https://ods.od.nih.gov/factsheets/Vitamind-HealthProfessional/", note: "Supports 25-hydroxyvitamin D interpretation, calcium and phosphate physiology, deficiency causes, replacement safety, and osteomalacia prevention." },
    { id: "endocrine-xlh", label: "Endocrine Society, X-Linked Hypophosphatemia", url: "https://www.endocrine.org/patient-engagement/endocrine-library/x-linked-hypophosphatemia", note: "Supports FGF23-mediated renal phosphate wasting, hypophosphatemic osteomalacia, and the need for disorder-specific mineral management rather than assuming vitamin D deficiency." },
    { id: "endocrine-tio", label: "Journal of the Endocrine Society, Tumor-Induced Osteomalacia Diagnosis and Management", url: "https://www.endocrine.org/journals/journal-of-the-endocrine-society/tumor-induced-osteomalacia-diagnosis-and-management", note: "Supports recognition of acquired FGF23-mediated phosphate wasting, tumor localization, definitive resection when feasible, and specialist-directed medical therapy." },
    { id: "ninds-neuropathy", label: "NIH NINDS, Peripheral Neuropathy", url: "https://www.ninds.nih.gov/health-information/disorders/peripheral-neuropathy", note: "Supports motor, sensory, and autonomic assessment, reversible-cause evaluation, injury prevention, rehabilitation, and urgent evaluation of rapidly progressive weakness." },
    { id: "va-amputation", label: "VA/DoD Clinical Practice Guideline for Rehabilitation of Lower Limb Amputation", url: "https://healthquality.va.gov/HEALTHQUALITY/guidelines/Rehab/amp/index.asp", note: "Supports differentiation of phantom and residual-limb pain, repeated functional assessment, mirror therapy, prosthetic and skin review, and interdisciplinary rehabilitation." },
    { id: "acr-pmr", label: "American College of Rheumatology, Polymyalgia Rheumatica", url: "https://rheumatology.org/patients/polymyalgia-rheumatica", note: "Supports symptom and inflammatory-marker follow-up, glucocorticoid tapering and toxicity prevention, exercise, relapse recognition, and screening for giant cell arteritis." },
    { id: "acr-cppd", label: "American College of Rheumatology, Calcium Pyrophosphate Deposition", url: "https://rheumatology.org/patients/calcium-pyrophosphate-deposition-cppd", note: "Supports synovial-fluid confirmation, acute anti-inflammatory care, recurrent-attack prevention, metabolic association review, and exclusion of septic arthritis." },
    { id: "eular-ssc", label: "EULAR Recommendations for Systemic Sclerosis: 2023 Update", url: "https://ard.bmj.com/content/early/2024/10/17/ard-2024-226430", note: "Supports Raynaud and digital-ulcer care, renal-crisis recognition, pulmonary hypertension and interstitial-lung-disease surveillance, gastrointestinal care, and targeted therapy." },
    { id: "aad-seb", label: "American Academy of Dermatology, Seborrheic Dermatitis Diagnosis and Treatment", url: "https://www.aad.org/public/diseases/a-z/seborrheic-dermatitis-treatment", note: "Supports site-specific antifungal and anti-inflammatory therapy, gentle skin care, maintenance treatment, adverse-effect monitoring, and diagnostic reassessment for refractory disease." },
    { id: "cdc-shingles", label: "Centers for Disease Control and Prevention, Clinical Overview of Shingles", url: "https://www.cdc.gov/shingles/hcp/clinical-overview/index.html", note: "Supports rash and neurologic assessment, transmission precautions, complication recognition, vaccination, and care for ocular, otic, disseminated, or immunocompromised disease." },
    { id: "cdc-isolation-zoster", label: "CDC Appendix A, Isolation Precautions for Herpes Zoster", url: "https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-type-duration.html", note: "Supports Standard Precautions for coverable localized zoster in an immunocompetent patient and Airborne plus Contact plus Standard Precautions for disseminated zoster or localized zoster in an immunocompromised patient until dissemination is excluded." },
    { id: "sma-genereviews", label: "NIH GeneReviews, Spinal Muscular Atrophy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1352/", note: "Supports early disease-modifying therapy, respiratory and airway-clearance monitoring, swallowing and nutrition care, motor and orthopedic surveillance, and treatment-toxicity checks." },
    { id: "aaos-soft", label: "American Academy of Orthopaedic Surgeons, Sprains, Strains, and Other Soft-Tissue Injuries", url: "https://orthoinfo.aaos.org/en/diseases--conditions/sprains-strains-and-other-soft-tissue-injuries", note: "Supports protection, ice, compression, elevation, graded movement and strengthening, and reassessment when function or neurovascular status is abnormal." },
    { id: "aaos-stress", label: "American Academy of Orthopaedic Surgeons, Stress Fractures", url: "https://orthoinfo.aaos.org/en/diseases--conditions/stress-fractures", note: "Supports load cessation, high-risk-site evaluation, nutrition and training review, imaging follow-up, and slow pain-free return to activity." },
    { id: "nia-sundown", label: "NIH National Institute on Aging, Coping With Agitation, Aggression, and Sundowning", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/coping-agitation-aggression-and-sundowning", note: "Supports reversible-cause assessment, calm communication, daylight and structured routines, safety planning, and caregiver support for late-day confusion." },
    { id: "aba-burn", label: "American Burn Association, Burn Patient Referral Guidelines", url: "https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral", note: "Supports separate tiers for immediate consultation with consideration for transfer versus consultation recommendation, based on burn depth, size, mechanism, location, pain, comorbidity, trauma, and pediatric needs." },
    { id: "aba-burn-first-aid", label: "American Burn Association, Burn First Aid", url: "https://www.ameriburn.org/patients/burn-first-aid", note: "Supports stopping the burning process, cooling a minor thermal burn with cool running water rather than ice, removing nonadherent jewelry or clothing, loose clean coverage, pain care, and first-aid escalation." },
    { id: "aha-syncope", label: "ACC/AHA/HRS Guideline for Evaluation and Management of Syncope", url: "https://professional.heart.org/en/science-news/2017-acc-aha-hrs-guideline-for-the-evaluation-and-management-of-patients-with-syncope/top-things-to-know", note: "Supports history, orthostatic assessment, ECG, risk-directed testing and monitoring, injury prevention, and hospital evaluation for serious associated conditions." },
    { id: "acr-gca", label: "American College of Rheumatology, Giant Cell Arteritis", url: "https://rheumatology.org/patients/giant-cell-arteritis", note: "Supports immediate treatment to prevent vision loss, cranial and vascular symptom assessment, diagnostic testing, relapse monitoring, and glucocorticoid-toxicity prevention." },
    { id: "ata-nodules", label: "American Thyroid Association, Thyroid Nodules", url: "https://www.thyroid.org/thyroid-nodules/", note: "Supports TSH testing, ultrasound risk assessment, fine-needle aspiration, serial surveillance, and escalation for compressive or malignant features." },
    { id: "nci-paget-breast", label: "National Cancer Institute, Paget Disease of the Breast", url: "https://www.cancer.gov/types/breast/breast-cancer-types/paget-disease-breast", note: "Supports disambiguation of mammary Paget disease as a cancer involving the nipple and usually the areola, with breast examination, imaging, and biopsy for persistent suspicious changes." },
    { id: "nhs-tn", label: "NHS, Trigeminal Neuralgia Treatment", url: "https://www.nhs.uk/conditions/trigeminal-neuralgia/treatment/", note: "Supports carbamazepine-based therapy, slow titration and withdrawal, adverse-effect monitoring, specialist options, and urgent response to serious rash or neurologic change." },
    { id: "aaaai-urticaria", label: "AAAAI, Skin Allergy: Urticaria and Angioedema", url: "https://www.aaaai.org/conditions-treatments/allergies/skin-allergy", note: "Supports lesion and trigger assessment, second-generation antihistamine care, distinction from angioedema and anaphylaxis, and specialist review for chronic or refractory urticaria." }
  ];

  function card(name, sourceIds, nursingPriorities, redFlags, patientEducation) {
    return { name, sourceIds, nursingPriorities, redFlags, patientEducation };
  }

  const patches = [
    card("Maple syrup urine disease", ["msud-genereviews"], [
      "Assess alertness, tone, feeding, vomiting, gait, speech, seizure activity, and the presence of a sweet odor, and trend plasma leucine, alloisoleucine, glucose, electrolytes, acid-base status, and osmolality because rising branched-chain amino acids can produce cerebral edema and encephalopathy before routine vital signs become abnormal.",
      "At the first fever, poor intake, surgery, or other catabolic stress, activate the patient's written metabolic emergency plan and provide prescribed high-calorie dextrose and lipid while temporarily adjusting natural protein only with the metabolic team because stopping catabolism limits release of leucine from the body's own tissue.",
      "Measure intake, emesis, urine output, daily weight, amino-acid results, and neurologic status at the ordered short interval while replacing valine, isoleucine, fluids, and electrolytes exactly as directed because safe leucine removal requires enough substrate for anabolism without causing fluid or osmotic brain injury.",
      "Institute seizure, aspiration, and fall precautions and minimize fasting during procedures because impaired consciousness and loss of motor control can cause secondary injury while even brief calorie deprivation accelerates metabolic decompensation.",
      "Escalate immediately for progressive lethargy, ataxia, dystonia, repeated vomiting, seizure, coma, rapidly rising leucine, or signs of intracranial pressure because urgent intensive care and hemodialysis or hemofiltration may be needed to remove neurotoxic metabolites quickly."
    ], [
      "New lethargy, irritability, ataxia, dystonia, altered speech, seizure, or reduced consciousness",
      "Repeated vomiting, refusal of calories, dehydration, or any illness causing catabolism",
      "Rapidly rising plasma leucine, worsening acidosis, or dangerous changes in glucose, sodium, or osmolality.",
      "Bradycardia, hypertension, abnormal pupils, posturing, or respiratory change suggesting cerebral edema"
    ], [
      "Use the metabolic center's sick-day plan at the first sign of fever, vomiting, or poor intake and never improvise a prolonged protein fast because calories and precisely balanced amino acids are needed to stop catabolism safely.",
      "Carry the emergency letter, formula, medication list, and metabolic-team number at all times, and seek emergency care for behavior change, unsteady walking, repeated vomiting, or unusual sleepiness rather than waiting for the maple odor."
    ]),
    card("Marfan syndrome", ["aha-aortic"], [
      "Measure blood pressure in both arms when clinically indicated, heart rate, pulses, new murmur, and chest, back, or abdominal symptoms, and compare current echocardiographic or cross-sectional aortic dimensions with prior studies because expansion rate and indexed diameter predict dissection risk better than appearance alone.",
      "Administer the prescribed beta blocker or angiotensin-receptor blocker and monitor orthostasis, bradycardia, renal function, potassium, and adherence because lowering impulse and wall stress slows aortic-root enlargement only when therapy is tolerated and sustained.",
      "Coordinate scheduled cardiology imaging, ophthalmology review for lens and retinal disease, orthopedic assessment for spine and chest deformity, and genetic counseling for relatives because FBN1-related connective-tissue weakness affects multiple organs and can be silent within families.",
      "Use joint-protective movement and individualized low-to-moderate dynamic activity while avoiding collision sports, heavy isometric lifting, and unsupervised maximal exertion because sudden blood-pressure surges increase stress on a vulnerable aorta and unstable joints.",
      "Escalate as an aortic emergency for abrupt tearing chest, back, neck, or abdominal pain, pulse or blood-pressure asymmetry, syncope, focal neurologic change, or shock because dissection can interrupt coronary, cerebral, renal, or limb blood flow within minutes."
    ], [
      "Sudden severe tearing chest, back, neck, or abdominal pain",
      "Syncope, new neurologic deficit, unequal pulses, or marked arm blood-pressure difference",
      "Hypotension, cool mottled skin, oliguria, or other shock findings",
      "New severe aortic regurgitation, rapidly enlarging aorta, or acute heart-failure symptoms"
    ], [
      "Keep every aortic imaging appointment and record home blood pressure because feeling well does not show whether the aortic root is enlarging.",
      "Discuss pregnancy and major exercise plans with the aortic team before starting them, tell first-degree relatives about screening, and call emergency services for sudden severe torso pain rather than driving yourself."
    ]),
    card("Neuroblastoma", ["nci-neuroblastoma"], [
      "Assess abdominal or neck mass, pain, gait, limb strength, bowel and bladder function, periorbital bruising, blood pressure, weight, and respiratory effort because neuroblastoma can compress vessels, airways, kidneys, or the spinal cord and can secrete catecholamines.",
      "Trend complete blood count, renal and hepatic function, electrolytes, urine catecholamine metabolites, tumor measurements, marrow findings, and treatment response because marrow disease and intensive multimodal therapy can cause anemia, infection, bleeding, organ injury, and tumor lysis.",
      "Protect central access and administer chemotherapy, immunotherapy, isotretinoin, stem-cell support, analgesia, antiemetics, and hydration under the pediatric-oncology protocol while checking each regimen's specific toxicity because high-risk therapy has narrow safety margins and cumulative late effects.",
      "Monitor temperature, pain, stool and urine output, mucositis, nutrition, hearing, neuropathic symptoms, and skin during therapy because infection, bowel or urinary obstruction, platinum ototoxicity, nerve injury, and malnutrition are preventable or more treatable when detected early.",
      "Escalate immediately for new weakness or urinary retention, airway compromise, severe hypertension, febrile neutropenia, uncontrolled pain, bleeding, or rapidly enlarging abdomen with respiratory compromise because cord compression, catecholamine crisis, sepsis, hemorrhage, or organ-threatening tumor bulk needs time-critical treatment."
    ], [
      "New leg weakness, gait loss, saddle symptoms, urinary retention, or bowel dysfunction",
      "Fever with neutropenia, hypotension, rigors, or toxic appearance",
      "Severe hypertension, headache, diaphoresis, tachycardia, or seizure",
      "Rapid abdominal enlargement, breathing difficulty, oliguria, uncontrolled pain, or major bleeding"
    ], [
      "Call the oncology emergency number for any fever at the threshold in the written plan and do not give rectal medicines or take a rectal temperature during neutropenia because damaged mucosa can introduce infection.",
      "Keep hearing, kidney, growth, thyroid, fertility, cardiac, and developmental follow-up after treatment because important late effects can appear years after the tumor is controlled."
    ]),
    card("Paget disease of bone", ["endocrine-paget"], [
      "Assess focal bone pain, warmth, deformity, head size, hearing, gait, joint function, and neurologic symptoms, and trend total alkaline phosphatase with liver tests or a bone-specific marker because biochemical activity and anatomic site help distinguish active pagetic remodeling from unrelated pain.",
      "Coordinate targeted radiographs and a radionuclide bone scan when ordered because radiographs establish the characteristic lesion while the scan maps the full skeletal extent and identifies sites at risk for fracture or compression.",
      "Before intravenous zoledronate or another bisphosphonate, verify calcium, 25-hydroxyvitamin D, creatinine or estimated GFR, hydration, dental status, and contraindications because correcting deficiency and renal risk reduces hypocalcemia and medication-related harm.",
      "Use fall precautions, appropriate mobility aids, hearing support, and orthopedic or neurologic review for weight-bearing deformity or spinal involvement because disorganized enlarged bone can cause secondary osteoarthritis, pathologic fracture, stenosis, and nerve compression.",
      "Escalate for sudden focal bone pain or inability to bear weight, new weakness or bowel and bladder dysfunction, rapidly enlarging painful bone, new hearing loss, or high-output heart-failure findings because fracture, spinal compression, sarcomatous transformation, or extensive hypervascular disease requires urgent evaluation."
    ], [
      "Sudden severe focal pain, deformity, or inability to bear weight suggesting pathologic fracture",
      "New limb weakness, numbness, gait collapse, or bowel or bladder dysfunction",
      "Rapidly enlarging painful mass or abrupt unexplained rise in alkaline phosphatase",
      "New hearing loss, cranial-nerve deficit, dyspnea, edema, or high-output heart-failure findings"
    ], [
      "Take prescribed calcium and vitamin D as directed around bisphosphonate treatment, maintain hydration, and report jaw symptoms or planned invasive dental work because bone and mineral safety must be coordinated.",
      "Keep alkaline-phosphatase and hearing or imaging follow-up even when pain improves because symptoms can come from arthritis while pagetic bone activity changes silently."
    ]),
    card("Pernicious anemia", ["nice-b12"], [
      "Assess fatigue, pallor, glossitis, paresthesias, vibration and position sense, gait, cognition, mood, and bowel symptoms, and trend complete blood count, mean cell volume, reticulocytes, vitamin B12, folate, and relevant metabolic markers because autoimmune-gastritis B12 deficiency can damage nerves even without marked macrocytic anemia.",
      "Give intramuscular vitamin B12 on the loading and maintenance schedule without delaying for confirmatory results when neurologic impairment is suspected because prolonged cobalamin deficiency can make spinal-cord and peripheral-nerve injury irreversible.",
      "Monitor potassium, reticulocyte response, hemoglobin, symptoms, and neurologic recovery after replacement because brisk marrow production can expose electrolyte shifts and failure to respond suggests another deficiency, diagnosis, or ongoing blood loss.",
      "Review metformin, acid-suppressing therapy, diet, prior gastric or ileal surgery, celiac disease, and autoimmune history and coordinate evaluation for autoimmune gastritis because identifying irreversible malabsorption determines whether lifelong injections are needed and reveals associated thyroid or gastric risk.",
      "Escalate for new weakness, falls, ataxia, confusion, chest pain, syncope, heart failure, or absent hematologic improvement because progressive myelopathy or severe anemia requires urgent assessment rather than routine follow-up."
    ], [
      "New or progressive weakness, ataxia, loss of position sense, falls, or bowel or bladder change",
      "Confusion, severe cognitive change, psychosis, or reduced consciousness",
      "Chest pain, syncope, resting dyspnea, marked tachycardia, or heart-failure findings",
      "Hemoglobin or neurologic findings that worsen or fail to improve after appropriate replacement"
    ], [
      "Do not stop maintenance vitamin B12 when the blood count becomes normal because autoimmune gastritis prevents reliable absorption and neurologic injury can recur before anemia is obvious.",
      "Report new tingling, balance trouble, memory change, or weakness promptly, and keep follow-up for associated autoimmune disease and gastric symptoms because replacement treats the deficiency but not its underlying cause."
    ]),
    card("Prostate cancer", ["nci-prostate"], [
      "Assess urinary stream, retention, hematuria, pelvic or bone pain, leg weakness, bowel and bladder control, weight, functional status, and distress, and trend PSA in the context of treatment and testosterone when relevant because progression may appear as obstruction, skeletal disease, or biochemical change.",
      "Clarify whether the plan is active surveillance, surgery, radiation, androgen-deprivation therapy, or systemic treatment and track the required PSA, imaging, examination, and biopsy schedule because surveillance preserves curative options only when progression checks occur reliably.",
      "After prostate surgery or radiation, monitor urine output, catheter patency, bleeding, infection, continence, bowel symptoms, erectile function, and wound or radiation effects because early management reduces retention, clot obstruction, infection, and lasting functional harm.",
      "During androgen deprivation or other systemic therapy, monitor hot flashes, mood, falls, blood pressure, glucose, lipids, bone density, calcium and vitamin D plan, and treatment-specific laboratory results because lowering androgen signaling affects bone, muscle, metabolic, and cardiovascular health.",
      "Escalate for acute urinary retention, heavy hematuria with clots, fever after instrumentation, new severe back pain with weakness or saddle anesthesia, pathologic fracture, or treatment-related chest pain or dyspnea because obstruction, sepsis, cord compression, skeletal event, or cardiopulmonary toxicity may be time-critical."
    ], [
      "New severe back pain with leg weakness, saddle numbness, or bowel or bladder dysfunction",
      "Inability to void, painful bladder distention, or hematuria with obstructing clots",
      "Fever, rigors, hypotension, or confusion after biopsy, catheterization, or treatment",
      "Sudden inability to bear weight, suspected pathologic fracture, chest pain, or acute dyspnea"
    ], [
      "Know whether your follow-up is active surveillance or symptom-focused watchful waiting and keep every PSA, imaging, and biopsy appointment because these strategies have different goals and missing checks can lose a treatment window.",
      "Report urinary obstruction, new persistent bone or back pain, leg weakness, or loss of bowel or bladder control promptly, and ask early about continence, sexual, fertility, bone, and metabolic support rather than waiting for symptoms to become severe."
    ]),
    card("Psoriasis", ["aad-psoriasis"], [
      "Document body-surface involvement, plaque thickness, scalp, nail, palm, sole, genital and fold disease, itch, pain, sleep, and quality-of-life effect because limited visible area can still produce severe functional or psychosocial burden.",
      "Ask about morning stiffness, swollen digits, tendon pain, back stiffness, eye inflammation, weight, blood pressure, smoking, mood, and inflammatory-bowel symptoms because psoriasis is a systemic inflammatory disease linked to psoriatic arthritis, cardiometabolic disease, depression, and other immune conditions.",
      "Teach and observe correct use of emollients, topical corticosteroids, vitamin-D analogues, or other prescribed agents, including site, amount, duration, and steroid-free intervals because efficacy depends on reaching affected skin while excessive potency or duration causes atrophy and systemic absorption.",
      "Before and during phototherapy, biologic, methotrexate, cyclosporine, or retinoid treatment, complete the ordered infection, pregnancy, liver, kidney, blood-count, blood-pressure, and skin-cancer checks because systemic immune and keratinocyte therapies have distinct preventable toxicities.",
      "Escalate for widespread painful erythema, pustules with fever, rapidly spreading infection, new hot swollen joint, severe medication reaction, or suicidal thinking because erythrodermic or pustular psoriasis, sepsis, joint damage, and treatment toxicity require urgent care."
    ], [
      "Generalized redness, skin pain, peeling, temperature instability, or fluid-loss findings",
      "Widespread pustules with fever, malaise, tachycardia, or hypotension",
      "Hot swollen joint, new dactylitis, marked morning stiffness, or sudden functional loss",
      "Spreading skin infection, severe drug rash, jaundice, cytopenia symptoms, or suicidal thinking"
    ], [
      "Use the prescribed amount on the prescribed body site and keep a simple flare record because face, folds, scalp, and thick plaques need different strengths and treatment schedules.",
      "Do not stop a systemic medicine or use an oral steroid without the psoriasis team, and report joint symptoms early because abrupt changes can trigger severe rebound and untreated psoriatic arthritis can permanently damage joints."
    ]),
    card("Sarcoidosis", ["ats-sarcoid"], [
      "Assess cough, dyspnea, exertional saturation, chest discomfort, fatigue, skin and joint findings, visual symptoms, palpitations, syncope, weakness, and neuropathy because granulomas can affect lungs, eyes, heart, nervous system, skin, and other organs independently.",
      "Trend pulmonary function, oxygen need, chest imaging, calcium, creatinine, liver tests, blood count, ECG, and organ-specific results ordered by the team because disease activity and treatment toxicity may be silent until measurable function declines.",
      "Arrange baseline and symptom-triggered ophthalmic, cardiac, renal, neurologic, and dermatologic assessment because ocular inflammation, conduction disease, hypercalcemia, and neurosarcoidosis can cause irreversible injury despite mild respiratory symptoms.",
      "When corticosteroids or steroid-sparing therapy are used, monitor glucose, blood pressure, mood, infection, bone protection, blood counts, liver and kidney function, and adherence because controlling granulomatous inflammation must be balanced against immunosuppressive harm.",
      "Escalate for syncope, sustained palpitations, chest pain, new conduction abnormality, acute vision change, focal neurologic deficit, severe hypercalcemia symptoms, or rapidly worsening hypoxemia because cardiac, ocular, neurologic, or metabolic sarcoidosis can threaten life or permanent function."
    ], [
      "Syncope, sustained palpitations, new heart block, chest pain, or ventricular dysrhythmia",
      "Sudden blurred vision, eye pain, photophobia, floaters, or visual-field loss",
      "New focal weakness, seizure, severe headache, confusion, or cranial-nerve change",
      "Rapidly worsening dyspnea or hypoxemia, oliguria, severe vomiting, dehydration, or marked hypercalcemia"
    ], [
      "Keep eye and cardiac evaluations even when breathing is stable because sarcoidosis can injure these organs without parallel lung symptoms.",
      "Do not add calcium or high-dose vitamin D unless the sarcoidosis team approves it because granulomas can activate vitamin D and raise calcium enough to injure the kidneys."
    ]),
    card("Scoliosis", ["srs-scoliosis"], [
      "Measure standing posture, shoulder and waist symmetry, rib prominence, pain, neurologic function, respiratory symptoms, growth velocity, skeletal maturity, and serial Cobb angle because progression risk depends on both curve magnitude and remaining growth.",
      "Verify brace type, prescribed wear time, skin fit, pressure areas, breathing, sleep, school participation, and actual use data when available because bracing limits progression through consistent corrective force rather than occasional wear.",
      "Encourage individualized core strength, flexibility, aerobic activity, and physical-therapy goals while monitoring pain and function because movement preserves conditioning and body confidence even though exercise alone does not reliably correct a structural curve.",
      "Screen for rapid curve change, atypical severe or night pain, weakness, sensory loss, bowel or bladder symptoms, and left thoracic or early-onset patterns because these features can signal neural-axis, tumor, infection, or other non-idiopathic disease.",
      "Escalate for documented rapid progression, curve exceeding the conservative treatment plan, respiratory compromise, progressive neurologic deficit, or intolerable brace injury because timely orthopedic review can prevent loss of an effective bracing or surgical window."
    ], [
      "New weakness, sensory level, gait change, or bowel or bladder dysfunction",
      "Severe constant or night pain, fever, weight loss, or focal spinal tenderness",
      "Rapid increase in measured Cobb angle or visible deformity during growth",
      "Dyspnea, reduced exercise tolerance, skin breakdown from a brace, or uncontrolled pain"
    ], [
      "Wear the brace for the prescribed hours and report pressure injury or poor fit instead of quietly shortening wear time because the orthotist can adjust fit but cannot recover missed growth-period treatment.",
      "Keep scheduled standing radiographs and growth checks because curve progression is often painless, and seek prompt review for weakness, bladder change, severe night pain, or breathing difficulty."
    ]),
    card("Slipped capital femoral epiphysis", ["aaos-scfe"], [
      "Treat an adolescent with hip, groin, thigh, or unexplained knee pain plus limp or externally rotated leg as possible SCFE, assess both hips and neurovascular status, and stop weight bearing immediately because walking on an unstable growth plate can worsen displacement and blood-supply injury.",
      "Place the child on a stretcher or wheelchair, maintain comfortable alignment, give prescribed analgesia, and avoid forceful range-of-motion testing or reduction because manipulation can further shear the epiphysis and compromise femoral-head perfusion.",
      "Coordinate urgent orthopedic evaluation and bilateral hip imaging while documenting symptom duration, weight, growth, endocrine history, and ability to bear weight because stability and associated endocrine disease change operative urgency and contralateral risk.",
      "After in-situ fixation, check pain, pulses, color, temperature, sensation, movement, wound, fever, and ordered weight-bearing limits, and begin safe mobility training because early detection of infection or neurovascular change and strict load protection support healing.",
      "Escalate for sudden increase in pain, inability to bear weight, shortening or rotation, cool or numb foot, fever or drainage, or persistent worsening pain and stiffness because unstable slip, vascular injury, infection, avascular necrosis, or chondrolysis can destroy the hip."
    ], [
      "Sudden severe hip, groin, thigh, or knee pain with inability to bear weight",
      "Externally rotated or shortened leg, rapidly worsening limp, or pain after a minor fall",
      "Cool pale foot, absent pulse, increasing numbness, or severe pain out of proportion",
      "Postoperative fever, drainage, escalating pain, progressive stiffness, or loss of hip motion"
    ], [
      "Do not let the child walk to the car, clinic, or radiology once SCFE is suspected because every loaded step can increase the slip; use emergency transport or a wheelchair as directed.",
      "Follow the exact postoperative weight-bearing plan and report pain in either hip or knee because the opposite hip can also slip and early treatment protects long-term joint function."
    ]),
    card("Thalassemia", ["cdc-thal"], [
      "Assess fatigue, pallor, jaundice, dyspnea, growth, pubertal development, spleen size, bone pain, and heart-failure symptoms, and trend hemoglobin against the individual's pretransfusion target because chronic ineffective erythropoiesis and anemia impair oxygen delivery, growth, bone integrity, and organ function.",
      "Before every red-cell transfusion, verify extended antigen matching, antibody history, product, dose, baseline vital signs, and consent, then monitor closely for fever, chills, dyspnea, flank pain, hypotension, or dark urine because repeated exposure increases alloimmunization and acute or delayed hemolytic-reaction risk.",
      "Trend ferritin as a trajectory and complete ordered liver and cardiac iron imaging, endocrine tests, glucose, liver function, and bone assessment because transfusional iron accumulates in the heart, liver, pituitary, pancreas, and other organs even when the patient feels well.",
      "Administer chelation on the prescribed schedule and monitor blood count, creatinine, urine protein, liver tests, hearing, vision, and adherence according to the specific chelator because removing iron prevents organ failure but each agent can cause distinct renal, hepatic, sensory, or marrow toxicity.",
      "Escalate for a transfusion reaction, fever after splenectomy, chest pain, dysrhythmia, syncope, new edema, rapidly enlarging spleen with shock, or severe anemia symptoms because hemolysis, overwhelming infection, cardiac iron injury, sequestration, or inadequate transfusion may become life-threatening."
    ], [
      "Fever, chills, wheeze, flank pain, hypotension, or dark urine during or after transfusion",
      "Fever or toxic appearance in a person without a functioning spleen",
      "Chest pain, palpitations, syncope, edema, or new heart-failure findings",
      "Rapid spleen enlargement, acute pallor, severe weakness, dyspnea at rest, or hemodynamic instability"
    ], [
      "Keep transfusion and chelation appointments even when energy is good because transfusions prevent chronic anemia while chelation prevents the iron that those transfusions unavoidably add.",
      "Do not take iron supplements unless the thalassemia team confirms iron deficiency, carry the antibody and transfusion record, and seek urgent care for fever if you have had a splenectomy."
    ]),
    card("Thyroid cancer", ["nci-thyroid"], [
      "Assess neck mass, swallowing, voice, breathing, cervical nodes, pain, thyroid function, and type-specific markers such as thyroglobulin or calcitonin when ordered because papillary, follicular, medullary, and anaplastic cancers differ in spread, treatment, and urgency.",
      "After thyroid surgery, keep emergency airway equipment available and monitor stridor, neck swelling, drain output, voice, oxygenation, calcium, tingling, cramps, and carpal or facial spasm because a compressive hematoma or hypocalcemia from parathyroid injury can progress rapidly.",
      "Administer levothyroxine at the prescribed replacement or TSH-suppressive dose and trend TSH, free T4, pulse, bone risk, and cardiac symptoms because adequate hormone prevents hypothyroidism while excessive suppression can cause dysrhythmia and bone loss.",
      "For radioactive iodine, verify pregnancy and lactation status, preparation method, radiation-safety teaching, hydration, and salivary and marrow precautions because iodine concentrates in thyroid tissue but also exposes other tissues and body fluids to radiation.",
      "Escalate for stridor, rapidly expanding neck swelling, severe hypocalcemic symptoms, new vocal-cord dysfunction with aspiration, rapidly enlarging hard mass, hemoptysis, or new focal bone or neurologic pain because airway compromise, metabolic instability, invasive disease, or metastasis needs urgent treatment."
    ], [
      "Stridor, respiratory distress, rapidly enlarging neck swelling, or tracheal deviation",
      "Perioral tingling, carpopedal spasm, tetany, seizure, or prolonged QT from hypocalcemia",
      "New aspiration, severe hoarseness, inability to swallow secretions, or hemoptysis",
      "Rapid tumor growth, severe focal bone pain, weakness, or another new metastatic symptom"
    ], [
      "Take levothyroxine consistently in the manner prescribed and separate it from interfering calcium or iron when directed because stable absorption makes TSH suppression and recurrence monitoring interpretable.",
      "Keep neck ultrasound and tumor-marker follow-up even after successful surgery, and seek emergency care for postoperative breathing difficulty or neck swelling rather than waiting for the next visit."
    ]),
    card("Turner syndrome", ["turner-guideline"], [
      "Measure blood pressure with the correct cuff, pulses, cardiac symptoms, and interval aortic imaging results, and coordinate ambulatory blood-pressure monitoring when indicated because hypertension, bicuspid valve, coarctation, and aortic dilation can remain silent until dissection risk rises.",
      "Track height, growth velocity, weight, pubertal development, bone age, thyroid function, glucose, lipids, liver tests, and celiac screening on the age-specific plan because growth failure, ovarian insufficiency, autoimmunity, and cardiometabolic disease require treatment before complications become fixed.",
      "Administer growth hormone and estrogen replacement exactly as prescribed while monitoring growth response, headaches, edema, glucose, uterine development, and later bone health because staged hormone care supports adult height, puberty, cardiovascular health, and bone mineralization.",
      "Arrange hearing, vision, dental, renal, and neurodevelopmental surveillance and provide school or executive-function supports when needed because recurrent otitis, progressive sensorineural loss, renal anomalies, and visuospatial difficulties can impair safety and learning without changing general intelligence.",
      "Escalate for sudden chest, back, or abdominal pain, syncope, neurologic deficit, severe hypertension, new exertional dyspnea, or pregnancy with cardiac symptoms because aortic dissection and cardiovascular decompensation are uncommon but disproportionately dangerous in Turner syndrome."
    ], [
      "Sudden severe chest, back, neck, or abdominal pain",
      "Syncope, pulse asymmetry, new neurologic deficit, or signs of shock",
      "Severe hypertension, new murmur, acute dyspnea, or heart-failure findings",
      "Pregnancy-associated chest pain, severe headache, hypertension, or cardiovascular symptoms"
    ], [
      "Keep lifelong cardiology and blood-pressure follow-up even when a childhood echocardiogram was normal because aortic enlargement and hypertension can develop later.",
      "Discuss fertility and pregnancy with a Turner-experienced cardiovascular and reproductive team before conception because cardiac imaging may show that pregnancy carries unacceptable aortic risk."
    ]),
    card("Vesicoureteral reflux", ["aua-vur"], [
      "Assess every fever for urinary symptoms, hydration, flank or abdominal pain, vomiting, urine output, and prior culture and resistance history, and obtain the ordered urine culture before antibiotics when this will not delay care because reflux permits a lower urinary infection to reach the kidney and scar it.",
      "Give prescribed treatment or prophylactic antibiotic at the weight-based dose and interval and review missed doses and culture results because sustained appropriate exposure reduces recurrent febrile UTI while unnecessary or mismatched therapy promotes resistance.",
      "Track blood pressure, height, weight, urinalysis for protein, creatinine when indicated, renal ultrasound, and reflux follow-up because renal scarring can present later as impaired growth, proteinuria, hypertension, or reduced kidney function.",
      "Assess constipation, stool withholding, daytime wetting, urgency, infrequent voiding, and postvoid residual concerns and implement timed voiding and bowel therapy because bladder and bowel dysfunction raises residual pressure and recurrent-UTI risk.",
      "Escalate for fever with flank pain or vomiting, sepsis findings, reduced urine, rising creatinine, breakthrough febrile UTI on prophylaxis, new hypertension or proteinuria, or poor renal growth because pyelonephritis and reflux nephropathy may require intravenous therapy or surgical reassessment."
    ], [
      "Fever with flank or abdominal pain, vomiting, lethargy, or toxic appearance",
      "Hypotension, delayed capillary refill, oliguria, or other urosepsis findings",
      "Breakthrough febrile UTI despite prophylaxis or infection with a resistant organism",
      "New hypertension, proteinuria, rising creatinine, or asymmetric or poor renal growth"
    ], [
      "Use the urine-collection and fever plan at the start of illness because prompt culture-guided treatment lowers the chance that pyelonephritis will scar the kidney.",
      "Give prophylaxis exactly as prescribed and support regular soft stools and timed voiding because constipation and urine holding can defeat an otherwise effective reflux plan."
    ]),
    card("Chronic rejection", ["kdigo-transplant", "ishlt-heart-transplant", "ishlt-clad", "aasld-liver-transplant"], [
      "Identify the transplanted organ and personal baseline, then use its surveillance pattern: kidney creatinine or eGFR, urine protein, and output; liver enzymes, alkaline phosphatase, and bilirubin with imaging and biopsy for unexplained abnormalities; lung serial FEV1 or spirometry with infection and mechanical causes excluded before chronic lung allograft dysfunction is assigned; and heart symptoms, ECG and echocardiography, donor-specific antibodies, center-scheduled biopsy, and cardiac-allograft-vasculopathy testing because chronic allograft injury presents differently by organ and can be clinically silent.",
      "Reconcile every immunosuppressant dose, timing, access barrier, drug level, interacting medicine, supplement, vomiting episode, and missed dose because underexposure promotes alloimmune injury while overexposure can mimic graft dysfunction through toxicity or infection.",
      "Assess temperature, blood pressure, weight, edema, pain over the graft, infection symptoms, skin lesions, and malignancy warning signs and obtain ordered viral and immune testing because infection, drug toxicity, recurrent disease, obstruction, and cancer can coexist with or resemble rejection.",
      "Prepare for imaging and graft biopsy when function declines without a reversible cause, and protect the biopsy site while monitoring bleeding and organ function because histology distinguishes chronic antibody- or cell-mediated rejection from treatable alternatives.",
      "Escalate for abrupt graft-function change, oliguria, jaundice, falling oxygen or spirometry, chest pain or heart failure, severe hypertension, fever with immunosuppression, or inability to keep medicines down because acute-on-chronic rejection, infection, vascular compromise, or missed immunosuppression may rapidly threaten the graft and patient."
    ], [
      "Abrupt decline in graft-specific function or a marked change from the recipient's baseline",
      "Fever, hypotension, confusion, or focal infection while immunosuppressed",
      "Oliguria, severe hypertension, jaundice, hypoxemia, falling spirometry, or heart-failure findings",
      "Repeated vomiting, loss of medication supply, or missed immunosuppressant doses"
    ], [
      "Take immunosuppressants at the same times every day and call the transplant team before starting, stopping, or changing any medicine or supplement because interactions can change exposure enough to injure the graft.",
      "Report small baseline changes early and keep laboratory, biopsy, infection-prevention, cancer-screening, and skin-check appointments because chronic rejection and immunosuppression complications may be silent at first."
    ]),
    card("Conn syndrome", ["endocrine-pa"], [
      "Measure seated and orthostatic blood pressure, heart rhythm, weakness, cramps, thirst, and urine output, and trend potassium, bicarbonate, magnesium, creatinine, aldosterone, and renin because an aldosterone-producing adrenal adenoma causes sodium retention, suppressed renin, potassium loss, and excess cardiovascular risk.",
      "Review antihypertensives, diuretics, licorice, supplements, sodium intake, and sample conditions before aldosterone-renin testing because hypokalemia and interfering drugs can produce misleading results and inappropriate subtype decisions.",
      "Prepare the patient for adrenal imaging and adrenal-vein sampling when ordered and verify laterality rather than assuming a visible nodule is the source because nonfunctioning adrenal nodules are common and surgery helps only lateralizing aldosterone excess.",
      "Before and after unilateral adrenalectomy, monitor blood pressure, potassium, sodium, glucose, creatinine, fluid balance, pain, bleeding, and signs of adrenal insufficiency because removing the source reverses mineralocorticoid excess but postoperative hypotension, hyperkalemia, or cortisol deficiency may occur.",
      "Escalate for severe hypertension with neurologic or cardiac symptoms, potassium-related weakness or dysrhythmia, postoperative shock, persistent vomiting, severe hyperkalemia, or acute kidney decline because hypertensive emergency, electrical instability, hemorrhage, or adrenal insufficiency needs immediate treatment."
    ], [
      "Blood pressure with chest pain, acute dyspnea, neurologic deficit, seizure, or confusion",
      "Marked weakness, paralysis, palpitations, ECG change, or severe potassium abnormality",
      "Post-adrenalectomy hypotension, severe abdominal or flank pain, falling hemoglobin, or shock",
      "Persistent vomiting, hyponatremia, hyperkalemia, hypoglycemia, or acute kidney decline"
    ], [
      "Do not stop blood-pressure or potassium medicines before testing unless the endocrine team gives a safe substitution plan because some drugs distort results but abrupt withdrawal can be dangerous.",
      "Continue home blood-pressure checks and postoperative potassium and kidney testing even after successful adrenalectomy because medicines often need rapid adjustment as aldosterone excess resolves."
    ]),
    card("Diabetic neuropathy", ["ada-2026"], [
      "Assess burning, numbness, allodynia, weakness, balance, sleep, orthostatic symptoms, bowel and bladder function, and sexual function, and test protective sensation with a 10-g monofilament plus vibration or another neurologic modality because diabetic neuropathy can involve sensory, motor, and autonomic fibers before the patient notices injury.",
      "Inspect skin, nails, between toes, temperature, callus, deformity, footwear, pulses, capillary refill, ulcer depth, drainage, and infection at each risk-appropriate visit because loss of pain and impaired perfusion allow small pressure injuries to progress unnoticed to ulcer and amputation.",
      "Trend glucose and A1C against individualized goals, blood pressure, lipids, kidney function, vitamin B12 when metformin or other risk is present, and alcohol or medication exposures because glycemic and vascular control slow progression while reversible causes can compound nerve injury.",
      "Administer prescribed neuropathic-pain therapy and monitor pain function, sedation, falls, mood, suicidality, edema, and renal dose needs because relief should improve sleep and activity without adding injury from central or medication effects.",
      "Escalate for a hot swollen or deformed foot, ulcer with spreading erythema or exposed deep tissue, black or cool tissue, fever, rapidly progressive weakness, syncope, or persistent vomiting because Charcot collapse, infection, ischemia, another neurologic disease, or severe autonomic dysfunction needs urgent care."
    ], [
      "Hot, swollen, red, or newly deformed foot, especially with little pain",
      "Ulcer with spreading redness, purulence, exposed tendon or bone, fever, or systemic illness",
      "Cool pale or black tissue, absent pulses, rest pain, or sudden perfusion change",
      "Rapidly ascending or asymmetric weakness, syncope, severe orthostasis, or persistent vomiting"
    ], [
      "Inspect the tops, soles, heels, and spaces between toes every day, use a mirror or helper, and never walk barefoot because numb feet may not signal a blister, burn, or sharp object.",
      "Use warm rather than hot water, test temperature with an unaffected area, wear fitted shoes, and report any break in the skin promptly because waiting for pain can allow infection to become advanced."
    ]),
    card("Diabetic retinopathy", ["ada-2026"], [
      "Ask about blurred or fluctuating vision, floaters, dark curtain, visual-field loss, pregnancy, kidney disease, and prior retinal treatment, and document visual acuity in each eye because macular edema and vitreous or retinal complications can progress independently and may be painless.",
      "Coordinate dilated retinal examination or validated retinal photography at the diabetes-specific interval and shorten follow-up for existing disease or pregnancy because screening detects treatable microvascular damage before the patient perceives vision loss.",
      "Trend A1C, blood pressure, lipids, kidney status, and smoking and support gradual individualized risk-factor improvement because chronic hyperglycemia and vascular stress drive capillary leakage, ischemia, and neovascularization.",
      "After intravitreal injection, laser, or vitreoretinal surgery, monitor pain, redness, discharge, acuity, pressure symptoms, and positioning instructions because endophthalmitis, pressure rise, hemorrhage, or retinal detachment requires rapid recognition.",
      "Escalate the same day for sudden floaters or flashes, curtain-like shadow, abrupt vision loss, severe eye pain or redness after a procedure, or new visual symptoms in pregnancy because vitreous hemorrhage, retinal detachment, endophthalmitis, or rapidly changing retinopathy can permanently impair sight."
    ], [
      "Sudden shower of floaters, flashing lights, curtain or shadow, or abrupt visual-field loss",
      "Sudden severe reduction in vision or new dense visual haze",
      "Severe eye pain, redness, photophobia, or discharge after injection or surgery",
      "New or rapidly worsening visual symptoms during pregnancy or severe hypertension"
    ], [
      "Keep dilated-eye appointments even when vision is sharp because retinal damage can be advanced before central vision changes.",
      "Call the eye team urgently for flashes, many new floaters, a curtain, sudden blur, or post-procedure pain and redness because early retinal or infection treatment can preserve vision."
    ]),
    card("Dislocation", ["msd-dislocations", "aaos-dislocation"], [
      "Assess deformity, mechanism, open wound, pain, swelling, skin tension, distal pulse, capillary refill, temperature, sensation, and motor function and document findings before intervention because a displaced joint can injure arteries, nerves, skin, and adjacent bone.",
      "Immobilize the joint in the position found, remove constricting jewelry, provide prescribed analgesia, and avoid food or drink if procedural sedation may be needed because unsupported movement can worsen neurovascular injury and reduction often requires anesthesia.",
      "Do not attempt forceful reduction unless trained and authorized, and coordinate pre-reduction imaging when clinically appropriate because an occult fracture or trapped structure changes the safest reduction method.",
      "Repeat and document distal neurovascular findings immediately after reduction and splinting, confirm alignment as ordered, and monitor pain and compartment findings because restored appearance does not prove that perfusion, nerve function, or joint congruity is safe.",
      "Escalate immediately for absent or weakening pulse, cool pale limb, progressive numbness or weakness, open joint, skin tenting, severe pain out of proportion, or recurrent loss of alignment because vascular compromise, nerve entrapment, compartment syndrome, infection, or unstable fracture-dislocation threatens the limb."
    ], [
      "Absent or diminishing distal pulse, cool pale limb, or delayed capillary refill",
      "Progressive numbness, weakness, severe burning pain, or loss of distal movement",
      "Open wound over the joint, threatened skin, or gross contamination",
      "Pain out of proportion, tense swelling, pain with passive stretch, or redislocation"
    ], [
      "Keep the splint or sling on as directed and check fingers or toes for warmth, color, movement, and sensation because swelling can make an initially safe immobilizer compromise circulation.",
      "Do not ask an untrained person to pull the joint back into place, and complete rehabilitation after reduction because damaged stabilizing tissues create stiffness and recurrent-dislocation risk."
    ]),
    card("Folate deficiency", ["nih-folate"], [
      "Assess fatigue, pallor, glossitis, diet, alcohol use, pregnancy, bowel disease, bariatric surgery, and medicines such as methotrexate, trimethoprim, or antiseizure agents, and trend complete blood count, indices, reticulocytes, folate, and vitamin B12 because impaired intake, absorption, demand, or drug antagonism causes megaloblastic anemia through defective DNA synthesis.",
      "Confirm or concurrently address vitamin B12 status before high-dose folic acid unless immediate treatment is otherwise directed because folate can correct the anemia while allowing B12-related neurologic injury to progress unseen.",
      "Give folic or folinic acid in the prescribed form and dose and coordinate the plan with the prescriber of any folate-antagonist medicine because indiscriminate supplementation can reduce intended drug action or fail to rescue the correct pathway.",
      "Trend reticulocyte response, hemoglobin, symptoms, adherence, and the underlying malabsorption, alcohol, dietary, pregnancy, or medication cause because replacement succeeds only if continued losses or increased requirements are corrected.",
      "Escalate for syncope, chest pain, resting dyspnea, hemodynamic instability, severe pancytopenia, pregnancy with significant anemia, or absent response because profound anemia, marrow disease, ongoing loss, B12 deficiency, or another diagnosis may require urgent treatment."
    ], [
      "Syncope, chest pain, resting dyspnea, marked tachycardia, or hemodynamic instability",
      "Fever with neutropenia, unusual bleeding, petechiae, or severe pancytopenia",
      "New numbness, weakness, gait change, or cognitive symptoms suggesting unrecognized B12 deficiency",
      "Falling counts or no reticulocyte and hemoglobin response despite appropriate replacement"
    ], [
      "Take only the prescribed folate dose and tell the clinician about methotrexate, antiseizure drugs, pregnancy plans, alcohol use, and gut surgery because the cause determines the correct form, dose, and duration.",
      "Include folate-rich foods as the care plan allows, but keep follow-up blood tests because diet alone may not overcome malabsorption or a medicine-related deficiency."
    ]),
    card("Herniated disk", ["nice-low-back"], [
      "Assess pain location and onset, dermatomal radiation, cough or strain effect, strength, sensation, reflexes, gait, straight-leg-raise response, and bowel, bladder, and saddle function because a herniated disk can compress a specific nerve root or, rarely, the cauda equina.",
      "Screen for fever, immunosuppression, cancer history, unexplained weight loss, trauma, osteoporosis, night pain, and progressive neurologic loss before treating the problem as uncomplicated radiculopathy because infection, malignancy, fracture, and cord compression require different urgent pathways.",
      "Support short periods of comfortable rest followed by graded walking, position changes, and prescribed physical therapy while avoiding prolonged bed rest because continued safe movement limits deconditioning and usually improves function as nerve-root inflammation settles.",
      "Administer the individualized analgesic plan and monitor sedation, gastrointestinal bleeding, kidney function, constipation, and functional response, and avoid automatic imaging when no red flags are present because medicine harm and incidental scan findings can exceed benefit in uncomplicated disease.",
      "Escalate immediately for urinary retention or overflow, fecal incontinence, saddle anesthesia, bilateral or rapidly progressive weakness, fever with spinal pain, or major trauma because cauda equina syndrome, epidural infection, or unstable injury can cause permanent neurologic loss."
    ], [
      "New urinary retention, overflow incontinence, fecal incontinence, or saddle anesthesia",
      "Bilateral sciatica, progressive foot drop, or rapidly worsening motor weakness",
      "Fever, immunosuppression, injection-drug exposure, or severe constant spinal pain",
      "Major trauma, known cancer, unexplained weight loss, or pain with structural deformity"
    ], [
      "Stay gently active within tolerable limits and change positions often because prolonged bed rest weakens supporting muscles and delays recovery.",
      "Seek emergency care for bladder retention, saddle numbness, bowel-control loss, or new leg weakness because these are nerve-compression warnings, not ordinary fluctuations in sciatica."
    ]),
    card("Hyperaldosteronism", ["endocrine-pa"], [
      "Assess repeated blood pressure, orthostasis, edema or volume status, weakness, cramps, palpitations, thirst, and urine output, and trend potassium, bicarbonate, magnesium, sodium, creatinine, aldosterone, and renin because excess aldosterone retains sodium and wastes potassium, while the renin pattern helps distinguish primary from secondary disease.",
      "Verify morning collection conditions, dietary sodium instructions, potassium correction, and the prescriber's plan for interfering antihypertensives before aldosterone-renin testing because low potassium and medication effects can hide or mimic autonomous aldosterone production.",
      "Coordinate confirmatory testing and adrenal CT or adrenal-vein sampling only when indicated, and assess for heart, kidney, sleep-apnea, and cerebrovascular injury because identifying lateralized primary disease changes treatment from lifelong blockade to possible cure by adrenalectomy.",
      "When a mineralocorticoid-receptor antagonist is used, monitor home and clinic blood pressure, potassium, creatinine or eGFR, renin response, gynecomastia or menstrual effects, and adherence after initiation and each titration because effective blockade lowers cardiovascular risk but can cause hyperkalemia and kidney-function change.",
      "Escalate for hypertensive emergency symptoms, severe hypo- or hyperkalemia, dysrhythmia, paralysis, acute kidney decline, or hypotension after treatment because vascular injury and electrolyte-driven electrical instability require immediate correction."
    ], [
      "Severe blood pressure with chest pain, acute dyspnea, neurologic deficit, seizure, or confusion",
      "Palpitations, syncope, ECG change, marked weakness, or paralysis with potassium abnormality",
      "Rapid creatinine rise, oliguria, or severe hyperkalemia after mineralocorticoid blockade",
      "Symptomatic hypotension, dehydration, or inability to take prescribed therapy safely"
    ], [
      "Record blood pressure and take the aldosterone-specific medicine consistently because normal potassium alone does not mean the excess cardiovascular risk is controlled.",
      "Do not use potassium supplements, salt substitutes, licorice products, or NSAIDs without review because they can alter blood pressure, potassium, kidney function, or medication response."
    ]),
    card("Hyperparathyroidism", ["nice-hyperpara", "kdigo-ckd-mbd", "niddk-ckd-mbd"], [
      "Classify the mechanism before applying treatment: primary disease begins in one or more parathyroid glands and often produces hypercalcemia; secondary disease is an adaptive PTH rise, commonly from CKD-related phosphate retention and impaired calcitriol or from vitamin D deficiency; and tertiary disease is autonomous secretion after prolonged secondary stimulation and can again cause hypercalcemia because the same elevated PTH value represents different physiology and treatment.",
      "Assess fatigue, cognition, constipation, nausea, thirst, polyuria, weakness, bone pain, fracture, and renal-colic symptoms and interpret serial calcium, phosphate, PTH, alkaline phosphatase, 25-hydroxyvitamin D, and kidney or dialysis measures together because trends, not one PTH result, guide safe use of phosphate control, vitamin D agents, calcimimetics, dialysis, or surgery and reveal hypercalcemic complications.",
      "In primary disease, coordinate urine calcium, renal imaging, and bone-density testing; in CKD-related secondary or tertiary disease, review phosphate intake and binders, dialysis completion, vascular-calcification risk, and cause-specific medicines because stones and cortical bone loss dominate some patterns while high-turnover bone and mineral-related vascular injury dominate others.",
      "Before and after parathyroid surgery, monitor airway and neck swelling, voice, calcium, magnesium, phosphate, perioral tingling, cramps, and tetany because rapid withdrawal of PTH can cause hypocalcemia or hungry-bone mineral uptake.",
      "Escalate for confusion, severe dehydration, repeated vomiting, shortened QT or dysrhythmia, acute kidney injury, pathologic fracture, or postoperative stridor or tetany because hypercalcemic crisis, skeletal injury, hematoma, or severe hypocalcemia can be life-threatening."
    ], [
      "Confusion, reduced consciousness, severe weakness, or repeated vomiting with marked hypercalcemia",
      "Dysrhythmia, syncope, shortened QT, severe hypertension, or hemodynamic instability",
      "Oliguria, rising creatinine, severe flank pain, or obstructing renal stone",
      "Postoperative stridor, neck swelling, perioral tingling, carpopedal spasm, or seizure"
    ], [
      "Follow the cause-specific plan: hydration and endocrine monitoring for primary disease differ from phosphate, dialysis, vitamin D, or calcimimetic management in CKD-related secondary or tertiary disease because a calcium or vitamin D product that helps one pattern can worsen another.",
      "Keep prescribed calcium, phosphate, PTH, kidney, and bone follow-up even if surgery is not planned because silent stones, bone loss, high-turnover bone disease, and vascular mineral injury can change the treatment decision."
    ]),
    card("Iron deficiency", ["aga-iron"], [
      "Assess fatigue, exercise intolerance, pica, restless legs, hair or nail change, diet, menstrual and gastrointestinal loss, pregnancy, donation, surgery, and malabsorption history, and trend complete blood count, ferritin, transferrin saturation, and reticulocytes because depleted stores may cause symptoms before hemoglobin falls and replacement without finding the cause permits recurrence.",
      "Administer oral iron on the prescribed daily or alternate-day schedule and review antacids, calcium, tea, food timing, nausea, and constipation because absorption and tolerability determine whether enough elemental iron reaches the marrow to replenish stores.",
      "Use intravenous iron when ordered after verifying dose, product, access, and baseline vital signs, and monitor flushing, chest or back pressure, wheeze, hypotension, and extravasation because parenteral repletion bypasses poor absorption but can cause infusion reactions and tissue staining.",
      "Coordinate evaluation for menstrual, gastrointestinal, urinary, dietary, celiac, inflammatory, or bariatric causes and reassess ferritin and hemoglobin at the planned interval because a weak or transient response points to ongoing loss, inflammation, malabsorption, nonadherence, or another diagnosis.",
      "Escalate for syncope, chest pain, resting dyspnea, hemodynamic instability, brisk bleeding, black tarry stool unrelated to iron, severe infusion reaction, or failure of values to improve because major blood loss, severe anemia, or an alternate disorder requires urgent care."
    ], [
      "Syncope, chest pain, dyspnea at rest, marked tachycardia, or hemodynamic instability",
      "Vomiting blood, black sticky stool with weakness, heavy uncontrolled vaginal bleeding, or other brisk loss",
      "Wheeze, facial swelling, hypotension, severe chest or back pain, or collapse during infusion",
      "Falling hemoglobin or ferritin, weight loss, dysphagia, or no response despite appropriate replacement"
    ], [
      "Expect possible dark stool and constipation from oral iron, but report sticky tarry stool with weakness or abdominal symptoms because gastrointestinal bleeding can look similar.",
      "Keep iron locked away from children and complete follow-up testing because overdose is dangerous and feeling better does not prove that iron stores or the source of loss have been corrected."
    ]),
    card("Lewy body dementia", ["ninds-lbd"], [
      "Track fluctuations in attention and alertness, visual hallucinations, parkinsonism, gait, falls, REM sleep behavior, swallowing, continence, constipation, and orthostatic blood pressure because Lewy body disease affects cognition, dopamine pathways, sleep, and autonomic control together.",
      "When behavior changes abruptly, check pain, infection, oxygenation, glucose, hydration, constipation, urinary retention, sleep, environment, and recent medicines before attributing it to dementia because delirium and reversible stressors commonly amplify hallucinations and confusion.",
      "Use calm one-step communication, consistent routines, adequate lighting, fall protection, safe sleep surroundings, and supervised swallowing strategies because reduced visuospatial processing, dream enactment, rigidity, and dysphagia create predictable injury and aspiration risks.",
      "Review anticholinergics, sedatives, dopamine medicines, and any antipsychotic with the specialist and monitor rigidity, fever, profound sedation, hypotension, and cognition because people with Lewy body dementia can have severe or fatal neuroleptic sensitivity, particularly to typical antipsychotics.",
      "Escalate for fever with severe rigidity and altered consciousness, recurrent syncope, choking or aspiration, sudden focal deficit, rapidly worsening confusion, or dangerous behavior because neuroleptic malignant syndrome, autonomic instability, pneumonia, stroke, or delirium needs urgent treatment."
    ], [
      "High fever, severe rigidity, reduced consciousness, or autonomic instability after an antipsychotic",
      "Recurrent syncope, profound orthostatic hypotension, bradycardia, or injury from falls",
      "Choking, wet voice, new hypoxemia, fever, or respiratory distress suggesting aspiration",
      "Sudden focal neurologic change, seizure, abrupt confusion, or immediate risk of harm"
    ], [
      "Tell every clinician that the person has Lewy body dementia before an antipsychotic or sedating medicine is given because standard dementia behavior medicines can cause a disproportionate dangerous reaction.",
      "Use a predictable routine, remove trip and sleep-injury hazards, and report sudden changes rather than assuming they are progression because infection, pain, constipation, and medication effects are often treatable."
    ]),
    card("Low back pain", ["nice-low-back"], [
      "Assess onset, mechanism, location, radiation, severity, function, gait, strength, sensation, reflexes, pulses, abdomen, and bowel, bladder, and saddle symptoms because low back pain ranges from mechanical strain to nerve, vascular, visceral, infectious, malignant, or fracture causes.",
      "Screen specifically for major trauma, osteoporosis, steroid exposure, fever, immunosuppression, cancer history, weight loss, night pain, age-related risk, and progressive neurologic deficit because these findings determine whether urgent imaging or specialty evaluation is warranted.",
      "Encourage continued normal activity with pacing, graded exercise, ergonomic changes, and risk-matched physical or psychologically informed therapy because active recovery restores capacity and reduces chronic disability more effectively than prolonged bed rest.",
      "Use prescribed analgesics at the lowest effective risk and monitor sedation, constipation, gastrointestinal bleeding, renal function, falls, and actual functional gain because pain intensity alone does not justify treatment that creates greater harm.",
      "Escalate immediately for urinary retention, saddle anesthesia, bowel-control loss, bilateral or progressive weakness, pulsatile abdominal mass, fever with spinal tenderness, or trauma with deformity because cauda equina compression, aortic disease, infection, or unstable fracture can be catastrophic."
    ], [
      "Urinary retention, new incontinence, saddle anesthesia, or loss of anal tone",
      "Bilateral sciatica, progressive motor weakness, foot drop, or gait collapse",
      "Fever, immunosuppression, injection-drug exposure, or severe focal spinal tenderness",
      "Pulsatile abdominal mass, shock, major trauma, cancer history, or unexplained weight loss"
    ], [
      "Stay active with short, tolerable bouts and gradually rebuild normal tasks because guarding and bed rest weaken the back and can make pain persist.",
      "Seek urgent care for bladder or bowel change, saddle numbness, new weakness, fever with severe back pain, or collapse because those findings are not routine mechanical pain."
    ]),
    card("Mononucleosis", ["cdc-mono"], [
      "Assess airway, tonsillar swelling and exudate, hydration, fever, lymph nodes, rash, abdominal pain, liver and spleen enlargement, and fatigue, and trend blood count and liver tests when indicated because EBV can cause dehydration, airway obstruction, cytopenias, hepatitis, and splenic enlargement.",
      "Provide fluids, rest, throat comfort, and weight- and age-appropriate analgesia while avoiding aspirin in children and unnecessary antibiotics because treatment is supportive and some common medications add Reye, hepatic, or rash risk without treating EBV.",
      "Do not administer ampicillin or amoxicillin for presumed streptococcal disease without appropriate evaluation and review any new diffuse rash because these drugs commonly trigger a prominent rash during EBV infection and can confuse future allergy labeling.",
      "Restrict contact sports, heavy lifting, and abdominal impact until clinical recovery and provider clearance, and protect an enlarged spleen during care because splenic rupture can follow modest trauma and cause concealed hemorrhagic shock.",
      "Escalate for stridor or inability to handle secretions, sudden left-upper-quadrant or referred shoulder pain, syncope or shock, severe jaundice, bleeding, profound weakness, or neurologic change because airway obstruction, splenic rupture, hepatitis, cytopenia, or neurologic complication needs urgent treatment."
    ], [
      "Stridor, drooling, inability to swallow secretions, or increasing respiratory effort",
      "Sudden left-upper-abdominal or left-shoulder pain, dizziness, syncope, or shock",
      "Severe jaundice, persistent vomiting, confusion, or marked liver-test deterioration",
      "Unusual bleeding, severe pallor, rapidly worsening weakness, seizure, or focal neurologic change"
    ], [
      "Avoid contact sports, heavy lifting, and abdominal blows until a clinician clears return because the enlarged spleen can rupture even as fever and sore throat improve.",
      "Do not share drinks, utensils, toothbrushes, or kissing contact while ill, and seek care for breathing trouble or sudden upper-left abdominal or shoulder pain because saliva spreads EBV and rupture or airway swelling is an emergency."
    ]),
    card("Muscular dystrophy", ["cdc-md-types", "cdc-dmd", "aan-fshd"], [
      "Identify the exact genetic subtype and personal motor, respiratory, cardiac, swallowing, treatment, and equipment baseline, then follow the subtype's surveillance plan because risks differ: Duchenne and Becker commonly threaten heart and lungs, myotonic dystrophy is multisystem, and routine cardiac screening is not generally required in asymptomatic facioscapulohumeral muscular dystrophy.",
      "When the subtype, phenotype, or testing indicates respiratory risk, assess cough strength, secretion clearance, nocturnal headache or sleepiness, oxygenation, carbon dioxide when indicated, and infection symptoms and use prescribed cough-assist or noninvasive ventilation because oxygen saturation can remain deceptively normal while hypoventilation and weak cough worsen.",
      "When bulbar involvement is part of the subtype or current phenotype, monitor choking, meal duration, weight, hydration, constipation, and aspiration signs and coordinate speech, nutrition, and feeding support because dysphagia can cause malnutrition and pneumonia before obvious inability to swallow.",
      "Maintain the patient's subtype-specific therapy on schedule; when long-term corticosteroids are prescribed, especially for Duchenne, do not stop them abruptly and monitor blood pressure, glucose, growth, bone density, fractures, infection, adrenal suppression, and treatment-specific labs because benefit and toxicity depend on the actual disorder and regimen.",
      "Escalate for dyspnea or altered mental status after a fall or fracture, ineffective cough, rising carbon dioxide, dysrhythmia or heart failure, choking, acute weakness, or missed long-term steroids in a patient who takes them because fat embolism, respiratory failure, cardiomyopathy, aspiration, and adrenal crisis may present atypically."
    ], [
      "Weak or ineffective cough, morning headache, somnolence, rising carbon dioxide, or respiratory distress",
      "Chest pain, palpitations, syncope, new edema, or heart-failure findings",
      "Choking, wet voice, weight loss, recurrent pneumonia, or inability to maintain hydration",
      "Dyspnea or confusion after a fall or fracture, acute weakness, hypotension, or missed prescribed long-term steroids"
    ], [
      "Bring the neuromuscular emergency card and, when applicable, ventilation settings, latest ECG, and steroid plan to urgent care because oxygen, sedation, anesthesia, and steroid decisions may be unsafe without the subtype-specific context.",
      "Continue stretching, supported activity, respiratory equipment, and cardiac follow-up when prescribed even after walking becomes limited because cardiopulmonary risk follows subtype and testing rather than leg strength alone."
    ]),
    card("Normal pressure hydrocephalus", ["aan-nph"], [
      "Document timed gait speed, step length, turning, falls, transfers, cognition, continence, medication burden, and functional baseline because objective change in the gait-cognition-urinary pattern is more useful than vague impressions when judging progression or shunt response.",
      "Institute fall, toileting, skin, and mobility precautions and provide assistive devices and supervised therapy because magnetic gait and urgency create injury, incontinence-associated skin damage, and loss of independence before dementia becomes severe.",
      "Prepare for brain imaging and large-volume lumbar tap or drainage testing when ordered and measure gait and cognition before and after according to protocol because a reproducible response helps estimate whether CSF diversion may improve function.",
      "After shunt placement, monitor neurologic status, headache by position, wound, fever, abdominal symptoms, gait, cognition, continence, and valve setting when applicable because obstruction, infection, overdrainage, subdural collection, or abdominal complication can reverse benefit.",
      "Escalate for acute severe headache, vomiting, seizure, reduced consciousness, new focal deficit, fever with shunt tenderness, abrupt gait decline, or return of the symptom triad because hemorrhage, subdural collection, shunt infection, or malfunction requires urgent imaging and neurosurgical review."
    ], [
      "Acute severe or positional headache, repeated vomiting, seizure, or reduced consciousness",
      "New focal weakness, speech change, facial droop, or abrupt neurologic decline",
      "Fever, redness or tenderness along the shunt, wound drainage, or meningismus",
      "Sudden return or rapid worsening of gait, cognition, or continence after improvement"
    ], [
      "Keep a simple record of walking time, falls, alertness, and bladder function because these concrete changes help the team judge drainage testing and shunt benefit.",
      "Seek urgent care for fever along the shunt, repeated vomiting, severe headache, seizure, unusual sleepiness, or sudden return of symptoms because shunt problems can progress quickly."
    ]),
    card("Obesity", ["uspstf-obesity", "aga-obesity-pharm", "asmbs-ifso"], [
      "Ask permission to discuss weight, use person-first nonstigmatizing language, and assess weight trajectory, waist and BMI context, goals, food access, sleep, activity, medications, eating-disorder symptoms, mood, and social barriers because effective care depends on the drivers of health rather than blame or a single measurement.",
      "Screen blood pressure, glucose or A1C, lipids, liver risk, sleep apnea, mobility, reproductive health, and medication-related weight gain because cardiometabolic, respiratory, hepatic, and mechanical complications may need treatment regardless of whether weight changes.",
      "Refer or deliver an intensive multicomponent program with nutrition, activity, self-monitoring, problem solving, sleep, relapse planning, and regular follow-up over time because sustained behavior support produces more meaningful health improvement than brief advice alone.",
      "Discuss evidence-based anti-obesity medication and metabolic or bariatric surgery as additional chronic-disease treatments when clinically appropriate, then verify eligibility, preferences, pregnancy plan, contraindications, hydration and nutrition, and monitor adverse effects, micronutrients, glucose-lowering drug needs, and mental health because these treatments can change appetite, absorption, and other medicine requirements quickly.",
      "Escalate for chest pain, acute dyspnea, unilateral leg swelling, severe hyperglycemia, suicidal thinking, persistent vomiting or abdominal pain after treatment, or symptoms of eating-disorder medical instability because thromboembolism, metabolic crisis, psychiatric emergency, pancreatobiliary disease, obstruction, or malnutrition needs urgent care."
    ], [
      "Chest pain, sudden dyspnea, hemoptysis, or unilateral leg swelling",
      "Severe hyperglycemia, dehydration, confusion, or ketone-related symptoms",
      "Persistent vomiting, severe abdominal pain, gastrointestinal bleeding, or postoperative intolerance",
      "Syncope, severe restriction or purging, electrolyte symptoms, or suicidal thinking"
    ], [
      "Choose health goals that matter to you, such as sleep, glucose, mobility, pain, or stamina, because benefits can occur before and even without reaching a target number on the scale.",
      "Seek follow-up when weight returns or a plan stops working rather than viewing it as failure because obesity is a chronic, relapsing disease and treatment often needs adjustment over time."
    ]),
    card("Osteomalacia", ["nih-vitd", "niddk-ckd-mbd", "endocrine-xlh", "endocrine-tio"], [
      "Assess diffuse bone tenderness, proximal muscle weakness, waddling gait, falls, fracture history, diet, sun exposure, pregnancy, kidney or liver disease, bariatric or bowel disease, and medicines because impaired vitamin D, calcium, or phosphate availability leaves newly formed adult bone poorly mineralized.",
      "Trend 25-hydroxyvitamin D, calcium, phosphate, alkaline phosphatase, PTH, and creatinine or eGFR; add urine phosphate handling and FGF23 when renal phosphate wasting is suspected and CKD-mineral-bone measures when kidney disease is present because the biochemical pattern distinguishes nutritional deficiency, impaired renal activation, phosphate loss, and other metabolic bone disorders.",
      "Match treatment to etiology: replace vitamin D or calcium for nutritional or absorptive deficiency; use CKD-directed mineral and PTH management when renal activation or mineral balance is impaired; and use specialist-directed phosphate, active vitamin D, targeted therapy, or tumor removal for renal phosphate-wasting or FGF23 disorders because indiscriminate phosphate or vitamin D can fail and can cause hypercalcemia, nephrocalcinosis, or vascular calcification.",
      "Use fall precautions, assistive devices, pain-aware mobility, and progressive resistance and balance therapy after stabilization because weak proximal muscles and softened bone increase falls while safe loading helps restore function.",
      "Escalate for inability to bear weight, focal severe bone pain, deformity after minor trauma, tetany or seizure, dysrhythmia, severe weakness, or kidney-stone symptoms because insufficiency fracture and dangerous calcium or phosphate disturbances require urgent evaluation."
    ], [
      "Sudden focal bone pain, deformity, or inability to bear weight after little or no trauma",
      "Perioral tingling, carpopedal spasm, tetany, seizure, or prolonged QT",
      "Severe generalized weakness, falls, dysrhythmia, or marked phosphate abnormality",
      "Flank pain, hematuria, oliguria, or hypercalcemia symptoms during replacement"
    ], [
      "Take the prescribed form and amount of vitamin D and minerals rather than megadosing because too little will not mineralize bone and too much can cause hypercalcemia and kidney stones.",
      "Use the fall plan and report new focal pain promptly because softened bone can fracture with ordinary activity even when there was no major injury."
    ]),
    card("Paget disease", ["endocrine-paget", "nci-paget-breast"], [
      "Disambiguate the title before using this pathway: for skeletal disease, open the existing \"Paget disease of bone\" card; persistent unilateral nipple or areola itching, redness, crusting, flattening, bleeding, or discharge belongs in a breast pathway because mammary Paget disease is a breast cancer and not a bone-remodeling disorder.",
      "Trend total alkaline phosphatase with liver-context testing and compare symptoms with radiographs or bone-scan findings because biochemical activity may change independently of pain caused by adjacent osteoarthritis.",
      "Before bisphosphonate therapy, verify hydration, creatinine or eGFR, calcium, 25-hydroxyvitamin D, dental concerns, and ability to follow post-infusion instructions because renal impairment and mineral deficiency raise the risk of drug toxicity and hypocalcemia.",
      "Plan fall prevention, hearing and vision support, safe footwear, mobility aids, and orthopedic assessment before surgery or when a weight-bearing bone is deformed because altered mechanics increase falls, secondary arthritis, blood loss during surgery, and pathologic fracture.",
      "Escalate for a new fracture, spinal or cranial-nerve deficit, rapidly worsening hearing, new severe headache, or a rapidly enlarging painful mass because compression, skull-base disease, or rare sarcomatous transformation needs urgent specialist evaluation."
    ], [
      "New deformity, sudden focal pain, or inability to bear weight suggesting fracture",
      "New weakness, numbness, gait collapse, or bowel or bladder dysfunction",
      "Rapid hearing loss, cranial-nerve change, severe new headache, or visual symptoms",
      "Rapidly enlarging painful bony mass or abrupt unexplained biochemical worsening"
    ], [
      "Use the \"Paget disease of bone\" entry for skeletal symptoms, but seek breast assessment for persistent one-sided nipple or areola itching, scaling, crusting, flattening, bleeding, or discharge because mammary Paget disease can resemble eczema while representing breast cancer.",
      "Tell surgeons and dentists about Paget disease and bisphosphonate exposure because pagetic bone is highly vascular and treatment timing can affect procedure planning."
    ]),
    card("Peripheral neuropathy", ["ninds-neuropathy"], [
      "Map the distribution and tempo of numbness, pain, allodynia, weakness, atrophy, reflex loss, balance change, and autonomic symptoms and compare both sides because length-dependent, focal, rapidly ascending, and asymmetric patterns point to different causes and urgency.",
      "Inspect skin, pressure points, footwear, gait, pulses, temperature, wounds, and ability to sense light touch, vibration, position, and heat because sensory loss removes protective warning while motor and vascular deficits magnify injury and falls.",
      "Review glucose, vitamin B12 and B6 exposure, thyroid, kidney and liver function, alcohol, toxins, infection risk, immune disease, family history, and neurotoxic medicines and coordinate nerve studies when ordered because many acquired causes are treatable or preventable from worsening.",
      "Use prescribed pain therapy, braces, mobility aids, occupational or physical therapy, and autonomic strategies while monitoring sedation, falls, orthostasis, constipation, urinary retention, and functional gain because symptom control should improve participation without adding central or mechanical harm.",
      "Escalate for rapidly ascending weakness, breathing or swallowing difficulty, new bowel or bladder dysfunction, severe orthostatic syncope, acute asymmetric deficit, or infected or ischemic wound because inflammatory neuropathy, cord disease, autonomic failure, stroke, and limb threat require urgent care."
    ], [
      "Rapidly progressive or ascending weakness, loss of walking, or new areflexia",
      "Breathing difficulty, weak cough, choking, dysphagia, or bulbar weakness",
      "New bowel or bladder dysfunction, saddle symptoms, or acute asymmetric neurologic deficit",
      "Syncope from severe orthostasis or a red, draining, black, cool, or nonhealing wound"
    ], [
      "Inspect numb hands and feet daily and protect them from hot water, heating pads, sharp objects, and tight shoes because absent pain does not mean tissue is safe.",
      "Bring a complete medicine, supplement, alcohol, work-exposure, and family history to follow-up because identifying the cause can prevent more nerve loss even when existing damage recovers slowly."
    ]),
    card("Phantom limb pain", ["va-amputation"], [
      "Ask the patient to locate and describe phantom pain, nonpainful phantom sensation, residual-limb pain, back or opposite-limb pain, triggers, sleep, mood, and function because these distinct pain generators require different treatment and all are real experiences after amputation.",
      "Inspect the residual limb and prosthesis interface for pressure, erythema, blister, ulcer, infection, edema, neuroma tenderness, ischemia, contracture, and socket fit because a treatable local problem can amplify pain that the patient perceives in the missing limb.",
      "Use a consistent phantom-limb pain and functional scale before and after prescribed multimodal amputation-pain therapy and monitor sedation, constipation, falls, mood, and medication misuse because meaningful treatment should improve sleep and participation rather than only lower a number.",
      "Coordinate mirror therapy or graded motor imagery, desensitization, positioning, range-of-motion work, prosthetic adjustment, and psychological support because recalibrating sensorimotor input and restoring function can reduce pain without relying solely on medicines.",
      "Escalate after amputation for suicidal thinking, uncontrolled phantom-limb pain with autonomic distress, rapidly spreading residual-limb infection, black or cool tissue, new severe swelling, or sudden dyspnea because psychiatric crisis, sepsis, ischemia, thrombosis, or embolism must not be mislabeled as phantom pain."
    ], [
      "Suicidal thinking, inability to remain safe, or severe uncontrolled pain crisis",
      "Spreading redness, purulent drainage, fever, wound breakdown, or exposed tissue",
      "Cool pale or black residual limb, absent pulse, or rapidly worsening ischemic pain",
      "Acute limb swelling with chest pain, sudden dyspnea, or hemoptysis"
    ], [
      "Phantom pain is generated by the nervous system and is not imaginary; describe its pattern separately from socket or wound pain because each type has different useful treatments.",
      "Check the residual limb with a mirror every day and stop using a prosthesis that causes persistent redness, blistering, or skin breakdown because pressure injury can progress without normal sensation."
    ]),
    card("Polymyalgia rheumatica", ["acr-pmr"], [
      "Assess bilateral shoulder and hip-girdle pain, morning stiffness duration, ability to dress and rise, fever, weight change, joint swelling, true muscle weakness, and ESR or CRP because PMR causes inflammatory stiffness rather than primary muscle damage and mimics must be reconsidered when the pattern is atypical.",
      "Ask at every contact about new headache, scalp tenderness, jaw or tongue claudication, visual change, constitutional symptoms, and limb claudication because giant cell arteritis can coexist with PMR and cause irreversible blindness or large-vessel injury.",
      "Administer glucocorticoid on the prescribed dose and taper and track symptom function and inflammatory markers without abrupt withdrawal because a rapid initial response supports the working diagnosis while individualized tapering limits relapse and adrenal suppression.",
      "Monitor blood pressure, glucose, weight, mood, sleep, infection, eyes, skin, and bone protection and encourage graded strengthening and weight-bearing activity when safe because even low-dose long-term glucocorticoids can cause diabetes, osteoporosis, cataract, infection, and deconditioning.",
      "Escalate immediately for visual symptoms or jaw claudication, severe new headache, neurologic deficit, aortic pain, fever with immunosuppression, or symptoms that worsen despite adequate treatment because GCA, infection, malignancy, or an alternative inflammatory diagnosis needs urgent action."
    ], [
      "Transient or persistent vision loss, diplopia, or new visual blurring",
      "New severe headache, scalp tenderness, jaw or tongue claudication",
      "Focal neurologic deficit, limb ischemia, or sudden chest, back, or abdominal pain",
      "Fever, toxic appearance, true progressive weakness, or poor response to appropriate glucocorticoid"
    ], [
      "Report any new headache, scalp pain, jaw fatigue while chewing, or vision change the same day because these may be giant cell arteritis even when shoulder stiffness is controlled.",
      "Follow the exact steroid taper and bone-protection plan and never stop suddenly because relapse and adrenal insufficiency can occur even after symptoms improve quickly."
    ]),
    card("Pseudogout", ["acr-cppd"], [
      "Assess onset, joint count, warmth, swelling, range, fever, wound or procedure, prosthetic joint, immunosuppression, and ability to bear weight because acute calcium-pyrophosphate arthritis can look identical to septic arthritis, which cannot be excluded by appearance alone.",
      "Prepare for sterile joint aspiration and send ordered cell count, Gram stain, culture, and crystal analysis before intra-articular steroid when infection is possible because finding CPP crystals does not rule out simultaneous bacterial infection.",
      "Administer prescribed NSAID, colchicine, systemic or intra-articular glucocorticoid after checking kidney function, bleeding risk, interactions, glucose, and infection status because acute inflammation can be controlled effectively only when treatment risk matches the patient.",
      "For early-onset or recurrent disease, review calcium, magnesium, phosphate, iron studies, thyroid, and parathyroid history and track attack frequency and joint function because hemochromatosis, hypomagnesemia, and parathyroid disorders can promote CPP deposition.",
      "Escalate for sepsis findings, rapidly destructive pain, prosthetic-joint symptoms, neurovascular compromise, inability to bear weight with trauma, or persistent inflammation despite therapy because infection, fracture, compartment pressure, or another crystal or inflammatory disease requires urgent reassessment."
    ], [
      "Fever, rigors, hypotension, confusion, or toxic appearance with a hot joint",
      "Hot painful prosthetic joint, recent surgery or injection, or immunosuppression",
      "Rapidly increasing swelling, severe pain with passive movement, or neurovascular change",
      "Trauma with inability to bear weight or symptoms that fail to improve on appropriate therapy"
    ], [
      "Seek prompt assessment for a new hot swollen joint rather than assuming every attack is pseudogout because joint infection can occur at the same time as crystals.",
      "Take colchicine or anti-inflammatory medicine only as prescribed and report diarrhea, bleeding, reduced urine, or weakness because age, kidney function, and interactions change medication safety."
    ]),
    card("Scleroderma", ["eular-ssc"], [
      "Assess skin progression, Raynaud episodes, digital ulcers, blood pressure, weight, edema, reflux and swallowing, bowel function, cough, exertional dyspnea, oxygenation, chest symptoms, and functional change because systemic sclerosis injures small vessels and fibroses skin, lungs, kidneys, heart, and gastrointestinal tract.",
      "Measure blood pressure regularly and trend creatinine, urinalysis, hemoglobin, platelets, and medication exposure, especially recent high-dose glucocorticoids, because a rapid pressure or kidney change may be scleroderma renal crisis requiring immediate ACE-inhibitor treatment.",
      "Coordinate serial pulmonary function, diffusion capacity, echocardiography or pulmonary-hypertension screening, and chest imaging when ordered because interstitial lung disease and pulmonary arterial hypertension can progress before severe resting symptoms appear.",
      "Inspect and protect hands and feet, keep them warm, provide prescribed vasodilator and wound care, and monitor color, pain, drainage, and perfusion because recurrent ischemia can produce infected digital ulcers and irreversible tissue loss.",
      "Escalate for new severe hypertension, headache or vision change, acute kidney decline, rapidly worsening dyspnea or hypoxemia, chest pain or syncope, black digit, or fever with an ulcer because renal crisis, pulmonary vascular or fibrotic decompensation, cardiac disease, ischemia, and sepsis are time-critical."
    ], [
      "Abrupt blood-pressure rise, severe headache, visual change, oliguria, or rising creatinine",
      "Rapid dyspnea, falling oxygen saturation, chest pain, syncope, or right-heart-failure findings",
      "Blue or black digit, severe ischemic pain, absent perfusion, or rapidly worsening ulcer",
      "Fever, purulent digital wound, spreading redness, or systemic infection findings"
    ], [
      "Check and record blood pressure as directed and call immediately for a sudden rise, severe headache, vision change, or less urine because renal crisis can progress before swelling is obvious.",
      "Keep hands and feet warm without direct heating, avoid smoking, and report persistent color change or ulcers early because damaged vessels cannot safely tolerate cold, nicotine, or delayed wound care."
    ]),
    card("Seborrheic dermatitis", ["aad-seb"], [
      "Inspect scalp, eyebrows, nasolabial folds, ears, beard, chest, and skin folds for greasy scale, erythema across skin tones, fissures, itch, pain, and secondary infection because site and morphology distinguish seborrheic dermatitis from psoriasis, tinea, contact dermatitis, and other rashes.",
      "Teach and observe use of the prescribed antifungal shampoo or topical medicine, including correct site, contact time, frequency, and maintenance interval because yeast control and adequate exposure reduce scale while intermittent maintenance limits relapse.",
      "Use low-potency topical corticosteroid or calcineurin therapy only as directed for inflamed seborrheic dermatitis on sensitive sites and monitor thinning, striae, telangiectasia, pigment change, eye exposure, and burning because facial and fold skin absorbs medicine readily and is vulnerable to steroid harm.",
      "Encourage gentle fragrance-free cleansing, moisturization, complete rinsing, and seborrheic-dermatitis trigger review for cold weather, stress, irritating hair products, or occlusion because barrier irritation and inflammation perpetuate otherwise controllable flares.",
      "Escalate seborrheic dermatitis for spreading pain, warmth, purulence, fever, eye involvement, extensive refractory disease, sudden severe onset with systemic illness, or infant poor feeding because infection, an alternate diagnosis, or an associated immune or neurologic condition needs medical evaluation."
    ], [
      "Fever, spreading warmth or redness, purulent drainage, or marked tenderness",
      "Eyelid swelling, eye pain, visual change, or medication entering the eye",
      "Widespread erythroderma, severe pain, blistering, or mucosal involvement",
      "Refractory extensive eruption, major hair loss, infant poor feeding, or systemic illness"
    ], [
      "Leave medicated shampoo on for the prescribed contact time and continue the maintenance schedule after clearing because brief rinsing or stopping completely allows scale to return.",
      "Use fragrance-free products and report burning, skin thinning, eye symptoms, or pus because irritation and infection require an adjustment rather than more frequent application."
    ]),
    card("Shingles/postherpetic neuralgia", ["cdc-shingles", "cdc-isolation-zoster"], [
      "Map the rash by dermatome and midline, inspect vesicles and crusting, and assess pain, allodynia, immune status, fever, neurologic findings, eye and ear symptoms, and dissemination because location and host immunity predict ocular, otic, central nervous system, pulmonary, and transmission risk.",
      "Start prescribed antiviral therapy promptly and review renal function, hydration, dose, and treatment window because early suppression of varicella-zoster replication shortens acute disease and is especially important for ocular, neurologic, disseminated, or immunocompromised cases.",
      "For localized shingles in an immunocompetent patient whose lesions can be contained and covered, use Standard Precautions until lesions are dry and crusted; for disseminated disease in any patient or localized disease in an immunocompromised patient until dissemination is excluded, use Airborne + Contact + Standard Precautions because varicella-zoster virus can spread from vesicle fluid and airborne particles.",
      "Use a scheduled multimodal pain plan, protect numb or allodynic skin, monitor sleep, mood, function, and medication sedation, and reassess pain after rash healing because persistent peripheral and central sensitization causes postherpetic neuralgia and secondary injury.",
      "Escalate the same day for forehead or nose lesions, eye pain or vision change, facial weakness or ear vesicles, confusion, weakness, urinary retention, disseminated lesions, dyspnea, or sepsis because ophthalmic zoster, Ramsay Hunt syndrome, myelitis or encephalitis, pneumonia, and dissemination need urgent specialty treatment."
    ], [
      "Forehead or nasal-tip rash, red painful eye, photophobia, or visual change",
      "Ear vesicles, facial paralysis, severe vertigo, or hearing loss",
      "Confusion, severe headache, weakness, bowel or bladder dysfunction, or seizure",
      "Widespread lesions, dyspnea, hypoxemia, fever, or systemic illness in an immunocompromised person"
    ], [
      "Keep lesions covered, wash hands after touching them, and avoid all susceptible nonimmune contacts until every lesion is dry and crusted, especially pregnant or immunocompromised people and newborns, because shingles can transmit varicella and cause severe disease in vulnerable people.",
      "Seek urgent care for any eye or ear involvement, facial weakness, confusion, or spreading rash, and receive recombinant zoster vaccine when eligible because prior shingles does not reliably prevent recurrence."
    ]),
    card("Spinal muscular atrophy", ["sma-genereviews"], [
      "Trend the individual's motor milestone, head and trunk control, cough strength, respiratory rate and pattern, sleep symptoms, oxygenation and carbon dioxide when ordered, feeding time, weight, and scoliosis because progressive anterior-horn-cell loss weakens limb, bulbar, and respiratory muscles while sparing sensation.",
      "Use prescribed airway clearance, suction, cough assist, and noninvasive ventilation and monitor secretion burden and sleep hypoventilation because weak intercostal and expiratory muscles cannot generate an effective cough or adequate nighttime ventilation.",
      "Assess choking, wet voice, fatigue with feeds, reflux, constipation, hydration, and growth and coordinate swallow testing, texture modification, or tube feeding because bulbar weakness causes silent aspiration and energy intake can fall below the work of breathing.",
      "Administer disease-modifying therapy on schedule and complete treatment-specific liver, platelet, coagulation, renal, infection, or procedure monitoring because earlier SMN-restoring treatment preserves more motor neurons but has route- and product-specific serious risks.",
      "Escalate for weak cough with retained secretions, rising carbon dioxide, apnea, aspiration, rapid motor regression, dehydration, or new liver injury, bleeding, or acute weakness after therapy because respiratory failure, pneumonia, catabolism, and treatment toxicity can progress quickly."
    ], [
      "Apnea, weak or absent cough, retained secretions, rising carbon dioxide, or respiratory distress",
      "Choking, recurrent aspiration, wet breathing, inability to feed, or dehydration",
      "Rapid motor regression, new inability to hold the head or sit, or profound fatigue",
      "Jaundice, severe vomiting, bleeding, thrombocytopenia signs, or treatment-related acute organ injury"
    ], [
      "Use the airway-clearance and ventilation plan early during every respiratory illness because waiting for low oxygen can miss dangerous carbon-dioxide retention and secretion plugging.",
      "Keep disease-modifying treatment and multidisciplinary visits on schedule even when function is stable because treatment preserves remaining motor units but cannot restore neurons already lost."
    ]),
    card("Sprain", ["aaos-soft"], [
      "Assess mechanism, joint stability, swelling, ecchymosis, focal bony tenderness, ability to bear weight or use the limb, and distal pulse, color, sensation, and movement because a ligament injury can coexist with fracture, dislocation, tendon rupture, or neurovascular compromise.",
      "Protect the joint and use prescribed relative rest, cold therapy through a barrier, compression, and elevation while checking skin and distal circulation because limiting early swelling reduces pain but overly tight compression can create nerve or blood-flow injury.",
      "Administer the individualized analgesic plan and monitor gastrointestinal, kidney, bleeding, sedation, and allergy risks because pain control should permit safe movement without creating medication complications.",
      "Begin prescribed pain-limited range of motion, progressive strengthening, balance or proprioceptive work, and graded return after acute swelling settles because ligaments heal with reduced neuromuscular control that otherwise promotes chronic instability and reinjury.",
      "Escalate for deformity, inability to bear weight, severe focal bone pain, absent pulse, increasing numbness, pain out of proportion, rapidly expanding swelling, or a persistently unstable joint because occult fracture, dislocation, compartment syndrome, or high-grade ligament disruption needs urgent evaluation."
    ], [
      "Deformity, severe focal bony tenderness, or inability to bear weight or use the limb",
      "Cool pale extremity, absent pulse, delayed refill, progressive numbness, or weakness",
      "Pain out of proportion, tense swelling, or pain with passive stretch",
      "Rapidly increasing bruising or swelling, locked joint, or persistent gross instability"
    ], [
      "Use compression snugly but loosen it and seek help for numbness, color change, cold digits, or increasing pain because swelling can turn a safe wrap into a circulation problem.",
      "Return to sport only after pain-free motion, strength, and balance have recovered because feeling better at rest does not mean the ligament can control rapid movement."
    ]),
    card("Strain", ["aaos-soft"], [
      "Assess the loading event, pain location, swelling, bruising, palpable defect, strength against resistance, range of motion, cramping, and distal neurovascular status because a muscle or tendon strain ranges from microscopic fiber injury to a complete rupture requiring repair.",
      "Protect the strained muscle or tendon and apply prescribed relative rest, cold through a barrier, compression, and elevation during the acute phase while checking skin and circulation because controlling hemorrhage and swelling reduces pain without adding cold or pressure injury.",
      "Avoid forceful stretching, massage, heat, and premature heavy loading of the muscle or tendon strain in the early painful phase because disrupted fibers can rebleed and separate before a stable repair response forms.",
      "Progress the strained muscle or tendon from pain-free motion to gradual flexibility, concentric and eccentric strengthening, and task-specific loading with rehabilitation guidance because remodeled fibers regain capacity only through controlled progressive stress.",
      "Escalate a muscle or tendon strain for a snap with loss of function, palpable gap, inability to lift or push off, rapidly expanding hematoma, severe pain out of proportion, dark urine after extensive muscle injury, or neurovascular change because complete rupture, compartment syndrome, or rhabdomyolysis needs urgent assessment."
    ], [
      "Audible snap, palpable gap, or sudden inability to contract the muscle or move the joint",
      "Rapidly expanding bruising or swelling, tense compartment, or severe pain with passive stretch",
      "Dark urine, markedly reduced urine, profound weakness, or systemic illness after muscle injury",
      "Cool pale extremity, absent pulse, progressive numbness, or new motor loss"
    ], [
      "Do not stretch or test the injured muscle repeatedly during the first painful phase because repeated loading can reopen damaged fibers and enlarge bleeding.",
      "Resume full activity only after strength and motion are nearly symmetric and sport-specific movement is pain-free because early return makes reinjury more likely."
    ]),
    card("Stress fracture", ["aaos-stress"], [
      "Assess focal load-related bone pain, tenderness, swelling, night or rest pain, training changes, footwear, surface, menstrual or energy availability, nutrition, eating-disorder risk, bone disease, and medicines because repetitive loading outpaces remodeling when training stress or bone vulnerability rises.",
      "Stop impact loading and provide prescribed protected weight bearing, boot, or crutches while documenting pain with walking because continued loading can propagate a microscopic injury into a displaced complete fracture.",
      "Coordinate radiographs and MRI or other imaging when ordered and identify high-risk sites such as femoral neck, anterior tibia, navicular, or fifth metatarsal because early radiographs can be normal and poor-blood-supply locations heal slowly or displace.",
      "Review calcium and vitamin D intake, overall energy and protein, menstrual and endocrine function, sleep, training recovery, and bone-density evaluation when indicated because correcting low energy availability and metabolic bone risk prevents delayed healing and recurrence.",
      "Escalate for sudden severe pain, inability to bear weight, deformity, hip or groin pain, neurovascular change, or pain that persists despite unloading because complete fracture, a high-risk femoral-neck lesion, or an alternative diagnosis requires urgent orthopedic care."
    ], [
      "Sudden severe pain, crack or pop, deformity, or inability to bear weight",
      "Hip or groin pain with weight bearing, night pain, or pain at rest",
      "Cool pale limb, absent pulse, progressive numbness, or weakness",
      "Persistent focal pain despite unloading or worsening at a known high-risk bone site"
    ], [
      "Stop the provoking impact activity rather than training through pain because repeated load can convert a healing bone stress injury into a complete fracture.",
      "Return only after clinical clearance and increase duration, frequency, and intensity gradually with rest days because bone adaptation lags behind cardiovascular fitness."
    ]),
    card("Sundowning", ["nia-sundown"], [
      "Record the timing, triggers, sleep, food and fluid intake, toileting, pain, sensory aids, medications, and exact behavior and check vital signs, oxygenation, glucose, infection, constipation, and retention when symptoms change because late-day confusion is a pattern, not a diagnosis, and delirium has reversible causes.",
      "Use calm validation, one-step cues, familiar caregivers and objects, adequate evening light, reduced noise and clutter, and redirection rather than confrontation because impaired processing makes argument and overstimulation intensify fear and agitation.",
      "Create a consistent daytime schedule with morning light, physical and social activity, regular meals, and limited late naps, caffeine, and alcohol because circadian cues and appropriate daytime wakefulness reduce evening sleep-wake disruption.",
      "Secure exits, remove weapons and trip hazards, use identification and an individualized wandering plan, and monitor caregiver fatigue because confusion and exit-seeking can injure the patient or caregiver even when no aggressive intent exists.",
      "Escalate for abrupt new confusion, focal neurologic change, fever, hypoxemia, hypoglycemia, fall or head injury, inability to maintain safety, or caregiver crisis because delirium, stroke, infection, metabolic disease, trauma, or imminent harm needs urgent intervention."
    ], [
      "Abrupt onset or major change from the person's usual late-day pattern",
      "Fever, hypoxemia, hypoglycemia, hypotension, pain, urinary retention, or dehydration",
      "Facial droop, new weakness, speech change, seizure, fall, or head injury",
      "Wandering into danger, violent behavior, suicidal behavior, or caregiver unable to maintain safety"
    ], [
      "Keep a one-week log of timing, sleep, meals, medicines, bowel and bladder function, and triggers because patterns often reveal a modifiable cause that memory alone misses.",
      "Use daylight, a predictable routine, quiet evenings, and a safe exit plan, and seek medical review for sudden worsening because new agitation may be delirium rather than dementia progression."
    ]),
    card("Superficial burn", ["aba-burn-first-aid", "aba-burn"], [
      "Stop the burning process, remove hot or wet items and jewelry that are not stuck, and cool a recent thermal burn with cool running water while avoiding ice because prompt cooling limits heat propagation while ice causes vasoconstriction and additional tissue injury.",
      "Assess mechanism, time, depth, blanching, pain, location, circumferential involvement, inhalation or chemical exposure, tetanus status, and total body surface area using age-appropriate methods while excluding purely superficial erythema from resuscitation TBSA because depth, size, mechanism, and patient factors, not redness alone, determine severity and referral.",
      "Gently cleanse, protect with the ordered nonadherent dressing or moisturizer, provide analgesia, and reassess color, pain, moisture, blistering, and infection because a wound first judged superficial may declare deeper injury over time and an intact barrier prevents contamination.",
      "Maintain hydration and comfortable range of motion for burns near joints and teach sun protection after healing because pain can limit movement and newly healed skin is vulnerable to stiffness, pigment change, and ultraviolet injury.",
      "Escalate immediately to burn-center consultation with consideration for transfer for full-thickness burns, partial-thickness burns of at least 10% TBSA, any deep partial- or full-thickness burn of the face, hands, genitals, feet, perineum, or over a joint, chemical burns, suspected inhalation injury, high-voltage or lightning injury, major comorbidity or concomitant trauma, or poorly controlled pain; seek burn-center consultation for partial-thickness burns below 10% TBSA, any potentially deep burn, low-voltage injury, and pediatric burns because ABA guidance separates urgent transfer consideration from recommended consultation by depth, size, mechanism, and patient needs."
    ], [
      "Hoarseness, soot, facial burn, enclosed-space exposure, stridor, or respiratory distress",
      "Chemical or electrical mechanism, circumferential burn, or cool poorly perfused distal tissue",
      "Deep appearance, deep partial- or full-thickness critical-area involvement, large surface area, or concern for nonaccidental injury",
      "Increasing pain, spreading redness, purulence, fever, dehydration, or failure to heal as expected"
    ], [
      "Cool a new thermal burn with cool running water and never apply ice, butter, toothpaste, or adhesive remedies because these can deepen injury, trap heat, or contaminate the skin.",
      "Protect healing skin from sun and return for worsening pain, redness, drainage, fever, numb white or charred areas, or a burn that proves deeper than simple redness; deep partial- or full-thickness injury of the face, hands, feet, genitals, perineum, or over a joint needs immediate burn-center consultation because critical-area transfer criteria depend on depth as well as location."
    ]),
    card("Syncope", ["aha-syncope"], [
      "Place the patient safely supine, assess airway, breathing, circulation, neurologic status, injury, pulse, blood pressure, oxygenation, and bedside glucose, and obtain a 12-lead ECG promptly because transient cerebral hypoperfusion can result from dysrhythmia, hemorrhage, metabolic disease, or other life threats.",
      "Obtain a witness-informed history of posture, exertion, prodrome, duration, movements, color, recovery, chest symptoms, bleeding, pregnancy possibility, family sudden death, and medicines because the event pattern distinguishes vasovagal syncope from seizure, cardiac syncope, orthostasis, and mimics.",
      "Measure lying and standing heart rate and blood pressure when safe and assess hydration, bleeding, volume loss, and medication contributors because orthostatic hypotension requires both a reproducible physiologic change and an explanation that can be corrected.",
      "Use continuous monitoring and risk-directed laboratory, imaging, or specialist evaluation rather than routine broad testing because abnormal ECG, exertional events, structural heart disease, severe anemia, or focal findings predict serious causes while indiscriminate tests add noise.",
      "Escalate for syncope during exertion or while supine, chest pain, palpitations, abnormal ECG, persistent hypotension, major bleeding, pregnancy with pain, focal neurologic deficit, family history of sudden death, or incomplete recovery because dysrhythmia, embolism, hemorrhage, ectopic pregnancy, stroke, or seizure needs emergency care."
    ], [
      "Syncope during exertion or while supine, or without warning in known heart disease",
      "Chest pain, palpitations, abnormal ECG, severe dyspnea, or persistent hypotension",
      "Major bleeding, severe anemia signs, pregnancy with abdominal pain, or shock",
      "Focal neurologic deficit, prolonged confusion, repeated seizure-like activity, or serious injury"
    ], [
      "At the first familiar warning, sit or lie down and use prescribed counterpressure maneuvers only if the care plan identifies vasovagal or orthostatic presyncope because preventing a fall is the immediate priority.",
      "Do not drive or return to hazardous work until the cause and recurrence risk are reviewed, and seek emergency care for exertional fainting, chest pain, palpitations, bleeding, or incomplete recovery."
    ]),
    card("Temporal arteritis", ["acr-gca"], [
      "Assess new headache, scalp tenderness, temporal-artery change, jaw or tongue claudication, transient or persistent visual symptoms, constitutional features, polymyalgia symptoms, pulses, bruits, blood pressure, and focal neurologic findings because giant cell arteritis can obstruct ocular, cerebral, and large-vessel blood flow.",
      "Notify the prescriber immediately and administer ordered high-dose glucocorticoid without waiting for biopsy when GCA is strongly suspected, especially with visual symptoms, because treatment delay can allow sudden irreversible blindness in one or both eyes.",
      "Trend ESR, CRP, complete blood count, symptoms, vision, glucose, blood pressure, infection, and bone protection and coordinate temporal-artery ultrasound or biopsy and large-vessel imaging as ordered because no single blood test proves the diagnosis and therapy creates substantial toxicity.",
      "Arrange urgent ophthalmology for any visual symptom and monitor the unaffected eye, cranial nerves, and neurologic status because ocular ischemia may fluctuate briefly before permanent loss and can affect the second eye quickly.",
      "Escalate for transient or permanent vision change, diplopia, jaw or tongue ischemia, stroke symptoms, syncope, limb ischemia, or sudden chest, back, or abdominal pain because ocular artery occlusion, cerebral ischemia, aortic aneurysm, or dissection requires emergency care."
    ], [
      "Transient or persistent vision loss, diplopia, blurred vision, or visual-field defect",
      "Jaw or tongue claudication, tongue color change, or severe new headache",
      "Facial droop, weakness, speech change, seizure, syncope, or other cerebral ischemia",
      "Sudden chest, back, or abdominal pain, pulse deficit, or acute limb ischemia"
    ], [
      "Report a new headache, scalp tenderness, jaw fatigue with chewing, or any vision change immediately because treatment is started on suspicion to prevent blindness rather than waiting for every test.",
      "Take glucocorticoids exactly as prescribed and keep glucose, blood-pressure, infection, eye, and bone monitoring because abrupt withdrawal risks relapse while long treatment has preventable complications."
    ]),
    card("Thyroid nodules", ["ata-nodules"], [
      "Assess nodule size and change, neck nodes, prior radiation, family thyroid cancer or endocrine syndrome, hoarseness, dysphagia, dyspnea, pain, and thyroid symptoms because growth, compressive findings, and risk history alter malignancy probability and urgency.",
      "Obtain and trend TSH with free thyroid hormone testing when indicated and coordinate radionuclide scanning for a suppressed TSH according to the plan because a hyperfunctioning nodule follows a different diagnostic path from a nonfunctioning nodule.",
      "Prepare for high-quality neck ultrasound and document composition, echogenicity, margins, calcifications, shape, size, and suspicious nodes because sonographic pattern and size determine whether fine-needle aspiration or surveillance is appropriate.",
      "Before and after ultrasound-guided fine-needle aspiration, review anticoagulants under the prescriber's plan and monitor puncture bleeding, swelling, voice, pain, and breathing because the procedure is usually minor but a neck hematoma can threaten the airway.",
      "Escalate for stridor, rapidly enlarging neck swelling, new persistent hoarseness, fixation, hard nodes, significant growth, severe pain, or post-biopsy breathing difficulty because compression, hemorrhage, invasive malignancy, or aggressive thyroid inflammation needs urgent evaluation."
    ], [
      "Stridor, inability to handle secretions, or rapidly worsening dyspnea",
      "Rapidly enlarging neck mass, post-biopsy swelling, or expanding bruising",
      "New persistent hoarseness, vocal-cord weakness, fixation, or hard cervical nodes",
      "Significant interval growth, severe focal pain, or suspicious ultrasound or cytology result"
    ], [
      "Keep ultrasound and examination follow-up even after a benign biopsy because growth or new suspicious features can require repeat sampling while most stable nodules remain safely observed.",
      "Seek emergency care for breathing difficulty or rapidly expanding neck swelling after biopsy, and report persistent hoarseness, swallowing trouble, or clear growth promptly because these are compressive warning signs."
    ]),
    card("Trigeminal neuralgia", ["nhs-tn"], [
      "Characterize each attack by trigeminal division, laterality, electric-shock quality, duration, trigger, refractory period, oral and dental findings, sensory examination, age at onset, and functional effect because classical trigeminal neuralgia is brief, unilateral, stimulus-evoked pain and atypical features suggest another cranial, dental, tumor, or demyelinating disorder.",
      "Administer carbamazepine or the prescribed alternative on a scheduled titration rather than as ordinary as-needed analgesia and track attack frequency, pain-free eating and hygiene, dizziness, diplopia, ataxia, sedation, falls, and the ordered sodium trend because membrane stabilization prevents paroxysms only at a tolerated sustained dose.",
      "Monitor complete blood count, sodium, liver tests, skin and mucosa, suicidality, pregnancy considerations, interactions, and pharmacogenomic precautions when indicated because anticonvulsants can cause hyponatremia, marrow or liver injury, and severe cutaneous reactions.",
      "Support soft nutritious foods, oral care, trigger modification, and hydration; track weight and sodium when poor intake or carbamazepine raises risk, and arrange neurology and MRI evaluation for new disease or refractory pain because fear of attacks can cause dehydration while imaging can reveal vascular compression or secondary pathology.",
      "Initiate seizure precautions for severe hyponatremic confusion or a seizure, and escalate for those findings, blistering rash or mucosal sores, fever with cytopenia symptoms, new facial numbness or weakness, bilateral pain, hearing or vision change, or suicidal thinking because treatment toxicity or a secondary structural or demyelinating cause requires urgent care."
    ], [
      "Blistering rash, skin pain, mouth or eye sores, fever, or facial swelling",
      "Confusion, seizure, severe unsteadiness, jaundice, infection, or unusual bleeding",
      "New facial sensory loss or weakness, bilateral symptoms, hearing loss, or visual change",
      "Inability to eat or drink, uncontrolled pain crisis, or suicidal thinking"
    ], [
      "Take carbamazepine on the prescribed schedule and taper only with the clinician because ordinary painkillers do not prevent the nerve discharges and abrupt dose changes can cause serious problems.",
      "Report any rash, mouth sores, fever, severe dizziness, confusion, or new numbness urgently and keep blood-test appointments because serious toxicity may begin before pain control changes."
    ]),
    card("Urticaria", ["aaaai-urticaria"], [
      "Assess wheal onset and duration, migration, itch, angioedema, respiratory, gastrointestinal, and cardiovascular symptoms, recent foods, medicines, infection, stings, pressure, heat, cold, exercise, and recurrence because transient hives must be distinguished immediately from systemic anaphylaxis and from fixed lesions suggesting another disease.",
      "For any airway swelling, wheeze, hypoxemia, hypotension, syncope, or multisystem reaction, activate emergency care and give intramuscular epinephrine per protocol because antihistamines reduce itch but do not reverse life-threatening airway or circulatory anaphylaxis.",
      "For isolated urticaria, administer a non-sedating second-generation H1 antihistamine as prescribed and monitor response, sedation, anticholinergic burden, kidney or liver considerations, and adherence because consistent histamine blockade is safer and more effective than repeated sedating rescue doses.",
      "Photograph lesions, document whether each wheal resolves within 24 hours, and refer chronic, recurrent, painful, bruising, or treatment-resistant disease for focused evaluation because most acute hives need no broad testing while urticarial vasculitis and chronic spontaneous urticaria require different care.",
      "Escalate for tongue or throat swelling, voice change, stridor, breathing difficulty, hypotension, severe abdominal symptoms with systemic findings, blistering or mucosal lesions, or fixed painful bruising lesions because anaphylaxis, severe drug reaction, or vasculitis can initially resemble uncomplicated hives."
    ], [
      "Tongue or throat swelling, hoarse voice, stridor, wheeze, or respiratory distress",
      "Hypotension, syncope, confusion, cyanosis, or rapidly progressive multisystem symptoms",
      "Blistering, skin pain, mucosal erosions, fever, or extensive peeling",
      "Individual lesions fixed longer than 24 hours, painful rather than itchy, or leaving bruising"
    ], [
      "Use epinephrine immediately and call emergency services for hives with breathing trouble, throat or tongue swelling, faintness, or symptoms in several body systems because antihistamines cannot treat anaphylactic shock.",
      "Keep a time-stamped photo and exposure record, avoid only confirmed or strongly suspected triggers, and seek review if hives persist beyond six weeks because unnecessary food restriction does not identify chronic spontaneous urticaria."
    ]),
  ];

  function canonicalPrimary(entry) {
    return String(entry && (entry.name || entry.title || entry.displayName) || "")
      .split(" / ")[0]
      .trim();
  }

  function normalizePrimary(value) {
    return String(value || "")
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
  window.ANI_PATHOLOGY_NURSING_WAVE31_B = {
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
