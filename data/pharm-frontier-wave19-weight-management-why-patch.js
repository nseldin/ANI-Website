/* eslint-disable */
/* Weight-management pharmacology with explicit claim-to-rationale closure. */
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

  const populationRisks = (pediatric, older, pregnancy) => [
    { type: "pediatric", label: "Pediatric caution", note: pediatric },
    { type: "geriatric", label: "Older adult caution", note: older },
    { type: "pregnancy", label: "Pregnancy and lactation", note: pregnancy }
  ];

  const updates = new Map(Object.entries({
    "chronic weight management medication comparison": {
      class: "Mechanism, duration, response-checkpoint, and safety comparison for obesity pharmacotherapy",
      classPathway: ["Endocrine pharmacology", "Weight-management medications", "Mechanism and continuation comparison"],
      usedToTreat: "Adjunctive treatment of obesity, or overweight with a qualifying comorbidity, when medication-specific age, BMI, indication, and safety criteria are met. Medication is paired with nutrition, activity, sleep, behavioral, and secondary-cause care because obesity is a chronic biologic disease rather than a brief failure of willpower.",
      description: "Weight-management drugs act at different physiologic bottlenecks. Phentermine raises norepinephrine-dominant appetite and arousal signaling. Orlistat prevents intestinal lipases from digesting some meal triglyceride. Bupropion activates hypothalamic POMC satiety neurons while naltrexone blocks beta-endorphin feedback that would turn those neurons down. Phentermine/topiramate combines catecholamine signaling with topiramate-related GABA, glutamate, sodium-channel, and carbonic-anhydrase effects. GLP-1 or dual GIP/GLP-1 agonists engage pancreas-gut-brain incretin pathways. These mechanisms predict very different cardiovascular, GI, neurologic, nutritional, pregnancy, and interaction risks, so the drugs are not interchangeable appetite pills.",
      mechanism: "Obesity physiology defends stored energy through hypothalamic hunger signals, mesolimbic reward, gastric and intestinal signaling, adipose endocrine signals, sleep, medicines, and environmental pressure. Effective chronic pharmacotherapy changes one or more of those signals; when it is stopped, the underlying biology can return, which explains why weight regain is common and why chronic treatment is not evidence of personal failure. Product response checkpoints exist because early nonresponse predicts a low chance of durable benefit while adverse effects and cost continue. A checkpoint therefore asks whether benefit justifies continued exposure; it is not a date on which toxicity suddenly begins.",
      boxedWarning: "Warning logic is drug-specific. Naltrexone/bupropion carries antidepressant suicidality boxed-warning language because it contains bupropion. Semaglutide, liraglutide, and tirzepatide carry thyroid C-cell tumor warnings because rodent exposure caused C-cell tumors, although human relevance remains unknown. Phentermine/topiramate requires strict pregnancy prevention because first-trimester topiramate exposure increases oral-cleft and fetal-growth risk. Phentermine monotherapy has no boxed warning, but short historical trials, tolerance, sympathetic cardiovascular effects, and misuse potential explain its few-weeks label.",
      adverseEffects: [
        "Mechanism-specific GI effects, insomnia, blood-pressure or pulse change, mood or cognitive effects, gallbladder disease, dehydration, nutrient deficiency, kidney stones, or hypoglycemia with diabetes therapy",
        "Weight regain after an effective chronic drug is stopped because appetite and energy-balance signals re-emerge",
        "Pregnancy harm from intentional weight loss, with additional drug-specific embryofetal risks"
      ],
      contraindications: [
        "Avoid intentional weight-loss pharmacotherapy in pregnancy because maternal weight loss offers no pregnancy benefit and inadequate nutrient or drug exposure may harm fetal growth.",
        "Do not combine or duplicate weight products casually because overlapping phentermine, bupropion, topiramate, semaglutide, tirzepatide, stimulant, opioid-antagonist, or incretin exposure can amplify toxicity without established added benefit.",
        "Screen cardiovascular disease, seizure and eating-disorder history, opioid exposure, glaucoma, hyperthyroidism, MTC/MEN 2, malabsorption, renal or hepatic disease, gastroparesis, and interacting medicines because each mechanism has a different exclusion pathway."
      ],
      nursingEssentials: [
        "Track percentage weight change, waist or comorbidity response, function, blood pressure, pulse, nutrition, mood, adverse effects, adherence, and the exact product checkpoint because scale change alone cannot establish net clinical benefit.",
        "Reassess ineffective or poorly tolerated therapy because continuing exposure without meaningful benefit worsens the benefit-risk ratio; maintain effective chronic therapy when appropriate because the treated energy-balance biology often returns after withdrawal."
      ],
      interactions: [
        "Keep MAOIs outside product-specific separation intervals because combining them with phentermine or bupropion can produce dangerous catecholamine excess and hypertensive crisis.",
        "Avoid naltrexone-containing therapy during required opioid treatment because receptor blockade can precipitate withdrawal and prevent expected analgesia.",
        "Review oral-drug timing, fat absorption, CYP pathways, carbonic-anhydrase effects, and gastric emptying because orlistat, Contrave, Qsymia, and incretin products alter other medicines by different mechanisms."
      ],
      keyLabs: [
        "Measure weight, BMI, percentage response, waist or disease outcome at the product's decision point because the continuation threshold is evidence- and product-specific.",
        "Check blood pressure, pulse, glucose, renal and hepatic function, pregnancy status, bicarbonate, potassium, vitamins, mood, and hydration only as the selected mechanism requires because there is no single class-wide monitoring panel.",
        "Assess cardiometabolic disease, sleep apnea, medication contributors, eating pattern, food access, and disordered-eating risk because an untreated driver can make a seemingly correct drug plan ineffective or unsafe."
      ],
      nclexTraps: [
        "Do not apply phentermine monotherapy's few-weeks label to phentermine/topiramate ER because Qsymia is separately studied and labeled for chronic treatment.",
        "Do not call a response checkpoint a toxicity deadline because it marks low predicted benefit, not a biologic switch that makes every patient toxic that day.",
        "Do not treat faster weight loss as automatic success because pregnancy exposure, uncontrolled hypertension, pancreatitis, dehydration, malnutrition, severe mood change, or excessive lean-mass loss can outweigh scale benefit."
      ],
      sourceNote: "Current U.S. labeling for Phentermine, Qsymia, Xenical, Contrave, Saxenda, Wegovy, and Zepbound: https://dailymed.nlm.nih.gov/dailymed/",
      whyClosureRevision: "2026-07-17-weight-management"
    },

    "phentermine": {
      class: "Schedule IV sympathomimetic amine anorectic with predominantly noradrenergic appetite suppression",
      classPathway: ["Weight-management medication", "Sympathomimetic anorectic", "Noradrenergic appetite and arousal signaling", "FDA-labeled monotherapy duration pathway"],
      usedToTreat: "Short-term monotherapy, described by the U.S. label as a few weeks, as an adjunct to calorie restriction, activity, and behavior change for adults with obesity or qualifying overweight. The duration is short because the historical trials supporting approval were brief, tolerance commonly develops within weeks, and longer randomized monotherapy benefit-risk evidence remains limited.",
      description: "Phentermine is a Schedule IV stimulant-like sympathomimetic appetite suppressant, not a chronic incretin drug. It increases norepinephrine-dominant signaling in hypothalamic appetite and arousal networks, reducing hunger while also increasing sympathetic tone. Why short term? The historical trials supporting approval were short-duration, appetite tolerance commonly develops within weeks, and long-term controlled monotherapy benefit-risk evidence remains limited. There is no single exact maximum day count in the label; the often-cited 12-week boundary is a clinical convention, not a toxicity cliff. Continuing beyond the labeled few weeks is off-label and requires a deliberate benefit-risk decision because appetite tolerance can erase benefit while tachycardia, blood-pressure elevation, insomnia, ischemic risk, and misuse or dependence exposure continue. Do not confuse monotherapy with phentermine/topiramate extended release because Qsymia is a separately studied and labeled chronic combination product.",
      mechanism: "Phentermine is chemically and pharmacologically related to amphetamine. It promotes central catecholamine signaling, predominantly norepinephrine; amphetamine-class data support substrate-like interaction with the norepinephrine transporter (NET), cytosolic catecholamine accumulation, VMAT2-linked release processes, and outward monoamine transport, although the exact contribution of each target at therapeutic phentermine exposure is not fully defined. More hypothalamic norepinephrine suppresses hunger and increases wakefulness, while the same signal raises vascular tone, cardiac stimulation, restlessness, and insomnia. Repeated exposure can produce pharmacodynamic tolerance, so increasing the dose may restore stimulant toxicity more than durable appetite control. Prolonged high-dose misuse can produce dependence, and abrupt cessation after prolonged high doses can cause profound fatigue and depressed mood.",
      boxedWarning: "No current U.S. boxed warning. Discontinue and urgently evaluate new unexplained dyspnea, angina, syncope, reduced exercise tolerance, or leg edema because pulmonary hypertension or cardiac disease can be fatal if missed. Do not raise the dose when appetite suppression fades because labeling identifies tolerance as the reason to stop rather than intensify sympathomimetic exposure.",
      adverseEffects: [
        "Dry mouth, altered taste, constipation or diarrhea, and reduced appetite",
        "Insomnia, restlessness, tremor, anxiety, irritability, headache, and rare psychosis",
        "Tachycardia, palpitations, blood-pressure elevation, ischemic events, tolerance, misuse, and dependence",
        "Rare pulmonary-hypertension or valvular-disease reports that require symptom-triggered evaluation"
      ],
      contraindications: [
        "Avoid use in coronary disease, stroke, arrhythmia, heart failure, or uncontrolled hypertension because additional catecholamine-driven heart rate, contractility, and vascular tone can destabilize cardiovascular disease.",
        "Do not use in hyperthyroidism, glaucoma, marked agitation, pregnancy, nursing under current labeling, or a history of drug abuse because sympathomimetic stimulation or intentional weight loss can amplify the defining risk.",
        "Keep at least 14 days between an MAOI and phentermine because excessive monoamine signaling can cause hypertensive crisis."
      ],
      nursingEssentials: [
        "At every continuation decision, measure weight response, hunger and function, pulse, blood pressure, sleep, mood, and misuse or diversion because elapsed time alone cannot show whether benefit still exceeds ongoing stimulant risk.",
        "Teach prompt evaluation of dyspnea, chest pain, syncope, reduced exercise tolerance, or edema because these can be early clues to pulmonary hypertension, ischemia, or valvular disease rather than ordinary exercise discomfort."
      ],
      interactions: [
        "Avoid MAOIs within 14 days because combined monoamine excess can produce hypertensive crisis.",
        "Do not stack prescription, over-the-counter, or herbal weight-loss stimulants because combination safety is unestablished and sympathetic toxicity can add.",
        "Review decongestants, other sympathomimetics, alcohol, insulin, and glucose-lowering drugs because cardiovascular stimulation may add while improved intake or weight can lower glucose-treatment requirements."
      ],
      keyLabs: [
        "Measure weight, BMI, and meaningful percentage response because appetite sensation alone does not prove durable clinical benefit.",
        "Check blood pressure, pulse, cardiopulmonary symptoms, sleep, and mood because catecholamine effects can remain harmful even after anorectic tolerance develops.",
        "Assess pregnancy, renal function, substances, medication duplication, and misuse or diversion because these findings can change exposure, legality, or the benefit-risk decision."
      ],
      nclexTraps: [
        "Do not teach 12 weeks as an exact toxicity cliff because the U.S. monotherapy label says a few weeks and does not specify one universal maximum day count.",
        "Do not equate off-label continuation with automatic poisoning because risk accumulates through ongoing sympathetic exposure, tolerance, sleep disruption, and misuse potential rather than switching on at one date.",
        "Do not increase the dose when appetite effect fades because tolerance can reduce benefit while cardiovascular and neuropsychiatric exposure persists."
      ],
      populationRisks: populationRisks(
        "Do not extrapolate adult monotherapy labeling to children because broad pediatric safety and effectiveness are not established for this product.",
        "Use additional caution with renal decline, cardiovascular disease, insomnia, agitation, falls, or polypharmacy because reduced clearance and sympathetic effects can magnify harm.",
        "Avoid phentermine in pregnancy because intentional weight loss offers no fetal benefit; avoid nursing under current labeling because infant stimulant exposure and serious adverse effects are concerns."
      ),
      sourceNote: "Current U.S. phentermine labeling: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=737eef3b-9a6b-4ab3-a25c-49d84d2a0197",
      whyClosureRevision: "2026-07-17-weight-management"
    },

    "orlistat": {
      usedToTreat: "Long-term weight loss and maintenance with a reduced-calorie diet in patients meeting product-specific criteria. Take it during or within 1 hour after a fat-containing main meal because it must meet active gastric and pancreatic lipases while dietary triglyceride is present; omit the dose when the meal is skipped or contains no fat because there is no meal-fat substrate to block.",
      description: "Orlistat is a peripherally acting, nonstimulant lipase inhibitor that keeps some dietary triglyceride from being digested and absorbed. At prescription dosing, roughly one-quarter to one-third of meal fat remains in the lumen and exits in stool, which directly explains oily spotting, urgency, flatus with discharge, and leakage after high-fat meals. The same mechanism lowers absorption of vitamins A, D, E, K, beta-carotene, and selected drugs, so medication timing and nutritional replacement are part of the pharmacology.",
      mechanism: "In the stomach and small-intestinal lumen, orlistat forms a covalent bond with the active-site serine of gastric and pancreatic lipases. Inactivated lipase cannot hydrolyze triglyceride into absorbable free fatty acids and monoglycerides, so intact fat passes distally. Minimal systemic absorption explains why it lacks central stimulant effects, but luminal fat still changes the whole patient: fat-soluble vitamins and lipophilic medicines can be lost, gallstone risk can rise during weight loss, and unabsorbed fatty acids bind intestinal calcium, leaving more free oxalate available for absorption and urinary excretion. That enteric hyperoxaluria explains calcium-oxalate stones and rare oxalate nephropathy in susceptible patients.",
      boxedWarning: "No current U.S. boxed warning. Stop and evaluate jaundice, dark urine, severe pruritus, marked abdominal pain, or worsening renal function because rare severe liver injury, gallbladder disease, stones, and oxalate nephropathy can become serious. Review interacting medicines because reduced absorption can cause transplant rejection, thyroid instability, seizure breakthrough, altered anticoagulation, arrhythmia-treatment failure, or loss of virologic control.",
      contraindications: [
        "Do not use in chronic malabsorption syndrome because additional fat malabsorption worsens nutrient loss and GI effects.",
        "Do not use in cholestasis because bile delivery is already impaired and fat-soluble nutrient absorption is compromised.",
        "Avoid intentional weight-loss treatment in pregnancy because weight loss offers no pregnancy benefit and may compromise maternal-fetal nutrition."
      ],
      nursingEssentials: [
        "Give with a fat-containing main meal or within 1 hour because lipase inhibition only matters while meal triglyceride is in the lumen; omit a missed or fat-free meal dose because delayed dosing adds adverse effects without blocking that meal's fat.",
        "Separate a multivitamin containing A, D, E, K, and beta-carotene by at least 2 hours, often at bedtime, because simultaneous lipase blockade reduces absorption of those fat-soluble nutrients.",
        "Spread dietary fat across meals because concentrating fat in one meal increases the amount reaching the colon at once and intensifies oily leakage and urgency."
      ],
      interactions: [
        "Separate cyclosporine by at least 3 hours and monitor trough concentrations because orlistat can lower absorption enough to risk under-immunosuppression and graft injury.",
        "Separate levothyroxine by at least 4 hours and monitor thyroid function because reduced hormone absorption can produce hypothyroidism.",
        "Monitor INR, seizure control, HIV RNA, amiodarone effect, and other narrow-therapeutic-index outcomes when relevant because vitamin K or drug malabsorption can change anticoagulation or treatment exposure."
      ],
      keyLabs: [
        "Measure weight, BMI, waist, and comorbidity response because GI adverse effects without meaningful health benefit do not justify continued therapy.",
        "Check fat-soluble vitamins and nutritional status when duration or symptoms warrant because the drug intentionally reduces fat-associated absorption.",
        "Assess renal function, stone symptoms, liver symptoms, INR, TSH, cyclosporine level, seizure frequency, or HIV RNA as indicated because each reflects a known malabsorption or oxalate consequence."
      ],
      nclexTraps: [
        "Do not label oily stool an allergy because it is the expected mechanical consequence of undigested triglyceride reaching the colon.",
        "Do not give a fat-free-meal dose because lipase blockade has no useful substrate and only adds unnecessary exposure.",
        "Do not call a minimally absorbed drug systemically harmless because malabsorption and enteric oxalate handling can alter organs and essential medicines."
      ],
      populationRisks: populationRisks(
        "Use only within product-specific age criteria because growth and nutrient needs make chronic malabsorption more consequential in young patients.",
        "Use additional caution with frailty, CKD, stone history, anticoagulation, transplant therapy, thyroid replacement, or polypharmacy because nutritional and drug-exposure changes can cause disproportionate harm.",
        "Avoid during pregnancy because intentional weight loss has no benefit; review lactation carefully because infant nutrition and product guidance matter even with low maternal systemic absorption."
      ),
      sourceNote: "Current U.S. XENICAL labeling, updated January 2026: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6240792b-9224-2d10-e053-2a91aa0a2c3e",
      whyClosureRevision: "2026-07-17-weight-management"
    },

    "naltrexone bupropion": {
      usedToTreat: "Chronic weight management with reduced-calorie nutrition and activity in adults who meet product criteria. Evaluate response after 12 weeks at the maintenance dose and discontinue when baseline weight loss is under 5 percent because additional treatment is unlikely to produce and sustain clinically meaningful loss.",
      description: "Naltrexone/bupropion ER, sold as Contrave, combines an opioid antagonist with a norepinephrine-dopamine reuptake inhibitor. Bupropion activates hypothalamic POMC neurons, which release alpha-MSH to stimulate MC4R satiety pathways but also release beta-endorphin that feeds back through mu-opioid receptors and slows POMC firing. Naltrexone blocks that opioid feedback brake, sustaining the satiety signal, while both components influence reward circuits. The same components explain the major hazards: bupropion can raise blood pressure, lower seizure threshold, and alter mood; naltrexone can precipitate opioid withdrawal and block analgesia.",
      mechanism: "Bupropion inhibits norepinephrine and dopamine transporters, increasing catecholamine signaling in hypothalamic and mesolimbic networks. POMC activation releases alpha-MSH, which stimulates melanocortin-4 receptors, and beta-endorphin, which activates inhibitory mu-opioid autoreceptors. Naltrexone competitively blocks those receptors, reducing negative feedback and opioid-mediated reward reinforcement. Extended-release delivery and a 4-week titration reduce peak-related nausea and seizure risk. Tablets must remain intact because crushing destroys controlled release, and high-fat meals are avoided because they substantially raise component exposure and therefore seizure and adverse-effect risk.",
      boxedWarning: "BOXED WARNING: Monitor clinical worsening, suicidal thoughts, agitation, and abrupt behavior change because Contrave contains bupropion and carries antidepressant suicidality warning language, especially relevant to younger people. It is not approved for pediatric use or depression treatment. Also prevent dose-related seizure, uncontrolled hypertension, precipitated opioid withdrawal, blocked emergency analgesia, mania, angle-closure glaucoma, and liver injury because each follows a component's known pharmacology.",
      contraindications: [
        "Do not use with uncontrolled hypertension because bupropion's noradrenergic activity can further raise blood pressure and pulse.",
        "Do not use with seizure disorder, anorexia nervosa, bulimia, abrupt sedative or alcohol withdrawal, or another bupropion product because each increases seizure probability or duplicates the dose.",
        "Do not use during chronic opioid treatment, acute opioid withdrawal, or an inadequate opioid-free interval because naltrexone can precipitate severe withdrawal and block needed analgesia.",
        "Keep at least 14 days from an MAOI because combined monoamine effects can cause hypertensive reactions."
      ],
      nursingEssentials: [
        "Confirm prescribed and hidden opioid exposure, including tramadol, cough or diarrhea products, methadone, and buprenorphine, because naltrexone can abruptly displace agonists and complicate emergency pain control.",
        "Measure blood pressure, pulse, mood, sleep, seizure risk, and percentage weight response because cardiovascular or neuropsychiatric harm can outweigh scale benefit.",
        "Discontinue after 12 weeks at maintenance dose when weight loss is under 5 percent because continued meaningful response is unlikely, not because toxicity automatically begins that day."
      ],
      interactions: [
        "Do not attempt to override opioid blockade with high opioid doses because overdose can occur as naltrexone wanes and tolerance has fallen.",
        "Avoid high-fat meals because they increase naltrexone and bupropion exposure and thereby raise seizure and adverse-effect risk.",
        "Review CYP2B6 inhibitors or inducers, CYP2D6 substrates, dopaminergic drugs, and other seizure-threshold-lowering agents because bupropion can both be affected by and alter clinically important drug exposure."
      ],
      keyLabs: [
        "Measure weight, BMI, and percentage change at the labeled checkpoint because continuation depends on meaningful response rather than appetite sensation.",
        "Check blood pressure, pulse, glucose, renal and hepatic function because sympathetic effects, weight-related dose changes, and component clearance can alter safety.",
        "Assess suicidality, mania, seizure and eating-disorder history, medication duplication, and opioid-free status because these are direct exclusion or surveillance pathways."
      ],
      nclexTraps: [
        "Do not treat Contrave as an antidepressant or smoking-cessation regimen because its indication, dose, formulation, and risk-benefit framework are weight-management specific.",
        "Do not describe naltrexone as merely weakening opioids because it can precipitate withdrawal and prevent ordinary opioid analgesia.",
        "Do not call the 5-percent checkpoint a toxicity cliff because it is an evidence-based futility decision about low expected benefit."
      ],
      populationRisks: populationRisks(
        "Do not use in pediatric patients because safety and effectiveness are not established and the product is not approved for this population.",
        "Use additional caution with hypertension, seizure vulnerability, cognitive or mood disorder, renal or hepatic impairment, falls, and polypharmacy because both components can magnify those risks.",
        "Avoid in pregnancy because intentional weight loss offers no benefit; review lactation because bupropion metabolites and naltrexone exposure can reach the nursing infant."
      ),
      sourceNote: "Current U.S. CONTRAVE labeling, 2025: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=485ff360-32c8-11df-928b-0002a5d5c51b ; https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/200063s024s026lbl.pdf",
      whyClosureRevision: "2026-07-17-weight-management"
    },

    "phentermine topiramate": {
      classPathway: ["Weight-management medication", "Combination obesity pharmacotherapy", "Noradrenergic plus GABA-glutamate-carbonic-anhydrase pathways", "Chronic extended-release treatment pathway"],
      usedToTreat: "Long-term weight reduction and maintenance with nutrition and activity in label-specified adults and adolescents. Unlike phentermine monotherapy, Qsymia is a separately studied chronic product; its dose checkpoints exist because early response predicts whether further exposure is likely to provide meaningful benefit.",
      description: "Phentermine/topiramate ER, sold as Qsymia, combines immediate-release phentermine's norepinephrine-dominant appetite suppression with extended-release topiramate's incompletely defined appetite and reward effects involving GABA-A enhancement, AMPA/kainate inhibition, sodium channels, and carbonic anhydrase. Adults are reassessed after 12 weeks at 7.5/46 mg because under 3 percent loss predicts inadequate response and leads to escalation or discontinuation. After 12 weeks at 15/92 mg, under 5 percent loss leads to gradual discontinuation because meaningful sustained benefit is unlikely. The highest dose is tapered because abrupt topiramate withdrawal can precipitate seizure even without epilepsy.",
      mechanism: "Phentermine increases central norepinephrine-dominant signaling, reducing hunger while raising arousal, pulse, and blood pressure. Topiramate enhances GABA-A signaling, inhibits AMPA/kainate glutamate receptors, affects voltage-gated sodium channels, and inhibits carbonic anhydrase; the exact combination responsible for weight loss is not fully defined. Carbonic-anhydrase inhibition lowers bicarbonate and increases urine pH, which explains metabolic acidosis, hypokalemia, reduced sweating, and calcium-phosphate stone risk. Removing anticonvulsant activity abruptly can destabilize neuronal firing, which explains the required high-dose taper.",
      boxedWarning: "No current U.S. boxed warning, but Qsymia can cause fetal harm and uses a pregnancy-prevention REMS. Obtain a negative pregnancy test before treatment and monthly because oral clefts arise early in gestation, often before pregnancy is recognized. Evaluate sudden eye pain or vision change urgently because topiramate-associated ciliochoroidal effusion can cause acute myopia and angle closure with permanent vision risk.",
      contraindications: [
        "Do not use in pregnancy because first-trimester topiramate exposure increases oral-cleft and small-for-gestational-age risk.",
        "Do not use with glaucoma or hyperthyroidism because topiramate can trigger angle closure and phentermine can amplify adrenergic effects.",
        "Keep at least 14 days from an MAOI because phentermine-related catecholamine excess can produce hypertensive crisis."
      ],
      nursingEssentials: [
        "Track the exact strength and percentage response after 12 weeks because 7.5/46 mg and 15/92 mg have different escalation or discontinuation decisions.",
        "Taper 15/92 mg every other day for at least 1 week because abrupt topiramate withdrawal can precipitate seizure.",
        "Obtain pregnancy testing before therapy and monthly because teratogenic oral-cleft risk begins early; assess bicarbonate, potassium, creatinine, pulse, mood, cognition, vision, hydration, stones, and sweating because component mechanisms predict these toxicities."
      ],
      interactions: [
        "Avoid MAOIs within 14 days because combined catecholamine signaling can cause hypertensive crisis.",
        "Review other carbonic-anhydrase inhibitors and ketogenic diets because additive acidosis and alkaline urine increase stone risk.",
        "Review non-potassium-sparing diuretics, CNS depressants, and contraceptive bleeding changes because hypokalemia, cognitive impairment, and confusing breakthrough bleeding can complicate safe use."
      ],
      keyLabs: [
        "Measure weight and percentage change at each dose checkpoint because continuation depends on dose-specific response.",
        "Check pregnancy before treatment and monthly because early fetal exposure can occur before symptoms or a missed period prompt recognition.",
        "Monitor bicarbonate, potassium, creatinine, pulse, blood pressure, mood, cognition, eyes, hydration, sweating, and stone symptoms because phentermine and topiramate create distinct cardiovascular, neurologic, ocular, and acid-base risks."
      ],
      nclexTraps: [
        "Do not apply phentermine monotherapy's few-weeks label to Qsymia because the combination is separately labeled for chronic treatment.",
        "Do not stop 15/92 mg abruptly because removing topiramate anticonvulsant activity can precipitate seizure.",
        "Do not dismiss irregular bleeding as proof of contraceptive failure, but continue monthly testing because fetal risk remains and bleeding can obscure pregnancy recognition."
      ],
      populationRisks: populationRisks(
        "Use adolescent BMI-response rules rather than adult percentage rules because pediatric labeling defines a different continuation framework; monitor growth, mood, cognition, bicarbonate, heat illness, and pregnancy risk because developing patients have distinct vulnerabilities.",
        "Use additional caution with renal decline, cognitive impairment, falls, glaucoma, stones, acidosis, or cardiovascular disease because component clearance and target effects can magnify harm.",
        "Do not use in pregnancy because topiramate increases oral-cleft and fetal-growth risk; review breastfeeding because both components can expose the infant."
      ),
      sourceNote: "Current U.S. QSYMIA labeling, updated March 2026: https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=40dd5602-53da-45ac-bb4b-15789aba40f9&version=41",
      whyClosureRevision: "2026-07-17-weight-management"
    },

    "semaglutide": {
      usedToTreat: "Product-specific type 2 diabetes, cardiovascular or kidney risk reduction, chronic weight management, and other formulation-specific indications. Verify the exact product because Ozempic, Wegovy, and oral semaglutide formulations use different doses, devices, absorption rules, and approved purposes and are not milligram-for-milligram substitutes.",
      description: "Semaglutide is a long-acting GLP-1 receptor agonist that coordinates pancreas, gut, and brain signaling: it amplifies glucose-dependent insulin secretion, suppresses inappropriate glucagon during hyperglycemia, slows early gastric delivery, and increases satiety. It is chronic therapy because it modifies active energy-balance signaling rather than permanently removing the biology of obesity; appetite and weight regain commonly emerge after effective treatment stops. Slow escalation improves tolerability because nausea and gastric slowing are strongest during initiation and dose increases.",
      mechanism: "Semaglutide is an incretin-mimetic, modified GLP-1 analog engineered to resist DPP-4 degradation and bind albumin. GLP-1 receptor activation raises beta-cell cAMP, PKA, and Epac signaling, amplifying glucose-triggered calcium-dependent insulin exocytosis; glucose dependence explains low intrinsic hypoglycemia risk. It lowers alpha-cell glucagon during hyperglycemia, reduces hepatic glucose output, slows gastric emptying, and activates hypothalamic and hindbrain satiety circuits. Albumin binding produces an approximately week-long half-life, which explains weekly injection, prolonged adverse effects, and the 2-month preconception washout.",
      boxedWarning: "BOXED WARNING: Semaglutide caused thyroid C-cell tumors in rodents; human relevance is unknown. Do not use with personal or family medullary thyroid carcinoma or MEN 2 (MEN2) because the theoretical target-organ risk outweighs benefit in these populations. Evaluate persistent severe abdominal pain, repeated vomiting, dehydration, gallbladder symptoms, vision change, or peri-anesthesia aspiration risk because pancreatitis, AKI, cholecystitis, rapid-glucose-change retinopathy, and retained gastric contents can become serious.",
      contraindications: [
        "Do not use with personal or family medullary thyroid carcinoma or MEN 2 because rodent C-cell tumor findings create a labeled high-risk exclusion despite uncertain human relevance.",
        "Avoid duplicate semaglutide or concurrent GLP-1/tirzepatide therapy because overlapping incretin exposure increases adverse effects without established combination benefit.",
        "Do not use as treatment for DKA because glucose-dependent incretin signaling cannot replace the insulin required to stop ketogenesis."
      ],
      nursingEssentials: [
        "Verify brand, route, concentration, dose, escalation step, and indication because injectable and oral semaglutide products have different delivery and cannot be casually converted.",
        "Assess severe persistent abdominal pain, vomiting, hydration, urine output, gallbladder pain, vision change, neck symptoms, and procedure plans because each finding maps to pancreatitis, AKI, cholecystitis, retinopathy, C-cell warning symptoms, or aspiration risk.",
        "Track nutrition, function, lean-mass risk, and sustained clinical response because rapid scale loss can coexist with dehydration, sarcopenia, or malnutrition."
      ],
      interactions: [
        "Reduce insulin or secretagogue exposure when indicated because improved glucose control can make the previous dose excessive and cause hypoglycemia.",
        "Review oral-drug timing because delayed gastric emptying can alter absorption and oral semaglutide has formulation-specific fasting and water instructions.",
        "Inform the anesthesia or procedural team because retained gastric contents can persist despite usual fasting and create aspiration risk."
      ],
      keyLabs: [
        "Measure glucose, A1c, weight, nutrition, and functional response because benefit must be interpreted alongside hypoglycemia and lean-mass risk.",
        "Check hydration and renal function during significant GI illness because vomiting and diarrhea can produce prerenal kidney injury.",
        "Assess retinopathy when rapid glucose improvement or existing disease raises risk because abrupt glycemic change can transiently worsen retinal complications."
      ],
      nclexTraps: [
        "Do not call semaglutide insulin because it amplifies glucose-dependent signaling and cannot treat DKA.",
        "Do not assume every semaglutide brand has the same dose or indication because formulation and regulatory evidence differ.",
        "Do not rely on routine calcitonin screening to erase the boxed-warning history because its value is uncertain and symptom plus risk-history assessment remains necessary."
      ],
      populationRisks: populationRisks(
        "Use only within product-specific pediatric indications because age, dose, growth, nutrition, and behavioral monitoring differ by product.",
        "Use additional caution with frailty, sarcopenia, dehydration, gastroparesis, retinopathy, or polypharmacy because slower intake and gastric transit can cause disproportionate harm.",
        "Stop at least 2 months before planned pregnancy because the long half-life leaves clinically relevant drug exposure for weeks; avoid weight-loss use during pregnancy because weight loss provides no fetal benefit."
      ),
      sourceNote: "Current U.S. semaglutide labeling, including WEGOVY revised May 2026: https://www.dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=ee06186f-2aa3-4990-a760-757579d8f77b&type=pdf",
      whyClosureRevision: "2026-07-17-weight-management"
    },

    "liraglutide": {
      usedToTreat: "Victoza or generic liraglutide treats type 2 diabetes and product-specific cardiovascular risk; Saxenda treats chronic weight management under different age, BMI, dose, and response rules. Verify the product because the same molecule is used in noninterchangeable treatment plans.",
      description: "Liraglutide is a once-daily GLP-1 receptor agonist that amplifies glucose-dependent insulin, lowers glucagon during hyperglycemia, slows gastric delivery, and increases central satiety. Saxenda is escalated gradually because gastric and nausea effects are strongest before adaptation. Adults discontinue Saxenda when weight loss is under 4 percent at 16 weeks because further clinically meaningful and sustained loss is unlikely; that checkpoint is a futility rule, not a day when toxicity suddenly appears.",
      mechanism: "Liraglutide is an acylated GLP-1 analog that binds albumin and resists DPP-4 degradation. GLP-1 receptor activation raises beta-cell cAMP, PKA, and Epac signaling, amplifying glucose-triggered insulin exocytosis while reducing inappropriate glucagon. Gastric slowing and hypothalamic or hindbrain satiety reduce energy intake. Glucose dependence explains low monotherapy hypoglycemia risk, while albumin binding and self-association support daily rather than meal-by-meal dosing. Gradual titration allows GI adaptation and reduces treatment-limiting nausea.",
      boxedWarning: "BOXED WARNING: Liraglutide caused thyroid C-cell tumors in rodents; human relevance is unknown. Do not use with personal or family medullary thyroid carcinoma or MEN 2 (MEN2) because the labeled theoretical risk outweighs benefit. Evaluate severe persistent abdominal pain, vomiting, dehydration, gallbladder symptoms, sustained tachycardia, or procedure plans because pancreatitis, AKI, cholecystitis, heart-rate increase, and retained gastric contents can become serious.",
      contraindications: [
        "Do not use with personal or family medullary thyroid carcinoma or MEN 2 because of the labeled rodent C-cell tumor signal.",
        "Do not duplicate Victoza, Saxenda, generic liraglutide, or another GLP-1 pathway drug because overlapping exposure adds toxicity without established benefit.",
        "Do not use to treat type 1 diabetes or DKA because liraglutide cannot replace absent basal insulin or stop ketogenesis."
      ],
      nursingEssentials: [
        "Verify Victoza versus Saxenda, dose, indication, and titration because diabetes and obesity plans use the same molecule differently.",
        "Measure Saxenda response at 16 weeks and discontinue in adults below 4 percent weight loss because later sustained benefit is unlikely.",
        "Assess GI tolerance, hydration, renal function, pulse, gallbladder or pancreatitis symptoms, nutrition, and hypoglycemia from companion therapy because these risks follow gastric slowing, reduced intake, and glucose improvement."
      ],
      interactions: [
        "Reduce insulin or sulfonylurea when indicated because liraglutide-related glucose improvement can make the previous dose excessive.",
        "Review time-sensitive oral drugs because delayed gastric emptying may alter absorption.",
        "Avoid duplicate liraglutide or GLP-1 therapy because receptor overlap raises adverse effects without proven added efficacy."
      ],
      keyLabs: [
        "Measure A1c and glucose for diabetes or weight percentage at the Saxenda checkpoint because the outcome must match the product's indication.",
        "Check hydration and renal function during significant vomiting or diarrhea because volume loss can cause acute kidney injury.",
        "Assess pulse and symptom-triggered pancreatic or gallbladder studies because sustained tachycardia, pancreatitis, and cholecystitis require treatment reassessment."
      ],
      nclexTraps: [
        "Do not substitute Victoza and Saxenda doses because indication, target dose, and response rules differ despite an identical molecule.",
        "Do not call 16 weeks an automatic toxicity deadline because the 4-percent rule identifies low expected benefit.",
        "Do not assume low monotherapy hypoglycemia risk protects a patient whose insulin or sulfonylurea dose has become excessive."
      ],
      populationRisks: populationRisks(
        "Apply product-specific pediatric response rules because age, growth, nutrition, and dose frameworks differ from adults.",
        "Use additional caution with frailty, dehydration, renal reserve, gallbladder disease, gastroparesis, or sarcopenia because reduced intake and GI loss can cause disproportionate harm.",
        "Avoid intentional weight-loss treatment in pregnancy because it offers no fetal benefit; review diabetes treatment and lactation with maternal-fetal expertise because glucose control and infant exposure still matter."
      ),
      sourceNote: "Current U.S. SAXENDA labeling: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3946d389-0926-4f77-a708-0acb8153b143",
      whyClosureRevision: "2026-07-17-weight-management"
    },

    "tirzepatide": {
      usedToTreat: "Mounjaro treats type 2 diabetes; Zepbound treats chronic weight management and label-specified obesity-related obstructive sleep apnea. Verify the brand and indication because products, devices, and evidence-based outcomes are not interchangeable by assumption.",
      description: "Tirzepatide is a once-weekly dual GIP and GLP-1 receptor agonist that amplifies glucose-dependent insulin secretion, lowers glucagon during hyperglycemia, slows gastric delivery, increases satiety, and changes central and adipose energy signaling. Slow dose escalation limits GI intolerance because gastric slowing and nausea are strongest after initiation and dose increases. Chronic continuation may be needed because stopping receptor stimulation allows appetite and defended energy-balance signals to return, often producing weight regain.",
      mechanism: "Tirzepatide activates Gs-coupled GIP and GLP-1 receptors, raising adenylate cyclase, cAMP, PKA, and Epac signaling to amplify glucose-triggered beta-cell insulin exocytosis. GLP-1 activity suppresses glucagon during hyperglycemia, slows gastric emptying, and increases satiety; GIP activity further supports beta-cell responses and contributes central or adipose metabolic effects. Fatty-acid modification and albumin binding prolong exposure for weekly dosing. Gastric slowing is greatest after initial doses, which explains altered oral-contraceptive absorption around initiation and each escalation.",
      boxedWarning: "BOXED WARNING: Tirzepatide caused thyroid C-cell tumors in rats; human relevance is unknown. Do not use with personal or family medullary thyroid carcinoma or MEN 2 (MEN2) because the labeled theoretical risk outweighs benefit. Evaluate severe abdominal pain, persistent vomiting, dehydration, gallbladder symptoms, vision change, or procedure plans because pancreatitis, AKI, cholecystitis, retinopathy during rapid glucose change, and aspiration can become serious.",
      contraindications: [
        "Do not use with personal or family medullary thyroid carcinoma or MEN 2 because of the labeled rodent C-cell tumor signal.",
        "Do not combine Mounjaro, Zepbound, another tirzepatide product, or a GLP-1 agonist because duplicate incretin exposure adds toxicity without established benefit.",
        "Do not use to treat DKA because glucose-dependent incretin activity cannot replace the insulin needed to suppress ketogenesis."
      ],
      nursingEssentials: [
        "Verify brand, indication, dose, device, and escalation date because Mounjaro and Zepbound have different approved treatment frameworks.",
        "Use nonoral contraception or add a barrier for 4 weeks after initiation and 4 weeks after every dose escalation because delayed gastric emptying can reduce oral hormonal contraceptive exposure.",
        "Assess GI tolerance, hydration, renal function, nutrition, gallbladder or pancreatic symptoms, glucose therapy, vision, and procedure plans because each finding maps to a mechanism-linked complication."
      ],
      interactions: [
        "Use oral-contraceptive backup for 4 weeks after initiation and each escalation because gastric slowing can reduce contraceptive absorption during those transitions.",
        "Reduce insulin or secretagogue exposure when indicated because improved glucose control can make the previous dose excessive and cause hypoglycemia.",
        "Review narrow-therapeutic-index oral drugs and anesthesia plans because delayed gastric delivery can alter absorption and leave retained gastric contents despite fasting."
      ],
      keyLabs: [
        "Measure glucose, A1c, weight, functional response, and sleep-apnea outcome when relevant because benefit must match the product's actual indication.",
        "Check hydration and renal function during significant GI symptoms because vomiting and diarrhea can cause prerenal kidney injury.",
        "Assess pregnancy, contraception, retinal status, gallbladder or pancreatic symptoms, and procedure timing because these findings alter continuation and safety planning."
      ],
      nclexTraps: [
        "Do not call tirzepatide a pure GLP-1 agonist because it directly activates both GIP and GLP-1 receptors.",
        "Do not forget contraceptive backup after each dose increase because gastric-emptying effects recur during escalation.",
        "Do not improvise a universal preprocedure hold because aspiration planning depends on current symptoms, dose phase, procedure, and the treating or anesthesia team's risk assessment."
      ],
      populationRisks: populationRisks(
        "Use only within product-specific age and indication criteria because growth, nutrition, and dosing evidence differ by population.",
        "Use additional caution with frailty, dehydration, gastroparesis, retinopathy, gallbladder disease, sarcopenia, or polypharmacy because reduced intake and gastric slowing can magnify harm.",
        "Discontinue when pregnancy is recognized because weight loss offers no pregnancy benefit and animal data suggest fetal risk; review lactation by current product evidence because infant exposure and oral bioavailability matter."
      ),
      sourceNote: "Current U.S. ZEPBOUND labeling, updated April 2026: https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=487cd7e7-434c-4925-99fa-aa80b1cc776b&version=38",
      whyClosureRevision: "2026-07-17-weight-management"
    }
  }));

  let updatedCardCount = 0;
  db.drugs = db.drugs.map((card) => {
    const key = normalize(card && (card.generic || card.name || card.displayName));
    const update = updates.get(key);
    if (!update) return card;
    updatedCardCount += 1;
    return {
      ...card,
      ...update,
      tags: [
        "frontier-wave19",
        "strict why closure",
        "claim rationale consequence",
        ...(card.tags || []).filter((tag) => !/^frontier[- ]wave\d+$/i.test(String(tag || "")))
      ]
    };
  });

  db.frontierWave19WeightManagementWhy = {
    version: "2026-07-17-weight-management-strict-why",
    requestedCardCount: updates.size,
    updatedCardCount
  };
  db.version = [db.version, "pharm-frontier-wave19-weight-management-why"].filter(Boolean).join("+");
}());
