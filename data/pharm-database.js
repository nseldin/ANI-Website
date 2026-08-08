window.ANI_PHARM_DATABASE = {
  version: "2026.06-starter",
  sourceNote: "NCLEX-focused study reference. Drug labels and lab policies can change; verify facility policy and current prescribing information for clinical decisions.",
  labRanges: [
    { name: "Sodium", range: "135-145 mEq/L", why: "Neuro status, seizures, fluid balance, SIADH/DI clues." },
    { name: "Potassium", range: "3.5-5.0 mEq/L", why: "Arrhythmia risk; watch with digoxin, insulin, diuretics, ACE inhibitors, ARBs, spironolactone." },
    { name: "Calcium", range: "8.5-10.5 mg/dL", why: "Tetany, QT changes, bone/renal/endocrine disorders." },
    { name: "Magnesium", range: "1.7-2.2 mg/dL", why: "Dysrhythmias, neuromuscular excitability, magnesium sulfate safety." },
    { name: "Glucose fasting", range: "70-99 mg/dL", why: "Hypoglycemia safety and diabetes medication decisions." },
    { name: "BUN", range: "7-20 mg/dL", why: "Renal perfusion, dehydration, kidney medication dosing concerns." },
    { name: "Creatinine", range: "0.6-1.3 mg/dL", why: "Renal clearance; key for metformin, vancomycin, aminoglycosides, anticoagulants." },
    { name: "WBC", range: "4,500-11,000/mm3", why: "Infection, immunosuppression, clozapine/agranulocytosis clues." },
    { name: "Platelets", range: "150,000-400,000/mm3", why: "Bleeding risk, heparin-induced thrombocytopenia, chemotherapy safety." },
    { name: "Hemoglobin", range: "Female 12-16 g/dL; male 13.5-17.5 g/dL", why: "Bleeding, anemia, oxygen-carrying capacity." },
    { name: "INR", range: "0.8-1.1 usual; often 2-3 therapeutic on warfarin", why: "Warfarin effect and bleeding risk." },
    { name: "aPTT", range: "About 25-35 sec usual; therapeutic heparin often 1.5-2.5 times control", why: "Unfractionated heparin titration." },
    { name: "Digoxin", range: "0.5-2.0 ng/mL; many HF goals 0.5-0.9", why: "Toxicity risk rises with hypokalemia and renal impairment." },
    { name: "Lithium", range: "Often 0.6-1.2 mEq/L therapeutic", why: "Narrow therapeutic index; toxicity with dehydration, low sodium, NSAIDs, ACE inhibitors, diuretics." },
    { name: "Phenytoin", range: "10-20 mcg/mL", why: "Seizure control and toxicity; nystagmus, ataxia, slurred speech." },
    { name: "Vancomycin trough", range: "Facility-specific; often 10-20 mcg/mL depending indication", why: "Nephrotoxicity and therapeutic monitoring." },
    { name: "ABG", range: "pH 7.35-7.45; PaCO2 35-45 mm Hg; HCO3 22-26 mEq/L; PaO2 80-100 mm Hg", why: "Arterial blood gas: acid-base, ventilation, and oxygenation. NCLEX asks whether the client is oxygenating, ventilating, and compensating." },
    { name: "VBG", range: "Venous values are facility-specific; pH often about 7.31-7.41 and PvCO2 about 41-51 mm Hg", why: "Venous blood gas trends acid-base/ventilation, but it does not replace PaO2 for arterial oxygenation decisions." },
    { name: "Myoglobin", range: "Serum roughly female 1-66 ng/mL, male 17-106 ng/mL; urine should be negative/absent", why: "Skeletal muscle injury/rhabdomyolysis cue; myoglobin can injure kidneys, so connect it with CK, potassium, creatinine, urine color, and urine output." }
  ],
  populationLabRanges: [
    {
      group: "Pediatric essentials",
      note: "Pediatric ranges change sharply by age. Always compare to the child age and the lab's printed range.",
      ranges: [
        { name: "Hemoglobin", range: "0-1 mo 13.4-19.9 g/dL; 1-5 yr 10.9-15.0; 5-11 yr 11.9-15.0; 11-18 yr female 11.9-15.0, male 12.7-17.7", why: "Newborn hemoglobin is higher, then falls during infancy. Do not grade pediatric anemia from adult memory." },
        { name: "Hematocrit", range: "0-1 mo 42-64%; 1-5 yr 31-44%; 5-11 yr 35-44%; 11-18 yr female 34-44%, male 37-48%", why: "Age and puberty matter. Trend with symptoms, bleeding, hydration, and oxygenation." },
        { name: "WBC", range: "0-1 mo 9,000-30,000/mm3; 1-3 mo 5,000-19,500; 1-2 yr 6,000-17,000; 2-4 yr 5,500-15,500; 5-11 yr 5,000-14,500", why: "Younger children can run higher WBC ranges; pair with low-grade fever or higher fever, appearance, perfusion, and source." },
        { name: "Platelets", range: "Infants/children usually 150,000-450,000/mm3; age 5 commonly uses the child/adult-style safety anchor of about 150,000-400,000/mm3 depending facility", why: "Platelets are interpreted with bleeding, petechiae, infection, immune thrombocytopenia, chemotherapy, and sepsis cues." },
        { name: "Creatinine", range: "Neonate 0.2-0.9 mg/dL; 2-12 mo 0.2-0.4; 1-2 yr 0.2-0.5; 3-6 yr 0.3-0.7; 7-12 yr 0.4-0.8; 13-15 yr 0.4-0.9", why: "Lower muscle mass means lower expected creatinine. A 'small' rise can matter." },
        { name: "BUN", range: "Children often about 5-18 mg/dL; age 5 generally follows the child range and must be trended with hydration and creatinine", why: "BUN rises with dehydration, renal perfusion problems, GI bleeding, and protein load; do not read it alone." },
        { name: "Sodium", range: "Children generally 135-145 mEq/L", why: "Hyponatremia can cause headache, confusion, seizures, and safety changes; hypernatremia often points toward water loss/dehydration." },
        { name: "Potassium", range: "<10 days 3.5-6.0 mEq/L; >10 days 3.5-5.0", why: "Neonates tolerate a slightly higher listed range, but dysrhythmia risk still matters." },
        { name: "Glucose", range: "0-30 days 40-99 mg/dL; >1 month often 65-99 fasting/reference dependent", why: "Infants and young children have less reserve. Poor feeding, jitteriness, lethargy, diaphoresis, or seizures are safety cues." },
        { name: "Calcium", range: "Children generally about 8.8-10.8 mg/dL, facility dependent", why: "Low calcium can cause tetany, seizure risk, laryngospasm, and prolonged QT; high calcium can cause weakness, constipation, dehydration, and rhythm concerns." }
      ]
    },
    {
      group: "Women / pregnancy-aware essentials",
      note: "Adult female ranges differ for selected CBC/renal values, and pregnancy changes interpretation. Use facility pregnancy ranges when available.",
      ranges: [
        { name: "Hemoglobin", range: "Adult female about 12-16 g/dL; pregnant female anemia thresholds: <11 g/dL in 1st trimester, <10.5 g/dL in 2nd trimester, <11 g/dL in 3rd trimester", why: "Pregnancy hemodilution lowers hemoglobin. Example: Hgb 10.8 g/dL may be mild/expected in 2nd trimester, but Hgb 9.5 g/dL with dyspnea, tachycardia, bleeding, or poor fetal tolerance is not a shrug-off finding." },
        { name: "Hematocrit", range: "Adult female about 36-46%; pregnant female reference anchors: 1st trimester 31-41%, 2nd trimester 30-39%, 3rd trimester 28-40%", why: "Plasma volume expansion lowers Hct, but numbers matter. Example: Hct 33% can fit pregnancy physiology; Hct 26% with dizziness, tachycardia, bleeding, or low Hgb needs anemia/bleeding thinking." },
        { name: "Creatinine", range: "Adult female often 0.5-1.0 mg/dL; pregnant female reference anchors: 1st trimester 0.4-0.7, 2nd trimester 0.4-0.8, 3rd trimester 0.4-0.9 mg/dL; creatinine >=1.0 mg/dL is often abnormal in pregnancy; >1.1 mg/dL or >=2x baseline is a preeclampsia severe-feature threshold", why: "A creatinine that looks 'normal adult' can be concerning in pregnancy because GFR rises. Example: 1.0 mg/dL may be borderline in a nonpregnant adult but deserves attention in pregnancy, especially with hypertension or proteinuria." },
        { name: "Platelets", range: "Adult female 150,000-400,000/mm3; pregnant female usually remains >=150,000/mm3, but mild gestational thrombocytopenia is usually 100,000-149,000/mm3 and often asymptomatic; <100,000/mm3 is not typical benign gestational thrombocytopenia and is a preeclampsia severe-feature threshold when paired with hypertension; HELLP platelet classes: 100,000-150,000 class III, 50,000-100,000 class II, <50,000 class I", why: "Use numbers to separate benign from dangerous. Example: 132,000/mm3 with normal BP/LFTs may fit mild gestational thrombocytopenia; 92,000/mm3 plus BP 160/110, RUQ pain, headache, or AST/ALT elevation points toward preeclampsia/HELLP." },
        { name: "Urine protein", range: "Adult female negative/trace expected; pregnant female should also be negative/trace unless preeclampsia-level proteinuria appears: >=300 mg/24 hr, protein/creatinine ratio >=0.3, or dipstick 1+ only if quantitative testing is unavailable", why: "NCLEX loves headache, vision changes, RUQ pain, hyperreflexia, edema, and proteinuria as a dangerous cluster. Proteinuria supports preeclampsia, but severe features can diagnose preeclampsia even without proteinuria." },
        { name: "Rh/antibody screen", range: "Rh negative status and positive antibody screen need maternity follow-up", why: "Not a 'range,' but a high-yield maternity lab safety concept." }
      ]
    },
    {
      group: "Geriatric essentials",
      note: "Many lab reference ranges are technically adult ranges, but aging changes reserve, medication clearance, hydration, and symptom presentation.",
      ranges: [
        { name: "Creatinine/eGFR", range: "Creatinine may appear normal despite low renal reserve; trend eGFR and urine output", why: "Low muscle mass can hide kidney decline. This matters for metformin, vancomycin, aminoglycosides, lithium, digoxin, DOACs, and contrast." },
        { name: "Sodium", range: "135-145 mEq/L, but older adults are high-risk for symptomatic hyponatremia", why: "SSRIs, thiazides, poor intake, heart failure, and SIADH can cause confusion, falls, seizures." },
        { name: "Potassium", range: "3.5-5.0 mEq/L; risk rises with renal decline and interacting drugs", why: "ACE inhibitors, ARBs, spironolactone, TMP-SMX, and kidney disease make hyperkalemia a classic medication trap." },
        { name: "Albumin", range: "About 3.5-5.0 g/dL, but low albumin is common in frailty/inflammation", why: "Low albumin can increase free drug effect for highly protein-bound meds and signals poor nutrition/inflammation." },
        { name: "WBC", range: "4,500-11,000/mm3, but infection may present without dramatic leukocytosis or obvious fever", why: "New confusion, weakness, falls, anorexia, functional decline, or even low-grade fever can be the infection presentation." },
        { name: "Hemoglobin", range: "Use adult sex-based ranges; anemia is common but not automatically 'normal aging'", why: "Assess bleeding, kidney disease, nutrition, malignancy, and medication effects." }
      ]
    }
  ],
  drugs: [
    {
      name: "Acetaminophen",
      generic: "acetaminophen",
      brandExamples: ["Tylenol"],
      aliases: ["paracetamol", "apap"],
      class: "Non-opioid analgesic; antipyretic",
      boxedWarning: "No boxed warning in most common oral products; severe liver injury is the major safety warning, especially with overdose or multiple acetaminophen-containing products.",
      mechanism: "Reduces fever and pain through central prostaglandin-related effects.",
      nursingEssentials: ["Track total daily dose from all combination products.", "Avoid or use cautiously with significant liver disease or heavy alcohol use.", "Antidote for overdose: acetylcysteine."],
      interactions: ["Alcohol increases hepatotoxicity risk.", "Warfarin effect may increase with repeated high-dose use."],
      keyLabs: ["AST/ALT", "bilirubin", "acetaminophen level after overdose", "INR in severe toxicity"],
      nclexTraps: ["Students miss duplicate acetaminophen in cold, opioid-combination, and OTC products."],
      tags: ["pain", "fever", "liver", "antidote"]
    },
    {
      name: "Aspirin",
      generic: "aspirin",
      brandExamples: ["Bayer", "Ecotrin"],
      aliases: ["asa", "acetylsalicylic acid", "salicylate", "reye syndrome", "reye's syndrome", "reyes syndrome", "pediatric aspirin risk"],
      class: "Salicylate; antiplatelet NSAID",
      boxedWarning: "No universal boxed warning for all products; major concerns are bleeding, allergy/bronchospasm, and Reye syndrome risk. Aspirin/salicylates should generally be avoided in children or teenagers with viral illness such as influenza or varicella unless specifically prescribed.",
      mechanism: "Irreversibly inhibits platelet COX-1, decreasing thromboxane A2 and platelet aggregation.",
      nursingEssentials: ["Assess bleeding risk and allergy/asthma history.", "Avoid aspirin and other salicylates in children/teens with influenza, varicella, or other viral illness unless specifically prescribed because of Reye syndrome risk.", "Use enteric coating for GI tolerance, not bleeding prevention."],
      interactions: ["Anticoagulants and antiplatelets increase bleeding risk.", "NSAIDs can reduce cardioprotective antiplatelet effect depending timing.", "Alcohol increases GI bleeding risk."],
      keyLabs: ["platelets", "hemoglobin/hematocrit", "stool occult blood if GI bleeding suspected"],
      nclexTraps: ["Tinnitus can indicate salicylate toxicity.", "A child or teenager with flu/chickenpox symptoms should not receive aspirin for fever unless specifically prescribed.", "Ask about OTC salicylates, including bismuth subsalicylate, when Reye syndrome is a concern."],
      tags: ["antiplatelet", "pain", "mi", "stroke", "bleeding", "reye syndrome", "salicylate", "viral illness", "influenza", "varicella", "pediatric caution"]
    },
    {
      name: "Warfarin",
      generic: "warfarin",
      brandExamples: ["Coumadin", "Jantoven"],
      aliases: ["coumadin"],
      class: "Vitamin K antagonist anticoagulant",
      boxedWarning: "Boxed warning: major or fatal bleeding can occur.",
      mechanism: "Inhibits vitamin K-dependent clotting factors II, VII, IX, X and proteins C/S.",
      nursingEssentials: ["Monitor INR and bleeding.", "Keep vitamin K intake consistent, not absent.", "Antidote: vitamin K; severe bleeding may require PCC per protocol."],
      interactions: ["NSAIDs, aspirin, antiplatelets, many antibiotics, amiodarone, azole antifungals, alcohol, and herbal products can increase bleeding risk.", "Vitamin K-rich diet changes can alter INR."],
      keyLabs: ["INR", "PT", "hemoglobin/hematocrit", "platelets"],
      nclexTraps: ["Do not teach clients to avoid all greens; teach consistency."],
      tags: ["anticoagulant", "inr", "bleeding", "vitamin k"]
    },
    {
      name: "Heparin",
      generic: "heparin",
      brandExamples: ["Heparin sodium"],
      aliases: ["unfractionated heparin", "ufh"],
      class: "Parenteral anticoagulant",
      boxedWarning: "Major warning: fatal medication errors and serious bleeding have occurred; some labels emphasize correct concentration and route.",
      mechanism: "Enhances antithrombin activity, inhibiting thrombin and factor Xa.",
      nursingEssentials: ["Monitor aPTT or anti-Xa per protocol.", "Watch for heparin-induced thrombocytopenia.", "Antidote: protamine sulfate."],
      interactions: ["Antiplatelets, NSAIDs, thrombolytics, and other anticoagulants increase bleeding risk."],
      keyLabs: ["aPTT", "anti-Xa if ordered", "platelets", "hemoglobin/hematocrit"],
      nclexTraps: ["Falling platelets on heparin can mean HIT, even if clotting is the presenting danger."],
      tags: ["anticoagulant", "aPTT", "bleeding", "protamine"]
    },
    {
      name: "Enoxaparin",
      generic: "enoxaparin",
      brandExamples: ["Lovenox"],
      aliases: ["lovenox", "lmwh", "low molecular weight heparin"],
      class: "Low molecular weight heparin anticoagulant",
      boxedWarning: "Boxed warning: spinal/epidural hematomas may occur with neuraxial anesthesia or spinal puncture, potentially causing long-term paralysis.",
      mechanism: "Enhances antithrombin with greater factor Xa inhibition than thrombin inhibition.",
      nursingEssentials: ["Give subcutaneously in abdomen; do not expel air bubble unless policy says.", "Monitor renal function and bleeding.", "Avoid massaging injection site."],
      interactions: ["NSAIDs, antiplatelets, anticoagulants, thrombolytics increase bleeding risk."],
      keyLabs: ["creatinine", "platelets", "hemoglobin/hematocrit", "anti-Xa in select patients"],
      nclexTraps: ["Neuraxial anesthesia plus enoxaparin is a huge safety cue."],
      tags: ["anticoagulant", "lmwh", "bleeding", "neuraxial"]
    },
    {
      name: "Apixaban",
      generic: "apixaban",
      brandExamples: ["Eliquis"],
      aliases: ["eliquis", "factor xa inhibitor"],
      class: "Direct oral anticoagulant; factor Xa inhibitor",
      boxedWarning: "Boxed warnings: premature discontinuation increases thrombotic risk; spinal/epidural hematoma risk with neuraxial procedures.",
      mechanism: "Directly inhibits factor Xa, reducing thrombin generation.",
      nursingEssentials: ["Assess bleeding and renal/hepatic considerations.", "Do not stop abruptly without prescriber direction.", "Reversal may include andexanet alfa or PCC depending protocol."],
      interactions: ["Strong CYP3A4/P-gp inhibitors or inducers can alter levels.", "NSAIDs and antiplatelets increase bleeding risk."],
      keyLabs: ["CBC", "creatinine", "liver function when indicated"],
      nclexTraps: ["Routine INR is not used to monitor therapeutic effect."],
      tags: ["doac", "anticoagulant", "factor xa", "bleeding"]
    },
    {
      name: "Clopidogrel",
      generic: "clopidogrel",
      brandExamples: ["Plavix"],
      aliases: ["plavix"],
      class: "P2Y12 inhibitor antiplatelet",
      boxedWarning: "Boxed warning: reduced effectiveness in CYP2C19 poor metabolizers.",
      mechanism: "Inhibits ADP-mediated platelet activation and aggregation.",
      nursingEssentials: ["Assess bleeding and bruising.", "Often used after stent; do not stop without prescriber direction.", "Report black stools, hematuria, severe headache, neurologic changes."],
      interactions: ["Anticoagulants, NSAIDs, aspirin, SSRIs/SNRIs may increase bleeding risk.", "Omeprazole/esomeprazole can reduce activation."],
      keyLabs: ["CBC", "hemoglobin/hematocrit"],
      nclexTraps: ["A client after stent stopping clopidogrel can thrombose the stent."],
      tags: ["antiplatelet", "stent", "bleeding", "cyp2c19"]
    },
    {
      name: "Metoprolol",
      generic: "metoprolol",
      brandExamples: ["Lopressor", "Toprol XL"],
      aliases: ["lopressor", "toprol"],
      class: "Beta-1 selective beta blocker",
      boxedWarning: "Boxed warning: abrupt discontinuation can worsen angina and may precipitate myocardial infarction.",
      mechanism: "Blocks beta-1 receptors, lowering heart rate, contractility, and blood pressure.",
      nursingEssentials: ["Check heart rate and blood pressure before administration.", "Use caution in heart block, acute decompensated heart failure, and bronchospasm-prone clients.", "Do not stop abruptly."],
      interactions: ["Other rate-slowing drugs such as digoxin, diltiazem, verapamil, amiodarone can worsen bradycardia/AV block.", "Insulin effects may be masked by reduced tachycardia symptoms."],
      keyLabs: ["glucose in diabetes", "potassium if arrhythmia risk", "renal/hepatic context"],
      nclexTraps: ["Beta blockers can mask hypoglycemia tachycardia; sweating may still occur."],
      tags: ["beta blocker", "cardiac", "blood pressure", "bradycardia"]
    },
    {
      name: "Lisinopril",
      generic: "lisinopril",
      brandExamples: ["Zestril", "Prinivil"],
      aliases: ["ace inhibitor", "zestril", "prinivil"],
      class: "ACE inhibitor",
      boxedWarning: "Boxed warning: fetal toxicity; discontinue as soon as pregnancy is detected.",
      mechanism: "Inhibits angiotensin-converting enzyme, decreasing angiotensin II and aldosterone.",
      nursingEssentials: ["Monitor blood pressure, potassium, and renal function.", "Report angioedema immediately.", "Dry cough can occur."],
      interactions: ["Potassium supplements, salt substitutes, spironolactone, ARBs, aliskiren can increase hyperkalemia risk.", "NSAIDs may reduce antihypertensive effect and worsen renal function."],
      keyLabs: ["potassium", "creatinine", "BUN"],
      nclexTraps: ["Salt substitutes can be potassium chloride and trigger dangerous hyperkalemia."],
      tags: ["ace inhibitor", "hypertension", "heart failure", "potassium", "pregnancy"]
    },
    {
      name: "Furosemide",
      generic: "furosemide",
      brandExamples: ["Lasix"],
      aliases: ["lasix", "loop diuretic"],
      class: "Loop diuretic",
      boxedWarning: "Boxed warning: potent diuresis can cause profound water and electrolyte depletion.",
      mechanism: "Inhibits sodium and chloride reabsorption in the loop of Henle.",
      nursingEssentials: ["Monitor potassium, blood pressure, daily weight, intake/output.", "Watch dehydration and ototoxicity, especially rapid IV or high dose.", "Give earlier in day when possible."],
      interactions: ["Digoxin toxicity risk rises with hypokalemia.", "Aminoglycosides increase ototoxicity risk.", "Lithium levels may increase."],
      keyLabs: ["potassium", "magnesium", "BUN", "creatinine"],
      nclexTraps: ["Low potassium plus digoxin is a classic toxicity setup."],
      tags: ["diuretic", "loop", "heart failure", "potassium", "edema"]
    },
    {
      name: "Spironolactone",
      generic: "spironolactone",
      brandExamples: ["Aldactone"],
      aliases: ["aldactone", "potassium sparing diuretic"],
      class: "Aldosterone antagonist; potassium-sparing diuretic",
      boxedWarning: "No boxed warning commonly emphasized for NCLEX; hyperkalemia is the major safety concern.",
      mechanism: "Blocks aldosterone in distal nephron, increasing sodium/water excretion while retaining potassium.",
      nursingEssentials: ["Monitor potassium and renal function.", "Avoid potassium supplements/salt substitutes unless specifically prescribed.", "Watch endocrine effects such as gynecomastia."],
      interactions: ["ACE inhibitors, ARBs, aliskiren, potassium supplements, trimethoprim, NSAIDs can increase hyperkalemia risk."],
      keyLabs: ["potassium", "creatinine", "BUN"],
      nclexTraps: ["Do not combine casually with salt substitutes or ACE inhibitors without potassium monitoring."],
      tags: ["diuretic", "potassium sparing", "heart failure", "hyperkalemia"]
    },
    {
      name: "Digoxin",
      generic: "digoxin",
      brandExamples: ["Lanoxin"],
      aliases: ["lanoxin", "cardiac glycoside"],
      class: "Cardiac glycoside",
      boxedWarning: "No boxed warning commonly emphasized; narrow therapeutic index and toxicity are the major safety issues.",
      mechanism: "Increases cardiac contractility and slows AV nodal conduction.",
      nursingEssentials: ["Check apical pulse before giving per policy.", "Monitor digoxin level, potassium, renal function.", "Toxicity: GI upset, confusion, vision changes, dysrhythmias."],
      interactions: ["Hypokalemia from loop/thiazide diuretics increases toxicity risk.", "Amiodarone, verapamil, macrolides can increase digoxin levels."],
      keyLabs: ["digoxin level", "potassium", "magnesium", "creatinine"],
      nclexTraps: ["Digoxin toxicity often starts with vague GI symptoms before dramatic rhythm changes."],
      tags: ["heart failure", "afib", "cardiac glycoside", "toxicity", "potassium"]
    },
    {
      name: "Nitroglycerin",
      generic: "nitroglycerin",
      brandExamples: ["Nitrostat", "Nitro-Dur"],
      aliases: ["nitro", "glyceryl trinitrate"],
      class: "Nitrate antianginal",
      boxedWarning: "No boxed warning commonly emphasized; life-threatening hypotension can occur with PDE-5 inhibitors.",
      mechanism: "Vasodilates veins and coronary arteries, reducing preload and myocardial oxygen demand.",
      nursingEssentials: ["Check blood pressure before use.", "Teach headache is common; severe hypotension/syncope is not okay.", "Store sublingual tablets properly and replace when expired."],
      interactions: ["Sildenafil, tadalafil, vardenafil and riociguat can cause severe hypotension.", "Alcohol and antihypertensives can worsen hypotension."],
      keyLabs: ["No routine lab; assess BP, pain, ECG changes"],
      nclexTraps: ["Recent erectile dysfunction medication use is the classic hold/clarify cue."],
      tags: ["angina", "mi", "vasodilator", "hypotension", "pde5"]
    },
    {
      name: "Regular insulin",
      generic: "regular insulin",
      brandExamples: ["Humulin R", "Novolin R"],
      aliases: ["insulin regular", "short acting insulin"],
      class: "Short-acting insulin",
      boxedWarning: "No boxed warning commonly emphasized; hypoglycemia and medication errors are major safety concerns.",
      mechanism: "Moves glucose into cells and shifts potassium intracellularly.",
      nursingEssentials: ["Check glucose before administration.", "Know onset/peak/duration per product and route.", "IV regular insulin is used for DKA/hyperkalemia protocols."],
      interactions: ["Beta blockers can mask hypoglycemia tachycardia.", "Steroids can raise glucose.", "Alcohol can increase hypoglycemia risk."],
      keyLabs: ["blood glucose", "potassium", "anion gap/ketones in DKA"],
      nclexTraps: ["Insulin lowers potassium; in DKA, low K must be corrected before insulin."],
      tags: ["diabetes", "dka", "glucose", "potassium", "hypoglycemia"]
    },
    {
      name: "Metformin",
      generic: "metformin",
      brandExamples: ["Glucophage"],
      aliases: ["glucophage", "biguanide"],
      class: "Biguanide antihyperglycemic",
      boxedWarning: "Boxed warning: lactic acidosis, rare but serious.",
      mechanism: "Decreases hepatic glucose production and improves insulin sensitivity.",
      nursingEssentials: ["Monitor renal function.", "Hold around iodinated contrast or acute kidney injury per policy.", "Does not usually cause hypoglycemia alone."],
      interactions: ["Alcohol and renal impairment increase lactic acidosis risk.", "Contrast-associated kidney injury can increase risk."],
      keyLabs: ["creatinine/eGFR", "lactate if symptomatic", "glucose", "A1C"],
      nclexTraps: ["Respiratory distress, malaise, myalgias, abdominal discomfort plus acidosis signs are concerning for lactic acidosis."],
      tags: ["diabetes", "biguanide", "renal", "lactic acidosis"]
    },
    {
      name: "Levothyroxine",
      generic: "levothyroxine",
      brandExamples: ["Synthroid", "Levoxyl"],
      aliases: ["synthroid", "t4"],
      class: "Thyroid hormone replacement",
      boxedWarning: "Boxed warning: not for weight loss; large doses can cause serious or life-threatening toxicity.",
      mechanism: "Replaces thyroxine (T4), supporting metabolic activity.",
      nursingEssentials: ["Take on empty stomach consistently.", "Monitor TSH and symptoms.", "Overreplacement can cause tachycardia, palpitations, heat intolerance, bone loss."],
      interactions: ["Calcium, iron, antacids, bile acid sequestrants reduce absorption.", "Warfarin effect may increase with thyroid hormone changes."],
      keyLabs: ["TSH", "free T4"],
      nclexTraps: ["It takes weeks to see full effect; do not expect same-day symptom correction."],
      tags: ["thyroid", "hypothyroidism", "tsh", "endocrine"]
    },
    {
      name: "Desmopressin",
      generic: "desmopressin",
      brandExamples: ["DDAVP", "Noctiva", "Nocdurna", "Stimate"],
      aliases: ["ddavp", "adh analog", "antidiuretic hormone analog", "vasopressin analog", "central diabetes insipidus med", "diabetes insipidus medication"],
      class: "Vasopressin analog; antidiuretic hormone (ADH) analog",
      boxedWarning: "Formulation-specific boxed warning: selected desmopressin products can cause severe hyponatremia. Severe hyponatremia can lead to seizures, coma, respiratory arrest, or death.",
      mechanism: "Acts like antidiuretic hormone at kidney V2 receptors, increasing water reabsorption. It can also raise factor VIII and von Willebrand factor release for selected bleeding disorders.",
      usedToTreat: "Central diabetes insipidus, selected nocturia or nocturnal enuresis products, and bleeding prevention in selected clients with von Willebrand disease or mild hemophilia A when prescribed.",
      contraindications: [
        "Do not give when hyponatremia is present or suspected unless the prescriber has specifically addressed the risk.",
        "Clarify moderate to severe renal impairment, uncontrolled polydipsia, fluid overload states, heart failure, uncontrolled hypertension, SIADH, or concurrent drugs that increase hyponatremia risk."
      ],
      nursingEssentials: [
        "Check baseline serum sodium and trend sodium as ordered.",
        "Track intake and output, daily weight, edema, urine output, urine specific gravity or osmolality when used for diabetes insipidus, and mental status.",
        "Teach fluid restriction exactly as prescribed. Headache, confusion, sudden weight gain, vomiting, seizure, or decreased alertness can signal water intoxication or hyponatremia."
      ],
      interactions: [
        "SSRIs, SNRIs, TCAs, carbamazepine, chlorpromazine, opioids, NSAIDs, thiazides, and other hyponatremia-promoting drugs can increase sodium danger."
      ],
      keyLabs: ["serum sodium", "serum osmolality if ordered", "urine output", "urine specific gravity or osmolality", "daily weight", "blood pressure", "fluid balance"],
      nclexTraps: [
        "Desmopressin can fix excessive dilute urination in central diabetes insipidus, but too much water retention becomes hyponatremia.",
        "New confusion, severe headache, vomiting, seizure, or decreased alertness after desmopressin is a sodium emergency until proven otherwise."
      ],
      tags: ["endocrine", "diabetes insipidus", "central di", "adh", "vasopressin analog", "sodium", "hyponatremia", "vwd", "hemophilia"]
    },
    {
      name: "Albuterol",
      generic: "albuterol",
      brandExamples: ["ProAir", "Ventolin", "Proventil"],
      aliases: ["salbutamol", "saba", "rescue inhaler"],
      class: "Short-acting beta-2 agonist bronchodilator",
      boxedWarning: "No boxed warning commonly emphasized; paradoxical bronchospasm and excessive use are major concerns.",
      mechanism: "Stimulates beta-2 receptors, relaxing bronchial smooth muscle.",
      nursingEssentials: ["Assess lung sounds, work of breathing, oxygenation.", "Teach rescue use and proper inhaler technique.", "Tremor, tachycardia, and nervousness can occur."],
      interactions: ["Other sympathomimetics increase cardiac effects.", "Nonselective beta blockers can blunt effect.", "Can lower potassium transiently."],
      keyLabs: ["potassium in high-dose/continuous therapy", "oxygen saturation/peak flow"],
      nclexTraps: ["Using rescue inhaler constantly means poor control and needs follow-up."],
      tags: ["asthma", "copd", "bronchodilator", "rescue", "wheezing"]
    },
    {
      name: "Prednisone",
      generic: "prednisone",
      brandExamples: ["Deltasone"],
      aliases: ["corticosteroid", "steroid"],
      class: "Systemic corticosteroid",
      boxedWarning: "No single universal boxed warning for all prednisone products; immunosuppression, adrenal suppression, hyperglycemia, and GI bleeding risk are major concerns.",
      mechanism: "Suppresses inflammation and immune response through glucocorticoid activity.",
      nursingEssentials: ["Do not stop long-term therapy abruptly.", "Monitor glucose, infection signs, mood changes, GI bleeding.", "Take with food when appropriate."],
      interactions: ["NSAIDs increase GI bleeding risk.", "Vaccines/live vaccines need caution.", "Diuretics may worsen hypokalemia."],
      keyLabs: ["glucose", "WBC interpretation", "potassium", "occult blood if GI symptoms"],
      nclexTraps: ["Steroids can hide infection signs while increasing infection risk."],
      tags: ["steroid", "inflammation", "asthma", "autoimmune", "glucose"]
    },
    {
      name: "Morphine",
      generic: "morphine",
      brandExamples: ["MS Contin", "Roxanol"],
      aliases: ["opioid"],
      class: "Opioid analgesic",
      boxedWarning: "Boxed warnings include addiction/abuse/misuse, life-threatening respiratory depression, accidental ingestion, neonatal opioid withdrawal, and dangerous interactions with benzodiazepines/CNS depressants.",
      mechanism: "Mu-opioid receptor agonist that changes pain perception and response.",
      nursingEssentials: ["Assess respiratory rate, sedation, blood pressure, pain.", "Hold/escalate for respiratory depression or excessive sedation per protocol.", "Antidote: naloxone."],
      interactions: ["Benzodiazepines, alcohol, sedatives, other opioids increase respiratory depression.", "MAOIs can cause severe reactions."],
      keyLabs: ["No routine lab; monitor respiratory status, sedation scale, renal function for metabolite accumulation"],
      nclexTraps: ["Pain score alone is not enough; sedation and respirations decide safety."],
      tags: ["opioid", "pain", "respiratory depression", "naloxone"]
    },
    {
      name: "Naloxone",
      generic: "naloxone",
      brandExamples: ["Narcan"],
      aliases: ["narcan"],
      class: "Opioid antagonist",
      boxedWarning: "No boxed warning commonly emphasized; acute withdrawal can occur in opioid-dependent clients.",
      mechanism: "Competitively displaces opioids from receptors.",
      nursingEssentials: ["Airway and ventilation are priority.", "Monitor for re-sedation because naloxone may wear off before the opioid.", "Titrate to adequate respirations, not necessarily zero pain."],
      interactions: ["Reverses opioid analgesia and can precipitate withdrawal."],
      keyLabs: ["No routine lab; monitor RR, oxygenation, LOC"],
      nclexTraps: ["After naloxone works, keep watching. The client can become sedated again."],
      tags: ["opioid", "antidote", "respiratory depression", "overdose"]
    },
    {
      name: "Vancomycin",
      generic: "vancomycin",
      brandExamples: ["Vancocin"],
      aliases: ["vanco"],
      class: "Glycopeptide antibiotic",
      boxedWarning: "No boxed warning commonly emphasized for IV use; nephrotoxicity, infusion reactions, and ototoxicity risk are major safety concerns.",
      mechanism: "Inhibits bacterial cell wall synthesis.",
      nursingEssentials: ["Monitor renal function and ordered levels.", "Infuse slowly to reduce infusion reaction risk.", "Assess for hearing changes and kidney injury."],
      interactions: ["Aminoglycosides, loop diuretics, amphotericin B, NSAIDs may increase nephrotoxicity/ototoxicity risk."],
      keyLabs: ["creatinine/eGFR", "vancomycin trough/AUC per protocol", "WBC", "temperature"],
      nclexTraps: ["Flushing/hypotension during infusion suggests infusion reaction; slow/stop and follow protocol."],
      tags: ["antibiotic", "mrsa", "renal", "trough", "red man"]
    },
    {
      name: "Gentamicin",
      generic: "gentamicin",
      brandExamples: ["Garamycin"],
      aliases: ["aminoglycoside"],
      class: "Aminoglycoside antibiotic",
      boxedWarning: "Boxed warnings commonly emphasize nephrotoxicity, ototoxicity, and neuromuscular blockade/respiratory paralysis risk.",
      mechanism: "Inhibits bacterial protein synthesis by binding the 30S ribosomal subunit.",
      nursingEssentials: ["Monitor renal function, peak/trough or extended-interval levels per protocol.", "Report hearing changes, vertigo, tinnitus, decreased urine output.", "Hydration matters."],
      interactions: ["Loop diuretics, vancomycin, amphotericin B, cyclosporine, neuromuscular blockers increase toxicity risk."],
      keyLabs: ["creatinine/eGFR", "peak/trough", "urine output"],
      nclexTraps: ["Tinnitus or hearing change is not a minor side effect; it can signal ototoxicity."],
      tags: ["antibiotic", "aminoglycoside", "renal", "ototoxicity", "trough"]
    },
    {
      name: "Lithium",
      generic: "lithium",
      brandExamples: ["Lithobid"],
      aliases: ["lithium carbonate"],
      class: "Mood stabilizer",
      boxedWarning: "Boxed warning: lithium toxicity is closely related to serum levels and can occur near therapeutic levels.",
      mechanism: "Alters neuronal signaling; exact mood-stabilizing mechanism is complex.",
      nursingEssentials: ["Maintain consistent salt and fluid intake.", "Monitor levels, renal function, thyroid function.", "Toxicity: vomiting, diarrhea, coarse tremor, confusion, ataxia, seizures."],
      interactions: ["NSAIDs, ACE inhibitors, ARBs, thiazide diuretics, dehydration, and low sodium can increase lithium levels."],
      keyLabs: ["lithium level", "creatinine/eGFR", "TSH", "sodium"],
      nclexTraps: ["Dehydration or sodium loss can push lithium into toxicity."],
      tags: ["mental health", "bipolar", "toxicity", "sodium", "renal"]
    },
    {
      name: "Fluoxetine",
      generic: "fluoxetine",
      brandExamples: ["Prozac"],
      aliases: ["prozac", "ssri"],
      class: "SSRI antidepressant",
      boxedWarning: "Boxed warning: increased risk of suicidal thoughts and behaviors in pediatric and young adult patients.",
      mechanism: "Inhibits serotonin reuptake, increasing serotonin signaling.",
      nursingEssentials: ["Therapeutic effect may take weeks.", "Monitor suicidal ideation early and after dose changes.", "Watch for serotonin syndrome and bleeding risk."],
      interactions: ["MAOIs, linezolid, methylene blue, other serotonergic drugs increase serotonin syndrome risk.", "NSAIDs, anticoagulants, antiplatelets increase bleeding risk.", "Long half-life affects switching/washout."],
      keyLabs: ["sodium if older adult or SIADH concern", "bleeding labs if anticoagulated"],
      nclexTraps: ["Do not combine with MAOIs; serotonin syndrome is the danger, not just anxiety."],
      tags: ["ssri", "depression", "serotonin", "suicide", "mental health"]
    },
    {
      name: "Clozapine",
      generic: "clozapine",
      brandExamples: ["Clozaril"],
      aliases: ["clozaril"],
      class: "Atypical antipsychotic",
      boxedWarning: "Boxed warnings include severe neutropenia, orthostatic hypotension/bradycardia/syncope, seizures, myocarditis/cardiomyopathy, and increased mortality in elderly patients with dementia-related psychosis.",
      mechanism: "Antagonizes dopamine and serotonin receptors with complex receptor activity.",
      nursingEssentials: ["ANC monitoring is mandatory.", "Report fever, sore throat, infection signs.", "Watch myocarditis symptoms, seizures, constipation/ileus, metabolic effects."],
      interactions: ["CNS depressants increase sedation.", "Smoking changes CYP1A2 metabolism.", "Other marrow-suppressing drugs increase neutropenia risk."],
      keyLabs: ["ANC", "WBC", "glucose/A1C", "lipids", "troponin/CRP if myocarditis concern per protocol"],
      nclexTraps: ["Fever/sore throat on clozapine is a report-now cue because of neutropenia."],
      tags: ["antipsychotic", "schizophrenia", "anc", "neutropenia", "myocarditis"]
    },
    {
      name: "Magnesium sulfate",
      generic: "magnesium sulfate",
      brandExamples: ["Epsom salt injection"],
      aliases: ["mag sulfate", "mgso4", "magnesium toxicity", "magnesium sulfate toxicity", "mag sulfate toxicity", "mgso4 toxicity"],
      class: "Electrolyte; anticonvulsant in preeclampsia/eclampsia",
      boxedWarning: "No boxed warning commonly emphasized for obstetric use; toxicity can cause loss of reflexes, respiratory depression, and cardiac arrest.",
      mechanism: "Stabilizes neuromuscular excitability and reduces seizure risk in severe preeclampsia/eclampsia.",
      nursingEssentials: ["Toxicity surveillance: monitor respirations, deep tendon reflexes, urine output, blood pressure, heart rate, and level of consciousness.", "Hold and escalate for absent reflexes, respiratory rate under 12/min, severe hypotension, bradycardia, low urine output, or increasing somnolence per protocol.", "Antidote: calcium gluconate. Calcium chloride may be used in critical settings per protocol.", "Therapeutic obstetric levels are facility-defined."],
      interactions: ["CNS depressants and neuromuscular blockers can worsen respiratory depression/weakness.", "Calcium channel blockers may increase hypotension/weakness risk."],
      keyLabs: ["magnesium level if ordered or toxicity suspected", "creatinine/eGFR", "urine output", "respiratory rate", "deep tendon reflexes"],
      antidote: "Calcium gluconate is the classic NCLEX antidote. Calcium chloride may be used in critical-care settings per protocol.",
      nclexTraps: ["Absent reflexes or RR under 12 is a toxicity cue; stop infusion and notify per protocol.", "High-yield pair: magnesium toxicity -> calcium gluconate.", "Low urine output raises toxicity risk because magnesium is renally cleared."],
      tags: ["ob", "preeclampsia", "seizure", "toxicity", "calcium gluconate"]
    },
    {
      name: "Oxytocin",
      generic: "oxytocin",
      brandExamples: ["Pitocin"],
      aliases: ["pitocin"],
      class: "Uterotonic hormone",
      boxedWarning: "Boxed warning in some labels emphasizes elective induction risks and need for appropriate supervision.",
      mechanism: "Stimulates uterine smooth muscle contractions.",
      nursingEssentials: ["Monitor contraction pattern and fetal heart rate.", "Stop/slow infusion and intervene for tachysystole or nonreassuring fetal status per protocol.", "Watch water intoxication with prolonged/high-dose use."],
      interactions: ["Other uterotonics increase uterine hyperstimulation risk.", "Vasopressors/anesthetics can affect blood pressure response."],
      keyLabs: ["No routine lab; monitor FHR, contractions, maternal vitals, intake/output if prolonged"],
      nclexTraps: ["Too many contractions can reduce fetal oxygenation; fetal tracing beats the desire to progress labor."],
      tags: ["ob", "labor", "uterotonic", "pitocin", "tachysystole"]
    }
  ]
};

window.ANI_PHARM_DATABASE.drugs.push(
  {
    name: "Amiodarone",
    generic: "amiodarone",
    brandExamples: ["Pacerone"],
    aliases: ["antiarrhythmic", "class iii"],
    class: "Class III antiarrhythmic",
    boxedWarning: "Boxed warning: can cause life-threatening arrhythmias, pulmonary toxicity, and liver injury; use requires experienced monitoring.",
    mechanism: "Prolongs repolarization and refractory period; also has beta-blocking, calcium channel, and sodium channel effects.",
    nursingEssentials: ["Monitor ECG, heart rate, blood pressure.", "Watch pulmonary symptoms, liver injury, thyroid changes, photosensitivity.", "Many interactions because of long half-life and CYP effects."],
    interactions: ["Warfarin and digoxin levels/effects can increase.", "Other QT-prolonging drugs increase torsades risk.", "Grapefruit can increase levels."],
    keyLabs: ["AST/ALT", "TSH", "potassium", "magnesium", "INR if on warfarin", "digoxin level if ordered"],
    nclexTraps: ["New cough or dyspnea is not just a cold; think pulmonary toxicity."],
    tags: ["cardiac", "antiarrhythmic", "qt", "thyroid", "pulmonary"]
  },
  {
    name: "Sotalol",
    generic: "sotalol",
    brandExamples: ["Betapace", "Sorine"],
    aliases: ["class iii antiarrhythmic", "class 3 antiarrhythmic", "potassium channel blocker", "beta blocker antiarrhythmic"],
    class: "Class III antiarrhythmic; potassium-channel blocker with beta-blocking effects",
    usedToTreat: "Selected atrial and ventricular dysrhythmias, including atrial fibrillation/flutter maintenance in selected clients and serious ventricular dysrhythmias.",
    boxedWarning: "Boxed warning: can cause life-threatening ventricular dysrhythmias and QT prolongation. Initiation or dose increases require ECG/QTc and renal-based monitoring per label/protocol.",
    mechanism: "Prolongs repolarization by blocking potassium channels and also blocks beta receptors, reducing sympathetic cardiac stimulation.",
    nursingEssentials: ["Monitor QTc, heart rate, blood pressure, potassium, magnesium, and renal function.", "Clarify low potassium, low magnesium, significant bradycardia, high-grade AV block, or prolonged QT before giving.", "Renal impairment increases accumulation and torsades risk."],
    interactions: ["Other QT-prolonging drugs increase torsades risk.", "Diuretics can lower potassium/magnesium and increase dysrhythmia risk.", "Other rate-slowing drugs can worsen bradycardia or heart block."],
    keyLabs: ["QTc", "potassium", "magnesium", "creatinine/eGFR", "heart rate", "blood pressure"],
    nclexTraps: ["Sotalol is both Class III and beta-blocking. Do not miss bradycardia, hypotension, renal dosing, and QT/torsades risk."],
    nclexEssential: true,
    nclexEssentialRank: 184,
    tags: ["cardiac", "antiarrhythmic", "class iii", "class 3", "potassium channel blocker", "QT", "torsades", "beta blocker", "nclex-essential"]
  },
  {
    name: "Dofetilide",
    generic: "dofetilide",
    brandExamples: ["Tikosyn"],
    aliases: ["class iii antiarrhythmic", "class 3 antiarrhythmic", "potassium channel blocker"],
    class: "Class III antiarrhythmic; potassium-channel blocker",
    usedToTreat: "Maintenance of normal sinus rhythm in selected clients with atrial fibrillation/flutter and conversion of atrial fibrillation/flutter in selected settings.",
    boxedWarning: "Boxed warning: initiation or re-initiation requires inpatient monitoring with continuous ECG because excessive QT prolongation can cause torsades de pointes.",
    mechanism: "Blocks cardiac potassium channels, prolonging repolarization and the refractory period.",
    nursingEssentials: ["Monitor QTc closely during initiation.", "Check potassium, magnesium, and renal function before and during therapy.", "Dose is adjusted by creatinine clearance; renal decline increases torsades risk."],
    interactions: ["Contraindicated or unsafe with several drugs that raise dofetilide levels or prolong QT.", "Diuretics that lower potassium/magnesium increase torsades risk.", "Do not stack with other QT-prolonging antiarrhythmics unless specifically directed by cardiology."],
    keyLabs: ["QTc", "potassium", "magnesium", "creatinine/eGFR"],
    nclexTraps: ["The board-style safety cue is not just 'antiarrhythmic.' It is QT plus renal dosing plus electrolyte correction."],
    nclexEssential: true,
    nclexEssentialRank: 185,
    tags: ["cardiac", "antiarrhythmic", "class iii", "class 3", "potassium channel blocker", "QT", "torsades", "nclex-essential"]
  },
  {
    name: "Ibutilide",
    generic: "ibutilide",
    brandExamples: ["Corvert"],
    aliases: ["class iii antiarrhythmic", "class 3 antiarrhythmic", "potassium channel blocker"],
    class: "Class III antiarrhythmic; potassium-channel blocker",
    usedToTreat: "Acute conversion of atrial fibrillation or atrial flutter in monitored settings.",
    boxedWarning: "Serious ventricular dysrhythmias, especially torsades de pointes, can occur. Continuous ECG monitoring is required during and after administration per protocol.",
    mechanism: "Prolongs action potential duration and refractory period, increasing the chance of atrial rhythm conversion but also increasing QT/torsades risk.",
    nursingEssentials: ["Use continuous ECG monitoring.", "Correct low potassium and magnesium before administration as ordered.", "Monitor for torsades, syncope, palpitations, hypotension, and recurrent dysrhythmia after the dose."],
    interactions: ["Other QT-prolonging drugs increase torsades risk.", "Low potassium or magnesium from diuretics, vomiting, diarrhea, or poor intake increases risk.", "Other antiarrhythmics require careful timing and specialist direction."],
    keyLabs: ["QTc", "potassium", "magnesium", "heart rate", "blood pressure"],
    nclexTraps: ["Ibutilide is a monitored-conversion medication. The priority nursing mindset is ECG/QT surveillance and electrolyte safety."],
    nclexEssential: true,
    nclexEssentialRank: 186,
    tags: ["cardiac", "antiarrhythmic", "class iii", "class 3", "potassium channel blocker", "QT", "torsades", "atrial flutter", "nclex-essential"]
  },
  {
    name: "Dronedarone",
    generic: "dronedarone",
    brandExamples: ["Multaq"],
    aliases: ["class iii antiarrhythmic", "class 3 antiarrhythmic", "potassium channel blocker"],
    class: "Class III antiarrhythmic; potassium-channel blocker with multi-channel effects",
    usedToTreat: "Reduction of hospitalization risk in selected clients with paroxysmal or persistent atrial fibrillation who are in sinus rhythm or will be cardioverted.",
    boxedWarning: "Boxed warning: increased risk of death, stroke, and heart failure in clients with decompensated heart failure or permanent atrial fibrillation. Avoid in those settings.",
    mechanism: "Blocks potassium channels and also has sodium-channel, calcium-channel, and antiadrenergic effects, which slows rhythm activity and prolongs repolarization.",
    nursingEssentials: ["Screen for heart failure status and permanent atrial fibrillation.", "Monitor ECG/rhythm, liver injury cues, pulmonary symptoms, and interactions.", "Clarify worsening shortness of breath, edema, weight gain, syncope, or bradycardia."],
    interactions: ["Strong CYP3A inhibitors, other QT-prolonging drugs, and some rate-slowing medications can create serious risk.", "Can interact with digoxin and anticoagulant plans; verify orders and monitoring."],
    keyLabs: ["ECG/QTc", "AST/ALT", "potassium", "magnesium", "renal function as ordered"],
    nclexTraps: ["Dronedarone is not 'safer amiodarone for everyone.' Heart failure and permanent atrial fibrillation are major danger cues."],
    nclexEssential: true,
    nclexEssentialRank: 187,
    tags: ["cardiac", "antiarrhythmic", "class iii", "class 3", "potassium channel blocker", "atrial fibrillation", "heart failure warning", "nclex-essential"]
  },
  {
    name: "Adenosine",
    generic: "adenosine",
    brandExamples: ["Adenocard"],
    aliases: ["psvt", "svt"],
    class: "Antidysrhythmic; AV nodal blocking agent",
    boxedWarning: "No boxed warning commonly emphasized; transient asystole/heart block, bronchospasm, and arrhythmia risk require monitoring.",
    mechanism: "Slows conduction through the AV node and can terminate AV-node-dependent SVT.",
    nursingEssentials: ["Give rapid IV push followed by saline flush.", "Use continuous ECG monitoring.", "Warn client about brief flushing, chest pressure, or sense of doom."],
    interactions: ["Caffeine/theophylline may reduce effect.", "Dipyridamole may increase effect.", "Carbamazepine may increase heart block risk."],
    keyLabs: ["No routine lab; assess rhythm, blood pressure, airway history"],
    nclexTraps: ["It must be pushed fast because the half-life is only seconds."],
    tags: ["svt", "cardiac", "emergency", "rhythm"]
  },
  {
    name: "Class I antiarrhythmics",
    generic: "class i antiarrhythmics",
    brandExamples: [],
    aliases: ["sodium channel blockers", "class 1 antiarrhythmics", "procainamide", "lidocaine", "flecainide", "propafenone", "quinidine"],
    class: "Antiarrhythmic class: sodium-channel blockers",
    usedToTreat: "Selected atrial or ventricular dysrhythmias depending on the agent and clinical setting. Examples in this class include procainamide, quinidine, disopyramide, lidocaine IV, mexiletine, flecainide, and propafenone.",
    boxedWarning: "Drug-specific warnings vary; key risks include proarrhythmia, conduction slowing, hypotension, and toxicity. Class IC agents can be dangerous in structural heart disease.",
    mechanism: "Blocks fast sodium channels, slowing phase 0 depolarization and conduction through cardiac tissue.",
    nursingEssentials: ["Examples in this class: procainamide, quinidine, disopyramide, lidocaine IV, mexiletine, flecainide, and propafenone.", "Obtain rhythm strip/ECG and assess QRS duration, PR interval, heart rate, blood pressure, and perfusion.", "Clarify use with significant heart block, shock, severe hypotension, or new/worsening dysrhythmia.", "Monitor for proarrhythmia and neurologic toxicity depending on the medication."],
    interactions: ["Other antiarrhythmics can increase conduction/QT toxicity.", "Rate-slowing agents can worsen bradycardia or block.", "Electrolyte abnormalities increase dysrhythmia risk."],
    keyLabs: ["potassium", "magnesium", "ECG/QRS/PR", "renal/hepatic function for the specific agent", "drug levels for selected agents"],
    nclexTraps: ["Class I means sodium-channel effect, not first-line for every rhythm. Stability and rhythm type decide urgency."],
    nclexEssential: true,
    nclexEssentialRank: 180,
    tags: ["antiarrhythmic", "class i", "sodium channel blocker", "dysrhythmia", "nclex-essential"]
  },
  {
    name: "Class II antiarrhythmics",
    generic: "class ii antiarrhythmics",
    brandExamples: [],
    aliases: ["beta blocker antiarrhythmics", "class 2 antiarrhythmics", "metoprolol", "propranolol", "esmolol", "atenolol"],
    class: "Antiarrhythmic class: beta blockers",
    usedToTreat: "Rate control and selected supraventricular dysrhythmias; also used for hypertension, angina, post-MI protection, heart failure with selected agents, migraine prevention, and tremor depending medication. Examples in this class include metoprolol, atenolol, propranolol, esmolol, and carvedilol.",
    boxedWarning: "Warnings vary; abrupt withdrawal can worsen angina/MI risk for selected beta blockers. Major safety risks include bradycardia, hypotension, heart block, bronchospasm in susceptible clients, and masking hypoglycemia symptoms.",
    mechanism: "Blocks beta-adrenergic stimulation, reducing SA-node automaticity, AV-node conduction, heart rate, and myocardial oxygen demand.",
    nursingEssentials: ["Examples in this class: metoprolol, atenolol, propranolol, esmolol, and carvedilol.", "Check heart rate and blood pressure before giving.", "Question severe bradycardia, hypotension, high-grade AV block, cardiogenic shock, or acute decompensated heart failure.", "Teach not to stop abruptly unless directed."],
    interactions: ["Diltiazem, verapamil, digoxin, amiodarone, and other rate-slowing medications increase bradycardia/heart block risk.", "Insulin/sulfonylureas: beta blockers can mask tachycardia from hypoglycemia."],
    keyLabs: ["heart rate", "blood pressure", "ECG/PR interval if indicated", "glucose in diabetes"],
    nclexTraps: ["A client can be hypoglycemic without tachycardia because beta blockers blunt that warning sign."],
    nclexEssential: true,
    nclexEssentialRank: 181,
    tags: ["antiarrhythmic", "class ii", "beta blocker", "rate control", "nclex-essential"]
  },
  {
    name: "Class III antiarrhythmics",
    generic: "class iii antiarrhythmics",
    brandExamples: [],
    aliases: ["potassium channel blockers", "class 3 antiarrhythmics", "amiodarone", "sotalol", "dofetilide", "ibutilide"],
    class: "Antiarrhythmic class: potassium-channel blockers",
    usedToTreat: "Selected atrial and ventricular dysrhythmias depending medication and client stability. Examples in this class include amiodarone, sotalol, dofetilide, ibutilide, and dronedarone.",
    boxedWarning: "Drug-specific boxed warnings vary; core safety concerns are QT prolongation, torsades de pointes, bradycardia, and organ toxicity for selected agents such as amiodarone.",
    mechanism: "Prolongs repolarization and refractory period, often lengthening the QT interval.",
    nursingEssentials: ["Examples in this class: amiodarone, sotalol, dofetilide, ibutilide, and dronedarone.", "Monitor ECG/QTc, heart rate, blood pressure, potassium, and magnesium.", "Correct low potassium or magnesium before/while giving QT-prolonging antiarrhythmics as ordered.", "Watch for dizziness, syncope, palpitations, and new dysrhythmias."],
    interactions: ["Other QT-prolonging drugs increase torsades risk.", "Warfarin/digoxin interactions are high-yield with amiodarone.", "Diuretics can worsen potassium/magnesium depletion and increase rhythm risk."],
    keyLabs: ["QTc", "potassium", "magnesium", "renal function for selected agents", "AST/ALT and TSH with amiodarone"],
    nclexTraps: ["Class III is the QT/torsades class in board-thinking. Low potassium or magnesium makes the risk louder."],
    nclexEssential: true,
    nclexEssentialRank: 182,
    tags: ["antiarrhythmic", "class iii", "potassium channel blocker", "QT", "torsades", "nclex-essential"]
  },
  {
    name: "Class IV antiarrhythmics",
    generic: "class iv antiarrhythmics",
    brandExamples: [],
    aliases: ["non-dihydropyridine calcium channel blockers", "class 4 antiarrhythmics", "diltiazem", "verapamil"],
    class: "Antiarrhythmic class: non-dihydropyridine calcium-channel blockers",
    usedToTreat: "Rate control for selected supraventricular dysrhythmias and treatment of hypertension/angina depending medication. Examples in this class include diltiazem and verapamil.",
    boxedWarning: "Warnings vary; major safety risks include bradycardia, hypotension, AV block, and worsening heart failure in vulnerable clients.",
    mechanism: "Blocks L-type calcium channels in the AV node, slowing conduction and ventricular response in selected supraventricular rhythms.",
    nursingEssentials: ["Examples in this class: diltiazem and verapamil.", "Check heart rate and blood pressure before giving.", "Question use with severe hypotension, sick sinus syndrome, second/third-degree AV block without pacemaker, or acute decompensated heart failure.", "Differentiate diltiazem/verapamil from amlodipine: these two slow the AV node."],
    interactions: ["Beta blockers, digoxin, and amiodarone increase bradycardia/heart block risk.", "Grapefruit can increase levels for some calcium-channel blockers."],
    keyLabs: ["heart rate", "blood pressure", "ECG/PR interval if indicated", "edema/heart failure assessment"],
    nclexTraps: ["Amlodipine is a calcium-channel blocker but not the classic Class IV rate-control teaching point. Diltiazem and verapamil are the AV-node slowers."],
    nclexEssential: true,
    nclexEssentialRank: 183,
    tags: ["antiarrhythmic", "class iv", "calcium channel blocker", "diltiazem", "verapamil", "nclex-essential"]
  },
  {
    name: "Atropine",
    generic: "atropine",
    brandExamples: ["Atropen"],
    aliases: ["anticholinergic"],
    class: "Anticholinergic; antidysrhythmic for symptomatic bradycardia",
    boxedWarning: "No boxed warning commonly emphasized; anticholinergic toxicity and tachyarrhythmias are major concerns.",
    mechanism: "Blocks muscarinic receptors, increasing sinus node firing and AV conduction.",
    nursingEssentials: ["Assess heart rate, rhythm, blood pressure, mental status.", "Use caution with glaucoma, urinary retention, bowel obstruction risk.", "Dry mouth, blurred vision, urinary retention, and tachycardia are expected anticholinergic effects."],
    interactions: ["Other anticholinergics increase toxicity.", "Potassium chloride solid dosage forms may increase GI injury risk with anticholinergic slowed motility."],
    keyLabs: ["No routine lab; monitor ECG and clinical perfusion"],
    nclexTraps: ["Treat the unstable bradycardic client, not a number alone."],
    tags: ["bradycardia", "anticholinergic", "cardiac"]
  },
  {
    name: "Epinephrine",
    generic: "epinephrine",
    brandExamples: ["Adrenalin", "EpiPen"],
    aliases: ["epi", "adrenaline"],
    class: "Adrenergic agonist; vasopressor; bronchodilator",
    boxedWarning: "No single universal boxed warning; severe hypertension, tachyarrhythmias, ischemia, and extravasation injury are key risks.",
    mechanism: "Stimulates alpha and beta receptors to increase vasoconstriction, heart rate/contractility, and bronchodilation.",
    nursingEssentials: ["First-line for anaphylaxis.", "Monitor ECG, blood pressure, perfusion, and IV site.", "Use correct route/concentration for indication."],
    interactions: ["MAOIs, TCAs, and some anesthetics increase cardiovascular effects.", "Nonselective beta blockers can blunt bronchodilation and worsen hypertension."],
    keyLabs: ["glucose", "potassium", "lactate if shock context"],
    nclexTraps: ["Do not delay IM epinephrine for anaphylaxis while waiting for antihistamines."],
    tags: ["anaphylaxis", "vasopressor", "shock", "asthma", "cardiac arrest"]
  },
  {
    name: "Norepinephrine",
    generic: "norepinephrine",
    brandExamples: ["Levophed"],
    aliases: ["levophed", "pressor"],
    class: "Vasopressor; alpha and beta agonist",
    boxedWarning: "No single universal boxed warning; tissue ischemia/extravasation and severe hypertension require close monitoring.",
    mechanism: "Primarily stimulates alpha receptors to raise vascular tone; beta-1 effects support contractility.",
    nursingEssentials: ["Use for shock with hypotension after adequate fluid resuscitation per protocol.", "Monitor MAP, perfusion, urine output, ECG, and IV access.", "Treat extravasation promptly per protocol."],
    interactions: ["MAOIs and TCAs can exaggerate pressor response.", "Other vasopressors increase ischemia/arrhythmia risk."],
    keyLabs: ["lactate", "creatinine", "urine output", "potassium", "ABGs/VBGs as ordered"],
    nclexTraps: ["A rising blood pressure is not enough; evaluate perfusion and urine output."],
    tags: ["shock", "sepsis", "pressor", "icu", "map"]
  },
  {
    name: "Hydralazine",
    generic: "hydralazine",
    brandExamples: ["Apresoline"],
    aliases: ["vasodilator"],
    class: "Direct arterial vasodilator",
    boxedWarning: "No boxed warning commonly emphasized; reflex tachycardia, hypotension, lupus-like syndrome, and fluid retention are key concerns.",
    mechanism: "Relaxes arteriolar smooth muscle to reduce systemic vascular resistance.",
    nursingEssentials: ["Monitor blood pressure and heart rate.", "Assess headache, dizziness, edema, chest pain.", "Often used for severe hypertension including pregnancy contexts per protocol."],
    interactions: ["Other antihypertensives increase hypotension risk.", "NSAIDs may blunt antihypertensive effect."],
    keyLabs: ["blood pressure trend", "heart rate", "ANA/CBC if lupus-like symptoms per provider"],
    nclexTraps: ["After giving a vasodilator, watch for reflex tachycardia and symptomatic hypotension."],
    tags: ["hypertension", "pregnancy", "vasodilator", "blood pressure"]
  },
  {
    name: "Amlodipine",
    generic: "amlodipine",
    brandExamples: ["Norvasc"],
    aliases: ["calcium channel blocker", "ccb"],
    class: "Dihydropyridine calcium channel blocker",
    boxedWarning: "No boxed warning commonly emphasized; hypotension and peripheral edema are common safety concerns.",
    mechanism: "Blocks calcium entry in vascular smooth muscle, causing arterial vasodilation.",
    nursingEssentials: ["Monitor blood pressure, edema, dizziness.", "Teach slow position changes.", "Peripheral edema can occur without heart failure worsening."],
    interactions: ["Other antihypertensives increase hypotension.", "CYP3A4 inhibitors can increase levels."],
    keyLabs: ["No routine lab; monitor BP and edema"],
    nclexTraps: ["Do not confuse amlodipine edema with automatic fluid overload; assess the whole client."],
    tags: ["hypertension", "calcium channel blocker", "edema"]
  },
  {
    name: "Losartan",
    generic: "losartan",
    brandExamples: ["Cozaar"],
    aliases: ["arb", "angiotensin receptor blocker"],
    class: "Angiotensin II receptor blocker",
    boxedWarning: "Boxed warning: fetal toxicity. Stop as soon as pregnancy is detected.",
    mechanism: "Blocks angiotensin II receptor effects, reducing vasoconstriction and aldosterone activity.",
    nursingEssentials: ["Monitor blood pressure, potassium, kidney function.", "Avoid during pregnancy.", "Watch angioedema history and hyperkalemia risk."],
    interactions: ["Potassium supplements/salt substitutes and potassium-sparing diuretics increase hyperkalemia risk.", "NSAIDs can worsen kidney function and reduce effect.", "Lithium levels can increase."],
    keyLabs: ["potassium", "creatinine/eGFR", "blood pressure"],
    nclexTraps: ["Pregnancy and hyperkalemia are high-yield stop-and-call cues."],
    tags: ["arb", "hypertension", "renal", "potassium", "pregnancy"]
  },
  {
    name: "Hydrochlorothiazide",
    generic: "hydrochlorothiazide",
      brandExamples: ["Microzide"],
      aliases: ["hctz", "thiazide"],
      class: "Thiazide diuretic",
      usedToTreat: "Hypertension and mild edema; sometimes used in calcium-stone prevention or nephrogenic diabetes insipidus under provider direction.",
      boxedWarning: "No boxed warning commonly emphasized; electrolyte imbalance, dehydration, photosensitivity, and gout flare risk matter.",
      mechanism: "Inhibits sodium/chloride reabsorption in the distal tubule, increasing diuresis.",
      nursingEssentials: ["Monitor blood pressure, hydration, potassium, sodium.", "Can increase glucose and uric acid.", "Teach photosensitivity precautions."],
      interactions: ["Lithium toxicity risk increases.", "Digoxin toxicity risk rises with hypokalemia.", "NSAIDs may reduce diuretic effect."],
      keyLabs: ["potassium", "sodium", "glucose", "uric acid", "creatinine"],
      nclexTraps: ["Weakness or dysrhythmia symptoms can reflect potassium loss."],
      nclexEssential: true,
      nclexEssentialRank: 35,
      tags: ["diuretic", "hypertension", "potassium", "gout", "lithium", "nclex-essential"]
  },
  {
    name: "Insulin glargine",
    generic: "insulin glargine",
    brandExamples: ["Lantus", "Basaglar", "Toujeo"],
    aliases: ["long acting insulin", "basal insulin"],
    class: "Long-acting basal insulin",
    boxedWarning: "No boxed warning commonly emphasized; hypoglycemia and medication mix-ups are major safety risks.",
    mechanism: "Provides slow basal insulin activity to lower glucose over about 24 hours depending on product.",
    nursingEssentials: ["Do not mix glargine with other insulins in the same syringe.", "Monitor fasting glucose and hypoglycemia.", "Basal insulin is not for rapid meal correction."],
    interactions: ["Beta blockers can mask hypoglycemia symptoms.", "Steroids may increase glucose.", "Other diabetes meds increase hypoglycemia risk."],
    keyLabs: ["blood glucose", "A1C", "potassium if DKA/IV insulin context"],
    nclexTraps: ["Never treat a meal spike with glargine as if it were rapid acting."],
    tags: ["insulin", "diabetes", "basal", "hypoglycemia"]
  },
  {
    name: "Insulin lispro",
    generic: "insulin lispro",
    brandExamples: ["Humalog", "Admelog"],
    aliases: ["rapid acting insulin", "meal insulin"],
    class: "Rapid-acting insulin",
    boxedWarning: "No boxed warning commonly emphasized; hypoglycemia and potassium shifts are major risks.",
    mechanism: "Rapidly moves glucose into cells and suppresses hepatic glucose output.",
    nursingEssentials: ["Give with meals per protocol because onset is fast.", "Hold/clarify if meal is not available.", "Monitor for hypoglycemia."],
    interactions: ["Beta blockers can mask hypoglycemia.", "Steroids increase glucose.", "Alcohol can increase hypoglycemia risk."],
    keyLabs: ["blood glucose", "potassium if high-dose/IV insulin context"],
    nclexTraps: ["Tray timing matters. Rapid insulin without food can crash glucose."],
    tags: ["insulin", "diabetes", "rapid acting", "hypoglycemia"]
  },
  {
    name: "Glucagon",
    generic: "glucagon",
    brandExamples: ["GlucaGen", "Baqsimi"],
    aliases: ["hypoglycemia antidote"],
    class: "Antihypoglycemic hormone",
    boxedWarning: "No boxed warning commonly emphasized; can be ineffective with depleted glycogen stores and may cause nausea/vomiting.",
    mechanism: "Stimulates hepatic glycogenolysis and gluconeogenesis to raise blood glucose.",
    nursingEssentials: ["Use for severe hypoglycemia when oral glucose is unsafe/unavailable.", "Turn client on side if decreased LOC due vomiting risk.", "Give carbohydrate when awake to prevent recurrent hypoglycemia."],
    interactions: ["Beta blockers may increase pulse/BP response.", "Warfarin effect may increase with repeated use."],
    keyLabs: ["blood glucose"],
    nclexTraps: ["After rescue, feed the client when safe because glucagon can wear off."],
    tags: ["hypoglycemia", "diabetes", "antidote", "glucose"]
  },
  {
    name: "Potassium chloride",
    generic: "potassium chloride",
    brandExamples: ["K-Dur", "Klor-Con"],
    aliases: ["kcl", "potassium supplement"],
    class: "Electrolyte replacement",
    boxedWarning: "Boxed warning for some concentrated injectable potassium products: must be diluted before IV use; rapid/undiluted IV potassium can be fatal.",
    mechanism: "Replaces potassium needed for cardiac and neuromuscular function.",
    nursingEssentials: ["Never IV push potassium.", "Verify renal function and urine output.", "Use pump for IV replacement and monitor cardiac rhythm when indicated."],
    interactions: ["ACE inhibitors, ARBs, spironolactone, triamterene, salt substitutes increase hyperkalemia risk.", "Digoxin toxicity risk rises with low potassium."],
    keyLabs: ["potassium", "creatinine/eGFR", "urine output", "ECG"],
    nclexTraps: ["Potassium is a fatal-error medication if pushed IV."],
    tags: ["electrolyte", "potassium", "replacement", "hyperkalemia", "hypokalemia"]
  },
  {
    name: "Calcium gluconate",
    generic: "calcium gluconate",
    brandExamples: ["Cal-Glu"],
    aliases: ["magnesium antidote", "calcium"],
    class: "Calcium salt; electrolyte; antidote for magnesium toxicity",
    boxedWarning: "No boxed warning commonly emphasized; extravasation, hypercalcemia, and arrhythmia risk require monitoring.",
    mechanism: "Raises ionized calcium and stabilizes cardiac/neuromuscular excitability.",
    nursingEssentials: ["Keep available during magnesium sulfate therapy per obstetric protocols.", "Use for symptomatic hypocalcemia or calcium channel blocker toxicity per orders.", "Monitor IV site and ECG when indicated."],
    interactions: ["Digoxin plus IV calcium can increase dysrhythmia concern.", "Ceftriaxone/calcium compatibility matters in neonates."],
    keyLabs: ["calcium", "magnesium", "ECG"],
    nclexTraps: ["For magnesium toxicity, calcium gluconate is the antidote cue."],
    tags: ["electrolyte", "magnesium toxicity", "ob", "antidote", "calcium"]
  },
  {
    name: "Phenytoin",
    generic: "phenytoin",
    brandExamples: ["Dilantin"],
    aliases: ["antiepileptic"],
    class: "Antiseizure medication; hydantoin",
    boxedWarning: "Boxed warning: cardiovascular risk with rapid IV administration including severe hypotension and arrhythmias.",
    mechanism: "Stabilizes neuronal membranes by prolonging inactivated sodium channels.",
    nursingEssentials: ["Monitor levels, neurologic status, gums, rash.", "Use seizure precautions.", "Give IV slowly with cardiac monitoring per protocol."],
    interactions: ["Many CYP interactions; warfarin, oral contraceptives, some antibiotics, and tube feeds can be affected.", "Alcohol can alter levels."],
    keyLabs: ["phenytoin level", "albumin", "CBC", "LFTs"],
    nclexTraps: ["Gingival hyperplasia and rash are classic, but IV rate/cardiac monitoring is the safety trap."],
    tags: ["seizure", "antiepileptic", "level", "rash", "gums"]
  },
  {
    name: "Levetiracetam",
    generic: "levetiracetam",
    brandExamples: ["Keppra"],
    aliases: ["keppra"],
    class: "Antiseizure medication",
    boxedWarning: "No boxed warning commonly emphasized; behavioral changes and suicidality warning are important.",
    mechanism: "Binds synaptic vesicle protein SV2A and modulates neurotransmitter release.",
    nursingEssentials: ["Monitor seizure frequency, mood, irritability, depression, suicidal thoughts.", "Dose adjustment may be needed with renal impairment.", "Do not stop abruptly."],
    interactions: ["Fewer major interactions than many antiseizure drugs; CNS depressants can increase sedation."],
    keyLabs: ["creatinine/eGFR", "mood/behavior assessment"],
    nclexTraps: ["New aggression or suicidal thinking matters even when seizure control improves."],
    tags: ["seizure", "antiepileptic", "mental health", "renal"]
  },
  {
    name: "Valproic acid",
    generic: "valproic acid",
    brandExamples: ["Depakene", "Depakote"],
    aliases: ["divalproex", "valproate"],
    class: "Antiseizure medication; mood stabilizer",
    boxedWarning: "Boxed warnings include hepatotoxicity, fetal risk including neural tube defects, and pancreatitis.",
    mechanism: "Increases GABA activity and affects sodium/calcium channels.",
    nursingEssentials: ["Avoid in pregnancy when possible; verify contraception/education.", "Monitor liver injury, pancreatitis symptoms, bleeding/bruising.", "Do not stop abruptly."],
    interactions: ["Other hepatotoxic drugs increase liver risk.", "Aspirin and warfarin can increase bleeding concerns.", "Lamotrigine rash risk increases."],
    keyLabs: ["valproate level", "AST/ALT", "platelets", "ammonia if mental status changes"],
    nclexTraps: ["Severe abdominal pain can mean pancreatitis, not routine GI upset."],
    tags: ["seizure", "bipolar", "pregnancy", "liver", "pancreatitis"]
  },
  {
    name: "Isotretinoin",
    generic: "isotretinoin",
    brandExamples: ["Accutane", "Absorica", "Claravis"],
    aliases: ["retinoid acne drug", "13 cis retinoic acid"],
    class: "Oral retinoid",
    boxedWarning: "Boxed warning: severe birth defects, pregnancy loss, premature birth, and infant death can occur if pregnancy happens during therapy.",
    mechanism: "Shrinks sebaceous glands, lowers sebum production, reduces Cutibacterium acnes growth conditions, and changes follicular keratinization.",
    nursingEssentials: ["Pregnancy is a hard stop unless pregnancy-prevention requirements are met.", "Verify required pregnancy testing and contraception documentation.", "Monitor mood changes, severe headache/vision changes, lipids, and liver enzymes."],
    interactions: ["Vitamin A supplements increase toxicity risk.", "Tetracyclines can increase intracranial hypertension risk.", "Alcohol can worsen lipid/liver concerns."],
    keyLabs: ["pregnancy test", "AST/ALT", "triglycerides", "mood assessment"],
    nclexTraps: ["Do not treat isotretinoin as routine acne teaching. Pregnancy prevention is the safety priority."],
    tags: ["retinoid", "acne", "pregnancy", "teratogenic", "birth defects", "fetal toxicity"],
    nclexEssential: true
  },
  {
    name: "Acitretin",
    generic: "acitretin",
    brandExamples: ["Soriatane"],
    aliases: ["oral retinoid", "psoriasis retinoid"],
    class: "Oral retinoid",
    boxedWarning: "Boxed warning: severe birth defects can occur. Pregnancy must be avoided during therapy and for a prolonged period after stopping.",
    mechanism: "Normalizes epidermal cell growth and differentiation through retinoid receptor effects.",
    nursingEssentials: ["Verify pregnancy prevention and alcohol avoidance instructions.", "Monitor liver enzymes, lipids, skin/mucous membrane dryness, and mood changes.", "Teach that pregnancy precautions continue long after the last dose."],
    interactions: ["Alcohol can convert acitretin to etretinate and prolong teratogenic risk.", "Vitamin A products increase retinoid toxicity.", "Methotrexate increases hepatotoxicity concern."],
    keyLabs: ["pregnancy test", "AST/ALT", "lipids", "triglycerides"],
    nclexTraps: ["The post-treatment pregnancy-avoidance window is the trap. The risk does not end when the bottle is empty."],
    tags: ["retinoid", "psoriasis", "pregnancy", "teratogenic", "birth defects", "fetal toxicity"],
    nclexEssential: true
  },
  {
    name: "Mycophenolate",
    generic: "mycophenolate",
    brandExamples: ["CellCept", "Myfortic"],
    aliases: ["mycophenolate mofetil", "mycophenolic acid", "transplant antimetabolite"],
    class: "Immunosuppressant; antimetabolite",
    boxedWarning: "Boxed warnings include embryo-fetal toxicity, malignancy, and serious infections.",
    mechanism: "Inhibits inosine monophosphate dehydrogenase, decreasing lymphocyte guanosine nucleotide synthesis and immune proliferation.",
    nursingEssentials: ["Verify pregnancy status and contraception counseling.", "Monitor infection, CBC, renal/liver function, and GI toxicity.", "Do not stop transplant immunosuppression without prescriber direction."],
    interactions: ["Live vaccines may be unsafe or less effective.", "Antacids/cholestyramine can reduce exposure.", "Other immunosuppressants increase infection risk."],
    keyLabs: ["pregnancy test", "CBC", "creatinine/eGFR", "AST/ALT"],
    nclexTraps: ["A transplant client should not stop mycophenolate casually, but pregnancy risk still requires urgent specialist review."],
    tags: ["transplant", "immunosuppressant", "pregnancy", "teratogenic", "embryo fetal", "infection"],
    nclexEssential: true
  },
  {
    name: "Thalidomide",
    generic: "thalidomide",
    brandExamples: ["Thalomid"],
    aliases: ["immunomodulatory drug", "imid"],
    class: "Immunomodulatory and antiangiogenic medication",
    boxedWarning: "Boxed warning: severe, life-threatening birth defects or embryo-fetal death can occur with pregnancy exposure.",
    mechanism: "Modulates immune signaling and inhibits angiogenesis.",
    nursingEssentials: ["Pregnancy prevention requirements are non-negotiable.", "Monitor neuropathy, sedation, constipation, thrombosis, and infection risk.", "Use fall precautions if sedated."],
    interactions: ["Hormonal contraceptive reliability and thrombosis risk require careful review.", "CNS depressants increase sedation.", "Other thrombosis-risk drugs can increase VTE concern."],
    keyLabs: ["pregnancy test", "CBC", "neurologic assessment", "VTE assessment"],
    nclexTraps: ["The classic teratogen warning is the priority. Do not skip pregnancy screening."],
    tags: ["teratogenic", "pregnancy", "birth defects", "fetal toxicity", "multiple myeloma", "neuropathy"],
    nclexEssential: true
  },
  {
    name: "Carbamazepine",
    generic: "carbamazepine",
    brandExamples: ["Tegretol", "Carbatrol"],
    aliases: ["antiepileptic", "mood stabilizer"],
    class: "Antiseizure medication; sodium-channel blocker",
    boxedWarning: "Boxed warnings include serious dermatologic reactions and aplastic anemia/agranulocytosis.",
    mechanism: "Stabilizes inactive sodium channels and decreases repetitive neuronal firing.",
    nursingEssentials: ["Monitor rash, fever, sore throat, bruising, CBC, sodium, liver enzymes, and seizure control.", "Pregnancy requires risk-benefit review because fetal harm can occur.", "Do not stop abruptly."],
    interactions: ["Many CYP interactions; oral contraceptive efficacy can fall.", "Other CNS depressants increase sedation.", "Grapefruit can increase levels."],
    keyLabs: ["CBC", "sodium", "AST/ALT", "carbamazepine level", "pregnancy status when applicable"],
    nclexTraps: ["Rash plus fever or mucosal involvement is not routine. It is urgent."],
    tags: ["seizure", "antiepileptic", "pregnancy", "fetal harm", "sjs", "hyponatremia"],
    nclexEssential: true
  },
  {
    name: "Doxycycline",
    generic: "doxycycline",
    brandExamples: ["Vibramycin", "Doryx"],
    aliases: ["tetracycline antibiotic"],
    class: "Tetracycline antibiotic",
    boxedWarning: "No boxed warning commonly emphasized; fetal/child tooth and bone effects are key safety concerns.",
    mechanism: "Inhibits bacterial protein synthesis by binding the 30S ribosomal subunit.",
    nursingEssentials: ["Avoid routine use in pregnancy and young children unless benefits outweigh risks.", "Teach photosensitivity precautions.", "Separate from calcium, iron, magnesium, and antacids."],
    interactions: ["Dairy, iron, magnesium, calcium, and antacids reduce absorption.", "Warfarin effect may increase.", "Isotretinoin can increase intracranial hypertension risk."],
    keyLabs: ["pregnancy status when applicable", "LFTs if prolonged", "INR if on warfarin"],
    nclexTraps: ["Do not give with milk/antacids and do not ignore pregnancy or young-child safety."],
    tags: ["antibiotic", "tetracycline", "pregnancy", "pediatric", "tooth discoloration", "photosensitivity"],
    nclexEssential: true
  },
  {
    name: "Tetracycline",
    generic: "tetracycline",
    brandExamples: ["Sumycin"],
    aliases: ["tetracycline class antibiotic"],
    class: "Tetracycline antibiotic",
    boxedWarning: "No boxed warning commonly emphasized; fetal/child tooth and bone effects are key safety concerns.",
    mechanism: "Inhibits bacterial protein synthesis by binding the 30S ribosomal subunit.",
    nursingEssentials: ["Avoid in pregnancy and children under 8 unless specifically justified.", "Teach sun protection.", "Separate from dairy, iron, magnesium, calcium, and antacids."],
    interactions: ["Dairy, iron, calcium, magnesium, and antacids reduce absorption.", "Warfarin effect may increase.", "Retinoids can increase intracranial hypertension risk."],
    keyLabs: ["pregnancy status when applicable", "LFTs if prolonged", "INR if on warfarin"],
    nclexTraps: ["Tooth discoloration and bone growth concerns make pregnancy/peds safety high-yield."],
    tags: ["antibiotic", "tetracycline", "pregnancy", "pediatric", "tooth discoloration", "photosensitivity"],
    nclexEssential: true
  },
  {
    name: "Atorvastatin",
    generic: "atorvastatin",
    brandExamples: ["Lipitor"],
    aliases: ["statin"],
    class: "HMG-CoA reductase inhibitor; statin",
    boxedWarning: "No boxed warning commonly emphasized; myopathy/rhabdomyolysis and liver injury warnings are high yield.",
    mechanism: "Inhibits hepatic cholesterol synthesis by blocking HMG-CoA reductase.",
    nursingEssentials: ["Hold/question routine statin use in pregnancy unless a specialist directs otherwise.", "Report unexplained muscle pain, weakness, or dark urine.", "Monitor liver symptoms and lipid response."],
    interactions: ["Strong CYP3A4 inhibitors and grapefruit can increase toxicity risk.", "Gemfibrozil increases myopathy risk.", "Alcohol can worsen liver concerns."],
    keyLabs: ["lipid panel", "AST/ALT if symptoms/risk", "CK if muscle symptoms", "pregnancy status when applicable"],
    nclexTraps: ["Severe muscle pain plus dark urine can mean rhabdomyolysis."],
    tags: ["statin", "cholesterol", "pregnancy", "rhabdomyolysis", "liver"],
    nclexEssential: true
  },
  {
    name: "Finasteride",
    generic: "finasteride",
    brandExamples: ["Proscar", "Propecia"],
    aliases: ["5 alpha reductase inhibitor"],
    class: "5-alpha-reductase inhibitor",
    boxedWarning: "No boxed warning commonly emphasized; fetal male genital development risk is the major pregnancy handling concern.",
    mechanism: "Inhibits conversion of testosterone to dihydrotestosterone.",
    nursingEssentials: ["Pregnant clients should not handle crushed or broken tablets.", "Monitor urinary symptom response or hair-loss indication.", "Teach that sexual side effects can occur."],
    interactions: ["No classic NCLEX interaction; review other BPH therapies for hypotension/falls."],
    keyLabs: ["pregnancy exposure risk", "PSA interpretation if prostate monitoring"],
    nclexTraps: ["The handling warning matters even if the pregnant person is not the prescribed patient."],
    tags: ["bph", "hair loss", "pregnancy", "fetal harm", "teratogenic handling"],
    nclexEssential: true
  },
  {
    name: "Misoprostol",
    generic: "misoprostol",
    brandExamples: ["Cytotec"],
    aliases: ["prostaglandin e1"],
    class: "Prostaglandin E1 analog",
    boxedWarning: "Boxed warning: can cause abortion, premature birth, or birth defects if used during pregnancy for ulcer prevention.",
    mechanism: "Stimulates prostaglandin receptors, increasing uterine tone and cervical ripening while also protecting gastric mucosa.",
    nursingEssentials: ["Clarify indication immediately in pregnancy.", "For obstetric use, monitor uterine activity and fetal status per protocol.", "For GI protection, verify pregnancy precautions."],
    interactions: ["Oxytocin and other uterotonics increase uterine tachysystole risk.", "Magnesium-containing antacids can worsen diarrhea."],
    keyLabs: ["pregnancy status", "bleeding assessment", "fetal/maternal monitoring when obstetric"],
    nclexTraps: ["Same drug, different context. GI ulcer prevention in pregnancy is a red flag, while obstetric use requires protocol monitoring."],
    tags: ["uterotonic", "pregnancy", "birth defects", "abortion", "ob"],
    nclexEssential: true
  },
  {
    name: "Sertraline",
    generic: "sertraline",
    brandExamples: ["Zoloft"],
    aliases: ["ssri"],
    class: "SSRI antidepressant",
    boxedWarning: "Boxed warning: increased risk of suicidal thoughts and behaviors in pediatric and young adult patients.",
    mechanism: "Inhibits serotonin reuptake.",
    nursingEssentials: ["Effect takes weeks.", "Monitor suicidality early and with dose changes.", "Watch serotonin syndrome, bleeding risk, and hyponatremia."],
    interactions: ["MAOIs, linezolid, methylene blue, tramadol, triptans, other serotonergic drugs increase serotonin syndrome risk.", "NSAIDs/anticoagulants increase bleeding risk."],
    keyLabs: ["sodium in older adults/SIADH risk", "bleeding labs if anticoagulated"],
    nclexTraps: ["Do not stop abruptly; discontinuation symptoms can happen."],
    tags: ["ssri", "depression", "anxiety", "serotonin", "suicide"]
  },
  {
    name: "Bupropion",
    generic: "bupropion",
    brandExamples: ["Wellbutrin", "Zyban"],
    aliases: ["norepinephrine dopamine reuptake inhibitor", "smoking cessation"],
    class: "Atypical antidepressant; norepinephrine-dopamine reuptake inhibitor",
    boxedWarning: "Boxed warning: increased risk of suicidal thoughts and behaviors in pediatric and young adult patients for antidepressant products.",
    mechanism: "Inhibits norepinephrine and dopamine reuptake; also helps reduce nicotine cravings.",
    nursingEssentials: ["Contraindicated with seizure disorder and bulimia/anorexia risk because seizure threshold lowers.", "Monitor mood, insomnia, blood pressure.", "Avoid duplicate bupropion products."],
    interactions: ["MAOIs contraindicated.", "Other seizure-threshold-lowering drugs increase seizure risk.", "Alcohol withdrawal increases seizure risk."],
    keyLabs: ["blood pressure", "mental status; no routine level"],
    nclexTraps: ["Eating disorder history is a classic safety stop because of seizures."],
    tags: ["depression", "smoking cessation", "seizure", "mental health"]
  },
  {
    name: "Trazodone",
    generic: "trazodone",
    brandExamples: ["Desyrel", "Oleptro"],
    aliases: ["trazadone", "trazdone", "trazodone hydrochloride", "sari", "serotonin antagonist reuptake inhibitor", "sleep antidepressant"],
    class: "Serotonin antagonist and reuptake inhibitor (SARI) antidepressant",
    boxedWarning: "Boxed warning: antidepressants increase the risk of suicidal thoughts and behaviors in children, adolescents, and young adults. Monitor closely for worsening depression, suicidality, agitation, or unusual behavior changes.",
    mechanism: "Antagonizes serotonin 5-HT2 receptors and inhibits serotonin reuptake. Histamine H1 blockade contributes to sedation, and alpha-1 blockade contributes to orthostatic hypotension.",
    usedToTreat: ["Major depressive disorder.", "Often prescribed off-label for insomnia when the prescriber decides benefits outweigh risks."],
    contraindications: ["MAOI use within 14 days.", "Hypersensitivity to trazodone.", "Clarify before giving with significant QT prolongation risk, severe orthostatic hypotension/falls, active suicidal crisis, or interacting serotonergic drugs."],
    nursingEssentials: ["Assess mood and suicidal ideation, especially early in therapy and after dose changes.", "Monitor sedation, dizziness, falls, and orthostatic blood pressure.", "Teach the client to rise slowly and avoid alcohol or other CNS depressants unless specifically approved.", "Report priapism, serotonin syndrome symptoms, fainting, palpitations, or worsening mood immediately."],
    interactions: ["MAOIs, linezolid, methylene blue, tramadol, triptans, lithium, St. John's wort, SSRIs, SNRIs, and other serotonergic drugs increase serotonin syndrome risk.", "Alcohol, opioids, benzodiazepines, antihistamines, and other CNS depressants increase sedation and fall risk.", "QT-prolonging drugs can increase dysrhythmia risk.", "Antihypertensives can worsen orthostatic hypotension."],
    keyLabs: ["Sodium if SIADH/hyponatremia risk is present", "ECG/QT assessment if the client has cardiac risk or QT-prolonging interacting drugs", "Pregnancy status if applicable"],
    nclexTraps: ["Trazodone is not a benzodiazepine. NCLEX focus is sedation/falls, orthostatic hypotension, serotonin syndrome, suicidality warning, QT risk in vulnerable clients, and priapism."],
    populationRisks: [
      { type: "geriatric", label: "Geriatric caution", note: "Older adults have higher sedation, fall, orthostatic hypotension, and hyponatremia risk." },
      { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Clarify risk-benefit and current prescriber guidance during pregnancy or lactation." }
    ],
    tags: ["antidepressant", "SARI", "depression", "insomnia", "sedation", "orthostatic hypotension", "serotonin syndrome", "priapism", "QT prolongation", "suicide warning", "geriatric caution"],
    nclexEssential: true
  },
  {
    name: "Haloperidol",
    generic: "haloperidol",
    brandExamples: ["Haldol"],
    aliases: ["typical antipsychotic"],
    class: "First-generation antipsychotic",
    boxedWarning: "Boxed warning: increased mortality in elderly patients with dementia-related psychosis.",
    mechanism: "Blocks dopamine D2 receptors.",
    nursingEssentials: ["Monitor EPS, neuroleptic malignant syndrome, sedation, QT prolongation.", "Assess temperature, rigidity, mental status changes.", "Use fall precautions."],
    interactions: ["Other QT-prolonging drugs increase dysrhythmia risk.", "CNS depressants increase sedation.", "Levodopa effects may be reduced."],
    keyLabs: ["ECG/QT risk", "potassium", "magnesium", "CK if NMS suspected"],
    nclexTraps: ["Fever plus rigidity plus altered mental status is NMS until proven otherwise."],
    tags: ["antipsychotic", "eps", "nms", "qt", "mental health"]
  },
  {
    name: "Lorazepam",
    generic: "lorazepam",
    brandExamples: ["Ativan"],
    aliases: ["benzodiazepine", "benzo"],
    class: "Benzodiazepine",
    boxedWarning: "Boxed warnings include abuse/misuse/addiction, dependence/withdrawal, and profound sedation/respiratory depression with opioids.",
    mechanism: "Enhances GABA activity in the CNS.",
    nursingEssentials: ["Monitor sedation, respiratory status, fall risk.", "Use for acute anxiety, seizures, alcohol withdrawal per orders.", "Do not stop chronic therapy abruptly."],
    interactions: ["Opioids, alcohol, sedatives increase respiratory depression.", "Other CNS depressants increase falls/sedation."],
    keyLabs: ["No routine lab; assess RR, sedation, CIWA if withdrawal context"],
    nclexTraps: ["Benzodiazepine plus opioid is a respiratory safety red flag."],
    tags: ["anxiety", "seizure", "withdrawal", "sedation", "respiratory depression"]
  },
  {
    name: "Ciprofloxacin",
    generic: "ciprofloxacin",
    brandExamples: ["Cipro"],
    aliases: ["fluoroquinolone"],
    class: "Fluoroquinolone antibiotic",
    boxedWarning: "Boxed warnings include disabling tendon/neuropathy/CNS effects, tendon rupture, peripheral neuropathy, CNS effects, myasthenia gravis exacerbation, and aortic aneurysm/dissection risk in certain clients.",
    mechanism: "Inhibits bacterial DNA gyrase/topoisomerase.",
    nursingEssentials: ["Watch tendon pain, neuropathy, confusion, QT risk.", "Avoid with myasthenia gravis unless directed.", "Separate from calcium/iron/antacids."],
    interactions: ["Warfarin effect can increase.", "Antacids/iron/calcium reduce absorption.", "Other QT-prolonging drugs increase dysrhythmia risk."],
    keyLabs: ["renal function", "INR if on warfarin", "glucose in diabetes risk"],
    nclexTraps: ["New tendon pain means stop activity and call; rupture risk is real."],
    tags: ["antibiotic", "fluoroquinolone", "tendon", "qt", "warfarin"]
  },
  {
    name: "Azithromycin",
    generic: "azithromycin",
    brandExamples: ["Zithromax"],
    aliases: ["z pack", "macrolide"],
    class: "Macrolide antibiotic",
    boxedWarning: "No boxed warning commonly emphasized; QT prolongation and hepatotoxicity warnings matter.",
    mechanism: "Inhibits bacterial protein synthesis by binding the 50S ribosomal subunit.",
    nursingEssentials: ["Assess allergy, diarrhea, liver symptoms, QT risk.", "Complete prescribed course.", "Use caution in dysrhythmia risk."],
    interactions: ["Other QT-prolonging drugs increase risk.", "Warfarin effect may increase; monitor INR."],
    keyLabs: ["LFTs if symptoms/risk", "INR if on warfarin", "ECG/QT risk"],
    nclexTraps: ["Palpitations/syncope on QT-risk meds need attention, not reassurance."],
    tags: ["antibiotic", "macrolide", "qt", "respiratory"]
  },
  {
    name: "Ceftriaxone",
    generic: "ceftriaxone",
    brandExamples: ["Rocephin"],
    aliases: ["third generation cephalosporin"],
    class: "Third-generation cephalosporin antibiotic",
    boxedWarning: "No boxed warning commonly emphasized; severe allergy, biliary sludging, and neonatal calcium interaction warnings matter.",
    mechanism: "Inhibits bacterial cell wall synthesis.",
    nursingEssentials: ["Assess beta-lactam allergy history.", "Monitor diarrhea/C. difficile symptoms.", "Know neonatal calcium compatibility restrictions."],
    interactions: ["Calcium-containing IV solutions are unsafe with ceftriaxone in neonates.", "Warfarin effect may increase."],
    keyLabs: ["WBC", "culture results", "LFTs if prolonged", "INR if on warfarin"],
    nclexTraps: ["Severe watery diarrhea after antibiotics can signal C. difficile."],
    tags: ["antibiotic", "cephalosporin", "infection", "c diff"]
  },
  {
    name: "Metronidazole",
    generic: "metronidazole",
    brandExamples: ["Flagyl"],
    aliases: ["flagyl"],
    class: "Nitroimidazole antibiotic/antiprotozoal",
    boxedWarning: "Some products include carcinogenicity warnings from animal data; neurotoxicity and alcohol reaction concerns are high yield.",
    mechanism: "Disrupts DNA synthesis in anaerobic organisms and protozoa.",
    nursingEssentials: ["Avoid alcohol during therapy and for the recommended period after.", "Report numbness/tingling or seizures.", "Metallic taste and GI upset can occur."],
    interactions: ["Alcohol can cause disulfiram-like reaction.", "Warfarin effect can increase.", "Lithium levels may increase."],
    keyLabs: ["INR if on warfarin", "LFTs if prolonged", "neurologic assessment"],
    nclexTraps: ["Alcohol avoidance is not optional teaching with metronidazole."],
    tags: ["antibiotic", "anaerobe", "c diff", "alcohol", "warfarin"]
  },
  {
    name: "Trimethoprim-sulfamethoxazole",
    generic: "trimethoprim-sulfamethoxazole",
    brandExamples: ["Bactrim", "Septra"],
    aliases: ["tmp-smx", "bactrim", "sulfa"],
    class: "Sulfonamide antibiotic combination",
    boxedWarning: "No single universal boxed warning for all products; severe skin reactions, blood dyscrasias, hyperkalemia, and kernicterus risk are major concerns.",
    mechanism: "Blocks sequential steps in bacterial folate synthesis.",
    nursingEssentials: ["Assess sulfa allergy.", "Watch rash, sore throat, bruising, hyperkalemia.", "Encourage fluids if appropriate."],
    interactions: ["Warfarin effect can increase significantly.", "ACE inhibitors/ARBs/spironolactone increase hyperkalemia risk.", "Methotrexate toxicity risk increases."],
    keyLabs: ["CBC", "potassium", "creatinine", "INR if on warfarin"],
    nclexTraps: ["Rash with mucosal involvement is an urgent stop-and-call cue."],
    tags: ["antibiotic", "sulfa", "uti", "potassium", "warfarin"]
  },
  {
    name: "Ondansetron",
    generic: "ondansetron",
    brandExamples: ["Zofran"],
    aliases: ["antiemetic"],
    class: "5-HT3 receptor antagonist antiemetic",
    boxedWarning: "No boxed warning commonly emphasized; QT prolongation and serotonin syndrome risk are important warnings.",
    mechanism: "Blocks serotonin 5-HT3 receptors involved in nausea/vomiting pathways.",
    nursingEssentials: ["Monitor nausea relief, hydration, constipation.", "Assess QT risk and electrolyte abnormalities.", "Use caution with other serotonergic drugs."],
    interactions: ["Other QT-prolonging drugs increase dysrhythmia risk.", "SSRIs/SNRIs/MAOIs may increase serotonin syndrome risk."],
    keyLabs: ["potassium", "magnesium", "ECG/QT risk"],
    nclexTraps: ["Correct low potassium/magnesium when QT-risk meds are stacking."],
    tags: ["antiemetic", "nausea", "qt", "serotonin"]
  },
  {
    name: "Omeprazole",
    generic: "omeprazole",
    brandExamples: ["Prilosec"],
    aliases: ["ppi", "proton pump inhibitor"],
    class: "Proton pump inhibitor",
    boxedWarning: "No boxed warning commonly emphasized; C. difficile risk, hypomagnesemia, fractures, B12 deficiency, and kidney injury warnings matter with long-term use.",
    mechanism: "Irreversibly inhibits gastric proton pumps to reduce acid secretion.",
    nursingEssentials: ["Give before meals when scheduled.", "Monitor long-term magnesium/B12 concerns and diarrhea.", "Review need for ongoing therapy."],
    interactions: ["Clopidogrel activation can be reduced by omeprazole.", "Warfarin, diazepam, phenytoin interactions may occur.", "Drugs needing acidic pH may absorb differently."],
    keyLabs: ["magnesium if long-term", "B12 if long-term symptoms", "creatinine if kidney concern"],
    nclexTraps: ["Chronic watery diarrhea on acid suppression can be C. difficile."],
    tags: ["ppi", "gerd", "gi bleed", "magnesium", "clopidogrel"]
  },
  {
    name: "Famotidine",
    generic: "famotidine",
    brandExamples: ["Pepcid"],
    aliases: ["h2 blocker"],
    class: "Histamine-2 receptor antagonist",
    boxedWarning: "No boxed warning commonly emphasized; confusion can occur especially in older adults or renal impairment.",
    mechanism: "Blocks H2 receptors on gastric parietal cells, reducing acid secretion.",
    nursingEssentials: ["Monitor symptom relief and GI bleeding signs.", "Dose adjustment may be needed in renal impairment.", "Assess confusion in older adults."],
    interactions: ["Acid-reducing effects can alter absorption of pH-dependent drugs."],
    keyLabs: ["creatinine/eGFR", "hemoglobin/occult blood if GI bleed concern"],
    nclexTraps: ["New confusion in an older adult after an H2 blocker is worth assessing."],
    tags: ["h2 blocker", "gerd", "renal", "older adult"]
  },
  {
    name: "Methotrexate",
    generic: "methotrexate",
    brandExamples: ["Trexall", "Rasuvo"],
    aliases: ["dmard", "antimetabolite"],
    class: "Antimetabolite; DMARD; chemotherapy agent",
    boxedWarning: "Boxed warnings include serious toxic reactions, embryo-fetal toxicity, bone marrow suppression, hepatotoxicity, pulmonary toxicity, serious infections, GI toxicity, and dosing errors.",
    mechanism: "Inhibits folate-dependent pathways, reducing cell replication and immune activity.",
    nursingEssentials: ["For non-oncology use, often weekly, not daily; dosing errors can be fatal.", "Monitor infection, mouth sores, bleeding, liver/lung symptoms.", "Avoid pregnancy."],
    interactions: ["NSAIDs, TMP-SMX, penicillins, PPIs can increase toxicity risk.", "Alcohol increases hepatotoxicity.", "Live vaccines require caution."],
    keyLabs: ["CBC", "AST/ALT", "creatinine", "pregnancy status when applicable"],
    nclexTraps: ["Daily methotrexate for rheumatoid arthritis is a question-the-order cue."],
    tags: ["dmard", "chemo", "weekly", "pregnancy", "cbc", "liver"]
  },
  {
    name: "Alteplase",
    generic: "alteplase",
    brandExamples: ["Activase"],
    aliases: ["tpa", "thrombolytic"],
    class: "Thrombolytic; tissue plasminogen activator",
    boxedWarning: "Boxed warning: significant and sometimes fatal bleeding can occur.",
    mechanism: "Converts plasminogen to plasmin to break down fibrin clots.",
    nursingEssentials: ["Screen for contraindications before stroke/MI/PE use.", "Monitor neurologic status and bleeding.", "Avoid unnecessary sticks/procedures after administration."],
    interactions: ["Anticoagulants and antiplatelets increase bleeding risk.", "Recent surgery/trauma increases risk."],
    keyLabs: ["platelets", "INR/PT", "aPTT", "glucose in stroke mimic workup", "blood pressure"],
    nclexTraps: ["Severe headache or neuro worsening after alteplase is an intracranial bleed concern."],
    tags: ["stroke", "thrombolytic", "bleeding", "tpa", "emergency"]
  },
  {
    name: "Acetylcysteine",
    generic: "acetylcysteine",
    brandExamples: ["Acetadote", "Mucomyst"],
    aliases: ["nac", "tylenol antidote"],
    class: "Antidote for acetaminophen toxicity; mucolytic",
    boxedWarning: "No boxed warning commonly emphasized; anaphylactoid reactions can occur with IV use.",
    mechanism: "Replenishes glutathione, helping detoxify acetaminophen's toxic metabolite.",
    nursingEssentials: ["Give as early as possible for acetaminophen overdose.", "Monitor airway/rash during IV infusion.", "Use acetaminophen level timing/nomogram per protocol."],
    interactions: ["Activated charcoal timing can affect absorption in overdose protocols."],
    keyLabs: ["acetaminophen level", "AST/ALT", "INR", "bilirubin", "creatinine"],
    nclexTraps: ["A normal early acetaminophen level can be misleading if drawn too soon."],
    tags: ["antidote", "acetaminophen", "overdose", "liver", "nac"]
  },
  {
    name: "Phytonadione",
    generic: "phytonadione",
    brandExamples: ["Vitamin K"],
    aliases: ["vitamin k", "warfarin reversal"],
    class: "Vitamin K; warfarin reversal agent",
    boxedWarning: "No boxed warning commonly emphasized; severe reactions can occur with IV administration, so route/rate matter.",
    mechanism: "Restores vitamin K-dependent clotting factor production.",
    nursingEssentials: ["Used for elevated INR/warfarin reversal per protocol.", "Monitor bleeding and INR trend.", "IV route requires caution and slow administration if used."],
    interactions: ["Reverses warfarin effect and can make re-anticoagulation harder temporarily."],
    keyLabs: ["INR/PT", "hemoglobin/hematocrit if bleeding"],
    nclexTraps: ["Vitamin K works slower than PCC/FFP strategies; urgency depends on bleeding severity."],
    tags: ["vitamin k", "warfarin", "antidote", "inr", "bleeding"]
  },
  {
    name: "Protamine sulfate",
    generic: "protamine sulfate",
    brandExamples: ["Protamine"],
    aliases: ["heparin antidote"],
    class: "Heparin reversal agent",
    boxedWarning: "No boxed warning commonly emphasized; severe hypotension, bradycardia, pulmonary hypertension, and anaphylaxis can occur.",
    mechanism: "Binds heparin to form an inactive complex.",
    nursingEssentials: ["Used to reverse heparin; partial effect for some LMWH situations per protocol.", "Give slowly and monitor blood pressure/airway.", "Assess fish allergy/previous exposure/vasectomy history per policy."],
    interactions: ["Reverses heparin anticoagulation."],
    keyLabs: ["aPTT", "anti-Xa if used", "hemoglobin/hematocrit if bleeding"],
    nclexTraps: ["Do not confuse protamine for warfarin reversal; vitamin K reverses warfarin."],
    tags: ["heparin", "antidote", "bleeding", "aptt"]
  },
  {
    name: "Tramadol",
    generic: "tramadol",
    brandExamples: ["Ultram"],
    aliases: ["opioid like analgesic"],
    class: "Opioid analgesic with serotonin/norepinephrine reuptake effects",
    boxedWarning: "Boxed warnings include addiction/abuse/misuse, life-threatening respiratory depression, ultra-rapid metabolism risks in children, neonatal opioid withdrawal, and benzodiazepine/CNS depressant interaction risk.",
    mechanism: "Weak mu-opioid agonist and inhibits serotonin/norepinephrine reuptake.",
    nursingEssentials: ["Monitor sedation, respirations, seizure risk, serotonin syndrome.", "Avoid in children and breastfeeding contexts per warnings.", "Use caution in seizure history."],
    interactions: ["SSRIs/SNRIs/MAOIs/triptans increase serotonin syndrome risk.", "Benzodiazepines/alcohol increase respiratory depression.", "Drugs lowering seizure threshold increase seizure risk."],
    keyLabs: ["No routine lab; assess RR, sedation, seizure risk, serotonin syndrome signs"],
    nclexTraps: ["Tramadol is not harmless. It can cause seizures, serotonin syndrome, and respiratory depression."],
    tags: ["pain", "opioid", "serotonin", "seizure", "respiratory depression"]
  }
);

const aniPharmContraindicationNotes = {
  "Acetaminophen": ["Severe hepatic impairment or active severe liver disease.", "Known hypersensitivity."],
  "Aspirin": ["Active bleeding or bleeding disorder unless specifically directed.", "Aspirin/NSAID allergy or aspirin-exacerbated respiratory disease.", "Children/teens with influenza, varicella/chickenpox, or other viral illness because aspirin/salicylates increase Reye syndrome risk."],
  "Warfarin": ["Pregnancy except very narrow specialist-directed situations.", "Active major bleeding or high-risk hemorrhagic condition.", "Recent or planned CNS/eye surgery without explicit specialist direction."],
  "Heparin": ["Active major bleeding.", "History of heparin-induced thrombocytopenia.", "Severe uncontrolled hypertension or high-risk bleeding requires urgent clarification."],
  "Enoxaparin": ["Active major bleeding.", "History of heparin-induced thrombocytopenia.", "Use extreme caution or alternate dosing in severe renal impairment."],
  "Apixaban": ["Active pathological bleeding.", "Severe hypersensitivity to apixaban.", "Neuraxial anesthesia/procedure timing must be checked because spinal hematoma can cause paralysis."],
  "Clopidogrel": ["Active pathological bleeding such as intracranial bleed or active GI bleed.", "Severe hypersensitivity."],
  "Metoprolol": ["Severe bradycardia.", "Second- or third-degree heart block without a pacemaker.", "Cardiogenic shock or decompensated heart failure."],
  "Lisinopril": ["Pregnancy.", "History of ACE-inhibitor angioedema.", "Do not combine with aliskiren in clients with diabetes.", "Severe hyperkalemia requires holding/clarifying."],
  "Furosemide": ["Anuria.", "Severe hypersensitivity; sulfonamide cross-reactivity is uncommon but should be assessed."],
  "Spironolactone": ["Hyperkalemia.", "Addison disease.", "Anuria or significant acute kidney injury."],
  "Digoxin": ["Ventricular fibrillation.", "Use extreme caution with significant AV block, severe bradycardia, or hypokalemia."],
  "Nitroglycerin": ["Recent PDE-5 inhibitor use such as sildenafil, tadalafil, or vardenafil.", "Severe hypotension.", "Severe anemia or increased intracranial pressure requires clarification."],
  "Regular insulin": ["Current hypoglycemia.", "Do not give scheduled/meal-related insulin when nutrition is unexpectedly unavailable without clarifying orders."],
  "Metformin": ["Severe renal impairment.", "Metabolic acidosis or diabetic ketoacidosis.", "Hold around iodinated contrast or acute hypoxic/unstable states per protocol."],
  "Levothyroxine": ["Untreated thyrotoxicosis.", "Uncorrected adrenal insufficiency.", "Do not use for weight loss."],
  "Albuterol": ["Severe hypersensitivity.", "Use caution with serious tachyarrhythmias or unstable cardiac disease."],
  "Prednisone": ["Systemic fungal infection unless specifically treated/ordered.", "Live vaccines during high-dose immunosuppression require clarification."],
  "Morphine": ["Significant respiratory depression.", "Acute/severe bronchial asthma in an unmonitored setting.", "Known or suspected GI obstruction/paralytic ileus."],
  "Naloxone": ["Known hypersensitivity; emergency reversal is still guided by risk-benefit."],
  "Vancomycin": ["Severe hypersensitivity.", "Renal impairment is not an absolute contraindication but requires dosing/level monitoring."],
  "Gentamicin": ["Hypersensitivity to aminoglycosides.", "Use extreme caution with myasthenia gravis, renal impairment, or pregnancy unless benefits outweigh risks."],
  "Lithium": ["Severe renal impairment.", "Severe cardiovascular disease.", "Dehydration or sodium depletion until corrected.", "Pregnancy requires specialist risk-benefit review."],
  "Fluoxetine": ["MAOI use within unsafe washout window.", "Linezolid or IV methylene blue unless carefully managed.", "Thioridazine or pimozide use because of serious rhythm risk."],
  "Clozapine": ["History of clozapine-induced severe neutropenia or agranulocytosis.", "ANC below required threshold.", "Uncontrolled seizure disorder requires urgent prescriber review."],
  "Magnesium sulfate": ["Hypermagnesemia.", "Heart block or significant myocardial damage unless specialist-directed.", "Severe renal failure requires extreme caution and close monitoring."],
  "Oxytocin": ["Nonreassuring fetal status when vaginal delivery is not imminent.", "Cephalopelvic disproportion.", "Hypertonic uterus or situations where labor/vaginal birth is contraindicated."],
  "Amiodarone": ["Cardiogenic shock.", "Severe sinus-node dysfunction or AV block without pacemaker.", "Use in pregnancy only with specialist direction because fetal thyroid/neurodevelopment risks exist."],
  "Adenosine": ["Second- or third-degree AV block or sick sinus syndrome without pacemaker.", "Known hypersensitivity.", "Use caution with asthma/COPD because bronchospasm can occur."],
  "Class I antiarrhythmics": ["Serious hypersensitivity to the selected agent.", "Clarify severe hypotension, cardiogenic shock, high-grade heart block, marked QRS widening, or new/worsening dysrhythmia before giving.", "Structural heart disease/post-MI risk is a major clarification point for selected Class IC agents."],
  "Class II antiarrhythmics": ["Severe bradycardia.", "Second- or third-degree AV block without a pacemaker.", "Cardiogenic shock or acute decompensated heart failure unless specialist-directed.", "Use caution with bronchospasm-prone clients depending beta blocker selectivity."],
  "Class III antiarrhythmics": ["Baseline prolonged QT or torsades history requires clarification.", "Correct significant hypokalemia or hypomagnesemia as ordered before QT-prolonging therapy.", "Severe bradycardia or high-grade AV block without pacemaker requires clarification."],
  "Class IV antiarrhythmics": ["Severe hypotension.", "Sick sinus syndrome or second/third-degree AV block without a pacemaker.", "Acute decompensated heart failure or severe LV dysfunction requires clarification, especially with verapamil/diltiazem."],
  "Atropine": ["Narrow-angle glaucoma, obstructive uropathy, or GI obstruction require caution/clarification.", "Tachyarrhythmia risk must be assessed."],
  "Epinephrine": ["No absolute contraindication in anaphylaxis.", "For non-emergency use, serious tachyarrhythmias or severe hypertension require caution."],
  "Norepinephrine": ["Do not use as a substitute for volume resuscitation when severe hypovolemia is uncorrected.", "Mesenteric/peripheral thrombosis risk requires close monitoring."],
  "Hydralazine": ["Hypersensitivity.", "Coronary artery disease or rheumatic mitral valve disease requires caution.", "Lupus-like syndrome history requires review."],
  "Amlodipine": ["Severe hypotension.", "Cardiogenic shock or severe aortic stenosis requires caution."],
  "Losartan": ["Pregnancy.", "Do not combine with aliskiren in clients with diabetes.", "Severe hyperkalemia or acute kidney injury requires holding/clarifying."],
  "Hydrochlorothiazide": ["Anuria.", "Severe sulfonamide hypersensitivity requires review.", "Severe electrolyte depletion should be corrected/clarified."],
  "Insulin glargine": ["Current hypoglycemia.", "Do not use for diabetic ketoacidosis or rapid glucose correction."],
  "Insulin lispro": ["Current hypoglycemia.", "Do not give rapid-acting meal insulin when the meal is not present unless orders specifically account for it."],
  "Glucagon": ["Pheochromocytoma.", "Insulinoma.", "Known hypersensitivity."],
  "Potassium chloride": ["Hyperkalemia.", "Severe renal failure/anuria without dialysis plan.", "Never give IV push."],
  "Calcium gluconate": ["Hypercalcemia.", "Use extreme caution with digoxin toxicity or significant dysrhythmia risk."],
  "Phenytoin": ["Sinus bradycardia, sinoatrial block, second- or third-degree AV block, or Adams-Stokes syndrome.", "Pregnancy requires risk-benefit review because fetal harm can occur."],
  "Levetiracetam": ["Known hypersensitivity.", "Renal impairment requires dose review."],
  "Valproic acid": ["Pregnancy for migraine prophylaxis and avoid when possible for seizure/bipolar unless no safer effective option.", "Active significant liver disease.", "Known mitochondrial disorders such as POLG-related disease.", "Urea cycle disorders."],
  "Isotretinoin": ["Pregnancy.", "Clients who can become pregnant must meet pregnancy-prevention requirements.", "Hypersensitivity to isotretinoin or product components."],
  "Acitretin": ["Pregnancy.", "Clients who can become pregnant must follow prolonged pregnancy-avoidance precautions after therapy.", "Severe liver or kidney impairment.", "Chronic abnormally elevated lipids require clarification."],
  "Mycophenolate": ["Pregnancy unless no safer transplant/immune option is acceptable under specialist direction.", "Known hypersensitivity.", "Active serious infection requires urgent review."],
  "Thalidomide": ["Pregnancy.", "Clients who can become pregnant must meet pregnancy-prevention requirements.", "Severe hypersensitivity."],
  "Carbamazepine": ["History of bone marrow depression.", "MAOI use within unsafe washout window.", "Pregnancy requires risk-benefit review because fetal harm can occur.", "Serious hypersensitivity or prior severe dermatologic reaction."],
  "Doxycycline": ["Pregnancy and children under 8 require strong indication-specific review.", "Hypersensitivity to tetracyclines."],
  "Tetracycline": ["Pregnancy.", "Children under 8 unless a specialist-directed benefit outweighs risk.", "Hypersensitivity to tetracyclines."],
  "Atorvastatin": ["Pregnancy for routine lipid management.", "Active liver disease or unexplained persistent transaminase elevation.", "Hypersensitivity."],
  "Finasteride": ["Pregnancy exposure; pregnant clients should not handle crushed or broken tablets.", "Hypersensitivity."],
  "Misoprostol": ["Pregnancy when used for ulcer prevention.", "Clarify indication before use in any pregnant client.", "Hypersensitivity to prostaglandins."],
  "Sertraline": ["MAOI use within unsafe washout window.", "Linezolid or IV methylene blue unless carefully managed.", "Pimozide use."],
  "Bupropion": ["Seizure disorder.", "Current or prior bulimia/anorexia nervosa.", "Abrupt alcohol, benzodiazepine, barbiturate, or antiepileptic discontinuation.", "MAOI use within unsafe washout window."],
  "Haloperidol": ["Severe CNS depression or coma.", "Parkinson disease/Lewy body dementia requires extreme caution.", "Known QT prolongation or uncontrolled dysrhythmia risk requires review."],
  "Lorazepam": ["Severe respiratory insufficiency or sleep apnea without close monitoring.", "Acute narrow-angle glaucoma.", "Concomitant opioids/CNS depressants require strong caution."],
  "Ciprofloxacin": ["History of serious fluoroquinolone reaction.", "Myasthenia gravis.", "Avoid when safer options exist for uncomplicated infections because disabling adverse effects can occur."],
  "Azithromycin": ["Known macrolide hypersensitivity.", "History of cholestatic jaundice/hepatic dysfunction from azithromycin.", "High-risk QT prolongation requires review."],
  "Ceftriaxone": ["Severe cephalosporin allergy.", "Neonates receiving calcium-containing IV products.", "Hyperbilirubinemic neonates require avoidance/clarification."],
  "Metronidazole": ["Alcohol use during therapy and immediate post-therapy window.", "Disulfiram use within recent period.", "First trimester pregnancy requires indication-specific review."],
  "Trimethoprim-sulfamethoxazole": ["Sulfonamide hypersensitivity.", "Infants under 2 months.", "Marked hepatic damage or severe renal disease when monitoring is not possible.", "Pregnancy near term requires caution."],
  "Ondansetron": ["Known hypersensitivity.", "Apomorphine use.", "Congenital long-QT syndrome or high-risk QT stacking requires review."],
  "Omeprazole": ["Known hypersensitivity to PPIs.", "Avoid/clarify with clopidogrel when antiplatelet effect is critical."],
  "Famotidine": ["Known hypersensitivity to H2 blockers.", "Renal impairment requires dosing review."],
  "Methotrexate": ["Pregnancy.", "Breastfeeding.", "Severe liver disease, significant immunodeficiency, blood dyscrasias, or severe renal impairment.", "Non-oncology daily dosing is a major safety error."],
  "Alteplase": ["Active internal bleeding.", "History/current intracranial hemorrhage or high-risk intracranial lesion.", "Recent major surgery/trauma or uncontrolled severe hypertension requires protocol screening."],
  "Acetylcysteine": ["Known hypersensitivity; overdose treatment is risk-benefit guided.", "Asthma history requires close monitoring for bronchospasm/anaphylactoid reaction."],
  "Phytonadione": ["Known hypersensitivity.", "IV route should be reserved/slow because severe reactions can occur."],
  "Protamine sulfate": ["Known hypersensitivity.", "High risk of reaction with prior protamine exposure, fish allergy, vasectomy history, or NPH insulin exposure requires monitoring."],
  "Tramadol": ["Children under 12 and post-tonsillectomy/adenoidectomy clients under 18.", "Significant respiratory depression.", "Seizure disorder or MAOI use requires avoidance/clarification.", "Known or suspected GI obstruction."]
};

const aniPharmPopulationRiskNotes = {
  "Aspirin": [
    { type: "pediatric", label: "Pediatric high-risk", note: "Avoid in children/teens with influenza, varicella/chickenpox, or other viral illness because aspirin/salicylates increase Reye syndrome risk." },
    { type: "pregnancy", label: "Pregnancy caution", note: "Avoid routine use late in pregnancy unless specifically directed." }
  ],
  "Warfarin": [
    { type: "pregnancy", label: "Pregnancy unsafe", note: "Fetal toxicity/teratogenic risk. Avoid in pregnancy unless a specialist identifies a rare exception." }
  ],
  "Lisinopril": [
    { type: "pregnancy", label: "Pregnancy unsafe", note: "ACE inhibitors can cause fetal toxicity. Stop/notify provider if pregnancy is detected." }
  ],
  "Losartan": [
    { type: "pregnancy", label: "Pregnancy unsafe", note: "ARBs can cause fetal toxicity. Stop/notify provider if pregnancy is detected." }
  ],
  "Spironolactone": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Antiandrogenic effects make pregnancy use a clarify-before-giving situation." }
  ],
  "Nitroglycerin": [
    { type: "geriatric", label: "Geriatric caution", note: "Older adults are more vulnerable to orthostatic hypotension and falls." }
  ],
  "Metformin": [
    { type: "geriatric", label: "Geriatric caution", note: "Renal decline increases lactic acidosis risk; verify kidney function." }
  ],
  "Morphine": [
    { type: "geriatric", label: "Geriatric caution", note: "Higher risk of sedation, respiratory depression, falls, and delirium." },
    { type: "pediatric", label: "Pediatric caution", note: "Requires weight-based dosing and close respiratory monitoring." }
  ],
  "Gentamicin": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Aminoglycosides can pose fetal ototoxicity risk; use only when benefits justify risk." },
    { type: "geriatric", label: "Geriatric caution", note: "Renal decline increases nephrotoxicity and ototoxicity risk." }
  ],
  "Lithium": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Pregnancy requires specialist risk-benefit review and close monitoring." },
    { type: "geriatric", label: "Geriatric caution", note: "Renal changes, dehydration, and sodium shifts make toxicity more likely." }
  ],
  "Fluoxetine": [
    { type: "pediatric", label: "Pediatric/young adult warning", note: "Boxed warning for suicidal thoughts/behaviors in pediatric and young adult patients." },
    { type: "geriatric", label: "Geriatric caution", note: "Watch hyponatremia/SIADH and fall risk." }
  ],
  "Clozapine": [
    { type: "geriatric", label: "Geriatric caution", note: "Increased mortality warning in elderly clients with dementia-related psychosis." }
  ],
  "Magnesium sulfate": [
    { type: "geriatric", label: "Geriatric/renal caution", note: "Renal impairment increases toxicity risk." }
  ],
  "Oxytocin": [
    { type: "pregnancy", label: "Maternity high-alert", note: "Use only for appropriate obstetric indications with fetal/maternal monitoring." }
  ],
  "Amiodarone": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Can affect fetal thyroid and development; specialist-directed use only." },
    { type: "geriatric", label: "Geriatric caution", note: "Older adults are vulnerable to bradycardia, thyroid, liver, lung, and drug-interaction toxicity." }
  ],
  "Class I antiarrhythmics": [
    { type: "geriatric", label: "Geriatric caution", note: "Older adults are more vulnerable to conduction slowing, hypotension, renal/hepatic accumulation, and proarrhythmia." }
  ],
  "Class II antiarrhythmics": [
    { type: "geriatric", label: "Geriatric caution", note: "Higher risk of bradycardia, hypotension, falls, and masked hypoglycemia symptoms." }
  ],
  "Class III antiarrhythmics": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Selected agents can affect fetal safety; verify current label and specialist direction." },
    { type: "geriatric", label: "Geriatric caution", note: "Higher risk of QT prolongation, bradycardia, organ toxicity, and drug interactions." }
  ],
  "Class IV antiarrhythmics": [
    { type: "geriatric", label: "Geriatric caution", note: "Higher risk of bradycardia, hypotension, heart block, constipation, and falls." }
  ],
  "Atropine": [
    { type: "geriatric", label: "Geriatric caution", note: "Anticholinergic burden can worsen confusion, urinary retention, glaucoma, and constipation." }
  ],
  "Hydralazine": [
    { type: "geriatric", label: "Geriatric caution", note: "Higher risk of hypotension, dizziness, and falls." }
  ],
  "Hydrochlorothiazide": [
    { type: "geriatric", label: "Geriatric caution", note: "Watch sodium, potassium, dehydration, gout, and falls." }
  ],
  "Insulin glargine": [
    { type: "geriatric", label: "Geriatric caution", note: "Hypoglycemia can present atypically and can cause falls/confusion." }
  ],
  "Insulin lispro": [
    { type: "geriatric", label: "Geriatric caution", note: "Rapid hypoglycemia risk is higher if meal intake is inconsistent." }
  ],
  "Phenytoin": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Fetal harm risk. Use requires specialist guidance and risk-benefit review." },
    { type: "geriatric", label: "Geriatric caution", note: "Higher fall, ataxia, drug-interaction, and low-albumin toxicity risk." }
  ],
  "Valproic acid": [
    { type: "pregnancy", label: "Pregnancy unsafe", note: "Major fetal risk including neural tube defects; avoid in pregnancy when possible." },
    { type: "pediatric", label: "Pediatric caution", note: "Young children have higher serious hepatotoxicity risk." }
  ],
  "Isotretinoin": [
    { type: "pregnancy", label: "Pregnancy unsafe", note: "Severe birth defects and pregnancy loss can occur. Verify pregnancy-prevention requirements before therapy." }
  ],
  "Acitretin": [
    { type: "pregnancy", label: "Pregnancy unsafe", note: "Severe birth defects can occur, and pregnancy avoidance continues for a prolonged period after stopping." }
  ],
  "Mycophenolate": [
    { type: "pregnancy", label: "Pregnancy unsafe", note: "Embryo-fetal toxicity can cause pregnancy loss and congenital malformations; specialist review is required." }
  ],
  "Thalidomide": [
    { type: "pregnancy", label: "Pregnancy unsafe", note: "Major teratogenic risk. Pregnancy exposure can cause severe, life-threatening birth defects or fetal death." },
    { type: "geriatric", label: "Geriatric caution", note: "Sedation, neuropathy, constipation, and thromboembolism risk can be harder on older adults." }
  ],
  "Carbamazepine": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Fetal harm can occur; seizure control and safer alternatives require specialist risk-benefit review." },
    { type: "geriatric", label: "Geriatric caution", note: "Higher hyponatremia, sedation, fall, and drug-interaction risk." }
  ],
  "Doxycycline": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Avoid routine use because tetracyclines can affect fetal teeth and bone; use only when benefits justify risk." },
    { type: "pediatric", label: "Pediatric caution", note: "Avoid routine use under age 8 unless indication-specific benefits outweigh tooth/bone risk." }
  ],
  "Tetracycline": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Can affect fetal teeth and bone; generally avoid in pregnancy unless specifically justified." },
    { type: "pediatric", label: "Pediatric caution", note: "Avoid routine use under age 8 because of tooth discoloration and bone-growth concerns." }
  ],
  "Atorvastatin": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Routine lipid-lowering therapy is usually stopped/clarified in pregnancy; specialist-directed exceptions are uncommon." }
  ],
  "Finasteride": [
    { type: "pregnancy", label: "Pregnancy unsafe handling", note: "Pregnant clients should not handle crushed or broken tablets because male fetal genital development can be affected." }
  ],
  "Misoprostol": [
    { type: "pregnancy", label: "Pregnancy context alert", note: "Can cause uterine contractions and pregnancy loss; ulcer-prevention use in pregnancy is a question-the-order cue." }
  ],
  "Sertraline": [
    { type: "pediatric", label: "Pediatric/young adult warning", note: "Boxed warning for suicidal thoughts/behaviors in pediatric and young adult patients." },
    { type: "geriatric", label: "Geriatric caution", note: "Watch hyponatremia/SIADH and falls." }
  ],
  "Bupropion": [
    { type: "pediatric", label: "Pediatric/young adult warning", note: "Antidepressant boxed warning for suicidal thoughts/behaviors in young patients." }
  ],
  "Haloperidol": [
    { type: "geriatric", label: "Geriatric caution", note: "Increased mortality warning in elderly clients with dementia-related psychosis; high EPS/fall risk." }
  ],
  "Lorazepam": [
    { type: "geriatric", label: "Geriatric high-risk", note: "Benzodiazepines increase delirium, falls, fractures, and respiratory depression risk." }
  ],
  "Ciprofloxacin": [
    { type: "pediatric", label: "Pediatric caution", note: "Avoid when safer options exist because tendon/joint and serious adverse effects can occur." },
    { type: "geriatric", label: "Geriatric caution", note: "Higher tendon rupture, CNS, QT, and aortic risk in susceptible older adults." }
  ],
  "Ceftriaxone": [
    { type: "pediatric", label: "Neonate warning", note: "Avoid in hyperbilirubinemic neonates and with neonatal IV calcium products." }
  ],
  "Metronidazole": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Use depends on trimester/indication; clarify if early pregnancy." }
  ],
  "Trimethoprim-sulfamethoxazole": [
    { type: "pregnancy", label: "Pregnancy caution", note: "Folate antagonism and near-term kernicterus concerns require review." },
    { type: "pediatric", label: "Pediatric unsafe under 2 months", note: "Avoid in infants under 2 months." },
    { type: "geriatric", label: "Geriatric caution", note: "Higher hyperkalemia, renal, and warfarin interaction risk." }
  ],
  "Ondansetron": [
    { type: "geriatric", label: "Geriatric caution", note: "QT risk increases with electrolyte problems and other QT-prolonging drugs." }
  ],
  "Famotidine": [
    { type: "geriatric", label: "Geriatric caution", note: "Renal impairment can increase confusion/CNS adverse effects." }
  ],
  "Methotrexate": [
    { type: "pregnancy", label: "Pregnancy unsafe", note: "Embryo-fetal toxicity. Avoid pregnancy and breastfeeding." },
    { type: "geriatric", label: "Geriatric caution", note: "Renal decline increases marrow, liver, and mucosal toxicity risk." }
  ],
  "Alteplase": [
    { type: "geriatric", label: "Geriatric caution", note: "Bleeding risk is higher; protocol screening is critical." }
  ],
  "Tramadol": [
    { type: "pediatric", label: "Pediatric unsafe", note: "Avoid in children under 12 and post-tonsillectomy/adenoidectomy under 18." },
    { type: "geriatric", label: "Geriatric caution", note: "Higher sedation, falls, seizures, hyponatremia, and respiratory depression risk." }
  ]
};

window.ANI_PHARM_DATABASE.populationRiskLegend = [
  { type: "pregnancy", label: "Pregnancy/maternity unsafe or high-caution", icon: "assets/risk-pregnancy.png" },
  { type: "pediatric", label: "Pediatric/baby unsafe or high-caution", icon: "assets/risk-pediatric.png" },
  { type: "geriatric", label: "Geriatric/older adult unsafe or high-caution", icon: "assets/risk-geriatric.png" }
];

window.ANI_PHARM_DATABASE.drugs.forEach((drug) => {
  const contraindications = aniPharmContraindicationNotes[drug.name] || aniPharmContraindicationNotes[drug.generic] || [];
  drug.contraindications = contraindications.length
    ? contraindications
    : ["Known hypersensitivity; verify the current label and facility policy for condition-specific contraindications."];
  drug.populationRisks = aniPharmPopulationRiskNotes[drug.name] || [];
});
